import type { MetadataRoute } from 'next'

type NdjcManifest = MetadataRoute.Manifest & {
  gcm_sender_id?: string
}

export default function manifest(): NdjcManifest {
  return {
    name: 'Customer Hub',
    short_name: 'Hub',
    description: 'A branded customer hub for services, appointments, messages, and updates.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    gcm_sender_id: '103953800507',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    screenshots: [
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Customer Hub'
      }
    ]
  }
}