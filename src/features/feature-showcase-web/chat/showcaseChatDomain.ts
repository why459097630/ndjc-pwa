import type {
  ShowcaseChatAppointmentShare,
  ShowcaseChatMessage as ShowcaseUiContractChatMessage,
  ShowcaseChatProductShare
} from '../showcaseUiContract'
import type { ShowcaseImageVariants } from '../showcaseModels'
import {
  formatShowcaseDateTime
} from '../showcaseDateTime'
import {
  newLocalChatId,
  type ShowcaseChatDirection,
  type ShowcaseChatMessage,
  type ShowcaseChatMessageUi,
  type ShowcaseChatSendStatus,
  type ShowcaseChatUiStateDomain
} from './showcaseChatModels'

export const NDJC_QUOTE_START = '⟪Q⟫'
export const NDJC_QUOTE_END = '⟪/Q⟫'

export const NDJC_IMG_START = '⟪I⟫'
export const NDJC_IMG_END = '⟪/I⟫'

export const NDJC_IMG_VARIANTS_START = '⟪IV⟫'
export const NDJC_IMG_VARIANTS_END = '⟪/IV⟫'

export const NDJC_PRODUCT_START = '⟪P⟫'
export const NDJC_PRODUCT_END = '⟪/P⟫'

export const NDJC_APPOINTMENT_START = '⟪B⟫'
export const NDJC_APPOINTMENT_END = '⟪/B⟫'

export type NdjcParsedQuote = {
  body: string
  quoteMessageId: string | null
  quotePreview: string | null
}

export type NdjcParsedImages = {
  imageUris: string[]
  imageVariants: ShowcaseImageVariants[]
  innerText: string
}

export type NdjcParsedProduct = {
  dishId: string
  title: string
  price: string
  originalPriceText: string | null
  discountPriceText: string | null
  imageUrl: string | null
  imageVariants: ShowcaseImageVariants | null
  isRecommended: boolean
}

export type NdjcParsedAppointment = {
  appointmentId: string
  title: string
  preferredDate: string
  preferredTime: string
  statusLabel: string
  imageUrl: string | null
  imageVariants: ShowcaseImageVariants | null
  customerName: string
  customerContact: string
  note: string
  sourceDishId: string | null
  priceText: string | null
  originalPriceText: string | null
  discountPriceText: string | null
  categoryText: string | null
  itemAvailable: boolean
  createdAtText: string
}

export type ShowcaseChatLocalEntity = {
  id: string
  storeId: string
  role: string
  direction: 'in' | 'out' | string
  text: string
  timeMs: number
  status: 'sending' | 'sent' | 'failed' | string
  isRead: boolean
  conversationId: string
  clientId: string
}

export type ShowcaseChatSendBuildResult = {
  state: ShowcaseChatUiStateDomain
  messages: ShowcaseChatMessageUi[]
}

export type ShowcaseChatServerMessageToUiInput = {
  message: ShowcaseChatMessage
  currentClientId?: string | null
}

export function parseNdjcQuotePayload(text: string): NdjcParsedQuote {
  const source = String(text || '')

  if (!source.startsWith(NDJC_QUOTE_START)) {
    return {
      body: source,
      quoteMessageId: null,
      quotePreview: null
    }
  }

  const endIndex = source.indexOf(NDJC_QUOTE_END)

  if (endIndex <= NDJC_QUOTE_START.length) {
    return {
      body: source,
      quoteMessageId: null,
      quotePreview: null
    }
  }

  const quoteRaw = source.slice(NDJC_QUOTE_START.length, endIndex).trim()
  const rest = source
    .slice(endIndex + NDJC_QUOTE_END.length)
    .replace(/^[\n ]+/, '')

  const firstNewLine = quoteRaw.indexOf('\n')
  const quoteMessageId = firstNewLine > 0
    ? quoteRaw.slice(0, firstNewLine).trim() || null
    : null

  const quotePreview = firstNewLine > 0
    ? quoteRaw.slice(firstNewLine + 1).replace(/^[\n ]+/, '')
    : quoteRaw

  return {
    body: rest,
    quoteMessageId,
    quotePreview: quotePreview.trim() || null
  }
}

export function buildNdjcQuotePayload(
  rawBody: string,
  quoteMessageId: string | null | undefined,
  quotePreview: string | null | undefined
): string {
  const body = String(rawBody || '')
  const preview = String(quotePreview || '').trim()

  if (!preview) return body

  const safeId = String(quoteMessageId || '')
    .replace(/\n/g, ' ')
    .trim()

  const inner = safeId ? `${safeId}\n${preview}` : preview

  return `${NDJC_QUOTE_START}${inner}${NDJC_QUOTE_END}\n${body}`
}

function encodeImageVariantListForPayload(variants: ReadonlyArray<ShowcaseImageVariants | null | undefined> | null | undefined): string {
  if (!variants?.length) return ''

  const encoded = variants
    .map(item => encodeImageVariantsForPayload(item))
    .filter(Boolean)

  if (!encoded.length) return ''

  return encoded.join('|')
}

function decodeImageVariantListFromPayload(value: string | null | undefined): ShowcaseImageVariants[] {
  const raw = String(value || '').trim()
  if (!raw) return []

  return raw
    .split('|')
    .map(item => decodeImageVariantsFromPayload(item))
    .filter((item): item is ShowcaseImageVariants => item !== null)
    .slice(0, 9)
}

function parseNdjcImageVariantsText(text: string): {
  imageVariants: ShowcaseImageVariants[]
  innerText: string
} {
  const source = String(text || '')

  if (!source.startsWith(NDJC_IMG_VARIANTS_START)) {
    return {
      imageVariants: [],
      innerText: source
    }
  }

  const endIndex = source.indexOf(NDJC_IMG_VARIANTS_END)

  if (endIndex <= NDJC_IMG_VARIANTS_START.length) {
    return {
      imageVariants: [],
      innerText: source
    }
  }

  const variantsRaw = source.slice(NDJC_IMG_VARIANTS_START.length, endIndex).trim()
  const innerText = source
    .slice(endIndex + NDJC_IMG_VARIANTS_END.length)
    .replace(/^[\n ]+/, '')

  return {
    imageVariants: decodeImageVariantListFromPayload(variantsRaw),
    innerText
  }
}

