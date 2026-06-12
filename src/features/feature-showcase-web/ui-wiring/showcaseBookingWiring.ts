import type {
  ExtraContact,
  ExtraContactDraft,
  ShowcaseAdminActions,
  ShowcaseAdminAppointmentsActions,
  ShowcaseAdminAppointmentsUiState,
  ShowcaseAdminUiState,
  ShowcaseAnnouncementCard,
  ShowcaseAnnouncementEditActions,
  ShowcaseAnnouncementEditUiState,
  ShowcaseAnnouncementsActions,
  ShowcaseAnnouncementsUiState,
  ShowcaseAppointmentCard,
  ShowcaseAppointmentDateOption,
  ShowcaseAppointmentProductCard,
  ShowcaseAppointmentSettingsSaveInput,
  ShowcaseAppointmentsActions,
  ShowcaseAppointmentsUiState,
  ShowcaseBottomBarUiState,
  ShowcaseBottomNavigationActions,
  ShowcaseChatActions,
  ShowcaseChatAppointmentShare,
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
  ShowcaseFavoriteCard,
  ShowcaseFavoritesActions,
  ShowcaseFavoritesUiState,
  ShowcaseHomeActions,
  ShowcaseHomeDish,
  ShowcaseHomeSortMode,
  ShowcaseHomeUiState,
  ShowcaseLoginActions,
  ShowcaseMerchantChatListActions,
  ShowcaseRetryOp,
  ShowcaseScreen,
  ShowcaseStoreProfileActions,
  ShowcaseStoreProfileDraft,
  ShowcaseStoreProfileUiState,
  ShowcaseSyncOverviewState,
  ShowcaseUiState
} from '../showcaseUiContract'

import {
  DEFAULT_PAGINATION,
  buildBottomBarUiState,
  normalizeNullableText,
  normalizeText
} from './showcaseCommonWiring'

function normalizeAppointmentProductCard(
  product: ShowcaseAppointmentProductCard | null | undefined
): ShowcaseAppointmentProductCard | null {
  if (!product) return null

  const dishId = normalizeText(product.dishId)
  const title = normalizeText(product.title)

  if (!dishId || !title) return null

  const priceText = normalizeText(product.priceText)

  return {
    dishId,
    title,
    priceText,
    originalPriceText: normalizeNullableText(product.originalPriceText) || priceText,
    discountPriceText: normalizeNullableText(product.discountPriceText),
    imageUrl: normalizeNullableText(product.imageUrl),
    imageVariants: product.imageVariants ?? null,
    categoryText: normalizeNullableText(product.categoryText),
    isRecommended: Boolean(product.isRecommended)
  }
}

function normalizeAppointmentCard(item: ShowcaseAppointmentCard): ShowcaseAppointmentCard {
  const priceText = normalizeNullableText(item.priceText)

  return {
    id: normalizeText(item.id),
    customerName: normalizeText(item.customerName),
    customerContact: normalizeText(item.customerContact),
    serviceTitle: normalizeText(item.serviceTitle),
    preferredDate: normalizeText(item.preferredDate),
    preferredTime: normalizeText(item.preferredTime),
    note: normalizeText(item.note),
    statusLabel: normalizeText(item.statusLabel) || 'Pending',
    cancelledBy: normalizeNullableText(item.cancelledBy),
    cancelledAt: typeof item.cancelledAt === 'number' ? item.cancelledAt : null,
    canCancelByCustomer: Boolean(item.canCancelByCustomer),
    createdAtText: normalizeText(item.createdAtText),
    imageUrl: normalizeNullableText(item.imageUrl),
    sourceDishId: normalizeNullableText(item.sourceDishId),
    priceText,
    originalPriceText: normalizeNullableText(item.originalPriceText) || priceText,
    discountPriceText: normalizeNullableText(item.discountPriceText),
    categoryText: normalizeNullableText(item.categoryText),
    isRecommended: Boolean(item.isRecommended),
    itemAvailable: Boolean(item.itemAvailable)
  }
}

function normalizeAppointmentStatus(value: string): string {
  const text = value.trim()
  return text || 'Pending'
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map(item => item.trim()).filter(Boolean)))
}

const APPOINTMENT_STATUS_FILTER_OPTIONS = [
  'All',
  'Pending',
  'Confirmed',
  'Cancelled',
  'Cancelled by customer',
  'Completed',
  'No-show'
]

function appointmentLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function buildAppointmentDateFilterOptions(items: ShowcaseAppointmentCard[]): string[] {
  return ['All', ...uniqueStrings(items.map(item => item.preferredDate))]
}

function buildAppointmentStatusFilterOptions(): string[] {
  return [...APPOINTMENT_STATUS_FILTER_OPTIONS]
}

function buildAppointmentServiceFilterOptions(items: ShowcaseAppointmentCard[]): string[] {
  return [
    'All',
    ...uniqueStrings(items.map(item => item.serviceTitle?.trim() || 'General appointment'))
  ]
}

function matchesAppointmentFilters(
  item: ShowcaseAppointmentCard,
  dateFilter: string,
  statusFilter: string,
  serviceFilter: string
): boolean {
  const selectedDate = String(dateFilter || '').trim() || 'All'
  const selectedStatus = String(statusFilter || '').trim() || 'All'
  const selectedService = String(serviceFilter || '').trim() || 'All'
  const serviceTitle = item.serviceTitle?.trim() || 'General appointment'

  if (selectedDate !== 'All' && item.preferredDate !== selectedDate) return false

  if (selectedStatus === 'Cancelled by customer') {
    if (normalizeAppointmentStatus(item.statusLabel) !== 'Cancelled' || item.cancelledBy !== 'customer') return false
  } else if (selectedStatus !== 'All' && normalizeAppointmentStatus(item.statusLabel) !== selectedStatus) {
    return false
  }

  if (selectedService !== 'All' && serviceTitle !== selectedService) return false

  return true
}

function matchesCustomerAppointmentDateFilter(
  item: ShowcaseAppointmentCard,
  selectedDateInput: string,
  today: string
): boolean {
  const selectedDate = String(selectedDateInput || '').trim() || 'All'
  const status = normalizeAppointmentStatus(item.statusLabel)

  if (selectedDate === 'History') {
    return item.preferredDate < today ||
      status === 'Completed' ||
      status === 'Cancelled' ||
      status === 'No-show'
  }

  if (selectedDate === 'All') {
    return true
  }

  return item.preferredDate === selectedDate
}

function matchesCustomerAppointmentFilters(
  item: ShowcaseAppointmentCard,
  dateFilter: string,
  statusFilter: string,
  serviceFilter: string,
  today: string
): boolean {
  const selectedStatus = String(statusFilter || '').trim() || 'All'
  const selectedService = String(serviceFilter || '').trim() || 'All'
  const serviceTitle = item.serviceTitle?.trim() || 'General appointment'

  if (!matchesCustomerAppointmentDateFilter(item, dateFilter, today)) return false

  if (selectedStatus === 'Cancelled by customer') {
    if (normalizeAppointmentStatus(item.statusLabel) !== 'Cancelled' || item.cancelledBy !== 'customer') return false
  } else if (selectedStatus !== 'All' && normalizeAppointmentStatus(item.statusLabel) !== selectedStatus) {
    return false
  }

  if (selectedService !== 'All' && serviceTitle !== selectedService) return false

  return true
}

function sortAppointments(
  items: ShowcaseAppointmentCard[],
  statusFilterInput: string
): ShowcaseAppointmentCard[] {
  const selectedStatus = String(statusFilterInput || '').trim() || 'All'
  const isAllStatus = selectedStatus === 'All'
  const isHistoryStatus = selectedStatus === 'Cancelled' ||
    selectedStatus === 'Cancelled by customer' ||
    selectedStatus === 'Completed' ||
    selectedStatus === 'No-show'

  return [...items].sort((left, right) => {
    if (isAllStatus) {
      const leftPendingRank = normalizeAppointmentStatus(left.statusLabel) === 'Pending' ? 0 : 1
      const rightPendingRank = normalizeAppointmentStatus(right.statusLabel) === 'Pending' ? 0 : 1

      if (leftPendingRank !== rightPendingRank) {
        return leftPendingRank - rightPendingRank
      }
    }

    if (isHistoryStatus) {
      const dateCompare = right.preferredDate.localeCompare(left.preferredDate)
      if (dateCompare !== 0) return dateCompare

      const timeCompare = right.preferredTime.localeCompare(left.preferredTime)
      if (timeCompare !== 0) return timeCompare

      return right.createdAtText.localeCompare(left.createdAtText)
    }

    const dateCompare = left.preferredDate.localeCompare(right.preferredDate)
    if (dateCompare !== 0) return dateCompare

    const timeCompare = left.preferredTime.localeCompare(right.preferredTime)
    if (timeCompare !== 0) return timeCompare

    return right.createdAtText.localeCompare(left.createdAtText)
  })
}

