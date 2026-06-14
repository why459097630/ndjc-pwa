import type {
  ExtraContact,
  ExtraContactDraft,
  ShowcaseAdminActions,
  ShowcaseAdminAppointmentsActions,
  ShowcaseAdminAppointmentsUiState,
  ShowcaseAdminUiState,
  ShowcaseAnnouncementCard,
  ShowcaseAnnouncementEditActions,
  ShowcaseAnnouncementEditUiState,
  ShowcaseAnnouncementsActions,
  ShowcaseAnnouncementsUiState,
  ShowcaseAppointmentCard,
  ShowcaseAppointmentDateOption,
  ShowcaseAppointmentProductCard,
  ShowcaseAppointmentSettingsSaveInput,
  ShowcaseAppointmentsActions,
  ShowcaseAppointmentsUiState,
  ShowcaseBottomBarUiState,
  ShowcaseBottomNavigationActions,
  ShowcaseChatActions,
  ShowcaseChatAppointmentShare,
  ShowcaseChatMediaActions,
  ShowcaseChatMediaItemUi,
  ShowcaseChatMessage,
  ShowcaseChatProductShare,
  ShowcaseChatSearchResultUi,
  ShowcaseChatThreadSummaryUi,
  ShowcaseChatUiState,
  ShowcaseCloudStatusUi,
  ShowcaseCustomerBookingsActions,
  ShowcaseCustomerBookingsUiState,
  ShowcaseDetailActions,
  ShowcaseDetailUiState,
  ShowcaseEditDishActions,
  ShowcaseEditDishUiState,
  ShowcaseFavoriteCard,
  ShowcaseFavoritesActions,
  ShowcaseFavoritesUiState,
  ShowcaseHomeActions,
  ShowcaseHomeDish,
  ShowcaseHomeSortMode,
  ShowcaseHomeUiState,
  ShowcaseLoginActions,
  ShowcaseMerchantChatListActions,
  ShowcaseRetryOp,
  ShowcaseScreen,
  ShowcaseStoreProfileActions,
  ShowcaseStoreProfileDraft,
  ShowcaseStoreProfileUiState,
  ShowcaseSyncOverviewState,
  ShowcaseUiState
} from '../showcaseUiContract'

import {
  DEFAULT_PAGINATION,
  normalizeNullableText,
  normalizeText,
  type ShowcaseChatMediaWiringState,
  type ShowcaseMerchantChatListWiringState
} from './showcaseCommonWiring'

function normalizeChatThread(thread: ShowcaseChatThreadSummaryUi): ShowcaseChatThreadSummaryUi {
  return {
    conversationId: normalizeText(thread.conversationId),
    title: normalizeText(thread.title) || 'Customer',
    subtitle: normalizeText(thread.subtitle),
    lastMessage: normalizeText(thread.lastMessage),
    lastMessageAtText: normalizeText(thread.lastMessageAtText),
    unreadCount: Math.max(0, Math.trunc(Number(thread.unreadCount || 0))),
    pinned: Boolean(thread.pinned),
    avatarUrl: normalizeNullableText(thread.avatarUrl)
  }
}

function sortMerchantChatThreads(
  threads: ShowcaseChatThreadSummaryUi[]
): ShowcaseChatThreadSummaryUi[] {
  return [...threads].sort((left, right) => {
    const pinnedDiff = Number(Boolean(right.pinned)) - Number(Boolean(left.pinned))
    if (pinnedDiff !== 0) return pinnedDiff

    const unreadDiff = Number(right.unreadCount > 0) - Number(left.unreadCount > 0)
    if (unreadDiff !== 0) return unreadDiff

    return normalizeText(right.lastMessageAtText).localeCompare(normalizeText(left.lastMessageAtText))
  })
}

export function buildMerchantChatListWiringState(
  uiState: ShowcaseUiState
): ShowcaseMerchantChatListWiringState {
  const threads = uiState.merchantChatThreads
    .map(normalizeChatThread)
    .filter(thread => Boolean(thread.conversationId))

  const visibleThreads = sortMerchantChatThreads(threads)
  const unreadTotal = visibleThreads.reduce((total, thread) => total + thread.unreadCount, 0)
  const pinnedCount = visibleThreads.filter(thread => thread.pinned).length

  return {
    threads,
    visibleThreads,
    searchQuery: uiState.merchantChatListSearchQuery || '',
    refreshing: uiState.merchantChatListRefreshing,
    unreadTotal,
    pinnedCount,
    empty: visibleThreads.length === 0,
    pagination: uiState.merchantChatListPagination || DEFAULT_PAGINATION
  }
}

