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
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (error) {
    data = { title: 'NDJC', body: event.data ? event.data.text() : '' }
  }

  const title = data.title || 'NDJC'
  const notificationPayload = {
    ...data,
    ...(data.data && typeof data.data === 'object' ? data.data : {})
  }

  delete notificationPayload.title
  delete notificationPayload.body
  delete notificationPayload.icon
  delete notificationPayload.badge
  delete notificationPayload.data

  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/icon-192.svg',
    badge: data.badge || '/icons/icon-192.svg',
    data: notificationPayload
  }

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