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

export type NdjcPushRegistrationTokenResult = {
  token: string
  provider: 'web_push'
  platform: 'web_push' | 'ios_web_push'
  appVersion: 'pwa-web-push'
}

export type NdjcWebPushRegistrationFailureSnapshot = {
  source: string
  message: string
  name: string | null
  code: string | null
  permission: NotificationPermission | 'unsupported'
  isSecureContext: boolean
  href: string
  userAgent: string
  serviceWorkerMode: 'app-sw'
  serviceWorkerScope: string | null
  serviceWorkerActive: boolean
  serviceWorkerInstalling: boolean
  serviceWorkerWaiting: boolean
  serviceWorkerScriptURL: string | null
}

declare global {
  interface Window {
    __NDJC_PUSH_LAST_ERROR__?: NdjcWebPushRegistrationFailureSnapshot | null
  }
}

const NDJC_APP_SERVICE_WORKER_PATH = '/sw.js'
const NDJC_APP_SERVICE_WORKER_SCOPE = '/'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function readOptionalEnv(value: string | undefined): string {
  return String(value || '').trim()
}

function readWebPushVapidPublicKey(): string {
  const key = readOptionalEnv(process.env.NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY)

  if (!key) {
    throw new Error('Missing Web Push env: NEXT_PUBLIC_WEB_PUSH_VAPID_PUBLIC_KEY')
  }

  return key
}

function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function readErrorName(error: unknown): string | null {
  if (error instanceof Error && error.name) {
    return error.name
  }

  const record = error as { name?: unknown } | null

  if (typeof record?.name === 'string' && record.name.trim()) {
    return record.name.trim()
  }

  return null
}

function readErrorCode(error: unknown): string | null {
  const record = error as { code?: unknown } | null

  if (typeof record?.code === 'string' && record.code.trim()) {
    return record.code.trim()
  }

  return null
}

function readServiceWorkerScriptURL(registration: ServiceWorkerRegistration | null): string | null {
  if (!registration) return null

  return registration.active?.scriptURL ||
    registration.waiting?.scriptURL ||
    registration.installing?.scriptURL ||
    null
}

function createTimeoutError(label: string, timeoutMs: number): Error {
  const error = new Error(`${label} timed out after ${timeoutMs}ms.`)
  error.name = 'TimeoutError'
  return error
}

