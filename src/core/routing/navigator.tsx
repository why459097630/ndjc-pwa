'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

export type SwipeBackHandler = () => boolean

export type Navigator = {
  currentRouteId: string
  navigate: (routeId: string, params?: Record<string, unknown>) => void
  back: () => void
  replace: (routeId: string, params?: Record<string, unknown>) => void
  registerSwipeBackHandler: (handler: SwipeBackHandler) => () => void
  params: Record<string, unknown>
}

const NavigatorContext = createContext<Navigator | null>(null)

const SWIPE_BACK_SYSTEM_EDGE_GUTTER_PX = 24
const SWIPE_BACK_APP_EDGE_WIDTH_PX = 88
const SWIPE_BACK_MIN_DISTANCE_PX = 64
const SWIPE_BACK_MIN_HORIZONTAL_RATIO = 1.4
const SWIPE_BACK_VERTICAL_CANCEL_DISTANCE_PX = 24
const SWIPE_BACK_CONFIRM_ANIMATION_MS = 140
const SWIPE_BACK_CONFIRM_CLASS_NAME = 'ndjc-swipe-back-confirming'

type SwipeBackTouchState = {
  startX: number
  startY: number
  tracking: boolean
}

function isElementVisible(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false

  const rects = element.getClientRects()
  if (rects.length <= 0) return false

  const styles = window.getComputedStyle(element)
  return styles.display !== 'none' && styles.visibility !== 'hidden' && styles.pointerEvents !== 'none'
}

function isElementHorizontallyScrollable(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false

  const styles = window.getComputedStyle(element)
  const overflowX = styles.overflowX
  const canScrollX = overflowX === 'auto' || overflowX === 'scroll'

  return canScrollX && element.scrollWidth > element.clientWidth + 2
}

function isInsideHorizontallyScrollableArea(target: Element): boolean {
  let element: Element | null = target

  while (element && element !== document.body) {
    if (isElementHorizontallyScrollable(element)) {
      return true
    }

    element = element.parentElement
  }

  return false
}

function isSwipeBackBlockedTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false

  if (
    target.closest(
      'input, textarea, select, button, a, [contenteditable="true"], [data-swipe-back-disabled="true"], [data-horizontal-scroll="true"], [data-carousel="true"]'
    )
  ) {
    return true
  }

  return isInsideHorizontallyScrollableArea(target)
}

function isSwipeBackBlockedByOpenSurface(): boolean {
  if (typeof document === 'undefined') return false

  const selectors = [
    '[data-swipe-back-blocker="true"]',
    '[data-modal-open="true"]',
    '[data-drawer-open="true"]',
    '[data-sheet-open="true"]',
    '[data-fullscreen-open="true"]',
    '[aria-modal="true"]',
    '[role="dialog"]',
    '.ndjc-modal',
    '.ndjc-dialog',
    '.ndjc-drawer',
    '.ndjc-sheet',
    '.ndjc-overlay',
    '.ndjc-lightbox',
    '.ndjc-fullscreen'
  ]

  return selectors.some(selector => {
    const elements = Array.from(document.querySelectorAll(selector))
    return elements.some(isElementVisible)
  })
}

