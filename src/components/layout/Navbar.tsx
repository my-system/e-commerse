"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, ShoppingCart, User, Search as SearchIcon, ChevronDown, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useSidebar } from '@/contexts/SidebarContext';
import MiniCart from '@/components/ui/MiniCart';
import SmartSearchNew from '@/components/ui/SmartSearchNew';
import AIChatbot from '@/components/ui/AIChatbot';
import { categories } from '@/data/categories';
import GlobalSidebar from '@/components/ui/GlobalSidebar';
import AccountDropdown from '@/components/ui/AccountDropdown';
import { toast } from 'sonner';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const { state: cartState, openCart } = useCart();
  const { data: session, status } = useSession();
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const isLoggedIn = status === 'authenticated';
  const user = session?.user;

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
      toast.success('Logout berhasil');
    } catch (error) {
      toast.error('Logout gagal');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient-shift shadow-lg' 
          : 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 animate-gradient-shift'
      }`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 w-full">
            {/* Logo - Far Left */}
            <div className="flex items-center flex-shrink-0 z-10">
              <Link href="/" className="block hover:opacity-80 transition-opacity duration-200">
                <div className="flex flex-col leading-tight">
                  <span className="text-lg md:text-xl font-bold text-white">DEMO WEB E-COMMERCE</span>
                  <span className="text-xs md:text-sm font-light text-white/90">by yusuf</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Center (Absolute) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative pb-1 transition-all duration-300 font-medium text-sm ${
                      isActive 
                        ? 'text-white after:content-[\'\'] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-white' 
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions - Far Right */}
            <div className="hidden md:flex items-center gap-4 z-10">
              <SmartSearchNew className="w-80" />
              
              {/* Authentication: Show Sign In button OR Profile dropdown */}
              {status !== 'authenticated' ? (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              ) : (
                <AccountDropdown 
                  user={user as any} 
                  isLoggedIn={isLoggedIn} 
                  onLogin={() => {}} // Login handled by account page
                  onLogout={handleLogout}
                />
              )}
              <button 
                className="relative p-2 text-white hover:text-white/80 transition-colors duration-200"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartState.totalItems > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-white text-blue-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartState.totalItems > 99 ? '99+' : cartState.totalItems}
                  </span>
                )}
              </button>
              
              {/* Hamburger Menu - Desktop */}
              <button
                onClick={toggleSidebar}
                className="p-2 text-white hover:text-white/80 transition-colors duration-200 relative z-50"
                aria-label="Buka menu"
                style={{ pointerEvents: 'auto' }}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Search Icon - Mobile */}
              <button
                className="relative p-2 text-white hover:text-white/80 transition-colors duration-200"
                onClick={() => {
                  // Trigger search modal or navigate to search page
                  const searchModal = document.getElementById('mobile-search-modal');
                  if (searchModal) {
                    searchModal.classList.remove('hidden');
                  } else {
                    // Fallback: navigate to search page or open search in sidebar
                    window.location.href = '/search';
                  }
                }}
                aria-label="Cari produk"
              >
                <SearchIcon className="h-5 w-5" />
              </button>

              {/* Cart Icon - Mobile */}
              <button
                className="relative p-2 text-white hover:text-white/80 transition-colors duration-200"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartState.totalItems > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-white text-blue-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartState.totalItems > 99 ? '99+' : cartState.totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={toggleSidebar}
                className="p-2 text-white hover:text-white/80 transition-colors duration-200 relative z-50"
                aria-label="Buka menu"
                style={{ pointerEvents: 'auto' }}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Components */}
      <MiniCart />
      <AIChatbot />
      
      {/* Mobile Search Modal */}
      <div 
        id="mobile-search-modal" 
        className="hidden fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            e.currentTarget.classList.add('hidden');
          }
        }}
      >
        <div className="absolute top-20 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cari Produk</h3>
            <button
              onClick={() => {
                document.getElementById('mobile-search-modal')?.classList.add('hidden');
              }}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <SmartSearchNew className="w-full" />
        </div>
      </div>
      
      {/* Global Sidebar - Always Available */}
      <GlobalSidebar />
    </>
  );
}
