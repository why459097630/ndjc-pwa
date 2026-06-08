'use client'


import {
  DetailScreen,
  LoginScreen,
  NdjcNotificationOptInFloatingButton,
  NdjcNotificationOptInPanel,
  NdjcOfflineStatusBanner,
  NdjcPwaUpdateBanner,
  NdjcStoreUnavailableOverlay,
  PlaceholderScreen,
  ShowcaseAdmin,
  ShowcaseAdminAnnouncementEdit,
  ShowcaseAdminAppointmentManager,
  ShowcaseAdminCategories,
  ShowcaseAdminItems,
  ShowcaseAnnouncementsScreen,
  ShowcaseAppointmentsScreen,
  ShowcaseBottomBarHost,
  ShowcaseChangePassword,
  ShowcaseChatMedia,
  ShowcaseChatSearchResults,
  ShowcaseChatThread,
  ShowcaseCustomerBookingsScreen,
  ShowcaseEditDish,
  ShowcaseFavoritesScreen,
  ShowcaseHome,
  ShowcaseMerchantChatList,
  ShowcaseStoreProfileEdit,
  ShowcaseStoreProfileView
} from './showcaseLayouts'
import type { ShowcaseUiRenderer } from './ShowcaseUiRenderer'

export const GreenpinkShowcaseUiRenderer: ShowcaseUiRenderer = {
  OfflineStatusBanner: ({ message }) => (
    <NdjcOfflineStatusBanner message={message} />
  ),

  StoreUnavailableOverlay: ({ state, children }) => (
    <NdjcStoreUnavailableOverlay state={state}>
      {children}
    </NdjcStoreUnavailableOverlay>
  ),

  PwaUpdateBanner: ({ refreshing, onRefresh, onDismiss }) => (
    <NdjcPwaUpdateBanner
      refreshing={refreshing}
      onRefresh={onRefresh}
      onDismiss={onDismiss}
    />
  ),

  NotificationOptInPanel: ({
    open,
    busy,
    registered,
    permissionState,
    registrationState,
    messageCode,
    installState,
    installBusy,
    onRegister,
    onInstall,
    onClose
  }) => (
    <NdjcNotificationOptInPanel
      open={open}
      busy={busy}
      registered={registered}
      permissionState={permissionState}
      registrationState={registrationState}
      messageCode={messageCode}
      installState={installState}
      installBusy={installBusy}
      onRegister={onRegister}
      onInstall={onInstall}
      onClose={onClose}
    />
  ),

  NotificationOptInFloatingButton: ({ open, permissionState, registrationState, onToggle }) => (
    <NdjcNotificationOptInFloatingButton
      open={open}
      permissionState={permissionState}
      registrationState={registrationState}
      onToggle={onToggle}
    />
  ),

  Home: ({ state, actions }) => (
    <ShowcaseHome state={state} actions={actions} />
  ),

  BottomBarHost: ({
    children,
    actions,
    activeTab = null,
    showAppointments = false,
    showChatDot = false,
    showBookingsDot = false,
    showAnnouncementsDot = false
  }) => (
    <ShowcaseBottomBarHost
      actions={actions}
      activeTab={activeTab}
      showAppointments={showAppointments}
      showChatDot={showChatDot}
      showBookingsDot={showBookingsDot}
      showAnnouncementsDot={showAnnouncementsDot}
    >
      {children}
    </ShowcaseBottomBarHost>
  ),

  Login: ({ state, actions }) => (
    <LoginScreen state={state} actions={actions} />
  ),

  Admin: ({ state, actions }) => (
    <ShowcaseAdmin state={state} actions={actions} />
  ),

  AdminItems: ({ state, actions }) => (
    <ShowcaseAdminItems state={state} actions={actions} />
  ),

  AdminCategories: ({ state, actions }) => (
    <ShowcaseAdminCategories state={state} actions={actions} />
  ),

  Detail: ({ state, actions }) => (
    <DetailScreen state={state} actions={actions} />
  ),

  EditDish: ({ state, actions }) => (
    <ShowcaseEditDish state={state} actions={actions} />
  ),

  StoreProfileView: ({ state, actions }) => (
    <ShowcaseStoreProfileView state={state} actions={actions} />
  ),

  StoreProfileEdit: ({ state, actions }) => (
    <ShowcaseStoreProfileEdit state={state} actions={actions} />
  ),

  ChangePassword: ({ state, actions }) => (
    <ShowcaseChangePassword state={state} actions={actions} />
  ),

  ChatThread: ({ state, actions }) => (
    <ShowcaseChatThread state={state} actions={actions} />
  ),

  ChatMedia: ({ state, actions }) => (
    <ShowcaseChatMedia state={state} actions={actions} />
  ),

  Favorites: ({ state, actions }) => (
    <ShowcaseFavoritesScreen state={state} actions={actions} />
  ),

  Appointments: ({ state, actions }) => (
    <ShowcaseAppointmentsScreen state={state} actions={actions} />
  ),

  CustomerBookings: ({ state, actions }) => (
    <ShowcaseCustomerBookingsScreen state={state} actions={actions} />
  ),

  Announcements: ({ state, actions }) => (
    <ShowcaseAnnouncementsScreen state={state} actions={actions} />
  ),

  AdminAppointmentManager: ({ state, actions }) => (
    <ShowcaseAdminAppointmentManager state={state} actions={actions} />
  ),

  AdminAnnouncementEdit: ({ state, actions }) => (
    <ShowcaseAdminAnnouncementEdit state={state} actions={actions} />
  ),

  MerchantChatList: ({ threads, searchQuery, refreshing, pagination, actions }) => (
    <ShowcaseMerchantChatList
      threads={threads}
      searchQuery={searchQuery}
      refreshing={refreshing}
      pagination={pagination}
      actions={actions}
    />
  ),

  ChatSearchResults: ({ state, actions }) => (
    <ShowcaseChatSearchResults state={state} actions={actions} />
  ),

  Placeholder: ({ title, actions }) => (
    <PlaceholderScreen title={title} actions={actions} />
  )
}