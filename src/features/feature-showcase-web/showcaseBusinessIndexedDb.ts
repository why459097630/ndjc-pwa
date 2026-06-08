type ShowcaseBusinessCacheKind =
  | 'dishes'
  | 'appointments'
  | 'announcements'
  | 'store-profile'

type ShowcaseBusinessCacheRecord<T = unknown> = {
  key: string
  storeId: string
  kind: ShowcaseBusinessCacheKind
  payload: T
  updatedAt: number
  expiresAt: number | null
  schemaVersion: number
}

type ShowcaseBusinessCacheLimits = {
  ttlMs: number | null
  maxRecordsPerKind: number
}

const SHOWCASE_BUSINESS_DB_NAME = 'ndjc_showcase_business_cache'
const SHOWCASE_BUSINESS_DB_VERSION = 2
const SHOWCASE_BUSINESS_STORE_NAME = 'business_cache'
const SHOWCASE_BUSINESS_SCHEMA_VERSION = 2
const SHOWCASE_BUSINESS_MAX_TOTAL_RECORDS = 160
const DAY_MS = 24 * 60 * 60 * 1000

const SHOWCASE_BUSINESS_CACHE_LIMITS: Record<ShowcaseBusinessCacheKind, ShowcaseBusinessCacheLimits> = {
  dishes: {
    ttlMs: 45 * DAY_MS,
    maxRecordsPerKind: 40
  },
  appointments: {
    ttlMs: 90 * DAY_MS,
    maxRecordsPerKind: 40
  },
  announcements: {
    ttlMs: 60 * DAY_MS,
    maxRecordsPerKind: 40
  },
  'store-profile': {
    ttlMs: 180 * DAY_MS,
    maxRecordsPerKind: 40
  }
}

function canUseIndexedDb(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined'
}

function normalizeStoreId(value: string): string {
  return String(value || '').trim() || 'default'
}

function normalizeBusinessCacheKind(value: unknown): ShowcaseBusinessCacheKind | null {
  const text = String(value || '').trim()

  if (text === 'dishes') return 'dishes'
  if (text === 'appointments') return 'appointments'
  if (text === 'announcements') return 'announcements'
  if (text === 'store-profile') return 'store-profile'

  return null
}

function businessCacheKey(storeId: string, kind: ShowcaseBusinessCacheKind): string {
  return `${normalizeStoreId(storeId)}:${kind}`
}

function businessCacheExpiresAt(kind: ShowcaseBusinessCacheKind, updatedAt: number): number | null {
  const ttlMs = SHOWCASE_BUSINESS_CACHE_LIMITS[kind]?.ttlMs ?? null

  if (!ttlMs) return null

  return updatedAt + ttlMs
}

function isBusinessCacheRecordExpired(record: ShowcaseBusinessCacheRecord, now: number): boolean {
  if (!record.expiresAt) return false

  return record.expiresAt <= now
}

function ensureBusinessCacheIndexes(store: IDBObjectStore): void {
  if (!store.indexNames.contains('storeId')) {
    store.createIndex('storeId', 'storeId', {
      unique: false
    })
  }

  if (!store.indexNames.contains('kind')) {
    store.createIndex('kind', 'kind', {
      unique: false
    })
  }

  if (!store.indexNames.contains('updatedAt')) {
    store.createIndex('updatedAt', 'updatedAt', {
      unique: false
    })
  }

  if (!store.indexNames.contains('expiresAt')) {
    store.createIndex('expiresAt', 'expiresAt', {
      unique: false
    })
  }

  if (!store.indexNames.contains('schemaVersion')) {
    store.createIndex('schemaVersion', 'schemaVersion', {
      unique: false
    })
  }
}

