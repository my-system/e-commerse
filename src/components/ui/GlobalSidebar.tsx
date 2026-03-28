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
  ChevronRight,
  X
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

export default function GlobalSidebar() {
  const { isSidebarOpen, closeSidebar, userRole, setUserRole } = useSidebar();
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

  const infoSection: MenuSection = {
    title: 'INFORMASI',
    items: [
      {
        icon: HelpCircle,
        label: 'Tentang Kami',
        href: '/about',
        description: 'Kenali lebih tentang kami'
      },
      {
        icon: HelpCircle,
        label: 'Bantuan',
        href: '/help',
        description: 'Pusat bantuan dan dukungan'
      }
    ]
  };

  const logoutItem: MenuItem = {
    icon: LogOut,
    label: 'Logout',
    href: '/logout',
    description: 'Keluar dari sistem',
    isDangerous: true
  };

  const renderMenuItem = (item: MenuItem) => {
    const active = isActive(item.href);
    
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={closeSidebar}
        className={`
          group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
          ${active 
            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
            : item.isDangerous
              ? 'text-red-600 hover:bg-red-50'
              : 'text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        <item.icon className={`
          w-5 h-5 flex-shrink-0
          ${active 
            ? 'text-blue-600' 
            : item.isDangerous
              ? 'text-red-600'
              : 'text-gray-400 group-hover:text-gray-600'
          }
        `} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium truncate">{item.label}</div>
            {item.badge && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                {item.badge}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 truncate">{item.description}</div>
        </div>
        
        <ChevronRight className={`
          w-4 h-4 flex-shrink-0
          ${active 
            ? 'text-blue-600' 
            : 'text-gray-400 group-hover:text-gray-600'
          }
        `} />
      </Link>
    );
  };

  const renderMenuSection = (section: MenuSection) => (
    <div key={section.title} className="mb-6">
      <div className="px-4 py-2 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {section.title}
        </h3>
        {section.description && (
          <p className="text-xs text-gray-400 mt-1">{section.description}</p>
        )}
      </div>
      
      <div className="py-2 space-y-1">
        {section.items.map(renderMenuItem)}
      </div>
    </div>
  );

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={closeSidebar}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-80 max-w-[80vw]
        overflow-y-auto
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-blue-600 text-white z-10 px-4 py-4 border-b border-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold">DEMO WEB E-COMMERSE</h1>
              <p className="text-xs text-blue-100">by yusuf</p>
            </div>
            <button
              onClick={closeSidebar}
              className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              aria-label="Tutup sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 p-4">
          {/* Role Switcher - FOR TESTING */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs font-semibold text-yellow-800 mb-2">TESTING - GANTI ROLE:</p>
            <div className="flex gap-2">
              <button
                onClick={() => setUserRole('user')}
                className={`px-3 py-1 text-xs rounded ${
                  userRole === 'user' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                User
              </button>
              <button
                onClick={() => setUserRole('seller')}
                className={`px-3 py-1 text-xs rounded ${
                  userRole === 'seller' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Seller
              </button>
              <button
                onClick={() => setUserRole('admin')}
                className={`px-3 py-1 text-xs rounded ${
                  userRole === 'admin' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                Admin
              </button>
            </div>
            <p className="text-xs text-yellow-600 mt-2">Current: {userRole}</p>
          </div>

          {/* Navigasi Utama */}
          <div className="mb-6">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                NAVIGASI UTAMA
              </h3>
            </div>
            <div className="py-2 space-y-1">
              {mainNavigation.map(renderMenuItem)}
            </div>
          </div>

          {/* Role-based Menus */}
          {roleBasedMenus[userRole]?.map(renderMenuSection)}

          {/* Informasi */}
          {renderMenuSection(infoSection)}

          {/* Logout */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {renderMenuItem(logoutItem)}
          </div>
        </div>
      </div>
    </>
  );
}
