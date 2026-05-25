import { pickDisplayText } from './showcaseI18n'

export type ShowcaseHomeSortMode = 'Default' | 'PriceAsc' | 'PriceDesc'

export type ShowcaseSortMode = 'Price' | 'Name'

export type SyncState = 'Synced' | 'Pending' | 'Failed'

export type ShowcaseCloudPlanType = 'Trial' | 'Paid' | 'Unknown'

export type ShowcaseCloudServiceStatus = 'Active' | 'ReadOnly' | 'Deleted' | 'Unknown'

export type ShowcaseCloudStatus = {
  storeId: string
  planType: ShowcaseCloudPlanType
  serviceStatus: ShowcaseCloudServiceStatus
  serviceEndAt: string | null
  deleteAt: string | null
  canWrite: boolean
  lastSyncAtMs: number | null
}

export type ExtraContact = {
  name: string
  value: string
}

export type ShowcaseImageVariants = {
  originalUrl: string | null
  largeUrl: string | null
  mediumUrl: string | null
  thumbUrl: string | null
  blurDataUrl: string | null
}

export function createDefaultShowcaseImageVariants(input: Partial<ShowcaseImageVariants> = {}): ShowcaseImageVariants {
  return {
    originalUrl: input.originalUrl ?? null,
    largeUrl: input.largeUrl ?? null,
    mediumUrl: input.mediumUrl ?? null,
    thumbUrl: input.thumbUrl ?? null,
    blurDataUrl: input.blurDataUrl ?? null
  }
}

export type StoreProfile = {
  title: string
  subtitle: string
  description: string
  services: string[]
  address: string
  hours: string
  mapUrl: string
  extraContacts: ExtraContact[]
  coverUrl: string
  logoUrl: string
  coverImageVariants?: ShowcaseImageVariants | null
  logoImageVariants?: ShowcaseImageVariants | null
  businessStatus: string
}

export type Lead = {
  id: string
  name: string
  phone: string
  message: string
  createdAt: number
  sourceDishId: string | null
}

export type ShowcaseAppointmentStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Cancelled'
  | 'Completed'
  | 'NoShow'

export type ShowcaseAppointment = {
  id: string
  clientId: string
  customerName: string
  customerContact: string
  serviceTitle: string
  preferredDate: string
  preferredTime: string
  note: string
  sourceDishId: string | null
  status: ShowcaseAppointmentStatus
  createdAt: number
}

export type ShowcaseFavoriteSnapshot = {
  dishId: string
  title: string
  category: string | null
  originalPriceText: string
  discountPriceText: string | null
  priceText: string
  imageUrl: string | null
  imageVariants?: ShowcaseImageVariants | null
}

export type CachedPublishedAnnouncement = {
  id: string
  coverUrl: string | null
  coverImageVariants?: ShowcaseImageVariants | null
  body: string
  updatedAt: number
  viewCount: number
}

export type CachedAdminAnnouncementEditorDraft = {
  editingId: string | null
  body: string
  coverUrl?: string | null
  updatedAt?: number
}

export type CachedItemEditorDraft = {
  editingId: string | null
  isNew: boolean
  name: string
  price: string
  discountPrice: string
  description: string
  category: string | null
}

export type DemoDish = {
  clickCount: number
  id: string
  name: string
  title?: string | null
  description?: string | null
  category?: string | null
  originalPrice: number
  discountPrice?: number | null
  isRecommended: boolean
  isSoldOut: boolean
  isHidden: boolean
  imageUri?: string | null
  imageUrls: string[]
  imageVariants?: ShowcaseImageVariants | null
  tags: string[]
  externalLink?: string | null
  updatedAt: number
  syncState: SyncState
  dirty?: boolean
  isFavorite?: boolean
}

export const initialDishes: DemoDish[] = []

export function createDefaultShowcaseCloudStatus(input: Partial<ShowcaseCloudStatus> = {}): ShowcaseCloudStatus {
  return {
    storeId: input.storeId || '',
    planType: input.planType || 'Unknown',
    serviceStatus: input.serviceStatus || 'Unknown',
    serviceEndAt: input.serviceEndAt ?? null,
    deleteAt: input.deleteAt ?? null,
    canWrite: input.canWrite ?? true,
    lastSyncAtMs: input.lastSyncAtMs ?? null
  }
}

