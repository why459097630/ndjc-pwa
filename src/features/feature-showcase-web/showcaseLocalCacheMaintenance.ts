export type ShowcaseLocalCacheMaintenanceResult = {
  didRun: boolean
  reason: 'not-browser' | 'storage-unavailable' | 'throttled' | 'completed'
  removedTempImages: number
  removedPendingCamera: boolean
  removedChatDrafts: number
  removedChatMessages: number
  removedChatThreadMetas: number
  removedChatTombstones: number
  trimmedAppointmentCaches: number
  trimmedBookingStatusSeenKeys: number
  trimmedStoreScopedModelCaches: number
  trimmedDishCaches: number
  removedLegacyMerchantSession: boolean
}

type LocalTempImageRecord = {
  storeId?: string | null
  scope?: string | null
  url?: string | null
  createdAt?: number | null
}

type PendingChatCameraRecord = {
  storeId?: string | null
  url?: string | null
  createdAt?: number | null
}

type LocalChatDraftStore = {
  storeId?: string | null
  conversationId?: string | null
  draft?: string | null
  draftImageUrls?: string[] | null
  pendingProduct?: unknown
  pendingAppointment?: unknown
  quotedMessageId?: string | null
  updatedAt?: number | null
  createdAt?: number | null
}

type ChatMessageStorageRecord = {
  id?: string | null
  storeId?: string | null
  conversationId?: string | null
  timeMs?: number | null
  status?: string | null
  [key: string]: unknown
}

type ChatThreadMetaStorageRecord = {
  storeId?: string | null
  conversationId?: string | null
  isDeleted?: boolean | null
  deletedAtMs?: number | null
  pinnedAtMs?: number | null
  [key: string]: unknown
}

type ChatDeletedMessageTombstoneStorageRecord = {
  storeId?: string | null
  conversationId?: string | null
  messageId?: string | null
  deletedAtMs?: number | null
}

type CloudAppointmentStorageRecord = {
  id?: string | null
  createdAt?: number | null
  status?: string | null
  syncState?: string | null
  dirty?: boolean | null
  [key: string]: unknown
}

type DishStorageRecord = {
  id?: string | null
  updatedAt?: number | null
  syncState?: string | null
  dirty?: boolean | null
  [key: string]: unknown
}

type PublishedAnnouncementStorageRecord = {
  id?: string | null
  updatedAt?: number | null
  createdAt?: number | null
  [key: string]: unknown
}

type StoreScopedStorageRecord<T> = {
  storeId?: string | null
  value?: T
  updatedAt?: number | null
}

const DEFAULT_STORE_ID = 'store_showcase_trial_000001'

const MAINTENANCE_LAST_RUN_KEY = 'ndjc_showcase_cache_maintenance_last_run'
const SHOWCASE_LOCAL_TEMP_IMAGES_KEY = 'ndjc_showcase_local_temp_images'
const SHOWCASE_PENDING_CHAT_CAMERA_KEY = 'ndjc_showcase_pending_chat_camera'
const SHOWCASE_CHAT_DRAFT_KEY = 'ndjc_showcase_chat_draft'
const SHOWCASE_LEGACY_MERCHANT_SESSION_KEY = 'ndjc_showcase_merchant_session'

const SHOWCASE_CHAT_MESSAGES_KEY = 'showcase_chat_db_chat_messages'
const SHOWCASE_CHAT_THREAD_META_KEY = 'showcase_chat_db_chat_thread_meta'
const SHOWCASE_CHAT_TOMBSTONE_KEY_PREFIX = 'ndjc_showcase_chat_repository_'
const SHOWCASE_CHAT_TOMBSTONE_KEY_SUFFIX = '_deleted_message_tombstones'
const SHOWCASE_APPOINTMENTS_KEY_PREFIX = 'ndjc_showcase_appointments_'
const SHOWCASE_BOOKING_STATUS_SEEN_KEY_PREFIX = 'ndjc_showcase_booking_status_alerts_seen_'

const SHOWCASE_MODELS_DISHES_STORAGE_KEY = 'ndjc_showcase_models_dishes'
const SHOWCASE_MODELS_STORE_PROFILE_STORAGE_KEY = 'ndjc_showcase_models_store_profile'
const SHOWCASE_MODELS_MANUAL_CATEGORIES_STORAGE_KEY = 'ndjc_showcase_models_manual_categories'
const SHOWCASE_MODELS_PUBLISHED_ANNOUNCEMENTS_STORAGE_KEY = 'ndjc_showcase_models_published_announcements'
const SHOWCASE_MODELS_VIEWED_ANNOUNCEMENT_IDS_STORAGE_KEY = 'ndjc_showcase_models_viewed_announcement_ids'
const SHOWCASE_MODELS_COUNTED_ANNOUNCEMENT_CLICK_IDS_STORAGE_KEY = 'ndjc_showcase_models_counted_announcement_click_ids'
const SHOWCASE_MODELS_APPOINTMENTS_STORAGE_KEY = 'ndjc_showcase_models_appointments'

