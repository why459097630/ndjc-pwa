export type ShowcaseAppLifecyclePhase = 'app-start' | 'foreground' | 'background'

export type ShowcaseAppLifecycleDetail = {
  phase: ShowcaseAppLifecyclePhase
  happenedAt: number
  visibilityState: DocumentVisibilityState | 'unknown'
  online: boolean
  lastPhase: ShowcaseAppLifecyclePhase | ''
  lastPhaseAt: number
  backgroundDurationMs: number
  shouldRecoverFromBackground: boolean
}

export type ShowcaseAppLifecycleSnapshot = {
  lastPhase: ShowcaseAppLifecyclePhase | ''
  lastPhaseAt: number
  lastBackgroundAt: number
  lastForegroundAt: number
  lastAppStartAt: number
  lastOnlineAt: number
  lastOfflineAt: number
}

export const NDJC_SHOWCASE_APP_LIFECYCLE_EVENT = 'ndjc:showcase-app-lifecycle'
const NDJC_SHOWCASE_LIFECYCLE_LAST_PHASE_KEY = 'ndjc:showcase-lifecycle-last-phase'
const NDJC_SHOWCASE_LIFECYCLE_LAST_AT_KEY = 'ndjc:showcase-lifecycle-last-at'
const NDJC_SHOWCASE_LIFECYCLE_LAST_BACKGROUND_AT_KEY = 'ndjc:showcase-lifecycle-last-background-at'
const NDJC_SHOWCASE_LIFECYCLE_LAST_FOREGROUND_AT_KEY = 'ndjc:showcase-lifecycle-last-foreground-at'
const NDJC_SHOWCASE_LIFECYCLE_LAST_APP_START_AT_KEY = 'ndjc:showcase-lifecycle-last-app-start-at'
const NDJC_SHOWCASE_LIFECYCLE_LAST_ONLINE_AT_KEY = 'ndjc:showcase-lifecycle-last-online-at'
const NDJC_SHOWCASE_LIFECYCLE_LAST_OFFLINE_AT_KEY = 'ndjc:showcase-lifecycle-last-offline-at'
const NDJC_SHOWCASE_LIFECYCLE_RECOVERY_THRESHOLD_MS = 15 * 1000

function readVisibilityState(): DocumentVisibilityState | 'unknown' {
  if (typeof document === 'undefined') return 'unknown'

  return document.visibilityState
}

function readOnlineState(): boolean {
  if (typeof navigator === 'undefined') return true

  return navigator.onLine
}

function readStorageNumber(key: string): number {
  if (typeof window === 'undefined') return 0

  try {
    const value = Number(window.localStorage.getItem(key) || '0')

    return Number.isFinite(value) ? value : 0
  } catch {
    return 0
  }
}

function readStorageText(key: string): string {
  if (typeof window === 'undefined') return ''

  try {
    return String(window.localStorage.getItem(key) || '').trim()
  } catch {
    return ''
  }
}

function writeStorageValue(key: string, value: string): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, value)
  } catch {
  }
}

function normalizeLifecyclePhase(value: string): ShowcaseAppLifecyclePhase | '' {
  if (value === 'app-start') return 'app-start'
  if (value === 'foreground') return 'foreground'
  if (value === 'background') return 'background'

  return ''
}

export function readShowcaseAppLifecycleSnapshot(): ShowcaseAppLifecycleSnapshot {
  return {
    lastPhase: normalizeLifecyclePhase(readStorageText(NDJC_SHOWCASE_LIFECYCLE_LAST_PHASE_KEY)),
    lastPhaseAt: readStorageNumber(NDJC_SHOWCASE_LIFECYCLE_LAST_AT_KEY),
    lastBackgroundAt: readStorageNumber(NDJC_SHOWCASE_LIFECYCLE_LAST_BACKGROUND_AT_KEY),
    lastForegroundAt: readStorageNumber(NDJC_SHOWCASE_LIFECYCLE_LAST_FOREGROUND_AT_KEY),
    lastAppStartAt: readStorageNumber(NDJC_SHOWCASE_LIFECYCLE_LAST_APP_START_AT_KEY),
    lastOnlineAt: readStorageNumber(NDJC_SHOWCASE_LIFECYCLE_LAST_ONLINE_AT_KEY),
    lastOfflineAt: readStorageNumber(NDJC_SHOWCASE_LIFECYCLE_LAST_OFFLINE_AT_KEY)
  }
}

export function recordShowcaseOnlineState(online: boolean): void {
  const happenedAt = Date.now()

  writeStorageValue(
    online ? NDJC_SHOWCASE_LIFECYCLE_LAST_ONLINE_AT_KEY : NDJC_SHOWCASE_LIFECYCLE_LAST_OFFLINE_AT_KEY,
    String(happenedAt)
  )
}

function persistLifecyclePhase(
  phase: ShowcaseAppLifecyclePhase,
  happenedAt: number
): ShowcaseAppLifecycleDetail {
  const snapshot = readShowcaseAppLifecycleSnapshot()
  const backgroundDurationMs = snapshot.lastBackgroundAt > 0
    ? Math.max(0, happenedAt - snapshot.lastBackgroundAt)
    : 0

  writeStorageValue(NDJC_SHOWCASE_LIFECYCLE_LAST_PHASE_KEY, phase)
  writeStorageValue(NDJC_SHOWCASE_LIFECYCLE_LAST_AT_KEY, String(happenedAt))

  if (phase === 'app-start') {
    writeStorageValue(NDJC_SHOWCASE_LIFECYCLE_LAST_APP_START_AT_KEY, String(happenedAt))
  }

  if (phase === 'foreground') {
    writeStorageValue(NDJC_SHOWCASE_LIFECYCLE_LAST_FOREGROUND_AT_KEY, String(happenedAt))
  }

  if (phase === 'background') {
    writeStorageValue(NDJC_SHOWCASE_LIFECYCLE_LAST_BACKGROUND_AT_KEY, String(happenedAt))
  }

  return {
    phase,
    happenedAt,
    visibilityState: readVisibilityState(),
    online: readOnlineState(),
    lastPhase: snapshot.lastPhase,
    lastPhaseAt: snapshot.lastPhaseAt,
    backgroundDurationMs,
    shouldRecoverFromBackground:
      phase === 'app-start' ||
      (
        phase === 'foreground' &&
        snapshot.lastPhase === 'background' &&
        backgroundDurationMs >= NDJC_SHOWCASE_LIFECYCLE_RECOVERY_THRESHOLD_MS
      )
  }
}

export function dispatchShowcaseAppLifecycleEvent(phase: ShowcaseAppLifecyclePhase): ShowcaseAppLifecycleDetail {
  const detail = persistLifecyclePhase(phase, Date.now())

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<ShowcaseAppLifecycleDetail>(NDJC_SHOWCASE_APP_LIFECYCLE_EVENT, {
      detail
    }))
  }

  return detail
}