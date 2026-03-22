'use client'

import { useState } from 'react'
import { MobileProductCard } from './MobileNavigation'
import { PullToRefresh, SwipeableCard, ImageZoom, TouchFeedback } from './TouchGestures'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  rating?: number
  reviews?: number
  image?: string
  isNew?: boolean
  category?: string
}

interface MobileProductGridProps {
  products: Product[]
  columns?: 1 | 2
  showFilters?: boolean
  onProductClick?: (product: Product) => void
}

export function MobileProductGrid({ 
  products, 
  columns = 2, 
  showFilters = true,
  onProductClick 
}: MobileProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('popular')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  return (
    <PullToRefresh onRefresh={handleRefresh} isRefreshing={isRefreshing}>
      <div className="md:hidden">
        {/* View Controls */}
        <div className="sticky top-0 z-20 bg-white border-b p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">
              {products.length} Products
            </h3>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <TouchFeedback>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </TouchFeedback>
              <TouchFeedback>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M4 6h16M4 18h16" />
                  </svg>
                </button>
              </TouchFeedback>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid/List */}
        <div className={`p-4 ${
          viewMode === 'grid' 
            ? columns === 2 
              ? 'grid grid-cols-2 gap-4'
              : 'grid grid-cols-1 gap-4'
            : 'space-y-4'
        }`}>
          {sortedProducts.map((product) => (
            <SwipeableCard
              key={product.id}
              onSwipeLeft={() => console.log('Swipe left:', product.name)}
              onSwipeRight={() => console.log('Swipe right:', product.name)}
              leftAction={
                <div className="text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              }
              rightAction={
                <div className="text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              }
            >
              <div
                onClick={() => onProductClick?.(product)}
                className={viewMode === 'list' ? 'cursor-pointer' : ''}
              >
                {viewMode === 'grid' ? (
                  <MobileProductCard product={product} />
                ) : (
                  <MobileProductListItem product={product} />
                )}
              </div>
            </SwipeableCard>
          ))}
        </div>

        {/* Load More */}
        <div className="p-4">
          <TouchFeedback>
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Load More Products
            </button>
          </TouchFeedback>
        </div>
      </div>
    </PullToRefresh>
  )
}

// Mobile Product List Item
function MobileProductListItem({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
            {product.discount && (
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xs ${i < (product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.reviews || 23})</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Add to Cart
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile Category Grid
export function MobileCategoryGrid({ categories }: { categories: Array<{ name: string; image: string; count: number }> }) {
  return (
    <div className="md:hidden p-4">
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <button
            key={category.name}
            className="group relative aspect-square bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Category Image */}
            <div className="absolute inset-0">
              <img
                src={category.image || '/placeholder-category.jpg'}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Category Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <h3 className="font-medium text-sm mb-1">{category.name}</h3>
              <p className="text-xs opacity-90">{category.count} items</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Mobile Featured Product Carousel
export function MobileFeaturedProducts({ products }: { products: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  return (
    <div className="md:hidden">
      <div className="relative overflow-hidden">
        {/* Product Cards */}
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {products.map((product) => (
            <div key={product.id} className="w-full flex-shrink-0 p-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                    Featured
                  </span>
                  <span className="text-2xl">🔥</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-sm opacity-90 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm line-through opacity-70 ml-2">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