const MAINTENANCE_INTERVAL_MS = 12 * 60 * 60 * 1000
const LOCAL_TEMP_IMAGE_MAX_AGE_MS = 24 * 60 * 60 * 1000
const CHAT_TEXT_DRAFT_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000
const CHAT_IMAGE_DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000
const CHAT_SENT_MESSAGE_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000
const CHAT_UNSYNCED_MESSAGE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000
const CHAT_DELETED_THREAD_META_MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000
const CHAT_TOMBSTONE_MAX_AGE_MS = 60 * 24 * 60 * 60 * 1000
const APPOINTMENT_CACHE_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000
const STORE_PROFILE_CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
const MANUAL_CATEGORIES_CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
const DISH_CACHE_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000
const PUBLISHED_ANNOUNCEMENTS_CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000
const MODEL_APPOINTMENTS_CACHE_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000

const CHAT_MAX_MESSAGES_PER_CONVERSATION = 300
const CHAT_MAX_MESSAGES_GLOBAL = 5000
const CHAT_MAX_THREAD_META_GLOBAL = 5000
const CHAT_MAX_TOMBSTONES_PER_KEY = 5000
const APPOINTMENT_MAX_ITEMS_PER_STORE = 300
const BOOKING_STATUS_SEEN_MAX_KEYS = 300
const DISH_MAX_ITEMS_PER_STORE = 500
const PUBLISHED_ANNOUNCEMENTS_MAX_ITEMS_PER_STORE = 100
const MODEL_APPOINTMENTS_MAX_ITEMS_PER_STORE = 300

function emptyResult(reason: ShowcaseLocalCacheMaintenanceResult['reason']): ShowcaseLocalCacheMaintenanceResult {
  return {
    didRun: false,
    reason,
    removedTempImages: 0,
    removedPendingCamera: false,
    removedChatDrafts: 0,
    removedChatMessages: 0,
    removedChatThreadMetas: 0,
    removedChatTombstones: 0,
    trimmedAppointmentCaches: 0,
    trimmedBookingStatusSeenKeys: 0,
    trimmedStoreScopedModelCaches: 0,
    trimmedDishCaches: 0,
    removedLegacyMerchantSession: false
  }
}

function canUseLocalStorage(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

function normalizeStoreId(storeId: string | null | undefined): string {
  const value = String(storeId || '').trim()
  return value || DEFAULT_STORE_ID
}

function normalizeText(value: unknown): string {
  return String(value ?? '').trim()
}

function normalizeTimestamp(value: unknown, fallback: number): number {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback
}

function nowMillis(): number {
  return Date.now()
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseLocalStorage()) return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!canUseLocalStorage()) return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage persistence is best effort in PWA runtime
  }
}

function removeStorageValue(key: string): boolean {
  if (!canUseLocalStorage()) return false

  try {
    const existed = window.localStorage.getItem(key) !== null
    if (existed) {
      window.localStorage.removeItem(key)
    }

    return existed
  } catch {
    return false
  }
}

function localStorageKeys(): string[] {
  if (!canUseLocalStorage()) return []

  const keys: string[] = []

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index)
      if (key) keys.push(key)
    }
  } catch {
    return []
  }

  return keys
}

function revokeBlobUrl(url: string): void {
  if (typeof window === 'undefined') return
  if (!url.startsWith('blob:')) return

  try {
    window.URL.revokeObjectURL(url)
  } catch {
    // object URL revoke is best effort
  }
}

function isBlobUrl(url: string): boolean {
  return url.startsWith('blob:')
}

function isDataImageUrl(url: string): boolean {
  return url.startsWith('data:image/')
}

function isExpired(createdAt: number, maxAgeMs: number, now: number): boolean {
  return createdAt <= 0 || now - createdAt > maxAgeMs
}

function shouldKeepTempImage(record: LocalTempImageRecord, now: number): boolean {
  const url = normalizeText(record.url)
  if (!url) return false
  if (isBlobUrl(url)) return false
  if (isDataImageUrl(url)) {
    return !isExpired(normalizeTimestamp(record.createdAt, 0), LOCAL_TEMP_IMAGE_MAX_AGE_MS, now)
  }

  return true
}

export function pruneShowcaseLocalTempImages(): number {
  const now = nowMillis()
  const current = readJson<LocalTempImageRecord[]>(SHOWCASE_LOCAL_TEMP_IMAGES_KEY, [])
  const next: LocalTempImageRecord[] = []
  let removed = 0

  current.forEach(item => {
    const url = normalizeText(item.url)
    const keep = shouldKeepTempImage(item, now)

    if (keep) {
      next.push(item)
      return
    }

    removed += 1
    revokeBlobUrl(url)
  })

  if (removed > 0) {
    writeJson(SHOWCASE_LOCAL_TEMP_IMAGES_KEY, next)
  }

  return removed
}

