import type { DemoDish, ShowcaseFavoriteSnapshot, SyncState } from '../showcaseModels'
import type { ShowcaseEditDishUiState, ShowcaseHomeSortMode } from '../showcaseUiContract'
import type { UploadedShowcaseImage } from './showcaseViewModelUtils'

type StateSetter = {
  (updater: (current: any) => any): void
  (value: any): void
}

type MutableRefLike<T = any> = { current: T }

type ShowcaseCatalogActionsContext = {
  [key: string]: any
  adminItemsSearchDebounceTimerRef: MutableRefLike<number | null>
  adminItemsSearchRequestSeqRef: MutableRefLike<number>
  homeSearchDebounceTimerRef: MutableRefLike<number | null>
  homeSearchRequestSeqRef: MutableRefLike<number>
  adminSelectedDishIds: string[]
  adminVisibleDishes: DemoDish[]
  dishes: DemoDish[]
  editDishId: string | null
  editDishImageUrls: string[]
  favoriteAddedAt: Record<string, number>
  favoriteIds: string[]
  favoriteSnapshots: Record<string, ShowcaseFavoriteSnapshot>
  favoritesSelectedIds: string[]
  homeDishIds: string[]
  manualCategories: string[]
  selectedTags: string[]
  loadDishesFromStorage: (storeId: string) => DemoDish[]
  getDishEntityById: (dishId: string | null | undefined) => DemoDish | null
  getAdminEditableDishById: (dishId: string | null | undefined) => DemoDish | null
  setAdminCannotDeleteCategory: StateSetter
  setAdminItemIds: StateSetter
  setAdminItemsAppliedMaxPrice: StateSetter
  setAdminItemsAppliedMinPrice: StateSetter
  setAdminItemsFilterDiscountOnly: StateSetter
  setAdminItemsFilterHiddenOnly: StateSetter
  setAdminItemsFilterRecommended: StateSetter
  setAdminItemsPriceMaxDraft: StateSetter
  setAdminItemsPriceMinDraft: StateSetter
  setAdminItemsSearchQuery: StateSetter
  setAdminItemsSelectedCategory: StateSetter
  setAdminItemsSortAscending: StateSetter
  setAdminItemsSortMode: StateSetter
  setAdminPendingDeleteCategory: StateSetter
  setAdminSelectedDishIds: StateSetter
  setAppointmentSourceDishId: StateSetter
  setCategories: StateSetter
  setCategorySubmittingAction: StateSetter
  setDishEntitiesById: StateSetter
  setDishes: StateSetter
  setEditDishCategory: StateSetter
  setEditDishDescription: StateSetter
  setEditDishDiscountPrice: StateSetter
  setEditDishHidden: StateSetter
  setEditDishId: StateSetter
  setEditDishImageUrls: StateSetter
  setEditDishName: StateSetter
  setEditDishOriginalPrice: StateSetter
  setEditDishRecommended: StateSetter
  setEditValidationError: StateSetter
  setEditImageUploadError: StateSetter
  setFavoritesAppliedMaxPrice: StateSetter
  setFavoritesAppliedMinPrice: StateSetter
  setFavoritesFilterOnSaleOnly: StateSetter
  setFavoritesFilterRecommendedOnly: StateSetter
  setFavoritesPriceMaxDraft: StateSetter
  setFavoritesPriceMinDraft: StateSetter
  setFavoritesQuery: StateSetter
  setFavoritesSelectedCategory: StateSetter
  setFavoritesSelectedIds: StateSetter
  setFavoritesShowFilterMenu: StateSetter
  setFavoritesShowPriceMenu: StateSetter
  setFavoritesShowSortMenu: StateSetter
  setFavoritesSortMode: StateSetter
  setFilterOnSaleOnly: StateSetter
  setFilterRecommendedOnly: StateSetter
  setHomeAppliedMaxPrice: StateSetter
  setHomeAppliedMinPrice: StateSetter
  setHomeDishIds: StateSetter
  setHomePriceMaxDraft: StateSetter
  setHomePriceMinDraft: StateSetter
  setHomeShowFilterMenu: StateSetter
  setHomeShowPriceMenu: StateSetter
  setHomeShowSortMenu: StateSetter
  setIsBlockingEditDish: StateSetter
  setIsSavingEditDish: StateSetter
  setLastRetryOp: StateSetter
  setLastSyncAt: StateSetter
  setPendingDeleteDishId: StateSetter
  setPreviousScreen: StateSetter
  setScreen: StateSetter
  setSearchQuery: StateSetter
  setSelectedCategory: StateSetter
  setSelectedDishId: StateSetter
  setSelectedTags: StateSetter
  setSortMode: StateSetter
  setStatusMessage: StateSetter
  setStoreMerchantSessionFromAuthSession: (session: any) => void
  setSyncErrorMessage: StateSetter
  setSyncOverviewState: StateSetter
}

