import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pusat Bantuan</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Temukan jawaban untuk pertanyaan yang sering diajukan atau hubungi tim support kami.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pembelian</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Bagaimana cara membeli produk?</h3>
              <p className="text-gray-600 text-sm">Pilih produk yang diinginkan, klik "Tambah ke Keranjang", lalu checkout dan selesaikan pembayaran.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Metode pembayaran apa saja yang tersedia?</h3>
              <p className="text-gray-600 text-sm">Kami menerima transfer bank, e-wallet, dan kartu kredit/debit.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Bagaimana jika produk tidak sesuai?</h3>
              <p className="text-gray-600 text-sm">Anda bisa mengajukan pengembalian dalam 7 hari setelah barang diterima.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Penjualan</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Bagaimana cara menjadi penjual?</h3>
              <p className="text-gray-600 text-sm">Daftar akun seller, verifikasi identitas, dan mulai upload produk Anda.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Bagaimana cara mengelola stok?</h3>
              <p className="text-gray-600 text-sm">Gunakan dashboard seller untuk memantau dan mengatur stok produk secara real-time.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Kapan pembayaran akan diterima?</h3>
              <p className="text-gray-600 text-sm">Pembayaran akan diproses 2-3 hari setelah pembeli menerima barang.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Akun</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Bagaimana cara reset password?</h3>
              <p className="text-gray-600 text-sm">Klik "Lupa Password" di halaman login dan ikuti instruksi yang dikirim ke email Anda.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Bisakah saya memiliki beberapa akun?</h3>
              <p className="text-gray-600 text-sm">Setiap pengguna hanya boleh memiliki satu akun untuk mencegah penyalahgunaan.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Bagaimana cara mengubah data profil?</h3>
              <p className="text-gray-600 text-sm">Masuk ke menu "Profil Saya" di dashboard akun untuk mengubah informasi pribadi.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pengiriman</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Berapa lama waktu pengiriman?</h3>
              <p className="text-gray-600 text-sm">Waktu pengiriman bervariasi 1-7 hari tergantung lokasi dan kurir yang dipilih.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Bagaimana cara melacak pesanan?</h3>
              <p className="text-gray-600 text-sm">Gunakan nomor resi yang dikirim ke email untuk melacak status pengiriman.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Apakah ada pengiriman internasional?</h3>
              <p className="text-gray-600 text-sm">Saat ini kami hanya melayani pengiriman domestik dalam wilayah Indonesia.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Masih Butuh Bantuan?</h2>
        <p className="text-gray-600 mb-6">
          Tim support kami siap membantu Anda 24/7 melalui berbagai kanal komunikasi.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:support@demo-ecommerce.com"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Email Support
          </a>
          <a
            href="tel:+628123456789"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            +62 812-3456-789
          </a>
          <Link
            href="/about"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Tentang Kami
          </Link>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kategori Bantuan</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {['Pembayaran', 'Pengiriman', 'Pengembalian', 'Akun', 'Seller', 'Teknis'].map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
