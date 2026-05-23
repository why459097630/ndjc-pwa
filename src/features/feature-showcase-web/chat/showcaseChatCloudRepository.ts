import {
  ShowcaseCloudAuthActor,
  ShowcaseCloudHeaders,
  SHOWCASE_BUCKETS,
  SHOWCASE_PAGE_SIZE,
  SHOWCASE_TABLES,
  requestScopeHeaders,
  resolveShowcaseSupabaseAnonKey,
  resolveShowcaseSupabaseUrl,
  restUrl as buildShowcaseRestUrl,
  storageObjectUrl as buildShowcaseStorageObjectUrl,
  storagePublicObjectUrl as buildShowcaseStoragePublicObjectUrl
} from '../showcaseCloudConfig'
import {
  refreshShowcaseAuthSession,
  requireFreshShowcaseAccessToken
} from '../showcaseAuthSessionManager'
import {
  currentStoreId
} from '../showcaseStoreSession'

export type ChatCloudConfig = {
  base: string
  apiKey: string
}

export type ShowcaseChatCloudRepositoryOptions = {
  logTag?: string
}

export type ChatCloudRequestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export type ChatCloudRequestOptions = {
  url: string
  method: ChatCloudRequestMethod
  actor: ShowcaseCloudAuthActor
  scopeStoreId: string
  scopeClientId?: string | null
  body?: string | Blob | ArrayBuffer | Uint8Array | null
  contentType?: string | null
  prefer?: string | null
  accept?: string | null
  extraHeaders?: Record<string, string | null | undefined>
  signal?: AbortSignal | null
}

export type ChatCloudHttpResult = {
  code: number
  body: string | null
  headers: Headers
  ok: boolean
}

export class ShowcaseChatCloudQueryError extends Error {
  readonly code: number
  readonly body: string | null

  constructor(message: string, code: number, body: string | null = null) {
    super(message)
    this.name = 'ShowcaseChatCloudQueryError'
    this.code = code
    this.body = body
  }
}

export type CloudMsg = {
  id: string
  conversationId: string
  storeId: string
  clientId: string
  role: string
  direction: string
  text: string
  timeMs: number
  isRead: boolean
}

export type CloudThreadSummaryRow = {
  conversationId: string
  storeId: string
  clientId: string
  customerSeq: number | null
  merchantAlias: string | null
  lastMessageAtIso: string | null
  lastPreview: string | null
  updatedAtIso: string | null
}

export type CloudThreadMetaRow = {
  conversationId: string
  storeId: string
  merchantAlias: string | null
  merchantArchived: boolean
  merchantArchivedAtMs: number
}

export type RelayRow = {
  id: string
  conversationId: string
  storeId: string
  clientId: string
  fromRole: string
  payload: Record<string, unknown>
  createdAt?: string | null
}

export type ChatImageUploadInput = {
  bytes: Blob | ArrayBuffer | Uint8Array
  contentType: string
  storeId: string
  conversationId: string
  msgId: string
  clientId?: string | null
  asMerchant?: boolean
  index?: number
  traceId?: string | null
}

function trimLeadingSlashes(value: string): string {
  return String(value || '').replace(/^\/+/, '')
}

function normalizeNullableString(value: unknown): string | null {
  const text = String(value ?? '').trim()
  if (!text || text.toLowerCase() === 'null') return null
  return text
}

function normalizeHeaderValue(value: string | null | undefined): string | null {
  const text = String(value ?? '').trim()
  return text || null
}

function byteBodyToFetchBody(
  body: string | Blob | ArrayBuffer | Uint8Array | null | undefined
): BodyInit | null {
  if (body == null) return null
  if (typeof body === 'string') return body
  if (typeof Blob !== 'undefined' && body instanceof Blob) return body
  if (body instanceof ArrayBuffer) return body
  if (body instanceof Uint8Array) {
    return new Blob([body as unknown as BlobPart])
  }
  return null
}

function fallbackTraceId(prefix = 'C'): string {
  return `${prefix}${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`
}

function encodeFilterValue(value: string): string {
  return encodeURIComponent(String(value || '').trim())
}

function encodeIlikeFilterValue(value: string): string {
  return encodeURIComponent(String(value || '').trim().replace(/[*%]/g, ' '))
}

const CHAT_IMAGE_PAYLOAD_MARKER = '⟪I⟫'
const CHAT_IMAGE_PAYLOAD_END_MARKER = '⟪/I⟫'
const CHAT_STRUCTURED_PAYLOAD_PATTERN = /⟪[A-Z]⟫[\s\S]*?⟪\/[A-Z]⟫/g

function extractImageUrlsFromChatText(value: string): string[] {
  const source = String(value || '')
  const start = source.indexOf(CHAT_IMAGE_PAYLOAD_MARKER)
  const end = source.indexOf(CHAT_IMAGE_PAYLOAD_END_MARKER)

  if (start < 0 || end <= start) return []

  return source
    .slice(start + CHAT_IMAGE_PAYLOAD_MARKER.length, end)
    .split('|')
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 9)
}

