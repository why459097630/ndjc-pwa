export type ShowcaseChatLocalStatus = 'sending' | 'sent' | 'failed'

export type ShowcaseChatLocalDirection = 'in' | 'out'

export type ChatMessageEntity = {
  id: string
  storeId: string
  role: string
  direction: ShowcaseChatLocalDirection
  text: string
  timeMs: number
  status: ShowcaseChatLocalStatus
  isRead: boolean
  conversationId: string
  clientId: string
}

export type ChatThreadMetaEntity = {
  storeId: string
  conversationId: string
  pinnedAtMs: number
  isDeleted: boolean
  deletedAtMs: number
  alias: string | null
  customerSeq: number | null
}

export type ChatLocalDbSnapshot = {
  count: number
  latest: ChatMessageEntity | null
}

export type ChatLocalUnsubscribe = () => void

export const SHOWCASE_CHAT_DB_VERSION = 10

const SHOWCASE_CHAT_DB_NAME = 'showcase_chat_db'
const SHOWCASE_CHAT_MESSAGES_KEY = `${SHOWCASE_CHAT_DB_NAME}_chat_messages`
const SHOWCASE_CHAT_THREAD_META_KEY = `${SHOWCASE_CHAT_DB_NAME}_chat_thread_meta`
const SHOWCASE_CHAT_MESSAGES_STORE = 'chat_messages'
const SHOWCASE_CHAT_THREAD_META_STORE = 'chat_thread_meta'
const CHAT_IMAGE_PAYLOAD_MARKER = '⟪I⟫'
const CHAT_STRUCTURED_PAYLOAD_PATTERN = /⟪[A-Z]⟫[\s\S]*?⟪\/[A-Z]⟫/g
const CHAT_LOCAL_MAX_MESSAGES_PER_CONVERSATION = 1000
const CHAT_LOCAL_MAX_MESSAGES_PER_STORE = 10000

function canUseIndexedDb(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return typeof window.indexedDB !== 'undefined'
  } catch {
    return false
  }
}

function canUseStorage(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

function readLegacyJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback

    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function removeLegacyJson(key: string): void {
  if (!canUseStorage()) return

  try {
    window.localStorage.removeItem(key)
  } catch {
    // legacy cleanup is best effort
  }
}

function normalizeStatus(value: unknown): ShowcaseChatLocalStatus {
  const text = String(value ?? '').trim().toLowerCase()

  if (text === 'sending' || text === 'sent' || text === 'failed') {
    return text as ShowcaseChatLocalStatus
  }

  return 'sent'
}

function normalizeDirection(value: unknown): ShowcaseChatLocalDirection {
  const text = String(value ?? '').trim().toLowerCase()

  if (text === 'out') return 'out'

  return 'in'
}

function normalizeNullableString(value: unknown): string | null {
  const text = String(value ?? '').trim()

  if (!text || text.toLowerCase() === 'null') return null

  return text
}

function normalizeMessageEntity(input: Partial<ChatMessageEntity> | null | undefined): ChatMessageEntity | null {
  if (!input) return null

  const id = String(input.id || '').trim()
  const storeId = String(input.storeId || '').trim()
  const conversationId = String(input.conversationId || '').trim()

  if (!id || !storeId || !conversationId) return null

  const timeMs = Number(input.timeMs)

  return {
    id,
    storeId,
    role: String(input.role || 'client').trim() || 'client',
    direction: normalizeDirection(input.direction),
    text: String(input.text || ''),
    timeMs: Number.isFinite(timeMs) && timeMs > 0 ? timeMs : Date.now(),
    status: normalizeStatus(input.status),
    isRead: Boolean(input.isRead),
    conversationId,
    clientId: String(input.clientId || '').trim()
  }
}

function isSameChatMessageIdentity(
  left: Pick<ChatMessageEntity, 'storeId' | 'id'>,
  right: Pick<ChatMessageEntity, 'storeId' | 'id'>
): boolean {
  return (
    String(left.storeId || '').trim() === String(right.storeId || '').trim() &&
    String(left.id || '').trim() === String(right.id || '').trim()
  )
}

function normalizeThreadMetaEntity(input: Partial<ChatThreadMetaEntity> | null | undefined): ChatThreadMetaEntity | null {
  if (!input) return null

  const storeId = String(input.storeId || '').trim()
  const conversationId = String(input.conversationId || '').trim()

  if (!storeId || !conversationId) return null

  const pinnedAtMs = Number(input.pinnedAtMs)
  const deletedAtMs = Number(input.deletedAtMs)
  const customerSeq = Number(input.customerSeq)

  return {
    storeId,
    conversationId,
    pinnedAtMs: Number.isFinite(pinnedAtMs) && pinnedAtMs > 0 ? pinnedAtMs : 0,
    isDeleted: Boolean(input.isDeleted),
    deletedAtMs: Number.isFinite(deletedAtMs) && deletedAtMs > 0 ? deletedAtMs : 0,
    alias: normalizeNullableString(input.alias),
    customerSeq: Number.isFinite(customerSeq) && customerSeq > 0 ? Math.trunc(customerSeq) : null
  }
}

function sortMessagesAsc(items: ChatMessageEntity[]): ChatMessageEntity[] {
  return [...items].sort((a, b) => {
    const byTime = Number(a.timeMs || 0) - Number(b.timeMs || 0)
    if (byTime !== 0) return byTime

    return a.id.localeCompare(b.id)
  })
}

function sortMessagesDesc(items: ChatMessageEntity[]): ChatMessageEntity[] {
  return [...items].sort((a, b) => {
    const byTime = Number(b.timeMs || 0) - Number(a.timeMs || 0)
    if (byTime !== 0) return byTime

    return b.id.localeCompare(a.id)
  })
}

function extractPlainTextFromChatText(value: string): string {
  return String(value || '')
    .replace(CHAT_STRUCTURED_PAYLOAD_PATTERN, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function includesPlainTextKeyword(value: string, keyword: string): boolean {
  const k = keyword.trim().toLowerCase()
  if (!k) return false

  const plainText = extractPlainTextFromChatText(value)
  if (!plainText) return false

  return plainText.toLowerCase().includes(k)
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result)
    }
    request.onerror = () => {
      reject(request.error || new Error('IndexedDB request failed.'))
    }
  })
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onabort = () => {
      reject(transaction.error || new Error('IndexedDB transaction aborted.'))
    }
    transaction.onerror = () => {
      reject(transaction.error || new Error('IndexedDB transaction failed.'))
    }
  })
}

