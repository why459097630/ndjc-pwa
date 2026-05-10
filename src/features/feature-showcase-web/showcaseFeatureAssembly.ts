'use client'

import type { ReactNode } from 'react'
import type { ShowcaseUiRenderer } from '@/ui-packs/ui-pack-showcase-greenpink-web'
import type { ShowcaseScreenName } from './showcaseUiContract'
import {
  ShowcaseHost,
  type ShowcaseHostInput
} from './showcaseHost'

export type ShowcaseFeatureAssemblyDependencies = {
  defaultStoreId: string
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
  defaultStoreId: 'store_showcase_trial_000001',
  defaultRouteId: 'Home'
}

function normalizeAssemblyDependencies(
  input: Partial<ShowcaseFeatureAssemblyDependencies> = {}
): ShowcaseFeatureAssemblyDependencies {
  return {
    defaultStoreId: String(input.defaultStoreId || DEFAULT_SHOWCASE_FEATURE_ASSEMBLY_DEPENDENCIES.defaultStoreId).trim() || DEFAULT_SHOWCASE_FEATURE_ASSEMBLY_DEPENDENCIES.defaultStoreId,
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