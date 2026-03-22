'use client'

import { useState, useEffect } from 'react'
import { usePushNotifications, notificationTypes } from '@/lib/pushNotifications'
import PushNotificationManagerClass from '@/lib/pushNotifications'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Bell, BellOff, Settings, Send } from 'lucide-react'

export function PushNotificationManager() {
  const {
    isSupported,
    permission,
    subscription,
    isLoading,
    requestPermission,
    subscribe,
    unsubscribe,
    sendNotification
  } = usePushNotifications()

  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [autoHideTimer, setAutoHideTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setNotificationsEnabled(permission === 'granted' && !!subscription)
  }, [permission, subscription])

  useEffect(() => {
    // Show notification manager after 2 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true)
      
      // Auto-hide after 5 seconds if not interacted with
      const hideTimer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)
      
      setAutoHideTimer(hideTimer)
    }, 2000)

    return () => {
      clearTimeout(showTimer)
      if (autoHideTimer) {
        clearTimeout(autoHideTimer)
      }
    }
  }, [])

  const handleUserInteraction = () => {
    // Clear auto-hide timer when user interacts
    if (autoHideTimer) {
      clearTimeout(autoHideTimer)
      setAutoHideTimer(null)
    }
  }

  const handleEnableNotifications = async () => {
    try {
      handleUserInteraction()
      
      // Initialize service worker first
      const manager = PushNotificationManagerClass.getInstance()
      const initialized = await manager.initialize()
      
      if (!initialized) {
        console.error('Failed to initialize push notifications')
        return
      }

      if (permission !== 'granted') {
        const granted = await requestPermission()
        if (!granted) return
      }

      if (!subscription) {
        await subscribe()
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error)
    }
  }

  const handleDisableNotifications = async () => {
    handleUserInteraction()
    if (subscription) {
      await unsubscribe()
    }
  }

  const handleToggleNotifications = async (enabled: boolean) => {
    handleUserInteraction()
    if (enabled) {
      await handleEnableNotifications()
    } else {
      await handleDisableNotifications()
    }
  }

  const sendTestNotification = async () => {
    handleUserInteraction()
    await sendNotification(notificationTypes.promotion(20, 'TEST20'))
  }

  const toggleSettings = () => {
    handleUserInteraction()
    setShowSettings(!showSettings)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    if (autoHideTimer) {
      clearTimeout(autoHideTimer)
      setAutoHideTimer(null)
    }
  }

  if (!isSupported) {
    if (!isVisible) return null
    
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom duration-300">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellOff className="h-5 w-5" />
              Notifications Not Supported
            </CardTitle>
            <CardDescription>
              Your browser doesn't support push notifications. Please try using a modern browser.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDismiss} variant="outline" className="w-full">
              Dismiss
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom duration-300">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Push Notifications
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              ✖️
            </Button>
          </div>
          <CardDescription>
            Stay updated with new products, promotions, and order updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <div className="flex items-center gap-2">
                <Badge variant={permission === 'granted' ? 'default' : 'secondary'}>
                  {permission === 'granted' ? 'Granted' : permission === 'denied' ? 'Denied' : 'Default'}
                </Badge>
                {subscription && <Badge variant="outline">Subscribed</Badge>}
              </div>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={handleToggleNotifications}
              disabled={isLoading}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            {permission !== 'granted' && (
              <Button
                onClick={handleEnableNotifications}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Enabling...' : 'Enable Notifications'}
              </Button>
            )}
            
            {subscription && (
              <Button
                variant="outline"
                onClick={sendTestNotification}
                disabled={isLoading}
                className="flex-1"
              >
                <Send className="h-4 w-4 mr-2" />
                Test Notification
              </Button>
            )}
          </div>

          {/* Settings Toggle */}
          <Button
            variant="ghost"
            onClick={toggleSettings}
            className="w-full justify-start"
          >
            <Settings className="h-4 w-4 mr-2" />
            Notification Settings
          </Button>

          {/* Advanced Settings */}
          {showSettings && (
            <div className="space-y-3 pt-3 border-t">
              <div className="space-y-2">
                <Label>Notification Types</Label>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    New Products
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Promotions & Deals
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Order Updates
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Price Drops
                  </div>
                </div>
              </div>

              {subscription && (
                <div className="space-y-2">
                  <Label>Subscription Info</Label>
                  <div className="text-xs text-muted-foreground break-all">
                    <div>Endpoint: {subscription.endpoint.substring(0, 50)}...</div>
                    {subscription.keys && (
                      <div>Keys: Available</div>
                    )}
                  </div>
                </div>
              )}

              {subscription && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDisableNotifications}
                  disabled={isLoading}
                  className="w-full"
                >
                  <BellOff className="h-4 w-4 mr-2" />
                  Disable All Notifications
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for automatic notification triggers
export function useNotificationTriggers() {
  const { sendNotification, isSupported, permission, subscription } = usePushNotifications()

  const triggerNewProductNotification = async (productName: string, price: number) => {
    if (isSupported && permission === 'granted' && subscription) {
      await sendNotification(notificationTypes.newProduct(productName, price))
    }
  }

  const triggerPromotionNotification = async (discount: number, code: string) => {
    if (isSupported && permission === 'granted' && subscription) {
      await sendNotification(notificationTypes.promotion(discount, code))
    }
  }

  const triggerOrderUpdateNotification = async (orderId: string, status: string) => {
    if (isSupported && permission === 'granted' && subscription) {
      await sendNotification(notificationTypes.orderUpdate(orderId, status))
    }
  }

  const triggerPriceDropNotification = async (productName: string, oldPrice: number, newPrice: number) => {
    if (isSupported && permission === 'granted' && subscription) {
      await sendNotification(notificationTypes.priceDrop(productName, oldPrice, newPrice))
    }
  }

  return {
    triggerNewProductNotification,
    triggerPromotionNotification,
    triggerOrderUpdateNotification,
    triggerPriceDropNotification
  }
}
