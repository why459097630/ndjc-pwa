'use client'

import React from 'react'
import mapMarkerSvgAsset from '../assets/map-marker.svg'
import {
  APK_SHOWCASE_COLOR_TOKENS,
  NDJC_GLOBAL_UI_TOKENS
} from './showcaseTokens'
import { APK_EDIT_ITEM_UI } from './showcaseControls'
import {
  APK_MEDIA_UI,
  NdjcShimmerImage
} from './showcaseMedia'

export const mapMarkerSvgUrl =
  typeof mapMarkerSvgAsset === 'string'
    ? mapMarkerSvgAsset
    : mapMarkerSvgAsset.src

export const APK_STORE_PROFILE_UI = {
  black: '#000000',
  white: '#ffffff',
  ink: '#111827',
  ink90: 'rgba(17, 24, 39, 0.90)',
  ink70: 'rgba(17, 24, 39, 0.70)',
  ink60: 'rgba(17, 24, 39, 0.60)',
  ink55: 'rgba(17, 24, 39, 0.55)',
  ink45: 'rgba(17, 24, 39, 0.45)',
  ink10: 'rgba(17, 24, 39, 0.10)',
  ink06: 'rgba(17, 24, 39, 0.06)',
  ink2: '#374151',
  muted: '#6b7280',
  surface: '#ffffff',
  softSurface: '#f3f4f6',
  chipSurface: '#f8fafc',
  logoSurface: '#e5e7eb',
  pink: APK_SHOWCASE_COLOR_TOKENS.accent,
  green: APK_SHOWCASE_COLOR_TOKENS.primary,

  sectionGap: 10,
  sectionHeaderGap: 8,
  sectionHeaderBarWidth: 2,
  sectionHeaderBarHeight: 14,
  sectionHeaderBarRadius: 999,
  sectionHeaderTitleSize: 14,
  sectionHeaderTitleLineHeight: 1.25,
  sectionHeaderTitleWeight: 500,

  contactListGap: 0,
  contactCardRadius: 16,
  contactCardPaddingX: 16,
  contactRowHeight: 48,
  contactLabelWidth: 96,
  contactLabelSize: 14,
  contactValueSize: 14,
  contactDividerHeight: 1,

  coverHeight: 150,
  coverCardWidth: 240,
  coverCardRadius: 14,
  coverGap: 10,
  coverPaddingX: 2,
  coverPressedScale: 0.965,
  topContentPadding: 127,
  coverPlaceholderBgTop: 'rgba(255, 255, 255, 0.38)',
  coverPlaceholderBgMid: '#f3f4f6',
  coverPlaceholderBgBottom: '#e5e7eb',

  logoSize: 72,
  logoIconSize: 34,
  logoPressedScale: 0.965,
  statusRadius: 999,
  statusPaddingX: 12,
  statusPaddingY: 6,

  mapHeight: 120,
  mapRadius: 16,
  mapPadding: 16,
  mapGap: 6,
  mapBorderWidth: 1,

  cardRadius: 16,
  cardPadding: 16,
  cardGap: 6,
  cardBorderWidth: 1,

  sectionTitleSize: 14,
  sectionTitleLineHeight: 1.25,
  sectionTitleWeight: 500,

  bodySize: 15,
  bodyLineHeight: 1.45,
  bodyWeight: 400,

  emptyBodySize: 12,
  emptyBodyLineHeight: '20px',

  labelSize: 12,
  labelLineHeight: 1.2,
  labelWeight: 500,

  readOnlyLabelSize: 12,
  readOnlyLabelLineHeight: 1.2,
  readOnlyValueSize: 14,
  readOnlyValueLineHeight: 1.45,
  profileReadOnlyGap: 2,
  profileFieldGap: 6,
  errorAlpha: 0.8,

  aboutCollapsedLines: 3,
  aboutToggleTopGap: 8,
  appAboutGap: 10,
  appAboutRowGap: 4,
  servicesGap: 8,
  serviceChipRadius: 999,
  serviceChipPaddingX: 12,
  serviceChipPaddingY: 8
} as const

export const apkStoreSectionStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: NDJC_GLOBAL_UI_TOKENS.spacing.sm
}

export const apkStoreSectionHeaderStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 0
}

export const apkStoreSectionHeaderBarStyle: React.CSSProperties = {
  display: 'none'
}

export const apkStoreSectionTitleStyle: React.CSSProperties = {
  margin: 0,
  color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
  fontSize: NDJC_GLOBAL_UI_TOKENS.typography.titleMedium.fontSize,
  lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.titleMedium.lineHeight,
  fontWeight: 700,
  letterSpacing: '-0.2px'
}

export const apkStoreBodyTextStyle: React.CSSProperties = {
  margin: 0,
  color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
  fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontSize,
  lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.lineHeight,
  fontWeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontWeight,
  whiteSpace: 'pre-wrap'
}