function createChatIndexedDb(): Promise<IDBDatabase | null> {
  if (!canUseIndexedDb()) return Promise.resolve(null)

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(SHOWCASE_CHAT_DB_NAME, SHOWCASE_CHAT_DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      const transaction = request.transaction

      let messagesStore: IDBObjectStore

      if (db.objectStoreNames.contains(SHOWCASE_CHAT_MESSAGES_STORE) && transaction) {
        const existingMessagesStore = transaction.objectStore(SHOWCASE_CHAT_MESSAGES_STORE)
        const keyPath = existingMessagesStore.keyPath
        const isStoreScopedMessageKey = (
          Array.isArray(keyPath) &&
          keyPath.length === 2 &&
          keyPath[0] === 'storeId' &&
          keyPath[1] === 'id'
        )

        if (isStoreScopedMessageKey) {
          messagesStore = existingMessagesStore
        } else {
          db.deleteObjectStore(SHOWCASE_CHAT_MESSAGES_STORE)
          messagesStore = db.createObjectStore(SHOWCASE_CHAT_MESSAGES_STORE, {
            keyPath: ['storeId', 'id']
          })
        }
      } else {
        messagesStore = db.createObjectStore(SHOWCASE_CHAT_MESSAGES_STORE, {
          keyPath: ['storeId', 'id']
        })
      }

      if (!messagesStore.indexNames.contains('conversationId')) {
        messagesStore.createIndex('conversationId', 'conversationId', {
          unique: false
        })
      }

      if (!messagesStore.indexNames.contains('storeId')) {
        messagesStore.createIndex('storeId', 'storeId', {
          unique: false
        })
      }

      if (!messagesStore.indexNames.contains('messageId')) {
        messagesStore.createIndex('messageId', 'id', {
          unique: false
        })
      }

      if (!messagesStore.indexNames.contains('conversationTime')) {
        messagesStore.createIndex('conversationTime', ['conversationId', 'timeMs'], {
          unique: false
        })
      }

      if (!messagesStore.indexNames.contains('storeConversationTime')) {
        messagesStore.createIndex('storeConversationTime', ['storeId', 'conversationId', 'timeMs'], {
          unique: false
        })
      }

      let metasStore: IDBObjectStore

      if (db.objectStoreNames.contains(SHOWCASE_CHAT_THREAD_META_STORE) && transaction) {
        metasStore = transaction.objectStore(SHOWCASE_CHAT_THREAD_META_STORE)
      } else {
        metasStore = db.createObjectStore(SHOWCASE_CHAT_THREAD_META_STORE, {
          keyPath: ['storeId', 'conversationId']
        })
      }

      if (!metasStore.indexNames.contains('storeId')) {
        metasStore.createIndex('storeId', 'storeId', {
          unique: false
        })
      }

      if (!metasStore.indexNames.contains('conversationId')) {
        metasStore.createIndex('conversationId', 'conversationId', {
          unique: false
        })
      }
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error || new Error('IndexedDB open failed.'))
    }

    request.onblocked = () => {
      reject(new Error('IndexedDB open blocked.'))
    }
  })
}

async function readAllFromStore<T>(db: IDBDatabase, storeName: string): Promise<T[]> {
  const transaction = db.transaction(storeName, 'readonly')
  const store = transaction.objectStore(storeName)
  const result = await requestToPromise<T[]>(store.getAll())
  await transactionDone(transaction)

  return Array.isArray(result) ? result : []
}

async function clearAndPutAll<T>(db: IDBDatabase, storeName: string, items: T[]): Promise<void> {
  const transaction = db.transaction(storeName, 'readwrite')
  const store = transaction.objectStore(storeName)

  store.clear()

  items.forEach(item => {
    store.put(item)
  })

  await transactionDone(transaction)
}

async function putOneToStore<T>(db: IDBDatabase, storeName: string, item: T): Promise<void> {
  const transaction = db.transaction(storeName, 'readwrite')
  const store = transaction.objectStore(storeName)

  store.put(item)

  await transactionDone(transaction)
}

async function deleteOneFromStore(db: IDBDatabase, storeName: string, key: IDBValidKey): Promise<void> {
  const transaction = db.transaction(storeName, 'readwrite')
  const store = transaction.objectStore(storeName)

  store.delete(key)

  await transactionDone(transaction)
}

async function deleteManyFromStore(db: IDBDatabase, storeName: string, keys: IDBValidKey[]): Promise<void> {
  if (!keys.length) return

  const transaction = db.transaction(storeName, 'readwrite')
  const store = transaction.objectStore(storeName)

  keys.forEach(key => {
    store.delete(key)
  })

  await transactionDone(transaction)
}

