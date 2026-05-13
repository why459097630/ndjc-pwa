import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getMessaging, getToken, isSupported, type Messaging } from 'firebase/messaging'

type FirebaseWebConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

export type NdjcFirebaseMessagingDiagnostics = {
  href: string
  origin: string
  isSecureContext: boolean
  hasNotificationApi: boolean
  notificationPermissionBefore: NotificationPermission | 'unsupported'
  notificationPermissionAfter: NotificationPermission | 'unsupported'
  hasServiceWorkerApi: boolean
  serviceWorkerRegistrationCount: number
  serviceWorkerScope: string | null
  serviceWorkerActive: boolean
  serviceWorkerScriptURL: string | null
  env: {
    apiKey: boolean
    authDomain: boolean
    projectId: boolean
    storageBucket: boolean
    messagingSenderId: boolean
    appId: boolean
    vapidKey: boolean
    vapidKeyLength: number
  }
  firebaseAppCount: number
  messagingSupported: boolean
  token: string | null
  tokenLength: number
  tokenPrefix: string | null
  error: string | null
}

const NDJC_FIREBASE_APP_NAME = 'ndjc-pwa'
const NDJC_SERVICE_WORKER_PATH = '/sw.js'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function readRequiredEnv(name: string, value: string | undefined): string {
  const resolved = String(value || '').trim()
  if (!resolved) {
    throw new Error(`Missing Firebase web env: ${name}`)
  }
  return resolved
}

function readFirebaseWebConfig(): FirebaseWebConfig {
  return {
    apiKey: readRequiredEnv('NEXT_PUBLIC_FIREBASE_API_KEY', process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    authDomain: readRequiredEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    projectId: readRequiredEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    storageBucket: readRequiredEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: readRequiredEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    appId: readRequiredEnv('NEXT_PUBLIC_FIREBASE_APP_ID', process.env.NEXT_PUBLIC_FIREBASE_APP_ID)
  }
}

function readVapidKey(): string {
  return readRequiredEnv('NEXT_PUBLIC_FIREBASE_VAPID_KEY', process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY)
}

function readOptionalEnv(value: string | undefined): string {
  return String(value || '').trim()
}

function readEnvDiagnostics(): NdjcFirebaseMessagingDiagnostics['env'] {
  const vapidKey = readOptionalEnv(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY)

  return {
    apiKey: readOptionalEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY).length > 0,
    authDomain: readOptionalEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN).length > 0,
    projectId: readOptionalEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID).length > 0,
    storageBucket: readOptionalEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET).length > 0,
    messagingSenderId: readOptionalEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID).length > 0,
    appId: readOptionalEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID).length > 0,
    vapidKey: vapidKey.length > 0,
    vapidKeyLength: vapidKey.length
  }
}

function createBaseDiagnostics(): NdjcFirebaseMessagingDiagnostics {
  const hasNotificationApi = isBrowser() && 'Notification' in window

  return {
    href: isBrowser() ? window.location.href : '',
    origin: isBrowser() ? window.location.origin : '',
    isSecureContext: isBrowser() ? window.isSecureContext : false,
    hasNotificationApi,
    notificationPermissionBefore: hasNotificationApi ? Notification.permission : 'unsupported',
    notificationPermissionAfter: hasNotificationApi ? Notification.permission : 'unsupported',
    hasServiceWorkerApi: isBrowser() && 'serviceWorker' in navigator,
    serviceWorkerRegistrationCount: 0,
    serviceWorkerScope: null,
    serviceWorkerActive: false,
    serviceWorkerScriptURL: null,
    env: readEnvDiagnostics(),
    firebaseAppCount: getApps().length,
    messagingSupported: false,
    token: null,
    tokenLength: 0,
    tokenPrefix: null,
    error: null
  }
}

function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function getOrCreateFirebaseApp(): FirebaseApp {
  const existing = getApps().find(app => app.name === NDJC_FIREBASE_APP_NAME)
  if (existing) return existing

  if (getApps().length > 0) {
    return getApp()
  }

  return initializeApp(readFirebaseWebConfig(), NDJC_FIREBASE_APP_NAME)
}

