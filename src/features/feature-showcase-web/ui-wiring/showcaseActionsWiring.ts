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
  buildEmptyProductClipboardPayload,
  noop,
  noopAppointmentSettingsSave,
  noopAsync,
  noopBoolean,
  noopImagePicked,
  noopImagePickedArray,
  noopNullableImagePicked,
  noopNullableString,
  noopNumber,
  noopNumberNumber,
  noopNumberString,
  noopSortMode,
  noopString,
  noopStringBoolean,
  noopStringString,
  returnFalse
} from './showcaseCommonWiring'

export function createNoopBottomNavigationActions(
  overrides: Partial<ShowcaseBottomNavigationActions> = {}
): ShowcaseBottomNavigationActions {
  return {
    onOpenStoreProfileView: noop,
    onOpenChat: noop,
    onOpenCustomerBookings: noop,
    onOpenAnnouncements: noop,
    onOpenFavorites: noop,
    ...overrides
  }
}

export function createNoopHomeActions(
  overrides: Partial<ShowcaseHomeActions> = {}
): ShowcaseHomeActions {
  const bottomNavigation = createNoopBottomNavigationActions(overrides)

  return {
    ...bottomNavigation,
    onRefresh: noopAsync,
    onLoadMore: noopAsync,
    onCategorySelected: noopNullableString,
    onDishSelected: noopString,
    onProfileClick: noop,
    onBackToHome: noop,
    onSearchQueryChange: noopString,
    onToggleTag: noopString,
    onClearTags: noop,
    onSelectedTagsChange: noop,
    onSortModeChange: noopSortMode,
    onFilterRecommendedOnlyChange: noopBoolean,
    onFilterOnSaleOnlyChange: noopBoolean,
    onApplyHomeFilters: noop,
    onClearSortAndFilters: noop,
    onClearAll: noop,
    onShowSortMenuChange: noopBoolean,
    onShowFilterMenuChange: noopBoolean,
    onPriceMinDraftChange: noopString,
    onPriceMaxDraftChange: noopString,
    onApplyPriceRange: noop,
    onClearPriceRange: noop,
    onShowPriceMenuChange: noopBoolean,
    onToggleFavorite: noopString,
    ...overrides
  }
}

export function createNoopLoginActions(
  overrides: Partial<ShowcaseLoginActions> = {}
): ShowcaseLoginActions {
  return {
    onUsernameDraftChange: noopString,
    onPasswordDraftChange: noopString,
    onRememberMeChange: noopBoolean,
    onLogin: noopStringString,
    onBackToHome: noop,
    ...overrides
  }
}

export function createNoopAdminActions(
  overrides: Partial<ShowcaseAdminActions> = {}
): ShowcaseAdminActions {
  return {
    onBackToHome: noop,
    onBack: noop,
    onLogout: noop,
    onRefresh: noop,
    onLoadMoreItems: noopAsync,
    onItemsSortModeChange: noopSortMode,
    onItemsSearchQueryChange: noopString,
    onClearItemsSearchQuery: noop,
    onItemsFilterRecommendedChange: noopBoolean,
    onItemsFilterHiddenOnlyChange: noopBoolean,
    onItemsFilterDiscountOnlyChange: noopBoolean,
    onApplyItemsFilters: noop,
    onPriceMinDraftChange: noopString,
    onPriceMaxDraftChange: noopString,
    onApplyPriceRange: noop,
    onClearPriceRange: noop,
    onSelectCategory: noopNullableString,
    onAddCategory: noopString,
    onDeleteCategory: noopString,
    onRenameCategory: noopStringString,
    onOpenItemsManager: noop,
    onOpenCategoriesManager: noop,
    onOpenStoreProfile: noop,
    onOpenChangePassword: noop,
    onOpenMerchantChatList: noop,
    onAddNewDish: noop,
    onEditDish: noopString,
    onDeleteDish: noopString,
    onToggleSelectDish: noopString,
    onClearSelectedDishes: noop,
    onDeleteSelectedDishes: noop,
    onDismissPendingDelete: noop,
    onConfirmPendingDelete: noop,
    onRetryPendingSync: noop,
    onAdminUsernameDraftChange: noopString,
    onAdminPasswordDraftChange: noopString,
    onSaveAdminCredentials: noop,
    onSetAdminCredentials: noopStringString,
    onRequestDeleteCategory: noopString,
    onDismissCategoryDeleteDialogs: noop,
    onConfirmPendingDeleteCategory: noop,
    onOpenAnnouncementPublisher: noop,
    onOpenAppointmentManager: noop,
    ...overrides
  }
}

