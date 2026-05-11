const NDJC_DEV_KILL_SERVICE_WORKER = false

self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  if (NDJC_DEV_KILL_SERVICE_WORKER) {
    event.waitUntil(
      caches.keys()
        .then(keys => Promise.all(keys.map(key => caches.delete(key))))
        .then(() => self.clients.claim())
        .then(() => self.registration.unregister())
        .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
        .then(clients => {
          clients.forEach(client => {
            client.navigate(client.url)
          })
        })
    )
    return
  }

  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  if (NDJC_DEV_KILL_SERVICE_WORKER) {
    return
  }
})

self.addEventListener('push', event => {
  let rawData = {}
  let rawText = ''

  try {
    rawText = event.data ? event.data.text() : ''
    rawData = rawText ? JSON.parse(rawText) : {}
  } catch (error) {
    rawData = {
      title: 'NDJC',
      body: rawText || ''
    }
  }

  const notificationData =
    rawData && typeof rawData.notification === 'object' && rawData.notification !== null
      ? rawData.notification
      : {}

  const nestedData =
    rawData && typeof rawData.data === 'object' && rawData.data !== null
      ? rawData.data
      : {}

  const mergedData = {
    ...rawData,
    ...notificationData,
    ...nestedData
  }

  const title = String(
    mergedData.title ||
    notificationData.title ||
    nestedData.title ||
    'NDJC'
  )

  const body = String(
    mergedData.body ||
    notificationData.body ||
    nestedData.body ||
    'Open the app to view details.'
  )

  const icon = String(
    mergedData.icon ||
    notificationData.icon ||
    nestedData.icon ||
    '/icons/icon-192.svg'
  )

  const badge = String(
    mergedData.badge ||
    notificationData.badge ||
    nestedData.badge ||
    '/icons/icon-192.svg'
  )

  const notificationPayload = {
    ...mergedData,
    raw_push_payload: rawData
  }

  delete notificationPayload.notification
  delete notificationPayload.title
  delete notificationPayload.body
  delete notificationPayload.icon
  delete notificationPayload.badge

  const options = {
    body,
    icon,
    badge,
    data: notificationPayload,
    tag: String(mergedData.tag || mergedData.announcement_id || mergedData.conversation_id || 'ndjc-push'),
    renotify: true,
    requireInteraction: false
  }

  console.log('[NDJC_SW_PUSH_RECEIVED]', {
    title,
    body,
    payload: notificationPayload
  })

  event.waitUntil(self.registration.showNotification(title, options))
})

function appendPushPayloadToRoute(routeInput, payloadInput) {
  const payload = payloadInput && typeof payloadInput === 'object' ? payloadInput : {}
  const route = payload.route || routeInput || '/'

  let url
  try {
    url = new URL(route, self.location.origin)
  } catch (error) {
    url = new URL('/', self.location.origin)
  }

  const mappings = [
    ['push_type', payload.push_type || payload.pushType || payload.type],
    ['type', payload.type || payload.push_type || payload.pushType],
    ['conversation_id', payload.conversation_id || payload.conversationId],
    ['announcement_id', payload.announcement_id || payload.announcementId],
    ['appointment_id', payload.appointment_id || payload.appointmentId],
    ['open_as', payload.open_as || payload.openAs],
    ['route', payload.route || routeInput || '/']
  ]

  mappings.forEach(([key, value]) => {
    const text = String(value || '').trim()
    if (text) {
      url.searchParams.set(key, text)
    }
  })

  return `${url.pathname}${url.search}${url.hash}`
}

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const payload = event.notification.data || {}
  const route = payload.route ? payload.route : '/'
  const routeWithPayload = appendPushPayloadToRoute(route, payload)

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      const existing = clients.find(client => 'focus' in client)
      if (existing) {
        existing.postMessage({
          type: 'NDJC_PUSH_ROUTE',
          route: routeWithPayload,
          payload: {
            ...payload,
            route: routeWithPayload
          }
        })
        return existing.focus()
      }
      return self.clients.openWindow(routeWithPayload)
    })
  )
})
