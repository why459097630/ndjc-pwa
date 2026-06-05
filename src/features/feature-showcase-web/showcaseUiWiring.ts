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
} from './showcaseUiContract'
import type {
  ShowcaseCloudServiceStatus,
  ShowcaseCloudStatus
} from './showcaseModels'
import {
  ShowcaseRetryOps,
  SyncOverviewStates,
  createDefaultShowcaseUiState
} from './showcaseUiState'
import { pickDisplayText } from './showcaseI18n'
import { SHOWCASE_APP_VERSION } from './showcaseCloudConfig'

export type ShowcaseUiWiringState = ShowcaseUiState

const DEFAULT_PAGINATION = {
  hasMore: false,
  isLoadingMore: false
}

export type ShowcaseBottomNavigationTab =
  | 'Home'
  | 'StoreProfileView'
  | 'Chat'
  | 'CustomerBookings'
  | 'Announcements'
  | 'Favorites'

export type ShowcaseBottomNavigationWiringState = {
  visible: boolean
  activeTab: ShowcaseBottomNavigationTab | null
}

export type ShowcaseSyncCloudWiringState = {
  syncNoticeLabel: string
  showSyncNotice: boolean
  cloudStatus: ShowcaseCloudStatusUi | null
  cloudStatusLabel: string
  cloudDaysRemainingLabel: string
  cloudServiceEndAtLabel: string
  cloudDeleteAtLabel: string
  canWrite: boolean
  showWriteBlockedNotice: boolean
  retryOp: ShowcaseRetryOp
}

export type ShowcaseScreenWiringState = {
  screen: ShowcaseScreen
  bottomNavigation: ShowcaseBottomNavigationWiringState
  syncCloud: ShowcaseSyncCloudWiringState
}

export type ShowcaseUiWiringActions = {
  bottomNavigation: ShowcaseBottomNavigationActions
  home: ShowcaseHomeActions
  login: ShowcaseLoginActions
  admin: ShowcaseAdminActions
  detail: ShowcaseDetailActions
  editDish: ShowcaseEditDishActions
  storeProfile: ShowcaseStoreProfileActions
  favorites: ShowcaseFavoritesActions
  merchantChatList: ShowcaseMerchantChatListActions
  chat: ShowcaseChatActions
  chatMedia: ShowcaseChatMediaActions
  appointments: ShowcaseAppointmentsActions
  adminAppointments: ShowcaseAdminAppointmentsActions
  customerBookings: ShowcaseCustomerBookingsActions
  announcements: ShowcaseAnnouncementsActions
  announcementEdit: ShowcaseAnnouncementEditActions
}

export type ShowcaseMerchantChatListWiringState = {
  threads: ShowcaseChatThreadSummaryUi[]
  visibleThreads: ShowcaseChatThreadSummaryUi[]
  searchQuery: string
  refreshing: boolean
  unreadTotal: number
  pinnedCount: number
  empty: boolean
  pagination: {
    hasMore: boolean
    isLoadingMore: boolean
  }
}

export type ShowcaseChatMediaWiringState = {
  urls: string[]
  previewIndex: number
  currentUrl: string | null
  count: number
  empty: boolean
}

export type ShowcaseUiWiring = {
  uiState: ShowcaseUiWiringState
  screen: ShowcaseScreenWiringState
  bottomNavigation: ShowcaseBottomNavigationWiringState
  syncCloud: ShowcaseSyncCloudWiringState
  home: ShowcaseHomeUiState
  admin: ShowcaseAdminUiState
  detail: ShowcaseDetailUiState | null
  editDish: ShowcaseEditDishUiState
  favorites: ShowcaseFavoritesUiState
  storeProfile: ShowcaseStoreProfileUiState
  merchantChatList: ShowcaseMerchantChatListWiringState
  chat: ShowcaseChatUiState
  chatMedia: ShowcaseChatMediaWiringState
  appointments: ShowcaseAppointmentsUiState
  adminAppointments: ShowcaseAdminAppointmentsUiState
  customerBookings: ShowcaseCustomerBookingsUiState
  announcements: ShowcaseAnnouncementsUiState
  announcementEdit: ShowcaseAnnouncementEditUiState
  actions: ShowcaseUiWiringActions
}

export type ShowcaseUiWiringInput = {
  uiState?: ShowcaseUiState | null
  actions?: Partial<ShowcaseUiWiringActions> | null
}

function noop(): void {
  // Intentionally empty. Used as a safe first-round wiring placeholder.
}

async function noopAsync(): Promise<void> {
  // Intentionally empty. Used as a safe first-round async wiring placeholder.
}

function noopString(_value: string): void {
  // Intentionally empty.
}

function noopImagePicked(_value: string | File | Blob): void {
}

function noopImagePickedArray(_value: Array<string | File | Blob>): void {
}

function noopNullableImagePicked(_value: string | File | Blob | null): void {
}

function noopNullableString(_value: string | null): void {
  // Intentionally empty.
}

function noopBoolean(_value: boolean): void {
  // Intentionally empty.
}

function noopNumber(_value: number): void {
  // Intentionally empty.
}

