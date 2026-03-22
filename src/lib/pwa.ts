'use client'

import { useEffect, useState } from 'react'

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if app is running in standalone mode
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone ||
                       document.referrer.includes('android-app://')
      setIsStandalone(standalone)
    }

    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setInstallPrompt(promptEvent)
      setIsInstallable(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setInstallPrompt(null)
    }

    // Check if already installed
    const checkInstalled = () => {
      // Check if running in standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
      }
    }

    // Initialize
    checkStandalone()
    checkInstalled()
    updateOnlineStatus()

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const install = async () => {
    if (!installPrompt) {
      return false
    }

    try {
      await installPrompt.prompt()
      const choiceResult = await installPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true)
        setIsInstallable(false)
        setInstallPrompt(null)
        return true
      }
      
      return false
    } catch (error) {
      console.error('PWA installation failed:', error)
      return false
    }
  }

  const canInstall = () => {
    return isInstallable && !isInstalled && !!installPrompt
  }

  return {
    isInstalled,
    isInstallable,
    isOnline,
    isStandalone,
    canInstall,
    install,
    installPrompt
  }
}

// PWA Features Hook
export function usePWAFeatures() {
  const { isInstalled, isStandalone, isOnline } = usePWA()

  const features = {
    offlineAccess: isInstalled || isStandalone,
    pushNotifications: isInstalled || isStandalone,
    fullscreenMode: isStandalone,
    appLikeExperience: isInstalled || isStandalone,
    backgroundSync: isInstalled || isStandalone,
    homeScreenIcon: isInstalled || isStandalone
  }

  const getFeatureStatus = (feature: keyof typeof features) => {
    return features[feature] ? 'available' : 'limited'
  }

  return {
    features,
    getFeatureStatus,
    isEnhanced: isInstalled || isStandalone
  }
}