export function createDefaultStoreProfile(input: Partial<StoreProfile> = {}): StoreProfile {
  return {
    title: input.title || '',
    subtitle: input.subtitle || '',
    description: input.description || '',
    services: Array.isArray(input.services) ? input.services : [],
    address: input.address || '',
    hours: input.hours || '',
    mapUrl: input.mapUrl || '',
    extraContacts: Array.isArray(input.extraContacts) ? input.extraContacts : [],
    coverUrl: input.coverUrl || '',
    logoUrl: input.logoUrl || '',
    coverImageVariants: normalizeShowcaseImageVariants(input.coverImageVariants),
    logoImageVariants: normalizeShowcaseImageVariants(input.logoImageVariants),
    businessStatus: input.businessStatus || ''
  }
}

export function createDefaultLead(input: Partial<Lead> = {}): Lead {
  return {
    id: input.id || '',
    name: input.name || '',
    phone: input.phone || '',
    message: input.message || '',
    createdAt: Number.isFinite(Number(input.createdAt)) ? Number(input.createdAt) : 0,
    sourceDishId: input.sourceDishId ?? null
  }
}

export function createDefaultAppointment(input: Partial<ShowcaseAppointment> = {}): ShowcaseAppointment {
  return {
    id: input.id || '',
    clientId: input.clientId || '',
    customerName: input.customerName || '',
    customerContact: input.customerContact || '',
    serviceTitle: input.serviceTitle || '',
    preferredDate: input.preferredDate || '',
    preferredTime: input.preferredTime || '',
    note: input.note || '',
    sourceDishId: input.sourceDishId ?? null,
    status: input.status || 'Pending',
    createdAt: Number.isFinite(Number(input.createdAt)) ? Number(input.createdAt) : 0
  }
}

export function createDefaultDemoDish(input: Partial<DemoDish> & Pick<DemoDish, 'id'>): DemoDish {
  const rawDiscountPrice = input.discountPrice == null ? null : Number(input.discountPrice)

  return {
    clickCount: Number.isFinite(Number(input.clickCount)) ? Number(input.clickCount) : 0,
    id: input.id,
    name: input.name || '',
    title: input.title ?? null,
    description: input.description || '',
    category: input.category || '',
    originalPrice: Number.isFinite(Number(input.originalPrice)) ? Number(input.originalPrice) : 0,
    discountPrice: rawDiscountPrice != null && Number.isFinite(rawDiscountPrice) ? rawDiscountPrice : null,
    isRecommended: Boolean(input.isRecommended),
    isSoldOut: Boolean(input.isSoldOut),
    isHidden: Boolean(input.isHidden),
    imageUri: input.imageUri ?? null,
    imageUrls: normalizeStringList(input.imageUrls),
    imageVariants: normalizeShowcaseImageVariants(input.imageVariants),
    tags: normalizeStringList(input.tags),
    externalLink: input.externalLink ?? null,
    updatedAt: Number.isFinite(Number(input.updatedAt)) ? Number(input.updatedAt) : 0,
    syncState: input.syncState || 'Synced',
    dirty: Boolean(input.dirty),
    isFavorite: Boolean(input.isFavorite)
  }
}

export function normalizeStringList(items: unknown): string[] {
  if (!Array.isArray(items)) return []

  return Array.from(
    new Set(
      items
        .map(item => String(item || '').trim())
        .filter(Boolean)
    )
  )
}

export function normalizeShowcaseImageVariants(input: unknown): ShowcaseImageVariants | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null

  const record = input as Record<string, unknown>
  const variants = createDefaultShowcaseImageVariants({
    originalUrl: normalizeStorageNullableString(record.originalUrl) ?? normalizeStorageNullableString(record.original_url),
    largeUrl: normalizeStorageNullableString(record.largeUrl) ?? normalizeStorageNullableString(record.large_url),
    mediumUrl: normalizeStorageNullableString(record.mediumUrl) ?? normalizeStorageNullableString(record.medium_url),
    thumbUrl: normalizeStorageNullableString(record.thumbUrl) ?? normalizeStorageNullableString(record.thumb_url),
    blurDataUrl: normalizeStorageNullableString(record.blurDataUrl) ?? normalizeStorageNullableString(record.blur_data_url)
  })

  if (
    !variants.originalUrl &&
    !variants.largeUrl &&
    !variants.mediumUrl &&
    !variants.thumbUrl &&
    !variants.blurDataUrl
  ) {
    return null
  }

  return variants
}