function noopAppointmentSettingsSave(_value: ShowcaseAppointmentSettingsSaveInput): void {
  // Intentionally empty.
}

function noopNumberString(_index: number, _value: string): void {
  // Intentionally empty.
}

function noopSortMode(_value: ShowcaseHomeSortMode): void {
  // Intentionally empty.
}

function noopStringString(_left: string, _right: string): void {
  // Intentionally empty.
}

function noopStringBoolean(_id: string, _value: boolean): void {
  // Intentionally empty.
}

function noopNumberNumber(_fromIndex: number, _toIndex: number): void {
  // Intentionally empty.
}

function returnFalse(): boolean {
  return false
}

function buildEmptyProductClipboardPayload(): string {
  return ''
}

export function parseCloudIsoMillis(raw: string): number | null {
  const value = String(raw || '').trim()
  if (!value) return null

  const normalized = value
    .replace(' ', 'T')
    .replace(/([+-]\d{2})$/, '$1:00')

  const date = new Date(normalized)
  const time = date.getTime()

  if (Number.isFinite(time)) {
    return time
  }

  return null
}

export function formatCloudDateTimeLabel(raw: string): string {
  const millis = parseCloudIsoMillis(raw)
  if (millis == null) return String(raw || '').trim()

  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(millis))
  } catch {
    return new Date(millis).toLocaleString()
  }
}

function startOfLocalDayMs(valueMs: number): number {
  const date = new Date(valueMs)
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export function buildCloudDaysRemainingLabel(serviceEndAt: string): string {
  const endAtMs = parseCloudIsoMillis(serviceEndAt)
  if (endAtMs == null) return ''

  const nowMs = Date.now()
  const diffMs = endAtMs - nowMs
  const oneDayMs = 24 * 60 * 60 * 1000

  if (diffMs <= 0) {
    return 'Expired'
  }

  const todayStartMs = startOfLocalDayMs(nowMs)
  const endDayStartMs = startOfLocalDayMs(endAtMs)
  const days = Math.floor((endDayStartMs - todayStartMs) / oneDayMs)

  if (days <= 0) return 'Expires today'
  if (days === 1) return '1 day left'
  return `${days} days left`
}

export function buildCloudStatusLabel(
  status: ShowcaseCloudServiceStatus,
  canWrite: boolean
): string {
  if (status === 'Active') {
    return canWrite ? 'Running · Writable' : 'Running · Not writable'
  }

  if (status === 'ReadOnly') {
    return 'Read-only · Not writable'
  }

  if (status === 'Deleted') {
    return 'Deleted · Not writable'
  }

  return canWrite ? 'Unknown · Writable' : 'Unknown · Not writable'
}

export function buildAdminSyncNoticeLabel(
  state: ShowcaseSyncOverviewState,
  pendingCount: number,
  errorMessage: string | null | undefined
): string {
  if (state === SyncOverviewStates.Idle) {
    return ''
  }

  if (state === SyncOverviewStates.HasPending) {
    return pendingCount > 0 ? `Sync: ${pendingCount} changes pending` : ''
  }

  if (state === SyncOverviewStates.Syncing) {
    return pendingCount > 0 ? `Syncing: ${pendingCount} changes pending` : 'Syncing...'
  }

  return errorMessage && errorMessage.trim()
    ? `Sync failed: ${errorMessage.trim()}`
    : 'Sync failed'
}

export function normalizeRetryOp(value: ShowcaseRetryOp | string | null | undefined): ShowcaseRetryOp {
  if (value === ShowcaseRetryOps.RetryPendingSync) return ShowcaseRetryOps.RetryPendingSync
  if (value === ShowcaseRetryOps.RefreshStoreProfile) return ShowcaseRetryOps.RefreshStoreProfile
  return ShowcaseRetryOps.LoadFromCloud
}

export function isBottomNavigationScreen(screen: ShowcaseScreen): boolean {
  return (
    screen === 'Home' ||
    screen === 'StoreProfileView' ||
    screen === 'Chat' ||
    screen === 'CustomerBookings' ||
    screen === 'Announcements' ||
    screen === 'Favorites'
  )
}

export function activeBottomNavigationTabForScreen(
  screen: ShowcaseScreen
): ShowcaseBottomNavigationTab | null {
  if (screen === 'Home') return 'Home'
  if (screen === 'StoreProfileView') return 'StoreProfileView'
  if (screen === 'Chat') return 'Chat'
  if (screen === 'CustomerBookings') return 'CustomerBookings'
  if (screen === 'Announcements') return 'Announcements'
  if (screen === 'Favorites') return 'Favorites'
  return null
}

export function screenForBottomNavigationTab(
  tab: ShowcaseBottomNavigationTab
): ShowcaseScreen {
  if (tab === 'StoreProfileView') return 'StoreProfileView'
  if (tab === 'Chat') return 'Chat'
  if (tab === 'CustomerBookings') return 'CustomerBookings'
  if (tab === 'Announcements') return 'Announcements'
  if (tab === 'Favorites') return 'Favorites'
  return 'Home'
}

export function buildBottomNavigationWiringState(
  screen: ShowcaseScreen
): ShowcaseBottomNavigationWiringState {
  return {
    visible: isBottomNavigationScreen(screen),
    activeTab: activeBottomNavigationTabForScreen(screen)
  }
}

export function buildCloudStatusUiFromService(
  status: ShowcaseCloudStatus | null | undefined
): ShowcaseCloudStatusUi | null {
  if (!status) return null

  const serviceEndAt = String(status.serviceEndAt || '').trim()
  const deleteAt = String(status.deleteAt || '').trim()

  return {
    storeId: String(status.storeId || '').trim(),
    planLabel: status.planType === 'Trial'
      ? 'Trial'
      : status.planType === 'Paid'
        ? 'Paid'
        : 'Unknown',
    statusLabel: buildCloudStatusLabel(status.serviceStatus, status.canWrite),
    daysRemainingLabel: serviceEndAt ? buildCloudDaysRemainingLabel(serviceEndAt) : '',
    serviceEndAtLabel: serviceEndAt ? formatCloudDateTimeLabel(serviceEndAt) : '',
    deleteAtLabel: deleteAt ? formatCloudDateTimeLabel(deleteAt) : '',
    canWrite: Boolean(status.canWrite)
  }
}

export function buildSyncCloudWiringState(
  uiState: ShowcaseUiState
): ShowcaseSyncCloudWiringState {
  const cloudStatus = uiState.cloudStatus
  const syncNoticeLabel = buildAdminSyncNoticeLabel(
    uiState.syncOverviewState,
    uiState.pendingSyncCount,
    uiState.syncErrorMessage
  )

  return {
    syncNoticeLabel,
    showSyncNotice: Boolean(syncNoticeLabel),
    cloudStatus,
    cloudStatusLabel: cloudStatus?.statusLabel || '',
    cloudDaysRemainingLabel: cloudStatus?.daysRemainingLabel || '',
    cloudServiceEndAtLabel: cloudStatus?.serviceEndAtLabel || '',
    cloudDeleteAtLabel: cloudStatus?.deleteAtLabel || '',
    canWrite: cloudStatus?.canWrite ?? true,
    showWriteBlockedNotice: cloudStatus ? !cloudStatus.canWrite : false,
    retryOp: normalizeRetryOp(uiState.lastRetryOp)
  }
}

export function buildScreenWiringState(
  uiState: ShowcaseUiState
): ShowcaseScreenWiringState {
  const bottomNavigation = buildBottomNavigationWiringState(uiState.screen)
  const syncCloud = buildSyncCloudWiringState(uiState)

  return {
    screen: uiState.screen,
    bottomNavigation,
    syncCloud
  }
}

function normalizeText(value: unknown): string {
  return String(value ?? '').trim()
}

function normalizeNullableText(value: unknown): string | null {
  const text = normalizeText(value)
  return text || null
}

function formatPriceText(value: number | null | undefined): string {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue)) {
    return '$0.00'
  }

  return `$${numberValue.toFixed(2)}`
}

