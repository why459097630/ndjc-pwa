'use client'

import { useEffect } from 'react'

function buildStoreManifestHref(storeId: string): string {
  return `/pwa/${encodeURIComponent(storeId)}/manifest.webmanifest`
}

function normalizeHref(href: string): string {
  if (typeof window === 'undefined') return href

  return new URL(href, window.location.origin).href
}

function upsertManifestLink(storeId: string) {
  if (typeof document === 'undefined') return

  const manifestHref = buildStoreManifestHref(storeId)
  const normalizedManifestHref = normalizeHref(manifestHref)
  const existingManifestLinks = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="manifest"]'))

  existingManifestLinks.forEach((link) => {
    const normalizedExistingHref = normalizeHref(link.getAttribute('href') || '')

    if (normalizedExistingHref !== normalizedManifestHref) {
      link.remove()
    }
  })

  let manifestLink = document.head.querySelector<HTMLLinkElement>('link[rel="manifest"]')

  if (!manifestLink) {
    manifestLink = document.createElement('link')
    document.head.appendChild(manifestLink)
  }

  manifestLink.rel = 'manifest'
  manifestLink.href = manifestHref
  manifestLink.setAttribute('data-ndjc-pwa-manifest', storeId)
}

export function PwaHeadLinks({ storeId }: { storeId: string }) {
  useEffect(() => {
    upsertManifestLink(storeId)
  }, [storeId])

  return null
}