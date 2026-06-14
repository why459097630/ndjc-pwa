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
  buildHomeCategories,
  buildVisibleHomeDishes,
  buildAllTags,
  matchesSearchQuery,
  matchesPriceRange,
  formatPriceText,
  getDishEffectivePrice,
  getDishPrimaryImageUrl,
  getDishSubtitle,
  getDishTitle,
  isDishOnSale,
  normalizeNullableText,
  normalizeText,
  readExtraContactDrafts,
  readExtraContacts,
  readProfileStringArray,
  readProfileText,
  sortDishes
} from './showcaseCommonWiring'
import {
  SHOWCASE_APP_VERSION,
  SHOWCASE_OFFICIAL_WEBSITE_URL
} from '../showcaseCloudConfig'

export function buildHomeWiringState(uiState: ShowcaseUiState): ShowcaseHomeUiState {
  return {
    dishes: buildVisibleHomeDishes(uiState),
    selectedCategory: uiState.selectedCategory,
    manualCategories: buildHomeCategories(uiState),
    isLoading: uiState.isLoading || uiState.isCloudLoading,
    statusMessage: uiState.statusMessage,
    snackbarMessage: uiState.snackbarMessage,
    storeProfile: uiState.storeProfile,
    searchQuery: uiState.searchQuery,
    sortMode: uiState.sortMode,
    filterRecommendedOnly: uiState.filterRecommendedOnly,
    filterOnSaleOnly: uiState.filterOnSaleOnly,
    priceMinDraft: uiState.homePriceMinDraft,
    priceMaxDraft: uiState.homePriceMaxDraft,
    appliedMinPrice: uiState.homeAppliedMinPrice,
    appliedMaxPrice: uiState.homeAppliedMaxPrice,
    allTags: buildAllTags(uiState),
    selectedTags: uiState.selectedTags,
    showSortMenu: uiState.homeShowSortMenu,
    showFilterMenu: uiState.homeShowFilterMenu,
    showPriceMenu: uiState.homeShowPriceMenu,
    showAppointments: buildBottomBarUiState(uiState).showAppointments,
    showChatDot: buildBottomBarUiState(uiState).showChatDot,
    showBookingsDot: buildBottomBarUiState(uiState).showBookingsDot,
    showAnnouncementsDot: buildBottomBarUiState(uiState).showAnnouncementsDot,

    pagination: DEFAULT_PAGINATION
  }
}

export function buildDetailWiringState(uiState: ShowcaseUiState): ShowcaseDetailUiState | null {
  const dish = uiState.selectedDish
  if (!dish) return null

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

  const maxIndex = Math.max(0, imageUrls.length - 1)
  const safeImageIndex = Math.min(Math.max(0, uiState.detailImageIndex), maxIndex)

  return {
    bottomBar: buildBottomBarUiState(uiState),

    dishId: dish.id,
    isFavorite: uiState.favoriteIds.includes(dish.id),
    title: getDishTitle(dish),
    subtitle: normalizeNullableText(dish.category),
    price: formatPriceText(getDishEffectivePrice(dish)),
    discountPrice: isDishOnSale(dish) ? formatPriceText(Number(dish.discountPrice)) : null,
    description: normalizeText(dish.description),
    category: normalizeNullableText(dish.category),
    isRecommended: Boolean(dish.isRecommended),
    isUnavailable: Boolean(dish.isSoldOut || dish.isHidden),
    imagePreviewUrl: imageUrls[safeImageIndex] || null,
    imageUrls,
    currentImageIndex: uiState.detailImageIndex,
    safeImageIndex,
    tags: Array.isArray(dish.tags) ? dish.tags : [],
    externalLink: normalizeNullableText(dish.externalLink),
    canBookAppointment: Boolean(uiState.appointmentsEnabled && !dish.isSoldOut && !dish.isHidden)
  }
}

function buildFavoriteCard(dish: ShowcaseUiState['dishes'][number]): ShowcaseFavoriteCard {
  return {
    dishId: dish.id,
    title: getDishTitle(dish),
    category: normalizeNullableText(dish.category),
    originalPriceText: formatPriceText(Number(dish.originalPrice)),
    discountPriceText: isDishOnSale(dish) ? formatPriceText(Number(dish.discountPrice)) : null,
    priceText: formatPriceText(getDishEffectivePrice(dish)),
    imageUrl: getDishPrimaryImageUrl(dish),
    isRecommended: Boolean(dish.isRecommended),
    isHidden: Boolean(dish.isHidden),
    itemAvailable: Boolean(!dish.isSoldOut && !dish.isHidden)
  }
}

