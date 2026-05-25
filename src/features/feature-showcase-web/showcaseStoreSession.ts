import type { MerchantAuthSession, ShowcaseCloudRepository } from './showcaseCloudRepository'
import {
  normalizeMerchantSession,
  updateMerchantLoginName as updateMerchantLoginNameInSession
} from './showcaseMerchantAuthPreferences'

const LOCAL_DEVELOPMENT_STORE_ID = 'store_showcase_trial_000001'

function normalizeStoreId(value: unknown): string | null {
  const text = String(value ?? '').trim()
  return text && text.toLowerCase() !== 'null' ? text : null
}

function canUseDevelopmentDefaultStoreId(): boolean {
  return process.env.NODE_ENV !== 'production'
}

function resolveDefaultStoreId(): string | null {
  const configuredStoreId = normalizeStoreId(process.env.NEXT_PUBLIC_APP_DEFAULT_STORE_ID)

  if (configuredStoreId) {
    return configuredStoreId
  }

  if (canUseDevelopmentDefaultStoreId()) {
    return LOCAL_DEVELOPMENT_STORE_ID
  }

  return null
}

let currentStoreIdValue: string | null = resolveDefaultStoreId()
let merchantAccessTokenValue: string | null = null
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
  return currentStoreIdValue || ''
}

export function setCurrentStoreId(storeId: string): void {
  const normalizedStoreId = normalizeStoreId(storeId) || resolveDefaultStoreId()

  if (!normalizedStoreId) {
    throw new Error('storeId is required')
  }

  currentStoreIdValue = normalizedStoreId
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
  authUserId: string,
  loginName: string,
  expiresAt: number
): void {
  merchantAccessTokenValue = String(accessToken || '').trim()
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
    normalized.authUserId,
    normalized.loginName,
    normalized.expiresAt
  )
}

export function clearMerchantSession(): void {
  merchantAccessTokenValue = null
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
  const accessToken = normalizeNullableString(merchantAccessTokenValue)
  const authUserId = currentMerchantAuthUserId()
  const loginName = currentMerchantLoginName()
  const storeId = currentStoreId().trim()

  if (!accessToken || !authUserId || !loginName) return null

  return {
    accessToken,
    refreshToken: null,
    authUserId,
    loginName,
    expiresAt: merchantExpiresAtValue || 0,
    storeId: storeId || null
  }
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