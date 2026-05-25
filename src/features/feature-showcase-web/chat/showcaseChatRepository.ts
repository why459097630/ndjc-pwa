import type {
  ChatThreadSummary,
  ShowcaseCloudRepository
} from '../showcaseCloudRepository'
import {
  SHOWCASE_PAGE_SIZE
} from '../showcaseCloudConfig'
import {
  pruneShowcaseChatTombstones
} from '../showcaseLocalCacheMaintenance'
import {
  createShowcaseChatCloudRepository,
  type ChatImageUploadInput,
  type CloudMsg as ChatCloudMsg,
  type CloudThreadMetaRow as ChatCloudThreadMetaRow,
  type CloudThreadSummaryRow as ChatCloudThreadSummaryRow,
  type ShowcaseChatCloudRepository
} from './showcaseChatCloudRepository'
import {
  getShowcaseChatLocalDb,
  type ChatMessageEntity,
  type ChatThreadMetaEntity,
  type ShowcaseChatLocalDb,
  type ShowcaseChatLocalDirection,
  type ShowcaseChatLocalStatus
} from './showcaseChatLocalDb'

export type {
  ChatMessageEntity,
  ChatThreadMetaEntity,
  ShowcaseChatLocalDirection,
  ShowcaseChatLocalStatus
} from './showcaseChatLocalDb'

export type ChatDeletedMessageTombstone = {
  storeId: string
  conversationId: string
  messageId: string
  deletedAtMs: number
}

export type CloudThreadSummary = {
  conversationId: string
  storeId: string
  clientId: string | null
  customerSeq: number | null
  merchantAlias: string | null
  lastMessageAtIso: string | null
  lastPreview: string | null
  updatedAtIso: string | null
}

export type ChatMessagesAroundMessageResult = {
  messages: ChatMessageEntity[]
  targetMessage: ChatMessageEntity | null
  found: boolean
  source: 'local' | 'cloud' | 'none'
  hasOlder: boolean
  hasNewer: boolean
  oldestTimeMs: number | null
  newestTimeMs: number | null
}

export type ShowcaseChatRepositoryOptions = {
  cloud?: ShowcaseCloudRepository | null
  chatCloud?: ShowcaseChatCloudRepository | null
  localDb?: ShowcaseChatLocalDb | null
  storagePrefix?: string
  chatCloudEnabled?: boolean
  chatRelayEnabled?: boolean
}

type MerchantThreadMetaCloudRow = ChatCloudThreadMetaRow & {
  customerSeq?: number | null
}

type MerchantThreadSummaryCloudRow = ChatCloudThreadSummaryRow

export class ShowcaseChatRepository {
  private readonly cloud: ShowcaseCloudRepository | null
  private readonly chatCloud: ShowcaseChatCloudRepository | null
  private readonly localDb: ShowcaseChatLocalDb
  private readonly storagePrefix: string
  private readonly chatCloudEnabled: boolean
  private readonly chatRelayEnabled: boolean

  constructor(options: ShowcaseChatRepositoryOptions = {}) {
    this.cloud = options.cloud ?? null
    this.chatCloud = options.chatCloud ?? createShowcaseChatCloudRepository()
    this.localDb = options.localDb ?? getShowcaseChatLocalDb()
    this.storagePrefix = options.storagePrefix || 'ndjc_showcase_chat_repository_v1'
    this.chatCloudEnabled = options.chatCloudEnabled ?? Boolean(this.chatCloud)
    this.chatRelayEnabled = options.chatRelayEnabled ?? false
  }

  isChatCloudEnabled(): boolean {
    return Boolean(this.chatCloudEnabled && !this.chatRelayEnabled && this.chatCloud)
  }

  isChatRelayEnabled(): boolean {
    return Boolean(this.chatCloudEnabled && this.chatRelayEnabled && this.cloud)
  }

  private effectiveTraceId(traceId?: string | null): string {
    const value = String(traceId || '').trim()
    if (value && value !== '-') return value

    return `R${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`
  }

  // --------------------
  // Local storage keys
  // --------------------

  private deletedMessageTombstonesKey(): string {
    return `${this.storagePrefix}_deleted_message_tombstones`
  }

  private canUseStorage(): boolean {
    if (typeof window === 'undefined') return false

    try {
      return typeof window.localStorage !== 'undefined'
    } catch {
      return false
    }
  }

  private readJson<T>(key: string, fallback: T): T {
    if (!this.canUseStorage()) return fallback

    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return fallback

      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  }

