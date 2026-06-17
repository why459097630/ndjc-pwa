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
  buildAdminSyncNoticeLabel,
  buildHomeCategories,
  getDishEffectivePrice,
  getDishPrimaryImageUrl,
  getDishTitle,
  isDishOnSale,
  normalizeNullableText,
  normalizeText,
  readProfileText,
  sortDishes
} from './showcaseCommonWiring'

function matchesAdminItemsQuery(dish: ShowcaseUiState['dishes'][number], queryInput: string): boolean {
  const query = queryInput.trim().toLowerCase()
  if (!query) return true

  const searchableText = [
    getDishTitle(dish),
    dish.name,
    dish.description,
    dish.category
  ].map(item => String(item || '').toLowerCase()).join('\n')

  return searchableText.includes(query)
}

function matchesAdminItemsPriceRange(
  dish: ShowcaseUiState['dishes'][number],
  minPrice: number | null,
  maxPrice: number | null
): boolean {
  const price = getDishEffectivePrice(dish)

  if (minPrice != null && price < minPrice) return false
  if (maxPrice != null && price > maxPrice) return false

  return true
}

function sortAdminDishes(
  dishes: ShowcaseUiState['dishes'],
  sortMode: ShowcaseHomeSortMode
): ShowcaseUiState['dishes'] {
  return sortDishes(dishes, sortMode)
}

function buildAdminVisibleDishes(uiState: ShowcaseUiState): ShowcaseUiState['dishes'] {
  const filtered = uiState.dishes.filter(dish => {
    if (uiState.selectedCategory && dish.category !== uiState.selectedCategory) return false
    if (uiState.adminItemsFilterRecommended && !dish.isRecommended) return false
    if (uiState.adminItemsFilterHiddenOnly && !dish.isHidden) return false
    if (uiState.adminItemsFilterDiscountOnly && !isDishOnSale(dish)) return false
    if (!matchesAdminItemsQuery(dish, uiState.adminItemsSearchQuery)) return false
    if (!matchesAdminItemsPriceRange(dish, uiState.adminItemsAppliedMinPrice, uiState.adminItemsAppliedMaxPrice)) return false

    return true
  })

  return sortAdminDishes(filtered, uiState.adminItemsSortMode)
}

function countPendingAppointments(uiState: ShowcaseUiState): number {
  return uiState.appointments.filter(item => {
    const statusLabel = String(item.statusLabel || '').trim().toLowerCase()
    return statusLabel === 'pending'
  }).length
}

function countUnreadMerchantThreads(uiState: ShowcaseUiState): number {
  return uiState.merchantChatThreads.reduce((total, thread) => {
    const count = Number(thread.unreadCount || 0)
    return total + (Number.isFinite(count) && count > 0 ? count : 0)
  }, 0)
}

function buildAdminStoreProfileDraft(
  source: ShowcaseUiState['storeProfileDraft']
): ShowcaseStoreProfileDraft | null {
  if (!source) return null

  const record = source as Record<string, unknown>

  return {
    displayName: readProfileText(record, ['displayName', 'title']),
    tagline: readProfileText(record, ['tagline', 'subtitle']),
    address: readProfileText(record, ['address']),
    businessHours: readProfileText(record, ['businessHours', 'hours']),
    mapUrl: readProfileText(record, ['mapUrl']),
    isDirty: Boolean(record.isDirty)
  }
}

export function buildAdminWiringState(uiState: ShowcaseUiState): ShowcaseAdminUiState {
  return {
    isLoading: uiState.isLoading,
    statusMessage: uiState.statusMessage,
    cloudStatus: uiState.cloudStatus,

    itemsSortMode: uiState.adminItemsSortMode,
    itemsSortAscending: uiState.adminItemsSortAscending,
    itemsSearchQuery: uiState.adminItemsSearchQuery,
    filterRecommended: uiState.adminItemsFilterRecommended,
    filterHiddenOnly: uiState.adminItemsFilterHiddenOnly,
    filterDiscountOnly: uiState.adminItemsFilterDiscountOnly,

    priceMinDraft: uiState.adminItemsPriceMinDraft,
    priceMaxDraft: uiState.adminItemsPriceMaxDraft,
    appliedMinPrice: uiState.adminItemsAppliedMinPrice,
    appliedMaxPrice: uiState.adminItemsAppliedMaxPrice,

    selectedCategory: uiState.selectedCategory,
    manualCategories: buildHomeCategories(uiState),
    adminCategories: uiState.adminCategories,
    dishes: buildAdminVisibleDishes(uiState),
    pendingDeleteDishId: uiState.pendingDeleteDishId,
    selectedDishIds: uiState.adminSelectedDishIds,

    storeProfile: uiState.storeProfile,
    storeProfileDraft: buildAdminStoreProfileDraft(uiState.storeProfileDraft),
    isSavingStoreProfile: uiState.isSavingStoreProfile,
    storeProfileSaveError: uiState.storeProfileSaveError,
    storeProfileSaveSuccess: uiState.storeProfileSaveSuccess,

    pendingSyncCount: uiState.pendingSyncCount,
    syncErrorMessage: uiState.syncErrorMessage,
    syncOverviewState: uiState.syncOverviewState,
    syncNoticeLabel: buildAdminSyncNoticeLabel(
      uiState.syncOverviewState,
      uiState.pendingSyncCount,
      uiState.syncErrorMessage
    ),

    adminUsernameDraft: uiState.adminUsernameDraft,
    adminPasswordDraft: uiState.adminPasswordDraft,

    pendingDeleteCategory: uiState.adminPendingDeleteCategory,
    cannotDeleteCategory: uiState.adminCannotDeleteCategory,
    categorySubmittingAction: uiState.categorySubmittingAction,

    appointmentsEnabled: uiState.appointmentsEnabled,
    appointmentCount: uiState.appointments.length,
    pendingAppointmentCount: countPendingAppointments(uiState),
    unreadMessageCount: countUnreadMerchantThreads(uiState),

    itemsPagination: DEFAULT_PAGINATION
  }
}

