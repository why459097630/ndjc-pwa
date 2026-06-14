'use client'

import {
  NDJC_SHOWCASE_APP_LIFECYCLE_EVENT,
  readShowcaseAppLifecycleSnapshot,
  type ShowcaseAppLifecycleDetail
} from '@/pwa/showcaseAppLifecycle'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  clearAdminAnnouncementEditorDraftFromStorage,
  clearItemEditorDraftFromStorage,
  deriveAllTags,
  deriveCategories as deriveCategoriesFromModels,
  getDishPrice,
  getDishTitle,
  initialDishes,
  loadAdminAnnouncementEditorDraftFromStorage,
  loadCountedAnnouncementClickIdsFromStorage,
  loadDishesFromStorage,
  loadFavoriteAddedAtFromStorage,
  loadFavoriteIdsFromStorage,
  loadFavoriteSnapshotsFromStorage,
  loadItemEditorDraftFromStorage,
  loadManualCategoriesFromStorage,
  loadPublishedAnnouncementsFromStorage,
  loadStoreProfileFromStorage,
  loadViewedAnnouncementIdsFromStorage,
  saveAdminAnnouncementEditorDraftToStorage,
  saveCountedAnnouncementClickIdsToStorage,
  saveDishesToStorage,
  saveFavoriteAddedAtToStorage,
  saveFavoriteIdsToStorage,
  saveFavoriteSnapshotsToStorage,
  saveItemEditorDraftToStorage,
  saveManualCategoriesToStorage,
  savePublishedAnnouncementsToStorage,
  saveStoreProfileToStorage,
  saveViewedAnnouncementIdsToStorage,
  type CachedAdminAnnouncementEditorDraft,
  type CachedItemEditorDraft,
  type CachedPublishedAnnouncement,
  type DemoDish,
  type ShowcaseFavoriteSnapshot,
  type ShowcaseImageVariants,
  type StoreProfile,
  type SyncState
} from '../showcaseModels'
import {
  createRemoteOnlyShowcaseImageVariants,
  selectDishImageUrl,
  selectImageVariantUrl,
  selectStoreCoverUrl,
  selectStoreLogoUrl
} from '../showcaseImageVariants'
import {
  createShowcaseCloudRepository,
  type ChatConversation,
  type ChatMessage,
  type ChatThreadSummary,
  type CloudAnnouncement,
  type CloudAppointmentFilterRow,
  type CloudAppointmentRequest,
  type CloudAppointmentSettings,
  type CloudCategory,
  type CloudDishFilterRow,
  type CloudStoreProfile,
  type CloudStorePwaProfile,
  type CloudStoreServiceStatus,
  type MerchantAuthSession,
  type MerchantStoreMembership,
  type ShowcaseCloudRepository
} from '../showcaseCloudRepository'
import {
  SHOWCASE_APP_VERSION,
  SHOWCASE_OFFICIAL_WEBSITE_URL,
  SHOWCASE_PAGE_SIZE
} from '../showcaseCloudConfig'
import {
  pruneAnnouncementLocalMarksByValidIds,
  pruneBookingStatusSeenByValidIds,
  runShowcaseLocalCacheMaintenance
} from '../showcaseLocalCacheMaintenance'
import {
  clearPersistedMerchantSession,
  persistCurrentMerchantSession,
  readLastMerchantLoginName,
  readMerchantSession as readMerchantSessionFromPreferences,
  readRememberMe as readRememberMeFromPreferences,
  restoreMerchantSessionFromStorage,
  updateMerchantLoginName as updateMerchantLoginNameInSession,
  writeMerchantSession as writeMerchantSessionToPreferences,
  writeRememberMe as writeRememberMeToPreferences
} from '../showcaseMerchantAuthPreferences'
import {
  cleanupShowcaseBusinessCache,
  loadShowcaseBusinessCache,
  saveShowcaseBusinessCache
} from '../showcaseBusinessIndexedDb'
import {
  loadShowcasePendingSyncQueue,
  saveShowcasePendingSyncQueue
} from '../showcasePendingSyncIndexedDb'
import {
  bindMerchantSessionToRepository,
  clearMerchantSession as clearStoreMerchantSession,
  isMerchantLoggedIn as isMerchantLoggedInInStoreSession,
  setCurrentStoreId,
  setMerchantSessionFromAuthSession as setStoreMerchantSessionFromAuthSession,
  updateMerchantLoginName as updateMerchantLoginNameInStoreSession
} from '../showcaseStoreSession'
import { createShowcaseCloudRepositoryConfig } from '../showcaseCloudConfig'
import {
  getFreshShowcaseAuthSession,
  onShowcaseAuthStateChange,
  restoreShowcaseAuthSession,
  type ShowcaseAuthSessionSnapshot
} from '../showcaseAuthSessionManager'
import {
  formatShowcaseDateAndTimeParts,
  formatShowcaseDateTime,
  parseShowcaseDateInput
} from '../showcaseDateTime'
import {
  markConversationRecentlySeen as markRuntimeConversationRecentlySeen,
  markConversationVisible as markRuntimeConversationVisible,
  setActiveConversationId as setRuntimeActiveConversationId,
  setChatVisible as setRuntimeChatVisible,
  shouldSuppressChatPush as shouldSuppressRuntimeChatPush
} from '../showcaseRuntimeState'
import {
  consumeShowcasePushRoute,
  dispatchShowcasePushRouteFromLocationSearch,
  installShowcasePushRouter,
  subscribeShowcasePushRoute,
  type ShowcasePushRoute
} from '../showcasePushRouter'
import {
  applyChatDraftImagePicked,
  applyChatDraftImagesPicked,
  applyPendingAppointmentForChat,
  applyPendingProductForChat,
  buildChatDraftClearPlan,
  buildChatDraftImageUploadPlan,
  buildChatMessageSendPlan,
  buildChatSendOperationResult,
  buildPendingAppointmentShareSendPlan,
  buildPendingProductShareSendPlan,
  buildProductSharePayloadForClipboard,
  cancelQuote as cancelQuoteInDomain,
  clearJumpOnExit,
  clearLocalChatState,
  closeFind as closeFindInDomain,
  deleteSelectedMessagesFromState,
  enterSelection as enterSelectionInDomain,
  exitSelection as exitSelectionInDomain,
  findNext as findNextInDomain,
  findPrev as findPrevInDomain,
  jumpToMessage as jumpToMessageInDomain,
  markRetryResult,
  markRetrySending,
  normalizeChatSendErrorMessage,
  onFindQueryChange as onFindQueryChangeInDomain,
  openFind as openFindInDomain,
  parseNdjcChatPayload,
  parseNdjcProductSharePayload,
  quoteMessage as quoteMessageInDomain,
  resolveChatQuotePreviewForSend,
  toShowcaseChatDomainMessage,
  toggleSelection as toggleSelectionInDomain
} from '../chat/showcaseChatDomain'
import {
  buildMerchantThreadAliasOperationResult,
  buildMerchantThreadDeleteResetPlan,
  buildMerchantThreadPinOperationResult,
  buildMerchantThreadsWithLocalMeta as buildMerchantThreadsWithLocalMetaInDomain,
  buildMerchantThreadsFromCloudSummaries,
  buildThreadPreview,
  chatThreadSummaryToUi as chatThreadSummaryToUiFromDomain,
  cloudThreadSummaryToLegacyChatThread,
  removeMerchantThread
} from '../chat/showcaseChatListDomain'
import {
  createShowcaseChatCloudRepository
} from '../chat/showcaseChatCloudRepository'
import {
  createShowcaseChatRepository,
  type ChatMessageEntity,
  type CloudThreadSummary,
  type ShowcaseChatRepository
} from '../chat/showcaseChatRepository'
import type {
  ShowcaseChatMessageUi as ShowcaseChatDomainMessageUi,
  ShowcaseChatUiStateDomain
} from '../chat/showcaseChatModels'
import {
  ShowcaseRetryOps,
  ShowcaseScreens,
  SyncOverviewStates,
  createDefaultShowcaseChatUiState,
  createDefaultShowcaseUiState
} from '../showcaseUiState'
import {
  createShowcaseUiWiring,
  type ShowcaseUiWiring
} from '../showcaseUiWiring'
import type {
  AdminEntryMode,
  ShowcaseAdminActions,
  ShowcaseAdminAppointmentsActions,
  ShowcaseAdminAppointmentsUiState,
  ShowcaseAdminUiState,
  ShowcaseAppointmentSettingsSaveInput,
  ShowcaseAnnouncementCard,
  ShowcaseAnnouncementEditActions,
  ShowcaseAnnouncementEditUiState,
  ShowcaseAnnouncementsActions,
  ShowcaseAnnouncementsUiState,
  ShowcaseAppointment,
  ShowcaseAppointmentCard,
  ShowcaseAppointmentDateOption,
  ShowcaseAppointmentsActions,
  ShowcaseAppointmentsUiState,
  ShowcaseBottomNavigationActions,
  ShowcaseChangePasswordActions,
  ShowcaseChangePasswordUiState,
  ShowcaseChatActions,
  ShowcaseChatAppointmentShare,
  ShowcaseChatMediaActions,
  ShowcaseChatMediaItemUi,
  ShowcaseChatMessage,
  ShowcaseChatProductShare,
  ShowcaseChatSearchResultUi,
  ShowcaseChatThreadSummaryUi,
  ShowcaseChatUiState,
  ShowcaseChatWindowMode,
  ShowcaseCloudStatusUi,
  ShowcaseCustomerBookingsActions,
  ShowcaseCustomerBookingsUiState,
  ShowcaseDetailActions,
  ShowcaseDetailUiState,
  ShowcaseEditDishActions,
  ShowcaseEditDishUiState,
  ShowcaseExtraContact,
  ShowcaseFavoriteCard,
  ShowcaseFavoritesActions,
  ShowcaseFavoritesUiState,
  ShowcaseHomeActions,
  ShowcaseHomeDish,
  ShowcaseHomeSortMode,
  ShowcaseHomeUiState,
  ShowcaseLoginActions,
  ShowcaseLoginUiState,
  ShowcaseMerchantChatListActions,
  ShowcaseOfflineStatusUi,
  ShowcaseRetryOp,
  ShowcaseScreen,
  ShowcaseScreenName,
  ShowcaseStoreProfile,
  ShowcaseStoreProfileActions,
  ShowcaseStoreProfileDraft,
  ShowcaseStoreProfileUiState,
  ShowcaseStoreUnavailableUiState,
  ShowcaseSyncOverviewState,
  ShowcaseUiModel,
  ShowcaseUiState,
  SyncOverviewState
} from '../showcaseUiContract'

export type { ShowcaseScreenName } from '../showcaseUiContract'

export type UseShowcaseViewModelInput = {
  storeId?: string | null
  appName?: string | null
  privacyUrl?: string | null
  merchantEmail?: string | null
  initialScreen?: ShowcaseScreenName
  previewMode?: boolean
  repository?: ShowcaseCloudRepository | null
}

export type PendingSyncStatus = 'pending' | 'syncing' | 'failed'

