'use client'

import React from 'react'
import {
  APK_SHOWCASE_COLOR_TOKENS,
  NDJC_GLOBAL_UI_TOKENS
} from './showcaseTokens'

export const APK_CHAT_UI = {
  black: NDJC_GLOBAL_UI_TOKENS.colors.textPrimary,
  white: NDJC_GLOBAL_UI_TOKENS.colors.surface,
  brand: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
  green: NDJC_GLOBAL_UI_TOKENS.colors.success,
  incomingBubble: NDJC_GLOBAL_UI_TOKENS.colors.surfaceSoft,
  outgoingBubble: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
  surface: NDJC_GLOBAL_UI_TOKENS.colors.surface,
  softSurface: NDJC_GLOBAL_UI_TOKENS.colors.surfaceSoft,
  unavailableSurface: NDJC_GLOBAL_UI_TOKENS.colors.surfaceSoft,
  danger: NDJC_GLOBAL_UI_TOKENS.colors.danger,
  muted: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
  black45: 'rgba(0, 0, 0, 0.70)',
  black55: 'rgba(0, 0, 0, 0.72)',
  black65: 'rgba(0, 0, 0, 0.78)',
  black70: 'rgba(0, 0, 0, 0.82)',
  black75: 'rgba(0, 0, 0, 0.84)',
  black85: 'rgba(0, 0, 0, 0.88)',
  border08: 'rgba(0, 0, 0, 0.08)',
  border10: 'rgba(0, 0, 0, 0.10)',
  selectedBg: `rgba(${APK_SHOWCASE_COLOR_TOKENS.accentRgb}, 0.14)`,

  pageBg: '#eff3f2',
  headerHeight: 58,
  headerPaddingX: 16,
  headerTopPadding: 2,
  headerBottomPadding: 0,
  headerGap: 10,
  bodyPaddingX: 16,
  bodyPaddingY: 12,
  footerPaddingX: 12,
  footerPaddingY: 10,
  composerTopPadding: 8,
  composerBottomPadding: 6,
  draftPreviewSize: 96,
  draftPreviewCorner: 14,
  draftPreviewRemoveButtonSize: 24,
  draftPreviewRemoveIconSize: 14,
  draftPreviewCountRadius: 8,
  draftPreviewCountPaddingX: 6,
  draftPreviewCountPaddingY: 2,
  attachButtonSize: 40,
  attachIconSize: 22,
  inputMinHeight: 42,
  inputMaxHeight: 220,
  inputCorner: 14,
  inputPaddingX: 14,
  inputPaddingY: 10,

  timePillRadius: 999,
  timePillPaddingX: 12,
  timePillPaddingY: 6,
  timePillWrapPaddingY: 6,

  bubbleMaxWidthRatio: 2 / 3,
  bubbleMaxWidth: '66.6667%',
  textBubbleRadius: 14,
  textBubbleTightRadius: 0,
  textBubblePaddingX: 6,
  textBubblePaddingY: 4,
  messageRowGap: 6,
  messageStackGap: 6,
  messageToolsGap: 6,
  chatBubbleToDividerGap: 8,
  chatFooterReservedBottom: 20,
  retryButtonSize: 22,
  retryIconSize: 16,
  retryButtonGap: 16,
  messageMenuMinWidth: 156,
  messageMenuRadius: 4,
  messageMenuPadding: 8,
  messageMenuItemHeight: 48,

  plusMenuMinWidth: 196,
  plusMenuRadius: 4,
  plusMenuPaddingY: 8,
  plusMenuPaddingX: 0,
  plusMenuItemHeight: 48,
  plusMenuItemPaddingX: 16,

  imageRadius: 14,
  singleImageWidth: 220,
  singleImageHeight: 220,
  gridImageSize: 104,
  gridGap: 4,
  gridMaxPreview: 4,

  productCardWidth: 236,
  productQuoteMaxWidth: 320,
  productImageSize: 54,
  productImageRadius: 12,
  productRadius: 14,
  productPadding: 10,
  productGap: 10,

  pendingProductRadius: 12,
  pendingProductPadding: 10,
  pendingProductGap: 8,

  toolButtonWidth: 58,
  toolButtonHeight: 42,
  toolButtonRadius: 12,
  toolButtonPaddingX: 12,
  toolButtonIconSize: 18,

  quotedBarRadius: 12,
  quotedBarPaddingX: 10,
  quotedBarPaddingY: 6,
  quotedBarBorderWidth: 1,
  quoteBlockGap: 3,
  quoteLabelSize: 12,
  quoteTextSize: 13,
  quoteRailWidth: 2,
  quoteRailHeight: 22,
  quoteRailGap: 8,
  quoteReplyFont: '500 12px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  quoteTextFont: '600 13px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  bodyTextFont: '400 15px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

  richBubblePadding: 6,
  richBubbleDefaultBorder: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.border}`,
  richBubbleSelectedBorder: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis}`,
  richBubbleFocusedBorder: `2px solid ${NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis}`,
  richBubbleMatchedBorder: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.border}`,

  findBarRadius: 18,
  findBarPadding: 10,
  findBarGap: 8,

  merchantRowRadius: 16,
  merchantRowPadding: 12,
  merchantAvatarSize: 48,
  merchantAvatarRadius: 999,
  unreadSize: 22,
  bgCircleSize: 160
} as const

export const apkChatScreenStyle: React.CSSProperties = {
  minHeight: '100dvh',
  background: APK_CHAT_UI.pageBg
}

export const apkConversationSurfaceStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: '100dvh',
  display: 'grid',
  gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
  background: APK_CHAT_UI.pageBg,
  overflow: 'hidden'
}

export const apkConversationTopBarStyle: React.CSSProperties = {
  minHeight: APK_CHAT_UI.headerHeight,
  padding: `calc(8px + env(safe-area-inset-top)) ${APK_CHAT_UI.headerPaddingX}px 8px`,
  display: 'grid',
  gridTemplateColumns: '50px minmax(0, 1fr) 50px',
  alignItems: 'center',
  gap: APK_CHAT_UI.headerGap,
  background: APK_CHAT_UI.pageBg
}

export const apkConversationTitleBlockStyle: React.CSSProperties = {
  minWidth: 0,
  display: 'grid',
  gap: 2,
  textAlign: 'center'
}

export const apkConversationTitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CHAT_UI.black,
  fontSize: 18,
  lineHeight: 1.2,
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

export const apkConversationSubtitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CHAT_UI.black55,
  fontSize: 12,
  lineHeight: 1.2,
  fontWeight: 400,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

export const apkConversationBodyStyle: React.CSSProperties = {
  minHeight: 0,
  padding: `${APK_CHAT_UI.bodyPaddingY}px ${APK_CHAT_UI.bodyPaddingX}px`,
  display: 'grid',
  alignContent: 'start',
  gap: APK_CHAT_UI.messageRowGap,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch'
}

export const apkConversationFooterStyle: React.CSSProperties = {
  padding: `${APK_CHAT_UI.footerPaddingY}px ${APK_CHAT_UI.footerPaddingX}px calc(${APK_CHAT_UI.footerPaddingY}px + env(safe-area-inset-bottom))`,
  background: APK_CHAT_UI.pageBg
}

export const apkConversationToolbarStyle: React.CSSProperties = {
  padding: `0 ${APK_CHAT_UI.bodyPaddingX}px 8px`,
  display: 'grid',
  gap: 8
}

export const apkChatInputShellStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  minHeight: APK_CHAT_UI.inputMinHeight,
  maxHeight: APK_CHAT_UI.inputMaxHeight,
  border: '1px solid rgba(0, 0, 0, 0.10)',
  borderRadius: APK_CHAT_UI.inputCorner,
  padding: `${APK_CHAT_UI.inputPaddingY}px ${APK_CHAT_UI.inputPaddingX}px`,
  display: 'grid',
  alignItems: 'center',
  background: '#ffffff',
  boxSizing: 'border-box',
  overflow: 'hidden'
}

export const apkChatTextareaStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  minHeight: APK_CHAT_UI.inputMinHeight - APK_CHAT_UI.inputPaddingY * 2,
  maxHeight: APK_CHAT_UI.inputMaxHeight - APK_CHAT_UI.inputPaddingY * 2,
  height: APK_CHAT_UI.inputMinHeight - APK_CHAT_UI.inputPaddingY * 2,
  border: 0,
  outline: 0,
  padding: 0,
  color: APK_CHAT_UI.black,
  background: 'transparent',
  boxShadow: 'none',
  fontSize: 16,
  lineHeight: 1.35,
  fontWeight: 400,
  resize: 'none',
  overflowY: 'hidden',
  fontFamily: 'inherit',
  boxSizing: 'border-box'
}

export function apkChatToolButtonStyle(disabled?: boolean): React.CSSProperties {
  return {
    minHeight: APK_CHAT_UI.toolButtonHeight,
    border: 0,
    borderRadius: APK_CHAT_UI.toolButtonRadius,
    padding: `0 ${APK_CHAT_UI.toolButtonPaddingX}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    color: disabled ? APK_CHAT_UI.black55 : APK_CHAT_UI.green,
    background: disabled ? APK_CHAT_UI.softSurface : `rgba(${APK_SHOWCASE_COLOR_TOKENS.primaryRgb}, 0.12)`,
    boxShadow: 'none',
    fontSize: 12,
    lineHeight: 1,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.58 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
  }
}

