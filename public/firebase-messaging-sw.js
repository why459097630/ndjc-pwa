importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyArUw9gPrdfTiqszHrhaFQ2cRwBtzA4Ino',
  authDomain: 'ndjc-pwa.firebaseapp.com',
  projectId: 'ndjc-pwa',
  storageBucket: 'ndjc-pwa.firebasestorage.app',
  messagingSenderId: '156355274250',
  appId: '1:156355274250:web:9839748cdf6675950fe1f3'
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
  const notification = payload.notification || {}
  const data = payload.data || {}

  const title = notification.title || data.title || 'New notification'
  const options = {
    body: notification.body || data.body || '',
    icon: notification.icon || data.icon || '/icons/icon-192.png',
    badge: notification.badge || data.badge || '/icons/icon-192.png',
    data
  }

  self.registration.showNotification(title, options)
})

self.addEventListener('push', event => {
  if (!event.data) {
    return
  }

  let payload = {}

  try {
    payload = event.data.json()
  } catch {
    payload = {
      notification: {
        title: 'New notification',
        body: event.data.text()
      }
    }
  }

  const notification = payload.notification || {}
  const data = payload.data || {}

  const title = notification.title || data.title || 'New notification'
  const options = {
    body: notification.body || data.body || '',
    icon: notification.icon || data.icon || '/icons/icon-192.png',
    badge: notification.badge || data.badge || '/icons/icon-192.png',
    data
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()

  const data = event.notification.data || {}
  const url = data.url || data.click_action || '/'

  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clients => {
      for (const client of clients) {
        if ('focus' in client) {
          client.focus()
          return
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    })
  )
})
