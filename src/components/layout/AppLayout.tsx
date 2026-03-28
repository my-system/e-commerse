"use client";

import { ReactNode } from 'react';
import DesktopSidebar from '@/components/ui/DesktopSidebar';
import Navbar from '@/components/layout/Navbar';
import GlobalSidebar from '@/components/ui/GlobalSidebar';
import Footer from '@/components/layout/Footer';

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
}

export default function AppLayout({ 
  children, 
  showSidebar = true, 
  showFooter = false 
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      {showSidebar && (
        <div className="hidden lg:block">
          <DesktopSidebar />
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Minimal Navbar - hanya untuk mobile dan search/cart */}
        <div className="lg:hidden">
          <Navbar />
        </div>
        
        {/* Desktop Minimal Header */}
        <div className="hidden lg:flex h-14 border-b border-gray-200 bg-white px-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">DEMO WEB E-COMMERCE</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search bar */}
            <div className="w-96">
              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            
            {/* Cart button */}
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        
        {/* Footer - optional */}
        {showFooter && (
          <div className="hidden lg:block">
            <Footer />
          </div>
        )}
      </div>
      
      {/* Mobile Sidebar (Overlay) */}
      <div className="lg:hidden">
        <GlobalSidebar />
      </div>
    </div>
  );
}
