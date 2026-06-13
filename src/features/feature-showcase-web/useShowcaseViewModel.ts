'use client'

import {
  getNdjcPushRegistrationTokenForCurrentBrowser,
  type NdjcPushRegistrationTokenResult
} from '@/pwa/webPushRegistration'
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
  type CloudStorePwaProfile,
  type CloudStoreServiceStatus,
  type MerchantAuthSession,
  type MerchantStoreMembership,
  type ShowcaseCloudRepository
} from './showcaseCloudRepository'
import {
  SHOWCASE_APP_VERSION,
  SHOWCASE_OFFICIAL_WEBSITE_URL,
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
  cleanupShowcaseBusinessCache,
  loadShowcaseBusinessCache,
  saveShowcaseBusinessCache
} from './showcaseBusinessIndexedDb'
import {
  loadShowcasePendingSyncQueue,
  saveShowcasePendingSyncQueue
} from './showcasePendingSyncIndexedDb'
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
  restoreShowcaseAuthSession,
  type ShowcaseAuthSessionSnapshot
} from './showcaseAuthSessionManager'
import {
  formatShowcaseDateAndTimeParts,
  formatShowcaseDateTime,
  parseShowcaseDateInput
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
  buildThreadPreview,
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
  ShowcaseStoreUnavailableUiState,
  ShowcaseSyncOverviewState,
  ShowcaseUiModel,
  ShowcaseUiState,
  SyncOverviewState
} from './showcaseUiContract'

import {
  type UseShowcaseViewModelInput,
  type PendingSyncStatus,
  type PendingSyncMetadata,
  type PendingSyncOperation,
  type PendingDeleteCategoryDialog,
  type ChatSearchResult,
  type ChatMediaItem,
  type ChatMode,
  type ChatMessageWindowRuntimeState,
  type ShowcasePaginationRuntimeState,
  type AppointmentCloudQueryFilters,
  type DishCloudQueryFilters,
  type DraftExtraContact,
  type DraftAnnouncement,
  type LocalTempImageRecord,
  type LocalFavoriteStore,
  type LocalChatDraftStore,
  type ShowcaseImageVariantName,
  type ShowcaseImageVariantSpec,
  type UploadedShowcaseImage,
  type ShowcaseDishPriceTextSnapshot,
  CHAT_LATEST_WINDOW_MAX_MESSAGES,
  CHAT_AROUND_MESSAGE_WINDOW_MAX_MESSAGES,
  SHOWCASE_CLIENT_ID_KEY,
  SHOWCASE_FAVORITES_KEY,
  SHOWCASE_CHAT_DRAFT_KEY,
  SHOWCASE_STORE_PROFILE_DRAFT_KEY,
  SHOWCASE_VIEWED_ANNOUNCEMENT_IDS_KEY,
  SHOWCASE_COUNTED_ANNOUNCEMENT_CLICK_IDS_KEY,
  SHOWCASE_PUBLISHED_ANNOUNCEMENTS_KEY,
  SHOWCASE_ITEM_EDITOR_DRAFT_KEY,
  SHOWCASE_ADMIN_ANNOUNCEMENT_EDITOR_DRAFT_KEY,
  SHOWCASE_LOCAL_TEMP_IMAGES_KEY,
  SHOWCASE_PENDING_CHAT_CAMERA_KEY,
  NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY,
  DEFAULT_CUSTOMER_NAME,
  DEFAULT_CHAT_INPUT_PLACEHOLDER,
  DEFAULT_APPOINTMENT_STATUS,
  LOCAL_TEMP_IMAGE_MAX_AGE_MS,
  NDJC_CHAT_VISIBILITY_HEARTBEAT_MS,
  isBrowser,
  canUseLocalStorage,
  postChatVisibilityToServiceWorker,
  nowMillis,
  createUuidLikeId,
  createId,
  createPwaDeviceInstallId,
  getOrCreatePwaDeviceInstallId,
  normalizeStoreId,
  normalizeText,
  normalizeNullableText,
  normalizeNumber,
  normalizeBoolean,
  readJson,
  writeJson,
  appointmentsStorageKey,
  loadAppointmentsFromStorage,
  saveAppointmentsToStorage,
  appointmentStatusAlertSeenStorageKey,
  appointmentStatusAlertKey,
  isCustomerBookingAlertStatus,
  loadSeenAppointmentStatusAlertKeys,
  saveSeenAppointmentStatusAlertKeys,
  removeStoredValue,
  readClientId,
  readRememberMe,
  writeRememberMe,
  readMerchantSession,
  writeMerchantSession,
  readFavoriteIds,
  writeFavoriteIds,
  readChatDraft,
  writeChatDraft,
  clearChatDraft,
  loadViewedAnnouncementIdsLocally,
  saveViewedAnnouncementIdsLocally,
  loadCountedAnnouncementClickIdsLocally,
  saveCountedAnnouncementClickIdsLocally,
  toCachedPublishedAnnouncement,
  fromCachedPublishedAnnouncement,
  loadPublishedAnnouncementsLocally,
  loadDishesFromIndexedDb,
  loadStoreProfileFromIndexedDb,
  loadPublishedAnnouncementsFromIndexedDb,
  loadAppointmentsFromIndexedDb,
  persistDishesLocally,
  persistStoreProfileLocally,
  persistAppointmentsLocally,
  persistPublishedAnnouncementsLocally,
  pruneAnnouncementMarksWhenCompletePageLoaded,
  pruneBookingSeenWhenCompletePageLoaded,
  loadItemEditorDraftLocally,
  persistItemEditorDraftLocally,
  clearItemEditorDraftLocally,
  loadAdminAnnouncementEditorDraftLocally,
  persistAdminAnnouncementEditorDraftLocally,
  clearAdminAnnouncementEditorDraftLocally,
  loadLocalTempImages,
  saveLocalTempImages,
  rememberLocalTempImage,
  revokeLocalObjectUrl,
  isLocalImageUri,
  isAppOwnedLocalFileUri,
  clearLocalTempImagesByScope,
  clearEditDraftLocalImages,
  clearAdminAnnouncementDraftLocalImages,
  clearStoreProfileDraftLocalImages,
  deleteLocalFileUri,
  deleteAppOwnedLocalFileUri,
  clearExpiredLocalTempFiles,
  createTempCameraUri,
  deletePendingChatCameraFile,
  prepareChatCameraCapture,
  PRODUCT_IMAGE_LONG_EDGE,
  PRODUCT_IMAGE_JPEG_QUALITY,
  PRODUCT_IMAGE_MEDIUM_LONG_EDGE,
  PRODUCT_IMAGE_THUMB_LONG_EDGE,
  PRODUCT_IMAGE_BLUR_LONG_EDGE,
  CHAT_IMAGE_LONG_EDGE,
  CHAT_IMAGE_JPEG_QUALITY,
  CHAT_IMAGE_MEDIUM_LONG_EDGE,
  CHAT_IMAGE_THUMB_LONG_EDGE,
  CHAT_IMAGE_BLUR_LONG_EDGE,
  ANNOUNCEMENT_IMAGE_LONG_EDGE,
  ANNOUNCEMENT_IMAGE_JPEG_QUALITY,
  ANNOUNCEMENT_IMAGE_MEDIUM_LONG_EDGE,
  ANNOUNCEMENT_IMAGE_THUMB_LONG_EDGE,
  ANNOUNCEMENT_IMAGE_BLUR_LONG_EDGE,
  STORE_COVER_IMAGE_LONG_EDGE,
  STORE_COVER_IMAGE_JPEG_QUALITY,
  STORE_COVER_IMAGE_MEDIUM_LONG_EDGE,
  STORE_COVER_IMAGE_THUMB_LONG_EDGE,
  STORE_COVER_IMAGE_BLUR_LONG_EDGE,
  STORE_LOGO_IMAGE_LONG_EDGE,
  STORE_LOGO_IMAGE_JPEG_QUALITY,
  STORE_LOGO_IMAGE_MEDIUM_LONG_EDGE,
  STORE_LOGO_IMAGE_THUMB_LONG_EDGE,
  STORE_LOGO_IMAGE_BLUR_LONG_EDGE,
  normalizeImageContentType,
  imageExtensionFromContentType,
  uploadImageProfileForBucket,
  buildImageUploadFileName,
  compressImage,
  createRemoteOnlyImageVariants,
  buildImageVariantSpecs,
  buildImageVariantFileName,
  blobToDataImageUrl,
  clearStoredMerchantSession,
  persistMerchantSession,
  persistFavoritesToStorage,
  readPersistedStoreProfileDraft,
  writePersistedStoreProfileDraft,
  formatUsd,
  buildDishPriceTextSnapshot,
  buildChatProductShareFromDish,
  encodeAppointmentPriceSnapshotFromDish,
  decodeAppointmentPriceSnapshot,
  formatPlainNumber,
  formatDateTimeText,
  formatChatCreatedAtText,
  getChatMessageWindowBounds,
  formatDateLabel,
  normalizeSortMode,
  resolveDishImages,
  resolveDishImage,
  clampIndex,
  sortDishes,
  hasDiscount,
  parseHomePriceDraft,
  syncStateForCloudItem,
  manualCategoryNamesToCloudCategories,
  cloudCategoriesToManualCategoryNames,
  mergeCloudAndDishCategoryNames,
  normalizePendingSyncStatus,
  normalizePendingSyncOperation,
  nextPendingSyncRetryDelayMs,
  shouldAttemptPendingSyncOperation,
  buildPendingDishSyncOperations,
  legacyPendingSyncStorageKey,
  parsePendingSyncOperation,
  loadLegacyPendingSyncOperationsFromStorage,
  clearLegacyPendingSyncOperationsFromStorage,
  parsePendingSyncOperationsFromUnknownList,
  savePendingSyncOperationsToIndexedDb,
  mergePendingSyncOperations,
  replaceDishPendingSyncOperationsInQueue,
  cloudAnnouncementToCard,
  appointmentsStatusFromCloud,
  appointmentsStatusToCloud,
  canCustomerCancelAppointmentStatus,
  appointmentCloudStatusFilterFromUi,
  appointmentCloudCancelledByFilterFromUi,
  appointmentCloudCancelledByNotFilterFromUi,
  appointmentCloudServiceFilterFromUi,
  appointmentCloudDateFiltersFromUi,
  appointmentStatusPushTitle,
  cloudAppointmentToUi,
  appointmentToCard,
  chatMessageToUiMessage,
  chatThreadSummaryToUi,
  storeProfileFromCloud,
  storeProfileFromCachedProfile,
  storeProfileDraftFromProfile,
  mapCloudPlanType,
  buildCloudStatusLabel,
  parseCloudIsoMillis,
  formatCloudDateTimeLabel,
  buildCloudDaysRemainingLabel,
  cloudStatusToUi,
  categoryOptionsFromDishes,
  allTagsFromDishes,
  dishFilterRowsToTags,
  mapFavoriteCard,
  defaultAppointmentSettings,
  appointmentTimeToMinutes,
  appointmentMinutesToTime,
  appointmentMinimumNoticeToMillis,
  appointmentClosedDayKey,
  appointmentLocalDateKey,
  customerAppointmentDateOptions,
  customerAppointmentTimeOptionsForDate,
  buildAppointmentDateOptions,
  buildAppointmentTimeOptions,
  buildDefaultConversationId,
  decorateCloudHomeResults,
  toShowcaseHomeDish,
  NDJC_VM_TRACE_ENABLED,
  ndjcTrace,
  ndjcTraceError
} from './view-model/showcaseViewModelUtils'
import { createShowcaseStoreProfileActions } from './view-model/useShowcaseStoreProfileActions'
import { createShowcaseCatalogActions } from './view-model/useShowcaseCatalogActions'
import { createShowcaseBookingActions } from './view-model/useShowcaseBookingActions'
import { createShowcaseAnnouncementActions } from './view-model/useShowcaseAnnouncementActions'
import { createShowcaseChatActionObjects } from './view-model/useShowcaseChatActions'
import { useShowcaseBootstrapModule } from './view-model/useShowcaseBootstrapModule'

export type { ShowcaseScreenName } from './showcaseUiContract'
export type { UseShowcaseViewModelInput } from './view-model/showcaseViewModelUtils'

function bookingsEntryDotVisibleStorageKey(storeId: string, clientId: string): string {
  return `ndjc_showcase_bookings_entry_dot_${normalizeStoreId(storeId)}_${clientId.trim()}`
}

function loadBookingsEntryDotVisibleLocally(storeId: string, clientId: string): boolean {
  const normalizedClientId = clientId.trim()

  if (!normalizedClientId) return false

  return readJson<boolean>(bookingsEntryDotVisibleStorageKey(storeId, normalizedClientId), false) === true
}

function saveBookingsEntryDotVisibleLocally(storeId: string, clientId: string, visible: boolean): void {
  const normalizedClientId = clientId.trim()

  if (!normalizedClientId) return

  writeJson(bookingsEntryDotVisibleStorageKey(storeId, normalizedClientId), visible)
}

function adminUnreadMessageCountStorageKey(storeId: string): string {
  return `ndjc_showcase_admin_unread_message_count_${normalizeStoreId(storeId)}`
}

function adminPendingAppointmentCountStorageKey(storeId: string): string {
  return `ndjc_showcase_admin_pending_appointment_count_${normalizeStoreId(storeId)}`
}

function loadAdminUnreadMessageCountLocally(storeId: string): number {
  const value = readJson<number>(adminUnreadMessageCountStorageKey(storeId), 0)

  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
}

function saveAdminUnreadMessageCountLocally(storeId: string, count: number): void {
  const safeCount = Number.isFinite(count) && count > 0 ? Math.floor(count) : 0

  writeJson(adminUnreadMessageCountStorageKey(storeId), safeCount)
}

function loadAdminPendingAppointmentCountLocally(storeId: string): number {
  const value = readJson<number>(adminPendingAppointmentCountStorageKey(storeId), 0)

  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
}

function saveAdminPendingAppointmentCountLocally(storeId: string, count: number): void {
  const safeCount = Number.isFinite(count) && count > 0 ? Math.floor(count) : 0

  writeJson(adminPendingAppointmentCountStorageKey(storeId), safeCount)
}


