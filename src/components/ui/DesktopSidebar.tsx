"use client";

import React from 'react';
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
  UserCircle
} from 'lucide-react';

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  description?: string;
  badge?: string;
  isDangerous?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export default function DesktopSidebar() {
  const { userRole, setUserRole } = useSidebar();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Navigasi Utama
  const mainNavigation: MenuItem[] = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
    },
    {
      icon: Package,
      label: 'Marketplace',
      href: '/marketplace',
    },
    {
      icon: ShoppingCart,
      label: 'Keranjang',
      href: '/cart',
    }
  ];

  // Menu berdasarkan role
  const roleBasedMenus: Record<string, MenuSection[]> = {
    user: [
      {
        title: 'Akun Saya',
        items: [
          {
            icon: User,
            label: 'Profil Saya',
            href: '/account/profile',
          },
          {
            icon: Package,
            label: 'Pesanan Saya',
            href: '/account/orders',
          },
          {
            icon: Heart,
            label: 'Wishlist',
            href: '/account/wishlist',
          },
          {
            icon: Settings,
            label: 'Pengaturan',
            href: '/account/settings',
          }
        ]
      }
    ],
    seller: [
      {
        title: 'Akun Saya',
        items: [
          {
            icon: User,
            label: 'Profil Saya',
            href: '/account/profile',
          },
          {
            icon: Package,
            label: 'Pesanan Saya',
            href: '/account/orders',
          },
          {
            icon: Heart,
            label: 'Wishlist',
            href: '/account/wishlist',
          },
          {
            icon: Settings,
            label: 'Pengaturan',
            href: '/account/settings',
          }
        ]
      },
      {
        title: 'Toko Saya',
        items: [
          {
            icon: Store,
            label: 'Dashboard Toko',
            href: '/seller/dashboard',
          },
          {
            icon: Package,
            label: 'Produk Saya',
            href: '/seller/products',
          },
          {
            icon: Plus,
            label: 'Tambah Produk',
            href: '/seller/products/create',
            badge: 'WAJIB'
          },
          {
            icon: PackageOpen,
            label: 'Pesanan Masuk',
            href: '/seller/orders',
          },
          {
            icon: BarChart3,
            label: 'Manajemen Stok',
            href: '/seller/inventory',
          },
          {
            icon: TrendingUp,
            label: 'Statistik Penjualan',
            href: '/seller/analytics',
          }
        ]
      }
    ],
    admin: [
      {
        title: 'Akun Saya',
        items: [
          {
            icon: User,
            label: 'Profil Saya',
            href: '/account/profile',
          },
          {
            icon: Package,
            label: 'Pesanan Saya',
            href: '/account/orders',
          },
          {
            icon: Heart,
            label: 'Wishlist',
            href: '/account/wishlist',
          },
          {
            icon: Settings,
            label: 'Pengaturan',
            href: '/account/settings',
          }
        ]
      },
      {
        title: 'Toko Saya',
        items: [
          {
            icon: Store,
            label: 'Dashboard Toko',
            href: '/seller/dashboard',
          },
          {
            icon: Package,
            label: 'Produk Saya',
            href: '/seller/products',
          },
          {
            icon: Plus,
            label: 'Tambah Produk',
            href: '/seller/products/create',
            badge: 'WAJIB'
          },
          {
            icon: PackageOpen,
            label: 'Pesanan Masuk',
            href: '/seller/orders',
          },
          {
            icon: BarChart3,
            label: 'Manajemen Stok',
            href: '/seller/inventory',
          },
          {
            icon: TrendingUp,
            label: 'Statistik Penjualan',
            href: '/seller/analytics',
          }
        ]
      },
      {
        title: 'Admin Panel',
        items: [
          {
            icon: Shield,
            label: 'Kelola Produk',
            href: '/admin/products',
          },
          {
            icon: Package,
            label: 'Inventory',
            href: '/admin/inventory',
          },
          {
            icon: BarChart3,
            label: 'Analytics',
            href: '/admin/analytics',
          },
          {
            icon: Users,
            label: 'Kelola User',
            href: '/admin/users',
          },
          {
            icon: Store,
            label: 'Kontrol Marketplace',
            href: '/admin/marketplace',
          }
        ]
      }
    ]
  };

  const currentMenu = roleBasedMenus[userRole] || roleBasedMenus.user;

  const renderMenuItem = (item: MenuItem) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`
          flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors duration-200
          ${active
            ? 'bg-gray-100 text-gray-900 border-l-4 border-blue-500 font-medium'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1">{item.label}</span>
        {item.badge && (
          <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full font-medium">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="w-[300px] bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <h2 className="text-lg font-semibold">DEMO WEB E-COMMERCE</h2>
        <p className="text-xs text-blue-100 mt-0.5 opacity-90">by yusuf</p>
      </div>

      {/* Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <UserCircle className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {user?.name || 'John Doe'}
            </div>
            <div className="text-sm text-gray-600 truncate">
              {user?.email || 'demo@example.com'}
            </div>
          </div>
        </div>
        
        {/* Role Switcher - Segmented Control */}
        <div className="mt-4">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {[
              { id: 'user' as const, label: 'User' },
              { id: 'seller' as const, label: 'Seller' },
              { id: 'admin' as const, label: 'Admin' }
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setUserRole(role.id)}
                className={`
                  flex-1 px-2 py-1.5 text-xs font-medium rounded transition-colors duration-200
                  ${userRole === role.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-6">
        {/* Main Navigation */}
        <div className="mb-8">
          <nav className="space-y-1">
            {mainNavigation.map(renderMenuItem)}
          </nav>
        </div>

        {/* Role-based Menus */}
        {currentMenu.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <nav className="space-y-1">
              {section.items.map(renderMenuItem)}
            </nav>
          </div>
        ))}

        {/* Information Section */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Informasi
          </h3>
          <nav className="space-y-1">
            <Link
              href="/tentang"
              className={`
                flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors duration-200
                ${isActive('/tentang')
                  ? 'bg-gray-100 text-gray-900 border-l-4 border-blue-500 font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <HelpCircle className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">Tentang</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