export const apkStoreMutedTextStyle: React.CSSProperties = {
  margin: 0,
  color: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
  fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
  lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
  fontWeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontWeight
}

export const apkStoreLabelStyle: React.CSSProperties = {
  margin: 0,
  color: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
  fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
  lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
  fontWeight: 650
}

export const apkStoreValueStyle: React.CSSProperties = {
  margin: 0,
  color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
  fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontSize,
  lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.lineHeight,
  fontWeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontWeight,
  overflowWrap: 'anywhere'
}

export const apkStoreInfoLineButtonStyle: React.CSSProperties = {
  width: '100%',
  border: 0,
  borderRadius: 0,
  padding: 0,
  display: 'grid',
  gap: APK_STORE_PROFILE_UI.profileReadOnlyGap,
  textAlign: 'left',
  background: 'transparent',
  boxShadow: 'none'
}

export const apkStoreCardSurfaceStyle: React.CSSProperties = {
  width: '100%',
  border: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.border}`,
  borderRadius: NDJC_GLOBAL_UI_TOKENS.components.input.radius,
  padding: NDJC_GLOBAL_UI_TOKENS.spacing.xl,
  display: 'grid',
  gap: NDJC_GLOBAL_UI_TOKENS.spacing.sm,
  color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
  background: NDJC_GLOBAL_UI_TOKENS.colors.surface,
  boxShadow: 'none',
  boxSizing: 'border-box'
}

export const apkStoreContactCardStyle: React.CSSProperties = {
  width: '100%',
  border: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.border}`,
  borderRadius: NDJC_GLOBAL_UI_TOKENS.components.input.radius,
  display: 'grid',
  overflow: 'hidden',
  color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
  background: NDJC_GLOBAL_UI_TOKENS.colors.surface,
  boxSizing: 'border-box'
}

export function StoreProfileSectionHeader({ title }: { title: string }) {
  return (
    <div style={apkStoreSectionHeaderStyle}>
      <span style={apkStoreSectionHeaderBarStyle} aria-hidden="true" />
      <h2 style={apkStoreSectionTitleStyle}>{title}</h2>
    </div>
  )
}
export const APK_STORE_EDIT_UI = {
  black90: NDJC_GLOBAL_UI_TOKENS.colors.textStrong,
  black85: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
  black75: NDJC_GLOBAL_UI_TOKENS.colors.textSecondary,
  black60: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
  black55: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
  black45: 'rgba(71, 84, 103, 0.62)',
  black10: NDJC_GLOBAL_UI_TOKENS.colors.divider,
  white: '#ffffff',
  brand: APK_SHOWCASE_COLOR_TOKENS.accent,
  green: APK_SHOWCASE_COLOR_TOKENS.primary,
  red75: `rgba(${NDJC_GLOBAL_UI_TOKENS.colors.brandStrongRgb}, 0.75)`,
  error80: NDJC_GLOBAL_UI_TOKENS.colors.danger,

  titleSize: APK_EDIT_ITEM_UI.sectionTitleFontSize,
  titleLineHeight: APK_EDIT_ITEM_UI.sectionTitleLineHeight,
  titleWeight: APK_EDIT_ITEM_UI.sectionTitleFontWeight,
  subtitleSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
  subtitleLineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
  subtitleWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,

  sectionSubtitleTopGap: APK_EDIT_ITEM_UI.titleToHint,
  sectionBottomGap: APK_EDIT_ITEM_UI.hintToContent,
  fieldGap: APK_EDIT_ITEM_UI.labelGap,
  rowGap: APK_EDIT_ITEM_UI.spacer8,
  removeTopPadding: APK_EDIT_ITEM_UI.smallGap,
  removeBottomPadding: APK_EDIT_ITEM_UI.spacer8,
  errorBottomGap: APK_EDIT_ITEM_UI.spacer8,

  nameColumnFlex: 0.38,
  valueColumnFlex: 0.62,

  labelSize: APK_EDIT_ITEM_UI.labelFontSize,
  labelLineHeight: APK_EDIT_ITEM_UI.labelLineHeight,
  labelWeight: APK_EDIT_ITEM_UI.labelFontWeight,
  labelBottomGap: APK_EDIT_ITEM_UI.spacer8,
  pickerBottomGap: APK_EDIT_ITEM_UI.mediaGridTop,

  editorCardRadius: APK_EDIT_ITEM_UI.sectionCardRadius,
  editorCardPadding: 0,
  editorCardGap: APK_EDIT_ITEM_UI.sectionCardGap,
  editorCardBorderWidth: 0,
  editorCardBorderColor: 'transparent',

  logoColumns: 3,
  imageGridColumns: 3,
  imageCellGap: APK_MEDIA_UI.imageGridGap,
  imageCornerRadius: APK_MEDIA_UI.imageEditRadius,
  maxCoverImages: 9,

  logoPickerSize: 96,
  coverPickerMinHeight: 112,
  pickerTitleSize: APK_EDIT_ITEM_UI.labelFontSize,
  pickerTitleWeight: APK_EDIT_ITEM_UI.labelFontWeight,
  pickerHintSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
  pickerHintWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,

  servicesGap: APK_EDIT_ITEM_UI.spacer8,
  serviceChipRadius: 999,
  serviceChipPaddingX: 12,
  serviceChipPaddingY: 8
} as const

