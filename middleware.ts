import { NextResponse, type NextRequest } from 'next/server'

function applyNoStoreHeaders(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')

  return response
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const response = NextResponse.next()

  if (pathname === '/sw.js') {
    applyNoStoreHeaders(response)
    response.headers.set('Service-Worker-Allowed', '/')
    return response
  }

  if (pathname === '/offline.html') {
    return applyNoStoreHeaders(response)
  }

  if (pathname.startsWith('/pwa/') && pathname.endsWith('/manifest.webmanifest')) {
    return applyNoStoreHeaders(response)
  }

  return response
}

export const config = {
  matcher: [
    '/sw.js',
    '/offline.html',
    '/pwa/:path*/manifest.webmanifest'
  ]
}