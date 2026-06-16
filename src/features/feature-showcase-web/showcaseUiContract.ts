import type { DemoDish, ShowcaseImageVariants } from './showcaseModels'
import type { ShowcaseUiWiring } from './showcaseUiWiring'

export type ShowcaseHomeSortMode =
  | 'Default'
  | 'PriceAsc'
  | 'PriceDesc'

export type ShowcaseScreenName =
  | 'Home'
  | 'Login'
  | 'Admin'
  | 'AdminItems'
  | 'AdminCategories'
  | 'Detail'
  | 'Edit'
  | 'StoreProfileView'
  | 'StoreProfile'
  | 'ChangePassword'
  | 'MerchantChatList'
  | 'Chat'
  | 'ChatSearchResults'
  | 'ChatMedia'
  | 'Favorites'
  | 'Appointments'
  | 'CustomerBookings'
  | 'Announcements'
  | 'AdminAppointmentManager'
  | 'AdminAnnouncementEdit'

export type ShowcaseScreen = ShowcaseScreenName

export type AdminEntryMode =
  | 'None'
  | 'RenameCategory'
  | 'EditCategories'
  | 'EditStoreProfile'

export type ShowcaseSyncOverviewState =
  | 'Idle'
  | 'HasPending'
  | 'Syncing'
  | 'Failed'

export type ShowcaseRetryOp =
  | 'LoadFromCloud'
  | 'RetryPendingSync'
  | 'RefreshStoreProfile'

export const LoadFromCloud = 'LoadFromCloud' as const
export type LoadFromCloud = typeof LoadFromCloud

export const RetryPendingSync = 'RetryPendingSync' as const
export type RetryPendingSync = typeof RetryPendingSync

export const RefreshStoreProfile = 'RefreshStoreProfile' as const
export type RefreshStoreProfile = typeof RefreshStoreProfile

export type SyncOverviewState = ShowcaseSyncOverviewState

export type SortMode =
  | 'Price'
  | 'Name'

export type ShowcaseRoute =
  | 'Home'
  | 'Login'
  | 'Admin'
  | 'Detail'
  | 'Edit'
  | 'Favorites'

export type ShowcaseStoreProfile = {
  displayName: string
  tagline: string
  address: string
  businessHours: string
  mapUrl: string
}

export type StoreProfile = ShowcaseStoreProfile

export type ShowcaseStoreProfileDraft = {
  displayName: string
  tagline: string
  address: string
  businessHours: string
  mapUrl: string
  isDirty: boolean
}

export type ShowcaseCloudStatusUi = {
  storeId: string
  planLabel: string
  statusLabel: string
  daysRemainingLabel: string
  serviceEndAtLabel: string
  deleteAtLabel: string
  canWrite: boolean
}

export type ShowcaseHomeDish = {
  clickCount: number
  id: string
  title: string
  subtitle: string | null
  category: string | null
  price: number
  originalPrice: number
  discountPrice: number | null
  isRecommended: boolean
  isSoldOut: boolean
  isFavorite: boolean
  isHidden: boolean
  imagePreviewUrl: string | null
  imageVariants?: ShowcaseImageVariants | null
}

export type ShowcaseBottomBarUiState = {
  showAppointments: boolean
  showChatDot: boolean
  showBookingsDot: boolean
  showAnnouncementsDot: boolean
}

export type ShowcasePaginationUiState = {
  hasMore: boolean
  isLoadingMore: boolean
}

export type ShowcaseChatWindowMode =
  | 'latest'
  | 'aroundMessage'

export type ShowcaseHomeUiState = {
  dishes: ShowcaseHomeDish[]
  selectedCategory: string | null
  manualCategories: string[]
  isLoading: boolean
  statusMessage: string | null
  snackbarMessage: string | null

  storeProfile: ShowcaseStoreProfile | null

  searchQuery: string
  sortMode: ShowcaseHomeSortMode
  filterRecommendedOnly: boolean
  filterOnSaleOnly: boolean

  priceMinDraft: string
  priceMaxDraft: string
  appliedMinPrice: number | null
  appliedMaxPrice: number | null

  allTags: string[]
  selectedTags: string[]

  showSortMenu: boolean
  showFilterMenu: boolean
  showPriceMenu: boolean

  showAppointments: boolean
  showChatDot: boolean
  showBookingsDot: boolean
  showAnnouncementsDot: boolean

  pagination: ShowcasePaginationUiState
}

export type ShowcaseBottomNavigationActions = {
  onOpenStoreProfileView: () => void
  onOpenChat: () => void
  onOpenCustomerBookings: () => void
  onOpenAnnouncements: () => void
  onOpenFavorites: () => void
}

