'use client'

import React from 'react'
import {
  APK_SHOWCASE_COLOR_TOKENS,
  NDJC_BOTTOM_BAR_RESERVE_CSS_VAR,
  NDJC_GLOBAL_UI_TOKENS
} from './showcaseTokens'
import { APK_PAGE_SHELL_UI } from './showcaseLayout'
import { APK_EDIT_ITEM_UI } from './showcaseControls'

export const APK_DETAIL_PAGE_UI = {
  heroSize: 480,
  heroGradientTop: '#fff9ecf',
  heroGradientBottom: '#ffc1d9',
  heroCounterRadius: 10,
  heroCounterPaddingX: 10,
  heroCounterPaddingY: 6,
  heroCounterBottom: 10,
  heroCounterBg: 'rgba(0, 0, 0, 0.25)',
  heroCounterTextColor: 'rgba(255, 255, 255, 0.85)',
  heroCounterTextSize: 12,
  heroCounterTextWeight: 500,

  contentHorizontalPadding: APK_EDIT_ITEM_UI.screenPadding,
  contentVerticalPadding: APK_EDIT_ITEM_UI.bottomContentPadding,
  headerRowPaddingY: 12,
  headerRowGap: 12,
  headerRowIconSize: 24,
  headerRowFavoriteSize: 24,

  pickBadgePaddingX: 12,
  pickBadgePaddingY: 6,
  pickBadgeGap: 4,
  pickBadgeRadius: 999,
  pickBadgeIconSize: 18,
  pickBadgeTextSize: 12,
  pickBadgeTextLineHeight: 1,
  pickBadgeTextWeight: 600,
  pickBadgeBg: APK_SHOWCASE_COLOR_TOKENS.accent,
  pickBadgeTextColor: '#ffffff',
  pickBadgeBorderColor: 'rgba(255, 255, 255, 0.38)',
  pickBadgeBorderWidth: 1,

  titleSize: 34,
  titleLineHeight: 1.04,
  titleWeight: 760,

  priceSizeDiscount: 18,
  priceSizeNormal: 18,
  priceLineHeight: 1.16,
  priceWeight: 700,
  originalPriceSize: 13,
  originalPriceLineHeight: 1.22,
  originalPriceWeight: 500,
  originalPriceAlpha: 0.52,

  sectionGap: APK_EDIT_ITEM_UI.labelGap,
  categorySectionGap: APK_EDIT_ITEM_UI.labelGap,
  blockGap: APK_EDIT_ITEM_UI.sectionCardGap,
  titleBlockGap: APK_EDIT_ITEM_UI.labelGap,
  dividerTopPadding: APK_EDIT_ITEM_UI.smallGap,
  dividerColor: APK_EDIT_ITEM_UI.fieldBorderColor,
  dividerHeight: 1,

  sectionLabelSize: APK_EDIT_ITEM_UI.sectionTitleFontSize,
  sectionLabelLineHeight: APK_EDIT_ITEM_UI.sectionTitleLineHeight,
  sectionLabelWeight: APK_EDIT_ITEM_UI.sectionTitleFontWeight,
  sectionLabelColor: APK_EDIT_ITEM_UI.black,

  descriptionSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
  descriptionLineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
  descriptionWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight,
  descriptionColor: APK_EDIT_ITEM_UI.body70,
  descriptionCollapsedLines: 3,

  showMoreSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
  showMoreLineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
  showMoreWeight: 650,
  showMoreColor: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,

  unavailableSize: 12,
  unavailableLineHeight: 1.25,
  unavailableWeight: 500,
  unavailableColor: '#e53935'
} as const

export const apkDetailRootStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: 0,
  background: 'transparent',
  overflow: 'hidden'
}

export const apkDetailScrollStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  zIndex: 2
}

export const apkDetailHeroStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  height: 'auto',
  maxHeight: APK_DETAIL_PAGE_UI.heroSize,
  aspectRatio: '1 / 1',
  display: 'grid',
  placeItems: 'center',
  background: `linear-gradient(180deg, ${APK_DETAIL_PAGE_UI.heroGradientTop}, ${APK_DETAIL_PAGE_UI.heroGradientBottom})`,
  overflow: 'hidden',
  contain: 'layout paint',
  isolation: 'isolate',
  boxSizing: 'border-box'
}

export const apkDetailHeroImageButtonStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  border: 0,
  borderRadius: 0,
  padding: 0,
  display: 'block',
  overflow: 'hidden',
  background: 'transparent',
  boxShadow: 'none',
  cursor: 'pointer'
}