function getDishTitle(dish: ShowcaseUiState['dishes'][number]): string {
  return pickDisplayText([
    dish.title,
    dish.name
  ], 'Untitled')
}

function getDishSubtitle(dish: ShowcaseUiState['dishes'][number]): string | null {
  return normalizeNullableText(pickDisplayText([
    dish.description
  ]))
}

function getDishPrimaryImageUrl(dish: ShowcaseUiState['dishes'][number]): string | null {
  if (dish.imageUri) return dish.imageUri

  if (Array.isArray(dish.imageUrls) && dish.imageUrls.length) {
    return normalizeNullableText(dish.imageUrls[0])
  }

  return null
}

function getDishEffectivePrice(dish: ShowcaseUiState['dishes'][number]): number {
  const discountPrice = Number(dish.discountPrice)

  if (Number.isFinite(discountPrice) && discountPrice > 0) {
    return discountPrice
  }

  const originalPrice = Number(dish.originalPrice)
  return Number.isFinite(originalPrice) ? originalPrice : 0
}

function isDishOnSale(dish: ShowcaseUiState['dishes'][number]): boolean {
  const discountPrice = Number(dish.discountPrice)
  const originalPrice = Number(dish.originalPrice)

  return (
    Number.isFinite(discountPrice) &&
    Number.isFinite(originalPrice) &&
    discountPrice > 0 &&
    originalPrice > 0 &&
    discountPrice < originalPrice
  )
}

function buildHomeDish(dish: ShowcaseUiState['dishes'][number]): ShowcaseHomeDish {
  return {
    clickCount: Number.isFinite(Number(dish.clickCount)) ? Number(dish.clickCount) : 0,
    id: dish.id,
    title: getDishTitle(dish),
    subtitle: getDishSubtitle(dish),
    category: normalizeNullableText(dish.category),
    price: getDishEffectivePrice(dish),
    originalPrice: Number.isFinite(Number(dish.originalPrice)) ? Number(dish.originalPrice) : 0,
    discountPrice: isDishOnSale(dish) ? Number(dish.discountPrice) : null,
    isRecommended: Boolean(dish.isRecommended),
    isSoldOut: Boolean(dish.isSoldOut),
    isFavorite: Boolean(dish.isFavorite),
    isHidden: Boolean(dish.isHidden),
    imagePreviewUrl: getDishPrimaryImageUrl(dish)
  }
}

