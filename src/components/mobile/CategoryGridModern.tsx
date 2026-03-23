'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

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
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Category Image - Mobile Optimized */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {category.image && !isImageError ? (
          <img
            src={category.image}
            alt={category.name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageError(true)}
            loading="lazy"
          />
        ) : (
          // Modern placeholder design
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"></div>
            <div className="relative z-10 text-center">
              <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl mx-auto mb-2 flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg"></div>
              </div>
              <p className="text-xs font-medium text-gray-700 px-3">{category.name}</p>
            </div>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

        {/* Loading Skeleton */}
        {isImageLoading && !isImageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>

      {/* Category Info - Mobile Optimized */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
            <p className="text-xs text-gray-600 mt-0.5">{category.count} items</p>
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-200">
            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </div>
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