export const apkChatPlusMenuStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  bottom: `calc(${APK_CHAT_UI.attachButtonSize}px + 8px)`,
  zIndex: 20,
  minWidth: APK_CHAT_UI.plusMenuMinWidth,
  borderRadius: APK_CHAT_UI.plusMenuRadius,
  padding: `${APK_CHAT_UI.plusMenuPaddingY}px ${APK_CHAT_UI.plusMenuPaddingX}px`,
  display: 'grid',
  gap: 0,
  background: APK_CHAT_UI.white,
  boxShadow: '0 8px 22px rgba(0, 0, 0, 0.18)',
  overflow: 'hidden'
}

export function apkChatPlusMenuItemStyle(disabled?: boolean): React.CSSProperties {
  return {
    width: '100%',
    height: APK_CHAT_UI.plusMenuItemHeight,
    border: 0,
    borderRadius: 0,
    padding: `0 ${APK_CHAT_UI.plusMenuItemPaddingX}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: disabled ? APK_CHAT_UI.black45 : APK_CHAT_UI.black85,
    background: 'transparent',
    boxShadow: 'none',
    fontSize: 14,
    lineHeight: 1,
    fontWeight: 400,
    textAlign: 'left',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.58 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
  }
}

export function apkChatMessageRowStyle(outgoing?: boolean, selected?: boolean, failed?: boolean): React.CSSProperties {
  return {
    width: '100%',
    display: 'grid',
    justifyItems: outgoing ? 'end' : 'start',
    gap: APK_CHAT_UI.messageRowGap,
    padding: selected ? '6px 8px' : '2px 0',
    borderRadius: selected ? APK_CHAT_UI.textBubbleRadius : 0,
    background: selected ? APK_CHAT_UI.selectedBg : 'transparent',
    opacity: 1
  }
}

export function apkChatMessageContentRowStyle(outgoing?: boolean): React.CSSProperties {
  return {
    width: '100%',
    minWidth: 0,
    display: 'flex',
    justifyContent: outgoing ? 'flex-end' : 'flex-start',
    alignItems: 'center'
  }
}

export function apkChatRetryButtonStyle(): React.CSSProperties {
  return {
    width: APK_CHAT_UI.retryButtonSize,
    height: APK_CHAT_UI.retryButtonSize,
    minWidth: APK_CHAT_UI.retryButtonSize,
    border: 0,
    borderRadius: 999,
    padding: 0,
    display: 'grid',
    placeItems: 'center',
    color: APK_CHAT_UI.white,
    background: APK_CHAT_UI.danger,
    boxShadow: 'none',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent'
  }
}

export const apkChatRetryIconStyle: React.CSSProperties = {
  width: APK_CHAT_UI.retryIconSize + 2,
  height: APK_CHAT_UI.retryIconSize + 2,
  display: 'block',
  transformOrigin: '50% 50%',
  pointerEvents: 'none'
}
export const NDJC_CHAT_RETRY_BUTTON_PREVIEW = false

export function apkChatMessageStackStyle(outgoing?: boolean, failed?: boolean): React.CSSProperties {
  return {
    position: 'relative',
    width: APK_CHAT_UI.bubbleMaxWidth,
    minWidth: 0,
    maxWidth: APK_CHAT_UI.bubbleMaxWidth,
    display: 'grid',
    justifyItems: outgoing ? 'end' : 'start',
    gap: APK_CHAT_UI.messageStackGap,
    boxSizing: 'border-box'
  }
}

export function apkChatFailedBubbleRowStyle(): React.CSSProperties {
  return {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    boxSizing: 'border-box'
  }
}

export function apkChatBubbleOnlyStackStyle(outgoing?: boolean, richBubble?: boolean): React.CSSProperties {
  return {
    width: richBubble ? '100%' : undefined,
    minWidth: 0,
    maxWidth: richBubble
      ? '100%'
      : `calc(100% - ${APK_CHAT_UI.retryButtonSize + APK_CHAT_UI.retryButtonGap}px)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: outgoing ? 'flex-end' : 'flex-start',
    gap: APK_CHAT_UI.messageStackGap,
    boxSizing: 'border-box',
    flex: richBubble ? '1 1 auto' : '0 1 auto'
  }
}

