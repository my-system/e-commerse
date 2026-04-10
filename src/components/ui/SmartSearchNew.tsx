"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  title: string;
  name?: string;
  category: string;
  description?: string;
  material?: string;
  price: number;
  image?: string;
  images?: string[];
  rating?: number;
  inStock?: boolean;
}

interface SmartSearchProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function SmartSearchNew({ 
  placeholder = "Search products...", 
  className = "",
  onSearch 
}: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    't-shirt',
    'denim jacket', 
    'dress',
    'shoes'
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced query
  const debouncedQuery = useDebounce(query, 300);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          // Handle different response formats
          const productsArray = Array.isArray(data) ? data : (data.products || []);
          setAllProducts(productsArray);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Search functionality with debounce
  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const queryLower = debouncedQuery.toLowerCase().trim();
    const results = allProducts.filter(product => {
      const searchFields = [
        product.title || product.name || '',
        product.category || '',
        product.description || '',
        product.material || ''
      ];
      
      return searchFields.some(field => 
        field.toLowerCase().includes(queryLower)
      );
    });

    setSearchResults(results.slice(0, 6));
  }, [debouncedQuery, allProducts]);

  // Handle search
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    if (searchQuery.trim() && !recentSearches.includes(searchQuery.toLowerCase())) {
      setRecentSearches(prev => [searchQuery.toLowerCase(), ...prev.slice(0, 2)]);
    }

    // Navigate to search results page
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    onSearch?.(searchQuery);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 1) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Handle product click
  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id}`);
    setIsOpen(false);
    setQuery('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            } else if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          {query.trim() === '' ? (
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
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700 flex items-center gap-2"
                    >
                      <Search className="w-3 h-3 text-gray-400" />
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
                      for "{query}"
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
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={product.images?.[0] || product.image || '/images/placeholder.jpg'}
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
                  
                  {/* View All Results Button */}
                  <button
                    onClick={() => handleSearch(query)}
                    className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View all results
                  </button>
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
      )}
    </div>
  );
}