async function deleteMessagesByStoreScopedIds(
  db: IDBDatabase,
  storeIdInput: string,
  idsInput: string[]
): Promise<void> {
  const storeId = String(storeIdInput || '').trim()
  const ids = new Set(idsInput.map(id => String(id || '').trim()).filter(Boolean))

  if (!storeId || !ids.size) return

  const transaction = db.transaction(SHOWCASE_CHAT_MESSAGES_STORE, 'readwrite')
  const store = transaction.objectStore(SHOWCASE_CHAT_MESSAGES_STORE)
  const index = store.index('storeId')
  const cursorRequest = index.openCursor(IDBKeyRange.only(storeId))

  await new Promise<void>((resolve, reject) => {
    cursorRequest.onerror = () => {
      reject(cursorRequest.error || new Error('Failed to delete store scoped chat messages.'))
    }

    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result

      if (!cursor) {
        resolve()
        return
      }

      const value = cursor.value as ChatMessageEntity | null

      if (value && ids.has(String(value.id || '').trim())) {
        cursor.delete()
      }

      cursor.continue()
    }
  })

  await transactionDone(transaction)
}

async function getOneFromStore<T>(db: IDBDatabase, storeName: string, key: IDBValidKey): Promise<T | null> {
  const transaction = db.transaction(storeName, 'readonly')
  const store = transaction.objectStore(storeName)
  const result = await requestToPromise<T | undefined>(store.get(key))
  await transactionDone(transaction)

  return result || null
}

async function collectCursorValues<T>(
  cursorRequest: IDBRequest<IDBCursorWithValue | null>,
  limitInput: number
): Promise<T[]> {
  const limit = Math.max(1, Math.trunc(Number(limitInput) || 1))

  return new Promise((resolve, reject) => {
    const items: T[] = []

    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result

      if (!cursor || items.length >= limit) {
        resolve(items)
        return
      }

      items.push(cursor.value as T)
      cursor.continue()
    }

    cursorRequest.onerror = () => {
      reject(cursorRequest.error || new Error('IndexedDB cursor failed.'))
    }
  })
}

async function listMessagesByConversationCursor(input: {
  db: IDBDatabase
  storeId: string
  conversationId: string
  lowerTimeMs: number
  upperTimeMs: number
  lowerOpen: boolean
  upperOpen: boolean
  direction: IDBCursorDirection
  limit: number
}): Promise<ChatMessageEntity[]> {
  const storeId = String(input.storeId || '').trim()
  const conversationId = String(input.conversationId || '').trim()
  const lowerTimeMs = Math.max(0, Math.trunc(Number(input.lowerTimeMs) || 0))
  const upperTimeMs = Math.max(0, Math.trunc(Number(input.upperTimeMs) || 0))
  const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || 1), 500))

  if (!storeId || !conversationId || upperTimeMs <= 0 || lowerTimeMs > upperTimeMs) return []

  const transaction = input.db.transaction(SHOWCASE_CHAT_MESSAGES_STORE, 'readonly')
  const store = transaction.objectStore(SHOWCASE_CHAT_MESSAGES_STORE)
  const index = store.index('storeConversationTime')
  const range = IDBKeyRange.bound(
    [storeId, conversationId, lowerTimeMs],
    [storeId, conversationId, upperTimeMs],
    input.lowerOpen,
    input.upperOpen
  )
  const result = await collectCursorValues<ChatMessageEntity>(
    index.openCursor(range, input.direction),
    limit
  )
  await transactionDone(transaction)

  return result
    .map(item => normalizeMessageEntity(item))
    .filter((item): item is ChatMessageEntity => Boolean(item))
}

async function listMessagesByStoreCursor(input: {
  db: IDBDatabase
  storeId: string
  direction: IDBCursorDirection
  limit: number
}): Promise<ChatMessageEntity[]> {
  const storeId = String(input.storeId || '').trim()
  const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || 1), 50000))

  if (!storeId) return []

  const transaction = input.db.transaction(SHOWCASE_CHAT_MESSAGES_STORE, 'readonly')
  const store = transaction.objectStore(SHOWCASE_CHAT_MESSAGES_STORE)
  const index = store.index('storeId')
  const result = await collectCursorValues<ChatMessageEntity>(
    index.openCursor(IDBKeyRange.only(storeId), input.direction),
    limit
  )
  await transactionDone(transaction)

  return result
    .map(item => normalizeMessageEntity(item))
    .filter((item): item is ChatMessageEntity => Boolean(item))
}

export class ShowcaseChatLocalDb {
  private messageListeners = new Set<() => void>()
  private metaListeners = new Set<() => void>()
  private dbPromise: Promise<IDBDatabase | null> | null = null
  private readyPromise: Promise<void> | null = null
  private persistMessagesPromise: Promise<void> = Promise.resolve()
  private persistMetasPromise: Promise<void> = Promise.resolve()
  private messageCache: ChatMessageEntity[] = []
  private metaCache: ChatThreadMetaEntity[] = []
  private isReady = false

  constructor() {
    this.bootstrapFromLegacyStorage()
    void this.ensureReady()
  }

  private bootstrapFromLegacyStorage(): void {
    this.messageCache = readLegacyJson<ChatMessageEntity[]>(SHOWCASE_CHAT_MESSAGES_KEY, [])
      .map(item => normalizeMessageEntity(item))
      .filter((item): item is ChatMessageEntity => Boolean(item))

    this.metaCache = readLegacyJson<ChatThreadMetaEntity[]>(SHOWCASE_CHAT_THREAD_META_KEY, [])
      .map(item => normalizeThreadMetaEntity(item))
      .filter((item): item is ChatThreadMetaEntity => Boolean(item))
  }

  private async openDb(): Promise<IDBDatabase | null> {
    if (!this.dbPromise) {
      this.dbPromise = createChatIndexedDb().catch(() => null)
    }

    return this.dbPromise
  }

