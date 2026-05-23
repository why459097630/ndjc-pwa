'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Assembly } from '@/core/assembly/types'
import { NDJCAppHost } from './host'
import { ResolveCoreScreen } from './moduleScreenRegistry'
import { activateWaitingServiceWorker, registerServiceWorker } from '@/pwa/registerServiceWorker'
import { GreenpinkShowcaseUiRenderer } from '@/ui-packs/ui-pack-showcase-greenpink-web/GreenpinkShowcaseUiRenderer'
import {
  inspectShowcaseNotificationPermission,
  registerShowcasePushDeviceForCurrentStore,
  type ShowcaseNotificationMessageCode,
  type ShowcaseNotificationPermissionState,
  type ShowcaseNotificationRegistrationState
} from '@/features/feature-showcase-web/showcasePushRegistrationService'

const LOCAL_FALLBACK_STORE_ID = 'store_showcase_trial_000001'

function normalizeStoreId(value: unknown): string | null {
  const text = String(value ?? '').trim()
  return text && text.toLowerCase() !== 'null' ? text : null
}

function resolveRuntimeStoreId(assemblyStoreId: unknown): string {
  return (
    normalizeStoreId(assemblyStoreId) ||
    normalizeStoreId(process.env.NEXT_PUBLIC_APP_DEFAULT_STORE_ID) ||
    LOCAL_FALLBACK_STORE_ID
  )
}

const NDJC_SHOWCASE_SCREEN_CHANGE_EVENT = 'ndjc:showcase-screen-change'
const NDJC_SHOWCASE_CURRENT_SCREEN_KEY = '__ndjc_showcase_current_screen__'

const NOTIFICATION_OPT_IN_VISIBLE_SHOWCASE_SCREENS = new Set<string>([
  'Home',
  'Announcements',
  'Favorites',
  'StoreProfileView',
  'CustomerBookings',
  'Detail',
  'Admin'
])

function canShowNotificationOptInOnScreen(screenName: string): boolean {
  return NOTIFICATION_OPT_IN_VISIBLE_SHOWCASE_SCREENS.has(screenName)
}

