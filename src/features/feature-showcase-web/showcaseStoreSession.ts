import type { MerchantAuthSession, ShowcaseCloudRepository } from './showcaseCloudRepository'
import {
  normalizeMerchantSession,
  shouldRefreshMerchantSession,
  updateMerchantLoginName as updateMerchantLoginNameInSession
} from './showcaseMerchantSessionManager'

const LOCAL_FALLBACK_STORE_ID = 'store_showcase_trial_000001'

function normalizeStoreId(value: unknown): string | null {
  const text = String(value ?? '').trim()
  return text && text.toLowerCase() !== 'null' ? text : null
}

function resolveDefaultStoreId(): string {
  return (
    normalizeStoreId(process.env.NEXT_PUBLIC_APP_DEFAULT_STORE_ID) ||
    LOCAL_FALLBACK_STORE_ID
  )
}

let currentStoreIdValue: string = resolveDefaultStoreId()
let merchantAccessTokenValue: string | null = null
let merchantRefreshTokenValue: string | null = null
let merchantAuthUserIdValue: string | null = null
let merchantLoginNameValue: string | null = null
let merchantExpiresAtValue: number | null = null

function normalizeNullableString(value: unknown): string | null {
  const text = String(value ?? '').trim()
  if (!text || text.toLowerCase() === 'null') return null
  return text
}

function normalizeExpiresAt(value: unknown): number | null {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? Math.trunc(numberValue) : null
}

export function currentStoreId(): string {
  return currentStoreIdValue
}

export function setCurrentStoreId(storeId: string): void {
  currentStoreIdValue = normalizeStoreId(storeId) || resolveDefaultStoreId()
}

export function requireStoreId(): string {
  const value = currentStoreId().trim()

  if (!value) {
    throw new Error('storeId is required')
  }

  return value
}

export function setMerchantSession(
  accessToken: string,
  refreshToken: string | null | undefined,
  authUserId: string,
  loginName: string,
  expiresAt: number
): void {
  merchantAccessTokenValue = String(accessToken || '').trim()
  merchantRefreshTokenValue = normalizeNullableString(refreshToken)
  merchantAuthUserIdValue = String(authUserId || '').trim()
  merchantLoginNameValue = String(loginName || '').trim()
  merchantExpiresAtValue = normalizeExpiresAt(expiresAt)
}

export function setMerchantSessionFromAuthSession(session: MerchantAuthSession | null): void {
  const normalized = normalizeMerchantSession(session)

  if (!normalized) {
    clearMerchantSession()
    return
  }

  setMerchantSession(
    normalized.accessToken,
    normalized.refreshToken,
    normalized.authUserId,
    normalized.loginName,
    normalized.expiresAt
  )
}

export function clearMerchantSession(): void {
  merchantAccessTokenValue = null
  merchantRefreshTokenValue = null
  merchantAuthUserIdValue = null
  merchantLoginNameValue = null
  merchantExpiresAtValue = null
}

export function isMerchantLoggedIn(): boolean {
  return Boolean(
    merchantAccessTokenValue?.trim() &&
    merchantAuthUserIdValue?.trim()
  )
}

export function requireMerchantAccessToken(): string {
  const value = merchantAccessTokenValue?.trim() || ''

  if (!value) {
    throw new Error('Merchant access token is required')
  }

  return value
}

export function currentMerchantAccessToken(): string | null {
  return normalizeNullableString(merchantAccessTokenValue)
}

export function currentMerchantRefreshToken(): string | null {
  return normalizeNullableString(merchantRefreshTokenValue)
}

export function currentMerchantAuthUserId(): string | null {
  return normalizeNullableString(merchantAuthUserIdValue)
}

export function currentMerchantLoginName(): string | null {
  return normalizeNullableString(merchantLoginNameValue)
}

export function currentMerchantExpiresAt(): number | null {
  return merchantExpiresAtValue
}

export function currentMerchantSession(): MerchantAuthSession | null {
  const accessToken = currentMerchantAccessToken()
  const authUserId = currentMerchantAuthUserId()
  const loginName = currentMerchantLoginName()

  if (!accessToken || !authUserId || !loginName) return null

  return {
    accessToken,
    refreshToken: currentMerchantRefreshToken(),
    authUserId,
    loginName,
    expiresAt: merchantExpiresAtValue || 0
  }
}

export function shouldRefresh(refreshWindowSeconds = 120): boolean {
  return shouldRefreshMerchantSession(currentMerchantSession(), refreshWindowSeconds)
}

export function updateMerchantLoginName(loginName: string): void {
  const next = updateMerchantLoginNameInSession(currentMerchantSession(), loginName)

  if (!next) {
    merchantLoginNameValue = String(loginName || '').trim()
    return
  }

  setMerchantSessionFromAuthSession(next)
}

export function bindMerchantSessionToRepository(repository: ShowcaseCloudRepository): void {
  repository.setMerchantSession(currentMerchantSession())
}