export function apkChatRichRetryBubbleHostStyle(): React.CSSProperties {
  return {
    position: 'relative',
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    display: 'block',
    boxSizing: 'border-box'
  }
}

export function apkChatRichRetryButtonOverlayStyle(): React.CSSProperties {
  return {
    position: 'absolute',
    left: -(APK_CHAT_UI.retryButtonSize + APK_CHAT_UI.retryButtonGap),
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2
  }
}

export type NdjcChatMessageMenuPlacement = 'above' | 'below'

export function apkChatMessageMenuStyle(
  outgoing?: boolean,
  placement: NdjcChatMessageMenuPlacement = 'below'
): React.CSSProperties {
  return {
    position: 'absolute',
    top: placement === 'below' ? 'calc(100% + 4px)' : 'auto',
    bottom: placement === 'above' ? 'calc(100% + 4px)' : 'auto',
    right: outgoing ? 0 : 'auto',
    left: outgoing ? 'auto' : 0,
    zIndex: 80,
    minWidth: APK_CHAT_UI.messageMenuMinWidth,
    borderRadius: APK_CHAT_UI.messageMenuRadius,
    padding: APK_CHAT_UI.messageMenuPadding,
    display: 'grid',
    gap: 2,
    background: APK_CHAT_UI.white,
    boxShadow: '0 8px 22px rgba(0, 0, 0, 0.18)'
  }
}

