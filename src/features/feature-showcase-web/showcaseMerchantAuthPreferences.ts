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

function normalizeStoreId(value: unknown): string | null {
  const text = String(value ?? '').trim()
  if (!text || text.toLowerCase() === 'null') return null
  return text
}

function normalizeMerchantExpiresAt(value: unknown): number {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? Math.trunc(numberValue) : 0
}

function scopedStorageKey(baseKey: string, storeIdInput?: string | null): string {
  const storeId = normalizeStoreId(storeIdInput)
  return storeId ? `${baseKey}:${storeId}` : baseKey
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
    expiresAt: normalizeMerchantExpiresAt(record.expiresAt),
    storeId: normalizeStoreId(record.storeId)
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

export function clearLegacyMerchantSession(): void {
  removeLocalStorageItem(SHOWCASE_MERCHANT_SESSION_KEY)
}

export function readRememberMe(storeIdInput?: string | null): boolean {
  if (!isBrowser()) return false

  try {
    return window.localStorage.getItem(scopedStorageKey(SHOWCASE_LOGIN_REMEMBER_KEY, storeIdInput)) === 'true'
  } catch {
    return false
  }
}

export function writeRememberMe(storeIdInput: string | null | undefined, value: boolean): void {
  writeLocalStorageItem(scopedStorageKey(SHOWCASE_LOGIN_REMEMBER_KEY, storeIdInput), value ? 'true' : 'false')
}

export function readLastMerchantLoginName(storeIdInput?: string | null): string {
  if (!isBrowser()) return ''

  try {
    const scopedValue = String(window.localStorage.getItem(scopedStorageKey(SHOWCASE_LAST_LOGIN_NAME_KEY, storeIdInput)) || '').trim()
    if (scopedValue) return scopedValue

    if (!normalizeStoreId(storeIdInput)) {
      const legacyValue = String(window.localStorage.getItem(SHOWCASE_LAST_LOGIN_NAME_KEY) || '').trim()
      if (legacyValue) return legacyValue

      return readLegacyMerchantLoginName()
    }

    return ''
  } catch {
    return ''
  }
}

export function writeLastMerchantLoginName(storeIdInput: string | null | undefined, loginNameInput: string): void {
  const loginName = String(loginNameInput || '').trim()
  const key = scopedStorageKey(SHOWCASE_LAST_LOGIN_NAME_KEY, storeIdInput)

  if (!loginName) {
    removeLocalStorageItem(key)
    return
  }

  writeLocalStorageItem(key, loginName)
}

export function clearLastMerchantLoginName(storeIdInput?: string | null): void {
  removeLocalStorageItem(scopedStorageKey(SHOWCASE_LAST_LOGIN_NAME_KEY, storeIdInput))
}

export function readMerchantSession(storeIdInput?: string | null): MerchantAuthSession | null {
  const storeId = normalizeStoreId(storeIdInput)
  const session = normalizeMerchantSession(
    readJsonRecordFromLocalStorage(scopedStorageKey(SHOWCASE_MERCHANT_SESSION_KEY, storeId))
  )

  if (!session) {
    clearLegacyMerchantSession()
    return null
  }

  if (storeId && session.storeId && session.storeId !== storeId) {
    removeLocalStorageItem(scopedStorageKey(SHOWCASE_MERCHANT_SESSION_KEY, storeId))
    return null
  }

  clearLegacyMerchantSession()
  return session
}

export function writeMerchantSession(storeIdInput: string | null | undefined, session: MerchantAuthSession | null): void {
  const storeId = normalizeStoreId(storeIdInput)
  const key = scopedStorageKey(SHOWCASE_MERCHANT_SESSION_KEY, storeId)

  if (!session) {
    removeLocalStorageItem(key)
    clearLegacyMerchantSession()
    return
  }

  const normalized = normalizeMerchantSession({
    ...session,
    storeId
  })

  if (!normalized) {
    removeLocalStorageItem(key)
    clearLegacyMerchantSession()
    return
  }

  writeLocalStorageItem(key, JSON.stringify(normalized))

  if (normalized.loginName) {
    writeLastMerchantLoginName(storeId, normalized.loginName)
  }

  clearLegacyMerchantSession()
}

export function clearPersistedMerchantSession(
  storeIdInput: string | null | undefined,
  clearRememberMe: boolean
): void {
  const storeId = normalizeStoreId(storeIdInput)

  removeLocalStorageItem(scopedStorageKey(SHOWCASE_MERCHANT_SESSION_KEY, storeId))
  clearLegacyMerchantSession()

  if (clearRememberMe) {
    writeRememberMe(storeId, false)
  }
}

export function persistCurrentMerchantSession(
  storeIdInput: string | null | undefined,
  session: MerchantAuthSession | null,
  remember: boolean
): void {
  const storeId = normalizeStoreId(storeIdInput)

  writeRememberMe(storeId, remember)

  if (!remember || !session) {
    removeLocalStorageItem(scopedStorageKey(SHOWCASE_MERCHANT_SESSION_KEY, storeId))
    clearLegacyMerchantSession()
    return
  }

  writeMerchantSession(storeId, {
    ...session,
    storeId
  })
}

export function restoreMerchantSessionFromStorage(storeIdInput?: string | null): MerchantAuthSession | null {
  const session = readMerchantSession(storeIdInput)
  clearLegacyMerchantSession()
  return session
}

export function isMerchantSessionLoggedIn(session: MerchantAuthSession | null): boolean {
  return Boolean(session?.accessToken?.trim() && session?.authUserId?.trim())
}

export function updateMerchantLoginName(
  session: MerchantAuthSession | null,
  loginName: string
): MerchantAuthSession | null {
  const nextLoginName = String(loginName || '').trim()

  if (session?.storeId) {
    writeLastMerchantLoginName(session.storeId, nextLoginName)
  }

  if (!session) return null

  return {
    ...session,
    loginName: nextLoginName
  }
}