export function createNoopMerchantChatListActions(
  overrides: Partial<ShowcaseMerchantChatListActions> = {}
): ShowcaseMerchantChatListActions {
  return {
    onBackToHome: noop,
    onBack: noop,
    onRefresh: noop,
    onLoadMore: noopAsync,
    onSearchQueryChange: noopString,
    onOpenThread: noopStringString,
    onDeleteThread: noopString,
    onTogglePin: noopStringBoolean,
    onRenameThread: noopStringString,
    ...overrides
  }
}

export function createNoopChatActions(
  overrides: Partial<ShowcaseChatActions> = {}
): ShowcaseChatActions {
  const bottomNavigation = createNoopBottomNavigationActions(overrides)

  return {
    ...bottomNavigation,
    onCopy: noopStringString,
    onUseProductCardAsPending: noop,
    onJumpToMessage: noopString,
    onBackToHome: noop,
    onBack: noop,
    onDraftChange: noopString,
    onSend: noop,
    onRetry: noopString,
    onRefresh: noop,
    onLoadOlderMessages: noopAsync,
    onLoadNewerMessages: noopAsync,
    onQuoteMessage: noopString,
    onCancelQuote: noop,
    onEnterSelection: noopString,
    onToggleSelection: noopString,
    onExitSelection: noop,
    onDeleteMessage: noopString,
    onDeleteSelected: noop,
    onOpenSearchResults: noop,
    onCloseSearchResults: noop,
    onOpenMediaGallery: noop,
    onOpenImagePreview: noop,
    onJumpToFoundMessage: noopString,
    onOpenThreadFromSearch: noop,
    onLoadMoreSearchResults: noopAsync,
    onLoadMoreMediaItems: noopAsync,
    onTogglePinned: noop,
    onOpenFind: noop,
    onCloseFind: noop,
    onFindQueryChange: noopString,
    onFindNext: noop,
    onFindPrev: noop,
    onPickImages: noopImagePickedArray,
    onOpenCamera: noop,
    onCameraCaptured: noopNullableImagePicked,
    onRemoveDraftImage: noopString,
    onSavePreviewImage: noopString,
    onSendPendingProduct: noop,
    onClearPendingProduct: noop,
    onUseAppointmentCardAsPending: (_appointment: ShowcaseChatAppointmentShare) => {},
    onSendPendingAppointment: noop,
    onClearPendingAppointment: noop,
    onOpenProductDetail: noopString,
    onOpenAppointmentDetail: noop,
    isProductAvailable: returnFalse,
    buildProductClipboardPayload: buildEmptyProductClipboardPayload,
    ...overrides
  }
}

export function createNoopChatMediaActions(
  overrides: Partial<ShowcaseChatMediaActions> = {}
): ShowcaseChatMediaActions {
  return {
    onBackToHome: noop,
    onBack: noop,
    onLoadMoreMediaItems: noopAsync,
    onSavePreviewImage: noopString,
    ...overrides
  }
}

export function createNoopDetailActions(
  overrides: Partial<ShowcaseDetailActions> = {}
): ShowcaseDetailActions {
  const bottomNavigation = createNoopBottomNavigationActions(overrides)

  return {
    ...bottomNavigation,
    onBackToHome: noop,
    onBack: noop,
    onEdit: noop,
    onToggleFavorite: noop,
    onOpenChat: noop,
    onOpenImage: noopString,
    onImageIndexChanged: noopNumber,
    onBookAppointment: noop,
    onSavePreviewImage: noopString,
    ...overrides
  }
}

