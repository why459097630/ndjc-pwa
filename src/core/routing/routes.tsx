'use client'

import React from 'react'
import { Assembly } from '@/core/assembly/types'
import { Navigator, useNavigator } from './navigator'

export type ResolveScreen = (routeId: string, navigator: Navigator) => React.ReactNode

export function CoreNavHost({
  startRoute,
  assembly,
  resolveScreen
}: {
  startRoute: string
  assembly: Assembly
  resolveScreen: ResolveScreen
}) {
  const navigator = useNavigator()
  const currentRoute = navigator.currentRouteId || startRoute || assembly.routingEntry || 'home'

  if (currentRoute === 'missing') {
    return (
      <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 24 }}>
        <p>No page registered for route.</p>
      </div>
    )
  }

  return <>{resolveScreen(currentRoute, navigator)}</>
}
