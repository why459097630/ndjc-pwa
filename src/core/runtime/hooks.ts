export type Hooks = {
  onAppStart?: () => void | Promise<void>
  onForeground?: () => void | Promise<void>
  onBackground?: () => void | Promise<void>
  onEnterRoute?: (routeId: string, params?: Record<string, unknown>) => void | Promise<void>
  onLeaveRoute?: (routeId: string) => void | Promise<void>
}

export const emptyHooks: Required<Hooks> = {
  onAppStart: () => {},
  onForeground: () => {},
  onBackground: () => {},
  onEnterRoute: () => {},
  onLeaveRoute: () => {}
}

export function normalizeHooks(hooks?: Hooks): Required<Hooks> {
  return {
    onAppStart: hooks?.onAppStart ?? emptyHooks.onAppStart,
    onForeground: hooks?.onForeground ?? emptyHooks.onForeground,
    onBackground: hooks?.onBackground ?? emptyHooks.onBackground,
    onEnterRoute: hooks?.onEnterRoute ?? emptyHooks.onEnterRoute,
    onLeaveRoute: hooks?.onLeaveRoute ?? emptyHooks.onLeaveRoute
  }
}
