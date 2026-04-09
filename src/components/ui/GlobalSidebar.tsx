"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import { useSession, signOut } from 'next-auth/react';
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
  LogIn,
  ChevronRight,
  X,
  UserCircle,
  Database,
  Monitor
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
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleAuthAction = () => {
    if (status === 'authenticated') {
      // If logged in, go to account page
      closeSidebar();
      router.push('/user');
    } else {
      // If not logged in, go to login page
      closeSidebar();
      router.push('/login');
    }
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
            href: '/user/profile',
            description: 'Kelola informasi profil Anda'
          },
          {
            icon: Package,
            label: 'Pesanan Saya',
            href: '/user/orders',
            description: 'Lihat riwayat pesanan Anda'
          },
          {
            icon: Heart,
            label: 'Wishlist',
            href: '/user/wishlist',
            description: 'Produk yang Anda simpan'
          },
          {
            icon: Settings,
            label: 'Pengaturan',
            href: '/user/settings',
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
            href: '/user/profile',
            description: 'Kelola informasi profil Anda'
          },
          {
            icon: Package,
            label: 'Pesanan Saya',
            href: '/user/orders',
            description: 'Lihat riwayat pesanan Anda'
          },
          {
            icon: Heart,
            label: 'Wishlist',
            href: '/user/wishlist',
            description: 'Produk yang Anda simpan'
          },
          {
            icon: Settings,
            label: 'Pengaturan',
            href: '/user/settings',
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
            href: '/seller/addproduct',
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
            href: '/user/profile',
            description: 'Kelola informasi profil Anda'
          },
          {
            icon: Package,
            label: 'Pesanan Saya',
            href: '/user/orders',
            description: 'Lihat riwayat pesanan Anda'
          },
          {
            icon: Heart,
            label: 'Wishlist',
            href: '/user/wishlist',
            description: 'Produk yang Anda simpan'
          },
          {
            icon: Settings,
            label: 'Pengaturan',
            href: '/user/settings',
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
            href: '/seller/addproduct',
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
            icon: BarChart3,
            label: 'Dashboard',
            href: '/admin/dashboard',
            description: 'Admin dashboard overview'
          },
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
          },
          {
            icon: Database,
            label: 'Database',
            href: '/admin/database',
            description: 'Manajemen basis data sistem'
          },
          {
            icon: Monitor,
            label: 'Desktop',
            href: '/admin/desktop',
            description: 'Desktop management'
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
          group flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 relative
          ${active 
            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
          }
        `}
      >
        {/* Active indicator */}
        {active && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full shadow-sm" />
        )}
        
        <div className={`
          w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0
          ${active 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md' 
            : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-gray-700 group-hover:shadow-sm'
          }
        `}>
          <item.icon className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm truncate transition-colors duration-300 ${
            active ? 'text-blue-700' : 'text-gray-900 group-hover:text-gray-900'
          }`}>
            {item.label}
          </div>
          <div className="text-xs text-gray-500 truncate mt-0.5">{item.description}</div>
        </div>
        
        {item.badge && (
          <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full font-medium shadow-sm flex-shrink-0">
            {item.badge}
          </span>
        )}
        
        <ChevronRight className={`
          w-4.5 h-4.5 transition-all duration-300 flex-shrink-0
          ${active 
            ? 'text-blue-600 opacity-100 translate-x-0' 
            : 'text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
          }
        `} />
      </Link>
    );
  };

  const renderMenuSection = (section: MenuSection) => (
    <div key={section.title} className="mb-8">
      <div className="px-6 pb-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {section.title}
        </h3>
        {section.description && (
          <p className="text-xs text-gray-400 mt-1">{section.description}</p>
        )}
      </div>
      
      <div className="space-y-1.5 px-3">
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
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={closeSidebar}
          />
          
          {/* Dropdown Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed right-4 top-16 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-hidden"
          >
            {/* Header - Compact */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight">DEMO WEB E-COMMERCE</h2>
                <p className="text-xs text-blue-100 opacity-90">by yusuf</p>
              </div>
              <button
                onClick={closeSidebar}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile Section - Compact */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              {status === 'authenticated' ? (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                      {session?.user?.image ? (
                        <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        <UserCircle className="w-7 h-7 text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">
                      {session?.user?.name || 'John Doe'}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      {session?.user?.email || 'demo@example.com'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs rounded-full font-semibold border border-blue-200/50">
                        {userRole.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-md mx-auto mb-3">
                    <UserCircle className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">Guest User</h3>
                  <p className="text-xs text-gray-600">Login to access all features</p>
                </div>
              )}
            </div>

            {/* Navigation Content - Scrollable */}
            <div className="overflow-y-auto max-h-[50vh]">
              {/* Role Switcher - Compact - Only show if logged in */}
              {status === 'authenticated' && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Current Role</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'user' as const, label: 'User', color: 'blue' },
                      { id: 'seller' as const, label: 'Seller', color: 'green' },
                      { id: 'admin' as const, label: 'Admin', color: 'red' }
                    ].map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setUserRole(role.id)}
                        className={`
                          px-2 py-2 text-xs font-bold rounded-lg transition-all duration-300 border
                          ${userRole === role.id
                            ? `bg-gradient-to-br from-${role.color}-500 to-${role.color}-600 text-white shadow-md border-${role.color}-400/30 transform scale-105`
                            : `bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-sm`
                          }
                        `}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Menu Items - Compact */}
              <div className="p-2">
                {/* Main Navigation */}
                <div className="mb-2">
                  {mainNavigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeSidebar}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200
                          ${active 
                            ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }
                        `}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {active && (
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Role-based Menus - Only show if logged in */}
                {status === 'authenticated' && roleBasedMenus[userRole]?.map((section) => (
                  <div key={section.title} className="mb-3">
                    <div className="px-3 py-2">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {section.title}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const active = isActive(item.href);
                        return (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={closeSidebar}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200
                              ${active 
                                ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200' 
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                              }
                            `}
                          >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full font-medium shadow-sm">
                                {item.badge}
                              </span>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Guest User Info - Only show if not logged in */}
                {status !== 'authenticated' && (
                  <div className="mb-3">
                    <div className="px-3 py-2">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        AKUN TAMU
                      </h3>
                    </div>
                    <div className="px-3 py-2 text-center">
                      <p className="text-xs text-gray-600 mb-2">Login untuk mengakses fitur lengkap</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span>Profil Pengguna</span>
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500">
                          <Package className="w-4 h-4 flex-shrink-0" />
                          <span>Pesanan Saya</span>
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500">
                          <Heart className="w-4 h-4 flex-shrink-0" />
                          <span>Wishlist</span>
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500">
                          <Store className="w-4 h-4 flex-shrink-0" />
                          <span>Dashboard Toko</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Information */}
                <div className="mb-2">
                  <div className="px-3 py-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      INFORMASI
                    </h3>
                  </div>
                  {infoSection.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeSidebar}
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200
                          ${active 
                            ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }
                        `}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Auth Section - Compact */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleAuthAction}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium border ${
                  status === 'authenticated' 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 border-blue-200/50'
                    : 'bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-600 border-green-200/50'
                }`}
              >
                {status === 'authenticated' ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>{status === 'authenticated' ? 'Account' : 'Login'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
