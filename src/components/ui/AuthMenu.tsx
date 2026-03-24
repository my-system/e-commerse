"use client";

import { useState, useRef, useEffect } from 'react';
import { LogIn, UserPlus, X, ChevronRight, HelpCircle, Info } from 'lucide-react';
import Link from 'next/link';

interface AuthMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AuthMenu({ isOpen, onToggle }: AuthMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggle();
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
  }, [isOpen, onToggle]);

  const menuItems = [
    {
      icon: LogIn,
      label: 'Masuk Ke Akun',
      description: 'Masuk untuk akses pesanan & profil',
      href: '/login',
      color: 'text-blue-600'
    },
    {
      icon: UserPlus,
      label: 'Daftar Akun Baru',
      description: 'Buat akun untuk pengalaman belanja terbaik',
      href: '/register',
      color: 'text-green-600'
    }
  ];

  const additionalItems = [
    {
      icon: Info,
      label: 'Tentang Kami',
      description: 'Kenali lebih tentang kami',
      href: '/tentang',
      color: 'text-gray-600'
    },
    {
      icon: HelpCircle,
      label: 'Bantuan',
      description: 'Dapatkan bantuan dan dukungan',
      href: '/help',
      color: 'text-gray-600'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onToggle} />
      )}
      
      {/* Dropdown */}
      <div 
        ref={menuRef}
        className={`absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {/* Blue Header */}
        <div className="bg-blue-600 px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-white font-semibold text-base">DEMO WEB E-COMMERCE</h3>
            </div>
            <button
              onClick={onToggle}
              className="text-white hover:bg-blue-700 p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-blue-100 text-sm">Silakan masuk untuk mulai berbelanja</p>
        </div>

        {/* Main Menu Items */}
        <div className="py-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onToggle}
              className="flex items-center px-4 py-4 hover:bg-gray-50 transition-colors duration-200 group"
            >
              <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform duration-200 mr-3`} />
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

        {/* Divider */}
        <div className="border-t border-gray-200 my-2"></div>

        {/* Additional Menu Items */}
        <div className="py-2">
          {additionalItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onToggle}
              className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group"
            >
              <item.icon className={`h-4 w-4 ${item.color} group-hover:scale-110 transition-transform duration-200 mr-3`} />
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
      </div>
    </>
  );
}
