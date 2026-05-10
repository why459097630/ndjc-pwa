'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type Navigator = {
  currentRouteId: string
  navigate: (routeId: string, params?: Record<string, unknown>) => void
  back: () => void
  replace: (routeId: string, params?: Record<string, unknown>) => void
  params: Record<string, unknown>
}

const NavigatorContext = createContext<Navigator | null>(null)

export function NavigatorProvider({ startRoute, children }: { startRoute: string; children: React.ReactNode }) {
  const [stack, setStack] = useState<Array<{ routeId: string; params: Record<string, unknown> }>>([
    { routeId: startRoute || 'home', params: {} }
  ])

  const current = stack[stack.length - 1] ?? { routeId: startRoute || 'home', params: {} }

  const navigate = useCallback((routeId: string, params: Record<string, unknown> = {}) => {
    setStack(prev => {
      const last = prev[prev.length - 1]
      if (last?.routeId === routeId) return prev
      return [...prev, { routeId, params }]
    })
  }, [])

  const replace = useCallback((routeId: string, params: Record<string, unknown> = {}) => {
    setStack(prev => [...prev.slice(0, Math.max(0, prev.length - 1)), { routeId, params }])
  }, [])

  const back = useCallback(() => {
    setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }, [])

  const value = useMemo<Navigator>(() => ({
    currentRouteId: current.routeId,
    params: current.params,
    navigate,
    replace,
    back
  }), [back, current.params, current.routeId, navigate, replace])

  return <NavigatorContext.Provider value={value}>{children}</NavigatorContext.Provider>
}

export function useNavigator(): Navigator {
  const value = useContext(NavigatorContext)
  if (!value) throw new Error('useNavigator must be used inside NavigatorProvider')
  return value
}
