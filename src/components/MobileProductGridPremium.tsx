'use client'

import { useState } from 'react'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'

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
  onProductClick?: (product: Product) => void
}

// Premium Product Card Component
function PremiumProductCard({ product, onClick }: { product: Product; onClick?: () => void }) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isImageError, setIsImageError] = useState(false)

  const discountPercentage = product.originalPrice && product.discount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        {product.image && !isImageError ? (
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
              <p className="text-xs text-gray-500">No Image</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              NEW
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              // Add to wishlist
            }}
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Loading Skeleton */}
        {isImageLoading && !isImageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 space-y-2">
        {/* Product Name */}
        <div className="min-h-[2.5rem]">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating!)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {product.rating} ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation()
            // Add to cart logic
          }}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  )
}

// List Style Product Card
function ListProductCard({ product, onClick }: { product: Product; onClick?: () => void }) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isImageError, setIsImageError] = useState(false)

  const discountPercentage = product.originalPrice && product.discount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-3 p-3">
        {/* Product Image */}
        <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 relative">
          {product.image && !isImageError ? (
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
              <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-1 left-1 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                NEW
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {isImageLoading && !isImageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
              {product.name}
            </h3>
            
            {product.rating && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating!)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {product.rating} ({product.reviews || 0})
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation()
                // Add to cart logic
              }}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobileProductGridPremium({ 
  products, 
  columns = 2, 
  onProductClick 
}: MobileProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{products.length} products</span>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'grid' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'list' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={viewMode === 'grid' 
        ? `grid grid-cols-${columns} gap-4`
        : 'space-y-3'
      }>
        {products.map((product) => (
          <div key={product.id}>
            {viewMode === 'grid' ? (
              <PremiumProductCard 
                product={product} 
                onClick={() => onProductClick?.(product)}
              />
            ) : (
              <ListProductCard 
                product={product} 
                onClick={() => onProductClick?.(product)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
