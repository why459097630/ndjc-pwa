'use client'

import { useEffect } from 'react'

function upsertHeadLink(input: {
  id: string
  rel: string
  href: string
  sizes?: string
  type?: string
}) {
  if (typeof document === 'undefined') return

  let element = document.querySelector<HTMLLinkElement>(`link[data-ndjc-head-link="${input.id}"]`)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('data-ndjc-head-link', input.id)
    document.head.appendChild(element)
  }

  element.rel = input.rel
  element.href = input.href

  if (input.sizes) {
    element.sizes = input.sizes
  } else {
    element.removeAttribute('sizes')
  }

  if (input.type) {
    element.type = input.type
  } else {
    element.removeAttribute('type')
  }
}

export function PwaHeadLinks({ storeId }: { storeId: string }) {
  useEffect(() => {
    const encodedStoreId = encodeURIComponent(storeId)
    const manifestUrl = `/pwa/${encodedStoreId}/manifest.webmanifest`

    upsertHeadLink({
      id: 'manifest',
      rel: 'manifest',
      href: manifestUrl
    })

    upsertHeadLink({
      id: 'apple-touch-icon',
      rel: 'apple-touch-icon',
      href: '/icons/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png'
    })

    upsertHeadLink({
      id: 'icon-192',
      rel: 'icon',
      href: '/icons/icon-192.png',
      sizes: '192x192',
      type: 'image/png'
    })

    upsertHeadLink({
      id: 'icon-512',
      rel: 'icon',
      href: '/icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png'
    })
  }, [storeId])

  return null
}