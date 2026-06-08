import {
  SHOWCASE_TABLES,
  resolveShowcaseSupabaseAnonKey,
  resolveShowcaseSupabaseUrl
} from '@/features/feature-showcase-web/showcaseCloudConfig'

export type PwaPrivacyCloudProfile = {
  storeId: string
  appName: string
  merchantEmail: string
}

function normalizeText(value: unknown): string {
  return String(value ?? '').trim()
}

function toFirstObject(value: unknown): Record<string, unknown> | null {
  if (!Array.isArray(value)) {
    return null
  }

  const first = value[0]

  if (!first || typeof first !== 'object' || Array.isArray(first)) {
    return null
  }

  return first as Record<string, unknown>
}

export async function readPwaPrivacyCloudProfile(
  storeIdInput: string
): Promise<PwaPrivacyCloudProfile | null> {
  const storeId = normalizeText(storeIdInput)

  if (!storeId) {
    return null
  }

  const supabaseUrl = resolveShowcaseSupabaseUrl()
  const supabaseAnonKey = resolveShowcaseSupabaseAnonKey()

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  const query = [
    'select=store_id,app_name,merchant_email',
    `store_id=${encodeURIComponent(`eq.${storeId}`)}`,
    'limit=1'
  ].join('&')

  const url = `${supabaseUrl}/rest/v1/${SHOWCASE_TABLES.storePwaProfiles}?${query}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Accept: 'application/json',
        'x-ndjc-store-id': storeId
      }
    })

    if (!response.ok) {
      return null
    }

    const json = await response.json()
    const row = toFirstObject(json)

    if (!row) {
      return null
    }

    return {
      storeId: normalizeText(row.store_id) || storeId,
      appName: normalizeText(row.app_name),
      merchantEmail: normalizeText(row.merchant_email)
    }
  } catch {
    return null
  }
}