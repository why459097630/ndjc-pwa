const NDJC_DEV_KILL_SERVICE_WORKER = false
const NDJC_SW_VERSION = 'ndjc-pwa-v5'
const NDJC_STATIC_CACHE = `${NDJC_SW_VERSION}-static`
const NDJC_NAVIGATION_CACHE = `${NDJC_SW_VERSION}-navigation`
const NDJC_CACHE_PREFIX = 'ndjc-pwa-'
const NDJC_OFFLINE_URL = '/offline.html'

const NDJC_APP_SHELL_URLS = [
  NDJC_OFFLINE_URL,
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png',
  '/icons/apple-touch-icon.png'
]

function ndjcIsSameOriginUrl(url) {
  return url.origin === self.location.origin
}

function ndjcIsApiLikeRequest(url) {
  const pathname = url.pathname || ''

  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/rest/') ||
    pathname.startsWith('/storage/') ||
    pathname.includes('/auth/v1/') ||
    pathname.includes('/rest/v1/') ||
    pathname.includes('/storage/v1/') ||
    url.hostname.endsWith('.supabase.co')
  )
}

function ndjcIsHtmlNavigationRequest(request) {
  return request.mode === 'navigate'
}

function ndjcIsStoreManifestRequest(url) {
  const pathname = url.pathname || ''

  return pathname.startsWith('/pwa/') && pathname.endsWith('/manifest.webmanifest')
}

function ndjcIsStaticAssetRequest(url) {
  const pathname = url.pathname || ''

  return (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/icons/') ||
    ndjcIsStoreManifestRequest(url) ||
    pathname === NDJC_OFFLINE_URL ||
    pathname === '/favicon.ico'
  )
}

function ndjcIsCacheableStaticResponse(response) {
  if (!response || response.status !== 200) {
    return false
  }

  const responseType = response.type || ''

  return responseType === 'basic' || responseType === 'cors'
}

function ndjcIsCacheableNavigationResponse(response) {
  if (!response || response.status !== 200) {
    return false
  }

  const responseType = response.type || ''
  const contentType = response.headers ? response.headers.get('content-type') || '' : ''

  return (
    (responseType === 'basic' || responseType === 'cors') &&
    contentType.toLowerCase().includes('text/html')
  )
}

async function ndjcStaleWhileRevalidate(request) {
  const cache = await caches.open(NDJC_STATIC_CACHE)
  const cachedResponse = await cache.match(request)

  const networkPromise = fetch(request)
    .then(response => {
      if (ndjcIsCacheableStaticResponse(response)) {
        cache.put(request, response.clone())
      }

      return response
    })
    .catch(error => {
      if (cachedResponse) {
        return cachedResponse
      }

      throw error
    })

  return cachedResponse || networkPromise
}