export function pruneShowcasePendingChatCamera(): boolean {
  const now = nowMillis()
  const pending = readJson<PendingChatCameraRecord | null>(SHOWCASE_PENDING_CHAT_CAMERA_KEY, null)
  if (!pending) return false

  const url = normalizeText(pending.url)
  const createdAt = normalizeTimestamp(pending.createdAt, 0)
  const shouldRemove = !url || isBlobUrl(url) || isExpired(createdAt, LOCAL_TEMP_IMAGE_MAX_AGE_MS, now)

  if (!shouldRemove) return false

  revokeBlobUrl(url)
  removeStorageValue(SHOWCASE_PENDING_CHAT_CAMERA_KEY)
  return true
}

function draftUpdatedAt(draft: LocalChatDraftStore, now: number): number {
  const updatedAt = normalizeTimestamp(draft.updatedAt, 0)
  if (updatedAt > 0) return updatedAt

  return normalizeTimestamp(draft.createdAt, now)
}

function draftHasLocalImage(draft: LocalChatDraftStore): boolean {
  return Array.isArray(draft.draftImageUrls) && draft.draftImageUrls.some(item => {
    const url = normalizeText(item)
    return isBlobUrl(url) || isDataImageUrl(url)
  })
}

export function pruneShowcaseChatDrafts(): number {
  const now = nowMillis()
  const current = readJson<LocalChatDraftStore[]>(SHOWCASE_CHAT_DRAFT_KEY, [])
  const next: LocalChatDraftStore[] = []
  let removed = 0

  current.forEach(item => {
    const storeId = normalizeText(item.storeId)
    const conversationId = normalizeText(item.conversationId)
    const updatedAt = draftUpdatedAt(item, now)
    const maxAgeMs = draftHasLocalImage(item) ? CHAT_IMAGE_DRAFT_MAX_AGE_MS : CHAT_TEXT_DRAFT_MAX_AGE_MS

    if (!storeId || !conversationId || isExpired(updatedAt, maxAgeMs, now)) {
      removed += 1
      return
    }

    next.push(item)
  })

  if (removed > 0) {
    writeJson(SHOWCASE_CHAT_DRAFT_KEY, next)
  }

  return removed
}

function normalizeChatStatus(value: unknown): string {
  const status = normalizeText(value).toLowerCase()
  if (status === 'sending' || status === 'failed') return status
  return 'sent'
}

function chatMessageKey(item: ChatMessageStorageRecord): string {
  return normalizeText(item.id)
}

function chatConversationKey(item: ChatMessageStorageRecord): string {
  return `${normalizeText(item.storeId)}:${normalizeText(item.conversationId)}`
}

function shouldKeepChatMessage(item: ChatMessageStorageRecord, now: number): boolean {
  const id = normalizeText(item.id)
  const storeId = normalizeText(item.storeId)
  const conversationId = normalizeText(item.conversationId)
  const timeMs = normalizeTimestamp(item.timeMs, 0)
  const status = normalizeChatStatus(item.status)

  if (!id || !storeId || !conversationId) return false

  if (status === 'sending' || status === 'failed') {
    return !isExpired(timeMs, CHAT_UNSYNCED_MESSAGE_MAX_AGE_MS, now)
  }

  return !isExpired(timeMs, CHAT_SENT_MESSAGE_MAX_AGE_MS, now)
}

function sortChatMessagesNewestFirst(items: ChatMessageStorageRecord[]): ChatMessageStorageRecord[] {
  return [...items].sort((a, b) => {
    const byTime = normalizeTimestamp(b.timeMs, 0) - normalizeTimestamp(a.timeMs, 0)
    if (byTime !== 0) return byTime

    return normalizeText(b.id).localeCompare(normalizeText(a.id))
  })
}

