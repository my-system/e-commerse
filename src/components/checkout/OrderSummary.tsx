"use client";

import { useCart } from '@/contexts/CartContext';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderSummaryProps {
  shippingMethod?: string;
  hasInsurance?: boolean;
  onShippingMethodChange?: (method: string) => void;
  onInsuranceChange?: (hasInsurance: boolean) => void;
  isSubmitting?: boolean;
  setIsSubmitting?: (isSubmitting: boolean) => void;
  selectedPayment?: string | null;
  onPlaceOrder?: () => Promise<void>;
}

const shippingCosts: { [key: string]: number } = {
  regular: 20000,
  express: 40000,
  free: 0
};

export default function OrderSummary({ 
  shippingMethod = 'regular', 
  hasInsurance = false,
  onShippingMethodChange,
  onInsuranceChange,
  isSubmitting = false,
  setIsSubmitting,
  selectedPayment,
  onPlaceOrder
}: OrderSummaryProps) {
  const { state: cartState } = useCart();

  const subtotal = cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = shippingCosts[shippingMethod] || 20000;
  const insuranceCost = hasInsurance ? 5000 : 0;
  const tax = Math.round(subtotal * 0.11);
  const serviceFee = 2000; // Biaya layanan
  const total = subtotal + shippingCost + insuranceCost + tax + serviceFee;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24 transition-all duration-300">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Ringkasan Pesanan
      </h2>

      {/* Product List */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {cartState.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <img
              src={item.image}
              alt={item.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600">
                {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
              </p>
            </div>
            
            <div className="text-sm font-medium text-gray-900">
              Rp {(item.price * item.quantity).toLocaleString('id-ID')}
            </div>
          </div>
        ))}
      </div>

      {/* Order Details */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            Rp {subtotal.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Biaya Kirim</span>
          <span className="font-medium text-gray-900">
            Rp {shippingCost.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Biaya Layanan</span>
          <span className="font-medium text-gray-900">
            Rp {serviceFee.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Pajak (PPN 11%)</span>
          <span className="font-medium text-gray-900">
            Rp {tax.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-gray-900">Total Tagihan</span>
            <span className="text-xl font-bold text-blue-600">
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onPlaceOrder}
        disabled={isSubmitting || !selectedPayment}
        className="w-full px-6 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Memproses...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Buat Pesanan</span>
          </>
        )}
      </button>

      {/* Promo Code */}
      <div className="mt-6">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Masukkan kode promo"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
          />
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
          >
            Terapkan
          </button>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
          <span>🔒</span>
          <span>Pembayaran aman & terenkripsi</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
          <span>✔️</span>
          <span>Garansi uang kembali</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
          <span>🚚</span>
          <span>Pengiriman cepat & terpercaya</span>
        </div>
      </div>
    </div>
  );
}
