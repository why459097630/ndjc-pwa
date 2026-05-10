import { loadAssemblyFromPublic } from '@/core/assembly/loader'
import { AppRoot } from '@/core/runtime/AppRoot'

export default async function Page() {
  const assembly = await loadAssemblyFromPublic('/assembly/assembly.json')
  return <AppRoot assembly={assembly} />
}
