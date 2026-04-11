"use client";

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import CheckoutAddressSection from '@/components/checkout/CheckoutAddressSection';
import CheckoutProductList from '@/components/checkout/CheckoutProductList';
import CheckoutShippingCards from '@/components/checkout/CheckoutShippingCards';
import CheckoutPaymentAccordion from '@/components/checkout/CheckoutPaymentAccordion';
import OrderSummary from '@/components/checkout/OrderSummary';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function CheckoutPage() {
  const { state: cartState } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState('regular');
  const [hasInsurance, setHasInsurance] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  const handlePlaceOrder = async () => {
    if (!selectedPayment) {
      alert('Silakan pilih metode pembayaran');
      return;
    }

    if (!selectedAddress) {
      alert('Silakan pilih alamat pengiriman');
      return;
    }

    setIsSubmitting(true);

    try {
      const shippingCosts: { [key: string]: number } = {
        regular: 20000,
        express: 40000,
        free: 0
      };
      const shippingCost = shippingCosts[shippingMethod] || 20000;
      const subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = Math.round(subtotal * 0.11);
      const insuranceCost = hasInsurance ? 5000 : 0;
      const serviceFee = 2000;
      const total = subtotal + shippingCost + insuranceCost + tax + serviceFee;

      console.log('Sending order request...');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          fullName: selectedAddress.fullName,
          email: user?.email,
          phone: selectedAddress.phoneNumber,
          address: selectedAddress.address,
          city: selectedAddress.city,
          province: selectedAddress.province,
          postalCode: selectedAddress.postalCode,
          shippingMethod,
          paymentMethod: selectedPayment,
          items: cartState.items.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingCost,
          insuranceCost,
          tax,
          total
        })
      });

      const data = await response.json();
      console.log('Order API response:', data);

      if (data.success) {
        console.log('Redirecting to payment page:', `/orders/${data.order.id}/payment`);
        router.push(`/orders/${data.order.id}/payment`);
      } else {
        console.error('Order creation failed:', data.error);
        alert('Gagal membuat pesanan: ' + (data.error || 'Terjadi kesalahan'));
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      alert('Terjadi kesalahan saat memproses pesanan: ' + (error.message || 'Silakan coba lagi.'));
      setIsSubmitting(false);
    }
  };

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
          {/* Left Column - Form Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Alamat Pengiriman */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Alamat Pengiriman</h2>
              </div>
              <CheckoutAddressSection onAddressSelect={setSelectedAddress} />
            </div>

            {/* Section 2: Produk yang Dibeli */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Produk yang Dibeli</h2>
              </div>
              <CheckoutProductList items={cartState.items} />
            </div>

            {/* Section 3: Metode Pengiriman */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Metode Pengiriman</h2>
              </div>
              <CheckoutShippingCards 
                selectedMethod={shippingMethod}
                onMethodChange={setShippingMethod}
              />
            </div>

            {/* Section 4: Metode Pembayaran */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Metode Pembayaran</h2>
              </div>
              <CheckoutPaymentAccordion 
                selectedPayment={selectedPayment}
                onPaymentSelect={setSelectedPayment}
                totalAmount={cartState.totalPrice}
              />
            </div>
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <OrderSummary 
                shippingMethod={shippingMethod}
                hasInsurance={hasInsurance}
                onShippingMethodChange={setShippingMethod}
                onInsuranceChange={setHasInsurance}
                isSubmitting={isSubmitting}
                onPlaceOrder={handlePlaceOrder}
                selectedPayment={selectedPayment}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
