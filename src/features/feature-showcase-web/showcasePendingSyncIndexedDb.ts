const SHOWCASE_PENDING_SYNC_DB_NAME = 'ndjc_showcase_pending_sync'
const SHOWCASE_PENDING_SYNC_DB_VERSION = 1
const SHOWCASE_PENDING_SYNC_STORE_NAME = 'pending_sync_queue'
const SHOWCASE_PENDING_SYNC_SCHEMA_VERSION = 1

type ShowcasePendingSyncQueueRecord = {
  storeId: string
  operations: unknown[]
  updatedAt: number
  schemaVersion: number
}

function canUseIndexedDb(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined'
}

function normalizeStoreId(value: string): string {
  return String(value || '').trim() || 'default'
}

function openShowcasePendingSyncDb(): Promise<IDBDatabase | null> {
  if (!canUseIndexedDb()) return Promise.resolve(null)

  return new Promise(resolve => {
    const request = window.indexedDB.open(SHOWCASE_PENDING_SYNC_DB_NAME, SHOWCASE_PENDING_SYNC_DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result

      if (!db.objectStoreNames.contains(SHOWCASE_PENDING_SYNC_STORE_NAME)) {
        const store = db.createObjectStore(SHOWCASE_PENDING_SYNC_STORE_NAME, {
          keyPath: 'storeId'
        })

        store.createIndex('updatedAt', 'updatedAt', {
          unique: false
        })

        store.createIndex('schemaVersion', 'schemaVersion', {
          unique: false
        })
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

export async function loadShowcasePendingSyncQueue(storeIdInput: string): Promise<unknown[]> {
  const db = await openShowcasePendingSyncDb()

  if (!db) return []

  return await new Promise<unknown[]>(resolve => {
    const transaction = db.transaction(SHOWCASE_PENDING_SYNC_STORE_NAME, 'readonly')
    const store = transaction.objectStore(SHOWCASE_PENDING_SYNC_STORE_NAME)
    const request = store.get(normalizeStoreId(storeIdInput))

    request.onsuccess = () => {
      db.close()

      const result = request.result as ShowcasePendingSyncQueueRecord | undefined

      if (!result || !Array.isArray(result.operations)) {
        resolve([])
        return
      }

      resolve(result.operations)
    }

    request.onerror = () => {
      db.close()
      resolve([])
    }

    transaction.onerror = () => {
      db.close()
      resolve([])
    }

    transaction.onabort = () => {
      db.close()
      resolve([])
    }
  })
}

export async function saveShowcasePendingSyncQueue(
  storeIdInput: string,
  operations: unknown[]
): Promise<void> {
  const db = await openShowcasePendingSyncDb()

  if (!db) return

  await new Promise<void>(resolve => {
    const transaction = db.transaction(SHOWCASE_PENDING_SYNC_STORE_NAME, 'readwrite')
    const store = transaction.objectStore(SHOWCASE_PENDING_SYNC_STORE_NAME)
    const storeId = normalizeStoreId(storeIdInput)

    if (!operations.length) {
      store.delete(storeId)
    } else {
      const record: ShowcasePendingSyncQueueRecord = {
        storeId,
        operations,
        updatedAt: Date.now(),
        schemaVersion: SHOWCASE_PENDING_SYNC_SCHEMA_VERSION
      }

      store.put(record)
    }

    transaction.oncomplete = () => {
      db.close()
      resolve()
    }

    transaction.onerror = () => {
      db.close()
      resolve()
    }

    transaction.onabort = () => {
      db.close()
      resolve()
    }
  })
}