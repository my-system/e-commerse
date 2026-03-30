"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Check,
  Package,
  X,
  ChevronRight,
  Filter
} from 'lucide-react';
import './MarketplaceFilter.css';

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

interface MarketplaceFilterProps {
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

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' }
];

const ratingOptions = [
  { value: 5, label: '5 stars', stars: 5 },
  { value: 4, label: '4 stars & up', stars: 4 },
  { value: 3, label: '3 stars & up', stars: 3 },
  { value: 2, label: '2 stars & up', stars: 2 },
  { value: 1, label: '1 star & up', stars: 1 }
];

// Accordion Section Component
interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionSection({ title, children, defaultOpen = true }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-gray-100 last:border-b-0 my-6 first:mt-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-all duration-300 px-6 -mx-6 rounded-lg group"
      >
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 font-sans">{title}</h3>
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="pb-6 px-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Dual Range Slider Component
interface DualRangeSliderProps {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
}

function DualRangeSlider({ min, max, value, onChange }: DualRangeSliderProps) {
  const [minValue, setMinValue] = useState(value.min);
  const [maxValue, setMaxValue] = useState(value.max);

  useEffect(() => {
    setMinValue(value.min);
    setMaxValue(value.max);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value);
    if (newMin <= maxValue) {
      setMinValue(newMin);
      onChange({ min: newMin, max: maxValue });
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value);
    if (newMax >= minValue) {
      setMaxValue(newMax);
      onChange({ min: minValue, max: newMax });
    }
  };

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      {/* Slider Track */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="absolute h-2 bg-blue-500 rounded-full transition-all duration-200"
            style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
          />
        </div>
        
        {/* Slider Handles */}
        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          onChange={handleMinChange}
          className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-md cursor-pointer -mt-1 appearance-none slider-thumb"
          style={{ left: `${minPercent}%`, transform: 'translateX(-50%)' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          onChange={handleMaxChange}
          className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-md cursor-pointer -mt-1 appearance-none slider-thumb"
          style={{ left: `${maxPercent}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      
      {/* Price Display */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Rp</span>
          <input
            type="number"
            value={minValue}
            onChange={handleMinChange}
            className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <span className="text-gray-400">—</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={maxValue}
            onChange={handleMaxChange}
            className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-500">Rp</span>
        </div>
      </div>
    </div>
  );
}

export default function MarketplaceFilter({ 
  filters, 
  onFiltersChange, 
  onReset,
  className = "" 
}: MarketplaceFilterProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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

  const handlePriceChange = (priceRange: { min: number; max: number }) => {
    onFiltersChange({
      ...filters,
      priceRange
    });
  };

  // Format currency dengan titik separator
  const formatCurrency = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Parse currency dari string dengan titik
  const parseCurrency = (value: string): number => {
    return parseInt(value.replace(/\./g, '') || '0', 10);
  };

  // Handle price preset selection
  const handlePricePresetSelect = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: { min, max }
    });
  };

  // Handle manual price input
  const handleManualPriceChange = (type: 'min' | 'max', value: string) => {
    const numericValue = parseCurrency(value);
    const newPriceRange = { ...filters.priceRange };
    
    if (type === 'min') {
      newPriceRange.min = numericValue;
      // Validate min tidak lebih besar dari max
      if (numericValue > newPriceRange.max) {
        newPriceRange.max = numericValue;
      }
    } else {
      newPriceRange.max = numericValue;
      // Validate max tidak lebih kecil dari min
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
    // Reset all filters to default values
    onFiltersChange({
      categories: [],
      priceRange: { min: 0, max: 999999999 },
      rating: null,
      inStockOnly: false,
      sortBy: 'featured'
    });
    onReset();
  };

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.priceRange.min > 0 || 
    filters.priceRange.max < 999999999 || 
    filters.rating !== null;

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className={`w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 font-medium border border-blue-200"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filter
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        ref={scrollRef}
        className="overflow-y-auto"
      >
        {/* Category Filter */}
        <AccordionSection title="Categories">
          <div className="space-y-3">
            {categories.map((category) => {
              const isSelected = filters.categories.includes(category.id);
              return (
                <label
                  key={category.id}
                  className={`
                    flex items-center justify-between py-3 px-4 rounded-md cursor-pointer transition-all duration-300 group border
                    ${isSelected 
                      ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                      : 'border-transparent hover:bg-gray-50 hover:border-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="w-5 h-5 text-blue-500 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:scale-105 appearance-none"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <span className={`text-sm font-medium transition-all duration-300 font-sans ${
                      isSelected ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-800'
                    }`}>
                      {category.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </label>
              );
            })}
          </div>
        </AccordionSection>

        {/* Price Range */}
        <AccordionSection title="Price Range">
          <div className="px-4">
            {/* Price Presets */}
            <div className="space-y-3 mb-6">
              {[
                { label: '< Rp 50.000', min: 0, max: 50000 },
                { label: 'Rp 50.000 – Rp 500.000', min: 50000, max: 500000 },
                { label: 'Rp 500.000 – Rp 1.000.000', min: 500000, max: 1000000 },
                { label: 'Rp 1.000.000 – Rp 2.000.000', min: 1000000, max: 2000000 },
                { label: '> Rp 2.000.000', min: 2000000, max: 999999999 }
              ].map((preset) => {
                const isSelected = 
                  filters.priceRange.min === preset.min && 
                  filters.priceRange.max === preset.max;
                
                return (
                  <label
                    key={preset.label}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handlePricePresetSelect(preset.min, preset.max)}
                      className="w-5 h-5 text-blue-500 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    <span className={`text-sm font-medium transition-colors duration-200 ${
                      isSelected ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {preset.label}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Manual Input */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">Atur manual:</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={formatCurrency(filters.priceRange.min)}
                    onChange={(e) => handleManualPriceChange('min', e.target.value)}
                    className="w-full pl-8 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Min"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formatCurrency(filters.priceRange.max)}
                    onChange={(e) => handleManualPriceChange('max', e.target.value)}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Max"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    Rp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Rating Filter */}
        <AccordionSection title="Rating">
          <div className="space-y-3 px-4">
            {ratingOptions.map((option) => {
              const isSelected = filters.rating === option.value;
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={isSelected}
                    onChange={() => handleRatingSelect(option.value)}
                    className="w-5 h-5 text-blue-500 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
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
        </AccordionSection>

        {/* Sort By */}
        <AccordionSection title="Sort By">
          <div className="space-y-3 px-4">
            {sortOptions.map((option) => {
              const isSelected = filters.sortBy === option.value;
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                >
                  <input
                    type="radio"
                    name="sortBy"
                    checked={isSelected}
                    onChange={() => handleSortSelect(option.value)}
                    className="w-5 h-5 text-blue-500 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
        </AccordionSection>

        {/* Apply Button */}
        <div className="px-4 pb-6 mt-8">
          <button
            onClick={() => setIsMobileOpen(false)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm font-sans"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile Version
  const MobileVersion = () => (
    <div className="md:hidden">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        <Filter className="w-5 h-5" />
        Filters
        {hasActiveFilters && (
          <span className="ml-2 px-2 py-1 bg-blue-700 rounded-full text-xs">
            Active
          </span>
        )}
      </button>

      {/* Mobile Filter Modal */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <DesktopSidebar />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <DesktopSidebar />
      <MobileVersion />
    </div>
  );
}
