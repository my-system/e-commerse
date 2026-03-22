"use client";

import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Package, Heart, Settings, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface User {
  name: string;
  email: string;
  phone: string;
}

interface AccountDropdownProps {
  user: User | null;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function AccountDropdown({ user, isLoggedIn, onLogin, onLogout }: AccountDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  const menuItems = [
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
      description: 'Lihat riwayat pesanan'
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
  ];

  if (!isLoggedIn) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-100"
          aria-label="Account"
        >
          <User className="h-5 w-5" />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
            
            {/* Dropdown */}
            <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Selamat datang!</h3>
                <p className="text-xs text-gray-600 mb-4">
                  Login untuk mengakses akun Anda
                </p>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onLogin();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-100"
        aria-label="Account"
      >
        <User className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            {/* User Info */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {user?.name}
                  </h3>
                  <p className="text-xs text-gray-600 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <item.icon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 mr-3" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
              >
                <LogOut className="h-4 w-4 mr-3" />
                <span className="text-sm font-medium">Logout</span>
                <ChevronRight className="h-4 w-4 ml-auto text-red-400 group-hover:text-red-600" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
