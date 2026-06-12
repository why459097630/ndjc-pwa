'use client'

import type {
  ShowcaseChatActions,
  ShowcaseChatMediaActions,
  ShowcaseMerchantChatListActions
} from '../showcaseUiContract'

type ShowcaseChatActionObjectsContext = Record<string, any>

export function createShowcaseChatActionObjects(ctx: ShowcaseChatActionObjectsContext): {
  chatActions: ShowcaseChatActions
  chatMediaActions: ShowcaseChatMediaActions
  merchantChatListActions: ShowcaseMerchantChatListActions
} {
  const chatActions: ShowcaseChatActions = {
    ...ctx.bottomNavigationActions,

    onCopy: ctx.copyText,

    onUseProductCardAsPending: ctx.chatUseProductCardAsPending,

    onUseAppointmentCardAsPending: ctx.setPendingAppointmentForChat,

    onJumpToMessage: ctx.chatJumpToMessageFromQuote,

    onBackToHome: ctx.closeToHome,

    onBack: ctx.handleShowcaseBack,

    onDraftChange: ctx.onChatDraftChange,

    onSend: () => {
      void ctx.sendChat()
    },

    onRetry: (messageId: string) => {
      void ctx.retryChatMessage(messageId)
    },

    onRefresh: () => {
      void ctx.refreshChatLatest()
    },

    onLoadOlderMessages: () => {
      void ctx.loadOlderChatMessages()
    },

    onLoadNewerMessages: () => {
      void ctx.loadNewerChatMessages()
    },

    onQuoteMessage: ctx.chatQuoteMessage,

    onCancelQuote: ctx.chatCancelQuote,

    onEnterSelection: ctx.chatEnterSelection,

    onToggleSelection: ctx.chatToggleSelection,

    onExitSelection: ctx.chatExitSelection,

    onDeleteMessage: ctx.chatDeleteMessage,

    onDeleteSelected: ctx.chatDeleteSelected,

    onOpenSearchResults: ctx.chatOpenSearchResults,

    onCloseSearchResults: ctx.chatCloseSearchResults,

    onOpenMediaGallery: ctx.chatOpenMediaGallery,

    onOpenImagePreview: ctx.chatOpenImagePreview,

    onJumpToFoundMessage: ctx.chatJumpToFoundMessage,

    onOpenThreadFromSearch: ctx.chatOpenThreadFromSearch,

    onLoadMoreSearchResults: () => {
      void ctx.loadMoreChatSearchResults()
    },

    onLoadMoreMediaItems: () => {
      void ctx.loadMoreChatMediaItems()
    },

    onTogglePinned: ctx.chatTogglePinned,

    onOpenFind: ctx.chatOpenFind,

    onCloseFind: ctx.chatCloseFind,

    onFindQueryChange: ctx.chatFindQueryChange,

    onFindNext: ctx.chatFindNext,

    onFindPrev: ctx.chatFindPrev,

    onPickImages: values => {
      void ctx.onChatImagesSelected(values)
    },

    onOpenCamera: () => {
      const uri = ctx.prepareChatCameraCapture(ctx.storeId)
      if (!uri) {
        ctx.onChatFullCameraUnavailable()
      }
    },

    onCameraCaptured: value => {
      void ctx.onChatCameraResult(value)
    },

    onRemoveDraftImage: ctx.chatRemoveDraftImage,

    onSavePreviewImage: ctx.saveChatPreviewImage,

    onSendPendingProduct: () => {
      void ctx.sendPendingProductShare()
    },

    onClearPendingProduct: () => {
      ctx.chatUseProductCardAsPending(null)
    },

    onSendPendingAppointment: () => {
      void ctx.sendPendingAppointmentShare()
    },

    onClearPendingAppointment: () => {
      ctx.setPendingAppointmentForChat(null)
    },

    onOpenProductDetail: ctx.openProductFromChat,

    onOpenAppointmentDetail: () => {
    },

    isProductAvailable: ctx.isProductAvailable,

    buildProductClipboardPayload: ctx.buildChatProductClipboardPayload
  }

  const chatMediaActions: ShowcaseChatMediaActions = {
    onBackToHome: () => {
      ctx.setChatMediaPreviewUrls([])
      ctx.setChatMediaPreviewIndex(0)
      ctx.closeToHome()
    },

    onBack: ctx.handleShowcaseBack,

    onLoadMoreMediaItems: () => {
      void ctx.loadMoreChatMediaItems()
    },

    onSavePreviewImage: ctx.savePreviewImage
  }

  const merchantChatListActions: ShowcaseMerchantChatListActions = {
    onBackToHome: ctx.closeMerchantChatListToHome,

    onBack: ctx.handleShowcaseBack,

    onRefresh: () => {
      void ctx.refreshMerchantChatListByUser()
    },

    onLoadMore: () => {
      void ctx.loadMoreMerchantChatThreads()
    },

    onSearchQueryChange: value => {
      ctx.setMerchantChatListSearchQuery(value)
    },

    onOpenThread: (threadId, title) => {
      void ctx.openMerchantThread(threadId, title)
    },

    onDeleteThread: threadId => {
      return ctx.merchantChatListDeleteThread(threadId)
    },

    onTogglePin: (threadId, pinned) => {
      void ctx.merchantChatListTogglePin(threadId, pinned)
    },

    onRenameThread: (threadId, newName) => {
      return ctx.merchantChatListRenameThread(threadId, newName)
    }
  }

  return {
    chatActions,
    chatMediaActions,
    merchantChatListActions
  }
}
