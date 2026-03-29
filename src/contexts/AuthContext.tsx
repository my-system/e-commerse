"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'seller' | 'admin';
  avatar?: string | null;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Disable auth for development - always logged in as admin
  const [state, setState] = useState<AuthState>({
    user: {
      name: 'Admin User',
      email: 'admin@admin.com',
      phone: '08123456789',
      role: 'admin'
    },
    isLoggedIn: true,
    isLoading: false
  });

  const login = async (email: string, password: string) => {
    // No-op - always logged in
  };

  const logout = () => {
    // No-op - keep logged in
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    // No-op - always logged in
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
