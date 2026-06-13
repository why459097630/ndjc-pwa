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

export type NdjcFirebaseMessagingServiceWorkerMode =
  | 'app-sw'
  | 'firebase-sw'

export type NdjcPushRegistrationDiagnosticStatus =
  | 'success'
  | 'failed'
  | 'skipped'

export type NdjcPushRegistrationDiagnosticStep = {
  label: string
  status: NdjcPushRegistrationDiagnosticStatus
  message: string | null
  name: string | null
  code: string | null
  serviceWorkerScope: string | null
  serviceWorkerScriptURL: string | null
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
  messagingServiceWorkerMode: NdjcFirebaseMessagingServiceWorkerMode | null
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

export type NdjcFirebaseMessagingFailureSnapshot = {
  source: string
  message: string
  name: string | null
  code: string | null
  permission: NotificationPermission | 'unsupported'
  isSecureContext: boolean
  href: string
  userAgent: string
  messagingServiceWorkerMode: NdjcFirebaseMessagingServiceWorkerMode
  serviceWorkerScope: string | null
  serviceWorkerActive: boolean
  serviceWorkerInstalling: boolean
  serviceWorkerWaiting: boolean
  serviceWorkerScriptURL: string | null
}

declare global {
  interface Window {
    __NDJC_PUSH_LAST_ERROR__?: NdjcFirebaseMessagingFailureSnapshot | null
  }
}

const NDJC_FIREBASE_APP_NAME = 'ndjc-pwa'
const NDJC_SERVICE_WORKER_PATH = '/sw.js'
const NDJC_FIREBASE_MESSAGING_SERVICE_WORKER_PATH = '/firebase-messaging-sw.js'
const NDJC_FIREBASE_MESSAGING_SERVICE_WORKER_SCOPE = '/firebase-cloud-messaging-push-scope/'

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
    messagingServiceWorkerMode: null,
    env: readEnvDiagnostics(),
    firebaseAppCount: getApps().length,
    messagingSupported: false,
    token: null,
    tokenLength: 0,
    tokenPrefix: null,
    error: null
  }
}

function createTimeoutError(label: string, timeoutMs: number): Error {
  const error = new Error(`${label} timed out after ${timeoutMs}ms.`)
  error.name = 'TimeoutError'
  return error
}

function withTimeout<T>(
  promise: Promise<T>,
  label: string,
  timeoutMs = 15000
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(createTimeoutError(label, timeoutMs))
    }, timeoutMs)

    promise
      .then(value => {
        window.clearTimeout(timer)
        resolve(value)
      })
      .catch(error => {
        window.clearTimeout(timer)
        reject(error)
      })
  })
}

function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function readFirebaseErrorName(error: unknown): string | null {
  if (error instanceof Error && error.name) {
    return error.name
  }

  const errorRecord = error as { name?: unknown } | null

  if (typeof errorRecord?.name === 'string' && errorRecord.name.trim()) {
    return errorRecord.name.trim()
  }

  return null
}

function readFirebaseErrorCode(error: unknown): string | null {
  const errorRecord = error as { code?: unknown } | null

  if (typeof errorRecord?.code === 'string' && errorRecord.code.trim()) {
    return errorRecord.code.trim()
  }

  return null
}

function createDiagnosticStep(input: {
  label: string
  status: NdjcPushRegistrationDiagnosticStatus
  error?: unknown
  message?: string | null
  serviceWorkerRegistration?: ServiceWorkerRegistration | null
}): NdjcPushRegistrationDiagnosticStep {
  const error = input.error

  return {
    label: input.label,
    status: input.status,
    message: input.message ?? (typeof error === 'undefined' ? null : normalizeError(error)),
    name: typeof error === 'undefined' ? null : readFirebaseErrorName(error),
    code: typeof error === 'undefined' ? null : readFirebaseErrorCode(error),
    serviceWorkerScope: input.serviceWorkerRegistration?.scope || null,
    serviceWorkerScriptURL: input.serviceWorkerRegistration?.active?.scriptURL || null
  }
}

function formatDiagnosticStep(step: NdjcPushRegistrationDiagnosticStep): string[] {
  return [
    `${step.label}: ${step.status}`,
    `${step.label} error: ${step.message || 'none'}`,
    `${step.label} name: ${step.name || 'none'}`,
    `${step.label} code: ${step.code || 'none'}`,
    `${step.label} scope: ${step.serviceWorkerScope || 'none'}`,
    `${step.label} script: ${step.serviceWorkerScriptURL || 'none'}`
  ]
}