export const apkStoreEditSectionTitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_EDIT_ITEM_UI.sectionLabelColor,
  fontSize: APK_EDIT_ITEM_UI.sectionTitleFontSize,
  lineHeight: APK_EDIT_ITEM_UI.sectionTitleLineHeight,
  fontWeight: APK_EDIT_ITEM_UI.sectionTitleFontWeight
}

export const apkStoreEditSectionSubtitleStyle: React.CSSProperties = {
  margin: `${APK_EDIT_ITEM_UI.titleToHint}px 0 0`,
  color: APK_EDIT_ITEM_UI.body55,
  fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
  lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
  fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
}

export const apkStoreEditSectionBottomSpacerStyle: React.CSSProperties = {
  height: APK_EDIT_ITEM_UI.hintToContent
}

export const apkStoreEditColumnStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: 0
}

export const apkStoreEditRowStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  gap: APK_STORE_EDIT_UI.rowGap
}

export const apkStoreEditRemoveRowStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end'
}

export const apkStoreEditRemoveButtonStyle: React.CSSProperties = {
  border: 0,
  borderRadius: 0,
  padding: `${APK_STORE_EDIT_UI.removeTopPadding}px 0 ${APK_STORE_EDIT_UI.removeBottomPadding}px`,
  color: APK_STORE_EDIT_UI.black55,
  background: 'transparent',
  boxShadow: 'none',
  fontSize: 14,
  lineHeight: 1.2,
  fontWeight: 500,
  cursor: 'pointer'
}

export const apkStoreEditLabelStyle: React.CSSProperties = {
  color: APK_STORE_EDIT_UI.black90,
  fontSize: APK_STORE_EDIT_UI.labelSize,
  lineHeight: APK_STORE_EDIT_UI.labelLineHeight,
  fontWeight: APK_STORE_EDIT_UI.labelWeight
}

export const apkStoreEditCardStyle: React.CSSProperties = {
  width: '100%',
  border: `${APK_STORE_EDIT_UI.editorCardBorderWidth}px solid ${APK_STORE_EDIT_UI.editorCardBorderColor}`,
  borderRadius: APK_STORE_EDIT_UI.editorCardRadius,
  padding: APK_STORE_EDIT_UI.editorCardPadding,
  display: 'grid',
  gap: APK_STORE_EDIT_UI.editorCardGap,
  background: APK_STORE_EDIT_UI.white
}

export const apkStoreEditPickerHeaderStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: 3
}

export const apkStoreEditPickerTitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_STORE_EDIT_UI.black90,
  fontSize: APK_STORE_EDIT_UI.pickerTitleSize,
  lineHeight: 1.25,
  fontWeight: APK_STORE_EDIT_UI.pickerTitleWeight
}

export const apkStoreEditPickerHintStyle: React.CSSProperties = {
  margin: 0,
  color: APK_STORE_EDIT_UI.black55,
  fontSize: APK_STORE_EDIT_UI.pickerHintSize,
  lineHeight: 1.35,
  fontWeight: APK_STORE_EDIT_UI.pickerHintWeight
}

export function NdjcStaticMapPreview() {
  return (
    <img
      className="ndjc-static-map-preview"
      src={mapMarkerSvgUrl}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{
        width: 56,
        height: 56,
        flex: '0 0 56px',
        display: 'block',
        objectFit: 'contain',
        opacity: 0.9
      }}
    />
  )
}

