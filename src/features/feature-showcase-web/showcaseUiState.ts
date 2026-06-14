import type {
  AdminEntryMode,
  ShowcaseChatUiState,
  ShowcaseCloudStatusUi,
  ShowcaseRetryOp,
  ShowcaseScreen,
  ShowcaseSyncOverviewState,
  ShowcaseUiState,
  SortMode
} from './showcaseUiContract'

export type {
  AdminEntryMode,
  ShowcaseChatUiState,
  ShowcaseCloudStatusUi,
  ShowcaseRetryOp,
  ShowcaseScreen,
  ShowcaseSyncOverviewState,
  ShowcaseUiState,
  SortMode
} from './showcaseUiContract'
export const ShowcaseScreens = {
  Home: 'Home',
  Login: 'Login',
  Admin: 'Admin',
  AdminItems: 'AdminItems',
  AdminCategories: 'AdminCategories',
  Detail: 'Detail',
  Edit: 'Edit',
  StoreProfileView: 'StoreProfileView',
  StoreProfile: 'StoreProfile',
  ChangePassword: 'ChangePassword',
  MerchantChatList: 'MerchantChatList',
  Chat: 'Chat',
  ChatSearchResults: 'ChatSearchResults',
  ChatMedia: 'ChatMedia',
  Favorites: 'Favorites',
  Appointments: 'Appointments',
  CustomerBookings: 'CustomerBookings',
  Announcements: 'Announcements',
  AdminAppointmentManager: 'AdminAppointmentManager',
  AdminAnnouncementEdit: 'AdminAnnouncementEdit'
} as const satisfies Record<ShowcaseScreen, ShowcaseScreen>

export const AdminEntryModes = {
  None: 'None',
  RenameCategory: 'RenameCategory',
  EditCategories: 'EditCategories',
  EditStoreProfile: 'EditStoreProfile'
} as const satisfies Record<AdminEntryMode, AdminEntryMode>

export const SyncOverviewStates = {
  Idle: 'Idle',
  Syncing: 'Syncing',
  HasPending: 'HasPending',
  Failed: 'Failed'
} as const satisfies Record<ShowcaseSyncOverviewState, ShowcaseSyncOverviewState>

export const ShowcaseRetryOps = {
  LoadFromCloud: 'LoadFromCloud',
  RetryPendingSync: 'RetryPendingSync',
  RefreshStoreProfile: 'RefreshStoreProfile'
} as const satisfies Record<ShowcaseRetryOp, ShowcaseRetryOp>

export const SortModes = {
  Price: 'Price',
  Name: 'Name'
} as const satisfies Record<SortMode, SortMode>

export function createDefaultShowcaseCloudStatusUi(
  overrides: Partial<ShowcaseCloudStatusUi> = {}
): ShowcaseCloudStatusUi {
  return {
    storeId: '',
    planLabel: '',
    statusLabel: '',
    daysRemainingLabel: '',
    serviceEndAtLabel: '',
    deleteAtLabel: '',
    canWrite: true,
    ...overrides
  }
}

export function createDefaultShowcaseChatUiState(
  overrides: Partial<ShowcaseChatUiState> = {}
): ShowcaseChatUiState {
  return {
    title: 'Chat',
    subtitle: '',
    messages: [],
    draft: '',
    draftImageUrls: [],
    pendingProduct: null,
    pendingAppointment: null,
    quotedMessageId: null,
    isSending: false,
    statusMessage: null,
    inputPlaceholder: 'Type a message',

    selectionMode: false,
    selectedMessageIds: [],
    findQuery: '',
    findResultIds: [],
    focusedMessageId: null,
    scrollToMessageId: null,
    scrollToMessageSignal: 0,
    scrollToBottomSignal: 0,
    flashMessageId: null,
    flashSignal: 0,
    searchResults: [],
    mediaItems: [],
    mediaPreviewUrls: [],
    mediaPreviewIndex: 0,
    pinned: false,
    canTogglePinned: false,
    windowMode: 'latest',
    anchorMessageId: null,
    hasNewerMessages: false,
    isLoadingNewerMessages: false,
    oldestMessageTimeMs: null,
    newestMessageTimeMs: null,
    pagination: {
      hasMore: false,
      isLoadingMore: false
    },
    searchPagination: {
      hasMore: false,
      isLoadingMore: false
    },
    mediaPagination: {
      hasMore: false,
      isLoadingMore: false
    },
    ...overrides
  }
}