export type PendingSyncMetadata = {
  status?: PendingSyncStatus
  retryCount?: number
  lastError?: string | null
  nextRetryAt?: number | null
  updatedAt?: number
}

export type PendingSyncOperation =
  | ({
      id: string
      type: 'dish-upsert'
      dishId: string
      createdAt: number
    } & PendingSyncMetadata)
  | ({
      id: string
      type: 'dish-delete'
      dishId: string
      createdAt: number
    } & PendingSyncMetadata)
  | ({
      id: string
      type: 'store-profile-upsert'
      createdAt: number
    } & PendingSyncMetadata)
  | ({
      id: string
      type: 'announcement-upsert'
      announcementId: string
      createdAt: number
    } & PendingSyncMetadata)
  | ({
      id: string
      type: 'appointment-settings-upsert'
      createdAt: number
    } & PendingSyncMetadata)

export type PendingDeleteCategoryDialog = {
  name: string
  id: string | null
} | null

export type ChatSearchResult = {
  conversationId: string
  messageId: string | null
  senderLabel: string
  snippet: string
  createdAtText: string
  createdAtMs: number
  matchedInName: boolean
}

export type ChatMediaItem = {
  conversationId: string
  messageId: string
  url: string
  createdAtText: string
  createdAtMs: number
}

export type ChatMode = 'Client' | 'Merchant'

export const CHAT_LATEST_WINDOW_MAX_MESSAGES = 180
export const CHAT_AROUND_MESSAGE_WINDOW_MAX_MESSAGES = 240

export type ChatMessageWindowRuntimeState = {
  mode: ShowcaseChatWindowMode
  anchorMessageId: string | null
  hasOlder: boolean
  hasNewer: boolean
  isLoadingOlder: boolean
  isLoadingNewer: boolean
  oldestTimeMs: number | null
  newestTimeMs: number | null
}

export type ShowcasePaginationRuntimeState = {
  nextOffset: number
  hasMore: boolean
  isLoadingMore: boolean
}

export type AppointmentCloudQueryFilters = {
  preferredDate?: string | null
  preferredDateGte?: string | null
  preferredDateLt?: string | null
  status?: string | null
  cancelledBy?: string | null
  cancelledByNot?: string | null
  serviceTitle?: string | null
}

export type DishCloudQueryFilters = {
  categoryName?: string | null
  searchQuery?: string | null
  selectedTags?: string[]
  recommendedOnly?: boolean
  onSaleOnly?: boolean
  minPrice?: number | null
  maxPrice?: number | null
  hiddenOnly?: boolean
  includeHidden?: boolean
  sortMode?: ShowcaseHomeSortMode
}

export type DraftExtraContact = {
  id: string
  name: string
  value: string
}

export type DraftAnnouncement = {
  id: string
  coverUrl: string | null
  coverImageVariants: ShowcaseImageVariants | null
  body: string
  status: 'draft' | 'published'
  createdAt: number
  updatedAt: number
  viewCount: number
}

export type LocalTempImageRecord = {
  storeId: string
  scope: 'edit-dish' | 'admin-announcement' | 'store-profile' | 'chat-camera' | 'chat-draft'
  url: string
  createdAt: number
}

export type LocalFavoriteStore = {
  storeId: string
  ids: string[]
}

export type LocalChatDraftStore = {
  storeId: string
  conversationId: string
  draft: string
  draftImageUrls: string[]
  pendingProduct: ShowcaseChatProductShare | null
  pendingAppointment: ShowcaseChatAppointmentShare | null
  quotedMessageId: string | null
}

export const SHOWCASE_CLIENT_ID_KEY = 'ndjc_showcase_client_id'
export const SHOWCASE_FAVORITES_KEY = 'ndjc_showcase_favorites'
export const SHOWCASE_CHAT_DRAFT_KEY = 'ndjc_showcase_chat_draft'
export const SHOWCASE_STORE_PROFILE_DRAFT_KEY = 'ndjc_showcase_store_profile_draft'
export const SHOWCASE_VIEWED_ANNOUNCEMENT_IDS_KEY = 'ndjc_showcase_viewed_announcement_ids'
export const SHOWCASE_COUNTED_ANNOUNCEMENT_CLICK_IDS_KEY = 'ndjc_showcase_counted_announcement_click_ids'
export const SHOWCASE_PUBLISHED_ANNOUNCEMENTS_KEY = 'ndjc_showcase_published_announcements'
export const SHOWCASE_ITEM_EDITOR_DRAFT_KEY = 'ndjc_showcase_item_editor_draft'
export const SHOWCASE_ADMIN_ANNOUNCEMENT_EDITOR_DRAFT_KEY = 'ndjc_showcase_admin_announcement_editor_draft'
export const SHOWCASE_LOCAL_TEMP_IMAGES_KEY = 'ndjc_showcase_local_temp_images'
export const SHOWCASE_PENDING_CHAT_CAMERA_KEY = 'ndjc_showcase_pending_chat_camera'
export const NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY = 'ndjc_pwa_device_install_id'

export const DEFAULT_CUSTOMER_NAME = 'Customer'
export const DEFAULT_CHAT_INPUT_PLACEHOLDER = 'Message'
export const DEFAULT_APPOINTMENT_STATUS = 'Pending'
export const LOCAL_TEMP_IMAGE_MAX_AGE_MS = 24 * 60 * 60 * 1000
export const NDJC_CHAT_VISIBILITY_HEARTBEAT_MS = 1000

export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function canUseLocalStorage(): boolean {
  if (!isBrowser()) return false

  try {
    return typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

export function postChatVisibilityToServiceWorker(input: {
  visible: boolean
  conversationId: string | null | undefined
  screen: ShowcaseScreenName | string
  clientId?: string | null
  chatRole?: string | null
}): void {
  if (!isBrowser()) return

  const controller = window.navigator.serviceWorker?.controller
  if (!controller) return

  controller.postMessage({
    type: 'NDJC_CHAT_VISIBILITY',
    visible: input.visible,
    conversation_id: String(input.conversationId || '').trim(),
    conversationId: String(input.conversationId || '').trim(),
    screen: String(input.screen || ''),
    client_id: String(input.clientId || '').trim(),
    clientId: String(input.clientId || '').trim(),
    chat_role: String(input.chatRole || '').trim(),
    chatRole: String(input.chatRole || '').trim()
  })
}

export function nowMillis(): number {
  return Date.now()
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

export function createId(prefix: string): string {
  return `${prefix}_${createUuidLikeId()}`
}

export function createPwaDeviceInstallId(): string {
  return createId('web')
}

export function getOrCreatePwaDeviceInstallId(): string {
  if (!canUseLocalStorage()) {
    return createPwaDeviceInstallId()
  }

  const existing = window.localStorage.getItem(NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY)
  if (existing && existing.trim()) {
    return existing.trim()
  }

  const created = createPwaDeviceInstallId()
  window.localStorage.setItem(NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY, created)
  return created
}

export function normalizeStoreId(storeId: string | null | undefined): string {
  const value = String(storeId || '').trim()

  if (!value) {
    throw new Error('storeId is required for showcase view model.')
  }

  return value
}

export function normalizeText(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return fallback
}

export function normalizeNullableText(value: unknown): string | null {
  const text = normalizeText(value).trim()
  return text || null
}

export function normalizeNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

export function normalizeBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const text = value.trim().toLowerCase()
    if (text === 'true' || text === '1' || text === 'yes') return true
    if (text === 'false' || text === '0' || text === 'no') return false
  }
  return fallback
}

export function readJson<T>(key: string, fallback: T): T {
  if (!canUseLocalStorage()) return fallback

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (!canUseLocalStorage()) return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // local persistence is best effort in PWA runtime
  }
}

export function appointmentsStorageKey(storeId: string): string {
  return `ndjc_showcase_appointments_${normalizeStoreId(storeId)}`
}

export function loadAppointmentsFromStorage(storeId: string): CloudAppointmentRequest[] {
  return readJson<CloudAppointmentRequest[]>(appointmentsStorageKey(storeId), [])
    .map(item => {
      return {
        id: String(item.id || ''),
        storeId: String(item.storeId || normalizeStoreId(storeId)),
        clientId: String(item.clientId || ''),
        customerName: String(item.customerName || ''),
        customerContact: String(item.customerContact || ''),
        serviceTitle: String(item.serviceTitle || ''),
        preferredDate: String(item.preferredDate || ''),
        preferredTime: String(item.preferredTime || ''),
        note: String(item.note || ''),
        sourceDishId: item.sourceDishId ? String(item.sourceDishId) : null,
        sourcePriceSnapshot: item.sourcePriceSnapshot ? String(item.sourcePriceSnapshot) : null,
        sourceImageUrlSnapshot: item.sourceImageUrlSnapshot ? String(item.sourceImageUrlSnapshot) : null,
        sourceCategorySnapshot: item.sourceCategorySnapshot ? String(item.sourceCategorySnapshot) : null,
        sourceRecommendedSnapshot: Boolean(item.sourceRecommendedSnapshot),
        status: String(item.status || 'pending'),
        cancelledBy: item.cancelledBy ? String(item.cancelledBy) : null,
        cancelledAt: typeof item.cancelledAt === 'number' ? item.cancelledAt : null,
        createdAt: typeof item.createdAt === 'number' ? item.createdAt : null
      }
    })
    .filter(item => item.id.trim())
}

export function saveAppointmentsToStorage(storeId: string, items: CloudAppointmentRequest[]): void {
  writeJson(appointmentsStorageKey(storeId), items)
}

export function appointmentStatusAlertSeenStorageKey(storeId: string, clientId: string): string {
  return `ndjc_showcase_booking_status_alerts_seen_${normalizeStoreId(storeId)}_${String(clientId || '').trim()}`
}

export function appointmentStatusAlertKey(appointmentIdInput: string, statusInput: string): string {
  const appointmentId = String(appointmentIdInput || '').trim()
  const status = String(statusInput || '').trim()

  return `${appointmentId}:${status}`
}

export function isCustomerBookingAlertStatus(statusInput: string): boolean {
  const status = String(statusInput || '').trim()

  return status === 'Confirmed' || status === 'Cancelled'
}

export function loadSeenAppointmentStatusAlertKeys(storeId: string, clientId: string): string[] {
  return readJson<string[]>(appointmentStatusAlertSeenStorageKey(storeId, clientId), [])
    .map(item => String(item || '').trim())
    .filter(Boolean)
}

export function saveSeenAppointmentStatusAlertKeys(storeId: string, clientId: string, keys: string[]): void {
  writeJson(
    appointmentStatusAlertSeenStorageKey(storeId, clientId),
    Array.from(new Set(keys.map(item => String(item || '').trim()).filter(Boolean)))
  )
}

export function removeStoredValue(key: string): void {
  if (!canUseLocalStorage()) return

  try {
    window.localStorage.removeItem(key)
  } catch {
    // local persistence is best effort in PWA runtime
  }
}

