'use client'

import React from 'react'
import {
  NDJC_BOTTOM_BAR_HEIGHT_CSS_VAR,
  NDJC_BOTTOM_BAR_RESERVE_CSS_VAR,
  NDJC_GLOBAL_UI_TOKENS,
  cx
} from './showcaseTokens'
import {
  APK_SHELL_UI,
  NdjcBottomBarHostContext
} from './showcaseLayout'
import type {
  BottomActions,
  ShowcaseBottomBarTab
} from './showcaseLayout'
import {
  APK_EDIT_ITEM_UI,
  APK_FILTER_UI,
  apkFilterChipStyle,
  apkFilterLazyRowStyle,
  apkSortNavItemStyle,
  apkSortNavOuterItemStyle,
  apkSortNavTextStyle
} from './showcaseControls'
import { NDJC_ADMIN_TOOL_UI } from './showcaseAdmin'

export const APK_HOME_NAV_UI = {
  topBarHorizontalPadding: 18,
  topBarTopPadding: 8,
  topBarBottomPadding: 0,
  topBannerHeight: 48,
  topBannerRadius: 999,
  topBannerGradientTop: '#ffffff',
  topBannerGradientBottom: '#ffffff',
  topBannerInnerPaddingX: 16,
  topBannerInnerPaddingY: 4,
  searchBarHeight: 40,
  searchIconSize: 18,
  searchTextStartSpacing: 8,
  searchTextColor: '#111111',
  searchPlaceholderColor: '#8A94A6',
  searchFontSize: 16,
  profileButtonSize: 32,
  profileIconSize: 21,
  profileButtonBg: 'transparent',

  bottomBarHeight: 48,
  bottomBarDividerColor: NDJC_GLOBAL_UI_TOKENS.colors.divider,
  bottomBarBg: NDJC_GLOBAL_UI_TOKENS.colors.surfaceSoft,
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
  bottomTabActiveColor: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
  bottomTabInactiveColor: NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
  bottomTabDotColor: NDJC_GLOBAL_UI_TOKENS.colors.danger
} as const

export const apkTopSearchOuterStyle: React.CSSProperties = {
  width: '100%',
  padding: `calc(${APK_HOME_NAV_UI.topBarTopPadding}px + env(safe-area-inset-top)) ${APK_HOME_NAV_UI.topBarHorizontalPadding}px ${APK_HOME_NAV_UI.topBarBottomPadding}px`,
  display: 'grid',
  background: APK_SHELL_UI.pageBg,
  boxSizing: 'border-box'
}

export const apkTopSearchBarStyle: React.CSSProperties = {
  width: '100%',
  height: APK_HOME_NAV_UI.topBannerHeight,
  borderRadius: APK_HOME_NAV_UI.topBannerRadius,
  display: 'grid',
  alignItems: 'center',
  color: APK_HOME_NAV_UI.searchTextColor,
  background: '#ffffff',
  border: '1px solid rgba(0, 0, 0, 0.035)',
  boxShadow: '0 8px 22px rgba(0, 0, 0, 0.025)',
  overflow: 'hidden',
  boxSizing: 'border-box'
}

export const apkTopSearchInnerRowStyle: React.CSSProperties = {
  width: '100%',
  padding: `${APK_HOME_NAV_UI.topBannerInnerPaddingY}px ${APK_HOME_NAV_UI.topBannerInnerPaddingX}px`,
  display: 'grid',
  gridTemplateColumns: `minmax(0, 1fr) ${APK_HOME_NAV_UI.profileButtonSize}px`,
  gap: 8,
  alignItems: 'center',
  boxSizing: 'border-box'
}

export const apkTopSearchInputWrapStyle: React.CSSProperties = {
  minWidth: 0,
  height: APK_HOME_NAV_UI.searchBarHeight,
  display: 'grid',
  gridTemplateColumns: `${APK_HOME_NAV_UI.searchIconSize}px ${APK_HOME_NAV_UI.searchTextStartSpacing}px minmax(0, 1fr)`,
  alignItems: 'center'
}

export const apkTopSearchIconStyle: React.CSSProperties = {
  width: APK_HOME_NAV_UI.searchIconSize,
  height: APK_HOME_NAV_UI.searchIconSize,
  display: 'grid',
  placeItems: 'center',
  color: '#111111',
  fontSize: APK_HOME_NAV_UI.searchIconSize,
  lineHeight: 1,
  fontWeight: 800
}

export const apkTopSearchInputStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  height: '100%',
  border: 0,
  outline: 0,
  color: '#111111',
  background: 'transparent',
  fontSize: APK_HOME_NAV_UI.searchFontSize,
  lineHeight: `${APK_HOME_NAV_UI.searchFontSize}px`,
  fontWeight: 500
}

export const apkTopSearchFilterButtonStyle: React.CSSProperties = {
  height: APK_HOME_NAV_UI.profileButtonSize,
  minWidth: 54,
  border: 0,
  borderRadius: 999,
  padding: '0 12px',
  display: 'inline-grid',
  placeItems: 'center',
  color: '#111111',
  background: 'transparent',
  boxShadow: 'none',
  fontSize: 12,
  lineHeight: 1,
  fontWeight: 700,
  whiteSpace: 'nowrap'
}

export const apkTopSearchRoundButtonStyle: React.CSSProperties = {
  width: APK_HOME_NAV_UI.profileButtonSize,
  minWidth: APK_HOME_NAV_UI.profileButtonSize,
  height: APK_HOME_NAV_UI.profileButtonSize,
  border: 0,
  borderRadius: 999,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  color: '#111111',
  background: 'transparent',
  boxShadow: 'none',
  fontSize: APK_HOME_NAV_UI.profileIconSize,
  lineHeight: 1,
  fontWeight: 500,
  boxSizing: 'border-box'
}

