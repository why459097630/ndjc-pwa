const CHAT_PUSH_GRACE_MS = 2500

let chatVisible = false
let activeConversationId: string | null = null
let lastSeenConversationId: string | null = null
let lastSeenConversationAtMs = 0

function normalizeConversationId(conversationId: string | null | undefined): string | null {
  const value = String(conversationId || '').trim()
  return value || null
}

function nowMs(): number {
  return Date.now()
}

export function setChatVisible(visible: boolean): void {
  chatVisible = Boolean(visible)
}

export function isChatScreenVisible(): boolean {
  return chatVisible
}

export function setActiveConversationId(conversationId: string | null | undefined): void {
  activeConversationId = normalizeConversationId(conversationId)
}

export function getActiveConversationId(): string | null {
  return activeConversationId
}

export function markConversationVisible(conversationId: string | null | undefined): void {
  const normalized = normalizeConversationId(conversationId)
  if (!normalized) return

  lastSeenConversationId = normalized
  lastSeenConversationAtMs = nowMs()
  activeConversationId = normalized
  chatVisible = true
}

export function markConversationRecentlySeen(conversationId: string | null | undefined): void {
  const normalized = normalizeConversationId(conversationId)
  if (!normalized) return

  lastSeenConversationId = normalized
  lastSeenConversationAtMs = nowMs()
}

export function shouldSuppressChatPush(
  conversationId: string | null | undefined,
  options: { source?: string | null } = {}
): boolean {
  const normalized = normalizeConversationId(conversationId)
  if (!normalized) return false

  const source = String(options.source || '').trim().toLowerCase()
  const isExplicitNotificationClick = source === 'notification_click'

  if (chatVisible && normalized === activeConversationId) {
    return !isExplicitNotificationClick
  }

  if (isExplicitNotificationClick) {
    return false
  }

  const lastSeenId = lastSeenConversationId
  const lastSeenAt = lastSeenConversationAtMs

  if (normalized === lastSeenId && lastSeenAt > 0) {
    const delta = nowMs() - lastSeenAt

    if (delta >= 0 && delta <= CHAT_PUSH_GRACE_MS) {
      return true
    }
  }

  return false
}

export const ShowcaseRuntimeState = {
  setChatVisible,
  isChatScreenVisible,
  setActiveConversationId,
  getActiveConversationId,
  markConversationVisible,
  markConversationRecentlySeen,
  shouldSuppressChatPush
} as const