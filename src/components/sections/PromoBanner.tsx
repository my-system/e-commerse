import { ArrowRight, Tag, Clock, Truck } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Tag className="h-4 w-4 mr-2" />
              PROMO EKSKLUSIF
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Diskon Hingga
              <br />
              <span className="text-transparent bg-clip-text bg-yellow-400">
                50% OFF
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Dapatkan penawaran terbaik untuk koleksi pilihan. Waktu terbatas, jangan lewatkan kesempatan emas ini!
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <span className="text-white">Berlaku hingga 31 Maret 2024</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <span className="text-white">Gratis pengiriman untuk pembelian di atas Rp 500.000</span>
              </div>
            </div>

            {/* CTA Button */}
            <button className="group px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center">
              Klaim Promo Sekarang
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            {/* Main Promo Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm transform rotate-12">
                LIMITED TIME
              </div>
              
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-900 mb-2">50%</div>
                <div className="text-xl text-gray-600 mb-4">OFF</div>
                <div className="text-lg font-semibold text-gray-800 mb-6">
                  Semua Produk Fashion
                </div>
                <div className="space-y-2 text-gray-600">
                  <div className="line-through text-gray-400">Rp 1.999.000</div>
                  <div className="text-2xl font-bold text-green-600">Rp 999.500</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-8 -left-8 bg-yellow-400 rounded-full p-4 shadow-lg animate-bounce">
              <span className="text-2xl">🎉</span>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-full p-3 shadow-lg animate-pulse">
              <span className="text-xl">⭐</span>
            </div>
          </div>
        </div>

        {/* Additional Promo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors duration-300">
            <div className="text-white mb-4">
              <div className="text-3xl font-bold">Gratis</div>
              <div className="text-lg">Ongkir</div>
            </div>
            <p className="text-white/80 text-sm">
              Min. pembelian Rp 500.000
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors duration-300">
            <div className="text-white mb-4">
              <div className="text-3xl font-bold">2X</div>
              <div className="text-lg">Poin</div>
            </div>
            <p className="text-white/80 text-sm">
              Untuk member premium
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors duration-300">
            <div className="text-white mb-4">
              <div className="text-3xl font-bold">30%</div>
              <div className="text-lg">Cashback</div>
            </div>
            <p className="text-white/80 text-sm">
              Menggunakan e-wallet
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
