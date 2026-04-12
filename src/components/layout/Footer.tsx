import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ChevronRight
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-24">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Main Footer Content */}
        <div className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-3xl font-bold mb-4">LUXE</h3>
              <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                Toko fashion premium dengan koleksi terkini. Kami menyediakan produk berkualitas tinggi dengan desain modern dan timeless.
              </p>

              {/* Social Media */}
              <div className="flex space-x-3">
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Link Cepat</h4>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center text-sm">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center text-sm">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Semua Produk
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center text-sm">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Promo
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center text-sm">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center text-sm">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Karir
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Layanan Pelanggan</h4>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center text-sm">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Bantuan
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center text-sm">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Pengiriman
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center text-sm">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Pengembalian
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center text-sm">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Ukuran
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center text-sm">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Track Order
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-gray-400 text-sm">Telepon</div>
                    <div className="text-white text-sm">+62 21 1234 5678</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-gray-400 text-sm">Email</div>
                    <div className="text-white text-sm">support@luxe.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-gray-400 text-sm">Alamat</div>
                    <div className="text-white text-sm">Jakarta, Indonesia</div>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-3">
                <h5 className="text-sm font-semibold mb-2">Newsletter</h5>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Email Anda"
                    className="flex-1 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-r-lg hover:bg-blue-700 transition-colors duration-200">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 LUXE. All rights reserved. Made with ❤️ in Indonesia
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