export function apkChatMessageMenuItemStyle(danger = false): React.CSSProperties {
  return {
    width: '100%',
    height: APK_CHAT_UI.messageMenuItemHeight,
    border: 0,
    borderRadius: 10,
    padding: '0 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: danger ? APK_CHAT_UI.danger : APK_CHAT_UI.black85,
    background: 'transparent',
    boxShadow: 'none',
    fontSize: 14,
    lineHeight: 1,
    fontWeight: 500,
    textAlign: 'left',
    cursor: 'pointer'
  }
}

export function apkChatTextBubbleStyle(
  outgoing?: boolean,
  selected?: boolean,
  focused?: boolean,
  matched?: boolean
): React.CSSProperties {
  const border = selected
    ? APK_CHAT_UI.richBubbleSelectedBorder
    : focused
      ? APK_CHAT_UI.richBubbleFocusedBorder
      : matched
        ? APK_CHAT_UI.richBubbleMatchedBorder
        : APK_CHAT_UI.richBubbleDefaultBorder

return {
  width: 'fit-content',
  minWidth: 0,
  maxWidth: '100%',
  border: outgoing && border === APK_CHAT_UI.richBubbleDefaultBorder
    ? `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis}`
    : border,
  borderRadius: outgoing
    ? `${APK_CHAT_UI.textBubbleRadius}px ${APK_CHAT_UI.textBubbleTightRadius}px ${APK_CHAT_UI.textBubbleRadius}px ${APK_CHAT_UI.textBubbleRadius}px`
    : `${APK_CHAT_UI.textBubbleTightRadius}px ${APK_CHAT_UI.textBubbleRadius}px ${APK_CHAT_UI.textBubbleRadius}px ${APK_CHAT_UI.textBubbleRadius}px`,
  padding: APK_CHAT_UI.richBubblePadding,
  color: outgoing ? NDJC_GLOBAL_UI_TOKENS.colors.surface : NDJC_GLOBAL_UI_TOKENS.colors.textBody,
  background: outgoing ? APK_CHAT_UI.outgoingBubble : APK_CHAT_UI.incomingBubble,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  boxSizing: 'border-box'
}
}

