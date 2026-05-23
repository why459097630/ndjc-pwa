import { SHOWCASE_TABLES } from '../showcaseCloudConfig'
import type {
  ShowcaseChatAppointmentShare,
  ShowcaseChatProductShare,
  ShowcaseChatWindowMode
} from '../showcaseUiContract'

export const ShowcaseChatTables = {
  TABLE_CONVERSATIONS: SHOWCASE_TABLES.chatConversations,
  TABLE_MESSAGES: SHOWCASE_TABLES.chatMessages,
  SENDER_STORE: 'store',
  SENDER_CLIENT: 'client'
} as const

export type ShowcaseChatSender =
  | typeof ShowcaseChatTables.SENDER_STORE
  | typeof ShowcaseChatTables.SENDER_CLIENT

export type ShowcaseChatGlobalSearchResultUi = {
  conversationId: string
  messageId: string | null
  displayName: string
  senderLabel: string
  snippet: string
  timeMs: number
  timeText: string
  matchedInName: boolean
}

export type ShowcaseChatIdentity = {
  storeId: string
  clientId: string
}

export type ShowcaseChatConversation = {
  id: string
  storeId: string
  clientId: string
  createdAt: string | null
  lastMessageAt: string | null
}

export type ShowcaseChatMessage = {
  id: string
  conversationId: string
  sender: ShowcaseChatSender | string
  body: string
  createdAt: string | null
}

export type ShowcaseChatDirection = 'Incoming' | 'Outgoing'

export type ShowcaseChatSendStatus =
  | 'Idle'
  | 'Sending'
  | 'Sent'
  | 'Failed'

export type ShowcaseChatThreadSummaryUi = {
  threadId: string
  title: string
  lastPreview: string
  lastTimeText: string
  unreadCount: number
  isPinned: boolean
}

export function createShowcaseChatThreadSummaryUi(
  input: {
    threadId: string
    title: string
    lastPreview: string
    lastTimeText: string
    unreadCount: number
    isPinned?: boolean
  }
): ShowcaseChatThreadSummaryUi {
  return {
    threadId: input.threadId,
    title: input.title,
    lastPreview: input.lastPreview,
    lastTimeText: input.lastTimeText,
    unreadCount: Number.isFinite(Number(input.unreadCount))
      ? Number(input.unreadCount)
      : 0,
    isPinned: input.isPinned ?? false
  }
}

export type ShowcaseChatMessageUi = {
  id: string
  direction: ShowcaseChatDirection
  text: string
  timeText: string
  status: ShowcaseChatSendStatus
  isRead: boolean

  quoteMessageId: string | null
  quotePreviewText: string

  isPinned: boolean

  isFindOpen: boolean
  findQuery: string
  findMatchIds: string[]
  findFocusedId: string | null

  scrollToMessageId: string | null
  scrollToMessageSignal: number
}

export type ShowcaseChatQuoteUi = {
  messageId: string
  preview: string
}

export type ShowcaseChatUiStateDomain = {
  title: string
  subtitle: string
  useStoreTitle: boolean
  canTogglePinned: boolean
  isPinned: boolean
  isConnecting: boolean
  isRefreshing: boolean
  isSending: boolean

  isLoadingOlder: boolean
  canLoadOlder: boolean

  errorMessage: string | null

  conversationId: string | null
  draftText: string

  draftImageUris: string[]
  pendingCameraUri: string | null

  messages: ShowcaseChatMessageUi[]

  quote: ShowcaseChatQuoteUi | null

  isSelectionMode: boolean
  selectedIds: string[]

  quoteMessageId: string | null
  quotePreviewText: string
  quoteProduct: ShowcaseChatProductShare | null
  quoteAppointment: ShowcaseChatAppointmentShare | null

  isSearchResults: boolean
  isFindOpen: boolean
  findQuery: string

  globalSearchResults: ShowcaseChatGlobalSearchResultUi[]

  findMatchIds: string[]
  findFocusedIndex: number

  flashMessageId: string | null
  flashSignal: number

  scrollToMessageId: string | null
  scrollToMessageSignal: number

  pendingProduct: ShowcaseChatProductShare | null
  pendingAppointment: ShowcaseChatAppointmentShare | null

  newestCreatedAt: string | null
  oldestCreatedAt: string | null

  windowMode: ShowcaseChatWindowMode
  anchorMessageId: string | null
  hasNewerMessages: boolean
  isLoadingNewerMessages: boolean
  oldestMessageTimeMs: number | null
  newestMessageTimeMs: number | null

  unreadCount: number
  scrollToBottomSignal: number

  findFocusedId: string | null
  findScrollSignal: number
}

