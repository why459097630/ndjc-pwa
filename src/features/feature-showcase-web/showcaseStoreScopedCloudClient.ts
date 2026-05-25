import {
  ShowcaseCloudHeaders,
  authUrl as buildShowcaseAuthUrl,
  functionUrl as buildShowcaseFunctionUrl,
  requestScopeHeaders,
  restUrl as buildShowcaseRestUrl,
  storageObjectUrl as buildShowcaseStorageObjectUrl,
  storagePublicObjectUrl as buildShowcaseStoragePublicObjectUrl
} from './showcaseCloudConfig'

export type StoreScopedCloudJson =
  | null
  | boolean
  | number
  | string
  | StoreScopedCloudJson[]
  | { [key: string]: StoreScopedCloudJson }

export type StoreScopedCloudRequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'

export type StoreScopedCloudRequestOptions = {
  method?: StoreScopedCloudRequestMethod
  body?: StoreScopedCloudJson | string | Blob | ArrayBuffer | Uint8Array | null
  prefer?: string | null
  contentType?: string | null
  authorization?: string | null
  signal?: AbortSignal | null
  extraHeaders?: Record<string, string | null | undefined>
  scopeStoreId?: string | null
  scopeClientId?: string | null
}

export type StoreScopedCloudHttpResult = {
  code: number
  body: string | null
  headers: Headers
}

export type StoreScopedCloudClientConfig = {
  supabaseUrl: string
  supabaseAnonKey: string
  edgeFunctionBaseUrl?: string | null
  defaultStoreId?: string | null
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

function isStoreScopedCloudUrl(url: string): boolean {
  const text = String(url || '')
  return (
    text.includes('/rest/v1/') ||
    text.includes('/storage/v1/') ||
    text.includes('/functions/v1/')
  )
}

function isRawArrayPayload(value: StoreScopedCloudJson | string | Blob | ArrayBuffer | Uint8Array | null | undefined): value is Record<string, StoreScopedCloudJson> {
  if (!value || typeof value !== 'object') return false
  if (typeof Blob !== 'undefined' && value instanceof Blob) return false
  if (value instanceof ArrayBuffer) return false
  if (value instanceof Uint8Array) return false

  return !Array.isArray(value) && Object.prototype.hasOwnProperty.call(value, '__raw_array__')
}

function stringifyRequestBody(value: StoreScopedCloudJson | string | Blob | ArrayBuffer | Uint8Array | null | undefined): BodyInit | undefined {
  if (value == null) return undefined

  if (typeof value === 'string') return value
  if (typeof Blob !== 'undefined' && value instanceof Blob) return value
  if (value instanceof ArrayBuffer) return value

  if (value instanceof Uint8Array) {
    const copy = new Uint8Array(value.byteLength)
    copy.set(value)
    return new Blob([copy.buffer as ArrayBuffer])
  }

  if (isRawArrayPayload(value)) {
    const raw = value.__raw_array__

    if (typeof raw === 'string') {
      return raw
    }

    return JSON.stringify(raw)
  }

  return JSON.stringify(value)
}

export class StoreScopedCloudClient {
  private readonly supabaseUrl: string
  private readonly supabaseAnonKey: string
  private readonly edgeFunctionBaseUrl: string
  private readonly defaultStoreId: string | null

  constructor(config: StoreScopedCloudClientConfig) {
    this.supabaseUrl = trimTrailingSlashes(config.supabaseUrl)
    this.supabaseAnonKey = String(config.supabaseAnonKey || '').trim()
    this.edgeFunctionBaseUrl = trimTrailingSlashes(config.edgeFunctionBaseUrl || config.supabaseUrl)
    this.defaultStoreId = String(config.defaultStoreId || '').trim() || null
  }

  requireStoreId(storeIdInput?: string | null): string {
    const storeId = String(storeIdInput || this.defaultStoreId || '').trim()

    if (!storeId) {
      throw new Error('storeId is required for store-scoped cloud operation.')
    }

    return storeId
  }

  restUrl(path: string): string {
    return buildShowcaseRestUrl(this.supabaseUrl, trimLeadingSlashes(path))
  }

  authUrl(path: string): string {
    return buildShowcaseAuthUrl(this.supabaseUrl, trimLeadingSlashes(path))
  }

  functionUrl(name: string): string {
    return buildShowcaseFunctionUrl(this.edgeFunctionBaseUrl, trimLeadingSlashes(name))
  }

  storageObjectUrl(bucket: string, objectPath: string): string {
    return buildShowcaseStorageObjectUrl(this.supabaseUrl, bucket, objectPath)
  }

  storagePublicObjectUrl(bucket: string, objectPath: string): string {
    return buildShowcaseStoragePublicObjectUrl(this.supabaseUrl, bucket, objectPath)
  }

  storePathPrefix(storeIdInput?: string | null): string {
    return `${normalizePathPart(this.requireStoreId(storeIdInput))}/`
  }

  assertStoreObjectPath(storeIdInput: string | null | undefined, objectPathInput: string): string {
    const storeId = this.requireStoreId(storeIdInput)
    const objectPath = trimSlashes(decodeURIComponent(String(objectPathInput || '').trim()))
    const prefix = this.storePathPrefix(storeId)

    if (!objectPath || !objectPath.startsWith(prefix)) {
      throw new Error('Storage object does not belong to current store.')
    }

    return objectPath
  }

  buildScopeHeaders(storeIdInput?: string | null, clientIdInput?: string | null): Record<string, string> {
    return requestScopeHeaders(
      this.requireStoreId(storeIdInput),
      clientIdInput || null
    )
  }

  buildHeaders(options: StoreScopedCloudRequestOptions = {}): Headers {
    const headers = new Headers()

    if (this.supabaseAnonKey) {
      headers.set(ShowcaseCloudHeaders.API_KEY, this.supabaseAnonKey)
      headers.set(ShowcaseCloudHeaders.AUTHORIZATION, options.authorization || `Bearer ${this.supabaseAnonKey}`)
    } else if (options.authorization) {
      headers.set(ShowcaseCloudHeaders.AUTHORIZATION, options.authorization)
    }

    if (options.prefer) {
      headers.set(ShowcaseCloudHeaders.PREFER_RETURN_REPRESENTATION, options.prefer)
    }

    if (options.contentType !== null) {
      headers.set(ShowcaseCloudHeaders.CONTENT_TYPE, options.contentType || 'application/json')
    }

    Object.entries(options.extraHeaders || {}).forEach(([key, value]) => {
      if (value == null) return
      headers.set(key, value)
    })

    return headers
  }

  async openConnection(url: string, options: StoreScopedCloudRequestOptions = {}): Promise<Response> {
    const method = options.method || 'GET'
    const contentType = options.contentType === undefined ? 'application/json' : options.contentType
    const body = stringifyRequestBody(options.body)
    const headers = this.buildHeaders({
      authorization: options.authorization,
      prefer: options.prefer,
      contentType: body == null ? null : contentType,
      extraHeaders: options.extraHeaders
    })

    if (isStoreScopedCloudUrl(url)) {
      Object.entries(this.buildScopeHeaders(options.scopeStoreId, options.scopeClientId || null)).forEach(([key, value]) => {
        headers.set(key, value)
      })
    }

    return fetch(url, {
      method,
      headers,
      body,
      signal: options.signal || undefined
    })
  }

  async request(url: string, options: StoreScopedCloudRequestOptions = {}): Promise<StoreScopedCloudHttpResult> {
    const response = await this.openConnection(url, options)
    const body = await response.text().catch(() => null)

    return {
      code: response.status,
      body,
      headers: response.headers
    }
  }
}