export function readClientId(): string {
  if (!canUseLocalStorage()) return `client_${createId('memory')}`

  try {
    const existing = window.localStorage.getItem(SHOWCASE_CLIENT_ID_KEY)
    if (existing) return existing

    const next = createId('client')
    window.localStorage.setItem(SHOWCASE_CLIENT_ID_KEY, next)
    return next
  } catch {
    return `client_${createId('memory')}`
  }
}

export function readRememberMe(storeId: string): boolean {
  return readRememberMeFromPreferences(storeId)
}

export function writeRememberMe(storeId: string, value: boolean): void {
  writeRememberMeToPreferences(storeId, value)
}

export function readMerchantSession(storeId: string): MerchantAuthSession | null {
  return readMerchantSessionFromPreferences(storeId)
}

export function writeMerchantSession(storeId: string, session: MerchantAuthSession | null): void {
  writeMerchantSessionToPreferences(storeId, session)
}

export function readFavoriteIds(storeId: string): string[] {
  return loadFavoriteIdsFromStorage(storeId)
}

export function writeFavoriteIds(storeId: string, ids: string[]): void {
  saveFavoriteIdsToStorage(storeId, ids)
}

export function readChatDraft(storeId: string, conversationId: string): LocalChatDraftStore | null {
  const all = readJson<LocalChatDraftStore[]>(SHOWCASE_CHAT_DRAFT_KEY, [])
  return all.find(item => item.storeId === storeId && item.conversationId === conversationId) || null
}

export function writeChatDraft(value: LocalChatDraftStore): void {
  const all = readJson<LocalChatDraftStore[]>(SHOWCASE_CHAT_DRAFT_KEY, [])
  const next = [
    ...all.filter(item => item.storeId !== value.storeId || item.conversationId !== value.conversationId),
    value
  ]

  writeJson(SHOWCASE_CHAT_DRAFT_KEY, next)
}

export function clearChatDraft(storeId: string, conversationId: string): void {
  const cleanStoreId = storeId.trim()
  const cleanConversationId = conversationId.trim()

  if (!cleanStoreId || !cleanConversationId) return

  const all = readJson<LocalChatDraftStore[]>(SHOWCASE_CHAT_DRAFT_KEY, [])
  const deleting = all.find(item => item.storeId === cleanStoreId && item.conversationId === cleanConversationId) || null

  deleting?.draftImageUrls
    ?.map(item => item.trim())
    .filter(Boolean)
    .forEach(url => {
      deleteAppOwnedLocalFileUri(cleanStoreId, url)
    })

  writeJson(
    SHOWCASE_CHAT_DRAFT_KEY,
    all.filter(item => item.storeId !== cleanStoreId || item.conversationId !== cleanConversationId)
  )
}

export function loadViewedAnnouncementIdsLocally(storeId: string): string[] {
  return loadViewedAnnouncementIdsFromStorage(storeId)
}

export function saveViewedAnnouncementIdsLocally(storeId: string, ids: string[]): void {
  saveViewedAnnouncementIdsToStorage(storeId, ids)
}

export function loadCountedAnnouncementClickIdsLocally(storeId: string): string[] {
  return loadCountedAnnouncementClickIdsFromStorage(storeId)
}

export function saveCountedAnnouncementClickIdsLocally(storeId: string, ids: string[]): void {
  saveCountedAnnouncementClickIdsToStorage(storeId, ids)
}

export function toCachedPublishedAnnouncement(item: CloudAnnouncement): CachedPublishedAnnouncement {
  return {
    id: item.id,
    coverUrl: item.coverUrl,
    body: item.body,
    updatedAt: item.updatedAt ?? item.createdAt ?? Date.now(),
    viewCount: item.viewCount
  }
}

export function fromCachedPublishedAnnouncement(storeId: string, item: CachedPublishedAnnouncement): CloudAnnouncement {
  return {
    id: item.id,
    storeId,
    coverUrl: item.coverUrl,
    body: item.body,
    status: 'published',
    updatedAt: item.updatedAt,
    createdAt: item.updatedAt,
    viewCount: item.viewCount
  }
}

export function loadPublishedAnnouncementsLocally(storeId: string): CloudAnnouncement[] {
  return loadPublishedAnnouncementsFromStorage(storeId)
    .map(item => fromCachedPublishedAnnouncement(storeId, item))
}

export async function loadDishesFromIndexedDb(storeId: string): Promise<DemoDish[]> {
  const items = await loadShowcaseBusinessCache<DemoDish[]>(storeId, 'dishes', [])

  return Array.isArray(items)
    ? items.filter(item => Boolean(item && typeof item === 'object' && String(item.id || '').trim()))
    : []
}

export async function loadStoreProfileFromIndexedDb(storeId: string): Promise<StoreProfile | null> {
  const profile = await loadShowcaseBusinessCache<StoreProfile | null>(storeId, 'store-profile', null)

  if (!profile || typeof profile !== 'object') return null

  return profile
}

export async function loadPublishedAnnouncementsFromIndexedDb(storeId: string): Promise<CloudAnnouncement[]> {
  const items = await loadShowcaseBusinessCache<CloudAnnouncement[]>(storeId, 'announcements', [])

  return Array.isArray(items)
    ? items.filter(item => Boolean(item && typeof item === 'object' && String(item.id || '').trim()))
    : []
}

export async function loadAppointmentsFromIndexedDb(storeId: string): Promise<CloudAppointmentRequest[]> {
  const items = await loadShowcaseBusinessCache<CloudAppointmentRequest[]>(storeId, 'appointments', [])

  return Array.isArray(items)
    ? items.filter(item => Boolean(item && typeof item === 'object' && String(item.id || '').trim()))
    : []
}

export function persistDishesLocally(storeId: string, items: DemoDish[]): void {
  saveDishesToStorage(storeId, items)
  void saveShowcaseBusinessCache(storeId, 'dishes', items)
}

export function persistStoreProfileLocally(storeId: string, profile: StoreProfile): void {
  saveStoreProfileToStorage(storeId, profile)
  void saveShowcaseBusinessCache(storeId, 'store-profile', profile)
}

export function persistAppointmentsLocally(storeId: string, items: CloudAppointmentRequest[]): void {
  saveAppointmentsToStorage(storeId, items)
  void saveShowcaseBusinessCache(storeId, 'appointments', items)
}

export function persistPublishedAnnouncementsLocally(storeId: string, items: CloudAnnouncement[]): void {
  savePublishedAnnouncementsToStorage(storeId, items.map(toCachedPublishedAnnouncement))
  void saveShowcaseBusinessCache(storeId, 'announcements', items)
}

export function pruneAnnouncementMarksWhenCompletePageLoaded(
  storeId: string,
  items: CloudAnnouncement[],
  latestLength: number,
  pageSize: number
): void {
  if (latestLength >= pageSize) return

  pruneAnnouncementLocalMarksByValidIds(
    storeId,
    items
      .filter(item => item.status === 'published')
      .map(item => item.id)
  )
}

export function pruneBookingSeenWhenCompletePageLoaded(
  storeId: string,
  clientId: string,
  items: CloudAppointmentRequest[],
  latestLength: number,
  pageSize: number
): void {
  if (latestLength >= pageSize) return

  pruneBookingStatusSeenByValidIds(
    storeId,
    clientId,
    items.map(item => item.id)
  )
}

export function loadItemEditorDraftLocally(
  storeId: string,
  mode: 'new' | 'edit' | 'any' = 'any'
): CachedItemEditorDraft | null {
  const draft = loadItemEditorDraftFromStorage(storeId)
  if (!draft) return null

  if (mode === 'new' && draft.isNew !== true) return null
  if (mode === 'edit' && draft.isNew !== false) return null

  return draft
}

export function persistItemEditorDraftLocally(
  storeId: string,
  draft: CachedItemEditorDraft
): void {
  const editingId = draft.editingId?.trim() || null
  const name = draft.name.trim()
  const price = draft.price.trim()
  const discountPrice = draft.discountPrice.trim()
  const description = draft.description.trim()
  const category = draft.category?.trim() || null

  if (
    !editingId &&
    !name &&
    !price &&
    !discountPrice &&
    !description &&
    !category
  ) {
    clearItemEditorDraftFromStorage(storeId)
    return
  }

  saveItemEditorDraftToStorage(storeId, {
    editingId,
    isNew: draft.isNew,
    name,
    price,
    discountPrice,
    description,
    category
  })
}

export function clearItemEditorDraftLocally(storeId: string): void {
  clearItemEditorDraftFromStorage(storeId)
}

export function loadAdminAnnouncementEditorDraftLocally(storeId: string): DraftAnnouncement | null {
  const draft = loadAdminAnnouncementEditorDraftFromStorage(storeId)
  if (!draft) return null

  return {
    id: draft.editingId || '',
    coverUrl: draft.coverUrl ?? null,
    coverImageVariants: null,
    body: draft.body,
    status: 'draft',
    createdAt: draft.updatedAt ?? Date.now(),
    updatedAt: draft.updatedAt ?? Date.now(),
    viewCount: 0
  }
}

export function persistAdminAnnouncementEditorDraftLocally(storeId: string, draft: DraftAnnouncement): void {
  const nextDraft: CachedAdminAnnouncementEditorDraft = {
    editingId: draft.id || null,
    body: draft.body,
    coverUrl: draft.coverUrl,
    updatedAt: draft.updatedAt || Date.now()
  }

  saveAdminAnnouncementEditorDraftToStorage(storeId, nextDraft)
}

export function clearAdminAnnouncementEditorDraftLocally(storeId: string): void {
  clearAdminAnnouncementEditorDraftFromStorage(storeId)
}

export function loadLocalTempImages(storeId: string): LocalTempImageRecord[] {
  const all = readJson<LocalTempImageRecord[]>(SHOWCASE_LOCAL_TEMP_IMAGES_KEY, [])
  return all.filter(item => item.storeId === storeId)
}

export function saveLocalTempImages(storeId: string, items: LocalTempImageRecord[]): void {
  const all = readJson<LocalTempImageRecord[]>(SHOWCASE_LOCAL_TEMP_IMAGES_KEY, [])
  writeJson(SHOWCASE_LOCAL_TEMP_IMAGES_KEY, [
    ...all.filter(item => item.storeId !== storeId),
    ...items
  ])
}

export function rememberLocalTempImage(storeId: string, scope: LocalTempImageRecord['scope'], url: string): void {
  const cleanUrl = url.trim()
  if (!cleanUrl) return

  const current = loadLocalTempImages(storeId)
  if (current.some(item => item.url === cleanUrl)) return

  saveLocalTempImages(storeId, [
    ...current,
    {
      storeId,
      scope,
      url: cleanUrl,
      createdAt: nowMillis()
    }
  ])
}

export function revokeLocalObjectUrl(url: string): void {
  if (!isBrowser()) return
  if (!url.startsWith('blob:')) return

  try {
    window.URL.revokeObjectURL(url)
  } catch {
    // best effort cleanup
  }
}

export function isLocalImageUri(url: string): boolean {
  const clean = url.trim()
  return clean.startsWith('blob:') || clean.startsWith('data:image/')
}

