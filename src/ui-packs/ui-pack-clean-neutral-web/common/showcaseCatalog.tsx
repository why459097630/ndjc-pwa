'use client'

import React from 'react'
import {
  APK_SHOWCASE_COLOR_TOKENS,
  NDJC_GLOBAL_UI_TOKENS,
  cx
} from './showcaseTokens'
import type { DemoDish } from '@/features/feature-showcase-web/showcaseModels'
import { getDishPrice, getDishTitle } from '@/features/feature-showcase-web/showcaseModels'
import { selectDishImageUrl } from '@/features/feature-showcase-web/showcaseImageVariants'
import {
  APK_MEDIA_UI,
  NdjcShimmerImage
} from './showcaseMedia'

export function dishImage(dish: DemoDish | null | undefined): string | null {
  return selectDishImageUrl(dish, 'detail')
}

export function priceText(value: number): string {
  if (!Number.isFinite(value)) return '$0'
  return `$${value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}`
}

export const APK_SHOWCASE_ITEM_UI = {
  black: '#000000',
  white: '#ffffff',
  ink: '#111827',
  ink2: '#374151',
  muted: '#4b5563',
  brand: APK_SHOWCASE_COLOR_TOKENS.accent,
  green: APK_SHOWCASE_COLOR_TOKENS.primary,
  card: '#ffffff',
  transparent: 'transparent',
  chipBg: '#e4e5f0',
  imageAreaBg: 'rgba(255, 255, 255, 0.92)',
  disabledAlpha: 0.72,

  homeImageHeightRatio: 0.64,
  homeCardHeight: 265,
  homeCardBottomMinHeight: 72,
  homeCardRadius: 10,
  homeCardPadding: 0,
  homeCardGap: 0,
  homeImageRadius: 0,
  homeImageAspectRatio: '1 / 1',
  homeImageBg: 'rgba(255, 255, 255, 0.92)',
  homeBottomBg: '#ffffff',
  homeContentPaddingStart: 12,
  homeContentPaddingEnd: 12,
  homeContentPaddingTop: 10,
  homeContentPaddingBottom: 12,
  homeTitleSize: 16,
  homeTitleLineHeight: 1.2,
  homeTitleWeight: 600,
  homePriceSize: 20,
  homePriceLineHeight: '24px',
  homePriceWeight: 550,
  homeOriginalSize: 12,
  homeOriginalLineHeight: '16px',
  homeOriginalWeight: 600,
  homeOriginalAlpha: 0.72,
  homePriceGap: 6,
  homeFavoriteSize: 18,
  homeFavoriteIconSize: 18,
  homeFavoriteTop: 6,
  homeFavoriteRight: 6,
  homeBadgeText: 'Pick',
  homeBadgeRadius: 999,
  homeBadgePaddingX: 8,
  homeBadgePaddingY: 3,
  homeBadgeBorderWidth: 1,
  homeBadgeIconSize: 14,
  homeBadgeFontSize: 12,
  homeBadgeGap: 4,
  homeBadgeWeight: 400,
  homePressedScale: 0.965,
  homePressedShadow: '0 2px 2px rgba(0, 0, 0, 0.10)',
  homeShadow: 'none',
  homeImageContentScale: 'cover',

  catalogCardRadius: 14,
  catalogCardPadding: 12,
  catalogGap: 12,
  catalogImageSize: 84,
  catalogImageRadius: 12,
  catalogTitleSize: 20,
  catalogTitleLineHeight: '24px',
  catalogTitleWeight: 700,
  catalogCategorySize: 12,
  catalogCategoryLineHeight: '16px',
  catalogCategoryWeight: 600,
  catalogPriceSize: 17,
  catalogPriceLineHeight: '21px',
  catalogPriceWeight: 700,
  catalogOriginalSize: 12,
  catalogOriginalLineHeight: '16px',
  catalogOriginalWeight: 600,
  catalogPriceGap: 6,
  catalogChipPaddingX: 10,
  catalogChipPaddingY: 6,
  catalogPressedScale: 0.965,
  catalogPressedShadow: 'none',
  catalogTransitionMs: 120,
  adminItemsListGap: 6,
  adminItemsHeaderToListGap: 38,

  shadow: 'none',
  selectedOutline: `1.5px solid rgba(${APK_SHOWCASE_COLOR_TOKENS.accentRgb}, 0.62)`
} as const


