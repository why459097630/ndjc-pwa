'use client'

import React from 'react'
import {
  APK_SHOWCASE_COLOR_TOKENS,
  NDJC_GLOBAL_UI_TOKENS,
  cx
} from './showcaseTokens'
import { apkVisuallyHiddenStyle } from './showcaseControls'

export const APK_MEDIA_UI = {
  imageRadius: 16,
  imageEditRadius: NDJC_GLOBAL_UI_TOKENS.components.input.radius,
  imageEditSize: 96,
  imageGridColumns: 3,
  imageGridGap: 10,
  imageRemoveSize: 22,
  imageRemovePadding: 6,
  imageRemoveIconSize: 14,
  uploadIconSize: 34,
  uploadBg: 'rgba(255, 255, 255, 0.74)',
  uploadPressedBg: 'rgba(255, 255, 255, 0.92)',
  uploadBorder: 'rgba(15, 23, 42, 0.12)',
  uploadPressedBorder: `rgba(${APK_SHOWCASE_COLOR_TOKENS.primaryRgb}, 0.28)`,
  uploadIconColor: APK_SHOWCASE_COLOR_TOKENS.primary,
  imageTileBg: '#f1f1f1',
  imagePlaceholderBg: '#f1f1f1',
  imageShimmerLight: '#f8fafc',
  imageShimmerDark: '#f1f1f1',
  imageShimmerStart: -300,
  imageShimmerEnd: 900,
  imageShimmerBrushSize: 300,
  removeBg: '#e53935',
  dangerBg: '#e53935',
  white: '#ffffff',
  black: '#000000',
  fullscreenBg: '#000000',
  fullscreenZ: 1000003,
  fullscreenCloseSize: 34,
  fullscreenClosePadding: 14,
  fullscreenCloseBg: 'rgba(0, 0, 0, 0.55)',
  fullscreenCloseIconSize: 24,
  fullscreenTopActionGap: 10,
  fullscreenDownloadPaddingX: 4,
  fullscreenDownloadPaddingY: 2,
  fullscreenDownloadRadius: 8,
  fullscreenDownloadTextSize: 12,
  fullscreenDownloadTextWeight: 500,
  fullscreenDownloadLineHeight: 1.2,
  fullscreenLongPressDelayMs: 520,
  fullscreenSingleClickDelayMs: 280,
  fullscreenClickSuppressMs: 360,
  fullscreenImageMaxWidth: '100%',
  fullscreenImageMaxHeight: '100%',
  fullscreenPagerButtonSize: 44,
  fullscreenSaveBottom: 20,
  fullscreenPageIndicatorEnd: 14,
  fullscreenPageIndicatorBottom: 18,
  fullscreenPageIndicatorRadius: 10,
  fullscreenPageIndicatorPaddingX: 10,
  fullscreenPageIndicatorPaddingY: 6,
  fullscreenPageIndicatorBg: 'rgba(0, 0, 0, 0.35)',
  fullscreenPageIndicatorTextColor: 'rgba(255, 255, 255, 0.85)',
  fullscreenPageIndicatorFontSize: 12,
  fullscreenPageIndicatorFontWeight: 500,
  fullscreenPageIndicatorLineHeight: 1,
  pressedScale: 0.965,
  shadow2: '0 2px 6px rgba(0, 0, 0, 0.10)',
  dragOverlayShadow: '0 14px 28px rgba(0, 0, 0, 0.26)',
  dragOverlayScale: 1.04,
  dragLongPressMs: 360,
  dragPreviewTransitionMs: 140,
  imageFailureTimeoutMs: 8000,
  imageFailureIconSize: 28,
  imageFailureTextSize: 12,
  imageFailureTextWeight: 600,
  imageFailureTextColor: 'rgba(0, 0, 0, 0.45)',
  imageFailureIconColor: 'rgba(0, 0, 0, 0.32)',
  imageFailureGap: 6,
  imageFailurePadding: 10,
  shimmerDurationMs: 1100,
  imageFadeMs: 180,
  zoomMax: 4,
  zoomDoubleTap: 2,
  fullscreenTapSlopPx: 16,
  fullscreenSwipeThreshold: 56,
  fullscreenSwipeVerticalTolerance: 48
} as const