export function parseNdjcImages(text: string): NdjcParsedImages {
  const source = String(text || '')

  if (!source.startsWith(NDJC_IMG_START)) {
    return {
      imageUris: [],
      imageVariants: [],
      innerText: source
    }
  }

  const endIndex = source.indexOf(NDJC_IMG_END)

  if (endIndex <= NDJC_IMG_START.length) {
    return {
      imageUris: [],
      imageVariants: [],
      innerText: source
    }
  }

  const urisRaw = source.slice(NDJC_IMG_START.length, endIndex).trim()
  const imageVariantParsed = parseNdjcImageVariantsText(
    source
      .slice(endIndex + NDJC_IMG_END.length)
      .replace(/^[\n ]+/, '')
  )

  const imageUris = uniqueNonEmptyStrings(urisRaw.split('|')).slice(0, 9)

  return {
    imageUris,
    imageVariants: imageVariantParsed.imageVariants.length
      ? imageVariantParsed.imageVariants
      : imageUris
        .map(url => createRemoteOnlyImageVariantsForChat(url))
        .filter((item): item is ShowcaseImageVariants => item !== null),
    innerText: imageVariantParsed.innerText
  }
}

export function rebuildNdjcImages(
  imageUris: string[],
  innerText: string,
  imageVariants: ReadonlyArray<ShowcaseImageVariants | null | undefined> = []
): string {
  const images = uniqueNonEmptyStrings(imageUris).slice(0, 9)
  const text = String(innerText || '')

  if (!images.length) return text

  const variantPayload = encodeImageVariantListForPayload(imageVariants)

  if (!variantPayload) {
    return `${NDJC_IMG_START}${images.join('|')}${NDJC_IMG_END}\n${text}`
  }

  return `${NDJC_IMG_START}${images.join('|')}${NDJC_IMG_END}\n${NDJC_IMG_VARIANTS_START}${variantPayload}${NDJC_IMG_VARIANTS_END}\n${text}`
}

export function buildNdjcChatPayload(input: {
  rawBody: string
  quoteMessageId?: string | null
  quotePreview?: string | null
  imageUris?: string[]
  imageVariants?: ReadonlyArray<ShowcaseImageVariants | null | undefined>
}): string {
  const inner = buildNdjcQuotePayload(
    input.rawBody,
    input.quoteMessageId ?? null,
    input.quotePreview ?? null
  )

  return rebuildNdjcImages(input.imageUris || [], inner, input.imageVariants || [])
}

function encodeImageVariantsForPayload(variants: ShowcaseImageVariants | null | undefined): string {
  if (!variants) return ''

  try {
    return encodeURIComponent(JSON.stringify({
      originalUrl: variants.originalUrl || null,
      largeUrl: variants.largeUrl || null,
      mediumUrl: variants.mediumUrl || null,
      thumbUrl: variants.thumbUrl || null,
      blurDataUrl: variants.blurDataUrl || null
    }))
  } catch {
    return ''
  }
}

function decodeImageVariantsFromPayload(value: string | null | undefined): ShowcaseImageVariants | null {
  const raw = String(value || '').trim()
  if (!raw) return null

  try {
    const parsed = JSON.parse(decodeURIComponent(raw))
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null

    const record = parsed as Record<string, unknown>
    const variants: ShowcaseImageVariants = {
      originalUrl: String(record.originalUrl || '').trim() || null,
      largeUrl: String(record.largeUrl || '').trim() || null,
      mediumUrl: String(record.mediumUrl || '').trim() || null,
      thumbUrl: String(record.thumbUrl || '').trim() || null,
      blurDataUrl: String(record.blurDataUrl || '').trim() || null
    }

    if (
      !variants.originalUrl &&
      !variants.largeUrl &&
      !variants.mediumUrl &&
      !variants.thumbUrl &&
      !variants.blurDataUrl
    ) {
      return null
    }

    return variants
  } catch {
    return null
  }
}

function createRemoteOnlyImageVariantsForChat(urlInput: string | null | undefined): ShowcaseImageVariants | null {
  const url = String(urlInput || '').trim()

  if (!url) return null

  return {
    originalUrl: url,
    largeUrl: url,
    mediumUrl: url,
    thumbUrl: url,
    blurDataUrl: null
  }
}

export function buildNdjcProductSharePayload(product: ShowcaseChatProductShare): string {
  const safe = [
    product.dishId,
    product.title,
    product.price,
    product.imageUrl || '',
    product.isRecommended ? '1' : '0',
    product.originalPriceText || '',
    product.discountPriceText || '',
    encodeImageVariantsForPayload(product.imageVariants ?? null)
  ].map(item => String(item || '').replace(/\n/g, ' ').replace(/\|/g, ' '))

  return `${NDJC_PRODUCT_START}\n${safe.join('|')}\n${NDJC_PRODUCT_END}`
}

export function buildProductSharePayloadForClipboard(product: ShowcaseChatProductShare): string {
  return buildNdjcProductSharePayload(product)
}

export function buildNdjcAppointmentSharePayload(appointment: ShowcaseChatAppointmentShare): string {
  const safe = [
    appointment.appointmentId,
    appointment.title,
    appointment.preferredDate,
    appointment.preferredTime,
    appointment.statusLabel,
    appointment.imageUrl || '',
    appointment.customerName,
    appointment.customerContact,
    appointment.note,
    appointment.sourceDishId || '',
    appointment.priceText || '',
    appointment.categoryText || '',
    appointment.itemAvailable ? '1' : '0',
    appointment.createdAtText,
    appointment.originalPriceText || '',
    appointment.discountPriceText || '',
    encodeImageVariantsForPayload(appointment.imageVariants ?? null)
  ].map(item => String(item || '').replace(/\n/g, ' ').replace(/\|/g, ' '))

  return `${NDJC_APPOINTMENT_START}\n${safe.join('|')}\n${NDJC_APPOINTMENT_END}`
}

export function parseNdjcAppointmentSharePayload(text: string): NdjcParsedAppointment | null {
  const source = String(text || '').trim()
  const start = source.indexOf(NDJC_APPOINTMENT_START)
  const end = source.indexOf(NDJC_APPOINTMENT_END)

  if (start < 0 || end < 0 || end <= start) return null

  const inner = source
    .slice(start + NDJC_APPOINTMENT_START.length, end)
    .trim()

  const line = inner
    .split(/\r?\n/)
    .find(item => item.trim())

  if (!line) return null

  const parts = line.split('|')
  const appointmentId = String(parts[0] || '').trim()
  const title = String(parts[1] || '').trim()
  const preferredDate = String(parts[2] || '').trim()
  const preferredTime = String(parts[3] || '').trim()
  const statusLabel = String(parts[4] || '').trim()
  const imageUrl = String(parts[5] || '').trim() || null
  const customerName = String(parts[6] || '').trim()
  const customerContact = String(parts[7] || '').trim()
  const note = String(parts[8] || '').trim()
  const sourceDishId = String(parts[9] || '').trim() || null
  const priceText = String(parts[10] || '').trim() || null
  const categoryText = String(parts[11] || '').trim() || null
  const itemAvailable = String(parts[12] || '1').trim() !== '0'
  const createdAtText = String(parts[13] || '').trim()
  const originalPriceText = String(parts[14] || '').trim() || priceText || null
  const discountPriceText = String(parts[15] || '').trim() || null

  if (!appointmentId && !title) return null

  return {
    appointmentId,
    title,
    preferredDate,
    preferredTime,
    statusLabel,
    imageUrl,
    imageVariants: decodeImageVariantsFromPayload(parts[16]) ?? createRemoteOnlyImageVariantsForChat(imageUrl),
    customerName,
    customerContact,
    note,
    sourceDishId,
    priceText,
    originalPriceText,
    discountPriceText,
    categoryText,
    itemAvailable,
    createdAtText
  }
}