export const apkPickBadgeStyle: React.CSSProperties = {
  border: 0,
  borderRadius: 999,
  padding: '3px 8px',
  minHeight: 22,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
  background: NDJC_GLOBAL_UI_TOKENS.colors.surfaceSoft,
  boxSizing: 'border-box',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
  flex: '0 0 auto'
}

export const apkPickBadgeIconStyle: React.CSSProperties = {
  width: 15,
  height: 15,
  display: 'block',
  flex: '0 0 15px'
}

export const apkPickBadgeTextStyle: React.CSSProperties = {
  height: 12,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  lineHeight: '12px',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  minWidth: 0
}

export function ApkPickBadgeIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      style={apkPickBadgeIconStyle}
    >
      <path
        fill="currentColor"
        d="M12 2.75l2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 16.94l-5.56 2.93 1.06-6.2L3 9.28l6.22-.9L12 2.75z"
      />
    </svg>
  )
}

export function ApkHiddenBadgeIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      style={apkPickBadgeIconStyle}
    >
      <path
        fill="currentColor"
        d="M2.1 3.51 1 4.61l4.03 4.03C3.21 10.12 1.78 11.92 1 12c2.73 4.35 6.8 7 11 7 1.91 0 3.75-.55 5.4-1.53l4.99 4.99 1.1-1.1Zm9.9 4.49a4 4 0 0 1 4 4c0 .73-.2 1.41-.55 2l-5.45-5.45c.59-.35 1.27-.55 2-.55Zm0-3c-4.2 0-8.27 2.65-11 7 .91 1.45 2.02 2.7 3.27 3.71l2.17-2.17A4 4 0 0 1 10.46 8.3l1.67 1.67a4 4 0 0 1 3.57 3.57l2.87 2.87c1.64-1.16 3.08-2.69 4.43-4.41-2.73-4.35-6.8-7-11-7Z"
      />
    </svg>
  )
}

export function NdjcItemStatusBadge({
  text,
  variant = 'pick'
}: {
  text: string
  variant?: 'pick' | 'hidden'
}) {
  const isHidden = variant === 'hidden'

  return (
    <span
      style={{
        ...apkHomeBadgeStyle,
        background: NDJC_GLOBAL_UI_TOKENS.colors.surfaceSoft,
        color: isHidden
          ? NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText
          : NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis
      }}
    >
      {isHidden ? (
        <ApkHiddenBadgeIcon />
      ) : (
        <ApkPickBadgeIcon />
      )}

      <span
        style={{
          ...apkHomeBadgeTextStyle,
          color: isHidden
            ? NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText
            : NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis
        }}
      >
        {text}
      </span>
    </span>
  )
}

export function NdjcItemStatusBadgeRow({
  recommended,
  hidden
}: {
  recommended?: boolean
  hidden?: boolean
}) {
  if (!recommended && !hidden) return null

  return (
    <span
      className="ndjc-item-status-badge-row"
      style={{
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap'
      }}
    >
      {recommended ? (
        <NdjcItemStatusBadge text={APK_SHOWCASE_ITEM_UI.homeBadgeText} />
      ) : null}

      {hidden ? (
        <NdjcItemStatusBadge
          text="Hidden"
          variant="hidden"
        />
      ) : null}
    </span>
  )
}

export const apkDetailPickBadgeStyle: React.CSSProperties = {
  ...apkPickBadgeStyle,
  width: 'fit-content',
  maxWidth: '100%',
  justifySelf: 'start',
  alignSelf: 'start'
}

export const apkDetailPickBadgeTextStyle: React.CSSProperties = apkPickBadgeTextStyle