export function StoreProfileMapPreview({
  address,
  mapUrl,
  onOpen,
  onOpenMap
}: {
  address?: string | null
  mapUrl?: string | null
  onOpen?: (url: string) => void
  onOpenMap?: (url: string) => void
}) {
  const cleanAddress = address?.trim() || ''
  const cleanMapUrl = mapUrl?.trim() || ''
  const openValue = cleanMapUrl || cleanAddress
  const displayValue = cleanAddress || openValue
  const handleOpen = onOpen || onOpenMap
  const [pressed, setPressed] = React.useState(false)

  if (!cleanAddress && !cleanMapUrl) return null

  function clearPressed(): void {
    setPressed(false)
  }

  return (
    <button
      type="button"
      className="ndjc-store-profile-map-preview"
      style={{
        width: '100%',
        minHeight: 82,
        border: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.border}`,
        outline: 'none',
        borderRadius: 16,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        overflow: 'hidden',
        textAlign: 'left',
        color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
        background: pressed
          ? NDJC_GLOBAL_UI_TOKENS.colors.surfaceSoft
          : NDJC_GLOBAL_UI_TOKENS.colors.surface,
        boxShadow: 'none',
        boxSizing: 'border-box',
        cursor: handleOpen ? 'pointer' : 'default',
        transform: pressed ? 'scale(0.985)' : 'scale(1)',
        transformOrigin: 'center',
        transition: 'transform 140ms ease, background 140ms ease, opacity 140ms ease',
        opacity: pressed ? 0.96 : 1,
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
      disabled={!handleOpen}
      onPointerDown={() => {
        if (!handleOpen) return
        setPressed(true)
      }}
      onPointerUp={clearPressed}
      onPointerCancel={clearPressed}
      onPointerLeave={clearPressed}
      onBlur={clearPressed}
      onClick={() => {
        clearPressed()
        if (openValue) handleOpen?.(openValue)
      }}
    >
      <NdjcStaticMapPreview />

      <div
        style={{
          minWidth: 0,
          flex: '1 1 auto',
          display: 'grid',
          gap: 5,
          boxSizing: 'border-box'
        }}
      >
        <span
          style={{
            color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
            fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontSize,
            lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.lineHeight,
            fontWeight: 700,
            letterSpacing: '-0.15px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          Address
        </span>

        <span
          style={{
            color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
            fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontSize,
            lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.lineHeight,
            fontWeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontWeight,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {displayValue}
        </span>

        <span
          style={{
            width: 'fit-content',
            color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
            fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
            lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }}
        >
          Open map →
        </span>
      </div>
    </button>
  )
}

export function UniversalStoreCoverPlaceholderCard() {
  return (
    <div
      className="ndjc-universal-store-cover-placeholder-card"
      style={{
        width: '100%',
        height: APK_STORE_PROFILE_UI.coverHeight,
        borderRadius: APK_STORE_PROFILE_UI.coverCardRadius,
        overflow: 'hidden',
        position: 'relative',
        background: `linear-gradient(180deg, ${APK_STORE_PROFILE_UI.coverPlaceholderBgTop}, ${APK_STORE_PROFILE_UI.coverPlaceholderBgMid}, ${APK_STORE_PROFILE_UI.coverPlaceholderBgBottom})`
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0) 68%)'
        }}
      />
    </div>
  )
}

export function UniversalStoreLogoPlaceholder() {
  return (
    <div
      className="ndjc-universal-store-logo-placeholder"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center',
        color: '#7f8a97',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.72), #e5e7eb)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.72)'
      }}
      aria-hidden="true"
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block'
        }}
      >
        <path
          d="M7.25 12.75L8.55 7.75C8.78 6.88 9.56 6.25 10.46 6.25H19.54C20.44 6.25 21.22 6.88 21.45 7.75L22.75 12.75"
          stroke="#7f8a97"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 12.75H22.5"
          stroke="#7f8a97"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8.75 13.25V21.5C8.75 22.19 9.31 22.75 10 22.75H20C20.69 22.75 21.25 22.19 21.25 21.5V13.25"
          stroke="#7f8a97"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22.5V17.25C12 16.56 12.56 16 13.25 16H16.75C17.44 16 18 16.56 18 17.25V22.5"
          stroke="#7f8a97"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 12.75C8.5 14.13 9.62 15.25 11 15.25C12.1 15.25 13.03 14.54 13.36 13.56C13.66 14.54 14.57 15.25 15.65 15.25C16.73 15.25 17.64 14.54 17.94 13.56C18.27 14.54 19.2 15.25 20.3 15.25C21.52 15.25 22.54 14.37 22.75 13.21"
          stroke="#7f8a97"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.92"
        />
      </svg>
    </div>
  )
}

export function UniversalStoreBrandHeader({
  coverUrl,
  logoUrl,
  logoPreviewUrl,
  title,
  subtitle,
  businessStatus,
  onPreview
}: {
  coverUrl: string
  logoUrl: string
  logoPreviewUrl?: string
  title: string
  subtitle: string
  businessStatus: string
  onPreview: (images: string[], startIndex: number) => void
}) {
  const covers = coverUrl
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index)
    .slice(0, 5)

  const cleanLogoUrl = logoUrl.trim()
  const cleanLogoPreviewUrl = logoPreviewUrl?.trim() || cleanLogoUrl
  const cleanSubtitle = subtitle.trim()
  const rawBusinessStatus = businessStatus.trim()
  const cleanBusinessStatus = rawBusinessStatus && !/^\d+$/.test(rawBusinessStatus)
    ? rawBusinessStatus
    : ''
  const [pressedBrandCoverIndex, setPressedBrandCoverIndex] = React.useState<number | null>(null)
  const [isLogoPressed, setIsLogoPressed] = React.useState(false)

  return (
    <section
      className="ndjc-apk-store-brand-header"
      style={{
        width: '100%',
        display: 'grid',
        gap: covers.length ? 12 : 0
      }}
      data-business-status={cleanBusinessStatus || undefined}
    >
      {covers.length ? (
        <section
          className="ndjc-apk-store-brand-cover-row"
          style={{
            width: '100%',
            height: APK_STORE_PROFILE_UI.coverHeight,
            display: 'flex',
            gap: APK_STORE_PROFILE_UI.coverGap,
            padding: `0 ${APK_STORE_PROFILE_UI.coverPaddingX}px`,
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {covers.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              className="ndjc-apk-store-brand-cover-card"
              style={{
                width: APK_STORE_PROFILE_UI.coverCardWidth,
                minWidth: APK_STORE_PROFILE_UI.coverCardWidth,
                height: '100%',
                border: 0,
                borderRadius: APK_STORE_PROFILE_UI.coverCardRadius,
                padding: 0,
                display: 'block',
                overflow: 'hidden',
                background: APK_STORE_PROFILE_UI.softSurface,
                boxShadow: 'none',
                transform: pressedBrandCoverIndex === index ? `scale(${APK_STORE_PROFILE_UI.coverPressedScale})` : 'scale(1)',
                transition: 'transform 120ms ease',
                cursor: 'pointer',
                touchAction: 'pan-x',
                userSelect: 'none',
                scrollSnapAlign: 'start'
              }}
              onPointerDown={() => setPressedBrandCoverIndex(index)}
              onPointerUp={() => setPressedBrandCoverIndex(null)}
              onPointerCancel={() => setPressedBrandCoverIndex(null)}
              onPointerLeave={() => setPressedBrandCoverIndex(null)}
              onClick={() => onPreview(covers, index)}
              aria-label={`Preview cover ${index + 1}`}
            >
              <NdjcShimmerImage
                src={url}
                alt={`Cover ${index + 1}`}
                placeholderCornerRadius={APK_STORE_PROFILE_UI.coverCardRadius}
                contentScale="cover"
              />
            </button>
          ))}
        </section>
      ) : null}

      <section
        className="ndjc-apk-store-brand-main-row"
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: `${APK_STORE_PROFILE_UI.logoSize}px minmax(0, 1fr)`,
          gap: 14,
          alignItems: 'center'
        }}
      >
        {cleanLogoUrl ? (
          <button
            type="button"
            className="ndjc-apk-store-logo"
            style={{
              width: APK_STORE_PROFILE_UI.logoSize,
              minWidth: APK_STORE_PROFILE_UI.logoSize,
              height: APK_STORE_PROFILE_UI.logoSize,
              border: 0,
              borderRadius: 999,
              padding: 0,
              overflow: 'hidden',
              background: APK_STORE_PROFILE_UI.logoSurface,
              boxShadow: !isLogoPressed ? '0 2px 6px rgba(0, 0, 0, 0.10)' : 'none',
              transform: isLogoPressed ? `scale(${APK_STORE_PROFILE_UI.coverPressedScale})` : 'scale(1)',
              transition: 'transform 120ms ease, box-shadow 120ms ease',
              cursor: 'pointer'
            }}
            onPointerDown={() => setIsLogoPressed(true)}
            onPointerUp={() => setIsLogoPressed(false)}
            onPointerCancel={() => setIsLogoPressed(false)}
            onPointerLeave={() => setIsLogoPressed(false)}
            onClick={() => onPreview([cleanLogoPreviewUrl], 0)}
            aria-label="Preview store logo"
          >
            <NdjcShimmerImage
              src={cleanLogoUrl}
              alt="Logo"
              placeholderCornerRadius={999}
              contentScale="cover"
            />
          </button>
        ) : (
          <div
            className="ndjc-apk-store-logo-placeholder-wrap"
            style={{
              width: APK_STORE_PROFILE_UI.logoSize,
              minWidth: APK_STORE_PROFILE_UI.logoSize,
              height: APK_STORE_PROFILE_UI.logoSize,
              borderRadius: 999,
              overflow: 'hidden'
            }}
          >
            <UniversalStoreLogoPlaceholder />
          </div>
        )}

        <section
          className="ndjc-apk-store-brand-text"
          style={{
            minWidth: 0,
            display: 'grid',
            gap: 4
          }}
        >
          <section
            className="ndjc-apk-store-brand-title-row"
            style={{
              width: '100%',
              minWidth: 0,
              display: 'grid',
              gridTemplateColumns: cleanBusinessStatus ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr)',
              gap: 10,
              alignItems: 'center'
            }}
          >
            <h1
              style={{
                margin: 0,
                color: NDJC_GLOBAL_UI_TOKENS.colors.textPrimary,
                fontSize: 22,
                lineHeight: 1.15,
                fontWeight: 700,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {title.trim() || 'Store'}
            </h1>

            {cleanBusinessStatus ? (
              <span
                className="ndjc-apk-store-business-status"
                style={{
                  flexShrink: 0,
                  borderRadius: APK_STORE_PROFILE_UI.statusRadius,
                  padding: `${APK_STORE_PROFILE_UI.statusPaddingY}px ${APK_STORE_PROFILE_UI.statusPaddingX}px`,
                  color: '#FFFFFF',
                  background: APK_STORE_PROFILE_UI.pink,
                  fontSize: 12,
                  lineHeight: 1.25,
                  fontWeight: 500,
                  whiteSpace: 'nowrap'
                }}
              >
                {cleanBusinessStatus}
              </span>
            ) : null}
          </section>

          {cleanSubtitle ? (
            <p
              style={{
                margin: 0,
                color: NDJC_GLOBAL_UI_TOKENS.colors.textSecondary,
                fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontSize,
                lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.lineHeight,
                fontWeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontWeight,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {cleanSubtitle}
            </p>
          ) : null}
        </section>
      </section>
    </section>
  )
}

export function UniversalStoreEmptyInfoText() {
  return (
    <p className="ndjc-muted-text" style={apkStoreMutedTextStyle}>
      No information added yet
    </p>
  )
}

export function UniversalStoreAboutSection({ description }: { description?: string | null }) {
  const cleanDescription = description?.trim() || ''
  const [expanded, setExpanded] = React.useState(false)

  React.useEffect(() => {
    setExpanded(false)
  }, [cleanDescription])

  return (
    <section
      className="ndjc-apk-store-section"
      style={{
        ...apkStoreSectionStyle,
        gap: 8
      }}
    >
      <StoreProfileSectionHeader title="About" />

      {cleanDescription ? (
        <>
          <p
            className="ndjc-muted-text"
            style={{
              ...apkStoreBodyTextStyle,
              display: expanded ? 'block' : '-webkit-box',
              WebkitLineClamp: expanded ? undefined : APK_STORE_PROFILE_UI.aboutCollapsedLines,
              WebkitBoxOrient: expanded ? undefined : 'vertical',
              overflow: expanded ? 'visible' : 'hidden'
            }}
          >
            {cleanDescription}
          </p>

          <button
            type="button"
            style={{
              width: 'fit-content',
              border: 0,
              borderRadius: 0,
              padding: `${APK_STORE_PROFILE_UI.aboutToggleTopGap}px 0 0`,
              color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
              background: 'transparent',
              boxShadow: 'none',
              fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
              lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
              fontWeight: 650
            }}
            onClick={() => setExpanded(value => !value)}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        </>
      ) : (
        <UniversalStoreEmptyInfoText />
      )}
    </section>
  )
}

export function UniversalStoreAppAboutSection({
  appName = 'App',
  merchantEmail = 'Not provided',
  privacyUrl,
  poweredByUrl,
  onOpenPrivacy,
  onOpenPoweredBy
}: {
  appName?: string | null
  merchantEmail?: string | null
  privacyUrl?: string | null
  poweredByUrl?: string | null
  onOpenPrivacy?: (url: string) => void
  onOpenPoweredBy?: (url: string) => void
}) {
  const cleanAppName = appName?.trim() || 'App'
  const cleanEmail = merchantEmail?.trim() || 'Not provided'
  const cleanPrivacyUrl = privacyUrl?.trim() || ''
  const cleanPoweredByUrl = poweredByUrl?.trim() || ''

  return (
    <section
      className="ndjc-apk-store-section"
      style={{
        ...apkStoreSectionStyle,
        gap: 12,
        marginTop: 4,
        opacity: 0.9
      }}
    >
      <StoreProfileSectionHeader title="About this app" />

      <div
        style={{
          width: '100%',
          display: 'grid',
          gap: 10,
          color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
          background: 'transparent',
          boxSizing: 'border-box'
        }}
      >
        <ProfileReadOnlyRow label="App Name" value={cleanAppName} />
        <ProfileReadOnlyRow label="Contact" value={cleanEmail} />

        <section
          className="ndjc-profile-read-only-row"
          style={{
            width: '100%',
            minHeight: 34,
            paddingBottom: 10,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 0.92fr) 14px minmax(0, 1.08fr)',
            alignItems: 'center',
            borderBottom: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
            boxSizing: 'border-box'
          }}
        >
          <span
            style={{
              paddingLeft: 4,
              color: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
              fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
              lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box'
            }}
          >
            Privacy
          </span>

          <span aria-hidden="true" />

          <button
            type="button"
            style={{
              width: '100%',
              border: 0,
              borderRadius: 0,
              padding: 0,
              color: cleanPrivacyUrl
                ? NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis
                : NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
              background: 'transparent',
              boxShadow: 'none',
              fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
              lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
              fontWeight: cleanPrivacyUrl ? 700 : 400,
              textAlign: 'right',
              textDecoration: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: cleanPrivacyUrl ? 'pointer' : 'default',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
            disabled={!cleanPrivacyUrl}
            onClick={() => {
              if (cleanPrivacyUrl) onOpenPrivacy?.(cleanPrivacyUrl)
            }}
          >
            {cleanPrivacyUrl ? 'Open Privacy Policy' : 'Not available'}
          </button>
        </section>

        <button
          type="button"
          aria-label="Open Think It Done official website"
          style={{
            width: 'fit-content',
            justifySelf: 'center',
            border: 0,
            borderRadius: 0,
            padding: '6px 0 38px',
            color: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
            background: 'transparent',
            boxShadow: 'none',
            fontSize: 12,
            lineHeight: '16px',
            fontWeight: 500,
            textAlign: 'center',
            textDecoration: 'none',
            cursor: cleanPoweredByUrl ? 'pointer' : 'default',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation'
          }}
          disabled={!cleanPoweredByUrl}
          onClick={() => {
            if (cleanPoweredByUrl) onOpenPoweredBy?.(cleanPoweredByUrl)
          }}
        >
          Powered by{' '}
          <span
            style={{
              color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
              fontWeight: 650
            }}
          >
            Think It Done
          </span>
        </button>
      </div>
    </section>
  )
}

export function UniversalStoreLocationSection({
  address,
  hours,
  mapUrl,
  onOpenMap
}: {
  address?: string | null
  hours?: string | null
  mapUrl?: string | null
  onOpenMap?: (url: string) => void
}) {
  const cleanAddress = address?.trim() || ''
  const cleanHours = hours?.trim() || ''
  const cleanMapUrl = mapUrl?.trim() || ''

  return (
    <section className="ndjc-apk-store-section" style={apkStoreSectionStyle}>
      <StoreProfileSectionHeader title="Location & Hours" />

      {!cleanAddress && !cleanHours && !cleanMapUrl ? (
        <UniversalStoreEmptyInfoText />
      ) : (
        <>
          {cleanAddress || cleanMapUrl ? (
            <StoreProfileMapPreview
              address={cleanAddress}
              mapUrl={cleanMapUrl}
              onOpenMap={onOpenMap}
            />
          ) : null}

          {cleanHours ? (
            <section
              className="ndjc-store-profile-hours-row"
              style={{
                width: '100%',
                minHeight: 34,
                padding: '0',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 0.92fr) 14px minmax(0, 1.08fr)',
                alignItems: 'center',
                color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
                background: 'transparent',
                borderBottom: 0,
                boxSizing: 'border-box'
              }}
            >
              <span
                style={{
                  paddingLeft: 4,
                  color: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
                  fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
                  lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box'
                }}
              >
                Hours
              </span>

              <span aria-hidden="true" />

              <span
                style={{
                  color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
                  fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
                  lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: 'right'
                }}
              >
                {cleanHours}
              </span>
            </section>
          ) : null}
        </>
      )}
    </section>
  )
}

export function UniversalContactRow({
  label,
  value,
  onCopy,
  onClick
}: {
  label: string
  value?: string | null
  onCopy?: (label: string, value: string) => void
  onClick?: () => void
}) {
  const cleanValue = value?.trim() || ''
  const [copied, setCopied] = React.useState(false)
  const copiedTimerRef = React.useRef<number | null>(null)
  const canCopy = Boolean(onCopy && cleanValue)

  React.useEffect(() => {
    return () => {
      if (copiedTimerRef.current != null) {
        window.clearTimeout(copiedTimerRef.current)
      }
    }
  }, [])

  if (!cleanValue) return null

  function markCopied(): void {
    if (typeof window === 'undefined') return

    if (copiedTimerRef.current != null) {
      window.clearTimeout(copiedTimerRef.current)
    }

    setCopied(true)

    copiedTimerRef.current = window.setTimeout(() => {
      setCopied(false)
      copiedTimerRef.current = null
    }, 1200)
  }

  function handleCopy(): void {
    if (canCopy) {
      onCopy?.(label, cleanValue)
      markCopied()
      return
    }

    onClick?.()
  }

  return (
    <button
      type="button"
      className="ndjc-universal-contact-row"
      style={{
        width: '100%',
        minHeight: 40,
        border: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
        borderRadius: 14,
        padding: '8px 10px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 0.78fr) minmax(0, 1fr) auto',
        gap: 10,
        alignItems: 'center',
        color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
        background: NDJC_GLOBAL_UI_TOKENS.colors.surface,
        boxShadow: 'none',
        textAlign: 'left',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        cursor: canCopy || onClick ? 'pointer' : 'default'
      }}
      onClick={handleCopy}
      aria-label={canCopy ? `Copy ${label}` : label}
    >
      <span
        style={{
          color: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
          fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
          lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box'
        }}
      >
        {label}
      </span>

      <span
        style={{
          minWidth: 0,
          color: onClick
            ? NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis
            : NDJC_GLOBAL_UI_TOKENS.colors.textBody,
          fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontSize,
          lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.lineHeight,
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'right'
        }}
      >
        {cleanValue}
      </span>

      {canCopy ? (
        <span
          style={{
            minWidth: 48,
            borderRadius: 999,
            padding: '5px 9px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
            background: NDJC_GLOBAL_UI_TOKENS.colors.surfaceSoft,
            fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
            lineHeight: 1,
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </span>
      ) : null}
    </button>
  )
}

export function UniversalStoreExtraContactsSection({
  extraContacts,
  onCopyAccountValue
}: {
  extraContacts: Array<{ name: string; value: string }>
  onCopyAccountValue: (label: string, value: string) => void
}) {
  const cleanContacts = extraContacts
    .map(contact => ({
      name: String(contact.name || '').trim(),
      value: String(contact.value || '').trim()
    }))
    .filter(contact => contact.name.length > 0 && contact.value.length > 0)

  return (
    <section
      className="ndjc-apk-store-section"
      style={{
        ...apkStoreSectionStyle,
        marginTop: 4
      }}
    >
      <StoreProfileSectionHeader title="More" />

      {cleanContacts.length > 0 ? (
        <div
          className="ndjc-apk-store-contact-list"
          style={{
            width: '100%',
            display: 'grid',
            gap: 8,
            color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
            background: 'transparent',
            boxSizing: 'border-box'
          }}
        >
          {cleanContacts.map(contact => (
            <UniversalContactRow
              key={`${contact.name}-${contact.value}`}
              label={contact.name}
              value={contact.value}
              onCopy={onCopyAccountValue}
            />
          ))}
        </div>
      ) : (
        <UniversalStoreEmptyInfoText />
      )}
    </section>
  )
}

export function ProfileReadOnlyRow({ label, value }: { label: string; value?: string | null }) {
  const cleanValue = value?.trim() || '-'

  return (
    <section
      className="ndjc-profile-read-only-row"
      style={{
        width: '100%',
        minHeight: 34,
        paddingBottom: 10,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 0.92fr) 14px minmax(0, 1.08fr)',
        alignItems: 'center',
        borderBottom: `1px solid ${NDJC_GLOBAL_UI_TOKENS.colors.divider}`,
        boxSizing: 'border-box'
      }}
    >
      <span
        style={{
          paddingLeft: 4,
          color: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
          fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
          lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box'
        }}
      >
        {label}
      </span>

      <span aria-hidden="true" />

      <span
        style={{
          margin: 0,
          color: NDJC_GLOBAL_UI_TOKENS.colors.textBody,
          fontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
          lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'right'
        }}
      >
        {cleanValue}
      </span>
    </section>
  )
}

export function ProfileReadOnlyRowIfNotBlank({ label, value }: { label: string; value?: string | null }) {
  const cleanValue = value?.trim() || ''
  if (!cleanValue) return null
  return <ProfileReadOnlyRow label={label} value={cleanValue} />
}

export function StoreProfileHeaderBlock({
  title,
  subtitle
}: {
  title: string
  subtitle?: string | null
}) {
  return (
    <header
      className="ndjc-store-profile-header-block"
      style={{
        width: '100%',
        display: 'grid',
        gap: 6
      }}
    >
      <h1
        style={{
          margin: 0,
          color: APK_STORE_PROFILE_UI.black,
          fontSize: 24,
          lineHeight: 1.18,
          fontWeight: 600
        }}
      >
        {title}
      </h1>

      {subtitle ? (
        <p
          style={{
            margin: 0,
            color: APK_STORE_PROFILE_UI.ink2,
            fontSize: 14,
            lineHeight: 1.35,
            fontWeight: 400
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  )
}

export function StoreSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="ndjc-store-section-title" style={apkStoreSectionTitleStyle}>
      {children}
    </h3>
  )
}

export function StoreInfoLine({
  label,
  value,
  onClick
}: {
  label: string
  value: string
  onClick?: () => void
}) {
  const cleanValue = value.trim()
  if (!cleanValue) return null

  return (
    <button
      type="button"
      className="ndjc-store-info-line"
      style={{
        ...apkStoreInfoLineButtonStyle,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
      disabled={!onClick}
    >
      <span style={apkStoreLabelStyle}>{label}</span>
      <strong style={apkStoreValueStyle}>{cleanValue}</strong>
    </button>
  )
}
