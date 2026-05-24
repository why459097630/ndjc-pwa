import { NextResponse } from 'next/server'
import { buildStorePwaManifest } from '@/pwa/storePwaManifest'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  context: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await context.params
  const manifest = await buildStorePwaManifest(storeId)

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0'
    }
  })
}