export const apkImageRootStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'block',
  overflow: 'hidden',
  background: APK_MEDIA_UI.imagePlaceholderBg
}

export const apkImageFillStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'cover',
  background: APK_MEDIA_UI.imagePlaceholderBg,
  transition: `opacity ${APK_MEDIA_UI.imageFadeMs}ms ease`
}

export const apkImagePlaceholderStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  overflow: 'hidden',
  background: APK_MEDIA_UI.imagePlaceholderBg
}

export const apkImageFailurePlaceholderStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: APK_MEDIA_UI.imageFailureGap,
  padding: APK_MEDIA_UI.imageFailurePadding,
  boxSizing: 'border-box',
  overflow: 'hidden',
  background: APK_MEDIA_UI.imagePlaceholderBg,
  color: APK_MEDIA_UI.imageFailureTextColor,
  textAlign: 'center'
}

export const apkImageFailureIconStyle: React.CSSProperties = {
  width: APK_MEDIA_UI.imageFailureIconSize,
  height: APK_MEDIA_UI.imageFailureIconSize,
  display: 'block',
  color: APK_MEDIA_UI.imageFailureIconColor,
  flex: '0 0 auto'
}

export const apkImageFailureTextStyle: React.CSSProperties = {
  display: 'block',
  maxWidth: '100%',
  color: APK_MEDIA_UI.imageFailureTextColor,
  fontSize: APK_MEDIA_UI.imageFailureTextSize,
  lineHeight: 1.2,
  fontWeight: APK_MEDIA_UI.imageFailureTextWeight,
  textAlign: 'center',
  wordBreak: 'break-word'
}

export const apkImageShimmerLayerStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  backgroundImage: `linear-gradient(135deg, ${APK_MEDIA_UI.imageShimmerDark}, ${APK_MEDIA_UI.imageShimmerLight}, ${APK_MEDIA_UI.imageShimmerDark})`,
  backgroundSize: `${APK_MEDIA_UI.imageShimmerBrushSize}px ${APK_MEDIA_UI.imageShimmerBrushSize}px`,
  backgroundRepeat: 'no-repeat',
  animation: `ndjc-image-shimmer-translate ${APK_MEDIA_UI.shimmerDurationMs}ms cubic-bezier(0, 0, 0.2, 1) infinite`
}

export const apkImageShimmerKeyframes = `
@keyframes ndjc-image-shimmer-translate {
  0% {
    background-position: ${APK_MEDIA_UI.imageShimmerStart}px 0px;
  }

  100% {
    background-position: ${APK_MEDIA_UI.imageShimmerEnd}px 0px;
  }
}
`

export const apkEditableImageTileStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1',
  border: 0,
  borderRadius: APK_MEDIA_UI.imageEditRadius,
  padding: 0,
  overflow: 'hidden',
  background: APK_MEDIA_UI.imageTileBg,
  boxShadow: APK_MEDIA_UI.shadow2
}

export const apkUploadTileStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '1 / 1',
  border: `1px dashed ${APK_MEDIA_UI.uploadBorder}`,
  borderRadius: APK_MEDIA_UI.imageEditRadius,
  padding: 12,
  overflow: 'hidden',
  background: APK_MEDIA_UI.uploadBg,
  boxShadow: 'none',
  display: 'grid',
  placeItems: 'center',
  color: APK_MEDIA_UI.uploadIconColor,
  cursor: 'pointer',
  boxSizing: 'border-box',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation',
  transition: `transform ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, border-color ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, background ${NDJC_GLOBAL_UI_TOKENS.motion.fast}, box-shadow ${NDJC_GLOBAL_UI_TOKENS.motion.fast}`
}

