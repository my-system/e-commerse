"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  phone: string;
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
    
    // Mock authentication - accept any email/password for demo
    const mockUser: User = {
      name: 'John Doe',
      email: email,
      phone: '08123456789'
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
    const mockUser: User = {
      name: userData.name,
      email: userData.email,
      phone: '08123456789'
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
