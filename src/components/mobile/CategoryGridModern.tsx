'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import OptimizedImage from '@/components/ui/OptimizedImage'

interface Category {
  name: string
  image?: string
  count: number
}

interface CategoryGridModernProps {
  categories: Category[]
  onCategoryClick?: (category: Category) => void
}

function CategoryCardModern({ category, onClick }: { category: Category; onClick?: () => void }) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isImageError, setIsImageError] = useState(false)

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer group transform hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Category Image - Mobile Optimized */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden min-h-[160px]">
        {category.image ? (
          <OptimizedImage
            src={category.image}
            alt={category.name}
            className="w-full h-full group-hover:scale-110 transition-transform duration-500"
            priority={false}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            placeholder="blur"
            fallback="/placeholder.jpg"
          />
        ) : (
          // Modern placeholder design with icon
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl"></div>
              </div>
              <p className="text-sm font-semibold text-gray-800 px-3">{category.name}</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Product Count Badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-md">
          <span className="text-xs font-medium text-gray-700">{category.count}</span>
        </div>

        {/* Loading Skeleton */}
        {isImageLoading && !isImageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>

      {/* Category Info - Mobile Optimized */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{category.count} produk</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300 shadow-sm">
            <ArrowRight className="w-5 h-5 text-blue-600 group-hover:text-purple-600 transition-colors" />
          </div>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
  )
}

export function CategoryGridModern({ 
  categories, 
  onCategoryClick 
}: CategoryGridModernProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map((category) => (
        <CategoryCardModern 
          key={category.name}
          category={category}
          onClick={() => onCategoryClick?.(category)}
        />
      ))}
    </div>
  )
}
