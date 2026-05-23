import type { MerchantAuthSession } from './showcaseCloudRepository'

const SHOWCASE_MERCHANT_SESSION_KEY = 'ndjc_showcase_merchant_session'
const SHOWCASE_LOGIN_REMEMBER_KEY = 'ndjc_showcase_login_remember'
const SHOWCASE_LAST_LOGIN_NAME_KEY = 'ndjc_showcase_last_login_name'

function isBrowser(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return typeof window.localStorage !== 'undefined'
  } catch {
    return false
  }
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

function readJsonRecordFromLocalStorage(key: string): Record<string, unknown> | null {
  if (!isBrowser()) return null

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null
  } catch {
    return null
  }
}

function removeLocalStorageItem(key: string): void {
  if (!isBrowser()) return

  try {
    window.localStorage.removeItem(key)
  } catch {
    // localStorage persistence is best effort
  }
}

function writeLocalStorageItem(key: string, value: string): void {
  if (!isBrowser()) return

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // localStorage persistence is best effort
  }
}

function readLegacyMerchantLoginName(): string {
  const record = readJsonRecordFromLocalStorage(SHOWCASE_MERCHANT_SESSION_KEY)
  const loginName = String(record?.loginName || '').trim()
  return loginName
}

function migrateLegacyMerchantLoginName(): string {
  const existing = readLastMerchantLoginName()
  if (existing) return existing

  const legacyLoginName = readLegacyMerchantLoginName()
  if (legacyLoginName) {
    writeLastMerchantLoginName(legacyLoginName)
  }

  return legacyLoginName
}

export function clearLegacyMerchantSession(): void {
  removeLocalStorageItem(SHOWCASE_MERCHANT_SESSION_KEY)
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
  writeLocalStorageItem(SHOWCASE_LOGIN_REMEMBER_KEY, value ? 'true' : 'false')
}

export function readLastMerchantLoginName(): string {
  if (!isBrowser()) return ''

  try {
    const value = String(window.localStorage.getItem(SHOWCASE_LAST_LOGIN_NAME_KEY) || '').trim()
    if (value) return value

    return readLegacyMerchantLoginName()
  } catch {
    return ''
  }
}

export function writeLastMerchantLoginName(loginNameInput: string): void {
  const loginName = String(loginNameInput || '').trim()

  if (!loginName) {
    removeLocalStorageItem(SHOWCASE_LAST_LOGIN_NAME_KEY)
    return
  }

  writeLocalStorageItem(SHOWCASE_LAST_LOGIN_NAME_KEY, loginName)
}

export function clearLastMerchantLoginName(): void {
  removeLocalStorageItem(SHOWCASE_LAST_LOGIN_NAME_KEY)
}

export function readMerchantSession(): MerchantAuthSession | null {
  migrateLegacyMerchantLoginName()
  clearLegacyMerchantSession()
  return null
}

export function writeMerchantSession(session: MerchantAuthSession | null): void {
  if (session?.loginName) {
    writeLastMerchantLoginName(session.loginName)
  }

  clearLegacyMerchantSession()
}

export function clearPersistedMerchantSession(clearRememberMe: boolean): void {
  clearLegacyMerchantSession()

  if (clearRememberMe) {
    writeRememberMe(false)
  }
}

export function persistCurrentMerchantSession(
  session: MerchantAuthSession | null,
  remember: boolean
): void {
  writeRememberMe(remember)

  if (session?.loginName) {
    writeLastMerchantLoginName(session.loginName)
  }

  clearLegacyMerchantSession()
}

export function restoreMerchantSessionFromStorage(): MerchantAuthSession | null {
  migrateLegacyMerchantLoginName()
  clearLegacyMerchantSession()
  return null
}

export function isMerchantSessionLoggedIn(session: MerchantAuthSession | null): boolean {
  return Boolean(session?.accessToken?.trim() && session?.authUserId?.trim())
}

export function updateMerchantLoginName(
  session: MerchantAuthSession | null,
  loginName: string
): MerchantAuthSession | null {
  const nextLoginName = String(loginName || '').trim()
  if (nextLoginName) {
    writeLastMerchantLoginName(nextLoginName)
  }

  if (!session) return null

  return {
    ...session,
    loginName: nextLoginName
  }
}