function sortCustomerAppointments(
  items: ShowcaseAppointmentCard[],
  selectedDateInput: string
): ShowcaseAppointmentCard[] {
  const selectedDate = String(selectedDateInput || '').trim() || 'All'

  return [...items].sort((left, right) => {
    if (selectedDate === 'History') {
      const dateCompare = right.preferredDate.localeCompare(left.preferredDate)
      if (dateCompare !== 0) return dateCompare

      const timeCompare = right.preferredTime.localeCompare(left.preferredTime)
      if (timeCompare !== 0) return timeCompare

      return right.createdAtText.localeCompare(left.createdAtText)
    }

    const leftPendingRank = normalizeAppointmentStatus(left.statusLabel) === 'Pending' ? 0 : 1
    const rightPendingRank = normalizeAppointmentStatus(right.statusLabel) === 'Pending' ? 0 : 1

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

function buildCustomerAppointmentServiceFilterOptions(
  uiState: ShowcaseUiState,
  appointmentCards: ShowcaseAppointmentCard[]
): string[] {
  const selectedDate = String(uiState.appointmentCustomerDateFilter || '').trim() || 'All'
  const selectedStatus = String(uiState.appointmentCustomerStatusFilter || '').trim() || 'All'
  const today = appointmentLocalDateKey(new Date())

  return [
    'All',
    ...uniqueStrings(
      appointmentCards
        .filter(item => matchesCustomerAppointmentDateFilter(item, selectedDate, today))
        .filter(item => {
          return selectedStatus === 'All' ||
            normalizeAppointmentStatus(item.statusLabel) === selectedStatus
        })
        .map(item => item.serviceTitle?.trim() || 'General appointment')
    )
  ]
}

function buildAppointmentDateOptions(uiState: ShowcaseUiState): ShowcaseAppointmentDateOption[] {
  const totalDays = Math.max(1, Math.trunc(Number(uiState.appointmentBookingWindowDays || 7)))
  const closedDays = new Set(uiState.appointmentClosedDays.map(item => item.trim()).filter(Boolean))
  const today = new Date()

  return Array.from({ length: totalDays }).map((_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)

    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const value = `${yyyy}-${mm}-${dd}`
    const weekday = date.toLocaleDateString(undefined, { weekday: 'long' })
    const available = !closedDays.has(weekday)

    return {
      value,
      title: value,
      subtitle: weekday,
      available,
      reason: available ? '' : 'Closed'
    }
  })
}

function buildAppointmentTimeOptions(uiState: ShowcaseUiState): string[] {
  const hoursText = normalizeText(uiState.appointmentAvailableHoursText)
  const match = hoursText.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/)
  const interval = Math.max(5, Math.trunc(Number(uiState.appointmentSlotIntervalMinutes || 30)))

  if (!match) return []

  const startHour = Number(match[1])
  const startMinute = Number(match[2])
  const endHour = Number(match[3])
  const endMinute = Number(match[4])

  if (![startHour, startMinute, endHour, endMinute].every(Number.isFinite)) return []

  const start = startHour * 60 + startMinute
  const end = endHour * 60 + endMinute

  if (end <= start) return []

  const values: string[] = []
  for (let minutes = start; minutes < end; minutes += interval) {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    values.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
  }

  return values
}

function buildBookingRuleSummary(uiState: ShowcaseUiState): string {
  if (!uiState.appointmentsEnabled) {
    return 'Booking unavailable'
  }

  const availableHoursText = normalizeText(uiState.appointmentAvailableHoursText) || '09:00 - 18:00'
  const minimumNotice = normalizeText(uiState.appointmentMinimumNotice)
  const minimumNoticeText = !minimumNotice || minimumNotice.toLowerCase() === 'no notice'
    ? 'Book anytime'
    : `Book ${minimumNotice} ahead`

  return `Open for booking · ${availableHoursText.replace(/\s+-\s+/g, '-')} · ${minimumNoticeText}`
}

export function buildAppointmentsWiringState(uiState: ShowcaseUiState): ShowcaseAppointmentsUiState {
  const product = normalizeAppointmentProductCard(uiState.appointmentProduct)
  const canSubmit = Boolean(
    uiState.appointmentsEnabled &&
    product &&
    uiState.appointmentSourceDishId &&
    uiState.appointmentServiceDraft.trim() &&
    uiState.appointmentNameDraft.trim() &&
    uiState.appointmentContactDraft.trim() &&
    uiState.appointmentDateDraft.trim() &&
    uiState.appointmentTimeDraft.trim() &&
    !uiState.appointmentError
  )

  return {
    enabled: uiState.appointmentsEnabled,
    product,
    serviceDraft: uiState.appointmentServiceDraft,
    nameDraft: uiState.appointmentNameDraft,
    contactDraft: uiState.appointmentContactDraft,
    dateDraft: uiState.appointmentDateDraft,
    timeDraft: uiState.appointmentTimeDraft,
    noteDraft: uiState.appointmentNoteDraft,
    errorMessage: uiState.appointmentError,
    successMessage: uiState.appointmentSuccess,
    canSubmit,
    isSubmitting: false,
    bookingRuleSummary: buildBookingRuleSummary(uiState),
    dateOptions: buildAppointmentDateOptions(uiState),
    timeOptions: buildAppointmentTimeOptions(uiState)
  }
}

export function buildAdminAppointmentsWiringState(uiState: ShowcaseUiState): ShowcaseAdminAppointmentsUiState {
  const items = sortAppointments(
    uiState.appointments
      .map(normalizeAppointmentCard)
      .filter(item => matchesAppointmentFilters(
        item,
        uiState.appointmentAdminDateFilter,
        uiState.appointmentAdminStatusFilter,
        uiState.appointmentAdminServiceFilter
      )),
    uiState.appointmentAdminStatusFilter
  )

  return {
    enabled: uiState.appointmentsEnabled,
    items,
    statusMessage: uiState.statusMessage,
    isRefreshing: uiState.appointmentsRefreshing,
    statusSubmittingId: null,
    settingsSubmitting: false,
    focusedAdminAppointmentId: null,
    bookingWindowDays: uiState.appointmentBookingWindowDays,
    availableHoursText: uiState.appointmentAvailableHoursText,
    slotIntervalMinutes: uiState.appointmentSlotIntervalMinutes,
    closedDays: uiState.appointmentClosedDays,
    minimumNotice: uiState.appointmentMinimumNotice,
dateFilterOptions: buildAppointmentDateFilterOptions(uiState.appointments),
statusFilterOptions: buildAppointmentStatusFilterOptions(),
serviceFilterOptions: buildAppointmentServiceFilterOptions(uiState.appointments),
    selectedDateFilter: uiState.appointmentAdminDateFilter,
    selectedStatusFilter: uiState.appointmentAdminStatusFilter,
    selectedServiceFilter: uiState.appointmentAdminServiceFilter,
    historyDateFilter: uiState.appointmentAdminHistoryDateFilter,

    pagination: DEFAULT_PAGINATION
  }
}

export function buildCustomerBookingsWiringState(uiState: ShowcaseUiState): ShowcaseCustomerBookingsUiState {
  const appointmentCards = uiState.appointments.map(normalizeAppointmentCard)
  const today = appointmentLocalDateKey(new Date())
  const selectedDate = String(uiState.appointmentCustomerDateFilter || '').trim() || 'All'
  const selectedStatus = String(uiState.appointmentCustomerStatusFilter || '').trim() || 'All'
  const selectedService = String(uiState.appointmentCustomerServiceFilter || '').trim() || 'All'

  const items = sortCustomerAppointments(
    appointmentCards.filter(item => {
      return matchesCustomerAppointmentFilters(
        item,
        selectedDate,
        selectedStatus,
        selectedService,
        today
      )
    }),
    selectedDate
  )

  return {
    bottomBar: buildBottomBarUiState(uiState),

    enabled: uiState.appointmentsEnabled,
    items,
    statusMessage: uiState.statusMessage,
    isRefreshing: uiState.appointmentsRefreshing,
    cancellationSubmittingId: null,
    focusedCustomerAppointmentId: null,
    dateFilterOptions: [...buildAppointmentDateFilterOptions(appointmentCards), 'History'],
    statusFilterOptions: buildAppointmentStatusFilterOptions(),
    serviceFilterOptions: buildCustomerAppointmentServiceFilterOptions(uiState, appointmentCards),
    selectedDateFilter: selectedDate,
    selectedStatusFilter: selectedStatus,
    selectedServiceFilter: selectedService,

    pagination: DEFAULT_PAGINATION
  }
}

