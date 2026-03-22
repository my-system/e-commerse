const CACHE_NAME = 'e-commerce-v1'
const urlsToCache = [
  '/',
  '/shop',
  '/analytics',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/badge-72x72.png'
]

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files')
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log('Service Worker: Installation complete')
        return self.skipWaiting()
      })
  )
})

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache')
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service Worker: Activation complete')
      return self.clients.claim()
    })
  )
})

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response
        }

        // Clone request
        const fetchRequest = event.request.clone()

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache)
            })

          return response
        }).catch(() => {
          // Return cached version if network fails
          return caches.match(event.request)
        })
      })
  )
})

// Push event
self.addEventListener('push', event => {
  console.log('Service Worker: Push received')
  
  if (!event.data) {
    console.log('Service Worker: No push data')
    return
  }

  const data = event.data.json()
  console.log('Service Worker: Push data', data)

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge || '/badge-72x72.png',
    tag: data.tag,
    data: data.data,
    actions: data.actions,
    requireInteraction: true,
    silent: false
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked')
  event.notification.close()

  if (event.action) {
    // Handle action button clicks
    handleNotificationAction(event.action, event.notification.data)
  } else {
    // Handle notification click
    handleNotificationClick(event.notification.data)
  }
})

// Notification close event
self.addEventListener('notificationclose', event => {
  console.log('Service Worker: Notification closed:', event.notification)
})

function handleNotificationAction(action, data) {
  console.log('Service Worker: Handling action:', action)
  switch (action) {
    case 'view-product':
      if (data && data.productName) {
        clients.openWindow(`/shop?product=${encodeURIComponent(data.productName)}`)
      }
      break
    case 'view-promotion':
      clients.openWindow('/shop?promotion=true')
      break
    case 'view-order':
      if (data && data.orderId) {
        clients.openWindow(`/account/orders/${data.orderId}`)
      }
      break
    default:
      clients.openWindow('/')
  }
}

function handleNotificationClick(data) {
  console.log('Service Worker: Handling click:', data)
  if (data && data.type) {
    switch (data.type) {
      case 'new-product':
        if (data.productName) {
          clients.openWindow(`/shop?product=${encodeURIComponent(data.productName)}`)
        } else {
          clients.openWindow('/shop')
        }
        break
      case 'promotion':
        clients.openWindow('/shop?promotion=true')
        break
      case 'order-update':
        if (data.orderId) {
          clients.openWindow(`/account/orders/${data.orderId}`)
        } else {
          clients.openWindow('/account/orders')
        }
        break
      case 'price-drop':
        if (data.productName) {
          clients.openWindow(`/shop?product=${encodeURIComponent(data.productName)}`)
        } else {
          clients.openWindow('/shop')
        }
        break
      default:
        clients.openWindow('/')
    }
  } else {
    clients.openWindow('/')
  }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag)
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle background sync tasks
  try {
    // Sync any pending actions
    console.log('Service Worker: Background sync completed')
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error)
  }
}

// Message event for communication with main thread
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
