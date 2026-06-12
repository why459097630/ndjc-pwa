'use client'

import React from 'react'
import {
  APK_SHOWCASE_COLOR_TOKENS,
  NDJC_GLOBAL_UI_TOKENS,
  cx
} from './showcaseTokens'
import { APK_SHELL_UI } from './showcaseLayout'
import { APK_EDIT_ITEM_UI } from './showcaseControls'
import { APK_SHOWCASE_ITEM_UI } from './showcaseCatalog'

export const NDJC_ADMIN_TOOL_UI = {
  emphasis: NDJC_GLOBAL_UI_TOKENS.colors.controlEmphasis,
  weakText: NDJC_GLOBAL_UI_TOKENS.colors.controlWeakText,
  disabledBg: NDJC_GLOBAL_UI_TOKENS.colors.controlDisabledSurface,
  white: NDJC_GLOBAL_UI_TOKENS.colors.surface,
  segmentedOuterRadius: 14,
  segmentedInnerRadius: 11,
  actionButtonRadius: 14,
  actionButtonHeight: 32
} as const

export function apkAdminActionButtonStyle(
  active?: boolean,
  disabled?: boolean,
  fullWidth?: boolean,
  pressed = false
): React.CSSProperties {
  const enabled = Boolean(active) && !disabled

  return {
    width: fullWidth ? '100%' : undefined,
    minWidth: 0,
    height: NDJC_ADMIN_TOOL_UI.actionButtonHeight,
    minHeight: NDJC_ADMIN_TOOL_UI.actionButtonHeight,
    border: 0,
    borderRadius: NDJC_ADMIN_TOOL_UI.actionButtonRadius,
    padding: '0 14px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    color: enabled ? NDJC_ADMIN_TOOL_UI.white : NDJC_ADMIN_TOOL_UI.weakText,
    background: enabled ? NDJC_ADMIN_TOOL_UI.emphasis : NDJC_ADMIN_TOOL_UI.disabledBg,
    boxShadow: 'none',
    fontSize: 12,
    lineHeight: 1,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: 1,
    cursor: enabled ? 'pointer' : 'not-allowed',
    boxSizing: 'border-box',
    appearance: 'none',
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation',
    transform: enabled && pressed ? 'scale(0.98)' : 'scale(1)',
    transition: 'background 140ms ease, color 140ms ease, transform 120ms ease'
  }
}

export type NdjcAdminEntryIconName =
  | 'add'
  | 'items'
  | 'categories'
  | 'store'
  | 'messages'
  | 'announcements'
  | 'appointments'
  | 'password'
  | 'signOut'

export function NdjcAdminEntryIcon({
  name
}: {
  name: NdjcAdminEntryIconName
}) {
  const iconProps = {
    width: 19,
    height: 19,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': 'true' as const
  }

  if (name === 'add') {
    return (
      <svg {...iconProps}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    )
  }

  if (name === 'items') {
    return (
      <svg {...iconProps}>
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
        <path d="M3 6h.01" />
        <path d="M3 12h.01" />
        <path d="M3 18h.01" />
      </svg>
    )
  }

  if (name === 'categories') {
    return (
      <svg {...iconProps}>
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="4" width="6" height="6" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
      </svg>
    )
  }

  if (name === 'store') {
    return (
      <svg {...iconProps}>
        <path d="M4 10h16" />
        <path d="M5 10l1.2-5h11.6L19 10" />
        <path d="M6 10v9h12v-9" />
        <path d="M9 19v-5h6v5" />
      </svg>
    )
  }

  if (name === 'messages') {
    return (
      <svg {...iconProps}>
        <path d="M5 6h14v10H8l-4 4V6z" />
        <path d="M8 10h8" />
        <path d="M8 13h5" />
      </svg>
    )
  }

  if (name === 'announcements') {
    return (
      <svg {...iconProps}>
        <path d="M4 11v2a2 2 0 0 0 2 2h2l6 4V5l-6 4H6a2 2 0 0 0-2 2z" />
        <path d="M18 9a4 4 0 0 1 0 6" />
      </svg>
    )
  }

  if (name === 'appointments') {
    return (
      <svg {...iconProps}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
        <path d="M4 10h16" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    )
  }

  if (name === 'password') {
    return (
      <svg {...iconProps}>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        <path d="M12 14v2" />
      </svg>
    )
  }

  return (
    <svg {...iconProps}>
      <path d="M10 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </svg>
  )
}

