type NdjcStorageManager = {
  persisted?: () => Promise<boolean>
  persist?: () => Promise<boolean>
}

export type ShowcasePersistentStorageResult = {
  supported: boolean
  alreadyPersisted: boolean
  granted: boolean
  errorMessage: string
}

const NDJC_PERSISTENT_STORAGE_STATUS_KEY = 'ndjc:persistent-storage-status'
const NDJC_PERSISTENT_STORAGE_CHECKED_AT_KEY = 'ndjc:persistent-storage-checked-at'
const NDJC_PERSISTENT_STORAGE_ERROR_KEY = 'ndjc:persistent-storage-error'

function getStorageManager(): NdjcStorageManager | null {
  if (typeof window === 'undefined') return null

  const navigatorWithStorage = window.navigator as Navigator & {
    storage?: NdjcStorageManager
  }

  return navigatorWithStorage.storage || null
}

function writePersistentStorageResult(status: string, errorMessage = ''): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(NDJC_PERSISTENT_STORAGE_STATUS_KEY, status)
    window.localStorage.setItem(NDJC_PERSISTENT_STORAGE_CHECKED_AT_KEY, String(Date.now()))

    if (errorMessage) {
      window.localStorage.setItem(NDJC_PERSISTENT_STORAGE_ERROR_KEY, errorMessage)
    } else {
      window.localStorage.removeItem(NDJC_PERSISTENT_STORAGE_ERROR_KEY)
    }
  } catch {
  }
}

export async function requestShowcasePersistentStorage(): Promise<ShowcasePersistentStorageResult> {
  const storageManager = getStorageManager()

  if (!storageManager || typeof storageManager.persisted !== 'function') {
    writePersistentStorageResult('unsupported')

    return {
      supported: false,
      alreadyPersisted: false,
      granted: false,
      errorMessage: ''
    }
  }

  try {
    const alreadyPersisted = await storageManager.persisted()

    if (alreadyPersisted) {
      writePersistentStorageResult('persisted')

      return {
        supported: true,
        alreadyPersisted: true,
        granted: true,
        errorMessage: ''
      }
    }

    if (typeof storageManager.persist !== 'function') {
      writePersistentStorageResult('persist-api-unavailable')

      return {
        supported: true,
        alreadyPersisted: false,
        granted: false,
        errorMessage: ''
      }
    }

    const granted = await storageManager.persist()

    writePersistentStorageResult(granted ? 'granted' : 'denied')

    return {
      supported: true,
      alreadyPersisted: false,
      granted,
      errorMessage: ''
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    writePersistentStorageResult('failed', errorMessage)

    return {
      supported: true,
      alreadyPersisted: false,
      granted: false,
      errorMessage
    }
  }
}