  private writeJson<T>(key: string, value: T): void {
    if (!this.canUseStorage()) return

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage persistence is best effort
    }
  }

  private readMessages(): ChatMessageEntity[] {
    return this.localDb.readMessagesSync()
      .map(item => this.normalizeMessageEntity(item))
      .filter((item): item is ChatMessageEntity => Boolean(item))
  }

  private writeMessages(items: ChatMessageEntity[]): void {
    const normalized = items
      .map(item => this.normalizeMessageEntity(item))
      .filter((item): item is ChatMessageEntity => Boolean(item))

    this.localDb.writeMessagesSync(normalized)
  }

  private readMetas(): ChatThreadMetaEntity[] {
    return this.localDb.readThreadMetasSync()
      .map(item => this.normalizeThreadMetaEntity(item))
      .filter((item): item is ChatThreadMetaEntity => Boolean(item))
  }

  private writeMetas(items: ChatThreadMetaEntity[]): void {
    const normalized = items
      .map(item => this.normalizeThreadMetaEntity(item))
      .filter((item): item is ChatThreadMetaEntity => Boolean(item))

    this.localDb.writeThreadMetasSync(normalized)
  }

  private readDeletedMessageTombstones(): ChatDeletedMessageTombstone[] {
    return this.readJson<ChatDeletedMessageTombstone[]>(this.deletedMessageTombstonesKey(), [])
      .map(item => this.normalizeDeletedMessageTombstone(item))
      .filter((item): item is ChatDeletedMessageTombstone => Boolean(item))
  }

  private writeDeletedMessageTombstones(items: ChatDeletedMessageTombstone[]): void {
    const normalized = items
      .map(item => this.normalizeDeletedMessageTombstone(item))
      .filter((item): item is ChatDeletedMessageTombstone => Boolean(item))

    const latestByKey = new Map<string, ChatDeletedMessageTombstone>()

    normalized.forEach(item => {
      const key = `${item.storeId}:${item.conversationId}:${item.messageId}`
      latestByKey.set(key, item)
    })

    this.writeJson(this.deletedMessageTombstonesKey(), Array.from(latestByKey.values()))
    pruneShowcaseChatTombstones()
  }

  private normalizeDeletedMessageTombstone(
    input: Partial<ChatDeletedMessageTombstone> | null | undefined
  ): ChatDeletedMessageTombstone | null {
    if (!input) return null

    const storeId = String(input.storeId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const messageId = String(input.messageId || '').trim()
    const deletedAtMs = Number(input.deletedAtMs)

    if (!storeId || !conversationId || !messageId) return null

    return {
      storeId,
      conversationId,
      messageId,
      deletedAtMs: Number.isFinite(deletedAtMs) && deletedAtMs > 0 ? deletedAtMs : Date.now()
    }
  }

  private markMessagesLocallyDeleted(messages: ChatMessageEntity[]): void {
    const now = Date.now()
    const tombstones = this.readDeletedMessageTombstones()
    const next = [...tombstones]

    messages.forEach(message => {
      const normalized = this.normalizeMessageEntity(message)
      if (!normalized) return

      next.push({
        storeId: normalized.storeId,
        conversationId: normalized.conversationId,
        messageId: normalized.id,
        deletedAtMs: now
      })
    })

    this.writeDeletedMessageTombstones(next)
  }

  private isMessageLocallyDeleted(
    storeIdInput: string,
    conversationIdInput: string,
    messageIdInput: string
  ): boolean {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    const messageId = messageIdInput.trim()

    if (!storeId || !conversationId || !messageId) return false

    return this.readDeletedMessageTombstones().some(item => (
      item.storeId === storeId &&
      item.conversationId === conversationId &&
      item.messageId === messageId
    ))
  }

  private normalizeMessageEntity(input: Partial<ChatMessageEntity> | null | undefined): ChatMessageEntity | null {
    if (!input) return null

    const id = String(input.id || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const storeId = String(input.storeId || '').trim()

    if (!id || !conversationId || !storeId) return null

    const direction = input.direction === 'out' ? 'out' : 'in'
    const rawStatus = String(input.status || '').trim().toLowerCase()
    const status: ShowcaseChatLocalStatus =
      rawStatus === 'sending' || rawStatus === 'failed'
        ? rawStatus
        : 'sent'

    const timeMs = Number(input.timeMs)

    return {
      id,
      conversationId,
      storeId,
      clientId: String(input.clientId || '').trim(),
      role: String(input.role || '').trim(),
      direction,
      text: String(input.text || ''),
      timeMs: Number.isFinite(timeMs) ? timeMs : 0,
      status,
      isRead: Boolean(input.isRead)
    }
  }

  private normalizeThreadMetaEntity(input: Partial<ChatThreadMetaEntity> | null | undefined): ChatThreadMetaEntity | null {
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
      pinnedAtMs: Number.isFinite(pinnedAtMs) ? pinnedAtMs : 0,
      isDeleted: Boolean(input.isDeleted),
      deletedAtMs: Number.isFinite(deletedAtMs) ? deletedAtMs : 0,
      alias: this.normalizeNullableString(input.alias),
      customerSeq: Number.isFinite(customerSeq) && customerSeq > 0 ? Math.trunc(customerSeq) : null
    }
  }

  private normalizeNullableString(value: unknown): string | null {
    const text = String(value ?? '').trim()
    if (!text || text.toLowerCase() === 'null') return null
    return text
  }

  private upsertMetaEntity(entity: ChatThreadMetaEntity): void {
    const normalized = this.normalizeThreadMetaEntity(entity)
    if (!normalized) return

    const metas = this.readMetas()
    this.writeMetas([
      ...metas.filter(item => !(item.storeId === normalized.storeId && item.conversationId === normalized.conversationId)),
      normalized
    ])
  }

  private upsertMessageEntity(entity: ChatMessageEntity): void {
    const normalized = this.normalizeMessageEntity(entity)
    if (!normalized) return

    this.localDb.upsertSync(normalized)
  }

  // --------------------
  // Local messages
  // --------------------

  async listLocal(
    storeIdInput: string,
    conversationId: string,
    limitInput = SHOWCASE_PAGE_SIZE.chatMessages,
    offsetInput = 0
  ): Promise<ChatMessageEntity[]> {
    const storeId = storeIdInput.trim()
    const id = conversationId.trim()
    const limit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || SHOWCASE_PAGE_SIZE.chatMessages), 300))
    const offset = Math.max(0, Math.trunc(Number(offsetInput) || 0))

    if (!storeId || !id) return []

    if (offset > 0) {
      return this.readMessages()
        .filter(item => item.storeId === storeId && item.conversationId === id)
        .sort((left, right) => right.timeMs - left.timeMs)
        .slice(offset, offset + limit)
        .sort((left, right) => {
          const byTime = Number(left.timeMs || 0) - Number(right.timeMs || 0)
          if (byTime !== 0) return byTime
          return left.id.localeCompare(right.id)
        })
    }

    return this.localDb.listLatestByConversation(storeId, id, limit)
  }

  async listLocalMessagesAroundMessage(input: {
    storeId: string
    conversationId: string
    messageId: string
    beforeLimit?: number
    afterLimit?: number
  }): Promise<ChatMessagesAroundMessageResult> {
    const storeId = String(input.storeId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const messageId = String(input.messageId || '').trim()
    const beforeLimit = Math.max(0, Math.min(Math.trunc(Number(input.beforeLimit) || 15), 100))
    const afterLimit = Math.max(0, Math.min(Math.trunc(Number(input.afterLimit) || 15), 100))

    if (!storeId || !conversationId || !messageId) {
      return {
        messages: [],
        targetMessage: null,
        found: false,
        source: 'none',
        hasOlder: false,
        hasNewer: false,
        oldestTimeMs: null,
        newestTimeMs: null
      }
    }

    const target = await this.localDb.findByConversationMessageId(storeId, conversationId, messageId)

    if (!target) {
      return {
        messages: [],
        targetMessage: null,
        found: false,
        source: 'none',
        hasOlder: false,
        hasNewer: false,
        oldestTimeMs: null,
        newestTimeMs: null
      }
    }

    const rawMessages = await this.localDb.listAroundConversationMessage(
      storeId,
      conversationId,
      messageId,
      beforeLimit,
      afterLimit
    )

    const messages = rawMessages
      .filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id))
      .sort((left, right) => {
        const byTime = Number(left.timeMs || 0) - Number(right.timeMs || 0)
        if (byTime !== 0) return byTime
        return left.id.localeCompare(right.id)
      })

    const oldestTimeMs = messages.length > 0 ? Number(messages[0].timeMs || 0) : null
    const newestTimeMs = messages.length > 0 ? Number(messages[messages.length - 1].timeMs || 0) : null

    return {
      messages,
      targetMessage: messages.find(item => item.id === messageId) || target,
      found: true,
      source: 'local',
      hasOlder: messages.length > 0 && messages[0].id !== target.id,
      hasNewer: messages.length > 0 && messages[messages.length - 1].id !== target.id,
      oldestTimeMs: Number.isFinite(Number(oldestTimeMs)) && Number(oldestTimeMs) > 0 ? Number(oldestTimeMs) : null,
      newestTimeMs: Number.isFinite(Number(newestTimeMs)) && Number(newestTimeMs) > 0 ? Number(newestTimeMs) : null
    }
  }

  async listLocalMessagesAfterTime(input: {
    storeId: string
    conversationId: string
    afterTimeMs: number
    limit?: number
  }): Promise<ChatMessageEntity[]> {
    const storeId = String(input.storeId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const afterTimeMs = Number(input.afterTimeMs || 0)
    const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatMessages), 100))

    if (!storeId || !conversationId || !Number.isFinite(afterTimeMs) || afterTimeMs <= 0) return []

    return this.localDb.listAfterTimeByConversation(storeId, conversationId, afterTimeMs, limit)
      .then(items => items.filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id)))
  }

  async listLocalMessagesBeforeTime(input: {
    storeId: string
    conversationId: string
    beforeTimeMs: number
    limit?: number
  }): Promise<ChatMessageEntity[]> {
    const storeId = String(input.storeId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const beforeTimeMs = Number(input.beforeTimeMs || 0)
    const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatMessages), 100))

    if (!storeId || !conversationId || !Number.isFinite(beforeTimeMs) || beforeTimeMs <= 0) return []

    return this.localDb.listBeforeTimeByConversation(storeId, conversationId, beforeTimeMs, limit)
      .then(items => items.filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id)))
  }

  async upsertLocal(entity: ChatMessageEntity): Promise<void> {
    this.upsertMessageEntity(entity)
  }

  async debugRoomSnapshot(): Promise<[number, ChatMessageEntity | null]> {
    const snapshot = await this.localDb.debugSnapshot()
    return [snapshot.count, snapshot.latest]
  }

  async findLocalMessageById(storeIdInput: string, idInput: string): Promise<ChatMessageEntity | null> {
    const storeId = storeIdInput.trim()
    const id = idInput.trim()
    if (!storeId || !id) return null

    return this.localDb.findById(storeId, id)
  }

  async updateLocalStatus(storeIdInput: string, idsInput: string[], statusInput: string): Promise<void> {
    const storeId = storeIdInput.trim()
    const ids = idsInput.map(id => id.trim()).filter(Boolean)
    if (!storeId || !ids.length) return

    const status = statusInput === 'sending' || statusInput === 'failed'
      ? statusInput
      : 'sent'

    await this.localDb.updateStatusByIds(storeId, ids, status)
  }

  async clearLocal(storeIdInput: string): Promise<void> {
    const storeId = storeIdInput.trim()
    if (!storeId) return

    await this.localDb.clearStore(storeId)
    this.writeDeletedMessageTombstones(
      this.readDeletedMessageTombstones().filter(item => item.storeId !== storeId)
    )
  }
  async markAllRead(storeIdInput: string, conversationIdInput: string): Promise<void> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    if (!storeId || !conversationId) return

    await this.localDb.markAllRead(storeId, conversationId)
  }

  async countUnread(storeIdInput: string, conversationIdInput: string): Promise<number> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    if (!storeId || !conversationId) return 0

    return this.localDb.countUnread(storeId, conversationId)
  }

  async countUnreadForUserEntry(storeIdInput: string, conversationIdInput: string): Promise<number> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    if (!storeId || !conversationId) return 0

    return this.localDb.countUnreadForUserEntry(storeId, conversationId)
  }

  async findLatestConversationIdByStoreAndClient(
    storeIdInput: string,
    clientIdInput: string
  ): Promise<string | null> {
    const storeId = storeIdInput.trim()
    const clientId = clientIdInput.trim()

    if (!storeId || !clientId) return null

    const latest = this.readMessages()
      .filter(item => item.storeId === storeId && item.clientId === clientId)
      .sort((left, right) => right.timeMs - left.timeMs)[0]

    return latest?.conversationId || null
  }

  async countUnreadForUserEntryByStoreAndClient(
    storeIdInput: string,
    clientIdInput: string,
    traceId?: string | null
  ): Promise<number> {
    const storeId = storeIdInput.trim()
    const clientId = clientIdInput.trim()

    if (!storeId || !clientId) return 0

    if (this.isChatCloudEnabled() && this.chatCloud) {
      return this.chatCloud.countUnreadForUserEntryByStoreAndClient(
        storeId,
        clientId,
        this.effectiveTraceId(traceId)
      )
    }

    return this.localDb.countUnreadForUserEntryByStoreAndClient(storeId, clientId)
  }

  async countUnreadForMerchantConversation(
    storeIdInput: string,
    conversationIdInput: string,
    traceId?: string | null
  ): Promise<number> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return 0

    if (this.isChatCloudEnabled() && this.chatCloud) {
      return this.chatCloud.countUnreadForMerchantConversation(
        storeId,
        conversationId,
        this.effectiveTraceId(traceId)
      )
    }

    return this.localDb.countUnread(storeId, conversationId)
  }

  async deleteLocalByIds(storeIdInput: string, idsInput: string[]): Promise<void> {
    const storeId = storeIdInput.trim()
    const ids = Array.from(new Set((idsInput || []).map(id => id.trim()).filter(Boolean)))

    if (!storeId || !ids.length) return

    const deletedMessages = (await Promise.all(ids.map(id => this.localDb.findById(storeId, id))))
      .filter((item): item is ChatMessageEntity => Boolean(item))

    this.markMessagesLocallyDeleted(deletedMessages)
    await this.localDb.deleteByIds(storeId, ids)
  }

  async deleteLocalById(storeIdInput: string, idInput: string): Promise<void> {
    const storeId = storeIdInput.trim()
    const id = idInput.trim()
    if (!storeId || !id) return

    const deletedMessage = await this.localDb.findById(storeId, id)

    if (!deletedMessage) {
      await this.localDb.deleteById(storeId, id)
      return
    }

    this.markMessagesLocallyDeleted([deletedMessage])
    await this.localDb.deleteById(storeId, id)
  }

  async listLocalByStore(storeIdInput: string): Promise<ChatMessageEntity[]> {
    const storeId = storeIdInput.trim()
    if (!storeId) return []

    return this.localDb.listByStore(storeId)
      .then(items => items.sort((left, right) => right.timeMs - left.timeMs))
  }

  async searchLocalMessagesByConversationKeyword(
    storeIdInput: string,
    conversationIdInput: string,
    keywordInput: string,
    limitInput = 80
  ): Promise<ChatMessageEntity[]> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    const keyword = keywordInput.trim()
    const limit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || 80), 200))

    if (!storeId || !conversationId || !keyword) return []

    return this.localDb.searchByConversationKeyword(storeId, conversationId, keyword, limit)
      .then(items => items.filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id)))
  }

  async searchLocalMessagesByStoreKeyword(input: {
    storeId: string
    keyword: string
    limit?: number
    maxScan?: number
  }): Promise<ChatMessageEntity[]> {
    const storeId = String(input.storeId || '').trim()
    const keyword = String(input.keyword || '').trim()
    const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatSearchResults), 200))
    const maxScan = Math.max(limit, Math.min(Math.trunc(Number(input.maxScan) || SHOWCASE_PAGE_SIZE.chatSearchMaxLocalScan), 2000))

    if (!storeId || !keyword) return []

    return this.localDb.searchByStoreKeyword(storeId, keyword, limit, maxScan)
      .then(items => items.filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id)))
  }

  async fetchLocalMediaMessagesByStore(input: {
    storeId: string
    limit?: number
    maxScan?: number
  }): Promise<ChatMessageEntity[]> {
    const storeId = String(input.storeId || '').trim()
    const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatMediaItems), 200))
    const maxScan = Math.max(limit, Math.min(Math.trunc(Number(input.maxScan) || SHOWCASE_PAGE_SIZE.chatMediaMaxLocalScan), 3000))

    if (!storeId) return []

    return this.localDb.listMediaByStore(storeId, limit, maxScan)
      .then(items => items.filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id)))
  }

  async fetchLocalMediaMessagesByConversation(input: {
    storeId: string
    conversationId: string
    limit?: number
    maxScan?: number
  }): Promise<ChatMessageEntity[]> {
    const storeId = String(input.storeId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatMediaItems), 200))
    const maxScan = Math.max(limit, Math.min(Math.trunc(Number(input.maxScan) || SHOWCASE_PAGE_SIZE.chatMediaMaxLocalScan), 3000))

    if (!storeId || !conversationId) return []

    return this.localDb.listMediaByConversation(storeId, conversationId, limit, maxScan)
      .then(items => items.filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id)))
  }

  async searchCloudMessagesByStoreKeyword(input: {
    storeId: string
    keyword: string
    perspectiveRole: string
    clientId?: string | null
    limit?: number
    offset?: number
    traceId?: string | null
  }): Promise<ChatMessageEntity[]> {
    const storeId = String(input.storeId || '').trim()
    const keyword = String(input.keyword || '').trim()
    const perspectiveRole = String(input.perspectiveRole || '').trim()
    const clientId = String(input.clientId || '').trim() || null
    const asMerchant = perspectiveRole === 'merchant'
    const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatSearchResults), 200))
    const offset = Math.max(0, Math.trunc(Number(input.offset) || 0))

    if (!storeId || !keyword) return []
    if (!this.isChatCloudEnabled() || !this.chatCloud) return []

    const cloudMessages = await this.chatCloud.searchMessagesByStoreKeyword(
      storeId,
      keyword,
      asMerchant,
      clientId,
      limit,
      this.effectiveTraceId(input.traceId),
      offset
    )

    const entities = cloudMessages
      .map(message => this.cloudMessageToLocalEntity(message, perspectiveRole))
      .filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id))

    entities.forEach(item => {
      this.upsertMessageEntity(item)
    })

    return entities
  }

  async searchCloudMessagesByConversationKeyword(input: {
    storeId: string
    conversationId: string
    keyword: string
    perspectiveRole: string
    clientId?: string | null
    limit?: number
    offset?: number
    traceId?: string | null
  }): Promise<ChatMessageEntity[]> {
    const storeId = String(input.storeId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const keyword = String(input.keyword || '').trim()
    const perspectiveRole = String(input.perspectiveRole || '').trim()
    const clientId = String(input.clientId || '').trim() || null
    const asMerchant = perspectiveRole === 'merchant'
    const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatSearchResults), 200))
    const offset = Math.max(0, Math.trunc(Number(input.offset) || 0))

    if (!storeId || !conversationId || !keyword) return []
    if (!this.isChatCloudEnabled() || !this.chatCloud) return []

    const cloudMessages = await this.chatCloud.searchMessagesByConversationKeyword(
      storeId,
      conversationId,
      keyword,
      asMerchant,
      clientId,
      limit,
      this.effectiveTraceId(input.traceId),
      offset
    )

    const entities = cloudMessages
      .map(message => this.cloudMessageToLocalEntity(message, perspectiveRole))
      .filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id))

    entities.forEach(item => {
      this.upsertMessageEntity(item)
    })

    return entities
  }

  async fetchCloudMessagesAroundMessage(input: {
    storeId: string
    conversationId: string
    messageId: string
    perspectiveRole: string
    clientId?: string | null
    beforeLimit?: number
    afterLimit?: number
    traceId?: string | null
  }): Promise<ChatMessagesAroundMessageResult> {
    const storeId = String(input.storeId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const messageId = String(input.messageId || '').trim()
    const perspectiveRole = String(input.perspectiveRole || '').trim()
    const clientId = String(input.clientId || '').trim() || null
    const asMerchant = perspectiveRole === 'merchant'
    const beforeLimit = Math.max(0, Math.min(Math.trunc(Number(input.beforeLimit) || 15), 100))
    const afterLimit = Math.max(0, Math.min(Math.trunc(Number(input.afterLimit) || 15), 100))
    const traceId = this.effectiveTraceId(input.traceId)

    if (!storeId || !conversationId || !messageId) {
      return {
        messages: [],
        targetMessage: null,
        found: false,
        source: 'none',
        hasOlder: false,
        hasNewer: false,
        oldestTimeMs: null,
        newestTimeMs: null
      }
    }

    if (!this.isChatCloudEnabled() || !this.chatCloud) {
      return {
        messages: [],
        targetMessage: null,
        found: false,
        source: 'none',
        hasOlder: false,
        hasNewer: false,
        oldestTimeMs: null,
        newestTimeMs: null
      }
    }

    const targetCloudMessage = await this.chatCloud.fetchMessageById(
      storeId,
      conversationId,
      messageId,
      clientId,
      asMerchant,
      traceId
    )

    if (!targetCloudMessage) {
      return {
        messages: [],
        targetMessage: null,
        found: false,
        source: 'none',
        hasOlder: false,
        hasNewer: false,
        oldestTimeMs: null,
        newestTimeMs: null
      }
    }

    const targetTimeMs = Number(targetCloudMessage.timeMs || 0)

    const olderCloudMessages = await this.chatCloud.fetchMessagesBeforeTime(
      storeId,
      conversationId,
      targetTimeMs,
      clientId,
      asMerchant,
      beforeLimit,
      traceId
    )

    const newerCloudMessages = await this.chatCloud.fetchMessagesAfterTime(
      storeId,
      conversationId,
      targetTimeMs,
      clientId,
      asMerchant,
      afterLimit,
      traceId
    )

    const latestById = new Map<string, ChatMessageEntity>()

    olderCloudMessages
      .map(message => this.cloudMessageToLocalEntity(message, perspectiveRole))
      .forEach(item => {
        latestById.set(item.id, item)
      })

    latestById.set(
      targetCloudMessage.id,
      this.cloudMessageToLocalEntity(targetCloudMessage, perspectiveRole)
    )

    newerCloudMessages
      .map(message => this.cloudMessageToLocalEntity(message, perspectiveRole))
      .forEach(item => {
        latestById.set(item.id, item)
      })

    const messages = Array.from(latestById.values())
      .filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id))
      .sort((left, right) => {
        const byTime = Number(left.timeMs || 0) - Number(right.timeMs || 0)
        if (byTime !== 0) return byTime
        return left.id.localeCompare(right.id)
      })

    messages.forEach(item => {
      this.upsertMessageEntity(item)
    })

    const targetMessage = messages.find(item => item.id === messageId) || null
    const oldestTimeMs = messages.length > 0 ? Number(messages[0].timeMs || 0) : null
    const newestTimeMs = messages.length > 0 ? Number(messages[messages.length - 1].timeMs || 0) : null

    return {
      messages,
      targetMessage,
      found: Boolean(targetMessage),
      source: targetMessage ? 'cloud' : 'none',
      hasOlder: olderCloudMessages.length >= beforeLimit,
      hasNewer: newerCloudMessages.length >= afterLimit,
      oldestTimeMs: Number.isFinite(Number(oldestTimeMs)) && Number(oldestTimeMs) > 0 ? Number(oldestTimeMs) : null,
      newestTimeMs: Number.isFinite(Number(newestTimeMs)) && Number(newestTimeMs) > 0 ? Number(newestTimeMs) : null
    }
  }

  async fetchCloudMessagesAfterTime(input: {
    storeId: string
    conversationId: string
    afterTimeMs: number
    perspectiveRole: string
    clientId?: string | null
    limit?: number
    traceId?: string | null
  }): Promise<ChatMessageEntity[]> {
    const storeId = String(input.storeId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const afterTimeMs = Number(input.afterTimeMs || 0)
    const perspectiveRole = String(input.perspectiveRole || '').trim()
    const clientId = String(input.clientId || '').trim() || null
    const asMerchant = perspectiveRole === 'merchant'
    const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatMessages), 100))
    const traceId = this.effectiveTraceId(input.traceId)

    if (!storeId || !conversationId || !Number.isFinite(afterTimeMs) || afterTimeMs <= 0) return []
    if (!this.isChatCloudEnabled() || !this.chatCloud) return []

    const cloudMessages = await this.chatCloud.fetchMessagesAfterTime(
      storeId,
      conversationId,
      afterTimeMs,
      clientId,
      asMerchant,
      limit,
      traceId
    )

    const messages = cloudMessages
      .map(message => this.cloudMessageToLocalEntity(message, perspectiveRole))
      .filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id))
      .sort((left, right) => {
        const byTime = Number(left.timeMs || 0) - Number(right.timeMs || 0)
        if (byTime !== 0) return byTime
        return left.id.localeCompare(right.id)
      })

    messages.forEach(item => {
      this.upsertMessageEntity(item)
    })

    return messages
  }

  async fetchCloudMessagesBeforeTime(input: {
    storeId: string
    conversationId: string
    beforeTimeMs: number
    perspectiveRole: string
    clientId?: string | null
    limit?: number
    traceId?: string | null
  }): Promise<ChatMessageEntity[]> {
    const storeId = String(input.storeId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const beforeTimeMs = Number(input.beforeTimeMs || 0)
    const perspectiveRole = String(input.perspectiveRole || '').trim()
    const clientId = String(input.clientId || '').trim() || null
    const asMerchant = perspectiveRole === 'merchant'
    const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatMessages), 100))
    const traceId = this.effectiveTraceId(input.traceId)

    if (!storeId || !conversationId || !Number.isFinite(beforeTimeMs) || beforeTimeMs <= 0) return []
    if (!this.isChatCloudEnabled() || !this.chatCloud) return []

    const cloudMessages = await this.chatCloud.fetchMessagesBeforeTime(
      storeId,
      conversationId,
      beforeTimeMs,
      clientId,
      asMerchant,
      limit,
      traceId
    )

    const messages = cloudMessages
      .map(message => this.cloudMessageToLocalEntity(message, perspectiveRole))
      .filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id))
      .sort((left, right) => {
        const byTime = Number(left.timeMs || 0) - Number(right.timeMs || 0)
        if (byTime !== 0) return byTime
        return left.id.localeCompare(right.id)
      })

    messages.forEach(item => {
      this.upsertMessageEntity(item)
    })

    return messages
  }

  async fetchCloudMediaMessagesByStore(input: {
    storeId: string
    perspectiveRole: string
    clientId?: string | null
    limit?: number
    offset?: number
    traceId?: string | null
  }): Promise<ChatMessageEntity[]> {
    const storeId = String(input.storeId || '').trim()
    const perspectiveRole = String(input.perspectiveRole || '').trim()
    const clientId = String(input.clientId || '').trim() || null
    const asMerchant = perspectiveRole === 'merchant'
    const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatMediaItems), 200))
    const offset = Math.max(0, Math.trunc(Number(input.offset) || 0))

    if (!storeId) return []
    if (!this.isChatCloudEnabled() || !this.chatCloud) return []

    const cloudMessages = await this.chatCloud.fetchMediaMessagesByStore(
      storeId,
      asMerchant,
      clientId,
      limit,
      this.effectiveTraceId(input.traceId),
      offset
    )

    const entities = cloudMessages
      .map(message => this.cloudMessageToLocalEntity(message, perspectiveRole))
      .filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id))

    entities.forEach(item => {
      this.upsertMessageEntity(item)
    })

    return entities
  }

  async fetchCloudMediaMessagesByConversation(input: {
    storeId: string
    conversationId: string
    perspectiveRole: string
    clientId?: string | null
    limit?: number
    offset?: number
    traceId?: string | null
  }): Promise<ChatMessageEntity[]> {
    const storeId = String(input.storeId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const perspectiveRole = String(input.perspectiveRole || '').trim()
    const clientId = String(input.clientId || '').trim() || null
    const asMerchant = perspectiveRole === 'merchant'
    const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatMediaItems), 200))
    const offset = Math.max(0, Math.trunc(Number(input.offset) || 0))

    if (!storeId || !conversationId) return []
    if (!this.isChatCloudEnabled() || !this.chatCloud) return []

    const cloudMessages = await this.chatCloud.fetchMediaMessagesByConversation(
      storeId,
      conversationId,
      asMerchant,
      clientId,
      limit,
      this.effectiveTraceId(input.traceId),
      offset
    )

    const entities = cloudMessages
      .map(message => this.cloudMessageToLocalEntity(message, perspectiveRole))
      .filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id))

    entities.forEach(item => {
      this.upsertMessageEntity(item)
    })

    return entities
  }

  // --------------------
  // Local thread meta
  // --------------------

  async listThreadMetaByStore(storeIdInput: string): Promise<ChatThreadMetaEntity[]> {
    const storeId = storeIdInput.trim()
    if (!storeId) return []

    return this.readMetas().filter(item => item.storeId === storeId)
  }

  async getThreadMeta(storeIdInput: string, conversationIdInput: string): Promise<ChatThreadMetaEntity | null> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return null

    return this.readMetas().find(item => item.storeId === storeId && item.conversationId === conversationId) || null
  }

  async syncMerchantThreadMetaFromCloud(
    storeIdInput: string,
    traceId?: string | null
  ): Promise<number> {
    const storeId = storeIdInput.trim()
    if (!storeId || !this.chatCloud) return 0

    const rows: MerchantThreadMetaCloudRow[] = await this.chatCloud.fetchMerchantThreadMetaRows(
      storeId,
      this.effectiveTraceId(traceId)
    )

    if (!rows.length) return 0

    let count = 0

    rows.forEach(row => {
      const conversationId = String(row.conversationId || '').trim()
      if (!conversationId) return

      const old = this.readMetas().find(item => item.storeId === storeId && item.conversationId === conversationId) || null
      const cloudAlias = this.normalizeNullableString(row.merchantAlias)
      const localAlias = this.normalizeNullableString(old?.alias)
      const mergedAlias = cloudAlias || localAlias

      this.upsertMetaEntity({
        storeId,
        conversationId,
        pinnedAtMs: old?.pinnedAtMs || 0,
        isDeleted: Boolean(row.merchantArchived),
        deletedAtMs: Number(row.merchantArchivedAtMs || 0),
        alias: mergedAlias,
        customerSeq: old?.customerSeq ?? (Number(row.customerSeq) > 0 ? Number(row.customerSeq) : null)
      })

      count++
    })

    return count
  }

  async isThreadPinned(storeIdInput: string, conversationIdInput: string): Promise<boolean> {
    const meta = await this.getThreadMeta(storeIdInput, conversationIdInput)
    return (meta?.pinnedAtMs || 0) > 0
  }

  async getThreadAlias(storeIdInput: string, conversationIdInput: string): Promise<string | null> {
    const meta = await this.getThreadMeta(storeIdInput, conversationIdInput)
    return this.normalizeNullableString(meta?.alias)
  }

  async resolveMerchantThreadDisplayName(storeIdInput: string, conversationIdInput: string): Promise<string> {
    const meta = await this.getThreadMeta(storeIdInput, conversationIdInput)
    const alias = this.normalizeNullableString(meta?.alias)

    if (alias) return alias

    const seq = Number(meta?.customerSeq || 0)
    if (Number.isFinite(seq) && seq > 0) {
      return `Customer #${Math.trunc(seq)}`
    }

    return 'Customer'
  }

  async resolveMerchantThreadPushDisplayName(storeIdInput: string, conversationIdInput: string): Promise<string> {
    const meta = await this.getThreadMeta(storeIdInput, conversationIdInput)
    const alias = this.normalizeNullableString(meta?.alias)

    if (alias) return alias

    if (this.isChatCloudEnabled()) {
      const summaries = await this.fetchCloudThreadSummaries(
        storeIdInput,
        `P${Date.now()}_${storeIdInput.slice(-4)}`
      )
      const matched = summaries.find(item => item.conversationId === conversationIdInput)
      const seq = Number(matched?.customerSeq || 0)

      if (Number.isFinite(seq) && seq > 0) {
        return `Customer #${Math.trunc(seq)}`
      }
    }

    const localSeq = Number(meta?.customerSeq || 0)
    if (Number.isFinite(localSeq) && localSeq > 0) {
      return `Customer #${Math.trunc(localSeq)}`
    }

    return 'New Customer'
  }

  async setThreadMetaSeq(
    storeIdInput: string,
    conversationIdInput: string,
    customerSeqInput: number | null | undefined
  ): Promise<void> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    const customerSeq = Number(customerSeqInput)

    if (!storeId || !conversationId) return
    if (!Number.isFinite(customerSeq) || customerSeq <= 0) return

    const old = await this.getThreadMeta(storeId, conversationId)
    if (old?.customerSeq === Math.trunc(customerSeq)) return

    this.upsertMetaEntity({
      storeId,
      conversationId,
      pinnedAtMs: old?.pinnedAtMs || 0,
      isDeleted: old?.isDeleted || false,
      deletedAtMs: old?.deletedAtMs || 0,
      alias: old?.alias || null,
      customerSeq: Math.trunc(customerSeq)
    })
  }

  async setThreadAlias(storeIdInput: string, conversationIdInput: string, aliasInput: string | null): Promise<void> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return

    const alias = this.normalizeNullableString(aliasInput)
    const old = await this.getThreadMeta(storeId, conversationId)

    this.upsertMetaEntity({
      storeId,
      conversationId,
      pinnedAtMs: old?.pinnedAtMs || 0,
      isDeleted: old?.isDeleted || false,
      deletedAtMs: old?.deletedAtMs || 0,
      alias,
      customerSeq: old?.customerSeq ?? null
    })

    await this.upsertMerchantThreadMetaToCloud({
      storeId,
      conversationId,
      merchantAlias: alias,
      merchantArchived: old?.isDeleted || false,
      merchantArchivedAtMs: old?.deletedAtMs || 0
    })
  }

  async setThreadPinned(storeIdInput: string, conversationIdInput: string, pinned: boolean): Promise<void> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return

    const now = Date.now()
    const old = await this.getThreadMeta(storeId, conversationId)

    this.upsertMetaEntity({
      storeId,
      conversationId,
      pinnedAtMs: pinned ? now : 0,
      isDeleted: old?.isDeleted || false,
      deletedAtMs: old?.deletedAtMs || 0,
      alias: old?.alias || null,
      customerSeq: old?.customerSeq ?? null
    })
  }

  async markThreadDeleted(storeIdInput: string, conversationIdInput: string, deleted: boolean): Promise<void> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return

    const old = await this.getThreadMeta(storeId, conversationId)
    const deletedAtMs = deleted ? Date.now() : 0

    this.upsertMetaEntity({
      storeId,
      conversationId,
      pinnedAtMs: deleted ? 0 : old?.pinnedAtMs || 0,
      isDeleted: deleted,
      deletedAtMs,
      alias: old?.alias || null,
      customerSeq: old?.customerSeq ?? null
    })

    await this.upsertMerchantThreadMetaToCloud({
      storeId,
      conversationId,
      merchantAlias: old?.alias || null,
      merchantArchived: deleted,
      merchantArchivedAtMs: deletedAtMs
    })
  }

  async deleteThreadLocal(storeIdInput: string, conversationIdInput: string): Promise<void> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return

    const oldMeta = await this.getThreadMeta(storeId, conversationId)
    const keepAlias = this.normalizeNullableString(oldMeta?.alias)
    const deletedAtMs = Date.now()

    const deletedMessages = await this.localDb.listByConversation(storeId, conversationId)

    this.markMessagesLocallyDeleted(deletedMessages)
    await this.localDb.deleteByIds(storeId, deletedMessages.map(item => item.id))

    this.writeMetas(this.readMetas().filter(item => !(item.storeId === storeId && item.conversationId === conversationId)))

    this.upsertMetaEntity({
      storeId,
      conversationId,
      pinnedAtMs: 0,
      isDeleted: true,
      deletedAtMs,
      alias: keepAlias,
      customerSeq: oldMeta?.customerSeq ?? null
    })

    await this.upsertMerchantThreadMetaToCloud({
      storeId,
      conversationId,
      merchantAlias: keepAlias,
      merchantArchived: true,
      merchantArchivedAtMs: deletedAtMs
    })
  }

  private async reviveDeletedThreadIfNeeded(
    storeId: string,
    conversationId: string,
    latestNewMessageTimeMs: number
  ): Promise<void> {
    const old = await this.getThreadMeta(storeId, conversationId)
    if (!old) return
    if (!old.isDeleted) return
    if (latestNewMessageTimeMs <= old.deletedAtMs) return

    this.upsertMetaEntity({
      ...old,
      isDeleted: false
    })

    await this.upsertMerchantThreadMetaToCloud({
      storeId,
      conversationId,
      merchantAlias: old.alias,
      merchantArchived: false,
      merchantArchivedAtMs: old.deletedAtMs
    })
  }

  // --------------------
  // Cloud -> local sync
  // --------------------

  async fetchCloudThreadSummaries(
    storeIdInput: string,
    traceId?: string | null,
    limitInput: number = SHOWCASE_PAGE_SIZE.chatThreads,
    offsetInput = 0
  ): Promise<CloudThreadSummary[]> {
    const storeId = storeIdInput.trim()
    const limit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || SHOWCASE_PAGE_SIZE.chatThreads), 300))
    const offset = Math.max(0, Math.trunc(Number(offsetInput) || 0))

    if (!storeId || !this.isChatCloudEnabled() || !this.chatCloud) return []

    const rows: MerchantThreadSummaryCloudRow[] = await this.chatCloud.fetchThreadSummaries(
      storeId,
      limit,
      this.effectiveTraceId(traceId),
      offset
    )

    return rows.map(item => ({
      conversationId: item.conversationId,
      storeId: item.storeId,
      clientId: item.clientId,
      customerSeq: item.customerSeq,
      merchantAlias: item.merchantAlias,
      lastMessageAtIso: item.lastMessageAtIso,
      lastPreview: item.lastPreview,
      updatedAtIso: item.updatedAtIso
    }))
  }
  async searchCloudThreadSummariesByCustomerName(
    storeIdInput: string,
    keywordInput: string,
    traceId?: string | null,
    limitInput: number = SHOWCASE_PAGE_SIZE.chatThreads,
    offsetInput = 0
  ): Promise<CloudThreadSummary[]> {
    const storeId = storeIdInput.trim()
    const keyword = String(keywordInput || '').trim()
    const limit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || SHOWCASE_PAGE_SIZE.chatThreads), 300))
    const offset = Math.max(0, Math.trunc(Number(offsetInput) || 0))

    if (!storeId || !keyword || !this.isChatCloudEnabled() || !this.chatCloud) return []

    const rows: MerchantThreadSummaryCloudRow[] = await this.chatCloud.searchThreadSummariesByCustomerName(
      storeId,
      keyword,
      limit,
      this.effectiveTraceId(traceId),
      offset
    )

    return rows.map(item => ({
      conversationId: item.conversationId,
      storeId: item.storeId,
      clientId: item.clientId,
      customerSeq: item.customerSeq,
      merchantAlias: item.merchantAlias,
      lastMessageAtIso: item.lastMessageAtIso,
      lastPreview: item.lastPreview,
      updatedAtIso: item.updatedAtIso
    }))
  }
  async listMessagesAroundMessage(input: {
    storeId: string
    conversationId: string
    messageId: string
    perspectiveRole: string
    clientId?: string | null
    beforeLimit?: number
    afterLimit?: number
    traceId?: string | null
  }): Promise<ChatMessagesAroundMessageResult> {
    const storeId = String(input.storeId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const messageId = String(input.messageId || '').trim()
    const perspectiveRole = String(input.perspectiveRole || '').trim()
    const clientId = String(input.clientId || '').trim() || null
    const beforeLimit = Math.max(0, Math.min(Math.trunc(Number(input.beforeLimit) || 15), 100))
    const afterLimit = Math.max(0, Math.min(Math.trunc(Number(input.afterLimit) || 15), 100))

    if (!storeId || !conversationId || !messageId) {
      return {
        messages: [],
        targetMessage: null,
        found: false,
        source: 'none',
        hasOlder: false,
        hasNewer: false,
        oldestTimeMs: null,
        newestTimeMs: null
      }
    }

    const localResult = await this.listLocalMessagesAroundMessage({
      storeId,
      conversationId,
      messageId,
      beforeLimit,
      afterLimit
    })

    if (localResult.found && localResult.targetMessage) {
      return localResult
    }

    const cloudResult = await this.fetchCloudMessagesAroundMessage({
      storeId,
      conversationId,
      messageId,
      perspectiveRole,
      clientId,
      beforeLimit,
      afterLimit,
      traceId: this.effectiveTraceId(input.traceId)
    })

    if (cloudResult.found && cloudResult.targetMessage) {
      return cloudResult
    }

    return {
      messages: [],
      targetMessage: null,
      found: false,
      source: 'none',
      hasOlder: false,
      hasNewer: false,
      oldestTimeMs: null,
      newestTimeMs: null
    }
  }

  async listNewerMessagesAfterTime(input: {
    storeId: string
    conversationId: string
    afterTimeMs: number
    perspectiveRole: string
    clientId?: string | null
    limit?: number
    traceId?: string | null
  }): Promise<ChatMessageEntity[]> {
    const storeId = String(input.storeId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const afterTimeMs = Number(input.afterTimeMs || 0)
    const perspectiveRole = String(input.perspectiveRole || '').trim()
    const clientId = String(input.clientId || '').trim() || null
    const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatMessages), 100))

    if (!storeId || !conversationId || !Number.isFinite(afterTimeMs) || afterTimeMs <= 0) return []

    const localMessages = await this.listLocalMessagesAfterTime({
      storeId,
      conversationId,
      afterTimeMs,
      limit
    })

    if (localMessages.length >= limit) {
      return localMessages
    }

    const cloudMessages = await this.fetchCloudMessagesAfterTime({
      storeId,
      conversationId,
      afterTimeMs,
      perspectiveRole,
      clientId,
      limit,
      traceId: this.effectiveTraceId(input.traceId)
    })

    const merged = new Map<string, ChatMessageEntity>()

    localMessages.forEach(item => {
      if (item.id.trim()) merged.set(item.id, item)
    })

    cloudMessages.forEach(item => {
      if (item.id.trim()) merged.set(item.id, item)
    })

    return Array.from(merged.values())
      .filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id))
      .sort((left, right) => {
        const byTime = Number(left.timeMs || 0) - Number(right.timeMs || 0)
        if (byTime !== 0) return byTime
        return left.id.localeCompare(right.id)
      })
      .slice(0, limit)
  }

  async listOlderMessagesBeforeTime(input: {
    storeId: string
    conversationId: string
    beforeTimeMs: number
    perspectiveRole: string
    clientId?: string | null
    limit?: number
    traceId?: string | null
  }): Promise<ChatMessageEntity[]> {
    const storeId = String(input.storeId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const beforeTimeMs = Number(input.beforeTimeMs || 0)
    const perspectiveRole = String(input.perspectiveRole || '').trim()
    const clientId = String(input.clientId || '').trim() || null
    const limit = Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatMessages), 100))

    if (!storeId || !conversationId || !Number.isFinite(beforeTimeMs) || beforeTimeMs <= 0) return []

    const localMessages = await this.listLocalMessagesBeforeTime({
      storeId,
      conversationId,
      beforeTimeMs,
      limit
    })

    if (localMessages.length >= limit) {
      return localMessages
    }

    const cloudMessages = await this.fetchCloudMessagesBeforeTime({
      storeId,
      conversationId,
      beforeTimeMs,
      perspectiveRole,
      clientId,
      limit,
      traceId: this.effectiveTraceId(input.traceId)
    })

    const merged = new Map<string, ChatMessageEntity>()

    localMessages.forEach(item => {
      if (item.id.trim()) merged.set(item.id, item)
    })

    cloudMessages.forEach(item => {
      if (item.id.trim()) merged.set(item.id, item)
    })

    return Array.from(merged.values())
      .filter(item => !this.isMessageLocallyDeleted(item.storeId, item.conversationId, item.id))
      .sort((left, right) => {
        const byTime = Number(left.timeMs || 0) - Number(right.timeMs || 0)
        if (byTime !== 0) return byTime
        return left.id.localeCompare(right.id)
      })
      .slice(0, limit)
  }

  async pruneLocalChatCache(input: {
    storeId: string
    protectedMessageIds?: string[]
  }): Promise<number> {
    const storeId = String(input.storeId || '').trim()
    if (!storeId) return 0

    return this.localDb.pruneMessagesForStore(
      storeId,
      input.protectedMessageIds || []
    )
  }

  async syncConversationFromCloud(input: {
    storeId: string
    conversationId: string
    perspectiveRole: string
    clientId?: string | null
    traceId?: string | null
    limit?: number
    offset?: number
  }): Promise<number> {
    const storeId = input.storeId.trim()
    const conversationId = input.conversationId.trim()
    const perspectiveRole = input.perspectiveRole.trim()
    const clientId = String(input.clientId || '').trim() || null
    const asMerchant = perspectiveRole === 'merchant'

    if (!storeId || !conversationId) return 0
    if (!this.isChatCloudEnabled() || !this.chatCloud) return 0

    const cloudMessages = await this.chatCloud.fetchMessagesByConversation(
      storeId,
      conversationId,
      clientId,
      asMerchant,
      Math.max(1, Math.min(Math.trunc(Number(input.limit) || SHOWCASE_PAGE_SIZE.chatMessages), 500)),
      this.effectiveTraceId(input.traceId),
      Math.max(0, Math.trunc(Number(input.offset) || 0))
    )

    if (!cloudMessages.length) return 0

    const meta = await this.getThreadMeta(storeId, conversationId)
    const localCutoffMs = meta?.deletedAtMs || 0

    const sourceMessagesBeforeTombstoneFilter = localCutoffMs > 0
      ? cloudMessages.filter(item => Number(item.timeMs || 0) > localCutoffMs)
      : cloudMessages

    const sourceMessages = sourceMessagesBeforeTombstoneFilter.filter(item => {
      const messageId = String(item.id || '').trim()
      if (!messageId) return false

      return !this.isMessageLocallyDeleted(storeId, conversationId, messageId)
    })

    if (!sourceMessages.length) return 0

    let count = 0

    for (const message of sourceMessages) {
      const entity = this.cloudMessageToLocalEntity(message, perspectiveRole)
      this.upsertMessageEntity(entity)
      count++
    }

    const latestNewMessageTimeMs = Math.max(...sourceMessages.map(item => Number(item.timeMs || 0)))

    if (count > 0 && Number.isFinite(latestNewMessageTimeMs)) {
      await this.reviveDeletedThreadIfNeeded(storeId, conversationId, latestNewMessageTimeMs)
    }

    return count
  }

  async markAllOutgoingRead(storeIdInput: string, conversationIdInput: string): Promise<void> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    if (!storeId || !conversationId) return

    await this.localDb.markAllOutgoingRead(storeId, conversationId)
  }

  async markMerchantMessagesRead(storeIdInput: string, conversationIdInput: string): Promise<void> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    if (!storeId || !conversationId) return

    await this.localDb.markMerchantMessagesRead(storeId, conversationId)
  }

  async markMerchantMessagesReadByStoreAndClient(
    storeIdInput: string,
    clientIdInput: string
  ): Promise<void> {
    const storeId = storeIdInput.trim()
    const clientId = clientIdInput.trim()

    if (!storeId || !clientId) return

    await this.localDb.markMerchantMessagesReadByStoreAndClient(storeId, clientId)
  }

  async markUserMessagesReadToCloud(
    storeIdInput: string,
    conversationIdInput: string,
    traceId?: string | null
  ): Promise<boolean> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()

    if (!storeId || !conversationId) return false

    await this.markAllRead(storeId, conversationId)

    if (!this.isChatCloudEnabled() || !this.chatCloud) return false

    return this.chatCloud.markUserMessagesRead(
      storeId,
      conversationId,
      this.effectiveTraceId(traceId)
    )
  }

  async markMerchantMessagesReadToCloud(
    storeIdInput: string,
    conversationIdInput: string,
    clientIdInput: string,
    traceId?: string | null
  ): Promise<boolean> {
    const storeId = storeIdInput.trim()
    const conversationId = conversationIdInput.trim()
    const clientId = clientIdInput.trim()

    if (!storeId || !conversationId || !clientId) return false

    await this.markMerchantMessagesRead(storeId, conversationId)

    if (!this.isChatCloudEnabled() || !this.chatCloud) return false

    return this.chatCloud.markMerchantMessagesRead(
      storeId,
      conversationId,
      clientId,
      this.effectiveTraceId(traceId)
    )
  }

  async markMerchantMessagesReadByStoreAndClientToCloud(
    storeIdInput: string,
    clientIdInput: string,
    traceId?: string | null
  ): Promise<boolean> {
    const storeId = storeIdInput.trim()
    const clientId = clientIdInput.trim()

    if (!storeId || !clientId) return false

    await this.markMerchantMessagesReadByStoreAndClient(storeId, clientId)

    if (!this.isChatCloudEnabled() || !this.chatCloud) return false

    return this.chatCloud.markMerchantMessagesReadByStoreAndClient(
      storeId,
      clientId,
      this.effectiveTraceId(traceId)
    )
  }

  async uploadChatImageToPublicUrl(input: ChatImageUploadInput): Promise<string | null> {
    if (!this.isChatCloudEnabled() || !this.chatCloud) return null

    return this.chatCloud.uploadChatImageToPublicUrl(input)
  }

  async insertMessageToCloud(
    entityInput: ChatMessageEntity,
    traceId?: string | null
  ): Promise<boolean> {
    const entity = this.normalizeMessageEntity(entityInput)
    if (!entity) return false

    if (!this.isChatCloudEnabled() || !this.chatCloud) {
      this.upsertMessageEntity({
        ...entity,
        status: 'failed'
      })
      return false
    }

    this.upsertMessageEntity({
      ...entity,
      status: 'sending'
    })

    const ok = await this.chatCloud.insertMessage(
      this.localEntityToCloudMessage(entity),
      this.effectiveTraceId(traceId)
    )

    this.upsertMessageEntity({
      ...entity,
      status: ok ? 'sent' : 'failed'
    })

    return ok
  }

  async retryMessageToCloud(
    storeIdInput: string,
    messageIdInput: string,
    traceId?: string | null
  ): Promise<boolean> {
    const storeId = String(storeIdInput || '').trim()
    const messageId = String(messageIdInput || '').trim()
    if (!storeId || !messageId) return false

    const entity = await this.localDb.findById(storeId, messageId)
    if (!entity) return false

    return this.insertMessageToCloud({
      ...entity,
      status: 'sending'
    }, traceId)
  }

  async consumeRelayForMerchant(): Promise<number> {
    return 0
  }

  async consumeRelayForClient(): Promise<number> {
    return 0
  }

  async enqueueReadReceiptForClient(): Promise<boolean> {
    return false
  }

  private localEntityToCloudMessage(entity: ChatMessageEntity): ChatCloudMsg {
    const role = String(entity.role || '').trim().toLowerCase()
    const normalizedRole = role === 'merchant' || role === 'admin'
      ? 'merchant'
      : 'client'

    const direction = entity.direction === 'out' || entity.direction === 'in'
      ? entity.direction
      : normalizedRole === 'merchant'
        ? 'out'
        : 'in'

    return {
      id: entity.id,
      conversationId: entity.conversationId,
      storeId: entity.storeId,
      clientId: entity.clientId,
      role: normalizedRole,
      direction,
      text: entity.text,
      timeMs: Number(entity.timeMs || 0) > 0 ? Number(entity.timeMs || 0) : Date.now(),
      isRead: Boolean(entity.isRead)
    }
  }

  private cloudMessageToLocalEntity(message: ChatCloudMsg, perspectiveRole: string): ChatMessageEntity {
    const role = String(message.role || '').trim().toLowerCase()
    const cloudDirection = String(message.direction || '').trim().toLowerCase()
    const normalizedRole = role === 'merchant' || role === 'admin' ? 'merchant' : 'client'

    let direction: ShowcaseChatLocalDirection
    if (cloudDirection === 'in' || cloudDirection === 'out') {
      direction = cloudDirection
    } else {
      direction = normalizedRole === 'merchant' ? 'out' : 'in'
    }

    void perspectiveRole

    return {
      id: message.id,
      conversationId: message.conversationId,
      storeId: message.storeId,
      clientId: message.clientId,
      role: normalizedRole,
      direction,
      text: message.text,
      timeMs: Number(message.timeMs || 0),
      status: 'sent',
      isRead: Boolean(message.isRead)
    }
  }

  private numberToIso(value: number | null | undefined): string | null {
    const ms = Number(value)
    if (!Number.isFinite(ms) || ms <= 0) return null

    const date = new Date(ms)
    if (Number.isNaN(date.getTime())) return null

    return date.toISOString()
  }

  private extractCustomerSeq(item: ChatThreadSummary): number | null {
    const title = String(item.title || '').trim()
    const match = title.match(/^Customer\s+#(\d+)$/i)
    if (!match) return null

    const seq = Number(match[1])
    return Number.isFinite(seq) && seq > 0 ? Math.trunc(seq) : null
  }

  private async upsertMerchantThreadMetaToCloud(input: {
    storeId: string
    conversationId: string
    merchantAlias?: string | null
    merchantArchived?: boolean
    merchantArchivedAtMs?: number | null
  }): Promise<boolean> {
    if (!this.chatCloud) return false

    return this.chatCloud.upsertMerchantThreadMeta(
      input.storeId,
      input.conversationId,
      input.merchantAlias ?? null,
      Boolean(input.merchantArchived),
      Number(input.merchantArchivedAtMs || 0),
      this.effectiveTraceId()
    )
  }
}

export function createShowcaseChatRepository(
  options: ShowcaseChatRepositoryOptions = {}
): ShowcaseChatRepository {
  return new ShowcaseChatRepository(options)
}