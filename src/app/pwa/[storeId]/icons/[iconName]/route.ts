import { NextResponse } from 'next/server'
import { resolveStorePwaProfile } from '@/pwa/storePwaManifest'

export const dynamic = 'force-dynamic'

type StorePwaIconVariantKey =
  | 'icon192'
  | 'icon512'
  | 'maskable192'
  | 'maskable512'
  | 'appleTouchIcon'

type StorePwaIconAsset = {
  variantKey: StorePwaIconVariantKey
  fallbackPath: string
}

const ICON_ASSET_MAP: Record<string, StorePwaIconAsset> = {
  'pwa-icon-192.png': {
    variantKey: 'icon192',
    fallbackPath: '/icons/icon-192.png'
  },
  'pwa-icon-512.png': {
    variantKey: 'icon512',
    fallbackPath: '/icons/icon-512.png'
  },
  'pwa-maskable-192.png': {
    variantKey: 'maskable192',
    fallbackPath: '/icons/maskable-192.png'
  },
  'pwa-maskable-512.png': {
    variantKey: 'maskable512',
    fallbackPath: '/icons/maskable-512.png'
  },
  'apple-touch-icon.png': {
    variantKey: 'appleTouchIcon',
    fallbackPath: '/icons/apple-touch-icon.png'
  }
}

function resolveFetchUrl(request: Request, source: string): string {
  if (source.startsWith('/')) {
    return new URL(source, request.url).toString()
  }

  return source
}

async function fetchIconResponse(input: {
  request: Request
  sourceUrl: string
  fallbackPath: string
}): Promise<Response> {
  const primaryUrl = resolveFetchUrl(input.request, input.sourceUrl)

  try {
    const primaryResponse = await fetch(primaryUrl, {
      method: 'GET',
      cache: 'no-store'
    })

    if (primaryResponse.ok) {
      const contentType = primaryResponse.headers.get('content-type') || ''

      if (contentType.toLowerCase().startsWith('image/')) {
        const body = await primaryResponse.arrayBuffer()

        return new NextResponse(body, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400'
          }
        })
      }
    }
  } catch {
  }

  const fallbackUrl = resolveFetchUrl(input.request, input.fallbackPath)
  const fallbackResponse = await fetch(fallbackUrl, {
    method: 'GET',
    cache: 'no-store'
  })

  if (!fallbackResponse.ok) {
    return new NextResponse('Icon not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    })
  }

  const fallbackContentType = fallbackResponse.headers.get('content-type') || 'image/png'
  const fallbackBody = await fallbackResponse.arrayBuffer()

  return new NextResponse(fallbackBody, {
    status: 200,
    headers: {
      'Content-Type': fallbackContentType,
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400'
    }
  })
}

export async function GET(
  request: Request,
  context: { params: Promise<{ storeId: string; iconName: string }> }
) {
  const { storeId, iconName } = await context.params
  const asset = ICON_ASSET_MAP[iconName]

  if (!asset) {
    return new NextResponse('Icon not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    })
  }

  const profile = await resolveStorePwaProfile(storeId)
  const iconUrl = profile.iconVariants[asset.variantKey] || asset.fallbackPath

  return fetchIconResponse({
    request,
    sourceUrl: iconUrl,
    fallbackPath: asset.fallbackPath
  })
}