export function isAppOwnedLocalFileUri(storeId: string, url: string): boolean {
  const clean = url.trim()
  if (!isLocalImageUri(clean)) return false
  return loadLocalTempImages(storeId).some(item => item.url === clean)
}

export function clearLocalTempImagesByScope(storeId: string, scope: LocalTempImageRecord['scope']): void {
  const current = loadLocalTempImages(storeId)
  const deleting = current.filter(item => item.scope === scope)
  const keeping = current.filter(item => item.scope !== scope)

  deleting.forEach(item => revokeLocalObjectUrl(item.url))
  saveLocalTempImages(storeId, keeping)
}

export function clearEditDraftLocalImages(storeId: string): void {
  clearLocalTempImagesByScope(storeId, 'edit-dish')
}

export function clearAdminAnnouncementDraftLocalImages(storeId: string): void {
  clearLocalTempImagesByScope(storeId, 'admin-announcement')
}

export function clearStoreProfileDraftLocalImages(storeId: string): void {
  clearLocalTempImagesByScope(storeId, 'store-profile')
}

export function deleteLocalFileUri(storeId: string, url: string): void {
  const clean = url.trim()
  if (!clean) return

  revokeLocalObjectUrl(clean)
  saveLocalTempImages(
    storeId,
    loadLocalTempImages(storeId).filter(item => item.url !== clean)
  )
}

export function deleteAppOwnedLocalFileUri(storeId: string, url: string): void {
  const clean = url.trim()
  if (!clean) return

  const owned = loadLocalTempImages(storeId).some(item => item.url === clean)
  if (!owned) return

  deleteLocalFileUri(storeId, clean)
}

export function clearExpiredLocalTempFiles(storeId: string): void {
  const cutoff = nowMillis() - LOCAL_TEMP_IMAGE_MAX_AGE_MS
  const current = loadLocalTempImages(storeId)
  const expired = current.filter(item => item.createdAt < cutoff)
  const active = current.filter(item => item.createdAt >= cutoff)

  expired.forEach(item => revokeLocalObjectUrl(item.url))
  saveLocalTempImages(storeId, active)
}

export function createTempCameraUri(storeId: string, file?: Blob): string {
  if (!isBrowser()) return ''

  const blob = file || new Blob([], { type: 'image/jpeg' })
  const url = window.URL.createObjectURL(blob)
  rememberLocalTempImage(storeId, 'chat-camera', url)
  writeJson(SHOWCASE_PENDING_CHAT_CAMERA_KEY, {
    storeId,
    url,
    createdAt: nowMillis()
  })
  return url
}

export function deletePendingChatCameraFile(storeId: string): void {
  const pending = readJson<{ storeId: string; url: string; createdAt: number } | null>(SHOWCASE_PENDING_CHAT_CAMERA_KEY, null)
  if (!pending || pending.storeId !== storeId) return

  deleteAppOwnedLocalFileUri(storeId, pending.url)
  removeStoredValue(SHOWCASE_PENDING_CHAT_CAMERA_KEY)
}

export function prepareChatCameraCapture(storeId: string): string {
  deletePendingChatCameraFile(storeId)
  return createTempCameraUri(storeId)
}

export const PRODUCT_IMAGE_LONG_EDGE = 1600
export const PRODUCT_IMAGE_JPEG_QUALITY = 0.88

export const PRODUCT_IMAGE_MEDIUM_LONG_EDGE = 800
export const PRODUCT_IMAGE_THUMB_LONG_EDGE = 400
export const PRODUCT_IMAGE_BLUR_LONG_EDGE = 32

export const CHAT_IMAGE_LONG_EDGE = 1080
export const CHAT_IMAGE_JPEG_QUALITY = 0.84

export const CHAT_IMAGE_MEDIUM_LONG_EDGE = 800
export const CHAT_IMAGE_THUMB_LONG_EDGE = 400
export const CHAT_IMAGE_BLUR_LONG_EDGE = 32

export const ANNOUNCEMENT_IMAGE_LONG_EDGE = 1280
export const ANNOUNCEMENT_IMAGE_JPEG_QUALITY = 0.86

export const ANNOUNCEMENT_IMAGE_MEDIUM_LONG_EDGE = 800
export const ANNOUNCEMENT_IMAGE_THUMB_LONG_EDGE = 400
export const ANNOUNCEMENT_IMAGE_BLUR_LONG_EDGE = 32

export const STORE_COVER_IMAGE_LONG_EDGE = 1280
export const STORE_COVER_IMAGE_JPEG_QUALITY = 0.86

export const STORE_COVER_IMAGE_MEDIUM_LONG_EDGE = 900
export const STORE_COVER_IMAGE_THUMB_LONG_EDGE = 480
export const STORE_COVER_IMAGE_BLUR_LONG_EDGE = 32

export const STORE_LOGO_IMAGE_LONG_EDGE = 1280
export const STORE_LOGO_IMAGE_JPEG_QUALITY = 0.9

export const STORE_LOGO_IMAGE_MEDIUM_LONG_EDGE = 512
export const STORE_LOGO_IMAGE_THUMB_LONG_EDGE = 256
export const STORE_LOGO_IMAGE_BLUR_LONG_EDGE = 32

const SHOWCASE_IMAGE_UPLOAD_BYTES_PER_MB = 1024 * 1024
const SHOWCASE_IMAGE_UPLOAD_ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp'
])

export type ShowcaseImageUploadScope = 'dish' | 'store_logo' | 'store_cover' | 'announcement' | 'chat'

export const SHOWCASE_IMAGE_UPLOAD_MAX_BYTES: Record<ShowcaseImageUploadScope, number> = {
  dish: 12 * SHOWCASE_IMAGE_UPLOAD_BYTES_PER_MB,
  store_logo: 8 * SHOWCASE_IMAGE_UPLOAD_BYTES_PER_MB,
  store_cover: 12 * SHOWCASE_IMAGE_UPLOAD_BYTES_PER_MB,
  announcement: 12 * SHOWCASE_IMAGE_UPLOAD_BYTES_PER_MB,
  chat: 8 * SHOWCASE_IMAGE_UPLOAD_BYTES_PER_MB
}

function formatShowcaseImageUploadLimit(bytes: number): string {
  const mb = bytes / SHOWCASE_IMAGE_UPLOAD_BYTES_PER_MB

  if (Number.isInteger(mb)) {
    return `${mb}MB`
  }

  return `${mb.toFixed(1).replace(/\.0$/, '')}MB`
}

function readImageUploadFileName(file: File | Blob): string {
  if ('name' in file && typeof file.name === 'string') {
    return file.name
  }

  return ''
}

function readImageUploadFileExtension(fileName: string): string {
  const clean = fileName.trim().toLowerCase()
  const match = clean.match(/\.([a-z0-9]+)$/)

  return match ? match[1] : ''
}

export function validateShowcaseImageUploadFile(file: File | Blob, scope: ShowcaseImageUploadScope): string | null {
  const size = Number(file.size || 0)

  if (!Number.isFinite(size) || size <= 0) {
    return 'Image file is empty.'
  }

  const fileName = readImageUploadFileName(file)
  const extension = readImageUploadFileExtension(fileName)
  const rawType = String(file.type || '').trim().toLowerCase()

  if (rawType && !SHOWCASE_IMAGE_UPLOAD_ALLOWED_TYPES.has(rawType)) {
    return 'Only JPG, PNG, or WebP images are supported.'
  }

  if (!rawType && extension && !['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
    return 'Only JPG, PNG, or WebP images are supported.'
  }

  if (!rawType && !extension) {
    return 'Only JPG, PNG, or WebP images are supported.'
  }

  const maxBytes = SHOWCASE_IMAGE_UPLOAD_MAX_BYTES[scope]

  if (size > maxBytes) {
    return `Image is too large. Please choose an image under ${formatShowcaseImageUploadLimit(maxBytes)}.`
  }

  return null
}

export function normalizeImageContentType(value: string | null | undefined): string {
  const clean = String(value || '').trim().toLowerCase()

  if (clean === 'image/jpg') return 'image/jpeg'
  if (clean === 'image/jpeg') return 'image/jpeg'
  if (clean === 'image/png') return 'image/png'
  if (clean === 'image/webp') return 'image/webp'

  return 'image/jpeg'
}

export function imageExtensionFromContentType(value: string | null | undefined): string {
  const contentType = normalizeImageContentType(value)

  if (contentType === 'image/png') return 'png'
  if (contentType === 'image/webp') return 'webp'

  return 'jpg'
}

export function uploadImageProfileForBucket(bucket: 'dish' | 'store' | 'announcement', pathPrefix: string): {
  maxLongEdge: number
  jpegQuality: number
} {
  const scope = pathPrefix.trim().toLowerCase()

  if (bucket === 'dish') {
    return {
      maxLongEdge: PRODUCT_IMAGE_LONG_EDGE,
      jpegQuality: PRODUCT_IMAGE_JPEG_QUALITY
    }
  }

  if (bucket === 'announcement') {
    return {
      maxLongEdge: ANNOUNCEMENT_IMAGE_LONG_EDGE,
      jpegQuality: ANNOUNCEMENT_IMAGE_JPEG_QUALITY
    }
  }

  if (bucket === 'store' && scope === 'logo') {
    return {
      maxLongEdge: STORE_LOGO_IMAGE_LONG_EDGE,
      jpegQuality: STORE_LOGO_IMAGE_JPEG_QUALITY
    }
  }

  return {
    maxLongEdge: STORE_COVER_IMAGE_LONG_EDGE,
    jpegQuality: STORE_COVER_IMAGE_JPEG_QUALITY
  }
}

export function buildImageUploadFileName(inputFileName: string | null | undefined, contentType: string): string {
  const extension = imageExtensionFromContentType(contentType)
  const cleanFileName = String(inputFileName || '').trim()

  if (!cleanFileName) {
    return `${createId('image')}.${extension}`
  }

  const withoutExtension = cleanFileName.replace(/\.[a-zA-Z0-9]+$/, '')
  return `${withoutExtension}.${extension}`
}

export async function compressImage(file: File | Blob, maxLongEdge = PRODUCT_IMAGE_LONG_EDGE, jpegQuality = PRODUCT_IMAGE_JPEG_QUALITY): Promise<Blob> {
  if (!isBrowser()) {
    throw new Error('Image compression is not available.')
  }

  const sourceType = normalizeImageContentType(file.type || 'image/jpeg')

  if (!sourceType.startsWith('image/')) {
    throw new Error('Only image files can be uploaded.')
  }

  const sourceUrl = window.URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Image decode failed.'))
      img.src = sourceUrl
    })

    const sourceWidth = image.naturalWidth || image.width
    const sourceHeight = image.naturalHeight || image.height

    if (!sourceWidth || !sourceHeight) {
      throw new Error('Image size could not be read.')
    }

    const longEdge = Math.max(sourceWidth, sourceHeight)
    const scale = longEdge <= maxLongEdge ? 1 : maxLongEdge / longEdge
    const targetWidth = Math.max(1, Math.round(sourceWidth * scale))
    const targetHeight = Math.max(1, Math.round(sourceHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Image compression failed.')
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight)

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Image compression failed.'))
          return
        }

        resolve(blob)
      }, 'image/jpeg', jpegQuality)
    })
  } catch (error) {
    if (error instanceof Error && error.message) {
      throw error
    }

    throw new Error('Image compression failed.')
  } finally {
    revokeLocalObjectUrl(sourceUrl)
  }
}

