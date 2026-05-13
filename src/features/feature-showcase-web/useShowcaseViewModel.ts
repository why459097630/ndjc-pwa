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
  type SyncState
} from './showcaseModels'
import {
  createShowcaseCloudRepository,
  type ChatConversation,
  type ChatMessage,
  type ChatThreadSummary,
  type CloudAnnouncement,
  type CloudAppointmentRequest,
  type CloudAppointmentSettings,
  type CloudCategory,
  type CloudStoreProfile,
  type CloudStoreServiceStatus,
  type MerchantAuthSession,
  type MerchantStoreMembership,
  type ShowcaseCloudRepository
} from './showcaseCloudRepository'
import {
  clearPersistedMerchantSession,
  ensureValidMerchantAccessToken,
  persistCurrentMerchantSession,
  readMerchantSession as readMerchantSessionFromManager,
  readRememberMe as readRememberMeFromManager,
  restoreMerchantSessionFromStorage,
  updateMerchantLoginName as updateMerchantLoginNameInSession,
  writeMerchantSession as writeMerchantSessionToManager,
  writeRememberMe as writeRememberMeToManager
} from './showcaseMerchantSessionManager'
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
  applyPendingProductForChat,
  buildChatDraftClearPlan,
  buildChatDraftImageUploadPlan,
  buildChatMessageSendPlan,
  buildChatSendOperationResult,
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
  buildMerchantThreadReadOperationResult,
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
  matchedInName: boolean
}

type ChatMediaItem = {
  conversationId: string
  messageId: string
  url: string
  createdAtText: string
}

type ChatMode = 'Client' | 'Merchant'

type DraftExtraContact = {
  id: string
  name: string
  value: string
}

type DraftAnnouncement = {
  id: string
  coverUrl: string | null
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

const DEFAULT_STORE_ID = 'store_showcase_trial_000001'
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
}): void {
  if (!isBrowser()) return

  const controller = window.navigator.serviceWorker?.controller
  if (!controller) return

  controller.postMessage({
    type: 'NDJC_CHAT_VISIBILITY',
    visible: input.visible,
    conversation_id: String(input.conversationId || '').trim(),
    screen: String(input.screen || '')
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
  return value || DEFAULT_STORE_ID
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
  return readRememberMeFromManager()
}

function writeRememberMe(value: boolean): void {
  writeRememberMeToManager(value)
}

function readMerchantSession(): MerchantAuthSession | null {
  return readMerchantSessionFromManager()
}

function writeMerchantSession(session: MerchantAuthSession | null): void {
  writeMerchantSessionToManager(session)
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

const CHAT_IMAGE_LONG_EDGE = 1080
const CHAT_IMAGE_JPEG_QUALITY = 0.84

const ANNOUNCEMENT_IMAGE_LONG_EDGE = 1280
const ANNOUNCEMENT_IMAGE_JPEG_QUALITY = 0.86

const STORE_COVER_IMAGE_LONG_EDGE = 1280
const STORE_COVER_IMAGE_JPEG_QUALITY = 0.86

const STORE_LOGO_IMAGE_LONG_EDGE = 512
const STORE_LOGO_IMAGE_JPEG_QUALITY = 0.9

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

function formatPlainNumber(value: number | null | undefined): string {
  const price = Number(value || 0)
  if (!Number.isFinite(price) || price <= 0) return ''
  return Number.isInteger(price) ? String(price) : price.toFixed(2).replace(/\.?0+$/, '')
}

function formatDateTimeText(value: number | null | undefined): string {
  if (!value || !Number.isFinite(value)) return ''

  try {
    const date = new Date(value)
    const datePart = date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    })
    const timePart = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    return `${datePart}, ${date.getFullYear()}, ${timePart}`
  } catch {
    return ''
  }
}

function formatChatCreatedAtText(value: number | null | undefined): string {
  if (!value || !Number.isFinite(value)) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-')

  const hour24 = date.getHours()
  const minute = String(date.getMinutes()).padStart(2, '0')
  const ampm = hour24 < 12 ? 'AM' : 'PM'
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24

  return `${datePart} ${ampm} ${hour12}:${minute}`
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
    imageUrl: resolveDishImage(dish),
    sourceDishId: item.sourceDishId,
    priceText: dish ? formatUsd(getDishPrice(dish)) : null,
    categoryText: dish?.category || null,
    itemAvailable
  }
}

function appointmentToCard(item: CloudAppointmentRequest, dish: DemoDish | null = null): ShowcaseAppointmentCard {
  return cloudAppointmentToUi(item, dish)
}

