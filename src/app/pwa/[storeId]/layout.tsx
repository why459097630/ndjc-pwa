import type { Metadata } from 'next'
import { resolveStorePwaPageMetadata } from '@/pwa/storePwaManifest'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params
}: {
  params: Promise<{ storeId: string }>
}): Promise<Metadata> {
  const { storeId } = await params
  return resolveStorePwaPageMetadata(storeId)
}

export default function StorePwaLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
