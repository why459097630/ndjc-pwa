import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Assembly } from './types'

export async function loadAssemblyFromPublic(assetPath = '/assembly/assembly.json'): Promise<Assembly> {
  const normalizedPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath
  const filePath = path.join(process.cwd(), 'public', normalizedPath)
  const raw = await readFile(filePath, 'utf-8')
  return normalizeAssembly(JSON.parse(raw))
}

export function loadAssemblyFromInline(raw: unknown): Assembly {
  return normalizeAssembly(raw)
}

export function mergeAssemblyRuntimeValues(
  assembly: Assembly,
  values: Partial<Pick<Assembly, 'storeId' | 'privacyUrl' | 'merchantEmail' | 'locale' | 'theme' | 'density'>>
): Assembly {
  return normalizeAssembly({ ...assembly, ...values })
}

function normalizeAssembly(raw: unknown): Assembly {
  const data = raw as Partial<Assembly>

  const modules = Array.isArray(data.modules)
    ? data.modules.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []

  const uiPack = typeof data.uiPack === 'string' && data.uiPack.trim().length > 0
    ? data.uiPack
    : '__default__'

  const template = typeof data.template === 'string' && data.template.trim().length > 0
    ? data.template
    : 'pwa-core-skeleton'

  const routingEntry = typeof data.routingEntry === 'string' && data.routingEntry.trim().length > 0
    ? data.routingEntry
    : typeof data.startRoute === 'string' && data.startRoute.trim().length > 0
      ? data.startRoute
      : 'home'

  return {
    template,
    uiPack,
    modules,
    routingEntry,
    startRoute: typeof data.startRoute === 'string' && data.startRoute.trim().length > 0
      ? data.startRoute
      : routingEntry,
    locale: data.locale ?? null,
    theme: data.theme ?? null,
    density: data.density ?? null,
    slots: data.slots ?? {},
    storeId: data.storeId ?? null,
    privacyUrl: data.privacyUrl ?? null,
    merchantEmail: data.merchantEmail ?? null
  }
}