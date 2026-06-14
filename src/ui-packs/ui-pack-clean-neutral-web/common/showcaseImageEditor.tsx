'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { APK_SHOWCASE_COLOR_TOKENS, cx } from './showcaseTokens'
import { NdjcSystemBars } from './showcaseLayout'
import {
  APK_MEDIA_UI,
  ImageTile,
  NdjcShimmerImage,
  UploadTile,
  apkEditableGridStyle,
  apkFullscreenBackdropStyle,
  apkFullscreenCloseButtonStyle,
  apkFullscreenCloseIconStyle,
  apkFullscreenDownloadButtonStyle,
  apkFullscreenImageStyle,
  apkFullscreenPageIndicatorStyle,
  apkFullscreenPagerButtonStyle,
  apkFullscreenTopActionsStyle
} from './showcaseMedia'

const NDJC_FULLSCREEN_IMAGE_THEME_COLOR = '#000000'
const NDJC_DEFAULT_PWA_THEME_COLOR = '#eff3f2'

function ndjcApplyThemeColor(color: string): void {
  if (typeof document === 'undefined') return

  const themeMetaNodes = Array.from(document.head.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]'))

  if (!themeMetaNodes.length) {
    const themeMetaNode = document.createElement('meta')
    themeMetaNode.name = 'theme-color'
    themeMetaNode.content = color
    document.head.appendChild(themeMetaNode)
    return
  }

  themeMetaNodes.forEach(themeMetaNode => {
    themeMetaNode.content = color
  })
}

function ndjcForceStatusBarRepaint(): void {
  if (typeof document === 'undefined') return

  const previousDocumentBackground = document.documentElement.style.background
  const previousBodyBackground = document.body.style.background

  document.documentElement.style.background = NDJC_DEFAULT_PWA_THEME_COLOR
  document.body.style.background = NDJC_DEFAULT_PWA_THEME_COLOR

  window.requestAnimationFrame(() => {
    document.documentElement.style.background = previousDocumentBackground
    document.body.style.background = previousBodyBackground
  })
}

const ndjcImageEditorDialogBackdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000002,
  padding: 24,
  display: 'grid',
  placeItems: 'center',
  background: 'rgba(0, 0, 0, 0.42)'
}

const ndjcImageEditorDialogSurfaceStyle: React.CSSProperties = {
  width: 'min(100%, 340px)',
  borderRadius: 24,
  padding: 24,
  display: 'grid',
  gap: 18,
  color: 'rgba(0, 0, 0, 0.80)',
  background: '#ffffff',
  boxShadow: '0 10px 28px rgba(0, 0, 0, 0.22)'
}

const ndjcImageEditorDialogTitleStyle: React.CSSProperties = {
  margin: 0,
  color: '#000000',
  fontSize: 22,
  lineHeight: 1.2,
  fontWeight: 600
}

const ndjcImageEditorDialogMessageStyle: React.CSSProperties = {
  margin: 0,
  color: 'rgba(0, 0, 0, 0.70)',
  fontSize: 14,
  lineHeight: 1.45,
  fontWeight: 400
}

const ndjcImageEditorDialogActionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 8
}

function ndjcImageEditorDialogTextButtonStyle({
  primary = false
}: {
  primary?: boolean
} = {}): React.CSSProperties {
  return {
    minHeight: 40,
    border: 0,
    borderRadius: 999,
    padding: '0 12px',
    display: 'inline-grid',
    placeItems: 'center',
    color: primary ? APK_SHOWCASE_COLOR_TOKENS.primary : 'rgba(0, 0, 0, 0.60)',
    background: 'transparent',
    boxShadow: 'none',
    fontSize: 14,
    lineHeight: 1,
    fontWeight: primary ? 600 : 500,
    whiteSpace: 'nowrap',
    cursor: 'pointer'
  }
}

