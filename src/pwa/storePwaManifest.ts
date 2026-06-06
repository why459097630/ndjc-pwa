import type { Metadata } from 'next'

type StorePwaIconVariants = {
  icon192: string
  icon512: string
  maskable192: string
  maskable512: string
  appleTouchIcon: string
}

type StorePwaProfile = {
  storeId: string
  appName: string
  shortName: string
  description: string
  iconUrl: string
  iconVariants: StorePwaIconVariants
  themeColor: string
  backgroundColor: string
}

type StorePwaProfileRow = {
  store_id?: unknown
  app_name?: unknown
  short_name?: unknown
  description?: unknown
  icon_192_url?: unknown
  icon_512_url?: unknown
  maskable_192_url?: unknown
  maskable_512_url?: unknown
  apple_touch_icon_url?: unknown
  notification_icon_url?: unknown
  source_icon_url?: unknown
  display_logo_url?: unknown
  theme_color?: unknown
  background_color?: unknown
}

const DEFAULT_APP_NAME = 'NDJC PWA'
const DEFAULT_SHORT_NAME = 'NDJC'
const DEFAULT_DESCRIPTION = 'Generated NDJC customer PWA'
const DEFAULT_THEME_COLOR = '#ffffff'
const DEFAULT_BACKGROUND_COLOR = '#ffffff'
const DEFAULT_ICON_192 = '/icons/icon-192.png'
const DEFAULT_ICON_512 = '/icons/icon-512.png'
const DEFAULT_MASKABLE_192 = '/icons/maskable-192.png'
const DEFAULT_MASKABLE_512 = '/icons/maskable-512.png'
const DEFAULT_APPLE_ICON = '/icons/apple-touch-icon.png'
const DEFAULT_ICON_VARIANTS: StorePwaIconVariants = {
  icon192: DEFAULT_ICON_192,
  icon512: DEFAULT_ICON_512,
  maskable192: DEFAULT_MASKABLE_192,
  maskable512: DEFAULT_MASKABLE_512,
  appleTouchIcon: DEFAULT_APPLE_ICON
}
const STORE_PWA_PROFILES_TABLE = 'store_pwa_profiles'

function readEnv(name: string): string {
  return typeof process !== 'undefined' ? process.env[name] || '' : ''
}

function resolveSupabaseUrl(): string {
  return (
    readEnv('NEXT_PUBLIC_APP_CLOUD_SUPABASE_URL') ||
    readEnv('APP_CLOUD_SUPABASE_URL') ||
    readEnv('NEXT_PUBLIC_SUPABASE_URL') ||
    readEnv('SUPABASE_URL')
  ).trim()
}

function resolveSupabaseAnonKey(): string {
  return (
    readEnv('NEXT_PUBLIC_APP_CLOUD_SUPABASE_PUBLISHABLE_KEY') ||
    readEnv('NEXT_PUBLIC_APP_CLOUD_SUPABASE_ANON_KEY') ||
    readEnv('APP_CLOUD_SUPABASE_PUBLISHABLE_KEY') ||
    readEnv('APP_CLOUD_SUPABASE_ANON_KEY') ||
    readEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') ||
    readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
    readEnv('SUPABASE_ANON_KEY')
  ).trim()
}

function normalizeStoreId(value: unknown): string {
  const text = String(value ?? '').trim()

  if (!text || text.toLowerCase() === 'null') {
    throw new Error('storeId is required for store PWA manifest.')
  }

  return text
}

function normalizeText(value: unknown): string {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeManifestText(value: unknown, fallback: string): string {
  const text = normalizeText(value)
  return text || fallback
}

function normalizeShortName(value: unknown): string {
  const text = normalizeText(value)
  if (!text) return DEFAULT_SHORT_NAME
  if (text.length <= 24) return text
  return text.slice(0, 24).trim()
}

function normalizeAbsoluteOrRootUrl(value: unknown, fallback: string): string {
  const text = normalizeText(value)
  if (!text) return fallback
  if (text.startsWith('/')) return text
  if (text.startsWith('https://')) return text
  if (text.startsWith('http://')) return text
  return fallback
}

function normalizeSupabaseBaseUrl(value: string): string {
  return value.replace(/\/+$/, '')
}

function encodeStorePathPart(storeId: string): string {
  return encodeURIComponent(storeId)
}

async function fetchStorePwaProfileRow(storeId: string): Promise<StorePwaProfileRow | null> {
  const supabaseUrl = resolveSupabaseUrl()
  const anonKey = resolveSupabaseAnonKey()

  if (!supabaseUrl || !anonKey) return null

  const baseUrl = normalizeSupabaseBaseUrl(supabaseUrl)
  const query = [
    'select=store_id,app_name,short_name,description,icon_192_url,icon_512_url,maskable_192_url,maskable_512_url,apple_touch_icon_url,notification_icon_url,source_icon_url,display_logo_url,theme_color,background_color',
    `store_id=eq.${encodeURIComponent(storeId)}`,
    'limit=1'
  ].join('&')

  const response = await fetch(`${baseUrl}/rest/v1/${STORE_PWA_PROFILES_TABLE}?${query}`, {
    method: 'GET',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept: 'application/json',
      'x-ndjc-store-id': storeId
    },
    cache: 'no-store'
  })

  if (!response.ok) return null

  const body = await response.json()
  if (!Array.isArray(body) || body.length < 1 || !body[0] || typeof body[0] !== 'object') {
    return null
  }

  return body[0] as StorePwaProfileRow
}

