import React from 'react'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'NDJC PWA',
  description: 'NDJC generated PWA shell',
  applicationName: 'NDJC PWA',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      {
        url: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        url: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ]
  },
  appleWebApp: {
    capable: true,
    title: 'NDJC PWA',
    statusBarStyle: 'default'
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-title': 'NDJC PWA',
    'apple-mobile-web-app-status-bar-style': 'default',
    'msapplication-TileColor': '#ffffff',
    'msapplication-tap-highlight': 'no'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#ffffff'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      style={{
        width: '100%',
        minWidth: 0,
        height: '100%',
        minHeight: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        overscrollBehavior: 'none',
        overscrollBehaviorY: 'none',
        background: '#ffffff'
      }}
    >
      <body
        style={{
          width: '100%',
          minWidth: 0,
          height: '100%',
          minHeight: '100%',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          overscrollBehavior: 'none',
          overscrollBehaviorY: 'none',
          background: '#ffffff',
          color: '#171717'
        }}
      >
        {children}
      </body>
    </html>
  )
}