function withTimeout<T>(
  promise: Promise<T>,
  label: string,
  timeoutMs: number
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

function arrayBufferToBase64Url(buffer: ArrayBuffer | null): string {
  if (!buffer) return ''

  const bytes = new Uint8Array(buffer)
  let binary = ''

  for (let index = 0; index < bytes.byteLength; index += 1) {
    binary += String.fromCharCode(bytes[index])
  }

  return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function isSameApplicationServerKey(
  existingKey: ArrayBuffer | null,
  currentKey: ArrayBuffer
): boolean {
  return arrayBufferToBase64Url(existingKey) === arrayBufferToBase64Url(currentKey)
}

function createWebPushToken(subscription: PushSubscription): string {
  const subscriptionJson = subscription.toJSON()
  const endpoint = String(subscriptionJson.endpoint || '').trim()
  const p256dh = String(subscriptionJson.keys?.p256dh || '').trim()
  const auth = String(subscriptionJson.keys?.auth || '').trim()

  if (!endpoint || !p256dh || !auth) {
    throw new Error('Web Push subscription is missing endpoint or keys.')
  }

  return `webpush:${JSON.stringify({
    endpoint,
    expirationTime: subscriptionJson.expirationTime ?? null,
    keys: {
      p256dh,
      auth
    }
  })}`
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

function createFailureSnapshot(
  source: string,
  error: unknown,
  registration: ServiceWorkerRegistration | null
): NdjcWebPushRegistrationFailureSnapshot {
  return {
    source,
    message: normalizeError(error),
    name: readErrorName(error),
    code: readErrorCode(error),
    permission: typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
    isSecureContext: typeof window !== 'undefined' ? window.isSecureContext : false,
    href: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    serviceWorkerMode: 'app-sw',
    serviceWorkerScope: registration?.scope || null,
    serviceWorkerActive: Boolean(registration?.active),
    serviceWorkerInstalling: Boolean(registration?.installing),
    serviceWorkerWaiting: Boolean(registration?.waiting),
    serviceWorkerScriptURL: readServiceWorkerScriptURL(registration)
  }
}

function writeLastFailure(snapshot: NdjcWebPushRegistrationFailureSnapshot | null): void {
  if (!isBrowser()) return

  window.__NDJC_PUSH_LAST_ERROR__ = snapshot
}

function logFailure(
  source: string,
  error: unknown,
  registration: ServiceWorkerRegistration | null
): void {
  const snapshot = createFailureSnapshot(source, error, registration)

  writeLastFailure(snapshot)

  console.error(`[NDJC_PUSH] Web Push registration failed from ${source}.`, {
    permission: snapshot.permission,
    isSecureContext: snapshot.isSecureContext,
    href: snapshot.href,
    userAgent: snapshot.userAgent,
    serviceWorkerScope: snapshot.serviceWorkerScope,
    serviceWorkerActive: snapshot.serviceWorkerActive,
    serviceWorkerInstalling: snapshot.serviceWorkerInstalling,
    serviceWorkerWaiting: snapshot.serviceWorkerWaiting,
    serviceWorkerScriptURL: snapshot.serviceWorkerScriptURL,
    error
  })
}

export function getLastNdjcWebPushRegistrationFailure(): NdjcWebPushRegistrationFailureSnapshot | null {
  if (!isBrowser()) return null

  return window.__NDJC_PUSH_LAST_ERROR__ || null
}

async function waitForServiceWorkerActivation(
  registration: ServiceWorkerRegistration,
  timeoutMs = 8000
): Promise<ServiceWorkerRegistration> {
  if (registration.active) {
    return registration
  }

  const pendingWorker = registration.installing || registration.waiting

  if (!pendingWorker) {
    return registration
  }

  const worker = pendingWorker

  return new Promise<ServiceWorkerRegistration>(resolve => {
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



async function getOrRegisterAppServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!isBrowser()) {
    throw new Error('Service worker is only available in browser.')
  }

  if (!('serviceWorker' in navigator)) {
    throw new Error('Service worker is not supported in this browser.')
  }

  const existingRegistration = await navigator.serviceWorker.getRegistration(NDJC_APP_SERVICE_WORKER_SCOPE)

  if (existingRegistration) {
    await existingRegistration.update().catch(() => undefined)

    const readyRegistration = await navigator.serviceWorker.ready
    return waitForServiceWorkerActivation(readyRegistration)
  }

  const registered = await navigator.serviceWorker.register(NDJC_APP_SERVICE_WORKER_PATH, {
    scope: NDJC_APP_SERVICE_WORKER_SCOPE,
    updateViaCache: 'none'
  })

  const readyRegistration = await navigator.serviceWorker.ready.catch(() => registered)
  return waitForServiceWorkerActivation(readyRegistration)
}

async function getExistingOrCreateSubscription(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription> {
  const applicationServerKey = urlBase64ToArrayBuffer(readWebPushVapidPublicKey())

  const existing = await withTimeout(
    registration.pushManager.getSubscription(),
    'Web Push getSubscription',
    5000
  )

  if (existing) {
    const existingApplicationServerKey = existing.options.applicationServerKey || null

    if (isSameApplicationServerKey(existingApplicationServerKey, applicationServerKey)) {
      return existing
    }

    console.warn('[NDJC_PUSH] Existing Web Push subscription uses a different VAPID key. Re-subscribing.')
    await existing.unsubscribe().catch(() => false)
  }

  return withTimeout(
    registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    }),
    'Web Push subscribe',
    15000
  )
}

export async function getNdjcWebPushRegistrationToken(): Promise<string | null> {
  if (!isBrowser()) return null

  writeLastFailure(null)

  if (!('Notification' in window)) {
    console.warn('[NDJC_PUSH] Notification API is not supported.')
    return null
  }

  if (!('serviceWorker' in navigator)) {
    console.warn('[NDJC_PUSH] Service Worker API is not supported.')
    return null
  }

  if (!('PushManager' in window)) {
    console.warn('[NDJC_PUSH] PushManager API is not supported.')
    return null
  }

  if (Notification.permission === 'denied') {
    console.warn('[NDJC_PUSH] Notification permission is denied.')
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

  let registration: ServiceWorkerRegistration | null = null

  try {
    registration = await withTimeout(
      getOrRegisterAppServiceWorker(),
      'Web Push app service worker registration',
      15000
    )

    const subscription = await getExistingOrCreateSubscription(registration)
    return createWebPushToken(subscription)
  } catch (error) {
    logFailure('getNdjcWebPushRegistrationToken', error, registration)
    return null
  }
}

export async function getNdjcPushRegistrationTokenForCurrentBrowser(): Promise<NdjcPushRegistrationTokenResult | null> {
  const token = await getNdjcWebPushRegistrationToken()

  if (!token) {
    return null
  }

  return {
    token,
    provider: 'web_push',
    platform: isAppleMobileWebKitRuntime() ? 'ios_web_push' : 'web_push',
    appVersion: 'pwa-web-push'
  }
}

function createDiagnosticStep(input: {
  label: string
  status: NdjcPushRegistrationDiagnosticStatus
  error?: unknown
  message?: string | null
  registration?: ServiceWorkerRegistration | null
}): NdjcPushRegistrationDiagnosticStep {
  return {
    label: input.label,
    status: input.status,
    message: input.message ?? (typeof input.error === 'undefined' ? null : normalizeError(input.error)),
    name: typeof input.error === 'undefined' ? null : readErrorName(input.error),
    code: typeof input.error === 'undefined' ? null : readErrorCode(input.error),
    serviceWorkerScope: input.registration?.scope || null,
    serviceWorkerScriptURL: readServiceWorkerScriptURL(input.registration || null)
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

export async function runNdjcPushRegistrationComparisonDiagnostics(): Promise<string> {
  const lines: string[] = [
    'Web Push registration diagnostics',
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

  let registration: ServiceWorkerRegistration | null = null

  try {
    registration = await withTimeout(
      getOrRegisterAppServiceWorker(),
      'App service worker diagnostic registration',
      8000
    )

    const step = createDiagnosticStep({
      label: 'App SW registration',
      status: 'success',
      message: 'App service worker is available.',
      registration
    })

    lines.push('', ...formatDiagnosticStep(step))
  } catch (error) {
    const step = createDiagnosticStep({
      label: 'App SW registration',
      status: 'failed',
      error,
      registration: null
    })

    lines.push('', ...formatDiagnosticStep(step))
  }

  if (registration) {
    try {
      const token = await getNdjcWebPushRegistrationToken()
      const step = createDiagnosticStep({
        label: 'Web Push subscribe app-sw',
        status: token ? 'success' : 'failed',
        message: token ? `Web Push token length: ${token.length}.` : 'Web Push subscription returned empty token.',
        registration
      })

      lines.push('', ...formatDiagnosticStep(step))
    } catch (error) {
      const step = createDiagnosticStep({
        label: 'Web Push subscribe app-sw',
        status: 'failed',
        error,
        registration
      })

      lines.push('', ...formatDiagnosticStep(step))
    }
  }

  const registrations = await navigator.serviceWorker.getRegistrations().catch(() => [])
  lines.push('', `Service worker registration count: ${registrations.length}`)

  return lines.join('\n')
}
