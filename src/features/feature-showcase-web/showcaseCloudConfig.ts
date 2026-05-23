import {
  currentStoreId as currentStoreIdFromSession,
  requireMerchantAccessToken,
  requireStoreId as requireStoreIdFromSession
} from './showcaseStoreSession'

export enum ShowcaseCloudAuthActor {
  PUBLIC = 'PUBLIC',
  MERCHANT = 'MERCHANT'
}

export const ShowcaseCloudHeaders = {
  API_KEY: 'apikey',
  AUTHORIZATION: 'Authorization',
  PREFER_RETURN_REPRESENTATION: 'Prefer',
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
  NDJC_STORE_ID: 'x-ndjc-store-id',
  NDJC_CLIENT_ID: 'x-ndjc-client-id'
} as const

export const ShowcaseCloudQuery = {
  SELECT: 'select',
  ORDER: 'order',
  LIMIT: 'limit',
  OFFSET: 'offset'
} as const

export const SHOWCASE_PAGE_SIZE = {
  homeDishes: 2,
  adminItems: 2,
  chatMessages: 3,
  chatThreads: 2,
  chatSearchResults: 30,
  chatSearchMaxLocalScan: 300,
  chatMediaItems: 40,
  chatMediaMaxLocalScan: 500,
  clientAppointments: 2,
  merchantAppointments: 2,
  publicAnnouncements: 2,
  adminAnnouncements: 2,
  categories: 100
} as const

export const SHOWCASE_SUPABASE_SCHEMA = 'public'

export const SHOWCASE_TABLES = {
  stores: 'stores',
  storeProfiles: 'store_profiles',
  categories: 'categories',
  dishes: 'dishes',
  dishImages: 'dish_images',
  announcements: 'announcements',
  appointmentSettings: 'appointment_settings',
  appointmentRequests: 'appointment_requests',
  chatConversations: 'chat_conversations',
  chatThreadMeta: 'chat_thread_meta',
  chatMessages: 'chat_messages',
  chatRelay: 'chat_relay',
  pushDevices: 'push_devices',
  assetsManifest: 'assets_manifest',
  appProjects: 'app_projects',
  appBuilds: 'app_builds',
  chatThreadSummariesView: 'chat_thread_summaries',
  merchantStoreMemberships: 'store_memberships'
} as const

export const SHOWCASE_BUCKETS = {
  dishImages: 'dish-images',
  storeImages: 'store-images',
  announcementImages: 'announcement-images',
  chatImages: 'chat-images'
} as const

export const SHOWCASE_EDGE_FUNCTIONS = {
  sendPush: 'send_push'
} as const

export const ENABLE_CHAT_CLOUD = true
export const ENABLE_CHAT_RELAY_ONLY = false

export function readShowcaseEnv(name: string): string {
  switch (name) {
    case 'NEXT_PUBLIC_APP_CLOUD_SUPABASE_URL':
      return process.env.NEXT_PUBLIC_APP_CLOUD_SUPABASE_URL || ''

    case 'NEXT_PUBLIC_APP_CLOUD_SUPABASE_PUBLISHABLE_KEY':
      return process.env.NEXT_PUBLIC_APP_CLOUD_SUPABASE_PUBLISHABLE_KEY || ''

    case 'NEXT_PUBLIC_APP_CLOUD_SUPABASE_ANON_KEY':
      return process.env.NEXT_PUBLIC_APP_CLOUD_SUPABASE_ANON_KEY || ''

    case 'NEXT_PUBLIC_SUPABASE_URL':
      return process.env.NEXT_PUBLIC_SUPABASE_URL || ''

    case 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY':
      return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''

    case 'NEXT_PUBLIC_SUPABASE_ANON_KEY':
      return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    case 'NEXT_PUBLIC_SUPABASE_KEY':
      return process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

    default: {
      const source = typeof process !== 'undefined' ? process.env : undefined
      return source?.[name] || ''
    }
  }
}

export function resolveShowcaseSupabaseUrl(explicit?: string | null): string {
  return (
    explicit ||
    readShowcaseEnv('NEXT_PUBLIC_APP_CLOUD_SUPABASE_URL') ||
    readShowcaseEnv('APP_CLOUD_SUPABASE_URL') ||
    readShowcaseEnv('NEXT_PUBLIC_SUPABASE_URL') ||
    readShowcaseEnv('SUPABASE_URL') ||
    ''
  ).replace(/\/+$/, '')
}

export function resolveShowcaseSupabaseAnonKey(explicit?: string | null): string {
  return (
    explicit ||
    readShowcaseEnv('NEXT_PUBLIC_APP_CLOUD_SUPABASE_PUBLISHABLE_KEY') ||
    readShowcaseEnv('NEXT_PUBLIC_APP_CLOUD_SUPABASE_ANON_KEY') ||
    readShowcaseEnv('APP_CLOUD_SUPABASE_ANON_KEY') ||
    readShowcaseEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') ||
    readShowcaseEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
    readShowcaseEnv('NEXT_PUBLIC_SUPABASE_KEY') ||
    readShowcaseEnv('SUPABASE_ANON_KEY') ||
    ''
  )
}