export function createDefaultShowcaseChatUiStateDomain(
  input: Partial<ShowcaseChatUiStateDomain> = {}
): ShowcaseChatUiStateDomain {
  return {
    title: input.title || 'Chat',
    subtitle: input.subtitle || '',
    useStoreTitle: input.useStoreTitle ?? true,
    canTogglePinned: input.canTogglePinned ?? false,
    isPinned: input.isPinned ?? false,
    isConnecting: input.isConnecting ?? false,
    isRefreshing: input.isRefreshing ?? false,
    isSending: input.isSending ?? false,

    isLoadingOlder: input.isLoadingOlder ?? false,
    canLoadOlder: input.canLoadOlder ?? true,

    errorMessage: input.errorMessage ?? null,

    conversationId: input.conversationId ?? null,
    draftText: input.draftText || '',

    draftImageUris: Array.isArray(input.draftImageUris) ? input.draftImageUris : [],
    pendingCameraUri: input.pendingCameraUri ?? null,

    messages: Array.isArray(input.messages) ? input.messages : [],

    quote: input.quote ?? null,

    isSelectionMode: input.isSelectionMode ?? false,
    selectedIds: Array.isArray(input.selectedIds) ? input.selectedIds : [],

    quoteMessageId: input.quoteMessageId ?? null,
    quotePreviewText: input.quotePreviewText || '',
    quoteProduct: input.quoteProduct ?? null,
    quoteAppointment: input.quoteAppointment ?? null,

    isSearchResults: input.isSearchResults ?? false,
    isFindOpen: input.isFindOpen ?? false,
    findQuery: input.findQuery || '',

    globalSearchResults: Array.isArray(input.globalSearchResults)
      ? input.globalSearchResults
      : [],

    findMatchIds: Array.isArray(input.findMatchIds) ? input.findMatchIds : [],
    findFocusedIndex: Number.isFinite(Number(input.findFocusedIndex))
      ? Number(input.findFocusedIndex)
      : 0,

    flashMessageId: input.flashMessageId ?? null,
    flashSignal: Number.isFinite(Number(input.flashSignal))
      ? Number(input.flashSignal)
      : 0,

    scrollToMessageId: input.scrollToMessageId ?? null,
    scrollToMessageSignal: Number.isFinite(Number(input.scrollToMessageSignal))
      ? Number(input.scrollToMessageSignal)
      : 0,

    pendingProduct: input.pendingProduct ?? null,
    pendingAppointment: input.pendingAppointment ?? null,

    newestCreatedAt: input.newestCreatedAt ?? null,
    oldestCreatedAt: input.oldestCreatedAt ?? null,

    windowMode: input.windowMode ?? 'latest',
    anchorMessageId: input.anchorMessageId ?? null,
    hasNewerMessages: input.hasNewerMessages ?? false,
    isLoadingNewerMessages: input.isLoadingNewerMessages ?? false,
    oldestMessageTimeMs: Number.isFinite(Number(input.oldestMessageTimeMs))
      ? Number(input.oldestMessageTimeMs)
      : null,
    newestMessageTimeMs: Number.isFinite(Number(input.newestMessageTimeMs))
      ? Number(input.newestMessageTimeMs)
      : null,

    unreadCount: Number.isFinite(Number(input.unreadCount))
      ? Number(input.unreadCount)
      : 0,

    scrollToBottomSignal: Number.isFinite(Number(input.scrollToBottomSignal))
      ? Number(input.scrollToBottomSignal)
      : 0,

    findFocusedId: input.findFocusedId ?? null,
    findScrollSignal: Number.isFinite(Number(input.findScrollSignal))
      ? Number(input.findScrollSignal)
      : 0
  }
}

export function hasShowcaseChatConversation(state: Pick<ShowcaseChatUiStateDomain, 'conversationId'>): boolean {
  return Boolean(String(state.conversationId || '').trim())
}

export function newLocalChatId(): string {
  const randomId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2)}`

  return `local_${randomId}`
}