export function apkHomeMediaCardStyle(pressed = false): React.CSSProperties {
  return {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    minHeight: APK_SHOWCASE_ITEM_UI.homeCardHeight,
    borderRadius: APK_SHOWCASE_ITEM_UI.homeCardRadius,
    padding: APK_SHOWCASE_ITEM_UI.homeCardPadding,
    display: 'block',
    background: APK_SHOWCASE_ITEM_UI.transparent,
    boxShadow: pressed ? APK_SHOWCASE_ITEM_UI.homePressedShadow : APK_SHOWCASE_ITEM_UI.homeShadow,
    overflow: 'hidden',
    boxSizing: 'border-box',
    transform: pressed ? `scale(${APK_SHOWCASE_ITEM_UI.homePressedScale})` : 'scale(1)',
    transformOrigin: 'center center',
    transition: 'transform 120ms ease, box-shadow 120ms ease'
  }
}

export function apkHomeMediaCardButtonStyle(disabled = false): React.CSSProperties {
  return {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    minHeight: APK_SHOWCASE_ITEM_UI.homeCardHeight,
    border: 0,
    borderRadius: APK_SHOWCASE_ITEM_UI.homeCardRadius,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    textAlign: 'left',
    color: APK_SHOWCASE_ITEM_UI.black,
    background: APK_SHOWCASE_ITEM_UI.transparent,
    boxShadow: 'none',
    overflow: 'hidden',
    boxSizing: 'border-box',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? APK_SHOWCASE_ITEM_UI.disabledAlpha : 1,
    appearance: 'none',
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  }
}

export const apkHomeMediaImageWrapStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  aspectRatio: APK_SHOWCASE_ITEM_UI.homeImageAspectRatio,
  borderRadius: 0,
  overflow: 'hidden',
  background: APK_SHOWCASE_ITEM_UI.homeImageBg,
  flex: '0 0 auto',
  flexShrink: 0,
  boxSizing: 'border-box'
}

export const apkHomeMediaBodyStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  minHeight: APK_SHOWCASE_ITEM_UI.homeCardBottomMinHeight,
  flex: '0 0 auto',
  flexShrink: 0,
  boxSizing: 'border-box',
  padding: `${APK_SHOWCASE_ITEM_UI.homeContentPaddingTop}px ${APK_SHOWCASE_ITEM_UI.homeContentPaddingEnd}px ${APK_SHOWCASE_ITEM_UI.homeContentPaddingBottom}px ${APK_SHOWCASE_ITEM_UI.homeContentPaddingStart}px`,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  alignContent: 'start',
  gap: 8,
  overflow: 'hidden',
  background: APK_SHOWCASE_ITEM_UI.homeBottomBg
}

export const apkHomeMediaTitleStyle: React.CSSProperties = {
  minWidth: 0,
  maxWidth: '100%',
  margin: 0,
  color: APK_SHOWCASE_ITEM_UI.black,
  fontSize: APK_SHOWCASE_ITEM_UI.homeTitleSize,
  lineHeight: APK_SHOWCASE_ITEM_UI.homeTitleLineHeight,
  fontWeight: APK_SHOWCASE_ITEM_UI.homeTitleWeight,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'block'
}

export const apkHomePriceRowStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  display: 'flex',
  alignItems: 'baseline',
  gap: APK_SHOWCASE_ITEM_UI.homePriceGap,
  overflow: 'hidden'
}

export function apkHomePrimaryPriceStyle(style?: React.CSSProperties): React.CSSProperties {
  return {
    minWidth: 0,
    maxWidth: '100%',
    color: APK_SHOWCASE_ITEM_UI.black,
    fontSize: APK_SHOWCASE_ITEM_UI.homePriceSize,
    lineHeight: APK_SHOWCASE_ITEM_UI.homePriceLineHeight,
    fontWeight: APK_SHOWCASE_ITEM_UI.homePriceWeight,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
    ...style
  }
}

export const apkHomeSecondaryPriceStyle: React.CSSProperties = {
  minWidth: 0,
  maxWidth: '100%',
  color: `rgba(0, 0, 0, ${APK_SHOWCASE_ITEM_UI.homeOriginalAlpha})`,
  fontSize: APK_SHOWCASE_ITEM_UI.homeOriginalSize,
  lineHeight: APK_SHOWCASE_ITEM_UI.homeOriginalLineHeight,
  fontWeight: APK_SHOWCASE_ITEM_UI.homeOriginalWeight,
  textDecoration: 'line-through',
  textDecorationThickness: 1.5,
  textDecorationColor: `rgba(0, 0, 0, ${APK_SHOWCASE_ITEM_UI.homeOriginalAlpha})`,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'block'
}

