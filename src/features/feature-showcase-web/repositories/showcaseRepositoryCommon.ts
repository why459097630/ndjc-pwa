import type { DemoDish, ShowcaseImageVariants } from '../showcaseModels'
import {
  SHOWCASE_BUCKETS,
  SHOWCASE_EDGE_FUNCTIONS,
  SHOWCASE_PAGE_SIZE,
  SHOWCASE_TABLES,
  resolveShowcaseSupabaseAnonKey,
  resolveShowcaseSupabaseUrl
} from '../showcaseCloudConfig'
import { StoreScopedCloudClient } from '../showcaseStoreScopedCloudClient'
import {
  getFreshShowcaseAccessToken,
  refreshShowcaseAuthSession,
  requireFreshShowcaseAccessToken,
  signInShowcaseAuthWithPassword,
  signOutShowcaseAuth
} from '../showcaseAuthSessionManager'
import {
  buildI18nValue,
  jsonRecord,
  pickI18nText
} from '../showcaseI18n'

export type { DemoDish, ShowcaseImageVariants } from '../showcaseModels'
export {
  SHOWCASE_BUCKETS,
  SHOWCASE_EDGE_FUNCTIONS,
  SHOWCASE_PAGE_SIZE,
  SHOWCASE_TABLES,
  resolveShowcaseSupabaseAnonKey,
  resolveShowcaseSupabaseUrl
} from '../showcaseCloudConfig'
export { StoreScopedCloudClient } from '../showcaseStoreScopedCloudClient'
export {
  getFreshShowcaseAccessToken,
  refreshShowcaseAuthSession,
  requireFreshShowcaseAccessToken,
  signInShowcaseAuthWithPassword,
  signOutShowcaseAuth
} from '../showcaseAuthSessionManager'
export {
  buildI18nValue,
  jsonRecord,
  pickI18nText
} from '../showcaseI18n'


export type ShowcaseRepositoryHttpResult = {
  code: number
  body: string | null
  headers: Headers
}

export type ShowcaseRepositoryJson =
  | null
  | boolean
  | number
  | string
  | ShowcaseRepositoryJson[]
  | { [key: string]: ShowcaseRepositoryJson }

export type ShowcaseRepositoryRequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'
  body?: ShowcaseRepositoryJson | string | Blob | ArrayBuffer | Uint8Array | null
  prefer?: string | null
  contentType?: string | null
  authorization?: string | null
  signal?: AbortSignal | null
  extraHeaders?: Record<string, string | null | undefined>
  scopeStoreId?: string | null
  scopeClientId?: string | null
}

export type CloudCategory = {
  id: string
  name: string
  sortOrder: number | null
}

export type CloudDish = {
  id: string | null
  name: string
  description: string | null
  categoryId: string | null
  categoryName: string | null
  price: number
  discountPrice: number | null
  recommended: boolean
  soldOut: boolean
  hidden: boolean
  imageUrl: string | null
  imageUrls: string[]
  imageVariants?: ShowcaseImageVariants | null
  tags: string[]
  externalLink: string | null
  createdAt: number | null
  updatedAt: number | null
  clickCount: number
}

export type CloudDishFilterRow = {
  categoryName: string | null
  tags: string[]
}

export type CloudStoreProfile = {
  storeId: string
  title: string
  subtitle: string
  description: string
  address: string
  hours: string
  mapUrl: string
  extraContactsJson: string
  servicesJson: string
  coverUrl: string
  logoUrl: string
  coverImageVariants?: ShowcaseImageVariants | null
  logoImageVariants?: ShowcaseImageVariants | null
  businessStatus: string
  updatedAt: number | null
}

export type CloudStorePwaProfile = {
  storeId: string
  appName: string
  merchantEmail: string
  shortName: string
  description: string
  notificationIconUrl: string
  icon192Url: string
  icon512Url: string
  maskable192Url: string
  maskable512Url: string
  appleTouchIconUrl: string
  themeColor: string
  backgroundColor: string
  updatedAt: number | null
}

export type CloudAnnouncement = {
  id: string
  storeId: string
  coverUrl: string | null
  coverImageVariants?: ShowcaseImageVariants | null
  body: string
  status: string
  updatedAt: number | null
  createdAt: number | null
  viewCount: number
}

export type CloudAppointmentSettings = {
  storeId: string
  enabled: boolean
  bookingWindowDays: number
  availableStartTime: string
  availableEndTime: string
  slotIntervalMinutes: number
  closedDays: string[]
  minimumNotice: string
  updatedAt: number | null
}

