"use client";

import { ReactNode } from 'react';
import DesktopSidebar from '@/components/ui/DesktopSidebar';
import Navbar from '@/components/layout/Navbar';

interface LayoutWithSidebarProps {
  children: ReactNode;
}

export default function LayoutWithSidebar({ children }: LayoutWithSidebarProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DesktopSidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Only Navbar */}
        <div className="lg:hidden">
          <Navbar />
        </div>
        
        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
      
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Navbar />
      </div>
    </div>
  );
}