export const apkRemoveCornerButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: APK_MEDIA_UI.imageRemovePadding,
  right: APK_MEDIA_UI.imageRemovePadding,
  width: APK_MEDIA_UI.imageRemoveSize,
  height: APK_MEDIA_UI.imageRemoveSize,
  border: 0,
  borderRadius: 999,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  color: APK_MEDIA_UI.white,
  background: APK_MEDIA_UI.dangerBg,
  boxShadow: APK_MEDIA_UI.shadow2,
  fontSize: APK_MEDIA_UI.imageRemoveIconSize,
  lineHeight: 1,
  fontWeight: 800,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation'
}

export const apkEditableGridStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: `repeat(${APK_MEDIA_UI.imageGridColumns}, minmax(0, 1fr))`,
  gap: APK_MEDIA_UI.imageGridGap
}

export const apkFullscreenBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: APK_MEDIA_UI.fullscreenZ,
  display: 'grid',
  placeItems: 'center',
  background: APK_MEDIA_UI.fullscreenBg
}

export const apkFullscreenTopActionsStyle: React.CSSProperties = {
  position: 'absolute',
  top: `calc(${APK_MEDIA_UI.fullscreenClosePadding}px + env(safe-area-inset-top))`,
  right: `calc(${APK_MEDIA_UI.fullscreenClosePadding}px + env(safe-area-inset-right))`,
  zIndex: 3,
  display: 'flex',
  alignItems: 'center',
  gap: APK_MEDIA_UI.fullscreenTopActionGap
}

export const apkFullscreenDownloadButtonStyle: React.CSSProperties = {
  minWidth: 0,
  minHeight: 0,
  border: 0,
  borderRadius: APK_MEDIA_UI.fullscreenDownloadRadius,
  padding: `${APK_MEDIA_UI.fullscreenDownloadPaddingY}px ${APK_MEDIA_UI.fullscreenDownloadPaddingX}px`,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: APK_MEDIA_UI.white,
  background: 'transparent',
  boxShadow: 'none',
  fontSize: APK_MEDIA_UI.fullscreenDownloadTextSize,
  lineHeight: APK_MEDIA_UI.fullscreenDownloadLineHeight,
  fontWeight: APK_MEDIA_UI.fullscreenDownloadTextWeight,
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation'
}

export const apkFullscreenCloseButtonStyle: React.CSSProperties = {
  width: APK_MEDIA_UI.fullscreenCloseSize,
  height: APK_MEDIA_UI.fullscreenCloseSize,
  minWidth: APK_MEDIA_UI.fullscreenCloseSize,
  minHeight: APK_MEDIA_UI.fullscreenCloseSize,
  border: 0,
  borderRadius: 999,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  color: APK_MEDIA_UI.white,
  background: APK_MEDIA_UI.fullscreenCloseBg,
  boxShadow: 'none',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation'
}
export const apkFullscreenCloseIconStyle: React.CSSProperties = {
  width: APK_MEDIA_UI.fullscreenCloseIconSize,
  height: APK_MEDIA_UI.fullscreenCloseIconSize,
  display: 'block',
  color: APK_MEDIA_UI.white,
  pointerEvents: 'none'
}

export const apkFullscreenImageStyle: React.CSSProperties = {
  width: APK_MEDIA_UI.fullscreenImageMaxWidth,
  height: APK_MEDIA_UI.fullscreenImageMaxHeight,
  objectFit: 'contain',
  userSelect: 'none',
  touchAction: 'none'
}

export const apkFullscreenPagerButtonStyle: React.CSSProperties = {
  width: APK_MEDIA_UI.fullscreenPagerButtonSize,
  height: APK_MEDIA_UI.fullscreenPagerButtonSize,
  border: 0,
  borderRadius: 999,
  padding: 0,
  display: 'grid',
  placeItems: 'center',
  color: APK_MEDIA_UI.white,
  background: 'rgba(0, 0, 0, 0.32)',
  fontSize: 28,
  lineHeight: 1,
  fontWeight: 500
}

