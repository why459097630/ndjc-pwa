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
  const conversationId = ndjcNormalizeText(payload && payload.conversation_id)
  const screen = ndjcNormalizeText(payload && payload.screen)
  const updatedAt = ndjcNowMs()

  if (!visible || !conversationId) {
    ndjcVisibleChatClients.delete(key)
    return
  }

  ndjcVisibleChatClients.set(key, {
    conversation_id: conversationId,
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
  return type === 'chat'
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

  for (const value of ndjcVisibleChatClients.values()) {
    const visibleConversationId = ndjcNormalizeText(value && value.conversation_id)
    const updatedAt = Number(value && value.updated_at ? value.updated_at : 0)

    if (
      visibleConversationId === conversationId &&
      updatedAt > 0 &&
      now - updatedAt <= NDJC_CHAT_VISIBILITY_GRACE_MS
    ) {
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

  if (!payload || payload.type !== 'NDJC_CHAT_VISIBILITY') {
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

  const options = {
    body,
    data: notificationPayload
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
            conversation_id: chatPushMessage.conversation_id
          })

          return count
        })
      })
      .then(() => {
        if (shouldSuppressVisibleChatNotification) {
          console.log('[NDJC_SW_SUPPRESS_VISIBLE_CHAT_NOTIFICATION]', {
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