async function ndjcNetworkFirstStoreManifest(request) {
  const cache = await caches.open(NDJC_STATIC_CACHE)

  try {
    const networkResponse = await fetch(request)

    if (ndjcIsCacheableStaticResponse(networkResponse)) {
      await cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    throw error
  }
}

async function ndjcNetworkFirstNavigation(request) {
  const navigationCache = await caches.open(NDJC_NAVIGATION_CACHE)

  try {
    const networkResponse = await fetch(request)

    if (ndjcIsCacheableNavigationResponse(networkResponse)) {
      await navigationCache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    const cachedPage = await navigationCache.match(request)

    if (cachedPage) {
      return cachedPage
    }

    const staticCache = await caches.open(NDJC_STATIC_CACHE)
    const offlinePage = await staticCache.match(NDJC_OFFLINE_URL)

    if (offlinePage) {
      return offlinePage
    }

    return new Response(
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline</title></head><body><main style="font-family:Arial,sans-serif;padding:24px"><h1>Offline</h1><p>The app shell is not available yet. Connect to the internet and open the app once.</p></main></body></html>',
      {
        status: 503,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      }
    )
  }
}

self.addEventListener('install', event => {
  if (NDJC_DEV_KILL_SERVICE_WORKER) {
    self.skipWaiting()
    return
  }

  event.waitUntil(
    caches.open(NDJC_STATIC_CACHE)
      .then(cache => cache.addAll(NDJC_APP_SHELL_URLS))
  )
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
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith(NDJC_CACHE_PREFIX) && !key.startsWith(NDJC_SW_VERSION))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  if (NDJC_DEV_KILL_SERVICE_WORKER) {
    return
  }

  const request = event.request

  if (!request || request.method !== 'GET') {
    return
  }

  let url

  try {
    url = new URL(request.url)
  } catch (error) {
    return
  }

  if (!ndjcIsSameOriginUrl(url)) {
    return
  }

  if (ndjcIsApiLikeRequest(url)) {
    return
  }

  if (ndjcIsHtmlNavigationRequest(request)) {
    event.respondWith(ndjcNetworkFirstNavigation(request))
    return
  }

  if (ndjcIsStoreManifestRequest(url)) {
    event.respondWith(ndjcNetworkFirstStoreManifest(request))
    return
  }

  if (!ndjcIsStaticAssetRequest(url)) {
    return
  }

  event.respondWith(ndjcStaleWhileRevalidate(request))
})

const NDJC_CHAT_VISIBILITY_GRACE_MS = 8000
const ndjcVisibleChatClients = new Map()

function ndjcNormalizeText(value) {
  return String(value || '').trim()
}

function ndjcNowMs() {
  return Date.now()
}

function ndjcRememberChatVisibility(clientId, payload) {
  const key = ndjcNormalizeText(clientId)
  if (!key) return

  const visible = Boolean(payload && payload.visible)
  const conversationId = ndjcNormalizeText(payload && (payload.conversation_id || payload.conversationId))
  const screen = ndjcNormalizeText(payload && payload.screen)
  const appClientId = ndjcNormalizeText(payload && (payload.client_id || payload.clientId))
  const chatRole = ndjcNormalizeText(payload && (payload.chat_role || payload.chatRole))
  const updatedAt = ndjcNowMs()

  if (!visible || !conversationId) {
    ndjcVisibleChatClients.delete(key)
    return
  }

  ndjcVisibleChatClients.set(key, {
    conversation_id: conversationId,
    client_id: appClientId,
    chat_role: chatRole,
    screen,
    updated_at: updatedAt
  })
}

function ndjcPruneChatVisibility() {
  const now = ndjcNowMs()
  const maxAgeMs = 5 * 60 * 1000

  ndjcVisibleChatClients.forEach((value, key) => {
    const updatedAt = Number(value && value.updated_at ? value.updated_at : 0)

    if (!updatedAt || now - updatedAt > maxAgeMs) {
      ndjcVisibleChatClients.delete(key)
    }
  })
}

function ndjcIsChatPushPayload(payload) {
  const type = ndjcNormalizeText(payload && (payload.type || payload.push_type || payload.pushType)).toLowerCase()
  return type === 'chat' || type === 'chat_message' || type === 'message'
}

function ndjcPayloadConversationId(payload) {
  return ndjcNormalizeText(payload && (payload.conversation_id || payload.conversationId))
}

function ndjcShouldSuppressVisibleChatNotification(payload) {
  if (!ndjcIsChatPushPayload(payload)) {
    return false
  }

  const conversationId = ndjcPayloadConversationId(payload)
  if (!conversationId) {
    return false
  }

  ndjcPruneChatVisibility()

  const now = ndjcNowMs()
  const senderClientId = ndjcNormalizeText(payload && (payload.sender_client_id || payload.senderClientId))

  for (const value of ndjcVisibleChatClients.values()) {
    const visibleConversationId = ndjcNormalizeText(value && value.conversation_id)
    const visibleClientId = ndjcNormalizeText(value && value.client_id)
    const updatedAt = Number(value && value.updated_at ? value.updated_at : 0)

    if (!updatedAt || now - updatedAt > NDJC_CHAT_VISIBILITY_GRACE_MS) {
      continue
    }

    if (visibleConversationId === conversationId) {
      return true
    }

    if (senderClientId && visibleClientId && senderClientId === visibleClientId) {
      return true
    }
  }

  return false
}

function ndjcBuildChatPushMessage(payload, title, body) {
  return {
    type: 'NDJC_CHAT_PUSH_RECEIVED',
    push_type: 'chat',
    conversation_id: ndjcPayloadConversationId(payload),
    conversationId: ndjcPayloadConversationId(payload),
    sender_role: ndjcNormalizeText(payload && (payload.sender_role || payload.senderRole)),
    sender_client_id: ndjcNormalizeText(payload && (payload.sender_client_id || payload.senderClientId)),
    target_client_id: ndjcNormalizeText(payload && (payload.target_client_id || payload.targetClientId)),
    target_audience: ndjcNormalizeText(payload && (payload.target_audience || payload.targetAudience || payload.audience)),
    open_as: ndjcNormalizeText(payload && (payload.open_as || payload.openAs)),
    title: String(title || ''),
    body: String(body || ''),
    payload
  }
}

async function ndjcBroadcastToWindowClients(message) {
  const windowClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })

  windowClients.forEach(client => {
    client.postMessage(message)
  })

  return windowClients.length
}