export const apkFullscreenPageIndicatorStyle: React.CSSProperties = {
  position: 'absolute',
  right: `calc(${APK_MEDIA_UI.fullscreenPageIndicatorEnd}px + env(safe-area-inset-right))`,
  bottom: `calc(${APK_MEDIA_UI.fullscreenPageIndicatorBottom}px + env(safe-area-inset-bottom))`,
  zIndex: 3,
  borderRadius: APK_MEDIA_UI.fullscreenPageIndicatorRadius,
  padding: `${APK_MEDIA_UI.fullscreenPageIndicatorPaddingY}px ${APK_MEDIA_UI.fullscreenPageIndicatorPaddingX}px`,
  color: APK_MEDIA_UI.fullscreenPageIndicatorTextColor,
  background: APK_MEDIA_UI.fullscreenPageIndicatorBg,
  fontSize: APK_MEDIA_UI.fullscreenPageIndicatorFontSize,
  lineHeight: APK_MEDIA_UI.fullscreenPageIndicatorLineHeight,
  fontWeight: APK_MEDIA_UI.fullscreenPageIndicatorFontWeight,
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  pointerEvents: 'none'
}


export function NdjcShimmerImage({
  src,
  alt,
  className,
  placeholderCornerRadius = APK_MEDIA_UI.imageRadius,
  contentScale = 'cover',
  loading = 'lazy',
  fetchPriority = 'low',
  decoding = 'async',
  imageWidth,
  imageHeight,
  sizes,
  blurDataUrl,
  backgroundColor = APK_MEDIA_UI.imagePlaceholderBg,
  showShimmer = true
}: {
  src?: string | null
  alt: string
  className?: string
  placeholderCornerRadius?: number
  contentScale?: React.CSSProperties['objectFit']
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
  decoding?: 'async' | 'sync' | 'auto'
  imageWidth?: number
  imageHeight?: number
  sizes?: string
  blurDataUrl?: string | null
  backgroundColor?: string
  showShimmer?: boolean
}) {
  const cleanSrc = src?.trim() || ''
  const imageRef = React.useRef<HTMLImageElement | null>(null)
  const [loaded, setLoaded] = React.useState(false)
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    if (!cleanSrc) {
      setLoaded(false)
      setFailed(true)
      return () => {
        cancelled = true
      }
    }

    setLoaded(false)
    setFailed(false)

    const currentImage = imageRef.current

    if (currentImage?.complete && currentImage.naturalWidth > 0) {
      setLoaded(true)
      setFailed(false)
      return () => {
        cancelled = true
      }
    }

    const failureTimer = window.setTimeout(() => {
      if (cancelled) return
      setLoaded(false)
      setFailed(true)
    }, APK_MEDIA_UI.imageFailureTimeoutMs)

    const probeImage = new Image()

    probeImage.onload = () => {
      if (cancelled) return
      window.clearTimeout(failureTimer)
      setLoaded(true)
      setFailed(false)
    }

    probeImage.onerror = () => {
      if (cancelled) return
      window.clearTimeout(failureTimer)
      setLoaded(false)
      setFailed(true)
    }

    probeImage.src = cleanSrc

    return () => {
      cancelled = true
      window.clearTimeout(failureTimer)
      probeImage.onload = null
      probeImage.onerror = null
    }
  }, [cleanSrc])

  return (
    <span
      className={cx('ndjc-shimmer-image-root', !loaded && !failed && 'is-loading', failed && 'is-failed', className)}
      style={{
        ...apkImageRootStyle,
        borderRadius: placeholderCornerRadius,
        background: backgroundColor
      }}
      aria-label={alt}
    >
      <style>{apkImageShimmerKeyframes}</style>

      {!loaded && !failed ? (
        <span
          className="ndjc-shimmer-image-placeholder"
          style={{
            ...apkImagePlaceholderStyle,
            borderRadius: placeholderCornerRadius,
            background: backgroundColor,
            backgroundImage: blurDataUrl ? `url(${blurDataUrl})` : apkImagePlaceholderStyle.backgroundImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          aria-hidden="true"
        >
          {showShimmer ? (
            <span
              className="ndjc-shimmer-image-placeholder-layer"
              style={apkImageShimmerLayerStyle}
              aria-hidden="true"
            />
          ) : null}
        </span>
      ) : null}

      {failed ? (
        <span
          className="ndjc-shimmer-image-failed"
          style={{
            ...apkImageFailurePlaceholderStyle,
            borderRadius: placeholderCornerRadius,
            background: backgroundColor
          }}
          aria-hidden="true"
        >
          <span style={apkImageFailureIconStyle} aria-hidden="true">
            <svg
              width={APK_MEDIA_UI.imageFailureIconSize}
              height={APK_MEDIA_UI.imageFailureIconSize}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M7 15l3.2-3.2a1.1 1.1 0 0 1 1.6 0L15 15l1.2-1.2a1.1 1.1 0 0 1 1.6 0L21 17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="8"
                cy="9"
                r="1.2"
                fill="currentColor"
              />
            </svg>
          </span>

          <span style={apkImageFailureTextStyle}>
            Image unavailable
          </span>
        </span>
      ) : null}

      {cleanSrc && !failed ? (
        <img
          ref={imageRef}
          className="ndjc-shimmer-image"
          draggable={false}
          style={{
            ...apkImageFillStyle,
            objectFit: contentScale,
            background: backgroundColor,
            opacity: loaded ? 1 : 0,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}
          src={cleanSrc}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={decoding}
          width={imageWidth}
          height={imageHeight}
          sizes={sizes}
          onLoad={() => {
            setLoaded(true)
            setFailed(false)
          }}
          onError={() => {
            setLoaded(false)
            setFailed(true)
          }}
        />
      ) : null}
    </span>
  )
}


export function UploadTile({
  label = 'Upload',
  onClick,
  disabled,
  enabled,
  hasImage
}: {
  label?: string
  onClick?: () => void
  disabled?: boolean
  enabled?: boolean
  hasImage?: boolean
}) {
  const canClick = enabled ?? !disabled
  const [pressed, setPressed] = React.useState(false)
  const isPressed = Boolean(pressed && canClick)

  function releasePressState(): void {
    setPressed(false)
  }

  return (
    <button
      type="button"
      className={cx('ndjc-upload-tile', !canClick && 'is-disabled', hasImage && 'has-image')}
      style={{
        ...apkUploadTileStyle,
        borderColor: isPressed ? APK_MEDIA_UI.uploadPressedBorder : APK_MEDIA_UI.uploadBorder,
        background: isPressed ? APK_MEDIA_UI.uploadPressedBg : APK_MEDIA_UI.uploadBg,
        boxShadow: isPressed ? '0 8px 18px rgba(15, 23, 42, 0.08)' : 'none',
        transform: isPressed ? `scale(${NDJC_GLOBAL_UI_TOKENS.motion.pressScale})` : 'scale(1)',
        opacity: canClick ? 1 : 0.55,
        cursor: canClick ? 'pointer' : 'not-allowed'
      }}
      disabled={!canClick}
      onPointerDown={() => {
        if (!canClick) return
        setPressed(true)
      }}
      onPointerUp={releasePressState}
      onPointerCancel={releasePressState}
      onPointerLeave={releasePressState}
      onBlur={releasePressState}
      onClick={onClick}
      aria-label={label}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'grid',
          placeItems: 'center',
          color: APK_MEDIA_UI.uploadIconColor
        }}
      >
        <span
          style={{
            color: APK_MEDIA_UI.uploadIconColor,
            fontSize: APK_MEDIA_UI.uploadIconSize,
            lineHeight: 1,
            fontWeight: 400
          }}
        >
          ＋
        </span>
      </span>

      <strong className="ndjc-upload-tile-label" style={apkVisuallyHiddenStyle}>
        {label}
      </strong>
    </button>
  )
}