export function getDishTitle(dish: DemoDish): string {
  return pickDisplayText([
    dish.title,
    dish.name
  ])
}

export function getDishPrice(dish: DemoDish): number {
  const discountPrice = Number(dish.discountPrice)
  if (Number.isFinite(discountPrice) && discountPrice > 0) return discountPrice

  const originalPrice = Number(dish.originalPrice)
  if (Number.isFinite(originalPrice) && originalPrice > 0) return originalPrice

  return 0
}

export function deriveCategories(
  dishes: DemoDish[],
  manualCategories: string[] = []
): string[] {
  const fromDishes = new Set(
    dishes
      .map(item => String(item.category || '').trim())
      .filter(Boolean)
  )

  const extra = manualCategories
    .map(item => String(item || '').trim())
    .filter(item => item && !fromDishes.has(item))

  return Array.from(new Set([...fromDishes, ...extra])).sort()
}

export function deriveAllTags(dishes: DemoDish[]): string[] {
  return Array.from(
    new Set(
      dishes
        .flatMap(item => item.tags || [])
        .map(item => String(item || '').trim())
        .filter(Boolean)
    )
  ).sort()
}

export function encodeExtraContactsJson(items: ExtraContact[]): string {
  try {
    const normalized = items
      .map(item => ({
        name: String(item.name || '').trim(),
        value: String(item.value || '').trim()
      }))
      .filter(item => item.name && item.value)

    return JSON.stringify(normalized)
  } catch {
    return '[]'
  }
}

export function decodeExtraContactsJson(json: string): ExtraContact[] {
  try {
    const parsed: unknown = JSON.parse(String(json || '').trim() || '[]')
    if (!Array.isArray(parsed)) return []

    return parsed
      .map(item => {
        const record = item && typeof item === 'object'
          ? item as Record<string, unknown>
          : {}

        return {
          name: String(record.name || '').trim(),
          value: String(record.value || '').trim()
        }
      })
      .filter(item => item.name && item.value)
  } catch {
    return []
  }
}

const SHOWCASE_STORAGE_PREFIX = 'ndjc_showcase_models'
const SHOWCASE_DISHES_STORAGE_KEY = `${SHOWCASE_STORAGE_PREFIX}_dishes`
const SHOWCASE_STORE_PROFILE_STORAGE_KEY = `${SHOWCASE_STORAGE_PREFIX}_store_profile`
const SHOWCASE_MANUAL_CATEGORIES_STORAGE_KEY = `${SHOWCASE_STORAGE_PREFIX}_manual_categories`
const SHOWCASE_PUBLISHED_ANNOUNCEMENTS_STORAGE_KEY = `${SHOWCASE_STORAGE_PREFIX}_published_announcements`
const SHOWCASE_VIEWED_ANNOUNCEMENT_IDS_STORAGE_KEY = `${SHOWCASE_STORAGE_PREFIX}_viewed_announcement_ids`
const SHOWCASE_COUNTED_ANNOUNCEMENT_CLICK_IDS_STORAGE_KEY = `${SHOWCASE_STORAGE_PREFIX}_counted_announcement_click_ids`
const SHOWCASE_FAVORITE_IDS_STORAGE_KEY = `${SHOWCASE_STORAGE_PREFIX}_favorite_ids`
const SHOWCASE_FAVORITE_ADDED_AT_STORAGE_KEY = `${SHOWCASE_STORAGE_PREFIX}_favorite_added_at`
const SHOWCASE_FAVORITE_SNAPSHOTS_STORAGE_KEY = `${SHOWCASE_STORAGE_PREFIX}_favorite_snapshots`
const SHOWCASE_ADMIN_ANNOUNCEMENT_EDITOR_DRAFT_STORAGE_KEY = `${SHOWCASE_STORAGE_PREFIX}_admin_announcement_editor_draft`
const SHOWCASE_ITEM_EDITOR_DRAFT_STORAGE_KEY = `${SHOWCASE_STORAGE_PREFIX}_item_editor_draft`
const SHOWCASE_APPOINTMENTS_ENABLED_STORAGE_KEY = `${SHOWCASE_STORAGE_PREFIX}_appointments_enabled`
const SHOWCASE_APPOINTMENTS_STORAGE_KEY = `${SHOWCASE_STORAGE_PREFIX}_appointments`

