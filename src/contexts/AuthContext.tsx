"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
    isLoading: true
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (savedUser && isLoggedIn) {
        try {
          const user = JSON.parse(savedUser);
          setState({
            user,
            isLoggedIn: true,
            isLoading: false
          });
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
          setState({
            user: null,
            isLoggedIn: false,
            isLoading: false
          });
        }
      } else {
        setState({
          user: null,
          isLoggedIn: false,
          isLoading: false
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - determine role based on email
    const isAdmin = email === 'admin@admin.com' || email.includes('admin');
    
    const mockUser: User = {
      name: isAdmin ? 'Admin User' : 'John Doe',
      email: email,
      phone: '08123456789',
      role: isAdmin ? 'admin' : 'user'
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('isLoggedIn', 'true');
    
    setState({
      user: mockUser,
      isLoggedIn: true,
      isLoading: false
    });
  };

  const logout = () => {
    console.log('Logout function called - clearing user data');
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    
    setState({
      user: null,
      isLoggedIn: false,
      isLoading: false
    });
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock registration - auto-login after registration
    const isAdmin = userData.email.includes('admin');
    
    const mockUser: User = {
      name: userData.name,
      email: userData.email,
      phone: '08123456789',
      role: isAdmin ? 'admin' : 'user'
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('isLoggedIn', 'true');
    
    setState({
      user: mockUser,
      isLoggedIn: true,
      isLoading: false
    });
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
