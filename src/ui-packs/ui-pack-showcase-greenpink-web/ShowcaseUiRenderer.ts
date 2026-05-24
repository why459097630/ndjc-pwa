import type { ReactNode } from 'react'
import type {
  ShowcaseNotificationMessageCode,
  ShowcaseNotificationPermissionState,
  ShowcaseNotificationRegistrationState
} from '@/features/feature-showcase-web/showcasePushRegistrationService'
import type {
  ShowcaseAdminActions,
  ShowcaseAdminAppointmentsActions,
  ShowcaseAdminAppointmentsUiState,
  ShowcaseAdminUiState,
  ShowcaseAnnouncementEditActions,
  ShowcaseAnnouncementEditUiState,
  ShowcaseAnnouncementsActions,
  ShowcaseAnnouncementsUiState,
  ShowcaseAppointmentsActions,
  ShowcaseAppointmentsUiState,
  ShowcaseChangePasswordActions,
  ShowcaseChangePasswordUiState,
  ShowcaseChatActions,
  ShowcaseChatMediaActions,
  ShowcaseChatThreadSummaryUi,
  ShowcaseChatUiState,
  ShowcaseCustomerBookingsActions,
  ShowcaseCustomerBookingsUiState,
  ShowcaseDetailActions,
  ShowcaseDetailUiState,
  ShowcaseEditDishActions,
  ShowcaseEditDishUiState,
  ShowcaseFavoritesActions,
  ShowcaseFavoritesUiState,
  ShowcaseHomeActions,
  ShowcaseHomeUiState,
  ShowcaseLoginActions,
  ShowcaseBottomNavigationActions,
  ShowcaseLoginUiState,
  ShowcaseMerchantChatListActions,
  ShowcasePaginationUiState,
  ShowcaseStoreProfileActions,
  ShowcaseStoreProfileUiState
} from '@/features/feature-showcase-web/showcaseUiContract'
export type ShowcaseRendererBottomBarTab =
  | 'Store'
  | 'Chat'
  | 'Appointments'
  | 'Favorites'
  | 'Announcements'

export type ShowcasePwaInstallState =
  | 'unknown'
  | 'installed'
  | 'available'
  | 'manual-ios'
  | 'manual-safari-required'
  | 'unsupported'

export type ShowcaseUiRenderer = {
  OfflineStatusBanner: (input: { message?: string | null }) => ReactNode
  PwaUpdateBanner: (input: {
    refreshing: boolean
    onRefresh: () => void
    onDismiss: () => void
  }) => ReactNode
  NotificationOptInPanel: (input: {
    open: boolean
    busy: boolean
    registered: boolean
    permissionState: ShowcaseNotificationPermissionState
    registrationState: ShowcaseNotificationRegistrationState
    messageCode: ShowcaseNotificationMessageCode
    installState: ShowcasePwaInstallState
    installBusy: boolean
    onRegister: () => void
    onInstall: () => void
  }) => ReactNode
  NotificationOptInFloatingButton: (input: {
    open: boolean
    permissionState: ShowcaseNotificationPermissionState
    registrationState: ShowcaseNotificationRegistrationState
    onToggle: () => void
  }) => ReactNode
  Home: (input: { state: ShowcaseHomeUiState; actions: ShowcaseHomeActions }) => ReactNode
  BottomBarHost: (input: {
    children: ReactNode
    actions: ShowcaseBottomNavigationActions
    activeTab?: ShowcaseRendererBottomBarTab | null
    showAppointments?: boolean
    showChatDot?: boolean
    showBookingsDot?: boolean
    showAnnouncementsDot?: boolean
  }) => ReactNode

  Login: (input: { state: ShowcaseLoginUiState; actions: ShowcaseLoginActions }) => ReactNode

  Admin: (input: { state: ShowcaseAdminUiState; actions: ShowcaseAdminActions }) => ReactNode
  AdminItems: (input: { state: ShowcaseAdminUiState; actions: ShowcaseAdminActions }) => ReactNode
  AdminCategories: (input: { state: ShowcaseAdminUiState; actions: ShowcaseAdminActions }) => ReactNode

  Detail: (input: { state: ShowcaseDetailUiState; actions: ShowcaseDetailActions }) => ReactNode
  EditDish: (input: { state: ShowcaseEditDishUiState; actions: ShowcaseEditDishActions }) => ReactNode

  StoreProfileView: (input: { state: ShowcaseStoreProfileUiState; actions: ShowcaseStoreProfileActions }) => ReactNode
  StoreProfileEdit: (input: { state: ShowcaseStoreProfileUiState; actions: ShowcaseStoreProfileActions }) => ReactNode

  ChangePassword: (input: { state: ShowcaseChangePasswordUiState; actions: ShowcaseChangePasswordActions }) => ReactNode

  ChatThread: (input: { state: ShowcaseChatUiState; actions: ShowcaseChatActions }) => ReactNode
  ChatMedia: (input: { state: ShowcaseChatUiState; actions: ShowcaseChatMediaActions }) => ReactNode

  Favorites: (input: { state: ShowcaseFavoritesUiState; actions: ShowcaseFavoritesActions }) => ReactNode

  Appointments: (input: { state: ShowcaseAppointmentsUiState; actions: ShowcaseAppointmentsActions }) => ReactNode
  CustomerBookings: (input: { state: ShowcaseCustomerBookingsUiState; actions: ShowcaseCustomerBookingsActions }) => ReactNode

  Announcements: (input: { state: ShowcaseAnnouncementsUiState; actions: ShowcaseAnnouncementsActions }) => ReactNode

  AdminAppointmentManager: (input: { state: ShowcaseAdminAppointmentsUiState; actions: ShowcaseAdminAppointmentsActions }) => ReactNode
  AdminAnnouncementEdit: (input: { state: ShowcaseAnnouncementEditUiState; actions: ShowcaseAnnouncementEditActions }) => ReactNode

  MerchantChatList: (input: {
    threads: ShowcaseChatThreadSummaryUi[]
    searchQuery: string
    refreshing: boolean
    pagination: ShowcasePaginationUiState
    actions: ShowcaseMerchantChatListActions
  }) => ReactNode
  ChatSearchResults: (input: { state: ShowcaseChatUiState; actions: ShowcaseChatActions }) => ReactNode

  Placeholder: (input: { title: string; actions?: any }) => ReactNode
}