export function buildFavoritesWiringState(uiState: ShowcaseUiState): ShowcaseFavoritesUiState {
  const favoriteDishes = uiState.dishes.filter(dish => uiState.favoriteIds.includes(dish.id))

  const filtered = sortDishes(
    favoriteDishes.filter(dish => {
      if (uiState.favoritesSelectedCategory && dish.category !== uiState.favoritesSelectedCategory) return false
      if (uiState.favoritesFilterRecommendedOnly && !dish.isRecommended) return false
      if (uiState.favoritesFilterOnSaleOnly && !isDishOnSale(dish)) return false
      if (!matchesSearchQuery(dish, uiState.favoritesQuery)) return false
      if (!matchesPriceRange(dish, uiState.favoritesAppliedMinPrice, uiState.favoritesAppliedMaxPrice)) return false

      return true
    }),
    uiState.favoritesSortMode
  )

  return {
    bottomBar: buildBottomBarUiState(uiState),

    query: uiState.favoritesQuery,
    items: filtered.map(buildFavoriteCard),
    selectedIds: uiState.favoritesSelectedIds,
    sortMode: uiState.favoritesSortMode,
    filterRecommendedOnly: uiState.favoritesFilterRecommendedOnly,
    filterOnSaleOnly: uiState.favoritesFilterOnSaleOnly,
    priceMinDraft: uiState.favoritesPriceMinDraft,
    priceMaxDraft: uiState.favoritesPriceMaxDraft,
    appliedMinPrice: uiState.favoritesAppliedMinPrice,
    appliedMaxPrice: uiState.favoritesAppliedMaxPrice,
    showSortMenu: uiState.favoritesShowSortMenu,
    showFilterMenu: uiState.favoritesShowFilterMenu,
    showPriceMenu: uiState.favoritesShowPriceMenu,
    selectedCategory: uiState.favoritesSelectedCategory,
    categories: uiState.favoriteCategories,
    manualCategories: uiState.manualCategories,
    statusMessage: uiState.snackbarMessage
  }
}


export function buildStoreProfileWiringState(uiState: ShowcaseUiState): ShowcaseStoreProfileUiState {
  const profile = (uiState.storeProfile || {}) as Record<string, unknown>
  const draft = (uiState.storeProfileDraft || uiState.storeProfile || {}) as Record<string, unknown>
  const title = readProfileText(profile, ['title', 'displayName'])
  const subtitle = readProfileText(profile, ['subtitle', 'tagline'])
  const address = readProfileText(profile, ['address'])
  const hours = readProfileText(profile, ['hours', 'businessHours'])
  const mapUrl = readProfileText(profile, ['mapUrl'])
  const businessStatus = uiState.draftBusinessStatus || readProfileText(profile, ['businessStatus'])

  return {
    bottomBar: buildBottomBarUiState(uiState),

    canEdit: uiState.isAdminLoggedIn,
    title,
    subtitle,
    description: uiState.storeProfileDescription,
    services: uiState.storeProfileServices,
    extraContacts: uiState.storeProfileExtraContacts,
    address,
    hours,
    mapUrl,
    businessStatus,

    appName: title || 'App',
    versionName: SHOWCASE_APP_VERSION,
    merchantEmail: 'Not provided',
    privacyUrl: '',
    poweredByUrl: SHOWCASE_OFFICIAL_WEBSITE_URL,

    draftBusinessStatus: uiState.draftBusinessStatus,
    logoUrl: uiState.storeProfileLogoUrl,
    coverUrl: uiState.storeProfileCoverUrl,
    openStatusText: businessStatus || '',
    isOpenNow: null,
    isEditing: uiState.isEditingStoreProfile,
    draftTitle: readProfileText(draft, ['title', 'displayName']),
    draftSubtitle: readProfileText(draft, ['subtitle', 'tagline']),
    draftDescription: uiState.draftStoreProfileDescription,
    draftAddress: readProfileText(draft, ['address']),
    draftHours: readProfileText(draft, ['hours', 'businessHours']),
    draftMapUrl: readProfileText(draft, ['mapUrl']),
    draftLogoUrl: uiState.draftStoreProfileLogoUrl,
    draftCoverUrl: uiState.draftStoreProfileCoverUrl,
    draftServices: uiState.draftStoreProfileServices,
    draftExtraContacts: uiState.draftStoreProfileExtraContacts,
    validationError: uiState.storeProfileSaveError,
    logoUploadErrorMessage: uiState.storeProfileLogoUploadError,
    coverUploadErrorMessage: uiState.storeProfileCoverUploadError,
    isSaving: uiState.isSavingStoreProfile,
    isRefreshing: Boolean(uiState.isRefreshingStoreProfile),
    statusMessage: uiState.statusMessage || uiState.snackbarMessage,
    errorMessage: uiState.storeProfileSaveError,
    successMessage: uiState.storeProfileSaveSuccess ? 'Store profile saved.' : null,
    hasUnsavedChanges: false,
    pendingExitTarget: null
  }
}