export function useShowcaseViewModel(input: UseShowcaseViewModelInput = {}): ShowcaseUiModel {
  const storeId = normalizeStoreId(input.storeId)
  const assemblyAppName = normalizeNullableText(input.appName)
  const assemblyMerchantEmail = normalizeNullableText(input.merchantEmail)
  const assemblyPrivacyUrl = normalizeNullableText(input.privacyUrl)
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
  const initialMerchantLoginNameRef = useRef<string>(readLastMerchantLoginName(storeId))
  const initialClientIdRef = useRef<string>(readClientId())
  const defaultUiState = useMemo(() => createDefaultShowcaseUiState(), [])
  const defaultChatUiState = useMemo(() => createDefaultShowcaseChatUiState(), [])

  const [screen, setScreen] = useState<ShowcaseScreenName>(input.initialScreen || defaultUiState.screen)
  const [previousScreen, setPreviousScreen] = useState<ShowcaseScreenName>(defaultUiState.screen)
  const [editDishPendingExitTarget, setEditDishPendingExitTarget] = useState<'back' | 'home' | null>(null)
  const [storeProfilePendingExitTarget, setStoreProfilePendingExitTarget] = useState<'back' | 'home' | null>(null)
  const [adminAnnouncementPendingExitTarget, setAdminAnnouncementPendingExitTarget] = useState<'back' | 'home' | null>(null)
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
        clearStoredMerchantSession(storeId)
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
        clearStoredMerchantSession(storeId)
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
        expiresAt: authSession.expiresAt || currentSession.expiresAt,
        storeId
      }

      writeMerchantSession(storeId, nextSession)
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

    let refreshInFlight = false

    const canAttemptResumeRefresh = (): boolean => {
      return Boolean(
        isAdminLoggedIn ||
        merchantSessionRef.current?.accessToken ||
        readMerchantSession(storeId)?.accessToken ||
        readRememberMe(storeId)
      )
    }

    const runResumeRefresh = (): void => {
      if (refreshInFlight) return
      if (!canAttemptResumeRefresh()) return

      refreshInFlight = true

      void refreshMerchantSessionForPwaResume().finally(() => {
        refreshInFlight = false
      })
    }

    const handleOnline = (): void => {
      runResumeRefresh()
    }

    const handleLifecycle = (event: Event): void => {
      const detail = event instanceof CustomEvent
        ? event.detail as ShowcaseAppLifecycleDetail | null
        : null

      if (!detail || detail.phase !== 'foreground') return

      runResumeRefresh()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener(NDJC_SHOWCASE_APP_LIFECYCLE_EVENT, handleLifecycle)

    runResumeRefresh()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener(NDJC_SHOWCASE_APP_LIFECYCLE_EVENT, handleLifecycle)
    }
  }, [
    isAdminLoggedIn,
    merchantSession?.accessToken,
    merchantSession?.authUserId,
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

    return sortedHomeDishesForDisplay(sourceItems.filter(item => !item.isHidden))
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
    const legacyOperations = loadLegacyPendingSyncOperationsFromStorage(storeId)
    const dishOperations = buildPendingDishSyncOperations(loadDishesFromStorage(storeId))

    return mergePendingSyncOperations(legacyOperations, dishOperations)
  })
  const pendingSyncIndexedDbHydratedRef = useRef(false)
  const pendingSyncRetryInFlightRef = useRef(false)
  const pendingSyncOperationsRef = useRef<PendingSyncOperation[]>(pendingSyncOperations)
  const lifecycleRecoveryInFlightRef = useRef(false)
  const lastLifecycleRecoveryAtRef = useRef(0)
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
  const [loginRememberMeDraft, setLoginRememberMeDraft] = useState(readRememberMe(storeId))
  const [loginError, setLoginError] = useState<string | null>(defaultUiState.loginError)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  const [changePasswordCurrentDraft, setChangePasswordCurrentDraft] = useState(defaultUiState.changePasswordCurrentDraft)
  const [changePasswordNewDraft, setChangePasswordNewDraft] = useState(defaultUiState.changePasswordNewDraft)
  const [changePasswordConfirmDraft, setChangePasswordConfirmDraft] = useState(defaultUiState.changePasswordConfirmDraft)
  const [changePasswordError, setChangePasswordError] = useState<string | null>(defaultUiState.changePasswordError)
  const [changePasswordSuccess, setChangePasswordSuccess] = useState<string | null>(defaultUiState.changePasswordSuccess)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [storeUnavailable, setStoreUnavailable] = useState(false)
  const [storeProfileCloud, setStoreProfileCloud] = useState<CloudStoreProfile | null>(null)
  const [storePwaProfileCloud, setStorePwaProfileCloud] = useState<CloudStorePwaProfile | null>(null)
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
  const isEditingStoreProfileRef = useRef(defaultUiState.isEditingStoreProfile)
  const storeProfileDraftDirtyRef = useRef(false)
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
  const itemEditorImageDraftDirtyRef = useRef(false)
  const [isSavingEditDish, setIsSavingEditDish] = useState(defaultUiState.isSavingEditDish)
  const [isBlockingEditDish, setIsBlockingEditDish] = useState(defaultUiState.isBlockingEditDish)
  const [editValidationError, setEditValidationError] = useState<string | null>(defaultUiState.editValidationError)

  useEffect(() => {
    isEditingStoreProfileRef.current = isEditingStoreProfile
  }, [isEditingStoreProfile])

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
  const [adminPendingAppointmentCountSnapshot, setAdminPendingAppointmentCountSnapshot] = useState(() => {
    return loadAdminPendingAppointmentCountLocally(storeId)
  })
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
  const [focusedAdminAppointmentId, setFocusedAdminAppointmentId] = useState<string | null>(null)
  const [focusedCustomerAppointmentId, setFocusedCustomerAppointmentId] = useState<string | null>(null)
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
  const [bookingsEntryDotVisible, setBookingsEntryDotVisible] = useState(() => {
    return loadBookingsEntryDotVisibleLocally(storeId, clientId)
  })
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

  type PendingShowcasePushRoute = {
    type: 'chat' | 'announcement' | 'appointment'
    pushType?: string | null
    conversationId?: string | null
    announcementId?: string | null
    appointmentId?: string | null
    appointmentStatus?: string | null
    targetClientId?: string | null
    openAs?: string | null
    source?: string | null
  }

  const [pendingPushRoute, setPendingPushRoute] = useState<PendingShowcasePushRoute | null>(null)
  const pendingPushRouteRef = useRef<PendingShowcasePushRoute | null>(null)
  const merchantAuthRestoredRef = useRef(false)
  const pushRouteConsumingRef = useRef(false)
  const handlePushRouteRef = useRef<((route: PendingShowcasePushRoute) => Promise<void>) | null>(null)
  const [focusedAnnouncementId, setFocusedAnnouncementId] = useState<string | null>(null)

  const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null)
  const [activeConversationId, setActiveConversationId] = useState<string>(() => buildDefaultConversationId(storeId, initialClientIdRef.current))
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [merchantChatThreads, setMerchantChatThreads] = useState<ChatThreadSummary[]>([])
  const [adminUnreadMessageCountSnapshot, setAdminUnreadMessageCountSnapshot] = useState(() => {
    return loadAdminUnreadMessageCountLocally(storeId)
  })
  const adminUnreadMessageCountHydrationReadyRef = useRef(false)
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
  const merchantChatListBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Home)
  const changePasswordBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Admin)
  const storeProfileBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Home)
  const announcementsBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Home)
  const chatBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Home)
  const chatSearchBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Chat)
  const chatBackTargetBeforeSearchRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Chat)
  const chatMediaBackTargetRef = useRef<ShowcaseScreenName>(ShowcaseScreens.Chat)
  const chatSearchScopeRef = useRef<'InConversation' | 'InExistingThreads'>('InConversation')
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
  const appointmentClientPushRegistrationKeyRef = useRef('')
  const pushRegistrationThrottleAtRef = useRef<Record<string, number>>({})
  const activeConversationIdRef = useRef(activeConversationId)
  const chatIsOpeningRef = useRef(false)
  const chatRestoreSeqRef = useRef(0)
  const chatSyncScopeRef = useRef<string | null>(null)
  const chatMessageLoadSeqRef = useRef(0)
  const chatSearchLoadSeqRef = useRef(0)
  const chatMediaLoadSeqRef = useRef(0)
  const chatContextSnapshotRef = useRef<{
    conversationId: string
    previousScreen: ShowcaseScreenName
    isAdmin: boolean
    focusedMessageId: string | null
  } | null>(null)
  function beginChatRestoreTask(): number {
    chatRestoreSeqRef.current += 1
    return chatRestoreSeqRef.current
  }

  function invalidateChatRestoreTasks(): void {
    chatRestoreSeqRef.current += 1
  }

  function isCurrentChatRestoreTask(restoreSeq: number): boolean {
    return chatRestoreSeqRef.current === restoreSeq
  }

  function isStillActiveChatTarget(role: 'merchant' | 'user', conversationId: string): boolean {
    const activeId = activeConversationIdRef.current.trim()

    return currentChatRole() === role && activeId === conversationId
  }

  function resolveMerchantClientIdForConversation(conversationIdInput: string): string | null {
    const conversationId = conversationIdInput.trim()
    if (!conversationId) return null

    if (activeConversation?.id === conversationId && activeConversation.clientId) {
      return activeConversation.clientId
    }

    const thread = merchantChatThreads.find(item => item.conversationId === conversationId)

    if (thread?.clientId) {
      return thread.clientId
    }

    return extractClientIdFromConversationId(conversationId)
  }


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
    return mergeCloudAndDishCategoryNames(categories, dishes)
  }, [categories, dishes])

  const adminCategories = useMemo(() => {
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

    const cachedDishes = sortedHomeDishesForDisplay(
      loadDishesFromStorage(storeId).filter(item => !item.isHidden)
    )

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

  const appointmentCardsById = useMemo(() => {
    const result = new Map<string, ShowcaseAppointmentCard>()

    appointmentCards.forEach(item => {
      const id = item.id.trim()

      if (id) {
        result.set(id, item)
      }
    })

    return result
  }, [appointmentCards])

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

  function setBookingsEntryDotVisibleAndPersist(
    value: boolean | ((current: boolean) => boolean)
  ): void {
    setBookingsEntryDotVisible(current => {
      const next = typeof value === 'function'
        ? Boolean(value(current))
        : Boolean(value)

      saveBookingsEntryDotVisibleLocally(storeId, clientId, next)

      return next
    })
  }

  function updateAdminPendingAppointmentCountSnapshotFromItems(items: CloudAppointmentRequest[]): void {
    const todayDateKey = appointmentLocalDateKey(new Date())
    const nextCount = items.filter(item => {
      return item.preferredDate >= todayDateKey && appointmentsStatusFromCloud(item.status) === 'Pending'
    }).length

    setAdminPendingAppointmentCountSnapshot(nextCount)
    saveAdminPendingAppointmentCountLocally(storeId, nextCount)
  }

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
    setBookingsEntryDotVisibleAndPersist(false)
  }, [screen, customerAppointmentCards, storeId, clientId])

  const announcementCards = useMemo<ShowcaseAnnouncementCard[]>(() => {
    return announcements.map(cloudAnnouncementToCard)
  }, [announcements])

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
      const hydratedAppointment = ui.appointment
        ? hydrateChatAppointmentShareFromCard(ui.appointment)
        : null

      return {
        ...ui,
        appointment: hydratedAppointment,
        selected: chatSelectedMessageIds.includes(message.id)
      }
    })
  }, [activeChatProductMap, chatMessages, chatSelectedMessageIds, chatMode, appointmentCardsById])

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
    if (!adminUnreadMessageCountHydrationReadyRef.current) {
      adminUnreadMessageCountHydrationReadyRef.current = true
      return
    }

    const nextCount = merchantChatThreads.reduce((sum, item) => {
      return sum + Math.max(0, Number(item.unreadCount || 0))
    }, 0)

    setAdminUnreadMessageCountSnapshot(nextCount)
    saveAdminUnreadMessageCountLocally(storeId, nextCount)
  }, [merchantChatThreads, storeId])

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

  function sortedHomeDishesForDisplay(items: DemoDish[]): DemoDish[] {
    return items.slice().sort((left, right) => {
      const leftCreatedAt = Number(left.createdAt ?? left.updatedAt ?? 0)
      const rightCreatedAt = Number(right.createdAt ?? right.updatedAt ?? 0)
      const createdDiff = leftCreatedAt - rightCreatedAt

      if (createdDiff !== 0) return createdDiff

      return String(left.id || '').localeCompare(String(right.id || ''))
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

  useEffect(() => {
    if (input.previewMode === false) return

    let cancelled = false

    async function hydrateBusinessCacheFromIndexedDb(): Promise<void> {
      await cleanupShowcaseBusinessCache(storeId)

      const [
        cachedDishes,
        cachedProfile,
        cachedAnnouncements,
        cachedAppointments
      ] = await Promise.all([
        loadDishesFromIndexedDb(storeId),
        loadStoreProfileFromIndexedDb(storeId),
        loadPublishedAnnouncementsFromIndexedDb(storeId),
        loadAppointmentsFromIndexedDb(storeId)
      ])

      if (cancelled) return

      if (cachedDishes.length) {
        const effectiveDishes = cachedDishes.filter(item => isAdminLoggedIn || !item.isHidden)
        const manualCategories = loadManualCategoriesFromStorage(storeId)
        const categoryNames = deriveCategoriesFromModels(effectiveDishes, manualCategories)

        mergeDishEntities(effectiveDishes)
        setDishes(effectiveDishes)
        refreshFavoritesList(effectiveDishes)
        setHomeDishIds(dishIdsFromItems(effectiveDishes.filter(item => !item.isHidden)))
        setAdminItemIds(dishIdsFromItems(cachedDishes))
        setCategories(manualCategoryNamesToCloudCategories(categoryNames))
      }

      if (cachedProfile) {
        const profileForUi = storeProfileFromCachedProfile(cachedProfile)

        setStoreProfile(profileForUi)
        setStoreProfileServices(cachedProfile.services)
        setStoreProfileExtraContacts(cachedProfile.extraContacts.map((item, index) => ({
          id: `indexed_extra_contact_${index + 1}`,
          name: item.name,
          value: item.value
        })))
        setStoreProfileCoverUrl(cachedProfile.coverUrl || '')
        setStoreProfileLogoUrl(cachedProfile.logoUrl || '')

        if (!isEditingStoreProfile) {
          setStoreProfileDraft(storeProfileDraftFromProfile(profileForUi))
          setDraftStoreProfileServices(cachedProfile.services)
          setDraftStoreProfileExtraContacts(cachedProfile.extraContacts.map((item, index) => ({
            id: `indexed_draft_extra_contact_${index + 1}`,
            name: item.name,
            value: item.value
          })))
          setDraftStoreProfileCoverUrl(cachedProfile.coverUrl || '')
          setDraftStoreProfileLogoUrl(cachedProfile.logoUrl || '')
          setDraftStoreProfileDescription(cachedProfile.description || '')
          setDraftBusinessStatus(cachedProfile.businessStatus || '')
        }
      }

      if (cachedAnnouncements.length) {
        const published = cachedAnnouncements
          .filter(item => item.status === 'published')
          .sort((left, right) => {
            return (right.updatedAt || right.createdAt || 0) - (left.updatedAt || left.createdAt || 0)
          })

        setAnnouncements(published)
        setAnnouncementsEntryDotVisible(computeAnnouncementsEntryDot(published))
      }

      if (cachedAppointments.length) {
        const sortedAppointments = sortedAppointmentsForStorage(cachedAppointments)

        setAppointmentRequests(sortedAppointments)
        void hydrateAppointmentLinkedDishesFromRequests(sortedAppointments)
      }
    }

    void hydrateBusinessCacheFromIndexedDb()

    return () => {
      cancelled = true
    }
  }, [
    input.previewMode,
    isAdminLoggedIn,
    isEditingStoreProfile,
    storeId
  ])

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
      const orderedHomeItems = filtersInput.sortMode === 'Default'
        ? sortedHomeDishesForDisplay(sourceItems)
        : sourceItems
      const merged = sortedDishesForStorage(sourceItems)

      mergeDishEntities(merged)
      setHomeDishIds(dishIdsFromItems(orderedHomeItems))
      setDishes(merged)
      refreshFavoritesList(merged)
      replaceDishPendingSyncOperations(merged)
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
        const orderedHomeItems = sortMode === 'Default'
          ? sortedHomeDishesForDisplay(localVisibleDishes)
          : localVisibleDishes
        const merged = sortedDishesForStorage(localVisibleDishes)

        mergeDishEntities(merged)
        setHomeDishIds(dishIdsFromItems(orderedHomeItems))
        setDishes(merged)
        refreshFavoritesList(merged)
        replaceDishPendingSyncOperations(merged)
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
          replaceDishPendingSyncOperations(merged)
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
      replaceDishPendingSyncOperations(merged)
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
        replaceDishPendingSyncOperations(merged)
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

  function applySyncOverviewFromPendingOperations(operations: PendingSyncOperation[]): void {
    if (!operations.length) {
      setSyncOverviewState(SyncOverviewStates.Idle)
      setSyncErrorMessage(null)
      return
    }

    if (operations.some(operation => operation.status === 'syncing')) {
      setSyncOverviewState(SyncOverviewStates.Syncing)
      return
    }

    if (operations.some(operation => operation.status === 'failed')) {
      setSyncOverviewState(SyncOverviewStates.Failed)
      return
    }

    setSyncOverviewState(SyncOverviewStates.HasPending)
  }

  function pushPendingSync(op: PendingSyncOperation): void {
    setPendingSyncOperations(current => {
      const normalized = normalizePendingSyncOperation({
        ...op,
        status: 'pending',
        retryCount: 0,
        lastError: null,
        nextRetryAt: null,
        updatedAt: nowMillis()
      } as PendingSyncOperation)

      const next = current.some(item => item.id === normalized.id)
        ? current.map(item => item.id === normalized.id ? normalized : item)
        : [...current, normalized]

      savePendingSyncOperationsToIndexedDb(storeId, next)
      applySyncOverviewFromPendingOperations(next)

      return next
    })

    setLastRetryOp(ShowcaseRetryOps.RetryPendingSync)
  }

  function markPendingSyncing(id: string): void {
    setPendingSyncOperations(current => {
      const next = current.map(item => {
        if (item.id !== id) return item

        return normalizePendingSyncOperation({
          ...item,
          status: 'syncing',
          lastError: null,
          updatedAt: nowMillis()
        } as PendingSyncOperation)
      })

      savePendingSyncOperationsToIndexedDb(storeId, next)
      applySyncOverviewFromPendingOperations(next)

      return next
    })
  }

  function markPendingSyncFailed(id: string, errorMessage: string): void {
    setPendingSyncOperations(current => {
      const now = nowMillis()
      const next = current.map(item => {
        if (item.id !== id) return item

        const retryCount = Math.max(0, Number(item.retryCount || 0)) + 1

        return normalizePendingSyncOperation({
          ...item,
          status: 'failed',
          retryCount,
          lastError: errorMessage,
          nextRetryAt: now + nextPendingSyncRetryDelayMs(retryCount),
          updatedAt: now
        } as PendingSyncOperation)
      })

      savePendingSyncOperationsToIndexedDb(storeId, next)
      applySyncOverviewFromPendingOperations(next)

      return next
    })
  }

  function removePendingSync(id: string): void {
    setPendingSyncOperations(current => {
      const next = current.filter(item => item.id !== id)

      savePendingSyncOperationsToIndexedDb(storeId, next)
      applySyncOverviewFromPendingOperations(next)

      return next
    })
  }

  function replaceDishPendingSyncOperations(dishesInput: DemoDish[]): void {
    setPendingSyncOperations(current => {
      const next = replaceDishPendingSyncOperationsInQueue(current, dishesInput)

      savePendingSyncOperationsToIndexedDb(storeId, next)
      applySyncOverviewFromPendingOperations(next)

      return next
    })
  }

  useEffect(() => {
    let cancelled = false

    async function hydratePendingSyncQueueFromIndexedDb(): Promise<void> {
      const [
        indexedDbOperationsRaw,
        legacyOperations
      ] = await Promise.all([
        loadShowcasePendingSyncQueue(storeId),
        Promise.resolve(loadLegacyPendingSyncOperationsFromStorage(storeId))
      ])

      if (cancelled) return

      const indexedDbOperations = parsePendingSyncOperationsFromUnknownList(indexedDbOperationsRaw)
      const dishOperations = buildPendingDishSyncOperations(loadDishesFromStorage(storeId))
      const mergedOperations = mergePendingSyncOperations(
        mergePendingSyncOperations(indexedDbOperations, legacyOperations),
        dishOperations
      )

      pendingSyncIndexedDbHydratedRef.current = true
      pendingSyncOperationsRef.current = mergedOperations
      savePendingSyncOperationsToIndexedDb(storeId, mergedOperations)
      applySyncOverviewFromPendingOperations(mergedOperations)
      setPendingSyncOperations(mergedOperations)
    }

    void hydratePendingSyncQueueFromIndexedDb()

    return () => {
      cancelled = true
    }
  }, [storeId])

  useEffect(() => {
    const normalized = pendingSyncOperations.map(operation => {
      if (operation.status === 'syncing') {
        return normalizePendingSyncOperation({
          ...operation,
          status: 'pending',
          updatedAt: nowMillis()
        } as PendingSyncOperation)
      }

      return normalizePendingSyncOperation(operation)
    })

    pendingSyncOperationsRef.current = normalized

    if (pendingSyncIndexedDbHydratedRef.current) {
      savePendingSyncOperationsToIndexedDb(storeId, normalized)
    }
  }, [pendingSyncOperations, storeId])

  function setMerchantSessionAndPersist(session: MerchantAuthSession | null, remember = loginRememberMeDraft): void {
    const scopedSession = session
      ? {
          ...session,
          storeId
        }
      : null

    setStoreMerchantSessionFromAuthSession(scopedSession)
    bindMerchantSessionToRepository(repository)
    setMerchantSession(scopedSession)
    setIsAdminLoggedIn(isMerchantLoggedInInStoreSession())
    persistMerchantSession(storeId, scopedSession, remember)
  }

  function applyRefreshedMerchantSession(session: MerchantAuthSession): void {
    setMerchantSessionAndPersist(session, readRememberMe(storeId))
    setSyncErrorMessage(null)
    setLoginError(null)
  }

  function buildMerchantSessionFromAuthSession(
    authSession: ShowcaseAuthSessionSnapshot,
    fallbackLoginName: string,
    fallbackExpiresAt = 0
  ): MerchantAuthSession {
    return {
      accessToken: authSession.accessToken,
      refreshToken: null,
      authUserId: authSession.authUserId,
      loginName: authSession.email || fallbackLoginName,
      expiresAt: authSession.expiresAt || fallbackExpiresAt,
      storeId
    }
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

  function setPendingShowcasePushRoute(route: PendingShowcasePushRoute | null): void {
    pendingPushRouteRef.current = route
    setPendingPushRoute(route)
  }

  async function consumePendingPushRouteAfterAuthRestore(): Promise<void> {
    if (pushRouteConsumingRef.current) return
    if (!merchantAuthRestoredRef.current) return

    const route = pendingPushRouteRef.current
    if (!route) return

    const openAs = String(route.openAs || '').trim().toLowerCase()
    if (openAs !== 'merchant') return

    const merchantRuntimeLoggedIn = isAdminLoggedInRef.current || isMerchantLoggedInInStoreSession()

    if (!merchantRuntimeLoggedIn) {
      setPreviousScreen(currentScreenRef.current)
      prepareLoginScreen(null)
      setScreen('Login')
      return
    }

    pushRouteConsumingRef.current = true

    try {
      setPendingShowcasePushRoute(null)
      await handlePushRoute(route)
    } finally {
      pushRouteConsumingRef.current = false
    }
  }

  function resetLoginDrafts(): void {
    prepareLoginScreen(null)
  }

  function markStoreProfileDraftDirty(): void {
    storeProfileDraftDirtyRef.current = true
  }

  function resetStoreProfileDraftDirty(): void {
    storeProfileDraftDirtyRef.current = false
  }

  function shouldProtectStoreProfileDraftFromExternalHydration(): boolean {
    return currentScreenRef.current === ShowcaseScreens.StoreProfile &&
      isEditingStoreProfileRef.current &&
      storeProfileDraftDirtyRef.current
  }

  function shouldProtectEditDishImagesFromExternalHydration(dishId: string | null | undefined): boolean {
    return currentScreenRef.current === 'Edit' &&
      itemEditorImageDraftDirtyRef.current &&
      Boolean(editDishId) &&
      Boolean(dishId) &&
      editDishId === dishId
  }

  function setEditDishImageUrlsFromEditor(
    value: string[] | ((current: string[]) => string[])
  ): void {
    itemEditorImageDraftDirtyRef.current = true
    setEditDishImageUrls(value)
  }

  function resetEditDishForm(): void {
    const draft = loadItemEditorDraftLocally(storeId, 'new')

    itemEditorImageDraftDirtyRef.current = false
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
    const shouldKeepCurrentImages = shouldProtectEditDishImagesFromExternalHydration(dish.id)

    setEditDishId(dish.id)
    setEditDishName(useCachedForEdit ? cached?.name || '' : dish.name || dish.title || '')
    setEditDishDescription(useCachedForEdit ? cached?.description || '' : dish.description || '')
    setEditDishCategory(useCachedForEdit ? cached?.category || null : dish.category || null)
    setEditDishOriginalPrice(useCachedForEdit ? cached?.price || '' : formatPlainNumber(dish.originalPrice))
    setEditDishDiscountPrice(useCachedForEdit ? cached?.discountPrice || '' : dish.discountPrice ? formatPlainNumber(dish.discountPrice) : '')
    setEditDishRecommended(Boolean(dish.isRecommended))
    setEditDishHidden(Boolean(dish.isHidden))

    if (!shouldKeepCurrentImages) {
      itemEditorImageDraftDirtyRef.current = false
      setEditDishImageUrls(resolveDishImages(dish))
    }

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
    resetStoreProfileDraftDirty()
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

    itemEditorImageDraftDirtyRef.current = false
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

  function requestEditDishExit(target: 'back' | 'home'): void {
    if (isSavingEditDish || isBlockingEditDish) return

    if (hasUnsavedEditDraft()) {
      setEditDishPendingExitTarget(target)
      return
    }

    if (target === 'home') {
      closeToHome()
      return
    }

    backToAdminFromEdit()
  }

  function confirmEditDishExit(): void {
    const target = editDishPendingExitTarget
    setEditDishPendingExitTarget(null)

    if (target === 'home') {
      closeToHome()
      return
    }

    backToAdminFromEdit()
  }

  function requestStoreProfileExit(target: 'back' | 'home'): void {
    if (isSavingStoreProfile) return

    if (hasUnsavedStoreProfileDraft()) {
      setStoreProfilePendingExitTarget(target)
      return
    }

    if (target === 'home') {
      closeToHome()
      return
    }

    backFromStoreProfile()
  }

  function confirmStoreProfileExit(): void {
    const target = storeProfilePendingExitTarget
    setStoreProfilePendingExitTarget(null)

    if (target === 'home') {
      discardStoreProfileDraftAndGoHome()
      return
    }

    backFromStoreProfile()
  }

  function requestAdminAnnouncementExit(target: 'back' | 'home'): void {
    if (adminAnnouncementIsSubmitting || adminAnnouncementIsBlocking) return

    if (hasUnsavedAdminAnnouncementDraft()) {
      setAdminAnnouncementPendingExitTarget(target)
      return
    }

    if (target === 'home') {
      discardAdminAnnouncementDraftAndGoHome()
      return
    }

    discardAdminAnnouncementDraftAndBack()
  }

  function confirmAdminAnnouncementExit(): void {
    const target = adminAnnouncementPendingExitTarget
    setAdminAnnouncementPendingExitTarget(null)

    if (target === 'home') {
      discardAdminAnnouncementDraftAndGoHome()
      return
    }

    discardAdminAnnouncementDraftAndBack()
  }

  function handleShowcaseBack(): boolean {
    if (screen === ShowcaseScreens.Detail) {
      backFromDetail()
      return true
    }

    if (
      screen === ShowcaseScreens.Admin ||
      screen === ShowcaseScreens.AdminItems ||
      screen === ShowcaseScreens.AdminCategories
    ) {
      backFromAdmin()
      return true
    }

    if (screen === ShowcaseScreens.AdminAnnouncementEdit) {
      requestAdminAnnouncementExit('back')
      return true
    }

    if (screen === ShowcaseScreens.StoreProfile) {
      requestStoreProfileExit('back')
      return true
    }

    if (screen === ShowcaseScreens.ChangePassword) {
      backFromChangePassword()
      return true
    }

    if (screen === ShowcaseScreens.Favorites) {
      closeFavoritesPage()
      return true
    }

    if (screen === ShowcaseScreens.CustomerBookings) {
      backFromCustomerBookings()
      return true
    }

    if (screen === ShowcaseScreens.Announcements) {
      backFromAnnouncements()
      return true
    }

    if (screen === ShowcaseScreens.AdminAppointmentManager) {
      backFromAdminAppointmentManager()
      return true
    }

    if (screen === ShowcaseScreens.MerchantChatList) {
      backFromMerchantChatList()
      return true
    }

    if (screen === ShowcaseScreens.ChatSearchResults) {
      chatCloseSearchResults()
      return true
    }

    if (screen === ShowcaseScreens.ChatMedia) {
      chatCloseMediaGallery()
      return true
    }

    if (screen === ShowcaseScreens.Chat) {
      backFromChat()
      return true
    }

    if (screen === 'Edit') {
      requestEditDishExit('back')
      return true
    }

    closeToHome()
    return true
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

    setBookingsEntryDotVisibleAndPersist(false)

    if (!isAdminLoggedIn && currentChatRole() !== 'merchant') {
      void registerAppointmentClientPushDevice('customer-bookings-opened', true)
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
    const shouldProtectDraft = shouldProtectStoreProfileDraftFromExternalHydration()

    setStoreProfileCloud(profile)
    setStoreProfile(nextStoreProfile)
    setStoreProfileServices(services)
    setStoreProfileExtraContacts(extraContacts)
    setStoreProfileCoverUrl(profile?.coverUrl || '')
    setStoreProfileLogoUrl(profile?.logoUrl || '')

    if (!shouldProtectDraft) {
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
    }

    if (screen === ShowcaseScreens.StoreProfileView) {
      setStoreProfileDraft(null)
      return
    }

    if (shouldProtectDraft) return

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
      replaceDishPendingSyncOperations(input.localDishes)
    }

    if (effectiveCategoryNames.length) {
      setCategories(manualCategoryNamesToCloudCategories(effectiveCategoryNames))
    }

    if (input.localStoreProfile) {
      const localProfileForUi = storeProfileFromCachedProfile(input.localStoreProfile)
      const shouldProtectDraft = shouldProtectStoreProfileDraftFromExternalHydration()

      setStoreProfile(localProfileForUi)
      setStoreProfileServices(input.localStoreProfile.services)
      setStoreProfileExtraContacts(input.localStoreProfile.extraContacts)
      setStoreProfileCoverUrl(input.localStoreProfile.coverUrl)
      setStoreProfileLogoUrl(input.localStoreProfile.logoUrl)

      if (!shouldProtectDraft) {
        setStoreProfileDraft(current => current || storeProfileDraftFromProfile(localProfileForUi))
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
        cloudStorePwaProfile,
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
        repository.fetchStorePwaProfile(storeId),
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
      const cloudServiceStatus = String(serviceStatus?.serviceStatus || '').trim().toLowerCase()
      const storeMissingInCloud = !cloudStorePwaProfile && !cloudUnavailable
      const storeDeletedInCloud = cloudServiceStatus === 'deleted'

      setStoreUnavailable(storeMissingInCloud || storeDeletedInCloud)

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
      setStorePwaProfileCloud(cloudStorePwaProfile)
      setIsWriteAllowed(serviceStatus ? serviceStatus.isWriteAllowed : await repository.isStoreWriteAllowed(storeId))
      setCategories(cloudCategories.length ? cloudCategories : manualCategoryNamesToCloudCategories(effectiveManualCategories))
      mergeDishEntities(effectiveDishes)
      setHomeDishIds(dishIdsFromItems(effectiveDishes))
      setAdminItemIds(dishIdsFromItems(effectiveDishes))
      setDishes(effectiveDishes)
      refreshFavoritesList(effectiveDishes)
      replaceDishPendingSyncOperations(effectiveDishes)

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
        persistStoreProfileLocally(storeId, {
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
        persistDishesLocally(storeId, effectiveDishes)
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
      setStoreUnavailable(false)

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
      replaceDishPendingSyncOperations(effectiveLocalDishes)

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
        cloudStorePwaProfile,
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
        repository.fetchStorePwaProfile(storeId),
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
      const cloudServiceStatus = String(serviceStatus?.serviceStatus || '').trim().toLowerCase()
      const storeMissingInCloud = !cloudStorePwaProfile && !cloudUnavailable
      const storeDeletedInCloud = cloudServiceStatus === 'deleted'

      setStoreUnavailable(storeMissingInCloud || storeDeletedInCloud)

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
      setStorePwaProfileCloud(cloudStorePwaProfile)
      setIsWriteAllowed(serviceStatus ? serviceStatus.isWriteAllowed : await repository.isStoreWriteAllowed(storeId))
      setCategories(cloudCategories.length ? cloudCategories : manualCategoryNamesToCloudCategories(effectiveManualCategories))
      mergeDishEntities(effectiveDishes)
      setHomeDishIds(dishIdsFromItems(effectiveDishes))
      if (isAdminLoggedIn) {
        setAdminItemIds(dishIdsFromItems(effectiveDishes))
      }
      setDishes(effectiveDishes)
      refreshFavoritesList(effectiveDishes)
      replaceDishPendingSyncOperations(effectiveDishes)

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
        persistStoreProfileLocally(storeId, {
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
        persistDishesLocally(storeId, effectiveDishes)
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
      setStoreUnavailable(false)

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
      replaceDishPendingSyncOperations(effectiveLocalDishes)

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
      replaceDishPendingSyncOperations(effectiveDishes)
      resetAdminItemsPaginationForFirstPage(filteredItems.length)

      const effectiveCategoryNames = cloudCategories.length
        ? cloudCategoriesToManualCategoryNames(cloudCategories)
        : effectiveManualCategories

      if (adminItemsSelectedCategory && !effectiveCategoryNames.includes(adminItemsSelectedCategory)) {
        setAdminItemsSelectedCategory(null)
      }

      persistDishesLocally(storeId, effectiveDishes)

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
        replaceDishPendingSyncOperations(localDishes)
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

  const {
    refreshCloudServiceStatus,
    refreshAdminHomeCloudState,
    tryLoadFromCloud,
    loadFromSources,
    retryLast,
    clearSyncError
  } = useShowcaseBootstrapModule({
    adminHomeRefreshInFlightRef,
    bindMerchantSessionToRepository,
    chatRepository,
    dishIdsFromItems,
    fetchLatestMerchantThreadsForMerge,
    handleMerchantAuthExpiredIfNeeded,
    ensureValidMerchantSessionLoadedForCloud,
    isAdminLoggedIn,
    isMerchantLoggedInInStoreSession,
    lastRetryOp,
    loadAdminCredentials,
    loadDishesFromStorage,
    loadFromCloud,
    loadManualCategoriesFromStorage,
    loadPublishedAnnouncementsLocally,
    manualCategoryNamesToCloudCategories,
    merchantChatThreads,
    merchantSession,
    merchantSessionEnsureFailureMessage,
    mergeDishEntities,
    mergeMerchantThreadSummariesByConversationId,
    ndjcTrace,
    ndjcTraceError,
    nowMillis,
    pendingSyncOperations,
    refreshFavoritesList,
    refreshHomeMainData,
    refreshStoreProfile: () => refreshStoreProfile(),
    replaceDishPendingSyncOperations,
    repository,
    retryPendingSync: () => retryPendingSync(),
    screen,
    selectedCategory,
    setAdminItemIds,
    setAnnouncements,
    setAppointmentRequests,
    setCategories,
    setCloudStatus,
    setDishes,
    setHomeDishIds,
    setIsWriteAllowed,
    setLastRetryOp,
    setLastSyncAt,
    setMerchantChatThreads,
    setSelectedCategory,
    setStatusMessage,
    setStoreMerchantSessionFromAuthSession,
    setSyncErrorMessage,
    setSyncOverviewState,
    ShowcaseRetryOps,
    storeId,
    SyncOverviewStates
  })

  const refreshCloud = useCallback(async (): Promise<void> => {
    await tryLoadFromCloud(ShowcaseRetryOps.LoadFromCloud)
  }, [tryLoadFromCloud])

  const recoverShowcaseAfterLifecycleResume = useCallback(async (
    source: 'app-start' | 'foreground' | 'online' | 'manual'
  ): Promise<void> => {
    if (!isBrowser()) return
    if (lifecycleRecoveryInFlightRef.current) return

    const now = nowMillis()
    const minIntervalMs = source === 'manual' ? 0 : 5000

    if (minIntervalMs > 0 && now - lastLifecycleRecoveryAtRef.current < minIntervalMs) {
      return
    }

    lifecycleRecoveryInFlightRef.current = true
    lastLifecycleRecoveryAtRef.current = now

    try {
      await cleanupShowcaseBusinessCache(storeId)

      if (window.navigator.onLine === false) {
        if (pendingSyncOperationsRef.current.length) {
          setSyncOverviewState(SyncOverviewStates.HasPending)
          setSyncErrorMessage('You are offline. Pending changes will sync when the network is available.')
        }

        return
      }

      if (pendingSyncOperationsRef.current.length) {
        setLastRetryOp(ShowcaseRetryOps.RetryPendingSync)
      }

      await tryLoadFromCloud(ShowcaseRetryOps.LoadFromCloud)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error || 'Recovery failed.')

      if (window.navigator.onLine === false) {
        setSyncOverviewState(SyncOverviewStates.HasPending)
        setSyncErrorMessage('You are offline. Cached data is available and changes will sync later.')
        return
      }

      setSyncOverviewState(SyncOverviewStates.Failed)
      setSyncErrorMessage(message)
      setLastRetryOp(ShowcaseRetryOps.LoadFromCloud)
    } finally {
      lifecycleRecoveryInFlightRef.current = false
    }
  }, [
    storeId,
    tryLoadFromCloud
  ])

  const retryPendingSync = useCallback(async (): Promise<void> => {
    const now = nowMillis()
    const retryableOperations = pendingSyncOperations
      .map(normalizePendingSyncOperation)
      .filter(operation => shouldAttemptPendingSyncOperation(operation, now))

    if (!pendingSyncOperations.length) {
      await loadFromCloud(ShowcaseRetryOps.RetryPendingSync)
      return
    }

    if (!retryableOperations.length) {
      applySyncOverviewFromPendingOperations(pendingSyncOperations)
      return
    }

    if (isBrowser() && window.navigator.onLine === false) {
      setSyncOverviewState(SyncOverviewStates.HasPending)
      setSyncErrorMessage('You are offline. Pending changes will sync when the network is available.')
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

    for (const op of retryableOperations) {
      markPendingSyncing(op.id)

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

            persistDishesLocally(storeId, nextDishes)
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
            persistDishesLocally(storeId, nextDishes)
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
              markPendingSyncFailed(op.id, merchantSessionEnsureFailureMessage())
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

        const stillPending = pendingSyncOperationsRef.current.some(item => item.id === op.id)

        if (stillPending) {
          throw new Error('Pending sync operation did not complete.')
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error || 'Retry sync failed.')

        markPendingSyncFailed(op.id, message)
        setSyncErrorMessage(message)
        setSyncOverviewState(SyncOverviewStates.Failed)
        return
      }
    }

    setLastSyncAt(nowMillis())

    const remainingOperations = pendingSyncOperationsRef.current

    if (remainingOperations.length) {
      applySyncOverviewFromPendingOperations(remainingOperations)
      return
    }

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
    applySyncOverviewFromPendingOperations(pendingSyncOperations)
  }, [pendingSyncOperations])

  useEffect(() => {
    if (!isBrowser()) return

    const runPendingSyncIfPossible = (): void => {
      if (pendingSyncRetryInFlightRef.current) return
      if (!pendingSyncOperationsRef.current.length) return
      if (window.navigator.onLine === false) return

      const now = nowMillis()
      const hasRetryableOperation = pendingSyncOperationsRef.current.some(operation => {
        return shouldAttemptPendingSyncOperation(operation, now)
      })

      if (!hasRetryableOperation) {
        applySyncOverviewFromPendingOperations(pendingSyncOperationsRef.current)
        return
      }

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
      void recoverShowcaseAfterLifecycleResume('online')
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

    const handleLifecycle = (event: Event): void => {
      const detail = event instanceof CustomEvent
        ? event.detail as ShowcaseAppLifecycleDetail | null
        : null

      if (!detail || detail.phase !== 'foreground') return

      void cleanupShowcaseBusinessCache(storeId)
      void recoverShowcaseAfterLifecycleResume('foreground')
      runPendingSyncIfPossible()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('focus', handleFocus)
    window.addEventListener(NDJC_SHOWCASE_APP_LIFECYCLE_EVENT, handleLifecycle)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const snapshot = readShowcaseAppLifecycleSnapshot()

    if (snapshot.lastPhase === 'app-start' || snapshot.lastPhase === 'background') {
      void recoverShowcaseAfterLifecycleResume('app-start')
    }

    runPendingSyncIfPossible()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener(NDJC_SHOWCASE_APP_LIFECYCLE_EVENT, handleLifecycle)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [
    recoverShowcaseAfterLifecycleResume,
    retryPendingSync,
    storeId
  ])

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
        clearPersistedMerchantSession(storeId, false)
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
        clearPersistedMerchantSession(storeId, false)
        setLoginError(message)
        return
      }

      const effectiveLoginName = binding.loginName?.trim() || session.loginName
      const effectiveSession: MerchantAuthSession = {
        ...session,
        loginName: effectiveLoginName,
        storeId
      }
      const routeAfterLogin = pendingPushRouteRef.current

      writeMerchantSession(storeId, effectiveSession)
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
        setPendingShowcasePushRoute(null)
        await handlePushRoute(routeAfterLogin)
      }
    } catch (error) {
      setStoreMerchantSessionFromAuthSession(null)
      bindMerchantSessionToRepository(repository)
      setMerchantSession(null)
      setMerchantBindings([])
      setIsAdminLoggedIn(false)
      clearPersistedMerchantSession(storeId, false)
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

      clearPersistedMerchantSession(storeId, true)
      writeRememberMe(storeId, false)

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

      try {
        await unregisterMerchantPushDevice('merchant-password-updated')
      } catch {
      }

      try {
        await repository.signOutMerchant()
      } catch {
      }

      setStoreMerchantSessionFromAuthSession(null)
      bindMerchantSessionToRepository(repository)
      setMerchantSession(null)
      setMerchantBindings([])
      setIsAdminLoggedIn(false)

      clearPersistedMerchantSession(storeId, true)
      writeRememberMe(storeId, false)

      setAdminUsernameDraft(loginName)
      setAdminPasswordDraft('')
      setLoginUsernameDraft(loginName)
      setLoginPasswordDraft('')
      setLoginRememberMeDraft(false)
      setLoginError('Password updated. Please sign in again.')
      setIsLoginLoading(false)

      setChangePasswordCurrentDraft('')
      setChangePasswordNewDraft('')
      setChangePasswordConfirmDraft('')
      setChangePasswordError(null)
      setChangePasswordSuccess(null)

      setStatusMessage(null)
      setPreviousScreen(ShowcaseScreens.ChangePassword)
      setScreen(ShowcaseScreens.Login)
      showSnackbar('Password updated. Please sign in again.')
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

      const scopedNext = {
        ...next,
        storeId
      }

      updateMerchantLoginNameInStoreSession(nextLoginName)
      writeMerchantSession(storeId, scopedNext)
      setStoreMerchantSessionFromAuthSession(scopedNext)
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
    merchantAuthRestoredRef.current = false

    try {
      const cachedLoginName = readLastMerchantLoginName(storeId)
      const shouldRestoreMerchantForStore = readRememberMe(storeId)
      const storedSession = restoreMerchantSessionFromStorage(storeId)

      if (cachedLoginName) {
        setAdminUsernameDraft(cachedLoginName)
        setLoginUsernameDraft(cachedLoginName)
      }

      if (!shouldRestoreMerchantForStore) {
        setStoreMerchantSessionFromAuthSession(null)
        bindMerchantSessionToRepository(repository)
        setMerchantSession(null)
        setMerchantBindings([])
        setIsAdminLoggedIn(false)
        setLoginRememberMeDraft(false)
        return
      }

      let authSession: Awaited<ReturnType<typeof restoreShowcaseAuthSession>> | null = null

      try {
        authSession = await restoreShowcaseAuthSession()
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error || '')
        const status = typeof error === 'object' && error && 'status' in error
          ? Number((error as { status?: number | null }).status || 0)
          : 0

        if (
          storedSession?.accessToken &&
          storedSession.authUserId &&
          isTemporaryMerchantRefreshFailure(status, message)
        ) {
          handleTemporaryMerchantRefreshFailure(storedSession)
          return
        }

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

      if (
        storedSession?.authUserId &&
        storedSession.authUserId.toLowerCase() !== authSession.authUserId.toLowerCase()
      ) {
        setStoreMerchantSessionFromAuthSession(null)
        bindMerchantSessionToRepository(repository)
        setMerchantSession(null)
        setMerchantBindings([])
        setIsAdminLoggedIn(false)
        clearPersistedMerchantSession(storeId, false)
        return
      }

      const sourceSession = buildMerchantSessionFromAuthSession(
        authSession,
        storedSession?.loginName || cachedLoginName,
        storedSession?.expiresAt || 0
      )

      setStoreMerchantSessionFromAuthSession(sourceSession)
      bindMerchantSessionToRepository(repository)

      const binding = await repository.fetchMerchantBindingForStoreAndAuthUser(storeId, sourceSession.authUserId)

      if (!binding || !binding.authUserId || binding.authUserId.toLowerCase() !== sourceSession.authUserId.toLowerCase()) {
        setStoreMerchantSessionFromAuthSession(null)
        bindMerchantSessionToRepository(repository)
        setMerchantSession(null)
        setMerchantBindings([])
        setIsAdminLoggedIn(false)
        clearPersistedMerchantSession(storeId, false)
        return
      }

      const effectiveLoginName = binding.loginName?.trim() || sourceSession.loginName
      const effectiveSession: MerchantAuthSession = {
        ...sourceSession,
        loginName: effectiveLoginName,
        storeId
      }

      writeMerchantSession(storeId, effectiveSession)
      setStoreMerchantSessionFromAuthSession(effectiveSession)
      bindMerchantSessionToRepository(repository)
      setMerchantSession(effectiveSession)
      setMerchantBindings([binding])
      setIsAdminLoggedIn(true)
      setAdminUsernameDraft(effectiveLoginName)
      setLoginUsernameDraft(effectiveLoginName)
      setLoginRememberMeDraft(true)

      window.setTimeout(() => {
        void registerMerchantPushDevice('merchant-session-restored', true)
      }, 0)
    } finally {
      merchantAuthRestoredRef.current = true

      if (typeof window !== 'undefined') {
        window.setTimeout(() => {
          void consumePendingPushRouteAfterAuthRestore()
        }, 0)
      }
    }
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

    restoreMerchantSessionFromStorage(storeId)

    if (!readRememberMe(storeId) && !merchantSession?.accessToken) {
      return {
        type: 'expired'
      }
    }

    const storedSession = merchantSession?.accessToken
      ? merchantSession
      : readMerchantSession(storeId)

    let authSession: Awaited<ReturnType<typeof getFreshShowcaseAuthSession>> | null = null

    try {
      authSession = await restoreShowcaseAuthSession()
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
    restoreMerchantSessionFromStorage(storeId)

    const sourceSession = merchantSession?.accessToken
      ? merchantSession
      : readMerchantSession(storeId)

    try {
      const authSession = await restoreShowcaseAuthSession()

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
    const storedSession = readMerchantSession(storeId)
    const sourceSession = currentSession?.accessToken
      ? currentSession
      : storedSession

    if (!sourceSession?.accessToken && !readRememberMe(storeId) && !isMerchantLoggedInInStoreSession()) {
      return
    }

    try {
      const authSession = await restoreShowcaseAuthSession()

      if (!authSession?.accessToken || !authSession.authUserId) {
        await handleMerchantSessionExpired()
        return
      }

      if (
        sourceSession?.authUserId &&
        sourceSession.authUserId.toLowerCase() !== authSession.authUserId.toLowerCase()
      ) {
        await handleMerchantSessionExpired()
        return
      }

      const nextSession = buildMerchantSessionFromAuthSession(
        authSession,
        sourceSession?.loginName || loginUsernameDraft || adminUsernameDraft || '',
        sourceSession?.expiresAt || 0
      )

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

      if (sourceSession?.accessToken && isTemporaryMerchantRefreshFailure(status, message)) {
        handleTemporaryMerchantRefreshFailure(sourceSession)

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
    clearStoredMerchantSession(storeId)
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

  function appointmentStatusToCloud(valueInput: string): string {
    return appointmentsStatusToCloud(valueInput)
  }

  function buildPendingFromSelectedDish(): ShowcaseChatProductShare | null {
    if (!selectedDish) return null

    return buildChatProductShareFromDish(selectedDish)
  }

  function appointmentShareStatusLabelFromCard(item: ShowcaseAppointmentCard): string {
    const status = String(item.statusLabel || '').trim() || 'Pending'
    const cancelledBy = String(item.cancelledBy || '').trim().toLowerCase()

    if (status === 'Cancelled' && cancelledBy === 'customer') {
      return 'Cancelled by customer'
    }

    return status
  }

  function buildPendingAppointmentFromCard(item: ShowcaseAppointmentCard): ShowcaseChatAppointmentShare {
    const linkedItemAvailable = Boolean(item.itemAvailable && item.sourceDishId)

    return {
      appointmentId: item.id,
      title: item.serviceTitle || 'General appointment',
      preferredDate: item.preferredDate,
      preferredTime: item.preferredTime,
      statusLabel: appointmentShareStatusLabelFromCard(item),
      cancelledBy: item.cancelledBy,
      cancelledAt: item.cancelledAt,
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

  function hydrateChatAppointmentShareFromCard(appointment: ShowcaseChatAppointmentShare): ShowcaseChatAppointmentShare {
    const appointmentId = appointment.appointmentId.trim()
    const card = appointmentId ? appointmentCardsById.get(appointmentId) || null : null

    if (!card) return appointment

    const linkedItemAvailable = Boolean(card.itemAvailable && card.sourceDishId)

    return {
      ...appointment,
      title: card.serviceTitle || appointment.title || 'General appointment',
      preferredDate: card.preferredDate || appointment.preferredDate,
      preferredTime: card.preferredTime || appointment.preferredTime,
      statusLabel: appointmentShareStatusLabelFromCard(card),
      cancelledBy: card.cancelledBy,
      cancelledAt: card.cancelledAt,
      imageUrl: card.imageUrl || appointment.imageUrl,
      imageVariants: card.imageVariants ?? appointment.imageVariants ?? createRemoteOnlyShowcaseImageVariants(card.imageUrl || appointment.imageUrl),
      customerName: card.customerName || appointment.customerName || 'Customer',
      customerContact: card.customerContact || appointment.customerContact || '',
      note: card.note || appointment.note || '',
      sourceDishId: card.sourceDishId || appointment.sourceDishId,
      priceText: card.priceText || appointment.priceText,
      originalPriceText: card.originalPriceText || appointment.originalPriceText,
      discountPriceText: card.discountPriceText || appointment.discountPriceText,
      categoryText: card.categoryText || appointment.categoryText,
      itemAvailable: linkedItemAvailable,
      createdAtText: card.createdAtText || appointment.createdAtText
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
    setPendingShowcasePushRoute(null)
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

    itemEditorImageDraftDirtyRef.current = false
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

  const {
    onAdminItemsApplyPriceRange,
    onAdminItemsClearPriceRange,
    onAdminItemsFilterDiscountOnlyChange,
    onAdminItemsFilterHiddenOnlyChange,
    onAdminItemsFilterRecommendedChange,
    onAdminItemsApplyFilters,
    onAdminItemsPriceMaxDraftChange,
    onAdminItemsPriceMinDraftChange,
    onAdminItemsSearchQueryChange,
    onAdminItemsSortModeChange,
    removeCategory,
    addCategory,
    requestDeleteCategory,
    confirmDeleteCategory,
    renameCategory,
    reorderCategory,
    saveDishFromEditForm,
    deleteDish,
    visibleDishes,
    visibleAdminItems,
    clearAdminDishSelection,
    toggleAdminDishSelected,
    deleteSelectedDishes,
    requestDeleteDish,
    dismissPendingDelete,
    updateEditDraft,
    onEditNameChange,
    onEditPriceChange,
    onEditDiscountPriceChange,
    onEditDescriptionChange,
    onEditCategorySelected,
    onEditToggleRecommended,
    onEditToggleHidden,
    uploadDishImageIfNeeded,
    onEditImageSelected,
    onEditImagesSelected,
    onEditRemoveImage,
    onEditRemoveSelectedImage,
    onEditMoveImage,
    onEditPickImageClick,
    onEditImageLimitReached,
    updateDish,
    onEditSave,
    deriveEditState,
    getEditDeleteAction,
    incrementDishClick,
    deleteDishImage,
    toggleFavorite,
    clearFavoritesSelection,
    toggleFavoriteSelection,
    deleteSelectedFavorites,
    clearHomeSortAndFilters,
    clearAdminItemsFilters,
    clearFavoritesFilters,
    toggleTag,
    onToggleTag,
    onSelectedTagsChange,
    onClearTags,
    onSearchQueryChange,
    onCategorySelected,
    onAdminItemsCategorySelected,
    onSortModeChange,
    onFilterRecommendedOnlyChange,
    onFilterOnSaleOnlyChange,
    onApplyHomeFilters,
    onHomeShowSortMenuChange,
    onHomeShowFilterMenuChange,
    onHomeShowPriceMenuChange,
    onHomePriceMinDraftChange,
    onHomePriceMaxDraftChange,
    onHomeApplyPriceRange,
    onHomeClearPriceRange,
    onClearSortAndFilters,
    onClearAll,
    onHomeDishSelected,
    onHomeProfileClick,
    onFavoritesQueryChange,
    onFavoritesOpenDetail,
    onFavoritesToggleSelect,
    onFavoritesClearSelection,
    onFavoritesDeleteSelected,
    onFavoritesSortModeChange,
    onFavoritesFilterRecommendedOnlyChange,
    onFavoritesFilterOnSaleOnlyChange,
    onFavoritesClearSortAndFilters,
    onFavoritesShowSortMenuChange,
    onFavoritesShowFilterMenuChange,
    onFavoritesShowPriceMenuChange,
    onFavoritesPriceMinDraftChange,
    onFavoritesPriceMaxDraftChange,
    onFavoritesApplyPriceRange,
    onFavoritesClearPriceRange,
    onFavoritesCategorySelected
  } = createShowcaseCatalogActions({
    ShowcaseRetryOps,
    ShowcaseScreens,
    SyncOverviewStates,
    adminItemsAppliedMaxPrice,
    adminItemsAppliedMinPrice,
    adminItemsFilterDiscountOnly,
    adminItemsFilterHiddenOnly,
    adminItemsFilterRecommended,
    adminItemsPriceMaxDraft,
    adminItemsPriceMinDraft,
    adminItemsSearchDebounceTimerRef,
    adminItemsSearchQuery,
    adminItemsSearchRequestSeqRef,
    adminItemsSelectedCategory,
    adminItemsSortAscending,
    adminItemsSortMode,
    adminPendingDeleteCategory,
    adminSelectedDishIds,
    adminVisibleDishes,
    applyPriceRangeFromDrafts,
    bindMerchantSessionToRepository,
    buildDishFromEditForm,
    categorySubmittingAction,
    clearCurrentItemEditorDraftLocally,
    clearEditDraftLocalImages,
    cloudCategoriesToManualCategoryNames,
    createEditDishLocalPreviewUrl,
    createRemoteOnlyImageVariants,
    currentAdminItemsCloudFilters,
    currentHomeDishCloudFilters,
    decorateCloudHomeResults,
    deleteAppOwnedLocalFileUri,
    dishIdsFromItems,
    dishes,
    dishesFromIds,
    editDishCategory,
    editDishDescription,
    editDishDiscountPrice,
    editDishId,
    editDishImageUrls,
    editDishName,
    editDishOriginalPrice,
    getEditDishState: () => editDishState,
    ensureValidMerchantSessionLoadedForCloud,
    favoriteAddedAt,
    favoriteIds,
    favoriteSnapshotFromDish,
    favoriteSnapshots,
    favoritesAppliedMaxPrice,
    favoritesAppliedMinPrice,
    favoritesFilterOnSaleOnly,
    favoritesFilterRecommendedOnly,
    favoritesPriceMaxDraft,
    favoritesPriceMinDraft,
    favoritesQuery,
    favoritesSelectedCategory,
    favoritesSelectedIds,
    favoritesShowFilterMenu,
    favoritesShowPriceMenu,
    favoritesShowSortMenu,
    favoritesSortMode,
    filterOnSaleOnly,
    filterRecommendedOnly,
    getAdminEditableDishById,
    getDishEntityById,
    guardOfflineWriteOperation,
    homeAppliedMaxPrice,
    homeAppliedMinPrice,
    homeDishIds,
    homePriceMaxDraft,
    homePriceMinDraft,
    homeSearchDebounceTimerRef,
    homeSearchRequestSeqRef,
    isAdminLoggedIn,
    isAppOwnedLocalFileUri,
    isBrowser,
    isLocalImageUri,
    isWriteAllowed,
    loadDishesFromStorage,
    manualCategories,
    merchantSessionEnsureFailureMessage,
    merchantSessionEnsureSnackbarMessage,
    mergeDishEntities,
    mergeRemoteAndLocal,
    normalizeSortMode,
    nowMillis,
    openDetail,
    parseHomePriceDraft,
    persistCurrentItemEditorDraftLocally,
    persistDishesLocally,
    persistFavoritesState,
    persistItemEditorDraftLocally,
    pickAndUploadImageWithVariants,
    prepareLoginScreen,
    preserveFavoriteSnapshotsBeforeDishDelete,
    previousScreen,
    pushPendingSync,
    refreshAdminHomeCloudState,
    refreshAdminItemsFilteredFirstPage,
    refreshFavoritesList,
    refreshHomeDishesFilteredFirstPage,
    rememberLocalTempImage,
    removeDishEntityById,
    removeDishIdFromList,
    removePendingSync,
    replaceDishPendingSyncOperations,
    repository,
    resolveDishImages,
    retryMerchantCloudOperationAfterAuthRefresh,
    saveManualCategoriesToStorage,
    searchQuery,
    selectedCategory,
    selectedTags,
    setAdminCannotDeleteCategory,
    setAdminItemIds,
    setAdminItemsAppliedMaxPrice,
    setAdminItemsAppliedMinPrice,
    setAdminItemsFilterDiscountOnly,
    setAdminItemsFilterHiddenOnly,
    setAdminItemsFilterRecommended,
    setAdminItemsPriceMaxDraft,
    setAdminItemsPriceMinDraft,
    setAdminItemsSearchQuery,
    setAdminItemsSelectedCategory,
    setAdminItemsSortAscending,
    setAdminItemsSortMode,
    setAdminPendingDeleteCategory,
    setAdminSelectedDishIds,
    setAppointmentSourceDishId,
    setCategories,
    setCategorySubmittingAction,
    setDishEntitiesById,
    setDishes,
    setEditDishCategory,
    setEditDishDescription,
    setEditDishDiscountPrice,
    setEditDishHidden,
    setEditDishId,
    setEditDishImageUrls: setEditDishImageUrlsFromEditor,
    setEditDishName,
    setEditDishOriginalPrice,
    setEditDishRecommended,
    setEditValidationError,
    setFavoritesAppliedMaxPrice,
    setFavoritesAppliedMinPrice,
    setFavoritesFilterOnSaleOnly,
    setFavoritesFilterRecommendedOnly,
    setFavoritesPriceMaxDraft,
    setFavoritesPriceMinDraft,
    setFavoritesQuery,
    setFavoritesSelectedCategory,
    setFavoritesSelectedIds,
    setFavoritesShowFilterMenu,
    setFavoritesShowPriceMenu,
    setFavoritesShowSortMenu,
    setFavoritesSortMode,
    setFilterOnSaleOnly,
    setFilterRecommendedOnly,
    setHomeAppliedMaxPrice,
    setHomeAppliedMinPrice,
    setHomeDishIds,
    setHomePriceMaxDraft,
    setHomePriceMinDraft,
    setHomeShowFilterMenu,
    setHomeShowPriceMenu,
    setHomeShowSortMenu,
    setIsBlockingEditDish,
    setIsSavingEditDish,
    setLastRetryOp,
    setLastSyncAt,
    setPendingDeleteDishId,
    setPreviousScreen,
    setScreen,
    setSearchQuery,
    setSelectedCategory,
    setSelectedDishId,
    setSelectedTags,
    setSortMode,
    setStatusMessage,
    setStoreMerchantSessionFromAuthSession,
    setSyncErrorMessage,
    setSyncOverviewState,
    showSnackbar,
    sortMode,
    sortedDishesForStorage,
    storeId,
    validateEditDish,
    visibleDishesForUi
  })









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

      itemEditorImageDraftDirtyRef.current = true
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

    itemEditorImageDraftDirtyRef.current = true
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
    writeRememberMe(storeId, value)

    if (!value) {
      clearPersistedMerchantSession(storeId, false)
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


















  function closeFavoritesPage(): void {
    closeFavorites()
  }


  const {
    openAppointmentForDish,
    submitAppointmentRequest,
    saveAppointmentSettings,
    refreshAppointments,
    updateAppointmentStatus,
    cancelCustomerBooking,
    normalizeAppointmentAvailableHoursText,
    normalizeAppointmentBookingWindowDays,
    normalizeAppointmentSlotIntervalMinutes,
    normalizeAppointmentMinimumNotice,
    normalizeAppointmentClosedDays,
    nextClosedDaysAfterToggle,
    applyCloudAppointmentSettings,
    formatAppointmentPushShortTime,
    formatNewAppointmentMerchantPushBody,
    formatCancelledAppointmentMerchantPushBody,
    formatAppointmentStatusCustomerPushBody,
    appointmentPushTimeText,
    appointmentStatusFromCloud,
    appointmentStatusLabelForAdminFilter,
    currentAppointmentSettingsForCloud,
    applyAppointmentSettingsLocally,
    customerAppointmentDateChoices,
    customerAppointmentRuleSummary,
    customerAppointmentTimeOptions,
    filteredAdminAppointments,
    filteredCustomerAppointments,
    currentAdminAppointmentCloudFilters,
    currentCustomerAppointmentCloudFilters,
    appointmentFilterRowMatchesStatus,
    appointmentFilterRowMatchesService,
    appointmentFilterRowsToFutureDateOptions,
    appointmentFilterRowMatchesDate,
    appointmentFilterRowsToServiceOptions,
    resetAdminAppointmentsPaginationForFirstPage,
    resetCustomerAppointmentsPaginationForFirstPage,
    onAppointmentAdminDateFilterChange,
    onAppointmentAdminHistoryDateClear,
    onAppointmentAdminHistoryDateSelected,
    onAppointmentAdminServiceFilterChange,
    onAppointmentAdminStatusFilterChange,
    onAppointmentAvailableHoursTextChange,
    onAppointmentBookingWindowDaysChange,
    onAppointmentClosedDayToggle,
    onAppointmentContactDraftChange,
    onAppointmentCustomerDateFilterChange,
    onAppointmentCustomerServiceFilterChange,
    onAppointmentCustomerStatusFilterChange,
    onAppointmentDateDraftChange,
    onAppointmentMinimumNoticeChange,
    onAppointmentNameDraftChange,
    onAppointmentNoteDraftChange,
    onAppointmentServiceDraftChange,
    onAppointmentSlotIntervalMinutesChange,
    onAppointmentTimeDraftChange,
    onAppointmentsEnabledChange,
    refreshAdminAppointmentsFromCloud,
    refreshCustomerAppointmentsFromCloud,
    saveAppointmentSettingsToCloud,
    loadMoreCustomerAppointments,
    loadMoreAdminAppointments,
    refreshBookingsEntryDotOnce
  } = createShowcaseBookingActions({
    SHOWCASE_PAGE_SIZE,
    ShowcaseScreens,
    adminAppointmentsPagination,
    appointmentAdminDateFilter,
    appointmentAdminHistoryDateFilter,
    appointmentAdminServiceFilter,
    appointmentAdminStatusFilter,
    appointmentAvailableHoursText,
    appointmentBookingWindowDays,
    appointmentCards,
    appointmentClosedDays,
    appointmentCloudCancelledByFilterFromUi,
    appointmentCloudCancelledByNotFilterFromUi,
    appointmentCloudDateFiltersFromUi,
    appointmentCloudServiceFilterFromUi,
    appointmentCloudStatusFilterFromUi,
    appointmentContactDraft,
    appointmentCustomerDateFilter,
    appointmentCustomerServiceFilter,
    appointmentCustomerStatusFilter,
    appointmentDateDraft,
    appointmentDetailBackTargetRef,
    appointmentLocalDateKey,
    appointmentMinimumNotice,
    appointmentNameDraft,
    appointmentNoteDraft,
    appointmentRequests,
    appointmentServiceDraft,
    appointmentSettings,
    appointmentSlotIntervalMinutes,
    appointmentSourceDishId,
    appointmentStatusAlertKey,
    appointmentStatusSubmittingId,
    appointmentTimeDraft,
    appointmentsEnabled,
    appointmentsRefreshing,
    appointmentsStatusFromCloud,
    appointmentsStatusToCloud,
    bindMerchantSessionToRepository,
    canCustomerCancelAppointmentStatus,
    clientId,
    currentScreenRef,
    customerAppointmentCards,
    customerAppointmentDateOptions,
    customerAppointmentTimeOptionsForDate,
    customerAppointmentsPagination,
    defaultAppointmentSettings,
    detailBackTargetRef,
    dispatchAppointmentStatusPushToCustomer,
    dispatchCustomerCancelledAppointmentPushToMerchant,
    dispatchNewAppointmentPushToMerchant,
    encodeAppointmentPriceSnapshotFromDish,
    ensureDishEntityLoaded,
    ensureValidMerchantSessionLoadedForCloud,
    formatDateTimeText,
    formatShowcaseDateAndTimeParts,
    getDishEntityById,
    getDishTitle,
    guardOfflineWriteOperation,
    hydrateAppointmentLinkedDishesFromRequests,
    isAdminLoggedIn,
    isAdminLoggedInRef,
    isCustomerBookingAlertStatus,
    isMerchantLoggedInInStoreSession,
    loadAppointmentsFromStorage,
    loadSeenAppointmentStatusAlertKeys,
    merchantSessionEnsureFailureMessage,
    merchantSessionEnsureSnackbarMessage,
    mergeUniqueById,
    nowMillis,
    parseShowcaseDateInput,
    persistAppointmentsLocally,
    updateAdminPendingAppointmentCountSnapshotFromItems,
    pruneBookingSeenWhenCompletePageLoaded,
    pushPendingSync,
    registerAppointmentClientPushDevice,
    removePendingSync,
    repository,
    resolveDishImage,
    retryMerchantCloudOperationAfterAuthRefresh,
    screen,
    setAdminAppointmentFilterRows,
    setAdminAppointmentsPagination,
    setAppointmentAdminDateFilter,
    setAppointmentAdminHistoryDateFilter,
    setAppointmentAdminServiceFilter,
    setAppointmentAdminStatusFilter,
    setAppointmentAvailableHoursText,
    setAppointmentBookingWindowDays,
    setAppointmentClosedDays,
    setAppointmentContactDraft,
    setAppointmentCustomerDateFilter,
    setAppointmentCustomerServiceFilter,
    setAppointmentCustomerStatusFilter,
    setAppointmentDateDraft,
    setAppointmentError,
    setAppointmentMinimumNotice,
    setAppointmentNameDraft,
    setAppointmentNoteDraft,
    setAppointmentRequests,
    setAppointmentServiceDraft,
    setAppointmentSettings,
    setAppointmentSettingsSubmitting,
    setAppointmentSlotIntervalMinutes,
    setAppointmentSourceDishId,
    setAppointmentStatusSubmittingId,
    setAppointmentSuccess,
    setAppointmentTimeDraft,
    setAppointmentsEnabled,
    setAppointmentsRefreshing,
    setBookingsEntryDotVisible: setBookingsEntryDotVisibleAndPersist,
    setCustomerAppointmentFilterRows,
    setCustomerAppointmentsPagination,
    setPreviousScreen,
    setScreen,
    setStatusMessage,
    setStoreMerchantSessionFromAuthSession,
    showSnackbar,
    sortedAppointmentsForStorage,
    storeId
  })

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
    replaceDishPendingSyncOperations(merged)

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
    replaceDishPendingSyncOperations(merged)

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

  const {
    computeAnnouncementsEntryDot,
    shouldShowAnnouncementsEntryDot,
    shouldShowBookingsEntryDot,
    trackAnnouncementClickOnce,
    openAnnouncement,
    announcementDraftTimeText,
    announcementPublishedTimeText,
    toAnnouncementEntity,
    toPublishedAnnouncementEntity,
    getAdminDraftCardsForUi,
    getAdminPublishedCardsForUi,
    rebuildAnnouncementsList,
    syncPublicAnnouncementsFromCloud,
    syncMerchantAnnouncementsFromCloud,
    loadMorePublicAnnouncements,
    loadMoreAdminAnnouncements,
    refreshAnnouncements,
    refreshAnnouncementsEntryDotOnce,
    clearAdminAnnouncementComposerState,
    hasUnsavedAdminAnnouncementDraft,
    discardAdminAnnouncementDraftAndBack,
    discardAdminAnnouncementDraftAndGoHome,
    onAdminAnnouncementBodyDraftChange,
    onAdminAnnouncementClearCover,
    onAdminAnnouncementClearSelection,
    onAdminAnnouncementCoverPicked,
    onAdminAnnouncementDeleteSelected,
    onAdminAnnouncementDismissPreview,
    onAdminAnnouncementOpenItem,
    onAdminAnnouncementPreviewItem,
    onAdminAnnouncementPushNow,
    onAdminAnnouncementSaveDraft,
    onAdminAnnouncementStartNew,
    onAdminAnnouncementToggleSelect,
    onAnnouncementExpanded,
    onAnnouncementImageOpened,
    syncAnnouncementsAfterPush,
    ensureAnnouncementVisible,
    ensureAnnouncementViewed,
    ensureAnnouncementOpened,
    ensureAnnouncementPushRoute,
    ensureAnnouncementPublished,
    ensureAnnouncementDraftSaved,
    ensureAnnouncementPublishedNow,
    ensureAnnouncementSelectionDeleted,
    ensureAnnouncementListFresh,
    ensureAnnouncementEntryDotFresh,
    ensureAnnouncementClickTracked,
    clearFocusedAnnouncement,
    ensureAnnouncementImageOpened,
    ensureAnnouncementExpanded,
    ensureAnnouncementRouteConsumed,
    ensureAnnouncementDraftDiscardedToAdmin,
    ensureAnnouncementDraftDiscardedToHome,
    ensureAnnouncementComposerCleared,
    ensureAnnouncementCoverCleared,
    ensureAnnouncementCoverPicked,
    ensureAnnouncementBodyChanged,
    ensureAnnouncementSelectionCleared,
    ensureAnnouncementPreviewDismissed,
    ensureAnnouncementItemOpened,
    ensureAnnouncementItemPreviewed,
    ensureAnnouncementItemToggled,
    getAnnouncementUnreadCount,
    ensureAnnouncementUnreadStateFresh,
    ensureAnnouncementAllViewed,
    ensureAnnouncementCacheRebuilt,
    ensureAnnouncementCloudSynced,
    ensureAnnouncementDraftRestored,
    ensureAnnouncementDraftPersisted,
    ensureAnnouncementDraftCleared,
    ensureAnnouncementLocalCacheWritten,
    ensureAnnouncementLocalCacheRead,
    ensureAnnouncementLocalCacheLoaded,
    ensureAnnouncementLocalViewedLoaded,
    ensureAnnouncementLocalCountedLoaded,
    ensureAnnouncementLocalViewedSaved,
    ensureAnnouncementLocalCountedSaved,
    ensureAnnouncementLocalViewedCleared,
    ensureAnnouncementLocalCountedCleared,
    ensureAnnouncementDraftImagesCleared,
    ensureAnnouncementDraftComposerExpanded,
    ensureAnnouncementDraftComposerCollapsed,
    ensureAnnouncementPreviewVisible,
    ensureAnnouncementPreviewHidden,
    ensureAnnouncementPushTargetCleared,
    ensureAnnouncementPushTargetSet,
    ensureAnnouncementComposerErrorDismissed,
    ensureAnnouncementComposerSuccessDismissed,
    ensureAnnouncementComposerBlocking,
    ensureAnnouncementComposerSubmitting,
    ensureAnnouncementComposerExpanded,
    ensureAnnouncementFocused,
    ensureAnnouncementSelection,
    ensureAnnouncementDraftBody,
    ensureAnnouncementDraftCover,
    ensureAnnouncementDraftEditingId,
    ensureAnnouncementDraftItems,
    ensureAnnouncementPublishedItems,
    ensureAnnouncementResetAllLocalState,
    ensureAnnouncementPostPublishRefresh,
    ensureAnnouncementPostDeleteRefresh,
    ensureAnnouncementPostDraftRefresh,
    ensureAnnouncementPostViewedRefresh,
    ensureAnnouncementPostPushRefresh,
    ensureAnnouncementPostRouteRefresh,
    ensureAnnouncementPostImageOpenRefresh,
    ensureAnnouncementPostExpandedRefresh,
    ensureAnnouncementPostComposerDismiss,
    ensureAnnouncementPostSelectionClear,
    ensureAnnouncementPostPreviewDismiss,
    ensureAnnouncementPostDraftDiscardBack,
    ensureAnnouncementPostDraftDiscardHome,
    ensureAnnouncementPostComposerClear,
    ensureAnnouncementPostLocalCacheWrite,
    ensureAnnouncementPostLocalCacheLoad,
    ensureAnnouncementPostAllViewed,
    ensureAnnouncementPostUnreadFresh,
    ensureAnnouncementPostDraftRestore,
    ensureAnnouncementPostDraftPersist,
    ensureAnnouncementPostDraftClear,
    ensureAnnouncementPostPushTargetClear,
    ensureAnnouncementPostPushTargetSet,
    ensureAnnouncementPostErrorDismiss,
    ensureAnnouncementPostSuccessDismiss,
    ensureAnnouncementPostBlocking,
    ensureAnnouncementPostSubmitting,
    ensureAnnouncementPostComposerExpanded,
    ensureAnnouncementPostFocused,
    ensureAnnouncementPostSelection,
    ensureAnnouncementPostDraftBody,
    ensureAnnouncementPostDraftCover,
    ensureAnnouncementPostDraftEditingId,
    ensureAnnouncementPostDraftItems,
    ensureAnnouncementPostPublishedItems,
    ensureAnnouncementPostResetAllLocalState,
    ensureAnnouncementNoop
  } = createShowcaseAnnouncementActions({
    SHOWCASE_PAGE_SIZE,
    SHOWCASE_PUBLISHED_ANNOUNCEMENTS_KEY,
    ShowcaseScreens,
    adminAnnouncementBodyDraft,
    adminAnnouncementComposerExpanded,
    adminAnnouncementCoverDraftUrl,
    adminAnnouncementDraftItems,
    adminAnnouncementEditingId,
    adminAnnouncementIsSubmitting,
    adminAnnouncementPreviewId,
    adminAnnouncementSelectedIds,
    adminAnnouncementsPagination,
    announcementClickCountInFlightRef,
    announcements,
    announcementsBackTargetRef,
    announcementsEntryDotVisible,
    bindMerchantSessionToRepository,
    bookingsEntryDotVisible,
    clearAdminAnnouncementDraftLocalImages,
    clearAdminAnnouncementEditorDraftLocally,
    createUuidLikeId,
    deleteAppOwnedLocalFileUri,
    ensureValidMerchantSessionLoadedForCloud,
    formatDateTimeText,
    guardOfflineWriteOperation,
    handleMerchantAuthExpiredIfNeeded,
    isAppOwnedLocalFileUri,
    isLocalImageUri,
    loadCountedAnnouncementClickIdsLocally,
    loadPublishedAnnouncementsLocally,
    loadViewedAnnouncementIdsLocally,
    merchantSessionEnsureFailureMessage,
    merchantSessionEnsureSnackbarMessage,
    mergeUniqueById,
    nowMillis,
    onAnnouncementPushArrived,
    persistAdminAnnouncementEditorDraftLocally,
    persistPublishedAnnouncementsLocally,
    pruneAnnouncementMarksWhenCompletePageLoaded,
    publicAnnouncementsPagination,
    readJson,
    refreshAdminHomeCloudState,
    rememberLocalTempImage,
    removePendingSync,
    repository,
    resolveAnnouncementCoverDraftUrl,
    retryMerchantCloudOperationAfterAuthRefresh,
    saveCountedAnnouncementClickIdsLocally,
    saveViewedAnnouncementIdsLocally,
    screen,
    seenAnnouncementIds,
    setAdminAnnouncementBodyDraft,
    setAdminAnnouncementComposerExpanded,
    setAdminAnnouncementCoverDraftUrl,
    setAdminAnnouncementDraftItems,
    setAdminAnnouncementEditingId,
    setAdminAnnouncementError,
    setAdminAnnouncementIsBlocking,
    setAdminAnnouncementIsSubmitting,
    setAdminAnnouncementPreviewId,
    setAdminAnnouncementSelectedIds,
    setAdminAnnouncementSubmittingAction,
    setAdminAnnouncementSuccess,
    setAdminAnnouncementsPagination,
    setAnnouncements,
    setAnnouncementsEntryDotVisible,
    setFocusedAnnouncementId,
    setPreviousScreen,
    setPublicAnnouncementsPagination,
    setPushTargetAnnouncementId,
    setScreen,
    setSeenAnnouncementIds,
    setStatusMessage,
    setStoreMerchantSessionFromAuthSession,
    showSnackbar,
    sortedAnnouncementsForStorage,
    storeId,
    uploadAnnouncementCoverIfNeeded
  })

  const adminAnnouncementCards = useMemo<ShowcaseAnnouncementCard[]>(() => {
    return getAdminDraftCardsForUi()
  }, [adminAnnouncementDraftItems])

  async function ensureActiveConversation(): Promise<ChatConversation | null> {
    if (guardOfflineWriteOperation()) {
      setChatStatusMessage('You are offline. Please reconnect and try again.')
      return null
    }

    const role = currentChatRole()
    const activeIdFromRoute = String(activeConversationIdRef.current || activeConversationId || '').trim()
    const activeThread = activeIdFromRoute
      ? merchantChatThreads.find(thread => thread.conversationId === activeIdFromRoute) || null
      : null

    const effectiveConversationId = role === 'merchant'
      ? activeIdFromRoute
      : activeConversation?.id || repository.buildConversationId(storeId, clientId)

    const effectiveClientId = role === 'merchant'
      ? resolveMerchantClientIdForConversation(effectiveConversationId)
      : activeConversation?.clientId || clientId

    if (!effectiveConversationId || !effectiveClientId) {
      setChatStatusMessage(role === 'merchant'
        ? 'Conversation unavailable. Please reopen this customer chat.'
        : 'Conversation unavailable.'
      )
      return null
    }

    if (role === 'merchant' && !isStillActiveChatTarget('merchant', effectiveConversationId)) {
      setChatStatusMessage('Conversation changed. Please reopen this customer chat.')
      return null
    }

    const ok = await repository.upsertChatConversation(effectiveConversationId, storeId, effectiveClientId)

    if (!ok) {
      return null
    }

    if (role === 'merchant' && !isStillActiveChatTarget('merchant', effectiveConversationId)) {
      return null
    }

    const conversation = await repository.findOrCreateChatConversation({
      storeId,
      clientId: effectiveClientId,
      customerName: activeThread?.title || activeConversation?.customerName || DEFAULT_CUSTOMER_NAME,
      customerContact: activeConversation?.customerContact || effectiveClientId
    })

    if (!conversation) return null

    if (role === 'merchant' && !isStillActiveChatTarget('merchant', effectiveConversationId)) {
      return null
    }

    const resolvedConversation: ChatConversation = role === 'merchant'
      ? {
          ...conversation,
          id: effectiveConversationId,
          clientId: effectiveClientId,
          customerName: activeThread?.title || conversation.customerName || activeConversation?.customerName || DEFAULT_CUSTOMER_NAME,
          customerContact: conversation.customerContact || activeConversation?.customerContact || effectiveClientId,
          customerSeq: activeThread?.customerSeq || conversation.customerSeq || activeConversation?.customerSeq || null,
          updatedAt: activeThread?.lastMessageAt || conversation.updatedAt || activeConversation?.updatedAt || null
        }
      : conversation

    setActiveConversation(resolvedConversation)
    setActiveConversationId(resolvedConversation.id)
    setRuntimeActiveConversationId(resolvedConversation.id)
    activeConversationIdRef.current = resolvedConversation.id
    return resolvedConversation
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
      ? resolveMerchantClientIdForConversation(conversationId)
      : clientId

    if (!effectiveClientId) {
      setChatStatusMessage(role === 'merchant'
        ? 'Conversation unavailable. Please reopen this customer chat.'
        : 'Conversation unavailable.'
      )
      return
    }

    if (role === 'merchant' && !isStillActiveChatTarget('merchant', conversationId)) {
      return
    }

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

      if (
        chatMessageLoadSeqRef.current !== loadSeq ||
        !isStillActiveChatTarget('merchant', conversationId)
      ) {
        return
      }

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
        ? resolveMerchantClientIdForConversation(conversationId)
        : clientId

      if (!effectiveClientId) {
        setChatStatusMessage('Conversation unavailable. Please reopen this customer chat.')
        return
      }

      if (role === 'merchant' && !isStillActiveChatTarget('merchant', conversationId)) {
        return
      }

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
        ? resolveMerchantClientIdForConversation(conversationId)
        : clientId

      if (!effectiveClientId) {
        setChatStatusMessage('Conversation unavailable. Please reopen this customer chat.')
        return
      }

      if (role === 'merchant' && !isStillActiveChatTarget('merchant', conversationId)) {
        return
      }

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
    const restoreSeq = beginChatRestoreTask()

    setChatMode('Client')

    const existingConversation = await repository.findChatConversation({
      storeId,
      clientId
    })

    if (!isCurrentChatRestoreTask(restoreSeq) || currentChatRole() !== 'user') {
      return
    }

    const conversationId = existingConversation?.id || repository.buildConversationId(storeId, clientId)

    if (!conversationId) return

    const conversation: ChatConversation = existingConversation || {
      id: conversationId,
      storeId,
      clientId,
      merchantAuthUserId: null,
      customerName: DEFAULT_CUSTOMER_NAME,
      customerContact: '',
      customerSeq: null,
      createdAt: null,
      updatedAt: null
    }

    if (!isCurrentChatRestoreTask(restoreSeq) || currentChatRole() !== 'user') {
      return
    }

    resetChatTransientStateForConversation(conversation.id, pendingProduct, pendingAppointment)

    activeConversationIdRef.current = conversation.id
    setActiveConversation(conversation)
    setActiveConversationId(conversation.id)
    setRuntimeActiveConversationId(conversation.id)

    if (existingConversation) {
      void registerChatClientPushDevice(conversation.id, 'client-chat-context-restored', true)
    }

    const showedLocalMessages = await applyLocalChatMessagesFirst(conversation.id)

    if (!isCurrentChatRestoreTask(restoreSeq) || !isStillActiveChatTarget('user', conversation.id)) {
      return
    }

    if (showedLocalMessages) {
      if (existingConversation) {
        void refreshChatMessages(conversation.id, true, true)
        await acknowledgeVisibleClientConversation(conversation.id)
      }
      return
    }

    if (existingConversation) {
      await refreshChatMessages(conversation.id, true, true)

      if (!isCurrentChatRestoreTask(restoreSeq) || !isStillActiveChatTarget('user', conversation.id)) {
        return
      }

      await acknowledgeVisibleClientConversation(conversation.id)
    }
  }

  async function restoreMerchantChatContext(conversationIdInput?: string | null): Promise<void> {
    const restoreSeq = beginChatRestoreTask()

    setChatMode('Merchant')

    const conversationId = String(conversationIdInput || activeConversationId || '').trim()
    if (!conversationId) return

    const thread = merchantChatThreads.find(item => item.conversationId === conversationId) || null
    const restoredClientId = thread?.clientId || extractClientIdFromConversationId(conversationId)

    resetChatTransientStateForConversation(conversationId)

    activeConversationIdRef.current = conversationId
    setActiveConversationId(conversationId)
    setRuntimeActiveConversationId(conversationId)

    setActiveConversation(restoredClientId
      ? {
          id: conversationId,
          storeId,
          clientId: restoredClientId,
          merchantAuthUserId: merchantSession?.authUserId || null,
          customerName: thread?.title || DEFAULT_CUSTOMER_NAME,
          customerContact: thread?.clientId || restoredClientId,
          customerSeq: Number(thread?.customerSeq || 0) > 0 ? Math.trunc(Number(thread?.customerSeq)) : null,
          createdAt: null,
          updatedAt: thread?.lastMessageAt || null
        }
      : null
    )

    if (!restoredClientId) {
      setChatStatusMessage('Conversation unavailable. Please reopen this customer chat.')
      return
    }

    const showedLocalMessages = await applyLocalChatMessagesFirst(conversationId)

    if (!isCurrentChatRestoreTask(restoreSeq) || !isStillActiveChatTarget('merchant', conversationId)) {
      return
    }

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
    const role = currentChatRole()
    const conversationId = role === 'merchant'
      ? String(activeConversationIdRef.current || activeConversationId || '').trim()
      : String(activeConversationIdRef.current || activeConversationId || '').trim()
    const syncScope = `${role}:${conversationId}`

    if (chatSyncScopeRef.current === syncScope) return

    chatSyncScopeRef.current = syncScope
    setChatStatusMessage(null)

    try {
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

        if (conversationId && canLoadFullMessages) {
          await refreshChatMessages(conversationId, true, true)
        }

        if (
          currentChatRole() !== 'merchant' ||
          String(activeConversationIdRef.current || activeConversationId || '').trim() !== conversationId
        ) {
          return
        }

        await mergeLatestMerchantThreadsIntoState(traceId)

        return
      }

      if (!conversationId) return

      if (canLoadFullMessages) {
        await refreshChatMessages(conversationId, true, true)
      }
    } catch {
      setChatStatusMessage('Chat sync failed.')
    } finally {
      if (chatSyncScopeRef.current === syncScope) {
        chatSyncScopeRef.current = null
      }
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

  async function awaitWebPushRegistrationToken(): Promise<NdjcPushRegistrationTokenResult | null> {
    if (!isBrowser()) return null

    try {
      const registrationToken = await getNdjcPushRegistrationTokenForCurrentBrowser()

      if (!registrationToken) {
        setPushToken(null)
        return null
      }

      window.localStorage.setItem('ndjc_showcase_push_token', registrationToken.token)
      setPushToken(registrationToken.token)
      return registrationToken
    } catch (error) {
      console.warn('[NDJC_PUSH] Failed to get Web Push registration token.', error)
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
    const registrationToken = await awaitWebPushRegistrationToken()
    if (!registrationToken) return false

    const token = registrationToken.token

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
      platform: registrationToken.platform,
      appVersion: registrationToken.appVersion,
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

    if (!force && shouldThrottlePushRegistration(key, reason)) {
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

  async function registerAppointmentClientPushDevice(
    reason: string,
    force = false
  ): Promise<void> {
    if (!isBrowser()) return
    if (isAdminLoggedIn) return
    if (currentChatRole() === 'merchant') return

    const key = [
      storeId,
      'appointment_client',
      clientId
    ].join(':')

    if (!force && appointmentClientPushRegistrationKeyRef.current === key) {
      console.log('[NDJC_PUSH] Skip duplicate appointment client push registration.', {
        reason,
        storeId,
        clientId
      })
      return
    }

    if (!force && shouldThrottlePushRegistration(key, reason)) {
      return
    }

    appointmentClientPushRegistrationKeyRef.current = key

    console.log('[NDJC_PUSH] Register appointment client push device start.', {
      reason,
      storeId,
      clientId,
      conversationId: '__appointment_client__',
      screen
    })

    const registered = await ensurePushRegistration({
      audience: 'appointment_client',
      conversationId: '__appointment_client__'
    })

    console.log('[NDJC_PUSH] Register appointment client push device result.', {
      reason,
      registered,
      storeId,
      clientId,
      conversationId: '__appointment_client__',
      deviceInstallId: canUseLocalStorage()
        ? window.localStorage.getItem(NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY)
        : null,
      code: repository.lastUpsertCode,
      body: repository.lastUpsertBody
    })

    if (!registered) {
      appointmentClientPushRegistrationKeyRef.current = ''
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

    if (!force && shouldThrottlePushRegistration(merchantKey, reason)) {
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

    const conversationId = String(activeConversationId || activeConversationIdRef.current || '').trim()
    if (!conversationId) return

    const isClientChatScreen =
      screen === ShowcaseScreens.Chat ||
      screen === ShowcaseScreens.ChatMedia ||
      screen === ShowcaseScreens.ChatSearchResults

    if (!isClientChatScreen) return

    void registerChatClientPushDevice(conversationId, 'client-chat-screen')

    const handleWindowFocus = (): void => {
      void registerChatClientPushDevice(conversationId, 'client-chat-window-focus', true)
    }

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        void registerChatClientPushDevice(conversationId, 'client-chat-document-visible', true)
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
    activeConversationId,
    clientId,
    storeId
  ])

  useEffect(() => {
    if (!isBrowser()) return
    if (isAdminLoggedIn) return
    if (currentChatRole() === 'merchant') return
    if (screen !== ShowcaseScreens.CustomerBookings) return

    void registerAppointmentClientPushDevice('customer-bookings-screen')

    const handleWindowFocus = (): void => {
      void registerAppointmentClientPushDevice('customer-bookings-window-focus', true)
    }

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        void registerAppointmentClientPushDevice('customer-bookings-document-visible', true)
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
    clientId,
    storeId
  ])

  function normalizeChatPushTitleText(valueInput: string | null | undefined): string {
    const value = String(valueInput || '').replace(/\s+/g, ' ').trim()

    if (!value || value.toLowerCase() === 'null' || value.toLowerCase() === 'undefined') {
      return ''
    }

    return value
  }

  function resolveCustomerChatPushSenderName(conversationIdInput: string): string {
    const conversationId = String(conversationIdInput || '').trim()

    if (conversationId) {
      const thread = merchantChatThreads.find(item => item.conversationId === conversationId)
      const threadTitle = normalizeChatPushTitleText(thread?.title)

      if (threadTitle) return threadTitle
    }

    if (activeConversation?.id === conversationId) {
      const customerName = normalizeChatPushTitleText(activeConversation.customerName)

      if (customerName && customerName !== DEFAULT_CUSTOMER_NAME) return customerName

      const customerSeq = Number(activeConversation.customerSeq || 0)

      if (Number.isFinite(customerSeq) && customerSeq > 0) {
        return `Customer #${Math.trunc(customerSeq)}`
      }
    }

    return DEFAULT_CUSTOMER_NAME
  }

  function resolveChatPushSenderName(senderRoleInput: string, conversationIdInput: string): string {
    const senderRole = senderRoleInput.trim().toLowerCase()

    if (senderRole === 'merchant') {
      return storeProfile?.displayName || storeProfileForUi.displayName || 'Store'
    }

    return resolveCustomerChatPushSenderName(conversationIdInput)
  }

  async function ensureAnnouncementPushTargetVisible(announcementIdInput: string): Promise<boolean> {
    const announcementId = announcementIdInput.trim()
    if (!announcementId) return false

    const currentItems = announcements
      .filter(item => item.status === 'published')
      .map(item => ({
        ...item,
        status: 'published' as const
      }))

    if (currentItems.some(item => item.id === announcementId)) {
      return true
    }

    const pageSize = SHOWCASE_PAGE_SIZE.publicAnnouncements
    let offset = 0
    let hasMore = true
    let found = false
    let collectedItems: CloudAnnouncement[] = []

    while (hasMore && !found) {
      const latest = await repository.fetchAnnouncements({
        storeId,
        includeDrafts: false,
        limit: pageSize,
        offset
      })

      const publishedItems = latest
        .filter(item => item.status === 'published')
        .map(item => ({
          ...item,
          status: 'published' as const
        }))

      collectedItems = sortedAnnouncementsForStorage(
        mergeUniqueById(collectedItems, publishedItems)
      )

      found = publishedItems.some(item => item.id === announcementId)
      offset += latest.length
      hasMore = latest.length >= pageSize

      if (!latest.length) {
        break
      }
    }

    if (!collectedItems.length) {
      const cachedItems = loadPublishedAnnouncementsLocally(storeId)
        .filter(item => item.status === 'published')
        .map(item => ({
          ...item,
          status: 'published' as const
        }))

      const cachedHasTarget = cachedItems.some(item => item.id === announcementId)

      if (cachedHasTarget) {
        const mergedCachedItems = sortedAnnouncementsForStorage(
          mergeUniqueById(currentItems, cachedItems)
        )

        setAnnouncements(mergedCachedItems)
        setAnnouncementsEntryDotVisible(computeAnnouncementsEntryDot(mergedCachedItems))
        persistPublishedAnnouncementsLocally(storeId, mergedCachedItems)

        return true
      }

      return false
    }

    const mergedItems = sortedAnnouncementsForStorage(
      mergeUniqueById(currentItems, collectedItems)
    )

    setAnnouncements(mergedItems)
    setAnnouncementsEntryDotVisible(computeAnnouncementsEntryDot(mergedItems))
    persistPublishedAnnouncementsLocally(storeId, mergedItems)
    setPublicAnnouncementsPagination({
      nextOffset: Math.max(offset, pageSize),
      hasMore,
      isLoadingMore: false
    })

    return mergedItems.some(item => item.id === announcementId)
  }

  async function onAnnouncementPushArrived(announcementIdInput: string): Promise<void> {
    const announcementId = announcementIdInput.trim()
    if (!announcementId) {
      setPendingShowcasePushRoute(null)
      return
    }

    announcementsBackTargetRef.current = ShowcaseScreens.Home

    setPendingShowcasePushRoute({
      type: 'announcement',
      announcementId
    })

    setPreviousScreen(ShowcaseScreens.Home)
    setScreen(ShowcaseScreens.Announcements)

    try {
      const targetVisible = await ensureAnnouncementPushTargetVisible(announcementId)

      if (targetVisible) {
        await ensureAnnouncementViewed(announcementId)
        setFocusedAnnouncementId(announcementId)
      } else {
        setFocusedAnnouncementId(null)
        setStatusMessage('Announcement unavailable.')
      }
    } finally {
      setPendingShowcasePushRoute(null)
    }
  }

  function adminAppointmentStatusFilterForPushType(pushTypeInput?: string | null): string {
    const pushType = String(pushTypeInput || '').trim().toLowerCase()

    if (pushType === 'appointment_cancelled') {
      return 'Cancelled by customer'
    }

    return 'Pending'
  }

  async function ensureAdminAppointmentPushTargetVisible(
    appointmentIdInput: string,
    statusFilterInput = 'Pending'
  ): Promise<boolean> {
    const appointmentId = appointmentIdInput.trim()
    if (!appointmentId) return false

    const targetStatusFilter = String(statusFilterInput || 'Pending').trim() || 'Pending'

    const pushFilters = currentAdminAppointmentCloudFilters({
      dateFilter: 'All',
      statusFilter: targetStatusFilter,
      serviceFilter: 'All',
      historyDateFilter: null
    })

    setAppointmentAdminDateFilter('All')
    setAppointmentAdminHistoryDateFilter(null)
    setAppointmentAdminStatusFilter(targetStatusFilter)
    setAppointmentAdminServiceFilter('All')
    setFocusedAdminAppointmentId(null)
    setAppointmentsRefreshing(true)

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setStatusMessage(merchantSessionEnsureFailureMessage())
        setAdminAppointmentFilterRows([])
        return false
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

      const pageSize = SHOWCASE_PAGE_SIZE.merchantAppointments
      let offset = 0
      let hasMore = true
      let found = false
      let collectedItems: CloudAppointmentRequest[] = []

      while (hasMore && !found) {
        const latest = await repository.fetchAppointmentRequests({
          storeId,
          merchant: true,
          preferredDate: pushFilters.preferredDate,
          preferredDateGte: pushFilters.preferredDateGte,
          preferredDateLt: pushFilters.preferredDateLt,
          status: pushFilters.status,
          cancelledBy: pushFilters.cancelledBy,
          cancelledByNot: pushFilters.cancelledByNot,
          serviceTitle: pushFilters.serviceTitle,
          limit: pageSize,
          offset
        })

        collectedItems = sortedAppointmentsForStorage(
          mergeUniqueById(collectedItems, latest)
        )

        found = latest.some(item => item.id === appointmentId)
        offset += latest.length
        hasMore = latest.length >= pageSize

        if (!latest.length) {
          break
        }
      }

      if (!collectedItems.length) {
        const cachedItems = loadAppointmentsFromStorage(storeId)

        if (cachedItems.length) {
          setAppointmentRequests(cachedItems)
          resetAdminAppointmentsPaginationForFirstPage(cachedItems.length)
        }

        setStatusMessage('Appointment unavailable.')
        return false
      }

      const sortedItems = sortedAppointmentsForStorage(collectedItems)
      const targetVisible = collectedItems.some(item => item.id === appointmentId)

      setAppointmentRequests(sortedItems)
      persistAppointmentsLocally(storeId, sortedItems)
      updateAdminPendingAppointmentCountSnapshotFromItems(sortedItems)
      void hydrateAppointmentLinkedDishesFromRequests(sortedItems)
      setAdminAppointmentsPagination({
        nextOffset: offset,
        hasMore,
        isLoadingMore: false
      })

      if (!targetVisible) {
        setStatusMessage('Appointment unavailable.')
      } else {
        setStatusMessage(null)
      }

      return targetVisible
    } catch (error) {
      const cachedItems = loadAppointmentsFromStorage(storeId)

      if (cachedItems.length) {
        setAppointmentRequests(cachedItems)
        resetAdminAppointmentsPaginationForFirstPage(cachedItems.length)
      }

      const message = error instanceof Error
        ? error.message
        : 'Appointments refresh failed.'

      setStatusMessage(message || 'Appointment unavailable.')
      return false
    } finally {
      setAppointmentsRefreshing(false)
    }
  }

  function customerAppointmentStatusFilterForPush(input: {
    pushType?: string | null
    appointmentStatus?: string | null
  }): string {
    const pushType = String(input.pushType || '').trim().toLowerCase()
    const status = String(input.appointmentStatus || '').trim()

    if (pushType === 'appointment_created') {
      return 'Pending'
    }

    if (pushType === 'appointment_cancelled') {
      return 'Cancelled by customer'
    }

    if (pushType === 'appointment_status' && status) {
      return appointmentStatusFromCloud(status)
    }

    return 'All'
  }

  async function ensureCustomerAppointmentPushTargetVisible(
    appointmentIdInput: string,
    statusFilterInput = 'All'
  ): Promise<boolean> {
    const appointmentId = appointmentIdInput.trim()
    if (!appointmentId) return false

    const targetStatusFilter = String(statusFilterInput || 'All').trim() || 'All'

    const pushFilters = currentCustomerAppointmentCloudFilters({
      dateFilter: 'All',
      statusFilter: targetStatusFilter,
      serviceFilter: 'All'
    })

    setAppointmentCustomerDateFilter('All')
    setAppointmentCustomerStatusFilter(targetStatusFilter)
    setAppointmentCustomerServiceFilter('All')
    setFocusedCustomerAppointmentId(null)
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

      const pageSize = SHOWCASE_PAGE_SIZE.clientAppointments
      let offset = 0
      let hasMore = true
      let found = false
      let collectedItems: CloudAppointmentRequest[] = []

      while (hasMore && !found) {
        const latest = await repository.fetchAppointmentRequests({
          storeId,
          clientId,
          merchant: false,
          preferredDate: pushFilters.preferredDate,
          preferredDateGte: pushFilters.preferredDateGte,
          preferredDateLt: pushFilters.preferredDateLt,
          status: pushFilters.status,
          cancelledBy: pushFilters.cancelledBy,
          cancelledByNot: pushFilters.cancelledByNot,
          serviceTitle: pushFilters.serviceTitle,
          limit: pageSize,
          offset
        })

        collectedItems = sortedAppointmentsForStorage(
          mergeUniqueById(collectedItems, latest)
        )

        found = latest.some(item => item.id === appointmentId)
        offset += latest.length
        hasMore = latest.length >= pageSize

        if (!latest.length) {
          break
        }
      }

      if (!collectedItems.length) {
        setStatusMessage('Booking unavailable.')
        return false
      }

      const sortedItems = sortedAppointmentsForStorage(collectedItems)
      const targetVisible = collectedItems.some(item => item.id === appointmentId)

      setAppointmentRequests(sortedItems)
      persistAppointmentsLocally(storeId, sortedItems)
      void hydrateAppointmentLinkedDishesFromRequests(sortedItems)
      setCustomerAppointmentsPagination({
        nextOffset: offset,
        hasMore,
        isLoadingMore: false
      })

      if (!targetVisible) {
        setStatusMessage('Booking unavailable.')
      } else {
        setStatusMessage(null)
      }

      return targetVisible
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Bookings refresh failed.'

      setStatusMessage(message || 'Booking unavailable.')
      return false
    } finally {
      setAppointmentsRefreshing(false)
    }
  }

  function showcasePushRouteToViewModelRoute(route: ShowcasePushRoute): {
    type: 'chat' | 'announcement' | 'appointment'
    pushType?: string | null
    conversationId?: string | null
    announcementId?: string | null
    appointmentId?: string | null
    appointmentStatus?: string | null
    targetClientId?: string | null
    openAs?: string | null
    source?: string | null
  } | null {
    const pushType = route.pushType.trim().toLowerCase()

    if (
      pushType === 'chat' ||
      pushType === 'message' ||
      pushType === 'chat_message'
    ) {
      return {
        type: 'chat',
        pushType,
        conversationId: route.conversationId,
        openAs: route.openAs,
        source: route.source
      }
    }

    if (pushType === 'announcement' || pushType === 'announcements') {
      return {
        type: 'announcement',
        pushType,
        announcementId: route.announcementId,
        openAs: route.openAs,
        source: route.source
      }
    }

    if (
      pushType === 'appointment' ||
      pushType === 'booking' ||
      pushType === 'bookings' ||
      pushType === 'appointment_created' ||
      pushType === 'appointment_status' ||
      pushType === 'appointment_cancelled'
    ) {
      return {
        type: 'appointment',
        pushType,
        appointmentId: route.appointmentId,
        appointmentStatus: route.appointmentStatus,
        targetClientId: route.targetClientId,
        openAs: route.openAs,
        source: route.source
      }
    }

    return null
  }

  async function handlePushRoute(routeInput: {
    type: 'chat' | 'announcement' | 'appointment'
    pushType?: string | null
    conversationId?: string | null
    announcementId?: string | null
    appointmentId?: string | null
    appointmentStatus?: string | null
    targetClientId?: string | null
    openAs?: string | null
    source?: string | null
  }): Promise<void> {
    setPendingShowcasePushRoute(routeInput)

    const openAs = String(routeInput.openAs || '').trim().toLowerCase()
    const merchantRuntimeLoggedIn = isAdminLoggedInRef.current || isMerchantLoggedInInStoreSession()

    if (openAs === 'merchant' && !merchantRuntimeLoggedIn) {
      if (!merchantAuthRestoredRef.current) {
        return
      }

      setPreviousScreen(currentScreenRef.current)
      prepareLoginScreen(null)
      setScreen('Login')
      return
    }

    if (routeInput.type === 'chat') {
      const pushedConversationId = String(routeInput.conversationId || '').trim()
      const shouldOpenAsMerchant = openAs === 'merchant' || Boolean(pushedConversationId && isAdminLoggedInRef.current)
      const isClientChatPush = openAs === 'customer' || openAs === 'client'
      const currentVisibleScreen = currentScreenRef.current
      const currentVisibleConversationId = String(activeConversationIdRef.current || activeConversationId || '').trim()
      const localClientConversationId = repository.buildConversationId(storeId, clientId)
      const isViewingMerchantChat =
        currentChatRole() === 'merchant' &&
        Boolean(currentVisibleConversationId) &&
        (
          currentVisibleScreen === ShowcaseScreens.Chat ||
          currentVisibleScreen === ShowcaseScreens.ChatMedia ||
          currentVisibleScreen === ShowcaseScreens.ChatSearchResults
        )

      if (
        isClientChatPush &&
        pushedConversationId &&
        localClientConversationId &&
        pushedConversationId !== localClientConversationId
      ) {
        setPendingShowcasePushRoute(null)
        return
      }

      if (isClientChatPush && isViewingMerchantChat) {
        setPendingShowcasePushRoute(null)
        return
      }

      invalidateChatRestoreTasks()

      if (openAs === 'customer' || openAs === 'client') {
        chatBackTargetRef.current = ShowcaseScreens.Home
        setPreviousScreen(ShowcaseScreens.Home)
        stopMerchantChatListPolling()
        stopMerchantChatListDbObserve()
        await restoreClientChatContext()
      } else if (shouldOpenAsMerchant && pushedConversationId) {
        chatBackTargetRef.current = ShowcaseScreens.MerchantChatList
        setPreviousScreen(ShowcaseScreens.MerchantChatList)
        stopChatPolling()
        stopChatDbObserve()
        stopMerchantChatListPolling()
        stopMerchantChatListDbObserve()
        setChatMode('Merchant')
        activeConversationIdRef.current = pushedConversationId
        setActiveConversationId(pushedConversationId)
        setRuntimeActiveConversationId(pushedConversationId)
        await restoreMerchantChatContext(pushedConversationId)
      } else if (pushedConversationId) {
        chatBackTargetRef.current = ShowcaseScreens.Home
        setPreviousScreen(ShowcaseScreens.Home)
        stopMerchantChatListPolling()
        stopMerchantChatListDbObserve()
        await restoreClientChatContext()
      } else {
        chatBackTargetRef.current = ShowcaseScreens.Home
        setPreviousScreen(ShowcaseScreens.Home)
        stopMerchantChatListPolling()
        stopMerchantChatListDbObserve()
        await restoreClientChatContext()
      }

      if (
        shouldOpenAsMerchant &&
        pushedConversationId &&
        !isStillActiveChatTarget('merchant', pushedConversationId)
      ) {
        return
      }

      setChatStatusMessage(null)
      setRuntimeChatVisible(true)
      setScreen(ShowcaseScreens.Chat)
      startChatDbObserve()
      startChatPolling()
      await syncChat()
      setPendingShowcasePushRoute(null)
      return
    }

    if (routeInput.type === 'announcement') {
      await onAnnouncementPushArrived(routeInput.announcementId || '')
      setPendingShowcasePushRoute(null)
      return
    }

    if (routeInput.type === 'appointment') {
      const pushedAppointmentId = String(routeInput.appointmentId || '').trim()
      const pushedTargetClientId = String(routeInput.targetClientId || '').trim()
      const targetAdminStatusFilter = adminAppointmentStatusFilterForPushType(routeInput.pushType)
      const targetCustomerStatusFilter = customerAppointmentStatusFilterForPush({
        pushType: routeInput.pushType,
        appointmentStatus: routeInput.appointmentStatus
      })

      setPreviousScreen(currentScreenRef.current)

      if (openAs === 'merchant') {
        setScreen('AdminAppointmentManager')

        if (pushedAppointmentId) {
          const targetVisible = await ensureAdminAppointmentPushTargetVisible(
            pushedAppointmentId,
            targetAdminStatusFilter
          )

          if (targetVisible) {
            setFocusedAdminAppointmentId(pushedAppointmentId)
          }
        } else {
          setAppointmentAdminDateFilter('All')
          setAppointmentAdminHistoryDateFilter(null)
          setAppointmentAdminStatusFilter(targetAdminStatusFilter)
          setAppointmentAdminServiceFilter('All')

          await refreshAdminAppointmentsFromCloud(null, currentAdminAppointmentCloudFilters({
            dateFilter: 'All',
            statusFilter: targetAdminStatusFilter,
            serviceFilter: 'All',
            historyDateFilter: null
          }))
        }

        setPendingShowcasePushRoute(null)
        return
      }

      if (openAs === 'customer' || openAs === 'client') {
        if (pushedTargetClientId && pushedTargetClientId !== clientId) {
          setPendingShowcasePushRoute(null)
          return
        }

        setScreen('CustomerBookings')

        if (pushedAppointmentId) {
          const targetVisible = await ensureCustomerAppointmentPushTargetVisible(
            pushedAppointmentId,
            targetCustomerStatusFilter
          )

          if (targetVisible) {
            setFocusedCustomerAppointmentId(pushedAppointmentId)
          }
        } else {
          setAppointmentCustomerDateFilter('All')
          setAppointmentCustomerStatusFilter(targetCustomerStatusFilter)
          setAppointmentCustomerServiceFilter('All')

          await refreshCustomerAppointmentsFromCloud(null, currentCustomerAppointmentCloudFilters({
            dateFilter: 'All',
            statusFilter: targetCustomerStatusFilter,
            serviceFilter: 'All'
          }))
        }

        setPendingShowcasePushRoute(null)
        return
      }

      if (isAdminLoggedInRef.current) {
        setScreen('AdminAppointmentManager')

        if (pushedAppointmentId) {
          const targetVisible = await ensureAdminAppointmentPushTargetVisible(
            pushedAppointmentId,
            targetAdminStatusFilter
          )

          if (targetVisible) {
            setFocusedAdminAppointmentId(pushedAppointmentId)
          }
        } else {
          setAppointmentAdminDateFilter('All')
          setAppointmentAdminHistoryDateFilter(null)
          setAppointmentAdminStatusFilter(targetAdminStatusFilter)
          setAppointmentAdminServiceFilter('All')

          await refreshAdminAppointmentsFromCloud(null, currentAdminAppointmentCloudFilters({
            dateFilter: 'All',
            statusFilter: targetAdminStatusFilter,
            serviceFilter: 'All',
            historyDateFilter: null
          }))
        }

        setPendingShowcasePushRoute(null)
        return
      }

      if (pushedTargetClientId && pushedTargetClientId !== clientId) {
        setPendingShowcasePushRoute(null)
        return
      }

      setScreen('CustomerBookings')

      if (pushedAppointmentId) {
        const targetVisible = await ensureCustomerAppointmentPushTargetVisible(
          pushedAppointmentId,
          targetCustomerStatusFilter
        )

        if (targetVisible) {
          setFocusedCustomerAppointmentId(pushedAppointmentId)
        }
      } else {
        setAppointmentCustomerDateFilter('All')
        setAppointmentCustomerStatusFilter(targetCustomerStatusFilter)
        setAppointmentCustomerServiceFilter('All')

        await refreshCustomerAppointmentsFromCloud(null, currentCustomerAppointmentCloudFilters({
          dateFilter: 'All',
          statusFilter: targetCustomerStatusFilter,
          serviceFilter: 'All'
        }))
      }

      setPendingShowcasePushRoute(null)
    }
  }

  handlePushRouteRef.current = handlePushRoute

  useEffect(() => {
    const uninstall = installShowcasePushRouter()
    const unsubscribe = subscribeShowcasePushRoute(route => {
      const viewModelRoute = showcasePushRouteToViewModelRoute(route)
      if (!viewModelRoute) return

      if (
        viewModelRoute.type === 'chat' &&
        viewModelRoute.conversationId &&
        shouldSuppressRuntimeChatPush(viewModelRoute.conversationId, {
          source: viewModelRoute.source
        })
      ) {
        consumeShowcasePushRoute(route)
        return
      }

      const pushHandler = handlePushRouteRef.current
      if (!pushHandler) return

      void pushHandler(viewModelRoute).then(() => {
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
  }, [storeId])

  async function dispatchNewAppointmentPushToMerchant(appointment: CloudAppointmentRequest): Promise<void> {
    const body = formatNewAppointmentMerchantPushBody(appointment)

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

  async function dispatchCustomerCancelledAppointmentPushToMerchant(appointment: CloudAppointmentRequest): Promise<void> {
  const body = formatCancelledAppointmentMerchantPushBody(appointment)

  console.log('[NDJC_PUSH] Customer cancelled appointment push to merchant started.', {
    storeId,
    appointmentId: appointment.id,
    clientId: appointment.clientId,
    targetAudience: 'appointment_merchant',
    actor: 'public',
    pushType: 'appointment_cancelled'
  })

  const pushOk = await repository.dispatchAppointmentPush({
    storeId,
    appointmentId: appointment.id,
    targetAudience: 'appointment_merchant',
    openAs: 'merchant',
    actor: 'public',
    pushType: 'appointment_cancelled',
    scopeClientId: appointment.clientId,
    targetClientId: appointment.clientId,
    title: 'Booking cancelled by customer',
    body,
    bodyPreview: body
  })

  console.log('[NDJC_PUSH] Customer cancelled appointment push to merchant finished.', {
    storeId,
    appointmentId: appointment.id,
    clientId: appointment.clientId,
    pushOk,
    code: repository.lastAnnouncementPushCode,
    responseBody: repository.lastAnnouncementPushBody
  })

  if (!pushOk) {
    const detail = [
      repository.lastAnnouncementPushCode != null ? `code=${repository.lastAnnouncementPushCode}` : '',
      repository.lastAnnouncementPushBody ? `body=${repository.lastAnnouncementPushBody.slice(0, 500)}` : ''
    ].filter(Boolean).join(' ')

    console.error('[NDJC_PUSH] Customer cancelled appointment push to merchant failed.', {
      storeId,
      appointmentId: appointment.id,
      clientId: appointment.clientId,
      code: repository.lastAnnouncementPushCode,
      body: repository.lastAnnouncementPushBody
    })

    throw new Error(detail || 'Customer cancelled appointment push to merchant failed.')
  }
}
  async function dispatchAppointmentStatusPushToCustomer(appointment: CloudAppointmentRequest, nextStatus: string): Promise<void> {
    const targetClientId = appointment.clientId.trim()

    if (!targetClientId) return

    const body = formatAppointmentStatusCustomerPushBody(appointment)

    let pushOk = await repository.dispatchAppointmentPush({
      storeId,
      appointmentId: appointment.id,
      targetAudience: 'appointment_client',
      openAs: 'client',
      targetClientId,
      actor: 'merchant',
      pushType: 'appointment_status',
      appointmentStatus: nextStatus,
      title: appointmentStatusPushTitle(nextStatus),
      body,
      bodyPreview: body
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
          pushType: 'appointment_status',
          appointmentStatus: nextStatus,
          title: appointmentStatusPushTitle(nextStatus),
          body,
          bodyPreview: body
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

    if (currentChatRole() !== 'merchant') {
      void registerChatClientPushDevice(conversation.id, 'client-chat-message-sent', true)
    }

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
      title: resolveChatPushSenderName(senderRole, conversation.id),
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
      customerSeq: null,
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

    const restoreSeq = beginChatRestoreTask()
    const thread = merchantChatThreads.find(item => item.conversationId === conversationId) || null
    const threadTitle = titleInput?.trim() || thread?.title || 'Chat'
    const resolvedClientId = thread?.clientId || extractClientIdFromConversationId(conversationId)

    if (!resolvedClientId) {
      setChatStatusMessage('Conversation unavailable. Please reopen this customer chat.')
      return
    }

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

    if (!isCurrentChatRestoreTask(restoreSeq)) {
      return
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
    setActiveConversation({
      id: conversationId,
      storeId,
      clientId: resolvedClientId,
      merchantAuthUserId: validSession?.authUserId || null,
      customerName: threadTitle,
      customerContact: thread?.clientId || resolvedClientId,
      customerSeq: Number(thread?.customerSeq || 0) > 0 ? Math.trunc(Number(thread?.customerSeq)) : null,
      createdAt: null,
      updatedAt: thread?.lastMessageAt || null
    })

    setPreviousScreen(ShowcaseScreens.MerchantChatList)
    setChatStatusMessage(
      isOffline
        ? 'You are offline. Viewing cached messages.'
        : null
    )
    setScreen(ShowcaseScreens.Chat)

    const showedLocalMessages = await applyLocalChatMessagesFirst(conversationId)

    if (!isCurrentChatRestoreTask(restoreSeq) || !isStillActiveChatTarget('merchant', conversationId)) {
      return
    }

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
        title: resolveChatPushSenderName(senderRole, conversation.id),
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
        title: resolveChatPushSenderName(senderRole, conversation.id),
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
    const conversationId = String(activeConversationId || activeConversationIdRef.current || '').trim()

    markRuntimeConversationVisible(activeConversationId)
    setRuntimeChatVisible(true)
    postChatVisibilityToServiceWorker({
      visible: true,
      conversationId: activeConversationId,
      screen,
      clientId,
      chatRole: currentChatRole()
    })

    if (!isAdminLoggedIn && currentChatRole() !== 'merchant' && conversationId) {
      void registerChatClientPushDevice(conversationId, 'client-chat-visible', true)
    }

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
    itemEditorImageDraftDirtyRef.current = true

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

  function copyToClipboard(label: string, value: string): void {
    const text = value.trim()
    if (!text) return

    if (isBrowser() && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => undefined)
      showSnackbar('Copied')
      return
    }

    if (isBrowser() && typeof document !== 'undefined') {
      const previousActiveElement = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null

      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', 'true')
      textarea.style.position = 'fixed'
      textarea.style.left = '0'
      textarea.style.top = '0'
      textarea.style.width = '1px'
      textarea.style.height = '1px'
      textarea.style.opacity = '0'
      textarea.style.pointerEvents = 'none'
      textarea.style.zIndex = '-1'

      document.body.appendChild(textarea)

      try {
        textarea.focus({ preventScroll: true })
      } catch {
        textarea.focus()
      }

      textarea.select()
      textarea.setSelectionRange(0, textarea.value.length)

      try {
        document.execCommand('copy')
      } catch {
      }

      document.body.removeChild(textarea)

      if (previousActiveElement) {
        try {
          previousActiveElement.focus({ preventScroll: true })
        } catch {
          previousActiveElement.focus()
        }
      }
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

  const dateFilterOptions = appointmentFilterRowsToFutureDateOptions(
    adminAppointmentFilterRows,
    appointmentAdminStatusFilter.trim() || 'All',
    appointmentAdminServiceFilter.trim() || 'All'
  )

  const customerDateFilterOptions = [
    ...appointmentFilterRowsToFutureDateOptions(
      customerAppointmentFilterRows,
      appointmentCustomerStatusFilter.trim() || 'All',
      appointmentCustomerServiceFilter.trim() || 'All'
    ),
    'History'
  ]

  const statusFilterOptions = ['All', 'Pending', 'Confirmed', 'Cancelled', 'Cancelled by customer', 'Completed', 'No-show']

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

  const storeProfileActionHandlers = createShowcaseStoreProfileActions({
    setLastRetryOp,
    ShowcaseRetryOps,
    setIsRefreshingStoreProfile,
    repository,
    storeId,
    loadStoreProfileFromStorage,
    storeProfileFromCachedProfile,
    setStoreProfile,
    setStoreProfileServices,
    setStoreProfileExtraContacts,
    setStoreProfileCoverUrl,
    setStoreProfileLogoUrl,
    setDraftStoreProfileCoverUrl,
    setDraftStoreProfileLogoUrl,
    setDraftStoreProfileDescription,
    setDraftBusinessStatus,
    setDraftStoreProfileServices,
    setDraftStoreProfileExtraContacts,
    setStoreProfileDraft,
    storeProfileCloud,
    setIsEditingStoreProfile,
    screen,
    ShowcaseScreens,
    storeProfileDraftFromProfile,
    setStatusMessage,
    setSyncErrorMessage,
    storeProfileServices,
    storeProfileExtraContacts,
    storeProfileCoverUrl,
    storeProfileLogoUrl,
    parseJsonStringArray,
    parseExtraContacts,
    serializeServices,
    serializeExtraContacts,
    applyCloudStoreProfile,
    persistStoreProfileLocally,
    storeProfileDraft,
    setStoreProfileSaveError,
    draftStoreProfileExtraContacts,
    createId,
    draftStoreProfileServices,
    draftStoreProfileDescription,
    guardOfflineWriteOperation,
    setIsSavingStoreProfile,
    setStoreProfileSaveSuccess,
    isWriteAllowed,
    ensureValidMerchantSessionLoadedForCloud,
    merchantSessionEnsureFailureMessage,
    showSnackbar,
    merchantSessionEnsureSnackbarMessage,
    setStoreMerchantSessionFromAuthSession,
    bindMerchantSessionToRepository,
    draftStoreProfileLogoUrl,
    isLocalImageUri,
    createRemoteOnlyImageVariants,
    draftStoreProfileCoverUrl,
    nowMillis,
    retryMerchantCloudOperationAfterAuthRefresh,
    clearStoreProfileDraftLocalImages,
    storeProfileFromCloud,
    setStoreProfileCloud,
    writePersistedStoreProfileDraft,
    setLastSyncAt,
    removePendingSync,
    pushPendingSync,
    draftBusinessStatus,
    storeProfile,
    rememberLocalTempImage,
    isBrowser,
    pickAndUploadImageWithVariants,
    isAppOwnedLocalFileUri,
    deleteAppOwnedLocalFileUri,
    storeProfileDraftForUi,
    setPreviousScreen,
    setScreen
  })

  const {
    refreshStoreProfileFromCloud,
    refreshStoreProfile,
    saveStoreProfile,
    startEditStoreProfile,
    cancelEditStoreProfile,
    updateStoreProfileDraft,
    onStoreProfileDraftTitleChange,
    onStoreProfileDraftSubtitleChange,
    onStoreProfileDraftDescriptionChange,
    onStoreProfileDraftAddressChange,
    onStoreProfileDraftHoursChange,
    onStoreProfileDraftMapUrlChange,
    onStoreProfileDraftBusinessStatusChange,
    onStoreProfileDraftLogoUrlChange,
    onStoreProfileDraftCoverUrlChange,
    storeProfileDraftImageUrl,
    uploadStoreImageIfNeeded,
    onStoreProfileLogoPicked,
    onStoreProfileLogoRemove,
    onStoreProfileCoversPicked,
    onStoreProfileCoverRemove,
    onStoreProfileCoverMove,
    onStoreProfileCoverLimitReached,
    onStoreProfileServiceAdd,
    onStoreProfileServiceChange,
    onStoreProfileServiceRemove,
    onStoreProfileExtraContactAdd,
    onStoreProfileExtraContactNameChange,
    onStoreProfileExtraContactValueChange,
    onStoreProfileExtraContactRemove,
    normalizeStoreProfileForCompare,
    hasUnsavedStoreProfileDraft,
    discardStoreProfileDraftAndGoHome
  } = storeProfileActionHandlers

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

    appName: storePwaProfileCloud?.appName || assemblyAppName || 'App',
    versionName: SHOWCASE_APP_VERSION,
    merchantEmail: storePwaProfileCloud?.merchantEmail || assemblyMerchantEmail || 'Not provided',
    privacyUrl: assemblyPrivacyUrl || `/privacy/${encodeURIComponent(storeId)}`,
    poweredByUrl: SHOWCASE_OFFICIAL_WEBSITE_URL,

    draftBusinessStatus,

    logoUrl: selectStoreLogoUrl({
      logoUrl: storeProfileLogoUrl,
      logoImageVariants: storeProfileCloud?.logoImageVariants ?? null
    }) || storeProfileLogoUrl,
    coverUrl: storeProfileCoverUrl,
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
    hasUnsavedChanges: hasUnsavedStoreProfileDraft(),
    pendingExitTarget: storeProfilePendingExitTarget
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

    selectedCategory: manualCategories.includes(favoritesSelectedCategory || '')
      ? favoritesSelectedCategory
      : null,
    categories: favoriteCategories,
    manualCategories,

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
    cancellationSubmittingId: appointmentStatusSubmittingId,
    focusedCustomerAppointmentId,

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
    focusedAdminAppointmentId,

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
  const hasAnnouncementEditorCover = adminAnnouncementComposerExpanded && Boolean(adminAnnouncementCoverDraftUrl?.trim())
  const selectedAnnouncementDraftCount = adminAnnouncementSelectedIds.length
  const canPublishAnnouncementFromEditor = hasAnnouncementEditorCover && selectedAnnouncementDraftCount === 0
  const canPublishSelectedAnnouncementDraft = !hasAnnouncementEditorCover && selectedAnnouncementDraftCount === 1

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
    canSaveDraft: hasAnnouncementEditorCover && !adminAnnouncementIsSubmitting,
    canPublish: (
      canPublishAnnouncementFromEditor ||
      canPublishSelectedAnnouncementDraft
    ) && !adminAnnouncementIsSubmitting,

    draftItems: adminAnnouncementCards,

    selectedIds: adminAnnouncementSelectedIds,

    previewItem: adminAnnouncementPreviewId
      ? adminAnnouncementCards.find(item => item.id === adminAnnouncementPreviewId) || null
      : null,
    previewVisible: Boolean(adminAnnouncementPreviewId),
    hasUnsavedChanges: hasUnsavedAdminAnnouncementDraft(),
    pendingExitTarget: adminAnnouncementPendingExitTarget,

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
    adminCategories,
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
    pendingAppointmentCount: Math.max(
      appointmentCards.filter(item => {
        return item.preferredDate >= adminTodayDateKey && item.statusLabel === 'Pending'
      }).length,
      adminPendingAppointmentCountSnapshot
    ),
    unreadMessageCount: merchantChatThreads.length > 0
      ? merchantChatThreads.reduce((sum, item) => {
        return sum + Math.max(0, Number(item.unreadCount || 0))
      }, 0)
      : adminUnreadMessageCountSnapshot,

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
    hasUnsavedChanges: hasUnsavedEditDraft(),
    pendingExitTarget: editDishPendingExitTarget
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
    adminCategories,
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

    onBack: handleShowcaseBack,

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

    onBackToHome: () => requestStoreProfileExit('home'),

    onBack: handleShowcaseBack,

    onConfirmExit: confirmStoreProfileExit,

    onDismissExitConfirm: () => setStoreProfilePendingExitTarget(null),

    onRefresh: () => {
      void refreshStoreProfile()
    },

    onEdit: () => {
      resetStoreProfileDraftDirty()
      startEditStoreProfile()
    },

    onCancelEdit: () => {
      resetStoreProfileDraftDirty()
      cancelEditStoreProfile()
    },

    onDiscardDraftAndGoHome: () => {
      resetStoreProfileDraftDirty()
      discardStoreProfileDraftAndGoHome()
    },

    onSave: () => {
      void saveStoreProfile()
    },

    onTitleChange: value => {
      markStoreProfileDraftDirty()
      onStoreProfileDraftTitleChange(value)
    },

    onSubtitleChange: value => {
      markStoreProfileDraftDirty()
      onStoreProfileDraftSubtitleChange(value)
    },

    onDescriptionChange: value => {
      markStoreProfileDraftDirty()
      onStoreProfileDraftDescriptionChange(value)
    },

    onAddressChange: value => {
      markStoreProfileDraftDirty()
      onStoreProfileDraftAddressChange(value)
    },

    onHoursChange: value => {
      markStoreProfileDraftDirty()
      onStoreProfileDraftHoursChange(value)
    },

    onMapUrlChange: value => {
      markStoreProfileDraftDirty()
      onStoreProfileDraftMapUrlChange(value)
    },

    onBusinessStatusChange: value => {
      markStoreProfileDraftDirty()
      onStoreProfileDraftBusinessStatusChange(value)
    },

    onLogoUrlChange: value => {
      markStoreProfileDraftDirty()
      void onStoreProfileLogoPicked(value)
    },

    onCoverUrlChange: value => {
      markStoreProfileDraftDirty()
      void onStoreProfileCoversPicked([value])
    },

    onLogoImagePicked: value => {
      markStoreProfileDraftDirty()
      void onStoreProfileLogoPicked(value)
    },

    onCoverImagesPicked: values => {
      markStoreProfileDraftDirty()
      void onStoreProfileCoversPicked(values)
    },

    onPickLogo: () => {
      showSnackbar('Choose a logo file in the connected UI.')
    },

    onPickCover: () => {
      showSnackbar('Choose a cover file in the connected UI.')
    },

    onRemoveLogo: () => {
      markStoreProfileDraftDirty()
      onStoreProfileLogoRemove()
    },

    onRemoveCover: value => {
      markStoreProfileDraftDirty()
      onStoreProfileCoverRemove(value)
    },

    onMoveCover: (fromIndex, toIndex) => {
      markStoreProfileDraftDirty()
      onStoreProfileCoverMove(fromIndex, toIndex)
    },

    onCoverDraggingChange: () => {
    },

    onServiceChange: (index, value) => {
      markStoreProfileDraftDirty()
      onStoreProfileServiceChange(index, value)
    },

    onAddService: value => {
      markStoreProfileDraftDirty()
      onStoreProfileServiceAdd(value)
    },

    onRemoveService: index => {
      markStoreProfileDraftDirty()
      onStoreProfileServiceRemove(index)
    },

    onAddExtraContact: () => {
      markStoreProfileDraftDirty()
      onStoreProfileExtraContactAdd('', '')
    },

    onRemoveExtraContact: id => {
      markStoreProfileDraftDirty()
      onStoreProfileExtraContactRemove(id)
    },

    onExtraContactNameChange: (id, value) => {
      markStoreProfileDraftDirty()
      onStoreProfileExtraContactNameChange(id, value)
    },

    onExtraContactValueChange: (id, value) => {
      markStoreProfileDraftDirty()
      onStoreProfileExtraContactValueChange(id, value)
    },

    onOpenMap: openMap,

    onOpenWebsite: openWebsite,

    onCopy: copyText,

    onSavePreviewImage: savePreviewImage
  }

  const favoritesActions: ShowcaseFavoritesActions = {
    ...bottomNavigationActions,

    onBackToHome: closeToHome,

    onBack: handleShowcaseBack,

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

    onBack: handleShowcaseBack,

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

    onBack: handleShowcaseBack,

    onRefresh: () => {
      void refreshCustomerAppointmentsFromCloud()
    },

    onCopy: copyText,

    onLoadMore: () => {
      void loadMoreCustomerAppointments()
    },

    onDateFilterChange: onAppointmentCustomerDateFilterChange,

    onStatusFilterChange: onAppointmentCustomerStatusFilterChange,

    onServiceFilterChange: onAppointmentCustomerServiceFilterChange,

    onConsumeFocusedAppointment: () => {
      setFocusedCustomerAppointmentId(null)
    },

    onContactMerchant: appointmentId => {
      openChatFromCustomerBooking(appointmentId)
    },

    onCancelBooking: appointmentId => {
      return cancelCustomerBooking(appointmentId)
    },

    onOpenAppointmentProductDetail: openDetail
  }

  const adminAppointmentsActions: ShowcaseAdminAppointmentsActions = {
    onBackToHome: closeToHome,

    onBack: handleShowcaseBack,

    onRefresh: () => {
      void refreshAdminAppointmentsFromCloud()
    },

    onCopy: copyText,

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

    onConsumeFocusedAppointment: () => {
      setFocusedAdminAppointmentId(null)
    },

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

    onBack: handleShowcaseBack,

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
    onBackToHome: () => requestAdminAnnouncementExit('home'),

    onBack: handleShowcaseBack,

    onConfirmExit: confirmAdminAnnouncementExit,

    onDismissExitConfirm: () => setAdminAnnouncementPendingExitTarget(null),

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

  const {
    chatActions,
    chatMediaActions,
    merchantChatListActions
  } = createShowcaseChatActionObjects({
    bottomNavigationActions,
    buildChatProductClipboardPayload,
    copyText,
    chatCancelQuote,
    chatCloseFind,
    chatCloseSearchResults,
    chatDeleteMessage,
    chatDeleteSelected,
    chatEnterSelection,
    chatExitSelection,
    chatFindNext,
    chatFindPrev,
    chatFindQueryChange,
    chatJumpToFoundMessage,
    chatJumpToMessageFromQuote,
    chatOpenFind,
    chatOpenImagePreview,
    chatOpenMediaGallery,
    chatOpenSearchResults,
    chatOpenThreadFromSearch,
    chatQuoteMessage,
    chatRemoveDraftImage,
    chatTogglePinned,
    chatToggleSelection,
    chatUseProductCardAsPending,
    closeMerchantChatListToHome,
    closeToHome,
    handleShowcaseBack,
    isProductAvailable,
    loadNewerChatMessages,
    loadOlderChatMessages,
    loadMoreChatMediaItems,
    loadMoreChatSearchResults,
    loadMoreMerchantChatThreads,
    merchantChatListDeleteThread,
    merchantChatListRenameThread,
    merchantChatListTogglePin,
    onChatDraftChange,
    onChatFullCameraUnavailable,
    onChatCameraResult,
    onChatImagesSelected,
    openMerchantThread,
    openProductFromChat,
    prepareChatCameraCapture,
    refreshChatLatest,
    refreshMerchantChatListByUser,
    removeDraftChatImage: chatRemoveDraftImage,
    retryChatMessage,
    saveChatPreviewImage,
    savePreviewImage,
    sendChat,
    sendPendingAppointmentShare,
    sendPendingProductShare,
    setChatMediaPreviewIndex,
    setChatMediaPreviewUrls,
    setMerchantChatListSearchQuery,
    setPendingAppointmentForChat,
    storeId
  })

  const adminActions: ShowcaseAdminActions = {
    onBackToHome: closeToHome,

    onBack: handleShowcaseBack,

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
    onBackToHome: () => requestEditDishExit('home'),

    onBack: handleShowcaseBack,

    onConfirmExit: confirmEditDishExit,

    onDismissExitConfirm: () => setEditDishPendingExitTarget(null),

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

    onBack: handleShowcaseBack,

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
  void awaitWebPushRegistrationToken
  void ensurePushRegistration
  void handlePushRoute
  void onAnnouncementPushArrived
  void dispatchNewAppointmentPushToMerchant
  void dispatchCustomerCancelledAppointmentPushToMerchant
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

  const storeUnavailableState: ShowcaseStoreUnavailableUiState = {
    visible: storeUnavailable,
    title: 'App not available',
    message: 'This store app is not active or has not been set up yet.\nPlease check the link, or register your store at www.thinkitdoneapp.com'
  }

  return {
    screen,
    showcaseWiring,
    offlineStatus,
    storeUnavailableState,
    handleShowcaseBack,

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
