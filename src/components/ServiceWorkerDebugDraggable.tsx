'use client'

import { useState, useEffect, useRef } from 'react'
import { ServiceWorkerUtils } from '@/lib/serviceWorkerUtils'

export function ServiceWorkerDebugDraggable() {
  const [status, setStatus] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 4 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number }>({ startX: 0, startY: 0 })

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const newX = e.clientX - dragRef.current.startX
    const newY = e.clientY - dragRef.current.startY
    
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 320, newX)),
      y: Math.max(0, Math.min(window.innerHeight - 200, newY))
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  const checkStatus = async () => {
    try {
      addLog('Checking service worker status...')
      const swStatus = await ServiceWorkerUtils.getServiceWorkerStatus()
      setStatus(swStatus)
      addLog(`Status: ${JSON.stringify(swStatus)}`)
    } catch (error) {
      addLog(`Error: ${error}`)
    }
  }

  const registerSW = async () => {
    try {
      addLog('Registering service worker...')
      const registration = await ServiceWorkerUtils.registerServiceWorker()
      if (registration) {
        addLog('Service worker registered successfully')
        await checkStatus()
      } else {
        addLog('Failed to register service worker')
      }
    } catch (error) {
      addLog(`Registration error: ${error}`)
    }
  }

  const unregisterSW = async () => {
    try {
      addLog('Unregistering all service workers...')
      await ServiceWorkerUtils.unregisterAllServiceWorkers()
      addLog('All service workers unregistered')
      await checkStatus()
    } catch (error) {
      addLog(`Unregistration error: ${error}`)
    }
  }

  const clearCaches = async () => {
    try {
      addLog('Clearing all caches...')
      await ServiceWorkerUtils.clearAllCaches()
      addLog('All caches cleared')
    } catch (error) {
      addLog(`Cache clear error: ${error}`)
    }
  }

  const debug = async () => {
    try {
      addLog('Running debug...')
      await ServiceWorkerUtils.debugServiceWorker()
      addLog('Debug complete')
    } catch (error) {
      addLog(`Debug error: ${error}`)
    }
  }

  useEffect(() => {
    if (isVisible) {
      checkStatus()
    }
  }, [isVisible])

  if (process.env.NODE_ENV === 'production') {
    return null // Don't show in production
  }

  if (!isVisible) {
    return (
      <div className="fixed top-20 left-4 z-40">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg text-xs hover:bg-gray-700 transition-colors"
        >
          🐛 SW Debug
        </button>
      </div>
    )
  }

  return (
    <div 
      className={`fixed bg-white border border-gray-200 rounded-lg shadow-lg z-40 ${
        isMinimized ? 'h-12' : 'max-h-96 overflow-hidden'
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '320px',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 border-b border-gray-200"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <h3 className="font-semibold text-gray-900 text-sm">Service Worker Debug</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            {isMinimized ? '📊' : '➖'}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-red-600 text-sm"
          >
            ✖️
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Controls */}
          <div className="p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={checkStatus}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Check Status
              </button>
              <button
                onClick={registerSW}
                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
              >
                Register SW
              </button>
              <button
                onClick={unregisterSW}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              >
                Unregister All
              </button>
              <button
                onClick={clearCaches}
                className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Clear Caches
              </button>
            </div>
            <button
              onClick={debug}
              className="w-full px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Debug
            </button>
          </div>

          {/* Status */}
          {status && (
            <div className="px-3 pb-2">
              <div className="bg-gray-100 rounded p-2 text-xs">
                <div className="flex justify-between">
                  <span>Supported:</span>
                  <span>{status.supported ? '✅' : '❌'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Registered:</span>
                  <span>{status.registered ? '✅' : '❌'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active:</span>
                  <span>{status.active ? '✅' : '❌'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Controller:</span>
                  <span>{status.controller ? '✅' : '❌'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Logs */}
          <div className="px-3 pb-3">
            <div className="h-32 overflow-y-auto bg-gray-50 rounded p-2">
              {logs.map((log, index) => (
                <div key={index} className="text-xs text-gray-600 mb-1 font-mono">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