function urlBase64ToArrayBuffer(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = `${base64String}${padding}`.replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index)
  }

  return outputArray.buffer
}

async function runNativePushSubscribeDiagnostic(
  registration: ServiceWorkerRegistration,
  label: string
): Promise<NdjcPushRegistrationDiagnosticStep> {
  if (!isBrowser()) {
    return createDiagnosticStep({
      label,
      status: 'skipped',
      message: 'Browser runtime is required.',
      serviceWorkerRegistration: registration
    })
  }

  if (!('PushManager' in window) || !registration.pushManager) {
    return createDiagnosticStep({
      label,
      status: 'skipped',
      message: 'PushManager is not available.',
      serviceWorkerRegistration: registration
    })
  }

  try {
    const existing = await withTimeout(
      registration.pushManager.getSubscription(),
      `${label} getSubscription`,
      5000
    )

    if (existing) {
      return createDiagnosticStep({
        label,
        status: 'success',
        message: 'Existing native PushSubscription is available.',
        serviceWorkerRegistration: registration
      })
    }

    const subscription = await withTimeout(
      registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToArrayBuffer(readVapidKey())
      }),
      `${label} subscribe`,
      8000
    )

    await subscription.unsubscribe().catch(() => false)

    return createDiagnosticStep({
      label,
      status: 'success',
      message: 'Native PushSubscription was created and removed.',
      serviceWorkerRegistration: registration
    })
  } catch (error) {
    return createDiagnosticStep({
      label,
      status: 'failed',
      error,
      serviceWorkerRegistration: registration
    })
  }
}

async function runFirebaseGetTokenDiagnostic(input: {
  messaging: Messaging | null
  registration: ServiceWorkerRegistration | null
  label: string
}): Promise<NdjcPushRegistrationDiagnosticStep> {
  if (!input.messaging) {
    return createDiagnosticStep({
      label: input.label,
      status: 'skipped',
      message: 'Firebase messaging is not supported.',
      serviceWorkerRegistration: input.registration
    })
  }

  if (!input.registration) {
    return createDiagnosticStep({
      label: input.label,
      status: 'skipped',
      message: 'Service worker registration is not available.',
      serviceWorkerRegistration: null
    })
  }

  try {
    const token = await withTimeout(
      getToken(input.messaging, {
        vapidKey: readVapidKey(),
        serviceWorkerRegistration: input.registration
      }),
      `${input.label} getToken`,
      8000
    )

    return createDiagnosticStep({
      label: input.label,
      status: token ? 'success' : 'failed',
      message: token ? `Firebase token length: ${token.length}.` : 'Firebase getToken returned empty token.',
      serviceWorkerRegistration: input.registration
    })
  } catch (error) {
    return createDiagnosticStep({
      label: input.label,
      status: 'failed',
      error,
      serviceWorkerRegistration: input.registration
    })
  }
}

function createFirebaseGetTokenFailureSnapshot(
  source: string,
  error: unknown,
  serviceWorkerRegistration: ServiceWorkerRegistration,
  messagingServiceWorkerMode: NdjcFirebaseMessagingServiceWorkerMode
): NdjcFirebaseMessagingFailureSnapshot {
  return {
    source,
    message: normalizeError(error),
    name: readFirebaseErrorName(error),
    code: readFirebaseErrorCode(error),
    permission: typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
    isSecureContext: typeof window !== 'undefined' ? window.isSecureContext : false,
    href: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    messagingServiceWorkerMode,
    serviceWorkerScope: serviceWorkerRegistration.scope || null,
    serviceWorkerActive: Boolean(serviceWorkerRegistration.active),
    serviceWorkerInstalling: Boolean(serviceWorkerRegistration.installing),
    serviceWorkerWaiting: Boolean(serviceWorkerRegistration.waiting),
    serviceWorkerScriptURL: serviceWorkerRegistration.active?.scriptURL || null
  }
}

function createFirebaseMessagingServiceWorkerFailureSnapshot(
  source: string,
  error: unknown,
  messagingServiceWorkerMode: NdjcFirebaseMessagingServiceWorkerMode
): NdjcFirebaseMessagingFailureSnapshot {
  return {
    source,
    message: normalizeError(error),
    name: readFirebaseErrorName(error),
    code: readFirebaseErrorCode(error),
    permission: typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
    isSecureContext: typeof window !== 'undefined' ? window.isSecureContext : false,
    href: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    messagingServiceWorkerMode,
    serviceWorkerScope: NDJC_FIREBASE_MESSAGING_SERVICE_WORKER_SCOPE,
    serviceWorkerActive: false,
    serviceWorkerInstalling: false,
    serviceWorkerWaiting: false,
    serviceWorkerScriptURL: NDJC_FIREBASE_MESSAGING_SERVICE_WORKER_PATH
  }
}