function matchesSearchQuery(dish: ShowcaseUiState['dishes'][number], queryInput: string): boolean {
  const query = queryInput.trim().toLowerCase()
  if (!query) return true

  const haystack = [
    dish.name,
    dish.title,
    dish.description,
    dish.category
  ]
    .map(item => String(item || '').toLowerCase())
    .join(' ')

  return haystack.includes(query)
}

function matchesSelectedTags(dish: ShowcaseUiState['dishes'][number], selectedTags: string[]): boolean {
  const selectedTagSet = new Set(
    selectedTags
      .map(tag => tag.trim())
      .filter(Boolean)
  )

  if (selectedTagSet.size === 0) return true

  const dishTags = (Array.isArray(dish.tags) ? dish.tags : [])
    .map(tag => tag.trim())
    .filter(Boolean)

  return dishTags.some(tag => selectedTagSet.has(tag))
}

function matchesPriceRange(
  dish: ShowcaseUiState['dishes'][number],
  minPrice: number | null,
  maxPrice: number | null
): boolean {
  const price = getDishEffectivePrice(dish)

  if (minPrice != null && price < minPrice) return false
  if (maxPrice != null && price > maxPrice) return false

  return true
}

function sortDishes(
  items: ShowcaseUiState['dishes'],
  sortMode: ShowcaseHomeSortMode
): ShowcaseUiState['dishes'] {
  const sorted = [...items]

  if (sortMode === 'PriceAsc') {
    sorted.sort((left, right) => getDishEffectivePrice(left) - getDishEffectivePrice(right))
    return sorted
  }

  if (sortMode === 'PriceDesc') {
    sorted.sort((left, right) => getDishEffectivePrice(right) - getDishEffectivePrice(left))
    return sorted
  }

  return sorted
}

function buildVisibleHomeDishes(uiState: ShowcaseUiState): ShowcaseHomeDish[] {
  const selectedCategory = normalizeNullableText(uiState.selectedCategory)

  const filtered = uiState.dishes.filter(dish => {
    if (dish.isHidden) return false
    if (selectedCategory && normalizeNullableText(dish.category) !== selectedCategory) return false
    if (uiState.filterRecommendedOnly && !dish.isRecommended) return false
    if (uiState.filterOnSaleOnly && !isDishOnSale(dish)) return false
    if (!matchesSearchQuery(dish, uiState.searchQuery)) return false
    if (!matchesSelectedTags(dish, uiState.selectedTags)) return false
    if (!matchesPriceRange(dish, uiState.homeAppliedMinPrice, uiState.homeAppliedMaxPrice)) return false

    return true
  })

  return sortDishes(filtered, uiState.sortMode).map(buildHomeDish)
}

function buildAllTags(uiState: ShowcaseUiState): string[] {
  return Array.from(
    new Set(
      uiState.dishes
        .flatMap(dish => Array.isArray(dish.tags) ? dish.tags : [])
        .map(tag => tag.trim())
        .filter(Boolean)
    )
  ).sort((left, right) => left.localeCompare(right))
}

function buildHomeCategories(uiState: ShowcaseUiState): string[] {
  const fromDishes = uiState.dishes
    .map(dish => normalizeNullableText(dish.category))
    .filter((item): item is string => Boolean(item))

  return Array.from(new Set([...uiState.manualCategories, ...fromDishes]))
}

function buildBottomBarUiState(uiState: ShowcaseUiState): ShowcaseBottomBarUiState {
  const screen = uiState.screen

  return {
    showAppointments: uiState.appointmentsEnabled,
    showChatDot:
      screen !== 'Chat' &&
      screen !== 'ChatSearchResults' &&
      screen !== 'ChatMedia' &&
      uiState.merchantChatThreads.some(thread => thread.unreadCount > 0),
    showBookingsDot: false,
    showAnnouncementsDot: false
  }
}

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
    statusMessage: uiState.snackbarMessage
  }
}

function readProfileText(source: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = normalizeText(source[key])
    if (value) return value
  }

  return ''
}

function readProfileStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key]
  if (!Array.isArray(value)) return []

  return value.map(item => normalizeText(item)).filter(Boolean)
}

function readExtraContacts(source: Record<string, unknown>): ExtraContact[] {
  const value = source.extraContacts
  if (!Array.isArray(value)) return []

  return value
    .map(item => {
      if (!item || typeof item !== 'object') return null

      const record = item as Record<string, unknown>
      const name = readProfileText(record, ['name'])
      const contactValue = readProfileText(record, ['value'])

      if (!name && !contactValue) return null

      return {
        name,
        value: contactValue
      }
    })
    .filter((item): item is ExtraContact => Boolean(item))
}

