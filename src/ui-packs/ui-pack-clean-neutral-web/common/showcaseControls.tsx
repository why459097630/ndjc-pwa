'use client'

import React from 'react'
import {
  APK_SHOWCASE_COLOR_TOKENS,
  NDJC_GLOBAL_UI_TOKENS,
  cx
} from './showcaseTokens'
import { NdjcSpinner } from './showcaseLayout'

export function sortLabel(value: string): string {
  if (value === 'PriceAsc') return 'Low–High'
  if (value === 'PriceDesc') return 'High–Low'
  return 'Default'
}

export const APK_FILTER_UI = {
  chipHeight: 26,
  chipRadius: 999,
  chipPaddingX: 12,
  chipPaddingY: 4,
  chipGap: 14,
  chipBorderWidth: 0,
  chipBorderColor: 'transparent',
  chipSelectedBg: 'rgba(0, 0, 0, 0.08)',
  chipUnselectedBg: 'transparent',
  chipTextColor: 'rgba(0, 0, 0, 0.44)',
  chipSelectedTextColor: '#111111',
  chipRemoveColor: 'rgba(0, 0, 0, 0.80)',
  chipPressedScale: 0.985,
  chipFontSize: 12,
  chipLineHeight: 1,
  chipTextWeight: 600,

  sortItemHeight: 26,
  sortItemRadius: 999,
  sortItemOuterPaddingX: 2,
  sortItemPaddingX: 12,
  sortItemPaddingY: 5,
  sortSelectedColor: '#111111',
  sortUnselectedColor: 'rgba(0, 0, 0, 0.44)',
  sortTextSize: 12,
  sortTextLineHeight: 1,
  sortTextWeight: 600,
  sortPressedScale: 0.985,

  rowEqualColumns: 4,
  rowHorizontalPadding: 0,
  activeRowPaddingY: 0,

  sheetBackdropColor: 'rgba(0, 0, 0, 0.32)',
  sheetMaxHeight: '86dvh',
  sheetRadius: '24px 24px 0 0',
  sheetDragHandleWrapHeight: 24,
  sheetDragHandleWidth: 36,
  sheetDragHandleHeight: 4,
  sheetDragHandleRadius: 999,
  sheetDragHandleColor: 'rgba(0, 0, 0, 0.18)',
  sheetDragDismissThreshold: 72,
  sheetHeaderPaddingX: NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX,
  sheetHeaderPaddingTop: NDJC_GLOBAL_UI_TOKENS.admin.spacer8,
  sheetHeaderPaddingBottom: NDJC_GLOBAL_UI_TOKENS.admin.spacer8,
  sheetTitleSize: NDJC_GLOBAL_UI_TOKENS.typography.titleMedium.fontSize,
  sheetTitleLineHeight: NDJC_GLOBAL_UI_TOKENS.typography.titleMedium.lineHeight,
  sheetTitleWeight: 700,
  sheetSubtitleSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
  sheetSubtitleLineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
  sheetSubtitleWeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontWeight,
  sheetDividerColor: 'transparent',
  sheetContentPaddingX: NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX,
  sheetContentPaddingTop: NDJC_GLOBAL_UI_TOKENS.rhythm.fieldToHelper,
  sheetContentPaddingBottom: NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingBottom,
  sheetActionPaddingX: NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX,
  sheetActionPaddingBottom: NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingBottom,

  pagePaddingX: 16,
  expandedCategoryGap: 8,
  moreChipRadius: 24,
  appointmentFilterLabelWidth: 48,
  appointmentFilterGap: 6
} as const

export const apkFilterLazyRowStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  gap: APK_FILTER_UI.chipGap,
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'none',
  WebkitOverflowScrolling: 'touch',
  boxSizing: 'border-box'
}

export const apkFilterChipBaseStyle: React.CSSProperties = {
  minHeight: APK_FILTER_UI.chipHeight,
  border: `${APK_FILTER_UI.chipBorderWidth}px solid ${APK_FILTER_UI.chipBorderColor}`,
  borderRadius: APK_FILTER_UI.chipRadius,
  padding: `${APK_FILTER_UI.chipPaddingY}px ${APK_FILTER_UI.chipPaddingX}px`,
  display: 'inline-flex',
  flex: '0 0 auto',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  boxShadow: 'none',
  fontSize: APK_FILTER_UI.chipFontSize,
  lineHeight: APK_FILTER_UI.chipLineHeight,
  fontWeight: APK_FILTER_UI.chipTextWeight,
  whiteSpace: 'nowrap',
  transform: 'scale(1)',
  transition: 'transform 120ms ease, background 120ms ease, color 120ms ease, border-color 120ms ease',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation'
}