export const apkChatTextStyle: React.CSSProperties = {
  margin: 0,
  color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
  fontSize: 15,
  lineHeight: 1.42,
  fontWeight: 400,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word'
}

export const apkChatTimeTextStyle: React.CSSProperties = {
  color: APK_CHAT_UI.black55,
  fontSize: 11,
  lineHeight: 1.2,
  fontWeight: 400
}

export const apkChatImageButtonBaseStyle: React.CSSProperties = {
  border: 0,
  borderRadius: APK_CHAT_UI.imageRadius,
  padding: 0,
  display: 'block',
  overflow: 'hidden',
  background: APK_CHAT_UI.softSurface,
  boxShadow: 'none',
  cursor: 'pointer'
}

export const apkProductBubbleStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  border: 0,
  borderRadius: APK_CHAT_UI.productRadius,
  display: 'block',
  color: APK_CHAT_UI.black,
  background: APK_CHAT_UI.surface,
  boxShadow: 'none',
  overflow: 'hidden',
  boxSizing: 'border-box'
}
export const apkChatProductCardShellStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  borderRadius: APK_CHAT_UI.productRadius,
  display: 'block',
  overflow: 'hidden',
  boxSizing: 'border-box'
}

export const apkPendingProductBarStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 0,
  marginBottom: 8,
  border: '1px solid rgba(0, 0, 0, 0.18)',
  borderRadius: APK_CHAT_UI.pendingProductRadius,
  padding: '8px 6px 8px 10px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  background: APK_CHAT_UI.surface,
  boxShadow: 'none',
  boxSizing: 'border-box'
}

export const apkPendingProductSideBarStyle: React.CSSProperties = {
  width: 3,
  minWidth: 3,
  alignSelf: 'stretch',
  minHeight: 24,
  borderRadius: 999,
  background: 'rgba(0, 0, 0, 0.18)'
}

export const apkPendingProductActionColumnStyle: React.CSSProperties = {
  width: 32,
  minWidth: 32,
  display: 'grid',
  gridAutoRows: '32px',
  gap: 6,
  justifyItems: 'center',
  alignItems: 'center'
}

