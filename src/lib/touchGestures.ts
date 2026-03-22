'use client'

import React from 'react'

export interface TouchGestureCallbacks {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onTap?: () => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  onPinch?: (scale: number) => void
  onRotate?: (angle: number) => void
}

export interface TouchGestureOptions {
  threshold?: number
  longPressDelay?: number
  doubleTapDelay?: number
  preventDefault?: boolean
}

export class TouchGestureManager {
  private callbacks: TouchGestureCallbacks
  private options: Required<TouchGestureOptions>
  private touchStartX: number = 0
  private touchStartY: number = 0
  private touchStartTime: number = 0
  private lastTapTime: number = 0
  private longPressTimer: NodeJS.Timeout | null = null
  private initialDistance: number = 0
  private initialAngle: number = 0

  constructor(callbacks: TouchGestureCallbacks, options: TouchGestureOptions = {}) {
    this.callbacks = callbacks
    this.options = {
      threshold: options.threshold || 50,
      longPressDelay: options.longPressDelay || 500,
      doubleTapDelay: options.doubleTapDelay || 300,
      preventDefault: options.preventDefault || false
    }
  }

  handleTouchStart = (event: TouchEvent) => {
    if (this.options.preventDefault) {
      event.preventDefault()
    }

    const touch = event.touches[0]
    this.touchStartX = touch.clientX
    this.touchStartY = touch.clientY
    this.touchStartTime = Date.now()

    // Long press detection
    this.longPressTimer = setTimeout(() => {
      this.callbacks.onLongPress?.()
    }, this.options.longPressDelay)

    // Multi-touch for pinch/rotate
    if (event.touches.length === 2) {
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      
      this.initialDistance = this.getDistance(touch1, touch2)
      this.initialAngle = this.getAngle(touch1, touch2)
    }
  }

  handleTouchMove = (event: TouchEvent) => {
    if (this.options.preventDefault) {
      event.preventDefault()
    }

    // Clear long press timer on move
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }

    // Multi-touch gestures
    if (event.touches.length === 2) {
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      
      const currentDistance = this.getDistance(touch1, touch2)
      const currentAngle = this.getAngle(touch1, touch2)
      
      // Pinch gesture
      if (this.initialDistance > 0) {
        const scale = currentDistance / this.initialDistance
        this.callbacks.onPinch?.(scale)
      }
      
      // Rotate gesture
      if (this.initialAngle > 0) {
        const angleDiff = currentAngle - this.initialAngle
        this.callbacks.onRotate?.(angleDiff)
      }
    }
  }

  handleTouchEnd = (event: TouchEvent) => {
    if (this.options.preventDefault) {
      event.preventDefault()
    }

    // Clear long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }

    const touch = event.changedTouches[0]
    const touchEndX = touch.clientX
    const touchEndY = touch.clientY
    const touchEndTime = Date.now()

    const deltaX = touchEndX - this.touchStartX
    const deltaY = touchEndY - this.touchStartY
    const deltaTime = touchEndTime - this.touchStartTime

    // Swipe detection
    if (Math.abs(deltaX) > this.options.threshold || Math.abs(deltaY) > this.options.threshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          this.callbacks.onSwipeRight?.()
        } else {
          this.callbacks.onSwipeLeft?.()
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          this.callbacks.onSwipeDown?.()
        } else {
          this.callbacks.onSwipeUp?.()
        }
      }
    } else {
      // Tap detection
      if (deltaTime < this.options.longPressDelay) {
        const now = Date.now()
        const timeSinceLastTap = now - this.lastTapTime

        if (timeSinceLastTap < this.options.doubleTapDelay) {
          // Double tap
          this.callbacks.onDoubleTap?.()
          this.lastTapTime = 0 // Reset to avoid triple tap
        } else {
          // Single tap
          this.callbacks.onTap?.()
          this.lastTapTime = now
        }
      }
    }

    // Reset multi-touch values
    this.initialDistance = 0
    this.initialAngle = 0
  }

  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch2.clientX - touch1.clientX
    const dy = touch2.clientY - touch1.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  private getAngle(touch1: Touch, touch2: Touch): number {
    const dx = touch2.clientX - touch1.clientX
    const dy = touch2.clientY - touch1.clientY
    return Math.atan2(dy, dx) * 180 / Math.PI
  }

  destroy = () => {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }
  }
}

// React Hook for Touch Gestures
export function useTouchGestures(
  callbacks: TouchGestureCallbacks,
  options: TouchGestureOptions = {}
) {
  const gestureManagerRef = React.useRef<TouchGestureManager | null>(null)
  const elementRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (elementRef.current) {
      gestureManagerRef.current = new TouchGestureManager(callbacks, options)
      
      const element = elementRef.current
      element.addEventListener('touchstart', gestureManagerRef.current.handleTouchStart, { passive: false })
      element.addEventListener('touchmove', gestureManagerRef.current.handleTouchMove, { passive: false })
      element.addEventListener('touchend', gestureManagerRef.current.handleTouchEnd, { passive: false })

      return () => {
        if (gestureManagerRef.current) {
          element.removeEventListener('touchstart', gestureManagerRef.current.handleTouchStart)
          element.removeEventListener('touchmove', gestureManagerRef.current.handleTouchMove)
          element.removeEventListener('touchend', gestureManagerRef.current.handleTouchEnd)
          gestureManagerRef.current.destroy()
        }
      }
    }
  }, [callbacks, options])

  return elementRef
}