function writeLastNdjcFirebaseMessagingFailure(snapshot: NdjcFirebaseMessagingFailureSnapshot | null): void {
  if (!isBrowser()) return

  window.__NDJC_PUSH_LAST_ERROR__ = snapshot
}

export function getLastNdjcFirebaseMessagingFailure(): NdjcFirebaseMessagingFailureSnapshot | null {
  if (!isBrowser()) return null

  return window.__NDJC_PUSH_LAST_ERROR__ || null
}

function logFirebaseGetTokenFailure(
  source: string,
  error: unknown,
  serviceWorkerRegistration: ServiceWorkerRegistration,
  messagingServiceWorkerMode: NdjcFirebaseMessagingServiceWorkerMode
): void {
  const snapshot = createFirebaseGetTokenFailureSnapshot(
    source,
    error,
    serviceWorkerRegistration,
    messagingServiceWorkerMode
  )

  writeLastNdjcFirebaseMessagingFailure(snapshot)

  console.error(`[NDJC_PUSH] Firebase getToken failed from ${source}.`, {
    permission: snapshot.permission,
    isSecureContext: snapshot.isSecureContext,
    href: snapshot.href,
    userAgent: snapshot.userAgent,
    messagingServiceWorkerMode: snapshot.messagingServiceWorkerMode,
    serviceWorkerScope: snapshot.serviceWorkerScope,
    serviceWorkerActive: snapshot.serviceWorkerActive,
    serviceWorkerInstalling: snapshot.serviceWorkerInstalling,
    serviceWorkerWaiting: snapshot.serviceWorkerWaiting,
    serviceWorkerScriptURL: snapshot.serviceWorkerScriptURL,
    error
  })
}

function logFirebaseMessagingServiceWorkerFailure(
  source: string,
  error: unknown,
  messagingServiceWorkerMode: NdjcFirebaseMessagingServiceWorkerMode
): void {
  const snapshot = createFirebaseMessagingServiceWorkerFailureSnapshot(
    source,
    error,
    messagingServiceWorkerMode
  )

  writeLastNdjcFirebaseMessagingFailure(snapshot)

  console.error(`[NDJC_PUSH] Firebase messaging service worker failed from ${source}.`, {
    permission: snapshot.permission,
    isSecureContext: snapshot.isSecureContext,
    href: snapshot.href,
    userAgent: snapshot.userAgent,
    messagingServiceWorkerMode: snapshot.messagingServiceWorkerMode,
    serviceWorkerScope: snapshot.serviceWorkerScope,
    serviceWorkerActive: snapshot.serviceWorkerActive,
    serviceWorkerInstalling: snapshot.serviceWorkerInstalling,
    serviceWorkerWaiting: snapshot.serviceWorkerWaiting,
    serviceWorkerScriptURL: snapshot.serviceWorkerScriptURL,
    error
  })
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

    const readyExisting = await navigator.serviceWorker.ready
    if (readyExisting) {
      return readyExisting
    }

    return existing
  }

  const registration = await navigator.serviceWorker.register(NDJC_SERVICE_WORKER_PATH, {
    scope: '/',
    updateViaCache: 'none'
  })

  const readyRegistration = await navigator.serviceWorker.ready
  if (readyRegistration) {
    return readyRegistration
  }

  return registration
}

function isAppleMobileWebKitRuntime(): boolean {
  if (!isBrowser()) return false

  const userAgent = navigator.userAgent || ''
  const platform = navigator.platform || ''
  const isIphoneOrIpad = /iPhone|iPad|iPod/i.test(userAgent)
  const isIpadOsDesktopMode = platform === 'MacIntel' && navigator.maxTouchPoints > 1
  const isAppleWebKit = /AppleWebKit/i.test(userAgent)

  return isAppleWebKit && (isIphoneOrIpad || isIpadOsDesktopMode)
}

function waitForServiceWorkerActivation(
  registration: ServiceWorkerRegistration,
  timeoutMs = 8000
): Promise<ServiceWorkerRegistration> {
  if (registration.active) {
    return Promise.resolve(registration)
  }

  const pendingWorker = registration.installing || registration.waiting
  if (!pendingWorker) {
    return Promise.resolve(registration)
  }

  const worker = pendingWorker

  return new Promise(resolve => {
    let settled = false

    function finish(): void {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      worker.removeEventListener('statechange', handleStateChange)
      resolve(registration)
    }

    function handleStateChange(): void {
      if (worker.state === 'activated') {
        finish()
      }
    }

    const timer = window.setTimeout(() => {
      finish()
    }, timeoutMs)

    worker.addEventListener('statechange', handleStateChange)
  })
}

