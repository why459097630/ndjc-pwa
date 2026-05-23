'use client'

import type { ReactNode } from 'react'
import type { ShowcaseUiRenderer } from '@/ui-packs/ui-pack-showcase-greenpink-web'
import { useShowcaseViewModel } from './useShowcaseViewModel'
import type {
  ShowcaseScreenName,
  ShowcaseUiModel
} from './showcaseUiContract'

export type ShowcaseHostInput = {
  routeId?: string | null
  storeId?: string | null
  initialScreen?: ShowcaseScreenName | null
  ui: ShowcaseUiRenderer
}

export function routeToShowcaseScreen(routeIdInput?: string | null): ShowcaseScreenName {
  const routeId = String(routeIdInput || '').trim()

  if (!routeId) return 'Home'

  const normalized = routeId
    .replace(/[_\s]+/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()

  const compact = normalized.replace(/-/g, '')

  if (routeId === 'Home' || normalized === 'home' || compact === 'home') return 'Home'
  if (routeId === 'Login' || normalized === 'login' || compact === 'login') return 'Login'
  if (routeId === 'Admin' || normalized === 'admin' || compact === 'admin') return 'Admin'
  if (routeId === 'AdminItems' || normalized === 'admin-items' || compact === 'adminitems') return 'AdminItems'
  if (routeId === 'AdminCategories' || normalized === 'admin-categories' || compact === 'admincategories') return 'AdminCategories'
  if (routeId === 'Detail' || normalized === 'detail' || compact === 'detail') return 'Detail'
  if (routeId === 'Edit' || normalized === 'edit' || compact === 'edit') return 'Edit'
  if (routeId === 'StoreProfileView' || normalized === 'store-profile-view' || compact === 'storeprofileview') return 'StoreProfileView'
  if (routeId === 'StoreProfile' || normalized === 'store-profile' || compact === 'storeprofile') return 'StoreProfile'
  if (routeId === 'ChangePassword' || normalized === 'change-password' || compact === 'changepassword') return 'ChangePassword'
  if (routeId === 'MerchantChatList' || normalized === 'merchant-chat-list' || compact === 'merchantchatlist') return 'MerchantChatList'
  if (routeId === 'Chat' || normalized === 'chat' || compact === 'chat') return 'Chat'
  if (routeId === 'ChatSearchResults' || normalized === 'chat-search-results' || compact === 'chatsearchresults') return 'ChatSearchResults'
  if (routeId === 'ChatMedia' || normalized === 'chat-media' || compact === 'chatmedia') return 'ChatMedia'
  if (routeId === 'Favorites' || normalized === 'favorites' || compact === 'favorites') return 'Favorites'
  if (routeId === 'Appointments' || normalized === 'appointments' || compact === 'appointments') return 'Appointments'
  if (routeId === 'CustomerBookings' || normalized === 'customer-bookings' || compact === 'customerbookings') return 'CustomerBookings'
  if (routeId === 'Announcements' || normalized === 'announcements' || compact === 'announcements') return 'Announcements'
  if (routeId === 'AdminAppointmentManager' || normalized === 'admin-appointment-manager' || compact === 'adminappointmentmanager') return 'AdminAppointmentManager'
  if (routeId === 'AdminAnnouncementEdit' || normalized === 'admin-announcement-edit' || compact === 'adminannouncementedit') return 'AdminAnnouncementEdit'

  return 'Home'
}

function renderHomeWithBottomBar(
  viewModel: ShowcaseUiModel,
  ui: ShowcaseUiRenderer
): ReactNode {
  return ui.BottomBarHost({
    actions: viewModel.homeActions,
    activeTab: null,
    showAppointments: viewModel.homeState.showAppointments,
    showChatDot: viewModel.homeState.showChatDot,
    showAnnouncementsDot: viewModel.homeState.showAnnouncementsDot,
    children: ui.Home({
      state: viewModel.homeState,
      actions: viewModel.homeActions
    })
  })
}

function renderDetailWithBottomBar(
  viewModel: ShowcaseUiModel,
  ui: ShowcaseUiRenderer
): ReactNode {
  return ui.BottomBarHost({
    actions: viewModel.detailActions,
    activeTab: null,
    showAppointments: viewModel.detailState.bottomBar.showAppointments,
    showChatDot: viewModel.detailState.bottomBar.showChatDot,
    showAnnouncementsDot: viewModel.detailState.bottomBar.showAnnouncementsDot,
    children: ui.Detail({
      state: viewModel.detailState,
      actions: viewModel.detailActions
    })
  })
}

export function renderShowcaseHostScreen(
  viewModel: ShowcaseUiModel,
  ui: ShowcaseUiRenderer
): ReactNode {
  if (viewModel.screen === 'Detail') {
    return renderDetailWithBottomBar(viewModel, ui)
  }

  if (viewModel.screen === 'Login') {
    return ui.Login({
      state: viewModel.loginState,
      actions: viewModel.loginActions
    })
  }

  if (viewModel.screen === 'Admin') {
    return ui.Admin({
      state: viewModel.adminState,
      actions: viewModel.adminActions
    })
  }

  if (viewModel.screen === 'AdminItems') {
    return ui.AdminItems({
      state: viewModel.adminState,
      actions: viewModel.adminActions
    })
  }

  if (viewModel.screen === 'AdminCategories') {
    return ui.AdminCategories({
      state: viewModel.adminState,
      actions: viewModel.adminActions
    })
  }

  if (viewModel.screen === 'Edit') {
    return ui.EditDish({
      state: viewModel.editDishState,
      actions: viewModel.editDishActions
    })
  }

  if (viewModel.screen === 'StoreProfile') {
    return ui.StoreProfileEdit({
      state: viewModel.storeProfileState,
      actions: viewModel.storeProfileActions
    })
  }

  if (viewModel.screen === 'ChangePassword') {
    return ui.ChangePassword({
      state: viewModel.changePasswordState,
      actions: viewModel.changePasswordActions
    })
  }

  if (viewModel.screen === 'MerchantChatList') {
    return ui.MerchantChatList({
      threads: viewModel.showcaseWiring.merchantChatList.visibleThreads,
      searchQuery: viewModel.showcaseWiring.merchantChatList.searchQuery,
      refreshing: viewModel.showcaseWiring.merchantChatList.refreshing,
      pagination: viewModel.showcaseWiring.merchantChatList.pagination,
      actions: viewModel.merchantChatListActions
    })
  }

  if (viewModel.screen === 'ChatSearchResults') {
    return ui.ChatSearchResults({
      state: viewModel.chatState,
      actions: viewModel.chatActions
    })
  }

  if (viewModel.screen === 'ChatMedia') {
    return ui.ChatMedia({
      state: viewModel.chatState,
      actions: viewModel.chatMediaActions
    })
  }

  if (viewModel.screen === 'AdminAppointmentManager') {
    return ui.AdminAppointmentManager({
      state: viewModel.adminAppointmentsState,
      actions: viewModel.adminAppointmentsActions
    })
  }

  if (viewModel.screen === 'AdminAnnouncementEdit') {
    return ui.AdminAnnouncementEdit({
      state: viewModel.announcementEditState,
      actions: viewModel.announcementEditActions
    })
  }

  if (viewModel.screen === 'Chat') {
    return ui.ChatThread({
      state: viewModel.chatState,
      actions: viewModel.chatActions
    })
  }

  if (viewModel.screen === 'Appointments') {
    return ui.Appointments({
      state: viewModel.appointmentsState,
      actions: viewModel.appointmentsActions
    })
  }

  if (viewModel.screen === 'CustomerBookings') {
    return ui.CustomerBookings({
      state: viewModel.customerBookingsState,
      actions: viewModel.customerBookingsActions
    })
  }

  if (viewModel.screen === 'Announcements') {
    return ui.Announcements({
      state: viewModel.announcementsState,
      actions: viewModel.announcementsActions
    })
  }

  if (viewModel.screen === 'Favorites') {
    return ui.Favorites({
      state: viewModel.favoritesState,
      actions: viewModel.favoritesActions
    })
  }

  if (viewModel.screen === 'StoreProfileView') {
    return ui.StoreProfileView({
      state: viewModel.storeProfileState,
      actions: viewModel.storeProfileActions
    })
  }

  return renderHomeWithBottomBar(viewModel, ui)
}

export function ShowcaseHost(input: ShowcaseHostInput): ReactNode {
  const viewModel = useShowcaseViewModel({
    storeId: input.storeId || 'store_showcase_trial_000001',
    initialScreen: input.initialScreen || routeToShowcaseScreen(input.routeId)
  })

  return renderShowcaseHostScreen(viewModel, input.ui)
}