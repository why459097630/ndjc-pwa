'use client'

import type {
  CloudAppointmentFilterRow,
  CloudAppointmentRequest,
  CloudAppointmentSettings
} from '../showcaseCloudRepository'
import type {
  AppointmentCloudQueryFilters,
  ShowcasePaginationRuntimeState
} from './showcaseViewModelUtils'
import type {
  ShowcaseAppointmentCard,
  ShowcaseAppointmentDateOption,
  ShowcaseAppointmentSettingsSaveInput
} from '../showcaseUiContract'

type StateSetter = {
  (updater: (current: any) => any): void
  (value: any): void
}

type MutableRefLike<T = any> = { current: T }

type ShowcaseBookingActionsContext = {
  [key: string]: any
  adminAppointmentsPagination: ShowcasePaginationRuntimeState
  appointmentCards: ShowcaseAppointmentCard[]
  appointmentClosedDays: string[]
  appointmentRequests: CloudAppointmentRequest[]
  appointmentSettings: CloudAppointmentSettings
  currentScreenRef: MutableRefLike
  customerAppointmentCards: ShowcaseAppointmentCard[]
  customerAppointmentsPagination: ShowcasePaginationRuntimeState
  isAdminLoggedInRef: MutableRefLike<boolean>
  loadAppointmentsFromStorage: (storeId: string) => CloudAppointmentRequest[]
  loadSeenAppointmentStatusAlertKeys: (storeId: string, clientId: string) => string[]
  mergeUniqueById: <T extends { id: string }>(current: T[], incoming: T[]) => T[]
  persistAppointmentsLocally: (storeId: string, items: CloudAppointmentRequest[]) => void
  updateAdminPendingAppointmentCountSnapshotFromItems: (items: CloudAppointmentRequest[]) => void
  sortedAppointmentsForStorage: (items: CloudAppointmentRequest[]) => CloudAppointmentRequest[]
  setAdminAppointmentFilterRows: StateSetter
  setAdminAppointmentsPagination: StateSetter
  setAppointmentAdminDateFilter: StateSetter
  setAppointmentAdminHistoryDateFilter: StateSetter
  setAppointmentAdminServiceFilter: StateSetter
  setAppointmentAdminStatusFilter: StateSetter
  setAppointmentAvailableHoursText: StateSetter
  setAppointmentBookingWindowDays: StateSetter
  setAppointmentClosedDays: StateSetter
  setAppointmentContactDraft: StateSetter
  setAppointmentCustomerDateFilter: StateSetter
  setAppointmentCustomerServiceFilter: StateSetter
  setAppointmentCustomerStatusFilter: StateSetter
  setAppointmentDateDraft: StateSetter
  setAppointmentError: StateSetter
  setAppointmentMinimumNotice: StateSetter
  setAppointmentNameDraft: StateSetter
  setAppointmentNoteDraft: StateSetter
  setAppointmentRequests: StateSetter
  setAppointmentServiceDraft: StateSetter
  setAppointmentSettings: StateSetter
  setAppointmentSettingsSubmitting: StateSetter
  setAppointmentSlotIntervalMinutes: StateSetter
  setAppointmentSourceDishId: StateSetter
  setAppointmentStatusSubmittingId: StateSetter
  setAppointmentSuccess: StateSetter
  setAppointmentTimeDraft: StateSetter
  setAppointmentsEnabled: StateSetter
  setAppointmentsRefreshing: StateSetter
  setBookingsEntryDotVisible: StateSetter
  setCustomerAppointmentFilterRows: StateSetter
  setCustomerAppointmentsPagination: StateSetter
  setPreviousScreen: StateSetter
  setScreen: StateSetter
  setStatusMessage: StateSetter
}

