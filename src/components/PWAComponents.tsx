'use client'

import React, { useState, useEffect } from 'react'
import { usePWA } from '@/lib/pwa'

export function PWAInstallPrompt() {
  const { isInstalled, isInstallable, isStandalone, install, canInstall } = usePWA()
  const [dismissed, setDismissed] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  // Don't show if already installed, in standalone mode, or dismissed
  if (isInstalled || isStandalone || !canInstall() || dismissed) {
    return null
  }

  // Delay showing the prompt to avoid immediate popup
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true)
    }, 3000) // Show after 3 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      setDismissed(true)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    setShowPrompt(false)
  }

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-40 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Install LUXE App</h3>
          <p className="text-sm text-gray-600 mt-1">
            Get the full app experience with offline access and push notifications
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NetworkStatus() {
  const { isOnline } = usePWA()
  const [showStatus, setShowStatus] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (!isOnline) {
      setStatusMessage('You\'re offline')
      setShowStatus(true)
    } else {
      // Only show "Connection restored" if we were previously offline
      if (showStatus && statusMessage === 'You\'re offline') {
        setStatusMessage('Connection restored')
        // Hide after 3 seconds
        const timer = setTimeout(() => {
          setShowStatus(false)
          setStatusMessage('')
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [isOnline])

  if (!showStatus) {
    return null
  }

  return (
    <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
      isOnline 
        ? 'bg-green-50 border border-green-200' 
        : 'bg-red-50 border border-red-200'
    }`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className={`text-sm font-medium ${
          isOnline ? 'text-green-800' : 'text-red-800'
        }`}>
          {statusMessage}
        </span>
      </div>
    </div>
  )
}
