import type { ChatMessage, ChatThreadSummary } from '../showcaseCloudRepository'
import {
  formatShowcaseDateAndTimeParts,
  formatShowcaseDateTime
} from '../showcaseDateTime'
import type { ChatThreadMetaEntity, CloudThreadSummary } from './showcaseChatRepository'
import type { ShowcaseChatThreadSummaryUi } from '../showcaseUiContract'
import type { ShowcaseChatGlobalSearchResultUi } from './showcaseChatModels'

const NDJC_QUOTE_START = '⟪Q⟫'
const NDJC_QUOTE_END = '⟪/Q⟫'

const NDJC_IMG_START = '⟪I⟫'
const NDJC_IMG_END = '⟪/I⟫'

const NDJC_PRODUCT_START = '⟪P⟫'
const NDJC_PRODUCT_END = '⟪/P⟫'

const NDJC_APPOINTMENT_START = '⟪B⟫'
const NDJC_APPOINTMENT_END = '⟪/B⟫'

function normalizeThreadPreviewText(input: string): string {
  return String(input || '')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60)
}

function extractProductPreviewFromThreadText(rawText: string): string | null {
  const source = String(rawText || '')
  const start = source.indexOf(NDJC_PRODUCT_START)
  const end = source.indexOf(NDJC_PRODUCT_END)

  if (start < 0 || end < 0 || end <= start) return null

  const inner = source
    .slice(start + NDJC_PRODUCT_START.length, end)
    .trim()

  const line = inner
    .split(/\r?\n/)
    .find(item => item.trim())

  if (!line) return '[Item]'

  const parts = line.split('|')
  const title = normalizeThreadPreviewText(parts[1] || '')

  return title ? `[Item] ${title}` : '[Item]'
}

function formatAppointmentPreviewDate(dateInput: string, timeInput: string): string {
  return formatShowcaseDateAndTimeParts(dateInput, timeInput)
}

function shortenAppointmentPreviewTitle(titleInput: string): string {
  const title = normalizeThreadPreviewText(titleInput)

  if (!title) return ''

  return title.length > 14 ? `${title.slice(0, 14)}...` : title
}

function extractAppointmentPreviewFromThreadText(rawText: string): string | null {
  const source = String(rawText || '')
  const start = source.indexOf(NDJC_APPOINTMENT_START)
  const end = source.indexOf(NDJC_APPOINTMENT_END)

  if (start < 0 || end < 0 || end <= start) return null

  const inner = source
    .slice(start + NDJC_APPOINTMENT_START.length, end)
    .trim()

  const line = inner
    .split(/\r?\n/)
    .find(item => item.trim())

  if (!line) return '[Booking]'

  const parts = line.split('|')
  const title = shortenAppointmentPreviewTitle(parts[1] || '')
  const dateText = formatAppointmentPreviewDate(parts[2] || '', parts[3] || '')

  if (title && dateText) return `[Booking] ${title} · ${dateText}`
  if (title) return `[Booking] ${title}`
  if (dateText) return `[Booking] ${dateText}`

  return '[Booking]'
}

export function buildThreadPreview(rawText: string): string {
  const raw = String(rawText || '')
  if (!raw.trim()) return ''

  const appointmentPreview = extractAppointmentPreviewFromThreadText(raw)
  if (appointmentPreview) {
    return appointmentPreview
  }

  const productPreview = extractProductPreviewFromThreadText(raw)
  if (productPreview) {
    return productPreview
  }

  if (raw.includes(NDJC_IMG_START)) {
    return '[Photo]'
  }

  let text = raw.trim()

  const firstMarker = text.indexOf('⟪')
  if (firstMarker >= 0 && firstMarker <= 3) {
    text = text.slice(firstMarker)
  }

  if (text.startsWith(NDJC_QUOTE_START)) {
    const end = text.indexOf(NDJC_QUOTE_END)
    if (end > 0) {
      text = text.slice(end + NDJC_QUOTE_END.length).replace(/^[\n ]+/, '')
    } else {
      return ''
    }
  }

  return normalizeThreadPreviewText(text)
}

