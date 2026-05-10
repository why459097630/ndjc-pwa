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
    <html lang="en">
      <body style={{ margin: 0, background: '#ffffff', color: '#171717' }}>
        {children}
      </body>
    </html>
  )
}