async function getOrRegisterServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!isBrowser()) {
    throw new Error('Service worker is only available in browser.')
  }

  if (!('serviceWorker' in navigator)) {
    throw new Error('Service worker is not supported in this browser.')
  }

  const existing = await navigator.serviceWorker.getRegistration('/')
  if (existing) {
    await existing.update().catch(() => undefined)

    if (existing.active) {
      return existing
    }
  }

  const registration = await navigator.serviceWorker.register(NDJC_SERVICE_WORKER_PATH, {
    scope: '/'
  })

  await navigator.serviceWorker.ready

  const readyRegistration = await navigator.serviceWorker.getRegistration('/')
  if (readyRegistration) {
    return readyRegistration
  }

  return registration
}

async function getSupportedMessaging(): Promise<Messaging | null> {
  if (!isBrowser()) return null

  const supported = await isSupported().catch(() => false)
  if (!supported) return null

  return getMessaging(getOrCreateFirebaseApp())
}

async function appendServiceWorkerDiagnostics(
  diagnostics: NdjcFirebaseMessagingDiagnostics
): Promise<NdjcFirebaseMessagingDiagnostics> {
  if (!isBrowser() || !('serviceWorker' in navigator)) {
    return diagnostics
  }

  const registrations = await navigator.serviceWorker.getRegistrations()
  diagnostics.serviceWorkerRegistrationCount = registrations.length

  const readyRegistration = await navigator.serviceWorker.ready.catch(() => null)
  const activeRegistration = readyRegistration || registrations[0] || null

  diagnostics.serviceWorkerScope = activeRegistration?.scope || null
  diagnostics.serviceWorkerActive = Boolean(activeRegistration?.active)
  diagnostics.serviceWorkerScriptURL = activeRegistration?.active?.scriptURL || null

  return diagnostics
}

export async function getNdjcFirebaseMessagingToken(): Promise<string | null> {
  if (!isBrowser()) return null

  if (!('Notification' in window)) {
    console.warn('[NDJC_PUSH] Notification API is not supported.')
    return null
  }

  if (Notification.permission === 'denied') {
    console.warn('[NDJC_PUSH] Notification permission is denied.')
    return null
  }

  const messaging = await getSupportedMessaging()
  if (!messaging) {
    console.warn('[NDJC_PUSH] Firebase messaging is not supported in this browser.')
    return null
  }

  const permission = Notification.permission === 'granted'
    ? 'granted'
    : await Notification.requestPermission()

  if (permission !== 'granted') {
    console.warn('[NDJC_PUSH] Notification permission was not granted.', {
      permission
    })
    return null
  }

  const serviceWorkerRegistration = await getOrRegisterServiceWorker()
  const vapidKey = readVapidKey()

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration
  })

  if (!token) {
    console.warn('[NDJC_PUSH] Firebase getToken returned empty token.', {
      permission: Notification.permission,
      serviceWorkerScope: serviceWorkerRegistration.scope,
      serviceWorkerActive: Boolean(serviceWorkerRegistration.active),
      serviceWorkerInstalling: Boolean(serviceWorkerRegistration.installing),
      serviceWorkerWaiting: Boolean(serviceWorkerRegistration.waiting)
    })
    return null
  }

  console.log('[NDJC_PUSH] Firebase messaging token resolved.', {
    tokenPrefix: token.slice(0, 24),
    tokenLength: token.length,
    serviceWorkerScope: serviceWorkerRegistration.scope
  })

  return token
}

