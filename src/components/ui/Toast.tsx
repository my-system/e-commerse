'use client'

import { useState, useEffect } from 'react'
import { X, ShoppingCart, Heart, Check } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />
      case 'error':
        return <X className="w-5 h-5 text-red-600" />
      default:
        return <ShoppingCart className="w-5 h-5 text-blue-600" />
    }
  }

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className={`
      fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg border shadow-lg
      transition-all duration-300 transform
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      ${getBgColor()}
    `}>
      {getIcon()}
      <span className="text-sm font-medium text-gray-900">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(() => onClose?.(), 300)
        }}
        className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  )
}

// Toast container for managing multiple toasts
export function ToastContainer() {
  return <div id="toast-container" />
}

// Hook for showing toasts
export function useToast() {
  const showToast = (message: string, type: ToastProps['type'] = 'info') => {
    const toastContainer = document.getElementById('toast-container')
    if (!toastContainer) return

    const toastElement = document.createElement('div')
    toastContainer.appendChild(toastElement)

    // This would need to be integrated with a proper state management system
    // For now, we'll use a simple approach
    console.log(`Toast (${type}): ${message}`)
  }

  return { showToast }
}