export function pruneShowcaseChatLocalStorage(): number {
  const now = nowMillis()
  const current = readJson<ChatMessageStorageRecord[]>(SHOWCASE_CHAT_MESSAGES_KEY, [])
  const latestById = new Map<string, ChatMessageStorageRecord>()

  current.forEach(item => {
    const key = chatMessageKey(item)
    if (!key) return
    if (!shouldKeepChatMessage(item, now)) return

    const existing = latestById.get(key)
    if (!existing || normalizeTimestamp(item.timeMs, 0) >= normalizeTimestamp(existing.timeMs, 0)) {
      latestById.set(key, item)
    }
  })

  const byConversation = new Map<string, ChatMessageStorageRecord[]>()
  Array.from(latestById.values()).forEach(item => {
    const key = chatConversationKey(item)
    const existing = byConversation.get(key) || []
    existing.push(item)
    byConversation.set(key, existing)
  })

  const perConversationTrimmed: ChatMessageStorageRecord[] = []
  byConversation.forEach(items => {
    perConversationTrimmed.push(...sortChatMessagesNewestFirst(items).slice(0, CHAT_MAX_MESSAGES_PER_CONVERSATION))
  })

  const next = sortChatMessagesNewestFirst(perConversationTrimmed).slice(0, CHAT_MAX_MESSAGES_GLOBAL)
  const removed = Math.max(0, current.length - next.length)

  if (removed > 0) {
    writeJson(SHOWCASE_CHAT_MESSAGES_KEY, next)
  }

  return removed
}

function chatThreadMetaKey(item: ChatThreadMetaStorageRecord): string {
  return `${normalizeText(item.storeId)}:${normalizeText(item.conversationId)}`
}

function shouldKeepChatThreadMeta(item: ChatThreadMetaStorageRecord, now: number): boolean {
  const storeId = normalizeText(item.storeId)
  const conversationId = normalizeText(item.conversationId)
  if (!storeId || !conversationId) return false

  if (item.isDeleted) {
    const deletedAtMs = normalizeTimestamp(item.deletedAtMs, 0)
    return !isExpired(deletedAtMs, CHAT_DELETED_THREAD_META_MAX_AGE_MS, now)
  }

  return true
}

export function pruneShowcaseChatThreadMetas(): number {
  const now = nowMillis()
  const current = readJson<ChatThreadMetaStorageRecord[]>(SHOWCASE_CHAT_THREAD_META_KEY, [])
  const latestByKey = new Map<string, ChatThreadMetaStorageRecord>()

  current.forEach(item => {
    const key = chatThreadMetaKey(item)
    if (!key || key === ':') return
    if (!shouldKeepChatThreadMeta(item, now)) return

    const existing = latestByKey.get(key)
    const itemSortAt = Math.max(normalizeTimestamp(item.pinnedAtMs, 0), normalizeTimestamp(item.deletedAtMs, 0))
    const existingSortAt = existing
      ? Math.max(normalizeTimestamp(existing.pinnedAtMs, 0), normalizeTimestamp(existing.deletedAtMs, 0))
      : 0

    if (!existing || itemSortAt >= existingSortAt) {
      latestByKey.set(key, item)
    }
  })

  const next = Array.from(latestByKey.values())
    .sort((a, b) => {
      const aSortAt = Math.max(normalizeTimestamp(a.pinnedAtMs, 0), normalizeTimestamp(a.deletedAtMs, 0))
      const bSortAt = Math.max(normalizeTimestamp(b.pinnedAtMs, 0), normalizeTimestamp(b.deletedAtMs, 0))
      return bSortAt - aSortAt
    })
    .slice(0, CHAT_MAX_THREAD_META_GLOBAL)

  const removed = Math.max(0, current.length - next.length)

  if (removed > 0) {
    writeJson(SHOWCASE_CHAT_THREAD_META_KEY, next)
  }

  return removed
}

function normalizeTombstoneKey(item: ChatDeletedMessageTombstoneStorageRecord): string {
  return `${normalizeText(item.storeId)}:${normalizeText(item.conversationId)}:${normalizeText(item.messageId)}`
}

function shouldKeepTombstone(item: ChatDeletedMessageTombstoneStorageRecord, now: number): boolean {
  const key = normalizeTombstoneKey(item)
  if (!key || key === '::') return false

  const deletedAtMs = normalizeTimestamp(item.deletedAtMs, 0)
  return !isExpired(deletedAtMs, CHAT_TOMBSTONE_MAX_AGE_MS, now)
}

export function pruneShowcaseChatTombstones(): number {
  const now = nowMillis()
  let removedTotal = 0

  localStorageKeys()
    .filter(key => key.startsWith(SHOWCASE_CHAT_TOMBSTONE_KEY_PREFIX) && key.endsWith(SHOWCASE_CHAT_TOMBSTONE_KEY_SUFFIX))
    .forEach(key => {
      const current = readJson<ChatDeletedMessageTombstoneStorageRecord[]>(key, [])
      const latestByKey = new Map<string, ChatDeletedMessageTombstoneStorageRecord>()

      current.forEach(item => {
        const tombstoneKey = normalizeTombstoneKey(item)
        if (!tombstoneKey || tombstoneKey === '::') return
        if (!shouldKeepTombstone(item, now)) return

        const existing = latestByKey.get(tombstoneKey)
        if (!existing || normalizeTimestamp(item.deletedAtMs, 0) >= normalizeTimestamp(existing.deletedAtMs, 0)) {
          latestByKey.set(tombstoneKey, item)
        }
      })

      const next = Array.from(latestByKey.values())
        .sort((a, b) => normalizeTimestamp(b.deletedAtMs, 0) - normalizeTimestamp(a.deletedAtMs, 0))
        .slice(0, CHAT_MAX_TOMBSTONES_PER_KEY)

      const removed = Math.max(0, current.length - next.length)
      removedTotal += removed

      if (removed > 0) {
        writeJson(key, next)
      }
    })

  return removedTotal
}