function normalizeChatProductShare(
  product: ShowcaseChatProductShare | null | undefined
): ShowcaseChatProductShare | null {
  if (!product) return null

  const dishId = normalizeText(product.dishId)
  const title = normalizeText(product.title)
  const price = normalizeText(product.price)
  const originalPriceText = normalizeNullableText(product.originalPriceText) || price || null
  const discountPriceText = normalizeNullableText(product.discountPriceText)

  if (!dishId && !title) return null

  return {
    dishId,
    title: title || 'Product',
    price,
    originalPriceText,
    discountPriceText,
    imageUrl: normalizeNullableText(product.imageUrl),
    isRecommended: Boolean(product.isRecommended)
  }
}

function normalizeChatAppointmentShare(
  appointment: ShowcaseChatAppointmentShare | null | undefined
): ShowcaseChatAppointmentShare | null {
  if (!appointment) return null

  const appointmentId = normalizeText(appointment.appointmentId)
  const title = normalizeText(appointment.title)
  const preferredDate = normalizeText(appointment.preferredDate)
  const preferredTime = normalizeText(appointment.preferredTime)
  const statusLabel = normalizeText(appointment.statusLabel)
  const priceText = normalizeNullableText(appointment.priceText)

  if (!appointmentId && !title) return null

  return {
    appointmentId,
    title: title || 'General appointment',
    preferredDate,
    preferredTime,
    statusLabel: statusLabel || 'Pending',
    cancelledBy: normalizeNullableText(appointment.cancelledBy),
    cancelledAt: typeof appointment.cancelledAt === 'number' ? appointment.cancelledAt : null,
    imageUrl: normalizeNullableText(appointment.imageUrl),
    customerName: normalizeText(appointment.customerName) || 'Customer',
    customerContact: normalizeText(appointment.customerContact),
    note: normalizeText(appointment.note),
    sourceDishId: normalizeNullableText(appointment.sourceDishId),
    priceText,
    originalPriceText: normalizeNullableText(appointment.originalPriceText) || priceText,
    discountPriceText: normalizeNullableText(appointment.discountPriceText),
    categoryText: normalizeNullableText(appointment.categoryText),
    itemAvailable: appointment.itemAvailable !== false,
    createdAtText: normalizeText(appointment.createdAtText)
  }
}

function normalizeChatMessage(
  message: ShowcaseChatMessage,
  selectedIds: Set<string>
): ShowcaseChatMessage {
  const imageUrls = Array.isArray(message.imageUrls)
    ? message.imageUrls.map(item => normalizeText(item)).filter(Boolean)
    : []

  return {
    id: normalizeText(message.id),
    body: String(message.body || ''),
    createdAtText: normalizeText(message.createdAtText),
    outgoing: Boolean(message.outgoing),
    statusText: normalizeNullableText(message.statusText),
    imageUrls,
    product: normalizeChatProductShare(message.product),
    appointment: normalizeChatAppointmentShare(message.appointment),
    quotedMessageId: normalizeNullableText(message.quotedMessageId),
    failed: Boolean(message.failed),
    selected: selectedIds.has(message.id)
  }
}

function buildChatTitle(uiState: ShowcaseUiState): string {
  if (uiState.chat.title && uiState.chat.title.trim()) {
    return uiState.chat.title
  }

  if (uiState.screen === 'MerchantChatList') {
    return 'Customer chats'
  }

  return 'Chat'
}

function buildChatSubtitle(uiState: ShowcaseUiState): string {
  if (uiState.chat.subtitle && uiState.chat.subtitle.trim()) {
    return uiState.chat.subtitle
  }

  if (uiState.chat.pinned) {
    return 'Pinned conversation'
  }

  return ''
}

function buildChatSearchResultsForWiring(
  messages: ShowcaseChatMessage[],
  queryInput: string,
  findResultIds: string[],
  conversationId: string
): ShowcaseChatSearchResultUi[] {
  const query = queryInput.trim().toLowerCase()
  const sourceMessages = query
    ? messages.filter(message => {
        const body = message.body.toLowerCase()
        const productTitle = message.product?.title.toLowerCase() || ''
        return body.includes(query) || productTitle.includes(query)
      })
    : findResultIds
      .map(id => messages.find(message => message.id === id))
      .filter((message): message is ShowcaseChatMessage => Boolean(message))

  return sourceMessages.map(message => {
    const body = message.body.trim()
    const productTitle = message.product?.title?.trim() || ''
    const snippet = body || productTitle || (message.imageUrls.length ? 'Media message' : 'Message')

    return {
      conversationId,
      messageId: message.id,
      senderLabel: message.outgoing ? 'You' : 'Customer',
      createdAtText: message.createdAtText,
      snippet
    }
  })
}