type StoreScopedStorageRecord<T> = {
  storeId: string
  value: T
  updatedAt?: number
}

function canUseLocalStorage(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

function normalizeStorageStoreId(storeId: string | null | undefined): string {
  const value = String(storeId || '').trim()

  if (!value) {
    throw new Error('storeId is required for store-scoped local storage.')
  }

  return value
}

function readStorageJson<T>(key: string, fallback: T): T {
  if (!canUseLocalStorage()) return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeStorageJson<T>(key: string, value: T): void {
  if (!canUseLocalStorage()) return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage persistence is best effort
  }
}

function removeStorageValue(key: string): void {
  if (!canUseLocalStorage()) return

  try {
    window.localStorage.removeItem(key)
  } catch {
    // localStorage persistence is best effort
  }
}

function readStoreScopedValue<T>(key: string, storeId: string, fallback: T): T {
  const normalizedStoreId = normalizeStorageStoreId(storeId)
  const all = readStorageJson<StoreScopedStorageRecord<T>[]>(key, [])
  return all.find(item => item.storeId === normalizedStoreId)?.value ?? fallback
}

function writeStoreScopedValue<T>(key: string, storeId: string, value: T): void {
  const normalizedStoreId = normalizeStorageStoreId(storeId)
  const all = readStorageJson<StoreScopedStorageRecord<T>[]>(key, [])

  writeStorageJson(key, [
    ...all.filter(item => item.storeId !== normalizedStoreId),
    {
      storeId: normalizedStoreId,
      value,
      updatedAt: Date.now()
    }
  ])
}

function removeStoreScopedValue(key: string, storeId: string): void {
  const normalizedStoreId = normalizeStorageStoreId(storeId)
  const all = readStorageJson<StoreScopedStorageRecord<unknown>[]>(key, [])
  writeStorageJson(key, all.filter(item => item.storeId !== normalizedStoreId))
}

function normalizeStorageNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : fallback
}

function normalizeStorageNullableString(value: unknown): string | null {
  const text = String(value ?? '').trim()
  return text && text !== 'null' ? text : null
}

function normalizeStorageBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const text = value.trim().toLowerCase()
    if (text === 'true' || text === '1' || text === 'yes') return true
    if (text === 'false' || text === '0' || text === 'no') return false
  }
  return fallback
}

export function loadDishesFromStorage(storeId: string): DemoDish[] {
  const raw = readStoreScopedValue<unknown[]>(SHOWCASE_DISHES_STORAGE_KEY, storeId, [])

  if (!Array.isArray(raw)) return []

  return raw
    .map(item => {
      const record = item && typeof item === 'object'
        ? item as Record<string, unknown>
        : {}

      const id = String(record.id || '').trim()
      if (!id) return null

      const imageUrls = normalizeStringList(record.imageUrls)
      const imageVariants = normalizeShowcaseImageVariants(record.imageVariants)
      const legacyImageUri = normalizeStorageNullableString(record.imageUri)
      const name = pickDisplayText([
        record.name,
        record.title
      ])

      return createDefaultDemoDish({
        id,
        clickCount: normalizeStorageNumber(record.clickCount, 0),
        name,
        title: normalizeStorageNullableString(record.title),
        description: pickDisplayText([
          record.description
        ]),
        category: String(record.category || '').trim(),
        originalPrice: normalizeStorageNumber(record.originalPrice, 0),
        discountPrice: record.discountPrice == null ? null : normalizeStorageNumber(record.discountPrice, 0),
        isRecommended: normalizeStorageBoolean(record.isRecommended, false),
        isSoldOut: normalizeStorageBoolean(record.isSoldOut, false),
        isHidden: normalizeStorageBoolean(record.isHidden, false),
        imageUri: legacyImageUri,
        imageUrls: imageUrls.length ? imageUrls : legacyImageUri ? [legacyImageUri] : [],
        imageVariants,
        tags: normalizeStringList(record.tags),
        externalLink: normalizeStorageNullableString(record.externalLink),
        updatedAt: normalizeStorageNumber(record.updatedAt, 0),
        syncState: record.syncState === 'Pending' || record.syncState === 'Failed' ? record.syncState : 'Synced',
        dirty: normalizeStorageBoolean(record.dirty, false)
      })
    })
    .filter((item): item is DemoDish => Boolean(item))
}

