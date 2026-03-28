"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface SidebarContextType {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  userRole: 'user' | 'seller' | 'admin';
  setUserRole: (role: 'user' | 'seller' | 'admin') => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

interface SidebarProviderProps {
  children: ReactNode;
  userRole?: 'user' | 'seller' | 'admin';
}

export function SidebarProvider({ children, userRole = 'user' }: SidebarProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(userRole);
  const pathname = usePathname();

  // Auto-close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const setUserRole = (role: 'user' | 'seller' | 'admin') => {
    setCurrentUserRole(role);
    localStorage.setItem('userRole', role);
    console.log('User role changed to:', role);
  };

  // Load saved role on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as 'user' | 'seller' | 'admin' | null;
    if (savedRole) {
      setCurrentUserRole(savedRole);
    }
  }, []);

  const value: SidebarContextType = {
    isSidebarOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    userRole: currentUserRole,
    setUserRole,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}