function buildChatMediaItemsForWiring(
  messages: ShowcaseChatMessage[],
  conversationId: string
): ShowcaseChatMediaItemUi[] {
  const byUrl = new Map<string, ShowcaseChatMediaItemUi>()

  messages.forEach(message => {
    const dayKey = message.createdAtText.trim().slice(0, 10) || 'Unknown date'

    message.imageUrls
      .map(url => url.trim())
      .filter(Boolean)
      .forEach(url => {
        if (byUrl.has(url)) return

        byUrl.set(url, {
          conversationId,
          messageId: message.id,
          url,
          dayKey,
          createdAtText: message.createdAtText
        })
      })
  })

  return Array.from(byUrl.values())
}

export function buildChatWiringState(uiState: ShowcaseUiState): ShowcaseChatUiState {
  const selectedIds = new Set(uiState.chat.selectedMessageIds)
  const messages = uiState.chat.messages
    .map(message => normalizeChatMessage(message, selectedIds))
    .filter(message => Boolean(message.id))

  const mediaPreviewUrls = Array.from(
    new Set([
      ...uiState.chat.mediaPreviewUrls,
      ...messages.flatMap(message => message.imageUrls)
    ].map(item => normalizeText(item)).filter(Boolean))
  )

  const maxMediaIndex = Math.max(0, mediaPreviewUrls.length - 1)
  const mediaPreviewIndex = Math.min(Math.max(0, uiState.chat.mediaPreviewIndex), maxMediaIndex)
  const selectionMode = Boolean(uiState.chat.selectionMode || selectedIds.size > 0)
  const conversationId = uiState.chat.messages[0]?.id
    ? normalizeText(uiState.chat.title) || 'current'
    : 'current'

  return {
    title: buildChatTitle(uiState),
    subtitle: buildChatSubtitle(uiState),
    messages,
    draft: uiState.chat.draft,
    draftImageUrls: uiState.chat.draftImageUrls,
    pendingProduct: normalizeChatProductShare(uiState.chat.pendingProduct),
    pendingAppointment: normalizeChatAppointmentShare(uiState.chat.pendingAppointment),
    quotedMessageId: normalizeNullableText(uiState.chat.quotedMessageId),
    isSending: uiState.chat.isSending,
    statusMessage: uiState.chat.statusMessage || uiState.snackbarMessage,
    inputPlaceholder: uiState.chat.inputPlaceholder || 'Type a message',
    selectionMode,
    selectedMessageIds: Array.from(selectedIds),
    findQuery: uiState.chat.findQuery,
    findResultIds: uiState.chat.findResultIds,
    focusedMessageId: normalizeNullableText(uiState.chat.focusedMessageId),
    scrollToMessageId: null,
    scrollToMessageSignal: 0,
    scrollToBottomSignal: uiState.chat.scrollToBottomSignal || 0,
    flashMessageId: null,
    flashSignal: 0,
    searchResults: buildChatSearchResultsForWiring(
      messages,
      uiState.chat.findQuery,
      uiState.chat.findResultIds,
      conversationId
    ),
    mediaItems: buildChatMediaItemsForWiring(messages, conversationId),
    mediaPreviewUrls,
    mediaPreviewIndex,
    pinned: uiState.chat.pinned,
    canTogglePinned: uiState.chat.canTogglePinned,

    windowMode: uiState.chat.windowMode,
    anchorMessageId: uiState.chat.anchorMessageId,
    hasNewerMessages: uiState.chat.hasNewerMessages,
    isLoadingNewerMessages: uiState.chat.isLoadingNewerMessages,
    oldestMessageTimeMs: uiState.chat.oldestMessageTimeMs,
    newestMessageTimeMs: uiState.chat.newestMessageTimeMs,

    pagination: uiState.chat.pagination || DEFAULT_PAGINATION,
    searchPagination: uiState.chat.searchPagination || DEFAULT_PAGINATION,
    mediaPagination: uiState.chat.mediaPagination || DEFAULT_PAGINATION
  }
}

export function buildChatMediaWiringState(uiState: ShowcaseUiState): ShowcaseChatMediaWiringState {
  const chat = buildChatWiringState(uiState)
  const urls = chat.mediaPreviewUrls
  const maxIndex = Math.max(0, urls.length - 1)
  const previewIndex = Math.min(Math.max(0, chat.mediaPreviewIndex), maxIndex)

  return {
    urls,
    previewIndex,
    currentUrl: urls[previewIndex] || null,
    count: urls.length,
    empty: urls.length === 0
  }
}

