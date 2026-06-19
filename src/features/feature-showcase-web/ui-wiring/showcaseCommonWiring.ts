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
import type {
  ShowcaseCloudServiceStatus,
  ShowcaseCloudStatus
} from '../showcaseModels'
import {
  ShowcaseRetryOps,
  SyncOverviewStates,
  createDefaultShowcaseUiState
} from '../showcaseUiState'
import { pickDisplayText } from '../showcaseI18n'
import {
  SHOWCASE_APP_VERSION,
  SHOWCASE_OFFICIAL_WEBSITE_URL
} from '../showcaseCloudConfig'
import { buildCloudDaysRemainingLabel } from '../view-model/showcaseViewModelUtils'

export type ShowcaseUiWiringState = ShowcaseUiState

export const DEFAULT_PAGINATION = {
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

export function noop(): void {
  // Intentionally empty. Used as a safe first-round wiring placeholder.
}

export async function noopAsync(): Promise<void> {
  // Intentionally empty. Used as a safe first-round async wiring placeholder.
}

export function noopString(_value: string): void {
  // Intentionally empty.
}

export function noopStringReturnFalse(_value: string): boolean {
  return false
}

export function noopImagePicked(_value: string | File | Blob): void {
}

export function noopImagePickedArray(_value: Array<string | File | Blob>): void {
}

export function noopNullableImagePicked(_value: string | File | Blob | null): void {
}

export function noopNullableString(_value: string | null): void {
  // Intentionally empty.
}

export function noopBoolean(_value: boolean): void {
  // Intentionally empty.
}

export function noopNumber(_value: number): void {
  // Intentionally empty.
}

export function noopAppointmentSettingsSave(_value: ShowcaseAppointmentSettingsSaveInput): void {
  // Intentionally empty.
}

export function noopNumberString(_index: number, _value: string): void {
  // Intentionally empty.
}

export function noopSortMode(_value: ShowcaseHomeSortMode): void {
  // Intentionally empty.
}

export function noopStringString(_left: string, _right: string): void {
  // Intentionally empty.
}

export function noopStringStringReturnFalse(_left: string, _right: string): boolean {
  return false
}

export function noopStringBoolean(_id: string, _value: boolean): void {
  // Intentionally empty.
}

export function noopNumberNumber(_fromIndex: number, _toIndex: number): void {
  // Intentionally empty.
}

export function returnFalse(): boolean {
  return false
}

export function buildEmptyProductClipboardPayload(): string {
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


export function normalizeText(value: unknown): string {
  return String(value ?? '').trim()
}

export function normalizeNullableText(value: unknown): string | null {
  const text = normalizeText(value)
  return text || null
}

export function formatPriceText(value: number | null | undefined): string {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue)) {
    return '$0.00'
  }

  return `$${numberValue.toFixed(2)}`
}

export function getDishTitle(dish: ShowcaseUiState['dishes'][number]): string {
  return pickDisplayText([
    dish.title,
    dish.name
  ], 'Untitled')
}

export function getDishSubtitle(dish: ShowcaseUiState['dishes'][number]): string | null {
  return normalizeNullableText(pickDisplayText([
    dish.description
  ]))
}

export function getDishPrimaryImageUrl(dish: ShowcaseUiState['dishes'][number]): string | null {
  if (dish.imageUri) return dish.imageUri

  if (Array.isArray(dish.imageUrls) && dish.imageUrls.length) {
    return normalizeNullableText(dish.imageUrls[0])
  }

  return null
}

export function getDishEffectivePrice(dish: ShowcaseUiState['dishes'][number]): number {
  const discountPrice = Number(dish.discountPrice)

  if (Number.isFinite(discountPrice) && discountPrice > 0) {
    return discountPrice
  }

  const originalPrice = Number(dish.originalPrice)
  return Number.isFinite(originalPrice) ? originalPrice : 0
}

export function isDishOnSale(dish: ShowcaseUiState['dishes'][number]): boolean {
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

export function buildHomeDish(dish: ShowcaseUiState['dishes'][number]): ShowcaseHomeDish {
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

export function matchesSearchQuery(dish: ShowcaseUiState['dishes'][number], queryInput: string): boolean {
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

export function matchesSelectedTags(dish: ShowcaseUiState['dishes'][number], selectedTags: string[]): boolean {
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

export function matchesPriceRange(
  dish: ShowcaseUiState['dishes'][number],
  minPrice: number | null,
  maxPrice: number | null
): boolean {
  const price = getDishEffectivePrice(dish)

  if (minPrice != null && price < minPrice) return false
  if (maxPrice != null && price > maxPrice) return false

  return true
}

export function sortDishes(
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

export function buildVisibleHomeDishes(uiState: ShowcaseUiState): ShowcaseHomeDish[] {
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

export function buildAllTags(uiState: ShowcaseUiState): string[] {
  return Array.from(
    new Set(
      uiState.dishes
        .flatMap(dish => Array.isArray(dish.tags) ? dish.tags : [])
        .map(tag => tag.trim())
        .filter(Boolean)
    )
  ).sort((left, right) => left.localeCompare(right))
}

export function buildHomeCategories(uiState: ShowcaseUiState): string[] {
  const fromDishes = uiState.dishes
    .map(dish => normalizeNullableText(dish.category))
    .filter((item): item is string => Boolean(item))

  return Array.from(new Set([...uiState.manualCategories, ...fromDishes]))
}

export function buildBottomBarUiState(uiState: ShowcaseUiState): ShowcaseBottomBarUiState {
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


export function readProfileText(source: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = normalizeText(source[key])
    if (value) return value
  }

  return ''
}

export function readProfileStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key]
  if (!Array.isArray(value)) return []

  return value.map(item => normalizeText(item)).filter(Boolean)
}

export function readExtraContacts(source: Record<string, unknown>): ExtraContact[] {
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

export function readExtraContactDrafts(source: Record<string, unknown>): ExtraContactDraft[] {
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