export function apkPendingProductIconButtonStyle(kind: 'close' | 'send'): React.CSSProperties {
  return {
    width: 32,
    height: 32,
    border: 0,
    borderRadius: 999,
    padding: 0,
    display: 'grid',
    placeItems: 'center',
    color: kind === 'send' ? NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis : NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
    background: 'transparent',
    boxShadow: 'none',
    fontSize: 0,
    lineHeight: 1,
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent'
  }
}
export const apkPendingProductPreviewCardStyle: React.CSSProperties = {
  flex: '1 1 0',
  width: '100%',
  maxWidth: '78vw',
  minWidth: 0,
  borderRadius: APK_CHAT_UI.productRadius,
  display: 'block',
  opacity: 0.98,
  overflow: 'hidden',
  boxSizing: 'border-box'
}
export const apkQuotedProductBarStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: APK_CHAT_UI.bubbleMaxWidth,
  borderLeft: `${APK_CHAT_UI.quotedBarBorderWidth}px solid ${APK_CHAT_UI.green}`,
  borderRadius: APK_CHAT_UI.quotedBarRadius,
  padding: `${APK_CHAT_UI.quotedBarPaddingY}px ${APK_CHAT_UI.quotedBarPaddingX}px`,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: 8,
  color: APK_CHAT_UI.black,
  background: APK_CHAT_UI.softSurface
}

export function apkChatQuoteBlockStyle(): React.CSSProperties {
  return {
    width: '100%',
    borderRadius: APK_CHAT_UI.quotedBarRadius,
    padding: `${APK_CHAT_UI.quotedBarPaddingY}px ${APK_CHAT_UI.quotedBarPaddingX}px`,
    display: 'grid',
    gridTemplateColumns: `${APK_CHAT_UI.quotedBarBorderWidth}px minmax(0, 1fr)`,
    gap: APK_CHAT_UI.quoteBlockGap,
    color: APK_CHAT_UI.black,
    background: APK_CHAT_UI.softSurface,
    boxSizing: 'border-box'
  }
}

export const apkChatQuoteBlockRailStyle: React.CSSProperties = {
  width: APK_CHAT_UI.quotedBarBorderWidth,
  minWidth: APK_CHAT_UI.quotedBarBorderWidth,
  borderRadius: APK_CHAT_UI.quotedBarRadius,
  background: APK_CHAT_UI.green
}

let ndjcChatMeasureCanvasContext: CanvasRenderingContext2D | null = null

export function getNdjcChatMeasureContext(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null

  if (ndjcChatMeasureCanvasContext) return ndjcChatMeasureCanvasContext

  const canvas = document.createElement('canvas')
  ndjcChatMeasureCanvasContext = canvas.getContext('2d')

  return ndjcChatMeasureCanvasContext
}

export function getApkChatViewportWidthPx(): number {
  if (typeof window === 'undefined') return 0

  const visualViewportWidth = Math.floor(window.visualViewport?.width || 0)
  if (visualViewportWidth > 0) return visualViewportWidth

  return Math.floor(window.innerWidth || 0)
}

