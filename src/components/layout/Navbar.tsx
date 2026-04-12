"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useSidebar } from '@/contexts/SidebarContext';
import MiniCart from '@/components/ui/MiniCart';
import SmartSearchNew from '@/components/ui/SmartSearchNew';
import AIChatbot from '@/components/ui/AIChatbot';
import { categories } from '@/data/categories';
import GlobalSidebar from '@/components/ui/GlobalSidebar';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const { state: cartState, openCart } = useCart();
  const { data: session, status } = useSession();
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const isLoggedIn = status === 'authenticated';
  const user = session?.user;

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
      <nav className={`fixed top-0 left-0 right-0 w-full z-[999] transition-all duration-300 ${
        isScrolled
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 animate-fluid-gradient backdrop-blur-md bg-opacity-90 shadow-lg'
          : 'bg-gradient-to-r from-blue-600 to-purple-600 animate-fluid-gradient backdrop-blur-md'
      }`}>
        <div className="w-full px-6">
          <div className="flex flex-row items-center justify-between h-16 w-full relative">
            {/* Logo - Far Left */}
            <div className="flex items-center flex-shrink-0 z-10">
              <Link href="/" className="block hover:opacity-80 transition-opacity duration-200">
                <div className="flex flex-col leading-tight">
                  <span className="text-sm md:text-xl font-bold text-white truncate">DEMO WEB E-COMMERCE</span>
                  <span className="text-[10px] md:text-sm font-light text-white/90 truncate">by yusuf</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Center (Absolute Positioned) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative pb-1 transition-all duration-300 font-medium text-sm ${
                      isActive
                        ? 'text-white after:content-[\'\'] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-teal-400 after:to-cyan-400'
                        : 'text-white/80 hover:text-white hover:after:content-[\'\'] hover:after:absolute hover:after:bottom-[-1px] hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-gradient-to-r hover:after:from-teal-400 hover:after:to-cyan-400'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Icon Group - Far Right */}
            <div className="flex flex-row items-center gap-2 flex-shrink-0 z-10">
              {/* Cart - Mobile Only */}
              <button
                className="md:hidden p-2 text-white hover:text-white/80 transition-colors duration-200 relative"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartState.totalItems > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-white text-blue-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartState.totalItems > 99 ? '99+' : cartState.totalItems}
                  </span>
                )}
              </button>

              {/* Hamburger Menu - Mobile Only */}
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 text-white hover:text-white/80 transition-colors duration-200"
                aria-label="Buka menu"
                style={{ pointerEvents: 'auto' }}
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Cart - Desktop Only */}
              <button
                className="hidden md:block p-2 text-white hover:text-white/80 transition-colors duration-200 relative"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartState.totalItems > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-white text-blue-600 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartState.totalItems > 99 ? '99+' : cartState.totalItems}
                  </span>
                )}
              </button>

              {/* Hamburger Menu - Desktop Only */}
              <button
                onClick={toggleSidebar}
                className="hidden md:block p-2 text-white hover:text-white/80 transition-colors duration-200"
                aria-label="Buka menu"
                style={{ pointerEvents: 'auto' }}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Components */}
      <MiniCart />
      <AIChatbot />

      {/* Global Sidebar - Always Available */}
      <GlobalSidebar />
    </>
  );
}
