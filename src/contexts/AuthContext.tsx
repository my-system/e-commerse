"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'SELLER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  image?: string | null;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
    isLoading: false
  });

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  // Sync with NextAuth session
  useEffect(() => {
    if (status === 'loading') {
      setState(prev => ({ ...prev, isLoading: true }));
    } else if (status === 'authenticated' && session?.user) {
      setState({
        user: session.user as User,
        isLoggedIn: true,
        isLoading: false
      });
    } else {
      setState({
        user: null,
        isLoggedIn: false,
        isLoading: false
      });
    }
  }, [session, status]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        showToast(data.message || 'Login gagal', 'error');
        return { success: false, message: data.message };
      }

      // NextAuth session will be updated automatically
      showToast(`Selamat datang kembali, ${data.user.name}!`, 'success');
      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      showToast('Terjadi kesalahan saat login. Silakan coba lagi.', 'error');
      return { success: false, message: 'Terjadi kesalahan' };
    }
  };

  const logout = async () => {
    try {
      // Use NextAuth signOut
      const { signOut } = await import('next-auth/react');
      await signOut({ redirect: false });

      showToast('Anda telah berhasil logout.', 'info');
      
      // Manually redirect to login page after logout
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (userData: { name: string; email: string; password: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!data.success) {
        showToast(data.message || 'Registrasi gagal', 'error');
        return { success: false, message: data.message };
      }

      showToast('Registrasi berhasil! Silakan login.', 'success');
      return { success: true };

    } catch (error) {
      console.error('Register error:', error);
      showToast('Terjadi kesalahan saat registrasi. Silakan coba lagi.', 'error');
      return { success: false, message: 'Terjadi kesalahan' };
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register, showToast }}>
      {children}
      {toast.isVisible && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white`}>
          {toast.message}
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
