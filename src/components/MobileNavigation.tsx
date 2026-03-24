'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingCart, User, Search, Home, ShoppingBag, Heart, Settings, TrendingUp, Package, Store, Info, LogOut, UserCircle, PackageOpen, FileText, MapPin, ChevronRight, UserPlus, LogIn, HelpCircle } from 'lucide-react'
import { MobileSearch } from './MobileSearch'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

export function MobileNavigation({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { state } = useCart()
  const { user, isLoggedIn, logout } = useAuth()

  // Check if current page should show sidebar
  const shouldShowSidebar = () => {
    if (typeof window === 'undefined') return true; // Default to true on server-side
    const currentPath = window.location.pathname;
    // Hide sidebar on admin pages
    const adminPages = ['/admin', '/inventory', '/analytics', '/marketplace'];
    return !adminPages.some(path => currentPath.startsWith(path));
  };

  // Use useEffect to avoid hydration issues
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenuClick = (href: string) => {
    console.log('Menu clicked:', href);
    setIsSidebarOpen(false);
    // Navigate without triggering logout
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
  };

  const handleLogout = () => {
    console.log('User logged out');
    logout(); // Use the logout function from AuthContext
    setIsSidebarOpen(false);
  };

  const handleLogin = () => {
    console.log('Navigate to login');
    setIsSidebarOpen(false);
    // Navigate to login page instead of mock login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: ShoppingBag, label: 'Shop', href: '/shop' },
    { icon: ShoppingCart, label: 'Keranjang', href: '/cart' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: User, label: 'Akun', href: '/account' },
  ];

  const sidebarMenuItems = [
    // Grup Navigasi Utama (Belanja)
    { icon: Home, label: 'Home', href: '/', group: 'navigation' },
    { icon: ShoppingBag, label: 'Shop', href: '/shop', group: 'navigation' },
    { icon: ShoppingCart, label: 'Keranjang', href: '/cart', group: 'navigation', badge: true },
    
    // Grup Admin (hanya untuk admin)
    { icon: Store, label: 'Marketplace', href: '/marketplace', group: 'admin' },
    { icon: Package, label: 'Inventory', href: '/inventory', group: 'admin' },
    { icon: TrendingUp, label: 'Analytics', href: '/analytics', group: 'admin' },
    
    // Grup Support
    { icon: Info, label: 'Tentang Kami', href: '/tentang', group: 'support' },
    { icon: HelpCircle, label: 'Bantuan', href: '/help', group: 'support' },
  ];

  const profileMenuItems = [
    {
      icon: UserCircle,
      label: 'Profil Saya',
      description: 'Kelola informasi profil Anda',
      href: '/account/profile'
    },
    {
      icon: PackageOpen,
      label: 'Pesanan Saya',
      description: 'Lihat riwayat pesanan',
      href: '/account/orders'
    },
    {
      icon: Heart,
      label: 'Wishlist',
      description: 'Produk yang Anda simpan',
      href: '/account/wishlist'
    },
    {
      icon: Settings,
      label: 'Pengaturan',
      description: 'Pengaturan akun dan privasi',
      href: '/account/settings'
    }
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-gray-900">DEMO WEB</span>
              <span className="text-xs font-light text-gray-500">E-COMMERCE</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {state.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {state.totalItems > 99 ? '99+' : state.totalItems}
                </span>
              )}
            </button>
            {shouldShowSidebar() && mounted && (
            <button
              onClick={() => {
                console.log('Hamburger menu clicked');
                setIsSidebarOpen(true);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative z-50"
              style={{ pointerEvents: 'auto' }}
              aria-label="Menu"
              type="button"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          )}
          </div>
        </div>
      </header>

      {/* Modern Sidebar */}
      {isSidebarOpen && shouldShowSidebar() && mounted && (
        <div className="md:hidden fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
            style={{ zIndex: 9998 }}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl" style={{ zIndex: 9999 }}>
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
              <div>
                <h1 className="text-xl font-bold text-white">DEMO WEB E-COMMERCE</h1>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="h-full overflow-y-auto pb-20">
              <div className="py-4">
                {/* Menu List */}
                <div className="space-y-1">
                  {/* Grup 1: NAVIGASI */}
                  <div className="mb-2">
                    <div className="px-6 py-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigasi</span>
                    </div>
                    {sidebarMenuItems.filter(item => item.group === 'navigation').map((item) => (
                      <div
                        key={item.label}
                        onClick={() => handleMenuClick(item.href)}
                        className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <item.icon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-800 font-medium">{item.label}</span>
                        {item.badge && state.totalItems > 0 && (
                          <span className="ml-auto bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {state.totalItems > 99 ? '99+' : state.totalItems}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-2"></div>

                  {/* Grup 2: AKUN & MANAJEMEN */}
                  <div className="mb-2">
                    <div className="px-6 py-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Akun & Manajemen</span>
                    </div>
                    
                    {isLoggedIn ? (
                      <div>
                        {/* Header Profil */}
                        <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            {user?.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <span className="text-white font-semibold text-sm">
                                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-sm">{user?.name || 'User'}</div>
                              <div className="text-xs text-gray-500">{user?.email || 'user@example.com'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Profil */}
                        <div className="space-y-1">
                          {profileMenuItems.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setIsSidebarOpen(false)}
                              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors group"
                            >
                              <item.icon className="w-5 h-5 text-gray-600" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.label}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {item.description}
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </Link>
                          ))}
                        </div>

                        {/* Admin Menu (hanya untuk admin) */}
                        {user?.role === 'admin' && (
                          <>
                            {/* Divider */}
                            <div className="border-t border-gray-100 my-2"></div>
                            <div className="px-6 py-2">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Panel</span>
                            </div>
                            {sidebarMenuItems.filter(item => item.group === 'admin').map((item) => (
                              <div
                                key={item.label}
                                onClick={() => handleMenuClick(item.href)}
                                className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                              >
                                <item.icon className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-800 font-medium">{item.label}</span>
                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    ) : (
                      // Jika belum login - tampilkan tombol login/register
                      <div className="px-6 py-4">
                        <div className="text-center mb-4">
                          <UserCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 mb-1">Belum masuk?</div>
                          <div className="text-xs text-gray-500">Masuk untuk mengakses akun Anda</div>
                        </div>
                        
                        <div className="space-y-2">
                          <Link
                            href="/login"
                            onClick={() => setIsSidebarOpen(false)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group"
                          >
                            <LogIn className="w-4 h-4" />
                            <span className="font-medium">Masuk Ke Akun</span>
                          </Link>
                          
                          <Link
                            href="/register"
                            onClick={() => setIsSidebarOpen(false)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors group"
                          >
                            <UserPlus className="w-4 h-4" />
                            <span className="font-medium">Daftar Akun Baru</span>
                          </Link>
                        </div>
                        
                        <div className="text-center mt-3">
                          <div className="text-xs text-gray-500">
                            Masuk untuk akses pesanan & profil
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-2"></div>

                  {/* Grup 3: LAINNYA */}
                  <div className="mb-2">
                    <div className="px-6 py-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lainnya</span>
                    </div>
                    {sidebarMenuItems.filter(item => item.group === 'support').map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors group"
                      >
                        <item.icon className="w-5 h-5 text-gray-600" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">
                            {item.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.label === 'Tentang Kami' ? 'Kenali lebih tentang kami' : 'Dapatkan bantuan dan dukungan'}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </Link>
                    ))}

                    {/* Tombol Logout */}
                    {isLoggedIn && (
                      <div className="px-6 py-4 mt-6 border-t-2 border-gray-200 bg-gray-50 sticky bottom-0">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 px-4 py-4 text-red-500 bg-white rounded-lg hover:bg-red-50 transition-colors border-2 border-red-200 shadow-sm"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="font-medium text-base">Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="flex items-center justify-around py-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <item.icon className="w-5 h-5 text-gray-700" />
              <span className="text-xs text-gray-600">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Search Modal */}
      <MobileSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Main Content */}
      <div className="md:hidden pt-16 pb-20 bg-gray-50">
        {children}
      </div>
    </>
  )
}

// Mobile Grid Layout Component
export function MobileGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:hidden pt-16 pb-20">
      {children}
    </div>
  )
}

// Mobile Product Card
export function MobileProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative aspect-square">
        <img
          src={product.image || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
            <Heart className="w-4 h-4 text-gray-700" />
          </button>
          <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
            <ShoppingCart className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Badge */}
        {product.isNew && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
            New
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{product.description}</p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {product.discount && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < (product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.reviews || 23})</span>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  )
}
