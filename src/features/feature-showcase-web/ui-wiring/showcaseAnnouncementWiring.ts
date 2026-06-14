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
  buildBottomBarUiState,
  normalizeNullableText,
  normalizeText
} from './showcaseCommonWiring'

function normalizeAnnouncementCard(item: ShowcaseAnnouncementCard): ShowcaseAnnouncementCard {
  return {
    id: normalizeText(item.id),
    coverUrl: normalizeNullableText(item.coverUrl),
    bodyPreview: normalizeText(item.bodyPreview),
    bodyText: normalizeText(item.bodyText),
    timeText: normalizeText(item.timeText),
    viewCount: Math.max(0, Math.trunc(Number(item.viewCount || 0)))
  }
}

function sortAnnouncements(items: ShowcaseAnnouncementCard[]): ShowcaseAnnouncementCard[] {
  return [...items].sort((left, right) => {
    return normalizeText(right.timeText).localeCompare(normalizeText(left.timeText))
  })
}

export function buildAnnouncementsWiringState(uiState: ShowcaseUiState): ShowcaseAnnouncementsUiState {
  const items = sortAnnouncements(uiState.announcements.map(normalizeAnnouncementCard))
  const title = normalizeText(uiState.storeProfile?.displayName) || 'Announcements'

  return {
    bottomBar: buildBottomBarUiState(uiState),

    title,
    items,
    isLoading: uiState.isLoading,
    statusMessage: uiState.statusMessage,
    focusedAnnouncementId: normalizeNullableText(uiState.pushTargetAnnouncementId),

    pagination: DEFAULT_PAGINATION
  }
}

export function buildAnnouncementEditWiringState(uiState: ShowcaseUiState): ShowcaseAnnouncementEditUiState {
  const draftItems = sortAnnouncements(uiState.adminAnnouncementDraftItems.map(normalizeAnnouncementCard))
  const selectedIds = uiState.adminAnnouncementSelectedIds
  const previewItem = uiState.adminAnnouncementPreviewId
    ? draftItems.find(item => item.id === uiState.adminAnnouncementPreviewId) || null
    : null
  const bodyDraft = uiState.adminAnnouncementBodyDraft
  const coverDraftUrl = normalizeNullableText(uiState.adminAnnouncementCoverDraftUrl)
  const hasUnsavedChanges = Boolean(bodyDraft.trim() || coverDraftUrl || uiState.adminAnnouncementEditingId)

  return {
    coverDraftUrl,
    bodyDraft,
    editingId: normalizeNullableText(uiState.adminAnnouncementEditingId),
    errorMessage: uiState.adminAnnouncementError,
    successMessage: uiState.adminAnnouncementSuccess,
    statusMessage: uiState.statusMessage,
    coverUploadErrorMessage: uiState.adminAnnouncementCoverUploadError,
    isSubmitting: uiState.adminAnnouncementIsSubmitting,
    isBlockingInput: uiState.adminAnnouncementIsBlocking,
    submittingAction: uiState.adminAnnouncementSubmittingAction,
    composerExpanded: uiState.adminAnnouncementComposerExpanded,
    canStartNew: Boolean(bodyDraft.trim() || coverDraftUrl || uiState.adminAnnouncementEditingId),
    canDeleteSelected: selectedIds.length > 0,
    canSaveDraft: Boolean(bodyDraft.trim() || coverDraftUrl),
    canPublish: Boolean(bodyDraft.trim() || coverDraftUrl),
    draftItems,
    selectedIds,
    previewItem,
    previewVisible: Boolean(previewItem),
    hasUnsavedChanges,
    pendingExitTarget: null,

    pagination: DEFAULT_PAGINATION
  }
}