export function createShowcaseCatalogActions(ctx: ShowcaseCatalogActionsContext) {
  const {
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
    getEditDishState,
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
    validateShowcaseImageUploadFile,
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
    setEditDishImageUrls,
    setEditDishName,
    setEditDishOriginalPrice,
    setEditDishRecommended,
    setEditValidationError,
    setEditImageUploadError,
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
  } = ctx

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
          isSuccess: (value: any) => value.ok
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
      setHomeDishIds(dishIdsFromItems(finalDishes.filter((item: any) => !item.isHidden)))
      setDishes(finalDishes)
      setCategories(cloudCategories)
      replaceDishPendingSyncOperations(finalDishes)
      setSelectedCategory((current: any) => String(current || '').trim() === name ? null : current)
      setEditDishCategory((current: any) => String(current || '').trim() === name ? null : current)
      setAdminPendingDeleteCategory(null)
      setStatusMessage(null)

      persistDishesLocally(storeId, finalDishes)
      saveManualCategoriesToStorage(storeId, allCategoryNames)
      setLastSyncAt(nowMillis())
    } catch {
      setStatusMessage('Failed to delete category.')
    } finally {
      setCategorySubmittingAction(null)
    }
  }

  async function addCategory(nameInput: string): Promise<void> {
    if (categorySubmittingAction) return

    const name = nameInput.trim()
    if (!name) return

    const existing = Array.from(
      new Set(
        manualCategories
          .map((item: any) => item.trim())
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
          isSuccess: (value: any) => value.ok
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
      setHomeDishIds(dishIdsFromItems(finalDishes.filter((item: any) => !item.isHidden)))
      setDishes(finalDishes)
      setCategories(cloudCategories)
      replaceDishPendingSyncOperations(finalDishes)
      setStatusMessage(null)

      persistDishesLocally(storeId, finalDishes)
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
          isSuccess: (value: any) => value.ok
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

      const finalDishes = mergedDishes.map((item: any) => {
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
      setHomeDishIds(dishIdsFromItems(finalDishes.filter((item: any) => !item.isHidden)))
      setDishes(finalDishes)
      setCategories(cloudCategories)
      replaceDishPendingSyncOperations(finalDishes)
      setSelectedCategory((current: any) => String(current || '').trim() === from ? to : current)
      setEditDishCategory((current: any) => String(current || '').trim() === from ? to : current)
      setStatusMessage(null)

      persistDishesLocally(storeId, finalDishes)
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
          isSuccess: (value: any) => value.ok
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
    let uploadedDraftDish: DemoDish | null = null

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
        .map((item: any) => item.url.trim())
        .filter(Boolean)
        .filter((item: any, index: number, all: any[]) => all.indexOf(item) === index)
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

      uploadedDraftDish = nextDish

      let ok = await repository.upsertDishFromDemo(storeId, nextDish)

      if (!ok) {
        const retry = await retryMerchantCloudOperationAfterAuthRefresh({
          errorInput: new Error('Cloud save failed.'),
          operation: () => repository.upsertDishFromDemo(storeId, nextDish),
          isSuccess: (value: any) => value
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
        ...dishes.filter((item: any) => item.id !== selected.id)
      ])

      persistDishesLocally(storeId, finalDishes)
      mergeDishEntities(finalDishes)
      setDishes(finalDishes)

      setHomeDishIds((current: any) => {
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
      setEditImageUploadError(null)
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
        setEditImageUploadError(null)
      }

      if (isBrowser()) {
        window.setTimeout(finishNavigation, 800)
      } else {
        finishNavigation()
      }
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : String(error || '')
      const isImageUploadFailure = rawMessage.includes('Image upload failed')
      const isImageGuardFailure =
        rawMessage.includes('Image is too large') ||
        rawMessage.includes('Only JPG, PNG, or WebP images are supported') ||
        rawMessage.includes('Image compression failed')
      const failureMessage = isImageGuardFailure
        ? rawMessage
        : isImageUploadFailure
          ? 'Image upload failed. Please try again.'
          : 'Cloud save failed.'

      if (isImageGuardFailure || isImageUploadFailure || !uploadedDraftDish) {
        setStatusMessage(null)
        setSyncOverviewState(SyncOverviewStates.Failed)
        setSyncErrorMessage(failureMessage)
        setLastRetryOp(null)

        if (isImageGuardFailure) {
          setEditImageUploadError(failureMessage)
          setEditValidationError(null)
        } else {
          setEditValidationError(failureMessage)
        }

        setIsSavingEditDish(false)
        setIsBlockingEditDish(false)
        showSnackbar(failureMessage)
        return
      }

      const queuedDish: DemoDish = {
        ...uploadedDraftDish,
        updatedAt: nowMillis(),
        syncState: 'Pending',
        dirty: true
      }

      const finalDishes = sortedDishesForStorage([
        queuedDish,
        ...loadDishesFromStorage(storeId).filter((item: any) => item.id !== queuedDish.id)
      ])

      persistDishesLocally(storeId, finalDishes)
      mergeDishEntities(finalDishes)
      setDishes(finalDishes)
      refreshFavoritesList(finalDishes)

      setHomeDishIds((current: any) => {
        if (queuedDish.isHidden) {
          return removeDishIdFromList(current, queuedDish.id)
        }

        if (current.includes(queuedDish.id)) {
          return current
        }

        return wasNew ? [queuedDish.id, ...current] : current
      })

      setAdminItemIds((current: any) => {
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
        .map((item: any) => item.trim())
        .filter(Boolean)
        .filter((item: any, index: number, all: any[]) => all.indexOf(item) === index)

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
          isSuccess: (value: any) => value
        })

        if (retry.status === 'handled_without_retry') return

        if (retry.status === 'retried_success') {
          ok = true
        } else {
          throw new Error('Cloud delete failed.')
        }
      }

      preserveFavoriteSnapshotsBeforeDishDelete([dish])

      const finalDishes = dishes.filter((item: any) => item.id !== dish.id)

      removeDishEntityById(dish.id)
      setAdminItemIds((current: any) => removeDishIdFromList(current, dish.id))
      setHomeDishIds((current: any) => removeDishIdFromList(current, dish.id))
      setDishes(finalDishes)
      persistDishesLocally(storeId, finalDishes)
      refreshFavoritesList(finalDishes)
      removePendingSync(`dish-delete:${dish.id}`)
      removePendingSync(`dish-upsert:${dish.id}`)

      setSelectedDishId((current: any) => current === dish.id ? null : current)
      setEditDishId((current: any) => current === dish.id ? null : current)
      setAppointmentSourceDishId((current: any) => current === dish.id ? null : current)
      setAdminSelectedDishIds((current: any) => current.filter((id: string) => id !== dish.id))
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
    setAdminSelectedDishIds((current: any) => {
      if (!current.length) return current
      return []
    })
  }

  function toggleAdminDishSelected(dishIdInput: string): void {
    const dishId = dishIdInput.trim()
    if (!dishId) return

    setAdminSelectedDishIds((current: string[]) => {
      const normalized = Array.from(
        new Set(
          current
            .map((id: string) => id.trim())
            .filter(Boolean)
        )
      )

      if (normalized.includes(dishId)) {
        return normalized.filter((id: string) => id !== dishId)
      }

      return [...normalized, dishId]
    })
  }

  async function deleteSelectedDishes(): Promise<void> {
    const ids = Array.from(
      new Set(
        adminSelectedDishIds
          .map((id: string) => id.trim())
          .filter(Boolean)
      )
    )

    if (!ids.length) return

    const toDelete = ids
      .map((id: string) => getAdminEditableDishById(id))
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
          .map((item: any) => item.trim())
          .filter(Boolean)
          .filter((item: any, index: number, all: any[]) => all.indexOf(item) === index)

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
            isSuccess: (value: any) => value
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

      const deletingIds = new Set(toDelete.map((item: any) => item.id))
      const finalDishes = dishes.filter((item: any) => !deletingIds.has(item.id))

      mergeDishEntities(finalDishes)

      toDelete.forEach(dish => {
        removeDishEntityById(dish.id)
      })

      setAdminItemIds((current: any) => current.filter((id: string) => !deletingIds.has(id)))
      setHomeDishIds((current: any) => current.filter((id: string) => !deletingIds.has(id)))
      setDishes(finalDishes)
      persistDishesLocally(storeId, finalDishes)
      refreshFavoritesList(finalDishes)

      toDelete.forEach(dish => {
        removePendingSync(`dish-delete:${dish.id}`)
        removePendingSync(`dish-upsert:${dish.id}`)
      })

      setSelectedDishId((current: any) => current && deletingIds.has(current) ? null : current)
      setEditDishId((current: any) => current && deletingIds.has(current) ? null : current)
      setAppointmentSourceDishId((current: any) => current && deletingIds.has(current) ? null : current)
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

    const exists = dishes.some((item: any) => item.id === dishId)
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
        const uploadGuardMessage = validateShowcaseImageUploadFile(blob, 'dish')

        if (uploadGuardMessage) {
          throw new Error(uploadGuardMessage)
        }

        const uploaded = await pickAndUploadImageWithVariants({
          bucket: 'dish',
          pathPrefix: editDishId || 'draft',
          file: blob
        })

        if (uploaded) {
          rememberLocalTempImage(storeId, 'edit-dish', url)
        }

        return uploaded
      } catch (error) {
        if (error instanceof Error && error.message) {
          throw error
        }

        return null
      }
    }

    const uploadGuardMessage = validateShowcaseImageUploadFile(value, 'dish')

    if (uploadGuardMessage) {
      throw new Error(uploadGuardMessage)
    }

    return pickAndUploadImageWithVariants({
      bucket: 'dish',
      pathPrefix: editDishId || 'draft',
      file: value
    })
  }

  async function onEditImageSelected(value: File | Blob | string): Promise<void> {
    if (typeof value !== 'string') {
      const uploadGuardMessage = validateShowcaseImageUploadFile(value, 'dish')

      if (uploadGuardMessage) {
        setEditImageUploadError(uploadGuardMessage)
        showSnackbar(uploadGuardMessage)
        return
      }
    }

    setEditImageUploadError(null)

    const url = createEditDishLocalPreviewUrl(value)

    if (!url) {
      showSnackbar('Image selected failed.')
      return
    }

    setEditDishImageUrls((current: any) => {
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

    setEditImageUploadError(null)

    setEditDishImageUrls((current: any) => {
      const next = current.filter((item: any) => item !== url)
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

    setEditDishImageUrls((current: any) => {
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
    return getEditDishState()
  }

  function getEditDeleteAction(): (() => void) | null {
    return null
  }

  async function incrementDishClick(dishId: string): Promise<void> {
    const id = dishId.trim()
    if (!id) return

    setDishes((current: any) => current.map((item: any) => {
      if (item.id !== id) return item

      return {
        ...item,
        clickCount: Math.max(0, Number(item.clickCount || 0) + 1)
      }
    }))

    setDishEntitiesById((current: any) => {
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
        isSuccess: (value: any) => value
      })

      if (retry.status === 'handled_without_retry') return

      if (retry.status === 'retried_success') {
        ok = true
      } else {
        showSnackbar('Delete image failed.')
        return
      }
    }

    setEditDishImageUrls((current: any) => current.filter((item: any) => item !== clean))
    setDishes((current: any) => current.map((item: any) => ({
      ...item,
      imageUrls: item.imageUrls.filter((imageUrl: string) => imageUrl !== clean),
      imageUri: item.imageUri === clean ? item.imageUrls.filter((imageUrl: string) => imageUrl !== clean)[0] || null : item.imageUri
    })))
    setDishEntitiesById((current: any) => {
      let changed = false
      const next: Record<string, DemoDish> = {}

      Object.entries(current as Record<string, DemoDish>).forEach(([id, dish]) => {
        const imageUrls = dish.imageUrls.filter((imageUrl: string) => imageUrl !== clean)
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

  function toggleFavorite(dishIdInput: string): void {
    const dishId = dishIdInput.trim()
    if (!dishId) return

    const isRemoving = favoriteIds.includes(dishId)

    if (isRemoving) {
      const nextIds = favoriteIds.filter((id: string) => id !== dishId)
      const nextAddedAt = { ...favoriteAddedAt }
      const nextSnapshots = { ...favoriteSnapshots }

      delete nextAddedAt[dishId]
      delete nextSnapshots[dishId]

      persistFavoritesState(nextIds, nextAddedAt, nextSnapshots)
      setFavoritesSelectedIds((current: any) => current.filter((id: string) => id !== dishId))
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

    setFavoritesSelectedIds((current: any) => {
      if (current.includes(dishId)) {
        return current.filter((id: string) => id !== dishId)
      }

      return [...current, dishId]
    })
  }

  function deleteSelectedFavorites(): void {
    const selected = favoritesSelectedIds
      .map((id: string) => id.trim())
      .filter(Boolean)

    if (!selected.length) return

    const deletingIds = new Set(selected)
    const nextIds = favoriteIds.filter((id: string) => !deletingIds.has(id))
    const nextAddedAt = { ...favoriteAddedAt }
    const nextSnapshots = { ...favoriteSnapshots }

    selected.forEach((id: string) => {
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

    setSelectedTags((current: any) => {
      if (current.includes(tag)) {
        return current.filter((item: any) => item !== tag)
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

  return {
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
  }
}
