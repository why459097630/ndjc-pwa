'use client'

import React from 'react'
import { ActiveAssembly } from '@/core/assembly/types'
import { Navigator } from '@/core/routing/navigator'
import { useShowcaseViewModel, type ShowcaseScreenName } from '@/features/feature-showcase-web/useShowcaseViewModel'
import { GreenpinkShowcaseUiRenderer } from '@/ui-packs/ui-pack-showcase-greenpink-web'

export type ModuleUiRenderer = {
  Render: (input: { routeId: string; navigator: Navigator; assembly: ActiveAssembly }) => React.ReactNode
}

const rendererMap = new Map<string, ModuleUiRenderer>()
let registered = false

function key(moduleId: string, uiPackId: string) {
  return `${moduleId}::${uiPackId}`
}

export function registerModuleRenderer(moduleId: string, uiPackId: string, renderer: ModuleUiRenderer) {
  rendererMap.set(key(moduleId, uiPackId), renderer)
}

function resolve(assembly: ActiveAssembly): ModuleUiRenderer | undefined {
  return (
    rendererMap.get(key(assembly.moduleId, assembly.uiPackId)) ||
    rendererMap.get(key(assembly.moduleId, '__default__')) ||
    rendererMap.get(key('__default__', '__default__'))
  )
}

export function ensureCoreRenderersRegistered() {
  if (registered) return
  registered = true

  registerModuleRenderer('feature-showcase-web', 'ui-pack-showcase-greenpink-web', {
    Render: ({ routeId, assembly }) => (
      <ShowcaseGreenpinkRuntime
        routeId={routeId}
        storeId={assembly.storeId || 'store_showcase_trial_000001'}
      />
    )
  })

  registerModuleRenderer('__default__', '__default__', {
    Render: ({ routeId }) => <div>NDJC: Missing renderer for route={routeId}</div>
  })
}

export function ResolveCoreScreen({
  routeId,
  navigator,
  assembly
}: {
  routeId: string
  navigator: Navigator
  assembly: ActiveAssembly
}) {
  ensureCoreRenderersRegistered()

  if (routeId === 'about') return <LocalAboutScreen />

  const renderer = resolve(assembly)
  if (!renderer) {
    return (
      <div>
        NDJC: Missing renderer. module={assembly.moduleId}, uiPack={assembly.uiPackId}, route={routeId}
      </div>
    )
  }

  return <>{renderer.Render({ routeId, navigator, assembly })}</>
}