function NdjcImageEditorSaveDialog({
  onConfirm,
  onDismiss
}: {
  onConfirm: () => void
  onDismiss: () => void
}) {
  return (
    <section
      className="ndjc-dialog-backdrop"
      style={ndjcImageEditorDialogBackdropStyle}
      onMouseDown={event => {
        if (event.target === event.currentTarget) {
          onDismiss()
        }
      }}
    >
      <section
        className="ndjc-base-dialog"
        style={ndjcImageEditorDialogSurfaceStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ndjc-image-editor-save-dialog-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <h2 id="ndjc-image-editor-save-dialog-title" style={ndjcImageEditorDialogTitleStyle}>
          Download image
        </h2>

        <p style={ndjcImageEditorDialogMessageStyle}>
          Save this image to your device?
        </p>

        <footer style={ndjcImageEditorDialogActionsStyle}>
          <button
            type="button"
            style={ndjcImageEditorDialogTextButtonStyle()}
            onClick={onDismiss}
          >
            Cancel
          </button>

          <button
            type="button"
            style={ndjcImageEditorDialogTextButtonStyle({ primary: true })}
            onClick={onConfirm}
          >
            Save
          </button>
        </footer>
      </section>
    </section>
  )
}

export function FullscreenImagePreviewDialog({
  imageUrl,
  onDismiss
}: {
  imageUrl: string | null
  onDismiss: () => void
}) {
  const cleanImageUrl = imageUrl?.trim() || ''
  if (!cleanImageUrl) return null

  return (
    <NdjcFullscreenImageViewerScreen
      images={[cleanImageUrl]}
      startIndex={0}
      onDismiss={onDismiss}
    />
  )
}

export function NdjcFullscreenImageViewerScreen({
  imageUrl,
  images,
  startIndex = 0,
  onBack,
  onDismiss,
  onSave
}: {
  imageUrl?: string | null
  images?: string[]
  startIndex?: number
  onBack?: () => void
  onDismiss?: () => void
  onSave?: (url: string) => void
}) {
  const cleanImages = React.useMemo(() => {
    const fromImages = (images || [])
      .map(url => url.trim())
      .filter(Boolean)

    const singleImage = imageUrl?.trim() || ''

    return fromImages.length ? fromImages : singleImage ? [singleImage] : []
  }, [imageUrl, images])

  const safeStart = Math.min(Math.max(startIndex, 0), Math.max(cleanImages.length - 1, 0))
  const [currentIndex, setCurrentIndex] = React.useState(safeStart)
  const [scale, setScale] = React.useState(1)
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  const [pagerDragOffset, setPagerDragOffset] = React.useState(0)
  const [isPagerDragging, setIsPagerDragging] = React.useState(false)
  const [pendingSaveUrl, setPendingSaveUrl] = React.useState<string | null>(null)
  const singleClickTimerRef = React.useRef<number | null>(null)
  const longPressTimerRef = React.useRef<number | null>(null)
  const clickSuppressTimerRef = React.useRef<number | null>(null)
  const activePointersRef = React.useRef<Map<number, { x: number; y: number }>>(new Map())
  const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null)
  const lastPanPointRef = React.useRef<{ x: number; y: number } | null>(null)
  const pinchStartRef = React.useRef<{
    distance: number
    scale: number
    offsetX: number
    offsetY: number
    centerX: number
    centerY: number
  } | null>(null)
  const clickSuppressedRef = React.useRef(false)
  const didMoveRef = React.useRef(false)
  const fullscreenTouchTapRef = React.useRef<{
    x: number
    y: number
    timeMs: number
  } | null>(null)
  const lastFullscreenTapAtRef = React.useRef(0)
  const activeUrl = cleanImages[currentIndex] || ''
  const handleDismiss = onDismiss || onBack
  const [isLargeViewport, setIsLargeViewport] = React.useState(false)
  const [fullscreenPortalTarget, setFullscreenPortalTarget] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => {
    if (typeof document === 'undefined') return

    setFullscreenPortalTarget(document.body)
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    function updateViewportMode(): void {
      setIsLargeViewport(window.innerWidth >= 768)
    }

    updateViewportMode()
    window.addEventListener('resize', updateViewportMode)

    return () => {
      window.removeEventListener('resize', updateViewportMode)
    }
  }, [])

  React.useEffect(() => {
    if (typeof document === 'undefined') return

    const previousBodyOverflow = document.body.style.overflow
    const previousBodyTouchAction = document.body.style.touchAction
    const previousDocumentOverflow = document.documentElement.style.overflow

    ndjcApplyThemeColor(NDJC_FULLSCREEN_IMAGE_THEME_COLOR)

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.body.style.touchAction = previousBodyTouchAction
      document.documentElement.style.overflow = previousDocumentOverflow
      ndjcApplyThemeColor(NDJC_DEFAULT_PWA_THEME_COLOR)
      ndjcForceStatusBarRepaint()
    }
  }, [])

  function clearSingleClickTimer(): void {
    if (!singleClickTimerRef.current) return
    window.clearTimeout(singleClickTimerRef.current)
    singleClickTimerRef.current = null
  }

  function clearLongPressTimer(): void {
    if (!longPressTimerRef.current) return
    window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = null
  }

  function clearClickSuppressTimer(): void {
    if (!clickSuppressTimerRef.current) return
    window.clearTimeout(clickSuppressTimerRef.current)
    clickSuppressTimerRef.current = null
  }

  function suppressClickOnce(durationMs: number = APK_MEDIA_UI.fullscreenClickSuppressMs): void {
    clickSuppressedRef.current = true
    clearClickSuppressTimer()

    clickSuppressTimerRef.current = window.setTimeout(() => {
      clickSuppressedRef.current = false
      clickSuppressTimerRef.current = null
    }, durationMs)
  }

  function clearPinchState(): void {
    pinchStartRef.current = null
  }

  function clearPointerState(): void {
    activePointersRef.current.clear()
    pointerStartRef.current = null
    lastPanPointRef.current = null
    clearPinchState()
    didMoveRef.current = false
  }

  function resetZoom(): void {
    setScale(1)
    setOffset({ x: 0, y: 0 })
    setPagerDragOffset(0)
    setIsPagerDragging(false)
    clearPointerState()
  }

  function resetPageGestureState(): void {
    setScale(1)
    setOffset({ x: 0, y: 0 })
    setPagerDragOffset(0)
    setIsPagerDragging(false)
    clearPointerState()
    clearLongPressTimer()
    clearSingleClickTimer()
  }

  function clampScale(value: number): number {
    return Math.min(APK_MEDIA_UI.zoomMax, Math.max(1, value))
  }

  function pointerDistance(first: { x: number; y: number }, second: { x: number; y: number }): number {
    const deltaX = second.x - first.x
    const deltaY = second.y - first.y
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }

  function pointerCenter(first: { x: number; y: number }, second: { x: number; y: number }): { x: number; y: number } {
    return {
      x: (first.x + second.x) / 2,
      y: (first.y + second.y) / 2
    }
  }

  function activePointerPair(): {
    first: { x: number; y: number }
    second: { x: number; y: number }
  } | null {
    const points = Array.from(activePointersRef.current.values())
    if (points.length < 2) return null

    return {
      first: points[0],
      second: points[1]
    }
  }

  function requestSaveCurrentImage(): void {
    if (!onSave || !activeUrl) return

    clearSingleClickTimer()
    clearLongPressTimer()
    suppressClickOnce(640)
    setPendingSaveUrl(activeUrl)
  }

  function confirmPendingSave(): void {
    const url = pendingSaveUrl
    if (!url) return

    setPendingSaveUrl(null)
    onSave?.(url)
  }

  function dismissPendingSave(): void {
    setPendingSaveUrl(null)
  }

  function goPrevious(): void {
    if (currentIndex <= 0) return

    setCurrentIndex(index => Math.max(0, index - 1))
    resetPageGestureState()
  }

  function goNext(): void {
    if (currentIndex >= cleanImages.length - 1) return

    setCurrentIndex(index => Math.min(cleanImages.length - 1, index + 1))
    resetPageGestureState()
  }

  function handleSingleTap(event: React.MouseEvent<HTMLElement>): void {
    event.preventDefault()
    event.stopPropagation()

    if (clickSuppressedRef.current || didMoveRef.current || pinchStartRef.current) {
      clickSuppressedRef.current = false
      didMoveRef.current = false
      return
    }

    runFullscreenSingleTapAction()
  }

  function handleDoubleTap(event: React.MouseEvent<HTMLElement>): void {
    event.preventDefault()
    event.stopPropagation()

    clearSingleClickTimer()
    clearLongPressTimer()
    clickSuppressedRef.current = false
    clearClickSuppressTimer()
    clearPointerState()
    setPagerDragOffset(0)
    setIsPagerDragging(false)

    if (scale > 1.01) {
      resetZoom()
      suppressClickOnce()
      return
    }

    setScale(APK_MEDIA_UI.zoomDoubleTap)
    setOffset({ x: 0, y: 0 })
    suppressClickOnce()
  }

  function runFullscreenSingleTapAction(): void {
    clearSingleClickTimer()

    singleClickTimerRef.current = window.setTimeout(() => {
      singleClickTimerRef.current = null

      if (clickSuppressedRef.current || didMoveRef.current || pinchStartRef.current) {
        clickSuppressedRef.current = false
        didMoveRef.current = false
        return
      }

      if (scale > 1.01) {
        resetZoom()
        return
      }

      handleDismiss?.()
    }, APK_MEDIA_UI.fullscreenSingleClickDelayMs)
  }

  function isFullscreenControlTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false

    return Boolean(
      target.closest('[data-fullscreen-control="true"]') ||
      target.closest('.ndjc-dialog') ||
      target.closest('[role="dialog"]')
    )
  }

  function handleFullscreenTouchStartCapture(event: React.TouchEvent<HTMLElement>): void {
    if (pendingSaveUrl) return
    if (event.touches.length !== 1) {
      clearSingleClickTimer()
      fullscreenTouchTapRef.current = null
      return
    }

    const touch = event.touches[0]

    clearSingleClickTimer()

    fullscreenTouchTapRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timeMs: Date.now()
    }
  }

  function handleFullscreenTouchEndCapture(event: React.TouchEvent<HTMLElement>): void {
    if (pendingSaveUrl) return
    if (isFullscreenControlTarget(event.target)) return

    const start = fullscreenTouchTapRef.current
    const touch = event.changedTouches[0]

    fullscreenTouchTapRef.current = null

    if (!start || !touch) return

    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    const durationMs = Date.now() - start.timeMs

    const isTapLike =
      absDeltaX <= APK_MEDIA_UI.fullscreenTapSlopPx &&
      absDeltaY <= APK_MEDIA_UI.fullscreenTapSlopPx &&
      durationMs <= 520

    if (!isTapLike) return

    event.preventDefault()
    event.stopPropagation()

    didMoveRef.current = false
    clickSuppressedRef.current = false
    clearClickSuppressTimer()

    const now = Date.now()
    const isDoubleTap = now - lastFullscreenTapAtRef.current <= APK_MEDIA_UI.fullscreenSingleClickDelayMs

    lastFullscreenTapAtRef.current = now

    if (isDoubleTap) {
      clearSingleClickTimer()
      clearLongPressTimer()
      clearPointerState()
      setPagerDragOffset(0)
      setIsPagerDragging(false)

      if (scale > 1.01) {
        resetZoom()
        suppressClickOnce()
        return
      }

      setScale(APK_MEDIA_UI.zoomDoubleTap)
      setOffset({ x: 0, y: 0 })
      suppressClickOnce()
      return
    }

    runFullscreenSingleTapAction()
  }

  function handleFullscreenTouchCancelCapture(): void {
    fullscreenTouchTapRef.current = null
  }

  function handlePointerDown(event: React.PointerEvent<HTMLElement>): void {
    event.preventDefault()
    event.stopPropagation()

    clearSingleClickTimer()

    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    })

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY
    }

    lastPanPointRef.current = {
      x: event.clientX,
      y: event.clientY
    }

    didMoveRef.current = false
    setPagerDragOffset(0)
    setIsPagerDragging(false)
    event.currentTarget.setPointerCapture?.(event.pointerId)

    const pair = activePointerPair()

    if (pair) {
      const center = pointerCenter(pair.first, pair.second)

      clearLongPressTimer()
      clearSingleClickTimer()
      suppressClickOnce(640)
      setPagerDragOffset(0)
      setIsPagerDragging(false)

      pinchStartRef.current = {
        distance: pointerDistance(pair.first, pair.second),
        scale,
        offsetX: offset.x,
        offsetY: offset.y,
        centerX: center.x,
        centerY: center.y
      }

      return
    }

    if (onSave) {
      clearLongPressTimer()
      longPressTimerRef.current = window.setTimeout(() => {
        longPressTimerRef.current = null
        requestSaveCurrentImage()
      }, APK_MEDIA_UI.fullscreenLongPressDelayMs)
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>): void {
    activePointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY
    })

    const pair = activePointerPair()

    if (pair) {
      event.preventDefault()
      event.stopPropagation()

      const center = pointerCenter(pair.first, pair.second)
      const distance = pointerDistance(pair.first, pair.second)

      if (!pinchStartRef.current) {
        pinchStartRef.current = {
          distance,
          scale,
          offsetX: offset.x,
          offsetY: offset.y,
          centerX: center.x,
          centerY: center.y
        }
      }

      const pinchStart = pinchStartRef.current
      const safeDistance = Math.max(1, pinchStart.distance)
      const nextScale = clampScale(pinchStart.scale * (distance / safeDistance))
      const scaleRatio = nextScale / Math.max(1, pinchStart.scale)
      const viewportCenterX = window.innerWidth / 2
      const viewportCenterY = window.innerHeight / 2

      didMoveRef.current = true
      suppressClickOnce(640)
      clearSingleClickTimer()
      clearLongPressTimer()
      setPagerDragOffset(0)
      setIsPagerDragging(false)
      setScale(nextScale)

      if (nextScale <= 1.01) {
        setOffset({ x: 0, y: 0 })
      } else {
        setOffset({
          x: pinchStart.offsetX + (center.x - pinchStart.centerX) + (center.x - viewportCenterX) * (1 - scaleRatio),
          y: pinchStart.offsetY + (center.y - pinchStart.centerY) + (center.y - viewportCenterY) * (1 - scaleRatio)
        })
      }

      return
    }

    const start = pointerStartRef.current
    if (!start) return

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    if (absDeltaX > APK_MEDIA_UI.fullscreenTapSlopPx || absDeltaY > APK_MEDIA_UI.fullscreenTapSlopPx) {
      didMoveRef.current = true
      suppressClickOnce()
      clearLongPressTimer()
    }

    if (scale > 1.01) {
      event.preventDefault()
      event.stopPropagation()

      const lastPoint = lastPanPointRef.current || {
        x: event.clientX,
        y: event.clientY
      }

      const movementX = event.clientX - lastPoint.x
      const movementY = event.clientY - lastPoint.y

      lastPanPointRef.current = {
        x: event.clientX,
        y: event.clientY
      }

      setPagerDragOffset(0)
      setIsPagerDragging(false)
      setOffset(previous => ({
        x: previous.x + movementX,
        y: previous.y + movementY
      }))
      return
    }

    if (cleanImages.length <= 1) return
    if (absDeltaX <= 4 || absDeltaX <= absDeltaY) return

    event.preventDefault()
    event.stopPropagation()

    const isAtFirstAndDraggingRight = currentIndex === 0 && deltaX > 0
    const isAtLastAndDraggingLeft = currentIndex === cleanImages.length - 1 && deltaX < 0
    const resistance = isAtFirstAndDraggingRight || isAtLastAndDraggingLeft ? 0.28 : 1

    setIsPagerDragging(true)
    setPagerDragOffset(deltaX * resistance)
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLElement>): void {
    clearLongPressTimer()

    activePointersRef.current.delete(event.pointerId)

    if (pinchStartRef.current) {
      suppressClickOnce(640)
      clearSingleClickTimer()

      if (activePointersRef.current.size < 2) {
        clearPinchState()
        pointerStartRef.current = {
          x: event.clientX,
          y: event.clientY
        }
        lastPanPointRef.current = {
          x: event.clientX,
          y: event.clientY
        }
      }

      if (scale <= 1.01) {
        setScale(1)
        setOffset({ x: 0, y: 0 })
      }

      setPagerDragOffset(0)
      setIsPagerDragging(false)
      return
    }

    const start = pointerStartRef.current
    pointerStartRef.current = null
    lastPanPointRef.current = null

    if (!start) {
      setPagerDragOffset(0)
      setIsPagerDragging(false)
      return
    }

    const deltaX = event.clientX - start.x
    const deltaY = event.clientY - start.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    const shouldSwipe =
      cleanImages.length > 1 &&
      scale <= 1.01 &&
      absDeltaX >= APK_MEDIA_UI.fullscreenSwipeThreshold &&
      absDeltaY <= APK_MEDIA_UI.fullscreenSwipeVerticalTolerance &&
      absDeltaX > absDeltaY

    if (!shouldSwipe) {
      setPagerDragOffset(0)
      setIsPagerDragging(false)

      const isTapLike =
        absDeltaX <= APK_MEDIA_UI.fullscreenTapSlopPx &&
        absDeltaY <= APK_MEDIA_UI.fullscreenTapSlopPx

      if (didMoveRef.current && !isTapLike) {
        suppressClickOnce()
        return
      }

      if (isTapLike) {
        didMoveRef.current = false
        clickSuppressedRef.current = false
        clearClickSuppressTimer()
        runFullscreenSingleTapAction()
        return
      }

      runFullscreenSingleTapAction()
      return
    }

    clearSingleClickTimer()
    suppressClickOnce()
    setPagerDragOffset(0)
    setIsPagerDragging(false)

    if (deltaX < 0) {
      goNext()
      return
    }

    goPrevious()
  }

  function handlePointerCancel(event?: React.PointerEvent<HTMLElement>): void {
    clearLongPressTimer()
    clearSingleClickTimer()
    suppressClickOnce()

    if (event) {
      activePointersRef.current.delete(event.pointerId)
    } else {
      activePointersRef.current.clear()
    }

    pointerStartRef.current = null
    lastPanPointRef.current = null
    clearPinchState()
    setPagerDragOffset(0)
    setIsPagerDragging(false)

    if (scale <= 1.01) {
      setScale(1)
      setOffset({ x: 0, y: 0 })
    }
  }

  React.useEffect(() => {
    setCurrentIndex(safeStart)
    resetPageGestureState()
  }, [safeStart, cleanImages.length])

  React.useEffect(() => {
    return () => {
      clearSingleClickTimer()
      clearLongPressTimer()
      clearClickSuppressTimer()
      clearPointerState()
    }
  }, [])

  if (!activeUrl || !fullscreenPortalTarget) return null

  const viewer = (
    <main
      className="ndjc-screen ndjc-fullscreen-image-viewer-screen"
      style={apkFullscreenBackdropStyle}
    >
      <NdjcSystemBars
        color={APK_MEDIA_UI.fullscreenBg}
        darkIcons={false}
        navigationBarColor={APK_MEDIA_UI.fullscreenBg}
        lightNavIcons={false}
        decorFitsSystemWindows={false}
      />

      <section
        className="ndjc-fullscreen-image-screen"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: APK_MEDIA_UI.fullscreenBg,
          overflow: 'hidden'
        }}
        onTouchStartCapture={handleFullscreenTouchStartCapture}
        onTouchEndCapture={handleFullscreenTouchEndCapture}
        onTouchCancelCapture={handleFullscreenTouchCancelCapture}
      >
        <section
          className="ndjc-fullscreen-image-pager"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            touchAction: 'none'
          }}
        >
          <section
            className="ndjc-fullscreen-image-pager-track"
            style={{
              display: 'flex',
              width: `${cleanImages.length * 100}%`,
              height: '100%',
              transform: `translateX(calc(${-currentIndex * (100 / cleanImages.length)}% + ${pagerDragOffset}px))`,
              transition: isPagerDragging ? 'none' : 'transform 220ms ease',
              willChange: 'transform'
            }}
          >
            {cleanImages.map((url, index) => {
              const isActivePage = index === currentIndex

              return (
                <section
                  key={`${url}-${index}`}
                  className="ndjc-fullscreen-image-pager-page"
                  style={{
                    position: 'relative',
                    width: `${100 / cleanImages.length}%`,
                    height: '100%',
                    flex: '0 0 auto',
                    display: 'grid',
                    placeItems: 'center',
                    overflow: 'hidden',
                    cursor: isActivePage && scale > 1.01 ? 'grab' : 'zoom-in',
                    touchAction: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none'
                  }}
                  onClick={isActivePage ? handleSingleTap : undefined}
                  onDoubleClick={isActivePage ? handleDoubleTap : undefined}
                  onPointerDown={isActivePage ? handlePointerDown : undefined}
                  onPointerMove={isActivePage ? handlePointerMove : undefined}
                  onPointerUp={isActivePage ? handlePointerEnd : undefined}
                  onPointerCancel={isActivePage ? handlePointerCancel : undefined}
                  onPointerLeave={isActivePage ? handlePointerCancel : undefined}
                  onWheel={isActivePage ? event => {
                    event.preventDefault()
                    event.stopPropagation()

                    const nextScale = clampScale(scale + (event.deltaY < 0 ? 0.25 : -0.25))

                    setScale(nextScale)

                    if (nextScale <= 1.01) {
                      setScale(1)
                      setOffset({ x: 0, y: 0 })
                    }
                  } : undefined}
                  onContextMenu={event => {
                    event.preventDefault()
                    event.stopPropagation()
                    requestSaveCurrentImage()
                  }}
                >
                  <span
                    style={{
                      ...apkFullscreenImageStyle,
                      width: isLargeViewport ? 'min(92vw, 1120px)' : '100%',
                      height: isLargeViewport ? '92vh' : '100%',
                      maxWidth: isLargeViewport ? '1120px' : '100%',
                      maxHeight: isLargeViewport ? '92vh' : '100%',
                      display: 'block',
                      position: 'relative',
                      overflow: 'hidden',
                      transform: isActivePage ? `translate(${offset.x}px, ${offset.y}px) scale(${scale})` : 'translate(0px, 0px) scale(1)',
                      transformOrigin: 'center center',
                      transition: isPagerDragging || didMoveRef.current ? 'none' : 'transform 120ms ease',
                      pointerEvents: 'none',
                      touchAction: 'none',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitTouchCallout: 'none'
                    }}
                    onDragStart={event => {
                      event.preventDefault()
                      event.stopPropagation()
                    }}
                  >
                    <NdjcShimmerImage
                      src={url}
                      alt="Preview"
                      placeholderCornerRadius={0}
                      contentScale="contain"
                      loading="eager"
                      fetchPriority={isActivePage ? 'high' : 'low'}
                      decoding="async"
                      backgroundColor={APK_MEDIA_UI.fullscreenBg}
                      showShimmer={false}
                    />
                  </span>
                </section>
              )
            })}
          </section>
        </section>

        <section
          className="ndjc-fullscreen-image-top-actions"
          data-fullscreen-control="true"
          style={apkFullscreenTopActionsStyle}
          onClick={event => {
            event.stopPropagation()
          }}
          onDoubleClick={event => {
            event.stopPropagation()
          }}
          onPointerDown={event => {
            event.stopPropagation()
          }}
          onPointerMove={event => {
            event.stopPropagation()
          }}
          onPointerUp={event => {
            event.stopPropagation()
          }}
          onContextMenu={event => {
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          {onSave ? (
            <button
              type="button"
              style={apkFullscreenDownloadButtonStyle}
              onClick={event => {
                event.preventDefault()
                event.stopPropagation()
                requestSaveCurrentImage()
              }}
              onContextMenu={event => {
                event.preventDefault()
                event.stopPropagation()
              }}
            >
              Download
            </button>
          ) : null}

          <button
            type="button"
            style={apkFullscreenCloseButtonStyle}
            onClick={event => {
              event.preventDefault()
              event.stopPropagation()
              handleDismiss?.()
            }}
            onContextMenu={event => {
              event.preventDefault()
              event.stopPropagation()
            }}
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              style={apkFullscreenCloseIconStyle}
            >
              <path
                d="M6.4 5.35 12 10.95l5.6-5.6 1.05 1.05-5.6 5.6 5.6 5.6-1.05 1.05-5.6-5.6-5.6 5.6-1.05-1.05 5.6-5.6-5.6-5.6Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </section>

        {cleanImages.length > 1 ? (
          <span
            data-fullscreen-control="true"
            style={apkFullscreenPageIndicatorStyle}
            onClick={event => {
              event.stopPropagation()
            }}
            onDoubleClick={event => {
              event.stopPropagation()
            }}
            onPointerDown={event => {
              event.stopPropagation()
            }}
            onPointerMove={event => {
              event.stopPropagation()
            }}
            onPointerUp={event => {
              event.stopPropagation()
            }}
            onContextMenu={event => {
              event.preventDefault()
              event.stopPropagation()
            }}
          >
            {currentIndex + 1}/{cleanImages.length}
          </span>
        ) : null}

        {pendingSaveUrl ? (
          <NdjcImageEditorSaveDialog
            onConfirm={confirmPendingSave}
            onDismiss={dismissPendingSave}
          />
        ) : null}
      </section>
    </main>
  )

  return createPortal(viewer, fullscreenPortalTarget)
}

