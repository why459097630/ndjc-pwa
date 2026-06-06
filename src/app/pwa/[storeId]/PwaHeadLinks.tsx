'use client'

import { useEffect } from 'react'

type PwaManifestIcon = {
  src?: unknown
  sizes?: unknown
  type?: unknown
  purpose?: unknown
}

type PwaManifestPayload = {
  icons?: unknown
  x_ndjc_apple_touch_icon?: unknown
}

function buildStoreManifestHref(storeId: string): string {
  return `/pwa/${encodeURIComponent(storeId)}/manifest.webmanifest`
}

function normalizeHref(href: string): string {
  if (typeof window === 'undefined') return href

  return new URL(href, window.location.origin).href
}

function normalizeIconHref(value: unknown): string {
  const text = String(value || '').trim()

  if (!text) return ''
  if (text.startsWith('/')) return text
  if (text.startsWith('https://')) return text
  if (text.startsWith('http://')) return text

  return ''
}

function pickManifestIconHref(payload: PwaManifestPayload): string {
  if (!Array.isArray(payload.icons)) return ''

  const icons = payload.icons.filter((item): item is PwaManifestIcon => {
    return Boolean(item && typeof item === 'object' && !Array.isArray(item))
  })

  const anyIcon = icons.find((icon) => String(icon.purpose || '').includes('any'))
  const firstIcon = anyIcon || icons[0]

  return normalizeIconHref(firstIcon?.src)
}

function pickManifestAppleIconHref(payload: PwaManifestPayload, fallback: string): string {
  return normalizeIconHref(payload.x_ndjc_apple_touch_icon) || fallback
}

function removeManagedIconLinks() {
  if (typeof document === 'undefined') return

  const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[data-ndjc-pwa-icon="true"]'))

  links.forEach((link) => {
    link.remove()
  })
}

function upsertIconLink(rel: string, href: string, storeId: string, type: string, sizes: string) {
  if (typeof document === 'undefined') return
  if (!href) return

  const link = document.createElement('link')

  link.rel = rel
  link.href = href
  link.type = type
  link.sizes = sizes
  link.setAttribute('data-ndjc-pwa-icon', 'true')
  link.setAttribute('data-ndjc-pwa-store-id', storeId)

  document.head.appendChild(link)
}

async function upsertStoreIconLinks(storeId: string, manifestHref: string) {
  if (typeof document === 'undefined') return

  try {
    const response = await fetch(manifestHref, {
      method: 'GET',
      cache: 'no-store'
    })

    if (!response.ok) return

    const payload = await response.json() as PwaManifestPayload
    const iconHref = pickManifestIconHref(payload)

    if (!iconHref) return

    const appleIconHref = pickManifestAppleIconHref(payload, iconHref)

    removeManagedIconLinks()
    upsertIconLink('icon', iconHref, storeId, 'image/png', '192x192')
    upsertIconLink('shortcut icon', iconHref, storeId, 'image/png', '192x192')
    upsertIconLink('apple-touch-icon', appleIconHref, storeId, 'image/png', '180x180')
  } catch {
    return
  }
}

function upsertManifestLink(storeId: string): string {
  if (typeof document === 'undefined') return buildStoreManifestHref(storeId)

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

  return manifestHref
}

export function PwaHeadLinks({ storeId }: { storeId: string }) {
  useEffect(() => {
    let cancelled = false
    const manifestHref = upsertManifestLink(storeId)

    async function run() {
      if (cancelled) return
      await upsertStoreIconLinks(storeId, manifestHref)
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [storeId])

  return null
}