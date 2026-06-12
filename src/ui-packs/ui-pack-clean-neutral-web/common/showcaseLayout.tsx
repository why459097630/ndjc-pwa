'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import {
  APK_SHOWCASE_COLOR_TOKENS,
  NDJC_BOTTOM_BAR_HEIGHT_CSS_VAR,
  NDJC_BOTTOM_BAR_RESERVE_CSS_VAR,
  cx
} from './showcaseTokens'

export type BackHomeActions = {
  onBack?: () => void
  onBackToHome?: () => void
}

export type BottomActions = {
  onOpenStoreProfileView: () => void
  onOpenChat: () => void
  onOpenCustomerBookings: () => void
  onOpenAnnouncements: () => void
  onOpenFavorites: () => void
}
export type ShowcaseBottomBarTab =
  | 'Store'
  | 'Chat'
  | 'Appointments'
  | 'Favorites'
  | 'Announcements'

export const NdjcBottomBarHostContext = React.createContext<React.ReactNode>(null)

export const APK_SHELL_UI = {
  black: '#000000',
  white: '#ffffff',
  transparent: 'transparent',
  pageBg: '#eff3f2',
  brand: APK_SHOWCASE_COLOR_TOKENS.accent,
  green: APK_SHOWCASE_COLOR_TOKENS.primary,
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

  backButtonSize: 48,
  backButtonRadius: 20,
  backButtonShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  backButtonPressedShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
  backButtonIconSize: 22,
  backButtonPressedScale: 0.97,
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
  bgCirclePinkStart: `rgba(${APK_SHOWCASE_COLOR_TOKENS.accentRgb}, 0.22)`,
  bgCirclePinkEnd: `rgba(${APK_SHOWCASE_COLOR_TOKENS.accentRgb}, 0)`
} as const

