'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Assembly } from '@/core/assembly/types'
import { NDJCAppHost } from './host'
import type { Hooks } from './hooks'
import { ResolveCoreScreen } from './moduleScreenRegistry'
import {
  activateWaitingServiceWorker,
  checkServiceWorkerForUpdate,
  registerServiceWorker
} from '@/pwa/registerServiceWorker'
import { requestShowcasePersistentStorage } from '@/pwa/persistentStorage'
import {
  dispatchShowcaseAppLifecycleEvent,
  recordShowcaseOnlineState
} from '@/pwa/showcaseAppLifecycle'
import { CleanNeutralShowcaseUiRenderer } from '@/ui-packs/ui-pack-clean-neutral-web/CleanNeutralShowcaseUiRenderer'
import {
  inspectShowcaseNotificationPermission,
  registerShowcasePushDeviceForCurrentStore,
  type ShowcaseNotificationMessageCode,
  type ShowcaseNotificationPermissionState,
  type ShowcaseNotificationRegistrationState
} from '@/features/feature-showcase-web/showcasePushRegistrationService'
import type { ShowcasePwaInstallState } from '@/ui-packs/ui-pack-clean-neutral-web/ShowcaseUiRenderer'

type NdjcBeforeInstallPromptChoice = {
  outcome: 'accepted' | 'dismissed'
  platform: string
}

type NdjcBeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<NdjcBeforeInstallPromptChoice>
}

const NDJC_PWA_LAST_STANDALONE_SEEN_AT_KEY = 'ndjc:pwa-last-standalone-seen-at'
const NDJC_PWA_LAST_PROMPT_SEEN_AT_KEY = 'ndjc:pwa-last-prompt-seen-at'

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

function writeShowcasePwaStorageValue(key: string, value: string): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, value)
  } catch {
  }
}

function inspectShowcasePwaInstallState(hasInstallPrompt: boolean): ShowcasePwaInstallState {
  if (typeof window === 'undefined') return 'unknown'

  const now = Date.now()

  if (isShowcaseRunningStandalone()) {
    writeShowcasePwaStorageValue(NDJC_PWA_LAST_STANDALONE_SEEN_AT_KEY, String(now))
    return 'standalone'
  }

  if (hasInstallPrompt) {
    writeShowcasePwaStorageValue(NDJC_PWA_LAST_PROMPT_SEEN_AT_KEY, String(now))
    return 'installable'
  }

  if (isShowcaseIosDevice()) {
    return isShowcaseSafariBrowser() ? 'ios-manual' : 'safari-required'
  }

  return 'browser'
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
  const pwaUpdateCheckInFlightRef = useRef(false)
  const lastPwaUpdateCheckAtRef = useRef(0)
  const pwaUpdateReloadTimerRef = useRef<number | null>(null)
  const pwaUpdateReloadStartedRef = useRef(false)
  const [notificationOptInVisible, setNotificationOptInVisible] = useState(false)
  const [notificationOptInPanelOpen, setNotificationOptInPanelOpen] = useState(false)
  const [notificationOptInBusy, setNotificationOptInBusy] = useState(false)
  const [notificationOptInMessageCode, setNotificationOptInMessageCode] = useState<ShowcaseNotificationMessageCode>(null)
  const [notificationOptInDebugMessage, setNotificationOptInDebugMessage] = useState<string | null>(null)
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
    setNotificationOptInDebugMessage(null)
  }, [])