export function saveDishesToStorage(storeId: string, dishes: DemoDish[]): void {
  const normalized = dishes.map(dish => {
    const imageUrls = normalizeStringList(dish.imageUrls).slice(0, 9)
    const imageUri = imageUrls[0] || normalizeStorageNullableString(dish.imageUri)

    return {
      clickCount: normalizeStorageNumber(dish.clickCount, 0),
      id: String(dish.id || '').trim(),
      name: String(dish.name || '').trim(),
      title: dish.title ?? null,
      description: String(dish.description || '').trim(),
      category: String(dish.category || '').trim(),
      originalPrice: normalizeStorageNumber(dish.originalPrice, 0),
      discountPrice: dish.discountPrice == null ? null : normalizeStorageNumber(dish.discountPrice, 0),
      isRecommended: Boolean(dish.isRecommended),
      isSoldOut: Boolean(dish.isSoldOut),
      isHidden: Boolean(dish.isHidden),
      imageUri,
      imageUrls,
      imageVariants: normalizeShowcaseImageVariants(dish.imageVariants),
      tags: normalizeStringList(dish.tags),
      externalLink: dish.externalLink ?? null,
      updatedAt: normalizeStorageNumber(dish.updatedAt, 0),
      syncState: dish.syncState || 'Synced',
      dirty: Boolean(dish.dirty)
    }
  }).filter(item => item.id)

  writeStoreScopedValue(SHOWCASE_DISHES_STORAGE_KEY, storeId, normalized)
}

export function loadStoreProfileFromStorage(storeId: string): StoreProfile | null {
  const raw = readStoreScopedValue<Record<string, unknown> | null>(SHOWCASE_STORE_PROFILE_STORAGE_KEY, storeId, null)
  if (!raw || typeof raw !== 'object') return null

  return createDefaultStoreProfile({
    title: String(raw.title || '').trim(),
    subtitle: String(raw.subtitle || '').trim(),
    description: String(raw.description || '').trim(),
    services: normalizeStringList(raw.services),
    address: String(raw.address || '').trim(),
    hours: String(raw.hours || '').trim(),
    mapUrl: String(raw.mapUrl || '').trim(),
    extraContacts: decodeExtraContactsJson(String(raw.extraContactsJson || '[]')),
    coverUrl: String(raw.coverUrl || '').trim(),
    logoUrl: String(raw.logoUrl || '').trim(),
    coverImageVariants: normalizeShowcaseImageVariants(raw.coverImageVariants),
    logoImageVariants: normalizeShowcaseImageVariants(raw.logoImageVariants),
    businessStatus: String(raw.businessStatus || '').trim()
  })
}

export function saveStoreProfileToStorage(storeId: string, profile: StoreProfile): void {
  writeStoreScopedValue(SHOWCASE_STORE_PROFILE_STORAGE_KEY, storeId, {
    title: profile.title,
    subtitle: profile.subtitle,
    description: profile.description,
    services: normalizeStringList(profile.services),
    address: profile.address,
    hours: profile.hours,
    mapUrl: profile.mapUrl,
    extraContactsJson: encodeExtraContactsJson(profile.extraContacts),
    coverUrl: profile.coverUrl,
    logoUrl: profile.logoUrl,
    coverImageVariants: normalizeShowcaseImageVariants(profile.coverImageVariants),
    logoImageVariants: normalizeShowcaseImageVariants(profile.logoImageVariants),
    businessStatus: profile.businessStatus
  })
}