function appointmentIsProtected(item: CloudAppointmentStorageRecord): boolean {
  const syncState = normalizeText(item.syncState).toLowerCase()
  return Boolean(item.dirty) || syncState === 'pending' || syncState === 'failed'
}

function appointmentSortTime(item: CloudAppointmentStorageRecord): number {
  return normalizeTimestamp(item.createdAt, 0)
}

function shouldKeepAppointment(item: CloudAppointmentStorageRecord, now: number): boolean {
  const id = normalizeText(item.id)
  if (!id) return false
  if (appointmentIsProtected(item)) return true

  const createdAt = appointmentSortTime(item)
  return !isExpired(createdAt, APPOINTMENT_CACHE_MAX_AGE_MS, now)
}

export function pruneShowcaseAppointmentCaches(): number {
  const now = nowMillis()
  let trimmedCaches = 0

  localStorageKeys()
    .filter(key => key.startsWith(SHOWCASE_APPOINTMENTS_KEY_PREFIX))
    .forEach(key => {
      const current = readJson<CloudAppointmentStorageRecord[]>(key, [])
      const latestById = new Map<string, CloudAppointmentStorageRecord>()

      current.forEach(item => {
        const id = normalizeText(item.id)
        if (!id) return
        if (!shouldKeepAppointment(item, now)) return

        const existing = latestById.get(id)
        if (!existing || appointmentSortTime(item) >= appointmentSortTime(existing)) {
          latestById.set(id, item)
        }
      })

      const protectedItems = Array.from(latestById.values()).filter(appointmentIsProtected)
      const normalItems = Array.from(latestById.values())
        .filter(item => !appointmentIsProtected(item))
        .sort((a, b) => appointmentSortTime(b) - appointmentSortTime(a))
        .slice(0, Math.max(0, APPOINTMENT_MAX_ITEMS_PER_STORE - protectedItems.length))

      const next = [...protectedItems, ...normalItems]
      const removed = Math.max(0, current.length - next.length)

      if (removed > 0) {
        trimmedCaches += 1
        writeJson(key, next)
      }
    })

  return trimmedCaches
}

export function pruneShowcaseBookingStatusSeenKeys(): number {
  let trimmedKeys = 0

  localStorageKeys()
    .filter(key => key.startsWith(SHOWCASE_BOOKING_STATUS_SEEN_KEY_PREFIX))
    .forEach(key => {
      const current = readJson<string[]>(key, [])
      const unique = Array.from(new Set(current.map(item => normalizeText(item)).filter(Boolean)))
      const next = unique.slice(-BOOKING_STATUS_SEEN_MAX_KEYS)

      if (next.length !== current.length) {
        trimmedKeys += 1
        writeJson(key, next)
      }
    })

  return trimmedKeys
}

function readStoreScopedRecords<T>(key: string): StoreScopedStorageRecord<T>[] {
  return readJson<StoreScopedStorageRecord<T>[]>(key, [])
    .filter(item => {
      const storeId = normalizeText(item.storeId)
      return Boolean(storeId)
    })
}

function writeStoreScopedRecords<T>(key: string, records: StoreScopedStorageRecord<T>[]): void {
  writeJson(key, records)
}

function storeScopedRecordUpdatedAt<T>(record: StoreScopedStorageRecord<T>, fallback: number): number {
  return normalizeTimestamp(record.updatedAt, fallback)
}

function pruneStoreScopedRecordsByAgeAndLimit<T>(
  key: string,
  maxAgeMs: number,
  maxRecords: number,
  now: number
): boolean {
  const current = readStoreScopedRecords<T>(key)

  const next = current
    .filter(item => {
      const updatedAt = storeScopedRecordUpdatedAt(item, now)
      return !isExpired(updatedAt, maxAgeMs, now)
    })
    .sort((left, right) => {
      return storeScopedRecordUpdatedAt(right, 0) - storeScopedRecordUpdatedAt(left, 0)
    })
    .slice(0, maxRecords)

  if (next.length === current.length) return false

  writeStoreScopedRecords(key, next)
  return true
}

function dishStorageRecordSortTime(item: DishStorageRecord): number {
  return normalizeTimestamp(item.updatedAt, 0)
}

function dishStorageRecordIsProtected(item: DishStorageRecord): boolean {
  const syncState = normalizeText(item.syncState).toLowerCase()
  return item.dirty === true || syncState === 'pending' || syncState === 'failed'
}