export function createShowcaseBookingActions(context: ShowcaseBookingActionsContext) {
const {
  SHOWCASE_PAGE_SIZE, ShowcaseScreens, adminAppointmentsPagination, appointmentAdminDateFilter, appointmentAdminHistoryDateFilter, appointmentAdminServiceFilter,
  appointmentAdminStatusFilter, appointmentAvailableHoursText, appointmentBookingWindowDays, appointmentCards, appointmentClosedDays, appointmentCloudCancelledByFilterFromUi,
  appointmentCloudCancelledByNotFilterFromUi, appointmentCloudDateFiltersFromUi, appointmentCloudServiceFilterFromUi, appointmentCloudStatusFilterFromUi, appointmentContactDraft, appointmentCustomerDateFilter,
  appointmentCustomerServiceFilter, appointmentCustomerStatusFilter, appointmentDateDraft, appointmentDetailBackTargetRef, appointmentLocalDateKey, appointmentMinimumNotice,
  appointmentNameDraft, appointmentNoteDraft, appointmentRequests, appointmentServiceDraft, appointmentSettings, appointmentSlotIntervalMinutes,
  appointmentSourceDishId, appointmentStatusAlertKey, appointmentStatusSubmittingId, appointmentTimeDraft, appointmentsEnabled, appointmentsRefreshing,
  appointmentsStatusFromCloud, appointmentsStatusToCloud, bindMerchantSessionToRepository, canCustomerCancelAppointmentStatus, clientId, currentScreenRef,
  customerAppointmentCards, customerAppointmentDateOptions, customerAppointmentTimeOptionsForDate, customerAppointmentsPagination, defaultAppointmentSettings, detailBackTargetRef,
  dispatchAppointmentStatusPushToCustomer, dispatchCustomerCancelledAppointmentPushToMerchant, dispatchNewAppointmentPushToMerchant, encodeAppointmentPriceSnapshotFromDish, ensureDishEntityLoaded, ensureValidMerchantSessionLoadedForCloud,
  formatDateTimeText, formatShowcaseDateAndTimeParts, getDishEntityById, getDishTitle, guardOfflineWriteOperation, hydrateAppointmentLinkedDishesFromRequests,
  isAdminLoggedIn, isAdminLoggedInRef, isCustomerBookingAlertStatus, isMerchantLoggedInInStoreSession, loadAppointmentsFromStorage, loadSeenAppointmentStatusAlertKeys,
  merchantSessionEnsureFailureMessage, merchantSessionEnsureSnackbarMessage, mergeUniqueById, nowMillis, parseShowcaseDateInput, persistAppointmentsLocally,
  updateAdminPendingAppointmentCountSnapshotFromItems, pruneBookingSeenWhenCompletePageLoaded, pushPendingSync, registerAppointmentClientPushDevice, removePendingSync, repository, resolveDishImage,
  retryMerchantCloudOperationAfterAuthRefresh, screen, setAdminAppointmentFilterRows, setAdminAppointmentsPagination, setAppointmentAdminDateFilter, setAppointmentAdminHistoryDateFilter,
  setAppointmentAdminServiceFilter, setAppointmentAdminStatusFilter, setAppointmentAvailableHoursText, setAppointmentBookingWindowDays, setAppointmentClosedDays, setAppointmentContactDraft,
  setAppointmentCustomerDateFilter, setAppointmentCustomerServiceFilter, setAppointmentCustomerStatusFilter, setAppointmentDateDraft, setAppointmentError, setAppointmentMinimumNotice,
  setAppointmentNameDraft, setAppointmentNoteDraft, setAppointmentRequests, setAppointmentServiceDraft, setAppointmentSettings, setAppointmentSettingsSubmitting,
  setAppointmentSlotIntervalMinutes, setAppointmentSourceDishId, setAppointmentStatusSubmittingId, setAppointmentSuccess, setAppointmentTimeDraft, setAppointmentsEnabled,
  setAppointmentsRefreshing, setBookingsEntryDotVisible, setCustomerAppointmentFilterRows, setCustomerAppointmentsPagination, setPreviousScreen, setScreen,
  setStatusMessage, setStoreMerchantSessionFromAuthSession, showSnackbar, sortedAppointmentsForStorage, storeId
} = context

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

      let bookingSubmitStage = 'before submitAppointmentRequest'

      try {
        bookingSubmitStage = 'submitAppointmentRequest'

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

        bookingSubmitStage = 'after submitAppointmentRequest'

        if (!created) {
          const detail = [
            repository.lastUpsertCode != null ? `code=${repository.lastUpsertCode}` : '',
            repository.lastUpsertBody ? `body=${repository.lastUpsertBody.slice(0, 300)}` : ''
          ].filter(Boolean).join(' ')

          throw new Error(detail || 'Booking request failed. Please check your connection.')
        }

        bookingSubmitStage = 'build next appointment list'

        const next = [created, ...appointmentRequests.filter(item => item.id !== created.id)]

        bookingSubmitStage = 'setAppointmentRequests'
        setAppointmentRequests(next)

        bookingSubmitStage = 'persistAppointmentsLocally'
        persistAppointmentsLocally(storeId, next)

        bookingSubmitStage = 'setScreen CustomerBookings'
        setScreen(ShowcaseScreens.CustomerBookings)

        bookingSubmitStage = 'clear appointment form drafts'
        setAppointmentNameDraft('')
        setAppointmentContactDraft('')
        setAppointmentDateDraft('')
        setAppointmentTimeDraft('')
        setAppointmentNoteDraft('')

        bookingSubmitStage = 'clear appointment messages'
        setAppointmentError(null)
        setAppointmentSuccess(null)
        setStatusMessage('Booking request sent. Check the status here.')

        bookingSubmitStage = 'start background appointment side effects'

        void registerAppointmentClientPushDevice('customer-booking-submitted', true)
          .catch((error: unknown) => {
            console.warn('Appointment client push registration failed after booking submit.', error)
          })

        void dispatchNewAppointmentPushToMerchant(created)
          .catch((error: unknown) => {
            console.warn('Merchant appointment push failed after booking submit.', error)
          })

        void refreshCustomerAppointmentsFromCloud()
          .catch((error: unknown) => {
            console.warn('Customer bookings refresh failed after booking submit.', error)
          })

        bookingSubmitStage = 'booking submit success path finished'
      } catch (error) {
        console.error('Booking submit failed at stage:', bookingSubmitStage, error)
        console.error('Booking submit repository response:', {
          code: repository.lastUpsertCode,
          body: repository.lastUpsertBody
        })

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

    const previous = appointmentRequests
    const previousTarget = previous.find(item => item.id === appointmentId) || null

    if (previousTarget?.status === 'cancelled' && previousTarget.cancelledBy === 'customer') {
      setStatusMessage('This booking was cancelled by the customer and can no longer be changed.')
      showSnackbar('This booking was cancelled by the customer.')
      return
    }

    if (guardOfflineWriteOperation()) {
      return
    }

    setAppointmentStatusSubmittingId(appointmentId)

    const previousStatus = previousTarget?.status || null

    const statusCancelledAt = status === 'cancelled' ? Date.now() : null
    const statusCancelledBy = status === 'cancelled' ? 'merchant' : null

    const next = previous.map(item => {
      if (item.id !== appointmentId) return item

      return {
        ...item,
        status,
        cancelledBy: statusCancelledBy,
        cancelledAt: statusCancelledAt
      }
    })

    const nextTarget = next.find(item => item.id === appointmentId) || null

    setAppointmentRequests(next)
    persistAppointmentsLocally(storeId, next)
    setStatusMessage(null)

    try {
      const validSession = await ensureValidMerchantSessionLoadedForCloud()

      if (!validSession) {
        setAppointmentRequests(previous)
        persistAppointmentsLocally(storeId, previous)
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
          isSuccess: (value: boolean) => value
        })

        if (retry.status === 'handled_without_retry') return

        if (retry.status === 'retried_success') {
          ok = true
        } else {
          throw new Error('Appointment status update failed.')
        }
      }

      if (previousStatus !== status && nextTarget && isCustomerBookingAlertStatus(statusLabel)) {
        await dispatchAppointmentStatusPushToCustomer(nextTarget, statusLabel)
      }

      await refreshAdminAppointmentsFromCloud('Appointment status updated.')
    } catch {
      setAppointmentRequests(previous)
      persistAppointmentsLocally(storeId, previous)
      setStatusMessage('Appointment status update failed.')
      showSnackbar('Booking status update failed.')
    } finally {
      setAppointmentStatusSubmittingId(null)
    }
  }

    async function cancelCustomerBooking(appointmentIdInput: string): Promise<void> {
    if (appointmentStatusSubmittingId) return

    const appointmentId = appointmentIdInput.trim()
    const currentClientId = clientId.trim()

    if (!appointmentId || !currentClientId) return

    const target = appointmentRequests.find(item => {
      return item.id === appointmentId && item.clientId.trim() === currentClientId
    }) || null

    if (!target || !canCustomerCancelAppointmentStatus(target.status)) {
      setStatusMessage('This booking can no longer be cancelled.')
      showSnackbar('This booking can no longer be cancelled.')
      return
    }

    if (guardOfflineWriteOperation()) {
      setStatusMessage('You are offline. Please reconnect and try again.')
      showSnackbar('You are offline. Please reconnect and try again.')
      return
    }

    setAppointmentStatusSubmittingId(appointmentId)

    const previous = appointmentRequests
    const cancelledAt = Date.now()
    const next = previous.map(item => {
      if (item.id !== appointmentId) return item

      return {
        ...item,
        status: 'cancelled',
        cancelledBy: 'customer',
        cancelledAt
      }
    })

    setAppointmentRequests(next)
    persistAppointmentsLocally(storeId, next)
    setStatusMessage(null)

    try {
      const ok = await repository.cancelAppointmentByCustomer({
        storeId,
        appointmentId,
        clientId: currentClientId
      })

      if (!ok) {
        const detail = [
          repository.lastUpsertCode != null ? `code=${repository.lastUpsertCode}` : '',
          repository.lastUpsertBody ? `body=${repository.lastUpsertBody.slice(0, 300)}` : ''
        ].filter(Boolean).join(' ')

        throw new Error(detail || 'Booking cancellation failed.')
      }

      const cancelledTarget = next.find(item => item.id === appointmentId) || null
      let pushFailureDetail = ''

      if (cancelledTarget) {
        try {
          await dispatchCustomerCancelledAppointmentPushToMerchant(cancelledTarget)
        } catch (pushError) {
          pushFailureDetail = pushError instanceof Error
            ? pushError.message
            : String(pushError || 'Customer cancelled appointment push failed.')

          console.error('[NDJC_PUSH] Customer cancelled appointment push failed after cloud cancellation succeeded.', {
            storeId,
            appointmentId,
            clientId: currentClientId,
            detail: pushFailureDetail,
            code: repository.lastAnnouncementPushCode,
            body: repository.lastAnnouncementPushBody
          })
        }
      }

      await refreshCustomerAppointmentsFromCloud('Booking cancelled.')

      if (pushFailureDetail) {
        const detail = pushFailureDetail.slice(0, 240)
        setStatusMessage(`Booking cancelled, but push notification failed. ${detail}`)
        showSnackbar('Booking cancelled, but push notification failed.')
        return
      }

      showSnackbar('Booking cancelled.')
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error || '')
      console.error('[NDJC_APPOINTMENT_CANCEL] Customer booking cancellation failed.', {
        storeId,
        appointmentId,
        clientId: currentClientId,
        detail,
        code: repository.lastUpsertCode,
        body: repository.lastUpsertBody
      })

      setAppointmentRequests(previous)
      persistAppointmentsLocally(storeId, previous)
      setStatusMessage('Booking cancellation failed.')
      showSnackbar('Booking cancellation failed.')
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

    function formatAppointmentPushShortTime(
      dateInput: string | number | Date | null | undefined,
      timeInput: string | null | undefined
    ): string {
      const combined = formatShowcaseDateAndTimeParts(dateInput, timeInput)
      const date = parseShowcaseDateInput(dateInput)
      const rawTime = String(timeInput || '').trim()

      if (!date) return combined || rawTime

      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const diffDays = Math.round((targetDay.getTime() - today.getTime()) / 86400000)
      const timeText = rawTime || date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })

      if (diffDays === 0) return timeText ? `Today ${timeText}` : 'Today'
      if (diffDays === 1) return timeText ? `Tomorrow ${timeText}` : 'Tomorrow'

      return combined
    }

  function formatNewAppointmentMerchantPushBody(appointment: CloudAppointmentRequest): string {
    const customerName = String(appointment.customerName || '').trim() || 'A customer'
    const serviceTitle = String(appointment.serviceTitle || '').trim()
    const shortTime = formatAppointmentPushShortTime(appointment.preferredDate, appointment.preferredTime)
    const parts = [
      customerName,
      serviceTitle,
      shortTime
    ].map(value => String(value || '').trim()).filter(Boolean)

    if (parts.length > 0) return parts.join(' · ')

    return 'A customer submitted a booking request'
  }

  function formatCancelledAppointmentMerchantPushBody(appointment: CloudAppointmentRequest): string {
    const customerName = String(appointment.customerName || '').trim() || 'A customer'
    const serviceTitle = String(appointment.serviceTitle || '').trim()
    const shortTime = formatAppointmentPushShortTime(appointment.preferredDate, appointment.preferredTime)
    const parts = [
      customerName,
      serviceTitle,
      shortTime
    ].map(value => String(value || '').trim()).filter(Boolean)

    if (parts.length > 0) {
      return parts.join(' · ')
    }

    return 'A customer booking request'
  }

    function formatAppointmentStatusCustomerPushBody(appointment: CloudAppointmentRequest): string {
      const serviceTitle = String(appointment.serviceTitle || '').trim()
      const shortTime = formatAppointmentPushShortTime(appointment.preferredDate, appointment.preferredTime)
      const parts = [
        serviceTitle,
        shortTime
      ].map(value => String(value || '').trim()).filter(Boolean)

      if (parts.length > 0) return parts.join(' · ')

      return 'Your booking was updated'
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
      if (!appointmentsEnabled) {
        return 'Booking unavailable'
      }

      const availableStartTime = appointmentSettings.availableStartTime.trim() || '09:00'
      const availableEndTime = appointmentSettings.availableEndTime.trim() || '18:00'
      const minimumNotice = appointmentSettings.minimumNotice.trim()
      const minimumNoticeText = !minimumNotice || minimumNotice.toLowerCase() === 'no notice'
        ? 'Book anytime'
        : `Book ${minimumNotice} ahead`

      return `Open for booking · ${availableStartTime}-${availableEndTime} · ${minimumNoticeText}`
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
      const normalizedSelectedStatus = selectedStatus.trim().toLowerCase()
      const isHistoryStatusFilter = normalizedSelectedStatus === 'cancelled' ||
        normalizedSelectedStatus === 'cancelled by customer' ||
        normalizedSelectedStatus === 'completed' ||
        normalizedSelectedStatus === 'no-show'

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
          const normalizedItemStatus = String(item.statusLabel || '').trim().toLowerCase()
          const normalizedCancelledBy = String(item.cancelledBy || '').trim().toLowerCase()

          if (normalizedSelectedStatus === 'all') return true

          if (normalizedSelectedStatus === 'cancelled by customer') {
            return normalizedItemStatus === 'cancelled' && normalizedCancelledBy === 'customer'
          }

          if (normalizedSelectedStatus === 'cancelled') {
            return normalizedItemStatus === 'cancelled' && normalizedCancelledBy !== 'customer'
          }

          return item.statusLabel === selectedStatus
        })
        .sort((left: ShowcaseAppointmentCard, right: ShowcaseAppointmentCard) => {
          if (isHistoryStatusFilter) {
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
          const normalizedSelectedStatus = selectedStatus.trim().toLowerCase()
          const normalizedItemStatus = String(item.statusLabel || '').trim().toLowerCase()
          const normalizedCancelledBy = String(item.cancelledBy || '').trim().toLowerCase()

          if (normalizedSelectedStatus === 'all') return true

          if (normalizedSelectedStatus === 'cancelled by customer') {
            return normalizedItemStatus === 'cancelled' && normalizedCancelledBy === 'customer'
          }

          if (normalizedSelectedStatus === 'cancelled') {
            return normalizedItemStatus === 'cancelled' && normalizedCancelledBy !== 'customer'
          }

          return item.statusLabel === selectedStatus
        })
        .sort((left: ShowcaseAppointmentCard, right: ShowcaseAppointmentCard) => {
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
        cancelledBy: appointmentCloudCancelledByFilterFromUi(statusFilter),
        cancelledByNot: appointmentCloudCancelledByNotFilterFromUi(statusFilter),
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
        cancelledBy: appointmentCloudCancelledByFilterFromUi(statusFilter),
        cancelledByNot: appointmentCloudCancelledByNotFilterFromUi(statusFilter),
        serviceTitle: appointmentCloudServiceFilterFromUi(serviceFilter)
      }
    }

    function appointmentFilterRowMatchesStatus(
      row: CloudAppointmentFilterRow,
      statusFilterInput: string
    ): boolean {
      const statusFilter = String(statusFilterInput || '').trim() || 'All'
      const rowStatus = appointmentsStatusFromCloud(row.status)
      const rowCancelledBy = String(row.cancelledBy || '').trim().toLowerCase()

      if (statusFilter === 'All') return true

      if (statusFilter === 'Cancelled by customer') {
        return rowStatus === 'Cancelled' && rowCancelledBy === 'customer'
      }

      if (statusFilter === 'Cancelled') {
        return rowStatus === 'Cancelled' && rowCancelledBy !== 'customer'
      }

      return rowStatus === statusFilter
    }

    function appointmentFilterRowMatchesService(
      row: CloudAppointmentFilterRow,
      serviceFilterInput: string
    ): boolean {
      const serviceFilter = String(serviceFilterInput || '').trim() || 'All'
      const rowService = row.serviceTitle.trim() || 'General appointment'

      return serviceFilter === 'All' || rowService === serviceFilter
    }

    function appointmentFilterRowsToFutureDateOptions(
      rows: CloudAppointmentFilterRow[],
      statusFilterInput: string = 'All',
      serviceFilterInput: string = 'All'
    ): string[] {
      const today = appointmentLocalDateKey(new Date())

      return [
        'All',
        ...Array.from(
          new Set(
            rows
              .filter(item => appointmentFilterRowMatchesStatus(item, statusFilterInput))
              .filter(item => appointmentFilterRowMatchesService(item, serviceFilterInput))
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
      setAppointmentAdminDateFilter('All')
      setAppointmentAdminHistoryDateFilter(null)
      setAppointmentAdminServiceFilter('All')

      void refreshAdminAppointmentsFromCloud(null, currentAdminAppointmentCloudFilters({
        dateFilter: 'All',
        statusFilter: nextStatusFilter,
        serviceFilter: 'All',
        historyDateFilter: null
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
      setAppointmentCustomerDateFilter('All')
      setAppointmentCustomerServiceFilter('All')

      void refreshCustomerAppointmentsFromCloud(null, currentCustomerAppointmentCloudFilters({
        dateFilter: 'All',
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
        cancelledBy: filtersInput.cancelledBy,
        cancelledByNot: filtersInput.cancelledByNot,
        serviceTitle: filtersInput.serviceTitle,
        limit: SHOWCASE_PAGE_SIZE.merchantAppointments,
        offset: 0
      })
      const sortedItems = items.slice().sort((left: CloudAppointmentRequest, right: CloudAppointmentRequest) => {
        return (right.createdAt || 0) - (left.createdAt || 0)
      })

      setAppointmentRequests(sortedItems)
      persistAppointmentsLocally(storeId, sortedItems)
      updateAdminPendingAppointmentCountSnapshotFromItems(sortedItems)
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
        cancelledBy: filtersInput.cancelledBy,
        cancelledByNot: filtersInput.cancelledByNot,
        serviceTitle: filtersInput.serviceTitle,
        limit: SHOWCASE_PAGE_SIZE.clientAppointments,
        offset: 0
      })
      const sortedItems = items.slice().sort((left: CloudAppointmentRequest, right: CloudAppointmentRequest) => {
        return (right.createdAt || 0) - (left.createdAt || 0)
      })

      setAppointmentRequests(sortedItems)
      persistAppointmentsLocally(storeId, sortedItems)
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
            isSuccess: (value: boolean) => value
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
          cancelledBy: filters.cancelledBy,
          cancelledByNot: filters.cancelledByNot,
          serviceTitle: filters.serviceTitle,
          limit: SHOWCASE_PAGE_SIZE.clientAppointments,
          offset: customerAppointmentsPagination.nextOffset
        })
        const merged = sortedAppointmentsForStorage(mergeUniqueById(appointmentRequests, nextItems))

        setAppointmentRequests(merged)
        if (nextItems.length) {
          persistAppointmentsLocally(storeId, merged)
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
          cancelledBy: filters.cancelledBy,
          cancelledByNot: filters.cancelledByNot,
          serviceTitle: filters.serviceTitle,
          limit: SHOWCASE_PAGE_SIZE.merchantAppointments,
          offset: adminAppointmentsPagination.nextOffset
        })
        const merged = sortedAppointmentsForStorage(mergeUniqueById(appointmentRequests, nextItems))

        setAppointmentRequests(merged)
        if (nextItems.length) persistAppointmentsLocally(storeId, merged)
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

    async function refreshBookingsEntryDotOnce(): Promise<void> {
      const currentClientId = clientId.trim()

      if (!currentClientId) {
        setBookingsEntryDotVisible(false)
        return
      }

      const latestScreen = currentScreenRef.current
      const latestAdminLoggedIn = isAdminLoggedInRef.current || isMerchantLoggedInInStoreSession()
      const isCustomerBookingsScreen = latestScreen === ShowcaseScreens.CustomerBookings

      try {
        const latest = await repository.fetchAppointmentRequests({
          storeId,
          clientId: currentClientId,
          merchant: false,
          limit: SHOWCASE_PAGE_SIZE.clientAppointments,
          offset: 0
        })
        const sortedItems = latest.slice().sort((left: CloudAppointmentRequest, right: CloudAppointmentRequest) => {
          return (right.createdAt || 0) - (left.createdAt || 0)
        })

        pruneBookingSeenWhenCompletePageLoaded(
          storeId,
          currentClientId,
          sortedItems,
          latest.length,
          SHOWCASE_PAGE_SIZE.clientAppointments
        )

        const seenKeys = loadSeenAppointmentStatusAlertKeys(storeId, currentClientId)
        const hasUnseenAlert = sortedItems
          .filter((item: CloudAppointmentRequest) => isCustomerBookingAlertStatus(appointmentsStatusFromCloud(item.status)))
          .map((item: CloudAppointmentRequest) => appointmentStatusAlertKey(item.id, appointmentsStatusFromCloud(item.status)))
          .filter(Boolean)
          .some((key: string) => !seenKeys.includes(key))

        setBookingsEntryDotVisible(
          latestAdminLoggedIn || isCustomerBookingsScreen
            ? false
            : hasUnseenAlert
        )
      } catch {
      }
    }
  return {
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
  }
}