export function ImageTile({
  src,
  uriString,
  label = 'Image',
  enabled = true,
  onClick,
  onPreview,
  onRemove,
  onPreviewPointerDown,
  onPreviewPointerMove,
  onPreviewPointerUp,
  onPreviewPointerCancel,
  onPreviewPointerLeave,
  onPreviewClickCapture
}: {
  src?: string | null
  uriString?: string | null
  label?: string
  enabled?: boolean
  onClick?: () => void
  onPreview?: () => void
  onRemove?: () => void
  onPreviewPointerDown?: React.PointerEventHandler<HTMLButtonElement>
  onPreviewPointerMove?: React.PointerEventHandler<HTMLButtonElement>
  onPreviewPointerUp?: React.PointerEventHandler<HTMLButtonElement>
  onPreviewPointerCancel?: React.PointerEventHandler<HTMLButtonElement>
  onPreviewPointerLeave?: React.PointerEventHandler<HTMLButtonElement>
  onPreviewClickCapture?: React.MouseEventHandler<HTMLButtonElement>
}) {
  const cleanSrc = src?.trim() || uriString?.trim() || ''

  return (
    <section className="ndjc-image-tile" style={apkEditableImageTileStyle}>
      <button
        type="button"
        className="ndjc-image-tile-preview"
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          border: 0,
          padding: 0,
          display: 'block',
          background: 'transparent',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
        onDragStart={event => {
          event.preventDefault()
          event.stopPropagation()
        }}
        onPointerDown={onPreviewPointerDown}
        onPointerMove={onPreviewPointerMove}
        onPointerUp={onPreviewPointerUp}
        onPointerCancel={onPreviewPointerCancel}
        onPointerLeave={onPreviewPointerLeave}
        onClickCapture={onPreviewClickCapture}
        onClick={onPreview || onClick}
        onContextMenu={event => {
          event.preventDefault()
          event.stopPropagation()
        }}
        aria-label={label}
      >
        <NdjcShimmerImage
          src={cleanSrc}
          alt={label}
          placeholderCornerRadius={APK_MEDIA_UI.imageEditRadius}
          contentScale="cover"
        />
      </button>

      {enabled && onRemove ? (
        <button
          type="button"
          className="ndjc-image-tile-remove"
          style={apkRemoveCornerButtonStyle}
          onPointerDown={event => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onPointerMove={event => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onPointerUp={event => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onPointerCancel={event => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onClick={event => {
            event.preventDefault()
            event.stopPropagation()
            onRemove()
          }}
          aria-label="Remove image"
        >
          ×
        </button>
      ) : null}
    </section>
  )
}

export function NdjcSingleEditableImage({
  src,
  onPick,
  onRemove,
  label = 'Image',
  enabled = true,
  onPreview
}: {
  src?: string | null
  onPick?: () => void
  onRemove?: () => void
  label?: string
  enabled?: boolean
  onPreview?: () => void
}) {
  const cleanSrc = src?.trim() || ''

  return (
    <section
      className="ndjc-single-editable-image"
      style={{
        width: '100%',
        aspectRatio: '1 / 1'
      }}
    >
      {cleanSrc ? (
        <ImageTile
          src={cleanSrc}
          label={label}
          enabled={enabled}
          onClick={onPick}
          onPreview={onPreview || onPick}
          onRemove={onRemove}
        />
      ) : (
        <UploadTile label={label} onClick={onPick} enabled={enabled && Boolean(onPick)} hasImage={false} />
      )}
    </section>
  )
}