function shouldKeepDishStorageRecord(item: DishStorageRecord, now: number): boolean {
  const id = normalizeText(item.id)
  if (!id) return false
  if (dishStorageRecordIsProtected(item)) return true

  const updatedAt = dishStorageRecordSortTime(item)
  return !isExpired(updatedAt, DISH_CACHE_MAX_AGE_MS, now)
}

function pruneStoreScopedDishRecords(now: number): boolean {
  const current = readStoreScopedRecords<DishStorageRecord[]>(SHOWCASE_MODELS_DISHES_STORAGE_KEY)
  let changed = false

  const next = current
    .filter(item => {
      const updatedAt = storeScopedRecordUpdatedAt(item, now)
      return !isExpired(updatedAt, DISH_CACHE_MAX_AGE_MS, now)
    })
    .sort((left, right) => {
      return storeScopedRecordUpdatedAt(right, 0) - storeScopedRecordUpdatedAt(left, 0)
    })
    .slice(0, 50)
    .map(item => {
      const value = Array.isArray(item.value) ? item.value : []
      const latestById = new Map<string, DishStorageRecord>()

      value.forEach(dish => {
        const id = normalizeText(dish.id)
        if (!id) return
        if (!shouldKeepDishStorageRecord(dish, now)) return

        const existing = latestById.get(id)
        if (!existing || dishStorageRecordSortTime(dish) >= dishStorageRecordSortTime(existing)) {
          latestById.set(id, dish)
        }
      })

      const protectedItems = Array.from(latestById.values()).filter(dishStorageRecordIsProtected)
      const normalItems = Array.from(latestById.values())
        .filter(dish => !dishStorageRecordIsProtected(dish))
        .sort((left, right) => dishStorageRecordSortTime(right) - dishStorageRecordSortTime(left))
        .slice(0, Math.max(0, DISH_MAX_ITEMS_PER_STORE - protectedItems.length))

      const nextValue = [...protectedItems, ...normalItems]
      if (nextValue.length !== value.length) changed = true

      return {
        ...item,
        value: nextValue
      }
    })

  if (next.length !== current.length) changed = true
  if (!changed) return false

  writeStoreScopedRecords(SHOWCASE_MODELS_DISHES_STORAGE_KEY, next)
  return true
}

function publishedAnnouncementRecordSortTime(item: PublishedAnnouncementStorageRecord): number {
  const updatedAt = normalizeTimestamp(item.updatedAt, 0)
  if (updatedAt > 0) return updatedAt

  return normalizeTimestamp(item.createdAt, 0)
}

function shouldKeepPublishedAnnouncementRecord(item: PublishedAnnouncementStorageRecord, now: number): boolean {
  const id = normalizeText(item.id)
  if (!id) return false

  const updatedAt = publishedAnnouncementRecordSortTime(item)
  return !isExpired(updatedAt, PUBLISHED_ANNOUNCEMENTS_CACHE_MAX_AGE_MS, now)
}

function pruneStoreScopedPublishedAnnouncementRecords(now: number): boolean {
  const current = readStoreScopedRecords<PublishedAnnouncementStorageRecord[]>(SHOWCASE_MODELS_PUBLISHED_ANNOUNCEMENTS_STORAGE_KEY)
  let changed = false

  const next = current
    .filter(item => {
      const updatedAt = storeScopedRecordUpdatedAt(item, now)
      return !isExpired(updatedAt, PUBLISHED_ANNOUNCEMENTS_CACHE_MAX_AGE_MS, now)
    })
    .sort((left, right) => {
      return storeScopedRecordUpdatedAt(right, 0) - storeScopedRecordUpdatedAt(left, 0)
    })
    .slice(0, 50)
    .map(item => {
      const value = Array.isArray(item.value) ? item.value : []
      const latestById = new Map<string, PublishedAnnouncementStorageRecord>()

      value.forEach(announcement => {
        const id = normalizeText(announcement.id)
        if (!id) return
        if (!shouldKeepPublishedAnnouncementRecord(announcement, now)) return

        const existing = latestById.get(id)
        if (!existing || publishedAnnouncementRecordSortTime(announcement) >= publishedAnnouncementRecordSortTime(existing)) {
          latestById.set(id, announcement)
        }
      })

      const nextValue = Array.from(latestById.values())
        .sort((left, right) => publishedAnnouncementRecordSortTime(right) - publishedAnnouncementRecordSortTime(left))
        .slice(0, PUBLISHED_ANNOUNCEMENTS_MAX_ITEMS_PER_STORE)

      if (nextValue.length !== value.length) changed = true

      return {
        ...item,
        value: nextValue
      }
    })

  if (next.length !== current.length) changed = true
  if (!changed) return false

  writeStoreScopedRecords(SHOWCASE_MODELS_PUBLISHED_ANNOUNCEMENTS_STORAGE_KEY, next)
  return true
}