export function createDefaultShowcaseUiState(
  overrides: Partial<ShowcaseUiState> = {}
): ShowcaseUiState {
  return {
    dishes: [],
    manualCategories: [],
    adminCategories: [],
    selectedCategory: null,

    loginUsernameDraft: '',
    loginPasswordDraft: '',
    loginRememberMeDraft: false,

    changePasswordCurrentDraft: '',
    changePasswordNewDraft: '',
    changePasswordConfirmDraft: '',
    changePasswordError: null,
    changePasswordSuccess: null,

    screen: ShowcaseScreens.Home,
    isAdminLoggedIn: false,
    pendingDeleteDishId: null,
    adminEntryMode: AdminEntryModes.None,

    isLoading: false,
    isCloudLoading: false,
    isSavingEditDish: false,
    isBlockingEditDish: false,
    statusMessage: null,
    snackbarMessage: null,
    cloudStatus: createDefaultShowcaseCloudStatusUi(),
    editValidationError: null,
    editImageUploadError: null,
    loginError: null,

    selectedDish: null,
    detailImageIndex: 0,
    favoriteIds: [],

    searchQuery: '',
    sortMode: 'Default',
    adminItemsSortMode: 'Default',
    adminItemsSearchQuery: '',
    adminItemsFilterRecommended: false,
    adminItemsFilterHiddenOnly: false,
    adminItemsFilterDiscountOnly: false,
    adminItemsSortAscending: true,
    adminItemsPriceMinDraft: '',
    adminItemsPriceMaxDraft: '',
    adminItemsAppliedMinPrice: null,
    adminItemsAppliedMaxPrice: null,
    adminSelectedDishIds: [],

    favoritesQuery: '',
    favoritesSelectedIds: [],
    favoritesSortMode: 'Default',
    favoritesFilterRecommendedOnly: false,
    favoritesFilterOnSaleOnly: false,
    favoritesPriceMinDraft: '',
    favoritesPriceMaxDraft: '',
    favoritesAppliedMinPrice: null,
    favoritesAppliedMaxPrice: null,
    favoritesShowSortMenu: false,
    favoritesShowFilterMenu: false,
    favoritesShowPriceMenu: false,
    favoritesSelectedCategory: null,
    favoriteCategories: [],

    filterRecommendedOnly: false,
    filterOnSaleOnly: false,

    homeShowSortMenu: false,
    homeShowFilterMenu: false,
    homePriceMinDraft: '',
    homePriceMaxDraft: '',
    homeAppliedMinPrice: null,
    homeAppliedMaxPrice: null,
    homeShowPriceMenu: false,

    adminUsernameDraft: '',
    adminPasswordDraft: '',
    adminPendingDeleteCategory: null,
    adminCannotDeleteCategory: null,
    categorySubmittingAction: null,

    selectedTags: [],

    syncOverviewState: SyncOverviewStates.Idle,
    lastSyncAt: null,
    pendingSyncCount: 0,
    syncErrorMessage: null,
    lastRetryOp: null,

    storeProfile: null,
    storeProfileDraft: null,
    storeProfileDescription: '',
    storeProfileServices: [],
    storeProfileExtraContacts: [],
    storeProfileLogoUrl: '',
    storeProfileCoverUrl: '',
    draftStoreProfileDescription: '',
    draftStoreProfileServices: [],
    draftStoreProfileExtraContacts: [],
    draftStoreProfileLogoUrl: '',
    draftStoreProfileCoverUrl: '',
    draftBusinessStatus: '',
    isEditingStoreProfile: false,
    isSavingStoreProfile: false,
    isRefreshingStoreProfile: false,
    storeProfileSaveError: null,
    storeProfileLogoUploadError: null,
    storeProfileCoverUploadError: null,
    storeProfileSaveSuccess: false,

    chat: createDefaultShowcaseChatUiState(),
    merchantChatThreads: [],
    merchantChatListSearchQuery: '',
    merchantChatListRefreshing: false,
    merchantChatListPagination: {
      hasMore: false,
      isLoadingMore: false
    },

    announcements: [],
    adminAnnouncementDraftItems: [],
    adminAnnouncementComposerExpanded: false,
    adminAnnouncementCoverDraftUrl: null,
    adminAnnouncementBodyDraft: '',
    adminAnnouncementEditingId: null,
    adminAnnouncementSelectedIds: [],
    adminAnnouncementPreviewId: null,
    adminAnnouncementError: null,
    adminAnnouncementSuccess: null,
    adminAnnouncementCoverUploadError: null,
    adminAnnouncementIsSubmitting: false,
    adminAnnouncementIsBlocking: false,
    adminAnnouncementSubmittingAction: null,
    pushTargetAnnouncementId: null,

    appointmentsEnabled: false,
    appointments: [],
    appointmentSourceDishId: null,
    appointmentProduct: null,
    appointmentServiceDraft: '',
    appointmentNameDraft: '',
    appointmentContactDraft: '',
    appointmentDateDraft: '',
    appointmentTimeDraft: '',
    appointmentNoteDraft: '',
    appointmentError: null,
    appointmentSuccess: null,
    appointmentsRefreshing: false,

    appointmentBookingWindowDays: 7,
    appointmentAvailableHoursText: '09:00 - 18:00',
    appointmentSlotIntervalMinutes: 30,
    appointmentClosedDays: [],
    appointmentMinimumNotice: 'No notice',

    appointmentAdminDateFilter: 'All',
    appointmentAdminStatusFilter: 'All',
    appointmentAdminServiceFilter: 'All',
    appointmentAdminHistoryDateFilter: null,

    appointmentCustomerDateFilter: 'All',
    appointmentCustomerStatusFilter: 'All',
    appointmentCustomerServiceFilter: 'All',

    ...overrides
  }
}

export const defaultShowcaseUiState: ShowcaseUiState = createDefaultShowcaseUiState()