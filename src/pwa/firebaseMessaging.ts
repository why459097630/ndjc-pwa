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

  const existing = await navigator.serviceWorker.getRegistration(NDJC_SERVICE_WORKER_PATH)
  if (existing) return existing

  return navigator.serviceWorker.register(NDJC_SERVICE_WORKER_PATH)
}

async function getSupportedMessaging(): Promise<Messaging | null> {
  if (!isBrowser()) return null

  const supported = await isSupported().catch(() => false)
  if (!supported) return null

  return getMessaging(getOrCreateFirebaseApp())
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
    console.warn('[NDJC_PUSH] Notification permission was not granted.')
    return null
  }

  const serviceWorkerRegistration = await getOrRegisterServiceWorker()
  const vapidKey = readVapidKey()

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration
  })

  return token || null
}