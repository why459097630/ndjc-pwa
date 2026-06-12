'use client'

import React, { useEffect, useRef } from 'react'
import { ActiveAssembly } from '@/core/assembly/types'
import { type Navigator, useNavigatorSwipeBackHandler } from '@/core/routing/navigator'
import { useShowcaseViewModel, type ShowcaseScreenName } from '@/features/feature-showcase-web/useShowcaseViewModel'
import { GreenpinkShowcaseUiRenderer } from '@/ui-packs/ui-pack-showcase-greenpink-web'

export type ModuleUiRenderer = {
  Render: (input: { routeId: string; navigator: Navigator; assembly: ActiveAssembly }) => React.ReactNode
}

const rendererMap = new Map<string, ModuleUiRenderer>()
let registered = false

const NDJC_SHOWCASE_SCREEN_CHANGE_EVENT = 'ndjc:showcase-screen-change'
const NDJC_SHOWCASE_CURRENT_SCREEN_KEY = '__ndjc_showcase_current_screen__'
const NDJC_SHOWCASE_HISTORY_GUARD_STATE_KEY = '__ndjc_showcase_history_guard__'

function key(moduleId: string, uiPackId: string) {
  return `${moduleId}::${uiPackId}`
}

function isShowcaseRootScreen(screen: ShowcaseScreenName): boolean {
  return screen === 'Home'
}

function readCurrentHistoryState(): Record<string, unknown> {
  if (typeof window === 'undefined') return {}

  const state = window.history.state

  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    return {}
  }

  return state as Record<string, unknown>
}

function pushShowcaseHistoryGuard(): void {
  if (typeof window === 'undefined') return

  const currentState = readCurrentHistoryState()

  if (currentState[NDJC_SHOWCASE_HISTORY_GUARD_STATE_KEY] === true) {
    return
  }

  window.history.pushState(
    {
      ...currentState,
      [NDJC_SHOWCASE_HISTORY_GUARD_STATE_KEY]: true
    },
    '',
    window.location.href
  )
}

function useShowcaseSystemBackGuard(input: {
  screen: ShowcaseScreenName
  onBack: () => boolean
}): void {
  const screenRef = useRef(input.screen)
  const onBackRef = useRef(input.onBack)
  const forwardingExitRef = useRef(false)

  useEffect(() => {
    screenRef.current = input.screen
  }, [input.screen])

  useEffect(() => {
    onBackRef.current = input.onBack
  }, [input.onBack])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!isShowcaseRootScreen(input.screen)) {
      pushShowcaseHistoryGuard()
    }
  }, [input.screen])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handlePopState = () => {
      if (forwardingExitRef.current) {
        return
      }

      const currentScreen = screenRef.current

      if (isShowcaseRootScreen(currentScreen)) {
        forwardingExitRef.current = true

        window.setTimeout(() => {
          window.history.back()
        }, 0)

        return
      }

      const handledByBusinessBack = onBackRef.current() === true

      if (!handledByBusinessBack) {
        forwardingExitRef.current = true

        window.setTimeout(() => {
          window.history.back()
        }, 0)

        return
      }

      window.setTimeout(() => {
        forwardingExitRef.current = false

        if (!isShowcaseRootScreen(screenRef.current)) {
          pushShowcaseHistoryGuard()
        }
      }, 120)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])
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
        storeId={assembly.storeId}
        appName={assembly.appName}
        privacyUrl={assembly.privacyUrl}
        merchantEmail={assembly.merchantEmail}
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

