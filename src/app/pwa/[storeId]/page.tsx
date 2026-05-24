import { loadAssemblyFromPublic, mergeAssemblyRuntimeValues } from '@/core/assembly/loader'
import { AppRoot } from '@/core/runtime/AppRoot'
import { PwaHeadLinks } from './PwaHeadLinks'

export default async function StorePwaPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params
  const assembly = await loadAssemblyFromPublic('/assembly/assembly.json')
  const runtimeAssembly = mergeAssemblyRuntimeValues(assembly, {
    storeId,
    privacyUrl: `/privacy/${encodeURIComponent(storeId)}`
  })

  return (
    <>
      <PwaHeadLinks storeId={storeId} />
      <AppRoot assembly={runtimeAssembly} />
    </>
  )
}
