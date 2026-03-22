"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp, X, RotateCcw } from 'lucide-react';
import { categories } from '@/data/categories';

export interface FilterState {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  sortBy: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const priceRanges = [
  { label: 'Di bawah Rp 500.000', min: 0, max: 500000 },
  { label: 'Rp 500.000 - Rp 1.000.000', min: 500000, max: 1000000 },
  { label: 'Rp 1.000.000 - Rp 2.000.000', min: 1000000, max: 2000000 },
  { label: 'Di atas Rp 2.000.000', min: 2000000, max: Infinity },
];

export default function FilterSidebar({
  filters,
  onFiltersChange,
  onReset,
  isMobile = false,
  onClose,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: { min, max }
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating: rating === filters.rating ? 0 : rating
    });
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            title="Reset Filter"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Categories */}
        <div>
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <h4 className="font-medium text-gray-900">Kategori</h4>
            {expandedSections.categories ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.categories && (
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <h4 className="font-medium text-gray-900">Harga</h4>
            {expandedSections.price ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="space-y-2">
              {priceRanges.map((range, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors duration-200"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={
                      filters.priceRange.min === range.min &&
                      filters.priceRange.max === range.max
                    }
                    onChange={() => handlePriceRangeChange(range.min, range.max)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
              
              {/* Custom Price Range */}
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange.min || ''}
                    onChange={(e) => handlePriceRangeChange(
                      Number(e.target.value) || 0,
                      filters.priceRange.max
                    )}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange.max === Infinity ? '' : filters.priceRange.max || ''}
                    onChange={(e) => handlePriceRangeChange(
                      filters.priceRange.min,
                      Number(e.target.value) || Infinity
                    )}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rating */}
        <div>
          <button
            onClick={() => toggleSection('rating')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <h4 className="font-medium text-gray-900">Rating</h4>
            {expandedSections.rating ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.rating && (
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors duration-200"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">& ke atas</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Apply Button */}
      <div className="p-4 border-t">
        <button
          onClick={isMobile ? onClose : undefined}
          className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Terapkan Filter
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
        />
        
        {/* Sidebar */}
        <div className="relative bg-white w-80 h-full shadow-xl">
          <SidebarContent />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <SidebarContent />
    </div>
  );
}
