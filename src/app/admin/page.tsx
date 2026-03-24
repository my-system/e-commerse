"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Package, ShoppingCart, BarChart3, ChevronRight } from 'lucide-react';

export default function AdminPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    if (!isLoggedIn || user?.role !== 'admin') {
      router.push('/access-denied');
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || user?.role !== 'admin') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Mobile Version */}
        <div className="md:hidden">
          <MobileNavigation>
            <div className="px-4 py-6">
              {/* Mobile Admin Header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <h1 className="text-xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Kelola toko dan produk Anda</p>
                
                {/* Mobile Admin Stats */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">Total Produk</p>
                    <p className="text-lg font-bold text-blue-900">156</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">Pesanan</p>
                    <p className="text-lg font-bold text-green-900">89</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-purple-600 font-medium">Pendapatan</p>
                    <p className="text-lg font-bold text-purple-900">Rp 45M</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-xs text-orange-600 font-medium">Pelanggan</p>
                    <p className="text-lg font-bold text-orange-900">1.2K</p>
                  </div>
                </div>
              </div>

              {/* Mobile Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
                <div className="space-y-3">
                  <Link
                    href="/admin/products"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Kelola Produk</p>
                        <p className="text-xs text-gray-500">Tambah & edit produk</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  
                  <Link
                    href="/admin/orders"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Kelola Pesanan</p>
                        <p className="text-xs text-gray-500">Proses & kirim</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  
                  <Link
                    href="/analytics"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Lihat Analytics</p>
                        <p className="text-xs text-gray-500">Laporan penjualan</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </div>
              </div>

              {/* Mobile Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900">Pesanan Terbaru</h2>
                  <Link
                    href="/admin/orders"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Lihat Semua
                  </Link>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">Order #12345</p>
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Dikirim
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">2 produk • Rp 500.000</p>
                    <p className="text-xs text-gray-500 mt-1">2 jam lalu</p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">Order #12346</p>
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Diproses
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">1 produk • Rp 250.000</p>
                    <p className="text-xs text-gray-500 mt-1">5 jam lalu</p>
                  </div>
                </div>
              </div>
            </div>
          </MobileNavigation>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <AdminDashboard />
        </div>
      </div>
    </div>
  );
}
