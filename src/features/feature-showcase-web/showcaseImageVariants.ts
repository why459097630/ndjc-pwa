import type { ShowcaseImageVariants } from './showcaseModels'

export type ShowcaseImageUsage =
  | 'home'
  | 'list'
  | 'detail'
  | 'fullscreen'
  | 'announcementCard'
  | 'announcementFeed'
  | 'chatThumb'
  | 'chatPreview'
  | 'storeCover'
  | 'storeLogo'

export type ShowcaseDishImageSource = {
  imagePreviewUrl?: string | null
  imageUrl?: string | null
  coverUrl?: string | null
  imageUrls?: ReadonlyArray<string | null | undefined> | null
  imageVariants?: ShowcaseImageVariants | null
}

export type ShowcaseAnnouncementImageSource = {
  coverUrl?: string | null
  imageUrl?: string | null
  imageUrls?: ReadonlyArray<string | null | undefined> | null
  coverImageVariants?: ShowcaseImageVariants | null
  imageVariants?: ShowcaseImageVariants | null
}

export type ShowcaseStoreImageSource = {
  coverUrl?: string | null
  logoUrl?: string | null
  coverImageVariants?: ShowcaseImageVariants | null
  logoImageVariants?: ShowcaseImageVariants | null
}

export function normalizeShowcaseImageUrl(value: string | null | undefined): string | null {
  const cleanValue = value?.trim() || ''
  return cleanValue || null
}

export function normalizeShowcaseImageUrls(values: ReadonlyArray<string | null | undefined> | null | undefined): string[] {
  if (!values?.length) return []

  return Array.from(
    new Set(
      values
        .map(value => normalizeShowcaseImageUrl(value))
        .filter((value): value is string => Boolean(value))
    )
  )
}

function firstShowcaseImageUrl(values: ReadonlyArray<string | null | undefined> | null | undefined): string | null {
  return normalizeShowcaseImageUrls(values)[0] || null
}

export function selectImageVariantUrl(
  variants: ShowcaseImageVariants | null | undefined,
  usage: ShowcaseImageUsage
): string | null {
  if (!variants) return null

  if (usage === 'home' || usage === 'list' || usage === 'announcementCard' || usage === 'chatThumb') {
    return normalizeShowcaseImageUrl(variants.mediumUrl) ||
      normalizeShowcaseImageUrl(variants.thumbUrl) ||
      normalizeShowcaseImageUrl(variants.largeUrl) ||
      normalizeShowcaseImageUrl(variants.originalUrl)
  }

  if (usage === 'detail' || usage === 'announcementFeed' || usage === 'storeCover') {
    return normalizeShowcaseImageUrl(variants.largeUrl) ||
      normalizeShowcaseImageUrl(variants.originalUrl) ||
      normalizeShowcaseImageUrl(variants.mediumUrl) ||
      normalizeShowcaseImageUrl(variants.thumbUrl)
  }

  if (usage === 'fullscreen' || usage === 'chatPreview') {
    return normalizeShowcaseImageUrl(variants.originalUrl) ||
      normalizeShowcaseImageUrl(variants.largeUrl) ||
      normalizeShowcaseImageUrl(variants.mediumUrl) ||
      normalizeShowcaseImageUrl(variants.thumbUrl)
  }

  if (usage === 'storeLogo') {
    return normalizeShowcaseImageUrl(variants.mediumUrl) ||
      normalizeShowcaseImageUrl(variants.thumbUrl) ||
      normalizeShowcaseImageUrl(variants.largeUrl) ||
      normalizeShowcaseImageUrl(variants.originalUrl)
  }

  return normalizeShowcaseImageUrl(variants.mediumUrl) ||
    normalizeShowcaseImageUrl(variants.largeUrl) ||
    normalizeShowcaseImageUrl(variants.thumbUrl) ||
    normalizeShowcaseImageUrl(variants.originalUrl)
}

export function selectDishImageUrl(
  dish: ShowcaseDishImageSource | null | undefined,
  usage: Extract<ShowcaseImageUsage, 'home' | 'list' | 'detail' | 'fullscreen'> = 'list'
): string | null {
  if (!dish) return null

  const variantUrl = selectImageVariantUrl(dish.imageVariants, usage)
  const previewUrl = normalizeShowcaseImageUrl(dish.imagePreviewUrl)
  const directImageUrl = normalizeShowcaseImageUrl(dish.imageUrl)
  const coverUrl = normalizeShowcaseImageUrl(dish.coverUrl)
  const firstImageUrl = firstShowcaseImageUrl(dish.imageUrls)

  if (usage === 'home' || usage === 'list') {
    return variantUrl || previewUrl || directImageUrl || coverUrl || firstImageUrl
  }

  if (usage === 'fullscreen') {
    return variantUrl || firstImageUrl || directImageUrl || coverUrl || previewUrl
  }

  return variantUrl || firstImageUrl || directImageUrl || coverUrl || previewUrl
}