export type ShowcaseImageVariantName = 'original' | 'large' | 'medium' | 'thumb' | 'blur'

export type ShowcaseImageVariantSpec = {
  name: ShowcaseImageVariantName
  maxLongEdge: number
  jpegQuality: number
}

export type UploadedShowcaseImage = {
  url: string
  variants: ShowcaseImageVariants | null
}

export function createRemoteOnlyImageVariants(urlInput: string | null | undefined): ShowcaseImageVariants | null {
  const url = String(urlInput || '').trim()

  if (!url) return null

  return {
    originalUrl: url,
    largeUrl: url,
    mediumUrl: url,
    thumbUrl: url,
    blurDataUrl: null
  }
}

export function buildImageVariantSpecs(bucket: 'dish' | 'store' | 'announcement' | 'chat', pathPrefix: string): ShowcaseImageVariantSpec[] {
  const scope = pathPrefix.trim().toLowerCase()

  if (bucket === 'dish') {
    return [
      {
        name: 'original',
        maxLongEdge: PRODUCT_IMAGE_LONG_EDGE,
        jpegQuality: PRODUCT_IMAGE_JPEG_QUALITY
      },
      {
        name: 'large',
        maxLongEdge: PRODUCT_IMAGE_LONG_EDGE,
        jpegQuality: PRODUCT_IMAGE_JPEG_QUALITY
      },
      {
        name: 'medium',
        maxLongEdge: PRODUCT_IMAGE_MEDIUM_LONG_EDGE,
        jpegQuality: 0.84
      },
      {
        name: 'thumb',
        maxLongEdge: PRODUCT_IMAGE_THUMB_LONG_EDGE,
        jpegQuality: 0.78
      },
      {
        name: 'blur',
        maxLongEdge: PRODUCT_IMAGE_BLUR_LONG_EDGE,
        jpegQuality: 0.48
      }
    ]
  }

  if (bucket === 'chat') {
    return [
      {
        name: 'original',
        maxLongEdge: CHAT_IMAGE_LONG_EDGE,
        jpegQuality: CHAT_IMAGE_JPEG_QUALITY
      },
      {
        name: 'large',
        maxLongEdge: CHAT_IMAGE_LONG_EDGE,
        jpegQuality: CHAT_IMAGE_JPEG_QUALITY
      },
      {
        name: 'medium',
        maxLongEdge: CHAT_IMAGE_MEDIUM_LONG_EDGE,
        jpegQuality: 0.82
      },
      {
        name: 'thumb',
        maxLongEdge: CHAT_IMAGE_THUMB_LONG_EDGE,
        jpegQuality: 0.76
      },
      {
        name: 'blur',
        maxLongEdge: CHAT_IMAGE_BLUR_LONG_EDGE,
        jpegQuality: 0.48
      }
    ]
  }

  if (bucket === 'announcement') {
    return [
      {
        name: 'original',
        maxLongEdge: ANNOUNCEMENT_IMAGE_LONG_EDGE,
        jpegQuality: ANNOUNCEMENT_IMAGE_JPEG_QUALITY
      },
      {
        name: 'large',
        maxLongEdge: ANNOUNCEMENT_IMAGE_LONG_EDGE,
        jpegQuality: ANNOUNCEMENT_IMAGE_JPEG_QUALITY
      },
      {
        name: 'medium',
        maxLongEdge: ANNOUNCEMENT_IMAGE_MEDIUM_LONG_EDGE,
        jpegQuality: 0.82
      },
      {
        name: 'thumb',
        maxLongEdge: ANNOUNCEMENT_IMAGE_THUMB_LONG_EDGE,
        jpegQuality: 0.76
      },
      {
        name: 'blur',
        maxLongEdge: ANNOUNCEMENT_IMAGE_BLUR_LONG_EDGE,
        jpegQuality: 0.48
      }
    ]
  }

  if (bucket === 'store' && scope === 'logo') {
    return [
      {
        name: 'original',
        maxLongEdge: STORE_LOGO_IMAGE_LONG_EDGE,
        jpegQuality: STORE_LOGO_IMAGE_JPEG_QUALITY
      },
      {
        name: 'large',
        maxLongEdge: STORE_LOGO_IMAGE_LONG_EDGE,
        jpegQuality: STORE_LOGO_IMAGE_JPEG_QUALITY
      },
      {
        name: 'medium',
        maxLongEdge: STORE_LOGO_IMAGE_MEDIUM_LONG_EDGE,
        jpegQuality: 0.88
      },
      {
        name: 'thumb',
        maxLongEdge: STORE_LOGO_IMAGE_THUMB_LONG_EDGE,
        jpegQuality: 0.82
      },
      {
        name: 'blur',
        maxLongEdge: STORE_LOGO_IMAGE_BLUR_LONG_EDGE,
        jpegQuality: 0.48
      }
    ]
  }

  return [
    {
      name: 'original',
      maxLongEdge: STORE_COVER_IMAGE_LONG_EDGE,
      jpegQuality: STORE_COVER_IMAGE_JPEG_QUALITY
    },
    {
      name: 'large',
      maxLongEdge: STORE_COVER_IMAGE_LONG_EDGE,
      jpegQuality: STORE_COVER_IMAGE_JPEG_QUALITY
    },
    {
      name: 'medium',
      maxLongEdge: STORE_COVER_IMAGE_MEDIUM_LONG_EDGE,
      jpegQuality: 0.82
    },
    {
      name: 'thumb',
      maxLongEdge: STORE_COVER_IMAGE_THUMB_LONG_EDGE,
      jpegQuality: 0.76
    },
    {
      name: 'blur',
      maxLongEdge: STORE_COVER_IMAGE_BLUR_LONG_EDGE,
      jpegQuality: 0.48
    }
  ]
}

export function buildImageVariantFileName(inputFileName: string | null | undefined, variantName: ShowcaseImageVariantName): string {
  const cleanFileName = String(inputFileName || '').trim()
  const baseName = cleanFileName
    ? cleanFileName.replace(/\.[a-zA-Z0-9]+$/, '')
    : createId('image')

  return `${baseName}-${variantName}.jpg`
}

export async function blobToDataImageUrl(blob: Blob): Promise<string | null> {
  if (!isBrowser()) return null

  return await new Promise<string | null>(resolve => {
    const reader = new FileReader()

    reader.onload = () => {
      const value = typeof reader.result === 'string' ? reader.result : ''
      resolve(value.startsWith('data:image/') ? value : null)
    }

    reader.onerror = () => {
      resolve(null)
    }

    reader.readAsDataURL(blob)
  })
}

export function clearStoredMerchantSession(storeId: string): void {
  clearPersistedMerchantSession(storeId, true)
}

export function persistMerchantSession(storeId: string, session: MerchantAuthSession | null, remember: boolean): void {
  persistCurrentMerchantSession(storeId, session, remember)
}
export function persistFavoritesToStorage(storeId: string, ids: string[]): void {
  writeFavoriteIds(storeId, ids)
}

export function readPersistedStoreProfileDraft(storeId: string): ShowcaseStoreProfileDraft | null {
  const all = readJson<Array<{ storeId: string; draft: ShowcaseStoreProfileDraft }>>(SHOWCASE_STORE_PROFILE_DRAFT_KEY, [])
  return all.find(item => item.storeId === storeId)?.draft || null
}

export function writePersistedStoreProfileDraft(storeId: string, draft: ShowcaseStoreProfileDraft | null): void {
  const all = readJson<Array<{ storeId: string; draft: ShowcaseStoreProfileDraft }>>(SHOWCASE_STORE_PROFILE_DRAFT_KEY, [])

  if (!draft) {
    writeJson(SHOWCASE_STORE_PROFILE_DRAFT_KEY, all.filter(item => item.storeId !== storeId))
    return
  }

  writeJson(SHOWCASE_STORE_PROFILE_DRAFT_KEY, [
    ...all.filter(item => item.storeId !== storeId),
    {
      storeId,
      draft
    }
  ])
}

export function formatUsd(value: number | null | undefined): string {
  const price = Number(value || 0)
  if (!Number.isFinite(price) || price <= 0) return '$0'
  return `$${Number.isInteger(price) ? String(price) : price.toFixed(2).replace(/\.?0+$/, '')}`
}
export type ShowcaseDishPriceTextSnapshot = {
  priceText: string
  originalPriceText: string | null
  discountPriceText: string | null
}

export function buildDishPriceTextSnapshot(dish: DemoDish): ShowcaseDishPriceTextSnapshot {
  const originalPrice = Number(dish.originalPrice)
  const discountPrice = Number(dish.discountPrice)
  const hasValidOriginal = Number.isFinite(originalPrice) && originalPrice > 0
  const hasValidDiscount = Number.isFinite(discountPrice) && discountPrice > 0 && hasValidOriginal && discountPrice < originalPrice

  const originalPriceText = hasValidOriginal ? formatUsd(originalPrice) : formatUsd(getDishPrice(dish))
  const discountPriceText = hasValidDiscount ? formatUsd(discountPrice) : null

  return {
    priceText: discountPriceText || originalPriceText,
    originalPriceText,
    discountPriceText
  }
}

export function buildChatProductShareFromDish(dish: DemoDish): ShowcaseChatProductShare {
  const priceSnapshot = buildDishPriceTextSnapshot(dish)

  return {
    dishId: dish.id,
    title: getDishTitle(dish),
    price: priceSnapshot.priceText,
    originalPriceText: priceSnapshot.originalPriceText,
    discountPriceText: priceSnapshot.discountPriceText,
    imageUrl: selectDishImageUrl(dish, 'list'),
    imageVariants: dish.imageVariants ?? null,
    isRecommended: Boolean(dish.isRecommended)
  }
}

export function encodeAppointmentPriceSnapshotFromDish(dish: DemoDish): string {
  const priceSnapshot = buildDishPriceTextSnapshot(dish)

  return JSON.stringify({
    priceText: priceSnapshot.priceText,
    originalPriceText: priceSnapshot.originalPriceText,
    discountPriceText: priceSnapshot.discountPriceText
  })
}

export function decodeAppointmentPriceSnapshot(value: string | null | undefined): ShowcaseDishPriceTextSnapshot {
  const raw = String(value || '').trim()

  if (!raw) {
    return {
      priceText: '',
      originalPriceText: null,
      discountPriceText: null
    }
  }

  if (raw.startsWith('{')) {
    try {
      const parsed = JSON.parse(raw) as Partial<ShowcaseDishPriceTextSnapshot>
      const priceText = String(parsed.priceText || '').trim()
      const originalPriceText = String(parsed.originalPriceText || '').trim() || priceText || null
      const discountPriceText = String(parsed.discountPriceText || '').trim() || null

      return {
        priceText,
        originalPriceText,
        discountPriceText
      }
    } catch {
      return {
        priceText: raw,
        originalPriceText: raw,
        discountPriceText: null
      }
    }
  }

  return {
    priceText: raw,
    originalPriceText: raw,
    discountPriceText: null
  }
}
export function formatPlainNumber(value: number | null | undefined): string {
  const price = Number(value || 0)
  if (!Number.isFinite(price) || price <= 0) return ''
  return Number.isInteger(price) ? String(price) : price.toFixed(2).replace(/\.?0+$/, '')
}