self.addEventListener('message', event => {
  const payload = event.data || {}

  if (!payload) {
    return
  }

  if (payload.type === 'NDJC_SKIP_WAITING') {
    self.skipWaiting()
    return
  }

  if (payload.type !== 'NDJC_CHAT_VISIBILITY') {
    return
  }

  ndjcRememberChatVisibility(event.source && event.source.id, payload)
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

  const notificationPayload = {
    ...mergedData,
    raw_push_payload: rawData
  }

  delete notificationPayload.notification
  delete notificationPayload.title
  delete notificationPayload.body
  delete notificationPayload.icon
  delete notificationPayload.badge

  const notificationTag = String(
    notificationPayload.conversation_id ||
    notificationPayload.conversationId ||
    notificationPayload.appointment_id ||
    notificationPayload.appointmentId ||
    notificationPayload.announcement_id ||
    notificationPayload.announcementId ||
    notificationPayload.push_type ||
    notificationPayload.type ||
    'ndjc-notification'
  )

  const options = {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/maskable-192.png',
    tag: notificationTag,
    renotify: false,
    requireInteraction: false,
    data: notificationPayload,
    actions: [
      {
        action: 'open',
        title: 'Open'
      }
    ]
  }

  console.log('[NDJC_SW_PUSH_RECEIVED]', {
    title,
    body,
    payload: notificationPayload
  })

  const isChatPush = ndjcIsChatPushPayload(notificationPayload)
  const shouldSuppressVisibleChatNotification = ndjcShouldSuppressVisibleChatNotification(notificationPayload)
  const chatPushMessage = isChatPush
    ? ndjcBuildChatPushMessage(notificationPayload, title, body)
    : null

  event.waitUntil(
    Promise.resolve()
      .then(() => {
        if (!chatPushMessage) {
          return 0
        }

        return ndjcBroadcastToWindowClients(chatPushMessage).then(count => {
          console.log('[NDJC_SW_BROADCAST_CHAT_PUSH_TO_CLIENTS]', {
            count,
            conversation_id: chatPushMessage.conversation_id,
            sender_role: chatPushMessage.sender_role,
            sender_client_id: chatPushMessage.sender_client_id,
            target_client_id: chatPushMessage.target_client_id,
            target_audience: chatPushMessage.target_audience
          })

          return count
        })
      })
      .then(() => {
        if (shouldSuppressVisibleChatNotification) {
          console.log('[NDJC_SW_SUPPRESS_VISIBLE_CHAT_NOTIFICATION]', {
            reason: 'visible_chat_conversation',
            conversation_id: ndjcPayloadConversationId(notificationPayload),
            payload: notificationPayload
          })
          return null
        }

        return self.registration.showNotification(title, options).then(() => {
          console.log('[NDJC_SW_SHOW_NOTIFICATION_OK]', {
            title,
            body
          })
          return null
        })
      })
      .catch(error => {
        console.error('[NDJC_SW_SHOW_NOTIFICATION_ERROR]', {
          name: error && error.name ? error.name : null,
          message: error && error.message ? error.message : String(error)
        })
      })
  )
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

  if (event.action && event.action !== 'open') {
    return
  }

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
