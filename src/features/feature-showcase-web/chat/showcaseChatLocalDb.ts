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

export const SHOWCASE_CHAT_DB_VERSION = 7

const SHOWCASE_CHAT_DB_NAME = 'showcase_chat_db'
const SHOWCASE_CHAT_MESSAGES_KEY = `${SHOWCASE_CHAT_DB_NAME}_chat_messages`
const SHOWCASE_CHAT_THREAD_META_KEY = `${SHOWCASE_CHAT_DB_NAME}_chat_thread_meta`

function canUseStorage(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback

    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!canUseStorage()) return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage persistence is best effort
  }
}

function normalizeStatus(value: unknown): ShowcaseChatLocalStatus {
  const text = String(value ?? '').trim().toLowerCase()

  if (text === 'sending' || text === 'sent' || text === 'failed') {
    return text
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

function includesKeyword(value: string, keyword: string): boolean {
  const k = keyword.trim().toLowerCase()
  if (!k) return false

  return value.toLowerCase().includes(k)
}

export class ShowcaseChatLocalDb {
  private messageListeners = new Set<() => void>()
  private metaListeners = new Set<() => void>()

  private readMessages(): ChatMessageEntity[] {
    return readJson<ChatMessageEntity[]>(SHOWCASE_CHAT_MESSAGES_KEY, [])
      .map(item => normalizeMessageEntity(item))
      .filter((item): item is ChatMessageEntity => Boolean(item))
  }

  private writeMessages(items: ChatMessageEntity[]): void {
    const latestById = new Map<string, ChatMessageEntity>()

    items
      .map(item => normalizeMessageEntity(item))
      .filter((item): item is ChatMessageEntity => Boolean(item))
      .forEach(item => {
        latestById.set(item.id, item)
      })

    writeJson(SHOWCASE_CHAT_MESSAGES_KEY, Array.from(latestById.values()))
    this.notifyMessagesChanged()
  }

  private readMetas(): ChatThreadMetaEntity[] {
    return readJson<ChatThreadMetaEntity[]>(SHOWCASE_CHAT_THREAD_META_KEY, [])
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

    writeJson(SHOWCASE_CHAT_THREAD_META_KEY, Array.from(latestByKey.values()))
    this.notifyMetasChanged()
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
    this.writeMessages(items)
  }

  readThreadMetasSync(): ChatThreadMetaEntity[] {
    return this.readMetas()
  }

  writeThreadMetasSync(items: ChatThreadMetaEntity[]): void {
    this.writeMetas(items)
  }

  async listByConversation(conversationIdInput: string): Promise<ChatMessageEntity[]> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return []

    return sortMessagesAsc(this.readMessages().filter(item => item.conversationId === conversationId))
  }

  async searchByConversationKeyword(
    conversationIdInput: string,
    keywordInput: string,
    limitInput = 80
  ): Promise<ChatMessageEntity[]> {
    const conversationId = conversationIdInput.trim()
    const keyword = keywordInput.trim()
    const limit = Math.max(1, Math.trunc(Number(limitInput) || 80))

    if (!conversationId || !keyword) return []

    return sortMessagesDesc(this.readMessages().filter(item => (
      item.conversationId === conversationId &&
      includesKeyword(item.text, keyword)
    ))).slice(0, limit)
  }

  async observeByConversation(
    conversationIdInput: string,
    listener: (items: ChatMessageEntity[]) => void
  ): Promise<ChatLocalUnsubscribe> {
    const emit = async () => {
      listener(await this.listByConversation(conversationIdInput))
    }

    await emit()

    return this.subscribeMessages(() => {
      void emit()
    })
  }

  async observeUnread(
    conversationIdInput: string,
    listener: (count: number) => void
  ): Promise<ChatLocalUnsubscribe> {
    const emit = async () => {
      listener(await this.countUnread(conversationIdInput))
    }

    await emit()

    return this.subscribeMessages(() => {
      void emit()
    })
  }

  async upsert(entityInput: ChatMessageEntity): Promise<void> {
    const entity = normalizeMessageEntity(entityInput)
    if (!entity) return

    const messages = this.readMessages().filter(item => item.id !== entity.id)
    this.writeMessages([...messages, entity])
  }

  async countAll(): Promise<number> {
    return this.readMessages().length
  }

  async latest(): Promise<ChatMessageEntity | null> {
    return sortMessagesDesc(this.readMessages())[0] || null
  }

  async findById(idInput: string): Promise<ChatMessageEntity | null> {
    const id = idInput.trim()
    if (!id) return null

    return this.readMessages().find(item => item.id === id) || null
  }

  async updateStatus(idInput: string, statusInput: string): Promise<void> {
    const id = idInput.trim()
    if (!id) return

    const status = normalizeStatus(statusInput)

    this.writeMessages(this.readMessages().map(item => {
      if (item.id !== id) return item

      return {
        ...item,
        status
      }
    }))
  }

  async updateStatusByIds(idsInput: string[], statusInput: string): Promise<void> {
    const ids = new Set(idsInput.map(id => id.trim()).filter(Boolean))
    if (!ids.size) return

    const status = normalizeStatus(statusInput)

    this.writeMessages(this.readMessages().map(item => {
      if (!ids.has(item.id)) return item

      return {
        ...item,
        status
      }
    }))
  }

  async clearStore(storeIdInput: string): Promise<void> {
    const storeId = storeIdInput.trim()
    if (!storeId) return

    this.writeMessages(this.readMessages().filter(item => item.storeId !== storeId))
  }

  async markAllRead(conversationIdInput: string): Promise<void> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return

    this.writeMessages(this.readMessages().map(item => {
      if (item.conversationId !== conversationId) return item
      if (item.direction !== 'in') return item

      return {
        ...item,
        isRead: true
      }
    }))
  }

  async markAllOutgoingRead(conversationIdInput: string): Promise<void> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return

    this.writeMessages(this.readMessages().map(item => {
      if (item.conversationId !== conversationId) return item
      if (item.direction !== 'out') return item

      return {
        ...item,
        isRead: true
      }
    }))
  }

  async markMerchantMessagesRead(conversationIdInput: string): Promise<void> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return

    this.writeMessages(this.readMessages().map(item => {
      if (item.conversationId !== conversationId) return item
      if (item.role !== 'merchant') return item

      return {
        ...item,
        isRead: true
      }
    }))
  }

  async markMerchantMessagesReadByStoreAndClient(
    storeIdInput: string,
    clientIdInput: string
  ): Promise<void> {
    const storeId = storeIdInput.trim()
    const clientId = clientIdInput.trim()

    if (!storeId || !clientId) return

    this.writeMessages(this.readMessages().map(item => {
      if (item.storeId !== storeId) return item
      if (item.clientId !== clientId) return item
      if (item.role !== 'merchant') return item

      return {
        ...item,
        isRead: true
      }
    }))
  }

  async countUnread(conversationIdInput: string): Promise<number> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return 0

    return this.readMessages().filter(item => (
      item.conversationId === conversationId &&
      item.direction === 'in' &&
      !item.isRead
    )).length
  }

  async countUnreadForUserEntry(conversationIdInput: string): Promise<number> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return 0

    return this.readMessages().filter(item => (
      item.conversationId === conversationId &&
      item.role === 'merchant' &&
      !item.isRead
    )).length
  }

  async findLatestConversationIdByStoreAndClient(
    storeIdInput: string,
    clientIdInput: string
  ): Promise<string | null> {
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
    const storeId = storeIdInput.trim()
    if (!storeId) return []

    return sortMessagesAsc(this.readMessages().filter(item => item.storeId === storeId))
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

  async deleteByIds(storeIdOrIds: string | string[], idsInput?: string[]): Promise<void> {
    if (Array.isArray(storeIdOrIds)) {
      const ids = new Set(storeIdOrIds.map(id => id.trim()).filter(Boolean))
      if (!ids.size) return

      this.writeMessages(this.readMessages().filter(item => !ids.has(item.id)))
      return
    }

    const storeId = storeIdOrIds.trim()
    const ids = new Set((idsInput || []).map(id => id.trim()).filter(Boolean))

    if (!storeId || !ids.size) return

    this.writeMessages(this.readMessages().filter(item => !(item.storeId === storeId && ids.has(item.id))))
  }

  async deleteById(idInput: string): Promise<void> {
    const id = idInput.trim()
    if (!id) return

    this.writeMessages(this.readMessages().filter(item => item.id !== id))
  }

  async deleteByConversation(conversationIdInput: string): Promise<void> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return

    this.writeMessages(this.readMessages().filter(item => item.conversationId !== conversationId))
  }

  async searchByStoreKeyword(
    storeIdInput: string,
    keywordInput: string,
    limitInput = 80
  ): Promise<ChatMessageEntity[]> {
    const storeId = storeIdInput.trim()
    const keyword = keywordInput.trim()
    const limit = Math.max(1, Math.trunc(Number(limitInput) || 80))

    if (!storeId || !keyword) return []

    return sortMessagesDesc(this.readMessages().filter(item => (
      item.storeId === storeId &&
      includesKeyword(item.text, keyword)
    ))).slice(0, limit)
  }

  async listThreadMetaByStore(storeIdInput: string): Promise<ChatThreadMetaEntity[]> {
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
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return null

    return this.readMetas().find(item => (
      item.storeId === storeId &&
      item.conversationId === conversationId
    )) || null
  }

  async upsertThreadMeta(entityInput: ChatThreadMetaEntity): Promise<void> {
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
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return

    this.writeMetas(this.readMetas().filter(item => !(
      item.storeId === storeId &&
      item.conversationId === conversationId
    )))
  }

  async debugSnapshot(): Promise<ChatLocalDbSnapshot> {
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