export function loadManualCategoriesFromStorage(storeId: string): string[] {
  return normalizeStringList(readStoreScopedValue<string[]>(SHOWCASE_MANUAL_CATEGORIES_STORAGE_KEY, storeId, []))
}

export function saveManualCategoriesToStorage(storeId: string, categories: string[]): void {
  writeStoreScopedValue(SHOWCASE_MANUAL_CATEGORIES_STORAGE_KEY, storeId, normalizeStringList(categories))
}

export function loadPublishedAnnouncementsFromStorage(storeId: string): CachedPublishedAnnouncement[] {
  const raw = readStoreScopedValue<unknown[]>(SHOWCASE_PUBLISHED_ANNOUNCEMENTS_STORAGE_KEY, storeId, [])
  if (!Array.isArray(raw)) return []

return raw
  .map((item): CachedPublishedAnnouncement | null => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return null

    const record = item as Record<string, unknown>
    const id = String(record.id || '').trim()
    const body = String(record.body || '').trim()
    if (!id || !body) return null

    return {
      id,
      coverUrl: normalizeStorageNullableString(record.coverUrl),
      coverImageVariants: normalizeShowcaseImageVariants(record.coverImageVariants) ?? null,
      body,
      updatedAt: normalizeStorageNumber(record.updatedAt, 0),
      viewCount: normalizeStorageNumber(record.viewCount, 0)
    }
  })
  .filter((item): item is CachedPublishedAnnouncement => item !== null)
}

export function savePublishedAnnouncementsToStorage(storeId: string, items: CachedPublishedAnnouncement[]): void {
  const now = Date.now()
  const maxAgeMs = 30 * 24 * 60 * 60 * 1000
  const maxItems = 100

  const normalized = items
    .map(item => ({
      id: String(item.id || '').trim(),
      coverUrl: item.coverUrl ?? null,
      coverImageVariants: normalizeShowcaseImageVariants(item.coverImageVariants),
      body: String(item.body || '').trim(),
      updatedAt: normalizeStorageNumber(item.updatedAt, 0),
      viewCount: normalizeStorageNumber(item.viewCount, 0)
    }))
    .filter(item => {
      if (!item.id || !item.body) return false
      if (item.updatedAt <= 0) return true
      return now - item.updatedAt <= maxAgeMs
    })
    .sort((left, right) => right.updatedAt - left.updatedAt)
    .slice(0, maxItems)

  writeStoreScopedValue(SHOWCASE_PUBLISHED_ANNOUNCEMENTS_STORAGE_KEY, storeId, normalized)
}

export function loadViewedAnnouncementIdsFromStorage(storeId: string): string[] {
  return normalizeStringList(readStoreScopedValue<string[]>(SHOWCASE_VIEWED_ANNOUNCEMENT_IDS_STORAGE_KEY, storeId, []))
}

export function saveViewedAnnouncementIdsToStorage(storeId: string, ids: string[]): void {
  writeStoreScopedValue(SHOWCASE_VIEWED_ANNOUNCEMENT_IDS_STORAGE_KEY, storeId, normalizeStringList(ids).sort())
}

export function loadCountedAnnouncementClickIdsFromStorage(storeId: string): string[] {
  return normalizeStringList(readStoreScopedValue<string[]>(SHOWCASE_COUNTED_ANNOUNCEMENT_CLICK_IDS_STORAGE_KEY, storeId, []))
}

export function saveCountedAnnouncementClickIdsToStorage(storeId: string, ids: string[]): void {
  writeStoreScopedValue(SHOWCASE_COUNTED_ANNOUNCEMENT_CLICK_IDS_STORAGE_KEY, storeId, normalizeStringList(ids).sort())
}

export function loadFavoriteIdsFromStorage(storeId: string): string[] {
  return normalizeStringList(readStoreScopedValue<string[]>(SHOWCASE_FAVORITE_IDS_STORAGE_KEY, storeId, []))
}