export function buildAppointmentSharePayloadForClipboard(appointment: ShowcaseChatAppointmentShare): string {
  return buildNdjcAppointmentSharePayload(appointment)
}

export function parseNdjcProductSharePayload(text: string): NdjcParsedProduct | null {
  const source = String(text || '').trim()
  const start = source.indexOf(NDJC_PRODUCT_START)
  const end = source.indexOf(NDJC_PRODUCT_END)

  if (start < 0 || end < 0 || end <= start) return null

  const inner = source
    .slice(start + NDJC_PRODUCT_START.length, end)
    .trim()

  const line = inner
    .split(/\r?\n/)
    .find(item => item.trim())

  if (!line) return null

  const parts = line.split('|')
  const dishId = String(parts[0] || '').trim()
  const title = String(parts[1] || '').trim()
  const price = String(parts[2] || '').trim()
  const imageUrl = String(parts[3] || '').trim() || null
  const isRecommended = String(parts[4] || '').trim() === '1'
  const originalPriceText = String(parts[5] || '').trim() || price || null
  const discountPriceText = String(parts[6] || '').trim() || null

  if (!dishId && !title) return null

  return {
    dishId,
    title,
    price,
    originalPriceText,
    discountPriceText,
    imageUrl,
    imageVariants: decodeImageVariantsFromPayload(parts[7]) ?? createRemoteOnlyImageVariantsForChat(imageUrl),
    isRecommended
  }
}

export function parseNdjcChatPayload(text: string): {
  body: string
  imageUris: string[]
  imageVariants: ShowcaseImageVariants[]
  quoteMessageId: string | null
  quotePreview: string | null
  product: NdjcParsedProduct | null
  appointment: NdjcParsedAppointment | null
} {
  const imageParsed = parseNdjcImages(text)
  const quoteParsed = parseNdjcQuotePayload(imageParsed.innerText)
  const product = parseNdjcProductSharePayload(quoteParsed.body)
  const appointment = product ? null : parseNdjcAppointmentSharePayload(quoteParsed.body)

  return {
    body: product || appointment ? '' : quoteParsed.body,
    imageUris: imageParsed.imageUris,
    imageVariants: imageParsed.imageVariants.length
      ? imageParsed.imageVariants
      : imageParsed.imageUris
        .map(url => createRemoteOnlyImageVariantsForChat(url))
        .filter((item): item is ShowcaseImageVariants => item !== null),
    quoteMessageId: quoteParsed.quoteMessageId,
    quotePreview: quoteParsed.quotePreview,
    product,
    appointment
  }
}

export function isLocalImageUri(uri: string): boolean {
  const value = String(uri || '').trim()

  return (
    value.startsWith('content://') ||
    value.startsWith('file://') ||
    value.startsWith('blob:') ||
    value.startsWith('data:image/')
  )
}

export function applyDraftTextChange(
  state: ShowcaseChatUiStateDomain,
  text: string
): ShowcaseChatUiStateDomain {
  const parsedProduct = parseNdjcProductSharePayload(text)

  if (parsedProduct) {
    return {
      ...state,
      pendingProduct: {
        dishId: parsedProduct.dishId,
        title: parsedProduct.title,
        price: parsedProduct.price,
        originalPriceText: parsedProduct.originalPriceText,
        discountPriceText: parsedProduct.discountPriceText,
        imageUrl: parsedProduct.imageUrl,
        imageVariants: parsedProduct.imageVariants,
        isRecommended: parsedProduct.isRecommended
      },
      draftText: '',
      quoteMessageId: null,
      quotePreviewText: '',
      quote: null
    }
  }

  return {
    ...state,
    draftText: text
  }
}

export function setPendingProductShare(
  state: ShowcaseChatUiStateDomain,
  product: ShowcaseChatProductShare | null
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    pendingProduct: product,
    quoteMessageId: null,
    quotePreviewText: '',
    quote: null
  }
}

export function clearPendingProductShare(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    pendingProduct: null
  }
}

export function applyPendingAppointmentForChat(input: {
  draftText: string
  draftImageUris: string[]
  currentQuoteMessageId: string | null
  appointment: ShowcaseChatAppointmentShare | null
}): {
  pendingAppointment: ShowcaseChatAppointmentShare | null
  quoteMessageId: string | null
  draftText: string
  draftImageUris: string[]
} {
  if (input.appointment) {
    return {
      pendingAppointment: input.appointment,
      quoteMessageId: null,
      draftText: input.draftText,
      draftImageUris: input.draftImageUris
    }
  }

  return {
    pendingAppointment: null,
    quoteMessageId: input.currentQuoteMessageId,
    draftText: input.draftText,
    draftImageUris: input.draftImageUris
  }
}

export function clearPendingAppointmentShare(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    pendingAppointment: null
  }
}

export function addDraftImages(
  state: ShowcaseChatUiStateDomain,
  uriStrings: string[]
): ShowcaseChatUiStateDomain {
  const merged = uniqueNonEmptyStrings([
    ...state.draftImageUris,
    ...uriStrings
  ]).slice(0, 9)

  return {
    ...state,
    draftImageUris: merged
  }
}

export function removeDraftImage(
  state: ShowcaseChatUiStateDomain,
  uriString: string
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    draftImageUris: state.draftImageUris.filter(item => item !== uriString)
  }
}

export function setPendingCameraUri(
  state: ShowcaseChatUiStateDomain,
  uriString: string | null
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    pendingCameraUri: uriString
  }
}

export function buildQuotePayloadForSend(
  state: ShowcaseChatUiStateDomain,
  quoteMessageId: string | null | undefined,
  quotePreviewText: string
): string | null {
  const quoteId = String(quoteMessageId || '').trim()

  if (!quoteId) return null

  const quotedMessage = state.messages.find(item => item.id === quoteId)

  if (!quotedMessage) {
    return quotePreviewText.trim() || null
  }

  const product = parseNdjcProductSharePayload(quotedMessage.text)

  if (product) {
    return buildNdjcProductSharePayload({
      dishId: product.dishId,
      title: product.title,
      price: product.price,
      originalPriceText: product.originalPriceText,
      discountPriceText: product.discountPriceText,
      imageUrl: product.imageUrl,
      isRecommended: product.isRecommended
    })
  }

  return quotePreviewText.trim() || null
}

