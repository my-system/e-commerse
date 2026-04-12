"use client";

import { ReactNode } from 'react';
import GlobalSidebar from '@/components/ui/GlobalSidebar';
import Footer from '@/components/layout/Footer';

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
}

export default function AppLayout({ 
  children, 
  showSidebar = false, // Default false karena tidak pakai sidebar lagi
  showFooter = false 
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Content - No extra padding */}
      <main>
        {children}
      </main>
      
      {/* Footer - optional */}
      {showFooter && (
        <div className="hidden lg:block">
          <Footer />
        </div>
      )}
      
      {/* Mobile Sidebar (Overlay) - Available for all devices */}
      <GlobalSidebar />
    </div>
  );
}