export function extractMainBodyForChatListSearch(rawText: string): string {
  const raw = String(rawText || '')
  if (!raw.trim()) return ''
  if (raw.includes(NDJC_PRODUCT_START)) return ''
  if (raw.includes(NDJC_APPOINTMENT_START)) return ''

  let text = raw.trim()

  const firstMarker = text.indexOf('⟪')
  if (firstMarker >= 0 && firstMarker <= 3) {
    text = text.slice(firstMarker)
  }

  text = stripMarkedBlock(text, NDJC_IMG_START, NDJC_IMG_END)
  text = stripMarkedBlock(text, NDJC_QUOTE_START, NDJC_QUOTE_END)
  text = stripMarkedBlock(text, NDJC_PRODUCT_START, NDJC_PRODUCT_END)
  text = stripMarkedBlock(text, NDJC_APPOINTMENT_START, NDJC_APPOINTMENT_END)

  return text
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function formatChatListTimeMs(value: number | null | undefined): string {
  return formatShowcaseDateTime(value)
}

export function normalizeChatThreadTitle(input: {
  title?: string | null
  customerSeq?: number | null
  fallback?: string
}): string {
  const title = String(input.title || '').trim()

  if (title && title.toLowerCase() !== 'null') {
    return title
  }

  const seq = Number(input.customerSeq || 0)
  if (Number.isFinite(seq) && seq > 0) {
    return `Customer #${Math.trunc(seq)}`
  }

  return input.fallback || 'Customer'
}

export function sortMerchantThreadsByPinnedAndLastMessage<T extends {
  pinned: boolean
  lastMessageAt: number | null
}>(items: T[]): T[] {
  return [...items].sort((left, right) => {
    const leftPinned = left.pinned ? 1 : 0
    const rightPinned = right.pinned ? 1 : 0

    if (leftPinned !== rightPinned) {
      return rightPinned - leftPinned
    }

    const leftTime = Number(left.lastMessageAt || 0)
    const rightTime = Number(right.lastMessageAt || 0)

    return rightTime - leftTime
  })
}

export function mergeMerchantThreads(input: {
  cloudItems: ChatThreadSummary[]
  localItems: ChatThreadSummary[]
}): ChatThreadSummary[] {
  if (!input.cloudItems.length) return sortMerchantThreadsByPinnedAndLastMessage(input.localItems)
  if (!input.localItems.length) return sortMerchantThreadsByPinnedAndLastMessage(input.cloudItems)

  const merged = new Map<string, ChatThreadSummary>()

  input.cloudItems.forEach(item => {
    if (item.conversationId) {
      merged.set(item.conversationId, item)
    }
  })

  input.localItems.forEach(item => {
    if (item.conversationId && !merged.has(item.conversationId)) {
      merged.set(item.conversationId, item)
    }
  })

  return sortMerchantThreadsByPinnedAndLastMessage(Array.from(merged.values()))
}

export function buildMerchantThreadsFromCloudSummaries(summaries: ChatThreadSummary[]): ChatThreadSummary[] {
  const normalized = summaries
    .map(item => {
      const conversationId = String(item.conversationId || '').trim()
      if (!conversationId) return null

      const preview = buildThreadPreview(item.lastMessage)
      const lastMessageAt = Number.isFinite(Number(item.lastMessageAt))
        ? Number(item.lastMessageAt)
        : null

      if (lastMessageAt == null && !preview) return null

      return {
        ...item,
        conversationId,
        storeId: String(item.storeId || '').trim(),
        clientId: item.clientId == null ? null : String(item.clientId).trim() || null,
        title: normalizeChatThreadTitle({
          title: item.title,
          fallback: 'Customer'
        }),
        lastMessage: preview,
        lastMessageAt,
        unreadCount: Math.max(0, Math.trunc(Number(item.unreadCount || 0))),
        pinned: Boolean(item.pinned)
      }
    })
    .filter((item): item is ChatThreadSummary => Boolean(item))

  return sortMerchantThreadsByPinnedAndLastMessage(normalized)
}

export function chatThreadSummaryToUi(item: ChatThreadSummary): ShowcaseChatThreadSummaryUi {
  return {
    conversationId: item.conversationId,
    title: normalizeChatThreadTitle({
      title: item.title,
      fallback: 'Customer'
    }),
    subtitle: item.clientId || '',
    lastMessage: buildThreadPreview(item.lastMessage),
    lastMessageAtText: formatChatListTimeMs(item.lastMessageAt),
    unreadCount: Math.max(0, Math.trunc(Number(item.unreadCount || 0))),
    pinned: Boolean(item.pinned),
    avatarUrl: null
  }
}

export function searchMessagesAndNames(input: {
  messages: ChatMessage[]
  threads: ChatThreadSummary[]
  keyword: string
  merchantSenderLabel: string
  allowedConversationIds?: Set<string> | null
}): ShowcaseChatGlobalSearchResultUi[] {
  const keyword = input.keyword.trim()
  if (!keyword) return []

  const allowed = input.allowedConversationIds && input.allowedConversationIds.size
    ? input.allowedConversationIds
    : null

  const threadMap = new Map<string, ChatThreadSummary>()
  input.threads.forEach(thread => {
    if (thread.conversationId) {
      threadMap.set(thread.conversationId, thread)
    }
  })

  const messageHits = input.messages
    .filter(message => {
      if (allowed && !allowed.has(message.conversationId)) return false
      if (!threadMap.has(message.conversationId)) return false

      const body = extractMainBodyForChatListSearch(message.body)
      return body.toLowerCase().includes(keyword.toLowerCase())
    })
    .sort((left, right) => Number(right.createdAt || 0) - Number(left.createdAt || 0))
    .slice(0, 80)
    .map(message => {
      const thread = threadMap.get(message.conversationId)
      const displayName = normalizeChatThreadTitle({
        title: thread?.title,
        fallback: 'Customer'
      })
      const senderRole = String(message.senderRole || '').trim().toLowerCase()
      const senderLabel = senderRole === 'merchant'
        ? input.merchantSenderLabel.trim() || 'Merchant'
        : displayName
      const body = extractMainBodyForChatListSearch(message.body)

      return {
        conversationId: message.conversationId,
        messageId: message.id,
        displayName,
        senderLabel,
        snippet: body.slice(0, 60),
        timeMs: Number(message.createdAt || 0),
        timeText: formatChatListTimeMs(message.createdAt),
        matchedInName: false
      }
    })

  const nameHits = input.threads
    .filter(thread => {
      if (allowed && !allowed.has(thread.conversationId)) return false

      const title = normalizeChatThreadTitle({
        title: thread.title,
        fallback: 'Customer'
      })

      return title.toLowerCase().includes(keyword.toLowerCase())
    })
    .map(thread => {
      const displayName = normalizeChatThreadTitle({
        title: thread.title,
        fallback: 'Customer'
      })

      return {
        conversationId: thread.conversationId,
        messageId: null,
        displayName,
        senderLabel: displayName,
        snippet: buildThreadPreview(thread.lastMessage),
        timeMs: Number(thread.lastMessageAt || 0),
        timeText: formatChatListTimeMs(thread.lastMessageAt),
        matchedInName: true
      }
    })

  return [...messageHits, ...nameHits]
    .filter(item => item.conversationId)
    .filter((item, index, all) => {
      const key = `${item.conversationId}:${item.messageId || ''}`
      return all.findIndex(other => `${other.conversationId}:${other.messageId || ''}` === key) === index
    })
    .sort((left, right) => right.timeMs - left.timeMs)
}

export function parseCloudIsoToMs(iso: string | null | undefined): number | null {
  const raw = String(iso || '').trim()
  if (!raw) return null

  const direct = Date.parse(raw)
  if (Number.isFinite(direct)) return direct

  const normalized = raw.includes('T')
    ? raw
    : raw.replace(' ', 'T')

  const normalizedMs = Date.parse(normalized)
  if (Number.isFinite(normalizedMs)) return normalizedMs

  const withUtc = normalized.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(normalized)
    ? normalized
    : `${normalized}Z`

  const utcMs = Date.parse(withUtc)
  return Number.isFinite(utcMs) ? utcMs : null
}

export function cloudThreadSummaryToLegacyChatThread(thread: CloudThreadSummary): ChatThreadSummary {
  const seq = Number(thread.customerSeq || 0)
  const titleFromAlias = String(thread.merchantAlias || '').trim()
  const titleFromSeq = Number.isFinite(seq) && seq > 0
    ? `Customer #${Math.trunc(seq)}`
    : ''

  const lastMessageMs = parseCloudIsoToMs(thread.lastMessageAtIso)
  const updatedMs = parseCloudIsoToMs(thread.updatedAtIso)
  const lastMs = lastMessageMs ?? updatedMs ?? null

  return {
    conversationId: String(thread.conversationId || '').trim(),
    storeId: String(thread.storeId || '').trim(),
    clientId: thread.clientId == null ? null : String(thread.clientId).trim() || null,
    title: titleFromAlias || titleFromSeq || String(thread.clientId || '').trim() || 'Customer',
    lastMessage: String(thread.lastPreview || ''),
    lastMessageAt: lastMs,
    unreadCount: 0,
    pinned: false
  }
}

export function buildMerchantThreadsWithLocalMeta(input: {
  cloudThreads: ChatThreadSummary[]
  localMetaList: ChatThreadMetaEntity[]
}): ChatThreadSummary[] {
  const localMetaByConversationId = new Map(
    input.localMetaList.map(meta => [meta.conversationId, meta])
  )

  const mergedThreads = input.cloudThreads
    .map(thread => {
      const conversationId = String(thread.conversationId || '').trim()
      if (!conversationId) return null

      const meta = localMetaByConversationId.get(conversationId)
      if (meta?.isDeleted) return null

      const localAlias = String(meta?.alias || '').trim()
      const localSeq = Number(meta?.customerSeq || 0)
      const titleFromSeq = Number.isFinite(localSeq) && localSeq > 0
        ? `Customer #${Math.trunc(localSeq)}`
        : ''
      const pinnedAtMs = Math.max(0, Math.trunc(Number(meta?.pinnedAtMs || 0)))

      return {
        thread: {
          ...thread,
          conversationId,
          title: localAlias || titleFromSeq || thread.title,
          pinned: Boolean(thread.pinned || pinnedAtMs > 0)
        },
        pinnedAtMs,
        lastMessageAt: Number(thread.lastMessageAt || 0)
      }
    })
    .filter((item): item is {
      thread: ChatThreadSummary
      pinnedAtMs: number
      lastMessageAt: number
    } => Boolean(item))

  return mergedThreads
    .sort((left, right) => {
      if (left.pinnedAtMs !== right.pinnedAtMs) {
        return right.pinnedAtMs - left.pinnedAtMs
      }

      const leftPinned = left.thread.pinned ? 1 : 0
      const rightPinned = right.thread.pinned ? 1 : 0

      if (leftPinned !== rightPinned) {
        return rightPinned - leftPinned
      }

      return right.lastMessageAt - left.lastMessageAt
    })
    .map(item => item.thread)
    .map(thread => buildMerchantThreadsFromCloudSummaries([thread])[0])
    .filter((thread): thread is ChatThreadSummary => Boolean(thread))
}

export function applyMerchantThreadPinned(input: {
  threads: ChatThreadSummary[]
  conversationId: string
  pinned: boolean
}): ChatThreadSummary[] {
  const conversationId = input.conversationId.trim()
  if (!conversationId) return input.threads

  return buildMerchantThreadsFromCloudSummaries(input.threads.map(thread => {
    if (thread.conversationId !== conversationId) return thread

    return {
      ...thread,
      pinned: Boolean(input.pinned)
    }
  }))
}

export function applyMerchantThreadRead(input: {
  threads: ChatThreadSummary[]
  conversationId: string
}): ChatThreadSummary[] {
  const conversationId = input.conversationId.trim()
  if (!conversationId) return input.threads

  return input.threads.map(thread => {
    if (thread.conversationId !== conversationId) return thread

    return {
      ...thread,
      unreadCount: 0
    }
  })
}

export function applyMerchantThreadAlias(input: {
  threads: ChatThreadSummary[]
  conversationId: string
  title: string
}): ChatThreadSummary[] {
  const conversationId = input.conversationId.trim()
  const title = input.title.trim()
  if (!conversationId || !title) return input.threads

  return input.threads.map(thread => {
    if (thread.conversationId !== conversationId) return thread

    return {
      ...thread,
      title
    }
  })
}

export function removeMerchantThread(input: {
  threads: ChatThreadSummary[]
  conversationId: string
}): ChatThreadSummary[] {
  const conversationId = input.conversationId.trim()
  if (!conversationId) return input.threads

  return input.threads.filter(thread => thread.conversationId !== conversationId)
}

export type MerchantThreadDeleteResetPlan = {
  shouldResetActiveChat: boolean
  nextActiveConversationId: string
  nextRuntimeActiveConversationId: string
  runtimeChatVisible: boolean
}

export function buildMerchantThreadDeleteResetPlan(input: {
  deletedConversationId: string
  activeConversationId: string | null | undefined
  fallbackConversationId: string
}): MerchantThreadDeleteResetPlan {
  const deletedConversationId = input.deletedConversationId.trim()
  const activeConversationId = String(input.activeConversationId || '').trim()
  const fallbackConversationId = input.fallbackConversationId.trim()

  return {
    shouldResetActiveChat: Boolean(deletedConversationId && activeConversationId === deletedConversationId),
    nextActiveConversationId: fallbackConversationId,
    nextRuntimeActiveConversationId: fallbackConversationId,
    runtimeChatVisible: false
  }
}

export type MerchantThreadPinOperationResult = {
  nextThreads: ChatThreadSummary[]
  shouldSyncActiveChat: boolean
  nextChatPinned: boolean
}

export function buildMerchantThreadPinOperationResult(input: {
  threads: ChatThreadSummary[]
  conversationId: string
  pinned: boolean
  activeConversationId: string | null | undefined
}): MerchantThreadPinOperationResult {
  const conversationId = input.conversationId.trim()
  const nextPinned = Boolean(input.pinned)
  const activeConversationId = String(input.activeConversationId || '').trim()

  return {
    nextThreads: applyMerchantThreadPinned({
      threads: input.threads,
      conversationId,
      pinned: nextPinned
    }),
    shouldSyncActiveChat: Boolean(conversationId && activeConversationId === conversationId),
    nextChatPinned: nextPinned
  }
}

export type MerchantThreadReadOperationResult = {
  nextThreads: ChatThreadSummary[]
  shouldReloadActiveMessages: boolean
  shouldClearChatEntryDot: boolean
}

export function buildMerchantThreadReadOperationResult(input: {
  threads: ChatThreadSummary[]
  conversationId: string
  activeConversationId: string | null | undefined
}): MerchantThreadReadOperationResult {
  const conversationId = input.conversationId.trim()
  const activeConversationId = String(input.activeConversationId || '').trim()
  const isActive = Boolean(conversationId && activeConversationId === conversationId)

  return {
    nextThreads: applyMerchantThreadRead({
      threads: input.threads,
      conversationId
    }),
    shouldReloadActiveMessages: isActive,
    shouldClearChatEntryDot: isActive
  }
}

export type MerchantThreadAliasOperationResult = {
  nextThreads: ChatThreadSummary[]
  shouldUpdateActiveConversation: boolean
  nextActiveCustomerName: string
}

export function buildMerchantThreadAliasOperationResult(input: {
  threads: ChatThreadSummary[]
  conversationId: string
  title: string
  activeConversationId: string | null | undefined
}): MerchantThreadAliasOperationResult {
  const conversationId = input.conversationId.trim()
  const title = input.title.trim()
  const activeConversationId = String(input.activeConversationId || '').trim()

  return {
    nextThreads: applyMerchantThreadAlias({
      threads: input.threads,
      conversationId,
      title
    }),
    shouldUpdateActiveConversation: Boolean(conversationId && title && activeConversationId === conversationId),
    nextActiveCustomerName: title
  }
}

function stripMarkedBlock(textInput: string, startToken: string, endToken: string): string {
  let text = textInput

  while (true) {
    const start = text.indexOf(startToken)
    if (start < 0) break

    const end = text.indexOf(endToken, start + startToken.length)
    if (end < 0) break

    text = `${text.slice(0, start)}${text.slice(end + endToken.length)}`.trim()
  }

  return text
}