export function buildOutgoingMessagesForSend(input: {
  state: ShowcaseChatUiStateDomain
  nowMs?: number
  isCloud?: boolean
  timeFormatter?: (date: Date) => string
}): ShowcaseChatSendBuildResult | null {
  const state = input.state
  const raw = state.draftText.trim()
  const images = uniqueNonEmptyStrings(state.draftImageUris).slice(0, 9)

  if (!raw && !images.length) return null

  const now = Number.isFinite(Number(input.nowMs)) ? Number(input.nowMs) : Date.now()
  const formatter = input.timeFormatter || formatChatTime
  const quoteId = state.quoteMessageId
  const quotePreview = state.quotePreviewText.trim()
  const quotePayloadForSend = buildQuotePayloadForSend(state, quoteId, quotePreview)
  const newId = () => input.isCloud ? createUuidLikeId() : newLocalChatId()

  const messages: ShowcaseChatMessageUi[] = images.length === 0
    ? [
      {
        id: newId(),
        direction: 'Outgoing',
        text: buildNdjcChatPayload({
          rawBody: raw,
          quoteMessageId: quoteId,
          quotePreview: quotePayloadForSend,
          imageUris: []
        }),
        timeText: formatter(new Date(now)),
        status: 'Sending',
        isRead: false,
        quoteMessageId: quoteId ?? null,
        quotePreviewText: quotePreview,
        isPinned: false,
        isFindOpen: false,
        findQuery: '',
        findMatchIds: [],
        findFocusedId: null,
        scrollToMessageId: null,
        scrollToMessageSignal: 0
      }
    ]
    : images.map((imageUri, index) => {
      const isFirst = index === 0

      return {
        id: newId(),
        direction: 'Outgoing',
        text: buildNdjcChatPayload({
          rawBody: isFirst ? raw : '',
          quoteMessageId: isFirst ? quoteId : null,
          quotePreview: isFirst ? quotePayloadForSend : null,
          imageUris: [imageUri]
        }),
        timeText: formatter(new Date(now + index)),
        status: 'Sending',
        isRead: false,
        quoteMessageId: isFirst ? quoteId ?? null : null,
        quotePreviewText: isFirst ? quotePreview : '',
        isPinned: false,
        isFindOpen: false,
        findQuery: '',
        findMatchIds: [],
        findFocusedId: null,
        scrollToMessageId: null,
        scrollToMessageSignal: 0
      }
    })

  return {
    messages,
    state: {
      ...state,
      draftText: '',
      draftImageUris: [],
      pendingCameraUri: null,
      isSending: true,
      quoteMessageId: null,
      quotePreviewText: '',
      quote: null,
      messages: distinctMessagesById([...state.messages, ...messages]),
      scrollToBottomSignal: now,
      errorMessage: null
    }
  }
}

export function applySendResult(
  state: ShowcaseChatUiStateDomain,
  messageIds: string[],
  okMap: Record<string, boolean>
): ShowcaseChatUiStateDomain {
  const idSet = new Set(messageIds)

  return {
    ...state,
    isSending: false,
    messages: state.messages.map(message => {
      if (!idSet.has(message.id)) return message
      return {
        ...message,
        status: okMap[message.id] ? 'Sent' : 'Failed'
      }
    })
  }
}

export function applySendFailure(
  state: ShowcaseChatUiStateDomain,
  messageIds: string[],
  errorMessage: string
): ShowcaseChatUiStateDomain {
  const idSet = new Set(messageIds)

  return {
    ...state,
    isSending: false,
    errorMessage,
    messages: state.messages.map(message => {
      if (!idSet.has(message.id)) return message
      return {
        ...message,
        status: 'Failed'
      }
    })
  }
}

export function quoteMessage(
  state: ShowcaseChatUiStateDomain,
  messageId: string
): ShowcaseChatUiStateDomain {
  const message = state.messages.find(item => item.id === messageId)
  if (!message) return state

  const product = parseNdjcProductSharePayload(message.text)

  const preview = product
    ? buildProductQuotePreview(product)
    : parseNdjcQuotePayload(message.text).body.replace(/\n/g, ' ').slice(0, 60)

  return {
    ...state,
    quoteMessageId: messageId,
    quotePreviewText: preview,
    pendingProduct: null,
    quote: null,
    isSelectionMode: false,
    selectedIds: []
  }
}

export function cancelQuote(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    quoteMessageId: null,
    quotePreviewText: '',
    quote: null
  }
}

export function enterSelection(
  state: ShowcaseChatUiStateDomain,
  messageId: string
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    isSelectionMode: true,
    selectedIds: [messageId],
    quote: null
  }
}

export function toggleSelection(
  state: ShowcaseChatUiStateDomain,
  messageId: string
): ShowcaseChatUiStateDomain {
  if (!state.isSelectionMode) {
    return enterSelection(state, messageId)
  }

  const selectedSet = new Set(state.selectedIds)

  if (selectedSet.has(messageId)) {
    selectedSet.delete(messageId)
  } else {
    selectedSet.add(messageId)
  }

  const nextSelected = Array.from(selectedSet)

  if (!nextSelected.length) {
    return {
      ...state,
      isSelectionMode: false,
      selectedIds: []
    }
  }

  return {
    ...state,
    selectedIds: nextSelected
  }
}

export function exitSelection(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    isSelectionMode: false,
    selectedIds: []
  }
}

export function setPinnedUi(
  state: ShowcaseChatUiStateDomain,
  pinned: boolean
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    isPinned: pinned,
    subtitle: pinned ? 'Pinned' : ''
  }
}

export function togglePinnedUi(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  return setPinnedUi(state, !state.isPinned)
}

export function openFind(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    isSearchResults: true,
    isFindOpen: true
  }
}

export function closeFind(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    isSearchResults: false,
    isFindOpen: false,
    findQuery: '',
    globalSearchResults: [],
    findMatchIds: [],
    findFocusedId: null,
    scrollToMessageId: null,
    scrollToMessageSignal: Date.now()
  }
}

export function hideFindKeepState(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    isSearchResults: false,
    isFindOpen: false
  }
}

export function onFindQueryChange(
  state: ShowcaseChatUiStateDomain,
  queryInput: string
): ShowcaseChatUiStateDomain {
  const query = queryInput.trim()

  if (!query) {
    return {
      ...state,
      findQuery: queryInput,
      findMatchIds: [],
      findFocusedId: null,
      scrollToMessageId: null
    }
  }

  const matches = state.messages
    .filter(message => message.text.toLowerCase().includes(query.toLowerCase()))
    .map(message => message.id)

  const focused = matches[0] || null

  return {
    ...state,
    findQuery: queryInput,
    findMatchIds: matches,
    findFocusedId: focused,
    scrollToMessageId: focused,
    scrollToMessageSignal: Date.now()
  }
}