function ShowcaseGreenpinkRuntime({
  routeId,
  storeId,
  appName,
  privacyUrl,
  merchantEmail
}: {
  routeId: string
  storeId?: string | null
  appName?: string | null
  privacyUrl?: string | null
  merchantEmail?: string | null
}) {
  const debugScreen = typeof window !== 'undefined'
    ? window.location.search.match(/[?&]screen=([^&]+)/)?.[1]
    : null

  const viewModel = useShowcaseViewModel({
    storeId,
    appName,
    privacyUrl,
    merchantEmail,
    initialScreen: routeToShowcaseScreen(debugScreen || routeId)
  })

  useNavigatorSwipeBackHandler(
    viewModel.screen === 'Home' ? null : viewModel.handleShowcaseBack
  )

  useShowcaseSystemBackGuard({
    screen: viewModel.screen,
    onBack: viewModel.handleShowcaseBack
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    window[NDJC_SHOWCASE_CURRENT_SCREEN_KEY as keyof Window] = viewModel.screen as never

    window.dispatchEvent(
      new CustomEvent(NDJC_SHOWCASE_SCREEN_CHANGE_EVENT, {
        detail: {
          screen: viewModel.screen
        }
      })
    )
  }, [viewModel.screen])

  const renderWithStoreUnavailableOverlay = (node: React.ReactNode) => (
    <GreenpinkShowcaseUiRenderer.StoreUnavailableOverlay state={viewModel.storeUnavailableState}>
      {node}
    </GreenpinkShowcaseUiRenderer.StoreUnavailableOverlay>
  )

  const renderWithOfflineBanner = (node: React.ReactNode) => renderWithStoreUnavailableOverlay(
    <>
      <GreenpinkShowcaseUiRenderer.OfflineStatusBanner
        message={viewModel.offlineStatus.bannerMessage}
      />
      {node}
    </>
  )

  if (viewModel.screen === 'Detail') {
    return renderWithOfflineBanner(
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
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.Login state={viewModel.loginState} actions={viewModel.loginActions} />
    )
  }

  if (viewModel.screen === 'Admin') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.Admin state={viewModel.adminState} actions={viewModel.adminActions} />
    )
  }

  if (viewModel.screen === 'AdminItems') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.AdminItems state={viewModel.adminState} actions={viewModel.adminActions} />
    )
  }

  if (viewModel.screen === 'AdminCategories') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.AdminCategories state={viewModel.adminState} actions={viewModel.adminActions} />
    )
  }

  if (viewModel.screen === 'Edit') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.EditDish state={viewModel.editDishState} actions={viewModel.editDishActions} />
    )
  }

  if (viewModel.screen === 'StoreProfile') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.StoreProfileEdit state={viewModel.storeProfileState} actions={viewModel.storeProfileActions} />
    )
  }

  if (viewModel.screen === 'ChangePassword') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.ChangePassword state={viewModel.changePasswordState} actions={viewModel.changePasswordActions} />
    )
  }

  if (viewModel.screen === 'MerchantChatList') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.MerchantChatList
        threads={viewModel.showcaseWiring.merchantChatList.visibleThreads}
        searchQuery={viewModel.showcaseWiring.merchantChatList.searchQuery}
        refreshing={viewModel.showcaseWiring.merchantChatList.refreshing}
        pagination={viewModel.showcaseWiring.merchantChatList.pagination}
        actions={viewModel.merchantChatListActions}
      />
    )
  }

  if (viewModel.screen === 'ChatSearchResults') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.ChatSearchResults state={viewModel.chatState} actions={viewModel.chatActions} />
    )
  }

  if (viewModel.screen === 'ChatMedia') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.ChatMedia state={viewModel.chatState} actions={viewModel.chatMediaActions} />
    )
  }

  if (viewModel.screen === 'AdminAppointmentManager') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.AdminAppointmentManager state={viewModel.adminAppointmentsState} actions={viewModel.adminAppointmentsActions} />
    )
  }

  if (viewModel.screen === 'AdminAnnouncementEdit') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.AdminAnnouncementEdit state={viewModel.announcementEditState} actions={viewModel.announcementEditActions} />
    )
  }

  if (viewModel.screen === 'Chat') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.ChatThread state={viewModel.chatState} actions={viewModel.chatActions} />
    )
  }

  if (viewModel.screen === 'Appointments') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.Appointments state={viewModel.appointmentsState} actions={viewModel.appointmentsActions} />
    )
  }

  if (viewModel.screen === 'CustomerBookings') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.CustomerBookings state={viewModel.customerBookingsState} actions={viewModel.customerBookingsActions} />
    )
  }

  if (viewModel.screen === 'Announcements') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.Announcements state={viewModel.announcementsState} actions={viewModel.announcementsActions} />
    )
  }

  if (viewModel.screen === 'Favorites') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.Favorites state={viewModel.favoritesState} actions={viewModel.favoritesActions} />
    )
  }

  if (viewModel.screen === 'StoreProfileView') {
    return renderWithOfflineBanner(
      <GreenpinkShowcaseUiRenderer.StoreProfileView state={viewModel.storeProfileState} actions={viewModel.storeProfileActions} />
    )
  }

  return renderWithOfflineBanner(
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
  return <div>Customer Hub</div>
}