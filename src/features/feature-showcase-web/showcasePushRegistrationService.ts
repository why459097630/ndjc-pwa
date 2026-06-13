import { createShowcaseCloudRepository } from '@/features/feature-showcase-web/showcaseCloudRepository'
import { createShowcaseCloudRepositoryConfig } from '@/features/feature-showcase-web/showcaseCloudConfig'

const NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY = 'ndjc_pwa_device_install_id'
const NDJC_SHOWCASE_CLIENT_ID_STORAGE_KEY = 'ndjc_showcase_client_id'
const NDJC_NOTIFICATION_OPT_IN_ENABLED_STORAGE_KEY = 'ndjc_notification_opt_in_enabled'
const NDJC_NOTIFICATION_OPT_IN_DISMISSED_STORAGE_KEY = 'ndjc_notification_opt_in_dismissed'
const NDJC_PUSH_TOKEN_FINGERPRINT_STORAGE_KEY = 'ndjc_pwa_push_token_fingerprint'
const NDJC_PUSH_TOKEN_LAST_REFRESH_STORAGE_KEY = 'ndjc_pwa_push_token_last_refresh_at'

export type ShowcaseNotificationPermissionState =
  | 'default'
  | 'granted'
  | 'denied'
  | 'unsupported'

export type ShowcaseNotificationRegistrationState =
  | 'idle'
  | 'registered'
  | 'failed'

export type ShowcasePushRegistrationSource =
  | 'manual'
  | 'startup'

export type ShowcaseNotificationMessageCode =
  | 'notifications-allowed-auto'
  | 'notifications-blocked-site-settings'
  | 'notifications-unsupported-browser'
  | 'offline-reconnect'
  | 'notifications-blocked-enable-site-settings'
  | 'notifications-not-enabled-try-later'
  | 'push-registration-failed-after-allowed'
  | 'device-registration-failed'
  | 'notifications-enabled-device'
  | 'notifications-active'
  | 'push-registration-failed-check-connection'
  | null

export type ShowcasePushRegistrationResult = {
  success: boolean
  permissionState: ShowcaseNotificationPermissionState
  registrationState: ShowcaseNotificationRegistrationState
  registered: boolean
  messageCode: ShowcaseNotificationMessageCode
  debugMessage?: string | null
}

function createPwaDeviceInstallId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `web_${crypto.randomUUID()}`
  }

  return `web_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
}

function getOrCreatePwaDeviceInstallId(): string {
  if (typeof window === 'undefined') {
    return createPwaDeviceInstallId()
  }

  const existing = window.localStorage.getItem(NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY)
  if (existing && existing.trim()) {
    return existing.trim()
  }

  const created = createPwaDeviceInstallId()
  window.localStorage.setItem(NDJC_PWA_DEVICE_INSTALL_ID_STORAGE_KEY, created)
  return created
}

function createShowcaseClientId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `client_${crypto.randomUUID()}`
  }

  return `client_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
}

function getOrCreateShowcaseClientId(): string {
  if (typeof window === 'undefined') {
    return createShowcaseClientId()
  }

  const existing = window.localStorage.getItem(NDJC_SHOWCASE_CLIENT_ID_STORAGE_KEY)
  if (existing && existing.trim()) {
    return existing.trim()
  }

  const created = createShowcaseClientId()
  window.localStorage.setItem(NDJC_SHOWCASE_CLIENT_ID_STORAGE_KEY, created)
  return created
}

function createPushTokenFingerprint(token: string): string {
  const normalized = String(token || '').trim()

  if (!normalized) {
    return ''
  }

  return [
    normalized.length,
    normalized.slice(0, 16),
    normalized.slice(-16)
  ].join(':')
}

