"use client";

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentMethods from '@/components/payment/PaymentMethods';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function CheckoutPage() {
  const { state: cartState } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Keranjang Belanja Kosong
          </h1>
          <p className="text-gray-600 mb-8">
            Anda belum memiliki produk di keranjang belanja.
          </p>
          <a
            href="/marketplace"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Lanjut Belanja
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Lengkapi data diri Anda untuk menyelesaikan pesanan
          </p>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            <CheckoutForm 
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
            <PaymentMethods 
              selectedPayment={selectedPayment}
              onPaymentSelect={setSelectedPayment}
              totalAmount={cartState.totalPrice}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
