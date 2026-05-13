'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Assembly } from '@/core/assembly/types'
import { NDJCAppHost } from './host'
import { ResolveCoreScreen } from './moduleScreenRegistry'
import { registerServiceWorker } from '@/pwa/registerServiceWorker'
import { createShowcaseCloudRepository } from '@/features/feature-showcase-web/showcaseCloudRepository'
import { createShowcaseCloudRepositoryConfig } from '@/features/feature-showcase-web/showcaseCloudConfig'

const LOCAL_FALLBACK_STORE_ID = 'store_showcase_trial_000001'
const NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY = 'ndjc_pwa_device_install_id'
const NDJC_SHOWCASE_CLIENT_ID_STORAGE_KEY = 'ndjc_showcase_client_id'
const NDJC_ANNOUNCEMENT_PUSH_REGISTRATION_THROTTLE_MS = 5 * 60 * 1000

function normalizeStoreId(value: unknown): string | null {
  const text = String(value ?? '').trim()
  return text && text.toLowerCase() !== 'null' ? text : null
}

function createPwaDeviceInstallId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `web_${crypto.randomUUID()}`
  }

  return `web_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
}

function getOrCreatePwaDeviceInstallId(): string {
  if (typeof window === 'undefined') {
    return createPwaDeviceInstallId()
  }

  const existing = window.localStorage.getItem(NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY)
  if (existing && existing.trim()) {
    return existing.trim()
  }

  const created = createPwaDeviceInstallId()
  window.localStorage.setItem(NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY, created)
  return created
}

function createShowcaseClientId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `client_${crypto.randomUUID()}`
  }

  return `client_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
}

function getOrCreateShowcaseClientId(): string {
  if (typeof window === 'undefined') {
    return createShowcaseClientId()
  }

  const existing = window.localStorage.getItem(NDJC_SHOWCASE_CLIENT_ID_STORAGE_KEY)
  if (existing && existing.trim()) {
    return existing.trim()
  }

  const created = createShowcaseClientId()
  window.localStorage.setItem(NDJC_SHOWCASE_CLIENT_ID_STORAGE_KEY, created)
  return created
}

function resolveRuntimeStoreId(assemblyStoreId: unknown): string {
  return (
    normalizeStoreId(assemblyStoreId) ||
    normalizeStoreId(process.env.NEXT_PUBLIC_APP_DEFAULT_STORE_ID) ||
    LOCAL_FALLBACK_STORE_ID
  )
}

function createAnnouncementPushRegistrationThrottleKey(
  storeId: string,
  clientId: string,
  deviceInstallId: string
): string {
  return [
    'ndjc',
    'push',
    'registration',
    'announcement_subscriber',
    storeId,
    clientId,
    deviceInstallId,
    '__announcement__'
  ].join(':')
}