export const apkHomeBadgeStyle: React.CSSProperties = {
  ...apkPickBadgeStyle,
  width: 'fit-content',
  maxWidth: '100%',
  justifySelf: 'start',
  alignSelf: 'start'
}

export const apkHomeBadgeSlotStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  minHeight: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  overflow: 'hidden',
  boxSizing: 'border-box'
}

export const apkHomeBadgeTextStyle: React.CSSProperties = apkPickBadgeTextStyle
export const apkHomeFavoriteOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: APK_SHOWCASE_ITEM_UI.homeFavoriteTop,
  right: APK_SHOWCASE_ITEM_UI.homeFavoriteRight,
  width: APK_SHOWCASE_ITEM_UI.homeFavoriteSize,
  height: APK_SHOWCASE_ITEM_UI.homeFavoriteSize,
  display: 'grid',
  placeItems: 'center'
}

export const apkHomeFavoriteIconStyle: React.CSSProperties = {
  width: APK_SHOWCASE_ITEM_UI.homeFavoriteSize,
  height: APK_SHOWCASE_ITEM_UI.homeFavoriteSize,
  display: 'block',
  color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
  background: APK_SHOWCASE_ITEM_UI.transparent,
  lineHeight: 1,
  flex: '0 0 auto'
}

export function apkCatalogCardStyle(pressed = false): React.CSSProperties {
  return {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    minHeight: APK_SHOWCASE_ITEM_UI.catalogImageSize + APK_SHOWCASE_ITEM_UI.catalogCardPadding * 2,
    border: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
    borderRadius: APK_SHOWCASE_ITEM_UI.catalogCardRadius,
    padding: APK_SHOWCASE_ITEM_UI.catalogCardPadding,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto auto',
    gap: APK_SHOWCASE_ITEM_UI.catalogGap,
    alignItems: 'center',
    background: NDJC_GLOBAL_UI_TOKENS.colors.surface,
    boxShadow: 'none',
    overflow: 'hidden',
    boxSizing: 'border-box',
    transform: pressed ? `scale(${APK_SHOWCASE_ITEM_UI.catalogPressedScale})` : 'scale(1)',
    transformOrigin: 'center center',
    transition: `transform ${APK_SHOWCASE_ITEM_UI.catalogTransitionMs}ms ease`
  }
}

export const apkCatalogMainButtonStyle: React.CSSProperties = {
  minWidth: 0,
  maxWidth: '100%',
  width: '100%',
  minHeight: APK_SHOWCASE_ITEM_UI.catalogImageSize,
  border: 0,
  borderRadius: APK_SHOWCASE_ITEM_UI.catalogCardRadius,
  padding: 0,
  display: 'grid',
  gridTemplateColumns: `${APK_SHOWCASE_ITEM_UI.catalogImageSize}px minmax(0, 1fr)`,
  gap: APK_SHOWCASE_ITEM_UI.catalogGap,
  alignItems: 'center',
  textAlign: 'left',
  background: 'transparent',
  boxShadow: 'none',
  overflow: 'hidden',
  boxSizing: 'border-box',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation'
}

export const apkCatalogMediaStyle: React.CSSProperties = {
  width: APK_SHOWCASE_ITEM_UI.catalogImageSize,
  height: APK_SHOWCASE_ITEM_UI.catalogImageSize,
  minWidth: APK_SHOWCASE_ITEM_UI.catalogImageSize,
  minHeight: APK_SHOWCASE_ITEM_UI.catalogImageSize,
  maxWidth: APK_SHOWCASE_ITEM_UI.catalogImageSize,
  maxHeight: APK_SHOWCASE_ITEM_UI.catalogImageSize,
  borderRadius: APK_SHOWCASE_ITEM_UI.catalogImageRadius,
  display: 'block',
  overflow: 'hidden',
  background: APK_MEDIA_UI.imagePlaceholderBg,
  flex: '0 0 auto',
  flexShrink: 0,
  boxSizing: 'border-box'
}

