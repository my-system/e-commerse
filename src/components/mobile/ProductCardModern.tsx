'use client'

import { useState } from 'react'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import Link from 'next/link'
import OptimizedImage from '@/components/ui/OptimizedImage'
import { formatPrice } from '@/lib/utils'

// Helper function to generate slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

interface Product {
  id: string
  name?: string
  title?: string
  slug?: string
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
    const slug = product.slug || generateSlug(productName)
    window.location.href = `/product/${slug}`
  }

  const handleProductClick = () => {
    // Navigate to product detail page
    const slug = product.slug || generateSlug(productName)
    window.location.href = `/product/${slug}`
  }

  const handleProductNavigation = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Navigate to product detail page
    const slug = product.slug || generateSlug(productName)
    window.location.href = `/product/${slug}`
  }

  return (
    <div 
      className="bg-white rounded-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-400 ease-out overflow-hidden cursor-pointer group flex flex-col h-full"
      onClick={handleProductClick}
    >
      {/* Product Image - Mobile Optimized */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        <OptimizedImage
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          priority={true}
          disableIntersectionObserver={true}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          placeholder="blur"
          fallback="/placeholder.jpg"
        />

        {/* Badges - Mobile Optimized */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-black text-white text-[9px] px-2 py-1 rounded-[6px] font-medium tracking-wider uppercase shadow-sm">
              New
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-black text-white text-[9px] px-2 py-1 rounded-[6px] font-medium tracking-wider uppercase shadow-sm">
              -{discountPercentage}%
            </span>
          )}
          {(product as any).featured && (
            <span className="bg-red-600 text-white text-[9px] px-2 py-1 rounded-[6px] font-bold tracking-wider uppercase shadow-sm">
              Hot
            </span>
          )}
        </div>

        {/* Wishlist Button - Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            // Add to wishlist
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all duration-300 z-10"
        >
          <Heart className="w-4 h-4 text-gray-600" />
        </button>

        {/* Loading Skeleton */}
        {false && isImageLoading && !isImageError && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
      </div>

      {/* Product Info - Mobile Optimized */}
      <div className="p-3 bg-white relative flex flex-col flex-grow">
        {/* Row 1: Category (left) and Rating Chip (right) */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-[0.5px] font-light">
            {product.category || 'PRODUCT'}
          </div>
          {product.rating && (
            <div className="flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded-full">
              <span className="text-amber-400 text-[10px] sm:text-xs">★</span>
              <span className="text-[10px] sm:text-xs font-medium">{product.rating}</span>
            </div>
          )}
        </div>

        {/* Row 2: Product Title */}
        <h3
          className="text-sm font-medium text-[#2d3436] mb-2 line-clamp-2 leading-tight hover:text-black transition-colors duration-300 cursor-pointer"
          onClick={handleProductNavigation}
        >
          {productName}
        </h3>

        {/* Row 3: Price (left) and Cart Icon (right) */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-0.5">
            <span className="text-[10px] text-gray-500 font-light">Rp</span>
            <span className="text-sm font-semibold text-[#2d3436]">
              {formatPrice(product.price).replace('Rp', '')}
            </span>
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-500 line-through font-light">
              {formatPrice(product.originalPrice)}
            </span>
          )}

          {/* Cart Icon - Right Aligned */}
          <button
            onClick={handleAddToCart}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
              isAdded
                ? 'bg-blue-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isAdded ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <ShoppingCart className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