export type ShowcaseHomeActions = ShowcaseBottomNavigationActions & {
  onRefresh: () => Promise<void> | void
  onLoadMore: () => Promise<void> | void
  onCategorySelected: (value: string | null) => void
  onDishSelected: (id: string) => void

  onProfileClick: () => void
  onBackToHome: () => void

  onSearchQueryChange: (value: string) => void
  onToggleTag: (tag: string) => void
  onClearTags: () => void
  onSelectedTagsChange: (tags: string[]) => void
  onSortModeChange: (value: ShowcaseHomeSortMode) => void
  onFilterRecommendedOnlyChange: (value: boolean) => void
  onFilterOnSaleOnlyChange: (value: boolean) => void
  onApplyHomeFilters: (value: {
    recommendedOnly: boolean
    onSaleOnly: boolean
    minPriceDraft: string
    maxPriceDraft: string
  }) => void
  onClearSortAndFilters: () => void
  onClearAll: () => void

  onShowSortMenuChange: (value: boolean) => void
  onShowFilterMenuChange: (value: boolean) => void

  onPriceMinDraftChange: (value: string) => void
  onPriceMaxDraftChange: (value: string) => void
  onApplyPriceRange: () => void
  onClearPriceRange: () => void
  onShowPriceMenuChange: (value: boolean) => void

  onToggleFavorite: (id: string) => void
}

export type ShowcaseMerchantChatListActions = {
  onBackToHome: () => void
  onBack: () => void
  onRefresh: () => void
  onLoadMore: () => Promise<void> | void
  onSearchQueryChange: (value: string) => void
  onOpenThread: (threadId: string, title: string) => void
  onDeleteThread: (threadId: string) => void | Promise<void>
  onTogglePin: (threadId: string, pinned: boolean) => void
  onRenameThread: (threadId: string, newName: string) => void | Promise<void>
}

export type ShowcaseChatProductShare = {
  dishId: string
  title: string
  price: string
  originalPriceText: string | null
  discountPriceText: string | null
  imageUrl: string | null
  imageVariants?: ShowcaseImageVariants | null
  isRecommended: boolean
}

export type ShowcaseChatAppointmentShare = {
  appointmentId: string
  title: string
  preferredDate: string
  preferredTime: string
  statusLabel: string
  cancelledBy: string | null
  cancelledAt: number | null
  imageUrl: string | null
  imageVariants?: ShowcaseImageVariants | null
  customerName: string
  customerContact: string
  note: string
  sourceDishId: string | null
  priceText: string | null
  originalPriceText: string | null
  discountPriceText: string | null
  categoryText: string | null
  itemAvailable: boolean
  createdAtText: string
}

export type ShowcaseChatMessage = {
  id: string
  body: string
  createdAtText: string
  outgoing: boolean
  statusText: string | null
  imageUrls: string[]
  imageVariants?: ShowcaseImageVariants[] | null
  product: ShowcaseChatProductShare | null
  appointment: ShowcaseChatAppointmentShare | null
  quotedMessageId?: string | null
  quotePreviewText?: string | null
  failed?: boolean
  selected?: boolean
}

export type ShowcaseChatSearchResultUi = {
  conversationId: string
  messageId: string
  senderLabel: string
  createdAtText: string
  snippet: string
}

export type ShowcaseChatMediaItemUi = {
  conversationId: string
  messageId: string
  url: string
  dayKey: string
  createdAtText: string
}

export type ShowcaseChatThreadSummaryUi = {
  conversationId: string
  title: string
  subtitle: string
  lastMessage: string
  lastMessageAtText: string
  unreadCount: number
  pinned: boolean
  avatarUrl: string | null
}

export type ShowcaseChatUiState = {
  title: string
  subtitle: string
  messages: ShowcaseChatMessage[]
  draft: string
  draftImageUrls: string[]
  pendingProduct: ShowcaseChatProductShare | null
  pendingAppointment: ShowcaseChatAppointmentShare | null
  quotedMessageId: string | null
  isSending: boolean
  statusMessage: string | null
  inputPlaceholder: string

  selectionMode: boolean
  selectedMessageIds: string[]
  findQuery: string
  findResultIds: string[]
  focusedMessageId: string | null
  scrollToMessageId: string | null
  scrollToMessageSignal: number
  scrollToBottomSignal: number
  flashMessageId: string | null
  flashSignal: number
  searchResults: ShowcaseChatSearchResultUi[]
  mediaItems: ShowcaseChatMediaItemUi[]
  mediaPreviewUrls: string[]
  mediaPreviewIndex: number
  pinned: boolean
  canTogglePinned: boolean

  windowMode: ShowcaseChatWindowMode
  anchorMessageId: string | null
  hasNewerMessages: boolean
  isLoadingNewerMessages: boolean
  oldestMessageTimeMs: number | null
  newestMessageTimeMs: number | null

  pagination: ShowcasePaginationUiState
  searchPagination: ShowcasePaginationUiState
  mediaPagination: ShowcasePaginationUiState
}

