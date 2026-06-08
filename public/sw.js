const NDJC_DEV_KILL_SERVICE_WORKER = false
const NDJC_SW_VERSION = 'ndjc-pwa-1.0.0-20260607073432'
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
  '/icons/apple-touch-icon.png',
  '/icons/push/chat-badge.svg',
  '/icons/push/appointment-badge.svg',
  '/icons/push/announcement-badge.svg'
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

const NDJC_DEFAULT_NOTIFICATION_ICON = '/icons/icon-192.png'
const NDJC_DEFAULT_NOTIFICATION_BADGE = '/icons/maskable-192.png'

function ndjcNormalizeNotificationImageUrl(value) {
  const url = ndjcNormalizeText(value)

  if (!url) return ''
  if (url.startsWith('/')) return url
  if (url.startsWith('https://')) return url
  if (url.startsWith('http://')) return url

  return ''
}

function ndjcPushTypeForBadge(payload) {
  return ndjcNormalizeText(
    payload && (
      payload.push_type ||
      payload.pushType ||
      payload.type ||
      payload.ndjcPushType
    )
  ).toLowerCase()
}

function ndjcBadgeForPushType(payload) {
  const type = ndjcPushTypeForBadge(payload)

  if (type === 'chat' || type === 'message' || type === 'chat_message') {
    return '/icons/push/chat-badge.svg'
  }

  if (
    type === 'appointment' ||
    type === 'booking' ||
    type === 'appointment_created' ||
    type === 'appointment_status' ||
    type === 'appointment_cancelled'
  ) {
    return '/icons/push/appointment-badge.svg'
  }

  if (type === 'announcement' || type === 'announcements') {
    return '/icons/push/announcement-badge.svg'
  }

  return NDJC_DEFAULT_NOTIFICATION_BADGE
}

function ndjcNotificationIconForPayload(payload) {
  return ndjcNormalizeNotificationImageUrl(payload && payload.notification_icon) ||
    ndjcNormalizeNotificationImageUrl(payload && payload.notificationIcon) ||
    ndjcNormalizeNotificationImageUrl(payload && payload.icon) ||
    NDJC_DEFAULT_NOTIFICATION_ICON
}