export const apkDetailHeroCounterStyle: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  bottom: APK_DETAIL_PAGE_UI.heroCounterBottom,
  transform: 'translateX(-50%)',
  borderRadius: APK_DETAIL_PAGE_UI.heroCounterRadius,
  padding: `${APK_DETAIL_PAGE_UI.heroCounterPaddingY}px ${APK_DETAIL_PAGE_UI.heroCounterPaddingX}px`,
  color: APK_DETAIL_PAGE_UI.heroCounterTextColor,
  background: APK_DETAIL_PAGE_UI.heroCounterBg,
  fontSize: APK_DETAIL_PAGE_UI.heroCounterTextSize,
  lineHeight: 1,
  fontWeight: APK_DETAIL_PAGE_UI.heroCounterTextWeight,
  whiteSpace: 'nowrap'
}

export const apkDetailHeaderRowStyle: React.CSSProperties = {
  width: '100%',
  padding: `${APK_DETAIL_PAGE_UI.headerRowPaddingY}px ${APK_DETAIL_PAGE_UI.contentHorizontalPadding}px`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: APK_DETAIL_PAGE_UI.headerRowGap,
  boxSizing: 'border-box'
}

export const apkDetailFavoriteWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexShrink: 0
}


export const apkDetailFavoriteButtonStyle: React.CSSProperties = {
  width: APK_DETAIL_PAGE_UI.headerRowFavoriteSize,
  height: APK_DETAIL_PAGE_UI.headerRowFavoriteSize,
  border: 0,
  borderRadius: 999,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  color: APK_SHOWCASE_COLOR_TOKENS.accent,
  background: 'transparent',
  boxShadow: 'none',
  lineHeight: 1,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation'
}

export function DetailFavoriteIcon({
  selected
}: {
  selected: boolean
}) {
  return (
    <svg
      width={APK_DETAIL_PAGE_UI.headerRowFavoriteSize}
      height={APK_DETAIL_PAGE_UI.headerRowFavoriteSize}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{
        display: 'block',
        color: 'currentColor'
      }}
    >
      {selected ? (
        <path
          fill="currentColor"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      ) : (
        <path
          fill="currentColor"
          d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3Zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05Z"
        />
      )}
    </svg>
  )
}

export const apkDetailContentStyle: React.CSSProperties = {
  width: '100%',
  padding: `16px ${APK_DETAIL_PAGE_UI.contentHorizontalPadding}px calc(${APK_DETAIL_PAGE_UI.contentVerticalPadding}px + var(${NDJC_BOTTOM_BAR_RESERVE_CSS_VAR}, ${APK_PAGE_SHELL_UI.tabBottomReserve}px))`,
  display: 'grid',
  gap: APK_DETAIL_PAGE_UI.blockGap,
  boxSizing: 'border-box'
}

export const apkDetailTitleBlockStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: APK_DETAIL_PAGE_UI.titleBlockGap
}

export const apkDetailHeroActionsStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  alignItems: 'center',
  gap: APK_EDIT_ITEM_UI.fieldGap,
  pointerEvents: 'auto'
}

export const apkDetailHeroActionItemStyle: React.CSSProperties = {
  minWidth: 0,
  display: 'grid'
}