function appointmentModelRecordSortTime(item: CloudAppointmentStorageRecord): number {
  return normalizeTimestamp(item.createdAt, 0)
}

function shouldKeepModelAppointmentRecord(item: CloudAppointmentStorageRecord, now: number): boolean {
  const id = normalizeText(item.id)
  if (!id) return false
  if (appointmentIsProtected(item)) return true

  const createdAt = appointmentModelRecordSortTime(item)
  return !isExpired(createdAt, MODEL_APPOINTMENTS_CACHE_MAX_AGE_MS, now)
}

function pruneStoreScopedAppointmentModelRecords(now: number): boolean {
  const current = readStoreScopedRecords<CloudAppointmentStorageRecord[]>(SHOWCASE_MODELS_APPOINTMENTS_STORAGE_KEY)
  let changed = false

  const next = current
    .filter(item => {
      const updatedAt = storeScopedRecordUpdatedAt(item, now)
      return !isExpired(updatedAt, MODEL_APPOINTMENTS_CACHE_MAX_AGE_MS, now)
    })
    .sort((left, right) => {
      return storeScopedRecordUpdatedAt(right, 0) - storeScopedRecordUpdatedAt(left, 0)
    })
    .slice(0, 50)
    .map(item => {
      const value = Array.isArray(item.value) ? item.value : []
      const latestById = new Map<string, CloudAppointmentStorageRecord>()

      value.forEach(appointment => {
        const id = normalizeText(appointment.id)
        if (!id) return
        if (!shouldKeepModelAppointmentRecord(appointment, now)) return

        const existing = latestById.get(id)
        if (!existing || appointmentModelRecordSortTime(appointment) >= appointmentModelRecordSortTime(existing)) {
          latestById.set(id, appointment)
        }
      })

      const protectedItems = Array.from(latestById.values()).filter(appointmentIsProtected)
      const normalItems = Array.from(latestById.values())
        .filter(appointment => !appointmentIsProtected(appointment))
        .sort((left, right) => appointmentModelRecordSortTime(right) - appointmentModelRecordSortTime(left))
        .slice(0, Math.max(0, MODEL_APPOINTMENTS_MAX_ITEMS_PER_STORE - protectedItems.length))

      const nextValue = [...protectedItems, ...normalItems]
      if (nextValue.length !== value.length) changed = true

      return {
        ...item,
        value: nextValue
      }
    })

  if (next.length !== current.length) changed = true
  if (!changed) return false

  writeStoreScopedRecords(SHOWCASE_MODELS_APPOINTMENTS_STORAGE_KEY, next)
  return true
}

export function pruneShowcaseDishCaches(): number {
  const now = nowMillis()
  return pruneStoreScopedDishRecords(now) ? 1 : 0
}

export function pruneShowcaseStoreScopedModelCaches(): number {
  const now = nowMillis()
  let trimmed = 0

  if (pruneStoreScopedRecordsByAgeAndLimit<Record<string, unknown> | null>(
    SHOWCASE_MODELS_STORE_PROFILE_STORAGE_KEY,
    STORE_PROFILE_CACHE_MAX_AGE_MS,
    50,
    now
  )) {
    trimmed += 1
  }

  if (pruneStoreScopedRecordsByAgeAndLimit<string[]>(
    SHOWCASE_MODELS_MANUAL_CATEGORIES_STORAGE_KEY,
    MANUAL_CATEGORIES_CACHE_MAX_AGE_MS,
    50,
    now
  )) {
    trimmed += 1
  }

  if (pruneStoreScopedPublishedAnnouncementRecords(now)) {
    trimmed += 1
  }

  if (pruneStoreScopedAppointmentModelRecords(now)) {
    trimmed += 1
  }

  return trimmed
}

function readStoreScopedStringList(key: string, storeId: string): string[] {
  const normalizedStoreId = normalizeStoreId(storeId)
  const records = readStoreScopedRecords<string[]>(key)
  const record = records.find(item => normalizeStoreId(item.storeId) === normalizedStoreId)

  if (!record || !Array.isArray(record.value)) return []

  return record.value
    .map(item => normalizeText(item))
    .filter(Boolean)
}

function writeStoreScopedStringList(key: string, storeId: string, value: string[]): void {
  const normalizedStoreId = normalizeStoreId(storeId)
  const records = readStoreScopedRecords<string[]>(key)
  const nextValue = Array.from(new Set(value.map(item => normalizeText(item)).filter(Boolean))).sort()
  const nextRecords = [
    ...records.filter(item => normalizeStoreId(item.storeId) !== normalizedStoreId),
    {
      storeId: normalizedStoreId,
      value: nextValue,
      updatedAt: nowMillis()
    }
  ]

  writeStoreScopedRecords(key, nextRecords)
}