  private async ensureReady(): Promise<void> {
    if (this.readyPromise) return this.readyPromise

    this.readyPromise = this.openDb()
      .then(async db => {
        if (!db) {
          this.isReady = true
          return
        }

        if (this.messageCache.length > 0) {
          await clearAndPutAll(db, SHOWCASE_CHAT_MESSAGES_STORE, this.messageCache)
          removeLegacyJson(SHOWCASE_CHAT_MESSAGES_KEY)
        }

        if (this.metaCache.length > 0) {
          await clearAndPutAll(db, SHOWCASE_CHAT_THREAD_META_STORE, this.metaCache)
          removeLegacyJson(SHOWCASE_CHAT_THREAD_META_KEY)
        }

        this.isReady = true
      })
      .catch(() => {
        this.isReady = true
      })

    return this.readyPromise
  }

  private readMessages(): ChatMessageEntity[] {
    return this.messageCache
      .map(item => normalizeMessageEntity(item))
      .filter((item): item is ChatMessageEntity => Boolean(item))
  }

  private writeMessages(items: ChatMessageEntity[]): void {
    const latestById = new Map<string, ChatMessageEntity>()

    this.messageCache.forEach(item => {
      latestById.set(item.id, item)
    })

    items
      .map(item => normalizeMessageEntity(item))
      .filter((item): item is ChatMessageEntity => Boolean(item))
      .forEach(item => {
        latestById.set(item.id, item)
      })

    this.messageCache = Array.from(latestById.values())

    void this.ensureReady()
      .then(() => this.openDb())
      .then(async db => {
        if (!db) return

        const normalizedItems = Array.from(latestById.values())
        for (const item of normalizedItems) {
          await putOneToStore(db, SHOWCASE_CHAT_MESSAGES_STORE, item)
        }
      })
      .then(() => {
        this.notifyMessagesChanged()
      })
      .catch(() => undefined)

    this.notifyMessagesChanged()
  }

  private readMetas(): ChatThreadMetaEntity[] {
    return this.metaCache
      .map(item => normalizeThreadMetaEntity(item))
      .filter((item): item is ChatThreadMetaEntity => Boolean(item))
  }

  private writeMetas(items: ChatThreadMetaEntity[]): void {
    const latestByKey = new Map<string, ChatThreadMetaEntity>()

    items
      .map(item => normalizeThreadMetaEntity(item))
      .filter((item): item is ChatThreadMetaEntity => Boolean(item))
      .forEach(item => {
        latestByKey.set(`${item.storeId}:${item.conversationId}`, item)
      })

    this.metaCache = Array.from(latestByKey.values())
    this.persistMetas()
    this.notifyMetasChanged()
  }

  private persistMessages(): void {
    const items = this.readMessages()

    this.persistMessagesPromise = this.persistMessagesPromise
      .catch(() => undefined)
      .then(async () => {
        await this.ensureReady()
        const db = await this.openDb()
        if (!db) return

        for (const item of items) {
          await putOneToStore(db, SHOWCASE_CHAT_MESSAGES_STORE, item)
        }
      })
      .catch(() => undefined)
  }

  private persistMetas(): void {
    const items = this.readMetas()

    this.persistMetasPromise = this.persistMetasPromise
      .catch(() => undefined)
      .then(async () => {
        await this.ensureReady()
        const db = await this.openDb()
        if (!db) return

        await clearAndPutAll(db, SHOWCASE_CHAT_THREAD_META_STORE, items)
      })
      .catch(() => undefined)
  }

  private notifyMessagesChanged(): void {
    this.messageListeners.forEach(listener => {
      try {
        listener()
      } catch {
        // observer callback is best effort
      }
    })
  }

  private notifyMetasChanged(): void {
    this.metaListeners.forEach(listener => {
      try {
        listener()
      } catch {
        // observer callback is best effort
      }
    })
  }

  subscribeMessages(listener: () => void): ChatLocalUnsubscribe {
    this.messageListeners.add(listener)

    return () => {
      this.messageListeners.delete(listener)
    }
  }

  subscribeMetas(listener: () => void): ChatLocalUnsubscribe {
    this.metaListeners.add(listener)

    return () => {
      this.metaListeners.delete(listener)
    }
  }

  readMessagesSync(): ChatMessageEntity[] {
    return this.readMessages()
  }

  writeMessagesSync(items: ChatMessageEntity[]): void {
    items.forEach(item => {
      this.upsertSync(item)
    })
  }

  readThreadMetasSync(): ChatThreadMetaEntity[] {
    return this.readMetas()
  }

  writeThreadMetasSync(items: ChatThreadMetaEntity[]): void {
    this.writeMetas(items)
  }

