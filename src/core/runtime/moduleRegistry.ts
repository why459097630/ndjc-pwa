export type ModuleDescriptor = {
  id: string
  entryRouteId?: string | null
  tabRoutes?: string[]
}

export const MODULE_REGISTRY: ModuleDescriptor[] = [
  {
    id: 'feature-restaurant-menu',
    entryRouteId: 'home',
    tabRoutes: ['home']
  },
  {
    id: 'feature-home-basic',
    entryRouteId: 'home',
    tabRoutes: ['home']
  },
  {
    id: 'feature-showcase-web',
    entryRouteId: 'home',
    tabRoutes: ['home']
  }
]

export function resolveEntryRouteFromModules(modules: string[], fallback: string): string {
  const fromModule = modules
    .map(id => MODULE_REGISTRY.find(item => item.id === id)?.entryRouteId)
    .find(Boolean)

  return fromModule || fallback || 'home'
}

export function resolveTabRoutesFromModules(modules: string[], fallback: string[]): string[] {
  const tabRoutes = modules
    .flatMap(id => MODULE_REGISTRY.find(item => item.id === id)?.tabRoutes ?? [])
    .filter((route, index, all) => all.indexOf(route) === index)

  return tabRoutes.length > 0 ? tabRoutes : fallback
}