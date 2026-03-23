'use client'

import { useState } from 'react'
import { Star, ShoppingCart, Heart } from 'lucide-react'

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

interface ProductCardModernProps {
  product: Product
  onClick?: (product: Product) => void
}

export function ProductCardModern({ product, onClick }: ProductCardModernProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isImageError, setIsImageError] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const discountPercentage = product.originalPrice && product.discount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsAdded(true)
    // Add to cart logic here
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(product)
      }}
    >
      {/* Product Image - Mobile Optimized */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {product.image && !isImageError ? (
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageError(true)}
            loading="lazy"
          />
        ) : (
          // Modern placeholder
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
              <p className="text-xs text-gray-500 px-3">No Image</p>
            </div>
          </div>
        )}

        {/* Badges - Mobile Optimized */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              NEW
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Quick Actions - Mobile Touch Friendly */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Add to wishlist
            }}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Loading Skeleton */}
        {isImageLoading && !isImageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>

      {/* Product Info - Mobile Optimized */}
      <div className="p-3 space-y-2">
        {/* Product Name - Clear Typography */}
        <div className="min-h-[2.5rem]">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        {/* Rating - Clear Display */}
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
            <span className="text-xs text-gray-600 ml-1">
              {product.rating} ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Price - Clear Hierarchy */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button - Mobile Optimized */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            isAdded
              ? 'bg-green-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isAdded ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  )
}
