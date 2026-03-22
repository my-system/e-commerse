"use client";

import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={handleDecrease}
        disabled={quantity <= min || disabled}
        className="p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Kurangi jumlah"
      >
        <Minus className="h-4 w-4" />
      </button>
      
      <input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        className="w-16 text-center border-0 focus:ring-0 focus:outline-none text-gray-900 font-medium disabled:bg-gray-50"
        aria-label="Jumlah produk"
      />
      
      <button
        onClick={handleIncrease}
        disabled={quantity >= max || disabled}
        className="p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Tambah jumlah"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