function extractPlainTextFromChatText(value: string): string {
  return String(value || '')
    .replace(CHAT_STRUCTURED_PAYLOAD_PATTERN, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeRelayPayload(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }

  return {}
}

function normalizePositiveInt(value: unknown): number | null {
  const numberValue = Number(value)
  return Number.isFinite(numberValue) && numberValue > 0 ? Math.trunc(numberValue) : null
}

function normalizeIsoString(value: unknown): string | null {
  const text = String(value ?? '').trim()
  if (!text || text.toLowerCase() === 'null') return null
  return text
}

function parseThreadSummaryRecord(record: Record<string, unknown>): CloudThreadSummaryRow {
  return {
    conversationId: String(record.conversation_id ?? '').trim(),
    storeId: String(record.store_id ?? '').trim(),
    clientId: String(record.client_id ?? '').trim(),
    customerSeq: normalizePositiveInt(record.customer_seq),
    merchantAlias: normalizeNullableString(record.merchant_alias),
    lastMessageAtIso: normalizeIsoString(record.last_message_at),
    lastPreview: normalizeNullableString(record.last_preview),
    updatedAtIso: normalizeIsoString(record.updated_at)
  }
}

function parseThreadMetaRecord(record: Record<string, unknown>): CloudThreadMetaRow {
  return {
    conversationId: String(record.conversation_id ?? '').trim(),
    storeId: String(record.store_id ?? '').trim(),
    merchantAlias: normalizeNullableString(record.merchant_alias),
    merchantArchived: Boolean(record.merchant_archived),
    merchantArchivedAtMs: Number.isFinite(Number(record.merchant_archived_at_ms))
      ? Number(record.merchant_archived_at_ms)
      : 0
  }
}

function parseCloudMsgRecord(record: Record<string, unknown>): CloudMsg {
  return {
    id: String(record.id ?? '').trim(),
    conversationId: String(record.conversation_id ?? '').trim(),
    storeId: String(record.store_id ?? '').trim(),
    clientId: String(record.client_id ?? '').trim(),
    role: String(record.role ?? '').trim(),
    direction: String(record.direction ?? '').trim(),
    text: String(record.text ?? record.content ?? '').trim(),
    timeMs: Number.isFinite(Number(record.time_ms)) ? Number(record.time_ms) : 0,
    isRead: Boolean(record.is_read)
  }
}

function isMerchantRole(roleInput: string): boolean {
  const role = String(roleInput || '').trim().toLowerCase()
  return role === 'merchant' || role === 'admin'
}

function normalizeLimit(value: unknown, fallback: number, max: number): number {
  return Math.max(1, Math.min(Math.trunc(Number(value) || fallback), max))
}

function countFromContentRange(headers: Headers): number | null {
  const contentRange = headers.get('content-range') || headers.get('Content-Range') || ''
  const totalText = contentRange.split('/')[1]?.trim() || ''
  const total = Number(totalText)

  return Number.isFinite(total) && total >= 0 ? Math.trunc(total) : null
}

function extensionFromContentType(contentTypeInput: string): string {
  const contentType = String(contentTypeInput || '').trim().toLowerCase()

  if (contentType.includes('png')) return 'png'
  if (contentType.includes('webp')) return 'webp'
  if (contentType.includes('gif')) return 'gif'

  return 'jpg'
}

function normalizeUploadContentType(contentTypeInput: string): string {
  const contentType = String(contentTypeInput || '').trim()

  if (contentType) return contentType

  return 'image/jpeg'
}

function safeStoragePathPart(value: string): string {
  return String(value || '').trim().replace(/:/g, '_')
}

function uploadByteLength(bytes: Blob | ArrayBuffer | Uint8Array | null | undefined): number {
  if (!bytes) return 0
  if (typeof Blob !== 'undefined' && bytes instanceof Blob) return bytes.size
  if (bytes instanceof ArrayBuffer) return bytes.byteLength
  if (bytes instanceof Uint8Array) return bytes.byteLength
  return 0
}

export class ShowcaseChatCloudRepository {
  private readonly logTag: string

  lastChatImageUploadCode: number | null = null
  lastChatImageUploadBody: string | null = null

  constructor(options: string | ShowcaseChatCloudRepositoryOptions = 'ChatTrace') {
    if (typeof options === 'string') {
      this.logTag = options
    } else {
      this.logTag = options.logTag || 'ChatTrace'
    }
  }

  private requireConfig(): ChatCloudConfig | null {
    const base = resolveShowcaseSupabaseUrl().trim().replace(/\/+$/, '')
    const apiKey = resolveShowcaseSupabaseAnonKey().trim()

    if (!base || !apiKey) return null

    return {
      base,
      apiKey
    }
  }

  private restUrl(path: string): string {
    const cfg = this.requireConfig()
    if (!cfg) {
      throw new Error('SUPABASE_URL / SUPABASE_ANON_KEY blank')
    }

    return buildShowcaseRestUrl(cfg.base, trimLeadingSlashes(path))
  }

  private storageObjectUrl(bucket: string, path: string): string {
    const cfg = this.requireConfig()
    if (!cfg) {
      throw new Error('SUPABASE_URL / SUPABASE_ANON_KEY blank')
    }

    return buildShowcaseStorageObjectUrl(cfg.base, bucket, path)
  }

  private storagePublicObjectUrl(bucket: string, path: string): string {
    const cfg = this.requireConfig()
    if (!cfg) {
      throw new Error('SUPABASE_URL / SUPABASE_ANON_KEY blank')
    }

    return buildShowcaseStoragePublicObjectUrl(cfg.base, bucket, path)
  }

  private authToken(
    actor: ShowcaseCloudAuthActor,
    cfg: ChatCloudConfig,
    merchantAccessToken?: string | null
  ): string {
    if (actor === ShowcaseCloudAuthActor.PUBLIC) {
      return cfg.apiKey
    }

    return String(merchantAccessToken || '').trim() || cfg.apiKey
  }

  private buildHeaders(
    options: ChatCloudRequestOptions,
    cfg: ChatCloudConfig,
    merchantAccessToken?: string | null
  ): Headers {
    const headers = new Headers()
    const token = this.authToken(options.actor, cfg, merchantAccessToken)

    headers.set(ShowcaseCloudHeaders.API_KEY, cfg.apiKey)
    headers.set(ShowcaseCloudHeaders.AUTHORIZATION, `Bearer ${token}`)

    Object.entries(requestScopeHeaders(options.scopeStoreId, options.scopeClientId || null)).forEach(([key, value]) => {
      headers.set(key, value)
    })

    headers.set(ShowcaseCloudHeaders.ACCEPT, options.accept || 'application/json')

    if (options.method !== 'GET' && options.method !== 'DELETE') {
      headers.set(ShowcaseCloudHeaders.CONTENT_TYPE, options.contentType || 'application/json')
    }

    const prefer = normalizeHeaderValue(options.prefer)
    if (prefer) {
      headers.set(ShowcaseCloudHeaders.PREFER_RETURN_REPRESENTATION, prefer)
    }

    Object.entries(options.extraHeaders || {}).forEach(([key, value]) => {
      const normalized = normalizeHeaderValue(value)
      if (normalized) {
        headers.set(key, normalized)
      }
    })

    return headers
  }

  private async openRequest(
    options: ChatCloudRequestOptions,
    merchantAccessToken?: string | null
  ): Promise<ChatCloudHttpResult> {
    const cfg = this.requireConfig()

    if (!cfg) {
      return {
        code: 0,
        body: 'SUPABASE_URL / SUPABASE_ANON_KEY blank',
        headers: new Headers(),
        ok: false
      }
    }

    const headers = this.buildHeaders(options, cfg, merchantAccessToken)
    const body = byteBodyToFetchBody(options.body)

    try {
      const response = await fetch(options.url, {
        method: options.method,
        headers,
        body: options.method === 'GET' || options.method === 'DELETE' ? null : body,
        signal: options.signal || undefined
      })

      const responseBody = await this.readBody(response)

      return {
        code: response.status,
        body: responseBody,
        headers: response.headers,
        ok: response.ok
      }
    } catch (error) {
      return {
        code: 0,
        body: error instanceof Error ? error.message : String(error || ''),
        headers: new Headers(),
        ok: false
      }
    }
  }

  private async readBody(response: Response): Promise<string | null> {
    try {
      return await response.text()
    } catch {
      return null
    }
  }

  private async readAll(response: Response): Promise<string> {
    try {
      return await response.text()
    } catch {
      return ''
    }
  }

  isMerchantAuthExpired(code: number | null | undefined, body: string | null | undefined): boolean {
    const status = Number(code || 0)
    const text = String(body || '').trim().toLowerCase()

    const tokenExpired = (
      text.includes('jwt expired') ||
      text.includes('"exp" claim timestamp check failed') ||
      text.includes('exp claim timestamp check failed') ||
      text.includes('access token expired') ||
      text.includes('token expired') ||
      text.includes('invalid jwt') ||
      (text.includes('jwt') && text.includes('expired'))
    )

    if (tokenExpired) {
      return true
    }

    if (status !== 401) {
      return false
    }

    return (
      text.includes('unauthorized') ||
      text.includes('not authenticated') ||
      text.includes('authentication') ||
      text.includes('bearer') ||
      text.includes('jwt') ||
      text.includes('access token') ||
      text.includes('auth token') ||
      text.includes('session')
    )
  }

  protected effectiveTraceId(traceId?: string | null): string {
    const value = String(traceId || '').trim()
    if (value && value !== '-') return value
    return fallbackTraceId('C')
  }

  protected buildRestUrl(path: string): string {
    return this.restUrl(path)
  }

  protected buildStorageObjectUrl(bucket: string, path: string): string {
    return this.storageObjectUrl(bucket, path)
  }

  protected buildStoragePublicObjectUrl(bucket: string, path: string): string {
    return this.storagePublicObjectUrl(bucket, path)
  }

  protected async requestJson(options: Omit<ChatCloudRequestOptions, 'body' | 'contentType'> & {
    body?: unknown
  }): Promise<ChatCloudHttpResult> {
    const body = options.body == null ? null : JSON.stringify(options.body)

    return this.requestRaw({
      ...options,
      body,
      contentType: 'application/json'
    })
  }

  protected async requestRaw(options: ChatCloudRequestOptions): Promise<ChatCloudHttpResult> {
    if (options.actor !== ShowcaseCloudAuthActor.MERCHANT) {
      return this.openRequest(options)
    }

    let accessToken = ''

    try {
      accessToken = await requireFreshShowcaseAccessToken()
    } catch (error) {
      return {
        code: 0,
        body: error instanceof Error ? error.message : 'Merchant session missing',
        headers: new Headers(),
        ok: false
      }
    }

    const first = await this.openRequest(options, accessToken)

    if (!this.isMerchantAuthExpired(first.code, first.body)) {
      return first
    }

    let retryAccessToken = ''

    try {
      const refreshed = await refreshShowcaseAuthSession()
      retryAccessToken = refreshed?.accessToken || ''
    } catch {
      return first
    }

    if (!retryAccessToken || retryAccessToken === accessToken) {
      return first
    }

    return this.openRequest(options, retryAccessToken)
  }

  protected parseJsonArray(body: string | null): unknown[] {
    if (!body) return []

    try {
      const value = JSON.parse(body)
      return Array.isArray(value) ? value : []
    } catch {
      return []
    }
  }

  protected parseJsonObject(body: string | null): Record<string, unknown> | null {
    if (!body) return null

    try {
      const value = JSON.parse(body)
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value as Record<string, unknown>
      }

      return null
    } catch {
      return null
    }
  }

  protected jsonString(record: Record<string, unknown>, key: string): string {
    return String(record[key] ?? '').trim()
  }

  protected jsonNullableString(record: Record<string, unknown>, key: string): string | null {
    return normalizeNullableString(record[key])
  }

  protected jsonNumber(record: Record<string, unknown>, key: string): number {
    const value = Number(record[key])
    return Number.isFinite(value) ? value : 0
  }

  protected jsonBoolean(record: Record<string, unknown>, key: string): boolean {
    const value = record[key]
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value !== 0

    const text = String(value ?? '').trim().toLowerCase()
    return text === 'true' || text === '1' || text === 'yes'
  }

  async upsertConversation(
    conversationIdInput: string,
    storeIdInput: string,
    clientIdInput: string,
    traceId?: string | null
  ): Promise<boolean> {
    const tid = this.effectiveTraceId(traceId)
    const conversationId = String(conversationIdInput || '').trim()
    const storeId = String(storeIdInput || '').trim()
    const clientId = String(clientIdInput || '').trim()

    if (!conversationId || !storeId || !clientId) {
      console.error(`[${this.logTag}] [${tid}] SKIP blank fields conv=${conversationId} store=${storeId} client=${clientId}`)
      return false
    }

    const url = this.buildRestUrl(`${SHOWCASE_TABLES.chatConversations}?on_conflict=conversation_id`)
    const body = [
      {
        conversation_id: conversationId,
        store_id: storeId,
        client_id: clientId
      }
    ]

    console.error(`[${this.logTag}] [${tid}] upsertConversation REQ url=${url} body=${JSON.stringify(body)}`)

    const result = await this.requestJson({
      url,
      method: 'POST',
      actor: ShowcaseCloudAuthActor.PUBLIC,
      scopeStoreId: storeId,
      scopeClientId: clientId,
      prefer: 'resolution=merge-duplicates,return=minimal',
      body
    })

    if (!result.ok) {
      console.error(`[${this.logTag}] [${tid}] upsertConversation FAILED code=${result.code} body=${result.body || ''} url=${url}`)
      return false
    }

    console.error(`[${this.logTag}] [${tid}] upsertConversation OK code=${result.code}`)
    return true
  }

  async enqueueRelay(row: RelayRow, traceId?: string | null): Promise<boolean> {
    const tid = this.effectiveTraceId(traceId)
    const id = String(row.id || '').trim()
    const conversationId = String(row.conversationId || '').trim()
    const storeId = String(row.storeId || '').trim()
    const clientId = String(row.clientId || '').trim()
    const fromRole = String(row.fromRole || '').trim()

    if (!id || !conversationId || !storeId || !clientId || !fromRole) {
      console.error(`[${this.logTag}] [${tid}] SKIP enqueueRelay blank id=${id} conv=${conversationId} store=${storeId} client=${clientId} fromRole=${fromRole}`)
      return false
    }

    const url = this.buildRestUrl(SHOWCASE_TABLES.chatRelay)
    const body = {
      id,
      conversation_id: conversationId,
      store_id: storeId,
      client_id: clientId,
      from_role: fromRole,
      payload: normalizeRelayPayload(row.payload)
    }

    const actor = fromRole.toLowerCase() === 'merchant' || fromRole.toLowerCase() === 'admin'
      ? ShowcaseCloudAuthActor.MERCHANT
      : ShowcaseCloudAuthActor.PUBLIC

    console.error(`[${this.logTag}] [${tid}] relay enqueue REQ url=${url} body=${JSON.stringify(body).slice(0, 800)}`)

    const result = await this.requestJson({
      url,
      method: 'POST',
      actor,
      scopeStoreId: storeId,
      scopeClientId: actor === ShowcaseCloudAuthActor.PUBLIC ? clientId : null,
      prefer: 'return=minimal',
      body
    })

    console.error(`[${this.logTag}] [${tid}] relay enqueue RESP code=${result.code} body=${String(result.body || '').slice(0, 800)}`)
    return result.ok
  }

  async pullRelayByStore(
    storeIdInput: string,
    clientIdInput: string | null = null,
    asMerchant = false,
    limitInput = 200,
    traceId?: string | null
  ): Promise<RelayRow[]> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || '').trim()
    const clientId = normalizeNullableString(clientIdInput)
    const limit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || 200), 200))

    if (!storeId) return []

    const url = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatRelay}` +
      `?store_id=eq.${encodeFilterValue(storeId)}` +
      '&order=created_at.asc' +
      `&limit=${limit}`
    )

    console.error(`[${this.logTag}] [${tid}] relay pullByStore REQ url=${url}`)

    const result = await this.requestRaw({
      url,
      method: 'GET',
      actor: asMerchant ? ShowcaseCloudAuthActor.MERCHANT : ShowcaseCloudAuthActor.PUBLIC,
      scopeStoreId: storeId,
      scopeClientId: asMerchant ? null : clientId
    })

    console.error(`[${this.logTag}] [${tid}] relay pullByStore RESP code=${result.code} body=${String(result.body || '').slice(0, 1200)}`)

    if (!result.ok) return []

    return this.parseJsonArray(result.body)
      .map((item): RelayRow | null => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return null

        const record = item as Record<string, unknown>

        return {
          id: this.jsonString(record, 'id'),
          conversationId: this.jsonString(record, 'conversation_id'),
          storeId: this.jsonString(record, 'store_id'),
          clientId: this.jsonString(record, 'client_id'),
          fromRole: this.jsonString(record, 'from_role'),
          payload: normalizeRelayPayload(record.payload),
          createdAt: this.jsonNullableString(record, 'created_at')
        }
      })
      .filter((item): item is RelayRow => Boolean(item?.id && item.conversationId && item.storeId))
  }

  async deleteRelay(idsInput: string[], traceId?: string | null): Promise<boolean> {
    const tid = this.effectiveTraceId(traceId)
    const ids = idsInput.map(id => String(id || '').trim()).filter(Boolean)

    if (!ids.length) return true

    const inList = ids.join(',')
    const url = this.buildRestUrl(`${SHOWCASE_TABLES.chatRelay}?id=in.(${encodeFilterValue(inList)})`)

    console.error(`[${this.logTag}] [${tid}] relay delete REQ url=${url} ids=${ids.length}`)

    const result = await this.requestRaw({
      url,
      method: 'DELETE',
      actor: ShowcaseCloudAuthActor.MERCHANT,
      scopeStoreId: currentStoreId(),
      scopeClientId: null
    })

    console.error(`[${this.logTag}] [${tid}] relay delete RESP code=${result.code} body=${String(result.body || '').slice(0, 800)}`)
    return result.ok
  }

  async fetchThreadSummaries(
    storeIdInput: string,
    limitInput: number = SHOWCASE_PAGE_SIZE.chatThreads,
    traceId?: string | null,
    offsetInput = 0
  ): Promise<CloudThreadSummaryRow[]> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || '').trim()
    const limit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || SHOWCASE_PAGE_SIZE.chatThreads), 300))
    const offset = Math.max(0, Math.trunc(Number(offsetInput) || 0))

    if (!storeId) return []

    const viewSelect = 'conversation_id,store_id,client_id,customer_seq,merchant_alias,display_name,last_message_at,last_preview,updated_at'
    const viewUrl = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatThreadSummariesView}` +
      `?select=${viewSelect}` +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      '&order=last_message_at.desc.nullslast' +
      `&limit=${limit}` +
      `&offset=${offset}`
    )

    console.error(`[${this.logTag}] [${tid}] fetchThreadSummaries VIEW REQ url=${viewUrl}`)

    try {
      let result = await this.requestRaw({
        url: viewUrl,
        method: 'GET',
        actor: ShowcaseCloudAuthActor.MERCHANT,
        scopeStoreId: storeId,
        scopeClientId: null
      })

      if (result.ok) {
        const rows = this.parseJsonArray(result.body)
          .map(item => {
            if (!item || typeof item !== 'object' || Array.isArray(item)) return null
            return parseThreadSummaryRecord(item as Record<string, unknown>)
          })
          .filter((item): item is CloudThreadSummaryRow => Boolean(item?.conversationId && item.storeId))

        if (rows.length) {
          console.error(`[${this.logTag}] [${tid}] fetchThreadSummaries VIEW OK rows=${rows.length}`)
          return rows
        }

        console.error(`[${this.logTag}] [${tid}] fetchThreadSummaries VIEW EMPTY -> fallback conversations`)
      } else {
        console.error(`[${this.logTag}] [${tid}] fetchThreadSummaries VIEW FAILED code=${result.code} body=${result.body || ''} -> fallback conversations`)
      }
    } catch (error) {
      console.error(`[${this.logTag}] [${tid}] fetchThreadSummaries VIEW ERROR ${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : String(error || '')} -> fallback conversations`)
    }

    const convSelect = 'conversation_id,store_id,client_id,customer_seq,updated_at'
    const convUrl = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatConversations}` +
      `?select=${convSelect}` +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      '&order=updated_at.desc.nullslast' +
      `&limit=${limit}` +
      `&offset=${offset}`
    )

    console.error(`[${this.logTag}] [${tid}] fetchThreadSummaries FALLBACK REQ url=${convUrl}`)

    try {
      let result = await this.requestRaw({
        url: convUrl,
        method: 'GET',
        actor: ShowcaseCloudAuthActor.MERCHANT,
        scopeStoreId: storeId,
        scopeClientId: null
      })

      if (!result.ok) {
        console.error(`[${this.logTag}] [${tid}] fetchThreadSummaries FALLBACK FAILED code=${result.code} body=${result.body || ''} url=${convUrl}`)
        return []
      }

      const rows = this.parseJsonArray(result.body)
        .map((item): CloudThreadSummaryRow | null => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return null

          const record = item as Record<string, unknown>

          return {
            conversationId: String(record.conversation_id ?? '').trim(),
            storeId: String(record.store_id ?? '').trim(),
            clientId: String(record.client_id ?? '').trim(),
            customerSeq: normalizePositiveInt(record.customer_seq),
            merchantAlias: null,
            lastMessageAtIso: null,
            lastPreview: null,
            updatedAtIso: normalizeIsoString(record.updated_at)
          }
        })
        .filter((item): item is CloudThreadSummaryRow => Boolean(item?.conversationId && item.storeId))

      console.error(`[${this.logTag}] [${tid}] fetchThreadSummaries FALLBACK OK rows=${rows.length}`)
      return rows
    } catch (error) {
      console.error(`[${this.logTag}] [${tid}] fetchThreadSummaries FALLBACK ERROR ${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : String(error || '')}`)
      return []
    }
  }
  async searchThreadSummariesByCustomerName(
    storeIdInput: string,
    keywordInput: string,
    limitInput: number = SHOWCASE_PAGE_SIZE.chatThreads,
    traceId?: string | null,
    offsetInput = 0
  ): Promise<CloudThreadSummaryRow[]> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || '').trim()
    const keyword = String(keywordInput || '').trim()
    const limit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || SHOWCASE_PAGE_SIZE.chatThreads), 300))
    const offset = Math.max(0, Math.trunc(Number(offsetInput) || 0))

    if (!storeId || !keyword) return []

    const normalizedKeyword = keyword.toLowerCase()
    const numericMatch = keyword.match(/\d+/)
    const customerSeq = numericMatch ? Math.max(1, Math.trunc(Number(numericMatch[0]) || 0)) : 0
    const encodedKeyword = encodeIlikeFilterValue(keyword)
    const viewSelect = 'conversation_id,store_id,client_id,customer_seq,merchant_alias,display_name,last_message_at,last_preview,updated_at'

    const searchFilter = customerSeq > 0
      ? `&or=(merchant_alias.ilike.*${encodedKeyword}*,display_name.ilike.*${encodedKeyword}*,customer_seq.eq.${customerSeq})`
      : `&or=(merchant_alias.ilike.*${encodedKeyword}*,display_name.ilike.*${encodedKeyword}*)`

    const viewUrl = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatThreadSummariesView}` +
      `?select=${viewSelect}` +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      searchFilter +
      '&order=last_message_at.desc.nullslast' +
      `&limit=${limit}` +
      `&offset=${offset}`
    )

    console.error(`[${this.logTag}] [${tid}] searchThreadSummariesByCustomerName VIEW REQ url=${viewUrl}`)

    try {
      const result = await this.requestRaw({
        url: viewUrl,
        method: 'GET',
        actor: ShowcaseCloudAuthActor.MERCHANT,
        scopeStoreId: storeId,
        scopeClientId: null
      })

      if (result.ok) {
        const rows = this.parseJsonArray(result.body)
          .map(item => {
            if (!item || typeof item !== 'object' || Array.isArray(item)) return null
            return parseThreadSummaryRecord(item as Record<string, unknown>)
          })
          .filter((item): item is CloudThreadSummaryRow => Boolean(item?.conversationId && item.storeId))

        if (rows.length > 0) {
          console.error(`[${this.logTag}] [${tid}] searchThreadSummariesByCustomerName VIEW OK rows=${rows.length}`)
          return rows
        }

        console.error(`[${this.logTag}] [${tid}] searchThreadSummariesByCustomerName VIEW EMPTY -> fallback conversations`)
      } else {
        console.error(`[${this.logTag}] [${tid}] searchThreadSummariesByCustomerName VIEW FAILED code=${result.code} body=${result.body || ''} -> fallback conversations url=${viewUrl}`)
      }
    } catch (error) {
      console.error(`[${this.logTag}] [${tid}] searchThreadSummariesByCustomerName VIEW ERROR ${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : String(error || '')} -> fallback conversations`)
    }

    const fallbackSelect = 'conversation_id,store_id,client_id,customer_seq,updated_at'
    const fallbackShouldReturnCustomerPage =
      normalizedKeyword === 'customer' ||
      normalizedKeyword === 'customers' ||
      normalizedKeyword === 'cust' ||
      normalizedKeyword === 'cus' ||
      normalizedKeyword.startsWith('customer #')

    const fallbackSearchFilter = customerSeq > 0
      ? `&customer_seq=eq.${customerSeq}`
      : fallbackShouldReturnCustomerPage
        ? ''
        : `&client_id=ilike.*${encodedKeyword}*`

    const fallbackUrl = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatConversations}` +
      `?select=${fallbackSelect}` +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      fallbackSearchFilter +
      '&order=updated_at.desc.nullslast' +
      `&limit=${limit}` +
      `&offset=${offset}`
    )

    console.error(`[${this.logTag}] [${tid}] searchThreadSummariesByCustomerName FALLBACK REQ url=${fallbackUrl}`)

    try {
      const fallbackResult = await this.requestRaw({
        url: fallbackUrl,
        method: 'GET',
        actor: ShowcaseCloudAuthActor.MERCHANT,
        scopeStoreId: storeId,
        scopeClientId: null
      })

      if (!fallbackResult.ok) {
        console.error(`[${this.logTag}] [${tid}] searchThreadSummariesByCustomerName FALLBACK FAILED code=${fallbackResult.code} body=${fallbackResult.body || ''} url=${fallbackUrl}`)
        return []
      }

      const rows = this.parseJsonArray(fallbackResult.body)
        .map((item): CloudThreadSummaryRow | null => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return null

          const record = item as Record<string, unknown>

          return {
            conversationId: String(record.conversation_id ?? '').trim(),
            storeId: String(record.store_id ?? '').trim(),
            clientId: String(record.client_id ?? '').trim(),
            customerSeq: normalizePositiveInt(record.customer_seq),
            merchantAlias: null,
            lastMessageAtIso: null,
            lastPreview: null,
            updatedAtIso: normalizeIsoString(record.updated_at)
          }
        })
        .filter((item): item is CloudThreadSummaryRow => Boolean(item?.conversationId && item.storeId))

      console.error(`[${this.logTag}] [${tid}] searchThreadSummariesByCustomerName FALLBACK OK rows=${rows.length}`)
      return rows
    } catch (error) {
      console.error(`[${this.logTag}] [${tid}] searchThreadSummariesByCustomerName FALLBACK ERROR ${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : String(error || '')}`)
      return []
    }
  }
  async countUnreadForUserEntryByStoreAndClient(
    storeIdInput: string,
    clientIdInput: string,
    traceId?: string | null
  ): Promise<number> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || '').trim()
    const clientId = String(clientIdInput || '').trim()

    if (!storeId || !clientId) return 0

    const url = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatMessages}` +
      '?select=id' +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      `&client_id=eq.${encodeFilterValue(clientId)}` +
      '&role=eq.merchant' +
      '&is_read=eq.false' +
      '&limit=1'
    )

    console.error(`[${this.logTag}] [${tid}] countUnreadForUserEntryByStoreAndClient REQ url=${url}`)

    const result = await this.requestRaw({
      url,
      method: 'GET',
      actor: ShowcaseCloudAuthActor.PUBLIC,
      scopeStoreId: storeId,
      scopeClientId: clientId,
      prefer: 'count=exact'
    })

    if (!result.ok) {
      console.error(`[${this.logTag}] [${tid}] countUnreadForUserEntryByStoreAndClient FAILED code=${result.code} body=${result.body || ''}`)
      return 0
    }

    const count = countFromContentRange(result.headers)
    const fallbackCount = this.parseJsonArray(result.body).length
    const resolvedCount = count ?? fallbackCount

    console.error(`[${this.logTag}] [${tid}] countUnreadForUserEntryByStoreAndClient OK count=${resolvedCount}`)

    return resolvedCount
  }

  async countUnreadForMerchantConversation(
    storeIdInput: string,
    conversationIdInput: string,
    traceId?: string | null
  ): Promise<number> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || '').trim()
    const conversationId = String(conversationIdInput || '').trim()

    if (!storeId || !conversationId) return 0

    const url = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatMessages}` +
      '?select=id' +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      `&conversation_id=eq.${encodeFilterValue(conversationId)}` +
      '&role=eq.client' +
      '&is_read=eq.false' +
      '&limit=1'
    )

    console.error(`[${this.logTag}] [${tid}] countUnreadForMerchantConversation REQ url=${url}`)

    const result = await this.requestRaw({
      url,
      method: 'GET',
      actor: ShowcaseCloudAuthActor.MERCHANT,
      scopeStoreId: storeId,
      scopeClientId: null,
      prefer: 'count=exact'
    })

    if (!result.ok) {
      console.error(`[${this.logTag}] [${tid}] countUnreadForMerchantConversation FAILED code=${result.code} body=${result.body || ''}`)
      return 0
    }

    const count = countFromContentRange(result.headers)
    const fallbackCount = this.parseJsonArray(result.body).length
    const resolvedCount = count ?? fallbackCount

    console.error(`[${this.logTag}] [${tid}] countUnreadForMerchantConversation OK conversationId=${conversationId} count=${resolvedCount}`)

    return resolvedCount
  }

  async fetchMerchantThreadMetaRows(
    storeIdInput: string,
    traceId?: string | null
  ): Promise<CloudThreadMetaRow[]> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || currentStoreId() || '').trim()

    if (!storeId) return []

    const select = 'conversation_id,store_id,merchant_alias,merchant_archived,merchant_archived_at_ms'
    const url = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatThreadMeta}` +
      `?select=${select}` +
      `&store_id=eq.${encodeFilterValue(storeId)}`
    )

    console.error(`[${this.logTag}] [${tid}] fetchMerchantThreadMetaRows REQ url=${url}`)

    try {
      let result = await this.requestRaw({
        url,
        method: 'GET',
        actor: ShowcaseCloudAuthActor.MERCHANT,
        scopeStoreId: storeId,
        scopeClientId: null
      })

      if (!result.ok) {
        console.error(`[${this.logTag}] [${tid}] fetchMerchantThreadMetaRows FAILED code=${result.code} body=${result.body || ''} url=${url}`)
        return []
      }

      const rows = this.parseJsonArray(result.body)
        .map(item => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return null
          return parseThreadMetaRecord(item as Record<string, unknown>)
        })
        .filter((item): item is CloudThreadMetaRow => Boolean(item?.conversationId && item.storeId))

      console.error(`[${this.logTag}] [${tid}] fetchMerchantThreadMetaRows OK rows=${rows.length}`)
      return rows
    } catch (error) {
      console.error(`[${this.logTag}] [${tid}] fetchMerchantThreadMetaRows ERROR ${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : String(error || '')}`)
      return []
    }
  }

  async upsertMerchantThreadMeta(
    storeIdInput: string,
    conversationIdInput: string,
    merchantAliasInput: string | null,
    merchantArchivedInput: boolean,
    merchantArchivedAtMsInput: number,
    traceId?: string | null
  ): Promise<boolean> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || currentStoreId() || '').trim()
    const conversationId = String(conversationIdInput || '').trim()

    if (!storeId || !conversationId) {
      console.error(`[${this.logTag}] [${tid}] SKIP blank fields store=${storeId} conv=${conversationId}`)
      return false
    }

    const url = this.buildRestUrl(`${SHOWCASE_TABLES.chatThreadMeta}?on_conflict=store_id,conversation_id`)
    const body = [
      {
        store_id: storeId,
        conversation_id: conversationId,
        merchant_alias: normalizeNullableString(merchantAliasInput),
        merchant_archived: Boolean(merchantArchivedInput),
        merchant_archived_at_ms: Number.isFinite(Number(merchantArchivedAtMsInput))
          ? Number(merchantArchivedAtMsInput)
          : 0
      }
    ]

    console.error(`[${this.logTag}] [${tid}] upsertMerchantThreadMeta REQ url=${url} body=${JSON.stringify(body)}`)

    let result = await this.requestJson({
      url,
      method: 'POST',
      actor: ShowcaseCloudAuthActor.MERCHANT,
      scopeStoreId: storeId,
      scopeClientId: null,
      prefer: 'resolution=merge-duplicates,return=minimal',
      body
    })

    console.error(`[${this.logTag}] [${tid}] upsertMerchantThreadMeta RESP code=${result.code} body=${String(result.body || '').slice(0, 1200)}`)

    if (!result.ok) {
      console.error(`[${this.logTag}] [${tid}] upsertMerchantThreadMeta FAILED code=${result.code} body=${result.body || ''} url=${url}`)
    }

    return result.ok
  }

  async fetchMessagesByConversation(
    storeIdInput: string,
    conversationIdInput: string,
    clientIdInput: string | null = null,
    asMerchant = false,
    limitInput: number = SHOWCASE_PAGE_SIZE.chatMessages,
    traceId?: string | null,
    offsetInput = 0
  ): Promise<CloudMsg[]> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || currentStoreId() || '').trim()
    const conversationId = String(conversationIdInput || '').trim()
    const clientId = normalizeNullableString(clientIdInput)
    const limit = normalizeLimit(limitInput, SHOWCASE_PAGE_SIZE.chatMessages, 500)
    const offset = Math.max(0, Math.trunc(Number(offsetInput) || 0))

    if (!storeId || !conversationId) return []

    const select = 'id,conversation_id,store_id,client_id,role,direction,text,time_ms,is_read'
    const url = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatMessages}` +
      `?select=${select}` +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      `&conversation_id=eq.${encodeFilterValue(conversationId)}` +
      '&order=time_ms.desc' +
      `&limit=${limit}` +
      `&offset=${offset}`
    )

    console.error(`[${this.logTag}] [${tid}] fetchMessagesByConversation REQ url=${url}`)

    try {
      let result = await this.requestRaw({
        url,
        method: 'GET',
        actor: asMerchant ? ShowcaseCloudAuthActor.MERCHANT : ShowcaseCloudAuthActor.PUBLIC,
        scopeStoreId: storeId,
        scopeClientId: asMerchant ? null : clientId
      })

      if (!result.ok) {
        console.error(`[${this.logTag}] [${tid}] fetchMessagesByConversation FAILED code=${result.code} body=${result.body || ''} url=${url}`)
        return []
      }

      const rows = this.parseJsonArray(result.body)
        .map(item => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return null
          return parseCloudMsgRecord(item as Record<string, unknown>)
        })
        .filter((item): item is CloudMsg => Boolean(item?.id && item.conversationId && item.storeId))

      console.error(`[${this.logTag}] [${tid}] fetchMessagesByConversation OK rows=${rows.length}`)
      return rows
    } catch (error) {
      console.error(`[${this.logTag}] [${tid}] fetchMessagesByConversation ERROR ${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : String(error || '')}`)
      return []
    }
  }

  async fetchMessageById(
    storeIdInput: string,
    conversationIdInput: string,
    messageIdInput: string,
    clientIdInput: string | null = null,
    asMerchant = false,
    traceId?: string | null
  ): Promise<CloudMsg | null> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || currentStoreId() || '').trim()
    const conversationId = String(conversationIdInput || '').trim()
    const messageId = String(messageIdInput || '').trim()
    const clientId = normalizeNullableString(clientIdInput)

    if (!storeId || !conversationId || !messageId) return null

    const select = 'id,conversation_id,store_id,client_id,role,direction,text,time_ms,is_read'
    const url = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatMessages}` +
      `?select=${select}` +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      `&conversation_id=eq.${encodeFilterValue(conversationId)}` +
      `&id=eq.${encodeFilterValue(messageId)}` +
      '&limit=1'
    )

    console.error(`[${this.logTag}] [${tid}] fetchMessageById REQ url=${url}`)

    try {
      const result = await this.requestRaw({
        url,
        method: 'GET',
        actor: asMerchant ? ShowcaseCloudAuthActor.MERCHANT : ShowcaseCloudAuthActor.PUBLIC,
        scopeStoreId: storeId,
        scopeClientId: asMerchant ? null : clientId
      })

      if (!result.ok) {
        console.error(`[${this.logTag}] [${tid}] fetchMessageById FAILED code=${result.code} body=${result.body || ''} url=${url}`)
        return null
      }

      const row = this.parseJsonArray(result.body)
        .map(item => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return null
          return parseCloudMsgRecord(item as Record<string, unknown>)
        })
        .filter((item): item is CloudMsg => Boolean(item?.id && item.conversationId && item.storeId))[0] || null

      console.error(`[${this.logTag}] [${tid}] fetchMessageById OK found=${Boolean(row)}`)
      return row
    } catch (error) {
      console.error(`[${this.logTag}] [${tid}] fetchMessageById ERROR ${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : String(error || '')}`)
      return null
    }
  }

  async fetchMessagesBeforeTime(
    storeIdInput: string,
    conversationIdInput: string,
    timeMsInput: number,
    clientIdInput: string | null = null,
    asMerchant = false,
    limitInput: number = 15,
    traceId?: string | null
  ): Promise<CloudMsg[]> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || currentStoreId() || '').trim()
    const conversationId = String(conversationIdInput || '').trim()
    const clientId = normalizeNullableString(clientIdInput)
    const timeMs = Number(timeMsInput)
    const limit = normalizeLimit(limitInput, 15, 100)

    if (!storeId || !conversationId || !Number.isFinite(timeMs) || timeMs <= 0) return []

    const select = 'id,conversation_id,store_id,client_id,role,direction,text,time_ms,is_read'
    const url = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatMessages}` +
      `?select=${select}` +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      `&conversation_id=eq.${encodeFilterValue(conversationId)}` +
      `&time_ms=lt.${Math.trunc(timeMs)}` +
      '&order=time_ms.desc' +
      `&limit=${limit}`
    )

    console.error(`[${this.logTag}] [${tid}] fetchMessagesBeforeTime REQ url=${url}`)

    try {
      const result = await this.requestRaw({
        url,
        method: 'GET',
        actor: asMerchant ? ShowcaseCloudAuthActor.MERCHANT : ShowcaseCloudAuthActor.PUBLIC,
        scopeStoreId: storeId,
        scopeClientId: asMerchant ? null : clientId
      })

      if (!result.ok) {
        console.error(`[${this.logTag}] [${tid}] fetchMessagesBeforeTime FAILED code=${result.code} body=${result.body || ''} url=${url}`)
        return []
      }

      const rows = this.parseJsonArray(result.body)
        .map(item => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return null
          return parseCloudMsgRecord(item as Record<string, unknown>)
        })
        .filter((item): item is CloudMsg => Boolean(item?.id && item.conversationId && item.storeId))

      console.error(`[${this.logTag}] [${tid}] fetchMessagesBeforeTime OK rows=${rows.length}`)
      return rows
    } catch (error) {
      console.error(`[${this.logTag}] [${tid}] fetchMessagesBeforeTime ERROR ${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : String(error || '')}`)
      return []
    }
  }

  async fetchMessagesAfterTime(
    storeIdInput: string,
    conversationIdInput: string,
    timeMsInput: number,
    clientIdInput: string | null = null,
    asMerchant = false,
    limitInput: number = 15,
    traceId?: string | null
  ): Promise<CloudMsg[]> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || currentStoreId() || '').trim()
    const conversationId = String(conversationIdInput || '').trim()
    const clientId = normalizeNullableString(clientIdInput)
    const timeMs = Number(timeMsInput)
    const limit = normalizeLimit(limitInput, 15, 100)

    if (!storeId || !conversationId || !Number.isFinite(timeMs) || timeMs <= 0) return []

    const select = 'id,conversation_id,store_id,client_id,role,direction,text,time_ms,is_read'
    const url = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatMessages}` +
      `?select=${select}` +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      `&conversation_id=eq.${encodeFilterValue(conversationId)}` +
      `&time_ms=gt.${Math.trunc(timeMs)}` +
      '&order=time_ms.asc' +
      `&limit=${limit}`
    )

    console.error(`[${this.logTag}] [${tid}] fetchMessagesAfterTime REQ url=${url}`)

    try {
      const result = await this.requestRaw({
        url,
        method: 'GET',
        actor: asMerchant ? ShowcaseCloudAuthActor.MERCHANT : ShowcaseCloudAuthActor.PUBLIC,
        scopeStoreId: storeId,
        scopeClientId: asMerchant ? null : clientId
      })

      if (!result.ok) {
        console.error(`[${this.logTag}] [${tid}] fetchMessagesAfterTime FAILED code=${result.code} body=${result.body || ''} url=${url}`)
        return []
      }

      const rows = this.parseJsonArray(result.body)
        .map(item => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return null
          return parseCloudMsgRecord(item as Record<string, unknown>)
        })
        .filter((item): item is CloudMsg => Boolean(item?.id && item.conversationId && item.storeId))

      console.error(`[${this.logTag}] [${tid}] fetchMessagesAfterTime OK rows=${rows.length}`)
      return rows
    } catch (error) {
      console.error(`[${this.logTag}] [${tid}] fetchMessagesAfterTime ERROR ${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : String(error || '')}`)
      return []
    }
  }

  async searchMessagesByStoreKeyword(
    storeIdInput: string,
    keywordInput: string,
    asMerchant = true,
    clientIdInput: string | null = null,
    limitInput: number = SHOWCASE_PAGE_SIZE.chatSearchResults,
    traceId?: string | null,
    offsetInput = 0
  ): Promise<CloudMsg[]> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || currentStoreId() || '').trim()
    const keyword = String(keywordInput || '').trim()
    const clientId = normalizeNullableString(clientIdInput)
    const limit = normalizeLimit(limitInput, SHOWCASE_PAGE_SIZE.chatSearchResults, 200)
    const offset = Math.max(0, Math.trunc(Number(offsetInput) || 0))

    if (!storeId || !keyword) return []

    const select = 'id,conversation_id,store_id,client_id,role,direction,text,plain_text,time_ms,is_read'
    const url = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatMessages}` +
      `?select=${select}` +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      `&plain_text=ilike.*${encodeIlikeFilterValue(keyword)}*` +
      '&order=time_ms.desc' +
      `&limit=${limit}` +
      `&offset=${offset}`
    )

    console.error(`[${this.logTag}] [${tid}] searchMessagesByStoreKeyword REQ url=${url}`)

    try {
      const result = await this.requestRaw({
        url,
        method: 'GET',
        actor: asMerchant ? ShowcaseCloudAuthActor.MERCHANT : ShowcaseCloudAuthActor.PUBLIC,
        scopeStoreId: storeId,
        scopeClientId: asMerchant ? null : clientId
      })

      if (!result.ok) {
        console.error(`[${this.logTag}] [${tid}] searchMessagesByStoreKeyword FAILED code=${result.code} body=${result.body || ''} url=${url}`)
        throw new ShowcaseChatCloudQueryError('Failed to search store messages.', result.code, result.body)
      }

      const rows = this.parseJsonArray(result.body)
        .map(item => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return null
          return parseCloudMsgRecord(item as Record<string, unknown>)
        })
        .filter((item): item is CloudMsg => Boolean(item?.id && item.conversationId && item.storeId))

      console.error(`[${this.logTag}] [${tid}] searchMessagesByStoreKeyword OK rows=${rows.length}`)
      return rows
    } catch (error) {
      console.error(`[${this.logTag}] [${tid}] searchMessagesByStoreKeyword ERROR ${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : String(error || '')}`)
      if (error instanceof ShowcaseChatCloudQueryError) throw error
      throw new ShowcaseChatCloudQueryError(
        error instanceof Error ? error.message : 'Failed to search store messages.',
        0,
        null
      )
    }
  }

  async searchMessagesByConversationKeyword(
    storeIdInput: string,
    conversationIdInput: string,
    keywordInput: string,
    asMerchant = true,
    clientIdInput: string | null = null,
    limitInput: number = SHOWCASE_PAGE_SIZE.chatSearchResults,
    traceId?: string | null,
    offsetInput = 0
  ): Promise<CloudMsg[]> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || currentStoreId() || '').trim()
    const conversationId = String(conversationIdInput || '').trim()
    const keyword = String(keywordInput || '').trim()
    const clientId = normalizeNullableString(clientIdInput)
    const limit = normalizeLimit(limitInput, SHOWCASE_PAGE_SIZE.chatSearchResults, 200)
    const offset = Math.max(0, Math.trunc(Number(offsetInput) || 0))

    if (!storeId || !conversationId || !keyword) return []

    const select = 'id,conversation_id,store_id,client_id,role,direction,text,plain_text,time_ms,is_read'
    const url = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatMessages}` +
      `?select=${select}` +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      `&conversation_id=eq.${encodeFilterValue(conversationId)}` +
      `&plain_text=ilike.*${encodeIlikeFilterValue(keyword)}*` +
      '&order=time_ms.desc' +
      `&limit=${limit}` +
      `&offset=${offset}`
    )

    console.error(`[${this.logTag}] [${tid}] searchMessagesByConversationKeyword REQ url=${url}`)

    try {
      const result = await this.requestRaw({
        url,
        method: 'GET',
        actor: asMerchant ? ShowcaseCloudAuthActor.MERCHANT : ShowcaseCloudAuthActor.PUBLIC,
        scopeStoreId: storeId,
        scopeClientId: asMerchant ? null : clientId
      })

      if (!result.ok) {
        console.error(`[${this.logTag}] [${tid}] searchMessagesByConversationKeyword FAILED code=${result.code} body=${result.body || ''} url=${url}`)
        throw new ShowcaseChatCloudQueryError('Failed to search conversation messages.', result.code, result.body)
      }

      const rows = this.parseJsonArray(result.body)
        .map(item => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return null
          return parseCloudMsgRecord(item as Record<string, unknown>)
        })
        .filter((item): item is CloudMsg => Boolean(item?.id && item.conversationId && item.storeId))

      console.error(`[${this.logTag}] [${tid}] searchMessagesByConversationKeyword OK rows=${rows.length}`)
      return rows
    } catch (error) {
      console.error(`[${this.logTag}] [${tid}] searchMessagesByConversationKeyword ERROR ${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : String(error || '')}`)
      if (error instanceof ShowcaseChatCloudQueryError) throw error
      throw new ShowcaseChatCloudQueryError(
        error instanceof Error ? error.message : 'Failed to search conversation messages.',
        0,
        null
      )
    }
  }

  async fetchMediaMessagesByStore(
    storeIdInput: string,
    asMerchant = true,
    clientIdInput: string | null = null,
    limitInput: number = SHOWCASE_PAGE_SIZE.chatMediaItems,
    traceId?: string | null,
    offsetInput = 0
  ): Promise<CloudMsg[]> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || currentStoreId() || '').trim()
    const clientId = normalizeNullableString(clientIdInput)
    const limit = normalizeLimit(limitInput, SHOWCASE_PAGE_SIZE.chatMediaItems, 200)
    const offset = Math.max(0, Math.trunc(Number(offsetInput) || 0))

    if (!storeId) return []

    const select = 'id,conversation_id,store_id,client_id,role,direction,text,has_images,image_urls,time_ms,is_read'
    const url = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatMessages}` +
      `?select=${select}` +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      '&has_images=eq.true' +
      '&order=time_ms.desc' +
      `&limit=${limit}` +
      `&offset=${offset}`
    )

    console.error(`[${this.logTag}] [${tid}] fetchMediaMessagesByStore REQ url=${url}`)

    try {
      const result = await this.requestRaw({
        url,
        method: 'GET',
        actor: asMerchant ? ShowcaseCloudAuthActor.MERCHANT : ShowcaseCloudAuthActor.PUBLIC,
        scopeStoreId: storeId,
        scopeClientId: asMerchant ? null : clientId
      })

      if (!result.ok) {
        console.error(`[${this.logTag}] [${tid}] fetchMediaMessagesByStore FAILED code=${result.code} body=${result.body || ''} url=${url}`)
        throw new ShowcaseChatCloudQueryError('Failed to fetch store media messages.', result.code, result.body)
      }

      const rows = this.parseJsonArray(result.body)
        .map(item => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return null
          return parseCloudMsgRecord(item as Record<string, unknown>)
        })
        .filter((item): item is CloudMsg => Boolean(item?.id && item.conversationId && item.storeId))

      console.error(`[${this.logTag}] [${tid}] fetchMediaMessagesByStore OK rows=${rows.length}`)
      return rows
    } catch (error) {
      console.error(`[${this.logTag}] [${tid}] fetchMediaMessagesByStore ERROR ${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : String(error || '')}`)
      if (error instanceof ShowcaseChatCloudQueryError) throw error
      throw new ShowcaseChatCloudQueryError(
        error instanceof Error ? error.message : 'Failed to fetch store media messages.',
        0,
        null
      )
    }
  }

  async fetchMediaMessagesByConversation(
    storeIdInput: string,
    conversationIdInput: string,
    asMerchant = true,
    clientIdInput: string | null = null,
    limitInput: number = SHOWCASE_PAGE_SIZE.chatMediaItems,
    traceId?: string | null,
    offsetInput = 0
  ): Promise<CloudMsg[]> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || currentStoreId() || '').trim()
    const conversationId = String(conversationIdInput || '').trim()
    const clientId = normalizeNullableString(clientIdInput)
    const limit = normalizeLimit(limitInput, SHOWCASE_PAGE_SIZE.chatMediaItems, 200)
    const offset = Math.max(0, Math.trunc(Number(offsetInput) || 0))

    if (!storeId || !conversationId) return []

    const select = 'id,conversation_id,store_id,client_id,role,direction,text,has_images,image_urls,time_ms,is_read'
    const url = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatMessages}` +
      `?select=${select}` +
      `&store_id=eq.${encodeFilterValue(storeId)}` +
      `&conversation_id=eq.${encodeFilterValue(conversationId)}` +
      '&has_images=eq.true' +
      '&order=time_ms.desc' +
      `&limit=${limit}` +
      `&offset=${offset}`
    )

    console.error(`[${this.logTag}] [${tid}] fetchMediaMessagesByConversation REQ url=${url}`)

    try {
      const result = await this.requestRaw({
        url,
        method: 'GET',
        actor: asMerchant ? ShowcaseCloudAuthActor.MERCHANT : ShowcaseCloudAuthActor.PUBLIC,
        scopeStoreId: storeId,
        scopeClientId: asMerchant ? null : clientId
      })

      if (!result.ok) {
        console.error(`[${this.logTag}] [${tid}] fetchMediaMessagesByConversation FAILED code=${result.code} body=${result.body || ''} url=${url}`)
        throw new ShowcaseChatCloudQueryError('Failed to fetch conversation media messages.', result.code, result.body)
      }

      const rows = this.parseJsonArray(result.body)
        .map(item => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return null
          return parseCloudMsgRecord(item as Record<string, unknown>)
        })
        .filter((item): item is CloudMsg => Boolean(item?.id && item.conversationId && item.storeId))

      console.error(`[${this.logTag}] [${tid}] fetchMediaMessagesByConversation OK rows=${rows.length}`)
      return rows
    } catch (error) {
      console.error(`[${this.logTag}] [${tid}] fetchMediaMessagesByConversation ERROR ${error instanceof Error ? error.name : 'Error'}: ${error instanceof Error ? error.message : String(error || '')}`)
      if (error instanceof ShowcaseChatCloudQueryError) throw error
      throw new ShowcaseChatCloudQueryError(
        error instanceof Error ? error.message : 'Failed to fetch conversation media messages.',
        0,
        null
      )
    }
  }

  async insertMessage(msg: CloudMsg, traceId?: string | null): Promise<boolean> {
    const tid = this.effectiveTraceId(traceId)
    const id = String(msg.id || '').trim()
    const conversationId = String(msg.conversationId || '').trim()
    const storeId = String(msg.storeId || currentStoreId() || '').trim()
    const clientId = String(msg.clientId || '').trim()

    if (!id || !conversationId || !storeId || !clientId) {
      console.error(`[${this.logTag}] [${tid}] SKIP blank fields id=${id} conv=${conversationId} store=${storeId} client=${clientId}`)
      return false
    }

    const messageText = String(msg.text || '')
    const imageUrls = extractImageUrlsFromChatText(messageText)
    const plainText = extractPlainTextFromChatText(messageText)
    const url = this.buildRestUrl(`${SHOWCASE_TABLES.chatMessages}?on_conflict=id`)
    const body = [
      {
        id,
        conversation_id: conversationId,
        store_id: storeId,
        client_id: clientId,
        role: String(msg.role || '').trim(),
        direction: String(msg.direction || '').trim(),
        content: messageText,
        text: messageText,
        plain_text: plainText,
        has_images: imageUrls.length > 0,
        image_urls: imageUrls,
        time_ms: Number.isFinite(Number(msg.timeMs)) ? Number(msg.timeMs) : Date.now(),
        is_read: Boolean(msg.isRead)
      }
    ]

    console.error(`[${this.logTag}] [${tid}] cloud insertMessage REQ url=${url} bodyHead=${JSON.stringify(body).slice(0, 400)}`)

    const actor = isMerchantRole(msg.role)
      ? ShowcaseCloudAuthActor.MERCHANT
      : ShowcaseCloudAuthActor.PUBLIC

    let result = await this.requestJson({
      url,
      method: 'POST',
      actor,
      scopeStoreId: storeId,
      scopeClientId: actor === ShowcaseCloudAuthActor.PUBLIC ? clientId : null,
      prefer: 'resolution=merge-duplicates,return=minimal',
      body
    })

    console.error(`[${this.logTag}] [${tid}] cloud insertMessage RESP code=${result.code} body=${String(result.body || '').slice(0, 1200)}`)

    if (!result.ok) {
      console.error(`[${this.logTag}] [${tid}] insertMessage FAILED code=${result.code} body=${result.body || ''} url=${url}`)
      console.error(`[${this.logTag}] [${tid}] cloud insertMessage FAILED code=${result.code}`)
      return false
    }

    console.error(`[${this.logTag}] [${tid}] cloud insertMessage OK id=${id} code=${result.code}`)
    return true
  }

  async markUserMessagesRead(
    storeIdInput: string,
    conversationIdInput: string,
    traceId?: string | null
  ): Promise<boolean> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || currentStoreId() || '').trim()
    const conversationId = String(conversationIdInput || '').trim()

    if (!storeId || !conversationId) {
      console.error(`[${this.logTag}] [${tid}] SKIP blank conversationId`)
      return false
    }

    const url = this.buildRestUrl(
      `${SHOWCASE_TABLES.chatMessages}` +
      `?store_id=eq.${encodeFilterValue(storeId)}` +
      `&conversation_id=eq.${encodeFilterValue(conversationId)}` +
      '&role=eq.client' +
      '&is_read=eq.false'
    )
    const body = {
      is_read: true
    }

    console.error(`[${this.logTag}] [${tid}] cloud markUserMessagesRead REQ url=${url} body=${JSON.stringify(body)}`)

    let result = await this.requestJson({
      url,
      method: 'PATCH',
      actor: ShowcaseCloudAuthActor.MERCHANT,
      scopeStoreId: storeId,
      scopeClientId: null,
      prefer: 'return=minimal',
      body
    })

    console.error(`[${this.logTag}] [${tid}] cloud markUserMessagesRead RESP code=${result.code} body=${String(result.body || '').slice(0, 1200)}`)

    if (!result.ok) {
      console.error(`[${this.logTag}] [${tid}] markUserMessagesRead FAILED code=${result.code} body=${result.body || ''} url=${url}`)
    }

    return result.ok
  }

  async markMerchantMessagesRead(
    storeIdInput: string,
    conversationIdInput: string,
    clientIdInput: string,
    traceId?: string | null
  ): Promise<boolean> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || currentStoreId() || '').trim()
    const conversationId = String(conversationIdInput || '').trim()
    const clientId = String(clientIdInput || '').trim()

    if (!storeId || !conversationId) {
      console.error(`[${this.logTag}] [${tid}] SKIP blank conversationId`)
      return false
    }

    if (!clientId) {
      console.error(`[${this.logTag}] [${tid}] SKIP blank clientId`)
      return false
    }

    const url = this.buildRestUrl('rpc/ndjc_mark_merchant_messages_read')
    const body = {
      p_store_id: storeId,
      p_conversation_id: conversationId,
      p_client_id: clientId
    }

    console.error(`[${this.logTag}] [${tid}] cloud markMerchantMessagesRead RPC REQ url=${url} body=${JSON.stringify(body)}`)

    const result = await this.requestJson({
      url,
      method: 'POST',
      actor: ShowcaseCloudAuthActor.PUBLIC,
      scopeStoreId: storeId,
      scopeClientId: clientId,
      prefer: 'return=representation',
      body
    })

    console.error(`[${this.logTag}] [${tid}] cloud markMerchantMessagesRead RPC RES code=${result.code} ok=${result.ok} body=${String(result.body || '')} url=${url}`)

    return result.ok
  }

  async markMerchantMessagesReadByStoreAndClient(
    storeIdInput: string,
    clientIdInput: string,
    traceId?: string | null
  ): Promise<boolean> {
    const tid = this.effectiveTraceId(traceId)
    const storeId = String(storeIdInput || currentStoreId() || '').trim()
    const clientId = String(clientIdInput || '').trim()

    if (!storeId) {
      console.error(`[${this.logTag}] [${tid}] SKIP blank storeId`)
      return false
    }

    if (!clientId) {
      console.error(`[${this.logTag}] [${tid}] SKIP blank clientId`)
      return false
    }

    const url = this.buildRestUrl('rpc/ndjc_mark_merchant_messages_read_by_client')
    const body = {
      p_store_id: storeId,
      p_client_id: clientId
    }

    console.error(`[${this.logTag}] [${tid}] cloud markMerchantMessagesReadByStoreAndClient RPC REQ url=${url} body=${JSON.stringify(body)}`)

    const result = await this.requestJson({
      url,
      method: 'POST',
      actor: ShowcaseCloudAuthActor.PUBLIC,
      scopeStoreId: storeId,
      scopeClientId: clientId,
      prefer: 'return=representation',
      body
    })

    console.error(`[${this.logTag}] [${tid}] cloud markMerchantMessagesReadByStoreAndClient RPC RES code=${result.code} ok=${result.ok} body=${String(result.body || '')} url=${url}`)

    return result.ok
  }

  async uploadChatImageToPublicUrl(input: ChatImageUploadInput): Promise<string | null> {
    const tid = this.effectiveTraceId(input.traceId)
    const storeId = String(input.storeId || currentStoreId() || '').trim()
    const conversationId = String(input.conversationId || '').trim()
    const msgId = String(input.msgId || '').trim()
    const clientId = normalizeNullableString(input.clientId)
    const asMerchant = Boolean(input.asMerchant)
    const index = Math.max(0, Math.trunc(Number(input.index || 0)))
    const bytes = input.bytes
    const byteLength = uploadByteLength(bytes)

    this.lastChatImageUploadCode = null
    this.lastChatImageUploadBody = null

    if (!storeId || !conversationId || !msgId) {
      console.error(`[${this.logTag}] [${tid}] uploadChatImage SKIP blank fields store=${storeId} conv=${conversationId} msgId=${msgId}`)
      return null
    }

    if (!clientId) {
      console.error(`[${this.logTag}] [${tid}] uploadChatImage SKIP blank clientId`)
      return null
    }

    if (!byteLength) {
      console.error(`[${this.logTag}] [${tid}] uploadChatImage empty bytes msgId=${msgId}`)
      return null
    }

    const contentType = normalizeUploadContentType(input.contentType)
    const ext = extensionFromContentType(contentType)
    const safeStore = safeStoragePathPart(storeId)
    const safeClient = safeStoragePathPart(clientId || 'client')
    const safeConversation = safeStoragePathPart(conversationId)
    const objectPath = `${safeStore}/${safeClient}/${safeConversation}_${msgId}_${index}.${ext}`
    const bucket = SHOWCASE_BUCKETS.chatImages
    const uploadUrl = this.buildStorageObjectUrl(bucket, objectPath)

    console.error(`[${this.logTag}] [${tid}] uploadChatImage REQ url=${uploadUrl} bytes=${byteLength} ct=${contentType}`)

    const actor = asMerchant
      ? ShowcaseCloudAuthActor.MERCHANT
      : ShowcaseCloudAuthActor.PUBLIC

    const result = await this.requestRaw({
      url: uploadUrl,
      method: 'POST',
      actor,
      scopeStoreId: storeId,
      scopeClientId: asMerchant ? null : clientId,
      body: bytes,
      contentType,
      accept: 'application/json',
      extraHeaders: {
        'x-upsert': 'true'
      }
    })

    this.lastChatImageUploadCode = result.code
    this.lastChatImageUploadBody = result.body

    console.error(`[${this.logTag}] [${tid}] uploadChatImage RESP code=${result.code} body=${String(result.body || '').slice(0, 600)}`)

    if (!result.ok) {
      return null
    }

    return this.buildStoragePublicObjectUrl(bucket, objectPath)
  }
}

export function createShowcaseChatCloudRepository(
  options: string | ShowcaseChatCloudRepositoryOptions = 'ChatTrace'
): ShowcaseChatCloudRepository {
  return new ShowcaseChatCloudRepository(options)
}