export function findNext(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  const ids = state.findMatchIds
  if (!ids.length) return state

  const current = state.findFocusedId
  const currentIndex = current == null ? -1 : ids.indexOf(current)
  const next = ids[Math.max(currentIndex + 1, 0) % ids.length]

  return {
    ...state,
    findFocusedId: next,
    scrollToMessageId: next,
    scrollToMessageSignal: Date.now()
  }
}

export function findPrev(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  const ids = state.findMatchIds
  if (!ids.length) return state

  const current = state.findFocusedId
  const currentIndex = current == null ? 0 : Math.max(ids.indexOf(current), 0)
  const previous = ids[(currentIndex - 1 + ids.length) % ids.length]

  return {
    ...state,
    findFocusedId: previous,
    scrollToMessageId: previous,
    scrollToMessageSignal: Date.now()
  }
}

export function jumpToMessage(
  state: ShowcaseChatUiStateDomain,
  messageId: string
): ShowcaseChatUiStateDomain {
  const id = messageId.trim()
  if (!id) return state

  return {
    ...state,
    scrollToMessageId: id,
    scrollToMessageSignal: Date.now(),
    flashMessageId: id,
    flashSignal: Date.now()
  }
}

export function clearFlash(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  if (state.flashMessageId == null) return state

  return {
    ...state,
    flashMessageId: null
  }
}

export function clearJumpOnExit(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    scrollToMessageId: null,
    scrollToMessageSignal: Date.now(),
    flashMessageId: null
  }
}

export function deleteSelectedMessagesFromState(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  if (!state.selectedIds.length) return state

  const selectedSet = new Set(state.selectedIds)

  return {
    ...state,
    messages: state.messages.filter(message => !selectedSet.has(message.id)),
    isSelectionMode: false,
    selectedIds: []
  }
}

export function deleteOneMessageFromState(
  state: ShowcaseChatUiStateDomain,
  messageId: string
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    messages: state.messages.filter(message => message.id !== messageId)
  }
}

export function markRetrySending(
  state: ShowcaseChatUiStateDomain,
  messageId: string
): ShowcaseChatUiStateDomain {
  const message = state.messages.find(item => item.id === messageId)

  if (!message) return state
  if (message.direction !== 'Outgoing') return state
  if (message.status !== 'Failed') return state

  return {
    ...state,
    isSending: true,
    errorMessage: null,
    messages: state.messages.map(item => {
      if (item.id !== messageId) return item
      return {
        ...item,
        status: 'Sending'
      }
    })
  }
}

export function markRetryResult(
  state: ShowcaseChatUiStateDomain,
  messageId: string,
  ok: boolean,
  errorMessage: string | null = null
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    isSending: false,
    errorMessage: ok ? state.errorMessage : errorMessage || 'retry local save failed',
    messages: state.messages.map(message => {
      if (message.id !== messageId) return message
      return {
        ...message,
        status: ok ? 'Sent' : 'Failed'
      }
    })
  }
}

export function clearLocalChatState(
  state: ShowcaseChatUiStateDomain
): ShowcaseChatUiStateDomain {
  return {
    ...state,
    messages: [],
    errorMessage: null,
    scrollToBottomSignal: Date.now()
  }
}

export function entityToUi(input: {
  entity: ShowcaseChatLocalEntity
  perspectiveRole: 'merchant' | 'client' | string
  timeFormatter?: (date: Date) => string
}): ShowcaseChatMessageUi {
  const entity = input.entity
  const outgoingInMerchantPerspective = entity.direction === 'out'
  const isOutgoingForThisUi = input.perspectiveRole === 'merchant'
    ? outgoingInMerchantPerspective
    : !outgoingInMerchantPerspective

  const direction: ShowcaseChatDirection = isOutgoingForThisUi ? 'Outgoing' : 'Incoming'
  const status: ShowcaseChatSendStatus = entity.status === 'failed'
    ? 'Failed'
    : entity.status === 'sending'
      ? 'Sending'
      : 'Sent'

  const formatter = input.timeFormatter || formatChatTime

  return {
    id: entity.id,
    direction,
    text: entity.text,
    timeText: formatter(new Date(entity.timeMs)),
    status,
    isRead: Boolean(entity.isRead),
    quoteMessageId: null,
    quotePreviewText: '',
    isPinned: false,
    isFindOpen: false,
    findQuery: '',
    findMatchIds: [],
    findFocusedId: null,
    scrollToMessageId: null,
    scrollToMessageSignal: 0
  }
}

export function uiToEntity(input: {
  storeId: string
  role: 'merchant' | 'client' | string
  ui: ShowcaseChatMessageUi
  timeMs: number
  conversationId: string
  clientId: string
}): ShowcaseChatLocalEntity {
  const direction = input.role === 'merchant' ? 'out' : 'in'
  const status = input.ui.status === 'Failed'
    ? 'failed'
    : input.ui.status === 'Sending'
      ? 'sending'
      : 'sent'

  return {
    id: input.ui.id,
    storeId: input.storeId,
    role: input.role,
    direction,
    text: input.ui.text,
    timeMs: input.timeMs,
    status,
    isRead: input.ui.isRead,
    conversationId: input.conversationId,
    clientId: input.clientId
  }
}

export function applyLocalSnapshot(input: {
  state: ShowcaseChatUiStateDomain
  conversationId: string
  list: ShowcaseChatLocalEntity[]
  unread: number
  perspectiveRole: 'merchant' | 'client' | string
  timeFormatter?: (date: Date) => string
}): ShowcaseChatUiStateDomain {
  const oldSize = input.state.messages.length
  const oldLastMessageId = input.state.messages[input.state.messages.length - 1]?.id || null

  const orderedList = [...input.list].sort((left, right) => {
    const leftTime = Number(left.timeMs || 0)
    const rightTime = Number(right.timeMs || 0)

    if (leftTime !== rightTime) return leftTime - rightTime

    return String(left.id || '').localeCompare(String(right.id || ''))
  })

  const newMessages = orderedList.map(entity => entityToUi({
    entity,
    perspectiveRole: input.perspectiveRole,
    timeFormatter: input.timeFormatter
  }))

  const newLastMessageId = newMessages[newMessages.length - 1]?.id || null
  const shouldScroll = newMessages.length > oldSize || Boolean(newLastMessageId && newLastMessageId !== oldLastMessageId)

  return {
    ...input.state,
    conversationId: input.conversationId,
    messages: newMessages,
    unreadCount: input.unread,
    errorMessage: null,
    scrollToBottomSignal: shouldScroll ? Date.now() : input.state.scrollToBottomSignal
  }
}