function readExtraContactDrafts(source: Record<string, unknown>): ExtraContactDraft[] {
  const value = source.extraContacts
  if (!Array.isArray(value)) return []

  return value
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null

      const record = item as Record<string, unknown>
      const name = readProfileText(record, ['name'])
      const contactValue = readProfileText(record, ['value'])

      if (!name && !contactValue) return null

      return {
        id: readProfileText(record, ['id']) || `extra_${index}`,
        name,
        value: contactValue
      }
    })
    .filter((item): item is ExtraContactDraft => Boolean(item))
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
    isSaving: uiState.isSavingStoreProfile,
    isRefreshing: Boolean(uiState.isRefreshingStoreProfile),
    statusMessage: uiState.statusMessage,
    errorMessage: uiState.storeProfileSaveError,
    successMessage: uiState.storeProfileSaveSuccess ? 'Store profile saved.' : null,
    hasUnsavedChanges: false
  }
}

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
    phone: readProfileText(record, ['phone']),
    address: readProfileText(record, ['address']),
    businessHours: readProfileText(record, ['businessHours', 'hours']),
    websiteUrl: readProfileText(record, ['websiteUrl']),
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
    statusMessage: uiState.statusMessage,
    isNew: true,
    errorMessage: uiState.editValidationError,
    isDiscountInvalidNumber: false,
    isDiscountGEPrice: false,
    discountErrorText: null,
    nameRequiredError: false,
    priceRequiredError: false,
    descriptionRequiredError: false,
    categoryRequiredError: false,
    imagesRequiredError: false,
    showErrorDialog: false,
    canSave: false,
    canAddImageSlot: true,
    maxImages: 9,
    hasUnsavedChanges: false
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
    statusMessage: uiState.statusMessage,
    isNew: false,
    errorMessage: uiState.editValidationError,
    isDiscountInvalidNumber: validation.isDiscountInvalidNumber,
    isDiscountGEPrice: validation.isDiscountGEPrice,
    discountErrorText: validation.discountErrorText,
    nameRequiredError: false,
    priceRequiredError: false,
    descriptionRequiredError: false,
    categoryRequiredError: false,
    imagesRequiredError: false,
    showErrorDialog: Boolean(uiState.editValidationError),
    canSave: validation.canSave,
    canAddImageSlot: imageUrls.length < 9,
    maxImages: 9,
    hasUnsavedChanges: Boolean(dish.dirty)
  }
}

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
    statusMessage: uiState.chat.statusMessage,
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

function normalizeAppointmentProductCard(
  product: ShowcaseAppointmentProductCard | null | undefined
): ShowcaseAppointmentProductCard | null {
  if (!product) return null

  const dishId = normalizeText(product.dishId)
  const title = normalizeText(product.title)

  if (!dishId || !title) return null

  const priceText = normalizeText(product.priceText)

  return {
    dishId,
    title,
    priceText,
    originalPriceText: normalizeNullableText(product.originalPriceText) || priceText,
    discountPriceText: normalizeNullableText(product.discountPriceText),
    imageUrl: normalizeNullableText(product.imageUrl),
    imageVariants: product.imageVariants ?? null,
    categoryText: normalizeNullableText(product.categoryText),
    isRecommended: Boolean(product.isRecommended)
  }
}

function normalizeAppointmentCard(item: ShowcaseAppointmentCard): ShowcaseAppointmentCard {
  const priceText = normalizeNullableText(item.priceText)

  return {
    id: normalizeText(item.id),
    customerName: normalizeText(item.customerName),
    customerContact: normalizeText(item.customerContact),
    serviceTitle: normalizeText(item.serviceTitle),
    preferredDate: normalizeText(item.preferredDate),
    preferredTime: normalizeText(item.preferredTime),
    note: normalizeText(item.note),
    statusLabel: normalizeText(item.statusLabel) || 'Pending',
    cancelledBy: normalizeNullableText(item.cancelledBy),
    cancelledAt: typeof item.cancelledAt === 'number' ? item.cancelledAt : null,
    canCancelByCustomer: Boolean(item.canCancelByCustomer),
    createdAtText: normalizeText(item.createdAtText),
    imageUrl: normalizeNullableText(item.imageUrl),
    sourceDishId: normalizeNullableText(item.sourceDishId),
    priceText,
    originalPriceText: normalizeNullableText(item.originalPriceText) || priceText,
    discountPriceText: normalizeNullableText(item.discountPriceText),
    categoryText: normalizeNullableText(item.categoryText),
    isRecommended: Boolean(item.isRecommended),
    itemAvailable: Boolean(item.itemAvailable)
  }
}

function normalizeAppointmentStatus(value: string): string {
  const text = value.trim()
  return text || 'Pending'
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map(item => item.trim()).filter(Boolean)))
}

const APPOINTMENT_STATUS_FILTER_OPTIONS = [
  'All',
  'Pending',
  'Confirmed',
  'Cancelled',
  'Cancelled by customer',
  'Completed',
  'No-show'
]

function appointmentLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function buildAppointmentDateFilterOptions(items: ShowcaseAppointmentCard[]): string[] {
  return ['All', ...uniqueStrings(items.map(item => item.preferredDate))]
}

