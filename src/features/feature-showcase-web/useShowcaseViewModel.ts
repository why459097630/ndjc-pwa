'use client'

import { getNdjcFirebaseMessagingToken } from '@/pwa/firebaseMessaging'
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
  type SyncState
} from './showcaseModels'
import {
  createRemoteOnlyShowcaseImageVariants,
  selectDishImageUrl,
  selectImageVariantUrl,
  selectStoreCoverUrl,
  selectStoreLogoUrl
} from './showcaseImageVariants'
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
  type CloudStoreServiceStatus,
  type MerchantAuthSession,
  type MerchantStoreMembership,
  type ShowcaseCloudRepository
} from './showcaseCloudRepository'
import {
  SHOWCASE_PAGE_SIZE
} from './showcaseCloudConfig'
import {
  pruneAnnouncementLocalMarksByValidIds,
  pruneBookingStatusSeenByValidIds,
  runShowcaseLocalCacheMaintenance
} from './showcaseLocalCacheMaintenance'
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
} from './showcaseMerchantAuthPreferences'
import {
  bindMerchantSessionToRepository,
  clearMerchantSession as clearStoreMerchantSession,
  isMerchantLoggedIn as isMerchantLoggedInInStoreSession,
  setCurrentStoreId,
  setMerchantSessionFromAuthSession as setStoreMerchantSessionFromAuthSession,
  updateMerchantLoginName as updateMerchantLoginNameInStoreSession
} from './showcaseStoreSession'
import { createShowcaseCloudRepositoryConfig } from './showcaseCloudConfig'
import {
  getFreshShowcaseAuthSession,
  onShowcaseAuthStateChange,
  refreshShowcaseAuthSession
} from './showcaseAuthSessionManager'
import {
  formatShowcaseDateTime
} from './showcaseDateTime'
import {
  markConversationRecentlySeen as markRuntimeConversationRecentlySeen,
  markConversationVisible as markRuntimeConversationVisible,
  setActiveConversationId as setRuntimeActiveConversationId,
  setChatVisible as setRuntimeChatVisible,
  shouldSuppressChatPush as shouldSuppressRuntimeChatPush
} from './showcaseRuntimeState'
import {
  consumeShowcasePushRoute,
  dispatchShowcasePushRouteFromLocationSearch,
  installShowcasePushRouter,
  subscribeShowcasePushRoute,
  type ShowcasePushRoute
} from './showcasePushRouter'
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
} from './chat/showcaseChatDomain'
import {
  buildMerchantThreadAliasOperationResult,
  buildMerchantThreadDeleteResetPlan,
  buildMerchantThreadPinOperationResult,
  buildMerchantThreadsWithLocalMeta as buildMerchantThreadsWithLocalMetaInDomain,
  buildMerchantThreadsFromCloudSummaries,
  chatThreadSummaryToUi as chatThreadSummaryToUiFromDomain,
  cloudThreadSummaryToLegacyChatThread,
  removeMerchantThread
} from './chat/showcaseChatListDomain'
import {
  createShowcaseChatCloudRepository
} from './chat/showcaseChatCloudRepository'
import {
  createShowcaseChatRepository,
  type ChatMessageEntity,
  type CloudThreadSummary,
  type ShowcaseChatRepository
} from './chat/showcaseChatRepository'
import type {
  ShowcaseChatMessageUi as ShowcaseChatDomainMessageUi,
  ShowcaseChatUiStateDomain
} from './chat/showcaseChatModels'
import {
  ShowcaseRetryOps,
  ShowcaseScreens,
  SyncOverviewStates,
  createDefaultShowcaseChatUiState,
  createDefaultShowcaseUiState
} from './showcaseUiState'
import {
  createShowcaseUiWiring,
  type ShowcaseUiWiring
} from './showcaseUiWiring'
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
  ShowcaseSyncOverviewState,
  ShowcaseUiModel,
  ShowcaseUiState,
  SyncOverviewState
} from './showcaseUiContract'

export type { ShowcaseScreenName } from './showcaseUiContract'

export type UseShowcaseViewModelInput = {
  storeId?: string | null
  initialScreen?: ShowcaseScreenName
  previewMode?: boolean
  repository?: ShowcaseCloudRepository | null
}

type PendingSyncOperation =
  | {
      id: string
      type: 'dish-upsert'
      dishId: string
      createdAt: number
    }
  | {
      id: string
      type: 'dish-delete'
      dishId: string
      createdAt: number
    }
  | {
      id: string
      type: 'store-profile-upsert'
      createdAt: number
    }
  | {
      id: string
      type: 'announcement-upsert'
      announcementId: string
      createdAt: number
    }
  | {
      id: string
      type: 'appointment-settings-upsert'
      createdAt: number
    }

type PendingDeleteCategoryDialog = {
  name: string
  id: string | null
} | null

type ChatSearchResult = {
  conversationId: string
  messageId: string | null
  senderLabel: string
  snippet: string
  createdAtText: string
  createdAtMs: number
  matchedInName: boolean
}

type ChatMediaItem = {
  conversationId: string
  messageId: string
  url: string
  createdAtText: string
  createdAtMs: number
}

type ChatMode = 'Client' | 'Merchant'

const CHAT_LATEST_WINDOW_MAX_MESSAGES = 180
const CHAT_AROUND_MESSAGE_WINDOW_MAX_MESSAGES = 240

type ChatMessageWindowRuntimeState = {
  mode: ShowcaseChatWindowMode
  anchorMessageId: string | null
  hasOlder: boolean
  hasNewer: boolean
  isLoadingOlder: boolean
  isLoadingNewer: boolean
  oldestTimeMs: number | null
  newestTimeMs: number | null
}

type ShowcasePaginationRuntimeState = {
  nextOffset: number
  hasMore: boolean
  isLoadingMore: boolean
}

type AppointmentCloudQueryFilters = {
  preferredDate?: string | null
  preferredDateGte?: string | null
  preferredDateLt?: string | null
  status?: string | null
  serviceTitle?: string | null
}

type DishCloudQueryFilters = {
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

type DraftExtraContact = {
  id: string
  name: string
  value: string
}

type DraftAnnouncement = {
  id: string
  coverUrl: string | null
  coverImageVariants: ShowcaseImageVariants | null
  body: string
  status: 'draft' | 'published'
  createdAt: number
  updatedAt: number
  viewCount: number
}

type LocalTempImageRecord = {
  storeId: string
  scope: 'edit-dish' | 'admin-announcement' | 'store-profile' | 'chat-camera' | 'chat-draft'
  url: string
  createdAt: number
}

type LocalFavoriteStore = {
  storeId: string
  ids: string[]
}

type LocalChatDraftStore = {
  storeId: string
  conversationId: string
  draft: string
  draftImageUrls: string[]
  pendingProduct: ShowcaseChatProductShare | null
  pendingAppointment: ShowcaseChatAppointmentShare | null
  quotedMessageId: string | null
}

const SHOWCASE_CLIENT_ID_KEY = 'ndjc_showcase_client_id'
const SHOWCASE_FAVORITES_KEY = 'ndjc_showcase_favorites'
const SHOWCASE_CHAT_DRAFT_KEY = 'ndjc_showcase_chat_draft'
const SHOWCASE_STORE_PROFILE_DRAFT_KEY = 'ndjc_showcase_store_profile_draft'
const SHOWCASE_VIEWED_ANNOUNCEMENT_IDS_KEY = 'ndjc_showcase_viewed_announcement_ids'
const SHOWCASE_COUNTED_ANNOUNCEMENT_CLICK_IDS_KEY = 'ndjc_showcase_counted_announcement_click_ids'
const SHOWCASE_PUBLISHED_ANNOUNCEMENTS_KEY = 'ndjc_showcase_published_announcements'
const SHOWCASE_ITEM_EDITOR_DRAFT_KEY = 'ndjc_showcase_item_editor_draft'
const SHOWCASE_ADMIN_ANNOUNCEMENT_EDITOR_DRAFT_KEY = 'ndjc_showcase_admin_announcement_editor_draft'
const SHOWCASE_LOCAL_TEMP_IMAGES_KEY = 'ndjc_showcase_local_temp_images'
const SHOWCASE_PENDING_CHAT_CAMERA_KEY = 'ndjc_showcase_pending_chat_camera'
const NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY = 'ndjc_pwa_device_install_id'

const DEFAULT_CUSTOMER_NAME = 'Customer'
const DEFAULT_CHAT_INPUT_PLACEHOLDER = 'Message'
const DEFAULT_APPOINTMENT_STATUS = 'Pending'
const LOCAL_TEMP_IMAGE_MAX_AGE_MS = 24 * 60 * 60 * 1000
const NDJC_CHAT_VISIBILITY_HEARTBEAT_MS = 1000

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function canUseLocalStorage(): boolean {
  if (!isBrowser()) return false

  try {
    return typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

function postChatVisibilityToServiceWorker(input: {
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

function nowMillis(): number {
  return Date.now()
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

function createId(prefix: string): string {
  return `${prefix}_${createUuidLikeId()}`
}

function createPwaDeviceInstallId(): string {
  return createId('web')
}

function getOrCreatePwaDeviceInstallId(): string {
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

function normalizeStoreId(storeId: string | null | undefined): string {
  const value = String(storeId || '').trim()

  if (!value) {
    throw new Error('storeId is required for showcase view model.')
  }

  return value
}

function normalizeText(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return fallback
}

function normalizeNullableText(value: unknown): string | null {
  const text = normalizeText(value).trim()
  return text || null
}

function normalizeNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

function normalizeBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const text = value.trim().toLowerCase()
    if (text === 'true' || text === '1' || text === 'yes') return true
    if (text === 'false' || text === '0' || text === 'no') return false
  }
  return fallback
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
    // local persistence is best effort in PWA runtime
  }
}

function appointmentsStorageKey(storeId: string): string {
  return `ndjc_showcase_appointments_${normalizeStoreId(storeId)}`
}

function loadAppointmentsFromStorage(storeId: string): CloudAppointmentRequest[] {
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
        createdAt: typeof item.createdAt === 'number' ? item.createdAt : null
      }
    })
    .filter(item => item.id.trim())
}

function saveAppointmentsToStorage(storeId: string, items: CloudAppointmentRequest[]): void {
  writeJson(appointmentsStorageKey(storeId), items)
}

function appointmentStatusAlertSeenStorageKey(storeId: string, clientId: string): string {
  return `ndjc_showcase_booking_status_alerts_seen_${normalizeStoreId(storeId)}_${String(clientId || '').trim()}`
}

function appointmentStatusAlertKey(appointmentIdInput: string, statusInput: string): string {
  const appointmentId = String(appointmentIdInput || '').trim()
  const status = String(statusInput || '').trim()

  return `${appointmentId}:${status}`
}

function isCustomerBookingAlertStatus(statusInput: string): boolean {
  const status = String(statusInput || '').trim()

  return status === 'Confirmed' || status === 'Cancelled'
}

function loadSeenAppointmentStatusAlertKeys(storeId: string, clientId: string): string[] {
  return readJson<string[]>(appointmentStatusAlertSeenStorageKey(storeId, clientId), [])
    .map(item => String(item || '').trim())
    .filter(Boolean)
}

function saveSeenAppointmentStatusAlertKeys(storeId: string, clientId: string, keys: string[]): void {
  writeJson(
    appointmentStatusAlertSeenStorageKey(storeId, clientId),
    Array.from(new Set(keys.map(item => String(item || '').trim()).filter(Boolean)))
  )
}

function removeStoredValue(key: string): void {
  if (!canUseLocalStorage()) return

  try {
    window.localStorage.removeItem(key)
  } catch {
    // local persistence is best effort in PWA runtime
  }
}

function readClientId(): string {
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

function readRememberMe(): boolean {
  return readRememberMeFromPreferences()
}

function writeRememberMe(value: boolean): void {
  writeRememberMeToPreferences(value)
}

function readMerchantSession(): MerchantAuthSession | null {
  return readMerchantSessionFromPreferences()
}

function writeMerchantSession(session: MerchantAuthSession | null): void {
  writeMerchantSessionToPreferences(session)
}

function readFavoriteIds(storeId: string): string[] {
  return loadFavoriteIdsFromStorage(storeId)
}

function writeFavoriteIds(storeId: string, ids: string[]): void {
  saveFavoriteIdsToStorage(storeId, ids)
}

function readChatDraft(storeId: string, conversationId: string): LocalChatDraftStore | null {
  const all = readJson<LocalChatDraftStore[]>(SHOWCASE_CHAT_DRAFT_KEY, [])
  return all.find(item => item.storeId === storeId && item.conversationId === conversationId) || null
}

function writeChatDraft(value: LocalChatDraftStore): void {
  const all = readJson<LocalChatDraftStore[]>(SHOWCASE_CHAT_DRAFT_KEY, [])
  const next = [
    ...all.filter(item => item.storeId !== value.storeId || item.conversationId !== value.conversationId),
    value
  ]

  writeJson(SHOWCASE_CHAT_DRAFT_KEY, next)
}

function clearChatDraft(storeId: string, conversationId: string): void {
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

function loadViewedAnnouncementIdsLocally(storeId: string): string[] {
  return loadViewedAnnouncementIdsFromStorage(storeId)
}

function saveViewedAnnouncementIdsLocally(storeId: string, ids: string[]): void {
  saveViewedAnnouncementIdsToStorage(storeId, ids)
}

function loadCountedAnnouncementClickIdsLocally(storeId: string): string[] {
  return loadCountedAnnouncementClickIdsFromStorage(storeId)
}

function saveCountedAnnouncementClickIdsLocally(storeId: string, ids: string[]): void {
  saveCountedAnnouncementClickIdsToStorage(storeId, ids)
}

function toCachedPublishedAnnouncement(item: CloudAnnouncement): CachedPublishedAnnouncement {
  return {
    id: item.id,
    coverUrl: item.coverUrl,
    body: item.body,
    updatedAt: item.updatedAt ?? item.createdAt ?? Date.now(),
    viewCount: item.viewCount
  }
}

function fromCachedPublishedAnnouncement(storeId: string, item: CachedPublishedAnnouncement): CloudAnnouncement {
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

function loadPublishedAnnouncementsLocally(storeId: string): CloudAnnouncement[] {
  return loadPublishedAnnouncementsFromStorage(storeId)
    .map(item => fromCachedPublishedAnnouncement(storeId, item))
}

function persistPublishedAnnouncementsLocally(storeId: string, items: CloudAnnouncement[]): void {
  savePublishedAnnouncementsToStorage(storeId, items.map(toCachedPublishedAnnouncement))
}

function pruneAnnouncementMarksWhenCompletePageLoaded(
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

function pruneBookingSeenWhenCompletePageLoaded(
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

function loadItemEditorDraftLocally(
  storeId: string,
  mode: 'new' | 'edit' | 'any' = 'any'
): CachedItemEditorDraft | null {
  const draft = loadItemEditorDraftFromStorage(storeId)
  if (!draft) return null

  if (mode === 'new' && draft.isNew !== true) return null
  if (mode === 'edit' && draft.isNew !== false) return null

  return draft
}

function persistItemEditorDraftLocally(
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

function clearItemEditorDraftLocally(storeId: string): void {
  clearItemEditorDraftFromStorage(storeId)
}

function loadAdminAnnouncementEditorDraftLocally(storeId: string): DraftAnnouncement | null {
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

function persistAdminAnnouncementEditorDraftLocally(storeId: string, draft: DraftAnnouncement): void {
  const nextDraft: CachedAdminAnnouncementEditorDraft = {
    editingId: draft.id || null,
    body: draft.body,
    coverUrl: draft.coverUrl,
    updatedAt: draft.updatedAt || Date.now()
  }

  saveAdminAnnouncementEditorDraftToStorage(storeId, nextDraft)
}

function clearAdminAnnouncementEditorDraftLocally(storeId: string): void {
  clearAdminAnnouncementEditorDraftFromStorage(storeId)
}

function loadLocalTempImages(storeId: string): LocalTempImageRecord[] {
  const all = readJson<LocalTempImageRecord[]>(SHOWCASE_LOCAL_TEMP_IMAGES_KEY, [])
  return all.filter(item => item.storeId === storeId)
}

function saveLocalTempImages(storeId: string, items: LocalTempImageRecord[]): void {
  const all = readJson<LocalTempImageRecord[]>(SHOWCASE_LOCAL_TEMP_IMAGES_KEY, [])
  writeJson(SHOWCASE_LOCAL_TEMP_IMAGES_KEY, [
    ...all.filter(item => item.storeId !== storeId),
    ...items
  ])
}

function rememberLocalTempImage(storeId: string, scope: LocalTempImageRecord['scope'], url: string): void {
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

function revokeLocalObjectUrl(url: string): void {
  if (!isBrowser()) return
  if (!url.startsWith('blob:')) return

  try {
    window.URL.revokeObjectURL(url)
  } catch {
    // best effort cleanup
  }
}

function isLocalImageUri(url: string): boolean {
  const clean = url.trim()
  return clean.startsWith('blob:') || clean.startsWith('data:image/')
}

function isAppOwnedLocalFileUri(storeId: string, url: string): boolean {
  const clean = url.trim()
  if (!isLocalImageUri(clean)) return false
  return loadLocalTempImages(storeId).some(item => item.url === clean)
}

function clearLocalTempImagesByScope(storeId: string, scope: LocalTempImageRecord['scope']): void {
  const current = loadLocalTempImages(storeId)
  const deleting = current.filter(item => item.scope === scope)
  const keeping = current.filter(item => item.scope !== scope)

  deleting.forEach(item => revokeLocalObjectUrl(item.url))
  saveLocalTempImages(storeId, keeping)
}

function clearEditDraftLocalImages(storeId: string): void {
  clearLocalTempImagesByScope(storeId, 'edit-dish')
}

function clearAdminAnnouncementDraftLocalImages(storeId: string): void {
  clearLocalTempImagesByScope(storeId, 'admin-announcement')
}

function clearStoreProfileDraftLocalImages(storeId: string): void {
  clearLocalTempImagesByScope(storeId, 'store-profile')
}

function deleteLocalFileUri(storeId: string, url: string): void {
  const clean = url.trim()
  if (!clean) return

  revokeLocalObjectUrl(clean)
  saveLocalTempImages(
    storeId,
    loadLocalTempImages(storeId).filter(item => item.url !== clean)
  )
}

function deleteAppOwnedLocalFileUri(storeId: string, url: string): void {
  const clean = url.trim()
  if (!clean) return

  const owned = loadLocalTempImages(storeId).some(item => item.url === clean)
  if (!owned) return

  deleteLocalFileUri(storeId, clean)
}

function clearExpiredLocalTempFiles(storeId: string): void {
  const cutoff = nowMillis() - LOCAL_TEMP_IMAGE_MAX_AGE_MS
  const current = loadLocalTempImages(storeId)
  const expired = current.filter(item => item.createdAt < cutoff)
  const active = current.filter(item => item.createdAt >= cutoff)

  expired.forEach(item => revokeLocalObjectUrl(item.url))
  saveLocalTempImages(storeId, active)
}

function createTempCameraUri(storeId: string, file?: Blob): string {
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

function deletePendingChatCameraFile(storeId: string): void {
  const pending = readJson<{ storeId: string; url: string; createdAt: number } | null>(SHOWCASE_PENDING_CHAT_CAMERA_KEY, null)
  if (!pending || pending.storeId !== storeId) return

  deleteAppOwnedLocalFileUri(storeId, pending.url)
  removeStoredValue(SHOWCASE_PENDING_CHAT_CAMERA_KEY)
}

function prepareChatCameraCapture(storeId: string): string {
  deletePendingChatCameraFile(storeId)
  return createTempCameraUri(storeId)
}

const PRODUCT_IMAGE_LONG_EDGE = 1600
const PRODUCT_IMAGE_JPEG_QUALITY = 0.88

const PRODUCT_IMAGE_MEDIUM_LONG_EDGE = 800
const PRODUCT_IMAGE_THUMB_LONG_EDGE = 400
const PRODUCT_IMAGE_BLUR_LONG_EDGE = 32

const CHAT_IMAGE_LONG_EDGE = 1080
const CHAT_IMAGE_JPEG_QUALITY = 0.84

const CHAT_IMAGE_MEDIUM_LONG_EDGE = 800
const CHAT_IMAGE_THUMB_LONG_EDGE = 400
const CHAT_IMAGE_BLUR_LONG_EDGE = 32

const ANNOUNCEMENT_IMAGE_LONG_EDGE = 1280
const ANNOUNCEMENT_IMAGE_JPEG_QUALITY = 0.86

const ANNOUNCEMENT_IMAGE_MEDIUM_LONG_EDGE = 800
const ANNOUNCEMENT_IMAGE_THUMB_LONG_EDGE = 400
const ANNOUNCEMENT_IMAGE_BLUR_LONG_EDGE = 32

const STORE_COVER_IMAGE_LONG_EDGE = 1280
const STORE_COVER_IMAGE_JPEG_QUALITY = 0.86

const STORE_COVER_IMAGE_MEDIUM_LONG_EDGE = 900
const STORE_COVER_IMAGE_THUMB_LONG_EDGE = 480
const STORE_COVER_IMAGE_BLUR_LONG_EDGE = 32

const STORE_LOGO_IMAGE_LONG_EDGE = 512
const STORE_LOGO_IMAGE_JPEG_QUALITY = 0.9

const STORE_LOGO_IMAGE_MEDIUM_LONG_EDGE = 512
const STORE_LOGO_IMAGE_THUMB_LONG_EDGE = 256
const STORE_LOGO_IMAGE_BLUR_LONG_EDGE = 32

function normalizeImageContentType(value: string | null | undefined): string {
  const clean = String(value || '').trim().toLowerCase()

  if (clean === 'image/jpg') return 'image/jpeg'
  if (clean === 'image/jpeg') return 'image/jpeg'
  if (clean === 'image/png') return 'image/png'
  if (clean === 'image/webp') return 'image/webp'

  return 'image/jpeg'
}

function imageExtensionFromContentType(value: string | null | undefined): string {
  const contentType = normalizeImageContentType(value)

  if (contentType === 'image/png') return 'png'
  if (contentType === 'image/webp') return 'webp'

  return 'jpg'
}

function uploadImageProfileForBucket(bucket: 'dish' | 'store' | 'announcement', pathPrefix: string): {
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

function buildImageUploadFileName(inputFileName: string | null | undefined, contentType: string): string {
  const extension = imageExtensionFromContentType(contentType)
  const cleanFileName = String(inputFileName || '').trim()

  if (!cleanFileName) {
    return `${createId('image')}.${extension}`
  }

  const withoutExtension = cleanFileName.replace(/\.[a-zA-Z0-9]+$/, '')
  return `${withoutExtension}.${extension}`
}

async function compressImage(file: File | Blob, maxLongEdge = PRODUCT_IMAGE_LONG_EDGE, jpegQuality = PRODUCT_IMAGE_JPEG_QUALITY): Promise<Blob> {
  if (!isBrowser()) return file

  const sourceType = normalizeImageContentType(file.type || 'image/jpeg')

  if (!sourceType.startsWith('image/')) return file

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

    if (!sourceWidth || !sourceHeight) return file

    const longEdge = Math.max(sourceWidth, sourceHeight)
    const scale = longEdge <= maxLongEdge ? 1 : maxLongEdge / longEdge
    const targetWidth = Math.max(1, Math.round(sourceWidth * scale))
    const targetHeight = Math.max(1, Math.round(sourceHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const context = canvas.getContext('2d')
    if (!context) return file

    context.drawImage(image, 0, 0, targetWidth, targetHeight)

    return await new Promise<Blob>((resolve) => {
      canvas.toBlob(blob => {
        resolve(blob || file)
      }, 'image/jpeg', jpegQuality)
    })
  } catch {
    return file
  } finally {
    revokeLocalObjectUrl(sourceUrl)
  }
}

type ShowcaseImageVariantName = 'original' | 'large' | 'medium' | 'thumb' | 'blur'

type ShowcaseImageVariantSpec = {
  name: ShowcaseImageVariantName
  maxLongEdge: number
  jpegQuality: number
}

type UploadedShowcaseImage = {
  url: string
  variants: ShowcaseImageVariants | null
}

function createRemoteOnlyImageVariants(urlInput: string | null | undefined): ShowcaseImageVariants | null {
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

function buildImageVariantSpecs(bucket: 'dish' | 'store' | 'announcement' | 'chat', pathPrefix: string): ShowcaseImageVariantSpec[] {
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

function buildImageVariantFileName(inputFileName: string | null | undefined, variantName: ShowcaseImageVariantName): string {
  const cleanFileName = String(inputFileName || '').trim()
  const baseName = cleanFileName
    ? cleanFileName.replace(/\.[a-zA-Z0-9]+$/, '')
    : createId('image')

  return `${baseName}-${variantName}.jpg`
}

async function blobToDataImageUrl(blob: Blob): Promise<string | null> {
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

function clearStoredMerchantSession(): void {
  clearPersistedMerchantSession(true)
}

function persistMerchantSession(session: MerchantAuthSession | null, remember: boolean): void {
  persistCurrentMerchantSession(session, remember)
}
function persistFavoritesToStorage(storeId: string, ids: string[]): void {
  writeFavoriteIds(storeId, ids)
}

function readPersistedStoreProfileDraft(storeId: string): ShowcaseStoreProfileDraft | null {
  const all = readJson<Array<{ storeId: string; draft: ShowcaseStoreProfileDraft }>>(SHOWCASE_STORE_PROFILE_DRAFT_KEY, [])
  return all.find(item => item.storeId === storeId)?.draft || null
}

function writePersistedStoreProfileDraft(storeId: string, draft: ShowcaseStoreProfileDraft | null): void {
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

function formatUsd(value: number | null | undefined): string {
  const price = Number(value || 0)
  if (!Number.isFinite(price) || price <= 0) return '$0'
  return `$${Number.isInteger(price) ? String(price) : price.toFixed(2).replace(/\.?0+$/, '')}`
}
type ShowcaseDishPriceTextSnapshot = {
  priceText: string
  originalPriceText: string | null
  discountPriceText: string | null
}

function buildDishPriceTextSnapshot(dish: DemoDish): ShowcaseDishPriceTextSnapshot {
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

function buildChatProductShareFromDish(dish: DemoDish): ShowcaseChatProductShare {
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

function encodeAppointmentPriceSnapshotFromDish(dish: DemoDish): string {
  const priceSnapshot = buildDishPriceTextSnapshot(dish)

  return JSON.stringify({
    priceText: priceSnapshot.priceText,
    originalPriceText: priceSnapshot.originalPriceText,
    discountPriceText: priceSnapshot.discountPriceText
  })
}

function decodeAppointmentPriceSnapshot(value: string | null | undefined): ShowcaseDishPriceTextSnapshot {
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
function formatPlainNumber(value: number | null | undefined): string {
  const price = Number(value || 0)
  if (!Number.isFinite(price) || price <= 0) return ''
  return Number.isInteger(price) ? String(price) : price.toFixed(2).replace(/\.?0+$/, '')
}

function formatDateTimeText(value: number | null | undefined): string {
  return formatShowcaseDateTime(value)
}

function formatChatCreatedAtText(value: number | null | undefined): string {
  return formatShowcaseDateTime(value)
}

function getChatMessageWindowBounds(messages: ChatMessage[]): {
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

function formatDateLabel(value: string | number | null | undefined): string {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return formatDateTimeText(value)
  return ''
}

function normalizeSortMode(value: string | null | undefined): ShowcaseHomeSortMode {
  if (value === 'PriceAsc') return 'PriceAsc'
  if (value === 'PriceDesc') return 'PriceDesc'
  return 'Default'
}

function resolveDishImages(dish: DemoDish | null | undefined): string[] {
  if (!dish) return []
  return (dish.imageUrls || [])
    .map(url => String(url || '').trim())
    .filter(Boolean)
}

function resolveDishImage(dish: DemoDish | null | undefined): string | null {
  return resolveDishImages(dish)[0] || null
}

function clampIndex(index: number, total: number): number {
  if (!total) return 0
  if (!Number.isFinite(index)) return 0
  return Math.min(Math.max(Math.round(index), 0), total - 1)
}

function sortDishes(items: DemoDish[], sortMode: ShowcaseHomeSortMode): DemoDish[] {
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

function hasDiscount(dish: DemoDish): boolean {
  const originalPrice = Number(dish.originalPrice)
  const discountPrice = Number(dish.discountPrice)

  return Number.isFinite(originalPrice) &&
    Number.isFinite(discountPrice) &&
    originalPrice > 0 &&
    discountPrice > 0 &&
    discountPrice < originalPrice
}

function parseHomePriceDraft(valueInput: string): number | null {
  const value = Number.parseInt(valueInput.trim(), 10)

  return Number.isFinite(value) ? value : null
}

function syncStateForCloudItem(): SyncState {
  return 'Synced'
}

function manualCategoryNamesToCloudCategories(categories: string[]): CloudCategory[] {
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

function cloudCategoriesToManualCategoryNames(categories: CloudCategory[]): string[] {
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

function buildPendingDishSyncOperations(items: DemoDish[]): PendingSyncOperation[] {
  const operations = new Map<string, PendingSyncOperation>()

  items.forEach(item => {
    if (!item.id) return

    const shouldSync =
      item.dirty === true ||
      item.syncState === 'Pending' ||
      item.syncState === 'Failed'

    if (!shouldSync) return

    operations.set(`dish-upsert:${item.id}`, {
      id: `dish-upsert:${item.id}`,
      type: 'dish-upsert',
      dishId: item.id,
      createdAt: item.updatedAt || nowMillis()
    })
  })

  return Array.from(operations.values())
}

function cloudAnnouncementToCard(item: CloudAnnouncement): ShowcaseAnnouncementCard {
  return {
    id: item.id,
    coverUrl: item.coverUrl,
    bodyPreview: item.body,
    bodyText: item.body,
    timeText: formatDateTimeText(item.updatedAt || item.createdAt) || 'Just now',
    viewCount: item.viewCount
  }
}

function appointmentsStatusFromCloud(valueInput: string | null | undefined): string {
  const value = String(valueInput || '').trim().toLowerCase()

  if (value === 'confirmed') return 'Confirmed'
  if (value === 'completed') return 'Completed'
  if (value === 'cancelled' || value === 'canceled') return 'Cancelled'
  if (value === 'no_show' || value === 'no show' || value === 'no-show') return 'No-show'
  if (value === 'pending') return 'Pending'

  return valueInput ? String(valueInput) : DEFAULT_APPOINTMENT_STATUS
}

function appointmentsStatusToCloud(valueInput: string): string {
  const value = valueInput.trim().toLowerCase()

  if (value === 'confirmed') return 'confirmed'
  if (value === 'completed') return 'completed'
  if (value === 'cancelled' || value === 'canceled') return 'cancelled'
  if (value === 'no show' || value === 'no_show' || value === 'no-show') return 'no_show'

  return 'pending'
}

function appointmentCloudStatusFilterFromUi(valueInput: string): string | null {
  const value = String(valueInput || '').trim()

  if (!value || value === 'All') return null

  return appointmentsStatusToCloud(value)
}

function appointmentCloudServiceFilterFromUi(valueInput: string): string | null {
  const value = String(valueInput || '').trim()

  if (!value || value === 'All') return null

  return value
}

function appointmentCloudDateFiltersFromUi(
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

function appointmentStatusPushTitle(valueInput: string): string {
  const status = appointmentsStatusFromCloud(valueInput)

  if (status === 'Confirmed') return 'Booking confirmed'
  if (status === 'Completed') return 'Booking completed'
  if (status === 'Cancelled') return 'Booking cancelled'
  if (status === 'No-show') return 'Booking marked no-show'

  return 'Booking updated'
}

function cloudAppointmentToUi(item: CloudAppointmentRequest, dish: DemoDish | null = null): ShowcaseAppointmentCard {
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

function appointmentToCard(item: CloudAppointmentRequest, dish: DemoDish | null = null): ShowcaseAppointmentCard {
  return cloudAppointmentToUi(item, dish)
}

function chatMessageToUiMessage(message: ChatMessage, currentRole: 'merchant' | 'user', product: ShowcaseChatProductShare | null): ShowcaseChatMessage {
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

function chatThreadSummaryToUi(item: ChatThreadSummary): ShowcaseChatThreadSummaryUi {
  return chatThreadSummaryToUiFromDomain(item)
}

function storeProfileFromCloud(profile: CloudStoreProfile | null): ShowcaseStoreProfile {
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

function storeProfileFromCachedProfile(
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

function storeProfileDraftFromProfile(profile: ShowcaseStoreProfile): ShowcaseStoreProfileDraft {
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

function mapCloudPlanType(valueInput: string | null | undefined): string {
  const value = String(valueInput || '').trim().toLowerCase()

  if (value === 'paid') return 'Paid'
  if (value === 'trial') return 'Trial'
  if (value === 'free') return 'Free'

  return valueInput ? String(valueInput) : 'Trial'
}

function buildCloudStatusLabel(valueInput: string | null | undefined, canWrite: boolean): string {
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
function parseCloudIsoMillis(valueInput: string | null | undefined): number | null {
  const value = String(valueInput || '').trim()
  if (!value) return null

  const parsed = Date.parse(value)
  if (!Number.isFinite(parsed)) return null

  return parsed
}

function formatCloudDateTimeLabel(valueInput: string | null | undefined): string {
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

function buildCloudDaysRemainingLabel(serviceEndAtInput: string | null | undefined): string {
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
function cloudStatusToUi(status: CloudStoreServiceStatus | null, storeId: string): ShowcaseCloudStatusUi | null {
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

function categoryOptionsFromDishes(dishes: DemoDish[]): string[] {
  return deriveCategoriesFromModels(dishes)
}

function allTagsFromDishes(dishes: DemoDish[]): string[] {
  return deriveAllTags(dishes)
}

function dishFilterRowsToTags(rows: CloudDishFilterRow[]): string[] {
  return Array.from(
    new Set(
      rows
        .flatMap(item => item.tags || [])
        .map(item => String(item || '').trim())
        .filter(Boolean)
    )
  ).sort()
}

function mapFavoriteCard(dish: DemoDish): ShowcaseFavoriteCard {
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

function defaultAppointmentSettings(storeId: string): CloudAppointmentSettings {
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

function appointmentTimeToMinutes(valueInput: string): number | null {
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

function appointmentMinutesToTime(valueInput: number): string {
  const value = Math.max(0, Math.min(23 * 60 + 59, Math.round(valueInput)))
  const hour = Math.floor(value / 60)
  const minute = value % 60

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function appointmentMinimumNoticeToMillis(valueInput: string): number {
  const value = valueInput.trim().toLowerCase()
  if (!value) return 0

  const amount = Number(value.match(/\d+/)?.[0] || 0)
  if (!Number.isFinite(amount) || amount <= 0) return 0

  if (value.includes('day')) return amount * 24 * 60 * 60 * 1000
  if (value.includes('hour')) return amount * 60 * 60 * 1000
  if (value.includes('min')) return amount * 60 * 1000

  return amount * 60 * 60 * 1000
}

function appointmentClosedDayKey(date: Date): string {
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

function appointmentLocalDateKey(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function customerAppointmentDateOptions(settings: CloudAppointmentSettings): ShowcaseAppointmentDateOption[] {
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

function customerAppointmentTimeOptionsForDate(settings: CloudAppointmentSettings, dateValueInput: string): string[] {
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

function buildAppointmentDateOptions(settings: CloudAppointmentSettings): ShowcaseAppointmentDateOption[] {
  return customerAppointmentDateOptions(settings)
}

function buildAppointmentTimeOptions(settings: CloudAppointmentSettings): string[] {
  return customerAppointmentTimeOptionsForDate(settings, '')
}

function buildDefaultConversationId(storeId: string, clientId: string): string {
  return `cloud:${storeId}:${clientId}`
}

function decorateCloudHomeResults(input: {
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

function toShowcaseHomeDish(dish: DemoDish): ShowcaseHomeDish {
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

const NDJC_VM_TRACE_ENABLED = false

function ndjcTrace(label: string, payload?: Record<string, unknown>): void {
  if (!NDJC_VM_TRACE_ENABLED) return
  if (typeof console === 'undefined') return

  console.warn(`[NDJC_TRACE] ${label}`, {
    at: new Date().toISOString(),
    ...payload
  })
}

function ndjcTraceError(label: string, errorInput: unknown, payload?: Record<string, unknown>): void {
  if (!NDJC_VM_TRACE_ENABLED) return
  if (typeof console === 'undefined') return

  console.error(`[NDJC_TRACE_ERROR] ${label}`, {
    at: new Date().toISOString(),
    message: errorInput instanceof Error ? errorInput.message : String(errorInput || ''),
    error: errorInput,
    ...payload
  })
}

export function useShowcaseViewModel(input: UseShowcaseViewModelInput = {}): ShowcaseUiModel {
  const storeId = normalizeStoreId(input.storeId)
  setCurrentStoreId(storeId)

  const repositoryRef = useRef<ShowcaseCloudRepository | null>(null)

  if (!repositoryRef.current) {
    repositoryRef.current = input.repository || createShowcaseCloudRepository(
      createShowcaseCloudRepositoryConfig(storeId)
    )
  }

  const repository = repositoryRef.current

  const chatRepositoryRef = useRef<ShowcaseChatRepository | null>(null)

  if (!chatRepositoryRef.current) {
    chatRepositoryRef.current = createShowcaseChatRepository({
      cloud: repository,
      chatCloud: createShowcaseChatCloudRepository({
        logTag: 'ChatTrace'
      }),
      storagePrefix: `ndjc_showcase_chat_repository_${storeId}`,
      chatCloudEnabled: true,
      chatRelayEnabled: false
    })
  }

  const chatRepository = chatRepositoryRef.current
  const initialMerchantSessionRef = useRef<MerchantAuthSession | null>(null)
  const initialMerchantLoginNameRef = useRef<string>(readLastMerchantLoginName())
  const initialClientIdRef = useRef<string>(readClientId())
  const defaultUiState = useMemo(() => createDefaultShowcaseUiState(), [])
  const defaultChatUiState = useMemo(() => createDefaultShowcaseChatUiState(), [])

  const [screen, setScreen] = useState<ShowcaseScreenName>(input.initialScreen || defaultUiState.screen)
  const [previousScreen, setPreviousScreen] = useState<ShowcaseScreenName>(defaultUiState.screen)
  const [isHydrated, setIsHydrated] = useState(false)

  const [clientId] = useState(initialClientIdRef.current)
  const [merchantSession, setMerchantSession] = useState<MerchantAuthSession | null>(initialMerchantSessionRef.current)
  const [merchantBindings, setMerchantBindings] = useState<MerchantStoreMembership[]>([])
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const renderCountRef = useRef(0)
  const currentScreenRef = useRef<ShowcaseScreenName>(screen)
  const isAdminLoggedInRef = useRef(isAdminLoggedIn)
  const merchantSessionRef = useRef<MerchantAuthSession | null>(merchantSession)

  renderCountRef.current += 1

  if (renderCountRef.current % 50 === 0) {
    ndjcTrace('VM_RENDER_COUNT', {
      count: renderCountRef.current,
      screen,
      previousScreen,
      isHydrated,
      isAdminLoggedIn,
      hasMerchantSession: Boolean(merchantSession?.accessToken),
      merchantBindingsCount: merchantBindings.length,
      storeId
    })
  }

  useEffect(() => {
    currentScreenRef.current = screen
    isAdminLoggedInRef.current = isAdminLoggedIn
    merchantSessionRef.current = merchantSession
  }, [screen, isAdminLoggedIn, merchantSession])

  useEffect(() => {
    setCurrentStoreId(storeId)
    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)
  }, [merchantSession, repository, storeId])

  useEffect(() => {
    const subscription = onShowcaseAuthStateChange((event, authSession) => {
      if (event === 'SIGNED_OUT') {
        const preservedLoginName = getPreferredLoginNameForLoginScreen()

        clearStoreMerchantSession()
        bindMerchantSessionToRepository(repository)
        setStoreMerchantSessionFromAuthSession(null)
        setMerchantSession(null)
        setMerchantBindings([])
        setIsAdminLoggedIn(false)
        clearStoredMerchantSession()
        setAdminUsernameDraft(preservedLoginName)
        setLoginUsernameDraft(preservedLoginName)
        setAdminPasswordDraft('')
        setLoginPasswordDraft('')
        setLoginError(null)
        setIsLoginLoading(false)
        return
      }

      if (event !== 'TOKEN_REFRESHED' && event !== 'USER_UPDATED') {
        return
      }

      const currentSession = merchantSessionRef.current

      if (!currentSession?.authUserId || !authSession?.accessToken || !authSession.authUserId) {
        return
      }

      if (currentSession.authUserId.toLowerCase() !== authSession.authUserId.toLowerCase()) {
        const preservedLoginName = getPreferredLoginNameForLoginScreen()

        clearStoreMerchantSession()
        bindMerchantSessionToRepository(repository)
        setStoreMerchantSessionFromAuthSession(null)
        setMerchantSession(null)
        setMerchantBindings([])
        setIsAdminLoggedIn(false)
        clearStoredMerchantSession()
        setAdminUsernameDraft(preservedLoginName)
        setLoginUsernameDraft(preservedLoginName)
        setAdminPasswordDraft('')
        setLoginPasswordDraft('')
        setLoginError('Session expired. Please sign in again.')
        setIsLoginLoading(false)
        return
      }

      const nextSession: MerchantAuthSession = {
        ...currentSession,
        accessToken: authSession.accessToken,
        refreshToken: null,
        authUserId: authSession.authUserId,
        loginName: authSession.email || currentSession.loginName,
        expiresAt: authSession.expiresAt || currentSession.expiresAt
      }

      writeMerchantSession(nextSession)
      setStoreMerchantSessionFromAuthSession(nextSession)
      bindMerchantSessionToRepository(repository)
      setMerchantSession(nextSession)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [repository])
  useEffect(() => {
    if (!isBrowser()) return
    if (!isAdminLoggedIn && !merchantSession?.accessToken) return

    let refreshInFlight = false

    const runResumeRefresh = (): void => {
      if (refreshInFlight) return

      refreshInFlight = true

      void refreshMerchantSessionForPwaResume().finally(() => {
        refreshInFlight = false
      })
    }

    const handleFocus = (): void => {
      runResumeRefresh()
    }

    const handleOnline = (): void => {
      runResumeRefresh()
    }

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        runResumeRefresh()
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('online', handleOnline)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('online', handleOnline)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [
    isAdminLoggedIn,
    merchantSession?.accessToken,
    merchantSession?.authUserId,
    repository,
    screen,
    storeId
  ])

  const [dishes, setDishes] = useState<DemoDish[]>(() => {
    if (input.previewMode === false) {
      return []
    }

    const localDishes = loadDishesFromStorage(storeId)

    if (localDishes.length) {
      return localDishes
    }

    return initialDishes
  })
  const [dishEntitiesById, setDishEntitiesById] = useState<Record<string, DemoDish>>(() => {
    const localDishes = input.previewMode === false
      ? []
      : loadDishesFromStorage(storeId)
    const sourceItems = localDishes.length ? localDishes : initialDishes
    const entities: Record<string, DemoDish> = {}

    sourceItems.forEach(item => {
      const id = String(item.id || '').trim()
      if (id) {
        entities[id] = item
      }
    })

    return entities
  })
  const [homeDishIds, setHomeDishIds] = useState<string[]>(() => {
    const localDishes = input.previewMode === false
      ? []
      : loadDishesFromStorage(storeId)
    const sourceItems = localDishes.length ? localDishes : initialDishes

    return sourceItems
      .filter(item => !item.isHidden)
      .map(item => String(item.id || '').trim())
      .filter(Boolean)
  })
  const [adminItemIds, setAdminItemIds] = useState<string[]>(() => {
    const localDishes = input.previewMode === false
      ? []
      : loadDishesFromStorage(storeId)
    const sourceItems = localDishes.length ? localDishes : initialDishes

    return sourceItems
      .map(item => String(item.id || '').trim())
      .filter(Boolean)
  })
  const [categories, setCategories] = useState<CloudCategory[]>(() => {
    const localDishes = input.previewMode === false
      ? []
      : loadDishesFromStorage(storeId)
    const localManualCategories = input.previewMode === false
      ? []
      : loadManualCategoriesFromStorage(storeId)
    const sourceItems = localDishes.length ? localDishes : initialDishes
    const categoryNames = deriveCategoriesFromModels(sourceItems, localManualCategories)

    return manualCategoryNamesToCloudCategories(categoryNames)
  })
  const [homeDishFilterRows, setHomeDishFilterRows] = useState<CloudDishFilterRow[]>([])
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => readFavoriteIds(storeId))
  const [favoriteAddedAt, setFavoriteAddedAt] = useState<Record<string, number>>(() => loadFavoriteAddedAtFromStorage(storeId))
  const [favoriteSnapshots, setFavoriteSnapshots] = useState<Record<string, ShowcaseFavoriteSnapshot>>(() => loadFavoriteSnapshotsFromStorage(storeId))
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null)
  const [detailImageIndex, setDetailImageIndex] = useState(0)

  const [cloudStatus, setCloudStatus] = useState<CloudStoreServiceStatus | null>(null)
  const [isLoading, setIsLoading] = useState(defaultUiState.isLoading)
  const [isCloudLoading, setIsCloudLoading] = useState(false)
  const [isWriteAllowed, setIsWriteAllowed] = useState(defaultUiState.cloudStatus?.canWrite ?? true)
  const [statusMessage, setStatusMessage] = useState<string | null>(defaultUiState.statusMessage)
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState(() => {
    return isBrowser() ? window.navigator.onLine === false : false
  })
  const [syncOverviewState, setSyncOverviewState] = useState<ShowcaseSyncOverviewState>(defaultUiState.syncOverviewState)
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(defaultUiState.lastSyncAt)
  const [pendingSyncOperations, setPendingSyncOperations] = useState<PendingSyncOperation[]>(() => {
    return buildPendingDishSyncOperations(loadDishesFromStorage(storeId))
  })
  const pendingSyncRetryInFlightRef = useRef(false)
  const pendingSyncOperationsRef = useRef<PendingSyncOperation[]>(pendingSyncOperations)
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(defaultUiState.syncErrorMessage)
  const [lastRetryOp, setLastRetryOp] = useState<ShowcaseRetryOp | null>(defaultUiState.lastRetryOp)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(defaultUiState.selectedCategory)
  const [adminItemsSelectedCategory, setAdminItemsSelectedCategory] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultUiState.selectedTags)
  const [searchQuery, setSearchQuery] = useState(defaultUiState.searchQuery)
  const [sortMode, setSortMode] = useState<ShowcaseHomeSortMode>(defaultUiState.sortMode)
  const [filterRecommendedOnly, setFilterRecommendedOnly] = useState(defaultUiState.filterRecommendedOnly)
  const [filterOnSaleOnly, setFilterOnSaleOnly] = useState(defaultUiState.filterOnSaleOnly)
  const [homeShowSortMenu, setHomeShowSortMenu] = useState(defaultUiState.homeShowSortMenu)
  const [homeShowFilterMenu, setHomeShowFilterMenu] = useState(defaultUiState.homeShowFilterMenu)
  const [homeShowPriceMenu, setHomeShowPriceMenu] = useState(defaultUiState.homeShowPriceMenu)
  const [homePriceMinDraft, setHomePriceMinDraft] = useState(defaultUiState.homePriceMinDraft)
  const [homePriceMaxDraft, setHomePriceMaxDraft] = useState(defaultUiState.homePriceMaxDraft)
  const [homeAppliedMinPrice, setHomeAppliedMinPrice] = useState<number | null>(defaultUiState.homeAppliedMinPrice)
  const [homeAppliedMaxPrice, setHomeAppliedMaxPrice] = useState<number | null>(defaultUiState.homeAppliedMaxPrice)

  const [adminItemsSortMode, setAdminItemsSortMode] = useState<ShowcaseHomeSortMode>(defaultUiState.adminItemsSortMode)
  const [adminItemsSearchQuery, setAdminItemsSearchQuery] = useState(defaultUiState.adminItemsSearchQuery)
  const [adminItemsFilterRecommended, setAdminItemsFilterRecommended] = useState(defaultUiState.adminItemsFilterRecommended)
  const [adminItemsFilterHiddenOnly, setAdminItemsFilterHiddenOnly] = useState(defaultUiState.adminItemsFilterHiddenOnly)
  const [adminItemsFilterDiscountOnly, setAdminItemsFilterDiscountOnly] = useState(defaultUiState.adminItemsFilterDiscountOnly)
  const [adminItemsSortAscending, setAdminItemsSortAscending] = useState(defaultUiState.adminItemsSortAscending)
  const [adminItemsPriceMinDraft, setAdminItemsPriceMinDraft] = useState(defaultUiState.adminItemsPriceMinDraft)
  const [adminItemsPriceMaxDraft, setAdminItemsPriceMaxDraft] = useState(defaultUiState.adminItemsPriceMaxDraft)
  const [adminItemsAppliedMinPrice, setAdminItemsAppliedMinPrice] = useState<number | null>(defaultUiState.adminItemsAppliedMinPrice)
  const [adminItemsAppliedMaxPrice, setAdminItemsAppliedMaxPrice] = useState<number | null>(defaultUiState.adminItemsAppliedMaxPrice)
  const [adminSelectedDishIds, setAdminSelectedDishIds] = useState<string[]>(defaultUiState.adminSelectedDishIds)
  const [pendingDeleteDishId, setPendingDeleteDishId] = useState<string | null>(defaultUiState.pendingDeleteDishId)
  const [adminEntryMode, setAdminEntryMode] = useState<AdminEntryMode>(defaultUiState.adminEntryMode)
  const [adminUsernameDraft, setAdminUsernameDraft] = useState(initialMerchantLoginNameRef.current || defaultUiState.adminUsernameDraft)
  const [adminPasswordDraft, setAdminPasswordDraft] = useState(defaultUiState.adminPasswordDraft)
  const [adminPendingDeleteCategory, setAdminPendingDeleteCategory] = useState<PendingDeleteCategoryDialog>(null)
  const [adminCannotDeleteCategory, setAdminCannotDeleteCategory] = useState<string | null>(defaultUiState.adminCannotDeleteCategory)
  const [categorySubmittingAction, setCategorySubmittingAction] = useState<'add' | 'rename' | 'delete' | 'reorder' | null>(null)

  const [loginUsernameDraft, setLoginUsernameDraft] = useState(initialMerchantLoginNameRef.current || defaultUiState.loginUsernameDraft)
  const [loginPasswordDraft, setLoginPasswordDraft] = useState(defaultUiState.loginPasswordDraft)
  const [loginRememberMeDraft, setLoginRememberMeDraft] = useState(readRememberMe())
  const [loginError, setLoginError] = useState<string | null>(defaultUiState.loginError)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  const [changePasswordCurrentDraft, setChangePasswordCurrentDraft] = useState(defaultUiState.changePasswordCurrentDraft)
  const [changePasswordNewDraft, setChangePasswordNewDraft] = useState(defaultUiState.changePasswordNewDraft)
  const [changePasswordConfirmDraft, setChangePasswordConfirmDraft] = useState(defaultUiState.changePasswordConfirmDraft)
  const [changePasswordError, setChangePasswordError] = useState<string | null>(defaultUiState.changePasswordError)
  const [changePasswordSuccess, setChangePasswordSuccess] = useState<string | null>(defaultUiState.changePasswordSuccess)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [storeProfileCloud, setStoreProfileCloud] = useState<CloudStoreProfile | null>(null)
  const [storeProfile, setStoreProfile] = useState<ShowcaseStoreProfile | null>(() => {
    const cachedProfile = loadStoreProfileFromStorage(storeId)

    return cachedProfile
      ? storeProfileFromCachedProfile(cachedProfile)
      : storeProfileFromCloud(null)
  })
  const [storeProfileDraft, setStoreProfileDraft] = useState<ShowcaseStoreProfileDraft | null>(() => {
    const persisted = readPersistedStoreProfileDraft(storeId)
    if (persisted) return persisted

    const cachedProfile = loadStoreProfileFromStorage(storeId)
    const sourceProfile = cachedProfile
      ? storeProfileFromCachedProfile(cachedProfile)
      : storeProfileFromCloud(null)

    return storeProfileDraftFromProfile(sourceProfile)
  })
  const [storeProfileServices, setStoreProfileServices] = useState<string[]>(() => {
    return loadStoreProfileFromStorage(storeId)?.services || defaultUiState.storeProfileServices
  })
  const [storeProfileExtraContacts, setStoreProfileExtraContacts] = useState<ShowcaseExtraContact[]>(() => {
    return loadStoreProfileFromStorage(storeId)?.extraContacts || defaultUiState.storeProfileExtraContacts
  })
  const [draftStoreProfileServices, setDraftStoreProfileServices] = useState<string[]>(() => {
    return loadStoreProfileFromStorage(storeId)?.services || defaultUiState.draftStoreProfileServices
  })
  const [draftStoreProfileExtraContacts, setDraftStoreProfileExtraContacts] = useState<DraftExtraContact[]>(() => {
    const cachedContacts = loadStoreProfileFromStorage(storeId)?.extraContacts || []

    if (!cachedContacts.length) return defaultUiState.draftStoreProfileExtraContacts

    return cachedContacts.map((item, index) => ({
      id: `cached_extra_contact_${index + 1}`,
      name: item.name,
      value: item.value
    }))
  })
  const [storeProfileCoverUrl, setStoreProfileCoverUrl] = useState(() => {
    return loadStoreProfileFromStorage(storeId)?.coverUrl || defaultUiState.storeProfileCoverUrl
  })
  const [storeProfileLogoUrl, setStoreProfileLogoUrl] = useState(() => {
    return loadStoreProfileFromStorage(storeId)?.logoUrl || defaultUiState.storeProfileLogoUrl
  })
  const [draftStoreProfileCoverUrl, setDraftStoreProfileCoverUrl] = useState(() => {
    return loadStoreProfileFromStorage(storeId)?.coverUrl || defaultUiState.draftStoreProfileCoverUrl
  })
  const [draftStoreProfileLogoUrl, setDraftStoreProfileLogoUrl] = useState(() => {
    return loadStoreProfileFromStorage(storeId)?.logoUrl || defaultUiState.draftStoreProfileLogoUrl
  })
  const [draftStoreProfileDescription, setDraftStoreProfileDescription] = useState(() => {
    return loadStoreProfileFromStorage(storeId)?.description || defaultUiState.draftStoreProfileDescription
  })
  const [draftBusinessStatus, setDraftBusinessStatus] = useState(() => {
    return loadStoreProfileFromStorage(storeId)?.businessStatus || defaultUiState.draftBusinessStatus
  })
  const [isEditingStoreProfile, setIsEditingStoreProfile] = useState(defaultUiState.isEditingStoreProfile)
  const [isSavingStoreProfile, setIsSavingStoreProfile] = useState(defaultUiState.isSavingStoreProfile)
  const [isRefreshingStoreProfile, setIsRefreshingStoreProfile] = useState(false)
  const [storeProfileSaveError, setStoreProfileSaveError] = useState<string | null>(defaultUiState.storeProfileSaveError)
  const [storeProfileSaveSuccess, setStoreProfileSaveSuccess] = useState(defaultUiState.storeProfileSaveSuccess)

  const [editDishId, setEditDishId] = useState<string | null>(null)
  const [editDishName, setEditDishName] = useState('')
  const [editDishDescription, setEditDishDescription] = useState('')
  const [editDishCategory, setEditDishCategory] = useState<string | null>(null)
  const [editDishOriginalPrice, setEditDishOriginalPrice] = useState('')
  const [editDishDiscountPrice, setEditDishDiscountPrice] = useState('')
  const [editDishRecommended, setEditDishRecommended] = useState(false)
  const [editDishHidden, setEditDishHidden] = useState(false)
  const [editDishImageUrls, setEditDishImageUrls] = useState<string[]>([])
  const [isSavingEditDish, setIsSavingEditDish] = useState(defaultUiState.isSavingEditDish)
  const [isBlockingEditDish, setIsBlockingEditDish] = useState(defaultUiState.isBlockingEditDish)
  const [editValidationError, setEditValidationError] = useState<string | null>(defaultUiState.editValidationError)

  const [favoritesQuery, setFavoritesQuery] = useState(defaultUiState.favoritesQuery)
  const [favoritesSelectedIds, setFavoritesSelectedIds] = useState<string[]>(defaultUiState.favoritesSelectedIds)
  const [favoritesSortMode, setFavoritesSortMode] = useState<ShowcaseHomeSortMode>(defaultUiState.favoritesSortMode)
  const [favoritesFilterRecommendedOnly, setFavoritesFilterRecommendedOnly] = useState(defaultUiState.favoritesFilterRecommendedOnly)
  const [favoritesFilterOnSaleOnly, setFavoritesFilterOnSaleOnly] = useState(defaultUiState.favoritesFilterOnSaleOnly)
  const [favoritesPriceMinDraft, setFavoritesPriceMinDraft] = useState(defaultUiState.favoritesPriceMinDraft)
  const [favoritesPriceMaxDraft, setFavoritesPriceMaxDraft] = useState(defaultUiState.favoritesPriceMaxDraft)
  const [favoritesAppliedMinPrice, setFavoritesAppliedMinPrice] = useState<number | null>(defaultUiState.favoritesAppliedMinPrice)
  const [favoritesAppliedMaxPrice, setFavoritesAppliedMaxPrice] = useState<number | null>(defaultUiState.favoritesAppliedMaxPrice)
  const [favoritesShowSortMenu, setFavoritesShowSortMenu] = useState(defaultUiState.favoritesShowSortMenu)
  const [favoritesShowFilterMenu, setFavoritesShowFilterMenu] = useState(defaultUiState.favoritesShowFilterMenu)
  const [favoritesShowPriceMenu, setFavoritesShowPriceMenu] = useState(defaultUiState.favoritesShowPriceMenu)
  const [favoritesSelectedCategory, setFavoritesSelectedCategory] = useState<string | null>(defaultUiState.favoritesSelectedCategory)

  const [appointmentSettings, setAppointmentSettings] = useState<CloudAppointmentSettings>(() => defaultAppointmentSettings(storeId))
  const [appointmentsEnabled, setAppointmentsEnabled] = useState(defaultUiState.appointmentsEnabled)
  const [appointmentRequests, setAppointmentRequests] = useState<CloudAppointmentRequest[]>(() => loadAppointmentsFromStorage(storeId))
  const [adminAppointmentFilterRows, setAdminAppointmentFilterRows] = useState<CloudAppointmentFilterRow[]>([])
  const [customerAppointmentFilterRows, setCustomerAppointmentFilterRows] = useState<CloudAppointmentFilterRow[]>([])
  const [appointmentLinkedDishesById, setAppointmentLinkedDishesById] = useState<Record<string, DemoDish>>({})
  const [appointmentSourceDishId, setAppointmentSourceDishId] = useState<string | null>(defaultUiState.appointmentSourceDishId)
  const [appointmentServiceDraft, setAppointmentServiceDraft] = useState(defaultUiState.appointmentServiceDraft)
  const [appointmentNameDraft, setAppointmentNameDraft] = useState(defaultUiState.appointmentNameDraft)
  const [appointmentContactDraft, setAppointmentContactDraft] = useState(defaultUiState.appointmentContactDraft)
  const [appointmentDateDraft, setAppointmentDateDraft] = useState(defaultUiState.appointmentDateDraft)
  const [appointmentTimeDraft, setAppointmentTimeDraft] = useState(defaultUiState.appointmentTimeDraft)
  const [appointmentNoteDraft, setAppointmentNoteDraft] = useState(defaultUiState.appointmentNoteDraft)
  const [appointmentError, setAppointmentError] = useState<string | null>(defaultUiState.appointmentError)
  const [appointmentSuccess, setAppointmentSuccess] = useState<string | null>(defaultUiState.appointmentSuccess)
  const [appointmentsRefreshing, setAppointmentsRefreshing] = useState(defaultUiState.appointmentsRefreshing)
  const [appointmentStatusSubmittingId, setAppointmentStatusSubmittingId] = useState<string | null>(null)
  const [appointmentSettingsSubmitting, setAppointmentSettingsSubmitting] = useState(false)
  const [appointmentBookingWindowDays, setAppointmentBookingWindowDays] = useState(defaultUiState.appointmentBookingWindowDays)
  const [appointmentAvailableHoursText, setAppointmentAvailableHoursText] = useState(defaultUiState.appointmentAvailableHoursText)
  const [appointmentSlotIntervalMinutes, setAppointmentSlotIntervalMinutes] = useState(defaultUiState.appointmentSlotIntervalMinutes)
  const [appointmentClosedDays, setAppointmentClosedDays] = useState<string[]>(defaultUiState.appointmentClosedDays)
  const [appointmentMinimumNotice, setAppointmentMinimumNotice] = useState(defaultUiState.appointmentMinimumNotice)
  const [appointmentAdminDateFilter, setAppointmentAdminDateFilter] = useState(defaultUiState.appointmentAdminDateFilter)
  const [appointmentAdminStatusFilter, setAppointmentAdminStatusFilter] = useState(defaultUiState.appointmentAdminStatusFilter)
  const [appointmentAdminServiceFilter, setAppointmentAdminServiceFilter] = useState(defaultUiState.appointmentAdminServiceFilter)
  const [appointmentAdminHistoryDateFilter, setAppointmentAdminHistoryDateFilter] = useState<string | null>(defaultUiState.appointmentAdminHistoryDateFilter)
  const [appointmentCustomerDateFilter, setAppointmentCustomerDateFilter] = useState(defaultUiState.appointmentCustomerDateFilter)
  const [appointmentCustomerStatusFilter, setAppointmentCustomerStatusFilter] = useState(defaultUiState.appointmentCustomerStatusFilter)
  const [appointmentCustomerServiceFilter, setAppointmentCustomerServiceFilter] = useState(defaultUiState.appointmentCustomerServiceFilter)

  const [announcements, setAnnouncements] = useState<CloudAnnouncement[]>(() => {
    return loadPublishedAnnouncementsLocally(storeId)
      .filter(item => item.status === 'published')
      .sort((left, right) => {
        return (right.updatedAt || right.createdAt || 0) - (left.updatedAt || left.createdAt || 0)
      })
  })
  const [announcementsEntryDotVisible, setAnnouncementsEntryDotVisible] = useState(false)
  const [bookingsEntryDotVisible, setBookingsEntryDotVisible] = useState(false)
  const [adminAnnouncementDraftItems, setAdminAnnouncementDraftItems] = useState<DraftAnnouncement[]>([])
  const [adminAnnouncementComposerExpanded, setAdminAnnouncementComposerExpanded] = useState(defaultUiState.adminAnnouncementComposerExpanded)
  const [adminAnnouncementCoverDraftUrl, setAdminAnnouncementCoverDraftUrl] = useState<string | null>(defaultUiState.adminAnnouncementCoverDraftUrl)
  const [adminAnnouncementBodyDraft, setAdminAnnouncementBodyDraft] = useState(defaultUiState.adminAnnouncementBodyDraft)
  const [adminAnnouncementEditingId, setAdminAnnouncementEditingId] = useState<string | null>(defaultUiState.adminAnnouncementEditingId)
  const [adminAnnouncementSelectedIds, setAdminAnnouncementSelectedIds] = useState<string[]>(defaultUiState.adminAnnouncementSelectedIds)
  const [adminAnnouncementPreviewId, setAdminAnnouncementPreviewId] = useState<string | null>(defaultUiState.adminAnnouncementPreviewId)
  const [adminAnnouncementError, setAdminAnnouncementError] = useState<string | null>(defaultUiState.adminAnnouncementError)
  const [adminAnnouncementSuccess, setAdminAnnouncementSuccess] = useState(defaultUiState.adminAnnouncementSuccess)
  const [adminAnnouncementIsSubmitting, setAdminAnnouncementIsSubmitting] = useState(defaultUiState.adminAnnouncementIsSubmitting)
  const [adminAnnouncementIsBlocking, setAdminAnnouncementIsBlocking] = useState(defaultUiState.adminAnnouncementIsBlocking)
  const [adminAnnouncementSubmittingAction, setAdminAnnouncementSubmittingAction] = useState<'save' | 'publish' | 'delete' | null>(null)
  const [pushTargetAnnouncementId, setPushTargetAnnouncementId] = useState<string | null>(defaultUiState.pushTargetAnnouncementId)
  const [seenAnnouncementIds, setSeenAnnouncementIds] = useState<string[]>(() => loadViewedAnnouncementIdsLocally(storeId))
  const [pushToken, setPushToken] = useState<string | null>(null)
  const [pendingPushRoute, setPendingPushRoute] = useState<{
    type: 'chat' | 'announcement' | 'appointment'
    conversationId?: string | null
    announcementId?: string | null
    appointmentId?: string | null
    openAs?: string | null
  } | null>(null)
  const [focusedAnnouncementId, setFocusedAnnouncementId] = useState<string | null>(null)

  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null)
  const [activeConversationId, setActiveConversationId] = useState<string>(() => buildDefaultConversationId(storeId, initialClientIdRef.current))
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [merchantChatThreads, setMerchantChatThreads] = useState<ChatThreadSummary[]>([])
  const [merchantChatListRefreshing, setMerchantChatListRefreshing] = useState(defaultUiState.merchantChatListRefreshing)
  const [chatDraft, setChatDraft] = useState(() => readChatDraft(storeId, buildDefaultConversationId(storeId, initialClientIdRef.current))?.draft || defaultChatUiState.draft)
  const [chatDraftImageUrls, setChatDraftImageUrls] = useState<string[]>(() => readChatDraft(storeId, buildDefaultConversationId(storeId, initialClientIdRef.current))?.draftImageUrls || defaultChatUiState.draftImageUrls)
  const [chatPendingProduct, setChatPendingProduct] = useState<ShowcaseChatProductShare | null>(() => readChatDraft(storeId, buildDefaultConversationId(storeId, initialClientIdRef.current))?.pendingProduct || defaultChatUiState.pendingProduct)
  const [chatPendingAppointment, setChatPendingAppointment] = useState<ShowcaseChatAppointmentShare | null>(() => readChatDraft(storeId, buildDefaultConversationId(storeId, initialClientIdRef.current))?.pendingAppointment || defaultChatUiState.pendingAppointment)
  const [chatQuotedMessageId, setChatQuotedMessageId] = useState<string | null>(() => readChatDraft(storeId, buildDefaultConversationId(storeId, initialClientIdRef.current))?.quotedMessageId || defaultChatUiState.quotedMessageId)
  const [chatIsSending, setChatIsSending] = useState(defaultChatUiState.isSending)
  const [chatIsOpening, setChatIsOpening] = useState(false)
  const [chatStatusMessage, setChatStatusMessage] = useState<string | null>(defaultChatUiState.statusMessage)
  const [chatSelectedMessageIds, setChatSelectedMessageIds] = useState<string[]>(defaultChatUiState.selectedMessageIds)
  const [chatFindQuery, setChatFindQuery] = useState(defaultChatUiState.findQuery)
  const [chatFindResultIds, setChatFindResultIds] = useState<string[]>(defaultChatUiState.findResultIds)
  const [chatFocusedMessageId, setChatFocusedMessageId] = useState<string | null>(defaultChatUiState.focusedMessageId)
  const [chatScrollToMessageId, setChatScrollToMessageId] = useState<string | null>(defaultChatUiState.scrollToMessageId)
  const [chatScrollToMessageSignal, setChatScrollToMessageSignal] = useState(defaultChatUiState.scrollToMessageSignal)
  const [chatScrollToBottomSignal, setChatScrollToBottomSignal] = useState(0)
  const [chatFlashMessageId, setChatFlashMessageId] = useState<string | null>(defaultChatUiState.flashMessageId)
  const [chatFlashSignal, setChatFlashSignal] = useState(defaultChatUiState.flashSignal)
  const [chatMediaPreviewUrls, setChatMediaPreviewUrls] = useState<string[]>(defaultChatUiState.mediaPreviewUrls)
  const [chatMediaPreviewIndex, setChatMediaPreviewIndex] = useState(defaultChatUiState.mediaPreviewIndex)
  const [chatPinned, setChatPinned] = useState(defaultChatUiState.pinned)
  const [chatSearchResults, setChatSearchResults] = useState<ChatSearchResult[]>([])
  const [chatMediaItems, setChatMediaItems] = useState<ChatMediaItem[]>([])
  const [chatSearchPagination, setChatSearchPagination] = useState<ShowcasePaginationRuntimeState>({
    nextOffset: 0,
    hasMore: false,
    isLoadingMore: false
  })
  const [chatMediaPagination, setChatMediaPagination] = useState<ShowcasePaginationRuntimeState>({
    nextOffset: 0,
    hasMore: true,
    isLoadingMore: false
  })
  const [chatEntryDotVisible, setChatEntryDotVisible] = useState(false)
  const [chatPollingEnabled, setChatPollingEnabled] = useState(false)
  const [chatEntryPollingEnabled, setChatEntryPollingEnabled] = useState(false)
  const [chatMode, setChatModeState] = useState<ChatMode>('Client')

  const [homePagination, setHomePagination] = useState<ShowcasePaginationRuntimeState>({
    nextOffset: SHOWCASE_PAGE_SIZE.homeDishes,
    hasMore: true,
    isLoadingMore: false
  })
  const [adminItemsPagination, setAdminItemsPagination] = useState<ShowcasePaginationRuntimeState>({
    nextOffset: SHOWCASE_PAGE_SIZE.adminItems,
    hasMore: true,
    isLoadingMore: false
  })
  const [publicAnnouncementsPagination, setPublicAnnouncementsPagination] = useState<ShowcasePaginationRuntimeState>({
    nextOffset: SHOWCASE_PAGE_SIZE.publicAnnouncements,
    hasMore: true,
    isLoadingMore: false
  })
  const [adminAnnouncementsPagination, setAdminAnnouncementsPagination] = useState<ShowcasePaginationRuntimeState>({
    nextOffset: SHOWCASE_PAGE_SIZE.adminAnnouncements,
    hasMore: true,
    isLoadingMore: false
  })
  const [customerAppointmentsPagination, setCustomerAppointmentsPagination] = useState<ShowcasePaginationRuntimeState>({
    nextOffset: SHOWCASE_PAGE_SIZE.clientAppointments,
    hasMore: true,
    isLoadingMore: false
  })
  const [adminAppointmentsPagination, setAdminAppointmentsPagination] = useState<ShowcasePaginationRuntimeState>({
    nextOffset: SHOWCASE_PAGE_SIZE.merchantAppointments,
    hasMore: true,
    isLoadingMore: false
  })
  const [merchantChatListPagination, setMerchantChatListPagination] = useState<ShowcasePaginationRuntimeState>({
    nextOffset: SHOWCASE_PAGE_SIZE.chatThreads,
    hasMore: true,
    isLoadingMore: false
  })
  const [merchantChatListSearchQuery, setMerchantChatListSearchQuery] = useState('')
  const [merchantChatListSearchThreads, setMerchantChatListSearchThreads] = useState<ChatThreadSummary[]>([])
  const [merchantChatListSearchPagination, setMerchantChatListSearchPagination] = useState<ShowcasePaginationRuntimeState>({
    nextOffset: 0,
    hasMore: false,
    isLoadingMore: false
  })
  const [chatMessagesPagination, setChatMessagesPagination] = useState<ShowcasePaginationRuntimeState>({
    nextOffset: SHOWCASE_PAGE_SIZE.chatMessages,
    hasMore: true,
    isLoadingMore: false
  })
  const [chatMessageWindow, setChatMessageWindow] = useState<ChatMessageWindowRuntimeState>({
    mode: 'latest',
    anchorMessageId: null,
    hasOlder: true,
    hasNewer: false,
    isLoadingOlder: false,
    isLoadingNewer: false,
    oldestTimeMs: null,
    newestTimeMs: null
  })

  const chatMessagesPaginationRef = useRef(chatMessagesPagination)
  const chatMessageWindowRef = useRef(chatMessageWindow)

  const snackbarTimerRef = useRef<number | null>(null)
  const loadingSeqRef = useRef(0)
  const loadFromCloudRunningRef = useRef(false)
  const homeMainRefreshInFlightRef = useRef(false)
  const homeSearchDebounceTimerRef = useRef<number | null>(null)
  const homeSearchRequestSeqRef = useRef(0)
  const adminItemsSearchDebounceTimerRef = useRef<number | null>(null)
  const adminItemsSearchRequestSeqRef = useRef(0)
  const homeBadgeRefreshInFlightRef = useRef(false)
  const adminHomeRefreshInFlightRef = useRef(false)
  const adminItemsRefreshInFlightRef = useRef(false)
  const adminCategoriesRefreshInFlightRef = useRef(false)
  const announcementClickCountInFlightRef = useRef<Set<string>>(new Set())
  const lastMerchantSessionEnsureResultRef = useRef<'valid' | 'temporary_failed' | 'permission_failed' | 'expired' | null>(null)
  const detailBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Home)
  const appointmentDetailBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Home)
  const merchantChatListBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Admin)
  const changePasswordBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Admin)
  const storeProfileBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Home)
  const announcementsBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Home)
  const chatBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Home)
  const chatSearchBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Chat)
  const chatBackTargetBeforeSearchRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Chat)
  const chatSearchScopeRef = useRef<'InConversation' | 'InExistingThreads'>('InConversation')
  const chatMediaBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Chat)
  const chatModeRef = useRef<ChatMode>('Client')
  const hasLoadedInitialCloudRef = useRef(false)
  const isMountedRef = useRef(false)
  const chatPollingTimerRef = useRef<number | null>(null)
  const chatEntryPollingTimerRef = useRef<number | null>(null)
  const announcementsEntryPollingTimerRef = useRef<number | null>(null)
  const bookingsEntryPollingTimerRef = useRef<number | null>(null)
  const homeBadgePollingTimerRef = useRef<number | null>(null)
  const homeBadgePollingIntervalMsRef = useRef(0)
  const adminHomePollingTimerRef = useRef<number | null>(null)
  const adminHomePollingIntervalMsRef = useRef(0)
  const merchantChatListPollingTimerRef = useRef<number | null>(null)
  const merchantChatListPollingIntervalMsRef = useRef(0)
  const merchantChatListRefreshInFlightRef = useRef(false)
  const merchantChatListDbObserveAbortRef = useRef<AbortController | null>(null)
  const merchantChatListSearchDebounceTimerRef = useRef<number | null>(null)
  const merchantChatListSearchRequestSeqRef = useRef(0)
  const chatDbObserveAbortRef = useRef<AbortController | null>(null)
  const pushLocationSearchConsumedRef = useRef(false)
  const merchantPushRegistrationKeyRef = useRef('')
  const chatClientPushRegistrationKeyRef = useRef('')
  const pushRegistrationThrottleAtRef = useRef<Record<string, number>>({})
  const activeConversationIdRef = useRef(activeConversationId)
  const chatIsOpeningRef = useRef(false)
  const chatSyncInFlightRef = useRef(false)
  const chatMessageLoadSeqRef = useRef(0)
  const chatSearchLoadSeqRef = useRef(0)
  const chatMediaLoadSeqRef = useRef(0)
  const chatContextSnapshotRef = useRef<{
    conversationId: string
    previousScreen: ShowcaseScreenName
    isAdmin: boolean
    focusedMessageId: string | null
  } | null>(null)

  function setChatOpeningState(nextValue: boolean): void {
    chatIsOpeningRef.current = nextValue
    setChatIsOpening(nextValue)
  }

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId
    setRuntimeActiveConversationId(activeConversationId)
  }, [activeConversationId])

  useEffect(() => {
    chatMessagesPaginationRef.current = chatMessagesPagination
  }, [chatMessagesPagination])

  useEffect(() => {
    chatMessageWindowRef.current = chatMessageWindow
  }, [chatMessageWindow])

  useEffect(() => {
    const protectedMessageIds = chatMessages
      .map(message => message.id.trim())
      .filter(Boolean)

    if (!storeId.trim() || !protectedMessageIds.length) return

    void chatRepository.pruneLocalChatCache({
      storeId,
      protectedMessageIds
    })
  }, [chatMessages, storeId])

  const manualCategories = useMemo(() => {
    return cloudCategoriesToManualCategoryNames(categories)
  }, [categories])

  const homeListDishes = useMemo(() => {
    return dishesFromIds(homeDishIds)
  }, [dishEntitiesById, homeDishIds])

  const adminListDishes = useMemo(() => {
    return dishesFromIds(adminItemIds)
  }, [adminItemIds, dishEntitiesById])

  const allTags = useMemo(() => {
  const metadataTags = dishFilterRowsToTags(homeDishFilterRows)

  if (metadataTags.length) return metadataTags

  return allTagsFromDishes(homeListDishes)
}, [homeDishFilterRows, homeListDishes])

  const selectedDish = useMemo(() => {
    return getDishEntityById(selectedDishId)
  }, [dishEntitiesById, selectedDishId])

  const selectedEditDish = useMemo(() => {
    return getAdminEditableDishById(editDishId)
  }, [adminItemIds, dishEntitiesById, dishes, editDishId])

  const activeAppointmentDish = useMemo(() => {
    if (appointmentSourceDishId) {
      return getDishEntityById(appointmentSourceDishId)
    }

    return selectedDish || null
  }, [appointmentSourceDishId, dishEntitiesById, selectedDish])

  const visibleDishesForUi = useMemo(() => decorateCloudHomeResults({
    dishes: homeListDishes,
    favoriteIds,
    sortMode
  }), [
    homeListDishes,
    favoriteIds,
    sortMode
  ])
  const homeDishesForUi = useMemo(
    () => visibleDishesForUi.map(toShowcaseHomeDish),
    [visibleDishesForUi]
  )

  const cachedFallbackHomeDishesForUi = useMemo(() => {
    if (homeDishesForUi.length) {
      return []
    }

    const cachedDishes = loadDishesFromStorage(storeId)
      .filter(item => !item.isHidden)

    if (!cachedDishes.length) {
      return []
    }

    return decorateCloudHomeResults({
      dishes: cachedDishes,
      favoriteIds,
      sortMode
    }).map(toShowcaseHomeDish)
  }, [
    favoriteIds,
    homeDishesForUi.length,
    sortMode,
    storeId
  ])

  const effectiveHomeDishesForUi = homeDishesForUi.length
    ? homeDishesForUi
    : cachedFallbackHomeDishesForUi



  const adminVisibleDishes = useMemo(() => {
    return adminListDishes
  }, [
    adminListDishes
  ])

  useEffect(() => {
    const missingFavoriteDishIds = Array.from(
      new Set(
        favoriteIds
          .map(id => String(id || '').trim())
          .filter(Boolean)
          .filter(id => !dishEntitiesById[id])
      )
    )

    if (!missingFavoriteDishIds.length) return

    void repository.fetchDishesByIds(storeId, missingFavoriteDishIds).then(items => {
      if (!items.length) return

      mergeDishEntities(items)
    })
  }, [dishEntitiesById, favoriteIds, repository, storeId])

  const favoriteRows = useMemo(() => {
    return favoriteIds
      .map(id => {
        const dish = getDishEntityById(id)

        if (dish) {
          const snapshot = favoriteSnapshotFromDish(dish)
          const priceValue = getDishPrice(dish)

          return {
            dishId: id,
            title: snapshot.title,
            category: snapshot.category,
            originalPriceText: snapshot.originalPriceText,
            discountPriceText: snapshot.discountPriceText,
            priceText: snapshot.priceText,
            imageUrl: selectDishImageUrl(dish, 'list'),
            imageVariants: dish.imageVariants ?? snapshot.imageVariants ?? null,
            priceValue,
            isRecommended: Boolean(dish.isRecommended),
            isOnSale: hasDiscount(dish),
            itemAvailable: Boolean(!dish.isSoldOut && !dish.isHidden)
          }
        }

        const snapshot = favoriteSnapshots[id] || null
        if (!snapshot) return null

        const priceValue = favoritePriceValueFromText(
          snapshot.discountPriceText ||
          snapshot.priceText ||
          snapshot.originalPriceText
        )

        return {
          dishId: id,
          title: snapshot.title,
          category: snapshot.category,
          originalPriceText: snapshot.originalPriceText,
          discountPriceText: snapshot.discountPriceText,
          priceText: snapshot.priceText,
          imageUrl: snapshot.imageUrl,
          imageVariants: snapshot.imageVariants ?? createRemoteOnlyShowcaseImageVariants(snapshot.imageUrl),
          priceValue,
          isRecommended: false,
          isOnSale: Boolean(snapshot.discountPriceText),
          itemAvailable: true
        }
      })
      .filter((item): item is {
        dishId: string
        title: string
        category: string | null
        originalPriceText: string
        discountPriceText: string | null
        priceText: string
        imageUrl: string | null
        imageVariants: ShowcaseImageVariants | null
        priceValue: number
        isRecommended: boolean
        isOnSale: boolean
        itemAvailable: boolean
      } => Boolean(item))
  }, [dishEntitiesById, favoriteIds, favoriteSnapshots])

  const favoriteCategories = useMemo(() => {
    return Array.from(
      new Set(
        favoriteRows
          .map(item => item.category?.trim() || '')
          .filter(Boolean)
      )
    ).sort()
  }, [favoriteRows])

  const favoriteCards = useMemo<ShowcaseFavoriteCard[]>(() => {
    const validCategory = favoritesSelectedCategory &&
      favoriteCategories.includes(favoritesSelectedCategory)
      ? favoritesSelectedCategory
      : null

    let next = [...favoriteRows]

    if (validCategory) {
      next = next.filter(item => item.category === validCategory)
    }

    if (favoritesFilterRecommendedOnly) {
      next = next.filter(item => item.itemAvailable && item.isRecommended)
    }

    if (favoritesFilterOnSaleOnly) {
      next = next.filter(item => item.isOnSale)
    }

    const query = favoritesQuery.trim().toLowerCase()
    if (query) {
      next = next.filter(item => item.title.toLowerCase().includes(query))
    }

    if (favoritesAppliedMinPrice != null || favoritesAppliedMaxPrice != null) {
      next = next.filter(item => {
        return (favoritesAppliedMinPrice == null || item.priceValue >= favoritesAppliedMinPrice) &&
          (favoritesAppliedMaxPrice == null || item.priceValue <= favoritesAppliedMaxPrice)
      })
    }

    const sorted = (() => {
      if (favoritesSortMode === 'PriceAsc') {
        return [...next].sort((left, right) => left.priceValue - right.priceValue)
      }

      if (favoritesSortMode === 'PriceDesc') {
        return [...next].sort((left, right) => right.priceValue - left.priceValue)
      }

      return [...next].sort((left, right) => {
        return (favoriteAddedAt[right.dishId] || 0) - (favoriteAddedAt[left.dishId] || 0)
      })
    })()

    return sorted.map(item => ({
      dishId: item.dishId,
      title: item.title,
      category: item.category,
      originalPriceText: item.originalPriceText,
      discountPriceText: item.discountPriceText,
      priceText: item.priceText,
      imageUrl: item.imageUrl,
      isRecommended: item.isRecommended,
      isHidden: false,
      itemAvailable: item.itemAvailable
    }))
  }, [
    favoriteRows,
    favoriteCategories,
    favoritesSelectedCategory,
    favoritesFilterRecommendedOnly,
    favoritesFilterOnSaleOnly,
    favoritesQuery,
    favoritesAppliedMinPrice,
    favoritesAppliedMaxPrice,
    favoritesSortMode,
    favoriteAddedAt
  ])

  const appointmentDateOptions = useMemo(() => {
    return buildAppointmentDateOptions(appointmentSettings)
  }, [appointmentSettings])

  const appointmentTimeOptions = useMemo(() => {
    return customerAppointmentTimeOptionsForDate(appointmentSettings, appointmentDateDraft)
  }, [appointmentDateDraft, appointmentSettings])

  const appointmentCards = useMemo<ShowcaseAppointmentCard[]>(() => {
    return appointmentRequests.map(item => {
      const dish = getDishEntityById(item.sourceDishId)

      return appointmentToCard(item, dish)
    })
  }, [appointmentRequests, dishEntitiesById])

  const currentClientAppointmentIdSet = useMemo(() => {
    const currentClientId = clientId.trim()

    if (!currentClientId) return new Set<string>()

    return new Set(
      appointmentRequests
        .filter(item => item.clientId.trim() === currentClientId)
        .map(item => item.id.trim())
        .filter(Boolean)
    )
  }, [appointmentRequests, clientId])

  const customerAppointmentCards = useMemo<ShowcaseAppointmentCard[]>(() => {
    if (!currentClientAppointmentIdSet.size) return []

    return appointmentCards.filter(item => {
      return currentClientAppointmentIdSet.has(item.id.trim())
    })
  }, [appointmentCards, currentClientAppointmentIdSet])

  useEffect(() => {
    mergeDishEntities(dishes)
  }, [dishes])

  useEffect(() => {
    mergeDishEntities(Object.values(appointmentLinkedDishesById))
  }, [appointmentLinkedDishesById])

  useEffect(() => {
    void hydrateAppointmentLinkedDishesFromRequests(appointmentRequests)
  }, [appointmentLinkedDishesById, appointmentRequests, dishes, storeId])

  useEffect(() => {
    if (screen !== ShowcaseScreens.CustomerBookings) return
    if (!customerAppointmentCards.length) return

    const alertKeys = customerAppointmentCards
      .filter(item => isCustomerBookingAlertStatus(item.statusLabel))
      .map(item => appointmentStatusAlertKey(item.id, item.statusLabel))
      .filter(Boolean)

    if (!alertKeys.length) return

    const seenKeys = loadSeenAppointmentStatusAlertKeys(storeId, clientId)
    saveSeenAppointmentStatusAlertKeys(storeId, clientId, [...seenKeys, ...alertKeys])
    setBookingsEntryDotVisible(false)
  }, [screen, customerAppointmentCards, storeId, clientId])

  const announcementCards = useMemo<ShowcaseAnnouncementCard[]>(() => {
    return announcements.map(cloudAnnouncementToCard)
  }, [announcements])

  const adminAnnouncementCards = useMemo<ShowcaseAnnouncementCard[]>(() => {
    return getAdminDraftCardsForUi()
  }, [adminAnnouncementDraftItems])

  const activeChatProductMap = useMemo(() => {
    const map = new Map<string, ShowcaseChatProductShare>()

    Object.values(dishEntitiesById).forEach(dish => {
      map.set(dish.id, buildChatProductShareFromDish(dish))
    })

    return map
  }, [dishEntitiesById])

  useEffect(() => {
    const missingDishIds = Array.from(
      new Set(
        chatMessages
          .map(message => String(message.productDishId || '').trim())
          .filter(Boolean)
          .filter(dishId => !dishEntitiesById[dishId])
      )
    )

    if (!missingDishIds.length) return

    void repository.fetchDishesByIds(storeId, missingDishIds).then(items => {
      mergeDishEntities(items)
    })
  }, [chatMessages, dishEntitiesById, repository, storeId])

  const chatUiMessages = useMemo<ShowcaseChatMessage[]>(() => {
    const currentRole = chatMode === 'Merchant' ? 'merchant' : 'user'

    return chatMessages.map(message => {
      const product = message.productDishId ? activeChatProductMap.get(message.productDishId) || null : null
      const ui = chatMessageToUiMessage(message, currentRole, product)

      return {
        ...ui,
        selected: chatSelectedMessageIds.includes(message.id)
      }
    })
  }, [activeChatProductMap, chatMessages, chatSelectedMessageIds, chatMode])

  useEffect(() => {
    const query = chatFindQuery.trim()
    if (!query) {
      if (chatFindResultIds.length) {
        setChatFindResultIds([])
      }

      if (chatFocusedMessageId) {
        setChatFocusedMessageId(null)
      }

      return
    }

    const domainState = onFindQueryChangeInDomain(buildCurrentChatDomainState(), chatFindQuery)
    setChatFindResultIds(domainState.findMatchIds)
    setChatFocusedMessageId(domainState.findFocusedId || domainState.scrollToMessageId || null)
  }, [chatFindQuery, chatUiMessages])

  const merchantChatListSearchActive = merchantChatListSearchQuery.trim().length > 0
  const merchantThreadSummaries = useMemo(() => {
    const sourceThreads = merchantChatListSearchActive
      ? merchantChatListSearchThreads
      : merchantChatThreads

    return sourceThreads.map(chatThreadSummaryToUi)
  }, [merchantChatListSearchActive, merchantChatListSearchThreads, merchantChatThreads])

  useEffect(() => {
    const normalizedQuery = merchantChatListSearchQuery.trim()
    merchantChatListSearchRequestSeqRef.current += 1
    const requestSeq = merchantChatListSearchRequestSeqRef.current

    if (merchantChatListSearchDebounceTimerRef.current != null && isBrowser()) {
      window.clearTimeout(merchantChatListSearchDebounceTimerRef.current)
      merchantChatListSearchDebounceTimerRef.current = null
    }

    if (!normalizedQuery) {
      setMerchantChatListSearchThreads([])
      setMerchantChatListSearchPagination({
        nextOffset: 0,
        hasMore: false,
        isLoadingMore: false
      })
      return
    }

    if (!isBrowser()) return

    setMerchantChatListSearchPagination({
      nextOffset: 0,
      hasMore: false,
      isLoadingMore: true
    })

    merchantChatListSearchDebounceTimerRef.current = window.setTimeout(() => {
      void refreshMerchantChatListSearch(normalizedQuery, requestSeq)
    }, 350)

    return () => {
      if (merchantChatListSearchDebounceTimerRef.current != null && isBrowser()) {
        window.clearTimeout(merchantChatListSearchDebounceTimerRef.current)
        merchantChatListSearchDebounceTimerRef.current = null
      }
    }
  }, [merchantChatListSearchQuery, storeId])

  const appointmentServiceOptions = useMemo(() => {
    return ['All', ...manualCategories]
  }, [manualCategories])

  const selectedDishImages = resolveDishImages(selectedDish)
  const safeDetailImageIndex = clampIndex(detailImageIndex, selectedDishImages.length)
  const selectedDishOriginalPrice = selectedDish ? normalizeNumber(selectedDish.originalPrice, 0) : 0
  const selectedDishDiscount = selectedDish ? normalizeNumber(selectedDish.discountPrice, 0) : 0
  const selectedDishHasDiscount = selectedDishDiscount > 0 && selectedDishOriginalPrice > 0 && selectedDishDiscount < selectedDishOriginalPrice

  const bottomNavigationActions: ShowcaseBottomNavigationActions = {
    onOpenStoreProfileView: openStoreProfileView,
    onOpenChat: openChatFromBottomBar,
    onOpenCustomerBookings: openCustomerBookings,
    onOpenAnnouncements: openAnnouncementsFromBottomBar,
    onOpenFavorites: openFavorites
  }

  function showSnackbar(message: string): void {
    setSnackbarMessage(message)

    if (!isBrowser()) return

    if (snackbarTimerRef.current != null) {
      window.clearTimeout(snackbarTimerRef.current)
    }

    snackbarTimerRef.current = window.setTimeout(() => {
      setSnackbarMessage(null)
      snackbarTimerRef.current = null
    }, 3000)
  }

  function guardOfflineWriteOperation(
    message = 'You are offline. Please reconnect and try again.'
  ): boolean {
    if (!isOffline) {
      return false
    }

    setStatusMessage(message)
    showSnackbar(message)
    return true
  }

  useEffect(() => {
    if (!isBrowser()) return

    const syncOfflineState = (): void => {
      setIsOffline(window.navigator.onLine === false)
    }

    const handleOffline = (): void => {
      setIsOffline(true)
    }

    const handleOnline = (): void => {
      setIsOffline(false)
      showSnackbar('Back online. You can continue.')
    }

    syncOfflineState()

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  function pageStateForUi(pageState: { hasMore: boolean; isLoadingMore: boolean }): { hasMore: boolean; isLoadingMore: boolean } {
    return {
      hasMore: pageState.hasMore,
      isLoadingMore: pageState.isLoadingMore
    }
  }

  function mergeUniqueById<T extends { id: string }>(currentItems: T[], nextItems: T[]): T[] {
    const merged = new Map<string, T>()

    currentItems.forEach(item => {
      const id = item.id.trim()
      if (id) merged.set(id, item)
    })

    nextItems.forEach(item => {
      const id = item.id.trim()
      if (id) merged.set(id, item)
    })

    return Array.from(merged.values())
  }

  function sortChatMessagesByCreatedAtAsc<T extends { createdAt?: number | null; id: string }>(items: T[]): T[] {
    return items.slice().sort((left, right) => {
      const leftTime = Number(left.createdAt || 0)
      const rightTime = Number(right.createdAt || 0)

      if (leftTime !== rightTime) return leftTime - rightTime

      return left.id.localeCompare(right.id)
    })
  }

  function limitChatMessagesForActiveWindow(
    messages: ChatMessage[],
    activeWindow: ChatMessageWindowRuntimeState
  ): ChatMessage[] {
    const sortedMessages = sortChatMessagesByCreatedAtAsc(messages)
    const limit = activeWindow.mode === 'aroundMessage'
      ? CHAT_AROUND_MESSAGE_WINDOW_MAX_MESSAGES
      : CHAT_LATEST_WINDOW_MAX_MESSAGES

    if (sortedMessages.length <= limit) return sortedMessages

    if (activeWindow.mode === 'aroundMessage' && activeWindow.anchorMessageId) {
      const anchorIndex = sortedMessages.findIndex(message => message.id === activeWindow.anchorMessageId)

      if (anchorIndex >= 0) {
        const halfWindow = Math.floor(limit / 2)
        const start = Math.max(0, Math.min(anchorIndex - halfWindow, sortedMessages.length - limit))
        const end = Math.min(sortedMessages.length, start + limit)

        return sortedMessages.slice(start, end)
      }
    }

    return sortedMessages.slice(-limit)
  }

  function mergeChatMessagesForConversation(
    currentMessages: ChatMessage[],
    conversationIdInput: string,
    nextMessages: ChatMessage[]
  ): ChatMessage[] {
    const conversationId = String(conversationIdInput || '').trim()
    const activeWindow = chatMessageWindowRef.current

    if (!conversationId) {
      return limitChatMessagesForActiveWindow(
        mergeUniqueById(currentMessages, nextMessages),
        activeWindow
      )
    }

    const currentConversationMessages = currentMessages.filter(message => message.conversationId === conversationId)

    return limitChatMessagesForActiveWindow(
      mergeUniqueById(currentConversationMessages, nextMessages),
      activeWindow
    )
  }

  async function mergeLatestLocalChatMessages(conversationIdInput: string): Promise<void> {
    const conversationId = String(conversationIdInput || '').trim()

    if (!conversationId) return

    const latestLocalMessages = await chatRepository.listLocal(storeId, conversationId)
    const latestMessages = latestLocalMessages.map(chatEntityToCloudMessage)

    setChatMessages(current => mergeChatMessagesForConversation(
      current,
      conversationId,
      latestMessages
    ))
  }

  function triggerChatScrollToBottomForOwnSend(): void {
    setChatScrollToBottomSignal(Date.now())
  }

  async function applyLocalChatMessagesFirst(conversationIdInput: string): Promise<boolean> {
    const conversationId = String(conversationIdInput || '').trim()

    if (!conversationId) return false

    const localMessages = await chatRepository.listLocal(
      storeId,
      conversationId,
      SHOWCASE_PAGE_SIZE.chatMessages,
      0
    )

    if (!localMessages.length) return false

    const messages = limitChatMessagesForActiveWindow(
      localMessages.map(chatEntityToCloudMessage),
      {
        mode: 'latest',
        anchorMessageId: null,
        hasOlder: localMessages.length >= SHOWCASE_PAGE_SIZE.chatMessages,
        hasNewer: false,
        isLoadingOlder: false,
        isLoadingNewer: false,
        oldestTimeMs: null,
        newestTimeMs: null
      }
    )
    const bounds = getChatMessageWindowBounds(messages)

    const nextWindow: ChatMessageWindowRuntimeState = {
      mode: 'latest',
      anchorMessageId: null,
      hasOlder: localMessages.length >= SHOWCASE_PAGE_SIZE.chatMessages,
      hasNewer: false,
      isLoadingOlder: false,
      isLoadingNewer: false,
      oldestTimeMs: bounds.oldestTimeMs,
      newestTimeMs: bounds.newestTimeMs
    }

    const nextPaginationState = {
      nextOffset: localMessages.length,
      hasMore: localMessages.length >= SHOWCASE_PAGE_SIZE.chatMessages,
      isLoadingMore: false
    }

    chatMessageWindowRef.current = nextWindow
    chatMessagesPaginationRef.current = nextPaginationState

    setChatMessages(messages)
    setChatMessageWindow(nextWindow)
    setChatMessagesPagination(nextPaginationState)

    const mediaItems = messages.flatMap(message => message.imageUrls
      .map(url => url.trim())
      .filter(Boolean)
      .map(url => ({
        conversationId,
        messageId: message.id,
        url,
        createdAtText: formatChatCreatedAtText(message.createdAt),
        createdAtMs: Number(message.createdAt || 0)
      }))
    )

    setChatMediaItems(mediaItems)

    return true
  }

  function sortedDishesForStorage(items: DemoDish[]): DemoDish[] {
    return items.slice().sort((left, right) => {
      return (right.updatedAt || 0) - (left.updatedAt || 0) || getDishTitle(left).localeCompare(getDishTitle(right))
    })
  }

  function sortedAppointmentsForStorage(items: CloudAppointmentRequest[]): CloudAppointmentRequest[] {
    return items.slice().sort((left, right) => {
      return (right.createdAt || 0) - (left.createdAt || 0)
    })
  }

  function sortedAnnouncementsForStorage(items: CloudAnnouncement[]): CloudAnnouncement[] {
    return items.slice().sort((left, right) => {
      return (right.updatedAt || right.createdAt || 0) - (left.updatedAt || left.createdAt || 0)
    })
  }

  function mergeDishEntities(itemsInput: DemoDish[]): void {
    const items = itemsInput.filter(item => String(item.id || '').trim())

    if (!items.length) return

    setDishEntitiesById(current => {
      let changed = false
      const next = {
        ...current
      }

      items.forEach(item => {
        const id = String(item.id || '').trim()

        if (!id) return

        if (next[id] !== item) {
          next[id] = item
          changed = true
        }
      })

      return changed ? next : current
    })
  }

  function getDishEntityById(dishIdInput: string | null | undefined): DemoDish | null {
    const dishId = String(dishIdInput || '').trim()

    if (!dishId) return null

    return dishEntitiesById[dishId] || null
  }

  async function ensureDishEntityLoaded(dishIdInput: string | null | undefined): Promise<DemoDish | null> {
    const dishId = String(dishIdInput || '').trim()

    if (!dishId) return null

    const cachedDish = getDishEntityById(dishId)

    if (cachedDish) return cachedDish

    const items = await repository.fetchDishesByIds(storeId, [dishId])
    const dish = items[0] || null

    if (dish) {
      mergeDishEntities([dish])
    }

    return dish
  }

  function dishIdsFromItems(itemsInput: DemoDish[]): string[] {
    return itemsInput
      .map(item => String(item.id || '').trim())
      .filter(Boolean)
  }

  function mergeDishIds(currentIds: string[], itemsInput: DemoDish[]): string[] {
    const next = [...currentIds]
    const existing = new Set(next)

    itemsInput.forEach(item => {
      const id = String(item.id || '').trim()

      if (!id || existing.has(id)) return

      existing.add(id)
      next.push(id)
    })

    return next
  }

  function removeDishIdFromList(currentIds: string[], dishIdInput: string | null | undefined): string[] {
    const dishId = String(dishIdInput || '').trim()

    if (!dishId) return currentIds

    return currentIds.filter(id => id !== dishId)
  }

  function removeDishEntityById(dishIdInput: string | null | undefined): void {
    const dishId = String(dishIdInput || '').trim()

    if (!dishId) return

    setDishEntitiesById(current => {
      if (!current[dishId]) return current

      const next = {
        ...current
      }

      delete next[dishId]

      return next
    })
  }

  function isDishInAdminManagementContext(dishIdInput: string | null | undefined): boolean {
    const dishId = String(dishIdInput || '').trim()

    if (!dishId) return false

    if (adminItemIds.includes(dishId)) return true

    return dishes.some(item => item.id === dishId)
  }

  function getAdminEditableDishById(dishIdInput: string | null | undefined): DemoDish | null {
    const dishId = String(dishIdInput || '').trim()

    if (!dishId) return null

    if (!isDishInAdminManagementContext(dishId)) return null

    return getDishEntityById(dishId) || null
  }

  function dishesFromIds(idsInput: string[]): DemoDish[] {
    const ids = idsInput
      .map(id => String(id || '').trim())
      .filter(Boolean)

    if (!ids.length) return []

    return ids
      .map(id => getDishEntityById(id))
      .filter((item): item is DemoDish => Boolean(item))
  }

  async function hydrateAppointmentLinkedDishesFromRequests(
    requestsInput: CloudAppointmentRequest[]
  ): Promise<void> {
    const ids = Array.from(
      new Set(
        requestsInput
          .map(item => String(item.sourceDishId || '').trim())
          .filter(Boolean)
      )
    )

    if (!ids.length) return

    const loadedDishIds = new Set([
      ...dishes.map(item => item.id),
      ...Object.keys(appointmentLinkedDishesById)
    ])

    const missingIds = ids.filter(id => !loadedDishIds.has(id))

    if (!missingIds.length) return

    const fetchedItems = await repository.fetchDishesByIds(storeId, missingIds)

    if (!fetchedItems.length) return

    mergeDishEntities(fetchedItems)

    setAppointmentLinkedDishesById(current => {
      const next = {
        ...current
      }

      fetchedItems.forEach(item => {
        if (item.id) {
          next[item.id] = item
        }
      })

      return next
    })
  }

  function currentHomeDishCloudFilters(input: Partial<DishCloudQueryFilters> = {}): DishCloudQueryFilters {
    return {
      categoryName: input.categoryName === undefined ? selectedCategory : input.categoryName,
      searchQuery: input.searchQuery === undefined ? searchQuery : input.searchQuery,
      selectedTags: input.selectedTags === undefined ? selectedTags : input.selectedTags,
      recommendedOnly: input.recommendedOnly === undefined ? filterRecommendedOnly : input.recommendedOnly,
      onSaleOnly: input.onSaleOnly === undefined ? filterOnSaleOnly : input.onSaleOnly,
      minPrice: input.minPrice === undefined ? homeAppliedMinPrice : input.minPrice,
      maxPrice: input.maxPrice === undefined ? homeAppliedMaxPrice : input.maxPrice,
      includeHidden: false,
      hiddenOnly: false,
      sortMode: input.sortMode === undefined ? sortMode : input.sortMode
    }
  }

  function currentAdminItemsCloudFilters(input: Partial<DishCloudQueryFilters> = {}): DishCloudQueryFilters {
    return {
      categoryName: input.categoryName === undefined ? adminItemsSelectedCategory : input.categoryName,
      searchQuery: input.searchQuery === undefined ? adminItemsSearchQuery : input.searchQuery,
      selectedTags: [],
      recommendedOnly: input.recommendedOnly === undefined ? adminItemsFilterRecommended : input.recommendedOnly,
      onSaleOnly: input.onSaleOnly === undefined ? adminItemsFilterDiscountOnly : input.onSaleOnly,
      minPrice: input.minPrice === undefined ? adminItemsAppliedMinPrice : input.minPrice,
      maxPrice: input.maxPrice === undefined ? adminItemsAppliedMaxPrice : input.maxPrice,
      includeHidden: true,
      hiddenOnly: input.hiddenOnly === undefined ? adminItemsFilterHiddenOnly : input.hiddenOnly,
      sortMode: input.sortMode === undefined ? adminItemsSortMode : input.sortMode
    }
  }

  function resetHomePaginationForFirstPage(itemsLength: number): void {
    setHomePagination({
      nextOffset: itemsLength,
      hasMore: itemsLength >= SHOWCASE_PAGE_SIZE.homeDishes,
      isLoadingMore: false
    })
  }

  function resetAdminItemsPaginationForFirstPage(itemsLength: number): void {
    setAdminItemsPagination({
      nextOffset: itemsLength,
      hasMore: itemsLength >= SHOWCASE_PAGE_SIZE.adminItems,
      isLoadingMore: false
    })
  }

  async function fetchHomeDishesFilteredPage(
    filters: DishCloudQueryFilters,
    offset: number
  ): Promise<DemoDish[]> {
    const items = await repository.fetchDishesFilteredPage({
      storeId,
      categoryName: filters.categoryName,
      searchQuery: filters.searchQuery,
      selectedTags: filters.selectedTags,
      recommendedOnly: filters.recommendedOnly,
      onSaleOnly: filters.onSaleOnly,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      includeHidden: false,
      hiddenOnly: false,
      sortMode: filters.sortMode,
      limit: SHOWCASE_PAGE_SIZE.homeDishes,
      offset
    })

    mergeDishEntities(items)

    return items
  }

  async function fetchAdminItemsFilteredPage(
    filters: DishCloudQueryFilters,
    offset: number
  ): Promise<DemoDish[]> {
    const items = await repository.fetchDishesFilteredPage({
      storeId,
      categoryName: filters.categoryName,
      searchQuery: filters.searchQuery,
      selectedTags: filters.selectedTags,
      recommendedOnly: filters.recommendedOnly,
      onSaleOnly: filters.onSaleOnly,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      includeHidden: true,
      hiddenOnly: filters.hiddenOnly,
      sortMode: filters.sortMode,
      limit: SHOWCASE_PAGE_SIZE.adminItems,
      offset
    })

    mergeDishEntities(items)

    return items
  }

  async function refreshHomeDishesFilteredFirstPage(
    filtersInput: DishCloudQueryFilters = currentHomeDishCloudFilters(),
    requestSeq?: number
  ): Promise<void> {
    try {
      const cloudLoadStartedAt = Date.now()
      const localDishes = loadDishesFromStorage(storeId)
      const localVisibleDishes = localDishes.filter(item => !item.isHidden)

      const filterRows = await repository.fetchDishFilterRows({
        storeId,
        includeHidden: false,
        hiddenOnly: false
      })

      if (requestSeq != null && requestSeq !== homeSearchRequestSeqRef.current) return

      if (filterRows.length) {
        setHomeDishFilterRows(filterRows)
      }

      const items = await fetchHomeDishesFilteredPage(filtersInput, 0)

      if (requestSeq != null && requestSeq !== homeSearchRequestSeqRef.current) return

      const browserOffline = isBrowserOfflineNow()
      const cloudReadFailed = repository.lastReadFailureAt >= cloudLoadStartedAt
      const cloudUnavailable = browserOffline || cloudReadFailed
      const shouldUseLocalDishCache = cloudUnavailable && !items.length && localVisibleDishes.length > 0
      const sourceItems = shouldUseLocalDishCache ? localVisibleDishes : items
      const merged = sortedDishesForStorage(sourceItems)

      mergeDishEntities(merged)
      setHomeDishIds(dishIdsFromItems(merged))
      setDishes(merged)
      refreshFavoritesList(merged)
      setPendingSyncOperations(buildPendingDishSyncOperations(merged))
      resetHomePaginationForFirstPage(sourceItems.length)
      setStatusMessage(
        shouldUseLocalDishCache
          ? 'Cloud unavailable, loaded from local cache.'
          : items.length
            ? 'Loaded from cloud.'
            : 'No data.'
      )
    } catch (error) {
      if (requestSeq != null && requestSeq !== homeSearchRequestSeqRef.current) return

      const localDishes = loadDishesFromStorage(storeId)
      const localVisibleDishes = localDishes.filter(item => !item.isHidden)

      if (localVisibleDishes.length) {
        const merged = sortedDishesForStorage(localVisibleDishes)

        mergeDishEntities(merged)
        setHomeDishIds(dishIdsFromItems(merged))
        setDishes(merged)
        refreshFavoritesList(merged)
        setPendingSyncOperations(buildPendingDishSyncOperations(merged))
        resetHomePaginationForFirstPage(localVisibleDishes.length)
        setStatusMessage('Cloud unavailable, loaded from local cache.')
        return
      }

      setHomePagination(current => ({
        nextOffset: current.nextOffset,
        hasMore: current.hasMore,
        isLoadingMore: false
      }))
      setStatusMessage(error instanceof Error ? error.message : 'Failed to refresh items.')
    }
  }

  async function refreshAdminItemsFilteredFirstPage(
    filtersInput: DishCloudQueryFilters = currentAdminItemsCloudFilters(),
    requestSeq?: number
  ): Promise<void> {
    try {
      const cloudLoadStartedAt = Date.now()
      const localDishes = loadDishesFromStorage(storeId)

      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        if (localDishes.length) {
          const merged = sortedDishesForStorage(localDishes)

          setAdminItemIds(dishIdsFromItems(merged))
          setDishes(merged)
          refreshFavoritesList(merged)
          setPendingSyncOperations(buildPendingDishSyncOperations(merged))
          resetAdminItemsPaginationForFirstPage(localDishes.length)
          setStatusMessage('Cloud unavailable, loaded from local cache.')
          return
        }

        setStatusMessage(merchantSessionEnsureFailureMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const items = await fetchAdminItemsFilteredPage(filtersInput, 0)

      if (requestSeq != null && requestSeq !== adminItemsSearchRequestSeqRef.current) return

      const browserOffline = isBrowserOfflineNow()
      const cloudReadFailed = repository.lastReadFailureAt >= cloudLoadStartedAt
      const cloudUnavailable = browserOffline || cloudReadFailed
      const shouldUseLocalDishCache = cloudUnavailable && !items.length && localDishes.length > 0
      const sourceItems = shouldUseLocalDishCache ? localDishes : items
      const merged = sortedDishesForStorage(sourceItems)

      setAdminItemIds(dishIdsFromItems(merged))
      setDishes(merged)
      refreshFavoritesList(merged)
      setPendingSyncOperations(buildPendingDishSyncOperations(merged))
      resetAdminItemsPaginationForFirstPage(sourceItems.length)
      setStatusMessage(
        shouldUseLocalDishCache
          ? 'Cloud unavailable, loaded from local cache.'
          : items.length
            ? 'Loaded from cloud.'
            : 'No data.'
      )
    } catch (error) {
      if (requestSeq != null && requestSeq !== adminItemsSearchRequestSeqRef.current) return

      const localDishes = loadDishesFromStorage(storeId)

      if (localDishes.length) {
        const merged = sortedDishesForStorage(localDishes)

        setAdminItemIds(dishIdsFromItems(merged))
        setDishes(merged)
        refreshFavoritesList(merged)
        setPendingSyncOperations(buildPendingDishSyncOperations(merged))
        resetAdminItemsPaginationForFirstPage(localDishes.length)
        setStatusMessage('Cloud unavailable, loaded from local cache.')
        return
      }

      setAdminItemsPagination(current => ({
        nextOffset: current.nextOffset,
        hasMore: current.hasMore,
        isLoadingMore: false
      }))
      setStatusMessage(error instanceof Error ? error.message : 'Failed to refresh items.')
    }
  }

  function pushPendingSync(op: PendingSyncOperation): void {
    setPendingSyncOperations(current => {
      if (current.some(item => item.id === op.id)) return current
      return [...current, op]
    })
    setSyncOverviewState(SyncOverviewStates.HasPending)
    setLastRetryOp(ShowcaseRetryOps.RetryPendingSync)
  }

  function removePendingSync(id: string): void {
    setPendingSyncOperations(current => {
      const next = current.filter(item => item.id !== id)
      if (!next.length) {
        setSyncOverviewState(SyncOverviewStates.Idle)
      }
      return next
    })
  }

  useEffect(() => {
    pendingSyncOperationsRef.current = pendingSyncOperations
  }, [pendingSyncOperations])

  function setMerchantSessionAndPersist(session: MerchantAuthSession | null, remember = loginRememberMeDraft): void {
    setStoreMerchantSessionFromAuthSession(session)
    bindMerchantSessionToRepository(repository)
    setMerchantSession(session)
    setIsAdminLoggedIn(isMerchantLoggedInInStoreSession())
    persistMerchantSession(session, remember)
  }

  function applyRefreshedMerchantSession(session: MerchantAuthSession): void {
    setMerchantSessionAndPersist(session, readRememberMe())
    setSyncErrorMessage(null)
    setLoginError(null)
  }

  function getPreferredLoginNameForLoginScreen(): string {
    const runtimeLoginName = String(loginUsernameDraft || '').trim()
    if (runtimeLoginName) return runtimeLoginName

    const adminLoginName = String(adminUsernameDraft || '').trim()
    if (adminLoginName) return adminLoginName

    const sessionLoginName = String(merchantSession?.loginName || '').trim()
    if (sessionLoginName) return sessionLoginName

    const initialLoginName = String(initialMerchantLoginNameRef.current || '').trim()
    if (initialLoginName) return initialLoginName

    return ''
  }

  function prepareLoginScreen(message: string | null = null): void {
    const preservedLoginName = getPreferredLoginNameForLoginScreen()

    setLoginUsernameDraft(preservedLoginName)
    setAdminUsernameDraft(preservedLoginName)
    setLoginPasswordDraft('')
    setAdminPasswordDraft('')
    setLoginError(message)
    setIsLoginLoading(false)
  }

  function resetLoginDrafts(): void {
    prepareLoginScreen(null)
  }

  function resetEditDishForm(): void {
    const draft = loadItemEditorDraftLocally(storeId, 'new')

    setEditDishId(null)
    setEditDishName(normalizeText(draft?.name))
    setEditDishDescription(normalizeText(draft?.description))
    setEditDishCategory(normalizeNullableText(draft?.category))
    setEditDishOriginalPrice(draft?.price || '')
    setEditDishDiscountPrice(draft?.discountPrice || '')
    setEditDishRecommended(false)
    setEditDishHidden(false)
    setEditDishImageUrls([])
    setEditValidationError(null)
    setIsSavingEditDish(false)
    setIsBlockingEditDish(false)
  }

  function fillEditDishForm(dish: DemoDish): void {
    const cached = loadItemEditorDraftLocally(storeId, 'edit')
    const useCachedForEdit = Boolean(cached && cached.editingId === dish.id)

    setEditDishId(dish.id)
    setEditDishName(useCachedForEdit ? cached?.name || '' : dish.name || dish.title || '')
    setEditDishDescription(useCachedForEdit ? cached?.description || '' : dish.description || '')
    setEditDishCategory(useCachedForEdit ? cached?.category || null : dish.category || null)
    setEditDishOriginalPrice(useCachedForEdit ? cached?.price || '' : formatPlainNumber(dish.originalPrice))
    setEditDishDiscountPrice(useCachedForEdit ? cached?.discountPrice || '' : dish.discountPrice ? formatPlainNumber(dish.discountPrice) : '')
    setEditDishRecommended(Boolean(dish.isRecommended))
    setEditDishHidden(Boolean(dish.isHidden))
    setEditDishImageUrls(resolveDishImages(dish))
    setEditValidationError(null)
    setIsSavingEditDish(false)
    setIsBlockingEditDish(false)
  }

  function persistCurrentItemEditorDraftLocally(): void {
    persistItemEditorDraftLocally(storeId, {
      editingId: editDishId?.trim() || null,
      isNew: !editDishId,
      name: editDishName.trim(),
      price: editDishOriginalPrice.trim(),
      discountPrice: editDishDiscountPrice.trim(),
      description: editDishDescription.trim(),
      category: editDishCategory?.trim() || null
    })
  }

  function clearCurrentItemEditorDraftLocally(): void {
    clearItemEditorDraftLocally(storeId)
    clearEditDraftLocalImages(storeId)
  }

  function openDetail(dishId: string): void {
    const id = dishId.trim()

    if (!id) return

    const openResolvedDetail = (dish: DemoDish): void => {
      detailBackTargetRef.current = screen

      const clickedDish = {
        ...dish,
        clickCount: Math.max(0, Number(dish.clickCount || 0) + 1)
      }

      setDishes(current => current.map(item => {
        if (item.id !== id) return item

        return {
          ...item,
          clickCount: Math.max(0, Number(item.clickCount || 0) + 1)
        }
      }))

      mergeDishEntities([clickedDish])
      void repository.incrementDishClickCount(storeId, id)

      setSelectedDishId(id)
      setDetailImageIndex(0)
      setStatusMessage(null)
      setPreviousScreen(screen)
      setScreen('Detail')
    }

    const cachedDish = getDishEntityById(id)

    if (cachedDish) {
      openResolvedDetail(cachedDish)
      return
    }

    void ensureDishEntityLoaded(id).then(dish => {
      if (!dish) {
        setStatusMessage('Item is no longer available.')
        return
      }

      openResolvedDetail(dish)
    })
  }

  function backToHome(): void {
    if (
      screen === ShowcaseScreens.Chat ||
      screen === ShowcaseScreens.ChatSearchResults ||
      screen === ShowcaseScreens.ChatMedia
    ) {
      stopChatPolling()
      stopChatDbObserve()

      const selectedCleared = exitSelectionInDomain(buildCurrentChatDomainState())
      const findCleared = closeFindInDomain(selectedCleared)
      const jumpCleared = clearJumpOnExit(findCleared)

      applyChatDomainInteractionState(jumpCleared)
      setChatSearchResults([])
      setChatMediaPreviewUrls([])
      setChatMediaPreviewIndex(0)

      void refreshChatEntryDotOnce()
    }

    snapshotCurrentChatContext()
    void restoreClientChatContext()

    setFocusedAnnouncementId(null)
    setLoginError(null)
    setPreviousScreen(screen)
    setScreen(ShowcaseScreens.Home)
  }

  function closeToHome(): void {
    backToHome()
  }

  function goBack(defaultTarget: ShowcaseScreenName = 'Home'): void {
    setScreen(previousScreen || defaultTarget)
  }

  function backFromDetail(): void {
    const target = detailBackTargetRef.current || ShowcaseScreens.Home

    setSelectedDishId(null)
    setDetailImageIndex(0)
    setPreviousScreen(ShowcaseScreens.Home)
    setStatusMessage('Back from detail pressed')
    setScreen(target)
  }

  function backFromChat(): void {
    const selectedCleared = exitSelectionInDomain(buildCurrentChatDomainState())
    const findCleared = closeFindInDomain(selectedCleared)
    const jumpCleared = clearJumpOnExit(findCleared)
    const target = chatBackTargetRef.current || ShowcaseScreens.Home
    const isReturningToChatSearchResults = target === ShowcaseScreens.ChatSearchResults

    stopChatPolling()
    stopChatDbObserve()

    markRuntimeConversationRecentlySeen(activeConversationId)
    setRuntimeChatVisible(false)
    postChatVisibilityToServiceWorker({
      visible: false,
      conversationId: activeConversationId,
      screen,
      clientId,
      chatRole: currentChatRole()
    })
    applyChatDomainInteractionState(jumpCleared)

    if (!isReturningToChatSearchResults) {
      setChatSearchResults([])
    }

    setChatMediaPreviewUrls([])
    setChatMediaPreviewIndex(0)

    if (isReturningToChatSearchResults) {
      setPreviousScreen(chatBackTargetBeforeSearchRef.current || ShowcaseScreens.MerchantChatList)
      setScreen(ShowcaseScreens.ChatSearchResults)
      return
    }

    snapshotCurrentChatContext()

    if (target === ShowcaseScreens.MerchantChatList) {
      void restoreMerchantChatContext(activeConversationId)
    } else {
      void restoreClientChatContext()
      void refreshChatEntryDotOnce()
    }

    setScreen(target)
  }

  function backFromAnnouncements(): void {
    setFocusedAnnouncementId(null)
    setScreen(announcementsBackTargetRef.current || ShowcaseScreens.Home)
  }

function backFromAppointments(): void {
  const sourceDish = getDishEntityById(appointmentSourceDishId)

  setAppointmentError(null)
  setAppointmentSuccess(null)

  if (sourceDish) {
    detailBackTargetRef.current = appointmentDetailBackTargetRef.current || ShowcaseScreens.Home
    setSelectedDishId(sourceDish.id)
    setDetailImageIndex(0)
    setPreviousScreen(detailBackTargetRef.current)
    setScreen(ShowcaseScreens.Detail)
    return
  }

  setSelectedDishId(null)
  setDetailImageIndex(0)
  setPreviousScreen(ShowcaseScreens.Home)
  setScreen(ShowcaseScreens.Home)
}

  function backFromCustomerBookings(): void {
    setScreen(ShowcaseScreens.Home)
  }

  function backFromMerchantChatList(): void {
    stopMerchantChatListDbObserve()
    stopMerchantChatListPolling()
    setScreen(merchantChatListBackTargetRef.current)
  }

  function closeMerchantChatListToHome(): void {
    stopMerchantChatListDbObserve()
    stopMerchantChatListPolling()
    closeToHome()
  }

  function backFromStoreProfile(): void {
    clearStoreProfileDraftLocalImages(storeId)
    setStoreProfileDraft(null)
    setIsEditingStoreProfile(false)
    setIsSavingStoreProfile(false)
    setStoreProfileSaveError(null)
    setStoreProfileSaveSuccess(false)
    setStatusMessage(null)
    writePersistedStoreProfileDraft(storeId, null)
    setScreen(storeProfileBackTargetRef.current || ShowcaseScreens.Home)
  }

  function backFromChangePassword(): void {
    setChangePasswordError(null)
    setScreen(changePasswordBackTargetRef.current)
  }

  function backFromAdmin(): void {
    if (
      screen === 'AdminItems' ||
      screen === 'AdminCategories' ||
      screen === 'AdminAnnouncementEdit'
    ) {
      setScreen('Admin')
      void refreshAdminHomeCloudState(false)
      return
    }

    if (screen === 'Admin') {
      snapshotCurrentChatContext()
      void restoreClientChatContext()
      setLoginError(null)
      setScreen('Home')
      return
    }

    snapshotCurrentChatContext()
    void restoreClientChatContext()
    setLoginError(null)
    setScreen('Home')
  }

  function backFromAdminAppointmentManager(): void {
    setAppointmentsRefreshing(false)
    setScreen('Admin')
    void refreshAdminHomeCloudState(false)
  }

  function backToAdminFromEdit(): void {
    clearEditDraftLocalImages(storeId)

    setEditDishId(null)
    setEditDishImageUrls([])
    setSelectedDishId(null)
    setEditValidationError(null)
    setIsSavingEditDish(false)
    setIsBlockingEditDish(false)
    setStatusMessage(null)

    const target = previousScreen && previousScreen !== 'Edit'
      ? previousScreen
      : 'Admin'

    setPreviousScreen('Admin')
    setScreen(target)
  }

  function persistFavoritesState(
    nextIds: string[],
    nextAddedAt: Record<string, number>,
    nextSnapshots: Record<string, ShowcaseFavoriteSnapshot>
  ): void {
    const dedupedIds = Array.from(new Set(nextIds.map(id => String(id || '').trim()).filter(Boolean)))
    const allowedIds = new Set(dedupedIds)

    const normalizedAddedAt: Record<string, number> = {}
    Object.entries(nextAddedAt).forEach(([idInput, value]) => {
      const id = idInput.trim()
      const timestamp = Number(value || 0)

      if (id && allowedIds.has(id) && Number.isFinite(timestamp) && timestamp > 0) {
        normalizedAddedAt[id] = timestamp
      }
    })

    const normalizedSnapshots: Record<string, ShowcaseFavoriteSnapshot> = {}
    Object.entries(nextSnapshots).forEach(([idInput, snapshot]) => {
      const id = idInput.trim()

      if (id && allowedIds.has(id)) {
        normalizedSnapshots[id] = {
          dishId: id,
          title: snapshot.title,
          category: snapshot.category ?? null,
          originalPriceText: snapshot.originalPriceText,
          discountPriceText: snapshot.discountPriceText ?? null,
          priceText: snapshot.priceText,
          imageUrl: snapshot.imageUrl ?? null
        }
      }
    })

    setFavoriteIds(dedupedIds)
    setFavoriteAddedAt(normalizedAddedAt)
    setFavoriteSnapshots(normalizedSnapshots)

    saveFavoriteIdsToStorage(storeId, dedupedIds)
    saveFavoriteAddedAtToStorage(storeId, normalizedAddedAt)
    saveFavoriteSnapshotsToStorage(storeId, normalizedSnapshots)
  }

  function updateChatDraftPersistence(
    nextDraft: string,
    nextImageUrls = chatDraftImageUrls,
    nextProduct = chatPendingProduct,
    nextQuotedMessageId = chatQuotedMessageId,
    nextAppointment = chatPendingAppointment
  ): void {
    writeChatDraft({
      storeId,
      conversationId: activeConversationId,
      draft: nextDraft,
      draftImageUrls: nextImageUrls,
      pendingProduct: nextProduct,
      pendingAppointment: nextAppointment,
      quotedMessageId: nextQuotedMessageId
    })
  }

  function openDetailById(dishId: string): void {
    openDetail(dishId)
  }

  function openStoreProfileView(): void {
    if (!hasLoadedInitialCloudRef.current) {
      void ensureLoaded()
    }

    if (screen === ShowcaseScreens.StoreProfileView) {
      setStoreProfileDraft(null)
      setIsEditingStoreProfile(false)
      setIsSavingStoreProfile(false)
      setStoreProfileSaveError(null)
      setStoreProfileSaveSuccess(false)
      setStatusMessage(null)
      void refreshStoreProfile()
      return
    }

    const backTarget = screen || ShowcaseScreens.Home

    storeProfileBackTargetRef.current = backTarget
    setPreviousScreen(backTarget)
    setStoreProfileDraft(null)
    setIsEditingStoreProfile(false)
    setIsSavingStoreProfile(false)
    setStoreProfileSaveError(null)
    setStoreProfileSaveSuccess(false)
    setStatusMessage(null)
    setScreen(ShowcaseScreens.StoreProfileView)

    void refreshStoreProfile()
  }

  async function openStoreProfile(): Promise<void> {
    if (!hasLoadedInitialCloudRef.current) {
      void ensureLoaded()
    }

    const backTarget = screen || ShowcaseScreens.Home

    storeProfileBackTargetRef.current = backTarget
    setPreviousScreen(backTarget)
    startEditStoreProfile()
    setStoreProfileSaveError(null)
    setStoreProfileSaveSuccess(false)
    setScreen(ShowcaseScreens.StoreProfile)
  }
  async function openAdminItemsScreen(): Promise<void> {
    const localDishes = loadDishesFromStorage(storeId)
    const localManualCategories = loadManualCategoriesFromStorage(storeId)

    if (localDishes.length) {
      mergeDishEntities(localDishes)
      setDishes(localDishes)
      setPendingSyncOperations(buildPendingDishSyncOperations(localDishes))
    }

    if (localManualCategories.length) {
      setCategories(manualCategoryNamesToCloudCategories(localManualCategories))
    }

    setLastRetryOp(ShowcaseRetryOps.LoadFromCloud)
    setPreviousScreen(screen)
    setScreen('AdminItems')

    void refreshAdminItemsFilteredFirstPage(currentAdminItemsCloudFilters())
  }

  async function openAdminCategoriesScreen(): Promise<void> {
    const localManualCategories = loadManualCategoriesFromStorage(storeId)

    if (localManualCategories.length) {
      setCategories(manualCategoryNamesToCloudCategories(localManualCategories))
    }

    setLastRetryOp(ShowcaseRetryOps.LoadFromCloud)
    setPreviousScreen(screen)
    setScreen('AdminCategories')

    void refreshAdminCategoriesData()
  }

  async function openAdminAnnouncementPublisher(): Promise<void> {
    void syncMerchantAnnouncementsFromCloud()

    const cached = loadAdminAnnouncementEditorDraftLocally(storeId)

    setPreviousScreen(screen)

    if (cached) {
      setScreen('AdminAnnouncementEdit')
      setAdminAnnouncementComposerExpanded(true)
      setAdminAnnouncementCoverDraftUrl(null)
      setAdminAnnouncementBodyDraft(cached.body)
      setAdminAnnouncementEditingId(cached.id || null)
      setAdminAnnouncementSelectedIds([])
      setAdminAnnouncementPreviewId(null)
      setAdminAnnouncementError(null)
      setAdminAnnouncementSuccess(null)
      setAdminAnnouncementIsSubmitting(false)
      setAdminAnnouncementIsBlocking(false)
      return
    }

    setScreen('AdminAnnouncementEdit')
    setAdminAnnouncementComposerExpanded(false)
    setAdminAnnouncementCoverDraftUrl(null)
    setAdminAnnouncementBodyDraft('')
    setAdminAnnouncementEditingId(null)
    setAdminAnnouncementSelectedIds([])
    setAdminAnnouncementPreviewId(null)
    setAdminAnnouncementError(null)
    setAdminAnnouncementSuccess(null)
    setAdminAnnouncementIsSubmitting(false)
    setAdminAnnouncementIsBlocking(false)
    setAdminAnnouncementSubmittingAction(null)
  }

  async function openAdminAppointmentManager(): Promise<void> {
    if (!isAdminLoggedIn) {
      setPreviousScreen(screen)
      prepareLoginScreen(null)
      setScreen('Login')
      return
    }

    if (!hasLoadedInitialCloudRef.current) {
      void ensureLoaded()
    }

    setPreviousScreen(screen)
    setStatusMessage(null)
    setScreen('AdminAppointmentManager')
    void refreshAdminAppointmentsFromCloud()
  }

  function openChangePasswordPage(): void {
    changePasswordBackTargetRef.current = screen

    setPreviousScreen(screen)
    setChangePasswordCurrentDraft('')
    setChangePasswordNewDraft('')
    setChangePasswordConfirmDraft('')
    setChangePasswordError(null)
    setChangePasswordSuccess(null)
    setIsChangingPassword(false)
    setScreen('ChangePassword')
  }

  async function openMerchantChatList(): Promise<void> {
    if (!isAdminLoggedIn) {
      setPreviousScreen(screen)
      prepareLoginScreen(null)
      setScreen('Login')
      return
    }

    merchantChatListBackTargetRef.current = 'Admin'
    setPreviousScreen('Admin')
    setStatusMessage(null)
    setScreen('MerchantChatList')
  }

  function openFavorites(): void {
    if (screen === ShowcaseScreens.Favorites) {
      refreshFavoritesList()
      return
    }

    setPreviousScreen(screen)
    setScreen(ShowcaseScreens.Favorites)
    refreshFavoritesList()
  }

  function closeFavorites(): void {
    setFavoritesSelectedIds([])
    setScreen(ShowcaseScreens.Home)
  }

  function openCustomerBookings(): void {
    const alertKeys = customerAppointmentCards
      .filter(item => isCustomerBookingAlertStatus(item.statusLabel))
      .map(item => appointmentStatusAlertKey(item.id, item.statusLabel))
      .filter(Boolean)

    if (alertKeys.length) {
      const seenKeys = loadSeenAppointmentStatusAlertKeys(storeId, clientId)
      saveSeenAppointmentStatusAlertKeys(storeId, clientId, [...seenKeys, ...alertKeys])
    }

    setBookingsEntryDotVisible(false)

    if (!isAdminLoggedIn && currentChatRole() !== 'merchant') {
      void ensurePushRegistration({ audience: 'appointment_client' })
    }

    if (screen === ShowcaseScreens.CustomerBookings) {
      setStatusMessage(appointmentsEnabled
        ? null
        : 'Checking appointment booking status...')
      void refreshCustomerAppointmentsFromCloud()
      return
    }

    setPreviousScreen(screen)
    setStatusMessage(appointmentsEnabled
      ? null
      : 'Checking appointment booking status...')
    setScreen(ShowcaseScreens.CustomerBookings)
    void refreshCustomerAppointmentsFromCloud()
  }

  function openAppointments(): void {
    setPreviousScreen(screen)
    setScreen('Appointments')
  }

  function openAnnouncementsFromBottomBar(): void {
    if (screen === ShowcaseScreens.Announcements) {
      setFocusedAnnouncementId(null)
      void syncPublicAnnouncementsFromCloud(true)
      return
    }

    const backTarget = screen || ShowcaseScreens.Home

    announcementsBackTargetRef.current = backTarget
    setPreviousScreen(backTarget)
    setFocusedAnnouncementId(null)
    setScreen(ShowcaseScreens.Announcements)

    void syncPublicAnnouncementsFromCloud(true)
  }

  async function openCustomerChatFromScreen(
    backTarget: ShowcaseScreenName,
    pendingProduct: ShowcaseChatProductShare | null = null,
    pendingAppointment: ShowcaseChatAppointmentShare | null = null
  ): Promise<void> {
    chatBackTargetRef.current = backTarget
    setPreviousScreen(backTarget)

    snapshotCurrentChatContext()

    stopMerchantChatListPolling()
    stopMerchantChatListDbObserve()
    stopChatPolling()
    stopChatDbObserve()

    setChatMode('Client')
    setChatStatusMessage(null)
    setChatOpeningState(true)
    setRuntimeChatVisible(true)
    setScreen(ShowcaseScreens.Chat)

    try {
      await restoreClientChatContext(pendingProduct, pendingAppointment)
      setChatStatusMessage(null)
      await syncChat()
      startChatDbObserve()
      startChatPolling()
    } catch (error) {
      console.warn('[NDJC_CHAT] Failed to open customer chat.', {
        storeId,
        backTarget,
        error
      })
      setChatStatusMessage('Chat is temporarily unavailable. Please try again.')
    } finally {
      setChatOpeningState(false)
    }
  }

  function openChatFromBottomBar(): void {
    const backTarget = screen || ShowcaseScreens.Home
    const pendingProduct = screen === ShowcaseScreens.Detail
      ? buildPendingFromSelectedDish()
      : null

    void openCustomerChatFromScreen(backTarget, pendingProduct)
  }

  function openChatFromCustomerBooking(appointmentIdInput: string): void {
    const appointmentId = appointmentIdInput.trim()
    if (!appointmentId) return

    const item = customerAppointmentCards.find(appointment => appointment.id === appointmentId) ||
      appointmentCards.find(appointment => appointment.id === appointmentId) ||
      null

    if (!item) {
      setStatusMessage('Booking is unavailable.')
      return
    }

    const pendingAppointment = buildPendingAppointmentFromCard(item)

    void openCustomerChatFromScreen(
      ShowcaseScreens.CustomerBookings,
      null,
      pendingAppointment
    )
  }

  function openChatFromHome(): void {
    void openCustomerChatFromScreen(ShowcaseScreens.Home)
  }

  function openChatFromStoreProfile(): void {
    void openCustomerChatFromScreen(screen || ShowcaseScreens.Home)
  }

  function openChatFromMerchantList(): void {
    const conversationId = activeConversationId.trim()
    if (!conversationId) return

    void openMerchantThread(conversationId)
  }



  function openNewDishScreen(): void {
    startNewDish()
  }

  function openEditScreen(dishId: string): void {
    openEditDish(dishId)
  }

  function onAdminFabClicked(): void {
    startNewDish()
  }

  function openMap(url: string): void {
    const clean = url.trim()
    if (isBrowser() && clean) {
      window.open(clean, '_blank', 'noopener,noreferrer')
    }
  }

  function openWebsite(url: string): void {
    const clean = url.trim()
    if (isBrowser() && clean) {
      window.open(clean, '_blank', 'noopener,noreferrer')
    }
  }

  function openPhone(phone: string): void {
    const clean = phone.trim()
    if (isBrowser() && clean) {
      window.location.href = `tel:${clean}`
    }
  }

  function parseJsonStringArray(value: string | null | undefined): string[] {
    if (!value) return []

    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed
          .map(item => String(item || '').trim())
          .filter(Boolean)
      }
    } catch {
      return value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
    }

    return []
  }

  function parseExtraContacts(value: string | null | undefined): ShowcaseExtraContact[] {
    if (!value) return []

    try {
      const parsed = JSON.parse(value)
      if (!Array.isArray(parsed)) return []

      return parsed.map((item, index) => {
        if (!item || typeof item !== 'object') {
          return {
            id: `extra_contact_${index + 1}`,
            name: '',
            value: ''
          }
        }

        const record = item as Record<string, unknown>

        return {
          id: normalizeText(record.id, `extra_contact_${index + 1}`),
          name: normalizeText(record.name),
          value: normalizeText(record.value)
        }
      })
    } catch {
      return []
    }
  }

  function serializeExtraContacts(items: Array<ShowcaseExtraContact | DraftExtraContact>): string {
    return JSON.stringify(
      items.map(item => ({
        id: item.id || createId('extra_contact'),
        name: item.name,
        value: item.value
      }))
    )
  }

  function serializeServices(items: string[]): string {
    return JSON.stringify(
      items
        .map(item => item.trim())
        .filter(Boolean)
    )
  }

  function applyCloudStoreProfile(profile: CloudStoreProfile | null): void {
    const nextStoreProfile = storeProfileFromCloud(profile)
    const services = parseJsonStringArray(profile?.servicesJson)
    const extraContacts = parseExtraContacts(profile?.extraContactsJson)

    setStoreProfileCloud(profile)
    setStoreProfile(nextStoreProfile)
    setStoreProfileServices(services)
    setStoreProfileExtraContacts(extraContacts)
    setStoreProfileCoverUrl(profile?.coverUrl || '')
    setStoreProfileLogoUrl(profile?.logoUrl || '')
    setDraftStoreProfileCoverUrl(profile?.coverUrl || '')
    setDraftStoreProfileLogoUrl(profile?.logoUrl || '')
    setDraftStoreProfileDescription(profile?.description || '')
    setDraftBusinessStatus(profile?.businessStatus || '')
    setDraftStoreProfileServices(services)
    setDraftStoreProfileExtraContacts(
      extraContacts.map((item, index) => ({
        id: item.id || `extra_contact_${index + 1}`,
        name: item.name,
        value: item.value
      }))
    )

    if (screen === ShowcaseScreens.StoreProfileView) {
      setStoreProfileDraft(null)
      return
    }

    const persistedDraft = readPersistedStoreProfileDraft(storeId)
    if (screen === ShowcaseScreens.StoreProfile && persistedDraft) {
      setStoreProfileDraft(persistedDraft)
    } else if (screen === ShowcaseScreens.StoreProfile) {
      setStoreProfileDraft(storeProfileDraftFromProfile(nextStoreProfile))
    }
  }

  function buildCloudStoreProfileFromDraft(): CloudStoreProfile {
    const draft = storeProfileDraft || storeProfile || storeProfileFromCloud(storeProfileCloud)

    return {
      storeId,
      title: draft.displayName,
      subtitle: draft.tagline,
      description: draftStoreProfileDescription,
      address: draft.address,
      hours: draft.businessHours,
      mapUrl: draft.mapUrl,
      extraContactsJson: serializeExtraContacts(draftStoreProfileExtraContacts),
      servicesJson: serializeServices(draftStoreProfileServices),
      coverUrl: draftStoreProfileCoverUrl,
      logoUrl: draftStoreProfileLogoUrl,
      businessStatus: draftBusinessStatus,
      updatedAt: nowMillis()
    }
  }

  function buildDishFromEditForm(existing: DemoDish | null): DemoDish {
    const originalPrice = normalizeNumber(editDishOriginalPrice, existing?.originalPrice || 0)
    const discountPrice = editDishDiscountPrice.trim()
      ? normalizeNumber(editDishDiscountPrice, 0)
      : null

    const name = (editDishName.trim() || existing?.name || existing?.title || 'Untitled item').trim()
    const id = editDishId || existing?.id || createUuidLikeId()
    const imageUrls = editDishImageUrls
      .map(item => item.trim())
      .filter(Boolean)
      .filter((item, index, all) => all.indexOf(item) === index)
      .slice(0, 9)

    return {
      id,
      name,
      title: name,
      description: editDishDescription.trim().slice(0, 200),
      category: editDishCategory?.trim() || '',
      originalPrice,
      discountPrice,
      isRecommended: editDishRecommended,
      isSoldOut: existing?.isSoldOut || false,
      isHidden: editDishHidden,
      imageUri: imageUrls[0] || null,
      imageUrls,
      imageVariants: existing?.imageVariants ?? null,
      tags: existing?.tags || [],
      clickCount: existing?.clickCount || 0,
      updatedAt: nowMillis(),
      syncState: 'Pending',
      dirty: true,
      isFavorite: favoriteIds.includes(id)
    }
  }

  function validateEditDish(): string | null {
    const name = editDishName.trim()
    if (!name) return 'Please enter Name.'

    const priceText = editDishOriginalPrice.trim()
    if (!priceText) return 'Please enter Price.'

    const originalPrice = Number(priceText)
    if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
      return 'Please enter a valid Price.'
    }

    const description = editDishDescription.trim()
    if (!description) return 'Please enter Description.'

    const category = editDishCategory?.trim() || ''
    if (!category) return 'Please enter Category.'

    const imageUrls = editDishImageUrls
      .map(item => item.trim())
      .filter(Boolean)

    if (!imageUrls.length) return 'Please add at least 1 image.'

    const discountText = editDishDiscountPrice.trim()
    if (discountText) {
      const discount = Number(discountText)

      if (!Number.isFinite(discount)) {
        return 'Invalid discount price.'
      }

      if (discount <= 0) {
        return 'Discount price must be > 0.'
      }

      if (discount >= originalPrice) {
        return 'Discount price must be lower than price.'
      }
    }

    return null
  }

  function applyPriceRangeFromDrafts(
    minDraft: string,
    maxDraft: string,
    setMin: (value: number | null) => void,
    setMax: (value: number | null) => void
  ): void {
    const min = minDraft.trim() ? Number(minDraft) : null
    const max = maxDraft.trim() ? Number(maxDraft) : null

    const validMin = min != null && Number.isFinite(min) ? min : null
    const validMax = max != null && Number.isFinite(max) ? max : null

    if (validMin != null && validMax != null && validMin > validMax) {
      setMin(validMax)
      setMax(validMin)
      return
    }

    setMin(validMin)
    setMax(validMax)
  }

  function isBrowserOfflineNow(): boolean {
    if (typeof navigator === 'undefined') return false
    return navigator.onLine === false
  }

  function applyCachedFirstScreenData(input: {
    localDishes: DemoDish[]
    localManualCategories: string[]
    localStoreProfile: ReturnType<typeof loadStoreProfileFromStorage>
    localAnnouncements: CloudAnnouncement[]
    localAppointments: CloudAppointmentRequest[]
  }): void {
    const localHomeDishes = input.localDishes.filter(item => !item.isHidden)
    const effectiveLocalDishes = isAdminLoggedIn
      ? input.localDishes
      : localHomeDishes
    const effectiveCategoryNames = deriveCategoriesFromModels(
      effectiveLocalDishes,
      input.localManualCategories
    )

    if (input.localDishes.length) {
      mergeDishEntities(input.localDishes)
      setHomeDishIds(dishIdsFromItems(localHomeDishes))
      setAdminItemIds(dishIdsFromItems(input.localDishes))
      setDishes(effectiveLocalDishes)
      refreshFavoritesList(effectiveLocalDishes)
      setPendingSyncOperations(buildPendingDishSyncOperations(input.localDishes))
    }

    if (effectiveCategoryNames.length) {
      setCategories(manualCategoryNamesToCloudCategories(effectiveCategoryNames))
    }

    if (input.localStoreProfile) {
      const localProfileForUi = storeProfileFromCachedProfile(input.localStoreProfile)
      setStoreProfile(localProfileForUi)
      setStoreProfileDraft(current => current || storeProfileDraftFromProfile(localProfileForUi))
      setStoreProfileServices(input.localStoreProfile.services)
      setStoreProfileExtraContacts(input.localStoreProfile.extraContacts)
      setStoreProfileCoverUrl(input.localStoreProfile.coverUrl)
      setStoreProfileLogoUrl(input.localStoreProfile.logoUrl)
      setDraftStoreProfileCoverUrl(input.localStoreProfile.coverUrl)
      setDraftStoreProfileLogoUrl(input.localStoreProfile.logoUrl)
      setDraftStoreProfileDescription(input.localStoreProfile.description)
      setDraftBusinessStatus(input.localStoreProfile.businessStatus)
      setDraftStoreProfileServices(input.localStoreProfile.services)
      setDraftStoreProfileExtraContacts(
        input.localStoreProfile.extraContacts.map((item, index) => ({
          id: `cached_extra_contact_${index + 1}`,
          name: item.name,
          value: item.value
        }))
      )
    }

    if (input.localAnnouncements.length) {
      setAnnouncements(
        input.localAnnouncements
          .filter(item => item.status === 'published')
          .sort((left, right) => {
            return (right.updatedAt || right.createdAt || 0) - (left.updatedAt || left.createdAt || 0)
          })
      )
    }

    if (input.localAppointments.length) {
      setAppointmentRequests(input.localAppointments)
    }

    if (
      input.localDishes.length ||
      effectiveCategoryNames.length ||
      input.localStoreProfile ||
      input.localAnnouncements.length ||
      input.localAppointments.length
    ) {
      setStatusMessage('Loaded cached data. Refreshing cloud...')
    }
  }

  const loadFromCloud = useCallback(async (reason: ShowcaseRetryOp = ShowcaseRetryOps.LoadFromCloud): Promise<void> => {
    const seq = loadingSeqRef.current + 1
    loadingSeqRef.current = seq

    ndjcTrace('ENTER loadFromCloud', {
      seq,
      reason,
      screen,
      isAdminLoggedIn,
      hasMerchantSession: Boolean(merchantSession?.accessToken),
      activeConversationId,
      chatPollingEnabled,
      chatEntryPollingEnabled,
      storeId
    })

    if (loadFromCloudRunningRef.current) {
      ndjcTrace('REENTER loadFromCloud while previous load is still running', {
        seq,
        reason,
        screen,
        isAdminLoggedIn,
        activeConversationId
      })
    }

    loadFromCloudRunningRef.current = true

    setIsLoading(true)
    setIsCloudLoading(true)
    setStatusMessage('Loading from cloud...')
    setSyncOverviewState(SyncOverviewStates.Syncing)
    setSyncErrorMessage(null)
    setLastRetryOp(reason)

    try {
      const validSession = isAdminLoggedIn || isMerchantLoggedInInStoreSession()
        ? await ensureValidMerchantSessionLoadedForCloud()
        : merchantSession

      if ((isAdminLoggedIn || isMerchantLoggedInInStoreSession()) && !validSession) {
        setSyncOverviewState(SyncOverviewStates.Failed)
        setSyncErrorMessage(merchantSessionEnsureFailureMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const localDishes = loadDishesFromStorage(storeId)
      const localManualCategories = loadManualCategoriesFromStorage(storeId)
      const localStoreProfile = loadStoreProfileFromStorage(storeId)
      const localAnnouncements = loadPublishedAnnouncementsLocally(storeId)
      const localAppointments = loadAppointmentsFromStorage(storeId)

      applyCachedFirstScreenData({
        localDishes,
        localManualCategories,
        localStoreProfile,
        localAnnouncements,
        localAppointments
      })

      const cloudLoadStartedAt = Date.now()

      const [
        serviceStatus,
        cloudCategories,
        cloudDishes,
        cloudStoreProfile,
        cloudAppointmentSettings,
        appointmentRequests,
        publishedAnnouncements
      ] = await Promise.all([
        repository.fetchStoreServiceStatus(storeId),
        repository.fetchCategories(storeId),
        repository.fetchDishesPaged({
          storeId,
          limit: isAdminLoggedIn ? SHOWCASE_PAGE_SIZE.adminItems : SHOWCASE_PAGE_SIZE.homeDishes,
          offset: 0
        }),
        repository.fetchStoreProfile(storeId),
        repository.fetchAppointmentSettings(storeId),
        isAdminLoggedIn
          ? repository.fetchAppointmentRequestsForMerchant(storeId)
          : repository.fetchAppointmentRequestsForClient(storeId, clientId),
        repository.fetchAnnouncements({
          storeId,
          includeDrafts: false,
          limit: SHOWCASE_PAGE_SIZE.publicAnnouncements,
          offset: 0
        })
      ])

      if (loadingSeqRef.current !== seq) return

      const cloudManualCategories = cloudCategories
        .map(item => item.name.trim())
        .filter(Boolean)

      const publicCloudDishes = isAdminLoggedIn
        ? cloudDishes
        : cloudDishes.filter(item => !item.isHidden)

      const browserOffline = isBrowserOfflineNow()
      const cloudReadFailed = repository.lastReadFailureAt >= cloudLoadStartedAt
      const cloudUnavailable = browserOffline || cloudReadFailed
      const localVisibleDishes = localDishes.filter(item => isAdminLoggedIn || !item.isHidden)

      const protectedLocalDishes = localDishes.filter(item => {
        return item.dirty === true || item.syncState === 'Pending' || item.syncState === 'Failed'
      })

      const shouldUseLocalDishCache = cloudUnavailable && !publicCloudDishes.length && localVisibleDishes.length > 0

      const effectiveDishes = shouldUseLocalDishCache
        ? localVisibleDishes
        : isAdminLoggedIn
          ? publicCloudDishes.length
            ? mergeRemoteAndLocal(publicCloudDishes, localDishes)
            : protectedLocalDishes
          : publicCloudDishes

      const effectiveManualCategories = cloudManualCategories.length
        ? cloudManualCategories
        : localManualCategories

      const effectiveAnnouncements = (publishedAnnouncements.length
        ? publishedAnnouncements
        : localAnnouncements
      )
        .filter(item => item.status === 'published')
        .sort((left, right) => {
          return (right.updatedAt || right.createdAt || 0) - (left.updatedAt || left.createdAt || 0)
        })
        .map(toPublishedAnnouncementEntity)

      setCloudStatus(serviceStatus)
      setIsWriteAllowed(serviceStatus ? serviceStatus.isWriteAllowed : await repository.isStoreWriteAllowed(storeId))
      setCategories(cloudCategories.length ? cloudCategories : manualCategoryNamesToCloudCategories(effectiveManualCategories))
      mergeDishEntities(effectiveDishes)
      setHomeDishIds(dishIdsFromItems(effectiveDishes))
      setAdminItemIds(dishIdsFromItems(effectiveDishes))
      setDishes(effectiveDishes)
      refreshFavoritesList(effectiveDishes)
      setPendingSyncOperations(buildPendingDishSyncOperations(effectiveDishes))

      if (selectedDishId && screen === 'Detail') {
        const reboundSelectedDish = getDishEntityById(selectedDishId)

        if (!reboundSelectedDish) {
          void ensureDishEntityLoaded(selectedDishId).then(item => {
            if (!item && screen === 'Detail') {
              setScreen('Home')
              setSelectedDishId(null)
            }
          })
        }
      }

      const effectiveCategoryNames = cloudCategories.length
        ? cloudCategoriesToManualCategoryNames(cloudCategories)
        : effectiveManualCategories

      if (selectedCategory && !effectiveCategoryNames.includes(selectedCategory)) {
        setSelectedCategory(null)
      }

      if (cloudStoreProfile) {
        applyCloudStoreProfile(cloudStoreProfile)
        saveStoreProfileToStorage(storeId, {
          title: cloudStoreProfile.title || 'Showcase Store',
          subtitle: cloudStoreProfile.subtitle || 'Browse items, book services, and contact the store.',
          description: cloudStoreProfile.description || '',
          services: parseJsonStringArray(cloudStoreProfile.servicesJson),
          address: cloudStoreProfile.address || '',
          hours: cloudStoreProfile.hours || '',
          mapUrl: cloudStoreProfile.mapUrl || '',
          extraContacts: parseExtraContacts(cloudStoreProfile.extraContactsJson).map(item => ({
            name: item.name,
            value: item.value
          })),
          coverUrl: cloudStoreProfile.coverUrl || '',
          logoUrl: cloudStoreProfile.logoUrl || '',
          businessStatus: cloudStoreProfile.businessStatus || ''
        })
      } else if (localStoreProfile) {
        const localProfileForUi = storeProfileFromCachedProfile(localStoreProfile)
        setStoreProfile(localProfileForUi)
        setStoreProfileDraft(current => current || storeProfileDraftFromProfile(localProfileForUi))
      } else {
        applyCloudStoreProfile(null)
      }

      applyCloudAppointmentSettings(cloudAppointmentSettings)
      setAppointmentRequests(appointmentRequests)
      setAnnouncements(effectiveAnnouncements)

      if (!cloudUnavailable || effectiveDishes.length) {
        saveDishesToStorage(storeId, effectiveDishes)
      }

      if (effectiveManualCategories.length) {
        saveManualCategoriesToStorage(storeId, effectiveManualCategories)
      }

      if (effectiveAnnouncements.length) {
        persistPublishedAnnouncementsLocally(storeId, effectiveAnnouncements)
      }

      if (isAdminLoggedIn) {
        ndjcTrace('loadFromCloud admin branch start', {
          seq,
          storeId,
          authUserId: merchantSession?.authUserId || null
        })

        await chatRepository.syncMerchantThreadMetaFromCloud(
          storeId,
          `VM${Date.now()}_${storeId.slice(-4)}`
        )

        ndjcTrace('loadFromCloud admin chat meta synced', {
          seq,
          storeId
        })

        const threads = await fetchMerchantThreadsFromChatRepository(
          `VM${Date.now()}_${storeId.slice(-4)}`,
          SHOWCASE_PAGE_SIZE.chatThreads,
          0
        )
        setMerchantChatThreads(await buildMerchantThreadsWithLocalMeta(threads))
        setMerchantChatListPagination({
          nextOffset: threads.length,
          hasMore: threads.length >= SHOWCASE_PAGE_SIZE.chatThreads,
          isLoadingMore: false
        })

        ndjcTrace('loadFromCloud admin threads applied', {
          seq,
          threadsCount: threads.length
        })

        const bindings = await repository.fetchMerchantStoreMemberships(merchantSession?.authUserId || null)
        setMerchantBindings(bindings)

        ndjcTrace('loadFromCloud admin bindings applied', {
          seq,
          bindingsCount: bindings.length
        })
      } else {
        const conversation = await repository.findOrCreateChatConversation({
          storeId,
          clientId,
          customerName: DEFAULT_CUSTOMER_NAME,
          customerContact: ''
        })

        if (conversation) {
          setActiveConversation(conversation)
          setActiveConversationId(conversation.id)

          const draft = readChatDraft(storeId, conversation.id)
          if (draft) {
            setChatDraft(draft.draft)
            setChatDraftImageUrls(draft.draftImageUrls)
            setChatPendingProduct(draft.pendingProduct)
            setChatPendingAppointment(draft.pendingAppointment)
            setChatQuotedMessageId(draft.quotedMessageId)
          }

          const messages = await loadChatMessagesFromRepository(conversation.id)
          setChatMessages(messages)
        }
      }

      const pendingCount = effectiveDishes.filter(item => item.dirty === true || item.syncState === 'Pending').length
      const failedCount = effectiveDishes.filter(item => item.syncState === 'Failed').length

      setLastSyncAt(nowMillis())
      setSyncOverviewState(
        failedCount > 0
          ? SyncOverviewStates.Failed
          : pendingSyncOperations.length || pendingCount > 0
            ? SyncOverviewStates.HasPending
            : SyncOverviewStates.Idle
      )
      setSyncErrorMessage(null)
      setStatusMessage(
        cloudUnavailable && effectiveDishes.length
          ? 'Cloud unavailable, loaded from local cache.'
          : publicCloudDishes.length
            ? 'Loaded from cloud.'
            : 'No data.'
      )
    } catch (error) {
      ndjcTraceError('ERROR loadFromCloud', error, {
        seq,
        reason,
        screen,
        isAdminLoggedIn,
        hasMerchantSession: Boolean(merchantSession?.accessToken),
        activeConversationId,
        storeId
      })

      if (loadingSeqRef.current !== seq) return

      const localDishes = loadDishesFromStorage(storeId)
      const localManualCategories = loadManualCategoriesFromStorage(storeId)
      const localStoreProfile = loadStoreProfileFromStorage(storeId)
      const localAnnouncements = loadPublishedAnnouncementsLocally(storeId)
      const message = error instanceof Error ? error.message : String(error || 'Cloud load failed.')

      const effectiveLocalDishes = localDishes.filter(item => isAdminLoggedIn || !item.isHidden)

      mergeDishEntities(effectiveLocalDishes)

      setDishes(effectiveLocalDishes)
      refreshFavoritesList(effectiveLocalDishes)
      setCategories(manualCategoryNamesToCloudCategories(localManualCategories))
      setPendingSyncOperations(buildPendingDishSyncOperations(effectiveLocalDishes))

      const effectiveLocalCategoryNames = Array.from(
        new Set([
          ...localManualCategories,
          ...effectiveLocalDishes
            .map(item => item.category?.trim() || '')
            .filter(Boolean)
        ])
      )

      if (selectedCategory && !effectiveLocalCategoryNames.includes(selectedCategory)) {
        setSelectedCategory(null)
      }

      if (localStoreProfile) {
        const localProfileForUi = storeProfileFromCachedProfile(localStoreProfile)
        setStoreProfile(localProfileForUi)
        setStoreProfileDraft(current => current || storeProfileDraftFromProfile(localProfileForUi))
      }

      if (localAnnouncements.length) {
        setAnnouncements(localAnnouncements)
      }

      setSyncErrorMessage('Failed to load from cloud.')
      setSyncOverviewState(SyncOverviewStates.Failed)
      setStatusMessage(effectiveLocalDishes.length ? 'Cloud unavailable, loaded from local cache.' : message)
      setLastRetryOp(ShowcaseRetryOps.LoadFromCloud)
    } finally {
      ndjcTrace('EXIT loadFromCloud', {
        seq,
        reason,
        screen,
        isAdminLoggedIn,
        latestSeq: loadingSeqRef.current,
        isLatestSeq: loadingSeqRef.current === seq
      })

      if (loadingSeqRef.current === seq) {
        setIsLoading(false)
        setIsCloudLoading(false)
      }

      if (loadingSeqRef.current === seq) {
        loadFromCloudRunningRef.current = false
      }
    }
  }, [
    chatRepository,
    clientId,
    input.previewMode,
    isAdminLoggedIn,
    merchantSession,
    pendingSyncOperations.length,
    repository,
    screen,
    selectedCategory,
    selectedDishId,
    storeId,
    syncErrorMessage
  ])

  const refreshHomeMainData = useCallback(async (): Promise<void> => {
    if (homeMainRefreshInFlightRef.current) return

    homeMainRefreshInFlightRef.current = true

    ndjcTrace('ENTER refreshHomeMainData', {
      screen,
      isAdminLoggedIn,
      hasMerchantSession: Boolean(merchantSession?.accessToken),
      storeId
    })

    try {
      const validSession = isAdminLoggedIn || isMerchantLoggedInInStoreSession()
        ? await ensureValidMerchantSessionLoadedForCloud()
        : merchantSession

      if ((isAdminLoggedIn || isMerchantLoggedInInStoreSession()) && !validSession) {
        setSyncOverviewState(SyncOverviewStates.Failed)
        setSyncErrorMessage(merchantSessionEnsureFailureMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const localDishes = loadDishesFromStorage(storeId)
      const localManualCategories = loadManualCategoriesFromStorage(storeId)
      const localStoreProfile = loadStoreProfileFromStorage(storeId)
      const localAnnouncements = loadPublishedAnnouncementsLocally(storeId)
      const localAppointments = loadAppointmentsFromStorage(storeId)

      applyCachedFirstScreenData({
        localDishes,
        localManualCategories,
        localStoreProfile,
        localAnnouncements,
        localAppointments
      })

      const cloudLoadStartedAt = Date.now()

      const [
        serviceStatus,
        cloudCategories,
        cloudDishes,
        cloudStoreProfile,
        cloudAppointmentSettings,
        publishedAnnouncements
      ] = await Promise.all([
        repository.fetchStoreServiceStatus(storeId),
        repository.fetchCategories(storeId),
        repository.fetchDishesPaged({
          storeId,
          limit: isAdminLoggedIn ? SHOWCASE_PAGE_SIZE.adminItems : SHOWCASE_PAGE_SIZE.homeDishes,
          offset: 0
        }),
        repository.fetchStoreProfile(storeId),
        repository.fetchAppointmentSettings(storeId),
        repository.fetchAnnouncements({
          storeId,
          includeDrafts: false,
          limit: SHOWCASE_PAGE_SIZE.publicAnnouncements,
          offset: 0
        })
      ])

      const cloudManualCategories = cloudCategories
        .map(item => item.name.trim())
        .filter(Boolean)

      const publicCloudDishes = isAdminLoggedIn
        ? cloudDishes
        : cloudDishes.filter(item => !item.isHidden)

      const browserOffline = isBrowserOfflineNow()
      const cloudReadFailed = repository.lastReadFailureAt >= cloudLoadStartedAt
      const cloudUnavailable = browserOffline || cloudReadFailed
      const localVisibleDishes = localDishes.filter(item => isAdminLoggedIn || !item.isHidden)

      const protectedLocalDishes = localDishes.filter(item => {
        return item.dirty === true || item.syncState === 'Pending' || item.syncState === 'Failed'
      })

      const shouldUseLocalDishCache = cloudUnavailable && !publicCloudDishes.length && localVisibleDishes.length > 0

      const effectiveDishes = shouldUseLocalDishCache
        ? localVisibleDishes
        : isAdminLoggedIn
          ? publicCloudDishes.length
            ? mergeRemoteAndLocal(publicCloudDishes, localDishes)
            : protectedLocalDishes
          : publicCloudDishes

      const effectiveManualCategories = cloudManualCategories.length
        ? cloudManualCategories
        : localManualCategories

      const effectiveAnnouncements = (publishedAnnouncements.length
        ? publishedAnnouncements
        : localAnnouncements
      )
        .filter(item => item.status === 'published')
        .sort((left, right) => {
          return (right.updatedAt || right.createdAt || 0) - (left.updatedAt || left.createdAt || 0)
        })
        .map(toPublishedAnnouncementEntity)

      setCloudStatus(serviceStatus)
      setIsWriteAllowed(serviceStatus ? serviceStatus.isWriteAllowed : await repository.isStoreWriteAllowed(storeId))
      setCategories(cloudCategories.length ? cloudCategories : manualCategoryNamesToCloudCategories(effectiveManualCategories))
      mergeDishEntities(effectiveDishes)
      setHomeDishIds(dishIdsFromItems(effectiveDishes))
      if (isAdminLoggedIn) {
        setAdminItemIds(dishIdsFromItems(effectiveDishes))
      }
      setDishes(effectiveDishes)
      refreshFavoritesList(effectiveDishes)
      setPendingSyncOperations(buildPendingDishSyncOperations(effectiveDishes))

      if (selectedDishId && screen === 'Detail') {
        const reboundSelectedDish = getDishEntityById(selectedDishId)

        if (!reboundSelectedDish) {
          void ensureDishEntityLoaded(selectedDishId).then(item => {
            if (!item && screen === 'Detail') {
              setScreen('Home')
              setSelectedDishId(null)
            }
          })
        }
      }

      const effectiveCategoryNames = cloudCategories.length
        ? cloudCategoriesToManualCategoryNames(cloudCategories)
        : effectiveManualCategories

      if (selectedCategory && !effectiveCategoryNames.includes(selectedCategory)) {
        setSelectedCategory(null)
      }

      if (cloudStoreProfile) {
        applyCloudStoreProfile(cloudStoreProfile)
        saveStoreProfileToStorage(storeId, {
          title: cloudStoreProfile.title || 'Showcase Store',
          subtitle: cloudStoreProfile.subtitle || 'Browse items, book services, and contact the store.',
          description: cloudStoreProfile.description || '',
          services: parseJsonStringArray(cloudStoreProfile.servicesJson),
          address: cloudStoreProfile.address || '',
          hours: cloudStoreProfile.hours || '',
          mapUrl: cloudStoreProfile.mapUrl || '',
          extraContacts: parseExtraContacts(cloudStoreProfile.extraContactsJson).map(item => ({
            name: item.name,
            value: item.value
          })),
          coverUrl: cloudStoreProfile.coverUrl || '',
          logoUrl: cloudStoreProfile.logoUrl || '',
          businessStatus: cloudStoreProfile.businessStatus || ''
        })
      } else if (localStoreProfile) {
        const localProfileForUi = storeProfileFromCachedProfile(localStoreProfile)
        setStoreProfile(localProfileForUi)
        setStoreProfileDraft(current => current || storeProfileDraftFromProfile(localProfileForUi))
      } else {
        applyCloudStoreProfile(null)
      }

      applyCloudAppointmentSettings(cloudAppointmentSettings)
      setAnnouncements(effectiveAnnouncements)

      if (!cloudUnavailable || effectiveDishes.length) {
        saveDishesToStorage(storeId, effectiveDishes)
      }

      if (effectiveManualCategories.length) {
        saveManualCategoriesToStorage(storeId, effectiveManualCategories)
      }

      if (effectiveAnnouncements.length) {
        persistPublishedAnnouncementsLocally(storeId, effectiveAnnouncements)
      }

      const pendingCount = effectiveDishes.filter(item => item.dirty === true || item.syncState === 'Pending').length
      const failedCount = effectiveDishes.filter(item => item.syncState === 'Failed').length

      setLastSyncAt(nowMillis())
      setSyncOverviewState(
        failedCount > 0
          ? SyncOverviewStates.Failed
          : pendingSyncOperations.length || pendingCount > 0
            ? SyncOverviewStates.HasPending
            : SyncOverviewStates.Idle
      )
      setSyncErrorMessage(null)
      setStatusMessage(
        cloudUnavailable && effectiveDishes.length
          ? 'Cloud unavailable, loaded from local cache.'
          : publicCloudDishes.length
            ? 'Loaded from cloud.'
            : 'No data.'
      )
    } catch (error) {
      ndjcTraceError('ERROR refreshHomeMainData', error, {
        screen,
        isAdminLoggedIn,
        hasMerchantSession: Boolean(merchantSession?.accessToken),
        storeId
      })

      const localDishes = loadDishesFromStorage(storeId)
      const localManualCategories = loadManualCategoriesFromStorage(storeId)
      const localStoreProfile = loadStoreProfileFromStorage(storeId)
      const localAnnouncements = loadPublishedAnnouncementsLocally(storeId)
      const message = error instanceof Error ? error.message : String(error || 'Cloud load failed.')
      const effectiveLocalDishes = localDishes.filter(item => isAdminLoggedIn || !item.isHidden)

      mergeDishEntities(effectiveLocalDishes)
      setHomeDishIds(dishIdsFromItems(effectiveLocalDishes))

      if (isAdminLoggedIn) {
        setAdminItemIds(dishIdsFromItems(effectiveLocalDishes))
      }

      setDishes(effectiveLocalDishes)
      refreshFavoritesList(effectiveLocalDishes)
      setCategories(manualCategoryNamesToCloudCategories(localManualCategories))
      setPendingSyncOperations(buildPendingDishSyncOperations(effectiveLocalDishes))

      const effectiveLocalCategoryNames = Array.from(
        new Set([
          ...localManualCategories,
          ...effectiveLocalDishes
            .map(item => item.category?.trim() || '')
            .filter(Boolean)
        ])
      )

      if (selectedCategory && !effectiveLocalCategoryNames.includes(selectedCategory)) {
        setSelectedCategory(null)
      }

      if (localStoreProfile) {
        const localProfileForUi = storeProfileFromCachedProfile(localStoreProfile)
        setStoreProfile(localProfileForUi)
        setStoreProfileDraft(current => current || storeProfileDraftFromProfile(localProfileForUi))
      }

      if (localAnnouncements.length) {
        setAnnouncements(localAnnouncements)
      }

      setSyncErrorMessage('Failed to load home data from cloud.')
      setSyncOverviewState(SyncOverviewStates.Failed)
      setStatusMessage(effectiveLocalDishes.length ? 'Cloud unavailable, loaded from local cache.' : message)
      setLastRetryOp(ShowcaseRetryOps.LoadFromCloud)
    } finally {
      ndjcTrace('EXIT refreshHomeMainData', {
        screen,
        isAdminLoggedIn,
        storeId
      })

      homeMainRefreshInFlightRef.current = false
    }
  }, [
    isAdminLoggedIn,
    merchantSession,
    pendingSyncOperations.length,
    repository,
    screen,
    selectedCategory,
    selectedDishId,
    storeId,
    syncErrorMessage
  ])

  const refreshHomeBadgeData = useCallback(async (): Promise<void> => {
    if (homeBadgeRefreshInFlightRef.current) return

    homeBadgeRefreshInFlightRef.current = true

    ndjcTrace('ENTER refreshHomeBadgeData', {
      screen,
      isAdminLoggedIn,
      storeId
    })

    try {
      await Promise.allSettled([
        refreshChatEntryDotOnce(),
        refreshBookingsEntryDotOnce(),
        refreshAnnouncementsEntryDotOnce()
      ])
    } finally {
      ndjcTrace('EXIT refreshHomeBadgeData', {
        screen,
        isAdminLoggedIn,
        storeId
      })

      homeBadgeRefreshInFlightRef.current = false
    }
  }, [
    isAdminLoggedIn,
    screen,
    storeId
  ])

  const refreshAdminItemsData = useCallback(async (): Promise<void> => {
    if (adminItemsRefreshInFlightRef.current) return

    adminItemsRefreshInFlightRef.current = true

    ndjcTrace('ENTER refreshAdminItemsData', {
      screen,
      isAdminLoggedIn,
      hasMerchantSession: Boolean(merchantSession?.accessToken),
      storeId
    })

    try {
      const validSession = isAdminLoggedIn || isMerchantLoggedInInStoreSession()
        ? await ensureValidMerchantSessionLoadedForCloud()
        : merchantSession

      if ((isAdminLoggedIn || isMerchantLoggedInInStoreSession()) && !validSession) {
        setSyncOverviewState(SyncOverviewStates.Failed)
        setSyncErrorMessage(merchantSessionEnsureFailureMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const localDishes = loadDishesFromStorage(storeId)
      const localManualCategories = loadManualCategoriesFromStorage(storeId)

      const [serviceStatus, cloudCategories, filteredItems] = await Promise.all([
        repository.fetchStoreServiceStatus(storeId),
        repository.fetchCategories(storeId),
        fetchAdminItemsFilteredPage(currentAdminItemsCloudFilters(), 0)
      ])

      const cloudManualCategories = cloudCategories
        .map(item => item.name.trim())
        .filter(Boolean)

      const protectedLocalDishes = localDishes.filter(item => {
        return item.dirty === true || item.syncState === 'Pending' || item.syncState === 'Failed'
      })

      const effectiveDishes = mergeRemoteAndLocal(filteredItems, protectedLocalDishes)

      const effectiveManualCategories = cloudManualCategories.length
        ? cloudManualCategories
        : localManualCategories

      setCloudStatus(serviceStatus)
      setIsWriteAllowed(serviceStatus ? serviceStatus.isWriteAllowed : await repository.isStoreWriteAllowed(storeId))
      setCategories(cloudCategories.length ? cloudCategories : manualCategoryNamesToCloudCategories(effectiveManualCategories))
      mergeDishEntities(effectiveDishes)
      setAdminItemIds(dishIdsFromItems(filteredItems))
      setDishes(effectiveDishes)
      refreshFavoritesList(effectiveDishes)
      setPendingSyncOperations(buildPendingDishSyncOperations(effectiveDishes))
      resetAdminItemsPaginationForFirstPage(filteredItems.length)

      const effectiveCategoryNames = cloudCategories.length
        ? cloudCategoriesToManualCategoryNames(cloudCategories)
        : effectiveManualCategories

      if (adminItemsSelectedCategory && !effectiveCategoryNames.includes(adminItemsSelectedCategory)) {
        setAdminItemsSelectedCategory(null)
      }

      saveDishesToStorage(storeId, effectiveDishes)

      if (effectiveManualCategories.length) {
        saveManualCategoriesToStorage(storeId, effectiveManualCategories)
      }

      const pendingCount = effectiveDishes.filter(item => item.dirty === true || item.syncState === 'Pending').length
      const failedCount = effectiveDishes.filter(item => item.syncState === 'Failed').length

      setLastSyncAt(nowMillis())
      setSyncOverviewState(
        failedCount > 0
          ? SyncOverviewStates.Failed
          : pendingSyncOperations.length || pendingCount > 0
            ? SyncOverviewStates.HasPending
            : SyncOverviewStates.Idle
      )
      setSyncErrorMessage(null)
    } catch (error) {
      ndjcTraceError('ERROR refreshAdminItemsData', error, {
        screen,
        isAdminLoggedIn,
        hasMerchantSession: Boolean(merchantSession?.accessToken),
        storeId
      })

      const localDishes = loadDishesFromStorage(storeId)
      const localManualCategories = loadManualCategoriesFromStorage(storeId)

      if (localDishes.length) {
        mergeDishEntities(localDishes)
        setDishes(localDishes)
        refreshFavoritesList(localDishes)
        setPendingSyncOperations(buildPendingDishSyncOperations(localDishes))
      }

      if (localManualCategories.length) {
        setCategories(manualCategoryNamesToCloudCategories(localManualCategories))
      }

      setSyncErrorMessage('Failed to refresh items from cloud.')
      setSyncOverviewState(SyncOverviewStates.Failed)
      setLastRetryOp(ShowcaseRetryOps.LoadFromCloud)
    } finally {
      ndjcTrace('EXIT refreshAdminItemsData', {
        screen,
        isAdminLoggedIn,
        storeId
      })

      adminItemsRefreshInFlightRef.current = false
    }
  }, [
    adminItemsSelectedCategory,
    adminItemsSearchQuery,
    adminItemsSortMode,
    adminItemsSortAscending,
    adminItemsFilterRecommended,
    adminItemsFilterHiddenOnly,
    adminItemsFilterDiscountOnly,
    adminItemsAppliedMinPrice,
    adminItemsAppliedMaxPrice,
    isAdminLoggedIn,
    merchantSession,
    pendingSyncOperations.length,
    repository,
    screen,
    storeId
  ])

  const refreshAdminCategoriesData = useCallback(async (): Promise<void> => {
    if (adminCategoriesRefreshInFlightRef.current) return

    adminCategoriesRefreshInFlightRef.current = true

    ndjcTrace('ENTER refreshAdminCategoriesData', {
      screen,
      isAdminLoggedIn,
      hasMerchantSession: Boolean(merchantSession?.accessToken),
      storeId
    })

    try {
      const validSession = isAdminLoggedIn || isMerchantLoggedInInStoreSession()
        ? await ensureValidMerchantSessionLoadedForCloud()
        : merchantSession

      if ((isAdminLoggedIn || isMerchantLoggedInInStoreSession()) && !validSession) {
        setSyncOverviewState(SyncOverviewStates.Failed)
        setSyncErrorMessage(merchantSessionEnsureFailureMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const localManualCategories = loadManualCategoriesFromStorage(storeId)

      const [serviceStatus, cloudCategories] = await Promise.all([
        repository.fetchStoreServiceStatus(storeId),
        repository.fetchCategories(storeId)
      ])

      const cloudManualCategories = cloudCategories
        .map(item => item.name.trim())
        .filter(Boolean)

      const effectiveManualCategories = cloudManualCategories.length
        ? cloudManualCategories
        : localManualCategories

      setCloudStatus(serviceStatus)
      setIsWriteAllowed(serviceStatus ? serviceStatus.isWriteAllowed : await repository.isStoreWriteAllowed(storeId))
      setCategories(cloudCategories.length ? cloudCategories : manualCategoryNamesToCloudCategories(effectiveManualCategories))

      if (effectiveManualCategories.length) {
        saveManualCategoriesToStorage(storeId, effectiveManualCategories)
      }

      if (selectedCategory && !effectiveManualCategories.includes(selectedCategory)) {
        setSelectedCategory(null)
      }

      setLastSyncAt(nowMillis())
      setSyncErrorMessage(null)
    } catch (error) {
      ndjcTraceError('ERROR refreshAdminCategoriesData', error, {
        screen,
        isAdminLoggedIn,
        hasMerchantSession: Boolean(merchantSession?.accessToken),
        storeId
      })

      const localManualCategories = loadManualCategoriesFromStorage(storeId)

      if (localManualCategories.length) {
        setCategories(manualCategoryNamesToCloudCategories(localManualCategories))
      }

      setSyncErrorMessage('Failed to refresh categories from cloud.')
      setSyncOverviewState(SyncOverviewStates.Failed)
      setLastRetryOp(ShowcaseRetryOps.LoadFromCloud)
    } finally {
      ndjcTrace('EXIT refreshAdminCategoriesData', {
        screen,
        isAdminLoggedIn,
        storeId
      })

      adminCategoriesRefreshInFlightRef.current = false
    }
  }, [
    isAdminLoggedIn,
    merchantSession,
    repository,
    screen,
    selectedCategory,
    storeId
  ])

  const refreshCloud = useCallback(async (): Promise<void> => {
    await tryLoadFromCloud(ShowcaseRetryOps.LoadFromCloud)
  }, [tryLoadFromCloud])

  const retryPendingSync = useCallback(async (): Promise<void> => {
    if (!pendingSyncOperations.length) {
      await loadFromCloud(ShowcaseRetryOps.RetryPendingSync)
      return
    }

    const validSession = await ensureValidMerchantSessionLoadedForCloud()

    if (!validSession) {
      setSyncOverviewState(SyncOverviewStates.Failed)
      setSyncErrorMessage(merchantSessionEnsureFailureMessage())
      showSnackbar(merchantSessionEnsureSnackbarMessage())
      return
    }

    setStoreMerchantSessionFromAuthSession(validSession)
    bindMerchantSessionToRepository(repository)
    setSyncOverviewState(SyncOverviewStates.Syncing)
    setSyncErrorMessage(null)
    setLastRetryOp(ShowcaseRetryOps.RetryPendingSync)

    for (const op of pendingSyncOperations) {
      try {
        if (op.type === 'dish-upsert') {
          const dish = getDishEntityById(op.dishId)
          if (!dish) {
            removePendingSync(op.id)
            continue
          }

          const uploadedImages: UploadedShowcaseImage[] = []

          for (const rawUrl of resolveDishImages(dish)) {
            const uploadedImage = await uploadDishImageIfNeeded(rawUrl)

            if (!uploadedImage) {
              throw new Error('Pending image upload failed.')
            }

            uploadedImages.push(uploadedImage)
          }

          const uploadedImageUrls = uploadedImages
            .map(item => item.url.trim())
            .filter(Boolean)
            .filter((item, index, all) => all.indexOf(item) === index)

          const nextDish: DemoDish = {
            ...dish,
            imageUri: uploadedImageUrls[0] || dish.imageUri || null,
            imageUrls: uploadedImageUrls.length ? uploadedImageUrls : dish.imageUrls,
            imageVariants: uploadedImages[0]?.variants ?? dish.imageVariants ?? null,
            updatedAt: nowMillis(),
            syncState: 'Pending',
            dirty: true
          }

          let ok = await repository.upsertDishFromDemo(storeId, nextDish)

          if (!ok) {
            const detail = [
              repository.lastUpsertCode != null ? `code=${repository.lastUpsertCode}` : '',
              repository.lastUpsertBody ? `body=${repository.lastUpsertBody.slice(0, 300)}` : ''
            ].filter(Boolean).join(' ')

            const retry = await retryMerchantCloudOperationAfterAuthRefresh({
              errorInput: new Error(detail || 'Cloud save failed.'),
              operation: () => repository.upsertDishFromDemo(storeId, nextDish),
              isSuccess: value => value
            })

            if (retry.status === 'handled_without_retry') {
              setSyncOverviewState(SyncOverviewStates.Failed)
              setSyncErrorMessage(merchantSessionEnsureFailureMessage())
              return
            }

            if (retry.status === 'retried_success') {
              ok = true
            }
          }

          if (ok) {
            const syncedDish: DemoDish = {
              ...nextDish,
              syncState: 'Synced',
              dirty: false
            }

            const nextDishes = sortedDishesForStorage([
              syncedDish,
              ...loadDishesFromStorage(storeId).filter(item => item.id !== syncedDish.id)
            ])

            saveDishesToStorage(storeId, nextDishes)
            mergeDishEntities(nextDishes)
            setDishes(nextDishes)
            refreshFavoritesList(nextDishes)
            setHomeDishIds(current => {
              if (syncedDish.isHidden) {
                return removeDishIdFromList(current, syncedDish.id)
              }

              if (current.includes(syncedDish.id)) {
                return current
              }

              return [syncedDish.id, ...current]
            })
            setAdminItemIds(current => {
              if (current.includes(syncedDish.id)) {
                return current
              }

              return [syncedDish.id, ...current]
            })
            removePendingSync(op.id)
          }
        }

        if (op.type === 'dish-delete') {
          const dishId = String(op.dishId || '').trim()

          if (!dishId) {
            removePendingSync(op.id)
            continue
          }

          let ok = await repository.deleteDishById(storeId, dishId)

          if (!ok) {
            const retry = await retryMerchantCloudOperationAfterAuthRefresh({
              errorInput: new Error('Cloud delete failed.'),
              operation: () => repository.deleteDishById(storeId, dishId),
              isSuccess: value => value
            })

            if (retry.status === 'handled_without_retry') {
              setSyncOverviewState(SyncOverviewStates.Failed)
              setSyncErrorMessage(merchantSessionEnsureFailureMessage())
              return
            }

            if (retry.status === 'retried_success') {
              ok = true
            }
          }

          if (ok) {
            removePendingSync(op.id)

            const nextDishes = dishes.filter(item => item.id !== dishId)

            removeDishEntityById(dishId)
            setAdminItemIds(current => removeDishIdFromList(current, dishId))
            setHomeDishIds(current => removeDishIdFromList(current, dishId))
            setDishes(nextDishes)
            saveDishesToStorage(storeId, nextDishes)
            refreshFavoritesList(nextDishes)

            setAdminSelectedDishIds(current => current.filter(id => id !== dishId))
            setSelectedDishId(current => current === dishId ? null : current)
            setEditDishId(current => current === dishId ? null : current)
            setAppointmentSourceDishId(current => current === dishId ? null : current)
          }
        }

        if (op.type === 'store-profile-upsert') {
          const payload = buildCloudStoreProfileFromDraft()
          let ok = await repository.upsertStoreProfile(payload)

          if (!ok) {
            const detail = [
              repository.lastUpsertCode != null ? `code=${repository.lastUpsertCode}` : '',
              repository.lastUpsertBody ? `body=${repository.lastUpsertBody.slice(0, 300)}` : ''
            ].filter(Boolean).join(' ')

            const retry = await retryMerchantCloudOperationAfterAuthRefresh({
              errorInput: new Error(detail || 'Cloud save failed.'),
              operation: () => repository.upsertStoreProfile(payload),
              isSuccess: value => value
            })

            if (retry.status === 'handled_without_retry') {
              setSyncOverviewState(SyncOverviewStates.Failed)
              setSyncErrorMessage(merchantSessionEnsureFailureMessage())
              return
            }

            if (retry.status === 'retried_success') {
              ok = true
            }
          }

          if (ok) {
            removePendingSync(op.id)
          }
        }

        if (op.type === 'announcement-upsert') {
          const draft = adminAnnouncementDraftItems.find(item => item.id === op.announcementId)
          if (!draft) {
            removePendingSync(op.id)
            continue
          }

          let saved = await repository.upsertAnnouncement({
            id: draft.id,
            storeId,
            coverUrl: draft.coverUrl,
            coverImageVariants: draft.coverImageVariants ?? null,
            body: draft.body,
            status: draft.status,
            updatedAt: draft.updatedAt || nowMillis(),
            viewCount: draft.viewCount
          })

          if (!saved) {
            const detail = [
              repository.lastAnnouncementUpsertCode != null ? `code=${repository.lastAnnouncementUpsertCode}` : '',
              repository.lastAnnouncementUpsertBody ? `body=${repository.lastAnnouncementUpsertBody.slice(0, 300)}` : ''
            ].filter(Boolean).join(' ')

            const retry = await retryMerchantCloudOperationAfterAuthRefresh({
              errorInput: new Error(detail || 'Cloud save failed.'),
              operation: () => repository.upsertAnnouncement({
                id: draft.id,
                storeId,
                coverUrl: draft.coverUrl,
                coverImageVariants: draft.coverImageVariants ?? null,
                body: draft.body,
                status: draft.status,
                updatedAt: draft.updatedAt || nowMillis(),
                viewCount: draft.viewCount
              }),
              isSuccess: value => Boolean(value)
            })

            if (retry.status === 'handled_without_retry') {
              setSyncOverviewState(SyncOverviewStates.Failed)
              setSyncErrorMessage(merchantSessionEnsureFailureMessage())
              return
            }

            if (retry.status === 'retried_success' && retry.value) {
              saved = retry.value
            }
          }

          if (saved) {
            removePendingSync(op.id)
          }
        }

        if (op.type === 'appointment-settings-upsert') {
          const payload = currentAppointmentSettingsForCloud()
          let ok = await repository.upsertAppointmentSettings(payload)

          if (!ok) {
            const detail = [
              repository.lastUpsertCode != null ? `code=${repository.lastUpsertCode}` : '',
              repository.lastUpsertBody ? `body=${repository.lastUpsertBody.slice(0, 300)}` : ''
            ].filter(Boolean).join(' ')

            const retry = await retryMerchantCloudOperationAfterAuthRefresh({
              errorInput: new Error(detail || 'Appointment settings save failed.'),
              operation: () => repository.upsertAppointmentSettings(payload),
              isSuccess: value => value
            })

            if (retry.status === 'handled_without_retry') {
              setSyncOverviewState(SyncOverviewStates.Failed)
              setSyncErrorMessage(merchantSessionEnsureFailureMessage())
              return
            }

            if (retry.status === 'retried_success') {
              ok = true
            }
          }

          if (ok) {
            removePendingSync(op.id)
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error || 'Retry sync failed.')
        setSyncErrorMessage(message)
        setSyncOverviewState(SyncOverviewStates.Failed)
        return
      }
    }

    setLastSyncAt(nowMillis())
    setSyncOverviewState(SyncOverviewStates.Idle)
    await loadFromCloud(ShowcaseRetryOps.RetryPendingSync)
  }, [
    adminAnnouncementDraftItems,
    appointmentAvailableHoursText,
    appointmentBookingWindowDays,
    appointmentClosedDays,
    appointmentMinimumNotice,
    appointmentSlotIntervalMinutes,
    appointmentsEnabled,
    dishes,
    loadFromCloud,
    merchantSession,
    pendingSyncOperations,
    repository,
    storeId
  ])

  useEffect(() => {
    if (!pendingSyncOperations.length) {
      return
    }

    setSyncOverviewState(current => {
      if (current === SyncOverviewStates.Syncing) {
        return current
      }

      return SyncOverviewStates.HasPending
    })
  }, [pendingSyncOperations.length])

  useEffect(() => {
    if (!isBrowser()) return

    const runPendingSyncIfPossible = (): void => {
      if (pendingSyncRetryInFlightRef.current) return
      if (!pendingSyncOperationsRef.current.length) return
      if (window.navigator.onLine === false) return

      pendingSyncRetryInFlightRef.current = true

      window.setTimeout(() => {
        void retryPendingSync()
          .catch(error => {
            const message = error instanceof Error ? error.message : String(error || 'Auto sync failed.')
            setSyncErrorMessage(message)
            setSyncOverviewState(SyncOverviewStates.Failed)
          })
          .finally(() => {
            pendingSyncRetryInFlightRef.current = false
          })
      }, 500)
    }

    const handleOnline = (): void => {
      runPendingSyncIfPossible()
    }

    const handleFocus = (): void => {
      runPendingSyncIfPossible()
    }

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        runPendingSyncIfPossible()
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    runPendingSyncIfPossible()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [retryPendingSync])

  async function signInMerchant(loginNameInput?: string, passwordInput?: string): Promise<void> {
    const loginName = (typeof loginNameInput === 'string' ? loginNameInput : loginUsernameDraft).trim()
    const password = (typeof passwordInput === 'string' ? passwordInput : loginPasswordDraft).trim()

    if (!loginName || !password) {
      setLoginError('Please enter account and password.')
      return
    }

    if (guardOfflineWriteOperation()) {
      setLoginError('You are offline. Please reconnect and try again.')
      return
    }

    setIsLoginLoading(true)
    setLoginError(null)

    try {
      const session = await repository.signInMerchant({
        loginName,
        password
      })

      if (!session) {
        setStoreMerchantSessionFromAuthSession(null)
        bindMerchantSessionToRepository(repository)
        setMerchantSession(null)
        setMerchantBindings([])
        setIsAdminLoggedIn(false)
        clearPersistedMerchantSession(false)
        setLoginError(merchantSignInFailureMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(session)
      bindMerchantSessionToRepository(repository)

      const binding = await repository.fetchMerchantBindingForStoreAndAuthUser(storeId, session.authUserId)

      if (!binding || !binding.authUserId || binding.authUserId.toLowerCase() !== session.authUserId.toLowerCase()) {
        const message = merchantBindingFailureMessage()

        await repository.signOutMerchant()
        setStoreMerchantSessionFromAuthSession(null)
        bindMerchantSessionToRepository(repository)
        setMerchantSession(null)
        setMerchantBindings([])
        setIsAdminLoggedIn(false)
        clearPersistedMerchantSession(false)
        setLoginError(message)
        return
      }

      const effectiveLoginName = binding.loginName?.trim() || session.loginName
      const effectiveSession: MerchantAuthSession = {
        ...session,
        loginName: effectiveLoginName
      }
      const routeAfterLogin = pendingPushRoute

      writeMerchantSession(effectiveSession)
      setMerchantSessionAndPersist(effectiveSession, loginRememberMeDraft)
      setMerchantBindings([binding])
      setAdminUsernameDraft(effectiveLoginName)
      setAdminPasswordDraft('')
      setLoginUsernameDraft(effectiveLoginName)
      setLoginPasswordDraft('')
      setLoginError(null)
      setSyncErrorMessage(null)
      setStatusMessage(null)
      setSyncOverviewState(SyncOverviewStates.Idle)
      setPreviousScreen(screen)
      setScreen('Admin')
      showSnackbar('Signed in.')

      void registerMerchantPushDevice('merchant-sign-in-success', true)

      if (routeAfterLogin && String(routeAfterLogin.openAs || '').trim().toLowerCase() === 'merchant') {
        setPendingPushRoute(null)
        await handlePushRoute(routeAfterLogin)
      }
    } catch (error) {
      setStoreMerchantSessionFromAuthSession(null)
      bindMerchantSessionToRepository(repository)
      setMerchantSession(null)
      setMerchantBindings([])
      setIsAdminLoggedIn(false)
      clearPersistedMerchantSession(false)
      setLoginError(merchantUnexpectedSignInFailureMessage(error))
    } finally {
      setIsLoginLoading(false)
    }
  }

  async function signOutMerchant(): Promise<void> {
    const preservedLoginName = getPreferredLoginNameForLoginScreen()

    try {
      await unregisterMerchantPushDevice('merchant-sign-out')
      await repository.signOutMerchant()
    } finally {
      setStoreMerchantSessionFromAuthSession(null)
      bindMerchantSessionToRepository(repository)
      setMerchantSession(null)
      setMerchantBindings([])
      setIsAdminLoggedIn(false)

      clearPersistedMerchantSession(true)
      writeRememberMe(false)

      setAdminUsernameDraft(preservedLoginName)
      setAdminPasswordDraft('')
      setLoginUsernameDraft(preservedLoginName)
      setLoginPasswordDraft('')
      setLoginRememberMeDraft(false)
      setLoginError(null)
      setIsLoginLoading(false)

      setChangePasswordCurrentDraft('')
      setChangePasswordNewDraft('')
      setChangePasswordConfirmDraft('')
      setChangePasswordError(null)
      setChangePasswordSuccess(null)
      setIsChangingPassword(false)

      setStatusMessage(null)
      setPreviousScreen(screen)
      setScreen(ShowcaseScreens.Login)
    }
  }

  async function updateMerchantPassword(): Promise<void> {
    const current = changePasswordCurrentDraft.trim()
    const next = changePasswordNewDraft.trim()
    const confirm = changePasswordConfirmDraft.trim()
    const loginName = merchantSession?.loginName?.trim()
      || adminUsernameDraft.trim()
      || loginUsernameDraft.trim()

    if (!current || !next || !confirm) {
      setChangePasswordError('Please fill all fields.')
      return
    }

    if (!loginName) {
      setChangePasswordError('Merchant session is missing.')
      return
    }

    if (next.length < 4) {
      setChangePasswordError('New password must be at least 4 characters.')
      return
    }

    if (next !== confirm) {
      setChangePasswordError('Passwords do not match.')
      return
    }

    if (guardOfflineWriteOperation()) {
      setChangePasswordError('You are offline. Please reconnect and try again.')
      setChangePasswordSuccess(null)
      return
    }

    setIsChangingPassword(true)
    setChangePasswordError(null)
    setChangePasswordSuccess(null)

    try {
      const reAuth = await repository.signInMerchant({
        loginName,
        password: current
      })

      if (!reAuth) {
        setChangePasswordError('Current password is incorrect.')
        return
      }

      setStoreMerchantSessionFromAuthSession(reAuth)
      bindMerchantSessionToRepository(repository)
      setMerchantSessionAndPersist(reAuth, loginRememberMeDraft)

      const ok = await repository.updateMerchantPassword({
        newPassword: next
      })

      if (!ok) {
        setChangePasswordError('Password update failed.')
        return
      }

      if (loginRememberMeDraft) {
        persistMerchantSession(reAuth, true)
      }

      setChangePasswordCurrentDraft('')
      setChangePasswordNewDraft('')
      setChangePasswordConfirmDraft('')
      setChangePasswordError(null)
      setChangePasswordSuccess('Password updated.')
      showSnackbar('Password updated.')
      backFromChangePassword()
    } catch {
      setChangePasswordError('Password update failed.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  async function updateMerchantLoginName(): Promise<void> {
    const nextLoginName = adminUsernameDraft.trim()
    if (!nextLoginName) {
      showSnackbar('Login name is required.')
      return
    }

    if (guardOfflineWriteOperation()) {
      return
    }

    const ok = await repository.updateMerchantLoginName({
      newLoginName: nextLoginName
    })

    if (!ok) {
      showSnackbar('Login name update failed.')
      return
    }

    setMerchantSession(current => {
      const next = updateMerchantLoginNameInSession(current, nextLoginName)
      if (!next) return current

      updateMerchantLoginNameInStoreSession(nextLoginName)
      writeMerchantSession(next)
      setStoreMerchantSessionFromAuthSession(next)
      bindMerchantSessionToRepository(repository)
      return next
    })
    setLoginUsernameDraft(nextLoginName)
    showSnackbar('Login name updated.')
  }

  async function adminLogout(): Promise<void> {
    await signOutMerchant()
  }

  async function loadAdminCredentials(): Promise<void> {
    const cachedLoginName = readLastMerchantLoginName()

    restoreMerchantSessionFromStorage()

    if (cachedLoginName) {
      setAdminUsernameDraft(cachedLoginName)
      setLoginUsernameDraft(cachedLoginName)
    }

    let authSession: Awaited<ReturnType<typeof getFreshShowcaseAuthSession>> | null = null

    try {
      authSession = await getFreshShowcaseAuthSession()
    } catch {
      setStoreMerchantSessionFromAuthSession(null)
      bindMerchantSessionToRepository(repository)
      setMerchantSession(null)
      setMerchantBindings([])
      setIsAdminLoggedIn(false)
      return
    }

    if (!authSession?.accessToken || !authSession.authUserId) {
      setStoreMerchantSessionFromAuthSession(null)
      bindMerchantSessionToRepository(repository)
      setMerchantSession(null)
      setMerchantBindings([])
      setIsAdminLoggedIn(false)
      return
    }

    const sourceSession: MerchantAuthSession = {
      accessToken: authSession.accessToken,
      refreshToken: null,
      authUserId: authSession.authUserId,
      loginName: authSession.email || cachedLoginName,
      expiresAt: authSession.expiresAt || 0
    }

    setStoreMerchantSessionFromAuthSession(sourceSession)
    bindMerchantSessionToRepository(repository)

    const binding = await repository.fetchMerchantBindingForStoreAndAuthUser(storeId, sourceSession.authUserId)

    if (!binding || !binding.authUserId || binding.authUserId.toLowerCase() !== sourceSession.authUserId.toLowerCase()) {
      setMerchantSession(null)
      setMerchantBindings([])
      setIsAdminLoggedIn(false)
      return
    }

    const effectiveLoginName = binding.loginName?.trim() || sourceSession.loginName
    const effectiveSession: MerchantAuthSession = {
      ...sourceSession,
      loginName: effectiveLoginName
    }

    writeMerchantSession(effectiveSession)
    setStoreMerchantSessionFromAuthSession(effectiveSession)
    bindMerchantSessionToRepository(repository)
    setMerchantSession(effectiveSession)
    setMerchantBindings([binding])
    setIsAdminLoggedIn(true)
    setAdminUsernameDraft(effectiveLoginName)
    setLoginUsernameDraft(effectiveLoginName)

    window.setTimeout(() => {
      void registerMerchantPushDevice('merchant-session-restored', true)
    }, 0)
  }

  async function saveAdminCredentialsFromDraft(): Promise<void> {
    await updateMerchantLoginName()
  }

  async function setAdminCredentials(usernameInput: string, passwordInput: string): Promise<void> {
    const username = usernameInput.trim()
    const password = passwordInput.trim()

    setAdminUsernameDraft(username)
    setAdminPasswordDraft(password)
    setLoginUsernameDraft(username)
    setLoginPasswordDraft(password)

    if (!username) {
      showSnackbar('Login name is required.')
      return
    }

    if (merchantSession?.accessToken) {
      await saveAdminCredentialsFromDraft()
      return
    }

    await tryAdminLogin(username, password)
  }

  async function validateRestoredMerchantSession(sessionInput: MerchantAuthSession | null): Promise<boolean> {
    if (!sessionInput?.accessToken || !sessionInput.authUserId) return false

    setStoreMerchantSessionFromAuthSession(sessionInput)
    bindMerchantSessionToRepository(repository)

    const binding = await repository.fetchMerchantBindingForStoreAndAuthUser(storeId, sessionInput.authUserId)
    if (!binding) {
      setSyncErrorMessage('Merchant binding check failed. Please try again.')
      setSyncOverviewState(SyncOverviewStates.Failed)
      return false
    }

    setMerchantBindings([binding])
    applyRefreshedMerchantSession(sessionInput)
    setAdminUsernameDraft(sessionInput.loginName)
    setLoginUsernameDraft(sessionInput.loginName)
    return true
  }

  type MerchantSessionEnsureResult =
    | {
        type: 'valid'
        session: MerchantAuthSession
      }
    | {
        type: 'temporary_failed'
        session: MerchantAuthSession
      }
    | {
        type: 'permission_failed'
      }
    | {
        type: 'expired'
      }

  async function ensureMerchantSessionLoadedForCloud(): Promise<MerchantSessionEnsureResult> {
    ndjcTrace('ENTER ensureMerchantSessionLoadedForCloud', {
      screen,
      isAdminLoggedIn,
      hasReactSession: Boolean(merchantSession?.accessToken),
      hasStoredSession: false,
      storeId
    })

    restoreMerchantSessionFromStorage()

    const storedSession = merchantSession?.accessToken
      ? merchantSession
      : null

    let authSession: Awaited<ReturnType<typeof getFreshShowcaseAuthSession>> | null = null

    try {
      authSession = await getFreshShowcaseAuthSession()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error || '')
      const status = typeof error === 'object' && error && 'status' in error
        ? Number((error as { status?: number | null }).status || 0)
        : 0

      ndjcTrace('ensureMerchantSessionLoadedForCloud failed to refresh SDK session', {
        screen,
        isAdminLoggedIn,
        message,
        status
      })

      if (
        storedSession?.accessToken &&
        storedSession.authUserId &&
        isTemporaryMerchantRefreshFailure(status, message)
      ) {
        handleTemporaryMerchantRefreshFailure(storedSession)

        return {
          type: 'temporary_failed',
          session: storedSession
        }
      }

      return {
        type: 'expired'
      }
    }

    if (!authSession?.accessToken || !authSession.authUserId) {
      ndjcTrace('EXIT ensureMerchantSessionLoadedForCloud no SDK auth session', {
        screen,
        isAdminLoggedIn
      })

      return {
        type: 'expired'
      }
    }

    const sourceSession: MerchantAuthSession = {
      accessToken: authSession.accessToken,
      refreshToken: null,
      authUserId: authSession.authUserId,
      loginName: authSession.email || storedSession?.loginName || loginUsernameDraft || adminUsernameDraft || '',
      expiresAt: authSession.expiresAt || storedSession?.expiresAt || 0
    }

    setStoreMerchantSessionFromAuthSession(sourceSession)
    bindMerchantSessionToRepository(repository)

    const binding = await repository.fetchMerchantBindingForStoreAndAuthUser(storeId, sourceSession.authUserId)

    if (!binding || !binding.authUserId || binding.authUserId.toLowerCase() !== sourceSession.authUserId.toLowerCase()) {
      const message = merchantBindingFailureMessage()

      ndjcTrace('ensureMerchantSessionLoadedForCloud binding failed', {
        screen,
        isAdminLoggedIn,
        authUserId: sourceSession.authUserId,
        bindingCode: repository.lastMerchantBindingCode,
        bindingBody: repository.lastMerchantBindingBody,
        message
      })

      setSyncOverviewState(SyncOverviewStates.Failed)
      setSyncErrorMessage(message)
      setStatusMessage(message)

      if (repository.lastMerchantBindingCode === 401) {
        return {
          type: 'expired'
        }
      }

      return {
        type: 'permission_failed'
      }
    }

    const effectiveLoginName = binding.loginName?.trim() || sourceSession.loginName
    const effectiveSession: MerchantAuthSession = {
      ...sourceSession,
      loginName: effectiveLoginName
    }

    setMerchantBindings([binding])
    applyRefreshedMerchantSession(effectiveSession)
    setAdminUsernameDraft(effectiveLoginName)
    setLoginUsernameDraft(effectiveLoginName)

    ndjcTrace('EXIT ensureMerchantSessionLoadedForCloud valid SDK-backed session', {
      screen,
      isAdminLoggedIn,
      authUserId: effectiveSession.authUserId,
      expiresAt: effectiveSession.expiresAt
    })

    return {
      type: 'valid',
      session: effectiveSession
    }
  }

  async function ensureValidMerchantSessionLoadedForCloud(): Promise<MerchantAuthSession | null> {
    const result = await ensureMerchantSessionLoadedForCloud()
    lastMerchantSessionEnsureResultRef.current = result.type

    if (result.type === 'valid') {
      return result.session
    }

    return null
  }

  function merchantSessionEnsureFailureMessage(): string {
    if (lastMerchantSessionEnsureResultRef.current === 'temporary_failed') {
      return 'Cloud sync failed. Please check your connection and try again.'
    }

    if (lastMerchantSessionEnsureResultRef.current === 'permission_failed') {
      return merchantBindingFailureMessage()
    }

    return 'Session expired. Please sign in again.'
  }

  function merchantSessionEnsureSnackbarMessage(): string {
    if (lastMerchantSessionEnsureResultRef.current === 'temporary_failed') {
      return 'Cloud sync failed. Please check your connection and try again.'
    }

    if (lastMerchantSessionEnsureResultRef.current === 'permission_failed') {
      return merchantBindingFailureMessage()
    }

    return 'Please sign in again.'
  }

  function repositoryErrorText(bodyInput: string | null | undefined): string {
    const body = String(bodyInput || '').trim()
    if (!body) return ''

    try {
      const parsed = JSON.parse(body) as Record<string, unknown>
      const error = String(parsed.error || '').trim()
      const message = String(parsed.message || '').trim()
      const msg = String(parsed.msg || '').trim()
      const details = String(parsed.details || '').trim()
      return error || message || msg || details || body
    } catch {
      return body
    }
  }

  function isNetworkFailureCode(codeInput: number | null | undefined): boolean {
    const code = codeInput || 0
    return code === 0 || code === 408 || code === 409 || code === 425 || code === 429 || code >= 500
  }

  function merchantSignInFailureMessage(): string {
    const code = repository.lastMerchantAuthCode
    const body = repository.lastMerchantAuthBody
    const detail = repositoryErrorText(body).toLowerCase()

    if (isNetworkFailureCode(code)) {
      if (
        detail.includes('supabase url is missing') ||
        detail.includes('supabase anon key is missing') ||
        detail.includes('missing_supabase_url') ||
        detail.includes('missing_supabase_anon_key')
      ) {
        return 'Cloud auth is not configured. Please check Supabase URL and anon key.'
      }

      return 'Network error. Please check your connection and try again.'
    }

    if (code === 400 || code === 401 || code === 403) {
      return 'Invalid account or password.'
    }

    return 'Sign in failed. Please try again.'
  }

  function merchantBindingFailureMessage(): string {
    const code = repository.lastMerchantBindingCode
    const body = repository.lastMerchantBindingBody
    const detail = repositoryErrorText(body).toLowerCase()

    if (code === 404 || detail.includes('not bound') || detail.includes('no rows') || detail.includes('0 rows')) {
      return 'This account is not bound to current store.'
    }

    if (code === 401) {
      return 'Session expired. Please sign in again.'
    }

    if (code === 403) {
      return 'Permission denied for current store.'
    }

    if (isNetworkFailureCode(code)) {
      return 'Network error. Please check your connection and try again.'
    }

    return 'This account is not bound to current store.'
  }

  function merchantUnexpectedSignInFailureMessage(errorInput: unknown): string {
    const message = errorInput instanceof Error ? errorInput.message : String(errorInput || '')

    if (!message.trim()) {
      return 'Sign in failed. Please try again.'
    }

    const lower = message.toLowerCase()

    if (
      lower.includes('failed to fetch') ||
      lower.includes('network error') ||
      lower.includes('networkerror') ||
      lower.includes('timeout') ||
      lower.includes('timed out') ||
      lower.includes('offline')
    ) {
      return 'Network error. Please check your connection and try again.'
    }

    return 'Sign in failed. Please try again.'
  }

  function isRecoverableMerchantAuthErrorMessage(messageInput: string): boolean {
    const lower = messageInput.toLowerCase()

    if (
      lower.includes('permission denied') ||
      lower.includes('row level security') ||
      lower.includes('rls') ||
      lower.includes('not bound') ||
      lower.includes('store not bound') ||
      lower.includes('merchant binding missing') ||
      lower.includes('forbidden') ||
      lower.includes('403')
    ) {
      return false
    }

    return lower.includes('jwt expired') ||
      lower.includes('jwt is expired') ||
      lower.includes('invalid jwt') ||
      lower.includes('expired jwt') ||
      lower.includes('"exp" claim timestamp check failed') ||
      lower.includes('exp claim timestamp check failed') ||
      lower.includes('access token expired') ||
      lower.includes('token expired') ||
      lower.includes('unauthorized') ||
      lower.includes('not authenticated') ||
      lower.includes('missing access token') ||
      lower.includes('missing auth session') ||
      lower.includes('401')
  }

  function isUnrecoverableMerchantRefreshErrorMessage(messageInput: string): boolean {
    const lower = messageInput.toLowerCase()

    return lower.includes('invalid_grant') ||
      lower.includes('refresh token not found') ||
      lower.includes('invalid refresh token') ||
      lower.includes('refresh token expired') ||
      lower.includes('session not found') ||
      lower.includes('session_not_found') ||
      lower.includes('user not found') ||
      lower.includes('no refresh token') ||
      lower.includes('missing refresh token')
  }

  function isTemporaryMerchantRefreshFailure(
    codeInput: number | null | undefined,
    bodyInput: string | null | undefined
  ): boolean {
    const code = codeInput || 0
    const lower = String(bodyInput || '').toLowerCase()

    if (isUnrecoverableMerchantRefreshErrorMessage(lower)) {
      return false
    }

    if (code === 0) {
      return true
    }

    if (code === 408 || code === 409 || code === 425 || code === 429) {
      return true
    }

    if (code >= 500 && code <= 599) {
      return true
    }

    return lower.includes('failed to fetch') ||
      lower.includes('network error') ||
      lower.includes('networkerror') ||
      lower.includes('timeout') ||
      lower.includes('timed out') ||
      lower.includes('abort') ||
      lower.includes('aborted') ||
      lower.includes('offline') ||
      lower.includes('temporarily unavailable') ||
      lower.includes('service unavailable') ||
      lower.includes('gateway timeout')
  }

  type MerchantForceRefreshResult = 'refreshed' | 'expired' | 'temporary_failed' | 'unknown_failed'

  function handleTemporaryMerchantRefreshFailure(sourceSession: MerchantAuthSession): void {
    const refreshCode = repository.lastMerchantAuthCode
    const refreshBody = repository.lastMerchantAuthBody
    const syncMessage = 'Cloud sync failed. Please check your connection and try again.'

    ndjcTrace('handleTemporaryMerchantRefreshFailure keep merchant session', {
      screen,
      isAdminLoggedIn,
      authUserId: sourceSession.authUserId,
      expiresAt: sourceSession.expiresAt,
      refreshCode,
      refreshBody
    })

    setStoreMerchantSessionFromAuthSession(sourceSession)
    bindMerchantSessionToRepository(repository)
    setSyncOverviewState(SyncOverviewStates.Failed)
    setSyncErrorMessage(syncMessage)
    setStatusMessage(syncMessage)
    showSnackbar(syncMessage)
  }

  async function tryReloadSdkMerchantSessionForAuthError(): Promise<MerchantForceRefreshResult> {
    restoreMerchantSessionFromStorage()

    const sourceSession = merchantSession?.accessToken
      ? merchantSession
      : null

    try {
      const authSession = await refreshShowcaseAuthSession()

      if (!authSession?.accessToken || !authSession.authUserId) {
        return 'expired'
      }

      if (
        sourceSession?.authUserId &&
        sourceSession.authUserId.toLowerCase() !== authSession.authUserId.toLowerCase()
      ) {
        return 'expired'
      }

      const nextSession: MerchantAuthSession = {
        accessToken: authSession.accessToken,
        refreshToken: null,
        authUserId: authSession.authUserId,
        loginName: authSession.email || sourceSession?.loginName || loginUsernameDraft || adminUsernameDraft || '',
        expiresAt: authSession.expiresAt || sourceSession?.expiresAt || 0
      }

      applyRefreshedMerchantSession(nextSession)
      return 'refreshed'
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error || '')
      const status = typeof error === 'object' && error && 'status' in error
        ? Number((error as { status?: number | null }).status || 0)
        : 0

      if (sourceSession?.accessToken && isTemporaryMerchantRefreshFailure(status, message)) {
        handleTemporaryMerchantRefreshFailure(sourceSession)
        return 'temporary_failed'
      }

      return 'expired'
    }
  }
  async function refreshMerchantSessionForPwaResume(): Promise<void> {
    if (!isBrowser()) return

    const currentSession = merchantSessionRef.current

    if (!currentSession?.accessToken && !isMerchantLoggedInInStoreSession()) {
      return
    }

    try {
      const authSession = await getFreshShowcaseAuthSession()

      if (!authSession?.accessToken || !authSession.authUserId) {
        await handleMerchantSessionExpired()
        return
      }

      if (
        currentSession?.authUserId &&
        currentSession.authUserId.toLowerCase() !== authSession.authUserId.toLowerCase()
      ) {
        await handleMerchantSessionExpired()
        return
      }

      const nextSession: MerchantAuthSession = {
        accessToken: authSession.accessToken,
        refreshToken: null,
        authUserId: authSession.authUserId,
        loginName: authSession.email || currentSession?.loginName || loginUsernameDraft || adminUsernameDraft || '',
        expiresAt: authSession.expiresAt || currentSession?.expiresAt || 0
      }

      applyRefreshedMerchantSession(nextSession)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error || '')
      const status = typeof error === 'object' && error && 'status' in error
        ? Number((error as { status?: number | null }).status || 0)
        : 0

      if (isUnrecoverableMerchantRefreshErrorMessage(message)) {
        await handleMerchantSessionExpired()
        return
      }

      if (isTemporaryMerchantRefreshFailure(status, message)) {
        ndjcTrace('refreshMerchantSessionForPwaResume temporary failure', {
          screen,
          isAdminLoggedIn,
          status,
          message
        })
        return
      }

      await handleMerchantSessionExpired()
    }
  }
  async function handleMerchantAuthExpiredIfNeeded(errorInput?: unknown): Promise<boolean> {
    const message = errorInput instanceof Error ? errorInput.message : String(errorInput || '')

    ndjcTrace('ENTER handleMerchantAuthExpiredIfNeeded', {
      screen,
      isAdminLoggedIn,
      message
    })

    if (isUnrecoverableMerchantRefreshErrorMessage(message)) {
      ndjcTrace('handleMerchantAuthExpiredIfNeeded unrecoverable refresh error', {
        message
      })

      await handleMerchantSessionExpired()
      return true
    }

    if (!isRecoverableMerchantAuthErrorMessage(message)) {
      ndjcTrace('handleMerchantAuthExpiredIfNeeded not auth error', {
        message
      })

      return false
    }

    const refreshResult = await tryReloadSdkMerchantSessionForAuthError()

    ndjcTrace('handleMerchantAuthExpiredIfNeeded force refresh result', {
      refreshResult,
      message,
      refreshCode: repository.lastMerchantAuthCode,
      refreshBody: repository.lastMerchantAuthBody
    })

    if (refreshResult === 'refreshed') {
      return true
    }

    if (refreshResult === 'temporary_failed') {
      return true
    }

    if (refreshResult === 'expired') {
      await handleMerchantSessionExpired()
      return true
    }

    return false
  }

  async function retryMerchantCloudOperationAfterAuthRefresh<T>(input: {
    errorInput: unknown
    operation: () => Promise<T>
    isSuccess: (value: T) => boolean
  }): Promise<{
    status: 'not_auth_error' | 'handled_without_retry' | 'retried_success' | 'retried_failed'
    value: T | null
  }> {
    const message = input.errorInput instanceof Error
      ? input.errorInput.message
      : String(input.errorInput || '')

    if (isUnrecoverableMerchantRefreshErrorMessage(message)) {
      await handleMerchantSessionExpired()

      return {
        status: 'handled_without_retry',
        value: null
      }
    }

    if (!isRecoverableMerchantAuthErrorMessage(message)) {
      return {
        status: 'not_auth_error',
        value: null
      }
    }

    const refreshResult = await tryReloadSdkMerchantSessionForAuthError()

    ndjcTrace('retryMerchantCloudOperationAfterAuthRefresh force refresh result', {
      refreshResult,
      message,
      refreshCode: repository.lastMerchantAuthCode,
      refreshBody: repository.lastMerchantAuthBody
    })

    if (refreshResult === 'refreshed') {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        return {
          status: 'handled_without_retry',
          value: null
        }
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const retryValue = await input.operation()

      return {
        status: input.isSuccess(retryValue) ? 'retried_success' : 'retried_failed',
        value: retryValue
      }
    }

    if (refreshResult === 'temporary_failed') {
      return {
        status: 'handled_without_retry',
        value: null
      }
    }

    if (refreshResult === 'expired') {
      await handleMerchantSessionExpired()

      return {
        status: 'handled_without_retry',
        value: null
      }
    }

    return {
      status: 'not_auth_error',
      value: null
    }
  }

  async function handleMerchantSessionExpired(): Promise<void> {
    ndjcTrace('ENTER handleMerchantSessionExpired', {
      screen,
      isAdminLoggedIn,
      hasMerchantSession: Boolean(merchantSession?.accessToken),
      stack: new Error('handleMerchantSessionExpired stack').stack || ''
    })

    const message = 'Session expired. Please sign in again.'
    const preservedLoginName = getPreferredLoginNameForLoginScreen()

    clearStoreMerchantSession()
    bindMerchantSessionToRepository(repository)
    setStoreMerchantSessionFromAuthSession(null)
    setMerchantSession(null)
    setIsAdminLoggedIn(false)
    setMerchantBindings([])
    clearStoredMerchantSession()
    setLoginUsernameDraft(preservedLoginName)
    setAdminUsernameDraft(preservedLoginName)
    setLoginPasswordDraft('')
    setAdminPasswordDraft('')
    setLoginRememberMeDraft(false)
    setLoginError(message)
    setIsLoginLoading(false)
    setChangePasswordCurrentDraft('')
    setChangePasswordNewDraft('')
    setChangePasswordConfirmDraft('')
    setChangePasswordError(null)
    setChangePasswordSuccess(null)
    setIsChangingPassword(false)
    setSyncErrorMessage(message)
    setSyncOverviewState(SyncOverviewStates.Failed)
    setStatusMessage(message)
    setPreviousScreen(screen)
    setScreen(ShowcaseScreens.Login)
    showSnackbar(message)
  }

  async function handleMerchantSessionExpiredIfRefreshUnrecoverable(): Promise<void> {
    await handleMerchantSessionExpired()
  }

  async function handleMerchantDeleteExpiredIfNeeded(errorInput?: unknown): Promise<boolean> {
    return handleMerchantAuthExpiredIfNeeded(errorInput)
  }

  async function handleMerchantDishImageUploadExpiredIfNeeded(errorInput?: unknown): Promise<boolean> {
    return handleMerchantAuthExpiredIfNeeded(errorInput)
  }

  async function handleMerchantStoreImageUploadExpiredIfNeeded(errorInput?: unknown): Promise<boolean> {
    return handleMerchantAuthExpiredIfNeeded(errorInput)
  }

  async function refreshCloudServiceStatus(): Promise<CloudStoreServiceStatus | null> {
    const status = await repository.fetchStoreServiceStatus(storeId)
    setCloudStatus(status)
    setIsWriteAllowed(status ? status.isWriteAllowed : await repository.isStoreWriteAllowed(storeId))
    return status
  }

  async function refreshAdminHomeCloudState(showStatusMessage = false): Promise<void> {
    if (!isAdminLoggedIn && !isMerchantLoggedInInStoreSession()) return
    if (adminHomeRefreshInFlightRef.current) return

    adminHomeRefreshInFlightRef.current = true
    setSyncOverviewState(SyncOverviewStates.Syncing)
    setSyncErrorMessage(null)

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()
      if (!validSession) {
        setSyncOverviewState(SyncOverviewStates.Failed)
        setSyncErrorMessage(merchantSessionEnsureFailureMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const traceId = `VM${Date.now()}_${storeId.slice(-4)}`

      const [
        serviceStatus,
        merchantAppointments,
        merchantThreads
      ] = await Promise.all([
        repository.fetchStoreServiceStatus(storeId),
        repository.fetchAppointmentRequestsForMerchant(storeId).catch(appointmentError => {
          console.warn('[AdminHome] appointment refresh failed', appointmentError)
          return [] as CloudAppointmentRequest[]
        }),
        (async () => {
          try {
            await chatRepository.syncMerchantThreadMetaFromCloud(storeId, traceId)
            return fetchLatestMerchantThreadsForMerge(traceId)
          } catch (chatError) {
            console.warn('[AdminHome] chat thread refresh failed', chatError)
            return merchantChatThreads
          }
        })()
      ])

      const writeAllowed = serviceStatus
        ? serviceStatus.isWriteAllowed
        : await repository.isStoreWriteAllowed(storeId)

      const sortedAppointments = [...merchantAppointments].sort((left, right) => {
        return (right.createdAt || 0) - (left.createdAt || 0)
      })

      setCloudStatus(serviceStatus)
      setIsWriteAllowed(writeAllowed)
      setAppointmentRequests(sortedAppointments)
      setMerchantChatThreads(current => mergeMerchantThreadSummariesByConversationId(
        current,
        merchantThreads
      ))
      setLastSyncAt(nowMillis())
      setSyncOverviewState(SyncOverviewStates.Idle)
      setSyncErrorMessage(null)

      if (showStatusMessage) {
        setStatusMessage(null)
      }
    } catch (error) {
      const handled = await handleMerchantAuthExpiredIfNeeded(error)
      if (handled) return

      const message = error instanceof Error ? error.message : 'Admin refresh failed.'

      setSyncOverviewState(SyncOverviewStates.Failed)
      setSyncErrorMessage(message)

      if (showStatusMessage) {
        setStatusMessage(message)
      }
    } finally {
      adminHomeRefreshInFlightRef.current = false
    }
  }

  async function tryLoadFromCloud(reason: ShowcaseRetryOp = ShowcaseRetryOps.LoadFromCloud): Promise<void> {
    ndjcTrace('ENTER tryLoadFromCloud', {
      reason,
      screen,
      isAdminLoggedIn,
      hasMerchantSession: Boolean(merchantSession?.accessToken),
      storeId
    })

    try {
      if (isAdminLoggedIn || isMerchantLoggedInInStoreSession()) {
        const validSession = await ensureValidMerchantSessionLoadedForCloud()

        if (!validSession) {
          setSyncOverviewState(SyncOverviewStates.Failed)
          setSyncErrorMessage(merchantSessionEnsureFailureMessage())
          return
        }

        setStoreMerchantSessionFromAuthSession(validSession)
        bindMerchantSessionToRepository(repository)
      }

      await loadFromCloud(reason)

      ndjcTrace('EXIT tryLoadFromCloud', {
        reason,
        screen,
        isAdminLoggedIn
      })
    } catch (error) {
      ndjcTraceError('ERROR tryLoadFromCloud', error, {
        reason,
        screen,
        isAdminLoggedIn
      })
      const handled = isAdminLoggedIn
        ? await handleMerchantAuthExpiredIfNeeded(error)
        : false
      if (handled) return

      const message = error instanceof Error ? error.message : String(error || 'Cloud load failed.')
      setSyncErrorMessage(message)
      setSyncOverviewState(SyncOverviewStates.Failed)
      setStatusMessage(message)
    }
  }

  async function loadFromSources(): Promise<void> {
    ndjcTrace('ENTER loadFromSources', {
      screen,
      isAdminLoggedIn,
      hasMerchantSession: Boolean(merchantSession?.accessToken),
      storeId
    })

    const localDishes = loadDishesFromStorage(storeId)
    const localManualCategories = loadManualCategoriesFromStorage(storeId)
    const localAnnouncements = loadPublishedAnnouncementsLocally(storeId)

    const effectiveLocalDishes = localDishes.filter(item => isAdminLoggedIn || !item.isHidden)

    if (effectiveLocalDishes.length) {
      mergeDishEntities(effectiveLocalDishes)
      setHomeDishIds(dishIdsFromItems(effectiveLocalDishes))

      if (isAdminLoggedIn) {
        setAdminItemIds(dishIdsFromItems(effectiveLocalDishes))
      }

      setDishes(effectiveLocalDishes)
      refreshFavoritesList(effectiveLocalDishes)
      setPendingSyncOperations(buildPendingDishSyncOperations(effectiveLocalDishes))
    }

    if (localManualCategories.length) {
      setCategories(manualCategoryNamesToCloudCategories(localManualCategories))
    }

    const effectiveLocalCategoryNames = localManualCategories
      .map(item => item.trim())
      .filter(Boolean)

    if (selectedCategory && effectiveLocalCategoryNames.length && !effectiveLocalCategoryNames.includes(selectedCategory)) {
      setSelectedCategory(null)
    }

    if (localAnnouncements.length) {
      setAnnouncements(localAnnouncements)
    }

    await loadAdminCredentials()
    await refreshHomeMainData()

    ndjcTrace('EXIT loadFromSources', {
      screen,
      isAdminLoggedIn,
      localDishesCount: localDishes.length,
      localAnnouncementsCount: localAnnouncements.length
    })
  }

  async function retryLast(): Promise<void> {
    if (lastRetryOp === ShowcaseRetryOps.RetryPendingSync) {
      await retryPendingSync()
      return
    }

    if (lastRetryOp === ShowcaseRetryOps.RefreshStoreProfile) {
      await refreshStoreProfile()
      return
    }

    if (lastRetryOp === ShowcaseRetryOps.LoadFromCloud || lastRetryOp == null) {
      await loadFromSources()
      return
    }

    await tryLoadFromCloud(lastRetryOp)
  }

  function clearSyncError(): void {
    setSyncErrorMessage(null)
    setStatusMessage(null)

    if (pendingSyncOperations.length) {
      setSyncOverviewState(SyncOverviewStates.HasPending)
      return
    }

    setSyncOverviewState(SyncOverviewStates.Idle)
  }

  function appointmentStatusToCloud(valueInput: string): string {
    return appointmentsStatusToCloud(valueInput)
  }

  function buildPendingFromSelectedDish(): ShowcaseChatProductShare | null {
    if (!selectedDish) return null

    return buildChatProductShareFromDish(selectedDish)
  }

  function buildPendingAppointmentFromCard(item: ShowcaseAppointmentCard): ShowcaseChatAppointmentShare {
    const linkedItemAvailable = Boolean(item.itemAvailable && item.sourceDishId)

    return {
      appointmentId: item.id,
      title: item.serviceTitle || 'General appointment',
      preferredDate: item.preferredDate,
      preferredTime: item.preferredTime,
      statusLabel: item.statusLabel,
      imageUrl: item.imageUrl,
      imageVariants: item.imageVariants ?? createRemoteOnlyShowcaseImageVariants(item.imageUrl),
      customerName: item.customerName || 'Customer',
      customerContact: item.customerContact || '',
      note: item.note || '',
      sourceDishId: item.sourceDishId,
      priceText: item.priceText,
      originalPriceText: item.originalPriceText,
      discountPriceText: item.discountPriceText,
      categoryText: item.categoryText,
      itemAvailable: linkedItemAvailable,
      createdAtText: item.createdAtText
    }
  }

  function clearAdminItemsSearchQuery(): void {
    setAdminItemsSearchQuery('')
  }

  function clearAnnouncementDraftLocalImages(): void {
    clearAdminAnnouncementDraftLocalImages(storeId)
  }

  function setChatCameraError(message: string | null): void {
    setChatStatusMessage(message)
  }

  function clearChatCameraError(): void {
    setChatStatusMessage(null)
  }

  function clearMerchantConversationLocalArtifacts(conversationIdInput: string): void {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return

    const draft = readChatDraft(storeId, conversationId)

    draft?.draftImageUrls
      ?.map(item => item.trim())
      .filter(Boolean)
      .forEach(url => {
        deleteAppOwnedLocalFileUri(storeId, url)
      })

    clearChatDraft(storeId, conversationId)

    if (activeConversationId === conversationId) {
      const domainState = clearLocalChatState(buildCurrentChatDomainState())

      setChatMessages([])
      setChatDraft('')
      setChatDraftImageUrls([])
      setChatPendingProduct(null)
      setChatPendingAppointment(null)
      setChatQuotedMessageId(null)
      setChatSelectedMessageIds(domainState.selectedIds)
      setChatFindResultIds(domainState.findMatchIds)
      setChatFocusedMessageId(domainState.findFocusedId || domainState.scrollToMessageId || null)
      setChatStatusMessage(domainState.errorMessage)
      setChatSearchResults([])
      setChatMediaItems([])
      setChatMediaPreviewUrls([])
      setChatMediaPreviewIndex(0)
      setActiveConversation(null)
      setActiveConversationId(repository.buildConversationId(storeId, clientId))
      setRuntimeActiveConversationId(repository.buildConversationId(storeId, clientId))
      setRuntimeChatVisible(false)
    }

    deletePendingChatCameraFile(storeId)
  }

  function clearPendingChatCameraState(): void {
    deletePendingChatCameraFile(storeId)
    clearChatCameraError()
  }

  function clearPendingProductShare(): void {
    setPendingProductForChat(null)
  }

  async function confirmPendingDeleteCategory(): Promise<void> {
    await confirmDeleteCategory()
  }

  function consumePushAnnouncementTarget(): void {
    setPushTargetAnnouncementId(null)
    setPendingPushRoute(null)
  }

  function setChatMode(nextMode: ChatMode): void {
    chatModeRef.current = nextMode
    setChatModeState(nextMode)
  }

  function currentChatRole(): 'merchant' | 'user' {
    return chatModeRef.current === 'Merchant' ? 'merchant' : 'user'
  }

  function currentChatPerspectiveRole(): 'merchant' | 'client' {
    return chatModeRef.current === 'Merchant' ? 'merchant' : 'client'
  }

  function deleteAppOwnedLocalFileUriString(value: string): void {
    deleteAppOwnedLocalFileUri(storeId, value)
  }

  function deriveCategories(items: DemoDish[] = dishes): string[] {
    return deriveCategoriesFromModels(items)
  }

  function deriveDetailImages(dish: DemoDish | null = selectedDish): string[] {
    return resolveDishImages(dish)
  }

  function discardEditDraftAndGoHome(): void {
    clearEditDraftLocalImages(storeId)

    setEditDishId(null)
    setEditDishImageUrls([])
    setSelectedDishId(null)
    setEditValidationError(null)
    setIsSavingEditDish(false)
    setIsBlockingEditDish(false)
    setStatusMessage(null)
    setPreviousScreen(screen)
    setScreen('Home')
  }

  function dismissCategoryDeleteDialogs(): void {
    setAdminPendingDeleteCategory(null)
    setAdminCannotDeleteCategory(null)
  }

  function dismissEditValidationError(): void {
    setEditValidationError(null)
  }

  async function ensureAnnouncementRegistrationOnHome(): Promise<void> {
    await refreshHomeBadgeData()
  }

  function ensureChatRealtimeStarted(): void {
    startChatEntryPolling()

    if (screen === 'Chat') {
      startChatPolling()
      startChatDbObserve()
    }
  }

  async function ensureLoaded(): Promise<void> {
    if (hasLoadedInitialCloudRef.current) {
      if (currentScreenRef.current === ShowcaseScreens.Home) {
        await refreshHomeMainData()
        void refreshHomeBadgeData()
        return
      }

      await tryLoadFromCloud(ShowcaseRetryOps.LoadFromCloud)
      return
    }

    hasLoadedInitialCloudRef.current = true
    await loadFromSources()
  }

  function favoriteSnapshotFromDish(dish: DemoDish): ShowcaseFavoriteSnapshot {
    const discount = Number(dish.discountPrice)
    const hasValidDiscount = Number.isFinite(discount) && discount > 0
    const originalPriceText = formatUsd(dish.originalPrice)
    const discountPriceText = hasValidDiscount ? formatUsd(discount) : null

    return {
      dishId: dish.id,
      title: getDishTitle(dish).trim() || 'Saved item',
      category: dish.category?.trim() || null,
      originalPriceText,
      discountPriceText,
      priceText: discountPriceText || originalPriceText,
      imageUrl: selectDishImageUrl(dish, 'list'),
      imageVariants: dish.imageVariants ?? null
    }
  }

  function favoritePriceValueFromText(valueInput: string | null | undefined): number {
    const normalized = String(valueInput || '')
      .replace(/[^0-9.-]/g, '')
      .trim()

    const value = Number(normalized)

    return Number.isFinite(value) ? value : 0
  }

  function formatHHmm(valueInput: string | number | Date | null | undefined): string {
    if (valueInput == null) return ''

    if (valueInput instanceof Date) {
      return valueInput.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    if (typeof valueInput === 'number') {
      return new Date(valueInput).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const value = valueInput.trim()
    if (!value) return ''

    const minutes = appointmentTimeToMinutes(value)
    if (minutes != null) return appointmentMinutesToTime(minutes)

    const parsed = Date.parse(value)
    if (Number.isFinite(parsed)) {
      return new Date(parsed).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return value
  }

  function formatYmdAmpmHm(valueInput: string | number | Date | null | undefined): string {
    return formatShowcaseDateTime(valueInput)
  }

  function hasUnsavedEditDraft(): boolean {
    return Boolean(
      editDishName.trim() ||
      editDishDescription.trim() ||
      editDishCategory ||
      editDishOriginalPrice.trim() ||
      editDishDiscountPrice.trim() ||
      editDishImageUrls.length
    )
  }

  function isFavorite(dishIdInput: string): boolean {
    const dishId = dishIdInput.trim()
    if (!dishId) return false
    return favoriteIds.includes(dishId)
  }

  function isReadableNonEmptyContentUri(valueInput: string): boolean {
    const value = valueInput.trim()
    if (!value) return false

    return (
      value.startsWith('content:') ||
      value.startsWith('file:') ||
      value.startsWith('blob:') ||
      value.startsWith('data:image/') ||
      value.startsWith('http://') ||
      value.startsWith('https://')
    )
  }

  function jumpToMessage(messageIdInput: string): void {
    const messageId = messageIdInput.trim()
    if (!messageId) return

    const domainState = jumpToMessageInDomain(buildCurrentChatDomainState(), messageId)
    applyChatDomainInteractionState(domainState)
    setScreen('Chat')
  }

  function mapCloudPlanType(valueInput: string | null | undefined): string {
    const value = String(valueInput || '').trim().toLowerCase()

    if (value === 'paid') return 'Paid'
    if (value === 'trial') return 'Trial'
    if (value === 'free') return 'Free'

    return valueInput ? String(valueInput) : 'Trial'
  }

  function mapCloudServiceStatus(valueInput: string | null | undefined): string {
    const value = String(valueInput || '').trim().toLowerCase()

    if (value === 'active') return 'Active'
    if (value === 'read_only') return 'Read only'
    if (value === 'expired') return 'Expired'
    if (value === 'deleted') return 'Deleted'

    return valueInput ? String(valueInput) : 'Active'
  }

  async function merchantChatListDeleteThread(conversationId: string): Promise<void> {
    await deleteMerchantThread(conversationId)
  }

  async function merchantChatListRenameThread(conversationId: string, title: string): Promise<void> {
    await renameMerchantThread(conversationId, title)
  }

  async function merchantChatListTogglePin(conversationId: string, pinned: boolean): Promise<void> {
    await toggleMerchantThreadPin(conversationId, pinned)
  }

  function mergeRemoteAndLocal(remoteItems: DemoDish[], localItems: DemoDish[]): DemoDish[] {
    const map = new Map<string, DemoDish>()

    remoteItems.forEach(item => {
      map.set(item.id, {
        ...item,
        syncState: 'Synced',
        dirty: false
      })
    })

    localItems.forEach(item => {
      const shouldKeepLocal =
        item.dirty === true ||
        item.syncState === 'Pending' ||
        item.syncState === 'Failed'

      if (shouldKeepLocal) {
        map.set(item.id, item)
        return
      }

      if (!map.has(item.id)) {
        map.set(item.id, item)
      }
    })

    return Array.from(map.values()).sort((left, right) => {
      const leftPending = left.dirty === true || left.syncState === 'Pending' || left.syncState === 'Failed'
      const rightPending = right.dirty === true || right.syncState === 'Pending' || right.syncState === 'Failed'

      if (leftPending !== rightPending) {
        return leftPending ? -1 : 1
      }

      return (right.updatedAt || 0) - (left.updatedAt || 0)
    })
  }

  function moneyTrim2(valueInput: number | string | null | undefined): string {
    const value = typeof valueInput === 'number'
      ? valueInput
      : Number(String(valueInput || '').trim())

    if (!Number.isFinite(value)) return ''

    return value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')
  }

  function onAdminItemsApplyPriceRange(): void {
    const min = parseHomePriceDraft(adminItemsPriceMinDraft)
    const max = parseHomePriceDraft(adminItemsPriceMaxDraft)
    const nextMin = min != null && max != null && min > max ? max : min
    const nextMax = min != null && max != null && min > max ? min : max

    setAdminItemsAppliedMinPrice(nextMin)
    setAdminItemsAppliedMaxPrice(nextMax)

    void refreshAdminItemsFilteredFirstPage(currentAdminItemsCloudFilters({
      minPrice: nextMin,
      maxPrice: nextMax
    }))
  }

  function onAdminItemsClearPriceRange(): void {
    setAdminItemsPriceMinDraft('')
    setAdminItemsPriceMaxDraft('')
    setAdminItemsAppliedMinPrice(null)
    setAdminItemsAppliedMaxPrice(null)

    void refreshAdminItemsFilteredFirstPage(currentAdminItemsCloudFilters({
      minPrice: null,
      maxPrice: null
    }))
  }

  function onAdminItemsFilterDiscountOnlyChange(_value: boolean): void {
    return
  }

  function onAdminItemsFilterHiddenOnlyChange(_value: boolean): void {
    return
  }

  function onAdminItemsFilterRecommendedChange(_value: boolean): void {
    return
  }
  function onAdminItemsApplyFilters(value: {
    recommendedOnly: boolean
    hiddenOnly: boolean
    discountOnly: boolean
    minPriceDraft: string
    maxPriceDraft: string
  }): void {
    const min = parseHomePriceDraft(value.minPriceDraft)
    const max = parseHomePriceDraft(value.maxPriceDraft)
    const nextMin = min != null && max != null && min > max ? max : min
    const nextMax = min != null && max != null && min > max ? min : max

    setAdminItemsFilterRecommended(value.recommendedOnly)
    setAdminItemsFilterHiddenOnly(value.hiddenOnly)
    setAdminItemsFilterDiscountOnly(value.discountOnly)
    setAdminItemsPriceMinDraft(value.minPriceDraft)
    setAdminItemsPriceMaxDraft(value.maxPriceDraft)
    setAdminItemsAppliedMinPrice(nextMin)
    setAdminItemsAppliedMaxPrice(nextMax)

    void refreshAdminItemsFilteredFirstPage(currentAdminItemsCloudFilters({
      recommendedOnly: value.recommendedOnly,
      hiddenOnly: value.hiddenOnly,
      onSaleOnly: value.discountOnly,
      minPrice: nextMin,
      maxPrice: nextMax
    }))
  }
  function onAdminItemsPriceMaxDraftChange(value: string): void {
    setAdminItemsPriceMaxDraft(value)
  }

  function onAdminItemsPriceMinDraftChange(value: string): void {
    setAdminItemsPriceMinDraft(value)
  }

  function onAdminItemsSearchQueryChange(value: string): void {
    setAdminItemsSearchQuery(value)

    adminItemsSearchRequestSeqRef.current += 1
    const requestSeq = adminItemsSearchRequestSeqRef.current

    if (adminItemsSearchDebounceTimerRef.current != null && isBrowser()) {
      window.clearTimeout(adminItemsSearchDebounceTimerRef.current)
      adminItemsSearchDebounceTimerRef.current = null
    }

    const nextFilters = currentAdminItemsCloudFilters({
      searchQuery: value
    })

    if (!isBrowser()) {
      void refreshAdminItemsFilteredFirstPage(nextFilters, requestSeq)
      return
    }

    adminItemsSearchDebounceTimerRef.current = window.setTimeout(() => {
      void refreshAdminItemsFilteredFirstPage(nextFilters, requestSeq)
    }, 350)
  }

  function onAdminItemsSortModeChange(value: ShowcaseHomeSortMode): void {
    const nextMode = normalizeSortMode(value)
    const nextAscending = nextMode !== 'PriceDesc'

    setAdminItemsSortMode(nextMode)
    setAdminItemsSortAscending(nextAscending)

    void refreshAdminItemsFilteredFirstPage(currentAdminItemsCloudFilters({
      sortMode: nextMode
    }))
  }

  function onAdminPasswordDraftChange(value: string): void {
    setAdminPasswordDraft(value)
  }

  function onAdminUsernameDraftChange(value: string): void {
    setAdminUsernameDraft(value)
  }

  function onChangePasswordConfirmDraftChange(value: string): void {
    setChangePasswordConfirmDraft(value)
    setChangePasswordError(null)
    setChangePasswordSuccess(null)
  }

  function onChangePasswordCurrentDraftChange(value: string): void {
    setChangePasswordCurrentDraft(value)
    setChangePasswordError(null)
    setChangePasswordSuccess(null)
  }

  function onChangePasswordNewDraftChange(value: string): void {
    setChangePasswordNewDraft(value)
    setChangePasswordError(null)
    setChangePasswordSuccess(null)
  }

  function onDetailImageIndexChanged(index: number): void {
    setDetailImageIndex(clampIndex(index, selectedDishImages.length))
  }

  function openAppointmentFromDish(dishId: string): void {
    void openAppointmentForDish(dishId)
  }

  function openAppointmentFromSelectedDish(): void {
    if (!selectedDish) {
      setStatusMessage('Please select an item first.')
      return
    }

    openAppointmentFromDish(selectedDish.id)
  }

  function parseCoverList(valueInput: string | string[] | null | undefined): string[] {
    if (Array.isArray(valueInput)) {
      return valueInput.map(item => item.trim()).filter(Boolean)
    }

    const value = String(valueInput || '').trim()
    if (!value) return []

    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item || '').trim()).filter(Boolean)
      }
    } catch {
      return value.split(',').map(item => item.trim()).filter(Boolean)
    }

    return []
  }

  async function refresh(): Promise<void> {
    if (screen === ShowcaseScreens.Admin) {
      await refreshAdminHomeCloudState(true)
      return
    }

    await tryLoadFromCloud(ShowcaseRetryOps.LoadFromCloud)

    if (isAdminLoggedIn) {
      await refreshAdminHomeCloudState(false)
    }
  }

  function refreshFavoritesList(sourceDishes: DemoDish[] = dishes): void {
    const storedIds = readFavoriteIds(storeId)
    const storedAddedAt = loadFavoriteAddedAtFromStorage(storeId)
    const storedSnapshots = loadFavoriteSnapshotsFromStorage(storeId)

    const dishById = new Map(sourceDishes.map(dish => [dish.id, dish]))
    const nextSnapshots: Record<string, ShowcaseFavoriteSnapshot> = {
      ...storedSnapshots
    }

    storedIds.forEach(id => {
      const dish = dishById.get(id)
      if (dish) {
        nextSnapshots[id] = favoriteSnapshotFromDish(dish)
      }
    })

    persistFavoritesState(storedIds, storedAddedAt, nextSnapshots)
  }

  function preserveFavoriteSnapshotsBeforeDishDelete(deletingDishesInput: DemoDish[]): void {
    const deletingDishes = deletingDishesInput.filter(Boolean)

    if (!deletingDishes.length) {
      return
    }

    const storedIds = readFavoriteIds(storeId)
    const storedAddedAt = loadFavoriteAddedAtFromStorage(storeId)
    const storedSnapshots = loadFavoriteSnapshotsFromStorage(storeId)
    const favoriteIdSet = new Set(storedIds)
    const nextSnapshots: Record<string, ShowcaseFavoriteSnapshot> = {
      ...storedSnapshots
    }

    let changed = false

    deletingDishes.forEach(dish => {
      if (!favoriteIdSet.has(dish.id)) {
        return
      }

      nextSnapshots[dish.id] = favoriteSnapshotFromDish(dish)
      changed = true
    })

    if (changed) {
      persistFavoritesState(storedIds, storedAddedAt, nextSnapshots)
    }
  }

  async function refreshMerchantChatListByUser(): Promise<void> {
    if (merchantChatListRefreshInFlightRef.current) return

    const normalizedQuery = merchantChatListSearchQuery.trim()
    if (normalizedQuery) {
      merchantChatListSearchRequestSeqRef.current += 1
      await refreshMerchantChatListSearch(normalizedQuery, merchantChatListSearchRequestSeqRef.current)
      return
    }

    await refreshMerchantChatListInternal(true)
  }

  async function loadMoreMerchantChatThreads(): Promise<void> {
    if (merchantChatListSearchQuery.trim()) {
      await loadMoreMerchantChatThreadSearch()
      return
    }

    if (merchantChatListPagination.isLoadingMore || !merchantChatListPagination.hasMore) return

    const offset = Math.max(0, merchantChatListPagination.nextOffset)

    setMerchantChatListPagination(current => ({
      nextOffset: current.nextOffset,
      hasMore: current.hasMore,
      isLoadingMore: true
    }))

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        setMerchantChatListPagination(current => ({
          nextOffset: current.nextOffset,
          hasMore: current.hasMore,
          isLoadingMore: false
        }))
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const traceId = `VM${Date.now()}_${storeId.slice(-4)}`
      const threads = await fetchMerchantThreadsFromChatRepository(
        traceId,
        SHOWCASE_PAGE_SIZE.chatThreads,
        offset
      )
      const nextThreads = await buildMerchantThreadsWithLocalMeta(threads)
      const nextOffset = offset + threads.length

      setMerchantChatThreads(current => mergeMerchantThreadSummariesByConversationId(
        current,
        nextThreads
      ))
      setMerchantChatListPagination({
        nextOffset,
        hasMore: threads.length >= SHOWCASE_PAGE_SIZE.chatThreads,
        isLoadingMore: false
      })
    } catch (error) {
      setMerchantChatListPagination(current => ({
        nextOffset: current.nextOffset,
        hasMore: current.hasMore,
        isLoadingMore: false
      }))
      setStatusMessage(error instanceof Error ? error.message : 'Failed to load more conversations.')
    }
  }
  async function refreshMerchantChatListSearch(queryInput: string, requestSeq: number): Promise<void> {
    const query = String(queryInput || '').trim()

    if (!query) return

    setMerchantChatListRefreshing(true)
    setMerchantChatListSearchThreads([])
    setMerchantChatListSearchPagination({
      nextOffset: 0,
      hasMore: false,
      isLoadingMore: true
    })

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        if (requestSeq !== merchantChatListSearchRequestSeqRef.current) return

        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        setMerchantChatListSearchThreads([])
        setMerchantChatListSearchPagination({
          nextOffset: 0,
          hasMore: false,
          isLoadingMore: false
        })
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const traceId = `VM${Date.now()}_${storeId.slice(-4)}`
      const threads = await searchMerchantThreadsFromChatRepository(
        traceId,
        query,
        SHOWCASE_PAGE_SIZE.chatThreads,
        0
      )

      if (requestSeq !== merchantChatListSearchRequestSeqRef.current) return

      const nextThreads = await buildMerchantThreadsWithLocalMeta(threads)

      setMerchantChatListSearchThreads(nextThreads)
      setMerchantChatListSearchPagination({
        nextOffset: threads.length,
        hasMore: threads.length >= SHOWCASE_PAGE_SIZE.chatThreads,
        isLoadingMore: false
      })
      setStatusMessage(null)
    } catch (error) {
      if (requestSeq !== merchantChatListSearchRequestSeqRef.current) return

      setMerchantChatListSearchThreads([])
      setMerchantChatListSearchPagination({
        nextOffset: 0,
        hasMore: false,
        isLoadingMore: false
      })
      setStatusMessage(error instanceof Error ? error.message : 'Failed to search conversations.')
    } finally {
      if (requestSeq === merchantChatListSearchRequestSeqRef.current) {
        setMerchantChatListRefreshing(false)
      }
    }
  }

  async function loadMoreMerchantChatThreadSearch(): Promise<void> {
    const query = merchantChatListSearchQuery.trim()

    if (!query) return
    if (merchantChatListSearchPagination.isLoadingMore || !merchantChatListSearchPagination.hasMore) return

    const offset = Math.max(0, merchantChatListSearchPagination.nextOffset)

    setMerchantChatListSearchPagination(current => ({
      nextOffset: current.nextOffset,
      hasMore: current.hasMore,
      isLoadingMore: true
    }))

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        setMerchantChatListSearchPagination(current => ({
          nextOffset: current.nextOffset,
          hasMore: current.hasMore,
          isLoadingMore: false
        }))
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const traceId = `VM${Date.now()}_${storeId.slice(-4)}`
      const threads = await searchMerchantThreadsFromChatRepository(
        traceId,
        query,
        SHOWCASE_PAGE_SIZE.chatThreads,
        offset
      )
      const nextThreads = await buildMerchantThreadsWithLocalMeta(threads)
      const nextOffset = offset + threads.length

      setMerchantChatListSearchThreads(current => mergeMerchantThreadSummariesByConversationId(
        current,
        nextThreads
      ))
      setMerchantChatListSearchPagination({
        nextOffset,
        hasMore: threads.length >= SHOWCASE_PAGE_SIZE.chatThreads,
        isLoadingMore: false
      })
    } catch (error) {
      setMerchantChatListSearchPagination(current => ({
        nextOffset: current.nextOffset,
        hasMore: current.hasMore,
        isLoadingMore: false
      }))
      setStatusMessage(error instanceof Error ? error.message : 'Failed to load more search results.')
    }
  }
  async function refreshMerchantChatListInternal(showRefreshing: boolean): Promise<void> {
    if (merchantChatListRefreshInFlightRef.current) return

    merchantChatListRefreshInFlightRef.current = true

    if (showRefreshing) {
      setMerchantChatListRefreshing(true)
    }

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const traceId = `VM${Date.now()}_${storeId.slice(-4)}`

      await chatRepository.syncMerchantThreadMetaFromCloud(
        storeId,
        traceId
      )

      await mergeLatestMerchantThreadsIntoState(traceId)
      setStatusMessage(null)
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'refreshMerchantChatList failed')
    } finally {
      merchantChatListRefreshInFlightRef.current = false

      if (showRefreshing) {
        setMerchantChatListRefreshing(false)
      }
    }
  }

  async function refreshMerchantChatListSilently(): Promise<void> {
    await refreshMerchantChatListInternal(false)
  }

  async function refreshStoreProfileFromCloud(): Promise<void> {
    await refreshStoreProfile()
  }

  async function removeCategory(nameInput: string): Promise<void> {
    if (categorySubmittingAction) return

    const name = nameInput.trim()
    if (!name) return

    if (guardOfflineWriteOperation()) {
      return
    }

    setCategorySubmittingAction('delete')

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const categoryId = await repository.getCategoryIdByName(storeId, name)

      if (!categoryId) {
        setStatusMessage('Failed to delete category.')
        return
      }

      const hasRef = await repository.hasAnyDishReferencingCategoryId(storeId, categoryId)

      if (hasRef) {
        setAdminCannotDeleteCategory(name)
        setAdminPendingDeleteCategory(null)
        setStatusMessage(null)
        return
      }

      let result = await repository.deleteCategoryByName(storeId, name)

      if (!result.ok) {
        const retry = await retryMerchantCloudOperationAfterAuthRefresh({
          errorInput: new Error(`${result.errorCode} ${result.errorBody || ''}`),
          operation: () => repository.deleteCategoryByName(storeId, name),
          isSuccess: value => value.ok
        })

        if (retry.status === 'handled_without_retry') return

        if (retry.status === 'retried_success' && retry.value) {
          result = retry.value
        } else {
          setStatusMessage(result.errorMessage || 'Failed to delete category.')
          return
        }
      }

      const [cloudDishes, cloudCategories] = await Promise.all([
        repository.fetchDishes(storeId),
        repository.fetchCategories(storeId)
      ])

      const localDishes = loadDishesFromStorage(storeId)
      const finalDishes = cloudDishes.length
        ? mergeRemoteAndLocal(cloudDishes, localDishes)
        : dishes

      const allCategoryNames = cloudCategoriesToManualCategoryNames(cloudCategories)

      mergeDishEntities(finalDishes)
      setAdminItemIds(dishIdsFromItems(finalDishes))
      setHomeDishIds(dishIdsFromItems(finalDishes.filter(item => !item.isHidden)))
      setDishes(finalDishes)
      setCategories(cloudCategories)
      setPendingSyncOperations(buildPendingDishSyncOperations(finalDishes))
      setSelectedCategory(current => String(current || '').trim() === name ? null : current)
      setEditDishCategory(current => String(current || '').trim() === name ? null : current)
      setAdminPendingDeleteCategory(null)
      setStatusMessage(null)

      saveDishesToStorage(storeId, finalDishes)
      saveManualCategoriesToStorage(storeId, allCategoryNames)
      setLastSyncAt(nowMillis())
    } catch {
      setStatusMessage('Failed to delete category.')
    } finally {
      setCategorySubmittingAction(null)
    }
  }
  function saveImageUrlToGallery(url: string): void {
    savePreviewImage(url)
  }

  function saveLocalImageUriToGallery(url: string): void {
    savePreviewImage(url)
  }

  function setFindQuery(value: string): void {
    const domainState = onFindQueryChangeInDomain(buildCurrentChatDomainState(), value)
    applyChatDomainInteractionState(domainState)
  }

  function startAnnouncementsEntryPolling(): void {
    if (!isBrowser()) return
    if (announcementsEntryPollingTimerRef.current != null) return

    void refreshAnnouncementsEntryDotOnce()

    announcementsEntryPollingTimerRef.current = window.setInterval(() => {
      void refreshAnnouncementsEntryDotOnce()
    }, 10000)
  }

  function stopAnnouncementsEntryPolling(): void {
    if (announcementsEntryPollingTimerRef.current != null && isBrowser()) {
      window.clearInterval(announcementsEntryPollingTimerRef.current)
      announcementsEntryPollingTimerRef.current = null
    }
  }

  function startBookingsEntryPolling(): void {
    if (!isBrowser()) return
    if (bookingsEntryPollingTimerRef.current != null) return

    void refreshBookingsEntryDotOnce()

    bookingsEntryPollingTimerRef.current = window.setInterval(() => {
      void refreshBookingsEntryDotOnce()
    }, 10000)
  }

  function stopBookingsEntryPolling(): void {
    if (bookingsEntryPollingTimerRef.current != null && isBrowser()) {
      window.clearInterval(bookingsEntryPollingTimerRef.current)
      bookingsEntryPollingTimerRef.current = null
    }
  }

  function startHomeBadgePolling(intervalMillis = 10000): void {
    if (!isBrowser()) return

    const safeIntervalMillis = Math.max(5000, Math.round(intervalMillis))

    if (
      homeBadgePollingTimerRef.current != null &&
      homeBadgePollingIntervalMsRef.current === safeIntervalMillis
    ) {
      return
    }

    stopHomeBadgePolling()
    homeBadgePollingIntervalMsRef.current = safeIntervalMillis

    homeBadgePollingTimerRef.current = window.setInterval(() => {
      void refreshHomeBadgeData()
    }, safeIntervalMillis)
  }

  function stopHomeBadgePolling(): void {
    if (homeBadgePollingTimerRef.current != null && isBrowser()) {
      window.clearInterval(homeBadgePollingTimerRef.current)
      homeBadgePollingTimerRef.current = null
    }

    homeBadgePollingIntervalMsRef.current = 0
  }

  function startMerchantChatListDbObserve(): void {
    if (!isBrowser()) return

    if (merchantChatListDbObserveAbortRef.current) return

    const controller = new AbortController()
    merchantChatListDbObserveAbortRef.current = controller

    const refreshFromLocalChange = () => {
      const currentScreen = screen

      if (currentScreen !== 'MerchantChatList' && currentScreen !== 'Admin') {
        return
      }

      void refreshMerchantChatListSilently()
    }

    window.addEventListener('storage', refreshFromLocalChange, {
      signal: controller.signal
    })

    window.addEventListener('focus', refreshFromLocalChange, {
      signal: controller.signal
    })

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        refreshFromLocalChange()
      }
    }, {
      signal: controller.signal
    })
  }

  function stopMerchantChatListDbObserve(): void {
    if (merchantChatListDbObserveAbortRef.current) {
      merchantChatListDbObserveAbortRef.current.abort()
      merchantChatListDbObserveAbortRef.current = null
    }
  }

  function startMerchantChatListPolling(intervalMillis = 2000): void {
    if (!isBrowser()) return

    ndjcTrace('START merchantChatListPolling', {
      screen,
      isAdminLoggedIn,
      intervalMillis,
      existingTimer: merchantChatListPollingTimerRef.current != null,
      existingIntervalMillis: merchantChatListPollingIntervalMsRef.current
    })

    const safeIntervalMillis = Math.max(2000, Math.round(intervalMillis))

    if (
      merchantChatListPollingTimerRef.current != null &&
      merchantChatListPollingIntervalMsRef.current === safeIntervalMillis
    ) {
      return
    }

    stopMerchantChatListPolling()
    merchantChatListPollingIntervalMsRef.current = safeIntervalMillis

    void refreshMerchantChatListInternal(false)

    merchantChatListPollingTimerRef.current = window.setInterval(() => {
      void refreshMerchantChatListInternal(false)
    }, safeIntervalMillis)
  }

  function stopMerchantChatListPolling(): void {
    if (merchantChatListPollingTimerRef.current != null && isBrowser()) {
      window.clearInterval(merchantChatListPollingTimerRef.current)
      merchantChatListPollingTimerRef.current = null
    }

    merchantChatListPollingIntervalMsRef.current = 0
  }

  function startAdminHomePolling(intervalMillis = 10000): void {
    if (!isBrowser()) return

    const safeIntervalMillis = Math.max(5000, Math.round(intervalMillis))

    if (
      adminHomePollingTimerRef.current != null &&
      adminHomePollingIntervalMsRef.current === safeIntervalMillis
    ) {
      return
    }

    stopAdminHomePolling()
    adminHomePollingIntervalMsRef.current = safeIntervalMillis

    void refreshAdminHomeCloudState(false)

    adminHomePollingTimerRef.current = window.setInterval(() => {
      void refreshAdminHomeCloudState(false)
    }, safeIntervalMillis)
  }

  function stopAdminHomePolling(): void {
    if (adminHomePollingTimerRef.current != null && isBrowser()) {
      window.clearInterval(adminHomePollingTimerRef.current)
      adminHomePollingTimerRef.current = null
    }

    adminHomePollingIntervalMsRef.current = 0
  }

  async function submitChangePassword(): Promise<void> {
    await updateMerchantPassword()
  }

  function toCard(dish: DemoDish): ShowcaseFavoriteCard {
    return mapFavoriteCard(dish)
  }

  function toggleFavoritesSelection(dishId: string): void {
    toggleFavoriteSelection(dishId)
  }

  async function refreshStoreProfile(): Promise<void> {
    setLastRetryOp(ShowcaseRetryOps.RefreshStoreProfile)
    setIsRefreshingStoreProfile(true)

    try {
      const profile = await repository.fetchStoreProfile(storeId)

      if (!profile) {
        const cached = loadStoreProfileFromStorage(storeId)

        if (cached) {
          const cachedForUi = storeProfileFromCachedProfile(cached)

          setStoreProfile(cachedForUi)
          setStoreProfileServices(cached.services)
          setStoreProfileExtraContacts(cached.extraContacts.map((item, index) => ({
            id: `extra_contact_${index + 1}`,
            name: item.name,
            value: item.value
          })))
          setStoreProfileCoverUrl(cached.coverUrl || '')
          setStoreProfileLogoUrl(cached.logoUrl || '')
          setDraftStoreProfileCoverUrl(cached.coverUrl || '')
          setDraftStoreProfileLogoUrl(cached.logoUrl || '')
          setDraftStoreProfileDescription(cached.description || '')
          setDraftBusinessStatus(cached.businessStatus || '')
          setDraftStoreProfileServices(cached.services)
          setDraftStoreProfileExtraContacts(cached.extraContacts.map((item, index) => ({
            id: `extra_contact_${index + 1}`,
            name: item.name,
            value: item.value
          })))
          setStoreProfileDraft(screen === ShowcaseScreens.StoreProfile
            ? storeProfileDraftFromProfile(cachedForUi)
            : null)
        }

        if (cached) {
          setStatusMessage('Profile refreshed.')
          setSyncErrorMessage(null)
        } else {
          setStatusMessage('Profile refresh failed.')
          setSyncErrorMessage('Profile refresh failed.')
        }

        return
      }

      const local = loadStoreProfileFromStorage(storeId)
      const localServices = local?.services || storeProfileServices
      const localExtraContacts = local?.extraContacts || storeProfileExtraContacts.map(item => ({
        name: item.name,
        value: item.value
      }))

      const cloudServices = parseJsonStringArray(profile.servicesJson)
      const cloudExtraContacts = parseExtraContacts(profile.extraContactsJson)

      const mergedProfile: CloudStoreProfile = {
        ...profile,
        coverUrl: profile.coverUrl.trim() || storeProfileCoverUrl || local?.coverUrl || '',
        logoUrl: profile.logoUrl.trim() || storeProfileLogoUrl || local?.logoUrl || '',
        servicesJson: cloudServices.length
          ? profile.servicesJson
          : serializeServices(localServices),
        extraContactsJson: cloudExtraContacts.length
          ? profile.extraContactsJson
          : serializeExtraContacts(
              localExtraContacts.map((item, index) => ({
                id: `extra_contact_${index + 1}`,
                name: item.name,
                value: item.value
              }))
            )
      }

      applyCloudStoreProfile(mergedProfile)

      saveStoreProfileToStorage(storeId, {
        title: mergedProfile.title || 'Showcase Store',
        subtitle: mergedProfile.subtitle || 'Browse items, book services, and contact the store.',
        description: mergedProfile.description || '',
        services: parseJsonStringArray(mergedProfile.servicesJson),
        address: mergedProfile.address || '',
        hours: mergedProfile.hours || '',
        mapUrl: mergedProfile.mapUrl || '',
        extraContacts: parseExtraContacts(mergedProfile.extraContactsJson).map(item => ({
          name: item.name,
          value: item.value
        })),
        coverUrl: mergedProfile.coverUrl || '',
        logoUrl: mergedProfile.logoUrl || '',
        businessStatus: mergedProfile.businessStatus || ''
      })

      setStatusMessage('Profile refreshed.')
      setSyncErrorMessage(null)
    } catch {
      setStatusMessage('Profile refresh failed.')
      setSyncErrorMessage('Profile refresh failed.')
      setLastRetryOp(ShowcaseRetryOps.RefreshStoreProfile)
    } finally {
      setIsRefreshingStoreProfile(false)
    }
  }

  async function saveStoreProfile(): Promise<void> {
    const draft = storeProfileDraft

    if (!draft) {
      setStoreProfileSaveError('Nothing to save.')
      return
    }

    const title = draft.displayName.trim()

    if (!title) {
      setStoreProfileSaveError('Store title is required.')
      return
    }

    const cleanedExtraContacts = draftStoreProfileExtraContacts
      .map(item => ({
        id: item.id || createId('extra_contact'),
        name: item.name.trim(),
        value: item.value.trim()
      }))
      .filter(item => item.name || item.value)

    const hasHalfFilledContact = cleanedExtraContacts.some(item => {
      return (item.name.length === 0 && item.value.length > 0) ||
        (item.name.length > 0 && item.value.length === 0)
    })

    if (hasHalfFilledContact) {
      setStoreProfileSaveError('有联系方式只填了一半（Name/Value），请补全或清空后再保存。')
      return
    }

    const address = draft.address.trim()
    const mapUrl = draft.mapUrl.trim()

    if (mapUrl) {
      if (!address) {
        setStoreProfileSaveError('已填写 Map URL，但文本地址（Address）为空：请先填写地址，否则无法保存。')
        return
      }

      if (!mapUrl.startsWith('http://') && !mapUrl.startsWith('https://')) {
        setIsSavingStoreProfile(false)
        setStoreProfileSaveError('Map URL must start with http:// or https://.')
        return
      }
    }

    const normalizedServices = Array.from(
      new Set(
        draftStoreProfileServices
          .map(item => item.trim())
          .filter(Boolean)
      )
    )

    const normalizedDescription = draftStoreProfileDescription.trim().slice(0, 200)
    const normalizedSubtitle = draft.tagline.trim()
    const normalizedHours = draft.businessHours.trim()
    const normalizedBusinessStatus = draftBusinessStatus.trim()
    const normalizedWebsiteUrl = draft.websiteUrl.trim()

    if (guardOfflineWriteOperation()) {
      setStoreProfileSaveError('You are offline. Please reconnect and try again.')
      return
    }

    setIsSavingStoreProfile(true)
    setStoreProfileSaveError(null)
    setStoreProfileSaveSuccess(false)
    setStatusMessage(null)

    try {
      if (!isWriteAllowed) {
        throw new Error('Store is read-only.')
      }

      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setStoreProfileSaveError(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      let logoUrl = draftStoreProfileLogoUrl.trim()
      let logoImageVariants: ShowcaseImageVariants | null = null

      if (logoUrl && isLocalImageUri(logoUrl)) {
        const uploadedLogo = await uploadStoreImageIfNeeded(logoUrl, 'logo')

        if (!uploadedLogo) {
          throw new Error('Logo upload failed.')
        }

        logoUrl = uploadedLogo.url
        logoImageVariants = uploadedLogo.variants
      } else if (logoUrl) {
        logoImageVariants = createRemoteOnlyImageVariants(logoUrl)
      }

      const coverCandidates = draftStoreProfileCoverUrl
        .replace(/\\n/g, '\n')
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean)
        .filter((item, index, all) => all.indexOf(item) === index)
        .slice(0, 9)

      const uploadedCoverImages: UploadedShowcaseImage[] = []

      for (const rawCoverUrl of coverCandidates) {
        if (isLocalImageUri(rawCoverUrl)) {
          const uploadedCover = await uploadStoreImageIfNeeded(rawCoverUrl, 'cover')

          if (!uploadedCover) {
            throw new Error('Cover upload failed.')
          }

          uploadedCoverImages.push(uploadedCover)
        } else {
          uploadedCoverImages.push({
            url: rawCoverUrl,
            variants: createRemoteOnlyImageVariants(rawCoverUrl)
          })
        }
      }

      const uploadedCoverUrls = uploadedCoverImages.map(item => item.url)
      const coverImageVariants = uploadedCoverImages[0]?.variants ?? null

      const cloudLogoUrl = logoUrl && !isLocalImageUri(logoUrl) ? logoUrl : ''
      const cloudCoverUrl = uploadedCoverUrls
        .map(item => item.trim())
        .filter(item => item && !isLocalImageUri(item))
        .filter((item, index, all) => all.indexOf(item) === index)
        .slice(0, 9)
        .join('\n')

      const payload = {
        storeId,
        title,
        subtitle: normalizedSubtitle,
        description: normalizedDescription,
        address,
        hours: normalizedHours,
        mapUrl,
        extraContactsJson: serializeExtraContacts(cleanedExtraContacts),
        servicesJson: serializeServices(normalizedServices),
        coverUrl: cloudCoverUrl,
        logoUrl: cloudLogoUrl,
        coverImageVariants,
        logoImageVariants,
        businessStatus: normalizedBusinessStatus,
        updatedAt: nowMillis()
      }

      let ok = await repository.upsertStoreProfile(payload)

      if (!ok) {
        const detail = [
          repository.lastUpsertCode != null ? `code=${repository.lastUpsertCode}` : '',
          repository.lastUpsertBody ? `body=${repository.lastUpsertBody.slice(0, 300)}` : ''
        ].filter(Boolean).join(' ')

        const retry = await retryMerchantCloudOperationAfterAuthRefresh({
          errorInput: new Error(detail || 'Cloud save failed.'),
          operation: () => repository.upsertStoreProfile(payload),
          isSuccess: value => value
        })

        if (retry.status === 'handled_without_retry') return

        if (retry.status === 'retried_success') {
          ok = true
        } else {
          throw new Error(detail ? `Cloud save failed. ${detail}` : 'Cloud save failed.')
        }
      }

      clearStoreProfileDraftLocalImages(storeId)

      const nextProfile = storeProfileFromCloud(payload)

      setStoreProfile(nextProfile)
      setStoreProfileCloud(payload)
      setStoreProfileServices(normalizedServices)
      setStoreProfileExtraContacts(
        cleanedExtraContacts.map(item => ({
          id: item.id,
          name: item.name,
          value: item.value
        }))
      )
      setStoreProfileCoverUrl(cloudCoverUrl)
      setStoreProfileLogoUrl(cloudLogoUrl)
      setDraftStoreProfileServices(normalizedServices)
      setDraftStoreProfileExtraContacts(
        cleanedExtraContacts.map(item => ({
          id: item.id,
          name: item.name,
          value: item.value
        }))
      )
      setDraftStoreProfileCoverUrl(cloudCoverUrl)
      setDraftStoreProfileLogoUrl(cloudLogoUrl)
      setDraftStoreProfileDescription(normalizedDescription)
      setDraftBusinessStatus(normalizedBusinessStatus)
      setStoreProfileDraft(null)
      setIsEditingStoreProfile(false)
      setIsSavingStoreProfile(false)
      setStoreProfileSaveError(null)
      setStoreProfileSaveSuccess(true)
      setStatusMessage('Store profile saved.')
      writePersistedStoreProfileDraft(storeId, null)
      saveStoreProfileToStorage(storeId, {
        title,
        subtitle: normalizedSubtitle,
        description: normalizedDescription,
        services: normalizedServices,
        address,
        hours: normalizedHours,
        mapUrl,
        extraContacts: cleanedExtraContacts.map(item => ({
          name: item.name,
          value: item.value
        })),
        coverUrl: cloudCoverUrl,
        logoUrl: cloudLogoUrl,
        coverImageVariants,
        logoImageVariants,
        businessStatus: normalizedBusinessStatus
      })
      setLastSyncAt(nowMillis())
      removePendingSync('store-profile-upsert')
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error || 'Cloud save failed.')

      setIsSavingStoreProfile(false)
      setStoreProfileSaveError(message.startsWith('Cloud save failed') ? message : 'Cloud save failed.')
      setStoreProfileSaveSuccess(false)
      setStatusMessage("Couldn't save store profile. Please try again.")

      pushPendingSync({
        id: 'store-profile-upsert',
        type: 'store-profile-upsert',
        createdAt: nowMillis()
      })
    }
  }

  async function addCategory(nameInput: string): Promise<void> {
    if (categorySubmittingAction) return

    const name = nameInput.trim()
    if (!name) return

    const existing = Array.from(
      new Set(
        manualCategories
          .map(item => item.trim())
          .filter(Boolean)
      )
    )

    if (existing.includes(name)) return

    if (guardOfflineWriteOperation()) {
      return
    }

    setCategorySubmittingAction('add')

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      let result = await repository.ensureCategoryExists(storeId, name)

      if (!result.ok) {
        const retry = await retryMerchantCloudOperationAfterAuthRefresh({
          errorInput: new Error(`${result.errorCode} ${result.errorBody || ''}`),
          operation: () => repository.ensureCategoryExists(storeId, name),
          isSuccess: value => value.ok
        })

        if (retry.status === 'handled_without_retry') return

        if (retry.status === 'retried_success' && retry.value) {
          result = retry.value
        } else {
          setStatusMessage(result.errorMessage || 'Failed to add category.')
          return
        }
      }

      const [cloudDishes, cloudCategories] = await Promise.all([
        repository.fetchDishes(storeId),
        repository.fetchCategories(storeId)
      ])

      const localDishes = loadDishesFromStorage(storeId)
      const finalDishes = cloudDishes.length
        ? mergeRemoteAndLocal(cloudDishes, localDishes)
        : dishes

      const allCategoryNames = cloudCategoriesToManualCategoryNames(cloudCategories)

      mergeDishEntities(finalDishes)
      setAdminItemIds(dishIdsFromItems(finalDishes))
      setHomeDishIds(dishIdsFromItems(finalDishes.filter(item => !item.isHidden)))
      setDishes(finalDishes)
      setCategories(cloudCategories)
      setPendingSyncOperations(buildPendingDishSyncOperations(finalDishes))
      setStatusMessage(null)

      saveDishesToStorage(storeId, finalDishes)
      saveManualCategoriesToStorage(storeId, allCategoryNames)
      setLastSyncAt(nowMillis())
    } catch (error) {
      console.error('[CategoryTrace] addCategory failed', error)
      setStatusMessage(
        error instanceof Error
          ? `Failed to add category. ${error.message}`
          : 'Failed to add category.'
      )
    } finally {
      setCategorySubmittingAction(null)
    }
  }

  function requestDeleteCategory(nameInput: string): void {
    const name = nameInput.trim()
    if (!name) return

    setAdminPendingDeleteCategory({
      name,
      id: null
    })
    setAdminCannotDeleteCategory(null)
  }

  async function confirmDeleteCategory(): Promise<void> {
    if (categorySubmittingAction) return

    const pending = adminPendingDeleteCategory
    if (!pending) return

    const name = pending.name.trim()
    if (!name) {
      setAdminPendingDeleteCategory(null)
      return
    }

    await removeCategory(name)
  }

  async function renameCategory(oldName: string, newName: string): Promise<void> {
    if (categorySubmittingAction) return

    const from = oldName.trim()
    const to = newName.trim()

    if (!from || !to || from === to) return

    if (guardOfflineWriteOperation()) {
      return
    }

    setCategorySubmittingAction('rename')

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const categoryId = await repository.getCategoryIdByName(storeId, from)

      if (!categoryId) {
        setStatusMessage('Update category failed. Category id was not found in cloud.')
        return
      }

      let result = await repository.renameCategoryById({
        storeId,
        categoryId,
        newName: to
      })

      if (!result.ok) {
        const retry = await retryMerchantCloudOperationAfterAuthRefresh({
          errorInput: new Error(`${result.errorCode} ${result.errorBody || ''}`),
          operation: () => repository.renameCategoryById({
            storeId,
            categoryId,
            newName: to
          }),
          isSuccess: value => value.ok
        })

        if (retry.status === 'handled_without_retry') return

        if (retry.status === 'retried_success' && retry.value) {
          result = retry.value
        } else {
          setStatusMessage(result.errorMessage || 'Failed to update category.')
          return
        }
      }

      const [cloudDishes, cloudCategories] = await Promise.all([
        repository.fetchDishes(storeId),
        repository.fetchCategories(storeId)
      ])

      const localDishes = loadDishesFromStorage(storeId)
      const mergedDishes = cloudDishes.length
        ? mergeRemoteAndLocal(cloudDishes, localDishes)
        : dishes

      const finalDishes = mergedDishes.map(item => {
        if (String(item.category || '').trim() !== from) return item

        return {
          ...item,
          category: to,
          updatedAt: item.updatedAt || nowMillis()
        }
      })

      const allCategoryNames = cloudCategoriesToManualCategoryNames(cloudCategories)

      mergeDishEntities(finalDishes)
      setAdminItemIds(dishIdsFromItems(finalDishes))
      setHomeDishIds(dishIdsFromItems(finalDishes.filter(item => !item.isHidden)))
      setDishes(finalDishes)
      setCategories(cloudCategories)
      setPendingSyncOperations(buildPendingDishSyncOperations(finalDishes))
      setSelectedCategory(current => String(current || '').trim() === from ? to : current)
      setEditDishCategory(current => String(current || '').trim() === from ? to : current)
      setStatusMessage(null)

      saveDishesToStorage(storeId, finalDishes)
      saveManualCategoriesToStorage(storeId, allCategoryNames)
      setLastSyncAt(nowMillis())
    } catch {
      setStatusMessage('Failed to update category.')
    } finally {
      setCategorySubmittingAction(null)
    }
  }

  async function reorderCategory(categoryId: string, sortOrder: number): Promise<void> {
    if (categorySubmittingAction) return

    setCategorySubmittingAction('reorder')

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      let result = await repository.setCategorySortOrder({
        storeId,
        categoryId,
        sortOrder
      })

      if (!result.ok) {
        const retry = await retryMerchantCloudOperationAfterAuthRefresh({
          errorInput: new Error(`${result.errorCode} ${result.errorBody || result.errorMessage || ''}`),
          operation: () => repository.setCategorySortOrder({
            storeId,
            categoryId,
            sortOrder
          }),
          isSuccess: value => value.ok
        })

        if (retry.status === 'handled_without_retry') return

        if (retry.status === 'retried_success' && retry.value) {
          result = retry.value
        } else {
          showSnackbar(result.errorMessage || 'Update category order failed.')
          return
        }
      }

      const cloudCategories = await repository.fetchCategories(storeId)
      setCategories(cloudCategories)
    } finally {
      setCategorySubmittingAction(null)
    }
  }

  async function saveDishFromEditForm(): Promise<void> {
    const validationError = validateEditDish()
    if (validationError) {
      setEditValidationError(validationError)
      return
    }

    if (guardOfflineWriteOperation()) {
      setEditValidationError('You are offline. Please reconnect and try again.')
      return
    }

    const wasNew = !editDishId
    const existing = editDishId ? getAdminEditableDishById(editDishId) : null
    const draftDish = buildDishFromEditForm(existing)
    const backTarget = previousScreen && previousScreen !== 'Edit'
      ? previousScreen
      : 'Admin'

    setIsSavingEditDish(true)
    setIsBlockingEditDish(true)
    setStatusMessage(null)
    setSyncOverviewState(SyncOverviewStates.Syncing)
    setSyncErrorMessage(null)
    setLastRetryOp(null)
    setEditValidationError(null)

    try {
      if (!isWriteAllowed) {
        throw new Error('Store is read-only.')
      }

      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setEditValidationError(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const uploadedImages: UploadedShowcaseImage[] = []

      for (const rawUrl of draftDish.imageUrls) {
        const uploadedImage = await uploadDishImageIfNeeded(rawUrl)

        if (!uploadedImage) {
          throw new Error('Image upload failed.')
        }

        uploadedImages.push(uploadedImage)
      }

      const finalImageUrls = uploadedImages
        .map(item => item.url.trim())
        .filter(Boolean)
        .filter((item, index, all) => all.indexOf(item) === index)
        .slice(0, 9)

      if (!finalImageUrls.length) {
        throw new Error('Image upload failed.')
      }

      const nextDish: DemoDish = {
        ...draftDish,
        imageUri: finalImageUrls[0] || null,
        imageUrls: finalImageUrls,
        imageVariants: uploadedImages[0]?.variants ?? draftDish.imageVariants ?? null,
        updatedAt: nowMillis(),
        syncState: 'Pending',
        dirty: true
      }

      let ok = await repository.upsertDishFromDemo(storeId, nextDish)

      if (!ok) {
        const retry = await retryMerchantCloudOperationAfterAuthRefresh({
          errorInput: new Error('Cloud save failed.'),
          operation: () => repository.upsertDishFromDemo(storeId, nextDish),
          isSuccess: value => value
        })

        if (retry.status === 'handled_without_retry') return

        if (retry.status === 'retried_success') {
          ok = true
        } else {
          throw new Error('Cloud save failed.')
        }
      }

      const selected: DemoDish = {
        ...nextDish,
        syncState: 'Synced' as SyncState,
        dirty: false
      }

      const finalDishes = sortedDishesForStorage([
        selected,
        ...dishes.filter(item => item.id !== selected.id)
      ])

      saveDishesToStorage(storeId, finalDishes)
      mergeDishEntities(finalDishes)
      setDishes(finalDishes)

      setHomeDishIds(current => {
        if (selected.isHidden) {
          return removeDishIdFromList(current, selected.id)
        }

        if (current.includes(selected.id)) {
          return current
        }

        return wasNew ? [selected.id, ...current] : current
      })

      await refreshAdminItemsFilteredFirstPage(currentAdminItemsCloudFilters())

      setSelectedDishId(selected.id)
      setEditDishId(selected.id)
      setLastSyncAt(nowMillis())
      removePendingSync(`dish-upsert:${selected.id}`)
      clearCurrentItemEditorDraftLocally()

      setSyncOverviewState(SyncOverviewStates.Idle)
      setSyncErrorMessage(null)
      setLastRetryOp(null)
      setStatusMessage(wasNew ? 'Item published.' : 'Item updated.')
      setEditValidationError(null)
      setIsSavingEditDish(false)
      setIsBlockingEditDish(false)

      const finishNavigation = () => {
        clearEditDraftLocalImages(storeId)

        if (backTarget === 'Detail') {
          setSelectedDishId(selected.id)
          setScreen('Detail')
        } else {
          setSelectedDishId(null)
          setScreen(backTarget)
        }

        setPreviousScreen('Admin')
        setStatusMessage(null)
        setEditValidationError(null)
      }

      if (isBrowser()) {
        window.setTimeout(finishNavigation, 800)
      } else {
        finishNavigation()
      }
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : String(error || '')
      const isImageUploadFailure = rawMessage.includes('Image upload failed')
      const failureMessage = isImageUploadFailure ? 'Image upload failed.' : 'Cloud save failed.'

      const queuedDish: DemoDish = {
        ...draftDish,
        updatedAt: nowMillis(),
        syncState: 'Pending',
        dirty: true
      }

      const finalDishes = sortedDishesForStorage([
        queuedDish,
        ...loadDishesFromStorage(storeId).filter(item => item.id !== queuedDish.id)
      ])

      saveDishesToStorage(storeId, finalDishes)
      mergeDishEntities(finalDishes)
      setDishes(finalDishes)
      refreshFavoritesList(finalDishes)

      setHomeDishIds(current => {
        if (queuedDish.isHidden) {
          return removeDishIdFromList(current, queuedDish.id)
        }

        if (current.includes(queuedDish.id)) {
          return current
        }

        return wasNew ? [queuedDish.id, ...current] : current
      })

      setAdminItemIds(current => {
        if (current.includes(queuedDish.id)) {
          return current
        }

        return [queuedDish.id, ...current]
      })

      pushPendingSync({
        id: `dish-upsert:${queuedDish.id}`,
        type: 'dish-upsert',
        dishId: queuedDish.id,
        createdAt: nowMillis()
      })

      setSelectedDishId(queuedDish.id)
      setEditDishId(queuedDish.id)
      setStatusMessage('Item saved locally. It will sync when the network is available.')
      setSyncOverviewState(SyncOverviewStates.HasPending)
      setSyncErrorMessage(failureMessage)
      setLastRetryOp(ShowcaseRetryOps.RetryPendingSync)
      setEditValidationError(null)
      setIsSavingEditDish(false)
      setIsBlockingEditDish(false)
      showSnackbar('Item queued for sync.')

      const finishNavigation = () => {
        if (backTarget === 'Detail') {
          setSelectedDishId(queuedDish.id)
          setScreen('Detail')
        } else {
          setSelectedDishId(null)
          setScreen(backTarget)
        }

        setPreviousScreen('Admin')
        setStatusMessage('Item saved locally. It will sync when the network is available.')
        setEditValidationError(null)
      }

      if (isBrowser()) {
        window.setTimeout(finishNavigation, 500)
      } else {
        finishNavigation()
      }
    }
  }

  async function deleteDish(dishIdInput: string): Promise<void> {
    const dishId = dishIdInput.trim()

    if (!dishId) {
      setPendingDeleteDishId(null)
      return
    }

    const dish = getAdminEditableDishById(dishId)

    if (!dish) {
      setPendingDeleteDishId(null)
      return
    }

    if (guardOfflineWriteOperation()) {
      setPendingDeleteDishId(null)
      return
    }

    setPendingDeleteDishId(null)
    setStatusMessage('Deleting from cloud...')
    setSyncOverviewState(SyncOverviewStates.Syncing)
    setSyncErrorMessage(null)
    setLastRetryOp(null)

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setSyncOverviewState(SyncOverviewStates.Failed)
        setSyncErrorMessage(merchantSessionEnsureFailureMessage())
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const imageUrls = resolveDishImages(dish)
        .map(item => item.trim())
        .filter(Boolean)
        .filter((item, index, all) => all.indexOf(item) === index)

      for (const url of imageUrls) {
        if (!isLocalImageUri(url)) {
          await repository.deleteDishImageByUrl(storeId, url)
        }
      }

      let ok = await repository.deleteDishById(storeId, dish.id)

      if (!ok) {
        const retry = await retryMerchantCloudOperationAfterAuthRefresh({
          errorInput: new Error('Cloud delete failed.'),
          operation: () => repository.deleteDishById(storeId, dish.id),
          isSuccess: value => value
        })

        if (retry.status === 'handled_without_retry') return

        if (retry.status === 'retried_success') {
          ok = true
        } else {
          throw new Error('Cloud delete failed.')
        }
      }

      preserveFavoriteSnapshotsBeforeDishDelete([dish])

      const finalDishes = dishes.filter(item => item.id !== dish.id)

      removeDishEntityById(dish.id)
      setAdminItemIds(current => removeDishIdFromList(current, dish.id))
      setHomeDishIds(current => removeDishIdFromList(current, dish.id))
      setDishes(finalDishes)
      saveDishesToStorage(storeId, finalDishes)
      refreshFavoritesList(finalDishes)
      removePendingSync(`dish-delete:${dish.id}`)
      removePendingSync(`dish-upsert:${dish.id}`)

      setSelectedDishId(current => current === dish.id ? null : current)
      setEditDishId(current => current === dish.id ? null : current)
      setAppointmentSourceDishId(current => current === dish.id ? null : current)
      setAdminSelectedDishIds(current => current.filter(id => id !== dish.id))
      setLastSyncAt(nowMillis())
      setSyncOverviewState(SyncOverviewStates.Idle)
      setSyncErrorMessage(null)
      setStatusMessage('Dish deleted.')
    } catch {
      setStatusMessage('Cloud delete failed.')
      setSyncOverviewState(SyncOverviewStates.Failed)
      setSyncErrorMessage('Cloud delete failed.')
      setLastRetryOp(ShowcaseRetryOps.RetryPendingSync)

      pushPendingSync({
        id: `dish-delete:${dish.id}`,
        type: 'dish-delete',
        dishId: dish.id,
        createdAt: nowMillis()
      })
    }
  }

  function visibleDishes(includeHidden = false): DemoDish[] {
    if (includeHidden) {
      return decorateCloudHomeResults({
        dishes: dishesFromIds(homeDishIds),
        favoriteIds,
        sortMode
      })
    }

    return visibleDishesForUi
  }

  function visibleAdminItems(): DemoDish[] {
    return adminVisibleDishes
  }

  function clearAdminDishSelection(): void {
    setAdminSelectedDishIds(current => {
      if (!current.length) return current
      return []
    })
  }

  function toggleAdminDishSelected(dishIdInput: string): void {
    const dishId = dishIdInput.trim()
    if (!dishId) return

    setAdminSelectedDishIds(current => {
      const normalized = Array.from(
        new Set(
          current
            .map(id => id.trim())
            .filter(Boolean)
        )
      )

      if (normalized.includes(dishId)) {
        return normalized.filter(id => id !== dishId)
      }

      return [...normalized, dishId]
    })
  }

  async function deleteSelectedDishes(): Promise<void> {
    const ids = Array.from(
      new Set(
        adminSelectedDishIds
          .map(id => id.trim())
          .filter(Boolean)
      )
    )

    if (!ids.length) return

    const toDelete = ids
      .map(id => getAdminEditableDishById(id))
      .filter((item): item is DemoDish => Boolean(item))

    if (!toDelete.length) {
      setAdminSelectedDishIds([])
      return
    }

    if (guardOfflineWriteOperation()) {
      return
    }

    setAdminSelectedDishIds([])
    setPendingDeleteDishId(null)
    setStatusMessage(`Deleting ${toDelete.length} item(s) from cloud...`)
    setSyncOverviewState(SyncOverviewStates.Syncing)
    setSyncErrorMessage(null)
    setLastRetryOp(null)

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setSyncOverviewState(SyncOverviewStates.Failed)
        setSyncErrorMessage(merchantSessionEnsureFailureMessage())
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      let allOk = true

      for (const dish of toDelete) {
        const imageUrls = resolveDishImages(dish)
          .map(item => item.trim())
          .filter(Boolean)
          .filter((item, index, all) => all.indexOf(item) === index)

        for (const url of imageUrls) {
          if (!isLocalImageUri(url)) {
            await repository.deleteDishImageByUrl(storeId, url)
          }
        }

        let ok = await repository.deleteDishById(storeId, dish.id)

        if (!ok) {
          const retry = await retryMerchantCloudOperationAfterAuthRefresh({
            errorInput: new Error('Cloud delete failed.'),
            operation: () => repository.deleteDishById(storeId, dish.id),
            isSuccess: value => value
          })

          if (retry.status === 'handled_without_retry') {
            allOk = false
          } else if (retry.status === 'retried_success') {
            ok = true
          } else {
            allOk = false
          }
        }

        if (!ok) {
          allOk = false
        }
      }

      if (!allOk) {
        throw new Error('Cloud delete failed.')
      }

      preserveFavoriteSnapshotsBeforeDishDelete(toDelete)

      const deletingIds = new Set(toDelete.map(item => item.id))
      const finalDishes = dishes.filter(item => !deletingIds.has(item.id))

      mergeDishEntities(finalDishes)

      toDelete.forEach(dish => {
        removeDishEntityById(dish.id)
      })

      setAdminItemIds(current => current.filter(id => !deletingIds.has(id)))
      setHomeDishIds(current => current.filter(id => !deletingIds.has(id)))
      setDishes(finalDishes)
      saveDishesToStorage(storeId, finalDishes)
      refreshFavoritesList(finalDishes)

      toDelete.forEach(dish => {
        removePendingSync(`dish-delete:${dish.id}`)
        removePendingSync(`dish-upsert:${dish.id}`)
      })

      setSelectedDishId(current => current && deletingIds.has(current) ? null : current)
      setEditDishId(current => current && deletingIds.has(current) ? null : current)
      setAppointmentSourceDishId(current => current && deletingIds.has(current) ? null : current)
      setLastSyncAt(nowMillis())
      setSyncOverviewState(SyncOverviewStates.Idle)
      setSyncErrorMessage(null)
      setStatusMessage(`Deleted ${toDelete.length} item(s).`)
    } catch {
      setStatusMessage('Cloud delete failed.')
      setSyncOverviewState(SyncOverviewStates.Failed)
      setSyncErrorMessage('Cloud delete failed.')
      setLastRetryOp(ShowcaseRetryOps.RetryPendingSync)

      toDelete.forEach(dish => {
        pushPendingSync({
          id: `dish-delete:${dish.id}`,
          type: 'dish-delete',
          dishId: dish.id,
          createdAt: nowMillis()
        })
      })
    }
  }

  function requestDeleteDish(dishIdInput: string): void {
    const dishId = dishIdInput.trim()
    if (!dishId) return

    const exists = dishes.some(item => item.id === dishId)
    if (!exists) return

    setPendingDeleteDishId(dishId)
  }

  function dismissPendingDelete(): void {
    setPendingDeleteDishId(null)
  }

  function updateEditDraft(patch: {
    name?: string
    description?: string
    category?: string | null
    originalPrice?: string
    discountPrice?: string
    isRecommended?: boolean
    isHidden?: boolean
    imageUrls?: string[]
  }): void {
    const nextName = patch.name !== undefined ? patch.name : editDishName
    const nextDescription = patch.description !== undefined ? patch.description : editDishDescription
    const nextCategory = patch.category !== undefined ? patch.category : editDishCategory
    const nextOriginalPrice = patch.originalPrice !== undefined ? patch.originalPrice : editDishOriginalPrice
    const nextDiscountPrice = patch.discountPrice !== undefined ? patch.discountPrice : editDishDiscountPrice

    if (patch.name !== undefined) setEditDishName(patch.name)
    if (patch.description !== undefined) setEditDishDescription(patch.description)
    if (patch.category !== undefined) setEditDishCategory(patch.category)
    if (patch.originalPrice !== undefined) setEditDishOriginalPrice(patch.originalPrice)
    if (patch.discountPrice !== undefined) setEditDishDiscountPrice(patch.discountPrice)
    if (patch.isRecommended !== undefined) setEditDishRecommended(patch.isRecommended)
    if (patch.isHidden !== undefined) setEditDishHidden(patch.isHidden)
    if (patch.imageUrls !== undefined) setEditDishImageUrls(patch.imageUrls)

    persistItemEditorDraftLocally(storeId, {
      editingId: editDishId?.trim() || null,
      isNew: !editDishId,
      name: nextName.trim(),
      price: nextOriginalPrice.trim(),
      discountPrice: nextDiscountPrice.trim(),
      description: nextDescription.trim(),
      category: nextCategory?.trim() || null
    })

    setEditValidationError(null)
  }

  function onEditNameChange(value: string): void {
    updateEditDraft({
      name: value
    })
  }

  function onEditPriceChange(value: string): void {
    updateEditDraft({
      originalPrice: value
    })
  }

  function onEditDiscountPriceChange(value: string): void {
    updateEditDraft({
      discountPrice: value
    })
  }

  function onEditDescriptionChange(value: string): void {
    updateEditDraft({
      description: value.slice(0, 200)
    })
  }

  function onEditCategorySelected(value: string | null): void {
    updateEditDraft({
      category: value
    })
  }

  function onEditToggleRecommended(value: boolean): void {
    updateEditDraft({
      isRecommended: value
    })
  }

  function onEditToggleHidden(value: boolean): void {
    updateEditDraft({
      isHidden: value
    })
  }

  async function uploadDishImageIfNeeded(value: File | Blob | string): Promise<UploadedShowcaseImage | null> {
    if (typeof value === 'string') {
      const url = value.trim()
      if (!url) return null

      if (!isLocalImageUri(url)) {
        return {
          url,
          variants: createRemoteOnlyImageVariants(url)
        }
      }

      try {
        const response = await fetch(url)
        if (!response.ok) return null

        const blob = await response.blob()
        const uploaded = await pickAndUploadImageWithVariants({
          bucket: 'dish',
          pathPrefix: editDishId || 'draft',
          file: blob
        })

        if (uploaded) {
          rememberLocalTempImage(storeId, 'edit-dish', url)
        }

        return uploaded
      } catch {
        return null
      }
    }

    return pickAndUploadImageWithVariants({
      bucket: 'dish',
      pathPrefix: editDishId || 'draft',
      file: value
    })
  }
    function createEditDishLocalPreviewUrl(value: File | Blob | string): string | null {
    if (typeof value === 'string') {
      const url = value.trim()
      if (!url) return null

      if (isLocalImageUri(url)) {
        rememberLocalTempImage(storeId, 'edit-dish', url)
      }

      return url
    }

    if (!isBrowser()) return null

    try {
      const url = window.URL.createObjectURL(value)
      rememberLocalTempImage(storeId, 'edit-dish', url)
      return url
    } catch {
      return null
    }
  }

  async function onEditImageSelected(value: File | Blob | string): Promise<void> {
    const url = createEditDishLocalPreviewUrl(value)

    if (!url) {
      showSnackbar('Image selected failed.')
      return
    }

    setEditDishImageUrls(current => {
      if (current.includes(url)) return current

      if (current.length >= 9) {
        if (isLocalImageUri(url)) {
          deleteAppOwnedLocalFileUri(storeId, url)
        }

        onEditImageLimitReached()
        return current
      }

      const next = [...current, url].slice(0, 9)

      persistCurrentItemEditorDraftLocally()
      showSnackbar('Image selected.')

      return next
    })
  }

  async function onEditImagesSelected(values: Array<File | Blob | string>): Promise<void> {
    for (const value of values) {
      await onEditImageSelected(value)
    }
  }

  function onEditRemoveImage(urlInput: string): void {
    const url = urlInput.trim()
    if (!url) return

    setEditDishImageUrls(current => {
      const next = current.filter(item => item !== url)
      if (next.length === current.length) return current

      persistCurrentItemEditorDraftLocally()
      showSnackbar('Image removed.')

      return next
    })

    if (isAppOwnedLocalFileUri(storeId, url)) {
      deleteAppOwnedLocalFileUri(storeId, url)
      return
    }

    if (!isLocalImageUri(url)) {
      void deleteDishImage(url)
    }
  }

  function onEditRemoveSelectedImage(urlInput?: string | null): void {
    const url = String(urlInput || '').trim() || editDishImageUrls[editDishImageUrls.length - 1] || ''
    if (!url) return

    onEditRemoveImage(url)
  }

  function onEditMoveImage(fromIndex: number, toIndex: number): void {
    console.log('[ImageDrag] onEditMoveImage called', {
      fromIndex,
      toIndex,
      before: editDishImageUrls
    })

    setEditDishImageUrls(current => {
      if (fromIndex < 0 || fromIndex >= current.length) return current
      if (toIndex < 0 || toIndex >= current.length) return current
      if (fromIndex === toIndex) return current

      const next = [...current]
      const [item] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, item)

      console.log('[ImageDrag] onEditMoveImage next', {
        fromIndex,
        toIndex,
        before: current,
        after: next
      })

      return next
    })
  }

  function onEditPickImageClick(): void {
    showSnackbar('Choose item images in the connected UI.')
  }

  function onEditImageLimitReached(): void {
    showSnackbar('Reached max 9 images.')
  }

  async function updateDish(): Promise<void> {
    await saveDishFromEditForm()
  }

  async function onEditSave(): Promise<void> {
    await updateDish()
  }

  function deriveEditState(): ShowcaseEditDishUiState {
    return editDishState
  }

  function getEditDeleteAction(): (() => void) | null {
    return null
  }

  async function incrementDishClick(dishId: string): Promise<void> {
    const id = dishId.trim()
    if (!id) return

    setDishes(current => current.map(item => {
      if (item.id !== id) return item

      return {
        ...item,
        clickCount: Math.max(0, Number(item.clickCount || 0) + 1)
      }
    }))

    setDishEntitiesById(current => {
      const dish = current[id]

      if (!dish) return current

      return {
        ...current,
        [id]: {
          ...dish,
          clickCount: Math.max(0, Number(dish.clickCount || 0) + 1)
        }
      }
    })

    await repository.incrementDishClickCount(storeId, id)
  }

  async function deleteDishImage(url: string): Promise<void> {
    const clean = url.trim()
    if (!clean) return

    if (guardOfflineWriteOperation()) {
      return
    }

    const validSession = await ensureValidMerchantSessionLoadedForCloud()

    if (!validSession) {
      showSnackbar(merchantSessionEnsureSnackbarMessage())
      return
    }

    setStoreMerchantSessionFromAuthSession(validSession)
    bindMerchantSessionToRepository(repository)

    let ok = await repository.deleteDishImageByUrl(storeId, clean)

    if (!ok) {
      const detail = [
        repository.lastDeleteCode != null ? `code=${repository.lastDeleteCode}` : '',
        repository.lastDeleteBody ? `body=${repository.lastDeleteBody.slice(0, 300)}` : ''
      ].filter(Boolean).join(' ')

      const retry = await retryMerchantCloudOperationAfterAuthRefresh({
        errorInput: new Error(detail || 'Delete image failed.'),
        operation: () => repository.deleteDishImageByUrl(storeId, clean),
        isSuccess: value => value
      })

      if (retry.status === 'handled_without_retry') return

      if (retry.status === 'retried_success') {
        ok = true
      } else {
        showSnackbar('Delete image failed.')
        return
      }
    }

    setEditDishImageUrls(current => current.filter(item => item !== clean))
    setDishes(current => current.map(item => ({
      ...item,
      imageUrls: item.imageUrls.filter(imageUrl => imageUrl !== clean),
      imageUri: item.imageUri === clean ? item.imageUrls.filter(imageUrl => imageUrl !== clean)[0] || null : item.imageUri
    })))
    setDishEntitiesById(current => {
      let changed = false
      const next: Record<string, DemoDish> = {}

      Object.entries(current).forEach(([id, dish]) => {
        const imageUrls = dish.imageUrls.filter(imageUrl => imageUrl !== clean)
        const imageUri = dish.imageUri === clean ? imageUrls[0] || null : dish.imageUri

        if (imageUrls.length !== dish.imageUrls.length || imageUri !== dish.imageUri) {
          changed = true
          next[id] = {
            ...dish,
            imageUrls,
            imageUri
          }
          return
        }

        next[id] = dish
      })

      return changed ? next : current
    })
    showSnackbar('Image deleted.')
  }

  useEffect(() => {
    ndjcTrace('ENTER initial useEffect', {
      screen,
      isAdminLoggedIn,
      hasMerchantSession: Boolean(merchantSession?.accessToken),
      hasLoadedInitialCloud: hasLoadedInitialCloudRef.current
    })

    isMountedRef.current = true
    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)

    if (!hasLoadedInitialCloudRef.current) {
      hasLoadedInitialCloudRef.current = true
      ndjcTrace('initial useEffect calls loadFromSources', {
        screen,
        isAdminLoggedIn
      })
      void loadFromSources()
    }

    setIsHydrated(true)
    runShowcaseLocalCacheMaintenance(storeId)
    console.log('[NDJC_PUSH] Auto push registration is disabled. Use a user-click action to enable notifications.')

    return () => {
      ndjcTrace('CLEANUP initial useEffect', {
        screen,
        isAdminLoggedIn,
        hasMerchantSession: Boolean(merchantSession?.accessToken)
      })

      isMountedRef.current = false

      stopChatPolling()
      stopChatEntryPolling()
      stopBookingsEntryPolling()
      stopAnnouncementsEntryPolling()
      stopHomeBadgePolling()
      stopMerchantChatListDbObserve()
      stopMerchantChatListPolling()
      stopChatDbObserve()

      if (snackbarTimerRef.current != null && isBrowser()) {
        window.clearTimeout(snackbarTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)
  }, [merchantSession, repository])

  useEffect(() => {
    saveFavoriteIdsToStorage(storeId, favoriteIds)
    saveFavoriteAddedAtToStorage(storeId, favoriteAddedAt)
    saveFavoriteSnapshotsToStorage(storeId, favoriteSnapshots)
  }, [favoriteIds, favoriteAddedAt, favoriteSnapshots, storeId])

  useEffect(() => {
    if (!storeProfileDraft) return
    writePersistedStoreProfileDraft(storeId, storeProfileDraft)
  }, [storeId, storeProfileDraft])

  useEffect(() => {
    updateChatDraftPersistence(chatDraft)
  }, [chatDraft, chatDraftImageUrls, chatPendingProduct, chatQuotedMessageId, activeConversationId])
  useEffect(() => {
    const postVisibleState = (visible: boolean): void => {
      postChatVisibilityToServiceWorker({
        visible,
        conversationId: activeConversationId,
        screen,
        clientId,
        chatRole: currentChatRole()
      })
    }

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible' && screen === ShowcaseScreens.Chat) {
        markRuntimeConversationVisible(activeConversationId)
        setRuntimeChatVisible(true)
        postVisibleState(true)
        return
      }

      postVisibleState(false)
    }

    const handleControllerChange = (): void => {
      if (screen !== ShowcaseScreens.Chat) return
      postVisibleState(true)
    }

    if (screen === ShowcaseScreens.Chat) {
      markRuntimeConversationVisible(activeConversationId)
      setRuntimeChatVisible(true)
      postVisibleState(true)
      startChatPolling()
      startChatDbObserve()

      if (isBrowser()) {
        window.document.addEventListener('visibilitychange', handleVisibilityChange)
        window.navigator.serviceWorker?.addEventListener('controllerchange', handleControllerChange)
      }

      const heartbeatTimer = isBrowser()
        ? window.setInterval(() => {
            postVisibleState(document.visibilityState === 'visible')
          }, NDJC_CHAT_VISIBILITY_HEARTBEAT_MS)
        : null

      return () => {
        if (heartbeatTimer != null && isBrowser()) {
          window.clearInterval(heartbeatTimer)
        }

        if (isBrowser()) {
          window.document.removeEventListener('visibilitychange', handleVisibilityChange)
          window.navigator.serviceWorker?.removeEventListener('controllerchange', handleControllerChange)
        }

        markRuntimeConversationRecentlySeen(activeConversationId)
        setRuntimeChatVisible(false)
        postVisibleState(false)
        stopChatPolling()
        stopChatDbObserve()
      }
    }

    markRuntimeConversationRecentlySeen(activeConversationId)
    setRuntimeChatVisible(false)
    postVisibleState(false)
    stopChatPolling()
    stopChatDbObserve()
    return undefined
  }, [screen, activeConversationId, clientId, chatMode])

  useEffect(() => {
    if (!isBrowser()) return undefined

    const serviceWorkerContainer = window.navigator.serviceWorker
    if (!serviceWorkerContainer) return undefined

    function handleServiceWorkerMessage(event: MessageEvent): void {
      const payload = event.data || {}

      if (!payload || payload.type !== 'NDJC_CHAT_PUSH_RECEIVED') {
        return
      }

      const pushedConversationId = String(payload.conversation_id || '').trim()
      const activeChatConversationId = activeConversationIdRef.current.trim()
      const isCurrentConversationVisible =
        screen === ShowcaseScreens.Chat &&
        pushedConversationId &&
        activeChatConversationId === pushedConversationId

      console.log('[NDJC_CHAT] Service Worker chat push received.', {
        pushedConversationId,
        screen,
        activeConversationId: activeChatConversationId,
        openAs: String(payload.open_as || payload.openAs || '').trim(),
        isCurrentConversationVisible
      })

      if (isCurrentConversationVisible) {
        void syncChat().then(async () => {
          if (currentChatRole() === 'merchant') {
            const traceId = `VM${Date.now()}_${pushedConversationId.slice(-4)}`

            await chatRepository.markUserMessagesReadToCloud(
              storeId,
              pushedConversationId,
              traceId
            )

            setMerchantChatThreads(current => current.map(thread => {
              if (thread.conversationId !== pushedConversationId) return thread

              return {
                ...thread,
                unreadCount: 0
              }
            }))

            return
          }

          await acknowledgeVisibleClientConversation(pushedConversationId)
        })

        return
      }

      void refreshChatEntryDotOnce()

      if (screen === ShowcaseScreens.MerchantChatList) {
        void refreshMerchantChatListSilently()
      }
    }

    serviceWorkerContainer.addEventListener('message', handleServiceWorkerMessage)

    return () => {
      serviceWorkerContainer.removeEventListener('message', handleServiceWorkerMessage)
    }
  }, [screen])
  useEffect(() => {
    if (screen !== ShowcaseScreens.Home) {
      stopHomeBadgePolling()
      return
    }

    void ensureAnnouncementRegistrationOnHome()
    startHomeBadgePolling(5000)

    return () => {
      stopHomeBadgePolling()
    }
  }, [screen, storeId, merchantSession])
  useEffect(() => {
    if (screen === 'MerchantChatList') {
      stopAdminHomePolling()
      startMerchantChatListDbObserve()
      void refreshMerchantChatListInternal(false)
      startMerchantChatListPolling(2000)
      return
    }

    if (screen === 'Admin') {
      stopMerchantChatListDbObserve()
      stopMerchantChatListPolling()
      startAdminHomePolling(10000)
      return
    }

    stopAdminHomePolling()
    stopMerchantChatListDbObserve()
    stopMerchantChatListPolling()
  }, [screen, storeId, merchantSession])
  async function pickAndUploadImage(input: {
    bucket: 'dish' | 'store' | 'announcement'
    pathPrefix: string
    file: File | Blob
    fileName?: string | null
    contentType?: string | null
  }): Promise<string | null> {
    if (guardOfflineWriteOperation()) {
      return null
    }

    const validSession = await ensureValidMerchantSessionLoadedForCloud()

    if (!validSession) {
      showSnackbar(merchantSessionEnsureSnackbarMessage())
      return null
    }

    setStoreMerchantSessionFromAuthSession(validSession)
    bindMerchantSessionToRepository(repository)

    const profile = uploadImageProfileForBucket(input.bucket, input.pathPrefix)
    const compressed = await compressImage(input.file, profile.maxLongEdge, profile.jpegQuality)
    const contentType = normalizeImageContentType(compressed.type || input.contentType || input.file.type || 'image/jpeg')
    const fileName = buildImageUploadFileName(input.fileName, contentType)

    const payload = {
      storeId,
      pathPrefix: input.pathPrefix,
      fileName,
      contentType,
      bytes: compressed
    }

    const upload = async (): Promise<string | null> => {
      if (input.bucket === 'dish') {
        return repository.uploadDishImageBytes(payload)
      }

      if (input.bucket === 'store') {
        return repository.uploadStoreImageBytes(payload)
      }

      if (input.bucket === 'announcement') {
        return repository.uploadAnnouncementImageBytes(payload)
      }

      return null
    }

    const buildUploadErrorDetail = (): string => {
      if (input.bucket === 'dish') {
        return [
          repository.lastDishImageUploadCode != null ? `code=${repository.lastDishImageUploadCode}` : '',
          repository.lastDishImageUploadBody ? `body=${repository.lastDishImageUploadBody.slice(0, 300)}` : ''
        ].filter(Boolean).join(' ')
      }

      if (input.bucket === 'store') {
        return [
          repository.lastStoreImageUploadCode != null ? `code=${repository.lastStoreImageUploadCode}` : '',
          repository.lastStoreImageUploadBody ? `body=${repository.lastStoreImageUploadBody.slice(0, 300)}` : ''
        ].filter(Boolean).join(' ')
      }

      if (input.bucket === 'announcement') {
        return [
          repository.lastAnnouncementUpsertCode != null ? `code=${repository.lastAnnouncementUpsertCode}` : '',
          repository.lastAnnouncementUpsertBody ? `body=${repository.lastAnnouncementUpsertBody.slice(0, 300)}` : ''
        ].filter(Boolean).join(' ')
      }

      return ''
    }

    const uploadedUrl = await upload()

    if (uploadedUrl) {
      return uploadedUrl
    }

    const detail = buildUploadErrorDetail()
    const retry = await retryMerchantCloudOperationAfterAuthRefresh({
      errorInput: new Error(detail || 'Image upload failed.'),
      operation: upload,
      isSuccess: value => Boolean(value)
    })

    if (retry.status === 'retried_success' && retry.value) {
      return retry.value
    }

    return null
  }

  async function pickAndUploadImageWithVariants(input: {
    bucket: 'dish' | 'store' | 'announcement'
    pathPrefix: string
    file: File | Blob
    fileName?: string | null
    contentType?: string | null
  }): Promise<UploadedShowcaseImage | null> {
    const specs = buildImageVariantSpecs(input.bucket, input.pathPrefix)
    const uploaded: Record<ShowcaseImageVariantName, string | null> = {
      original: null,
      large: null,
      medium: null,
      thumb: null,
      blur: null
    }

    for (const spec of specs) {
      const compressed = await compressImage(input.file, spec.maxLongEdge, spec.jpegQuality)
      const uploadedUrl = await pickAndUploadImage({
        bucket: input.bucket,
        pathPrefix: input.pathPrefix,
        file: compressed,
        fileName: buildImageVariantFileName(input.fileName, spec.name),
        contentType: 'image/jpeg'
      })

      if (uploadedUrl) {
        uploaded[spec.name] = uploadedUrl
      }
    }

    const mainUrl = uploaded.large || uploaded.original || uploaded.medium || uploaded.thumb

    if (!mainUrl) {
      return null
    }

    return {
      url: mainUrl,
      variants: {
        originalUrl: uploaded.original || mainUrl,
        largeUrl: uploaded.large || mainUrl,
        mediumUrl: uploaded.medium || mainUrl,
        thumbUrl: uploaded.thumb || mainUrl,
        blurDataUrl: uploaded.blur
      }
    }
  }

  function savePreviewImage(urlInput: string): void {
    const url = urlInput.trim()
    if (!url || !isBrowser()) return

    const link = document.createElement('a')
    link.href = url
    link.download = url.split('/').pop() || 'ndjc-image'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  async function handleDishImagePicked(fileOrUrl: File | Blob | string): Promise<void> {
    if (typeof fileOrUrl === 'string') {
      const url = fileOrUrl.trim()
      if (!url) return

      rememberLocalTempImage(storeId, 'edit-dish', url)
      setEditDishImageUrls(current => {
        if (current.includes(url)) return current
        return [...current, url]
      })
      return
    }

    const uploadedImage = await pickAndUploadImageWithVariants({
      bucket: 'dish',
      pathPrefix: editDishId || 'draft',
      file: fileOrUrl
    })

    if (!uploadedImage) {
      showSnackbar('Image upload failed.')
      return
    }

    setEditDishImageUrls(current => {
      if (current.includes(uploadedImage.url)) return current
      return [...current, uploadedImage.url]
    })
  }

  async function handleStoreLogoPicked(fileOrUrl: File | Blob | string): Promise<void> {
    if (typeof fileOrUrl === 'string') {
      rememberLocalTempImage(storeId, 'store-profile', fileOrUrl)
      setDraftStoreProfileLogoUrl(fileOrUrl)
      return
    }

    const uploadedImage = await pickAndUploadImageWithVariants({
      bucket: 'store',
      pathPrefix: 'logo',
      file: fileOrUrl
    })

    if (!uploadedImage) {
      showSnackbar('Logo upload failed.')
      return
    }

    setDraftStoreProfileLogoUrl(uploadedImage.url)
  }

  async function handleStoreCoverPicked(fileOrUrl: File | Blob | string): Promise<void> {
    if (typeof fileOrUrl === 'string') {
      rememberLocalTempImage(storeId, 'store-profile', fileOrUrl)
      setDraftStoreProfileCoverUrl(fileOrUrl)
      return
    }

    const uploadedImage = await pickAndUploadImageWithVariants({
      bucket: 'store',
      pathPrefix: 'cover',
      file: fileOrUrl
    })

    if (!uploadedImage) {
      showSnackbar('Cover upload failed.')
      return
    }

    setDraftStoreProfileCoverUrl(uploadedImage.url)
  }

  async function uploadAnnouncementCoverIfNeeded(valueInput: string | null): Promise<UploadedShowcaseImage | null> {
    const value = valueInput?.trim() || null

    if (!value) return null

    if (!isLocalImageUri(value)) {
      return {
        url: value,
        variants: createRemoteOnlyImageVariants(value)
      }
    }

    try {
      const response = await fetch(value)

      if (!response.ok) {
        return null
      }

      const blob = await response.blob()
      const uploadedImage = await pickAndUploadImageWithVariants({
        bucket: 'announcement',
        pathPrefix: 'covers',
        file: blob
      })

      if (!uploadedImage) {
        return null
      }

      rememberLocalTempImage(storeId, 'admin-announcement', value)
      return uploadedImage
    } catch {
      return null
    }
  }

async function resolveAnnouncementCoverDraftUrl(fileOrUrl: File | Blob | string): Promise<string | null> {
  if (typeof fileOrUrl === 'string') {
    const url = fileOrUrl.trim()
    return url || null
  }

  const compressed = await compressImage(
    fileOrUrl,
    ANNOUNCEMENT_IMAGE_LONG_EDGE,
    ANNOUNCEMENT_IMAGE_JPEG_QUALITY
  )

  return blobToDataImageUrl(compressed)
}

async function resolveChatDraftImageUrl(fileOrUrl: File | Blob | string): Promise<string | null> {
  if (typeof fileOrUrl === 'string') {
    const url = fileOrUrl.trim()
    return url || null
  }

  const compressed = await compressImage(fileOrUrl, CHAT_IMAGE_LONG_EDGE, CHAT_IMAGE_JPEG_QUALITY)
  return blobToDataImageUrl(compressed)
}

async function handleChatImagePicked(fileOrUrl: File | Blob | string): Promise<void> {
  const draftUrl = await resolveChatDraftImageUrl(fileOrUrl)

  if (!draftUrl) {
    showSnackbar('Image compress failed.')
    return
  }

  rememberLocalTempImage(storeId, 'chat-draft', draftUrl)

  let shouldShowLimitMessage = false

  setChatDraftImageUrls(current => {
    const result = applyChatDraftImagePicked({
      currentImageUris: current,
      imageUri: draftUrl,
      maxImages: 9
    })

    shouldShowLimitMessage = result.limitReached

    if (result.limitReached) {
      return current
    }

    updateChatDraftPersistence(
      chatDraft,
      result.nextImageUris,
      chatPendingProduct,
      chatQuotedMessageId
    )

    return result.nextImageUris
  })

  if (shouldShowLimitMessage) {
    onChatImageLimitReached()
  }
}

async function uploadChatDraftImageForSend(input: {
  sourceUrl: string
  needsUpload: boolean
  conversation: ChatConversation
  index: number
  messageId: string
  traceId: string
}): Promise<UploadedShowcaseImage> {
  const sourceUrl = input.sourceUrl.trim()

  if (!sourceUrl) {
    throw new Error('Chat image unavailable.')
  }

  if (!input.needsUpload) {
    return {
      url: sourceUrl,
      variants: createRemoteOnlyImageVariants(sourceUrl)
    }
  }

  const response = await fetch(sourceUrl)

  if (!response.ok) {
    throw new Error('Chat image unavailable.')
  }

  const blob = await response.blob()
  const specs = buildImageVariantSpecs('chat', 'chat')
  const uploaded: Record<ShowcaseImageVariantName, string | null> = {
    original: null,
    large: null,
    medium: null,
    thumb: null,
    blur: null
  }

  for (const spec of specs) {
    const compressed = await compressImage(blob, spec.maxLongEdge, spec.jpegQuality)
    const contentType = normalizeImageContentType(compressed.type || blob.type || 'image/jpeg')
    const variantIndex = input.index * 10 + specs.findIndex(item => item.name === spec.name)

    const uploadedUrl = await chatRepository.uploadChatImageToPublicUrl({
      bytes: compressed,
      contentType,
      storeId,
      conversationId: input.conversation.id,
      msgId: `${input.messageId}_${spec.name}`,
      clientId: input.conversation.clientId || clientId,
      asMerchant: currentChatRole() === 'merchant',
      index: variantIndex,
      traceId: input.traceId
    })

    if (uploadedUrl) {
      uploaded[spec.name] = uploadedUrl
    }
  }

  const mainUrl = uploaded.large || uploaded.original || uploaded.medium || uploaded.thumb

  if (!mainUrl) {
    throw new Error('Chat image upload failed.')
  }

  return {
    url: mainUrl,
    variants: {
      originalUrl: uploaded.original || mainUrl,
      largeUrl: uploaded.large || mainUrl,
      mediumUrl: uploaded.medium || mainUrl,
      thumbUrl: uploaded.thumb || mainUrl,
      blurDataUrl: uploaded.blur
    }
  }
}

  function toggleFavorite(dishIdInput: string): void {
    const dishId = dishIdInput.trim()
    if (!dishId) return

    const isRemoving = favoriteIds.includes(dishId)

    if (isRemoving) {
      const nextIds = favoriteIds.filter(id => id !== dishId)
      const nextAddedAt = { ...favoriteAddedAt }
      const nextSnapshots = { ...favoriteSnapshots }

      delete nextAddedAt[dishId]
      delete nextSnapshots[dishId]

      persistFavoritesState(nextIds, nextAddedAt, nextSnapshots)
      setFavoritesSelectedIds(current => current.filter(id => id !== dishId))
      setStatusMessage('Removed from saved items.')
      return
    }

    const dish = getDishEntityById(dishId)
    const nextIds = [...favoriteIds, dishId]
    const nextAddedAt = {
      ...favoriteAddedAt,
      [dishId]: nowMillis()
    }
    const nextSnapshots = {
      ...favoriteSnapshots
    }

    if (dish) {
      nextSnapshots[dishId] = favoriteSnapshotFromDish(dish)
    }

    persistFavoritesState(nextIds, nextAddedAt, nextSnapshots)
    setStatusMessage('Saved item.')
  }

  function clearFavoritesSelection(): void {
    setFavoritesSelectedIds([])
  }

  function toggleFavoriteSelection(dishIdInput: string): void {
    const dishId = dishIdInput.trim()
    if (!dishId) return

    setFavoritesSelectedIds(current => {
      if (current.includes(dishId)) {
        return current.filter(id => id !== dishId)
      }

      return [...current, dishId]
    })
  }

  function deleteSelectedFavorites(): void {
    const selected = favoritesSelectedIds
      .map(id => id.trim())
      .filter(Boolean)

    if (!selected.length) return

    const deletingIds = new Set(selected)
    const nextIds = favoriteIds.filter(id => !deletingIds.has(id))
    const nextAddedAt = { ...favoriteAddedAt }
    const nextSnapshots = { ...favoriteSnapshots }

    selected.forEach(id => {
      delete nextAddedAt[id]
      delete nextSnapshots[id]
    })

    persistFavoritesState(nextIds, nextAddedAt, nextSnapshots)
    setFavoritesSelectedIds([])

    const removedCount = selected.length
    setStatusMessage(removedCount === 1
      ? 'Removed from saved items.'
      : `Removed ${removedCount} saved items.`)
  }

  function clearHomeSortAndFilters(): void {
    setSearchQuery('')
    setSortMode('Default')
    setFilterRecommendedOnly(false)
    setFilterOnSaleOnly(false)
    setSelectedTags([])
    setHomePriceMinDraft('')
    setHomePriceMaxDraft('')
    setHomeAppliedMinPrice(null)
    setHomeAppliedMaxPrice(null)
    setHomeShowSortMenu(false)
    setHomeShowFilterMenu(false)
    setHomeShowPriceMenu(false)
  }

  function clearAdminItemsFilters(): void {
    setAdminItemsSearchQuery('')
    setAdminItemsSortMode('Default')
    setAdminItemsSortAscending(true)
    setAdminItemsFilterRecommended(false)
    setAdminItemsFilterHiddenOnly(false)
    setAdminItemsFilterDiscountOnly(false)
    setAdminItemsPriceMinDraft('')
    setAdminItemsPriceMaxDraft('')
    setAdminItemsAppliedMinPrice(null)
    setAdminItemsAppliedMaxPrice(null)
    setAdminItemsSelectedCategory(null)
  }

  function clearFavoritesFilters(): void {
    setFavoritesQuery('')
    setFavoritesSelectedCategory(null)
    setFavoritesSortMode('Default')
    setFavoritesFilterRecommendedOnly(false)
    setFavoritesFilterOnSaleOnly(false)
    setFavoritesPriceMinDraft('')
    setFavoritesPriceMaxDraft('')
    setFavoritesAppliedMinPrice(null)
    setFavoritesAppliedMaxPrice(null)
    setFavoritesShowSortMenu(false)
    setFavoritesShowFilterMenu(false)
    setFavoritesShowPriceMenu(false)
  }

  function toggleTag(tagInput: string): void {
    const tag = tagInput.trim()
    if (!tag) return

    setSelectedTags(current => {
      if (current.includes(tag)) {
        return current.filter(item => item !== tag)
      }

      return [...current, tag]
    })
  }

  function onToggleTag(tag: string): void {
    toggleTag(tag)
  }

  function onSelectedTagsChange(tags: string[]): void {
    const nextTags = Array.from(
      new Set(
        tags
          .map(tag => tag.trim())
          .filter(Boolean)
      )
    )

    setSelectedTags(nextTags)
    void refreshHomeDishesFilteredFirstPage(currentHomeDishCloudFilters({
      selectedTags: nextTags
    }))
  }

  function onClearTags(): void {
    setSelectedTags([])
    void refreshHomeDishesFilteredFirstPage(currentHomeDishCloudFilters({
      selectedTags: []
    }))
  }

  function onSearchQueryChange(value: string): void {
    setSearchQuery(value)

    homeSearchRequestSeqRef.current += 1
    const requestSeq = homeSearchRequestSeqRef.current

    if (homeSearchDebounceTimerRef.current != null && isBrowser()) {
      window.clearTimeout(homeSearchDebounceTimerRef.current)
      homeSearchDebounceTimerRef.current = null
    }

    const nextFilters = currentHomeDishCloudFilters({
      searchQuery: value
    })

    if (!isBrowser()) {
      void refreshHomeDishesFilteredFirstPage(nextFilters, requestSeq)
      return
    }

    homeSearchDebounceTimerRef.current = window.setTimeout(() => {
      void refreshHomeDishesFilteredFirstPage(nextFilters, requestSeq)
    }, 350)
  }

  function onCategorySelected(value: string | null): void {
    const category = String(value || '').trim()
    const nextCategory = category || null

    setSelectedCategory(nextCategory)

    void refreshHomeDishesFilteredFirstPage(currentHomeDishCloudFilters({
      categoryName: nextCategory
    }))
  }
  function onAdminItemsCategorySelected(value: string | null): void {
    const category = String(value || '').trim()
    const nextCategory = category || null

    setAdminItemsSelectedCategory(nextCategory)

    void refreshAdminItemsFilteredFirstPage(currentAdminItemsCloudFilters({
      categoryName: nextCategory
    }))
  }
  function onSortModeChange(value: ShowcaseHomeSortMode): void {
    const nextSortMode = normalizeSortMode(value)

    setSortMode(nextSortMode)
    setHomeShowSortMenu(false)

    void refreshHomeDishesFilteredFirstPage(currentHomeDishCloudFilters({
      sortMode: nextSortMode
    }))
  }

  function onFilterRecommendedOnlyChange(value: boolean): void {
    setFilterRecommendedOnly(value)
    void refreshHomeDishesFilteredFirstPage(currentHomeDishCloudFilters({
      recommendedOnly: value
    }))
  }

  function onFilterOnSaleOnlyChange(value: boolean): void {
    setFilterOnSaleOnly(value)
    void refreshHomeDishesFilteredFirstPage(currentHomeDishCloudFilters({
      onSaleOnly: value
    }))
  }

  function onApplyHomeFilters(value: {
    recommendedOnly: boolean
    onSaleOnly: boolean
    minPriceDraft: string
    maxPriceDraft: string
  }): void {
    const min = parseHomePriceDraft(value.minPriceDraft)
    const max = parseHomePriceDraft(value.maxPriceDraft)
    const nextMin = min != null && max != null && min > max ? max : min
    const nextMax = min != null && max != null && min > max ? min : max

    setFilterRecommendedOnly(value.recommendedOnly)
    setFilterOnSaleOnly(value.onSaleOnly)
    setHomePriceMinDraft(value.minPriceDraft)
    setHomePriceMaxDraft(value.maxPriceDraft)
    setHomeAppliedMinPrice(nextMin)
    setHomeAppliedMaxPrice(nextMax)
    setHomeShowFilterMenu(false)

    void refreshHomeDishesFilteredFirstPage(currentHomeDishCloudFilters({
      recommendedOnly: value.recommendedOnly,
      onSaleOnly: value.onSaleOnly,
      minPrice: nextMin,
      maxPrice: nextMax
    }))
  }

  function onHomeShowSortMenuChange(value: boolean): void {
    setHomeShowSortMenu(value)
  }

  function onHomeShowFilterMenuChange(value: boolean): void {
    setHomeShowFilterMenu(value)
  }

  function onHomeShowPriceMenuChange(value: boolean): void {
    setHomeShowPriceMenu(value)
  }

  function onHomePriceMinDraftChange(value: string): void {
    setHomePriceMinDraft(value)
  }

  function onHomePriceMaxDraftChange(value: string): void {
    setHomePriceMaxDraft(value)
  }

  function onHomeApplyPriceRange(): void {
    const min = parseHomePriceDraft(homePriceMinDraft)
    const max = parseHomePriceDraft(homePriceMaxDraft)
    const nextMin = min != null && max != null && min > max ? max : min
    const nextMax = min != null && max != null && min > max ? min : max

    setHomeAppliedMinPrice(nextMin)
    setHomeAppliedMaxPrice(nextMax)
    setHomeShowPriceMenu(false)

    void refreshHomeDishesFilteredFirstPage(currentHomeDishCloudFilters({
      minPrice: nextMin,
      maxPrice: nextMax
    }))
  }

  function onHomeClearPriceRange(): void {
    setHomePriceMinDraft('')
    setHomePriceMaxDraft('')
    setHomeAppliedMinPrice(null)
    setHomeAppliedMaxPrice(null)
    setHomeShowPriceMenu(false)

    void refreshHomeDishesFilteredFirstPage(currentHomeDishCloudFilters({
      minPrice: null,
      maxPrice: null
    }))
  }

  function onClearSortAndFilters(): void {
    clearHomeSortAndFilters()

    void refreshHomeDishesFilteredFirstPage(currentHomeDishCloudFilters({
      searchQuery: '',
      selectedTags: [],
      recommendedOnly: false,
      onSaleOnly: false,
      minPrice: null,
      maxPrice: null,
      sortMode: 'Default'
    }))
  }

  function onClearAll(): void {
    clearHomeSortAndFilters()
    setSelectedCategory(null)
    setSelectedTags([])
    setHomePriceMinDraft('')
    setHomePriceMaxDraft('')
    setHomeAppliedMinPrice(null)
    setHomeAppliedMaxPrice(null)
    setHomeShowPriceMenu(false)

    void refreshHomeDishesFilteredFirstPage({
      categoryName: null,
      searchQuery: '',
      selectedTags: [],
      recommendedOnly: false,
      onSaleOnly: false,
      minPrice: null,
      maxPrice: null,
      includeHidden: false,
      hiddenOnly: false,
      sortMode: 'Default'
    })
  }

  function onHomeDishSelected(dishId: string): void {
    openDetail(dishId)
  }

  function onHomeProfileClick(): void {
    setPreviousScreen(ShowcaseScreens.Home)

    if (isAdminLoggedIn) {
      setScreen(ShowcaseScreens.Admin)
      void refreshAdminHomeCloudState(false)
      return
    }

    prepareLoginScreen(null)
    setScreen(ShowcaseScreens.Login)
  }

  function onLoginUsernameDraftChange(value: string): void {
    setLoginUsernameDraft(value)
    setLoginError(null)
  }

  function onLoginPasswordDraftChange(value: string): void {
    setLoginPasswordDraft(value)
    setLoginError(null)
  }

  function setLoginRememberMe(value: boolean): void {
    setLoginRememberMeDraft(value)
    writeRememberMe(value)

    if (!value) {
      clearPersistedMerchantSession(false)
      setStoreMerchantSessionFromAuthSession(null)
      bindMerchantSessionToRepository(repository)
      setMerchantSession(null)
      setMerchantBindings([])
      setIsAdminLoggedIn(false)
    }
  }

  function canLogin(): boolean {
    return Boolean(loginUsernameDraft.trim() && loginPasswordDraft.trim()) && !isLoginLoading
  }

  async function tryAdminLogin(username?: string, password?: string): Promise<void> {
    const nextUsername = typeof username === 'string' ? username : loginUsernameDraft
    const nextPassword = typeof password === 'string' ? password : loginPasswordDraft

    setLoginUsernameDraft(nextUsername)
    setLoginPasswordDraft(nextPassword)

    if (!nextUsername.trim() || !nextPassword.trim()) {
      setLoginError('Please enter account and password.')
      return
    }

    await signInMerchant(nextUsername, nextPassword)
  }

  function onFavoritesQueryChange(value: string): void {
    setFavoritesQuery(value)
  }

  function onFavoritesOpenDetail(dishId: string): void {
    openDetail(dishId)
  }

  function onFavoritesToggleSelect(dishId: string): void {
    toggleFavoriteSelection(dishId)
  }

  function onFavoritesClearSelection(): void {
    clearFavoritesSelection()
  }

  function onFavoritesDeleteSelected(): void {
    deleteSelectedFavorites()
  }

  function onFavoritesSortModeChange(value: ShowcaseHomeSortMode): void {
    setFavoritesSortMode(normalizeSortMode(value))
  }

  function onFavoritesFilterRecommendedOnlyChange(value: boolean): void {
    setFavoritesFilterRecommendedOnly(value)
  }

  function onFavoritesFilterOnSaleOnlyChange(value: boolean): void {
    setFavoritesFilterOnSaleOnly(value)
  }

  function onFavoritesClearSortAndFilters(): void {
    clearFavoritesFilters()
  }

  function onFavoritesShowSortMenuChange(value: boolean): void {
    setFavoritesShowSortMenu(value)
  }

  function onFavoritesShowFilterMenuChange(value: boolean): void {
    setFavoritesShowFilterMenu(value)
  }

  function onFavoritesShowPriceMenuChange(value: boolean): void {
    setFavoritesShowPriceMenu(value)
  }

  function onFavoritesPriceMinDraftChange(value: string): void {
    setFavoritesPriceMinDraft(value)
  }

  function onFavoritesPriceMaxDraftChange(value: string): void {
    setFavoritesPriceMaxDraft(value)
  }

  function onFavoritesApplyPriceRange(): void {
    applyPriceRangeFromDrafts(
      favoritesPriceMinDraft,
      favoritesPriceMaxDraft,
      setFavoritesAppliedMinPrice,
      setFavoritesAppliedMaxPrice
    )
    setFavoritesShowPriceMenu(false)
    setFavoritesShowFilterMenu(false)
  }

  function onFavoritesClearPriceRange(): void {
    setFavoritesPriceMinDraft('')
    setFavoritesPriceMaxDraft('')
    setFavoritesAppliedMinPrice(null)
    setFavoritesAppliedMaxPrice(null)
  }

  function onFavoritesCategorySelected(value: string | null): void {
    const category = String(value || '').trim()
    setFavoritesSelectedCategory(category || null)
  }

  function closeFavoritesPage(): void {
    closeFavorites()
  }

  async function openAppointmentForDish(dishIdInput: string): Promise<void> {
    const dishId = dishIdInput.trim()
    const dish = getDishEntityById(dishId) || await ensureDishEntityLoaded(dishId)

    if (!dish || dish.isSoldOut) {
      setStatusMessage('Please select an item first.')
      return
    }

    if (!appointmentsEnabled) {
      setStatusMessage('Appointment booking is not enabled.')
      return
    }

    const serviceTitle = getDishTitle(dish).trim() || 'Selected item'
    const originalDetailBackTarget = screen === ShowcaseScreens.Detail
      ? detailBackTargetRef.current || ShowcaseScreens.Home
      : ShowcaseScreens.Home

    appointmentDetailBackTargetRef.current = originalDetailBackTarget

    setAppointmentSourceDishId(dish.id)
    setAppointmentServiceDraft(serviceTitle)
    setAppointmentDateDraft('')
    setAppointmentTimeDraft('')
    setAppointmentError(null)
    setAppointmentSuccess(null)
    setPreviousScreen(screen)
    setScreen('Appointments')
  }

  async function submitAppointmentRequest(): Promise<void> {
    if (appointmentsRefreshing) {
      return
    }

    setAppointmentError(null)
    setAppointmentSuccess(null)

    if (guardOfflineWriteOperation()) {
      setAppointmentError('You are offline. Please reconnect and try again.')
      setAppointmentSuccess(null)
      return
    }

    if (!appointmentsEnabled) {
      setAppointmentError('Appointment booking is not enabled.')
      setAppointmentSuccess(null)
      return
    }

    const sourceDish = appointmentSourceDishId
      ? getDishEntityById(appointmentSourceDishId) || await ensureDishEntityLoaded(appointmentSourceDishId)
      : null

    const serviceTitle = sourceDish
      ? getDishTitle(sourceDish).trim()
      : appointmentServiceDraft.trim()

    const customerName = appointmentNameDraft.trim()
    const customerContact = appointmentContactDraft.trim()
    const preferredDate = appointmentDateDraft.trim()
    const preferredTime = appointmentTimeDraft.trim()
    const note = appointmentNoteDraft.trim()

    if (!customerName) {
      setAppointmentError('Please enter your name.')
      setAppointmentSuccess(null)
      return
    }

    if (!customerContact) {
      setAppointmentError('Please enter your contact information.')
      setAppointmentSuccess(null)
      return
    }

    if (!sourceDish || !serviceTitle) {
      setAppointmentError('Please select an item to book.')
      setAppointmentSuccess(null)
      return
    }

    if (!preferredDate) {
      setAppointmentError('Please select your preferred date.')
      setAppointmentSuccess(null)
      return
    }

    const availableDateValues = customerAppointmentDateChoices()
      .filter(option => option.available)
      .map(option => option.value)

    if (!availableDateValues.includes(preferredDate)) {
      setAppointmentError('Please select an available date.')
      setAppointmentSuccess(null)
      return
    }

    if (!preferredTime) {
      setAppointmentError('Please select your preferred time.')
      setAppointmentSuccess(null)
      return
    }

    const availableTimeValues = customerAppointmentTimeOptions(preferredDate)

    if (!availableTimeValues.includes(preferredTime)) {
      setAppointmentError('Please select an available time.')
      setAppointmentSuccess(null)
      return
    }

    setAppointmentsRefreshing(true)

    try {
      const created = await repository.submitAppointmentRequest({
        storeId,
        clientId,
        customerName,
        customerContact,
        serviceTitle: serviceTitle || 'Selected item',
        preferredDate,
        preferredTime,
        note,
        sourceDishId: sourceDish.id,
        sourcePriceSnapshot: encodeAppointmentPriceSnapshotFromDish(sourceDish),
        sourceImageUrlSnapshot: resolveDishImage(sourceDish),
        sourceCategorySnapshot: sourceDish.category || null,
        sourceRecommendedSnapshot: Boolean(sourceDish.isRecommended)
      })

      if (!created) {
        const detail = [
          repository.lastUpsertCode != null ? `code=${repository.lastUpsertCode}` : '',
          repository.lastUpsertBody ? `body=${repository.lastUpsertBody.slice(0, 300)}` : ''
        ].filter(Boolean).join(' ')

        throw new Error(detail || 'Booking request failed. Please check your connection.')
      }

      const next = [created, ...appointmentRequests.filter(item => item.id !== created.id)]

      setAppointmentRequests(next)
      saveAppointmentsToStorage(storeId, next)
      setScreen(ShowcaseScreens.CustomerBookings)
      setAppointmentNameDraft('')
      setAppointmentContactDraft('')
      setAppointmentDateDraft('')
      setAppointmentTimeDraft('')
      setAppointmentNoteDraft('')
      setAppointmentError(null)
      setAppointmentSuccess(null)
      setStatusMessage('Booking request sent. Check the status here.')

      await ensurePushRegistration({ audience: 'appointment_client' })
      await dispatchNewAppointmentPushToMerchant(created)
      await refreshCustomerAppointmentsFromCloud()
    } catch {
      setAppointmentError('Booking request failed. Please check your connection.')
      setAppointmentSuccess(null)
    } finally {
      setAppointmentsRefreshing(false)
    }
  }

  async function saveAppointmentSettings(
    value?: ShowcaseAppointmentSettingsSaveInput
  ): Promise<void> {
    if (guardOfflineWriteOperation()) {
      return
    }

    if (!value) {
      await saveAppointmentSettingsToCloud()
      return
    }

    const normalizedHours = normalizeAppointmentAvailableHoursText(value.availableHoursText)
    const nextSettings = currentAppointmentSettingsForCloud({
      enabled: value.enabled,
      bookingWindowDays: value.bookingWindowDays,
      availableStartTime: normalizedHours.start,
      availableEndTime: normalizedHours.end,
      slotIntervalMinutes: value.slotIntervalMinutes,
      closedDays: value.closedDays,
      minimumNotice: value.minimumNotice
    })

    await saveAppointmentSettingsToCloud(nextSettings)
  }

  async function refreshAppointments(): Promise<void> {
    if (isAdminLoggedIn) {
      await refreshAdminAppointmentsFromCloud()
    } else {
      await refreshCustomerAppointmentsFromCloud()
    }

    showSnackbar('Bookings refreshed.')
  }

async function updateAppointmentStatus(appointmentIdInput: string, statusInput: string): Promise<void> {
  if (appointmentStatusSubmittingId) return

  const appointmentId = appointmentIdInput.trim()
  const statusLabel = appointmentsStatusFromCloud(statusInput)
  const status = appointmentsStatusToCloud(statusLabel)

  if (!appointmentId || !status) return

  if (guardOfflineWriteOperation()) {
    return
  }

  setAppointmentStatusSubmittingId(appointmentId)

  const previous = appointmentRequests
  const previousTarget = previous.find(item => item.id === appointmentId) || null
  const previousStatus = previousTarget?.status || null

  const next = previous.map(item => {
    if (item.id !== appointmentId) return item

    return {
      ...item,
      status
    }
  })

  const nextTarget = next.find(item => item.id === appointmentId) || null

  setAppointmentRequests(next)
  saveAppointmentsToStorage(storeId, next)
  setStatusMessage(null)

  try {
    const validSession = await ensureValidMerchantSessionLoadedForCloud()

    if (!validSession) {
      setAppointmentRequests(previous)
      saveAppointmentsToStorage(storeId, previous)
      setStatusMessage(merchantSessionEnsureFailureMessage())
      showSnackbar(merchantSessionEnsureSnackbarMessage())
      return
    }

    setStoreMerchantSessionFromAuthSession(validSession)
    bindMerchantSessionToRepository(repository)

    let ok = await repository.updateAppointmentStatus({
      storeId,
      appointmentId,
      status
    })

    if (!ok) {
      const detail = [
        repository.lastUpsertCode != null ? `code=${repository.lastUpsertCode}` : '',
        repository.lastUpsertBody ? `body=${repository.lastUpsertBody.slice(0, 300)}` : ''
      ].filter(Boolean).join(' ')

      const retry = await retryMerchantCloudOperationAfterAuthRefresh({
        errorInput: new Error(detail || 'Appointment status update failed.'),
        operation: () => repository.updateAppointmentStatus({
          storeId,
          appointmentId,
          status
        }),
        isSuccess: value => value
      })

      if (retry.status === 'handled_without_retry') return

      if (retry.status === 'retried_success') {
        ok = true
      } else {
        throw new Error('Appointment status update failed.')
      }
    }

    if (previousStatus !== status && nextTarget) {
      await dispatchAppointmentStatusPushToCustomer(nextTarget, status)
    }

    await refreshAdminAppointmentsFromCloud('Appointment status updated.')
  } catch {
    setAppointmentRequests(previous)
    saveAppointmentsToStorage(storeId, previous)
    setStatusMessage('Appointment status update failed.')
    showSnackbar('Booking status update failed.')
  } finally {
    setAppointmentStatusSubmittingId(null)
  }
}
  function normalizeAppointmentAvailableHoursText(valueInput: string): {
    text: string
    start: string
    end: string
  } {
    const normalized = valueInput.trim().replace(/–/g, '-').replace(/\s*-\s*/g, '-')
    const parts = normalized.split('-').map(item => item.trim())
    const start = parts[0]?.match(/^\d{2}:\d{2}$/) ? parts[0] : '09:00'
    const end = parts[1]?.match(/^\d{2}:\d{2}$/) ? parts[1] : '18:00'

    if (start >= end) {
      return {
        text: '09:00 - 18:00',
        start: '09:00',
        end: '18:00'
      }
    }

    return {
      text: `${start} - ${end}`,
      start,
      end
    }
  }

  function normalizeAppointmentBookingWindowDays(valueInput: number): number {
    const rounded = Math.round(valueInput)

    return [1, 2, 3, 4, 5, 6, 7].includes(rounded) ? rounded : 7
  }

  function normalizeAppointmentSlotIntervalMinutes(valueInput: number): number {
    const rounded = Math.round(valueInput)

    return rounded === 30 || rounded === 60 ? rounded : 30
  }

  function normalizeAppointmentMinimumNotice(valueInput: string): string {
    const trimmed = valueInput.trim()

    return [
      'No notice',
      '1 hour',
      '2 hours',
      '6 hours',
      '12 hours',
      '1 day',
      '2 days',
      '3 days'
    ].includes(trimmed)
      ? trimmed
      : 'No notice'
  }

  function normalizeAppointmentClosedDays(valueInput: string[]): string[] {
    const allowedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    return allowedDays.filter(day => valueInput.includes(day))
  }

  function nextClosedDaysAfterToggle(current: string[], dayInput: string): string[] {
    const day = dayInput.trim()
    const allowedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    if (!allowedDays.includes(day)) {
      return normalizeAppointmentClosedDays(current)
    }

    if (current.includes(day)) {
      return normalizeAppointmentClosedDays(current.filter(item => item !== day))
    }

    return normalizeAppointmentClosedDays([...current, day])
  }

  function applyCloudAppointmentSettings(settingsInput: CloudAppointmentSettings | null): void {
    const settings = settingsInput || defaultAppointmentSettings(storeId)

    setAppointmentSettings(settings)
    setAppointmentsEnabled(settings.enabled)
    setAppointmentBookingWindowDays(settings.bookingWindowDays)
    setAppointmentAvailableHoursText(`${settings.availableStartTime} - ${settings.availableEndTime}`)
    setAppointmentSlotIntervalMinutes(settings.slotIntervalMinutes)
    setAppointmentClosedDays(settings.closedDays)
    setAppointmentMinimumNotice(settings.minimumNotice)
  }

  function appointmentPushTimeText(valueInput: number | string | null | undefined): string {
    if (typeof valueInput === 'number') {
      return formatDateTimeText(valueInput) || 'Just now'
    }

    if (typeof valueInput === 'string' && valueInput.trim()) {
      return valueInput.trim()
    }

    return 'Just now'
  }

  function appointmentStatusFromCloud(valueInput: string | null | undefined): string {
    return appointmentsStatusFromCloud(valueInput)
  }

  function appointmentStatusLabelForAdminFilter(valueInput: string | null | undefined): string {
    return appointmentStatusFromCloud(valueInput)
  }

  function currentAppointmentSettingsForCloud(
    overrides: Partial<CloudAppointmentSettings> = {}
  ): CloudAppointmentSettings {
    const normalizedHours = normalizeAppointmentAvailableHoursText(
      overrides.availableStartTime && overrides.availableEndTime
        ? `${overrides.availableStartTime} - ${overrides.availableEndTime}`
        : appointmentAvailableHoursText
    )

    const bookingWindowDays = normalizeAppointmentBookingWindowDays(
      Number(overrides.bookingWindowDays ?? appointmentBookingWindowDays)
    )

    const slotIntervalMinutes = normalizeAppointmentSlotIntervalMinutes(
      Number(overrides.slotIntervalMinutes ?? appointmentSlotIntervalMinutes)
    )

    const minimumNotice = normalizeAppointmentMinimumNotice(
      String(overrides.minimumNotice ?? appointmentMinimumNotice)
    )

    const closedDays = normalizeAppointmentClosedDays(
      Array.isArray(overrides.closedDays) ? overrides.closedDays : appointmentClosedDays
    )

    return {
      storeId,
      enabled: Boolean(overrides.enabled ?? appointmentsEnabled),
      bookingWindowDays,
      availableStartTime: String(overrides.availableStartTime || normalizedHours.start),
      availableEndTime: String(overrides.availableEndTime || normalizedHours.end),
      slotIntervalMinutes,
      closedDays,
      minimumNotice,
      updatedAt: nowMillis()
    }
  }

  function applyAppointmentSettingsLocally(settings: CloudAppointmentSettings): void {
    setAppointmentSettings(settings)
    setAppointmentsEnabled(settings.enabled)
    setAppointmentBookingWindowDays(settings.bookingWindowDays)
    setAppointmentAvailableHoursText(`${settings.availableStartTime} - ${settings.availableEndTime}`)
    setAppointmentSlotIntervalMinutes(settings.slotIntervalMinutes)
    setAppointmentClosedDays(settings.closedDays)
    setAppointmentMinimumNotice(settings.minimumNotice)
  }

  function customerAppointmentDateChoices(): ShowcaseAppointmentDateOption[] {
    return customerAppointmentDateOptions(appointmentSettings)
  }

  function customerAppointmentRuleSummary(): string {
    return `${appointmentSettings.availableStartTime}-${appointmentSettings.availableEndTime} · ${appointmentSettings.minimumNotice}`
  }

  function customerAppointmentTimeOptions(dateValue?: string | null): string[] {
    return customerAppointmentTimeOptionsForDate(
      appointmentSettings,
      dateValue || appointmentDateDraft
    )
  }

  function filteredAdminAppointments(): ShowcaseAppointmentCard[] {
    const today = appointmentLocalDateKey(new Date())
    const historyDate = appointmentAdminHistoryDateFilter?.trim() || ''
    const selectedDate = historyDate || appointmentAdminDateFilter.trim() || 'All'
    const selectedStatus = appointmentAdminStatusFilter.trim() || 'All'
    const selectedService = appointmentAdminServiceFilter.trim() || 'All'

    return appointmentCards
      .filter(item => {
        if (historyDate) {
          return item.preferredDate === historyDate
        }

        if (selectedDate === 'All') {
          return item.preferredDate >= today
        }

        return item.preferredDate === selectedDate
      })
      .filter(item => {
        const serviceTitle = item.serviceTitle?.trim() || 'General appointment'
        return selectedService === 'All' || serviceTitle === selectedService
      })
      .filter(item => {
        return selectedStatus === 'All' || item.statusLabel === selectedStatus
      })
      .sort((left, right) => {
        const leftPendingRank = left.statusLabel === 'Pending' ? 0 : 1
        const rightPendingRank = right.statusLabel === 'Pending' ? 0 : 1

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

  function filteredCustomerAppointments(): ShowcaseAppointmentCard[] {
    const selectedDate = appointmentCustomerDateFilter.trim() || 'All'
    const selectedStatus = appointmentCustomerStatusFilter.trim() || 'All'
    const selectedService = appointmentCustomerServiceFilter.trim() || 'All'
    const today = appointmentLocalDateKey(new Date())

    if (!customerAppointmentCards.length) return []

    return customerAppointmentCards
      .filter(item => {
        if (selectedDate === 'History') {
          return item.preferredDate < today
        }

        if (selectedDate === 'All') {
          return item.preferredDate >= today
        }

        return item.preferredDate === selectedDate
      })
      .filter(item => {
        const serviceTitle = item.serviceTitle?.trim() || 'General appointment'
        return selectedService === 'All' || serviceTitle === selectedService
      })
      .filter(item => {
        return selectedStatus === 'All' || item.statusLabel === selectedStatus
      })
      .sort((left, right) => {
        if (selectedDate === 'History') {
          const dateCompare = right.preferredDate.localeCompare(left.preferredDate)
          if (dateCompare !== 0) return dateCompare

          const timeCompare = right.preferredTime.localeCompare(left.preferredTime)
          if (timeCompare !== 0) return timeCompare

          return right.createdAtText.localeCompare(left.createdAtText)
        }

        const leftPendingRank = left.statusLabel === 'Pending' ? 0 : 1
        const rightPendingRank = right.statusLabel === 'Pending' ? 0 : 1

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

  function currentAdminAppointmentCloudFilters(input: {
    dateFilter?: string | null
    statusFilter?: string | null
    serviceFilter?: string | null
    historyDateFilter?: string | null
  } = {}): AppointmentCloudQueryFilters {
    const dateFilter = String(input.dateFilter ?? appointmentAdminDateFilter).trim() || 'All'
    const statusFilter = String(input.statusFilter ?? appointmentAdminStatusFilter).trim() || 'All'
    const serviceFilter = String(input.serviceFilter ?? appointmentAdminServiceFilter).trim() || 'All'
    const historyDateFilter = input.historyDateFilter === undefined
      ? appointmentAdminHistoryDateFilter
      : input.historyDateFilter

    return {
      ...appointmentCloudDateFiltersFromUi(dateFilter, historyDateFilter),
      status: appointmentCloudStatusFilterFromUi(statusFilter),
      serviceTitle: appointmentCloudServiceFilterFromUi(serviceFilter)
    }
  }

  function currentCustomerAppointmentCloudFilters(input: {
    dateFilter?: string | null
    statusFilter?: string | null
    serviceFilter?: string | null
  } = {}): AppointmentCloudQueryFilters {
    const dateFilter = String(input.dateFilter ?? appointmentCustomerDateFilter).trim() || 'All'
    const statusFilter = String(input.statusFilter ?? appointmentCustomerStatusFilter).trim() || 'All'
    const serviceFilter = String(input.serviceFilter ?? appointmentCustomerServiceFilter).trim() || 'All'

    return {
      ...appointmentCloudDateFiltersFromUi(dateFilter, null),
      status: appointmentCloudStatusFilterFromUi(statusFilter),
      serviceTitle: appointmentCloudServiceFilterFromUi(serviceFilter)
    }
  }

  function appointmentFilterRowsToFutureDateOptions(rows: CloudAppointmentFilterRow[]): string[] {
    const today = appointmentLocalDateKey(new Date())

    return [
      'All',
      ...Array.from(
        new Set(
          rows
            .map(item => item.preferredDate.trim())
            .filter(value => value && value >= today)
        )
      ).sort((left, right) => left.localeCompare(right))
    ]
  }

  function appointmentFilterRowMatchesDate(
    row: CloudAppointmentFilterRow,
    dateFilterInput: string,
    historyDateInput: string | null = null
  ): boolean {
    const today = appointmentLocalDateKey(new Date())
    const historyDate = String(historyDateInput || '').trim()
    const dateFilter = historyDate || String(dateFilterInput || '').trim() || 'All'

    if (dateFilter === 'History') return row.preferredDate < today
    if (dateFilter === 'All') return row.preferredDate >= today

    return row.preferredDate === dateFilter
  }

  function appointmentFilterRowMatchesStatus(
    row: CloudAppointmentFilterRow,
    statusFilterInput: string
  ): boolean {
    const statusFilter = String(statusFilterInput || '').trim() || 'All'

    if (statusFilter === 'All') return true

    return appointmentsStatusFromCloud(row.status) === statusFilter
  }

  function appointmentFilterRowsToServiceOptions(
    rows: CloudAppointmentFilterRow[],
    dateFilterInput: string,
    statusFilterInput: string,
    historyDateInput: string | null = null
  ): string[] {
    return [
      'All',
      ...Array.from(
        new Set(
          rows
            .filter(item => appointmentFilterRowMatchesDate(item, dateFilterInput, historyDateInput))
            .filter(item => appointmentFilterRowMatchesStatus(item, statusFilterInput))
            .map(item => item.serviceTitle.trim() || 'General appointment')
            .filter(Boolean)
        )
      )
    ]
  }

  function resetAdminAppointmentsPaginationForFirstPage(itemsLength: number): void {
    setAdminAppointmentsPagination({
      nextOffset: itemsLength,
      hasMore: itemsLength >= SHOWCASE_PAGE_SIZE.merchantAppointments,
      isLoadingMore: false
    })
  }

  function resetCustomerAppointmentsPaginationForFirstPage(itemsLength: number): void {
    setCustomerAppointmentsPagination({
      nextOffset: itemsLength,
      hasMore: itemsLength >= SHOWCASE_PAGE_SIZE.clientAppointments,
      isLoadingMore: false
    })
  }

  function onAppointmentAdminDateFilterChange(value: string): void {
    const nextDateFilter = value.trim() || 'All'

    setAppointmentAdminDateFilter(nextDateFilter)
    setAppointmentAdminHistoryDateFilter(null)
    setAppointmentAdminServiceFilter('All')

    void refreshAdminAppointmentsFromCloud(null, currentAdminAppointmentCloudFilters({
      dateFilter: nextDateFilter,
      historyDateFilter: null,
      serviceFilter: 'All'
    }))
  }

  function onAppointmentAdminHistoryDateClear(): void {
    setAppointmentAdminHistoryDateFilter(null)
    setAppointmentAdminDateFilter('All')
    setAppointmentAdminServiceFilter('All')

    void refreshAdminAppointmentsFromCloud(null, currentAdminAppointmentCloudFilters({
      dateFilter: 'All',
      historyDateFilter: null,
      serviceFilter: 'All'
    }))
  }

  function onAppointmentAdminHistoryDateSelected(value: string): void {
    const safeValue = value.trim()

    if (!/^\d{4}-\d{2}-\d{2}$/.test(safeValue)) return

    setAppointmentAdminHistoryDateFilter(safeValue)
    setAppointmentAdminDateFilter('All')
    setAppointmentAdminServiceFilter('All')

    void refreshAdminAppointmentsFromCloud(null, currentAdminAppointmentCloudFilters({
      dateFilter: 'All',
      historyDateFilter: safeValue,
      serviceFilter: 'All'
    }))
  }

  function onAppointmentAdminServiceFilterChange(value: string): void {
    const nextServiceFilter = value.trim() || 'All'

    setAppointmentAdminServiceFilter(nextServiceFilter)

    void refreshAdminAppointmentsFromCloud(null, currentAdminAppointmentCloudFilters({
      serviceFilter: nextServiceFilter
    }))
  }

  function onAppointmentAdminStatusFilterChange(value: string): void {
    const nextStatusFilter = value.trim() || 'All'

    setAppointmentAdminStatusFilter(nextStatusFilter)
    setAppointmentAdminServiceFilter('All')

    void refreshAdminAppointmentsFromCloud(null, currentAdminAppointmentCloudFilters({
      statusFilter: nextStatusFilter,
      serviceFilter: 'All'
    }))
  }

  function onAppointmentAvailableHoursTextChange(value: string): void {
    if (guardOfflineWriteOperation()) {
      return
    }

    const normalizedHours = normalizeAppointmentAvailableHoursText(value)
    const nextSettings = currentAppointmentSettingsForCloud({
      availableStartTime: normalizedHours.start,
      availableEndTime: normalizedHours.end
    })

    applyAppointmentSettingsLocally(nextSettings)
    setStatusMessage('Available hours updated.')

    void saveAppointmentSettingsToCloud(nextSettings)
  }

  function onAppointmentBookingWindowDaysChange(value: number): void {
    if (guardOfflineWriteOperation()) {
      return
    }

    const safeDays = normalizeAppointmentBookingWindowDays(value)
    const nextSettings = currentAppointmentSettingsForCloud({
      bookingWindowDays: safeDays
    })

    applyAppointmentSettingsLocally(nextSettings)
    setStatusMessage('Booking window updated.')

    void saveAppointmentSettingsToCloud(nextSettings)
  }

  function onAppointmentClosedDayToggle(value: string): void {
    if (guardOfflineWriteOperation()) {
      return
    }

    const nextClosedDays = nextClosedDaysAfterToggle(appointmentClosedDays, value)
    const nextSettings = currentAppointmentSettingsForCloud({
      closedDays: nextClosedDays
    })

    applyAppointmentSettingsLocally(nextSettings)
    setStatusMessage('Closed days updated.')

    void saveAppointmentSettingsToCloud(nextSettings)
  }

  function onAppointmentContactDraftChange(value: string): void {
    setAppointmentContactDraft(value)
    setAppointmentError(null)
    setAppointmentSuccess(null)
  }

  function onAppointmentCustomerDateFilterChange(value: string): void {
    const nextDateFilter = value.trim() || 'All'

    setAppointmentCustomerDateFilter(nextDateFilter)
    setAppointmentCustomerServiceFilter('All')

    void refreshCustomerAppointmentsFromCloud(null, currentCustomerAppointmentCloudFilters({
      dateFilter: nextDateFilter,
      serviceFilter: 'All'
    }))
  }

  function onAppointmentCustomerServiceFilterChange(value: string): void {
    const nextServiceFilter = value.trim() || 'All'

    setAppointmentCustomerServiceFilter(nextServiceFilter)

    void refreshCustomerAppointmentsFromCloud(null, currentCustomerAppointmentCloudFilters({
      serviceFilter: nextServiceFilter
    }))
  }

  function onAppointmentCustomerStatusFilterChange(value: string): void {
    const nextStatusFilter = value.trim() || 'All'

    setAppointmentCustomerStatusFilter(nextStatusFilter)
    setAppointmentCustomerServiceFilter('All')

    void refreshCustomerAppointmentsFromCloud(null, currentCustomerAppointmentCloudFilters({
      statusFilter: nextStatusFilter,
      serviceFilter: 'All'
    }))
  }

  function onAppointmentDateDraftChange(value: string): void {
    setAppointmentDateDraft(value)
    setAppointmentTimeDraft('')
    setAppointmentError(null)
    setAppointmentSuccess(null)
  }

  function onAppointmentMinimumNoticeChange(value: string): void {
    if (guardOfflineWriteOperation()) {
      return
    }

    const safeValue = normalizeAppointmentMinimumNotice(value)
    const nextSettings = currentAppointmentSettingsForCloud({
      minimumNotice: safeValue
    })

    applyAppointmentSettingsLocally(nextSettings)
    setStatusMessage('Minimum notice updated.')

    void saveAppointmentSettingsToCloud(nextSettings)
  }

  function onAppointmentNameDraftChange(value: string): void {
    setAppointmentNameDraft(value)
    setAppointmentError(null)
    setAppointmentSuccess(null)
  }

  function onAppointmentNoteDraftChange(value: string): void {
    setAppointmentNoteDraft(value)
    setAppointmentError(null)
    setAppointmentSuccess(null)
  }

  function onAppointmentServiceDraftChange(value: string): void {
    setAppointmentServiceDraft(value)
    setAppointmentError(null)
    setAppointmentSuccess(null)
  }

  function onAppointmentSlotIntervalMinutesChange(value: number): void {
    if (guardOfflineWriteOperation()) {
      return
    }

    const safeMinutes = normalizeAppointmentSlotIntervalMinutes(value)
    const nextSettings = currentAppointmentSettingsForCloud({
      slotIntervalMinutes: safeMinutes
    })

    applyAppointmentSettingsLocally(nextSettings)
    setStatusMessage('Slot interval updated.')

    void saveAppointmentSettingsToCloud(nextSettings)
  }

  function onAppointmentTimeDraftChange(value: string): void {
    setAppointmentTimeDraft(value)
    setAppointmentError(null)
    setAppointmentSuccess(null)
  }

  function onAppointmentsEnabledChange(value: boolean): void {
    if (guardOfflineWriteOperation()) {
      return
    }

    const nextSettings = currentAppointmentSettingsForCloud({
      enabled: value
    })

    applyAppointmentSettingsLocally(nextSettings)
    setStatusMessage(value ? 'Appointment booking enabled.' : 'Appointment booking disabled.')

    void saveAppointmentSettingsToCloud(nextSettings)
  }

async function loadMoreHomeDishes(): Promise<void> {
  if (homePagination.isLoadingMore || !homePagination.hasMore) return

  setHomePagination(current => ({
    nextOffset: current.nextOffset,
    hasMore: current.hasMore,
    isLoadingMore: true
  }))

  try {
    const nextItems = await fetchHomeDishesFilteredPage(
      currentHomeDishCloudFilters(),
      homePagination.nextOffset
    )
    const currentItems = dishesFromIds(homeDishIds)
    const merged = sortedDishesForStorage(mergeUniqueById(currentItems, nextItems))

    setHomeDishIds(mergeDishIds(homeDishIds, nextItems))
    setDishes(merged)
    refreshFavoritesList(merged)
    setPendingSyncOperations(buildPendingDishSyncOperations(merged))

    setHomePagination({
      nextOffset: homePagination.nextOffset + nextItems.length,
      hasMore: nextItems.length >= SHOWCASE_PAGE_SIZE.homeDishes,
      isLoadingMore: false
    })
  } catch (error) {
    setHomePagination(current => ({
      nextOffset: current.nextOffset,
      hasMore: current.hasMore,
      isLoadingMore: false
    }))
    setStatusMessage(error instanceof Error ? error.message : 'Failed to load more items.')
  }
}

async function loadMoreAdminItems(): Promise<void> {
  if (adminItemsPagination.isLoadingMore || !adminItemsPagination.hasMore) return

  setAdminItemsPagination(current => ({
    nextOffset: current.nextOffset,
    hasMore: current.hasMore,
    isLoadingMore: true
  }))

  try {
    const validSession = await ensureValidMerchantSessionLoadedForCloud()

    if (!validSession) {
      setStatusMessage(merchantSessionEnsureFailureMessage())
      setAdminItemsPagination(current => ({
        nextOffset: current.nextOffset,
        hasMore: current.hasMore,
        isLoadingMore: false
      }))
      return
    }

    setStoreMerchantSessionFromAuthSession(validSession)
    bindMerchantSessionToRepository(repository)

    const nextItems = await fetchAdminItemsFilteredPage(
      currentAdminItemsCloudFilters(),
      adminItemsPagination.nextOffset
    )
    const currentItems = dishesFromIds(adminItemIds)
    const merged = sortedDishesForStorage(mergeUniqueById(currentItems, nextItems))

    setAdminItemIds(mergeDishIds(adminItemIds, nextItems))
    setDishes(merged)
    refreshFavoritesList(merged)
    setPendingSyncOperations(buildPendingDishSyncOperations(merged))

    setAdminItemsPagination({
      nextOffset: adminItemsPagination.nextOffset + nextItems.length,
      hasMore: nextItems.length >= SHOWCASE_PAGE_SIZE.adminItems,
      isLoadingMore: false
    })
  } catch (error) {
    setAdminItemsPagination(current => ({
      nextOffset: current.nextOffset,
      hasMore: current.hasMore,
      isLoadingMore: false
    }))
    setStatusMessage(error instanceof Error ? error.message : 'Failed to load more items.')
  }
}

async function refreshAdminAppointmentsFromCloud(
  statusMessageOverride: string | null = null,
  filtersInput: AppointmentCloudQueryFilters = currentAdminAppointmentCloudFilters()
): Promise<void> {
  setAppointmentsRefreshing(true)

  try {
    const validSession = await ensureValidMerchantSessionLoadedForCloud()

    if (!validSession) {
      setStatusMessage(merchantSessionEnsureFailureMessage())
      setAdminAppointmentFilterRows([])
      return
    }

    setStoreMerchantSessionFromAuthSession(validSession)
    bindMerchantSessionToRepository(repository)

    const cloudSettings = await repository.fetchAppointmentSettings(storeId)

    if (cloudSettings) {
      applyCloudAppointmentSettings(cloudSettings)
    }

    const filterRows = await repository.fetchAppointmentFilterRows({
      storeId,
      merchant: true
    })

    setAdminAppointmentFilterRows(filterRows)

    const items = await repository.fetchAppointmentRequests({
      storeId,
      merchant: true,
      preferredDate: filtersInput.preferredDate,
      preferredDateGte: filtersInput.preferredDateGte,
      preferredDateLt: filtersInput.preferredDateLt,
      status: filtersInput.status,
      serviceTitle: filtersInput.serviceTitle,
      limit: SHOWCASE_PAGE_SIZE.merchantAppointments,
      offset: 0
    })
    const sortedItems = items.slice().sort((left, right) => {
      return (right.createdAt || 0) - (left.createdAt || 0)
    })

    setAppointmentRequests(sortedItems)
    saveAppointmentsToStorage(storeId, sortedItems)
    void hydrateAppointmentLinkedDishesFromRequests(sortedItems)
    resetAdminAppointmentsPaginationForFirstPage(sortedItems.length)
    setStatusMessage(statusMessageOverride || 'Appointments refreshed.')
  } catch (error) {
    const cachedItems = loadAppointmentsFromStorage(storeId)

    if (cachedItems.length) {
      setAppointmentRequests(cachedItems)
    }

    resetAdminAppointmentsPaginationForFirstPage(cachedItems.length)

    const message = error instanceof Error
      ? error.message
      : 'Appointments refresh failed.'

    setStatusMessage(message || 'Appointments refresh failed.')
  } finally {
    setAppointmentsRefreshing(false)
  }
}

async function refreshCustomerAppointmentsFromCloud(
  statusMessageOverride: string | null = null,
  filtersInput: AppointmentCloudQueryFilters = currentCustomerAppointmentCloudFilters()
): Promise<void> {
  setAppointmentsRefreshing(true)

  try {
    const cloudSettings = await repository.fetchAppointmentSettings(storeId)

    if (cloudSettings) {
      applyCloudAppointmentSettings(cloudSettings)
    }

    const filterRows = await repository.fetchAppointmentFilterRows({
      storeId,
      clientId,
      merchant: false
    })

    setCustomerAppointmentFilterRows(filterRows)

    const items = await repository.fetchAppointmentRequests({
      storeId,
      clientId,
      merchant: false,
      preferredDate: filtersInput.preferredDate,
      preferredDateGte: filtersInput.preferredDateGte,
      preferredDateLt: filtersInput.preferredDateLt,
      status: filtersInput.status,
      serviceTitle: filtersInput.serviceTitle,
      limit: SHOWCASE_PAGE_SIZE.clientAppointments,
      offset: 0
    })
    const sortedItems = items.slice().sort((left, right) => {
      return (right.createdAt || 0) - (left.createdAt || 0)
    })

    setAppointmentRequests(sortedItems)
    saveAppointmentsToStorage(storeId, sortedItems)
    void hydrateAppointmentLinkedDishesFromRequests(sortedItems)
    resetCustomerAppointmentsPaginationForFirstPage(sortedItems.length)
    setStatusMessage(statusMessageOverride || 'Bookings refreshed.')
  } catch {
    const cachedItems = loadAppointmentsFromStorage(storeId)

    if (cachedItems.length) {
      setAppointmentRequests(cachedItems)
    }

    resetCustomerAppointmentsPaginationForFirstPage(cachedItems.length)

    setStatusMessage('Bookings refresh failed.')
  } finally {
    setAppointmentsRefreshing(false)
  }
}

  async function saveAppointmentSettingsToCloud(settingsInput?: CloudAppointmentSettings): Promise<void> {
    const nextSettings = settingsInput || currentAppointmentSettingsForCloud()

    setAppointmentSettingsSubmitting(true)
    applyAppointmentSettingsLocally(nextSettings)

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      let ok = await repository.upsertAppointmentSettings(nextSettings)

      if (!ok) {
        const detail = [
          repository.lastUpsertCode != null ? `code=${repository.lastUpsertCode}` : '',
          repository.lastUpsertBody ? `body=${repository.lastUpsertBody.slice(0, 300)}` : ''
        ].filter(Boolean).join(' ')

        const retry = await retryMerchantCloudOperationAfterAuthRefresh({
          errorInput: new Error(detail || 'Appointment settings save failed.'),
          operation: () => repository.upsertAppointmentSettings(nextSettings),
          isSuccess: value => value
        })

        if (retry.status === 'handled_without_retry') return

        if (retry.status === 'retried_success') {
          ok = true
        } else {
          throw new Error('Appointment settings save failed.')
        }
      }

      removePendingSync('appointment-settings-upsert')
      setStatusMessage('Booking settings saved.')
      showSnackbar('Booking settings saved.')
    } catch {
      pushPendingSync({
        id: 'appointment-settings-upsert',
        type: 'appointment-settings-upsert',
        createdAt: nowMillis()
      })

      setStatusMessage('Booking settings saved locally, but cloud sync failed.')
      showSnackbar('Booking settings queued for sync.')
    } finally {
      setAppointmentSettingsSubmitting(false)
    }
  }

  function startNewAnnouncement(): void {
    clearAdminAnnouncementEditorDraftLocally(storeId)
    clearAdminAnnouncementDraftLocalImages(storeId)

    setAdminAnnouncementEditingId(null)
    setAdminAnnouncementCoverDraftUrl(null)
    setAdminAnnouncementBodyDraft('')
    setAdminAnnouncementSelectedIds([])
    setAdminAnnouncementPreviewId(null)
    setAdminAnnouncementError(null)
    setAdminAnnouncementSuccess(null)
    setAdminAnnouncementIsSubmitting(false)
    setAdminAnnouncementIsBlocking(false)
    setAdminAnnouncementComposerExpanded(true)
  }

  function editAnnouncement(idInput: string): void {
    const id = idInput.trim()
    if (!id) return

    const draft = adminAnnouncementDraftItems.find(item => {
      return item.id === id && item.status === 'draft'
    }) || null

    if (!draft) return

    setAdminAnnouncementEditingId(draft.id)
    setAdminAnnouncementCoverDraftUrl(draft.coverUrl)
    setAdminAnnouncementBodyDraft(draft.body)
    setAdminAnnouncementSelectedIds([])
    setAdminAnnouncementPreviewId(null)
    setAdminAnnouncementError(null)
    setAdminAnnouncementSuccess(null)
    setAdminAnnouncementComposerExpanded(true)

    persistAdminAnnouncementEditorDraftLocally(storeId, {
      id: draft.id,
      coverUrl: draft.coverUrl,
      coverImageVariants: draft.coverImageVariants ?? null,
      body: draft.body,
      status: 'draft',
      createdAt: draft.createdAt || nowMillis(),
      updatedAt: draft.updatedAt || nowMillis(),
      viewCount: draft.viewCount || 0
    })
  }

  async function saveAnnouncement(status: 'draft' | 'published'): Promise<void> {
    const draftBody = adminAnnouncementBodyDraft.trim()
    const selectedIds = adminAnnouncementSelectedIds
      .map(id => id.trim())
      .filter(Boolean)

    const selectedDraft = status === 'published' && !draftBody && selectedIds.length === 1
      ? adminAnnouncementDraftItems.find(item => item.id === selectedIds[0] && item.status === 'draft') || null
      : null

    if (!draftBody && !selectedDraft) {
      setAdminAnnouncementError('Content is required.')
      setAdminAnnouncementSuccess(null)
      return
    }

    if (guardOfflineWriteOperation()) {
      setAdminAnnouncementError('You are offline. Please reconnect and try again.')
      setAdminAnnouncementSuccess(null)
      return
    }

    const now = nowMillis()
    const editingPublished = adminAnnouncementEditingId
      ? announcements.some(item => item.id === adminAnnouncementEditingId && item.status !== 'draft')
      : false

    const editingDraft = adminAnnouncementEditingId && !editingPublished
      ? adminAnnouncementDraftItems.find(item => {
        return item.id === adminAnnouncementEditingId && item.status === 'draft'
      }) || null
      : null

    const safeEditingId = adminAnnouncementEditingId && !editingPublished
      ? adminAnnouncementEditingId
      : null

    const targetId = selectedDraft?.id || editingDraft?.id || safeEditingId || createUuidLikeId()
    const existingEntity = selectedDraft || editingDraft || null
    const body = selectedDraft?.body?.trim() || draftBody
    const sourceCoverUrl = selectedDraft?.coverUrl || adminAnnouncementCoverDraftUrl?.trim() || null
    const nextStatus = status
    const viewCount = selectedDraft?.viewCount || existingEntity?.viewCount || 0

    setAdminAnnouncementError(null)
    setAdminAnnouncementSuccess(null)
    setAdminAnnouncementSubmittingAction(nextStatus === 'published' ? 'publish' : 'save')
    setAdminAnnouncementIsSubmitting(true)
    setAdminAnnouncementIsBlocking(true)
    setStatusMessage(null)

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setAdminAnnouncementError(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      let uploadedCoverUrl: string | null = sourceCoverUrl
      let coverImageVariants: ShowcaseImageVariants | null = existingEntity?.coverImageVariants ?? null

      if (uploadedCoverUrl) {
        const uploadedCover = await uploadAnnouncementCoverIfNeeded(uploadedCoverUrl)

        if (!uploadedCover) {
          const handled = await handleMerchantAuthExpiredIfNeeded(
            new Error(nextStatus === 'published' ? 'Cloud publish failed.' : 'Cloud save failed.')
          )

          if (handled) {
            setAdminAnnouncementIsSubmitting(false)
            setAdminAnnouncementIsBlocking(false)
            setAdminAnnouncementSubmittingAction(null)
            return
          }

          throw new Error(nextStatus === 'published' ? 'Cloud publish failed.' : 'Cloud save failed.')
        }

        uploadedCoverUrl = uploadedCover.url
        coverImageVariants = uploadedCover.variants
      }

      let saved = await repository.upsertAnnouncement({
        id: targetId,
        storeId,
        coverUrl: uploadedCoverUrl,
        coverImageVariants,
        body,
        status: nextStatus,
        updatedAt: now,
        viewCount
      })

      if (!saved) {
        const detail = [
          repository.lastAnnouncementUpsertCode != null ? `code=${repository.lastAnnouncementUpsertCode}` : '',
          repository.lastAnnouncementUpsertBody ? `body=${repository.lastAnnouncementUpsertBody.slice(0, 300)}` : ''
        ].filter(Boolean).join(' ')

        const retry = await retryMerchantCloudOperationAfterAuthRefresh({
          errorInput: new Error(detail || (nextStatus === 'published' ? 'Cloud publish failed.' : 'Cloud save failed.')),
          operation: () => repository.upsertAnnouncement({
            id: targetId,
            storeId,
            coverUrl: uploadedCoverUrl,
            coverImageVariants,
            body,
            status: nextStatus,
            updatedAt: now,
            viewCount
          }),
          isSuccess: value => Boolean(value)
        })

        if (retry.status === 'handled_without_retry') {
          setAdminAnnouncementIsSubmitting(false)
          setAdminAnnouncementIsBlocking(false)
          return
        }

        if (retry.status === 'retried_success' && retry.value) {
          saved = retry.value
        } else {
          throw new Error(nextStatus === 'published' ? 'Cloud publish failed.' : 'Cloud save failed.')
        }
      }

      if (nextStatus === 'published') {
        let pushOk = await repository.dispatchAnnouncementPush({
          storeId,
          announcementId: targetId,
          bodyPreview: 'Posted a new announcement'
        })

        if (!pushOk) {
          const detail = [
            repository.lastAnnouncementPushCode != null ? `code=${repository.lastAnnouncementPushCode}` : '',
            repository.lastAnnouncementPushBody ? `body=${repository.lastAnnouncementPushBody.slice(0, 300)}` : ''
          ].filter(Boolean).join(' ')

          const retry = await retryMerchantCloudOperationAfterAuthRefresh({
            errorInput: new Error(detail || 'Announcement push failed.'),
            operation: () => repository.dispatchAnnouncementPush({
              storeId,
              announcementId: targetId,
              bodyPreview: 'Posted a new announcement'
            }),
            isSuccess: value => value
          })

          if (retry.status === 'handled_without_retry') {
            setAdminAnnouncementIsSubmitting(false)
            setAdminAnnouncementIsBlocking(false)
            return
          }

          if (retry.status === 'retried_success') {
            pushOk = true
          }
        }

        setAdminAnnouncementDraftItems(current => {
          return current.filter(item => item.id !== targetId)
        })

        setAdminAnnouncementSelectedIds(current => {
          return current.filter(id => id !== targetId)
        })

        setAdminAnnouncementPreviewId(current => {
          return current === targetId ? null : current
        })

        setPushTargetAnnouncementId(targetId)
      }

      clearAdminAnnouncementDraftLocalImages(storeId)
      clearAdminAnnouncementEditorDraftLocally(storeId)

      const latestAnnouncements = await repository.fetchAnnouncements({
        storeId,
        includeDrafts: true,
        limit: SHOWCASE_PAGE_SIZE.adminAnnouncements,
        offset: 0
      })

      rebuildAnnouncementsList(latestAnnouncements)

      setAdminAnnouncementComposerExpanded(false)
      setAdminAnnouncementCoverDraftUrl(null)
      setAdminAnnouncementBodyDraft('')
      setAdminAnnouncementEditingId(null)
      setAdminAnnouncementSelectedIds([])
      setAdminAnnouncementPreviewId(null)
      setAdminAnnouncementError(null)
      setAdminAnnouncementSuccess(nextStatus === 'published' ? 'Announcement published.' : 'Draft saved.')
      setAdminAnnouncementIsSubmitting(false)
      setAdminAnnouncementIsBlocking(false)
      setAdminAnnouncementSubmittingAction(null)
      setStatusMessage(nextStatus === 'published' ? 'Announcement published.' : 'Draft saved.')
      removePendingSync(`announcement-upsert:${targetId}`)

      if (nextStatus === 'published') {
        await new Promise<void>(resolve => {
          window.setTimeout(resolve, 800)
        })

        setScreen('Admin')
        setStatusMessage(null)
        void refreshAdminHomeCloudState(false)
      }
    } catch (error) {
      const message = error instanceof Error && error.message.trim()
        ? error.message.trim()
        : nextStatus === 'published'
          ? 'Cloud publish failed.'
          : 'Cloud save failed.'

      setAdminAnnouncementError(message)
      setAdminAnnouncementSuccess(null)
      setAdminAnnouncementIsSubmitting(false)
      setAdminAnnouncementIsBlocking(false)
      setAdminAnnouncementSubmittingAction(null)
      setStatusMessage(nextStatus === 'published'
        ? `Couldn't publish announcement. ${message}`
        : `Couldn't save draft. ${message}`)
    }
  }

  async function deleteSelectedAnnouncements(): Promise<void> {
    if (adminAnnouncementIsSubmitting) return

    const draftIdSet = new Set(
      adminAnnouncementDraftItems
        .filter(item => item.status === 'draft')
        .map(item => item.id)
    )

    const selected = adminAnnouncementSelectedIds
      .map(id => id.trim())
      .filter(id => id && draftIdSet.has(id))

    if (!selected.length) return

    if (guardOfflineWriteOperation()) {
      setAdminAnnouncementError('You are offline. Please reconnect and try again.')
      setAdminAnnouncementSuccess(null)
      return
    }

    setAdminAnnouncementSubmittingAction('delete')
    setAdminAnnouncementIsSubmitting(true)
    setAdminAnnouncementIsBlocking(true)
    setAdminAnnouncementError(null)
    setAdminAnnouncementSuccess(null)
    setStatusMessage(null)

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setAdminAnnouncementError(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      let deleteOk = await repository.deleteAnnouncements(storeId, selected)

      if (!deleteOk) {
        const detail = [
          repository.lastDeleteCode != null ? `code=${repository.lastDeleteCode}` : '',
          repository.lastDeleteBody ? `body=${repository.lastDeleteBody.slice(0, 300)}` : ''
        ].filter(Boolean).join(' ')

        const retry = await retryMerchantCloudOperationAfterAuthRefresh({
          errorInput: new Error(detail || 'Delete announcements failed.'),
          operation: () => repository.deleteAnnouncements(storeId, selected),
          isSuccess: value => value
        })

        if (retry.status === 'handled_without_retry') return

        if (retry.status === 'retried_success') {
          deleteOk = true
        } else {
          throw new Error('Delete announcements failed.')
        }
      }

      setAdminAnnouncementDraftItems(current => {
        return current.filter(item => {
          return item.status !== 'draft' || !selected.includes(item.id)
        })
      })

      const clearedEditingId = adminAnnouncementEditingId && selected.includes(adminAnnouncementEditingId)
        ? null
        : adminAnnouncementEditingId

      const clearedCover = clearedEditingId == null
        ? null
        : adminAnnouncementCoverDraftUrl

      const clearedBody = clearedEditingId == null
        ? ''
        : adminAnnouncementBodyDraft

      const clearedPreviewId = adminAnnouncementPreviewId && selected.includes(adminAnnouncementPreviewId)
        ? null
        : adminAnnouncementPreviewId

      setAdminAnnouncementEditingId(clearedEditingId)
      setAdminAnnouncementCoverDraftUrl(clearedCover)
      setAdminAnnouncementBodyDraft(clearedBody)
      setAdminAnnouncementSelectedIds([])
      setAdminAnnouncementPreviewId(clearedPreviewId)
      setAdminAnnouncementError(null)
      setAdminAnnouncementSuccess(`Deleted ${selected.length} draft(s).`)

      if (clearedEditingId == null) {
        clearAdminAnnouncementEditorDraftLocally(storeId)
      } else {
        const draft = toAnnouncementEntity({
          id: clearedEditingId,
          coverUrl: clearedCover,
          body: clearedBody,
          status: 'draft',
          viewCount: 0
        })

        persistAdminAnnouncementEditorDraftLocally(storeId, draft)
      }
    } catch (error) {
      const message = error instanceof Error && error.message.trim()
        ? error.message.trim()
        : 'Delete announcements failed.'

      setAdminAnnouncementError(message)
      setAdminAnnouncementSuccess(null)
      setStatusMessage(message)
    } finally {
      setAdminAnnouncementIsSubmitting(false)
      setAdminAnnouncementIsBlocking(false)
      setAdminAnnouncementSubmittingAction(null)
    }
  }

  function hasAnnouncementBeenViewedLocally(idInput: string): boolean {
    const id = idInput.trim()
    if (!id) return false
    return seenAnnouncementIds.includes(id) || loadViewedAnnouncementIdsLocally(storeId).includes(id)
  }

  function markAnnouncementViewedLocally(idInput: string): void {
    const id = idInput.trim()
    if (!id) return

    const viewed = loadViewedAnnouncementIdsLocally(storeId)
    const nextViewed = Array.from(new Set([...viewed, id]))

    if (nextViewed.length !== viewed.length) {
      saveViewedAnnouncementIdsLocally(storeId, nextViewed)
    }

    setSeenAnnouncementIds(current => {
      if (current.includes(id)) return current
      return [...current, id]
    })
  }

  function markAnnouncementsViewedLocally(idsInput: string[]): void {
    const ids = Array.from(
      new Set(
        idsInput
          .map(id => id.trim())
          .filter(Boolean)
      )
    )

    if (!ids.length) return

    const viewed = loadViewedAnnouncementIdsLocally(storeId)
    const nextViewed = Array.from(new Set([...viewed, ...ids]))

    if (nextViewed.length !== viewed.length) {
      saveViewedAnnouncementIdsLocally(storeId, nextViewed)
    }

    setSeenAnnouncementIds(current => {
      const nextSeen = Array.from(new Set([...current, ...ids]))
      return nextSeen.length === current.length ? current : nextSeen
    })
  }

  function hasAnnouncementClickBeenCountedLocally(idInput: string): boolean {
    const id = idInput.trim()
    if (!id) return false
    return loadCountedAnnouncementClickIdsLocally(storeId).includes(id)
  }

  function markAnnouncementClickCountedLocally(idInput: string): void {
    const id = idInput.trim()
    if (!id) return

    const counted = loadCountedAnnouncementClickIdsLocally(storeId)
    if (counted.includes(id)) return

    saveCountedAnnouncementClickIdsLocally(storeId, [...counted, id])
  }

  function isAnnouncementSeen(idInput: string): boolean {
    return hasAnnouncementBeenViewedLocally(idInput)
  }

  function computeAnnouncementsEntryDot(itemsInput: CloudAnnouncement[]): boolean {
    return itemsInput
      .filter(item => item.status === 'published')
      .some(item => !isAnnouncementSeen(item.id))
  }

  function shouldShowAnnouncementsEntryDot(): boolean {
    if (screen === ShowcaseScreens.Announcements) return false

    return announcementsEntryDotVisible
  }

  function shouldShowBookingsEntryDot(): boolean {
    if (screen === ShowcaseScreens.CustomerBookings) return false

    return bookingsEntryDotVisible
  }

  async function trackAnnouncementClickOnce(idInput: string): Promise<void> {
    const id = idInput.trim()
    if (!id) return

    if (hasAnnouncementClickBeenCountedLocally(id)) return
    if (announcementClickCountInFlightRef.current.has(id)) return

    announcementClickCountInFlightRef.current.add(id)

    try {
      const ok = await repository.incrementAnnouncementViewCount({
        storeId,
        announcementId: id
      })

      if (!ok) return

      markAnnouncementClickCountedLocally(id)

      setAnnouncements(current => current.map(item => {
        if (item.id !== id) return item

        return {
          ...item,
          viewCount: item.viewCount + 1
        }
      }))
    } finally {
      announcementClickCountInFlightRef.current.delete(id)
    }
  }

  async function openAnnouncement(idInput: string): Promise<void> {
    const id = idInput.trim()
    if (!id) return

    let exists = announcements.some(item => {
      return item.id === id && item.status !== 'draft'
    })

    if (!exists) {
      await syncPublicAnnouncementsFromCloud(false)

      const cachedItems = loadPublishedAnnouncementsLocally(storeId)
      exists = cachedItems.some(item => {
        return item.id === id && item.status !== 'draft'
      })
    }

    if (!exists) return

    setFocusedAnnouncementId(current => current === id ? null : id)
    markAnnouncementViewedLocally(id)
    await trackAnnouncementClickOnce(id)
  }

  function toggleAnnouncementSelection(idInput: string): void {
    const id = idInput.trim()
    if (!id) return

    const exists = adminAnnouncementDraftItems.some(item => {
      return item.id === id && item.status === 'draft'
    })

    if (!exists) return

    setAdminAnnouncementSelectedIds(current => {
      if (current.includes(id)) {
        return current.filter(item => item !== id)
      }

      return [...current, id]
    })
  }

  function announcementDraftTimeText(valueInput: number | null | undefined): string {
    return formatDateTimeText(valueInput) || 'Draft'
  }

  function announcementPublishedTimeText(valueInput: number | null | undefined): string {
    return formatDateTimeText(valueInput) || 'Just now'
  }

  function toAnnouncementEntity(input: {
    id?: string | null
    coverUrl?: string | null
    coverImageVariants?: ShowcaseImageVariants | null
    body: string
    status: 'draft' | 'published'
    viewCount?: number | null
  }): DraftAnnouncement {
    const now = nowMillis()

    return {
      id: input.id || createUuidLikeId(),
      coverUrl: input.coverUrl || null,
      coverImageVariants: input.coverImageVariants ?? null,
      body: input.body,
      status: input.status,
      createdAt: now,
      updatedAt: now,
      viewCount: Number(input.viewCount || 0)
    }
  }

  function toPublishedAnnouncementEntity(item: CloudAnnouncement): CloudAnnouncement {
    return {
      ...item,
      status: 'published'
    }
  }

  function toAnnouncementCard(item: DraftAnnouncement | CloudAnnouncement, showYear: boolean): ShowcaseAnnouncementCard {
    const normalizedBody = item.body.trim()
    const bodyPreview = normalizedBody
      .replace(/\n/g, ' ')
      .trim()

    return {
      id: item.id,
      coverUrl: item.coverUrl,
      coverImageVariants: item.coverImageVariants ?? null,
      bodyPreview: bodyPreview.length <= 120 ? bodyPreview : `${bodyPreview.slice(0, 120)}…`,
      bodyText: normalizedBody,
      timeText: showYear
        ? announcementPublishedTimeText(item.updatedAt || item.createdAt)
        : announcementDraftTimeText(item.updatedAt),
      viewCount: item.viewCount
    }
  }

  function getAdminDraftCardsForUi(): ShowcaseAnnouncementCard[] {
    return adminAnnouncementDraftItems.map(item => toAnnouncementCard(item, false))
  }

  function getAdminPublishedCardsForUi(): ShowcaseAnnouncementCard[] {
    return announcements.map(item => toAnnouncementCard(item, true))
  }

  function rebuildAnnouncementsList(items: CloudAnnouncement[]): void {
    const published = items
      .filter(item => item.status === 'published')
      .sort((left, right) => {
        return (right.updatedAt || right.createdAt || 0) - (left.updatedAt || left.createdAt || 0)
      })
      .map(toPublishedAnnouncementEntity)

    const drafts = items
      .filter(item => item.status === 'draft')
      .sort((left, right) => {
        return (right.updatedAt || right.createdAt || 0) - (left.updatedAt || left.createdAt || 0)
      })
      .map(item => ({
        id: item.id,
        coverUrl: item.coverUrl,
        coverImageVariants: item.coverImageVariants ?? null,
        body: item.body,
        status: 'draft' as const,
        createdAt: item.createdAt || nowMillis(),
        updatedAt: item.updatedAt || nowMillis(),
        viewCount: item.viewCount
      }))

    setAnnouncements(published)
    setAnnouncementsEntryDotVisible(computeAnnouncementsEntryDot(published))
    setAdminAnnouncementDraftItems(drafts)
    persistPublishedAnnouncementsLocally(storeId, published)
  }

  async function loadMoreCustomerAppointments(): Promise<void> {
    if (customerAppointmentsPagination.isLoadingMore || !customerAppointmentsPagination.hasMore) return

    setCustomerAppointmentsPagination(current => ({
      nextOffset: current.nextOffset,
      hasMore: current.hasMore,
      isLoadingMore: true
    }))

    try {
      const filters = currentCustomerAppointmentCloudFilters()
      const nextItems = await repository.fetchAppointmentRequests({
        storeId,
        clientId,
        merchant: false,
        preferredDate: filters.preferredDate,
        preferredDateGte: filters.preferredDateGte,
        preferredDateLt: filters.preferredDateLt,
        status: filters.status,
        serviceTitle: filters.serviceTitle,
        limit: SHOWCASE_PAGE_SIZE.clientAppointments,
        offset: customerAppointmentsPagination.nextOffset
      })
      const merged = sortedAppointmentsForStorage(mergeUniqueById(appointmentRequests, nextItems))

      setAppointmentRequests(merged)
      if (nextItems.length) {
        saveAppointmentsToStorage(storeId, merged)
        pruneBookingSeenWhenCompletePageLoaded(
          storeId,
          clientId,
          merged,
          nextItems.length,
          SHOWCASE_PAGE_SIZE.clientAppointments
        )
      }
      void hydrateAppointmentLinkedDishesFromRequests(merged)

      setCustomerAppointmentsPagination({
        nextOffset: customerAppointmentsPagination.nextOffset + nextItems.length,
        hasMore: nextItems.length >= SHOWCASE_PAGE_SIZE.clientAppointments,
        isLoadingMore: false
      })
    } catch (error) {
      setCustomerAppointmentsPagination(current => ({
        nextOffset: current.nextOffset,
        hasMore: current.hasMore,
        isLoadingMore: false
      }))
      setStatusMessage(error instanceof Error ? error.message : 'Failed to load more bookings.')
    }
  }

  async function loadMoreAdminAppointments(): Promise<void> {
    if (adminAppointmentsPagination.isLoadingMore || !adminAppointmentsPagination.hasMore) return

    setAdminAppointmentsPagination(current => ({
      nextOffset: current.nextOffset,
      hasMore: current.hasMore,
      isLoadingMore: true
    }))

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setStatusMessage(merchantSessionEnsureFailureMessage())
        setAdminAppointmentsPagination(current => ({
          nextOffset: current.nextOffset,
          hasMore: current.hasMore,
          isLoadingMore: false
        }))
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const filters = currentAdminAppointmentCloudFilters()
      const nextItems = await repository.fetchAppointmentRequests({
        storeId,
        merchant: true,
        preferredDate: filters.preferredDate,
        preferredDateGte: filters.preferredDateGte,
        preferredDateLt: filters.preferredDateLt,
        status: filters.status,
        serviceTitle: filters.serviceTitle,
        limit: SHOWCASE_PAGE_SIZE.merchantAppointments,
        offset: adminAppointmentsPagination.nextOffset
      })
      const merged = sortedAppointmentsForStorage(mergeUniqueById(appointmentRequests, nextItems))

      setAppointmentRequests(merged)
      if (nextItems.length) saveAppointmentsToStorage(storeId, merged)
      void hydrateAppointmentLinkedDishesFromRequests(merged)

      setAdminAppointmentsPagination({
        nextOffset: adminAppointmentsPagination.nextOffset + nextItems.length,
        hasMore: nextItems.length >= SHOWCASE_PAGE_SIZE.merchantAppointments,
        isLoadingMore: false
      })
    } catch (error) {
      setAdminAppointmentsPagination(current => ({
        nextOffset: current.nextOffset,
        hasMore: current.hasMore,
        isLoadingMore: false
      }))
      setStatusMessage(error instanceof Error ? error.message : 'Failed to load more appointments.')
    }
  }

  async function syncPublicAnnouncementsFromCloud(markViewedAfterSync = false): Promise<void> {
    const latest = await repository.fetchAnnouncements({
      storeId,
      includeDrafts: false,
      limit: SHOWCASE_PAGE_SIZE.publicAnnouncements,
      offset: 0
    })

    const cachedItems = loadPublishedAnnouncementsLocally(storeId)
    const effectiveItems = latest.length ? latest : cachedItems
    const publishedItems = effectiveItems
      .filter(item => item.status === 'published')
      .sort((left, right) => {
        return (right.updatedAt || right.createdAt || 0) - (left.updatedAt || left.createdAt || 0)
      })
      .map(toPublishedAnnouncementEntity)

    if (markViewedAfterSync) {
      markAnnouncementsViewedLocally(
        publishedItems
          .filter(item => item.status === 'published')
          .map(item => item.id)
          .map(id => id.trim())
          .filter(Boolean)
      )
    }

    setAnnouncements(publishedItems)
    setAnnouncementsEntryDotVisible(
      markViewedAfterSync ? false : computeAnnouncementsEntryDot(publishedItems)
    )

    if (latest.length) {
      persistPublishedAnnouncementsLocally(storeId, publishedItems)
      pruneAnnouncementMarksWhenCompletePageLoaded(
        storeId,
        publishedItems,
        latest.length,
        SHOWCASE_PAGE_SIZE.publicAnnouncements
      )
    }
  }

  async function syncMerchantAnnouncementsFromCloud(): Promise<void> {
    const validSession = await ensureValidMerchantSessionLoadedForCloud()

    if (!validSession) {
      setStatusMessage(merchantSessionEnsureFailureMessage())
      showSnackbar(merchantSessionEnsureSnackbarMessage())
      return
    }

    setStoreMerchantSessionFromAuthSession(validSession)
    bindMerchantSessionToRepository(repository)

    const latest = await repository.fetchAnnouncements({
      storeId,
      includeDrafts: true,
      limit: SHOWCASE_PAGE_SIZE.adminAnnouncements,
      offset: 0
    })

    rebuildAnnouncementsList(latest)
  }

  async function loadMorePublicAnnouncements(): Promise<void> {
    if (publicAnnouncementsPagination.isLoadingMore || !publicAnnouncementsPagination.hasMore) return

    setPublicAnnouncementsPagination(current => ({
      nextOffset: current.nextOffset,
      hasMore: current.hasMore,
      isLoadingMore: true
    }))

    try {
      const latest = await repository.fetchAnnouncements({
        storeId,
        includeDrafts: false,
        limit: SHOWCASE_PAGE_SIZE.publicAnnouncements,
        offset: publicAnnouncementsPagination.nextOffset
      })
      const publishedItems = latest
        .filter(item => item.status === 'published')
        .map(toPublishedAnnouncementEntity)
      const merged = sortedAnnouncementsForStorage(mergeUniqueById(announcements, publishedItems))

      setAnnouncements(merged)
      setAnnouncementsEntryDotVisible(computeAnnouncementsEntryDot(merged))
      if (publishedItems.length) {
        persistPublishedAnnouncementsLocally(storeId, merged)
        pruneAnnouncementMarksWhenCompletePageLoaded(
          storeId,
          merged,
          latest.length,
          SHOWCASE_PAGE_SIZE.publicAnnouncements
        )
      }

      setPublicAnnouncementsPagination({
        nextOffset: publicAnnouncementsPagination.nextOffset + latest.length,
        hasMore: latest.length >= SHOWCASE_PAGE_SIZE.publicAnnouncements,
        isLoadingMore: false
      })
    } catch (error) {
      setPublicAnnouncementsPagination(current => ({
        nextOffset: current.nextOffset,
        hasMore: current.hasMore,
        isLoadingMore: false
      }))
      setStatusMessage(error instanceof Error ? error.message : 'Failed to load more announcements.')
    }
  }

  async function loadMoreAdminAnnouncements(): Promise<void> {
    if (adminAnnouncementsPagination.isLoadingMore || !adminAnnouncementsPagination.hasMore) return

    setAdminAnnouncementsPagination(current => ({
      nextOffset: current.nextOffset,
      hasMore: current.hasMore,
      isLoadingMore: true
    }))

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        setAdminAnnouncementsPagination(current => ({
          nextOffset: current.nextOffset,
          hasMore: current.hasMore,
          isLoadingMore: false
        }))
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const latest = await repository.fetchAnnouncements({
        storeId,
        includeDrafts: true,
        limit: SHOWCASE_PAGE_SIZE.adminAnnouncements,
        offset: adminAnnouncementsPagination.nextOffset
      })
      const currentItems = [
        ...announcements,
        ...adminAnnouncementDraftItems.map(item => ({
          id: item.id,
          storeId,
          coverUrl: item.coverUrl,
          title: '',
          body: item.body,
          status: item.status,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          viewCount: item.viewCount
        } as CloudAnnouncement))
      ]

      rebuildAnnouncementsList(sortedAnnouncementsForStorage(mergeUniqueById(currentItems, latest)))

      setAdminAnnouncementsPagination({
        nextOffset: adminAnnouncementsPagination.nextOffset + latest.length,
        hasMore: latest.length >= SHOWCASE_PAGE_SIZE.adminAnnouncements,
        isLoadingMore: false
      })
    } catch (error) {
      setAdminAnnouncementsPagination(current => ({
        nextOffset: current.nextOffset,
        hasMore: current.hasMore,
        isLoadingMore: false
      }))
      setStatusMessage(error instanceof Error ? error.message : 'Failed to load more announcements.')
    }
  }

  async function refreshAnnouncements(): Promise<void> {
    await syncPublicAnnouncementsFromCloud(screen === ShowcaseScreens.Announcements)
  }

  async function refreshAnnouncementsEntryDotOnce(): Promise<void> {
    const latest = await repository.fetchAnnouncements({
      storeId,
      includeDrafts: false,
      limit: SHOWCASE_PAGE_SIZE.publicAnnouncements,
      offset: 0
    })

    const cachedItems = loadPublishedAnnouncementsLocally(storeId)
    const effectiveItems = latest.length ? latest : cachedItems
    const publishedItems = effectiveItems
      .filter(item => item.status === 'published')
      .sort((left, right) => {
        return (right.updatedAt || right.createdAt || 0) - (left.updatedAt || left.createdAt || 0)
      })
      .map(toPublishedAnnouncementEntity)

    setAnnouncements(publishedItems)
    setAnnouncementsEntryDotVisible(computeAnnouncementsEntryDot(publishedItems))

    if (latest.length) {
      persistPublishedAnnouncementsLocally(storeId, publishedItems)
      pruneAnnouncementMarksWhenCompletePageLoaded(
        storeId,
        publishedItems,
        latest.length,
        SHOWCASE_PAGE_SIZE.publicAnnouncements
      )
    }
  }

  async function refreshBookingsEntryDotOnce(): Promise<void> {
    const currentClientId = clientId.trim()

    if (!currentClientId) {
      setBookingsEntryDotVisible(false)
      return
    }

    const latestScreen = currentScreenRef.current
    const latestAdminLoggedIn = isAdminLoggedInRef.current || isMerchantLoggedInInStoreSession()
    const isCustomerBookingsScreen = latestScreen === ShowcaseScreens.CustomerBookings
    const canUpdateCustomerAppointmentList = !latestAdminLoggedIn && isCustomerBookingsScreen

    try {
      const latest = await repository.fetchAppointmentRequests({
        storeId,
        clientId: currentClientId,
        merchant: false,
        limit: SHOWCASE_PAGE_SIZE.clientAppointments,
        offset: 0
      })
      const sortedItems = latest.slice().sort((left, right) => {
        return (right.createdAt || 0) - (left.createdAt || 0)
      })

      if (canUpdateCustomerAppointmentList) {
        setAppointmentRequests(sortedItems)
        saveAppointmentsToStorage(storeId, sortedItems)
      } else {
        console.log('[NDJC_APPOINTMENTS] Skip customer booking list overwrite from entry polling.', {
          storeId,
          currentClientId,
          latestScreen,
          latestAdminLoggedIn,
          isCustomerBookingsScreen,
          itemCount: sortedItems.length
        })
      }

      pruneBookingSeenWhenCompletePageLoaded(
        storeId,
        currentClientId,
        sortedItems,
        latest.length,
        SHOWCASE_PAGE_SIZE.clientAppointments
      )

      const seenKeys = loadSeenAppointmentStatusAlertKeys(storeId, currentClientId)
      const hasUnseenAlert = sortedItems
        .filter(item => isCustomerBookingAlertStatus(appointmentsStatusFromCloud(item.status)))
        .map(item => appointmentStatusAlertKey(item.id, appointmentsStatusFromCloud(item.status)))
        .filter(Boolean)
        .some(key => !seenKeys.includes(key))

      setBookingsEntryDotVisible(
        latestAdminLoggedIn || isCustomerBookingsScreen
          ? false
          : hasUnseenAlert
      )
    } catch {
      setBookingsEntryDotVisible(false)
    }
  }

  function clearAdminAnnouncementComposerState(): void {
    clearAdminAnnouncementDraftLocalImages(storeId)
    clearAdminAnnouncementEditorDraftLocally(storeId)

    setAdminAnnouncementComposerExpanded(false)
    setAdminAnnouncementEditingId(null)
    setAdminAnnouncementCoverDraftUrl(null)
    setAdminAnnouncementBodyDraft('')
    setAdminAnnouncementSelectedIds([])
    setAdminAnnouncementPreviewId(null)
    setAdminAnnouncementError(null)
    setAdminAnnouncementSuccess(null)
    setAdminAnnouncementIsSubmitting(false)
    setAdminAnnouncementIsBlocking(false)
  }

  function hasUnsavedAdminAnnouncementDraft(): boolean {
    const currentBody = adminAnnouncementBodyDraft.trim()
    const currentCover = adminAnnouncementCoverDraftUrl
      ?.trim()
      || null

    const editingId = adminAnnouncementEditingId?.trim() || null

    if (!editingId) {
      return Boolean(currentBody || currentCover)
    }

    const original = adminAnnouncementDraftItems.find(item => {
      return item.id === editingId && item.status === 'draft'
    }) || null

    if (!original) {
      return Boolean(currentBody || currentCover)
    }

    const originalBody = original.body.trim()
    const originalCover = original.coverUrl
      ?.trim()
      || null

    return currentBody !== originalBody || currentCover !== originalCover
  }

  function discardAdminAnnouncementDraftAndBack(): void {
    clearAdminAnnouncementComposerState()
    setScreen('Admin')
    void refreshAdminHomeCloudState(false)
  }

  function discardAdminAnnouncementDraftAndGoHome(): void {
    clearAdminAnnouncementComposerState()
    setPreviousScreen(screen)
    setScreen('Home')
  }

  function onAdminAnnouncementBodyDraftChange(value: string): void {
    setAdminAnnouncementBodyDraft(value)
    setAdminAnnouncementError(null)

    const draft = toAnnouncementEntity({
      id: adminAnnouncementEditingId,
      coverUrl: adminAnnouncementCoverDraftUrl,
      body: value,
      status: 'draft',
      viewCount: 0
    })

    persistAdminAnnouncementEditorDraftLocally(storeId, draft)
  }

  function onAdminAnnouncementClearCover(): void {
    const url = adminAnnouncementCoverDraftUrl

    setAdminAnnouncementCoverDraftUrl(null)
    setAdminAnnouncementError(null)
    setAdminAnnouncementSuccess(null)

    if (url && isAppOwnedLocalFileUri(storeId, url)) {
      deleteAppOwnedLocalFileUri(storeId, url)
    }

    const draft = toAnnouncementEntity({
      id: adminAnnouncementEditingId,
      coverUrl: null,
      body: adminAnnouncementBodyDraft,
      status: 'draft',
      viewCount: 0
    })

    persistAdminAnnouncementEditorDraftLocally(storeId, draft)
  }

  function onAdminAnnouncementClearSelection(): void {
    setAdminAnnouncementSelectedIds([])
  }

  async function onAdminAnnouncementCoverPicked(value: File | Blob | string): Promise<void> {
    const previousCoverUrl = adminAnnouncementCoverDraftUrl
    const nextCoverUrl = await resolveAnnouncementCoverDraftUrl(value)

    if (!nextCoverUrl) {
      setAdminAnnouncementError('Cover image compress failed.')
      setAdminAnnouncementSuccess(null)
      showSnackbar('Cover image compress failed.')
      return
    }

    if (previousCoverUrl && previousCoverUrl !== nextCoverUrl && isAppOwnedLocalFileUri(storeId, previousCoverUrl)) {
      deleteAppOwnedLocalFileUri(storeId, previousCoverUrl)
    }

    if (isLocalImageUri(nextCoverUrl)) {
      rememberLocalTempImage(storeId, 'admin-announcement', nextCoverUrl)
    }

    setAdminAnnouncementCoverDraftUrl(nextCoverUrl)
    setAdminAnnouncementError(null)
    setAdminAnnouncementSuccess(null)
    setAdminAnnouncementComposerExpanded(true)

    const draft = toAnnouncementEntity({
      id: adminAnnouncementEditingId,
      coverUrl: nextCoverUrl,
      body: adminAnnouncementBodyDraft,
      status: 'draft',
      viewCount: 0
    })

    persistAdminAnnouncementEditorDraftLocally(storeId, draft)
  }

  function onAdminAnnouncementDeleteSelected(): Promise<void> {
    return deleteSelectedAnnouncements()
  }

  function onAdminAnnouncementDismissPreview(): void {
    setAdminAnnouncementPreviewId(null)
  }

  function onAdminAnnouncementOpenItem(id: string): void {
    editAnnouncement(id)
  }

  function onAdminAnnouncementPreviewItem(id: string): void {
    const clean = id.trim()
    if (!clean) return

    const exists = adminAnnouncementDraftItems.some(item => {
      return item.id === clean && item.status === 'draft'
    })

    if (!exists) return

    setAdminAnnouncementPreviewId(clean)
  }

  function onAdminAnnouncementPushNow(): Promise<void> {
    return saveAnnouncement('published')
  }

  function onAdminAnnouncementSaveDraft(): Promise<void> {
    return saveAnnouncement('draft')
  }

  function onAdminAnnouncementStartNew(): void {
    startNewAnnouncement()
  }

  function onAdminAnnouncementToggleSelect(id: string): void {
    toggleAnnouncementSelection(id)
  }

  function onAnnouncementExpanded(id: string): void {
    void openAnnouncement(id)
  }

  function onAnnouncementImageOpened(id: string): void {
    const clean = id.trim()
    if (!clean) return

    const exists = announcements.some(item => {
      return item.id === clean && item.status !== 'draft'
    })

    if (!exists) return

    markAnnouncementViewedLocally(clean)
    void trackAnnouncementClickOnce(clean)
  }

  async function syncAnnouncementsAfterPush(): Promise<void> {
    await syncPublicAnnouncementsFromCloud(false)
  }

  async function ensureAnnouncementVisible(idInput: string): Promise<void> {
    const id = idInput.trim()
    if (!id) return

    const exists = announcements.some(item => item.id === id)
    if (!exists) {
      await refreshAnnouncements()
    }

    setFocusedAnnouncementId(id)
  }

  async function ensureAnnouncementViewed(idInput: string): Promise<void> {
    const id = idInput.trim()
    if (!id) return

    markAnnouncementViewedLocally(id)
    await trackAnnouncementClickOnce(id)
  }

  async function ensureAnnouncementOpened(idInput: string): Promise<void> {
    const id = idInput.trim()
    if (!id) return

    announcementsBackTargetRef.current = ShowcaseScreens.Home

    await syncPublicAnnouncementsFromCloud(true)

    setFocusedAnnouncementId(id)
    setPreviousScreen(ShowcaseScreens.Home)
    setScreen(ShowcaseScreens.Announcements)
    await trackAnnouncementClickOnce(id)
  }

  async function ensureAnnouncementPushRoute(idInput: string): Promise<void> {
    const id = idInput.trim()
    if (!id) return

    await onAnnouncementPushArrived(id)
  }

  async function ensureAnnouncementPublished(idInput: string): Promise<void> {
    const id = idInput.trim()
    if (!id) return

    const item = announcements.find(announcement => announcement.id === id)
    if (!item) return

    await repository.dispatchAnnouncementPush({
      storeId,
      announcementId: item.id,
      bodyPreview: item.body.slice(0, 120)
    })

    setPushTargetAnnouncementId(item.id)
  }

  async function ensureAnnouncementDraftSaved(): Promise<void> {
    await saveAnnouncement('draft')
  }

  async function ensureAnnouncementPublishedNow(): Promise<void> {
    await saveAnnouncement('published')
  }

  async function ensureAnnouncementSelectionDeleted(): Promise<void> {
    await deleteSelectedAnnouncements()
  }

  async function ensureAnnouncementListFresh(): Promise<void> {
    await refreshAnnouncements()
  }

  async function ensureAnnouncementEntryDotFresh(): Promise<void> {
    await refreshAnnouncementsEntryDotOnce()
  }

  async function ensureAnnouncementClickTracked(id: string): Promise<void> {
    await trackAnnouncementClickOnce(id)
  }

  function clearFocusedAnnouncement(): void {
    setFocusedAnnouncementId(null)
  }

  async function ensureAnnouncementImageOpened(id: string): Promise<void> {
    onAnnouncementImageOpened(id)
    await ensureAnnouncementClickTracked(id)
  }

  async function ensureAnnouncementExpanded(id: string): Promise<void> {
    onAnnouncementExpanded(id)
  }

  async function ensureAnnouncementRouteConsumed(): Promise<void> {
    clearFocusedAnnouncement()
  }

  async function ensureAnnouncementDraftDiscardedToAdmin(): Promise<void> {
    discardAdminAnnouncementDraftAndBack()
  }

  async function ensureAnnouncementDraftDiscardedToHome(): Promise<void> {
    discardAdminAnnouncementDraftAndGoHome()
  }

  async function ensureAnnouncementComposerCleared(): Promise<void> {
    clearAdminAnnouncementComposerState()
  }

  async function ensureAnnouncementCoverCleared(): Promise<void> {
    onAdminAnnouncementClearCover()
  }

  async function ensureAnnouncementCoverPicked(value: File | Blob | string): Promise<void> {
    await onAdminAnnouncementCoverPicked(value)
  }

  async function ensureAnnouncementBodyChanged(value: string): Promise<void> {
    onAdminAnnouncementBodyDraftChange(value)
  }

  async function ensureAnnouncementSelectionCleared(): Promise<void> {
    onAdminAnnouncementClearSelection()
  }

  async function ensureAnnouncementPreviewDismissed(): Promise<void> {
    onAdminAnnouncementDismissPreview()
  }

  async function ensureAnnouncementItemOpened(id: string): Promise<void> {
    onAdminAnnouncementOpenItem(id)
  }

  async function ensureAnnouncementItemPreviewed(id: string): Promise<void> {
    onAdminAnnouncementPreviewItem(id)
  }

  async function ensureAnnouncementItemToggled(id: string): Promise<void> {
    onAdminAnnouncementToggleSelect(id)
  }

  function getAnnouncementUnreadCount(): number {
    return announcements.filter(item => !hasAnnouncementBeenViewedLocally(item.id)).length
  }

  async function ensureAnnouncementUnreadStateFresh(): Promise<void> {
    await refreshAnnouncementsEntryDotOnce()
  }

  async function ensureAnnouncementAllViewed(): Promise<void> {
    markAnnouncementsViewedLocally(announcements.map(item => item.id))
  }

  async function ensureAnnouncementCacheRebuilt(): Promise<void> {
    rebuildAnnouncementsList(announcements)
  }

  async function ensureAnnouncementCloudSynced(): Promise<void> {
    await refreshAnnouncements()
  }

  async function ensureAnnouncementDraftRestored(): Promise<void> {
    startNewAnnouncement()
  }

  async function ensureAnnouncementDraftPersisted(): Promise<void> {
    const draft = toAnnouncementEntity({
      id: adminAnnouncementEditingId,
      coverUrl: adminAnnouncementCoverDraftUrl,
      body: adminAnnouncementBodyDraft,
      status: 'draft',
      viewCount: 0
    })

    persistAdminAnnouncementEditorDraftLocally(storeId, draft)
  }

  async function ensureAnnouncementDraftCleared(): Promise<void> {
    clearAdminAnnouncementEditorDraftLocally(storeId)
    clearAdminAnnouncementDraftLocalImages(storeId)
  }

  async function ensureAnnouncementLocalCacheWritten(): Promise<void> {
    persistPublishedAnnouncementsLocally(storeId, announcements)
  }

  async function ensureAnnouncementLocalCacheRead(): Promise<CloudAnnouncement[]> {
    const all = readJson<Array<{ storeId: string; items: CloudAnnouncement[] }>>(SHOWCASE_PUBLISHED_ANNOUNCEMENTS_KEY, [])
    return all.find(item => item.storeId === storeId)?.items || []
  }

  async function ensureAnnouncementLocalCacheLoaded(): Promise<void> {
    const local = await ensureAnnouncementLocalCacheRead()
    if (local.length) {
      setAnnouncements(local)
    }
  }

  async function ensureAnnouncementLocalViewedLoaded(): Promise<string[]> {
    return loadViewedAnnouncementIdsLocally(storeId)
  }

  async function ensureAnnouncementLocalCountedLoaded(): Promise<string[]> {
    return loadCountedAnnouncementClickIdsLocally(storeId)
  }

  async function ensureAnnouncementLocalViewedSaved(ids: string[]): Promise<void> {
    saveViewedAnnouncementIdsLocally(storeId, ids)
  }

  async function ensureAnnouncementLocalCountedSaved(ids: string[]): Promise<void> {
    saveCountedAnnouncementClickIdsLocally(storeId, ids)
  }

  async function ensureAnnouncementLocalViewedCleared(): Promise<void> {
    saveViewedAnnouncementIdsLocally(storeId, [])
  }

  async function ensureAnnouncementLocalCountedCleared(): Promise<void> {
    saveCountedAnnouncementClickIdsLocally(storeId, [])
  }

  async function ensureAnnouncementDraftImagesCleared(): Promise<void> {
    clearAdminAnnouncementDraftLocalImages(storeId)
  }

  async function ensureAnnouncementDraftComposerExpanded(): Promise<void> {
    setAdminAnnouncementComposerExpanded(true)
  }

  async function ensureAnnouncementDraftComposerCollapsed(): Promise<void> {
    setAdminAnnouncementComposerExpanded(false)
  }

  async function ensureAnnouncementPreviewVisible(id: string): Promise<void> {
    setAdminAnnouncementPreviewId(id)
  }

  async function ensureAnnouncementPreviewHidden(): Promise<void> {
    setAdminAnnouncementPreviewId(null)
  }

  async function ensureAnnouncementPushTargetCleared(): Promise<void> {
    setPushTargetAnnouncementId(null)
  }

  async function ensureAnnouncementPushTargetSet(id: string): Promise<void> {
    setPushTargetAnnouncementId(id)
  }

  async function ensureAnnouncementComposerErrorDismissed(): Promise<void> {
    setAdminAnnouncementError(null)
  }

  async function ensureAnnouncementComposerSuccessDismissed(): Promise<void> {
    setAdminAnnouncementSuccess(null)
  }

  async function ensureAnnouncementComposerBlocking(value: boolean): Promise<void> {
    setAdminAnnouncementIsBlocking(value)
  }

  async function ensureAnnouncementComposerSubmitting(value: boolean): Promise<void> {
    setAdminAnnouncementIsSubmitting(value)
  }

  async function ensureAnnouncementComposerExpanded(value: boolean): Promise<void> {
    setAdminAnnouncementComposerExpanded(value)
  }

  async function ensureAnnouncementFocused(id: string | null): Promise<void> {
    setFocusedAnnouncementId(id)
  }

  async function ensureAnnouncementSelection(ids: string[]): Promise<void> {
    setAdminAnnouncementSelectedIds(ids.map(id => id.trim()).filter(Boolean))
  }

  async function ensureAnnouncementDraftBody(value: string): Promise<void> {
    setAdminAnnouncementBodyDraft(value)
  }

  async function ensureAnnouncementDraftCover(value: string | null): Promise<void> {
    setAdminAnnouncementCoverDraftUrl(value)
  }

  async function ensureAnnouncementDraftEditingId(value: string | null): Promise<void> {
    setAdminAnnouncementEditingId(value)
  }

  async function ensureAnnouncementDraftItems(items: DraftAnnouncement[]): Promise<void> {
    setAdminAnnouncementDraftItems(items)
  }

  async function ensureAnnouncementPublishedItems(items: CloudAnnouncement[]): Promise<void> {
    setAnnouncements(items)
  }

  async function ensureAnnouncementResetAllLocalState(): Promise<void> {
    clearAdminAnnouncementComposerState()
    setAdminAnnouncementDraftItems([])
    setAdminAnnouncementSelectedIds([])
    setAdminAnnouncementPreviewId(null)
    setFocusedAnnouncementId(null)
  }

  async function ensureAnnouncementPostPublishRefresh(): Promise<void> {
    await refreshAnnouncements()
    await refreshAnnouncementsEntryDotOnce()
  }

  async function ensureAnnouncementPostDeleteRefresh(): Promise<void> {
    await refreshAnnouncements()
  }

  async function ensureAnnouncementPostDraftRefresh(): Promise<void> {
    await syncMerchantAnnouncementsFromCloud()
  }

  async function ensureAnnouncementPostViewedRefresh(): Promise<void> {
    await refreshAnnouncementsEntryDotOnce()
  }

  async function ensureAnnouncementPostPushRefresh(): Promise<void> {
    await refreshAnnouncementsEntryDotOnce()
  }

  async function ensureAnnouncementPostRouteRefresh(id: string): Promise<void> {
    await ensureAnnouncementPushRoute(id)
  }

  async function ensureAnnouncementPostImageOpenRefresh(id: string): Promise<void> {
    await ensureAnnouncementImageOpened(id)
  }

  async function ensureAnnouncementPostExpandedRefresh(id: string): Promise<void> {
    await ensureAnnouncementExpanded(id)
  }

  async function ensureAnnouncementPostComposerDismiss(): Promise<void> {
    clearAdminAnnouncementComposerState()
  }

  async function ensureAnnouncementPostSelectionClear(): Promise<void> {
    onAdminAnnouncementClearSelection()
  }

  async function ensureAnnouncementPostPreviewDismiss(): Promise<void> {
    onAdminAnnouncementDismissPreview()
  }

  async function ensureAnnouncementPostDraftDiscardBack(): Promise<void> {
    discardAdminAnnouncementDraftAndBack()
  }

  async function ensureAnnouncementPostDraftDiscardHome(): Promise<void> {
    discardAdminAnnouncementDraftAndGoHome()
  }

  async function ensureAnnouncementPostComposerClear(): Promise<void> {
    clearAdminAnnouncementComposerState()
  }

  async function ensureAnnouncementPostLocalCacheWrite(): Promise<void> {
    await ensureAnnouncementLocalCacheWritten()
  }

  async function ensureAnnouncementPostLocalCacheLoad(): Promise<void> {
    await ensureAnnouncementLocalCacheLoaded()
  }

  async function ensureAnnouncementPostAllViewed(): Promise<void> {
    await ensureAnnouncementAllViewed()
  }

  async function ensureAnnouncementPostUnreadFresh(): Promise<void> {
    await ensureAnnouncementUnreadStateFresh()
  }

  async function ensureAnnouncementPostDraftRestore(): Promise<void> {
    await ensureAnnouncementDraftRestored()
  }

  async function ensureAnnouncementPostDraftPersist(): Promise<void> {
    await ensureAnnouncementDraftPersisted()
  }

  async function ensureAnnouncementPostDraftClear(): Promise<void> {
    await ensureAnnouncementDraftCleared()
  }

  async function ensureAnnouncementPostPushTargetClear(): Promise<void> {
    await ensureAnnouncementPushTargetCleared()
  }

  async function ensureAnnouncementPostPushTargetSet(id: string): Promise<void> {
    await ensureAnnouncementPushTargetSet(id)
  }

  async function ensureAnnouncementPostErrorDismiss(): Promise<void> {
    await ensureAnnouncementComposerErrorDismissed()
  }

  async function ensureAnnouncementPostSuccessDismiss(): Promise<void> {
    await ensureAnnouncementComposerSuccessDismissed()
  }

  async function ensureAnnouncementPostBlocking(value: boolean): Promise<void> {
    await ensureAnnouncementComposerBlocking(value)
  }

  async function ensureAnnouncementPostSubmitting(value: boolean): Promise<void> {
    await ensureAnnouncementComposerSubmitting(value)
  }

  async function ensureAnnouncementPostComposerExpanded(value: boolean): Promise<void> {
    await ensureAnnouncementComposerExpanded(value)
  }

  async function ensureAnnouncementPostFocused(id: string | null): Promise<void> {
    await ensureAnnouncementFocused(id)
  }

  async function ensureAnnouncementPostSelection(ids: string[]): Promise<void> {
    await ensureAnnouncementSelection(ids)
  }

  async function ensureAnnouncementPostDraftBody(value: string): Promise<void> {
    await ensureAnnouncementDraftBody(value)
  }

  async function ensureAnnouncementPostDraftCover(value: string | null): Promise<void> {
    await ensureAnnouncementDraftCover(value)
  }

  async function ensureAnnouncementPostDraftEditingId(value: string | null): Promise<void> {
    await ensureAnnouncementDraftEditingId(value)
  }

  async function ensureAnnouncementPostDraftItems(items: DraftAnnouncement[]): Promise<void> {
    await ensureAnnouncementDraftItems(items)
  }

  async function ensureAnnouncementPostPublishedItems(items: CloudAnnouncement[]): Promise<void> {
    await ensureAnnouncementPublishedItems(items)
  }

  async function ensureAnnouncementPostResetAllLocalState(): Promise<void> {
    await ensureAnnouncementResetAllLocalState()
  }

  async function ensureAnnouncementNoop(): Promise<void> {
    return
  }

  async function ensureActiveConversation(): Promise<ChatConversation | null> {
    if (activeConversation) return activeConversation

    if (guardOfflineWriteOperation()) {
      setChatStatusMessage('You are offline. Please reconnect and try again.')
      return null
    }

    const conversationId = repository.buildConversationId(storeId, clientId)
    const ok = await repository.upsertChatConversation(conversationId, storeId, clientId)

    if (!ok) {
      return null
    }

    const conversation = await repository.findOrCreateChatConversation({
      storeId,
      clientId,
      customerName: DEFAULT_CUSTOMER_NAME,
      customerContact: ''
    })

    if (!conversation) return null

    setActiveConversation(conversation)
    setActiveConversationId(conversation.id)
    setRuntimeActiveConversationId(conversation.id)
    return conversation
  }
  async function refreshChatMessages(
    conversationIdInput = activeConversationId,
    allowOutsideChatScreens = false,
    acknowledgeVisibleConversation = false
  ): Promise<void> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return

    if (
      !allowOutsideChatScreens &&
      screen !== ShowcaseScreens.Chat &&
      screen !== ShowcaseScreens.ChatMedia &&
      screen !== ShowcaseScreens.ChatSearchResults
    ) {
      ndjcTrace('SKIP refreshChatMessages outside chat screens', {
        screen,
        conversationId
      })
      return
    }

    const loadSeq = ++chatMessageLoadSeqRef.current
    const role = currentChatRole()
    const traceId = `VM${Date.now()}_${conversationId.slice(-4)}`
    const effectiveClientId = role === 'merchant'
      ? activeConversation?.clientId || merchantChatThreads.find(thread => thread.conversationId === conversationId)?.clientId || clientId
      : clientId

    await chatRepository.syncConversationFromCloud({
      storeId,
      conversationId,
      perspectiveRole: role === 'merchant' ? 'merchant' : 'client',
      clientId: effectiveClientId,
      traceId
    })

    if (
      chatMessageLoadSeqRef.current !== loadSeq ||
      activeConversationIdRef.current.trim() !== conversationId ||
      currentChatRole() !== role
    ) {
      return
    }

    if (screen === ShowcaseScreens.Chat || acknowledgeVisibleConversation) {
      if (role === 'merchant') {
        await chatRepository.markUserMessagesReadToCloud(
          storeId,
          conversationId,
          traceId
        )

        setMerchantChatThreads(current => current.map(thread => {
          if (thread.conversationId !== conversationId) return thread

          return {
            ...thread,
            unreadCount: 0
          }
        }))
      } else {
        await chatRepository.markMerchantMessagesReadToCloud(
          storeId,
          conversationId,
          effectiveClientId,
          traceId
        )

        setChatEntryDotVisible(false)
      }
    }

    if (
      chatMessageLoadSeqRef.current !== loadSeq ||
      activeConversationIdRef.current.trim() !== conversationId ||
      currentChatRole() !== role
    ) {
      return
    }

    const localMessages = await chatRepository.listLocal(storeId, conversationId)
    const messages = localMessages.map(chatEntityToCloudMessage)

    if (
      chatMessageLoadSeqRef.current !== loadSeq ||
      activeConversationIdRef.current.trim() !== conversationId ||
      currentChatRole() !== role
    ) {
      return
    }

    const activeWindow = chatMessageWindowRef.current
    const activePagination = chatMessagesPaginationRef.current

    if (activeWindow.mode === 'aroundMessage') {
      setChatMessageWindow(currentWindow => ({
        ...currentWindow,
        hasOlder: currentWindow.hasOlder,
        hasNewer: currentWindow.hasNewer,
        isLoadingOlder: false,
        isLoadingNewer: false,
        oldestTimeMs: currentWindow.oldestTimeMs,
        newestTimeMs: currentWindow.newestTimeMs
      }))
    } else {
      setChatMessages(current => {
        const nextMessages = mergeChatMessagesForConversation(
          current,
          conversationId,
          messages
        )

        const bounds = getChatMessageWindowBounds(nextMessages)

        setChatMessageWindow({
          mode: 'latest',
          anchorMessageId: null,
          hasOlder: activePagination.hasMore,
          hasNewer: false,
          isLoadingOlder: false,
          isLoadingNewer: false,
          oldestTimeMs: bounds.oldestTimeMs,
          newestTimeMs: bounds.newestTimeMs
        })

        return nextMessages
      })
    }

    if (screen !== ShowcaseScreens.ChatMedia && activeWindow.mode !== 'aroundMessage') {
      const latestMediaItems = messages.flatMap(message => message.imageUrls
        .map(url => url.trim())
        .filter(Boolean)
        .map(url => ({
          conversationId,
          messageId: message.id,
          url,
          createdAtText: formatChatCreatedAtText(message.createdAt),
          createdAtMs: Number(message.createdAt || 0)
        }))
      )

      setChatMediaItems(current => mergeChatMediaItems(current, latestMediaItems))
    }

    if (role === 'merchant') {
      const unreadCount = await chatRepository.countUnreadForMerchantConversation(
        storeId,
        conversationId,
        traceId
      )

      setMerchantChatThreads(current => current.map(thread => {
        if (thread.conversationId !== conversationId) return thread

        return {
          ...thread,
          unreadCount
        }
      }))

      return
    }

    const unreadCount = await chatRepository.countUnreadForUserEntry(storeId, conversationId)

    setChatEntryDotVisible(
      screen === ShowcaseScreens.Chat
        ? false
        : unreadCount > 0
    )
  }
  async function loadOlderChatMessages(): Promise<void> {
    const conversationId = activeConversationIdRef.current.trim()
    const activeWindow = chatMessageWindowRef.current
    const activePagination = chatMessagesPaginationRef.current

    if (
      !conversationId ||
      activeWindow.isLoadingOlder ||
      activePagination.isLoadingMore ||
      !activeWindow.hasOlder
    ) {
      return
    }

    const windowBounds = getChatMessageWindowBounds(chatMessages)
    const beforeTimeMs = Number(activeWindow.oldestTimeMs || windowBounds.oldestTimeMs || 0)

    if (!Number.isFinite(beforeTimeMs) || beforeTimeMs <= 0) {
      setChatMessageWindow(current => {
        const nextState = {
          ...current,
          hasOlder: false,
          isLoadingOlder: false
        }

        chatMessageWindowRef.current = nextState
        return nextState
      })

      setChatMessagesPagination(current => {
        const nextState = {
          ...current,
          hasMore: false,
          isLoadingMore: false
        }

        chatMessagesPaginationRef.current = nextState
        return nextState
      })

      return
    }

    const limit = SHOWCASE_PAGE_SIZE.chatMessages

    setChatMessagesPagination(current => {
      const nextState = {
        nextOffset: current.nextOffset,
        hasMore: current.hasMore,
        isLoadingMore: true
      }

      chatMessagesPaginationRef.current = nextState
      return nextState
    })

    setChatMessageWindow(current => {
      const nextState = {
        ...current,
        isLoadingOlder: true
      }

      chatMessageWindowRef.current = nextState
      return nextState
    })

    try {
      const role = currentChatRole()
      const traceId = `VM${Date.now()}_${conversationId.slice(-4)}`
      const effectiveClientId = role === 'merchant'
        ? activeConversation?.clientId || merchantChatThreads.find(thread => thread.conversationId === conversationId)?.clientId || clientId
        : clientId

      const nextLocalMessages = await chatRepository.listOlderMessagesBeforeTime({
        storeId,
        conversationId,
        beforeTimeMs,
        perspectiveRole: role === 'merchant' ? 'merchant' : 'client',
        clientId: effectiveClientId,
        limit,
        traceId
      })

      const nextMessages = nextLocalMessages.map(chatEntityToCloudMessage)

      setChatMessages(current => {
        const mergedMessages = mergeChatMessagesForConversation(
          current,
          conversationId,
          nextMessages
        )
        const bounds = getChatMessageWindowBounds(mergedMessages)

        setChatMessageWindow(currentWindow => {
          const nextState = {
            ...currentWindow,
            hasOlder: nextLocalMessages.length >= limit,
            isLoadingOlder: false,
            oldestTimeMs: bounds.oldestTimeMs,
            newestTimeMs: bounds.newestTimeMs
          }

          chatMessageWindowRef.current = nextState
          return nextState
        })

        return mergedMessages
      })

      setChatMessagesPagination(current => {
        const nextState = {
          nextOffset: current.nextOffset + nextLocalMessages.length,
          hasMore: nextLocalMessages.length >= limit,
          isLoadingMore: false
        }

        chatMessagesPaginationRef.current = nextState
        return nextState
      })
    } catch (error) {
      setChatMessagesPagination(current => {
        const nextState = {
          nextOffset: current.nextOffset,
          hasMore: current.hasMore,
          isLoadingMore: false
        }

        chatMessagesPaginationRef.current = nextState
        return nextState
      })

      setChatMessageWindow(current => {
        const nextState = {
          ...current,
          isLoadingOlder: false
        }

        chatMessageWindowRef.current = nextState
        return nextState
      })

      setChatStatusMessage(error instanceof Error ? error.message : 'Failed to load earlier messages.')
    }
  }

  async function loadNewerChatMessages(): Promise<void> {
    const conversationId = activeConversationIdRef.current.trim()
    const activeWindow = chatMessageWindowRef.current

    if (
      !conversationId ||
      activeWindow.mode !== 'aroundMessage' ||
      !activeWindow.hasNewer ||
      activeWindow.isLoadingNewer
    ) {
      return
    }

    const afterTimeMs = Number(activeWindow.newestTimeMs || 0)
    if (!Number.isFinite(afterTimeMs) || afterTimeMs <= 0) return

    const limit = SHOWCASE_PAGE_SIZE.chatMessages

    setChatMessageWindow(current => {
      const nextState = {
        ...current,
        isLoadingNewer: true
      }

      chatMessageWindowRef.current = nextState
      return nextState
    })

    try {
      const role = currentChatRole()
      const traceId = `VM${Date.now()}_${conversationId.slice(-4)}`
      const effectiveClientId = role === 'merchant'
        ? activeConversation?.clientId || merchantChatThreads.find(thread => thread.conversationId === conversationId)?.clientId || clientId
        : clientId

      const nextLocalMessages = await chatRepository.listNewerMessagesAfterTime({
        storeId,
        conversationId,
        afterTimeMs,
        perspectiveRole: role === 'merchant' ? 'merchant' : 'client',
        clientId: effectiveClientId,
        limit,
        traceId
      })

      const nextMessages = nextLocalMessages.map(chatEntityToCloudMessage)

      setChatMessages(current => {
        const mergedMessages = mergeChatMessagesForConversation(
          current,
          conversationId,
          nextMessages
        )
        const bounds = getChatMessageWindowBounds(mergedMessages)

        setChatMessageWindow(currentWindow => {
          const nextState = {
            ...currentWindow,
            hasNewer: nextLocalMessages.length >= limit,
            isLoadingNewer: false,
            oldestTimeMs: bounds.oldestTimeMs,
            newestTimeMs: bounds.newestTimeMs
          }

          chatMessageWindowRef.current = nextState
          return nextState
        })

        return mergedMessages
      })
    } catch (error) {
      setChatMessageWindow(current => {
        const nextState = {
          ...current,
          isLoadingNewer: false
        }

        chatMessageWindowRef.current = nextState
        return nextState
      })
      setChatStatusMessage(error instanceof Error ? error.message : 'Failed to load newer messages.')
    }
  }

  function shouldShowChatEntryDot(): boolean {
    if (screen === ShowcaseScreens.Chat) {
      return false
    }

    return chatEntryDotVisible
  }

  async function acknowledgeVisibleClientConversation(conversationIdInput: string): Promise<void> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return

    const traceId = `VM${Date.now()}_${conversationId.slice(-4)}`

    await chatRepository.markMerchantMessagesRead(storeId, conversationId)

    await chatRepository.markMerchantMessagesReadToCloud(
      storeId,
      conversationId,
      clientId,
      traceId
    )

    await chatRepository.markMerchantMessagesRead(storeId, conversationId)

    setChatEntryDotVisible(false)
  }

  async function refreshChatEntryDotOnce(): Promise<void> {
    const fallbackConversationId = repository.buildConversationId(storeId, clientId)
    const latestConversationId = await chatRepository.findLatestConversationIdByStoreAndClient(
      storeId,
      clientId
    )
    const actualConversationId = (latestConversationId || fallbackConversationId).trim()

    if (!actualConversationId) {
      setChatEntryDotVisible(false)
      return
    }

    if (!activeConversationIdRef.current.trim() && currentChatRole() !== 'merchant') {
      activeConversationIdRef.current = actualConversationId
      setActiveConversationId(actualConversationId)
      setRuntimeActiveConversationId(actualConversationId)
    }

    if (
      screen === ShowcaseScreens.Chat &&
      currentChatRole() !== 'merchant' &&
      activeConversationIdRef.current.trim() === actualConversationId
    ) {
      await acknowledgeVisibleClientConversation(actualConversationId)
      return
    }

    const unreadCount = await chatRepository.countUnreadForUserEntryByStoreAndClient(
      storeId,
      clientId,
      `VM${Date.now()}_${storeId.slice(-4)}`
    )

    setChatEntryDotVisible(
      screen === ShowcaseScreens.Chat
        ? false
        : unreadCount > 0
    )
  }

  function stopChatPolling(): void {
    setChatPollingEnabled(false)

    if (chatPollingTimerRef.current != null && isBrowser()) {
      window.clearInterval(chatPollingTimerRef.current)
      chatPollingTimerRef.current = null
    }
  }

  function startChatPolling(): void {
    if (!isBrowser()) return
    if (chatPollingTimerRef.current != null) return

    setChatPollingEnabled(true)

    void syncChat()

    chatPollingTimerRef.current = window.setInterval(() => {
      void syncChat()
    }, 2000)
  }

  function stopChatEntryPolling(): void {
    setChatEntryPollingEnabled(false)

    if (chatEntryPollingTimerRef.current != null && isBrowser()) {
      window.clearInterval(chatEntryPollingTimerRef.current)
      chatEntryPollingTimerRef.current = null
    }
  }

  function startChatEntryPolling(): void {
    if (!isBrowser()) return

    ndjcTrace('START chatEntryPolling', {
      screen,
      isAdminLoggedIn,
      existingTimer: chatEntryPollingTimerRef.current != null
    })

    if (chatEntryPollingTimerRef.current != null) return

    setChatEntryPollingEnabled(true)

    void refreshChatEntryDotOnce()

    chatEntryPollingTimerRef.current = window.setInterval(() => {
      void refreshChatEntryDotOnce()
    }, 10000)
  }

  function stopChatDbObserve(): void {
    if (chatDbObserveAbortRef.current) {
      chatDbObserveAbortRef.current.abort()
      chatDbObserveAbortRef.current = null
    }
  }

  function startChatDbObserve(): void {
    if (chatDbObserveAbortRef.current) {
      startChatPolling()
      return
    }

    chatDbObserveAbortRef.current = new AbortController()
    startChatPolling()
  }

  function resetChatTransientStateForConversation(
    conversationId: string,
    pendingProduct: ShowcaseChatProductShare | null = null,
    pendingAppointment: ShowcaseChatAppointmentShare | null = null
  ): void {
    const normalizedConversationId = String(conversationId || '').trim()
    const currentConversationId = String(activeConversationIdRef.current || activeConversationId || '').trim()
    const isSameConversation = Boolean(
      normalizedConversationId &&
      currentConversationId &&
      normalizedConversationId === currentConversationId
    )

    const draft = readChatDraft(storeId, normalizedConversationId || conversationId)
    const nextDraft = draft?.draft || ''
    const nextImageUrls = draft?.draftImageUrls || []
    const nextQuotedMessageId = draft?.quotedMessageId || null
    const nextPendingProduct = pendingProduct || draft?.pendingProduct || null
    const nextPendingAppointment = pendingAppointment || draft?.pendingAppointment || null

    chatMessageLoadSeqRef.current += 1

    if (!isSameConversation) {
      setChatMessages([])
      setChatMediaItems([])
      setChatMessagesPagination({
        nextOffset: SHOWCASE_PAGE_SIZE.chatMessages,
        hasMore: true,
        isLoadingMore: false
      })
      setChatMessageWindow({
        mode: 'latest',
        anchorMessageId: null,
        hasOlder: true,
        hasNewer: false,
        isLoadingOlder: false,
        isLoadingNewer: false,
        oldestTimeMs: null,
        newestTimeMs: null
      })
    }

    setChatSelectedMessageIds([])
    setChatFindQuery('')
    setChatFindResultIds([])
    setChatSearchResults([])
    setChatFocusedMessageId(null)
    setChatScrollToMessageId(null)
    setChatScrollToMessageSignal(0)
    setChatFlashMessageId(null)
    setChatFlashSignal(0)
    setChatDraft(nextDraft)
    setChatDraftImageUrls(nextImageUrls)
    setChatPendingProduct(nextPendingProduct)
    setChatPendingAppointment(nextPendingAppointment)
    setChatQuotedMessageId(nextQuotedMessageId)
    setChatStatusMessage(null)

    if (pendingProduct || pendingAppointment) {
      writeChatDraft({
        storeId,
        conversationId: normalizedConversationId || conversationId,
        draft: nextDraft,
        draftImageUrls: nextImageUrls,
        pendingProduct: pendingProduct || nextPendingProduct,
        pendingAppointment: pendingAppointment || nextPendingAppointment,
        quotedMessageId: nextQuotedMessageId
      })
    }
  }

  function snapshotCurrentChatContext(): void {
    chatContextSnapshotRef.current = {
      conversationId: activeConversationId,
      previousScreen,
      isAdmin: chatModeRef.current === 'Merchant',
      focusedMessageId: chatFocusedMessageId
    }
  }

  async function restoreClientChatContext(
    pendingProduct: ShowcaseChatProductShare | null = null,
    pendingAppointment: ShowcaseChatAppointmentShare | null = null
  ): Promise<void> {
    setChatMode('Client')

    const conversation = await repository.findOrCreateChatConversation({
      storeId,
      clientId,
      customerName: DEFAULT_CUSTOMER_NAME,
      customerContact: ''
    })

    if (!conversation) return

    resetChatTransientStateForConversation(conversation.id, pendingProduct, pendingAppointment)

    activeConversationIdRef.current = conversation.id
    setActiveConversation(conversation)
    setActiveConversationId(conversation.id)
    setRuntimeActiveConversationId(conversation.id)

    void registerChatClientPushDevice(conversation.id, 'client-chat-context-restored', true)

    const showedLocalMessages = await applyLocalChatMessagesFirst(conversation.id)

    if (showedLocalMessages) {
      void refreshChatMessages(conversation.id, true, true)
      await acknowledgeVisibleClientConversation(conversation.id)
      return
    }

    await refreshChatMessages(conversation.id, true, true)
    await acknowledgeVisibleClientConversation(conversation.id)
  }

  async function restoreMerchantChatContext(conversationIdInput?: string | null): Promise<void> {
    setChatMode('Merchant')

    const conversationId = String(conversationIdInput || activeConversationId || '').trim()
    if (!conversationId) return

    const thread = merchantChatThreads.find(item => item.conversationId === conversationId) || null

    resetChatTransientStateForConversation(conversationId)

    activeConversationIdRef.current = conversationId
    setActiveConversationId(conversationId)
    setRuntimeActiveConversationId(conversationId)
    setActiveConversation(thread
      ? {
          id: conversationId,
          storeId,
          clientId: thread.clientId,
          merchantAuthUserId: merchantSession?.authUserId || null,
          customerName: thread.title,
          customerContact: thread.clientId,
          createdAt: null,
          updatedAt: thread.lastMessageAt
        }
      : null
    )

    const showedLocalMessages = await applyLocalChatMessagesFirst(conversationId)

    if (showedLocalMessages) {
      void refreshChatMessages(conversationId, true, true)
      return
    }

    await refreshChatMessages(conversationId, true, true)
  }

  async function reopenCurrentChatWithoutRoleFlip(): Promise<void> {
    const snapshot = chatContextSnapshotRef.current

    if (snapshot) {
      setActiveConversationId(snapshot.conversationId)
      setPreviousScreen(snapshot.previousScreen)
      setChatFocusedMessageId(snapshot.focusedMessageId)

      if (snapshot.isAdmin) {
        await restoreMerchantChatContext(snapshot.conversationId)
      } else {
        await restoreClientChatContext()
      }

      setScreen('Chat')
      return
    }

    if (isAdminLoggedIn) {
      await restoreMerchantChatContext(activeConversationId)
    } else {
      await restoreClientChatContext()
    }

    setScreen('Chat')
  }

  async function syncChat(): Promise<void> {
    if (chatSyncInFlightRef.current) return

    chatSyncInFlightRef.current = true
    setChatStatusMessage(null)

    try {
      const role = currentChatRole()
      const canLoadFullMessages =
        screen === ShowcaseScreens.Chat ||
        screen === ShowcaseScreens.ChatMedia ||
        screen === ShowcaseScreens.ChatSearchResults

      if (role === 'merchant') {
        const traceId = `VM${Date.now()}_${storeId.slice(-4)}`

        await chatRepository.syncMerchantThreadMetaFromCloud(
          storeId,
          traceId
        )

        if (activeConversationId && canLoadFullMessages) {
          await refreshChatMessages(activeConversationId, true, true)
        }

        await mergeLatestMerchantThreadsIntoState(traceId)

        return
      }

      const conversation = await ensureActiveConversation()
      if (!conversation) return

      if (canLoadFullMessages) {
        await refreshChatMessages(conversation.id, true, true)
      }
    } catch {
      setChatStatusMessage('Chat sync failed.')
    } finally {
      chatSyncInFlightRef.current = false
    }
  }

  async function retryChat(): Promise<void> {
    await retryChatMessage('')
  }

  async function retryChatMessage(messageIdInput: string): Promise<void> {
    const messageId = String(messageIdInput || '').trim()

    if (guardOfflineWriteOperation()) {
      setChatStatusMessage('You are offline. Please reconnect and try again.')
      return
    }

    if (!messageId) {
      await syncChat()

      if (chatStatusMessage) {
        setChatStatusMessage(null)
      }

      return
    }

    const conversationId = activeConversationIdRef.current.trim()
    if (!conversationId || chatIsSending || chatIsOpeningRef.current) return

    setChatIsSending(true)
    setChatStatusMessage(null)
    setChatMessages(current => current.map(message => {
      if (message.id !== messageId) return message

      return {
        ...message,
        localStatus: 'sending'
      }
    }))

    try {
      const traceId = `VM${Date.now()}_${conversationId.slice(-4)}`
      const ok = await chatRepository.retryMessageToCloud(storeId, messageId, traceId)

      await mergeLatestLocalChatMessages(conversationId)

      if (!ok) {
        setChatStatusMessage('Message send failed.')
        return
      }

      await syncChat()
      await refreshChatEntryDotOnce()
    } catch (error) {
      setChatMessages(current => current.map(message => {
        if (message.id !== messageId) return message

        return {
          ...message,
          localStatus: 'failed'
        }
      }))
      setChatStatusMessage(normalizeChatSendErrorMessage(error))
    } finally {
      setChatIsSending(false)
    }
  }

  async function awaitFcmToken(): Promise<string | null> {
    if (!isBrowser()) return null

    try {
      const token = await getNdjcFirebaseMessagingToken()

      if (!token) {
        setPushToken(null)
        return null
      }

      window.localStorage.setItem('ndjc_showcase_push_token', token)
      setPushToken(token)
      return token
    } catch (error) {
      console.warn('[NDJC_PUSH] Failed to get Firebase messaging token.', error)
      setPushToken(null)
      return null
    }
  }

  async function ensurePushRegistration(options?: {
    audience?:
      | 'chat_merchant'
      | 'chat_client'
      | 'announcement_subscriber'
      | 'appointment_client'
      | 'appointment_merchant'
    conversationId?: string | null
  }): Promise<boolean> {
    const token = await awaitFcmToken()
    if (!token) return false

    const audience = options?.audience || (
      isAdminLoggedIn
        ? 'chat_merchant'
        : activeConversationId
          ? 'chat_client'
          : 'announcement_subscriber'
    )

    const explicitConversationId = String(options?.conversationId || '').trim()

    const registrationConversationId =
      audience === 'chat_client'
        ? explicitConversationId || activeConversationId
        : audience === 'chat_merchant'
          ? '__merchant__'
          : audience === 'appointment_merchant'
            ? '__appointment_merchant__'
            : audience === 'appointment_client'
              ? '__appointment_client__'
              : '__announcement__'

    const registrationClientId =
      audience === 'chat_merchant' || audience === 'appointment_merchant'
        ? null
        : clientId

    const registrationMerchantId =
      audience === 'chat_merchant' || audience === 'appointment_merchant'
        ? merchantSession?.authUserId || null
        : null

    const deviceInstallId = getOrCreatePwaDeviceInstallId()

    const registered = await repository.upsertPushDevice({
      storeId,
      audience,
      token,
      conversationId: registrationConversationId,
      clientId: registrationClientId,
      merchantId: registrationMerchantId,
      platform: 'web',
      appVersion: 'pwa',
      deviceInstallId
    })

    if (!registered) {
      console.warn('[NDJC_PUSH] Push device registration failed.', {
        storeId,
        audience,
        conversationId: registrationConversationId,
        clientId: registrationClientId,
        merchantId: registrationMerchantId,
        deviceInstallId,
        code: repository.lastUpsertCode,
        body: repository.lastUpsertBody
      })
    }

    return registered
  }

  function shouldThrottlePushRegistration(
    registrationKey: string,
    reason: string
  ): boolean {
    const throttleMs = 5 * 60 * 1000
    const now = Date.now()
    const lastRegisteredAt = pushRegistrationThrottleAtRef.current[registrationKey] || 0
    const elapsedMs = lastRegisteredAt > 0 ? now - lastRegisteredAt : Number.POSITIVE_INFINITY

    if (elapsedMs < throttleMs) {
      console.log('[NDJC_PUSH] Skip recent push registration.', {
        reason,
        registrationKey,
        elapsedMs,
        throttleMs
      })
      return true
    }

    pushRegistrationThrottleAtRef.current[registrationKey] = now
    return false
  }

  function clearPushRegistrationThrottle(registrationKey: string): void {
    delete pushRegistrationThrottleAtRef.current[registrationKey]
  }

  async function registerChatClientPushDevice(
    conversationIdInput: string | null | undefined,
    reason: string,
    force = false
  ): Promise<void> {
    if (!isBrowser()) return
    if (isAdminLoggedIn) return
    if (currentChatRole() === 'merchant') return

    const conversationId = String(conversationIdInput || '').trim()
    if (!conversationId) return

    const key = [
      storeId,
      'chat_client',
      clientId,
      conversationId
    ].join(':')

    if (!force && chatClientPushRegistrationKeyRef.current === key) {
      console.log('[NDJC_PUSH] Skip duplicate chat client push registration.', {
        reason,
        storeId,
        clientId,
        conversationId
      })
      return
    }

    if (shouldThrottlePushRegistration(key, reason)) {
      return
    }

    chatClientPushRegistrationKeyRef.current = key

    console.log('[NDJC_PUSH] Register chat client push device start.', {
      reason,
      storeId,
      clientId,
      conversationId,
      screen
    })

    const registered = await ensurePushRegistration({
      audience: 'chat_client',
      conversationId
    })

    console.log('[NDJC_PUSH] Register chat client push device result.', {
      reason,
      registered,
      storeId,
      clientId,
      conversationId,
      deviceInstallId: canUseLocalStorage()
        ? window.localStorage.getItem(NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY)
        : null,
      code: repository.lastUpsertCode,
      body: repository.lastUpsertBody
    })

    if (!registered) {
      chatClientPushRegistrationKeyRef.current = ''
      clearPushRegistrationThrottle(key)
    }
  }

  async function registerMerchantPushDevice(reason: string, force = false): Promise<void> {
    if (!isBrowser()) return

    const hasMerchantSession = Boolean(merchantSession?.accessToken)
    const hasMerchantRuntimeSession = isMerchantLoggedInInStoreSession()

    if (!hasMerchantSession && !hasMerchantRuntimeSession && !isAdminLoggedIn) {
      console.warn('[NDJC_PUSH] Skip merchant push registration because merchant is not logged in.', {
        reason,
        storeId,
        screen,
        isAdminLoggedIn,
        hasMerchantSession,
        hasMerchantRuntimeSession
      })
      return
    }

    const merchantKey = [
      storeId,
      'chat_merchant',
      merchantSession?.authUserId || merchantSession?.loginName || 'merchant'
    ].join(':')

    if (!force && merchantPushRegistrationKeyRef.current === merchantKey) {
      console.log('[NDJC_PUSH] Skip duplicate merchant push registration.', {
        reason,
        storeId,
        merchantKey
      })
      return
    }

    if (shouldThrottlePushRegistration(merchantKey, reason)) {
      return
    }

    merchantPushRegistrationKeyRef.current = merchantKey

    console.log('[NDJC_PUSH] Register merchant push device start.', {
      reason,
      storeId,
      screen,
      isAdminLoggedIn,
      hasMerchantSession,
      hasMerchantRuntimeSession,
      authUserId: merchantSession?.authUserId || null,
      loginName: merchantSession?.loginName || null
    })

    const chatRegistered = await ensurePushRegistration({ audience: 'chat_merchant' })
    const appointmentRegistered = await ensurePushRegistration({ audience: 'appointment_merchant' })
    const registered = chatRegistered || appointmentRegistered

    console.log('[NDJC_PUSH] Register merchant push device result.', {
      reason,
      registered,
      chatRegistered,
      appointmentRegistered,
      storeId,
      deviceInstallId: canUseLocalStorage()
        ? window.localStorage.getItem(NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY)
        : null,
      code: repository.lastUpsertCode,
      body: repository.lastUpsertBody
    })

    if (!registered) {
      merchantPushRegistrationKeyRef.current = ''
      clearPushRegistrationThrottle(merchantKey)
    }
  }

  async function unregisterMerchantPushDevice(reason: string): Promise<void> {
    if (!isBrowser()) return

    const deviceInstallId = getOrCreatePwaDeviceInstallId()

    console.log('[NDJC_PUSH] Unregister merchant push device start.', {
      reason,
      storeId,
      deviceInstallId,
      audience: 'chat_merchant',
      conversationId: '__merchant__'
    })

    const chatUnregistered = await repository.unregisterPushDevice({
      storeId,
      audience: 'chat_merchant',
      conversationId: '__merchant__',
      deviceInstallId
    })

    const appointmentUnregistered = await repository.unregisterPushDevice({
      storeId,
      audience: 'appointment_merchant',
      conversationId: '__appointment_merchant__',
      deviceInstallId
    })

    const unregistered = chatUnregistered || appointmentUnregistered

    const merchantKeyPrefix = [
      storeId,
      'chat_merchant'
    ].join(':')

    merchantPushRegistrationKeyRef.current = ''

    Object.keys(pushRegistrationThrottleAtRef.current).forEach(key => {
      if (key.startsWith(merchantKeyPrefix)) {
        clearPushRegistrationThrottle(key)
      }
    })

    console.log('[NDJC_PUSH] Unregister merchant push device result.', {
      reason,
      unregistered,
      storeId,
      deviceInstallId,
      code: repository.lastUpsertCode,
      body: repository.lastUpsertBody
    })
  }

  useEffect(() => {
    if (!isAdminLoggedIn || !merchantSession?.accessToken) return

    void registerMerchantPushDevice('merchant-login-effect')
  }, [
    isAdminLoggedIn,
    merchantSession?.accessToken,
    merchantSession?.authUserId,
    merchantSession?.loginName,
    storeId
  ])

  useEffect(() => {
    if (!isBrowser()) return
    if (!isAdminLoggedIn || !merchantSession?.accessToken) return

    const adminScreens: ShowcaseScreenName[] = [
      ShowcaseScreens.Admin,
      ShowcaseScreens.AdminAppointmentManager,
      ShowcaseScreens.AdminAnnouncementEdit,
      ShowcaseScreens.AdminItems,
      ShowcaseScreens.AdminCategories,
      ShowcaseScreens.MerchantChatList,
      ShowcaseScreens.StoreProfile,
      ShowcaseScreens.ChangePassword
    ]

    if (!adminScreens.includes(screen)) return

    void registerMerchantPushDevice('merchant-admin-screen', true)

    const handleWindowFocus = (): void => {
      void registerMerchantPushDevice('merchant-window-focus', true)
    }

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        void registerMerchantPushDevice('merchant-document-visible', true)
      }
    }

    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleWindowFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [
    screen,
    isAdminLoggedIn,
    merchantSession?.accessToken,
    merchantSession?.authUserId,
    merchantSession?.loginName,
    storeId
  ])

  useEffect(() => {
    if (!isBrowser()) return
    if (isAdminLoggedIn) return
    if (currentChatRole() === 'merchant') return

    const conversationId = String(activeConversationId || '').trim()
    if (!conversationId) return

    const isClientChatScreen =
      screen === ShowcaseScreens.Chat ||
      screen === ShowcaseScreens.ChatMedia ||
      screen === ShowcaseScreens.ChatSearchResults

    if (!isClientChatScreen) return

    void registerChatClientPushDevice(conversationId, 'client-chat-screen')
  }, [
    screen,
    isAdminLoggedIn,
    activeConversationId,
    clientId,
    storeId
  ])

  function resolveChatPushSenderName(senderRoleInput: string): string {
    const senderRole = senderRoleInput.trim().toLowerCase()

    if (senderRole === 'merchant') {
      return storeProfile?.displayName || storeProfileForUi.displayName || 'Store'
    }

    return DEFAULT_CUSTOMER_NAME
  }

  async function onAnnouncementPushArrived(announcementIdInput: string): Promise<void> {
    const announcementId = announcementIdInput.trim()
    if (!announcementId) return

    announcementsBackTargetRef.current = ShowcaseScreens.Home

    setPendingPushRoute({
      type: 'announcement',
      announcementId
    })

    setPreviousScreen(ShowcaseScreens.Home)
    setFocusedAnnouncementId(announcementId)
    setScreen(ShowcaseScreens.Announcements)

    await syncPublicAnnouncementsFromCloud(false)
  }

  function showcasePushRouteToViewModelRoute(route: ShowcasePushRoute): {
    type: 'chat' | 'announcement' | 'appointment'
    conversationId?: string | null
    announcementId?: string | null
    appointmentId?: string | null
    openAs?: string | null
  } | null {
    const pushType = route.pushType.trim().toLowerCase()

    if (
      pushType === 'chat' ||
      pushType === 'message' ||
      pushType === 'chat_message'
    ) {
      return {
        type: 'chat',
        conversationId: route.conversationId,
        openAs: route.openAs
      }
    }

    if (pushType === 'announcement' || pushType === 'announcements') {
      return {
        type: 'announcement',
        announcementId: route.announcementId,
        openAs: route.openAs
      }
    }

    if (
      pushType === 'appointment' ||
      pushType === 'booking' ||
      pushType === 'bookings' ||
      pushType === 'appointment_created' ||
      pushType === 'appointment_status'
    ) {
      return {
        type: 'appointment',
        appointmentId: route.appointmentId,
        openAs: route.openAs
      }
    }

    return null
  }

  async function handlePushRoute(routeInput: {
    type: 'chat' | 'announcement' | 'appointment'
    conversationId?: string | null
    announcementId?: string | null
    appointmentId?: string | null
    openAs?: string | null
  }): Promise<void> {
    setPendingPushRoute(routeInput)

    const openAs = String(routeInput.openAs || '').trim().toLowerCase()
    const merchantRuntimeLoggedIn = isAdminLoggedIn || isMerchantLoggedInInStoreSession()

    if (openAs === 'merchant' && !merchantRuntimeLoggedIn) {
      setPreviousScreen(screen)
      prepareLoginScreen(null)
      setScreen('Login')
      return
    }

    if (routeInput.type === 'chat') {
      if (openAs === 'customer' || openAs === 'client') {
        chatBackTargetRef.current = ShowcaseScreens.Home
        setPreviousScreen(ShowcaseScreens.Home)
        stopMerchantChatListPolling()
        stopMerchantChatListDbObserve()
        await restoreClientChatContext()
      } else if (openAs === 'merchant' && routeInput.conversationId) {
        chatBackTargetRef.current = ShowcaseScreens.MerchantChatList
        setPreviousScreen(ShowcaseScreens.MerchantChatList)
        stopChatPolling()
        stopChatDbObserve()
        setChatMode('Merchant')
        setActiveConversationId(routeInput.conversationId)
        setRuntimeActiveConversationId(routeInput.conversationId)
        await restoreMerchantChatContext(routeInput.conversationId)
      } else if (routeInput.conversationId) {
        chatBackTargetRef.current = isAdminLoggedIn
          ? ShowcaseScreens.MerchantChatList
          : ShowcaseScreens.Home
        setPreviousScreen(chatBackTargetRef.current)

        if (isAdminLoggedIn) {
          stopChatPolling()
          stopChatDbObserve()
          setChatMode('Merchant')
          setActiveConversationId(routeInput.conversationId)
          setRuntimeActiveConversationId(routeInput.conversationId)
          await restoreMerchantChatContext(routeInput.conversationId)
        } else {
          stopMerchantChatListPolling()
          stopMerchantChatListDbObserve()
          await restoreClientChatContext()
        }
      } else {
        chatBackTargetRef.current = ShowcaseScreens.Home
        setPreviousScreen(ShowcaseScreens.Home)
        stopMerchantChatListPolling()
        stopMerchantChatListDbObserve()
        await restoreClientChatContext()
      }

      setChatStatusMessage(null)
      setRuntimeChatVisible(true)
      setScreen(ShowcaseScreens.Chat)
      startChatDbObserve()
      startChatPolling()
      await syncChat()
      return
    }

    if (routeInput.type === 'announcement') {
      await onAnnouncementPushArrived(routeInput.announcementId || '')
      return
    }

    if (routeInput.type === 'appointment') {
      await refreshAppointments()
      setPreviousScreen(screen)

      if (openAs === 'merchant') {
        setScreen('AdminAppointmentManager')
        return
      }

      if (openAs === 'customer' || openAs === 'client') {
        setScreen('CustomerBookings')
        return
      }

      setScreen(isAdminLoggedIn ? 'AdminAppointmentManager' : 'CustomerBookings')
    }
  }

  useEffect(() => {
    const uninstall = installShowcasePushRouter()
    const unsubscribe = subscribeShowcasePushRoute(route => {
      const viewModelRoute = showcasePushRouteToViewModelRoute(route)
      if (!viewModelRoute) return

      if (
        viewModelRoute.type === 'chat' &&
        viewModelRoute.conversationId &&
        shouldSuppressRuntimeChatPush(viewModelRoute.conversationId)
      ) {
        consumeShowcasePushRoute(route)
        return
      }

      void handlePushRoute(viewModelRoute).then(() => {
        consumeShowcasePushRoute(route)
      })
    })

    if (!pushLocationSearchConsumedRef.current) {
      pushLocationSearchConsumedRef.current = true
      dispatchShowcasePushRouteFromLocationSearch()
    }

    return () => {
      unsubscribe()
      uninstall()
    }
  }, [screen, isAdminLoggedIn, activeConversationId, storeId])

  async function dispatchNewAppointmentPushToMerchant(appointment: CloudAppointmentRequest): Promise<void> {
    const body = `${appointment.customerName || 'A customer'} requested ${appointment.serviceTitle || 'an appointment'}.`

    const pushOk = await repository.dispatchAppointmentPush({
      storeId,
      appointmentId: appointment.id,
      targetAudience: 'appointment_merchant',
      openAs: 'merchant',
      actor: 'public',
      scopeClientId: appointment.clientId,
      targetClientId: appointment.clientId,
      title: 'New booking request',
      body,
      bodyPreview: body
    })

    if (!pushOk) {
      console.warn('[NDJC_PUSH] New appointment push to merchant failed.', {
        storeId,
        appointmentId: appointment.id,
        clientId: appointment.clientId,
        code: repository.lastAnnouncementPushCode,
        body: repository.lastAnnouncementPushBody
      })
    }
  }

  async function dispatchAppointmentStatusPushToCustomer(appointment: CloudAppointmentRequest, nextStatus: string): Promise<void> {
    const targetClientId = appointment.clientId.trim()

    if (!targetClientId) return

    let pushOk = await repository.dispatchAppointmentPush({
      storeId,
      appointmentId: appointment.id,
      targetAudience: 'appointment_client',
      openAs: 'client',
      targetClientId,
      actor: 'merchant',
      title: appointmentStatusPushTitle(nextStatus),
      body: `Your booking for ${appointmentPushTimeText(appointment.preferredDate)} ${appointment.preferredTime || ''}`.trim() + ` is now ${appointmentsStatusFromCloud(nextStatus)}.`,
      bodyPreview: `Your booking for ${appointmentPushTimeText(appointment.preferredDate)} ${appointment.preferredTime || ''}`.trim() + ` is now ${appointmentsStatusFromCloud(nextStatus)}.`
    })

    if (!pushOk) {
      const detail = [
        repository.lastAnnouncementPushCode != null ? `code=${repository.lastAnnouncementPushCode}` : '',
        repository.lastAnnouncementPushBody ? `body=${repository.lastAnnouncementPushBody.slice(0, 300)}` : ''
      ].filter(Boolean).join(' ')

      const retry = await retryMerchantCloudOperationAfterAuthRefresh({
        errorInput: new Error(detail || 'Appointment status push failed.'),
        operation: () => repository.dispatchAppointmentPush({
          storeId,
          appointmentId: appointment.id,
          targetAudience: 'appointment_client',
          openAs: 'client',
          targetClientId,
          actor: 'merchant',
          title: appointmentStatusPushTitle(nextStatus),
          body: `Your booking for ${appointmentPushTimeText(appointment.preferredDate)} ${appointment.preferredTime || ''}`.trim() + ` is now ${appointmentsStatusFromCloud(nextStatus)}.`,
          bodyPreview: `Your booking for ${appointmentPushTimeText(appointment.preferredDate)} ${appointment.preferredTime || ''}`.trim() + ` is now ${appointmentsStatusFromCloud(nextStatus)}.`
        }),
        isSuccess: value => value
      })

      if (retry.status === 'retried_success') {
        pushOk = true
      }
    }
  }

async function sendChatMessage(): Promise<void> {
  if (chatIsSending || chatIsOpeningRef.current) return

  const rawBody = chatDraft.trim()
  const draftImageUploadPlan = buildChatDraftImageUploadPlan({
    draftImageUris: chatDraftImageUrls,
    createImageMessageId: () => createId('chat_img')
  })
  const quotePreview = buildChatQuotePreviewForSend(chatQuotedMessageId)

  if (!rawBody && !draftImageUploadPlan.length) return

  if (guardOfflineWriteOperation()) {
    setChatStatusMessage('You are offline. Please reconnect and try again.')
    return
  }

  setChatIsSending(true)
  setChatStatusMessage(null)

  try {
    const conversation = await ensureActiveConversation()
    if (!conversation) {
      throw new Error('Conversation unavailable.')
    }

    const now = Date.now()
    const traceId = `VM${now}_${conversation.id.slice(-4)}`
    const messageClientId = conversation.clientId || clientId
    const senderRoleForEntity = currentChatRole()
    const uploadedImages: UploadedShowcaseImage[] = []

    for (const item of draftImageUploadPlan) {
      const uploadedImage = await uploadChatDraftImageForSend({
        sourceUrl: item.sourceUrl,
        needsUpload: item.needsUpload,
        conversation,
        index: item.index,
        messageId: item.messageId,
        traceId
      })

      uploadedImages.push(uploadedImage)
    }

    const uploadedImageUrls = uploadedImages
      .map(item => item.url.trim())
      .filter(Boolean)

    const uploadedImageVariants = uploadedImages
      .map(item => item.variants)
      .filter((item): item is ShowcaseImageVariants => item !== null)

    const sendPlan = buildChatMessageSendPlan({
      rawBody,
      uploadedImageUris: uploadedImageUrls,
      uploadedImageVariants,
      quoteMessageId: chatQuotedMessageId,
      quotePreview,
      conversationId: conversation.id,
      storeId,
      clientId: messageClientId,
      senderRole: senderRoleForEntity === 'merchant' ? 'merchant' : 'client',
      now,
      createMessageId: () => createId('msg')
    })

    if (!sendPlan) return

    setChatMessages(current => mergeChatMessagesForConversation(
      current,
      conversation.id,
      sendPlan.entities.map(entity => chatEntityToCloudMessage(entity))
    ))
    triggerChatScrollToBottomForOwnSend()

    const results: boolean[] = []

    for (const entity of sendPlan.entities) {
      const ok = await chatRepository.insertMessageToCloud(
        entity,
        traceId
      )

      results.push(ok)
    }

    const operationResult = buildChatSendOperationResult({
      sendPlan,
      results
    })

    if (operationResult.shouldFail) {
      throw new Error('Message send failed.')
    }

    draftImageUploadPlan.forEach(item => {
      deleteAppOwnedLocalFileUri(storeId, item.sourceUrl)
    })

    if (operationResult.shouldClearDraft) {
      const clearPlan = buildChatDraftClearPlan()

      setChatDraft(clearPlan.draftText)
      setChatDraftImageUrls(clearPlan.draftImageUris)
      setChatPendingProduct(clearPlan.pendingProduct)
      setChatQuotedMessageId(clearPlan.quoteMessageId)
      updateChatDraftPersistence(
        clearPlan.draftText,
        clearPlan.draftImageUris,
        clearPlan.pendingProduct,
        clearPlan.quoteMessageId
      )
    }

    await mergeLatestLocalChatMessages(conversation.id)
    triggerChatScrollToBottomForOwnSend()

    const senderRole = currentChatRole()
    const targetAudience = senderRole === 'merchant' ? 'chat_client' : 'chat_merchant'
    const openAs = senderRole === 'merchant' ? 'client' : 'merchant'
    const targetClientId = conversation.clientId || clientId
    const senderClientId = senderRole === 'merchant' ? null : targetClientId
    const suppressLocalVisibleChatPush = shouldSuppressRuntimeChatPush(conversation.id)

    console.log('[NDJC_PUSH] Chat push dispatch start.', {
      storeId,
      conversationId: conversation.id,
      senderRole,
      targetAudience,
      openAs,
      targetClientId,
      senderClientId,
      suppressLocalVisibleChatPush,
      pushBody: operationResult.pushBody
    })

    const chatPushOk = await repository.dispatchChatPush({
      storeId,
      conversationId: conversation.id,
      title: resolveChatPushSenderName(senderRole),
      body: operationResult.pushBody,
      senderRole,
      targetAudience,
      openAs,
      targetClientId,
      senderClientId
    })

    console.log('[NDJC_PUSH] Chat push dispatch result.', {
      storeId,
      conversationId: conversation.id,
      senderRole,
      targetAudience,
      openAs,
      targetClientId,
      senderClientId,
      chatPushOk,
      code: repository.lastAnnouncementPushCode,
      body: repository.lastAnnouncementPushBody
    })

    if (!chatPushOk) {
      console.warn('[NDJC_PUSH] Chat push dispatch failed.', {
        storeId,
        conversationId: conversation.id,
        senderRole,
        targetAudience,
        openAs,
        targetClientId,
        senderClientId,
        code: repository.lastAnnouncementPushCode,
        body: repository.lastAnnouncementPushBody
      })
    }

    await syncChat()
    await refreshChatEntryDotOnce()
  } catch (error) {
    setChatStatusMessage(normalizeChatSendErrorMessage(error))

    if (activeConversationId.trim()) {
      await mergeLatestLocalChatMessages(activeConversationId)
    }
  } finally {
    setChatIsSending(false)
  }
}
  async function openChatFromAppointment(appointmentIdInput: string): Promise<void> {
    const appointmentId = appointmentIdInput.trim()
    if (!appointmentId) return

    const item = appointmentRequests.find(appointment => appointment.id === appointmentId) || null
    if (!item) return

    const appointmentClientId = item.clientId.trim()

    if (!appointmentClientId) {
      setStatusMessage('Customer chat is unavailable for this booking.')
      return
    }

    const threadId = repository.buildConversationId(storeId, appointmentClientId)
    const threadTitle = item.customerName.trim()
      || item.customerContact.trim()
      || 'Appointment customer'

    let validSession: MerchantAuthSession | null = null

    if (!isOffline) {
      validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)
    }

    chatBackTargetRef.current = ShowcaseScreens.AdminAppointmentManager
    snapshotCurrentChatContext()

    stopChatPolling()
    stopChatDbObserve()
    stopMerchantChatListPolling()
    stopMerchantChatListDbObserve()

    setChatMode('Merchant')

    const appointmentCard = appointmentCards.find(card => card.id === appointmentId) ||
      appointmentToCard(
        item,
        getDishEntityById(item.sourceDishId)
      )

    const pendingAppointment = buildPendingAppointmentFromCard(appointmentCard)

    resetChatTransientStateForConversation(threadId, null, pendingAppointment)

    if (!isOffline) {
      await repository.upsertChatConversation(threadId, storeId, appointmentClientId)
    }

    activeConversationIdRef.current = threadId
    setActiveConversationId(threadId)
    setRuntimeActiveConversationId(threadId)
    setRuntimeChatVisible(true)
    setActiveConversation({
      id: threadId,
      storeId,
      clientId: appointmentClientId,
      merchantAuthUserId: validSession?.authUserId || null,
      customerName: threadTitle,
      customerContact: item.customerContact || appointmentClientId,
      createdAt: null,
      updatedAt: item.createdAt
    })

    setPreviousScreen(ShowcaseScreens.AdminAppointmentManager)
    setChatStatusMessage(
      isOffline
        ? 'You are offline. Viewing cached messages.'
        : null
    )
    setScreen(ShowcaseScreens.Chat)

    const showedLocalMessages = await applyLocalChatMessagesFirst(threadId)

    if (!isOffline) {
      if (showedLocalMessages) {
        void refreshChatMessages(threadId, true, true)
      } else {
        await refreshChatMessages(threadId, true, true)
      }

      await syncChat()

      startChatDbObserve()
      startChatPolling()
    }
  }
  async function openMerchantThread(conversationIdInput: string, titleInput?: string): Promise<void> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return

    const thread = merchantChatThreads.find(item => item.conversationId === conversationId) || null
    const threadTitle = titleInput?.trim() || thread?.title || 'Chat'

    let validSession: MerchantAuthSession | null = null

    if (!isOffline) {
      validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)
    }

    chatBackTargetRef.current = ShowcaseScreens.MerchantChatList
    snapshotCurrentChatContext()

    stopChatPolling()
    stopChatDbObserve()
    stopMerchantChatListPolling()
    stopMerchantChatListDbObserve()

    setChatMode('Merchant')
    resetChatTransientStateForConversation(conversationId)

    activeConversationIdRef.current = conversationId
    setActiveConversationId(conversationId)
    setRuntimeActiveConversationId(conversationId)
    setRuntimeChatVisible(true)
    setActiveConversation(thread
      ? {
          id: conversationId,
          storeId,
          clientId: thread.clientId,
          merchantAuthUserId: validSession?.authUserId || null,
          customerName: threadTitle,
          customerContact: thread.clientId,
          createdAt: null,
          updatedAt: thread.lastMessageAt
        }
      : {
          id: conversationId,
          storeId,
          clientId: conversationId,
          merchantAuthUserId: validSession?.authUserId || null,
          customerName: threadTitle,
          customerContact: conversationId,
          createdAt: null,
          updatedAt: null
        }
    )

    setPreviousScreen(ShowcaseScreens.MerchantChatList)
    setChatStatusMessage(
      isOffline
        ? 'You are offline. Viewing cached messages.'
        : null
    )
    setScreen(ShowcaseScreens.Chat)

    const showedLocalMessages = await applyLocalChatMessagesFirst(conversationId)

    if (!isOffline) {
      if (showedLocalMessages) {
        void refreshChatMessages(conversationId, true, true)
      } else {
        await refreshChatMessages(conversationId, true, true)
      }

      await refreshChatEntryDotOnce()
      await syncChat()

      startChatDbObserve()
      startChatPolling()
      void refreshMerchantChatListSilently()
    }
  }
  async function refreshMerchantThreads(): Promise<void> {
    setMerchantChatListRefreshing(true)

    try {
      const traceId = `VM${Date.now()}_${storeId.slice(-4)}`

      await chatRepository.syncMerchantThreadMetaFromCloud(
        storeId,
        traceId
      )

      const threads = await fetchMerchantThreadsFromChatRepository(
        traceId,
        SHOWCASE_PAGE_SIZE.chatThreads,
        0
      )
      const nextThreads = await buildMerchantThreadsWithLocalMeta(threads)

      setMerchantChatThreads(current => mergeMerchantThreadSummariesByConversationId(
        current,
        nextThreads
      ))
      showSnackbar('Threads refreshed.')
    } finally {
      setMerchantChatListRefreshing(false)
    }
  }

  async function deleteMerchantThread(conversationIdInput: string): Promise<void> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return

    clearMerchantConversationLocalArtifacts(conversationId)

    await chatRepository.deleteThreadLocal(storeId, conversationId)

    setMerchantChatThreads(current => removeMerchantThread({
      threads: current,
      conversationId
    }))

    const resetPlan = buildMerchantThreadDeleteResetPlan({
      deletedConversationId: conversationId,
      activeConversationId,
      fallbackConversationId: repository.buildConversationId(storeId, clientId)
    })

    if (resetPlan.shouldResetActiveChat) {
      setActiveConversation(null)
      setChatMessages([])
      setChatSelectedMessageIds([])
      setChatFindResultIds([])
      setChatFocusedMessageId(null)
      setChatMediaItems([])
      setChatMediaPreviewUrls([])
      setChatMediaPreviewIndex(0)
      setChatDraft('')
      setChatDraftImageUrls([])
      setChatPendingProduct(null)
      setChatQuotedMessageId(null)
      setActiveConversationId(resetPlan.nextActiveConversationId)
      setRuntimeActiveConversationId(resetPlan.nextRuntimeActiveConversationId)
      setRuntimeChatVisible(resetPlan.runtimeChatVisible)
    }

    await refreshMerchantChatListSilently()
  }

  async function toggleMerchantThreadPin(conversationIdInput: string, pinned: boolean): Promise<void> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return

    const nextPinned = Boolean(pinned)

    await chatRepository.setThreadPinned(storeId, conversationId, nextPinned)

    let shouldSyncActiveChat = false
    let nextChatPinned = nextPinned

    setMerchantChatThreads(current => {
      const operationResult = buildMerchantThreadPinOperationResult({
        threads: current,
        conversationId,
        pinned: nextPinned,
        activeConversationId
      })

      shouldSyncActiveChat = operationResult.shouldSyncActiveChat
      nextChatPinned = operationResult.nextChatPinned

      return operationResult.nextThreads
    })

    await refreshMerchantChatListSilently()

    if (shouldSyncActiveChat) {
      setChatPinned(nextChatPinned)
      await syncChat()
    }
  }

  async function renameMerchantThread(conversationIdInput: string, titleInput: string): Promise<void> {
    const conversationId = conversationIdInput.trim()
    const title = titleInput.trim()

    if (!conversationId || !title) return

    await chatRepository.setThreadAlias(storeId, conversationId, title)

    let shouldUpdateActiveConversation = false
    let nextActiveCustomerName = title

    setMerchantChatThreads(current => {
      const operationResult = buildMerchantThreadAliasOperationResult({
        threads: current,
        conversationId,
        title,
        activeConversationId
      })

      shouldUpdateActiveConversation = operationResult.shouldUpdateActiveConversation
      nextActiveCustomerName = operationResult.nextActiveCustomerName

      return operationResult.nextThreads
    })

    if (shouldUpdateActiveConversation && activeConversation) {
      setActiveConversation({
        ...activeConversation,
        customerName: nextActiveCustomerName
      })

      await syncChat()
    }

    await refreshMerchantChatListSilently()
  }

  function quoteChatMessage(messageIdInput: string): void {
    const messageId = messageIdInput.trim()
    if (!messageId) return

    const domainState = quoteMessageInDomain(buildCurrentChatDomainState(), messageId)
    const quotePreview = domainState.quotePreviewText || buildChatQuotePreviewForSend(messageId) || ''

    setChatQuotedMessageId(domainState.quoteMessageId || messageId)
    setChatPendingProduct(domainState.pendingProduct)
    setChatSelectedMessageIds(domainState.selectedIds)
    updateChatDraftPersistence(chatDraft, chatDraftImageUrls, domainState.pendingProduct, domainState.quoteMessageId || messageId)

    if (quotePreview && domainState.quoteMessageId) {
      setChatStatusMessage(null)
    }

    void syncChat()
  }

  function toggleChatMessageSelection(messageIdInput: string): void {
    const messageId = messageIdInput.trim()
    if (!messageId) return

    const domainState = toggleSelectionInDomain(buildCurrentChatDomainState(), messageId)
    applyChatDomainInteractionState(domainState)
    void syncChat()
  }

  async function deleteSelectedChatMessages(): Promise<void> {
    if (!chatSelectedMessageIds.length) return

    const ids = [...chatSelectedMessageIds]
    await chatRepository.deleteLocalByIds(storeId, ids)

    const domainState = deleteSelectedMessagesFromState(buildCurrentChatDomainState())
    const remainingIds = new Set(domainState.messages.map(message => message.id))

    setChatMessages(current => current.filter(message => remainingIds.has(message.id)))
    setChatSelectedMessageIds(domainState.selectedIds)
    showSnackbar('Selected messages removed locally.')
    await syncChat()
  }

  async function deleteChatMessage(messageIdInput: string): Promise<void> {
    const messageId = messageIdInput.trim()
    if (!messageId) return

    await chatRepository.deleteLocalById(storeId, messageId)

    setChatMessages(current => current.filter(message => message.id !== messageId))
    setChatSelectedMessageIds(current => current.filter(id => id !== messageId))
    await syncChat()
  }

  function openChatSearchResults(): void {
    const sourceScreen = screen || ShowcaseScreens.Chat

    chatSearchBackTargetRef.current = sourceScreen
    chatBackTargetBeforeSearchRef.current = chatBackTargetRef.current || ShowcaseScreens.Chat
    chatSearchScopeRef.current = sourceScreen === ShowcaseScreens.Chat
      ? 'InConversation'
      : 'InExistingThreads'

    const domainState = openFindInDomain({
      ...closeFindInDomain(buildCurrentChatDomainState()),
      findQuery: '',
      findMatchIds: [],
      findFocusedId: null,
      scrollToMessageId: null,
      flashMessageId: null
    })

    chatSearchLoadSeqRef.current += 1
    applyChatDomainInteractionState(domainState)
    setChatSearchResults([])
    setChatSearchPagination({
      nextOffset: 0,
      hasMore: false,
      isLoadingMore: false
    })
    setPreviousScreen(sourceScreen)
    setScreen(ShowcaseScreens.ChatSearchResults)
    void syncChat()
  }

  function jumpToFoundMessage(messageIdInput: string): void {
    const messageId = messageIdInput.trim()
    if (!messageId) return

    setChatFocusedMessageId(messageId)
    setPreviousScreen(screen)
    setScreen('Chat')
  }

  function openChatMediaGallery(): void {
    if (screen !== 'Chat') return

    chatMediaBackTargetRef.current = ShowcaseScreens.Chat
    setPreviousScreen(screen)
    setScreen('ChatMedia')
    void loadInitialChatMediaItems()
  }

  function chatOpenImagePreview(urlInput: string, poolInput: string[]): void {
    const url = urlInput.trim()
    const pool = poolInput
      .map(item => item.trim())
      .filter(Boolean)

    const fallbackPool = buildChatMediaItemsForUi()
      .map(item => item.url)
      .map(item => item.trim())
      .filter(Boolean)

    const nextPool = pool.length ? Array.from(new Set(pool)) : Array.from(new Set(fallbackPool))

    if (!url || !nextPool.length) return

    const index = nextPool.indexOf(url)

    setChatMediaPreviewUrls(nextPool)
    setChatMediaPreviewIndex(index >= 0 ? index : 0)
    chatMediaBackTargetRef.current = screen === 'ChatMedia'
      ? chatMediaBackTargetRef.current
      : screen
    setPreviousScreen(screen)
    setScreen('ChatMedia')
  }

  function openProductFromChat(dishIdInput: string): void {
    const dishId = dishIdInput.trim()
    if (!dishId) return

    openDetail(dishId)
  }

  function setPendingProductForChat(product: ShowcaseChatProductShare | null): void {
    const result = applyPendingProductForChat({
      draftText: chatDraft,
      draftImageUris: chatDraftImageUrls,
      currentQuoteMessageId: chatQuotedMessageId,
      product
    })

    setChatPendingProduct(result.pendingProduct)
    setChatPendingAppointment(null)
    setChatQuotedMessageId(result.quoteMessageId)
    updateChatDraftPersistence(
      result.draftText,
      result.draftImageUris,
      result.pendingProduct,
      result.quoteMessageId,
      null
    )
  }

  function setPendingAppointmentForChat(appointment: ShowcaseChatAppointmentShare | null): void {
    const result = applyPendingAppointmentForChat({
      draftText: chatDraft,
      draftImageUris: chatDraftImageUrls,
      currentQuoteMessageId: chatQuotedMessageId,
      appointment
    })

    setChatPendingAppointment(result.pendingAppointment)
    setChatPendingProduct(null)
    setChatQuotedMessageId(result.quoteMessageId)
    updateChatDraftPersistence(
      result.draftText,
      result.draftImageUris,
      null,
      result.quoteMessageId,
      result.pendingAppointment
    )
  }

  function buildProductClipboardPayload(product: ShowcaseChatProductShare): string {
    return buildProductSharePayloadForClipboard(product)
  }

  function isProductAvailable(dishIdInput: string): boolean {
    const dish = getDishEntityById(dishIdInput)
    return Boolean(dish && !dish.isSoldOut && !dish.isHidden)
  }

  function removeDraftChatImage(urlInput: string): void {
    const url = urlInput.trim()
    if (!url) return

    setChatDraftImageUrls(current => {
      const next = current.filter(item => item !== url)
      updateChatDraftPersistence(chatDraft, next, chatPendingProduct, chatQuotedMessageId)
      return next
    })
  }

  function extractClientIdFromConversationId(conversationIdInput: string): string | null {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return null

    const parts = conversationId.split(':')
    if (parts.length >= 3 && parts[0] === 'cloud') {
      return parts[2] || null
    }

    return conversationId
  }

  function extractMainBodyForSearch(valueInput: string): string {
    const value = valueInput.trim()
    if (!value) return ''

    const parsed = parseNdjcChatPayload(value)
    const body = parsed.body || parsed.product?.title || ''

    return body
      .replace(/\s+/g, ' ')
      .replace(/^>.*$/gm, '')
      .trim()
  }

  function resolvedStoreDisplayNameForChatSearch(): string {
    const name = String(storeProfileForUi.displayName || '').trim()

    return name || 'Store'
  }

  function resolvedCustomerDisplayNameForChatSearch(conversationIdInput: string | null | undefined): string {
    const conversationId = String(conversationIdInput || '').trim()

    if (!conversationId) {
      return activeConversation?.customerName?.trim() || DEFAULT_CUSTOMER_NAME
    }

    const fromMerchantThreads = merchantChatThreads
      .find(item => item.conversationId === conversationId)
      ?.title
      ?.trim()

    if (fromMerchantThreads) {
      return fromMerchantThreads
    }

    const fromMerchantSummaries = merchantThreadSummaries
      .find(item => item.conversationId === conversationId)
      ?.title
      ?.trim()

    if (fromMerchantSummaries) {
      return fromMerchantSummaries
    }

    if (conversationId === activeConversationId) {
      const fromActiveConversation = activeConversation?.customerName?.trim()

      if (fromActiveConversation) {
        return fromActiveConversation
      }
    }

    return DEFAULT_CUSTOMER_NAME
  }

  function resolvedCurrentConversationDisplayName(): string {
    return currentChatRole() === 'merchant'
      ? resolvedCustomerDisplayNameForChatSearch(activeConversationId)
      : resolvedStoreDisplayNameForChatSearch()
  }

  function resolvedSearchSenderLabelForCurrentMessage(message: ShowcaseChatMessage): string {
    if (message.outgoing) {
      return 'Me'
    }

    return currentChatRole() === 'merchant'
      ? resolvedCustomerDisplayNameForChatSearch(activeConversationId)
      : resolvedStoreDisplayNameForChatSearch()
  }

  function resolvedSearchSenderLabelForEntity(
    message: ChatMessageEntity,
    thread: ChatThreadSummary | null | undefined
  ): string {
    const role = String(message.role || '').trim().toLowerCase()
    const currentRole = currentChatRole()

    if (currentRole === 'merchant') {
      if (role === 'merchant' || role === 'store') {
        return 'Me'
      }

      return resolvedCustomerDisplayNameForChatSearch(thread?.conversationId || message.conversationId)
    }

    if (role === 'client' || role === 'user' || role === 'customer') {
      return 'Me'
    }

    if (role === 'merchant' || role === 'store') {
      return resolvedStoreDisplayNameForChatSearch()
    }

    return role || 'Message'
  }

  function buildChatPushBodyPreview(valueInput: string, hasImages = false, hasProduct = false): string {
    const parsed = parseNdjcChatPayload(valueInput)
    const value = extractMainBodyForSearch(valueInput)
    const resolvedHasProduct = hasProduct || Boolean(parsed.product)
    const resolvedHasImages = hasImages || parsed.imageUris.length > 0

    if (value) {
      return value.length > 120 ? `${value.slice(0, 117)}...` : value
    }

    if (resolvedHasProduct) return 'Product card'
    if (resolvedHasImages) return 'Image message'

    return 'New message'
  }

  function chatEntityToCloudMessage(entity: ChatMessageEntity): ChatMessage {
    const parsed = parseNdjcChatPayload(entity.text)
    const senderRole = entity.role === 'client' ? 'user' : entity.role

    return {
      id: entity.id,
      storeId: entity.storeId,
      conversationId: entity.conversationId,
      senderRole,
      senderId: null,
      body: entity.text,
      imageUrls: parsed.imageUris,
      productDishId: parsed.product?.dishId || null,
      quotedMessageId: parsed.quoteMessageId,
      createdAt: entity.timeMs > 0 ? entity.timeMs : null,
      readAt: entity.isRead ? entity.timeMs || Date.now() : null,
      localStatus: entity.status
    }
  }

  async function loadChatMessagesFromRepository(conversationIdInput: string): Promise<ChatMessage[]> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return []

    const localMessages = await chatRepository.listLocal(
      storeId,
      conversationId,
      SHOWCASE_PAGE_SIZE.chatMessages,
      0
    )

    if (localMessages.length > 0) {
      void chatRepository.syncConversationFromCloud({
        storeId,
        conversationId,
        perspectiveRole: currentChatPerspectiveRole(),
        clientId,
        traceId: `VM${Date.now()}_${conversationId.slice(-4)}`
      })

      return localMessages.map(chatEntityToCloudMessage)
    }

    await chatRepository.syncConversationFromCloud({
      storeId,
      conversationId,
      perspectiveRole: currentChatPerspectiveRole(),
      clientId,
      traceId: `VM${Date.now()}_${conversationId.slice(-4)}`
    })

    const syncedLocalMessages = await chatRepository.listLocal(
      storeId,
      conversationId,
      SHOWCASE_PAGE_SIZE.chatMessages,
      0
    )

    return syncedLocalMessages.map(chatEntityToCloudMessage)
  }

  async function fetchMerchantThreadsFromChatRepository(
    traceId: string,
    limitInput: number = SHOWCASE_PAGE_SIZE.chatThreads,
    offsetInput = 0
  ): Promise<ChatThreadSummary[]> {
    const rows = await chatRepository.fetchCloudThreadSummaries(
      storeId,
      traceId,
      limitInput,
      offsetInput
    )
    const threads = rows
      .map(row => cloudThreadSummaryToLegacyChatThread(row))
      .filter(thread => thread.conversationId.trim().length > 0)

    const withUnreadCounts = await Promise.all(threads.map(async thread => {
      const unreadCount = await chatRepository.countUnreadForMerchantConversation(
        storeId,
        thread.conversationId,
        traceId
      )

      return {
        ...thread,
        unreadCount
      }
    }))

    return withUnreadCounts
  }
  async function searchMerchantThreadsFromChatRepository(
    traceId: string,
    keywordInput: string,
    limitInput: number = SHOWCASE_PAGE_SIZE.chatThreads,
    offsetInput = 0
  ): Promise<ChatThreadSummary[]> {
    const keyword = String(keywordInput || '').trim()

    if (!keyword) return []

    const rows = await chatRepository.searchCloudThreadSummariesByCustomerName(
      storeId,
      keyword,
      traceId,
      limitInput,
      offsetInput
    )
    const threads = rows
      .map(row => cloudThreadSummaryToLegacyChatThread(row))
      .filter(thread => thread.conversationId.trim().length > 0)

    const withUnreadCounts = await Promise.all(threads.map(async thread => {
      const unreadCount = await chatRepository.countUnreadForMerchantConversation(
        storeId,
        thread.conversationId,
        traceId
      )

      return {
        ...thread,
        unreadCount
      }
    }))

    return withUnreadCounts
  }
  async function buildMerchantThreadsWithLocalMeta(cloudThreads: ChatThreadSummary[]): Promise<ChatThreadSummary[]> {
    const localMetaList = await chatRepository.listThreadMetaByStore(storeId)

    return buildMerchantThreadsWithLocalMetaInDomain({
      cloudThreads,
      localMetaList
    })
  }

  function mergeMerchantThreadSummariesByConversationId(
    currentThreads: ChatThreadSummary[],
    nextThreads: ChatThreadSummary[]
  ): ChatThreadSummary[] {
    const merged = new Map<string, ChatThreadSummary>()

    currentThreads.forEach(thread => {
      const conversationId = String(thread.conversationId || '').trim()
      if (conversationId) {
        merged.set(conversationId, thread)
      }
    })

    nextThreads.forEach(thread => {
      const conversationId = String(thread.conversationId || '').trim()
      if (conversationId) {
        merged.set(conversationId, thread)
      }
    })

    return Array.from(merged.values()).sort((left, right) => {
      if (left.pinned !== right.pinned) {
        return left.pinned ? -1 : 1
      }

      return (right.lastMessageAt || 0) - (left.lastMessageAt || 0)
    })
  }

  async function fetchLatestMerchantThreadsForMerge(traceId: string): Promise<ChatThreadSummary[]> {
    const latestThreads = await fetchMerchantThreadsFromChatRepository(
      traceId,
      SHOWCASE_PAGE_SIZE.chatThreads,
      0
    )

    return buildMerchantThreadsWithLocalMeta(latestThreads)
  }

  async function mergeLatestMerchantThreadsIntoState(traceId: string): Promise<ChatThreadSummary[]> {
    const latestThreads = await fetchLatestMerchantThreadsForMerge(traceId)

    setMerchantChatThreads(current => mergeMerchantThreadSummariesByConversationId(
      current,
      latestThreads
    ))

    return latestThreads
  }

  function buildChatQuotePreviewForSend(messageIdInput: string | null): string | null {
    return resolveChatQuotePreviewForSend({
      messageId: messageIdInput,
      messages: chatUiMessages
    })
  }

  function toChatDomainMessage(message: ShowcaseChatMessage): ShowcaseChatDomainMessageUi {
    const parsedPayload = parseNdjcChatPayload(message.body)
    const resolvedQuoteMessageId = message.quotedMessageId ?? parsedPayload.quoteMessageId

    return toShowcaseChatDomainMessage({
      message,
      quotePreviewText: buildChatQuotePreviewForSend(resolvedQuoteMessageId ?? null) || '',
      findQuery: chatFindQuery,
      findMatchIds: chatFindResultIds,
      focusedMessageId: chatFocusedMessageId
    })
  }

  function buildCurrentChatDomainState(): ShowcaseChatUiStateDomain {
    const role = currentChatRole()

    return {
      title: role === 'merchant'
        ? merchantChatThreads.find(item => item.conversationId === activeConversationId)?.title || DEFAULT_CUSTOMER_NAME
        : storeProfileForUi.displayName || 'Showcase Store',
      subtitle: role === 'merchant' ? activeConversationId || '' : storeProfileForUi.tagline || '',
      useStoreTitle: role !== 'merchant',
      canTogglePinned: role === 'merchant',
      isPinned: chatPinned,
      isConnecting: false,
      isRefreshing: false,
      isSending: chatIsSending || chatIsOpening,

      isLoadingOlder: false,
      canLoadOlder: true,

      errorMessage: chatStatusMessage,

      conversationId: activeConversationId ?? null,
      draftText: chatDraft,

      draftImageUris: chatDraftImageUrls,
      pendingCameraUri: null,

      messages: chatUiMessages.map(toChatDomainMessage),

      quote: null,

      isSelectionMode: chatSelectedMessageIds.length > 0,
      selectedIds: chatSelectedMessageIds,

      quoteMessageId: chatQuotedMessageId,
      quotePreviewText: buildChatQuotePreviewForSend(chatQuotedMessageId ?? null) || '',
      quoteProduct: null,
      quoteAppointment: null,

      isSearchResults: Boolean(chatFindQuery.trim()),
      isFindOpen: Boolean(chatFindQuery.trim()),
      findQuery: chatFindQuery,

      globalSearchResults: [],

      findMatchIds: chatFindResultIds,
      findFocusedIndex: chatFocusedMessageId ? Math.max(chatFindResultIds.indexOf(chatFocusedMessageId), 0) : 0,

      flashMessageId: chatFlashMessageId,
      flashSignal: chatFlashSignal,

      scrollToMessageId: chatScrollToMessageId,
      scrollToMessageSignal: chatScrollToMessageSignal,

      pendingProduct: chatPendingProduct,
      pendingAppointment: chatPendingAppointment,

      newestCreatedAt: null,
      oldestCreatedAt: null,

      windowMode: chatMessageWindow.mode,
      anchorMessageId: chatMessageWindow.anchorMessageId,
      hasNewerMessages: chatMessageWindow.hasNewer,
      isLoadingNewerMessages: chatMessageWindow.isLoadingNewer,
      oldestMessageTimeMs: chatMessageWindow.oldestTimeMs,
      newestMessageTimeMs: chatMessageWindow.newestTimeMs,

      unreadCount: merchantChatThreads.find(item => item.conversationId === activeConversationId)?.unreadCount || 0,
      scrollToBottomSignal: chatScrollToBottomSignal,

      findFocusedId: chatFocusedMessageId,
      findScrollSignal: 0
    }
  }

  function applyChatDomainInteractionState(domainState: ShowcaseChatUiStateDomain): void {
    const focusedId = domainState.findFocusedId ||
      domainState.scrollToMessageId ||
      domainState.flashMessageId ||
      null

    setChatSelectedMessageIds(domainState.selectedIds)
    setChatFindQuery(domainState.findQuery)
    setChatFindResultIds(domainState.findMatchIds)
    setChatFocusedMessageId(focusedId)
    setChatScrollToMessageId(domainState.scrollToMessageId)
    setChatScrollToMessageSignal(domainState.scrollToMessageSignal)
    setChatFlashMessageId(domainState.flashMessageId)
    setChatFlashSignal(domainState.flashSignal)
    setChatStatusMessage(domainState.errorMessage)
    setChatMessageWindow(current => {
      const nextState = {
        ...current,
        mode: domainState.windowMode,
        anchorMessageId: domainState.anchorMessageId,
        hasNewer: domainState.hasNewerMessages,
        isLoadingNewer: domainState.isLoadingNewerMessages,
        oldestTimeMs: domainState.oldestMessageTimeMs,
        newestTimeMs: domainState.newestMessageTimeMs
      }

      chatMessageWindowRef.current = nextState
      return nextState
    })
  }

  function buildChatSearchResultsForUi(): ShowcaseChatSearchResultUi[] {
    return chatSearchResults.map(result => ({
      conversationId: result.conversationId,
      messageId: result.messageId || '',
      senderLabel: result.senderLabel,
      createdAtText: result.createdAtText,
      snippet: result.snippet
    }))
  }

  function buildChatMediaItemsForUi(): ShowcaseChatMediaItemUi[] {
    type SortableChatMediaItem = ShowcaseChatMediaItemUi & {
      createdAtMsForSort: number
    }

    function formatChatMediaDayKey(timeMs: number): string {
      const date = new Date(timeMs)

      if (Number.isNaN(date.getTime())) {
        return 'Unknown date'
      }

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    }

    const byUrl = new Map<string, SortableChatMediaItem>()

    chatMediaItems.forEach((item, itemIndex) => {
      const url = String(item.url || '').trim()
      const createdAtMs = Number(item.createdAtMs || 0) || itemIndex * 1000

      if (!url) return

      const current = byUrl.get(url)

      const nextItem: SortableChatMediaItem = {
        conversationId: item.conversationId,
        messageId: item.messageId,
        url,
        dayKey: formatChatMediaDayKey(createdAtMs),
        createdAtText: item.createdAtText,
        createdAtMsForSort: createdAtMs
      }

      if (!current || nextItem.createdAtMsForSort > current.createdAtMsForSort) {
        byUrl.set(url, nextItem)
      }
    })

    return Array.from(byUrl.values())
      .sort((left, right) => right.createdAtMsForSort - left.createdAtMsForSort)
      .map(item => ({
        conversationId: item.conversationId,
        messageId: item.messageId,
        url: item.url,
        dayKey: item.dayKey,
        createdAtText: item.createdAtText
      }))
  }

  function buildChatProductClipboardPayload(product: ShowcaseChatProductShare): string {
    return buildProductClipboardPayload(product)
  }

  async function sendChat(): Promise<void> {
    if (chatPendingAppointment) {
      await sendPendingAppointmentShare()
      return
    }

    if (chatPendingProduct) {
      await sendPendingProductShare()
      return
    }

    await sendChatMessage()
  }

  async function sendChatAsClient(): Promise<void> {
    const previousMode = chatModeRef.current

    setChatMode('Client')

    try {
      if (chatPendingAppointment) {
        await sendPendingAppointmentShare()
      } else if (chatPendingProduct) {
        await sendPendingProductShare()
      } else {
        await sendChatMessage()
      }
    } finally {
      setChatMode(previousMode)
    }
  }

  async function sendPendingProductShare(): Promise<void> {
    if (chatIsSending || chatIsOpeningRef.current) return

    const product = chatPendingProduct
    if (!product) return

    if (guardOfflineWriteOperation()) {
      setChatStatusMessage('You are offline. Please reconnect and try again.')
      return
    }

    setChatIsSending(true)
    setChatStatusMessage(null)

    try {
      const conversation = await ensureActiveConversation()
      if (!conversation) {
        throw new Error('Conversation unavailable.')
      }

      const now = Date.now()
      const traceId = `VM${now}_${conversation.id.slice(-4)}`
      const messageClientId = conversation.clientId || clientId
      const senderRoleForEntity = currentChatRole()
      const sendPlan = buildPendingProductShareSendPlan({
        product,
        conversationId: conversation.id,
        storeId,
        clientId: messageClientId,
        senderRole: senderRoleForEntity === 'merchant' ? 'merchant' : 'client',
        now,
        createMessageId: () => createId('msg')
      })

      if (!sendPlan) return

      setChatMessages(current => mergeChatMessagesForConversation(
        current,
        conversation.id,
        sendPlan.entities.map(entity => chatEntityToCloudMessage(entity))
      ))
      triggerChatScrollToBottomForOwnSend()

      const results: boolean[] = []

      for (const entity of sendPlan.entities) {
        const ok = await chatRepository.insertMessageToCloud(entity, traceId)
        results.push(ok)
      }

      const operationResult = buildChatSendOperationResult({
        sendPlan,
        results,
        fallbackProductPushBody: 'Sent you an item card'
      })

      if (operationResult.shouldFail) {
        throw new Error('Message send failed.')
      }

      if (operationResult.shouldClearDraft) {
        const clearPlan = buildChatDraftClearPlan()

        setChatDraft(clearPlan.draftText)
        setChatDraftImageUrls(clearPlan.draftImageUris)
        setChatPendingProduct(clearPlan.pendingProduct)
        setChatPendingAppointment(clearPlan.pendingAppointment)
        setChatQuotedMessageId(clearPlan.quoteMessageId)
        updateChatDraftPersistence(
          clearPlan.draftText,
          clearPlan.draftImageUris,
          clearPlan.pendingProduct,
          clearPlan.quoteMessageId,
          clearPlan.pendingAppointment
        )
      }

      await mergeLatestLocalChatMessages(conversation.id)
      triggerChatScrollToBottomForOwnSend()

      const senderRole = currentChatRole()
      const targetAudience = senderRole === 'merchant' ? 'chat_client' : 'chat_merchant'
      const openAs = senderRole === 'merchant' ? 'client' : 'merchant'
      const targetClientId = conversation.clientId || clientId
      const senderClientId = senderRole === 'merchant' ? null : targetClientId
      const suppressLocalVisibleChatPush = shouldSuppressRuntimeChatPush(conversation.id)

      console.log('[NDJC_PUSH] Chat push dispatch start.', {
        storeId,
        conversationId: conversation.id,
        senderRole,
        targetAudience,
        openAs,
        targetClientId,
        senderClientId,
        suppressLocalVisibleChatPush,
        pushBody: operationResult.pushBody
      })

      const chatPushOk = await repository.dispatchChatPush({
        storeId,
        conversationId: conversation.id,
        title: resolveChatPushSenderName(senderRole),
        body: operationResult.pushBody,
        senderRole,
        targetAudience,
        openAs,
        targetClientId,
        senderClientId
      })

      console.log('[NDJC_PUSH] Chat push dispatch result.', {
        storeId,
        conversationId: conversation.id,
        senderRole,
        targetAudience,
        openAs,
        targetClientId,
        senderClientId,
        chatPushOk,
        code: repository.lastAnnouncementPushCode,
        body: repository.lastAnnouncementPushBody
      })

      if (!chatPushOk) {
        console.warn('[NDJC_PUSH] Chat push dispatch failed.', {
          storeId,
          conversationId: conversation.id,
          senderRole,
          targetAudience,
          openAs,
          targetClientId,
          senderClientId,
          code: repository.lastAnnouncementPushCode,
          body: repository.lastAnnouncementPushBody
        })
      }

      await syncChat()
      await refreshChatEntryDotOnce()
    } catch (error) {
      setChatStatusMessage(normalizeChatSendErrorMessage(error))

      if (activeConversationId.trim()) {
        await mergeLatestLocalChatMessages(activeConversationId)
      }
    } finally {
      setChatIsSending(false)
    }
  }
  async function sendPendingAppointmentShare(): Promise<void> {
    if (chatIsSending || chatIsOpeningRef.current) return

    const appointment = chatPendingAppointment
    if (!appointment) return

    if (guardOfflineWriteOperation()) {
      setChatStatusMessage('You are offline. Please reconnect and try again.')
      return
    }

    setChatIsSending(true)
    setChatStatusMessage(null)

    try {
      const conversation = await ensureActiveConversation()
      if (!conversation) {
        throw new Error('Conversation unavailable.')
      }

      const now = Date.now()
      const traceId = `VM${now}_${conversation.id.slice(-4)}`
      const messageClientId = conversation.clientId || clientId
      const senderRoleForEntity = currentChatRole()
      const sendPlan = buildPendingAppointmentShareSendPlan({
        appointment,
        conversationId: conversation.id,
        storeId,
        clientId: messageClientId,
        senderRole: senderRoleForEntity === 'merchant' ? 'merchant' : 'client',
        now,
        createMessageId: () => createId('msg')
      })

      if (!sendPlan) return

      setChatMessages(current => mergeChatMessagesForConversation(
        current,
        conversation.id,
        sendPlan.entities.map(entity => chatEntityToCloudMessage(entity))
      ))
      triggerChatScrollToBottomForOwnSend()

      const results: boolean[] = []

      for (const entity of sendPlan.entities) {
        const ok = await chatRepository.insertMessageToCloud(entity, traceId)
        results.push(ok)
      }

      const operationResult = buildChatSendOperationResult({
        sendPlan,
        results
      })

      if (operationResult.shouldFail) {
        throw new Error('Message send failed.')
      }

      if (operationResult.shouldClearDraft) {
        const clearPlan = buildChatDraftClearPlan()

        setChatDraft(clearPlan.draftText)
        setChatDraftImageUrls(clearPlan.draftImageUris)
        setChatPendingProduct(clearPlan.pendingProduct)
        setChatPendingAppointment(clearPlan.pendingAppointment)
        setChatQuotedMessageId(clearPlan.quoteMessageId)
        updateChatDraftPersistence(
          clearPlan.draftText,
          clearPlan.draftImageUris,
          clearPlan.pendingProduct,
          clearPlan.quoteMessageId,
          clearPlan.pendingAppointment
        )
      }

      await mergeLatestLocalChatMessages(conversation.id)
      triggerChatScrollToBottomForOwnSend()

      const senderRole = currentChatRole()
      const targetAudience = senderRole === 'merchant' ? 'chat_client' : 'chat_merchant'
      const openAs = senderRole === 'merchant' ? 'client' : 'merchant'
      const targetClientId = conversation.clientId || clientId
      const senderClientId = senderRole === 'merchant' ? null : targetClientId
      const suppressLocalVisibleChatPush = shouldSuppressRuntimeChatPush(conversation.id)

      console.log('[NDJC_PUSH] Booking chat push dispatch start.', {
        storeId,
        conversationId: conversation.id,
        senderRole,
        targetAudience,
        openAs,
        targetClientId,
        senderClientId,
        suppressLocalVisibleChatPush,
        pushBody: operationResult.pushBody
      })

      const chatPushOk = await repository.dispatchChatPush({
        storeId,
        conversationId: conversation.id,
        title: resolveChatPushSenderName(senderRole),
        body: operationResult.pushBody,
        senderRole,
        targetAudience,
        openAs,
        targetClientId,
        senderClientId
      })

      console.log('[NDJC_PUSH] Booking chat push dispatch result.', {
        storeId,
        conversationId: conversation.id,
        senderRole,
        targetAudience,
        openAs,
        targetClientId,
        senderClientId,
        chatPushOk,
        code: repository.lastAnnouncementPushCode,
        body: repository.lastAnnouncementPushBody
      })

      if (!chatPushOk) {
        console.warn('[NDJC_PUSH] Booking chat push dispatch failed.', {
          storeId,
          conversationId: conversation.id,
          senderRole,
          targetAudience,
          openAs,
          targetClientId,
          senderClientId,
          code: repository.lastAnnouncementPushCode,
          body: repository.lastAnnouncementPushBody
        })
      }

      await syncChat()
      await refreshChatEntryDotOnce()
    } catch (error) {
      setChatStatusMessage(normalizeChatSendErrorMessage(error))

      if (activeConversationId.trim()) {
        await mergeLatestLocalChatMessages(activeConversationId)
      }
    } finally {
      setChatIsSending(false)
    }
  }
  function chatCancelQuote(): void {
    const domainState = cancelQuoteInDomain(buildCurrentChatDomainState())

    setChatQuotedMessageId(domainState.quoteMessageId)
    setChatPendingProduct(domainState.pendingProduct)
    setChatPendingAppointment(domainState.pendingAppointment)
    updateChatDraftPersistence(
      domainState.draftText,
      domainState.draftImageUris,
      domainState.pendingProduct,
      domainState.quoteMessageId,
      domainState.pendingAppointment
    )
  }

  function chatCloseFind(): void {
    const domainState = closeFindInDomain(buildCurrentChatDomainState())
    applyChatDomainInteractionState(domainState)
  }

  function chatCloseMediaGallery(): void {
    chatMediaLoadSeqRef.current += 1
    setChatMediaPreviewUrls([])
    setChatMediaPreviewIndex(0)
    setChatMediaPagination({
      nextOffset: 0,
      hasMore: true,
      isLoadingMore: false
    })
    setPreviousScreen(chatBackTargetRef.current || ShowcaseScreens.Home)
    setScreen(chatMediaBackTargetRef.current)
    void syncChat()
  }

  function chatCloseSearchResults(): void {
    const domainState = closeFindInDomain({
      ...buildCurrentChatDomainState(),
      findQuery: '',
      findMatchIds: [],
      findFocusedId: null,
      scrollToMessageId: null,
      flashMessageId: null
    })

    chatBackTargetRef.current = chatBackTargetBeforeSearchRef.current
    chatSearchLoadSeqRef.current += 1

    applyChatDomainInteractionState(domainState)
    setChatSearchResults([])
    setChatSearchPagination({
      nextOffset: 0,
      hasMore: false,
      isLoadingMore: false
    })
    setPreviousScreen(chatBackTargetBeforeSearchRef.current)
    setScreen(chatSearchBackTargetRef.current)
    void syncChat()
  }

  function chatDeleteMessage(messageId: string): void {
    void deleteChatMessage(messageId)
  }

  function chatDeleteSelected(): void {
    void deleteSelectedChatMessages()
  }

  function chatEnterSelection(messageId: string): void {
    const id = messageId.trim()
    if (!id) return

    const domainState = enterSelectionInDomain(buildCurrentChatDomainState(), id)
    applyChatDomainInteractionState(domainState)
    void syncChat()
  }

  function chatExitSelection(): void {
    const domainState = exitSelectionInDomain(buildCurrentChatDomainState())
    applyChatDomainInteractionState(domainState)
    void syncChat()
  }

  function chatFindNext(): void {
    const domainState = findNextInDomain(buildCurrentChatDomainState())
    applyChatDomainInteractionState(domainState)
  }

  function chatFindPrev(): void {
    const domainState = findPrevInDomain(buildCurrentChatDomainState())
    applyChatDomainInteractionState(domainState)
  }
  function extractMainBodyForChatSearch(rawInput: string): string {
    const raw = String(rawInput || '').trim()

    if (!raw) return ''

    const parsedPayload = parseNdjcChatPayload(raw)
    const body = parsedPayload.body.trim()
    const productTitle = parsedPayload.product?.title?.trim() || ''

    if (body) return body
    if (productTitle) return productTitle
    if (parsedPayload.imageUris.length > 0) return 'Media message'

    return raw
  }

  function chatSearchThreadTitle(thread: ChatThreadSummary | null | undefined): string {
    const title = String(thread?.title || '').trim()

    if (title) return title

    const client = String(thread?.clientId || '').trim()
    if (client) return client

    return DEFAULT_CUSTOMER_NAME
  }

  function chatSearchThreadPreview(thread: ChatThreadSummary | null | undefined): string {
    const preview = String(thread?.lastMessage || '').trim()

    if (preview) return preview

    return 'Conversation'
  }

  function resolveThreadForChatSearchResult(conversationIdInput: string): ChatThreadSummary | null {
    const conversationId = String(conversationIdInput || '').trim()

    if (!conversationId) return null

    return merchantChatThreads.find(thread => thread.conversationId === conversationId) || null
  }

  function buildChatSearchResultFromEntity(message: ChatMessageEntity): ChatSearchResult {
    const thread = resolveThreadForChatSearchResult(message.conversationId)
    const createdAtMs = Number(message.timeMs || 0)
    const snippet = extractMainBodyForChatSearch(message.text) || 'Message'

    return {
      conversationId: message.conversationId,
      messageId: message.id,
      senderLabel: resolvedSearchSenderLabelForEntity(message, thread),
      snippet,
      createdAtText: formatChatCreatedAtText(createdAtMs) || '',
      createdAtMs,
      matchedInName: false
    }
  }

  function mergeChatSearchResults(
    currentItems: ChatSearchResult[],
    nextItems: ChatSearchResult[]
  ): ChatSearchResult[] {
    const merged = new Map<string, ChatSearchResult>()

    currentItems.forEach(item => {
      const key = `${item.conversationId}:${item.messageId || 'name'}`
      if (!merged.has(key)) {
        merged.set(key, item)
      }
    })

    nextItems.forEach(item => {
      const key = `${item.conversationId}:${item.messageId || 'name'}`
      merged.set(key, item)
    })

    return Array.from(merged.values())
      .sort((left, right) => right.createdAtMs - left.createdAtMs)
  }

  function buildChatMediaItemsFromEntity(message: ChatMessageEntity): ChatMediaItem[] {
    const parsedPayload = parseNdjcChatPayload(message.text)
    const createdAtMs = Number(message.timeMs || 0)
    const createdAtText = formatChatCreatedAtText(createdAtMs) || ''
    const imageUrls = Array.from(new Set(parsedPayload.imageUris
      .map(url => String(url || '').trim())
      .filter(Boolean)
    ))

    return imageUrls.map(url => ({
      conversationId: message.conversationId,
      messageId: message.id,
      url,
      createdAtText,
      createdAtMs
    }))
  }

  function mergeChatMediaItems(
    currentItems: ChatMediaItem[],
    nextItems: ChatMediaItem[]
  ): ChatMediaItem[] {
    const merged = new Map<string, ChatMediaItem>()

    currentItems.forEach(item => {
      const key = `${item.conversationId}:${item.messageId}:${item.url}`
      if (!merged.has(key)) {
        merged.set(key, item)
      }
    })

    nextItems.forEach(item => {
      const key = `${item.conversationId}:${item.messageId}:${item.url}`
      merged.set(key, item)
    })

    return Array.from(merged.values())
      .sort((left, right) => right.createdAtMs - left.createdAtMs)
  }

  async function rebuildChatSearchResultsForQuery(valueInput: string): Promise<void> {
    const query = valueInput.trim()
    const queryLower = query.toLowerCase()
    const loadSeq = ++chatSearchLoadSeqRef.current
    const limit = SHOWCASE_PAGE_SIZE.chatSearchResults

    if (!queryLower) {
      setChatSearchResults([])
      setChatSearchPagination({
        nextOffset: 0,
        hasMore: false,
        isLoadingMore: false
      })
      return
    }

    setChatSearchPagination({
      nextOffset: 0,
      hasMore: true,
      isLoadingMore: true
    })

    try {
      if (chatSearchScopeRef.current === 'InConversation') {
        const conversationId = String(activeConversationId || '').trim()

        if (!conversationId) {
          if (chatSearchLoadSeqRef.current !== loadSeq) return

          setChatSearchResults([])
          setChatSearchPagination({
            nextOffset: 0,
            hasMore: false,
            isLoadingMore: false
          })
          return
        }

        const localResults = await chatRepository.searchLocalMessagesByConversationKeyword(
          storeId,
          conversationId,
          query,
          limit
        )

        if (chatSearchLoadSeqRef.current !== loadSeq) return

        const localUiResults = localResults.map(buildChatSearchResultFromEntity)
        setChatSearchResults(localUiResults)

        const effectiveRole = currentChatPerspectiveRole()

        if (effectiveRole === 'merchant') {
          const validSession = await ensureValidMerchantSessionLoadedForCloud()

          if (!validSession) {
            if (chatSearchLoadSeqRef.current !== loadSeq) return

            setChatSearchPagination({
              nextOffset: 0,
              hasMore: false,
              isLoadingMore: false
            })
            setStatusMessage(merchantSessionEnsureFailureMessage())
            showSnackbar(merchantSessionEnsureSnackbarMessage())
            return
          }

          setStoreMerchantSessionFromAuthSession(validSession)
          bindMerchantSessionToRepository(repository)
        }

        const traceId = `VM${Date.now()}_${storeId.slice(-4)}`
        const effectiveClientId = effectiveRole === 'merchant'
          ? activeConversation?.clientId || merchantChatThreads.find(thread => thread.conversationId === conversationId)?.clientId || clientId
          : clientId

        const cloudResults = await chatRepository.searchCloudMessagesByConversationKeyword({
          storeId,
          conversationId,
          keyword: query,
          perspectiveRole: effectiveRole,
          clientId: effectiveClientId,
          limit,
          offset: 0,
          traceId
        })

        if (chatSearchLoadSeqRef.current !== loadSeq) return

        const cloudUiResults = cloudResults.map(buildChatSearchResultFromEntity)

        setChatSearchResults(mergeChatSearchResults(localUiResults, cloudUiResults))
        setChatSearchPagination({
          nextOffset: limit,
          hasMore: cloudResults.length >= limit,
          isLoadingMore: false
        })
        return
      }

      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        if (chatSearchLoadSeqRef.current !== loadSeq) return

        setChatSearchResults([])
        setChatSearchPagination({
          nextOffset: 0,
          hasMore: false,
          isLoadingMore: false
        })
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const localResults = await chatRepository.searchLocalMessagesByStoreKeyword({
        storeId,
        keyword: query,
        limit,
        maxScan: SHOWCASE_PAGE_SIZE.chatSearchMaxLocalScan
      })

      if (chatSearchLoadSeqRef.current !== loadSeq) return

      const localUiResults = localResults.map(buildChatSearchResultFromEntity)
      setChatSearchResults(localUiResults)

      const traceId = `VM${Date.now()}_${storeId.slice(-4)}`
      const cloudResults = await chatRepository.searchCloudMessagesByStoreKeyword({
        storeId,
        keyword: query,
        perspectiveRole: 'merchant',
        clientId: null,
        limit,
        offset: 0,
        traceId
      })

      if (chatSearchLoadSeqRef.current !== loadSeq) return

      const cloudUiResults = cloudResults.map(buildChatSearchResultFromEntity)

      setChatSearchResults(mergeChatSearchResults(localUiResults, cloudUiResults))
      setChatSearchPagination({
        nextOffset: limit,
        hasMore: cloudResults.length >= limit,
        isLoadingMore: false
      })
    } catch {
      if (chatSearchLoadSeqRef.current !== loadSeq) return

      setChatSearchPagination({
        nextOffset: 0,
        hasMore: false,
        isLoadingMore: false
      })
      setStatusMessage('Failed to search messages.')
    }
  }

  async function loadMoreChatSearchResults(): Promise<void> {
    const query = chatFindQuery.trim()

    if (!query || chatSearchPagination.isLoadingMore || !chatSearchPagination.hasMore) return

    const loadSeq = ++chatSearchLoadSeqRef.current
    const offset = chatSearchPagination.nextOffset
    const limit = SHOWCASE_PAGE_SIZE.chatSearchResults

    setChatSearchPagination(current => ({
      ...current,
      isLoadingMore: true
    }))

    try {
      if (chatSearchScopeRef.current === 'InConversation') {
        const conversationId = String(activeConversationId || '').trim()

        if (!conversationId) {
          if (chatSearchLoadSeqRef.current !== loadSeq) return

          setChatSearchPagination({
            nextOffset: 0,
            hasMore: false,
            isLoadingMore: false
          })
          return
        }

        const effectiveRole = currentChatPerspectiveRole()

        if (effectiveRole === 'merchant') {
          const validSession = await ensureValidMerchantSessionLoadedForCloud()

          if (!validSession) {
            if (chatSearchLoadSeqRef.current !== loadSeq) return

            setChatSearchPagination(current => ({
              ...current,
              hasMore: false,
              isLoadingMore: false
            }))
            setStatusMessage(merchantSessionEnsureFailureMessage())
            showSnackbar(merchantSessionEnsureSnackbarMessage())
            return
          }

          setStoreMerchantSessionFromAuthSession(validSession)
          bindMerchantSessionToRepository(repository)
        }

        const traceId = `VM${Date.now()}_${storeId.slice(-4)}`
        const effectiveClientId = effectiveRole === 'merchant'
          ? activeConversation?.clientId || merchantChatThreads.find(thread => thread.conversationId === conversationId)?.clientId || clientId
          : clientId

        const nextResults = await chatRepository.searchCloudMessagesByConversationKeyword({
          storeId,
          conversationId,
          keyword: query,
          perspectiveRole: effectiveRole,
          clientId: effectiveClientId,
          limit,
          offset,
          traceId
        })

        if (chatSearchLoadSeqRef.current !== loadSeq) return

        const nextUiResults = nextResults.map(buildChatSearchResultFromEntity)

        setChatSearchResults(current => mergeChatSearchResults(current, nextUiResults))
        setChatSearchPagination({
          nextOffset: offset + limit,
          hasMore: nextResults.length >= limit,
          isLoadingMore: false
        })
        return
      }

      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        if (chatSearchLoadSeqRef.current !== loadSeq) return

        setChatSearchPagination(current => ({
          ...current,
          hasMore: false,
          isLoadingMore: false
        }))
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const traceId = `VM${Date.now()}_${storeId.slice(-4)}`
      const nextResults = await chatRepository.searchCloudMessagesByStoreKeyword({
        storeId,
        keyword: query,
        perspectiveRole: 'merchant',
        clientId: null,
        limit,
        offset,
        traceId
      })

      if (chatSearchLoadSeqRef.current !== loadSeq) return

      const nextUiResults = nextResults.map(buildChatSearchResultFromEntity)

      setChatSearchResults(current => mergeChatSearchResults(current, nextUiResults))
      setChatSearchPagination({
        nextOffset: offset + limit,
        hasMore: nextResults.length >= limit,
        isLoadingMore: false
      })
    } catch {
      if (chatSearchLoadSeqRef.current !== loadSeq) return

      setChatSearchPagination(current => ({
        ...current,
        isLoadingMore: false
      }))
      setStatusMessage('Failed to load more search results.')
    }
  }

  async function loadInitialChatMediaItems(): Promise<void> {
    const loadSeq = ++chatMediaLoadSeqRef.current
    const limit = SHOWCASE_PAGE_SIZE.chatMediaItems
    const conversationId = String(activeConversationId || '').trim()

    setChatMediaPagination({
      nextOffset: 0,
      hasMore: true,
      isLoadingMore: true
    })

    if (!conversationId) {
      if (chatMediaLoadSeqRef.current !== loadSeq) return

      setChatMediaItems([])
      setChatMediaPagination({
        nextOffset: 0,
        hasMore: false,
        isLoadingMore: false
      })
      return
    }

    const localMessages = await chatRepository.fetchLocalMediaMessagesByConversation({
      storeId,
      conversationId,
      limit,
      maxScan: SHOWCASE_PAGE_SIZE.chatMediaMaxLocalScan
    })

    if (chatMediaLoadSeqRef.current !== loadSeq) return

    const localMediaItems = localMessages.flatMap(buildChatMediaItemsFromEntity)
    setChatMediaItems(localMediaItems)

    try {
      const validSession = currentChatRole() === 'merchant'
        ? await ensureValidMerchantSessionLoadedForCloud()
        : null

      if (currentChatRole() === 'merchant' && !validSession) {
        if (chatMediaLoadSeqRef.current !== loadSeq) return

        setChatMediaPagination({
          nextOffset: 0,
          hasMore: false,
          isLoadingMore: false
        })
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      if (validSession) {
        setStoreMerchantSessionFromAuthSession(validSession)
        bindMerchantSessionToRepository(repository)
      }

      const traceId = `VM${Date.now()}_${storeId.slice(-4)}`
      const cloudMessages = await chatRepository.fetchCloudMediaMessagesByConversation({
        storeId,
        conversationId,
        perspectiveRole: currentChatPerspectiveRole(),
        clientId: currentChatRole() === 'merchant' ? null : clientId,
        limit,
        offset: 0,
        traceId
      })

      if (chatMediaLoadSeqRef.current !== loadSeq) return

      setChatMediaItems(mergeChatMediaItems(
        localMediaItems,
        cloudMessages.flatMap(buildChatMediaItemsFromEntity)
      ))
      setChatMediaPagination({
        nextOffset: limit,
        hasMore: cloudMessages.length >= limit,
        isLoadingMore: false
      })
    } catch {
      if (chatMediaLoadSeqRef.current !== loadSeq) return

      setChatMediaPagination({
        nextOffset: 0,
        hasMore: false,
        isLoadingMore: false
      })
      setStatusMessage('Failed to load media.')
    }
  }

  async function loadMoreChatMediaItems(): Promise<void> {
    if (chatMediaPagination.isLoadingMore || !chatMediaPagination.hasMore) return

    const loadSeq = ++chatMediaLoadSeqRef.current
    const offset = chatMediaPagination.nextOffset
    const limit = SHOWCASE_PAGE_SIZE.chatMediaItems
    const conversationId = String(activeConversationId || '').trim()

    if (!conversationId) {
      setChatMediaPagination({
        nextOffset: 0,
        hasMore: false,
        isLoadingMore: false
      })
      return
    }

    setChatMediaPagination(current => ({
      ...current,
      isLoadingMore: true
    }))

    try {
      const validSession = currentChatRole() === 'merchant'
        ? await ensureValidMerchantSessionLoadedForCloud()
        : null

      if (currentChatRole() === 'merchant' && !validSession) {
        if (chatMediaLoadSeqRef.current !== loadSeq) return

        setChatMediaPagination(current => ({
          ...current,
          hasMore: false,
          isLoadingMore: false
        }))
        setStatusMessage(merchantSessionEnsureFailureMessage())
        showSnackbar(merchantSessionEnsureSnackbarMessage())
        return
      }

      if (validSession) {
        setStoreMerchantSessionFromAuthSession(validSession)
        bindMerchantSessionToRepository(repository)
      }

      const traceId = `VM${Date.now()}_${storeId.slice(-4)}`
      const cloudMessages = await chatRepository.fetchCloudMediaMessagesByConversation({
        storeId,
        conversationId,
        perspectiveRole: currentChatPerspectiveRole(),
        clientId: currentChatRole() === 'merchant' ? null : clientId,
        limit,
        offset,
        traceId
      })

      if (chatMediaLoadSeqRef.current !== loadSeq) return

      setChatMediaItems(current => mergeChatMediaItems(
        current,
        cloudMessages.flatMap(buildChatMediaItemsFromEntity)
      ))
      setChatMediaPagination({
        nextOffset: offset + limit,
        hasMore: cloudMessages.length >= limit,
        isLoadingMore: false
      })
    } catch {
      if (chatMediaLoadSeqRef.current !== loadSeq) return

      setChatMediaPagination(current => ({
        ...current,
        isLoadingMore: false
      }))
      setStatusMessage('Failed to load more media.')
    }
  }
  function chatFindQueryChange(value: string): void {
    const domainState = onFindQueryChangeInDomain(buildCurrentChatDomainState(), value)
    applyChatDomainInteractionState(domainState)

    if (screen === ShowcaseScreens.ChatSearchResults) {
      void rebuildChatSearchResultsForQuery(value)
    }
  }

  function chatSetFindQuery(value: string): void {
    chatFindQueryChange(value)
  }

  function chatJumpToFoundMessage(messageId: string): void {
    const id = messageId.trim()
    if (!id) return

    const closedFindState = closeFindInDomain({
      ...buildCurrentChatDomainState(),
      findQuery: '',
      findMatchIds: [],
      findFocusedId: null,
      scrollToMessageId: null,
      flashMessageId: null
    })
    const domainState = jumpToMessageInDomain(closedFindState, id)

    chatBackTargetRef.current = chatBackTargetBeforeSearchRef.current

    applyChatDomainInteractionState(domainState)
    setPreviousScreen(chatBackTargetBeforeSearchRef.current)
    setScreen(ShowcaseScreens.Chat)
    void syncChat()
  }

  function chatJumpToMessageFromQuote(messageId: string): void {
    const domainState = jumpToMessageInDomain(buildCurrentChatDomainState(), messageId)
    applyChatDomainInteractionState(domainState)
  }

  function chatOpenFind(): void {
    const domainState = openFindInDomain({
      ...buildCurrentChatDomainState(),
      findQuery: '',
      findMatchIds: [],
      findFocusedId: null,
      scrollToMessageId: null,
      flashMessageId: null
    })

    applyChatDomainInteractionState(domainState)
  }

  function chatOpenMediaGallery(): void {
    openChatMediaGallery()
  }

  function chatOpenSearchResults(): void {
    snapshotCurrentChatContext()
    openChatSearchResults()
  }

  async function openChatAroundMessageFromSearch(
    conversationIdInput: string,
    messageIdInput: string
  ): Promise<boolean> {
    const conversationId = String(conversationIdInput || '').trim()
    const messageId = String(messageIdInput || '').trim()

    if (!conversationId || !messageId) return false

    const role = currentChatRole()
    const traceId = `VM${Date.now()}_${conversationId.slice(-4)}`
    const loadSeq = ++chatMessageLoadSeqRef.current
    const effectiveClientId = role === 'merchant'
      ? activeConversation?.clientId || merchantChatThreads.find(thread => thread.conversationId === conversationId)?.clientId || clientId
      : clientId

    setChatStatusMessage(null)

    const result = await chatRepository.listMessagesAroundMessage({
      storeId,
      conversationId,
      messageId,
      perspectiveRole: role === 'merchant' ? 'merchant' : 'client',
      clientId: effectiveClientId,
      beforeLimit: 15,
      afterLimit: 15,
      traceId
    })

    if (
      chatMessageLoadSeqRef.current !== loadSeq ||
      activeConversationIdRef.current.trim() !== conversationId ||
      currentChatRole() !== role
    ) {
      return false
    }

    if (!result.found || !result.targetMessage || result.messages.length === 0) {
      setChatStatusMessage('Message not found.')
      return false
    }

    const messages = limitChatMessagesForActiveWindow(
      result.messages.map(chatEntityToCloudMessage),
      {
        mode: 'aroundMessage',
        anchorMessageId: messageId,
        hasOlder: result.hasOlder,
        hasNewer: result.hasNewer,
        isLoadingOlder: false,
        isLoadingNewer: false,
        oldestTimeMs: result.oldestTimeMs,
        newestTimeMs: result.newestTimeMs
      }
    )
    const bounds = getChatMessageWindowBounds(messages)
    const nextWindow: ChatMessageWindowRuntimeState = {
      mode: 'aroundMessage',
      anchorMessageId: messageId,
      hasOlder: result.hasOlder,
      hasNewer: result.hasNewer,
      isLoadingOlder: false,
      isLoadingNewer: false,
      oldestTimeMs: result.oldestTimeMs ?? bounds.oldestTimeMs,
      newestTimeMs: result.newestTimeMs ?? bounds.newestTimeMs
    }
    const nextPaginationState = {
      nextOffset: messages.length,
      hasMore: result.hasOlder,
      isLoadingMore: false
    }

    chatMessageWindowRef.current = nextWindow
    chatMessagesPaginationRef.current = nextPaginationState

    setChatMessages(messages)
    setChatMessageWindow(nextWindow)
    setChatMessagesPagination(nextPaginationState)

    const mediaItems = messages.flatMap(message => message.imageUrls
      .map(url => url.trim())
      .filter(Boolean)
      .map(url => ({
        conversationId,
        messageId: message.id,
        url,
        createdAtText: formatChatCreatedAtText(message.createdAt),
        createdAtMs: Number(message.createdAt || 0)
      }))
    )

    setChatMediaItems(mediaItems)

    const closedFindState = closeFindInDomain(buildCurrentChatDomainState())
    const domainState = jumpToMessageInDomain({
      ...closedFindState,
      windowMode: 'aroundMessage',
      anchorMessageId: messageId,
      hasNewerMessages: result.hasNewer,
      isLoadingNewerMessages: false,
      oldestMessageTimeMs: nextWindow.oldestTimeMs,
      newestMessageTimeMs: nextWindow.newestTimeMs
    }, messageId)

    applyChatDomainInteractionState(domainState)

    return true
  }

  function chatOpenThreadFromSearch(conversationId: string, messageId?: string | null): void {
    const threadId = conversationId.trim()
    const targetMessageId = messageId?.trim() || null

    if (chatSearchScopeRef.current === 'InConversation') {
      const activeThreadId = threadId || activeConversationIdRef.current.trim()

      chatBackTargetRef.current = ShowcaseScreens.ChatSearchResults

      void (async () => {
        const openedAroundMessage = targetMessageId
          ? await openChatAroundMessageFromSearch(activeThreadId, targetMessageId)
          : false

        if (!openedAroundMessage) {
          const closedFindState = closeFindInDomain(buildCurrentChatDomainState())
          const domainState = targetMessageId
            ? jumpToMessageInDomain(closedFindState, targetMessageId)
            : closedFindState

          applyChatDomainInteractionState(domainState)
        }

        chatBackTargetRef.current = ShowcaseScreens.ChatSearchResults
        setPreviousScreen(ShowcaseScreens.ChatSearchResults)
        setScreen(ShowcaseScreens.Chat)
        void syncChat()
      })()

      return
    }

    if (!threadId) return

    chatSearchBackTargetRef.current = ShowcaseScreens.MerchantChatList
    chatBackTargetBeforeSearchRef.current = ShowcaseScreens.MerchantChatList
    chatBackTargetRef.current = ShowcaseScreens.ChatSearchResults

    const closedFindState = closeFindInDomain(buildCurrentChatDomainState())
    applyChatDomainInteractionState(closedFindState)

    void (async () => {
      await openMerchantThread(threadId)

      chatBackTargetRef.current = ShowcaseScreens.ChatSearchResults
      setPreviousScreen(ShowcaseScreens.ChatSearchResults)
      setScreen(ShowcaseScreens.Chat)

      const openedAroundMessage = targetMessageId
        ? await openChatAroundMessageFromSearch(threadId, targetMessageId)
        : false

      if (!openedAroundMessage && targetMessageId) {
        const domainState = jumpToMessageInDomain(buildCurrentChatDomainState(), targetMessageId)
        applyChatDomainInteractionState(domainState)
      }

      void syncChat()
    })()
  }

  function chatQuoteMessage(messageId: string): void {
    quoteChatMessage(messageId)
  }

  function chatRemoveDraftImage(url: string): void {
    removeDraftChatImage(url)
  }

  function chatTogglePinned(): void {
    const conversationId = String(activeConversationId || '').trim()
    if (!conversationId) return

    setChatPinned(current => {
      const nextPinned = !current

      void chatRepository.setThreadPinned(storeId, conversationId, nextPinned)

      setMerchantChatThreads(threads => buildMerchantThreadsFromCloudSummaries(threads.map(thread => {
        if (thread.conversationId !== conversationId) return thread

        return {
          ...thread,
          pinned: nextPinned
        }
      })))

      return nextPinned
    })
  }

  function chatToggleSelection(messageId: string): void {
    toggleChatMessageSelection(messageId)
  }

  function chatUseProductCardAsPending(product: ShowcaseChatProductShare | null): void {
    setPendingProductForChat(product)
  }

  function onChatDraftChange(value: string): void {
    const parsedProduct = parseNdjcProductSharePayload(value)

    if (parsedProduct) {
      const product: ShowcaseChatProductShare = {
        dishId: parsedProduct.dishId,
        title: parsedProduct.title,
        price: parsedProduct.price,
        originalPriceText: parsedProduct.originalPriceText,
        discountPriceText: parsedProduct.discountPriceText,
        imageUrl: parsedProduct.imageUrl,
        isRecommended: parsedProduct.isRecommended
      }

      setChatPendingProduct(product)
      setChatPendingAppointment(null)
      setChatDraft('')
      setChatQuotedMessageId(null)
      updateChatDraftPersistence('', chatDraftImageUrls, product, null, null)
      return
    }

    setChatDraft(value)
    updateChatDraftPersistence(value, chatDraftImageUrls, chatPendingProduct, chatQuotedMessageId, chatPendingAppointment)
  }

async function onChatImagesSelected(values: Array<File | Blob | string>): Promise<void> {
  if (!values.length) return

  const draftUrls: string[] = []
  let hasFailedImage = false

  for (const value of values) {
    const draftUrl = await resolveChatDraftImageUrl(value)

    if (!draftUrl) {
      hasFailedImage = true
      continue
    }

    draftUrls.push(draftUrl)
  }

  if (hasFailedImage) {
    showSnackbar('Image compress failed.')
  }

  if (!draftUrls.length) return

  draftUrls.forEach(url => {
    rememberLocalTempImage(storeId, 'chat-draft', url)
  })

  let shouldShowLimitMessage = false

  setChatDraftImageUrls(current => {
    const result = applyChatDraftImagesPicked({
      currentImageUris: current,
      imageUris: draftUrls,
      maxImages: 9
    })

    shouldShowLimitMessage = result.limitReached || draftUrls.length > Math.max(0, 9 - current.length)

    updateChatDraftPersistence(
      chatDraft,
      result.nextImageUris,
      chatPendingProduct,
      chatQuotedMessageId
    )

    return result.nextImageUris
  })

  if (shouldShowLimitMessage) {
    onChatImageLimitReached()
  }
}

function onChatImageLimitReached(): void {
  showSnackbar('Reached max 9 images.')
}

  async function onChatCameraResult(value: File | Blob | string | null): Promise<void> {
    if (!value) {
      deletePendingChatCameraFile(storeId)
      return
    }

    await handleChatImagePicked(value)
    deletePendingChatCameraFile(storeId)
  }

  async function onChatCameraPreviewResult(value: File | Blob | string | null): Promise<void> {
    if (!value) return
    await handleChatImagePicked(value)
  }

  function onChatCameraPermissionDenied(): void {
    showSnackbar('Camera permission denied.')
  }

  function onChatFullCameraUnavailable(): void {
    showSnackbar('Camera is unavailable in this PWA runtime.')
  }

  function onChatScreenVisible(): void {
    markRuntimeConversationVisible(activeConversationId)
    setRuntimeChatVisible(true)
    postChatVisibilityToServiceWorker({
      visible: true,
      conversationId: activeConversationId,
      screen,
      clientId,
      chatRole: currentChatRole()
    })
    snapshotCurrentChatContext()
    startChatPolling()
    startChatDbObserve()
    void syncChat()
  }

  function onChatScreenHidden(): void {
    snapshotCurrentChatContext()
    setRuntimeChatVisible(false)
    postChatVisibilityToServiceWorker({
      visible: false,
      conversationId: activeConversationId,
      screen,
      clientId,
      chatRole: currentChatRole()
    })
    stopChatPolling()
    stopChatDbObserve()
  }

  async function refreshChatLatest(): Promise<void> {
    await syncChat()
  }

  function saveChatPreviewImage(url: string): void {
    savePreviewImage(url)
  }

  function moveEditImage(fromIndex: number, toIndex: number): void {
    setEditDishImageUrls(current => {
      if (fromIndex < 0 || fromIndex >= current.length) return current
      if (toIndex < 0 || toIndex >= current.length) return current

      const next = [...current]
      const [item] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, item)
      return next
    })
  }

  function openEditDish(dishIdInput: string): void {
    const dishId = dishIdInput.trim()
    if (!dishId) return

    const dish = getAdminEditableDishById(dishId)
    if (!dish) return

    fillEditDishForm(dish)

    if (screen !== 'Edit') {
      setPreviousScreen(screen)
    }

    setSelectedDishId(dish.id)
    setStatusMessage(null)
    setEditValidationError(null)
    setScreen('Edit')
  }

  function startNewDish(): void {
    resetEditDishForm()
    setSelectedDishId(null)

    if (screen !== 'Edit') {
      setPreviousScreen(screen)
    }

    setStatusMessage(null)
    setEditValidationError(null)
    setScreen('Edit')
  }

  function startEditStoreProfile(): void {
    const baseProfile = storeProfile || storeProfileFromCloud(storeProfileCloud)
    const nextDraft = storeProfileDraftFromProfile(baseProfile)

    setStoreProfileDraft(nextDraft)
    setDraftStoreProfileServices(storeProfileServices)
    setDraftStoreProfileExtraContacts(
      storeProfileExtraContacts.map((item, index) => ({
        id: item.id || `extra_contact_${index + 1}`,
        name: item.name,
        value: item.value
      }))
    )
    setDraftStoreProfileCoverUrl(storeProfileCoverUrl)
    setDraftStoreProfileLogoUrl(storeProfileLogoUrl)
    setDraftStoreProfileDescription(storeProfileCloud?.description || '')
    setDraftBusinessStatus(storeProfileCloud?.businessStatus || '')
    setIsEditingStoreProfile(true)
    setIsSavingStoreProfile(false)
    setStoreProfileSaveError(null)
    setStoreProfileSaveSuccess(false)
    writePersistedStoreProfileDraft(storeId, null)
  }

  function cancelEditStoreProfile(): void {
    clearStoreProfileDraftLocalImages(storeId)
    setStoreProfileDraft(null)
    setDraftStoreProfileServices(storeProfileServices)
    setDraftStoreProfileExtraContacts(
      storeProfileExtraContacts.map((item, index) => ({
        id: item.id || `extra_contact_${index + 1}`,
        name: item.name,
        value: item.value
      }))
    )
    setDraftStoreProfileCoverUrl(storeProfileCoverUrl)
    setDraftStoreProfileLogoUrl(storeProfileLogoUrl)
    setDraftStoreProfileDescription(storeProfileCloud?.description || '')
    setDraftBusinessStatus(storeProfileCloud?.businessStatus || '')
    setIsEditingStoreProfile(false)
    setIsSavingStoreProfile(false)
    setStoreProfileSaveError(null)
    setStoreProfileSaveSuccess(false)
    writePersistedStoreProfileDraft(storeId, null)
  }

  function updateStoreProfileDraft(patch: Partial<ShowcaseStoreProfileDraft>): void {
    setStoreProfileDraft(current => {
      const base = current || storeProfileDraftFromProfile(storeProfile || storeProfileFromCloud(storeProfileCloud))
      const next = {
        ...base,
        ...patch,
        isDirty: true
      }

      writePersistedStoreProfileDraft(storeId, next)
      return next
    })
  }

  function addStoreService(valueInput: string): void {
    const value = valueInput.trim()
    if (!value) return

    setDraftStoreProfileServices(current => {
      if (current.includes(value)) return current
      return [...current, value]
    })
  }

  function removeStoreService(indexInput: number): void {
    const index = Math.max(0, Math.round(indexInput))

    setDraftStoreProfileServices(current => {
      if (index < 0 || index >= current.length) return current
      return current.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  function addExtraContact(nameInput: string, valueInput: string): void {
    const name = nameInput.trim()
    const value = valueInput.trim()

    if (!name || !value) return

    setDraftStoreProfileExtraContacts(current => [
      ...current,
      {
        id: createId('extra_contact'),
        name,
        value
      }
    ])

    setStoreProfileSaveError(null)
  }

  function removeExtraContact(idInput: string): void {
    const id = idInput.trim()
    if (!id) return

    setDraftStoreProfileExtraContacts(current => current.filter(item => item.id !== id))
  }

  function updateExtraContactName(idInput: string, value: string): void {
    const id = idInput.trim()
    if (!id) return

    setDraftStoreProfileExtraContacts(current => current.map(item => {
      if (item.id !== id) return item

      return {
        ...item,
        name: value
      }
    }))
  }

  function updateExtraContactValue(idInput: string, value: string): void {
    const id = idInput.trim()
    if (!id) return

    setDraftStoreProfileExtraContacts(current => current.map(item => {
      if (item.id !== id) return item

      return {
        ...item,
        value
      }
    }))
  }

  function onStoreProfileDraftTitleChange(value: string): void {
    updateStoreProfileDraft({ displayName: value })
  }

  function onStoreProfileDraftSubtitleChange(value: string): void {
    updateStoreProfileDraft({ tagline: value })
  }

  function onStoreProfileDraftDescriptionChange(value: string): void {
    setDraftStoreProfileDescription(value.slice(0, 200))
    setStoreProfileSaveError(null)
  }

  function onStoreProfileDraftAddressChange(value: string): void {
    updateStoreProfileDraft({ address: value })
  }

  function onStoreProfileDraftHoursChange(value: string): void {
    updateStoreProfileDraft({ businessHours: value })
  }

  function onStoreProfileDraftMapUrlChange(value: string): void {
    updateStoreProfileDraft({ mapUrl: value })
  }

  function onStoreProfileDraftBusinessStatusChange(value: string): void {
    setDraftBusinessStatus(value)
  }

  function onStoreProfileDraftLogoUrlChange(value: string): void {
    void onStoreProfileLogoPicked(value)
  }

  function onStoreProfileDraftCoverUrlChange(value: string): void {
    void onStoreProfileCoversPicked([value])
  }

  function storeProfileDraftImageUrl(value: File | Blob | string): string {
    if (typeof value === 'string') {
      const url = value.trim()

      if (url && isLocalImageUri(url)) {
        rememberLocalTempImage(storeId, 'store-profile', url)
      }

      return url
    }

    if (!isBrowser()) {
      return ''
    }

    const url = window.URL.createObjectURL(value)
    rememberLocalTempImage(storeId, 'store-profile', url)
    return url
  }

  async function uploadStoreImageIfNeeded(value: File | Blob | string, scope: 'logo' | 'cover'): Promise<UploadedShowcaseImage | null> {
    if (typeof value === 'string') {
      const url = value.trim()
      if (!url) return null

      if (!isLocalImageUri(url)) {
        return {
          url,
          variants: createRemoteOnlyImageVariants(url)
        }
      }

      try {
        const response = await fetch(url)
        if (!response.ok) return null

        const blob = await response.blob()
        const uploaded = await pickAndUploadImageWithVariants({
          bucket: 'store',
          pathPrefix: scope,
          file: blob
        })

        if (uploaded) {
          rememberLocalTempImage(storeId, 'store-profile', url)
        }

        return uploaded
      } catch {
        return null
      }
    }

    return pickAndUploadImageWithVariants({
      bucket: 'store',
      pathPrefix: scope,
      file: value
    })
  }

  async function onStoreProfileLogoPicked(value: File | Blob | string): Promise<void> {
    const url = storeProfileDraftImageUrl(value)

    if (!url) {
      showSnackbar('Logo selection failed.')
      return
    }

    setDraftStoreProfileLogoUrl(url)
    setStoreProfileSaveError(null)
    setStoreProfileSaveSuccess(false)
  }

  function onStoreProfileLogoRemove(): void {
    const url = draftStoreProfileLogoUrl
    setDraftStoreProfileLogoUrl('')

    if (url && isAppOwnedLocalFileUri(storeId, url)) {
      deleteAppOwnedLocalFileUri(storeId, url)
    }
  }

  async function onStoreProfileCoversPicked(values: Array<File | Blob | string>): Promise<void> {
    if (!values.length) return

    const currentUrls = draftStoreProfileCoverUrl
      .replace(/\\n/g, '\n')
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean)
      .filter((item, index, all) => all.indexOf(item) === index)
      .slice(0, 9)

    if (currentUrls.length >= 9) {
      onStoreProfileCoverLimitReached()
      return
    }

    const nextUrls = [...currentUrls]

    for (const value of values) {
      if (nextUrls.length >= 9) {
        onStoreProfileCoverLimitReached()
        break
      }

      const url = storeProfileDraftImageUrl(value)

      if (!url) {
        showSnackbar('Cover selection failed.')
        continue
      }

      if (!nextUrls.includes(url)) {
        nextUrls.push(url)
      }
    }

    setDraftStoreProfileCoverUrl(nextUrls.slice(0, 9).join('\n'))
    setStoreProfileSaveError(null)
    setStoreProfileSaveSuccess(false)
  }

  function onStoreProfileCoverRemove(urlInput: string): void {
    const url = urlInput.trim()
    if (!url) return

    const currentUrls = draftStoreProfileCoverUrl
      .replace(/\\n/g, '\n')
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean)

    const nextUrls = currentUrls.filter(item => item !== url)

    setDraftStoreProfileCoverUrl(nextUrls.join('\n'))
    setStoreProfileSaveError(null)

    if (isAppOwnedLocalFileUri(storeId, url)) {
      deleteAppOwnedLocalFileUri(storeId, url)
    }
  }

  function onStoreProfileCoverMove(fromIndexInput: number, toIndexInput: number): void {
    const fromIndex = Math.max(0, Math.round(fromIndexInput))
    const toIndex = Math.max(0, Math.round(toIndexInput))

    const currentUrls = draftStoreProfileCoverUrl
      .replace(/\\n/g, '\n')
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean)
      .filter((item, index, all) => all.indexOf(item) === index)
      .slice(0, 9)

    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= currentUrls.length ||
      toIndex >= currentUrls.length ||
      fromIndex === toIndex
    ) {
      return
    }

    const nextUrls = [...currentUrls]
    const [moved] = nextUrls.splice(fromIndex, 1)
    nextUrls.splice(toIndex, 0, moved)

    setDraftStoreProfileCoverUrl(nextUrls.join('\n'))
    setStoreProfileSaveError(null)
  }

  function onStoreProfileCoverLimitReached(): void {
    showSnackbar('Reached max 9 images.')
  }

  function onStoreProfileServiceAdd(value: string): void {
    addStoreService(value)
  }

  function onStoreProfileServiceChange(indexInput: number, valueInput: string): void {
    const index = Math.max(0, Math.round(indexInput))

    setDraftStoreProfileServices(current => {
      if (index < 0 || index >= current.length) return current

      return current.map((item, itemIndex) => {
        if (itemIndex !== index) return item
        return valueInput
      })
    })

    setStoreProfileSaveError(null)
  }

  function onStoreProfileServiceRemove(index: number): void {
    removeStoreService(index)
  }

  function onStoreProfileExtraContactAdd(name: string, value: string): void {
    addExtraContact(name, value)
  }

  function onStoreProfileExtraContactNameChange(id: string, value: string): void {
    updateExtraContactName(id, value)
  }

  function onStoreProfileExtraContactValueChange(id: string, value: string): void {
    updateExtraContactValue(id, value)
  }

  function onStoreProfileExtraContactRemove(id: string): void {
    removeExtraContact(id)
  }

  function normalizeStoreProfileForCompare(
    profile: ShowcaseStoreProfile | ShowcaseStoreProfileDraft | null,
    description: string,
    services: string[],
    contacts: Array<ShowcaseExtraContact | DraftExtraContact>
  ): string {
    if (!profile) return ''

    return JSON.stringify({
      displayName: profile.displayName.trim(),
      tagline: profile.tagline.trim(),
      phone: profile.phone.trim(),
      address: profile.address.trim(),
      businessHours: profile.businessHours.trim(),
      websiteUrl: profile.websiteUrl.trim(),
      mapUrl: profile.mapUrl.trim(),
      description: description.trim(),
      services: services.map(item => item.trim()).filter(Boolean),
      contacts: contacts.map(item => ({
        name: item.name.trim(),
        value: item.value.trim()
      })).filter(item => item.name || item.value),
      coverUrl: draftStoreProfileCoverUrl.trim(),
      logoUrl: draftStoreProfileLogoUrl.trim(),
      businessStatus: draftBusinessStatus.trim()
    })
  }

  function hasUnsavedStoreProfileDraft(): boolean {
    const currentProfile = storeProfile || storeProfileFromCloud(storeProfileCloud)
    const draftProfile = storeProfileDraftForUi || storeProfileDraftFromProfile(currentProfile)

    const current = normalizeStoreProfileForCompare(
      currentProfile,
      storeProfileCloud?.description || '',
      storeProfileServices,
      storeProfileExtraContacts
    )

    const draft = normalizeStoreProfileForCompare(
      draftProfile,
      draftStoreProfileDescription,
      draftStoreProfileServices,
      draftStoreProfileExtraContacts
    )

    return current !== draft
  }

  function discardStoreProfileDraftAndGoHome(): void {
    clearStoreProfileDraftLocalImages(storeId)
    setStoreProfileDraft(null)
    setIsEditingStoreProfile(false)
    setIsSavingStoreProfile(false)
    setStoreProfileSaveError(null)
    setStoreProfileSaveSuccess(false)
    writePersistedStoreProfileDraft(storeId, null)
    setPreviousScreen(screen)
    setScreen('Home')
  }

  function copyToClipboard(label: string, value: string): void {
    const text = value.trim()
    if (!text) return

    if (isBrowser() && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => undefined)
    }

    showSnackbar('Copied')
  }

  function copyText(label: string, value: string): void {
    copyToClipboard(label, value)
  }

  const selectedDishDiscountInvalid = Boolean(editDishDiscountPrice.trim()) &&
    !Number.isFinite(Number(editDishDiscountPrice))

  const selectedDishOriginalPriceValue = Number(editDishOriginalPrice)
  const selectedDishDiscountPriceValue = Number(editDishDiscountPrice)

  const selectedDishDiscountGEPrice = Boolean(editDishDiscountPrice.trim()) &&
    Number.isFinite(selectedDishDiscountPriceValue) &&
    Number.isFinite(selectedDishOriginalPriceValue) &&
    selectedDishOriginalPriceValue > 0 &&
    selectedDishDiscountPriceValue >= selectedDishOriginalPriceValue

  const editDishCanSave = !isSavingEditDish && !isBlockingEditDish

  const activeProductForAppointment = activeAppointmentDish
    ? {
        dishId: activeAppointmentDish.id,
        title: getDishTitle(activeAppointmentDish),
        priceText: buildDishPriceTextSnapshot(activeAppointmentDish).priceText,
        originalPriceText: buildDishPriceTextSnapshot(activeAppointmentDish).originalPriceText,
        discountPriceText: buildDishPriceTextSnapshot(activeAppointmentDish).discountPriceText,
        imageUrl: selectDishImageUrl(activeAppointmentDish, 'list'),
        imageVariants: activeAppointmentDish.imageVariants ?? null,
        categoryText: activeAppointmentDish.category || null,
        isRecommended: Boolean(activeAppointmentDish.isRecommended)
      }
    : null

  const adminTodayDateKey = appointmentLocalDateKey(new Date())

  const dateFilterOptions = appointmentFilterRowsToFutureDateOptions(adminAppointmentFilterRows)

  const customerDateFilterOptions = [
    ...appointmentFilterRowsToFutureDateOptions(customerAppointmentFilterRows),
    'History'
  ]

  const statusFilterOptions = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-show']

  const selectedAdminHistoryDateForServiceOptions = appointmentAdminHistoryDateFilter?.trim() || ''
  const selectedAdminDateForServiceOptions = selectedAdminHistoryDateForServiceOptions || appointmentAdminDateFilter.trim() || 'All'
  const selectedAdminStatusForServiceOptions = appointmentAdminStatusFilter.trim() || 'All'

  const adminServiceFilterOptions = appointmentFilterRowsToServiceOptions(
    adminAppointmentFilterRows,
    selectedAdminDateForServiceOptions,
    selectedAdminStatusForServiceOptions,
    selectedAdminHistoryDateForServiceOptions || null
  )

  const selectedCustomerDateForServiceOptions = appointmentCustomerDateFilter.trim() || 'All'
  const selectedCustomerStatusForServiceOptions = appointmentCustomerStatusFilter.trim() || 'All'

  const customerServiceFilterOptions = appointmentFilterRowsToServiceOptions(
    customerAppointmentFilterRows,
    selectedCustomerDateForServiceOptions,
    selectedCustomerStatusForServiceOptions,
    null
  )

  const filteredCustomerAppointmentCards = filteredCustomerAppointments()

  const filteredAdminAppointmentCards = filteredAdminAppointments()

  const storeProfileForUi = storeProfile || storeProfileFromCloud(storeProfileCloud)
  const storeProfileDraftForUi: ShowcaseStoreProfileDraft | null = storeProfileDraft
    ? {
        displayName: storeProfileDraft.displayName,
        tagline: storeProfileDraft.tagline,
        phone: storeProfileDraft.phone,
        address: storeProfileDraft.address,
        businessHours: storeProfileDraft.businessHours,
        websiteUrl: storeProfileDraft.websiteUrl,
        mapUrl: storeProfileDraft.mapUrl,
        isDirty: 'isDirty' in storeProfileDraft ? Boolean((storeProfileDraft as ShowcaseStoreProfileDraft).isDirty) : false
      }
    : null

  const cloudStatusUi = cloudStatusToUi(cloudStatus, storeId)

  const syncNoticeLabel =
    syncOverviewState === SyncOverviewStates.Syncing
      ? 'Syncing...'
      : syncOverviewState === SyncOverviewStates.Failed
        ? syncErrorMessage
          ? `Sync failed: ${syncErrorMessage}`
          : 'Sync failed'
        : pendingSyncOperations.length
          ? `Sync: ${pendingSyncOperations.length} changes pending`
          : ''

  const bottomBarState = {
    showAppointments: appointmentsEnabled,
    showChatDot: shouldShowChatEntryDot(),
    showBookingsDot: shouldShowBookingsEntryDot(),
    showAnnouncementsDot: shouldShowAnnouncementsEntryDot()
  }

  const offlineBannerMessage = useMemo(() => {
    if (!isOffline) {
      return null
    }

    const writeHeavyScreens: ShowcaseScreenName[] = [
      'Admin',
      'AdminItems',
      'AdminCategories',
      'Edit',
      'StoreProfile',
      'ChangePassword',
      'AdminAppointmentManager',
      'AdminAnnouncementEdit',
      'Chat',
      'Appointments'
    ]

    return writeHeavyScreens.includes(screen)
      ? 'Offline · Changes need a connection'
      : 'Offline · Viewing cached data'
  }, [isOffline, screen])

  const offlineStatus: ShowcaseOfflineStatusUi = {
    isOffline,
    bannerMessage: offlineBannerMessage
  }

  const homeState: ShowcaseHomeUiState = {
    dishes: effectiveHomeDishesForUi,
    selectedCategory,
    manualCategories,
    isLoading: isLoading || isCloudLoading,
    statusMessage,
    snackbarMessage,

    storeProfile: storeProfileForUi,

    searchQuery,
    sortMode,
    filterRecommendedOnly,
    filterOnSaleOnly,

    priceMinDraft: homePriceMinDraft,
    priceMaxDraft: homePriceMaxDraft,
    appliedMinPrice: homeAppliedMinPrice,
    appliedMaxPrice: homeAppliedMaxPrice,

    allTags,
    selectedTags,

    showSortMenu: homeShowSortMenu,
    showFilterMenu: homeShowFilterMenu,
    showPriceMenu: homeShowPriceMenu,

    showAppointments: bottomBarState.showAppointments,
    showChatDot: bottomBarState.showChatDot,
    showBookingsDot: bottomBarState.showBookingsDot,
    showAnnouncementsDot: bottomBarState.showAnnouncementsDot,

    pagination: pageStateForUi(homePagination)
  }

  const loginState: ShowcaseLoginUiState = {
    isLoading: isLoginLoading,
    loginError,
    usernameDraft: loginUsernameDraft,
    passwordDraft: loginPasswordDraft,
    rememberMe: loginRememberMeDraft,
    canLogin: canLogin()
  }

  const detailState: ShowcaseDetailUiState = {
    bottomBar: bottomBarState,

    dishId: selectedDish?.id || '',
    isFavorite: selectedDish ? favoriteIds.includes(selectedDish.id) : false,
    title: selectedDish ? getDishTitle(selectedDish) : 'Item not found',
    subtitle: selectedDish?.description?.trim() || null,
    price: formatUsd(selectedDishOriginalPrice),
    discountPrice: selectedDishHasDiscount ? formatUsd(selectedDishDiscount) : null,
    description: selectedDish?.description || '',
    category: selectedDish?.category?.trim() || null,
    isRecommended: Boolean(selectedDish?.isRecommended),
    isUnavailable: Boolean(selectedDish?.isSoldOut),
    imagePreviewUrl: selectedDish
      ? selectImageVariantUrl(selectedDish.imageVariants, 'detail') || selectedDishImages[safeDetailImageIndex] || null
      : selectedDishImages[safeDetailImageIndex] || null,
    imageUrls: selectedDishImages,
    imageVariants: selectedDish?.imageVariants ?? null,
    currentImageIndex: detailImageIndex,
    safeImageIndex: safeDetailImageIndex,
    tags: selectedDish?.tags || [],
    externalLink: selectedDish?.externalLink?.trim() || null,
    canBookAppointment: Boolean(selectedDish && appointmentsEnabled && !selectedDish.isSoldOut)
  }

  const storeProfileState: ShowcaseStoreProfileUiState = {
    bottomBar: bottomBarState,

    canEdit: isAdminLoggedIn,

    title: storeProfileForUi.displayName,
    subtitle: storeProfileForUi.tagline,
    description: storeProfileCloud?.description || draftStoreProfileDescription || '',
    services: storeProfileServices,
    extraContacts: storeProfileExtraContacts,

    address: storeProfileForUi.address,
    hours: storeProfileForUi.businessHours,
    mapUrl: storeProfileForUi.mapUrl,
    businessStatus: storeProfileCloud?.businessStatus || draftBusinessStatus || '',

    appName: storeProfileForUi.displayName || 'App',
    versionName: '1.0.0',
    merchantEmail: 'Not provided',
    privacyUrl: `/privacy/${encodeURIComponent(storeId)}`,

    draftBusinessStatus,

    logoUrl: selectStoreLogoUrl({
      logoUrl: storeProfileLogoUrl,
      logoImageVariants: storeProfileCloud?.logoImageVariants ?? null
    }) || storeProfileLogoUrl,
    coverUrl: selectStoreCoverUrl({
      coverUrl: storeProfileCoverUrl,
      coverImageVariants: storeProfileCloud?.coverImageVariants ?? null
    }) || storeProfileCoverUrl,
    logoImageVariants: storeProfileCloud?.logoImageVariants ?? null,
    coverImageVariants: storeProfileCloud?.coverImageVariants ?? null,

    openStatusText: storeProfileCloud?.businessStatus || draftBusinessStatus || '',
    isOpenNow: null,

    isEditing: isEditingStoreProfile,
    draftTitle: storeProfileDraftForUi?.displayName || '',
    draftSubtitle: storeProfileDraftForUi?.tagline || '',
    draftDescription: draftStoreProfileDescription,
    draftAddress: storeProfileDraftForUi?.address || '',
    draftHours: storeProfileDraftForUi?.businessHours || '',
    draftMapUrl: storeProfileDraftForUi?.mapUrl || '',
    draftLogoUrl: draftStoreProfileLogoUrl,
    draftCoverUrl: draftStoreProfileCoverUrl,
    draftServices: draftStoreProfileServices,
    draftExtraContacts: draftStoreProfileExtraContacts,

    validationError: storeProfileSaveError,

    isSaving: isSavingStoreProfile,
    isRefreshing: isRefreshingStoreProfile,
    statusMessage,
    errorMessage: storeProfileSaveError,
    successMessage: storeProfileSaveSuccess ? 'Store profile saved.' : null,
    hasUnsavedChanges: hasUnsavedStoreProfileDraft()
  }

  const favoritesState: ShowcaseFavoritesUiState = {
    bottomBar: bottomBarState,

    query: favoritesQuery,
    items: favoriteCards,

    selectedIds: favoritesSelectedIds.filter(id => favoriteIds.includes(id)),

    sortMode: favoritesSortMode,
    filterRecommendedOnly: favoritesFilterRecommendedOnly,
    filterOnSaleOnly: favoritesFilterOnSaleOnly,

    priceMinDraft: favoritesPriceMinDraft,
    priceMaxDraft: favoritesPriceMaxDraft,
    appliedMinPrice: favoritesAppliedMinPrice,
    appliedMaxPrice: favoritesAppliedMaxPrice,

    showSortMenu: favoritesShowSortMenu,
    showFilterMenu: favoritesShowFilterMenu,
    showPriceMenu: favoritesShowPriceMenu,

    selectedCategory: favoriteCategories.includes(favoritesSelectedCategory || '')
      ? favoritesSelectedCategory
      : null,
    categories: favoriteCategories,

    statusMessage: statusMessage || snackbarMessage
  }

  const appointmentsState: ShowcaseAppointmentsUiState = {
    enabled: appointmentsEnabled,
    product: activeProductForAppointment,
    serviceDraft: appointmentServiceDraft,
    nameDraft: appointmentNameDraft,
    contactDraft: appointmentContactDraft,
    dateDraft: appointmentDateDraft,
    timeDraft: appointmentTimeDraft,
    noteDraft: appointmentNoteDraft,
    errorMessage: appointmentError,
    successMessage: appointmentSuccess,
    canSubmit: Boolean(
      appointmentsEnabled &&
      activeProductForAppointment &&
      appointmentSourceDishId &&
      appointmentServiceDraft.trim() &&
      appointmentNameDraft.trim() &&
      appointmentContactDraft.trim() &&
      appointmentDateDraft.trim() &&
      appointmentTimeDraft.trim() &&
      customerAppointmentDateChoices()
        .filter(option => option.available)
        .some(option => option.value === appointmentDateDraft.trim()) &&
      customerAppointmentTimeOptions(appointmentDateDraft)
        .includes(appointmentTimeDraft.trim())
    ) && !appointmentsRefreshing,
    isSubmitting: appointmentsRefreshing,

    bookingRuleSummary: customerAppointmentRuleSummary(),
    dateOptions: customerAppointmentDateChoices(),
    timeOptions: customerAppointmentTimeOptions()
  }

  const customerBookingsState: ShowcaseCustomerBookingsUiState = {
    bottomBar: bottomBarState,

    enabled: appointmentsEnabled,
    items: filteredCustomerAppointmentCards,
    statusMessage: statusMessage || snackbarMessage,
    isRefreshing: appointmentsRefreshing,

    dateFilterOptions: customerDateFilterOptions,
    statusFilterOptions,
    serviceFilterOptions: customerServiceFilterOptions,

    selectedDateFilter: appointmentCustomerDateFilter,
    selectedStatusFilter: appointmentCustomerStatusFilter,
    selectedServiceFilter: appointmentCustomerServiceFilter,

    pagination: pageStateForUi(customerAppointmentsPagination)
  }

  const adminAppointmentsState: ShowcaseAdminAppointmentsUiState = {
    enabled: appointmentsEnabled,
    items: filteredAdminAppointmentCards,
    statusMessage: statusMessage || snackbarMessage,
    isRefreshing: appointmentsRefreshing,
    statusSubmittingId: appointmentStatusSubmittingId,
    settingsSubmitting: appointmentSettingsSubmitting,

    bookingWindowDays: appointmentBookingWindowDays,
    availableHoursText: appointmentAvailableHoursText,
    slotIntervalMinutes: appointmentSlotIntervalMinutes,
    closedDays: appointmentClosedDays,
    minimumNotice: appointmentMinimumNotice,

    dateFilterOptions,
    statusFilterOptions,
    serviceFilterOptions: adminServiceFilterOptions,

    selectedDateFilter: appointmentAdminDateFilter,
    selectedStatusFilter: appointmentAdminStatusFilter,
    selectedServiceFilter: appointmentAdminServiceFilter,
    historyDateFilter: appointmentAdminHistoryDateFilter,

    pagination: pageStateForUi(adminAppointmentsPagination)
  }

  const announcementsState: ShowcaseAnnouncementsUiState = {
    bottomBar: bottomBarState,

    title: storeProfileForUi.displayName || 'Announcements',
    items: announcementCards,
    isLoading,
    statusMessage: statusMessage || snackbarMessage,
    focusedAnnouncementId,

    pagination: pageStateForUi(publicAnnouncementsPagination)
  }

  const hasAnnouncementSelection = adminAnnouncementSelectedIds.length > 0
  const hasAnnouncementComposerInput = Boolean(
    adminAnnouncementCoverDraftUrl ||
    adminAnnouncementBodyDraft.trim()
  )

  const announcementEditState: ShowcaseAnnouncementEditUiState = {
    coverDraftUrl: adminAnnouncementCoverDraftUrl,
    bodyDraft: adminAnnouncementBodyDraft,
    editingId: adminAnnouncementEditingId,
    errorMessage: adminAnnouncementError,
    successMessage: adminAnnouncementSuccess,
    statusMessage,
    isSubmitting: adminAnnouncementIsSubmitting,
    isBlockingInput: adminAnnouncementIsBlocking,
    submittingAction: adminAnnouncementSubmittingAction,

    composerExpanded: adminAnnouncementComposerExpanded,

    canStartNew: !adminAnnouncementComposerExpanded && !adminAnnouncementIsSubmitting,
    canDeleteSelected: hasAnnouncementSelection && !adminAnnouncementIsSubmitting,
    canSaveDraft: adminAnnouncementComposerExpanded && hasAnnouncementComposerInput && !adminAnnouncementIsSubmitting,
    canPublish: (
      (adminAnnouncementComposerExpanded && hasAnnouncementComposerInput) ||
      hasAnnouncementSelection
    ) && !adminAnnouncementIsSubmitting,

    draftItems: adminAnnouncementCards,

    selectedIds: adminAnnouncementSelectedIds,

    previewItem: adminAnnouncementPreviewId
      ? adminAnnouncementCards.find(item => item.id === adminAnnouncementPreviewId) || null
      : null,
    previewVisible: Boolean(adminAnnouncementPreviewId),
    hasUnsavedChanges: hasUnsavedAdminAnnouncementDraft(),

    pagination: pageStateForUi(adminAnnouncementsPagination)
  }

  const chatRoleForUi = currentChatRole()

  const chatState: ShowcaseChatUiState = {
    title: chatRoleForUi === 'merchant'
      ? merchantThreadSummaries.find(item => item.conversationId === activeConversationId)?.title || DEFAULT_CUSTOMER_NAME
      : storeProfileForUi.displayName,
    subtitle: chatRoleForUi === 'merchant'
      ? activeConversation?.clientId || ''
      : storeProfileForUi.tagline,
    messages: chatUiMessages,
    draft: chatDraft,
    draftImageUrls: chatDraftImageUrls,
    pendingProduct: chatPendingProduct,
    pendingAppointment: chatPendingAppointment,
    quotedMessageId: chatQuotedMessageId,
    isSending: chatIsSending || chatIsOpening,
    statusMessage: chatStatusMessage || snackbarMessage || (chatPollingEnabled || chatEntryPollingEnabled ? null : null),
    inputPlaceholder: DEFAULT_CHAT_INPUT_PLACEHOLDER,

    selectionMode: chatSelectedMessageIds.length > 0,
    selectedMessageIds: chatSelectedMessageIds,
    findQuery: chatFindQuery,
    findResultIds: chatFindResultIds,
    focusedMessageId: chatFocusedMessageId,
    scrollToMessageId: chatScrollToMessageId,
    scrollToMessageSignal: chatScrollToMessageSignal,
    scrollToBottomSignal: chatScrollToBottomSignal,
    flashMessageId: chatFlashMessageId,
    flashSignal: chatFlashSignal,
    searchResults: buildChatSearchResultsForUi(),
    mediaItems: buildChatMediaItemsForUi(),
    mediaPreviewUrls: chatMediaPreviewUrls,
    mediaPreviewIndex: clampIndex(chatMediaPreviewIndex, chatMediaPreviewUrls.length),
    pinned: chatPinned,
    canTogglePinned: chatRoleForUi === 'merchant',

    windowMode: chatMessageWindow.mode,
    anchorMessageId: chatMessageWindow.anchorMessageId,
    hasNewerMessages: chatMessageWindow.hasNewer,
    isLoadingNewerMessages: chatMessageWindow.isLoadingNewer,
    oldestMessageTimeMs: chatMessageWindow.oldestTimeMs,
    newestMessageTimeMs: chatMessageWindow.newestTimeMs,

    pagination: pageStateForUi({
      hasMore: chatMessageWindow.hasOlder,
      isLoadingMore: chatMessageWindow.isLoadingOlder || chatMessagesPagination.isLoadingMore
    }),
    searchPagination: pageStateForUi(chatSearchPagination),
    mediaPagination: pageStateForUi(chatMediaPagination)
  }

  const adminState: ShowcaseAdminUiState = {
    isLoading,
    statusMessage,
    cloudStatus: cloudStatusUi,

    itemsSortMode: adminItemsSortMode,
    itemsSortAscending: adminItemsSortAscending,
    itemsSearchQuery: adminItemsSearchQuery,
    filterRecommended: adminItemsFilterRecommended,
    filterHiddenOnly: adminItemsFilterHiddenOnly,
    filterDiscountOnly: adminItemsFilterDiscountOnly,

    priceMinDraft: adminItemsPriceMinDraft,
    priceMaxDraft: adminItemsPriceMaxDraft,
    appliedMinPrice: adminItemsAppliedMinPrice,
    appliedMaxPrice: adminItemsAppliedMaxPrice,

    selectedCategory: adminItemsSelectedCategory,
    manualCategories,
    dishes: adminVisibleDishes,
    pendingDeleteDishId,
    selectedDishIds: adminSelectedDishIds,

    storeProfile: storeProfileForUi,
    storeProfileDraft: storeProfileDraftForUi,
    isSavingStoreProfile,
    storeProfileSaveError,
    storeProfileSaveSuccess,

    pendingSyncCount: pendingSyncOperations.length,
    syncErrorMessage,
    syncOverviewState,
    syncNoticeLabel,

    adminUsernameDraft,
    adminPasswordDraft,

    pendingDeleteCategory: adminPendingDeleteCategory?.name || null,
    cannotDeleteCategory: adminCannotDeleteCategory,
    categorySubmittingAction,

    appointmentsEnabled,
    appointmentCount: appointmentRequests.length,
    pendingAppointmentCount: appointmentCards.filter(item => {
      return item.preferredDate >= adminTodayDateKey && item.statusLabel === 'Pending'
    }).length,
    unreadMessageCount: merchantThreadSummaries.reduce((sum, item) => sum + item.unreadCount, 0),

    itemsPagination: pageStateForUi(adminItemsPagination)
  }

  const editDishRequiredErrorMessages = new Set([
    'Please enter Name.',
    'Please enter Price.',
    'Please enter Description.',
    'Please enter Category.',
    'Please add at least 1 image.'
  ])

  const editDishShowsRequiredFieldErrors = Boolean(
    editValidationError &&
    editDishRequiredErrorMessages.has(editValidationError)
  )

  const editDishNameRequiredError = editDishShowsRequiredFieldErrors &&
    editDishName.trim().length === 0

  const editDishPriceRequiredError = editDishShowsRequiredFieldErrors &&
    editDishOriginalPrice.trim().length === 0

  const editDishDescriptionRequiredError = editDishShowsRequiredFieldErrors &&
    editDishDescription.trim().length === 0

  const editDishCategoryRequiredError = editDishShowsRequiredFieldErrors &&
    String(editDishCategory || '').trim().length === 0

  const editDishImagesRequiredError = editDishShowsRequiredFieldErrors &&
    editDishImageUrls.length === 0

  const editDishShowErrorDialog = Boolean(
    editValidationError &&
    !editDishShowsRequiredFieldErrors
  )

console.log('[ImageDrag] render editDishImageUrls', editDishImageUrls)

const editDishState: ShowcaseEditDishUiState = {
    id: editDishId || 'new',
    name: editDishName,
    description: editDishDescription,
    category: editDishCategory,
    availableCategories: manualCategories,
    originalPrice: editDishOriginalPrice,
    discountPrice: editDishDiscountPrice,
    isRecommended: editDishRecommended,
    isHidden: editDishHidden,
    imageUrls: editDishImageUrls,
    imageVariants: editDishId ? getDishEntityById(editDishId)?.imageVariants ?? null : null,
    isSaving: isSavingEditDish,
    isBlocking: isBlockingEditDish,
    statusMessage,
    isNew: !editDishId,
    errorMessage: editValidationError,
    isDiscountInvalidNumber: selectedDishDiscountInvalid,
    isDiscountGEPrice: selectedDishDiscountGEPrice,
    discountErrorText: selectedDishDiscountInvalid
      ? 'Discount price must be a valid number.'
      : selectedDishDiscountGEPrice
        ? 'Discount price must be lower than original price.'
        : null,
    nameRequiredError: editDishNameRequiredError,
    priceRequiredError: editDishPriceRequiredError,
    descriptionRequiredError: editDishDescriptionRequiredError,
    categoryRequiredError: editDishCategoryRequiredError,
    imagesRequiredError: editDishImagesRequiredError,
    showErrorDialog: editDishShowErrorDialog,
    canSave: editDishCanSave,
    canAddImageSlot: editDishImageUrls.length < 9,
    maxImages: 9,
    hasUnsavedChanges: Boolean(
      editDishName.trim() ||
      editDishDescription.trim() ||
      editDishCategory ||
      editDishOriginalPrice.trim() ||
      editDishDiscountPrice.trim() ||
      editDishImageUrls.length
    )
  }

  const changePasswordState: ShowcaseChangePasswordUiState = {
    current: changePasswordCurrentDraft,
    next: changePasswordNewDraft,
    confirm: changePasswordConfirmDraft,
    isSaving: isChangingPassword,
    error: changePasswordError,
    success: changePasswordSuccess
  }

  const showcaseState: ShowcaseUiState = {
    dishes,
    manualCategories,
    selectedCategory,

    loginUsernameDraft,
    loginPasswordDraft,
    loginRememberMeDraft,

    changePasswordCurrentDraft,
    changePasswordNewDraft,
    changePasswordConfirmDraft,
    changePasswordError,
    changePasswordSuccess,

    screen: screen as ShowcaseScreen,
    isAdminLoggedIn,
    pendingDeleteDishId,
    adminEntryMode,

    isLoading,
    isCloudLoading,
    isSavingEditDish,
    isBlockingEditDish,
    statusMessage,
    snackbarMessage,
    cloudStatus: cloudStatusUi,
    editValidationError,
    loginError,

    selectedDish,
    detailImageIndex,
    favoriteIds,

    searchQuery,
    sortMode,
    adminItemsSortMode,
    adminItemsSearchQuery,
    adminItemsFilterRecommended,
    adminItemsFilterHiddenOnly,
    adminItemsFilterDiscountOnly,
    adminItemsSortAscending,
    adminItemsPriceMinDraft,
    adminItemsPriceMaxDraft,
    adminItemsAppliedMinPrice,
    adminItemsAppliedMaxPrice,
    adminSelectedDishIds,

    favoritesQuery,
    favoritesSelectedIds,
    favoritesSortMode,
    favoritesFilterRecommendedOnly,
    favoritesFilterOnSaleOnly,
    favoritesPriceMinDraft,
    favoritesPriceMaxDraft,
    favoritesAppliedMinPrice,
    favoritesAppliedMaxPrice,
    favoritesShowSortMenu,
    favoritesShowFilterMenu,
    favoritesShowPriceMenu,
    favoritesSelectedCategory,
    favoriteCategories,

    filterRecommendedOnly,
    filterOnSaleOnly,

    homeShowSortMenu,
    homeShowFilterMenu,
    homePriceMinDraft,
    homePriceMaxDraft,
    homeAppliedMinPrice,
    homeAppliedMaxPrice,
    homeShowPriceMenu,

    adminUsernameDraft,
    adminPasswordDraft,
    adminPendingDeleteCategory: adminPendingDeleteCategory?.name || null,
    adminCannotDeleteCategory,
    categorySubmittingAction,

    selectedTags,

    syncOverviewState: syncOverviewState as SyncOverviewState,
    lastSyncAt,
    pendingSyncCount: pendingSyncOperations.length,
    syncErrorMessage,
    lastRetryOp,

    storeProfile: storeProfileForUi,
    storeProfileDraft: storeProfileDraftForUi,
    storeProfileDescription: storeProfileCloud?.description || '',
    storeProfileServices,
    storeProfileExtraContacts,
    storeProfileLogoUrl,
    storeProfileCoverUrl,
    draftStoreProfileDescription,
    draftStoreProfileServices,
    draftStoreProfileExtraContacts,
    draftStoreProfileLogoUrl,
    draftStoreProfileCoverUrl,
    draftBusinessStatus,
    isEditingStoreProfile,
    isSavingStoreProfile,
    isRefreshingStoreProfile,
    storeProfileSaveError,
    storeProfileSaveSuccess,

    chat: chatState,
    merchantChatThreads: merchantThreadSummaries,
    merchantChatListSearchQuery,
    merchantChatListRefreshing,
    merchantChatListPagination: pageStateForUi(
      merchantChatListSearchActive
        ? merchantChatListSearchPagination
        : merchantChatListPagination
    ),

    announcements: announcementCards,
    adminAnnouncementDraftItems: adminAnnouncementCards,
    adminAnnouncementComposerExpanded,
    adminAnnouncementCoverDraftUrl,
    adminAnnouncementBodyDraft,
    adminAnnouncementEditingId,
    adminAnnouncementSelectedIds,
    adminAnnouncementPreviewId,
    adminAnnouncementError,
    adminAnnouncementSuccess,
    adminAnnouncementIsSubmitting,
    adminAnnouncementIsBlocking,
    adminAnnouncementSubmittingAction,
    pushTargetAnnouncementId,

    appointmentsEnabled,
    appointments: appointmentCards as ShowcaseAppointment[],
    appointmentSourceDishId,
    appointmentProduct: activeProductForAppointment,
    appointmentServiceDraft,
    appointmentNameDraft,
    appointmentContactDraft,
    appointmentDateDraft,
    appointmentTimeDraft,
    appointmentNoteDraft,
    appointmentError,
    appointmentSuccess,
    appointmentsRefreshing,

    appointmentBookingWindowDays,
    appointmentAvailableHoursText,
    appointmentSlotIntervalMinutes,
    appointmentClosedDays,
    appointmentMinimumNotice,

    appointmentAdminDateFilter,
    appointmentAdminStatusFilter,
    appointmentAdminServiceFilter,
    appointmentAdminHistoryDateFilter,

    appointmentCustomerDateFilter,
    appointmentCustomerStatusFilter,
    appointmentCustomerServiceFilter
  }

  const showcaseWiring: ShowcaseUiWiring = createShowcaseUiWiring({
    uiState: showcaseState
  })

  const homeActions: ShowcaseHomeActions = {
    ...bottomNavigationActions,

    onRefresh: () => {
      void refresh()
    },

    onLoadMore: () => {
      void loadMoreHomeDishes()
    },

    onCategorySelected,

    onDishSelected: onHomeDishSelected,

    onProfileClick: onHomeProfileClick,

    onBackToHome: closeToHome,

    onSearchQueryChange,

    onToggleTag,

    onClearTags,

    onSelectedTagsChange,

    onSortModeChange,

    onFilterRecommendedOnlyChange,

    onFilterOnSaleOnlyChange,

    onApplyHomeFilters,

    onClearSortAndFilters,

    onClearAll,

    onShowSortMenuChange: onHomeShowSortMenuChange,

    onShowFilterMenuChange: onHomeShowFilterMenuChange,

    onPriceMinDraftChange: onHomePriceMinDraftChange,

    onPriceMaxDraftChange: onHomePriceMaxDraftChange,

    onApplyPriceRange: onHomeApplyPriceRange,

    onClearPriceRange: onHomeClearPriceRange,

    onShowPriceMenuChange: onHomeShowPriceMenuChange,

    onToggleFavorite: toggleFavorite
  }

  const loginActions: ShowcaseLoginActions = {
    onUsernameDraftChange: onLoginUsernameDraftChange,

    onPasswordDraftChange: onLoginPasswordDraftChange,

    onRememberMeChange: setLoginRememberMe,

    onLogin: (username, password) => {
      void tryAdminLogin(username, password)
    },

    onBackToHome: closeToHome
  }

  const detailActions: ShowcaseDetailActions = {
    ...bottomNavigationActions,

    onBackToHome: closeToHome,

    onBack: backFromDetail,

    onEdit: () => {
      if (!selectedDish) return
      openEditDish(selectedDish.id)
    },

    onToggleFavorite: () => {
      if (!selectedDish) return
      toggleFavorite(selectedDish.id)
    },

    onOpenChat: () => {
      void openCustomerChatFromScreen(
        ShowcaseScreens.Detail,
        buildPendingFromSelectedDish()
      )
    },

    onOpenImage: url => {
      const index = selectedDishImages.indexOf(url)
      onDetailImageIndexChanged(index >= 0 ? index : 0)
    },

    onImageIndexChanged: onDetailImageIndexChanged,

    onBookAppointment: openAppointmentFromSelectedDish,

    onSavePreviewImage: savePreviewImage
  }

  const storeProfileActions: ShowcaseStoreProfileActions = {
    ...bottomNavigationActions,

    onBackToHome: closeToHome,

    onBack: backFromStoreProfile,

    onRefresh: () => {
      void refreshStoreProfile()
    },

    onEdit: startEditStoreProfile,

    onCancelEdit: cancelEditStoreProfile,

    onDiscardDraftAndGoHome: discardStoreProfileDraftAndGoHome,

    onSave: () => {
      void saveStoreProfile()
    },

    onTitleChange: onStoreProfileDraftTitleChange,

    onSubtitleChange: onStoreProfileDraftSubtitleChange,

    onDescriptionChange: onStoreProfileDraftDescriptionChange,

    onAddressChange: onStoreProfileDraftAddressChange,

    onHoursChange: onStoreProfileDraftHoursChange,

    onMapUrlChange: onStoreProfileDraftMapUrlChange,

    onBusinessStatusChange: onStoreProfileDraftBusinessStatusChange,

    onLogoUrlChange: value => {
      void onStoreProfileLogoPicked(value)
    },

    onCoverUrlChange: value => {
      void onStoreProfileCoversPicked([value])
    },

    onLogoImagePicked: value => {
      void onStoreProfileLogoPicked(value)
    },

    onCoverImagesPicked: values => {
      void onStoreProfileCoversPicked(values)
    },

    onPickLogo: () => {
      showSnackbar('Choose a logo file in the connected UI.')
    },

    onPickCover: () => {
      showSnackbar('Choose a cover file in the connected UI.')
    },

    onRemoveLogo: onStoreProfileLogoRemove,

    onRemoveCover: onStoreProfileCoverRemove,

    onMoveCover: onStoreProfileCoverMove,

    onCoverDraggingChange: () => {
    },

    onServiceChange: onStoreProfileServiceChange,

    onAddService: onStoreProfileServiceAdd,

    onRemoveService: onStoreProfileServiceRemove,

    onAddExtraContact: onStoreProfileExtraContactAdd,

    onRemoveExtraContact: onStoreProfileExtraContactRemove,

    onExtraContactNameChange: onStoreProfileExtraContactNameChange,

    onExtraContactValueChange: onStoreProfileExtraContactValueChange,

    onOpenMap: openMap,

    onCopy: copyText,

    onSavePreviewImage: savePreviewImage
  }

  const favoritesActions: ShowcaseFavoritesActions = {
    ...bottomNavigationActions,

    onBackToHome: closeToHome,

    onBack: closeFavoritesPage,

    onQueryChange: onFavoritesQueryChange,

    onOpenDetail: onFavoritesOpenDetail,

    onToggleSelect: onFavoritesToggleSelect,

    onClearSelection: onFavoritesClearSelection,

    onDeleteSelected: onFavoritesDeleteSelected,

    onSortModeChange: onFavoritesSortModeChange,

    onFilterRecommendedOnlyChange: onFavoritesFilterRecommendedOnlyChange,

    onFilterOnSaleOnlyChange: onFavoritesFilterOnSaleOnlyChange,

    onClearSortAndFilters: onFavoritesClearSortAndFilters,

    onShowSortMenuChange: onFavoritesShowSortMenuChange,

    onShowFilterMenuChange: onFavoritesShowFilterMenuChange,

    onPriceMinDraftChange: onFavoritesPriceMinDraftChange,

    onPriceMaxDraftChange: onFavoritesPriceMaxDraftChange,

    onApplyPriceRange: onFavoritesApplyPriceRange,

    onClearPriceRange: onFavoritesClearPriceRange,

    onShowPriceMenuChange: onFavoritesShowPriceMenuChange,

    onCategorySelected: onFavoritesCategorySelected
  }

  const appointmentsActions: ShowcaseAppointmentsActions = {
    onBackToHome: closeToHome,

    onBack: backFromAppointments,

    onServiceChange: onAppointmentServiceDraftChange,

    onNameChange: onAppointmentNameDraftChange,

    onContactChange: onAppointmentContactDraftChange,

    onDateChange: onAppointmentDateDraftChange,

    onTimeChange: onAppointmentTimeDraftChange,

    onNoteChange: onAppointmentNoteDraftChange,

    onOpenProductDetail: openDetail,

    onSubmit: () => {
      return submitAppointmentRequest()
    }
  }

  const customerBookingsActions: ShowcaseCustomerBookingsActions = {
    ...bottomNavigationActions,

    onBackToHome: closeToHome,

    onBack: backFromCustomerBookings,

    onRefresh: () => {
      void refreshCustomerAppointmentsFromCloud()
    },

    onLoadMore: () => {
      void loadMoreCustomerAppointments()
    },

    onDateFilterChange: onAppointmentCustomerDateFilterChange,

    onStatusFilterChange: onAppointmentCustomerStatusFilterChange,

    onServiceFilterChange: onAppointmentCustomerServiceFilterChange,

    onContactMerchant: appointmentId => {
      openChatFromCustomerBooking(appointmentId)
    },

    onOpenAppointmentProductDetail: openDetail
  }

  const adminAppointmentsActions: ShowcaseAdminAppointmentsActions = {
    onBackToHome: closeToHome,

    onBack: backFromAdminAppointmentManager,

    onRefresh: () => {
      void refreshAdminAppointmentsFromCloud()
    },

    onLoadMore: () => {
      void loadMoreAdminAppointments()
    },

    onEnabledChange: onAppointmentsEnabledChange,

    onBookingWindowDaysChange: onAppointmentBookingWindowDaysChange,

    onAvailableHoursTextChange: onAppointmentAvailableHoursTextChange,

    onSlotIntervalMinutesChange: onAppointmentSlotIntervalMinutesChange,

    onClosedDayToggle: onAppointmentClosedDayToggle,

    onMinimumNoticeChange: onAppointmentMinimumNoticeChange,

    onSettingsSave: value => {
      return saveAppointmentSettings(value)
    },

    onDateFilterChange: onAppointmentAdminDateFilterChange,

    onStatusFilterChange: onAppointmentAdminStatusFilterChange,

    onServiceFilterChange: onAppointmentAdminServiceFilterChange,

    onHistoryDateSelected: onAppointmentAdminHistoryDateSelected,

    onHistoryDateClear: onAppointmentAdminHistoryDateClear,

    onContactCustomer: appointmentId => {
      void openChatFromAppointment(appointmentId)
    },

    onOpenAppointmentProductDetail: openDetail,

    onPending: id => {
      return updateAppointmentStatus(id, 'Pending')
    },

    onConfirm: id => {
      return updateAppointmentStatus(id, 'Confirmed')
    },

    onCancel: id => {
      return updateAppointmentStatus(id, 'Cancelled')
    },

    onComplete: id => {
      return updateAppointmentStatus(id, 'Completed')
    },

    onNoShow: id => {
      return updateAppointmentStatus(id, 'No-show')
    }
  }

  const announcementsActions: ShowcaseAnnouncementsActions = {
    ...bottomNavigationActions,

    onBackToHome: closeToHome,

    onBack: backFromAnnouncements,

    onRefresh: () => {
      void refreshAnnouncements()
    },

    onLoadMore: () => {
      void loadMorePublicAnnouncements()
    },

    onOpenAnnouncement: id => {
      onAnnouncementExpanded(id)
    },

    onTrackAnnouncementView: id => {
      void trackAnnouncementClickOnce(id)
    },

    onOpenAnnouncementImage: id => {
      onAnnouncementImageOpened(id)
    },

    onConsumeFocusedAnnouncement: clearFocusedAnnouncement
  }

  const announcementEditActions: ShowcaseAnnouncementEditActions = {
    onBackToHome: discardAdminAnnouncementDraftAndGoHome,

    onBack: discardAdminAnnouncementDraftAndBack,

    onStartNew: onAdminAnnouncementStartNew,

    onPickCover: value => {
      void onAdminAnnouncementCoverPicked(value)
    },

    onRemoveCover: onAdminAnnouncementClearCover,

    onOpenCoverPreview: () => {
    },

    onBodyChange: onAdminAnnouncementBodyDraftChange,

    onSaveDraft: onAdminAnnouncementSaveDraft,

    onPushNow: onAdminAnnouncementPushNow,

    onOpenItem: onAdminAnnouncementOpenItem,

    onPreviewItem: onAdminAnnouncementPreviewItem,

    onDismissPreview: onAdminAnnouncementDismissPreview,

    onToggleSelect: onAdminAnnouncementToggleSelect,

    onClearSelection: onAdminAnnouncementClearSelection,

    onDeleteSelected: onAdminAnnouncementDeleteSelected,

    onLoadMore: () => {
      void loadMoreAdminAnnouncements()
    }
  }

  const chatActions: ShowcaseChatActions = {
    ...bottomNavigationActions,

    onUseProductCardAsPending: chatUseProductCardAsPending,

    onUseAppointmentCardAsPending: setPendingAppointmentForChat,

    onJumpToMessage: chatJumpToMessageFromQuote,

    onBackToHome: closeToHome,

    onBack: backFromChat,

    onDraftChange: onChatDraftChange,

    onSend: () => {
      void sendChat()
    },

    onRetry: (messageId: string) => {
      void retryChatMessage(messageId)
    },

    onRefresh: () => {
      void refreshChatLatest()
    },

    onLoadOlderMessages: () => {
      void loadOlderChatMessages()
    },

    onLoadNewerMessages: () => {
      void loadNewerChatMessages()
    },

    onQuoteMessage: chatQuoteMessage,

    onCancelQuote: chatCancelQuote,

    onEnterSelection: chatEnterSelection,

    onToggleSelection: chatToggleSelection,

    onExitSelection: chatExitSelection,

    onDeleteMessage: chatDeleteMessage,

    onDeleteSelected: chatDeleteSelected,

    onOpenSearchResults: chatOpenSearchResults,

    onCloseSearchResults: chatCloseSearchResults,

    onOpenMediaGallery: chatOpenMediaGallery,

    onOpenImagePreview: chatOpenImagePreview,

    onJumpToFoundMessage: chatJumpToFoundMessage,

    onOpenThreadFromSearch: chatOpenThreadFromSearch,

    onLoadMoreSearchResults: () => {
      void loadMoreChatSearchResults()
    },

    onLoadMoreMediaItems: () => {
      void loadMoreChatMediaItems()
    },

    onTogglePinned: chatTogglePinned,

    onOpenFind: chatOpenFind,

    onCloseFind: chatCloseFind,

    onFindQueryChange: chatFindQueryChange,

    onFindNext: chatFindNext,

    onFindPrev: chatFindPrev,

    onPickImages: values => {
      void onChatImagesSelected(values)
    },

    onOpenCamera: () => {
      const uri = prepareChatCameraCapture(storeId)
      if (!uri) {
        onChatFullCameraUnavailable()
      }
    },

    onCameraCaptured: value => {
      void onChatCameraResult(value)
    },

    onRemoveDraftImage: chatRemoveDraftImage,

    onSavePreviewImage: saveChatPreviewImage,

    onSendPendingProduct: () => {
      void sendPendingProductShare()
    },

    onClearPendingProduct: () => {
      chatUseProductCardAsPending(null)
    },

    onSendPendingAppointment: () => {
      void sendPendingAppointmentShare()
    },

    onClearPendingAppointment: () => {
      setPendingAppointmentForChat(null)
    },

    onOpenProductDetail: openProductFromChat,

    onOpenAppointmentDetail: () => {
    },

    isProductAvailable,

    buildProductClipboardPayload: buildChatProductClipboardPayload
  }

  const chatMediaActions: ShowcaseChatMediaActions = {
    onBackToHome: () => {
      setChatMediaPreviewUrls([])
      setChatMediaPreviewIndex(0)
      closeToHome()
    },

    onBack: chatCloseMediaGallery,

    onLoadMoreMediaItems: () => {
      void loadMoreChatMediaItems()
    },

    onSavePreviewImage: savePreviewImage
  }

  const merchantChatListActions: ShowcaseMerchantChatListActions = {
    onBackToHome: closeMerchantChatListToHome,

    onBack: backFromMerchantChatList,

    onRefresh: () => {
      void refreshMerchantChatListByUser()
    },

    onLoadMore: () => {
      void loadMoreMerchantChatThreads()
    },

    onSearchQueryChange: value => {
      setMerchantChatListSearchQuery(value)
    },

    onOpenThread: (threadId, title) => {
      void openMerchantThread(threadId, title)
    },

    onDeleteThread: threadId => {
      return merchantChatListDeleteThread(threadId)
    },

    onTogglePin: (threadId, pinned) => {
      void merchantChatListTogglePin(threadId, pinned)
    },

    onRenameThread: (threadId, newName) => {
      return merchantChatListRenameThread(threadId, newName)
    }
  }

  const adminActions: ShowcaseAdminActions = {
    onBackToHome: closeToHome,

    onBack: backFromAdmin,

    onLogout: () => {
      void adminLogout()
    },

    onRefresh: () => {
      void refresh()
    },

    onLoadMoreItems: () => {
      void loadMoreAdminItems()
    },

    onItemsSortModeChange: onAdminItemsSortModeChange,

    onItemsSearchQueryChange: onAdminItemsSearchQueryChange,

    onClearItemsSearchQuery: clearAdminItemsSearchQuery,

    onItemsFilterRecommendedChange: onAdminItemsFilterRecommendedChange,

    onItemsFilterHiddenOnlyChange: onAdminItemsFilterHiddenOnlyChange,

    onItemsFilterDiscountOnlyChange: onAdminItemsFilterDiscountOnlyChange,

    onApplyItemsFilters: onAdminItemsApplyFilters,

    onPriceMinDraftChange: onAdminItemsPriceMinDraftChange,

    onPriceMaxDraftChange: onAdminItemsPriceMaxDraftChange,

    onApplyPriceRange: onAdminItemsApplyPriceRange,

    onClearPriceRange: onAdminItemsClearPriceRange,

    onSelectCategory: onAdminItemsCategorySelected,

    onAddCategory: value => {
      void addCategory(value)
    },

    onDeleteCategory: value => {
      void requestDeleteCategory(value)
    },

    onRenameCategory: (oldName, newName) => {
      void renameCategory(oldName, newName)
    },

    onOpenItemsManager: () => {
      void openAdminItemsScreen()
    },

    onOpenCategoriesManager: () => {
      void openAdminCategoriesScreen()
    },

    onOpenStoreProfile: () => {
      void openStoreProfile()
    },

    onOpenChangePassword: () => {
      openChangePasswordPage()
    },

    onOpenMerchantChatList: () => {
      void openMerchantChatList()
    },

    onAddNewDish: openNewDishScreen,

    onEditDish: openEditDish,

    onDeleteDish: requestDeleteDish,

    onToggleSelectDish: toggleAdminDishSelected,

    onClearSelectedDishes: clearAdminDishSelection,

    onDeleteSelectedDishes: () => {
      void deleteSelectedDishes()
    },

    onDismissPendingDelete: dismissPendingDelete,

    onConfirmPendingDelete: () => {
      if (!pendingDeleteDishId) return
      void deleteDish(pendingDeleteDishId)
    },

    onRetryPendingSync: () => {
      void retryLast()
    },

    onAdminUsernameDraftChange,

    onAdminPasswordDraftChange,

    onSaveAdminCredentials: () => {
      void saveAdminCredentialsFromDraft()
    },

    onSetAdminCredentials: (username, password) => {
      void setAdminCredentials(username, password)
    },

    onRequestDeleteCategory: value => {
      requestDeleteCategory(value)
    },

    onDismissCategoryDeleteDialogs: dismissCategoryDeleteDialogs,

    onConfirmPendingDeleteCategory: () => {
      void confirmPendingDeleteCategory()
    },

    onOpenAnnouncementPublisher: () => {
      void openAdminAnnouncementPublisher()
    },

    onOpenAppointmentManager: () => {
      void openAdminAppointmentManager()
    }
  }

  const editDishActions: ShowcaseEditDishActions = {
    onBackToHome: closeToHome,

    onBack: backToAdminFromEdit,

    onNameChange: onEditNameChange,

    onPriceChange: onEditPriceChange,

    onDiscountPriceChange: onEditDiscountPriceChange,

    onDescriptionChange: onEditDescriptionChange,

    onCategorySelected: onEditCategorySelected,

    onToggleRecommended: onEditToggleRecommended,

    onToggleHidden: onEditToggleHidden,

    onPickImage: onEditPickImageClick,

    onImagePicked: value => {
      void onEditImageSelected(value)
    },

    onRemoveImage: onEditRemoveImage,

    onMoveImage: onEditMoveImage,

    onSave: () => {
      void onEditSave()
    },

    onDelete: null,

    onDismissError: () => {
      setEditValidationError(null)
    }
  }

  const changePasswordActions: ShowcaseChangePasswordActions = {
    onBackToHome: () => {
      setChangePasswordCurrentDraft('')
      setChangePasswordNewDraft('')
      setChangePasswordConfirmDraft('')
      setChangePasswordError(null)
      setChangePasswordSuccess(null)
      closeToHome()
    },

    onBack: backFromChangePassword,

    onCurrentChange: onChangePasswordCurrentDraftChange,

    onNextChange: onChangePasswordNewDraftChange,

    onConfirmChange: onChangePasswordConfirmDraftChange,

    onSubmit: () => {
      void submitChangePassword()
    }
  }

  void isHydrated
  void merchantBindings
  void chatSearchResults
  void reorderCategory
  void handleStoreLogoPicked
  void handleStoreCoverPicked
  void handleChatImagePicked
  void shouldShowChatEntryDot
  void startChatPolling
  void stopChatPolling
  void startChatEntryPolling
  void stopChatEntryPolling
  void refreshChatEntryDotOnce
  void restoreClientChatContext
  void restoreMerchantChatContext
  void snapshotCurrentChatContext
  void reopenCurrentChatWithoutRoleFlip
  void syncChat
  void retryChat
  void loadItemEditorDraftLocally
  void persistItemEditorDraftLocally
  void clearItemEditorDraftLocally
  void loadAdminAnnouncementEditorDraftLocally
  void persistAdminAnnouncementEditorDraftLocally
  void clearAdminAnnouncementEditorDraftLocally
  void clearEditDraftLocalImages
  void clearAdminAnnouncementDraftLocalImages
  void clearStoreProfileDraftLocalImages
  void compressImage
  void createTempCameraUri
  void prepareChatCameraCapture
  void deletePendingChatCameraFile
  void runShowcaseLocalCacheMaintenance
  void clearExpiredLocalTempFiles
  void isLocalImageUri
  void isAppOwnedLocalFileUri
  void deleteLocalFileUri
  void deleteAppOwnedLocalFileUri
  void appointmentTimeToMinutes
  void appointmentMinutesToTime
  void appointmentMinimumNoticeToMillis
  void appointmentClosedDayKey
  void customerAppointmentDateOptions
  void customerAppointmentTimeOptionsForDate
  void cloudAppointmentToUi
  void appointmentsStatusFromCloud
  void appointmentsStatusToCloud
  void appointmentStatusPushTitle
  void awaitFcmToken
  void ensurePushRegistration
  void handlePushRoute
  void onAnnouncementPushArrived
  void dispatchNewAppointmentPushToMerchant
  void dispatchAppointmentStatusPushToCustomer
  void resolveChatPushSenderName
  void pushToken
  void pendingPushRoute
  void onLoginUsernameDraftChange
  void onLoginPasswordDraftChange
  void setLoginRememberMe
  void canLogin
  void tryAdminLogin
  void onSearchQueryChange
  void onSortModeChange
  void onSelectedTagsChange
  void onClearTags
  void onHomeApplyPriceRange
  void onHomeClearPriceRange
  void onHomePriceMinDraftChange
  void onHomePriceMaxDraftChange
  void onHomeShowFilterMenuChange
  void onHomeShowPriceMenuChange
  void onHomeShowSortMenuChange
  void onFilterRecommendedOnlyChange
  void onFilterOnSaleOnlyChange
  void onCategorySelected
  void onToggleTag
  void onClearSortAndFilters
  void onClearAll
  void onHomeDishSelected
  void onHomeProfileClick
  void onFavoritesQueryChange
  void onFavoritesOpenDetail
  void onFavoritesToggleSelect
  void onFavoritesClearSelection
  void onFavoritesDeleteSelected
  void onFavoritesSortModeChange
  void onFavoritesFilterRecommendedOnlyChange
  void onFavoritesFilterOnSaleOnlyChange
  void onFavoritesClearSortAndFilters
  void onFavoritesShowSortMenuChange
  void onFavoritesShowFilterMenuChange
  void onFavoritesShowPriceMenuChange
  void onFavoritesPriceMinDraftChange
  void onFavoritesPriceMaxDraftChange
  void onFavoritesApplyPriceRange
  void onFavoritesClearPriceRange
  void onFavoritesCategorySelected
  void closeFavoritesPage
  void visibleDishes
  void visibleAdminItems
  void clearAdminDishSelection
  void toggleAdminDishSelected
  void deleteSelectedDishes
  void requestDeleteDish
  void dismissPendingDelete
  void onEditNameChange
  void onEditPriceChange
  void onEditDiscountPriceChange
  void onEditDescriptionChange
  void onEditCategorySelected
  void onEditToggleRecommended
  void onEditToggleHidden
  void onEditSave
  void updateDish
  void updateEditDraft
  void deriveEditState
  void getEditDeleteAction
  void uploadDishImageIfNeeded
  void onEditImageSelected
  void onEditImagesSelected
  void onEditRemoveImage
  void onEditRemoveSelectedImage
  void onEditMoveImage
  void onEditPickImageClick
  void onEditImageLimitReached
  void onStoreProfileDraftTitleChange
  void onStoreProfileDraftSubtitleChange
  void onStoreProfileDraftDescriptionChange
  void onStoreProfileDraftAddressChange
  void onStoreProfileDraftHoursChange
  void onStoreProfileDraftMapUrlChange
  void onStoreProfileDraftBusinessStatusChange
  void onStoreProfileDraftLogoUrlChange
  void onStoreProfileDraftCoverUrlChange
  void onStoreProfileLogoPicked
  void onStoreProfileLogoRemove
  void onStoreProfileCoversPicked
  void onStoreProfileCoverRemove
  void onStoreProfileCoverMove
  void onStoreProfileCoverLimitReached
  void onStoreProfileServiceAdd
  void onStoreProfileServiceChange
  void onStoreProfileServiceRemove
  void onStoreProfileExtraContactAdd
  void onStoreProfileExtraContactNameChange
  void onStoreProfileExtraContactValueChange
  void onStoreProfileExtraContactRemove
  void uploadStoreImageIfNeeded
  void normalizeStoreProfileForCompare
  void hasUnsavedStoreProfileDraft
  void discardStoreProfileDraftAndGoHome
  void sendChat
  void sendChatAsClient
  void sendPendingProductShare
  void chatCancelQuote
  void chatCloseFind
  void chatCloseMediaGallery
  void chatCloseSearchResults
  void chatDeleteMessage
  void chatDeleteSelected
  void chatEnterSelection
  void chatExitSelection
  void chatFindNext
  void chatFindPrev
  void chatFindQueryChange
  void chatJumpToFoundMessage
  void chatJumpToMessageFromQuote
  void chatOpenFind
  void chatOpenMediaGallery
  void chatOpenSearchResults
  void chatOpenThreadFromSearch
  void chatQuoteMessage
  void chatRemoveDraftImage
  void chatSetFindQuery
  void chatTogglePinned
  void chatToggleSelection
  void chatUseProductCardAsPending
  void onChatDraftChange
  void onChatImagesSelected
  void onChatImageLimitReached
  void onChatCameraResult
  void onChatCameraPreviewResult
  void onChatCameraPermissionDenied
  void onChatFullCameraUnavailable
  void onChatScreenVisible
  void onChatScreenHidden
  void refreshChatLatest
  void saveChatPreviewImage
  void resolvedCurrentConversationDisplayName
  void buildChatPushBodyPreview
  void buildChatProductClipboardPayload
  void extractClientIdFromConversationId
  void extractMainBodyForSearch
  void announcementDraftTimeText
  void announcementPublishedTimeText
  void clearAdminAnnouncementComposerState
  void discardAdminAnnouncementDraftAndBack
  void discardAdminAnnouncementDraftAndGoHome
  void getAdminDraftCardsForUi
  void getAdminPublishedCardsForUi
  void hasUnsavedAdminAnnouncementDraft
  void onAdminAnnouncementBodyDraftChange
  void onAdminAnnouncementClearCover
  void onAdminAnnouncementClearSelection
  void onAdminAnnouncementCoverPicked
  void onAdminAnnouncementDeleteSelected
  void onAdminAnnouncementDismissPreview
  void onAdminAnnouncementOpenItem
  void onAdminAnnouncementPreviewItem
  void onAdminAnnouncementPushNow
  void onAdminAnnouncementSaveDraft
  void onAdminAnnouncementStartNew
  void onAdminAnnouncementToggleSelect
  void onAnnouncementExpanded
  void onAnnouncementImageOpened
  void refreshAnnouncements
  void refreshAnnouncementsEntryDotOnce
  void rebuildAnnouncementsList
  void syncMerchantAnnouncementsFromCloud
  void syncPublicAnnouncementsFromCloud
  void toAnnouncementEntity
  void toPublishedAnnouncementEntity
  void syncAnnouncementsAfterPush
  void ensureAnnouncementVisible
  void ensureAnnouncementViewed
  void ensureAnnouncementOpened
  void ensureAnnouncementPushRoute
  void ensureAnnouncementPublished
  void ensureAnnouncementDraftSaved
  void ensureAnnouncementPublishedNow
  void ensureAnnouncementSelectionDeleted
  void ensureAnnouncementListFresh
  void ensureAnnouncementEntryDotFresh
  void ensureAnnouncementClickTracked
  void clearFocusedAnnouncement
  void ensureAnnouncementImageOpened
  void ensureAnnouncementExpanded
  void ensureAnnouncementRouteConsumed
  void ensureAnnouncementDraftDiscardedToAdmin
  void ensureAnnouncementDraftDiscardedToHome
  void ensureAnnouncementComposerCleared
  void ensureAnnouncementCoverCleared
  void ensureAnnouncementCoverPicked
  void ensureAnnouncementBodyChanged
  void ensureAnnouncementSelectionCleared
  void ensureAnnouncementPreviewDismissed
  void ensureAnnouncementItemOpened
  void ensureAnnouncementItemPreviewed
  void ensureAnnouncementItemToggled
  void getAnnouncementUnreadCount
  void ensureAnnouncementUnreadStateFresh
  void ensureAnnouncementAllViewed
  void ensureAnnouncementCacheRebuilt
  void ensureAnnouncementCloudSynced
  void ensureAnnouncementDraftRestored
  void ensureAnnouncementDraftPersisted
  void ensureAnnouncementDraftCleared
  void ensureAnnouncementLocalCacheWritten
  void ensureAnnouncementLocalCacheRead
  void ensureAnnouncementLocalCacheLoaded
  void ensureAnnouncementLocalViewedLoaded
  void ensureAnnouncementLocalCountedLoaded
  void ensureAnnouncementLocalViewedSaved
  void ensureAnnouncementLocalCountedSaved
  void ensureAnnouncementLocalViewedCleared
  void ensureAnnouncementLocalCountedCleared
  void ensureAnnouncementDraftImagesCleared
  void ensureAnnouncementDraftComposerExpanded
  void ensureAnnouncementDraftComposerCollapsed
  void ensureAnnouncementPreviewVisible
  void ensureAnnouncementPreviewHidden
  void ensureAnnouncementPushTargetCleared
  void ensureAnnouncementPushTargetSet
  void ensureAnnouncementComposerErrorDismissed
  void ensureAnnouncementComposerSuccessDismissed
  void ensureAnnouncementComposerBlocking
  void ensureAnnouncementComposerSubmitting
  void ensureAnnouncementComposerExpanded
  void ensureAnnouncementFocused
  void ensureAnnouncementSelection
  void ensureAnnouncementDraftBody
  void ensureAnnouncementDraftCover
  void ensureAnnouncementDraftEditingId
  void ensureAnnouncementDraftItems
  void ensureAnnouncementPublishedItems
  void ensureAnnouncementResetAllLocalState
  void ensureAnnouncementPostPublishRefresh
  void ensureAnnouncementPostDeleteRefresh
  void ensureAnnouncementPostDraftRefresh
  void ensureAnnouncementPostViewedRefresh
  void ensureAnnouncementPostPushRefresh
  void ensureAnnouncementPostRouteRefresh
  void ensureAnnouncementPostImageOpenRefresh
  void ensureAnnouncementPostExpandedRefresh
  void ensureAnnouncementPostComposerDismiss
  void ensureAnnouncementPostSelectionClear
  void ensureAnnouncementPostPreviewDismiss
  void ensureAnnouncementPostDraftDiscardBack
  void ensureAnnouncementPostDraftDiscardHome
  void ensureAnnouncementPostComposerClear
  void ensureAnnouncementPostLocalCacheWrite
  void ensureAnnouncementPostLocalCacheLoad
  void ensureAnnouncementPostAllViewed
  void ensureAnnouncementPostUnreadFresh
  void ensureAnnouncementPostDraftRestore
  void ensureAnnouncementPostDraftPersist
  void ensureAnnouncementPostDraftClear
  void ensureAnnouncementPostPushTargetClear
  void ensureAnnouncementPostPushTargetSet
  void ensureAnnouncementPostErrorDismiss
  void ensureAnnouncementPostSuccessDismiss
  void ensureAnnouncementPostBlocking
  void ensureAnnouncementPostSubmitting
  void ensureAnnouncementPostComposerExpanded
  void ensureAnnouncementPostFocused
  void ensureAnnouncementPostSelection
  void ensureAnnouncementPostDraftBody
  void ensureAnnouncementPostDraftCover
  void ensureAnnouncementPostDraftEditingId
  void ensureAnnouncementPostDraftItems
  void ensureAnnouncementPostPublishedItems
  void ensureAnnouncementPostResetAllLocalState
  void ensureAnnouncementNoop
  void applyCloudAppointmentSettings
  void appointmentPushTimeText
  void appointmentStatusFromCloud
  void appointmentStatusLabelForAdminFilter
  void currentAppointmentSettingsForCloud
  void customerAppointmentDateChoices
  void customerAppointmentRuleSummary
  void customerAppointmentTimeOptions
  void filteredAdminAppointments
  void filteredCustomerAppointments
  void customerAppointmentCards
  void onAppointmentAdminDateFilterChange
  void onAppointmentAdminHistoryDateClear
  void onAppointmentAdminHistoryDateSelected
  void onAppointmentAdminServiceFilterChange
  void onAppointmentAdminStatusFilterChange
  void onAppointmentAvailableHoursTextChange
  void onAppointmentBookingWindowDaysChange
  void onAppointmentClosedDayToggle
  void onAppointmentContactDraftChange
  void onAppointmentCustomerDateFilterChange
  void onAppointmentCustomerServiceFilterChange
  void onAppointmentCustomerStatusFilterChange
  void onAppointmentDateDraftChange
  void onAppointmentMinimumNoticeChange
  void onAppointmentNameDraftChange
  void onAppointmentNoteDraftChange
  void onAppointmentServiceDraftChange
  void onAppointmentSlotIntervalMinutesChange
  void onAppointmentTimeDraftChange
  void onAppointmentsEnabledChange
  void refreshAdminAppointmentsFromCloud
  void refreshCustomerAppointmentsFromCloud
  void saveAppointmentSettingsToCloud
  void adminLogout
  void loadAdminCredentials
  void saveAdminCredentialsFromDraft
  void setAdminCredentials
  void validateRestoredMerchantSession
  void ensureMerchantSessionLoadedForCloud
  void handleMerchantAuthExpiredIfNeeded
  void handleMerchantSessionExpired
  void handleMerchantSessionExpiredIfRefreshUnrecoverable
  void handleMerchantDeleteExpiredIfNeeded
  void handleMerchantDishImageUploadExpiredIfNeeded
  void handleMerchantStoreImageUploadExpiredIfNeeded
  void refreshCloudServiceStatus
  void tryLoadFromCloud
  void loadFromSources
  void retryLast
  void clearSyncError
  void appointmentStatusToCloud
  void buildPendingFromSelectedDish
  void clearAdminItemsSearchQuery
  void clearAnnouncementDraftLocalImages
  void clearChatCameraError
  void clearMerchantConversationLocalArtifacts
  void clearPendingChatCameraState
  void clearPendingProductShare
  void confirmPendingDeleteCategory
  void consumePushAnnouncementTarget
  void currentChatRole
  void deleteAppOwnedLocalFileUriString
  void deriveCategories
  void deriveDetailImages
  void discardEditDraftAndGoHome
  void dismissCategoryDeleteDialogs
  void dismissEditValidationError
  void ensureAnnouncementRegistrationOnHome
  void ensureChatRealtimeStarted
  void ensureLoaded
  void favoriteSnapshotFromDish
  void formatHHmm
  void formatYmdAmpmHm
  void hasUnsavedEditDraft
  void isFavorite
  void isReadableNonEmptyContentUri
  void jumpToMessage
  void mapCloudPlanType
  void mapCloudServiceStatus
  void merchantChatListDeleteThread
  void merchantChatListRenameThread
  void merchantChatListTogglePin
  void mergeRemoteAndLocal
  void moneyTrim2
  void onAdminItemsApplyPriceRange
  void onAdminItemsClearPriceRange
  void onAdminItemsFilterDiscountOnlyChange
  void onAdminItemsFilterHiddenOnlyChange
  void onAdminItemsFilterRecommendedChange
  void onAdminItemsPriceMaxDraftChange
  void onAdminItemsPriceMinDraftChange
  void onAdminItemsSearchQueryChange
  void onAdminItemsSortModeChange
  void onAdminPasswordDraftChange
  void onAdminUsernameDraftChange
  void onChangePasswordConfirmDraftChange
  void onChangePasswordCurrentDraftChange
  void onChangePasswordNewDraftChange
  void onDetailImageIndexChanged
  void openAppointmentFromDish
  void openAppointmentFromSelectedDish
  void parseCoverList
  void refresh
  void refreshFavoritesList
  void refreshMerchantChatListByUser
  void refreshMerchantChatListInternal
  void refreshMerchantChatListSilently
  void refreshStoreProfileFromCloud
  void removeCategory
  void saveImageUrlToGallery
  void saveLocalImageUriToGallery
  void setChatCameraError
  void setFindQuery
  void startAnnouncementsEntryPolling
  void startMerchantChatListDbObserve
  void startMerchantChatListPolling
  void stopAnnouncementsEntryPolling
  void stopMerchantChatListDbObserve
  void stopMerchantChatListPolling
  void submitChangePassword
  void toCard
  void toggleFavoritesSelection

  return {
    screen,
    showcaseWiring,
    offlineStatus,

    homeState,
    homeActions,

    loginState,
    loginActions,

    adminState,
    adminActions,

    editDishState,
    editDishActions,

    detailState,
    detailActions,

    storeProfileState,
    storeProfileActions,

    changePasswordState,
    changePasswordActions,

    favoritesState,
    favoritesActions,

    appointmentsState,
    appointmentsActions,

    customerBookingsState,
    customerBookingsActions,

    adminAppointmentsState,
    adminAppointmentsActions,

    announcementsState,
    announcementsActions,

    announcementEditState,
    announcementEditActions,

    chatState,
    chatActions,

    chatMediaActions,

    merchantChatListActions
  }
}