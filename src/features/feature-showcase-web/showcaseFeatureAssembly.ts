'use client'

import type { ReactNode } from 'react'
import type { ShowcaseUiRenderer } from '@/ui-packs/ui-pack-clean-neutral-web'
import type { ShowcaseScreenName } from './showcaseUiContract'
import {
  ShowcaseHost,
  type ShowcaseHostInput
} from './showcaseHost'

export type ShowcaseFeatureAssemblyDependencies = {
  defaultStoreId: string | null
  defaultRouteId: string
}

export type ShowcaseFeatureAssemblyAppRootInput = {
  routeId?: string | null
  storeId?: string | null
  initialScreen?: ShowcaseScreenName | null
  ui: ShowcaseUiRenderer
}

export type ShowcaseFeatureAssembly = {
  dependencies: ShowcaseFeatureAssemblyDependencies
  AppRoot: (input: ShowcaseFeatureAssemblyAppRootInput) => ReactNode
}

const DEFAULT_SHOWCASE_FEATURE_ASSEMBLY_DEPENDENCIES: ShowcaseFeatureAssemblyDependencies = {
  defaultStoreId: null,
  defaultRouteId: 'Home'
}

function normalizeNullableStoreId(value: unknown): string | null {
  const text = String(value ?? '').trim()
  return text && text.toLowerCase() !== 'null' ? text : null
}

function normalizeAssemblyDependencies(
  input: Partial<ShowcaseFeatureAssemblyDependencies> = {}
): ShowcaseFeatureAssemblyDependencies {
  return {
    defaultStoreId: normalizeNullableStoreId(input.defaultStoreId),
    defaultRouteId: String(input.defaultRouteId || DEFAULT_SHOWCASE_FEATURE_ASSEMBLY_DEPENDENCIES.defaultRouteId).trim() || DEFAULT_SHOWCASE_FEATURE_ASSEMBLY_DEPENDENCIES.defaultRouteId
  }
}

function buildHostInput(
  dependencies: ShowcaseFeatureAssemblyDependencies,
  input: ShowcaseFeatureAssemblyAppRootInput
): ShowcaseHostInput {
  return {
    routeId: input.routeId || dependencies.defaultRouteId,
    storeId: input.storeId || dependencies.defaultStoreId,
    initialScreen: input.initialScreen || null,
    ui: input.ui
  }
}
export function createShowcaseFeatureAssembly(
  dependenciesInput: Partial<ShowcaseFeatureAssemblyDependencies> = {}
): ShowcaseFeatureAssembly {
  const dependencies = normalizeAssemblyDependencies(dependenciesInput)

  return {
    dependencies,

    AppRoot(input: ShowcaseFeatureAssemblyAppRootInput): ReactNode {
      return ShowcaseHost(buildHostInput(dependencies, input))
    }
  }
}

export const showcaseFeatureAssembly = createShowcaseFeatureAssembly()

export function AppRoot(input: ShowcaseFeatureAssemblyAppRootInput): ReactNode {
  return showcaseFeatureAssembly.AppRoot(input)
}