export type ShowcaseChatActions = ShowcaseBottomNavigationActions & {
  onCopy: (label: string, text: string) => void
  onUseProductCardAsPending: (product: ShowcaseChatProductShare) => void
  onUseAppointmentCardAsPending: (appointment: ShowcaseChatAppointmentShare) => void
  onJumpToMessage: (messageId: string) => void
  onBackToHome: () => void
  onBack: () => void
  onDraftChange: (value: string) => void
  onSend: () => void
  onRetry: (messageId: string) => void
  onRefresh: () => void
  onLoadOlderMessages: () => Promise<void> | void
  onLoadNewerMessages: () => Promise<void> | void
  onQuoteMessage: (messageId: string) => void
  onCancelQuote: () => void
  onEnterSelection: (messageId: string) => void
  onToggleSelection: (messageId: string) => void
  onExitSelection: () => void
  onDeleteMessage: (messageId: string) => void
  onDeleteSelected: () => void
  onOpenSearchResults: () => void
  onCloseSearchResults: () => void
  onOpenMediaGallery: () => void
  onOpenImagePreview: (url: string, pool: string[]) => void
  onJumpToFoundMessage: (messageId: string) => void
  onOpenThreadFromSearch: (conversationId: string, messageId: string | null) => void
  onLoadMoreSearchResults: () => Promise<void> | void
  onLoadMoreMediaItems: () => Promise<void> | void
  onTogglePinned: () => void
  onOpenFind: () => void
  onCloseFind: () => void
  onFindQueryChange: (value: string) => void
  onFindNext: () => void
  onFindPrev: () => void
  onPickImages: (values: Array<File | Blob | string>) => void
  onOpenCamera: () => void
  onCameraCaptured: (value: File | Blob | string | null) => void
  onRemoveDraftImage: (url: string) => void
  onSavePreviewImage: (url: string) => void
  onSendPendingProduct: () => void
  onClearPendingProduct: () => void
  onSendPendingAppointment: () => void
  onClearPendingAppointment: () => void
  onOpenProductDetail: (dishId: string) => void
  onOpenAppointmentDetail: (appointment: ShowcaseChatAppointmentShare) => void
  isProductAvailable: (dishId: string) => boolean
  buildProductClipboardPayload: (product: ShowcaseChatProductShare) => string
}

export type ShowcaseChatMediaActions = {
  onBackToHome: () => void
  onBack: () => void
  onLoadMoreMediaItems: () => Promise<void> | void
  onSavePreviewImage: (url: string) => void
}

export type ShowcaseLoginUiState = {
  isLoading: boolean
  loginError: string | null
  usernameDraft: string
  passwordDraft: string
  rememberMe: boolean
  canLogin: boolean
}

export type ShowcaseLoginActions = {
  onUsernameDraftChange: (value: string) => void
  onPasswordDraftChange: (value: string) => void
  onRememberMeChange: (value: boolean) => void
  onLogin: (username: string, password: string) => void
  onBackToHome: () => void
}

export type ShowcaseAdminUiState = {
  isLoading: boolean
  statusMessage: string | null
  cloudStatus: ShowcaseCloudStatusUi | null

  itemsSortMode: ShowcaseHomeSortMode
  itemsSortAscending: boolean
  itemsSearchQuery: string
  filterRecommended: boolean
  filterHiddenOnly: boolean
  filterDiscountOnly: boolean

  priceMinDraft: string
  priceMaxDraft: string
  appliedMinPrice: number | null
  appliedMaxPrice: number | null

  selectedCategory: string | null
  manualCategories: string[]
  adminCategories: string[]
  dishes: DemoDish[]
  pendingDeleteDishId: string | null
  selectedDishIds: string[]

  storeProfile: ShowcaseStoreProfile | null
  storeProfileDraft: ShowcaseStoreProfileDraft | null
  isSavingStoreProfile: boolean
  storeProfileSaveError: string | null
  storeProfileSaveSuccess: boolean

  pendingSyncCount: number
  syncErrorMessage: string | null
  syncOverviewState: ShowcaseSyncOverviewState
  syncNoticeLabel: string

  adminUsernameDraft: string
  adminPasswordDraft: string

  pendingDeleteCategory: string | null
  cannotDeleteCategory: string | null
  categorySubmittingAction: 'add' | 'rename' | 'delete' | 'reorder' | null

  appointmentsEnabled: boolean
  appointmentCount: number
  pendingAppointmentCount: number
  unreadMessageCount: number

  itemsPagination: ShowcasePaginationUiState
}

export type ShowcaseAdminActions = {
  onBackToHome: () => void
  onBack: () => void
  onLogout: () => void
  onRefresh: () => void
  onLoadMoreItems: () => Promise<void> | void

  onItemsSortModeChange: (value: ShowcaseHomeSortMode) => void
  onItemsSearchQueryChange: (value: string) => void
  onClearItemsSearchQuery: () => void
  onItemsFilterRecommendedChange: (value: boolean) => void
  onItemsFilterHiddenOnlyChange: (value: boolean) => void
  onItemsFilterDiscountOnlyChange: (value: boolean) => void
  onApplyItemsFilters: (value: {
    recommendedOnly: boolean
    hiddenOnly: boolean
    discountOnly: boolean
    minPriceDraft: string
    maxPriceDraft: string
  }) => void

  onPriceMinDraftChange: (value: string) => void
  onPriceMaxDraftChange: (value: string) => void
  onApplyPriceRange: () => void
  onClearPriceRange: () => void

  onSelectCategory: (value: string | null) => void
  onAddCategory: (value: string) => void
  onDeleteCategory: (value: string) => void
  onRenameCategory: (oldName: string, newName: string) => void

  onOpenItemsManager: () => void
  onOpenCategoriesManager: () => void
  onOpenStoreProfile: () => void
  onOpenChangePassword: () => void
  onOpenMerchantChatList: () => void
  onAddNewDish: () => void
  onEditDish: (dishId: string) => void
  onDeleteDish: (dishId: string) => void

  onToggleSelectDish: (dishId: string) => void
  onClearSelectedDishes: () => void
  onDeleteSelectedDishes: () => void

  onDismissPendingDelete: () => void
  onConfirmPendingDelete: () => void
  onRetryPendingSync: () => void

  onAdminUsernameDraftChange: (value: string) => void
  onAdminPasswordDraftChange: (value: string) => void
  onSaveAdminCredentials: () => void
  onSetAdminCredentials: (username: string, password: string) => void

  onRequestDeleteCategory: (value: string) => void
  onDismissCategoryDeleteDialogs: () => void
  onConfirmPendingDeleteCategory: () => void

  onOpenAnnouncementPublisher: () => void
  onOpenAppointmentManager: () => void
}

