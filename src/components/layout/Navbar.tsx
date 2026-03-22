"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, Search as SearchIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import MiniCart from '@/components/ui/MiniCart';
import SmartSearch from '@/components/ui/SmartSearch';
import AIChatbot from '@/components/ui/AIChatbot';
import AccountDropdown from '@/components/ui/AccountDropdown';
import { categories } from '@/data/categories';
import MegaMenu from '@/components/navigation/MegaMenu';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const { state: cartState, openCart } = useCart();
  const { user, isLoggedIn, login } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Inventory', href: '/inventory' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Tentang', href: '/tentang' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="block hover:opacity-80 transition-opacity duration-200">
                <div className="flex flex-col leading-tight">
                  <span className="text-base md:text-base font-medium text-gray-900">DEMO WEB | E-COMMERCE</span>
                  <span className="text-xs md:text-xs font-light text-gray-500">by yusuf</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.name === 'Shop' ? (
                <div key={item.name} className="relative">
                  <a
                    href={item.href}
                    onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                    className="flex items-center gap-1 text-gray-700 hover:text-black transition-colors duration-200 font-medium"
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4" />
                  </a>
                  
                  <MegaMenu
                    categories={categories}
                    isOpen={isCategoryDropdownOpen}
                    onClose={() => setIsCategoryDropdownOpen(false)}
                  />
                </div>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-black transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
              )
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <SmartSearch className="w-64" />
            <AccountDropdown 
              user={user} 
              isLoggedIn={isLoggedIn} 
              onLogin={() => login('demo@example.com', 'password')}
              onLogout={() => {}} // logout handled by context
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
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-black transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile Shop with Categories */}
              <div className="border-t pt-2 mt-2">
                <div className="space-y-1">
                  <a
                    href="/shop"
                    className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <span>Shop</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </a>
                  
                  {/* Categories under Shop */}
                  {categories.map((category) => (
                    <a
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="text-gray-600 hover:text-black block px-3 py-2 pl-6 text-sm transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        {category.icon && <span>{category.icon}</span>}
                        {category.name}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Additional Menu Items */}
              <div className="border-t pt-2 mt-2">
                <a
                  href="/analytics"
                  className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Analytics
                </a>
                <a
                  href="/inventory"
                  className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Inventory
                </a>
                <a
                  href="/marketplace"
                  className="text-gray-700 hover:text-black block px-3 py-2 text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Marketplace
                </a>
              </div>
              <div className="flex items-center space-x-4 px-3 py-2 border-t mt-2 pt-4">
                <SmartSearch className="w-full" />
                <AccountDropdown 
                  user={user} 
                  isLoggedIn={isLoggedIn} 
                  onLogin={() => login('demo@example.com', 'password')}
                  onLogout={() => {}} // logout handled by context
                />
                <button className="relative p-2 text-gray-700 hover:text-black transition-colors duration-200" onClick={openCart}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartState.totalItems > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartState.totalItems > 99 ? '99+' : cartState.totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
      <MegaMenu
        categories={categories}
        isOpen={isCategoryDropdownOpen}
        onClose={() => setIsCategoryDropdownOpen(false)}
      />
      <MiniCart />
      <AIChatbot />
    </>
  );
}
