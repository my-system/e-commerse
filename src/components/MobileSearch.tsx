'use client'

import { useState, useEffect } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { products } from '@/data/products'
import { Product } from '@/data/products'

interface MobileSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([
    't-shirt',
    'denim jacket',
    'dress',
    'shoes'
  ])

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const results = products.filter(product => 
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.material?.toLowerCase().includes(query)
    )

    setSearchResults(results.slice(0, 6)) // Limit to 6 results
  }, [searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Add to recent searches if not empty
    if (query.trim() && !recentSearches.includes(query.toLowerCase())) {
      setRecentSearches(prev => [query.toLowerCase(), ...prev.slice(0, 2)])
    }
  }

  const handleProductClick = (product: Product) => {
    // Navigate to product page
    window.location.href = `/products/${product.id}`
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black/50">
      <div className="bg-white">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {searchQuery.trim() === '' ? (
            // Recent Searches & Suggestions
            <div className="p-4">
              {/* Recent Searches */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Recent Searches</h3>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-900">Trending</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Summer Collection', 'Denim', 'Cotton', 'Dress', 'Shoes'].map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(trend)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    >
                      {trend}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Search Results
            <div className="p-4">
              {searchResults.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {searchResults.length} results found
                    </h3>
                    <span className="text-xs text-gray-500">
                      for "{searchQuery}"
                    </span>
                  </div>
                  <div className="space-y-3">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </h4>
                          <p className="text-xs text-gray-500 mb-1">
                            {product.category}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-blue-600">
                              Rp {product.price.toLocaleString('id-ID')}
                            </span>
                            {product.rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-yellow-500">★</span>
                                <span className="text-xs text-gray-600">
                                  {product.rating}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    No products found
                  </h3>
                  <p className="text-xs text-gray-500">
                    Try searching for "t-shirt", "denim", or "dress"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
