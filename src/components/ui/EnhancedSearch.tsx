"use client";

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { 
  Search, 
  X, 
  TrendingUp, 
  Clock, 
  Filter,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';

interface SearchSuggestion {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  type: 'product' | 'category' | 'brand';
}

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  autoFocus?: boolean;
}

export default function EnhancedSearch({ 
  placeholder = "Cari produk, merek, atau kategori...", 
  onSearch,
  showSuggestions = true,
  autoFocus = false
}: EnhancedSearchProps) {
  const { addItem } = useCart();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    'Sepatu Sneakers',
    'Jaket Kulit',
    'Tas Premium',
    'Jam Tangan',
    'Kemeja Formal'
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock data - in real app, this would come from API
  const mockSuggestions: SearchSuggestion[] = [
    {
      id: '1',
      name: 'Premium Leather Jacket',
      category: 'Pakaian',
      price: 299000,
      image: '/products/jacket-1.jpg',
      type: 'product'
    },
    {
      id: '2',
      name: 'Designer Sneakers',
      category: 'Sepatu',
      price: 159000,
      image: '/products/sneakers-1.jpg',
      type: 'product'
    },
    {
      id: '3',
      name: 'Luxury Watch',
      category: 'Aksesoris',
      price: 599000,
      image: '/products/watch-1.jpg',
      type: 'product'
    },
    {
      id: '4',
      name: 'Pakaian',
      category: 'Kategori',
      price: 0,
      image: '/categories/clothing.jpg',
      type: 'category'
    },
    {
      id: '5',
      name: 'Sepatu',
      category: 'Kategori',
      price: 0,
      image: '/categories/shoes.jpg',
      type: 'category'
    },
    {
      id: '6',
      name: 'LUXE',
      category: 'Brand',
      price: 0,
      image: '/brands/luxe.jpg',
      type: 'brand'
    }
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Remove the old useEffect with debouncedQuery since we're handling it in handleInputChange

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      // Filter suggestions based on query
      const filtered = mockSuggestions.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.category.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    }, 300);
  };

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      // Add to recent searches
      const updatedRecent = [finalQuery, ...recentSearches.filter(s => s !== finalQuery)].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
      
      // Call onSearch callback
      if (onSearch) {
        onSearch(finalQuery);
      }
      
      setIsOpen(false);
      setQuery(finalQuery);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product') {
      // Add to cart directly
      addItem({
        id: `${Date.now()}`, // Generate unique ID
        productId: suggestion.id,
        title: suggestion.name,
        price: suggestion.price,
        image: suggestion.image,
        quantity: 1
      });
    } else {
      // Navigate to category/brand page
      handleSearch(suggestion.name);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {/* Search Results */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hasil Pencarian
              </div>
              
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <img 
                    src={suggestion.image} 
                    alt={suggestion.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {suggestion.category}
                          {suggestion.type === 'product' && ` • ${formatCurrency(suggestion.price)}`}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {suggestion.type === 'product' && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Produk
                          </span>
                        )}
                        {suggestion.type === 'category' && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Kategori
                          </span>
                        )}
                        {suggestion.type === 'brand' && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            Brand
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {suggestions.length === 0 && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pencarian Terakhir
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Hapus
                </button>
              </div>
              
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trending Searches */}
          {suggestions.length === 0 && recentSearches.length === 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pencarian Trending
              </div>
              
              {trendingSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {suggestions.length === 0 && recentSearches.length === 0 && query && (
            <div className="p-6 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">Tidak ada hasil untuk "{query}"</p>
              <p className="text-sm text-gray-400">Coba kata kunci lain atau lihat produk trending</p>
            </div>
          )}

          {/* Search Button */}
          {query && (
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={() => handleSearch()}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Cari "{query}"</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
