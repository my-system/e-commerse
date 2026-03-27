"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import { 
  Home, 
  ShoppingCart, 
  User, 
  Package, 
  Heart, 
  Settings, 
  Store, 
  Plus, 
  PackageOpen, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from 'lucide-react';

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  description: string;
  badge?: string;
  isDangerous?: boolean;
}

interface MenuSection {
  title: string;
  description?: string;
  items: MenuItem[];
}

export default function DesktopSidebar() {
  const { userRole, setUserRole } = useSidebar();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Navigasi Utama (selalu tampil untuk semua role)
  const mainNavigation: MenuItem[] = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
      description: 'Halaman utama'
    },
    {
      icon: Package,
      label: 'Marketplace',
      href: '/marketplace',
      description: 'Semua produk (multi-vendor)'
    },
    {
      icon: ShoppingCart,
      label: 'Keranjang',
      href: '/cart',
      description: 'Halaman cart'
    }
  ];

  // Menu berdasarkan role
  const roleBasedMenus: Record<string, MenuSection[]> = {
    user: [
      {
        title: 'AKUN SAYA',
        description: 'Area untuk aktivitas pengguna',
        items: [
          {
            icon: User,
            label: 'Profil Saya',
            href: '/account/profile',
            description: 'Kelola informasi profil Anda'
          },
          {
            icon: Package,
            label: 'Pesanan Saya',
            href: '/account/orders',
            description: 'Lihat riwayat pesanan Anda'
          },
          {
            icon: Heart,
            label: 'Wishlist',
            href: '/account/wishlist',
            description: 'Produk yang Anda simpan'
          },
          {
            icon: Settings,
            label: 'Pengaturan',
            href: '/account/settings',
            description: 'Pengaturan akun dan privasi'
          }
        ]
      },
      {
        title: 'TOKO SAYA',
        description: 'Khusus user yang ingin jualan',
        items: [
          {
            icon: Store,
            label: 'Dashboard Toko',
            href: '/seller/dashboard',
            description: 'Ringkasan performa toko'
          },
          {
            icon: Package,
            label: 'Produk Saya',
            href: '/seller/products',
            description: 'Daftar semua produk'
          },
          {
            icon: Plus,
            label: 'Tambah Produk',
            href: '/seller/products/create',
            description: 'Form upload produk',
            badge: 'WAJIB'
          },
          {
            icon: PackageOpen,
            label: 'Pesanan Masuk',
            href: '/seller/orders',
            description: 'Order dari pembeli'
          },
          {
            icon: BarChart3,
            label: 'Manajemen Stok',
            href: '/seller/inventory',
            description: 'Kontrol inventory'
          },
          {
            icon: TrendingUp,
            label: 'Statistik Penjualan',
            href: '/seller/analytics',
            description: 'Data penjualan'
          }
        ]
      },
      {
        title: 'ADMIN PANEL',
        description: 'Tidak tampil untuk user biasa',
        items: [
          {
            icon: Shield,
            label: 'Kelola Produk',
            href: '/admin/products',
            description: 'Manajemen produk global'
          },
          {
            icon: Package,
            label: 'Inventory',
            href: '/admin/inventory',
            description: 'Kontrol inventory sistem'
          },
          {
            icon: BarChart3,
            label: 'Analytics',
            href: '/admin/analytics',
            description: 'Data analytics sistem'
          },
          {
            icon: Users,
            label: 'Kelola User',
            href: '/admin/users',
            description: 'Manajemen pengguna'
          },
          {
            icon: Store,
            label: 'Kontrol Marketplace',
            href: '/admin/marketplace',
            description: 'Pengaturan marketplace'
          }
        ]
      }
    ],
    seller: [
      {
        title: 'AKUN SAYA',
        description: 'Area untuk aktivitas pengguna',
        items: [
          {
            icon: User,
            label: 'Profil Saya',
            href: '/account/profile',
            description: 'Kelola informasi profil Anda'
          },
          {
            icon: Package,
            label: 'Pesanan Saya',
            href: '/account/orders',
            description: 'Lihat riwayat pesanan Anda'
          },
          {
            icon: Heart,
            label: 'Wishlist',
            href: '/account/wishlist',
            description: 'Produk yang Anda simpan'
          },
          {
            icon: Settings,
            label: 'Pengaturan',
            href: '/account/settings',
            description: 'Pengaturan akun dan privasi'
          }
        ]
      },
      {
        title: 'TOKO SAYA',
        description: 'Khusus user yang ingin jualan',
        items: [
          {
            icon: Store,
            label: 'Dashboard Toko',
            href: '/seller/dashboard',
            description: 'Ringkasan performa toko'
          },
          {
            icon: Package,
            label: 'Produk Saya',
            href: '/seller/products',
            description: 'Daftar semua produk'
          },
          {
            icon: Plus,
            label: 'Tambah Produk',
            href: '/seller/products/create',
            description: 'Form upload produk',
            badge: 'WAJIB'
          },
          {
            icon: PackageOpen,
            label: 'Pesanan Masuk',
            href: '/seller/orders',
            description: 'Order dari pembeli'
          },
          {
            icon: BarChart3,
            label: 'Manajemen Stok',
            href: '/seller/inventory',
            description: 'Kontrol inventory'
          },
          {
            icon: TrendingUp,
            label: 'Statistik Penjualan',
            href: '/seller/analytics',
            description: 'Data penjualan'
          }
        ]
      }
    ],
    admin: [
      {
        title: 'AKUN SAYA',
        description: 'Area untuk aktivitas pengguna',
        items: [
          {
            icon: User,
            label: 'Profil Saya',
            href: '/account/profile',
            description: 'Kelola informasi profil Anda'
          },
          {
            icon: Package,
            label: 'Pesanan Saya',
            href: '/account/orders',
            description: 'Lihat riwayat pesanan Anda'
          },
          {
            icon: Heart,
            label: 'Wishlist',
            href: '/account/wishlist',
            description: 'Produk yang Anda simpan'
          },
          {
            icon: Settings,
            label: 'Pengaturan',
            href: '/account/settings',
            description: 'Pengaturan akun dan privasi'
          }
        ]
      },
      {
        title: 'TOKO SAYA',
        description: 'Khusus user yang ingin jualan',
        items: [
          {
            icon: Store,
            label: 'Dashboard Toko',
            href: '/seller/dashboard',
            description: 'Ringkasan performa toko'
          },
          {
            icon: Package,
            label: 'Produk Saya',
            href: '/seller/products',
            description: 'Daftar semua produk'
          },
          {
            icon: Plus,
            label: 'Tambah Produk',
            href: '/seller/products/create',
            description: 'Form upload produk',
            badge: 'WAJIB'
          },
          {
            icon: PackageOpen,
            label: 'Pesanan Masuk',
            href: '/seller/orders',
            description: 'Order dari pembeli'
          },
          {
            icon: BarChart3,
            label: 'Manajemen Stok',
            href: '/seller/inventory',
            description: 'Kontrol inventory'
          },
          {
            icon: TrendingUp,
            label: 'Statistik Penjualan',
            href: '/seller/analytics',
            description: 'Data penjualan'
          }
        ]
      },
      {
        title: 'ADMIN PANEL',
        description: 'Tidak tampil untuk user biasa',
        items: [
          {
            icon: Shield,
            label: 'Kelola Produk',
            href: '/admin/products',
            description: 'Manajemen produk global'
          },
          {
            icon: Package,
            label: 'Inventory',
            href: '/admin/inventory',
            description: 'Kontrol inventory sistem'
          },
          {
            icon: BarChart3,
            label: 'Analytics',
            href: '/admin/analytics',
            description: 'Data analytics sistem'
          },
          {
            icon: Users,
            label: 'Kelola User',
            href: '/admin/users',
            description: 'Manajemen pengguna'
          },
          {
            icon: Store,
            label: 'Kontrol Marketplace',
            href: '/admin/marketplace',
            description: 'Pengaturan marketplace'
          }
        ]
      }
    ]
  };

  const currentMenu = roleBasedMenus[userRole] || roleBasedMenus.user;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <h2 className="text-lg font-bold">DEMO WEB E-COMMERSE</h2>
        <p className="text-xs text-blue-100 mt-1">by yusuf</p>
        
        {/* Role Switcher */}
        <div className="mt-4">
          <label className="text-xs text-blue-100 block mb-1">Current Role:</label>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as any)}
            className="w-full px-2 py-1 text-sm bg-blue-700 text-white border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="p-4">
        {/* Main Navigation */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            NAVIGASI UTAMA
          </h3>
          <nav className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    active
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1">
                    <div>{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Role-based Menus */}
        {currentMenu.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            {section.description && (
              <p className="text-xs text-gray-500 mb-3">{section.description}</p>
            )}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      active
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : item.isDangerous
                        ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1">
                      <div>{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Information Section */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            INFORMASI
          </h3>
          <nav className="space-y-1">
            <Link
              href="/tentang"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive('/tentang')
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <HelpCircle className="h-4 w-4 flex-shrink-0" />
              <div className="flex-1">
                <div>Tentang</div>
                <div className="text-xs text-gray-500">Informasi tentang platform</div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>
          </nav>
        </div>

        {/* Logout Section */}
        <div className="pt-4 border-t border-gray-200">
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div>Logout</div>
              <div className="text-xs text-red-500">Keluar dari akun</div>
            </div>
            <ChevronRight className="h-4 w-4 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