export function formatDateTimeText(value: number | null | undefined): string {
  return formatShowcaseDateTime(value)
}

export function formatChatCreatedAtText(value: number | null | undefined): string {
  return formatShowcaseDateTime(value)
}

export function getChatMessageWindowBounds(messages: ChatMessage[]): {
  oldestTimeMs: number | null
  newestTimeMs: number | null
} {
  const times = messages
    .map(message => Number(message.createdAt || 0))
    .filter(value => Number.isFinite(value) && value > 0)
    .sort((left, right) => left - right)

  if (times.length === 0) {
    return {
      oldestTimeMs: null,
      newestTimeMs: null
    }
  }

  return {
    oldestTimeMs: times[0],
    newestTimeMs: times[times.length - 1]
  }
}

export function formatDateLabel(value: string | number | null | undefined): string {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return formatDateTimeText(value)
  return ''
}

export function normalizeSortMode(value: string | null | undefined): ShowcaseHomeSortMode {
  if (value === 'PriceAsc') return 'PriceAsc'
  if (value === 'PriceDesc') return 'PriceDesc'
  return 'Default'
}

export function resolveDishImages(dish: DemoDish | null | undefined): string[] {
  if (!dish) return []
  return (dish.imageUrls || [])
    .map(url => String(url || '').trim())
    .filter(Boolean)
}

export function resolveDishImage(dish: DemoDish | null | undefined): string | null {
  return resolveDishImages(dish)[0] || null
}

export function clampIndex(index: number, total: number): number {
  if (!total) return 0
  if (!Number.isFinite(index)) return 0
  return Math.min(Math.max(Math.round(index), 0), total - 1)
}

export function sortDishes(items: DemoDish[], sortMode: ShowcaseHomeSortMode): DemoDish[] {
  const next = [...items]

  if (sortMode === 'Default') {
    return next
  }

  if (sortMode === 'PriceAsc') {
    next.sort((a, b) => getDishPrice(a) - getDishPrice(b))
  }

  if (sortMode === 'PriceDesc') {
    next.sort((a, b) => getDishPrice(b) - getDishPrice(a))
  }

  return next
}

export function hasDiscount(dish: DemoDish): boolean {
  const originalPrice = Number(dish.originalPrice)
  const discountPrice = Number(dish.discountPrice)

  return Number.isFinite(originalPrice) &&
    Number.isFinite(discountPrice) &&
    originalPrice > 0 &&
    discountPrice > 0 &&
    discountPrice < originalPrice
}

export function parseHomePriceDraft(valueInput: string): number | null {
  const value = Number.parseInt(valueInput.trim(), 10)

  return Number.isFinite(value) ? value : null
}

export function syncStateForCloudItem(): SyncState {
  return 'Synced'
}