export type ShowcaseEditDishUiState = {
  id: string
  name: string
  description: string
  category: string | null
  availableCategories: string[]
  originalPrice: string
  discountPrice: string
  isRecommended: boolean
  isHidden: boolean
  imageUrls: string[]
  imageVariants?: ShowcaseImageVariants | null
  isSaving: boolean
  isBlocking: boolean
  statusMessage: string | null
  isNew: boolean
  errorMessage: string | null
  isDiscountInvalidNumber: boolean
  isDiscountGEPrice: boolean
  discountErrorText: string | null
  nameRequiredError: boolean
  priceRequiredError: boolean
  descriptionRequiredError: boolean
  categoryRequiredError: boolean
  imagesRequiredError: boolean
  imageUploadErrorMessage: string | null
  showErrorDialog: boolean
  canSave: boolean
  canAddImageSlot: boolean
  maxImages: number
  hasUnsavedChanges: boolean
  pendingExitTarget: 'back' | 'home' | null
}

export type ShowcaseEditDishActions = {
  onBackToHome: () => void
  onBack: () => void
  onConfirmExit: () => void
  onDismissExitConfirm: () => void
  onNameChange: (value: string) => void
  onPriceChange: (value: string) => void
  onDiscountPriceChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onCategorySelected: (value: string | null) => void
  onToggleRecommended: (value: boolean) => void
  onToggleHidden: (value: boolean) => void
  onPickImage: () => void
  onImagePicked: (value: File | Blob | string) => void
  onRemoveImage: (url: string) => void
  onMoveImage: (fromIndex: number, toIndex: number) => void
  onSave: () => void
  onDelete: (() => void) | null
  onDismissError: () => void
}

export type ShowcaseDetailUiState = {
  bottomBar: ShowcaseBottomBarUiState

  dishId: string
  isFavorite: boolean
  title: string
  subtitle: string | null
  price: string
  discountPrice: string | null
  description: string
  category: string | null
  isRecommended: boolean
  isUnavailable: boolean
  imagePreviewUrl: string | null
  imageUrls: string[]
  imageVariants?: ShowcaseImageVariants | null
  currentImageIndex: number
  safeImageIndex: number
  tags: string[]
  externalLink: string | null
  canBookAppointment: boolean
}

export type ShowcaseDetailActions = ShowcaseBottomNavigationActions & {
  onBackToHome: () => void
  onBack: () => void
  onEdit: () => void
  onToggleFavorite: () => void
  onOpenChat: () => void
  onOpenImage: (url: string) => void
  onImageIndexChanged: (index: number) => void
  onBookAppointment: () => void
  onSavePreviewImage: (url: string) => void
}

export type ExtraContact = {
  id?: string
  name: string
  value: string
}

export type ExtraContactDraft = {
  id: string
  name: string
  value: string
}

export type ShowcaseExtraContact = ExtraContact

export type ShowcaseActions = {
  onBack: () => void
  onEdit: () => void
  onChangePassword: () => void
}

export type ShowcaseChangePasswordUiState = {
  current: string
  next: string
  confirm: string
  isSaving: boolean
  error: string | null
  success: string | null
}

export type ShowcaseChangePasswordActions = {
  onBackToHome: () => void
  onBack: () => void
  onCurrentChange: (value: string) => void
  onNextChange: (value: string) => void
  onConfirmChange: (value: string) => void
  onSubmit: () => void
}

export type ShowcaseStoreProfileUiState = {
  bottomBar: ShowcaseBottomBarUiState

  canEdit: boolean

  title: string
  subtitle: string
  description: string
  services: string[]
  extraContacts: ExtraContact[]

  address: string
  hours: string
  mapUrl: string
  businessStatus: string

  appName: string
  versionName: string
  merchantEmail: string
  privacyUrl: string
  poweredByUrl: string

  draftBusinessStatus: string

  logoUrl: string
  coverUrl: string
  logoImageVariants?: ShowcaseImageVariants | null
  coverImageVariants?: ShowcaseImageVariants | null

  openStatusText: string
  isOpenNow: boolean | null

  isEditing: boolean
  draftTitle: string
  draftSubtitle: string
  draftDescription: string
  draftAddress: string
  draftHours: string
  draftMapUrl: string
  draftLogoUrl: string
  draftCoverUrl: string
  draftServices: string[]
  draftExtraContacts: ExtraContactDraft[]

  validationError: string | null
  logoUploadErrorMessage: string | null
  coverUploadErrorMessage: string | null

  isSaving: boolean
  isRefreshing: boolean
  statusMessage: string | null
  errorMessage: string | null
  successMessage: string | null
  hasUnsavedChanges: boolean
  pendingExitTarget: 'back' | 'home' | null
}