function buildFallbackProfile(storeIdInput: unknown): StorePwaProfile {
  const storeId = normalizeStoreId(storeIdInput)

  return {
    storeId,
    appName: DEFAULT_APP_NAME,
    shortName: DEFAULT_SHORT_NAME,
    description: DEFAULT_DESCRIPTION,
    iconUrl: DEFAULT_ICON_512,
    iconVariants: DEFAULT_ICON_VARIANTS,
    themeColor: DEFAULT_THEME_COLOR,
    backgroundColor: DEFAULT_BACKGROUND_COLOR
  }
}

function buildProfileFromRow(storeIdInput: unknown, row: StorePwaProfileRow | null): StorePwaProfile {
  const fallback = buildFallbackProfile(storeIdInput)

  if (!row) return fallback

  const appName = normalizeManifestText(row.app_name, DEFAULT_APP_NAME)
  const shortName = normalizeShortName(row.short_name || appName)
  const description = normalizeManifestText(row.description, DEFAULT_DESCRIPTION)
  const icon192 = normalizeAbsoluteOrRootUrl(row.icon_192_url, DEFAULT_ICON_192)
  const icon512 = normalizeAbsoluteOrRootUrl(row.icon_512_url, DEFAULT_ICON_512)
  const maskable192 = normalizeAbsoluteOrRootUrl(row.maskable_192_url, DEFAULT_MASKABLE_192)
  const maskable512 = normalizeAbsoluteOrRootUrl(row.maskable_512_url, DEFAULT_MASKABLE_512)
  const appleTouchIcon = normalizeAbsoluteOrRootUrl(row.apple_touch_icon_url, DEFAULT_APPLE_ICON)
  const iconVariants: StorePwaIconVariants = {
    icon192,
    icon512,
    maskable192,
    maskable512,
    appleTouchIcon
  }

  return {
    storeId: normalizeStoreId(row.store_id || storeIdInput),
    appName,
    shortName,
    description,
    iconUrl: icon512,
    iconVariants,
    themeColor: normalizeManifestText(row.theme_color, DEFAULT_THEME_COLOR),
    backgroundColor: normalizeManifestText(row.background_color, DEFAULT_BACKGROUND_COLOR)
  }
}

export async function resolveStorePwaProfile(storeIdInput: unknown): Promise<StorePwaProfile> {
  const storeId = normalizeStoreId(storeIdInput)

  try {
    const row = await fetchStorePwaProfileRow(storeId)
    return buildProfileFromRow(storeId, row)
  } catch {
    return buildFallbackProfile(storeId)
  }
}

export async function resolveStorePwaPageMetadata(storeIdInput: unknown): Promise<Metadata> {
  const profile = await resolveStorePwaProfile(storeIdInput)
  const encodedStoreId = encodeStorePathPart(profile.storeId)
  const manifestUrl = `/pwa/${encodedStoreId}/manifest.webmanifest`

  return {
    title: profile.appName,
    description: profile.description,
    applicationName: profile.appName,
    manifest: manifestUrl,
    icons: {
      icon: [
        {
          url: profile.iconVariants.icon192,
          sizes: '192x192',
          type: 'image/png'
        },
        {
          url: profile.iconVariants.icon512,
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      apple: [
        {
          url: profile.iconVariants.appleTouchIcon,
          sizes: '180x180',
          type: 'image/png'
        }
      ]
    },
    appleWebApp: {
      capable: true,
      title: profile.appName,
      statusBarStyle: 'default'
    },
    formatDetection: {
      telephone: false,
      date: false,
      address: false,
      email: false,
      url: false
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-title': profile.appName,
      'apple-mobile-web-app-status-bar-style': 'default',
      'msapplication-TileColor': profile.themeColor,
      'msapplication-tap-highlight': 'no'
    }
  }
}

export async function buildStorePwaManifest(storeIdInput: unknown) {
  const profile = await resolveStorePwaProfile(storeIdInput)
  const encodedStoreId = encodeStorePathPart(profile.storeId)
  const startUrl = `/pwa/${encodedStoreId}`
  const scope = `/pwa/${encodedStoreId}`

  const icons = [
    {
      src: profile.iconVariants.icon192,
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: profile.iconVariants.icon512,
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any'
    },
    {
      src: profile.iconVariants.maskable192,
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable'
    },
    {
      src: profile.iconVariants.maskable512,
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    }
  ]

  return {
    id: startUrl,
    name: profile.appName,
    short_name: profile.shortName,
    description: profile.description,
    start_url: startUrl,
    scope,
    display: 'standalone',
    orientation: 'portrait',
    background_color: profile.backgroundColor,
    theme_color: profile.themeColor,
    icons,
    shortcuts: [
      {
        name: 'Home',
        short_name: 'Home',
        description: 'Open app home',
        url: startUrl,
        icons: [
          {
            src: profile.iconVariants.icon192,
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    ],
    x_ndjc_apple_touch_icon: profile.iconVariants.appleTouchIcon
  }
}