export function NavigatorProvider({ startRoute, children }: { startRoute: string; children: React.ReactNode }) {
  const [stack, setStack] = useState<Array<{ routeId: string; params: Record<string, unknown> }>>([
    { routeId: startRoute || 'home', params: {} }
  ])
  const stackLengthRef = useRef(stack.length)
  const swipeBackTouchRef = useRef<SwipeBackTouchState | null>(null)
  const swipeBackHandlerRef = useRef<SwipeBackHandler | null>(null)
  const swipeBackAnimationTimeoutRef = useRef<number | null>(null)
  const swipeBackAnimationInFlightRef = useRef(false)

  const current = stack[stack.length - 1] ?? { routeId: startRoute || 'home', params: {} }

  const navigate = useCallback((routeId: string, params: Record<string, unknown> = {}) => {
    setStack(prev => {
      const last = prev[prev.length - 1]
      if (last?.routeId === routeId) return prev
      return [...prev, { routeId, params }]
    })
  }, [])

  const replace = useCallback((routeId: string, params: Record<string, unknown> = {}) => {
    setStack(prev => [...prev.slice(0, Math.max(0, prev.length - 1)), { routeId, params }])
  }, [])

  const back = useCallback(() => {
    setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }, [])

  const registerSwipeBackHandler = useCallback((handler: SwipeBackHandler) => {
    swipeBackHandlerRef.current = handler

    return () => {
      if (swipeBackHandlerRef.current === handler) {
        swipeBackHandlerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    stackLengthRef.current = stack.length
  }, [stack.length])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const clearSwipeBackConfirmAnimation = () => {
      if (swipeBackAnimationTimeoutRef.current !== null) {
        window.clearTimeout(swipeBackAnimationTimeoutRef.current)
        swipeBackAnimationTimeoutRef.current = null
      }

      swipeBackAnimationInFlightRef.current = false

      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove(SWIPE_BACK_CONFIRM_CLASS_NAME)
      }
    }

    const resetSwipeBackTouch = () => {
      swipeBackTouchRef.current = null
    }

    const runSwipeBackConfirmAnimation = (onComplete: () => void) => {
      if (swipeBackAnimationInFlightRef.current) return

      swipeBackAnimationInFlightRef.current = true

      if (typeof document !== 'undefined') {
        document.documentElement.classList.add(SWIPE_BACK_CONFIRM_CLASS_NAME)
      }

      if (swipeBackAnimationTimeoutRef.current !== null) {
        window.clearTimeout(swipeBackAnimationTimeoutRef.current)
      }

      swipeBackAnimationTimeoutRef.current = window.setTimeout(() => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove(SWIPE_BACK_CONFIRM_CLASS_NAME)
        }

        swipeBackAnimationTimeoutRef.current = null
        swipeBackAnimationInFlightRef.current = false
        onComplete()
      }, SWIPE_BACK_CONFIRM_ANIMATION_MS)
    }

    const handleTouchStart = (event: TouchEvent) => {
      if (swipeBackAnimationInFlightRef.current) {
        resetSwipeBackTouch()
        return
      }

      if (event.touches.length !== 1) {
        resetSwipeBackTouch()
        return
      }

      if (stackLengthRef.current <= 1 && !swipeBackHandlerRef.current) {
        resetSwipeBackTouch()
        return
      }

      if (isSwipeBackBlockedByOpenSurface()) {
        resetSwipeBackTouch()
        return
      }

      if (isSwipeBackBlockedTarget(event.target)) {
        resetSwipeBackTouch()
        return
      }

      const touch = event.touches[0]
      if (
        !touch ||
        touch.clientX < SWIPE_BACK_SYSTEM_EDGE_GUTTER_PX ||
        touch.clientX > SWIPE_BACK_APP_EDGE_WIDTH_PX
      ) {
        resetSwipeBackTouch()
        return
      }

      swipeBackTouchRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        tracking: true
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      const swipeBackTouch = swipeBackTouchRef.current
      if (!swipeBackTouch?.tracking) return

      if (event.touches.length !== 1) {
        resetSwipeBackTouch()
        return
      }

      const touch = event.touches[0]
      if (!touch) return

      const deltaX = touch.clientX - swipeBackTouch.startX
      const deltaY = touch.clientY - swipeBackTouch.startY
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      if (
        absDeltaY >= SWIPE_BACK_VERTICAL_CANCEL_DISTANCE_PX &&
        absDeltaY > absDeltaX
      ) {
        resetSwipeBackTouch()
        return
      }

      if (deltaX > 12 && deltaX > absDeltaY * SWIPE_BACK_MIN_HORIZONTAL_RATIO) {
        event.preventDefault()
      }
    }

    const handleTouchEnd = (event: TouchEvent) => {
      const swipeBackTouch = swipeBackTouchRef.current
      resetSwipeBackTouch()

      if (!swipeBackTouch?.tracking) return

      if (isSwipeBackBlockedByOpenSurface()) return

      const touch = event.changedTouches[0]
      if (!touch) return

      const deltaX = touch.clientX - swipeBackTouch.startX
      const deltaY = touch.clientY - swipeBackTouch.startY
      const absDeltaY = Math.abs(deltaY)

      if (
        deltaX >= SWIPE_BACK_MIN_DISTANCE_PX &&
        deltaX > absDeltaY * SWIPE_BACK_MIN_HORIZONTAL_RATIO &&
        (stackLengthRef.current > 1 || Boolean(swipeBackHandlerRef.current))
      ) {
        runSwipeBackConfirmAnimation(() => {
          const handledByBusinessBack = swipeBackHandlerRef.current?.() === true

          if (!handledByBusinessBack && stackLengthRef.current > 1) {
            back()
          }
        })
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', resetSwipeBackTouch, { passive: true })

    return () => {
      clearSwipeBackConfirmAnimation()
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', resetSwipeBackTouch)
    }
  }, [back])

  const value = useMemo<Navigator>(() => ({
    currentRouteId: current.routeId,
    params: current.params,
    navigate,
    replace,
    back,
    registerSwipeBackHandler
  }), [back, current.params, current.routeId, navigate, registerSwipeBackHandler, replace])

  return (
    <NavigatorContext.Provider value={value}>
      <style>
        {`
          html.${SWIPE_BACK_CONFIRM_CLASS_NAME} body {
            pointer-events: none;
            animation: ndjc-swipe-back-confirm ${SWIPE_BACK_CONFIRM_ANIMATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          @keyframes ndjc-swipe-back-confirm {
            0% {
              opacity: 1;
              transform: translateX(0);
            }

            100% {
              opacity: 0.86;
              transform: translateX(18px);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            html.${SWIPE_BACK_CONFIRM_CLASS_NAME} body {
              animation-duration: 1ms;
            }

            @keyframes ndjc-swipe-back-confirm {
              0% {
                opacity: 1;
                transform: translateX(0);
              }

              100% {
                opacity: 1;
                transform: translateX(0);
              }
            }
          }
        `}
      </style>
      {children}
    </NavigatorContext.Provider>
  )
}

export function useNavigator(): Navigator {
  const value = useContext(NavigatorContext)
  if (!value) throw new Error('useNavigator must be used inside NavigatorProvider')
  return value
}

export function useNavigatorSwipeBackHandler(handler: SwipeBackHandler | null): void {
  const navigator = useNavigator()

  useEffect(() => {
    if (!handler) return undefined

    return navigator.registerSwipeBackHandler(handler)
  }, [handler, navigator.registerSwipeBackHandler])
}
