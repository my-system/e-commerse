"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import { useAuth } from '@/contexts/AuthContext';
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
  X,
  UserCircle
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
  const { user, isLoggedIn, logout } = useAuth();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggingOut(false);
      closeSidebar();
      logout();
      // Force page reload to ensure UI updates properly
      window.location.href = '/';
    }, 1000);
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
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 group"
      >
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ${
            active 
              ? 'bg-blue-50 text-blue-600' 
              : item.isDangerous
                ? 'bg-red-50 text-red-600 group-hover:bg-red-100'
                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
          }`}>
            <item.icon className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className={`font-medium transition-colors duration-200 ${
              active 
                ? 'text-blue-600' 
                : item.isDangerous
                  ? 'text-red-600'
                  : 'text-gray-900 group-hover:text-blue-600'
            }`}>
              {item.label}
            </h4>
            <p className="text-sm text-gray-500">
              {item.description}
            </p>
            {item.badge && (
              <span className="inline-block mt-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                {item.badge}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 transition-colors duration-200 ${
          active 
            ? 'text-blue-600' 
            : 'text-gray-400 group-hover:text-blue-600'
        }`} />
      </Link>
    );
  };

  const renderMenuSection = (section: MenuSection) => (
    <div key={section.title} className="mb-6">
      <div className="px-6 py-3 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {section.title}
        </h3>
        {section.description && (
          <p className="text-xs text-gray-400 mt-1">{section.description}</p>
        )}
      </div>
      
      <div className="py-2">
        {section.items.map(renderMenuItem)}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-[350px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">DEMO WEB E-COMMERCE</h2>
              <button
                onClick={closeSidebar}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <UserCircle className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user?.name || 'John Doe'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {user?.email || 'demo@example.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto py-2">
              {/* Role Switcher - FOR TESTING */}
              <div className="mx-6 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
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
                <div className="px-6 py-3 border-b border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    NAVIGASI UTAMA
                  </h3>
                </div>
                <div className="py-2">
                  {mainNavigation.map(renderMenuItem)}
                </div>
              </div>

              {/* Role-based Menus */}
              {roleBasedMenus[userRole]?.map(renderMenuSection)}

              {/* Informasi */}
              {renderMenuSection(infoSection)}
            </div>

            {/* Logout Section */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-between px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:text-red-700 transition-colors duration-200" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
