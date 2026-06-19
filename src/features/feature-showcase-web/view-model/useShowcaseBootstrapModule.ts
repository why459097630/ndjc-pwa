'use client'

export function useShowcaseBootstrapModule(context: any) {
  const {
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
    refreshStoreProfile,
    replaceDishPendingSyncOperations,
    repository,
    retryPendingSync,
    screen,
    selectedCategory,
    sortedDishesForStorage,
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
  } = context

  async function refreshCloudServiceStatus(): Promise<any> {
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
        repository.fetchAppointmentRequestsForMerchant(storeId).catch((appointmentError: unknown) => {
          console.warn('[AdminHome] appointment refresh failed', appointmentError)
          return [] as any[]
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
      setMerchantChatThreads((current: any) => mergeMerchantThreadSummariesByConversationId(
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

  async function tryLoadFromCloud(reason: any = ShowcaseRetryOps.LoadFromCloud): Promise<void> {
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

    const effectiveLocalDishes = localDishes.filter((item: any) => isAdminLoggedIn || !item.isHidden)
    const sortedEffectiveLocalDishes = sortedDishesForStorage(effectiveLocalDishes)
    const sortedHomeLocalDishes = sortedDishesForStorage(effectiveLocalDishes.filter((item: any) => !item.isHidden))

    if (sortedEffectiveLocalDishes.length) {
      mergeDishEntities(sortedEffectiveLocalDishes)
      setHomeDishIds(dishIdsFromItems(sortedHomeLocalDishes))

      if (isAdminLoggedIn) {
        setAdminItemIds(dishIdsFromItems(sortedEffectiveLocalDishes))
      }

      setDishes(sortedEffectiveLocalDishes)
      refreshFavoritesList(sortedEffectiveLocalDishes)
      replaceDishPendingSyncOperations(sortedEffectiveLocalDishes)
    }

    if (localManualCategories.length) {
      setCategories(manualCategoryNamesToCloudCategories(localManualCategories))
    }

    const effectiveLocalCategoryNames = localManualCategories
      .map((item: any) => item.trim())
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


  return {
    refreshCloudServiceStatus,
    refreshAdminHomeCloudState,
    tryLoadFromCloud,
    loadFromSources,
    retryLast,
    clearSyncError
  }
}