export function apkDetailHeroActionButtonStyle(pressed = false): React.CSSProperties {
  return {
    width: '100%',
    minHeight: 44,
    border: `${APK_EDIT_ITEM_UI.fieldBorderWidth}px solid ${APK_EDIT_ITEM_UI.fieldBorderColor}`,
    borderRadius: APK_EDIT_ITEM_UI.fieldRadius,
    padding: `0 ${APK_EDIT_ITEM_UI.fieldPaddingX}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
    background: APK_EDIT_ITEM_UI.fieldBackground,
    boxShadow: 'none',
    cursor: 'pointer',
    transform: pressed ? 'scale(0.985)' : 'scale(1)',
    transition: 'background 120ms ease, transform 120ms ease, border-color 120ms ease',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  }
}

export const apkDetailHeroActionLabelStyle: React.CSSProperties = {
  minWidth: 0,
  color: 'currentColor',
  fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
  lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
  fontWeight: 650,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

export function NdjcDetailHeroActionButton({
  label,
  ariaLabel,
  icon,
  onClick
}: {
  label: string
  ariaLabel: string
  pressedLabel?: string
  icon: React.ReactNode
  onClick: () => void
}) {
  const [pressed, setPressed] = React.useState(false)

  function releasePressState(): void {
    setPressed(false)
  }

  return (
    <div style={apkDetailHeroActionItemStyle}>
      <button
        type="button"
        style={apkDetailHeroActionButtonStyle(pressed)}
        onPointerDown={() => setPressed(true)}
        onPointerUp={releasePressState}
        onPointerCancel={releasePressState}
        onPointerLeave={releasePressState}
        onBlur={releasePressState}
        onClick={onClick}
        aria-label={ariaLabel || label}
      >
        {icon}

        <span style={apkDetailHeroActionLabelStyle}>
          {label}
        </span>
      </button>
    </div>
  )
}

export const apkDetailTitleStyle: React.CSSProperties = {
  margin: 0,
  color: '#000000',
  fontSize: APK_DETAIL_PAGE_UI.titleSize,
  lineHeight: APK_DETAIL_PAGE_UI.titleLineHeight,
  fontWeight: APK_DETAIL_PAGE_UI.titleWeight,
  letterSpacing: '-1.1px',
  textRendering: 'geometricPrecision',
  overflowWrap: 'anywhere'
}

export const apkDetailPriceRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8
}

export const apkDetailPrimaryPriceStyle: React.CSSProperties = {
  color: '#000000',
  fontSize: APK_DETAIL_PAGE_UI.priceSizeDiscount,
  lineHeight: APK_DETAIL_PAGE_UI.priceLineHeight,
  fontWeight: APK_DETAIL_PAGE_UI.priceWeight,
  whiteSpace: 'nowrap'
}

export const apkDetailNormalPriceStyle: React.CSSProperties = {
  color: '#000000',
  fontSize: APK_DETAIL_PAGE_UI.priceSizeNormal,
  lineHeight: APK_DETAIL_PAGE_UI.priceLineHeight,
  fontWeight: APK_DETAIL_PAGE_UI.priceWeight,
  whiteSpace: 'nowrap'
}

export const apkDetailOriginalPriceStyle: React.CSSProperties = {
  color: `rgba(0, 0, 0, ${APK_DETAIL_PAGE_UI.originalPriceAlpha})`,
  fontSize: APK_DETAIL_PAGE_UI.originalPriceSize,
  lineHeight: APK_DETAIL_PAGE_UI.originalPriceLineHeight,
  fontWeight: APK_DETAIL_PAGE_UI.originalPriceWeight,
  textDecoration: 'line-through',
  whiteSpace: 'nowrap'
}

export const apkDetailDividerStyle: React.CSSProperties = {
  width: '100%',
  height: APK_DETAIL_PAGE_UI.dividerHeight,
  marginTop: APK_DETAIL_PAGE_UI.dividerTopPadding,
  background: APK_DETAIL_PAGE_UI.dividerColor
}

export const apkDetailSectionStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: APK_DETAIL_PAGE_UI.sectionGap
}

export const apkDetailSectionLabelStyle: React.CSSProperties = {
  margin: 0,
  color: APK_DETAIL_PAGE_UI.sectionLabelColor,
  fontSize: APK_DETAIL_PAGE_UI.sectionLabelSize,
  lineHeight: APK_DETAIL_PAGE_UI.sectionLabelLineHeight,
  fontWeight: APK_DETAIL_PAGE_UI.sectionLabelWeight,
  letterSpacing: '0',
  textTransform: 'none'
}

export const apkDetailDescriptionStyle: React.CSSProperties = {
  margin: 0,
  color: APK_DETAIL_PAGE_UI.descriptionColor,
  fontSize: APK_DETAIL_PAGE_UI.descriptionSize,
  lineHeight: APK_DETAIL_PAGE_UI.descriptionLineHeight,
  fontWeight: APK_DETAIL_PAGE_UI.descriptionWeight,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere'
}

export const apkDetailShowMoreButtonStyle: React.CSSProperties = {
  width: 'fit-content',
  border: 0,
  borderRadius: 0,
  padding: 0,
  color: APK_DETAIL_PAGE_UI.showMoreColor,
  background: 'transparent',
  boxShadow: 'none',
  fontSize: APK_DETAIL_PAGE_UI.showMoreSize,
  lineHeight: APK_DETAIL_PAGE_UI.showMoreLineHeight,
  fontWeight: APK_DETAIL_PAGE_UI.showMoreWeight,
  cursor: 'pointer'
}

export const apkDetailTagsRowStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10
}