export function NdjcSearchOutlinedIcon() {
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

export function NdjcAccountCircleOutlinedIcon() {
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

export function NdjcTopSearchStorefrontIcon() {
  return (
    <svg
      width={APK_HOME_NAV_UI.profileIconSize}
      height={APK_HOME_NAV_UI.profileIconSize}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path
        d="M4.5 10.5h15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5.5 10.5l1-5h11l1 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10.5V19h11v-8.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 19v-4.5h5V19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function NdjcStorefrontIcon({ filled = false }: { filled?: boolean }) {
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

export function NdjcChatBubbleIcon({ filled = false }: { filled?: boolean }) {
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

export function NdjcBookingsIcon({ filled = false }: { filled?: boolean }) {
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

export function NdjcNotificationsIcon({ filled = false }: { filled?: boolean }) {
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

export function NdjcBookmarkIcon({ filled = false }: { filled?: boolean }) {
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

export const apkBottomBarStyle: React.CSSProperties = {
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
  overflow: 'hidden',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)'
}

export const apkBottomBarDividerStyle: React.CSSProperties = {
  width: '100%',
  height: 1,
  background: APK_HOME_NAV_UI.bottomBarDividerColor
}

export const apkBottomBarRowStyle: React.CSSProperties = {
  width: '100%',
  height: APK_HOME_NAV_UI.bottomBarHeight,
  padding: `0 ${APK_HOME_NAV_UI.bottomBarPaddingX}px`,
  display: 'grid',
  gridTemplateColumns: 'repeat(var(--ndjc-bottom-tab-count, 5), minmax(0, 1fr))',
  gap: 0,
  alignItems: 'center',
  boxSizing: 'border-box'
}

export function apkBottomTabStyle(active?: boolean): React.CSSProperties {
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

export const apkBottomTabIconBoxStyle: React.CSSProperties = {
  position: 'relative',
  width: APK_HOME_NAV_UI.bottomTabIconSize,
  height: APK_HOME_NAV_UI.bottomTabIconSize,
  display: 'grid',
  placeItems: 'center',
  color: 'currentColor'
}

export const apkBottomTabIconStyle: React.CSSProperties = {
  width: APK_HOME_NAV_UI.bottomTabIconSize,
  height: APK_HOME_NAV_UI.bottomTabIconSize,
  display: 'grid',
  placeItems: 'center',
  color: 'currentColor',
  fontSize: APK_HOME_NAV_UI.bottomTabIconSize,
  lineHeight: 1,
  fontWeight: 700
}

export const apkBottomTabDotStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  right: -APK_HOME_NAV_UI.bottomTabDotOffsetX,
  width: APK_HOME_NAV_UI.bottomTabDotSize,
  height: APK_HOME_NAV_UI.bottomTabDotSize,
  borderRadius: 999,
  background: APK_HOME_NAV_UI.bottomTabDotColor
}

export const apkBottomTabLabelStyle: React.CSSProperties = {
  maxWidth: '100%',
  color: 'currentColor',
  fontSize: APK_HOME_NAV_UI.bottomTabLabelSize,
  lineHeight: `${APK_HOME_NAV_UI.bottomTabLabelSize}px`,
  fontWeight: 'inherit',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

export function NdjcBottomTabVertical({
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

export function SortNavEqualItem({
  text,
  selected,
  onClick,
  variant = 'equal'
}: {
  text: string
  selected: boolean
  onClick: () => void
  variant?: 'equal' | 'segmented'
}) {
  const [pressed, setPressed] = React.useState(false)

  if (variant === 'segmented') {
    return (
      <button
        type="button"
        className={cx('ndjc-sort-nav-equal-item', 'ndjc-sort-nav-segmented-item', selected && 'is-selected')}
        onClick={onClick}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        role="tab"
        aria-selected={selected}
        aria-pressed={selected}
        style={{
          width: '100%',
          minWidth: 0,
          height: 28,
          minHeight: 28,
          border: 0,
          borderRadius: NDJC_ADMIN_TOOL_UI.segmentedInnerRadius,
          padding: '0 10px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: selected ? NDJC_ADMIN_TOOL_UI.white : NDJC_ADMIN_TOOL_UI.weakText,
          background: selected ? NDJC_ADMIN_TOOL_UI.emphasis : 'transparent',
          boxShadow: 'none',
          fontSize: 12,
          lineHeight: 1,
          fontWeight: selected ? 700 : 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          transform: pressed ? 'scale(0.97)' : 'scale(1)',
          transition: 'background 140ms ease, color 140ms ease, transform 120ms ease'
        }}
      >
        <span
          style={{
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {text}
        </span>
      </button>
    )
  }

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
  columns = APK_FILTER_UI.rowEqualColumns,
  variant = 'equal',
  ariaLabel = 'Sort and filter'
}: {
  children: React.ReactNode
  columns?: number
  variant?: 'equal' | 'segmented'
  ariaLabel?: string
}) {
  if (variant === 'segmented') {
    return (
      <section
        className="ndjc-sort-row ndjc-sort-row-segmented"
        style={{
          width: '100%',
          height: 36,
          padding: 4,
          boxSizing: 'border-box',
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: 4,
          alignItems: 'center',
          borderRadius: NDJC_ADMIN_TOOL_UI.segmentedOuterRadius,
          background: APK_EDIT_ITEM_UI.fieldBackground,
          boxShadow: 'none'
        }}
        role="tablist"
        aria-label={ariaLabel}
      >
        {children}
      </section>
    )
  }

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
      aria-label={ariaLabel}
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
              aria-label="Open store admin"
            >
              <NdjcTopSearchStorefrontIcon />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function TagsFilterRow({
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

export function HomeSortNavEqualRow({
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
