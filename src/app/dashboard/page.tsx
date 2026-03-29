export default function DashboardPage() {
  return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Selamat datang di dashboard e-commerce Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Penjualan</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">Rp 45.231.890</p>
            <p className="text-sm text-green-600 mt-2">+12.5% dari bulan lalu</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Pesanan</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">1,234</p>
            <p className="text-sm text-green-600 mt-2">+8.2% dari bulan lalu</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Produk</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">89</p>
            <p className="text-sm text-blue-600 mt-2">+3 produk baru</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Pelanggan</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">5,678</p>
            <p className="text-sm text-green-600 mt-2">+23.1% dari bulan lalu</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pesanan Terbaru</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">#{item}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pesanan #{item}</p>
                      <p className="text-sm text-gray-500">2 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">Rp 450.000</p>
                    <p className="text-sm text-green-600">Selesai</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terkini</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Produk baru ditambahkan</p>
                  <p className="text-xs text-gray-500">5 menit yang lalu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Pesanan #1234 selesai</p>
                  <p className="text-xs text-gray-500">1 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Stok produk hampir habis</p>
                  <p className="text-xs text-gray-500">2 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">Pembatalan pesanan #1230</p>
                  <p className="text-xs text-gray-500">3 jam yang lalu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
