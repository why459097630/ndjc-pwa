import React from 'react'

export type UiPack = {
  Theme: React.ComponentType<{ children: React.ReactNode }>
  TopAppBar: React.ComponentType<{ title: string }>
  TabBar: React.ComponentType<{
    routes: string[]
    selectedRoute: string
    onSelected: (routeId: string) => void
  }>
}

export const defaultUiPack: UiPack = {
  Theme: ({ children }) => <>{children}</>,
  TopAppBar: () => null,
  TabBar: () => null
}

let currentUiPack: UiPack = defaultUiPack

export const UiPackProvider = {
  get current(): UiPack {
    return currentUiPack
  },
  set current(value: UiPack) {
    currentUiPack = value || defaultUiPack
  }
}

export function UiPackTheme({ children }: { children: React.ReactNode }) {
  const Theme = UiPackProvider.current.Theme
  return <Theme>{children}</Theme>
}

export function UiPackTopAppBar({ title }: { title: string }) {
  const TopAppBar = UiPackProvider.current.TopAppBar
  return <TopAppBar title={title} />
}

export function UiPackTabBar({
  routes,
  selectedRoute,
  onSelected
}: {
  routes: string[]
  selectedRoute: string
  onSelected: (routeId: string) => void
}) {
  const TabBar = UiPackProvider.current.TabBar
  return <TabBar routes={routes} selectedRoute={selectedRoute} onSelected={onSelected} />
}
