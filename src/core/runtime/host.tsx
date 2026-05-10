'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { Assembly, getAssemblyEntryRoute } from '@/core/assembly/types'
import { CoreNavHost, ResolveScreen } from '@/core/routing/routes'
import { NavigatorProvider, useNavigator } from '@/core/routing/navigator'
import { Hooks, normalizeHooks } from './hooks'
import { resolveEntryRouteFromModules } from './moduleRegistry'

export function NDJCAppHost({
  assembly,
  hooks,
  header,
  tabBar,
  resolveScreen
}: {
  assembly: Assembly
  hooks?: Hooks
  header?: React.ReactNode
  tabBar?: (input: { currentRouteId: string; navigate: (routeId: string) => void }) => React.ReactNode
  resolveScreen: ResolveScreen
}) {
  const normalizedHooks = useMemo(() => normalizeHooks(hooks), [hooks])
  const fallbackEntry = getAssemblyEntryRoute(assembly)
  const entryRoute = useMemo(
    () => resolveEntryRouteFromModules(assembly.modules, fallbackEntry),
    [assembly.modules, fallbackEntry]
  )

  useEffect(() => {
    void normalizedHooks.onAppStart()

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void normalizedHooks.onForeground()
      else void normalizedHooks.onBackground()
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [normalizedHooks])

  return (
    <NavigatorProvider startRoute={entryRoute}>
      <NDJCAppFrame
        assembly={assembly}
        hooks={normalizedHooks}
        header={header}
        tabBar={tabBar}
        entryRoute={entryRoute}
        resolveScreen={resolveScreen}
      />
    </NavigatorProvider>
  )
}

function NDJCAppFrame({
  assembly,
  hooks,
  header,
  tabBar,
  entryRoute,
  resolveScreen
}: {
  assembly: Assembly
  hooks: Required<Hooks>
  header?: React.ReactNode
  tabBar?: (input: { currentRouteId: string; navigate: (routeId: string) => void }) => React.ReactNode
  entryRoute: string
  resolveScreen: ResolveScreen
}) {
  const navigator = useNavigator()
  const previousRouteRef = useRef<string | null>(null)

  useEffect(() => {
    const previous = previousRouteRef.current
    const current = navigator.currentRouteId || entryRoute
    if (previous !== current) {
      if (previous) void hooks.onLeaveRoute(previous)
      void hooks.onEnterRoute(current, navigator.params)
      previousRouteRef.current = current
    }
  }, [entryRoute, hooks, navigator.currentRouteId, navigator.params])

  return (
    <div data-ndjc-template="pwa-core-skeleton" style={{ minHeight: '100dvh' }}>
      {header}
      <CoreNavHost startRoute={entryRoute} assembly={assembly} resolveScreen={resolveScreen} />
      {tabBar?.({ currentRouteId: navigator.currentRouteId, navigate: navigator.navigate })}
    </div>
  )
}