function migrateBusinessCacheRecord(raw: unknown): ShowcaseBusinessCacheRecord | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null

  const record = raw as Record<string, unknown>
  const storeId = normalizeStoreId(String(record.storeId || ''))
  const kind = normalizeBusinessCacheKind(record.kind)
  const updatedAt = Number(record.updatedAt || Date.now())
  const key = String(record.key || '').trim() || (kind ? businessCacheKey(storeId, kind) : '')

  if (!key || !kind) return null

  return {
    key,
    storeId,
    kind,
    payload: record.payload,
    updatedAt: Number.isFinite(updatedAt) ? updatedAt : Date.now(),
    expiresAt: record.expiresAt && Number.isFinite(Number(record.expiresAt))
      ? Number(record.expiresAt)
      : businessCacheExpiresAt(kind, Number.isFinite(updatedAt) ? updatedAt : Date.now()),
    schemaVersion: SHOWCASE_BUSINESS_SCHEMA_VERSION
  }
}

function openShowcaseBusinessDb(): Promise<IDBDatabase | null> {
  if (!canUseIndexedDb()) return Promise.resolve(null)

  return new Promise(resolve => {
    const request = window.indexedDB.open(SHOWCASE_BUSINESS_DB_NAME, SHOWCASE_BUSINESS_DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      const transaction = request.transaction

      if (!db.objectStoreNames.contains(SHOWCASE_BUSINESS_STORE_NAME)) {
        const store = db.createObjectStore(SHOWCASE_BUSINESS_STORE_NAME, {
          keyPath: 'key'
        })

        ensureBusinessCacheIndexes(store)
        return
      }

      if (!transaction) return

      const store = transaction.objectStore(SHOWCASE_BUSINESS_STORE_NAME)
      ensureBusinessCacheIndexes(store)

      const cursorRequest = store.openCursor()

      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result

        if (!cursor) return

        const migrated = migrateBusinessCacheRecord(cursor.value)

        if (migrated) {
          cursor.update(migrated)
        } else {
          cursor.delete()
        }

        cursor.continue()
      }
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      resolve(null)
    }

    request.onblocked = () => {
      resolve(null)
    }
  })
}

async function readAllBusinessCacheRecords(db: IDBDatabase): Promise<ShowcaseBusinessCacheRecord[]> {
  return await new Promise(resolve => {
    const transaction = db.transaction(SHOWCASE_BUSINESS_STORE_NAME, 'readonly')
    const store = transaction.objectStore(SHOWCASE_BUSINESS_STORE_NAME)
    const request = store.getAll()

    request.onsuccess = () => {
      const records = Array.isArray(request.result)
        ? request.result
            .map(migrateBusinessCacheRecord)
            .filter((item): item is ShowcaseBusinessCacheRecord => Boolean(item))
        : []

      resolve(records)
    }

    request.onerror = () => {
      resolve([])
    }

    transaction.onerror = () => {
      resolve([])
    }

    transaction.onabort = () => {
      resolve([])
    }
  })
}

async function deleteBusinessCacheRecords(db: IDBDatabase, keys: string[]): Promise<void> {
  const uniqueKeys = Array.from(new Set(keys.filter(Boolean)))

  if (!uniqueKeys.length) return

  await new Promise<void>(resolve => {
    const transaction = db.transaction(SHOWCASE_BUSINESS_STORE_NAME, 'readwrite')
    const store = transaction.objectStore(SHOWCASE_BUSINESS_STORE_NAME)

    uniqueKeys.forEach(key => {
      store.delete(key)
    })

    transaction.oncomplete = () => {
      resolve()
    }

    transaction.onerror = () => {
      resolve()
    }

    transaction.onabort = () => {
      resolve()
    }
  })
}

function collectExpiredBusinessCacheKeys(
  records: ShowcaseBusinessCacheRecord[],
  now: number
): string[] {
  return records
    .filter(record => isBusinessCacheRecordExpired(record, now))
    .map(record => record.key)
}

