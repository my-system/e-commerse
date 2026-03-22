'use client'

import React, { useState, ReactNode } from 'react'

interface MobileLayoutProps {
  children: ReactNode
  title?: string
  showBackButton?: boolean
  rightAction?: ReactNode
}

export function MobileLayout({ 
  children, 
  title, 
  showBackButton = false, 
  rightAction 
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {(title || showBackButton || rightAction) && (
        <header className="md:hidden sticky top-0 z-30 bg-white border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {title && (
                <h1 className="font-semibold text-gray-900 text-lg">{title}</h1>
              )}
            </div>
            {rightAction}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}

// Mobile Section Component
interface MobileSectionProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function MobileSection({ 
  title, 
  subtitle, 
  action, 
  children, 
  className = '' 
}: MobileSectionProps) {
  return (
    <section className={`bg-white ${className}`}>
      {/* Section Header */}
      {(title || subtitle || action) && (
        <div className="px-4 py-4 border-b">
          {title && (
            <h2 className="font-semibold text-gray-900 text-lg mb-1">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
          {action && (
            <div className="mt-2">
              {action}
            </div>
          )}
        </div>
      )}
      
      {/* Section Content */}
      <div className="px-4 py-4">
        {children}
      </div>
    </section>
  )
}

// Mobile Tabs Component
interface MobileTabProps {
  label: string
  value: string
  isActive: boolean
  onClick: () => void
}

function MobileTab({ label, value, isActive, onClick }: MobileTabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
        isActive
          ? 'text-blue-600 border-blue-600'
          : 'text-gray-600 border-transparent hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  )
}

interface MobileTabsProps {
  tabs: Array<{
    label: string
    value: string
  }>
  activeTab: string
  onChange: (value: string) => void
}

export function MobileTabs({ tabs, activeTab, onChange }: MobileTabsProps) {
  return (
    <div className="bg-white border-b sticky top-0 z-20">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <MobileTab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            isActive={activeTab === tab.value}
            onClick={() => onChange(tab.value)}
          />
        ))}
      </div>
    </div>
  )
}

// Mobile Filter Component
export function MobileFilter({ onFilter }: { onFilter: (filters: any) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sortBy: 'popular'
  })

  const applyFilters = () => {
    onFilter(filters)
    setIsOpen(false)
  }

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="text-sm font-medium">Filters</span>
      </button>

      {/* Filter Modal */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Filter Panel */}
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Options */}
            <div className="p-4 space-y-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="clothing">Clothing</option>
                  <option value="shoes">Shoes</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Prices</option>
                  <option value="0-50">$0 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100-200">$100 - $200</option>
                  <option value="200+">$200+</option>
                </select>
              </div>

              {/* Sort By Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFilters({ category: '', priceRange: '', sortBy: 'popular' })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Mobile Pull to Refresh Component
export function MobilePullToRefresh({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  return (
    <div className="md:hidden">
      {/* Pull to Refresh Indicator */}
      <div
        className={`fixed top-0 left-0 right-0 z-20 flex items-center justify-center p-4 transition-transform duration-200 ${
          isPulling ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          transform: `translateY(${Math.max(0, pullDistance - 60)}px)`
        }}
      >
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg">
          <div className={`w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin ${
            pullDistance > 60 ? 'opacity-100' : 'opacity-0'
          }`} />
          <span className="text-sm text-gray-700">
            {pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>
    </div>
  )
}