function trimTrailingSlashes(value: string): string {
  return String(value || '').replace(/\/+$/, '')
}

function trimLeadingSlashes(value: string): string {
  return String(value || '').replace(/^\/+/, '')
}

function trimSlashes(value: string): string {
  return String(value || '').replace(/^\/+/, '').replace(/\/+$/, '')
}

function normalizePathPart(value: string): string {
  return trimSlashes(value).split('/').map(part => encodeURIComponent(part)).join('/')
}

export function authToken(actor: ShowcaseCloudAuthActor): string {
  if (actor === ShowcaseCloudAuthActor.MERCHANT) {
    return requireMerchantAccessToken()
  }

  return ''
}

export function requestScopeHeaders(
  storeId: string = currentStoreId(),
  clientId: string | null = null
): Record<string, string> {
  const result: Record<string, string> = {}
  const sid = requireStoreId(storeId)

  result[ShowcaseCloudHeaders.NDJC_STORE_ID] = sid

  const cid = String(clientId || '').trim()
  if (cid) {
    result[ShowcaseCloudHeaders.NDJC_CLIENT_ID] = cid
  }

  return result
}

export function restUrl(baseUrl: string, path: string): string {
  const base = trimTrailingSlashes(baseUrl)
  const clean = trimLeadingSlashes(path)
  return `${base}/rest/v1/${clean}`
}

export function functionUrl(baseUrl: string, path: string): string {
  const base = trimTrailingSlashes(baseUrl)
  const clean = trimLeadingSlashes(path)
  return `${base}/functions/v1/${clean}`
}

export function authUrl(baseUrl: string, path: string): string {
  const base = trimTrailingSlashes(baseUrl)
  const clean = trimLeadingSlashes(path)
  return `${base}/auth/v1/${clean}`
}

export function storageObjectUrl(baseUrl: string, bucket: string, objectPath: string): string {
  const base = trimTrailingSlashes(baseUrl)
  const b = trimSlashes(bucket)
  const p = normalizePathPart(objectPath)
  return `${base}/storage/v1/object/${encodeURIComponent(b)}/${p}`
}

export function storagePublicObjectUrl(baseUrl: string, bucket: string, objectPath: string): string {
  const base = trimTrailingSlashes(baseUrl)
  const b = trimSlashes(bucket)
  const p = normalizePathPart(objectPath)
  return `${base}/storage/v1/object/public/${encodeURIComponent(b)}/${p}`
}

export function currentStoreId(): string {
  return requireStoreId(currentStoreIdFromSession())
}

export function requireStoreId(storeId: string | null | undefined): string {
  const value = String(storeId || '').trim()

  if (value) {
    return value
  }

  return requireStoreIdFromSession()
}

export function createShowcaseCloudRepositoryConfig(defaultStoreId?: string | null) {
  return {
    supabaseUrl: resolveShowcaseSupabaseUrl(),
    supabaseAnonKey: resolveShowcaseSupabaseAnonKey(),
    edgeFunctionBaseUrl: resolveShowcaseSupabaseUrl(),
    defaultStoreId: defaultStoreId || currentStoreId(),
    tables: {
      stores: SHOWCASE_TABLES.stores,
      storeProfiles: SHOWCASE_TABLES.storeProfiles,
      categories: SHOWCASE_TABLES.categories,
      dishes: SHOWCASE_TABLES.dishes,
      dishImages: SHOWCASE_TABLES.dishImages,
      announcements: SHOWCASE_TABLES.announcements,
      appointmentSettings: SHOWCASE_TABLES.appointmentSettings,
      appointmentRequests: SHOWCASE_TABLES.appointmentRequests,
      chatConversations: SHOWCASE_TABLES.chatConversations,
      chatMessages: SHOWCASE_TABLES.chatMessages,
      chatThreadSummariesView: SHOWCASE_TABLES.chatThreadSummariesView,
      merchantStoreMemberships: SHOWCASE_TABLES.merchantStoreMemberships,
      pushDevices: SHOWCASE_TABLES.pushDevices
    },
    buckets: {
      dishImages: SHOWCASE_BUCKETS.dishImages,
      storeImages: SHOWCASE_BUCKETS.storeImages,
      announcementImages: SHOWCASE_BUCKETS.announcementImages,
      chatImages: SHOWCASE_BUCKETS.chatImages
    },
    edgeFunctions: {
      sendPush: SHOWCASE_EDGE_FUNCTIONS.sendPush
    }
  }
}