export function measureChatTextWidthPx(text: string, font: string, maxWidthPx: number): number {
  const cleanText = String(text || '').trim()
  if (!cleanText || maxWidthPx <= 0) return 0

  const lines = cleanText
    .split(/\r?\n/)
    .map(line => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  if (!lines.length) return 0

  const context = getNdjcChatMeasureContext()

  if (!context) {
    const fallbackWidth = Math.max(...lines.map(line => line.length * 8))
    return Math.min(Math.ceil(fallbackWidth), maxWidthPx)
  }

  context.font = font

  const measuredWidth = Math.max(...lines.map(line => context.measureText(line).width))

  return Math.min(Math.ceil(measuredWidth), maxWidthPx)
}

export function computeApkChatTextQuoteContentWidthPx(input: {
  body: string
  quote: string
}): number | undefined {
  const viewportWidthPx = getApkChatViewportWidthPx()
  if (viewportWidthPx <= 0) return undefined

  const maxBubbleWidthPx = Math.floor(viewportWidthPx * APK_CHAT_UI.bubbleMaxWidthRatio)
  const contentMaxPx = Math.max(0, maxBubbleWidthPx - (APK_CHAT_UI.richBubblePadding * 2))
  const bodyTextMaxPx = Math.max(0, contentMaxPx - (APK_CHAT_UI.textBubblePaddingX * 2))
  const quoteTextMaxPx = Math.max(
    0,
    contentMaxPx -
      (APK_CHAT_UI.quotedBarPaddingX * 2) -
      APK_CHAT_UI.quoteRailWidth -
      APK_CHAT_UI.quoteRailGap
  )

  const cleanBody = String(input.body || '').trim()
  const cleanQuote = String(input.quote || '').replace(/\n/g, ' ').trim()

  const bodyNeededWidthPx = cleanBody
    ? Math.min(
      contentMaxPx,
      measureChatTextWidthPx(cleanBody, APK_CHAT_UI.bodyTextFont, bodyTextMaxPx) +
        (APK_CHAT_UI.textBubblePaddingX * 2)
    )
    : 0

  const replyWidthPx = measureChatTextWidthPx(
    'Replying to',
    APK_CHAT_UI.quoteReplyFont,
    quoteTextMaxPx
  )

  const quoteWidthPx = cleanQuote
    ? measureChatTextWidthPx(
      cleanQuote,
      APK_CHAT_UI.quoteTextFont,
      quoteTextMaxPx
    )
    : 0

  const quoteNeededWidthPx = cleanQuote
    ? Math.min(
      contentMaxPx,
      (APK_CHAT_UI.quotedBarPaddingX * 2) +
        APK_CHAT_UI.quoteRailWidth +
        APK_CHAT_UI.quoteRailGap +
        Math.max(replyWidthPx, quoteWidthPx)
    )
    : 0

  const contentWidthPx = Math.min(contentMaxPx, Math.max(bodyNeededWidthPx, quoteNeededWidthPx))

  return contentWidthPx > 0 ? contentWidthPx : undefined
}

export function apkChatRichBubbleFrameStyle(input: {
  outgoing?: boolean
  selected?: boolean
  focused?: boolean
  matched?: boolean
}): React.CSSProperties {
  const bubbleShape = input.outgoing
    ? `${APK_CHAT_UI.textBubbleRadius}px ${APK_CHAT_UI.textBubbleTightRadius}px ${APK_CHAT_UI.textBubbleRadius}px ${APK_CHAT_UI.textBubbleRadius}px`
    : `${APK_CHAT_UI.textBubbleTightRadius}px ${APK_CHAT_UI.textBubbleRadius}px ${APK_CHAT_UI.textBubbleRadius}px ${APK_CHAT_UI.textBubbleRadius}px`

  const border = input.selected
    ? APK_CHAT_UI.richBubbleSelectedBorder
    : input.focused
      ? APK_CHAT_UI.richBubbleFocusedBorder
      : input.matched
        ? APK_CHAT_UI.richBubbleMatchedBorder
        : APK_CHAT_UI.richBubbleDefaultBorder

  return {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    border: input.outgoing && border === APK_CHAT_UI.richBubbleDefaultBorder
      ? `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis}`
      : border,
    borderRadius: bubbleShape,
    padding: APK_CHAT_UI.richBubblePadding,
    display: 'block',
    color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
    background: input.outgoing
      ? NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis
      : APK_CHAT_UI.incomingBubble,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    boxSizing: 'border-box',
    overflow: 'hidden'
  }
}

export const apkChatFindBarStyle: React.CSSProperties = {
  borderRadius: APK_CHAT_UI.findBarRadius,
  padding: APK_CHAT_UI.findBarPadding,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto auto auto',
  gap: APK_CHAT_UI.findBarGap,
  alignItems: 'center',
  background: APK_CHAT_UI.surface,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
}

export const apkMerchantThreadRowStyle: React.CSSProperties = {
  borderRadius: APK_CHAT_UI.merchantRowRadius,
  padding: APK_CHAT_UI.merchantRowPadding,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: 10,
  alignItems: 'center',
  background: APK_CHAT_UI.surface,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
}
