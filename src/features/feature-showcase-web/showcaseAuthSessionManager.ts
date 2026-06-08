'use client'

import {
  createClient,
  type AuthChangeEvent,
  type Session,
  type SupabaseClient,
  type User
} from '@supabase/supabase-js'
import {
  resolveShowcaseSupabaseAnonKey,
  resolveShowcaseSupabaseUrl
} from './showcaseCloudConfig'

const SHOWCASE_SUPABASE_AUTH_STORAGE_KEY = 'ndjc_showcase_supabase_auth'
const SHOWCASE_AUTH_REFRESH_EARLY_SECONDS = 300

let showcaseSupabaseClient: SupabaseClient | null = null
let showcaseAuthRefreshPromise: Promise<ShowcaseAuthSessionSnapshot | null> | null = null

export type ShowcaseAuthSessionSnapshot = {
  accessToken: string
  authUserId: string
  email: string | null
  expiresAt: number | null
  session: Session
}

export type ShowcaseAuthUserSnapshot = {
  authUserId: string
  email: string | null
  user: User
}

export type ShowcaseAuthStateChangeHandler = (
  event: AuthChangeEvent,
  session: ShowcaseAuthSessionSnapshot | null
) => void

export type ShowcaseAuthUnsubscribe = {
  unsubscribe: () => void
}

export class ShowcaseAuthSessionError extends Error {
  code: string
  status: number | null

  constructor(message: string, code: string, status: number | null = null) {
    super(message)
    this.name = 'ShowcaseAuthSessionError'
    this.code = code
    this.status = status
  }
}

function normalizeNullableText(value: unknown): string | null {
  const text = String(value ?? '').trim()
  return text ? text : null
}

function normalizeRequiredText(value: unknown): string {
  return String(value ?? '').trim()
}

function requireShowcaseAuthConfig(): {
  supabaseUrl: string
  supabaseAnonKey: string
} {
  const supabaseUrl = resolveShowcaseSupabaseUrl()
  const supabaseAnonKey = resolveShowcaseSupabaseAnonKey()

  if (!supabaseUrl) {
    throw new ShowcaseAuthSessionError(
      'Supabase URL is missing.',
      'missing_supabase_url'
    )
  }

  if (!supabaseAnonKey) {
    throw new ShowcaseAuthSessionError(
      'Supabase anon key is missing.',
      'missing_supabase_anon_key'
    )
  }

  return {
    supabaseUrl,
    supabaseAnonKey
  }
}

function toShowcaseAuthSessionSnapshot(session: Session | null): ShowcaseAuthSessionSnapshot | null {
  if (!session?.access_token || !session.user?.id) {
    return null
  }

  return {
    accessToken: session.access_token,
    authUserId: session.user.id,
    email: normalizeNullableText(session.user.email),
    expiresAt: typeof session.expires_at === 'number' ? session.expires_at : null,
    session
  }
}

function isShowcaseAuthSessionExpiringSoon(session: ShowcaseAuthSessionSnapshot): boolean {
  if (typeof session.expiresAt !== 'number') {
    return false
  }

  const nowSeconds = Math.floor(Date.now() / 1000)
  return session.expiresAt <= nowSeconds + SHOWCASE_AUTH_REFRESH_EARLY_SECONDS
}

function toShowcaseAuthUserSnapshot(user: User | null): ShowcaseAuthUserSnapshot | null {
  if (!user?.id) {
    return null
  }

  return {
    authUserId: user.id,
    email: normalizeNullableText(user.email),
    user
  }
}

export function getShowcaseSupabaseClient(): SupabaseClient {
  if (showcaseSupabaseClient) {
    return showcaseSupabaseClient
  }

  const {
    supabaseUrl,
    supabaseAnonKey
  } = requireShowcaseAuthConfig()

  showcaseSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: SHOWCASE_SUPABASE_AUTH_STORAGE_KEY
    },
    global: {
      headers: {
        'x-ndjc-client': 'showcase-pwa'
      }
    }
  })

  return showcaseSupabaseClient
}

export async function signInShowcaseAuthWithPassword(input: {
  email: string
  password: string
}): Promise<ShowcaseAuthSessionSnapshot> {
  const email = normalizeRequiredText(input.email)
  const password = String(input.password ?? '')

  if (!email || !password) {
    throw new ShowcaseAuthSessionError(
      'Email and password are required.',
      'missing_credentials'
    )
  }

  const {
    data,
    error
  } = await getShowcaseSupabaseClient().auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw new ShowcaseAuthSessionError(
      error.message || 'Invalid account or password.',
      error.name || 'auth_sign_in_failed',
      typeof error.status === 'number' ? error.status : null
    )
  }

  const snapshot = toShowcaseAuthSessionSnapshot(data.session)

  if (!snapshot) {
    throw new ShowcaseAuthSessionError(
      'Auth session is missing after sign in.',
      'missing_session_after_sign_in'
    )
  }

  return snapshot
}