export const apkShellScreenStyle: React.CSSProperties = {
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

export const apkPhoneSurfaceStyle: React.CSSProperties = {
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

export const apkUnifiedBackgroundSurfaceStyle: React.CSSProperties = {
  ...apkPhoneSurfaceStyle,
  width: APK_SHELL_UI.phoneViewportWidth,
  minWidth: 0,
  maxWidth: APK_SHELL_UI.phoneMaxWidth,
  height: '100dvh',
  minHeight: '100dvh',
  maxHeight: '100dvh',
  background: APK_SHELL_UI.pageBg
}
export const apkWhiteCardStyle: React.CSSProperties = {
  border: 0,
  borderRadius: APK_SHELL_UI.whiteCardRadius,
  padding: `${APK_SHELL_UI.whiteCardPaddingY}px ${APK_SHELL_UI.whiteCardPaddingX}px`,
  background: APK_SHELL_UI.white,
  boxShadow: APK_SHELL_UI.whiteCardShadow
}

export function apkBackButtonStyle(
  pressed = false,
  iconOnly = false,
  iconTint: string = '#111111'
): React.CSSProperties {
  const resolvedIconTint = iconTint

  return {
    width: APK_SHELL_UI.backButtonSize,
    height: APK_SHELL_UI.backButtonSize,
    minWidth: APK_SHELL_UI.backButtonSize,
    minHeight: APK_SHELL_UI.backButtonSize,
    border: 0,
    borderRadius: APK_SHELL_UI.backButtonRadius,
    padding: 0,
    display: 'grid',
    placeItems: 'center',
    color: pressed ? '#000000' : resolvedIconTint,
    background: APK_SHELL_UI.transparent,
    boxShadow: 'none',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
    fontSize: iconOnly ? 24 : APK_SHELL_UI.backButtonIconSize,
    lineHeight: 0,
    fontWeight: 900,
    transform: pressed ? 'scale(0.985)' : 'scale(1)',
    transformOrigin: 'center',
    transition: `color ${APK_SHELL_UI.backButtonPressedDurationMs}ms ease, transform ${APK_SHELL_UI.backButtonPressedDurationMs}ms ease`
  }
}

export const apkBackButtonIconWrapStyle: React.CSSProperties = {
  width: APK_SHELL_UI.backButtonIconSize,
  height: APK_SHELL_UI.backButtonIconSize,
  display: 'grid',
  placeItems: 'center',
  lineHeight: 0
}

export const apkBackButtonTextIconStyle: React.CSSProperties = {
  display: 'block',
  color: 'currentColor',
  fontSize: APK_SHELL_UI.backButtonIconSize,
  lineHeight: 1,
  fontWeight: 900
}

export function NdjcBackArrowSvgIcon() {
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
        d="M15.5 5L8.5 12L15.5 19"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const apkTopNavOverlayStyle: React.CSSProperties = {
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

export function apkBgCircleStyle({
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

export const apkPullRefreshRootStyle: React.CSSProperties = {
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

export const apkPullRefreshIndicatorWrapStyle: React.CSSProperties = {
  position: 'absolute',
  top: APK_SHELL_UI.pullRefreshIndicatorTop,
  left: 0,
  right: 0,
  zIndex: 20,
  display: 'grid',
  placeItems: 'center',
  pointerEvents: 'none'
}

export const apkPullRefreshIndicatorStyle: React.CSSProperties = {
  background: APK_SHELL_UI.white,
  boxShadow: APK_SHELL_UI.whiteCardShadow
}

export const apkPullRefreshHintStyle: React.CSSProperties = {
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

export const apkPullRefreshHintPillStyle: React.CSSProperties = {
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

export const apkHomeEntryOverlayStyle: React.CSSProperties = {
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

export const apkScreenHeaderStyle: React.CSSProperties = {
  width: '100%',
  padding: `calc(${APK_SHELL_UI.topNavTopPadding}px + env(safe-area-inset-top)) ${APK_SHELL_UI.topNavHorizontalPadding}px ${APK_SHELL_UI.topNavToCardSpacing}px`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

export const apkTitleBlockStyle: React.CSSProperties = {
  padding: `0 ${APK_SHELL_UI.titleBlockPaddingX}px`,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: APK_SHELL_UI.titleBlockGap,
  alignItems: 'center'
}

export const apkScreenContentStyle: React.CSSProperties = {
  padding: `${APK_SHELL_UI.contentPaddingTop}px ${APK_SHELL_UI.contentPaddingX}px ${APK_SHELL_UI.contentPaddingBottom}px`,
  display: 'grid',
  gap: 14
}

export const APK_HOME_PAGE_UI = {
  controlsGap: 4,
  chipsToListGap: 12,
  screenHorizontalPadding: 18,
  screenVerticalPadding: 8,
  chipRowHorizontalPadding: 18,
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

export const APK_PAGE_SHELL_UI = {
  screenPadding: APK_SHELL_UI.whiteCardScreenPadding,
  topCardOffset: APK_SHELL_UI.whiteCardTopOffset,

  tabBottomReserve: APK_HOME_PAGE_UI.floatingBottomBarReserve,
  noBottomBarReserve: 32,
  stickyActionReserve: 72,

  normalGap: 10,
  cardGap: 12
} as const

export const apkHomeRootStyle: React.CSSProperties = {
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

export const apkHomeControlsStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  paddingTop: 11,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  alignContent: 'start',
  gap: 0,
  zIndex: 2,
  overflowX: 'hidden',
  boxSizing: 'border-box'
}

export const apkHomeControlsGapStyle: React.CSSProperties = {
  height: APK_HOME_PAGE_UI.controlsGap + 2
}

export const apkHomeTagsWrapStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  padding: `0 ${APK_HOME_PAGE_UI.chipRowHorizontalPadding}px ${APK_HOME_PAGE_UI.controlsGap}px`,
  overflowX: 'hidden',
  boxSizing: 'border-box'
}

export const apkHomeSortWrapStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  padding: `0 ${APK_HOME_PAGE_UI.chipRowHorizontalPadding}px ${APK_HOME_PAGE_UI.controlsGap}px`,
  overflowX: 'hidden',
  boxSizing: 'border-box'
}

export const apkHomeCategoryWrapStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  padding: `${APK_HOME_PAGE_UI.controlsGap + 2}px ${APK_HOME_PAGE_UI.chipRowHorizontalPadding}px ${APK_HOME_PAGE_UI.chipsToListGap}px`,
  overflowX: 'hidden',
  boxSizing: 'border-box'
}

export const apkHomeListStyle: React.CSSProperties = {
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

export const apkHomeGridRowStyle: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: APK_HOME_PAGE_UI.listItemSpacing,
  alignItems: 'stretch',
  boxSizing: 'border-box'
}

export const apkHomeGridPlaceholderStyle: React.CSSProperties = {
  minWidth: 0
}

export const apkHomeBottomBarHostStyle: React.CSSProperties = {
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

export const apkHomeEmptyWrapStyle: React.CSSProperties = {
  minHeight: 0,
  height: '100%',
  padding: `0 ${APK_PAGE_SHELL_UI.screenPadding}px var(${NDJC_BOTTOM_BAR_RESERVE_CSS_VAR}, ${APK_PAGE_SHELL_UI.tabBottomReserve}px)`,
  display: 'grid',
  placeItems: 'center',
  zIndex: 2
}

export const apkHomeRefreshIndicatorWrapStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(8px + env(safe-area-inset-top))',
  left: 0,
  right: 0,
  zIndex: 30,
  display: 'grid',
  placeItems: 'center',
  pointerEvents: 'none'
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

export function isNdjcInteractivePointerTarget(target: EventTarget | null): boolean {
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

export function shouldSkipNdjcPullRefreshPointer(event: React.PointerEvent<HTMLElement>): boolean {
  if (event.pointerType === 'touch' || event.pointerType === 'pen') return true
  return isNdjcInteractivePointerTarget(event.target)
}

export function getNdjcKeyboardViewportHeightPx(): number {
  if (typeof window === 'undefined') return 0

  const layoutHeight = Math.max(0, Math.round(window.innerHeight || 0))
  const visualViewport = window.visualViewport

  if (!visualViewport) return layoutHeight

  const visualHeight = Math.max(0, Math.round(visualViewport.height || 0))

  if (visualHeight > 0) return visualHeight

  return layoutHeight
}

export function getNdjcVisualViewportOffsetTopPx(): number {
  if (typeof window === 'undefined') return 0

  const visualViewport = window.visualViewport
  if (!visualViewport) return 0

  const offsetTop = Math.max(0, Math.round(visualViewport.offsetTop || 0))

  return offsetTop
}

export function syncNdjcKeyboardViewportCssVars(): void {
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

export function clearNdjcKeyboardViewportCssVars(): void {
  if (typeof document === 'undefined') return

  document.documentElement.style.removeProperty('--ndjc-stable-viewport-height')
  document.documentElement.style.removeProperty('--ndjc-visual-viewport-offset-top')
  document.documentElement.style.removeProperty('--ndjc-keyboard-inset')
}

export function NdjcChatKeyboardDebugPanel(): React.ReactElement | null {
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

export const NDJC_TOP_SCROLL_FADE_MASK_HEIGHT = 220
export const NDJC_TOP_SCROLL_FADE_MASK_COLOR = '#eef4f2'
export const NDJC_TOP_SCROLL_FADE_MASK_TRANSPARENT_COLOR = 'rgba(238, 244, 242, 0)'

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

export function NdjcHomeOutlineIcon({
  color = '#111111'
}: {
  color?: string
}) {
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
        d="M4.5 10.75L12 4.5l7.5 6.25"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 10.75V19.25H10.25V15.25H13.75V19.25H17.25V10.75"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function NdjcCardBackButton({
  onClick,
  label = 'Back',
  icon,
  iconOnly = false,
  iconTint = '#111111'
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
        <NdjcCardBackButton onClick={onBack || onHome} label="Back" icon={<NdjcBackArrowSvgIcon />} iconTint="#111111" />
      </span>

      <span style={{ pointerEvents: 'auto' }}>
        <NdjcCardBackButton onClick={onHome} label="Home" icon={<NdjcHomeOutlineIcon color="#111111" />} iconTint="#111111" />
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
      : `rgba(${APK_SHOWCASE_COLOR_TOKENS.primaryRgb}, 0.25)`

  const activeColor = tone === 'light'
    ? '#ffffff'
    : tone === 'danger'
      ? '#e53935'
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