export function NdjcEditableImageGrid({
  imageUrls,
  maxImages = 9,
  enabled = true,
  onPickImage,
  onRemoveImage,
  onMoveImage,
  onDraggingChange,
  onPreviewImages
}: {
  imageUrls: string[]
  maxImages?: number
  enabled?: boolean
  onPickImage?: () => void
  onRemoveImage?: (url: string) => void
  onMoveImage?: (from: number, to: number) => void
  onDraggingChange?: (isDragging: boolean) => void
  onPreviewImages?: (images: string[], startIndex: number) => void
}) {
  const cleanImages = imageUrls
    .map(url => url.trim())
    .filter(Boolean)
    .filter((url, index, all) => all.indexOf(url) === index)
    .slice(0, maxImages)

  const [previewIndex, setPreviewIndex] = React.useState<number | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragOriginIndex, setDragOriginIndex] = React.useState<number | null>(null)
  const [pendingTargetIndex, setPendingTargetIndex] = React.useState<number | null>(null)
  const [dragShadowUrl, setDragShadowUrl] = React.useState<string | null>(null)
  const [dragShadowTopLeft, setDragShadowTopLeft] = React.useState<{ x: number; y: number } | null>(null)

  const gridRef = React.useRef<HTMLElement | null>(null)
  const longPressTimerRef = React.useRef<number | null>(null)
  const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null)
  const lastPointerPositionRef = React.useRef<{ x: number; y: number } | null>(null)
  const dragPointerOffsetRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const dragOriginIndexRef = React.useRef<number | null>(null)
  const pendingTargetIndexRef = React.useRef<number | null>(null)
  const dragShadowUrlRef = React.useRef<string | null>(null)
  const isDraggingRef = React.useRef(false)
  const didDragRef = React.useRef(false)
  const suppressNextPreviewClickRef = React.useRef(false)
  const suppressPreviewClickTimerRef = React.useRef<number | null>(null)
  const tileRefs = React.useRef<Array<HTMLElement | null>>([])

  const canAddImage = enabled && cleanImages.length < maxImages
  const canReorder = enabled && Boolean(onMoveImage) && cleanImages.length > 1

  function movePreview(list: string[], from: number, to: number): string[] {
    if (from === to) return list
    if (from < 0 || to < 0 || from >= list.length || to >= list.length) return list

    const next = [...list]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    return next
  }

  const previewImages = React.useMemo(() => {
    if (
      isDragging &&
      dragOriginIndex != null &&
      pendingTargetIndex != null &&
      dragOriginIndex >= 0 &&
      pendingTargetIndex >= 0 &&
      dragOriginIndex < cleanImages.length &&
      pendingTargetIndex < cleanImages.length
    ) {
      return movePreview(cleanImages, dragOriginIndex, pendingTargetIndex)
    }

    return cleanImages
  }, [cleanImages, dragOriginIndex, isDragging, pendingTargetIndex])

  const gridItems = React.useMemo(() => {
    const base = previewImages.map(item => item as string | null)

    if (canAddImage && base.length < maxImages) {
      return [...base, null]
    }

    return base
  }, [canAddImage, maxImages, previewImages])

  React.useEffect(() => {
    tileRefs.current = tileRefs.current.slice(0, previewImages.length)
  }, [previewImages.length])

  React.useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        window.clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      if (suppressPreviewClickTimerRef.current) {
        window.clearTimeout(suppressPreviewClickTimerRef.current)
        suppressPreviewClickTimerRef.current = null
      }
    }
  }, [])

  function openGridPreview(startIndex: number): void {
    if (onPreviewImages) {
      onPreviewImages(cleanImages, startIndex)
      return
    }

    setPreviewIndex(startIndex)
  }

  function clearLongPressTimer(): void {
    if (!longPressTimerRef.current) return

    window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = null
  }

  function suppressNextPreviewClick(): void {
    suppressNextPreviewClickRef.current = true
    didDragRef.current = true

    if (suppressPreviewClickTimerRef.current) {
      window.clearTimeout(suppressPreviewClickTimerRef.current)
      suppressPreviewClickTimerRef.current = null
    }

    suppressPreviewClickTimerRef.current = window.setTimeout(() => {
      suppressNextPreviewClickRef.current = false
      didDragRef.current = false
      suppressPreviewClickTimerRef.current = null
    }, 320)
  }

  function resetDragState(): void {
    clearLongPressTimer()
    pointerStartRef.current = null
    lastPointerPositionRef.current = null
    dragOriginIndexRef.current = null
    pendingTargetIndexRef.current = null
    dragShadowUrlRef.current = null
    isDraggingRef.current = false

    setIsDragging(false)
    setDragOriginIndex(null)
    setPendingTargetIndex(null)
    setDragShadowUrl(null)
    setDragShadowTopLeft(null)

    window.requestAnimationFrame(() => {
      onDraggingChange?.(false)
    })
  }

  function findTargetIndex(clientX: number, clientY: number): number | null {
    for (let index = 0; index < tileRefs.current.length; index += 1) {
      const element = tileRefs.current[index]
      if (!element) continue

      const rect = element.getBoundingClientRect()
      const contains =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom

      if (contains) return index
    }

    return null
  }

  function startDragging(input: {
    originalIndex: number
    displayIndex: number
    url: string
    clientX: number
    clientY: number
  }): void {
    if (!canReorder) return

    const grid = gridRef.current
    const tile = tileRefs.current[input.displayIndex]

    if (!grid || !tile) return

    const gridRect = grid.getBoundingClientRect()
    const tileRect = tile.getBoundingClientRect()

    const pointerOffset = {
      x: input.clientX - tileRect.left,
      y: input.clientY - tileRect.top
    }

    const topLeft = {
      x: tileRect.left - gridRect.left,
      y: tileRect.top - gridRect.top
    }

    didDragRef.current = true
    isDraggingRef.current = true
    lastPointerPositionRef.current = {
      x: input.clientX,
      y: input.clientY
    }
    dragPointerOffsetRef.current = pointerOffset
    dragOriginIndexRef.current = input.originalIndex
    pendingTargetIndexRef.current = input.originalIndex
    dragShadowUrlRef.current = input.url

    setIsDragging(true)
    setDragOriginIndex(input.originalIndex)
    setPendingTargetIndex(input.originalIndex)
    setDragShadowUrl(input.url)
    setDragShadowTopLeft(topLeft)
    onDraggingChange?.(true)
  }

  function handleTilePointerDown(
    originalIndex: number,
    displayIndex: number,
    url: string,
    event: React.PointerEvent<HTMLElement>
  ): void {
    if (!enabled) return

    event.preventDefault()
    event.stopPropagation()

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY
    }

    lastPointerPositionRef.current = {
      x: event.clientX,
      y: event.clientY
    }

    didDragRef.current = false

    if (!canReorder) return

    clearLongPressTimer()
    event.currentTarget.setPointerCapture?.(event.pointerId)

    longPressTimerRef.current = window.setTimeout(() => {
      longPressTimerRef.current = null
      startDragging({
        originalIndex,
        displayIndex,
        url,
        clientX: event.clientX,
        clientY: event.clientY
      })
    }, APK_MEDIA_UI.dragLongPressMs)
  }

  function handleTilePointerMove(event: React.PointerEvent<HTMLElement>): void {
    if (!isDraggingRef.current) return

    lastPointerPositionRef.current = {
      x: event.clientX,
      y: event.clientY
    }

    didDragRef.current = true
    event.preventDefault()
    event.stopPropagation()

    const grid = gridRef.current

    if (grid) {
      const gridRect = grid.getBoundingClientRect()
      const pointerOffset = dragPointerOffsetRef.current

      setDragShadowTopLeft({
        x: event.clientX - gridRect.left - pointerOffset.x,
        y: event.clientY - gridRect.top - pointerOffset.y
      })
    }

    const target = findTargetIndex(event.clientX, event.clientY)
    const origin = dragOriginIndexRef.current

    if (target != null) {
      pendingTargetIndexRef.current = target
      setPendingTargetIndex(target)
    } else if (origin != null) {
      pendingTargetIndexRef.current = origin
      setPendingTargetIndex(origin)
    }
  }
  function commitImageDrag(clientX: number, clientY: number): void {
    const from = dragOriginIndexRef.current
    const pointerTarget = findTargetIndex(clientX, clientY)
    const to = pointerTarget != null ? pointerTarget : pendingTargetIndexRef.current

    console.log('[ImageDrag] commitImageDrag resolved', {
      from,
      pointerTarget,
      pendingTarget: pendingTargetIndexRef.current,
      to,
      cleanImagesLength: cleanImages.length,
      isDragging: isDraggingRef.current,
      images: cleanImages
    })

    if (
      from != null &&
      to != null &&
      from !== to &&
      from >= 0 &&
      to >= 0 &&
      from < cleanImages.length &&
      to < cleanImages.length
    ) {
      console.log('[ImageDrag] calling onMoveImage', {
        from,
        to
      })

      onMoveImage?.(from, to)
    }
  }
  function handleTilePointerUp(event: React.PointerEvent<HTMLElement>): void {
    clearLongPressTimer()

    if (!isDraggingRef.current) {
      pointerStartRef.current = null
      return
    }

    lastPointerPositionRef.current = {
      x: event.clientX,
      y: event.clientY
    }

    suppressNextPreviewClick()
    event.preventDefault()
    event.stopPropagation()

    commitImageDrag(event.clientX, event.clientY)
    resetDragState()
  }
  function handleTilePointerCancel(): void {
    if (!isDraggingRef.current) {
      resetDragState()
      return
    }

    suppressNextPreviewClick()

    const lastPosition = lastPointerPositionRef.current

    if (lastPosition) {
      console.log('[ImageDrag] tile pointercancel commit', {
        clientX: lastPosition.x,
        clientY: lastPosition.y
      })

      commitImageDrag(lastPosition.x, lastPosition.y)
    }

    resetDragState()
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    function handleWindowPointerMove(event: PointerEvent): void {
      if (!isDraggingRef.current) return

      event.preventDefault()

      lastPointerPositionRef.current = {
        x: event.clientX,
        y: event.clientY
      }

      const grid = gridRef.current

      if (grid) {
        const gridRect = grid.getBoundingClientRect()
        const pointerOffset = dragPointerOffsetRef.current

        setDragShadowTopLeft({
          x: event.clientX - gridRect.left - pointerOffset.x,
          y: event.clientY - gridRect.top - pointerOffset.y
        })
      }

      const target = findTargetIndex(event.clientX, event.clientY)
      const origin = dragOriginIndexRef.current

      if (target != null) {
        pendingTargetIndexRef.current = target
        setPendingTargetIndex(target)
      } else if (origin != null) {
        pendingTargetIndexRef.current = origin
        setPendingTargetIndex(origin)
      }

      console.log('[ImageDrag] window pointermove fallback', {
        clientX: event.clientX,
        clientY: event.clientY,
        target,
        origin,
        pendingTarget: pendingTargetIndexRef.current
      })
    }

    function handleWindowPointerUp(event: PointerEvent): void {
      if (!isDraggingRef.current) return

      suppressNextPreviewClick()

      const lastPosition = lastPointerPositionRef.current
      const clientX = lastPosition?.x ?? event.clientX
      const clientY = lastPosition?.y ?? event.clientY

      console.log('[ImageDrag] window pointerup fallback', {
        clientX,
        clientY,
        eventClientX: event.clientX,
        eventClientY: event.clientY
      })

      commitImageDrag(clientX, clientY)
      resetDragState()
    }

    function handleWindowPointerCancel(): void {
      if (!isDraggingRef.current) return

      suppressNextPreviewClick()

      const lastPosition = lastPointerPositionRef.current

      console.log('[ImageDrag] window pointercancel fallback', {
        lastPosition,
        pendingTarget: pendingTargetIndexRef.current,
        from: dragOriginIndexRef.current
      })

      if (lastPosition) {
        commitImageDrag(lastPosition.x, lastPosition.y)
      }

      resetDragState()
    }

    window.addEventListener('pointermove', handleWindowPointerMove, { capture: true, passive: false })
    window.addEventListener('pointerup', handleWindowPointerUp, true)
    window.addEventListener('pointercancel', handleWindowPointerCancel, true)

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove, true)
      window.removeEventListener('pointerup', handleWindowPointerUp, true)
      window.removeEventListener('pointercancel', handleWindowPointerCancel, true)
    }
  }, [cleanImages, onMoveImage])

  function handleTilePointerLeave(event: React.PointerEvent<HTMLElement>): void {
    if (!isDraggingRef.current) {
      clearLongPressTimer()
      pointerStartRef.current = null
      return
    }

    handleTilePointerMove(event)
  }

  function handleTileClickCapture(event: React.MouseEvent<HTMLElement>): void {
    if (!didDragRef.current && !suppressNextPreviewClickRef.current) return

    event.preventDefault()
    event.stopPropagation()

    didDragRef.current = false
    suppressNextPreviewClickRef.current = false

    if (suppressPreviewClickTimerRef.current) {
      window.clearTimeout(suppressPreviewClickTimerRef.current)
      suppressPreviewClickTimerRef.current = null
    }
  }

  function getTileWrapperStyle(url: string, index: number): React.CSSProperties {
    const isActivelyDragging = isDraggingRef.current && isDragging
    const isDraggedOriginalItem = isActivelyDragging && dragShadowUrl === url
    const isCurrentTarget =
      isActivelyDragging &&
      pendingTargetIndex === index &&
      dragShadowUrl !== url

    return {
      position: 'relative',
      width: '100%',
      aspectRatio: '1 / 1',
      opacity: isDraggedOriginalItem ? 0 : 1,
      transform: isCurrentTarget ? `scale(${APK_MEDIA_UI.pressedScale})` : 'scale(1)',
      transition: `opacity ${APK_MEDIA_UI.dragPreviewTransitionMs}ms ease, transform ${APK_MEDIA_UI.dragPreviewTransitionMs}ms ease`,
      touchAction: 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none'
    }
  }

  return (
    <>
      <section
        ref={gridRef}
        className="ndjc-editable-image-grid"
        style={apkEditableGridStyle}
      >
        {gridItems.map((url, index) => {
          if (!url) {
            return (
              <UploadTile
                key="upload-tile"
                label="Add image"
                onClick={onPickImage}
                enabled={enabled && Boolean(onPickImage)}
                hasImage={false}
              />
            )
          }

          const originalIndex = cleanImages.indexOf(url)
          const previewStartIndex = originalIndex >= 0 ? originalIndex : 0

          return (
            <section
              key={url}
              ref={element => {
                tileRefs.current[index] = element
              }}
              className={cx(
                'ndjc-editable-image-grid-item',
                isDraggingRef.current && isDragging && dragShadowUrl === url && 'is-dragging',
                isDraggingRef.current && isDragging && pendingTargetIndex === index && dragShadowUrl !== url && 'is-drag-target'
              )}
              style={getTileWrapperStyle(url, index)}
            >
              <ImageTile
                src={url}
                label={`Image ${previewStartIndex + 1}`}
                enabled={enabled && Boolean(onPickImage || onRemoveImage || onMoveImage)}
                onRemove={enabled && onRemoveImage ? () => onRemoveImage(url) : undefined}
                onPreview={() => {
                  if (!enabled) return
                  if (didDragRef.current || suppressNextPreviewClickRef.current) return
                  openGridPreview(previewStartIndex)
                }}
                onClick={() => {
                  if (!enabled) return
                  if (didDragRef.current || suppressNextPreviewClickRef.current) return
                  openGridPreview(previewStartIndex)
                }}
                onPreviewPointerDown={(event: React.PointerEvent<HTMLButtonElement>) => handleTilePointerDown(originalIndex, index, url, event)}
                onPreviewPointerMove={handleTilePointerMove}
                onPreviewPointerUp={handleTilePointerUp}
                onPreviewPointerCancel={handleTilePointerCancel}
                onPreviewPointerLeave={handleTilePointerLeave}
                onPreviewClickCapture={handleTileClickCapture}
              />
            </section>
          )
        })}

        {isDraggingRef.current && isDragging && dragShadowUrl && dragShadowTopLeft ? (
          <section
            className="ndjc-editable-image-drag-shadow"
            style={{
              position: 'absolute',
              left: dragShadowTopLeft.x,
              top: dragShadowTopLeft.y,
              width: `calc((100% - ${APK_MEDIA_UI.imageGridGap * (APK_MEDIA_UI.imageGridColumns - 1)}px) / ${APK_MEDIA_UI.imageGridColumns})`,
              aspectRatio: '1 / 1',
              zIndex: 999,
              pointerEvents: 'none',
              borderRadius: APK_MEDIA_UI.imageEditRadius,
              overflow: 'hidden',
              boxShadow: APK_MEDIA_UI.dragOverlayShadow,
              transform: `scale(${APK_MEDIA_UI.dragOverlayScale})`,
              transformOrigin: 'center center',
              transition: `transform ${APK_MEDIA_UI.dragPreviewTransitionMs}ms ease, box-shadow ${APK_MEDIA_UI.dragPreviewTransitionMs}ms ease`
            }}
          >
            <NdjcShimmerImage
              src={dragShadowUrl}
              alt="Dragging image"
              placeholderCornerRadius={APK_MEDIA_UI.imageEditRadius}
              contentScale="cover"
            />
          </section>
        ) : null}
      </section>

      {!onPreviewImages && previewIndex != null ? (
        <NdjcFullscreenImageViewerScreen
          images={cleanImages}
          startIndex={previewIndex}
          onDismiss={() => setPreviewIndex(null)}
        />
      ) : null}
    </>
  )
}
