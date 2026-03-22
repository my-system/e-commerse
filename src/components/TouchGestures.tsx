'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useTouchGestures, TouchGestureCallbacks, TouchGestureOptions } from '@/lib/touchGestures'

// Swipeable Container Component
export function SwipeableContainer({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  className = '' 
}: { 
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string 
}) {
  const elementRef = useTouchGestures({
    onSwipeLeft,
    onSwipeRight
  })

  return (
    <div ref={elementRef} className={`touch-pan-y ${className}`}>
      {children}
    </div>
  )
}

// Pull to Refresh Component
export function PullToRefresh({ 
  onRefresh, 
  children, 
  isRefreshing = false 
}: { 
  onRefresh: () => Promise<void>
  children: React.ReactNode
  isRefreshing?: boolean 
}) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [canRefresh, setCanRefresh] = useState(false)

  const elementRef = useTouchGestures({
    onSwipeDown: () => {
      if (!isRefreshing) {
        setIsPulling(true)
        setCanRefresh(true)
      }
    },
    onSwipeUp: () => {
      if (isPulling && canRefresh && !isRefreshing) {
        onRefresh()
      }
      setIsPulling(false)
      setCanRefresh(false)
      setPullDistance(0)
    }
  })

  useEffect(() => {
    if (isRefreshing) {
      setIsPulling(false)
      setCanRefresh(false)
      setPullDistance(0)
    }
  }, [isRefreshing])

  return (
    <div ref={elementRef} className="relative overflow-hidden">
      {/* Pull to Refresh Indicator */}
      <div 
        className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-center transition-transform duration-200 ${
          isPulling ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ transform: `translateY(${Math.max(0, pullDistance - 60)}px)` }}
      >
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg">
          <div className={`w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full ${
            isRefreshing || pullDistance > 60 ? 'animate-spin' : ''
          }`} />
          <span className="text-sm text-gray-700">
            {isRefreshing ? 'Refreshing...' : pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="transition-transform duration-200" style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  )
}

// Swipeable Card Component
export function SwipeableCard({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  leftAction,
  rightAction,
  className = '' 
}: { 
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
  className?: string 
}) {
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const elementRef = useTouchGestures({
    onSwipeLeft: () => {
      setTranslateX(-100)
      setTimeout(() => {
        onSwipeLeft?.()
        setTranslateX(0)
      }, 200)
    },
    onSwipeRight: () => {
      setTranslateX(100)
      setTimeout(() => {
        onSwipeRight?.()
        setTranslateX(0)
      }, 200)
    }
  })

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Left Action */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-green-500 flex items-center justify-center">
        {leftAction}
      </div>

      {/* Right Action */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center">
        {rightAction}
      </div>

      {/* Card */}
      <div 
        ref={elementRef}
        className="relative bg-white shadow-sm"
        style={{ transform: `translateX(${translateX}%)` }}
      >
        {children}
      </div>
    </div>
  )
}

// Image Zoom Component
export function ImageZoom({ 
  src, 
  alt, 
  className = '' 
}: { 
  src: string
  alt: string
  className?: string 
}) {
  const [scale, setScale] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)

  const elementRef = useTouchGestures({
    onDoubleTap: () => {
      setIsZoomed(!isZoomed)
      setScale(isZoomed ? 1 : 2)
    },
    onPinch: (newScale) => {
      setScale(Math.max(1, Math.min(3, newScale)))
      setIsZoomed(newScale > 1)
    }
  })

  return (
    <div ref={elementRef} className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-200"
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  )
}

// Touch Feedback Component
export function TouchFeedback({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  const [isPressed, setIsPressed] = useState(false)

  const elementRef = useTouchGestures({
    onTap: () => {
      setIsPressed(true)
      setTimeout(() => setIsPressed(false), 150)
    }
  })

  return (
    <div 
      ref={elementRef} 
      className={`transition-all duration-150 ${isPressed ? 'scale-95 opacity-80' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

// Swipeable List Component
export function SwipeableList({ 
  items, 
  renderItem, 
  onSwipeLeft, 
  onSwipeRight,
  leftAction,
  rightAction,
  className = '' 
}: { 
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  onSwipeLeft?: (item: any, index: number) => void
  onSwipeRight?: (item: any, index: number) => void
  leftAction?: (item: any) => React.ReactNode
  rightAction?: (item: any) => React.ReactNode
  className?: string 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item, index) => (
        <SwipeableCard
          key={item.id || index}
          onSwipeLeft={() => onSwipeLeft?.(item, index)}
          onSwipeRight={() => onSwipeRight?.(item, index)}
          leftAction={leftAction?.(item)}
          rightAction={rightAction?.(item)}
        >
          {renderItem(item, index)}
        </SwipeableCard>
      ))}
    </div>
  )
}

// Gesture Indicator Component
export function GestureIndicator({ 
  gesture, 
  isVisible = false 
}: { 
  gesture: 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'tap' | 'double-tap'
  isVisible: boolean 
}) {
  if (!isVisible) return null

  const getIcon = () => {
    switch (gesture) {
      case 'swipe-left':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      case 'swipe-right':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      case 'swipe-up':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      case 'swipe-down':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      case 'tap':
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2z" />
        </svg>
      case 'double-tap':
        return <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2z" />
          </svg>
          <svg className="w-4 h-4 absolute -top-1 -right-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2z" />
          </svg>
        </div>
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-black/80 backdrop-blur-sm rounded-full p-4 animate-pulse">
        <div className="text-white">
          {getIcon()}
        </div>
      </div>
    </div>
  )
}

// Touch Area Component for specific gesture areas
export function TouchArea({ 
  children, 
  gestures, 
  onGesture, 
  className = '' 
}: { 
  children: React.ReactNode
  gestures: Array<'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'tap' | 'double-tap' | 'long-press'>
  onGesture: (gesture: string) => void
  className?: string 
}) {
  const elementRef = useTouchGestures({
    onSwipeLeft: () => gestures.includes('swipe-left') && onGesture('swipe-left'),
    onSwipeRight: () => gestures.includes('swipe-right') && onGesture('swipe-right'),
    onSwipeUp: () => gestures.includes('swipe-up') && onGesture('swipe-up'),
    onSwipeDown: () => gestures.includes('swipe-down') && onGesture('swipe-down'),
    onTap: () => gestures.includes('tap') && onGesture('tap'),
    onDoubleTap: () => gestures.includes('double-tap') && onGesture('double-tap'),
    onLongPress: () => gestures.includes('long-press') && onGesture('long-press')
  })

  return (
    <div ref={elementRef} className={`touch-manipulation ${className}`}>
      {children}
    </div>
  )
}
