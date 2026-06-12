'use client'

import React from 'react'
import { APK_SHOWCASE_COLOR_TOKENS } from './showcaseTokens'

export const APK_APPOINTMENT_UI = {
  black: '#000000',
  white: '#ffffff',
  brand: APK_SHOWCASE_COLOR_TOKENS.accent,
  green: APK_SHOWCASE_COLOR_TOKENS.primary,
  surface: '#ffffff',
  softSurface: '#f7f7fb',
  warningSurface: '#fff4e5',
  warningText: '#7a4e00',
  disabledSurface: '#f2f4f7',
  disabledBorder: '#d0d5dd',
  disabledText: '#667085',
  secondaryText: '#475467',
  border10: 'rgba(0, 0, 0, 0.10)',
  black55: 'rgba(0, 0, 0, 0.72)',
  black65: 'rgba(0, 0, 0, 0.78)',
  black75: 'rgba(0, 0, 0, 0.82)',
  black90: 'rgba(0, 0, 0, 0.90)',

  sectionGap: 10,
  rowGap: 8,
  flowGap: 8,

  timeSettingRadius: 14,
  timeSettingPaddingX: 12,
  timeSettingPaddingY: 10,

  datePillMinWidth: 72,
  datePillRadius: 18,
  datePillPaddingX: 12,
  datePillPaddingY: 8,
  datePillGap: 2,

  detailLineGap: 3,
  detailTitleTopPadding: 4,

  calendarWeekGap: 6,
  calendarMonthGap: 8,
  calendarDayHeight: 34,

  bottomSheetSpacerTop: 8,
  bottomSheetContentPaddingX: 16,
  bottomSheetContentPaddingTop: 14,
  bottomSheetContentPaddingBottom: 24,
  bottomSheetMaxHeight: '86dvh',
  bottomSheetRadius: '28px 28px 0 0',

  productWarningRadius: 14,
  productWarningPaddingX: 12,
  productWarningPaddingY: 10,

  cardStatusGap: 4,

  filterLabelWidth: 48,

  submitGap: 8,
  submitInfoRadius: 14,
  submitInfoPaddingX: 12,
  submitInfoPaddingY: 10,

  labelSmallSize: 12,
  labelSmallLineHeight: 1.2,
  labelSmallWeight: 600,

  labelMediumSize: 13,
  labelMediumLineHeight: 1.2,
  labelMediumWeight: 600,

  bodySmallSize: 13,
  bodySmallLineHeight: 1.35,
  bodySmallWeight: 400,

  bodyMediumSize: 14,
  bodyMediumLineHeight: 1.4,
  bodyMediumWeight: 400,

  titleSmallSize: 16,
  titleSmallLineHeight: 1.25,
  titleSmallWeight: 600
} as const
export const apkAppointmentColumnStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: APK_APPOINTMENT_UI.sectionGap
}

export const apkAppointmentDetailLineStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: APK_APPOINTMENT_UI.detailLineGap
}

export const apkAppointmentDetailLabelStyle: React.CSSProperties = {
  margin: 0,
  color: APK_APPOINTMENT_UI.black55,
  fontSize: APK_APPOINTMENT_UI.labelSmallSize,
  lineHeight: APK_APPOINTMENT_UI.labelSmallLineHeight,
  fontWeight: APK_APPOINTMENT_UI.labelSmallWeight
}

export const apkAppointmentDetailValueStyle: React.CSSProperties = {
  margin: 0,
  color: APK_APPOINTMENT_UI.black,
  fontSize: APK_APPOINTMENT_UI.bodyMediumSize,
  lineHeight: APK_APPOINTMENT_UI.bodyMediumLineHeight,
  fontWeight: APK_APPOINTMENT_UI.bodyMediumWeight,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
  overflowWrap: 'anywhere'
}