export function saveFavoriteIdsToStorage(storeId: string, ids: string[]): void {
  writeStoreScopedValue(SHOWCASE_FAVORITE_IDS_STORAGE_KEY, storeId, normalizeStringList(ids).sort())
}

export function loadFavoriteAddedAtFromStorage(storeId: string): Record<string, number> {
  const raw = readStoreScopedValue<Record<string, unknown>>(SHOWCASE_FAVORITE_ADDED_AT_STORAGE_KEY, storeId, {})
  const result: Record<string, number> = {}

  Object.entries(raw || {}).forEach(([key, value]) => {
    const id = key.trim()
    if (!id) return

    const timestamp = normalizeStorageNumber(value, 0)
    if (timestamp > 0) {
      result[id] = timestamp
    }
  })

  return result
}

export function saveFavoriteAddedAtToStorage(storeId: string, value: Record<string, number>): void {
  const normalized: Record<string, number> = {}

  Object.entries(value || {}).forEach(([key, itemValue]) => {
    const id = key.trim()
    const timestamp = normalizeStorageNumber(itemValue, 0)

    if (id && timestamp > 0) {
      normalized[id] = timestamp
    }
  })

  writeStoreScopedValue(SHOWCASE_FAVORITE_ADDED_AT_STORAGE_KEY, storeId, normalized)
}

export function loadFavoriteSnapshotsFromStorage(storeId: string): Record<string, ShowcaseFavoriteSnapshot> {
  const raw = readStoreScopedValue<Record<string, unknown>>(SHOWCASE_FAVORITE_SNAPSHOTS_STORAGE_KEY, storeId, {})
  const result: Record<string, ShowcaseFavoriteSnapshot> = {}

  Object.entries(raw || {}).forEach(([key, value]) => {
    const id = key.trim()
    if (!id || !value || typeof value !== 'object') return

    const record = value as Record<string, unknown>
    const title = String(record.title || '').trim()
    if (!title) return

    result[id] = {
      dishId: id,
      title,
      category: normalizeStorageNullableString(record.category),
      originalPriceText: String(record.originalPriceText || '').trim(),
      discountPriceText: normalizeStorageNullableString(record.discountPriceText),
      priceText: String(record.priceText || '').trim(),
      imageUrl: normalizeStorageNullableString(record.imageUrl),
      imageVariants: normalizeShowcaseImageVariants(record.imageVariants)
    }
  })

  return result
}

export function saveFavoriteSnapshotsToStorage(
  storeId: string,
  value: Record<string, ShowcaseFavoriteSnapshot>
): void {
  const normalized: Record<string, ShowcaseFavoriteSnapshot> = {}

  Object.entries(value || {})
    .slice(-300)
    .forEach(([key, snapshot]) => {
      const id = key.trim()
      if (!id) return

      normalized[id] = {
        dishId: id,
        title: snapshot.title,
        category: snapshot.category ?? null,
        originalPriceText: snapshot.originalPriceText,
        discountPriceText: snapshot.discountPriceText ?? null,
        priceText: snapshot.priceText,
        imageUrl: snapshot.imageUrl ?? null,
        imageVariants: normalizeShowcaseImageVariants(snapshot.imageVariants)
      }
    })

  writeStoreScopedValue(SHOWCASE_FAVORITE_SNAPSHOTS_STORAGE_KEY, storeId, normalized)
}

export function loadAdminAnnouncementEditorDraftFromStorage(storeId: string): CachedAdminAnnouncementEditorDraft | null {
  const raw = readStoreScopedValue<Record<string, unknown> | null>(SHOWCASE_ADMIN_ANNOUNCEMENT_EDITOR_DRAFT_STORAGE_KEY, storeId, null)
  if (!raw || typeof raw !== 'object') return null

  const editingId = normalizeStorageNullableString(raw.editingId)
  const body = String(raw.body || '').trim()

  if (!editingId && !body) return null

  return {
    editingId,
    body
  }
}

export function saveAdminAnnouncementEditorDraftToStorage(
  storeId: string,
  draft: CachedAdminAnnouncementEditorDraft
): void {
  writeStoreScopedValue(SHOWCASE_ADMIN_ANNOUNCEMENT_EDITOR_DRAFT_STORAGE_KEY, storeId, {
    editingId: draft.editingId ?? null,
    body: draft.body
  })
}