export const apkCatalogBodyStyle: React.CSSProperties = {
  minWidth: 0,
  maxWidth: '100%',
  minHeight: APK_SHOWCASE_ITEM_UI.catalogImageSize,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  gap: 0,
  overflow: 'hidden',
  boxSizing: 'border-box'
}

export const apkCatalogTitleStyle: React.CSSProperties = {
  minWidth: 0,
  maxWidth: '100%',
  margin: 0,
  color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
  fontSize: APK_SHOWCASE_ITEM_UI.catalogTitleSize,
  lineHeight: APK_SHOWCASE_ITEM_UI.catalogTitleLineHeight,
  fontWeight: APK_SHOWCASE_ITEM_UI.catalogTitleWeight,
  letterSpacing: '-0.01em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'block'
}

export const apkCatalogSpacerStyle: React.CSSProperties = {
  flex: '1 1 auto',
  minHeight: 0
}

export const apkCatalogPriceStackStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: 6,
  alignItems: 'end',
  overflow: 'hidden'
}

export const apkCatalogPriceRowStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  display: 'flex',
  alignItems: 'baseline',
  gap: APK_SHOWCASE_ITEM_UI.catalogPriceGap,
  overflow: 'hidden'
}

export const apkCatalogPriceStyle: React.CSSProperties = {
  minWidth: 0,
  maxWidth: '100%',
  color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
  fontSize: APK_SHOWCASE_ITEM_UI.catalogPriceSize,
  lineHeight: APK_SHOWCASE_ITEM_UI.catalogPriceLineHeight,
  fontWeight: APK_SHOWCASE_ITEM_UI.catalogPriceWeight,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'block'
}

export const apkCatalogOriginalPriceStyle: React.CSSProperties = {
  minWidth: 0,
  maxWidth: '100%',
  color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
  fontSize: APK_SHOWCASE_ITEM_UI.catalogOriginalSize,
  lineHeight: APK_SHOWCASE_ITEM_UI.catalogOriginalLineHeight,
  fontStyle: 'normal',
  fontWeight: APK_SHOWCASE_ITEM_UI.catalogOriginalWeight,
  textDecoration: 'line-through',
  textDecorationThickness: 1.5,
  textDecorationColor: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'block'
}

export const apkCatalogMetaTextStyle: React.CSSProperties = {
  marginLeft: 'auto',
  color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
  fontSize: 13,
  lineHeight: 1.2,
  fontWeight: 600,
  minWidth: 48,
  maxWidth: 84,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  textAlign: 'right',
  flex: '0 1 auto'
}

export const apkCatalogCategoryChipStyle: React.CSSProperties = {
  width: 'fit-content',
  maxWidth: '100%',
  borderRadius: 999,
  padding: `${APK_SHOWCASE_ITEM_UI.catalogChipPaddingY}px ${APK_SHOWCASE_ITEM_UI.catalogChipPaddingX}px`,
  display: 'inline-block',
  color: APK_SHOWCASE_ITEM_UI.ink2,
  background: APK_SHOWCASE_ITEM_UI.chipBg,
  fontSize: APK_SHOWCASE_ITEM_UI.catalogCategorySize,
  lineHeight: APK_SHOWCASE_ITEM_UI.catalogCategoryLineHeight,
  fontWeight: APK_SHOWCASE_ITEM_UI.catalogCategoryWeight,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}
export const apkAdminCatalogBottomStackStyle: React.CSSProperties = {
  minWidth: 0,
  maxWidth: '100%',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: 6,
  overflow: 'hidden'
}

export const apkAdminCatalogPriceMetaRowStyle: React.CSSProperties = {
  minWidth: 0,
  maxWidth: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'baseline',
  gap: APK_SHOWCASE_ITEM_UI.catalogPriceGap,
  overflow: 'hidden'
}

export const apkAdminCatalogViewsStyle: React.CSSProperties = {
  marginLeft: 'auto',
  color: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
  fontSize: 13,
  lineHeight: 1.2,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flex: '0 1 auto'
}


export function titleForDish(dish: DemoDish): string {
  return getDishTitle(dish) || 'Untitled item'
}

