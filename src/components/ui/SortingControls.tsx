"use client";

import { ChevronDown } from 'lucide-react';

export interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: 'featured', label: 'Unggulan' },
  { value: 'price-low', label: 'Harga Terendah' },
  { value: 'price-high', label: 'Harga Tertinggi' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'bestselling', label: 'Terlaris' },
  { value: 'rating', label: 'Rating Tertinggi' },
];

interface SortingControlsProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
  totalProducts: number;
  currentPage: number;
  productsPerPage: number;
}

export default function SortingControls({
  currentSort,
  onSortChange,
  totalProducts,
  currentPage,
  productsPerPage,
}: SortingControlsProps) {
  const startProduct = (currentPage - 1) * productsPerPage + 1;
  const endProduct = Math.min(currentPage * productsPerPage, totalProducts);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Product Count */}
      <div className="text-sm text-gray-600">
        Menampilkan <span className="font-medium text-gray-900">{startProduct}-{endProduct}</span> dari{' '}
        <span className="font-medium text-gray-900">{totalProducts}</span> produk
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-gray-600">
          Urutkan:
        </label>
        <div className="relative">
          <select
            id="sort"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:border-gray-400 transition-colors duration-200"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