export function apkAppointmentDatePillStyle(selected: boolean, enabled: boolean): React.CSSProperties {
  return {
    minWidth: APK_APPOINTMENT_UI.datePillMinWidth,
    border: `1px solid ${
      selected
        ? APK_APPOINTMENT_UI.brand
        : enabled
          ? APK_APPOINTMENT_UI.border10
          : APK_APPOINTMENT_UI.disabledBorder
    }`,
    borderRadius: APK_APPOINTMENT_UI.datePillRadius,
    padding: `${APK_APPOINTMENT_UI.datePillPaddingY}px ${APK_APPOINTMENT_UI.datePillPaddingX}px`,
    display: 'grid',
    justifyItems: 'center',
    gap: APK_APPOINTMENT_UI.datePillGap,
    color: selected ? APK_APPOINTMENT_UI.white : enabled ? APK_APPOINTMENT_UI.black : APK_APPOINTMENT_UI.disabledText,
    background: selected ? APK_APPOINTMENT_UI.brand : enabled ? APK_APPOINTMENT_UI.white : APK_APPOINTMENT_UI.disabledSurface,
    boxShadow: 'none',
    cursor: enabled ? 'pointer' : 'not-allowed'
  }
}

export const apkAppointmentFlowRowStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: APK_APPOINTMENT_UI.flowGap
}

export const apkAppointmentSectionTitleStyle: React.CSSProperties = {
  margin: 0,
  paddingTop: APK_APPOINTMENT_UI.detailTitleTopPadding,
  color: APK_APPOINTMENT_UI.black,
  fontSize: APK_APPOINTMENT_UI.titleSmallSize,
  lineHeight: APK_APPOINTMENT_UI.titleSmallLineHeight,
  fontWeight: APK_APPOINTMENT_UI.titleSmallWeight
}

export const apkAppointmentSheetSurfaceStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '480px',
  maxHeight: APK_APPOINTMENT_UI.bottomSheetMaxHeight,
  borderRadius: APK_APPOINTMENT_UI.bottomSheetRadius,
  padding: 0,
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr)',
  overflow: 'hidden',
  background: APK_APPOINTMENT_UI.white,
  boxSizing: 'border-box'
}

export const apkAppointmentSheetContentStyle: React.CSSProperties = {
  minHeight: 0,
  padding: `${APK_APPOINTMENT_UI.bottomSheetContentPaddingTop}px ${APK_APPOINTMENT_UI.bottomSheetContentPaddingX}px calc(${APK_APPOINTMENT_UI.bottomSheetContentPaddingBottom}px + env(safe-area-inset-bottom))`,
  display: 'grid',
  gap: APK_APPOINTMENT_UI.sectionGap,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch'
}

export const apkAppointmentCalendarGridStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: APK_APPOINTMENT_UI.calendarWeekGap
}

export const apkAppointmentSubmitInfoBoxStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: APK_APPOINTMENT_UI.submitInfoRadius,
  padding: `${APK_APPOINTMENT_UI.submitInfoPaddingY}px ${APK_APPOINTMENT_UI.submitInfoPaddingX}px`,
  display: 'grid',
  gap: APK_APPOINTMENT_UI.detailLineGap,
  background: APK_APPOINTMENT_UI.softSurface
}

export const apkAppointmentWarningBoxStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: APK_APPOINTMENT_UI.productWarningRadius,
  padding: `${APK_APPOINTMENT_UI.productWarningPaddingY}px ${APK_APPOINTMENT_UI.productWarningPaddingX}px`,
  color: APK_APPOINTMENT_UI.warningText,
  background: APK_APPOINTMENT_UI.warningSurface
}

export function appointmentDetailTimeText(preferredDate?: string | null, preferredTime?: string | null): string {
  const rawDate = preferredDate?.trim() || ''
  const rawTime = preferredTime?.trim() || ''
  const parts = rawDate.split('-')
  let displayDate = rawDate

  if (parts.length === 3) {
    const monthIndex = Number(parts[1])
    const day = Number(parts[2])
    const monthName = [
      '',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ][monthIndex]

    if (monthName && Number.isFinite(day)) {
      displayDate = `${monthName} ${day}`
    }
  }

  if (displayDate && rawTime) return `${displayDate}, ${rawTime}`
  if (displayDate) return displayDate
  if (rawTime) return rawTime
  return 'Not selected'
}

export function appointmentListTimeText(preferredDate?: string | null, preferredTime?: string | null): string {
  const value = appointmentDetailTimeText(preferredDate, preferredTime)
  return value === 'Not selected' ? 'Time · Not selected' : `Time · ${value}`
}