export function NdjcAdminEntryButton({
  children,
  description,
  iconName,
  onClick,
  disabled,
  className
}: {
  children: React.ReactNode
  description?: React.ReactNode
  iconName: NdjcAdminEntryIconName
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  const blocked = Boolean(disabled)
  const [pressed, setPressed] = React.useState(false)

  function releasePressState(): void {
    setPressed(false)
  }

  return (
    <button
      type="button"
      className={cx('ndjc-admin-entry-button', className)}
      disabled={blocked}
      style={{
        width: '100%',
        minHeight: description
          ? NDJC_GLOBAL_UI_TOKENS.components.entryRow.minHeightWithDescription
          : NDJC_GLOBAL_UI_TOKENS.components.entryRow.minHeight,
        borderRadius: NDJC_GLOBAL_UI_TOKENS.components.entryRow.radius,
        border: 0,
        background: 'transparent',
        color: blocked
          ? NDJC_GLOBAL_UI_TOKENS.colors.textDisabled
          : NDJC_GLOBAL_UI_TOKENS.colors.textBody,
        boxShadow: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: NDJC_GLOBAL_UI_TOKENS.components.entryRow.gap,
        padding: `${NDJC_GLOBAL_UI_TOKENS.components.entryRow.paddingY}px ${NDJC_GLOBAL_UI_TOKENS.components.entryRow.paddingX}px`,
        boxSizing: 'border-box',
        cursor: blocked ? 'not-allowed' : 'pointer',
        transform: pressed
          ? `scale(${NDJC_GLOBAL_UI_TOKENS.motion.pressScale})`
          : 'scale(1)',
        transformOrigin: 'left center',
        transition: `color ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, transform ${NDJC_GLOBAL_UI_TOKENS.motion.fast}`,
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        textAlign: 'left'
      }}
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
    >
      <span
        style={{
          width: NDJC_GLOBAL_UI_TOKENS.icon.entryContainerSize,
          height: NDJC_GLOBAL_UI_TOKENS.icon.entryContainerSize,
          display: 'inline-grid',
          placeItems: 'center',
          color: blocked
            ? NDJC_GLOBAL_UI_TOKENS.colors.iconDisabled
            : pressed
              ? APK_SHOWCASE_COLOR_TOKENS.primaryPressed
              : APK_SHOWCASE_COLOR_TOKENS.primary,
          flexShrink: 0,
          transform: pressed
            ? `scale(${NDJC_GLOBAL_UI_TOKENS.motion.iconPressScale})`
            : 'scale(1)',
          transition: `color ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, transform ${NDJC_GLOBAL_UI_TOKENS.motion.fast}`
        }}
      >
        <NdjcAdminEntryIcon name={iconName} />
      </span>

      <span
        style={{
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          overflow: 'hidden'
        }}
      >
        <span
          style={{
            minWidth: 0,
            color: blocked
              ? NDJC_GLOBAL_UI_TOKENS.colors.textDisabled
              : pressed
                ? NDJC_GLOBAL_UI_TOKENS.colors.textPrimary
                : NDJC_GLOBAL_UI_TOKENS.colors.textStrong,
            fontSize: NDJC_GLOBAL_UI_TOKENS.typography.entryTitle.fontSize,
            lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.entryTitle.lineHeight,
            fontWeight: pressed
              ? NDJC_GLOBAL_UI_TOKENS.typography.entryTitle.pressedFontWeight
              : NDJC_GLOBAL_UI_TOKENS.typography.entryTitle.fontWeight,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            transition: `color ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, font-weight ${NDJC_GLOBAL_UI_TOKENS.motion.fast}`
          }}
        >
          {children}
        </span>

        {description ? (
          <span
            style={{
              minWidth: 0,
              color: blocked
                ? NDJC_GLOBAL_UI_TOKENS.colors.textDisabledSoft
                : pressed
                  ? NDJC_GLOBAL_UI_TOKENS.colors.textSoft
                  : NDJC_GLOBAL_UI_TOKENS.colors.textMuted,
              fontSize: NDJC_GLOBAL_UI_TOKENS.typography.entryDescription.fontSize,
              lineHeight: NDJC_GLOBAL_UI_TOKENS.typography.entryDescription.lineHeight,
              fontWeight: pressed
                ? NDJC_GLOBAL_UI_TOKENS.typography.entryDescription.pressedFontWeight
                : NDJC_GLOBAL_UI_TOKENS.typography.entryDescription.fontWeight,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: `color ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, font-weight ${NDJC_GLOBAL_UI_TOKENS.motion.fast}`
            }}
          >
            {description}
          </span>
        ) : null}
      </span>
    </button>
  )
}

export type NdjcCollapsibleAdminHeaderOptions = {
  collapseThresholdPx?: number
  topPadding?: number
  headerBottomPadding?: number
  collapsedHeaderBottomPadding?: number
  listGap?: number
  measureKey?: string
  expandedHeaderContentHeight?: number
  collapsedHeaderContentHeight?: number
}

export type NdjcCollapsibleAdminHeaderState = {
  collapsed: boolean
  headerRef: React.MutableRefObject<HTMLElement | null>
  headerHeight: number
  headerContentHeight: number
  headerBottomPadding: number
  headerTotalHeight: number
  listTopPadding: number
  handleCollapseScroll: (event: React.UIEvent<HTMLElement>) => void
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export function useNdjcCollapsibleAdminHeader({
  collapseThresholdPx = 24,
  topPadding = NDJC_GLOBAL_UI_TOKENS.layout.contentPaddingTop,
  headerBottomPadding = APK_EDIT_ITEM_UI.sectionCardGap,
  collapsedHeaderBottomPadding,
  listGap = APK_SHOWCASE_ITEM_UI.adminItemsListGap,
  measureKey = '',
  expandedHeaderContentHeight,
  collapsedHeaderContentHeight
}: NdjcCollapsibleAdminHeaderOptions = {}): NdjcCollapsibleAdminHeaderState {
  const [collapsed, setCollapsed] = React.useState(false)
  const headerRef = React.useRef<HTMLElement | null>(null)
  const [measuredHeaderHeight, setMeasuredHeaderHeight] = React.useState(0)

  React.useEffect(() => {
    const target = headerRef.current
    if (!target) return

    const updateHeight = () => {
      setMeasuredHeaderHeight(target.getBoundingClientRect().height)
    }

    updateHeight()

    if (typeof ResizeObserver === 'undefined') {
      window.setTimeout(updateHeight, 0)
      return
    }

    const observer = new ResizeObserver(updateHeight)
    observer.observe(target)

    return () => observer.disconnect()
  }, [measureKey])

  const handleCollapseScroll = React.useCallback((event: React.UIEvent<HTMLElement>) => {
    const nextCollapsed = event.currentTarget.scrollTop > collapseThresholdPx

    setCollapsed(previous => {
      return previous === nextCollapsed ? previous : nextCollapsed
    })
  }, [collapseThresholdPx])

  const fixedHeaderContentHeight = typeof expandedHeaderContentHeight === 'number' && typeof collapsedHeaderContentHeight === 'number'
    ? collapsed
      ? collapsedHeaderContentHeight
      : expandedHeaderContentHeight
    : null

  const currentHeaderBottomPadding = collapsed
    ? collapsedHeaderBottomPadding ?? headerBottomPadding
    : headerBottomPadding

  const headerContentHeight = fixedHeaderContentHeight ?? measuredHeaderHeight
  const headerTotalHeight = topPadding + headerContentHeight + currentHeaderBottomPadding
  const listTopPadding = headerTotalHeight + listGap

  return {
    collapsed,
    headerRef,
    headerHeight: measuredHeaderHeight,
    headerContentHeight,
    headerBottomPadding: currentHeaderBottomPadding,
    headerTotalHeight,
    listTopPadding,
    handleCollapseScroll,
    setCollapsed
  }
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
        background: active ? `rgba(${APK_SHOWCASE_COLOR_TOKENS.primaryRgb}, 0.25)` : 'transparent',
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

export const APK_ADMIN_UI = {
  cardGap: NDJC_GLOBAL_UI_TOKENS.admin.cardGap,
  cloudInnerGap: NDJC_GLOBAL_UI_TOKENS.admin.cloudInnerGap,
  cloudLineGap: NDJC_GLOBAL_UI_TOKENS.admin.cloudLineGap,
  spacer8: NDJC_GLOBAL_UI_TOKENS.admin.spacer8,
  spacer6: NDJC_GLOBAL_UI_TOKENS.admin.spacer6,
  statusSpacer: NDJC_GLOBAL_UI_TOKENS.admin.statusSpacer,
  titleFontSize: NDJC_GLOBAL_UI_TOKENS.typography.adminPageTitle.fontSize,
  titleLineHeight: NDJC_GLOBAL_UI_TOKENS.typography.adminPageTitle.lineHeight,
  titleFontWeight: NDJC_GLOBAL_UI_TOKENS.typography.adminPageTitle.fontWeight,
  titleLetterSpacing: NDJC_GLOBAL_UI_TOKENS.typography.adminPageTitle.letterSpacing,
  cloudTitleFontSize: NDJC_GLOBAL_UI_TOKENS.typography.adminCloudTitle.fontSize,
  cloudTitleLineHeight: NDJC_GLOBAL_UI_TOKENS.typography.adminCloudTitle.lineHeight,
  cloudTitleFontWeight: NDJC_GLOBAL_UI_TOKENS.typography.adminCloudTitle.fontWeight,
  labelFontSize: NDJC_GLOBAL_UI_TOKENS.typography.adminSectionLabel.fontSize,
  labelLineHeight: NDJC_GLOBAL_UI_TOKENS.typography.adminSectionLabel.lineHeight,
  labelFontWeight: NDJC_GLOBAL_UI_TOKENS.typography.adminSectionLabel.fontWeight,
  bodySmallFontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontSize,
  bodySmallLineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.lineHeight,
  bodySmallFontWeight: NDJC_GLOBAL_UI_TOKENS.typography.bodySmall.fontWeight,
  titleMediumFontSize: NDJC_GLOBAL_UI_TOKENS.typography.titleMedium.fontSize,
  titleMediumLineHeight: NDJC_GLOBAL_UI_TOKENS.typography.titleMedium.lineHeight,
  titleMediumFontWeight: NDJC_GLOBAL_UI_TOKENS.typography.titleMedium.fontWeight,
  bodyMediumFontSize: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontSize,
  bodyMediumLineHeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.lineHeight,
  bodyMediumFontWeight: NDJC_GLOBAL_UI_TOKENS.typography.bodyMedium.fontWeight,
  black: NDJC_GLOBAL_UI_TOKENS.colors.textPrimary,
  cloudPlanColor: NDJC_GLOBAL_UI_TOKENS.colors.textSecondary,
  cloudStatusColor: NDJC_GLOBAL_UI_TOKENS.colors.textSoft,
  cloudDaysColor: NDJC_GLOBAL_UI_TOKENS.colors.textStrong,
  cloudDateColor: NDJC_GLOBAL_UI_TOKENS.colors.textMuted
} as const

export function AdminSpacer({ height }: { height: number }) {
  return <div style={{ height, flexShrink: 0 }} />
}

export function AdminTitleText({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        margin: 0,
        marginLeft: NDJC_GLOBAL_UI_TOKENS.layout.titleInsetX,
        color: APK_ADMIN_UI.black,
        fontSize: APK_ADMIN_UI.titleFontSize,
        lineHeight: APK_ADMIN_UI.titleLineHeight,
        fontWeight: APK_ADMIN_UI.titleFontWeight,
        letterSpacing: APK_ADMIN_UI.titleLetterSpacing,
        textRendering: 'geometricPrecision'
      }}
    >
      {children}
    </h1>
  )
}

export function AdminInlineSyncSpinner() {
  const bars = Array.from({ length: 12 }, (_, index) => index)

  return (
    <span
      className="ndjc-admin-inline-sync-spinner"
      aria-hidden="true"
      style={{
        position: 'relative',
        width: 18,
        height: 18,
        display: 'inline-block',
        flexShrink: 0,
        animation: 'ndjcAdminSyncSpinnerRotate 0.85s steps(12, end) infinite'
      }}
    >
      {bars.map((index) => (
        <span
          key={index}
          style={{
            position: 'absolute',
            left: '50%',
            top: 1,
            width: 2,
            height: 5,
            borderRadius: 999,
            background: '#111111',
            opacity: 0.22 + index * 0.055,
            transform: `translateX(-50%) rotate(${index * 30}deg)`,
            transformOrigin: '1px 8px'
          }}
        />
      ))}
    </span>
  )
}

export function AdminInlineSyncStatus({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="ndjc-admin-inline-sync-status"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        color: '#475467',
        fontSize: 12,
        lineHeight: 1,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        transform: 'translateY(1px)'
      }}
    >
      <AdminInlineSyncSpinner />

      <span>
        {children}
      </span>
    </span>
  )
}

export function AdminSyncNoticeText({ children }: { children: React.ReactNode }) {
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

export function AdminCloudTitleText({ children }: { children: React.ReactNode }) {
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

export function AdminSectionLabel({ children }: { children: React.ReactNode }) {
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

export function AdminBodySmallText({
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

export function AdminTitleMediumText({ children }: { children: React.ReactNode }) {
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

export function NdjcAdminCloudMark() {
  return (
<svg
  width="74"
  height="74"
  viewBox="-4 -4 82 82"
  fill="none"
  aria-hidden="true"
  style={{
    display: 'block'
  }}
>
      <path
        d="M24.4 48.6h27.8c6.2 0 11.2-4.6 11.2-10.4 0-5.3-4.1-9.7-9.5-10.3C51.9 18.2 43.2 11 33 11c-11.4 0-20.7 8.8-21.2 19.8C5.7 32.2 1.2 37.2 1.2 43.1c0 6.2 5.1 11.2 11.5 11.2h11.7"
        stroke="currentColor"
        strokeWidth="5.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.5 36.6h18.8"
        stroke="currentColor"
        strokeWidth="5.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
export function AdminStatusMessageText({ children }: { children: React.ReactNode }) {
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
