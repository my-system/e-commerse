"use client";

import React, { useState, useMemo } from 'react';
import { X, RotateCcw, ChevronDown, ChevronUp, Tag, DollarSign, Star, Check } from 'lucide-react';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { pricePresets } from '@/lib/product-utils';

interface FilterState {
  category: string;
  priceMin: number;
  priceMax: number;
  rating: number | null;
}

interface FilterSidebarModernProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function FilterSidebarModern({ 
  filters, 
  onFiltersChange, 
  isMobile = false, 
  onClose 
}: FilterSidebarModernProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true
  });

  // Debug logging
  console.log('Current filters:', filters);

  // Memoized category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat, index) => {
      counts[cat.id] = (index + 1) * 12 + 18; // Deterministic counts
    });
    return counts;
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryToggle = (category: string) => {
    const newCategory = filters.category === category ? '' : category;
    console.log('Category toggle:', category, '→', newCategory);
    onFiltersChange({
      ...filters,
      category: newCategory
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newFilters = {
      ...filters,
      [type === 'min' ? 'priceMin' : 'priceMax']: value
    };
    console.log('Price change:', type, value, '→', newFilters);
    onFiltersChange(newFilters);
  };

  const handleRatingChange = (rating: number | null) => {
    const newRating = filters.rating === rating ? null : rating;
    console.log('Rating change:', rating, '→', newRating);
    console.log('selectedRating:', newRating);
    onFiltersChange({
      ...filters,
      rating: newRating
    });
  };

  const handleReset = () => {
    console.log('Reset filters');
    onFiltersChange({
      category: '',
      priceMin: 0,
      priceMax: 999999999,
      rating: null
    });
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Filter</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Reset Filter"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            {isMobile && onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters - Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0 filter-scroll-container">
        {/* Categories Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection('categories')}
            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">
                <Tag className="h-3 w-3 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Kategori</h4>
            </div>
            {expandedSections.categories ? (
              <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
            )}
          </button>
          
          {expandedSections.categories && (
            <div className="border-t border-gray-200 p-4 space-y-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                    filters.category === category.slug
                      ? 'bg-blue-50 border-blue-600 text-blue-600 font-medium'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs text-gray-500">({categoryCounts[category.id] || 25})</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection('price')}
            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-500 text-xs">💰</span>
              </div>
              <h4 className="font-semibold text-gray-900">Harga</h4>
            </div>
            {expandedSections.price ? (
              <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Price Preset Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {pricePresets.map((preset) => {
                  const isActive = filters.priceMin === preset.priceMin && filters.priceMax === preset.priceMax;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => onFiltersChange({
                        ...filters,
                        priceMin: preset.priceMin,
                        priceMax: preset.priceMax
                      })}
                      className={`
                        px-4 py-3 text-sm font-medium rounded-xl border
                        transition-all duration-200
                        hover:border-blue-400 hover:bg-blue-50
                        ${isActive 
                          ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
                          : 'bg-white text-gray-700 border-gray-300'}
                      `}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Range Input */}
              <div className="border-t pt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Custom Range</h5>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Minimum</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400 text-sm">Rp</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={filters.priceMin || ''}
                        onChange={(e) => handlePriceChange('min', Number(e.target.value) || 0)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Maksimum</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400 text-sm">Rp</span>
                      <input
                        type="number"
                        placeholder="999999999"
                        value={filters.priceMax === 999999999 ? '' : filters.priceMax || ''}
                        onChange={(e) => handlePriceChange('max', Number(e.target.value) || 999999999)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Reset Price Button - More subtle */}
              <button
                onClick={() => onFiltersChange({
                  ...filters,
                  priceMin: 0,
                  priceMax: 999999999
                })}
                className="w-full py-2 text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
              >
                Reset Harga
              </button>
            </div>
          )}
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection('rating')}
            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-3 w-3 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Rating</h4>
            </div>
            {expandedSections.rating ? (
              <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
            )}
          </button>
          
          {expandedSections.rating && (
            <div className="border-t border-gray-200 p-4 space-y-3">
              {/* 5 Stars - Exactly 5★ */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === 5}
                  onChange={() => handleRatingChange(5)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg text-yellow-400">★</span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">5★</span>
                </div>
              </label>
              
              {/* 4 Stars - 4.0 – 4.9 */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === 4}
                  onChange={() => handleRatingChange(4)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">4★</span>
                </div>
              </label>
              
              {/* 3 Stars - 3.0 – 3.9 */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === 3}
                  onChange={() => handleRatingChange(3)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < 3 ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">3★</span>
                </div>
              </label>
              
              {/* 2 Stars - 2.0 – 2.9 */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === 2}
                  onChange={() => handleRatingChange(2)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < 2 ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">2★</span>
                </div>
              </label>
              
              {/* 1 Star - 1.0 – 1.9 */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === 1}
                  onChange={() => handleRatingChange(1)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < 1 ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">1★</span>
                </div>
              </label>
              
              {/* Clear Rating Option */}
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === null}
                  onChange={() => handleRatingChange(null)}
                  className="w-4 h-4 accent-gray-600 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-900">Semua Rating</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Apply & Reset Buttons */}
      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0 flex-shrink-0">
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filter
          </button>
          <button
            onClick={isMobile ? onClose : undefined}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            <Check className="h-4 w-4" />
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Bottom Sheet */}
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-up filter-mobile-container">
          {/* Handle Bar */}
          <div className="flex justify-center py-2 flex-shrink-0">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
          
          <SidebarContent />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col filter-desktop-container">
      <SidebarContent />
    </div>
  );
}
