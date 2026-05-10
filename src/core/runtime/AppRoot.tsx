'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Assembly } from '@/core/assembly/types'
import { NDJCAppHost } from './host'
import { ResolveCoreScreen } from './moduleScreenRegistry'
import { registerServiceWorker } from '@/pwa/registerServiceWorker'

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

export function AppRoot({ assembly }: { assembly: Assembly }) {
  const [debugTapCount, setDebugTapCount] = useState(0)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
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

      <button
        type="button"
        onClick={async () => {
          try {
            if (typeof window === 'undefined' || !('Notification' in globalThis)) {
              globalThis.alert?.('Notification API is not supported in this browser.')
              return
            }

            const directPermission = Notification.permission === 'granted'
              ? 'granted'
              : await Notification.requestPermission()

            console.log('[NDJC_PUSH_TEST] direct permission result:', directPermission)

            if (directPermission !== 'granted') {
              window.alert(`Notification permission was not granted directly: ${directPermission}`)
              return
            }

            const { runNdjcFirebaseMessagingDiagnostics } = await import('@/pwa/firebaseMessaging')
            const diagnostics = await runNdjcFirebaseMessagingDiagnostics()

            console.log('[NDJC_PUSH_TEST] diagnostics:', diagnostics)
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

            if (diagnostics.token) {
              window.alert(`FCM token success. tokenLength=${diagnostics.tokenLength}`)
              return
            }

            window.alert(`FCM token failed. error=${diagnostics.error || 'empty token'} permissionBefore=${diagnostics.notificationPermissionBefore} permissionAfter=${diagnostics.notificationPermissionAfter} swActive=${diagnostics.serviceWorkerActive} vapidKeyLength=${diagnostics.env.vapidKeyLength}`)
          } catch (error) {
            console.error('[NDJC_PUSH_TEST] failed:', error)
            window.alert(error instanceof Error ? error.message : String(error))
          }
        }}
        style={{
          position: 'fixed',
          right: 12,
          top: 64,
          zIndex: 999999,
          border: '2px solid #111827',
          borderRadius: 999,
          padding: '8px 12px',
          background: '#ffffff',
          color: '#111827',
          fontSize: 13,
          fontWeight: 700,
          pointerEvents: 'auto'
        }}
      >
        PUSH TEST
      </button>

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