export function serverMessageToUi(input: ShowcaseChatServerMessageToUiInput): ShowcaseChatMessageUi {
  const message = input.message
  const direction: ShowcaseChatDirection = message.sender === 'client'
    ? 'Outgoing'
    : 'Incoming'

  return {
    id: message.id,
    direction,
    text: message.body,
    timeText: formatServerTimeToChatText(message.createdAt),
    status: 'Idle',
    isRead: false,
    quoteMessageId: null,
    quotePreviewText: '',
    isPinned: false,
    isFindOpen: false,
    findQuery: '',
    findMatchIds: [],
    findFocusedId: null,
    scrollToMessageId: null,
    scrollToMessageSignal: 0
  }
}

export function applyServerMessages(input: {
  state: ShowcaseChatUiStateDomain
  messages: ShowcaseChatMessage[]
  seenIds: Set<string>
  replaceAll: boolean
}): {
  state: ShowcaseChatUiStateDomain
  seenIds: Set<string>
} {
  const seenIds = input.replaceAll ? new Set<string>() : new Set(input.seenIds)
  const mapped: ShowcaseChatMessageUi[] = []
  let newest = input.state.newestCreatedAt
  let oldest = input.state.oldestCreatedAt

  input.messages.forEach(message => {
    if (seenIds.has(message.id)) return
    seenIds.add(message.id)

    const createdAt = message.createdAt

    if (createdAt) {
      newest = !newest || createdAt > newest ? createdAt : newest
      oldest = !oldest || createdAt < oldest ? createdAt : oldest
    }

    mapped.push(serverMessageToUi({ message }))
  })

  const trimmedSeenIds = trimSeenIds(seenIds)

  if (input.replaceAll) {
    return {
      seenIds: trimmedSeenIds,
      state: {
        ...input.state,
        messages: mapped,
        newestCreatedAt: newest,
        oldestCreatedAt: oldest,
        canLoadOlder: mapped.length > 0
      }
    }
  }

  return {
    seenIds: trimmedSeenIds,
    state: {
      ...input.state,
      messages: distinctMessagesById([...input.state.messages, ...mapped]),
      newestCreatedAt: newest,
      oldestCreatedAt: oldest
    }
  }
}

export function replaceLocalWithServer(
  state: ShowcaseChatUiStateDomain,
  localId: string,
  server: ShowcaseChatMessage
): ShowcaseChatUiStateDomain {
  const serverUi = {
    ...serverMessageToUi({ message: server }),
    status: 'Sent' as ShowcaseChatSendStatus
  }

  return {
    ...state,
    messages: distinctMessagesById([
      ...state.messages.filter(message => message.id !== localId),
      serverUi
    ])
  }
}

export function formatChatTime(date: Date): string {
  return formatShowcaseDateTime(date)
}

export function formatServerTimeToChatText(createdAt: string | null): string {
  const source = String(createdAt || '').trim()
  if (!source) return ''

  const parsed = parseServerDate(source)

  if (parsed) {
    return formatChatTime(parsed)
  }

  return source
}

export function ensureClientIdFromStorage(input: {
  storageKey?: string
  deviceId?: string | null
} = {}): string {
  const storageKey = input.storageKey || 'Showcase_chat_prefs_chat_client_id'
  const deviceKey = `${storageKey}_device_id`
  const deviceId = String(input.deviceId || 'web').trim() || 'web'

  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return `client_${createUuidLikeId()}`
    }

    const existing = window.localStorage.getItem(storageKey)
    const storedDeviceId = window.localStorage.getItem(deviceKey)

    if (existing && storedDeviceId && storedDeviceId === deviceId) {
      return existing
    }

    const next = `client_${createUuidLikeId()}`
    window.localStorage.setItem(storageKey, next)
    window.localStorage.setItem(deviceKey, deviceId)
    return next
  } catch {
    return `client_${createUuidLikeId()}`
  }
}

export type ShowcaseChatDraftImageUploadPlanItem = {
  sourceUrl: string
  needsUpload: boolean
  index: number
  messageId: string
}

export function buildChatDraftImageUploadPlan(input: {
  draftImageUris: string[]
  createImageMessageId: () => string
}): ShowcaseChatDraftImageUploadPlanItem[] {
  return uniqueNonEmptyStrings(input.draftImageUris)
    .slice(0, 9)
    .map((sourceUrl, index) => {
      return {
        sourceUrl,
        needsUpload: isLocalImageUri(sourceUrl),
        index,
        messageId: input.createImageMessageId()
      }
    })
}

export type ShowcaseChatDraftImageResult = {
  nextImageUris: string[]
  added: boolean
  limitReached: boolean
}

export function applyChatDraftImagePicked(input: {
  currentImageUris: string[]
  imageUri: string
  maxImages?: number
}): ShowcaseChatDraftImageResult {
  const maxImages = Math.max(1, Math.trunc(Number(input.maxImages || 9)))
  const imageUri = String(input.imageUri || '').trim()
  const current = uniqueNonEmptyStrings(input.currentImageUris).slice(0, maxImages)

  if (!imageUri) {
    return {
      nextImageUris: current,
      added: false,
      limitReached: false
    }
  }

  if (current.includes(imageUri)) {
    return {
      nextImageUris: current,
      added: false,
      limitReached: false
    }
  }

  if (current.length >= maxImages) {
    return {
      nextImageUris: current,
      added: false,
      limitReached: true
    }
  }

  return {
    nextImageUris: [...current, imageUri].slice(0, maxImages),
    added: true,
    limitReached: false
  }
}

export function applyChatDraftImagesPicked(input: {
  currentImageUris: string[]
  imageUris: string[]
  maxImages?: number
}): ShowcaseChatDraftImageResult {
  const maxImages = Math.max(1, Math.trunc(Number(input.maxImages || 9)))
  let nextImageUris = uniqueNonEmptyStrings(input.currentImageUris).slice(0, maxImages)
  let added = false
  let limitReached = false

  for (const imageUri of uniqueNonEmptyStrings(input.imageUris)) {
    const result = applyChatDraftImagePicked({
      currentImageUris: nextImageUris,
      imageUri,
      maxImages
    })

    nextImageUris = result.nextImageUris
    added = added || result.added
    limitReached = limitReached || result.limitReached

    if (limitReached) break
  }

  return {
    nextImageUris,
    added,
    limitReached
  }
}

