'use client'

import React from 'react'
import {
  APK_SHOWCASE_COLOR_TOKENS,
  NDJC_GLOBAL_UI_TOKENS
} from './showcaseTokens'
import { APK_SHELL_UI } from './showcaseLayout'

export const APK_ANNOUNCEMENT_UI = {
  black: '#000000',
  white: '#ffffff',
  ink: '#111827',
  ink2: '#374151',
  muted: '#4b5563',
  brand: APK_SHOWCASE_COLOR_TOKENS.accent,
  green: APK_SHOWCASE_COLOR_TOKENS.primary,
  card: '#ffffff',
  softSurface: '#f2f4f7',
  divider: 'rgba(0, 0, 0, 0.04)',
  selectedOutline: `1.5px solid rgba(${APK_SHOWCASE_COLOR_TOKENS.accentRgb}, 0.62)`,

  feedRadius: 24,
  feedPadding: 8,
  feedGap: 0,
  feedInnerPaddingX: 8,
  feedImageAspectRatio: '16 / 9',
  feedImageRadius: 16,
  feedDividerTopPadding: 8,
  feedMetaTopPadding: 6,
  feedExpandBodyTopPadding: 8,
  feedExpandBodyBottomPadding: 8,
  feedExpandButtonSize: 24,
  feedExpandButtonBg: 'rgba(0, 0, 0, 0.05)',
  feedExpandIconColor: 'rgba(0, 0, 0, 0.65)',
  feedExpandButtonInsetRight: 8,
  feedExpandAnimationMs: 180,
  coverHeight: 180,
  coverRadius: 16,
  bodyPaddingX: 8,
  bodyPaddingY: 0,
  bodyGap: 0,

  draftRadius: 10,
  draftPadding: 0,
  draftGap: 0,
  draftImageSize: 0,
  draftImageRadius: 10,
  draftBottomPaddingX: 6,
  draftTimeWeight: 1,
  draftSpacerWeight: 0.6,
  draftActionWeight: 1.4,
  draftEditHeight: 24,
  draftEditRadius: 8,
  draftEditPaddingX: 2,
  editHeaderGap: 8,
  editActionGap: 10,
  editComposerCoverGap: 10,
  editComposerTextGap: 6,
  editDividerColor: 'rgba(0, 0, 0, 0.10)',
  editSelectionTextColor: 'rgba(0, 0, 0, 0.70)',

  timePillRadius: 999,
  timePillPaddingX: 10,
  timePillPaddingY: 5,
  timePillWrapPaddingY: 6,

  titleSize: 15,
  titleLineHeight: 1.25,
  titleWeight: 600,
  metaSize: 12,
  metaLineHeight: 1.2,
  metaWeight: 500,
  bodySize: 14,
  bodyLineHeight: '22px',
  bodyWeight: 400,

  draftTimeSize: 13,
  draftActionSize: 14,

  expandedLineClamp: 'none',
  collapsedLineClamp: 3,
  shadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
} as const

export const apkAnnouncementTimePillStyle: React.CSSProperties = {
  borderRadius: APK_ANNOUNCEMENT_UI.timePillRadius,
  padding: `${APK_ANNOUNCEMENT_UI.timePillPaddingY}px ${APK_ANNOUNCEMENT_UI.timePillPaddingX}px`,
  color: APK_ANNOUNCEMENT_UI.muted,
  background: 'rgba(255, 255, 255, 0.72)',
  fontSize: 11,
  lineHeight: 1,
  fontWeight: 500,
  whiteSpace: 'nowrap'
}

export const apkAnnouncementFeedCardStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: APK_ANNOUNCEMENT_UI.feedRadius,
  padding: APK_ANNOUNCEMENT_UI.feedPadding,
  display: 'grid',
  gap: APK_ANNOUNCEMENT_UI.feedGap,
  background: APK_ANNOUNCEMENT_UI.card,
  boxShadow: APK_SHELL_UI.whiteCardShadow,
  overflow: 'hidden',
  boxSizing: 'border-box'
}

export const apkAnnouncementFeedImageButtonStyle: React.CSSProperties = {
  width: '100%',
  aspectRatio: APK_ANNOUNCEMENT_UI.feedImageAspectRatio,
  border: 0,
  borderRadius: APK_ANNOUNCEMENT_UI.feedImageRadius,
  padding: 0,
  display: 'block',
  overflow: 'hidden',
  background: APK_ANNOUNCEMENT_UI.softSurface,
  boxShadow: 'none',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent'
}

