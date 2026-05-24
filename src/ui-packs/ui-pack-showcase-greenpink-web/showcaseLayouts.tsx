'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import type { ShowcasePwaInstallState } from './ShowcaseUiRenderer'
import type {
  ShowcaseNotificationMessageCode,
  ShowcaseNotificationPermissionState,
  ShowcaseNotificationRegistrationState
} from '@/features/feature-showcase-web/showcasePushRegistrationService'
import type {
  ShowcaseAdminActions,
  ShowcaseAdminAppointmentsActions,
  ShowcaseAdminAppointmentsUiState,
  ShowcaseAdminUiState,
  ShowcaseAnnouncementCard,
  ShowcaseAnnouncementEditActions,
  ShowcaseAnnouncementEditUiState,
  ShowcaseAnnouncementsActions,
  ShowcaseAnnouncementsUiState,
  ShowcaseAppointmentCard,
  ShowcaseAppointmentsActions,
  ShowcaseAppointmentsUiState,
  ShowcaseChangePasswordActions,
  ShowcaseChangePasswordUiState,
  ShowcaseChatActions,
  ShowcaseChatAppointmentShare,
  ShowcaseChatMediaActions,
  ShowcaseChatMessage,
  ShowcaseChatProductShare,
  ShowcaseChatThreadSummaryUi,
  ShowcaseChatUiState,
  ShowcaseCustomerBookingsActions,
  ShowcaseCustomerBookingsUiState,
  ShowcaseDetailActions,
  ShowcaseDetailUiState,
  ShowcaseEditDishActions,
  ShowcaseEditDishUiState,
  ShowcaseFavoriteCard,
  ShowcaseFavoritesActions,
  ShowcaseFavoritesUiState,
  ShowcaseHomeActions,
  ShowcaseHomeDish,
  ShowcaseHomeUiState,
  ShowcaseLoginActions,
  ShowcaseLoginUiState,
  ShowcaseMerchantChatListActions,
  ShowcasePaginationUiState,
  ShowcaseStoreProfileActions,
  ShowcaseStoreProfileUiState
} from '@/features/feature-showcase-web/showcaseUiContract'
import type { DemoDish } from '@/features/feature-showcase-web/showcaseModels'
import { getDishPrice, getDishTitle } from '@/features/feature-showcase-web/showcaseModels'
import {
  selectAnnouncementCoverUrl,
  selectChatImageUrls,
  selectDishImageUrl,
  selectShowcaseImageBlurDataUrl,
  selectShowcaseImageVariantList,
  selectStoreCoverUrl,
  selectStoreLogoUrl
} from '@/features/feature-showcase-web/showcaseImageVariants'

type BackHomeActions = {
  onBack?: () => void
  onBackToHome?: () => void
}

type BottomActions = {
  onOpenStoreProfileView: () => void
  onOpenChat: () => void
  onOpenCustomerBookings: () => void
  onOpenAnnouncements: () => void
  onOpenFavorites: () => void
}
type ShowcaseBottomBarTab =
  | 'Store'
  | 'Chat'
  | 'Appointments'
  | 'Favorites'
  | 'Announcements'

const NDJC_BOTTOM_BAR_HEIGHT_CSS_VAR = '--ndjc-bottom-bar-height'
const NDJC_BOTTOM_BAR_RESERVE_CSS_VAR = '--ndjc-bottom-bar-reserve'

const NdjcBottomBarHostContext = React.createContext<React.ReactNode>(null)

function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

function dishImage(dish: DemoDish | null | undefined): string | null {
  return selectDishImageUrl(dish, 'detail')
}

function priceText(value: number): string {
  if (!Number.isFinite(value)) return '$0'
  return `$${value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}`
}

function sortLabel(value: string): string {
  if (value === 'PriceAsc') return 'Low–High'
  if (value === 'PriceDesc') return 'High–Low'
  return 'Default'
}

const APK_FILTER_UI = {
  chipHeight: 32,
  chipRadius: 999,
  chipPaddingX: 12,
  chipPaddingY: 6,
  chipGap: 6,
  chipBorderWidth: 1.5,
  chipBorderColor: 'rgba(0, 0, 0, 0.10)',
  chipSelectedBg: '#fe9595',
  chipUnselectedBg: 'rgba(255, 255, 255, 0.72)',
  chipTextColor: '#000000',
  chipSelectedTextColor: '#ffffff',
  chipRemoveColor: 'rgba(0, 0, 0, 0.80)',
  chipPressedScale: 0.92,
  chipFontSize: 14,
  chipLineHeight: 1,
  chipTextWeight: 500,

  sortItemHeight: 40,
  sortItemRadius: 10,
  sortItemOuterPaddingX: 4,
  sortItemPaddingX: 0,
  sortItemPaddingY: 10,
  sortSelectedColor: '#fe9595',
  sortUnselectedColor: 'rgba(0, 0, 0, 0.60)',
  sortTextSize: 14,
  sortTextLineHeight: 1.2,
  sortTextWeight: 500,
  sortPressedScale: 0.965,

  rowEqualColumns: 4,
  rowHorizontalPadding: 0,
  activeRowPaddingY: 4,

  sheetBackdropColor: 'rgba(0, 0, 0, 0.32)',
  sheetMaxHeight: '86dvh',
  sheetRadius: '28px 28px 0 0',
  sheetDragHandleWrapHeight: 18,
  sheetDragHandleWidth: 36,
  sheetDragHandleHeight: 4,
  sheetDragHandleRadius: 999,
  sheetDragHandleColor: 'rgba(0, 0, 0, 0.18)',
  sheetDragDismissThreshold: 72,
  sheetHeaderPaddingX: 16,
  sheetHeaderPaddingTop: 6,
  sheetHeaderPaddingBottom: 10,
  sheetTitleSize: 16,
  sheetTitleLineHeight: 1.25,
  sheetTitleWeight: 600,
  sheetSubtitleSize: 12,
  sheetSubtitleLineHeight: 1.25,
  sheetSubtitleWeight: 500,
  sheetDividerColor: 'rgba(0, 0, 0, 0.10)',
  sheetContentPaddingX: 16,
  sheetContentPaddingTop: 14,
  sheetContentPaddingBottom: 24,
  sheetActionPaddingX: 16,
  sheetActionPaddingBottom: 24,

  pagePaddingX: 16,
  expandedCategoryGap: 8,
  moreChipRadius: 24,
  appointmentFilterLabelWidth: 48,
  appointmentFilterGap: 6
} as const

const apkFilterLazyRowStyle: React.CSSProperties = {
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

const apkFilterChipBaseStyle: React.CSSProperties = {
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

function apkFilterChipStyle(selected?: boolean): React.CSSProperties {
  return {
    ...apkFilterChipBaseStyle,
    borderColor: selected ? 'transparent' : APK_FILTER_UI.chipBorderColor,
    color: selected ? APK_FILTER_UI.chipSelectedTextColor : APK_FILTER_UI.chipTextColor,
    background: selected ? APK_FILTER_UI.chipSelectedBg : APK_FILTER_UI.chipUnselectedBg
  }
}

function apkSortNavOuterItemStyle(): React.CSSProperties {
  return {
    minWidth: 0,
    padding: `0 ${APK_FILTER_UI.sortItemOuterPaddingX}px`,
    display: 'block'
  }
}

function apkSortNavItemStyle(selected: boolean, pressed = false): React.CSSProperties {
  return {
    width: '100%',
    minWidth: 0,
    minHeight: APK_FILTER_UI.sortItemHeight,
    border: 0,
    borderRadius: APK_FILTER_UI.sortItemRadius,
    padding: `${APK_FILTER_UI.sortItemPaddingY}px ${APK_FILTER_UI.sortItemPaddingX}px`,
    display: 'grid',
    placeItems: 'center',
    color: selected ? APK_FILTER_UI.sortSelectedColor : APK_FILTER_UI.sortUnselectedColor,
    background: 'transparent',
    boxShadow: 'none',
    fontSize: APK_FILTER_UI.sortTextSize,
    lineHeight: APK_FILTER_UI.sortTextLineHeight,
    fontWeight: APK_FILTER_UI.sortTextWeight,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transform: pressed ? `scale(${APK_FILTER_UI.sortPressedScale})` : 'scale(1)',
    transition: 'transform 120ms ease, color 120ms ease',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  }
}

const apkSortNavTextStyle: React.CSSProperties = {
  maxWidth: '100%',
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

const apkSmallActiveChipTextStyle: React.CSSProperties = {
  maxWidth: 140,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

const apkSheetBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 210,
  display: 'grid',
  alignItems: 'end',
  justifyItems: 'center',
  background: APK_FILTER_UI.sheetBackdropColor,
  boxSizing: 'border-box',
  overflow: 'hidden'
}

const apkSheetSurfaceStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '480px',
  maxHeight: APK_FILTER_UI.sheetMaxHeight,
  borderRadius: APK_FILTER_UI.sheetRadius,
  padding: 0,
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr) auto',
  gap: 0,
  overflow: 'hidden',
  background: 'rgba(255, 255, 255, 0.98)',
  boxShadow: 'none',
  boxSizing: 'border-box'
}

const apkSheetHeaderRootStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: 0
}

const apkSheetHeaderRowStyle: React.CSSProperties = {
  width: '100%',
  padding: `${APK_FILTER_UI.sheetHeaderPaddingTop}px ${APK_FILTER_UI.sheetHeaderPaddingX}px ${APK_FILTER_UI.sheetHeaderPaddingBottom}px`,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: 12,
  boxSizing: 'border-box'
}

const apkSheetHeaderCopyStyle: React.CSSProperties = {
  minWidth: 0,
  flex: '1 1 auto'
}

const apkSheetHeaderTitleStyle: React.CSSProperties = {
  margin: 0,
  color: '#111827',
  fontSize: APK_FILTER_UI.sheetTitleSize,
  lineHeight: APK_FILTER_UI.sheetTitleLineHeight,
  fontWeight: APK_FILTER_UI.sheetTitleWeight
}

const apkSheetHeaderSubtitleStyle: React.CSSProperties = {
  margin: '2px 0 0',
  color: '#6b7280',
  fontSize: APK_FILTER_UI.sheetSubtitleSize,
  lineHeight: APK_FILTER_UI.sheetSubtitleLineHeight,
  fontWeight: APK_FILTER_UI.sheetSubtitleWeight
}

const apkSheetDividerStyle: React.CSSProperties = {
  width: `calc(100% - ${APK_FILTER_UI.sheetHeaderPaddingX * 2}px)`,
  height: 1,
  margin: `0 ${APK_FILTER_UI.sheetHeaderPaddingX}px`,
  background: APK_FILTER_UI.sheetDividerColor
}

const apkSheetCloseButtonStyle: React.CSSProperties = {
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

const apkSheetContentStyle: React.CSSProperties = {
  minHeight: 0,
  padding: `${APK_FILTER_UI.sheetContentPaddingTop}px ${APK_FILTER_UI.sheetContentPaddingX}px ${APK_FILTER_UI.sheetContentPaddingBottom}px`,
  display: 'grid',
  gap: 10,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  boxSizing: 'border-box'
}

const apkSheetDragHandleWrapStyle: React.CSSProperties = {
  width: '100%',
  height: APK_FILTER_UI.sheetDragHandleWrapHeight,
  display: 'grid',
  placeItems: 'center',
  touchAction: 'none',
  cursor: 'grab'
}

const apkSheetDragHandleStyle: React.CSSProperties = {
  width: APK_FILTER_UI.sheetDragHandleWidth,
  height: APK_FILTER_UI.sheetDragHandleHeight,
  borderRadius: APK_FILTER_UI.sheetDragHandleRadius,
  background: APK_FILTER_UI.sheetDragHandleColor
}

const apkSheetFooterStyle: React.CSSProperties = {
  width: '100%',
  padding: `0 ${APK_FILTER_UI.sheetActionPaddingX}px calc(${APK_FILTER_UI.sheetActionPaddingBottom}px + env(safe-area-inset-bottom))`,
  display: 'grid',
  gap: 10,
  boxSizing: 'border-box'
}

const apkVisuallyHiddenStyle: React.CSSProperties = {
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

const APK_MEDIA_UI = {
  imageRadius: 16,
  imageEditRadius: 18,
  imageEditSize: 96,
  imageGridColumns: 3,
  imageGridGap: 10,
  imageRemoveSize: 22,
  imageRemovePadding: 6,
  imageRemoveIconSize: 14,
  uploadIconSize: 28,
  uploadBg: '#fe9595',
  imageTileBg: '#f1f1f1',
  imagePlaceholderBg: '#f1f1f1',
  imageShimmerLight: '#f8fafc',
  imageShimmerDark: '#f1f1f1',
  imageShimmerStart: -300,
  imageShimmerEnd: 900,
  imageShimmerBrushSize: 300,
  removeBg: '#e53935',
  dangerBg: '#e53935',
  white: '#ffffff',
  black: '#000000',
  fullscreenBg: '#000000',
  fullscreenZ: 999,
  fullscreenCloseSize: 34,
  fullscreenClosePadding: 14,
  fullscreenCloseBg: 'rgba(0, 0, 0, 0.55)',
  fullscreenCloseIconSize: 24,
  fullscreenTopActionGap: 10,
  fullscreenDownloadPaddingX: 4,
  fullscreenDownloadPaddingY: 2,
  fullscreenDownloadRadius: 8,
  fullscreenDownloadTextSize: 12,
  fullscreenDownloadTextWeight: 500,
  fullscreenDownloadLineHeight: 1.2,
  fullscreenLongPressDelayMs: 520,
  fullscreenSingleClickDelayMs: 280,
  fullscreenClickSuppressMs: 360,
  fullscreenImageMaxWidth: '100%',
  fullscreenImageMaxHeight: '100%',
  fullscreenPagerButtonSize: 44,
  fullscreenSaveBottom: 20,
  fullscreenPageIndicatorEnd: 14,
  fullscreenPageIndicatorBottom: 18,
  fullscreenPageIndicatorRadius: 10,
  fullscreenPageIndicatorPaddingX: 10,
  fullscreenPageIndicatorPaddingY: 6,
  fullscreenPageIndicatorBg: 'rgba(0, 0, 0, 0.35)',
  fullscreenPageIndicatorTextColor: 'rgba(255, 255, 255, 0.85)',
  fullscreenPageIndicatorFontSize: 12,
  fullscreenPageIndicatorFontWeight: 500,
  fullscreenPageIndicatorLineHeight: 1,
  pressedScale: 0.965,
  shadow2: '0 2px 6px rgba(0, 0, 0, 0.10)',
  dragOverlayShadow: '0 14px 28px rgba(0, 0, 0, 0.26)',
  dragOverlayScale: 1.04,
  dragLongPressMs: 360,
  dragPreviewTransitionMs: 140,
  shimmerDurationMs: 1100,
  imageFadeMs: 180,
  zoomMax: 4,
  zoomDoubleTap: 2,
  fullscreenTapSlopPx: 16,
  fullscreenSwipeThreshold: 56,
  fullscreenSwipeVerticalTolerance: 48
} as const

const apkImageRootStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'block',
  overflow: 'hidden',
  background: APK_MEDIA_UI.imagePlaceholderBg
}

const apkImageFillStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'cover',
  background: APK_MEDIA_UI.imagePlaceholderBg,
  transition: `opacity ${APK_MEDIA_UI.imageFadeMs}ms ease`
}

const apkImagePlaceholderStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  overflow: 'hidden',
  background: APK_MEDIA_UI.imagePlaceholderBg
}

const apkImageShimmerLayerStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  backgroundImage: `linear-gradient(135deg, ${APK_MEDIA_UI.imageShimmerDark}, ${APK_MEDIA_UI.imageShimmerLight}, ${APK_MEDIA_UI.imageShimmerDark})`,
  backgroundSize: `${APK_MEDIA_UI.imageShimmerBrushSize}px ${APK_MEDIA_UI.imageShimmerBrushSize}px`,
  backgroundRepeat: 'no-repeat',
  animation: `ndjc-image-shimmer-translate ${APK_MEDIA_UI.shimmerDurationMs}ms cubic-bezier(0, 0, 0.2, 1) infinite`
}

const apkImageShimmerKeyframes = `
@keyframes ndjc-image-shimmer-translate {
  0% {
    background-position: ${APK_MEDIA_UI.imageShimmerStart}px 0px;
  }

  100% {
    background-position: ${APK_MEDIA_UI.imageShimmerEnd}px 0px;
  }
}
`

const apkEditableImageTileStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1',
  border: 0,
  borderRadius: APK_MEDIA_UI.imageEditRadius,
  padding: 0,
  overflow: 'hidden',
  background: APK_MEDIA_UI.imageTileBg,
  boxShadow: APK_MEDIA_UI.shadow2
}

const apkUploadTileStyle: React.CSSProperties = {
  ...apkEditableImageTileStyle,
  display: 'grid',
  placeItems: 'center',
  color: APK_MEDIA_UI.white,
  background: APK_MEDIA_UI.uploadBg,
  cursor: 'pointer'
}

const apkRemoveCornerButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: APK_MEDIA_UI.imageRemovePadding,
  right: APK_MEDIA_UI.imageRemovePadding,
  width: APK_MEDIA_UI.imageRemoveSize,
  height: APK_MEDIA_UI.imageRemoveSize,
  border: 0,
  borderRadius: 999,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  color: APK_MEDIA_UI.white,
  background: APK_MEDIA_UI.dangerBg,
  boxShadow: APK_MEDIA_UI.shadow2,
  fontSize: APK_MEDIA_UI.imageRemoveIconSize,
  lineHeight: 1,
  fontWeight: 800,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation'
}

const apkEditableGridStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: `repeat(${APK_MEDIA_UI.imageGridColumns}, minmax(0, 1fr))`,
  gap: APK_MEDIA_UI.imageGridGap
}

const apkFullscreenBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: APK_MEDIA_UI.fullscreenZ,
  display: 'grid',
  placeItems: 'center',
  background: APK_MEDIA_UI.fullscreenBg
}

const apkFullscreenTopActionsStyle: React.CSSProperties = {
  position: 'absolute',
  top: `calc(${APK_MEDIA_UI.fullscreenClosePadding}px + env(safe-area-inset-top))`,
  right: `calc(${APK_MEDIA_UI.fullscreenClosePadding}px + env(safe-area-inset-right))`,
  zIndex: 3,
  display: 'flex',
  alignItems: 'center',
  gap: APK_MEDIA_UI.fullscreenTopActionGap
}

const apkFullscreenDownloadButtonStyle: React.CSSProperties = {
  minWidth: 0,
  minHeight: 0,
  border: 0,
  borderRadius: APK_MEDIA_UI.fullscreenDownloadRadius,
  padding: `${APK_MEDIA_UI.fullscreenDownloadPaddingY}px ${APK_MEDIA_UI.fullscreenDownloadPaddingX}px`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: APK_MEDIA_UI.white,
  background: 'transparent',
  boxShadow: 'none',
  fontSize: APK_MEDIA_UI.fullscreenDownloadTextSize,
  lineHeight: APK_MEDIA_UI.fullscreenDownloadLineHeight,
  fontWeight: APK_MEDIA_UI.fullscreenDownloadTextWeight,
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation'
}

const apkFullscreenCloseButtonStyle: React.CSSProperties = {
  width: APK_MEDIA_UI.fullscreenCloseSize,
  height: APK_MEDIA_UI.fullscreenCloseSize,
  minWidth: APK_MEDIA_UI.fullscreenCloseSize,
  minHeight: APK_MEDIA_UI.fullscreenCloseSize,
  border: 0,
  borderRadius: 999,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  color: APK_MEDIA_UI.white,
  background: APK_MEDIA_UI.fullscreenCloseBg,
  boxShadow: 'none',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation'
}
const apkFullscreenCloseIconStyle: React.CSSProperties = {
  width: APK_MEDIA_UI.fullscreenCloseIconSize,
  height: APK_MEDIA_UI.fullscreenCloseIconSize,
  display: 'block',
  color: APK_MEDIA_UI.white,
  pointerEvents: 'none'
}

const apkFullscreenImageStyle: React.CSSProperties = {
  width: APK_MEDIA_UI.fullscreenImageMaxWidth,
  height: APK_MEDIA_UI.fullscreenImageMaxHeight,
  objectFit: 'contain',
  userSelect: 'none',
  touchAction: 'none'
}

const apkFullscreenPagerButtonStyle: React.CSSProperties = {
  width: APK_MEDIA_UI.fullscreenPagerButtonSize,
  height: APK_MEDIA_UI.fullscreenPagerButtonSize,
  border: 0,
  borderRadius: 999,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  color: APK_MEDIA_UI.white,
  background: 'rgba(0, 0, 0, 0.32)',
  fontSize: 28,
  lineHeight: 1,
  fontWeight: 500
}

const apkFullscreenPageIndicatorStyle: React.CSSProperties = {
  position: 'absolute',
  right: `calc(${APK_MEDIA_UI.fullscreenPageIndicatorEnd}px + env(safe-area-inset-right))`,
  bottom: `calc(${APK_MEDIA_UI.fullscreenPageIndicatorBottom}px + env(safe-area-inset-bottom))`,
  zIndex: 3,
  borderRadius: APK_MEDIA_UI.fullscreenPageIndicatorRadius,
  padding: `${APK_MEDIA_UI.fullscreenPageIndicatorPaddingY}px ${APK_MEDIA_UI.fullscreenPageIndicatorPaddingX}px`,
  color: APK_MEDIA_UI.fullscreenPageIndicatorTextColor,
  background: APK_MEDIA_UI.fullscreenPageIndicatorBg,
  fontSize: APK_MEDIA_UI.fullscreenPageIndicatorFontSize,
  lineHeight: APK_MEDIA_UI.fullscreenPageIndicatorLineHeight,
  fontWeight: APK_MEDIA_UI.fullscreenPageIndicatorFontWeight,
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  pointerEvents: 'none'
}

const APK_STORE_PROFILE_UI = {
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
  pink: '#fe9595',
  green: '#26c6a4',

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

const apkStoreSectionStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: APK_STORE_PROFILE_UI.sectionGap
}

const apkStoreSectionHeaderStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: APK_STORE_PROFILE_UI.sectionHeaderGap
}

const apkStoreSectionHeaderBarStyle: React.CSSProperties = {
  width: APK_STORE_PROFILE_UI.sectionHeaderBarWidth,
  height: APK_STORE_PROFILE_UI.sectionHeaderBarHeight,
  borderRadius: APK_STORE_PROFILE_UI.sectionHeaderBarRadius,
  background: APK_STORE_PROFILE_UI.pink,
  flex: `0 0 ${APK_STORE_PROFILE_UI.sectionHeaderBarWidth}px`
}

const apkStoreSectionTitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_STORE_PROFILE_UI.ink70,
  fontSize: APK_STORE_PROFILE_UI.sectionHeaderTitleSize,
  lineHeight: APK_STORE_PROFILE_UI.sectionHeaderTitleLineHeight,
  fontWeight: APK_STORE_PROFILE_UI.sectionHeaderTitleWeight
}

const apkStoreBodyTextStyle: React.CSSProperties = {
  margin: 0,
  color: APK_STORE_PROFILE_UI.ink90,
  fontSize: APK_STORE_PROFILE_UI.bodySize,
  lineHeight: APK_STORE_PROFILE_UI.bodyLineHeight,
  fontWeight: APK_STORE_PROFILE_UI.bodyWeight,
  whiteSpace: 'pre-wrap'
}

const apkStoreMutedTextStyle: React.CSSProperties = {
  margin: 0,
  color: APK_STORE_PROFILE_UI.ink45,
  fontSize: APK_STORE_PROFILE_UI.emptyBodySize,
  lineHeight: APK_STORE_PROFILE_UI.emptyBodyLineHeight,
  fontWeight: APK_STORE_PROFILE_UI.bodyWeight
}

const apkStoreLabelStyle: React.CSSProperties = {
  margin: 0,
  color: APK_STORE_PROFILE_UI.ink55,
  fontSize: APK_STORE_PROFILE_UI.labelSize,
  lineHeight: APK_STORE_PROFILE_UI.labelLineHeight,
  fontWeight: APK_STORE_PROFILE_UI.labelWeight
}

const apkStoreValueStyle: React.CSSProperties = {
  margin: 0,
  color: APK_STORE_PROFILE_UI.ink90,
  fontSize: APK_STORE_PROFILE_UI.bodySize,
  lineHeight: APK_STORE_PROFILE_UI.bodyLineHeight,
  fontWeight: APK_STORE_PROFILE_UI.bodyWeight,
  overflowWrap: 'anywhere'
}

const apkStoreInfoLineButtonStyle: React.CSSProperties = {
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

const apkStoreCardSurfaceStyle: React.CSSProperties = {
  width: '100%',
  border: `${APK_STORE_PROFILE_UI.cardBorderWidth}px solid ${APK_STORE_PROFILE_UI.ink06}`,
  borderRadius: APK_STORE_PROFILE_UI.cardRadius,
  padding: APK_STORE_PROFILE_UI.cardPadding,
  display: 'grid',
  gap: APK_STORE_PROFILE_UI.cardGap,
  color: APK_STORE_PROFILE_UI.ink90,
  background: APK_STORE_PROFILE_UI.white,
  boxShadow: 'none'
}

const apkStoreContactCardStyle: React.CSSProperties = {
  width: '100%',
  border: `${APK_STORE_PROFILE_UI.cardBorderWidth}px solid ${APK_STORE_PROFILE_UI.ink06}`,
  borderRadius: APK_STORE_PROFILE_UI.contactCardRadius,
  display: 'grid',
  overflow: 'hidden',
  color: APK_STORE_PROFILE_UI.ink,
  background: APK_STORE_PROFILE_UI.white
}

const apkStoreServiceChipStyle: React.CSSProperties = {
  border: `1px solid ${APK_STORE_PROFILE_UI.ink06}`,
  borderRadius: APK_STORE_PROFILE_UI.serviceChipRadius,
  padding: `${APK_STORE_PROFILE_UI.serviceChipPaddingY}px ${APK_STORE_PROFILE_UI.serviceChipPaddingX}px`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: APK_STORE_PROFILE_UI.ink90,
  background: APK_STORE_PROFILE_UI.chipSurface,
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 500,
  whiteSpace: 'nowrap'
}
function StoreProfileSectionHeader({ title }: { title: string }) {
  return (
    <div style={apkStoreSectionHeaderStyle}>
      <span style={apkStoreSectionHeaderBarStyle} aria-hidden="true" />
      <h2 style={apkStoreSectionTitleStyle}>{title}</h2>
    </div>
  )
}
const APK_STORE_EDIT_UI = {
  black90: 'rgba(0, 0, 0, 0.90)',
  black85: 'rgba(0, 0, 0, 0.85)',
  black75: 'rgba(0, 0, 0, 0.75)',
  black60: 'rgba(0, 0, 0, 0.60)',
  black55: 'rgba(0, 0, 0, 0.55)',
  black45: 'rgba(0, 0, 0, 0.45)',
  black10: 'rgba(0, 0, 0, 0.10)',
  white: '#ffffff',
  brand: '#fe9595',
  green: '#26c6a4',
  red75: 'rgba(229, 57, 53, 0.75)',
  error80: 'rgba(229, 57, 53, 0.80)',

  titleSize: 16,
  titleLineHeight: 1.25,
  titleWeight: 600,
  subtitleSize: 12,
  subtitleLineHeight: 1.35,
  subtitleWeight: 400,

  sectionSubtitleTopGap: 4,
  sectionBottomGap: 10,
  fieldGap: 6,
  rowGap: 10,
  removeTopPadding: 4,
  removeBottomPadding: 8,
  errorBottomGap: 8,

  nameColumnFlex: 0.38,
  valueColumnFlex: 0.62,

  labelSize: 14,
  labelLineHeight: 1.2,
  labelWeight: 600,
  labelBottomGap: 8,
  pickerBottomGap: 14,

  editorCardRadius: 16,
  editorCardPadding: 12,
  editorCardGap: 10,
  editorCardBorderWidth: 1,
  editorCardBorderColor: 'rgba(0, 0, 0, 0.08)',

  logoColumns: 3,
  imageGridColumns: 3,
  imageCellGap: 10,
  imageCornerRadius: 18,
  maxCoverImages: 9,

  logoPickerSize: 96,
  coverPickerMinHeight: 112,
  pickerTitleSize: 14,
  pickerTitleWeight: 600,
  pickerHintSize: 12,
  pickerHintWeight: 400,

  servicesGap: 8,
  serviceChipRadius: 999,
  serviceChipPaddingX: 12,
  serviceChipPaddingY: 8
} as const

const apkStoreEditSectionTitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_STORE_EDIT_UI.black90,
  fontSize: APK_STORE_EDIT_UI.titleSize,
  lineHeight: APK_STORE_EDIT_UI.titleLineHeight,
  fontWeight: APK_STORE_EDIT_UI.titleWeight
}

const apkStoreEditSectionSubtitleStyle: React.CSSProperties = {
  margin: `${APK_STORE_EDIT_UI.sectionSubtitleTopGap}px 0 0`,
  color: APK_STORE_EDIT_UI.black55,
  fontSize: APK_STORE_EDIT_UI.subtitleSize,
  lineHeight: APK_STORE_EDIT_UI.subtitleLineHeight,
  fontWeight: APK_STORE_EDIT_UI.subtitleWeight
}

const apkStoreEditSectionBottomSpacerStyle: React.CSSProperties = {
  height: APK_STORE_EDIT_UI.sectionBottomGap
}

const apkStoreEditColumnStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: 0
}

const apkStoreEditRowStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  gap: APK_STORE_EDIT_UI.rowGap
}

const apkStoreEditRemoveRowStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end'
}

const apkStoreEditRemoveButtonStyle: React.CSSProperties = {
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

const apkStoreEditLabelStyle: React.CSSProperties = {
  color: APK_STORE_EDIT_UI.black90,
  fontSize: APK_STORE_EDIT_UI.labelSize,
  lineHeight: APK_STORE_EDIT_UI.labelLineHeight,
  fontWeight: APK_STORE_EDIT_UI.labelWeight
}

const apkStoreEditCardStyle: React.CSSProperties = {
  width: '100%',
  border: `${APK_STORE_EDIT_UI.editorCardBorderWidth}px solid ${APK_STORE_EDIT_UI.editorCardBorderColor}`,
  borderRadius: APK_STORE_EDIT_UI.editorCardRadius,
  padding: APK_STORE_EDIT_UI.editorCardPadding,
  display: 'grid',
  gap: APK_STORE_EDIT_UI.editorCardGap,
  background: APK_STORE_EDIT_UI.white
}

const apkStoreEditPickerHeaderStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: 3
}

const apkStoreEditPickerTitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_STORE_EDIT_UI.black90,
  fontSize: APK_STORE_EDIT_UI.pickerTitleSize,
  lineHeight: 1.25,
  fontWeight: APK_STORE_EDIT_UI.pickerTitleWeight
}

const apkStoreEditPickerHintStyle: React.CSSProperties = {
  margin: 0,
  color: APK_STORE_EDIT_UI.black55,
  fontSize: APK_STORE_EDIT_UI.pickerHintSize,
  lineHeight: 1.35,
  fontWeight: APK_STORE_EDIT_UI.pickerHintWeight
}

const APK_APPOINTMENT_UI = {
  black: '#000000',
  white: '#ffffff',
  brand: '#c43f4d',
  green: '#0f766e',
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
const apkAppointmentColumnStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: APK_APPOINTMENT_UI.sectionGap
}

const apkAppointmentDetailLineStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: APK_APPOINTMENT_UI.detailLineGap
}

const apkAppointmentDetailLabelStyle: React.CSSProperties = {
  margin: 0,
  color: APK_APPOINTMENT_UI.black55,
  fontSize: APK_APPOINTMENT_UI.labelSmallSize,
  lineHeight: APK_APPOINTMENT_UI.labelSmallLineHeight,
  fontWeight: APK_APPOINTMENT_UI.labelSmallWeight
}

const apkAppointmentDetailValueStyle: React.CSSProperties = {
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

function apkAppointmentDatePillStyle(selected: boolean, enabled: boolean): React.CSSProperties {
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

const apkAppointmentFlowRowStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  gap: APK_APPOINTMENT_UI.flowGap
}

const apkAppointmentSectionTitleStyle: React.CSSProperties = {
  margin: 0,
  paddingTop: APK_APPOINTMENT_UI.detailTitleTopPadding,
  color: APK_APPOINTMENT_UI.black,
  fontSize: APK_APPOINTMENT_UI.titleSmallSize,
  lineHeight: APK_APPOINTMENT_UI.titleSmallLineHeight,
  fontWeight: APK_APPOINTMENT_UI.titleSmallWeight
}

const apkAppointmentSheetSurfaceStyle: React.CSSProperties = {
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

const apkAppointmentSheetContentStyle: React.CSSProperties = {
  minHeight: 0,
  padding: `${APK_APPOINTMENT_UI.bottomSheetContentPaddingTop}px ${APK_APPOINTMENT_UI.bottomSheetContentPaddingX}px calc(${APK_APPOINTMENT_UI.bottomSheetContentPaddingBottom}px + env(safe-area-inset-bottom))`,
  display: 'grid',
  gap: APK_APPOINTMENT_UI.sectionGap,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch'
}

const apkAppointmentCalendarGridStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: APK_APPOINTMENT_UI.calendarWeekGap
}

const apkAppointmentSubmitInfoBoxStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: APK_APPOINTMENT_UI.submitInfoRadius,
  padding: `${APK_APPOINTMENT_UI.submitInfoPaddingY}px ${APK_APPOINTMENT_UI.submitInfoPaddingX}px`,
  display: 'grid',
  gap: APK_APPOINTMENT_UI.detailLineGap,
  background: APK_APPOINTMENT_UI.softSurface
}

const apkAppointmentWarningBoxStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: APK_APPOINTMENT_UI.productWarningRadius,
  padding: `${APK_APPOINTMENT_UI.productWarningPaddingY}px ${APK_APPOINTMENT_UI.productWarningPaddingX}px`,
  color: APK_APPOINTMENT_UI.warningText,
  background: APK_APPOINTMENT_UI.warningSurface
}

function appointmentDetailTimeText(preferredDate?: string | null, preferredTime?: string | null): string {
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

function appointmentListTimeText(preferredDate?: string | null, preferredTime?: string | null): string {
  const value = appointmentDetailTimeText(preferredDate, preferredTime)
  return value === 'Not selected' ? 'Time · Not selected' : `Time · ${value}`
}
const APK_SHELL_UI = {
  black: '#000000',
  white: '#ffffff',
  transparent: 'transparent',
  pageBg: '#eff3f2',
  brand: '#fe9595',
  green: '#0f766e',
  ink: '#111827',
  muted: '#4b5563',
  mutedText: 'rgba(0, 0, 0, 0.82)',
  systemBarFallbackBg: '#dfe5e3',

  phoneViewportWidth: '100%',
  phoneViewportHeight: '100dvh',
  phoneMaxWidth: '480px',
  screenMinHeight: '100dvh',

  whiteCardScreenPadding: 16,
  whiteCardTopOffset: 60,
  whiteCardPaddingX: 16,
  whiteCardPaddingY: 16,
  whiteCardRadius: 24,
  whiteCardShadow: '0 3px 8px rgba(0, 0, 0, 0.08)',

  backButtonSize: 50,
  backButtonRadius: 12,
  backButtonShadow: '0 6px 14px rgba(254, 149, 149, 0.26)',
  backButtonPressedShadow: '0 2px 6px rgba(254, 149, 149, 0.18)',
  backButtonIconSize: 26,
  backButtonPressedScale: 0.965,
  backButtonPressedDurationMs: 120,

  topNavHorizontalPadding: 16,
  topNavTopPadding: 2,
  topNavToCardSpacing: 30,
  topNavZ: 1000,
  topNavButtonSlotSize: 50,

  homeEntryHorizontalPadding: 16,
  homeEntryVerticalPadding: 8,

  titleBlockPaddingX: 16,
  titleBlockGap: 6,
  titleSize: 28,
  titleLineHeight: 1.12,
  titleWeight: 700,
  subtitleSize: 14,
  subtitleLineHeight: 1.35,
  subtitleWeight: 400,

  contentPaddingX: 16,
  contentPaddingTop: 12,
  contentPaddingBottom: 88,

  badgeMinSize: 28,
  badgeRadius: 999,

  pullRefreshIndicatorSize: 32,
  pullRefreshIndicatorTop: 0,
  pullRefreshTriggerDistance: 72,

  bgCircleDefaultSize: 160,
  bgCirclePinkStart: 'rgba(254, 149, 149, 0.22)',
  bgCirclePinkEnd: 'rgba(254, 149, 149, 0)'
} as const

const apkShellScreenStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  height: '100dvh',
  minHeight: APK_SHELL_UI.screenMinHeight,
  display: 'grid',
  placeItems: 'center',
  background: APK_SHELL_UI.systemBarFallbackBg,
  overflow: 'hidden',
  overscrollBehavior: 'none',
  overscrollBehaviorY: 'none',
  boxSizing: 'border-box'
}

const apkPhoneSurfaceStyle: React.CSSProperties = {
  position: 'relative',
  width: APK_SHELL_UI.phoneViewportWidth,
  minWidth: 0,
  maxWidth: APK_SHELL_UI.phoneMaxWidth,
  height: APK_SHELL_UI.phoneViewportHeight,
  minHeight: APK_SHELL_UI.screenMinHeight,
  maxHeight: '100dvh',
  margin: '0 auto',
  background: APK_SHELL_UI.pageBg,
  overflow: 'hidden',
  overscrollBehavior: 'contain',
  overscrollBehaviorY: 'contain',
  boxSizing: 'border-box'
}

const apkUnifiedBackgroundSurfaceStyle: React.CSSProperties = {
  ...apkPhoneSurfaceStyle,
  width: APK_SHELL_UI.phoneViewportWidth,
  minWidth: 0,
  maxWidth: APK_SHELL_UI.phoneMaxWidth,
  height: '100dvh',
  minHeight: '100dvh',
  maxHeight: '100dvh',
  background: APK_SHELL_UI.pageBg
}
const apkWhiteCardStyle: React.CSSProperties = {
  border: 0,
  borderRadius: APK_SHELL_UI.whiteCardRadius,
  padding: `${APK_SHELL_UI.whiteCardPaddingY}px ${APK_SHELL_UI.whiteCardPaddingX}px`,
  background: APK_SHELL_UI.white,
  boxShadow: APK_SHELL_UI.whiteCardShadow
}

function apkBackButtonStyle(
  pressed = false,
  iconOnly = false,
  iconTint: string = APK_SHELL_UI.white
): React.CSSProperties {
  const resolvedIconTint = iconTint

  return {
    width: APK_SHELL_UI.backButtonSize,
    height: APK_SHELL_UI.backButtonSize,
    minWidth: APK_SHELL_UI.backButtonSize,
    minHeight: APK_SHELL_UI.backButtonSize,
    border: 0,
    borderRadius: iconOnly ? 999 : APK_SHELL_UI.backButtonRadius,
    padding: 0,
    display: 'grid',
    placeItems: 'center',
    color: resolvedIconTint,
    background: iconOnly ? APK_SHELL_UI.transparent : APK_SHELL_UI.brand,
    boxShadow: iconOnly ? 'none' : pressed ? APK_SHELL_UI.backButtonPressedShadow : APK_SHELL_UI.backButtonShadow,
    fontSize: iconOnly ? 24 : APK_SHELL_UI.backButtonIconSize,
    lineHeight: 0,
    fontWeight: 900,
    transform: pressed ? `scale(${APK_SHELL_UI.backButtonPressedScale})` : 'scale(1)',
    transition: `transform ${APK_SHELL_UI.backButtonPressedDurationMs}ms ease, box-shadow ${APK_SHELL_UI.backButtonPressedDurationMs}ms ease`
  }
}

const apkBackButtonIconWrapStyle: React.CSSProperties = {
  width: APK_SHELL_UI.backButtonIconSize,
  height: APK_SHELL_UI.backButtonIconSize,
  display: 'grid',
  placeItems: 'center',
  lineHeight: 0
}

const apkBackButtonTextIconStyle: React.CSSProperties = {
  display: 'block',
  color: 'currentColor',
  fontSize: APK_SHELL_UI.backButtonIconSize,
  lineHeight: 1,
  fontWeight: 900
}

function NdjcBackArrowSvgIcon() {
  return (
    <svg
      width={APK_SHELL_UI.backButtonIconSize}
      height={APK_SHELL_UI.backButtonIconSize}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path
        d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.42 18.59L7.83 13H20V11Z"
        fill="currentColor"
      />
    </svg>
  )
}

const apkTopNavOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  zIndex: APK_SHELL_UI.topNavZ,
  padding: `calc(${APK_SHELL_UI.topNavTopPadding}px + env(safe-area-inset-top)) ${APK_SHELL_UI.topNavHorizontalPadding}px 0`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  pointerEvents: 'none'
}

function apkBgCircleStyle({
  size = APK_SHELL_UI.bgCircleDefaultSize,
  offsetX = 0,
  offsetY = 0,
  colors
}: {
  size?: number | string
  offsetX?: number | string
  offsetY?: number | string
  colors?: readonly string[]
} = {}): React.CSSProperties {
  const resolvedColors = colors && colors.length >= 2
    ? colors
    : [APK_SHELL_UI.bgCirclePinkStart, APK_SHELL_UI.bgCirclePinkEnd]

  return {
    position: 'absolute',
    width: size,
    height: size,
    transform: `translate(${typeof offsetX === 'number' ? `${offsetX}px` : offsetX}, ${typeof offsetY === 'number' ? `${offsetY}px` : offsetY})`,
    borderRadius: 999,
    background: `radial-gradient(circle, ${resolvedColors.join(', ')})`,
    pointerEvents: 'none'
  }
}

const apkPullRefreshRootStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  height: '100%',
  minHeight: 0,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  overflow: 'hidden',
  overflowX: 'hidden',
  boxSizing: 'border-box',
  touchAction: 'auto',
  overscrollBehaviorY: 'auto',
  overscrollBehaviorX: 'auto'
}

const apkPullRefreshIndicatorWrapStyle: React.CSSProperties = {
  position: 'absolute',
  top: APK_SHELL_UI.pullRefreshIndicatorTop,
  left: 0,
  right: 0,
  zIndex: 20,
  display: 'grid',
  placeItems: 'center',
  pointerEvents: 'none'
}

const apkPullRefreshIndicatorStyle: React.CSSProperties = {
  background: APK_SHELL_UI.white,
  boxShadow: APK_SHELL_UI.whiteCardShadow
}

const apkPullRefreshHintStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 21,
  height: 56,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  pointerEvents: 'none',
  overflow: 'hidden'
}

const apkPullRefreshHintPillStyle: React.CSSProperties = {
  minHeight: 24,
  padding: 0,
  borderRadius: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  boxShadow: 'none',
  color: 'rgba(0, 0, 0, 0.72)',
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  backdropFilter: 'none',
  WebkitBackdropFilter: 'none',
  transform: 'translateY(-120%)',
  transition: 'transform 180ms ease-out, opacity 180ms ease-out',
  willChange: 'transform, opacity'
}

const apkHomeEntryOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  zIndex: APK_SHELL_UI.topNavZ,
  padding: `calc(${APK_SHELL_UI.homeEntryVerticalPadding}px + env(safe-area-inset-top)) ${APK_SHELL_UI.homeEntryHorizontalPadding}px 0`,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 10,
  pointerEvents: 'none'
}

const apkScreenHeaderStyle: React.CSSProperties = {
  width: '100%',
  padding: `calc(${APK_SHELL_UI.topNavTopPadding}px + env(safe-area-inset-top)) ${APK_SHELL_UI.topNavHorizontalPadding}px ${APK_SHELL_UI.topNavToCardSpacing}px`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const apkTitleBlockStyle: React.CSSProperties = {
  padding: `0 ${APK_SHELL_UI.titleBlockPaddingX}px`,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: APK_SHELL_UI.titleBlockGap,
  alignItems: 'center'
}

const apkScreenContentStyle: React.CSSProperties = {
  padding: `${APK_SHELL_UI.contentPaddingTop}px ${APK_SHELL_UI.contentPaddingX}px ${APK_SHELL_UI.contentPaddingBottom}px`,
  display: 'grid',
  gap: 14
}

const APK_HOME_PAGE_UI = {
  controlsGap: 2,
  chipsToListGap: 14,
  screenHorizontalPadding: 16,
  screenVerticalPadding: 10,
  chipRowHorizontalPadding: 16,
  listItemSpacing: 12,
  floatingBottomBarReserve: 84,
  extraBottomSpacer: 16,
  homeBottomPadding: 72,
  heroCircleSize: 0,
  heroCircleLeftOffsetX: -100,
  heroCircleLeftOffsetY: -40,
  heroCircleRightOffsetX: 100,
  heroCircleRightOffsetY: 500,
  heroCircleLeftColors: ['rgba(179, 123, 255, 1)', 'rgba(142, 92, 255, 0)'],
  heroCircleRightColors: ['rgba(142, 92, 255, 1)', 'rgba(142, 92, 255, 0)']
} as const

const APK_PAGE_SHELL_UI = {
  screenPadding: APK_SHELL_UI.whiteCardScreenPadding,
  topCardOffset: APK_SHELL_UI.whiteCardTopOffset,

  tabBottomReserve: APK_HOME_PAGE_UI.floatingBottomBarReserve,
  noBottomBarReserve: 32,
  stickyActionReserve: 72,

  normalGap: 10,
  cardGap: 12
} as const

const apkHomeRootStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  height: '100%',
  minHeight: 0,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gridTemplateRows: 'auto minmax(0, 1fr)',
  alignContent: 'start',
  background: 'transparent',
  overflow: 'hidden',
  overflowX: 'hidden',
  boxSizing: 'border-box'
}

const apkHomeControlsStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  alignContent: 'start',
  gap: 0,
  zIndex: 2,
  overflowX: 'hidden',
  boxSizing: 'border-box'
}

const apkHomeControlsGapStyle: React.CSSProperties = {
  height: APK_HOME_PAGE_UI.controlsGap
}

const apkHomeTagsWrapStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  padding: `0 ${APK_HOME_PAGE_UI.chipRowHorizontalPadding}px ${APK_HOME_PAGE_UI.controlsGap}px`,
  overflowX: 'hidden',
  boxSizing: 'border-box'
}

const apkHomeSortWrapStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  padding: `0 ${APK_HOME_PAGE_UI.chipRowHorizontalPadding}px ${APK_HOME_PAGE_UI.controlsGap}px`,
  overflowX: 'hidden',
  boxSizing: 'border-box'
}

const apkHomeCategoryWrapStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  paddingBottom: APK_HOME_PAGE_UI.chipsToListGap,
  overflowX: 'hidden',
  boxSizing: 'border-box'
}

const apkHomeListStyle: React.CSSProperties = {
  minHeight: 0,
  height: '100%',
  padding: `0 ${APK_PAGE_SHELL_UI.screenPadding}px calc(${APK_HOME_PAGE_UI.screenVerticalPadding}px + var(${NDJC_BOTTOM_BAR_RESERVE_CSS_VAR}, ${APK_PAGE_SHELL_UI.tabBottomReserve}px))`,
  display: 'grid',
  alignContent: 'start',
  gap: APK_HOME_PAGE_UI.listItemSpacing,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  zIndex: 2,
  boxSizing: 'border-box'
}

const apkHomeGridRowStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: APK_HOME_PAGE_UI.listItemSpacing,
  alignItems: 'stretch',
  boxSizing: 'border-box'
}

const apkHomeGridPlaceholderStyle: React.CSSProperties = {
  minWidth: 0
}

const apkHomeBottomBarHostStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 'auto',
  bottom: 0,
  width: '100%',
  height: 'calc(49px + env(safe-area-inset-bottom))',
  zIndex: 100,
  pointerEvents: 'none',
  boxSizing: 'border-box'
}

const apkHomeEmptyWrapStyle: React.CSSProperties = {
  minHeight: 0,
  height: '100%',
  padding: `0 ${APK_PAGE_SHELL_UI.screenPadding}px var(${NDJC_BOTTOM_BAR_RESERVE_CSS_VAR}, ${APK_PAGE_SHELL_UI.tabBottomReserve}px)`,
  display: 'grid',
  placeItems: 'center',
  zIndex: 2
}

const apkHomeRefreshIndicatorWrapStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(8px + env(safe-area-inset-top))',
  left: 0,
  right: 0,
  zIndex: 30,
  display: 'grid',
  placeItems: 'center',
  pointerEvents: 'none'
}
const APK_DETAIL_PAGE_UI = {
  heroSize: 'min(100vw, 480px)',
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

  contentHorizontalPadding: 24,
  contentVerticalPadding: 24,
  headerRowPaddingY: 12,
  headerRowGap: 12,
  headerRowIconSize: 24,
  headerRowFavoriteSize: 24,

  pickBadgePaddingX: 12,
  pickBadgePaddingY: 6,
  pickBadgeGap: 4,
  pickBadgeRadius: 999,
  pickBadgeIconSize: 18,
  pickBadgeTextSize: 14,
  pickBadgeTextLineHeight: 1,
  pickBadgeTextWeight: 600,
  pickBadgeBg: '#fe9595',
  pickBadgeTextColor: '#ffffff',
  pickBadgeBorderColor: 'rgba(255, 255, 255, 0.38)',
  pickBadgeBorderWidth: 1,

  titleSize: 28,
  titleLineHeight: 1.12,
  titleWeight: 600,

  priceSizeDiscount: 28,
  priceSizeNormal: 16,
  priceLineHeight: 1.1,
  priceWeight: 600,
  originalPriceSize: 14,
  originalPriceLineHeight: 1.25,
  originalPriceWeight: 400,
  originalPriceAlpha: 0.50,

  sectionGap: 6,
  categorySectionGap: 8,
  blockGap: 12,
  titleBlockGap: 10,
  dividerTopPadding: 6,
  dividerColor: 'rgba(0, 0, 0, 0.10)',
  dividerHeight: 1,

  sectionLabelSize: 14,
  sectionLabelLineHeight: 1.25,
  sectionLabelWeight: 500,
  sectionLabelColor: 'rgba(0, 0, 0, 0.70)',

  descriptionSize: 18,
  descriptionLineHeight: 1.35,
  descriptionWeight: 400,
  descriptionColor: 'rgba(0, 0, 0, 0.90)',
  descriptionCollapsedLines: 3,

  showMoreSize: 12,
  showMoreLineHeight: 1.25,
  showMoreWeight: 500,
  showMoreColor: '#fe9595',

  unavailableSize: 12,
  unavailableLineHeight: 1.25,
  unavailableWeight: 500,
  unavailableColor: '#e53935'
} as const

const apkDetailRootStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: 0,
  background: 'transparent',
  overflow: 'hidden'
}

const apkDetailScrollStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  zIndex: 2
}

const apkDetailHeroStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: APK_DETAIL_PAGE_UI.heroSize,
  display: 'grid',
  placeItems: 'center',
  background: `linear-gradient(180deg, ${APK_DETAIL_PAGE_UI.heroGradientTop}, ${APK_DETAIL_PAGE_UI.heroGradientBottom})`,
  overflow: 'hidden',
  contain: 'layout paint',
  isolation: 'isolate'
}

const apkDetailHeroImageButtonStyle: React.CSSProperties = {
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

const apkDetailHeroCounterStyle: React.CSSProperties = {
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

const apkDetailHeaderRowStyle: React.CSSProperties = {
  width: '100%',
  padding: `${APK_DETAIL_PAGE_UI.headerRowPaddingY}px ${APK_DETAIL_PAGE_UI.contentHorizontalPadding}px`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: APK_DETAIL_PAGE_UI.headerRowGap,
  boxSizing: 'border-box'
}

const apkPickBadgeStyle: React.CSSProperties = {
  border: '1px solid rgba(255, 255, 255, 0.38)',
  borderRadius: 999,
  padding: '3px 8px',
  minHeight: 22,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  color: '#ffffff',
  background: '#fe9595',
  boxSizing: 'border-box',
  lineHeight: 1,
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
  flex: '0 0 auto'
}

const apkPickBadgeIconStyle: React.CSSProperties = {
  width: 15,
  height: 15,
  display: 'block',
  flex: '0 0 15px'
}

const apkPickBadgeTextStyle: React.CSSProperties = {
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

function ApkPickBadgeIcon() {
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

function ApkHiddenBadgeIcon() {
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

function NdjcItemStatusBadge({
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
        background: isHidden ? '#ececec' : apkHomeBadgeStyle.background,
        color: isHidden ? '#7b7b7b' : apkHomeBadgeStyle.color
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
          color: isHidden ? '#7b7b7b' : apkHomeBadgeTextStyle.color
        }}
      >
        {text}
      </span>
    </span>
  )
}

function NdjcItemStatusBadgeRow({
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

const apkDetailPickBadgeStyle: React.CSSProperties = apkPickBadgeStyle

const apkDetailPickBadgeTextStyle: React.CSSProperties = apkPickBadgeTextStyle

const apkDetailFavoriteButtonStyle: React.CSSProperties = {
  width: APK_DETAIL_PAGE_UI.headerRowFavoriteSize,
  height: APK_DETAIL_PAGE_UI.headerRowFavoriteSize,
  border: 0,
  borderRadius: 999,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  color: '#fe9595',
  background: 'transparent',
  boxShadow: 'none',
  lineHeight: 1,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation'
}

function DetailFavoriteIcon({
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
        color: '#fe9595'
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

const apkDetailContentStyle: React.CSSProperties = {
  width: '100%',
  padding: `6px ${APK_DETAIL_PAGE_UI.contentHorizontalPadding}px calc(${APK_DETAIL_PAGE_UI.contentVerticalPadding}px + var(${NDJC_BOTTOM_BAR_RESERVE_CSS_VAR}, ${APK_PAGE_SHELL_UI.tabBottomReserve}px))`,
  display: 'grid',
  gap: APK_DETAIL_PAGE_UI.blockGap,
  boxSizing: 'border-box'
}

const apkDetailTitleBlockStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: APK_DETAIL_PAGE_UI.titleBlockGap
}

const apkDetailTitleStyle: React.CSSProperties = {
  margin: 0,
  color: '#000000',
  fontSize: APK_DETAIL_PAGE_UI.titleSize,
  lineHeight: APK_DETAIL_PAGE_UI.titleLineHeight,
  fontWeight: APK_DETAIL_PAGE_UI.titleWeight,
  overflowWrap: 'anywhere'
}

const apkDetailPriceRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8
}

const apkDetailPrimaryPriceStyle: React.CSSProperties = {
  color: '#000000',
  fontSize: APK_DETAIL_PAGE_UI.priceSizeDiscount,
  lineHeight: APK_DETAIL_PAGE_UI.priceLineHeight,
  fontWeight: APK_DETAIL_PAGE_UI.priceWeight,
  whiteSpace: 'nowrap'
}

const apkDetailNormalPriceStyle: React.CSSProperties = {
  color: '#000000',
  fontSize: APK_DETAIL_PAGE_UI.priceSizeNormal,
  lineHeight: APK_DETAIL_PAGE_UI.priceLineHeight,
  fontWeight: APK_DETAIL_PAGE_UI.priceWeight,
  whiteSpace: 'nowrap'
}

const apkDetailOriginalPriceStyle: React.CSSProperties = {
  color: `rgba(0, 0, 0, ${APK_DETAIL_PAGE_UI.originalPriceAlpha})`,
  fontSize: APK_DETAIL_PAGE_UI.originalPriceSize,
  lineHeight: APK_DETAIL_PAGE_UI.originalPriceLineHeight,
  fontWeight: APK_DETAIL_PAGE_UI.originalPriceWeight,
  textDecoration: 'line-through',
  whiteSpace: 'nowrap'
}

const apkDetailDividerStyle: React.CSSProperties = {
  width: '100%',
  height: APK_DETAIL_PAGE_UI.dividerHeight,
  marginTop: APK_DETAIL_PAGE_UI.dividerTopPadding,
  background: APK_DETAIL_PAGE_UI.dividerColor
}

const apkDetailSectionStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gap: APK_DETAIL_PAGE_UI.sectionGap
}

const apkDetailSectionLabelStyle: React.CSSProperties = {
  margin: 0,
  color: APK_DETAIL_PAGE_UI.sectionLabelColor,
  fontSize: APK_DETAIL_PAGE_UI.sectionLabelSize,
  lineHeight: APK_DETAIL_PAGE_UI.sectionLabelLineHeight,
  fontWeight: APK_DETAIL_PAGE_UI.sectionLabelWeight
}

const apkDetailDescriptionStyle: React.CSSProperties = {
  margin: 0,
  color: APK_DETAIL_PAGE_UI.descriptionColor,
  fontSize: APK_DETAIL_PAGE_UI.descriptionSize,
  lineHeight: APK_DETAIL_PAGE_UI.descriptionLineHeight,
  fontWeight: APK_DETAIL_PAGE_UI.descriptionWeight,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere'
}

const apkDetailShowMoreButtonStyle: React.CSSProperties = {
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

const apkDetailTagsRowStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10
}


const APK_HOME_NAV_UI = {
  topBarHorizontalPadding: 16,
  topBarTopPadding: 6,
  topBarBottomPadding: 0,
  topBannerHeight: 60,
  topBannerRadius: 22,
  topBannerGradientTop: '#2FD1AE',
  topBannerGradientBottom: '#1FBF9D',
  topBannerInnerPaddingX: 12,
  topBannerInnerPaddingY: 6,
  searchBarHeight: 46,
  searchIconSize: 20,
  searchTextStartSpacing: 8,
  searchTextColor: '#ffffff',
  searchPlaceholderColor: 'rgba(255, 255, 255, 0.66)',
  searchFontSize: 16,
  profileButtonSize: 36,
  profileIconSize: 24,
  profileButtonBg: 'rgba(255, 255, 255, 0.14)',

  bottomBarHeight: 48,
  bottomBarDividerColor: 'rgba(0, 0, 0, 0.06)',
  bottomBarBg: '#ffffff',
  bottomBarPaddingX: 12,
  bottomBarGap: 8,
  bottomTabRadius: 14,
  bottomTabPaddingX: 8,
  bottomTabPaddingY: 2,
  bottomTabIconSize: 22,
  bottomTabIconLabelGap: 1,
  bottomTabDotSize: 6,
  bottomTabDotOffsetX: 3,
  bottomTabLabelSize: 12,
  bottomTabActiveColor: '#fe9595',
  bottomTabInactiveColor: 'rgba(0, 0, 0, 0.92)',
  bottomTabDotColor: '#e53935'
} as const

const APK_CORE_UI = {
  white: '#ffffff',
  black: '#000000',
  ink: '#111827',
  ink2: '#374151',
  muted: '#6b7280',
  brand: '#fe9595',
  green: '#26c6a4',
  danger: '#e53935',
  border: 'rgba(0, 0, 0, 0.10)',
  borderStrong: 'rgba(0, 0, 0, 0.70)',
  borderDisabled: 'rgba(0, 0, 0, 0.30)',
  softSurface: '#f3f4f6',
  transparent: 'transparent',
  chipUnselectedBg: 'rgba(255, 255, 255, 0.72)',
  chipAccentBorder: 'rgba(142, 92, 255, 0.32)',
  chipSubtleText: 'rgba(0, 0, 0, 0.55)',
  chipSubtleBorder: 'rgba(0, 0, 0, 0.14)',

  fieldRadius: 16,
  fieldMinHeight: 56,
  fieldPaddingX: 14,
  fieldPaddingY: 10,
  fieldLabelSize: 12,
  fieldTextSize: 15,
  fieldIconSize: 20,
  fieldIndicatorWidth: 1.5,

  primaryButtonHeight: 56,
  primaryButtonRadius: 16,
  primaryButtonPaddingX: 18,
  primaryButtonPaddingY: 12,
  primaryButtonFontSize: 16,
  primaryButtonPressedScale: 0.965,
  primaryButtonElevation: '0 6px 14px rgba(0, 0, 0, 0.16)',
  primaryButtonPressedElevation: '0 2px 6px rgba(0, 0, 0, 0.10)',
  primaryButtonDisabledBg: 'rgba(0, 0, 0, 0.10)',
  primaryButtonDisabledText: 'rgba(0, 0, 0, 0.45)',

  pillHeight: 34,
  pillRadius: 999,
  pillPaddingX: 12,
  pillPaddingY: 6,
  pillFontSize: 14,
  pillBorderWidth: 1.5,
  pillPressedScale: 0.965,

  controlPillPaddingX: 12,
  controlPillPaddingY: 6,
  controlPillBorderWidth: 1,

  inlineTabHeight: 36,
  inlineTabRadius: 10,
  inlineTabPaddingX: 12,
  inlineTabPaddingY: 6,
  inlineTabSelectedColor: '#fe9595',
  inlineTabUnselectedColor: 'rgba(0, 0, 0, 0.55)',
  inlineTabSelectedWeight: 600,
  inlineTabUnselectedWeight: 500,

  checkboxSize: 24,
  checkboxRadius: 8,
  checkboxCheckedColor: '#26c6a4',
  checkboxUncheckedColor: 'rgba(0, 0, 0, 0.35)',
  checkboxCheckmarkColor: '#ffffff',
  checkboxPressedScale: 0.965,

  toggleWidth: 48,
  toggleHeight: 28,
  toggleThumbSize: 22,
  toggleThumbInset: 3,
  toggleCheckedTrackColor: '#26c6a4',
  toggleCheckedThumbColor: '#ffffff',
  toggleUncheckedTrackColor: '#e4e5f0',
  toggleUncheckedThumbColor: '#cdd0e0',
  toggleLabelColor: '#000000',
  toggleDisabledOpacity: 0.55,

  dialogRadius: 24,
  dialogPadding: 24,
  dialogWidth: 340,
  dialogBackdropColor: 'rgba(0, 0, 0, 0.42)',
  dialogContainerColor: '#ffffff',
  dialogContentColor: 'rgba(0, 0, 0, 0.80)',
  dialogTitleColor: '#000000',
  dialogMessageColor: 'rgba(0, 0, 0, 0.70)',
  dialogSecondaryActionColor: 'rgba(0, 0, 0, 0.60)',
  dialogPrimaryActionColor: '#31d5b4',
  dialogDisabledActionColor: 'rgba(0, 0, 0, 0.30)',
  dialogDestructiveActionColor: '#e53935',
  dialogElevation: '0 10px 28px rgba(0, 0, 0, 0.22)',
  dialogTitleSize: 22,
  dialogTitleLineHeight: 1.2,
  dialogMessageSize: 14,
  dialogMessageLineHeight: 1.45,
  dialogButtonHeight: 40,
  dialogButtonPaddingX: 12,
  dialogButtonRadius: 999,

  emptyVerticalPadding: 32,
  emptyGap: 4,
  emptyTitleSize: 14,
  emptyTitleLineHeight: 1.35,
  emptyTitleWeight: 400,
  emptyMessageSize: 12,
  emptyMessageLineHeight: 1.35,
  emptyMessageWeight: 400,
  emptyTextColor: 'rgba(0, 0, 0, 0.70)',

  noMorePaddingTop: 16,
  noMorePaddingBottom: 24,
  noMoreTextSize: 12,
  noMoreLineHeight: 1.35,
  noMoreTextColor: 'rgba(0, 0, 0, 0.45)',

  snackbarRadius: 16,
  snackbarPaddingX: 16,
  snackbarPaddingY: 14,
  snackbarBottomOffset: 64,
  snackbarShadow: '0 1px 3px rgba(0, 0, 0, 0.18)',
  snackbarBg: '#ffffff',
  snackbarTextColor: '#111827',
  snackbarTextSize: 14,
  snackbarTextLineHeight: 1.35,

  syncBannerRadius: 16,
  syncBannerOuterPaddingX: 12,
  syncBannerOuterPaddingY: 10,
  syncBannerInnerPaddingX: 12,
  syncBannerInnerPaddingY: 10,
  syncBannerElevation: '0 6px 14px rgba(0, 0, 0, 0.12)',
  syncBannerBg: '#ffffff',
  syncBannerTextColor: '#111827',
  syncBannerActionColor: '#31d5b4',
  syncBannerTextSize: 14,
  syncBannerTextLineHeight: 1.35
} as const

const apkTopSearchOuterStyle: React.CSSProperties = {
  width: '100%',
  padding: `calc(${APK_HOME_NAV_UI.topBarTopPadding}px + env(safe-area-inset-top)) ${APK_HOME_NAV_UI.topBarHorizontalPadding}px ${APK_HOME_NAV_UI.topBarBottomPadding}px`,
  display: 'grid',
  background: APK_SHELL_UI.pageBg,
  boxSizing: 'border-box'
}

const apkTopSearchBarStyle: React.CSSProperties = {
  width: '100%',
  height: APK_HOME_NAV_UI.topBannerHeight,
  borderRadius: APK_HOME_NAV_UI.topBannerRadius,
  display: 'grid',
  alignItems: 'center',
  color: APK_HOME_NAV_UI.searchTextColor,
  background: `linear-gradient(135deg, ${APK_HOME_NAV_UI.topBannerGradientTop}, ${APK_HOME_NAV_UI.topBannerGradientBottom})`,
  boxShadow: 'none',
  overflow: 'hidden',
  boxSizing: 'border-box'
}

const apkTopSearchInnerRowStyle: React.CSSProperties = {
  width: '100%',
  padding: `${APK_HOME_NAV_UI.topBannerInnerPaddingY}px ${APK_HOME_NAV_UI.topBannerInnerPaddingX}px`,
  display: 'grid',
  gridTemplateColumns: `minmax(0, 1fr) ${APK_HOME_NAV_UI.profileButtonSize}px`,
  gap: 8,
  alignItems: 'center',
  boxSizing: 'border-box'
}

const apkTopSearchInputWrapStyle: React.CSSProperties = {
  minWidth: 0,
  height: APK_HOME_NAV_UI.searchBarHeight,
  display: 'grid',
  gridTemplateColumns: `${APK_HOME_NAV_UI.searchIconSize}px ${APK_HOME_NAV_UI.searchTextStartSpacing}px minmax(0, 1fr)`,
  alignItems: 'center'
}

const apkTopSearchIconStyle: React.CSSProperties = {
  width: APK_HOME_NAV_UI.searchIconSize,
  height: APK_HOME_NAV_UI.searchIconSize,
  display: 'grid',
  placeItems: 'center',
  color: APK_HOME_NAV_UI.searchTextColor,
  fontSize: APK_HOME_NAV_UI.searchIconSize,
  lineHeight: 1,
  fontWeight: 800
}

const apkTopSearchInputStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  height: '100%',
  border: 0,
  outline: 0,
  color: APK_HOME_NAV_UI.searchTextColor,
  background: 'transparent',
  fontSize: APK_HOME_NAV_UI.searchFontSize,
  lineHeight: `${APK_HOME_NAV_UI.searchFontSize}px`,
  fontWeight: 500
}

const apkTopSearchFilterButtonStyle: React.CSSProperties = {
  height: APK_HOME_NAV_UI.profileButtonSize,
  minWidth: 54,
  border: 0,
  borderRadius: 999,
  padding: '0 12px',
  display: 'inline-grid',
  placeItems: 'center',
  color: APK_HOME_NAV_UI.searchTextColor,
  background: APK_HOME_NAV_UI.profileButtonBg,
  boxShadow: 'none',
  fontSize: 12,
  lineHeight: 1,
  fontWeight: 800,
  whiteSpace: 'nowrap'
}

const apkTopSearchRoundButtonStyle: React.CSSProperties = {
  width: APK_HOME_NAV_UI.profileButtonSize,
  minWidth: APK_HOME_NAV_UI.profileButtonSize,
  height: APK_HOME_NAV_UI.profileButtonSize,
  border: 0,
  borderRadius: 999,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  color: APK_HOME_NAV_UI.searchTextColor,
  background: APK_HOME_NAV_UI.profileButtonBg,
  boxShadow: 'none',
  fontSize: APK_HOME_NAV_UI.profileIconSize,
  lineHeight: 1,
  fontWeight: 500,
  boxSizing: 'border-box'
}

function NdjcSearchOutlinedIcon() {
  return (
    <svg
      width={APK_HOME_NAV_UI.searchIconSize}
      height={APK_HOME_NAV_UI.searchIconSize}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.5 3C5.91 3 3 5.91 3 9.5S5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57L19.29 20 20.7 18.59l-5.56-5.56A6.47 6.47 0 0 0 16 9.5C16 5.91 13.09 3 9.5 3Zm0 2C11.99 5 14 7.01 14 9.5S11.99 14 9.5 14 5 11.99 5 9.5 7.01 5 9.5 5Z" />
    </svg>
  )
}

function NdjcAccountCircleOutlinedIcon() {
  return (
    <svg
      width={APK_HOME_NAV_UI.profileIconSize}
      height={APK_HOME_NAV_UI.profileIconSize}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3Zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22Z" />
    </svg>
  )
}

function NdjcStorefrontIcon({ filled = false }: { filled?: boolean }) {
  if (filled) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.9 8.89 20.85 4.17C20.65 3.49 20.06 3 19.36 3H4.64c-.7 0-1.29.49-1.49 1.17L2.1 8.89c-.25 1.12.01 2.28.7 3.17V20c0 .55.45 1 1 1h16.4c.55 0 1-.45 1-1v-7.94c.69-.89.95-2.05.7-3.17ZM12 10c0 1.1-.9 2-2 2s-2-.9-2-2h4Zm4 0c0 1.1-.9 2-2 2s-2-.9-2-2h4Zm-8 0c0 1.1-.9 2-2 2s-2-.9-2-2h4Zm12 0c0 1.1-.9 2-2 2s-2-.9-2-2h4ZM5 19v-6.03c.34.03.67.03 1 0 .77 0 1.48-.26 2-.69.52.43 1.23.69 2 .69s1.48-.26 2-.69c.52.43 1.23.69 2 .69s1.48-.26 2-.69c.52.43 1.23.69 2 .69.33.03.66.03 1 0V19H5Z" />
      </svg>
    )
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.9 8.89 20.85 4.17C20.65 3.49 20.06 3 19.36 3H4.64c-.7 0-1.29.49-1.49 1.17L2.1 8.89c-.25 1.12.01 2.28.7 3.17V20c0 .55.45 1 1 1h16.4c.55 0 1-.45 1-1v-7.94c.69-.89.95-2.05.7-3.17ZM4.64 5h14.72l.89 4H3.75l.89-4ZM20 11.22c-.45.49-1.08.78-1.75.78-1.18 0-2.16-.84-2.25-2h-2c-.09 1.16-1.07 2-2.25 2s-2.16-.84-2.25-2h-2c-.09 1.16-1.07 2-2.25 2-.67 0-1.3-.29-1.75-.78V19h16v-7.78Z" />
    </svg>
  )
}

function NdjcChatBubbleIcon({ filled = false }: { filled?: boolean }) {
  if (filled) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Z" />
      </svg>
    )
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm0 14H5.17L4 17.17V4h16v12Z" />
    </svg>
  )
}

function NdjcBookingsIcon({ filled = false }: { filled?: boolean }) {
  if (filled) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm-7.71 14.29L7.7 13.7l1.41-1.41 2.18 2.18 5.59-5.59 1.41 1.41-7 7Z" />
      </svg>
    )
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17 10H7v2h10v-2Zm2-7h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm0 16H5V8h14v11ZM5 6V5h14v1H5Zm12 8H7v2h10v-2Z" />
    </svg>
  )
}

function NdjcNotificationsIcon({ filled = false }: { filled?: boolean }) {
  if (filled) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2Zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2Z" />
      </svg>
    )
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2Zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2Zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6Z" />
    </svg>
  )
}

function NdjcBookmarkIcon({ filled = false }: { filled?: boolean }) {
  if (filled) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2Z" />
      </svg>
    )
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2Zm0 15-5-2.18L7 18V5h10v13Z" />
    </svg>
  )
}

const apkBottomBarStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 100,
  pointerEvents: 'auto',
  width: '100%',
  minHeight: `calc(${APK_HOME_NAV_UI.bottomBarHeight}px + env(safe-area-inset-bottom))`,
  padding: '0 0 env(safe-area-inset-bottom)',
  display: 'grid',
  gridTemplateRows: `1px ${APK_HOME_NAV_UI.bottomBarHeight}px`,
  background: APK_HOME_NAV_UI.bottomBarBg,
  borderTop: 0,
  borderRadius: 0,
  boxShadow: 'none',
  boxSizing: 'border-box',
  overflow: 'hidden'
}

const apkBottomBarDividerStyle: React.CSSProperties = {
  width: '100%',
  height: 1,
  background: APK_HOME_NAV_UI.bottomBarDividerColor
}

const apkBottomBarRowStyle: React.CSSProperties = {
  width: '100%',
  height: APK_HOME_NAV_UI.bottomBarHeight,
  padding: `0 ${APK_HOME_NAV_UI.bottomBarPaddingX}px`,
  display: 'grid',
  gridTemplateColumns: 'repeat(var(--ndjc-bottom-tab-count, 5), minmax(0, 1fr))',
  gap: 0,
  alignItems: 'center',
  boxSizing: 'border-box'
}

function apkBottomTabStyle(active?: boolean): React.CSSProperties {
  return {
    position: 'relative',
    width: '100%',
    height: APK_HOME_NAV_UI.bottomBarHeight,
    minHeight: APK_HOME_NAV_UI.bottomBarHeight,
    border: 0,
    borderRadius: APK_HOME_NAV_UI.bottomTabRadius,
    padding: `${APK_HOME_NAV_UI.bottomTabPaddingY}px ${APK_HOME_NAV_UI.bottomTabPaddingX}px`,
    display: 'grid',
    gridTemplateRows: `${APK_HOME_NAV_UI.bottomTabIconSize}px auto`,
    placeItems: 'center',
    alignContent: 'center',
    gap: APK_HOME_NAV_UI.bottomTabIconLabelGap,
    color: active ? APK_HOME_NAV_UI.bottomTabActiveColor : APK_HOME_NAV_UI.bottomTabInactiveColor,
    background: 'transparent',
    boxShadow: 'none',
    fontSize: 12,
    lineHeight: 1,
    fontWeight: active ? 600 : 500
  }
}

const apkBottomTabIconBoxStyle: React.CSSProperties = {
  position: 'relative',
  width: APK_HOME_NAV_UI.bottomTabIconSize,
  height: APK_HOME_NAV_UI.bottomTabIconSize,
  display: 'grid',
  placeItems: 'center',
  color: 'currentColor'
}

const apkBottomTabIconStyle: React.CSSProperties = {
  width: APK_HOME_NAV_UI.bottomTabIconSize,
  height: APK_HOME_NAV_UI.bottomTabIconSize,
  display: 'grid',
  placeItems: 'center',
  color: 'currentColor',
  fontSize: APK_HOME_NAV_UI.bottomTabIconSize,
  lineHeight: 1,
  fontWeight: 700
}

const apkBottomTabDotStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  right: -APK_HOME_NAV_UI.bottomTabDotOffsetX,
  width: APK_HOME_NAV_UI.bottomTabDotSize,
  height: APK_HOME_NAV_UI.bottomTabDotSize,
  borderRadius: 999,
  background: APK_HOME_NAV_UI.bottomTabDotColor
}

const apkBottomTabLabelStyle: React.CSSProperties = {
  maxWidth: '100%',
  color: 'currentColor',
  fontSize: APK_HOME_NAV_UI.bottomTabLabelSize,
  lineHeight: `${APK_HOME_NAV_UI.bottomTabLabelSize}px`,
  fontWeight: 'inherit',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

function apkPrimaryButtonStyle(
  disabled?: boolean,
  isLoading?: boolean,
  pressed?: boolean
): React.CSSProperties {
  const enabled = !disabled && !isLoading
  const isPressed = Boolean(pressed && enabled)

  return {
    width: '100%',
    minHeight: APK_CORE_UI.primaryButtonHeight,
    border: 0,
    borderRadius: APK_CORE_UI.primaryButtonRadius,
    padding: `${APK_CORE_UI.primaryButtonPaddingY}px ${APK_CORE_UI.primaryButtonPaddingX}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: enabled ? APK_CORE_UI.white : APK_CORE_UI.primaryButtonDisabledText,
    background: enabled ? APK_HOME_NAV_UI.topBannerGradientBottom : APK_CORE_UI.primaryButtonDisabledBg,
    backgroundClip: 'padding-box',
    boxShadow: enabled
      ? isPressed
        ? APK_CORE_UI.primaryButtonPressedElevation
        : APK_CORE_UI.primaryButtonElevation
      : 'none',
    fontSize: APK_CORE_UI.primaryButtonFontSize,
    lineHeight: 1,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    transform: isPressed
      ? `scale(${APK_CORE_UI.primaryButtonPressedScale})`
      : 'scale(1)',
    transformOrigin: 'center center',
    transition: 'transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease',
    willChange: enabled ? 'transform' : undefined,
    opacity: isLoading ? 0.86 : 1,
    cursor: enabled ? 'pointer' : 'not-allowed',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    touchAction: 'manipulation'
  }
}

function apkPillButtonStyle(selected?: boolean, disabled?: boolean): React.CSSProperties {
  return {
    height: APK_CORE_UI.pillHeight,
    minHeight: APK_CORE_UI.pillHeight,
    flex: '0 0 auto',
    maxWidth: 'none',
    border: `${selected ? 0 : APK_CORE_UI.pillBorderWidth}px solid ${APK_CORE_UI.border}`,
    borderRadius: APK_CORE_UI.pillRadius,
    padding: `0 ${APK_CORE_UI.pillPaddingX}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    color: selected ? APK_CORE_UI.white : APK_CORE_UI.black,
    background: selected ? APK_CORE_UI.brand : APK_CORE_UI.chipUnselectedBg,
    boxShadow: 'none',
    fontSize: APK_CORE_UI.pillFontSize,
    lineHeight: 1,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: disabled ? 0.55 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxSizing: 'border-box',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    ['--ndjc-pill-pressed-scale' as string]: String(APK_FILTER_UI.chipPressedScale)
  } as React.CSSProperties
}

function apkControlPillButtonStyle(
  active?: boolean,
  disabled?: boolean,
  tone: 'normal' | 'accent' | 'subtle' = 'normal'
): React.CSSProperties {
  const selected = Boolean(active)

  const normal = {
    bg: selected ? APK_CORE_UI.brand : APK_CORE_UI.chipUnselectedBg,
    border: selected ? APK_CORE_UI.brand : APK_CORE_UI.border,
    text: selected ? APK_CORE_UI.white : APK_CORE_UI.black,
    borderWidth: selected ? 0 : APK_CORE_UI.controlPillBorderWidth
  }

  const accent = {
    bg: selected ? APK_CORE_UI.brand : APK_CORE_UI.transparent,
    border: selected ? APK_CORE_UI.brand : APK_CORE_UI.chipAccentBorder,
    text: selected ? APK_CORE_UI.white : APK_CORE_UI.brand,
    borderWidth: selected ? 0 : APK_CORE_UI.controlPillBorderWidth
  }

  const subtle = {
    bg: selected ? APK_CORE_UI.brand : APK_CORE_UI.transparent,
    border: selected ? APK_CORE_UI.brand : APK_CORE_UI.chipSubtleBorder,
    text: selected ? APK_CORE_UI.white : APK_CORE_UI.chipSubtleText,
    borderWidth: selected ? 0 : APK_CORE_UI.controlPillBorderWidth
  }

  const palette = tone === 'accent' ? accent : tone === 'subtle' ? subtle : normal

  return {
    minHeight: APK_CORE_UI.pillHeight,
    border: `${palette.borderWidth}px solid ${palette.border}`,
    borderRadius: APK_CORE_UI.pillRadius,
    padding: `${APK_CORE_UI.controlPillPaddingY}px ${APK_CORE_UI.controlPillPaddingX}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    color: palette.text,
    background: palette.bg,
    boxShadow: 'none',
    fontSize: APK_CORE_UI.pillFontSize,
    lineHeight: 1,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: disabled ? 0.55 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
  }
}

function apkInlineTabStyle(selected?: boolean): React.CSSProperties {
  return {
    minHeight: APK_CORE_UI.inlineTabHeight,
    border: 0,
    borderRadius: APK_CORE_UI.inlineTabRadius,
    padding: `${APK_CORE_UI.inlineTabPaddingY}px ${APK_CORE_UI.inlineTabPaddingX}px`,
    display: 'inline-grid',
    placeItems: 'center',
    color: selected ? APK_CORE_UI.inlineTabSelectedColor : APK_CORE_UI.inlineTabUnselectedColor,
    background: 'transparent',
    boxShadow: 'none',
    fontSize: 14,
    lineHeight: 1,
    fontWeight: selected ? APK_CORE_UI.inlineTabSelectedWeight : APK_CORE_UI.inlineTabUnselectedWeight,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer'
  }
}

const apkDialogBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 220,
  padding: 24,
  display: 'grid',
  placeItems: 'center',
  background: APK_CORE_UI.dialogBackdropColor
}

const apkDialogSurfaceStyle: React.CSSProperties = {
  width: `min(100%, ${APK_CORE_UI.dialogWidth}px)`,
  borderRadius: APK_CORE_UI.dialogRadius,
  padding: APK_CORE_UI.dialogPadding,
  display: 'grid',
  gap: 18,
  color: APK_CORE_UI.dialogContentColor,
  background: APK_CORE_UI.dialogContainerColor,
  boxShadow: APK_CORE_UI.dialogElevation
}

const apkDialogTitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CORE_UI.dialogTitleColor,
  fontSize: APK_CORE_UI.dialogTitleSize,
  lineHeight: APK_CORE_UI.dialogTitleLineHeight,
  fontWeight: 600
}

const apkDialogMessageStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CORE_UI.dialogMessageColor,
  fontSize: APK_CORE_UI.dialogMessageSize,
  lineHeight: APK_CORE_UI.dialogMessageLineHeight,
  fontWeight: 400
}

const apkDialogContentStyle: React.CSSProperties = {
  minWidth: 0,
  color: APK_CORE_UI.dialogContentColor,
  fontSize: APK_CORE_UI.dialogMessageSize,
  lineHeight: APK_CORE_UI.dialogMessageLineHeight,
  fontWeight: 400
}

function apkDialogTextButtonStyle({
  primary = false,
  destructive = false,
  disabled = false
}: {
  primary?: boolean
  destructive?: boolean
  disabled?: boolean
} = {}): React.CSSProperties {
  return {
    minHeight: APK_CORE_UI.dialogButtonHeight,
    border: 0,
    borderRadius: APK_CORE_UI.dialogButtonRadius,
    padding: `0 ${APK_CORE_UI.dialogButtonPaddingX}px`,
    display: 'inline-grid',
    placeItems: 'center',
    color: disabled
      ? APK_CORE_UI.dialogDisabledActionColor
      : destructive
        ? APK_CORE_UI.dialogDestructiveActionColor
        : primary
          ? APK_CORE_UI.dialogPrimaryActionColor
          : APK_CORE_UI.dialogSecondaryActionColor,
    background: 'transparent',
    boxShadow: 'none',
    fontSize: 14,
    lineHeight: 1,
    fontWeight: primary || destructive ? 600 : 500,
    whiteSpace: 'nowrap',
    cursor: disabled ? 'not-allowed' : 'pointer'
  }
}

const apkDialogActionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 8
}

const apkInlineEmptyStateRootStyle: React.CSSProperties = {
  width: '100%',
  padding: `${APK_CORE_UI.emptyVerticalPadding}px 0`,
  display: 'grid',
  placeItems: 'center',
  textAlign: 'center'
}

const apkInlineEmptyStateColumnStyle: React.CSSProperties = {
  display: 'grid',
  justifyItems: 'center',
  gap: APK_CORE_UI.emptyGap
}

const apkInlineEmptyStateTitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CORE_UI.emptyTextColor,
  fontSize: APK_CORE_UI.emptyTitleSize,
  lineHeight: APK_CORE_UI.emptyTitleLineHeight,
  fontWeight: APK_CORE_UI.emptyTitleWeight,
  textAlign: 'center'
}

const apkInlineEmptyStateMessageStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CORE_UI.emptyTextColor,
  fontSize: APK_CORE_UI.emptyMessageSize,
  lineHeight: APK_CORE_UI.emptyMessageLineHeight,
  fontWeight: APK_CORE_UI.emptyMessageWeight,
  textAlign: 'center'
}

const apkNoMoreListFooterStyle: React.CSSProperties = {
  width: '100%',
  padding: `${APK_CORE_UI.noMorePaddingTop}px 0 ${APK_CORE_UI.noMorePaddingBottom}px`,
  color: APK_CORE_UI.noMoreTextColor,
  fontSize: APK_CORE_UI.noMoreTextSize,
  lineHeight: APK_CORE_UI.noMoreLineHeight,
  fontWeight: 400,
  textAlign: 'center'
}

const apkSnackbarHostStyle: React.CSSProperties = {
  position: 'absolute',
  left: 16,
  right: 16,
  bottom: `calc(${APK_CORE_UI.snackbarBottomOffset}px + env(safe-area-inset-bottom))`,
  zIndex: 180,
  pointerEvents: 'none',
  boxSizing: 'border-box'
}

const apkSnackbarSurfaceStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  borderRadius: APK_CORE_UI.snackbarRadius,
  padding: `${APK_CORE_UI.snackbarPaddingY}px ${APK_CORE_UI.snackbarPaddingX}px`,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  alignItems: 'center',
  color: APK_CORE_UI.snackbarTextColor,
  background: APK_CORE_UI.snackbarBg,
  boxShadow: APK_CORE_UI.snackbarShadow,
  pointerEvents: 'auto',
  boxSizing: 'border-box',
  overflow: 'hidden'
}

const apkSnackbarTextStyle: React.CSSProperties = {
  margin: 0,
  minWidth: 0,
  color: APK_CORE_UI.snackbarTextColor,
  fontSize: APK_CORE_UI.snackbarTextSize,
  lineHeight: APK_CORE_UI.snackbarTextLineHeight,
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical'
}

const apkSyncErrorBannerOuterStyle: React.CSSProperties = {
  width: '100%',
  padding: `${APK_CORE_UI.syncBannerOuterPaddingY}px ${APK_CORE_UI.syncBannerOuterPaddingX}px`
}

const apkSyncErrorBannerSurfaceStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: APK_CORE_UI.syncBannerRadius,
  padding: `${APK_CORE_UI.syncBannerInnerPaddingY}px ${APK_CORE_UI.syncBannerInnerPaddingX}px`,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: APK_CORE_UI.syncBannerTextColor,
  background: APK_CORE_UI.syncBannerBg,
  boxShadow: APK_CORE_UI.syncBannerElevation
}

const apkSyncErrorBannerTextStyle: React.CSSProperties = {
  margin: 0,
  flex: '1 1 auto',
  minWidth: 0,
  color: APK_CORE_UI.syncBannerTextColor,
  fontSize: APK_CORE_UI.syncBannerTextSize,
  lineHeight: APK_CORE_UI.syncBannerTextLineHeight,
  fontWeight: 400,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical'
}

const apkSyncErrorBannerButtonStyle: React.CSSProperties = {
  minHeight: 36,
  border: 0,
  borderRadius: 999,
  padding: '0 8px',
  display: 'inline-grid',
  placeItems: 'center',
  color: APK_CORE_UI.syncBannerActionColor,
  background: 'transparent',
  boxShadow: 'none',
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 600,
  whiteSpace: 'nowrap'
}
const APK_CHAT_UI = {
  black: '#000000',
  white: '#ffffff',
  brand: '#c43f4d',
  green: '#0f766e',
  incomingBubble: '#f2f3f5',
  outgoingBubble: '#fe9595',
  surface: '#ffffff',
  softSurface: '#f2f4f7',
  unavailableSurface: '#f3f4f6',
  danger: '#d92d20',
  muted: '#4b5563',
  black45: 'rgba(0, 0, 0, 0.70)',
  black55: 'rgba(0, 0, 0, 0.72)',
  black65: 'rgba(0, 0, 0, 0.78)',
  black70: 'rgba(0, 0, 0, 0.82)',
  black75: 'rgba(0, 0, 0, 0.84)',
  black85: 'rgba(0, 0, 0, 0.88)',
  border08: 'rgba(0, 0, 0, 0.08)',
  border10: 'rgba(0, 0, 0, 0.10)',
  selectedBg: 'rgba(254, 149, 149, 0.14)',

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
  richBubbleDefaultBorder: '1px solid rgba(0, 0, 0, 0.18)',
  richBubbleSelectedBorder: '1px solid rgba(229, 57, 53, 0.55)',
  richBubbleFocusedBorder: '2px solid rgba(38, 198, 164, 0.90)',
  richBubbleMatchedBorder: '1px solid rgba(38, 198, 164, 0.35)',

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

const apkChatScreenStyle: React.CSSProperties = {
  minHeight: '100dvh',
  background: APK_CHAT_UI.pageBg
}

const apkConversationSurfaceStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: '100dvh',
  display: 'grid',
  gridTemplateRows: 'auto auto minmax(0, 1fr) auto',
  background: APK_CHAT_UI.pageBg,
  overflow: 'hidden'
}

const apkConversationTopBarStyle: React.CSSProperties = {
  minHeight: APK_CHAT_UI.headerHeight,
  padding: `calc(8px + env(safe-area-inset-top)) ${APK_CHAT_UI.headerPaddingX}px 8px`,
  display: 'grid',
  gridTemplateColumns: '50px minmax(0, 1fr) 50px',
  alignItems: 'center',
  gap: APK_CHAT_UI.headerGap,
  background: APK_CHAT_UI.pageBg
}

const apkConversationTitleBlockStyle: React.CSSProperties = {
  minWidth: 0,
  display: 'grid',
  gap: 2,
  textAlign: 'center'
}

const apkConversationTitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CHAT_UI.black,
  fontSize: 18,
  lineHeight: 1.2,
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

const apkConversationSubtitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CHAT_UI.black55,
  fontSize: 12,
  lineHeight: 1.2,
  fontWeight: 400,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

const apkConversationBodyStyle: React.CSSProperties = {
  minHeight: 0,
  padding: `${APK_CHAT_UI.bodyPaddingY}px ${APK_CHAT_UI.bodyPaddingX}px`,
  display: 'grid',
  alignContent: 'start',
  gap: APK_CHAT_UI.messageRowGap,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch'
}

const apkConversationFooterStyle: React.CSSProperties = {
  padding: `${APK_CHAT_UI.footerPaddingY}px ${APK_CHAT_UI.footerPaddingX}px calc(${APK_CHAT_UI.footerPaddingY}px + env(safe-area-inset-bottom))`,
  background: APK_CHAT_UI.pageBg
}

const apkConversationToolbarStyle: React.CSSProperties = {
  padding: `0 ${APK_CHAT_UI.bodyPaddingX}px 8px`,
  display: 'grid',
  gap: 8
}

const apkChatInputShellStyle: React.CSSProperties = {
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

const apkChatTextareaStyle: React.CSSProperties = {
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
  fontSize: 15,
  lineHeight: 1.35,
  fontWeight: 400,
  resize: 'none',
  overflowY: 'hidden',
  fontFamily: 'inherit',
  boxSizing: 'border-box'
}

function apkChatToolButtonStyle(disabled?: boolean): React.CSSProperties {
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
    background: disabled ? APK_CHAT_UI.softSurface : 'rgba(38, 198, 164, 0.12)',
    boxShadow: 'none',
    fontSize: 12,
    lineHeight: 1,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.58 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
  }
}

const apkChatPlusMenuStyle: React.CSSProperties = {
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

function apkChatPlusMenuItemStyle(disabled?: boolean): React.CSSProperties {
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

function apkChatMessageRowStyle(outgoing?: boolean, selected?: boolean, failed?: boolean): React.CSSProperties {
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

function apkChatMessageContentRowStyle(outgoing?: boolean): React.CSSProperties {
  return {
    width: '100%',
    minWidth: 0,
    display: 'flex',
    justifyContent: outgoing ? 'flex-end' : 'flex-start',
    alignItems: 'center'
  }
}

function apkChatRetryButtonStyle(): React.CSSProperties {
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

const apkChatRetryIconStyle: React.CSSProperties = {
  width: APK_CHAT_UI.retryIconSize + 2,
  height: APK_CHAT_UI.retryIconSize + 2,
  display: 'block',
  transformOrigin: '50% 50%',
  pointerEvents: 'none'
}
const NDJC_CHAT_RETRY_BUTTON_PREVIEW = true

function apkChatMessageStackStyle(outgoing?: boolean, failed?: boolean): React.CSSProperties {
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

function apkChatFailedBubbleRowStyle(): React.CSSProperties {
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

function apkChatBubbleOnlyStackStyle(outgoing?: boolean, richBubble?: boolean): React.CSSProperties {
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

function apkChatRichRetryBubbleHostStyle(): React.CSSProperties {
  return {
    position: 'relative',
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    display: 'block',
    boxSizing: 'border-box'
  }
}

function apkChatRichRetryButtonOverlayStyle(): React.CSSProperties {
  return {
    position: 'absolute',
    left: -(APK_CHAT_UI.retryButtonSize + APK_CHAT_UI.retryButtonGap),
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2
  }
}

type NdjcChatMessageMenuPlacement = 'above' | 'below'

function apkChatMessageMenuStyle(
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

function apkChatMessageMenuItemStyle(danger = false): React.CSSProperties {
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

function apkChatTextBubbleStyle(
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
  border,
  borderRadius: outgoing
    ? `${APK_CHAT_UI.textBubbleRadius}px ${APK_CHAT_UI.textBubbleTightRadius}px ${APK_CHAT_UI.textBubbleRadius}px ${APK_CHAT_UI.textBubbleRadius}px`
    : `${APK_CHAT_UI.textBubbleTightRadius}px ${APK_CHAT_UI.textBubbleRadius}px ${APK_CHAT_UI.textBubbleRadius}px ${APK_CHAT_UI.textBubbleRadius}px`,
  padding: APK_CHAT_UI.richBubblePadding,
  color: APK_CHAT_UI.black,
  background: outgoing ? APK_CHAT_UI.outgoingBubble : APK_CHAT_UI.incomingBubble,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  boxSizing: 'border-box'
}
}

const apkChatTextStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CHAT_UI.black,
  fontSize: 15,
  lineHeight: 1.42,
  fontWeight: 400,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word'
}

const apkChatTimeTextStyle: React.CSSProperties = {
  color: APK_CHAT_UI.black55,
  fontSize: 11,
  lineHeight: 1.2,
  fontWeight: 400
}

const apkChatImageButtonBaseStyle: React.CSSProperties = {
  border: 0,
  borderRadius: APK_CHAT_UI.imageRadius,
  padding: 0,
  display: 'block',
  overflow: 'hidden',
  background: APK_CHAT_UI.softSurface,
  boxShadow: 'none',
  cursor: 'pointer'
}

const apkProductBubbleStyle: React.CSSProperties = {
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
const apkChatProductCardShellStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  borderRadius: APK_CHAT_UI.productRadius,
  display: 'block',
  overflow: 'hidden',
  boxSizing: 'border-box'
}

const apkPendingProductBarStyle: React.CSSProperties = {
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

const apkPendingProductSideBarStyle: React.CSSProperties = {
  width: 3,
  minWidth: 3,
  alignSelf: 'stretch',
  minHeight: 24,
  borderRadius: 999,
  background: 'rgba(0, 0, 0, 0.18)'
}

const apkPendingProductActionColumnStyle: React.CSSProperties = {
  width: 32,
  minWidth: 32,
  display: 'grid',
  gridAutoRows: '32px',
  gap: 6,
  justifyItems: 'center',
  alignItems: 'center'
}

function apkPendingProductIconButtonStyle(kind: 'close' | 'send'): React.CSSProperties {
  return {
    width: 32,
    height: 32,
    border: 0,
    borderRadius: 999,
    padding: 0,
    display: 'grid',
    placeItems: 'center',
    color: kind === 'send' ? APK_CHAT_UI.brand : 'rgba(0, 0, 0, 0.60)',
    background: 'transparent',
    boxShadow: 'none',
    fontSize: 0,
    lineHeight: 1,
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent'
  }
}
const apkPendingProductPreviewCardStyle: React.CSSProperties = {
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
const apkQuotedProductBarStyle: React.CSSProperties = {
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

function apkChatQuoteBlockStyle(): React.CSSProperties {
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

const apkChatQuoteBlockRailStyle: React.CSSProperties = {
  width: APK_CHAT_UI.quotedBarBorderWidth,
  minWidth: APK_CHAT_UI.quotedBarBorderWidth,
  borderRadius: APK_CHAT_UI.quotedBarRadius,
  background: APK_CHAT_UI.green
}

let ndjcChatMeasureCanvasContext: CanvasRenderingContext2D | null = null

function getNdjcChatMeasureContext(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null

  if (ndjcChatMeasureCanvasContext) return ndjcChatMeasureCanvasContext

  const canvas = document.createElement('canvas')
  ndjcChatMeasureCanvasContext = canvas.getContext('2d')

  return ndjcChatMeasureCanvasContext
}

function getApkChatViewportWidthPx(): number {
  if (typeof window === 'undefined') return 0

  const visualViewportWidth = Math.floor(window.visualViewport?.width || 0)
  if (visualViewportWidth > 0) return visualViewportWidth

  return Math.floor(window.innerWidth || 0)
}

function measureChatTextWidthPx(text: string, font: string, maxWidthPx: number): number {
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

function computeApkChatTextQuoteContentWidthPx(input: {
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

function apkChatRichBubbleFrameStyle(input: {
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
    border,
    borderRadius: bubbleShape,
    padding: APK_CHAT_UI.richBubblePadding,
    display: 'block',
    color: APK_CHAT_UI.black,
    background: input.outgoing ? APK_CHAT_UI.outgoingBubble : APK_CHAT_UI.incomingBubble,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    boxSizing: 'border-box',
    overflow: 'hidden'
  }
}

const apkChatFindBarStyle: React.CSSProperties = {
  borderRadius: APK_CHAT_UI.findBarRadius,
  padding: APK_CHAT_UI.findBarPadding,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto auto auto',
  gap: APK_CHAT_UI.findBarGap,
  alignItems: 'center',
  background: APK_CHAT_UI.surface,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
}

const apkMerchantThreadRowStyle: React.CSSProperties = {
  borderRadius: APK_CHAT_UI.merchantRowRadius,
  padding: APK_CHAT_UI.merchantRowPadding,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: 10,
  alignItems: 'center',
  background: APK_CHAT_UI.surface,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
}

const APK_SHOWCASE_ITEM_UI = {
  black: '#000000',
  white: '#ffffff',
  ink: '#111827',
  ink2: '#374151',
  muted: '#4b5563',
  brand: '#c43f4d',
  green: '#0f766e',
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
  catalogCardPadding: 10,
  catalogGap: 10,
  catalogImageSize: 92,
  catalogImageRadius: 12,
  catalogTitleSize: 25,
  catalogTitleLineHeight: '30px',
  catalogTitleWeight: 700,
  catalogCategorySize: 12,
  catalogCategoryLineHeight: '16px',
  catalogCategoryWeight: 600,
  catalogPriceSize: 18,
  catalogPriceLineHeight: '22px',
  catalogPriceWeight: 550,
  catalogOriginalSize: 12,
  catalogOriginalLineHeight: '16px',
  catalogOriginalWeight: 600,
  catalogPriceGap: 6,
  catalogChipPaddingX: 10,
  catalogChipPaddingY: 6,
  catalogPressedScale: 0.965,
  catalogPressedShadow: '0 2px 2px rgba(0, 0, 0, 0.10)',
  catalogTransitionMs: 120,
  adminItemsListGap: 6,
  adminItemsHeaderToListGap: 38,

  shadow: '0 2px 6px rgba(0, 0, 0, 0.10)',
  selectedOutline: '1.5px solid rgba(254, 149, 149, 0.62)'
} as const

const APK_ANNOUNCEMENT_UI = {
  black: '#000000',
  white: '#ffffff',
  ink: '#111827',
  ink2: '#374151',
  muted: '#4b5563',
  brand: '#c43f4d',
  green: '#0f766e',
  card: '#ffffff',
  softSurface: '#f2f4f7',
  divider: 'rgba(0, 0, 0, 0.04)',
  selectedOutline: '1.5px solid rgba(254, 149, 149, 0.62)',

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

function apkHomeMediaCardStyle(pressed = false): React.CSSProperties {
  return {
    width: '100%',
    minHeight: APK_SHOWCASE_ITEM_UI.homeCardHeight,
    borderRadius: APK_SHOWCASE_ITEM_UI.homeCardRadius,
    padding: APK_SHOWCASE_ITEM_UI.homeCardPadding,
    display: 'block',
    background: APK_SHOWCASE_ITEM_UI.transparent,
    boxShadow: pressed ? APK_SHOWCASE_ITEM_UI.homePressedShadow : APK_SHOWCASE_ITEM_UI.homeShadow,
    overflow: 'hidden',
    transform: pressed ? `scale(${APK_SHOWCASE_ITEM_UI.homePressedScale})` : 'scale(1)',
    transformOrigin: 'center center',
    transition: 'transform 120ms ease, box-shadow 120ms ease'
  }
}

function apkHomeMediaCardButtonStyle(disabled = false): React.CSSProperties {
  return {
    width: '100%',
    minHeight: APK_SHOWCASE_ITEM_UI.homeCardHeight,
    border: 0,
    borderRadius: APK_SHOWCASE_ITEM_UI.homeCardRadius,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    color: APK_SHOWCASE_ITEM_UI.black,
    background: APK_SHOWCASE_ITEM_UI.transparent,
    boxShadow: 'none',
    overflow: 'hidden',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? APK_SHOWCASE_ITEM_UI.disabledAlpha : 1,
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  }
}

const apkHomeMediaImageWrapStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: APK_SHOWCASE_ITEM_UI.homeImageAspectRatio,
  borderRadius: 0,
  overflow: 'hidden',
  background: APK_SHOWCASE_ITEM_UI.homeImageBg,
  flex: '0 0 auto'
}

const apkHomeMediaBodyStyle: React.CSSProperties = {
  minWidth: 0,
  minHeight: APK_SHOWCASE_ITEM_UI.homeCardBottomMinHeight,
  flex: '1 1 auto',
  padding: `${APK_SHOWCASE_ITEM_UI.homeContentPaddingTop}px ${APK_SHOWCASE_ITEM_UI.homeContentPaddingEnd}px ${APK_SHOWCASE_ITEM_UI.homeContentPaddingBottom}px ${APK_SHOWCASE_ITEM_UI.homeContentPaddingStart}px`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 0,
  background: APK_SHOWCASE_ITEM_UI.homeBottomBg
}

const apkHomeMediaTitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_SHOWCASE_ITEM_UI.black,
  fontSize: APK_SHOWCASE_ITEM_UI.homeTitleSize,
  lineHeight: APK_SHOWCASE_ITEM_UI.homeTitleLineHeight,
  fontWeight: APK_SHOWCASE_ITEM_UI.homeTitleWeight,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}

const apkHomePriceRowStyle: React.CSSProperties = {
  minWidth: 0,
  display: 'flex',
  alignItems: 'baseline',
  gap: APK_SHOWCASE_ITEM_UI.homePriceGap
}

function apkHomePrimaryPriceStyle(style?: React.CSSProperties): React.CSSProperties {
  return {
    color: APK_SHOWCASE_ITEM_UI.black,
    fontSize: APK_SHOWCASE_ITEM_UI.homePriceSize,
    lineHeight: APK_SHOWCASE_ITEM_UI.homePriceLineHeight,
    fontWeight: APK_SHOWCASE_ITEM_UI.homePriceWeight,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    ...style
  }
}

const apkHomeSecondaryPriceStyle: React.CSSProperties = {
  color: `rgba(0, 0, 0, ${APK_SHOWCASE_ITEM_UI.homeOriginalAlpha})`,
  fontSize: APK_SHOWCASE_ITEM_UI.homeOriginalSize,
  lineHeight: APK_SHOWCASE_ITEM_UI.homeOriginalLineHeight,
  fontWeight: APK_SHOWCASE_ITEM_UI.homeOriginalWeight,
  textDecoration: 'line-through',
  textDecorationThickness: 1.5,
  textDecorationColor: `rgba(0, 0, 0, ${APK_SHOWCASE_ITEM_UI.homeOriginalAlpha})`,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

const apkHomeBadgeStyle: React.CSSProperties = apkPickBadgeStyle

const apkHomeBadgeTextStyle: React.CSSProperties = apkPickBadgeTextStyle
const apkHomeFavoriteOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: APK_SHOWCASE_ITEM_UI.homeFavoriteTop,
  right: APK_SHOWCASE_ITEM_UI.homeFavoriteRight,
  width: APK_SHOWCASE_ITEM_UI.homeFavoriteSize,
  height: APK_SHOWCASE_ITEM_UI.homeFavoriteSize,
  display: 'grid',
  placeItems: 'center'
}

const apkHomeFavoriteIconStyle: React.CSSProperties = {
  width: APK_SHOWCASE_ITEM_UI.homeFavoriteSize,
  height: APK_SHOWCASE_ITEM_UI.homeFavoriteSize,
  display: 'block',
  color: APK_SHOWCASE_ITEM_UI.brand,
  background: APK_SHOWCASE_ITEM_UI.transparent,
  lineHeight: 1,
  flex: '0 0 auto'
}

function apkCatalogCardStyle(pressed = false): React.CSSProperties {
  return {
    width: '100%',
    minHeight: APK_SHOWCASE_ITEM_UI.catalogImageSize + APK_SHOWCASE_ITEM_UI.catalogCardPadding * 2,
    borderRadius: APK_SHOWCASE_ITEM_UI.catalogCardRadius,
    padding: APK_SHOWCASE_ITEM_UI.catalogCardPadding,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto auto',
    gap: APK_SHOWCASE_ITEM_UI.catalogGap,
    alignItems: 'center',
    background: APK_SHOWCASE_ITEM_UI.white,
    boxShadow: pressed ? APK_SHOWCASE_ITEM_UI.catalogPressedShadow : APK_SHOWCASE_ITEM_UI.shadow,
    overflow: 'visible',
    boxSizing: 'border-box',
    transform: pressed ? `scale(${APK_SHOWCASE_ITEM_UI.catalogPressedScale})` : 'scale(1)',
    transformOrigin: 'center center',
    transition: `transform ${APK_SHOWCASE_ITEM_UI.catalogTransitionMs}ms ease, box-shadow ${APK_SHOWCASE_ITEM_UI.catalogTransitionMs}ms ease`
  }
}

const apkCatalogMainButtonStyle: React.CSSProperties = {
  minWidth: 0,
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
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation'
}

const apkCatalogMediaStyle: React.CSSProperties = {
  width: APK_SHOWCASE_ITEM_UI.catalogImageSize,
  height: APK_SHOWCASE_ITEM_UI.catalogImageSize,
  minWidth: APK_SHOWCASE_ITEM_UI.catalogImageSize,
  minHeight: APK_SHOWCASE_ITEM_UI.catalogImageSize,
  borderRadius: APK_SHOWCASE_ITEM_UI.catalogImageRadius,
  display: 'block',
  overflow: 'hidden',
  background: APK_MEDIA_UI.imagePlaceholderBg,
  flex: '0 0 auto'
}

const apkCatalogBodyStyle: React.CSSProperties = {
  minWidth: 0,
  minHeight: APK_SHOWCASE_ITEM_UI.catalogImageSize,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  gap: 0,
  overflow: 'visible'
}

const apkCatalogTitleStyle: React.CSSProperties = {
  margin: 0,
  color: APK_SHOWCASE_ITEM_UI.ink,
  fontSize: APK_SHOWCASE_ITEM_UI.catalogTitleSize,
  lineHeight: APK_SHOWCASE_ITEM_UI.catalogTitleLineHeight,
  fontWeight: APK_SHOWCASE_ITEM_UI.catalogTitleWeight,
  letterSpacing: '-0.01em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'block'
}

const apkCatalogSpacerStyle: React.CSSProperties = {
  flex: '1 1 auto',
  minHeight: 0
}

const apkCatalogPriceStackStyle: React.CSSProperties = {
  minWidth: 0,
  display: 'grid',
  gap: 6,
  alignItems: 'end',
  overflow: 'visible'
}

const apkCatalogPriceRowStyle: React.CSSProperties = {
  minWidth: 0,
  display: 'flex',
  alignItems: 'baseline',
  gap: APK_SHOWCASE_ITEM_UI.catalogPriceGap
}

const apkCatalogPriceStyle: React.CSSProperties = {
  color: APK_SHOWCASE_ITEM_UI.brand,
  fontSize: APK_SHOWCASE_ITEM_UI.catalogPriceSize,
  lineHeight: APK_SHOWCASE_ITEM_UI.catalogPriceLineHeight,
  fontWeight: APK_SHOWCASE_ITEM_UI.catalogPriceWeight,
  whiteSpace: 'nowrap'
}

const apkCatalogOriginalPriceStyle: React.CSSProperties = {
  color: 'rgba(17, 24, 39, 0.72)',
  fontSize: APK_SHOWCASE_ITEM_UI.catalogOriginalSize,
  lineHeight: APK_SHOWCASE_ITEM_UI.catalogOriginalLineHeight,
  fontStyle: 'normal',
  fontWeight: APK_SHOWCASE_ITEM_UI.catalogOriginalWeight,
  textDecoration: 'line-through',
  textDecorationThickness: 1.5,
  textDecorationColor: 'rgba(17, 24, 39, 0.45)',
  whiteSpace: 'nowrap'
}

const apkCatalogMetaTextStyle: React.CSSProperties = {
  marginLeft: 'auto',
  color: 'rgba(0, 0, 0, 0.72)',
  fontSize: 13,
  lineHeight: 1.2,
  fontWeight: 500,
  maxWidth: '42%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: '0 1 auto'
}

const apkCatalogCategoryChipStyle: React.CSSProperties = {
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
const apkAdminCatalogBottomStackStyle: React.CSSProperties = {
  minWidth: 0,
  width: '100%',
  display: 'grid',
  gap: 6,
  overflow: 'visible'
}

const apkAdminCatalogPriceMetaRowStyle: React.CSSProperties = {
  minWidth: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'baseline',
  gap: APK_SHOWCASE_ITEM_UI.catalogPriceGap,
  overflow: 'visible'
}

const apkAdminCatalogViewsStyle: React.CSSProperties = {
  marginLeft: 'auto',
  color: 'rgba(0, 0, 0, 0.55)',
  fontSize: 13,
  lineHeight: 1.2,
  fontWeight: 500,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flex: '0 1 auto'
}

const apkAnnouncementTimePillStyle: React.CSSProperties = {
  borderRadius: APK_ANNOUNCEMENT_UI.timePillRadius,
  padding: `${APK_ANNOUNCEMENT_UI.timePillPaddingY}px ${APK_ANNOUNCEMENT_UI.timePillPaddingX}px`,
  color: APK_ANNOUNCEMENT_UI.muted,
  background: 'rgba(255, 255, 255, 0.72)',
  fontSize: 11,
  lineHeight: 1,
  fontWeight: 500,
  whiteSpace: 'nowrap'
}

const apkAnnouncementFeedCardStyle: React.CSSProperties = {
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

const apkAnnouncementFeedImageButtonStyle: React.CSSProperties = {
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

const apkAnnouncementFeedPlaceholderStyle: React.CSSProperties = {
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

const apkAnnouncementFeedInnerStyle: React.CSSProperties = {
  width: '100%',
  padding: `0 ${APK_ANNOUNCEMENT_UI.feedInnerPaddingX}px`,
  display: 'grid',
  gap: 0
}

const apkAnnouncementFeedDividerStyle: React.CSSProperties = {
  width: '100%',
  height: 1,
  marginTop: APK_ANNOUNCEMENT_UI.feedDividerTopPadding,
  background: APK_ANNOUNCEMENT_UI.divider
}

const apkAnnouncementMetaRowStyle: React.CSSProperties = {
  width: '100%',
  paddingTop: APK_ANNOUNCEMENT_UI.feedMetaTopPadding,
  display: 'flex',
  alignItems: 'center',
  gap: 8
}

const apkAnnouncementMetaTextStyle: React.CSSProperties = {
  margin: 0,
  color: 'rgba(0, 0, 0, 0.55)',
  fontSize: APK_ANNOUNCEMENT_UI.metaSize,
  lineHeight: APK_ANNOUNCEMENT_UI.metaLineHeight,
  fontWeight: APK_ANNOUNCEMENT_UI.metaWeight
}

const apkAnnouncementExpandButtonStyle: React.CSSProperties = {
  width: APK_ANNOUNCEMENT_UI.feedExpandButtonSize,
  height: APK_ANNOUNCEMENT_UI.feedExpandButtonSize,
  marginRight: APK_ANNOUNCEMENT_UI.feedExpandButtonInsetRight,
  border: 0,
  borderRadius: 999,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  color: APK_ANNOUNCEMENT_UI.feedExpandIconColor,
  background: APK_ANNOUNCEMENT_UI.feedExpandButtonBg,
  boxShadow: 'none',
  fontSize: 0,
  lineHeight: 1,
  fontWeight: 600,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation'
}

const apkAnnouncementExpandedBodyStyle: React.CSSProperties = {
  width: '100%',
  paddingTop: APK_ANNOUNCEMENT_UI.feedExpandBodyTopPadding,
  paddingBottom: APK_ANNOUNCEMENT_UI.feedExpandBodyBottomPadding,
  display: 'grid',
  gap: 8
}
function apkAnnouncementExpandedBodyOuterStyle(expanded: boolean): React.CSSProperties {
  return {
    width: '100%',
    display: 'grid',
    gridTemplateRows: expanded ? '1fr' : '0fr',
    opacity: expanded ? 1 : 0,
    transition: `grid-template-rows ${APK_ANNOUNCEMENT_UI.feedExpandAnimationMs}ms ease, opacity ${APK_ANNOUNCEMENT_UI.feedExpandAnimationMs}ms ease`,
    overflow: 'hidden'
  }
}

const apkAnnouncementExpandedBodyInnerStyle: React.CSSProperties = {
  minHeight: 0,
  overflow: 'hidden'
}
const apkAnnouncementBodyTextStyle: React.CSSProperties = {
  margin: 0,
  color: 'rgba(0, 0, 0, 0.78)',
  fontSize: APK_ANNOUNCEMENT_UI.bodySize,
  lineHeight: APK_ANNOUNCEMENT_UI.bodyLineHeight,
  fontWeight: APK_ANNOUNCEMENT_UI.bodyWeight,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere'
}
function NdjcAnnouncementExpandIcon({ expanded }: { expanded: boolean }) {
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
const apkMutedTextStyle: React.CSSProperties = {
  margin: 0,
  color: APK_CHAT_UI.muted,
  fontSize: 14,
  lineHeight: 1.45,
  fontWeight: 400
}

function titleForDish(dish: DemoDish): string {
  return getDishTitle(dish) || 'Untitled item'
}

function categoryForDish(dish: DemoDish): string {
  return String(dish.category || '').trim()
}

export function ScreenScaffold({
  title,
  subtitle,
  actions,
  children,
  bottomActions,
  activeTab,
  badgeCount
}: {
  title: string
  subtitle?: string
  actions?: BackHomeActions
  children: React.ReactNode
  bottomActions?: BottomActions
  activeTab?: ShowcaseBottomBarTab
  badgeCount?: number
}) {
  return (
    <main className="ndjc-screen" style={apkShellScreenStyle}>
      <section className="ndjc-phone-surface" style={apkPhoneSurfaceStyle}>
        <header className="ndjc-screen-header" style={apkScreenHeaderStyle}>
          <button
            type="button"
            className="ndjc-top-icon-button"
            style={{
              ...apkBackButtonStyle,
              visibility: actions?.onBack || actions?.onBackToHome ? 'visible' : 'hidden',
              pointerEvents: actions?.onBack || actions?.onBackToHome ? 'auto' : 'none'
            }}
            onClick={actions?.onBack || actions?.onBackToHome}
            aria-label="Back"
          >
            ←
          </button>

          <button
            type="button"
            className="ndjc-top-icon-button"
            style={{
              ...apkBackButtonStyle,
              visibility: actions?.onBackToHome ? 'visible' : 'hidden',
              pointerEvents: actions?.onBackToHome ? 'auto' : 'none'
            }}
            onClick={actions?.onBackToHome}
            aria-label="Home"
          >
            ⌂
          </button>
        </header>

        <section className="ndjc-title-block" style={apkTitleBlockStyle}>
          <div
            style={{
              minWidth: 0,
              display: 'grid',
              gap: APK_SHELL_UI.titleBlockGap
            }}
          >
            <h1
              style={{
                margin: 0,
                color: APK_SHELL_UI.ink,
                fontSize: APK_SHELL_UI.titleSize,
                lineHeight: APK_SHELL_UI.titleLineHeight,
                fontWeight: APK_SHELL_UI.titleWeight,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {title}
            </h1>

            {subtitle ? (
              <p
                style={{
                  margin: 0,
                  color: APK_SHELL_UI.muted,
                  fontSize: APK_SHELL_UI.subtitleSize,
                  lineHeight: APK_SHELL_UI.subtitleLineHeight,
                  fontWeight: APK_SHELL_UI.subtitleWeight
                }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>

          {typeof badgeCount === 'number' ? (
            <span
              className="ndjc-badge"
              style={{
                minWidth: APK_SHELL_UI.badgeMinSize,
                height: APK_SHELL_UI.badgeMinSize,
                borderRadius: APK_SHELL_UI.badgeRadius,
                padding: '0 8px',
                display: 'grid',
                placeItems: 'center',
                color: APK_SHELL_UI.white,
                background: APK_SHELL_UI.brand,
                fontSize: 12,
                lineHeight: 1,
                fontWeight: 700
              }}
            >
              {badgeCount}
            </span>
          ) : null}
        </section>

        <section className="ndjc-screen-content" style={apkScreenContentStyle}>
          {children}
        </section>

        {bottomActions ? (
          <ShowcaseBottomBar actions={bottomActions} activeTab={activeTab || 'Store'} />
        ) : null}
      </section>
    </main>
  )
}

export function ShowcaseBottomBar({
  actions,
  activeTab,
  showAppointments = false,
  showChatDot = false,
  showBookingsDot = false,
  showAnnouncementsDot = false
}: {
  actions: BottomActions
  activeTab: ShowcaseBottomBarTab | null
  showAppointments?: boolean
  showChatDot?: boolean
  showBookingsDot?: boolean
  showAnnouncementsDot?: boolean
}) {
  const tabs = [
    {
      key: 'Store' as const,
      label: 'Store',
      icon: <NdjcStorefrontIcon />,
      activeIcon: <NdjcStorefrontIcon filled />,
      showDot: false,
      onClick: actions.onOpenStoreProfileView
    },
    {
      key: 'Chat' as const,
      label: 'Chat',
      icon: <NdjcChatBubbleIcon />,
      activeIcon: <NdjcChatBubbleIcon filled />,
      showDot: showChatDot,
      onClick: actions.onOpenChat
    },
...(showAppointments
  ? [
      {
        key: 'Appointments' as const,
        label: 'Bookings',
        icon: <NdjcBookingsIcon />,
        activeIcon: <NdjcBookingsIcon filled />,
        showDot: showBookingsDot,
        onClick: actions.onOpenCustomerBookings
      }
    ]
  : []),
    {
      key: 'Announcements' as const,
      label: 'Updates',
      icon: <NdjcNotificationsIcon />,
      activeIcon: <NdjcNotificationsIcon filled />,
      showDot: showAnnouncementsDot,
      onClick: actions.onOpenAnnouncements
    },
    {
      key: 'Favorites' as const,
      label: 'Saved',
      icon: <NdjcBookmarkIcon />,
      activeIcon: <NdjcBookmarkIcon filled />,
      showDot: false,
      onClick: actions.onOpenFavorites
    }
  ]

  return (
    <nav className="ndjc-bottom-bar" style={apkBottomBarStyle} aria-label="Showcase navigation">
      <div className="ndjc-bottom-bar-divider" style={apkBottomBarDividerStyle} aria-hidden="true" />

      <div
        className="ndjc-bottom-bar-row"
        style={{
          ...apkBottomBarRowStyle,
          ['--ndjc-bottom-tab-count' as string]: tabs.length
        }}
      >
        {tabs.map(tab => {
          const active = activeTab === tab.key

          return (
            <NdjcBottomTabVertical
              key={tab.key}
              icon={active ? tab.activeIcon : tab.icon}
              label={tab.label}
              active={active}
              showDot={tab.showDot}
              onClick={tab.onClick}
            />
          )
        })}
      </div>
    </nav>
  )
}

export function ShowcaseBottomBarHost({
  children,
  actions,
  activeTab = null,
  showAppointments = false,
  showChatDot = false,
  showBookingsDot = false,
  showAnnouncementsDot = false
}: {
  children: React.ReactNode
  actions: BottomActions
  activeTab?: ShowcaseBottomBarTab | null
  showAppointments?: boolean
  showChatDot?: boolean
  showBookingsDot?: boolean
  showAnnouncementsDot?: boolean
}) {
  const bottomBar = (
    <ShowcaseBottomBar
      actions={actions}
      activeTab={activeTab}
      showAppointments={showAppointments}
      showChatDot={showChatDot}
      showBookingsDot={showBookingsDot}
      showAnnouncementsDot={showAnnouncementsDot}
    />
  )

  return (
    <NdjcBottomBarHostContext.Provider value={bottomBar}>
      {children}
    </NdjcBottomBarHostContext.Provider>
  )
}
export function NdjcCard({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cx('ndjc-card', className)}>
      {children}
    </section>
  )
}

export function NdjcButton({
  children,
  onClick,
  disabled,
  variant = 'primary',
  type = 'button'
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      className={cx('ndjc-button', `ndjc-button-${variant}`)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function NdjcTextField({
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  multiline = false,
  disabled = false,
  isError = false,
  className,
  leadingIcon,
  trailingIcon,
  singleLine,
  minLines = 1,
  fillContentWidth = true,
  inputMode,
  autoComplete
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  type?: string
  multiline?: boolean
  disabled?: boolean
  isError?: boolean
  className?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  singleLine?: boolean
  minLines?: number
  fillContentWidth?: boolean
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  autoComplete?: string
}) {
  const isMultiline = multiline || singleLine === false
  const cleanLabel = label?.trim() || ''
  const hasLabel = Boolean(cleanLabel)
  const nativePlaceholder = hasLabel ? undefined : placeholder

  const fieldMinHeight = isMultiline
    ? Math.max(APK_CORE_UI.fieldMinHeight, APK_CORE_UI.fieldMinHeight + Math.max(0, minLines - 1) * 24)
    : APK_CORE_UI.fieldMinHeight

  const borderColor = isError
    ? APK_CORE_UI.danger
    : disabled
      ? APK_CORE_UI.borderDisabled
      : APK_CORE_UI.borderStrong

  const shellStyle: React.CSSProperties = {
    width: fillContentWidth ? '100%' : 'auto',
    maxWidth: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    display: 'block'
  }

  const fieldsetStyle: React.CSSProperties = {
    width: fillContentWidth ? '100%' : 'auto',
    maxWidth: '100%',
    minWidth: 0,
    minHeight: fieldMinHeight,
    margin: 0,
    padding: hasLabel
      ? `0 ${APK_CORE_UI.fieldPaddingX}px ${isMultiline ? APK_CORE_UI.fieldPaddingY : 0}px`
      : `0 ${APK_CORE_UI.fieldPaddingX}px`,
    boxSizing: 'border-box',
    border: `${APK_CORE_UI.fieldIndicatorWidth}px solid ${borderColor}`,
    borderRadius: APK_CORE_UI.fieldRadius,
    color: disabled ? 'rgba(0, 0, 0, 0.50)' : APK_CORE_UI.black,
    background: APK_CORE_UI.transparent,
    opacity: disabled ? 0.72 : 1,
    overflow: 'hidden'
  }

  const legendStyle: React.CSSProperties = {
    maxWidth: 'calc(100% - 16px)',
    marginLeft: hasLabel ? 4 : 0,
    padding: hasLabel ? '0 4px' : 0,
    color: isError ? APK_CORE_UI.danger : APK_CORE_UI.black,
    fontSize: APK_CORE_UI.fieldLabelSize,
    lineHeight: '14px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }

  const inputShellColumns = leadingIcon && trailingIcon
    ? `${APK_CORE_UI.fieldIconSize}px minmax(0, 1fr) ${APK_CORE_UI.fieldIconSize}px`
    : leadingIcon
      ? `${APK_CORE_UI.fieldIconSize}px minmax(0, 1fr)`
      : trailingIcon
        ? `minmax(0, 1fr) ${APK_CORE_UI.fieldIconSize}px`
        : 'minmax(0, 1fr)'

  const inputShellStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    minHeight: isMultiline
      ? fieldMinHeight - (hasLabel ? 14 : 0) - APK_CORE_UI.fieldPaddingY
      : fieldMinHeight - (hasLabel ? 14 : 0) - APK_CORE_UI.fieldIndicatorWidth * 2,
    display: 'grid',
    gridTemplateColumns: inputShellColumns,
    columnGap: leadingIcon || trailingIcon ? 8 : 0,
    alignItems: isMultiline ? 'start' : 'center',
    boxSizing: 'border-box'
  }

  const nativeFieldStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    height: isMultiline ? 'auto' : '100%',
    minHeight: isMultiline
      ? Math.max(24, fieldMinHeight - (hasLabel ? 14 : 0) - APK_CORE_UI.fieldPaddingY * 2)
      : 24,
    boxSizing: 'border-box',
    border: 0,
    outline: 0,
    padding: 0,
    color: disabled ? 'rgba(0, 0, 0, 0.50)' : APK_CORE_UI.black,
    background: APK_CORE_UI.transparent,
    boxShadow: 'none',
    fontSize: APK_CORE_UI.fieldTextSize,
    lineHeight: isMultiline ? 1.45 : '20px',
    fontWeight: 500,
    resize: 'none',
    appearance: 'none'
  }

  const iconSlotStyle: React.CSSProperties = {
    width: APK_CORE_UI.fieldIconSize,
    height: APK_CORE_UI.fieldIconSize,
    display: 'grid',
    placeItems: 'center',
    color: isError ? APK_CORE_UI.danger : APK_CORE_UI.muted,
    fontSize: APK_CORE_UI.fieldIconSize,
    lineHeight: 1
  }

  return (
    <label
      className={cx('ndjc-field-shell', disabled && 'is-disabled', isError && 'is-error', className)}
      style={shellStyle}
    >
      <fieldset className="ndjc-text-field-shell" style={fieldsetStyle}>
        {hasLabel ? (
          <legend className="ndjc-field-label" style={legendStyle}>
            {cleanLabel}
          </legend>
        ) : (
          <legend style={{ width: 0, height: 0, padding: 0, margin: 0 }} />
        )}

        <span className="ndjc-text-field-input-row" style={inputShellStyle}>
          {leadingIcon ? (
            <span className="ndjc-text-field-leading-icon" style={iconSlotStyle}>
              {leadingIcon}
            </span>
          ) : null}

          {isMultiline ? (
            <textarea
              className="ndjc-text-field ndjc-textarea"
              style={nativeFieldStyle}
              value={value}
              placeholder={nativePlaceholder}
              disabled={disabled}
              aria-invalid={isError}
              autoComplete={autoComplete}
              rows={Math.max(1, minLines)}
              onChange={event => onChange(event.target.value)}
            />
          ) : (
            <input
              className="ndjc-text-field"
              style={nativeFieldStyle}
              value={value}
              type={type}
              inputMode={inputMode}
              placeholder={nativePlaceholder}
              disabled={disabled}
              aria-invalid={isError}
              autoComplete={autoComplete}
              onChange={event => onChange(event.target.value)}
            />
          )}

          {trailingIcon ? (
            <span className="ndjc-text-field-trailing-icon" style={iconSlotStyle}>
              {trailingIcon}
            </span>
          ) : null}
        </span>
      </fieldset>
    </label>
  )
}

export function EmptyState({
  title,
  message,
  action
}: {
  title: string
  message: string
  action?: React.ReactNode
}) {
  return (
    <NdjcInlineEmptyState title={title} message={message} action={action} />
  )
}

export function NoMoreFooter({ text }: { text: string }) {
  return <NdjcNoMoreListFooter text={text} />
}



type NdjcIconButtonProps = {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

type NdjcDialogActions = {
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  onDismissRequest?: () => void
  confirmEnabled?: boolean
  confirmLoading?: boolean
  destructiveConfirm?: boolean
}

export function NdjcSystemBars({
  color = APK_SHELL_UI.pageBg,
  darkIcons = true,
  navigationBarColor,
  lightNavIcons,
  decorFitsSystemWindows
}: {
  color?: string
  darkIcons?: boolean
  navigationBarColor?: string | null
  lightNavIcons?: boolean | null
  decorFitsSystemWindows?: boolean | null
}) {
  return (
    <div
      className="ndjc-system-bars"
      data-dark-icons={darkIcons ? 'true' : 'false'}
      data-light-nav-icons={lightNavIcons == null ? undefined : lightNavIcons ? 'true' : 'false'}
      data-decor-fits-system-windows={decorFitsSystemWindows == null ? undefined : decorFitsSystemWindows ? 'true' : 'false'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: navigationBarColor || color,
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    />
  )
}

export function NdjcSystemBarsTransparent({
  darkIcons = true
}: {
  darkIcons?: boolean
}) {
  return (
    <NdjcSystemBars
      color={APK_SHELL_UI.transparent}
      darkIcons={darkIcons}
      decorFitsSystemWindows={false}
    />
  )
}

function isNdjcInteractivePointerTarget(target: EventTarget | null): boolean {
  const element = target instanceof HTMLElement ? target : null
  if (!element) return false

  return Boolean(
    element.closest(
      [
        'button',
        'input',
        'textarea',
        'select',
        'a',
        'label',
        'summary',
        '[role="button"]',
        '[role="link"]',
        '[contenteditable="true"]',
        '[data-ndjc-interactive="true"]',
        '.ndjc-bottom-bar',
        '.ndjc-bottom-bar *',
        '.ndjc-filter-bottom-sheet',
        '.ndjc-filter-bottom-sheet *',
        '.ndjc-home-style-media-card',
        '.ndjc-home-style-media-card *',
        '.ndjc-top-search',
        '.ndjc-top-search *',
        '.ndjc-sheet-backdrop',
        '.ndjc-sheet-backdrop *',
        '.ndjc-chat-input',
        '.ndjc-chat-input *'
      ].join(',')
    )
  )
}

function shouldSkipNdjcPullRefreshPointer(event: React.PointerEvent<HTMLElement>): boolean {
  if (event.pointerType === 'touch' || event.pointerType === 'pen') return true
  return isNdjcInteractivePointerTarget(event.target)
}

function getNdjcKeyboardViewportHeightPx(): number {
  if (typeof window === 'undefined') return 0

  const layoutHeight = Math.max(0, Math.round(window.innerHeight || 0))
  const visualViewport = window.visualViewport

  if (!visualViewport) return layoutHeight

  const visualHeight = Math.max(0, Math.round(visualViewport.height || 0))

  if (visualHeight > 0) return visualHeight

  return layoutHeight
}

function getNdjcVisualViewportOffsetTopPx(): number {
  if (typeof window === 'undefined') return 0

  const visualViewport = window.visualViewport
  if (!visualViewport) return 0

  const offsetTop = Math.max(0, Math.round(visualViewport.offsetTop || 0))

  return offsetTop
}

function syncNdjcKeyboardViewportCssVars(): void {
  if (typeof document === 'undefined') return

  const viewportHeight = getNdjcKeyboardViewportHeightPx()
  const viewportOffsetTop = getNdjcVisualViewportOffsetTopPx()

  document.documentElement.style.setProperty(
    '--ndjc-stable-viewport-height',
    `${Math.max(0, viewportHeight)}px`
  )

  document.documentElement.style.setProperty(
    '--ndjc-visual-viewport-offset-top',
    `${Math.max(0, viewportOffsetTop)}px`
  )

  document.documentElement.style.setProperty(
    '--ndjc-keyboard-inset',
    '0px'
  )

  window.dispatchEvent(
    new CustomEvent('ndjc:keyboard-viewport-change', {
      detail: {
        viewportHeight: Math.max(0, viewportHeight),
        viewportOffsetTop: Math.max(0, viewportOffsetTop)
      }
    })
  )
}

function clearNdjcKeyboardViewportCssVars(): void {
  if (typeof document === 'undefined') return

  document.documentElement.style.removeProperty('--ndjc-stable-viewport-height')
  document.documentElement.style.removeProperty('--ndjc-visual-viewport-offset-top')
  document.documentElement.style.removeProperty('--ndjc-keyboard-inset')
}

function NdjcChatKeyboardDebugPanel(): React.ReactElement | null {
  const [mounted, setMounted] = React.useState(false)
  const [snapshot, setSnapshot] = React.useState({
    scrollY: 0,
    docTop: 0,
    bodyTop: 0,
    innerHeight: 0,
    vvHeight: 0,
    vvOffsetTop: 0,
    vvOffsetLeft: 0,
    vvPageTop: 0,
    cssHeight: '',
    cssOffsetTop: '',
    shellTop: 0,
    shellHeight: 0,
    scaffoldTop: 0,
    scaffoldHeight: 0,
    footerTop: 0,
    footerHeight: 0,
    topBarTop: 0,
    topBarHeight: 0,
    panelTop: 8,
    panelLeft: 8
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof document === 'undefined') return

    const read = () => {
      const root = document.documentElement
      const body = document.body
      const visualViewport = window.visualViewport
      const shell = document.querySelector('.ndjc-chat-keyboard-shell')
      const scaffold = document.querySelector('.ndjc-conversation-page-scaffold')
      const footer = document.querySelector('.ndjc-conversation-footer')
      const topBar = document.querySelector('.ndjc-conversation-top-surface')

      const shellRect = shell?.getBoundingClientRect()
      const scaffoldRect = scaffold?.getBoundingClientRect()
      const footerRect = footer?.getBoundingClientRect()
      const topBarRect = topBar?.getBoundingClientRect()

      const visualOffsetTop = Math.round(visualViewport?.offsetTop || 0)
      const visualOffsetLeft = Math.round(visualViewport?.offsetLeft || 0)

      setSnapshot({
        scrollY: Math.round(window.scrollY || 0),
        docTop: Math.round(root.scrollTop || 0),
        bodyTop: Math.round(body.scrollTop || 0),
        innerHeight: Math.round(window.innerHeight || 0),
        vvHeight: Math.round(visualViewport?.height || 0),
        vvOffsetTop: visualOffsetTop,
        vvOffsetLeft: visualOffsetLeft,
        vvPageTop: Math.round(visualViewport?.pageTop || 0),
        cssHeight: root.style.getPropertyValue('--ndjc-stable-viewport-height') || '',
        cssOffsetTop: root.style.getPropertyValue('--ndjc-visual-viewport-offset-top') || '',
        shellTop: Math.round(shellRect?.top || 0),
        shellHeight: Math.round(shellRect?.height || 0),
        scaffoldTop: Math.round(scaffoldRect?.top || 0),
        scaffoldHeight: Math.round(scaffoldRect?.height || 0),
        footerTop: Math.round(footerRect?.top || 0),
        footerHeight: Math.round(footerRect?.height || 0),
        topBarTop: Math.round(topBarRect?.top || 0),
        topBarHeight: Math.round(topBarRect?.height || 0),
        panelTop: Math.max(8, visualOffsetTop + 8),
        panelLeft: Math.max(8, visualOffsetLeft + 8)
      })
    }

    read()

    const timerId = window.setInterval(read, 100)

    window.addEventListener('scroll', read, true)
    window.addEventListener('resize', read)
    window.visualViewport?.addEventListener('resize', read)
    window.visualViewport?.addEventListener('scroll', read)

    return () => {
      window.clearInterval(timerId)
      window.removeEventListener('scroll', read, true)
      window.removeEventListener('resize', read)
      window.visualViewport?.removeEventListener('resize', read)
      window.visualViewport?.removeEventListener('scroll', read)
    }
  }, [])

  if (!mounted) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: snapshot.panelLeft,
        top: snapshot.panelTop,
        zIndex: 2147483647,
        maxWidth: 280,
        padding: '10px 12px',
        borderRadius: 8,
        background: 'rgba(0, 0, 0, 0.82)',
        color: '#00ff7f',
        fontSize: 11,
        lineHeight: 1.35,
        fontFamily: 'monospace',
        pointerEvents: 'none',
        whiteSpace: 'pre-wrap'
      }}
    >
      {`scrollY: ${snapshot.scrollY}
docTop: ${snapshot.docTop}
bodyTop: ${snapshot.bodyTop}
innerH: ${snapshot.innerHeight}
vvH: ${snapshot.vvHeight}
vvOff: ${snapshot.vvOffsetTop}
vvLeft: ${snapshot.vvOffsetLeft}
vvPage: ${snapshot.vvPageTop}
cssH: ${snapshot.cssHeight}
cssOff: ${snapshot.cssOffsetTop}
shellTop: ${snapshot.shellTop}
shellH: ${snapshot.shellHeight}
scaffoldTop: ${snapshot.scaffoldTop}
scaffoldH: ${snapshot.scaffoldHeight}
topBarTop: ${snapshot.topBarTop}
topBarH: ${snapshot.topBarHeight}
footerTop: ${snapshot.footerTop}
footerH: ${snapshot.footerHeight}`}
    </div>,
    document.body
  )
}

export function NdjcUnifiedBackground({
  children,
  className,
  topNav,
  snackbar,
  bottomBar
}: {
  children: React.ReactNode
  className?: string
  topNav?: {
    onBack?: () => void
    onHome?: () => void
    iconOnly?: boolean
    iconTint?: string
  } | null
  snackbar?: React.ReactNode
  bottomBar?: React.ReactNode
}) {
  const contextBottomBar = React.useContext(NdjcBottomBarHostContext)
  const resolvedBottomBar = bottomBar ?? contextBottomBar
  const bottomBarHostRef = React.useRef<HTMLElement | null>(null)
  const [bottomBarHeightPx, setBottomBarHeightPx] = React.useState(0)
  const isChatKeyboardShell = typeof className === 'string' && className.includes('ndjc-chat-keyboard-shell')

  React.useLayoutEffect(() => {
    if (!isChatKeyboardShell) return
    if (typeof window === 'undefined') return

    let frameId: number | null = null
    let firstTimeoutId: number | null = null
    let secondTimeoutId: number | null = null

    const clearScheduledKeyboardViewportSync = () => {
      if (frameId != null) {
        window.cancelAnimationFrame(frameId)
        frameId = null
      }

      if (firstTimeoutId != null) {
        window.clearTimeout(firstTimeoutId)
        firstTimeoutId = null
      }

      if (secondTimeoutId != null) {
        window.clearTimeout(secondTimeoutId)
        secondTimeoutId = null
      }
    }

    const syncKeyboardViewportNow = () => {
      syncNdjcKeyboardViewportCssVars()
    }

    const syncKeyboardViewportInFrame = () => {
      frameId = null
      syncNdjcKeyboardViewportCssVars()
    }

    const syncKeyboardViewportAfterFirstDelay = () => {
      firstTimeoutId = null
      syncNdjcKeyboardViewportCssVars()
    }

    const syncKeyboardViewportAfterSecondDelay = () => {
      secondTimeoutId = null
      syncNdjcKeyboardViewportCssVars()
    }

    const scheduleSyncKeyboardViewport = () => {
      syncKeyboardViewportNow()

      if (frameId == null) {
        frameId = window.requestAnimationFrame(syncKeyboardViewportInFrame)
      }

      if (firstTimeoutId == null) {
        firstTimeoutId = window.setTimeout(syncKeyboardViewportAfterFirstDelay, 50)
      }

      if (secondTimeoutId == null) {
        secondTimeoutId = window.setTimeout(syncKeyboardViewportAfterSecondDelay, 150)
      }
    }

    scheduleSyncKeyboardViewport()

    window.visualViewport?.addEventListener('resize', scheduleSyncKeyboardViewport)
    window.visualViewport?.addEventListener('scroll', scheduleSyncKeyboardViewport)
    window.addEventListener('resize', scheduleSyncKeyboardViewport)
    window.addEventListener('orientationchange', scheduleSyncKeyboardViewport)

    return () => {
      clearScheduledKeyboardViewportSync()

      window.visualViewport?.removeEventListener('resize', scheduleSyncKeyboardViewport)
      window.visualViewport?.removeEventListener('scroll', scheduleSyncKeyboardViewport)
      window.removeEventListener('resize', scheduleSyncKeyboardViewport)
      window.removeEventListener('orientationchange', scheduleSyncKeyboardViewport)
      clearNdjcKeyboardViewportCssVars()
    }
  }, [isChatKeyboardShell])

  React.useLayoutEffect(() => {
    if (!resolvedBottomBar) {
      setBottomBarHeightPx(0)
      return
    }

    const element = bottomBarHostRef.current
    if (!element) {
      setBottomBarHeightPx(APK_PAGE_SHELL_UI.tabBottomReserve)
      return
    }

    const updateMeasuredHeight = () => {
      const nextHeight = Math.ceil(element.getBoundingClientRect().height)
      setBottomBarHeightPx(nextHeight > 0 ? nextHeight : APK_PAGE_SHELL_UI.tabBottomReserve)
    }

    updateMeasuredHeight()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateMeasuredHeight)
      return () => {
        window.removeEventListener('resize', updateMeasuredHeight)
      }
    }

    const observer = new ResizeObserver(updateMeasuredHeight)
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [resolvedBottomBar])

  const bottomBarReservePx = resolvedBottomBar
    ? bottomBarHeightPx || APK_PAGE_SHELL_UI.tabBottomReserve
    : 0

  const screenStyleWithKeyboardInsets = {
    ...apkShellScreenStyle,
    height: isChatKeyboardShell ? 'var(--ndjc-stable-viewport-height, 100dvh)' : apkShellScreenStyle.height,
    minHeight: isChatKeyboardShell ? 'var(--ndjc-stable-viewport-height, 100dvh)' : apkShellScreenStyle.minHeight,
    maxHeight: isChatKeyboardShell ? 'var(--ndjc-stable-viewport-height, 100dvh)' : apkShellScreenStyle.maxHeight,
    transform: isChatKeyboardShell
      ? 'translate3d(0, var(--ndjc-visual-viewport-offset-top, 0px), 0)'
      : apkShellScreenStyle.transform,
    transformOrigin: isChatKeyboardShell ? 'top left' : apkShellScreenStyle.transformOrigin,
    willChange: isChatKeyboardShell ? 'transform' : apkShellScreenStyle.willChange
  } as React.CSSProperties

  const unifiedBackgroundSurfaceStyleWithBottomReserve = {
    ...apkUnifiedBackgroundSurfaceStyle,
    height: isChatKeyboardShell ? 'var(--ndjc-stable-viewport-height, 100dvh)' : apkUnifiedBackgroundSurfaceStyle.height,
    minHeight: isChatKeyboardShell ? 'var(--ndjc-stable-viewport-height, 100dvh)' : apkUnifiedBackgroundSurfaceStyle.minHeight,
    maxHeight: isChatKeyboardShell ? 'var(--ndjc-stable-viewport-height, 100dvh)' : apkUnifiedBackgroundSurfaceStyle.maxHeight,
    [NDJC_BOTTOM_BAR_HEIGHT_CSS_VAR]: `${bottomBarReservePx}px`,
    [NDJC_BOTTOM_BAR_RESERVE_CSS_VAR]: `${bottomBarReservePx}px`
  } as React.CSSProperties

  return (
    <main className={cx('ndjc-screen', className)} style={screenStyleWithKeyboardInsets}>
      <NdjcSystemBarsTransparent darkIcons />

      <style>
        {`
          html,
          body {
            overscroll-behavior: none;
            overscroll-behavior-y: none;
            overflow: hidden;
          }

          .ndjc-screen,
          .ndjc-phone-surface,
          .ndjc-unified-background {
            overscroll-behavior: contain;
            overscroll-behavior-y: contain;
          }

          .ndjc-unified-background,
          .ndjc-unified-background * {
            scrollbar-width: none;
          }

          .ndjc-unified-background::-webkit-scrollbar,
          .ndjc-unified-background *::-webkit-scrollbar {
            width: 0;
            height: 0;
            display: none;
          }

          .ndjc-unified-background button,
          .ndjc-unified-background a,
          .ndjc-unified-background [role="button"],
          .ndjc-unified-background input,
          .ndjc-unified-background textarea,
          .ndjc-unified-background select {
            -webkit-tap-highlight-color: transparent;
          }

          .ndjc-unified-background input[type="search"]::-webkit-search-cancel-button,
          .ndjc-unified-background input[type="search"]::-webkit-search-decoration,
          .ndjc-unified-background input[type="search"]::-webkit-search-results-button,
          .ndjc-unified-background input[type="search"]::-webkit-search-results-decoration {
            display: none;
            -webkit-appearance: none;
          }

          .ndjc-unified-background input[type="search"] {
            -webkit-appearance: none;
            appearance: none;
          }

          .ndjc-unified-background button {
            appearance: none;
            -webkit-appearance: none;
            outline: none;
            background-clip: padding-box;
          }

          .ndjc-unified-background button:focus,
          .ndjc-unified-background button:focus-visible,
          .ndjc-unified-background [role="button"]:focus,
          .ndjc-unified-background [role="button"]:focus-visible,
          .ndjc-unified-background a:focus,
          .ndjc-unified-background a:focus-visible {
            outline: none;
          }

          .ndjc-unified-background .ndjc-primary-action-button,
          .ndjc-unified-background .ndjc-button,
          .ndjc-unified-background .ndjc-pill-button,
          .ndjc-unified-background .ndjc-control-pill-button,
          .ndjc-unified-background .ndjc-card-back-button,
          .ndjc-unified-background .ndjc-top-icon-button,
          .ndjc-unified-background .ndjc-bottom-tab-button,
          .ndjc-unified-background .ndjc-bottom-nav-button,
          .ndjc-unified-background button[role="tab"],
          .ndjc-unified-background button[type="button"],
          .ndjc-unified-background button[type="submit"] {
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            user-select: none;
            overflow: hidden;
            background-clip: padding-box;
          }

          .ndjc-unified-background .ndjc-pill-button {
            transform: translateZ(0) scale(1);
            transition: transform 90ms ease-out, background 120ms ease, color 120ms ease, border-color 120ms ease, opacity 120ms ease;
            will-change: transform;
          }

          .ndjc-unified-background .ndjc-pill-button:active:not(:disabled) {
            transform: translateZ(0) scale(var(--ndjc-pill-pressed-scale, 0.92));
            filter: brightness(0.92);
            box-shadow: inset 0 2px 7px rgba(0, 0, 0, 0.20);
          }

          .ndjc-unified-background * {
            -webkit-touch-callout: none;
          }

          @keyframes ndjcAdminProgressSlide {
            0% {
              transform: translateX(-120%);
            }

            55% {
              transform: translateX(65%);
            }

            100% {
              transform: translateX(260%);
            }
          }

          @keyframes ndjcSpinnerRotate {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      <section
        className="ndjc-phone-surface ndjc-unified-background"
        style={unifiedBackgroundSurfaceStyleWithBottomReserve}
        onPointerDown={event => {
          if (isNdjcInteractivePointerTarget(event.target)) return
          ;(document.activeElement as HTMLElement | null)?.blur?.()
        }}
      >
        {topNav ? (
          <nav className="ndjc-top-nav-overlay" style={apkTopNavOverlayStyle} aria-label="Page navigation">
            <span style={{ pointerEvents: 'auto' }}>
              {topNav.onBack ? (
                <NdjcCardBackButton
                  onClick={topNav.onBack}
                  iconOnly={topNav.iconOnly}
                  iconTint={topNav.iconTint}
                />
              ) : (
                <span
                  style={{
                    width: APK_SHELL_UI.topNavButtonSlotSize,
                    height: APK_SHELL_UI.topNavButtonSlotSize,
                    display: 'block'
                  }}
                  aria-hidden="true"
                />
              )}
            </span>

            <span style={{ pointerEvents: 'auto' }}>
              {topNav.onHome ? (
<NdjcCardBackButton
  onClick={topNav.onHome}
  label="Home"
  icon={<NdjcHomeSolidIcon color={topNav.iconTint || APK_SHELL_UI.white} />}
  iconOnly={topNav.iconOnly}
  iconTint={topNav.iconTint || APK_SHELL_UI.white}
/>
              ) : (
                <span
                  style={{
                    width: APK_SHELL_UI.topNavButtonSlotSize,
                    height: APK_SHELL_UI.topNavButtonSlotSize,
                    display: 'block'
                  }}
                  aria-hidden="true"
                />
              )}
            </span>
          </nav>
        ) : null}

        {children}

        {snackbar}

        {resolvedBottomBar ? (
          <section
            ref={bottomBarHostRef}
            className="ndjc-bottom-bar-overlay-host"
            data-web-equivalent="bottom-bar-host"
            style={apkHomeBottomBarHostStyle}
          >
            {resolvedBottomBar}
          </section>
        ) : null}
      </section>
    </main>
  )
}

const NDJC_TOP_SCROLL_FADE_MASK_HEIGHT = 220
const NDJC_TOP_SCROLL_FADE_MASK_COLOR = '#eef4f2'
const NDJC_TOP_SCROLL_FADE_MASK_TRANSPARENT_COLOR = 'rgba(238, 244, 242, 0)'

export function NdjcTopScrollFadeMask({
  height = NDJC_TOP_SCROLL_FADE_MASK_HEIGHT,
  className,
  color = NDJC_TOP_SCROLL_FADE_MASK_COLOR,
  transparentColor = NDJC_TOP_SCROLL_FADE_MASK_TRANSPARENT_COLOR,
  solidRatio = 0.58,
  style
}: {
  height?: number | string
  className?: string
  color?: string
  transparentColor?: string
  solidRatio?: number
  style?: React.CSSProperties
}) {
  const resolvedHeight = typeof height === 'number'
    ? `${Math.max(0, height)}px`
    : height

  const resolvedSolidRatio = Math.min(0.92, Math.max(0.08, solidRatio))
  const solidStopPercent = Math.round(resolvedSolidRatio * 100)

  return (
    <div
      className={cx('ndjc-top-scroll-fade-mask', className)}
      data-web-equivalent="top-scroll-fade-mask"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: resolvedHeight,
        pointerEvents: 'none',
        background: `linear-gradient(to bottom, ${color} 0%, ${color} ${solidStopPercent}%, ${transparentColor} 100%)`,
        ...style
      }}
      aria-hidden="true"
    />
  )
}

export function NdjcWhiteCard({
  children,
  className,
  style
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <section
      className={cx('ndjc-white-card', className)}
      style={{
        ...apkWhiteCardStyle,
        ...style
      }}
    >
      {children}
    </section>
  )
}

function NdjcHomeSolidIcon({
  color = APK_SHELL_UI.brand
}: {
  color?: string
}) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.75 10.55L12 3.75l8.25 6.8v8.7a1 1 0 0 1-1 1H15.6a1 1 0 0 1-1-1v-4.6h-5.2v4.6a1 1 0 0 1-1 1H4.75a1 1 0 0 1-1-1v-8.7Z"
        fill={color}
      />
    </svg>
  )
}

export function NdjcCardBackButton({
  onClick,
  label = 'Back',
  icon,
  iconOnly = false,
  iconTint = APK_SHELL_UI.white
}: {
  onClick?: () => void
  label?: string
  icon?: React.ReactNode
  iconOnly?: boolean
  iconTint?: string
}) {
  const [pressed, setPressed] = React.useState(false)
  const resolvedIcon = icon || <NdjcBackArrowSvgIcon />

  return (
    <button
      type="button"
      className={cx('ndjc-card-back-button', iconOnly && 'is-icon-only')}
      style={{
        ...apkBackButtonStyle(pressed, iconOnly, iconTint),
        cursor: onClick ? 'pointer' : 'default'
      }}
      disabled={!onClick}
      onPointerDown={() => {
        if (onClick) setPressed(true)
      }}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={onClick}
      aria-label={label}
    >
      <span style={apkBackButtonIconWrapStyle}>
        {resolvedIcon}
      </span>
    </button>
  )
}
export function NdjcTopNavOverlay({
  onBack,
  onHome
}: {
  onBack?: () => void
  onHome?: () => void
}) {
  return (
    <nav
      className="ndjc-top-nav-overlay"
      style={apkTopNavOverlayStyle}
      aria-label="Page navigation"
    >
      <span style={{ pointerEvents: 'auto' }}>
        <NdjcCardBackButton onClick={onBack || onHome} label="Back" icon="←" />
      </span>

      <span style={{ pointerEvents: 'auto' }}>
        <NdjcCardBackButton onClick={onHome} label="Home" icon="⌂" />
      </span>
    </nav>
  )
}



export function NdjcSpinner({
  size = 18,
  stroke = 2,
  tone = 'primary',
  className,
  style
}: {
  size?: number
  stroke?: number
  tone?: 'primary' | 'light' | 'danger'
  className?: string
  style?: React.CSSProperties
}) {
  const trackColor = tone === 'light'
    ? 'rgba(255, 255, 255, 0.42)'
    : tone === 'danger'
      ? 'rgba(220, 38, 38, 0.22)'
      : 'rgba(38, 198, 164, 0.25)'

  const activeColor = tone === 'light'
    ? APK_CORE_UI.white
    : tone === 'danger'
      ? APK_CORE_UI.danger
      : APK_SHELL_UI.green

  return (
    <span
      className={cx('ndjc-spinner', className)}
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        border: `${stroke}px solid ${trackColor}`,
        borderTopColor: activeColor,
        display: 'inline-block',
        flexShrink: 0,
        animation: 'ndjcSpinnerRotate 780ms linear infinite',
        ...style
      }}
      aria-hidden="true"
    />
  )
}

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

  function releasePressState(): void {
    setPressed(false)
  }

  return (
    <button
      type={type}
      className={cx('ndjc-primary-action-button', className)}
      style={apkPrimaryButtonStyle(disabled, isLoading, pressed)}
      disabled={blocked}
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
      aria-busy={isLoading || undefined}
    >
      {isLoading ? (
        <NdjcSpinner
          className="ndjc-primary-action-spinner"
          size={18}
          stroke={2}
          tone="light"
        />
      ) : (
        <span
          style={{
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {children}
        </span>
      )}
    </button>
  )
}
export function NdjcPillButton({
  children,
  selected,
  onClick,
  disabled,
  className
}: {
  children: React.ReactNode
  selected?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      className={cx('ndjc-pill-button', selected && 'is-selected', className)}
      style={apkPillButtonStyle(selected, disabled)}
      disabled={disabled}
      onClick={() => {
        if (disabled) return
        onClick?.()
      }}
      aria-pressed={selected}
    >
      <span
        style={{
          minWidth: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          lineHeight: 1,
          transform: 'translateY(1px)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {children}
      </span>
    </button>
  )
}

export function NdjcPillBadge({
  children,
  selected,
  disabled,
  className
}: {
  children: React.ReactNode
  selected?: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <span
      className={cx('ndjc-pill-badge', selected && 'is-selected', className)}
      style={{
        ...apkPillButtonStyle(selected, disabled),
        cursor: 'default',
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    >
      <span
        style={{
          minWidth: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          lineHeight: 1,
          transform: 'translateY(1px)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {children}
      </span>
    </span>
  )
}

export function NdjcControlPillButton({
  children,
  selected,
  active,
  onClick,
  disabled,
  tone = 'normal'
}: {
  children: React.ReactNode
  selected?: boolean
  active?: boolean
  onClick?: () => void
  disabled?: boolean
  tone?: 'normal' | 'accent' | 'subtle'
}) {
  const isActive = active ?? selected ?? false

  return (
    <button
      type="button"
      className={cx('ndjc-control-pill-button', isActive && 'is-selected')}
      style={apkControlPillButtonStyle(isActive, disabled, tone)}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <span
        style={{
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {children}
      </span>
    </button>
  )
}

export function NdjcInlineTextTab({
  children,
  text,
  selected,
  onClick
}: {
  children?: React.ReactNode
  text?: string
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className={cx('ndjc-inline-text-tab', selected && 'is-selected')}
      style={apkInlineTabStyle(selected)}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span
        style={{
          minWidth: 0,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {text ?? children}
      </span>
    </button>
  )
}

export function NdjcToggleRow({
  label,
  description,
  checked,
  onChange,
  onCheckedChange,
  enabled = true,
  labelColor
}: {
  label: string
  description?: string
  checked: boolean
  onChange?: (value: boolean) => void
  onCheckedChange?: (value: boolean) => void
  enabled?: boolean
  labelColor?: string
}) {
  const nextChecked = !checked
  const handleChange = () => {
    if (!enabled) return
    onCheckedChange?.(nextChecked)
    onChange?.(nextChecked)
  }

  return (
    <label
      className={cx('ndjc-toggle-row', !enabled && 'is-disabled')}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        color: labelColor || APK_CORE_UI.toggleLabelColor,
        background: 'transparent',
        opacity: enabled ? 1 : APK_CORE_UI.toggleDisabledOpacity,
        cursor: enabled ? 'pointer' : 'not-allowed'
      }}
    >
      <span
        style={{
          minWidth: 0,
          display: 'grid',
          gap: description ? 3 : 0
        }}
      >
        <strong
          style={{
            color: labelColor || APK_CORE_UI.toggleLabelColor,
            fontSize: 14,
            lineHeight: 1.25,
            fontWeight: 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {label}
        </strong>

        {description ? (
          <em
            style={{
              color: APK_CORE_UI.muted,
              fontSize: 12,
              lineHeight: 1.3,
              fontStyle: 'normal',
              fontWeight: 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {description}
          </em>
        ) : null}
      </span>

      <button
        type="button"
        className={cx('ndjc-toggle-switch', checked && 'is-checked')}
        style={{
          position: 'relative',
          width: APK_CORE_UI.toggleWidth,
          minWidth: APK_CORE_UI.toggleWidth,
          height: APK_CORE_UI.toggleHeight,
          border: 0,
          borderRadius: 999,
          padding: 0,
          background: checked ? APK_CORE_UI.toggleCheckedTrackColor : APK_CORE_UI.toggleUncheckedTrackColor,
          boxShadow: 'none',
          transition: 'background 120ms ease',
          cursor: enabled ? 'pointer' : 'not-allowed'
        }}
        disabled={!enabled}
        onClick={handleChange}
        aria-pressed={checked}
        aria-label={label}
      >
        <span
          style={{
            position: 'absolute',
            top: APK_CORE_UI.toggleThumbInset,
            left: checked
              ? APK_CORE_UI.toggleWidth - APK_CORE_UI.toggleThumbSize - APK_CORE_UI.toggleThumbInset
              : APK_CORE_UI.toggleThumbInset,
            width: APK_CORE_UI.toggleThumbSize,
            height: APK_CORE_UI.toggleThumbSize,
            borderRadius: 999,
            background: checked ? APK_CORE_UI.toggleCheckedThumbColor : APK_CORE_UI.toggleUncheckedThumbColor,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.22)',
            transition: 'left 120ms ease, background 120ms ease'
          }}
          aria-hidden="true"
        />
      </button>

      <input
        type="checkbox"
        checked={checked}
        disabled={!enabled}
        onChange={event => {
          onCheckedChange?.(event.target.checked)
          onChange?.(event.target.checked)
        }}
        style={apkVisuallyHiddenStyle}
      />
    </label>
  )
}

export function NdjcSelectionCheckbox({
  selected,
  checked,
  onClick,
  onCheckedChange,
  label = 'Select'
}: {
  selected?: boolean
  checked?: boolean
  onClick?: () => void
  onCheckedChange?: (value: boolean) => void
  label?: string
}) {
  const isChecked = checked ?? selected ?? false
  const [pressed, setPressed] = React.useState(false)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault()
    event.stopPropagation()
    onCheckedChange?.(!isChecked)
    onClick?.()
  }

  return (
    <button
      type="button"
      className={cx('ndjc-selection-checkbox', isChecked && 'is-selected')}
      style={{
        width: APK_CORE_UI.checkboxSize,
        height: APK_CORE_UI.checkboxSize,
        border: `1.5px solid ${isChecked ? APK_CORE_UI.checkboxCheckedColor : APK_CORE_UI.checkboxUncheckedColor}`,
        borderRadius: APK_CORE_UI.checkboxRadius,
        padding: 0,
        display: 'grid',
        placeItems: 'center',
        color: APK_CORE_UI.checkboxCheckmarkColor,
        background: isChecked ? APK_CORE_UI.checkboxCheckedColor : APK_CORE_UI.transparent,
        boxShadow: 'none',
        fontSize: 14,
        lineHeight: 1,
        fontWeight: 800,
        transform: pressed ? `scale(${APK_SHOWCASE_ITEM_UI.catalogPressedScale})` : 'scale(1)',
        transition: `transform ${APK_SHOWCASE_ITEM_UI.catalogTransitionMs}ms ease`,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
      onPointerDown={event => {
        event.stopPropagation()
        setPressed(true)
      }}
      onPointerUp={event => {
        event.stopPropagation()
        setPressed(false)
      }}
      onPointerCancel={event => {
        event.stopPropagation()
        setPressed(false)
      }}
      onPointerLeave={event => {
        event.stopPropagation()
        setPressed(false)
      }}
      onClick={handleClick}
      aria-label={label}
      aria-pressed={isChecked}
    >
      {isChecked ? '✓' : ''}
    </button>
  )
}

export function NdjcInlineEmptyState({
  title,
  message,
  action,
  verticalPadding = APK_CORE_UI.emptyVerticalPadding,
  fillParentMaxSize = false
}: {
  title: string
  message: string
  action?: React.ReactNode
  verticalPadding?: number
  fillParentMaxSize?: boolean
}) {
  return (
    <section
      className="ndjc-inline-empty-state"
      style={{
        ...apkInlineEmptyStateRootStyle,
        minHeight: fillParentMaxSize ? 0 : undefined,
        height: fillParentMaxSize ? '100%' : undefined,
        flex: fillParentMaxSize ? '1 1 auto' : undefined,
        alignSelf: fillParentMaxSize ? 'stretch' : undefined,
        padding: `${verticalPadding}px 0`,
        boxSizing: 'border-box'
      }}
    >
      <div style={apkInlineEmptyStateColumnStyle}>
        <p style={apkInlineEmptyStateTitleStyle}>
          {title}
        </p>

        <p style={apkInlineEmptyStateMessageStyle}>
          {message}
        </p>

        {action ? (
          <div
            style={{
              marginTop: 8,
              display: 'grid',
              placeItems: 'center'
            }}
          >
            {action}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function NdjcPaginationFooter({
  pagination,
  idleText = 'Load more',
  loadingText = 'Loading more...',
  endText = 'No more items',
  onLoadMore
}: {
  pagination: ShowcasePaginationUiState
  idleText?: string
  loadingText?: string
  endText?: string
  onLoadMore?: () => Promise<void> | void
}) {
  if (pagination.isLoadingMore) {
    return (
      <footer className="ndjc-pagination-footer" style={apkNoMoreListFooterStyle}>
        {loadingText}
      </footer>
    )
  }

  if (pagination.hasMore && idleText.trim()) {
    return (
      <footer className="ndjc-pagination-footer" style={apkNoMoreListFooterStyle}>
        <button
          type="button"
          onClick={() => {
            if (onLoadMore) {
              void Promise.resolve(onLoadMore())
            }
          }}
          style={{
            margin: 0,
            padding: '8px 14px',
            border: 'none',
            borderRadius: 999,
            background: 'transparent',
            color: APK_CORE_UI.noMoreTextColor,
            font: 'inherit',
            cursor: onLoadMore ? 'pointer' : 'default'
          }}
        >
          {idleText}
        </button>
      </footer>
    )
  }

  if (!pagination.hasMore && endText.trim()) {
    return (
      <footer className="ndjc-pagination-footer" style={apkNoMoreListFooterStyle}>
        — {endText} —
      </footer>
    )
  }

  return null
}

export function NdjcNoMoreListFooter({
  text = 'No more items'
}: {
  text?: string
}) {
  return (
    <NdjcPaginationFooter
      pagination={{
        hasMore: false,
        isLoadingMore: false
      }}
      endText={text}
    />
  )
}

function ndjcShouldLoadMoreFromScroll(
  element: HTMLElement,
  thresholdPx = 120
): boolean {
  return element.scrollHeight - element.scrollTop - element.clientHeight <= thresholdPx
}

function ndjcShouldLoadOlderFromScroll(
  element: HTMLElement,
  thresholdPx = 80
): boolean {
  return element.scrollTop <= thresholdPx
}

function ndjcHandleLoadMoreScroll(
  event: React.UIEvent<HTMLElement>,
  pagination: ShowcasePaginationUiState,
  onLoadMore: () => Promise<void> | void,
  thresholdPx = 120
): void {
  if (pagination.isLoadingMore || !pagination.hasMore) return

  const element = event.currentTarget

  if (!ndjcShouldLoadMoreFromScroll(element, thresholdPx)) return

  void Promise.resolve(onLoadMore())
}

function ndjcHandleLoadOlderScroll(
  event: React.UIEvent<HTMLElement>,
  pagination: ShowcasePaginationUiState,
  onLoadOlder: () => Promise<void> | void,
  thresholdPx = 80
): void {
  if (pagination.isLoadingMore || !pagination.hasMore) return

  const element = event.currentTarget

  if (!ndjcShouldLoadOlderFromScroll(element, thresholdPx)) return

  void Promise.resolve(onLoadOlder())
}

export function NdjcSnackbarHost({
  message,
  onDismiss,
  durationMs = 3000
}: {
  message?: string | null
  onDismiss?: () => void
  durationMs?: number
}) {
  const normalizedMessage = String(message || '').trim()
  const [visible, setVisible] = React.useState(false)
  const onDismissRef = React.useRef(onDismiss)

  React.useEffect(() => {
    onDismissRef.current = onDismiss
  }, [onDismiss])

  React.useEffect(() => {
    if (!normalizedMessage) {
      setVisible(false)
      return
    }

    setVisible(true)

    const timer = window.setTimeout(() => {
      setVisible(false)
      onDismissRef.current?.()
    }, durationMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [normalizedMessage, durationMs])

  if (!normalizedMessage || !visible) return null

  return (
    <section className="ndjc-snackbar-host" style={apkSnackbarHostStyle} role="status">
      <div style={apkSnackbarSurfaceStyle}>
        <p style={apkSnackbarTextStyle}>
          {normalizedMessage}
        </p>
      </div>
    </section>
  )
}

export function NdjcSyncErrorBanner({
  message,
  onRetry,
  onDismiss
}: {
  message?: string | null
  onRetry?: () => void
  onDismiss?: () => void
}) {
  if (!message) return null

  return (
    <section className="ndjc-sync-error-banner" style={apkSyncErrorBannerOuterStyle}>
      <div style={apkSyncErrorBannerSurfaceStyle}>
        <p style={apkSyncErrorBannerTextStyle}>
          {message}
        </p>

        {onRetry ? (
          <button
            type="button"
            style={apkSyncErrorBannerButtonStyle}
            onClick={onRetry}
          >
            Retry
          </button>
        ) : null}

        {onDismiss ? (
          <button
            type="button"
            style={apkSyncErrorBannerButtonStyle}
            onClick={onDismiss}
          >
            Close
          </button>
        ) : null}
      </div>
    </section>
  )
}

export function NdjcOfflineStatusBanner({
  message
}: {
  message?: string | null
}) {
  const normalizedMessage = String(message || '').trim()

  if (!normalizedMessage) return null

  return (
    <section
      className="ndjc-offline-status-banner"
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: 'calc(50vw - min(50vw, 240px) + 12px)',
        top: 'calc(2px + env(safe-area-inset-top))',
        zIndex: 1000001,
        width: 'calc(min(100vw, 480px) - 24px)',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: 'fit-content',
          maxWidth: '100%',
          height: 34,
          minHeight: 34,
          borderRadius: 999,
          padding: '0 13px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: 'rgba(17, 24, 39, 0.88)',
          color: '#ffffff',
          boxShadow: '0 12px 28px rgba(15, 23, 42, 0.22)',
          boxSizing: 'border-box',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 20,
            height: 34,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            flexShrink: 0,
            lineHeight: 0
          }}
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            focusable="false"
            style={{
              display: 'block'
            }}
          >
            <path
              d="M3.75 8.7A14.5 14.5 0 0 1 12 6.1c2.05 0 4 .43 5.75 1.2"
              stroke="currentColor"
              strokeWidth="2.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.1 12.05A8.7 8.7 0 0 1 12 10.55c1.1 0 2.15.2 3.1.58"
              stroke="currentColor"
              strokeWidth="2.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.25 15.35A3.85 3.85 0 0 1 12 14.95c.38 0 .75.05 1.1.16"
              stroke="currentColor"
              strokeWidth="2.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 19.2h.01"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.8 4.8l14.4 14.4"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <p
          style={{
            margin: 0,
            minWidth: 0,
            height: 34,
            color: '#ffffff',
            fontSize: 12,
            lineHeight: '34px',
            fontWeight: 900,
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {normalizedMessage}
        </p>
      </div>
    </section>
  )
}

function notificationOptInMessageText(messageCode: ShowcaseNotificationMessageCode): string | null {
  if (messageCode === 'notifications-allowed-auto') {
    return 'Notifications are allowed. This device will stay registered automatically.'
  }

  if (messageCode === 'notifications-blocked-site-settings') {
    return 'Notifications are blocked for this site. Enable them from your browser site settings.'
  }

  if (messageCode === 'notifications-unsupported-browser') {
    return 'Notifications are not supported in this browser.'
  }

  if (messageCode === 'offline-reconnect') {
    return 'You are offline. Please reconnect and try again.'
  }

  if (messageCode === 'notifications-blocked-enable-site-settings') {
    return 'Notifications are blocked. Enable them from your browser site settings.'
  }

  if (messageCode === 'notifications-not-enabled-try-later') {
    return 'Notifications were not enabled. You can try again later.'
  }

  if (messageCode === 'push-registration-failed-after-allowed') {
    return 'Notifications were allowed, but push registration failed.'
  }

  if (messageCode === 'device-registration-failed') {
    return 'Device registration failed. Try again later.'
  }

  if (messageCode === 'notifications-enabled-device') {
    return 'Notifications are enabled for this device.'
  }

  if (messageCode === 'notifications-active') {
    return 'Notifications are active.'
  }

  if (messageCode === 'push-registration-failed-check-connection') {
    return 'Push registration failed. Check your connection and try again.'
  }

  return null
}

export function NdjcPwaUpdateBanner({
  refreshing,
  onRefresh,
  onDismiss
}: {
  refreshing: boolean
  onRefresh: () => void
  onDismiss: () => void
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: 16,
        right: 16,
        top: 'calc(8px + env(safe-area-inset-top))',
        zIndex: 1000002,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        boxSizing: 'border-box'
      }}
    >
      <style>
        {`
          .ndjc-pwa-update-banner {
            border: 1px solid rgba(17, 24, 39, 0.08) !important;
            background: rgba(255, 255, 255, 0.96) !important;
          }

          .ndjc-pwa-update-banner::before,
          .ndjc-pwa-update-banner::after {
            display: none !important;
            content: none !important;
          }

          .ndjc-pwa-update-secondary-button {
            width: 72px !important;
            min-width: 72px !important;
            max-width: 72px !important;
            min-height: 34px !important;
            height: 34px !important;
            padding: 0 10px !important;
            border-radius: 999px !important;
            background: #f3f4f6 !important;
            color: #374151 !important;
            border: 1px solid rgba(17, 24, 39, 0.08) !important;
            box-shadow: none !important;
            font-size: 12px !important;
            line-height: 1 !important;
            font-weight: 900 !important;
            white-space: nowrap !important;
            overflow: visible !important;
            text-overflow: clip !important;
          }

          .ndjc-pwa-update-primary-button {
            width: 72px !important;
            min-width: 72px !important;
            max-width: 72px !important;
            min-height: 34px !important;
            height: 34px !important;
            padding: 0 10px !important;
            border-radius: 999px !important;
            font-size: 12px !important;
            line-height: 1 !important;
            font-weight: 900 !important;
            white-space: nowrap !important;
            overflow: visible !important;
            text-overflow: clip !important;
          }

          .ndjc-pwa-update-secondary-button:active,
          .ndjc-pwa-update-primary-button:active {
            transform: scale(0.98);
          }
        `}
      </style>

      <NdjcWhiteCard
        className="ndjc-pwa-update-banner"
        style={{
          width: '100%',
          maxWidth: 404,
          borderRadius: 20,
          padding: '10px 12px',
          pointerEvents: 'auto',
          boxShadow: '0 12px 34px rgba(15, 23, 42, 0.16)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '28px 1fr auto',
            gap: 9,
            alignItems: 'center'
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(251, 139, 139, 0.16), rgba(45, 212, 191, 0.16))',
              color: '#fb7185',
              boxShadow: 'inset 0 0 0 1px rgba(251, 139, 139, 0.18)',
              lineHeight: 1,
              flexShrink: 0
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
              style={{
                display: 'block'
              }}
            >
              <path
                d="M20 6.5V11h-4.5"
                stroke="#fb7185"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.1 11A7.25 7.25 0 0 0 6.6 6.2L5.3 7.5"
                stroke="#fb7185"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 17.5V13h4.5"
                stroke="#14b8a6"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.9 13A7.25 7.25 0 0 0 17.4 17.8l1.3-1.3"
                stroke="#14b8a6"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div style={{ minWidth: 0 }}>
            <h2
              style={{
                margin: 0,
                color: '#111827',
                fontSize: 13,
                lineHeight: 1.2,
                fontWeight: 900,
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              New version available
            </h2>

            <p
              style={{
                margin: '3px 0 0',
                color: 'rgba(17, 24, 39, 0.62)',
                fontSize: 11,
                lineHeight: 1.25,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Refresh to use the latest app files.
            </p>
          </div>

          <div
            style={{
              width: 151,
              minWidth: 151,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 7,
              flexShrink: 0
            }}
          >
            <NdjcPrimaryActionButton
              className="ndjc-pwa-update-secondary-button"
              onClick={onDismiss}
              disabled={refreshing}
              isLoading={false}
            >
              Later
            </NdjcPrimaryActionButton>

            <NdjcPrimaryActionButton
              className="ndjc-pwa-update-primary-button"
              onClick={onRefresh}
              disabled={refreshing}
              isLoading={refreshing}
            >
              Refresh
            </NdjcPrimaryActionButton>
          </div>
        </div>
      </NdjcWhiteCard>
    </div>
  )
}

export function NdjcNotificationOptInPanel({
  open,
  busy,
  registered,
  permissionState,
  registrationState,
  messageCode,
  installState,
  installBusy,
  onRegister,
  onInstall
}: {
  open: boolean
  busy: boolean
  registered: boolean
  permissionState: ShowcaseNotificationPermissionState
  registrationState: ShowcaseNotificationRegistrationState
  messageCode: ShowcaseNotificationMessageCode
  installState: ShowcasePwaInstallState
  installBusy: boolean
  onRegister: () => void
  onInstall: () => void
}) {
  const messageText = notificationOptInMessageText(messageCode)
  const blocked = permissionState === 'denied'
  const failed = registrationState === 'failed'
  const ready = permissionState === 'granted' && registrationState !== 'registered'
  const title = registrationState === 'registered'
    ? 'Notifications on'
    : blocked
      ? 'Notifications blocked'
      : failed
        ? 'Notifications need attention'
        : ready
          ? 'Notifications ready'
          : 'Enable notifications'
  const description = registrationState === 'registered'
    ? 'Messages, bookings, and announcements are active.'
    : blocked
      ? 'Allow notifications in browser site settings, then retry.'
      : failed
        ? 'Check your connection and try again.'
        : ready
          ? 'Turn on alerts for this device.'
          : 'Get alerts for messages, booking updates, and announcements.'
  const statusLabel = registrationState === 'registered'
    ? 'Registered'
    : blocked
      ? 'Blocked'
      : failed
        ? 'Failed'
        : ready
          ? 'Allowed'
          : 'Not registered'
  const actionLabel = busy
    ? 'Saving...'
    : registrationState === 'registered'
      ? 'Refresh'
      : blocked
        ? 'Retry'
        : failed
          ? 'Retry'
          : ready
            ? 'Turn on'
            : 'Enable'
  const installAvailable = installState === 'available'
  const installManualIos = installState === 'manual-ios'
  const installSafariRequired = installState === 'manual-safari-required'
  const installInstalled = installState === 'installed'
  const installStatusLabel = installInstalled
    ? 'Installed'
    : installAvailable
      ? 'Available'
      : installManualIos
        ? 'Manual setup'
        : installSafariRequired
          ? 'Safari required'
          : 'Not available'
  const installTitle = installInstalled
    ? 'Added to Home Screen'
    : 'Add to Home Screen'
  const installDescription = installInstalled
    ? 'This app is already available from your home screen.'
    : installAvailable
      ? 'Install this app for faster access from your device.'
      : installManualIos
        ? 'In Safari, tap Share, then Add to Home Screen.'
        : installSafariRequired
          ? 'Open this page in Safari, then tap Share and Add to Home Screen.'
          : 'Your browser may show install options from its menu.'
  const installActionLabel = installBusy ? 'Opening...' : 'Install App'

  return (
    <div
      aria-hidden={!open}
      style={{
        position: 'fixed',
        left: 'calc(50vw + min(50vw, 240px) - min(280px, calc(100vw - 32px)) - 16px)',
        bottom: open ? 'calc(121px + env(safe-area-inset-bottom))' : -1000,
        zIndex: 999999,
        width: 'min(280px, calc(100vw - 32px))',
        pointerEvents: open ? 'auto' : 'none',
        transition: 'bottom 180ms ease, opacity 160ms ease, transform 160ms ease',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0)' : 'translateY(8px)'
      }}
    >
      <NdjcWhiteCard
        className="ndjc-notification-opt-in-panel"
        style={{
          borderRadius: 20,
          padding: '10px 10px 9px',
          border: '1px solid rgba(17, 24, 39, 0.08)',
          background: 'rgba(255, 255, 255, 0.96)',
          boxShadow: '0 14px 38px rgba(15, 23, 42, 0.18)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxSizing: 'border-box'
        }}
      >
        <style>
          {`
            .ndjc-notification-opt-in-panel {
              box-sizing: border-box;
            }

            .ndjc-notification-opt-in-panel::before,
            .ndjc-notification-opt-in-panel::after {
              display: none !important;
              content: none !important;
            }

            .ndjc-notification-action-button {
              min-height: 32px !important;
              height: 32px !important;
              border-radius: 999px !important;
              font-size: 13px !important;
              font-weight: 900 !important;
            }
          `}
        </style>

        <div
          style={{
            display: 'grid',
            gap: 10
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: 2
            }}
          >
            <h2
              style={{
                margin: 0,
                color: '#111827',
                fontSize: 16,
                lineHeight: 1.18,
                fontWeight: 900,
                letterSpacing: '-0.02em'
              }}
            >
              App setup
            </h2>
            <p
              style={{
                margin: 0,
                color: 'rgba(17, 24, 39, 0.58)',
                fontSize: 11,
                lineHeight: 1.35,
                fontWeight: 700
              }}
            >
              Set up alerts and quick access for this app.
            </p>
          </div>

          <div
            style={{
              height: 1,
              background: 'rgba(15, 23, 42, 0.08)'
            }}
          />

          <div
            style={{
              color: '#64748b',
              fontSize: 11,
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            Notifications
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '30px 1fr',
              gap: 8,
              alignItems: 'start'
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: registered
                  ? 'linear-gradient(135deg, rgba(236, 253, 245, 0.98), rgba(209, 250, 229, 0.92))'
                  : blocked || failed
                    ? 'linear-gradient(135deg, rgba(255, 241, 242, 0.98), rgba(255, 228, 230, 0.92))'
                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.98), rgba(241, 245, 249, 0.92))',
                color: registered
                  ? '#047857'
                  : blocked || failed
                    ? '#be123c'
                    : '#111827',
                boxShadow: registered
                  ? 'inset 0 0 0 1px rgba(4, 120, 87, 0.14), 0 6px 14px rgba(4, 120, 87, 0.10)'
                  : blocked || failed
                    ? 'inset 0 0 0 1px rgba(190, 18, 60, 0.14), 0 6px 14px rgba(190, 18, 60, 0.08)'
                    : 'inset 0 0 0 1px rgba(17, 24, 39, 0.08), 0 6px 14px rgba(15, 23, 42, 0.08)',
                flexShrink: 0,
                position: 'relative',
                marginTop: 1
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                focusable="false"
                style={{
                  display: 'block'
                }}
              >
                <path
                  d="M12 3.75c-3.05 0-5.45 2.45-5.45 5.55v2.3c0 1.28-.45 2.52-1.28 3.49L4.35 16.2c-.54.64-.08 1.62.76 1.62h13.78c.84 0 1.3-.98.76-1.62l-.92-1.11a5.37 5.37 0 0 1-1.28-3.49V9.3c0-3.1-2.4-5.55-5.45-5.55Z"
                  stroke="currentColor"
                  strokeWidth="2.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.7 19.25c.42.75 1.22 1.25 2.3 1.25s1.88-.5 2.3-1.25"
                  stroke="currentColor"
                  strokeWidth="2.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.75 6.05c.72.62 1.18 1.52 1.25 2.55"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              </svg>

              {registered ? (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: 4,
                    top: 4,
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: '#10b981',
                    boxShadow: '0 0 0 2px rgba(236, 253, 245, 0.98)'
                  }}
                />
              ) : null}

              {blocked || failed ? (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: 4,
                    top: 4,
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: '#fb7185',
                    boxShadow: '0 0 0 2px rgba(255, 241, 242, 0.98)'
                  }}
                />
              ) : null}
            </div>

            <div
              style={{
                minWidth: 0,
                display: 'grid',
                gap: 4
              }}
            >
              <span
                style={{
                  width: 'fit-content',
                  height: 22,
                  padding: '0 9px',
                  borderRadius: 999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  background: registrationState === 'registered'
                    ? 'rgba(236, 253, 245, 0.92)'
                    : blocked || failed
                      ? 'rgba(255, 241, 242, 0.92)'
                      : '#f8fafc',
                  color: registrationState === 'registered'
                    ? '#047857'
                    : blocked || failed
                      ? '#be123c'
                      : '#475569',
                  border: registrationState === 'registered'
                    ? '1px solid rgba(4, 120, 87, 0.14)'
                    : blocked || failed
                      ? '1px solid rgba(190, 18, 60, 0.14)'
                      : '1px solid rgba(71, 85, 105, 0.14)',
                  fontSize: 11,
                  lineHeight: 1,
                  fontWeight: 900,
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: registrationState === 'registered'
                      ? '#10b981'
                      : blocked || failed
                        ? '#fb7185'
                        : '#94a3b8',
                    flexShrink: 0
                  }}
                />
                {statusLabel}
              </span>

              <h2
                style={{
                  margin: 0,
                  color: '#111827',
                  fontSize: 16,
                  lineHeight: 1.18,
                  fontWeight: 900,
                  letterSpacing: '-0.02em'
                }}
              >
                {title}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: 'rgba(17, 24, 39, 0.66)',
                  fontSize: 12,
                  lineHeight: 1.35,
                  fontWeight: 600
                }}
              >
                {description}
              </p>
            </div>
          </div>

          {messageText ? (
            <div
              role="status"
              aria-live="polite"
              style={{
                borderRadius: 14,
                padding: '8px 10px',
                background: registered
                  ? '#ecfdf5'
                  : 'rgba(254, 242, 242, 0.92)',
                color: registered
                  ? '#047857'
                  : '#b91c1c',
                fontSize: 11,
                lineHeight: 1.35,
                fontWeight: 800
              }}
            >
              {messageText}
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <div style={{ width: 116 }}>
              <NdjcPrimaryActionButton
                className="ndjc-notification-action-button"
                onClick={onRegister}
                disabled={busy}
                isLoading={busy}
              >
                {actionLabel}
              </NdjcPrimaryActionButton>
            </div>
          </div>

          <div
            style={{
              height: 1,
              background: 'rgba(15, 23, 42, 0.08)'
            }}
          />

          <div
            style={{
              color: '#64748b',
              fontSize: 11,
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            Home screen
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '30px 1fr',
              gap: 8,
              alignItems: 'start'
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: installInstalled
                  ? 'linear-gradient(135deg, rgba(236, 253, 245, 0.98), rgba(209, 250, 229, 0.92))'
                  : installAvailable
                    ? 'linear-gradient(135deg, rgba(239, 246, 255, 0.98), rgba(219, 234, 254, 0.92))'
                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.98), rgba(241, 245, 249, 0.92))',
                color: installInstalled
                  ? '#047857'
                  : installAvailable
                    ? '#1d4ed8'
                    : '#475569',
                boxShadow: installInstalled
                  ? 'inset 0 0 0 1px rgba(4, 120, 87, 0.14), 0 6px 14px rgba(4, 120, 87, 0.10)'
                  : installAvailable
                    ? 'inset 0 0 0 1px rgba(29, 78, 216, 0.14), 0 6px 14px rgba(29, 78, 216, 0.08)'
                    : 'inset 0 0 0 1px rgba(17, 24, 39, 0.08), 0 6px 14px rgba(15, 23, 42, 0.08)',
                flexShrink: 0,
                position: 'relative',
                marginTop: 1
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                focusable="false"
                style={{
                  display: 'block'
                }}
              >
                <rect
                  x="7"
                  y="2.75"
                  width="10"
                  height="18.5"
                  rx="2.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M10.25 17.75h3.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
                <path
                  d="M9.5 6.25h5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>

              {installInstalled ? (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: 4,
                    top: 4,
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: '#10b981',
                    boxShadow: '0 0 0 2px rgba(236, 253, 245, 0.98)'
                  }}
                />
              ) : null}
            </div>

            <div
              style={{
                minWidth: 0,
                display: 'grid',
                gap: 4
              }}
            >
              <span
                style={{
                  width: 'fit-content',
                  height: 22,
                  padding: '0 9px',
                  borderRadius: 999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  background: installInstalled
                    ? 'rgba(236, 253, 245, 0.92)'
                    : installAvailable
                      ? 'rgba(239, 246, 255, 0.92)'
                      : '#f8fafc',
                  color: installInstalled
                    ? '#047857'
                    : installAvailable
                      ? '#1d4ed8'
                      : '#475569',
                  border: installInstalled
                    ? '1px solid rgba(4, 120, 87, 0.14)'
                    : installAvailable
                      ? '1px solid rgba(29, 78, 216, 0.14)'
                      : '1px solid rgba(71, 85, 105, 0.14)',
                  fontSize: 11,
                  lineHeight: 1,
                  fontWeight: 900,
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: installInstalled
                      ? '#10b981'
                      : installAvailable
                        ? '#3b82f6'
                        : '#94a3b8',
                    flexShrink: 0
                  }}
                />
                {installStatusLabel}
              </span>

              <h2
                style={{
                  margin: 0,
                  color: '#111827',
                  fontSize: 16,
                  lineHeight: 1.18,
                  fontWeight: 900,
                  letterSpacing: '-0.02em'
                }}
              >
                {installTitle}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: 'rgba(17, 24, 39, 0.66)',
                  fontSize: 12,
                  lineHeight: 1.35,
                  fontWeight: 600
                }}
              >
                {installDescription}
              </p>
            </div>
          </div>

          {installAvailable ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <div style={{ width: 116 }}>
                <NdjcPrimaryActionButton
                  className="ndjc-notification-action-button"
                  onClick={onInstall}
                  disabled={installBusy}
                  isLoading={installBusy}
                >
                  {installActionLabel}
                </NdjcPrimaryActionButton>
              </div>
            </div>
          ) : null}
        </div>
      </NdjcWhiteCard>
    </div>
  )
}

export function NdjcNotificationOptInFloatingButton({
  open,
  permissionState,
  registrationState,
  onToggle
}: {
  open: boolean
  permissionState: ShowcaseNotificationPermissionState
  registrationState: ShowcaseNotificationRegistrationState
  onToggle: () => void
}) {
  const registered = registrationState === 'registered'
  const blocked = permissionState === 'denied'
  const failed = registrationState === 'failed'
  const hasProblem = failed || blocked
  const ariaLabel = open ? 'Close app setup' : 'Open app setup'
  const iconTint = APK_SHELL_UI.white

  const notificationIcon = open ? (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        color: 'currentColor',
        fontSize: APK_SHELL_UI.backButtonIconSize,
        lineHeight: 1,
        fontWeight: 900,
        transform: 'translateY(-1px)'
      }}
    >
      ×
    </span>
  ) : (
    <span
      aria-hidden="true"
      style={{
        position: 'relative',
        width: APK_SHELL_UI.backButtonIconSize,
        height: APK_SHELL_UI.backButtonIconSize,
        display: 'grid',
        placeItems: 'center',
        color: 'currentColor',
        lineHeight: 0
      }}
    >
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
        style={{
          display: 'block'
        }}
      >
        <path
          d="M12 3.25c-3.35 0-5.95 2.68-5.95 6.05v2.3c0 1.16-.41 2.29-1.16 3.17l-.92 1.1c-.83.98-.13 2.48 1.15 2.48h13.76c1.28 0 1.98-1.5 1.15-2.48l-.92-1.1a4.9 4.9 0 0 1-1.16-3.17V9.3c0-3.37-2.6-6.05-5.95-6.05Z"
          fill="currentColor"
        />
        <path
          d="M9.3 19.25c.47 1.08 1.42 1.75 2.7 1.75s2.23-.67 2.7-1.75H9.3Z"
          fill="currentColor"
        />
      </svg>

      {registered ? (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 8,
            height: 8,
            borderRadius: 999,
            background: '#10b981',
            boxShadow: '0 0 0 2px #ffffff'
          }}
        />
      ) : null}

      {hasProblem ? (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 8,
            height: 8,
            borderRadius: 999,
            background: '#be123c',
            boxShadow: '0 0 0 2px #ffffff'
          }}
        />
      ) : null}
    </span>
  )

  return (
    <div
      style={{
        position: 'fixed',
        left: 'calc(50vw + min(50vw, 240px) - 50px - 16px)',
        bottom: 'calc(63px + env(safe-area-inset-bottom))',
        zIndex: 1000000,
        width: 50,
        height: 50,
        pointerEvents: 'auto'
      }}
    >
      <NdjcCardBackButton
        onClick={onToggle}
        label={ariaLabel}
        icon={notificationIcon}
        iconOnly={false}
        iconTint={iconTint}
      />
    </div>
  )
}

export function NdjcBaseDialog({
  title,
  message,
  children,
  textContent,
  confirmText = 'OK',
  cancelText = 'Cancel',
  dismissText,
  onConfirm,
  onConfirmClick,
  onCancel,
  onDismissClick,
  onDismissRequest,
  confirmEnabled = true,
  confirmLoading = false,
  destructiveConfirm = false
}: {
  title: string
  message?: string | null
  children?: React.ReactNode
  textContent?: React.ReactNode
  dismissText?: string | null
  onConfirmClick?: () => void
  onDismissClick?: () => void
} & NdjcDialogActions) {
  const resolvedConfirmText = confirmText
  const resolvedDismissText = dismissText ?? cancelText
  const handleDismissRequest = onDismissRequest || onDismissClick || onCancel
  const handleDismissClick = onDismissClick || onCancel
  const handleConfirmClick = onConfirmClick || onConfirm
  const confirmBlocked = !confirmEnabled || confirmLoading

  return (
    <section
      className="ndjc-dialog-backdrop"
      style={apkDialogBackdropStyle}
      onMouseDown={event => {
        if (event.target === event.currentTarget) {
          if (confirmLoading) return
          handleDismissRequest?.()
        }
      }}
    >
      <section
        className="ndjc-base-dialog"
        style={apkDialogSurfaceStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ndjc-base-dialog-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <h2 id="ndjc-base-dialog-title" style={apkDialogTitleStyle}>
          {title}
        </h2>

        {textContent ? (
          <div className="ndjc-base-dialog-content" style={apkDialogContentStyle}>
            {textContent}
          </div>
        ) : children ? (
          <div className="ndjc-base-dialog-content" style={apkDialogContentStyle}>
            {children}
          </div>
        ) : message?.trim() ? (
          <p style={apkDialogMessageStyle}>
            {message}
          </p>
        ) : null}

        <footer style={apkDialogActionsStyle}>
          {resolvedDismissText && handleDismissClick ? (
            <button
              type="button"
              style={apkDialogTextButtonStyle({
                disabled: confirmLoading
              })}
              disabled={confirmLoading}
              onClick={() => {
                if (confirmLoading) return
                handleDismissClick()
              }}
            >
              {resolvedDismissText}
            </button>
          ) : null}

          {handleConfirmClick ? (
            <button
              type="button"
              style={apkDialogTextButtonStyle({
                primary: !destructiveConfirm,
                destructive: destructiveConfirm,
                disabled: confirmBlocked
              })}
              disabled={confirmBlocked}
              onClick={handleConfirmClick}
              aria-busy={confirmLoading || undefined}
            >
              {confirmLoading ? (
                <NdjcSpinner
                  className="ndjc-dialog-action-spinner"
                  size={16}
                  stroke={2}
                  tone={destructiveConfirm ? 'danger' : 'primary'}
                />
              ) : (
                resolvedConfirmText
              )}
            </button>
          ) : null}
        </footer>
      </section>
    </section>
  )
}

export function DeleteConfirmDialog({
  title = 'Confirm deletion',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onDismissRequest,
  confirmEnabled = true
}: {
  title?: string
  message?: string
} & NdjcDialogActions) {
  const handleDismiss = onDismissRequest || onCancel

  return (
    <section
      className="ndjc-dialog-backdrop ndjc-delete-confirm-dialog-backdrop"
      style={apkDialogBackdropStyle}
      onMouseDown={event => {
        if (event.target === event.currentTarget) {
          handleDismiss?.()
        }
      }}
    >
      <section
        className="ndjc-base-dialog ndjc-delete-confirm-dialog"
        style={apkDialogSurfaceStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ndjc-delete-dialog-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <h2 id="ndjc-delete-dialog-title" style={{ ...apkDialogTitleStyle, fontSize: 18 }}>
          {title}
        </h2>

        <p style={apkDialogMessageStyle}>
          {message}
        </p>

        <footer style={apkDialogActionsStyle}>
          <button
            type="button"
            style={apkDialogTextButtonStyle({ destructive: true, disabled: !confirmEnabled })}
            disabled={!confirmEnabled}
            onClick={onConfirm}
          >
            {confirmText}
          </button>

          <button
            type="button"
            style={apkDialogTextButtonStyle()}
            onClick={onCancel || onDismissRequest}
          >
            {cancelText}
          </button>
        </footer>
      </section>
    </section>
  )
}

export function DeleteConfirmDialogPreview() {
  return (
    <DeleteConfirmDialog
      title="Confirm deletion"
      message="This action cannot be undone."
      onConfirm={() => {}}
      onCancel={() => {}}
    />
  )
}

export function SheetHeader({
  title,
  clearText = 'Clear',
  showAction = true,
  onClear
}: {
  title: string
  clearText?: string
  showAction?: boolean
  onClear?: () => void
}) {
  return (
    <header className="ndjc-sheet-header" style={apkSheetHeaderRootStyle}>
      <div className="ndjc-sheet-header-row" style={apkSheetHeaderRowStyle}>
        <h2 id="ndjc-filter-bottom-sheet-title" style={apkSheetHeaderTitleStyle}>
          {title}
        </h2>

        {showAction && onClear ? (
          <NdjcPillButton
            selected={false}
            onClick={onClear}
            className="ndjc-sheet-clear-pill"
          >
            {clearText}
          </NdjcPillButton>
        ) : null}
      </div>

      <div className="ndjc-sheet-header-divider" style={apkSheetDividerStyle} aria-hidden="true" />
    </header>
  )
}

function NdjcFilterBottomSheet({
  open,
  title = 'Filter',
  clearText = 'Clear',
  applyText = 'Apply',
  children,
  onClose,
  onApply,
  onClear,
  priceMinDraft = '',
  onPriceMinDraftChange,
  priceMaxDraft = '',
  onPriceMaxDraftChange,
  showPriceFields = false,
  showHeaderAction = true,
  showApplyButton = true,
  applyLoading = false
}: {
  open: boolean
  title?: string
  clearText?: string
  applyText?: string
  children: React.ReactNode
  onClose: () => void
  onApply?: () => void
  onClear?: () => void
  priceMinDraft?: string
  onPriceMinDraftChange?: (value: string) => void
  priceMaxDraft?: string
  onPriceMaxDraftChange?: (value: string) => void
  showPriceFields?: boolean
  showHeaderAction?: boolean
  showApplyButton?: boolean
  applyLoading?: boolean
}) {
  const sheetRef = React.useRef<HTMLElement | null>(null)
  const dragStartYRef = React.useRef<number | null>(null)
  const dragDeltaYRef = React.useRef(0)
  const closeTimerRef = React.useRef<number | null>(null)
  const openFrameRef = React.useRef<number | null>(null)
  const onCloseRef = React.useRef(onClose)
  const [dragOffsetY, setDragOffsetY] = React.useState(0)
  const [sheetVisible, setSheetVisible] = React.useState(false)

  React.useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  React.useEffect(() => {
    if (!open) {
      dragStartYRef.current = null
      dragDeltaYRef.current = 0
      setDragOffsetY(0)
      setSheetVisible(false)
      return
    }

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    setSheetVisible(false)

    openFrameRef.current = window.requestAnimationFrame(() => {
      openFrameRef.current = null
      setSheetVisible(true)
    })

    function handleWindowKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault()
        requestClose()
      }
    }

    window.addEventListener('keydown', handleWindowKeyDown)

    return () => {
      window.removeEventListener('keydown', handleWindowKeyDown)
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow

      if (openFrameRef.current != null) {
        window.cancelAnimationFrame(openFrameRef.current)
        openFrameRef.current = null
      }

      if (closeTimerRef.current != null) {
        window.clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
    }
  }, [open])

  if (!open) return null

  function requestClose(): void {
    if (closeTimerRef.current != null) return

    dragStartYRef.current = null
    dragDeltaYRef.current = 0
    setDragOffsetY(0)
    setSheetVisible(false)

    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null
      onCloseRef.current()
    }, 220)
  }

  function handleBackdropPointerDown(event: React.PointerEvent<HTMLElement>): void {
    if (event.target === event.currentTarget) {
      requestClose()
    }
  }

  function handleSheetPointerDown(event: React.PointerEvent<HTMLElement>): void {
    event.stopPropagation()
  }

  function handleDragHandlePointerDown(event: React.PointerEvent<HTMLElement>): void {
    dragStartYRef.current = event.clientY
    dragDeltaYRef.current = 0
    setDragOffsetY(0)
    event.currentTarget.setPointerCapture?.(event.pointerId)
    event.preventDefault()
    event.stopPropagation()
  }

  function handleDragHandlePointerMove(event: React.PointerEvent<HTMLElement>): void {
    if (dragStartYRef.current == null) return

    const deltaY = Math.max(0, event.clientY - dragStartYRef.current)
    dragDeltaYRef.current = deltaY
    setDragOffsetY(deltaY)
    event.preventDefault()
    event.stopPropagation()
  }

  function finishDrag(): void {
    if (dragStartYRef.current == null) return

    const shouldDismiss = dragDeltaYRef.current >= APK_FILTER_UI.sheetDragDismissThreshold
    dragStartYRef.current = null
    dragDeltaYRef.current = 0

    if (shouldDismiss) {
      requestClose()
      return
    }

    setDragOffsetY(0)
  }

  function handleDragHandlePointerUp(event: React.PointerEvent<HTMLElement>): void {
    event.preventDefault()
    event.stopPropagation()
    finishDrag()
  }

  function handleDragHandlePointerCancel(event: React.PointerEvent<HTMLElement>): void {
    event.preventDefault()
    event.stopPropagation()
    finishDrag()
  }

  function handleClearClick(): void {
    onClear?.()
  }

  function handleApplyClick(): void {
    onApply?.()
  }

  return (
    <section
      className="ndjc-sheet-backdrop"
      style={{
        ...apkSheetBackdropStyle,
        opacity: sheetVisible ? 1 : 0,
        transition: 'opacity 180ms ease',
        pointerEvents: sheetVisible ? 'auto' : 'none'
      }}
      onPointerDown={handleBackdropPointerDown}
    >
      <section
        ref={sheetRef}
        className="ndjc-filter-bottom-sheet"
        style={{
          ...apkSheetSurfaceStyle,
          transform: sheetVisible
            ? `translateY(${dragOffsetY}px)`
            : 'translateY(calc(100% + 24px))',
          transition: dragStartYRef.current == null
            ? 'transform 220ms cubic-bezier(0.2, 0, 0, 1)'
            : 'none',
          willChange: 'transform'
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ndjc-filter-bottom-sheet-title"
        onPointerDown={handleSheetPointerDown}
      >
        <div
          className="ndjc-filter-bottom-sheet-drag-handle-wrap"
          style={apkSheetDragHandleWrapStyle}
          onPointerDown={handleDragHandlePointerDown}
          onPointerMove={handleDragHandlePointerMove}
          onPointerUp={handleDragHandlePointerUp}
          onPointerCancel={handleDragHandlePointerCancel}
          aria-hidden="true"
        >
          <div className="ndjc-filter-bottom-sheet-drag-handle" style={apkSheetDragHandleStyle} />
        </div>

        <SheetHeader
          title={title}
          clearText={clearText}
          showAction={showHeaderAction && Boolean(onClear)}
          onClear={handleClearClick}
        />

        <div className="ndjc-filter-bottom-sheet-content" style={apkSheetContentStyle}>
          {showPriceFields ? (
            <section
              className="ndjc-filter-bottom-sheet-price-row"
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                alignItems: 'center',
                boxSizing: 'border-box'
              }}
            >
              <NdjcTextField
                label="Min price"
                value={priceMinDraft}
                onChange={onPriceMinDraftChange || (() => {})}
                placeholder="0"
                type="number"
                inputMode="decimal"
                singleLine
              />

              <NdjcTextField
                label="Max price"
                value={priceMaxDraft}
                onChange={onPriceMaxDraftChange || (() => {})}
                placeholder="999"
                type="number"
                inputMode="decimal"
                singleLine
              />
            </section>
          ) : null}

          {children}

          {showApplyButton && onApply ? (
            <>
              <div style={{ height: 6 }} aria-hidden="true" />

              <NdjcPrimaryActionButton
                className="ndjc-filter-bottom-sheet-apply"
                disabled={applyLoading}
                isLoading={applyLoading}
                onClick={() => {
                  if (applyLoading) return
                  handleApplyClick()
                }}
              >
                {applyText}
              </NdjcPrimaryActionButton>
            </>
          ) : null}
        </div>
      </section>
    </section>
  )
}
export function SmallActiveChip({
  text,
  onClick
}: {
  text: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className="ndjc-small-active-chip"
      style={apkFilterChipStyle(false)}
      onClick={onClick}
    >
      <span className="ndjc-small-active-chip-text" style={apkSmallActiveChipTextStyle}>
        {text}
      </span>

      <span
        className="ndjc-small-active-chip-remove"
        style={{
          color: APK_FILTER_UI.chipRemoveColor,
          fontWeight: 700
        }}
        aria-hidden="true"
      >
        ×
      </span>
    </button>
  )
}

export function SortNavEqualItem({
  text,
  selected,
  onClick
}: {
  text: string
  selected: boolean
  onClick: () => void
}) {
  const [pressed, setPressed] = React.useState(false)

  return (
    <div
      className="ndjc-sort-nav-equal-item-host"
      style={apkSortNavOuterItemStyle()}
      role="presentation"
    >
      <button
        type="button"
        className={cx('ndjc-sort-nav-equal-item', selected && 'is-selected')}
        style={apkSortNavItemStyle(selected, pressed)}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        onClick={onClick}
        role="tab"
        aria-selected={selected}
        aria-pressed={selected}
      >
        <span style={apkSortNavTextStyle}>{text}</span>
      </button>
    </div>
  )
}

export function SortRow({
  children,
  columns = APK_FILTER_UI.rowEqualColumns
}: {
  children: React.ReactNode
  columns?: number
}) {
  return (
    <section
      className="ndjc-sort-row"
      style={{
        width: '100%',
        padding: `0 ${APK_FILTER_UI.rowHorizontalPadding}px`,
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        alignItems: 'center',
        boxSizing: 'border-box'
      }}
      role="tablist"
      aria-label="Sort and filter"
    >
      {children}
    </section>
  )
}

export function ActiveSortFilterRow({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <section
      className="ndjc-active-sort-filter-row"
      style={{
        width: '100%',
        padding: `${APK_FILTER_UI.activeRowPaddingY}px 0`,
        ...apkFilterLazyRowStyle
      }}
      role="list"
    >
      {children}
    </section>
  )
}

export function TopSearchBar({
  value,
  placeholder = 'Search…',
  onChange,
  onProfileClick,
  onFilterClick
}: {
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onProfileClick?: () => void
  onFilterClick?: () => void
}) {
  return (
    <section className="ndjc-top-search-bar" style={apkTopSearchOuterStyle}>
      <div className="ndjc-top-search-banner" style={apkTopSearchBarStyle}>
        <div className="ndjc-top-search-inner-row" style={apkTopSearchInnerRowStyle}>
          <div className="ndjc-top-search-input-wrap" style={apkTopSearchInputWrapStyle}>
<span className="ndjc-top-search-icon" style={apkTopSearchIconStyle} aria-hidden="true">
  <NdjcSearchOutlinedIcon />
</span>

            <span aria-hidden="true" />

            <input
              value={value}
              placeholder={placeholder}
              aria-label="Search"
              style={apkTopSearchInputStyle}
              onChange={event => onChange(event.target.value)}
            />
          </div>

          {onFilterClick ? (
            <button
              type="button"
              className="ndjc-top-search-filter-button"
              style={apkTopSearchFilterButtonStyle}
              onClick={onFilterClick}
              aria-label="Filter"
            >
              Filter
            </button>
          ) : null}

{onProfileClick ? (
  <button
    type="button"
    className="ndjc-top-search-profile-button"
    style={apkTopSearchRoundButtonStyle}
    onClick={onProfileClick}
    aria-label="Profile"
  >
    <NdjcAccountCircleOutlinedIcon />
  </button>
) : null}
        </div>
      </div>
    </section>
  )
}

export function NdjcShimmerImage({
  src,
  alt,
  className,
  placeholderCornerRadius = APK_MEDIA_UI.imageRadius,
  contentScale = 'cover',
  loading = 'lazy',
  fetchPriority = 'low',
  decoding = 'async',
  imageWidth,
  imageHeight,
  sizes,
  blurDataUrl
}: {
  src?: string | null
  alt: string
  className?: string
  placeholderCornerRadius?: number
  contentScale?: React.CSSProperties['objectFit']
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
  decoding?: 'async' | 'sync' | 'auto'
  imageWidth?: number
  imageHeight?: number
  sizes?: string
  blurDataUrl?: string | null
}) {
  const cleanSrc = src?.trim() || ''
  const imageRef = React.useRef<HTMLImageElement | null>(null)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    if (!cleanSrc) {
      setLoaded(false)
      return () => {
        cancelled = true
      }
    }

    setLoaded(false)

    const currentImage = imageRef.current

    if (currentImage?.complete && currentImage.naturalWidth > 0) {
      setLoaded(true)
      return () => {
        cancelled = true
      }
    }

    const probeImage = new Image()

    probeImage.onload = () => {
      if (cancelled) return
      setLoaded(true)
    }

    probeImage.onerror = () => {
      if (cancelled) return
      setLoaded(false)
    }

    probeImage.src = cleanSrc

    return () => {
      cancelled = true
      probeImage.onload = null
      probeImage.onerror = null
    }
  }, [cleanSrc])

  return (
    <span
      className={cx('ndjc-shimmer-image-root', !loaded && 'is-loading', className)}
      style={{
        ...apkImageRootStyle,
        borderRadius: placeholderCornerRadius
      }}
      aria-label={alt}
    >
      <style>{apkImageShimmerKeyframes}</style>

      {!loaded ? (
        <span
          className="ndjc-shimmer-image-placeholder"
          style={{
            ...apkImagePlaceholderStyle,
            borderRadius: placeholderCornerRadius,
            backgroundImage: blurDataUrl ? `url(${blurDataUrl})` : apkImagePlaceholderStyle.backgroundImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          aria-hidden="true"
        >
          <span
            className="ndjc-shimmer-image-placeholder-layer"
            style={apkImageShimmerLayerStyle}
            aria-hidden="true"
          />
        </span>
      ) : null}

      {cleanSrc ? (
        <img
          ref={imageRef}
          className="ndjc-shimmer-image"
          draggable={false}
          style={{
            ...apkImageFillStyle,
            objectFit: contentScale,
            opacity: loaded ? 1 : 0,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}
          src={cleanSrc}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={decoding}
          width={imageWidth}
          height={imageHeight}
          sizes={sizes}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
      ) : null}
    </span>
  )
}

export function FullscreenImagePreviewDialog({
  imageUrl,
  onDismiss
}: {
  imageUrl: string | null
  onDismiss: () => void
}) {
  const cleanImageUrl = imageUrl?.trim() || ''
  if (!cleanImageUrl) return null

  return (
    <NdjcFullscreenImageViewerScreen
      images={[cleanImageUrl]}
      startIndex={0}
      onDismiss={onDismiss}
    />
  )
}

export function NdjcFullscreenImageViewerScreen({
  imageUrl,
  images,
  startIndex = 0,
  onBack,
  onDismiss,
  onSave
}: {
  imageUrl?: string | null
  images?: string[]
  startIndex?: number
  onBack?: () => void
  onDismiss?: () => void
  onSave?: (url: string) => void
}) {
  const cleanImages = React.useMemo(() => {
    const fromImages = (images || [])
      .map(url => url.trim())
      .filter(Boolean)

    const singleImage = imageUrl?.trim() || ''

    return fromImages.length ? fromImages : singleImage ? [singleImage] : []
  }, [imageUrl, images])

  const safeStart = Math.min(Math.max(startIndex, 0), Math.max(cleanImages.length - 1, 0))
  const [currentIndex, setCurrentIndex] = React.useState(safeStart)
  const [scale, setScale] = React.useState(1)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  const [pagerDragOffset, setPagerDragOffset] = React.useState(0)
  const [isPagerDragging, setIsPagerDragging] = React.useState(false)
  const [pendingSaveUrl, setPendingSaveUrl] = React.useState<string | null>(null)
  const singleClickTimerRef = React.useRef<number | null>(null)
  const longPressTimerRef = React.useRef<number | null>(null)
  const clickSuppressTimerRef = React.useRef<number | null>(null)
  const activePointersRef = React.useRef<Map<number, { x: number; y: number }>>(new Map())
  const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null)
  const lastPanPointRef = React.useRef<{ x: number; y: number } | null>(null)
  const pinchStartRef = React.useRef<{
    distance: number
    scale: number
    offsetX: number
    offsetY: number
    centerX: number
    centerY: number
  } | null>(null)
  const clickSuppressedRef = React.useRef(false)
  const didMoveRef = React.useRef(false)
  const fullscreenTouchTapRef = React.useRef<{
    x: number
    y: number
    timeMs: number
  } | null>(null)
  const lastFullscreenTapAtRef = React.useRef(0)
  const activeUrl = cleanImages[currentIndex] || ''
  const handleDismiss = onDismiss || onBack
  const [isLargeViewport, setIsLargeViewport] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    function updateViewportMode(): void {
      setIsLargeViewport(window.innerWidth >= 768)
    }

    updateViewportMode()
    window.addEventListener('resize', updateViewportMode)

    return () => {
      window.removeEventListener('resize', updateViewportMode)
    }
  }, [])

  React.useEffect(() => {
    if (typeof document === 'undefined') return

    const previousBodyOverflow = document.body.style.overflow
    const previousBodyTouchAction = document.body.style.touchAction
    const previousDocumentOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.body.style.touchAction = previousBodyTouchAction
      document.documentElement.style.overflow = previousDocumentOverflow
    }
  }, [])

  function clearSingleClickTimer(): void {
    if (!singleClickTimerRef.current) return
    window.clearTimeout(singleClickTimerRef.current)
    singleClickTimerRef.current = null
  }

  function clearLongPressTimer(): void {
    if (!longPressTimerRef.current) return
    window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = null
  }

  function clearClickSuppressTimer(): void {
    if (!clickSuppressTimerRef.current) return
    window.clearTimeout(clickSuppressTimerRef.current)
    clickSuppressTimerRef.current = null
  }

  function suppressClickOnce(durationMs: number = APK_MEDIA_UI.fullscreenClickSuppressMs): void {
    clickSuppressedRef.current = true
    clearClickSuppressTimer()

    clickSuppressTimerRef.current = window.setTimeout(() => {
      clickSuppressedRef.current = false
      clickSuppressTimerRef.current = null
    }, durationMs)
  }

  function clearPinchState(): void {
    pinchStartRef.current = null
  }

  function clearPointerState(): void {
    activePointersRef.current.clear()
    pointerStartRef.current = null
    lastPanPointRef.current = null
    clearPinchState()
    didMoveRef.current = false
  }

  function resetZoom(): void {
    setScale(1)
    setOffset({ x: 0, y: 0 })
    setPagerDragOffset(0)
    setIsPagerDragging(false)
    clearPointerState()
  }

  function resetPageGestureState(): void {
    setScale(1)
    setOffset({ x: 0, y: 0 })
    setPagerDragOffset(0)
    setIsPagerDragging(false)
    clearPointerState()
    clearLongPressTimer()
    clearSingleClickTimer()
  }

  function clampScale(value: number): number {
    return Math.min(APK_MEDIA_UI.zoomMax, Math.max(1, value))
  }

  function pointerDistance(first: { x: number; y: number }, second: { x: number; y: number }): number {
    const deltaX = second.x - first.x
    const deltaY = second.y - first.y
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }

  function pointerCenter(first: { x: number; y: number }, second: { x: number; y: number }): { x: number; y: number } {
    return {
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2
    }
  }

  function activePointerPair(): {
    first: { x: number; y: number }
    second: { x: number; y: number }
  } | null {
    const points = Array.from(activePointersRef.current.values())
    if (points.length < 2) return null

    return {
      first: points[0],
      second: points[1]
    }
  }

  function requestSaveCurrentImage(): void {
    if (!onSave || !activeUrl) return

    clearSingleClickTimer()
    clearLongPressTimer()
    suppressClickOnce(640)
    setPendingSaveUrl(activeUrl)
  }

  function confirmPendingSave(): void {
    const url = pendingSaveUrl
    if (!url) return

    setPendingSaveUrl(null)
    onSave?.(url)
  }

  function dismissPendingSave(): void {
    setPendingSaveUrl(null)
  }

  function goPrevious(): void {
    if (currentIndex <= 0) return

    setCurrentIndex(index => Math.max(0, index - 1))
    resetPageGestureState()
  }

  function goNext(): void {
    if (currentIndex >= cleanImages.length - 1) return

    setCurrentIndex(index => Math.min(cleanImages.length - 1, index + 1))
    resetPageGestureState()
  }

  function handleSingleTap(event: React.MouseEvent<HTMLElement>): void {
    event.preventDefault()
    event.stopPropagation()

    if (clickSuppressedRef.current || didMoveRef.current || pinchStartRef.current) {
      clickSuppressedRef.current = false
      didMoveRef.current = false
      return
    }

    runFullscreenSingleTapAction()
  }

  function handleDoubleTap(event: React.MouseEvent<HTMLElement>): void {
    event.preventDefault()
    event.stopPropagation()

    clearSingleClickTimer()
    clearLongPressTimer()
    clickSuppressedRef.current = false
    clearClickSuppressTimer()
    clearPointerState()
    setPagerDragOffset(0)
    setIsPagerDragging(false)

    if (scale > 1.01) {
      resetZoom()
      suppressClickOnce()
      return
    }

    setScale(APK_MEDIA_UI.zoomDoubleTap)
    setOffset({ x: 0, y: 0 })
    suppressClickOnce()
  }

  function runFullscreenSingleTapAction(): void {
    clearSingleClickTimer()

    singleClickTimerRef.current = window.setTimeout(() => {
      singleClickTimerRef.current = null

      if (clickSuppressedRef.current || didMoveRef.current || pinchStartRef.current) {
        clickSuppressedRef.current = false
        didMoveRef.current = false
        return
      }

      if (scale > 1.01) {
        resetZoom()
        return
      }

      handleDismiss?.()
    }, APK_MEDIA_UI.fullscreenSingleClickDelayMs)
  }

  function isFullscreenControlTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false

    return Boolean(
      target.closest('[data-fullscreen-control="true"]') ||
      target.closest('.ndjc-dialog') ||
      target.closest('[role="dialog"]')
    )
  }

  function handleFullscreenTouchStartCapture(event: React.TouchEvent<HTMLElement>): void {
    if (pendingSaveUrl) return
    if (event.touches.length !== 1) {
      clearSingleClickTimer()
      fullscreenTouchTapRef.current = null
      return
    }

    const touch = event.touches[0]

    clearSingleClickTimer()

    fullscreenTouchTapRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timeMs: Date.now()
    }
  }

  function handleFullscreenTouchEndCapture(event: React.TouchEvent<HTMLElement>): void {
    if (pendingSaveUrl) return
    if (isFullscreenControlTarget(event.target)) return

    const start = fullscreenTouchTapRef.current
    const touch = event.changedTouches[0]

    fullscreenTouchTapRef.current = null

    if (!start || !touch) return

    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    const durationMs = Date.now() - start.timeMs

    const isTapLike =
      absDeltaX <= APK_MEDIA_UI.fullscreenTapSlopPx &&
      absDeltaY <= APK_MEDIA_UI.fullscreenTapSlopPx &&
      durationMs <= 520

    if (!isTapLike) return

    event.preventDefault()
    event.stopPropagation()

    didMoveRef.current = false
    clickSuppressedRef.current = false
    clearClickSuppressTimer()

    const now = Date.now()
    const isDoubleTap = now - lastFullscreenTapAtRef.current <= APK_MEDIA_UI.fullscreenSingleClickDelayMs

    lastFullscreenTapAtRef.current = now

    if (isDoubleTap) {
      clearSingleClickTimer()
      clearLongPressTimer()
      clearPointerState()
      setPagerDragOffset(0)
      setIsPagerDragging(false)

      if (scale > 1.01) {
        resetZoom()
        suppressClickOnce()
        return
      }

      setScale(APK_MEDIA_UI.zoomDoubleTap)
      setOffset({ x: 0, y: 0 })
      suppressClickOnce()
      return
    }

    runFullscreenSingleTapAction()
  }

  function handleFullscreenTouchCancelCapture(): void {
    fullscreenTouchTapRef.current = null
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>): void {
    event.preventDefault()
    event.stopPropagation()

    clearSingleClickTimer()

    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    })

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY
    }

    lastPanPointRef.current = {
      x: event.clientX,
      y: event.clientY
    }

    didMoveRef.current = false
    setPagerDragOffset(0)
    setIsPagerDragging(false)
    event.currentTarget.setPointerCapture?.(event.pointerId)

    const pair = activePointerPair()

    if (pair) {
      const center = pointerCenter(pair.first, pair.second)

      clearLongPressTimer()
      clearSingleClickTimer()
      suppressClickOnce(640)
      setPagerDragOffset(0)
      setIsPagerDragging(false)

      pinchStartRef.current = {
        distance: pointerDistance(pair.first, pair.second),
        scale,
        offsetX: offset.x,
        offsetY: offset.y,
        centerX: center.x,
        centerY: center.y
      }

      return
    }

    if (onSave) {
      clearLongPressTimer()
      longPressTimerRef.current = window.setTimeout(() => {
        longPressTimerRef.current = null
        requestSaveCurrentImage()
      }, APK_MEDIA_UI.fullscreenLongPressDelayMs)
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>): void {
    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    })

    const pair = activePointerPair()

    if (pair) {
      event.preventDefault()
      event.stopPropagation()

      const center = pointerCenter(pair.first, pair.second)
      const distance = pointerDistance(pair.first, pair.second)

      if (!pinchStartRef.current) {
        pinchStartRef.current = {
          distance,
          scale,
          offsetX: offset.x,
          offsetY: offset.y,
          centerX: center.x,
          centerY: center.y
        }
      }

      const pinchStart = pinchStartRef.current
      const safeDistance = Math.max(1, pinchStart.distance)
      const nextScale = clampScale(pinchStart.scale * (distance / safeDistance))
      const scaleRatio = nextScale / Math.max(1, pinchStart.scale)
      const viewportCenterX = window.innerWidth / 2
      const viewportCenterY = window.innerHeight / 2

      didMoveRef.current = true
      suppressClickOnce(640)
      clearSingleClickTimer()
      clearLongPressTimer()
      setPagerDragOffset(0)
      setIsPagerDragging(false)
      setScale(nextScale)

      if (nextScale <= 1.01) {
        setOffset({ x: 0, y: 0 })
      } else {
        setOffset({
          x: pinchStart.offsetX + (center.x - pinchStart.centerX) + (center.x - viewportCenterX) * (1 - scaleRatio),
          y: pinchStart.offsetY + (center.y - pinchStart.centerY) + (center.y - viewportCenterY) * (1 - scaleRatio)
        })
      }

      return
    }

    const start = pointerStartRef.current
    if (!start) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    if (absDeltaX > APK_MEDIA_UI.fullscreenTapSlopPx || absDeltaY > APK_MEDIA_UI.fullscreenTapSlopPx) {
      didMoveRef.current = true
      suppressClickOnce()
      clearLongPressTimer()
    }

    if (scale > 1.01) {
      event.preventDefault()
      event.stopPropagation()

      const lastPoint = lastPanPointRef.current || {
        x: event.clientX,
        y: event.clientY
      }

      const movementX = event.clientX - lastPoint.x
      const movementY = event.clientY - lastPoint.y

      lastPanPointRef.current = {
        x: event.clientX,
        y: event.clientY
      }

      setPagerDragOffset(0)
      setIsPagerDragging(false)
      setOffset(previous => ({
        x: previous.x + movementX,
        y: previous.y + movementY
      }))
      return
    }

    if (cleanImages.length <= 1) return
    if (absDeltaX <= 4 || absDeltaX <= absDeltaY) return

    event.preventDefault()
    event.stopPropagation()

    const isAtFirstAndDraggingRight = currentIndex === 0 && deltaX > 0
    const isAtLastAndDraggingLeft = currentIndex === cleanImages.length - 1 && deltaX < 0
    const resistance = isAtFirstAndDraggingRight || isAtLastAndDraggingLeft ? 0.28 : 1

    setIsPagerDragging(true)
    setPagerDragOffset(deltaX * resistance)
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLElement>): void {
    clearLongPressTimer()

    activePointersRef.current.delete(event.pointerId)

    if (pinchStartRef.current) {
      suppressClickOnce(640)
      clearSingleClickTimer()

      if (activePointersRef.current.size < 2) {
        clearPinchState()
        pointerStartRef.current = {
          x: event.clientX,
          y: event.clientY
        }
        lastPanPointRef.current = {
          x: event.clientX,
          y: event.clientY
        }
      }

      if (scale <= 1.01) {
        setScale(1)
        setOffset({ x: 0, y: 0 })
      }

      setPagerDragOffset(0)
      setIsPagerDragging(false)
      return
    }

    const start = pointerStartRef.current
    pointerStartRef.current = null
    lastPanPointRef.current = null

    if (!start) {
      setPagerDragOffset(0)
      setIsPagerDragging(false)
      return
    }

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    const shouldSwipe =
      cleanImages.length > 1 &&
      scale <= 1.01 &&
      absDeltaX >= APK_MEDIA_UI.fullscreenSwipeThreshold &&
      absDeltaY <= APK_MEDIA_UI.fullscreenSwipeVerticalTolerance &&
      absDeltaX > absDeltaY

    if (!shouldSwipe) {
      setPagerDragOffset(0)
      setIsPagerDragging(false)

      const isTapLike =
        absDeltaX <= APK_MEDIA_UI.fullscreenTapSlopPx &&
        absDeltaY <= APK_MEDIA_UI.fullscreenTapSlopPx

      if (didMoveRef.current && !isTapLike) {
        suppressClickOnce()
        return
      }

      if (isTapLike) {
        didMoveRef.current = false
        clickSuppressedRef.current = false
        clearClickSuppressTimer()
        runFullscreenSingleTapAction()
        return
      }

      runFullscreenSingleTapAction()
      return
    }

    clearSingleClickTimer()
    suppressClickOnce()
    setPagerDragOffset(0)
    setIsPagerDragging(false)

    if (deltaX < 0) {
      goNext()
      return
    }

    goPrevious()
  }

  function handlePointerCancel(event?: React.PointerEvent<HTMLElement>): void {
    clearLongPressTimer()
    clearSingleClickTimer()
    suppressClickOnce()

    if (event) {
      activePointersRef.current.delete(event.pointerId)
    } else {
      activePointersRef.current.clear()
    }

    pointerStartRef.current = null
    lastPanPointRef.current = null
    clearPinchState()
    setPagerDragOffset(0)
    setIsPagerDragging(false)

    if (scale <= 1.01) {
      setScale(1)
      setOffset({ x: 0, y: 0 })
    }
  }

  React.useEffect(() => {
    setCurrentIndex(safeStart)
    resetPageGestureState()
  }, [safeStart, cleanImages.length])

  React.useEffect(() => {
    return () => {
      clearSingleClickTimer()
      clearLongPressTimer()
      clearClickSuppressTimer()
      clearPointerState()
    }
  }, [])

  if (!activeUrl) return null

  return (
    <main
      className="ndjc-screen ndjc-fullscreen-image-viewer-screen"
      style={apkFullscreenBackdropStyle}
    >
      <NdjcSystemBars
        color={APK_MEDIA_UI.fullscreenBg}
        darkIcons={false}
        navigationBarColor={APK_MEDIA_UI.fullscreenBg}
        lightNavIcons={false}
        decorFitsSystemWindows={false}
      />

      <section
        className="ndjc-fullscreen-image-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: APK_MEDIA_UI.fullscreenBg,
          overflow: 'hidden'
        }}
        onTouchStartCapture={handleFullscreenTouchStartCapture}
        onTouchEndCapture={handleFullscreenTouchEndCapture}
        onTouchCancelCapture={handleFullscreenTouchCancelCapture}
      >
        <section
          className="ndjc-fullscreen-image-pager"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            touchAction: 'none'
          }}
        >
          <section
            className="ndjc-fullscreen-image-pager-track"
            style={{
              display: 'flex',
              width: `${cleanImages.length * 100}%`,
              height: '100%',
              transform: `translateX(calc(${-currentIndex * (100 / cleanImages.length)}% + ${pagerDragOffset}px))`,
              transition: isPagerDragging ? 'none' : 'transform 220ms ease',
              willChange: 'transform'
            }}
          >
            {cleanImages.map((url, index) => {
              const isActivePage = index === currentIndex

              return (
                <section
                  key={`${url}-${index}`}
                  className="ndjc-fullscreen-image-pager-page"
                  style={{
                    position: 'relative',
                    width: `${100 / cleanImages.length}%`,
                    height: '100%',
                    flex: '0 0 auto',
                    display: 'grid',
                    placeItems: 'center',
                    overflow: 'hidden',
                    cursor: isActivePage && scale > 1.01 ? 'grab' : 'zoom-in',
                    touchAction: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none'
                  }}
                  onClick={isActivePage ? handleSingleTap : undefined}
                  onDoubleClick={isActivePage ? handleDoubleTap : undefined}
                  onPointerDown={isActivePage ? handlePointerDown : undefined}
                  onPointerMove={isActivePage ? handlePointerMove : undefined}
                  onPointerUp={isActivePage ? handlePointerEnd : undefined}
                  onPointerCancel={isActivePage ? handlePointerCancel : undefined}
                  onPointerLeave={isActivePage ? handlePointerCancel : undefined}
                  onWheel={isActivePage ? event => {
                    event.preventDefault()
                    event.stopPropagation()

                    const nextScale = clampScale(scale + (event.deltaY < 0 ? 0.25 : -0.25))

                    setScale(nextScale)

                    if (nextScale <= 1.01) {
                      setScale(1)
                      setOffset({ x: 0, y: 0 })
                    }
                  } : undefined}
                  onContextMenu={event => {
                    event.preventDefault()
                    event.stopPropagation()
                    requestSaveCurrentImage()
                  }}
                >
                  <img
                    src={url}
                    alt="Preview"
                    style={{
                      ...apkFullscreenImageStyle,
                      width: isLargeViewport ? 'min(92vw, 1120px)' : '100%',
                      height: isLargeViewport ? '92vh' : '100%',
                      maxWidth: isLargeViewport ? '1120px' : '100%',
                      maxHeight: isLargeViewport ? '92vh' : '100%',
                      transform: isActivePage ? `translate(${offset.x}px, ${offset.y}px) scale(${scale})` : 'translate(0px, 0px) scale(1)',
                      transformOrigin: 'center center',
                      transition: isPagerDragging || didMoveRef.current ? 'none' : 'transform 120ms ease',
                      pointerEvents: 'none',
                      touchAction: 'none',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTouchCallout: 'none'
                    }}
                    draggable={false}
                    onDragStart={event => {
                      event.preventDefault()
                      event.stopPropagation()
                    }}
                  />
                </section>
              )
            })}
          </section>
        </section>

        <section
          className="ndjc-fullscreen-image-top-actions"
          data-fullscreen-control="true"
          style={apkFullscreenTopActionsStyle}
          onClick={event => {
            event.stopPropagation()
          }}
          onDoubleClick={event => {
            event.stopPropagation()
          }}
          onPointerDown={event => {
            event.stopPropagation()
          }}
          onPointerMove={event => {
            event.stopPropagation()
          }}
          onPointerUp={event => {
            event.stopPropagation()
          }}
          onContextMenu={event => {
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          {onSave ? (
            <button
              type="button"
              style={apkFullscreenDownloadButtonStyle}
              onClick={event => {
                event.preventDefault()
                event.stopPropagation()
                requestSaveCurrentImage()
              }}
              onContextMenu={event => {
                event.preventDefault()
                event.stopPropagation()
              }}
            >
              Download
            </button>
          ) : null}

          <button
            type="button"
            style={apkFullscreenCloseButtonStyle}
            onClick={event => {
              event.preventDefault()
              event.stopPropagation()
              handleDismiss?.()
            }}
            onContextMenu={event => {
              event.preventDefault()
              event.stopPropagation()
            }}
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              style={apkFullscreenCloseIconStyle}
            >
              <path
                d="M6.4 5.35 12 10.95l5.6-5.6 1.05 1.05-5.6 5.6 5.6 5.6-1.05 1.05-5.6-5.6-5.6 5.6-1.05-1.05 5.6-5.6-5.6-5.6Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </section>

        {cleanImages.length > 1 ? (
          <span
            data-fullscreen-control="true"
            style={apkFullscreenPageIndicatorStyle}
            onClick={event => {
              event.stopPropagation()
            }}
            onDoubleClick={event => {
              event.stopPropagation()
            }}
            onPointerDown={event => {
              event.stopPropagation()
            }}
            onPointerMove={event => {
              event.stopPropagation()
            }}
            onPointerUp={event => {
              event.stopPropagation()
            }}
            onContextMenu={event => {
              event.preventDefault()
              event.stopPropagation()
            }}
          >
            {currentIndex + 1}/{cleanImages.length}
          </span>
        ) : null}

        {pendingSaveUrl ? (
          <NdjcBaseDialog
            title="Download image"
            message="Save this image to your device?"
            confirmText="Save"
            dismissText="Cancel"
            onConfirmClick={confirmPendingSave}
            onDismissClick={dismissPendingSave}
            onDismissRequest={dismissPendingSave}
          />
        ) : null}
      </section>
    </main>
  )
}

export function UploadTile({
  label = 'Upload',
  onClick,
  disabled,
  enabled,
  hasImage
}: {
  label?: string
  onClick?: () => void
  disabled?: boolean
  enabled?: boolean
  hasImage?: boolean
}) {
  const canClick = enabled ?? !disabled

  return (
    <button
      type="button"
      className={cx('ndjc-upload-tile', !canClick && 'is-disabled', hasImage && 'has-image')}
      style={{
        ...apkUploadTileStyle,
        opacity: canClick ? 1 : 0.55,
        cursor: canClick ? 'pointer' : 'not-allowed'
      }}
      disabled={!canClick}
      onClick={onClick}
      aria-label={label}
    >
      <span
        style={{
          color: APK_MEDIA_UI.white,
          fontSize: APK_MEDIA_UI.uploadIconSize,
          lineHeight: 1,
          fontWeight: 600
        }}
        aria-hidden="true"
      >
        ＋
      </span>

      <strong className="ndjc-upload-tile-label" style={apkVisuallyHiddenStyle}>
        {label}
      </strong>
    </button>
  )
}

export function ImageTile({
  src,
  uriString,
  label = 'Image',
  enabled = true,
  onClick,
  onPreview,
  onRemove,
  onPreviewPointerDown,
  onPreviewPointerMove,
  onPreviewPointerUp,
  onPreviewPointerCancel,
  onPreviewPointerLeave,
  onPreviewClickCapture
}: {
  src?: string | null
  uriString?: string | null
  label?: string
  enabled?: boolean
  onClick?: () => void
  onPreview?: () => void
  onRemove?: () => void
  onPreviewPointerDown?: React.PointerEventHandler<HTMLButtonElement>
  onPreviewPointerMove?: React.PointerEventHandler<HTMLButtonElement>
  onPreviewPointerUp?: React.PointerEventHandler<HTMLButtonElement>
  onPreviewPointerCancel?: React.PointerEventHandler<HTMLButtonElement>
  onPreviewPointerLeave?: React.PointerEventHandler<HTMLButtonElement>
  onPreviewClickCapture?: React.MouseEventHandler<HTMLButtonElement>
}) {
  const cleanSrc = src?.trim() || uriString?.trim() || ''

  return (
    <section className="ndjc-image-tile" style={apkEditableImageTileStyle}>
      <button
        type="button"
        className="ndjc-image-tile-preview"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          border: 0,
          padding: 0,
          display: 'block',
          background: 'transparent',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
        onDragStart={event => {
          event.preventDefault()
          event.stopPropagation()
        }}
        onPointerDown={onPreviewPointerDown}
        onPointerMove={onPreviewPointerMove}
        onPointerUp={onPreviewPointerUp}
        onPointerCancel={onPreviewPointerCancel}
        onPointerLeave={onPreviewPointerLeave}
        onClickCapture={onPreviewClickCapture}
        onClick={onPreview || onClick}
        onContextMenu={event => {
          event.preventDefault()
          event.stopPropagation()
        }}
        aria-label={label}
      >
        <NdjcShimmerImage
          src={cleanSrc}
          alt={label}
          placeholderCornerRadius={APK_MEDIA_UI.imageEditRadius}
          contentScale="cover"
        />
      </button>

      {enabled && onRemove ? (
        <button
          type="button"
          className="ndjc-image-tile-remove"
          style={apkRemoveCornerButtonStyle}
          onPointerDown={event => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onPointerMove={event => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onPointerUp={event => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onPointerCancel={event => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onClick={event => {
            event.preventDefault()
            event.stopPropagation()
            onRemove()
          }}
          aria-label="Remove image"
        >
          ×
        </button>
      ) : null}
    </section>
  )
}

export function NdjcSingleEditableImage({
  src,
  onPick,
  onRemove,
  label = 'Image',
  enabled = true,
  onPreview
}: {
  src?: string | null
  onPick?: () => void
  onRemove?: () => void
  label?: string
  enabled?: boolean
  onPreview?: () => void
}) {
  const cleanSrc = src?.trim() || ''

  return (
    <section
      className="ndjc-single-editable-image"
      style={{
        width: '100%',
        aspectRatio: '1 / 1'
      }}
    >
      {cleanSrc ? (
        <ImageTile
          src={cleanSrc}
          label={label}
          enabled={enabled}
          onClick={onPick}
          onPreview={onPreview || onPick}
          onRemove={onRemove}
        />
      ) : (
        <UploadTile label={label} onClick={onPick} enabled={enabled && Boolean(onPick)} hasImage={false} />
      )}
    </section>
  )
}

export function NdjcEditableImageGrid({
  imageUrls,
  maxImages = 9,
  enabled = true,
  onPickImage,
  onRemoveImage,
  onMoveImage,
  onDraggingChange,
  onPreviewImages
}: {
  imageUrls: string[]
  maxImages?: number
  enabled?: boolean
  onPickImage?: () => void
  onRemoveImage?: (url: string) => void
  onMoveImage?: (from: number, to: number) => void
  onDraggingChange?: (isDragging: boolean) => void
  onPreviewImages?: (images: string[], startIndex: number) => void
}) {
  const cleanImages = imageUrls
    .map(url => url.trim())
    .filter(Boolean)
    .filter((url, index, all) => all.indexOf(url) === index)
    .slice(0, maxImages)

  const [previewIndex, setPreviewIndex] = React.useState<number | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragOriginIndex, setDragOriginIndex] = React.useState<number | null>(null)
  const [pendingTargetIndex, setPendingTargetIndex] = React.useState<number | null>(null)
  const [dragShadowUrl, setDragShadowUrl] = React.useState<string | null>(null)
  const [dragShadowTopLeft, setDragShadowTopLeft] = React.useState<{ x: number; y: number } | null>(null)

  const gridRef = React.useRef<HTMLElement | null>(null)
  const longPressTimerRef = React.useRef<number | null>(null)
  const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null)
  const lastPointerPositionRef = React.useRef<{ x: number; y: number } | null>(null)
  const dragPointerOffsetRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const dragOriginIndexRef = React.useRef<number | null>(null)
  const pendingTargetIndexRef = React.useRef<number | null>(null)
  const dragShadowUrlRef = React.useRef<string | null>(null)
  const isDraggingRef = React.useRef(false)
  const didDragRef = React.useRef(false)
  const suppressNextPreviewClickRef = React.useRef(false)
  const suppressPreviewClickTimerRef = React.useRef<number | null>(null)
  const tileRefs = React.useRef<Array<HTMLElement | null>>([])

  const canAddImage = enabled && cleanImages.length < maxImages
  const canReorder = enabled && Boolean(onMoveImage) && cleanImages.length > 1

  function movePreview(list: string[], from: number, to: number): string[] {
    if (from === to) return list
    if (from < 0 || to < 0 || from >= list.length || to >= list.length) return list

    const next = [...list]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    return next
  }

  const previewImages = React.useMemo(() => {
    if (
      isDragging &&
      dragOriginIndex != null &&
      pendingTargetIndex != null &&
      dragOriginIndex >= 0 &&
      pendingTargetIndex >= 0 &&
      dragOriginIndex < cleanImages.length &&
      pendingTargetIndex < cleanImages.length
    ) {
      return movePreview(cleanImages, dragOriginIndex, pendingTargetIndex)
    }

    return cleanImages
  }, [cleanImages, dragOriginIndex, isDragging, pendingTargetIndex])

  const gridItems = React.useMemo(() => {
    const base = previewImages.map(item => item as string | null)

    if (canAddImage && base.length < maxImages) {
      return [...base, null]
    }

    return base
  }, [canAddImage, maxImages, previewImages])

  React.useEffect(() => {
    tileRefs.current = tileRefs.current.slice(0, previewImages.length)
  }, [previewImages.length])

  React.useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        window.clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      if (suppressPreviewClickTimerRef.current) {
        window.clearTimeout(suppressPreviewClickTimerRef.current)
        suppressPreviewClickTimerRef.current = null
      }
    }
  }, [])

  function openGridPreview(startIndex: number): void {
    if (onPreviewImages) {
      onPreviewImages(cleanImages, startIndex)
      return
    }

    setPreviewIndex(startIndex)
  }

  function clearLongPressTimer(): void {
    if (!longPressTimerRef.current) return

    window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = null
  }

  function suppressNextPreviewClick(): void {
    suppressNextPreviewClickRef.current = true
    didDragRef.current = true

    if (suppressPreviewClickTimerRef.current) {
      window.clearTimeout(suppressPreviewClickTimerRef.current)
      suppressPreviewClickTimerRef.current = null
    }

    suppressPreviewClickTimerRef.current = window.setTimeout(() => {
      suppressNextPreviewClickRef.current = false
      didDragRef.current = false
      suppressPreviewClickTimerRef.current = null
    }, 320)
  }

  function resetDragState(): void {
    clearLongPressTimer()
    pointerStartRef.current = null
    lastPointerPositionRef.current = null
    dragOriginIndexRef.current = null
    pendingTargetIndexRef.current = null
    dragShadowUrlRef.current = null
    isDraggingRef.current = false

    setIsDragging(false)
    setDragOriginIndex(null)
    setPendingTargetIndex(null)
    setDragShadowUrl(null)
    setDragShadowTopLeft(null)

    window.requestAnimationFrame(() => {
      onDraggingChange?.(false)
    })
  }

  function findTargetIndex(clientX: number, clientY: number): number | null {
    for (let index = 0; index < tileRefs.current.length; index += 1) {
      const element = tileRefs.current[index]
      if (!element) continue

      const rect = element.getBoundingClientRect()
      const contains =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom

      if (contains) return index
    }

    return null
  }

  function startDragging(input: {
    originalIndex: number
    displayIndex: number
    url: string
    clientX: number
    clientY: number
  }): void {
    if (!canReorder) return

    const grid = gridRef.current
    const tile = tileRefs.current[input.displayIndex]

    if (!grid || !tile) return

    const gridRect = grid.getBoundingClientRect()
    const tileRect = tile.getBoundingClientRect()

    const pointerOffset = {
      x: input.clientX - tileRect.left,
      y: input.clientY - tileRect.top
    }

    const topLeft = {
      x: tileRect.left - gridRect.left,
      y: tileRect.top - gridRect.top
    }

    didDragRef.current = true
    isDraggingRef.current = true
    lastPointerPositionRef.current = {
      x: input.clientX,
      y: input.clientY
    }
    dragPointerOffsetRef.current = pointerOffset
    dragOriginIndexRef.current = input.originalIndex
    pendingTargetIndexRef.current = input.originalIndex
    dragShadowUrlRef.current = input.url

    setIsDragging(true)
    setDragOriginIndex(input.originalIndex)
    setPendingTargetIndex(input.originalIndex)
    setDragShadowUrl(input.url)
    setDragShadowTopLeft(topLeft)
    onDraggingChange?.(true)
  }

  function handleTilePointerDown(
    originalIndex: number,
    displayIndex: number,
    url: string,
    event: React.PointerEvent<HTMLElement>
  ): void {
    if (!enabled) return

    event.preventDefault()
    event.stopPropagation()

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY
    }

    lastPointerPositionRef.current = {
      x: event.clientX,
      y: event.clientY
    }

    didDragRef.current = false

    if (!canReorder) return

    clearLongPressTimer()
    event.currentTarget.setPointerCapture?.(event.pointerId)

    longPressTimerRef.current = window.setTimeout(() => {
      longPressTimerRef.current = null
      startDragging({
        originalIndex,
        displayIndex,
        url,
        clientX: event.clientX,
        clientY: event.clientY
      })
    }, APK_MEDIA_UI.dragLongPressMs)
  }

  function handleTilePointerMove(event: React.PointerEvent<HTMLElement>): void {
    if (!isDraggingRef.current) return

    lastPointerPositionRef.current = {
      x: event.clientX,
      y: event.clientY
    }

    didDragRef.current = true
    event.preventDefault()
    event.stopPropagation()

    const grid = gridRef.current

    if (grid) {
      const gridRect = grid.getBoundingClientRect()
      const pointerOffset = dragPointerOffsetRef.current

      setDragShadowTopLeft({
        x: event.clientX - gridRect.left - pointerOffset.x,
        y: event.clientY - gridRect.top - pointerOffset.y
      })
    }

    const target = findTargetIndex(event.clientX, event.clientY)
    const origin = dragOriginIndexRef.current

    if (target != null) {
      pendingTargetIndexRef.current = target
      setPendingTargetIndex(target)
    } else if (origin != null) {
      pendingTargetIndexRef.current = origin
      setPendingTargetIndex(origin)
    }
  }
  function commitImageDrag(clientX: number, clientY: number): void {
    const from = dragOriginIndexRef.current
    const pointerTarget = findTargetIndex(clientX, clientY)
    const to = pointerTarget != null ? pointerTarget : pendingTargetIndexRef.current

    console.log('[ImageDrag] commitImageDrag resolved', {
      from,
      pointerTarget,
      pendingTarget: pendingTargetIndexRef.current,
      to,
      cleanImagesLength: cleanImages.length,
      isDragging: isDraggingRef.current,
      images: cleanImages
    })

    if (
      from != null &&
      to != null &&
      from !== to &&
      from >= 0 &&
      to >= 0 &&
      from < cleanImages.length &&
      to < cleanImages.length
    ) {
      console.log('[ImageDrag] calling onMoveImage', {
        from,
        to
      })

      onMoveImage?.(from, to)
    }
  }
  function handleTilePointerUp(event: React.PointerEvent<HTMLElement>): void {
    clearLongPressTimer()

    if (!isDraggingRef.current) {
      pointerStartRef.current = null
      return
    }

    lastPointerPositionRef.current = {
      x: event.clientX,
      y: event.clientY
    }

    suppressNextPreviewClick()
    event.preventDefault()
    event.stopPropagation()

    commitImageDrag(event.clientX, event.clientY)
    resetDragState()
  }
  function handleTilePointerCancel(): void {
    if (!isDraggingRef.current) {
      resetDragState()
      return
    }

    suppressNextPreviewClick()

    const lastPosition = lastPointerPositionRef.current

    if (lastPosition) {
      console.log('[ImageDrag] tile pointercancel commit', {
        clientX: lastPosition.x,
        clientY: lastPosition.y
      })

      commitImageDrag(lastPosition.x, lastPosition.y)
    }

    resetDragState()
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    function handleWindowPointerMove(event: PointerEvent): void {
      if (!isDraggingRef.current) return

      event.preventDefault()

      lastPointerPositionRef.current = {
        x: event.clientX,
        y: event.clientY
      }

      const grid = gridRef.current

      if (grid) {
        const gridRect = grid.getBoundingClientRect()
        const pointerOffset = dragPointerOffsetRef.current

        setDragShadowTopLeft({
          x: event.clientX - gridRect.left - pointerOffset.x,
          y: event.clientY - gridRect.top - pointerOffset.y
        })
      }

      const target = findTargetIndex(event.clientX, event.clientY)
      const origin = dragOriginIndexRef.current

      if (target != null) {
        pendingTargetIndexRef.current = target
        setPendingTargetIndex(target)
      } else if (origin != null) {
        pendingTargetIndexRef.current = origin
        setPendingTargetIndex(origin)
      }

      console.log('[ImageDrag] window pointermove fallback', {
        clientX: event.clientX,
        clientY: event.clientY,
        target,
        origin,
        pendingTarget: pendingTargetIndexRef.current
      })
    }

    function handleWindowPointerUp(event: PointerEvent): void {
      if (!isDraggingRef.current) return

      suppressNextPreviewClick()

      const lastPosition = lastPointerPositionRef.current
      const clientX = lastPosition?.x ?? event.clientX
      const clientY = lastPosition?.y ?? event.clientY

      console.log('[ImageDrag] window pointerup fallback', {
        clientX,
        clientY,
        eventClientX: event.clientX,
        eventClientY: event.clientY
      })

      commitImageDrag(clientX, clientY)
      resetDragState()
    }

    function handleWindowPointerCancel(): void {
      if (!isDraggingRef.current) return

      suppressNextPreviewClick()

      const lastPosition = lastPointerPositionRef.current

      console.log('[ImageDrag] window pointercancel fallback', {
        lastPosition,
        pendingTarget: pendingTargetIndexRef.current,
        from: dragOriginIndexRef.current
      })

      if (lastPosition) {
        commitImageDrag(lastPosition.x, lastPosition.y)
      }

      resetDragState()
    }

    window.addEventListener('pointermove', handleWindowPointerMove, { capture: true, passive: false })
    window.addEventListener('pointerup', handleWindowPointerUp, true)
    window.addEventListener('pointercancel', handleWindowPointerCancel, true)

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove, true)
      window.removeEventListener('pointerup', handleWindowPointerUp, true)
      window.removeEventListener('pointercancel', handleWindowPointerCancel, true)
    }
  }, [cleanImages, onMoveImage])

  function handleTilePointerLeave(event: React.PointerEvent<HTMLElement>): void {
    if (!isDraggingRef.current) {
      clearLongPressTimer()
      pointerStartRef.current = null
      return
    }

    handleTilePointerMove(event)
  }

  function handleTileClickCapture(event: React.MouseEvent<HTMLElement>): void {
    if (!didDragRef.current && !suppressNextPreviewClickRef.current) return

    event.preventDefault()
    event.stopPropagation()

    didDragRef.current = false
    suppressNextPreviewClickRef.current = false

    if (suppressPreviewClickTimerRef.current) {
      window.clearTimeout(suppressPreviewClickTimerRef.current)
      suppressPreviewClickTimerRef.current = null
    }
  }

  function getTileWrapperStyle(url: string, index: number): React.CSSProperties {
    const isActivelyDragging = isDraggingRef.current && isDragging
    const isDraggedOriginalItem = isActivelyDragging && dragShadowUrl === url
    const isCurrentTarget =
      isActivelyDragging &&
      pendingTargetIndex === index &&
      dragShadowUrl !== url

    return {
      position: 'relative',
      width: '100%',
      aspectRatio: '1 / 1',
      opacity: isDraggedOriginalItem ? 0 : 1,
      transform: isCurrentTarget ? `scale(${APK_MEDIA_UI.pressedScale})` : 'scale(1)',
      transition: `opacity ${APK_MEDIA_UI.dragPreviewTransitionMs}ms ease, transform ${APK_MEDIA_UI.dragPreviewTransitionMs}ms ease`,
      touchAction: 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none'
    }
  }

  return (
    <>
      <section
        ref={gridRef}
        className="ndjc-editable-image-grid"
        style={apkEditableGridStyle}
      >
        {gridItems.map((url, index) => {
          if (!url) {
            return (
              <UploadTile
                key="upload-tile"
                label="Add image"
                onClick={onPickImage}
                enabled={enabled && Boolean(onPickImage)}
                hasImage={false}
              />
            )
          }

          const originalIndex = cleanImages.indexOf(url)
          const previewStartIndex = originalIndex >= 0 ? originalIndex : 0

          return (
            <section
              key={url}
              ref={element => {
                tileRefs.current[index] = element
              }}
              className={cx(
                'ndjc-editable-image-grid-item',
                isDraggingRef.current && isDragging && dragShadowUrl === url && 'is-dragging',
                isDraggingRef.current && isDragging && pendingTargetIndex === index && dragShadowUrl !== url && 'is-drag-target'
              )}
              style={getTileWrapperStyle(url, index)}
            >
              <ImageTile
                src={url}
                label={`Image ${previewStartIndex + 1}`}
                enabled={enabled && Boolean(onPickImage || onRemoveImage || onMoveImage)}
                onRemove={enabled && onRemoveImage ? () => onRemoveImage(url) : undefined}
                onPreview={() => {
                  if (!enabled) return
                  if (didDragRef.current || suppressNextPreviewClickRef.current) return
                  openGridPreview(previewStartIndex)
                }}
                onClick={() => {
                  if (!enabled) return
                  if (didDragRef.current || suppressNextPreviewClickRef.current) return
                  openGridPreview(previewStartIndex)
                }}
                onPreviewPointerDown={event => handleTilePointerDown(originalIndex, index, url, event)}
                onPreviewPointerMove={handleTilePointerMove}
                onPreviewPointerUp={handleTilePointerUp}
                onPreviewPointerCancel={handleTilePointerCancel}
                onPreviewPointerLeave={handleTilePointerLeave}
                onPreviewClickCapture={handleTileClickCapture}
              />
            </section>
          )
        })}

        {isDraggingRef.current && isDragging && dragShadowUrl && dragShadowTopLeft ? (
          <section
            className="ndjc-editable-image-drag-shadow"
            style={{
              position: 'absolute',
              left: dragShadowTopLeft.x,
              top: dragShadowTopLeft.y,
              width: `calc((100% - ${APK_MEDIA_UI.imageGridGap * (APK_MEDIA_UI.imageGridColumns - 1)}px) / ${APK_MEDIA_UI.imageGridColumns})`,
              aspectRatio: '1 / 1',
              zIndex: 999,
              pointerEvents: 'none',
              borderRadius: APK_MEDIA_UI.imageEditRadius,
              overflow: 'hidden',
              boxShadow: APK_MEDIA_UI.dragOverlayShadow,
              transform: `scale(${APK_MEDIA_UI.dragOverlayScale})`,
              transformOrigin: 'center center',
              transition: `transform ${APK_MEDIA_UI.dragPreviewTransitionMs}ms ease, box-shadow ${APK_MEDIA_UI.dragPreviewTransitionMs}ms ease`
            }}
          >
            <NdjcShimmerImage
              src={dragShadowUrl}
              alt="Dragging image"
              placeholderCornerRadius={APK_MEDIA_UI.imageEditRadius}
              contentScale="cover"
            />
          </section>
        ) : null}
      </section>

      {!onPreviewImages && previewIndex != null ? (
        <NdjcFullscreenImageViewerScreen
          images={cleanImages}
          startIndex={previewIndex}
          onDismiss={() => setPreviewIndex(null)}
        />
      ) : null}
    </>
  )
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

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div style={{ ...apkHomePriceRowStyle, flex: '1 1 auto', minWidth: 0 }}>
                  <span style={apkHomePrimaryPriceStyle(primaryTextStyle)}>{primaryText}</span>

                  {cleanSecondaryText ? (
                    <span style={apkHomeSecondaryPriceStyle}>{cleanSecondaryText}</span>
                  ) : null}
                </div>

                {cleanBadgeText ? (
                  <>
                    <span style={{ width: 8, flex: '0 0 8px' }} aria-hidden="true" />
                    <NdjcItemStatusBadge text={cleanBadgeText} />
                  </>
                ) : null}

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

export function NdjcCatalogItemCard({
  dish,
  selected,
  onOpen,
  onToggleSelect,
  trailing,
  bottom,
  bottomContent,
  metaText,
  showCategory = true
}: {
  dish: DemoDish
  selected?: boolean
  onOpen?: (id: string) => void
  onToggleSelect?: (id: string) => void
  trailing?: React.ReactNode
  bottom?: React.ReactNode
  bottomContent?: React.ReactNode
  metaText?: string | null
  showCategory?: boolean
}) {
  const title = titleForDish(dish)
  const salePrice = getDishPrice(dish)
  const categoryLabel = categoryForDish(dish)
  const resolvedBottomContent = bottomContent ?? bottom ?? null
  const resolvedMetaText = String(metaText || '').trim()
  const hasDiscount =
    typeof dish.discountPrice === 'number' &&
    dish.discountPrice > 0 &&
    dish.discountPrice < dish.originalPrice
  const [pressed, setPressed] = React.useState(false)

  function handleOpenClick(): void {
    if (!onOpen) return
    onOpen(dish.id)
  }

  function clearPressed(): void {
    setPressed(false)
  }

  return (
    <article
      className={cx('ndjc-catalog-item-card', selected && 'is-selected', dish.isSoldOut && 'is-disabled')}
      style={{
        ...apkCatalogCardStyle(pressed),
        opacity: dish.isSoldOut ? APK_SHOWCASE_ITEM_UI.disabledAlpha : 1,
        outline: selected ? APK_SHOWCASE_ITEM_UI.selectedOutline : '0 solid transparent'
      }}
    >
      <button
        type="button"
        className="ndjc-catalog-item-main"
        style={apkCatalogMainButtonStyle}
        disabled={!onOpen}
        onPointerDown={() => setPressed(true)}
        onPointerUp={clearPressed}
        onPointerCancel={clearPressed}
        onPointerLeave={clearPressed}
        onClick={handleOpenClick}
      >
<span className="ndjc-catalog-item-media" style={apkCatalogMediaStyle}>
  <NdjcShimmerImage
    src={dishImage(dish)}
    alt={title}
    placeholderCornerRadius={APK_SHOWCASE_ITEM_UI.catalogImageRadius}
    contentScale="cover"
  />
</span>

        <span className="ndjc-catalog-item-body" style={apkCatalogBodyStyle}>
          <strong className="ndjc-catalog-item-title" style={apkCatalogTitleStyle}>
            {title}
          </strong>

          <span className="ndjc-catalog-item-spacer" style={apkCatalogSpacerStyle} aria-hidden="true" />

          <NdjcItemStatusBadgeRow
            recommended={dish.isRecommended}
            hidden={dish.isHidden}
          />

          <span className="ndjc-catalog-item-spacer" style={apkCatalogSpacerStyle} aria-hidden="true" />

          <span className="ndjc-catalog-price-stack" style={apkCatalogPriceStackStyle}>
            {resolvedBottomContent ? (
              <span
                className="ndjc-catalog-item-bottom-content"
                style={{
                  minWidth: 0,
                  width: '100%',
                  display: 'block',
                  overflow: 'visible'
                }}
              >
                {resolvedBottomContent}
              </span>
            ) : (
              <span
                className="ndjc-catalog-price-meta-row"
                style={{
                  ...apkCatalogPriceRowStyle,
                  width: '100%',
                  alignItems: 'center'
                }}
              >
                <span
                  className="ndjc-catalog-price-row-main"
                  style={apkCatalogPriceRowStyle}
                >
                  <b style={apkCatalogPriceStyle}>{priceText(salePrice)}</b>
                  {hasDiscount ? (
                    <em style={apkCatalogOriginalPriceStyle}>
                      {priceText(dish.originalPrice)}
                    </em>
                  ) : null}
                </span>

                {resolvedMetaText ? (
                  <span style={apkCatalogMetaTextStyle}>
                    {resolvedMetaText}
                  </span>
                ) : null}
              </span>
            )}

            {showCategory && categoryLabel ? (
              <span className="ndjc-catalog-category-chip" style={apkCatalogCategoryChipStyle}>
                {categoryLabel}
              </span>
            ) : null}
          </span>
        </span>
      </button>

      {trailing ? (
        <div
          className="ndjc-catalog-item-trailing"
          style={{
            minWidth: 0,
            display: 'grid',
            placeItems: 'center'
          }}
          onPointerDown={event => event.stopPropagation()}
          onClick={event => event.stopPropagation()}
        >
          {trailing}
        </div>
      ) : null}

      {onToggleSelect ? (
        <NdjcSelectionCheckbox
          selected={Boolean(selected)}
          onClick={() => onToggleSelect(dish.id)}
        />
      ) : null}
    </article>
  )
}

export function NdjcLinkedCatalogItemCard({
  title,
  imageUrl,
  subtitle,
  price,
  originalPrice,
  discountPrice,
  selected,
  available = true,
  allowClickWhenUnavailable = false,
  imageUnavailableText,
  showSelectedOutline = true,
  onOpen,
  onToggleSelect,
  trailing,
  middle,
  bottom
}: {
  title: string
  imageUrl?: string | null
  subtitle?: string
  price?: string
  originalPrice?: string | null
  discountPrice?: string | null
  selected?: boolean
  available?: boolean
  allowClickWhenUnavailable?: boolean
  imageUnavailableText?: string | null
  showSelectedOutline?: boolean
  onOpen?: () => void
  onToggleSelect?: () => void
  trailing?: React.ReactNode
  middle?: React.ReactNode
  bottom?: React.ReactNode
}) {
  const cleanTitle = title || 'Untitled item'
  const cleanPrice = String(price || '').trim()
  const cleanOriginalPrice = String(originalPrice || '').trim()
  const cleanDiscountPrice = String(discountPrice || '').trim()
  const visiblePrice = cleanDiscountPrice || cleanPrice
  const visibleOriginalPrice = cleanDiscountPrice && cleanOriginalPrice && cleanOriginalPrice !== cleanDiscountPrice
    ? cleanOriginalPrice
    : null
  const cleanImageUnavailableText = String(imageUnavailableText || 'Item no longer available').trim()
  const clickEnabled = available || allowClickWhenUnavailable
  const cardPressEnabled = Boolean(clickEnabled && onOpen)
  const resolvedImageUrl = available ? imageUrl : null
  const selectedOutline = selected && showSelectedOutline
    ? APK_SHOWCASE_ITEM_UI.selectedOutline
    : '0 solid transparent'
  const [pressed, setPressed] = React.useState(false)

  function clearPressed(): void {
    setPressed(false)
  }

  return (
    <article
      className={cx('ndjc-linked-catalog-item-card', selected && 'is-selected', !available && 'is-disabled')}
      style={{
        ...apkCatalogCardStyle(pressed),
        opacity: available ? 1 : APK_SHOWCASE_ITEM_UI.disabledAlpha,
        outline: selectedOutline
      }}
    >
      <button
        type="button"
        className="ndjc-linked-catalog-item-main"
        style={{
          ...apkCatalogMainButtonStyle,
          cursor: cardPressEnabled ? 'pointer' : 'default'
        }}
        disabled={!cardPressEnabled}
        onPointerDown={() => {
          if (cardPressEnabled) {
            setPressed(true)
          }
        }}
        onPointerUp={clearPressed}
        onPointerCancel={clearPressed}
        onPointerLeave={clearPressed}
        onClick={() => {
          if (cardPressEnabled) {
            onOpen?.()
          }
        }}
      >
        <span
          className="ndjc-catalog-item-media"
          style={{
            ...apkCatalogMediaStyle,
            display: 'grid',
            placeItems: 'center',
            background: !available ? APK_SHOWCASE_ITEM_UI.chipBg : apkCatalogMediaStyle.background,
            padding: !available ? 6 : apkCatalogMediaStyle.padding,
            boxSizing: 'border-box'
          }}
        >
          {available ? (
            <NdjcShimmerImage
              src={resolvedImageUrl}
              alt={cleanTitle}
              placeholderCornerRadius={APK_SHOWCASE_ITEM_UI.catalogImageRadius}
              contentScale="cover"
            />
          ) : (
            <span
              style={{
                maxWidth: '100%',
                color: 'rgba(0, 0, 0, 0.55)',
                fontSize: APK_SHOWCASE_ITEM_UI.catalogCategorySize,
                lineHeight: 1.2,
                fontWeight: 500,
                textAlign: 'center',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {cleanImageUnavailableText}
            </span>
          )}
        </span>

        <span className="ndjc-catalog-item-body" style={apkCatalogBodyStyle}>
          <strong className="ndjc-catalog-item-title" style={apkCatalogTitleStyle}>
            {cleanTitle}
          </strong>

          <span className="ndjc-catalog-item-spacer" style={apkCatalogSpacerStyle} aria-hidden="true" />

          {middle ? (
            <span className="ndjc-linked-catalog-item-middle" style={{ minWidth: 0, display: 'block' }}>
              {middle}
            </span>
          ) : null}

          <span className="ndjc-catalog-item-spacer" style={apkCatalogSpacerStyle} aria-hidden="true" />

          <span className="ndjc-catalog-price-stack" style={apkCatalogPriceStackStyle}>
            {bottom ? (
              <span className="ndjc-catalog-item-bottom" style={{ minWidth: 0, display: 'block' }}>
                {bottom}
              </span>
            ) : (
              <span className="ndjc-catalog-price-row" style={apkCatalogPriceRowStyle}>
                {visiblePrice ? <b style={apkCatalogPriceStyle}>{visiblePrice}</b> : null}
                {visibleOriginalPrice ? (
                  <em style={apkCatalogOriginalPriceStyle}>
                    {visibleOriginalPrice}
                  </em>
                ) : null}
              </span>
            )}

            {subtitle ? (
              <span className="ndjc-catalog-category-chip" style={apkCatalogCategoryChipStyle}>
                {subtitle}
              </span>
            ) : null}
          </span>
        </span>
      </button>

      {trailing ? (
        <div
          className="ndjc-linked-catalog-trailing"
          style={{
            minWidth: 0,
            display: 'grid',
            placeItems: 'center'
          }}
        >
          {trailing}
        </div>
      ) : null}

      {onToggleSelect ? (
        <NdjcSelectionCheckbox selected={Boolean(selected)} onClick={onToggleSelect} />
      ) : null}
    </article>
  )
}

export function NdjcChatToolButton({
  label,
  icon,
  onClick,
  disabled,
  className
}: NdjcIconButtonProps) {
  return (
    <button
      type="button"
      className={cx('ndjc-chat-tool-button', className)}
      style={apkChatToolButtonStyle(disabled)}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
    >
      <span
        style={{
          width: APK_CHAT_UI.toolButtonIconSize,
          height: APK_CHAT_UI.toolButtonIconSize,
          display: 'grid',
          placeItems: 'center',
          fontSize: APK_CHAT_UI.toolButtonIconSize,
          lineHeight: 1
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <strong
        style={{
          fontSize: 12,
          lineHeight: 1,
          fontWeight: 600
        }}
      >
        {label}
      </strong>
    </button>
  )
}

export function MutedText({
  children,
  text,
  className
}: {
  children?: React.ReactNode
  text?: string
  className?: string
}) {
  return (
    <p className={cx('ndjc-muted-text', className)} style={apkMutedTextStyle}>
      {text ?? children}
    </p>
  )
}

export function BgCircle({
  className,
  size = APK_SHELL_UI.bgCircleDefaultSize,
  offsetX = 0,
  offsetY = 0,
  colors
}: {
  className?: string
  size?: number | string
  offsetX?: number | string
  offsetY?: number | string
  colors?: readonly string[]
}) {
  return (
    <span
      className={cx('ndjc-bg-circle', className)}
      style={apkBgCircleStyle({ size, offsetX, offsetY, colors })}
      aria-hidden="true"
    />
  )
}
export function NdjcAdminPageProgressSlot({
  active,
  className,
  style
}: {
  active: boolean
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={cx('ndjc-admin-page-progress-slot', className)}
      style={{
        width: '100%',
        height: 4,
        borderRadius: 999,
        overflow: 'hidden',
        background: active ? 'rgba(38, 198, 164, 0.18)' : 'transparent',
        transition: 'background 120ms ease',
        flexShrink: 0,
        position: 'relative',
        ...style
      }}
      aria-hidden="true"
      data-active={active ? 'true' : 'false'}
    >
      <div
        className="ndjc-admin-page-progress-bar"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '42%',
          height: '100%',
          borderRadius: 999,
          background: APK_SHELL_UI.green,
          opacity: active ? 1 : 0,
          animation: active ? 'ndjcAdminProgressSlide 1.15s ease-in-out infinite' : 'none',
          transition: 'opacity 120ms ease',
          willChange: active ? 'transform' : undefined
        }}
      />
    </div>
  )
}
export function NdjcPullRefreshContainer({
  children,
  isRefreshing = false,
  refreshing,
  onRefresh,
  showIndicator = true,
  showHint = false
}: {
  children: React.ReactNode
  isRefreshing?: boolean
  refreshing?: boolean
  onRefresh?: () => void
  showIndicator?: boolean
  showHint?: boolean
}) {
  const activeRefreshing = refreshing ?? isRefreshing
  const [pullHintState, setPullHintState] = React.useState<'idle' | 'pull' | 'release'>('idle')
  const touchStartYRef = React.useRef<number | null>(null)
  const touchStartXRef = React.useRef<number | null>(null)
  const pullDistanceRef = React.useRef(0)
  const refreshLockedRef = React.useRef(false)

  function resetPullState(): void {
    touchStartYRef.current = null
    touchStartXRef.current = null
    pullDistanceRef.current = 0
    setPullHintState('idle')
  }

  function findScrollableParent(target: EventTarget | null): HTMLElement | null {
    let node = target instanceof HTMLElement ? target : null

    while (node) {
      const overflowY = window.getComputedStyle(node).overflowY
      const canScroll = node.scrollHeight > node.clientHeight
      const isScrollable = canScroll && (overflowY === 'auto' || overflowY === 'scroll')

      if (isScrollable) {
        return node
      }

      node = node.parentElement
    }

    return null
  }

  function handleTouchStart(event: React.TouchEvent<HTMLElement>): void {
    if (activeRefreshing || refreshLockedRef.current || !onRefresh) return

    const touch = event.touches[0]
    if (!touch) return

    const scrollable = findScrollableParent(event.target)
    if (scrollable && scrollable.scrollTop > 0) {
      resetPullState()
      return
    }

    touchStartYRef.current = touch.clientY
    touchStartXRef.current = touch.clientX
    pullDistanceRef.current = 0
    setPullHintState('idle')
  }

  function handleTouchMove(event: React.TouchEvent<HTMLElement>): void {
    if (activeRefreshing || refreshLockedRef.current || !onRefresh) return
    if (touchStartYRef.current == null || touchStartXRef.current == null) return

    const touch = event.touches[0]
    if (!touch) return

    const deltaY = touch.clientY - touchStartYRef.current
    const deltaX = Math.abs(touch.clientX - touchStartXRef.current)

    if (deltaY <= 0 || deltaX > deltaY) {
      pullDistanceRef.current = 0
      setPullHintState('idle')
      return
    }

    const scrollable = findScrollableParent(event.target)
    if (scrollable && scrollable.scrollTop > 0) {
      pullDistanceRef.current = 0
      setPullHintState('idle')
      return
    }

    pullDistanceRef.current = deltaY

    if (deltaY >= 40) {
      setPullHintState('release')
    } else if (deltaY >= 8) {
      setPullHintState('pull')
    } else {
      setPullHintState('idle')
    }
  }

  function handleTouchEnd(): void {
    if (activeRefreshing || refreshLockedRef.current || !onRefresh) {
      resetPullState()
      return
    }

    const shouldRefresh = pullDistanceRef.current >= 40

    resetPullState()

    if (!shouldRefresh) return

    refreshLockedRef.current = true

    try {
      onRefresh()
    } finally {
      window.setTimeout(() => {
        refreshLockedRef.current = false
      }, 900)
    }
  }

  function handleTouchCancel(): void {
    resetPullState()
  }

  const hintText = activeRefreshing
    ? 'Refreshing...'
    : pullHintState === 'release'
      ? 'Release to refresh'
      : pullHintState === 'pull'
        ? 'Pull to refresh'
        : ''

  return (
    <section
      className={cx('ndjc-pull-refresh-container', activeRefreshing && 'is-refreshing')}
      style={apkPullRefreshRootStyle}
      data-refreshing={activeRefreshing ? 'true' : 'false'}
      aria-busy={activeRefreshing}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {showHint ? (
        <div
          className="ndjc-pull-refresh-hint-wrap"
          style={apkPullRefreshHintStyle}
          aria-hidden="true"
          data-visible={hintText ? 'true' : 'false'}
        >
          <span
            className="ndjc-pull-refresh-hint-pill"
            style={{
              ...apkPullRefreshHintPillStyle,
              opacity: hintText ? 1 : 0,
              transform: hintText ? 'translateY(18px)' : 'translateY(-120%)'
            }}
          >
            {hintText || 'Pull to refresh'}
          </span>
        </div>
      ) : null}

      {activeRefreshing && showIndicator ? (
        <div
          className="ndjc-pull-refresh-indicator-wrap"
          style={apkPullRefreshIndicatorWrapStyle}
          aria-hidden="true"
        >
          <NdjcSpinner
            className="ndjc-pull-refresh-indicator"
            size={APK_SHELL_UI.pullRefreshIndicatorSize}
            stroke={2}
            tone="primary"
            style={apkPullRefreshIndicatorStyle}
          />
        </div>
      ) : null}

      {children}
    </section>
  )
}
export function NdjcAdminPullRefreshContainer({
  children,
  isRefreshing = false,
  refreshing,
  onRefresh
}: {
  children: React.ReactNode
  isRefreshing?: boolean
  refreshing?: boolean
  onRefresh?: () => void
}) {
  return (
    <NdjcPullRefreshContainer
      isRefreshing={isRefreshing}
      refreshing={refreshing}
      onRefresh={onRefresh}
      showIndicator={false}
      showHint
    >
      {children}
    </NdjcPullRefreshContainer>
  )
}

export function NdjcCustomerPullRefreshContainer({
  children,
  isRefreshing = false,
  refreshing,
  onRefresh
}: {
  children: React.ReactNode
  isRefreshing?: boolean
  refreshing?: boolean
  onRefresh?: () => void
}) {
  return (
    <NdjcPullRefreshContainer
      isRefreshing={isRefreshing}
      refreshing={refreshing}
      onRefresh={onRefresh}
      showIndicator={false}
      showHint
    >
      {children}
    </NdjcPullRefreshContainer>
  )
}
function withUsd(value: number | string | null | undefined): string {
  const numericValue = typeof value === 'number' ? value : Number(value || 0)
  return priceText(numericValue)
}

function ndjcMoneyTrim2(value: number): string {
  if (!Number.isFinite(value)) return '0'
  return value.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')
}

function colors() {
  return {
    bg: 'var(--ndjc-apk-bg)',
    card: 'var(--ndjc-apk-card)',
    ink: 'var(--ndjc-apk-ink)',
    muted: 'var(--ndjc-apk-muted)',
    pink: 'var(--ndjc-apk-pink)',
    mint: 'var(--ndjc-apk-mint)'
  }
}

function neuOutlinedTextFieldColors() {
  return colors()
}

function requestExit(onBack?: () => void) {
  onBack?.()
}

function scrollToField(id: string) {
  if (typeof document === 'undefined') return
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function hasHalfFilled(name: string, value: string): boolean {
  return Boolean(name.trim()) !== Boolean(value.trim())
}

function normalizeAppointmentTimeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

function splitAppointmentAvailableHours(value: string): [string, string] {
  const normalized = normalizeAppointmentTimeText(value)
  const parts = normalized.split(/[-–—]/).map(item => item.trim()).filter(Boolean)
  return [parts[0] || '09:00', parts[1] || '17:00']
}

function appointmentTimeOptions(): string[] {
  return Array.from({ length: 48 }, (_, index) => {
    const hour = Math.floor(index / 2)
    const minute = index % 2 === 0 ? '00' : '30'

    return `${String(hour).padStart(2, '0')}:${minute}`
  })
}

function appointmentFilterDateLabel(value: string): string {
  const raw = String(value || '').trim()

  if (raw.toLowerCase() === 'all') return 'All'

  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return raw

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return raw
  }

  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return raw
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

function appointmentHistoryDateLabel(value: string): string {
  const raw = String(value || '').trim()

  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return raw || 'History date'

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return raw || 'History date'
  }

  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return raw || 'History date'
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

function appointmentCalendarMonthTitle(year: number, month: number): string {
  const date = new Date(year, Math.max(0, month - 1), 1)

  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

function appointmentCalendarDateValue(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

function moveHistoryCalendarMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const date = new Date(year, Math.max(0, month - 1) + delta, 1)
  return { year: date.getFullYear(), month: date.getMonth() + 1 }
}



function parseTimeMsFromTimeText(value: string): number {
  const time = Date.parse(value)
  return Number.isFinite(time) ? time : 0
}

type NdjcParsedChatPayloadUi = {
  body: string
  productBlock: string | null
  quoteBlock: string | null
  imageUrls: string[]
}

type NdjcProductCardUi = {
  dishId: string
  title: string
  price: string
  originalPriceText: string | null
  discountPriceText: string | null
  imageUrl: string | null
  isRecommended: boolean
}

type NdjcParsedQuoteUi = {
  quotedMessageId: string | null
  quotedText: string | null
}

const NDJC_QUOTE_START_UI = '⟪Q⟫'
const NDJC_QUOTE_END_UI = '⟪/Q⟫'
const NDJC_PRODUCT_START_UI = '⟪P⟫'
const NDJC_PRODUCT_END_UI = '⟪/P⟫'

function findBetween(text: string, start: string, end: string): string | null {
  const startIndex = text.indexOf(start)
  if (startIndex < 0) return null

  const contentStart = startIndex + start.length
  const endIndex = text.indexOf(end, contentStart)
  if (endIndex < 0) return null

  return text.slice(contentStart, endIndex)
}

function parseNdjcProductBlock(block: string): NdjcProductCardUi | null {
  const normalized = String(block || '').trim()
  if (!normalized) return null

  const unicodeProductBlock = normalized.includes(NDJC_PRODUCT_START_UI)
    ? findBetween(normalized, NDJC_PRODUCT_START_UI, NDJC_PRODUCT_END_UI)
    : null

  const legacyProductBlock = normalized.includes('[product]')
    ? findBetween(normalized, '[product]', '[/product]')
    : null

  const explicitProductBlock = unicodeProductBlock != null
    ? unicodeProductBlock
    : legacyProductBlock != null
      ? legacyProductBlock
      : normalized

  const productLine = explicitProductBlock
    .trim()
    .split(/\r?\n/)
    .find(item => item.trim()) || ''

  const pipeParts = productLine.split('|')
  const hasPipeProductShape = pipeParts.length >= 2 && (
    Boolean(String(pipeParts[0] || '').trim()) ||
    Boolean(String(pipeParts[1] || '').trim())
  )

  if (unicodeProductBlock != null || legacyProductBlock != null || hasPipeProductShape) {
    if (!hasPipeProductShape) return null

    const dishId = String(pipeParts[0] || '').trim()
    const title = String(pipeParts[1] || '').trim()
    const price = String(pipeParts[2] || '').trim()
    const imageUrl = String(pipeParts[3] || '').trim() || null
    const isRecommended = String(pipeParts[4] || '').trim() === '1'
    const originalPriceText = String(pipeParts[5] || '').trim() || price || null
    const discountPriceText = String(pipeParts[6] || '').trim() || null

    if (!dishId && !title) return null

    return {
      dishId,
      title: title || 'Shared item',
      price,
      originalPriceText,
      discountPriceText,
      imageUrl,
      isRecommended
    }
  }

  const hasLegacyFieldShape =
    normalized.includes('dishId=') ||
    normalized.includes('dishId:') ||
    normalized.includes('title=') ||
    normalized.includes('title:') ||
    normalized.includes('price=') ||
    normalized.includes('price:') ||
    normalized.includes('imageUrl=') ||
    normalized.includes('imageUrl:')

  if (!hasLegacyFieldShape) return null

  const dishId = findBetween(normalized, 'dishId=', ';') || findBetween(normalized, 'dishId:', '\n') || ''
  const title = findBetween(normalized, 'title=', ';') || findBetween(normalized, 'title:', '\n') || ''
  const price = findBetween(normalized, 'price=', ';') || findBetween(normalized, 'price:', '\n') || ''
  const imageUrl = findBetween(normalized, 'imageUrl=', ';') || findBetween(normalized, 'imageUrl:', '\n')

  if (!dishId && !title.trim()) return null

  return {
    dishId,
    title: title.trim() || 'Shared item',
    price,
    originalPriceText: price || null,
    discountPriceText: null,
    imageUrl,
    isRecommended: false
  }
}

function parseNdjcQuotePayloadUi(text: string): NdjcParsedQuoteUi {
  const source = String(text || '')

  if (source.startsWith(NDJC_QUOTE_START_UI)) {
    const endIndex = source.indexOf(NDJC_QUOTE_END_UI)

    if (endIndex > NDJC_QUOTE_START_UI.length) {
      const quoteRaw = source.slice(NDJC_QUOTE_START_UI.length, endIndex).trim()
      const firstNewLine = quoteRaw.indexOf('\n')
      const quotedMessageId = firstNewLine > 0
        ? quoteRaw.slice(0, firstNewLine).trim() || null
        : null
      const quotedText = firstNewLine > 0
        ? quoteRaw.slice(firstNewLine + 1).replace(/^[\n ]+/, '').trim() || null
        : quoteRaw.trim() || null

      return {
        quotedMessageId,
        quotedText
      }
    }
  }

  return {
    quotedMessageId: findBetween(source, '[quote:', ']'),
    quotedText: findBetween(source, '[quoteText]', '[/quoteText]')
  }
}

function parseNdjcChatPayloadUi(text: string): NdjcParsedChatPayloadUi {
  const source = String(text || '')
  const productBlock = findBetween(source, NDJC_PRODUCT_START_UI, NDJC_PRODUCT_END_UI)
    || findBetween(source, '[product]', '[/product]')
  const quoteBlock = findBetween(source, NDJC_QUOTE_START_UI, NDJC_QUOTE_END_UI)
    || findBetween(source, '[quote]', '[/quote]')
  const imageUrls = Array.from(source.matchAll(/https?:\/\/\S+?\.(?:png|jpe?g|webp|gif)/gi)).map(match => match[0])
  const body = source
    .replace(/⟪P⟫[\s\S]*?⟪\/P⟫/g, '')
    .replace(/⟪Q⟫[\s\S]*?⟪\/Q⟫/g, '')
    .replace(/\[product\][\s\S]*?\[\/product\]/g, '')
    .replace(/\[quote\][\s\S]*?\[\/quote\]/g, '')
    .trim()

  return { body, productBlock, quoteBlock, imageUrls }
}

function fallbackFindQuotedMessageId(messages: ShowcaseChatMessage[], text: string): string | null {
  const parsed = parseNdjcQuotePayloadUi(text)

  if (parsed.quotedMessageId) return parsed.quotedMessageId

  const quotedText = parsed.quotedText?.trim()
  if (!quotedText) return null

  return messages.find(message => message.body.includes(quotedText))?.id || null
}

function chatProductShareFromParsedProduct(product: NdjcProductCardUi): ShowcaseChatProductShare {
  return {
    dishId: product.dishId,
    title: product.title,
    price: product.price,
    originalPriceText: product.originalPriceText,
    discountPriceText: product.discountPriceText,
    imageUrl: product.imageUrl,
    isRecommended: product.isRecommended
  }
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  const cleanText = text.trim()
  if (!cleanText) return false

  if (typeof document !== 'undefined') {
    const previousActiveElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null

    const textarea = document.createElement('textarea')
    textarea.value = cleanText
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'fixed'
    textarea.style.left = '0'
    textarea.style.top = '0'
    textarea.style.width = '1px'
    textarea.style.height = '1px'
    textarea.style.opacity = '0'
    textarea.style.pointerEvents = 'none'
    textarea.style.zIndex = '-1'

    document.body.appendChild(textarea)

    try {
      textarea.focus({ preventScroll: true })
    } catch {
      textarea.focus()
    }

    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)

    try {
      const copied = document.execCommand('copy')
      document.body.removeChild(textarea)

      if (previousActiveElement) {
        try {
          previousActiveElement.focus({ preventScroll: true })
        } catch {
          previousActiveElement.focus()
        }
      }

      if (copied) return true
    } catch {
      document.body.removeChild(textarea)

      if (previousActiveElement) {
        try {
          previousActiveElement.focus({ preventScroll: true })
        } catch {
          previousActiveElement.focus()
        }
      }
    }
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(cleanText)
      return true
    }
  } catch {
    return false
  }

  return false
}

function quotePreviewTextFromMessage(message: ShowcaseChatMessage): string {
  const directPreview = String(message.quotePreviewText || '').trim()
  if (directPreview) return directPreview

  if (message.body.trim()) return message.body.trim()
  if (message.product) return message.product.title || 'Shared item'
  if (message.appointment) return appointmentShareSummaryText(message.appointment)
  if (message.imageUrls.length) return 'Photo'

  return 'Quoted message'
}

function resetDragState() {
  return { draggingIndex: -1, targetIndex: -1 }
}

function findTargetIndex(index: number, length: number): number {
  return Math.min(Math.max(index, 0), Math.max(length - 1, 0))
}

function movePreview<T>(items: T[], from: number, to: number): T[] {
  const next = [...items]
  const safeFrom = findTargetIndex(from, next.length)
  const safeTo = findTargetIndex(to, next.length)
  const [item] = next.splice(safeFrom, 1)

  if (item !== undefined) {
    next.splice(safeTo, 0, item)
  }

  return next
}

function rememberFindHighlightStyle(isOutgoing: boolean): React.CSSProperties {
  return {
    background: isOutgoing ? 'rgba(255,255,255,.24)' : 'rgba(255,143,151,.18)',
    borderRadius: 6,
    padding: '0 2px'
  }
}

function highlightQueryText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index < 0) return text

  return (
    <>
      {text.slice(0, index)}
      <mark className="ndjc-find-highlight">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  )
}

function alignLastBubbleToFooterLine() {
  return undefined
}

export function DishListCard({
  dish,
  onOpen,
  priorityImage = false
}: {
  dish: ShowcaseHomeDish
  onOpen: (id: string) => void
  priorityImage?: boolean
}) {
  const originalPrice = Number(dish.originalPrice)
  const discountPrice = dish.discountPrice
  const safeOriginalPrice = Number.isFinite(originalPrice) ? originalPrice : 0
  const hasDiscount =
    typeof discountPrice === 'number' &&
    discountPrice > 0 &&
    discountPrice < originalPrice
  const primaryText = hasDiscount ? priceText(discountPrice) : priceText(safeOriginalPrice)
  const secondaryText = hasDiscount ? priceText(safeOriginalPrice) : null

  return (
    <NdjcHomeStyleMediaCard
      title={dish.title}
      imageUrl={selectDishImageUrl(dish, 'home')}
      imageBlurDataUrl={selectShowcaseImageBlurDataUrl(dish.imageVariants)}
      primaryText={primaryText}
      secondaryText={secondaryText}
      badgeText={dish.isRecommended ? APK_SHOWCASE_ITEM_UI.homeBadgeText : null}
      onClick={() => onOpen(dish.id)}
      priorityImage={priorityImage}
trailingOverlay={
  dish.isFavorite ? (
    <svg
      className="ndjc-apk-dish-fav is-active"
      style={apkHomeFavoriteIconStyle}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  ) : null
}
    />
  )
}

export function ShowcaseDishDetail({
  state,
  actions
}: {
  state: ShowcaseDetailUiState
  actions: ShowcaseDetailActions
}) {
  return <DetailScreen state={state} actions={actions} />
}

export function ShowcaseLogin({
  state,
  actions
}: {
  state: ShowcaseLoginUiState
  actions: ShowcaseLoginActions
}) {
  return <LoginScreen state={state} actions={actions} />
}

function FavSortChip({
  text,
  selected,
  onClick
}: {
  text: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cx('ndjc-fav-sort-chip', selected && 'is-selected')}
      style={apkFilterChipStyle(selected)}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span>{text}</span>
    </button>
  )
}

function FavoritesSortChip({
  text,
  selected,
  onClick
}: {
  text: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cx('ndjc-favorites-sort-chip', selected && 'is-selected')}
      style={apkFilterChipStyle(selected)}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span>{text}</span>
    </button>
  )
}

export function ShowcaseFavorites({
  state,
  actions
}: {
  state: ShowcaseFavoritesUiState
  actions: ShowcaseFavoritesActions
}) {
  return <ShowcaseFavoritesScreen state={state} actions={actions} />
}

function AppointmentDatePill({
  title,
  subtitle,
  selected,
  disabled,
  onClick
}: {
  title: string
  subtitle?: string
  selected: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <AppointmentCalendarDayButton
      title={title}
      subtitle={subtitle}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
    />
  )
}

function AppointmentTimeSettingRow({
  label,
  value,
  onChange
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <section
      className="ndjc-appointment-time-setting-row"
      style={{
        width: '100%',
        borderRadius: APK_APPOINTMENT_UI.timeSettingRadius,
        color: APK_APPOINTMENT_UI.black,
        background: APK_APPOINTMENT_UI.softSurface,
        boxShadow: 'none'
      }}
    >
      <label
        style={{
          width: '100%',
          padding: `${APK_APPOINTMENT_UI.timeSettingPaddingY}px ${APK_APPOINTMENT_UI.timeSettingPaddingX}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12
        }}
      >
        <span
          style={{
            color: APK_APPOINTMENT_UI.black,
            fontSize: APK_APPOINTMENT_UI.labelMediumSize,
            lineHeight: APK_APPOINTMENT_UI.labelMediumLineHeight,
            fontWeight: APK_APPOINTMENT_UI.labelMediumWeight
          }}
        >
          {label}
        </span>

        <input
          value={value}
          inputMode="numeric"
          onChange={event => onChange(event.target.value)}
          style={{
            width: 96,
            border: 0,
            outline: 0,
            padding: 0,
            textAlign: 'right',
            color: APK_APPOINTMENT_UI.brand,
            background: 'transparent',
            fontSize: APK_APPOINTMENT_UI.labelMediumSize,
            lineHeight: APK_APPOINTMENT_UI.labelMediumLineHeight,
            fontWeight: APK_APPOINTMENT_UI.labelMediumWeight
          }}
          aria-label={label}
        />
      </label>
    </section>
  )
}

function AppointmentHistoryDatePickerSheet({
  open,
  selectedDate,
  onSelect,
  onClose
}: {
  open: boolean
  selectedDate: string
  onSelect: (value: string) => void
  onClose: () => void
}) {
  const today = new Date()
  const initialYear = selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)
    ? Number(selectedDate.slice(0, 4))
    : today.getFullYear()
  const initialMonth = selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)
    ? Number(selectedDate.slice(5, 7))
    : today.getMonth() + 1

  const [visibleYear, setVisibleYear] = React.useState(initialYear)
  const [visibleMonth, setVisibleMonth] = React.useState(initialMonth)
  const dragStateRef = React.useRef({
    active: false,
    startX: 0,
    offsetX: 0
  })

  React.useEffect(() => {
    if (!open) return

    setVisibleYear(initialYear)
    setVisibleMonth(initialMonth)
  }, [open, initialYear, initialMonth])

  if (!open) return null

  const daysInMonth = new Date(visibleYear, visibleMonth, 0).getDate()
  const firstDay = new Date(visibleYear, visibleMonth - 1, 1).getDay()
  const calendarCells: Array<number | null> = []

  for (let index = 0; index < firstDay; index += 1) {
    calendarCells.push(null)
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    calendarCells.push(day)
  }

  while (calendarCells.length < 42) {
    calendarCells.push(null)
  }

  function moveMonth(delta: number): void {
    const next = moveHistoryCalendarMonth(visibleYear, visibleMonth, delta)
    setVisibleYear(next.year)
    setVisibleMonth(next.month)
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    dragStateRef.current = {
      active: true,
      startX: event.clientX,
      offsetX: 0
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>): void {
    const dragState = dragStateRef.current
    if (!dragState.active) return

    dragState.offsetX = event.clientX - dragState.startX
  }

  function handlePointerUp(): void {
    const dragState = dragStateRef.current

    if (dragState.active) {
      if (dragState.offsetX > 80) {
        moveMonth(-1)
      } else if (dragState.offsetX < -80) {
        moveMonth(1)
      }
    }

    dragStateRef.current = {
      active: false,
      startX: 0,
      offsetX: 0
    }
  }

  return (
    <NdjcFilterBottomSheet
      open={open}
      title="Select date"
      clearText=""
      applyText="Done"
      showPriceFields={false}
      showHeaderAction={false}
      showApplyButton={false}
      onClose={onClose}
      onClear={onClose}
      onApply={onClose}
    >
      <section
        className="ndjc-appointment-history-date-picker-sheet"
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}
      >
<section
  className="ndjc-appointment-history-date-picker-month-actions"
  style={{
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  }}
>
  <NdjcPillButton
    selected={false}
    onClick={() => moveMonth(-1)}
  >
    ◀ Prev
  </NdjcPillButton>

  <NdjcPillButton
    selected={false}
    onClick={() => moveMonth(1)}
  >
    Next ▶
  </NdjcPillButton>
</section>

        <h3
          style={{
            width: '100%',
            margin: 0,
            color: APK_APPOINTMENT_UI.black,
            fontSize: APK_APPOINTMENT_UI.titleSmallSize,
            lineHeight: APK_APPOINTMENT_UI.titleSmallLineHeight,
            fontWeight: APK_APPOINTMENT_UI.titleSmallWeight,
            textAlign: 'center'
          }}
        >
          {appointmentCalendarMonthTitle(visibleYear, visibleMonth)}
        </h3>

        <section
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            touchAction: 'pan-y'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <section
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              columnGap: 6
            }}
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span
                key={day}
                style={{
                  color: APK_APPOINTMENT_UI.black55,
                  fontSize: APK_APPOINTMENT_UI.labelSmallSize,
                  lineHeight: APK_APPOINTMENT_UI.labelSmallLineHeight,
                  fontWeight: 600,
                  textAlign: 'center'
                }}
              >
                {day}
              </span>
            ))}
          </section>

          <section
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              columnGap: 6,
              rowGap: 8
            }}
          >
            {calendarCells.map((day, index) => {
              if (day == null) {
                return <span key={`blank-${index}`} style={{ height: APK_APPOINTMENT_UI.calendarDayHeight }} />
              }

              const value = appointmentCalendarDateValue(visibleYear, visibleMonth, day)
              const selected = selectedDate === value

              return (
                <AppointmentCalendarMonthDayButton
                  key={value}
                  text={String(day)}
                  active={selected}
                  onClick={() => onSelect(value)}
                />
              )
            })}
          </section>
        </section>
      </section>
    </NdjcFilterBottomSheet>
  )
}

function AppointmentDetailSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="ndjc-appointment-detail-section-title" style={apkAppointmentSectionTitleStyle}>
      {children}
    </h3>
  )
}

function AppointmentContactCopyLine({
  label,
  value,
  onCopy
}: {
  label: string
  value?: string | null
  onCopy?: (label: string, value: string) => void
}) {
  const cleanValue = value?.trim() || ''
  if (!cleanValue) return null

  async function copyContactValue(): Promise<void> {
    if (!cleanValue || cleanValue === 'No contact provided') return

    if (onCopy) {
      onCopy(label || 'Contact', cleanValue)
      return
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(cleanValue)
        return
      }

      if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea')
        textarea.value = cleanValue
        textarea.setAttribute('readonly', 'true')
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.top = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
    } catch {
      // Copy is best effort in the PWA runtime.
    }
  }

  return (
    <button
      type="button"
      className="ndjc-appointment-contact-copy-line"
      style={{
        ...apkAppointmentDetailLineStyle,
        border: 0,
        padding: 0,
        textAlign: 'left',
        background: 'transparent',
        boxShadow: 'none',
        cursor: cleanValue === 'No contact provided' ? 'default' : 'pointer'
      }}
      onClick={() => {
        void copyContactValue()
      }}
    >
      <span style={apkAppointmentDetailLabelStyle}>{label || 'Contact'}</span>
      <strong
        style={{
          ...apkAppointmentDetailValueStyle,
          color: APK_APPOINTMENT_UI.brand
        }}
      >
        {cleanValue}
      </strong>
    </button>
  )
}

function NdjcBottomTabVertical({
  icon,
  label,
  active,
  showDot = false,
  onClick
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
  showDot?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cx('ndjc-bottom-tab', active && 'is-active')}
      style={apkBottomTabStyle(active)}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      <span className="ndjc-bottom-tab-icon-box" style={apkBottomTabIconBoxStyle}>
        <span className="ndjc-bottom-tab-icon" style={apkBottomTabIconStyle}>
          {icon}
        </span>

        {showDot ? (
          <span className="ndjc-bottom-tab-dot" style={apkBottomTabDotStyle} aria-hidden="true" />
        ) : null}
      </span>

      <strong className="ndjc-bottom-tab-label" style={apkBottomTabLabelStyle}>
        {label}
      </strong>
    </button>
  )
}

function StoreProfileMapPreview({
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

  if (!cleanAddress && !cleanMapUrl) return null

  return (
    <button
      type="button"
      className="ndjc-store-profile-map-preview"
      style={{
        ...apkStoreCardSurfaceStyle,
        textAlign: 'left',
        cursor: handleOpen ? 'pointer' : 'default'
      }}
      disabled={!handleOpen}
      onClick={() => {
        if (openValue) handleOpen?.(openValue)
      }}
    >
      <span
        style={{
          color: APK_STORE_PROFILE_UI.ink70,
          fontSize: 14,
          lineHeight: 1.25,
          fontWeight: 600
        }}
      >
        Address
      </span>

      <span
        style={{
          color: APK_STORE_PROFILE_UI.ink90,
          fontSize: 14,
          lineHeight: 1.45,
          fontWeight: 400,
          overflowWrap: 'anywhere'
        }}
      >
        {displayValue}
      </span>

      <span
        style={{
          color: APK_STORE_PROFILE_UI.ink45,
          fontSize: 12,
          lineHeight: 1.25,
          fontWeight: 500
        }}
      >
        Tap to open
      </span>
    </button>
  )
}

function UniversalStoreCoverPlaceholderCard() {
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

function UniversalStoreLogoPlaceholder() {
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

function UniversalStoreBrandHeader({
  coverUrl,
  logoUrl,
  title,
  subtitle,
  businessStatus,
  onPreview
}: {
  coverUrl: string
  logoUrl: string
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
                cursor: 'pointer'
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
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
            onClick={() => onPreview([cleanLogoUrl], 0)}
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
              overflow: 'hidden',
              flex: '0 0 auto'
            }}
          >
            <UniversalStoreLogoPlaceholder />
          </div>
        )}

        <div
          className="ndjc-apk-store-brand-text"
          style={{
            minWidth: 0,
            flex: '1 1 auto',
            display: 'grid',
            gap: 3
          }}
        >
          <h1
            style={{
              margin: 0,
              color: APK_STORE_PROFILE_UI.ink,
              fontSize: 22,
              lineHeight: 1.15,
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {title.trim() || 'Store'}
          </h1>

          {cleanSubtitle ? (
            <p
              style={{
                margin: 0,
                color: APK_STORE_PROFILE_UI.muted,
                fontSize: 14,
                lineHeight: 1.35,
                fontWeight: 400,
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
        </div>

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
    </section>
  )
}

function UniversalStoreEmptyInfoText() {
  return (
    <p className="ndjc-muted-text" style={apkStoreMutedTextStyle}>
      No information added yet
    </p>
  )
}

function UniversalStoreAboutSection({ description }: { description?: string | null }) {
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
              color: APK_STORE_PROFILE_UI.pink,
              background: 'transparent',
              boxShadow: 'none',
              fontSize: 14,
              lineHeight: 1.25,
              fontWeight: 600
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

function UniversalStoreAppAboutSection({
  appName = 'App',
  versionName = '1.0.0',
  merchantEmail = 'Not provided',
  privacyUrl,
  onOpenPrivacy
}: {
  appName?: string | null
  versionName?: string | null
  merchantEmail?: string | null
  privacyUrl?: string | null
  onOpenPrivacy?: (url: string) => void
}) {
  const cleanAppName = appName?.trim() || 'App'
  const cleanVersion = versionName?.trim() || '1.0.0'
  const cleanEmail = merchantEmail?.trim() || 'Not provided'
  const cleanPrivacyUrl = privacyUrl?.trim() || ''

  return (
    <section className="ndjc-apk-store-section" style={apkStoreSectionStyle}>
      <StoreProfileSectionHeader title="About this app" />

      <div
        style={{
          width: '100%',
          display: 'grid',
          gap: APK_STORE_PROFILE_UI.appAboutGap
        }}
      >
        <ProfileReadOnlyRow label="App Name" value={cleanAppName} />
        <ProfileReadOnlyRow label="Version" value={cleanVersion} />
        <ProfileReadOnlyRow label="Contact" value={cleanEmail} />

        <section
          className="ndjc-profile-read-only-row"
          style={{
            width: '100%',
            display: 'grid',
            gap: APK_STORE_PROFILE_UI.profileReadOnlyGap
          }}
        >
          <span style={apkStoreLabelStyle}>Privacy Policy</span>

          <button
            type="button"
            style={{
              width: 'fit-content',
              border: 0,
              borderRadius: 0,
              padding: 0,
              color: cleanPrivacyUrl ? APK_STORE_PROFILE_UI.pink : APK_STORE_PROFILE_UI.ink45,
              background: 'transparent',
              boxShadow: 'none',
              fontSize: APK_STORE_PROFILE_UI.readOnlyValueSize,
              lineHeight: APK_STORE_PROFILE_UI.readOnlyValueLineHeight,
              fontWeight: 400,
              textDecoration: cleanPrivacyUrl ? 'underline' : 'none',
              cursor: cleanPrivacyUrl ? 'pointer' : 'default'
            }}
            disabled={!cleanPrivacyUrl}
            onClick={() => {
              if (cleanPrivacyUrl) onOpenPrivacy?.(cleanPrivacyUrl)
            }}
          >
            {cleanPrivacyUrl ? 'Open Privacy Policy' : 'Not available'}
          </button>
        </section>
      </div>
    </section>
  )
}

function UniversalStoreLocationSection({
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
            <section style={apkStoreCardSurfaceStyle}>
              <span
                style={{
                  color: APK_STORE_PROFILE_UI.ink70,
                  fontSize: 14,
                  lineHeight: 1.25,
                  fontWeight: 600
                }}
              >
                Hours
              </span>

              <span style={apkStoreBodyTextStyle}>
                {cleanHours}
              </span>
            </section>
          ) : null}
        </>
      )}
    </section>
  )
}

function UniversalStoreServicesSection({ services }: { services: string[] }) {
  const cleanServices = services.map(service => service.trim()).filter(Boolean)

  return (
    <section className="ndjc-apk-store-section" style={apkStoreSectionStyle}>
      <StoreProfileSectionHeader title="Business Scope" />

      {cleanServices.length ? (
        <div
          className="ndjc-apk-store-services-row"
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: APK_STORE_PROFILE_UI.servicesGap
          }}
          role="list"
        >
          {cleanServices.map((service, index) => (
            <span key={`${service}-${index}`} style={apkStoreServiceChipStyle}>
              {service}
            </span>
          ))}
        </div>
      ) : (
        <UniversalStoreEmptyInfoText />
      )}
    </section>
  )
}

function UniversalContactRow({
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
  const longPressTimerRef = React.useRef<number | null>(null)

  if (!cleanValue) return null

  function clearLongPressTimer(): void {
    if (longPressTimerRef.current != null) {
      window.clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  function startLongPressCopy(): void {
    if (typeof window === 'undefined') return

    clearLongPressTimer()

    longPressTimerRef.current = window.setTimeout(() => {
      longPressTimerRef.current = null
      onCopy?.(label, cleanValue)
    }, 520)
  }

  return (
    <button
      type="button"
      className="ndjc-universal-contact-row"
      style={{
        width: '100%',
        minHeight: APK_STORE_PROFILE_UI.contactRowHeight,
        border: 0,
        borderRadius: 0,
        padding: `0 ${APK_STORE_PROFILE_UI.contactCardPaddingX}px`,
        display: 'grid',
        gridTemplateColumns: `${APK_STORE_PROFILE_UI.contactLabelWidth}px 10px minmax(0, 1fr)`,
        alignItems: 'center',
        color: APK_STORE_PROFILE_UI.ink,
        background: 'transparent',
        boxShadow: 'none',
        textAlign: 'left',
        WebkitTapHighlightColor: 'transparent'
      }}
      onPointerDown={startLongPressCopy}
      onPointerUp={clearLongPressTimer}
      onPointerCancel={clearLongPressTimer}
      onPointerLeave={clearLongPressTimer}
      onClick={() => {
        clearLongPressTimer()
        onClick?.()
      }}
      onContextMenu={event => {
        event.preventDefault()
        clearLongPressTimer()
        onCopy?.(label, cleanValue)
      }}
    >
      <span
        style={{
          color: APK_STORE_PROFILE_UI.ink60,
          fontSize: APK_STORE_PROFILE_UI.contactLabelSize,
          lineHeight: 1.25,
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {label}
      </span>

      <span aria-hidden="true" />

      <span
        style={{
          color: onClick ? APK_STORE_PROFILE_UI.pink : APK_STORE_PROFILE_UI.ink,
          fontSize: APK_STORE_PROFILE_UI.contactValueSize,
          lineHeight: 1.35,
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'right'
        }}
      >
        {cleanValue}
      </span>
    </button>
  )
}

function UniversalStoreExtraContactsSection({
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
    <section className="ndjc-apk-store-section" style={apkStoreSectionStyle}>
      <StoreProfileSectionHeader title="More" />

      {cleanContacts.length > 0 ? (
        <div className="ndjc-apk-store-contact-list" style={apkStoreContactCardStyle}>
          {cleanContacts.map((contact, index) => (
            <React.Fragment key={`${contact.name}-${contact.value}-${index}`}>
              <UniversalContactRow
                label={contact.name}
                value={contact.value}
                onCopy={onCopyAccountValue}
              />

              {index !== cleanContacts.length - 1 ? (
                <div
                  style={{
                    height: APK_STORE_PROFILE_UI.contactDividerHeight,
                    margin: `0 ${APK_STORE_PROFILE_UI.contactCardPaddingX}px`,
                    background: APK_STORE_PROFILE_UI.ink10
                  }}
                  aria-hidden="true"
                />
              ) : null}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <UniversalStoreEmptyInfoText />
      )}
    </section>
  )
}

function ProfileReadOnlyRow({ label, value }: { label: string; value?: string | null }) {
  const cleanValue = value?.trim() || '-'

  return (
    <section
      className="ndjc-profile-read-only-row"
      style={{
        width: '100%',
        display: 'grid',
        gap: APK_STORE_PROFILE_UI.profileReadOnlyGap
      }}
    >
      <span
        style={{
          ...apkStoreLabelStyle,
          color: APK_STORE_PROFILE_UI.ink55
        }}
      >
        {label}
      </span>

      <span
        style={{
          margin: 0,
          color: APK_STORE_PROFILE_UI.ink90,
          fontSize: APK_STORE_PROFILE_UI.readOnlyValueSize,
          lineHeight: APK_STORE_PROFILE_UI.readOnlyValueLineHeight,
          fontWeight: 400,
          overflowWrap: 'anywhere'
        }}
      >
        {cleanValue}
      </span>
    </section>
  )
}

function ProfileReadOnlyRowIfNotBlank({ label, value }: { label: string; value?: string | null }) {
  const cleanValue = value?.trim() || ''
  if (!cleanValue) return null
  return <ProfileReadOnlyRow label={label} value={cleanValue} />
}

function StoreExtraContactsEditorRow({
  name,
  value,
  onNameChange,
  onValueChange,
  onRemove
}: {
  name: string
  value: string
  onNameChange: (value: string) => void
  onValueChange: (value: string) => void
  onRemove: () => void
}) {
  return (
    <section
      className="ndjc-store-extra-contact-editor-row"
      style={{
        width: '100%',
        display: 'grid',
        gap: 0
      }}
    >
      <section
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: `minmax(0, ${APK_STORE_EDIT_UI.nameColumnFlex}fr) minmax(0, ${APK_STORE_EDIT_UI.valueColumnFlex}fr)`,
          columnGap: APK_STORE_EDIT_UI.rowGap,
          rowGap: 0,
          alignItems: 'end'
        }}
      >
        <NdjcTextField
          value={name}
          onChange={onNameChange}
          placeholder="Name"
          label="Name"
          singleLine
        />

        <NdjcTextField
          value={value}
          onChange={onValueChange}
          placeholder="Value"
          label="Value"
          singleLine
        />
      </section>

      <section
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <button
          type="button"
          style={apkStoreEditRemoveButtonStyle}
          onClick={onRemove}
        >
          Remove
        </button>
      </section>
    </section>
  )
}

function StoreExtraContactsEditor({ children }: { children?: React.ReactNode }) {
  return (
    <section
      className="ndjc-store-extra-contacts-editor"
      style={{
        width: '100%',
        display: 'grid',
        gap: 0
      }}
    >
      {children}
    </section>
  )
}

function StoreOtherContactMethodsEditor({ children }: { children?: React.ReactNode }) {
  return (
    <section
      className="ndjc-store-other-contact-methods-editor"
      style={{
        width: '100%',
        display: 'grid',
        gap: APK_STORE_EDIT_UI.rowGap
      }}
    >
      <h3
        style={{
          margin: 0,
          color: APK_STORE_EDIT_UI.black75,
          fontSize: 14,
          lineHeight: 1.25,
          fontWeight: 600
        }}
      >
        Other contact methods
      </h3>

      <div style={apkStoreEditCardStyle}>
        {children}
      </div>
    </section>
  )
}

function StoreServicesEditor({
  services,
  onChange,
  onRemove
}: {
  services: string[]
  onChange?: (index: number, value: string) => void
  onRemove?: (index: number) => void
}) {
  return (
    <section
      className="ndjc-store-services-editor"
      style={{
        width: '100%',
        display: 'grid',
        gap: 0
      }}
    >
      {services.map((service, index) => (
        <section
          key={`${index}-${service}`}
          className="ndjc-store-service-editor-row"
          style={{
            width: '100%',
            display: 'grid',
            gap: 0
          }}
        >
          <NdjcTextField
            value={service}
            onChange={value => onChange?.(index, value)}
            label="Service"
            singleLine
          />

          <section
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <button
              type="button"
              style={apkStoreEditRemoveButtonStyle}
              onClick={() => onRemove?.(index)}
              disabled={!onRemove}
            >
              Remove
            </button>
          </section>
        </section>
      ))}
    </section>
  )
}

function StoreProfileLogoPicker({
  src,
  enabled = true,
  onPick,
  onRemove,
  onPreview
}: {
  src?: string | null
  enabled?: boolean
  onPick?: () => void
  onRemove?: () => void
  onPreview?: (images: string[], startIndex: number) => void
}) {
  const logo = src?.trim() || ''

  return (
    <section
      className="ndjc-store-profile-logo-picker"
      style={{
        width: '100%',
        display: 'grid',
        gap: APK_STORE_EDIT_UI.labelBottomGap
      }}
    >
      <h3 style={apkStoreEditPickerTitleStyle}>Logo</h3>

      <section
        style={{
          width: '100%',
          minWidth: 0
        }}
      >
        <div
          style={{
            width: `calc((100% - ${APK_STORE_EDIT_UI.imageCellGap * 2}px) / 3)`,
            minWidth: 0
          }}
        >
          <NdjcSingleEditableImage
            src={logo}
            label="Logo"
            enabled={enabled}
            onPick={onPick}
            onRemove={onRemove}
            onPreview={logo ? () => onPreview?.([logo], 0) : undefined}
          />
        </div>
      </section>
    </section>
  )
}
function StoreProfileCoverPicker({
  src,
  enabled = true,
  onPick,
  onRemove,
  onMove,
  onDraggingChange,
  onPreview
}: {
  src?: string | null
  enabled?: boolean
  onPick?: () => void
  onRemove?: (url: string) => void
  onMove?: (fromIndex: number, toIndex: number) => void
  onDraggingChange?: (isDragging: boolean) => void
  onPreview?: (images: string[], startIndex: number) => void
}) {
  const images = Array.from(
    new Set(
      (src || '')
        .replace(/\\n/g, '\n')
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean)
    )
  ).slice(0, APK_STORE_EDIT_UI.maxCoverImages)

  return (
    <section
      className="ndjc-store-profile-cover-picker"
      style={{
        width: '100%',
        display: 'grid',
        gap: APK_STORE_EDIT_UI.labelBottomGap
      }}
    >
      <h3 style={apkStoreEditPickerTitleStyle}>Cover (up to 9 images)</h3>

      <section
        style={{
          width: '100%',
          minHeight: APK_STORE_EDIT_UI.coverPickerMinHeight
        }}
      >
        <NdjcEditableImageGrid
          imageUrls={images}
          maxImages={APK_STORE_EDIT_UI.maxCoverImages}
          enabled={enabled}
          onPickImage={onPick}
          onRemoveImage={onRemove}
          onMoveImage={onMove}
          onDraggingChange={onDraggingChange}
          onPreviewImages={onPreview}
        />
      </section>
    </section>
  )
}

function StoreProfileHeaderBlock({
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

function PreviewActions(): BackHomeActions & BottomActions {
  return {
    onBack: () => {},
    onBackToHome: () => {},
    onOpenStoreProfileView: () => {},
    onOpenChat: () => {},
    onOpenCustomerBookings: () => {},
    onOpenAnnouncements: () => {},
    onOpenFavorites: () => {}
  }
}

export function ShowcaseLoginPreview() {
  return <PlaceholderScreen title="Login preview" actions={PreviewActions()} />
}

export function ShowcaseDishDetailPreview() {
  return <PlaceholderScreen title="Detail preview" actions={PreviewActions()} />
}

export function ShowcaseEditDishPreview() {
  return <PlaceholderScreen title="Edit item preview" actions={PreviewActions()} />
}

export function ShowcaseAdminPreview() {
  return <PlaceholderScreen title="Admin preview" actions={PreviewActions()} />
}

export function ShowcaseAdminItemsPreview() {
  return <PlaceholderScreen title="Admin items preview" actions={PreviewActions()} />
}

export function ShowcaseStoreProfileViewPreview() {
  return <PlaceholderScreen title="Store profile preview" actions={PreviewActions()} />
}

export function ShowcaseAdminCategoriesPreview() {
  return <PlaceholderScreen title="Admin categories preview" actions={PreviewActions()} />
}

export function ShowcaseHomePreview() {
  return <PlaceholderScreen title="Home preview" actions={PreviewActions()} />
}

export function ShowcaseChatThreadPreview() {
  return <PlaceholderScreen title="Chat preview" actions={PreviewActions()} />
}

export function ShowcaseStoreProfileEditPreview() {
  return <PlaceholderScreen title="Store profile edit preview" actions={PreviewActions()} />
}

export function ShowcaseChatSearchResultsPreview() {
  return <PlaceholderScreen title="Chat search preview" actions={PreviewActions()} />
}

export function ShowcaseChatMediaPreview() {
  return <PlaceholderScreen title="Chat media preview" actions={PreviewActions()} />
}

export function ShowcaseChangePasswordPreview() {
  return <PlaceholderScreen title="Change password preview" actions={PreviewActions()} />
}

export function ShowcaseBottomBarPreview() {
  return <ShowcaseBottomBar actions={PreviewActions()} activeTab="Store" />
}

export function ShowcaseMerchantChatListScreenPreview() {
  return <PlaceholderScreen title="Merchant chat list preview" actions={PreviewActions()} />
}

export function ShowcaseFavoritesScreenPreview() {
  return <PlaceholderScreen title="Favorites preview" actions={PreviewActions()} />
}



function TagsFilterRow({
  allTags,
  selectedTags,
  onToggleTag,
  onClearTags
}: {
  allTags: string[]
  selectedTags: string[]
  onToggleTag: (tag: string) => void
  onClearTags: () => void
}) {
  if (!allTags.length) return null

  return (
    <section
      className="ndjc-tags-filter-row"
      style={{
        width: '100%',
        padding: '4px 0',
        ...apkFilterLazyRowStyle
      }}
      role="list"
    >
      <button
        type="button"
        className={cx('ndjc-filter-chip', selectedTags.length === 0 && 'is-selected')}
        style={apkFilterChipStyle(selectedTags.length === 0)}
        onClick={onClearTags}
        aria-pressed={selectedTags.length === 0}
      >
        <span>All</span>
      </button>

      {allTags.map(tag => {
        const selected = selectedTags.includes(tag)

        return (
          <button
            key={tag}
            type="button"
            className={cx('ndjc-filter-chip', selected && 'is-selected')}
            style={apkFilterChipStyle(selected)}
            onClick={() => onToggleTag(tag)}
            aria-pressed={selected}
          >
            <span>{tag}</span>
          </button>
        )
      })}
    </section>
  )
}

function HomeSortNavEqualRow({
  sortMode,
  onSortModeChange,
  filterRecommendedOnly,
  filterOnSaleOnly,
  appliedMinPrice,
  appliedMaxPrice,
  showFilterMenu,
  onFilterClick
}: {
  sortMode: string
  onSortModeChange: (value: 'Default' | 'PriceAsc' | 'PriceDesc') => void
  filterRecommendedOnly: boolean
  filterOnSaleOnly: boolean
  appliedMinPrice: number | null
  appliedMaxPrice: number | null
  showFilterMenu: boolean
  onFilterClick: () => void
}) {
  const hasToggleFilter = filterRecommendedOnly || filterOnSaleOnly
  const hasPriceFilter = appliedMinPrice != null || appliedMaxPrice != null
  const filterActive = showFilterMenu || hasToggleFilter || hasPriceFilter

  return (
    <SortRow columns={4}>
      <SortNavEqualItem
        text="Default"
        selected={sortMode === 'Default'}
        onClick={() => onSortModeChange('Default')}
      />

      <SortNavEqualItem
        text="Low–High"
        selected={sortMode === 'PriceAsc'}
        onClick={() => onSortModeChange('PriceAsc')}
      />

      <SortNavEqualItem
        text="High–Low"
        selected={sortMode === 'PriceDesc'}
        onClick={() => onSortModeChange('PriceDesc')}
      />

      <SortNavEqualItem
        text="Filter"
        selected={filterActive}
        onClick={onFilterClick}
      />
    </SortRow>
  )
}
function useNdjcHorizontalDragScroll() {
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const dragRef = React.useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    dragging: false,
    movedEnoughToSuppressClick: false,
    suppressClickUntil: 0
  })

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const element = scrollRef.current
    if (!element) return

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: element.scrollLeft,
      dragging: false,
      movedEnoughToSuppressClick: false,
      suppressClickUntil: dragRef.current.suppressClickUntil
    }
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>): void {
    const element = scrollRef.current
    const state = dragRef.current

    if (!element || state.pointerId !== event.pointerId) return

    const deltaX = event.clientX - state.startX
    const deltaY = event.clientY - state.startY
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (!state.dragging && absX < 8) return
    if (!state.dragging && absY > absX) return

    state.dragging = true
    element.scrollLeft = state.startScrollLeft - deltaX

    if (absX >= 14 && absX > absY + 4) {
      state.movedEnoughToSuppressClick = true
      state.suppressClickUntil = Date.now() + 180
      event.preventDefault()
    }
  }

  function onPointerEnd(event: React.PointerEvent<HTMLDivElement>): void {
    const state = dragRef.current

    if (state.pointerId !== event.pointerId) return

    dragRef.current = {
      pointerId: -1,
      startX: 0,
      startY: 0,
      startScrollLeft: 0,
      dragging: false,
      movedEnoughToSuppressClick: false,
      suppressClickUntil: state.movedEnoughToSuppressClick ? Date.now() + 180 : 0
    }
  }

  function shouldSuppressClick(): boolean {
    return Date.now() < dragRef.current.suppressClickUntil
  }

  return {
    scrollRef,
    onPointerDown,
    onPointerMove,
    onPointerUp: onPointerEnd,
    onPointerCancel: onPointerEnd,
    onPointerLeave: onPointerEnd,
    shouldSuppressClick
  }
}
function CategoryChipsRow({
  selectedCategory,
  manualCategories,
  onCategorySelected,
  showAllChip = true,
  useOuterHorizontalPadding = true
}: {
  selectedCategory: string | null
  manualCategories: string[]
  onCategorySelected: (value: string | null) => void
  showAllChip?: boolean
  useOuterHorizontalPadding?: boolean
}) {
  const [expanded, setExpanded] = React.useState(false)
  const [morePressed, setMorePressed] = React.useState(false)
  const horizontalScroll = useNdjcHorizontalDragScroll()
  const maxVisibleCategories = 6
  const shouldShowMore = manualCategories.length > maxVisibleCategories
  const visibleCategories = shouldShowMore ? manualCategories.slice(0, maxVisibleCategories) : manualCategories
  const remainingCategories = shouldShowMore ? manualCategories.slice(maxVisibleCategories) : []

  return (
    <section
      className="ndjc-category-chips-block"
      style={{
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: APK_FILTER_UI.expandedCategoryGap,
        overflow: 'visible',
        boxSizing: 'border-box'
      }}
    >
      <div
        className="ndjc-category-chips-row"
        style={{
          width: '100%',
          minWidth: 0,
          maxWidth: '100%',
          padding: useOuterHorizontalPadding ? `0 ${APK_FILTER_UI.pagePaddingX}px` : 0,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <div
          ref={horizontalScroll.scrollRef}
          className="ndjc-category-chips-scroll"
          style={{
            flex: '1 1 auto',
            minWidth: 0,
            maxWidth: '100%',
            height: APK_FILTER_UI.chipHeight + 4,
            minHeight: APK_FILTER_UI.chipHeight + 4,
            display: 'block',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            overscrollBehaviorX: 'contain',
            padding: '2px 0',
            boxSizing: 'border-box'
          }}
          role="list"
          aria-label="Categories"
          onPointerDown={horizontalScroll.onPointerDown}
          onPointerMove={horizontalScroll.onPointerMove}
          onPointerUp={horizontalScroll.onPointerUp}
          onPointerCancel={horizontalScroll.onPointerCancel}
          onPointerLeave={horizontalScroll.onPointerLeave}
        >
          <div
            style={{
              width: 'max-content',
              minWidth: 'max-content',
              height: APK_FILTER_UI.chipHeight,
              minHeight: APK_FILTER_UI.chipHeight,
              display: 'flex',
              alignItems: 'center',
              gap: APK_FILTER_UI.chipGap
            }}
          >
            {showAllChip ? (
              <span
                style={{
                  flex: '0 0 auto',
                  height: APK_FILTER_UI.chipHeight,
                  minHeight: APK_FILTER_UI.chipHeight,
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <NdjcPillButton
                  selected={selectedCategory == null}
onClick={() => {
  if (horizontalScroll.shouldSuppressClick()) return
  onCategorySelected(null)
  setExpanded(false)
}}
                >
                  All
                </NdjcPillButton>
              </span>
            ) : null}

            {visibleCategories.map(category => {
              const selected = selectedCategory === category

              return (
                <span
                  key={category}
                  style={{
                    flex: '0 0 auto',
                    height: APK_FILTER_UI.chipHeight,
                    minHeight: APK_FILTER_UI.chipHeight,
                    display: 'inline-flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <NdjcPillButton
                    selected={selected}
onClick={() => {
  if (horizontalScroll.shouldSuppressClick()) return
  onCategorySelected(category)
  setExpanded(false)
}}
                  >
                    {category}
                  </NdjcPillButton>
                </span>
              )
            })}

            {shouldShowMore ? (
              <span
                style={{
                  flex: '0 0 auto',
                  height: APK_FILTER_UI.chipHeight,
                  minHeight: APK_FILTER_UI.chipHeight,
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <button
                  type="button"
                  className="ndjc-category-more-chip"
                  style={{
                    width: APK_FILTER_UI.chipHeight,
                    minWidth: APK_FILTER_UI.chipHeight,
                    height: APK_FILTER_UI.chipHeight,
                    border: `${APK_FILTER_UI.chipBorderWidth}px solid ${APK_FILTER_UI.chipBorderColor}`,
                    borderRadius: APK_FILTER_UI.moreChipRadius,
                    padding: 0,
                    display: 'inline-grid',
                    flex: '0 0 auto',
                    placeItems: 'center',
                    color: APK_FILTER_UI.chipTextColor,
                    background: APK_FILTER_UI.chipUnselectedBg,
                    boxShadow: 'none',
                    fontSize: 18,
                    lineHeight: 1,
                    cursor: 'pointer',
                    transform: morePressed ? `scale(${APK_FILTER_UI.chipPressedScale})` : 'scale(1)',
                    transition: 'transform 120ms ease, background 120ms ease',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                  onPointerDown={() => setMorePressed(true)}
                  onPointerUp={() => setMorePressed(false)}
                  onPointerCancel={() => setMorePressed(false)}
                  onPointerLeave={() => setMorePressed(false)}
onClick={() => {
  if (horizontalScroll.shouldSuppressClick()) return
  setExpanded(value => !value)
}}
                  aria-expanded={expanded}
                  aria-label={expanded ? 'Collapse categories' : 'Expand categories'}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                    style={{
                      display: 'block',
                      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 120ms ease'
                    }}
                  >
                    <path
                      fill="currentColor"
                      d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"
                    />
                  </svg>
                </button>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {expanded && remainingCategories.length ? (
        <div
          className="ndjc-category-chips-expanded"
          style={{
            width: '100%',
            minWidth: 0,
            maxWidth: '100%',
            padding: useOuterHorizontalPadding ? `0 ${APK_FILTER_UI.pagePaddingX}px` : 0,
            display: 'flex',
            flexWrap: 'wrap',
            gap: APK_FILTER_UI.chipGap,
            overflow: 'visible',
paddingBottom: 2,
            boxSizing: 'border-box'
          }}
          role="list"
          aria-label="More categories"
        >
          {remainingCategories.map(category => {
            const selected = selectedCategory === category

            return (
              <NdjcPillButton
                key={category}
                selected={selected}
                onClick={() => {
                  onCategorySelected(category)
                  setExpanded(false)
                }}
              >
                {category}
              </NdjcPillButton>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

function SectionDivider() {
  return (
    <div
      className="ndjc-section-divider"
      style={{
        width: '100%',
        height: 1,
        background: 'rgba(0, 0, 0, 0.12)',
        flexShrink: 0
      }}
    />
  )
}

const APK_ADMIN_UI = {
  cardGap: 10,
  cloudInnerGap: 10,
  cloudLineGap: 4,
  spacer8: 8,
  spacer6: 6,
  statusSpacer: 14,
  titleFontSize: 24,
  titleLineHeight: 1.25,
  titleFontWeight: 600,
  cloudTitleFontSize: 14,
  cloudTitleLineHeight: 1.3,
  cloudTitleFontWeight: 600,
  labelFontSize: 12,
  labelLineHeight: 1.35,
  labelFontWeight: 500,
  bodySmallFontSize: 12,
  bodySmallLineHeight: 1.35,
  bodySmallFontWeight: 400,
  titleMediumFontSize: 16,
  titleMediumLineHeight: 1.35,
  titleMediumFontWeight: 600,
  bodyMediumFontSize: 14,
  bodyMediumLineHeight: 1.45,
  bodyMediumFontWeight: 400,
  black: '#000000',
  cloudPlanColor: '#475467',
  cloudStatusColor: '#344054',
  cloudDaysColor: '#101828',
  cloudDateColor: '#667085'
} as const

function AdminSpacer({ height }: { height: number }) {
  return <div style={{ height, flexShrink: 0 }} />
}

function AdminTitleText({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        margin: 0,
        color: APK_ADMIN_UI.black,
        fontSize: APK_ADMIN_UI.titleFontSize,
        lineHeight: APK_ADMIN_UI.titleLineHeight,
        fontWeight: APK_ADMIN_UI.titleFontWeight
      }}
    >
      {children}
    </h1>
  )
}

function AdminSyncNoticeText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        color: APK_ADMIN_UI.black,
        fontSize: APK_ADMIN_UI.bodySmallFontSize,
        lineHeight: APK_ADMIN_UI.bodySmallLineHeight,
        fontWeight: APK_ADMIN_UI.bodySmallFontWeight
      }}
    >
      {children}
    </p>
  )
}

function AdminCloudTitleText({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: 0,
        color: APK_ADMIN_UI.black,
        fontSize: APK_ADMIN_UI.cloudTitleFontSize,
        lineHeight: APK_ADMIN_UI.cloudTitleLineHeight,
        fontWeight: APK_ADMIN_UI.cloudTitleFontWeight
      }}
    >
      {children}
    </h2>
  )
}

function AdminSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: 0,
        color: APK_ADMIN_UI.black,
        fontSize: APK_ADMIN_UI.labelFontSize,
        lineHeight: APK_ADMIN_UI.labelLineHeight,
        fontWeight: APK_ADMIN_UI.labelFontWeight
      }}
    >
      {children}
    </h2>
  )
}

function AdminBodySmallText({
  children,
  color = APK_ADMIN_UI.black
}: {
  children: React.ReactNode
  color?: string
}) {
  return (
    <span
      style={{
        color,
        fontSize: APK_ADMIN_UI.bodySmallFontSize,
        lineHeight: APK_ADMIN_UI.bodySmallLineHeight,
        fontWeight: APK_ADMIN_UI.bodySmallFontWeight
      }}
    >
      {children}
    </span>
  )
}

function AdminTitleMediumText({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        color: APK_ADMIN_UI.cloudDaysColor,
        fontSize: APK_ADMIN_UI.titleMediumFontSize,
        lineHeight: APK_ADMIN_UI.titleMediumLineHeight,
        fontWeight: APK_ADMIN_UI.titleMediumFontWeight
      }}
    >
      {children}
    </span>
  )
}
function AdminStatusMessageText({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="ndjc-apk-admin-status-message"
      style={{
        margin: 0,
        color: APK_ADMIN_UI.black,
        fontSize: APK_ADMIN_UI.bodyMediumFontSize,
        lineHeight: APK_ADMIN_UI.bodyMediumLineHeight,
        fontWeight: APK_ADMIN_UI.bodyMediumFontWeight
      }}
    >
      {children}
    </p>
  )
}

const APK_EDIT_ITEM_UI = {
  topContentPadding: APK_PAGE_SHELL_UI.topCardOffset,
  screenPadding: APK_PAGE_SHELL_UI.screenPadding,
  sectionTop: 18,
  titleToHint: 6,
  hintToContent: 10,
  fieldGap: 10,
  sectionBottom: 8,
  spacer8: 8,
  chipGap: 10,
  mediaGridTop: 10,
  labelGap: 6,
  smallGap: 4,
  midGap: 12,
  saveHintTop: 16,
  saveButtonTop: 10,
  titleFontSize: 24,
  titleLineHeight: 1.25,
  titleFontWeight: 600,
  sectionTitleFontSize: 16,
  sectionTitleLineHeight: 1.35,
  sectionTitleFontWeight: 600,
  labelFontSize: 12,
  labelLineHeight: 1.35,
  labelFontWeight: 500,
  bodySmallFontSize: 12,
  bodySmallLineHeight: 1.35,
  bodySmallFontWeight: 400,
  bodyMediumFontSize: 14,
  bodyMediumLineHeight: 1.45,
  bodyMediumFontWeight: 400,
  black: '#000000',
  sectionLabelColor: 'rgba(0, 0, 0, 0.90)',
  body70: 'rgba(0, 0, 0, 0.70)',
  body55: 'rgba(0, 0, 0, 0.55)',
  error80: 'rgba(185, 28, 28, 0.80)'
} as const

function EditItemSpacer({ height }: { height: number }) {
  return <div style={{ height, flexShrink: 0 }} />
}

function EditItemHeaderText({
  title,
  subtitle
}: {
  title: string
  subtitle: string
}) {
  return (
    <section
      className="ndjc-apk-edit-header"
      style={{
        width: '100%',
        display: 'grid',
        gap: APK_EDIT_ITEM_UI.smallGap
      }}
    >
      <h1
        style={{
          margin: 0,
          color: APK_EDIT_ITEM_UI.black,
          fontSize: APK_EDIT_ITEM_UI.titleFontSize,
          lineHeight: APK_EDIT_ITEM_UI.titleLineHeight,
          fontWeight: APK_EDIT_ITEM_UI.titleFontWeight
        }}
      >
        {title}
      </h1>

      <p
        style={{
          margin: 0,
          color: APK_EDIT_ITEM_UI.body70,
          fontSize: APK_EDIT_ITEM_UI.bodyMediumFontSize,
          lineHeight: APK_EDIT_ITEM_UI.bodyMediumLineHeight,
          fontWeight: APK_EDIT_ITEM_UI.bodyMediumFontWeight
        }}
      >
        {subtitle}
      </p>
    </section>
  )
}

function EditItemSectionTitle({
  title,
  subtitle
}: {
  title: string
  subtitle?: string | null
}) {
  return (
    <section
      className="ndjc-apk-edit-section-title"
      style={{
        width: '100%',
        display: 'grid',
        gap: subtitle ? APK_EDIT_ITEM_UI.titleToHint : 0
      }}
    >
      <h2
        style={{
          margin: 0,
          color: APK_EDIT_ITEM_UI.sectionLabelColor,
          fontSize: APK_EDIT_ITEM_UI.sectionTitleFontSize,
          lineHeight: APK_EDIT_ITEM_UI.sectionTitleLineHeight,
          fontWeight: APK_EDIT_ITEM_UI.sectionTitleFontWeight
        }}
      >
        {title}
      </h2>

      {subtitle ? (
        <p
          style={{
            margin: 0,
            color: APK_EDIT_ITEM_UI.body55,
            fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
            lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
            fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </section>
  )
}

function EditItemBodySmallText({
  children,
  color = APK_EDIT_ITEM_UI.body55
}: {
  children: React.ReactNode
  color?: string
}) {
  return (
    <p
      style={{
        margin: 0,
        color,
        fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
        lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
        fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
      }}
    >
      {children}
    </p>
  )
}

function EditItemErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        color: APK_EDIT_ITEM_UI.error80,
        fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
        lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
        fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight
      }}
    >
      {children}
    </p>
  )
}

const EditItemFieldBlock = React.forwardRef<HTMLElement, {
  children: React.ReactNode
}>(function EditItemFieldBlock(
  {
    children
  },
  ref
) {
  return (
    <section
      ref={ref}
      className="ndjc-apk-edit-field-block"
      style={{
        width: '100%',
        display: 'grid',
        gap: APK_EDIT_ITEM_UI.labelGap
      }}
    >
      {children}
    </section>
  )
})

function StoreSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="ndjc-store-section-title" style={apkStoreSectionTitleStyle}>
      {children}
    </h3>
  )
}

function StoreInfoLine({
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

export function PlaceholderScreen({
  title,
  actions
}: {
  title: string
  actions?: BackHomeActions
}) {
  return (
    <ScreenScaffold
      title={title}
      subtitle="This screen will be connected in the next UI pass."
      actions={actions}
    >
      <EmptyState
        title={title}
        message="The renderer route is ready. The APK-matched layout will replace this placeholder."
      />
    </ScreenScaffold>
  )
}

function DishCard({
  dish,
  onOpen
}: {
  dish: DemoDish
  onOpen: (id: string) => void
}) {
  const originalPrice = Number(dish.originalPrice)
  const discountPrice = dish.discountPrice
  const safeOriginalPrice = Number.isFinite(originalPrice) && originalPrice > 0 ? originalPrice : 0
  const hasDiscount =
    typeof discountPrice === 'number' &&
    discountPrice > 0 &&
    discountPrice < safeOriginalPrice
  const primaryText = hasDiscount ? priceText(discountPrice) : priceText(safeOriginalPrice)
  const secondaryText = hasDiscount ? priceText(safeOriginalPrice) : null

  return (
    <NdjcHomeStyleMediaCard
      title={titleForDish(dish)}
      imageUrl={dishImage(dish)}
      primaryText={primaryText}
      secondaryText={secondaryText}
      badgeText={dish.isRecommended ? APK_SHOWCASE_ITEM_UI.homeBadgeText : null}
      onClick={() => onOpen(dish.id)}
      trailingOverlay={
        dish.isFavorite ? (
          <span
            className="ndjc-apk-dish-fav is-active"
            style={apkHomeFavoriteIconStyle}
            aria-hidden="true"
          >
            ♥
          </span>
        ) : null}
    />
  )
}
export function ShowcaseHome({
  state,
  actions
}: {
  state: ShowcaseHomeUiState
  actions: ShowcaseHomeActions
}) {
  const rows: ShowcaseHomeDish[][] = []
  const [snackbarVisible, setSnackbarVisible] = React.useState(false)
  const [homeDraftRecommendedOnly, setHomeDraftRecommendedOnly] = React.useState(state.filterRecommendedOnly)
  const [homeDraftOnSaleOnly, setHomeDraftOnSaleOnly] = React.useState(state.filterOnSaleOnly)
  const [homeDraftPriceMin, setHomeDraftPriceMin] = React.useState(state.priceMinDraft)
  const [homeDraftPriceMax, setHomeDraftPriceMax] = React.useState(state.priceMaxDraft)

  React.useEffect(() => {
    setSnackbarVisible(Boolean(state.statusMessage?.trim()))
  }, [state.statusMessage])

  React.useEffect(() => {
    if (!state.showFilterMenu) {
      setHomeDraftRecommendedOnly(state.filterRecommendedOnly)
      setHomeDraftOnSaleOnly(state.filterOnSaleOnly)
      setHomeDraftPriceMin(state.priceMinDraft)
      setHomeDraftPriceMax(state.priceMaxDraft)
    }
  }, [state.showFilterMenu, state.filterRecommendedOnly, state.filterOnSaleOnly, state.priceMinDraft, state.priceMaxDraft])

  for (let index = 0; index < state.dishes.length; index += 2) {
    rows.push(state.dishes.slice(index, index + 2))
  }

  return (
    <NdjcUnifiedBackground
      snackbar={
        <NdjcSnackbarHost
          message={snackbarVisible ? state.statusMessage : null}
          onDismiss={() => setSnackbarVisible(false)}
        />
      }
    >
      <NdjcCustomerPullRefreshContainer
        refreshing={state.isLoading}
        onRefresh={actions.onRefresh}
      >
        <BgCircle
          size={APK_HOME_PAGE_UI.heroCircleSize}
          offsetX={APK_HOME_PAGE_UI.heroCircleLeftOffsetX}
          offsetY={APK_HOME_PAGE_UI.heroCircleLeftOffsetY}
          colors={APK_HOME_PAGE_UI.heroCircleLeftColors}
        />

        <BgCircle
          size={APK_HOME_PAGE_UI.heroCircleSize}
          offsetX={APK_HOME_PAGE_UI.heroCircleRightOffsetX}
          offsetY={APK_HOME_PAGE_UI.heroCircleRightOffsetY}
          colors={APK_HOME_PAGE_UI.heroCircleRightColors}
        />

        <section
          className="ndjc-apk-home ndjc-apk-home-web-scaffold"
          style={apkHomeRootStyle}
          data-web-equivalent="compose-scaffold"
        >
          <section className="ndjc-apk-home-controls" style={apkHomeControlsStyle}>
            <TopSearchBar
              value={state.searchQuery}
              placeholder="Search…"
              onChange={actions.onSearchQueryChange}
              onProfileClick={actions.onProfileClick}
            />

            <div style={apkHomeControlsGapStyle} aria-hidden="true" />

            {state.allTags.length ? (
              <section style={apkHomeTagsWrapStyle}>
                <TagsFilterRow
                  allTags={state.allTags}
                  selectedTags={state.selectedTags}
                  onToggleTag={actions.onToggleTag}
                  onClearTags={actions.onClearTags}
                />
              </section>
            ) : null}

            <section style={apkHomeSortWrapStyle}>
              <HomeSortNavEqualRow
                sortMode={state.sortMode}
                onSortModeChange={actions.onSortModeChange}
                filterRecommendedOnly={state.filterRecommendedOnly}
                filterOnSaleOnly={state.filterOnSaleOnly}
                appliedMinPrice={state.appliedMinPrice}
                appliedMaxPrice={state.appliedMaxPrice}
                showFilterMenu={state.showFilterMenu}
                onFilterClick={() => {
                  setHomeDraftRecommendedOnly(state.filterRecommendedOnly)
                  setHomeDraftOnSaleOnly(state.filterOnSaleOnly)
                  setHomeDraftPriceMin(state.priceMinDraft)
                  setHomeDraftPriceMax(state.priceMaxDraft)
                  actions.onShowFilterMenuChange(true)
                }}
              />
            </section>

            <section style={apkHomeCategoryWrapStyle}>
              <CategoryChipsRow
                selectedCategory={state.selectedCategory}
                manualCategories={state.manualCategories}
                onCategorySelected={actions.onCategorySelected}
                showAllChip
                useOuterHorizontalPadding
              />
            </section>
          </section>

          <NdjcFilterBottomSheet
            open={state.showFilterMenu}
            title="Filter"
            clearText="Clear"
            applyText="Apply"
            priceMinDraft={homeDraftPriceMin}
            onPriceMinDraftChange={setHomeDraftPriceMin}
            priceMaxDraft={homeDraftPriceMax}
            onPriceMaxDraftChange={setHomeDraftPriceMax}
            showPriceFields
            onClose={() => {
              setHomeDraftRecommendedOnly(state.filterRecommendedOnly)
              setHomeDraftOnSaleOnly(state.filterOnSaleOnly)
              setHomeDraftPriceMin(state.priceMinDraft)
              setHomeDraftPriceMax(state.priceMaxDraft)
              actions.onShowFilterMenuChange(false)
            }}
            onClear={() => {
              setHomeDraftRecommendedOnly(false)
              setHomeDraftOnSaleOnly(false)
              setHomeDraftPriceMin('')
              setHomeDraftPriceMax('')
            }}
            onApply={() => {
              actions.onApplyHomeFilters({
                recommendedOnly: homeDraftRecommendedOnly,
                onSaleOnly: homeDraftOnSaleOnly,
                minPriceDraft: homeDraftPriceMin,
                maxPriceDraft: homeDraftPriceMax
              })
            }}
          >
            <NdjcToggleRow
              label="Pick"
              checked={homeDraftRecommendedOnly}
              onCheckedChange={setHomeDraftRecommendedOnly}
            />

            <NdjcToggleRow
              label="On sale"
              checked={homeDraftOnSaleOnly}
              onCheckedChange={setHomeDraftOnSaleOnly}
            />
          </NdjcFilterBottomSheet>

          <section
            className="ndjc-apk-home-grid"
            style={{
              ...apkHomeListStyle,
              alignContent: rows.length ? 'start' : 'stretch',
              gridTemplateRows: rows.length ? undefined : 'minmax(0, 1fr)'
            }}
            onScroll={event => ndjcHandleLoadMoreScroll(
              event,
              state.pagination,
              actions.onLoadMore
            )}
          >
            {rows.length ? (
              <>
                {rows.map((row, rowIndex) => (
                  <div
                    key={`home-row-${rowIndex}`}
                    className="ndjc-apk-home-grid-row"
                    style={apkHomeGridRowStyle}
                  >
                    <DishListCard
                      dish={row[0]}
                      onOpen={actions.onDishSelected}
                      priorityImage={rowIndex === 0}
                    />

                    {row[1] ? (
                      <DishListCard
                        dish={row[1]}
                        onOpen={actions.onDishSelected}
                        priorityImage={rowIndex === 0}
                      />
                    ) : (
                      <div className="ndjc-apk-dish-card-placeholder" style={apkHomeGridPlaceholderStyle} />
                    )}
                  </div>
                ))}

                <NdjcPaginationFooter
                  pagination={state.pagination}
                  idleText="Load more"
                  loadingText="Loading more..."
                  endText="No more items"
                  onLoadMore={actions.onLoadMore}
                />
              </>
            ) : (
              <NdjcInlineEmptyState
                title="No items yet"
                message="Items will appear here after the business adds them."
                verticalPadding={0}
                fillParentMaxSize
              />
            )}
          </section>
        </section>

      </NdjcCustomerPullRefreshContainer>
    </NdjcUnifiedBackground>
  )
}

export function DetailScreen({
  state,
  actions
}: {
  state: ShowcaseDetailUiState
  actions: ShowcaseDetailActions
}) {
  const cleanImages = state.imageUrls.map(url => url.trim()).filter(Boolean)
  const safeStartIndex = cleanImages.length
    ? Math.min(Math.max(state.safeImageIndex, 0), cleanImages.length - 1)
    : 0
  const imageStripRef = React.useRef<HTMLDivElement | null>(null)
  const detailImageDragRef = React.useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
    suppressClick: false
  })
  const [currentIndex, setCurrentIndex] = React.useState(safeStartIndex)
  const [descExpanded, setDescExpanded] = React.useState(false)
  const [imagePreview, setImagePreview] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)

  React.useEffect(() => {
    if (!cleanImages.length) {
      setCurrentIndex(0)
      return
    }

    const nextIndex = safeStartIndex
    setCurrentIndex(nextIndex)

    window.requestAnimationFrame(() => {
      const node = imageStripRef.current
      if (!node) return

      const pageWidth = Math.max(1, node.clientWidth)
      node.scrollLeft = pageWidth * nextIndex
    })
  }, [state.dishId, safeStartIndex, cleanImages.length])

  React.useEffect(() => {
    if (!cleanImages.length) return
    actions.onImageIndexChanged(currentIndex)
  }, [currentIndex, cleanImages.length, actions])

  React.useEffect(() => {
    setDescExpanded(false)
  }, [state.dishId])

  const hasDiscount = Boolean(state.discountPrice?.trim())
  const cleanDescription = state.description.trim()

  function snapDetailImageRowToNearestPage(node: HTMLDivElement): void {
    if (!cleanImages.length) return

    const pageWidth = Math.max(1, node.clientWidth)
    const nextIndex = Math.min(
      cleanImages.length - 1,
      Math.max(0, Math.round(node.scrollLeft / pageWidth))
    )

    setCurrentIndex(nextIndex)
    node.scrollTo({
      left: pageWidth * nextIndex,
      behavior: 'smooth'
    })
  }

  function handleDetailImagePointerDown(event: React.PointerEvent<HTMLDivElement>): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const node = imageStripRef.current
    if (!node) return

    detailImageDragRef.current = {
      active: true,
      startX: event.clientX,
      startScrollLeft: node.scrollLeft,
      moved: false,
      suppressClick: false
    }
  }

  function handleDetailImagePointerMove(event: React.PointerEvent<HTMLDivElement>): void {
    const node = imageStripRef.current
    const dragState = detailImageDragRef.current

    if (!node || !dragState.active) return

    const deltaX = event.clientX - dragState.startX

    if (Math.abs(deltaX) > 5) {
      dragState.moved = true
      dragState.suppressClick = true
      node.scrollLeft = dragState.startScrollLeft - deltaX
      event.preventDefault()
    }
  }

  function handleDetailImagePointerUp(): void {
    const node = imageStripRef.current
    const dragState = detailImageDragRef.current

    dragState.active = false

    if (node) {
      snapDetailImageRowToNearestPage(node)
    }

    if (dragState.moved) {
      window.setTimeout(() => {
        detailImageDragRef.current = {
          active: false,
          startX: 0,
          startScrollLeft: 0,
          moved: false,
          suppressClick: false
        }
      }, 120)

      return
    }

    detailImageDragRef.current = {
      active: false,
      startX: 0,
      startScrollLeft: 0,
      moved: false,
      suppressClick: false
    }
  }

  function handleDetailImageClickCapture(event: React.MouseEvent<HTMLDivElement>): void {
    if (!detailImageDragRef.current.suppressClick) return

    event.preventDefault()
    event.stopPropagation()
  }

  return (
<NdjcUnifiedBackground
  topNav={{
    onBack: actions.onBack,
    onHome: actions.onBackToHome,
    iconOnly: true,
    iconTint: '#ffffff'
  }}
>
      <section className="ndjc-apk-detail" style={apkDetailRootStyle}>
        <NdjcSystemBarsTransparent darkIcons />

        <BgCircle
          size={APK_HOME_PAGE_UI.heroCircleSize}
          offsetX={APK_HOME_PAGE_UI.heroCircleLeftOffsetX}
          offsetY={APK_HOME_PAGE_UI.heroCircleLeftOffsetY}
          colors={APK_HOME_PAGE_UI.heroCircleLeftColors}
        />

        <BgCircle
          size={APK_HOME_PAGE_UI.heroCircleSize}
          offsetX={APK_HOME_PAGE_UI.heroCircleRightOffsetX}
          offsetY={APK_HOME_PAGE_UI.heroCircleRightOffsetY}
          colors={APK_HOME_PAGE_UI.heroCircleRightColors}
        />

        <section className="ndjc-apk-detail-scroll" style={apkDetailScrollStyle}>
          <section className="ndjc-apk-detail-hero" style={apkDetailHeroStyle}>
            {cleanImages.length ? (
              <section
                ref={imageStripRef}
                className="ndjc-apk-detail-image-row"
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%',
                  display: 'flex',
                  flexWrap: 'nowrap',
                  alignItems: 'stretch',
                  gap: 0,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  scrollSnapType: 'x mandatory',
                  scrollBehavior: 'auto',
                  scrollbarWidth: 'none',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehaviorX: 'contain',
                  touchAction: 'pan-x',
                  boxSizing: 'border-box',
                  cursor: cleanImages.length > 1 ? 'grab' : 'default',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}
                onPointerDown={handleDetailImagePointerDown}
                onPointerMove={handleDetailImagePointerMove}
                onPointerUp={handleDetailImagePointerUp}
                onPointerCancel={handleDetailImagePointerUp}
                onPointerLeave={handleDetailImagePointerUp}
                onClickCapture={handleDetailImageClickCapture}
                onScroll={event => {
                  const node = event.currentTarget
                  const width = Math.max(1, node.clientWidth)
                  const nextIndex = Math.min(
                    cleanImages.length - 1,
                    Math.max(0, Math.round(node.scrollLeft / width))
                  )

                  if (nextIndex !== currentIndex) {
                    setCurrentIndex(nextIndex)
                  }
                }}
              >
                {cleanImages.map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    className="ndjc-apk-detail-image-button"
                    draggable={false}
                    style={{
                      ...apkDetailHeroImageButtonStyle,
                      width: '100%',
                      height: '100%',
                      minWidth: '100%',
                      maxWidth: '100%',
                      flex: '0 0 100%',
                      scrollSnapAlign: 'start',
                      scrollSnapStop: 'always',
                      boxSizing: 'border-box',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                    onDragStart={event => {
                      event.preventDefault()
                    }}
                    onClick={() => {
                      setImagePreview({
                        images: cleanImages,
                        startIndex: currentIndex
                      })
                    }}
                  >
                    <NdjcShimmerImage
                      src={url}
                      alt={state.title || 'Item image'}
                      placeholderCornerRadius={0}
                      contentScale="cover"
                    />
                  </button>
                ))}
              </section>
            ) : (
              <span
                style={{
                  color: '#ffffff',
                  fontSize: 14,
                  lineHeight: 1.25,
                  fontWeight: 600
                }}
              >
                No image
              </span>
            )}

            {cleanImages.length > 1 ? (
              <span className="ndjc-apk-detail-counter" style={apkDetailHeroCounterStyle}>
                {currentIndex + 1}/{cleanImages.length}
              </span>
            ) : null}
          </section>

          <section className="ndjc-apk-detail-header-row" style={apkDetailHeaderRowStyle}>
            {state.isRecommended ? (
              <span style={apkDetailPickBadgeStyle}>
                <ApkPickBadgeIcon />
                <span style={apkDetailPickBadgeTextStyle}>
                  Pick
                </span>
              </span>
            ) : (
              <span style={{ height: 24 }} aria-hidden="true" />
            )}

            <button
              type="button"
              className={cx('ndjc-apk-detail-favorite', state.isFavorite && 'is-active')}
              style={apkDetailFavoriteButtonStyle}
              onClick={actions.onToggleFavorite}
              aria-label={state.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={state.isFavorite}
            >
              <DetailFavoriteIcon selected={state.isFavorite} />
            </button>
          </section>

          <div style={{ height: 6 }} aria-hidden="true" />

          <section className="ndjc-apk-detail-content" style={apkDetailContentStyle}>
            <section style={apkDetailTitleBlockStyle}>
              <h1 style={apkDetailTitleStyle}>
                {state.title}
              </h1>

              <div className="ndjc-apk-detail-price-row" style={apkDetailPriceRowStyle}>
                {hasDiscount ? (
                  <>
                    <strong style={apkDetailPrimaryPriceStyle}>
                      {state.discountPrice}
                    </strong>

                    <span style={apkDetailOriginalPriceStyle}>
                      {state.price}
                    </span>
                  </>
                ) : (
                  <strong style={apkDetailNormalPriceStyle}>
                    {state.price}
                  </strong>
                )}
              </div>

              {state.canBookAppointment ? (
                <NdjcPrimaryActionButton onClick={actions.onBookAppointment}>
                  Book appointment
                </NdjcPrimaryActionButton>
              ) : null}
            </section>

            <div style={apkDetailDividerStyle} aria-hidden="true" />

            {cleanDescription ? (
              <section className="ndjc-apk-detail-section" style={apkDetailSectionStyle}>
                <h2 style={apkDetailSectionLabelStyle}>Description</h2>

                <p
                  style={{
                    ...apkDetailDescriptionStyle,
                    display: descExpanded ? 'block' : '-webkit-box',
                    WebkitLineClamp: descExpanded ? undefined : APK_DETAIL_PAGE_UI.descriptionCollapsedLines,
                    WebkitBoxOrient: descExpanded ? undefined : 'vertical',
                    overflow: descExpanded ? 'visible' : 'hidden'
                  }}
                >
                  {cleanDescription}
                </p>

                <button
                  type="button"
                  style={apkDetailShowMoreButtonStyle}
                  onClick={() => setDescExpanded(value => !value)}
                >
                  {descExpanded ? 'Show less' : 'Show more'}
                </button>
              </section>
            ) : null}

            {state.category?.trim() || state.isUnavailable ? (
              <section className="ndjc-apk-detail-section" style={apkDetailSectionStyle}>
                {state.category?.trim() ? (
                  <>
                    <h2 style={apkDetailSectionLabelStyle}>Category</h2>

                    <div style={apkDetailTagsRowStyle}>
                      <NdjcPillButton selected>
                        {state.category}
                      </NdjcPillButton>
                    </div>
                  </>
                ) : null}

                {state.isUnavailable ? (
                  <span
                    style={{
                      color: APK_DETAIL_PAGE_UI.unavailableColor,
                      fontSize: APK_DETAIL_PAGE_UI.unavailableSize,
                      lineHeight: APK_DETAIL_PAGE_UI.unavailableLineHeight,
                      fontWeight: APK_DETAIL_PAGE_UI.unavailableWeight
                    }}
                  >
                    Unavailable
                  </span>
                ) : null}
              </section>
            ) : null}

          </section>
        </section>

        {imagePreview ? (
          <NdjcFullscreenImageViewerScreen
            images={imagePreview.images}
            startIndex={imagePreview.startIndex}
            onDismiss={() => setImagePreview(null)}
            onSave={actions.onSavePreviewImage}
          />
        ) : null}
      </section>
    </NdjcUnifiedBackground>
  )
}

export function LoginScreen({
  state,
  actions
}: {
  state: ShowcaseLoginUiState
  actions: ShowcaseLoginActions
}) {
  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-login-screen"
      topNav={{
        onBack: actions.onBackToHome,
        onHome: actions.onBackToHome
      }}
    >
      <BgCircle
        size={APK_HOME_PAGE_UI.heroCircleSize}
        offsetX={APK_HOME_PAGE_UI.heroCircleLeftOffsetX}
        offsetY={APK_HOME_PAGE_UI.heroCircleLeftOffsetY}
        colors={APK_HOME_PAGE_UI.heroCircleLeftColors}
      />

      <BgCircle
        size={APK_HOME_PAGE_UI.heroCircleSize}
        offsetX={APK_HOME_PAGE_UI.heroCircleRightOffsetX}
        offsetY={APK_HOME_PAGE_UI.heroCircleRightOffsetY}
        colors={APK_HOME_PAGE_UI.heroCircleRightColors}
      />

      <section
        className="ndjc-apk-login-content"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          minHeight: 0,
          padding: `${APK_PAGE_SHELL_UI.topCardOffset}px ${APK_PAGE_SHELL_UI.screenPadding}px ${APK_PAGE_SHELL_UI.screenPadding}px`,
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <NdjcWhiteCard
          className="ndjc-apk-login-card"
          style={{
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <section
            className="ndjc-apk-login-column"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch'
            }}
          >
            <h1
              style={{
                margin: 0,
                color: '#000000',
                fontSize: 24,
                lineHeight: 1.25,
                fontWeight: 600
              }}
            >
              Sign in
            </h1>

            <div style={{ height: 6, flexShrink: 0 }} />

            <p
              style={{
                margin: 0,
                color: 'rgba(0, 0, 0, 0.70)',
                fontSize: 14,
                lineHeight: 1.35,
                fontWeight: 400
              }}
            >
              Use your account to manage content and settings.
            </p>

            <div style={{ height: 16, flexShrink: 0 }} />

            <NdjcTextField
              value={state.usernameDraft}
              onChange={actions.onUsernameDraftChange}
              label="Email"
              singleLine
              autoComplete="username"
            />

            <div style={{ height: 12, flexShrink: 0 }} />

            <NdjcTextField
              value={state.passwordDraft}
              onChange={actions.onPasswordDraftChange}
              label="Password"
              type="password"
              singleLine
              autoComplete="new-password"
            />

            {state.loginError ? (
              <>
                <div style={{ height: 10, flexShrink: 0 }} />

                <p
                  className="ndjc-error-text"
                  style={{
                    margin: 0,
                    color: APK_CORE_UI.danger,
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 400
                  }}
                >
                  {state.loginError}
                </p>
              </>
            ) : null}

            <div style={{ height: 16, flexShrink: 0 }} />

            <NdjcToggleRow
              label="Remember this device"
              checked={state.rememberMe}
              onCheckedChange={actions.onRememberMeChange}
              labelColor={APK_CORE_UI.black}
            />

            <div style={{ height: 16, flexShrink: 0 }} />

            <NdjcPrimaryActionButton
              disabled={!state.canLogin}
              isLoading={state.isLoading}
              onClick={() => actions.onLogin(state.usernameDraft, state.passwordDraft)}
            >
              Sign in
            </NdjcPrimaryActionButton>

            <div style={{ height: 12, flexShrink: 0 }} />

            <p
              className="ndjc-apk-login-security-note"
              style={{
                margin: 0,
                color: 'rgba(0, 0, 0, 0.55)',
                fontSize: 12,
                lineHeight: 1.35,
                fontWeight: 400
              }}
            >
              Access is limited to administrators.
            </p>
          </section>
        </NdjcWhiteCard>
      </section>
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseStoreProfileView({
  state,
  actions
}: {
  state: ShowcaseStoreProfileUiState
  actions: ShowcaseStoreProfileActions
}) {
  const selectedStoreCoverUrl = selectStoreCoverUrl(state) || state.coverUrl
  const selectedStoreLogoUrl = selectStoreLogoUrl(state) || state.logoUrl

  const covers = Array.from(
    new Set(
      selectedStoreCoverUrl
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean)
    )
  ).slice(0, 9)

  const [imagePreview, setImagePreview] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)
  const [isDraggingImages, setIsDraggingImages] = React.useState(false)
  const [pressedCoverIndex, setPressedCoverIndex] = React.useState<number | null>(null)
  const coverRowRef = React.useRef<HTMLDivElement | null>(null)
  const coverDragStateRef = React.useRef<{
    x: number
    y: number
    scrollLeft: number
    dragging: boolean
    pointerId: number | null
    targetIndex: number | null
  } | null>(null)
  const storeProfileBackRef = React.useRef(actions.onBack)

  React.useEffect(() => {
    storeProfileBackRef.current = actions.onBack
  }, [actions.onBack])



  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStoreProfilePopState = () => {
      storeProfileBackRef.current()
    }

    window.addEventListener('popstate', handleStoreProfilePopState)

    return () => {
      window.removeEventListener('popstate', handleStoreProfilePopState)
    }
  }, [])

  const stopImageDragging = () => {
    const row = coverRowRef.current
    const pointerId = coverDragStateRef.current?.pointerId

    if (row && pointerId != null) {
      try {
        row.releasePointerCapture?.(pointerId)
      } catch {
      }
    }

    coverDragStateRef.current = null
    setIsDraggingImages(false)
    setPressedCoverIndex(null)
  }

  const handleCoverPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const active = document.activeElement as HTMLElement | null
    active?.blur?.()

    const row = event.currentTarget
    const target = event.target as HTMLElement | null
    const coverButton = target?.closest?.('[data-cover-index]') as HTMLElement | null
    const coverIndexRaw = coverButton?.getAttribute('data-cover-index') ?? ''
    const parsedCoverIndex = coverIndexRaw.trim() ? Number(coverIndexRaw) : Number.NaN
    const targetIndex = Number.isFinite(parsedCoverIndex) ? parsedCoverIndex : null

    coverDragStateRef.current = {
      x: event.clientX,
      y: event.clientY,
      scrollLeft: row.scrollLeft,
      dragging: false,
      pointerId: event.pointerId,
      targetIndex
    }

    try {
      row.setPointerCapture?.(event.pointerId)
    } catch {
    }

    setIsDraggingImages(false)
    setPressedCoverIndex(targetIndex)
  }

  const handleCoverPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const stateRef = coverDragStateRef.current
    const row = coverRowRef.current

    if (!stateRef || !row) return

    const rawDx = event.clientX - stateRef.x
    const dx = Math.abs(rawDx)
    const dy = Math.abs(event.clientY - stateRef.y)

    if (dx > 6 && dx >= dy) {
      event.preventDefault()
      stateRef.dragging = true
      setIsDraggingImages(true)
      setPressedCoverIndex(null)
      row.scrollLeft = stateRef.scrollLeft - rawDx
    }
  }

  const handleCoverPointerEnd = () => {
    const stateRef = coverDragStateRef.current
    const wasDragging = Boolean(stateRef?.dragging)
    const targetIndex = stateRef?.targetIndex ?? null

    stopImageDragging()

    if (!wasDragging && targetIndex != null) {
      openCoverPreview(covers, targetIndex)
    }
  }

  function openCoverPreview(images: string[], startIndex: number): void {
    const cleanImages = images
      .map(url => url.trim())
      .filter(Boolean)

    if (!cleanImages.length) return

    setImagePreview({
      images: cleanImages,
      startIndex: Math.max(0, Math.min(startIndex, cleanImages.length - 1))
    })
  }

  const sectionDivider = (
    <>
      <div style={{ height: 14 }} aria-hidden="true" />
      <div
        style={{
          width: '100%',
          height: 1,
          background: 'rgba(17, 24, 39, 0.06)'
        }}
        aria-hidden="true"
      />
      <div style={{ height: 14 }} aria-hidden="true" />
    </>
  )

  const snackbarMessage =
    state.successMessage ||
    state.errorMessage ||
    state.statusMessage ||
    ''

  const [snackbarVisible, setSnackbarVisible] = React.useState(false)

  React.useEffect(() => {
    setSnackbarVisible(Boolean(snackbarMessage.trim()))
  }, [snackbarMessage])

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome,
        iconOnly: true,
        iconTint: APK_SHELL_UI.brand
      }}
      bottomBar={
<ShowcaseBottomBar
  actions={actions}
  activeTab="Store"
  showAppointments={state.bottomBar.showAppointments}
  showChatDot={state.bottomBar.showChatDot}
  showBookingsDot={state.bottomBar.showBookingsDot}
  showAnnouncementsDot={state.bottomBar.showAnnouncementsDot}
/>
      }
    >
      <NdjcCustomerPullRefreshContainer
        refreshing={state.isRefreshing}
        onRefresh={actions.onRefresh}
      >
        <section
          className="ndjc-apk-store-profile"
          style={{
            position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          background: APK_SHELL_UI.pageBg,
          overflow: 'hidden'
        }}
      >
        <BgCircle
          size={APK_HOME_PAGE_UI.heroCircleSize}
          offsetX={APK_HOME_PAGE_UI.heroCircleLeftOffsetX}
          offsetY={APK_HOME_PAGE_UI.heroCircleLeftOffsetY}
          colors={APK_HOME_PAGE_UI.heroCircleLeftColors}
        />

        <BgCircle
          size={APK_HOME_PAGE_UI.heroCircleSize}
          offsetX={APK_HOME_PAGE_UI.heroCircleRightOffsetX}
          offsetY={APK_HOME_PAGE_UI.heroCircleRightOffsetY}
          colors={APK_HOME_PAGE_UI.heroCircleRightColors}
        />

        <section
          className="ndjc-apk-store-profile-scroll"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            height: '100%',
            minHeight: 0,
            padding: `36px ${APK_PAGE_SHELL_UI.screenPadding}px ${APK_PAGE_SHELL_UI.noBottomBarReserve}px`,
            overflowY: isDraggingImages ? 'hidden' : 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorY: 'none',
            overscrollBehaviorX: 'none',
            touchAction: 'auto',
            boxSizing: 'border-box'
          }}
        >
          <section
            className="ndjc-apk-store-cover-layer"
            style={{
              position: 'relative',
              width: '100%',
              minHeight: APK_STORE_PROFILE_UI.coverHeight,
              boxSizing: 'border-box'
            }}
          >
            {covers.length ? (
              <div
                ref={coverRowRef}
                className="ndjc-apk-store-cover-row"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  zIndex: 1,
                  width: '100%',
                  height: APK_STORE_PROFILE_UI.coverHeight,
                  borderRadius: APK_SHELL_UI.whiteCardRadius,
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: APK_STORE_PROFILE_UI.coverGap,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  scrollbarWidth: 'none',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-x',
                  userSelect: 'none',
                  cursor: covers.length > 1 ? 'grab' : 'pointer',
                  boxSizing: 'border-box',
                  pointerEvents: 'auto'
                }}
                onPointerDown={handleCoverPointerDown}
                onPointerMove={handleCoverPointerMove}
                onPointerUp={handleCoverPointerEnd}
                onPointerCancel={handleCoverPointerEnd}
                onPointerLeave={stopImageDragging}
              >
                {covers.map((url, index) => (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    data-cover-index={index}
                    className="ndjc-apk-store-cover-card"
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
                      transform: pressedCoverIndex === index ? `scale(${APK_STORE_PROFILE_UI.coverPressedScale})` : 'scale(1)',
                      transition: 'transform 120ms ease',
                      cursor: isDraggingImages ? 'grabbing' : 'pointer',
                      touchAction: 'pan-x',
                      userSelect: 'none'
                    }}
                    draggable={false}
                    onDragStart={event => {
                      event.preventDefault()
                    }}
                    onClick={event => {
                      event.preventDefault()
                      event.stopPropagation()
                    }}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openCoverPreview(covers, index)
                      }
                    }}
                  >
                    <span
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'block'
                      }}
                    >
                      <NdjcShimmerImage
                        src={url}
                        alt={`Cover ${index + 1}`}
                        placeholderCornerRadius={APK_STORE_PROFILE_UI.coverCardRadius}
                        contentScale="cover"
                      />

                      <span
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.30))',
                          pointerEvents: 'none'
                        }}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div
                className="ndjc-apk-store-cover-placeholder-row"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  zIndex: 1,
                  width: '100%',
                  height: APK_STORE_PROFILE_UI.coverHeight,
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) 84px',
                  gap: APK_STORE_PROFILE_UI.coverGap,
                  boxSizing: 'border-box'
                }}
              >
                <UniversalStoreCoverPlaceholderCard />
                <UniversalStoreCoverPlaceholderCard />
              </div>
            )}

            <section
              className="ndjc-apk-store-white-card-wrap"
              style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                paddingTop: APK_STORE_PROFILE_UI.topContentPadding,
                boxSizing: 'border-box',
                pointerEvents: 'none'
              }}
            >
              <NdjcWhiteCard
                className="ndjc-apk-store-white-card"
                style={{
                  pointerEvents: 'auto'
                }}
              >
                <section
                  style={{
                    width: '100%',
                    display: 'grid',
                    gap: APK_PAGE_SHELL_UI.normalGap
                  }}
                >
                  <UniversalStoreBrandHeader
                    coverUrl=""
                    logoUrl={selectedStoreLogoUrl || ''}
                    title={state.title || ''}
                    subtitle={state.subtitle || ''}
                    businessStatus={state.businessStatus || ''}
                    onPreview={openCoverPreview}
                  />

                  {sectionDivider}

                  <UniversalStoreAboutSection description={state.description} />

                  {sectionDivider}

                  <UniversalStoreServicesSection services={state.services} />

                  {sectionDivider}

                  <UniversalStoreLocationSection
                    address={state.address}
                    hours={state.hours}
                    mapUrl={state.mapUrl}
                    onOpenMap={actions.onOpenMap}
                  />

                  {sectionDivider}

                  <UniversalStoreExtraContactsSection
                    extraContacts={state.extraContacts}
                    onCopyAccountValue={actions.onCopy}
                  />

                  {sectionDivider}

                  <UniversalStoreAppAboutSection
                    appName={state.appName}
                    versionName={state.versionName}
                    merchantEmail={state.merchantEmail}
                    privacyUrl={state.privacyUrl}
                    onOpenPrivacy={actions.onOpenMap}
                  />
                </section>
              </NdjcWhiteCard>
            </section>
          </section>

          <div style={{ height: 32 }} aria-hidden="true" />
        </section>

        <NdjcSnackbarHost
          message={snackbarVisible ? snackbarMessage : null}
          onDismiss={() => setSnackbarVisible(false)}
        />

        {imagePreview ? (
          <NdjcFullscreenImageViewerScreen
            images={imagePreview.images}
            startIndex={imagePreview.startIndex}
            onDismiss={() => setImagePreview(null)}
            onSave={actions.onSavePreviewImage}
          />
        ) : null}
        </section>
      </NdjcCustomerPullRefreshContainer>
    </NdjcUnifiedBackground>
  )
}

function FavoriteCard({
  item,
  selected,
  onOpen,
  onToggle
}: {
  item: ShowcaseFavoriteCard
  selected: boolean
  onOpen: (id: string) => void
  onToggle: (id: string) => void
}) {
  const canOpenDetail = Boolean(item.itemAvailable)

  return (
    <NdjcLinkedCatalogItemCard
      title={item.title}
      imageUrl={item.imageUrl}
      subtitle={undefined}
      price={item.discountPriceText ? undefined : item.priceText}
      selected={selected}
      available={item.itemAvailable}
      allowClickWhenUnavailable={false}
      showSelectedOutline={false}
      onOpen={
        canOpenDetail
          ? () => onOpen(item.dishId)
          : undefined
      }
      onToggleSelect={() => onToggle(item.dishId)}
      bottom={
        item.discountPriceText ? (
          <span
            className="ndjc-linked-catalog-price-row"
            style={{
              minWidth: 0,
              display: 'flex',
              alignItems: 'baseline',
              gap: APK_SHOWCASE_ITEM_UI.catalogPriceGap
            }}
          >
            <b style={apkCatalogPriceStyle}>
              {item.discountPriceText}
            </b>

            <span style={apkCatalogOriginalPriceStyle}>
              {item.originalPriceText}
            </span>
          </span>
        ) : (
          <span className="ndjc-catalog-price-row" style={apkCatalogPriceRowStyle}>
            <b style={apkCatalogPriceStyle}>
              {item.priceText}
            </b>
          </span>
        )
      }
      middle={
        <NdjcItemStatusBadgeRow
          recommended={item.isRecommended}
          hidden={false}
        />
      }
    />
  )
}

export function ShowcaseFavoritesScreen({
  state,
  actions
}: {
  state: ShowcaseFavoritesUiState
  actions: ShowcaseFavoritesActions
}) {
  const hasSelection = state.selectedIds.length > 0
  const headerRef = React.useRef<HTMLElement | null>(null)
  const [headerHeight, setHeaderHeight] = React.useState(0)
  const [favoritesDraftRecommendedOnly, setFavoritesDraftRecommendedOnly] = React.useState(state.filterRecommendedOnly)
  const [favoritesDraftOnSaleOnly, setFavoritesDraftOnSaleOnly] = React.useState(state.filterOnSaleOnly)
  const [favoritesDraftPriceMin, setFavoritesDraftPriceMin] = React.useState(state.priceMinDraft)
  const [favoritesDraftPriceMax, setFavoritesDraftPriceMax] = React.useState(state.priceMaxDraft)

  React.useEffect(() => {
    if (!state.showFilterMenu) {
      setFavoritesDraftRecommendedOnly(state.filterRecommendedOnly)
      setFavoritesDraftOnSaleOnly(state.filterOnSaleOnly)
      setFavoritesDraftPriceMin(state.priceMinDraft)
      setFavoritesDraftPriceMax(state.priceMaxDraft)
    }
  }, [state.showFilterMenu, state.filterRecommendedOnly, state.filterOnSaleOnly, state.priceMinDraft, state.priceMaxDraft])

  React.useEffect(() => {
    const target = headerRef.current
    if (!target) return

    const updateHeight = () => {
      setHeaderHeight(target.getBoundingClientRect().height)
    }

    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(target)

    return () => observer.disconnect()
  }, [])

  const headerTopPadding = APK_PAGE_SHELL_UI.topCardOffset
  const listTopPadding = headerTopPadding + headerHeight + APK_SHOWCASE_ITEM_UI.adminItemsHeaderToListGap
  const filterActive =
    state.showFilterMenu ||
    state.filterRecommendedOnly ||
    state.filterOnSaleOnly ||
    state.appliedMinPrice != null ||
    state.appliedMaxPrice != null

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
      bottomBar={
<ShowcaseBottomBar
  actions={actions}
  activeTab="Favorites"
  showAppointments={state.bottomBar.showAppointments}
  showChatDot={state.bottomBar.showChatDot}
  showBookingsDot={state.bottomBar.showBookingsDot}
  showAnnouncementsDot={state.bottomBar.showAnnouncementsDot}
/>
      }
    >
      <section
        className="ndjc-apk-favorites-source-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <section
          className="ndjc-apk-favorites-list-layer"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            width: '100%',
            minHeight: 0,
            padding: `${listTopPadding}px ${APK_PAGE_SHELL_UI.screenPadding}px var(${NDJC_BOTTOM_BAR_RESERVE_CSS_VAR}, ${APK_PAGE_SHELL_UI.tabBottomReserve}px)`,
            display: 'grid',
            alignContent: state.items.length ? 'start' : 'stretch',
            gridTemplateRows: state.items.length ? undefined : 'minmax(0, 1fr)',
            gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            boxSizing: 'border-box'
          }}
        >
          {state.items.length ? (
            <>
              {state.items.map(item => (
                <FavoriteCard
                  key={item.dishId}
                  item={item}
                  selected={state.selectedIds.includes(item.dishId)}
                  onOpen={actions.onOpenDetail}
                  onToggle={actions.onToggleSelect}
                />
              ))}

              <NdjcNoMoreListFooter text="No more saved items" />
            </>
          ) : (
            <NdjcInlineEmptyState
              title="No saved items yet"
              message="Tap the save button on an item's details page to save it here."
              verticalPadding={0}
              fillParentMaxSize
            />
          )}
        </section>

        <NdjcTopScrollFadeMask
          className="ndjc-apk-favorites-header-scroll-mask"
          solidRatio={0.58}
          style={{
            zIndex: 2
          }}
        />

        <NdjcWhiteCard
          className="ndjc-apk-favorites-header-card"
          style={{
            position: 'absolute',
            zIndex: 3,
            top: headerTopPadding,
            left: APK_PAGE_SHELL_UI.screenPadding,
            right: APK_PAGE_SHELL_UI.screenPadding,
            width: `calc(100% - ${APK_PAGE_SHELL_UI.screenPadding * 2}px)`,
            boxSizing: 'border-box'
          }}
        >
          <section
            ref={headerRef}
            className="ndjc-apk-favorites-header-column"
            style={{
              width: '100%',
              display: 'grid',
              gap: 10
            }}
          >
              <section
                className="ndjc-apk-favorites-title-block"
                style={{
                  width: '100%',
                  display: 'grid',
                  gap: 4
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    color: APK_CORE_UI.black,
                    fontSize: 22,
                    lineHeight: 1.2,
                    fontWeight: 600
                  }}
                >
                  Saved
                </h1>

                <p
                  style={{
                    margin: 0,
                    color: 'rgba(0, 0, 0, 0.70)',
                    fontSize: 14,
                    lineHeight: 1.35,
                    fontWeight: 400
                  }}
                >
                  Your saved items.
                </p>

                <span
                  style={{
                    color: 'rgba(0, 0, 0, 0.70)',
                    fontSize: 12,
                    lineHeight: 1.25,
                    fontWeight: 400
                  }}
                >
                  {state.items.length} saved items
                </span>
              </section>

              <NdjcTextField
                label="Search saved"
                value={state.query}
                onChange={actions.onQueryChange}
                placeholder="Search saved"
                singleLine
              />

              <SortRow columns={4}>
                <SortNavEqualItem
                  text="Default"
                  selected={state.sortMode === 'Default'}
                  onClick={() => actions.onSortModeChange('Default')}
                />

                <SortNavEqualItem
                  text="Low–High"
                  selected={state.sortMode === 'PriceAsc'}
                  onClick={() => actions.onSortModeChange('PriceAsc')}
                />

                <SortNavEqualItem
                  text="High–Low"
                  selected={state.sortMode === 'PriceDesc'}
                  onClick={() => actions.onSortModeChange('PriceDesc')}
                />

                <SortNavEqualItem
                  text="Filter"
                  selected={filterActive}
                  onClick={() => {
                    setFavoritesDraftRecommendedOnly(state.filterRecommendedOnly)
                    setFavoritesDraftOnSaleOnly(state.filterOnSaleOnly)
                    setFavoritesDraftPriceMin(state.priceMinDraft)
                    setFavoritesDraftPriceMax(state.priceMaxDraft)
                    actions.onShowFilterMenuChange(true)
                  }}
                />
              </SortRow>

              <CategoryChipsRow
                selectedCategory={state.selectedCategory}
                manualCategories={state.categories}
                onCategorySelected={actions.onCategorySelected}
              />

              <p
                style={{
                  margin: 0,
                  color: 'rgba(0, 0, 0, 0.70)',
                  fontSize: 12,
                  lineHeight: 1.35,
                  fontWeight: 400
                }}
              >
                Select items to delete or clear selection.
              </p>

              <section
                className="ndjc-apk-favorites-bulk-row"
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10
                }}
              >
                <NdjcPrimaryActionButton
                  disabled={!hasSelection}
                  onClick={() => {
                    if (!hasSelection) return
                    actions.onClearSelection()
                  }}
                >
                  Clear
                </NdjcPrimaryActionButton>

                <NdjcPrimaryActionButton
                  disabled={!hasSelection}
                  onClick={() => {
                    if (!hasSelection) return
                    actions.onDeleteSelected()
                  }}
                >
                  Delete ({state.selectedIds.length})
                </NdjcPrimaryActionButton>
              </section>
            </section>
          </NdjcWhiteCard>

        <NdjcFilterBottomSheet
          open={state.showFilterMenu}
          title="Filter"
          clearText="Clear"
          applyText="Apply"
          priceMinDraft={favoritesDraftPriceMin}
          onPriceMinDraftChange={setFavoritesDraftPriceMin}
          priceMaxDraft={favoritesDraftPriceMax}
          onPriceMaxDraftChange={setFavoritesDraftPriceMax}
          showPriceFields
          onClose={() => {
            setFavoritesDraftRecommendedOnly(state.filterRecommendedOnly)
            setFavoritesDraftOnSaleOnly(state.filterOnSaleOnly)
            setFavoritesDraftPriceMin(state.priceMinDraft)
            setFavoritesDraftPriceMax(state.priceMaxDraft)
            actions.onShowFilterMenuChange(false)
          }}
          onClear={() => {
            setFavoritesDraftRecommendedOnly(false)
            setFavoritesDraftOnSaleOnly(false)
            setFavoritesDraftPriceMin('')
            setFavoritesDraftPriceMax('')
          }}
          onApply={() => {
            actions.onFilterRecommendedOnlyChange(favoritesDraftRecommendedOnly)
            actions.onFilterOnSaleOnlyChange(favoritesDraftOnSaleOnly)
            actions.onPriceMinDraftChange(favoritesDraftPriceMin)
            actions.onPriceMaxDraftChange(favoritesDraftPriceMax)
            window.setTimeout(() => {
              actions.onApplyPriceRange()
              actions.onShowFilterMenuChange(false)
            }, 0)
          }}
        >
          <NdjcToggleRow
            label="Pick"
            checked={favoritesDraftRecommendedOnly}
            onCheckedChange={setFavoritesDraftRecommendedOnly}
          />

          <NdjcToggleRow
            label="On sale"
            checked={favoritesDraftOnSaleOnly}
            onCheckedChange={setFavoritesDraftOnSaleOnly}
          />
        </NdjcFilterBottomSheet>

        <NdjcSnackbarHost message={state.statusMessage} />
      </section>
    </NdjcUnifiedBackground>
  )
}

function appointmentDisplayTime(preferredDate: string, preferredTime: string): string {
  const date = preferredDate.trim()
  const time = preferredTime.trim()

  if (date && time) return `Time · ${date}, ${time}`
  if (date) return `Time · ${date}`
  if (time) return `Time · ${time}`

  return 'Time · Not selected'
}

function statusClassName(status: string): string {
  const value = status.trim().toLowerCase()

  if (value.includes('confirm')) return 'is-confirmed'
  if (value.includes('complete')) return 'is-completed'
  if (value.includes('cancel')) return 'is-cancelled'
  if (value.includes('no')) return 'is-no-show'

  return 'is-pending'
}

function AppointmentFilterRow({
  label,
  options,
  selected,
  optionText,
  onSelected
}: {
  label: string
  options: string[]
  selected: string
  optionText?: (value: string) => string
  onSelected: (value: string) => void
}) {
  const horizontalScroll = useNdjcHorizontalDragScroll()

  if (!options.length) return null

  return (
    <section
      className="ndjc-appointment-filter-row"
      style={{
        width: '100%',
        maxWidth: '100%',
        minHeight: APK_CORE_UI.pillHeight + 4,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        overflow: 'hidden'
      }}
    >
      <span
        className="ndjc-appointment-filter-label"
        style={{
          width: 48,
          minWidth: 48,
          maxWidth: 48,
          flex: '0 0 48px',
          color: APK_CORE_UI.black,
          fontSize: APK_APPOINTMENT_UI.labelSmallSize,
          lineHeight: APK_APPOINTMENT_UI.labelSmallLineHeight,
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {label}
      </span>

      <div
        ref={horizontalScroll.scrollRef}
        className="ndjc-appointment-filter-options"
        style={{
          flex: '1 1 auto',
          minWidth: 0,
          maxWidth: '100%',
          height: APK_CORE_UI.pillHeight + 4,
          minHeight: APK_CORE_UI.pillHeight + 4,
          display: 'block',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          touchAction: 'pan-y',
          overscrollBehaviorX: 'contain',
          boxSizing: 'border-box',
          padding: '2px 0'
        }}
        role="list"
        onPointerDown={horizontalScroll.onPointerDown}
        onPointerMove={horizontalScroll.onPointerMove}
        onPointerUp={horizontalScroll.onPointerUp}
        onPointerCancel={horizontalScroll.onPointerCancel}
        onPointerLeave={horizontalScroll.onPointerLeave}
      >
        <div
          style={{
            width: 'max-content',
            minWidth: 'max-content',
            height: APK_CORE_UI.pillHeight,
            minHeight: APK_CORE_UI.pillHeight,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {options.map(option => {
            const isSelected = selected === option
            const text = optionText ? optionText(option) : option

            return (
              <span
                key={option}
                style={{
                  flex: '0 0 auto',
                  height: APK_CORE_UI.pillHeight,
                  minHeight: APK_CORE_UI.pillHeight,
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
<NdjcPillButton
  selected={isSelected}
  onClick={() => {
    if (horizontalScroll.shouldSuppressClick()) return
    onSelected(option)
  }}
>
  {text}
</NdjcPillButton>
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
function AppointmentCatalogItemCard({
  title,
  imageUrl,
  priceTextValue,
  originalPriceTextValue,
  discountPriceTextValue,
  categoryText,
  isRecommended = false,
  showRecommendedBadge = false,
  itemAvailable = true,
  allowClickWhenUnavailable = false,
  onOpen,
  bottom,
  trailing
}: {
  title: string
  imageUrl: string | null
  priceTextValue?: string | null
  originalPriceTextValue?: string | null
  discountPriceTextValue?: string | null
  categoryText?: string | null
  isRecommended?: boolean
  showRecommendedBadge?: boolean
  itemAvailable?: boolean
  allowClickWhenUnavailable?: boolean
  onOpen?: () => void
  bottom?: React.ReactNode
  trailing?: React.ReactNode
}) {
  return (
    <NdjcLinkedCatalogItemCard
      title={title || 'General appointment'}
      imageUrl={imageUrl}
      subtitle={categoryText || undefined}
      price={priceTextValue || undefined}
      originalPrice={originalPriceTextValue || undefined}
      discountPrice={discountPriceTextValue || undefined}
      available={itemAvailable}
      allowClickWhenUnavailable={allowClickWhenUnavailable}
      onOpen={onOpen}
      middle={
        showRecommendedBadge ? (
          <NdjcItemStatusBadgeRow
            recommended={isRecommended}
            hidden={false}
          />
        ) : null
      }
      bottom={bottom}
      trailing={trailing}
    />
  )
}

function AppointmentBookingProductSection({
  product,
  enabled,
  onOpenProductDetail
}: {
  product: ShowcaseAppointmentsUiState['product']
  enabled: boolean
  onOpenProductDetail: (dishId: string) => void
}) {
  return (
    <section className="ndjc-appointment-booking-product-section" style={apkAppointmentColumnStyle}>
      <h3 style={apkAppointmentSectionTitleStyle}>
        Booking for
      </h3>

      {product ? (
        <AppointmentCatalogItemCard
          title={product.title}
          imageUrl={product.imageUrl}
          priceTextValue={product.priceText}
          categoryText={null}
          isRecommended={product.isRecommended}
          itemAvailable={enabled}
          allowClickWhenUnavailable={false}
          onOpen={() => onOpenProductDetail(product.dishId)}
        />
      ) : (
        <section style={apkAppointmentWarningBoxStyle}>
          <p
            style={{
              margin: 0,
              fontSize: APK_APPOINTMENT_UI.bodySmallSize,
              lineHeight: APK_APPOINTMENT_UI.bodySmallLineHeight,
              fontWeight: APK_APPOINTMENT_UI.bodySmallWeight
            }}
          >
            Please open an item first, then book from its detail page.
          </p>
        </section>
      )}
    </section>
  )
}

function AppointmentCalendarDayButton({
  title,
  subtitle,
  selected,
  disabled,
  onClick
}: {
  title: string
  subtitle?: string
  selected: boolean
  disabled?: boolean
  onClick: () => void
}) {
  const enabled = !disabled

  return (
    <button
      type="button"
      className={cx('ndjc-appointment-calendar-day-button', selected && 'is-selected')}
      style={apkAppointmentDatePillStyle(selected, enabled)}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
    >
      <strong
        style={{
          maxWidth: '100%',
          color: 'currentColor',
          fontSize: APK_APPOINTMENT_UI.labelMediumSize,
          lineHeight: APK_APPOINTMENT_UI.labelMediumLineHeight,
          fontWeight: APK_APPOINTMENT_UI.labelMediumWeight,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {title}
      </strong>

      {subtitle ? (
        <span
          style={{
            maxWidth: '100%',
            color: selected ? 'rgba(255, 255, 255, 0.88)' : enabled ? APK_APPOINTMENT_UI.secondaryText : APK_APPOINTMENT_UI.disabledText,
            fontSize: APK_APPOINTMENT_UI.labelSmallSize,
            lineHeight: APK_APPOINTMENT_UI.labelSmallLineHeight,
            fontWeight: APK_APPOINTMENT_UI.bodySmallWeight,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {subtitle}
        </span>
      ) : null}
    </button>
  )
}

function AppointmentCalendarMonthDayButton({
  text,
  active,
  onClick
}: {
  text: string
  active: boolean
  onClick: () => void
}) {
  const daySize = APK_APPOINTMENT_UI.calendarDayHeight

  return (
    <span
      className={cx('ndjc-appointment-calendar-month-day-button', active && 'is-selected')}
      style={{
        width: '100%',
        height: daySize,
        minHeight: daySize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <button
        type="button"
        className={cx('ndjc-appointment-calendar-month-day-inner-button', active && 'is-selected')}
        style={{
          width: daySize,
          height: daySize,
          minWidth: daySize,
          maxWidth: daySize,
          padding: 0,
          border: `${active ? 0 : APK_CORE_UI.pillBorderWidth}px solid ${APK_CORE_UI.border}`,
          borderRadius: 999,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: active ? APK_CORE_UI.white : APK_CORE_UI.black,
          background: active ? APK_CORE_UI.brand : APK_CORE_UI.chipUnselectedBg,
          boxShadow: 'none',
          fontSize: APK_CORE_UI.pillFontSize,
          lineHeight: 1,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
          boxSizing: 'border-box',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          userSelect: 'none',
          ['--ndjc-pill-pressed-scale' as string]: String(APK_FILTER_UI.chipPressedScale)
        } as React.CSSProperties}
        onClick={onClick}
        aria-pressed={active}
      >
        <span
          style={{
            width: '100%',
            height: '100%',
            minWidth: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            transform: 'translateY(1px)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {text}
        </span>
      </button>
    </span>
  )
}

function AppointmentCustomerDateRow({
  title,
  options,
  selected,
  enabled,
  onSelected
}: {
  title: string
  options: ShowcaseAppointmentsUiState['dateOptions']
  selected: string
  enabled: boolean
  onSelected: (value: string) => void
}) {
  if (!options.length) {
    return (
      <section className="ndjc-appointment-customer-date-row" style={apkAppointmentColumnStyle}>
        <h3 style={apkAppointmentSectionTitleStyle}>
          {title}
        </h3>

        <MutedText>No booking dates are available.</MutedText>
      </section>
    )
  }

  return (
    <section className="ndjc-appointment-customer-date-row" style={apkAppointmentColumnStyle}>
      <h3 style={apkAppointmentSectionTitleStyle}>
        {title}
      </h3>

      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          touchAction: 'pan-x',
          overscrollBehaviorX: 'contain'
        }}
      >
        {options.map(option => (
          <span
            key={option.value}
            style={{
              flex: '0 0 auto',
              display: 'inline-flex',
              whiteSpace: 'nowrap'
            }}
          >
            <AppointmentDatePill
              title={option.title}
              subtitle={option.reason?.trim() ? option.reason : option.subtitle}
              selected={selected === option.value}
              disabled={!enabled || !option.available}
              onClick={() => {
                if (enabled && option.available) {
                  onSelected(option.value)
                }
              }}
            />
          </span>
        ))}
      </div>
    </section>
  )
}
function AppointmentCustomerTimeGrid({
  title,
  options,
  selected,
  emptyText,
  enabled,
  onSelected
}: {
  title: string
  options: string[]
  selected: string
  emptyText: string
  enabled: boolean
  onSelected: (value: string) => void
}) {
  return (
    <section className="ndjc-appointment-customer-time-grid" style={apkAppointmentColumnStyle}>
      <h3 style={apkAppointmentSectionTitleStyle}>
        {title}
      </h3>

      {!options.length ? (
        <MutedText>{emptyText}</MutedText>
      ) : (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8
          }}
        >
          {options.map(option => {
            const normalized = normalizeAppointmentTimeText(option)
            const active = selected === option

            return (
              <NdjcControlPillButton
                key={option}
                active={active}
                tone="subtle"
                disabled={!enabled}
                onClick={() => {
                  if (enabled) {
                    onSelected(option)
                  }
                }}
              >
                {normalized}
              </NdjcControlPillButton>
            )
          })}
        </div>
      )}
    </section>
  )
}

function AppointmentSubmitConfirmLine({
  enabled,
  canSubmit,
  isSubmitting,
  onSubmit
}: {
  enabled: boolean
  canSubmit: boolean
  isSubmitting: boolean
  onSubmit: () => void
}) {
  return (
    <NdjcPrimaryActionButton
      disabled={!enabled || !canSubmit || isSubmitting}
      isLoading={isSubmitting}
      onClick={() => {
        if (isSubmitting) return
        onSubmit()
      }}
    >
      Submit request
    </NdjcPrimaryActionButton>
  )
}

function AppointmentSubmitConfirmInfo({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <section style={apkAppointmentDetailLineStyle}>
      <span style={apkAppointmentDetailLabelStyle}>{label}</span>
      <strong style={apkAppointmentDetailValueStyle}>{value}</strong>
    </section>
  )
}

function AppointmentDetailInfoLine({
  label,
  value
}: {
  label: string
  value: string | null | undefined
}) {
  const cleanValue = value?.trim() || ''
  if (!cleanValue) return null

  return (
    <section className="ndjc-appointment-detail-info-line" style={apkAppointmentDetailLineStyle}>
      <span style={apkAppointmentDetailLabelStyle}>{label}</span>
      <strong style={apkAppointmentDetailValueStyle}>{cleanValue}</strong>
    </section>
  )
}

function AppointmentDetailsBottomSheet({
  item,
  onClose,
  onOpenProduct,
  adminActions,
  statusSubmittingId = null
}: {
  item: ShowcaseAppointmentCard | null
  onClose: () => void
  onOpenProduct?: (dishId: string) => void
  adminActions?: Pick<ShowcaseAdminAppointmentsActions, 'onPending' | 'onConfirm' | 'onComplete' | 'onCancel' | 'onNoShow' | 'onContactCustomer'>
  statusSubmittingId?: string | null
}) {
  const [draftStatus, setDraftStatus] = React.useState(item?.statusLabel || 'Pending')

  React.useEffect(() => {
    setDraftStatus(item?.statusLabel || 'Pending')
  }, [item?.id, item?.statusLabel])

  if (!item) return null

  const canOpenProduct = Boolean(item.itemAvailable && item.sourceDishId && onOpenProduct)
  const statusSubmitting = Boolean(adminActions && statusSubmittingId === item.id)

  return (
    <NdjcFilterBottomSheet
      open={Boolean(item)}
      title={adminActions ? 'Appointment details' : 'Booking details'}
      clearText=""
      applyText="Done"
      showPriceFields={false}
      showHeaderAction={false}
      showApplyButton={false}
      onClose={onClose}
      onClear={onClose}
      onApply={onClose}
    >
      <div style={{ height: APK_APPOINTMENT_UI.bottomSheetSpacerTop }} aria-hidden="true" />

      <AppointmentCatalogItemCard
        title={item.serviceTitle || 'General appointment'}
        imageUrl={item.imageUrl}
        priceTextValue={item.priceText}
        originalPriceTextValue={item.originalPriceText}
        discountPriceTextValue={item.discountPriceText}
        categoryText={null}
        isRecommended={item.isRecommended}
        showRecommendedBadge
        itemAvailable={item.itemAvailable && Boolean(item.sourceDishId)}
        allowClickWhenUnavailable={false}
        onOpen={
          canOpenProduct && item.sourceDishId
            ? () => {
                onClose()
                onOpenProduct?.(item.sourceDishId!)
              }
            : undefined
        }
      />

      <AppointmentDetailSectionTitle>
        {adminActions ? 'Appointment info' : 'Booking info'}
      </AppointmentDetailSectionTitle>

      <AppointmentDetailInfoLine
        label="Time"
        value={appointmentDetailTimeText(item.preferredDate, item.preferredTime)}
      />

      <AppointmentDetailInfoLine
        label="Customer"
        value={item.customerName || 'Customer'}
      />

      <AppointmentContactCopyLine
        label="Contact"
        value={item.customerContact || 'No contact provided'}
      />

      <AppointmentDetailInfoLine label="Note" value={item.note} />
      <AppointmentDetailInfoLine label="Requested" value={item.createdAtText} />

      {adminActions ? (
        <>
          <AppointmentDetailSectionTitle>Appointment status</AppointmentDetailSectionTitle>

          <section
            style={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 8
            }}
          >
            {['Pending', 'Confirmed', 'Cancelled', 'Completed', 'No-show'].map(status => (
              <NdjcPillButton
                key={status}
                selected={draftStatus === status}
                disabled={statusSubmitting}
                onClick={() => {
                  if (statusSubmitting) return
                  setDraftStatus(status)
                }}
              >
                {status}
              </NdjcPillButton>
            ))}
          </section>

          <NdjcPrimaryActionButton
            disabled={statusSubmitting}
            isLoading={statusSubmitting}
            onClick={() => {
              if (statusSubmitting) return

              let actionResult: void | Promise<void> | null = null

              if (draftStatus === 'Pending') actionResult = adminActions.onPending(item.id)
              if (draftStatus === 'Confirmed') actionResult = adminActions.onConfirm(item.id)
              if (draftStatus === 'Cancelled') actionResult = adminActions.onCancel(item.id)
              if (draftStatus === 'Completed') actionResult = adminActions.onComplete(item.id)
              if (draftStatus === 'No-show') actionResult = adminActions.onNoShow(item.id)

              void Promise.resolve(actionResult).finally(() => {
                onClose()
              })
            }}
          >
            Save status
          </NdjcPrimaryActionButton>
        </>
      ) : (
        <AppointmentDetailInfoLine label="Status" value={item.statusLabel} />
      )}
    </NdjcFilterBottomSheet>
  )
}

function CustomerBookingDetailsBottomSheet({
  item,
  onClose,
  onOpenProduct
}: {
  item: ShowcaseAppointmentCard | null
  onClose: () => void
  onOpenProduct?: (dishId: string) => void
}) {
  if (!item) return null

  const sourceDishId = item.sourceDishId?.trim() || ''
  const canOpenProduct = Boolean(item.itemAvailable && sourceDishId && onOpenProduct)

  return (
    <NdjcFilterBottomSheet
      open={Boolean(item)}
      title="Booking details"
      clearText=""
      applyText="Done"
      showPriceFields={false}
      showHeaderAction={false}
      showApplyButton={false}
      onClose={onClose}
      onClear={onClose}
      onApply={onClose}
    >
      <AppointmentCatalogItemCard
        title={item.serviceTitle || 'General appointment'}
        imageUrl={item.imageUrl}
        priceTextValue={item.priceText}
        originalPriceTextValue={item.originalPriceText}
        discountPriceTextValue={item.discountPriceText}
        categoryText={null}
        isRecommended={item.isRecommended}
        showRecommendedBadge
        itemAvailable={item.itemAvailable && Boolean(sourceDishId)}
        allowClickWhenUnavailable={false}
        onOpen={canOpenProduct
          ? () => {
              onClose()
              onOpenProduct?.(sourceDishId)
            }
          : undefined}
      />

      <AppointmentDetailInfoLine
        label="Time"
        value={appointmentDetailTimeText(item.preferredDate, item.preferredTime)}
      />

      <AppointmentDetailInfoLine
        label="Status"
        value={item.statusLabel}
      />

      <AppointmentDetailInfoLine
        label="Customer"
        value={item.customerName || 'Customer'}
      />

      <AppointmentDetailInfoLine
        label="Contact"
        value={item.customerContact || 'No contact provided'}
      />

      {item.note ? (
        <AppointmentDetailInfoLine
          label="Note"
          value={item.note}
        />
      ) : null}

      {item.createdAtText ? (
        <AppointmentDetailInfoLine
          label="Requested"
          value={item.createdAtText}
        />
      ) : null}
    </NdjcFilterBottomSheet>
  )
}

function AppointmentCard({
  item,
  onOpenDetails,
  onContactMerchant
}: {
  item: ShowcaseAppointmentCard
  onOpenProduct?: (dishId: string) => void
  onOpenDetails?: (item: ShowcaseAppointmentCard) => void
  onContactMerchant?: (id: string) => void
}) {
  const linkedItemAvailable = Boolean(item.itemAvailable && item.sourceDishId)

  return (
    <AppointmentCatalogItemCard
      title={item.serviceTitle || 'General appointment'}
      imageUrl={item.imageUrl}
      priceTextValue={null}
      categoryText={null}
      isRecommended={item.isRecommended}
      itemAvailable={linkedItemAvailable}
      allowClickWhenUnavailable
      onOpen={() => onOpenDetails?.(item)}
      bottom={
        <>
          <span
            style={{
              color: APK_APPOINTMENT_UI.black75,
              fontSize: APK_APPOINTMENT_UI.bodyMediumSize,
              lineHeight: APK_APPOINTMENT_UI.bodyMediumLineHeight,
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {appointmentListTimeText(item.preferredDate, item.preferredTime)}
          </span>

          <div style={{ height: 4 }} aria-hidden="true" />

          <NdjcPillBadge selected>
            {item.statusLabel}
          </NdjcPillBadge>
        </>
      }
      trailing={
        onContactMerchant && linkedItemAvailable ? (
          <button
            type="button"
            aria-label="Chat merchant"
            title="Chat merchant"
            style={{
              width: 40,
              height: 40,
              border: 0,
              borderRadius: 999,
              padding: 0,
              display: 'grid',
              placeItems: 'center',
              color: APK_APPOINTMENT_UI.brand,
              background: 'transparent',
              boxShadow: 'none',
              cursor: 'pointer'
            }}
            onClick={event => {
              event.stopPropagation()
              onContactMerchant(item.id)
            }}
          >
            <NdjcChatBubbleIcon filled />
          </button>
        ) : null
      }
    />
  )
}

export function ShowcaseCustomerBookingsScreen({
  state,
  actions
}: {
  state: ShowcaseCustomerBookingsUiState
  actions: ShowcaseCustomerBookingsActions
}) {
  const [detailsItem, setDetailsItem] = React.useState<ShowcaseAppointmentCard | null>(null)
  const headerRef = React.useRef<HTMLElement | null>(null)
  const [headerHeight, setHeaderHeight] = React.useState(0)

  React.useEffect(() => {
    const target = headerRef.current
    if (!target) return

    const updateHeight = () => {
      setHeaderHeight(target.getBoundingClientRect().height)
    }

    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(target)

    return () => observer.disconnect()
  }, [])

  const headerTopPadding = APK_PAGE_SHELL_UI.topCardOffset
  const listTopPadding = headerTopPadding + headerHeight + 8

return (
  <NdjcUnifiedBackground
    topNav={{
      onBack: actions.onBack,
      onHome: actions.onBackToHome
    }}
    bottomBar={
<ShowcaseBottomBar
  actions={actions}
  activeTab="Appointments"
  showAppointments={state.bottomBar.showAppointments}
  showChatDot={state.bottomBar.showChatDot}
  showBookingsDot={state.bottomBar.showBookingsDot}
  showAnnouncementsDot={state.bottomBar.showAnnouncementsDot}
/>
    }
  >
      <section
        className="ndjc-apk-bookings-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <NdjcCustomerPullRefreshContainer
          isRefreshing={state.isRefreshing}
          onRefresh={actions.onRefresh}
        >
          <section
            className="ndjc-bookings-list"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              width: '100%',
              height: '100%',
              minHeight: 0,
              padding: `${listTopPadding}px ${APK_PAGE_SHELL_UI.screenPadding}px var(${NDJC_BOTTOM_BAR_RESERVE_CSS_VAR}, 84px)`,
              display: 'grid',
              alignContent: state.items.length ? 'start' : 'stretch',
              gridTemplateRows: state.items.length ? undefined : 'minmax(0, 1fr)',
              gap: 10,
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              boxSizing: 'border-box'
            }}
            onScroll={event => ndjcHandleLoadMoreScroll(
              event,
              state.pagination,
              actions.onLoadMore
            )}
          >
            {state.items.length ? (
              <>
                {state.items.map(item => (
                  <AppointmentCard
                    key={item.id}
                    item={item}
                    onOpenProduct={actions.onOpenAppointmentProductDetail}
                    onOpenDetails={setDetailsItem}
                    onContactMerchant={actions.onContactMerchant}
                  />
                ))}

                <NdjcPaginationFooter
                  pagination={state.pagination}
                  idleText="Load more"
                  loadingText="Loading more..."
                  endText="No more bookings"
                  onLoadMore={actions.onLoadMore}
                />
              </>
            ) : (
              <NdjcInlineEmptyState
                title="No bookings yet"
                message="Your appointment requests will appear here after you submit a booking."
                verticalPadding={0}
                fillParentMaxSize
              />
            )}
          </section>
        </NdjcCustomerPullRefreshContainer>

        <NdjcTopScrollFadeMask
          className="ndjc-bookings-header-scroll-mask"
          solidRatio={0.58}
          style={{
            zIndex: 2
          }}
        />

        <section
          ref={headerRef}
          className="ndjc-bookings-filter-card-wrap"
          style={{
            position: 'absolute',
            left: APK_PAGE_SHELL_UI.screenPadding,
            right: APK_PAGE_SHELL_UI.screenPadding,
            top: headerTopPadding,
            zIndex: 3
          }}
        >
          <NdjcWhiteCard className="ndjc-bookings-filter-card">
            <section
              style={{
                width: '100%',
                display: 'grid',
                gap: 6
              }}
            >
              <h1
                style={{
                  margin: 0,
                  color: APK_CORE_UI.black,
                  fontSize: 24,
                  lineHeight: 1.25,
                  fontWeight: 600
                }}
              >
                My bookings
              </h1>

              <AppointmentFilterRow
                label="Date"
                options={state.dateFilterOptions}
                selected={state.selectedDateFilter}
                optionText={appointmentFilterDateLabel}
                onSelected={actions.onDateFilterChange}
              />

              <AppointmentFilterRow
                label="Status"
                options={state.statusFilterOptions}
                selected={state.selectedStatusFilter}
                onSelected={actions.onStatusFilterChange}
              />

              <AppointmentFilterRow
                label="Item"
                options={state.serviceFilterOptions}
                selected={state.selectedServiceFilter}
                onSelected={actions.onServiceFilterChange}
              />
            </section>
          </NdjcWhiteCard>
        </section>

        <NdjcSnackbarHost
          message={state.statusMessage?.toLowerCase() === 'no data.'
            ? null
            : state.statusMessage}
        />

        <CustomerBookingDetailsBottomSheet
          item={detailsItem}
          onClose={() => setDetailsItem(null)}
          onOpenProduct={actions.onOpenAppointmentProductDetail}
        />
      </section>
    </NdjcUnifiedBackground>
  )
}

function AnnouncementTimePill({ timeText }: { timeText: string }) {
  return (
    <div
      className="ndjc-announcement-time-pill-wrap"
      style={{
        width: '100%',
        display: 'grid',
        placeItems: 'center',
        padding: `${APK_ANNOUNCEMENT_UI.timePillWrapPaddingY}px 0`
      }}
    >
      <span className="ndjc-announcement-time-pill" style={apkAnnouncementTimePillStyle}>
        {timeText || 'Just now'}
      </span>
    </div>
  )
}

function AnnouncementDraftCard({
  item,
  selected,
  onOpen,
  onPreview,
  onToggleSelect
}: {
  item: ShowcaseAnnouncementCard
  selected: boolean
  onOpen: (id: string) => void
  onPreview: (id: string) => void
  onToggleSelect: (id: string) => void
}) {
  return (
    <section
      className="ndjc-announcement-draft-card-wrap"
      style={{
        width: '100%',
        minWidth: 0,
        borderRadius: APK_ANNOUNCEMENT_UI.draftRadius,
        boxSizing: 'border-box'
      }}
    >
      <NdjcHomeStyleMediaCard
        title=""
        imageUrl={selectAnnouncementCoverUrl(item, 'announcementCard')}
        primaryText=""
        secondaryText={null}
        badgeText={null}
        onClick={() => onPreview(item.id)}
        showTitleInBottom={false}
        primaryTextStyle={{
          fontSize: APK_ANNOUNCEMENT_UI.draftActionSize
        }}
        bottomContentOverride={
          <section
            className="ndjc-announcement-draft-bottom"
            style={{
              width: '100%',
              height: '100%',
              padding: `0 ${APK_ANNOUNCEMENT_UI.draftBottomPaddingX}px`,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                flex: APK_ANNOUNCEMENT_UI.draftTimeWeight,
                minHeight: 0,
                width: '100%',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <span
                style={{
                  width: '100%',
                  color: 'rgba(0, 0, 0, 0.75)',
                  fontSize: APK_ANNOUNCEMENT_UI.draftTimeSize,
                  lineHeight: 1.2,
                  fontWeight: 500,
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.timeText || 'Draft'}
              </span>
            </div>

            <div
              style={{
                flex: APK_ANNOUNCEMENT_UI.draftSpacerWeight,
                minHeight: 0,
                width: '100%'
              }}
              aria-hidden="true"
            />

            <div
              style={{
                flex: APK_ANNOUNCEMENT_UI.draftActionWeight,
                minHeight: 0,
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                alignItems: 'center'
              }}
            >
              <div
                style={{
                  height: '100%',
                  display: 'grid',
                  alignItems: 'center',
                  justifyItems: 'start',
                  transform: 'translateY(25px)'
                }}
              >
                <button
                  type="button"
                  style={{
                    height: APK_ANNOUNCEMENT_UI.draftEditHeight,
                    border: 0,
                    borderRadius: APK_ANNOUNCEMENT_UI.draftEditRadius,
                    padding: `0 ${APK_ANNOUNCEMENT_UI.draftEditPaddingX}px`,
                    display: 'grid',
                    placeItems: 'center',
                    color: APK_ANNOUNCEMENT_UI.brand,
                    background: 'transparent',
                    boxShadow: 'none',
                    fontSize: APK_ANNOUNCEMENT_UI.draftActionSize,
                    lineHeight: 1,
                    fontWeight: 500,
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation'
                  }}
                  onClick={event => {
                    event.stopPropagation()
                    onOpen(item.id)
                  }}
                >
                  Edit
                </button>
              </div>

              <div aria-hidden="true" />

              <div
                style={{
                  height: '100%',
                  display: 'grid',
                  alignItems: 'center',
                  justifyItems: 'end',
                  transform: 'translateY(25px)'
                }}
              >
                <span
                  onClick={event => {
                    event.stopPropagation()
                  }}
                >
                  <NdjcSelectionCheckbox
                    checked={selected}
                    onCheckedChange={() => onToggleSelect(item.id)}
                    label="Select announcement draft"
                  />
                </span>
              </div>
            </div>
          </section>
        }
      />
    </section>
  )
}

function findNearestVerticalScrollParent(element: HTMLElement | null): HTMLElement | null {
  let current = element?.parentElement ?? null

  while (current) {
    const style = window.getComputedStyle(current)
    const overflowY = style.overflowY
    const canScrollY = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay'

    if (canScrollY && current.scrollHeight > current.clientHeight) {
      return current
    }

    current = current.parentElement
  }

  return null
}

function AnnouncementFeedCard({
  card,
  forceExpand,
  onOpenAnnouncement,
  onExpandAnnouncement,
  onOpenImagePreview
}: {
  card: ShowcaseAnnouncementCard
  forceExpand?: boolean
  onOpenAnnouncement: () => void
  onExpandAnnouncement: () => void
  onOpenImagePreview: (url: string) => void
}) {
  const [expanded, setExpanded] = React.useState(Boolean(forceExpand))
  const cardRef = React.useRef<HTMLElement | null>(null)
  const restoreScrollFrameRef = React.useRef<number | null>(null)
  const hasBody = card.bodyText.trim().length > 0
  const cleanCoverUrl = selectAnnouncementCoverUrl(card, 'announcementFeed') || ''

  React.useEffect(() => {
    if (forceExpand) {
      setExpanded(true)
    }
  }, [forceExpand])

  React.useEffect(() => {
    return () => {
      if (restoreScrollFrameRef.current != null) {
        window.cancelAnimationFrame(restoreScrollFrameRef.current)
        restoreScrollFrameRef.current = null
      }
    }
  }, [])

  function toggleExpandedText(): void {
    const nextExpanded = !expanded
    const cardElement = cardRef.current
    const scrollParent = findNearestVerticalScrollParent(cardElement)

    const previousScrollTop = scrollParent?.scrollTop ?? 0
    const previousCardTop = cardElement?.getBoundingClientRect().top ?? 0

    setExpanded(nextExpanded)

    if (nextExpanded) {
      onExpandAnnouncement()
    }

    if (restoreScrollFrameRef.current != null) {
      window.cancelAnimationFrame(restoreScrollFrameRef.current)
      restoreScrollFrameRef.current = null
    }

    restoreScrollFrameRef.current = window.requestAnimationFrame(() => {
      restoreScrollFrameRef.current = null

      if (!scrollParent || !cardElement) return

      const nextCardTop = cardElement.getBoundingClientRect().top
      const cardTopDelta = nextCardTop - previousCardTop

      scrollParent.scrollTop = previousScrollTop + cardTopDelta
    })
  }

  return (
    <section ref={cardRef}>
      <NdjcWhiteCard
        className={cx('ndjc-announcement-feed-card', forceExpand && 'is-focused')}
        style={{
          ...apkAnnouncementFeedCardStyle,
          outline: '0 solid transparent',
          transition: 'none'
        }}
      >
        {cleanCoverUrl ? (
          <button
            type="button"
            className="ndjc-announcement-cover-button"
            style={apkAnnouncementFeedImageButtonStyle}
            onClick={() => onOpenImagePreview(cleanCoverUrl)}
          >
            <NdjcShimmerImage
              src={cleanCoverUrl}
              alt="Announcement cover"
              className="ndjc-announcement-cover-image"
              placeholderCornerRadius={APK_ANNOUNCEMENT_UI.feedImageRadius}
              contentScale="cover"
            />
          </button>
        ) : (
          <button
            type="button"
            className="ndjc-announcement-cover-placeholder"
            style={apkAnnouncementFeedPlaceholderStyle}
            onClick={onOpenAnnouncement}
          >
            <span>No cover image</span>
          </button>
        )}

        <section
          className="ndjc-announcement-card-body"
          style={{
            ...apkAnnouncementFeedInnerStyle,
            transition: 'height 160ms ease'
          }}
        >
          <div className="ndjc-announcement-divider" style={apkAnnouncementFeedDividerStyle} />

          <div className="ndjc-announcement-meta-row" style={apkAnnouncementMetaRowStyle}>
            <span style={apkAnnouncementMetaTextStyle}>
              {card.viewCount} views
            </span>

            <span style={{ flex: '1 1 auto' }} aria-hidden="true" />

            {hasBody ? (
              <button
                type="button"
                style={apkAnnouncementExpandButtonStyle}
                onPointerDown={event => {
                  event.preventDefault()
                }}
                onClick={toggleExpandedText}
                aria-label={expanded ? 'Collapse announcement' : 'Expand announcement'}
              >
                <NdjcAnnouncementExpandIcon expanded={expanded} />
              </button>
            ) : null}
          </div>

          {hasBody ? (
            <section
              className={cx('ndjc-announcement-body-text', expanded && 'is-expanded')}
              style={apkAnnouncementExpandedBodyOuterStyle(expanded)}
              aria-hidden={!expanded}
            >
              <section style={apkAnnouncementExpandedBodyInnerStyle}>
                <section style={apkAnnouncementExpandedBodyStyle}>
                  <p style={apkAnnouncementBodyTextStyle}>
                    {card.bodyText}
                  </p>
                </section>
              </section>
            </section>
          ) : null}
        </section>
      </NdjcWhiteCard>
    </section>
  )
}

function ShowcaseAnnouncementsPreview({
  item,
  onClose,
  onOpenImage
}: {
  item: ShowcaseAnnouncementCard | null
  onClose: () => void
  onOpenImage?: (url: string) => void
}) {
  if (!item) return null

  return (
    <section className="ndjc-sheet-backdrop">
      <section className="ndjc-announcement-preview-sheet">
        <header className="ndjc-sheet-header" style={apkSheetHeaderRootStyle}>
          <div className="ndjc-sheet-header-row" style={apkSheetHeaderRowStyle}>
            <div className="ndjc-sheet-header-copy" style={apkSheetHeaderCopyStyle}>
              <h2 id="ndjc-announcement-preview-sheet-title" style={apkSheetHeaderTitleStyle}>
                Announcement preview
              </h2>

              <p style={apkSheetHeaderSubtitleStyle}>
                {item.timeText}
              </p>
            </div>

            <button
              type="button"
              className="ndjc-sheet-close-button"
              style={apkSheetCloseButtonStyle}
              onClick={onClose}
              aria-label="Close sheet"
            >
              ×
            </button>
          </div>

          <div className="ndjc-sheet-header-divider" style={apkSheetDividerStyle} aria-hidden="true" />
        </header>

        <AnnouncementFeedCard
          card={item}
          forceExpand
          onOpenAnnouncement={() => {}}
          onExpandAnnouncement={() => {}}
          onOpenImagePreview={url => onOpenImage?.(url)}
        />
      </section>
    </section>
  )
}

function ShowcaseAdminAnnouncementEditPreview({
  item,
  onClose,
  onOpenImage
}: {
  item: ShowcaseAnnouncementCard | null
  onClose: () => void
  onOpenImage?: (url: string) => void
}) {
  if (!item) return null

  return (
    <section
      className="ndjc-admin-announcement-preview-dialog-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        padding: '0 16px',
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(0, 0, 0, 0.34)'
      }}
      onClick={onClose}
    >
      <section
        className="ndjc-admin-announcement-preview-dialog-card"
        style={{
          width: '100%',
          maxWidth: 420,
          minWidth: 0
        }}
        onClick={event => {
          event.stopPropagation()
        }}
      >
        <AnnouncementFeedCard
          card={item}
          forceExpand
          onOpenAnnouncement={() => {}}
          onExpandAnnouncement={() => {}}
          onOpenImagePreview={url => onOpenImage?.(url)}
        />
      </section>
    </section>
  )
}

export function ShowcaseAnnouncementsScreen({
  state,
  actions
}: {
  state: ShowcaseAnnouncementsUiState
  actions: ShowcaseAnnouncementsActions
}) {
  const [previewImage, setPreviewImage] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)
  const itemRefs = React.useRef<Record<string, HTMLElement | null>>({})
  const handleSavePreviewImage = React.useCallback(() => {}, [])

  React.useLayoutEffect(() => {
    const targetId = state.focusedAnnouncementId
    if (!targetId) return

    const exists = state.items.some(item => item.id === targetId)
    if (!exists) return

    itemRefs.current[targetId]?.scrollIntoView({
      block: 'start',
      behavior: 'auto'
    })

    actions.onOpenAnnouncement(targetId)
    actions.onConsumeFocusedAnnouncement()
  }, [
    state.focusedAnnouncementId,
    state.items,
    actions.onOpenAnnouncement,
    actions.onConsumeFocusedAnnouncement
  ])

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
      bottomBar={
<ShowcaseBottomBar
  actions={actions}
  activeTab="Announcements"
  showAppointments={state.bottomBar.showAppointments}
  showChatDot={state.bottomBar.showChatDot}
  showBookingsDot={state.bottomBar.showBookingsDot}
  showAnnouncementsDot={state.bottomBar.showAnnouncementsDot}
/>
      }
    >
      <NdjcConversationPageScaffold
        wrapWithUnifiedBackground={false}
        showTopBar
        title={state.title || 'Announcements'}
        subtitle={undefined}
        actions={actions}
        className="ndjc-apk-announcements-screen"
        contentPaddingTop={12}
        contentPaddingBottom={16}
        contentTrailingSpacerHeight={40}
        verticalItemSpacing={10}
        fillContentWhenEmpty={state.items.length === 0 && !state.isLoading}
        onContentScroll={event => ndjcHandleLoadMoreScroll(
          event,
          state.pagination,
          actions.onLoadMore
        )}
      >
        {state.items.length === 0 && !state.isLoading ? (
          <NdjcInlineEmptyState
            title="No updates yet"
            message="New announcements will appear here when the business posts them."
            verticalPadding={0}
            fillParentMaxSize
          />
        ) : (
          <>
            {state.items.map(item => (
              <section
                key={item.id}
                ref={node => {
                  itemRefs.current[item.id] = node
                }}
                className="ndjc-apk-announcement-feed-block"
                style={{
                  width: '100%',
                  display: 'grid',
                  gap: 8,
                  boxSizing: 'border-box'
                }}
              >
                <NdjcConversationTimePill text={item.timeText} />

                <AnnouncementFeedCard
                  card={item}
                  forceExpand={state.focusedAnnouncementId === item.id}
                  onOpenAnnouncement={() => actions.onOpenAnnouncement(item.id)}
                  onExpandAnnouncement={() => actions.onTrackAnnouncementView(item.id)}
                  onOpenImagePreview={url => {
                    actions.onOpenAnnouncementImage(item.id)
                    setPreviewImage({
                      images: [url],
                      startIndex: 0
                    })
                  }}
                />
              </section>
            ))}

            <NdjcPaginationFooter
              pagination={state.pagination}
              idleText="Load more"
              loadingText="Loading more..."
              endText="No more updates"
              onLoadMore={actions.onLoadMore}
            />
          </>
        )}

        {previewImage ? (
          <NdjcFullscreenImageViewerScreen
            images={previewImage.images}
            startIndex={previewImage.startIndex}
            onDismiss={() => setPreviewImage(null)}
            onSave={handleSavePreviewImage}
          />
        ) : null}
      </NdjcConversationPageScaffold>
    </NdjcUnifiedBackground>
  )
}

function NdjcConversationPageScaffold({
  title,
  subtitle,
  actions,
  toolbar,
  children,
  footer,
  className,
  showTopBar = true,
  isSelectionMode = false,
  selectedCount = 0,
  topBarActions,
  contentPaddingTop = 12,
  contentPaddingBottom = 20,
  contentPaddingX = APK_CHAT_UI.bodyPaddingX,
  verticalItemSpacing = 8,
  wrapWithUnifiedBackground = true,
  fillContentWhenEmpty = false,
  contentScrollKey,
  contentAutoScrollToBottom = true,
  contentForceScrollToBottomSignal = 0,
  contentPreserveScrollAnchorKey = null,
  contentTrailingSpacerHeight = 0,
  onContentScroll
}: {
  title: string
  subtitle?: string | null
  actions: Pick<ShowcaseChatActions, 'onBack' | 'onBackToHome'>
  toolbar?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  showTopBar?: boolean
  isSelectionMode?: boolean
  selectedCount?: number
  topBarActions?: React.ReactNode
  contentPaddingTop?: number
  contentPaddingBottom?: number
  contentPaddingX?: number
  verticalItemSpacing?: number
  wrapWithUnifiedBackground?: boolean
  fillContentWhenEmpty?: boolean
  contentScrollKey?: string | number | null
  contentAutoScrollToBottom?: boolean
  contentForceScrollToBottomSignal?: string | number | null
  contentPreserveScrollAnchorKey?: string | number | null
  contentTrailingSpacerHeight?: number
  onContentScroll?: (event: React.UIEvent<HTMLElement>) => void
}) {
  const bodyRef = React.useRef<HTMLElement | null>(null)
  const preserveScrollAnchorRef = React.useRef<{
    key: string | number | null
    scrollHeight: number
    scrollTop: number
  } | null>(null)
  const isChatThreadScreen = typeof className === 'string' && className.includes('ndjc-chat-thread-screen')

  function animateScrollBodyToBottom(
    body: HTMLElement,
    durationMs = 260
  ): () => void {
    let cancelled = false
    let frameId: number | null = null

    const startTop = body.scrollTop
    const targetTop = Math.max(0, body.scrollHeight - body.clientHeight)
    const distance = targetTop - startTop

    if (Math.abs(distance) <= 1) {
      body.scrollTop = targetTop
      return () => {
        cancelled = true
      }
    }

    const startTime = window.performance.now()

    const easeOutCubic = (value: number) => {
      return 1 - Math.pow(1 - value, 3)
    }

    const step = (now: number) => {
      if (cancelled) return

      const progress = Math.min(1, Math.max(0, (now - startTime) / durationMs))
      const eased = easeOutCubic(progress)
      body.scrollTop = startTop + distance * eased

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step)
        return
      }

      body.scrollTop = Math.max(0, body.scrollHeight - body.clientHeight)
    }

    frameId = window.requestAnimationFrame(step)

    return () => {
      cancelled = true

      if (frameId != null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }

React.useLayoutEffect(() => {
  const body = bodyRef.current
  if (!body || contentPreserveScrollAnchorKey == null) return

  const previous = preserveScrollAnchorRef.current
  const nextScrollHeight = body.scrollHeight

  if (
    previous &&
    previous.key !== contentPreserveScrollAnchorKey &&
    previous.scrollTop <= 120
  ) {
    const heightDelta = nextScrollHeight - previous.scrollHeight

    if (heightDelta > 0) {
      body.scrollTop = previous.scrollTop + heightDelta
    }
  }

  preserveScrollAnchorRef.current = {
    key: contentPreserveScrollAnchorKey,
    scrollHeight: body.scrollHeight,
    scrollTop: body.scrollTop
  }
}, [contentPreserveScrollAnchorKey, children])

React.useLayoutEffect(() => {
  if (contentScrollKey == null || !contentAutoScrollToBottom) return

  const body = bodyRef.current
  if (!body) return

  let cancelled = false
  let activeCancelScroll: (() => void) | null = null
  let firstTimeoutId: number | null = null
  let secondTimeoutId: number | null = null

  const scrollToBottom = (durationMs = 220) => {
    if (cancelled) return

    if (activeCancelScroll) {
      activeCancelScroll()
      activeCancelScroll = null
    }

    activeCancelScroll = animateScrollBodyToBottom(body, durationMs)
  }

  const scheduleScrollToBottom = () => {
    scrollToBottom(220)

    if (firstTimeoutId == null) {
      firstTimeoutId = window.setTimeout(() => {
        firstTimeoutId = null
        scrollToBottom(180)
      }, 80)
    }

    if (secondTimeoutId == null) {
      secondTimeoutId = window.setTimeout(() => {
        secondTimeoutId = null
        scrollToBottom(160)
      }, 180)
    }
  }

  scheduleScrollToBottom()

  window.addEventListener('ndjc:keyboard-viewport-change', scheduleScrollToBottom)

  return () => {
    cancelled = true

    if (activeCancelScroll) {
      activeCancelScroll()
      activeCancelScroll = null
    }

    if (firstTimeoutId != null) {
      window.clearTimeout(firstTimeoutId)
    }

    if (secondTimeoutId != null) {
      window.clearTimeout(secondTimeoutId)
    }

    window.removeEventListener('ndjc:keyboard-viewport-change', scheduleScrollToBottom)
  }
}, [contentScrollKey, contentAutoScrollToBottom])

React.useLayoutEffect(() => {
  if (!contentForceScrollToBottomSignal) return

  const body = bodyRef.current
  if (!body) return

  let cancelled = false
  let activeCancelScroll: (() => void) | null = null
  let firstTimeoutId: number | null = null
  let secondTimeoutId: number | null = null
  let thirdTimeoutId: number | null = null

  const scrollToBottom = (durationMs = 300) => {
    if (cancelled) return

    if (activeCancelScroll) {
      activeCancelScroll()
      activeCancelScroll = null
    }

    activeCancelScroll = animateScrollBodyToBottom(body, durationMs)
  }

  scrollToBottom(300)

  firstTimeoutId = window.setTimeout(() => {
    firstTimeoutId = null
    scrollToBottom(240)
  }, 90)

  secondTimeoutId = window.setTimeout(() => {
    secondTimeoutId = null
    scrollToBottom(200)
  }, 210)

  thirdTimeoutId = window.setTimeout(() => {
    thirdTimeoutId = null
    body.scrollTop = Math.max(0, body.scrollHeight - body.clientHeight)
  }, 380)

  return () => {
    cancelled = true

    if (activeCancelScroll) {
      activeCancelScroll()
      activeCancelScroll = null
    }

    if (firstTimeoutId != null) {
      window.clearTimeout(firstTimeoutId)
    }

    if (secondTimeoutId != null) {
      window.clearTimeout(secondTimeoutId)
    }

    if (thirdTimeoutId != null) {
      window.clearTimeout(thirdTimeoutId)
    }
  }
}, [contentForceScrollToBottomSignal])

const content = (
  <section
    className={cx('ndjc-conversation-page-scaffold', className)}
    style={{
      width: '100%',
      height: isChatThreadScreen ? 'var(--ndjc-stable-viewport-height, 100dvh)' : '100%',
      minHeight: 0,
      maxHeight: isChatThreadScreen ? 'var(--ndjc-stable-viewport-height, 100dvh)' : undefined,
      display: 'grid',
      gridTemplateRows: `${showTopBar ? 'auto ' : ''}minmax(0, 1fr) auto`,
      background: APK_CHAT_UI.pageBg,
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}
  >
      {isChatThreadScreen ? <NdjcChatKeyboardDebugPanel /> : null}

      {showTopBar ? (
        <section
          className="ndjc-conversation-top-surface"
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: 'env(safe-area-inset-top)',
            background: APK_CHAT_UI.pageBg,
            boxShadow: 'none',
            boxSizing: 'border-box'
          }}
        >
          <nav
            className="ndjc-conversation-top-bar"
            style={{
              width: '100%',
              height: APK_CHAT_UI.headerHeight,
              padding: `${APK_CHAT_UI.headerTopPadding}px ${APK_CHAT_UI.headerPaddingX}px ${APK_CHAT_UI.headerBottomPadding}px`,
              display: 'grid',
              gridTemplateColumns: `${APK_SHELL_UI.backButtonSize}px minmax(0, 1fr) ${APK_SHELL_UI.backButtonSize}px`,
              alignItems: 'center',
              gap: APK_CHAT_UI.headerGap,
              boxSizing: 'border-box'
            }}
            aria-label="Conversation header"
          >
            <span
              style={{
                width: APK_SHELL_UI.backButtonSize,
                height: APK_SHELL_UI.backButtonSize,
                display: 'block'
              }}
              aria-hidden="true"
            />

            <div
              className="ndjc-conversation-title-block"
              style={{
                minWidth: 0,
                display: 'grid',
                gap: 1,
                textAlign: 'center'
              }}
            >
              {isSelectionMode ? (
                <h1
                  style={{
                    ...apkConversationTitleStyle,
                    color: APK_CHAT_UI.black85
                  }}
                >
                  Selected {selectedCount}
                </h1>
              ) : (
                <>
                  <h1
                    style={{
                      ...apkConversationTitleStyle,
                      color: APK_CHAT_UI.black85
                    }}
                  >
                    {title || 'Chat'}
                  </h1>

                  {subtitle?.trim() ? (
                    <p
                      style={{
                        ...apkConversationSubtitleStyle,
                        color: APK_CHAT_UI.black55
                      }}
                    >
                      {subtitle}
                    </p>
                  ) : null}
                </>
              )}
            </div>

            <div
              style={{
                width: APK_SHELL_UI.backButtonSize,
                minWidth: APK_SHELL_UI.backButtonSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 6
              }}
            >
              {topBarActions}
            </div>
          </nav>

          <div
            style={{
              width: '100%',
              height: 1,
              background: 'rgba(0, 0, 0, 0.10)'
            }}
            aria-hidden="true"
          />
        </section>
      ) : null}

      <section
        ref={bodyRef}
        className="ndjc-conversation-body"
        onScroll={onContentScroll}
        style={{
          minHeight: 0,
          padding: `0 ${contentPaddingX}px`,
          display: 'grid',
          overflowY: 'auto',
          overflowX: 'hidden',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0))',
          WebkitOverflowScrolling: 'touch',
          boxSizing: 'border-box',
          scrollBehavior: 'auto'
        }}
      >
        <section
          className="ndjc-conversation-lazy-content"
          style={{
            minHeight: '100%',
            height: fillContentWhenEmpty ? '100%' : undefined,
            padding: `${contentPaddingTop}px 0 ${contentPaddingBottom}px`,
            display: 'grid',
            alignContent: fillContentWhenEmpty ? 'stretch' : 'start',
            gridTemplateRows: fillContentWhenEmpty ? 'minmax(0, 1fr)' : undefined,
            gap: verticalItemSpacing,
            boxSizing: 'border-box'
          }}
        >
          {toolbar ? (
            <section
              className="ndjc-conversation-toolbar"
              style={{
                width: '100%',
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {toolbar}
            </section>
          ) : null}

          {children}

          {contentTrailingSpacerHeight > 0 ? (
            <span
              aria-hidden="true"
              style={{
                display: 'block',
                width: '100%',
                height: contentTrailingSpacerHeight,
                minHeight: contentTrailingSpacerHeight
              }}
            />
          ) : null}
        </section>
      </section>

      {footer ? (
        <section className="ndjc-conversation-footer">
          {footer}
        </section>
      ) : null}
    </section>
  )

  if (!wrapWithUnifiedBackground) {
    return content
  }

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome,
        iconOnly: true,
        iconTint: APK_SHELL_UI.brand
      }}
    >
      {content}
    </NdjcUnifiedBackground>
  )
}
function NdjcConversationTimePill({
  text
}: {
  text: string
}) {
  const cleanText = text.trim()
  if (!cleanText) return null

  return (
    <div
      className="ndjc-conversation-time-pill-wrap"
      style={{
        width: '100%',
        display: 'grid',
        placeItems: 'center',
        padding: `${APK_CHAT_UI.timePillWrapPaddingY}px 0`
      }}
    >
      <span
        className="ndjc-conversation-time-pill"
        style={{
          borderRadius: APK_CHAT_UI.timePillRadius,
          padding: `${APK_CHAT_UI.timePillPaddingY}px ${APK_CHAT_UI.timePillPaddingX}px`,
          color: APK_CHAT_UI.black55,
          background: 'rgba(255, 255, 255, 0.72)',
          fontSize: 11,
          lineHeight: 1,
          fontWeight: 500,
          whiteSpace: 'nowrap'
        }}
      >
        {cleanText}
      </span>
    </div>
  )
}

function NdjcProductCardBubble({
  product,
  available,
  onOpen
}: {
  product: ShowcaseChatProductShare
  available: boolean
  onOpen: (dishId: string) => void
}) {
  const cleanImageUrl = product.imageUrl?.trim() || null
  const cleanTitle = product.title?.trim() || 'Selected item'
  const cleanPrice = product.price?.trim() || ''
  const cleanOriginalPrice = product.originalPriceText?.trim() || null
  const cleanDiscountPrice = product.discountPriceText?.trim() || null

  return (
    <section
      className="ndjc-product-card-bubble"
      style={apkProductBubbleStyle}
    >
      <section style={apkChatProductCardShellStyle}>
        <NdjcLinkedCatalogItemCard
          title={cleanTitle}
          imageUrl={cleanImageUrl}
          price={cleanPrice}
          originalPrice={cleanOriginalPrice}
          discountPrice={cleanDiscountPrice}
          available={available}
          allowClickWhenUnavailable={false}
          onOpen={() => onOpen(product.dishId)}
          middle={
            <NdjcItemStatusBadgeRow
              recommended={product.isRecommended}
              hidden={false}
            />
          }
        />
      </section>
    </section>
  )
}

function ChatProductBubble({
  product,
  available,
  outgoing,
  selected,
  focused,
  matched,
  onOpen
}: {
  product: ShowcaseChatProductShare
  available: boolean
  outgoing?: boolean
  selected?: boolean
  focused?: boolean
  matched?: boolean
  onOpen: (dishId: string) => void
}) {
  return (
    <section
      className={cx(
        'ndjc-chat-product-bubble-frame',
        outgoing && 'is-outgoing',
        selected && 'is-selected',
        focused && 'is-focused',
        matched && 'is-matched'
      )}
      style={apkChatRichBubbleFrameStyle({
        outgoing,
        selected,
        focused,
        matched
      })}
    >
      <NdjcProductCardBubble
        product={product}
        available={available}
        onOpen={onOpen}
      />
    </section>
  )
}
function chatAppointmentShareToCard(appointment: ShowcaseChatAppointmentShare): ShowcaseAppointmentCard {
  return {
    id: appointment.appointmentId,
    customerName: appointment.customerName || 'Customer',
    customerContact: appointment.customerContact || '',
    serviceTitle: appointment.title || 'General appointment',
    preferredDate: appointment.preferredDate,
    preferredTime: appointment.preferredTime,
    note: appointment.note || '',
    statusLabel: appointment.statusLabel || 'Pending',
    createdAtText: appointment.createdAtText || '',
    imageUrl: appointment.imageUrl,
    sourceDishId: appointment.sourceDishId,
    priceText: appointment.priceText,
    originalPriceText: appointment.originalPriceText,
    discountPriceText: appointment.discountPriceText,
    categoryText: appointment.categoryText,
    isRecommended: false,
    itemAvailable: appointment.itemAvailable
  }
}

function appointmentShareSummaryText(appointment: ShowcaseChatAppointmentShare): string {
  const title = appointment.title?.trim() || 'General appointment'
  const timeText = appointmentListTimeText(appointment.preferredDate, appointment.preferredTime)

  return timeText ? `${title} · ${timeText}` : title
}

function NdjcAppointmentCardBubble({
  appointment,
  onOpen
}: {
  appointment: ShowcaseChatAppointmentShare
  onOpen: (appointment: ShowcaseChatAppointmentShare) => void
}) {
  const cleanImageUrl = appointment.imageUrl?.trim() || null
  const cleanTitle = appointment.title?.trim() || 'General appointment'
  const cleanStatus = appointment.statusLabel?.trim() || 'Pending'

  return (
    <section
      className="ndjc-appointment-card-bubble"
      style={apkProductBubbleStyle}
    >
      <section style={apkChatProductCardShellStyle}>
        <AppointmentCatalogItemCard
          title={cleanTitle}
          imageUrl={cleanImageUrl}
          priceTextValue={appointment.priceText}
          originalPriceTextValue={appointment.originalPriceText}
          discountPriceTextValue={appointment.discountPriceText}
          categoryText={null}
          itemAvailable={true}
          allowClickWhenUnavailable
          onOpen={() => onOpen(appointment)}
          bottom={
            <>
              <span
                style={{
                  color: APK_APPOINTMENT_UI.black75,
                  fontSize: APK_APPOINTMENT_UI.bodyMediumSize,
                  lineHeight: APK_APPOINTMENT_UI.bodyMediumLineHeight,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {appointmentListTimeText(appointment.preferredDate, appointment.preferredTime)}
              </span>

              <div style={{ height: 4 }} aria-hidden="true" />

              <NdjcPillBadge selected>
                {cleanStatus}
              </NdjcPillBadge>
            </>
          }
        />
      </section>
    </section>
  )
}

function ChatAppointmentBubble({
  appointment,
  outgoing,
  selected,
  focused,
  matched,
  onOpen
}: {
  appointment: ShowcaseChatAppointmentShare
  outgoing?: boolean
  selected?: boolean
  focused?: boolean
  matched?: boolean
  onOpen: (appointment: ShowcaseChatAppointmentShare) => void
}) {
  return (
    <section
      className={cx(
        'ndjc-chat-appointment-bubble-frame',
        outgoing && 'is-outgoing',
        selected && 'is-selected',
        focused && 'is-focused',
        matched && 'is-matched'
      )}
      style={apkChatRichBubbleFrameStyle({
        outgoing,
        selected,
        focused,
        matched
      })}
    >
      <NdjcAppointmentCardBubble
        appointment={appointment}
        onOpen={onOpen}
      />
    </section>
  )
}

function NdjcPendingAppointmentBar({
  appointment,
  onOpen,
  onSend,
  onClear
}: {
  appointment: ShowcaseChatAppointmentShare
  onOpen: (appointment: ShowcaseChatAppointmentShare) => void
  onSend: () => void
  onClear: () => void
}) {
  const cleanImageUrl = appointment.imageUrl?.trim() || null
  const cleanTitle = appointment.title?.trim() || 'General appointment'
  const cleanStatus = appointment.statusLabel?.trim() || 'Pending'

  return (
    <section className="ndjc-pending-appointment-bar" style={apkPendingProductBarStyle}>
      <span style={apkPendingProductSideBarStyle} aria-hidden="true" />

      <section
        style={apkPendingProductPreviewCardStyle}
      >
        <AppointmentCatalogItemCard
          title={cleanTitle}
          imageUrl={cleanImageUrl}
          priceTextValue={null}
          categoryText={null}
          itemAvailable={appointment.itemAvailable && Boolean(appointment.sourceDishId)}
          allowClickWhenUnavailable
          onOpen={() => onOpen(appointment)}
          bottom={
            <>
              <span
                style={{
                  color: APK_APPOINTMENT_UI.black75,
                  fontSize: APK_APPOINTMENT_UI.bodyMediumSize,
                  lineHeight: APK_APPOINTMENT_UI.bodyMediumLineHeight,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {appointmentListTimeText(appointment.preferredDate, appointment.preferredTime)}
              </span>

              <div style={{ height: 4 }} aria-hidden="true" />

              <NdjcPillBadge selected>
                {cleanStatus}
              </NdjcPillBadge>
            </>
          }
        />
      </section>

      <section
        className="ndjc-pending-appointment-actions"
        style={apkPendingProductActionColumnStyle}
      >
        <button
          type="button"
          style={apkPendingProductIconButtonStyle('close')}
          onClick={onClear}
          aria-label="Cancel"
        >
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
            <path
              d="M18.3 5.71 12 12l6.3 6.29-1.41 1.41L10.59 13.41 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.3l6.3 6.29 6.3-6.29Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <button
          type="button"
          style={apkPendingProductIconButtonStyle('send')}
          onClick={onSend}
          aria-label="Send"
        >
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
            <path
              d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </section>
    </section>
  )
}
function NdjcChatSingleImageBubble({
  url,
  blurDataUrl,
  outgoing,
  shouldSuppressClick,
  onOpen
}: {
  url: string
  blurDataUrl?: string | null
  outgoing?: boolean
  shouldSuppressClick?: () => boolean
  onOpen: (url: string) => void
}) {
  return (
    <button
      type="button"
      className={cx('ndjc-chat-single-image-bubble', outgoing && 'is-outgoing')}
      style={{
        ...apkChatImageButtonBaseStyle,
        width: APK_CHAT_UI.singleImageWidth,
        height: APK_CHAT_UI.singleImageHeight
      }}
      onClick={event => {
        if (shouldSuppressClick?.()) {
          event.preventDefault()
          event.stopPropagation()
          return
        }

        onOpen(url)
      }}
    >
      <NdjcShimmerImage
        src={url}
        alt="Chat image"
        placeholderCornerRadius={APK_CHAT_UI.imageRadius}
        contentScale="cover"
        loading="lazy"
        fetchPriority="low"
        decoding="async"
        imageWidth={APK_CHAT_UI.singleImageWidth}
        imageHeight={APK_CHAT_UI.singleImageHeight}
        sizes="min(72vw, 260px)"
        blurDataUrl={blurDataUrl}
      />
    </button>
  )
}

function NdjcChatImageBubbleUi({
  url,
  onOpen
}: {
  url: string
  onOpen: (url: string) => void
}) {
  return (
    <button
      type="button"
      className="ndjc-chat-image-bubble-ui"
      style={{
        ...apkChatImageButtonBaseStyle,
        width: APK_CHAT_UI.gridImageSize,
        height: APK_CHAT_UI.gridImageSize
      }}
      onClick={() => onOpen(url)}
    >
      <NdjcShimmerImage
        src={url}
        alt="Chat image"
        placeholderCornerRadius={APK_CHAT_UI.imageRadius}
        contentScale="cover"
      />
    </button>
  )
}

function NdjcChatImagesGridUi({
  urls,
  previewUrls,
  blurDataUrls,
  outgoing,
  previewPool,
  shouldSuppressClick,
  onOpen
}: {
  urls: string[]
  previewUrls?: string[]
  blurDataUrls?: Array<string | null | undefined>
  outgoing?: boolean
  previewPool: string[]
  shouldSuppressClick?: () => boolean
  onOpen: (url: string, pool: string[]) => void
}) {
  const cleanUrls = urls.map(url => url.trim()).filter(Boolean)
  const cleanPreviewUrls = (previewUrls || []).map(url => url.trim()).filter(Boolean)
  const cleanPreviewPool = previewPool.map(url => url.trim()).filter(Boolean)
  if (!cleanUrls.length) return null

  return (
    <section
      className={cx('ndjc-chat-images-bubble-list', outgoing && 'is-outgoing')}
      style={{
        width: '100%',
        display: 'grid',
        justifyItems: outgoing ? 'end' : 'start',
        gap: 8
      }}
    >
      {cleanUrls.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className="ndjc-chat-image-bubble-row"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: outgoing ? 'flex-end' : 'flex-start',
            paddingTop: index === 0 ? 6 : 8,
            boxSizing: 'border-box'
          }}
        >
          <NdjcChatSingleImageBubble
            url={url}
            blurDataUrl={blurDataUrls?.[index] || null}
            outgoing={outgoing}
            shouldSuppressClick={shouldSuppressClick}
            onOpen={() => {
              const previewUrl = cleanPreviewUrls[index] || url
              const pool = cleanPreviewPool.length ? cleanPreviewPool : cleanPreviewUrls.length ? cleanPreviewUrls : cleanUrls
              onOpen(previewUrl, pool)
            }}
          />
        </div>
      ))}
    </section>
  )
}

function NdjcComposerTextQuoteBar({
  text,
  onClick,
  onCancel
}: {
  text: string
  onClick?: () => void
  onCancel: () => void
}) {
  const cleanText = text.trim()
  if (!cleanText) return null

  return (
    <section
      className="ndjc-composer-text-quote-bar"
      style={{
        width: '100%',
        paddingBottom: 10,
        boxSizing: 'border-box'
      }}
    >
      <section
        style={{
          width: '100%',
          minWidth: 0,
          padding: `8px 6px 8px ${APK_CHAT_UI.quotedBarPaddingX + APK_CHAT_UI.quoteRailWidth + APK_CHAT_UI.quoteRailGap}px`,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 32px',
          alignItems: 'stretch',
          color: APK_CHAT_UI.black,
          backgroundColor: APK_CHAT_UI.white,
          backgroundImage: `linear-gradient(to right, ${APK_CHAT_UI.brand} 0px, ${APK_CHAT_UI.brand} ${APK_CHAT_UI.quoteRailWidth}px, transparent ${APK_CHAT_UI.quoteRailWidth}px, transparent 100%)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${APK_CHAT_UI.quoteRailWidth}px calc(100% - 16px)`,
          backgroundPosition: `${APK_CHAT_UI.quotedBarPaddingX}px 8px`,
          border: '1px solid rgba(0, 0, 0, 0.18)',
          borderRadius: 12,
          boxSizing: 'border-box'
        }}
      >
        <button
          type="button"
          style={{
            minWidth: 0,
            alignSelf: 'center',
            border: 0,
            padding: 0,
            display: 'grid',
            gap: 2,
            textAlign: 'left',
            background: 'transparent',
            cursor: onClick ? 'pointer' : 'default'
          }}
          onClick={onClick}
          disabled={!onClick}
        >
          <span
            style={{
              color: APK_CHAT_UI.black55,
              fontSize: 11,
              lineHeight: 1.2,
              fontWeight: 500
            }}
          >
            Replying to
          </span>

          <strong
            style={{
              color: APK_CHAT_UI.black85,
              fontSize: 13,
              lineHeight: 1.25,
              fontWeight: 600,
              minWidth: 0,
              maxWidth: '100%',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word'
            }}
          >
            {cleanText}
          </strong>
        </button>

        <button
          type="button"
          style={{
            width: 32,
            height: 32,
            alignSelf: 'center',
            border: 0,
            borderRadius: 999,
            color: APK_CHAT_UI.black55,
            background: 'transparent',
            fontSize: 18,
            lineHeight: 1
          }}
          onClick={onCancel}
          aria-label="Cancel reply"
        >
          ×
        </button>
      </section>
    </section>
  )
}

function NdjcComposerProductQuoteBar({
  product,
  available,
  onClick,
  onCancel
}: {
  product: ShowcaseChatProductShare
  available: boolean
  onClick: () => void
  onCancel: () => void
}) {
  const cleanTitle = product.title?.trim() || 'Shared item'
  const cleanPrice = product.price?.trim() || ''
  const cleanOriginalPrice = product.originalPriceText?.trim() || null
  const cleanDiscountPrice = product.discountPriceText?.trim() || null
  const cleanImageUrl = product.imageUrl?.trim() || null

  return (
    <section
      className="ndjc-composer-product-quote-bar"
      style={{
        width: '100%',
        padding: '10px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 36px',
        gap: 8,
        alignItems: 'center',
        color: APK_CHAT_UI.black,
        background: APK_CHAT_UI.softSurface,
        borderRadius: 16,
        boxSizing: 'border-box'
      }}
    >
      <section
        style={{
          minWidth: 0,
          borderRadius: 14,
          overflow: 'hidden'
        }}
      >
        <NdjcLinkedCatalogItemCard
          title={cleanTitle}
          imageUrl={cleanImageUrl}
          price={cleanPrice}
          originalPrice={cleanOriginalPrice}
          discountPrice={cleanDiscountPrice}
          available={available}
          allowClickWhenUnavailable={false}
          onOpen={onClick}
          middle={
            <NdjcItemStatusBadgeRow
              recommended={product.isRecommended}
              hidden={false}
            />
          }
        />
      </section>

      <button
        type="button"
        style={{
          width: 36,
          height: 36,
          border: 0,
          borderRadius: 999,
          color: APK_CHAT_UI.black65,
          background: 'transparent',
          fontSize: 20,
          lineHeight: 1
        }}
        onClick={onCancel}
        aria-label="Cancel Quote"
      >
        ×
      </button>
    </section>
  )
}

function NdjcChatQuoteBlock({
  text,
  onClick
}: {
  text: string
  onClick?: () => void
}) {
  const cleanText = text.trim()
  if (!cleanText) return null

  return (
    <button
      type="button"
      className="ndjc-chat-quote-block"
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        border: 0,
        borderRadius: APK_CHAT_UI.quotedBarRadius,
        padding: 0,
        display: 'block',
        textAlign: 'left',
        color: APK_CHAT_UI.black,
        background: APK_CHAT_UI.white,
        cursor: onClick ? 'pointer' : 'default',
        boxSizing: 'border-box'
      }}
      onClick={onClick}
      disabled={!onClick}
    >
      <span
        style={{
          width: '100%',
          minWidth: 0,
          border: '1px solid rgba(0, 0, 0, 0.18)',
          borderRadius: APK_CHAT_UI.quotedBarRadius,
          padding: `${APK_CHAT_UI.quotedBarPaddingY}px ${APK_CHAT_UI.quotedBarPaddingX}px ${APK_CHAT_UI.quotedBarPaddingY}px ${APK_CHAT_UI.quotedBarPaddingX + APK_CHAT_UI.quoteRailWidth + APK_CHAT_UI.quoteRailGap}px`,
          display: 'flex',
          alignItems: 'stretch',
          color: APK_CHAT_UI.black,
          backgroundColor: APK_CHAT_UI.white,
          backgroundImage: `linear-gradient(to right, ${APK_CHAT_UI.brand} 0px, ${APK_CHAT_UI.brand} ${APK_CHAT_UI.quoteRailWidth}px, transparent ${APK_CHAT_UI.quoteRailWidth}px, transparent 100%)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${APK_CHAT_UI.quoteRailWidth}px calc(100% - ${APK_CHAT_UI.quotedBarPaddingY * 2}px)`,
          backgroundPosition: `${APK_CHAT_UI.quotedBarPaddingX}px ${APK_CHAT_UI.quotedBarPaddingY}px`,
          boxSizing: 'border-box'
        }}
      >
        <span
          style={{
            flex: '1 1 auto',
            minWidth: 0,
            maxWidth: '100%',
            display: 'grid',
            gap: 2
          }}
        >
          <span
            style={{
              color: APK_CHAT_UI.black55,
              fontSize: APK_CHAT_UI.quoteLabelSize,
              lineHeight: 1.2,
              fontWeight: 500
            }}
          >
            Replying to
          </span>

          <strong
            style={{
              color: APK_CHAT_UI.black70,
              fontSize: APK_CHAT_UI.quoteTextSize,
              lineHeight: 1.25,
              fontWeight: 600,
              minWidth: 0,
              maxWidth: '100%',
              display: 'block',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'anywhere',
              wordBreak: 'break-word'
            }}
          >
            {cleanText}
          </strong>
        </span>
      </span>
    </button>
  )
}

function NdjcChatQuotedProductBlock({
  product,
  available,
  onOpen
}: {
  product: ShowcaseChatProductShare
  available: boolean
  onOpen: (dishId: string) => void
}) {
  const cleanTitle = product.title?.trim() || 'Shared item'
  const cleanPrice = product.price?.trim() || ''
  const cleanOriginalPrice = product.originalPriceText?.trim() || null
  const cleanDiscountPrice = product.discountPriceText?.trim() || null
  const cleanImageUrl = product.imageUrl?.trim() || null

  return (
    <section
      className="ndjc-chat-quoted-product-block"
      style={{
        width: '100%',
        maxWidth: APK_CHAT_UI.productQuoteMaxWidth,
        border: '1px solid rgba(0, 0, 0, 0.18)',
        borderRadius: APK_CHAT_UI.productRadius,
        padding: 2,
        background: APK_CHAT_UI.white,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <NdjcLinkedCatalogItemCard
        title={cleanTitle}
        imageUrl={cleanImageUrl}
        price={cleanPrice}
        originalPrice={cleanOriginalPrice}
        discountPrice={cleanDiscountPrice}
        available={available}
        allowClickWhenUnavailable={false}
        onOpen={() => {
          if (available) {
            onOpen(product.dishId)
          }
        }}
        middle={
          <NdjcItemStatusBadgeRow
            recommended={product.isRecommended}
            hidden={false}
          />
        }
      />
    </section>
  )
}

function NdjcChatTextBubbleFrame({
  children,
  outgoing,
  selected,
  focused,
  matched
}: {
  children: React.ReactNode
  outgoing?: boolean
  selected?: boolean
  focused?: boolean
  matched?: boolean
}) {
  return (
    <div
      className="ndjc-chat-text-bubble"
      style={{
        ...apkChatTextBubbleStyle(
          outgoing,
          selected,
          focused,
          matched
        ),
        width: 'fit-content',
        minWidth: 0,
        maxWidth: '100%',
        display: 'grid',
        gap: APK_CHAT_UI.richBubblePadding,
        overflow: 'visible',
        boxSizing: 'border-box',
        justifySelf: outgoing ? 'end' : 'start'
      }}
    >
      {children}
    </div>
  )
}
function NdjcChatBodyText({
  body
}: {
  body: string
}) {
  const cleanBody = body.trim()
  if (!cleanBody) return null

  return (
    <p
      style={{
        ...apkChatTextStyle,
        width: 'auto',
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
        padding: `${APK_CHAT_UI.textBubblePaddingY}px ${APK_CHAT_UI.textBubblePaddingX}px`,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word'
      }}
    >
      {cleanBody}
    </p>
  )
}

function NdjcChatPlainTextBubble({
  body,
  outgoing,
  selected,
  focused,
  matched
}: {
  body: string
  outgoing?: boolean
  selected?: boolean
  focused?: boolean
  matched?: boolean
}) {
  const cleanBody = body.trim()
  if (!cleanBody) return null

  return (
    <NdjcChatTextBubbleFrame
      outgoing={outgoing}
      selected={selected}
      focused={focused}
      matched={matched}
    >
      <NdjcChatBodyText body={cleanBody} />
    </NdjcChatTextBubbleFrame>
  )
}

function NdjcChatTextQuoteBubble({
  body,
  quoteText,
  outgoing,
  selected,
  focused,
  matched,
  onJumpToQuote
}: {
  body: string
  quoteText: string
  outgoing?: boolean
  selected?: boolean
  focused?: boolean
  matched?: boolean
  onJumpToQuote: () => void
}) {
  const cleanBody = body.trim()
  const cleanQuoteText = quoteText.trim()

  if (!cleanBody && !cleanQuoteText) return null

  return (
    <NdjcChatTextBubbleFrame
      outgoing={outgoing}
      selected={selected}
      focused={focused}
      matched={matched}
    >
      <NdjcChatBodyText body={cleanBody} />

      {cleanQuoteText ? (
        <section
          className="ndjc-chat-quote-width-shell"
          style={{
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box'
          }}
        >
          <NdjcChatQuoteBlock
            text={cleanQuoteText}
            onClick={onJumpToQuote}
          />
        </section>
      ) : null}
    </NdjcChatTextBubbleFrame>
  )
}

function NdjcChatProductQuoteBubble({
  body,
  quoteProduct,
  outgoing,
  selected,
  focused,
  matched,
  isProductAvailable,
  onOpenProduct
}: {
  body: string
  quoteProduct: ShowcaseChatProductShare
  outgoing?: boolean
  selected?: boolean
  focused?: boolean
  matched?: boolean
  isProductAvailable?: (dishId: string) => boolean
  onOpenProduct: (dishId: string) => void
}) {
  const cleanBody = body.trim()

  return (
    <NdjcChatTextBubbleFrame
      outgoing={outgoing}
      selected={selected}
      focused={focused}
      matched={matched}
    >
      <NdjcChatBodyText body={cleanBody} />

<section
  className="ndjc-chat-product-quote-shell"
  style={{
    width: '100%',
    maxWidth: `min(100%, ${APK_CHAT_UI.productQuoteMaxWidth}px)`,
    minWidth: 0,
    boxSizing: 'border-box'
  }}
>
        <NdjcChatQuotedProductBlock
          product={quoteProduct}
          available={
            isProductAvailable
              ? isProductAvailable(quoteProduct.dishId)
              : true
          }
          onOpen={onOpenProduct}
        />
      </section>
    </NdjcChatTextBubbleFrame>
  )
}

function NdjcPendingProductBar({
  product,
  available,
  onOpen,
  onSend,
  onClear
}: {
  product: ShowcaseChatProductShare
  available: boolean
  onOpen: (dishId: string) => void
  onSend: () => void
  onClear: () => void
}) {
  const cleanImageUrl = product.imageUrl?.trim() || null
  const cleanTitle = product.title?.trim() || 'Selected item'
  const cleanPrice = product.price?.trim() || ''
  const cleanOriginalPrice = product.originalPriceText?.trim() || null
  const cleanDiscountPrice = product.discountPriceText?.trim() || null

  return (
    <section className="ndjc-pending-product-bar" style={apkPendingProductBarStyle}>
      <span style={apkPendingProductSideBarStyle} aria-hidden="true" />

      <section
        style={apkPendingProductPreviewCardStyle}
      >
        <NdjcLinkedCatalogItemCard
          title={cleanTitle}
          imageUrl={cleanImageUrl}
          price={cleanPrice}
          originalPrice={cleanOriginalPrice}
          discountPrice={cleanDiscountPrice}
          available={available}
          allowClickWhenUnavailable={false}
          onOpen={() => onOpen(product.dishId)}
          middle={
            <NdjcItemStatusBadgeRow
              recommended={product.isRecommended}
              hidden={false}
            />
          }
        />
      </section>

      <section
        className="ndjc-pending-product-actions"
        style={apkPendingProductActionColumnStyle}
      >
        <button
          type="button"
          style={apkPendingProductIconButtonStyle('close')}
          onClick={onClear}
          aria-label="Cancel"
        >
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
            <path
              d="M18.3 5.71 12 12l6.3 6.29-1.41 1.41L10.59 13.41 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.3l6.3 6.29 6.3-6.29Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <button
          type="button"
          style={{
            ...apkPendingProductIconButtonStyle('send'),
            opacity: available ? 1 : 0.45,
            cursor: available ? 'pointer' : 'not-allowed'
          }}
          disabled={!available}
          onClick={() => {
            if (available) {
              onSend()
            }
          }}
          aria-label="Send"
        >
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
            <path
              d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </section>
    </section>
  )
}



function ChatMessageBubble({
  message,
  actions,
  quotePreviewText,
  quoteProduct,
  imagePreviewPool,
  selectionMode,
  focused,
  matched,
  flashing,
  menuOpen,
  onOpenMenu,
  onCloseMenu,
  onOpenImagePreview,
  onOpenAppointmentDetail
}: {
  message: ShowcaseChatMessage
  actions: ShowcaseChatActions
  quotePreviewText: string
  quoteProduct: ShowcaseChatProductShare | null
  imagePreviewPool: string[]
  selectionMode: boolean
  focused?: boolean
  matched?: boolean
  flashing?: boolean
  menuOpen: boolean
  onOpenMenu: () => void
  onCloseMenu: () => void
  onOpenImagePreview: (url: string, pool: string[]) => void
  onOpenAppointmentDetail: (appointment: ShowcaseChatAppointmentShare) => void
}) {
  const articleRef = React.useRef<HTMLElement | null>(null)
  const longPressTimerRef = React.useRef<number | null>(null)
  const longPressReleaseTimerRef = React.useRef<number | null>(null)
  const pointerStartRef = React.useRef<{
    pointerId: number
    x: number
    y: number
  } | null>(null)
  const suppressClickUntilRef = React.useRef(0)
  const longPressTriggeredRef = React.useRef(false)
  const [menuPlacement, setMenuPlacement] = React.useState<NdjcChatMessageMenuPlacement>('below')

  const unavailable = Boolean(
    actions.isProductAvailable &&
    message.product &&
    !actions.isProductAvailable(message.product.dishId)
  )

  const isProductBubble = Boolean(message.product)
  const isAppointmentBubble = Boolean(message.appointment)
  const isImageOnlyBubble = Boolean(message.imageUrls.length && !message.body.trim() && !message.product && !message.appointment)

  function shouldSuppressClick(): boolean {
    return longPressTriggeredRef.current || Date.now() < suppressClickUntilRef.current
  }

  function suppressNextClick(): void {
    suppressClickUntilRef.current = Date.now() + 760
  }

  function estimateMessageMenuHeight(): number {
    const itemCount = isProductBubble || isAppointmentBubble || isImageOnlyBubble
      ? 1
      : message.body.trim()
        ? 2
        : 1

    return (
      APK_CHAT_UI.messageMenuPadding * 2 +
      APK_CHAT_UI.messageMenuItemHeight * itemCount +
      Math.max(0, itemCount - 1) * 2
    )
  }

  function updateMessageMenuPlacement(): void {
    const article = articleRef.current

    if (!article || typeof window === 'undefined') {
      setMenuPlacement('below')
      return
    }

    const stack = article.querySelector('.ndjc-chat-message-stack')
    const anchor = stack instanceof HTMLElement ? stack : article
    const anchorRect = anchor.getBoundingClientRect()
    const scrollBody = article.closest('.ndjc-conversation-body')
    const boundaryRect = scrollBody instanceof HTMLElement
      ? scrollBody.getBoundingClientRect()
      : null

    const boundaryTop = boundaryRect?.top ?? 0
    const boundaryBottom = boundaryRect?.bottom ?? window.innerHeight
    const menuHeight = estimateMessageMenuHeight()
    const menuGap = 4
    const safetyGap = 10
    const availableBelow = boundaryBottom - anchorRect.bottom
    const availableAbove = anchorRect.top - boundaryTop

    if (
      availableBelow < menuHeight + menuGap + safetyGap &&
      availableAbove > availableBelow
    ) {
      setMenuPlacement('above')
      return
    }

    setMenuPlacement('below')
  }

  function clearLongPressTimer() {
    if (longPressTimerRef.current != null) {
      window.clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  function clearLongPressReleaseTimer() {
    if (longPressReleaseTimerRef.current != null) {
      window.clearTimeout(longPressReleaseTimerRef.current)
      longPressReleaseTimerRef.current = null
    }
  }

  function openMessageMenu() {
    clearLongPressTimer()
    clearLongPressReleaseTimer()
    longPressTriggeredRef.current = true
    suppressNextClick()
    updateMessageMenuPlacement()
    onOpenMenu()
  }

  function closeMessageMenu() {
    clearLongPressTimer()
    onCloseMenu()
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return

    clearLongPressTimer()
    clearLongPressReleaseTimer()
    longPressTriggeredRef.current = false

    pointerStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY
    }

    longPressTimerRef.current = window.setTimeout(() => {
      openMessageMenu()
      longPressTimerRef.current = null
    }, 460)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const pointerStart = pointerStartRef.current
    if (!pointerStart || pointerStart.pointerId !== event.pointerId) return

    const deltaX = event.clientX - pointerStart.x
    const deltaY = event.clientY - pointerStart.y
    const distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY))

    if (distance > 10 && !longPressTriggeredRef.current) {
      clearLongPressTimer()
      pointerStartRef.current = null
    }
  }

  function handlePointerEnd() {
    clearLongPressTimer()
    pointerStartRef.current = null

    if (longPressTriggeredRef.current) {
      suppressNextClick()
      clearLongPressReleaseTimer()

      longPressReleaseTimerRef.current = window.setTimeout(() => {
        longPressTriggeredRef.current = false
        longPressReleaseTimerRef.current = null
      }, 780)
    }
  }

  function handleClickCapture(event: React.MouseEvent<HTMLElement>) {
    const target = event.target

    if (
      target instanceof Element &&
      target.closest('[data-ndjc-chat-message-menu="true"]')
    ) {
      return
    }

    if (!shouldSuppressClick()) return

    event.preventDefault()
    event.stopPropagation()
  }

  async function handleCopy() {
    const text = message.body.trim()

    await copyTextToClipboard(text)

    closeMessageMenu()
  }

  function handleQuote() {
    actions.onQuoteMessage(message.id)
    closeMessageMenu()
  }

  function handleSendAgain() {
    if (message.product) {
      actions.onUseProductCardAsPending(message.product)
      closeMessageMenu()
      return
    }

    if (message.appointment) {
      actions.onUseAppointmentCardAsPending(message.appointment)
      closeMessageMenu()
      return
    }

    if (message.imageUrls.length) {
      actions.onPickImages(message.imageUrls)
      closeMessageMenu()
      return
    }

    closeMessageMenu()
  }

  React.useEffect(() => {
    return () => {
      clearLongPressTimer()
      clearLongPressReleaseTimer()
    }
  }, [])

  const hasQuotedTextBlock = Boolean(message.quotedMessageId && !quoteProduct)
  const hasQuotedProductBlock = Boolean(message.quotedMessageId && quoteProduct)
  const hasTextOrQuoteBubble = Boolean(message.body || hasQuotedTextBlock || hasQuotedProductBlock)
  const isRichRetryBubble = Boolean(message.product || message.appointment)

  const shouldShowRetryButton = Boolean(
    message.outgoing &&
    (message.failed || NDJC_CHAT_RETRY_BUTTON_PREVIEW)
  )

  const messageBubbleContent = (
    <>
      {message.product ? (
        <ChatProductBubble
          product={message.product}
          available={!unavailable}
          outgoing={message.outgoing}
          selected={message.selected}
          focused={focused}
          matched={matched}
          onOpen={actions.onOpenProductDetail}
        />
      ) : null}

      {message.appointment ? (
        <ChatAppointmentBubble
          appointment={message.appointment}
          outgoing={message.outgoing}
          selected={message.selected}
          focused={focused}
          matched={matched}
          onOpen={onOpenAppointmentDetail}
        />
      ) : null}

      <NdjcChatImagesGridUi
        urls={
          selectShowcaseImageVariantList(message.imageVariants, 'chatThumb').length
            ? selectShowcaseImageVariantList(message.imageVariants, 'chatThumb')
            : selectChatImageUrls(message.imageUrls, 'chatThumb')
        }
        previewUrls={
          selectShowcaseImageVariantList(message.imageVariants, 'chatPreview').length
            ? selectShowcaseImageVariantList(message.imageVariants, 'chatPreview')
            : selectChatImageUrls(message.imageUrls, 'chatPreview')
        }
        blurDataUrls={(message.imageVariants || []).map(item => selectShowcaseImageBlurDataUrl(item))}
        outgoing={message.outgoing}
        previewPool={imagePreviewPool}
        shouldSuppressClick={shouldSuppressClick}
        onOpen={onOpenImagePreview}
      />

      {hasTextOrQuoteBubble ? (
        hasQuotedProductBlock && quoteProduct ? (
          <NdjcChatProductQuoteBubble
            body={message.body}
            quoteProduct={quoteProduct}
            outgoing={message.outgoing}
            selected={message.selected}
            focused={focused}
            matched={matched}
            isProductAvailable={actions.isProductAvailable}
            onOpenProduct={actions.onOpenProductDetail}
          />
        ) : hasQuotedTextBlock ? (
          <NdjcChatTextQuoteBubble
            body={message.body}
            quoteText={quotePreviewText || 'Quoted message'}
            outgoing={message.outgoing}
            selected={message.selected}
            focused={focused}
            matched={matched}
            onJumpToQuote={() => actions.onJumpToMessage(message.quotedMessageId || '')}
          />
        ) : (
          <NdjcChatPlainTextBubble
            body={message.body}
            outgoing={message.outgoing}
            selected={message.selected}
            focused={focused}
            matched={matched}
          />
        )
      ) : null}
    </>
  )

  return (
    <article
      ref={articleRef}
      id={`chat-message-${message.id}`}
      data-ndjc-chat-message-bubble="true"
      data-ndjc-chat-message-id={message.id}
      className={cx(
        'ndjc-chat-message-row',
        message.outgoing && 'is-outgoing',
        message.selected && 'is-selected',
        message.failed && 'is-failed',
        unavailable && 'is-unavailable',
        flashing && 'is-flashing'
      )}
      style={{
        ...apkChatMessageRowStyle(message.outgoing, message.selected, message.failed),
        animation: flashing ? 'ndjc-chat-message-flash 900ms ease-out 1' : undefined,
        borderRadius: APK_CHAT_UI.textBubbleRadius,
        willChange: flashing ? 'filter, transform' : undefined
      }}
      onContextMenu={event => {
        event.preventDefault()
        openMessageMenu()
      }}
      onDoubleClick={openMessageMenu}
      onClickCapture={handleClickCapture}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
    >
      <div
        className="ndjc-chat-message-content-row"
        style={apkChatMessageContentRowStyle(message.outgoing)}
      >
        <div
          className="ndjc-chat-message-stack"
          style={apkChatMessageStackStyle(message.outgoing, message.failed)}
        >
          {shouldShowRetryButton ? (
            isRichRetryBubble ? (
              <div
                className="ndjc-chat-rich-retry-bubble-host"
                style={apkChatRichRetryBubbleHostStyle()}
              >
                <button
                  type="button"
                  className="ndjc-chat-retry-button"
                  style={{
                    ...apkChatRetryButtonStyle(),
                    ...apkChatRichRetryButtonOverlayStyle()
                  }}
                  onClick={event => {
                    event.preventDefault()
                    event.stopPropagation()

                    if (message.failed) {
                      actions.onRetry(message.id)
                    }
                  }}
                  onPointerDown={event => {
                    event.stopPropagation()
                  }}
                  aria-label={message.failed ? 'Retry failed message' : 'Retry button preview'}
                  title={message.failed ? 'Retry' : 'Retry preview'}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                    style={apkChatRetryIconStyle}
                  >
                    <path
                      d="M18.2 7.8A7.4 7.4 0 0 0 12.4 5C8.3 5 5 8.3 5 12.4C5 16.5 8.3 19.8 12.4 19.8C15.3 19.8 17.9 18.1 19.1 15.5C19.3 15 19.1 14.4 18.6 14.2C18.1 14 17.5 14.2 17.3 14.7C16.4 16.6 14.5 17.8 12.4 17.8C9.4 17.8 7 15.4 7 12.4C7 9.4 9.4 7 12.4 7C13.9 7 15.3 7.6 16.3 8.7H14.3C13.7 8.7 13.3 9.1 13.3 9.7C13.3 10.3 13.7 10.7 14.3 10.7H19.2C19.8 10.7 20.2 10.3 20.2 9.7V4.8C20.2 4.2 19.8 3.8 19.2 3.8C18.6 3.8 18.2 4.2 18.2 4.8V7.8Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                {messageBubbleContent}
              </div>
            ) : (
              <div className="ndjc-chat-failed-bubble-row" style={apkChatFailedBubbleRowStyle()}>
                <button
                  type="button"
                  className="ndjc-chat-retry-button"
                  style={apkChatRetryButtonStyle()}
                  onClick={event => {
                    event.preventDefault()
                    event.stopPropagation()

                    if (message.failed) {
                      actions.onRetry(message.id)
                    }
                  }}
                  onPointerDown={event => {
                    event.stopPropagation()
                  }}
                  aria-label={message.failed ? 'Retry failed message' : 'Retry button preview'}
                  title={message.failed ? 'Retry' : 'Retry preview'}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                    style={apkChatRetryIconStyle}
                  >
                    <path
                      d="M18.2 7.8A7.4 7.4 0 0 0 12.4 5C8.3 5 5 8.3 5 12.4C5 16.5 8.3 19.8 12.4 19.8C15.3 19.8 17.9 18.1 19.1 15.5C19.3 15 19.1 14.4 18.6 14.2C18.1 14 17.5 14.2 17.3 14.7C16.4 16.6 14.5 17.8 12.4 17.8C9.4 17.8 7 15.4 7 12.4C7 9.4 9.4 7 12.4 7C13.9 7 15.3 7.6 16.3 8.7H14.3C13.7 8.7 13.3 9.1 13.3 9.7C13.3 10.3 13.7 10.7 14.3 10.7H19.2C19.8 10.7 20.2 10.3 20.2 9.7V4.8C20.2 4.2 19.8 3.8 19.2 3.8C18.6 3.8 18.2 4.2 18.2 4.8V7.8Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                <span
                  style={{
                    width: APK_CHAT_UI.retryButtonGap,
                    minWidth: APK_CHAT_UI.retryButtonGap
                  }}
                  aria-hidden="true"
                />

                <div
                  className="ndjc-chat-bubble-only-stack"
                  style={apkChatBubbleOnlyStackStyle(message.outgoing, false)}
                >
                  {messageBubbleContent}
                </div>
              </div>
            )
          ) : (
            messageBubbleContent
          )}

          {message.outgoing && message.statusText ? (
            <span className="ndjc-chat-message-status" style={apkChatTimeTextStyle}>
              {message.statusText}
            </span>
          ) : null}

          {menuOpen ? (
            <section
              data-ndjc-chat-message-menu="true"
              className="ndjc-chat-message-menu"
              style={apkChatMessageMenuStyle(message.outgoing, menuPlacement)}
              role="menu"
              onPointerDown={event => {
                event.stopPropagation()
              }}
              onPointerUp={event => {
                event.stopPropagation()
              }}
              onClick={event => {
                event.preventDefault()
                event.stopPropagation()
              }}
            >
              {isProductBubble || isAppointmentBubble || isImageOnlyBubble ? (
                <button
                  type="button"
                  style={apkChatMessageMenuItemStyle(false)}
                  onPointerDown={event => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleSendAgain()
                  }}
                  onClick={event => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  role="menuitem"
                >
                  Send again
                </button>
              ) : (
                <>
                  {message.body.trim() ? (
                    <button
                      type="button"
                      style={apkChatMessageMenuItemStyle(false)}
                      onPointerDown={event => {
                        event.preventDefault()
                        event.stopPropagation()
                        void handleCopy()
                      }}
                      onClick={event => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                      role="menuitem"
                    >
                      Copy
                    </button>
                  ) : null}

                  <button
                    type="button"
                    style={apkChatMessageMenuItemStyle(false)}
                    onPointerDown={event => {
                      event.preventDefault()
                      event.stopPropagation()
                      handleQuote()
                    }}
                    onClick={event => {
                      event.preventDefault()
                      event.stopPropagation()
                    }}
                    role="menuitem"
                  >
                    Quote
                  </button>
                </>
              )}
            </section>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function ChatFindBar({
  state,
  actions
}: {
  state: ShowcaseChatUiState
  actions: ShowcaseChatActions
}) {
  if (!state.findQuery && !state.findResultIds.length) return null

  return (
    <section className="ndjc-chat-find-bar" style={apkChatFindBarStyle}>
      <NdjcTextField
        value={state.findQuery}
        onChange={actions.onFindQueryChange}
        placeholder="Find in chat"
      />

      <NdjcChatToolButton label="Prev" icon="↑" onClick={actions.onFindPrev} />
      <NdjcChatToolButton label="Next" icon="↓" onClick={actions.onFindNext} />
      <NdjcChatToolButton label="Close" icon="×" onClick={actions.onCloseFind} />
    </section>
  )
}
function apkMerchantThreadMenuItemStyle(disabled = false): React.CSSProperties {
  return {
    width: '100%',
    minHeight: 44,
    border: 0,
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: disabled ? 'rgba(0, 0, 0, 0.34)' : 'rgba(0, 0, 0, 0.90)',
    background: APK_CHAT_UI.white,
    boxShadow: 'none',
    fontSize: 14,
    lineHeight: 1.35,
    fontWeight: 400,
    textAlign: 'left',
    cursor: disabled ? 'default' : 'pointer'
  }
}
function MerchantChatThreadRow({
  thread,
  actions,
  onRequestDelete,
  onRequestRename
}: {
  thread: ShowcaseChatThreadSummaryUi
  actions: ShowcaseMerchantChatListActions
  onRequestDelete: (threadId: string, title: string) => void
  onRequestRename: (threadId: string, title: string) => void
}) {
  const [menuExpanded, setMenuExpanded] = React.useState(false)
  const [pressed, setPressed] = React.useState(false)
  const longPressTimerRef = React.useRef<number | null>(null)
  const hasUnread = thread.unreadCount > 0
  const previewText = thread.lastMessage || 'No messages yet'

  function clearLongPressTimer(): void {
    if (longPressTimerRef.current == null) return

    window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = null
  }

  function openMenu(): void {
    clearLongPressTimer()
    setMenuExpanded(true)
  }

  function closeMenu(): void {
    clearLongPressTimer()
    setMenuExpanded(false)
  }

  function startLongPressTimer(): void {
    clearLongPressTimer()

    longPressTimerRef.current = window.setTimeout(() => {
      setMenuExpanded(true)
      longPressTimerRef.current = null
    }, 520)
  }

  React.useEffect(() => {
    return () => clearLongPressTimer()
  }, [])

  return (
    <section
      className={cx('ndjc-merchant-thread-row-wrap', thread.pinned && 'is-pinned', hasUnread && 'has-unread')}
      style={{
        position: 'relative',
        width: '100%',
        minWidth: 0
      }}
      onContextMenu={event => {
        event.preventDefault()
        openMenu()
      }}
    >
      <button
        type="button"
        className="ndjc-merchant-thread-row"
        style={{
          width: '100%',
          minWidth: 0,
          border: 0,
          borderRadius: APK_CHAT_UI.merchantRowRadius,
          padding: '12px 16px',
          display: 'grid',
          gridTemplateRows: 'auto auto',
          gap: 4,
          color: APK_CHAT_UI.black,
          background: APK_CHAT_UI.white,
          boxShadow: pressed ? APK_SHELL_UI.backButtonPressedShadow : '0 1px 1px rgba(0, 0, 0, 0.08)',
          textAlign: 'left',
          cursor: 'pointer',
          transform: pressed ? `scale(${APK_SHELL_UI.backButtonPressedScale})` : 'scale(1)',
          transformOrigin: 'center center',
          transition: `transform ${APK_SHELL_UI.backButtonPressedDurationMs}ms ease, box-shadow ${APK_SHELL_UI.backButtonPressedDurationMs}ms ease`,
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation'
        }}
        onPointerDown={() => {
          setPressed(true)
          startLongPressTimer()
        }}
        onPointerUp={() => {
          setPressed(false)
          clearLongPressTimer()
        }}
        onPointerCancel={() => {
          setPressed(false)
          clearLongPressTimer()
        }}
        onPointerLeave={() => {
          setPressed(false)
          clearLongPressTimer()
        }}
        onClick={() => {
          setPressed(false)

          if (menuExpanded) {
            closeMenu()
            return
          }

          actions.onOpenThread(thread.conversationId, thread.title)
        }}
      >
        <section
          className="ndjc-merchant-thread-title-row"
          style={{
            width: '100%',
            minWidth: 0,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            alignItems: 'center',
            gap: 12
          }}
        >
          <section
            style={{
              minWidth: 0,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'rgba(0, 0, 0, 0.90)',
                fontSize: 16,
                lineHeight: 1.35,
                fontWeight: hasUnread ? 700 : 600
              }}
            >
              {thread.title}
            </span>

            {thread.pinned ? (
              <>
                <span style={{ width: 8, flexShrink: 0 }} />

                <span
                  aria-label="Pinned"
                  title="Pinned"
                  style={{
                    width: 14,
                    height: 14,
                    flexShrink: 0,
                    display: 'inline-grid',
                    placeItems: 'center',
                    color: 'rgba(0, 0, 0, 0.62)',
                    fontSize: 13,
                    lineHeight: 1
                  }}
                >
                  📌
                </span>
              </>
            ) : null}
          </section>

          <span
            style={{
              color: hasUnread ? 'rgba(0, 0, 0, 0.70)' : 'rgba(0, 0, 0, 0.62)',
              fontSize: 11,
              lineHeight: 1.35,
              fontWeight: hasUnread ? 600 : 400,
              whiteSpace: 'nowrap'
            }}
          >
            {thread.lastMessageAtText}
          </span>
        </section>

        <section
          className="ndjc-merchant-thread-preview-row"
          style={{
            width: '100%',
            minWidth: 0,
            display: 'grid',
            gridTemplateColumns: hasUnread ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr)',
            alignItems: 'center',
            gap: hasUnread ? 10 : 0
          }}
        >
          <span
            style={{
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: hasUnread ? 'rgba(0, 0, 0, 0.70)' : 'rgba(0, 0, 0, 0.62)',
              fontSize: 12,
              lineHeight: 1.45,
              fontWeight: hasUnread ? 600 : 400
            }}
          >
            {previewText}
          </span>

          {hasUnread ? (
            <span
              className="ndjc-merchant-thread-unread"
              style={{
                minWidth: 22,
                height: 22,
                borderRadius: 999,
                padding: '0 8px',
                boxSizing: 'border-box',
                display: 'inline-grid',
                placeItems: 'center',
                color: APK_CHAT_UI.white,
                background: APK_SHELL_UI.brand,
                fontSize: 11,
                lineHeight: 1,
                fontWeight: 700
              }}
            >
              {thread.unreadCount}
            </span>
          ) : null}
        </section>
      </button>

      {menuExpanded ? (
        <>
          <button
            type="button"
            aria-label="Dismiss conversation menu"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 20,
              border: 0,
              padding: 0,
              background: 'transparent',
              cursor: 'default'
            }}
            onClick={closeMenu}
          />

          <section
            className="ndjc-merchant-thread-menu"
            style={{
              position: 'absolute',
              zIndex: 21,
              top: 38,
              right: 8,
              width: 220,
              borderRadius: 14,
              padding: '6px 0',
              display: 'grid',
              gap: 0,
              color: APK_CHAT_UI.black,
              background: APK_CHAT_UI.white,
              boxShadow: '0 10px 24px rgba(0, 0, 0, 0.18)',
              overflow: 'hidden'
            }}
            role="menu"
          >
            <button
              type="button"
              role="menuitem"
              style={apkMerchantThreadMenuItemStyle()}
              onClick={() => {
                closeMenu()
                onRequestDelete(thread.conversationId, thread.title)
              }}
            >
              Delete conversation
            </button>

            <button
              type="button"
              role="menuitem"
              style={apkMerchantThreadMenuItemStyle()}
              onClick={() => {
                closeMenu()
                onRequestRename(thread.conversationId, thread.title)
              }}
            >
              Rename
            </button>

            <button
              type="button"
              role="menuitem"
              style={apkMerchantThreadMenuItemStyle()}
              onClick={() => {
                closeMenu()
                actions.onTogglePin(thread.conversationId, !thread.pinned)
              }}
            >
              {thread.pinned ? 'Unpin' : 'Pin'}
            </button>
          </section>
        </>
      ) : null}
    </section>
  )
}

export function ShowcaseMerchantChatListScreen({
  threads,
  searchQuery,
  refreshing,
  pagination,
  actions
}: {
  threads: ShowcaseChatThreadSummaryUi[]
  searchQuery: string
  refreshing: boolean
  pagination: ShowcasePaginationUiState
  actions: ShowcaseMerchantChatListActions
}) {
  const [renameDialogOpen, setRenameDialogOpen] = React.useState(false)
  const [renameThreadId, setRenameThreadId] = React.useState<string | null>(null)
  const [renameText, setRenameText] = React.useState('')
  const [pendingDeleteThreadId, setPendingDeleteThreadId] = React.useState<string | null>(null)
  const [pendingDeleteThreadTitle, setPendingDeleteThreadTitle] = React.useState('')
  const [threadSubmittingAction, setThreadSubmittingAction] = React.useState<'rename' | 'delete' | null>(null)
  const headerRef = React.useRef<HTMLElement | null>(null)
  const [headerHeight, setHeaderHeight] = React.useState(0)

  React.useEffect(() => {
    const target = headerRef.current
    if (!target) return

    const updateHeight = () => {
      setHeaderHeight(target.getBoundingClientRect().height)
    }

    updateHeight()

    const observer = new ResizeObserver(updateHeight)
    observer.observe(target)

    return () => observer.disconnect()
  }, [])

  function openRenameDialog(threadId: string, title: string): void {
    setRenameThreadId(threadId)
    setRenameText(title)
    setRenameDialogOpen(true)
  }

  function closeRenameDialog(): void {
    if (threadSubmittingAction) return

    setRenameDialogOpen(false)
    setRenameThreadId(null)
    setRenameText('')
  }

  function requestDeleteThread(threadId: string, title: string): void {
    setPendingDeleteThreadId(threadId)
    setPendingDeleteThreadTitle(title)
  }

  function dismissDeleteThreadDialog(): void {
    if (threadSubmittingAction) return

    setPendingDeleteThreadId(null)
    setPendingDeleteThreadTitle('')
  }

  const visibleThreads = threads
  const queryIsBlank = searchQuery.trim().length === 0
  const headerTopPadding = APK_PAGE_SHELL_UI.topCardOffset
  const listTopPadding = headerTopPadding + headerHeight + 8

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-merchant-chat-list-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <NdjcAdminPullRefreshContainer
          refreshing={refreshing}
          onRefresh={actions.onRefresh}
        >
          <section
            className="ndjc-merchant-chat-list-scroll"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              width: '100%',
              height: '100%',
              minHeight: 0,
              padding: `${listTopPadding}px ${APK_PAGE_SHELL_UI.screenPadding}px ${APK_PAGE_SHELL_UI.screenPadding}px`,
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxSizing: 'border-box'
            }}
            onScroll={event => ndjcHandleLoadMoreScroll(
              event,
              pagination,
              actions.onLoadMore
            )}
          >
            {visibleThreads.length ? (
              <>
                {visibleThreads.map(thread => (
                  <MerchantChatThreadRow
                    key={thread.conversationId}
                    thread={thread}
                    actions={actions}
                    onRequestDelete={requestDeleteThread}
                    onRequestRename={openRenameDialog}
                  />
                ))}

                <NdjcPaginationFooter
                  pagination={pagination}
                  idleText="Load more"
                  loadingText="Loading more..."
                  endText="No more conversations"
                  onLoadMore={actions.onLoadMore}
                />
              </>
            ) : (
              <NdjcInlineEmptyState
                title={queryIsBlank ? 'No messages yet' : 'No results'}
                message={queryIsBlank
                  ? 'New conversations will appear here.'
                  : 'Try a different name.'}
                verticalPadding={0}
                fillParentMaxSize
              />
            )}
          </section>

          <NdjcTopScrollFadeMask
            className="ndjc-merchant-chat-header-scroll-mask"
            solidRatio={0.58}
            style={{
              zIndex: 2
            }}
          />

          <section
            ref={headerRef}
            className="ndjc-merchant-chat-header-wrap"
            style={{
              position: 'absolute',
              zIndex: 3,
              top: headerTopPadding,
              left: APK_PAGE_SHELL_UI.screenPadding,
              right: APK_PAGE_SHELL_UI.screenPadding,
              width: `calc(100% - ${APK_PAGE_SHELL_UI.screenPadding * 2}px)`,
              boxSizing: 'border-box'
            }}
          >
            <NdjcWhiteCard
              className="ndjc-merchant-chat-header-card"
              style={{
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <section
                className="ndjc-merchant-chat-header-column"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    color: '#000000',
                    fontSize: 24,
                    lineHeight: 1.25,
                    fontWeight: 600
                  }}
                >
                  Customer messages
                </h1>

                <p
                  style={{
                    margin: 0,
                    color: 'rgba(0, 0, 0, 0.70)',
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 400
                  }}
                >
                  Manage conversations
                </p>

                <NdjcAdminPageProgressSlot active={refreshing} />

                <NdjcTextField
                  value={searchQuery}
                  onChange={actions.onSearchQueryChange}
                  label="Search customers"
                  singleLine
                />
              </section>
            </NdjcWhiteCard>
          </section>
        </NdjcAdminPullRefreshContainer>

        {renameDialogOpen ? (
          <NdjcBaseDialog
            title="Rename conversation"
            confirmText="Save"
            dismissText="Cancel"
            confirmEnabled={renameText.trim().length > 0 && !threadSubmittingAction}
            confirmLoading={threadSubmittingAction === 'rename'}
            onConfirmClick={() => {
              const id = renameThreadId

              if (!id?.trim() || threadSubmittingAction) return

              setThreadSubmittingAction('rename')
              void Promise.resolve(actions.onRenameThread(id, renameText))
                .then(() => {
                  setRenameDialogOpen(false)
                  setRenameThreadId(null)
                  setRenameText('')
                })
                .finally(() => {
                  setThreadSubmittingAction(null)
                })
            }}
            onDismissClick={closeRenameDialog}
            onDismissRequest={closeRenameDialog}
            textContent={
              <NdjcTextField
                value={renameText}
                onChange={setRenameText}
                label="Name"
                singleLine
              />
            }
          />
        ) : null}

        {pendingDeleteThreadId ? (
          <NdjcBaseDialog
            title="Delete conversation?"
            message="This will remove this conversation from the list on this device and delete all local chat messages, local draft images, and local temporary files related to this conversation."
            confirmText="Delete"
            dismissText="Cancel"
            destructiveConfirm
            confirmEnabled={!threadSubmittingAction}
            confirmLoading={threadSubmittingAction === 'delete'}
            onConfirmClick={() => {
              const id = pendingDeleteThreadId

              if (!id.trim() || threadSubmittingAction) return

              setThreadSubmittingAction('delete')
              void Promise.resolve(actions.onDeleteThread(id))
                .then(() => {
                  setPendingDeleteThreadId(null)
                  setPendingDeleteThreadTitle('')
                })
                .finally(() => {
                  setThreadSubmittingAction(null)
                })
            }}
            onDismissClick={dismissDeleteThreadDialog}
            onDismissRequest={dismissDeleteThreadDialog}
          />
        ) : null}
      </section>
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseChatSearchResults({
  state,
  actions
}: {
  state: ShowcaseChatUiState
  actions: ShowcaseChatActions
}) {
  const results = state.searchResults
  const [pressedSearchResultKey, setPressedSearchResultKey] = React.useState<string | null>(null)

  const hint = state.findQuery.trim()
    ? `${results.length} result${results.length === 1 ? '' : 's'}`
    : 'Type a keyword to search your chat history'

  return (
    <NdjcUnifiedBackground
      className="ndjc-chat-search-results-screen"
      topNav={{
        onBack: actions.onCloseSearchResults,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-chat-search-results-content"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          minHeight: 0,
          padding: `${APK_PAGE_SHELL_UI.topCardOffset}px ${APK_PAGE_SHELL_UI.screenPadding}px ${APK_PAGE_SHELL_UI.screenPadding}px`,
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch'
        }}
        onScroll={event => ndjcHandleLoadMoreScroll(
          event,
          state.searchPagination,
          actions.onLoadMoreSearchResults
        )}
      >
        <NdjcTopScrollFadeMask
          className="ndjc-chat-search-results-scroll-mask"
          solidRatio={0.58}
          style={{
            zIndex: 2
          }}
        />

        <NdjcWhiteCard
          className="ndjc-chat-search-results-card"
          style={{
            position: 'relative',
            zIndex: 3,
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <section
            className="ndjc-chat-search-results-column"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <section
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12
              }}
            >
              <section
                style={{
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    color: '#000000',
                    fontSize: 24,
                    lineHeight: 1.25,
                    fontWeight: 600
                  }}
                >
                  Chat history
                </h1>

                <p
                  style={{
                    margin: 0,
                    color: 'rgba(0, 0, 0, 0.60)',
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 400
                  }}
                >
                  Search your conversation history
                </p>
              </section>
            </section>

            <section
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}
            >
              <NdjcTextField
                value={state.findQuery}
                onChange={actions.onFindQueryChange}
                label="Search messages"
                singleLine
              />

              <section
                style={{
                  width: '100%',
                  borderRadius: 12,
                  padding: '8px 12px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'rgba(0, 0, 0, 0.62)',
                  background: 'rgba(0, 0, 0, 0.045)'
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 18,
                    height: 18,
                    flexShrink: 0,
                    display: 'inline-grid',
                    placeItems: 'center',
                    color: 'rgba(0, 0, 0, 0.62)',
                    lineHeight: 1
                  }}
                >
                  <NdjcSearchOutlinedIcon />
                </span>

                <span
                  style={{
                    minWidth: 0,
                    color: 'rgba(0, 0, 0, 0.62)',
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {hint}
                </span>
              </section>
            </section>
          </section>
        </NdjcWhiteCard>

        {results.length ? (
          <section
            className="ndjc-chat-search-results-outside-list"
            style={{
              position: 'relative',
              zIndex: 3,
              width: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginTop: 8
            }}
          >
            {results.map(result => {
              const resultKey = `${result.conversationId}-${result.messageId || 'name'}-${result.createdAtText}`
              const pressed = pressedSearchResultKey === resultKey

              return (
                <section
                  key={resultKey}
                  className="ndjc-chat-search-result-row"
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    background: '#FFFFFF',
                    boxShadow: pressed ? APK_SHELL_UI.backButtonPressedShadow : '0 2px 8px rgba(0, 0, 0, 0.10)',
                    overflow: 'hidden',
                    transform: pressed ? `scale(${APK_SHELL_UI.backButtonPressedScale})` : 'scale(1)',
                    transformOrigin: 'center center',
                    transition: `transform ${APK_SHELL_UI.backButtonPressedDurationMs}ms ease, box-shadow ${APK_SHELL_UI.backButtonPressedDurationMs}ms ease`
                  }}
                >
                  <button
                    type="button"
                    style={{
                      width: '100%',
                      border: 0,
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      color: '#000000',
                      background: 'transparent',
                      boxShadow: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation'
                    }}
                    onPointerDown={() => {
                      setPressedSearchResultKey(resultKey)
                    }}
                    onPointerUp={() => {
                      setPressedSearchResultKey(null)
                    }}
                    onPointerCancel={() => {
                      setPressedSearchResultKey(null)
                    }}
                    onPointerLeave={() => {
                      setPressedSearchResultKey(null)
                    }}
                    onClick={() => {
                      setPressedSearchResultKey(null)
                      actions.onOpenThreadFromSearch(result.conversationId, result.messageId)
                    }}
                  >
                  <section
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 10
                    }}
                  >
                    <span
                      style={{
                        minWidth: 0,
                        color: 'rgba(0, 0, 0, 0.62)',
                        fontSize: 12,
                        lineHeight: 1.35,
                        fontWeight: 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {result.senderLabel}
                    </span>

                    <span
                      style={{
                        flexShrink: 0,
                        color: 'rgba(0, 0, 0, 0.62)',
                        fontSize: 12,
                        lineHeight: 1.35,
                        fontWeight: 400,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {result.createdAtText}
                    </span>
                  </section>

                  <div style={{ height: 6, flexShrink: 0 }} />

                  <p
                    style={{
                      margin: 0,
                      color: 'rgba(0, 0, 0, 0.62)',
                      fontSize: 14,
                      lineHeight: 1.45,
                      fontWeight: 400,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {highlightQueryText(result.snippet, state.findQuery)}
                  </p>
                  </button>
                </section>
              )
            })}
          </section>
        ) : null}

        {state.findQuery.trim() && !results.length && !state.searchPagination.isLoadingMore ? (
          <section
            className="ndjc-chat-search-results-empty-wrap"
            style={{
              position: 'relative',
              zIndex: 3,
              width: '100%',
              boxSizing: 'border-box',
              marginTop: 8
            }}
          >
            <NdjcInlineEmptyState
              title="No results found"
              message="Try a different keyword."
              verticalPadding={32}
            />
          </section>
        ) : null}

        {state.findQuery.trim() || results.length ? (
          <section
            className="ndjc-chat-search-results-pagination-wrap"
            style={{
              position: 'relative',
              zIndex: 3,
              width: '100%',
              boxSizing: 'border-box',
              marginTop: 8,
              paddingBottom: 12
            }}
          >
            <NdjcPaginationFooter
              pagination={state.searchPagination}
              idleText="Load more"
              loadingText="Loading more..."
              endText={results.length > 0 ? 'No more results' : ''}
              onLoadMore={actions.onLoadMoreSearchResults}
            />
          </section>
        ) : null}
      </section>
    </NdjcUnifiedBackground>
  )
}



function AdminDishRow({
  dish,
  selected,
  actions
}: {
  dish: DemoDish
  selected: boolean
  actions: ShowcaseAdminActions
}) {
  return (
    <NdjcCatalogItemCard
      dish={dish}
      selected={selected}
      onOpen={actions.onEditDish}
      metaText={`${dish.clickCount} views`}
      showCategory={false}
      trailing={
        <NdjcSelectionCheckbox
          checked={selected}
          onCheckedChange={() => actions.onToggleSelectDish(dish.id)}
        />
      }
    />
  )
}

export function ShowcaseChatThread({
  state,
  actions
}: {
  state: ShowcaseChatUiState
  actions: ShowcaseChatActions
}) {
  const [plusMenuExpanded, setPlusMenuExpanded] = React.useState(false)
  const [chatImagePreview, setChatImagePreview] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)
  const photoLibraryInputRef = React.useRef<HTMLInputElement | null>(null)
  const cameraInputRef = React.useRef<HTMLInputElement | null>(null)
  const plusMenuButtonRef = React.useRef<HTMLButtonElement | null>(null)
  const plusMenuPanelRef = React.useRef<HTMLElement | null>(null)
  const chatComposerTextareaRef = React.useRef<HTMLTextAreaElement | null>(null)
  const draftImageRowRef = React.useRef<HTMLElement | null>(null)
  const draftImageRowPointerRef = React.useRef<{
    pointerId: number
    startX: number
    startScrollLeft: number
    dragging: boolean
  } | null>(null)
  const draftImageClickSuppressUntilRef = React.useRef(0)
  const [activeFlashMessageId, setActiveFlashMessageId] = React.useState<string | null>(null)
  const [appointmentDetailsItem, setAppointmentDetailsItem] = React.useState<ShowcaseAppointmentCard | null>(null)
  const [activeMessageMenuId, setActiveMessageMenuId] = React.useState<string | null>(null)

  const closeAppointmentDetailsSheet = React.useCallback(() => {
    setAppointmentDetailsItem(null)
  }, [])

  const previewDraftImages = React.useMemo(() => {
    return Array.from(new Set(
      state.draftImageUrls
        .map(url => String(url || '').trim())
        .filter(Boolean)
    )).slice(0, 9)
  }, [state.draftImageUrls])

  const canSend = !state.isSending && Boolean(
    state.draft.trim() ||
    previewDraftImages.length ||
    state.pendingProduct ||
    state.pendingAppointment
  )

  const resizeChatComposerTextarea = React.useCallback((textarea: HTMLTextAreaElement) => {
    const minHeight = APK_CHAT_UI.inputMinHeight - APK_CHAT_UI.inputPaddingY * 2
    const maxHeight = APK_CHAT_UI.inputMaxHeight - APK_CHAT_UI.inputPaddingY * 2

    textarea.style.height = 'auto'

    const nextHeight = Math.max(
      minHeight,
      Math.min(textarea.scrollHeight, maxHeight)
    )

    textarea.style.height = `${nextHeight}px`
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [])

  React.useLayoutEffect(() => {
    const textarea = chatComposerTextareaRef.current
    if (!textarea) return

    resizeChatComposerTextarea(textarea)
  }, [resizeChatComposerTextarea, state.draft])

  React.useEffect(() => {
    if (!plusMenuExpanded) return
    if (typeof document === 'undefined') return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target instanceof Node ? event.target : null
      if (!target) return

      const button = plusMenuButtonRef.current
      const panel = plusMenuPanelRef.current

      if (button?.contains(target)) return
      if (panel?.contains(target)) return

      setPlusMenuExpanded(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPlusMenuExpanded(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [plusMenuExpanded])

  function openPhotoLibrary(): void {
    setPlusMenuExpanded(false)
    photoLibraryInputRef.current?.click()
  }

  function openCameraCapture(): void {
    setPlusMenuExpanded(false)
    cameraInputRef.current?.click()
  }

  function handlePhotoLibraryChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(event.currentTarget.files || [])
    event.currentTarget.value = ''
    setPlusMenuExpanded(false)

    if (!files.length) return

    actions.onPickImages(files)
  }

  function handleCameraCaptureChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.currentTarget.files?.[0] ?? null
    event.currentTarget.value = ''
    setPlusMenuExpanded(false)

    actions.onCameraCaptured(file)
  }

  function handleDraftImageRowPointerDown(event: React.PointerEvent<HTMLElement>): void {
    const row = draftImageRowRef.current
    if (!row) return

    draftImageRowPointerRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: row.scrollLeft,
      dragging: false
    }

    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function handleDraftImageRowPointerMove(event: React.PointerEvent<HTMLElement>): void {
    const row = draftImageRowRef.current
    const pointer = draftImageRowPointerRef.current

    if (!row || !pointer || pointer.pointerId !== event.pointerId) return

    const deltaX = event.clientX - pointer.startX

    if (Math.abs(deltaX) > 4) {
      pointer.dragging = true
      draftImageClickSuppressUntilRef.current = Date.now() + 220
    }

    if (!pointer.dragging) return

    event.preventDefault()
    row.scrollLeft = pointer.startScrollLeft - deltaX
  }

  function handleDraftImageRowPointerEnd(event: React.PointerEvent<HTMLElement>): void {
    const pointer = draftImageRowPointerRef.current

    if (!pointer || pointer.pointerId !== event.pointerId) {
      draftImageRowPointerRef.current = null
      return
    }

    const wasDragging = pointer.dragging

    if (wasDragging) {
      draftImageClickSuppressUntilRef.current = Date.now() + 220
      draftImageRowPointerRef.current = null
      return
    }

    const target = event.target instanceof HTMLElement ? event.target : null
    const previewTarget = target?.closest('[data-draft-image-preview-url]') as HTMLElement | null
    const previewUrl = previewTarget?.dataset.draftImagePreviewUrl || ''

    draftImageRowPointerRef.current = null

    if (!previewUrl) return

    openChatImagePreview(previewUrl, previewDraftImages)
  }

  function shouldSuppressDraftImageClick(): boolean {
    return Date.now() < draftImageClickSuppressUntilRef.current
  }

  function minuteKey(value: string) {
    return value.trim().replace(/\s+/g, ' ')
  }

  function timeHeaderText(value: string) {
    return value.trim().replace(/\s+/g, ' ')
  }

  const messageById = React.useMemo(() => {
    const map = new Map<string, ShowcaseChatMessage>()
    state.messages.forEach(message => {
      map.set(message.id, message)
    })
    return map
  }, [state.messages])

  const allThreadImageUrls = React.useMemo(() => {
    return Array.from(new Set(
      state.messages.flatMap(message => {
        const variantUrls = selectShowcaseImageVariantList(message.imageVariants, 'chatPreview')
        return variantUrls.length ? variantUrls : selectChatImageUrls(message.imageUrls, 'chatPreview')
      })
    ))
  }, [state.messages])

  function openChatImagePreview(urlInput: string, poolInput: string[]): void {
    const url = urlInput.trim()
    if (!url) return

    const pool = Array.from(new Set(
      (poolInput.length ? poolInput : [url])
        .map(item => item.trim())
        .filter(Boolean)
    ))

    const index = pool.indexOf(url)

    setChatImagePreview({
      images: pool.length ? pool : [url],
      startIndex: index >= 0 ? index : 0
    })
  }

  function openAppointmentShareDetails(appointment: ShowcaseChatAppointmentShare): void {
    setAppointmentDetailsItem(chatAppointmentShareToCard(appointment))
  }

  const [chatIsNearBottom, setChatIsNearBottom] = React.useState(true)

  const chatScrollKey = [
    state.messages[state.messages.length - 1]?.id || 'empty',
    previewDraftImages.length,
    state.pendingProduct?.dishId || 'no-product',
    state.pendingAppointment?.appointmentId || 'no-appointment',
    state.quotedMessageId || 'no-quote'
  ].join('|')

  const chatPreserveScrollAnchorKey = [
    state.messages[0]?.id || 'empty',
    state.messages.length
  ].join('|')

  const chatHasPendingMessageJump = Boolean(
    state.scrollToMessageId?.trim() &&
    state.scrollToMessageSignal
  )

  const chatShouldBlockAutoScrollToBottom = Boolean(
    state.windowMode === 'aroundMessage' ||
    chatHasPendingMessageJump
  )

  const chatShouldAutoScrollToBottom = Boolean(
    chatIsNearBottom &&
    !chatShouldBlockAutoScrollToBottom
  )

  function handleChatContentScroll(event: React.UIEvent<HTMLElement>): void {
    const element = event.currentTarget
    const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight
    const isNearBottom = distanceFromBottom <= 120

    setChatIsNearBottom(isNearBottom)

    ndjcHandleLoadOlderScroll(
      event,
      state.pagination,
      actions.onLoadOlderMessages
    )

    if (
      state.windowMode === 'aroundMessage' &&
      state.hasNewerMessages &&
      !state.isLoadingNewerMessages &&
      isNearBottom
    ) {
      void Promise.resolve(actions.onLoadNewerMessages())
    }
  }

  React.useLayoutEffect(() => {
    const targetId = state.scrollToMessageId?.trim()

    if (!targetId || !state.scrollToMessageSignal) return

    let cancelled = false

    const scrollToTarget = () => {
      if (cancelled) return

      const target = document.getElementById(`chat-message-${targetId}`)
      if (!target) return

      target.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'nearest'
      })
    }

    scrollToTarget()

    const frameId = window.requestAnimationFrame(() => {
      scrollToTarget()

      window.requestAnimationFrame(scrollToTarget)
    })

    const timeoutId = window.setTimeout(scrollToTarget, 120)

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
    }
  }, [state.scrollToMessageId, state.scrollToMessageSignal, state.messages.length])

  React.useEffect(() => {
    const targetId = state.flashMessageId?.trim()

    if (!targetId || !state.flashSignal) return

    setActiveFlashMessageId(targetId)

    const timeoutId = window.setTimeout(() => {
      setActiveFlashMessageId(current => current === targetId ? null : current)
    }, 950)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [state.flashMessageId, state.flashSignal])

  React.useEffect(() => {
    if (!activeMessageMenuId) return

    function handleDocumentPointerDown(event: PointerEvent): void {
      const target = event.target instanceof HTMLElement ? event.target : null
      if (!target) return

      if (target.closest('[data-ndjc-chat-message-menu="true"]')) return

      setActiveMessageMenuId(null)
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown, true)

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown, true)
    }
  }, [activeMessageMenuId])

  React.useEffect(() => {
    setActiveMessageMenuId(null)
  }, [
    state.messages.length,
    state.selectionMode,
    state.focusedMessageId,
    state.findQuery,
    state.scrollToMessageId
  ])

  function quoteProductFor(message: ShowcaseChatMessage): ShowcaseChatProductShare | null {
    const directQuotePreview = String(message.quotePreviewText || '').trim()
    const parsedQuoteProduct = directQuotePreview
      ? parseNdjcProductBlock(directQuotePreview)
      : null

    if (parsedQuoteProduct) {
      return chatProductShareFromParsedProduct(parsedQuoteProduct)
    }

    const quotedId = message.quotedMessageId?.trim()
    if (!quotedId) return null

    const quotedMessage = messageById.get(quotedId)
    if (!quotedMessage?.product) return null

    return quotedMessage.product
  }

  function quotePreviewFor(message: ShowcaseChatMessage): string {
    const directQuotePreview = String(message.quotePreviewText || '').trim()
    const directQuoteProduct = directQuotePreview
      ? parseNdjcProductBlock(directQuotePreview)
      : null

    if (directQuoteProduct) return directQuoteProduct.title || 'Shared item'
    if (directQuotePreview) return directQuotePreview

    const quotedId = message.quotedMessageId?.trim()
    if (!quotedId) return ''

    const quotedMessage = messageById.get(quotedId)
    if (!quotedMessage) return ''

    return quotePreviewTextFromMessage(quotedMessage)
  }

  function composerQuoteProduct(): ShowcaseChatProductShare | null {
    const quotedId = state.quotedMessageId?.trim()
    if (!quotedId) return null

    const quotedMessage = messageById.get(quotedId)
    if (!quotedMessage?.product) return null

    return quotedMessage.product
  }

  function composerQuotePreviewText(): string {
    const quotedId = state.quotedMessageId?.trim()
    if (!quotedId) return ''

    const quotedMessage = messageById.get(quotedId)
    if (!quotedMessage) return 'Selected message'

    return quotePreviewTextFromMessage(quotedMessage)
  }

  return (
    <NdjcUnifiedBackground
      className="ndjc-chat-keyboard-shell"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <NdjcConversationPageScaffold
        wrapWithUnifiedBackground={false}
        showTopBar
        title={state.title}
        subtitle={undefined}
        actions={actions}
        className="ndjc-chat-thread-screen"
        isSelectionMode={state.selectionMode}
        selectedCount={state.selectedMessageIds.length}
        contentPaddingTop={12}
        contentPaddingBottom={0}
        contentPaddingX={APK_CHAT_UI.bodyPaddingX}
        verticalItemSpacing={APK_CHAT_UI.messageRowGap}
        contentScrollKey={chatScrollKey}
        contentAutoScrollToBottom={chatShouldAutoScrollToBottom}
        contentForceScrollToBottomSignal={state.scrollToBottomSignal}
        contentPreserveScrollAnchorKey={chatPreserveScrollAnchorKey}
        contentTrailingSpacerHeight={APK_CHAT_UI.chatBubbleToDividerGap}
        onContentScroll={handleChatContentScroll}
        topBarActions={
          state.selectionMode ? (
            <>
              <button
                type="button"
                style={{
                  width: 34,
                  height: 34,
                  border: 0,
                  borderRadius: 999,
                  padding: 0,
                  display: 'grid',
                  placeItems: 'center',
                  color: APK_CHAT_UI.danger,
                  background: 'transparent',
                  boxShadow: 'none',
                  fontSize: 18,
                  lineHeight: 1
                }}
                onClick={actions.onDeleteSelected}
                aria-label="Delete Selected"
              >
                ×
              </button>

              <button
                type="button"
                style={{
                  width: 34,
                  height: 34,
                  border: 0,
                  borderRadius: 999,
                  padding: 0,
                  display: 'grid',
                  placeItems: 'center',
                  color: APK_CHAT_UI.black65,
                  background: 'transparent',
                  boxShadow: 'none',
                  fontSize: 18,
                  lineHeight: 1
                }}
                onClick={actions.onExitSelection}
                aria-label="Exit Selection"
              >
                ✕
              </button>
            </>
          ) : null
        }

        footer={
          <section
            className="ndjc-chat-composer-column"
            style={{
              width: '100%',
              minWidth: 0,
              padding: `${APK_CHAT_UI.composerTopPadding}px ${APK_CHAT_UI.footerPaddingX}px calc(${APK_CHAT_UI.composerBottomPadding}px + env(safe-area-inset-bottom))`,
              display: 'grid',
              gap: 8,
              background: APK_CHAT_UI.pageBg,
              borderTop: '1px solid rgba(0, 0, 0, 0.10)',
              boxSizing: 'border-box'
            }}
          >
          {state.selectionMode ? (
            <section
              className="ndjc-chat-selection-footer"
              style={{
                width: '100%',
                height: 52,
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <button
                type="button"
                style={{
                  width: 40,
                  height: 40,
                  border: 0,
                  borderRadius: 999,
                  padding: 0,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#ffffff',
                  background: APK_CHAT_UI.danger,
                  boxShadow: 'none',
                  fontSize: 18,
                  lineHeight: 1
                }}
                onClick={actions.onDeleteSelected}
                aria-label="Delete selected"
              >
                ×
              </button>
            </section>
          ) : (
            <>
              {state.quotedMessageId ? (
                composerQuoteProduct() ? (
                  <NdjcComposerProductQuoteBar
                    product={composerQuoteProduct() as ShowcaseChatProductShare}
                    available={
                      actions.isProductAvailable
                        ? actions.isProductAvailable((composerQuoteProduct() as ShowcaseChatProductShare).dishId)
                        : true
                    }
                    onCancel={actions.onCancelQuote}
                    onClick={() => {
                      const product = composerQuoteProduct()
                      if (product) {
                        actions.onOpenProductDetail(product.dishId)
                      }
                    }}
                  />
                ) : (
                  <NdjcComposerTextQuoteBar
                    text={composerQuotePreviewText()}
                    onCancel={actions.onCancelQuote}
                    onClick={() => actions.onJumpToMessage(state.quotedMessageId || '')}
                  />
                )
              ) : null}

              {previewDraftImages.length ? (
                <section
                  ref={draftImageRowRef}
                  className="ndjc-chat-draft-image-row"
                  style={{
                    width: '100%',
                    display: 'flex',
                    gap: 10,
                    paddingBottom: 10,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-x',
                    cursor: previewDraftImages.length > 1 ? 'grab' : 'default',
                    userSelect: 'none'
                  }}
                  onPointerDown={handleDraftImageRowPointerDown}
                  onPointerMove={handleDraftImageRowPointerMove}
                  onPointerUp={handleDraftImageRowPointerEnd}
                  onPointerCancel={handleDraftImageRowPointerEnd}
                  onPointerLeave={handleDraftImageRowPointerEnd}
                >
                  {previewDraftImages.map((url, index) => (
                    <span
                      key={`${url}-${index}`}
                      style={{
                        position: 'relative',
                        width: APK_CHAT_UI.draftPreviewSize,
                        minWidth: APK_CHAT_UI.draftPreviewSize,
                        height: APK_CHAT_UI.draftPreviewSize,
                        borderRadius: APK_CHAT_UI.draftPreviewCorner,
                        display: 'block',
                        overflow: 'hidden',
                        border: '1px solid rgba(0, 0, 0, 0.10)',
                        background: 'rgba(255, 255, 255, 0.92)',
                        boxShadow: 'none'
                      }}
                    >
                      <button
                        type="button"
                        data-draft-image-preview-url={url}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 0,
                          padding: 0,
                          display: 'block',
                          background: 'transparent',
                          boxShadow: 'none',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          if (shouldSuppressDraftImageClick()) return

                          openChatImagePreview(url, previewDraftImages)
                        }}
                        aria-label="Preview draft image"
                      >
                        <img
                          src={url}
                          alt="Draft image"
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'block',
                            objectFit: 'cover'
                          }}
                          draggable={false}
                        />
                      </button>

                      <button
                        type="button"
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          width: APK_CHAT_UI.draftPreviewRemoveButtonSize,
                          height: APK_CHAT_UI.draftPreviewRemoveButtonSize,
                          border: 0,
                          borderRadius: 999,
                          padding: 0,
                          display: 'grid',
                          placeItems: 'center',
                          color: APK_CHAT_UI.white,
                          background: 'rgba(0, 0, 0, 0.55)',
                          boxShadow: 'none',
                          fontSize: APK_CHAT_UI.draftPreviewRemoveIconSize,
                          lineHeight: 1,
                          cursor: 'pointer',
                          zIndex: 2
                        }}
                        onPointerDown={event => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                        onPointerUp={event => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                        onClick={event => {
                          event.preventDefault()
                          event.stopPropagation()
                          actions.onRemoveDraftImage(url)
                        }}
                        aria-label="Remove image"
                      >
                        ×
                      </button>

                      {previewDraftImages.length > 1 ? (
                        <span
                          style={{
                            position: 'absolute',
                            right: 4,
                            bottom: 4,
                            borderRadius: APK_CHAT_UI.draftPreviewCountRadius,
                            padding: `${APK_CHAT_UI.draftPreviewCountPaddingY}px ${APK_CHAT_UI.draftPreviewCountPaddingX}px`,
                            color: APK_CHAT_UI.white,
                            background: 'rgba(0, 0, 0, 0.45)',
                            fontSize: 11,
                            lineHeight: 1.2,
                            fontWeight: 500
                          }}
                        >
                          {index + 1}/{previewDraftImages.length}
                        </span>
                      ) : null}
                    </span>
                  ))}
                </section>
              ) : null}

              {state.pendingProduct ? (
                <NdjcPendingProductBar
                  product={state.pendingProduct}
                  available={actions.isProductAvailable(state.pendingProduct.dishId)}
                  onOpen={actions.onOpenProductDetail}
                  onSend={actions.onSendPendingProduct}
                  onClear={actions.onClearPendingProduct}
                />
              ) : null}

              {state.pendingAppointment ? (
                <NdjcPendingAppointmentBar
                  appointment={state.pendingAppointment}
                  onOpen={openAppointmentShareDetails}
                  onSend={actions.onSendPendingAppointment}
                  onClear={actions.onClearPendingAppointment}
                />
              ) : null}

              <section
                className="ndjc-chat-composer-row"
                style={{
                  position: 'relative',
                  width: '100%',
                  minWidth: 0,
                  display: 'grid',
                  gridTemplateColumns: `${APK_CHAT_UI.attachButtonSize}px minmax(0, 1fr) ${APK_CHAT_UI.toolButtonWidth}px`,
                  gap: 8,
                  alignItems: 'end',
                  boxSizing: 'border-box'
                }}
              >
                <input
                  ref={photoLibraryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handlePhotoLibraryChange}
                />

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={handleCameraCaptureChange}
                />

                <button
                  ref={plusMenuButtonRef}
                  type="button"
                  style={{
                    width: APK_CHAT_UI.attachButtonSize,
                    height: APK_CHAT_UI.attachButtonSize,
                    border: 0,
                    borderRadius: 999,
                    padding: 0,
                    display: 'grid',
                    placeItems: 'center',
                    color: APK_CHAT_UI.black65,
                    background: 'transparent',
                    boxShadow: 'none',
                    lineHeight: 1
                  }}
                  onClick={() => setPlusMenuExpanded(value => !value)}
                  aria-expanded={plusMenuExpanded}
                  aria-label="Attachments"
                >
                  <svg
                    width={APK_CHAT_UI.attachIconSize}
                    height={APK_CHAT_UI.attachIconSize}
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8.25 12.75L14.95 6.05C16.25 4.75 18.35 4.75 19.65 6.05C20.95 7.35 20.95 9.45 19.65 10.75L10.65 19.75C8.55 21.85 5.15 21.85 3.05 19.75C0.95 17.65 0.95 14.25 3.05 12.15L12.35 2.85"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {plusMenuExpanded ? (
                  <section
                    ref={plusMenuPanelRef}
                    className="ndjc-chat-plus-menu"
                    style={apkChatPlusMenuStyle}
                  >
                    {state.canTogglePinned ? (
                      <button
                        type="button"
                        style={apkChatPlusMenuItemStyle(false)}
                        onClick={() => {
                          setPlusMenuExpanded(false)
                          actions.onTogglePinned()
                        }}
                      >
                        {state.pinned ? 'Unpin chat' : 'Pin chat'}
                      </button>
                    ) : null}

                    <button
                      type="button"
                      style={apkChatPlusMenuItemStyle(false)}
                      onClick={() => {
                        setPlusMenuExpanded(false)
                        actions.onOpenMediaGallery()
                      }}
                    >
                      View photos
                    </button>

                    <button
                      type="button"
                      style={apkChatPlusMenuItemStyle(false)}
                      onClick={() => {
                        setPlusMenuExpanded(false)
                        actions.onOpenSearchResults()
                      }}
                    >
                      Search messages
                    </button>

                    <button
                      type="button"
                      style={apkChatPlusMenuItemStyle(false)}
                      onClick={() => {
                        openPhotoLibrary()
                      }}
                    >
                      Photo library
                    </button>

                    <button
                      type="button"
                      style={apkChatPlusMenuItemStyle(false)}
                      onClick={() => {
                        actions.onOpenCamera()
                        openCameraCapture()
                      }}
                    >
                      Camera
                    </button>
                  </section>
                ) : null}

                <span
                  className="ndjc-chat-input-surface"
                  style={apkChatInputShellStyle}
                >
                  <textarea
                    ref={chatComposerTextareaRef}
                    className="ndjc-chat-input"
                    style={apkChatTextareaStyle}
                    value={state.draft}
                    placeholder={state.inputPlaceholder || 'Message'}
                    onChange={event => {
                      resizeChatComposerTextarea(event.currentTarget)
                      actions.onDraftChange(event.currentTarget.value)
                    }}
                    rows={1}
                  />
                </span>

                <button
                  type="button"
                  style={{
                    width: APK_CHAT_UI.toolButtonWidth,
                    minWidth: APK_CHAT_UI.toolButtonWidth,
                    maxWidth: APK_CHAT_UI.toolButtonWidth,
                    height: APK_CHAT_UI.toolButtonHeight,
                    minHeight: APK_CHAT_UI.toolButtonHeight,
                    maxHeight: APK_CHAT_UI.toolButtonHeight,
                    border: 0,
                    borderRadius: APK_CHAT_UI.toolButtonRadius,
                    padding: 0,
                    margin: 0,
                    display: 'grid',
                    placeItems: 'center',
                    color: '#ffffff',
                    background: APK_FILTER_UI.chipSelectedBg,
                    boxShadow: canSend ? '0 2px 6px rgba(0, 0, 0, 0.10)' : 'none',
                    fontSize: 14,
                    lineHeight: 1,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    opacity: canSend ? 1 : 0.58,
                    cursor: canSend ? 'pointer' : 'not-allowed',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    appearance: 'none',
                    WebkitAppearance: 'none'
                  }}
                  disabled={!canSend}
                  onClick={() => {
                    if (!canSend) return
                    actions.onSend()
                  }}
                >
                  {state.isSending ? (
                    <NdjcSpinner size={16} stroke={2} tone="light" />
                  ) : (
                    <span
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'grid',
                        placeItems: 'center',
                        lineHeight: 1,
                        textAlign: 'center'
                      }}
                    >
                      Send
                    </span>
                  )}
                </button>
              </section>
            </>
          )}
        </section>
        }
      >
      <style>
        {`
          @keyframes ndjc-chat-message-flash {
            0% {
              filter: brightness(1);
              transform: scale(1);
            }
            18% {
              filter: brightness(1.08);
              transform: scale(1.018);
            }
            38% {
              filter: brightness(1);
              transform: scale(1);
            }
            58% {
              filter: brightness(1.08);
              transform: scale(1.014);
            }
            100% {
              filter: brightness(1);
              transform: scale(1);
            }
          }
        `}
      </style>

      <ChatFindBar state={state} actions={actions} />

      <NdjcPaginationFooter
        pagination={state.pagination}
        idleText="Load earlier messages"
        loadingText="Loading earlier messages..."
        endText=""
        onLoadMore={actions.onLoadOlderMessages}
      />

      {state.messages.length ? (
        state.messages.map((message, index) => {
          const currentKey = minuteKey(message.createdAtText)
          const previousKey = index > 0 ? minuteKey(state.messages[index - 1].createdAtText) : ''
          const showMinuteHeader = currentKey && currentKey !== previousKey

          return (
            <React.Fragment key={message.id}>
              {showMinuteHeader ? (
                <NdjcConversationTimePill text={timeHeaderText(message.createdAtText)} />
              ) : null}

              <ChatMessageBubble
                message={message}
                actions={actions}
                quotePreviewText={quotePreviewFor(message)}
                quoteProduct={quoteProductFor(message)}
                imagePreviewPool={allThreadImageUrls}
                selectionMode={state.selectionMode}
                focused={state.focusedMessageId === message.id}
                matched={state.findResultIds.includes(message.id)}
                flashing={activeFlashMessageId === message.id}
                menuOpen={activeMessageMenuId === message.id}
                onOpenMenu={() => setActiveMessageMenuId(message.id)}
                onCloseMenu={() => setActiveMessageMenuId(current => current === message.id ? null : current)}
                onOpenImagePreview={openChatImagePreview}
                onOpenAppointmentDetail={openAppointmentShareDetails}
              />
            </React.Fragment>
          )
        })
      ) : null}

      {state.windowMode === 'aroundMessage' ? (
        <NdjcPaginationFooter
          pagination={{
            hasMore: state.hasNewerMessages,
            isLoadingMore: state.isLoadingNewerMessages
          }}
          idleText="Load newer messages"
          loadingText="Loading newer messages..."
          endText=""
          onLoadMore={actions.onLoadNewerMessages}
        />
      ) : null}

      <NdjcSnackbarHost message={state.statusMessage?.trim() ? state.statusMessage : null} />

      {chatImagePreview ? (
        <NdjcFullscreenImageViewerScreen
          images={chatImagePreview.images}
          startIndex={chatImagePreview.startIndex}
          onDismiss={() => setChatImagePreview(null)}
          onSave={actions.onSavePreviewImage}
        />
      ) : null}

      <CustomerBookingDetailsBottomSheet
        item={appointmentDetailsItem}
        onClose={closeAppointmentDetailsSheet}
        onOpenProduct={actions.onOpenProductDetail}
      />
    </NdjcConversationPageScaffold>
  </NdjcUnifiedBackground>
  )
}

export function ShowcaseAppointmentsScreen({
  state,
  actions
}: {
  state: ShowcaseAppointmentsUiState
  actions: ShowcaseAppointmentsActions
}) {
  const [showSubmitConfirmDialog, setShowSubmitConfirmDialog] = React.useState(false)

  const confirmProductTitle = state.product?.title?.trim() || 'Selected item'
  const confirmTime = appointmentDetailTimeText(state.dateDraft, state.timeDraft)
  const confirmCustomer = state.nameDraft.trim() || 'Customer'
  const confirmContact = state.contactDraft.trim() || 'No contact provided'
  const confirmNote = state.noteDraft.trim()

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      {showSubmitConfirmDialog ? (
        <NdjcBaseDialog
          title="Confirm booking request"
          dismissText="Edit"
          confirmText="Confirm booking request"
          confirmEnabled={state.canSubmit && !state.isSubmitting}
          confirmLoading={state.isSubmitting}
          destructiveConfirm={false}
          onDismissRequest={() => {
            if (state.isSubmitting) return
            setShowSubmitConfirmDialog(false)
          }}
          onDismissClick={() => {
            if (state.isSubmitting) return
            setShowSubmitConfirmDialog(false)
          }}
          onConfirmClick={() => {
            if (state.isSubmitting) return

            void Promise.resolve(actions.onSubmit())
              .then(() => {
                setShowSubmitConfirmDialog(false)
              })
          }}
          textContent={
            <section
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: 'rgba(0, 0, 0, 0.70)',
                  fontSize: 14,
                  lineHeight: 1.45,
                  fontWeight: 400
                }}
              >
                Please review your booking details before sending this request.
              </p>

              <AppointmentSubmitConfirmInfo
                label="Booking for"
                value={confirmProductTitle}
              />

              <AppointmentSubmitConfirmInfo
                label="Time"
                value={confirmTime}
              />

              <AppointmentSubmitConfirmInfo
                label="Customer"
                value={confirmCustomer}
              />

              <AppointmentSubmitConfirmInfo
                label="Contact"
                value={confirmContact}
              />

              {confirmNote ? (
                <AppointmentSubmitConfirmInfo
                  label="Note"
                  value={confirmNote}
                />
              ) : null}
            </section>
          }
        />
      ) : null}

      <section
        className="ndjc-appointment-form-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <section
          className="ndjc-appointment-form-layer"
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            height: '100%',
            minHeight: 0,
            padding: `${APK_PAGE_SHELL_UI.topCardOffset}px ${APK_PAGE_SHELL_UI.screenPadding}px ${APK_PAGE_SHELL_UI.noBottomBarReserve}px`,
            boxSizing: 'border-box',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <NdjcWhiteCard
            className="ndjc-appointment-form-card"
            style={{
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <section
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}
            >
              <h1
                style={{
                  margin: 0,
                  color: APK_CORE_UI.black,
                  fontSize: 24,
                  lineHeight: 1.25,
                  fontWeight: 600
                }}
              >
                Book appointment
              </h1>

              <p
                style={{
                  margin: 0,
                  color: '#667085',
                  fontSize: 12,
                  lineHeight: 1.35,
                  fontWeight: 400
                }}
              >
                Send a booking request to the business. They can confirm or contact you later.
              </p>

              {!state.enabled ? (
                <section
                  style={{
                    width: '100%',
                    borderRadius: 16,
                    padding: 14,
                    boxSizing: 'border-box',
                    color: '#7A4E00',
                    background: '#FFF4E5'
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: '#7A4E00',
                      fontSize: 14,
                      lineHeight: 1.45,
                      fontWeight: 400
                    }}
                  >
                    Appointment booking is currently disabled.
                  </p>
                </section>
              ) : null}

              <AppointmentBookingProductSection
                product={state.product}
                enabled={state.enabled}
                onOpenProductDetail={actions.onOpenProductDetail}
              />

              <NdjcTextField
                value={state.nameDraft}
                onChange={actions.onNameChange}
                disabled={!state.enabled}
                label="Your name *"
                singleLine
              />

              <NdjcTextField
                value={state.contactDraft}
                onChange={actions.onContactChange}
                disabled={!state.enabled}
                label="Phone, email, or social account *"
                singleLine
              />

              <NdjcTextField
                value={state.noteDraft}
                onChange={actions.onNoteChange}
                disabled={!state.enabled}
                label="Optional note"
                singleLine={false}
              />

              {state.bookingRuleSummary?.trim() ? (
                <section
                  style={{
                    width: '100%',
                    borderRadius: 14,
                    padding: '10px 12px',
                    boxSizing: 'border-box',
                    color: '#667085',
                    background: '#F7F7FB'
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: '#667085',
                      fontSize: 12,
                      lineHeight: 1.35,
                      fontWeight: 400,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {state.bookingRuleSummary}
                  </p>
                </section>
              ) : null}

              <AppointmentCustomerDateRow
                title="Date"
                options={state.dateOptions}
                selected={state.dateDraft}
                enabled={state.enabled}
                onSelected={actions.onDateChange}
              />

              <AppointmentCustomerTimeGrid
                title="Time"
                options={state.timeOptions}
                selected={state.timeDraft}
                emptyText={state.dateDraft.trim()
                  ? 'No available times for this date.'
                  : 'Select an available date first.'}
                enabled={state.enabled && Boolean(state.dateDraft.trim())}
                onSelected={actions.onTimeChange}
              />

              {state.errorMessage ? (
                <p
                  style={{
                    margin: 0,
                    color: APK_CORE_UI.danger,
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 400
                  }}
                >
                  {state.errorMessage}
                </p>
              ) : null}

              {state.successMessage ? (
                <p
                  style={{
                    margin: 0,
                    color: '#027A48',
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 400
                  }}
                >
                  {state.successMessage}
                </p>
              ) : null}

              <AppointmentSubmitConfirmLine
                enabled={state.enabled}
                canSubmit={state.canSubmit}
                isSubmitting={state.isSubmitting}
                onSubmit={() => setShowSubmitConfirmDialog(true)}
              />
            </section>
          </NdjcWhiteCard>
        </section>
      </section>
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseAdmin({
  state,
  actions
}: {
  state: ShowcaseAdminUiState
  actions: ShowcaseAdminActions
}) {
  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-admin-screen"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <NdjcAdminPullRefreshContainer
        isRefreshing={state.syncOverviewState === 'Syncing'}
        onRefresh={actions.onRefresh}
      >
        <section
          className="ndjc-apk-admin-scroll-column"
          style={{
            width: '100%',
            height: '100%',
            minHeight: 0,
            overflowY: 'auto',
            padding: `${APK_PAGE_SHELL_UI.topCardOffset}px ${APK_PAGE_SHELL_UI.screenPadding}px ${APK_PAGE_SHELL_UI.noBottomBarReserve}px`,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <NdjcWhiteCard
            className="ndjc-apk-admin-root-card"
            style={{
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <section
              className="ndjc-apk-admin-card-column"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: APK_ADMIN_UI.cardGap
              }}
            >
              <section
                className="ndjc-admin-title-sync-block"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  flexShrink: 0
                }}
              >
                <AdminTitleText>
                  Admin
                </AdminTitleText>

                <NdjcAdminPageProgressSlot active={state.syncOverviewState === 'Syncing'} />

{state.syncOverviewState !== 'Syncing' && state.syncNoticeLabel ? (
  <AdminSyncNoticeText>
    {state.syncNoticeLabel}
  </AdminSyncNoticeText>
) : (
  <div style={{ height: 0, flexShrink: 0 }} aria-hidden="true" />
)}
              </section>

{state.cloudStatus ? (
  <>
    <div
      style={{
        height: 0,
        marginTop: -16,
        flexShrink: 0
      }}
      aria-hidden="true"
    />

    <section
      className="ndjc-apk-admin-section ndjc-apk-admin-cloud-section"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: APK_ADMIN_UI.cloudInnerGap
      }}
    >
                    <AdminCloudTitleText>
                      Cloud
                    </AdminCloudTitleText>

                    <p
                      style={{
                        margin: 0
                      }}
                    >
                      <AdminBodySmallText color={APK_ADMIN_UI.cloudPlanColor}>
                        {state.cloudStatus.planLabel} · {state.cloudStatus.storeId}
                      </AdminBodySmallText>
                    </p>

                    <div
                      className="ndjc-apk-admin-cloud-lines"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: APK_ADMIN_UI.cloudLineGap
                      }}
                    >
                      <AdminBodySmallText color={APK_ADMIN_UI.cloudStatusColor}>
                        {state.cloudStatus.statusLabel}
                      </AdminBodySmallText>

                      {state.cloudStatus.daysRemainingLabel ? (
                        <AdminTitleMediumText>
                          {state.cloudStatus.daysRemainingLabel}
                        </AdminTitleMediumText>
                      ) : null}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: APK_ADMIN_UI.cloudLineGap
                      }}
                    >
                      {state.cloudStatus.serviceEndAtLabel ? (
                        <AdminBodySmallText color={APK_ADMIN_UI.cloudDateColor}>
                          Expires · {state.cloudStatus.serviceEndAtLabel}
                        </AdminBodySmallText>
                      ) : null}

                      {state.cloudStatus.deleteAtLabel ? (
                        <AdminBodySmallText color={APK_ADMIN_UI.cloudDateColor}>
                          Deletes · {state.cloudStatus.deleteAtLabel}
                        </AdminBodySmallText>
                      ) : null}
                    </div>
                  </section>

                  <AdminSpacer height={APK_ADMIN_UI.spacer6} />
                  <SectionDivider />
                </>
              ) : null}

              <AdminSpacer height={APK_ADMIN_UI.spacer6} />

              <AdminSectionLabel>
                Quick action
              </AdminSectionLabel>

              <NdjcPrimaryActionButton onClick={actions.onAddNewDish}>
                Add Item
              </NdjcPrimaryActionButton>

              <AdminSpacer height={APK_ADMIN_UI.spacer6} />
              <SectionDivider />
              <AdminSpacer height={APK_ADMIN_UI.spacer6} />

              <AdminSectionLabel>
                Catalog
              </AdminSectionLabel>

              <NdjcPrimaryActionButton onClick={actions.onOpenItemsManager}>
                Items
              </NdjcPrimaryActionButton>

              <NdjcPrimaryActionButton onClick={actions.onOpenCategoriesManager}>
                Categories
              </NdjcPrimaryActionButton>

              <AdminSpacer height={APK_ADMIN_UI.spacer6} />
              <SectionDivider />
              <AdminSpacer height={APK_ADMIN_UI.spacer6} />

              <AdminSectionLabel>
                Store
              </AdminSectionLabel>

              <NdjcPrimaryActionButton onClick={actions.onOpenStoreProfile}>
                Store settings
              </NdjcPrimaryActionButton>

              <NdjcPrimaryActionButton onClick={actions.onOpenMerchantChatList}>
                {state.unreadMessageCount > 0
                  ? `Messages (${state.unreadMessageCount} unread)`
                  : 'Messages'}
              </NdjcPrimaryActionButton>

              <NdjcPrimaryActionButton onClick={actions.onOpenAnnouncementPublisher}>
                Announcements
              </NdjcPrimaryActionButton>

              <NdjcPrimaryActionButton onClick={actions.onOpenAppointmentManager}>
                {state.pendingAppointmentCount > 0
                  ? `Appointments (${state.pendingAppointmentCount} pending)`
                  : 'Appointments'}
              </NdjcPrimaryActionButton>

              <AdminSpacer height={APK_ADMIN_UI.spacer6} />
              <SectionDivider />
              <AdminSpacer height={APK_ADMIN_UI.spacer6} />

              <AdminSectionLabel>
                Account
              </AdminSectionLabel>

              <NdjcPrimaryActionButton onClick={actions.onOpenChangePassword}>
                Password
              </NdjcPrimaryActionButton>

              <NdjcPrimaryActionButton onClick={actions.onLogout}>
                Sign out
              </NdjcPrimaryActionButton>
            </section>
          </NdjcWhiteCard>

          {state.statusMessage ? (
            <>
              <AdminSpacer height={APK_ADMIN_UI.statusSpacer} />

              <AdminStatusMessageText>
                {state.statusMessage}
              </AdminStatusMessageText>
            </>
          ) : null}
        </section>
      </NdjcAdminPullRefreshContainer>
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseAdminItems({
  state,
  actions
}: {
  state: ShowcaseAdminUiState
  actions: ShowcaseAdminActions
}) {
  const [showItemsFilterSheet, setShowItemsFilterSheet] = React.useState(false)
  const [showDeleteSelectedConfirm, setShowDeleteSelectedConfirm] = React.useState(false)
  const [itemsDraftRecommended, setItemsDraftRecommended] = React.useState(state.filterRecommended)
  const [itemsDraftHiddenOnly, setItemsDraftHiddenOnly] = React.useState(state.filterHiddenOnly)
  const [itemsDraftDiscountOnly, setItemsDraftDiscountOnly] = React.useState(state.filterDiscountOnly)
  const [itemsDraftPriceMin, setItemsDraftPriceMin] = React.useState(state.priceMinDraft)
  const [itemsDraftPriceMax, setItemsDraftPriceMax] = React.useState(state.priceMaxDraft)
  const headerRef = React.useRef<HTMLElement | null>(null)
  const [headerHeight, setHeaderHeight] = React.useState(0)

  React.useEffect(() => {
    if (!showItemsFilterSheet) {
      setItemsDraftRecommended(state.filterRecommended)
      setItemsDraftHiddenOnly(state.filterHiddenOnly)
      setItemsDraftDiscountOnly(state.filterDiscountOnly)
      setItemsDraftPriceMin(state.priceMinDraft)
      setItemsDraftPriceMax(state.priceMaxDraft)
    }
  }, [showItemsFilterSheet, state.filterRecommended, state.filterHiddenOnly, state.filterDiscountOnly, state.priceMinDraft, state.priceMaxDraft])

  React.useEffect(() => {
    const element = headerRef.current
    if (!element) return

    const update = () => {
      setHeaderHeight(element.getBoundingClientRect().height)
    }

    update()

    if (typeof ResizeObserver === 'undefined') {
      window.setTimeout(update, 0)
      return
    }

    const observer = new ResizeObserver(update)
    observer.observe(element)

    return () => observer.disconnect()
  }, [
    state.itemsSearchQuery,
    state.itemsSortMode,
    state.filterRecommended,
    state.filterHiddenOnly,
    state.filterDiscountOnly,
    state.appliedMinPrice,
    state.appliedMaxPrice,
    state.selectedCategory,
    state.manualCategories.length,
    state.selectedDishIds.length,
    state.dishes.length,
    state.isLoading
  ])

  const selectedCount = state.selectedDishIds.length
  const singleSelectedDishTitle = selectedCount === 1
    ? state.dishes.find(dish => dish.id === state.selectedDishIds[0])?.title || ''
    : ''

  const defaultSelected = state.itemsSortMode === 'Default'
  const lowHighSelected = state.itemsSortMode === 'PriceAsc'
  const highLowSelected = state.itemsSortMode === 'PriceDesc'

  const filterActive =
    state.filterRecommended ||
    state.filterHiddenOnly ||
    state.filterDiscountOnly ||
    state.appliedMinPrice != null ||
    state.appliedMaxPrice != null

  const listTopPadding = APK_PAGE_SHELL_UI.topCardOffset + headerHeight + APK_SHOWCASE_ITEM_UI.adminItemsHeaderToListGap

  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-admin-items-screen"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-apk-admin-items-overlay-root"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <NdjcAdminPullRefreshContainer
          refreshing={state.isLoading}
          onRefresh={actions.onRefresh}
        >
          <section
            className="ndjc-apk-admin-items-list-layer"
            style={{
              position: 'absolute',
            inset: 0,
            overflowY: 'auto',
            padding: `${listTopPadding}px ${APK_PAGE_SHELL_UI.screenPadding}px ${APK_PAGE_SHELL_UI.noBottomBarReserve}px`,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: APK_SHOWCASE_ITEM_UI.adminItemsListGap
          }}
          onScroll={event => ndjcHandleLoadMoreScroll(
            event,
            state.itemsPagination,
            actions.onLoadMoreItems
          )}
        >
          {state.dishes.length ? (
            <>
              {state.dishes.map(dish => (
                <AdminDishRow
                  key={dish.id}
                  dish={dish}
                  selected={state.selectedDishIds.includes(dish.id)}
                  actions={actions}
                />
              ))}

              <NdjcPaginationFooter
                pagination={state.itemsPagination}
                idleText="Load more"
                loadingText="Loading more..."
                endText="No more items"
                onLoadMore={actions.onLoadMoreItems}
              />
            </>
          ) : (
            <NdjcInlineEmptyState
              title="No items yet"
              message="Add your first product from Admin → Add Item."
              verticalPadding={0}
              fillParentMaxSize
            />
          )}
        </section>

        <NdjcTopScrollFadeMask
          className="ndjc-apk-admin-items-header-scroll-mask"
          solidRatio={0.58}
          style={{
            zIndex: 2
          }}
        />

        <NdjcWhiteCard
          className="ndjc-apk-admin-items-header-card"
          style={{
            position: 'absolute',
            zIndex: 3,
            top: APK_PAGE_SHELL_UI.topCardOffset,
            left: APK_PAGE_SHELL_UI.screenPadding,
            right: APK_PAGE_SHELL_UI.screenPadding,
            width: `calc(100% - ${APK_PAGE_SHELL_UI.screenPadding * 2}px)`,
            boxSizing: 'border-box'
          }}
        >
          <section
            ref={headerRef}
            className="ndjc-apk-admin-items-header-column"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
          >
            <section
              className="ndjc-apk-admin-items-title-block"
              style={{
                width: '100%',
                display: 'grid',
                gap: 4
              }}
            >
              <h1
                style={{
                  margin: 0,
                  color: '#000000',
                  fontSize: 22,
                  lineHeight: 1.3,
                  fontWeight: 600
                }}
              >
                Items
              </h1>

              <p
                style={{
                  margin: 0,
                  color: 'rgba(0, 0, 0, 0.70)',
                  fontSize: 14,
                  lineHeight: 1.45,
                  fontWeight: 400
                }}
              >
                Manage your product catalog and visibility.
              </p>

              <p
                style={{
                  margin: 0,
                  color: 'rgba(0, 0, 0, 0.70)',
                  fontSize: 12,
                  lineHeight: 1.35,
                  fontWeight: 400
                }}
              >
                {state.dishes.length} items • Loaded locally
              </p>
            </section>

            <NdjcAdminPageProgressSlot active={state.isLoading} />

            <NdjcTextField
              value={state.itemsSearchQuery}
              onChange={actions.onItemsSearchQueryChange}
              label="Search items"
              singleLine
            />

            <SortRow columns={4}>
              <SortNavEqualItem
                text="Default"
                selected={defaultSelected}
                onClick={() => actions.onItemsSortModeChange('Default')}
              />

              <SortNavEqualItem
                text="Low–High"
                selected={lowHighSelected}
                onClick={() => actions.onItemsSortModeChange('PriceAsc')}
              />

              <SortNavEqualItem
                text="High–Low"
                selected={highLowSelected}
                onClick={() => actions.onItemsSortModeChange('PriceDesc')}
              />

              <SortNavEqualItem
                text="Filter"
                selected={filterActive}
                onClick={() => {
                  setItemsDraftRecommended(state.filterRecommended)
                  setItemsDraftHiddenOnly(state.filterHiddenOnly)
                  setItemsDraftDiscountOnly(state.filterDiscountOnly)
                  setItemsDraftPriceMin(state.priceMinDraft)
                  setItemsDraftPriceMax(state.priceMaxDraft)
                  setShowItemsFilterSheet(true)
                }}
              />
            </SortRow>

            <CategoryChipsRow
              selectedCategory={state.selectedCategory}
              manualCategories={state.manualCategories}
              onCategorySelected={actions.onSelectCategory}
              showAllChip
              useOuterHorizontalPadding={false}
            />

            <p
              style={{
                margin: 0,
                color: 'rgba(0, 0, 0, 0.70)',
                fontSize: 12,
                lineHeight: 1.35,
                fontWeight: 400
              }}
            >
              Select items to delete or clear selection.
            </p>

            <section
              className="ndjc-admin-items-bulk-row"
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 10
              }}
            >
              <NdjcPrimaryActionButton
                disabled={selectedCount <= 0}
                onClick={actions.onClearSelectedDishes}
              >
                Clear
              </NdjcPrimaryActionButton>

              <NdjcPrimaryActionButton
                disabled={selectedCount <= 0}
                onClick={() => setShowDeleteSelectedConfirm(true)}
              >
                Delete ({selectedCount})
              </NdjcPrimaryActionButton>
            </section>
          </section>
        </NdjcWhiteCard>
        </NdjcAdminPullRefreshContainer>
      </section>

      <NdjcFilterBottomSheet
        open={showItemsFilterSheet}
        title="Filter"
        priceMinDraft={itemsDraftPriceMin}
        onPriceMinDraftChange={setItemsDraftPriceMin}
        priceMaxDraft={itemsDraftPriceMax}
        onPriceMaxDraftChange={setItemsDraftPriceMax}
        showPriceFields
        onClose={() => {
          setItemsDraftRecommended(state.filterRecommended)
          setItemsDraftHiddenOnly(state.filterHiddenOnly)
          setItemsDraftDiscountOnly(state.filterDiscountOnly)
          setItemsDraftPriceMin(state.priceMinDraft)
          setItemsDraftPriceMax(state.priceMaxDraft)
          setShowItemsFilterSheet(false)
        }}
        onClear={() => {
          setItemsDraftRecommended(false)
          setItemsDraftHiddenOnly(false)
          setItemsDraftDiscountOnly(false)
          setItemsDraftPriceMin('')
          setItemsDraftPriceMax('')
        }}
        onApply={() => {
          actions.onApplyItemsFilters({
            recommendedOnly: itemsDraftRecommended,
            hiddenOnly: itemsDraftHiddenOnly,
            discountOnly: itemsDraftDiscountOnly,
            minPriceDraft: itemsDraftPriceMin,
            maxPriceDraft: itemsDraftPriceMax
          })
          setShowItemsFilterSheet(false)
        }}
      >
        <NdjcToggleRow
          label="Pick"
          checked={itemsDraftRecommended}
          onChange={setItemsDraftRecommended}
        />

        <NdjcToggleRow
          label="Hidden"
          checked={itemsDraftHiddenOnly}
          onChange={setItemsDraftHiddenOnly}
        />

        <NdjcToggleRow
          label="On sale"
          checked={itemsDraftDiscountOnly}
          onChange={setItemsDraftDiscountOnly}
        />
      </NdjcFilterBottomSheet>

      {showDeleteSelectedConfirm && selectedCount > 0 ? (
        <NdjcBaseDialog
          title={selectedCount === 1 ? 'Delete selected item?' : 'Delete selected items?'}
          message={selectedCount === 1 ? `This will permanently remove "${singleSelectedDishTitle}".` : `This will permanently remove ${selectedCount} selected items.`}
          confirmText="Delete"
          dismissText="Cancel"
          onConfirmClick={() => {
            setShowDeleteSelectedConfirm(false)
            actions.onDeleteSelectedDishes()
          }}
          onDismissClick={() => setShowDeleteSelectedConfirm(false)}
          onDismissRequest={() => setShowDeleteSelectedConfirm(false)}
          destructiveConfirm
        />
      ) : null}

      {state.pendingDeleteDishId ? (
        <DeleteConfirmDialog
          title="Delete item?"
          message="This item will be removed from the catalog."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={actions.onConfirmPendingDelete}
          onCancel={actions.onDismissPendingDelete}
        />
      ) : null}
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseAdminCategories({
  state,
  actions
}: {
  state: ShowcaseAdminUiState
  actions: ShowcaseAdminActions
}) {
  const [newCategory, setNewCategory] = React.useState('')
  const [selectedCategoryName, setSelectedCategoryName] = React.useState<string | null>(null)
  const [showRenameDialog, setShowRenameDialog] = React.useState(false)
  const [renameFrom, setRenameFrom] = React.useState<string | null>(null)
  const [renameTo, setRenameTo] = React.useState('')

  const sectionGap = 14
  const titleToHint = 4
  const hintToContent = 10
  const rowGap = 10
  const categorySubmittingAction = state.categorySubmittingAction
  const categorySubmitting = Boolean(categorySubmittingAction)

  function closeRenameDialog(): void {
    setShowRenameDialog(false)
    setRenameFrom(null)
    setRenameTo('')
  }

  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-admin-categories-screen"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-apk-admin-categories-box"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <NdjcAdminPullRefreshContainer
          refreshing={state.isLoading}
          onRefresh={actions.onRefresh}
        >
          <section
            className="ndjc-apk-admin-categories-scroll-column"
            style={{
              width: '100%',
            height: '100%',
            minHeight: 0,
            overflowY: 'auto',
            padding: `${APK_PAGE_SHELL_UI.topCardOffset}px ${APK_PAGE_SHELL_UI.screenPadding}px ${APK_PAGE_SHELL_UI.noBottomBarReserve}px`,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <NdjcWhiteCard
            className="ndjc-apk-admin-categories-root-card"
            style={{
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <section
              className="ndjc-apk-admin-categories-card-column"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <h1
                style={{
                  margin: 0,
                  color: '#000000',
                  fontSize: 24,
                  lineHeight: 1.25,
                  fontWeight: 600
                }}
              >
                Categories
              </h1>

              <div style={{ height: 6, flexShrink: 0 }} />

              <NdjcAdminPageProgressSlot active={state.isLoading} />

              <div style={{ height: sectionGap, flexShrink: 0 }} />

              <h2
                style={{
                  margin: 0,
                  color: 'rgba(0, 0, 0, 0.90)',
                  fontSize: 16,
                  lineHeight: 1.35,
                  fontWeight: 600
                }}
              >
                Create category
              </h2>

              <div style={{ height: titleToHint, flexShrink: 0 }} />

              <p
                style={{
                  margin: 0,
                  color: 'rgba(0, 0, 0, 0.55)',
                  fontSize: 12,
                  lineHeight: 1.35,
                  fontWeight: 400
                }}
              >
                Category names must be unique.
              </p>

              <div style={{ height: hintToContent, flexShrink: 0 }} />

              <NdjcTextField
                value={newCategory}
                onChange={setNewCategory}
                label="Category name"
                singleLine
              />

              <div style={{ height: 10, flexShrink: 0 }} />

              <section
                className="ndjc-apk-admin-categories-add-row"
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                  gap: rowGap
                }}
              >
                <span aria-hidden="true" />

                <NdjcPrimaryActionButton
                  disabled={!newCategory.trim() || categorySubmitting}
                  isLoading={categorySubmittingAction === 'add'}
                  onClick={() => {
                    if (categorySubmitting) return
                    actions.onAddCategory(newCategory)
                    setNewCategory('')
                  }}
                >
                  Add
                </NdjcPrimaryActionButton>
              </section>

              <div style={{ height: sectionGap, flexShrink: 0 }} />

              <h2
                style={{
                  margin: 0,
                  color: 'rgba(0, 0, 0, 0.90)',
                  fontSize: 16,
                  lineHeight: 1.35,
                  fontWeight: 600
                }}
              >
                Edit or delete categories
              </h2>

              <div style={{ height: titleToHint, flexShrink: 0 }} />

              <p
                style={{
                  margin: 0,
                  color: 'rgba(0, 0, 0, 0.55)',
                  fontSize: 12,
                  lineHeight: 1.35,
                  fontWeight: 400
                }}
              >
                {selectedCategoryName
                  ? `Selected: ${selectedCategoryName}`
                  : 'Select a category below to edit or delete.'}
              </p>

              <div style={{ height: hintToContent, flexShrink: 0 }} />

              <section
                className="ndjc-apk-admin-categories-action-row"
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: rowGap
                }}
              >
                <NdjcPrimaryActionButton
                  disabled={!selectedCategoryName || categorySubmitting}
                  isLoading={categorySubmittingAction === 'rename'}
                  onClick={() => {
                    if (categorySubmitting) return
                    const name = selectedCategoryName
                    if (!name) return
                    setRenameFrom(name)
                    setRenameTo(name)
                    setShowRenameDialog(true)
                  }}
                >
                  Edit
                </NdjcPrimaryActionButton>

                <NdjcPrimaryActionButton
                  disabled={!selectedCategoryName || categorySubmitting}
                  isLoading={categorySubmittingAction === 'delete'}
                  onClick={() => {
                    if (categorySubmitting) return
                    const name = selectedCategoryName
                    if (!name) return
                    actions.onRequestDeleteCategory(name)
                  }}
                >
                  Delete
                </NdjcPrimaryActionButton>
              </section>

              <div style={{ height: sectionGap, flexShrink: 0 }} />

              <h2
                style={{
                  margin: 0,
                  color: 'rgba(0, 0, 0, 0.90)',
                  fontSize: 16,
                  lineHeight: 1.35,
                  fontWeight: 600
                }}
              >
                All categories
              </h2>

              <div style={{ height: titleToHint, flexShrink: 0 }} />

              <p
                style={{
                  margin: 0,
                  color: 'rgba(0, 0, 0, 0.55)',
                  fontSize: 12,
                  lineHeight: 1.35,
                  fontWeight: 400
                }}
              >
                Tap a category to select.
              </p>

              <div style={{ height: hintToContent, flexShrink: 0 }} />

              <section
                className="ndjc-apk-admin-categories-flow-row"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: rowGap
                }}
              >
                {state.manualCategories.map(category => (
                  <NdjcPillButton
                    key={category}
                    selected={selectedCategoryName === category}
                    disabled={categorySubmitting}
                    onClick={() => {
                      if (categorySubmitting) return
                      setSelectedCategoryName(category)
                    }}
                  >
                    {category}
                  </NdjcPillButton>
                ))}
              </section>
            </section>
          </NdjcWhiteCard>
          </section>
        </NdjcAdminPullRefreshContainer>

        <NdjcSnackbarHost message={state.statusMessage} />
      </section>

      {showRenameDialog && renameFrom ? (
        <NdjcBaseDialog
          title="Edit category"
          confirmText="Save"
          dismissText="Cancel"
          confirmEnabled={renameTo.trim().length > 0 && !categorySubmitting}
          confirmLoading={categorySubmittingAction === 'rename'}
          onConfirmClick={() => {
            if (categorySubmitting) return
            actions.onRenameCategory(renameFrom, renameTo)
            closeRenameDialog()
          }}
          onDismissClick={() => {
            if (categorySubmitting) return
            closeRenameDialog()
          }}
          onDismissRequest={() => {
            if (categorySubmitting) return
            closeRenameDialog()
          }}
          textContent={
            <NdjcTextField
              value={renameTo}
              onChange={setRenameTo}
              label="Category name"
              singleLine
            />
          }
        />
      ) : null}

      {state.pendingDeleteCategory ? (
        <NdjcBaseDialog
          title="Delete category?"
          message={`This will delete "${state.pendingDeleteCategory}".`}
          confirmText="Delete"
          dismissText="Cancel"
          destructiveConfirm
          confirmEnabled={!categorySubmitting}
          confirmLoading={categorySubmittingAction === 'delete'}
          onConfirmClick={() => {
            if (categorySubmitting) return
            actions.onConfirmPendingDeleteCategory()
          }}
          onDismissClick={() => {
            if (categorySubmitting) return
            actions.onDismissCategoryDeleteDialogs()
          }}
          onDismissRequest={() => {
            if (categorySubmitting) return
            actions.onDismissCategoryDeleteDialogs()
          }}
        />
      ) : null}

      {state.cannotDeleteCategory ? (
        <NdjcBaseDialog
          title="Cannot delete"
          message={`Category "${state.cannotDeleteCategory}" still has items. Remove/move those items first.`}
          confirmText="OK"
          onConfirmClick={actions.onDismissCategoryDeleteDialogs}
          onDismissRequest={actions.onDismissCategoryDeleteDialogs}
        />
      ) : null}
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseEditDish({
  state,
  actions
}: {
  state: ShowcaseEditDishUiState
  actions: ShowcaseEditDishActions
}) {
  const [pendingExitTarget, setPendingExitTarget] = React.useState<'back' | 'home' | null>(null)
  const [isDraggingImages, setIsDraggingImages] = React.useState(false)
  const editImageInputRef = React.useRef<HTMLInputElement | null>(null)
  const editScrollRef = React.useRef<HTMLElement | null>(null)
  const nameFieldRef = React.useRef<HTMLElement | null>(null)
  const priceFieldRef = React.useRef<HTMLElement | null>(null)
  const descriptionFieldRef = React.useRef<HTMLElement | null>(null)
  const categoryFieldRef = React.useRef<HTMLElement | null>(null)
  const imagesFieldRef = React.useRef<HTMLElement | null>(null)
  const lastValidationScrollSignatureRef = React.useRef('')
  const editBackHandlerRef = React.useRef<(() => void) | null>(null)
  const editHasUnsavedChangesRef = React.useRef(false)
  const editIsBlockingRef = React.useRef(false)

  function openEditImagePicker(): void {
    editImageInputRef.current?.click()
  }

  function handleEditImageFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(event.target.files || [])

    files.forEach(file => {
      actions.onImagePicked(file)
    })

    event.target.value = ''
  }

  const descriptionMax = 200
  const descriptionText = state.description
  const descriptionLength = Math.min(descriptionText.length, descriptionMax)

  function requestExit(target: 'back' | 'home'): void {
    if (state.hasUnsavedChanges) {
      setPendingExitTarget(target)
      return
    }

    if (target === 'home') {
      actions.onBackToHome()
      return
    }

    actions.onBack()
  }

  React.useEffect(() => {
    editHasUnsavedChangesRef.current = state.hasUnsavedChanges
    editIsBlockingRef.current = state.isBlocking || state.isSaving
    editBackHandlerRef.current = () => requestExit('back')
  }, [
    state.hasUnsavedChanges,
    state.isBlocking,
    state.isSaving,
    actions.onBack,
    actions.onBackToHome
  ])

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const editBackGuardState = {
      ndjcEditDishBackGuard: true
    }

    window.history.pushState(editBackGuardState, '', window.location.href)

    function handleEditDishPopState(): void {
      if (editIsBlockingRef.current) {
        window.history.pushState(editBackGuardState, '', window.location.href)
        return
      }

      editBackHandlerRef.current?.()

      if (editHasUnsavedChangesRef.current) {
        window.history.pushState(editBackGuardState, '', window.location.href)
      }
    }

    window.addEventListener('popstate', handleEditDishPopState)

    return () => {
      window.removeEventListener('popstate', handleEditDishPopState)
    }
  }, [])

  function confirmExit(): void {
    const target = pendingExitTarget
    setPendingExitTarget(null)

    if (target === 'home') {
      actions.onBackToHome()
      return
    }

    actions.onBack()
  }

  function scrollEditFieldIntoView(target: HTMLElement | null): void {
    const scrollRoot = editScrollRef.current

    if (!target || !scrollRoot) return

    const rootRect = scrollRoot.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const nextTop = scrollRoot.scrollTop + targetRect.top - rootRect.top - 24

    scrollRoot.scrollTo({
      top: Math.max(0, nextTop),
      behavior: 'smooth'
    })
  }

  function handleEditScrollFocusCapture(event: React.FocusEvent<HTMLElement>): void {
    const target = event.target

    if (!(target instanceof HTMLElement)) return

    const tagName = target.tagName.toLowerCase()
    const isEditableTarget =
      tagName === 'input' ||
      tagName === 'textarea' ||
      target.getAttribute('contenteditable') === 'true'

    if (!isEditableTarget) return

    window.setTimeout(() => {
      scrollEditFieldIntoView(target)
    }, 120)
  }

  React.useEffect(() => {
    if (state.isBlocking || state.isSaving) return

    const validationSignature = [
      state.nameRequiredError ? 'name' : '',
      state.priceRequiredError ? 'price' : '',
      state.descriptionRequiredError ? 'description' : '',
      state.categoryRequiredError ? 'category' : '',
      state.imagesRequiredError ? 'images' : ''
    ]
      .filter(Boolean)
      .join('|')

    if (!validationSignature) {
      lastValidationScrollSignatureRef.current = ''
      return
    }

    if (lastValidationScrollSignatureRef.current === validationSignature) return

    lastValidationScrollSignatureRef.current = validationSignature

    const targetRef =
      state.nameRequiredError ? nameFieldRef :
      state.priceRequiredError ? priceFieldRef :
      state.descriptionRequiredError ? descriptionFieldRef :
      state.categoryRequiredError ? categoryFieldRef :
      state.imagesRequiredError ? imagesFieldRef :
      null

    window.requestAnimationFrame(() => {
      scrollEditFieldIntoView(targetRef?.current || null)
    })
  }, [
    state.nameRequiredError,
    state.priceRequiredError,
    state.descriptionRequiredError,
    state.categoryRequiredError,
    state.imagesRequiredError,
    state.isBlocking,
    state.isSaving
  ])

  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-edit-screen"
      topNav={{
        onBack: () => requestExit('back'),
        onHome: () => requestExit('home')
      }}
    >
      <input
        ref={editImageInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleEditImageFileChange}
      />

      <section
        ref={editScrollRef}
        className="ndjc-apk-edit-scroll-column"
        style={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflowY: state.isBlocking || isDraggingImages ? 'hidden' : 'auto',
          padding: `${APK_EDIT_ITEM_UI.topContentPadding}px ${APK_EDIT_ITEM_UI.screenPadding}px calc(${APK_EDIT_ITEM_UI.screenPadding}px + env(safe-area-inset-bottom) + 96px)`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          touchAction: isDraggingImages ? 'none' : 'pan-y',
          scrollPaddingTop: APK_EDIT_ITEM_UI.topContentPadding,
          scrollPaddingBottom: 140,
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
        onFocusCapture={handleEditScrollFocusCapture}
      >
        <NdjcWhiteCard
          className="ndjc-apk-edit-root-card"
          style={{
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <section
            className="ndjc-apk-edit-card-column"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <EditItemHeaderText
              title={state.isNew ? 'Create item' : 'Edit item'}
              subtitle={state.isNew
                ? 'Set details, category, and visibility.'
                : 'Update details, category, and visibility.'}
            />

            <EditItemSpacer height={APK_EDIT_ITEM_UI.sectionBottom + 8} />

            <EditItemSectionTitle
              title="Details"
              subtitle="Fields marked * are required. Sale price is optional."
            />

            <EditItemSpacer height={APK_EDIT_ITEM_UI.hintToContent} />

            <section
              className="ndjc-apk-edit-fields-column"
              style={{
                width: '100%',
                display: 'grid',
                gap: APK_EDIT_ITEM_UI.fieldGap
              }}
            >
              <EditItemFieldBlock ref={nameFieldRef}>
                <NdjcTextField
                  value={state.name}
                  onChange={actions.onNameChange}
                  label="Name *"
                  placeholder="Item name"
                  singleLine
                  isError={state.nameRequiredError}
                />

                {state.nameRequiredError ? (
                  <EditItemErrorText>
                    Name is required.
                  </EditItemErrorText>
                ) : null}
              </EditItemFieldBlock>

              <EditItemFieldBlock ref={priceFieldRef}>
                <NdjcTextField
                  value={state.originalPrice}
                  onChange={actions.onPriceChange}
                  label="Price *"
                  placeholder="0"
                  type="number"
                  inputMode="numeric"
                  singleLine
                  isError={state.priceRequiredError}
                />

                {state.priceRequiredError ? (
                  <EditItemErrorText>
                    Price is required.
                  </EditItemErrorText>
                ) : null}
              </EditItemFieldBlock>

              <NdjcTextField
                value={state.discountPrice}
                onChange={actions.onDiscountPriceChange}
                label="Sale price"
                placeholder="Optional"
                type="number"
                inputMode="numeric"
                singleLine
              />

              <EditItemBodySmallText>
                Leave empty if no discount. If set, it should be lower than Price.
              </EditItemBodySmallText>

              {state.discountErrorText ? (
                <EditItemErrorText>
                  {state.discountErrorText}
                </EditItemErrorText>
              ) : null}

              <EditItemFieldBlock ref={descriptionFieldRef}>
                <NdjcTextField
                  value={descriptionText}
                  onChange={value => actions.onDescriptionChange(value.slice(0, descriptionMax))}
                  label="Description *"
                  placeholder="Description"
                  multiline
                  minLines={3}
                  isError={state.descriptionRequiredError}
                />

                {state.descriptionRequiredError ? (
                  <EditItemErrorText>
                    Description is required.
                  </EditItemErrorText>
                ) : null}
              </EditItemFieldBlock>

              <section
                className="ndjc-apk-edit-description-helper-row"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
              >
                <span
                  style={{
                    flex: 1,
                    minWidth: 0
                  }}
                >
                  <EditItemBodySmallText>
                    Appears on the item detail page.
                  </EditItemBodySmallText>
                </span>

                <span
                  style={{
                    color: APK_EDIT_ITEM_UI.body55,
                    fontSize: APK_EDIT_ITEM_UI.bodySmallFontSize,
                    lineHeight: APK_EDIT_ITEM_UI.bodySmallLineHeight,
                    fontWeight: APK_EDIT_ITEM_UI.bodySmallFontWeight,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {descriptionLength}/{descriptionMax}
                </span>
              </section>
            </section>

            <EditItemSpacer height={APK_EDIT_ITEM_UI.sectionTop} />

            <EditItemSectionTitle
              title="Organization"
              subtitle="Required. You can select an existing category or type to create a new one."
            />

            <EditItemSpacer height={APK_EDIT_ITEM_UI.hintToContent} />

            <EditItemFieldBlock ref={categoryFieldRef}>
              <NdjcTextField
                value={state.category || ''}
                onChange={value => actions.onCategorySelected(value || null)}
                label="Category *"
                placeholder="Category"
                singleLine
                isError={state.categoryRequiredError}
              />

              {state.categoryRequiredError ? (
                <EditItemErrorText>
                  Category is required.
                </EditItemErrorText>
              ) : null}
            </EditItemFieldBlock>

            {state.availableCategories.length > 0 ? (
              <>
                <EditItemSpacer height={APK_EDIT_ITEM_UI.midGap} />

                <EditItemBodySmallText>
                  Or select an existing category:
                </EditItemBodySmallText>

                <EditItemSpacer height={APK_EDIT_ITEM_UI.spacer8} />

                <section
                  className="ndjc-apk-edit-category-chip-row"
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: APK_EDIT_ITEM_UI.chipGap
                  }}
                >
                  {state.availableCategories.map(category => (
                    <NdjcPillButton
                      key={category}
                      selected={state.category === category}
                      onClick={() => actions.onCategorySelected(category)}
                    >
                      {category}
                    </NdjcPillButton>
                  ))}
                </section>
              </>
            ) : null}

            <EditItemSpacer height={APK_EDIT_ITEM_UI.sectionTop} />

            <EditItemSectionTitle
              title="Media"
              subtitle="Images displayed on the item detail page."
            />

            <EditItemSpacer height={APK_EDIT_ITEM_UI.hintToContent} />

            <section
              ref={imagesFieldRef}
              className="ndjc-apk-edit-images-block"
              style={{
                width: '100%',
                display: 'grid',
                gap: 4
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: state.imagesRequiredError ? APK_EDIT_ITEM_UI.error80 : APK_EDIT_ITEM_UI.black,
                  fontSize: APK_EDIT_ITEM_UI.labelFontSize,
                  lineHeight: APK_EDIT_ITEM_UI.labelLineHeight,
                  fontWeight: APK_EDIT_ITEM_UI.labelFontWeight
                }}
              >
                Images *
              </h2>

              <EditItemBodySmallText>
                Add images displayed on the item detail page. At least 1 image is required. The first image is used as the cover. Up to 9 images.
              </EditItemBodySmallText>

              <EditItemSpacer height={APK_EDIT_ITEM_UI.mediaGridTop} />

              <NdjcEditableImageGrid
                imageUrls={state.imageUrls}
                maxImages={state.maxImages}
                onPickImage={openEditImagePicker}
                onRemoveImage={actions.onRemoveImage}
                onMoveImage={actions.onMoveImage}
                onDraggingChange={setIsDraggingImages}
              />

              {state.imagesRequiredError ? (
                <>
                  <EditItemSpacer height={APK_EDIT_ITEM_UI.labelGap} />

                  <EditItemErrorText>
                    At least 1 image is required.
                  </EditItemErrorText>
                </>
              ) : null}
            </section>

            <EditItemSpacer height={APK_EDIT_ITEM_UI.sectionTop} />

            <EditItemSectionTitle
              title="Visibility"
              subtitle="Choose how this item appears in the list."
            />

            <EditItemSpacer height={APK_EDIT_ITEM_UI.hintToContent} />

            <section
              className="ndjc-apk-edit-visibility-column"
              style={{
                width: '100%',
                display: 'grid',
                gap: 0
              }}
            >
              <NdjcToggleRow
                label="Pick"
                checked={state.isRecommended}
                onChange={actions.onToggleRecommended}
              />

              <EditItemSpacer height={APK_EDIT_ITEM_UI.smallGap} />

              <EditItemBodySmallText>
                Marks this item as Pick in the list.
              </EditItemBodySmallText>

              <EditItemSpacer height={APK_EDIT_ITEM_UI.midGap} />

              <NdjcToggleRow
                label="Hidden from list"
                checked={state.isHidden}
                onChange={actions.onToggleHidden}
              />

              <EditItemSpacer height={APK_EDIT_ITEM_UI.smallGap} />

              <EditItemBodySmallText>
                Hides this item from customers. It can still be edited.
              </EditItemBodySmallText>
            </section>

            <EditItemSpacer height={APK_EDIT_ITEM_UI.saveHintTop} />

            <EditItemBodySmallText>
              {state.isNew
                ? 'After creation, the item is visible unless Hidden from list is enabled.'
                : 'Changes take effect after saving.'}
            </EditItemBodySmallText>

            <EditItemSpacer height={APK_EDIT_ITEM_UI.saveButtonTop} />

            <NdjcPrimaryActionButton
              disabled={state.isBlocking || state.isSaving}
              isLoading={state.isSaving}
              onClick={() => {
                actions.onSave()
              }}
            >
              {state.isNew ? 'Create' : 'Save'}
            </NdjcPrimaryActionButton>


          </section>
        </NdjcWhiteCard>
      </section>

      <NdjcSnackbarHost message={state.statusMessage} />

      {state.showErrorDialog && state.errorMessage ? (
        <NdjcBaseDialog
          title="Cannot save item"
          message={state.errorMessage}
          confirmText="OK"
          onConfirmClick={actions.onDismissError}
          onDismissRequest={actions.onDismissError}
        />
      ) : null}

      {pendingExitTarget ? (
        <NdjcBaseDialog
          title="Leave this page?"
          message="Your item changes will be saved as a draft."
          confirmText="Leave"
          dismissText="Stay"
          onConfirmClick={confirmExit}
          onDismissClick={() => setPendingExitTarget(null)}
          onDismissRequest={() => setPendingExitTarget(null)}
          destructiveConfirm={false}
        />
      ) : null}
    </NdjcUnifiedBackground>
  )
}
function ProfileField({
  label,
  value,
  onChange,
  multiline,
  enabled = true,
  isError = false,
  errorText,
  placeholder
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  enabled?: boolean
  isError?: boolean
  errorText?: string | null
  placeholder?: string
}) {
  return (
    <section
      className="ndjc-apk-field-block"
      style={{
        width: '100%',
        display: 'grid',
        gap: APK_STORE_EDIT_UI.fieldGap
      }}
    >
      <NdjcTextField
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        multiline={multiline}
        disabled={!enabled}
        isError={isError}
        minLines={multiline ? 4 : 1}
      />

      {errorText ? (
        <p
          style={{
            margin: 0,
            color: APK_STORE_EDIT_UI.error80,
            fontSize: 12,
            lineHeight: 1.35,
            fontWeight: 400
          }}
        >
          {errorText}
        </p>
      ) : null}
    </section>
  )
}

function StoreEditSectionTitle({
  children,
  subtitle
}: {
  children: React.ReactNode
  subtitle?: string | null
}) {
  return (
    <section
      className="ndjc-store-edit-section-title"
      style={{
        width: '100%',
        display: 'grid',
        gap: 0
      }}
    >
      <h2 style={apkStoreEditSectionTitleStyle}>{children}</h2>

      {subtitle?.trim() ? (
        <p style={apkStoreEditSectionSubtitleStyle}>{subtitle}</p>
      ) : null}

      <div style={apkStoreEditSectionBottomSpacerStyle} aria-hidden="true" />
    </section>
  )
}

function StoreEditDescriptionCounterRow({
  current,
  max
}: {
  current: number
  max: number
}) {
  return (
    <section
      className="ndjc-store-edit-description-counter-row"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <span
        style={{
          flex: 1,
          minWidth: 0
        }}
      />

      <span
        style={{
          color: APK_STORE_EDIT_UI.black55,
          fontSize: APK_STORE_EDIT_UI.subtitleSize,
          lineHeight: APK_STORE_EDIT_UI.subtitleLineHeight,
          fontWeight: APK_STORE_EDIT_UI.subtitleWeight,
          whiteSpace: 'nowrap'
        }}
      >
        {current}/{max}
      </span>
    </section>
  )
}
export function ShowcaseStoreProfileEdit({
  state,
  actions
}: {
  state: ShowcaseStoreProfileUiState
  actions: ShowcaseStoreProfileActions
}) {
  const [serviceDraft, setServiceDraft] = React.useState('')
  const [extraNewName, setExtraNewName] = React.useState('')
  const [extraNewValue, setExtraNewValue] = React.useState('')
  const [extraLocalError, setExtraLocalError] = React.useState<string | null>(null)
  const [pendingExitTarget, setPendingExitTarget] = React.useState<'back' | 'home' | null>(null)
  const [showMapUrlDialog, setShowMapUrlDialog] = React.useState(false)
  const [isDraggingCoverImages, setIsDraggingCoverImages] = React.useState(false)
  const [imagePreview, setImagePreview] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)

  const logoInputRef = React.useRef<HTMLInputElement | null>(null)
  const coverInputRef = React.useRef<HTMLInputElement | null>(null)
  const titleFieldRef = React.useRef<HTMLElement | null>(null)
  const addressFieldRef = React.useRef<HTMLElement | null>(null)
  const contactsFieldRef = React.useRef<HTMLElement | null>(null)

  const storeProfileErrorMessage = state.errorMessage || state.validationError || null
  const titleRequiredError = storeProfileErrorMessage === 'Store title is required.'
  const addressRequiredError = storeProfileErrorMessage === '已填写 Map URL，但文本地址（Address）为空：请先填写地址，否则无法保存。'
  const contactRequiredError = storeProfileErrorMessage === '有联系方式只填了一半（Name/Value），请补全或清空后再保存。'
  const mapUrlDialogMessage = storeProfileErrorMessage &&
    storeProfileErrorMessage.includes('Map URL') &&
    (storeProfileErrorMessage.includes('http://') || storeProfileErrorMessage.includes('https://'))
      ? storeProfileErrorMessage
      : null

  React.useEffect(() => {
    if (mapUrlDialogMessage) {
      setShowMapUrlDialog(true)
    }
  }, [mapUrlDialogMessage])

  React.useEffect(() => {
    const target = titleRequiredError
      ? titleFieldRef.current
      : addressRequiredError
        ? addressFieldRef.current
        : contactRequiredError
          ? contactsFieldRef.current
          : null

    if (!target) return

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }, [titleRequiredError, addressRequiredError, contactRequiredError])

  function requestExit(target: 'back' | 'home'): void {
    if (state.hasUnsavedChanges) {
      setPendingExitTarget(target)
      return
    }

    if (target === 'home') {
      actions.onBackToHome()
      return
    }

    actions.onBack()
  }

  function confirmExit(): void {
    const target = pendingExitTarget
    setPendingExitTarget(null)

    if (target === 'home') {
      actions.onDiscardDraftAndGoHome()
      return
    }

    actions.onBack()
  }

  function openLogoPicker(): void {
    logoInputRef.current?.click()
  }

  function openCoverPicker(): void {
    coverInputRef.current?.click()
  }

  function handleLogoFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = Array.from(event.target.files || [])[0]

    if (file) {
      actions.onLogoImagePicked(file)
    }

    event.target.value = ''
  }

  function handleCoverFilesChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(event.target.files || [])

    if (files.length) {
      actions.onCoverImagesPicked(files)
    }

    event.target.value = ''
  }

  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-store-edit-screen"
      topNav={{
        onBack: () => requestExit('back'),
        onHome: () => requestExit('home')
      }}
    >


      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleLogoFileChange}
      />

      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleCoverFilesChange}
      />

      <section
        className="ndjc-apk-store-edit-scroll-column"
        style={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflowY: isDraggingCoverImages ? 'hidden' : 'auto',
          padding: `${APK_PAGE_SHELL_UI.topCardOffset}px ${APK_PAGE_SHELL_UI.screenPadding}px ${APK_PAGE_SHELL_UI.noBottomBarReserve}px`,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <NdjcWhiteCard
          className="ndjc-apk-store-edit-root-card"
          style={{
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <section
            className="ndjc-apk-store-edit-card-column"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 0
            }}
          >
            <h1
              style={{
                margin: 0,
                color: '#000000',
                fontSize: 24,
                lineHeight: 1.25,
                fontWeight: 600
              }}
            >
              Edit Store Profile
            </h1>

            <div style={{ height: 4, flexShrink: 0 }} />

            <p
              style={{
                margin: 0,
                color: 'rgba(0, 0, 0, 0.70)',
                fontSize: 14,
                lineHeight: 1.45,
                fontWeight: 400
              }}
            >
              Update your public store information shown to customers.
            </p>

            <div style={{ height: 8, flexShrink: 0 }} />

            <NdjcAdminPageProgressSlot active={state.isSaving} />

            <div style={{ height: 12, flexShrink: 0 }} />

            <StoreEditSectionTitle subtitle="Displayed at the top of your public profile.">
              Brand
            </StoreEditSectionTitle>

            <section ref={titleFieldRef}>
              <ProfileField
                label="Title *"
                value={state.draftTitle}
                onChange={actions.onTitleChange}
                isError={titleRequiredError}
                errorText={titleRequiredError ? 'Store title is required.' : null}
              />
            </section>

            <div style={{ height: 10, flexShrink: 0 }} />

            <ProfileField
              label="Subtitle"
              value={state.draftSubtitle}
              onChange={actions.onSubtitleChange}
            />

            <div style={{ height: 18, flexShrink: 0 }} />

            <StoreEditSectionTitle subtitle="This description appears in your public profile.">
              About
            </StoreEditSectionTitle>

            <ProfileField
              label="Description"
              value={state.draftDescription}
              onChange={actions.onDescriptionChange}
              multiline
            />

            <StoreEditDescriptionCounterRow
              current={Math.min(state.draftDescription.length, 200)}
              max={200}
            />

            <div style={{ height: 18, flexShrink: 0 }} />

            <StoreEditSectionTitle subtitle="List the services or categories you provide. Empty entries will not be saved.">
              Business Scope
            </StoreEditSectionTitle>

            <StoreServicesEditor
              services={state.draftServices}
              onChange={actions.onServiceChange}
              onRemove={actions.onRemoveService}
            />

            <div style={{ height: 10, flexShrink: 0 }} />

            <section
              className="ndjc-store-service-new-row"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}
            >
              <NdjcTextField
                value={serviceDraft}
                onChange={setServiceDraft}
                label="Add new service"
                placeholder="Add new service"
                singleLine
              />

              <section
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
                  gap: APK_STORE_EDIT_UI.rowGap
                }}
              >
                <span aria-hidden="true" />
                <span aria-hidden="true" />

                <NdjcPrimaryActionButton
                  disabled={!serviceDraft.trim()}
                  onClick={() => {
                    actions.onAddService(serviceDraft)
                    setServiceDraft('')
                  }}
                >
                  Add
                </NdjcPrimaryActionButton>
              </section>
            </section>

            <div style={{ height: 18, flexShrink: 0 }} />

            <StoreEditSectionTitle subtitle="If left empty, this section will not appear in your public profile.">
              Location & Hours
            </StoreEditSectionTitle>

            <section ref={addressFieldRef}>
              <ProfileField
                label="Address"
                value={state.draftAddress}
                onChange={actions.onAddressChange}
                isError={addressRequiredError}
                errorText={addressRequiredError ? 'Address is required when Map URL is filled.' : null}
              />
            </section>

            <div style={{ height: 10, flexShrink: 0 }} />

            <ProfileField
              label="Hours"
              value={state.draftHours}
              onChange={actions.onHoursChange}
            />

            <div style={{ height: 10, flexShrink: 0 }} />

            <ProfileField
              label="Map URL (optional)"
              value={state.draftMapUrl}
              onChange={actions.onMapUrlChange}
            />

            <div style={{ height: 18, flexShrink: 0 }} />

            <StoreEditSectionTitle subtitle="These details will be visible to customers in your profile.">
              Contact
            </StoreEditSectionTitle>

            <section ref={contactsFieldRef}>
              <StoreExtraContactsEditor>
                {state.draftExtraContacts.map(contact => (
                  <StoreExtraContactsEditorRow
                    key={contact.id}
                    name={contact.name}
                    value={contact.value}
                    onNameChange={value => actions.onExtraContactNameChange(contact.id, value)}
                    onValueChange={value => actions.onExtraContactValueChange(contact.id, value)}
                    onRemove={() => actions.onRemoveExtraContact(contact.id)}
                  />
                ))}

              <section
                className="ndjc-store-extra-contact-new-row"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <section
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: `minmax(0, ${APK_STORE_EDIT_UI.nameColumnFlex}fr) minmax(0, ${APK_STORE_EDIT_UI.valueColumnFlex}fr)`,
                    gap: APK_STORE_EDIT_UI.rowGap,
                    alignItems: 'end'
                  }}
                >
                  <NdjcTextField
                    value={extraNewName}
                    onChange={value => {
                      setExtraNewName(value)
                      setExtraLocalError(null)
                    }}
                    placeholder="Name"
                    label="Name"
                    singleLine
                  />

                  <NdjcTextField
                    value={extraNewValue}
                    onChange={value => {
                      setExtraNewValue(value)
                      setExtraLocalError(null)
                    }}
                    placeholder="Value"
                    label="Value"
                    singleLine
                  />
                </section>

                <section
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
                    gap: APK_STORE_EDIT_UI.rowGap
                  }}
                >
                  <span aria-hidden="true" />
                  <span aria-hidden="true" />

                  <NdjcPrimaryActionButton
                    disabled={!extraNewName.trim() || !extraNewValue.trim()}
                    onClick={() => {
                      const name = extraNewName.trim()
                      const value = extraNewValue.trim()

                      actions.onAddExtraContact(name, value)
                      setExtraNewName('')
                      setExtraNewValue('')
                    }}
                  >
                    Add
                  </NdjcPrimaryActionButton>
                </section>
              </section>
              </StoreExtraContactsEditor>

              {contactRequiredError || extraLocalError ? (
                <>
                  <div style={{ height: 6, flexShrink: 0 }} />

                  <p
                    style={{
                      margin: 0,
                      color: APK_STORE_EDIT_UI.error80,
                      fontSize: 12,
                      lineHeight: 1.35,
                      fontWeight: 400
                    }}
                  >
                    {contactRequiredError
                      ? 'A contact item is incomplete (Name/Value). Please complete it or remove it before saving.'
                      : extraLocalError}
                  </p>
                </>
              ) : null}
            </section>

            <div style={{ height: 18, flexShrink: 0 }} />

            <StoreEditSectionTitle subtitle="Images displayed in your public profile. The first cover image is featured prominently. Up to 9 images.">
              Media
            </StoreEditSectionTitle>

            <StoreProfileCoverPicker
              src={state.draftCoverUrl}
              enabled={!state.isSaving}
              onPick={openCoverPicker}
              onRemove={actions.onRemoveCover}
              onMove={actions.onMoveCover}
              onDraggingChange={value => {
                setIsDraggingCoverImages(value)
                actions.onCoverDraggingChange(value)
              }}
              onPreview={(images, startIndex) => {
                setImagePreview({
                  images,
                  startIndex
                })
              }}
            />

            <div style={{ height: 10, flexShrink: 0 }} />

            <StoreProfileLogoPicker
              src={state.draftLogoUrl}
              enabled={!state.isSaving}
              onPick={openLogoPicker}
              onRemove={actions.onRemoveLogo}
              onPreview={(images, startIndex) => {
                setImagePreview({
                  images,
                  startIndex
                })
              }}
            />

            <div style={{ height: 14, flexShrink: 0 }} />

            {storeProfileErrorMessage &&
            !titleRequiredError &&
            !addressRequiredError &&
            !contactRequiredError &&
            !mapUrlDialogMessage ? (
              <>
                <div style={{ height: 8, flexShrink: 0 }} />

                <p
                  className="ndjc-error-text"
                  style={{
                    margin: 0
                  }}
                >
                  {storeProfileErrorMessage}
                </p>
              </>
            ) : null}

            <div style={{ height: 16, flexShrink: 0 }} />

            <NdjcPrimaryActionButton
              disabled={state.isSaving}
              isLoading={state.isSaving}
              onClick={() => {
                const name = extraNewName.trim()
                const value = extraNewValue.trim()
                const halfFilled =
                  (name.length === 0 && value.length > 0) ||
                  (name.length > 0 && value.length === 0)

                if (halfFilled) {
                  setExtraLocalError('A contact item is incomplete (Name/Value). Please complete it or remove it before saving.')
                  contactsFieldRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  })
                  return
                }

                actions.onSave()
              }}
            >
              Save
            </NdjcPrimaryActionButton>

            <div style={{ height: 10, flexShrink: 0 }} />

            <p
              style={{
                margin: 0,
                color: 'rgba(0, 0, 0, 0.55)',
                fontSize: 12,
                lineHeight: 1.35,
                fontWeight: 400
              }}
            >
              Changes are saved immediately and reflected in your public profile.
            </p>
          </section>
        </NdjcWhiteCard>
      </section>

      <NdjcSnackbarHost message={state.statusMessage || state.successMessage} />

      {imagePreview ? (
        <NdjcFullscreenImageViewerScreen
          images={imagePreview.images}
          startIndex={imagePreview.startIndex}
          onDismiss={() => setImagePreview(null)}
        />
      ) : null}

      {pendingExitTarget ? (
        <NdjcBaseDialog
          title="Discard unsaved changes?"
          message="You have unsaved merchant profile changes. Leave this page and discard them?"
          confirmText="Discard"
          dismissText="Stay"
          destructiveConfirm
          onConfirmClick={confirmExit}
          onDismissClick={() => setPendingExitTarget(null)}
          onDismissRequest={() => setPendingExitTarget(null)}
        />
      ) : null}

      {showMapUrlDialog && mapUrlDialogMessage ? (
        <NdjcBaseDialog
          title="Invalid Map URL"
          message={mapUrlDialogMessage}
          confirmText="OK"
          dismissText={null}
          onConfirmClick={() => setShowMapUrlDialog(false)}
          onDismissClick={() => setShowMapUrlDialog(false)}
          onDismissRequest={() => setShowMapUrlDialog(false)}
        />
      ) : null}
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseChangePassword({
  state,
  actions
}: {
  state: ShowcaseChangePasswordUiState
  actions: ShowcaseChangePasswordActions
}) {
  return (
    <NdjcUnifiedBackground
      className="ndjc-apk-change-password-screen"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-apk-change-password-content"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          minHeight: 0,
          padding: `${APK_PAGE_SHELL_UI.topCardOffset}px ${APK_PAGE_SHELL_UI.screenPadding}px ${APK_PAGE_SHELL_UI.screenPadding}px`,
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <NdjcWhiteCard
          className="ndjc-apk-login-card"
          style={{
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <section
            className="ndjc-apk-change-password-column"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch'
            }}
          >
            <h1
              style={{
                margin: 0,
                color: '#000000',
                fontSize: 24,
                lineHeight: 1.25,
                fontWeight: 600
              }}
            >
              Change password
            </h1>

            <div style={{ height: 6, flexShrink: 0 }} />

            <p
              style={{
                margin: 0,
                color: 'rgba(0, 0, 0, 0.70)',
                fontSize: 14,
                lineHeight: 1.35,
                fontWeight: 400
              }}
            >
              Update your credentials for this account.
            </p>

            <div style={{ height: 8, flexShrink: 0 }} />

            <NdjcAdminPageProgressSlot active={state.isSaving} />

            <div style={{ height: 16, flexShrink: 0 }} />

            <NdjcTextField
              value={state.current}
              onChange={actions.onCurrentChange}
              label="Current password"
              type="password"
              singleLine
            />

            <div style={{ height: 12, flexShrink: 0 }} />

            <NdjcTextField
              value={state.next}
              onChange={actions.onNextChange}
              label="New password"
              type="password"
              singleLine
            />

            <div style={{ height: 6, flexShrink: 0 }} />

            <p
              style={{
                margin: 0,
                color: 'rgba(0, 0, 0, 0.55)',
                fontSize: 12,
                lineHeight: 1.35,
                fontWeight: 400
              }}
            >
              Use at least 8 characters. Avoid common passwords.
            </p>

            <div style={{ height: 12, flexShrink: 0 }} />

            <NdjcTextField
              value={state.confirm}
              onChange={actions.onConfirmChange}
              label="Confirm new password"
              type="password"
              singleLine
            />

            <div style={{ height: 4, flexShrink: 0 }} />

            <p
              style={{
                margin: 0,
                color: 'rgba(0, 0, 0, 0.55)',
                fontSize: 12,
                lineHeight: 1.35,
                fontWeight: 400
              }}
            >
              Must match the new password.
            </p>

            {state.error ? (
              <>
                <div style={{ height: 10, flexShrink: 0 }} />

                <p
                  className="ndjc-error-text"
                  style={{
                    margin: 0,
                    color: APK_CORE_UI.danger,
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 400
                  }}
                >
                  {state.error}
                </p>
              </>
            ) : null}

            {state.success ? (
              <>
                <div style={{ height: 10, flexShrink: 0 }} />

                <p
                  style={{
                    margin: 0,
                    color: 'rgba(0, 0, 0, 0.70)',
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 400
                  }}
                >
                  {state.success}
                </p>
              </>
            ) : null}

            <div style={{ height: 16, flexShrink: 0 }} />

            <NdjcPrimaryActionButton
              disabled={state.isSaving}
              isLoading={state.isSaving}
              onClick={actions.onSubmit}
            >
              Update password
            </NdjcPrimaryActionButton>

            <div style={{ height: 16, flexShrink: 0 }} />

            <p
              style={{
                margin: 0,
                color: 'rgba(0, 0, 0, 0.55)',
                fontSize: 12,
                lineHeight: 1.35,
                fontWeight: 400
              }}
            >
              You may need to sign in again after updating your password.
            </p>
          </section>
        </NdjcWhiteCard>
      </section>
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseMerchantChatList({
  threads,
  searchQuery,
  refreshing,
  pagination,
  actions
}: {
  threads: ShowcaseChatThreadSummaryUi[]
  searchQuery: string
  refreshing: boolean
  pagination: ShowcasePaginationUiState
  actions: ShowcaseMerchantChatListActions
}) {
  return (
    <ShowcaseMerchantChatListScreen
      threads={threads}
      searchQuery={searchQuery}
      refreshing={refreshing}
      pagination={pagination}
      actions={actions}
    />
  )
}

export function ShowcaseChatMedia({
  state,
  actions
}: {
  state: ShowcaseChatUiState
  actions: ShowcaseChatMediaActions
}) {
  const [preview, setPreview] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)

  const mediaItems = state.mediaItems

  const mediaByDate = React.useMemo(() => {
    const grouped = new Map<string, typeof mediaItems>()

    mediaItems.forEach(item => {
      const current = grouped.get(item.dayKey) || []
      current.push(item)
      grouped.set(item.dayKey, current)
    })

    return Array.from(grouped.entries()).sort((left, right) => right[0].localeCompare(left[0]))
  }, [mediaItems])

  const allImagesSorted = React.useMemo(() => {
    return mediaItems.map(item => item.url)
  }, [mediaItems])

  return (
    <NdjcUnifiedBackground
      className="ndjc-chat-media-gallery-screen"
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-chat-media-gallery-content"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          minHeight: 0,
          padding: `${APK_PAGE_SHELL_UI.topCardOffset}px ${APK_PAGE_SHELL_UI.screenPadding}px ${APK_PAGE_SHELL_UI.screenPadding}px`,
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch'
        }}
        onScroll={event => ndjcHandleLoadMoreScroll(
          event,
          state.mediaPagination,
          actions.onLoadMoreMediaItems
        )}
      >
        <NdjcWhiteCard
          className="ndjc-chat-media-gallery-card"
          style={{
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <section
            className="ndjc-chat-media-gallery-column"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
          >
            <section
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}
            >
              <h1
                style={{
                  margin: 0,
                  color: '#000000',
                  fontSize: 24,
                  lineHeight: 1.25,
                  fontWeight: 600
                }}
              >
                Shared photos ({mediaItems.length})
              </h1>

              <p
                style={{
                  margin: 0,
                  color: 'rgba(0, 0, 0, 0.60)',
                  fontSize: 12,
                  lineHeight: 1.35,
                  fontWeight: 400
                }}
              >
                Images exchanged in this conversation
              </p>
            </section>

            {mediaItems.length > 0 ? (
              <section
                className="ndjc-chat-media-gallery-groups"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                {mediaByDate.map(([dayKey, itemsInDay], groupIndex) => (
                  <section
                    key={dayKey}
                    className="ndjc-chat-media-gallery-group"
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      marginBottom: groupIndex === mediaByDate.length - 1 ? 0 : 8
                    }}
                  >
                    <section
                      style={{
                        width: 'fit-content',
                        minHeight: 28,
                        borderRadius: 16,
                        padding: '0 10px',
                        boxSizing: 'border-box',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(0, 0, 0, 0.62)',
                        background: 'rgba(0, 0, 0, 0.045)'
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(0, 0, 0, 0.62)',
                          fontSize: 12,
                          lineHeight: '12px',
                          fontWeight: 600,
                          display: 'block'
                        }}
                      >
                        {dayKey}
                      </span>
                    </section>

                    <section
                      className="ndjc-chat-media-gallery-grid"
                      style={{
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: 6
                      }}
                    >
                      {itemsInDay.map(item => {
                        const startIndex = allImagesSorted.indexOf(item.url)

                        return (
                          <button
                            key={`${item.messageId}-${item.url}`}
                            type="button"
                            className="ndjc-chat-media-gallery-tile"
                            style={{
                              width: '100%',
                              aspectRatio: '1 / 1',
                              border: '1px solid transparent',
                              borderRadius: 12,
                              padding: 0,
                              display: 'block',
                              color: '#000000',
                              background: 'rgba(0, 0, 0, 0.06)',
                              boxShadow: 'none',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              transform: 'scale(1)',
                              transition: 'transform 120ms ease, border-color 120ms ease'
                            }}
                            onPointerDown={event => {
                              event.currentTarget.style.transform = 'scale(0.97)'
                              event.currentTarget.style.borderColor = 'rgba(254, 149, 149, 0.35)'
                            }}
                            onPointerUp={event => {
                              event.currentTarget.style.transform = 'scale(1)'
                              event.currentTarget.style.borderColor = 'transparent'
                            }}
                            onPointerCancel={event => {
                              event.currentTarget.style.transform = 'scale(1)'
                              event.currentTarget.style.borderColor = 'transparent'
                            }}
                            onPointerLeave={event => {
                              event.currentTarget.style.transform = 'scale(1)'
                              event.currentTarget.style.borderColor = 'transparent'
                            }}
                            onClick={() => {
                              setPreview({
                                images: allImagesSorted,
                                startIndex: startIndex >= 0 ? startIndex : 0
                              })
                            }}
                          >
                            <NdjcShimmerImage
                              src={item.url}
                              alt="Shared photo"
                              placeholderCornerRadius={16}
                              contentScale="cover"
                            />
                          </button>
                        )
                      })}
                    </section>
                  </section>
                ))}
              </section>
            ) : !state.mediaPagination.isLoadingMore ? (
              <NdjcInlineEmptyState
                title="No photos yet"
                message="Photos shared here will appear automatically."
                verticalPadding={40}
              />
            ) : null}

            <NdjcPaginationFooter
              pagination={state.mediaPagination}
              idleText="Load more"
              loadingText="Loading more..."
              endText={mediaItems.length > 0 ? 'No more photos' : ''}
              onLoadMore={actions.onLoadMoreMediaItems}
            />
          </section>
        </NdjcWhiteCard>
      </section>

      {preview ? (
        <NdjcFullscreenImageViewerScreen
          images={preview.images}
          startIndex={preview.startIndex}
          onDismiss={() => setPreview(null)}
          onSave={actions.onSavePreviewImage}
        />
      ) : null}
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseAdminAppointmentManager({
  state,
  actions
}: {
  state: ShowcaseAdminAppointmentsUiState
  actions: ShowcaseAdminAppointmentsActions
}) {
  const [detailsItem, setDetailsItem] = React.useState<ShowcaseAppointmentCard | null>(null)
  const [showBookingSettingsSheet, setShowBookingSettingsSheet] = React.useState(false)
  const [editingAvailableTimeTarget, setEditingAvailableTimeTarget] = React.useState<'start' | 'end' | null>(null)
  const [showHistoryDatePicker, setShowHistoryDatePicker] = React.useState(false)
  const [bookingSettingsDraft, setBookingSettingsDraft] = React.useState(() => ({
    enabled: state.enabled,
    bookingWindowDays: state.bookingWindowDays,
    availableHoursText: state.availableHoursText,
    slotIntervalMinutes: state.slotIntervalMinutes,
    closedDays: state.closedDays,
    minimumNotice: state.minimumNotice
  }))
  const headerRef = React.useRef<HTMLElement | null>(null)
  const [headerHeight, setHeaderHeight] = React.useState(0)

  function resetBookingSettingsDraftFromState(): void {
    setBookingSettingsDraft({
      enabled: state.enabled,
      bookingWindowDays: state.bookingWindowDays,
      availableHoursText: state.availableHoursText,
      slotIntervalMinutes: state.slotIntervalMinutes,
      closedDays: state.closedDays,
      minimumNotice: state.minimumNotice
    })
  }

  function openBookingSettingsSheet(): void {
    if (state.settingsSubmitting) return
    setBookingSettingsDraft({
      enabled: state.enabled,
      bookingWindowDays: state.bookingWindowDays,
      availableHoursText: state.availableHoursText,
      slotIntervalMinutes: state.slotIntervalMinutes,
      closedDays: state.closedDays,
      minimumNotice: state.minimumNotice
    })
    setShowBookingSettingsSheet(true)
  }

  function updateBookingSettingsDraft(
    patch: Partial<typeof bookingSettingsDraft>
  ): void {
    setBookingSettingsDraft(current => ({
      ...current,
      ...patch
    }))
  }

  function toggleBookingClosedDayDraft(day: string): void {
    setBookingSettingsDraft(current => {
      const nextClosedDays = current.closedDays.includes(day)
        ? current.closedDays.filter(item => item !== day)
        : [...current.closedDays, day]

      return {
        ...current,
        closedDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].filter(item => nextClosedDays.includes(item))
      }
    })
  }

  React.useEffect(() => {
    const target = headerRef.current
    if (!target) return

    const updateHeight = () => {
      setHeaderHeight(target.getBoundingClientRect().height)
    }

    updateHeight()

    if (typeof ResizeObserver === 'undefined') {
      window.setTimeout(updateHeight, 0)
      return
    }

    const observer = new ResizeObserver(updateHeight)
    observer.observe(target)

    return () => observer.disconnect()
  }, [
    state.enabled,
    state.bookingWindowDays,
    state.availableHoursText,
    state.slotIntervalMinutes,
    state.minimumNotice,
    state.closedDays.join(','),
    state.historyDateFilter,
    state.selectedDateFilter,
    state.selectedStatusFilter,
    state.selectedServiceFilter,
    state.dateFilterOptions.join(','),
    state.statusFilterOptions.join(','),
    state.serviceFilterOptions.join(',')
  ])

  React.useEffect(() => {
    if (showBookingSettingsSheet) return
    resetBookingSettingsDraftFromState()
  }, [
    showBookingSettingsSheet,
    state.enabled,
    state.bookingWindowDays,
    state.availableHoursText,
    state.slotIntervalMinutes,
    state.minimumNotice,
    state.closedDays.join(',')
  ])

  const headerTopPadding = APK_PAGE_SHELL_UI.topCardOffset
  const listTopPadding = headerTopPadding + headerHeight + 10
  const bookingSettingsSummary = [
    `${state.bookingWindowDays} days`,
    state.availableHoursText.replace(' - ', '-'),
    `${state.slotIntervalMinutes} min`,
    state.minimumNotice,
    state.closedDays.length ? `Closed ${state.closedDays.join(', ')}` : ''
  ].filter(Boolean).join(' · ')
  const [availableHoursStart, availableHoursEnd] = splitAppointmentAvailableHours(bookingSettingsDraft.availableHoursText)

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: actions.onBack,
        onHome: actions.onBackToHome
      }}
    >
      <section
        className="ndjc-admin-appointments-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <NdjcAdminPullRefreshContainer
          isRefreshing={state.isRefreshing}
          onRefresh={actions.onRefresh}
        >
          <section
            className="ndjc-admin-appointments-list-layer"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              width: '100%',
              height: '100%',
              minHeight: 0,
              padding: `${listTopPadding}px ${APK_PAGE_SHELL_UI.screenPadding}px ${APK_PAGE_SHELL_UI.screenPadding}px`,
              boxSizing: 'border-box',
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
            onScroll={event => ndjcHandleLoadMoreScroll(
              event,
              state.pagination,
              actions.onLoadMore
            )}
          >
            {state.items.length ? (
              <>
                {state.items.map(item => {
                  const linkedItemAvailable = Boolean(
  item.itemAvailable &&
  item.sourceDishId &&
  item.imageUrl &&
  item.priceText
)

                  return (
                    <AppointmentCatalogItemCard
                      key={item.id}
                      title={item.serviceTitle || 'General appointment'}
                      imageUrl={item.imageUrl}
                      priceTextValue={null}
                      categoryText={null}
                      isRecommended={item.isRecommended}
                      itemAvailable={linkedItemAvailable}
                      allowClickWhenUnavailable
                      onOpen={() => setDetailsItem(item)}
                      bottom={
                        <>
                          <span
                            style={{
                              color: APK_APPOINTMENT_UI.black75,
                              fontSize: APK_APPOINTMENT_UI.bodyMediumSize,
                              lineHeight: APK_APPOINTMENT_UI.bodyMediumLineHeight,
                              fontWeight: 500,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {appointmentListTimeText(item.preferredDate, item.preferredTime)}
                          </span>

                          <div style={{ height: 4 }} aria-hidden="true" />

                          <NdjcPillBadge selected>
                            {item.statusLabel}
                          </NdjcPillBadge>
                        </>
                      }
                      trailing={
                        linkedItemAvailable ? (
                          <button
                            type="button"
                            aria-label="Chat customer"
                            title="Chat customer"
                            style={{
                              width: 40,
                              height: 40,
                              border: 0,
                              borderRadius: 999,
                              padding: 0,
                              display: 'grid',
                              placeItems: 'center',
                              color: APK_APPOINTMENT_UI.brand,
                              background: 'transparent',
                              boxShadow: 'none',
                              cursor: 'pointer'
                            }}
                            onClick={event => {
                              event.stopPropagation()
                              actions.onContactCustomer(item.id)
                            }}
                          >
                            <NdjcChatBubbleIcon filled />
                          </button>
                        ) : null
                      }
                    />
                  )
                })}

                <NdjcPaginationFooter
                  pagination={state.pagination}
                  idleText="Load more"
                  loadingText="Loading more..."
                  endText="No more appointments"
                  onLoadMore={actions.onLoadMore}
                />
              </>
            ) : (
              <NdjcInlineEmptyState
                title="No appointment requests yet"
                message="New customer requests will appear here after customers submit a booking."
                verticalPadding={0}
                fillParentMaxSize
              />
            )}
          </section>

          <NdjcTopScrollFadeMask
            className="ndjc-admin-appointments-header-scroll-mask"
            solidRatio={0.58}
            style={{
              zIndex: 2
            }}
          />

          <section
            ref={headerRef}
            className="ndjc-admin-appointments-header-wrap"
            style={{
              position: 'absolute',
              zIndex: 3,
              top: headerTopPadding,
              left: APK_PAGE_SHELL_UI.screenPadding,
              right: APK_PAGE_SHELL_UI.screenPadding
            }}
          >
            <NdjcWhiteCard
              className="ndjc-apk-admin-header-card ndjc-admin-appointments-header-card"
              style={{
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              <section
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    color: '#000000',
                    fontSize: 24,
                    lineHeight: 1.25,
                    fontWeight: 600
                  }}
                >
                  Appointments
                </h1>

                <NdjcAdminPageProgressSlot active={state.isRefreshing} />

                <NdjcToggleRow
                  label="Appointment booking"
                  checked={state.enabled}
                  enabled={!state.settingsSubmitting}
                  onChange={() => {
                    openBookingSettingsSheet()
                  }}
                />

                <section
                  className="ndjc-admin-appointments-settings-row"
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    padding: '7px 10px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#000000',
                    background: '#F7F7FB',
                    cursor: 'pointer'
                  }}
                  onClick={openBookingSettingsSheet}
                >
                  <section
                    style={{
                      flex: 1,
                      minWidth: 0,
                      paddingRight: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2
                    }}
                  >
                    <span
                      style={{
                        color: '#000000',
                        fontSize: 14,
                        lineHeight: 1.35,
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Booking settings
                    </span>

                    <span
                      style={{
                        color: '#667085',
                        fontSize: 12,
                        lineHeight: 1.35,
                        fontWeight: 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {bookingSettingsSummary}
                    </span>
                  </section>

<NdjcPillButton
  disabled={state.settingsSubmitting}
  onClick={openBookingSettingsSheet}
>
  Edit
</NdjcPillButton>
                </section>

                <section
                  className="ndjc-admin-appointments-filter-title-row"
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span
                    style={{
                      color: '#000000',
                      fontSize: 12,
                      lineHeight: 1.35,
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Filters
                  </span>

                  <NdjcPillButton
                    onClick={() => {
                      if (state.historyDateFilter) {
                        actions.onHistoryDateClear()
                        return
                      }

                      setShowHistoryDatePicker(true)
                    }}
                  >
                    {state.historyDateFilter ? 'Clear' : 'Calendar'}
                  </NdjcPillButton>
                </section>

                <section
                  className="ndjc-admin-appointments-filter-column"
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
{state.historyDateFilter ? (
  <AppointmentFilterRow
    label="Date"
    options={[state.historyDateFilter]}
    selected={state.historyDateFilter}
    optionText={appointmentHistoryDateLabel}
    onSelected={() => setShowHistoryDatePicker(true)}
  />
) : (
  <AppointmentFilterRow
    label="Date"
    options={state.dateFilterOptions}
    selected={state.selectedDateFilter}
    optionText={appointmentFilterDateLabel}
    onSelected={actions.onDateFilterChange}
  />
)}

                  <AppointmentFilterRow
                    label="Status"
                    options={state.statusFilterOptions}
                    selected={state.selectedStatusFilter}
                    onSelected={actions.onStatusFilterChange}
                  />

                  <AppointmentFilterRow
                    label="Item"
                    options={state.serviceFilterOptions}
                    selected={state.selectedServiceFilter}
                    onSelected={actions.onServiceFilterChange}
                  />
                </section>
              </section>
            </NdjcWhiteCard>
          </section>
        </NdjcAdminPullRefreshContainer>

        <NdjcSnackbarHost
          message={state.statusMessage?.toLowerCase() === 'no data.'
            ? null
            : state.statusMessage}
        />

        <AppointmentDetailsBottomSheet
          item={detailsItem}
          onClose={() => setDetailsItem(null)}
          onOpenProduct={actions.onOpenAppointmentProductDetail}
          adminActions={actions}
          statusSubmittingId={state.statusSubmittingId}
        />

        <AppointmentHistoryDatePickerSheet
          open={showHistoryDatePicker}
          selectedDate={state.historyDateFilter || ''}
          onSelect={value => {
            actions.onHistoryDateSelected(value)
            setShowHistoryDatePicker(false)
          }}
          onClose={() => setShowHistoryDatePicker(false)}
        />

        <NdjcFilterBottomSheet
          open={showBookingSettingsSheet}
          title="Booking settings"
          clearText=""
          applyText="Save settings"
          showPriceFields={false}
          showHeaderAction={false}
          applyLoading={state.settingsSubmitting}
          onClose={() => {
            if (state.settingsSubmitting) return
            setShowBookingSettingsSheet(false)
            resetBookingSettingsDraftFromState()
          }}
          onApply={() => {
            if (state.settingsSubmitting) return

            void Promise.resolve(actions.onSettingsSave(bookingSettingsDraft)).then(() => {
              setShowBookingSettingsSheet(false)
            })
          }}
          onClear={() => {
            if (state.settingsSubmitting) return

            setBookingSettingsDraft(current => ({
              ...current,
              bookingWindowDays: 7,
              availableHoursText: '09:00 - 18:00',
              slotIntervalMinutes: 30,
              closedDays: [],
              minimumNotice: 'No notice'
            }))
          }}
        >
          <h3
            style={{
              margin: 0,
              color: APK_APPOINTMENT_UI.black,
              fontSize: APK_APPOINTMENT_UI.titleSmallSize,
              lineHeight: APK_APPOINTMENT_UI.titleSmallLineHeight,
              fontWeight: APK_APPOINTMENT_UI.titleSmallWeight
            }}
          >
            Booking window
          </h3>

          <section
            style={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7].map(days => (
              <NdjcControlPillButton
                key={days}
                active={bookingSettingsDraft.bookingWindowDays === days}
                disabled={state.settingsSubmitting}
                onClick={() => {
                  if (state.settingsSubmitting) return
                  updateBookingSettingsDraft({
                    bookingWindowDays: days
                  })
                }}
              >
                {days === 1 ? '1 day' : `${days} days`}
              </NdjcControlPillButton>
            ))}
          </section>

          <h3
            style={{
              margin: 0,
              color: APK_APPOINTMENT_UI.black,
              fontSize: APK_APPOINTMENT_UI.titleSmallSize,
              lineHeight: APK_APPOINTMENT_UI.titleSmallLineHeight,
              fontWeight: APK_APPOINTMENT_UI.titleSmallWeight
            }}
          >
            Available hours
          </h3>

          <section
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            <button
              type="button"
              disabled={state.settingsSubmitting}
              style={{
                width: '100%',
                border: 0,
                borderRadius: APK_APPOINTMENT_UI.timeSettingRadius,
                padding: `${APK_APPOINTMENT_UI.timeSettingPaddingY}px ${APK_APPOINTMENT_UI.timeSettingPaddingX}px`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                color: APK_APPOINTMENT_UI.black,
                background: APK_APPOINTMENT_UI.softSurface,
                boxShadow: 'none',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (state.settingsSubmitting) return
                setEditingAvailableTimeTarget('start')
              }}
            >
              <span
                style={{
                  color: APK_APPOINTMENT_UI.black,
                  fontSize: APK_APPOINTMENT_UI.labelMediumSize,
                  lineHeight: APK_APPOINTMENT_UI.labelMediumLineHeight,
                  fontWeight: APK_APPOINTMENT_UI.labelMediumWeight
                }}
              >
                Start
              </span>

              <span
                style={{
                  color: APK_APPOINTMENT_UI.brand,
                  fontSize: APK_APPOINTMENT_UI.labelMediumSize,
                  lineHeight: APK_APPOINTMENT_UI.labelMediumLineHeight,
                  fontWeight: APK_APPOINTMENT_UI.labelMediumWeight
                }}
              >
                {normalizeAppointmentTimeText(availableHoursStart)}
              </span>
            </button>

            <button
              type="button"
              disabled={state.settingsSubmitting}
              style={{
                width: '100%',
                border: 0,
                borderRadius: APK_APPOINTMENT_UI.timeSettingRadius,
                padding: `${APK_APPOINTMENT_UI.timeSettingPaddingY}px ${APK_APPOINTMENT_UI.timeSettingPaddingX}px`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                color: APK_APPOINTMENT_UI.black,
                background: APK_APPOINTMENT_UI.softSurface,
                boxShadow: 'none',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (state.settingsSubmitting) return
                setEditingAvailableTimeTarget('end')
              }}
            >
              <span
                style={{
                  color: APK_APPOINTMENT_UI.black,
                  fontSize: APK_APPOINTMENT_UI.labelMediumSize,
                  lineHeight: APK_APPOINTMENT_UI.labelMediumLineHeight,
                  fontWeight: APK_APPOINTMENT_UI.labelMediumWeight
                }}
              >
                End
              </span>

              <span
                style={{
                  color: APK_APPOINTMENT_UI.brand,
                  fontSize: APK_APPOINTMENT_UI.labelMediumSize,
                  lineHeight: APK_APPOINTMENT_UI.labelMediumLineHeight,
                  fontWeight: APK_APPOINTMENT_UI.labelMediumWeight
                }}
              >
                {normalizeAppointmentTimeText(availableHoursEnd)}
              </span>
            </button>
          </section>

          <h3
            style={{
              margin: 0,
              color: APK_APPOINTMENT_UI.black,
              fontSize: APK_APPOINTMENT_UI.titleSmallSize,
              lineHeight: APK_APPOINTMENT_UI.titleSmallLineHeight,
              fontWeight: APK_APPOINTMENT_UI.titleSmallWeight
            }}
          >
            Slot interval
          </h3>

          <section
            style={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8
            }}
          >
            {[30, 60].map(minutes => (
              <NdjcControlPillButton
                key={minutes}
                active={bookingSettingsDraft.slotIntervalMinutes === minutes}
                disabled={state.settingsSubmitting}
                onClick={() => {
                  if (state.settingsSubmitting) return
                  updateBookingSettingsDraft({
                    slotIntervalMinutes: minutes
                  })
                }}
              >
                {minutes} min
              </NdjcControlPillButton>
            ))}
          </section>

          <h3
            style={{
              margin: 0,
              color: APK_APPOINTMENT_UI.black,
              fontSize: APK_APPOINTMENT_UI.titleSmallSize,
              lineHeight: APK_APPOINTMENT_UI.titleSmallLineHeight,
              fontWeight: APK_APPOINTMENT_UI.titleSmallWeight
            }}
          >
            Closed days
          </h3>

          <section
            style={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8
            }}
          >
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <NdjcControlPillButton
                key={day}
                active={bookingSettingsDraft.closedDays.includes(day)}
                disabled={state.settingsSubmitting}
                onClick={() => {
                  if (state.settingsSubmitting) return
                  toggleBookingClosedDayDraft(day)
                }}
              >
                {day}
              </NdjcControlPillButton>
            ))}
          </section>

          <h3
            style={{
              margin: 0,
              color: APK_APPOINTMENT_UI.black,
              fontSize: APK_APPOINTMENT_UI.titleSmallSize,
              lineHeight: APK_APPOINTMENT_UI.titleSmallLineHeight,
              fontWeight: APK_APPOINTMENT_UI.titleSmallWeight
            }}
          >
            Minimum notice
          </h3>

          <section
            style={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8
            }}
          >
            {[
              'No notice',
              '1 hour',
              '2 hours',
              '6 hours',
              '12 hours',
              '1 day',
              '2 days',
              '3 days'
            ].map(notice => (
              <NdjcControlPillButton
                key={notice}
                active={bookingSettingsDraft.minimumNotice === notice}
                disabled={state.settingsSubmitting}
                onClick={() => {
                  if (state.settingsSubmitting) return
                  updateBookingSettingsDraft({
                    minimumNotice: notice
                  })
                }}
              >
                {notice}
              </NdjcControlPillButton>
            ))}
          </section>
        </NdjcFilterBottomSheet>

        <NdjcFilterBottomSheet
          open={editingAvailableTimeTarget !== null}
          title={editingAvailableTimeTarget === 'start' ? 'Start time' : 'End time'}
          clearText=""
          applyText="Done"
          showPriceFields={false}
          showHeaderAction={false}
          onClose={() => setEditingAvailableTimeTarget(null)}
          onApply={() => setEditingAvailableTimeTarget(null)}
          onClear={() => setEditingAvailableTimeTarget(null)}
        >
          <section
            style={{
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 8
            }}
          >
            {appointmentTimeOptions().map(time => {
              const active = editingAvailableTimeTarget === 'start'
                ? availableHoursStart === time
                : availableHoursEnd === time

              return (
                <NdjcControlPillButton
                  key={time}
                  active={active}
                  disabled={state.settingsSubmitting}
                  onClick={() => {
                    if (state.settingsSubmitting) return

                    const nextStart = editingAvailableTimeTarget === 'start'
                      ? time
                      : availableHoursStart
                    const nextEnd = editingAvailableTimeTarget === 'end'
                      ? time
                      : availableHoursEnd

                    updateBookingSettingsDraft({
                      availableHoursText: `${nextStart} - ${nextEnd}`
                    })
                    setEditingAvailableTimeTarget(null)
                  }}
                >
                  {time}
                </NdjcControlPillButton>
              )
            })}
          </section>
        </NdjcFilterBottomSheet>
      </section>
    </NdjcUnifiedBackground>
  )
}

export function ShowcaseAdminAnnouncementEdit({
  state,
  actions
}: {
  state: ShowcaseAnnouncementEditUiState
  actions: ShowcaseAnnouncementEditActions
}) {
  const [coverPreview, setCoverPreview] = React.useState<{
    images: string[]
    startIndex: number
  } | null>(null)
  const [pendingExitTarget, setPendingExitTarget] = React.useState<'back' | 'home' | null>(null)
  const [showDeleteDraftConfirm, setShowDeleteDraftConfirm] = React.useState(false)
  const [showPublishConfirm, setShowPublishConfirm] = React.useState(false)
  const announcementCoverInputRef = React.useRef<HTMLInputElement | null>(null)
  const headerRef = React.useRef<HTMLElement | null>(null)
  const [headerHeight, setHeaderHeight] = React.useState(0)

  React.useEffect(() => {
    const target = headerRef.current
    if (!target) return

    const updateHeight = () => {
      setHeaderHeight(target.getBoundingClientRect().height)
    }

    updateHeight()

    if (typeof ResizeObserver === 'undefined') {
      window.setTimeout(updateHeight, 0)
      return
    }

    const observer = new ResizeObserver(updateHeight)
    observer.observe(target)

    return () => observer.disconnect()
  }, [
    state.bodyDraft,
    state.coverDraftUrl,
    state.composerExpanded,
    state.canStartNew,
    state.canDeleteSelected,
    state.canSaveDraft,
    state.canPublish,
    state.isSubmitting,
    state.isBlockingInput,
    state.selectedIds.length
  ])

  function requestExit(target: 'back' | 'home'): void {
    if (state.hasUnsavedChanges) {
      setPendingExitTarget(target)
      return
    }

    if (target === 'home') {
      actions.onBackToHome()
      return
    }

    actions.onBack()
  }

  function confirmExit(): void {
    const target = pendingExitTarget
    setPendingExitTarget(null)

    if (target === 'home') {
      actions.onBackToHome()
      return
    }

    actions.onBack()
  }

  function openAnnouncementCoverPicker(): void {
    if (state.isBlockingInput) return

    announcementCoverInputRef.current?.click()
  }

  function handleAnnouncementCoverFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.currentTarget.files?.[0] ?? null
    event.currentTarget.value = ''

    if (!file) return

    actions.onPickCover(file)
  }

  const maxChars = 200
  const body = state.bodyDraft
  const cover = state.coverDraftUrl
  const headerTopPadding = APK_PAGE_SHELL_UI.topCardOffset
  const listTopPadding = headerTopPadding + headerHeight + 10
  const deleteText = state.selectedIds.length ? `Delete (${state.selectedIds.length})` : 'Delete'

  return (
    <NdjcUnifiedBackground
      topNav={{
        onBack: () => requestExit('back'),
        onHome: () => requestExit('home')
      }}
    >
      <section
        className="ndjc-admin-announcement-edit-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        <input
          ref={announcementCoverInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAnnouncementCoverFileChange}
        />

        <section
          className="ndjc-admin-announcement-grid-layer"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            width: '100%',
            height: '100%',
            minHeight: 0,
            padding: `${listTopPadding}px ${APK_PAGE_SHELL_UI.screenPadding}px ${APK_PAGE_SHELL_UI.screenPadding}px`,
            boxSizing: 'border-box',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gridAutoRows: 'max-content',
            alignContent: 'start',
            columnGap: 10,
            rowGap: 10
          }}
          onScroll={event => ndjcHandleLoadMoreScroll(
            event,
            state.pagination,
            actions.onLoadMore
          )}
        >
          {state.draftItems.length || state.isSubmitting ? (
            <>
              {state.draftItems.map(item => (
                <AnnouncementDraftCard
                  key={item.id}
                  item={item}
                  selected={state.selectedIds.includes(item.id)}
                  onOpen={actions.onOpenItem}
                  onPreview={actions.onPreviewItem}
                  onToggleSelect={actions.onToggleSelect}
                />
              ))}

              <div
                style={{
                  gridColumn: '1 / -1'
                }}
              >
                <NdjcPaginationFooter
                  pagination={state.pagination}
                  idleText="Load more"
                  loadingText="Loading more..."
                  endText="No more drafts"
                  onLoadMore={actions.onLoadMore}
                />
              </div>
            </>
          ) : (
            <section
              style={{
                gridColumn: '1 / -1',
                width: '100%',
                minHeight: 360,
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <NdjcInlineEmptyState
                title="No drafts yet"
                message="Tap New to create an announcement draft."
                verticalPadding={0}
              />
            </section>
          )}
        </section>

        <NdjcTopScrollFadeMask
          className="ndjc-admin-announcement-header-scroll-mask"
          solidRatio={0.58}
          style={{
            zIndex: 2
          }}
        />

        <section
          ref={headerRef}
          className="ndjc-admin-announcement-header-wrap"
          style={{
            position: 'absolute',
            zIndex: 3,
            top: headerTopPadding,
            left: APK_PAGE_SHELL_UI.screenPadding,
            right: APK_PAGE_SHELL_UI.screenPadding
          }}
        >
          <NdjcWhiteCard
            className="ndjc-apk-admin-header-card ndjc-admin-announcement-header-card"
            style={{
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <section
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: APK_ANNOUNCEMENT_UI.editHeaderGap
              }}
            >
              <section
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) calc((100% - 20px) / 3)',
                  gap: 12,
                  alignItems: 'center'
                }}
              >
                <section
                  style={{
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                  }}
                >
                  <h1
                    style={{
                      margin: 0,
                      color: '#000000',
                      fontSize: 22,
                      lineHeight: 1.25,
                      fontWeight: 600
                    }}
                  >
                    Publish announcement
                  </h1>

                  <p
                    style={{
                      margin: 0,
                      color: 'rgba(0, 0, 0, 0.60)',
                      fontSize: 12,
                      lineHeight: 1.35,
                      fontWeight: 400
                    }}
                  >
                    Tap a draft card to preview it.
                  </p>
                </section>

                <NdjcPrimaryActionButton
                  disabled={!state.canStartNew}
                  onClick={actions.onStartNew}
                >
                  New
                </NdjcPrimaryActionButton>
              </section>

              <NdjcAdminPageProgressSlot active={state.isSubmitting || state.isBlockingInput} />

              {state.composerExpanded ? (
                <section
                  className="ndjc-admin-announcement-composer-inline"
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: APK_ANNOUNCEMENT_UI.editHeaderGap
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: '#000000',
                      fontSize: 12,
                      lineHeight: 1.35,
                      fontWeight: 500
                    }}
                  >
                    Cover image *
                  </p>

                  <section
                    style={{
                      width: '100%',
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
                      gap: APK_ANNOUNCEMENT_UI.editComposerCoverGap,
                      alignItems: 'start'
                    }}
                  >
                    <NdjcSingleEditableImage
                      src={cover}
                      label="Cover"
                      enabled={!state.isBlockingInput}
                      onPick={openAnnouncementCoverPicker}
                      onRemove={actions.onRemoveCover}
                      onPreview={cover?.trim() ? () => {
                        const cleanCoverUrl = cover.trim()
                        if (!cleanCoverUrl) return

                        setCoverPreview({
                          images: [cleanCoverUrl],
                          startIndex: 0
                        })
                      } : undefined}
                    />

                    <section
                      style={{
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: APK_ANNOUNCEMENT_UI.editComposerTextGap
                      }}
                    >
                      <NdjcTextField
                        value={body}
                        onChange={value => actions.onBodyChange(value.slice(0, maxChars))}
                        label="Content"
                        placeholder="Write the announcement…"
                        singleLine={false}
                        minLines={3}
                      />

                      <section
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ flex: 1, minWidth: 0 }} />

                        <span
                          style={{
                            color: 'rgba(0, 0, 0, 0.55)',
                            fontSize: 12,
                            lineHeight: 1.35,
                            fontWeight: 400,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {Math.min(body.length, maxChars)}/{maxChars}
                        </span>
                      </section>
                    </section>
                  </section>
                </section>
              ) : null}

              <section
                className="ndjc-admin-announcement-action-row"
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: APK_ANNOUNCEMENT_UI.editActionGap
                }}
              >
                <NdjcPrimaryActionButton
                  disabled={!state.canDeleteSelected || state.isSubmitting}
                  isLoading={state.submittingAction === 'delete'}
                  onClick={() => {
                    if (state.isSubmitting) return
                    setShowDeleteDraftConfirm(true)
                  }}
                >
                  {deleteText}
                </NdjcPrimaryActionButton>

                <NdjcPrimaryActionButton
                  disabled={!state.canSaveDraft || state.isSubmitting}
                  isLoading={state.submittingAction === 'save'}
                  onClick={() => {
                    if (state.isSubmitting) return
                    actions.onSaveDraft()
                  }}
                >
                  Save draft
                </NdjcPrimaryActionButton>

                <NdjcPrimaryActionButton
                  disabled={!state.canPublish || state.isSubmitting}
                  isLoading={state.submittingAction === 'publish'}
                  onClick={() => {
                    if (state.isSubmitting) return
                    setShowPublishConfirm(true)
                  }}
                >
                  Publish
                </NdjcPrimaryActionButton>
              </section>

              <div
                style={{
                  width: '100%',
                  height: 1,
                  background: APK_ANNOUNCEMENT_UI.editDividerColor
                }}
              />

              <section
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    color: APK_ANNOUNCEMENT_UI.editSelectionTextColor,
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 400
                  }}
                >
                  {state.selectedIds.length ? `${state.selectedIds.length} selected` : 'No selection'}
                </span>

                <button
                  type="button"
                  disabled={!state.selectedIds.length}
                  onClick={actions.onClearSelection}
                  style={{
                    border: 0,
                    padding: 0,
                    color: state.selectedIds.length ? APK_SHELL_UI.brand : 'rgba(0, 0, 0, 0.30)',
                    background: 'transparent',
                    boxShadow: 'none',
                    fontSize: 12,
                    lineHeight: 1.35,
                    fontWeight: 400,
                    cursor: state.selectedIds.length ? 'pointer' : 'default'
                  }}
                >
                  Clear
                </button>
              </section>
            </section>
          </NdjcWhiteCard>
        </section>

        <NdjcSnackbarHost message={state.statusMessage || state.successMessage} />

        <ShowcaseAdminAnnouncementEditPreview
          item={state.previewVisible ? state.previewItem : null}
          onClose={actions.onDismissPreview}
          onOpenImage={url => {
            const cleanUrl = url.trim()
            if (!cleanUrl) return

            setCoverPreview({
              images: [cleanUrl],
              startIndex: 0
            })
          }}
        />

        {coverPreview ? (
          <NdjcFullscreenImageViewerScreen
            images={coverPreview.images}
            startIndex={coverPreview.startIndex}
            onDismiss={() => setCoverPreview(null)}
          />
        ) : null}

        {pendingExitTarget ? (
          <NdjcBaseDialog
            title="Discard unsaved changes?"
            message="You have unsaved announcement changes. Leave this page and discard them?"
            confirmText="Discard"
            dismissText="Stay"
            destructiveConfirm
            onConfirmClick={confirmExit}
            onDismissClick={() => setPendingExitTarget(null)}
            onDismissRequest={() => setPendingExitTarget(null)}
          />
        ) : null}

        {showDeleteDraftConfirm ? (
          <NdjcBaseDialog
            title="Delete selected drafts?"
            message={`This will permanently delete ${state.selectedIds.length} selected draft item(s).`}
            confirmText="Delete"
            dismissText="Cancel"
            destructiveConfirm
            confirmEnabled={!state.isSubmitting}
            confirmLoading={state.submittingAction === 'delete'}
            onConfirmClick={() => {
              if (state.isSubmitting) return

              void Promise.resolve(actions.onDeleteSelected())
                .then(() => {
                  setShowDeleteDraftConfirm(false)
                })
            }}
            onDismissClick={() => {
              if (state.isSubmitting) return
              setShowDeleteDraftConfirm(false)
            }}
            onDismissRequest={() => {
              if (state.isSubmitting) return
              setShowDeleteDraftConfirm(false)
            }}
          />
        ) : null}

        {showPublishConfirm ? (
          <NdjcBaseDialog
            title="Publish announcement?"
            message="This will publish the current announcement immediately."
            confirmText="Publish"
            dismissText="Cancel"
            confirmEnabled={!state.isSubmitting}
            confirmLoading={state.submittingAction === 'publish'}
            onConfirmClick={() => {
              if (state.isSubmitting) return

              void Promise.resolve(actions.onPushNow())
                .then(() => {
                  setShowPublishConfirm(false)
                })
            }}
            onDismissClick={() => {
              if (state.isSubmitting) return
              setShowPublishConfirm(false)
            }}
            onDismissRequest={() => {
              if (state.isSubmitting) return
              setShowPublishConfirm(false)
            }}
          />
        ) : null}

      </section>
    </NdjcUnifiedBackground>
  )
}