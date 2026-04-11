"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discount_price?: number;
  images: string[];
  inStock: boolean;
}

interface BuyNowClientProps {
  product: Product;
  disabled?: boolean;
}

export default function BuyNowClient({ product, disabled = false }: BuyNowClientProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Create cart item
      const cartItem = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        title: product.title,
        price: product.discount_price || product.price,
        image: product.images[0],
        quantity,
        slug: product.slug
      };
      
      // Add to cart
      addItem(cartItem);
      
      // Wait a moment to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to checkout
      router.push('/checkout');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Terjadi kesalahan saat menambahkan produk ke keranjang');
    } finally {
      setIsLoading(false);
    }
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

      {/* Buy Now Button */}
      <button
        onClick={handleBuyNow}
        disabled={disabled || isLoading}
        className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Memproses...
          </>
        ) : (
          <>
            Beli Sekarang
          </>
        )}
      </button>
    </div>
  );
}
