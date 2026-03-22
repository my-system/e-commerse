import { useEffect, useState } from 'react'
import { ServiceWorkerUtils } from './serviceWorkerUtils'

export interface PushSubscription {
  endpoint: string
  keys?: {
    p256dh: string
    auth: string
  }
  unsubscribe(): Promise<boolean>
}

export interface PushNotificationData {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  tag?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

export class PushNotificationManager {
  private static instance: PushNotificationManager
  private subscription: PushSubscription | null = null
  private swRegistration: ServiceWorkerRegistration | null = null

  private constructor() {}

  static getInstance(): PushNotificationManager {
    if (!PushNotificationManager.instance) {
      PushNotificationManager.instance = new PushNotificationManager()
    }
    return PushNotificationManager.instance
  }

  async initialize(): Promise<boolean> {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported')
        return false
      }

      console.log('Initializing Push Notification Manager...')

      // Debug current state
      await ServiceWorkerUtils.debugServiceWorker()

      // Register service worker using utility
      this.swRegistration = await ServiceWorkerUtils.registerServiceWorker()
      
      if (!this.swRegistration) {
        console.error('Failed to register service worker')
        return false
      }

      console.log('Service worker registered successfully')
      
      // Check existing subscription
      this.subscription = await this.swRegistration.pushManager.getSubscription()
      console.log('Existing subscription:', this.subscription ? 'Found' : 'None')
      
      return true
    } catch (error) {
      console.error('Failed to initialize push notifications:', error)
      return false
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  async subscribe(): Promise<PushSubscription | null> {
    try {
      if (!this.swRegistration) {
        throw new Error('Service worker not registered')
      }

      // Ensure service worker is active
      if (!this.swRegistration.active) {
        console.log('Waiting for service worker to become active...')
        await new Promise((resolve) => {
          const checkActive = () => {
            if (this.swRegistration?.active) {
              resolve(void 0)
            } else {
              setTimeout(checkActive, 100)
            }
          }
          checkActive()
        })
      }

      // Convert VAPID key to Uint8Array
      const applicationServerKey = this.urlBase64ToUint8Array(
        'BLbWHQ6hYd2L8GjJqQyZQjZQjZQjZQjZQjZQjZQjZQjZQjZQjZQjZQjZQjZQjZQ'
      )

      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as any
      })

      this.subscription = subscription
      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  async unsubscribe(): Promise<boolean> {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe()
        this.subscription = null
      }
      return true
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return false
    }
  }

  async sendNotification(data: PushNotificationData): Promise<void> {
    try {
      if (!this.swRegistration) {
        throw new Error('Service worker not registered')
      }

      // Show notification immediately if service worker is ready
      if ('showNotification' in this.swRegistration) {
        await this.swRegistration.showNotification(data.title, {
          body: data.body,
          icon: data.icon || '/icon-192x192.png',
          badge: data.badge || '/badge-72x72.png',
          tag: data.tag,
          data: data.data,
          actions: data.actions,
          requireInteraction: true,
          silent: false
        } as NotificationOptions)
      }
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  getSubscription(): PushSubscription | null {
    return this.subscription
  }

  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window
  }

  isPermissionGranted(): boolean {
    return Notification.permission === 'granted'
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
}

// React Hook for Push Notifications
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const manager = PushNotificationManager.getInstance()
    
    // Check support
    setIsSupported(manager.isSupported())
    setPermission(Notification.permission)

    // Initialize if supported
    if (manager.isSupported()) {
      manager.initialize().then(() => {
        setSubscription(manager.getSubscription())
      })
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const manager = PushNotificationManager.getInstance()
      const granted = await manager.requestPermission()
      setPermission(granted ? 'granted' : 'denied')
      return granted
    } catch (error) {
      console.error('Failed to request permission:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const subscribe = async (): Promise<PushSubscription | null> => {
    setIsLoading(true)
    try {
      const manager = PushNotificationManager.getInstance()
      
      // Ensure service worker is initialized
      const initialized = await manager.initialize()
      if (!initialized) {
        console.error('Service worker initialization failed')
        return null
      }

      const sub = await manager.subscribe()
      setSubscription(sub)
      return sub
    } catch (error) {
      console.error('Failed to subscribe:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribe = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const manager = PushNotificationManager.getInstance()
      const success = await manager.unsubscribe()
      setSubscription(null)
      return success
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const sendNotification = async (data: PushNotificationData): Promise<void> => {
    try {
      const manager = PushNotificationManager.getInstance()
      await manager.sendNotification(data)
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  return {
    isSupported,
    permission,
    subscription,
    isLoading,
    requestPermission,
    subscribe,
    unsubscribe,
    sendNotification
  }
}

// Utility functions for common notification types
export const notificationTypes = {
  newProduct: (productName: string, price: number) => ({
    title: '🛍️ New Product Available!',
    body: `${productName} is now available for $${price}`,
    icon: '/icons/product.png',
    tag: 'new-product',
    data: { type: 'new-product', productName, price }
  }),

  promotion: (discount: number, code: string) => ({
    title: '🎉 Special Offer!',
    body: `Get ${discount}% off with code: ${code}`,
    icon: '/icons/promotion.png',
    tag: 'promotion',
    data: { type: 'promotion', discount, code }
  }),

  orderUpdate: (orderId: string, status: string) => ({
    title: '📦 Order Update',
    body: `Your order ${orderId} is ${status}`,
    icon: '/icons/order.png',
    tag: 'order-update',
    data: { type: 'order-update', orderId, status }
  }),

  priceDrop: (productName: string, oldPrice: number, newPrice: number) => ({
    title: '📉 Price Drop!',
    body: `${productName} dropped from $${oldPrice} to $${newPrice}`,
    icon: '/icons/price-drop.png',
    tag: 'price-drop',
    data: { type: 'price-drop', productName, oldPrice, newPrice }
  })
}

export default PushNotificationManager
