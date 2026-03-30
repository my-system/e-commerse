"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Filter,
  X
} from 'lucide-react';

interface FilterState {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number | null;
  inStockOnly: boolean;
  sortBy: string;
}

interface ModernSidebarFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  className?: string;
}

const categories = [
  { id: 'fashion', name: 'Fashion', count: 245 },
  { id: 'shoes', name: 'Shoes', count: 128 },
  { id: 'accessories', name: 'Accessories', count: 89 },
  { id: 'bags', name: 'Bags', count: 67 },
  { id: 'jewelry', name: 'Jewelry', count: 34 },
  { id: 'electronics', name: 'Electronics', count: 156 }
];

const pricePresets = [
  { label: '< Rp 50.000', min: 0, max: 50000 },
  { label: 'Rp 50.000 – Rp 500.000', min: 50000, max: 500000 },
  { label: 'Rp 500.000 – Rp 1.000.000', min: 500000, max: 1000000 },
  { label: 'Rp 1.000.000 – Rp 2.000.000', min: 1000000, max: 2000000 },
  { label: '> Rp 2.000.000', min: 2000000, max: 999999999 }
];

const ratingOptions = [
  { value: 5, label: '5 bintang', stars: 5 },
  { value: 4, label: '4 bintang ke atas', stars: 4 },
  { value: 3, label: '3 bintang ke atas', stars: 3 },
  { value: 2, label: '2 bintang ke atas', stars: 2 },
  { value: 1, label: '1 bintang ke atas', stars: 1 }
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' }
];

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 transition-all duration-200 group"
      >
        <h3 className="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
          {title}
        </h3>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ModernSidebarFilter({ 
  filters, 
  onFiltersChange, 
  onReset,
  className = "" 
}: ModernSidebarFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handlePricePresetSelect = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: { min, max }
    });
  };

  const handleManualPriceChange = (type: 'min' | 'max', value: string) => {
    const numericValue = parseInt(value.replace(/\D/g, '') || '0', 10);
    const newPriceRange = { ...filters.priceRange };
    
    if (type === 'min') {
      newPriceRange.min = numericValue;
      if (numericValue > newPriceRange.max) {
        newPriceRange.max = numericValue;
      }
    } else {
      newPriceRange.max = numericValue;
      if (numericValue < newPriceRange.min) {
        newPriceRange.min = numericValue;
      }
    }
    
    onFiltersChange({
      ...filters,
      priceRange: newPriceRange
    });
  };

  const handleRatingSelect = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating: filters.rating === rating ? null : rating
    });
  };

  const handleSortSelect = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value
    });
  };

  const handleReset = () => {
    onFiltersChange({
      categories: [],
      priceRange: { min: 0, max: 999999999 },
      rating: null,
      inStockOnly: false,
      sortBy: 'featured'
    });
    onReset();
  };

  const formatPrice = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.priceRange.min > 0 || 
    filters.priceRange.max < 999999999 || 
    filters.rating !== null;

  return (
    <div className={`w-[280px] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-bold text-gray-900">Filters</h2>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-all duration-200 font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={scrollRef}
        className="max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        {/* Categories Section */}
        <CollapsibleSection title="Categories">
          <div className="space-y-2">
            {categories.map((category) => {
              const isSelected = filters.categories.includes(category.id);
              return (
                <label
                  key={category.id}
                  className={`
                    flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 group
                    ${isSelected 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="w-4 h-4 text-blue-500 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div>
                        </div>
                      )}
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-200 ${
                      isSelected ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {category.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
                    {category.count}
                  </span>
                </label>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Price Range Section */}
        <CollapsibleSection title="Price Range">
          <div className="px-3 space-y-3">
            {/* Price Presets */}
            {pricePresets.map((preset) => {
              const isSelected = 
                filters.priceRange.min === preset.min && 
                filters.priceRange.max === preset.max;
              
              return (
                <label
                  key={preset.label}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handlePricePresetSelect(preset.min, preset.max)}
                    className="w-4 h-4 text-blue-500 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div>
                    </div>
                  )}
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    isSelected ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {preset.label}
                  </span>
                </label>
              );
            })}

            {/* Manual Input */}
            <div className="space-y-3 pt-3">
              <div className="text-sm font-medium text-gray-700">Atur manual:</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs pointer-events-none z-10">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={formatPrice(filters.priceRange.min)}
                    onChange={(e) => handleManualPriceChange('min', e.target.value)}
                    className="w-full pl-8 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Rp 0"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs pointer-events-none z-10">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={formatPrice(filters.priceRange.max)}
                    onChange={(e) => handleManualPriceChange('max', e.target.value)}
                    className="w-full pl-8 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Rp 999.999.999"
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Rating Section */}
        <CollapsibleSection title="Rating">
          <div className="px-3 space-y-2">
            {ratingOptions.map((option) => {
              const isSelected = filters.rating === option.value;
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={isSelected}
                    onChange={() => handleRatingSelect(option.value)}
                    className="w-4 h-4 text-blue-500 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < option.stars
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-200 ${
                      isSelected ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Sort By Section */}
        <CollapsibleSection title="Sort By">
          <div className="px-3 space-y-2">
            {sortOptions.map((option) => {
              const isSelected = filters.sortBy === option.value;
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                >
                  <input
                    type="radio"
                    name="sortBy"
                    checked={isSelected}
                    onChange={() => handleSortSelect(option.value)}
                    className="w-4 h-4 text-blue-500 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                  />
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    isSelected ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Apply Button */}
        <div className="px-4 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
}
