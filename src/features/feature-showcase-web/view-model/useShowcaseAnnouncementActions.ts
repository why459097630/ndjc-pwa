'use client'

import type { ShowcaseImageVariants } from '../showcaseModels'
import type {
  CloudAnnouncement,
  MerchantAuthSession,
  ShowcaseCloudRepository
} from '../showcaseCloudRepository'
import type { ShowcaseAnnouncementCard, ShowcaseScreenName } from '../showcaseUiContract'
import type { DraftAnnouncement, LocalTempImageRecord, UploadedShowcaseImage } from './showcaseViewModelUtils'

type ShowcasePaginationRuntimeStateLike = {
  nextOffset: number
  hasMore: boolean
  isLoadingMore: boolean
}

type StateSetter<T> = (value: T | ((current: T) => T)) => void

type ShowcaseAnnouncementActionsContext = {
  SHOWCASE_PAGE_SIZE: {
    publicAnnouncements: number
    adminAnnouncements: number
  }
  SHOWCASE_PUBLISHED_ANNOUNCEMENTS_KEY: string
  ShowcaseScreens: Record<string, ShowcaseScreenName>
  adminAnnouncementBodyDraft: string
  adminAnnouncementComposerExpanded: boolean
  adminAnnouncementCoverDraftUrl: string | null
  adminAnnouncementDraftItems: DraftAnnouncement[]
  adminAnnouncementEditingId: string | null
  adminAnnouncementIsSubmitting: boolean
  adminAnnouncementPreviewId: string | null
  adminAnnouncementSelectedIds: string[]
  adminAnnouncementsPagination: ShowcasePaginationRuntimeStateLike
  announcementClickCountInFlightRef: { current: Set<string> }
  announcements: CloudAnnouncement[]
  announcementsBackTargetRef: { current: ShowcaseScreenName }
  announcementsEntryDotVisible: boolean
  bindMerchantSessionToRepository: (repository: ShowcaseCloudRepository) => void
  bookingsEntryDotVisible: boolean
  clearAdminAnnouncementDraftLocalImages: (storeId: string) => void
  clearAdminAnnouncementEditorDraftLocally: (storeId: string) => void
  createUuidLikeId: () => string
  deleteAppOwnedLocalFileUri: (...args: any[]) => void
  ensureValidMerchantSessionLoadedForCloud: () => Promise<MerchantAuthSession | null>
  formatDateTimeText: (value: number | null | undefined) => string
  guardOfflineWriteOperation: () => boolean
  handleMerchantAuthExpiredIfNeeded: (error: unknown) => Promise<boolean>
  isAppOwnedLocalFileUri: (...args: any[]) => boolean
  isLocalImageUri: (url: string) => boolean
  loadCountedAnnouncementClickIdsLocally: (storeId: string) => string[]
  loadPublishedAnnouncementsLocally: (storeId: string) => CloudAnnouncement[]
  loadViewedAnnouncementIdsLocally: (storeId: string) => string[]
  merchantSessionEnsureFailureMessage: () => string
  merchantSessionEnsureSnackbarMessage: () => string
  mergeUniqueById: <T extends { id: string }>(current: T[], next: T[]) => T[]
  nowMillis: () => number
  onAnnouncementPushArrived: (id: string) => Promise<void>
  persistAdminAnnouncementEditorDraftLocally: (storeId: string, draft: DraftAnnouncement) => void
  persistPublishedAnnouncementsLocally: (storeId: string, items: CloudAnnouncement[]) => void
  pruneAnnouncementMarksWhenCompletePageLoaded: (...args: any[]) => void
  publicAnnouncementsPagination: ShowcasePaginationRuntimeStateLike
  readJson: <T>(key: string, fallback: T) => T
  refreshAdminHomeCloudState: (...args: any[]) => Promise<void> | void
  rememberLocalTempImage: (storeId: string, scope: LocalTempImageRecord['scope'], url: string) => void
  removePendingSync: (id: string) => void
  repository: ShowcaseCloudRepository
  resolveAnnouncementCoverDraftUrl: (value: File | Blob | string) => Promise<string | null>
  retryMerchantCloudOperationAfterAuthRefresh: (input: any) => Promise<any>
  saveCountedAnnouncementClickIdsLocally: (storeId: string, ids: string[]) => void
  saveViewedAnnouncementIdsLocally: (storeId: string, ids: string[]) => void
  screen: ShowcaseScreenName
  seenAnnouncementIds: string[]
  setAdminAnnouncementBodyDraft: StateSetter<string>
  setAdminAnnouncementComposerExpanded: StateSetter<boolean>
  setAdminAnnouncementCoverDraftUrl: StateSetter<string | null>
  setAdminAnnouncementDraftItems: StateSetter<DraftAnnouncement[]>
  setAdminAnnouncementEditingId: StateSetter<string | null>
  setAdminAnnouncementError: StateSetter<string | null>
  setAdminAnnouncementIsBlocking: StateSetter<boolean>
  setAdminAnnouncementIsSubmitting: StateSetter<boolean>
  setAdminAnnouncementPreviewId: StateSetter<string | null>
  setAdminAnnouncementSelectedIds: StateSetter<string[]>
  setAdminAnnouncementSubmittingAction: StateSetter<'save' | 'publish' | 'delete' | null>
  setAdminAnnouncementSuccess: StateSetter<string | null>
  setAdminAnnouncementsPagination: StateSetter<ShowcasePaginationRuntimeStateLike>
  setAnnouncements: StateSetter<CloudAnnouncement[]>
  setAnnouncementsEntryDotVisible: StateSetter<boolean>
  setFocusedAnnouncementId: StateSetter<string | null>
  setPreviousScreen: StateSetter<ShowcaseScreenName>
  setPublicAnnouncementsPagination: StateSetter<ShowcasePaginationRuntimeStateLike>
  setPushTargetAnnouncementId: StateSetter<string | null>
  setScreen: StateSetter<ShowcaseScreenName>
  setSeenAnnouncementIds: StateSetter<string[]>
  setStatusMessage: StateSetter<string | null>
  setStoreMerchantSessionFromAuthSession: (session: MerchantAuthSession) => void
  showSnackbar: (message: string) => void
  sortedAnnouncementsForStorage: (items: CloudAnnouncement[]) => CloudAnnouncement[]
  storeId: string
  uploadAnnouncementCoverIfNeeded: (value: string | null) => Promise<UploadedShowcaseImage | null>
}