export function createNoopEditDishActions(
  overrides: Partial<ShowcaseEditDishActions> = {}
): ShowcaseEditDishActions {
  return {
    onBackToHome: noop,
    onBack: noop,
    onConfirmExit: noop,
    onDismissExitConfirm: noop,
    onNameChange: noopString,
    onPriceChange: noopString,
    onDiscountPriceChange: noopString,
    onDescriptionChange: noopString,
    onCategorySelected: noopNullableString,
    onToggleRecommended: noopBoolean,
    onToggleHidden: noopBoolean,
    onPickImage: noop,
    onImagePicked: noopImagePicked,
    onRemoveImage: noopString,
    onMoveImage: (fromIndex: number, toIndex: number) => {
  console.log('[ImageDrag] wiring onMoveImage fallback called', {
    fromIndex,
    toIndex
  })
},
    onSave: noop,
    onDelete: null,
    onDismissError: noop,
    ...overrides
  }
}

export function createNoopStoreProfileActions(
  overrides: Partial<ShowcaseStoreProfileActions> = {}
): ShowcaseStoreProfileActions {
  const bottomNavigation = createNoopBottomNavigationActions(overrides)

  return {
    ...bottomNavigation,
    onBackToHome: noop,
    onBack: noop,
    onConfirmExit: noop,
    onDismissExitConfirm: noop,
    onRefresh: noop,
    onEdit: noop,
    onCancelEdit: noop,
    onDiscardDraftAndGoHome: noop,
    onSave: noop,
    onTitleChange: noopString,
    onSubtitleChange: noopString,
    onDescriptionChange: noopString,
    onAddressChange: noopString,
    onHoursChange: noopString,
    onMapUrlChange: noopString,
    onBusinessStatusChange: noopString,
    onLogoUrlChange: noopString,
    onCoverUrlChange: noopString,
    onLogoImagePicked: noopImagePicked,
    onCoverImagesPicked: noopImagePickedArray,
    onPickLogo: noop,
    onPickCover: noop,
    onRemoveLogo: noop,
    onRemoveCover: noopString,
    onMoveCover: noopNumberNumber,
    onCoverDraggingChange: noopBoolean,
    onServiceChange: noopNumberString,
    onAddService: noopString,
    onRemoveService: noopNumber,
    onAddExtraContact: noopStringString,
    onRemoveExtraContact: noopString,
    onExtraContactNameChange: noopStringString,
    onExtraContactValueChange: noopStringString,
    onOpenMap: noopString,
    onOpenWebsite: noopString,
    onCopy: noopStringString,
    onSavePreviewImage: noopString,
    ...overrides
  }
}

export function createNoopFavoritesActions(
  overrides: Partial<ShowcaseFavoritesActions> = {}
): ShowcaseFavoritesActions {
  const bottomNavigation = createNoopBottomNavigationActions(overrides)

  return {
    ...bottomNavigation,
    onBackToHome: noop,
    onBack: noop,
    onQueryChange: noopString,
    onOpenDetail: noopString,
    onToggleSelect: noopString,
    onClearSelection: noop,
    onDeleteSelected: noop,
    onSortModeChange: noopSortMode,
    onFilterRecommendedOnlyChange: noopBoolean,
    onFilterOnSaleOnlyChange: noopBoolean,
    onClearSortAndFilters: noop,
    onShowSortMenuChange: noopBoolean,
    onShowFilterMenuChange: noopBoolean,
    onPriceMinDraftChange: noopString,
    onPriceMaxDraftChange: noopString,
    onApplyPriceRange: noop,
    onClearPriceRange: noop,
    onShowPriceMenuChange: noopBoolean,
    onCategorySelected: noopNullableString,
    ...overrides
  }
}