export function selectAnnouncementCoverUrl(
  announcement: ShowcaseAnnouncementImageSource | null | undefined,
  usage: Extract<ShowcaseImageUsage, 'announcementCard' | 'announcementFeed'> = 'announcementCard'
): string | null {
  if (!announcement) return null

  const variants = announcement.coverImageVariants || announcement.imageVariants
  const variantUrl = selectImageVariantUrl(variants, usage)
  const coverUrl = normalizeShowcaseImageUrl(announcement.coverUrl)
  const directImageUrl = normalizeShowcaseImageUrl(announcement.imageUrl)
  const firstImageUrl = firstShowcaseImageUrl(announcement.imageUrls)

  if (usage === 'announcementFeed') {
    return variantUrl || coverUrl || directImageUrl || firstImageUrl
  }

  return variantUrl || coverUrl || firstImageUrl || directImageUrl
}

export function selectStoreCoverUrl(store: ShowcaseStoreImageSource | null | undefined): string | null {
  if (!store) return null

  return selectImageVariantUrl(store.coverImageVariants, 'storeCover') ||
    normalizeShowcaseImageUrl(store.coverUrl)
}

export function selectStoreLogoUrl(store: ShowcaseStoreImageSource | null | undefined): string | null {
  if (!store) return null

  return selectImageVariantUrl(store.logoImageVariants, 'storeLogo') ||
    normalizeShowcaseImageUrl(store.logoUrl)
}

export function selectStoreLogoPreviewUrl(store: ShowcaseStoreImageSource | null | undefined): string | null {
  if (!store) return null

  return selectImageVariantUrl(store.logoImageVariants, 'fullscreen') ||
    normalizeShowcaseImageUrl(store.logoUrl)
}

function selectChatFallbackImageUrl(
  urlInput: string | null | undefined,
  usage: Extract<ShowcaseImageUsage, 'chatThumb' | 'chatPreview'>
): string | null {
  const url = normalizeShowcaseImageUrl(urlInput)

  if (!url) return null

  const variantMatch = url.match(/_(original|large|medium|thumb|blur)_(\d+)(\.[a-zA-Z0-9]+)(?=$|[?#])/)

  if (!variantMatch) {
    return url
  }

  const currentIndex = Number(variantMatch[2])

  if (!Number.isFinite(currentIndex)) {
    return url
  }

  const imageGroupOffset = Math.floor(currentIndex / 10) * 10
  const targetVariantName = usage === 'chatThumb' ? 'thumb' : 'large'
  const targetVariantIndex = usage === 'chatThumb'
    ? imageGroupOffset + 3
    : imageGroupOffset + 1

  return url.replace(
    /_(original|large|medium|thumb|blur)_(\d+)(\.[a-zA-Z0-9]+)(?=$|[?#])/,
    `_${targetVariantName}_${targetVariantIndex}$3`
  )
}

export function selectChatImageUrls(
  urls: ReadonlyArray<string | null | undefined> | null | undefined,
  usage: Extract<ShowcaseImageUsage, 'chatThumb' | 'chatPreview'> = 'chatThumb'
): string[] {
  const cleanUrls = normalizeShowcaseImageUrls(urls)

  return Array.from(
    new Set(
      cleanUrls
        .map(url => selectChatFallbackImageUrl(url, usage))
        .filter((url): url is string => Boolean(url))
    )
  )
}

export function selectShowcaseImageBlurDataUrl(variants: ShowcaseImageVariants | null | undefined): string | null {
  return normalizeShowcaseImageUrl(variants?.blurDataUrl)
}

export function createRemoteOnlyShowcaseImageVariants(urlInput: string | null | undefined): ShowcaseImageVariants | null {
  const url = normalizeShowcaseImageUrl(urlInput)

  if (!url) return null

  return {
    originalUrl: url,
    largeUrl: url,
    mediumUrl: url,
    thumbUrl: url,
    blurDataUrl: null
  }
}

export function selectShowcaseImageVariantList(
  variants: ReadonlyArray<ShowcaseImageVariants | null | undefined> | null | undefined,
  usage: Extract<ShowcaseImageUsage, 'chatThumb' | 'chatPreview'>
): string[] {
  if (!variants?.length) return []

  return Array.from(
    new Set(
      variants
        .map(item => selectImageVariantUrl(item, usage))
        .filter((item): item is string => Boolean(item))
    )
  )
}