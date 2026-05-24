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

type StoreProfileRow = {
  store_id?: unknown
  title?: unknown
  subtitle?: unknown
  description?: unknown
  logo_url?: unknown
  logo_image_variants?: unknown
  cover_url?: unknown
  title_i18n?: unknown
  subtitle_i18n?: unknown
  description_i18n?: unknown
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
const STORE_PROFILES_TABLE = 'store_profiles'

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
  return text && text.toLowerCase() !== 'null' ? text : 'store_showcase_trial_000001'
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

function normalizeShortName(value: string): string {
  const text = normalizeText(value)
  if (!text) return DEFAULT_SHORT_NAME
  if (text.length <= 12) return text
  return text.slice(0, 12)
}

function normalizeAbsoluteOrRootUrl(value: unknown, fallback: string): string {
  const text = normalizeText(value)
  if (!text) return fallback
  if (text.startsWith('/')) return text
  if (text.startsWith('https://')) return text
  if (text.startsWith('http://')) return text
  return fallback
}

function pickLogoVariant(
  value: unknown,
  keys: string[],
  fallback: string
): string {
  if (!value || typeof value !== 'object') return fallback

  const record = value as Record<string, unknown>

  for (const key of keys) {
    const picked = normalizeAbsoluteOrRootUrl(record[key], '')
    if (picked) return picked
  }

  return fallback
}

function hasCompleteStandardIconVariants(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false

  const record = value as Record<string, unknown>

  const icon192 = normalizeAbsoluteOrRootUrl(record.icon192, '')
  const icon512 = normalizeAbsoluteOrRootUrl(record.icon512, '')
  const maskable192 = normalizeAbsoluteOrRootUrl(record.maskable192, '')
  const maskable512 = normalizeAbsoluteOrRootUrl(record.maskable512, '')
  const appleTouchIcon = normalizeAbsoluteOrRootUrl(record.appleTouchIcon, '')

  return Boolean(icon192 && icon512 && maskable192 && maskable512 && appleTouchIcon)
}

function buildIconVariantsFromRow(row: StoreProfileRow | null): StorePwaIconVariants {
  if (!row) return DEFAULT_ICON_VARIANTS

  if (!hasCompleteStandardIconVariants(row.logo_image_variants)) {
    return DEFAULT_ICON_VARIANTS
  }

  return {
    icon192: pickLogoVariant(
      row.logo_image_variants,
      ['icon192'],
      DEFAULT_ICON_192
    ),
    icon512: pickLogoVariant(
      row.logo_image_variants,
      ['icon512'],
      DEFAULT_ICON_512
    ),
    maskable192: pickLogoVariant(
      row.logo_image_variants,
      ['maskable192'],
      DEFAULT_MASKABLE_192
    ),
    maskable512: pickLogoVariant(
      row.logo_image_variants,
      ['maskable512'],
      DEFAULT_MASKABLE_512
    ),
    appleTouchIcon: pickLogoVariant(
      row.logo_image_variants,
      ['appleTouchIcon'],
      DEFAULT_APPLE_ICON
    )
  }
}

function normalizeSupabaseBaseUrl(value: string): string {
  return value.replace(/\/+$/, '')
}

function encodeStorePathPart(storeId: string): string {
  return encodeURIComponent(storeId)
}

function pickI18nText(value: unknown, fallback: string): string {
  if (!value || typeof value !== 'object') return fallback

  const record = value as Record<string, unknown>
  const preferred =
    normalizeText(record.default) ||
    normalizeText(record.en) ||
    normalizeText(record.zh) ||
    normalizeText(record['zh-CN']) ||
    normalizeText(record['en-US'])

  return preferred || fallback
}

async function fetchStoreProfileRow(storeId: string): Promise<StoreProfileRow | null> {
  const supabaseUrl = resolveSupabaseUrl()
  const anonKey = resolveSupabaseAnonKey()

  if (!supabaseUrl || !anonKey) return null

  const baseUrl = normalizeSupabaseBaseUrl(supabaseUrl)
  const query = [
    'select=store_id,title,title_i18n,subtitle,subtitle_i18n,description,description_i18n,logo_url,logo_image_variants,cover_url',
    `store_id=eq.${encodeURIComponent(storeId)}`,
    'limit=1'
  ].join('&')

  const response = await fetch(`${baseUrl}/rest/v1/${STORE_PROFILES_TABLE}?${query}`, {
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

  return body[0] as StoreProfileRow
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

function buildProfileFromRow(storeIdInput: unknown, row: StoreProfileRow | null): StorePwaProfile {
  const fallback = buildFallbackProfile(storeIdInput)

  if (!row) return fallback

  const titleFallback = normalizeManifestText(row.title, DEFAULT_APP_NAME)
  const subtitleFallback = normalizeText(row.subtitle)
  const descriptionFallback = normalizeText(row.description)

  const appName = normalizeManifestText(
    pickI18nText(row.title_i18n, titleFallback),
    DEFAULT_APP_NAME
  )

  const subtitle = pickI18nText(row.subtitle_i18n, subtitleFallback)
  const description = normalizeManifestText(
    pickI18nText(row.description_i18n, descriptionFallback || subtitle || DEFAULT_DESCRIPTION),
    DEFAULT_DESCRIPTION
  )

  const iconVariants = buildIconVariantsFromRow(row)
  const iconUrl = normalizeAbsoluteOrRootUrl(row.logo_url, iconVariants.icon512)

  return {
    storeId: normalizeStoreId(row.store_id || storeIdInput),
    appName,
    shortName: normalizeShortName(appName),
    description,
    iconUrl,
    iconVariants,
    themeColor: DEFAULT_THEME_COLOR,
    backgroundColor: DEFAULT_BACKGROUND_COLOR
  }
}

export async function resolveStorePwaProfile(storeIdInput: unknown): Promise<StorePwaProfile> {
  const storeId = normalizeStoreId(storeIdInput)

  try {
    const row = await fetchStoreProfileRow(storeId)
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
    ]
  }
}