function stringifyPriceForEditor(value: number | null | undefined): string {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return ''
  }

  return String(numberValue)
}

function buildEmptyEditDishState(uiState: ShowcaseUiState): ShowcaseEditDishUiState {
  return {
    id: '',
    name: '',
    description: '',
    category: uiState.selectedCategory,
    availableCategories: buildHomeCategories(uiState),
    originalPrice: '',
    discountPrice: '',
    isRecommended: false,
    isHidden: false,
    imageUrls: [],
    isSaving: uiState.isSavingEditDish,
    isBlocking: uiState.isBlockingEditDish,
    statusMessage: uiState.statusMessage || uiState.snackbarMessage,
    isNew: true,
    errorMessage: uiState.editValidationError,
    isDiscountInvalidNumber: false,
    isDiscountGEPrice: false,
    priceErrorText: null,
    discountErrorText: null,
    discountValidationError: false,
    nameRequiredError: false,
    priceRequiredError: false,
    descriptionRequiredError: false,
    categoryRequiredError: false,
    imagesRequiredError: false,
    imageUploadErrorMessage: uiState.editImageUploadError,
    showErrorDialog: false,
    canSave: false,
    canAddImageSlot: true,
    maxImages: 9,
    hasUnsavedChanges: false,
    pendingExitTarget: null
  }
}

function buildEditDishValidationState(
  originalPriceDraft: string,
  discountPriceDraft: string,
  titleDraft: string
): Pick<ShowcaseEditDishUiState, 'isDiscountInvalidNumber' | 'isDiscountGEPrice' | 'discountErrorText' | 'canSave'> {
  const originalPrice = Number(originalPriceDraft)
  const hasOriginalPrice = Number.isFinite(originalPrice) && originalPrice > 0
  const discountText = discountPriceDraft.trim()
  const discountPrice = Number(discountText)
  const hasDiscount = discountText.length > 0
  const discountInvalidNumber = hasDiscount && (!Number.isFinite(discountPrice) || discountPrice <= 0)
  const discountGEPrice = hasDiscount && !discountInvalidNumber && hasOriginalPrice && discountPrice >= originalPrice

  let discountErrorText: string | null = null
  if (discountInvalidNumber) {
    discountErrorText = 'Enter a valid discount price.'
  } else if (discountGEPrice) {
    discountErrorText = 'Discount must be lower than original price.'
  }

  return {
    isDiscountInvalidNumber: discountInvalidNumber,
    isDiscountGEPrice: discountGEPrice,
    discountErrorText,
    canSave: Boolean(titleDraft.trim() && hasOriginalPrice && !discountInvalidNumber && !discountGEPrice)
  }
}

export function buildEditDishWiringState(uiState: ShowcaseUiState): ShowcaseEditDishUiState {
  const dish = uiState.selectedDish
  if (!dish) return buildEmptyEditDishState(uiState)

  const name = getDishTitle(dish)
  const description = normalizeText(dish.description)
  const originalPrice = stringifyPriceForEditor(dish.originalPrice)
  const discountPrice = stringifyPriceForEditor(dish.discountPrice)
  const imageUrls = Array.from(
    new Set(
      [
        ...(dish.imageUri ? [dish.imageUri] : []),
        ...(Array.isArray(dish.imageUrls) ? dish.imageUrls : [])
      ]
        .map(item => normalizeText(item))
        .filter(Boolean)
    )
  )
  const validation = buildEditDishValidationState(originalPrice, discountPrice, name)

  return {
    id: dish.id,
    name,
    description,
    category: normalizeNullableText(dish.category),
    availableCategories: buildHomeCategories(uiState),
    originalPrice,
    discountPrice,
    isRecommended: Boolean(dish.isRecommended),
    isHidden: Boolean(dish.isHidden),
    imageUrls,
    isSaving: uiState.isSavingEditDish,
    isBlocking: uiState.isBlockingEditDish,
    statusMessage: uiState.statusMessage || uiState.snackbarMessage,
    isNew: false,
    errorMessage: uiState.editValidationError,
    isDiscountInvalidNumber: validation.isDiscountInvalidNumber,
    isDiscountGEPrice: validation.isDiscountGEPrice,
    priceErrorText: null,
    discountErrorText: validation.discountErrorText,
    discountValidationError: false,
    nameRequiredError: false,
    priceRequiredError: false,
    descriptionRequiredError: false,
    categoryRequiredError: false,
    imagesRequiredError: false,
    imageUploadErrorMessage: uiState.editImageUploadError,
    showErrorDialog: Boolean(uiState.editValidationError),
    canSave: validation.canSave,
    canAddImageSlot: imageUrls.length < 9,
    maxImages: 9,
    hasUnsavedChanges: Boolean(dish.dirty),
    pendingExitTarget: null
  }
}