export type CloudAppointmentRequest = {
  id: string
  storeId: string
  clientId: string
  customerName: string
  customerContact: string
  serviceTitle: string
  preferredDate: string
  preferredTime: string
  note: string
  sourceDishId: string | null
  sourcePriceSnapshot: string | null
  sourceImageUrlSnapshot: string | null
  sourceCategorySnapshot: string | null
  sourceRecommendedSnapshot: boolean
  status: string
  cancelledBy: string | null
  cancelledAt: number | null
  createdAt: number | null
}

export type CloudAppointmentFilterRow = {
  preferredDate: string
  serviceTitle: string
  status: string
  cancelledBy: string | null
}

export type MerchantAuthSession = {
  accessToken: string
  refreshToken: string | null
  authUserId: string
  loginName: string
  expiresAt: number
  storeId?: string | null
}

export type MerchantStoreMembership = {
  storeId: string
  authUserId: string
  loginName: string | null
}

export type MerchantBinding = MerchantStoreMembership

export type CloudStoreServiceStatus = {
  storeId: string
  planType: string
  serviceStatus: string
  serviceEndAt: string | null
  deleteAt: string | null
  isWriteAllowed: boolean
}

export type CategoryWriteResult = {
  ok: boolean
  errorMessage: string | null
  errorCode: number
  errorBody: string | null
}

export type PushDeviceAudience =
  | 'announcement_subscriber'
  | 'chat_client'
  | 'chat_merchant'
  | 'appointment_client'
  | 'appointment_merchant'

export type PushDeviceUpsert = {
  storeId: string
  audience: PushDeviceAudience | string
  token: string
  conversationId?: string | null
  clientId?: string | null
  merchantId?: string | null
  platform?: string
  appVersion?: string | null
  appOrigin?: string | null
  appEnvironment?: string | null
  deviceInstallId?: string | null
}

export type PushDeviceUnregister = {
  storeId: string
  audience: PushDeviceAudience | string
  token?: string | null
  conversationId?: string | null
  clientId?: string | null
  merchantId?: string | null
  deviceInstallId?: string | null
}

export type PushRequestActor = 'public' | 'merchant'

export function normalizePushAudience(value: string | null | undefined): string {
  const audience = String(value || '').trim().toLowerCase()

  if (audience === 'merchant') return 'chat_merchant'
  if (audience === 'customer') return 'announcement_subscriber'
  if (audience === 'client') return 'chat_client'
  if (audience === 'appointment') return 'appointment_client'
  if (audience === 'booking') return 'appointment_client'
  if (audience === 'booking_client') return 'appointment_client'
  if (audience === 'appointment_customer') return 'appointment_client'
  if (audience === 'appointment_merchant') return 'appointment_merchant'
  if (audience === 'booking_merchant') return 'appointment_merchant'

  if (audience === 'chat_merchant') return 'chat_merchant'
  if (audience === 'chat_client') return 'chat_client'
  if (audience === 'announcement_subscriber') return 'announcement_subscriber'
  if (audience === 'appointment_client') return 'appointment_client'
  if (audience === 'appointment_merchant') return 'appointment_merchant'

  return audience
}

export function isSupportedPushAudience(value: string): value is PushDeviceAudience {
  return (
    value === 'announcement_subscriber' ||
    value === 'chat_client' ||
    value === 'chat_merchant' ||
    value === 'appointment_client' ||
    value === 'appointment_merchant'
  )
}

export function normalizePushActor(value: string | null | undefined): PushRequestActor {
  const actor = String(value || '').trim().toLowerCase()
  return actor === 'merchant' ? 'merchant' : 'public'
}

export type ChatConversation = {
  id: string
  storeId: string
  clientId: string | null
  merchantAuthUserId: string | null
  customerName: string | null
  customerContact: string | null
  customerSeq: number | null
  createdAt: number | null
  updatedAt: number | null
}

export type ChatMessage = {
  id: string
  storeId: string
  conversationId: string
  senderRole: string
  senderId: string | null
  body: string
  imageUrls: string[]
  productDishId: string | null
  quotedMessageId: string | null
  createdAt: number | null
  readAt: number | null
  localStatus?: 'sending' | 'sent' | 'failed' | string | null
}

export type ChatThreadSummary = {
  conversationId: string
  storeId: string
  clientId: string | null
  title: string
  lastMessage: string
  lastMessageAt: number | null
  unreadCount: number
  pinned: boolean
  customerSeq: number | null
}

