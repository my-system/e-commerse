export class ServiceWorkerUtils {
  static async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    try {
      if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker not supported')
        return null
      }

      console.log('Registering service worker...')
      
      // Unregister existing service workers first
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        console.log('Unregistering existing service worker:', registration.scope)
        await registration.unregister()
      }

      // Register new service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('Service Worker registered:', registration.scope)

      // Wait for service worker to be ready
      await this.waitForServiceWorkerReady(registration)

      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return null
    }
  }

  static async waitForServiceWorkerReady(registration: ServiceWorkerRegistration): Promise<void> {
    return new Promise((resolve) => {
      if (registration.active) {
        console.log('Service Worker already active')
        resolve()
        return
      }

      if (registration.installing) {
        console.log('Service Worker installing...')
        const serviceWorker = registration.installing
        
        serviceWorker.addEventListener('statechange', () => {
          console.log('Service Worker state changed:', serviceWorker.state)
          if (serviceWorker.state === 'activated') {
            console.log('Service Worker activated')
            resolve()
          }
        })
      } else {
        // Listen for new service worker
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service Worker controller changed')
          resolve()
        })
      }
    })
  }

  static async unregisterAllServiceWorkers(): Promise<void> {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      console.log(`Found ${registrations.length} service worker registrations`)

      for (const registration of registrations) {
        console.log('Unregistering service worker:', registration.scope)
        await registration.unregister()
      }

      console.log('All service workers unregistered')
    } catch (error) {
      console.error('Failed to unregister service workers:', error)
    }
  }

  static async getServiceWorkerStatus(): Promise<{
    supported: boolean
    registered: boolean
    active: boolean
    controller: boolean
  }> {
    const status = {
      supported: 'serviceWorker' in navigator,
      registered: false,
      active: false,
      controller: false
    }

    if (!status.supported) {
      return status
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      status.registered = registrations.length > 0

      if (status.registered) {
        const registration = registrations[0]
        status.active = !!registration.active
        status.controller = !!navigator.serviceWorker.controller
      }
    } catch (error) {
      console.error('Failed to get service worker status:', error)
    }

    return status
  }

  static async clearAllCaches(): Promise<void> {
    try {
      const cacheNames = await caches.keys()
      console.log(`Found ${cacheNames.length} caches`)

      for (const cacheName of cacheNames) {
        console.log('Deleting cache:', cacheName)
        await caches.delete(cacheName)
      }

      console.log('All caches cleared')
    } catch (error) {
      console.error('Failed to clear caches:', error)
    }
  }

  static async debugServiceWorker(): Promise<void> {
    console.log('=== Service Worker Debug Info ===')
    
    const status = await this.getServiceWorkerStatus()
    console.log('Service Worker Status:', status)

    const registrations = await navigator.serviceWorker.getRegistrations()
    console.log('Registrations:', registrations.map(reg => ({
      scope: reg.scope,
      active: !!reg.active,
      installing: !!reg.installing,
      waiting: !!reg.waiting
    })))

    const cacheNames = await caches.keys()
    console.log('Caches:', cacheNames)

    console.log('=== End Debug Info ===')
  }
}
