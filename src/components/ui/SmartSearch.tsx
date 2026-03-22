"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { RecommendationEngine } from '@/lib/recommendationEngine';
import { products } from '@/data/products';
import { useRouter } from 'next/navigation';

interface SmartSearchProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export default function SmartSearch({ 
  placeholder = "Cari produk...", 
  className = "",
  onSearch 
}: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const { state, trackSearch } = useUserPreferences();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate suggestions based on query and user preferences
  const generateSuggestions = (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      return [];
    }

    const queryLower = searchQuery.toLowerCase();
    const allSuggestions: string[] = [];

    // 1. Product titles
    products.forEach(product => {
      if (product.title.toLowerCase().includes(queryLower)) {
        allSuggestions.push(product.title);
      }
    });

    // 2. Categories
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(category => {
      if (category.toLowerCase().includes(queryLower)) {
        allSuggestions.push(category);
      }
    });

    // 3. User search history
    state.preferences.searchHistory.forEach(search => {
      if (search.toLowerCase().includes(queryLower)) {
        allSuggestions.push(search);
      }
    });

    // 4. Popular searches (trending)
    const popularSearches = [
      "kaos", "jaket", "sepatu", "tas", "celana", 
      "dress", "topi", "kacamata", "jam tangan"
    ];
    popularSearches.forEach(search => {
      if (search.toLowerCase().includes(queryLower)) {
        allSuggestions.push(search);
      }
    });

    // Remove duplicates and limit to 8
    return [...new Set(allSuggestions)]
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.toLowerCase() === queryLower ? 0 : 1;
        const bExact = b.toLowerCase() === queryLower ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
        
        // Then prioritize starting with query
        const aStart = a.toLowerCase().startsWith(queryLower) ? 0 : 1;
        const bStart = b.toLowerCase().startsWith(queryLower) ? 0 : 1;
        if (aStart !== bStart) return aStart - bStart;
        
        return a.localeCompare(b);
      })
      .slice(0, 8);
  };

  // Typo correction using Levenshtein distance
  const correctTypo = (searchQuery: string): string => {
    if (!searchQuery || searchQuery.length < 3) return searchQuery;

    const queryLower = searchQuery.toLowerCase();
    let bestMatch = searchQuery;
    let bestDistance = Infinity;

    // Check against product titles and categories
    const allTerms = [
      ...products.map(p => p.title.toLowerCase()),
      ...[...new Set(products.map(p => p.category.toLowerCase()))]
    ];

    allTerms.forEach(term => {
      const distance = levenshteinDistance(queryLower, term);
      if (distance < bestDistance && distance <= Math.max(queryLower.length, term.length) * 0.4) {
        bestDistance = distance;
        bestMatch = term;
      }
    });

    return bestMatch;
  };

  // Simple Levenshtein distance implementation
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null)
    );

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  };

  // Handle search
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const correctedQuery = correctTypo(searchQuery);
    
    // Track the search
    trackSearch(correctedQuery);

    // Get personalized results
    const searchResults = RecommendationEngine.getPersonalizedSearchResults(
      correctedQuery,
      products,
      state.preferences,
      8
    );

    setResults(searchResults);
    setIsSearching(false);
    setQuery(correctedQuery);

    // Call onSearch callback if provided
    onSearch?.(correctedQuery);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (value.length >= 2) {
      const newSuggestions = generateSuggestions(value);
      setSuggestions(newSuggestions);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setIsOpen(false);
    setSuggestions([]);
    handleSearch(suggestion);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
    setIsOpen(false);
    
    // Navigate to search results page
    router.push(`/shop?q=${encodeURIComponent(query)}`);
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
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      {isOpen && (suggestions.length > 0 || isSearching) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Mencari...
            </div>
          ) : (
            <>
              {/* Suggestions */}
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                    selectedIndex === index
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {state.preferences.searchHistory.includes(suggestion) ? (
                      <Clock className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Search className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="flex-1">{suggestion}</span>
                    {suggestion !== query && suggestion.toLowerCase().startsWith(query.toLowerCase()) && (
                      <span className="text-xs text-gray-500">
                        {suggestion.substring(query.length)}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Show more results link */}
              {query && (
                <div
                  onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
                  className="px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-150 border-t border-gray-200"
                >
                  <div className="flex items-center gap-2 text-blue-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Lihat semua hasil untuk "{query}"</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