export type UploadBytesInput = {
  storeId: string
  clientId?: string | null
  pathPrefix: string
  fileName: string
  contentType: string
  bytes: Blob | ArrayBuffer | Uint8Array
}

export type RepositoryConfigInput = {
  supabaseUrl?: string | null
  supabaseAnonKey?: string | null
  edgeFunctionBaseUrl?: string | null
  defaultStoreId?: string | null
  tables?: Partial<RepositoryTableNames>
  buckets?: Partial<RepositoryBucketNames>
  edgeFunctions?: Partial<RepositoryEdgeFunctionNames>
}

export type RepositoryTableNames = {
  dishes: string
  dishImages: string
  categories: string
  storeProfiles: string
  storePwaProfiles: string
  pushDevices: string
  announcements: string
  appointmentSettings: string
  appointmentRequests: string
  stores: string
  chatConversations: string
  chatMessages: string
  chatThreadSummariesView: string
  merchantStoreMemberships: string
}

export type RepositoryBucketNames = {
  dishImages: string
  storeImages: string
  announcementImages: string
  chatImages: string
}

export type RepositoryEdgeFunctionNames = {
  sendPush: string
}

export type AuthRequestKind =
  | 'anonymous'
  | 'merchant'

export const DEFAULT_TABLES: RepositoryTableNames = {
  dishes: SHOWCASE_TABLES.dishes,
  dishImages: SHOWCASE_TABLES.dishImages,
  categories: SHOWCASE_TABLES.categories,
  storeProfiles: SHOWCASE_TABLES.storeProfiles,
  storePwaProfiles: SHOWCASE_TABLES.storePwaProfiles,
  pushDevices: SHOWCASE_TABLES.pushDevices,
  announcements: SHOWCASE_TABLES.announcements,
  appointmentSettings: SHOWCASE_TABLES.appointmentSettings,
  appointmentRequests: SHOWCASE_TABLES.appointmentRequests,
  stores: SHOWCASE_TABLES.stores,
  chatConversations: SHOWCASE_TABLES.chatConversations,
  chatMessages: SHOWCASE_TABLES.chatMessages,
  chatThreadSummariesView: SHOWCASE_TABLES.chatThreadSummariesView,
  merchantStoreMemberships: SHOWCASE_TABLES.merchantStoreMemberships
}

export const DEFAULT_BUCKETS: RepositoryBucketNames = {
  dishImages: SHOWCASE_BUCKETS.dishImages,
  storeImages: SHOWCASE_BUCKETS.storeImages,
  announcementImages: SHOWCASE_BUCKETS.announcementImages,
  chatImages: SHOWCASE_BUCKETS.chatImages
}

export const DEFAULT_EDGE_FUNCTIONS: RepositoryEdgeFunctionNames = {
  sendPush: SHOWCASE_EDGE_FUNCTIONS.sendPush
}

export function readEnv(name: string): string {
  const source = typeof process !== 'undefined' ? process.env : undefined
  return source?.[name] || ''
}

export function resolveSupabaseUrl(explicit?: string | null): string {
  return resolveShowcaseSupabaseUrl(explicit)
}

export function resolveSupabaseAnonKey(explicit?: string | null): string {
  return resolveShowcaseSupabaseAnonKey(explicit)
}

export const LOCAL_DEVELOPMENT_STORE_ID = 'store_showcase_trial_000001'

export function canUseDevelopmentDefaultStoreId(): boolean {
  return process.env.NODE_ENV !== 'production'
}

export function normalizeStoreId(storeId: string | null | undefined, fallback: string | null): string {
  const value = String(storeId || '').trim()
  if (value) return value

  const defaultValue = String(fallback || '').trim()
  if (defaultValue) return defaultValue

  if (canUseDevelopmentDefaultStoreId()) {
    return LOCAL_DEVELOPMENT_STORE_ID
  }

  throw new Error('storeId is required for cloud repository operation.')
}

export function ensureLeadingSlash(value: string): string {
  return value.startsWith('/') ? value : `/${value}`
}

export function trimSlashes(value: string): string {
  return String(value || '').replace(/^\/+/, '').replace(/\/+$/, '')
}

export function normalizePathPart(value: string): string {
  return trimSlashes(value).split('/').map(part => encodeURIComponent(part)).join('/')
}

export function appendQuery(url: string, query: string): string {
  if (!query) return url
  if (url.includes('?')) return `${url}&${query}`
  return `${url}?${query}`
}

export function nowMillis(): number {
  return Date.now()
}

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

