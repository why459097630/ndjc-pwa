export const Slots = {
  HEADER: 'header',
  HERO: 'hero',
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DETAIL: 'detail',
  SHEET: 'sheet',
  TAB_BAR: 'tabBar',
  FAB: 'fab',
  DIALOG: 'dialog',
  SETTINGS: 'settings'
} as const

export type SlotName = (typeof Slots)[keyof typeof Slots]

export type SlotMeta = {
  name: string
  layoutIntent: 'single' | 'grid' | 'full' | 'sidebar' | string
  scrollable: boolean
  priority: 'entry' | 'secondary' | 'aux' | string
  gestures?: string[]
}

export type RouteDecl = {
  routeId: string
  entry?: boolean
  params?: Record<string, string>
  deepLinks?: string[]
  returnPolicy?: 'back' | 'close' | 'replace' | string
}

export type ModuleDecl = {
  moduleId: string
  type: 'feature-ui' | 'flow' | 'service' | string
  supportedSlots: string[]
  routes: RouteDecl[]
}

export type AssemblySlots = Record<string, Record<string, string>>

export type Assembly = {
  template: string
  uiPack: string
  modules: string[]
  routingEntry?: string
  startRoute?: string
  locale?: string | null
  theme?: string | null
  density?: string | null
  slots?: AssemblySlots
  storeId?: string | null
  privacyUrl?: string | null
  merchantEmail?: string | null
}

export type ActiveAssembly = {
  moduleId: string
  uiPackId: string
  storeId?: string | null
}

export function getAssemblyEntryRoute(assembly: Assembly): string {
  return (assembly.routingEntry || assembly.startRoute || 'home').trim() || 'home'
}

export function normalizeAssembly(raw: unknown): Assembly {
  const data = raw as Partial<Assembly>
  const modules = Array.isArray(data.modules) ? data.modules.filter(Boolean) : []
  const uiPack = typeof data.uiPack === 'string' && data.uiPack.trim() ? data.uiPack : '__default__'
  const template = typeof data.template === 'string' && data.template.trim() ? data.template : 'pwa-core-skeleton'
  const routingEntry = typeof data.routingEntry === 'string' && data.routingEntry.trim()
    ? data.routingEntry
    : typeof data.startRoute === 'string' && data.startRoute.trim()
      ? data.startRoute
      : 'home'

  return {
    template,
    uiPack,
    modules,
    routingEntry,
    startRoute: typeof data.startRoute === 'string' ? data.startRoute : routingEntry,
    locale: data.locale ?? null,
    theme: data.theme ?? null,
    density: data.density ?? null,
    slots: data.slots ?? {},
    storeId: data.storeId ?? null,
    privacyUrl: data.privacyUrl ?? null,
    merchantEmail: data.merchantEmail ?? null
  }
}
