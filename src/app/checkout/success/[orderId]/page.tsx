import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage({ params }: { params: { orderId: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      {/* Success Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>

          {/* Success Message */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Pesanan Berhasil Dibuat!
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Terima kasih telah berbelanja di toko kami. Pesanan Anda sedang diproses.
          </p>

          {/* Order ID */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2 font-medium">Nomor Invoice</p>
            <p className="text-2xl font-bold text-gray-900">{params.orderId}</p>
          </div>

          {/* Next Steps */}
          <div className="text-left space-y-4 mb-10 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-3">Langkah Selanjutnya:</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1 text-xl">•</span>
                <span>Kami akan mengirimkan konfirmasi pesanan ke email Anda</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1 text-xl">•</span>
                <span>Barang akan dikirim dalam 1-3 hari kerja</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 mt-1 text-xl">•</span>
                <span>Anda dapat melacak status pesanan di halaman profil</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/user?tab=orders"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center text-lg"
            >
              Lihat Status Pesanan
            </a>
            <a
              href="/marketplace"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-semibold text-center text-lg"
            >
              Kembali Berbelanja
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
