'use client'

import { useState } from 'react'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import Link from 'next/link'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { formatPrice } from '@/lib/utils'

interface Product {
  id: string
  name?: string
  title?: string
  description?: string
  price: number
  originalPrice?: number
  discount?: number
  rating?: number
  reviews?: number
  image?: string
  images?: string[]
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

  // Use title as fallback for name
  const productName = product.name || product.title || 'Unknown Product'
  const productImage = product.image || product.images?.[0] || '/placeholder.jpg'

  const discountPercentage = product.originalPrice && product.discount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsAdded(true)
    
    // Add to cart logic here
    console.log('Added to cart:', productName)
    
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleQuickView = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    // Navigate to product detail page
    window.location.href = `/product/${product.id}`
  }

  const handleProductClick = () => {
    // Navigate to product detail page
    window.location.href = `/product/${product.id}`
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={handleProductClick}
    >
      {/* Product Image - Mobile Optimized */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <OptimizedImage
          src={productImage}
          alt={productName}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          priority={true}
          disableIntersectionObserver={true}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          placeholder="blur"
          fallback="/placeholder.jpg"
        />

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

        {/* Quick Actions Overlay - Mobile */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <div className="flex gap-2">
            {/* Quick View Button - Perfect Center */}
            <button
              onClick={handleQuickView}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
              title="Quick View"
            >
              <Eye className="w-5 h-5 text-gray-700" />
            </button>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200 ${
                isAdded 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/90 backdrop-blur-sm hover:bg-white'
              }`}
              title="Add to Cart"
            >
              {isAdded ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <ShoppingCart className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Wishlist Button - Top Right */}
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
        {false && isImageLoading && !isImageError && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
      </div>

      {/* Product Info - Mobile Optimized */}
      <div className="p-3 space-y-2">
        {/* Product Name - Clear Typography */}
        <div className="min-h-[2.5rem]">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight font-['Inter']">
            {productName}
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
            <span className="text-xs text-gray-600 ml-1 font-['Inter']">
              {product.rating} ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Price - Bold and Clear Hierarchy with Rupiah */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-900 font-['Inter']">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-500 line-through font-['Inter']">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button - Mobile Optimized */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 font-['Inter'] ${
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
              Ditambahkan!
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Tambah ke Keranjang
            </>
          )}
        </button>
      </div>
    </div>
  )
}