function ShowcaseGreenpinkRuntime({ routeId, storeId }: { routeId: string; storeId: string }) {
  const debugScreen = typeof window !== 'undefined'
    ? window.location.search.match(/[?&]screen=([^&]+)/)?.[1]
    : null

  const viewModel = useShowcaseViewModel({
    storeId,
    initialScreen: routeToShowcaseScreen(debugScreen || routeId)
  })

  if (viewModel.screen === 'Detail') {
    return (
      <GreenpinkShowcaseUiRenderer.BottomBarHost
        actions={viewModel.detailActions}
        activeTab={null}
        showAppointments={viewModel.detailState.bottomBar.showAppointments}
        showChatDot={viewModel.detailState.bottomBar.showChatDot}
        showBookingsDot={viewModel.detailState.bottomBar.showBookingsDot}
        showAnnouncementsDot={viewModel.detailState.bottomBar.showAnnouncementsDot}
      >
        <GreenpinkShowcaseUiRenderer.Detail
          state={viewModel.detailState}
          actions={viewModel.detailActions}
        />
      </GreenpinkShowcaseUiRenderer.BottomBarHost>
    )
  }

  if (viewModel.screen === 'Login') {
    return <GreenpinkShowcaseUiRenderer.Login state={viewModel.loginState} actions={viewModel.loginActions} />
  }

  if (viewModel.screen === 'Admin') {
    return <GreenpinkShowcaseUiRenderer.Admin state={viewModel.adminState} actions={viewModel.adminActions} />
  }

  if (viewModel.screen === 'AdminItems') {
    return <GreenpinkShowcaseUiRenderer.AdminItems state={viewModel.adminState} actions={viewModel.adminActions} />
  }

  if (viewModel.screen === 'AdminCategories') {
    return <GreenpinkShowcaseUiRenderer.AdminCategories state={viewModel.adminState} actions={viewModel.adminActions} />
  }

  if (viewModel.screen === 'Edit') {
    return <GreenpinkShowcaseUiRenderer.EditDish state={viewModel.editDishState} actions={viewModel.editDishActions} />
  }

  if (viewModel.screen === 'StoreProfile') {
    return <GreenpinkShowcaseUiRenderer.StoreProfileEdit state={viewModel.storeProfileState} actions={viewModel.storeProfileActions} />
  }

  if (viewModel.screen === 'ChangePassword') {
    return <GreenpinkShowcaseUiRenderer.ChangePassword state={viewModel.changePasswordState} actions={viewModel.changePasswordActions} />
  }

  if (viewModel.screen === 'MerchantChatList') {
    return (
    <GreenpinkShowcaseUiRenderer.MerchantChatList
      threads={viewModel.showcaseWiring.merchantChatList.visibleThreads}
      refreshing={viewModel.showcaseWiring.merchantChatList.refreshing}
      actions={viewModel.merchantChatListActions}
      />
    )
  }

  if (viewModel.screen === 'ChatSearchResults') {
    return <GreenpinkShowcaseUiRenderer.ChatSearchResults state={viewModel.chatState} actions={viewModel.chatActions} />
  }

  if (viewModel.screen === 'ChatMedia') {
    return <GreenpinkShowcaseUiRenderer.ChatMedia state={viewModel.chatState} actions={viewModel.chatMediaActions} />
  }

  if (viewModel.screen === 'AdminAppointmentManager') {
    return <GreenpinkShowcaseUiRenderer.AdminAppointmentManager state={viewModel.adminAppointmentsState} actions={viewModel.adminAppointmentsActions} />
  }

  if (viewModel.screen === 'AdminAnnouncementEdit') {
    return <GreenpinkShowcaseUiRenderer.AdminAnnouncementEdit state={viewModel.announcementEditState} actions={viewModel.announcementEditActions} />
  }

  if (viewModel.screen === 'Chat') {
    return <GreenpinkShowcaseUiRenderer.ChatThread state={viewModel.chatState} actions={viewModel.chatActions} />
  }

  if (viewModel.screen === 'Appointments') {
    return <GreenpinkShowcaseUiRenderer.Appointments state={viewModel.appointmentsState} actions={viewModel.appointmentsActions} />
  }

  if (viewModel.screen === 'CustomerBookings') {
    return <GreenpinkShowcaseUiRenderer.CustomerBookings state={viewModel.customerBookingsState} actions={viewModel.customerBookingsActions} />
  }

  if (viewModel.screen === 'Announcements') {
    return <GreenpinkShowcaseUiRenderer.Announcements state={viewModel.announcementsState} actions={viewModel.announcementsActions} />
  }

  if (viewModel.screen === 'Favorites') {
    return <GreenpinkShowcaseUiRenderer.Favorites state={viewModel.favoritesState} actions={viewModel.favoritesActions} />
  }

  if (viewModel.screen === 'StoreProfileView') {
    return <GreenpinkShowcaseUiRenderer.StoreProfileView state={viewModel.storeProfileState} actions={viewModel.storeProfileActions} />
  }

  return (
    <GreenpinkShowcaseUiRenderer.BottomBarHost
      actions={viewModel.homeActions}
      activeTab={null}
      showAppointments={viewModel.homeState.showAppointments}
      showChatDot={viewModel.homeState.showChatDot}
      showBookingsDot={viewModel.homeState.showBookingsDot}
      showAnnouncementsDot={viewModel.homeState.showAnnouncementsDot}
    >
      <GreenpinkShowcaseUiRenderer.Home
        state={viewModel.homeState}
        actions={viewModel.homeActions}
      />
    </GreenpinkShowcaseUiRenderer.BottomBarHost>
  )
}

function routeToShowcaseScreen(routeId: string): ShowcaseScreenName {
  if (routeId === 'admin') return 'Admin'
  if (routeId === 'items') return 'AdminItems'
  if (routeId === 'categories') return 'AdminCategories'
  if (routeId === 'edit') return 'Edit'
  if (routeId === 'storeProfileEdit') return 'StoreProfile'
  if (routeId === 'changePassword') return 'ChangePassword'
  if (routeId === 'merchantChatList') return 'MerchantChatList'
  if (routeId === 'adminAppointments') return 'AdminAppointmentManager'
  if (routeId === 'adminAnnouncements') return 'AdminAnnouncementEdit'

  if (routeId === 'chat') return 'Chat'
  if (routeId === 'detail') return 'Detail'
  if (routeId === 'login') return 'Login'
  if (routeId === 'saved') return 'Favorites'
  if (routeId === 'bookings') return 'CustomerBookings'
  if (routeId === 'updates') return 'Announcements'
  if (routeId === 'store') return 'Home'
  return 'Home'
}

function LocalAboutScreen() {
  return <div>NDJC PWA about (placeholder)</div>
}