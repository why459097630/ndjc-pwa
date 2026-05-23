import type { Metadata } from 'next'
import { loadAssemblyFromPublic, mergeAssemblyRuntimeValues } from '@/core/assembly/loader'
import { AppRoot } from '@/core/runtime/AppRoot'
import { resolveStorePwaPageMetadata } from '@/pwa/storePwaManifest'

export async function generateMetadata({ params }: { params: Promise<{ storeId: string }> }): Promise<Metadata> {
  const { storeId } = await params
  return resolveStorePwaPageMetadata(storeId)
}

export default async function StorePwaPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params
  const assembly = await loadAssemblyFromPublic('/assembly/assembly.json')
  const runtimeAssembly = mergeAssemblyRuntimeValues(assembly, {
    storeId,
    privacyUrl: `/privacy/${encodeURIComponent(storeId)}`
  })

  return <AppRoot assembly={runtimeAssembly} />
}