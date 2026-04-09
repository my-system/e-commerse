"use client";

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discount_price?: number;
  images: string[];
}

interface AddToCartClientProps {
  product: Product;
  disabled?: boolean;
}

export default function AddToCartClient({ product, disabled = false }: AddToCartClientProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    
    const cartItem = {
      id: `${product.id}-${quantity}`,
      productId: product.id,
      title: product.title,
      price: product.discount_price || product.price,
      image: product.images[0],
      quantity,
      slug: product.slug
    };
    
    addItem(cartItem);
    
    // Show success message
    alert(`${product.title} x${quantity} ditambahkan ke keranjang!`);
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-3">
      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-900">Jumlah</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={disabled || quantity <= 1}
            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="w-12 text-center font-medium">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={disabled}
            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={disabled || isLoading}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <ShoppingCart className="h-5 w-5" />
        {isLoading ? 'Menambahkan...' : (disabled ? 'Stok Habis' : 'Tambah ke Keranjang')}
      </button>
    </div>
  );
}