function buildAppointmentStatusFilterOptions(): string[] {
  return [...APPOINTMENT_STATUS_FILTER_OPTIONS]
}

function buildAppointmentServiceFilterOptions(items: ShowcaseAppointmentCard[]): string[] {
  return [
    'All',
    ...uniqueStrings(items.map(item => item.serviceTitle?.trim() || 'General appointment'))
  ]
}

function matchesAppointmentFilters(
  item: ShowcaseAppointmentCard,
  dateFilter: string,
  statusFilter: string,
  serviceFilter: string
): boolean {
  const selectedDate = String(dateFilter || '').trim() || 'All'
  const selectedStatus = String(statusFilter || '').trim() || 'All'
  const selectedService = String(serviceFilter || '').trim() || 'All'
  const serviceTitle = item.serviceTitle?.trim() || 'General appointment'

  if (selectedDate !== 'All' && item.preferredDate !== selectedDate) return false

  if (selectedStatus === 'Cancelled by customer') {
    if (normalizeAppointmentStatus(item.statusLabel) !== 'Cancelled' || item.cancelledBy !== 'customer') return false
  } else if (selectedStatus !== 'All' && normalizeAppointmentStatus(item.statusLabel) !== selectedStatus) {
    return false
  }

  if (selectedService !== 'All' && serviceTitle !== selectedService) return false

  return true
}

function matchesCustomerAppointmentDateFilter(
  item: ShowcaseAppointmentCard,
  selectedDateInput: string,
  today: string
): boolean {
  const selectedDate = String(selectedDateInput || '').trim() || 'All'
  const status = normalizeAppointmentStatus(item.statusLabel)

  if (selectedDate === 'History') {
    return item.preferredDate < today ||
      status === 'Completed' ||
      status === 'Cancelled' ||
      status === 'No-show'
  }

  if (selectedDate === 'All') {
    return true
  }

  return item.preferredDate === selectedDate
}

function matchesCustomerAppointmentFilters(
  item: ShowcaseAppointmentCard,
  dateFilter: string,
  statusFilter: string,
  serviceFilter: string,
  today: string
): boolean {
  const selectedStatus = String(statusFilter || '').trim() || 'All'
  const selectedService = String(serviceFilter || '').trim() || 'All'
  const serviceTitle = item.serviceTitle?.trim() || 'General appointment'

  if (!matchesCustomerAppointmentDateFilter(item, dateFilter, today)) return false

  if (selectedStatus === 'Cancelled by customer') {
    if (normalizeAppointmentStatus(item.statusLabel) !== 'Cancelled' || item.cancelledBy !== 'customer') return false
  } else if (selectedStatus !== 'All' && normalizeAppointmentStatus(item.statusLabel) !== selectedStatus) {
    return false
  }

  if (selectedService !== 'All' && serviceTitle !== selectedService) return false

  return true
}

function sortAppointments(items: ShowcaseAppointmentCard[]): ShowcaseAppointmentCard[] {
  return [...items].sort((left, right) => {
    const leftKey = `${left.preferredDate} ${left.preferredTime}`.trim()
    const rightKey = `${right.preferredDate} ${right.preferredTime}`.trim()

    return rightKey.localeCompare(leftKey)
  })
}

function sortCustomerAppointments(
  items: ShowcaseAppointmentCard[],
  selectedDateInput: string
): ShowcaseAppointmentCard[] {
  const selectedDate = String(selectedDateInput || '').trim() || 'All'

  return [...items].sort((left, right) => {
    if (selectedDate === 'History') {
      const dateCompare = right.preferredDate.localeCompare(left.preferredDate)
      if (dateCompare !== 0) return dateCompare

      const timeCompare = right.preferredTime.localeCompare(left.preferredTime)
      if (timeCompare !== 0) return timeCompare

      return right.createdAtText.localeCompare(left.createdAtText)
    }

    const leftPendingRank = normalizeAppointmentStatus(left.statusLabel) === 'Pending' ? 0 : 1
    const rightPendingRank = normalizeAppointmentStatus(right.statusLabel) === 'Pending' ? 0 : 1

    if (leftPendingRank !== rightPendingRank) {
      return leftPendingRank - rightPendingRank
    }

    const dateCompare = left.preferredDate.localeCompare(right.preferredDate)
    if (dateCompare !== 0) return dateCompare

    const timeCompare = left.preferredTime.localeCompare(right.preferredTime)
    if (timeCompare !== 0) return timeCompare

    return right.createdAtText.localeCompare(left.createdAtText)
  })
}

function buildCustomerAppointmentServiceFilterOptions(
  uiState: ShowcaseUiState,
  appointmentCards: ShowcaseAppointmentCard[]
): string[] {
  const selectedDate = String(uiState.appointmentCustomerDateFilter || '').trim() || 'All'
  const selectedStatus = String(uiState.appointmentCustomerStatusFilter || '').trim() || 'All'
  const today = appointmentLocalDateKey(new Date())

  return [
    'All',
    ...uniqueStrings(
      appointmentCards
        .filter(item => matchesCustomerAppointmentDateFilter(item, selectedDate, today))
        .filter(item => {
          return selectedStatus === 'All' ||
            normalizeAppointmentStatus(item.statusLabel) === selectedStatus
        })
        .map(item => item.serviceTitle?.trim() || 'General appointment')
    )
  ]
}

