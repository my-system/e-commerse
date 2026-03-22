"use client";

import { ProductVariant } from '@/data/products';

interface VariantSelectorProps {
  type: 'size' | 'color';
  variants: ProductVariant[];
  selectedVariant: string | null;
  onVariantChange: (variantId: string) => void;
  label: string;
}

export default function VariantSelector({
  type,
  variants,
  selectedVariant,
  onVariantChange,
  label,
}: VariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  const renderSizeVariant = (variant: ProductVariant) => (
    <button
      key={variant.id}
      onClick={() => variant.inStock && onVariantChange(variant.id)}
      disabled={!variant.inStock}
      className={`px-4 py-2 border rounded-lg font-medium transition-all duration-200 ${
        selectedVariant === variant.id
          ? 'border-blue-600 bg-blue-600 text-white'
          : variant.inStock
          ? 'border-gray-300 text-gray-900 hover:border-gray-400'
          : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
      }`}
    >
      {variant.value}
      {!variant.inStock && <span className="text-xs block">Habis</span>}
    </button>
  );

  const renderColorVariant = (variant: ProductVariant) => (
    <button
      key={variant.id}
      onClick={() => variant.inStock && onVariantChange(variant.id)}
      disabled={!variant.inStock}
      className={`relative w-10 h-10 rounded-full border-2 transition-all duration-200 ${
        selectedVariant === variant.id
          ? 'border-blue-600 ring-2 ring-blue-200'
          : variant.inStock
          ? 'border-gray-300 hover:border-gray-400'
          : 'border-gray-200 cursor-not-allowed opacity-50'
      }`}
      title={variant.name}
      style={{
        backgroundColor: variant.value,
      }}
    >
      {selectedVariant === variant.id && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}
      {!variant.inStock && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-0.5 bg-gray-400 rotate-45" />
        </div>
      )}
    </button>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        {selectedVariant && (
          <span className="text-sm text-gray-600">
            {variants.find(v => v.id === selectedVariant)?.name}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {type === 'size' 
          ? variants.map(renderSizeVariant)
          : variants.map(renderColorVariant)
        }
      </div>
      
      {!selectedVariant && (
        <p className="text-sm text-red-600">Pilih {label.toLowerCase()} terlebih dahulu</p>
      )}
    </div>
  );
}
