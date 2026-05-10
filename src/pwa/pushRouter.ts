export type PushRoutePayload = {
  route?: string
  type?: string
  storeId?: string
  conversationId?: string
  announcementId?: string
  appointmentId?: string
  [key: string]: unknown
}

export type PushRouteHandler = (payload: PushRoutePayload) => void

const handlers = new Set<PushRouteHandler>()

export function subscribePushRoute(handler: PushRouteHandler): () => void {
  handlers.add(handler)
  return () => handlers.delete(handler)
}

export function dispatchPushRoute(payload: PushRoutePayload) {
  handlers.forEach(handler => handler(payload))
}

let pushRouteListenerInstalled = false

function handlePushRouteMessage(event: MessageEvent): void {
  if (event.data?.type === 'NDJC_PUSH_ROUTE') {
    dispatchPushRoute(event.data.payload || { route: event.data.route })
  }
}

export function installPushRouteListener(): () => void {
  if (typeof window === 'undefined') return () => {}
  if (!('serviceWorker' in navigator)) return () => {}

  if (pushRouteListenerInstalled) {
    return () => {}
  }

  pushRouteListenerInstalled = true
  navigator.serviceWorker.addEventListener('message', handlePushRouteMessage)

  return () => {
    if (!pushRouteListenerInstalled) return

    navigator.serviceWorker.removeEventListener('message', handlePushRouteMessage)
    pushRouteListenerInstalled = false
  }
}