export function resolveChatQuotePreviewForSend(input: {
  messageId: string | null | undefined
  messages: Array<{
    id: string
    body: string
    imageUrls: string[]
    product?: ShowcaseChatProductShare | null
  }>
}): string | null {
  const messageId = String(input.messageId || '').trim()
  if (!messageId) return null

  const quotedMessage = input.messages.find(message => message.id === messageId)
  if (!quotedMessage) return null

  if (quotedMessage.product) {
    return `${quotedMessage.product.title}${quotedMessage.product.price ? `  ${quotedMessage.product.price}` : ''}`.trim()
  }

  const body = String(quotedMessage.body || '').replace(/\s+/g, ' ').trim()
  if (body) return body.slice(0, 80)

  if ((quotedMessage.imageUrls || []).length) return 'Photo'

  return 'Quoted message'
}

export function applyPendingProductForChat(input: {
  draftText: string
  draftImageUris: string[]
  currentQuoteMessageId: string | null
  product: ShowcaseChatProductShare | null
}): {
  pendingProduct: ShowcaseChatProductShare | null
  quoteMessageId: string | null
  draftText: string
  draftImageUris: string[]
} {
  if (input.product) {
    return {
      pendingProduct: input.product,
      quoteMessageId: null,
      draftText: input.draftText,
      draftImageUris: input.draftImageUris
    }
  }

  return {
    pendingProduct: null,
    quoteMessageId: input.currentQuoteMessageId,
    draftText: input.draftText,
    draftImageUris: input.draftImageUris
  }
}

export type ShowcaseChatOutgoingMessageEntityDraft = {
  id: string
  conversationId: string
  storeId: string
  clientId: string
  role: 'merchant' | 'client'
  direction: 'out' | 'in'
  text: string
  timeMs: number
  status: 'sending'
  isRead: false
}

export type ShowcaseChatSendPlan = {
  entities: ShowcaseChatOutgoingMessageEntityDraft[]
  bodies: string[]
  hasImages: boolean
  hasProduct: boolean
  hasAppointment: boolean
  clearDraftOnSuccess: boolean
}

export function buildChatMessageSendPlan(input: {
  rawBody: string
  uploadedImageUris: string[]
  uploadedImageVariants?: ReadonlyArray<ShowcaseImageVariants | null | undefined>
  quoteMessageId: string | null
  quotePreview: string | null
  conversationId: string
  storeId: string
  clientId: string
  senderRole: 'merchant' | 'client'
  now: number
  createMessageId: () => string
}): ShowcaseChatSendPlan | null {
  const rawBody = String(input.rawBody || '').trim()
  const imageUris = uniqueNonEmptyStrings(input.uploadedImageUris).slice(0, 9)
  const imageVariants = (input.uploadedImageVariants || []).slice(0, 9)

  if (!rawBody && !imageUris.length) return null

  const role = input.senderRole === 'merchant' ? 'merchant' : 'client'
  const direction = input.senderRole === 'merchant' ? 'out' : 'in'

  const bodies = imageUris.length
    ? imageUris.map((imageUri, index) => buildNdjcChatPayload({
        rawBody: index === 0 ? rawBody : '',
        quoteMessageId: index === 0 ? input.quoteMessageId : null,
        quotePreview: index === 0 ? input.quotePreview : null,
        imageUris: [imageUri],
        imageVariants: [imageVariants[index] || createRemoteOnlyImageVariantsForChat(imageUri)]
      }))
    : [
        buildNdjcChatPayload({
          rawBody,
          quoteMessageId: input.quoteMessageId,
          quotePreview: input.quotePreview,
          imageUris: [],
          imageVariants: []
        })
      ]

  return {
    bodies,
    hasImages: imageUris.length > 0,
    hasProduct: false,
    hasAppointment: false,
    clearDraftOnSuccess: true,
    entities: bodies.map((body, index) => ({
      id: input.createMessageId(),
      conversationId: input.conversationId,
      storeId: input.storeId,
      clientId: input.clientId,
      role,
      direction,
      text: body,
      timeMs: input.now + index,
      status: 'sending',
      isRead: false
    }))
  }
}

export function buildPendingProductShareSendPlan(input: {
  product: ShowcaseChatProductShare | null
  conversationId: string
  storeId: string
  clientId: string
  senderRole: 'merchant' | 'client'
  now: number
  createMessageId: () => string
}): ShowcaseChatSendPlan | null {
  if (!input.product) return null

  const role = input.senderRole === 'merchant' ? 'merchant' : 'client'
  const direction = input.senderRole === 'merchant' ? 'out' : 'in'
  const body = buildNdjcProductSharePayload(input.product)

  return {
    bodies: [body],
    hasImages: false,
    hasProduct: true,
    hasAppointment: false,
    clearDraftOnSuccess: true,
    entities: [
      {
        id: input.createMessageId(),
        conversationId: input.conversationId,
        storeId: input.storeId,
        clientId: input.clientId,
        role,
        direction,
        text: body,
        timeMs: input.now,
        status: 'sending',
        isRead: false
      }
    ]
  }
}

export function buildPendingAppointmentShareSendPlan(input: {
  appointment: ShowcaseChatAppointmentShare | null
  conversationId: string
  storeId: string
  clientId: string
  senderRole: 'merchant' | 'client'
  now: number
  createMessageId: () => string
}): ShowcaseChatSendPlan | null {
  if (!input.appointment) return null

  const role = input.senderRole === 'merchant' ? 'merchant' : 'client'
  const direction = input.senderRole === 'merchant' ? 'out' : 'in'
  const body = buildNdjcAppointmentSharePayload(input.appointment)

  return {
    bodies: [body],
    hasImages: false,
    hasProduct: false,
    hasAppointment: true,
    clearDraftOnSuccess: true,
    entities: [
      {
        id: input.createMessageId(),
        conversationId: input.conversationId,
        storeId: input.storeId,
        clientId: input.clientId,
        role,
        direction,
        text: body,
        timeMs: input.now,
        status: 'sending',
        isRead: false
      }
    ]
  }
}

export function buildChatPushBodyPreviewFromPayload(input: {
  body: string
  hasImages?: boolean
  hasProduct?: boolean
  hasAppointment?: boolean
}): string {
  const parsed = parseNdjcChatPayload(input.body)
  const normalizedBody = (parsed.body || parsed.product?.title || parsed.appointment?.title || '')
    .replace(/\s+/g, ' ')
    .replace(/^>.*$/gm, '')
    .trim()
  const hasProduct = Boolean(input.hasProduct || parsed.product)
  const hasAppointment = Boolean(input.hasAppointment || parsed.appointment)
  const hasImages = Boolean(input.hasImages || parsed.imageUris.length > 0)

  if (normalizedBody) {
    return normalizedBody.length > 120 ? `${normalizedBody.slice(0, 117)}...` : normalizedBody
  }

  if (hasAppointment) return 'Booking card'
  if (hasProduct) return 'Item card'
  if (hasImages) return 'Image message'

  return 'New message'
}

export type ShowcaseChatSendOperationResult = {
  sentCount: number
  shouldFail: boolean
  shouldClearDraft: boolean
  firstBody: string
  pushBody: string
}