export function safeParseJsonObject(text: string | null): Record<string, unknown> | null {
  if (!text) return null
  try {
    const value = JSON.parse(text)
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>
    }
    return null
  } catch {
    return null
  }
}

export function safeParseJsonArray(text: string | null): unknown[] {
  if (!text) return []
  try {
    const value = JSON.parse(text)
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function jsonString(value: Record<string, unknown>, key: string, fallback = ''): string {
  const raw = value[key]
  if (typeof raw === 'string') return raw
  if (typeof raw === 'number') return String(raw)
  if (typeof raw === 'boolean') return raw ? 'true' : 'false'
  return fallback
}

export function jsonNullableString(value: Record<string, unknown>, key: string): string | null {
  const raw = value[key]
  if (raw == null) return null
  if (typeof raw === 'string') return raw || null
  if (typeof raw === 'number') return String(raw)
  if (typeof raw === 'boolean') return raw ? 'true' : 'false'
  return null
}
export function createUuidLikeId(): string {
  const fallback = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, value => {
    const random = Math.floor(Math.random() * 16)
    const next = value === 'x' ? random : (random & 0x3) | 0x8
    return next.toString(16)
  })

  try {
    const randomUUID = globalThis.crypto?.randomUUID
    if (typeof randomUUID === 'function') {
      return randomUUID.call(globalThis.crypto)
    }
  } catch {
    return fallback
  }

  return fallback
}
export function firstNonBlankJsonString(value: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const next = jsonNullableString(value, key)
    if (next && next.trim()) return next.trim()
  }

  return null
}
export function jsonNumber(value: Record<string, unknown>, key: string, fallback = 0): number {
  const raw = value[key]
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const parsed = Number(raw)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

export function jsonNullableNumber(value: Record<string, unknown>, key: string): number | null {
  const raw = value[key]
  if (raw == null) return null
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const parsed = Number(raw)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

export function jsonBoolean(value: Record<string, unknown>, key: string, fallback = false): boolean {
  const raw = value[key]
  if (typeof raw === 'boolean') return raw
  if (typeof raw === 'number') return raw !== 0
  if (typeof raw === 'string') {
    const next = raw.trim().toLowerCase()
    if (next === 'true') return true
    if (next === 'false') return false
    if (next === '1') return true
    if (next === '0') return false
  }
  return fallback
}

export function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(item => String(item || '').trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return []

    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item || '').trim()).filter(Boolean)
      }
    } catch {
      return trimmed
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
    }
  }

  return []
}

export function parseCloudImageVariants(value: unknown): ShowcaseImageVariants | null {
  let raw: unknown = value

  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return null

    try {
      raw = JSON.parse(trimmed)
    } catch {
      return null
    }
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null

  const record = raw as Record<string, unknown>
  const variants: ShowcaseImageVariants = {
    originalUrl: jsonNullableString(record, 'originalUrl') || jsonNullableString(record, 'original_url'),
    largeUrl: jsonNullableString(record, 'largeUrl') || jsonNullableString(record, 'large_url'),
    mediumUrl: jsonNullableString(record, 'mediumUrl') || jsonNullableString(record, 'medium_url'),
    thumbUrl: jsonNullableString(record, 'thumbUrl') || jsonNullableString(record, 'thumb_url'),
    blurDataUrl: jsonNullableString(record, 'blurDataUrl') || jsonNullableString(record, 'blur_data_url')
  }

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

export function normalizePushNotificationImageUrl(value: unknown): string {
  const url = String(value || '').trim()

  if (!url) return ''
  if (url.startsWith('/')) return url
  if (url.startsWith('https://')) return url
  if (url.startsWith('http://')) return url

  return ''
}

export function pickCloudStorePwaPushIconUrl(profile: CloudStorePwaProfile | null): string {
  if (!profile) return ''

  return normalizePushNotificationImageUrl(profile.notificationIconUrl) ||
    normalizePushNotificationImageUrl(profile.icon192Url) ||
    normalizePushNotificationImageUrl(profile.icon512Url)
}

export function pickCloudStorePwaAppName(profile: CloudStorePwaProfile | null): string {
  const appName = String(profile?.appName || '').trim()

  return appName || 'NDJC'
}

export function pushBadgeUrlForPushType(value: unknown): string {
  const type = String(value || '').trim().toLowerCase()

  if (type === 'chat' || type === 'message' || type === 'chat_message') {
    return '/icons/push/chat-badge.svg'
  }

  if (
    type === 'appointment' ||
    type === 'booking' ||
    type === 'appointment_created' ||
    type === 'appointment_cancelled' ||
    type === 'appointment_status'
  ) {
    return '/icons/push/appointment-badge.svg'
  }

  if (type === 'announcement' || type === 'announcements') {
    return '/icons/push/announcement-badge.svg'
  }

  return '/icons/maskable-192.png'
}

export function isCloudImageVariantSchemaError(body: string | null | undefined): boolean {
  const text = String(body || '').toLowerCase()

  return text.includes('image_variants') ||
    text.includes('cover_image_variants') ||
    text.includes('logo_image_variants') ||
    text.includes("could not find the 'image_variants' column") ||
    text.includes("could not find the 'cover_image_variants' column") ||
    text.includes("could not find the 'logo_image_variants' column") ||
    text.includes('column image_variants does not exist') ||
    text.includes('column cover_image_variants does not exist') ||
    text.includes('column logo_image_variants does not exist')
}

export function stripCloudImageVariantColumns<T extends Record<string, ShowcaseRepositoryJson>>(payload: T): T {
  const next = { ...payload }

  delete next.image_variants
  delete next.cover_image_variants
  delete next.logo_image_variants

  return next as T
}

export function parseIsoMillis(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null

    const numeric = Number(trimmed)
    if (Number.isFinite(numeric) && trimmed.length <= 13) {
      return numeric
    }

    const parsed = Date.parse(trimmed)
    if (Number.isFinite(parsed)) return parsed
  }

  return null
}

