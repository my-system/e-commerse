"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, ShoppingCart, User, Search as SearchIcon, ChevronDown, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import MiniCart from '@/components/ui/MiniCart';
import SmartSearchNew from '@/components/ui/SmartSearchNew';
import AIChatbot from '@/components/ui/AIChatbot';
import AccountDropdown from '@/components/ui/AccountDropdown';
import { categories } from '@/data/categories';
import GlobalSidebar from '@/components/ui/GlobalSidebar';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const { state: cartState, openCart } = useCart();
  const { user, isLoggedIn, login, logout } = useAuth();
  const { toggleSidebar } = useSidebar();

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
          ? 'bg-white/95 backdrop-blur-md shadow-md' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="block hover:opacity-80 transition-opacity duration-200">
                <div className="flex flex-col leading-tight">
                  <span className="text-lg md:text-xl font-bold text-gray-900">DEMO WEB E-COMMERCE</span>
                  <span className="text-xs md:text-sm font-light text-gray-500">by yusuf</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-black transition-colors duration-200 font-medium text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <SmartSearchNew className="w-80" />
              
              {/* Login Button when not logged in */}
              {!isLoggedIn && (
                <Link
                  href="/account/login"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
              
              <AccountDropdown 
                user={user as any} 
                isLoggedIn={isLoggedIn} 
                onLogin={() => {}} // Login handled by account page
                onLogout={logout}
              />
              <button 
                className="relative p-2 text-gray-700 hover:text-black transition-colors duration-200"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartState.totalItems > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartState.totalItems > 99 ? '99+' : cartState.totalItems}
                  </span>
                )}
              </button>
              
              {/* Hamburger Menu - Desktop */}
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-700 hover:text-black transition-colors duration-200"
                aria-label="Buka menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Search Icon - Mobile */}
              <button 
                className="relative p-2 text-gray-700 hover:text-black transition-colors duration-200"
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
                className="relative p-2 text-gray-700 hover:text-black transition-colors duration-200"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartState.totalItems > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartState.totalItems > 99 ? '99+' : cartState.totalItems}
                  </span>
                )}
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-700 hover:text-black transition-colors duration-200"
                aria-label="Buka menu"
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