function ndjcNotificationBadgeForPayload(payload) {
  return ndjcNormalizeNotificationImageUrl(payload && payload.notification_badge) ||
    ndjcNormalizeNotificationImageUrl(payload && payload.notificationBadge) ||
    ndjcNormalizeNotificationImageUrl(payload && payload.badge) ||
    ndjcBadgeForPushType(payload)
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

function ndjcPayloadStoreId(payload) {
  return ndjcNormalizeText(payload && (payload.store_id || payload.storeId))
}

function ndjcPayloadOpenAs(payload) {
  return ndjcNormalizeText(payload && (payload.open_as || payload.openAs)).toLowerCase()
}

function ndjcVisibleChatRole(value) {
  const role = ndjcNormalizeText(value && (value.chat_role || value.chatRole)).toLowerCase()

  if (role === 'merchant') {
    return 'merchant'
  }

  if (role === 'client' || role === 'customer' || role === 'user') {
    return 'client'
  }

  return ''
}

function ndjcPushOpenAsRole(payload) {
  const openAs = ndjcPayloadOpenAs(payload)

  if (openAs === 'merchant') {
    return 'merchant'
  }

  if (openAs === 'client' || openAs === 'customer' || openAs === 'user') {
    return 'client'
  }

  return ''
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
  const pushOpenAsRole = ndjcPushOpenAsRole(payload)

  for (const value of ndjcVisibleChatClients.values()) {
    const visibleConversationId = ndjcNormalizeText(value && value.conversation_id)
    const visibleRole = ndjcVisibleChatRole(value)
    const updatedAt = Number(value && value.updated_at ? value.updated_at : 0)

    if (!updatedAt || now - updatedAt > NDJC_CHAT_VISIBILITY_GRACE_MS) {
      continue
    }

    if (visibleConversationId !== conversationId) {
      continue
    }

    if (pushOpenAsRole && visibleRole && pushOpenAsRole !== visibleRole) {
      continue
    }

    return true
  }

  return false
}

function ndjcBuildChatPushMessage(payload, title, body) {
  return {
    type: 'NDJC_CHAT_PUSH_RECEIVED',
    push_type: 'chat_message',
    conversation_id: ndjcPayloadConversationId(payload),
    conversationId: ndjcPayloadConversationId(payload),
    sender_role: ndjcNormalizeText(payload && (payload.sender_role || payload.senderRole)),
    sender_client_id: ndjcNormalizeText(payload && (payload.sender_client_id || payload.senderClientId)),
    target_client_id: ndjcNormalizeText(payload && (payload.target_client_id || payload.targetClientId)),
    target_audience: ndjcNormalizeText(payload && (payload.target_audience || payload.targetAudience || payload.audience)),
    open_as: ndjcNormalizeText(payload && (payload.open_as || payload.openAs)),
    store_id: ndjcPayloadStoreId(payload),
    storeId: ndjcPayloadStoreId(payload),
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

  const fallbackNotificationTitle = String(
    mergedData.notification_app_name ||
    mergedData.notificationAppName ||
    mergedData.app_name ||
    mergedData.appName ||
    'NDJC'
  )

  const title = String(
    mergedData.title ||
    notificationData.title ||
    nestedData.title ||
    fallbackNotificationTitle
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

  const notificationIcon = ndjcNotificationIconForPayload(notificationPayload)
  const notificationBadge = ndjcNotificationBadgeForPayload(notificationPayload)
  const notificationPushType = String(
    notificationPayload.push_type ||
    notificationPayload.pushType ||
    notificationPayload.type ||
    'generic'
  ).trim().toLowerCase()
  const notificationConversationId = String(
    notificationPayload.conversation_id ||
    notificationPayload.conversationId ||
    ''
  ).trim()
  const notificationAppointmentId = String(
    notificationPayload.appointment_id ||
    notificationPayload.appointmentId ||
    ''
  ).trim()
  const notificationAnnouncementId = String(
    notificationPayload.announcement_id ||
    notificationPayload.announcementId ||
    ''
  ).trim()

  const notificationTag = notificationConversationId
    ? `${notificationPushType}:conversation:${notificationConversationId}`
    : notificationAppointmentId
      ? `${notificationPushType}:appointment:${notificationAppointmentId}`
      : notificationAnnouncementId
        ? `${notificationPushType}:announcement:${notificationAnnouncementId}`
        : `${notificationPushType || 'generic'}:ndjc-notification`

  const shouldRenotify = notificationPushType === 'appointment_created' ||
    notificationPushType === 'appointment_cancelled' ||
    notificationPushType === 'appointment_status' ||
    notificationPushType === 'appointment' ||
    notificationPushType === 'booking'

  const options = {
    body,
    icon: notificationIcon,
    badge: notificationBadge,
    tag: notificationTag,
    renotify: shouldRenotify,
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

function ndjcPushTypeForRoute(payload) {
  return ndjcNormalizeText(payload && (payload.push_type || payload.pushType || payload.type)).toLowerCase()
}

function ndjcPayloadStoreId(payload) {
  return ndjcNormalizeText(payload && (payload.store_id || payload.storeId))
}

function ndjcPwaBaseRouteForPushPayload(payload) {
  const storeId = ndjcPayloadStoreId(payload)

  if (!storeId) {
    return '/'
  }

  return `/pwa/${encodeURIComponent(storeId)}`
}

function ndjcContextRouteForPushPayload(payload) {
  const pushType = ndjcPushTypeForRoute(payload)

  if (pushType === 'chat' || pushType === 'message' || pushType === 'chat_message') {
    return 'chat'
  }

  if (pushType === 'announcement' || pushType === 'announcements') {
    return 'announcements'
  }

  if (
    pushType === 'appointment' ||
    pushType === 'booking' ||
    pushType === 'bookings' ||
    pushType === 'appointment_created' ||
    pushType === 'appointment_status' ||
    pushType === 'appointment_cancelled'
  ) {
    return 'appointments'
  }

  return pushType || 'home'
}

function ndjcIsPwaRoute(value) {
  const text = ndjcNormalizeText(value)

  if (!text) return false

  try {
    const url = new URL(text, self.location.origin)
    return url.origin === self.location.origin && url.pathname.startsWith('/pwa/')
  } catch (error) {
    return text.startsWith('/pwa/')
  }
}

function ndjcRouteForPushPayload(payloadInput) {
  const payload = payloadInput && typeof payloadInput === 'object' ? payloadInput : {}
  const explicitUrl = ndjcNormalizeText(payload.url)
  const explicitRoute = ndjcNormalizeText(payload.route)
  const baseRoute = ndjcPwaBaseRouteForPushPayload(payload)

  if (explicitUrl && ndjcIsPwaRoute(explicitUrl)) {
    return explicitUrl
  }

  if (explicitRoute && ndjcIsPwaRoute(explicitRoute)) {
    return explicitRoute
  }

  if (baseRoute !== '/') {
    return baseRoute
  }

  if (explicitUrl) {
    return explicitUrl
  }

  if (explicitRoute) {
    return explicitRoute
  }

  return '/'
}

function appendPushPayloadToRoute(routeInput, payloadInput) {
  const payload = payloadInput && typeof payloadInput === 'object' ? payloadInput : {}
  const route = routeInput || ndjcRouteForPushPayload(payload)
  const contextRoute = ndjcContextRouteForPushPayload(payload)

  let url
  try {
    url = new URL(route, self.location.origin)
  } catch (error) {
    url = new URL('/', self.location.origin)
  }

  const pushType = ndjcPushTypeForRoute(payload)
  const conversationId = payload.conversation_id || payload.conversationId
  const announcementId = payload.announcement_id || payload.announcementId
  const appointmentId = payload.appointment_id || payload.appointmentId
  const openAs = payload.open_as || payload.openAs
  const storeId = payload.store_id || payload.storeId
  const targetClientId = payload.target_client_id || payload.targetClientId
  const senderClientId = payload.sender_client_id || payload.senderClientId
  const audience = payload.target_audience || payload.targetAudience || payload.audience

  const mappings = [
    ['push_type', pushType],
    ['type', pushType],
    ['store_id', storeId],
    ['storeId', storeId],
    ['conversation_id', conversationId],
    ['conversationId', conversationId],
    ['announcement_id', announcementId],
    ['announcementId', announcementId],
    ['appointment_id', appointmentId],
    ['appointmentId', appointmentId],
    ['open_as', openAs],
    ['openAs', openAs],
    ['target_client_id', targetClientId],
    ['targetClientId', targetClientId],
    ['sender_client_id', senderClientId],
    ['senderClientId', senderClientId],
    ['target_audience', audience],
    ['targetAudience', audience],
    ['context_route', contextRoute],
    ['contextRoute', contextRoute],
    ['route', contextRoute]
  ]

  mappings.forEach(([key, value]) => {
    const text = String(value || '').trim()
    if (text) {
      url.searchParams.set(key, text)
    }
  })

  return `${url.pathname}${url.search}${url.hash}`
}
function ndjcStoreIdFromClientUrl(clientUrlInput) {
  try {
    const url = new URL(clientUrlInput)
    const match = url.pathname.match(/^\/pwa\/([^/?#]+)/)

    if (!match) {
      return ''
    }

    return decodeURIComponent(match[1] || '').trim()
  } catch (error) {
    return ''
  }
}

function ndjcSameOriginWindowClient(client) {
  try {
    const url = new URL(client.url)
    return url.origin === self.location.origin
  } catch (error) {
    return false
  }
}

function ndjcFindBestWindowClientForPush(clientsInput, payloadInput) {
  const payload = payloadInput && typeof payloadInput === 'object' ? payloadInput : {}
  const storeId = ndjcPayloadStoreId(payload)

  const sameOriginClients = clientsInput.filter(client => {
    return client && 'focus' in client && ndjcSameOriginWindowClient(client)
  })

  if (!sameOriginClients.length) {
    return null
  }

  if (!storeId) {
    return sameOriginClients[0]
  }

  const sameStoreClient = sameOriginClients.find(client => {
    return ndjcStoreIdFromClientUrl(client.url) === storeId
  })

  return sameStoreClient || sameOriginClients[0]
}

function ndjcBuildPushRouteMessage(routeWithPayload, payloadInput) {
  const payload = payloadInput && typeof payloadInput === 'object' ? payloadInput : {}

  return {
    type: 'NDJC_PUSH_ROUTE',
    route: routeWithPayload,
    payload: {
      ...payload,
      route: routeWithPayload,
      push_type: payload.push_type || payload.pushType || payload.type,
      type: payload.type || payload.push_type || payload.pushType,
      context_route: ndjcContextRouteForPushPayload(payload),
      contextRoute: ndjcContextRouteForPushPayload(payload)
    }
  }
}

function ndjcFocusOrNavigatePushClient(client, routeWithPayload, payloadInput) {
  const message = ndjcBuildPushRouteMessage(routeWithPayload, payloadInput)

  try {
    client.postMessage(message)
  } catch (error) {
  }

  if ('navigate' in client && typeof client.navigate === 'function') {
    return client.navigate(routeWithPayload).then(navigatedClient => {
      const targetClient = navigatedClient || client

      if (targetClient && 'focus' in targetClient) {
        return targetClient.focus()
      }

      return targetClient
    })
  }

  return client.focus()
}
self.addEventListener('notificationclick', event => {
  event.notification.close()

  if (event.action && event.action !== 'open') {
    return
  }

  const payload = event.notification.data || {}
  const route = ndjcRouteForPushPayload(payload)
  const routeWithPayload = appendPushPayloadToRoute(route, payload)

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      const existing = ndjcFindBestWindowClientForPush(clients, payload)

      if (existing) {
        return ndjcFocusOrNavigatePushClient(existing, routeWithPayload, payload)
      }

      return self.clients.openWindow(routeWithPayload)
    })
  )
})