export function createShowcaseAnnouncementActions(context: ShowcaseAnnouncementActionsContext) {
  const {
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
  } = context

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
    const draftCoverUrl = adminAnnouncementComposerExpanded
      ? adminAnnouncementCoverDraftUrl?.trim() || ''
      : ''
    const hasEditorCover = Boolean(draftCoverUrl)
    const selectedIds = adminAnnouncementSelectedIds
      .map(id => id.trim())
      .filter(Boolean)

    const selectedDraft = status === 'published' && !hasEditorCover && selectedIds.length === 1
      ? adminAnnouncementDraftItems.find(item => item.id === selectedIds[0] && item.status === 'draft') || null
      : null

    if (status === 'published' && hasEditorCover && selectedIds.length > 0) {
      setAdminAnnouncementError('Clear selected drafts before publishing the editor content.')
      setAdminAnnouncementSuccess(null)
      return
    }

    if (status === 'published' && !hasEditorCover && selectedIds.length > 1) {
      setAdminAnnouncementError('Only one announcement can be published at a time.')
      setAdminAnnouncementSuccess(null)
      return
    }

    if (status === 'published' && !hasEditorCover && selectedIds.length === 0) {
      setAdminAnnouncementError('Cover image is required.')
      setAdminAnnouncementSuccess(null)
      return
    }

    if (status === 'draft' && !hasEditorCover) {
      setAdminAnnouncementError('Cover image is required.')
      setAdminAnnouncementSuccess(null)
      return
    }

    if (selectedDraft && !selectedDraft.coverUrl?.trim()) {
      setAdminAnnouncementError('Cover image is required.')
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
    const sourceCoverUrl = selectedDraft?.coverUrl || draftCoverUrl || null
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
          isSuccess: (value: unknown) => Boolean(value)
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
          bodyPreview: 'Tap to view the latest update'
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
              bodyPreview: 'Tap to view the latest update'
            }),
            isSuccess: (value: boolean) => value
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
          isSuccess: (value: boolean) => value
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

  return {
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
  }
}