function chatMessageToUiMessage(message: ChatMessage, currentRole: 'merchant' | 'user', product: ShowcaseChatProductShare | null): ShowcaseChatMessage {
  const outgoing = message.senderRole === currentRole
  const parsedPayload = parseNdjcChatPayload(message.body)
  const payloadProduct = parsedPayload.product
    ? {
        dishId: parsedPayload.product.dishId,
        title: parsedPayload.product.title,
        price: parsedPayload.product.price,
        imageUrl: parsedPayload.product.imageUrl
      }
    : null

  return {
    id: message.id,
    body: parsedPayload.body,
    createdAtText: formatChatCreatedAtText(message.createdAt) || '',
    outgoing,
    statusText: outgoing ? (message.readAt ? 'Sent · Read' : 'Sent · Unread') : null,
    imageUrls: Array.from(new Set([
      ...message.imageUrls,
      ...parsedPayload.imageUris
    ].map(url => String(url || '').trim()).filter(Boolean))),
    product: product || payloadProduct,
    quotedMessageId: message.quotedMessageId || parsedPayload.quoteMessageId,
    failed: false,
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
    itemAvailable: !dish.isSoldOut
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

function applyHomeFilters(input: {
  dishes: DemoDish[]
  selectedCategory: string | null
  selectedTags: string[]
  searchQuery: string
  filterRecommendedOnly: boolean
  filterOnSaleOnly: boolean
  appliedMinPrice: number | null
  appliedMaxPrice: number | null
  favoriteIds: string[]
  sortMode: ShowcaseHomeSortMode
}): DemoDish[] {
  let next = input.dishes.filter(item => !item.isHidden)

  const selectedCategory = String(input.selectedCategory || '').trim()
  if (selectedCategory) {
    next = next.filter(item => String(item.category || '').trim() === selectedCategory)
  }

  if (input.filterRecommendedOnly) {
    next = next.filter(item => item.isRecommended)
  }

  if (input.filterOnSaleOnly) {
    next = next.filter(item => hasDiscount(item))
  }

  const selectedTagSet = new Set(
    input.selectedTags
      .map(tag => tag.trim())
      .filter(Boolean)
  )

  if (selectedTagSet.size > 0) {
    next = next.filter(item => {
      const dishTags = (item.tags || [])
        .map(tag => String(tag || '').trim())
        .filter(Boolean)

      return dishTags.some(tag => selectedTagSet.has(tag))
    })
  }

  const query = input.searchQuery.trim().toLowerCase()
  if (query) {
    next = next.filter(item => {
      const haystack = [
        item.nameZh,
        item.nameEn,
        item.descriptionEn,
        item.category
      ]
        .map(value => String(value || '').toLowerCase())
        .join(' ')

      return haystack.includes(query)
    })
  }

  if (input.appliedMinPrice != null || input.appliedMaxPrice != null) {
    next = next.filter(item => {
      const price = getDishPrice(item)

      return (input.appliedMinPrice == null || price >= input.appliedMinPrice) &&
        (input.appliedMaxPrice == null || price <= input.appliedMaxPrice)
    })
  }

  return sortDishes(
    next.map(item => ({
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
    subtitle: String(dish.descriptionEn || '').trim() || null,
    category: String(dish.category || '').trim() || null,
    price: getDishPrice(dish),
    originalPrice: normalizedOriginalPrice,
    discountPrice: normalizedDiscountPrice,
    isRecommended: Boolean(dish.isRecommended),
    isSoldOut: Boolean(dish.isSoldOut),
    isFavorite: Boolean(dish.isFavorite),
    isHidden: Boolean(dish.isHidden),
    imagePreviewUrl: resolveDishImage(dish)
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

  repository.setMerchantSessionCallbacks({
    onRefreshed: session => {
      applyRefreshedMerchantSession(session)
    }
  })

  const chatRepositoryRef = useRef<ShowcaseChatRepository | null>(null)

  if (!chatRepositoryRef.current) {
    chatRepositoryRef.current = createShowcaseChatRepository({
      cloud: repository,
      chatCloud: createShowcaseChatCloudRepository({
        logTag: 'ChatTrace',
        refreshMerchantSession: async () => {
          const session = await ensureMerchantSessionLoadedForCloud()
          return Boolean(session?.accessToken)
        }
      }),
      storagePrefix: `ndjc_showcase_chat_repository_${storeId}`,
      chatCloudEnabled: true,
      chatRelayEnabled: false
    })
  }

  const chatRepository = chatRepositoryRef.current
  const initialMerchantSessionRef = useRef<MerchantAuthSession | null>(readMerchantSession())
  const initialClientIdRef = useRef<string>(readClientId())
  const defaultUiState = useMemo(() => createDefaultShowcaseUiState(), [])
  const defaultChatUiState = useMemo(() => createDefaultShowcaseChatUiState(), [])

  const [screen, setScreen] = useState<ShowcaseScreenName>(input.initialScreen || defaultUiState.screen)
  const [previousScreen, setPreviousScreen] = useState<ShowcaseScreenName>(defaultUiState.screen)
  const [isHydrated, setIsHydrated] = useState(false)

  const [clientId] = useState(initialClientIdRef.current)
  const [merchantSession, setMerchantSession] = useState<MerchantAuthSession | null>(initialMerchantSessionRef.current)
  const [merchantBindings, setMerchantBindings] = useState<MerchantStoreMembership[]>([])
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(Boolean(initialMerchantSessionRef.current?.accessToken))
  const renderCountRef = useRef(0)
  const currentScreenRef = useRef<ShowcaseScreenName>(screen)
  const isAdminLoggedInRef = useRef(isAdminLoggedIn)

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
  }, [screen, isAdminLoggedIn])

  useEffect(() => {
    setCurrentStoreId(storeId)
    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)
  }, [merchantSession, repository, storeId])

  const [dishes, setDishes] = useState<DemoDish[]>(() => {
    const localDishes = loadDishesFromStorage(storeId)

    if (localDishes.length) {
      return localDishes
    }

    return input.previewMode === false ? [] : initialDishes
  })
  const [categories, setCategories] = useState<CloudCategory[]>([])
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
  const [syncOverviewState, setSyncOverviewState] = useState<ShowcaseSyncOverviewState>(defaultUiState.syncOverviewState)
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(defaultUiState.lastSyncAt)
  const [pendingSyncOperations, setPendingSyncOperations] = useState<PendingSyncOperation[]>(() => {
    return buildPendingDishSyncOperations(loadDishesFromStorage(storeId))
  })
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(defaultUiState.syncErrorMessage)
  const [lastRetryOp, setLastRetryOp] = useState<ShowcaseRetryOp | null>(defaultUiState.lastRetryOp)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(defaultUiState.selectedCategory)
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
  const [adminUsernameDraft, setAdminUsernameDraft] = useState(initialMerchantSessionRef.current?.loginName || defaultUiState.adminUsernameDraft)
  const [adminPasswordDraft, setAdminPasswordDraft] = useState(defaultUiState.adminPasswordDraft)
  const [adminPendingDeleteCategory, setAdminPendingDeleteCategory] = useState<PendingDeleteCategoryDialog>(null)
  const [adminCannotDeleteCategory, setAdminCannotDeleteCategory] = useState<string | null>(defaultUiState.adminCannotDeleteCategory)

  const [loginUsernameDraft, setLoginUsernameDraft] = useState(initialMerchantSessionRef.current?.loginName || defaultUiState.loginUsernameDraft)
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
  const [storeProfile, setStoreProfile] = useState<ShowcaseStoreProfile | null>(() => storeProfileFromCloud(null))
  const [storeProfileDraft, setStoreProfileDraft] = useState<ShowcaseStoreProfileDraft | null>(() => {
    const persisted = readPersistedStoreProfileDraft(storeId)
    return persisted || storeProfileDraftFromProfile(storeProfileFromCloud(null))
  })
  const [storeProfileServices, setStoreProfileServices] = useState<string[]>(defaultUiState.storeProfileServices)
  const [storeProfileExtraContacts, setStoreProfileExtraContacts] = useState<ShowcaseExtraContact[]>(defaultUiState.storeProfileExtraContacts)
  const [draftStoreProfileServices, setDraftStoreProfileServices] = useState<string[]>(defaultUiState.draftStoreProfileServices)
  const [draftStoreProfileExtraContacts, setDraftStoreProfileExtraContacts] = useState<DraftExtraContact[]>(defaultUiState.draftStoreProfileExtraContacts)
  const [storeProfileCoverUrl, setStoreProfileCoverUrl] = useState(defaultUiState.storeProfileCoverUrl)
  const [storeProfileLogoUrl, setStoreProfileLogoUrl] = useState(defaultUiState.storeProfileLogoUrl)
  const [draftStoreProfileCoverUrl, setDraftStoreProfileCoverUrl] = useState(defaultUiState.draftStoreProfileCoverUrl)
  const [draftStoreProfileLogoUrl, setDraftStoreProfileLogoUrl] = useState(defaultUiState.draftStoreProfileLogoUrl)
  const [draftStoreProfileDescription, setDraftStoreProfileDescription] = useState(defaultUiState.draftStoreProfileDescription)
  const [draftBusinessStatus, setDraftBusinessStatus] = useState(defaultUiState.draftBusinessStatus)
  const [isEditingStoreProfile, setIsEditingStoreProfile] = useState(defaultUiState.isEditingStoreProfile)
  const [isSavingStoreProfile, setIsSavingStoreProfile] = useState(defaultUiState.isSavingStoreProfile)
  const [storeProfileSaveError, setStoreProfileSaveError] = useState<string | null>(defaultUiState.storeProfileSaveError)
  const [storeProfileSaveSuccess, setStoreProfileSaveSuccess] = useState(defaultUiState.storeProfileSaveSuccess)

  const [editDishId, setEditDishId] = useState<string | null>(null)
  const [editDishNameZh, setEditDishNameZh] = useState('')
  const [editDishNameEn, setEditDishNameEn] = useState('')
  const [editDishDescriptionEn, setEditDishDescriptionEn] = useState('')
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

  const [announcements, setAnnouncements] = useState<CloudAnnouncement[]>([])
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
  const [adminAnnouncementSuccess, setAdminAnnouncementSuccess] = useState<string | null>(defaultUiState.adminAnnouncementSuccess)
  const [adminAnnouncementIsSubmitting, setAdminAnnouncementIsSubmitting] = useState(defaultUiState.adminAnnouncementIsSubmitting)
  const [adminAnnouncementIsBlocking, setAdminAnnouncementIsBlocking] = useState(defaultUiState.adminAnnouncementIsBlocking)
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
  const [chatFlashMessageId, setChatFlashMessageId] = useState<string | null>(defaultChatUiState.flashMessageId)
  const [chatFlashSignal, setChatFlashSignal] = useState(defaultChatUiState.flashSignal)
  const [chatMediaPreviewUrls, setChatMediaPreviewUrls] = useState<string[]>(defaultChatUiState.mediaPreviewUrls)
  const [chatMediaPreviewIndex, setChatMediaPreviewIndex] = useState(defaultChatUiState.mediaPreviewIndex)
  const [chatPinned, setChatPinned] = useState(defaultChatUiState.pinned)
  const [chatSearchResults, setChatSearchResults] = useState<ChatSearchResult[]>([])
  const [chatMediaItems, setChatMediaItems] = useState<ChatMediaItem[]>([])
  const [chatEntryDotVisible, setChatEntryDotVisible] = useState(false)
  const [chatPollingEnabled, setChatPollingEnabled] = useState(false)
  const [chatEntryPollingEnabled, setChatEntryPollingEnabled] = useState(false)
  const [chatMode, setChatModeState] = useState<ChatMode>('Client')

  const snackbarTimerRef = useRef<number | null>(null)
  const loadingSeqRef = useRef(0)
  const loadFromCloudRunningRef = useRef(false)
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
  const merchantChatListPollingTimerRef = useRef<number | null>(null)
  const merchantChatListPollingIntervalMsRef = useRef(0)
  const merchantChatListRefreshInFlightRef = useRef(false)
  const merchantChatListDbObserveAbortRef = useRef<AbortController | null>(null)
  const chatDbObserveAbortRef = useRef<AbortController | null>(null)
  const pushLocationSearchConsumedRef = useRef(false)
  const merchantPushRegistrationKeyRef = useRef('')
  const chatClientPushRegistrationKeyRef = useRef('')
  const pushRegistrationThrottleAtRef = useRef<Record<string, number>>({})
  const activeConversationIdRef = useRef(activeConversationId)
  const chatIsOpeningRef = useRef(false)
  const chatMessageLoadSeqRef = useRef(0)
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

  const manualCategories = useMemo(() => {
    return cloudCategoriesToManualCategoryNames(categories)
  }, [categories])

  const allTags = useMemo(() => allTagsFromDishes(dishes), [dishes])

  const selectedDish = useMemo(() => {
    return dishes.find(item => item.id === selectedDishId) || null
  }, [dishes, selectedDishId])

  const selectedEditDish = useMemo(() => {
    return dishes.find(item => item.id === editDishId) || null
  }, [dishes, editDishId])

  const activeAppointmentDish = useMemo(() => {
    if (appointmentSourceDishId) {
      return dishes.find(item => item.id === appointmentSourceDishId) || null
    }

    return selectedDish || null
  }, [appointmentSourceDishId, dishes, selectedDish])

  const visibleDishesForUi = useMemo(() => applyHomeFilters({
    dishes,
    selectedCategory,
    selectedTags,
    searchQuery,
    filterRecommendedOnly,
    filterOnSaleOnly,
    appliedMinPrice: homeAppliedMinPrice,
    appliedMaxPrice: homeAppliedMaxPrice,
    favoriteIds,
    sortMode
  }), [
    dishes,
    selectedCategory,
    selectedTags,
    searchQuery,
    filterRecommendedOnly,
    filterOnSaleOnly,
    homeAppliedMinPrice,
    homeAppliedMaxPrice,
    favoriteIds,
    sortMode
  ])

  const homeDishesForUi = useMemo(
    () => visibleDishesForUi.map(toShowcaseHomeDish),
    [visibleDishesForUi]
  )

  const adminVisibleDishes = useMemo(() => {
    let next = [...dishes]

    if (adminItemsSearchQuery.trim()) {
      const query = adminItemsSearchQuery.trim().toLowerCase()
      next = next.filter(item => {
        return String(item.nameZh || '').toLowerCase().includes(query) ||
          String(item.nameEn || '').toLowerCase().includes(query)
      })
    }

    const selectedCategoryName = String(selectedCategory || '').trim()

    if (selectedCategoryName) {
      next = next.filter(item => String(item.category || '').trim() === selectedCategoryName)
    }

    if (adminItemsFilterRecommended) {
      next = next.filter(item => item.isRecommended)
    }

    if (adminItemsFilterHiddenOnly) {
      next = next.filter(item => item.isHidden)
    }

    if (adminItemsFilterDiscountOnly) {
      next = next.filter(item => hasDiscount(item))
    }

    if (adminItemsAppliedMinPrice != null || adminItemsAppliedMaxPrice != null) {
      next = next.filter(item => {
        const price = getDishPrice(item)
        return (adminItemsAppliedMinPrice == null || price >= adminItemsAppliedMinPrice) &&
          (adminItemsAppliedMaxPrice == null || price <= adminItemsAppliedMaxPrice)
      })
    }

    next = sortDishes(next, adminItemsSortMode)

    return next
  }, [
    adminItemsAppliedMaxPrice,
    adminItemsAppliedMinPrice,
    adminItemsFilterDiscountOnly,
    adminItemsFilterHiddenOnly,
    adminItemsFilterRecommended,
    adminItemsSearchQuery,
    adminItemsSortMode,
    dishes,
    selectedCategory
  ])

  const favoriteRows = useMemo(() => {
    const dishById = new Map(dishes.map(dish => [dish.id, dish]))

    return favoriteIds
      .map(id => {
        const dish = dishById.get(id) || null

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
            imageUrl: snapshot.imageUrl,
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
          priceValue,
          isRecommended: false,
          isOnSale: Boolean(snapshot.discountPriceText),
          itemAvailable: false
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
        priceValue: number
        isRecommended: boolean
        isOnSale: boolean
        itemAvailable: boolean
      } => Boolean(item))
  }, [dishes, favoriteIds, favoriteSnapshots])

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
      const dish = item.sourceDishId ? dishes.find(dishItem => dishItem.id === item.sourceDishId) || null : null
      return appointmentToCard(item, dish)
    })
  }, [appointmentRequests, dishes])

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

    dishes.forEach(dish => {
      map.set(dish.id, {
        dishId: dish.id,
        title: getDishTitle(dish),
        price: formatUsd(getDishPrice(dish)),
        imageUrl: resolveDishImage(dish)
      })
    })

    return map
  }, [dishes])

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

  const merchantThreadSummaries = useMemo(() => {
    return merchantChatThreads.map(chatThreadSummaryToUi)
  }, [merchantChatThreads])

  const appointmentServiceOptions = useMemo(() => {
    return ['All', ...manualCategories]
  }, [manualCategories])

  const selectedDishImages = resolveDishImages(selectedDish)
  const safeDetailImageIndex = clampIndex(detailImageIndex, selectedDishImages.length)
  const selectedDishPrice = selectedDish ? getDishPrice(selectedDish) : 0
  const selectedDishDiscount = selectedDish ? normalizeNumber(selectedDish.discountPrice, 0) : 0
  const selectedDishHasDiscount = selectedDishDiscount > 0

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
    }, 2400)
  }

  function pushPendingSync(op: PendingSyncOperation): void {
    setPendingSyncOperations(current => {
      if (current.some(item => item.id === op.id)) return current
      return [...current, op]
    })
    setSyncOverviewState(SyncOverviewStates.HasPending)
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

  function resetLoginDrafts(): void {
    setLoginPasswordDraft('')
    setLoginError(null)
    setIsLoginLoading(false)
  }

  function resetEditDishForm(): void {
    const draft = loadItemEditorDraftLocally(storeId, 'new')

    setEditDishId(null)
    setEditDishNameZh(normalizeText(draft?.name))
    setEditDishNameEn(normalizeText(draft?.name))
    setEditDishDescriptionEn(normalizeText(draft?.description))
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
    setEditDishNameZh(useCachedForEdit ? cached?.name || '' : dish.nameZh || dish.title || '')
    setEditDishNameEn(useCachedForEdit ? cached?.name || '' : dish.nameEn || dish.title || '')
    setEditDishDescriptionEn(useCachedForEdit ? cached?.description || '' : dish.descriptionEn || '')
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
      name: (editDishNameZh || editDishNameEn).trim(),
      price: editDishOriginalPrice.trim(),
      discountPrice: editDishDiscountPrice.trim(),
      description: editDishDescriptionEn.trim(),
      category: editDishCategory?.trim() || null
    })
  }

  function clearCurrentItemEditorDraftLocally(): void {
    clearItemEditorDraftLocally(storeId)
    clearEditDraftLocalImages(storeId)
  }

  function openDetail(dishId: string): void {
    const id = dishId.trim()
    const dish = dishes.find(item => item.id === id)
    if (!dish) return

    detailBackTargetRef.current = screen

    setDishes(current => current.map(item => {
      if (item.id !== id) return item

      return {
        ...item,
        clickCount: Math.max(0, Number(item.clickCount || 0) + 1)
      }
    }))

    void repository.incrementDishClickCount(storeId, id)

    setSelectedDishId(id)
    setDetailImageIndex(0)
    setStatusMessage(null)
    setPreviousScreen(screen)
    setScreen('Detail')
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

    stopChatPolling()
    stopChatDbObserve()

    markRuntimeConversationRecentlySeen(activeConversationId)
    setRuntimeChatVisible(false)
    applyChatDomainInteractionState(jumpCleared)
    setChatSearchResults([])
    setChatMediaPreviewUrls([])
    setChatMediaPreviewIndex(0)

    snapshotCurrentChatContext()

    if (target === ShowcaseScreens.MerchantChatList) {
      void restoreMerchantChatContext(activeConversationId)
      void refreshMerchantChatListSilently()
      startMerchantChatListDbObserve()
      startMerchantChatListPolling(2000)
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
  const sourceDish = appointmentSourceDishId
    ? dishes.find(item => item.id === appointmentSourceDishId) || null
    : null

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

  function updateChatDraftPersistence(nextDraft: string, nextImageUrls = chatDraftImageUrls, nextProduct = chatPendingProduct, nextQuotedMessageId = chatQuotedMessageId): void {
    writeChatDraft({
      storeId,
      conversationId: activeConversationId,
      draft: nextDraft,
      draftImageUrls: nextImageUrls,
      pendingProduct: nextProduct,
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
      setDishes(localDishes)
      setPendingSyncOperations(buildPendingDishSyncOperations(localDishes))
    }

    if (localManualCategories.length) {
      setCategories(manualCategoryNamesToCloudCategories(localManualCategories))
    }

    setLastRetryOp(ShowcaseRetryOps.LoadFromCloud)
    setPreviousScreen(screen)
    setScreen('AdminItems')

    void ensureLoaded()
  }

  async function openAdminCategoriesScreen(): Promise<void> {
    await ensureLoaded()

    setPreviousScreen(screen)
    setScreen('AdminCategories')
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
  }

  async function openAdminAppointmentManager(): Promise<void> {
    if (!isAdminLoggedIn) {
      setPreviousScreen(screen)
      setLoginError(null)
      setScreen('Login')
      return
    }

    if (!hasLoadedInitialCloudRef.current) {
      void ensureLoaded()
    }

    void ensureMerchantSessionLoadedForCloud()

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
      setLoginError(null)
      setScreen('Login')
      return
    }

    void ensureMerchantSessionLoadedForCloud()

    merchantChatListBackTargetRef.current = 'Admin'
    setPreviousScreen('Admin')
    setStatusMessage(null)
    setScreen('MerchantChatList')

    startMerchantChatListDbObserve()
    void refreshMerchantChatListSilently()
    startMerchantChatListPolling(2000)
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
    pendingProduct: ShowcaseChatProductShare | null = null
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
      await restoreClientChatContext(pendingProduct)
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

    const name = (editDishNameZh.trim() || editDishNameEn.trim() || existing?.nameZh || existing?.nameEn || existing?.title || 'Untitled item').trim()
    const id = editDishId || existing?.id || createUuidLikeId()
    const imageUrls = editDishImageUrls
      .map(item => item.trim())
      .filter(Boolean)
      .filter((item, index, all) => all.indexOf(item) === index)
      .slice(0, 9)

    return {
      id,
      nameZh: name,
      nameEn: name,
      title: name,
      descriptionEn: editDishDescriptionEn.trim().slice(0, 200),
      category: editDishCategory?.trim() || '',
      originalPrice,
      discountPrice,
      isRecommended: editDishRecommended,
      isSoldOut: existing?.isSoldOut || false,
      isHidden: editDishHidden,
      imageUri: imageUrls[0] || null,
      imageUrls,
      tags: existing?.tags || [],
      clickCount: existing?.clickCount || 0,
      updatedAt: nowMillis(),
      syncState: 'Pending',
      dirty: true,
      isFavorite: favoriteIds.includes(id)
    }
  }

  function validateEditDish(): string | null {
    const name = editDishNameZh.trim() || editDishNameEn.trim()
    if (!name) return 'Please enter Name.'

    const priceText = editDishOriginalPrice.trim()
    if (!priceText) return 'Please enter Price.'

    const originalPrice = Number(priceText)
    if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
      return 'Please enter a valid Price.'
    }

    const description = editDishDescriptionEn.trim()
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
      setStoreMerchantSessionFromAuthSession(merchantSession)
      bindMerchantSessionToRepository(repository)

      const localDishes = loadDishesFromStorage(storeId)
      const localManualCategories = loadManualCategoriesFromStorage(storeId)
      const localStoreProfile = loadStoreProfileFromStorage(storeId)
      const localAnnouncements = loadPublishedAnnouncementsLocally(storeId)

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
        repository.fetchDishes(storeId),
        repository.fetchStoreProfile(storeId),
        repository.fetchAppointmentSettings(storeId),
        isAdminLoggedIn
          ? repository.fetchAppointmentRequestsForMerchant(storeId)
          : repository.fetchAppointmentRequestsForClient(storeId, clientId),
        repository.fetchAnnouncements({
          storeId,
          includeDrafts: false
        })
      ])

      if (loadingSeqRef.current !== seq) return

      const cloudManualCategories = cloudCategories
        .map(item => item.name.trim())
        .filter(Boolean)

      const publicCloudDishes = isAdminLoggedIn
        ? cloudDishes
        : cloudDishes.filter(item => !item.isHidden)

      const effectiveDishes = publicCloudDishes.length
        ? isAdminLoggedIn
          ? mergeRemoteAndLocal(publicCloudDishes, localDishes)
          : publicCloudDishes
        : localDishes.filter(item => isAdminLoggedIn || !item.isHidden)

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
      setDishes(effectiveDishes)
      refreshFavoritesList(effectiveDishes)
      setPendingSyncOperations(buildPendingDishSyncOperations(effectiveDishes))

      if (selectedDishId) {
        const reboundSelectedDish = effectiveDishes.find(item => item.id === selectedDishId) || null

        if (!reboundSelectedDish && screen === 'Detail') {
          setScreen('Home')
          setSelectedDishId(null)
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

      if (publicCloudDishes.length) {
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
          `VM${Date.now()}_${storeId.slice(-4)}`
        )
        setMerchantChatThreads(await buildMerchantThreadsWithLocalMeta(threads))

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
      setSyncErrorMessage(publicCloudDishes.length ? null : syncErrorMessage)
      setStatusMessage(
        publicCloudDishes.length
          ? 'Loaded from cloud.'
          : localDishes.filter(item => isAdminLoggedIn || !item.isHidden).length
            ? 'Cloud unavailable, loaded from local cache.'
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

  const refreshCloud = useCallback(async (): Promise<void> => {
    await tryLoadFromCloud(ShowcaseRetryOps.LoadFromCloud)
  }, [tryLoadFromCloud])

  const retryPendingSync = useCallback(async (): Promise<void> => {
    if (!pendingSyncOperations.length) {
      await loadFromCloud(ShowcaseRetryOps.RetryPendingSync)
      return
    }

    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)
    setSyncOverviewState(SyncOverviewStates.Syncing)
    setSyncErrorMessage(null)
    setLastRetryOp(ShowcaseRetryOps.RetryPendingSync)

    for (const op of pendingSyncOperations) {
      try {
        if (op.type === 'dish-upsert') {
          const dish = dishes.find(item => item.id === op.dishId)
          if (!dish) {
            removePendingSync(op.id)
            continue
          }

          const ok = await repository.upsertDishFromDemo(storeId, dish)
          if (ok) {
            removePendingSync(op.id)
          }
        }

        if (op.type === 'dish-delete') {
          const ok = await repository.deleteDishById(op.dishId)

          if (ok) {
            removePendingSync(op.id)

            const nextDishes = dishes.filter(item => item.id !== op.dishId)

            setDishes(nextDishes)
            saveDishesToStorage(storeId, nextDishes)
            refreshFavoritesList(nextDishes)

            setAdminSelectedDishIds(current => current.filter(id => id !== op.dishId))
            setSelectedDishId(current => current === op.dishId ? null : current)
          }
        }

        if (op.type === 'store-profile-upsert') {
          const ok = await repository.upsertStoreProfile(buildCloudStoreProfileFromDraft())
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

          const saved = await repository.upsertAnnouncement({
            id: draft.id,
            storeId,
            coverUrl: draft.coverUrl,
            body: draft.body,
            status: draft.status,
            updatedAt: draft.updatedAt || nowMillis(),
            viewCount: draft.viewCount
          })

          if (saved) {
            removePendingSync(op.id)
          }
        }

        if (op.type === 'appointment-settings-upsert') {
          const ok = await repository.upsertAppointmentSettings(currentAppointmentSettingsForCloud())

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

  async function signInMerchant(loginNameInput?: string, passwordInput?: string): Promise<void> {
    const loginName = (typeof loginNameInput === 'string' ? loginNameInput : loginUsernameDraft).trim()
    const password = (typeof passwordInput === 'string' ? passwordInput : loginPasswordDraft).trim()

    if (!loginName || !password) {
      setLoginError('Please enter account and password.')
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
        setLoginError('Invalid account or password.')
        return
      }

      setStoreMerchantSessionFromAuthSession(session)
      bindMerchantSessionToRepository(repository)

      const binding = await repository.fetchMerchantBindingForStoreAndAuthUser(storeId, session.authUserId)

      if (!binding || !binding.authUserId || binding.authUserId.toLowerCase() !== session.authUserId.toLowerCase()) {
        await repository.signOutMerchant()
        setStoreMerchantSessionFromAuthSession(null)
        bindMerchantSessionToRepository(repository)
        setMerchantSession(null)
        setMerchantBindings([])
        setIsAdminLoggedIn(false)
        clearPersistedMerchantSession(false)
        setLoginError('This account is not bound to current store.')
        return
      }

      const effectiveLoginName = binding.loginName?.trim() || session.loginName
      const effectiveSession: MerchantAuthSession = {
        ...session,
        loginName: effectiveLoginName
      }
      const routeAfterLogin = pendingPushRoute

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

      await tryLoadFromCloud(ShowcaseRetryOps.LoadFromCloud)
      await refreshAdminHomeCloudState(false)

      if (routeAfterLogin && String(routeAfterLogin.openAs || '').trim().toLowerCase() === 'merchant') {
        setPendingPushRoute(null)
        await handlePushRoute(routeAfterLogin)
      }
    } catch {
      setStoreMerchantSessionFromAuthSession(null)
      bindMerchantSessionToRepository(repository)
      setMerchantSession(null)
      setMerchantBindings([])
      setIsAdminLoggedIn(false)
      clearPersistedMerchantSession(false)
      setLoginError('Invalid account or password.')
    } finally {
      setIsLoginLoading(false)
    }
  }

  async function signOutMerchant(): Promise<void> {
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

      setAdminUsernameDraft('')
      setAdminPasswordDraft('')
      setLoginUsernameDraft('')
      setLoginPasswordDraft('')
      setLoginRememberMeDraft(false)
      setLoginError(null)

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

  function loadAdminCredentials(): void {
    const restored = restoreMerchantSessionFromStorage()

    if (!restored) {
      setAdminUsernameDraft('')
      setLoginUsernameDraft('')
      return
    }

    setAdminUsernameDraft(restored.loginName)
    setLoginUsernameDraft(restored.loginName)
    setStoreMerchantSessionFromAuthSession(restored)
    bindMerchantSessionToRepository(repository)
    setMerchantSession(restored)
    setIsAdminLoggedIn(Boolean(restored.accessToken))

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

    const validSession = await ensureValidMerchantAccessToken({
      session: sessionInput,
      refreshSession: async session => {
        const refreshed = await repository.refreshCurrentMerchantSessionForManager(session)

        return {
          ok: Boolean(refreshed),
          session: refreshed
        }
      },
      persistSession: session => {
        persistMerchantSession(session, readRememberMe())
      }
    })

    if (!validSession) {
      bindMerchantSessionToRepository(repository)
      return false
    }

    setStoreMerchantSessionFromAuthSession(validSession)
    bindMerchantSessionToRepository(repository)

    const binding = await repository.fetchMerchantBindingForStoreAndAuthUser(storeId, validSession.authUserId)
    if (!binding) {
      setSyncErrorMessage('Merchant binding check failed. Please try again.')
      setSyncOverviewState(SyncOverviewStates.Failed)
      return false
    }

    setMerchantBindings([binding])
    applyRefreshedMerchantSession(validSession)
    setAdminUsernameDraft(validSession.loginName)
    setLoginUsernameDraft(validSession.loginName)
    return true
  }

  async function ensureMerchantSessionLoadedForCloud(): Promise<MerchantAuthSession | null> {
    ndjcTrace('ENTER ensureMerchantSessionLoadedForCloud', {
      screen,
      isAdminLoggedIn,
      hasReactSession: Boolean(merchantSession?.accessToken),
      hasStoredSession: Boolean(restoreMerchantSessionFromStorage()?.accessToken),
      storeId
    })

    const sourceSession = merchantSession?.accessToken
      ? merchantSession
      : restoreMerchantSessionFromStorage()

    if (!sourceSession) {
      ndjcTrace('EXIT ensureMerchantSessionLoadedForCloud no source session', {
        screen,
        isAdminLoggedIn
      })
      return null
    }

    const validSession = await ensureValidMerchantAccessToken({
      session: sourceSession,
      refreshSession: async session => {
        const refreshed = await repository.refreshCurrentMerchantSessionForManager(session)

        return {
          ok: Boolean(refreshed),
          session: refreshed
        }
      },
      persistSession: session => {
        persistMerchantSession(session, readRememberMe())
      }
    })

    if (!validSession) {
      ndjcTrace('ensureMerchantSessionLoadedForCloud refresh returned null, keep source session', {
        screen,
        isAdminLoggedIn,
        authUserId: sourceSession.authUserId,
        expiresAt: sourceSession.expiresAt
      })

      setStoreMerchantSessionFromAuthSession(sourceSession)
      bindMerchantSessionToRepository(repository)
      setMerchantSession(sourceSession)
      setIsAdminLoggedIn(isMerchantLoggedInInStoreSession())
      return sourceSession
    }

    applyRefreshedMerchantSession(validSession)

    ndjcTrace('EXIT ensureMerchantSessionLoadedForCloud valid session', {
      screen,
      isAdminLoggedIn,
      authUserId: validSession.authUserId,
      expiresAt: validSession.expiresAt
    })

    return validSession
  }

  function isRecoverableMerchantAuthErrorMessage(messageInput: string): boolean {
    const lower = messageInput.toLowerCase()

    return lower.includes('jwt expired') ||
      lower.includes('jwt is expired') ||
      lower.includes('invalid jwt') ||
      lower.includes('expired jwt') ||
      lower.includes('unauthorized') ||
      lower.includes('401')
  }

  function isUnrecoverableMerchantRefreshErrorMessage(messageInput: string): boolean {
    const lower = messageInput.toLowerCase()

    return lower.includes('invalid_grant') ||
      lower.includes('refresh token not found') ||
      lower.includes('invalid refresh token') ||
      lower.includes('refresh token expired') ||
      lower.includes('session not found') ||
      lower.includes('no refresh token')
  }

  async function tryForceRefreshMerchantSessionForAuthError(): Promise<boolean> {
    const sourceSession = merchantSession?.accessToken
      ? merchantSession
      : restoreMerchantSessionFromStorage()

    if (!sourceSession?.refreshToken) {
      return false
    }

    const refreshed = await repository.refreshCurrentMerchantSessionForManager(sourceSession)

    if (!refreshed?.accessToken) {
      return false
    }

    applyRefreshedMerchantSession(refreshed)

    return true
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

    const refreshed = await tryForceRefreshMerchantSessionForAuthError()

    ndjcTrace('handleMerchantAuthExpiredIfNeeded force refresh result', {
      refreshed,
      message
    })

    if (refreshed) {
      return true
    }

    return false
  }

  async function handleMerchantSessionExpired(): Promise<void> {
    ndjcTrace('ENTER handleMerchantSessionExpired', {
      screen,
      isAdminLoggedIn,
      hasMerchantSession: Boolean(merchantSession?.accessToken),
      stack: new Error('handleMerchantSessionExpired stack').stack || ''
    })

    const message = 'Session expired. Please sign in again.'

    clearStoreMerchantSession()
    bindMerchantSessionToRepository(repository)
    setMerchantSession(null)
    setIsAdminLoggedIn(false)
    setMerchantBindings([])
    clearStoredMerchantSession()
    setLoginPasswordDraft('')
    setAdminPasswordDraft('')
    setLoginError(message)
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

    setSyncOverviewState(SyncOverviewStates.Syncing)
    setSyncErrorMessage(null)

    try {
      const validSession = await ensureMerchantSessionLoadedForCloud()
      if (!validSession) {
        setSyncOverviewState(SyncOverviewStates.Failed)
        setSyncErrorMessage('Session expired. Please sign in again.')
        return
      }

      setStoreMerchantSessionFromAuthSession(validSession)
      bindMerchantSessionToRepository(repository)

      const traceId = `VM${Date.now()}_${storeId.slice(-4)}`
      const serviceStatus = await repository.fetchStoreServiceStatus(storeId)
      const writeAllowed = serviceStatus
        ? serviceStatus.isWriteAllowed
        : await repository.isStoreWriteAllowed(storeId)

      setCloudStatus(serviceStatus)
      setIsWriteAllowed(writeAllowed)
      setLastSyncAt(nowMillis())
      setSyncOverviewState(SyncOverviewStates.Idle)
      setSyncErrorMessage(null)

      if (showStatusMessage) {
        setStatusMessage(null)
      }

      void repository.fetchAppointmentRequestsForMerchant(storeId)
        .then(merchantAppointments => {
          const sortedAppointments = [...merchantAppointments].sort((left, right) => {
            return (right.createdAt || 0) - (left.createdAt || 0)
          })

          setAppointmentRequests(sortedAppointments)
        })
        .catch(appointmentError => {
          console.warn('[AdminHome] appointment refresh failed', appointmentError)
        })

      void chatRepository.syncMerchantThreadMetaFromCloud(storeId, traceId)
        .then(async () => {
          const threads = await fetchMerchantThreadsFromChatRepository(traceId)
          const mergedThreads = await buildMerchantThreadsWithLocalMeta(threads)

          setMerchantChatThreads(mergedThreads)
        })
        .catch(chatError => {
          console.warn('[AdminHome] chat thread refresh failed', chatError)
        })
    } catch (error) {
      const handled = await handleMerchantAuthExpiredIfNeeded(error)
      if (handled) return

      const message = error instanceof Error ? error.message : 'Admin refresh failed.'

      setSyncOverviewState(SyncOverviewStates.Failed)
      setSyncErrorMessage(message)

      if (showStatusMessage) {
        setStatusMessage(message)
      }
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
        await ensureMerchantSessionLoadedForCloud()
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

    loadAdminCredentials()
    await tryLoadFromCloud(ShowcaseRetryOps.LoadFromCloud)

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

    return {
      dishId: selectedDish.id,
      title: getDishTitle(selectedDish),
      price: formatUsd(getDishPrice(selectedDish)),
      imageUrl: resolveDishImage(selectedDish)
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
    await refreshAnnouncementsEntryDotOnce()
    await refreshBookingsEntryDotOnce()

    if (isBrowser()) {
      window.setTimeout(() => {
        void refreshAnnouncementsEntryDotOnce()
        void refreshBookingsEntryDotOnce()
      }, 2500)
    }
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
      imageUrl: resolveDishImage(dish)
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
    if (valueInput == null) return ''

    const date = valueInput instanceof Date
      ? valueInput
      : typeof valueInput === 'number'
        ? new Date(valueInput)
        : new Date(valueInput)

    if (!Number.isFinite(date.getTime())) {
      return typeof valueInput === 'string' ? valueInput : ''
    }

    const ymd = date.toISOString().slice(0, 10)
    const hm = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    })

    return `${ymd} ${hm}`
  }

  function hasUnsavedEditDraft(): boolean {
    return Boolean(
      editDishNameZh.trim() ||
      editDishNameEn.trim() ||
      editDishDescriptionEn.trim() ||
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

  async function merchantChatListMarkRead(conversationId: string): Promise<void> {
    await markMerchantThreadRead(conversationId)
  }

  function merchantChatListRenameThread(conversationId: string, title: string): void {
    void renameMerchantThread(conversationId, title)
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
    applyPriceRangeFromDrafts(
      adminItemsPriceMinDraft,
      adminItemsPriceMaxDraft,
      setAdminItemsAppliedMinPrice,
      setAdminItemsAppliedMaxPrice
    )
  }

  function onAdminItemsClearPriceRange(): void {
    setAdminItemsPriceMinDraft('')
    setAdminItemsPriceMaxDraft('')
    setAdminItemsAppliedMinPrice(null)
    setAdminItemsAppliedMaxPrice(null)
  }

  function onAdminItemsFilterDiscountOnlyChange(value: boolean): void {
    setAdminItemsFilterDiscountOnly(value)
  }

  function onAdminItemsFilterHiddenOnlyChange(value: boolean): void {
    setAdminItemsFilterHiddenOnly(value)
  }

  function onAdminItemsFilterRecommendedChange(value: boolean): void {
    setAdminItemsFilterRecommended(value)
  }

  function onAdminItemsPriceMaxDraftChange(value: string): void {
    setAdminItemsPriceMaxDraft(value)
  }

  function onAdminItemsPriceMinDraftChange(value: string): void {
    setAdminItemsPriceMinDraft(value)
  }

  function onAdminItemsSearchQueryChange(value: string): void {
    setAdminItemsSearchQuery(value)
  }

  function onAdminItemsSortModeChange(value: ShowcaseHomeSortMode): void {
    const nextMode = normalizeSortMode(value)

    setAdminItemsSortMode(current => {
      if (current === nextMode) {
        setAdminItemsSortAscending(currentAscending => !currentAscending)
        return current
      }

      setAdminItemsSortAscending(true)
      return nextMode
    })
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
    openAppointmentForDish(dishId)
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
    await tryLoadFromCloud(ShowcaseRetryOps.LoadFromCloud)

    if (screen === ShowcaseScreens.Admin || isAdminLoggedIn) {
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
    await refreshMerchantChatListInternal(true)
  }

  async function refreshMerchantChatListInternal(showRefreshing: boolean): Promise<void> {
    if (merchantChatListRefreshInFlightRef.current) return

    merchantChatListRefreshInFlightRef.current = true

    if (showRefreshing) {
      setMerchantChatListRefreshing(true)
    }

    try {
      await ensureMerchantSessionLoadedForCloud()

      const traceId = `VM${Date.now()}_${storeId.slice(-4)}`

      await chatRepository.syncMerchantThreadMetaFromCloud(
        storeId,
        traceId
      )

      const threads = await fetchMerchantThreadsFromChatRepository(traceId)

      setMerchantChatThreads(await buildMerchantThreadsWithLocalMeta(threads))
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
    const name = nameInput.trim()
    if (!name) return

    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)

    try {
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

      const result = await repository.deleteCategoryByName(storeId, name)

      if (!result.ok) {
        const handled = await handleMerchantAuthExpiredIfNeeded(
          new Error(`${result.errorCode} ${result.errorBody || ''}`)
        )

        if (handled) return

        setStatusMessage(result.errorMessage || 'Failed to delete category.')
        return
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

      setDishes(finalDishes)
      setCategories(cloudCategories)
      setPendingSyncOperations(buildPendingDishSyncOperations(finalDishes))
      setSelectedCategory(current => String(current || '').trim() === name ? null : current)
      setEditDishCategory(current => String(current || '').trim() === name ? null : current)
      setStatusMessage(null)

      saveDishesToStorage(storeId, finalDishes)
      saveManualCategoriesToStorage(storeId, allCategoryNames)
      setLastSyncAt(nowMillis())
    } catch {
      setStatusMessage('Failed to delete category.')
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

    setIsSavingStoreProfile(true)
    setStoreProfileSaveError(null)
    setStoreProfileSaveSuccess(false)
    setStatusMessage(null)

    try {
      if (!isWriteAllowed) {
        throw new Error('Store is read-only.')
      }

      let logoUrl = draftStoreProfileLogoUrl.trim()

      if (logoUrl && isLocalImageUri(logoUrl)) {
        const uploadedLogo = await uploadStoreImageIfNeeded(logoUrl, 'logo')

        if (!uploadedLogo) {
          throw new Error('Logo upload failed.')
        }

        logoUrl = uploadedLogo
      }

      const coverCandidates = draftStoreProfileCoverUrl
        .replace(/\\n/g, '\n')
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean)
        .filter((item, index, all) => all.indexOf(item) === index)
        .slice(0, 9)

      const uploadedCoverUrls: string[] = []

      for (const rawCoverUrl of coverCandidates) {
        if (isLocalImageUri(rawCoverUrl)) {
          const uploadedCover = await uploadStoreImageIfNeeded(rawCoverUrl, 'cover')

          if (!uploadedCover) {
            throw new Error('Cover upload failed.')
          }

          uploadedCoverUrls.push(uploadedCover)
        } else {
          uploadedCoverUrls.push(rawCoverUrl)
        }
      }

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
        businessStatus: normalizedBusinessStatus,
        updatedAt: nowMillis()
      }

      setStoreMerchantSessionFromAuthSession(merchantSession)
      bindMerchantSessionToRepository(repository)

      const ok = await repository.upsertStoreProfile(payload)

      if (!ok) {
        const detail = [
          repository.lastUpsertCode != null ? `code=${repository.lastUpsertCode}` : '',
          repository.lastUpsertBody ? `body=${repository.lastUpsertBody.slice(0, 300)}` : ''
        ].filter(Boolean).join(' ')

        const handled = await handleMerchantAuthExpiredIfNeeded(
          new Error(detail || 'Cloud save failed.')
        )

        if (handled) return

        throw new Error(detail ? `Cloud save failed. ${detail}` : 'Cloud save failed.')
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

    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)

    try {
      const result = await repository.ensureCategoryExists(storeId, name)

      if (!result.ok) {
        const handled = await handleMerchantAuthExpiredIfNeeded(
          new Error(`${result.errorCode} ${result.errorBody || ''}`)
        )

        if (handled) return

        setStatusMessage(result.errorMessage || 'Failed to add category.')
        return
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
    }
  }

  function requestDeleteCategory(nameInput: string): void {
    const name = nameInput.trim()
    if (!name) return

    const isReferencedLocally = dishes.some(item => String(item.category || '').trim() === name)

    if (isReferencedLocally) {
      setAdminCannotDeleteCategory(name)
      setAdminPendingDeleteCategory(null)
      return
    }

    setAdminPendingDeleteCategory({
      name,
      id: null
    })
    setAdminCannotDeleteCategory(null)
  }

  async function confirmDeleteCategory(): Promise<void> {
    const pending = adminPendingDeleteCategory
    if (!pending) return

    const name = pending.name.trim()
    if (!name) {
      setAdminPendingDeleteCategory(null)
      return
    }

    setAdminPendingDeleteCategory(null)
    await removeCategory(name)
  }

  async function renameCategory(oldName: string, newName: string): Promise<void> {
    const from = oldName.trim()
    const to = newName.trim()

    if (!from || !to || from === to) return

    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)

    try {
      const categoryId = await repository.getCategoryIdByName(storeId, from)

      if (!categoryId) {
        setStatusMessage('Update category failed. Category id was not found in cloud.')
        return
      }

      const result = await repository.renameCategoryById({
        storeId,
        categoryId,
        newName: to
      })

      if (!result.ok) {
        const handled = await handleMerchantAuthExpiredIfNeeded(
          new Error(`${result.errorCode} ${result.errorBody || ''}`)
        )

        if (handled) return

        setStatusMessage(result.errorMessage || 'Failed to update category.')
        return
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
    }
  }

  async function reorderCategory(categoryId: string, sortOrder: number): Promise<void> {
    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)

    const result = await repository.setCategorySortOrder({
      storeId,
      categoryId,
      sortOrder
    })

    if (!result.ok) {
      showSnackbar(result.errorMessage || 'Update category order failed.')
      return
    }

    const cloudCategories = await repository.fetchCategories(storeId)
    setCategories(cloudCategories)
  }

  async function saveDishFromEditForm(): Promise<void> {
    const validationError = validateEditDish()
    if (validationError) {
      setEditValidationError(validationError)
      return
    }

    const wasNew = !editDishId
    const existing = editDishId ? dishes.find(item => item.id === editDishId) || null : null
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

      const remoteUrls: string[] = []

      for (const rawUrl of draftDish.imageUrls) {
        const uploadedUrl = await uploadDishImageIfNeeded(rawUrl)

        if (!uploadedUrl) {
          throw new Error('Image upload failed.')
        }

        remoteUrls.push(uploadedUrl)
      }

      const finalImageUrls = remoteUrls
        .map(item => item.trim())
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
        updatedAt: nowMillis(),
        syncState: 'Pending',
        dirty: true
      }

      setStoreMerchantSessionFromAuthSession(merchantSession)
      bindMerchantSessionToRepository(repository)

      const ok = await repository.upsertDishFromDemo(storeId, nextDish)

      if (!ok) {
        throw new Error('Cloud save failed.')
      }

      let refreshed = await repository.fetchDishes(storeId)

      if (!refreshed.some(item => item.id === nextDish.id)) {
        refreshed = [nextDish, ...refreshed]
      }

      const finalDishes = refreshed.map(item => {
        if (item.id !== nextDish.id) return item

        return {
          ...item,
          imageUri: item.imageUri || nextDish.imageUri,
          imageUrls: item.imageUrls.length ? item.imageUrls : nextDish.imageUrls,
          updatedAt: item.updatedAt || nextDish.updatedAt,
          syncState: 'Synced' as SyncState,
          dirty: false
        }
      })

      saveDishesToStorage(storeId, finalDishes)
      setDishes(finalDishes)

      const selected = finalDishes.find(item => item.id === nextDish.id) || {
        ...nextDish,
        syncState: 'Synced' as SyncState,
        dirty: false
      }

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

      setStatusMessage(failureMessage)
      setSyncOverviewState(SyncOverviewStates.Failed)
      setSyncErrorMessage(failureMessage)
      setLastRetryOp(null)
      setEditValidationError(failureMessage)
      setIsSavingEditDish(false)
      setIsBlockingEditDish(false)
    }
  }

  async function deleteDish(dishIdInput: string): Promise<void> {
    const dishId = dishIdInput.trim()

    if (!dishId) {
      setPendingDeleteDishId(null)
      return
    }

    const dish = dishes.find(item => item.id === dishId) || null

    if (!dish) {
      setPendingDeleteDishId(null)
      return
    }

    setPendingDeleteDishId(null)
    setStatusMessage('Deleting from cloud...')
    setSyncOverviewState(SyncOverviewStates.Syncing)
    setSyncErrorMessage(null)
    setLastRetryOp(null)

    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)

    try {
      const imageUrls = resolveDishImages(dish)
        .map(item => item.trim())
        .filter(Boolean)
        .filter((item, index, all) => all.indexOf(item) === index)

      for (const url of imageUrls) {
        if (!isLocalImageUri(url)) {
          await repository.deleteDishImageByUrl(url)
        }
      }

      const ok = await repository.deleteDishById(dish.id)

      if (!ok) {
        throw new Error('Cloud delete failed.')
      }

      preserveFavoriteSnapshotsBeforeDishDelete([dish])

      let refreshed = await repository.fetchDishes(storeId)

      if (!refreshed.length) {
        refreshed = dishes.filter(item => item.id !== dish.id)
      }

      const finalDishes = refreshed.filter(item => item.id !== dish.id)

      setDishes(finalDishes)
      saveDishesToStorage(storeId, finalDishes)
      refreshFavoritesList(finalDishes)
      removePendingSync(`dish-delete:${dish.id}`)
      removePendingSync(`dish-upsert:${dish.id}`)

      setSelectedDishId(current => current === dish.id ? null : current)
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
      return applyHomeFilters({
        dishes,
        selectedCategory,
        selectedTags,
        searchQuery,
        filterRecommendedOnly,
        filterOnSaleOnly,
        appliedMinPrice: homeAppliedMinPrice,
        appliedMaxPrice: homeAppliedMaxPrice,
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

    const toDelete = dishes.filter(item => ids.includes(item.id))

    if (!toDelete.length) {
      setAdminSelectedDishIds([])
      return
    }

    setAdminSelectedDishIds([])
    setPendingDeleteDishId(null)
    setStatusMessage(`Deleting ${toDelete.length} item(s) from cloud...`)
    setSyncOverviewState(SyncOverviewStates.Syncing)
    setSyncErrorMessage(null)
    setLastRetryOp(null)

    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)

    try {
      let allOk = true

      for (const dish of toDelete) {
        const imageUrls = resolveDishImages(dish)
          .map(item => item.trim())
          .filter(Boolean)
          .filter((item, index, all) => all.indexOf(item) === index)

        for (const url of imageUrls) {
          if (!isLocalImageUri(url)) {
            await repository.deleteDishImageByUrl(url)
          }
        }

        const ok = await repository.deleteDishById(dish.id)

        if (!ok) {
          allOk = false
        }
      }

      if (!allOk) {
        throw new Error('Cloud delete failed.')
      }

      preserveFavoriteSnapshotsBeforeDishDelete(toDelete)

      let refreshed = await repository.fetchDishes(storeId)

      if (!refreshed.length) {
        const deletingIds = new Set(toDelete.map(item => item.id))
        refreshed = dishes.filter(item => !deletingIds.has(item.id))
      }

      const deletingIds = new Set(toDelete.map(item => item.id))
      const finalDishes = refreshed.filter(item => !deletingIds.has(item.id))

      setDishes(finalDishes)
      saveDishesToStorage(storeId, finalDishes)
      refreshFavoritesList(finalDishes)

      toDelete.forEach(dish => {
        removePendingSync(`dish-delete:${dish.id}`)
        removePendingSync(`dish-upsert:${dish.id}`)
      })

      setSelectedDishId(current => current && deletingIds.has(current) ? null : current)
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
    nameZh?: string
    nameEn?: string
    descriptionEn?: string
    category?: string | null
    originalPrice?: string
    discountPrice?: string
    isRecommended?: boolean
    isHidden?: boolean
    imageUrls?: string[]
  }): void {
    const nextNameZh = patch.nameZh !== undefined ? patch.nameZh : editDishNameZh
    const nextNameEn = patch.nameEn !== undefined ? patch.nameEn : editDishNameEn
    const nextDescriptionEn = patch.descriptionEn !== undefined ? patch.descriptionEn : editDishDescriptionEn
    const nextCategory = patch.category !== undefined ? patch.category : editDishCategory
    const nextOriginalPrice = patch.originalPrice !== undefined ? patch.originalPrice : editDishOriginalPrice
    const nextDiscountPrice = patch.discountPrice !== undefined ? patch.discountPrice : editDishDiscountPrice

    if (patch.nameZh !== undefined) setEditDishNameZh(patch.nameZh)
    if (patch.nameEn !== undefined) setEditDishNameEn(patch.nameEn)
    if (patch.descriptionEn !== undefined) setEditDishDescriptionEn(patch.descriptionEn)
    if (patch.category !== undefined) setEditDishCategory(patch.category)
    if (patch.originalPrice !== undefined) setEditDishOriginalPrice(patch.originalPrice)
    if (patch.discountPrice !== undefined) setEditDishDiscountPrice(patch.discountPrice)
    if (patch.isRecommended !== undefined) setEditDishRecommended(patch.isRecommended)
    if (patch.isHidden !== undefined) setEditDishHidden(patch.isHidden)
    if (patch.imageUrls !== undefined) setEditDishImageUrls(patch.imageUrls)

    persistItemEditorDraftLocally(storeId, {
      editingId: editDishId?.trim() || null,
      isNew: !editDishId,
      name: (nextNameZh || nextNameEn).trim(),
      price: nextOriginalPrice.trim(),
      discountPrice: nextDiscountPrice.trim(),
      description: nextDescriptionEn.trim(),
      category: nextCategory?.trim() || null
    })

    setEditValidationError(null)
  }

  function onEditNameChange(value: string): void {
    updateEditDraft({
      nameZh: value,
      nameEn: value
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
      descriptionEn: value.slice(0, 200)
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

  async function uploadDishImageIfNeeded(value: File | Blob | string): Promise<string | null> {
    if (typeof value === 'string') {
      const url = value.trim()
      if (!url) return null

      if (!isLocalImageUri(url)) {
        return url
      }

      try {
        const response = await fetch(url)
        if (!response.ok) return null

        const blob = await response.blob()
        const uploaded = await pickAndUploadImage({
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

    return pickAndUploadImage({
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
        clickCount: item.clickCount + 1
      }
    }))

    await repository.incrementDishClickCount(storeId, id)
  }

  async function deleteDishImage(url: string): Promise<void> {
    const clean = url.trim()
    if (!clean) return

    const ok = await repository.deleteDishImageByUrl(clean)
    if (!ok) {
      showSnackbar('Delete image failed.')
      return
    }

    setEditDishImageUrls(current => current.filter(item => item !== clean))
    setDishes(current => current.map(item => ({
      ...item,
      imageUrls: item.imageUrls.filter(imageUrl => imageUrl !== clean)
    })))
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
    clearExpiredLocalTempFiles(storeId)
    console.log('[NDJC_PUSH] Auto push registration is disabled. Use a user-click action to enable notifications.')
    startChatEntryPolling()
    startAnnouncementsEntryPolling()
    startBookingsEntryPolling()

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
    if (screen === ShowcaseScreens.Chat) {
      markRuntimeConversationVisible(activeConversationId)
      setRuntimeChatVisible(true)
      postChatVisibilityToServiceWorker({
        visible: true,
        conversationId: activeConversationId,
        screen
      })
      startChatPolling()
      startChatDbObserve()

      const heartbeatTimer = isBrowser()
        ? window.setInterval(() => {
            postChatVisibilityToServiceWorker({
              visible: true,
              conversationId: activeConversationId,
              screen
            })
          }, NDJC_CHAT_VISIBILITY_HEARTBEAT_MS)
        : null

      return () => {
        if (heartbeatTimer != null && isBrowser()) {
          window.clearInterval(heartbeatTimer)
        }

        markRuntimeConversationRecentlySeen(activeConversationId)
        setRuntimeChatVisible(false)
        postChatVisibilityToServiceWorker({
          visible: false,
          conversationId: activeConversationId,
          screen
        })
        stopChatPolling()
        stopChatDbObserve()
      }
    }

    markRuntimeConversationRecentlySeen(activeConversationId)
    setRuntimeChatVisible(false)
    postChatVisibilityToServiceWorker({
      visible: false,
      conversationId: activeConversationId,
      screen
    })
    stopChatPolling()
    stopChatDbObserve()
    return undefined
  }, [screen, activeConversationId])

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

      console.log('[NDJC_CHAT] Service Worker chat push received.', {
        pushedConversationId,
        screen,
        activeConversationId: activeConversationIdRef.current
      })

      void refreshChatEntryDotOnce()

      if (
        screen === ShowcaseScreens.Chat &&
        pushedConversationId &&
        activeConversationIdRef.current.trim() === pushedConversationId
      ) {
        void syncChat()
      }
    }

    serviceWorkerContainer.addEventListener('message', handleServiceWorkerMessage)

    return () => {
      serviceWorkerContainer.removeEventListener('message', handleServiceWorkerMessage)
    }
  }, [screen])
  useEffect(() => {
    if (screen !== ShowcaseScreens.Home) return

    void ensureAnnouncementRegistrationOnHome()
  }, [screen])
    useEffect(() => {
    if (screen === 'MerchantChatList') {
      startMerchantChatListDbObserve()
      void refreshMerchantChatListInternal(false)
      startMerchantChatListPolling(2000)
      return
    }

    if (screen === 'Admin') {
      startMerchantChatListDbObserve()
      void refreshMerchantChatListInternal(false)
      startMerchantChatListPolling(10000)
      return
    }

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
    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)

    if (!merchantSession?.accessToken) {
      showSnackbar('Please sign in to upload images.')
      return null
    }

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

    const uploadedUrl = await pickAndUploadImage({
      bucket: 'dish',
      pathPrefix: editDishId || 'draft',
      file: fileOrUrl
    })

    if (!uploadedUrl) {
      showSnackbar('Image upload failed.')
      return
    }

    setEditDishImageUrls(current => {
      if (current.includes(uploadedUrl)) return current
      return [...current, uploadedUrl]
    })
  }

  async function handleStoreLogoPicked(fileOrUrl: File | Blob | string): Promise<void> {
    if (typeof fileOrUrl === 'string') {
      rememberLocalTempImage(storeId, 'store-profile', fileOrUrl)
      setDraftStoreProfileLogoUrl(fileOrUrl)
      return
    }

    const uploadedUrl = await pickAndUploadImage({
      bucket: 'store',
      pathPrefix: 'logo',
      file: fileOrUrl
    })

    if (!uploadedUrl) {
      showSnackbar('Logo upload failed.')
      return
    }

    setDraftStoreProfileLogoUrl(uploadedUrl)
  }

  async function handleStoreCoverPicked(fileOrUrl: File | Blob | string): Promise<void> {
    if (typeof fileOrUrl === 'string') {
      rememberLocalTempImage(storeId, 'store-profile', fileOrUrl)
      setDraftStoreProfileCoverUrl(fileOrUrl)
      return
    }

    const uploadedUrl = await pickAndUploadImage({
      bucket: 'store',
      pathPrefix: 'cover',
      file: fileOrUrl
    })

    if (!uploadedUrl) {
      showSnackbar('Cover upload failed.')
      return
    }

    setDraftStoreProfileCoverUrl(uploadedUrl)
  }

  async function uploadAnnouncementCoverIfNeeded(valueInput: string | null): Promise<string | null> {
    const value = valueInput?.trim() || null

    if (!value) return null

    if (!isLocalImageUri(value)) {
      return value
    }

    try {
      const response = await fetch(value)

      if (!response.ok) {
        return null
      }

      const blob = await response.blob()
      const uploadedUrl = await pickAndUploadImage({
        bucket: 'announcement',
        pathPrefix: 'covers',
        file: blob
      })

      if (!uploadedUrl) {
        return null
      }

      rememberLocalTempImage(storeId, 'admin-announcement', value)
      return uploadedUrl
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
}): Promise<string> {
  const sourceUrl = input.sourceUrl.trim()

  if (!sourceUrl) {
    throw new Error('Chat image unavailable.')
  }

  if (!input.needsUpload) {
    return sourceUrl
  }

  const response = await fetch(sourceUrl)

  if (!response.ok) {
    throw new Error('Chat image unavailable.')
  }

  const blob = await response.blob()
  const compressed = await compressImage(blob, CHAT_IMAGE_LONG_EDGE, CHAT_IMAGE_JPEG_QUALITY)
  const contentType = normalizeImageContentType(compressed.type || blob.type || 'image/jpeg')

  const uploadedUrl = await chatRepository.uploadChatImageToPublicUrl({
    bytes: compressed,
    contentType,
    storeId,
    conversationId: input.conversation.id,
    msgId: input.messageId,
    clientId: input.conversation.clientId || clientId,
    asMerchant: currentChatRole() === 'merchant',
    index: input.index,
    traceId: input.traceId
  })

  if (!uploadedUrl) {
    throw new Error('Chat image upload failed.')
  }

  return uploadedUrl
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

    const dish = dishes.find(item => item.id === dishId) || null
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
    setHomeShowSortMenu(false)
    setHomeShowFilterMenu(false)
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
    setSelectedCategory(null)
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
    setSelectedTags(
      Array.from(
        new Set(
          tags
            .map(tag => tag.trim())
            .filter(Boolean)
        )
      )
    )
  }

  function onClearTags(): void {
    setSelectedTags([])
  }

  function onSearchQueryChange(value: string): void {
    setSearchQuery(value)
  }

  function onCategorySelected(value: string | null): void {
    const category = String(value || '').trim()
    setSelectedCategory(category || null)
  }

  function onSortModeChange(value: ShowcaseHomeSortMode): void {
    setSortMode(normalizeSortMode(value))
    setHomeShowSortMenu(false)
  }

  function onFilterRecommendedOnlyChange(value: boolean): void {
    setFilterRecommendedOnly(value)
  }

  function onFilterOnSaleOnlyChange(value: boolean): void {
    setFilterOnSaleOnly(value)
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
  }

  function onHomeClearPriceRange(): void {
    setHomePriceMinDraft('')
    setHomePriceMaxDraft('')
    setHomeAppliedMinPrice(null)
    setHomeAppliedMaxPrice(null)
    setHomeShowPriceMenu(false)
  }

  function onClearSortAndFilters(): void {
    clearHomeSortAndFilters()
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

  function openAppointmentForDish(dishIdInput: string): void {
    const dishId = dishIdInput.trim()
    const dish = dishes.find(item => item.id === dishId) || null

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

    if (!appointmentsEnabled) {
      setAppointmentError('Appointment booking is not enabled.')
      setAppointmentSuccess(null)
      return
    }

    const sourceDish = appointmentSourceDishId
      ? dishes.find(item => item.id === appointmentSourceDishId) || null
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
        sourceDishId: sourceDish.id
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

      await dispatchNewAppointmentPushToMerchant(created)
      await refreshCustomerAppointmentsFromCloud()
    } catch {
      setAppointmentError('Booking request failed. Please check your connection.')
      setAppointmentSuccess(null)
    } finally {
      setAppointmentsRefreshing(false)
    }
  }

  async function saveAppointmentSettings(): Promise<void> {
    await saveAppointmentSettingsToCloud()
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
  const appointmentId = appointmentIdInput.trim()
  const statusLabel = appointmentsStatusFromCloud(statusInput)
  const status = appointmentsStatusToCloud(statusLabel)

  if (!appointmentId || !status) return

  const previous = appointmentRequests
  const previousTarget = previous.find(item => item.id === appointmentId) || null
  const previousStatus = previousTarget?.status || null

  const next = previous.map(item => {
    if (item.id !== appointmentId) return item

    return {
      id: item.id,
      storeId: item.storeId,
      clientId: item.clientId,
      customerName: item.customerName,
      customerContact: item.customerContact,
      serviceTitle: item.serviceTitle,
      preferredDate: item.preferredDate,
      preferredTime: item.preferredTime,
      note: item.note,
      sourceDishId: item.sourceDishId,
      status,
      createdAt: item.createdAt
    }
  })

  const nextTarget = next.find(item => item.id === appointmentId) || null

  setAppointmentRequests(next)
  saveAppointmentsToStorage(storeId, next)
  setStatusMessage(null)

  try {
    await ensureMerchantSessionLoadedForCloud()

    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)

    const ok = await repository.updateAppointmentStatus({
      storeId,
      appointmentId,
      status
    })

    if (!ok) {
      const detail = [
        repository.lastUpsertCode != null ? `code=${repository.lastUpsertCode}` : '',
        repository.lastUpsertBody ? `body=${repository.lastUpsertBody.slice(0, 300)}` : ''
      ].filter(Boolean).join(' ')

      const handled = await handleMerchantAuthExpiredIfNeeded(
        new Error(detail || 'Appointment status update failed.')
      )

      if (handled) return

      throw new Error('Appointment status update failed.')
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

  function onAppointmentAdminDateFilterChange(value: string): void {
    setAppointmentAdminDateFilter(value.trim() || 'All')
    setAppointmentAdminHistoryDateFilter(null)
    setAppointmentAdminServiceFilter('All')
  }

  function onAppointmentAdminHistoryDateClear(): void {
    setAppointmentAdminHistoryDateFilter(null)
    setAppointmentAdminDateFilter('All')
    setAppointmentAdminServiceFilter('All')
  }

  function onAppointmentAdminHistoryDateSelected(value: string): void {
    const safeValue = value.trim()

    if (!/^\d{4}-\d{2}-\d{2}$/.test(safeValue)) return

    setAppointmentAdminHistoryDateFilter(safeValue)
    setAppointmentAdminDateFilter('All')
    setAppointmentAdminServiceFilter('All')
  }

  function onAppointmentAdminServiceFilterChange(value: string): void {
    setAppointmentAdminServiceFilter(value.trim() || 'All')
  }

  function onAppointmentAdminStatusFilterChange(value: string): void {
    setAppointmentAdminStatusFilter(value.trim() || 'All')
    setAppointmentAdminServiceFilter('All')
  }

  function onAppointmentAvailableHoursTextChange(value: string): void {
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
    const safeDays = normalizeAppointmentBookingWindowDays(value)
    const nextSettings = currentAppointmentSettingsForCloud({
      bookingWindowDays: safeDays
    })

    applyAppointmentSettingsLocally(nextSettings)
    setStatusMessage('Booking window updated.')

    void saveAppointmentSettingsToCloud(nextSettings)
  }

  function onAppointmentClosedDayToggle(value: string): void {
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
    setAppointmentCustomerDateFilter(value.trim() || 'All')
    setAppointmentCustomerServiceFilter('All')
  }

  function onAppointmentCustomerServiceFilterChange(value: string): void {
    setAppointmentCustomerServiceFilter(value.trim() || 'All')
  }

  function onAppointmentCustomerStatusFilterChange(value: string): void {
    setAppointmentCustomerStatusFilter(value.trim() || 'All')
    setAppointmentCustomerServiceFilter('All')
  }

  function onAppointmentDateDraftChange(value: string): void {
    setAppointmentDateDraft(value)
    setAppointmentTimeDraft('')
    setAppointmentError(null)
    setAppointmentSuccess(null)
  }

  function onAppointmentMinimumNoticeChange(value: string): void {
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
    const nextSettings = currentAppointmentSettingsForCloud({
      enabled: value
    })

    applyAppointmentSettingsLocally(nextSettings)
    setStatusMessage(value ? 'Appointment booking enabled.' : 'Appointment booking disabled.')

    void saveAppointmentSettingsToCloud(nextSettings)
  }

async function refreshAdminAppointmentsFromCloud(statusMessageOverride: string | null = null): Promise<void> {
  setAppointmentsRefreshing(true)

  try {
    await ensureMerchantSessionLoadedForCloud()

    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)

    const cloudSettings = await repository.fetchAppointmentSettings(storeId)

    if (cloudSettings) {
      applyCloudAppointmentSettings(cloudSettings)
    }

    const items = await repository.fetchAppointmentRequestsForMerchant(storeId)
    const sortedItems = [...items].sort((left, right) => {
      return (right.createdAt || 0) - (left.createdAt || 0)
    })

    setAppointmentRequests(sortedItems)
    saveAppointmentsToStorage(storeId, sortedItems)
    setStatusMessage(statusMessageOverride || 'Appointments refreshed.')
  } catch (error) {
    const cachedItems = loadAppointmentsFromStorage(storeId)

    if (cachedItems.length) {
      setAppointmentRequests(cachedItems)
    }

    const message = error instanceof Error
      ? error.message
      : 'Appointments refresh failed.'

    setStatusMessage(message || 'Appointments refresh failed.')
  } finally {
    setAppointmentsRefreshing(false)
  }
}

async function refreshCustomerAppointmentsFromCloud(statusMessageOverride: string | null = null): Promise<void> {
  setAppointmentsRefreshing(true)

  try {
    const cloudSettings = await repository.fetchAppointmentSettings(storeId)

    if (cloudSettings) {
      applyCloudAppointmentSettings(cloudSettings)
    }

    const items = await repository.fetchAppointmentRequestsForClient(storeId, clientId)
    const sortedItems = [...items].sort((left, right) => {
      return (right.createdAt || 0) - (left.createdAt || 0)
    })

    setAppointmentRequests(sortedItems)
    saveAppointmentsToStorage(storeId, sortedItems)
    setStatusMessage(statusMessageOverride || 'Bookings refreshed.')
  } catch {
    const cachedItems = loadAppointmentsFromStorage(storeId)

    if (cachedItems.length) {
      setAppointmentRequests(cachedItems)
    }

    setStatusMessage('Bookings refresh failed.')
  } finally {
    setAppointmentsRefreshing(false)
  }
}

  async function saveAppointmentSettingsToCloud(settingsInput?: CloudAppointmentSettings): Promise<void> {
    const nextSettings = settingsInput || currentAppointmentSettingsForCloud()

    applyAppointmentSettingsLocally(nextSettings)

    try {
      await ensureMerchantSessionLoadedForCloud()

      setStoreMerchantSessionFromAuthSession(merchantSession)
      bindMerchantSessionToRepository(repository)

      const ok = await repository.upsertAppointmentSettings(nextSettings)

      if (!ok) {
        const detail = [
          repository.lastUpsertCode != null ? `code=${repository.lastUpsertCode}` : '',
          repository.lastUpsertBody ? `body=${repository.lastUpsertBody.slice(0, 300)}` : ''
        ].filter(Boolean).join(' ')

        const handled = await handleMerchantAuthExpiredIfNeeded(
          new Error(detail || 'Appointment settings save failed.')
        )

        if (handled) return

        throw new Error('Appointment settings save failed.')
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
    setAdminAnnouncementIsSubmitting(true)
    setAdminAnnouncementIsBlocking(true)
    setStatusMessage(null)

    try {
      let uploadedCoverUrl: string | null = sourceCoverUrl

      if (uploadedCoverUrl && isLocalImageUri(uploadedCoverUrl)) {
        const nextUploadedCoverUrl = await uploadAnnouncementCoverIfNeeded(uploadedCoverUrl)

        if (!nextUploadedCoverUrl) {
          const handled = await handleMerchantAuthExpiredIfNeeded(
            new Error(nextStatus === 'published' ? 'Cloud publish failed.' : 'Cloud save failed.')
          )

          if (handled) {
            setAdminAnnouncementIsSubmitting(false)
            setAdminAnnouncementIsBlocking(false)
            return
          }

          throw new Error(nextStatus === 'published' ? 'Cloud publish failed.' : 'Cloud save failed.')
        }

        uploadedCoverUrl = nextUploadedCoverUrl
      }

      setStoreMerchantSessionFromAuthSession(merchantSession)
      bindMerchantSessionToRepository(repository)

      const saved = await repository.upsertAnnouncement({
        id: targetId,
        storeId,
        coverUrl: uploadedCoverUrl,
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

        const handled = await handleMerchantAuthExpiredIfNeeded(
          new Error(detail || (nextStatus === 'published' ? 'Cloud publish failed.' : 'Cloud save failed.'))
        )

        if (handled) {
          setAdminAnnouncementIsSubmitting(false)
          setAdminAnnouncementIsBlocking(false)
          return
        }

        throw new Error(nextStatus === 'published' ? 'Cloud publish failed.' : 'Cloud save failed.')
      }

      if (nextStatus === 'published') {
        const pushOk = await repository.dispatchAnnouncementPush({
          storeId,
          announcementId: targetId,
          bodyPreview: 'Posted a new announcement'
        })

        if (!pushOk) {
          const detail = [
            repository.lastAnnouncementPushCode != null ? `code=${repository.lastAnnouncementPushCode}` : '',
            repository.lastAnnouncementPushBody ? `body=${repository.lastAnnouncementPushBody.slice(0, 300)}` : ''
          ].filter(Boolean).join(' ')

          const handled = await handleMerchantAuthExpiredIfNeeded(
            new Error(detail || 'Announcement push failed.')
          )

          if (handled) {
            setAdminAnnouncementIsSubmitting(false)
            setAdminAnnouncementIsBlocking(false)
            return
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
        includeDrafts: true
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
      setStatusMessage(nextStatus === 'published'
        ? `Couldn't publish announcement. ${message}`
        : `Couldn't save draft. ${message}`)
    }
  }

  async function deleteSelectedAnnouncements(): Promise<void> {
    const draftIdSet = new Set(
      adminAnnouncementDraftItems
        .filter(item => item.status === 'draft')
        .map(item => item.id)
    )

    const selected = adminAnnouncementSelectedIds
      .map(id => id.trim())
      .filter(id => id && draftIdSet.has(id))

    if (!selected.length) return

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

    void (async () => {
      setStoreMerchantSessionFromAuthSession(merchantSession)
      bindMerchantSessionToRepository(repository)

      const deleteOk = await repository.deleteAnnouncements(storeId, selected)

      if (!deleteOk) {
        const detail = [
          repository.lastDeleteCode != null ? `code=${repository.lastDeleteCode}` : '',
          repository.lastDeleteBody ? `body=${repository.lastDeleteBody.slice(0, 300)}` : ''
        ].filter(Boolean).join(' ')

        await handleMerchantDeleteExpiredIfNeeded(
          new Error(detail || 'Delete announcements failed.')
        )
      }
    })()
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

    const ok = await repository.incrementAnnouncementViewCount({
      storeId,
      announcementId: id
    })

    if (!ok) return

    markAnnouncementClickCountedLocally(id)
    await syncPublicAnnouncementsFromCloud(false)
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
    body: string
    status: 'draft' | 'published'
    viewCount?: number | null
  }): DraftAnnouncement {
    const now = nowMillis()

    return {
      id: input.id || createUuidLikeId(),
      coverUrl: input.coverUrl || null,
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

  async function syncPublicAnnouncementsFromCloud(markViewedAfterSync = false): Promise<void> {
    const latest = await repository.fetchAnnouncements({
      storeId,
      includeDrafts: false
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
    }
  }

  async function syncMerchantAnnouncementsFromCloud(): Promise<void> {
    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)

    const latest = await repository.fetchAnnouncements({
      storeId,
      includeDrafts: true
    })

    rebuildAnnouncementsList(latest)
  }

  async function refreshAnnouncements(): Promise<void> {
    await syncPublicAnnouncementsFromCloud(screen === ShowcaseScreens.Announcements)
  }

  async function refreshAnnouncementsEntryDotOnce(): Promise<void> {
    const latest = await repository.fetchAnnouncements({
      storeId,
      includeDrafts: false
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
      const latest = await repository.fetchAppointmentRequestsForClient(storeId, currentClientId)
      const sortedItems = [...latest].sort((left, right) => {
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

  function onAdminAnnouncementDeleteSelected(): void {
    void deleteSelectedAnnouncements()
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

  function onAdminAnnouncementPushNow(): void {
    void saveAnnouncement('published')
  }

  function onAdminAnnouncementSaveDraft(): void {
    void saveAnnouncement('draft')
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

    setFocusedAnnouncementId(clean)
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
      } else {
        await chatRepository.markMerchantMessagesReadToCloud(
          storeId,
          conversationId,
          effectiveClientId,
          traceId
        )
      }
    }

    if (
      chatMessageLoadSeqRef.current !== loadSeq ||
      activeConversationIdRef.current.trim() !== conversationId ||
      currentChatRole() !== role
    ) {
      return
    }

    const localMessages = await chatRepository.listLocal(conversationId)
    const messages = localMessages.map(chatEntityToCloudMessage)

    if (
      chatMessageLoadSeqRef.current !== loadSeq ||
      activeConversationIdRef.current.trim() !== conversationId ||
      currentChatRole() !== role
    ) {
      return
    }

    setChatMessages(messages)
    setChatMediaItems(
      messages.flatMap(message => message.imageUrls
        .map(url => url.trim())
        .filter(Boolean)
        .map(url => ({
          conversationId,
          messageId: message.id,
          url,
          createdAtText: formatChatCreatedAtText(message.createdAt)
        }))
      )
    )

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

    const unreadCount = await chatRepository.countUnreadForUserEntry(conversationId)

    setChatEntryDotVisible(
      screen === ShowcaseScreens.Chat
        ? false
        : unreadCount > 0
    )
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

    await chatRepository.markMerchantMessagesReadByStoreAndClient(
      storeId,
      clientId
    )

    await chatRepository.markMerchantMessagesReadByStoreAndClientToCloud(
      storeId,
      clientId,
      traceId
    )

    await chatRepository.markMerchantMessagesReadByStoreAndClient(
      storeId,
      clientId
    )

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
    pendingProduct: ShowcaseChatProductShare | null = null
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

    chatMessageLoadSeqRef.current += 1

    if (!isSameConversation) {
      setChatMessages([])
      setChatMediaItems([])
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
    setChatQuotedMessageId(nextQuotedMessageId)
    setChatStatusMessage(null)

    if (pendingProduct) {
      writeChatDraft({
        storeId,
        conversationId: normalizedConversationId || conversationId,
        draft: nextDraft,
        draftImageUrls: nextImageUrls,
        pendingProduct,
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

  async function restoreClientChatContext(pendingProduct: ShowcaseChatProductShare | null = null): Promise<void> {
    setChatMode('Client')

    const conversation = await repository.findOrCreateChatConversation({
      storeId,
      clientId,
      customerName: DEFAULT_CUSTOMER_NAME,
      customerContact: ''
    })

    if (!conversation) return

    resetChatTransientStateForConversation(conversation.id, pendingProduct)

    activeConversationIdRef.current = conversation.id
    setActiveConversation(conversation)
    setActiveConversationId(conversation.id)
    setRuntimeActiveConversationId(conversation.id)

    void registerChatClientPushDevice(conversation.id, 'client-chat-context-restored', true)

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

        const threads = await buildMerchantThreadsWithLocalMeta(
          await fetchMerchantThreadsFromChatRepository(traceId)
        )

        setMerchantChatThreads(threads)

        return
      }

      const conversation = await ensureActiveConversation()
      if (!conversation) return

      if (canLoadFullMessages) {
        await refreshChatMessages(conversation.id, true, true)
      }
    } catch {
      setChatStatusMessage('Chat sync failed.')
    }
  }

  async function retryChat(): Promise<void> {
    await retryChatMessage('')
  }

  async function retryChatMessage(messageIdInput: string): Promise<void> {
    const messageId = String(messageIdInput || '').trim()
    const domainState = buildCurrentChatDomainState()
    const sendingState = messageId ? markRetrySending(domainState, messageId) : domainState

    if (messageId && sendingState === domainState) {
      await syncChat()

      if (chatStatusMessage) {
        setChatStatusMessage(null)
      }

      return
    }

    setChatIsSending(Boolean(sendingState.isSending))
    setChatStatusMessage(sendingState.errorMessage)

    try {
      await syncChat()

      const resultState = messageId
        ? markRetryResult(sendingState, messageId, true, null)
        : {
            ...sendingState,
            isSending: false,
            errorMessage: null
          }

      setChatIsSending(Boolean(resultState.isSending))
      setChatStatusMessage(resultState.errorMessage)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error || 'Retry sync failed.')
      const resultState = messageId
        ? markRetryResult(sendingState, messageId, false, message)
        : {
            ...sendingState,
            isSending: false,
            errorMessage: message
          }

      setChatIsSending(Boolean(resultState.isSending))
      setChatStatusMessage(resultState.errorMessage)
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
    audience?: 'chat_merchant' | 'chat_client' | 'announcement_subscriber'
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
          : '__announcement__'

    const deviceInstallId = getOrCreatePwaDeviceInstallId()

    const registered = await repository.upsertPushDevice({
      storeId,
      audience,
      token,
      conversationId: registrationConversationId,
      clientId: audience === 'chat_merchant' ? null : clientId,
      platform: 'web',
      appVersion: 'pwa',
      deviceInstallId
    })

    if (!registered) {
      console.warn('[NDJC_PUSH] Push device registration failed.', {
        storeId,
        audience,
        conversationId: registrationConversationId,
        clientId: audience === 'chat_merchant' ? null : clientId,
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

    const registered = await ensurePushRegistration({ audience: 'chat_merchant' })

    console.log('[NDJC_PUSH] Register merchant push device result.', {
      reason,
      registered,
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

    const unregistered = await repository.unregisterPushDevice({
      storeId,
      audience: 'chat_merchant',
      conversationId: '__merchant__',
      deviceInstallId
    })

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

    if (pushType === 'chat' || pushType === 'message') {
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

    if (pushType === 'appointment' || pushType === 'booking' || pushType === 'bookings') {
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
      setScreen('Login')
      return
    }

    if (routeInput.type === 'chat') {
      if (openAs === 'customer') {
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

      if (openAs === 'customer') {
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
      targetAudience: 'chat_merchant',
      openAs: 'merchant',
      actor: 'public',
      scopeClientId: appointment.clientId,
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

    const pushOk = await repository.dispatchAppointmentPush({
      storeId,
      appointmentId: appointment.id,
      targetAudience: 'announcement_subscriber',
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

      void handleMerchantAuthExpiredIfNeeded(
        new Error(detail || 'Appointment status push failed.')
      )
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
    const uploadedImageUrls: string[] = []

    for (const item of draftImageUploadPlan) {
      const uploadedUrl = await uploadChatDraftImageForSend({
        sourceUrl: item.sourceUrl,
        needsUpload: item.needsUpload,
        conversation,
        index: item.index,
        messageId: item.messageId,
        traceId
      })

      uploadedImageUrls.push(uploadedUrl)
    }

    const sendPlan = buildChatMessageSendPlan({
      rawBody,
      uploadedImageUris: uploadedImageUrls,
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

    setChatMessages(current => [
      ...current,
      ...sendPlan.entities.map(entity => chatEntityToCloudMessage(entity))
    ])

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

    const latestLocalMessages = await chatRepository.listLocal(conversation.id)
    setChatMessages(latestLocalMessages.map(chatEntityToCloudMessage))

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
      const latestLocalMessages = await chatRepository.listLocal(activeConversationId)
      setChatMessages(latestLocalMessages.map(chatEntityToCloudMessage))
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

    await ensureMerchantSessionLoadedForCloud()

    setStoreMerchantSessionFromAuthSession(merchantSession)
    bindMerchantSessionToRepository(repository)

    chatBackTargetRef.current = ShowcaseScreens.AdminAppointmentManager
    snapshotCurrentChatContext()

    stopChatPolling()
    stopChatDbObserve()
    stopMerchantChatListPolling()
    stopMerchantChatListDbObserve()

    setChatMode('Merchant')

    await repository.upsertChatConversation(threadId, storeId, appointmentClientId)

    activeConversationIdRef.current = threadId
    setActiveConversationId(threadId)
    setRuntimeActiveConversationId(threadId)
    setRuntimeChatVisible(true)
    setActiveConversation({
      id: threadId,
      storeId,
      clientId: appointmentClientId,
      merchantAuthUserId: merchantSession?.authUserId || null,
      customerName: threadTitle,
      customerContact: item.customerContact || appointmentClientId,
      createdAt: null,
      updatedAt: item.createdAt
    })

    setPreviousScreen(ShowcaseScreens.AdminAppointmentManager)
    setChatStatusMessage(null)
    setScreen(ShowcaseScreens.Chat)

    await refreshChatMessages(threadId, true, true)
    await syncChat()

    startChatDbObserve()
    startChatPolling()
  }
  async function openMerchantThread(conversationIdInput: string, titleInput?: string): Promise<void> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return

    const thread = merchantChatThreads.find(item => item.conversationId === conversationId) || null
    const threadTitle = titleInput?.trim() || thread?.title || 'Chat'

    void ensureMerchantSessionLoadedForCloud()

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
          merchantAuthUserId: merchantSession?.authUserId || null,
          customerName: threadTitle,
          customerContact: thread.clientId,
          createdAt: null,
          updatedAt: thread.lastMessageAt
        }
      : {
          id: conversationId,
          storeId,
          clientId: conversationId,
          merchantAuthUserId: merchantSession?.authUserId || null,
          customerName: threadTitle,
          customerContact: conversationId,
          createdAt: null,
          updatedAt: null
        }
    )

    setPreviousScreen(ShowcaseScreens.MerchantChatList)
    setChatStatusMessage(null)
    setScreen(ShowcaseScreens.Chat)

    await refreshChatMessages(conversationId, true, true)
    await refreshChatEntryDotOnce()
    await syncChat()

    startChatDbObserve()
    startChatPolling()
    void refreshMerchantChatListSilently()
  }
  async function refreshMerchantThreads(): Promise<void> {
    setMerchantChatListRefreshing(true)

    try {
      await chatRepository.syncMerchantThreadMetaFromCloud(
        storeId,
        `VM${Date.now()}_${storeId.slice(-4)}`
      )

      const threads = await fetchMerchantThreadsFromChatRepository(
        `VM${Date.now()}_${storeId.slice(-4)}`
      )

      setMerchantChatThreads(await buildMerchantThreadsWithLocalMeta(threads))
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

  async function markMerchantThreadRead(conversationIdInput: string): Promise<void> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return

    await chatRepository.markAllRead(conversationId)

    let shouldReloadActiveMessages = false
    let shouldClearChatEntryDot = false

    setMerchantChatThreads(current => {
      const operationResult = buildMerchantThreadReadOperationResult({
        threads: current,
        conversationId,
        activeConversationId
      })

      shouldReloadActiveMessages = operationResult.shouldReloadActiveMessages
      shouldClearChatEntryDot = operationResult.shouldClearChatEntryDot

      return operationResult.nextThreads
    })

    if (shouldReloadActiveMessages) {
      setChatMessages(await loadChatMessagesFromRepository(conversationId))
    }

    if (shouldClearChatEntryDot) {
      setChatEntryDotVisible(false)
    }

    await refreshMerchantChatListSilently()
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

    await chatRepository.deleteLocalById(messageId)

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

    applyChatDomainInteractionState(domainState)
    setChatSearchResults([])
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
    setChatQuotedMessageId(result.quoteMessageId)
    updateChatDraftPersistence(
      result.draftText,
      result.draftImageUris,
      result.pendingProduct,
      result.quoteMessageId
    )
  }

  function buildProductClipboardPayload(product: ShowcaseChatProductShare): string {
    return buildProductSharePayloadForClipboard(product)
  }

  function isProductAvailable(dishIdInput: string): boolean {
    const dishId = dishIdInput.trim()
    const dish = dishes.find(item => item.id === dishId)
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
      readAt: entity.isRead ? entity.timeMs || Date.now() : null
    }
  }

  async function loadChatMessagesFromRepository(conversationIdInput: string): Promise<ChatMessage[]> {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return []

    await chatRepository.syncConversationFromCloud({
      storeId,
      conversationId,
      perspectiveRole: currentChatPerspectiveRole(),
      clientId,
      traceId: `VM${Date.now()}_${conversationId.slice(-4)}`
    })

    const localMessages = await chatRepository.listLocal(conversationId)
    return localMessages.map(chatEntityToCloudMessage)
  }

  async function fetchMerchantThreadsFromChatRepository(traceId: string): Promise<ChatThreadSummary[]> {
    const rows = await chatRepository.fetchCloudThreadSummaries(storeId, traceId)
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

      newestCreatedAt: null,
      oldestCreatedAt: null,

      unreadCount: merchantChatThreads.find(item => item.conversationId === activeConversationId)?.unreadCount || 0,
      scrollToBottomSignal: 0,

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

    function parseChatMediaTimeMs(timeTextInput: string, fallbackIndex: number): number {
      const timeText = String(timeTextInput || '').trim()

      if (!timeText) {
        return fallbackIndex * 1000
      }

      const normalized = timeText.replace(/\s+/g, ' ').trim()
      const twentyFourHourMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/)

      if (twentyFourHourMatch) {
        const [, year, month, day, hour, minute] = twentyFourHourMatch
        const parsed = new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(hour),
          Number(minute),
          0,
          0
        ).getTime()

        return Number.isFinite(parsed) ? parsed : fallbackIndex * 1000
      }

      const twelveHourMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})\s+(AM|PM)\s+(\d{1,2}):(\d{2})$/i)

      if (twelveHourMatch) {
        const [, year, month, day, markerInput, rawHour, minute] = twelveHourMatch
        const marker = markerInput.toUpperCase()
        const baseHour = Number(rawHour)
        const hour = marker === 'PM'
          ? baseHour === 12 ? 12 : baseHour + 12
          : baseHour === 12 ? 0 : baseHour

        const parsed = new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
          hour,
          Number(minute),
          0,
          0
        ).getTime()

        return Number.isFinite(parsed) ? parsed : fallbackIndex * 1000
      }

      const direct = Date.parse(normalized)

      if (Number.isFinite(direct)) {
        return direct
      }

      return fallbackIndex * 1000
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

    chatUiMessages.forEach((message, messageIndex) => {
      const createdAtMs = parseChatMediaTimeMs(message.createdAtText, messageIndex)
      const dayKey = formatChatMediaDayKey(createdAtMs)

      message.imageUrls
        .map(url => String(url || '').trim())
        .filter(Boolean)
        .forEach(url => {
          const current = byUrl.get(url)

          const nextItem: SortableChatMediaItem = {
            conversationId: activeConversationId || '',
            messageId: message.id,
            url,
            dayKey,
            createdAtText: message.createdAtText,
            createdAtMsForSort: createdAtMs
          }

          if (!current || nextItem.createdAtMsForSort < current.createdAtMsForSort) {
            byUrl.set(url, nextItem)
          }
        })
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
      if (chatPendingProduct) {
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

      setChatMessages(current => [
        ...current,
        ...sendPlan.entities.map(entity => chatEntityToCloudMessage(entity))
      ])

      const results: boolean[] = []

      for (const entity of sendPlan.entities) {
        const ok = await chatRepository.insertMessageToCloud(entity, traceId)
        results.push(ok)
      }

      const operationResult = buildChatSendOperationResult({
        sendPlan,
        results,
        fallbackProductPushBody: 'Sent you a product card'
      })

      if (operationResult.shouldFail) {
        throw new Error('Message send failed.')
      }

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

      const latestLocalMessages = await chatRepository.listLocal(conversation.id)
      setChatMessages(latestLocalMessages.map(chatEntityToCloudMessage))

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
        const latestLocalMessages = await chatRepository.listLocal(activeConversationId)
        setChatMessages(latestLocalMessages.map(chatEntityToCloudMessage))
      }
    } finally {
      setChatIsSending(false)
    }
  }

  function chatCancelQuote(): void {
    const domainState = cancelQuoteInDomain(buildCurrentChatDomainState())

    setChatQuotedMessageId(domainState.quoteMessageId)
    setChatPendingProduct(domainState.pendingProduct)
    updateChatDraftPersistence(
      domainState.draftText,
      domainState.draftImageUris,
      domainState.pendingProduct,
      domainState.quoteMessageId
    )
  }

  function chatCloseFind(): void {
    const domainState = closeFindInDomain(buildCurrentChatDomainState())
    applyChatDomainInteractionState(domainState)
  }

  function chatCloseMediaGallery(): void {
    setChatMediaPreviewUrls([])
    setChatMediaPreviewIndex(0)
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

    applyChatDomainInteractionState(domainState)
    setChatSearchResults([])
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



  async function rebuildChatSearchResultsForQuery(valueInput: string): Promise<void> {
    const query = valueInput.trim()
    const queryLower = query.toLowerCase()

    if (!queryLower) {
      setChatSearchResults([])
      return
    }

    if (chatSearchScopeRef.current === 'InConversation') {
      const results = chatUiMessages
        .map(message => {
          const body = message.body.trim()
          const productTitle = message.product?.title?.trim() || ''
          const searchable = `${body} ${productTitle}`.trim()

          return {
            message,
            searchable
          }
        })
        .filter(item => item.searchable.toLowerCase().includes(queryLower))
        .map(item => {
          const body = item.message.body.trim()
          const productTitle = item.message.product?.title?.trim() || ''
          const snippet = body || productTitle || (item.message.imageUrls.length ? 'Media message' : 'Message')

          return {
            conversationId: activeConversationId || '',
            messageId: item.message.id,
            senderLabel: resolvedSearchSenderLabelForCurrentMessage(item.message),
            snippet,
            createdAtText: item.message.createdAtText,
            matchedInName: false
          }
        })

      setChatSearchResults(results)
      return
    }

    await ensureMerchantSessionLoadedForCloud()

    const traceId = `VM${Date.now()}_${storeId.slice(-4)}`
    await chatRepository.syncMerchantThreadMetaFromCloud(storeId, traceId)

    const cloudThreads = await fetchMerchantThreadsFromChatRepository(traceId)
    const sourceThreads = await buildMerchantThreadsWithLocalMeta(cloudThreads)

    if (sourceThreads.length > 0) {
      setMerchantChatThreads(sourceThreads)
    }

    const threadMap = new Map<string, ChatThreadSummary>()

    sourceThreads.forEach(thread => {
      const conversationId = String(thread.conversationId || '').trim()
      if (!conversationId) return

      threadMap.set(conversationId, thread)
    })

    const localMessages = await chatRepository.listLocalByStore(storeId)

    const messageHits: ChatSearchResult[] = localMessages
      .filter(message => threadMap.has(message.conversationId))
      .map(message => {
        const thread = threadMap.get(message.conversationId) || null
        const snippet = extractMainBodyForChatSearch(message.text)

        return {
          message,
          thread,
          snippet
        }
      })
      .filter(item => item.snippet.toLowerCase().includes(queryLower))
      .map(item => ({
        conversationId: item.message.conversationId,
        messageId: item.message.id,
        senderLabel: resolvedSearchSenderLabelForEntity(item.message, item.thread),
        snippet: item.snippet,
        createdAtText: formatChatCreatedAtText(item.message.timeMs) || '',
        matchedInName: false
      }))

    const nameHits: ChatSearchResult[] = sourceThreads
      .filter(thread => chatSearchThreadTitle(thread).toLowerCase().includes(queryLower))
      .map(thread => ({
        conversationId: thread.conversationId,
        messageId: null,
        senderLabel: resolvedCustomerDisplayNameForChatSearch(thread.conversationId),
        snippet: chatSearchThreadPreview(thread),
        createdAtText: formatChatCreatedAtText(thread.lastMessageAt) || '',
        matchedInName: true
      }))

    const deduped = new Map<string, ChatSearchResult>()

    ;[...messageHits, ...nameHits].forEach(result => {
      const key = `${result.conversationId}:${result.messageId || 'name'}`
      if (!deduped.has(key)) {
        deduped.set(key, result)
      }
    })

    const results = Array.from(deduped.values())
      .sort((left, right) => {
        const leftTime = Date.parse(left.createdAtText) || 0
        const rightTime = Date.parse(right.createdAtText) || 0
        return rightTime - leftTime
      })
      .slice(0, 100)

    setChatSearchResults(results)
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

  function chatOpenThreadFromSearch(conversationId: string, messageId?: string | null): void {
    const threadId = conversationId.trim()
    const targetMessageId = messageId?.trim() || null

    if (chatSearchScopeRef.current === 'InConversation') {
      const closedFindState = closeFindInDomain(buildCurrentChatDomainState())
      const domainState = targetMessageId
        ? jumpToMessageInDomain(closedFindState, targetMessageId)
        : closedFindState

      chatBackTargetRef.current = chatBackTargetBeforeSearchRef.current

      applyChatDomainInteractionState(domainState)
      setPreviousScreen(chatBackTargetBeforeSearchRef.current)
      setScreen(ShowcaseScreens.Chat)
      void syncChat()
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

      if (targetMessageId) {
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
        imageUrl: parsedProduct.imageUrl
      }

      setChatPendingProduct(product)
      setChatDraft('')
      setChatQuotedMessageId(null)
      updateChatDraftPersistence('', chatDraftImageUrls, product, null)
      return
    }

    setChatDraft(value)
    updateChatDraftPersistence(value, chatDraftImageUrls, chatPendingProduct, chatQuotedMessageId)
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
      screen
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
      screen
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

    const dish = dishes.find(item => item.id === dishId)
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

  async function uploadStoreImageIfNeeded(value: File | Blob | string, scope: 'logo' | 'cover'): Promise<string | null> {
    if (typeof value === 'string') {
      const url = value.trim()
      if (!url) return null

      if (!isLocalImageUri(url)) {
        return url
      }

      try {
        const response = await fetch(url)
        if (!response.ok) return null

        const blob = await response.blob()
        const uploaded = await pickAndUploadImage({
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

    return pickAndUploadImage({
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
        priceText: formatUsd(getDishPrice(activeAppointmentDish)),
        imageUrl: resolveDishImage(activeAppointmentDish),
        categoryText: activeAppointmentDish.category || null
      }
    : null

  const adminTodayDateKey = appointmentLocalDateKey(new Date())

  const adminFutureAppointmentCards = appointmentCards.filter(item => {
    return item.preferredDate >= adminTodayDateKey
  })

  const dateFilterOptions = [
    'All',
    ...Array.from(
      new Set(
        adminFutureAppointmentCards
          .map(item => item.preferredDate)
          .filter(Boolean)
      )
    ).sort((left, right) => left.localeCompare(right))
  ]

  const customerFutureAppointmentCards = customerAppointmentCards.filter(item => {
    return item.preferredDate >= adminTodayDateKey
  })

  const customerDateFilterOptions = [
    'All',
    ...Array.from(
      new Set(
        customerFutureAppointmentCards
          .map(item => item.preferredDate)
          .filter(Boolean)
      )
    ).sort((left, right) => left.localeCompare(right)),
    'History'
  ]

  const statusFilterOptions = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-show']

  const selectedAdminHistoryDateForServiceOptions = appointmentAdminHistoryDateFilter?.trim() || ''
  const selectedAdminDateForServiceOptions = selectedAdminHistoryDateForServiceOptions || appointmentAdminDateFilter.trim() || 'All'
  const selectedAdminStatusForServiceOptions = appointmentAdminStatusFilter.trim() || 'All'

  const adminServiceFilterSourceCards = selectedAdminHistoryDateForServiceOptions
    ? appointmentCards.filter(item => item.preferredDate === selectedAdminHistoryDateForServiceOptions)
    : adminFutureAppointmentCards

  const adminServiceFilterOptions = [
    'All',
    ...Array.from(
      new Set(
        adminServiceFilterSourceCards
          .filter(item => {
            return selectedAdminDateForServiceOptions === 'All' ||
              item.preferredDate === selectedAdminDateForServiceOptions
          })
          .filter(item => {
            return selectedAdminStatusForServiceOptions === 'All' ||
              item.statusLabel === selectedAdminStatusForServiceOptions
          })
          .map(item => item.serviceTitle?.trim() || 'General appointment')
          .filter(Boolean)
      )
    )
  ]

  const selectedCustomerDateForServiceOptions = appointmentCustomerDateFilter.trim() || 'All'
  const selectedCustomerStatusForServiceOptions = appointmentCustomerStatusFilter.trim() || 'All'
  const todayForCustomerServiceOptions = appointmentLocalDateKey(new Date())

  function appointmentMatchesCustomerDateFilterForOptions(item: ShowcaseAppointmentCard): boolean {
    if (selectedCustomerDateForServiceOptions === 'History') {
      return item.preferredDate < todayForCustomerServiceOptions
    }

    if (selectedCustomerDateForServiceOptions === 'All') {
      return item.preferredDate >= todayForCustomerServiceOptions
    }

    return item.preferredDate === selectedCustomerDateForServiceOptions
  }

  const customerServiceFilterOptions = [
    'All',
    ...Array.from(
      new Set(
        customerAppointmentCards
          .filter(appointmentMatchesCustomerDateFilterForOptions)
          .filter(item => {
            return selectedCustomerStatusForServiceOptions === 'All' ||
              item.statusLabel === selectedCustomerStatusForServiceOptions
          })
          .map(item => item.serviceTitle?.trim() || 'General appointment')
          .filter(Boolean)
      )
    )
  ]

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

  const homeState: ShowcaseHomeUiState = {
    dishes: homeDishesForUi,
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
    showAnnouncementsDot: bottomBarState.showAnnouncementsDot
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
    subtitle: selectedDish?.descriptionEn?.trim() || null,
    price: formatUsd(selectedDishPrice),
    discountPrice: selectedDishHasDiscount ? formatUsd(selectedDishDiscount) : null,
    description: selectedDish?.descriptionEn || '',
    category: selectedDish?.category?.trim() || null,
    isRecommended: Boolean(selectedDish?.isRecommended),
    isUnavailable: Boolean(selectedDish?.isSoldOut),
    imagePreviewUrl: selectedDishImages[safeDetailImageIndex] || null,
    imageUrls: selectedDishImages,
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

    logoUrl: storeProfileLogoUrl,
    coverUrl: storeProfileCoverUrl,

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
    selectedServiceFilter: appointmentCustomerServiceFilter
  }

  const adminAppointmentsState: ShowcaseAdminAppointmentsUiState = {
    enabled: appointmentsEnabled,
    items: filteredAdminAppointmentCards,
    statusMessage: statusMessage || snackbarMessage,
    isRefreshing: appointmentsRefreshing,

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
    historyDateFilter: appointmentAdminHistoryDateFilter
  }

  const announcementsState: ShowcaseAnnouncementsUiState = {
    bottomBar: bottomBarState,

    title: storeProfileForUi.displayName || 'Announcements',
    items: announcementCards,
    isLoading,
    statusMessage: statusMessage || snackbarMessage,
    focusedAnnouncementId
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
    hasUnsavedChanges: hasUnsavedAdminAnnouncementDraft()
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
    flashMessageId: chatFlashMessageId,
    flashSignal: chatFlashSignal,
    searchResults: buildChatSearchResultsForUi(),
    mediaItems: buildChatMediaItemsForUi(),
    mediaPreviewUrls: chatMediaPreviewUrls,
    mediaPreviewIndex: clampIndex(chatMediaPreviewIndex, chatMediaPreviewUrls.length),
    pinned: chatPinned,
    canTogglePinned: chatRoleForUi === 'merchant'
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

    selectedCategory,
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

    appointmentsEnabled,
    appointmentCount: appointmentRequests.length,
    pendingAppointmentCount: appointmentCards.filter(item => {
      return item.preferredDate >= adminTodayDateKey && item.statusLabel === 'Pending'
    }).length,
    unreadMessageCount: merchantThreadSummaries.reduce((sum, item) => sum + item.unreadCount, 0)
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
    editDishNameZh.trim().length === 0 &&
    editDishNameEn.trim().length === 0

  const editDishPriceRequiredError = editDishShowsRequiredFieldErrors &&
    editDishOriginalPrice.trim().length === 0

  const editDishDescriptionRequiredError = editDishShowsRequiredFieldErrors &&
    editDishDescriptionEn.trim().length === 0

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
    nameZh: editDishNameZh,
    nameEn: editDishNameEn,
    descriptionEn: editDishDescriptionEn,
    category: editDishCategory,
    availableCategories: manualCategories,
    originalPrice: editDishOriginalPrice,
    discountPrice: editDishDiscountPrice,
    isRecommended: editDishRecommended,
    isHidden: editDishHidden,
    imageUrls: editDishImageUrls,
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
      editDishNameZh.trim() ||
      editDishNameEn.trim() ||
      editDishDescriptionEn.trim() ||
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
    storeProfileSaveError,
    storeProfileSaveSuccess,

    chat: chatState,
    merchantChatThreads: merchantThreadSummaries,
    merchantChatListRefreshing,

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
    pushTargetAnnouncementId,

    appointmentsEnabled,
    appointments: appointmentCards as ShowcaseAppointment[],
    appointmentSourceDishId,
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
      void submitAppointmentRequest()
    }
  }

  const customerBookingsActions: ShowcaseCustomerBookingsActions = {
    ...bottomNavigationActions,

    onBackToHome: closeToHome,

    onBack: backFromCustomerBookings,

    onRefresh: () => {
      void refreshCustomerAppointmentsFromCloud()
    },

    onDateFilterChange: onAppointmentCustomerDateFilterChange,

    onStatusFilterChange: onAppointmentCustomerStatusFilterChange,

    onServiceFilterChange: onAppointmentCustomerServiceFilterChange,

    onOpenAppointmentProductDetail: openDetail
  }

  const adminAppointmentsActions: ShowcaseAdminAppointmentsActions = {
    onBackToHome: closeToHome,

    onBack: backFromAdminAppointmentManager,

    onRefresh: () => {
      void refreshAdminAppointmentsFromCloud()
    },

    onEnabledChange: onAppointmentsEnabledChange,

    onBookingWindowDaysChange: onAppointmentBookingWindowDaysChange,

    onAvailableHoursTextChange: onAppointmentAvailableHoursTextChange,

    onSlotIntervalMinutesChange: onAppointmentSlotIntervalMinutesChange,

    onClosedDayToggle: onAppointmentClosedDayToggle,

    onMinimumNoticeChange: onAppointmentMinimumNoticeChange,

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
      void updateAppointmentStatus(id, 'Pending')
    },

    onConfirm: id => {
      void updateAppointmentStatus(id, 'Confirmed')
    },

    onCancel: id => {
      void updateAppointmentStatus(id, 'Cancelled')
    },

    onComplete: id => {
      void updateAppointmentStatus(id, 'Completed')
    },

    onNoShow: id => {
      void updateAppointmentStatus(id, 'No-show')
    }
  }

  const announcementsActions: ShowcaseAnnouncementsActions = {
    ...bottomNavigationActions,

    onBackToHome: closeToHome,

    onBack: backFromAnnouncements,

    onRefresh: () => {
      void refreshAnnouncements()
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

    onDeleteSelected: onAdminAnnouncementDeleteSelected
  }

  const chatActions: ShowcaseChatActions = {
    ...bottomNavigationActions,

    onUseProductCardAsPending: chatUseProductCardAsPending,

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

    onOpenProductDetail: openProductFromChat,

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

    onSavePreviewImage: savePreviewImage
  }

  const merchantChatListActions: ShowcaseMerchantChatListActions = {
    onBackToHome: closeMerchantChatListToHome,

    onBack: backFromMerchantChatList,

    onRefresh: () => {
      void refreshMerchantChatListByUser()
    },

    onOpenThread: (threadId, title) => {
      void openMerchantThread(threadId, title)
    },

    onDeleteThread: threadId => {
      void merchantChatListDeleteThread(threadId)
    },

    onTogglePin: (threadId, pinned) => {
      void merchantChatListTogglePin(threadId, pinned)
    },

    onMarkRead: threadId => {
      void merchantChatListMarkRead(threadId)
    },

    onRenameThread: merchantChatListRenameThread
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

    onItemsSortModeChange: onAdminItemsSortModeChange,

    onItemsSearchQueryChange: onAdminItemsSearchQueryChange,

    onClearItemsSearchQuery: clearAdminItemsSearchQuery,

    onItemsFilterRecommendedChange: onAdminItemsFilterRecommendedChange,

    onItemsFilterHiddenOnlyChange: onAdminItemsFilterHiddenOnlyChange,

    onItemsFilterDiscountOnlyChange: onAdminItemsFilterDiscountOnlyChange,

    onPriceMinDraftChange: onAdminItemsPriceMinDraftChange,

    onPriceMaxDraftChange: onAdminItemsPriceMaxDraftChange,

    onApplyPriceRange: onAdminItemsApplyPriceRange,

    onClearPriceRange: onAdminItemsClearPriceRange,

    onSelectCategory: onCategorySelected,

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
  void merchantChatListMarkRead
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

    homeState,
    homeActions,

    loginState,
    loginActions,

    adminState,
    adminActions,

    editDishState,
    editDishActions,

    detailState: showcaseWiring.detail || detailState,
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