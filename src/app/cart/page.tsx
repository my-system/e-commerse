"use client";

import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartItem from '@/components/ui/CartItem';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { state, updateQuantity, removeItem, clearCart } = useCart();

  const handleCheckout = () => {
    // Navigate to checkout page (will be created later)
    console.log('Proceeding to checkout...');
    // router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/shop');
  };

  const shippingCost = state.totalPrice >= 500000 ? 0 : 15000;
  const finalTotal = state.totalPrice + shippingCost;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Empty State */}
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Keranjang Masih Kosong
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Belum ada produk di keranjang Anda. Yuk, temukan produk favorit Anda!
            </p>
            
            <button
              onClick={handleContinueShopping}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <ArrowRight className="h-5 w-5" />
              Belanja Sekarang
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
          <p className="text-gray-600 mt-1">
            {state.totalItems} {state.totalItems === 1 ? 'produk' : 'produk'} di keranjang Anda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Clear Cart Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Daftar Produk</h2>
              <button
                onClick={() => {
                  if (window.confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
                    clearCart();
                  }
                }}
                className="text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
              >
                Kosongkan Keranjang
              </button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {state.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6 text-center">
              <button
                onClick={handleContinueShopping}
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                ← Lanjut Belanja
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Ringkasan Belanja</h2>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({state.totalItems} produk)</span>
                  <span>{formatPrice(state.totalPrice)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Ongkir</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                
                {state.totalPrice < 500000 && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    🎉 Tambah {formatPrice(500000 - state.totalPrice)} lagi untuk gratis ongkir!
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Promo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan kode promo"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    Terapkan
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Lanjut ke Checkout
                <ArrowRight className="h-5 w-5" />
              </button>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>Pengiriman aman & terpercaya</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Pembayaran 100% aman</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <RefreshCw className="h-4 w-4" />
                  <span>Pengembalian mudah</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
