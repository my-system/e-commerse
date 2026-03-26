"use client";

import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { FilterState, pricePresets } from '@/lib/product-utils';
import { categories } from '@/data/categories';

interface FilterButtonProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}

export default function FilterButton({ filters, onFiltersChange, onReset }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.priceMin > 0 || filters.priceMax < 1000000) count++;
    if (filters.rating !== null) count++;
    return count;
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">Filter</span>
        {getActiveFiltersCount() > 0 && (
          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
            {getActiveFiltersCount()}
          </span>
        )}
      </button>

      {/* Mobile Filter Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Filter Drawer */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Filter</h3>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div className="p-4 space-y-6">
              {/* Category Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Kategori</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => onFiltersChange({ ...filters, category: '' })}
                    className={`w-full text-left px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                      !filters.category
                        ? 'bg-blue-50 border-blue-600 text-blue-600 font-medium'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Semua Kategori
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onFiltersChange({ ...filters, category: category.slug })}
                      className={`w-full text-left px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                        filters.category === category.slug
                          ? 'bg-blue-50 border-blue-600 text-blue-600 font-medium'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-green-500">💰</span>
                  Harga
                </h4>
                <div className="space-y-4">
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
                            onChange={(e) => onFiltersChange({ ...filters, priceMin: Number(e.target.value) || 0 })}
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
                            onChange={(e) => onFiltersChange({ ...filters, priceMax: Number(e.target.value) || 999999999 })}
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
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Rating</h4>
                <div className="space-y-2">
                  {/* 5 Stars - Exactly 5★ */}
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === 5}
                      onChange={() => onFiltersChange({ ...filters, rating: filters.rating === 5 ? null : 5 })}
                      className="w-4 h-4 accent-blue-600"
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
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === 4}
                      onChange={() => onFiltersChange({ ...filters, rating: filters.rating === 4 ? null : 4 })}
                      className="w-4 h-4 accent-blue-600"
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
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === 3}
                      onChange={() => onFiltersChange({ ...filters, rating: filters.rating === 3 ? null : 3 })}
                      className="w-4 h-4 accent-blue-600"
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
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === 2}
                      onChange={() => onFiltersChange({ ...filters, rating: filters.rating === 2 ? null : 2 })}
                      className="w-4 h-4 accent-blue-600"
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
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === 1}
                      onChange={() => onFiltersChange({ ...filters, rating: filters.rating === 1 ? null : 1 })}
                      className="w-4 h-4 accent-blue-600"
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
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === null}
                      onChange={() => onFiltersChange({ ...filters, rating: null })}
                      className="w-4 h-4 accent-gray-600"
                    />
                    <span className="text-sm font-medium text-gray-900">Semua Rating</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <button
                  onClick={onReset}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
