export type UiPackDescriptor = {
  id: string
  label: string
  supportsDarkTheme?: boolean
  supportsDynamicColor?: boolean
}

export const UIPACK_REGISTRY: UiPackDescriptor[] = [
  {
    id: 'ui-pack-neumorph',
    label: 'Neumorph UI Pack',
    supportsDarkTheme: true,
    supportsDynamicColor: false
  },
  {
    id: 'ui-greenpowder-web',
    label: 'Greenpowder Showcase Web UI Pack',
    supportsDarkTheme: true,
    supportsDynamicColor: false
  },
  {
    id: 'ui-pack-showcase-greenpink-web',
    label: 'Greenpink Showcase Web UI Pack',
    supportsDarkTheme: true,
    supportsDynamicColor: false
  }
]

export function findUiPackById(id: string): UiPackDescriptor | undefined {
  return UIPACK_REGISTRY.find(item => item.id === id)
}
