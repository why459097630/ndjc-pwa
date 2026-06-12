'use client'

// Store profile operation flow only. UI rendering stays in the UI pack.

type StateSetter = {
  (updater: (current: any) => any): void
  (value: any): void
}

type CloudStoreProfile = any
type ShowcaseImageVariants = any
type UploadedShowcaseImage = any
type ShowcaseStoreProfile = any
type ShowcaseStoreProfileDraft = any
type ShowcaseExtraContact = any
type DraftExtraContact = any

type CachedStoreProfileLike = {
  services: string[]
  extraContacts: Array<{ name: string; value: string }>
  coverUrl?: string
  logoUrl?: string
  description?: string
  businessStatus?: string
  [key: string]: any
}

type ShowcaseStoreProfileActionsContext = {
  setStoreProfile: StateSetter
  setStoreProfileServices: StateSetter
  setStoreProfileExtraContacts: StateSetter
  setStoreProfileCoverUrl: StateSetter
  setStoreProfileLogoUrl: StateSetter
  setDraftStoreProfileCoverUrl: StateSetter
  setDraftStoreProfileLogoUrl: StateSetter
  setDraftStoreProfileDescription: StateSetter
  setDraftBusinessStatus: StateSetter
  setDraftStoreProfileServices: StateSetter
  setDraftStoreProfileExtraContacts: StateSetter
  setStoreProfileDraft: StateSetter
  setStatusMessage: StateSetter
  setSyncErrorMessage: StateSetter
  setIsRefreshingStoreProfile: StateSetter
  setStoreProfileSaveError: StateSetter
  setIsSavingStoreProfile: StateSetter
  setStoreProfileSaveSuccess: StateSetter
  setStoreProfileCloud: StateSetter
  setIsEditingStoreProfile: StateSetter
  setLastRetryOp: StateSetter
  setLastSyncAt: StateSetter
  setPreviousScreen: StateSetter
  setScreen: StateSetter
  storeProfileServices: any[]
  storeProfileExtraContacts: any[]
  draftStoreProfileExtraContacts: any[]
  draftStoreProfileServices: string[]
  loadStoreProfileFromStorage: (storeId: string) => CachedStoreProfileLike | null
  parseExtraContacts: (value: string | null | undefined) => Array<{ id?: string; name: string; value: string }>
  parseJsonStringArray: (value: string | null | undefined) => string[]
  serializeExtraContacts: (items: any[]) => string
  serializeServices: (items: string[]) => string
  [key: string]: any
}

export function createShowcaseStoreProfileActions(context: ShowcaseStoreProfileActionsContext) {
  const {
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
  } = context

  async function refreshStoreProfileFromCloud(): Promise<void> {
    await refreshStoreProfile()
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

      persistStoreProfileLocally(storeId, {
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
          .map((item: string) => item.trim())
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
        .map((item: string) => item.trim())
        .filter(Boolean)
        .filter((item: string, index: number, all: string[]) => all.indexOf(item) === index)
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
        .map((item: string) => item.trim())
        .filter(item => item && !isLocalImageUri(item))
        .filter((item: string, index: number, all: string[]) => all.indexOf(item) === index)
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
          isSuccess: (value: boolean) => value
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
      persistStoreProfileLocally(storeId, {
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
      return current.filter((_: string, itemIndex: number) => itemIndex !== index)
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

    setDraftStoreProfileExtraContacts(current => current.filter((item: any) => item.id !== id))
  }

  function updateExtraContactName(idInput: string, value: string): void {
    const id = idInput.trim()
    if (!id) return

    setDraftStoreProfileExtraContacts(current => current.map((item: any) => {
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

    setDraftStoreProfileExtraContacts(current => current.map((item: any) => {
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
      .map((item: string) => item.trim())
      .filter(Boolean)
      .filter((item: string, index: number, all: string[]) => all.indexOf(item) === index)
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
      .map((item: string) => item.trim())
      .filter(Boolean)

    const nextUrls = currentUrls.filter((item: string) => item !== url)

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
      .map((item: string) => item.trim())
      .filter(Boolean)
      .filter((item: string, index: number, all: string[]) => all.indexOf(item) === index)
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

      return current.map((item: string, itemIndex: number) => {
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
      services: services.map((item: string) => item.trim()).filter(Boolean),
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
  return {
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
  }
}