async function getDedicatedFirebaseMessagingServiceWorker(): Promise<ServiceWorkerRegistration> {
  const existing = await navigator.serviceWorker.getRegistration(
    NDJC_FIREBASE_MESSAGING_SERVICE_WORKER_SCOPE
  )

  if (existing) {
    await existing.update().catch(() => undefined)
    return waitForServiceWorkerActivation(existing)
  }

  const registration = await withTimeout(
    navigator.serviceWorker.register(
      NDJC_FIREBASE_MESSAGING_SERVICE_WORKER_PATH,
      {
        scope: NDJC_FIREBASE_MESSAGING_SERVICE_WORKER_SCOPE,
        updateViaCache: 'none'
      }
    ),
    'Firebase messaging service worker registration',
    10000
  )

  return withTimeout(
    waitForServiceWorkerActivation(registration),
    'Firebase messaging service worker activation',
    10000
  )
}

async function getMessagingServiceWorkerRegistration(): Promise<{
  registration: ServiceWorkerRegistration
  mode: NdjcFirebaseMessagingServiceWorkerMode
}> {
  if (isAppleMobileWebKitRuntime()) {
    try {
      const registration = await getDedicatedFirebaseMessagingServiceWorker()

      return {
        registration,
        mode: 'firebase-sw'
      }
    } catch (error) {
      logFirebaseMessagingServiceWorkerFailure(
        'getMessagingServiceWorkerRegistration',
        error,
        'firebase-sw'
      )

      throw error
    }
  }

  return {
    registration: await getOrRegisterServiceWorker(),
    mode: 'app-sw'
  }
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

  writeLastNdjcFirebaseMessagingFailure(null)

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

  let serviceWorkerRegistration: ServiceWorkerRegistration
  let messagingServiceWorkerMode: NdjcFirebaseMessagingServiceWorkerMode

  try {
    const messagingServiceWorker = await getMessagingServiceWorkerRegistration()
    serviceWorkerRegistration = messagingServiceWorker.registration
    messagingServiceWorkerMode = messagingServiceWorker.mode
  } catch {
    return null
  }

  const vapidKey = readVapidKey()

  let token = ''

  try {
    token = await withTimeout(
      getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration
      }),
      'Firebase getToken',
      15000
    )
  } catch (error) {
    logFirebaseGetTokenFailure(
      'getNdjcFirebaseMessagingToken',
      error,
      serviceWorkerRegistration,
      messagingServiceWorkerMode
    )
    return null
  }

  if (!token) {
    const emptyTokenError = new Error('Firebase getToken returned empty token.')

    logFirebaseGetTokenFailure(
      'getNdjcFirebaseMessagingToken',
      emptyTokenError,
      serviceWorkerRegistration,
      messagingServiceWorkerMode
    )

    console.warn('[NDJC_PUSH] Firebase getToken returned empty token.', {
      permission: Notification.permission,
      serviceWorkerScope: serviceWorkerRegistration.scope,
      serviceWorkerActive: Boolean(serviceWorkerRegistration.active),
      serviceWorkerInstalling: Boolean(serviceWorkerRegistration.installing),
      serviceWorkerWaiting: Boolean(serviceWorkerRegistration.waiting)
    })
    return null
  }

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

    let serviceWorkerRegistration: ServiceWorkerRegistration
    let messagingServiceWorkerMode: NdjcFirebaseMessagingServiceWorkerMode

    try {
      const messagingServiceWorker = await getMessagingServiceWorkerRegistration()
      serviceWorkerRegistration = messagingServiceWorker.registration
      messagingServiceWorkerMode = messagingServiceWorker.mode
    } catch (error) {
      diagnostics.messagingServiceWorkerMode = 'firebase-sw'
      diagnostics.serviceWorkerScope = NDJC_FIREBASE_MESSAGING_SERVICE_WORKER_SCOPE
      diagnostics.serviceWorkerActive = false
      diagnostics.serviceWorkerScriptURL = NDJC_FIREBASE_MESSAGING_SERVICE_WORKER_PATH
      diagnostics.error = normalizeError(error)

      const registrations = await navigator.serviceWorker.getRegistrations()
      diagnostics.serviceWorkerRegistrationCount = registrations.length

      console.log('[NDJC_PUSH_DIAG] final', diagnostics)
      console.groupEnd()
      return diagnostics
    }

    diagnostics.messagingServiceWorkerMode = messagingServiceWorkerMode
    diagnostics.serviceWorkerScope = serviceWorkerRegistration.scope
    diagnostics.serviceWorkerActive = Boolean(serviceWorkerRegistration.active)
    diagnostics.serviceWorkerScriptURL = serviceWorkerRegistration.active?.scriptURL || null

    const registrations = await navigator.serviceWorker.getRegistrations()
    diagnostics.serviceWorkerRegistrationCount = registrations.length

    const vapidKey = readVapidKey()
    let token = ''

    try {
      token = await withTimeout(
        getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration
        }),
        'Firebase getToken diagnostics',
        15000
      )
    } catch (error) {
      diagnostics.error = normalizeError(error)
      logFirebaseGetTokenFailure(
        'runNdjcFirebaseMessagingDiagnostics',
        error,
        serviceWorkerRegistration,
        messagingServiceWorkerMode
      )
      console.log('[NDJC_PUSH_DIAG] final', diagnostics)
      console.groupEnd()
      return diagnostics
    }

    diagnostics.token = token || null
    diagnostics.tokenLength = token ? token.length : 0
    diagnostics.tokenPrefix = null

    if (!token) {
      diagnostics.error = 'Firebase getToken returned empty token.'
      console.warn('[NDJC_PUSH_DIAG] empty token')
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

export async function runNdjcPushRegistrationComparisonDiagnostics(): Promise<string> {
  const lines: string[] = [
    'Push registration comparison diagnostics',
    `Permission: ${typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'}`,
    `Secure context: ${isBrowser() && window.isSecureContext ? 'yes' : 'no'}`,
    `Apple mobile WebKit: ${isAppleMobileWebKitRuntime() ? 'yes' : 'no'}`,
    `User agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'}`
  ]

  if (!isBrowser()) {
    return lines.concat(['Error: Browser runtime is required.']).join('\n')
  }

  if (!('serviceWorker' in navigator)) {
    return lines.concat(['Error: Service Worker API is not supported.']).join('\n')
  }

  let appRegistration: ServiceWorkerRegistration | null = null
  let firebaseRegistration: ServiceWorkerRegistration | null = null

  try {
    appRegistration = await withTimeout(
      getOrRegisterServiceWorker(),
      'App service worker diagnostic registration',
      8000
    )
  } catch (error) {
    const step = createDiagnosticStep({
      label: 'App SW registration',
      status: 'failed',
      error,
      serviceWorkerRegistration: null
    })

    lines.push('', ...formatDiagnosticStep(step))
  }

  try {
    firebaseRegistration = await withTimeout(
      getDedicatedFirebaseMessagingServiceWorker(),
      'Firebase service worker diagnostic registration',
      8000
    )
  } catch (error) {
    const step = createDiagnosticStep({
      label: 'Firebase SW registration',
      status: 'failed',
      error,
      serviceWorkerRegistration: null
    })

    lines.push('', ...formatDiagnosticStep(step))
  }

  const nativeRegistration = firebaseRegistration || appRegistration

  if (nativeRegistration) {
    const nativeStep = await runNativePushSubscribeDiagnostic(
      nativeRegistration,
      firebaseRegistration ? 'Native Push subscribe firebase-sw' : 'Native Push subscribe app-sw'
    )

    lines.push('', ...formatDiagnosticStep(nativeStep))
  } else {
    const nativeStep = createDiagnosticStep({
      label: 'Native Push subscribe',
      status: 'skipped',
      message: 'No service worker registration is available.',
      serviceWorkerRegistration: null
    })

    lines.push('', ...formatDiagnosticStep(nativeStep))
  }

  const messaging = await getSupportedMessaging()

  const appTokenStep = await runFirebaseGetTokenDiagnostic({
    messaging,
    registration: appRegistration,
    label: 'Firebase getToken app-sw'
  })

  lines.push('', ...formatDiagnosticStep(appTokenStep))

  const firebaseTokenStep = await runFirebaseGetTokenDiagnostic({
    messaging,
    registration: firebaseRegistration,
    label: 'Firebase getToken firebase-sw'
  })

  lines.push('', ...formatDiagnosticStep(firebaseTokenStep))

  if (nativeRegistration) {
    const registrations = await navigator.serviceWorker.getRegistrations().catch(() => [])
    lines.push('', `Service worker registration count: ${registrations.length}`)
  }

  return lines.join('\n')
}