function collectOverflowBusinessCacheKeys(records: ShowcaseBusinessCacheRecord[]): string[] {
  const keys: string[] = []
  const byKind = new Map<ShowcaseBusinessCacheKind, ShowcaseBusinessCacheRecord[]>()

  records.forEach(record => {
    const group = byKind.get(record.kind) || []
    group.push(record)
    byKind.set(record.kind, group)
  })

  byKind.forEach((group, kind) => {
    const maxRecords = SHOWCASE_BUSINESS_CACHE_LIMITS[kind]?.maxRecordsPerKind || 40
    const sorted = [...group].sort((left, right) => {
      return right.updatedAt - left.updatedAt
    })

    sorted.slice(maxRecords).forEach(record => {
      keys.push(record.key)
    })
  })

  const totalSorted = [...records].sort((left, right) => {
    return right.updatedAt - left.updatedAt
  })

  totalSorted.slice(SHOWCASE_BUSINESS_MAX_TOTAL_RECORDS).forEach(record => {
    keys.push(record.key)
  })

  return keys
}

export async function cleanupShowcaseBusinessCache(storeIdInput?: string): Promise<void> {
  const db = await openShowcaseBusinessDb()

  if (!db) return

  try {
    const now = Date.now()
    const records = await readAllBusinessCacheRecords(db)
    const storeId = storeIdInput ? normalizeStoreId(storeIdInput) : ''
    const scopedRecords = storeId
      ? records.filter(record => record.storeId === storeId)
      : records

    const expiredKeys = collectExpiredBusinessCacheKeys(scopedRecords, now)
    const overflowKeys = collectOverflowBusinessCacheKeys(records)

    await deleteBusinessCacheRecords(db, [
      ...expiredKeys,
      ...overflowKeys
    ])
  } finally {
    db.close()
  }
}

export async function saveShowcaseBusinessCache<T>(
  storeId: string,
  kind: ShowcaseBusinessCacheKind,
  payload: T
): Promise<void> {
  const db = await openShowcaseBusinessDb()

  if (!db) return

  try {
    await new Promise<void>(resolve => {
      const transaction = db.transaction(SHOWCASE_BUSINESS_STORE_NAME, 'readwrite')
      const store = transaction.objectStore(SHOWCASE_BUSINESS_STORE_NAME)
      const key = businessCacheKey(storeId, kind)
      const updatedAt = Date.now()
      const record: ShowcaseBusinessCacheRecord<T> = {
        key,
        storeId: normalizeStoreId(storeId),
        kind,
        payload,
        updatedAt,
        expiresAt: businessCacheExpiresAt(kind, updatedAt),
        schemaVersion: SHOWCASE_BUSINESS_SCHEMA_VERSION
      }

      store.put(record)

      transaction.oncomplete = () => {
        resolve()
      }

      transaction.onerror = () => {
        resolve()
      }

      transaction.onabort = () => {
        resolve()
      }
    })

    await cleanupShowcaseBusinessCache(storeId)
  } finally {
    db.close()
  }
}

export async function loadShowcaseBusinessCache<T>(
  storeId: string,
  kind: ShowcaseBusinessCacheKind,
  fallback: T
): Promise<T> {
  const db = await openShowcaseBusinessDb()

  if (!db) return fallback

  try {
    return await new Promise<T>(resolve => {
      const transaction = db.transaction(SHOWCASE_BUSINESS_STORE_NAME, 'readonly')
      const store = transaction.objectStore(SHOWCASE_BUSINESS_STORE_NAME)
      const request = store.get(businessCacheKey(storeId, kind))

      request.onsuccess = () => {
        const result = migrateBusinessCacheRecord(request.result)

        if (!result || result.payload == null || isBusinessCacheRecordExpired(result, Date.now())) {
          resolve(fallback)
          return
        }

        resolve(result.payload as T)
      }

      request.onerror = () => {
        resolve(fallback)
      }

      transaction.onerror = () => {
        resolve(fallback)
      }

      transaction.onabort = () => {
        resolve(fallback)
      }
    })
  } finally {
    db.close()
  }
}