function resolveBrowserNotificationPermission(): ShowcaseNotificationPermissionState {
  if (typeof window === 'undefined') return 'unsupported'
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

function formatPushRegistrationDebugMessage(input: {
  message: string
  name: string | null
  code: string | null
  permission: NotificationPermission | 'unsupported'
  isSecureContext: boolean
  serviceWorkerMode?: string | null
  serviceWorkerScope: string | null
  serviceWorkerActive: boolean
  serviceWorkerScriptURL: string | null
  userAgent: string
}): string {
  const lines = [
    'Push registration debug',
    `Error: ${input.message}`,
    `Name: ${input.name || 'unknown'}`,
    `Code: ${input.code || 'unknown'}`,
    `Permission: ${input.permission}`,
    `Secure context: ${input.isSecureContext ? 'yes' : 'no'}`,
    `Service worker mode: ${input.serviceWorkerMode || 'unknown'}`,
    `Service worker active: ${input.serviceWorkerActive ? 'yes' : 'no'}`,
    `Service worker scope: ${input.serviceWorkerScope || 'none'}`,
    `Service worker script: ${input.serviceWorkerScriptURL || 'none'}`,
    `User agent: ${input.userAgent || 'unknown'}`
  ]

  return lines.join('\n')
}

export function inspectShowcaseNotificationPermission(): {
  permissionState: ShowcaseNotificationPermissionState
  messageCode: ShowcaseNotificationMessageCode
} {
  const permissionState = resolveBrowserNotificationPermission()

  if (permissionState === 'granted') {
    return {
      permissionState,
      messageCode: 'notifications-allowed-auto'
    }
  }

  if (permissionState === 'denied') {
    return {
      permissionState,
      messageCode: 'notifications-blocked-site-settings'
    }
  }

  if (permissionState === 'unsupported') {
    return {
      permissionState,
      messageCode: 'notifications-unsupported-browser'
    }
  }

  return {
    permissionState,
    messageCode: null
  }
}

export async function registerShowcasePushDeviceForCurrentStore({
  runtimeStoreId,
  source
}: {
  runtimeStoreId: string
  source: ShowcasePushRegistrationSource
}): Promise<ShowcasePushRegistrationResult> {
  if (typeof window === 'undefined') {
    return {
      success: false,
      permissionState: 'unsupported',
      registrationState: 'failed',
      registered: false,
      messageCode: 'notifications-unsupported-browser'
    }
  }

  if (!('Notification' in window)) {
    return {
      success: false,
      permissionState: 'unsupported',
      registrationState: 'failed',
      registered: false,
      messageCode: 'notifications-unsupported-browser'
    }
  }

  if (window.navigator.onLine === false) {
    return {
      success: false,
      permissionState: Notification.permission,
      registrationState: 'failed',
      registered: false,
      messageCode: source === 'manual' ? 'offline-reconnect' : null
    }
  }

  if (source === 'startup') {
    const optedIn = window.localStorage.getItem(NDJC_NOTIFICATION_OPT_IN_ENABLED_STORAGE_KEY) === '1'

    if (!optedIn || Notification.permission !== 'granted') {
      return {
        success: false,
        permissionState: Notification.permission,
        registrationState: 'idle',
        registered: false,
        messageCode: null
      }
    }
  }

  try {
    const permission = Notification.permission === 'granted'
      ? 'granted'
      : source === 'manual'
        ? await Notification.requestPermission()
        : Notification.permission

    if (permission !== 'granted') {
      return {
        success: false,
        permissionState: permission,
        registrationState: 'failed',
        registered: false,
        messageCode: permission === 'denied'
          ? 'notifications-blocked-enable-site-settings'
          : 'notifications-not-enabled-try-later'
      }
    }

    const {
      getLastNdjcWebPushRegistrationFailure,
      getNdjcPushRegistrationTokenForCurrentBrowser,
      runNdjcPushRegistrationComparisonDiagnostics
    } = await import('@/pwa/webPushRegistration')
    const registrationToken = await getNdjcPushRegistrationTokenForCurrentBrowser()

    if (!registrationToken) {
      const failure = getLastNdjcWebPushRegistrationFailure()
      const debugMessages = [
        failure ? formatPushRegistrationDebugMessage(failure) : null,
        source === 'manual'
          ? await runNdjcPushRegistrationComparisonDiagnostics().catch(error => [
              'Push registration comparison diagnostics',
              `Error: ${error instanceof Error ? error.message : String(error)}`,
              `Name: ${error instanceof Error ? error.name || 'unknown' : 'unknown'}`
            ].join('\n'))
          : null
      ]
      const debugMessage = debugMessages
        .filter((message): message is string => Boolean(message && message.trim()))
        .join('\n\n')

      return {
        success: false,
        permissionState: 'granted',
        registrationState: 'failed',
        registered: false,
        messageCode: 'push-registration-failed-after-allowed',
        debugMessage: debugMessage || null
      }
    }

    const token = registrationToken.token
    const tokenFingerprint = createPushTokenFingerprint(token)

    const deviceInstallId = getOrCreatePwaDeviceInstallId()
    const showcaseClientId = getOrCreateShowcaseClientId()
    const repository = createShowcaseCloudRepository(
      createShowcaseCloudRepositoryConfig(runtimeStoreId)
    )

    const registeredAnnouncements = await repository.upsertPushDevice({
      storeId: runtimeStoreId,
      audience: 'announcement_subscriber',
      token,
      conversationId: '__announcement__',
      clientId: showcaseClientId,
      platform: registrationToken.platform,
      appVersion: registrationToken.appVersion,
      deviceInstallId
    })

    const registeredAppointments = await repository.upsertPushDevice({
      storeId: runtimeStoreId,
      audience: 'appointment_client',
      token,
      conversationId: '__appointment_client__',
      clientId: showcaseClientId,
      platform: registrationToken.platform,
      appVersion: registrationToken.appVersion,
      deviceInstallId
    })

    const registered = registeredAnnouncements && registeredAppointments

    if (!registered) {
      return {
        success: false,
        permissionState: 'granted',
        registrationState: 'failed',
        registered: false,
        messageCode: 'device-registration-failed'
      }
    }

    window.localStorage.setItem(NDJC_PUSH_TOKEN_FINGERPRINT_STORAGE_KEY, tokenFingerprint)
    window.localStorage.setItem(NDJC_PUSH_TOKEN_LAST_REFRESH_STORAGE_KEY, String(Date.now()))
    window.localStorage.setItem(NDJC_NOTIFICATION_OPT_IN_ENABLED_STORAGE_KEY, '1')
    window.localStorage.removeItem(NDJC_NOTIFICATION_OPT_IN_DISMISSED_STORAGE_KEY)

    return {
      success: true,
      permissionState: 'granted',
      registrationState: 'registered',
      registered: true,
      messageCode: source === 'manual'
        ? 'notifications-enabled-device'
        : 'notifications-active'
    }
  } catch (error) {
    const debugMessage = error instanceof Error
      ? [
          'Push registration debug',
          `Error: ${error.message}`,
          `Name: ${error.name || 'unknown'}`,
          'Code: unknown',
          `Permission: ${resolveBrowserNotificationPermission()}`
        ].join('\n')
      : [
          'Push registration debug',
          `Error: ${String(error)}`,
          'Name: unknown',
          'Code: unknown',
          `Permission: ${resolveBrowserNotificationPermission()}`
        ].join('\n')

    return {
      success: false,
      permissionState: resolveBrowserNotificationPermission(),
      registrationState: 'failed',
      registered: false,
      messageCode: 'push-registration-failed-check-connection',
      debugMessage
    }
  }
}