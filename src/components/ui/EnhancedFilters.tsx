"use client";

import { useState, useEffect } from 'react';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  SlidersHorizontal,
  Star,
  Tag
} from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'rating';
  options: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

interface EnhancedFiltersProps {
  filters: FilterGroup[];
  activeFilters: Record<string, any>;
  onFilterChange: (filterId: string, value: any) => void;
  onClearFilters: () => void;
  onClearFilter: (filterId: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export default function EnhancedFilters({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
  onClearFilter,
  isOpen = false,
  onToggle,
  className = ""
}: EnhancedFiltersProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [localFilters, setLocalFilters] = useState(activeFilters);

  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const handleFilterChange = (filterId: string, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
    onFilterChange(filterId, value);
  };

  const handleRangeChange = (filterId: string, value: number, isMin?: boolean) => {
    const currentRange = localFilters[filterId] || { min: 0, max: 1000000 };
    const newRange = isMin 
      ? { ...currentRange, min: value }
      : { ...currentRange, max: value };
    
    setLocalFilters(prev => ({
      ...prev,
      [filterId]: newRange
    }));
    onFilterChange(filterId, newRange);
  };

  const renderFilterGroup = (group: FilterGroup) => {
    const isExpanded = expandedGroups[group.id] !== false; // Default to expanded
    const activeValue = localFilters[group.id];

    return (
      <div key={group.id} className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleGroup(group.id)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-900">{group.label}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {isExpanded && (
          <div className="px-4 pb-4">
            {group.type === 'checkbox' && (
              <div className="space-y-2">
                {group.options.map((option) => (
                  <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Array.isArray(activeValue) && activeValue.includes(option.id)}
                      onChange={(e) => {
                        const current = Array.isArray(activeValue) ? activeValue : [];
                        if (e.target.checked) {
                          handleFilterChange(group.id, [...current, option.id]);
                        } else {
                          handleFilterChange(group.id, current.filter(id => id !== option.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                    {option.count && (
                      <span className="text-xs text-gray-500">({option.count})</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {group.type === 'radio' && (
              <div className="space-y-2">
                {group.options.map((option) => (
                  <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={group.id}
                      checked={activeValue === option.id}
                      onChange={() => handleFilterChange(group.id, option.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                    {option.count && (
                      <span className="text-xs text-gray-500">({option.count})</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {group.type === 'range' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Min: {formatCurrency(activeValue?.min || group.min || 0)}
                  </span>
                  <span className="text-sm text-gray-600">
                    Max: {formatCurrency(activeValue?.max || group.max || 1000000)}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">Harga Minimum</label>
                    <input
                      type="range"
                      min={group.min || 0}
                      max={group.max || 1000000}
                      step={group.step || 10000}
                      value={activeValue?.min || group.min || 0}
                      onChange={(e) => handleRangeChange(group.id, Number(e.target.value), true)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Harga Maximum</label>
                    <input
                      type="range"
                      min={group.min || 0}
                      max={group.max || 1000000}
                      step={group.step || 10000}
                      value={activeValue?.max || group.max || 1000000}
                      onChange={(e) => handleRangeChange(group.id, Number(e.target.value), false)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {group.type === 'rating' && (
              <div className="space-y-2">
                {group.options.map((option) => {
                  const rating = parseInt(option.id);
                  return (
                    <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={group.id}
                        checked={activeValue === option.id}
                        onChange={() => handleFilterChange(group.id, option.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-700">{option.label}</span>
                      {option.count && (
                        <span className="text-xs text-gray-500">({option.count})</span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const hasActiveFilters = Object.keys(activeFilters).some(key => {
    const value = activeFilters[key];
    return value !== undefined && value !== null && value !== '' && 
           (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filter</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset
            </button>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Groups */}
      <div className="max-h-96 overflow-y-auto">
        {filters.map(renderFilterGroup)}
      </div>

      {/* Footer */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Filter Aktif:</h4>
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              
              const filter = filters.find(f => f.id === key);
              if (!filter) return null;

              const getDisplayValue = () => {
                if (filter.type === 'range') {
                  const range = value as { min: number; max: number };
                  return `${formatCurrency(range.min)} - ${formatCurrency(range.max)}`;
                }
                
                if (filter.type === 'rating') {
                  const rating = parseInt(value as string);
                  return `${rating} Bintang`;
                }
                
                if (Array.isArray(value)) {
                  return value.map(id => {
                    const option = filter.options.find(opt => opt.id === id);
                    return option?.label || id;
                  }).join(', ');
                }
                
                const option = filter.options.find(opt => opt.id === value);
                return option?.label || value;
              };

              return (
                <div key={key} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-3 h-3 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {filter.label}: {getDisplayValue()}
                    </span>
                  </div>
                  <button
                    onClick={() => onClearFilter(key)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Preset filter configurations
export const presetFilters = {
  clothing: [
    {
      id: 'category',
      label: 'Kategori',
      type: 'checkbox' as const,
      options: [
        { id: 'pria', label: 'Pakaian Pria', count: 45 },
        { id: 'wanita', label: 'Pakaian Wanita', count: 67 },
        { id: 'anak', label: 'Pakaian Anak', count: 23 },
        { id: 'aksesoris', label: 'Aksesoris', count: 31 }
      ]
    },
    {
      id: 'size',
      label: 'Ukuran',
      type: 'radio' as const,
      options: [
        { id: 'xs', label: 'XS', count: 12 },
        { id: 's', label: 'S', count: 34 },
        { id: 'm', label: 'M', count: 56 },
        { id: 'l', label: 'L', count: 45 },
        { id: 'xl', label: 'XL', count: 28 },
        { id: 'xxl', label: 'XXL', count: 15 }
      ]
    },
    {
      id: 'price',
      label: 'Harga',
      type: 'range' as const,
      min: 0,
      max: 1000000,
      step: 50000,
      options: []
    },
    {
      id: 'rating',
      label: 'Rating',
      type: 'rating' as const,
      options: [
        { id: '4', label: '4 Bintang ke atas', count: 89 },
        { id: '3', label: '3 Bintang ke atas', count: 134 },
        { id: '2', label: '2 Bintang ke atas', count: 156 }
      ]
    }
  ],
  
  shoes: [
    {
      id: 'category',
      label: 'Jenis Sepatu',
      type: 'checkbox' as const,
      options: [
        { id: 'sneakers', label: 'Sneakers', count: 34 },
        { id: 'formal', label: 'Formal', count: 28 },
        { id: 'sport', label: 'Sport', count: 22 },
        { id: 'casual', label: 'Casual', count: 41 }
      ]
    },
    {
      id: 'size',
      label: 'Ukuran',
      type: 'radio' as const,
      options: [
        { id: '36', label: '36', count: 8 },
        { id: '37', label: '37', count: 12 },
        { id: '38', label: '38', count: 18 },
        { id: '39', label: '39', count: 25 },
        { id: '40', label: '40', count: 32 },
        { id: '41', label: '41', count: 28 },
        { id: '42', label: '42', count: 24 },
        { id: '43', label: '43', count: 16 },
        { id: '44', label: '44', count: 10 }
      ]
    },
    {
      id: 'price',
      label: 'Harga',
      type: 'range' as const,
      min: 0,
      max: 2000000,
      step: 100000,
      options: []
    }
  ]
};