export type ShowcaseStoreProfileActions = ShowcaseBottomNavigationActions & {
  onBackToHome: () => void
  onBack: () => void
  onConfirmExit: () => void
  onDismissExitConfirm: () => void
  onRefresh: () => void
  onEdit: () => void
  onCancelEdit: () => void
  onDiscardDraftAndGoHome: () => void
  onSave: () => void

  onTitleChange: (value: string) => void
  onSubtitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onAddressChange: (value: string) => void
  onHoursChange: (value: string) => void
  onMapUrlChange: (value: string) => void
  onBusinessStatusChange: (value: string) => void

  onLogoUrlChange: (value: string) => void
  onCoverUrlChange: (value: string) => void
  onLogoImagePicked: (value: File | Blob | string) => void
  onCoverImagesPicked: (values: Array<File | Blob | string>) => void
  onPickLogo: () => void
  onPickCover: () => void
  onRemoveLogo: () => void
  onRemoveCover: (url: string) => void
  onMoveCover: (fromIndex: number, toIndex: number) => void
  onCoverDraggingChange: (isDragging: boolean) => void

  onServiceChange: (index: number, value: string) => void
  onAddService: (value: string) => void
  onRemoveService: (index: number) => void

  onAddExtraContact: (name: string, value: string) => void
  onRemoveExtraContact: (id: string) => void
  onExtraContactNameChange: (id: string, value: string) => void
  onExtraContactValueChange: (id: string, value: string) => void

  onOpenMap: (url: string) => void
  onOpenWebsite: (url: string) => void
  onCopy: (label: string, text: string) => void
  onSavePreviewImage: (url: string) => void
}

export type ShowcaseFavoritesSort =
  | 'Default'
  | 'PriceAsc'
  | 'PriceDesc'

export type ShowcaseFavoriteCard = {
  dishId: string
  title: string
  category: string | null
  originalPriceText: string
  discountPriceText: string | null
  priceText: string
  imageUrl: string | null
  imageVariants?: ShowcaseImageVariants | null
  isRecommended: boolean
  isHidden: boolean
  itemAvailable: boolean
}

export type ShowcaseFavoritesUiState = {
  bottomBar: ShowcaseBottomBarUiState

  query: string
  items: ShowcaseFavoriteCard[]

  selectedIds: string[]

  sortMode: ShowcaseHomeSortMode
  filterRecommendedOnly: boolean
  filterOnSaleOnly: boolean

  priceMinDraft: string
  priceMaxDraft: string
  appliedMinPrice: number | null
  appliedMaxPrice: number | null

  showSortMenu: boolean
  showFilterMenu: boolean
  showPriceMenu: boolean

  selectedCategory: string | null
  categories: string[]
  manualCategories: string[]

  statusMessage: string | null
}

export type ShowcaseFavoritesActions = ShowcaseBottomNavigationActions & {
  onBackToHome: () => void
  onBack: () => void
  onQueryChange: (value: string) => void
  onOpenDetail: (dishId: string) => void
  onToggleSelect: (dishId: string) => void
  onClearSelection: () => void
  onDeleteSelected: () => void
  onSortModeChange: (value: ShowcaseHomeSortMode) => void
  onFilterRecommendedOnlyChange: (value: boolean) => void
  onFilterOnSaleOnlyChange: (value: boolean) => void
  onClearSortAndFilters: () => void
  onShowSortMenuChange: (value: boolean) => void
  onShowFilterMenuChange: (value: boolean) => void
  onPriceMinDraftChange: (value: string) => void
  onPriceMaxDraftChange: (value: string) => void
  onApplyPriceRange: () => void
  onClearPriceRange: () => void
  onShowPriceMenuChange: (value: boolean) => void
  onCategorySelected: (value: string | null) => void
}

export type ShowcaseAppointmentProductCard = {
  dishId: string
  title: string
  priceText: string | null
  originalPriceText: string | null
  discountPriceText: string | null
  imageUrl: string | null
  imageVariants?: ShowcaseImageVariants | null
  categoryText: string | null
  isRecommended: boolean
}

export type ShowcaseAppointmentCard = {
  id: string
  customerName: string
  customerContact: string
  serviceTitle: string
  preferredDate: string
  preferredTime: string
  note: string
  statusLabel: string
  cancelledBy: string | null
  cancelledAt: number | null
  canCancelByCustomer: boolean
  createdAtText: string
  imageUrl: string | null
  imageVariants?: ShowcaseImageVariants | null
  sourceDishId: string | null
  priceText: string | null
  originalPriceText: string | null
  discountPriceText: string | null
  categoryText: string | null
  isRecommended: boolean
  itemAvailable: boolean
}