export function AppRoot({ assembly }: { assembly: Assembly }) {
  const [debugTapCount, setDebugTapCount] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  const [notificationOptInVisible, setNotificationOptInVisible] = useState(false)
  const [notificationOptInPanelOpen, setNotificationOptInPanelOpen] = useState(false)
  const [notificationOptInBusy, setNotificationOptInBusy] = useState(false)
  const [notificationOptInMessage, setNotificationOptInMessage] = useState<string | null>(null)
  const [notificationRegisteredToken, setNotificationRegisteredToken] = useState<string | null>(null)
  const [notificationPermissionState, setNotificationPermissionState] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default')
  const [notificationRegistrationState, setNotificationRegistrationState] = useState<'idle' | 'registered' | 'failed'>('idle')

  useEffect(() => {
    setHydrated(true)

    if (typeof window === 'undefined') return

    const permission = 'Notification' in window ? Notification.permission : 'unsupported'

    setNotificationPermissionState(permission)
    setNotificationOptInVisible(true)

    if (permission === 'granted') {
      setNotificationOptInMessage('Notifications are allowed. Tap Refresh to register this device again.')
      return
    }

    if (permission === 'denied') {
      setNotificationOptInMessage('Notifications are blocked for this site. You can enable them from your browser site settings.')
      return
    }

    if (permission === 'unsupported') {
      setNotificationOptInMessage('Notifications are not supported in this browser.')
      return
    }

    setNotificationOptInMessage(null)
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

  return (
    <>
      <button
        type="button"
        onClick={() => setDebugTapCount(value => value + 1)}
        style={{
          position: 'fixed',
          left: 12,
          top: 12,
          zIndex: 999999,
          border: '2px solid red',
          borderRadius: 999,
          padding: '8px 12px',
          background: hydrated ? '#00c853' : '#ff1744',
          color: '#ffffff',
          fontSize: 13,
          fontWeight: 700,
          pointerEvents: 'auto'
        }}
      >
        {hydrated ? `HYDRATED ${debugTapCount}` : 'NOT HYDRATED'}
      </button>

      {notificationOptInVisible ? (
        <section
          aria-label="Enable notifications"
          style={{
            position: 'fixed',
            left: 16,
            right: 16,
            bottom: notificationOptInPanelOpen ? 88 : -1000,
            zIndex: 999999,
            border: '1px solid rgba(17, 24, 39, 0.10)',
            borderRadius: 22,
            padding: 16,
            background: '#ffffff',
            boxShadow: '0 18px 48px rgba(15, 23, 42, 0.22)',
            color: '#111827',
            pointerEvents: notificationOptInPanelOpen ? 'auto' : 'none',
            transition: 'bottom 180ms ease'
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: 10
            }}
          >
            <div
              style={{
                display: 'grid',
                gap: 4
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  lineHeight: 1.25,
                  fontWeight: 800,
                  color: '#111827'
                }}
              >
                {notificationRegistrationState === 'registered'
                  ? 'Notifications registered'
                  : notificationPermissionState === 'granted'
                    ? 'Refresh notifications'
                    : 'Turn on notifications'}
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.45,
                  fontWeight: 500,
                  color: 'rgba(17, 24, 39, 0.72)'
                }}
              >
                {notificationRegistrationState === 'registered'
                  ? 'This device is registered for store updates. Tap Refresh if notifications stop working.'
                  : notificationPermissionState === 'granted'
                    ? 'Notifications are allowed. Register this device so this store can send updates.'
                    : 'Get alerts when this store sends you a message, confirms a booking, or posts an update.'}
              </p>

              {notificationOptInMessage ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    lineHeight: 1.4,
                    fontWeight: 600,
                    color: notificationRegisteredToken ? '#16a34a' : '#ef4444'
                  }}
                >
                  {notificationOptInMessage}
                </p>
              ) : null}

              {notificationRegisteredToken ? (
                <div
                  style={{
                    marginTop: 4,
                    padding: 10,
                    borderRadius: 12,
                    border: '1px solid rgba(17, 24, 39, 0.12)',
                    background: '#f9fafb',
                    color: '#111827',
                    fontSize: 11,
                    lineHeight: 1.45,
                    fontWeight: 700,
                    wordBreak: 'break-all',
                    overflowWrap: 'anywhere'
                  }}
                >
                  token: {notificationRegisteredToken}
                </div>
              ) : null}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10
              }}
            >
              <button
                type="button"
                disabled
                style={{
                  minHeight: 44,
                  border: '1px solid rgba(17, 24, 39, 0.12)',
                  borderRadius: 999,
                  background: '#f3f4f6',
                  color: '#374151',
                  fontSize: 14,
                  fontWeight: 800,
                  opacity: 1
                }}
              >
                {notificationRegistrationState === 'registered'
                  ? 'Registered'
                  : notificationPermissionState === 'granted'
                    ? 'Allowed'
                    : notificationPermissionState === 'denied'
                      ? 'Blocked'
                      : 'Not registered'}
              </button>

              <button
                type="button"
                disabled={notificationOptInBusy}
                onClick={async () => {
                  if (typeof window === 'undefined') return

                  setNotificationOptInBusy(true)
                  setNotificationOptInMessage(null)
                  setNotificationRegisteredToken(null)

                  try {
                    if (!('Notification' in window)) {
                      setNotificationOptInMessage('Notifications are not supported in this browser.')
                      return
                    }

                    const permission = Notification.permission === 'granted'
                      ? 'granted'
                      : await Notification.requestPermission()

                    setNotificationPermissionState(permission)
                    setNotificationRegistrationState('idle')

                    console.log('[NDJC_PUSH_OPT_IN] browser permission result:', permission)

                    if (permission !== 'granted') {
                      setNotificationOptInMessage(
                        permission === 'denied'
                          ? 'Notifications are blocked. Enable them from your browser site settings.'
                          : 'Notifications were not enabled. You can try again later.'
                      )
                      return
                    }

                    const { runNdjcFirebaseMessagingDiagnostics } = await import('@/pwa/firebaseMessaging')
                    const diagnostics = await runNdjcFirebaseMessagingDiagnostics()

                    console.log('[NDJC_PUSH_OPT_IN] diagnostics:', diagnostics)
                    console.table({
                      href: diagnostics.href,
                      origin: diagnostics.origin,
                      isSecureContext: diagnostics.isSecureContext,
                      notificationPermissionBefore: diagnostics.notificationPermissionBefore,
                      notificationPermissionAfter: diagnostics.notificationPermissionAfter,
                      hasServiceWorkerApi: diagnostics.hasServiceWorkerApi,
                      serviceWorkerRegistrationCount: diagnostics.serviceWorkerRegistrationCount,
                      serviceWorkerScope: diagnostics.serviceWorkerScope,
                      serviceWorkerActive: diagnostics.serviceWorkerActive,
                      serviceWorkerScriptURL: diagnostics.serviceWorkerScriptURL,
                      messagingSupported: diagnostics.messagingSupported,
                      vapidKey: diagnostics.env.vapidKey,
                      vapidKeyLength: diagnostics.env.vapidKeyLength,
                      tokenLength: diagnostics.tokenLength,
                      tokenPrefix: diagnostics.tokenPrefix,
                      error: diagnostics.error
                    })

                    if (!diagnostics.token) {
                      setNotificationRegisteredToken(null)
                      setNotificationRegistrationState('failed')
                      setNotificationOptInMessage(
                        `Notifications were allowed, but push registration failed: ${diagnostics.error || 'empty token'}`
                      )
                      return
                    }

                    const deviceInstallId = getOrCreatePwaDeviceInstallId()
                    const showcaseClientId = getOrCreateShowcaseClientId()
                    const throttleKey = createAnnouncementPushRegistrationThrottleKey(
                      runtimeStoreId,
                      showcaseClientId,
                      deviceInstallId
                    )
                    const lastRegisteredAtText = window.localStorage.getItem(throttleKey)
                    const lastRegisteredAt = Number.parseInt(lastRegisteredAtText || '0', 10)
                    const now = Date.now()
                    const elapsedMs = lastRegisteredAt > 0 ? now - lastRegisteredAt : Number.POSITIVE_INFINITY

                    if (elapsedMs < NDJC_ANNOUNCEMENT_PUSH_REGISTRATION_THROTTLE_MS) {
                      console.log('[NDJC_PUSH_OPT_IN] skip recent announcement push registration:', {
                        storeId: runtimeStoreId,
                        audience: 'announcement_subscriber',
                        clientId: showcaseClientId,
                        deviceInstallId,
                        elapsedMs,
                        throttleMs: NDJC_ANNOUNCEMENT_PUSH_REGISTRATION_THROTTLE_MS
                      })

                      window.localStorage.setItem('ndjc_notification_opt_in_enabled', '1')
                      window.localStorage.removeItem('ndjc_notification_opt_in_dismissed')
                      setNotificationRegisteredToken(diagnostics.token)
                      setNotificationPermissionState('granted')
                      setNotificationRegistrationState('registered')
                      setNotificationOptInVisible(true)
                      setNotificationOptInPanelOpen(false)
                      setNotificationOptInMessage('This device is already registered for notifications.')
                      return
                    }

                    const repository = createShowcaseCloudRepository(
                      createShowcaseCloudRepositoryConfig(runtimeStoreId)
                    )

                    const registered = await repository.upsertPushDevice({
                      storeId: runtimeStoreId,
                      audience: 'announcement_subscriber',
                      token: diagnostics.token,
                      conversationId: '__announcement__',
                      clientId: showcaseClientId,
                      platform: 'web',
                      appVersion: 'pwa',
                      deviceInstallId
                    })

                    console.log('[NDJC_PUSH_OPT_IN] push device registration result:', {
                      registered,
                      storeId: runtimeStoreId,
                      audience: 'announcement_subscriber',
                      platform: 'web',
                      clientId: showcaseClientId,
                      deviceInstallId,
                      lastUpsertCode: repository.lastUpsertCode,
                      lastUpsertBody: repository.lastUpsertBody
                    })

                    if (!registered) {
                      setNotificationRegisteredToken(null)
                      setNotificationRegistrationState('failed')
                      setNotificationOptInMessage(
                        `Notifications were allowed, but device registration failed. code=${repository.lastUpsertCode ?? 'unknown'} body=${repository.lastUpsertBody || 'empty'}`
                      )
                      return
                    }

                    window.localStorage.setItem(throttleKey, String(Date.now()))
                    window.localStorage.setItem('ndjc_notification_opt_in_enabled', '1')
                    window.localStorage.removeItem('ndjc_notification_opt_in_dismissed')
                    setNotificationRegisteredToken(diagnostics.token)
                    setNotificationPermissionState('granted')
                    setNotificationRegistrationState('registered')
                    setNotificationOptInVisible(true)
                    setNotificationOptInPanelOpen(false)
                    setNotificationOptInMessage('This device is registered for notifications.')
                  } catch (error) {
                    console.error('[NDJC_PUSH_OPT_IN] failed:', error)
                    setNotificationRegisteredToken(null)
                    setNotificationRegistrationState('failed')
                    setNotificationOptInMessage(error instanceof Error ? error.message : String(error))
                  } finally {
                    setNotificationOptInBusy(false)
                  }
                }}
                style={{
                  minHeight: 44,
                  border: '0',
                  borderRadius: 999,
                  background: '#fb8b8b',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 900,
                  opacity: notificationOptInBusy ? 0.65 : 1
                }}
              >
                {notificationOptInBusy
                  ? 'Registering...'
                  : notificationPermissionState === 'granted'
                    ? 'Refresh'
                    : notificationRegistrationState === 'failed'
                      ? 'Retry'
                      : 'Enable'}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {notificationOptInVisible ? (
        <button
          type="button"
          aria-label={notificationOptInPanelOpen ? 'Close notification registration' : 'Open notification registration'}
          onClick={() => setNotificationOptInPanelOpen(value => !value)}
          style={{
            position: 'fixed',
            right: 16,
            bottom: 24,
            zIndex: 1000000,
            width: 44,
            height: 44,
            border: '1px solid rgba(17, 24, 39, 0.12)',
            borderRadius: 999,
            background: '#ffffff',
            color: '#111827',
            boxShadow: '0 10px 28px rgba(15, 23, 42, 0.20)',
            fontSize: 18,
            fontWeight: 900,
            lineHeight: '44px',
            textAlign: 'center',
            pointerEvents: 'auto'
          }}
        >
          {notificationOptInPanelOpen ? '×' : '🔔'}
        </button>
      ) : null}

      <NDJCAppHost
        assembly={{
          ...assembly,
          storeId: runtimeStoreId
        }}
        hooks={{
          onAppStart: () => {
            if (process.env.NODE_ENV === 'production') {
              void registerServiceWorker()
            }
          }
        }}
        resolveScreen={(routeId, navigator) => (
          <ResolveCoreScreen routeId={routeId} navigator={navigator} assembly={activeAssembly} />
        )}
      />
    </>
  )
}