export async function signOutShowcaseAuth(): Promise<void> {
  const {
    error
  } = await getShowcaseSupabaseClient().auth.signOut({
    scope: 'local'
  })

  if (error) {
    throw new ShowcaseAuthSessionError(
      error.message || 'Failed to sign out.',
      error.name || 'auth_sign_out_failed',
      typeof error.status === 'number' ? error.status : null
    )
  }
}

export async function getShowcaseAuthSession(): Promise<ShowcaseAuthSessionSnapshot | null> {
  const {
    data,
    error
  } = await getShowcaseSupabaseClient().auth.getSession()

  if (error) {
    throw new ShowcaseAuthSessionError(
      error.message || 'Failed to read auth session.',
      error.name || 'auth_get_session_failed',
      typeof error.status === 'number' ? error.status : null
    )
  }

  return toShowcaseAuthSessionSnapshot(data.session)
}

async function refreshShowcaseAuthSessionOnce(): Promise<ShowcaseAuthSessionSnapshot | null> {
  const {
    data,
    error
  } = await getShowcaseSupabaseClient().auth.refreshSession()

  if (error) {
    throw new ShowcaseAuthSessionError(
      error.message || 'Failed to refresh auth session.',
      error.name || 'auth_refresh_session_failed',
      typeof error.status === 'number' ? error.status : null
    )
  }

  return toShowcaseAuthSessionSnapshot(data.session)
}

export async function refreshShowcaseAuthSession(): Promise<ShowcaseAuthSessionSnapshot | null> {
  if (showcaseAuthRefreshPromise) {
    return showcaseAuthRefreshPromise
  }

  showcaseAuthRefreshPromise = refreshShowcaseAuthSessionOnce().finally(() => {
    showcaseAuthRefreshPromise = null
  })

  return showcaseAuthRefreshPromise
}

export async function requireShowcaseAuthSession(): Promise<ShowcaseAuthSessionSnapshot> {
  const session = await getShowcaseAuthSession()

  if (!session) {
    throw new ShowcaseAuthSessionError(
      'Auth session is missing.',
      'missing_auth_session'
    )
  }

  return session
}

export async function getFreshShowcaseAuthSession(): Promise<ShowcaseAuthSessionSnapshot | null> {
  const session = await getShowcaseAuthSession()

  if (!session) {
    return null
  }

  if (!isShowcaseAuthSessionExpiringSoon(session)) {
    return session
  }

  return refreshShowcaseAuthSession()
}

export async function requireFreshShowcaseAuthSession(): Promise<ShowcaseAuthSessionSnapshot> {
  const session = await getFreshShowcaseAuthSession()

  if (!session) {
    throw new ShowcaseAuthSessionError(
      'Auth session is missing.',
      'missing_auth_session'
    )
  }

  return session
}

export async function getShowcaseAccessToken(): Promise<string | null> {
  const session = await getShowcaseAuthSession()
  return session?.accessToken || null
}

export async function requireShowcaseAccessToken(): Promise<string> {
  const accessToken = await getShowcaseAccessToken()

  if (!accessToken) {
    throw new ShowcaseAuthSessionError(
      'Auth access token is missing.',
      'missing_access_token'
    )
  }

  return accessToken
}

export async function getFreshShowcaseAccessToken(): Promise<string | null> {
  const session = await getFreshShowcaseAuthSession()
  return session?.accessToken || null
}

export async function requireFreshShowcaseAccessToken(): Promise<string> {
  const accessToken = await getFreshShowcaseAccessToken()

  if (!accessToken) {
    throw new ShowcaseAuthSessionError(
      'Auth access token is missing.',
      'missing_access_token'
    )
  }

  return accessToken
}

export async function getShowcaseAuthUser(): Promise<ShowcaseAuthUserSnapshot | null> {
  const {
    data,
    error
  } = await getShowcaseSupabaseClient().auth.getUser()

  if (error) {
    throw new ShowcaseAuthSessionError(
      error.message || 'Failed to read auth user.',
      error.name || 'auth_get_user_failed',
      typeof error.status === 'number' ? error.status : null
    )
  }

  return toShowcaseAuthUserSnapshot(data.user)
}

export async function restoreShowcaseAuthSession(): Promise<ShowcaseAuthSessionSnapshot | null> {
  return getFreshShowcaseAuthSession()
}

export function onShowcaseAuthStateChange(
  handler: ShowcaseAuthStateChangeHandler
): ShowcaseAuthUnsubscribe {
  const {
    data
  } = getShowcaseSupabaseClient().auth.onAuthStateChange((event, session) => {
    handler(event, toShowcaseAuthSessionSnapshot(session))
  })

  return {
    unsubscribe: () => {
      data.subscription.unsubscribe()
    }
  }
}

export function isShowcaseAuthSessionError(value: unknown): value is ShowcaseAuthSessionError {
  return value instanceof ShowcaseAuthSessionError
}

export function isMissingShowcaseAuthSessionError(value: unknown): boolean {
  if (!isShowcaseAuthSessionError(value)) {
    return false
  }

  return (
    value.code === 'missing_auth_session' ||
    value.code === 'missing_access_token' ||
    value.code === 'missing_session_after_sign_in'
  )
}