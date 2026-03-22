"use client";

import { useState } from 'react';
import { CartItem } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import QuantitySelector from './QuantitySelector';
import { X, Plus, Minus, Trash2 } from 'lucide-react';

interface CartItemComponentProps {
  item: CartItem;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isCompact?: boolean;
}

export default function CartItemComponent({
  item,
  onQuantityChange,
  onRemove,
  isCompact = false,
}: CartItemComponentProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    onQuantityChange(item.id, newQuantity);
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(item.id);
    }, 300);
  };

  const renderVariantInfo = () => {
    if (!item.variant) return null;

    const variantParts = [];
    if (item.variant.size) variantParts.push(item.variant.size.value);
    if (item.variant.color) variantParts.push(item.variant.color.name);

    if (variantParts.length === 0) return null;

    return (
      <p className="text-sm text-gray-600">
        {variantParts.join(' • ')}
      </p>
    );
  };

  if (isCompact) {
    return (
      <div className={`flex items-center gap-3 p-3 bg-white rounded-lg border transition-all duration-300 ${
        isRemoving ? 'opacity-50 transform scale-95' : 'opacity-100'
      }`}>
        {/* Product Image */}
        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {item.title}
          </h4>
          {renderVariantInfo()}
          <p className="text-sm font-semibold text-gray-900">
            {formatPrice(item.price)}
          </p>
        </div>

        {/* Quantity and Remove */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-2 text-sm font-medium w-8 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1 text-gray-600 hover:bg-gray-100"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <button
            onClick={handleRemove}
            className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border p-4 transition-all duration-300 ${
      isRemoving ? 'opacity-50 transform scale-95' : 'opacity-100'
    }`}>
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {item.title}
              </h3>
              {renderVariantInfo()}
            </div>
            <button
              onClick={handleRemove}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            {/* Price */}
            <div>
              <p className="text-sm text-gray-600">Harga</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatPrice(item.price)}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Jumlah</p>
              <QuantitySelector
                quantity={item.quantity}
                onQuantityChange={handleQuantityChange}
                min={1}
                max={99}
              />
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