export function pruneAnnouncementLocalMarksByValidIds(
  storeIdInput: string,
  validAnnouncementIdsInput: string[]
): number {
  const storeId = normalizeStoreId(storeIdInput)
  const validIds = new Set(validAnnouncementIdsInput.map(item => normalizeText(item)).filter(Boolean))
  if (!validIds.size) return 0

  let changed = 0

  const viewed = readStoreScopedStringList(SHOWCASE_MODELS_VIEWED_ANNOUNCEMENT_IDS_STORAGE_KEY, storeId)
  const nextViewed = viewed.filter(item => validIds.has(item))

  if (nextViewed.length !== viewed.length) {
    writeStoreScopedStringList(SHOWCASE_MODELS_VIEWED_ANNOUNCEMENT_IDS_STORAGE_KEY, storeId, nextViewed)
    changed += 1
  }

  const counted = readStoreScopedStringList(SHOWCASE_MODELS_COUNTED_ANNOUNCEMENT_CLICK_IDS_STORAGE_KEY, storeId)
  const nextCounted = counted.filter(item => validIds.has(item))

  if (nextCounted.length !== counted.length) {
    writeStoreScopedStringList(SHOWCASE_MODELS_COUNTED_ANNOUNCEMENT_CLICK_IDS_STORAGE_KEY, storeId, nextCounted)
    changed += 1
  }

  return changed
}

export function pruneBookingStatusSeenByValidIds(
  storeIdInput: string,
  clientIdInput: string,
  validAppointmentIdsInput: string[]
): boolean {
  const storeId = normalizeStoreId(storeIdInput)
  const clientId = normalizeText(clientIdInput)
  if (!clientId) return false

  const validIds = new Set(validAppointmentIdsInput.map(item => normalizeText(item)).filter(Boolean))
  if (!validIds.size) return false

  const key = `${SHOWCASE_BOOKING_STATUS_SEEN_KEY_PREFIX}${storeId}_${clientId}`
  const current = readJson<string[]>(key, [])
  const next = current
    .map(item => normalizeText(item))
    .filter(Boolean)
    .filter(item => {
      const appointmentId = item.split(':')[0]?.trim() || ''
      return appointmentId && validIds.has(appointmentId)
    })
    .slice(-BOOKING_STATUS_SEEN_MAX_KEYS)

  if (next.length === current.length) return false

  writeJson(key, next)
  return true
}

export function pruneLegacyMerchantSession(): boolean {
  return removeStorageValue(SHOWCASE_LEGACY_MERCHANT_SESSION_KEY)
}

export function shouldRunShowcaseLocalCacheMaintenance(now = nowMillis()): boolean {
  const lastRun = Number(readJson<number>(MAINTENANCE_LAST_RUN_KEY, 0))
  if (!Number.isFinite(lastRun) || lastRun <= 0) return true

  return now - lastRun >= MAINTENANCE_INTERVAL_MS
}

export function markShowcaseLocalCacheMaintenanceRun(now = nowMillis()): void {
  writeJson(MAINTENANCE_LAST_RUN_KEY, now)
}

export function runShowcaseLocalCacheMaintenance(
  storeIdInput: string,
  options: { force?: boolean } = {}
): ShowcaseLocalCacheMaintenanceResult {
  void normalizeStoreId(storeIdInput)

  if (typeof window === 'undefined') {
    return emptyResult('not-browser')
  }

  if (!canUseLocalStorage()) {
    return emptyResult('storage-unavailable')
  }

  const now = nowMillis()
  if (!options.force && !shouldRunShowcaseLocalCacheMaintenance(now)) {
    return emptyResult('throttled')
  }

  const result: ShowcaseLocalCacheMaintenanceResult = {
    didRun: true,
    reason: 'completed',
    removedTempImages: pruneShowcaseLocalTempImages(),
    removedPendingCamera: pruneShowcasePendingChatCamera(),
    removedChatDrafts: pruneShowcaseChatDrafts(),
    removedChatMessages: pruneShowcaseChatLocalStorage(),
    removedChatThreadMetas: pruneShowcaseChatThreadMetas(),
    removedChatTombstones: pruneShowcaseChatTombstones(),
    trimmedAppointmentCaches: pruneShowcaseAppointmentCaches(),
    trimmedBookingStatusSeenKeys: pruneShowcaseBookingStatusSeenKeys(),
    trimmedStoreScopedModelCaches: pruneShowcaseStoreScopedModelCaches(),
    trimmedDishCaches: pruneShowcaseDishCaches(),
    removedLegacyMerchantSession: pruneLegacyMerchantSession()
  }

  markShowcaseLocalCacheMaintenanceRun(now)
  return result
}