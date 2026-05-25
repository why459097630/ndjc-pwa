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
import type { ShowcasePwaInstallState } from '@/ui-packs/ui-pack-showcase-greenpink-web/ShowcaseUiRenderer'

type NdjcBeforeInstallPromptChoice = {
  outcome: 'accepted' | 'dismissed'
  platform: string
}

type NdjcBeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<NdjcBeforeInstallPromptChoice>
}

function canUseDevelopmentDefaultStoreId(): boolean {
  return process.env.NODE_ENV !== 'production'
}

function isShowcaseRunningStandalone(): boolean {
  if (typeof window === 'undefined') return false

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean
  }

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    navigatorWithStandalone.standalone === true
  )
}

function isShowcaseIosDevice(): boolean {
  if (typeof window === 'undefined') return false

  const userAgent = window.navigator.userAgent || ''
  const platform = window.navigator.platform || ''
  const maxTouchPoints = window.navigator.maxTouchPoints || 0

  return (
    /iPad|iPhone|iPod/i.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1)
  )
}

function isShowcaseSafariBrowser(): boolean {
  if (typeof window === 'undefined') return false

  const userAgent = window.navigator.userAgent || ''

  return (
    /Safari/i.test(userAgent) &&
    !/Chrome|Chromium|CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(userAgent)
  )
}

function inspectShowcasePwaInstallState(hasInstallPrompt: boolean): ShowcasePwaInstallState {
  if (typeof window === 'undefined') return 'unknown'

  if (isShowcaseRunningStandalone()) {
    return 'installed'
  }

  if (hasInstallPrompt) {
    return 'available'
  }

  if (isShowcaseIosDevice()) {
    return isShowcaseSafariBrowser() ? 'manual-ios' : 'manual-safari-required'
  }

  return 'unsupported'
}

function normalizeStoreId(value: unknown): string | null {
  const text = String(value ?? '').trim()
  return text && text.toLowerCase() !== 'null' ? text : null
}

function resolveRuntimeStoreId(assemblyStoreId: unknown): string {
  const explicitStoreId = normalizeStoreId(assemblyStoreId)

  if (explicitStoreId) {
    return explicitStoreId
  }

  if (canUseDevelopmentDefaultStoreId()) {
    const developmentStoreId = normalizeStoreId(process.env.NEXT_PUBLIC_APP_DEFAULT_STORE_ID)

    if (developmentStoreId) {
      return developmentStoreId
    }
  }

  throw new Error('storeId is required for PWA runtime.')
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
  const [pwaInstallPromptEvent, setPwaInstallPromptEvent] = useState<NdjcBeforeInstallPromptEvent | null>(null)
  const [pwaInstallState, setPwaInstallState] = useState<ShowcasePwaInstallState>('unknown')
  const [pwaInstallBusy, setPwaInstallBusy] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const inspected = inspectShowcaseNotificationPermission()

    setNotificationPermissionState(inspected.permissionState)
    setNotificationOptInVisible(true)
    setNotificationOptInMessageCode(inspected.messageCode)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    setPwaInstallState(inspectShowcasePwaInstallState(false))

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      const installPromptEvent = event as NdjcBeforeInstallPromptEvent

      setPwaInstallPromptEvent(installPromptEvent)
      setPwaInstallState(inspectShowcasePwaInstallState(true))
    }

    const handleAppInstalled = () => {
      setPwaInstallPromptEvent(null)
      setPwaInstallBusy(false)
      setPwaInstallState('installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
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

  async function promptInstallCurrentPwa(): Promise<void> {
    if (!pwaInstallPromptEvent) {
      setPwaInstallState(inspectShowcasePwaInstallState(false))
      return
    }

    setPwaInstallBusy(true)

    try {
      await pwaInstallPromptEvent.prompt()
      const choice = await pwaInstallPromptEvent.userChoice

      setPwaInstallPromptEvent(null)

      if (choice.outcome === 'accepted') {
        setPwaInstallState('installed')
      } else {
        setPwaInstallState(inspectShowcasePwaInstallState(false))
      }
    } finally {
      setPwaInstallBusy(false)
    }
  }

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
            installState: pwaInstallState,
            installBusy: pwaInstallBusy,
            onRegister: () => {
              void registerPushDeviceForCurrentStore('manual')
            },
            onInstall: () => {
              void promptInstallCurrentPwa()
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