export type PushRoutePayload = {
  route?: string
  type?: string
  push_type?: string
  pushType?: string
  store_id?: string
  storeId?: string
  conversation_id?: string
  conversationId?: string
  announcement_id?: string
  announcementId?: string
  appointment_id?: string
  appointmentId?: string
  open_as?: string
  openAs?: string
  target_client_id?: string
  targetClientId?: string
  sender_client_id?: string
  senderClientId?: string
  target_audience?: string
  targetAudience?: string
  audience?: string
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
  if (event.data?.type !== 'NDJC_PUSH_ROUTE') {
    return
  }

  const payload = event.data.payload && typeof event.data.payload === 'object'
    ? event.data.payload
    : {}

  dispatchPushRoute({
    ...payload,
    route: String(event.data.route || payload.route || '').trim()
  })
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