export type ShowcaseAppointment = ShowcaseAppointmentCard

export type ShowcaseAppointmentDateOption = {
  value: string
  title: string
  subtitle: string
  available: boolean
  reason: string
}

export type ShowcaseAppointmentsUiState = {
  enabled: boolean
  product: ShowcaseAppointmentProductCard | null
  serviceDraft: string
  nameDraft: string
  contactDraft: string
  dateDraft: string
  timeDraft: string
  noteDraft: string
  errorMessage: string | null
  successMessage: string | null
  canSubmit: boolean
  isSubmitting: boolean

  bookingRuleSummary: string
  dateOptions: ShowcaseAppointmentDateOption[]
  timeOptions: string[]
}

export type ShowcaseAppointmentsActions = {
  onBackToHome: () => void
  onBack: () => void
  onServiceChange: (value: string) => void
  onNameChange: (value: string) => void
  onContactChange: (value: string) => void
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
  onNoteChange: (value: string) => void
  onOpenProductDetail: (dishId: string) => void
  onSubmit: () => void | Promise<void>
}

export type ShowcaseAdminAppointmentsUiState = {
  enabled: boolean
  items: ShowcaseAppointmentCard[]
  statusMessage: string | null
  isRefreshing: boolean
  statusSubmittingId: string | null
  settingsSubmitting: boolean
  focusedAdminAppointmentId: string | null

  bookingWindowDays: number
  availableHoursText: string
  slotIntervalMinutes: number
  closedDays: string[]
  minimumNotice: string

  dateFilterOptions: string[]
  statusFilterOptions: string[]
  serviceFilterOptions: string[]

  selectedDateFilter: string
  selectedStatusFilter: string
  selectedServiceFilter: string
  historyDateFilter: string | null

  pagination: ShowcasePaginationUiState
}

export type ShowcaseAppointmentSettingsSaveInput = {
  enabled: boolean
  bookingWindowDays: number
  availableHoursText: string
  slotIntervalMinutes: number
  closedDays: string[]
  minimumNotice: string
}

export type ShowcaseCustomerBookingsUiState = {
  bottomBar: ShowcaseBottomBarUiState

  enabled: boolean
  items: ShowcaseAppointmentCard[]
  statusMessage: string | null
  isRefreshing: boolean
  cancellationSubmittingId: string | null
  focusedCustomerAppointmentId: string | null

  dateFilterOptions: string[]
  statusFilterOptions: string[]
  serviceFilterOptions: string[]

  selectedDateFilter: string
  selectedStatusFilter: string
  selectedServiceFilter: string

  pagination: ShowcasePaginationUiState
}

export type ShowcaseAdminAppointmentsActions = {
  onBackToHome: () => void
  onBack: () => void
  onRefresh: () => void
  onCopy: (label: string, text: string) => void
  onEnabledChange: (value: boolean) => void

  onBookingWindowDaysChange: (value: number) => void
  onAvailableHoursTextChange: (value: string) => void
  onSlotIntervalMinutesChange: (value: number) => void
  onClosedDayToggle: (value: string) => void
  onMinimumNoticeChange: (value: string) => void
  onSettingsSave: (value: ShowcaseAppointmentSettingsSaveInput) => void | Promise<void>

  onDateFilterChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onServiceFilterChange: (value: string) => void
  onHistoryDateSelected: (value: string) => void
  onHistoryDateClear: () => void
  onConsumeFocusedAppointment: () => void

  onContactCustomer: (id: string) => void
  onOpenAppointmentProductDetail: (dishId: string) => void
  onLoadMore: () => Promise<void> | void

  onPending: (id: string) => void | Promise<void>
  onConfirm: (id: string) => void | Promise<void>
  onCancel: (id: string) => void | Promise<void>
  onComplete: (id: string) => void | Promise<void>
  onNoShow: (id: string) => void | Promise<void>
}

export type ShowcaseCustomerBookingsActions = ShowcaseBottomNavigationActions & {
  onBackToHome: () => void
  onBack: () => void
  onRefresh: () => void
  onCopy: (label: string, text: string) => void
  onDateFilterChange: (value: string) => void
  onStatusFilterChange: (value: string) => void
  onServiceFilterChange: (value: string) => void
  onConsumeFocusedAppointment: () => void
  onContactMerchant: (id: string) => void
  onCancelBooking: (id: string) => void | Promise<void>
  onOpenAppointmentProductDetail: (dishId: string) => void
  onLoadMore: () => Promise<void> | void
}

export type ShowcaseAnnouncementCard = {
  id: string
  coverUrl: string | null
  coverImageVariants?: ShowcaseImageVariants | null
  bodyPreview: string
  bodyText: string
  timeText: string
  viewCount: number
}

export type ShowcaseAnnouncementsUiState = {
  bottomBar: ShowcaseBottomBarUiState

  title: string
  items: ShowcaseAnnouncementCard[]
  isLoading: boolean
  statusMessage: string | null
  focusedAnnouncementId: string | null

  pagination: ShowcasePaginationUiState
}

