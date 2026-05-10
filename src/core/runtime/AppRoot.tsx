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
            const { getNdjcFirebaseMessagingToken } = await import('@/pwa/firebaseMessaging')
            const token = await getNdjcFirebaseMessagingToken()
            console.log('[NDJC_PUSH_TEST] token:', token)
            window.alert(token ? 'FCM token success. Check console.' : 'No FCM token returned.')
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