export function apkFilterChipStyle(selected?: boolean): React.CSSProperties {
  return {
    ...apkFilterChipBaseStyle,
    borderColor: selected ? 'transparent' : APK_FILTER_UI.chipBorderColor,
    color: selected ? APK_FILTER_UI.chipSelectedTextColor : APK_FILTER_UI.chipTextColor,
    background: selected ? APK_FILTER_UI.chipSelectedBg : APK_FILTER_UI.chipUnselectedBg
  }
}

export function apkSortNavOuterItemStyle(): React.CSSProperties {
  return {
    minWidth: 0,
    padding: `0 ${APK_FILTER_UI.sortItemOuterPaddingX}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export function apkSortNavItemStyle(selected: boolean, pressed = false): React.CSSProperties {
  return {
    width: 'auto',
    minWidth: 0,
    minHeight: APK_FILTER_UI.sortItemHeight,
    border: 0,
    borderRadius: APK_FILTER_UI.sortItemRadius,
    padding: `${APK_FILTER_UI.sortItemPaddingY}px ${APK_FILTER_UI.sortItemPaddingX}px`,
    display: 'inline-grid',
    placeItems: 'center',
    color: selected ? APK_FILTER_UI.sortSelectedColor : APK_FILTER_UI.sortUnselectedColor,
    background: selected ? APK_FILTER_UI.chipSelectedBg : 'transparent',
    boxShadow: 'none',
    fontSize: APK_FILTER_UI.sortTextSize,
    lineHeight: APK_FILTER_UI.sortTextLineHeight,
    fontWeight: selected ? 700 : APK_FILTER_UI.sortTextWeight,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transform: pressed ? `scale(${APK_FILTER_UI.sortPressedScale})` : 'scale(1)',
    transition: 'transform 120ms ease, color 120ms ease, background 120ms ease',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  }
}

export const apkSortNavTextStyle: React.CSSProperties = {
  maxWidth: '100%',
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

export const apkSmallActiveChipTextStyle: React.CSSProperties = {
  maxWidth: 140,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

export const apkSheetBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000001,
  display: 'grid',
  alignItems: 'end',
  justifyItems: 'center',
  background: APK_FILTER_UI.sheetBackdropColor,
  boxSizing: 'border-box',
  overflow: 'hidden'
}

export const apkSheetSurfaceStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '480px',
  maxHeight: APK_FILTER_UI.sheetMaxHeight,
  borderRadius: APK_FILTER_UI.sheetRadius,
  padding: 0,
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr)',
  gap: 0,
  overflow: 'hidden',
  background: NDJC_GLOBAL_UI_TOKENS.colors.surface,
  boxShadow: 'none',
  boxSizing: 'border-box'
}

export const apkSheetHeaderRootStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: 0
}

export const apkSheetHeaderRowStyle: React.CSSProperties = {
  width: '100%',
  padding: `${APK_FILTER_UI.sheetHeaderPaddingTop}px ${APK_FILTER_UI.sheetHeaderPaddingX}px ${APK_FILTER_UI.sheetHeaderPaddingBottom}px`,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: 12,
  boxSizing: 'border-box'
}

export const apkSheetHeaderCopyStyle: React.CSSProperties = {
  minWidth: 0,
  flex: '1 1 auto'
}

export const apkSheetHeaderTitleStyle: React.CSSProperties = {
  margin: 0,
  color: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
  fontSize: APK_FILTER_UI.sheetTitleSize,
  lineHeight: APK_FILTER_UI.sheetTitleLineHeight,
  fontWeight: APK_FILTER_UI.sheetTitleWeight,
  letterSpacing: '-0.2px'
}

export const apkSheetHeaderSubtitleStyle: React.CSSProperties = {
  margin: '2px 0 0',
  color: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
  fontSize: APK_FILTER_UI.sheetSubtitleSize,
  lineHeight: APK_FILTER_UI.sheetSubtitleLineHeight,
  fontWeight: APK_FILTER_UI.sheetSubtitleWeight
}

export const apkSheetDividerStyle: React.CSSProperties = {
  width: `calc(100% - ${APK_FILTER_UI.sheetHeaderPaddingX * 2}px)`,
  height: 1,
  margin: `0 ${APK_FILTER_UI.sheetHeaderPaddingX}px`,
  background: APK_FILTER_UI.sheetDividerColor
}

export const apkSheetCloseButtonStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  border: 0,
  borderRadius: APK_FILTER_UI.chipRadius,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  color: '#000000',
  background: 'transparent',
  boxShadow: 'none',
  fontSize: 22,
  lineHeight: 1,
  fontWeight: 500
}

export const apkSheetContentStyle: React.CSSProperties = {
  minHeight: 0,
  padding: `${APK_FILTER_UI.sheetContentPaddingTop}px ${APK_FILTER_UI.sheetContentPaddingX}px calc(${APK_FILTER_UI.sheetContentPaddingBottom}px + env(safe-area-inset-bottom))`,
  display: 'grid',
  gap: NDJC_GLOBAL_UI_TOKENS.rhythm.fieldToField,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  boxSizing: 'border-box'
}

export const apkSheetDragHandleWrapStyle: React.CSSProperties = {
  width: '100%',
  height: APK_FILTER_UI.sheetDragHandleWrapHeight,
  display: 'grid',
  placeItems: 'center',
  touchAction: 'none',
  cursor: 'grab'
}

export const apkSheetDragHandleStyle: React.CSSProperties = {
  width: APK_FILTER_UI.sheetDragHandleWidth,
  height: APK_FILTER_UI.sheetDragHandleHeight,
  borderRadius: APK_FILTER_UI.sheetDragHandleRadius,
  background: APK_FILTER_UI.sheetDragHandleColor
}

export const apkSheetFooterStyle: React.CSSProperties = {
  width: '100%',
  padding: `0 ${APK_FILTER_UI.sheetActionPaddingX}px calc(${APK_FILTER_UI.sheetActionPaddingBottom}px + env(safe-area-inset-bottom))`,
  display: 'grid',
  gap: 10,
  boxSizing: 'border-box'
}

export const apkVisuallyHiddenStyle: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  clipPath: 'inset(50%)'
}

export const APK_EDIT_ITEM_UI = {
  topContentPadding: NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop,
  screenPadding: NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingX,
  bottomContentPadding: NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingBottom,
  sectionTop: NDJC_GLOBAL_UI_TOKENS.rhythm.sectionToSection,
  titleToHint: NDJC_GLOBAL_UI_TOKENS.spacing.xs,
  hintToContent: NDJC_GLOBAL_UI_TOKENS.rhythm.sectionTitleToContent,
  fieldGap: NDJC_GLOBAL_UI_TOKENS.rhythm.fieldToField,
  sectionBottom: NDJC_GLOBAL_UI_TOKENS.rhythm.titleToFirstSection,
  spacer8: NDJC_GLOBAL_UI_TOKENS.spacing.sm,
  chipGap: NDJC_GLOBAL_UI_TOKENS.spacing.sm,
  mediaGridTop: NDJC_GLOBAL_UI_TOKENS.rhythm.mediaTop,
  labelGap: NDJC_GLOBAL_UI_TOKENS.spacing.xs,
  smallGap: NDJC_GLOBAL_UI_TOKENS.spacing.xxs,
  midGap: NDJC_GLOBAL_UI_TOKENS.rhythm.helperToNextField,
  saveHintTop: NDJC_GLOBAL_UI_TOKENS.rhythm.bottomActionTop,
  saveButtonTop: NDJC_GLOBAL_UI_TOKENS.spacing.md,

  titleFontSize: 30,
  titleLineHeight: 1.08,
  titleFontWeight: 760,
  titleLetterSpacing: '-0.85px',

  sectionTitleFontSize: 16,
  sectionTitleLineHeight: 1.3,
  sectionTitleFontWeight: 700,

  labelFontSize: 12,
  labelLineHeight: 1.25,
  labelFontWeight: 650,

  bodySmallFontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
  bodySmallLineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
  bodySmallFontWeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontWeight,

  bodyMediumFontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontSize,
  bodyMediumLineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.lineHeight,
  bodyMediumFontWeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontWeight,

  sectionCardRadius: NDJC_GLOBAL_UI_TOKENS.components.card.radius,
  sectionCardPaddingTop: 18,
  sectionCardPaddingX: 18,
  sectionCardPaddingBottom: 18,
  sectionCardGap: NDJC_GLOBAL_UI_TOKENS.rhythm.sectionTitleToContent,

  fieldMinHeight: 48,
  fieldRadius: NDJC_GLOBAL_UI_TOKENS.components.input.radius,
  fieldPaddingX: 14,
  fieldPaddingY: 11,
  fieldBorderWidth: 1,
  fieldBorderColor: 'rgba(15, 23, 42, 0.06)',
  fieldFocusBorderColor: 'rgba(15, 23, 42, 0.22)',
  fieldErrorBorderColor: `rgba(${NDJC_GLOBAL_UI_TOKENS.colors.brandStrongRgb}, 0.72)`,
  fieldFocusShadow: '0 0 0 3px rgba(15, 23, 42, 0.045)',
  fieldErrorShadow: `0 0 0 3px rgba(${NDJC_GLOBAL_UI_TOKENS.colors.brandStrongRgb}, 0.08)`,
  fieldBackground: 'rgba(255, 255, 255, 0.72)',
  fieldFocusedBackground: 'rgba(255, 255, 255, 0.88)',
  fieldPlaceholderColor: 'rgba(71, 84, 103, 0.68)',
  fieldPlaceholderOpacity: 1,
  fieldPlaceholderFontWeight: 500,

  submitButtonHeight: 52,
  submitButtonTopGap: 22,
  submitButtonBottomGap: 18,
  submitButtonRadius: 18,
  submitButtonFontSize: 15,
  submitButtonFontWeight: 800,
  submitButtonLineHeight: 20,
  submitButtonShadow: '0 12px 24px rgba(180, 35, 42, 0.18)',
  submitButtonPressedShadow: '0 8px 18px rgba(180, 35, 42, 0.14)',
  submitButtonDisabledBg: 'rgba(15, 23, 42, 0.08)',
  submitButtonDisabledText: 'rgba(15, 23, 42, 0.32)',

  black: NDJC_GLOBAL_UI_TOKENS.colors.textPrimary,
  sectionLabelColor: NDJC_GLOBAL_UI_TOKENS.colors.textStrong,
  body70: NDJC_GLOBAL_UI_TOKENS.colors.textSecondary,
  body55: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
  error80: NDJC_GLOBAL_UI_TOKENS.colors.danger
} as const

export function NdjcPrimaryActionButton({
  children,
  onClick,
  disabled,
  isLoading = false,
  type = 'button',
  className
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
  type?: 'button' | 'submit'
  className?: string
}) {
  const blocked = Boolean(disabled || isLoading)
  const [pressed, setPressed] = React.useState(false)
  const enabled = !blocked
  const isPressed = Boolean(pressed && enabled)

  function releasePressState(): void {
    setPressed(false)
  }

  return (
    <button
      type={type}
      className={cx('ndjc-primary-action-button', className)}
      disabled={blocked}
      aria-busy={isLoading || undefined}
      onPointerDown={() => {
        if (blocked) return
        setPressed(true)
      }}
      onPointerUp={releasePressState}
      onPointerCancel={releasePressState}
      onPointerLeave={releasePressState}
      onBlur={releasePressState}
      onClick={() => {
        if (blocked) return
        onClick?.()
      }}
      style={{
        width: '100%',
        minHeight: APK_EDIT_ITEM_UI.submitButtonHeight,
        border: 0,
        borderRadius: APK_EDIT_ITEM_UI.submitButtonRadius,
        padding: '0 18px',
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        color: enabled ? '#FFFFFF' : APK_EDIT_ITEM_UI.submitButtonDisabledText,
        background: enabled
          ? isPressed
            ? NDJC_GLOBAL_UI_TOKENS.colors.brandStrongPressed
            : NDJC_GLOBAL_UI_TOKENS.colors.brandStrong
          : APK_EDIT_ITEM_UI.submitButtonDisabledBg,
        boxShadow: enabled
          ? isPressed
            ? APK_EDIT_ITEM_UI.submitButtonPressedShadow
            : APK_EDIT_ITEM_UI.submitButtonShadow
          : 'none',
        fontSize: APK_EDIT_ITEM_UI.submitButtonFontSize,
        lineHeight: `${APK_EDIT_ITEM_UI.submitButtonLineHeight}px`,
        fontWeight: APK_EDIT_ITEM_UI.submitButtonFontWeight,
        letterSpacing: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        outline: 'none',
        appearance: 'none',
        WebkitAppearance: 'none',
        transform: isPressed
          ? `scale(${NDJC_GLOBAL_UI_TOKENS.motion.pressScale})`
          : 'scale(1)',
        transformOrigin: 'center center',
        transition: `transform ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, box-shadow ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, background ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, color ${NDJC_GLOBAL_UI_TOKENS.motion.fast}`,
        opacity: isLoading ? 0.9 : 1,
        cursor: enabled ? 'pointer' : 'not-allowed',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
        touchAction: 'manipulation'
      }}
    >
      {isLoading ? (
        <>
          <NdjcSpinner
            className="ndjc-primary-action-spinner"
            size={18}
            stroke={2}
            tone="light"
          />
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: APK_EDIT_ITEM_UI.submitButtonLineHeight,
              lineHeight: `${APK_EDIT_ITEM_UI.submitButtonLineHeight}px`
            }}
          >
            Saving...
          </span>
        </>
      ) : (
        <span
          style={{
            minWidth: 0,
            minHeight: APK_EDIT_ITEM_UI.submitButtonLineHeight,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: `${APK_EDIT_ITEM_UI.submitButtonLineHeight}px`
          }}
        >
          {children}
        </span>
      )}
    </button>
  )
}