export async function runNdjcFirebaseMessagingDiagnostics(): Promise<NdjcFirebaseMessagingDiagnostics> {
  const diagnostics = createBaseDiagnostics()

  try {
    console.group('[NDJC_PUSH_DIAG] start')
    console.log('[NDJC_PUSH_DIAG] base', diagnostics)

    if (!isBrowser()) {
      diagnostics.error = 'Browser runtime is required.'
      console.warn('[NDJC_PUSH_DIAG] browser runtime missing')
      console.groupEnd()
      return diagnostics
    }

    if (!diagnostics.hasNotificationApi) {
      diagnostics.error = 'Notification API is not supported.'
      console.warn('[NDJC_PUSH_DIAG] Notification API missing')
      console.groupEnd()
      return diagnostics
    }

    if (Notification.permission === 'denied') {
      diagnostics.notificationPermissionAfter = Notification.permission
      diagnostics.error = 'Notification permission is denied.'
      console.warn('[NDJC_PUSH_DIAG] permission denied')
      await appendServiceWorkerDiagnostics(diagnostics)
      console.log('[NDJC_PUSH_DIAG] final', diagnostics)
      console.groupEnd()
      return diagnostics
    }

    const permission = Notification.permission === 'granted'
      ? 'granted'
      : await Notification.requestPermission()

    diagnostics.notificationPermissionAfter = permission

    if (permission !== 'granted') {
      diagnostics.error = `Notification permission was not granted: ${permission}`
      console.warn('[NDJC_PUSH_DIAG] permission not granted', {
        permission
      })
      await appendServiceWorkerDiagnostics(diagnostics)
      console.log('[NDJC_PUSH_DIAG] final', diagnostics)
      console.groupEnd()
      return diagnostics
    }

    if (!diagnostics.env.apiKey) {
      diagnostics.error = 'Missing NEXT_PUBLIC_FIREBASE_API_KEY.'
      console.warn('[NDJC_PUSH_DIAG] missing apiKey')
      console.groupEnd()
      return diagnostics
    }

    if (!diagnostics.env.authDomain) {
      diagnostics.error = 'Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.'
      console.warn('[NDJC_PUSH_DIAG] missing authDomain')
      console.groupEnd()
      return diagnostics
    }

    if (!diagnostics.env.projectId) {
      diagnostics.error = 'Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID.'
      console.warn('[NDJC_PUSH_DIAG] missing projectId')
      console.groupEnd()
      return diagnostics
    }

    if (!diagnostics.env.storageBucket) {
      diagnostics.error = 'Missing NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.'
      console.warn('[NDJC_PUSH_DIAG] missing storageBucket')
      console.groupEnd()
      return diagnostics
    }

    if (!diagnostics.env.messagingSenderId) {
      diagnostics.error = 'Missing NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID.'
      console.warn('[NDJC_PUSH_DIAG] missing messagingSenderId')
      console.groupEnd()
      return diagnostics
    }

    if (!diagnostics.env.appId) {
      diagnostics.error = 'Missing NEXT_PUBLIC_FIREBASE_APP_ID.'
      console.warn('[NDJC_PUSH_DIAG] missing appId')
      console.groupEnd()
      return diagnostics
    }

    if (!diagnostics.env.vapidKey) {
      diagnostics.error = 'Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY.'
      console.warn('[NDJC_PUSH_DIAG] missing vapidKey')
      console.groupEnd()
      return diagnostics
    }

    const messaging = await getSupportedMessaging()
    diagnostics.firebaseAppCount = getApps().length
    diagnostics.messagingSupported = Boolean(messaging)

    if (!messaging) {
      diagnostics.error = 'Firebase messaging is not supported in this browser.'
      console.warn('[NDJC_PUSH_DIAG] messaging unsupported')
      await appendServiceWorkerDiagnostics(diagnostics)
      console.log('[NDJC_PUSH_DIAG] final', diagnostics)
      console.groupEnd()
      return diagnostics
    }

    const serviceWorkerRegistration = await getOrRegisterServiceWorker()
    diagnostics.serviceWorkerScope = serviceWorkerRegistration.scope
    diagnostics.serviceWorkerActive = Boolean(serviceWorkerRegistration.active)
    diagnostics.serviceWorkerScriptURL = serviceWorkerRegistration.active?.scriptURL || null

    const registrations = await navigator.serviceWorker.getRegistrations()
    diagnostics.serviceWorkerRegistrationCount = registrations.length

    const vapidKey = readVapidKey()
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration
    })

    diagnostics.token = token || null
    diagnostics.tokenLength = token ? token.length : 0
    diagnostics.tokenPrefix = token ? token.slice(0, 24) : null

    if (!token) {
      diagnostics.error = 'Firebase getToken returned empty token.'
      console.warn('[NDJC_PUSH_DIAG] empty token')
    } else {
      console.log('[NDJC_PUSH_DIAG] token resolved', {
        tokenPrefix: diagnostics.tokenPrefix,
        tokenLength: diagnostics.tokenLength
      })
    }

    console.log('[NDJC_PUSH_DIAG] final', diagnostics)
    console.groupEnd()
    return diagnostics
  } catch (error) {
    diagnostics.error = normalizeError(error)
    diagnostics.notificationPermissionAfter = diagnostics.hasNotificationApi ? Notification.permission : 'unsupported'
    await appendServiceWorkerDiagnostics(diagnostics).catch(() => diagnostics)
    console.error('[NDJC_PUSH_DIAG] failed', diagnostics, error)
    console.groupEnd()
    return diagnostics
  }
}