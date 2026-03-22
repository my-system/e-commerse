"use client";

import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { products } from '@/data/products';
import Link from 'next/link';

interface SearchItem {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const filteredProducts = products
        .filter(product => 
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 8) // Limit to 8 results
        .map(product => ({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images[0],
          category: product.category
        }));

      setResults(filteredProducts);
      setIsSearching(false);
    }, 300);
  };

  // Debounced search
  const debouncedSearch = debounce(performSearch, 300);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // Toggle search
  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus input after opening
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      // Clear search when closing
      setQuery('');
      setResults([]);
    }
  };

  // Close search
  const closeSearch = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSearch();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Toggle Button */}
      <button
        onClick={toggleSearch}
        className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-100"
        aria-label="Search"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <SearchIcon className="h-5 w-5" />
        )}
      </button>

      {/* Search Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSearch} />
          
          {/* Search Container */}
          <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
            {/* Search Input */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Cari produk..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setResults([]);
                      inputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-600 text-sm">Mencari produk...</p>
                </div>
              ) : query && results.length > 0 ? (
                <div className="py-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={closeSearch}
                      className="flex items-center p-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {product.title}
                        </h4>
                        <p className="text-xs text-gray-500 capitalize">
                          {product.category}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-blue-600">
                        Rp {product.price.toLocaleString('id-ID')}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : query && !isSearching ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-2">
                    <SearchIcon className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-gray-600 text-sm">Produk tidak ditemukan</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Coba kata kunci lain atau cek kategori produk
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-300 mb-2">
                    <SearchIcon className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Ketik untuk mencari produk
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Cari berdasarkan nama produk atau kategori
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {query && results.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  Menampilkan {results.length} hasil pencarian
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
