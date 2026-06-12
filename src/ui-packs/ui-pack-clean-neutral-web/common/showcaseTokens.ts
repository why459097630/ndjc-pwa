'use client'

export const NDJC_BOTTOM_BAR_HEIGHT_CSS_VAR = '--ndjc-bottom-bar-height'
export const NDJC_BOTTOM_BAR_RESERVE_CSS_VAR = '--ndjc-bottom-bar-reserve'

export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

export const APK_SHOWCASE_COLOR_TOKENS = {
  accent: '#E96B72',
  accentPressed: '#C94F56',
  accentRgb: '233, 107, 114',
  primary: '#B4232A',
  primaryPressed: '#8F1D23',
  primaryRgb: '180, 35, 42'
} as const

export const NDJC_GLOBAL_UI_TOKENS = {
  colors: {
    background: '#F3F7F5',
    surface: '#FFFFFF',
    surfaceSoft: '#F8FAF9',
    cardBackground: 'rgba(255, 255, 255, 0.9)',

    controlEmphasis: '#2b3033',
    controlWeakText: '#9aa3a0',
    controlDisabledSurface: '#dfe5e3',

    textPrimary: '#000000',
    textStrong: '#111111',
    textBody: '#202124',
    textSoft: '#344054',
    textSecondary: '#475467',
    textMuted: '#667085',
    textDisabled: 'rgba(32, 33, 36, 0.36)',
    textDisabledSoft: 'rgba(32, 33, 36, 0.26)',

    iconDisabled: 'rgba(32, 33, 36, 0.24)',

    brand: APK_SHOWCASE_COLOR_TOKENS.accent,
    brandPressed: APK_SHOWCASE_COLOR_TOKENS.accentPressed,
    brandRgb: APK_SHOWCASE_COLOR_TOKENS.accentRgb,
    brandStrong: APK_SHOWCASE_COLOR_TOKENS.primary,
    brandStrongPressed: APK_SHOWCASE_COLOR_TOKENS.primaryPressed,
    brandStrongRgb: APK_SHOWCASE_COLOR_TOKENS.primaryRgb,
    brandSoft: 'rgba(180, 35, 42, 0.08)',

    success: '#15803D',
    successSoft: 'rgba(21, 128, 61, 0.12)',
    warning: '#B45309',
    warningSoft: 'rgba(180, 83, 9, 0.12)',
    danger: '#B4232A',
    dangerSoft: 'rgba(180, 35, 42, 0.12)',

    border: 'rgba(15, 23, 42, 0.08)',
    divider: 'rgba(15, 23, 42, 0.06)',
    overlay: 'rgba(15, 23, 42, 0.42)'
  },

  typography: {
    adminPageTitle: {
      fontSize: 38,
      lineHeight: 1.02,
      fontWeight: 760,
      letterSpacing: '-1.1px'
    },
    adminCloudTitle: {
      fontSize: 14,
      lineHeight: 1.3,
      fontWeight: 600
    },
    adminSectionLabel: {
      fontSize: 12,
      lineHeight: 1.35,
      fontWeight: 500
    },
    entryTitle: {
      fontSize: 16,
      lineHeight: 1.18,
      fontWeight: 650,
      pressedFontWeight: 700
    },
    entryDescription: {
      fontSize: 12,
      lineHeight: 1.25,
      fontWeight: 400,
      pressedFontWeight: 500
    },
    titleMedium: {
      fontSize: 16,
      lineHeight: 1.35,
      fontWeight: 600
    },
    bodyMedium: {
      fontSize: 14,
      lineHeight: 1.45,
      fontWeight: 400
    },
    bodySmall: {
      fontSize: 12,
      lineHeight: 1.35,
      fontWeight: 400
    }
  },

  spacing: {
    xxs: 4,
    xs: 6,
    sm: 8,
    md: 10,
    lg: 12,
    xl: 14,
    xxl: 16,
    pageX: 24,
    pageTop: 56,
    pageBottom: 32
  },

  layout: {
    screenPaddingX: 16,
    contentPaddingX: 50,
    contentPaddingTop: 60,
    contentPaddingBottom: 32,
    topContentPadding: 60,
    bottomContentPadding: 32,
    contentMaxWidth: 420,
    titleInsetX: 0,
    keyboardFocusTopGap: 112
  },

  rhythm: {
    titleToFirstSection: 28,
    sectionToSection: 28,
    sectionTitleToContent: 16,
    fieldToField: 20,
    helperToNextField: 18,
    fieldToHelper: 10,
    mediaTop: 14,
    bottomActionTop: 28
  },

  radius: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    sheet: 28,
    full: 999
  },

  shadow: {
    card: '0 10px 28px rgba(0, 0, 0, 0.035)',
    floating: '0 16px 36px rgba(15, 23, 42, 0.14)',
    pressed: '0 8px 20px rgba(15, 23, 42, 0.08)'
  },

  motion: {
    pressScale: 0.985,
    iconPressScale: 1.08,
    fast: '120ms ease',
    normal: '180ms ease',
    slow: '240ms ease'
  },

  icon: {
    entrySize: 19,
    entryContainerSize: 22,
    cloudMarkSize: 74,
    strokeWidth: 2
  },

  components: {
    card: {
      radius: 20,
      paddingTop: 18,
      paddingX: 18,
      paddingBottom: 16
    },
    entryRow: {
      minHeight: 54,
      minHeightWithDescription: 64,
      radius: 16,
      gap: 13,
      paddingX: 12,
      paddingY: 8
    },
    badge: {
      height: 24,
      radius: 999,
      paddingX: 10,
      fontSize: 12,
      fontWeight: 650
    },
    button: {
      height: 48,
      radius: 16,
      fontSize: 15,
      fontWeight: 800
    },
    input: {
      height: 48,
      radius: 16,
      fontSize: 15
    }
  },

  admin: {
    cardGap: 10,
    cloudInnerGap: 10,
    cloudLineGap: 4,
    spacer8: 8,
    spacer6: 6,
    statusSpacer: 14
  }
} as const