export function categoryForDish(dish: DemoDish): string {
  return String(dish.category || '').trim()
}


export function NdjcHomeStyleMediaCard({
  title,
  imageUrl,
  primaryText,
  secondaryText,
  badgeText,
  onClick,
  showTitleInBottom = true,
  primaryTextStyle,
  trailingOverlay,
  bottomTrailingContent,
  bottomContentOverride,
  disabled = false,
  priorityImage = false,
  imageBlurDataUrl = null
}: {
  title: string
  imageUrl?: string | null
  primaryText: string
  secondaryText?: string | null
  badgeText?: string | null
  onClick: () => void
  showTitleInBottom?: boolean
  primaryTextStyle?: React.CSSProperties
  trailingOverlay?: React.ReactNode
  bottomTrailingContent?: React.ReactNode
  bottomContentOverride?: React.ReactNode
  disabled?: boolean
  priorityImage?: boolean
  imageBlurDataUrl?: string | null
}) {
  const [pressed, setPressed] = React.useState(false)
  const cleanImageUrl = imageUrl?.trim() || ''
  const cleanSecondaryText = secondaryText?.trim() || ''
  const cleanBadgeText = badgeText?.trim() || ''
  const canClick = !disabled

  return (
    <article className="ndjc-home-style-media-card" style={apkHomeMediaCardStyle(pressed)}>
      <button
        type="button"
        style={apkHomeMediaCardButtonStyle(disabled)}
        disabled={disabled}
        onPointerDown={() => {
          if (canClick) setPressed(true)
        }}
        onPointerUp={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        onClick={() => {
          if (canClick) onClick()
        }}
      >
        <div className="ndjc-home-style-media-card-image" style={apkHomeMediaImageWrapStyle}>
          {cleanImageUrl ? (
            <NdjcShimmerImage
              src={cleanImageUrl}
              alt={title}
              placeholderCornerRadius={APK_SHOWCASE_ITEM_UI.homeImageRadius}
              contentScale={APK_SHOWCASE_ITEM_UI.homeImageContentScale}
              loading={priorityImage ? 'eager' : 'lazy'}
              fetchPriority={priorityImage ? 'high' : 'low'}
              decoding="async"
              imageWidth={600}
              imageHeight={600}
              sizes="(max-width: 720px) 50vw, 320px"
              blurDataUrl={imageBlurDataUrl}
            />
          ) : (
            <span
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                borderRadius: APK_SHOWCASE_ITEM_UI.homeImageRadius,
                background: APK_SHOWCASE_ITEM_UI.homeImageBg
              }}
              aria-hidden="true"
            />
          )}

          {trailingOverlay ? (
            <div className="ndjc-home-style-media-card-trailing" style={apkHomeFavoriteOverlayStyle}>
              {trailingOverlay}
            </div>
          ) : null}
        </div>

        <div className="ndjc-home-style-media-card-body" style={apkHomeMediaBodyStyle}>
          {bottomContentOverride ? (
            bottomContentOverride
          ) : (
            <>
              {showTitleInBottom ? (
                <strong style={apkHomeMediaTitleStyle}>{title}</strong>
              ) : (
                <span style={{ height: 0 }} aria-hidden="true" />
              )}

              <div style={apkHomeBadgeSlotStyle}>
                {cleanBadgeText ? (
                  <NdjcItemStatusBadge text={cleanBadgeText} />
                ) : (
                  <span style={{ height: 22 }} aria-hidden="true" />
                )}
              </div>

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: 0
                }}
              >
                <div style={{ ...apkHomePriceRowStyle, flex: '1 1 auto', minWidth: 0 }}>
                  <span style={apkHomePrimaryPriceStyle(primaryTextStyle)}>{primaryText}</span>

                  {cleanSecondaryText ? (
                    <span style={apkHomeSecondaryPriceStyle}>{cleanSecondaryText}</span>
                  ) : null}
                </div>

                {bottomTrailingContent ? (
                  <>
                    <span style={{ width: 8, flex: '0 0 8px' }} aria-hidden="true" />
                    {bottomTrailingContent}
                  </>
                ) : null}
              </div>
            </>
          )}
        </div>
      </button>
    </article>
  )
}