export type ShowcaseAnnouncementsActions = ShowcaseBottomNavigationActions & {
  onBackToHome: () => void
  onBack: () => void
  onRefresh: () => void
  onOpenAnnouncement: (id: string) => void
  onTrackAnnouncementView: (id: string) => void
  onOpenAnnouncementImage: (id: string) => void
  onConsumeFocusedAnnouncement: () => void
  onLoadMore: () => Promise<void> | void
}

export type ShowcaseAnnouncementEditUiState = {
  coverDraftUrl: string | null
  bodyDraft: string
  editingId: string | null
  errorMessage: string | null
  successMessage: string | null
  statusMessage: string | null
  coverUploadErrorMessage: string | null
  isSubmitting: boolean
  isBlockingInput: boolean
  submittingAction: 'save' | 'publish' | 'delete' | null

  composerExpanded: boolean

  canStartNew: boolean
  canDeleteSelected: boolean
  canSaveDraft: boolean
  canPublish: boolean

  draftItems: ShowcaseAnnouncementCard[]

  selectedIds: string[]

  previewItem: ShowcaseAnnouncementCard | null
  previewVisible: boolean
  hasUnsavedChanges: boolean
  pendingExitTarget: 'back' | 'home' | null

  pagination: ShowcasePaginationUiState
}

export type ShowcaseAnnouncementEditActions = {
  onBackToHome: () => void
  onBack: () => void
  onConfirmExit: () => void
  onDismissExitConfirm: () => void

  onStartNew: () => void

  onPickCover: (value: File | Blob | string) => void
  onRemoveCover: () => void
  onOpenCoverPreview: () => void
  onBodyChange: (value: string) => void

  onSaveDraft: () => void | Promise<void>
  onPushNow: () => void | Promise<void>

  onOpenItem: (id: string) => void
  onPreviewItem: (id: string) => void
  onDismissPreview: () => void
  onToggleSelect: (id: string) => void
  onClearSelection: () => void
  onDeleteSelected: () => void | Promise<void>
  onLoadMore: () => Promise<void> | void
}

export type ShowcaseStoreUnavailableUiState = {
  visible: boolean
  title: string
  message: string
}

