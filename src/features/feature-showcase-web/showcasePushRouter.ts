import {
  installPushRouteListener,
  subscribePushRoute,
  type PushRoutePayload
} from '../../pwa/pushRouter'

export type ShowcasePushRoute = {
  pushType: string
  conversationId: string | null
  announcementId: string | null
  appointmentId: string | null
  openAs: string | null
}

export type ShowcasePushRouteHandler = (route: ShowcasePushRoute) => void

let pendingRoute: ShowcasePushRoute | null = null
const handlers = new Set<ShowcasePushRouteHandler>()

function normalizeNullableString(value: unknown): string | null {
  const text = String(value ?? '').trim()
  return text || null
}

function normalizeLowerNullableString(value: unknown): string | null {
  const text = normalizeNullableString(value)
  return text ? text.toLowerCase() : null
}

function readFirstString(payload: PushRoutePayload, keys: string[]): string | null {
  for (const key of keys) {
    const value = normalizeNullableString(payload[key])
    if (value) return value
  }

  return null
}

function pushTypeFromRoute(value: string | null): string | null {
  const route = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/[?#].*$/, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')

  if (!route) return null

  if (
    route === 'chat' ||
    route === 'message' ||
    route === 'messages' ||
    route.endsWith('/chat') ||
    route.endsWith('/message') ||
    route.endsWith('/messages')
  ) {
    return 'chat'
  }

  if (
    route === 'updates' ||
    route === 'announcement' ||
    route === 'announcements' ||
    route.endsWith('/updates') ||
    route.endsWith('/announcement') ||
    route.endsWith('/announcements')
  ) {
    return 'announcement'
  }

  if (
    route === 'bookings' ||
    route === 'booking' ||
    route === 'appointment' ||
    route === 'appointments' ||
    route.endsWith('/bookings') ||
    route.endsWith('/booking') ||
    route.endsWith('/appointment') ||
    route.endsWith('/appointments')
  ) {
    return 'appointment'
  }

  return route
}

export function parseShowcasePushPayload(payload: PushRoutePayload | null | undefined): ShowcasePushRoute | null {
  if (!payload) return null

  const explicitPushType = normalizeLowerNullableString(
    readFirstString(payload, ['push_type', 'pushType', 'type', 'ndjcPushType'])
  )
  const routePushType = pushTypeFromRoute(readFirstString(payload, ['route', 'url']))

  const pushType = explicitPushType || routePushType

  if (!pushType) return null

  return {
    pushType,
    conversationId: readFirstString(payload, ['conversation_id', 'conversationId']),
    announcementId: readFirstString(payload, ['announcement_id', 'announcementId']),
    appointmentId: readFirstString(payload, ['appointment_id', 'appointmentId']),
    openAs: normalizeLowerNullableString(
      readFirstString(payload, ['open_as', 'openAs', 'open'])
    )
  }
}

export function dispatchShowcasePushRoute(payload: PushRoutePayload | null | undefined): void {
  const route = parseShowcasePushPayload(payload)
  if (!route) return

  pendingRoute = route
  handlers.forEach(handler => handler(route))
}

function hasPushRouteParams(params: URLSearchParams): boolean {
  const pushParamKeys = [
    'push_type',
    'pushType',
    'type',
    'ndjcPushType',
    'conversation_id',
    'conversationId',
    'announcement_id',
    'announcementId',
    'appointment_id',
    'appointmentId',
    'open_as',
    'openAs',
    'open',
    'context_route',
    'contextRoute'
  ]

  return pushParamKeys.some(key => params.has(key))
}

function clearPushRouteParamsFromLocation(): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  const pushParamKeys = [
    'push_type',
    'pushType',
    'type',
    'ndjcPushType',
    'conversation_id',
    'conversationId',
    'announcement_id',
    'announcementId',
    'appointment_id',
    'appointmentId',
    'open_as',
    'openAs',
    'open',
    'context_route',
    'contextRoute',
    'route',
    'url'
  ]

  let changed = false

  pushParamKeys.forEach(key => {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key)
      changed = true
    }
  })

  if (!changed) return

  const nextUrl = `${url.pathname}${url.search}${url.hash}`
  window.history.replaceState(window.history.state, '', nextUrl)
}

export function dispatchShowcasePushRouteFromLocationSearch(searchInput?: string | null): void {
  if (typeof window === 'undefined' && searchInput == null) return

  const search = searchInput ?? window.location.search
  const params = new URLSearchParams(String(search || ''))

  if (!hasPushRouteParams(params)) return

  const payload: PushRoutePayload = {}

  params.forEach((value, key) => {
    payload[key] = value
  })

  if (!payload.route && typeof window !== 'undefined') {
    payload.route = window.location.pathname
  }

  dispatchShowcasePushRoute(payload)

  if (searchInput == null) {
    clearPushRouteParamsFromLocation()
  }
}

export function pendingShowcasePushRoute(): ShowcasePushRoute | null {
  return pendingRoute
}

export function consumeShowcasePushRoute(route: ShowcasePushRoute | null | undefined): void {
  if (!route) return
  if (pendingRoute === route) {
    pendingRoute = null
    return
  }

  if (
    pendingRoute &&
    pendingRoute.pushType === route.pushType &&
    pendingRoute.conversationId === route.conversationId &&
    pendingRoute.announcementId === route.announcementId &&
    pendingRoute.appointmentId === route.appointmentId &&
    pendingRoute.openAs === route.openAs
  ) {
    pendingRoute = null
  }
}

export function subscribeShowcasePushRoute(handler: ShowcasePushRouteHandler): () => void {
  handlers.add(handler)

  if (pendingRoute) {
    handler(pendingRoute)
  }

  return () => {
    handlers.delete(handler)
  }
}

let installed = false

export function installShowcasePushRouter(): () => void {
  if (installed) {
    return () => {}
  }

  installed = true
  const uninstallPushRouteListener = installPushRouteListener()

  const unsubscribe = subscribePushRoute(payload => {
    dispatchShowcasePushRoute(payload)
  })

  return () => {
    unsubscribe()
    uninstallPushRouteListener()
    installed = false
  }
}

export const ShowcasePushRouter = {
  install: installShowcasePushRouter,
  parsePayload: parseShowcasePushPayload,
  dispatchFromPayload: dispatchShowcasePushRoute,
  dispatchFromLocationSearch: dispatchShowcasePushRouteFromLocationSearch,
  subscribe: subscribeShowcasePushRoute,
  pendingRoute: pendingShowcasePushRoute,
  consume: consumeShowcasePushRoute
} as const