function buildAppointmentDateOptions(uiState: ShowcaseUiState): ShowcaseAppointmentDateOption[] {
  const totalDays = Math.max(1, Math.trunc(Number(uiState.appointmentBookingWindowDays || 7)))
  const closedDays = new Set(uiState.appointmentClosedDays.map(item => item.trim()).filter(Boolean))
  const today = new Date()

  return Array.from({ length: totalDays }).map((_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)

    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const value = `${yyyy}-${mm}-${dd}`
    const weekday = date.toLocaleDateString(undefined, { weekday: 'long' })
    const available = !closedDays.has(weekday)

    return {
      value,
      title: value,
      subtitle: weekday,
      available,
      reason: available ? '' : 'Closed'
    }
  })
}

function buildAppointmentTimeOptions(uiState: ShowcaseUiState): string[] {
  const hoursText = normalizeText(uiState.appointmentAvailableHoursText)
  const match = hoursText.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/)
  const interval = Math.max(5, Math.trunc(Number(uiState.appointmentSlotIntervalMinutes || 30)))

  if (!match) return []

  const startHour = Number(match[1])
  const startMinute = Number(match[2])
  const endHour = Number(match[3])
  const endMinute = Number(match[4])

  if (![startHour, startMinute, endHour, endMinute].every(Number.isFinite)) return []

  const start = startHour * 60 + startMinute
  const end = endHour * 60 + endMinute

  if (end <= start) return []

  const values: string[] = []
  for (let minutes = start; minutes < end; minutes += interval) {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    values.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
  }

  return values
}

function buildBookingRuleSummary(uiState: ShowcaseUiState): string {
  if (!uiState.appointmentsEnabled) {
    return 'Booking unavailable'
  }

  const availableHoursText = normalizeText(uiState.appointmentAvailableHoursText) || '09:00 - 18:00'
  const minimumNotice = normalizeText(uiState.appointmentMinimumNotice)
  const minimumNoticeText = !minimumNotice || minimumNotice.toLowerCase() === 'no notice'
    ? 'Book anytime'
    : `Book ${minimumNotice} ahead`

  return `Open for booking · ${availableHoursText.replace(/\s+-\s+/g, '-')} · ${minimumNoticeText}`
}

export function buildAppointmentsWiringState(uiState: ShowcaseUiState): ShowcaseAppointmentsUiState {
  const product = normalizeAppointmentProductCard(uiState.appointmentProduct)
  const canSubmit = Boolean(
    uiState.appointmentsEnabled &&
    product &&
    uiState.appointmentSourceDishId &&
    uiState.appointmentServiceDraft.trim() &&
    uiState.appointmentNameDraft.trim() &&
    uiState.appointmentContactDraft.trim() &&
    uiState.appointmentDateDraft.trim() &&
    uiState.appointmentTimeDraft.trim() &&
    !uiState.appointmentError
  )

  return {
    enabled: uiState.appointmentsEnabled,
    product,
    serviceDraft: uiState.appointmentServiceDraft,
    nameDraft: uiState.appointmentNameDraft,
    contactDraft: uiState.appointmentContactDraft,
    dateDraft: uiState.appointmentDateDraft,
    timeDraft: uiState.appointmentTimeDraft,
    noteDraft: uiState.appointmentNoteDraft,
    errorMessage: uiState.appointmentError,
    successMessage: uiState.appointmentSuccess,
    canSubmit,
    isSubmitting: false,
    bookingRuleSummary: buildBookingRuleSummary(uiState),
    dateOptions: buildAppointmentDateOptions(uiState),
    timeOptions: buildAppointmentTimeOptions(uiState)
  }
}

export function buildAdminAppointmentsWiringState(uiState: ShowcaseUiState): ShowcaseAdminAppointmentsUiState {
  const items = sortAppointments(
    uiState.appointments
      .map(normalizeAppointmentCard)
      .filter(item => matchesAppointmentFilters(
        item,
        uiState.appointmentAdminDateFilter,
        uiState.appointmentAdminStatusFilter,
        uiState.appointmentAdminServiceFilter
      ))
  )

  return {
    enabled: uiState.appointmentsEnabled,
    items,
    statusMessage: uiState.statusMessage,
    isRefreshing: uiState.appointmentsRefreshing,
    statusSubmittingId: null,
    settingsSubmitting: false,
    bookingWindowDays: uiState.appointmentBookingWindowDays,
    availableHoursText: uiState.appointmentAvailableHoursText,
    slotIntervalMinutes: uiState.appointmentSlotIntervalMinutes,
    closedDays: uiState.appointmentClosedDays,
    minimumNotice: uiState.appointmentMinimumNotice,
dateFilterOptions: buildAppointmentDateFilterOptions(uiState.appointments),
statusFilterOptions: buildAppointmentStatusFilterOptions(),
serviceFilterOptions: buildAppointmentServiceFilterOptions(uiState.appointments),
    selectedDateFilter: uiState.appointmentAdminDateFilter,
    selectedStatusFilter: uiState.appointmentAdminStatusFilter,
    selectedServiceFilter: uiState.appointmentAdminServiceFilter,
    historyDateFilter: uiState.appointmentAdminHistoryDateFilter,

    pagination: DEFAULT_PAGINATION
  }
}

