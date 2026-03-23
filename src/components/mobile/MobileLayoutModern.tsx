'use client'

import { ReactNode } from 'react'

interface MobileLayoutModernProps {
  children: ReactNode
  title?: string
  subtitle?: string
  action?: {
    label: string
    href?: string
  }
}

export function MobileSectionModern({ 
  children, 
  title, 
  subtitle, 
  action 
}: MobileLayoutModernProps) {
  return (
    <section className="px-4 py-4 space-y-4">
      {/* Section Header */}
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <a
              href={action.href || '#'}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {action.label}
            </a>
          )}
        </div>
      )}

      {/* Section Content */}
      <div className="space-y-3">
        {children}
      </div>
    </section>
  )
}

export function MobileContainerModern({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-20">
        {children}
      </div>
    </div>
  )
}
