'use client'



import {
  DetailScreen,
  LoginScreen,
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

  MerchantChatList: ({ threads, refreshing, actions }) => (
    <ShowcaseMerchantChatList
      threads={threads}
      refreshing={refreshing}
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