export function buildChatSendOperationResult(input: {
  sendPlan: ShowcaseChatSendPlan
  results: boolean[]
  fallbackProductPushBody?: string
}): ShowcaseChatSendOperationResult {
  const sentCount = input.results.filter(Boolean).length
  const firstBody = input.sendPlan.bodies[0] || ''
  const productFallback = String(input.fallbackProductPushBody || '').trim()

  return {
    sentCount,
    shouldFail: sentCount <= 0,
    shouldClearDraft: input.sendPlan.clearDraftOnSuccess && sentCount > 0,
    firstBody,
    pushBody: productFallback && input.sendPlan.hasProduct
      ? productFallback
      : buildChatPushBodyPreviewFromPayload({
          body: firstBody,
          hasImages: input.sendPlan.hasImages,
          hasProduct: input.sendPlan.hasProduct,
          hasAppointment: input.sendPlan.hasAppointment
        })
  }
}

export type ShowcaseChatDraftClearPlan = {
  draftText: string
  draftImageUris: string[]
  pendingProduct: ShowcaseChatProductShare | null
  pendingAppointment: ShowcaseChatAppointmentShare | null
  quoteMessageId: string | null
}

export function buildChatDraftClearPlan(): ShowcaseChatDraftClearPlan {
  return {
    draftText: '',
    draftImageUris: [],
    pendingProduct: null,
    pendingAppointment: null,
    quoteMessageId: null
  }
}

export function normalizeChatSendErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error || 'Message send failed.')
}

export function toShowcaseChatDomainMessage(input: {
  message: ShowcaseUiContractChatMessage
  quotePreviewText: string
  findQuery: string
  findMatchIds: string[]
  focusedMessageId: string | null
}): ShowcaseChatMessageUi {
  const message = input.message
  const parsedPayload = parseNdjcChatPayload(message.body)
  const parsedProduct = parsedPayload.product
  const parsedAppointment = parsedPayload.appointment
  const resolvedProduct = message.product || (parsedProduct
    ? {
        dishId: parsedProduct.dishId,
        title: parsedProduct.title,
        price: parsedProduct.price,
        originalPriceText: parsedProduct.originalPriceText,
        discountPriceText: parsedProduct.discountPriceText,
        imageUrl: parsedProduct.imageUrl,
        imageVariants: parsedProduct.imageVariants,
        isRecommended: parsedProduct.isRecommended
      }
    : null)
  const resolvedAppointment = message.appointment || (parsedAppointment
    ? {
        appointmentId: parsedAppointment.appointmentId,
        title: parsedAppointment.title,
        preferredDate: parsedAppointment.preferredDate,
        preferredTime: parsedAppointment.preferredTime,
        statusLabel: parsedAppointment.statusLabel,
        imageUrl: parsedAppointment.imageUrl,
        imageVariants: parsedAppointment.imageVariants,
        customerName: parsedAppointment.customerName,
        customerContact: parsedAppointment.customerContact,
        note: parsedAppointment.note,
        sourceDishId: parsedAppointment.sourceDishId,
        priceText: parsedAppointment.priceText,
        originalPriceText: parsedAppointment.originalPriceText,
        discountPriceText: parsedAppointment.discountPriceText,
        categoryText: parsedAppointment.categoryText,
        itemAvailable: parsedAppointment.itemAvailable,
        createdAtText: parsedAppointment.createdAtText
      }
    : null)
  const resolvedQuoteMessageId = message.quotedMessageId ?? parsedPayload.quoteMessageId
  const quotePreview = parsedPayload.quotePreview || input.quotePreviewText || ''
  const resolvedImageUrls = Array.from(new Set([
    ...message.imageUrls,
    ...parsedPayload.imageUris
  ].map(url => String(url || '').trim()).filter(Boolean)))
  const resolvedBody = parsedPayload.body || message.body

  const text = resolvedAppointment
    ? buildNdjcAppointmentSharePayload(resolvedAppointment)
    : resolvedProduct
      ? buildNdjcProductSharePayload(resolvedProduct)
      : buildNdjcChatPayload({
          rawBody: resolvedBody,
          quoteMessageId: resolvedQuoteMessageId ?? null,
          quotePreview,
          imageUris: resolvedImageUrls
        })

  return {
    id: message.id,
    direction: message.outgoing ? 'Outgoing' : 'Incoming',
    text,
    timeText: message.createdAtText,
    status: message.failed
      ? 'Failed'
      : message.statusText?.includes('Sending')
        ? 'Sending'
        : message.outgoing
          ? 'Sent'
          : 'Idle',
    isRead: Boolean(message.statusText?.includes('Read')),
    quoteMessageId: resolvedQuoteMessageId ?? null,
    quotePreviewText: quotePreview,
    isPinned: false,
    isFindOpen: Boolean(input.findQuery.trim()),
    findQuery: input.findQuery,
    findMatchIds: input.findMatchIds,
    findFocusedId: input.focusedMessageId,
    scrollToMessageId: input.focusedMessageId,
    scrollToMessageSignal: 0
  }
}

function uniqueNonEmptyStrings(items: string[]): string[] {
  return Array.from(
    new Set(
      items
        .map(item => String(item || '').trim())
        .filter(Boolean)
    )
  )
}

function distinctMessagesById(messages: ShowcaseChatMessageUi[]): ShowcaseChatMessageUi[] {
  const map = new Map<string, ShowcaseChatMessageUi>()

  messages.forEach(message => {
    map.set(message.id, message)
  })

  return Array.from(map.values())
}

function buildProductQuotePreview(product: NdjcParsedProduct): string {
  const title = product.title || product.dishId
  const price = product.price

  return `商品：${title}${price ? `  ${price}` : ''}`.slice(0, 60)
}

function createUuidLikeId(): string {
  const cryptoApi = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined

  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
    return cryptoApi.randomUUID()
  }

  return `${Date.now()}_${Math.random().toString(36).slice(2)}`
}

function trimSeenIds(seenIds: Set<string>): Set<string> {
  if (seenIds.size <= 1200) return seenIds

  const next = new Set(seenIds)

  while (next.size > 1000) {
    const first = next.values().next().value
    if (!first) break
    next.delete(first)
  }

  return next
}

function parseServerDate(value: string): Date | null {
  const parsed = new Date(value)
  if (!Number.isNaN(parsed.getTime())) return parsed

  return null
}

function formatRawHourMinute(value: string): string {
  if (!/^\d{2}:\d{2}$/.test(value)) return ''

  const hour24 = Number(value.slice(0, 2))
  const minute = value.slice(3, 5)

  if (!Number.isFinite(hour24)) return ''

  const ampm = hour24 < 12 ? 'AM' : 'PM'
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24

  return `${ampm} ${hour12}:${minute}`
}