export function buildCustomerBookingsWiringState(uiState: ShowcaseUiState): ShowcaseCustomerBookingsUiState {
  const appointmentCards = uiState.appointments.map(normalizeAppointmentCard)
  const today = appointmentLocalDateKey(new Date())
  const selectedDate = String(uiState.appointmentCustomerDateFilter || '').trim() || 'All'
  const selectedStatus = String(uiState.appointmentCustomerStatusFilter || '').trim() || 'All'
  const selectedService = String(uiState.appointmentCustomerServiceFilter || '').trim() || 'All'

  const items = sortCustomerAppointments(
    appointmentCards.filter(item => {
      return matchesCustomerAppointmentFilters(
        item,
        selectedDate,
        selectedStatus,
        selectedService,
        today
      )
    }),
    selectedDate
  )

  return {
    bottomBar: buildBottomBarUiState(uiState),

    enabled: uiState.appointmentsEnabled,
    items,
    statusMessage: uiState.statusMessage,
    isRefreshing: uiState.appointmentsRefreshing,
    cancellationSubmittingId: null,
    dateFilterOptions: [...buildAppointmentDateFilterOptions(appointmentCards), 'History'],
    statusFilterOptions: buildAppointmentStatusFilterOptions(),
    serviceFilterOptions: buildCustomerAppointmentServiceFilterOptions(uiState, appointmentCards),
    selectedDateFilter: selectedDate,
    selectedStatusFilter: selectedStatus,
    selectedServiceFilter: selectedService,

    pagination: DEFAULT_PAGINATION
  }
}

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

    pagination: DEFAULT_PAGINATION
  }
}

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
    onDateFilterChange: noopString,
    onStatusFilterChange: noopString,
    onServiceFilterChange: noopString,
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

export function createDefaultShowcaseUiWiringActions(
  overrides: Partial<ShowcaseUiWiringActions> = {}
): ShowcaseUiWiringActions {
  return {
    bottomNavigation: createNoopBottomNavigationActions(overrides.bottomNavigation),
    home: createNoopHomeActions(overrides.home),
    login: createNoopLoginActions(overrides.login),
    admin: createNoopAdminActions(overrides.admin),
    detail: createNoopDetailActions(overrides.detail),
    editDish: createNoopEditDishActions(overrides.editDish),
    storeProfile: createNoopStoreProfileActions(overrides.storeProfile),
    favorites: createNoopFavoritesActions(overrides.favorites),
    merchantChatList: createNoopMerchantChatListActions(overrides.merchantChatList),
    chat: createNoopChatActions(overrides.chat),
    chatMedia: createNoopChatMediaActions(overrides.chatMedia),
    appointments: createNoopAppointmentsActions(overrides.appointments),
    adminAppointments: createNoopAdminAppointmentsActions(overrides.adminAppointments),
    customerBookings: createNoopCustomerBookingsActions(overrides.customerBookings),
    announcements: createNoopAnnouncementsActions(overrides.announcements),
    announcementEdit: createNoopAnnouncementEditActions(overrides.announcementEdit)
  }
}

export function createShowcaseUiWiring(input: ShowcaseUiWiringInput = {}): ShowcaseUiWiring {
  const uiState = input.uiState || createDefaultShowcaseUiState()
  const screen = buildScreenWiringState(uiState)
  const home = buildHomeWiringState(uiState)
  const admin = buildAdminWiringState(uiState)
  const detail = buildDetailWiringState(uiState)
  const editDish = buildEditDishWiringState(uiState)
  const favorites = buildFavoritesWiringState(uiState)
  const storeProfile = buildStoreProfileWiringState(uiState)
  const merchantChatList = buildMerchantChatListWiringState(uiState)
  const chat = buildChatWiringState(uiState)
  const chatMedia = buildChatMediaWiringState(uiState)
  const appointments = buildAppointmentsWiringState(uiState)
  const adminAppointments = buildAdminAppointmentsWiringState(uiState)
  const customerBookings = buildCustomerBookingsWiringState(uiState)
  const announcements = buildAnnouncementsWiringState(uiState)
  const announcementEdit = buildAnnouncementEditWiringState(uiState)

  return {
    uiState,
    screen,
    bottomNavigation: screen.bottomNavigation,
    syncCloud: screen.syncCloud,
    home,
    admin,
    detail,
    editDish,
    favorites,
    storeProfile,
    merchantChatList,
    chat,
    chatMedia,
    appointments,
    adminAppointments,
    customerBookings,
    announcements,
    announcementEdit,
    actions: createDefaultShowcaseUiWiringActions(input.actions || {})
  }
}