export function formatIsoUtcMillis(value: number | null | undefined): string | null {
  if (value == null || !Number.isFinite(value)) return null
  return new Date(value).toISOString()
}

export function buildRawArrayBody(items: Record<string, unknown>[]): string {
  return JSON.stringify(items)
}

export function isRawArrayPayload(value: ShowcaseRepositoryJson | string | Blob | ArrayBuffer | Uint8Array | null | undefined): value is Record<string, ShowcaseRepositoryJson> {
  if (!value || typeof value !== 'object' || value instanceof Blob || value instanceof ArrayBuffer || value instanceof Uint8Array) {
    return false
  }

  return !Array.isArray(value) && Object.prototype.hasOwnProperty.call(value, '__raw_array__')
}

export function stringifyRequestBody(value: ShowcaseRepositoryJson | string | Blob | ArrayBuffer | Uint8Array | null | undefined): BodyInit | undefined {
  if (value == null) return undefined

  if (typeof value === 'string') return value
  if (value instanceof Blob) return value
  if (value instanceof ArrayBuffer) return value

  if (value instanceof Uint8Array) {
    const copy = new Uint8Array(value.byteLength)
    copy.set(value)
    return new Blob([copy.buffer as ArrayBuffer])
  }

  if (isRawArrayPayload(value)) {
    const raw = value.__raw_array__

    if (typeof raw === 'string') {
      return raw
    }

    return JSON.stringify(raw)
  }

  return JSON.stringify(value)
}

export function buildCategoryWriteErrorMessage(actionLabel: string, code: number, body: string | null): string {
  const text = String(body || '').trim()

  if (code === 0) {
    return `${actionLabel} failed. Merchant session missing or network error.`
  }

  if (code === 401) {
    return `${actionLabel} failed. Merchant session expired. Please sign in again.`
  }

  if (code === 403) {
    return `${actionLabel} failed. Permission denied for current store.`
  }

  if (
    text.toLowerCase().includes('row-level security') ||
    text.toLowerCase().includes('permission denied') ||
    text.toLowerCase().includes('violates row-level security policy')
  ) {
    return `${actionLabel} failed. Store permission check was rejected by cloud policy.`
  }

  if (text.toLowerCase().includes('jwt') && text.toLowerCase().includes('expired')) {
    return `${actionLabel} failed. Merchant session expired. Please sign in again.`
  }

  return `${actionLabel} failed. Cloud code=${code}.`
}

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = String(token || '').split('.')
  if (parts.length < 2) return null

  const payload = parts[1]
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(parts[1].length / 4) * 4, '=')

  try {
    if (typeof window === 'undefined') {
      return null
    }

    const decoded = window.atob(payload)
    const parsed = JSON.parse(decoded)
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null
  } catch {
    return null
  }
}

export function tokenExpiresAt(token: string): number {
  const payload = decodeJwtPayload(token)
  if (!payload) return nowSeconds() + 60 * 60

  const exp = jsonNullableNumber(payload, 'exp')
  if (exp == null) return nowSeconds() + 60 * 60

  return Math.trunc(exp)
}

