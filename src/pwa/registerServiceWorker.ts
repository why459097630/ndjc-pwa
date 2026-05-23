export type RegisterServiceWorkerOptions = {
  onUpdateAvailable?: (registration: ServiceWorkerRegistration) => void
}

export async function registerServiceWorker(
  options: RegisterServiceWorkerOptions = {}
): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined') return null
  if (!('serviceWorker' in navigator)) return null

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      updateViaCache: 'none'
    })

    if (registration.waiting && navigator.serviceWorker.controller) {
      options.onUpdateAvailable?.(registration)
    }

    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing

      if (!installingWorker) return

      installingWorker.addEventListener('statechange', () => {
        if (
          installingWorker.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          options.onUpdateAvailable?.(registration)
        }
      })
    })

    return registration
  } catch (error) {
    console.warn('NDJC service worker registration failed', error)
    return null
  }
}

export function activateWaitingServiceWorker(registration: ServiceWorkerRegistration | null): void {
  if (!registration || !registration.waiting) return

  registration.waiting.postMessage({
    type: 'NDJC_SKIP_WAITING'
  })
}