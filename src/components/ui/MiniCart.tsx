"use client";

import { useRef, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import CartItem from './CartItem';
import { formatPrice } from '@/lib/utils';
import { X, ShoppingCart, ArrowRight } from 'lucide-react';

export default function MiniCart() {
  const { state, closeCart, toggleCart } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        closeCart();
      }
    };

    if (state.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [state.isOpen, closeCart]);

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeCart} />
      
      {/* Mini Cart Panel */}
      <div
        ref={cartRef}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              Keranjang ({state.totalItems})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">Keranjang masih kosong</p>
                <button
                  onClick={closeCart}
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  Lanjut Belanja
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {state.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={(id, quantity) => {
                      // This will be handled by the parent component
                      console.log('Update quantity:', id, quantity);
                    }}
                    onRemove={(id) => {
                      // This will be handled by the parent component
                      console.log('Remove item:', id);
                    }}
                    isCompact={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({state.totalItems} produk)</span>
                  <span>{formatPrice(state.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Ongkir</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(state.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    // Navigate to cart page
                    window.location.href = '/cart';
                  }}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Lihat Keranjang
                  <ArrowRight className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => {
                    // Navigate to checkout
                    window.location.href = '/checkout';
                  }}
                  className="w-full px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Checkout
                </button>
              </div>

              {/* Continue Shopping */}
              <button
                onClick={closeCart}
                className="w-full text-center text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm"
              >
                ← Lanjut Belanja
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
