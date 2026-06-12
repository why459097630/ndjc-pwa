import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Customer Hub',
  description: 'A branded customer hub for services, appointments, messages, and updates.',
  applicationName: 'Customer Hub',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Customer Hub',
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
    'apple-mobile-web-app-title': 'Customer Hub',
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
      className={inter.variable}
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
        fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
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
          color: '#171717',
          fontFamily: 'inherit'
        }}
      >
        {children}
      </body>
    </html>
  )
}