  async listLatestByConversation(
    storeIdInput: string,
    conversationIdInput: string,
    limitInput = 30
  ): Promise<ChatMessageEntity[]> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    const limit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || 30), 300))

    if (!storeId || !conversationId) return []

    const db = await this.openDb()

    if (!db) {
      return sortMessagesDesc(this.readMessages().filter(item => (
        item.storeId === storeId &&
        item.conversationId === conversationId
      )))
        .slice(0, limit)
        .sort((left, right) => {
          const byTime = Number(left.timeMs || 0) - Number(right.timeMs || 0)
          if (byTime !== 0) return byTime
          return left.id.localeCompare(right.id)
        })
    }

    const result = await listMessagesByConversationCursor({
      db,
      storeId,
      conversationId,
      lowerTimeMs: 0,
      upperTimeMs: Number.MAX_SAFE_INTEGER,
      lowerOpen: false,
      upperOpen: false,
      direction: 'prev',
      limit
    })

    result.forEach(entity => {
      this.messageCache = [
        ...this.messageCache.filter(item => !isSameChatMessageIdentity(item, entity)),
        entity
      ]
    })

    return sortMessagesAsc(result)
  }

  async listByConversation(
    storeIdInput: string,
    conversationIdInput: string
  ): Promise<ChatMessageEntity[]> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    if (!storeId || !conversationId) return []

    const db = await this.openDb()

    if (!db) {
      return sortMessagesAsc(this.readMessages().filter(item => (
        item.storeId === storeId &&
        item.conversationId === conversationId
      )))
    }

    const result = await listMessagesByConversationCursor({
      db,
      storeId,
      conversationId,
      lowerTimeMs: 0,
      upperTimeMs: Number.MAX_SAFE_INTEGER,
      lowerOpen: false,
      upperOpen: false,
      direction: 'next',
      limit: 5000
    })

    result.forEach(entity => {
      this.messageCache = [
        ...this.messageCache.filter(item => !isSameChatMessageIdentity(item, entity)),
        entity
      ]
    })

    return sortMessagesAsc(result)
  }

  async findByConversationMessageId(
    storeIdInput: string,
    conversationIdInput: string,
    messageIdInput: string
  ): Promise<ChatMessageEntity | null> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    const messageId = messageIdInput.trim()

    if (!storeId || !conversationId || !messageId) return null

    const entity = await this.findById(storeId, messageId)

    if (!entity || entity.conversationId !== conversationId) return null

    return entity
  }

  async listAroundConversationMessage(
    storeIdInput: string,
    conversationIdInput: string,
    messageIdInput: string,
    beforeLimitInput = 15,
    afterLimitInput = 15
  ): Promise<ChatMessageEntity[]> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    const messageId = messageIdInput.trim()
    const beforeLimit = Math.max(0, Math.min(Math.trunc(Number(beforeLimitInput) || 15), 100))
    const afterLimit = Math.max(0, Math.min(Math.trunc(Number(afterLimitInput) || 15), 100))

    if (!storeId || !conversationId || !messageId) return []

    const target = await this.findByConversationMessageId(storeId, conversationId, messageId)

    if (!target) return []

    const older = beforeLimit > 0
      ? await this.listBeforeTimeByConversation(storeId, conversationId, Number(target.timeMs || 0), beforeLimit)
      : []

    const newer = afterLimit > 0
      ? await this.listAfterTimeByConversation(storeId, conversationId, Number(target.timeMs || 0), afterLimit)
      : []

    return sortMessagesAsc([...older, target, ...newer])
  }

  async listBeforeTimeByConversation(
    storeIdInput: string,
    conversationIdInput: string,
    beforeTimeMsInput: number,
    limitInput = 30
  ): Promise<ChatMessageEntity[]> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    const beforeTimeMs = Number(beforeTimeMsInput || 0)
    const limit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || 30), 300))

    if (!storeId || !conversationId || !Number.isFinite(beforeTimeMs) || beforeTimeMs <= 0) return []

    const db = await this.openDb()

    if (!db) {
      return sortMessagesDesc(this.readMessages().filter(item => (
        item.storeId === storeId &&
        item.conversationId === conversationId &&
        Number(item.timeMs || 0) < beforeTimeMs
      )))
        .slice(0, limit)
        .sort((left, right) => {
          const byTime = Number(left.timeMs || 0) - Number(right.timeMs || 0)
          if (byTime !== 0) return byTime
          return left.id.localeCompare(right.id)
        })
    }

    const result = await listMessagesByConversationCursor({
      db,
      storeId,
      conversationId,
      lowerTimeMs: 0,
      upperTimeMs: Math.trunc(beforeTimeMs),
      lowerOpen: false,
      upperOpen: true,
      direction: 'prev',
      limit
    })

    result.forEach(entity => {
      this.messageCache = [
        ...this.messageCache.filter(item => !isSameChatMessageIdentity(item, entity)),
        entity
      ]
    })

    return sortMessagesAsc(result)
  }

  async listAfterTimeByConversation(
    storeIdInput: string,
    conversationIdInput: string,
    afterTimeMsInput: number,
    limitInput = 30
  ): Promise<ChatMessageEntity[]> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    const afterTimeMs = Number(afterTimeMsInput || 0)
    const limit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || 30), 300))

    if (!storeId || !conversationId || !Number.isFinite(afterTimeMs) || afterTimeMs <= 0) return []

    const db = await this.openDb()

    if (!db) {
      return sortMessagesAsc(this.readMessages().filter(item => (
        item.storeId === storeId &&
        item.conversationId === conversationId &&
        Number(item.timeMs || 0) > afterTimeMs
      ))).slice(0, limit)
    }

    const result = await listMessagesByConversationCursor({
      db,
      storeId,
      conversationId,
      lowerTimeMs: Math.trunc(afterTimeMs),
      upperTimeMs: Number.MAX_SAFE_INTEGER,
      lowerOpen: true,
      upperOpen: false,
      direction: 'next',
      limit
    })

    result.forEach(entity => {
      this.messageCache = [
        ...this.messageCache.filter(item => !isSameChatMessageIdentity(item, entity)),
        entity
      ]
    })

    return sortMessagesAsc(result)
  }

  async searchByConversationKeyword(
    storeIdInput: string,
    conversationIdInput: string,
    keywordInput: string,
    limitInput = 80
  ): Promise<ChatMessageEntity[]> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    const keyword = keywordInput.trim()
    const limit = Math.max(1, Math.trunc(Number(limitInput) || 80))

    if (!storeId || !conversationId || !keyword) return []

    return sortMessagesDesc(this.readMessages().filter(item => (
      item.storeId === storeId &&
      item.conversationId === conversationId &&
      includesPlainTextKeyword(item.text, keyword)
    ))).slice(0, limit)
  }

  async listMediaByConversation(
    storeIdInput: string,
    conversationIdInput: string,
    limitInput = 80,
    maxScanInput = 500
  ): Promise<ChatMessageEntity[]> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    const limit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || 80), 200))
    const maxScan = Math.max(limit, Math.min(Math.trunc(Number(maxScanInput) || 500), 3000))

    if (!storeId || !conversationId) return []

    const recentMessages = sortMessagesDesc(this.readMessages().filter(item => (
      item.storeId === storeId &&
      item.conversationId === conversationId
    )))
      .slice(0, maxScan)

    return recentMessages
      .filter(item => item.text.includes(CHAT_IMAGE_PAYLOAD_MARKER))
      .slice(0, limit)
  }

  async observeByConversation(
    storeIdInput: string,
    conversationIdInput: string,
    listener: (items: ChatMessageEntity[]) => void
  ): Promise<ChatLocalUnsubscribe> {
    const emit = async () => {
      listener(await this.listByConversation(storeIdInput, conversationIdInput))
    }

    await emit()

    return this.subscribeMessages(() => {
      void emit()
    })
  }

  async observeUnread(
    storeIdInput: string,
    conversationIdInput: string,
    listener: (count: number) => void
  ): Promise<ChatLocalUnsubscribe> {
    const emit = async () => {
      listener(await this.countUnread(storeIdInput, conversationIdInput))
    }

    await emit()

    return this.subscribeMessages(() => {
      void emit()
    })
  }

  upsertSync(entityInput: ChatMessageEntity): void {
    const entity = normalizeMessageEntity(entityInput)
    if (!entity) return

    this.messageCache = [
      ...this.messageCache.filter(item => !isSameChatMessageIdentity(item, entity)),
      entity
    ]

    void this.ensureReady()
      .then(() => this.openDb())
      .then(db => {
        if (!db) return

        return putOneToStore(db, SHOWCASE_CHAT_MESSAGES_STORE, entity)
      })
      .then(() => {
        this.notifyMessagesChanged()
      })
      .catch(() => undefined)

    this.notifyMessagesChanged()
  }

  async upsert(entityInput: ChatMessageEntity): Promise<void> {
    await this.ensureReady()

    const entity = normalizeMessageEntity(entityInput)
    if (!entity) return

    this.messageCache = [
      ...this.messageCache.filter(item => !isSameChatMessageIdentity(item, entity)),
      entity
    ]

    const db = await this.openDb()
    if (db) {
      await putOneToStore(db, SHOWCASE_CHAT_MESSAGES_STORE, entity)
    }

    this.notifyMessagesChanged()
  }

  async countAll(): Promise<number> {
    await this.ensureReady()

    return this.readMessages().length
  }

  async latest(): Promise<ChatMessageEntity | null> {
    await this.ensureReady()

    return sortMessagesDesc(this.readMessages())[0] || null
  }

  async findById(storeIdInput: string, idInput: string): Promise<ChatMessageEntity | null> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const id = idInput.trim()
    if (!storeId || !id) return null

    const cached = this.messageCache.find(item => item.storeId === storeId && item.id === id)
    if (cached) return normalizeMessageEntity(cached)

    const db = await this.openDb()
    if (!db) return null

    const entity = normalizeMessageEntity(
      await getOneFromStore<ChatMessageEntity>(db, SHOWCASE_CHAT_MESSAGES_STORE, [storeId, id])
    )

    if (!entity) return null

    this.messageCache = [
      ...this.messageCache.filter(item => !isSameChatMessageIdentity(item, entity)),
      entity
    ]

    return entity
  }

  async updateStatus(storeIdInput: string, idInput: string, statusInput: string): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const id = idInput.trim()
    if (!storeId || !id) return

    const status = normalizeStatus(statusInput)
    const entity = await this.findById(storeId, id)

    if (!entity) return

    await this.upsert({
      ...entity,
      status
    })
  }

  async updateStatusByIds(storeIdInput: string, idsInput: string[], statusInput: string): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const ids = Array.from(new Set(idsInput.map(id => id.trim()).filter(Boolean)))
    if (!storeId || !ids.length) return

    const status = normalizeStatus(statusInput)
    const entities = await Promise.all(ids.map(id => this.findById(storeId, id)))
    const updated = entities
      .filter((item): item is ChatMessageEntity => Boolean(item))
      .map(item => ({
        ...item,
        status
      }))

    if (!updated.length) return

    for (const item of updated) {
      await this.upsert(item)
    }
  }

  async clearStore(storeIdInput: string): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    if (!storeId) return

    const messages = await this.listByStore(storeId)
    const ids = messages.map(item => item.id.trim()).filter(Boolean)

    if (!ids.length) return

    await this.deleteByIds(storeId, ids)
  }

  async markAllRead(storeIdInput: string, conversationIdInput: string): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    if (!storeId || !conversationId) return

    const messages = await this.listByConversation(storeId, conversationId)
    const updated = messages
      .filter(item => item.role === 'client' && !item.isRead)
      .map(item => ({
        ...item,
        isRead: true
      }))

    for (const item of updated) {
      await this.upsert(item)
    }
  }

  async markAllOutgoingRead(storeIdInput: string, conversationIdInput: string): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    if (!storeId || !conversationId) return

    const messages = await this.listByConversation(storeId, conversationId)
    const updated = messages
      .filter(item => item.direction === 'out' && !item.isRead)
      .map(item => ({
        ...item,
        isRead: true
      }))

    for (const item of updated) {
      await this.upsert(item)
    }
  }

  async markMerchantMessagesRead(storeIdInput: string, conversationIdInput: string): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    if (!storeId || !conversationId) return

    const messages = await this.listByConversation(storeId, conversationId)
    const updated = messages
      .filter(item => item.role === 'merchant' && !item.isRead)
      .map(item => ({
        ...item,
        isRead: true
      }))

    for (const item of updated) {
      await this.upsert(item)
    }
  }

  async markMerchantMessagesReadByStoreAndClient(
    storeIdInput: string,
    clientIdInput: string
  ): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const clientId = clientIdInput.trim()

    if (!storeId || !clientId) return

    const messages = await this.listByStore(storeId)
    const updated = messages
      .filter(item => item.clientId === clientId && item.role === 'merchant' && !item.isRead)
      .map(item => ({
        ...item,
        isRead: true
      }))

    for (const item of updated) {
      await this.upsert(item)
    }
  }

  async countUnread(storeIdInput: string, conversationIdInput: string): Promise<number> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    if (!storeId || !conversationId) return 0

    return this.readMessages().filter(item => (
      item.storeId === storeId &&
      item.conversationId === conversationId &&
      item.role === 'client' &&
      !item.isRead
    )).length
  }

  async countUnreadForUserEntry(storeIdInput: string, conversationIdInput: string): Promise<number> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    if (!storeId || !conversationId) return 0

    return this.readMessages().filter(item => (
      item.storeId === storeId &&
      item.conversationId === conversationId &&
      item.role === 'merchant' &&
      !item.isRead
    )).length
  }

  async findLatestConversationIdByStoreAndClient(
    storeIdInput: string,
    clientIdInput: string
  ): Promise<string | null> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const clientId = clientIdInput.trim()

    if (!storeId || !clientId) return null

    const latest = sortMessagesDesc(this.readMessages().filter(item => (
      item.storeId === storeId &&
      item.clientId === clientId
    )))[0]

    return latest?.conversationId || null
  }

  async countUnreadForUserEntryByStoreAndClient(
    storeIdInput: string,
    clientIdInput: string
  ): Promise<number> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const clientId = clientIdInput.trim()

    if (!storeId || !clientId) return 0

    return this.readMessages().filter(item => (
      item.storeId === storeId &&
      item.clientId === clientId &&
      item.role === 'merchant' &&
      !item.isRead
    )).length
  }

  async listByStore(storeIdInput: string): Promise<ChatMessageEntity[]> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    if (!storeId) return []

    const db = await this.openDb()

    if (!db) {
      return sortMessagesAsc(this.readMessages().filter(item => item.storeId === storeId))
    }

    const result = await listMessagesByStoreCursor({
      db,
      storeId,
      direction: 'next',
      limit: 50000
    })

    result.forEach(entity => {
      this.messageCache = [
        ...this.messageCache.filter(item => !isSameChatMessageIdentity(item, entity)),
        entity
      ]
    })

    return sortMessagesAsc(result)
  }

  async observeByStore(
    storeIdInput: string,
    listener: (items: ChatMessageEntity[]) => void
  ): Promise<ChatLocalUnsubscribe> {
    const emit = async () => {
      listener(await this.listByStore(storeIdInput))
    }

    await emit()

    return this.subscribeMessages(() => {
      void emit()
    })
  }

  async deleteByIds(storeIdInput: string, idsInput: string[]): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const ids = Array.from(new Set((idsInput || []).map(id => id.trim()).filter(Boolean)))

    if (!storeId || !ids.length) return

    this.messageCache = this.messageCache.filter(item => !(item.storeId === storeId && ids.includes(item.id)))

    const db = await this.openDb()
    if (db) {
      await deleteMessagesByStoreScopedIds(db, storeId, ids)
    }

    this.notifyMessagesChanged()
  }

  async deleteById(storeIdInput: string, idInput: string): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const id = idInput.trim()
    if (!storeId || !id) return

    await this.deleteByIds(storeId, [id])
  }

  async deleteByConversation(storeIdInput: string, conversationIdInput: string): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    if (!storeId || !conversationId) return

    const messages = await this.listByConversation(storeId, conversationId)
    const ids = messages.map(item => item.id.trim()).filter(Boolean)

    if (!ids.length) return

    await this.deleteByIds(storeId, ids)
  }

  async searchByStoreKeyword(
    storeIdInput: string,
    keywordInput: string,
    limitInput = 80,
    maxScanInput = 300
  ): Promise<ChatMessageEntity[]> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const keyword = keywordInput.trim()
    const limit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || 80), 200))
    const maxScan = Math.max(limit, Math.min(Math.trunc(Number(maxScanInput) || 300), 2000))

    if (!storeId || !keyword) return []

    const recentMessages = sortMessagesDesc(this.readMessages().filter(item => item.storeId === storeId))
      .slice(0, maxScan)

    return recentMessages
      .filter(item => includesPlainTextKeyword(item.text, keyword))
      .slice(0, limit)
  }

  async listMediaByStore(
    storeIdInput: string,
    limitInput = 80,
    maxScanInput = 500
  ): Promise<ChatMessageEntity[]> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const limit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || 80), 200))
    const maxScan = Math.max(limit, Math.min(Math.trunc(Number(maxScanInput) || 500), 3000))

    if (!storeId) return []

    const recentMessages = sortMessagesDesc(this.readMessages().filter(item => item.storeId === storeId))
      .slice(0, maxScan)

    return recentMessages
      .filter(item => item.text.includes(CHAT_IMAGE_PAYLOAD_MARKER))
      .slice(0, limit)
  }

  async pruneMessagesForStore(
    storeIdInput: string,
    protectedMessageIdsInput: string[] = []
  ): Promise<number> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    if (!storeId) return 0

    const protectedIds = new Set(
      protectedMessageIdsInput
        .map(id => String(id || '').trim())
        .filter(Boolean)
    )

    const messages = await this.listByStore(storeId)
    if (!messages.length) return 0

    const deletable = (message: ChatMessageEntity): boolean => {
      if (!message.id.trim()) return false
      if (protectedIds.has(message.id)) return false
      if (message.status !== 'sent') return false
      return true
    }

    const deleteIds = new Set<string>()
    const byConversation = new Map<string, ChatMessageEntity[]>()

    messages.forEach(message => {
      const conversationId = message.conversationId.trim()
      if (!conversationId) return

      const list = byConversation.get(conversationId) || []
      list.push(message)
      byConversation.set(conversationId, list)
    })

    byConversation.forEach(items => {
      const newestFirst = sortMessagesDesc(items)
      let keptCount = 0

      newestFirst.forEach(message => {
        if (protectedIds.has(message.id) || message.status !== 'sent') {
          keptCount += 1
          return
        }

        if (keptCount < CHAT_LOCAL_MAX_MESSAGES_PER_CONVERSATION) {
          keptCount += 1
          return
        }

        if (deletable(message)) {
          deleteIds.add(message.id)
        }
      })
    })

    const afterConversationPrune = messages.filter(message => !deleteIds.has(message.id))
    const storeNewestFirst = sortMessagesDesc(afterConversationPrune)
    let storeKeptCount = 0

    storeNewestFirst.forEach(message => {
      if (protectedIds.has(message.id) || message.status !== 'sent') {
        storeKeptCount += 1
        return
      }

      if (storeKeptCount < CHAT_LOCAL_MAX_MESSAGES_PER_STORE) {
        storeKeptCount += 1
        return
      }

      if (deletable(message)) {
        deleteIds.add(message.id)
      }
    })

    const ids = Array.from(deleteIds)
    if (!ids.length) return 0

    await this.deleteByIds(storeId, ids)

    return ids.length
  }

  async listThreadMetaByStore(storeIdInput: string): Promise<ChatThreadMetaEntity[]> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    if (!storeId) return []

    return this.readMetas().filter(item => item.storeId === storeId)
  }

  async observeThreadMetaByStore(
    storeIdInput: string,
    listener: (items: ChatThreadMetaEntity[]) => void
  ): Promise<ChatLocalUnsubscribe> {
    const emit = async () => {
      listener(await this.listThreadMetaByStore(storeIdInput))
    }

    await emit()

    return this.subscribeMetas(() => {
      void emit()
    })
  }

  async getThreadMeta(
    storeIdInput: string,
    conversationIdInput: string
  ): Promise<ChatThreadMetaEntity | null> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return null

    return this.readMetas().find(item => (
      item.storeId === storeId &&
      item.conversationId === conversationId
    )) || null
  }

  async upsertThreadMeta(entityInput: ChatThreadMetaEntity): Promise<void> {
    await this.ensureReady()

    const entity = normalizeThreadMetaEntity(entityInput)
    if (!entity) return

    const metas = this.readMetas().filter(item => !(
      item.storeId === entity.storeId &&
      item.conversationId === entity.conversationId
    ))

    this.writeMetas([...metas, entity])
  }

  async updatePinned(
    storeIdInput: string,
    conversationIdInput: string,
    pinnedAtMsInput: number
  ): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return

    const pinnedAtMs = Number(pinnedAtMsInput)
    const nextPinnedAtMs = Number.isFinite(pinnedAtMs) && pinnedAtMs > 0 ? pinnedAtMs : 0

    this.writeMetas(this.readMetas().map(item => {
      if (item.storeId !== storeId || item.conversationId !== conversationId) return item

      return {
        ...item,
        pinnedAtMs: nextPinnedAtMs
      }
    }))
  }

  async updateDeleted(
    storeIdInput: string,
    conversationIdInput: string,
    isDeletedInput: boolean,
    deletedAtMsInput: number
  ): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return

    const deletedAtMs = Number(deletedAtMsInput)
    const nextDeletedAtMs = Number.isFinite(deletedAtMs) && deletedAtMs > 0 ? deletedAtMs : 0

    this.writeMetas(this.readMetas().map(item => {
      if (item.storeId !== storeId || item.conversationId !== conversationId) return item

      return {
        ...item,
        isDeleted: Boolean(isDeletedInput),
        deletedAtMs: nextDeletedAtMs
      }
    }))
  }

  async updateAlias(
    storeIdInput: string,
    conversationIdInput: string,
    aliasInput: string | null
  ): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return

    const alias = normalizeNullableString(aliasInput)

    this.writeMetas(this.readMetas().map(item => {
      if (item.storeId !== storeId || item.conversationId !== conversationId) return item

      return {
        ...item,
        alias
      }
    }))
  }

  async deleteThreadMetaByConversation(
    storeIdInput: string,
    conversationIdInput: string
  ): Promise<void> {
    await this.ensureReady()

    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return

    this.writeMetas(this.readMetas().filter(item => !(
      item.storeId === storeId &&
      item.conversationId === conversationId
    )))
  }

  async debugSnapshot(): Promise<ChatLocalDbSnapshot> {
    await this.ensureReady()

    return {
      count: await this.countAll(),
      latest: await this.latest()
    }
  }
}

let showcaseChatLocalDbInstance: ShowcaseChatLocalDb | null = null

export function getShowcaseChatLocalDb(): ShowcaseChatLocalDb {
  if (!showcaseChatLocalDbInstance) {
    showcaseChatLocalDbInstance = new ShowcaseChatLocalDb()
  }

  return showcaseChatLocalDbInstance
}

export function createShowcaseChatLocalDb(): ShowcaseChatLocalDb {
  return new ShowcaseChatLocalDb()
}