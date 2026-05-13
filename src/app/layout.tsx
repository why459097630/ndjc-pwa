import React from 'react'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'NDJC PWA',
  description: 'NDJC generated PWA shell',
  applicationName: 'NDJC PWA',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'NDJC PWA',
    statusBarStyle: 'default'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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