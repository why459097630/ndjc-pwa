import type { DemoDish, ShowcaseImageVariants } from './showcaseModels'
import {
  SHOWCASE_BUCKETS,
  SHOWCASE_EDGE_FUNCTIONS,
  SHOWCASE_PAGE_SIZE,
  SHOWCASE_TABLES,
  resolveShowcaseSupabaseAnonKey,
  resolveShowcaseSupabaseUrl
} from './showcaseCloudConfig'
import { StoreScopedCloudClient } from './showcaseStoreScopedCloudClient'
import {
  getFreshShowcaseAccessToken,
  refreshShowcaseAuthSession,
  requireFreshShowcaseAccessToken,
  signInShowcaseAuthWithPassword,
  signOutShowcaseAuth
} from './showcaseAuthSessionManager'
import {
  buildI18nValue,
  jsonRecord,
  pickI18nText
} from './showcaseI18n'

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
  updatedAt: number | null
  clickCount: number
}

export type CloudDishFilterRow = {
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

type PushRequestActor = 'public' | 'merchant'

function normalizePushAudience(value: string | null | undefined): string {
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

function isSupportedPushAudience(value: string): value is PushDeviceAudience {
  return (
    value === 'announcement_subscriber' ||
    value === 'chat_client' ||
    value === 'chat_merchant' ||
    value === 'appointment_client' ||
    value === 'appointment_merchant'
  )
}

function normalizePushActor(value: string | null | undefined): PushRequestActor {
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

const DEFAULT_TABLES: RepositoryTableNames = {
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

const DEFAULT_BUCKETS: RepositoryBucketNames = {
  dishImages: SHOWCASE_BUCKETS.dishImages,
  storeImages: SHOWCASE_BUCKETS.storeImages,
  announcementImages: SHOWCASE_BUCKETS.announcementImages,
  chatImages: SHOWCASE_BUCKETS.chatImages
}

const DEFAULT_EDGE_FUNCTIONS: RepositoryEdgeFunctionNames = {
  sendPush: SHOWCASE_EDGE_FUNCTIONS.sendPush
}

function readEnv(name: string): string {
  const source = typeof process !== 'undefined' ? process.env : undefined
  return source?.[name] || ''
}

function resolveSupabaseUrl(explicit?: string | null): string {
  return resolveShowcaseSupabaseUrl(explicit)
}

function resolveSupabaseAnonKey(explicit?: string | null): string {
  return resolveShowcaseSupabaseAnonKey(explicit)
}

const LOCAL_DEVELOPMENT_STORE_ID = 'store_showcase_trial_000001'

function canUseDevelopmentDefaultStoreId(): boolean {
  return process.env.NODE_ENV !== 'production'
}

function normalizeStoreId(storeId: string | null | undefined, fallback: string | null): string {
  const value = String(storeId || '').trim()
  if (value) return value

  const defaultValue = String(fallback || '').trim()
  if (defaultValue) return defaultValue

  if (canUseDevelopmentDefaultStoreId()) {
    return LOCAL_DEVELOPMENT_STORE_ID
  }

  throw new Error('storeId is required for cloud repository operation.')
}

function ensureLeadingSlash(value: string): string {
  return value.startsWith('/') ? value : `/${value}`
}

function trimSlashes(value: string): string {
  return String(value || '').replace(/^\/+/, '').replace(/\/+$/, '')
}

function normalizePathPart(value: string): string {
  return trimSlashes(value).split('/').map(part => encodeURIComponent(part)).join('/')
}

function appendQuery(url: string, query: string): string {
  if (!query) return url
  if (url.includes('?')) return `${url}&${query}`
  return `${url}?${query}`
}

function nowMillis(): number {
  return Date.now()
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

function safeParseJsonObject(text: string | null): Record<string, unknown> | null {
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

function safeParseJsonArray(text: string | null): unknown[] {
  if (!text) return []
  try {
    const value = JSON.parse(text)
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function jsonString(value: Record<string, unknown>, key: string, fallback = ''): string {
  const raw = value[key]
  if (typeof raw === 'string') return raw
  if (typeof raw === 'number') return String(raw)
  if (typeof raw === 'boolean') return raw ? 'true' : 'false'
  return fallback
}

function jsonNullableString(value: Record<string, unknown>, key: string): string | null {
  const raw = value[key]
  if (raw == null) return null
  if (typeof raw === 'string') return raw || null
  if (typeof raw === 'number') return String(raw)
  if (typeof raw === 'boolean') return raw ? 'true' : 'false'
  return null
}
function createUuidLikeId(): string {
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
function firstNonBlankJsonString(value: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const next = jsonNullableString(value, key)
    if (next && next.trim()) return next.trim()
  }

  return null
}
function jsonNumber(value: Record<string, unknown>, key: string, fallback = 0): number {
  const raw = value[key]
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const parsed = Number(raw)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

function jsonNullableNumber(value: Record<string, unknown>, key: string): number | null {
  const raw = value[key]
  if (raw == null) return null
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const parsed = Number(raw)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function jsonBoolean(value: Record<string, unknown>, key: string, fallback = false): boolean {
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

function parseStringArray(value: unknown): string[] {
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

function parseCloudImageVariants(value: unknown): ShowcaseImageVariants | null {
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

function normalizePushNotificationImageUrl(value: unknown): string {
  const url = String(value || '').trim()

  if (!url) return ''
  if (url.startsWith('/')) return url
  if (url.startsWith('https://')) return url
  if (url.startsWith('http://')) return url

  return ''
}

function pickCloudStorePwaPushIconUrl(profile: CloudStorePwaProfile | null): string {
  if (!profile) return ''

  return normalizePushNotificationImageUrl(profile.notificationIconUrl) ||
    normalizePushNotificationImageUrl(profile.icon192Url) ||
    normalizePushNotificationImageUrl(profile.icon512Url)
}

function pickCloudStorePwaAppName(profile: CloudStorePwaProfile | null): string {
  const appName = String(profile?.appName || '').trim()

  return appName || 'NDJC'
}

function pushBadgeUrlForPushType(value: unknown): string {
  const type = String(value || '').trim().toLowerCase()

  if (type === 'chat' || type === 'message' || type === 'chat_message') {
    return '/icons/push/chat-badge.svg'
  }

  if (
    type === 'appointment' ||
    type === 'booking' ||
    type === 'appointment_created' ||
    type === 'appointment_status'
  ) {
    return '/icons/push/appointment-badge.svg'
  }

  if (type === 'announcement' || type === 'announcements') {
    return '/icons/push/announcement-badge.svg'
  }

  return '/icons/maskable-192.png'
}

function isCloudImageVariantSchemaError(body: string | null | undefined): boolean {
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

function stripCloudImageVariantColumns<T extends Record<string, ShowcaseRepositoryJson>>(payload: T): T {
  const next = { ...payload }

  delete next.image_variants
  delete next.cover_image_variants
  delete next.logo_image_variants

  return next as T
}

function parseIsoMillis(value: unknown): number | null {
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

function formatIsoUtcMillis(value: number | null | undefined): string | null {
  if (value == null || !Number.isFinite(value)) return null
  return new Date(value).toISOString()
}

function buildRawArrayBody(items: Record<string, unknown>[]): string {
  return JSON.stringify(items)
}

function isRawArrayPayload(value: ShowcaseRepositoryJson | string | Blob | ArrayBuffer | Uint8Array | null | undefined): value is Record<string, ShowcaseRepositoryJson> {
  if (!value || typeof value !== 'object' || value instanceof Blob || value instanceof ArrayBuffer || value instanceof Uint8Array) {
    return false
  }

  return !Array.isArray(value) && Object.prototype.hasOwnProperty.call(value, '__raw_array__')
}

function stringifyRequestBody(value: ShowcaseRepositoryJson | string | Blob | ArrayBuffer | Uint8Array | null | undefined): BodyInit | undefined {
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

function buildCategoryWriteErrorMessage(actionLabel: string, code: number, body: string | null): string {
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

function decodeJwtPayload(token: string): Record<string, unknown> | null {
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

function tokenExpiresAt(token: string): number {
  const payload = decodeJwtPayload(token)
  if (!payload) return nowSeconds() + 60 * 60

  const exp = jsonNullableNumber(payload, 'exp')
  if (exp == null) return nowSeconds() + 60 * 60

  return Math.trunc(exp)
}

export class ShowcaseCloudRepository {
  private readonly supabaseUrl: string
  private readonly supabaseAnonKey: string
  private readonly edgeFunctionBaseUrl: string
  private readonly defaultStoreId: string | null
  private readonly tables: RepositoryTableNames
  private readonly buckets: RepositoryBucketNames
  private readonly edgeFunctions: RepositoryEdgeFunctionNames
  private readonly scopedCloud: StoreScopedCloudClient

  private merchantSession: MerchantAuthSession | null = null

  lastUpsertCode: number | null = null
  lastUpsertBody: string | null = null

  lastAnnouncementUpsertCode: number | null = null
  lastAnnouncementUpsertBody: string | null = null

  lastAnnouncementPushCode: number | null = null
  lastAnnouncementPushBody: string | null = null

  lastMerchantAuthCode: number | null = null
  lastMerchantAuthBody: string | null = null

  lastMerchantBindingCode: number | null = null
  lastMerchantBindingBody: string | null = null

  lastDeleteCode: number | null = null
  lastDeleteBody: string | null = null

  lastDishImageUploadCode: number | null = null
  lastDishImageUploadBody: string | null = null

  lastStoreImageUploadCode: number | null = null
  lastStoreImageUploadBody: string | null = null

  lastReadFailureAt = 0
  lastReadFailureLabel: string | null = null
  lastReadFailureMessage: string | null = null
  lastReadFailureUrl: string | null = null

  constructor(config: RepositoryConfigInput = {}) {
    this.supabaseUrl = resolveSupabaseUrl(config.supabaseUrl)
    this.supabaseAnonKey = resolveSupabaseAnonKey(config.supabaseAnonKey)
    this.edgeFunctionBaseUrl = (config.edgeFunctionBaseUrl || this.supabaseUrl).replace(/\/+$/, '')
    this.defaultStoreId = config.defaultStoreId || null

    this.tables = {
      ...DEFAULT_TABLES,
      ...(config.tables || {})
    }

    this.buckets = {
      ...DEFAULT_BUCKETS,
      ...(config.buckets || {})
    }

    this.edgeFunctions = {
      ...DEFAULT_EDGE_FUNCTIONS,
      ...(config.edgeFunctions || {})
    }

    this.scopedCloud = new StoreScopedCloudClient({
      supabaseUrl: this.supabaseUrl,
      supabaseAnonKey: this.supabaseAnonKey,
      edgeFunctionBaseUrl: this.edgeFunctionBaseUrl,
      defaultStoreId: this.defaultStoreId
    })
  }

  private markReadFailure(input: {
    label: string
    message: string
    url?: string | null
  }): void {
    this.lastReadFailureAt = Date.now()
    this.lastReadFailureLabel = input.label
    this.lastReadFailureMessage = input.message
    this.lastReadFailureUrl = input.url || null
  }

  get currentMerchantSession(): MerchantAuthSession | null {
    return this.merchantSession
  }

  setMerchantSession(session: MerchantAuthSession | null): void {
    this.merchantSession = session
  }

  clearMerchantSession(): void {
    this.merchantSession = null
  }

  private requireStoreId(storeId: string | null | undefined): string {
    return normalizeStoreId(storeId, this.defaultStoreId)
  }

  private dishesTable(): string {
    return this.tables.dishes || 'dishes'
  }

  private dishImagesTable(): string {
    return this.tables.dishImages || 'dish_images'
  }

  private categoriesTable(): string {
    return this.tables.categories || 'categories'
  }

  private storeProfileTable(): string {
    return this.tables.storeProfiles || 'store_profiles'
  }

  private storePwaProfileTable(): string {
    return this.tables.storePwaProfiles || 'store_pwa_profiles'
  }

  private pushDevicesTable(): string {
    return this.tables.pushDevices || 'push_devices'
  }

  private announcementsTable(): string {
    return this.tables.announcements || 'announcements'
  }

  private appointmentSettingsTable(): string {
    return this.tables.appointmentSettings || 'appointment_settings'
  }

  private appointmentRequestsTable(): string {
    return this.tables.appointmentRequests || 'appointment_requests'
  }

  private storesTable(): string {
    return this.tables.stores || 'stores'
  }

  private chatConversationsTable(): string {
    return this.tables.chatConversations || 'chat_conversations'
  }

  private chatMessagesTable(): string {
    return this.tables.chatMessages || 'chat_messages'
  }

  private chatThreadSummariesView(): string {
    return this.tables.chatThreadSummariesView || 'chat_thread_summaries'
  }

  private merchantStoreMembershipsTable(): string {
    return this.tables.merchantStoreMemberships || 'merchant_store_memberships'
  }

  private dishImagesBucket(): string {
    return this.buckets.dishImages || 'dish-images'
  }

  private storeImagesBucket(): string {
    return this.buckets.storeImages || 'store-images'
  }

  private announcementImagesBucket(): string {
    return this.buckets.announcementImages || 'announcement-images'
  }

  private chatImagesBucket(): string {
    return this.buckets.chatImages || 'chat-images'
  }

  private restUrl(path: string): string {
    return this.scopedCloud.restUrl(path)
  }

  private authUrl(path: string): string {
    return this.scopedCloud.authUrl(path)
  }

  private storageObjectUrl(bucket: string, path: string): string {
    return this.scopedCloud.storageObjectUrl(bucket, path)
  }

  private storagePublicUrl(bucket: string, path: string): string {
    return this.scopedCloud.storagePublicObjectUrl(bucket, path)
  }

  private functionUrl(name: string): string {
    return this.scopedCloud.functionUrl(name)
  }

  private urlEncode(value: string): string {
    return encodeURIComponent(value)
  }

  private encodeEq(value: string): string {
    return encodeURIComponent(`eq.${value}`)
  }

  private encodeIlike(value: string): string {
    return encodeURIComponent(`*${value}*`)
  }

  private async openConnection(url: string, options: ShowcaseRepositoryRequestOptions = {}): Promise<Response> {
    return this.scopedCloud.openConnection(url, options)
  }

  private async readResponseBody(response: Response): Promise<string | null> {
    try {
      return await response.text()
    } catch {
      return null
    }
  }

  private async request(url: string, options: ShowcaseRepositoryRequestOptions = {}): Promise<ShowcaseRepositoryHttpResult> {
    try {
      const response = await this.openConnection(url, options)
      const text = await this.readResponseBody(response)

      return {
        code: response.status,
        body: text,
        headers: response.headers
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error || 'Network error')

      if ((options.method || 'GET') === 'GET') {
        this.markReadFailure({
          label: 'request',
          message,
          url
        })
      }

      return {
        code: 0,
        body: message,
        headers: new Headers()
      }
    }
  }

  private async httpGet(
    url: string,
    scopeStoreId?: string | null,
    scopeClientId?: string | null
  ): Promise<[number, string | null]> {
    const result = await this.request(url, {
      method: 'GET',
      scopeStoreId,
      scopeClientId
    })
    return [result.code, result.body]
  }

  private async httpPost(
    url: string,
    body: ShowcaseRepositoryJson | string,
    prefer: string | null = 'return=representation',
    scopeStoreId?: string | null,
    scopeClientId?: string | null
  ): Promise<[number, string | null]> {
    const result = await this.request(url, {
      method: 'POST',
      body,
      prefer,
      scopeStoreId,
      scopeClientId
    })
    return [result.code, result.body]
  }

  private async httpPatch(
    url: string,
    body: ShowcaseRepositoryJson | string,
    prefer: string | null = 'return=representation',
    scopeStoreId?: string | null,
    scopeClientId?: string | null
  ): Promise<[number, string | null]> {
    const result = await this.request(url, {
      method: 'PATCH',
      body,
      prefer,
      scopeStoreId,
      scopeClientId
    })
    return [result.code, result.body]
  }

  private async httpDelete(
    url: string,
    scopeStoreId?: string | null,
    scopeClientId?: string | null
  ): Promise<[number, string | null]> {
    const result = await this.request(url, {
      method: 'DELETE',
      prefer: 'return=minimal',
      scopeStoreId,
      scopeClientId
    })
    return [result.code, result.body]
  }

  private async httpPutBytes(
    url: string,
    bytes: Blob | ArrayBuffer | Uint8Array,
    contentType: string,
    authorization: string | null = null,
    scopeStoreId?: string | null,
    scopeClientId?: string | null
  ): Promise<[number, string | null]> {
    const result = await this.request(url, {
      method: 'PUT',
      body: bytes,
      contentType,
      authorization,
      scopeStoreId,
      scopeClientId,
      extraHeaders: {
        'x-upsert': 'true'
      }
    })
    return [result.code, result.body]
  }

  private async httpAuthPutBytes(
    url: string,
    bytes: Blob | ArrayBuffer | Uint8Array,
    contentType: string,
    scopeStoreId?: string | null,
    scopeClientId?: string | null
  ): Promise<[number, string | null]> {
    let accessToken: string

    try {
      accessToken = await requireFreshShowcaseAccessToken()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Merchant session missing'
      return [0, message]
    }

    const first = await this.request(url, {
      method: 'PUT',
      body: bytes,
      contentType,
      authorization: `Bearer ${accessToken}`,
      scopeStoreId,
      scopeClientId,
      extraHeaders: {
        'x-upsert': 'true'
      }
    })

    if (!this.isJwtExpiredBody(first.code, first.body)) {
      return [first.code, first.body]
    }

    let retryAccessToken = ''

    try {
      const refreshed = await refreshShowcaseAuthSession()
      retryAccessToken = refreshed?.accessToken || ''
    } catch {
      return [first.code, first.body]
    }

    if (!retryAccessToken || retryAccessToken === accessToken) {
      return [first.code, first.body]
    }

    const second = await this.request(url, {
      method: 'PUT',
      body: bytes,
      contentType,
      authorization: `Bearer ${retryAccessToken}`,
      scopeStoreId,
      scopeClientId,
      extraHeaders: {
        'x-upsert': 'true'
      }
    })

    return [second.code, second.body]
  }

  private isJwtExpiredBody(code: number | null | undefined, body: string | null | undefined): boolean {
    const c = code || 0
    const text = String(body || '').trim().toLowerCase()

    const tokenExpired = (
      text.includes('jwt expired') ||
      text.includes('"exp" claim timestamp check failed') ||
      text.includes('exp claim timestamp check failed') ||
      text.includes('access token expired') ||
      text.includes('token expired') ||
      text.includes('invalid jwt') ||
      (text.includes('jwt') && text.includes('expired'))
    )

    if (tokenExpired) {
      return true
    }

    if (c !== 401) {
      return false
    }

    return (
      text.includes('unauthorized') ||
      text.includes('not authenticated') ||
      text.includes('authentication') ||
      text.includes('bearer') ||
      text.includes('jwt') ||
      text.includes('access token') ||
      text.includes('auth token') ||
      text.includes('session')
    )
  }

  isMerchantAuthExpired(code: number | null | undefined, body: string | null | undefined): boolean {
    return this.isJwtExpiredBody(code, body)
  }

  private async httpAuthRequest(
    url: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    body: ShowcaseRepositoryJson | string | null = null,
    prefer: string | null = method === 'GET' ? null : 'return=representation',
    scopeStoreId?: string | null,
    scopeClientId?: string | null
  ): Promise<[number, string | null]> {
    let accessToken: string

    try {
      accessToken = await requireFreshShowcaseAccessToken()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Merchant session missing'
      return [0, message]
    }

    const first = await this.request(url, {
      method,
      body,
      prefer,
      authorization: `Bearer ${accessToken}`,
      scopeStoreId,
      scopeClientId
    })

    if (!this.isJwtExpiredBody(first.code, first.body)) {
      return [first.code, first.body]
    }

    let retryAccessToken = ''

    try {
      const refreshed = await refreshShowcaseAuthSession()
      retryAccessToken = refreshed?.accessToken || ''
    } catch {
      return [first.code, first.body]
    }

    if (!retryAccessToken || retryAccessToken === accessToken) {
      return [first.code, first.body]
    }

    const second = await this.request(url, {
      method,
      body,
      prefer,
      authorization: `Bearer ${retryAccessToken}`,
      scopeStoreId,
      scopeClientId
    })

    return [second.code, second.body]
  }

  private async httpAuthGet(
    url: string,
    scopeStoreId?: string | null,
    scopeClientId?: string | null
  ): Promise<[number, string | null]> {
    return this.httpAuthRequest(url, 'GET', null, null, scopeStoreId, scopeClientId)
  }

  private async httpAuthPost(
    url: string,
    body: ShowcaseRepositoryJson | string,
    prefer: string | null = 'return=representation',
    scopeStoreId?: string | null,
    scopeClientId?: string | null
  ): Promise<[number, string | null]> {
    return this.httpAuthRequest(url, 'POST', body, prefer, scopeStoreId, scopeClientId)
  }

  private async httpAuthPatch(
    url: string,
    body: ShowcaseRepositoryJson | string,
    prefer: string | null = 'return=representation',
    scopeStoreId?: string | null,
    scopeClientId?: string | null
  ): Promise<[number, string | null]> {
    return this.httpAuthRequest(url, 'PATCH', body, prefer, scopeStoreId, scopeClientId)
  }

  private async httpAuthDelete(
    url: string,
    scopeStoreId?: string | null,
    scopeClientId?: string | null
  ): Promise<[number, string | null]> {
    return this.httpAuthRequest(url, 'DELETE', null, 'return=minimal', scopeStoreId, scopeClientId)
  }

  private async executeOnce<T>(
    label: string,
    block: () => Promise<T>,
    fallback: T
  ): Promise<T> {
    try {
      return await block()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error || 'Cloud read failed.')
      console.warn(`[ShowcaseCloudRepository] ${label} failed`, error)
      this.markReadFailure({
        label,
        message
      })
      return fallback
    }
  }

  private parseObjectArray(body: string | null): Record<string, unknown>[] {
    const arr = safeParseJsonArray(body)
    return arr.filter(item => item && typeof item === 'object' && !Array.isArray(item)) as Record<string, unknown>[]
  }

  private parseFirstObject(body: string | null): Record<string, unknown> | null {
    const arr = this.parseObjectArray(body)
    return arr[0] || safeParseJsonObject(body)
  }

  private buildSelectUrl(table: string, query: string): string {
    return this.restUrl(`${table}?${query}`)
  }

  private buildStorageUploadPath(input: UploadBytesInput): string {
    const safeStoreId = normalizePathPart(this.requireStoreId(input.storeId))
    const safePrefix = normalizePathPart(input.pathPrefix || 'uploads')
    const cleanFileName = normalizePathPart(input.fileName || `${createUuidLikeId()}.bin`)
    return `${safeStoreId}/${safePrefix}/${cleanFileName}`
  }

  private buildChatStorageUploadPath(input: UploadBytesInput): string {
    const safeStoreId = normalizePathPart(this.requireStoreId(input.storeId))
    const safeClientId = normalizePathPart(input.clientId || input.pathPrefix || 'client')
    const cleanFileName = normalizePathPart(input.fileName || `${createUuidLikeId()}.bin`)
    return `${safeStoreId}/${safeClientId}/${cleanFileName}`
  }

  private buildStoragePublicObjectUrl(bucket: string, path: string): string {
    return this.storagePublicUrl(bucket, path)
  }

  private formatIsoUtcMillis(value: number | null | undefined): string | null {
    return formatIsoUtcMillis(value)
  }

  private parseIsoMillis(value: unknown): number | null {
    return parseIsoMillis(value)
  }

  private parseStringArray(value: unknown): string[] {
    return parseStringArray(value)
  }

  private buildCategoryWriteErrorMessage(actionLabel: string, code: number, body: string | null): string {
    return buildCategoryWriteErrorMessage(actionLabel, code, body)
  }

private parseCategory(raw: Record<string, unknown>): CloudCategory {
  const fallbackName = jsonString(raw, 'name')
  const nameI18n = jsonRecord(raw, 'name_i18n')
  const name = pickI18nText(nameI18n, fallbackName)

  return {
    id: jsonString(raw, 'id'),
    name: name || '',
    sortOrder: jsonNullableNumber(raw, 'sort_order')
  }
}

private parseDish(raw: Record<string, unknown>, images: string[] = []): CloudDish {
  const id = jsonNullableString(raw, 'id')
  const nameFallback = jsonString(raw, 'name', jsonString(raw, 'title', ''))
  const nameI18n = jsonRecord(raw, 'name_i18n')
  const displayName = pickI18nText(nameI18n, nameFallback || 'Untitled item')
  const descriptionFallback = jsonNullableString(raw, 'description') || ''
  const descriptionI18n = jsonRecord(raw, 'description_i18n')
  const displayDescription = pickI18nText(descriptionI18n, descriptionFallback)
  const originalPrice = jsonNumber(raw, 'original_price', jsonNumber(raw, 'price', 0))
  const imageUrl = jsonNullableString(raw, 'image_url')
  const imageVariants = parseCloudImageVariants(raw.image_variants)
  const imageUrlsFromJson = parseStringArray(raw.image_urls)
  const mergedImages = [
    ...images,
    ...imageUrlsFromJson,
    ...(imageUrl ? [imageUrl] : [])
  ]
    .map(item => String(item || '').trim())
    .filter(Boolean)

  return {
    id,
    name: displayName,
    description: displayDescription,
    categoryId: jsonNullableString(raw, 'category_id'),
    categoryName: firstNonBlankJsonString(raw, [
      'category_name',
      'category',
      'category_text',
      'category_label'
    ]),
    price: originalPrice,
    discountPrice: jsonNullableNumber(raw, 'discount_price'),
    recommended: jsonBoolean(raw, 'recommended', jsonBoolean(raw, 'is_recommended', false)),
    soldOut: jsonBoolean(raw, 'sold_out', jsonBoolean(raw, 'is_sold_out', false)),
    hidden: jsonBoolean(raw, 'hidden', jsonBoolean(raw, 'is_hidden', false)),
    imageUrl: mergedImages[0] || null,
    imageUrls: Array.from(new Set(mergedImages)),
    imageVariants,
    tags: parseStringArray(raw.tags),
    externalLink: jsonNullableString(raw, 'external_link'),
    updatedAt: this.parseIsoMillis(raw.updated_at),
    clickCount: jsonNumber(raw, 'click_count', 0)
  }
}

  private cloudDishToDemoDish(dish: CloudDish, categoriesById: Map<string, CloudCategory> = new Map()): DemoDish {
    const categoryFromId = dish.categoryId ? categoriesById.get(dish.categoryId)?.name || null : null
    const category = firstNonBlankJsonString(
      {
        categoryFromId,
        categoryName: dish.categoryName
      },
      ['categoryFromId', 'categoryName']
    )

    return {
      id: dish.id || `dish_${Date.now()}`,
      title: dish.name || 'Untitled item',
      name: dish.name || 'Untitled item',
      description: dish.description || '',
      category,
      originalPrice: dish.price,
      discountPrice: dish.discountPrice,
      isRecommended: dish.recommended,
      isSoldOut: dish.soldOut,
      isHidden: dish.hidden,
      imageUrls: dish.imageUrls,
      imageVariants: dish.imageVariants ?? null,
      tags: dish.tags,
      clickCount: dish.clickCount,
      updatedAt: dish.updatedAt || Date.now(),
      syncState: 'Synced',
      isFavorite: false
    }
  }

private demoDishToCloudPayload(storeId: string, dish: DemoDish, categoryId: string | null): Record<string, ShowcaseRepositoryJson> {
  const name = String(dish.name || dish.title || 'Untitled item').trim()
  const description = String(dish.description || '').trim()

  return {
    id: dish.id,
    store_id: storeId,
    name,
    name_i18n: buildI18nValue({
      default: name
    }),
    description,
    description_i18n: buildI18nValue({
      default: description
    }),
    category_id: categoryId,
    price: Number(dish.originalPrice || 0),
    discount_price: dish.discountPrice == null ? null : Number(dish.discountPrice || 0),
    recommended: Boolean(dish.isRecommended),
    sold_out: Boolean(dish.isSoldOut),
    hidden: Boolean(dish.isHidden),
    image_variants: dish.imageVariants || null,
    tags: dish.tags || [],
    click_count: Number(dish.clickCount || 0),
    updated_at: Number(dish.updatedAt || Date.now())
  }
}

private parseStoreProfile(raw: Record<string, unknown>, storeIdFallback: string): CloudStoreProfile {
  const titleFallback = jsonString(raw, 'title', jsonString(raw, 'display_name', 'Showcase Store'))
  const subtitleFallback = jsonString(raw, 'subtitle', jsonString(raw, 'tagline', ''))
  const descriptionFallback = jsonString(raw, 'description')
  const addressFallback = jsonString(raw, 'address')
  const hoursFallback = jsonString(raw, 'hours', jsonString(raw, 'business_hours', ''))
  const businessStatusFallback = jsonString(raw, 'business_status')

  return {
    storeId: jsonString(raw, 'store_id', storeIdFallback),
    title: pickI18nText(jsonRecord(raw, 'title_i18n'), titleFallback),
    subtitle: pickI18nText(jsonRecord(raw, 'subtitle_i18n'), subtitleFallback),
    description: pickI18nText(jsonRecord(raw, 'description_i18n'), descriptionFallback),
    address: pickI18nText(jsonRecord(raw, 'address_i18n'), addressFallback),
    hours: pickI18nText(jsonRecord(raw, 'hours_i18n'), hoursFallback),
    mapUrl: jsonString(raw, 'map_url'),
    extraContactsJson: typeof raw.extra_contacts_json === 'string'
      ? raw.extra_contacts_json
      : JSON.stringify(raw.extra_contacts || []),
    servicesJson: typeof raw.services_json === 'string'
      ? raw.services_json
      : JSON.stringify(raw.services || []),
    coverUrl: jsonString(raw, 'cover_url'),
    logoUrl: jsonString(raw, 'logo_url'),
    coverImageVariants: parseCloudImageVariants(raw.cover_image_variants),
    logoImageVariants: parseCloudImageVariants(raw.logo_image_variants),
    businessStatus: pickI18nText(jsonRecord(raw, 'business_status_i18n'), businessStatusFallback),
    updatedAt: this.parseIsoMillis(raw.updated_at)
  }
}

private parseStorePwaProfile(raw: Record<string, unknown>, storeIdFallback: string): CloudStorePwaProfile {
  const appName = jsonString(raw, 'app_name', 'NDJC')
  const shortName = jsonString(raw, 'short_name', appName)

  return {
    storeId: jsonString(raw, 'store_id', storeIdFallback),
    appName,
    shortName,
    description: jsonString(raw, 'description', `${appName} official PWA app.`),
    notificationIconUrl: jsonString(raw, 'notification_icon_url'),
    icon192Url: jsonString(raw, 'icon_192_url'),
    icon512Url: jsonString(raw, 'icon_512_url'),
    maskable192Url: jsonString(raw, 'maskable_192_url'),
    maskable512Url: jsonString(raw, 'maskable_512_url'),
    appleTouchIconUrl: jsonString(raw, 'apple_touch_icon_url'),
    themeColor: jsonString(raw, 'theme_color', '#ffffff'),
    backgroundColor: jsonString(raw, 'background_color', '#ffffff'),
    updatedAt: this.parseIsoMillis(raw.updated_at)
  }
}

private storeProfilePayload(profile: CloudStoreProfile): Record<string, ShowcaseRepositoryJson> {
  return {
    store_id: profile.storeId,
    title: profile.title,
    title_i18n: buildI18nValue({
      default: profile.title
    }),
    subtitle: profile.subtitle,
    subtitle_i18n: buildI18nValue({
      default: profile.subtitle
    }),
    description: profile.description,
    description_i18n: buildI18nValue({
      default: profile.description
    }),
    address: profile.address,
    address_i18n: buildI18nValue({
      default: profile.address
    }),
    hours: profile.hours,
    hours_i18n: buildI18nValue({
      default: profile.hours
    }),
    map_url: profile.mapUrl,
    extra_contacts_json: profile.extraContactsJson || '[]',
    services_json: profile.servicesJson || '[]',
    cover_url: profile.coverUrl,
    logo_url: profile.logoUrl,
    cover_image_variants: profile.coverImageVariants || null,
    logo_image_variants: profile.logoImageVariants || null,
    business_status: profile.businessStatus,
    business_status_i18n: buildI18nValue({
      default: profile.businessStatus
    }),
    updated_at: new Date().toISOString()
  }
}
async fetchCategories(storeIdInput?: string | null): Promise<CloudCategory[]> {
  const storeId = this.requireStoreId(storeIdInput)
  const query = [
    'select=id,store_id,name,name_i18n,sort_order',
    `store_id=${this.encodeEq(storeId)}`,
    'order=sort_order.asc.nullslast,name.asc.nullslast'
  ].join('&')

  const url = this.buildSelectUrl(this.categoriesTable(), query)

  return this.executeOnce('fetchCategories', async () => {
    const [code, body] = await this.httpGet(url, storeId)
    if (code < 200 || code > 299) return []
    return this.parseObjectArray(body)
      .map(item => this.parseCategory(item))
      .filter(item => item.id && item.name.trim())
  }, [])
}

  async fetchCategoryMap(storeIdInput?: string | null): Promise<Map<string, CloudCategory>> {
    const categories = await this.fetchCategories(storeIdInput)
    return new Map(categories.map(item => [item.id, item]))
  }
  async fetchDishImagesByDishIds(
    storeIdInput: string | null | undefined,
    dishIds: string[]
  ): Promise<Map<string, string[]>> {
    const storeId = this.requireStoreId(storeIdInput)
    const ids = dishIds
      .map(id => String(id || '').trim())
      .filter(Boolean)

    if (!ids.length) return new Map()

    const inValue = `in.(${ids.map(id => `"${id.replace(/"/g, '\\"')}"`).join(',')})`
    const query = [
      'select=dish_id,image_url,sort_order',
      `store_id=${this.encodeEq(storeId)}`,
      `dish_id=${encodeURIComponent(inValue)}`,
      'order=sort_order.asc'
    ].join('&')

    const url = this.buildSelectUrl(this.dishImagesTable(), query)

    return this.executeOnce('fetchDishImagesByDishIds', async () => {
      const [code, body] = await this.httpGet(url, storeId)
      const result = new Map<string, string[]>()

      if (code < 200 || code > 299) return result

      this.parseObjectArray(body).forEach(row => {
        const dishId = jsonString(row, 'dish_id')
        const imageUrl = jsonString(row, 'image_url')
        if (!dishId || !imageUrl) return

        const current = result.get(dishId) || []
        current.push(imageUrl)
        result.set(dishId, current)
      })

      return result
    }, new Map())
  }

  async enrichDishesWithImages(storeIdInput: string | null | undefined, dishes: CloudDish[]): Promise<CloudDish[]> {
    const storeId = this.requireStoreId(storeIdInput)
    const ids = dishes
      .map(item => String(item.id || '').trim())
      .filter(Boolean)

    if (!ids.length) return dishes

    const imagesByDishId = await this.fetchDishImagesByDishIds(storeId, ids)

    return dishes.map(item => {
      const dishId = String(item.id || '').trim()
      const images = dishId ? imagesByDishId.get(dishId) || [] : []
      const mergedImages = Array.from(new Set([
        ...images,
        ...item.imageUrls,
        ...(item.imageUrl ? [item.imageUrl] : [])
      ].map(url => String(url || '').trim()).filter(Boolean)))

      return {
        ...item,
        imageUrl: mergedImages[0] || null,
        imageUrls: mergedImages,
        imageVariants: item.imageVariants ?? null
      }
    })
  }

  private async parseDishesArray(
    storeIdInput: string | null | undefined,
    body: string | null,
    categoriesById: Map<string, CloudCategory>
  ): Promise<DemoDish[]> {
    const storeId = this.requireStoreId(storeIdInput)
    const rows = this.parseObjectArray(body)
    const dishIds = rows
      .map(row => jsonNullableString(row, 'id'))
      .filter((id): id is string => Boolean(id))

    const imagesByDishId = await this.fetchDishImagesByDishIds(storeId, dishIds)

    return rows.map(row => {
      const dishId = jsonNullableString(row, 'id')
      const images = dishId ? imagesByDishId.get(dishId) || [] : []
      return this.cloudDishToDemoDish(this.parseDish(row, images), categoriesById)
    })
  }

async fetchDishes(storeIdInput?: string | null): Promise<DemoDish[]> {
  const storeId = this.requireStoreId(storeIdInput)
  const categoriesById = await this.fetchCategoryMap(storeId)
  const query = [
    'select=*',
    `store_id=${this.encodeEq(storeId)}`,
    'order=updated_at.desc.nullslast,name.asc'
  ].join('&')

  const url = this.buildSelectUrl(this.dishesTable(), query)

  return this.executeOnce('fetchDishes', async () => {
    const [code, body] = await this.httpGet(url, storeId)
    if (code < 200 || code > 299) return []
    return this.parseDishesArray(storeId, body, categoriesById)
  }, [])
}

  async fetchDishesPaged(input: {
    storeId?: string | null
    limit?: number
    offset?: number
  } = {}): Promise<DemoDish[]> {
    const storeId = this.requireStoreId(input.storeId)
    const limit = Math.max(1, Math.min(Number(input.limit || SHOWCASE_PAGE_SIZE.homeDishes), 200))
    const offset = Math.max(0, Number(input.offset || 0))
    const categoriesById = await this.fetchCategoryMap(storeId)

const query = [
  'select=*',
  `store_id=${this.encodeEq(storeId)}`,
  'order=updated_at.desc.nullslast,name.asc',
  `limit=${limit}`,
  `offset=${offset}`
].join('&')

    const url = this.buildSelectUrl(this.dishesTable(), query)

    return this.executeOnce('fetchDishesPaged', async () => {
      const [code, body] = await this.httpGet(url, storeId)
      if (code < 200 || code > 299) return []
      return this.parseDishesArray(storeId, body, categoriesById)
    }, [])
  }

  async fetchDishesByIds(
    storeIdInput: string | null | undefined,
    dishIdsInput: string[]
  ): Promise<DemoDish[]> {
    const storeId = this.requireStoreId(storeIdInput)
    const ids = Array.from(
      new Set(
        dishIdsInput
          .map(id => String(id || '').trim())
          .filter(Boolean)
      )
    )

    if (!ids.length) return []

    const categoriesById = await this.fetchCategoryMap(storeId)
    const inValue = `in.(${ids.map(id => `"${id.replace(/"/g, '\\"')}"`).join(',')})`
    const query = [
      'select=*',
      `store_id=${this.encodeEq(storeId)}`,
      `id=${encodeURIComponent(inValue)}`,
      'order=updated_at.desc.nullslast,name.asc'
    ].join('&')

    const url = this.buildSelectUrl(this.dishesTable(), query)

    return this.executeOnce('fetchDishesByIds', async () => {
      const [code, body] = await this.httpGet(url, storeId)
      if (code < 200 || code > 299) return []
      return this.parseDishesArray(storeId, body, categoriesById)
    }, [])
  }

  async searchDishes(input: {
    storeId?: string | null
    query: string
    limit?: number
  }): Promise<DemoDish[]> {
    const storeId = this.requireStoreId(input.storeId)
    const search = String(input.query || '').trim()
    if (!search) return this.fetchDishesPaged({ storeId, limit: input.limit || SHOWCASE_PAGE_SIZE.homeDishes })

    const categoriesById = await this.fetchCategoryMap(storeId)
    const limit = Math.max(1, Math.min(Number(input.limit || SHOWCASE_PAGE_SIZE.homeDishes), 200))

const orQuery = [
  `name.ilike.*${search}*`,
  `description.ilike.*${search}*`
].join(',')

    const query = [
      'select=*',
      `store_id=${this.encodeEq(storeId)}`,
      `or=(${encodeURIComponent(orQuery)})`,
      'order=updated_at.desc.nullslast',
      `limit=${limit}`
    ].join('&')

    const url = this.buildSelectUrl(this.dishesTable(), query)

    return this.executeOnce('searchDishes', async () => {
      const [code, body] = await this.httpGet(url, storeId)
      if (code < 200 || code > 299) return []
      return this.parseDishesArray(storeId, body, categoriesById)
    }, [])
  }

  async fetchDishesFilteredPage(input: {
    storeId?: string | null
    categoryName?: string | null
    searchQuery?: string | null
    selectedTags?: string[]
    recommendedOnly?: boolean
    onSaleOnly?: boolean
    minPrice?: number | null
    maxPrice?: number | null
    hiddenOnly?: boolean
    includeHidden?: boolean
    sortMode?: string | null
    limit?: number
    offset?: number
  } = {}): Promise<DemoDish[]> {
    const storeId = this.requireStoreId(input.storeId)
    const categoriesById = await this.fetchCategoryMap(storeId)
    const categoryName = String(input.categoryName || '').trim()
    const searchQuery = String(input.searchQuery || '').trim()
    const selectedTags = Array.from(
      new Set(
        (input.selectedTags || [])
          .map(tag => String(tag || '').trim())
          .filter(Boolean)
      )
    )
    const minPrice = input.minPrice == null ? null : Number(input.minPrice)
    const maxPrice = input.maxPrice == null ? null : Number(input.maxPrice)
    const limit = Math.max(1, Math.min(Number(input.limit || SHOWCASE_PAGE_SIZE.homeDishes), 200))
    const offset = Math.max(0, Number(input.offset || 0))
    const categoryId = categoryName
      ? Array.from(categoriesById.values()).find(item => item.name.trim().toLowerCase() === categoryName.toLowerCase())?.id || null
      : null

    const sortMode = String(input.sortMode || '').trim()
    const shouldUseMerchantAuth = Boolean(input.includeHidden || input.hiddenOnly)
    const needsEffectivePricePass = Boolean(
      input.onSaleOnly ||
      minPrice != null ||
      maxPrice != null ||
      sortMode === 'PriceAsc' ||
      sortMode === 'PriceDesc'
    )

    const searchOrQuery = searchQuery
      ? [
          `name.ilike.*${searchQuery}*`
        ].join(',')
      : ''

    const baseQueryParts = [
      'select=*',
      `store_id=${this.encodeEq(storeId)}`,
      input.includeHidden ? '' : `hidden=${this.encodeEq('false')}`,
      input.hiddenOnly ? `hidden=${this.encodeEq('true')}` : '',
      categoryId ? `category_id=${this.encodeEq(categoryId)}` : '',
      input.recommendedOnly ? `recommended=${this.encodeEq('true')}` : '',
      selectedTags.length ? `tags=cs.${this.urlEncode(JSON.stringify(selectedTags))}` : '',
      searchOrQuery ? `or=(${encodeURIComponent(searchOrQuery)})` : ''
    ].filter(Boolean)

    return this.executeOnce('fetchDishesFilteredPage', async () => {
      if (!needsEffectivePricePass) {
        const query = [
          ...baseQueryParts,
          'order=updated_at.desc.nullslast,name.asc',
          `limit=${limit}`,
          `offset=${offset}`
        ].join('&')

        const url = this.buildSelectUrl(this.dishesTable(), query)
        const [code, body] = shouldUseMerchantAuth
          ? await this.httpAuthGet(url, storeId)
          : await this.httpGet(url, storeId)

        if (code < 200 || code > 299) return []

        return this.parseDishesArray(storeId, body, categoriesById)
      }

      const pageSize = 200
      const maxRows = 5000
      const rawRows: Record<string, unknown>[] = []
      let rawOffset = 0

      while (rawOffset < maxRows) {
        const query = [
          ...baseQueryParts,
          'order=updated_at.desc.nullslast,name.asc',
          `limit=${pageSize}`,
          `offset=${rawOffset}`
        ].join('&')

        const url = this.buildSelectUrl(this.dishesTable(), query)
        const [code, body] = shouldUseMerchantAuth
          ? await this.httpAuthGet(url, storeId)
          : await this.httpGet(url, storeId)

        if (code < 200 || code > 299) break

        const rows = this.parseObjectArray(body)
        rawRows.push(...rows)

        if (rows.length < pageSize) break

        rawOffset += rows.length
      }

      const effectivePriceOf = (row: Record<string, unknown>): number => {
        const originalPrice = jsonNumber(row, 'original_price', jsonNumber(row, 'price', 0))
        const discountPrice = jsonNullableNumber(row, 'discount_price')
        const hasValidDiscount = discountPrice != null &&
          Number.isFinite(discountPrice) &&
          discountPrice > 0 &&
          originalPrice > 0 &&
          discountPrice < originalPrice

        return hasValidDiscount ? discountPrice : originalPrice
      }

      const hasRealDiscount = (row: Record<string, unknown>): boolean => {
        const originalPrice = jsonNumber(row, 'original_price', jsonNumber(row, 'price', 0))
        const discountPrice = jsonNullableNumber(row, 'discount_price')

        return discountPrice != null &&
          Number.isFinite(discountPrice) &&
          discountPrice > 0 &&
          originalPrice > 0 &&
          discountPrice < originalPrice
      }

      const filteredRows = rawRows.filter(row => {
        const effectivePrice = effectivePriceOf(row)

        if (input.onSaleOnly && !hasRealDiscount(row)) return false
        if (minPrice != null && Number.isFinite(minPrice) && effectivePrice < minPrice) return false
        if (maxPrice != null && Number.isFinite(maxPrice) && effectivePrice > maxPrice) return false

        return true
      })

      const sortedRows = filteredRows.slice().sort((left, right) => {
        const leftRow: Record<string, unknown> = (left && typeof left === 'object') ? left : {}
        const rightRow: Record<string, unknown> = (right && typeof right === 'object') ? right : {}
        const leftUpdatedAt = String(leftRow['updated_at'] || '')
        const rightUpdatedAt = String(rightRow['updated_at'] || '')

        if (sortMode === 'PriceAsc') {
          const priceDiff = effectivePriceOf(leftRow) - effectivePriceOf(rightRow)
          if (priceDiff !== 0) return priceDiff
        }

        if (sortMode === 'PriceDesc') {
          const priceDiff = effectivePriceOf(rightRow) - effectivePriceOf(leftRow)
          if (priceDiff !== 0) return priceDiff
        }

        const leftUpdatedAtMillis = this.parseIsoMillis(leftUpdatedAt) ?? 0
        const rightUpdatedAtMillis = this.parseIsoMillis(rightUpdatedAt) ?? 0
        const updatedDiff = rightUpdatedAtMillis - leftUpdatedAtMillis

        if (updatedDiff !== 0) return updatedDiff

        return jsonString(leftRow, 'name').localeCompare(jsonString(rightRow, 'name'))
      })

      const pageRows = sortedRows.slice(offset, offset + limit)
      const pageBody = JSON.stringify(pageRows)

      return this.parseDishesArray(storeId, pageBody, categoriesById)
    }, [])
  }

  async fetchDishFilterRows(input: {
    storeId?: string | null
    includeHidden?: boolean
    hiddenOnly?: boolean
    limit?: number
  } = {}): Promise<CloudDishFilterRow[]> {
    const storeId = this.requireStoreId(input.storeId)
    const pageSize = Math.max(1, Math.min(Number(input.limit || 500), 1000))
    const maxRows = 5000
    const shouldUseMerchantAuth = Boolean(input.includeHidden || input.hiddenOnly)

    return this.executeOnce('fetchDishFilterRows', async () => {
      const result: CloudDishFilterRow[] = []
      let offset = 0

      while (offset < maxRows) {
        const query = [
          'select=tags',
          `store_id=${this.encodeEq(storeId)}`,
          input.includeHidden ? '' : `hidden=${this.encodeEq('false')}`,
          input.hiddenOnly ? `hidden=${this.encodeEq('true')}` : '',
          'order=updated_at.desc.nullslast,name.asc',
          `limit=${pageSize}`,
          `offset=${offset}`
        ].filter(Boolean).join('&')

        const url = this.buildSelectUrl(this.dishesTable(), query)
        const [code, body] = shouldUseMerchantAuth
          ? await this.httpAuthGet(url, storeId)
          : await this.httpGet(url, storeId)

        if (code < 200 || code > 299) break

        const rows = this.parseObjectArray(body)

        rows.forEach(row => {
          result.push({
            tags: parseStringArray(row.tags)
          })
        })

        if (rows.length < pageSize) break

        offset += rows.length
      }

      return result
    }, [])
  }

  async getCategoryIdByName(storeIdInput: string | null | undefined, nameInput: string): Promise<string | null> {
    const name = String(nameInput || '').trim()
    if (!name) return null

    const lowerName = name.toLowerCase()
    const categories = await this.fetchCategories(storeIdInput)
    return categories.find(item => item.name.trim().toLowerCase() === lowerName)?.id || null
  }

  async hasAnyDishReferencingCategoryId(storeIdInput: string | null | undefined, categoryIdInput: string): Promise<boolean> {
    const storeId = this.requireStoreId(storeIdInput)
    const categoryId = String(categoryIdInput || '').trim()
    if (!categoryId) return false

    const query = [
      'select=id',
      `store_id=${this.encodeEq(storeId)}`,
      `category_id=${this.encodeEq(categoryId)}`,
      'limit=1'
    ].join('&')

    const url = this.buildSelectUrl(this.dishesTable(), query)

    return this.executeOnce('hasAnyDishReferencingCategoryId', async () => {
      const [code, body] = await this.httpGet(url, storeId)
      if (code < 200 || code > 299) return false
      return this.parseObjectArray(body).length > 0
    }, false)
  }

async ensureCategoryExists(storeIdInput: string | null | undefined, nameInput: string): Promise<CategoryWriteResult> {
  const storeId = this.requireStoreId(storeIdInput)
  const name = String(nameInput || '').trim()

  if (!name) {
    return {
      ok: false,
      errorMessage: 'Add category failed. Category name is blank.',
      errorCode: 0,
      errorBody: null
    }
  }

  const existingId = await this.getCategoryIdByName(storeId, name)
  if (existingId) {
    return {
      ok: true,
      errorMessage: null,
      errorCode: 200,
      errorBody: null
    }
  }

  const categories = await this.fetchCategories(storeId)
  const payload: Record<string, ShowcaseRepositoryJson> = {
    id: createUuidLikeId(),
    store_id: storeId,
    name,
    name_i18n: buildI18nValue({
      default: name
    }),
    sort_order: categories.length + 1
  }

  const url = this.restUrl(this.categoriesTable())
  const [code, body] = await this.httpAuthPost(url, payload, 'return=representation', storeId)
  const ok = code >= 200 && code <= 299

  return {
    ok,
    errorMessage: ok ? null : this.buildCategoryWriteErrorMessage('Add category', code, body),
    errorCode: code,
    errorBody: body
  }
}
async resolveOrCreateCategoryId(storeIdInput: string | null | undefined, categoryNameInput: string | null | undefined): Promise<string | null> {
  const storeId = this.requireStoreId(storeIdInput)
  const categoryName = String(categoryNameInput || '').trim()
  if (!categoryName) return null

  const lowerCategoryName = categoryName.toLowerCase()
  const existing = await this.fetchCategories(storeId)
  const matched = existing.find(item => item.name.trim().toLowerCase() === lowerCategoryName)
  if (matched) return matched.id

  const payload: Record<string, ShowcaseRepositoryJson> = {
    id: createUuidLikeId(),
    store_id: storeId,
    name: categoryName,
    name_i18n: buildI18nValue({
      default: categoryName
    }),
    sort_order: existing.length + 1
  }

  const url = this.restUrl(`${this.categoriesTable()}?select=id,store_id,name,name_i18n,sort_order`)
  const [code, body] = await this.httpAuthPost(url, payload, 'return=representation', storeId)

  if (code < 200 || code > 299) {
    this.lastUpsertCode = code
    this.lastUpsertBody = body
    return null
  }

  const row = this.parseFirstObject(body)
  if (!row) return null

  return jsonString(row, 'id') || null
}

  async replaceDishImages(input: {
    storeId: string
    dishId: string
    imageUrls: string[]
  }): Promise<boolean> {
    const storeId = this.requireStoreId(input.storeId)
    const dishId = String(input.dishId || '').trim()
    if (!dishId) return false

    const deleteUrl = this.restUrl(
      `${this.dishImagesTable()}?store_id=${this.encodeEq(storeId)}&dish_id=${this.encodeEq(dishId)}`
    )
    const [deleteCode, deleteBody] = await this.httpAuthDelete(deleteUrl, storeId)

    if (deleteCode < 200 || deleteCode > 299) {
      this.lastDeleteCode = deleteCode
      this.lastDeleteBody = deleteBody
      return false
    }

    const rows = input.imageUrls
      .map(url => String(url || '').trim())
      .filter(Boolean)
      .map((url, index) => ({
        dish_id: dishId,
        store_id: storeId,
        image_url: url,
        sort_order: index + 1
      }))

    if (!rows.length) return true

    const insertUrl = this.restUrl(this.dishImagesTable())
    const [insertCode, insertBody] = await this.httpAuthPost(insertUrl, rows as unknown as ShowcaseRepositoryJson, 'return=minimal', storeId)

    this.lastDishImageUploadCode = insertCode
    this.lastDishImageUploadBody = insertBody

    return insertCode >= 200 && insertCode <= 299
  }

  async deleteDishImageByUrl(storeIdInput: string | null | undefined, imageUrlInput: string): Promise<boolean> {
    const storeId = this.requireStoreId(storeIdInput)
    const safeStorePathPrefix = `${normalizePathPart(storeId)}/`
    const imageUrl = String(imageUrlInput || '').trim()
    if (!imageUrl) return false

    const marker = '/storage/v1/object/'
    const publicMarker = '/storage/v1/object/public/'
    let objectPart = ''

    if (imageUrl.includes(publicMarker)) {
      objectPart = imageUrl.slice(imageUrl.indexOf(publicMarker) + publicMarker.length)
    } else if (imageUrl.includes(marker)) {
      objectPart = imageUrl.slice(imageUrl.indexOf(marker) + marker.length)
    }

    if (!objectPart) return false

    const parts = objectPart.split('/').filter(Boolean)
    const bucket = parts.shift()
    const objectPath = decodeURIComponent(parts.join('/'))

    if (!bucket || !objectPath) return false

    if (!objectPath.startsWith(safeStorePathPrefix)) {
      this.lastDeleteCode = 403
      this.lastDeleteBody = 'Storage object does not belong to current store.'
      return false
    }

    const url = this.storageObjectUrl(decodeURIComponent(bucket), objectPath)
    const [code, body] = await this.httpAuthDelete(url, storeId)

    this.lastDeleteCode = code
    this.lastDeleteBody = body

    return code >= 200 && code <= 299
  }

  async upsertDishFromDemo(storeIdInput: string | null | undefined, dish: DemoDish): Promise<boolean> {
    const storeId = this.requireStoreId(storeIdInput)
    const categoryId = await this.resolveOrCreateCategoryId(storeId, dish.category || null)
    const payload = this.demoDishToCloudPayload(storeId, dish, categoryId)
    const url = this.restUrl(this.dishesTable())

    let [code, body] = await this.httpAuthPost(url, payload, 'resolution=merge-duplicates,return=representation', storeId)

    if ((code < 200 || code > 299) && isCloudImageVariantSchemaError(body)) {
      const legacyPayload = stripCloudImageVariantColumns(payload)
      const legacyResult = await this.httpAuthPost(url, legacyPayload, 'resolution=merge-duplicates,return=representation', storeId)

      code = legacyResult[0]
      body = legacyResult[1]
    }

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    if (code < 200 || code > 299) return false

    const okImages = await this.replaceDishImages({
      storeId,
      dishId: dish.id,
      imageUrls: dish.imageUrls || []
    })

    return okImages
  }

  async upsertDishSchemeA(input: {
    storeId?: string | null
    dishId?: string | null
    name: string
    description?: string | null
    categoryName?: string | null
    originalPrice: number
    discountPrice?: number | null
    isRecommended?: boolean
    isSoldOut?: boolean
    isHidden?: boolean
    imageUrls?: string[]
    tags?: string[]
    externalLink?: string | null
  }): Promise<string | null> {
    const storeId = this.requireStoreId(input.storeId)
    const dishId = String(input.dishId || '').trim() || createUuidLikeId()
    const categoryId = await this.resolveOrCreateCategoryId(storeId, input.categoryName || null)

    const name = String(input.name || 'Untitled item').trim()
    const description = String(input.description || '').trim()

    const payload: Record<string, ShowcaseRepositoryJson> = {
      id: dishId,
      store_id: storeId,
      name,
      name_i18n: buildI18nValue({
        default: name
      }),
      description,
      description_i18n: buildI18nValue({
        default: description
      }),
      category_id: categoryId,
      price: Number(input.originalPrice || 0),
      discount_price: input.discountPrice == null ? null : Number(input.discountPrice || 0),
      recommended: Boolean(input.isRecommended),
      sold_out: Boolean(input.isSoldOut),
      hidden: Boolean(input.isHidden),
      tags: input.tags || [],
      external_link: input.externalLink || null,
      updated_at: Date.now()
    }

    const url = this.restUrl(this.dishesTable())
    const [code, body] = await this.httpAuthPost(url, payload, 'resolution=merge-duplicates,return=representation', storeId)

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    if (code < 200 || code > 299) return null

    await this.replaceDishImages({
      storeId,
      dishId,
      imageUrls: input.imageUrls || []
    })

    return dishId
  }

  async deleteDishById(storeIdInput: string | null | undefined, dishIdInput: string): Promise<boolean> {
    const storeId = this.requireStoreId(storeIdInput)
    const dishId = String(dishIdInput || '').trim()
    if (!dishId) return false

    const imageDeleteUrl = this.restUrl(
      `${this.dishImagesTable()}?store_id=${this.encodeEq(storeId)}&dish_id=${this.encodeEq(dishId)}`
    )
    await this.httpAuthDelete(imageDeleteUrl, storeId)

    const dishDeleteUrl = this.restUrl(
      `${this.dishesTable()}?store_id=${this.encodeEq(storeId)}&id=${this.encodeEq(dishId)}`
    )
    const [code, body] = await this.httpAuthDelete(dishDeleteUrl, storeId)

    this.lastDeleteCode = code
    this.lastDeleteBody = body

    return code >= 200 && code <= 299
  }

  async deleteCategoryByName(storeIdInput: string | null | undefined, categoryNameInput: string): Promise<CategoryWriteResult> {
    const storeId = this.requireStoreId(storeIdInput)
    const categoryName = String(categoryNameInput || '').trim()

    if (!categoryName) {
      return {
        ok: false,
        errorMessage: 'Category name is required.',
        errorCode: 0,
        errorBody: null
      }
    }

    const categoryId = await this.getCategoryIdByName(storeId, categoryName)

    if (!categoryId) {
      return {
        ok: true,
        errorMessage: null,
        errorCode: 200,
        errorBody: null
      }
    }

    const url = this.restUrl(
      `${this.categoriesTable()}?store_id=${this.encodeEq(storeId)}&id=${this.encodeEq(categoryId)}`
    )

    const [code, body] = await this.httpAuthDelete(url, storeId)

    const ok = code >= 200 && code <= 299

    return {
      ok,
      errorMessage: ok ? null : this.buildCategoryWriteErrorMessage('Delete category', code, body),
      errorCode: code,
      errorBody: body
    }
  }

async renameCategoryById(input: {
  storeId: string
  categoryId: string
  newName: string
}): Promise<CategoryWriteResult> {
  const storeId = this.requireStoreId(input.storeId)
  const categoryId = String(input.categoryId || '').trim()
  const newName = String(input.newName || '').trim()

  if (!storeId || !categoryId || !newName) {
    return {
      ok: false,
      errorMessage: 'Category store id, id, and name are required.',
      errorCode: 0,
      errorBody: null
    }
  }

  const url = this.restUrl(
    `${this.categoriesTable()}?id=${this.encodeEq(categoryId)}&store_id=${this.encodeEq(storeId)}`
  )

  const [code, body] = await this.httpAuthPatch(url, {
    name: newName,
    name_i18n: buildI18nValue({
      default: newName
    })
  }, 'return=representation', storeId)

  const ok = code >= 200 && code <= 299

  return {
    ok,
    errorMessage: ok ? null : this.buildCategoryWriteErrorMessage('Rename category', code, body),
    errorCode: code,
    errorBody: body
  }
}

  async setCategorySortOrder(input: {
    storeId: string
    categoryId: string
    sortOrder: number
  }): Promise<CategoryWriteResult> {
    const storeId = this.requireStoreId(input.storeId)
    const categoryId = String(input.categoryId || '').trim()
    const sortOrder = Number(input.sortOrder || 0)

    if (!storeId || !categoryId || !Number.isFinite(sortOrder)) {
      return {
        ok: false,
        errorMessage: 'Category store id, id, and sort order are required.',
        errorCode: 0,
        errorBody: null
      }
    }

    const url = this.restUrl(
      `${this.categoriesTable()}?id=${this.encodeEq(categoryId)}&store_id=${this.encodeEq(storeId)}`
    )

    const [code, body] = await this.httpAuthPatch(url, {
      sort_order: sortOrder
    }, 'return=representation', storeId)

    const ok = code >= 200 && code <= 299

    return {
      ok,
      errorMessage: ok ? null : this.buildCategoryWriteErrorMessage('Update category order', code, body),
      errorCode: code,
      errorBody: body
    }
  }

  async uploadDishImageBytes(input: UploadBytesInput): Promise<string | null> {
    const path = this.buildStorageUploadPath(input)
    const bucket = this.dishImagesBucket()
    const url = this.storageObjectUrl(bucket, path)

    const [code, body] = await this.httpAuthPutBytes(
      url,
      input.bytes,
      input.contentType,
      input.storeId
    )

    this.lastDishImageUploadCode = code
    this.lastDishImageUploadBody = body

    if (code < 200 || code > 299) return null

    return this.buildStoragePublicObjectUrl(bucket, path)
  }

  async uploadStoreImageBytes(input: UploadBytesInput): Promise<string | null> {
    const path = this.buildStorageUploadPath(input)
    const bucket = this.storeImagesBucket()
    const url = this.storageObjectUrl(bucket, path)

    const [code, body] = await this.httpAuthPutBytes(
      url,
      input.bytes,
      input.contentType,
      input.storeId
    )

    this.lastStoreImageUploadCode = code
    this.lastStoreImageUploadBody = body

    if (code < 200 || code > 299) return null

    return this.buildStoragePublicObjectUrl(bucket, path)
  }

  async fetchStoreProfile(storeIdInput?: string | null): Promise<CloudStoreProfile | null> {
    const storeId = this.requireStoreId(storeIdInput)
    const query = [
      'select=*',
      `store_id=${this.encodeEq(storeId)}`,
      'limit=1'
    ].join('&')

    const url = this.buildSelectUrl(this.storeProfileTable(), query)

    return this.executeOnce('fetchStoreProfile', async () => {
      const [code, body] = await this.httpGet(url, storeId)
      if (code < 200 || code > 299) return null

      const row = this.parseFirstObject(body)
      if (!row) return null

      return this.parseStoreProfile(row, storeId)
    }, null)
  }

  async fetchStorePwaProfile(storeIdInput?: string | null): Promise<CloudStorePwaProfile | null> {
    const storeId = this.requireStoreId(storeIdInput)
    const query = [
      'select=store_id,app_name,short_name,description,notification_icon_url,icon_192_url,icon_512_url,maskable_192_url,maskable_512_url,apple_touch_icon_url,theme_color,background_color,updated_at',
      `store_id=${this.encodeEq(storeId)}`,
      'limit=1'
    ].join('&')

    const url = this.buildSelectUrl(this.storePwaProfileTable(), query)

    return this.executeOnce('fetchStorePwaProfile', async () => {
      const [code, body] = await this.httpGet(url, storeId)
      if (code < 200 || code > 299) return null

      const row = this.parseFirstObject(body)
      if (!row) return null

      return this.parseStorePwaProfile(row, storeId)
    }, null)
  }

  async upsertStoreProfile(profileInput: CloudStoreProfile): Promise<boolean> {
    const storeId = this.requireStoreId(profileInput.storeId)
    const profile: CloudStoreProfile = {
      ...profileInput,
      storeId
    }

    const table = this.storeProfileTable()
    const payload = this.storeProfilePayload(profile)

    const checkQuery = [
      'select=store_id',
      `store_id=${this.encodeEq(storeId)}`,
      'limit=1'
    ].join('&')

    const checkUrl = this.buildSelectUrl(table, checkQuery)
    const [checkCode, checkBody] = await this.httpAuthGet(checkUrl, storeId)

    const exists = checkCode >= 200 &&
      checkCode <= 299 &&
      this.parseObjectArray(checkBody).length > 0

    let code = 0
    let body: string | null = null

    if (exists) {
      const patchUrl = this.restUrl(`${table}?store_id=${this.encodeEq(storeId)}`)
      const result = await this.httpAuthPatch(
        patchUrl,
        payload,
        'return=representation',
        storeId
      )

      code = result[0]
      body = result[1]
    } else {
      const postUrl = this.restUrl(table)
      const result = await this.httpAuthPost(
        postUrl,
        payload,
        'return=representation',
        storeId
      )

      code = result[0]
      body = result[1]

      if (
        code === 409 ||
        body?.includes('duplicate key value violates unique constraint') ||
        body?.includes('uq_store_profiles_store_id')
      ) {
        const patchUrl = this.restUrl(`${table}?store_id=${this.encodeEq(storeId)}`)
        const retryResult = await this.httpAuthPatch(
          patchUrl,
          payload,
          'return=representation',
          storeId
        )

        code = retryResult[0]
        body = retryResult[1]
      }
    }

    if ((code < 200 || code > 299) && isCloudImageVariantSchemaError(body)) {
      const legacyPayload = stripCloudImageVariantColumns(payload)

      if (exists) {
        const patchUrl = this.restUrl(`${table}?store_id=${this.encodeEq(storeId)}`)
        const legacyResult = await this.httpAuthPatch(
          patchUrl,
          legacyPayload,
          'return=representation',
          storeId
        )

        code = legacyResult[0]
        body = legacyResult[1]
      } else {
        const postUrl = this.restUrl(table)
        const legacyResult = await this.httpAuthPost(
          postUrl,
          legacyPayload,
          'return=representation',
          storeId
        )

        code = legacyResult[0]
        body = legacyResult[1]

        if (
          code === 409 ||
          body?.includes('duplicate key value violates unique constraint') ||
          body?.includes('uq_store_profiles_store_id')
        ) {
          const patchUrl = this.restUrl(`${table}?store_id=${this.encodeEq(storeId)}`)
          const retryResult = await this.httpAuthPatch(
            patchUrl,
            legacyPayload,
            'return=representation',
            storeId
          )

          code = retryResult[0]
          body = retryResult[1]
        }
      }
    }

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    return code >= 200 && code <= 299
  }
  private parseAppointmentSettings(raw: Record<string, unknown>, storeIdFallback: string): CloudAppointmentSettings {
    return {
      storeId: jsonString(raw, 'store_id', storeIdFallback),
      enabled: jsonBoolean(raw, 'enabled', true),
      bookingWindowDays: jsonNumber(raw, 'booking_window_days', 7),
      availableStartTime: jsonString(raw, 'available_start_time', '09:00'),
      availableEndTime: jsonString(raw, 'available_end_time', '18:00'),
      slotIntervalMinutes: jsonNumber(raw, 'slot_interval_minutes', 30),
      closedDays: this.parseStringArray(raw.closed_days),
      minimumNotice: jsonString(raw, 'minimum_notice', 'No notice'),
      updatedAt: this.parseIsoMillis(raw.updated_at)
    }
  }

  private appointmentSettingsPayload(settings: CloudAppointmentSettings): Record<string, ShowcaseRepositoryJson> {
    return {
      store_id: settings.storeId,
      enabled: settings.enabled,
      booking_window_days: settings.bookingWindowDays,
      available_start_time: settings.availableStartTime,
      available_end_time: settings.availableEndTime,
      slot_interval_minutes: settings.slotIntervalMinutes,
      closed_days: settings.closedDays,
      minimum_notice: settings.minimumNotice,
      updated_at: new Date().toISOString()
    }
  }

  private parseAppointmentRequest(raw: Record<string, unknown>, storeIdFallback: string): CloudAppointmentRequest {
    return {
      id: jsonString(raw, 'id'),
      storeId: jsonString(raw, 'store_id', storeIdFallback),
      clientId: jsonString(raw, 'client_id'),
      customerName: jsonString(raw, 'customer_name'),
      customerContact: jsonString(raw, 'customer_contact'),
      serviceTitle: jsonString(raw, 'service_title'),
      preferredDate: jsonString(raw, 'preferred_date'),
      preferredTime: jsonString(raw, 'preferred_time'),
      note: jsonString(raw, 'note'),
      sourceDishId: jsonNullableString(raw, 'source_dish_id'),
      sourcePriceSnapshot: jsonNullableString(raw, 'source_price_snapshot'),
      sourceImageUrlSnapshot: jsonNullableString(raw, 'source_image_url_snapshot'),
      sourceCategorySnapshot: jsonNullableString(raw, 'source_category_snapshot'),
      sourceRecommendedSnapshot: Boolean(raw.source_recommended_snapshot),
      status: jsonString(raw, 'status', 'Pending'),
      cancelledBy: jsonNullableString(raw, 'cancelled_by'),
      cancelledAt: this.parseIsoMillis(raw.cancelled_at),
      createdAt: this.parseIsoMillis(raw.created_at)
    }
  }

  private appointmentRequestPayload(input: {
    storeId: string
    clientId: string
    customerName: string
    customerContact: string
    serviceTitle: string
    preferredDate: string
    preferredTime: string
    note?: string | null
    sourceDishId?: string | null
    sourcePriceSnapshot?: string | null
    sourceImageUrlSnapshot?: string | null
    sourceCategorySnapshot?: string | null
    sourceRecommendedSnapshot?: boolean | null
    status?: string | null
  }): Record<string, ShowcaseRepositoryJson> {
    return {
      store_id: input.storeId,
      client_id: String(input.clientId || '').trim(),
      customer_name: String(input.customerName || ''),
      customer_contact: String(input.customerContact || ''),
      service_title: String(input.serviceTitle || ''),
      preferred_date: String(input.preferredDate || ''),
      preferred_time: String(input.preferredTime || ''),
      note: String(input.note || ''),
      source_dish_id: input.sourceDishId ? String(input.sourceDishId) : null,
      source_price_snapshot: input.sourcePriceSnapshot ? String(input.sourcePriceSnapshot) : null,
      source_image_url_snapshot: input.sourceImageUrlSnapshot ? String(input.sourceImageUrlSnapshot) : null,
      source_category_snapshot: input.sourceCategorySnapshot ? String(input.sourceCategorySnapshot) : null,
      source_recommended_snapshot: Boolean(input.sourceRecommendedSnapshot),
      status: String(input.status || 'pending').trim().toLowerCase()
    }
  }

  async fetchAppointmentSettings(storeIdInput?: string | null): Promise<CloudAppointmentSettings | null> {
    const storeId = this.requireStoreId(storeIdInput)
    const query = [
      'select=*',
      `store_id=${this.encodeEq(storeId)}`,
      'limit=1'
    ].join('&')

    const url = this.buildSelectUrl(this.appointmentSettingsTable(), query)

    return this.executeOnce('fetchAppointmentSettings', async () => {
      const [code, body] = await this.httpGet(url, storeId)
      if (code < 200 || code > 299) return null

      const row = this.parseFirstObject(body)
      if (!row) return null

      return this.parseAppointmentSettings(row, storeId)
    }, null)
  }

  async upsertAppointmentSettings(settingsInput: CloudAppointmentSettings): Promise<boolean> {
    const storeId = this.requireStoreId(settingsInput.storeId)
    const settings: CloudAppointmentSettings = {
      ...settingsInput,
      storeId
    }

    const url = this.restUrl(this.appointmentSettingsTable())
    const [code, body] = await this.httpAuthPost(
      url,
      this.appointmentSettingsPayload(settings),
      'resolution=merge-duplicates,return=representation',
      storeId
    )

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    return code >= 200 && code <= 299
  }

  async submitAppointmentRequest(input: {
    storeId?: string | null
    clientId: string
    customerName: string
    customerContact: string
    serviceTitle: string
    preferredDate: string
    preferredTime: string
    note?: string | null
    sourceDishId?: string | null
    sourcePriceSnapshot?: string | null
    sourceImageUrlSnapshot?: string | null
    sourceCategorySnapshot?: string | null
    sourceRecommendedSnapshot?: boolean | null
  }): Promise<CloudAppointmentRequest | null> {
    const storeId = this.requireStoreId(input.storeId)
    const clientId = String(input.clientId || '').trim()

    if (!clientId) return null

    const payload = this.appointmentRequestPayload({
      storeId,
      clientId,
      customerName: input.customerName,
      customerContact: input.customerContact,
      serviceTitle: input.serviceTitle,
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime,
      note: input.note || '',
      sourceDishId: input.sourceDishId || null,
      sourcePriceSnapshot: input.sourcePriceSnapshot || null,
      sourceImageUrlSnapshot: input.sourceImageUrlSnapshot || null,
      sourceCategorySnapshot: input.sourceCategorySnapshot || null,
      sourceRecommendedSnapshot: Boolean(input.sourceRecommendedSnapshot),
      status: 'pending'
    })

    const url = this.restUrl(this.appointmentRequestsTable())
    const [code, body] = await this.httpPost(
      url,
      payload,
      'return=representation',
      storeId,
      clientId
    )

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    if (code < 200 || code > 299) return null

    const row = this.parseFirstObject(body)
    if (!row) return null

    return this.parseAppointmentRequest(row, storeId)
  }

  async fetchAppointmentRequests(input: {
    storeId?: string | null
    clientId?: string | null
    status?: string | null
    cancelledBy?: string | null
    merchant?: boolean
    preferredDate?: string | null
    preferredDateGte?: string | null
    preferredDateLt?: string | null
    serviceTitle?: string | null
    limit?: number
    offset?: number
  } = {}): Promise<CloudAppointmentRequest[]> {
    const storeId = this.requireStoreId(input.storeId)
    const clientId = String(input.clientId || '').trim()
    const status = String(input.status || '').trim()
    const cancelledBy = String(input.cancelledBy || '').trim()
    const merchant = Boolean(input.merchant)
    const preferredDate = String(input.preferredDate || '').trim()
    const preferredDateGte = String(input.preferredDateGte || '').trim()
    const preferredDateLt = String(input.preferredDateLt || '').trim()
    const serviceTitle = String(input.serviceTitle || '').trim()
    const defaultLimit = merchant
      ? SHOWCASE_PAGE_SIZE.merchantAppointments
      : SHOWCASE_PAGE_SIZE.clientAppointments
    const limit = Math.max(1, Math.min(Number(input.limit || defaultLimit), 200))
    const offset = Math.max(0, Number(input.offset || 0))

    const query = [
      'select=id,store_id,client_id,customer_name,customer_contact,service_title,preferred_date,preferred_time,note,source_dish_id,source_price_snapshot,source_image_url_snapshot,source_category_snapshot,source_recommended_snapshot,status,cancelled_by,cancelled_at,created_at',
      `store_id=${this.encodeEq(storeId)}`,
      clientId ? `client_id=${this.encodeEq(clientId)}` : '',
      status ? `status=${this.encodeEq(status)}` : '',
      cancelledBy ? `cancelled_by=${this.encodeEq(cancelledBy)}` : '',
      preferredDate ? `preferred_date=${this.encodeEq(preferredDate)}` : '',
      preferredDateGte ? `preferred_date=gte.${this.urlEncode(preferredDateGte)}` : '',
      preferredDateLt ? `preferred_date=lt.${this.urlEncode(preferredDateLt)}` : '',
      serviceTitle ? `service_title=${this.encodeEq(serviceTitle)}` : '',
      'order=created_at.desc',
      `limit=${limit}`,
      `offset=${offset}`
    ].filter(Boolean).join('&')

    const url = this.buildSelectUrl(this.appointmentRequestsTable(), query)

    return this.executeOnce(merchant ? 'fetchAppointmentRequestsForMerchant' : 'fetchAppointmentRequestsForClient', async () => {
      const [code, body] = merchant
        ? await this.httpAuthGet(url, storeId)
        : await this.httpGet(url, storeId, clientId || null)

      if (code < 200 || code > 299) return []

      return this.parseObjectArray(body).map(row => this.parseAppointmentRequest(row, storeId))
    }, [])
  }

  async fetchAppointmentFilterRows(input: {
    storeId?: string | null
    clientId?: string | null
    merchant?: boolean
    limit?: number
  } = {}): Promise<CloudAppointmentFilterRow[]> {
    const storeId = this.requireStoreId(input.storeId)
    const clientId = String(input.clientId || '').trim()
    const merchant = Boolean(input.merchant)

    if (!merchant && !clientId) return []

    const pageSize = Math.max(1, Math.min(Number(input.limit || 500), 1000))
    const maxRows = 5000

    return this.executeOnce(merchant ? 'fetchAppointmentFilterRowsForMerchant' : 'fetchAppointmentFilterRowsForClient', async () => {
      const result: CloudAppointmentFilterRow[] = []
      let offset = 0

      while (offset < maxRows) {
        const query = [
          'select=preferred_date,service_title,status,cancelled_by',
          `store_id=${this.encodeEq(storeId)}`,
          !merchant && clientId ? `client_id=${this.encodeEq(clientId)}` : '',
          'order=created_at.desc',
          `limit=${pageSize}`,
          `offset=${offset}`
        ].filter(Boolean).join('&')

        const url = this.buildSelectUrl(this.appointmentRequestsTable(), query)

        const [code, body] = merchant
          ? await this.httpAuthGet(url, storeId)
          : await this.httpGet(url, storeId, clientId)

        if (code < 200 || code > 299) break

        const rows = this.parseObjectArray(body)

        rows.forEach(row => {
          result.push({
            preferredDate: jsonString(row, 'preferred_date'),
            serviceTitle: jsonString(row, 'service_title'),
            status: jsonString(row, 'status', 'pending'),
            cancelledBy: jsonNullableString(row, 'cancelled_by')
          })
        })

        if (rows.length < pageSize) break

        offset += rows.length
      }

      return result
    }, [])
  }

  async fetchAppointmentRequestsForMerchant(storeIdInput?: string | null): Promise<CloudAppointmentRequest[]> {
    return this.fetchAppointmentRequests({
      storeId: storeIdInput,
      merchant: true,
      limit: SHOWCASE_PAGE_SIZE.merchantAppointments,
      offset: 0
    })
  }

  async fetchAppointmentRequestsForClient(
    storeIdInput: string | null | undefined,
    clientIdInput: string
  ): Promise<CloudAppointmentRequest[]> {
    const clientId = String(clientIdInput || '').trim()
    if (!clientId) return []

    return this.fetchAppointmentRequests({
      storeId: storeIdInput,
      clientId,
      merchant: false,
      limit: SHOWCASE_PAGE_SIZE.clientAppointments,
      offset: 0
    })
  }

async updateAppointmentStatus(input: {
  storeId?: string | null
  appointmentId: string
  status: string
}): Promise<boolean> {
  const storeId = this.requireStoreId(input.storeId)
  const appointmentId = String(input.appointmentId || '').trim()
  const status = String(input.status || '').trim().toLowerCase()

  if (!appointmentId || !status) return false

  const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no_show']

  if (!allowedStatuses.includes(status)) return false

  const query = [
    `id=${this.encodeEq(appointmentId)}`,
    `store_id=${this.encodeEq(storeId)}`
  ].join('&')

  const nowIso = new Date().toISOString()
  const payload: Record<string, ShowcaseRepositoryJson> = {
    status,
    cancelled_by: status === 'cancelled' ? 'merchant' : null,
    cancelled_at: status === 'cancelled' ? nowIso : null
  }

  const url = this.restUrl(`${this.appointmentRequestsTable()}?${query}`)
  const [code, body] = await this.httpAuthPatch(url, payload, 'return=representation', storeId)

  this.lastUpsertCode = code
  this.lastUpsertBody = body

  return code >= 200 && code <= 299
}

async cancelAppointmentByCustomer(input: {
  storeId?: string | null
  appointmentId: string
  clientId: string
}): Promise<boolean> {
  const storeId = this.requireStoreId(input.storeId)
  const appointmentId = String(input.appointmentId || '').trim()
  const clientId = String(input.clientId || '').trim()

  if (!appointmentId || !clientId) return false

  const query = [
    `id=${this.encodeEq(appointmentId)}`,
    `store_id=${this.encodeEq(storeId)}`,
    `client_id=${this.encodeEq(clientId)}`,
    'status=in.(pending,confirmed)'
  ].join('&')

  const url = this.restUrl(`${this.appointmentRequestsTable()}?${query}`)
  const [code, body] = await this.httpPatch(url, {
    status: 'cancelled',
    cancelled_by: 'customer',
    cancelled_at: new Date().toISOString()
  }, 'return=representation', storeId, clientId)

  this.lastUpsertCode = code
  this.lastUpsertBody = body

  if (code < 200 || code > 299) return false

  const updatedRow = this.parseFirstObject(body)
  const updatedId = String(updatedRow?.id || '').trim()
  const updatedStatus = String(updatedRow?.status || '').trim().toLowerCase()
  const updatedCancelledBy = String(updatedRow?.cancelled_by || '').trim().toLowerCase()

  return updatedId === appointmentId &&
    updatedStatus === 'cancelled' &&
    updatedCancelledBy === 'customer'
}

private parseAnnouncement(raw: Record<string, unknown>, storeIdFallback: string): CloudAnnouncement {
  const bodyFallback = jsonString(raw, 'body')
  const bodyI18n = jsonRecord(raw, 'body_i18n')
  const body = pickI18nText(bodyI18n, bodyFallback)

  return {
    id: jsonString(raw, 'id'),
    storeId: jsonString(raw, 'store_id', storeIdFallback),
    coverUrl: jsonNullableString(raw, 'cover_url'),
    coverImageVariants: parseCloudImageVariants(raw.cover_image_variants),
    body,
    status: jsonString(raw, 'status', 'draft'),
    updatedAt: this.parseIsoMillis(raw.updated_at),
    createdAt: this.parseIsoMillis(raw.created_at),
    viewCount: jsonNumber(raw, 'view_count', 0)
  }
}

private announcementPayload(input: {
  id?: string | null
  storeId: string
  coverUrl?: string | null
  coverImageVariants?: ShowcaseImageVariants | null
  body: string
  status: string
  updatedAt?: number | null
  viewCount?: number | null
}): Record<string, ShowcaseRepositoryJson> {
  const body = String(input.body || '').trim()

  const payload: Record<string, ShowcaseRepositoryJson> = {
    store_id: input.storeId,
    cover_url: input.coverUrl || null,
    cover_image_variants: input.coverImageVariants || null,
    title: null,
    title_i18n: buildI18nValue({}),
    body,
    body_i18n: buildI18nValue({
      default: body
    }),
    status: input.status,
    view_count: Number(input.viewCount || 0),
    updated_at: formatIsoUtcMillis(input.updatedAt) || new Date().toISOString()
  }

  if (input.id) {
    payload.id = input.id
  }

  return payload
}

  async fetchAnnouncements(input: {
    storeId?: string | null
    includeDrafts?: boolean
    limit?: number
    offset?: number
  } = {}): Promise<CloudAnnouncement[]> {
    const storeId = this.requireStoreId(input.storeId)
    const defaultLimit = input.includeDrafts
      ? SHOWCASE_PAGE_SIZE.adminAnnouncements
      : SHOWCASE_PAGE_SIZE.publicAnnouncements
    const limit = Math.max(1, Math.min(Number(input.limit || defaultLimit), 300))
    const offset = Math.max(0, Number(input.offset || 0))

const query = [
  'select=id,store_id,cover_url,cover_image_variants,title,title_i18n,body,body_i18n,status,updated_at,created_at,view_count',
  `store_id=${this.encodeEq(storeId)}`,
  input.includeDrafts ? '' : `status=${encodeURIComponent('eq.published')}`,
  'order=updated_at.desc',
  `limit=${limit}`,
  `offset=${offset}`
].filter(Boolean).join('&')

const legacyQuery = [
  'select=id,store_id,cover_url,title,title_i18n,body,body_i18n,status,updated_at,created_at,view_count',
  `store_id=${this.encodeEq(storeId)}`,
  input.includeDrafts ? '' : `status=${encodeURIComponent('eq.published')}`,
  'order=updated_at.desc',
  `limit=${limit}`,
  `offset=${offset}`
].filter(Boolean).join('&')

    const url = this.buildSelectUrl(this.announcementsTable(), query)
    const legacyUrl = this.buildSelectUrl(this.announcementsTable(), legacyQuery)

    return this.executeOnce('fetchAnnouncements', async () => {
      let [code, body] = input.includeDrafts
        ? await this.httpAuthGet(url, storeId)
        : await this.httpGet(url, storeId)

      if ((code < 200 || code > 299) && isCloudImageVariantSchemaError(body)) {
        const legacyResult = input.includeDrafts
          ? await this.httpAuthGet(legacyUrl, storeId)
          : await this.httpGet(legacyUrl, storeId)

        code = legacyResult[0]
        body = legacyResult[1]
      }

      if (code < 200 || code > 299) return []

      return this.parseObjectArray(body).map(row => this.parseAnnouncement(row, storeId))
    }, [])
  }

  async upsertAnnouncement(input: {
    id?: string | null
    storeId?: string | null
    coverUrl?: string | null
    coverImageVariants?: ShowcaseImageVariants | null
    body: string
    status: string
    updatedAt?: number | null
    viewCount?: number | null
  }): Promise<CloudAnnouncement | null> {
    const storeId = this.requireStoreId(input.storeId)
    const payload = this.announcementPayload({
      id: input.id || null,
      storeId,
      coverUrl: input.coverUrl || null,
      coverImageVariants: input.coverImageVariants || null,
      body: input.body,
      status: input.status,
      updatedAt: input.updatedAt || null,
      viewCount: input.viewCount || 0
    })

    const rows = [payload]
    const rawPayload: Record<string, ShowcaseRepositoryJson> = {
      __raw_array__: JSON.stringify(rows)
    }

    const url = this.restUrl(`${this.announcementsTable()}?on_conflict=store_id,id&select=*`)
    let [code, body] = await this.httpAuthPost(
      url,
      rawPayload,
      'resolution=merge-duplicates,return=representation',
      storeId
    )

    if ((code < 200 || code > 299) && isCloudImageVariantSchemaError(body)) {
      const legacyRows = [stripCloudImageVariantColumns(payload)]
      const legacyPayload: Record<string, ShowcaseRepositoryJson> = {
        __raw_array__: JSON.stringify(legacyRows)
      }

      const legacyResult = await this.httpAuthPost(
        url,
        legacyPayload,
        'resolution=merge-duplicates,return=representation',
        storeId
      )

      code = legacyResult[0]
      body = legacyResult[1]
    }

    this.lastAnnouncementUpsertCode = code
    this.lastAnnouncementUpsertBody = body

    if (code < 200 || code > 299) return null

    const row = this.parseFirstObject(body)
    if (!row) return null

    return this.parseAnnouncement(row, storeId)
  }

  async deleteAnnouncement(storeIdInput: string | null | undefined, idInput: string): Promise<boolean> {
    const storeId = this.requireStoreId(storeIdInput)
    const id = String(idInput || '').trim()
    if (!id) return false

    const url = this.restUrl(
      `${this.announcementsTable()}?store_id=${this.encodeEq(storeId)}&id=${this.encodeEq(id)}&status=${this.encodeEq('draft')}`
    )
    const [code, body] = await this.httpAuthDelete(url, storeId)

    this.lastDeleteCode = code
    this.lastDeleteBody = body

    return code >= 200 && code <= 299
  }

  async deleteAnnouncements(storeIdInput: string | null | undefined, idsInput: string[]): Promise<boolean> {
    const storeId = this.requireStoreId(storeIdInput)
    const ids = idsInput.map(id => String(id || '').trim()).filter(Boolean)

    if (!ids.length) return true

    const inValue = `in.(${ids.map(id => `"${id.replace(/"/g, '\\"')}"`).join(',')})`
    const url = this.restUrl(
      `${this.announcementsTable()}?store_id=${this.encodeEq(storeId)}&status=${this.encodeEq('draft')}&id=${encodeURIComponent(inValue)}`
    )

    const [code, body] = await this.httpAuthDelete(url, storeId)

    this.lastDeleteCode = code
    this.lastDeleteBody = body

    return code >= 200 && code <= 299
  }

  async incrementAnnouncementViewCount(input: {
    storeId?: string | null
    announcementId: string
  }): Promise<boolean> {
    const storeId = this.requireStoreId(input.storeId)
    const announcementId = String(input.announcementId || '').trim()

    if (!announcementId) return false

    const url = this.restUrl('rpc/ndjc_inc_announcement_view_count')
    const payload: Record<string, ShowcaseRepositoryJson> = {
      p_store_id: storeId,
      p_announcement_id: announcementId
    }

    const [code, body] = await this.httpPost(
      url,
      payload,
      'return=minimal',
      storeId
    )

    this.lastAnnouncementUpsertCode = code
    this.lastAnnouncementUpsertBody = body

    return code >= 200 && code <= 299
  }

  async uploadAnnouncementImageBytes(input: UploadBytesInput): Promise<string | null> {
    const safeStoreId = normalizePathPart(this.requireStoreId(input.storeId))
    const cleanFileName = normalizePathPart(input.fileName || `${createUuidLikeId()}.bin`)
    const path = `${safeStoreId}/${cleanFileName}`
    const bucket = this.announcementImagesBucket()
    const url = this.storageObjectUrl(bucket, path)

    const [code, body] = await this.httpAuthPutBytes(
      url,
      input.bytes,
      input.contentType,
      input.storeId
    )

    this.lastAnnouncementUpsertCode = code
    this.lastAnnouncementUpsertBody = body

    if (code < 200 || code > 299) return null

    return this.buildStoragePublicObjectUrl(bucket, path)
  }

  private parseChatConversation(raw: Record<string, unknown>, storeIdFallback: string): ChatConversation {
    const customerSeq = jsonNumber(raw, 'customer_seq', 0)

    return {
      id: jsonString(raw, 'conversation_id', jsonString(raw, 'id')),
      storeId: jsonString(raw, 'store_id', storeIdFallback),
      clientId: jsonNullableString(raw, 'client_id'),
      merchantAuthUserId: jsonNullableString(raw, 'merchant_auth_user_id'),
      customerName: jsonNullableString(raw, 'customer_name'),
      customerContact: jsonNullableString(raw, 'customer_contact'),
      customerSeq: customerSeq > 0 ? customerSeq : null,
      createdAt: this.parseIsoMillis(raw.created_at),
      updatedAt: this.parseIsoMillis(raw.updated_at)
    }
  }
  private parseChatMessage(raw: Record<string, unknown>, storeIdFallback: string): ChatMessage {
    return {
      id: jsonString(raw, 'id'),
      storeId: jsonString(raw, 'store_id', storeIdFallback),
      conversationId: jsonString(raw, 'conversation_id'),
      senderRole: jsonString(raw, 'sender_role'),
      senderId: jsonNullableString(raw, 'sender_id'),
      body: jsonString(raw, 'body'),
      imageUrls: this.parseStringArray(raw.image_urls),
      productDishId: jsonNullableString(raw, 'product_dish_id'),
      quotedMessageId: jsonNullableString(raw, 'quoted_message_id'),
      createdAt: this.parseIsoMillis(raw.created_at),
      readAt: this.parseIsoMillis(raw.read_at)
    }
  }

  private parseChatThreadSummary(raw: Record<string, unknown>, storeIdFallback: string): ChatThreadSummary {
    const customerSeq = jsonNumber(raw, 'customer_seq', 0)

    return {
      conversationId: jsonString(raw, 'conversation_id', jsonString(raw, 'id')),
      storeId: jsonString(raw, 'store_id', storeIdFallback),
      clientId: jsonNullableString(raw, 'client_id'),
      title: jsonString(raw, 'title', jsonString(raw, 'customer_name', 'Customer')),
      lastMessage: jsonString(raw, 'last_message'),
      lastMessageAt: this.parseIsoMillis(raw.last_message_at || raw.updated_at),
      unreadCount: jsonNumber(raw, 'unread_count', 0),
      pinned: jsonBoolean(raw, 'pinned', false),
      customerSeq: customerSeq > 0 ? Math.trunc(customerSeq) : null
    }
  }
    buildConversationId(storeIdInput: string, clientIdInput: string): string {
    const storeId = String(storeIdInput || '').trim()
    const clientId = String(clientIdInput || '').trim()
    return `cloud:${storeId}:${clientId}`
  }

  async upsertChatConversation(
    conversationIdInput: string,
    storeIdInput: string,
    clientIdInput: string
  ): Promise<boolean> {
    const conversationId = String(conversationIdInput || '').trim()
    const storeId = this.requireStoreId(storeIdInput)
    const clientId = String(clientIdInput || '').trim()

    if (!conversationId || !storeId || !clientId) return false

    const rows = [
      {
        conversation_id: conversationId,
        store_id: storeId,
        client_id: clientId,
        updated_at: new Date().toISOString()
      }
    ]

    const payload: Record<string, ShowcaseRepositoryJson> = {
      __raw_array__: JSON.stringify(rows)
    }

    const url = this.restUrl(`${this.chatConversationsTable()}?on_conflict=store_id,conversation_id`)
    const [code, body] = await this.httpPost(
      url,
      payload,
      'resolution=merge-duplicates,return=minimal',
      storeId,
      clientId
    )

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    return code >= 200 && code <= 299
  }

  async findChatConversation(input: {
    storeId?: string | null
    clientId: string
  }): Promise<ChatConversation | null> {
    const storeId = this.requireStoreId(input.storeId)
    const clientId = String(input.clientId || '').trim()
    const conversationId = this.buildConversationId(storeId, clientId)

    if (!clientId || !conversationId) return null

    const query = [
      'select=*',
      `conversation_id=${this.encodeEq(conversationId)}`,
      `store_id=${this.encodeEq(storeId)}`,
      `client_id=${this.encodeEq(clientId)}`,
      'limit=1'
    ].join('&')

    const existingUrl = this.buildSelectUrl(this.chatConversationsTable(), query)
    const [existingCode, existingBody] = await this.httpGet(existingUrl, storeId, clientId)

    if (existingCode < 200 || existingCode > 299) return null

    const row = this.parseFirstObject(existingBody)
    if (!row) return null

    return this.parseChatConversation(row, storeId)
  }

  async findOrCreateChatConversation(input: {
    storeId?: string | null
    clientId: string
    customerName?: string | null
    customerContact?: string | null
  }): Promise<ChatConversation | null> {
    const storeId = this.requireStoreId(input.storeId)
    const clientId = String(input.clientId || '').trim()
    const conversationId = this.buildConversationId(storeId, clientId)

    if (!clientId || !conversationId) return null

    const existing = await this.findChatConversation({
      storeId,
      clientId
    })

    if (existing) return existing

    const rows = [
      {
        conversation_id: conversationId,
        store_id: storeId,
        client_id: clientId,
        customer_name: input.customerName || null,
        customer_contact: input.customerContact || null,
        updated_at: new Date().toISOString()
      }
    ]

    const payload: Record<string, ShowcaseRepositoryJson> = {
      __raw_array__: JSON.stringify(rows)
    }

    const createUrl = this.restUrl(`${this.chatConversationsTable()}?on_conflict=store_id,conversation_id&select=*`)
    const [code, body] = await this.httpPost(
      createUrl,
      payload,
      'resolution=merge-duplicates,return=representation',
      storeId,
      clientId
    )

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    if (code < 200 || code > 299) return null

    const created = this.parseFirstObject(body)
    if (!created) return null

    return this.parseChatConversation(created, storeId)
  }

  async fetchChatMessages(input: {
    storeId?: string | null
    clientId?: string | null
    conversationId: string
    limit?: number
  }): Promise<ChatMessage[]> {
    const storeId = this.requireStoreId(input.storeId)
    const clientId = String(input.clientId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    if (!conversationId) return []

    const limit = Math.max(1, Math.min(Number(input.limit || 200), 500))
    const query = [
      'select=*',
      `store_id=${this.encodeEq(storeId)}`,
      ...(clientId ? [`client_id=${this.encodeEq(clientId)}`] : []),
      `conversation_id=${this.encodeEq(conversationId)}`,
      'order=created_at.asc',
      `limit=${limit}`
    ].join('&')

    const url = this.buildSelectUrl(this.chatMessagesTable(), query)

    return this.executeOnce('fetchChatMessages', async () => {
      const [code, body] = await this.httpGet(url, storeId, clientId || null)
      if (code < 200 || code > 299) return []

      return this.parseObjectArray(body).map(row => this.parseChatMessage(row, storeId))
    }, [])
  }

  async insertChatMessage(input: {
    storeId?: string | null
    clientId?: string | null
    conversationId: string
    senderRole: string
    senderId?: string | null
    body: string
    imageUrls?: string[]
    productDishId?: string | null
    quotedMessageId?: string | null
  }): Promise<ChatMessage | null> {
    const storeId = this.requireStoreId(input.storeId)
    const clientId = String(input.clientId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    if (!conversationId) return null

    const payload: Record<string, ShowcaseRepositoryJson> = {
      store_id: storeId,
      client_id: clientId || null,
      conversation_id: conversationId,
      sender_role: input.senderRole,
      sender_id: input.senderId || null,
      body: input.body || '',
      image_urls: input.imageUrls || [],
      product_dish_id: input.productDishId || null,
      quoted_message_id: input.quotedMessageId || null
    }

    const url = this.restUrl(`${this.chatMessagesTable()}?select=*`)
    const [code, body] = await this.httpPost(
      url,
      payload,
      'return=representation',
      storeId,
      clientId || null
    )

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    if (code < 200 || code > 299) return null

    const row = this.parseFirstObject(body)
    if (!row) return null

    await this.touchChatConversation(storeId, conversationId, clientId || null)

    return this.parseChatMessage(row, storeId)
  }

  async touchChatConversation(
    storeIdInput: string | null | undefined,
    conversationIdInput: string,
    clientIdInput?: string | null
  ): Promise<boolean> {
    const storeId = this.requireStoreId(storeIdInput)
    const conversationId = String(conversationIdInput || '').trim()
    const clientId = String(clientIdInput || '').trim()
    if (!conversationId) return false

    const url = this.restUrl(
      `${this.chatConversationsTable()}?store_id=${this.encodeEq(storeId)}&conversation_id=${this.encodeEq(conversationId)}`
    )
    const [code, body] = await this.httpPatch(url, {
      updated_at: new Date().toISOString()
    }, 'return=minimal', storeId, clientId || null)

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    return code >= 200 && code <= 299
  }

  async markChatMessagesRead(input: {
    storeId?: string | null
    clientId?: string | null
    conversationId: string
    readerRole: string
  }): Promise<boolean> {
    const storeId = this.requireStoreId(input.storeId)
    const clientId = String(input.clientId || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const readerRole = String(input.readerRole || '').trim()

    if (!conversationId || !readerRole) return false

    const url = this.restUrl(
      `${this.chatMessagesTable()}?store_id=${this.encodeEq(storeId)}${clientId ? `&client_id=${this.encodeEq(clientId)}` : ''}&conversation_id=${this.encodeEq(conversationId)}&sender_role=neq.${encodeURIComponent(readerRole)}&read_at=is.null`
    )

    const [code, body] = await this.httpPatch(url, {
      read_at: new Date().toISOString()
    }, 'return=minimal', storeId, clientId || null)

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    return code >= 200 && code <= 299
  }
  async markUserMessagesRead(
    storeIdInput: string | null | undefined,
    conversationIdInput: string,
    clientIdInput?: string | null
  ): Promise<boolean> {
    const storeId = this.requireStoreId(storeIdInput)
    const clientId = String(clientIdInput || '').trim()
    const conversationId = String(conversationIdInput || '').trim()

    if (!conversationId) return false

    const url = this.restUrl(
      `${this.chatMessagesTable()}?store_id=${this.encodeEq(storeId)}${clientId ? `&client_id=${this.encodeEq(clientId)}` : ''}&conversation_id=${this.encodeEq(conversationId)}&sender_role=${this.encodeEq('user')}&read_at=is.null`
    )

    const [code, body] = await this.httpAuthPatch(url, {
      read_at: new Date().toISOString()
    }, 'return=minimal', storeId)

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    return code >= 200 && code <= 299
  }

  async fetchChatThreadSummaries(input: {
    storeId?: string | null
    limit?: number
  } = {}): Promise<ChatThreadSummary[]> {
    const storeId = this.requireStoreId(input.storeId)
    const limit = Math.max(1, Math.min(Number(input.limit || 100), 300))

    const query = [
      'select=*',
      `store_id=${this.encodeEq(storeId)}`,
      'order=last_message_at.desc.nullslast,updated_at.desc.nullslast',
      `limit=${limit}`
    ].join('&')

    const url = this.buildSelectUrl(this.chatThreadSummariesView(), query)

    return this.executeOnce('fetchChatThreadSummaries', async () => {
      const [code, body] = await this.httpAuthGet(url, storeId)
      if (code < 200 || code > 299) return []

      return this.parseObjectArray(body).map(row => this.parseChatThreadSummary(row, storeId))
    }, [])
  }

  async updateChatThreadPinned(input: {
    storeId?: string | null
    conversationId: string
    pinned: boolean
  }): Promise<boolean> {
    const storeId = this.requireStoreId(input.storeId)
    const conversationId = String(input.conversationId || '').trim()
    if (!conversationId) return false

    const url = this.restUrl(`${this.chatConversationsTable()}?store_id=${this.encodeEq(storeId)}&conversation_id=${this.encodeEq(conversationId)}`)
    const [code, body] = await this.httpAuthPatch(url, {
      pinned: input.pinned,
      updated_at: new Date().toISOString()
    }, 'return=minimal', storeId)

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    return code >= 200 && code <= 299
  }

  async deleteChatThread(
    storeIdInput: string | null | undefined,
    conversationIdInput: string
  ): Promise<boolean> {
    const storeId = this.requireStoreId(storeIdInput)
    const conversationId = String(conversationIdInput || '').trim()
    if (!conversationId) return false

    const messagesUrl = this.restUrl(
      `${this.chatMessagesTable()}?store_id=${this.encodeEq(storeId)}&conversation_id=${this.encodeEq(conversationId)}`
    )
    await this.httpAuthDelete(messagesUrl, storeId)

    const threadUrl = this.restUrl(
      `${this.chatConversationsTable()}?store_id=${this.encodeEq(storeId)}&conversation_id=${this.encodeEq(conversationId)}`
    )
    const [code, body] = await this.httpAuthDelete(threadUrl, storeId)

    this.lastDeleteCode = code
    this.lastDeleteBody = body

    return code >= 200 && code <= 299
  }

  async uploadChatImageBytes(input: UploadBytesInput): Promise<string | null> {
    const path = this.buildChatStorageUploadPath(input)
    const bucket = this.chatImagesBucket()
    const url = this.storageObjectUrl(bucket, path)

    const [code, body] = await this.httpPutBytes(
      url,
      input.bytes,
      input.contentType,
      null,
      input.storeId,
      input.clientId || null
    )

    this.lastStoreImageUploadCode = code
    this.lastStoreImageUploadBody = body

    if (code < 200 || code > 299) return null

    return this.buildStoragePublicObjectUrl(bucket, path)
  }

  async upsertPushDevice(input: PushDeviceUpsert): Promise<boolean> {
    const storeId = this.requireStoreId(input.storeId)
    const token = String(input.token || '').trim()
    const audience = normalizePushAudience(input.audience)
    const clientId = String(input.clientId || '').trim()
    const merchantId = String(input.merchantId || '').trim()
    const rawConversationId = String(input.conversationId || '').trim()
    const deviceInstallId = String(input.deviceInstallId || '').trim()

    if (!token || !isSupportedPushAudience(audience)) return false
    if (!deviceInstallId) return false

    if ((audience === 'chat_client' || audience === 'appointment_client') && !clientId) {
      return false
    }

    if (audience === 'chat_client' && !rawConversationId) {
      return false
    }

    const conversationId =
      rawConversationId ||
      (audience === 'announcement_subscriber'
        ? '__announcement__'
        : audience === 'chat_merchant'
          ? '__merchant__'
          : audience === 'appointment_merchant'
            ? '__appointment_merchant__'
            : audience === 'appointment_client'
              ? '__appointment_client__'
              : null)

    const nowIso = new Date().toISOString()

    const edgePayload: Record<string, ShowcaseRepositoryJson> = {
      action: 'register_push_device',
      store_id: storeId,
      audience,
      token,
      conversation_id: conversationId || null,
      client_id: clientId || null,
      merchant_id: merchantId || null,
      platform: input.platform || 'web',
      app_version: input.appVersion || null,
      device_install_id: deviceInstallId,
      updated_at: nowIso,
      last_seen_at: nowIso
    }

    const restPayload: Record<string, ShowcaseRepositoryJson> = {
      store_id: storeId,
      audience,
      token,
      conversation_id: conversationId || null,
      client_id: clientId || null,
      merchant_id: merchantId || null,
      platform: input.platform || 'web',
      app_version: input.appVersion || null,
      device_install_id: deviceInstallId,
      updated_at: nowIso,
      last_seen_at: nowIso
    }

    const useEdgeFunctionRegistration =
      audience === 'announcement_subscriber' ||
      audience === 'chat_client' ||
      audience === 'appointment_client'

    if (useEdgeFunctionRegistration) {
      const url = this.functionUrl(this.edgeFunctions.sendPush)
      const scopeClientId = clientId || null

      const [code, body] = await this.httpPost(
        url,
        edgePayload,
        null,
        storeId,
        scopeClientId
      )

      this.lastUpsertCode = code
      this.lastUpsertBody = body

      return code >= 200 && code <= 299
    }

    const upsertUrl = this.restUrl(
      `${this.pushDevicesTable()}?on_conflict=store_id,device_install_id,audience,conversation_scope`
    )

    const [code, body] = await this.httpAuthPost(
      upsertUrl,
      restPayload,
      'resolution=merge-duplicates,return=minimal',
      storeId
    )

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    return code >= 200 && code <= 299
  }

  async unregisterPushDevice(input: PushDeviceUnregister): Promise<boolean> {
    const storeId = this.requireStoreId(input.storeId)
    const audience = normalizePushAudience(input.audience)
    const token = String(input.token || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const clientId = String(input.clientId || '').trim()
    const merchantId = String(input.merchantId || '').trim()
    const deviceInstallId = String(input.deviceInstallId || '').trim()

    if (!isSupportedPushAudience(audience)) return false
    if (!deviceInstallId && !token) return false

    const payload: Record<string, ShowcaseRepositoryJson> = {
      action: 'unregister_push_device',
      store_id: storeId,
      audience,
      token: token || null,
      conversation_id: conversationId || null,
      client_id: clientId || null,
      merchant_id: merchantId || null,
      device_install_id: deviceInstallId || null
    }

    const url = this.functionUrl(this.edgeFunctions.sendPush)
    const scopeClientId = clientId || null

    const [code, body] = await this.httpPost(
      url,
      payload,
      null,
      storeId,
      scopeClientId
    )

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    return code >= 200 && code <= 299
  }

private async dispatchPush(
  payload: Record<string, ShowcaseRepositoryJson>,
  options: {
    storeId: string
    actor: PushRequestActor
    scopeClientId?: string | null
  }
): Promise<boolean> {
  this.lastAnnouncementPushCode = null
  this.lastAnnouncementPushBody = null

  try {
    const storeId = this.requireStoreId(options.storeId)
    const scopeClientId = String(options.scopeClientId || '').trim() || null
    const url = this.functionUrl(this.edgeFunctions.sendPush)
    const nextPayload = await this.buildPushPayloadWithNotificationImages(payload, storeId)

    console.log('[NDJC_PUSH] dispatchPush request prepared.', {
      storeId,
      actor: options.actor,
      scopeClientId,
      url,
      type: nextPayload.type,
      push_type: nextPayload.push_type,
      audience: nextPayload.audience,
      target_audience: nextPayload.target_audience,
      appointment_id: nextPayload.appointment_id,
      open_as: nextPayload.open_as,
      target_client_id: nextPayload.target_client_id
    })

    const [code, body] = options.actor === 'merchant'
      ? await this.httpAuthPost(url, nextPayload, null, storeId)
      : await this.httpPost(url, nextPayload, null, storeId, scopeClientId)

    this.lastAnnouncementPushCode = code
    this.lastAnnouncementPushBody = body

    console.log('[NDJC_PUSH] dispatchPush response received.', {
      storeId,
      actor: options.actor,
      scopeClientId,
      code,
      body
    })

    return code >= 200 && code <= 299
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error || 'Unknown dispatchPush error')

    this.lastAnnouncementPushCode = 0
    this.lastAnnouncementPushBody = message

    console.error('[NDJC_PUSH] dispatchPush threw before receiving send_push response.', {
      actor: options.actor,
      storeId: options.storeId,
      scopeClientId: options.scopeClientId || null,
      message,
      payload
    })

    return false
  }
}

  private async buildPushPayloadWithNotificationImages(
    payload: Record<string, ShowcaseRepositoryJson>,
    storeId: string
  ): Promise<Record<string, ShowcaseRepositoryJson>> {
    const pushType = String(payload.push_type || payload.type || '').trim().toLowerCase()
    const badgeUrl = pushBadgeUrlForPushType(pushType)
    let iconUrl = ''
    let appName = 'NDJC'

    try {
      const profile = await this.fetchStorePwaProfile(storeId)
      iconUrl = pickCloudStorePwaPushIconUrl(profile)
      appName = pickCloudStorePwaAppName(profile)
    } catch {
      iconUrl = ''
      appName = 'NDJC'
    }

    const payloadTitle = String(payload.title || '').trim()
    const nextPayload: Record<string, ShowcaseRepositoryJson> = {
      ...payload,
      title: payloadTitle || appName,
      notification_app_name: appName,
      app_name: appName,
      notification_badge: badgeUrl,
      badge: badgeUrl
    }

    if (iconUrl) {
      nextPayload.notification_icon = iconUrl
      nextPayload.icon = iconUrl
    }

    const rawData = payload.data

    if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
      const data = rawData as Record<string, ShowcaseRepositoryJson>
      const dataTitle = String(data.title || '').trim()

      nextPayload.data = {
        ...data,
        title: dataTitle || payloadTitle || appName,
        notification_app_name: appName,
        app_name: appName,
        notification_badge: badgeUrl,
        badge: badgeUrl
      }

      if (iconUrl) {
        nextPayload.data.notification_icon = iconUrl
        nextPayload.data.icon = iconUrl
      }
    } else {
      nextPayload.data = {
        notification_app_name: appName,
        app_name: appName,
        notification_badge: badgeUrl,
        badge: badgeUrl
      }

      if (iconUrl) {
        nextPayload.data.notification_icon = iconUrl
        nextPayload.data.icon = iconUrl
      }
    }

    return nextPayload
  }

  async dispatchChatPush(input: {
    storeId?: string | null
    conversationId: string
    title: string
    body: string
    senderRole: string
    targetAudience?: string | null
    openAs?: string | null
    targetClientId?: string | null
    senderClientId?: string | null
  }): Promise<boolean> {
    const storeId = this.requireStoreId(input.storeId)
    const senderRole = String(input.senderRole || '').trim().toLowerCase()
    const actor: PushRequestActor = senderRole === 'merchant' ? 'merchant' : 'public'
    const normalizedTargetAudience = normalizePushAudience(input.targetAudience)
    const targetAudience = normalizedTargetAudience || (
      actor === 'merchant'
        ? 'chat_client'
        : 'chat_merchant'
    )
    const openAs = String(input.openAs || '').trim() || (
      targetAudience === 'chat_merchant'
        ? 'merchant'
        : 'client'
    )
    const scopeClientId = actor === 'public'
      ? String(input.senderClientId || input.targetClientId || '').trim()
      : null

    return this.dispatchPush({
      type: 'chat_message',
      push_type: 'chat_message',
      audience: targetAudience,
      target_audience: targetAudience,
      store_id: storeId,
      conversation_id: input.conversationId,
      title: input.title,
      body: input.body,
      actor,
      sender_role: input.senderRole,
      open_as: openAs,
      target_client_id: input.targetClientId || null,
      sender_client_id: input.senderClientId || null,
      data: {
        type: 'chat_message',
        push_type: 'chat_message',
        store_id: storeId,
        storeId,
        conversation_id: input.conversationId,
        conversationId: input.conversationId,
        audience: targetAudience,
        target_audience: targetAudience,
        open_as: openAs,
        openAs,
        target_client_id: input.targetClientId || '',
        targetClientId: input.targetClientId || '',
        sender_client_id: input.senderClientId || '',
        senderClientId: input.senderClientId || ''
      }
    }, {
      storeId,
      actor,
      scopeClientId
    })
  }

async dispatchAppointmentPush(input: {
  storeId?: string | null
  appointmentId: string
  title: string
  body: string
  bodyPreview?: string | null
  targetAudience?: string | null
  openAs?: string | null
  targetClientId?: string | null
  scopeClientId?: string | null
  actor?: string | null
  pushType?: string | null
}): Promise<boolean> {
  const storeId = this.requireStoreId(input.storeId)
  const actor = normalizePushActor(input.actor || 'merchant')
  const requestedPushType = String(input.pushType || '').trim().toLowerCase()
  const pushType = requestedPushType === 'appointment_created' ||
    requestedPushType === 'appointment_status' ||
    requestedPushType === 'appointment_cancelled'
    ? requestedPushType
    : actor === 'public'
      ? 'appointment_created'
      : 'appointment_status'
  const normalizedTargetAudience = normalizePushAudience(input.targetAudience)
  const targetAudience = normalizedTargetAudience || (
    actor === 'public'
      ? 'appointment_merchant'
      : 'appointment_client'
  )
  const openAs = String(input.openAs || '').trim() || (
    actor === 'public'
      ? 'merchant'
      : 'client'
  )
  const scopeClientId = actor === 'public'
    ? String(input.scopeClientId || input.targetClientId || '').trim()
    : null

  return this.dispatchPush({
    type: pushType,
    push_type: pushType,
    audience: targetAudience,
    target_audience: targetAudience,
    store_id: storeId,
    appointment_id: input.appointmentId,
    open_as: openAs,
    target_client_id: input.targetClientId || null,
    scope_client_id: input.scopeClientId || null,
    actor,
    title: input.title,
    body: input.body,
    body_preview: input.bodyPreview || input.body,
    data: {
      type: pushType,
      push_type: pushType,
      store_id: storeId,
      storeId,
      appointment_id: input.appointmentId,
      appointmentId: input.appointmentId,
      audience: targetAudience,
      target_audience: targetAudience,
      open_as: openAs,
      openAs,
      target_client_id: input.targetClientId || '',
      targetClientId: input.targetClientId || ''
    }
  }, {
    storeId,
    actor,
    scopeClientId
  })
}
    async incrementDishClickCount(
    storeIdInput: string | null | undefined,
    dishIdInput: string
  ): Promise<boolean> {
    const storeId = this.requireStoreId(storeIdInput)
    const dishId = String(dishIdInput || '').trim()

    if (!dishId) return false

    const url = this.restUrl('rpc/ndjc_inc_dish_click_count')
    const [code, body] = await this.httpPost(url, {
      p_store_id: storeId,
      p_dish_id: dishId
    }, null, storeId)

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    return code >= 200 && code <= 299
  }

  async dispatchAnnouncementPush(input: {
    storeId?: string | null
    announcementId: string
    bodyPreview: string
  }): Promise<boolean> {
    const storeId = this.requireStoreId(input.storeId)
    const bodyPreview = String(input.bodyPreview || '').trim() || 'Tap to view the latest update'

    return this.dispatchPush({
      type: 'announcement',
      push_type: 'announcement',
      audience: 'announcement_subscriber',
      target_audience: 'announcement_subscriber',
      store_id: storeId,
      announcement_id: input.announcementId,
      actor: 'merchant',
      open_as: 'client',
      title: 'New announcement',
      body: bodyPreview,
      data: {
        type: 'announcement',
        push_type: 'announcement',
        store_id: storeId,
        storeId,
        announcement_id: input.announcementId,
        announcementId: input.announcementId,
        audience: 'announcement_subscriber',
        target_audience: 'announcement_subscriber',
        open_as: 'client',
        openAs: 'client'
      }
    }, {
      storeId,
      actor: 'merchant',
      scopeClientId: null
    })
  }

  async signInMerchant(input: {
    loginName: string
    password: string
  }): Promise<MerchantAuthSession | null> {
    const loginName = String(input.loginName || '').trim()
    const password = String(input.password || '').trim()

    if (!loginName || !password) return null

    try {
      const snapshot = await signInShowcaseAuthWithPassword({
        email: loginName,
        password
      })

      this.lastMerchantAuthCode = 200
      this.lastMerchantAuthBody = JSON.stringify({
        auth_user_id: snapshot.authUserId,
        email: snapshot.email,
        expires_at: snapshot.expiresAt
      })

      const session: MerchantAuthSession = {
        accessToken: snapshot.accessToken,
        refreshToken: null,
        authUserId: snapshot.authUserId,
        loginName: snapshot.email || loginName,
        expiresAt: snapshot.expiresAt || tokenExpiresAt(snapshot.accessToken)
      }

      this.merchantSession = session

      return session
    } catch (error) {
      const status = typeof (error as { status?: unknown })?.status === 'number'
        ? (error as { status: number }).status
        : 0
      const code = typeof (error as { code?: unknown })?.code === 'string'
        ? String((error as { code: string }).code)
        : ''
      const name = typeof (error as { name?: unknown })?.name === 'string'
        ? String((error as { name: string }).name)
        : ''
      const message = error instanceof Error ? error.message : 'Invalid account or password.'

      this.lastMerchantAuthCode = status
      this.lastMerchantAuthBody = JSON.stringify({
        error: message,
        code: code || name || 'auth_sign_in_failed',
        status
      })
      this.merchantSession = null

      return null
    }
  }

  async signOutMerchant(): Promise<void> {
    this.merchantSession = null

    try {
      await signOutShowcaseAuth()
    } catch {
      return
    }
  }

  async fetchMerchantStoreMemberships(authUserIdInput?: string | null): Promise<MerchantStoreMembership[]> {
    const authUserId = String(authUserIdInput || this.merchantSession?.authUserId || '').trim()
    if (!authUserId) return []

    const query = [
      'select=*',
      `auth_user_id=${this.encodeEq(authUserId)}`
    ].join('&')

    const url = this.buildSelectUrl(this.merchantStoreMembershipsTable(), query)

    return this.executeOnce('fetchMerchantStoreMemberships', async () => {
      const [code, body] = await this.httpAuthGet(url)
      if (code < 200 || code > 299) return []

      return this.parseObjectArray(body).map(row => ({
        storeId: jsonString(row, 'store_id'),
        authUserId: jsonString(row, 'auth_user_id'),
        loginName: jsonNullableString(row, 'login_name')
      }))
    }, [])
  }
    async fetchMerchantBindingForCurrentStore(storeIdInput: string): Promise<MerchantStoreMembership | null> {
    const storeId = this.requireStoreId(storeIdInput)

    const query = [
      'select=store_id,auth_user_id,login_name',
      `store_id=${this.encodeEq(storeId)}`,
      'limit=1'
    ].join('&')

    const url = this.buildSelectUrl(this.merchantStoreMembershipsTable(), query)

    return this.executeOnce('fetchMerchantBindingForCurrentStore', async () => {
      const [code, body] = await this.httpAuthGet(url, storeId)
      if (code < 200 || code > 299) return null

      const row = this.parseFirstObject(body)
      if (!row) return null

      return {
        storeId: jsonString(row, 'store_id'),
        authUserId: jsonString(row, 'auth_user_id'),
        loginName: jsonNullableString(row, 'login_name')
      }
    }, null)
  }

  async fetchMerchantBindingForStoreAndAuthUser(
    storeIdInput: string,
    authUserIdInput: string
  ): Promise<MerchantStoreMembership | null> {
    const storeId = String(storeIdInput || '').trim()
    const authUserId = String(authUserIdInput || '').trim()

    this.lastMerchantBindingCode = null
    this.lastMerchantBindingBody = null

    if (!storeId || !authUserId) {
      this.lastMerchantBindingCode = 0
      this.lastMerchantBindingBody = JSON.stringify({
        error: 'Missing store id or auth user id.'
      })
      return null
    }

    const query = [
      'select=store_id,auth_user_id,login_name',
      `store_id=${this.encodeEq(storeId)}`,
      `auth_user_id=${this.encodeEq(authUserId)}`,
      'limit=1'
    ].join('&')

    const url = this.buildSelectUrl(this.merchantStoreMembershipsTable(), query)

    return this.executeOnce('fetchMerchantBindingForStoreAndAuthUser', async () => {
      const [code, body] = await this.httpAuthGet(url, storeId)

      this.lastMerchantBindingCode = code
      this.lastMerchantBindingBody = body

      if (code < 200 || code > 299) return null

      const row = this.parseFirstObject(body)
      if (!row) {
        this.lastMerchantBindingCode = 404
        this.lastMerchantBindingBody = JSON.stringify({
          error: 'Merchant account is not bound to current store.'
        })
        return null
      }

      return {
        storeId: jsonString(row, 'store_id'),
        authUserId: jsonString(row, 'auth_user_id'),
        loginName: jsonNullableString(row, 'login_name')
      }
    }, null)
  }

  async updateMerchantPassword(input: {
    newPassword: string
  }): Promise<boolean> {
    const newPassword = String(input.newPassword || '').trim()
    if (!newPassword) return false

    let accessToken: string

    try {
      accessToken = await requireFreshShowcaseAccessToken()
    } catch {
      return false
    }

    const first = await this.request(this.authUrl('/user'), {
      method: 'PUT',
      authorization: `Bearer ${accessToken}`,
      body: {
        password: newPassword
      }
    })

    this.lastMerchantAuthCode = first.code
    this.lastMerchantAuthBody = first.body

    if (first.code >= 200 && first.code <= 299) {
      return true
    }

    if (!this.isJwtExpiredBody(first.code, first.body)) {
      return false
    }

    let retryAccessToken = ''

    try {
      const refreshed = await refreshShowcaseAuthSession()
      retryAccessToken = refreshed?.accessToken || ''
    } catch {
      return false
    }

    if (!retryAccessToken || retryAccessToken === accessToken) {
      return false
    }

    const second = await this.request(this.authUrl('/user'), {
      method: 'PUT',
      authorization: `Bearer ${retryAccessToken}`,
      body: {
        password: newPassword
      }
    })

    this.lastMerchantAuthCode = second.code
    this.lastMerchantAuthBody = second.body

    return second.code >= 200 && second.code <= 299
  }

  async updateMerchantLoginName(input: {
    newLoginName: string
  }): Promise<boolean> {
    const newLoginName = String(input.newLoginName || '').trim()
    if (!newLoginName) return false

    let accessToken: string

    try {
      accessToken = await requireFreshShowcaseAccessToken()
    } catch {
      return false
    }

    const first = await this.request(this.authUrl('/user'), {
      method: 'PUT',
      authorization: `Bearer ${accessToken}`,
      body: {
        email: newLoginName
      }
    })

    this.lastMerchantAuthCode = first.code
    this.lastMerchantAuthBody = first.body

    if (first.code >= 200 && first.code <= 299 && this.merchantSession) {
      this.merchantSession = {
        ...this.merchantSession,
        loginName: newLoginName
      }
      return true
    }

    if (!this.isJwtExpiredBody(first.code, first.body)) {
      return false
    }

    let retryAccessToken = ''

    try {
      const refreshed = await refreshShowcaseAuthSession()
      retryAccessToken = refreshed?.accessToken || ''
    } catch {
      return false
    }

    if (!retryAccessToken || retryAccessToken === accessToken) {
      return false
    }

    const second = await this.request(this.authUrl('/user'), {
      method: 'PUT',
      authorization: `Bearer ${retryAccessToken}`,
      body: {
        email: newLoginName
      }
    })

    this.lastMerchantAuthCode = second.code
    this.lastMerchantAuthBody = second.body

    if (second.code >= 200 && second.code <= 299 && this.merchantSession) {
      this.merchantSession = {
        ...this.merchantSession,
        loginName: newLoginName
      }
      return true
    }

    return false
  }

  private parseStoreServiceStatus(raw: Record<string, unknown>, storeIdFallback: string): CloudStoreServiceStatus {
    return {
      storeId: jsonString(raw, 'store_id', storeIdFallback),
      planType: jsonString(raw, 'plan_type', 'trial'),
      serviceStatus: jsonString(raw, 'service_status', 'active'),
      serviceEndAt: jsonNullableString(raw, 'service_end_at'),
      deleteAt: jsonNullableString(raw, 'delete_at'),
      isWriteAllowed: jsonBoolean(raw, 'is_write_allowed', true)
    }
  }

  async fetchStoreServiceStatus(storeIdInput?: string | null): Promise<CloudStoreServiceStatus | null> {
    const storeId = this.requireStoreId(storeIdInput)
    const query = [
      'select=*',
      `store_id=${this.encodeEq(storeId)}`,
      'limit=1'
    ].join('&')

    const url = this.buildSelectUrl(this.storesTable(), query)

    return this.executeOnce('fetchStoreServiceStatus', async () => {
      const accessToken = await getFreshShowcaseAccessToken()
      const [code, body] = accessToken
        ? await this.httpAuthGet(url, storeId)
        : await this.httpGet(url, storeId)

      if (code < 200 || code > 299) {
        if (this.isMerchantAuthExpired(code, body)) {
          throw new Error(`Merchant auth expired while fetching store service status: ${body || code}`)
        }

        return null
      }

      const row = this.parseFirstObject(body)
      if (!row) return null

      return this.parseStoreServiceStatus(row, storeId)
    }, null)
  }
    async isStoreWriteAllowed(storeIdInput?: string | null): Promise<boolean> {
    const status = await this.fetchStoreServiceStatus(storeIdInput)
    if (!status) return true

    const serviceStatus = status.serviceStatus.trim().toLowerCase()

    return Boolean(
      status.isWriteAllowed &&
      serviceStatus !== 'read_only' &&
      serviceStatus !== 'deleted'
    )
  }

  async updateStoreServiceStatus(input: {
    storeId?: string | null
    planType?: string | null
    serviceStatus?: string | null
    serviceEndAt?: string | null
    deleteAt?: string | null
    isWriteAllowed?: boolean | null
  }): Promise<boolean> {
    const storeId = this.requireStoreId(input.storeId)

    const payload: Record<string, ShowcaseRepositoryJson> = {
      store_id: storeId,
      updated_at: new Date().toISOString()
    }

    if (input.planType != null) payload.plan_type = input.planType
    if (input.serviceStatus != null) payload.service_status = input.serviceStatus
    if (input.serviceEndAt !== undefined) payload.service_end_at = input.serviceEndAt
    if (input.deleteAt !== undefined) payload.delete_at = input.deleteAt
    if (input.isWriteAllowed != null) payload.is_write_allowed = input.isWriteAllowed

    const url = this.restUrl(this.storesTable())
    const [code, body] = await this.httpAuthPost(url, payload, 'resolution=merge-duplicates,return=representation', storeId)

    this.lastUpsertCode = code
    this.lastUpsertBody = body

    return code >= 200 && code <= 299
  }
}

export function createShowcaseCloudRepository(config: RepositoryConfigInput = {}): ShowcaseCloudRepository {
  return new ShowcaseCloudRepository(config)
}

export const showcaseCloudRepository = createShowcaseCloudRepository()

export default showcaseCloudRepository