export const apkAnnouncementFeedPlaceholderStyle: React.CSSProperties = {
  width: '100%',
  aspectRatio: APK_ANNOUNCEMENT_UI.feedImageAspectRatio,
  border: 0,
  borderRadius: APK_ANNOUNCEMENT_UI.feedImageRadius,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  overflow: 'hidden',
  color: 'rgba(0, 0, 0, 0.72)',
  background: 'rgba(0, 0, 0, 0.06)',
  fontSize: APK_ANNOUNCEMENT_UI.bodySize,
  lineHeight: APK_ANNOUNCEMENT_UI.bodyLineHeight,
  fontWeight: APK_ANNOUNCEMENT_UI.bodyWeight,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent'
}

export const apkAnnouncementFeedInnerStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  padding: `0 ${APK_ANNOUNCEMENT_UI.feedInnerPaddingX}px`,
  display: 'grid',
  gap: 0,
  boxSizing: 'border-box'
}

export const apkAnnouncementFeedDividerStyle: React.CSSProperties = {
  width: '100%',
  height: 1,
  marginTop: APK_ANNOUNCEMENT_UI.feedDividerTopPadding,
  background: APK_ANNOUNCEMENT_UI.divider
}

export const apkAnnouncementMetaRowStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  paddingTop: APK_ANNOUNCEMENT_UI.feedMetaTopPadding,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  boxSizing: 'border-box'
}

export const apkAnnouncementMetaTextStyle: React.CSSProperties = {
  margin: 0,
  color: 'rgba(0, 0, 0, 0.55)',
  fontSize: APK_ANNOUNCEMENT_UI.metaSize,
  lineHeight: APK_ANNOUNCEMENT_UI.metaLineHeight,
  fontWeight: APK_ANNOUNCEMENT_UI.metaWeight
}

export const apkAnnouncementExpandButtonStyle: React.CSSProperties = {
  width: APK_ANNOUNCEMENT_UI.feedExpandButtonSize,
  height: APK_ANNOUNCEMENT_UI.feedExpandButtonSize,
  marginRight: 0,
  border: 0,
  borderRadius: 0,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  color: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
  background: 'transparent',
  boxShadow: 'none',
  fontSize: 0,
  lineHeight: 1,
  fontWeight: 600,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation'
}

export const apkAnnouncementExpandedBodyStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  paddingTop: APK_ANNOUNCEMENT_UI.feedExpandBodyTopPadding,
  paddingBottom: APK_ANNOUNCEMENT_UI.feedExpandBodyBottomPadding,
  display: 'grid',
  gap: 8,
  boxSizing: 'border-box'
}
export function apkAnnouncementExpandedBodyOuterStyle(expanded: boolean): React.CSSProperties {
  return {
    width: '100%',
    display: 'grid',
    gridTemplateRows: expanded ? '1fr' : '0fr',
    opacity: expanded ? 1 : 0,
    transition: `grid-template-rows ${APK_ANNOUNCEMENT_UI.feedExpandAnimationMs}ms ease, opacity ${APK_ANNOUNCEMENT_UI.feedExpandAnimationMs}ms ease`,
    overflow: 'hidden'
  }
}

export const apkAnnouncementExpandedBodyInnerStyle: React.CSSProperties = {
  minHeight: 0,
  overflow: 'hidden'
}
export const apkAnnouncementBodyTextStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  margin: 0,
  color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
  fontSize: APK_ANNOUNCEMENT_UI.bodySize,
  lineHeight: APK_ANNOUNCEMENT_UI.bodyLineHeight,
  fontWeight: APK_ANNOUNCEMENT_UI.bodyWeight,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  boxSizing: 'border-box'
}
export function NdjcAnnouncementExpandIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{
        width: 24,
        height: 24,
        display: 'block'
      }}
    >
      {expanded ? (
        <path
          d="M7.41 14.59 12 10l4.59 4.59L18 13.17l-6-6-6 6Z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6Z"
          fill="currentColor"
        />
      )}
    </svg>
  )
}
