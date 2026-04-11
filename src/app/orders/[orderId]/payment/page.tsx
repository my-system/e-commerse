"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Lock, Clock, Shield, Package, Truck, CreditCard } from 'lucide-react';

export default function OrderPaymentPage() {
  const router = useRouter();
  const params = useParams();
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);

  const orderId = params.orderId as string;

  useEffect(() => {
    if (!orderId) {
      router.push('/marketplace');
      return;
    }

    const fetchOrderData = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();

        if (data.success) {
          setOrderData(data.order);
        } else {
          console.error('Failed to fetch order:', data.error);
          alert('Gagal memuat data pesanan: ' + (data.error || 'Terjadi kesalahan'));
          router.push('/marketplace');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        alert('Terjadi kesalahan saat memuat data pesanan. Silakan coba lagi.');
        router.push('/marketplace');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, router]);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Update order status to PAID
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID' })
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart permanently
        clearCart();

        // Redirect to success page
        router.push(`/checkout/success/${orderId}`);
      } else {
        alert('Gagal memproses pembayaran: ' + (data.error || 'Terjadi kesalahan'));
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      alert('Terjadi kesalahan saat memproses pembayaran: ' + (error.message || 'Silakan coba lagi.'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  const subtotal = orderData.orderItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const shipping = orderData.shipping || 0;
  const tax = orderData.tax || 0;
  const serviceFee = 2000;
  const total = subtotal + shipping + tax + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Pembayaran Pesanan</h1>
          <p className="text-gray-600 mt-2">
            Pesanan ID: {params.orderId}
          </p>
        </div>
      </div>

      {/* Payment Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Payment Status */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Menunggu Pembayaran
            </h2>
            <p className="text-gray-600">
              Silakan selesaikan pembayaran dalam 24 jam
            </p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Metode Pembayaran</h3>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                    BCA
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Transfer Bank BCA</p>
                    <p className="text-sm text-gray-600">Virtual Account</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  className="w-5 h-5 text-blue-600"
                  defaultChecked
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-xs">
                    GoPay
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">GoPay</p>
                    <p className="text-sm text-gray-600">QRIS / GoPay Later</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  className="w-5 h-5 text-blue-600"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">
                    COD
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Bayar di Tempat (COD)</p>
                    <p className="text-sm text-gray-600">Bayar saat barang diterima</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  className="w-5 h-5 text-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Tagihan</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Biaya Kirim</span>
                <span className="font-medium text-gray-900">Rp {shipping.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Biaya Layanan</span>
                <span className="font-medium text-gray-900">Rp {serviceFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pajak (PPN 11%)</span>
                <span className="font-medium text-gray-900">Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total Tagihan</span>
                  <span className="text-xl font-bold text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Produk yang Dibeli</h3>
            <div className="space-y-3">
              {orderData.orderItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Produk #{item.productId}</p>
                      <p className="text-xs text-gray-600">Jumlah: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900 text-sm">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full px-6 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Memproses Pembayaran...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Bayar Sekarang</span>
              </>
            )}
          </button>

          {/* Trust Indicators */}
          <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center">
              <Lock className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-xs text-gray-600">Pembayaran Aman</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Shield className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-xs text-gray-600">Proteksi Data</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-xs text-gray-600">Proses Cepat</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