export type ShowcaseUiState = {
  dishes: DemoDish[]
  manualCategories: string[]
  adminCategories: string[]
  selectedCategory: string | null

  loginUsernameDraft: string
  loginPasswordDraft: string
  loginRememberMeDraft: boolean

  changePasswordCurrentDraft: string
  changePasswordNewDraft: string
  changePasswordConfirmDraft: string
  changePasswordError: string | null
  changePasswordSuccess: string | null

  screen: ShowcaseScreen
  isAdminLoggedIn: boolean
  pendingDeleteDishId: string | null
  adminEntryMode: AdminEntryMode

  isLoading: boolean
  isCloudLoading: boolean
  isSavingEditDish: boolean
  isBlockingEditDish: boolean
  statusMessage: string | null
  snackbarMessage: string | null
  cloudStatus: ShowcaseCloudStatusUi | null
  editValidationError: string | null
  editImageUploadError: string | null
  loginError: string | null

  selectedDish: DemoDish | null
  detailImageIndex: number
  favoriteIds: string[]

  searchQuery: string
  sortMode: ShowcaseHomeSortMode
  adminItemsSortMode: ShowcaseHomeSortMode
  adminItemsSearchQuery: string
  adminItemsFilterRecommended: boolean
  adminItemsFilterHiddenOnly: boolean
  adminItemsFilterDiscountOnly: boolean
  adminItemsSortAscending: boolean
  adminItemsPriceMinDraft: string
  adminItemsPriceMaxDraft: string
  adminItemsAppliedMinPrice: number | null
  adminItemsAppliedMaxPrice: number | null
  adminSelectedDishIds: string[]

  favoritesQuery: string
  favoritesSelectedIds: string[]
  favoritesSortMode: ShowcaseHomeSortMode
  favoritesFilterRecommendedOnly: boolean
  favoritesFilterOnSaleOnly: boolean
  favoritesPriceMinDraft: string
  favoritesPriceMaxDraft: string
  favoritesAppliedMinPrice: number | null
  favoritesAppliedMaxPrice: number | null
  favoritesShowSortMenu: boolean
  favoritesShowFilterMenu: boolean
  favoritesShowPriceMenu: boolean
  favoritesSelectedCategory: string | null
  favoriteCategories: string[]

  filterRecommendedOnly: boolean
  filterOnSaleOnly: boolean

  homeShowSortMenu: boolean
  homeShowFilterMenu: boolean
  homePriceMinDraft: string
  homePriceMaxDraft: string
  homeAppliedMinPrice: number | null
  homeAppliedMaxPrice: number | null
  homeShowPriceMenu: boolean

  adminUsernameDraft: string
  adminPasswordDraft: string
  adminPendingDeleteCategory: string | null
  adminCannotDeleteCategory: string | null
  categorySubmittingAction: 'add' | 'rename' | 'delete' | 'reorder' | null

  selectedTags: string[]

  syncOverviewState: SyncOverviewState
  lastSyncAt: number | null
  pendingSyncCount: number
  syncErrorMessage: string | null
  lastRetryOp: ShowcaseRetryOp | null

  storeProfile: StoreProfile | null
  storeProfileDraft: StoreProfile | null
  storeProfileDescription: string
  storeProfileServices: string[]
  storeProfileExtraContacts: ExtraContact[]
  storeProfileLogoUrl: string
  storeProfileCoverUrl: string
  draftStoreProfileDescription: string
  draftStoreProfileServices: string[]
  draftStoreProfileExtraContacts: ExtraContactDraft[]
  draftStoreProfileLogoUrl: string
  draftStoreProfileCoverUrl: string
  draftBusinessStatus: string
  isEditingStoreProfile: boolean
  isSavingStoreProfile: boolean
  isRefreshingStoreProfile: boolean
  storeProfileSaveError: string | null
  storeProfileLogoUploadError: string | null
  storeProfileCoverUploadError: string | null
  storeProfileSaveSuccess: boolean

  chat: ShowcaseChatUiState
  merchantChatThreads: ShowcaseChatThreadSummaryUi[]
  merchantChatListSearchQuery: string
  merchantChatListRefreshing: boolean
  merchantChatListPagination: ShowcasePaginationUiState

  announcements: ShowcaseAnnouncementCard[]
  adminAnnouncementDraftItems: ShowcaseAnnouncementCard[]
  adminAnnouncementComposerExpanded: boolean
  adminAnnouncementCoverDraftUrl: string | null
  adminAnnouncementBodyDraft: string
  adminAnnouncementEditingId: string | null
  adminAnnouncementSelectedIds: string[]
  adminAnnouncementPreviewId: string | null
  adminAnnouncementError: string | null
  adminAnnouncementSuccess: string | null
  adminAnnouncementCoverUploadError: string | null
  adminAnnouncementIsSubmitting: boolean
  adminAnnouncementIsBlocking: boolean
  adminAnnouncementSubmittingAction: 'save' | 'publish' | 'delete' | null
  pushTargetAnnouncementId: string | null

  appointmentsEnabled: boolean
  appointments: ShowcaseAppointment[]
  appointmentSourceDishId: string | null
  appointmentProduct: ShowcaseAppointmentProductCard | null
  appointmentServiceDraft: string
  appointmentNameDraft: string
  appointmentContactDraft: string
  appointmentDateDraft: string
  appointmentTimeDraft: string
  appointmentNoteDraft: string
  appointmentError: string | null
  appointmentSuccess: string | null
  appointmentsRefreshing: boolean

  appointmentBookingWindowDays: number
  appointmentAvailableHoursText: string
  appointmentSlotIntervalMinutes: number
  appointmentClosedDays: string[]
  appointmentMinimumNotice: string

  appointmentAdminDateFilter: string
  appointmentAdminStatusFilter: string
  appointmentAdminServiceFilter: string
  appointmentAdminHistoryDateFilter: string | null

  appointmentCustomerDateFilter: string
  appointmentCustomerStatusFilter: string
  appointmentCustomerServiceFilter: string
}

export type ShowcaseOfflineStatusUi = {
  isOffline: boolean
  bannerMessage: string | null
}

export type ShowcaseUiModel = {
  screen: ShowcaseScreenName
  showcaseWiring: ShowcaseUiWiring
  offlineStatus: ShowcaseOfflineStatusUi
  storeUnavailableState: ShowcaseStoreUnavailableUiState
  handleShowcaseBack: () => boolean

  homeState: ShowcaseHomeUiState
  homeActions: ShowcaseHomeActions

  loginState: ShowcaseLoginUiState
  loginActions: ShowcaseLoginActions

  adminState: ShowcaseAdminUiState
  adminActions: ShowcaseAdminActions

  editDishState: ShowcaseEditDishUiState
  editDishActions: ShowcaseEditDishActions

  detailState: ShowcaseDetailUiState
  detailActions: ShowcaseDetailActions

  storeProfileState: ShowcaseStoreProfileUiState
  storeProfileActions: ShowcaseStoreProfileActions

  changePasswordState: ShowcaseChangePasswordUiState
  changePasswordActions: ShowcaseChangePasswordActions

  favoritesState: ShowcaseFavoritesUiState
  favoritesActions: ShowcaseFavoritesActions

  appointmentsState: ShowcaseAppointmentsUiState
  appointmentsActions: ShowcaseAppointmentsActions

  customerBookingsState: ShowcaseCustomerBookingsUiState
  customerBookingsActions: ShowcaseCustomerBookingsActions

  adminAppointmentsState: ShowcaseAdminAppointmentsUiState
  adminAppointmentsActions: ShowcaseAdminAppointmentsActions

  announcementsState: ShowcaseAnnouncementsUiState
  announcementsActions: ShowcaseAnnouncementsActions

  announcementEditState: ShowcaseAnnouncementEditUiState
  announcementEditActions: ShowcaseAnnouncementEditActions

  chatState: ShowcaseChatUiState
  chatActions: ShowcaseChatActions

  chatMediaActions: ShowcaseChatMediaActions

  merchantChatListActions: ShowcaseMerchantChatListActions
}