export function AppRoot({ assembly }: { assembly: Assembly }) {
  const [pwaUpdateRegistration, setPwaUpdateRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [pwaUpdateRefreshing, setPwaUpdateRefreshing] = useState(false)
  const [pwaUpdateDismissed, setPwaUpdateDismissed] = useState(false)
  const [notificationOptInVisible, setNotificationOptInVisible] = useState(false)
  const [notificationOptInPanelOpen, setNotificationOptInPanelOpen] = useState(false)
  const [notificationOptInBusy, setNotificationOptInBusy] = useState(false)
  const [notificationOptInMessageCode, setNotificationOptInMessageCode] = useState<ShowcaseNotificationMessageCode>(null)
  const [notificationRegistered, setNotificationRegistered] = useState(false)
  const [notificationPermissionState, setNotificationPermissionState] = useState<ShowcaseNotificationPermissionState>('default')
  const [notificationRegistrationState, setNotificationRegistrationState] = useState<ShowcaseNotificationRegistrationState>('idle')
  const [notificationDisplayScreen, setNotificationDisplayScreen] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const inspected = inspectShowcaseNotificationPermission()

    setNotificationPermissionState(inspected.permissionState)
    setNotificationOptInVisible(true)
    setNotificationOptInMessageCode(inspected.messageCode)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    let hasReloadedForControllerChange = false

    const handleControllerChange = () => {
      if (hasReloadedForControllerChange) return

      hasReloadedForControllerChange = true
      window.location.reload()
    }

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  const runtimeStoreId = useMemo(
    () => resolveRuntimeStoreId(assembly.storeId),
    [assembly.storeId]
  )

  const activeAssembly = useMemo(() => ({
    moduleId: assembly.modules[0] || '__default__',
    uiPackId: assembly.uiPack || '__default__',
    storeId: runtimeStoreId
  }), [assembly.modules, assembly.uiPack, runtimeStoreId])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleShowcaseScreenChange = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : null
      const screenName = String(detail?.screen || '').trim()

      if (screenName) {
        setNotificationDisplayScreen(screenName)
      }
    }

    window.addEventListener(NDJC_SHOWCASE_SCREEN_CHANGE_EVENT, handleShowcaseScreenChange)

    const currentScreen = String(
      window[NDJC_SHOWCASE_CURRENT_SCREEN_KEY as keyof Window] || ''
    ).trim()

    if (currentScreen) {
      setNotificationDisplayScreen(currentScreen)
    }

    return () => {
      window.removeEventListener(NDJC_SHOWCASE_SCREEN_CHANGE_EVENT, handleShowcaseScreenChange)
    }
  }, [])

  const notificationOptInAllowedOnCurrentScreen = canShowNotificationOptInOnScreen(notificationDisplayScreen)

  useEffect(() => {
    if (!notificationOptInAllowedOnCurrentScreen) {
      setNotificationOptInPanelOpen(false)
    }
  }, [notificationOptInAllowedOnCurrentScreen])

  async function registerPushDeviceForCurrentStore(source: 'manual' | 'startup'): Promise<boolean> {
    if (source === 'manual') {
      setNotificationOptInMessageCode(null)
    }

    setNotificationOptInBusy(true)

    try {
      const result = await registerShowcasePushDeviceForCurrentStore({
        runtimeStoreId,
        source
      })

      setNotificationPermissionState(result.permissionState)
      setNotificationRegistrationState(result.registrationState)
      setNotificationRegistered(result.registered)
      setNotificationOptInMessageCode(result.messageCode)

      if (result.success) {
        setNotificationOptInVisible(true)

        if (source === 'manual') {
          setNotificationOptInPanelOpen(false)
        }
      }

      return result.success
    } finally {
      setNotificationOptInBusy(false)
    }
  }

  useEffect(() => {
    void registerPushDeviceForCurrentStore('startup')
  }, [runtimeStoreId])

  return (
    <>
      {pwaUpdateRegistration && !pwaUpdateDismissed
        ? GreenpinkShowcaseUiRenderer.PwaUpdateBanner({
            refreshing: pwaUpdateRefreshing,
            onRefresh: () => {
              setPwaUpdateRefreshing(true)
              activateWaitingServiceWorker(pwaUpdateRegistration)
            },
            onDismiss: () => {
              setPwaUpdateDismissed(true)
            }
          })
        : null}

      {notificationOptInVisible && notificationOptInAllowedOnCurrentScreen
        ? GreenpinkShowcaseUiRenderer.NotificationOptInPanel({
            open: notificationOptInPanelOpen,
            busy: notificationOptInBusy,
            registered: notificationRegistered,
            permissionState: notificationPermissionState,
            registrationState: notificationRegistrationState,
            messageCode: notificationOptInMessageCode,
            onRegister: () => {
              void registerPushDeviceForCurrentStore('manual')
            }
          })
        : null}

      {notificationOptInVisible && notificationOptInAllowedOnCurrentScreen
        ? GreenpinkShowcaseUiRenderer.NotificationOptInFloatingButton({
            open: notificationOptInPanelOpen,
            permissionState: notificationPermissionState,
            registrationState: notificationRegistrationState,
            onToggle: () => setNotificationOptInPanelOpen(value => !value)
          })
        : null}

      <NDJCAppHost
        assembly={{
          ...assembly,
          storeId: runtimeStoreId
        }}
        hooks={{
          onAppStart: () => {
            void registerServiceWorker({
              onUpdateAvailable: registration => {
                setPwaUpdateRegistration(registration)
                setPwaUpdateRefreshing(false)
                setPwaUpdateDismissed(false)
              }
            })
          }
        }}
        resolveScreen={(routeId, navigator) => (
          <ResolveCoreScreen routeId={routeId} navigator={navigator} assembly={activeAssembly} />
        )}
      />
    </>
  )
}