import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const NDJC_GLOBAL_BROWSER_COMPAT_STYLE = `
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  background: #eff3f2;
}

body {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background: #eff3f2;
}

#__next {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 100%;
  min-height: 100%;
  background: #eff3f2;
}

img,
svg,
video,
canvas {
  display: block;
  max-width: 100%;
}

button,
input,
textarea,
select {
  font: inherit;
}

input,
textarea,
select {
  font-size: 16px;
}

button {
  -webkit-tap-highlight-color: transparent;
}

a {
  color: inherit;
}

[hidden] {
  display: none !important;
}
`

export const metadata: Metadata = {
  title: 'Customer Hub',
  description: 'A branded customer hub for services, appointments, messages, and updates.',
  applicationName: 'Customer Hub',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Customer Hub',
    statusBarStyle: 'black-translucent'
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
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#eff3f2',
    'msapplication-tap-highlight': 'no'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#eff3f2'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={inter.variable}
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        height: '100%',
        minHeight: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        overflowX: 'hidden',
        overscrollBehavior: 'none',
        overscrollBehaviorY: 'none',
        background: '#eff3f2',
        fontFamily: 'var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <body
        style={{
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          height: '100%',
          minHeight: '100%',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          overflowX: 'hidden',
          overscrollBehavior: 'none',
          overscrollBehaviorY: 'none',
          background: '#eff3f2',
          color: '#171717',
          fontFamily: 'inherit'
        }}
      >
        <style
          id="ndjc-global-browser-compat"
          dangerouslySetInnerHTML={{
            __html: NDJC_GLOBAL_BROWSER_COMPAT_STYLE
          }}
        />
        {children}
      </body>
    </html>
  )
}