export function clearAdminAnnouncementEditorDraftFromStorage(storeId: string): void {
  removeStoreScopedValue(SHOWCASE_ADMIN_ANNOUNCEMENT_EDITOR_DRAFT_STORAGE_KEY, storeId)
}

export function loadItemEditorDraftFromStorage(storeId: string): CachedItemEditorDraft | null {
  const raw = readStoreScopedValue<Record<string, unknown> | null>(SHOWCASE_ITEM_EDITOR_DRAFT_STORAGE_KEY, storeId, null)
  if (!raw || typeof raw !== 'object') return null

  const editingId = normalizeStorageNullableString(raw.editingId)
  const isNew = normalizeStorageBoolean(raw.isNew, false)
  const name = String(raw.name || '').trim()
  const price = String(raw.price || '').trim()
  const discountPrice = String(raw.discountPrice || '').trim()
  const description = String(raw.description || '').trim()
  const category = normalizeStorageNullableString(raw.category)

  if (
    !editingId &&
    !name &&
    !price &&
    !discountPrice &&
    !description &&
    !category
  ) {
    return null
  }

  return {
    editingId,
    isNew,
    name,
    price,
    discountPrice,
    description,
    category
  }
}

export function saveItemEditorDraftToStorage(
  storeId: string,
  draft: CachedItemEditorDraft
): void {
  writeStoreScopedValue(SHOWCASE_ITEM_EDITOR_DRAFT_STORAGE_KEY, storeId, {
    editingId: draft.editingId ?? null,
    isNew: Boolean(draft.isNew),
    name: draft.name,
    price: draft.price,
    discountPrice: draft.discountPrice,
    description: draft.description,
    category: draft.category ?? null
  })
}

export function clearItemEditorDraftFromStorage(storeId: string): void {
  removeStoreScopedValue(SHOWCASE_ITEM_EDITOR_DRAFT_STORAGE_KEY, storeId)
}

export function loadAppointmentsEnabledFromStorage(storeId: string): boolean {
  return Boolean(readStoreScopedValue<boolean>(SHOWCASE_APPOINTMENTS_ENABLED_STORAGE_KEY, storeId, false))
}

export function saveAppointmentsEnabledToStorage(storeId: string, enabled: boolean): void {
  writeStoreScopedValue(SHOWCASE_APPOINTMENTS_ENABLED_STORAGE_KEY, storeId, Boolean(enabled))
}

export function loadAppointmentsFromStorage(storeId: string): ShowcaseAppointment[] {
  const raw = readStoreScopedValue<unknown[]>(SHOWCASE_APPOINTMENTS_STORAGE_KEY, storeId, [])
  if (!Array.isArray(raw)) return []

  return raw
    .map(item => {
      const record = item && typeof item === 'object'
        ? item as Record<string, unknown>
        : {}

      const id = String(record.id || '').trim()
      if (!id) return null

      return createDefaultAppointment({
        id,
        clientId: String(record.clientId || '').trim(),
        customerName: String(record.customerName || '').trim(),
        customerContact: String(record.customerContact || '').trim(),
        serviceTitle: String(record.serviceTitle || '').trim(),
        preferredDate: String(record.preferredDate || '').trim(),
        preferredTime: String(record.preferredTime || '').trim(),
        note: String(record.note || '').trim(),
        sourceDishId: normalizeStorageNullableString(record.sourceDishId),
        status: record.status === 'Confirmed' ||
          record.status === 'Cancelled' ||
          record.status === 'Completed' ||
          record.status === 'NoShow'
          ? record.status
          : 'Pending',
        createdAt: normalizeStorageNumber(record.createdAt, 0)
      })
    })
    .filter((item): item is ShowcaseAppointment => Boolean(item))
}

export function saveAppointmentsToStorage(storeId: string, items: ShowcaseAppointment[]): void {
  const normalized = items
    .map(item => createDefaultAppointment(item))
    .filter(item => item.id)

  writeStoreScopedValue(SHOWCASE_APPOINTMENTS_STORAGE_KEY, storeId, normalized)
}