export type ShowcaseI18nRecord = Record<string, unknown>

function normalizeLanguageCode(value: string | null | undefined): string {
  const raw = String(value || '').trim().toLowerCase()
  if (!raw) return 'default'

  const primary = raw.split('-')[0]?.trim() || raw

  if (primary === 'zh' || primary === 'cn') return 'zh'
  if (primary === 'en') return 'en'
  if (primary === 'ja' || primary === 'jp') return 'ja'
  if (primary === 'ko' || primary === 'kr') return 'ko'
  if (primary === 'es') return 'es'
  if (primary === 'fr') return 'fr'
  if (primary === 'de') return 'de'
  if (primary === 'it') return 'it'
  if (primary === 'pt') return 'pt'
  if (primary === 'vi') return 'vi'
  if (primary === 'th') return 'th'
  if (primary === 'id') return 'id'
  if (primary === 'ms') return 'ms'

  return primary || 'default'
}

function readBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return 'default'

  const languages = Array.isArray(navigator.languages) ? navigator.languages : []
  const firstLanguage = languages.find(item => String(item || '').trim())

  return String(firstLanguage || navigator.language || 'default')
}

function normalizeText(value: unknown): string {
  return String(value ?? '').trim()
}

function safeParseJsonObject(value: string): ShowcaseI18nRecord | null {
  try {
    const parsed: unknown = JSON.parse(value)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as ShowcaseI18nRecord
    }
    return null
  } catch {
    return null
  }
}

export function resolveShowcaseDisplayLanguage(input?: string | null): string {
  return normalizeLanguageCode(input || readBrowserLanguage())
}

export function buildShowcaseLanguagePriority(input?: string | null): string[] {
  const language = resolveShowcaseDisplayLanguage(input)
  const candidates = [
    language,
    'default',
    'en',
    'zh'
  ]

  return Array.from(new Set(candidates.filter(item => item && item.trim())))
}

export function readShowcaseI18nRecord(value: unknown): ShowcaseI18nRecord {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as ShowcaseI18nRecord
  }

  if (typeof value === 'string') {
    return safeParseJsonObject(value) || {}
  }

  return {}
}

export function jsonRecord(value: Record<string, unknown>, key: string): ShowcaseI18nRecord {
  return readShowcaseI18nRecord(value[key])
}

export function pickI18nText(
  value: ShowcaseI18nRecord | null | undefined,
  fallback = '',
  language?: string | null
): string {
  const source = readShowcaseI18nRecord(value)
  const priority = buildShowcaseLanguagePriority(language)

  for (const key of priority) {
    const next = normalizeText(source[key])
    if (next) return next
  }

  return normalizeText(fallback)
}

export function pickDisplayText(values: Array<unknown>, fallback = ''): string {
  for (const value of values) {
    const next = normalizeText(value)
    if (next) return next
  }

  return normalizeText(fallback)
}

export function buildI18nValue(
  entries: Record<string, string | null | undefined>,
  language?: string | null
): Record<string, string> {
  const result: Record<string, string> = {}
  const displayLanguage = resolveShowcaseDisplayLanguage(language)

  Object.entries(entries).forEach(([key, value]) => {
    const text = normalizeText(value)
    if (text) {
      result[key] = text
    }
  })

  if (!result.default) {
    const languageText = normalizeText(result[displayLanguage])
    if (languageText) {
      result.default = languageText
    }
  }

  if (!result[displayLanguage] && result.default) {
    result[displayLanguage] = result.default
  }

  return result
}