export function manualCategoryNamesToCloudCategories(categories: string[]): CloudCategory[] {
  return Array.from(
    new Set(
      categories
        .map(item => item.trim())
        .filter(Boolean)
    )
  ).map((name, index) => ({
    id: `local-category-${index}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name,
    sortOrder: index
  }))
}

export function cloudCategoriesToManualCategoryNames(categories: CloudCategory[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  categories.forEach(category => {
    const name = String(category.name || '').trim()
    if (!name) return

    const key = name.toLowerCase()
    if (seen.has(key)) return

    seen.add(key)
    result.push(name)
  })

  return result
}

export function mergeCloudAndDishCategoryNames(categories: CloudCategory[], items: DemoDish[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  cloudCategoriesToManualCategoryNames(categories).forEach(name => {
    const cleanName = String(name || '').trim()
    if (!cleanName) return

    const key = cleanName.toLowerCase()
    if (seen.has(key)) return

    seen.add(key)
    result.push(cleanName)
  })

  items.forEach(item => {
    const cleanName = String(item.category || '').trim()
    if (!cleanName) return

    const key = cleanName.toLowerCase()
    if (seen.has(key)) return

    seen.add(key)
    result.push(cleanName)
  })

  return result
}

export function normalizePendingSyncStatus(value: unknown): PendingSyncStatus {
  const text = String(value || '').trim().toLowerCase()

  if (text === 'syncing') return 'syncing'
  if (text === 'failed') return 'failed'

  return 'pending'
}

export function normalizePendingSyncOperation<T extends PendingSyncOperation>(operation: T): T {
  const now = nowMillis()

  return {
    ...operation,
    status: normalizePendingSyncStatus(operation.status),
    retryCount: Math.max(0, Number(operation.retryCount || 0)),
    lastError: operation.lastError ? String(operation.lastError) : null,
    nextRetryAt: operation.nextRetryAt && Number.isFinite(operation.nextRetryAt)
      ? Number(operation.nextRetryAt)
      : null,
    updatedAt: operation.updatedAt && Number.isFinite(operation.updatedAt)
      ? Number(operation.updatedAt)
      : now
  }
}

export function nextPendingSyncRetryDelayMs(retryCountInput: number): number {
  const retryCount = Math.max(0, retryCountInput)
  const baseDelay = 1500
  const maxDelay = 60 * 1000
  const delay = baseDelay * Math.pow(2, Math.min(retryCount, 5))

  return Math.min(maxDelay, delay)
}

export function shouldAttemptPendingSyncOperation(operation: PendingSyncOperation, now: number): boolean {
  const status = normalizePendingSyncStatus(operation.status)

  if (status === 'syncing') return false
  if (status === 'pending') return true

  const nextRetryAt = Number(operation.nextRetryAt || 0)

  return !nextRetryAt || nextRetryAt <= now
}

export function buildPendingDishSyncOperations(items: DemoDish[]): PendingSyncOperation[] {
  const operations = new Map<string, PendingSyncOperation>()

  items.forEach(item => {
    if (!item.id) return

    const shouldSync =
      item.dirty === true ||
      item.syncState === 'Pending' ||
      item.syncState === 'Failed'

    if (!shouldSync) return

    operations.set(`dish-upsert:${item.id}`, normalizePendingSyncOperation({
      id: `dish-upsert:${item.id}`,
      type: 'dish-upsert',
      dishId: item.id,
      createdAt: item.updatedAt || nowMillis()
    }))
  })

  return Array.from(operations.values())
}

export function legacyPendingSyncStorageKey(storeId: string): string {
  return `ndjc:pending-sync:${storeId}`
}

export function parsePendingSyncOperation(raw: unknown): PendingSyncOperation | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null

  const record = raw as Record<string, unknown>
  const id = String(record.id || '').trim()
  const type = String(record.type || '').trim()
  const createdAt = Number(record.createdAt || nowMillis())

  if (!id || !type) return null

  const metadata: PendingSyncMetadata = {
    status: normalizePendingSyncStatus(record.status),
    retryCount: Math.max(0, Number(record.retryCount || 0)),
    lastError: record.lastError ? String(record.lastError) : null,
    nextRetryAt: record.nextRetryAt && Number.isFinite(Number(record.nextRetryAt))
      ? Number(record.nextRetryAt)
      : null,
    updatedAt: record.updatedAt && Number.isFinite(Number(record.updatedAt))
      ? Number(record.updatedAt)
      : nowMillis()
  }

  if (type === 'dish-upsert') {
    const dishId = String(record.dishId || '').trim()
    if (!dishId) return null

    return normalizePendingSyncOperation({
      id,
      type,
      dishId,
      createdAt,
      ...metadata
    })
  }

  if (type === 'dish-delete') {
    const dishId = String(record.dishId || '').trim()
    if (!dishId) return null

    return normalizePendingSyncOperation({
      id,
      type,
      dishId,
      createdAt,
      ...metadata
    })
  }

  if (type === 'store-profile-upsert') {
    return normalizePendingSyncOperation({
      id,
      type,
      createdAt,
      ...metadata
    })
  }

  if (type === 'announcement-upsert') {
    const announcementId = String(record.announcementId || '').trim()
    if (!announcementId) return null

    return normalizePendingSyncOperation({
      id,
      type,
      announcementId,
      createdAt,
      ...metadata
    })
  }

  if (type === 'appointment-settings-upsert') {
    return normalizePendingSyncOperation({
      id,
      type,
      createdAt,
      ...metadata
    })
  }

  return null
}

export function loadLegacyPendingSyncOperationsFromStorage(storeId: string): PendingSyncOperation[] {
  if (!isBrowser()) return []

  try {
    const raw = window.localStorage.getItem(legacyPendingSyncStorageKey(storeId))
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map(parsePendingSyncOperation)
      .filter((item): item is PendingSyncOperation => Boolean(item))
  } catch {
    return []
  }
}

export function clearLegacyPendingSyncOperationsFromStorage(storeId: string): void {
  if (!isBrowser()) return

  try {
    window.localStorage.removeItem(legacyPendingSyncStorageKey(storeId))
  } catch {
  }
}

export function parsePendingSyncOperationsFromUnknownList(items: unknown[]): PendingSyncOperation[] {
  return items
    .map(parsePendingSyncOperation)
    .filter((item): item is PendingSyncOperation => Boolean(item))
}

export function savePendingSyncOperationsToIndexedDb(storeId: string, operations: PendingSyncOperation[]): void {
  const normalized = operations.map(normalizePendingSyncOperation)

  void saveShowcasePendingSyncQueue(storeId, normalized)
  clearLegacyPendingSyncOperationsFromStorage(storeId)
}

export function mergePendingSyncOperations(
  current: PendingSyncOperation[],
  incoming: PendingSyncOperation[]
): PendingSyncOperation[] {
  const byId = new Map<string, PendingSyncOperation>()

  current.forEach(operation => {
    byId.set(operation.id, normalizePendingSyncOperation(operation))
  })

  incoming.forEach(operation => {
    const existing = byId.get(operation.id)

    byId.set(operation.id, normalizePendingSyncOperation({
      ...operation,
      status: existing?.status === 'syncing' ? 'pending' : existing?.status || operation.status || 'pending',
      retryCount: existing?.retryCount || operation.retryCount || 0,
      lastError: existing?.lastError || operation.lastError || null,
      nextRetryAt: existing?.nextRetryAt || operation.nextRetryAt || null,
      updatedAt: existing?.updatedAt || operation.updatedAt || nowMillis()
    } as PendingSyncOperation))
  })

  return Array.from(byId.values())
}

export function replaceDishPendingSyncOperationsInQueue(
  current: PendingSyncOperation[],
  dishesInput: DemoDish[]
): PendingSyncOperation[] {
  const nextDishOperations = buildPendingDishSyncOperations(dishesInput)
  const nonDishOperations = current.filter(operation => {
    return operation.type !== 'dish-upsert'
  })

  return mergePendingSyncOperations(nonDishOperations, nextDishOperations)
}

export function cloudAnnouncementToCard(item: CloudAnnouncement): ShowcaseAnnouncementCard {
  return {
    id: item.id,
    coverUrl: item.coverUrl,
    bodyPreview: item.body,
    bodyText: item.body,
    timeText: formatDateTimeText(item.updatedAt || item.createdAt) || 'Just now',
    viewCount: item.viewCount
  }
}

export function appointmentsStatusFromCloud(valueInput: string | null | undefined): string {
  const value = String(valueInput || '').trim().toLowerCase()

  if (value === 'confirmed') return 'Confirmed'
  if (value === 'completed') return 'Completed'
  if (value === 'cancelled' || value === 'canceled') return 'Cancelled'
  if (value === 'no_show' || value === 'no show' || value === 'no-show') return 'No-show'
  if (value === 'pending') return 'Pending'

  return valueInput ? String(valueInput) : DEFAULT_APPOINTMENT_STATUS
}

export function appointmentsStatusToCloud(valueInput: string): string {
  const value = valueInput.trim().toLowerCase()

  if (value === 'confirmed') return 'confirmed'
  if (value === 'completed') return 'completed'
  if (value === 'cancelled' || value === 'canceled') return 'cancelled'
  if (value === 'no show' || value === 'no_show' || value === 'no-show') return 'no_show'

  return 'pending'
}

export function canCustomerCancelAppointmentStatus(statusInput: string | null | undefined): boolean {
  const status = appointmentsStatusFromCloud(statusInput)

  return status === 'Pending' || status === 'Confirmed'
}

export function appointmentCloudStatusFilterFromUi(valueInput: string): string | null {
  const value = String(valueInput || '').trim()

  if (!value || value === 'All') return null
  if (value === 'Cancelled by customer') return 'cancelled'

  return appointmentsStatusToCloud(value)
}

export function appointmentCloudCancelledByFilterFromUi(valueInput: string): string | null {
  const value = String(valueInput || '').trim()

  if (value === 'Cancelled by customer') return 'customer'

  return null
}

export function appointmentCloudCancelledByNotFilterFromUi(valueInput: string): string | null {
  const value = String(valueInput || '').trim()

  if (value === 'Cancelled') return 'customer'

  return null
}

export function appointmentCloudServiceFilterFromUi(valueInput: string): string | null {
  const value = String(valueInput || '').trim()

  if (!value || value === 'All') return null

  return value
}

export function appointmentCloudDateFiltersFromUi(
  dateFilterInput: string,
  historyDateInput: string | null | undefined = null
): Pick<AppointmentCloudQueryFilters, 'preferredDate' | 'preferredDateGte' | 'preferredDateLt'> {
  const historyDate = String(historyDateInput || '').trim()
  const dateFilter = historyDate || String(dateFilterInput || '').trim() || 'All'
  const today = appointmentLocalDateKey(new Date())

  if (dateFilter === 'History') {
    return {
      preferredDate: null,
      preferredDateGte: null,
      preferredDateLt: today
    }
  }

  if (dateFilter === 'All') {
    return {
      preferredDate: null,
      preferredDateGte: today,
      preferredDateLt: null
    }
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
    return {
      preferredDate: dateFilter,
      preferredDateGte: null,
      preferredDateLt: null
    }
  }

  return {
    preferredDate: null,
    preferredDateGte: today,
    preferredDateLt: null
  }
}

export function appointmentStatusPushTitle(valueInput: string): string {
  const status = appointmentsStatusFromCloud(valueInput)

  if (status === 'Confirmed') return 'Booking confirmed'
  if (status === 'Completed') return 'Booking completed'
  if (status === 'Cancelled') return 'Booking cancelled'
  if (status === 'No-show') return 'Booking marked no-show'

  return 'Booking updated'
}

export function cloudAppointmentToUi(item: CloudAppointmentRequest, dish: DemoDish | null = null): ShowcaseAppointmentCard {
  const sourceDishId = String(item.sourceDishId || '').trim()
  const hasLinkedDish = Boolean(sourceDishId)
  const itemAvailable = hasLinkedDish
    ? Boolean(dish && !dish.isSoldOut && !dish.isHidden)
    : true

  const dishPriceSnapshot = dish ? buildDishPriceTextSnapshot(dish) : null
  const storedPriceSnapshot = decodeAppointmentPriceSnapshot(item.sourcePriceSnapshot)
  const snapshotImageUrl = String(item.sourceImageUrlSnapshot || '').trim()
  const snapshotCategory = String(item.sourceCategorySnapshot || '').trim()

  return {
    id: item.id,
    customerName: item.customerName,
    customerContact: item.customerContact,
    serviceTitle: item.serviceTitle,
    preferredDate: item.preferredDate,
    preferredTime: item.preferredTime,
    note: item.note,
    statusLabel: appointmentsStatusFromCloud(item.status),
    cancelledBy: item.cancelledBy,
    cancelledAt: item.cancelledAt,
    canCancelByCustomer: canCustomerCancelAppointmentStatus(item.status) && item.cancelledBy !== 'customer',
    createdAtText: formatDateTimeText(item.createdAt) || 'Just now',
    imageUrl: dish ? selectDishImageUrl(dish, 'list') || snapshotImageUrl || null : snapshotImageUrl || null,
    imageVariants: dish?.imageVariants ?? createRemoteOnlyShowcaseImageVariants(snapshotImageUrl),
    sourceDishId: item.sourceDishId,
    priceText: dishPriceSnapshot?.priceText || storedPriceSnapshot.priceText || null,
    originalPriceText: dishPriceSnapshot?.originalPriceText || storedPriceSnapshot.originalPriceText,
    discountPriceText: dishPriceSnapshot?.discountPriceText || storedPriceSnapshot.discountPriceText,
    categoryText: dish?.category || snapshotCategory || null,
    isRecommended: dish ? Boolean(dish.isRecommended) : Boolean(item.sourceRecommendedSnapshot),
    itemAvailable
  }
}

export function appointmentToCard(item: CloudAppointmentRequest, dish: DemoDish | null = null): ShowcaseAppointmentCard {
  return cloudAppointmentToUi(item, dish)
}

export function chatMessageToUiMessage(message: ChatMessage, currentRole: 'merchant' | 'user', product: ShowcaseChatProductShare | null): ShowcaseChatMessage {
  const outgoing = message.senderRole === currentRole
  const parsedPayload = parseNdjcChatPayload(message.body)
  const localStatus = String(message.localStatus || 'sent').trim().toLowerCase()
  const isSending = localStatus === 'sending'
  const isFailed = localStatus === 'failed'
  const statusText = outgoing
    ? isFailed
      ? 'Failed to send'
      : isSending
        ? 'Sending...'
        : message.readAt
          ? 'Sent · Read'
          : 'Sent · Unread'
    : null
  const payloadProduct = parsedPayload.product
    ? {
        dishId: parsedPayload.product.dishId,
        title: parsedPayload.product.title,
        price: parsedPayload.product.price,
        originalPriceText: parsedPayload.product.originalPriceText,
        discountPriceText: parsedPayload.product.discountPriceText,
        imageUrl: parsedPayload.product.imageUrl,
        imageVariants: parsedPayload.product.imageVariants ?? createRemoteOnlyShowcaseImageVariants(parsedPayload.product.imageUrl),
        isRecommended: parsedPayload.product.isRecommended
      }
    : null
  const payloadAppointment = parsedPayload.appointment
    ? {
        appointmentId: parsedPayload.appointment.appointmentId,
        title: parsedPayload.appointment.title,
        preferredDate: parsedPayload.appointment.preferredDate,
        preferredTime: parsedPayload.appointment.preferredTime,
        statusLabel: parsedPayload.appointment.statusLabel,
        cancelledBy: parsedPayload.appointment.cancelledBy,
        cancelledAt: parsedPayload.appointment.cancelledAt,
        imageUrl: parsedPayload.appointment.imageUrl,
        imageVariants: parsedPayload.appointment.imageVariants ?? createRemoteOnlyShowcaseImageVariants(parsedPayload.appointment.imageUrl),
        customerName: parsedPayload.appointment.customerName,
        customerContact: parsedPayload.appointment.customerContact,
        note: parsedPayload.appointment.note,
        sourceDishId: parsedPayload.appointment.sourceDishId,
        priceText: parsedPayload.appointment.priceText,
        originalPriceText: parsedPayload.appointment.originalPriceText,
        discountPriceText: parsedPayload.appointment.discountPriceText,
        categoryText: parsedPayload.appointment.categoryText,
        itemAvailable: parsedPayload.appointment.itemAvailable,
        createdAtText: parsedPayload.appointment.createdAtText
      }
    : null

  return {
    id: message.id,
    body: parsedPayload.body,
    createdAtText: formatChatCreatedAtText(message.createdAt) || '',
    outgoing,
    statusText,
    imageUrls: Array.from(new Set([
      ...message.imageUrls,
      ...parsedPayload.imageUris
    ].map(url => String(url || '').trim()).filter(Boolean))),
    imageVariants: parsedPayload.imageVariants,
    product: product || payloadProduct,
    appointment: payloadAppointment,
    quotedMessageId: message.quotedMessageId || parsedPayload.quoteMessageId,
    quotePreviewText: parsedPayload.quotePreview,
    failed: isFailed,
    selected: false
  }
}

export function chatThreadSummaryToUi(item: ChatThreadSummary): ShowcaseChatThreadSummaryUi {
  return chatThreadSummaryToUiFromDomain(item)
}

export function storeProfileFromCloud(profile: CloudStoreProfile | null): ShowcaseStoreProfile {
  return {
    displayName: profile?.title || 'Showcase Store',
    tagline: profile?.subtitle || 'Browse items, book services, and contact the store.',
    phone: '',
    address: profile?.address || '',
    businessHours: profile?.hours || '',
    websiteUrl: '',
    mapUrl: profile?.mapUrl || ''
  }
}

export function storeProfileFromCachedProfile(
  profile: NonNullable<ReturnType<typeof loadStoreProfileFromStorage>>
): ShowcaseStoreProfile {
  return {
    displayName: profile.title || 'Showcase Store',
    tagline: profile.subtitle || 'Browse items, book services, and contact the store.',
    phone: '',
    address: profile.address || '',
    businessHours: profile.hours || '',
    websiteUrl: '',
    mapUrl: profile.mapUrl || ''
  }
}

export function storeProfileDraftFromProfile(profile: ShowcaseStoreProfile): ShowcaseStoreProfileDraft {
  return {
    displayName: profile.displayName,
    tagline: profile.tagline,
    phone: profile.phone,
    address: profile.address,
    businessHours: profile.businessHours,
    websiteUrl: profile.websiteUrl,
    mapUrl: profile.mapUrl,
    isDirty: false
  }
}

export function mapCloudPlanType(valueInput: string | null | undefined): string {
  const value = String(valueInput || '').trim().toLowerCase()

  if (value === 'paid') return 'Paid'
  if (value === 'trial') return 'Trial'
  if (value === 'free') return 'Free'

  return valueInput ? String(valueInput) : 'Trial'
}

export function buildCloudStatusLabel(valueInput: string | null | undefined, canWrite: boolean): string {
  const value = String(valueInput || '').trim().toLowerCase()

  if (value === 'active') {
    return canWrite ? 'Running · Writable' : 'Running · Not writable'
  }

  if (value === 'read_only' || value === 'readonly') {
    return 'Read-only · Not writable'
  }

  if (value === 'deleted') {
    return 'Deleted · Not writable'
  }

  if (value === 'expired') {
    return 'Expired · Not writable'
  }

  return canWrite ? 'Unknown · Writable' : 'Unknown · Not writable'
}
export function parseCloudIsoMillis(valueInput: string | null | undefined): number | null {
  const value = String(valueInput || '').trim()
  if (!value) return null

  const parsed = Date.parse(value)
  if (!Number.isFinite(parsed)) return null

  return parsed
}

export function formatCloudDateTimeLabel(valueInput: string | null | undefined): string {
  const millis = parseCloudIsoMillis(valueInput)

  if (millis == null) {
    return String(valueInput || '').trim()
  }

  const date = new Date(millis)
  const monthDayYear = date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })
  const timeText = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  return `${monthDayYear}, ${timeText}`
}

export function buildCloudDaysRemainingLabel(serviceEndAtInput: string | null | undefined): string {
  const endAtMs = parseCloudIsoMillis(serviceEndAtInput)
  if (endAtMs == null) return ''

  const now = new Date()
  const end = new Date(endAtMs)

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const endDayStart = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime()
  const oneDayMs = 24 * 60 * 60 * 1000
  const days = Math.floor((endDayStart - todayStart) / oneDayMs)

  if (endAtMs - Date.now() <= 0) {
    return 'Expired'
  }

  if (days <= 0) {
    return 'Expires today'
  }

  if (days === 1) {
    return '1 day left'
  }

  return `${days} days left`
}
export function cloudStatusToUi(status: CloudStoreServiceStatus | null, storeId: string): ShowcaseCloudStatusUi | null {
  if (!status) return null

  const serviceEndAtRaw = String(status.serviceEndAt || '').trim()
  const deleteAtRaw = String(status.deleteAt || '').trim()

  return {
    storeId: status.storeId || storeId,
    planLabel: mapCloudPlanType(status.planType),
    statusLabel: buildCloudStatusLabel(status.serviceStatus, status.isWriteAllowed),
    daysRemainingLabel: buildCloudDaysRemainingLabel(serviceEndAtRaw),
    serviceEndAtLabel: serviceEndAtRaw ? formatCloudDateTimeLabel(serviceEndAtRaw) : '',
    deleteAtLabel: deleteAtRaw ? formatCloudDateTimeLabel(deleteAtRaw) : '',
    canWrite: status.isWriteAllowed
  }
}

export function categoryOptionsFromDishes(dishes: DemoDish[]): string[] {
  return deriveCategoriesFromModels(dishes)
}

export function allTagsFromDishes(dishes: DemoDish[]): string[] {
  return deriveAllTags(dishes)
}

export function dishFilterRowsToTags(rows: CloudDishFilterRow[]): string[] {
  return Array.from(
    new Set(
      rows
        .flatMap(item => item.tags || [])
        .map(item => String(item || '').trim())
        .filter(Boolean)
    )
  ).sort()
}

export function mapFavoriteCard(dish: DemoDish): ShowcaseFavoriteCard {
  const discount = Number(dish.discountPrice)
  const hasValidDiscount = Number.isFinite(discount) && discount > 0
  const originalPriceText = formatUsd(dish.originalPrice)
  const discountPriceText = hasValidDiscount ? formatUsd(discount) : null

  return {
    dishId: dish.id,
    title: getDishTitle(dish) || 'Untitled item',
    category: dish.category || null,
    originalPriceText,
    discountPriceText,
    priceText: discountPriceText || originalPriceText,
    imageUrl: resolveDishImage(dish),
    isRecommended: Boolean(dish.isRecommended),
    isHidden: Boolean(dish.isHidden),
    itemAvailable: !dish.isSoldOut && !dish.isHidden
  }
}

export function defaultAppointmentSettings(storeId: string): CloudAppointmentSettings {
  return {
    storeId,
    enabled: true,
    bookingWindowDays: 7,
    availableStartTime: '09:00',
    availableEndTime: '17:00',
    slotIntervalMinutes: 30,
    closedDays: [],
    minimumNotice: '2 hours',
    updatedAt: null
  }
}

export function appointmentTimeToMinutes(valueInput: string): number | null {
  const value = valueInput.trim()
  if (!value) return null

  const parts = value.split(':')
  if (parts.length < 2) return null

  const hour = Number(parts[0])
  const minute = Number(parts[1])

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null

  return hour * 60 + minute
}

export function appointmentMinutesToTime(valueInput: number): string {
  const value = Math.max(0, Math.min(23 * 60 + 59, Math.round(valueInput)))
  const hour = Math.floor(value / 60)
  const minute = value % 60

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function appointmentMinimumNoticeToMillis(valueInput: string): number {
  const value = valueInput.trim().toLowerCase()
  if (!value) return 0

  const amount = Number(value.match(/\d+/)?.[0] || 0)
  if (!Number.isFinite(amount) || amount <= 0) return 0

  if (value.includes('day')) return amount * 24 * 60 * 60 * 1000
  if (value.includes('hour')) return amount * 60 * 60 * 1000
  if (value.includes('min')) return amount * 60 * 1000

  return amount * 60 * 60 * 1000
}

export function appointmentClosedDayKey(date: Date): string {
  const day = date.getDay()

  if (day === 1) return 'Mon'
  if (day === 2) return 'Tue'
  if (day === 3) return 'Wed'
  if (day === 4) return 'Thu'
  if (day === 5) return 'Fri'
  if (day === 6) return 'Sat'
  if (day === 0) return 'Sun'

  return ''
}

export function appointmentLocalDateKey(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function customerAppointmentDateOptions(settings: CloudAppointmentSettings): ShowcaseAppointmentDateOption[] {
  const today = new Date()
  const options: ShowcaseAppointmentDateOption[] = []
  const bookingWindowDays = Math.max(1, Number(settings.bookingWindowDays || 7))

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + index)

    const value = appointmentLocalDateKey(date)
    const dayKey = appointmentClosedDayKey(date)
    const withinBookingWindow = index < bookingWindowDays
    const closed = settings.closedDays.includes(dayKey)
    const hasTimes = customerAppointmentTimeOptionsForDate(settings, value).length > 0

    const title = index === 0
      ? 'Today'
      : index === 1
        ? 'Tomorrow'
        : date.toLocaleDateString('en-US', { weekday: 'short' })

    const subtitle = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })

    const reason = !withinBookingWindow
      ? 'Unavailable'
      : closed
        ? 'Closed'
        : !hasTimes
          ? 'No times'
          : ''

    options.push({
      value,
      title,
      subtitle,
      available: withinBookingWindow && !closed && hasTimes,
      reason
    })
  }

  return options
}

export function customerAppointmentTimeOptionsForDate(settings: CloudAppointmentSettings, dateValueInput: string): string[] {
  const start = appointmentTimeToMinutes(settings.availableStartTime)
  const end = appointmentTimeToMinutes(settings.availableEndTime)

  if (start == null || end == null) {
    return []
  }

  if (start >= end) {
    return []
  }

  const interval = settings.slotIntervalMinutes === 30 || settings.slotIntervalMinutes === 60
    ? settings.slotIntervalMinutes
    : 30

  const noticeMillis = appointmentMinimumNoticeToMillis(settings.minimumNotice)
  const selectedDate = dateValueInput.trim()
  const result: string[] = []

  for (let cursor = start; cursor < end; cursor += interval) {
    const time = appointmentMinutesToTime(cursor)

    if (selectedDate) {
      const slotAt = new Date(`${selectedDate}T${time}:00`)
      if (Number.isFinite(slotAt.getTime()) && slotAt.getTime() - nowMillis() < noticeMillis) {
        continue
      }
    }

    result.push(time)
  }

  return result
}

export function buildAppointmentDateOptions(settings: CloudAppointmentSettings): ShowcaseAppointmentDateOption[] {
  return customerAppointmentDateOptions(settings)
}

export function buildAppointmentTimeOptions(settings: CloudAppointmentSettings): string[] {
  return customerAppointmentTimeOptionsForDate(settings, '')
}

export function buildDefaultConversationId(storeId: string, clientId: string): string {
  return `cloud:${storeId}:${clientId}`
}

export function decorateCloudHomeResults(input: {
  dishes: DemoDish[]
  favoriteIds: string[]
  sortMode: ShowcaseHomeSortMode
}): DemoDish[] {
  return sortDishes(
    input.dishes.map(item => ({
      ...item,
      isFavorite: input.favoriteIds.includes(item.id)
    })),
    input.sortMode
  )
}

export function toShowcaseHomeDish(dish: DemoDish): ShowcaseHomeDish {
  const originalPrice = Number(dish.originalPrice)
  const discountPrice = Number(dish.discountPrice)
  const normalizedOriginalPrice = Number.isFinite(originalPrice) && originalPrice > 0 ? originalPrice : 0
  const normalizedDiscountPrice = Number.isFinite(discountPrice) && discountPrice > 0 ? discountPrice : null
  const title = getDishTitle(dish).trim()

  return {
    clickCount: Number.isFinite(Number(dish.clickCount)) ? Number(dish.clickCount) : 0,
    id: dish.id,
    title: title || 'Untitled item',
    subtitle: String(dish.description || '').trim() || null,
    category: String(dish.category || '').trim() || null,
    price: getDishPrice(dish),
    originalPrice: normalizedOriginalPrice,
    discountPrice: normalizedDiscountPrice,
    isRecommended: Boolean(dish.isRecommended),
    isSoldOut: Boolean(dish.isSoldOut),
    isFavorite: Boolean(dish.isFavorite),
    isHidden: Boolean(dish.isHidden),
    imagePreviewUrl: selectDishImageUrl(dish, 'home'),
    imageVariants: dish.imageVariants ?? null
  }
}

export const NDJC_VM_TRACE_ENABLED = false

export function ndjcTrace(label: string, payload?: Record<string, unknown>): void {
  if (!NDJC_VM_TRACE_ENABLED) return
  if (typeof console === 'undefined') return

  console.warn(`[NDJC_TRACE] ${label}`, {
    at: new Date().toISOString(),
    ...payload
  })
}

export function ndjcTraceError(label: string, errorInput: unknown, payload?: Record<string, unknown>): void {
  if (!NDJC_VM_TRACE_ENABLED) return
  if (typeof console === 'undefined') return

  console.error(`[NDJC_TRACE_ERROR] ${label}`, {
    at: new Date().toISOString(),
    message: errorInput instanceof Error ? errorInput.message : String(errorInput || ''),
    error: errorInput,
    ...payload
  })
}

