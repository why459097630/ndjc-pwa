import type { MerchantAuthSession } from './showcaseCloudRepository'

const SHOWCASE_MERCHANT_SESSION_KEY = 'ndjc_showcase_merchant_session'
const SHOWCASE_LOGIN_REMEMBER_KEY = 'ndjc_showcase_login_remember'

let merchantRefreshPromise: Promise<MerchantSessionRefreshResult> | null = null

export type MerchantSessionRefreshResult = {
  ok: boolean
  session: MerchantAuthSession | null
}

export type EnsureValidMerchantAccessTokenInput = {
  session: MerchantAuthSession | null
  refreshSession: (session: MerchantAuthSession) => Promise<MerchantSessionRefreshResult>
  persistSession?: (session: MerchantAuthSession) => void
}

function isBrowser(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

function normalizeNullableString(value: unknown): string | null {
  const text = String(value ?? '').trim()
  if (!text || text.toLowerCase() === 'null') return null
  return text
}

function normalizeMerchantExpiresAt(value: unknown): number {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? Math.trunc(numberValue) : 0
}

export function normalizeMerchantSession(value: unknown): MerchantAuthSession | null {
  if (!value || typeof value !== 'object') return null

  const record = value as Record<string, unknown>
  const accessToken = String(record.accessToken || '').trim()
  const authUserId = String(record.authUserId || '').trim()
  const loginName = String(record.loginName || '').trim()

  if (!accessToken || !authUserId || !loginName) return null

  return {
    accessToken,
    refreshToken: normalizeNullableString(record.refreshToken),
    authUserId,
    loginName,
    expiresAt: normalizeMerchantExpiresAt(record.expiresAt)
  }
}

export function readRememberMe(): boolean {
  if (!isBrowser()) return false

  try {
    return window.localStorage.getItem(SHOWCASE_LOGIN_REMEMBER_KEY) === 'true'
  } catch {
    return false
  }
}

export function writeRememberMe(value: boolean): void {
  if (!isBrowser()) return

  try {
    window.localStorage.setItem(SHOWCASE_LOGIN_REMEMBER_KEY, value ? 'true' : 'false')
  } catch {
    // localStorage persistence is best effort
  }
}

export function readMerchantSession(): MerchantAuthSession | null {
  if (!isBrowser()) return null

  try {
    const raw = window.localStorage.getItem(SHOWCASE_MERCHANT_SESSION_KEY)
    if (!raw) return null

    return normalizeMerchantSession(JSON.parse(raw))
  } catch {
    return null
  }
}

export function writeMerchantSession(session: MerchantAuthSession | null): void {
  if (!isBrowser()) return

  try {
    if (!session) {
      window.localStorage.removeItem(SHOWCASE_MERCHANT_SESSION_KEY)
      return
    }

    const normalized = normalizeMerchantSession(session)
    if (!normalized) {
      window.localStorage.removeItem(SHOWCASE_MERCHANT_SESSION_KEY)
      return
    }

    window.localStorage.setItem(SHOWCASE_MERCHANT_SESSION_KEY, JSON.stringify(normalized))
  } catch {
    // localStorage persistence is best effort
  }
}

export function clearPersistedMerchantSession(clearRememberMe: boolean): void {
  writeMerchantSession(null)

  if (clearRememberMe) {
    writeRememberMe(false)
  }
}

export function persistCurrentMerchantSession(
  session: MerchantAuthSession | null,
  remember: boolean
): void {
  if (!session) {
    writeMerchantSession(null)
    return
  }

  if (remember) {
    writeRememberMe(true)
    writeMerchantSession(session)
    return
  }

  writeMerchantSession(null)
}

export function restoreMerchantSessionFromStorage(): MerchantAuthSession | null {
  const rememberMe = readRememberMe()
  const session = readMerchantSession()

  if (
    rememberMe &&
    session?.accessToken &&
    session.authUserId &&
    session.loginName
  ) {
    return session
  }

  return null
}

export function isMerchantSessionLoggedIn(session: MerchantAuthSession | null): boolean {
  return Boolean(session?.accessToken?.trim() && session?.authUserId?.trim())
}

export function shouldRefreshMerchantSession(
  session: MerchantAuthSession | null,
  refreshWindowSeconds = 120
): boolean {
  if (!session?.expiresAt) return true

  return nowSeconds() >= session.expiresAt - refreshWindowSeconds
}

export function updateMerchantLoginName(
  session: MerchantAuthSession | null,
  loginName: string
): MerchantAuthSession | null {
  if (!session) return null

  return {
    ...session,
    loginName: loginName.trim()
  }
}

async function refreshMerchantSessionWithLock(
  session: MerchantAuthSession,
  refreshSession: (session: MerchantAuthSession) => Promise<MerchantSessionRefreshResult>
): Promise<MerchantSessionRefreshResult> {
  if (merchantRefreshPromise) {
    return merchantRefreshPromise
  }

  merchantRefreshPromise = refreshSession(session)

  try {
    return await merchantRefreshPromise
  } finally {
    merchantRefreshPromise = null
  }
}

export async function ensureValidMerchantAccessToken(
  input: EnsureValidMerchantAccessTokenInput
): Promise<MerchantAuthSession | null> {
  const session = normalizeMerchantSession(input.session)
  if (!session) return null

  if (session.accessToken && !shouldRefreshMerchantSession(session)) {
    return session
  }

  const refreshed = await refreshMerchantSessionWithLock(session, input.refreshSession)
  if (!refreshed.ok || !refreshed.session) return null

  const normalized = normalizeMerchantSession(refreshed.session)
  if (!normalized) return null

  input.persistSession?.(normalized)
  return normalized
}