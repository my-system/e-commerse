"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Filter,
  X,
  Grid3x3,
  Tag,
  Sliders,
  Search,
  ArrowLeft
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

function CollapsibleSection({ title, children, defaultOpen = false, icon }: CollapsibleSectionProps & { icon?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-gray-400">{icon}</span>}
          <h3 className="text-sm font-medium text-gray-900">
            {title}
          </h3>
        </div>
        <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 py-4">
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
    <div className={`bg-white h-screen overflow-hidden flex flex-col ${className}`}>
      {/* Scrollable Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden filter-scrollbar"
        style={{ height: 'calc(100vh - 0px)' }}
      >
        {/* Categories Section */}
        <CollapsibleSection title="Categories" icon={<Grid3x3 className="w-4 h-4" />} defaultOpen={false}>
          <div className="space-y-1">
            <button
              onClick={() => handleCategoryToggle('')}
              className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 rounded-md ${
                filters.categories.length === 0 
                  ? 'text-blue-600 bg-blue-50 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => {
              const isSelected = filters.categories.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 rounded-md ${
                    isSelected 
                      ? 'text-blue-600 bg-blue-50 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Price Range Section */}
        <CollapsibleSection title="Price Range" icon={<Tag className="w-4 h-4" />} defaultOpen={false}>
          <div className="space-y-2">
            {pricePresets.map((preset) => {
              const isSelected = 
                filters.priceRange.min === preset.min && 
                filters.priceRange.max === preset.max;
              
              return (
                <button
                  key={preset.label}
                  onClick={() => handlePricePresetSelect(preset.min, preset.max)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 rounded-md ${
                    isSelected 
                      ? 'text-blue-600 bg-blue-50 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
            
            {/* Manual Input */}
            <div className="pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formatPrice(filters.priceRange.min)}
                  onChange={(e) => handleManualPriceChange('min', e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Min"
                />
                <input
                  type="text"
                  value={formatPrice(filters.priceRange.max)}
                  onChange={(e) => handleManualPriceChange('max', e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Rating Section */}
        <CollapsibleSection title="Rating" icon={<Star className="w-4 h-4" />} defaultOpen={false}>
          <div className="space-y-1">
            {ratingOptions.map((option) => {
              const isSelected = filters.rating === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleRatingSelect(option.value)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 rounded-md flex items-center gap-2 ${
                    isSelected 
                      ? 'text-blue-600 bg-blue-50 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
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
                  {option.label}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Sort By Section */}
        <CollapsibleSection title="Sort By" icon={<Sliders className="w-4 h-4" />} defaultOpen={false}>
          <div className="space-y-1">
            {sortOptions.map((option) => {
              const isSelected = filters.sortBy === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSortSelect(option.value)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 rounded-md ${
                    isSelected 
                      ? 'text-blue-600 bg-blue-50 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </CollapsibleSection>

              </div>
    </div>
  );
}
