"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'SELLER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (userData: { name: string; email: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
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

// Local storage keys
const STORAGE_KEYS = {
  USER: 'luxe_user',
  USERS: 'luxe_users',
  REMEMBER_ME: 'luxe_remember_me'
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
    isLoading: true
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

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);

        if (savedUser && rememberMe === 'true') {
          const user = JSON.parse(savedUser);
          setState({
            user,
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
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState({
          user: null,
          isLoggedIn: false,
          isLoading: false
        });
      }
    };

    initializeAuth();
  }, []);

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

      // Save user to localStorage for session persistence
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');

      // Update state
      setState({
        user: data.user,
        isLoggedIn: true,
        isLoading: false
      });

      showToast(`Selamat datang kembali, ${data.user.name}!`, 'success');
      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      showToast('Terjadi kesalahan saat login. Silakan coba lagi.', 'error');
      return { success: false, message: 'Terjadi kesalahan' };
    }
  };

  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);

      // Update state
      setState({
        user: null,
        isLoggedIn: false,
        isLoading: false
      });

      showToast('Anda telah berhasil logout.', 'info');
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

      // Auto login after registration
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');

      // Update state
      setState({
        user: data.user,
        isLoggedIn: true,
        isLoading: false
      });

      showToast(`Registrasi berhasil! Selamat datang, ${userData.name}!`, 'success');
      return { success: true };

    } catch (error) {
      console.error('Register error:', error);
      showToast('Terjadi kesalahan saat registrasi. Silakan coba lagi.', 'error');
      return { success: false, message: 'Terjadi kesalahan' };
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    showToast
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Toast Notification */}
      {toast.isVisible && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center gap-3">
            {toast.type === 'success' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}
