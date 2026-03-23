"use client";

import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MobileNavigation } from '@/components/MobileNavigation';
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
        {/* Desktop Version */}
        <div className="hidden md:block">
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

        {/* Mobile Version */}
        <div className="md:hidden">
          <MobileNavigation>
            <div className="px-4 py-16">
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
          </MobileNavigation>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Version */}
      <div className="hidden md:block">
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg">
                {state.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(state.totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Kirim</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-blue-600">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                {shippingCost > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Gratis ongkir untuk pembelian Rp 500.000+
                        </p>
                        <p className="text-xs text-green-600">
                          Tambah {formatPrice(500000 - state.totalPrice)} lagi
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    Checkout
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={handleContinueShopping}
                    className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Lanjut Belanja
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileNavigation>
          {/* Page Header */}
          <div className="bg-white border-b">
            <div className="px-4 py-6">
              <h1 className="text-2xl font-bold text-gray-900">Keranjang Belanja</h1>
              <p className="text-gray-600 mt-1">
                {state.totalItems} {state.totalItems === 1 ? 'produk' : 'produk'} di keranjang Anda
              </p>
            </div>
          </div>

          <div className="px-4 py-8">
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="bg-white rounded-lg">
                {state.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(state.totalPrice)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Kirim</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                    </span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-blue-600">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                {shippingCost > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Gratis ongkir untuk pembelian Rp 500.000+
                        </p>
                        <p className="text-xs text-green-600">
                          Tambah {formatPrice(500000 - state.totalPrice)} lagi
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    Checkout
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={handleContinueShopping}
                    className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Lanjut Belanja
                  </button>
                </div>
              </div>
            </div>
          </div>
        </MobileNavigation>
      </div>
    </div>
  );
}