useEffect(() => {
  if (typeof window === 'undefined') return

  let latestInstallPromptEvent: NdjcBeforeInstallPromptEvent | null = null

  const refreshPwaInstallState = () => {
    setPwaInstallState(inspectShowcasePwaInstallState(Boolean(latestInstallPromptEvent)))
  }

  setPwaInstallState(inspectShowcasePwaInstallState(false))

  const handleBeforeInstallPrompt = (event: Event) => {
    event.preventDefault()
    const installPromptEvent = event as NdjcBeforeInstallPromptEvent

    latestInstallPromptEvent = installPromptEvent
    setPwaInstallPromptEvent(installPromptEvent)
    setPwaInstallState(inspectShowcasePwaInstallState(true))
  }

  const handleAppInstalled = () => {
    latestInstallPromptEvent = null
    setPwaInstallPromptEvent(null)
    setPwaInstallBusy(false)
    setPwaInstallState(inspectShowcasePwaInstallState(false))
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      refreshPwaInstallState()
    }
  }

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
  window.addEventListener('focus', refreshPwaInstallState)
  document.addEventListener('visibilitychange', handleVisibilityChange)

  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleAppInstalled)
    window.removeEventListener('focus', refreshPwaInstallState)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    const reloadForPwaUpdate = () => {
      if (pwaUpdateReloadStartedRef.current) return

      pwaUpdateReloadStartedRef.current = true
      window.location.reload()
    }

    const handleControllerChange = () => {
      if (pwaUpdateReloadTimerRef.current !== null) {
        window.clearTimeout(pwaUpdateReloadTimerRef.current)
        pwaUpdateReloadTimerRef.current = null
      }

      reloadForPwaUpdate()
    }

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)

    return () => {
      if (pwaUpdateReloadTimerRef.current !== null) {
        window.clearTimeout(pwaUpdateReloadTimerRef.current)
        pwaUpdateReloadTimerRef.current = null
      }

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
    storeId: runtimeStoreId,
    appName: assembly.appName ?? null,
    privacyUrl: assembly.privacyUrl ?? null,
    merchantEmail: assembly.merchantEmail ?? null
  }), [
    assembly.modules,
    assembly.uiPack,
    assembly.appName,
    assembly.privacyUrl,
    assembly.merchantEmail,
    runtimeStoreId
  ])

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
      setNotificationOptInDebugMessage(null)
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
      setNotificationOptInDebugMessage(result.debugMessage || null)

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
      setPwaInstallState(inspectShowcasePwaInstallState(false))
    } else {
      setPwaInstallState(inspectShowcasePwaInstallState(false))
    }
  } finally {
    setPwaInstallBusy(false)
  }
}

  function activatePwaUpdate(registration: ServiceWorkerRegistration): void {
    setPwaUpdateRegistration(registration)
    setPwaUpdateRefreshing(true)
    setPwaUpdateDismissed(true)

    const didRequestActivation = activateWaitingServiceWorker(registration)

    if (typeof window === 'undefined') return

    if (pwaUpdateReloadTimerRef.current !== null) {
      window.clearTimeout(pwaUpdateReloadTimerRef.current)
      pwaUpdateReloadTimerRef.current = null
    }

    if (!didRequestActivation) {
      if (!pwaUpdateReloadStartedRef.current) {
        pwaUpdateReloadStartedRef.current = true
        window.location.reload()
      }

      return
    }

    pwaUpdateReloadTimerRef.current = window.setTimeout(() => {
      if (pwaUpdateReloadStartedRef.current) return

      pwaUpdateReloadStartedRef.current = true
      window.location.reload()
    }, 1200)
  }

  function handlePwaUpdateAvailable(registration: ServiceWorkerRegistration): void {
    setPwaUpdateRegistration(registration)
    setPwaUpdateRefreshing(false)
    setPwaUpdateDismissed(false)
  }

  function checkForPwaUpdateNow(force = false): void {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    if (pwaUpdateCheckInFlightRef.current) return

    const now = Date.now()
    const minIntervalMs = 60 * 1000

    if (!force && now - lastPwaUpdateCheckAtRef.current < minIntervalMs) {
      return
    }

    pwaUpdateCheckInFlightRef.current = true
    lastPwaUpdateCheckAtRef.current = now

    void checkServiceWorkerForUpdate({
      onUpdateAvailable: handlePwaUpdateAvailable
    }).finally(() => {
      pwaUpdateCheckInFlightRef.current = false
    })
  }


  useEffect(() => {
    if (typeof window === 'undefined') return

    const recordCurrentOnlineState = () => {
      recordShowcaseOnlineState(typeof navigator === 'undefined' ? true : navigator.onLine)
    }

    const handleOnline = () => {
      recordShowcaseOnlineState(true)
    }

    const handleOffline = () => {
      recordShowcaseOnlineState(false)
    }

    recordCurrentOnlineState()

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const runtimeHooks = useMemo<Hooks>(() => ({
    onAppStart: () => {
      recordShowcaseOnlineState(typeof navigator === 'undefined' ? true : navigator.onLine)
      dispatchShowcaseAppLifecycleEvent('app-start')

      void registerServiceWorker({
        onUpdateAvailable: handlePwaUpdateAvailable
      }).finally(() => {
        checkForPwaUpdateNow(true)
      })

      void requestShowcasePersistentStorage()
    },
    onForeground: () => {
      recordShowcaseOnlineState(typeof navigator === 'undefined' ? true : navigator.onLine)
      dispatchShowcaseAppLifecycleEvent('foreground')

      setPwaInstallState(inspectShowcasePwaInstallState(Boolean(pwaInstallPromptEvent)))
      checkForPwaUpdateNow(false)
      void requestShowcasePersistentStorage()
    },
    onBackground: () => {
      recordShowcaseOnlineState(typeof navigator === 'undefined' ? true : navigator.onLine)
      dispatchShowcaseAppLifecycleEvent('background')
    }
  }), [pwaInstallPromptEvent])

  return (
    <>
      {pwaUpdateRegistration && !pwaUpdateDismissed
        ? CleanNeutralShowcaseUiRenderer.PwaUpdateBanner({
            refreshing: pwaUpdateRefreshing,
            onRefresh: () => {
              activatePwaUpdate(pwaUpdateRegistration)
            },
            onDismiss: () => {
              setPwaUpdateDismissed(true)
            }
          })
        : null}

{notificationOptInVisible && notificationOptInAllowedOnCurrentScreen
  ? CleanNeutralShowcaseUiRenderer.NotificationOptInPanel({
      open: notificationOptInPanelOpen,
      busy: notificationOptInBusy,
      registered: notificationRegistered,
      permissionState: notificationPermissionState,
      registrationState: notificationRegistrationState,
      messageCode: notificationOptInMessageCode,
      debugMessage: notificationOptInDebugMessage,
      installState: pwaInstallState,
      installBusy: pwaInstallBusy,
      onRegister: () => {
        void registerPushDeviceForCurrentStore('manual')
      },
      onInstall: () => {
        void promptInstallCurrentPwa()
      },
      onClose: () => {
        setNotificationOptInPanelOpen(false)
      }
    })
  : null}

      {notificationOptInVisible && notificationOptInAllowedOnCurrentScreen
        ? CleanNeutralShowcaseUiRenderer.NotificationOptInFloatingButton({
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
        hooks={runtimeHooks}
        resolveScreen={(routeId, navigator) => (
          <ResolveCoreScreen routeId={routeId} navigator={navigator} assembly={activeAssembly} />
        )}
      />
    </>
  )
}