export function createNoopAppointmentsActions(
  overrides: Partial<ShowcaseAppointmentsActions> = {}
): ShowcaseAppointmentsActions {
  return {
    onBackToHome: noop,
    onBack: noop,
    onServiceChange: noopString,
    onNameChange: noopString,
    onContactChange: noopString,
    onDateChange: noopString,
    onTimeChange: noopString,
    onNoteChange: noopString,
    onOpenProductDetail: noopString,
    onSubmit: noop,
    ...overrides
  }
}

export function createNoopAdminAppointmentsActions(
  overrides: Partial<ShowcaseAdminAppointmentsActions> = {}
): ShowcaseAdminAppointmentsActions {
  return {
    onBackToHome: noop,
    onBack: noop,
    onRefresh: noop,
    onCopy: noopStringString,
    onEnabledChange: noopBoolean,
    onBookingWindowDaysChange: noopNumber,
    onAvailableHoursTextChange: noopString,
    onSlotIntervalMinutesChange: noopNumber,
    onClosedDayToggle: noopString,
    onMinimumNoticeChange: noopString,
    onSettingsSave: noopAppointmentSettingsSave,
    onDateFilterChange: noopString,
    onStatusFilterChange: noopString,
    onServiceFilterChange: noopString,
    onHistoryDateSelected: noopString,
    onHistoryDateClear: noop,
    onConsumeFocusedAppointment: noop,
    onContactCustomer: noopString,
    onOpenAppointmentProductDetail: noopString,
    onLoadMore: noopAsync,
    onPending: noopString,
    onConfirm: noopString,
    onCancel: noopString,
    onComplete: noopString,
    onNoShow: noopString,
    ...overrides
  }
}

export function createNoopCustomerBookingsActions(
  overrides: Partial<ShowcaseCustomerBookingsActions> = {}
): ShowcaseCustomerBookingsActions {
  const bottomNavigation = createNoopBottomNavigationActions(overrides)

  return {
    ...bottomNavigation,
    onBackToHome: noop,
    onBack: noop,
    onRefresh: noop,
    onCopy: noopStringString,
    onDateFilterChange: noopString,
    onStatusFilterChange: noopString,
    onServiceFilterChange: noopString,
    onConsumeFocusedAppointment: noop,
    onContactMerchant: noopString,
    onCancelBooking: noopString,
    onOpenAppointmentProductDetail: noopString,
    onLoadMore: noopAsync,
    ...overrides
  }
}

export function createNoopAnnouncementsActions(
  overrides: Partial<ShowcaseAnnouncementsActions> = {}
): ShowcaseAnnouncementsActions {
  const bottomNavigation = createNoopBottomNavigationActions(overrides)

  return {
    ...bottomNavigation,
    onBackToHome: noop,
    onBack: noop,
    onRefresh: noop,
    onOpenAnnouncement: noopString,
    onTrackAnnouncementView: noopString,
    onOpenAnnouncementImage: noopString,
    onConsumeFocusedAnnouncement: noop,
    onLoadMore: noopAsync,
    ...overrides
  }
}

export function createNoopAnnouncementEditActions(
  overrides: Partial<ShowcaseAnnouncementEditActions> = {}
): ShowcaseAnnouncementEditActions {
  return {
    onBackToHome: noop,
    onBack: noop,
    onConfirmExit: noop,
    onDismissExitConfirm: noop,
    onStartNew: noop,
    onPickCover: noop,
    onRemoveCover: noop,
    onOpenCoverPreview: noop,
    onBodyChange: noopString,
    onSaveDraft: noop,
    onPushNow: noop,
    onOpenItem: noopString,
    onPreviewItem: noopString,
    onDismissPreview: noop,
    onToggleSelect: noopString,
    onClearSelection: noop,
    onDeleteSelected: noop,
    onLoadMore: noopAsync,
    ...overrides
  }
}

