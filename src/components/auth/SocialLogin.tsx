"use client";

import { useState } from 'react';
import { Chrome, Facebook, Apple, Mail, Lock, User, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SocialLoginProps {
  onLoginSuccess?: () => void;
  onRegisterSuccess?: () => void;
  showDivider?: boolean;
  className?: string;
}

export default function SocialLogin({ 
  onLoginSuccess, 
  onRegisterSuccess,
  showDivider = true,
  className = "" 
}: SocialLoginProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, register } = useAuth();

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: Chrome,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDEyVjE0LjI1SDE3LjkyQzE3LjY2IDE1LjU4IDE2Ljg4IDE2LjY4IDE1Ljc1IDE3LjMzVjIwLjI1SDE4Ljg0QzIwLjkzIDE4LjUgMjIuNTYgMTUuNiAyMi41NiAxMi4yNVoiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTcuODc1IDIwLjI4QzkuNDc1IDIxLjUgMTEuMjUgMjIuMjUgMTIgMjIuMjVDMTQuMjUgMjIuMjUgMTYuMTggMjEuNSAxNy40MyAyMC4yNUwxNS43NSAxNy4zM0MxNC44OCAxOC4yNSAxMy41IDE4Ljc1IDEyIDE4Ljc1QzEwLjUgMTguNzUgOS4xMjUgMTguMjUgOC4yNSAxNy4zM0w2LjU3NSAyMC4yNUM3LjgyNSAyMS41IDkuNDc1IDIyLjI1IDcuODc1IDIwLjI4WiIgZmlsbD0iIzM0QTg1MyIvPgo8cGF0aCBkPSJNOC4yNSAxNy4zM0M3LjM3NSAxNi40IDYuNzUgMTUuMjUgNi43NSAxMi4yNUM2Ljc1IDkuMjUgNy4zNzUgOC4xIDguMjUgNy4xN0w2LjU3NSA0LjI1QzUuMzI1IDUuNSA0LjUgNy4yNSA0LjUgMTIuMjVDNC41IDE3LjI1IDUuMzI1IDE5IDYuNTc1IDIwLjI1TDguMjUgMTcuMzNaIiBmaWxsPSIjRkJCQzA0Ii8+CjxwYXRoIGQ9Ik0xMiA1Ljc1QzEzLjUgNS43NSAxNC44NzUgNi4yNSAxNS43NSA3LjE3TDE3LjQzIDQuMjVDMTYuMTggMyA14LjI1IDIuMjUgMTIgMi4yNUM5LjQ3NSAyLjI1IDcuODI1IDMgNi41NzUgNC4yNUw4LjI1IDcuMTdDOS4xMjUgNi4yNSAxMC41IDUuNzUgMTIgNS43NVoiIGZpbGw9IiNFQTQzMzUiLz4KPC9zdmc+',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-700 hover:bg-blue-800',
      textColor: 'text-white',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJDMiAxNy41MjMgNi40NzcgMjIgMTIgMjJDMTcuNTIzIDIyIDIyIDE3LjUyMyAyMiAxMkMyMiA2LjQ3NyAxNy41MjMgMiAxMiAyWiIgZmlsbD0iIzE4NzdGMiIvPgo8cGF0aCBkPSJNMTMuNSA5SDE2VjEySDEzLjVWMTVIMTJWMTJIOS41VjlIMTJWNkgxMy41VjlaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=',
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: Apple,
      color: 'bg-black hover:bg-gray-800',
      textColor: 'text-white',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE3LjA1IDIwLjI4QzE2LjQgMTkuNjUgMTUuMTUgMTkuMzUgMTMuOTcgMTkuMzVDMTIuNzUgMTkuMzUgMTEuNSAxOS42NSAxMC44NSAyMC4yOEMxMC4yIDIwLjg4IDkuNSAyMS4xNSA4LjU1IDIxLjE1QzcuNSAyMS4xNSA2LjU1IDIwLjg4IDUuOTUgMjAuMjhDNS4zIDE5LjY1IDQuODUgMTguOCA0Ljg1IDE3Ljc1QzQuODUgMTYuNyA1LjMgMTUuODUgNS45NSAxNS4yMkM2LjYgMTQuNiA3LjUgMTQuMzUgOC41NSAxNC4zNUM5LjYgMTQuMzUgMTAuNSAxNC42IDExLjE1IDE1LjIyQzExLjggMTUuODUgMTIuMjUgMTYuNyAxMi4yNSAxNy43NUMxMi4yNSAxOC44IDExLjggMTkuNjUgMTEuMTUgMjAuMjhDMTIgMjAuODggMTIuOSAyMS4xNSAxMy45NSAyMS4xNUMxNSAyMS4xNSAxNS45IDIwLjg4IDE2LjU1IDIwLjI4QzE3LjIgMTkuNjUgMTcuNjUgMTguOCAxNy42NSAxNy43NUMxNy42NSAxNi43IDE3LjIgMTUuODUgMTYuNTUgMTUuMjJDMTUuOSAxNC42IDE1IDE0LjM1IDEzLjk3IDE0LjM1QzEyLjg1IDE0LjM1IDExLjkgMTQuNiAxMS4xNSAxNS4yMkMxMC40IDE1Ljg1IDkuOTUgMTYuNyA5Ljk1IDE3Ljc1QzkuOTUgMTguOCAxMC40IDE5LjY1IDExLjA1IDIwLjI4WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTEzLjk3IDEwLjM1QzE0LjggMTAuMzUgMTUuNDUgOS43IDE1LjQ1IDguNzVDMTUuNDUgNy44IDE0LjggNy4xNSAxMy45NyA3LjE1QzEzLjE1IDcuMTUgMTIuNSA3LjggMTIuNSA4Ljc1QzEyLjUgOS43IDEzLjE1IDEwLjM1IDEzLjk3IDEwLjM1WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+',
    },
  ];

  const handleSocialLogin = async (providerId: string) => {
    setIsLoading(providerId);
    
    try {
      // Simulate social login API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock user data for social login
      const userData = {
        id: `${providerId}-${Date.now()}`,
        name: `User ${providerId}`,
        email: `user.${providerId}@example.com`,
        avatar: `https://ui-avatars.com/api/?name=User+${providerId}&background=6366f1&color=fff`,
        provider: providerId,
      };

      login(userData.email, 'social-password');
      onLoginSuccess?.();
    } catch (error) {
      console.error('Social login error:', error);
      setErrors({ general: `Login dengan ${providerId} gagal. Coba lagi.` });
    } finally {
      setIsLoading(null);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading('email');
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        // Login
        await login(formData.email, formData.password);
        onLoginSuccess?.();
      } else {
        // Register
        await register({ name: formData.name, email: formData.email, password: formData.password });
        onRegisterSuccess?.();
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ 
        general: isLogin ? 'Login gagal. Periksa email dan password.' : 'Registrasi gagal. Coba lagi.' 
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (!isLogin && !formData.name) {
      newErrors.name = 'Nama wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Social Login Buttons */}
      <div className="space-y-3">
        {socialProviders.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleSocialLogin(provider.id)}
            disabled={isLoading !== null}
            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 ${
              isLoading === provider.id
                ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                : `${provider.color} border-transparent hover:shadow-lg transform hover:scale-105`
            }`}
          >
            {isLoading === provider.id ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="text-white font-medium">Menghubungkan...</span>
              </>
            ) : (
              <>
                <img 
                  src={provider.logo} 
                  alt={provider.name}
                  className="h-5 w-5"
                />
                <span className="font-medium text-white">
                  Lanjut dengan {provider.name}
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Divider */}
      {showDivider && (
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">atau</span>
          </div>
        </div>
      )}

      {/* Email Login Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Masukkan email"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Masukkan password"
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading !== null}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading === 'email' ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline mr-2"></div>
              {isLogin ? 'Login...' : 'Mendaftar...'}
            </>
          ) : (
            <>
              {isLogin ? 'Login' : 'Buat Akun'}
            </>
          )}
        </button>
      </form>

      {/* Toggle Login/Register */}
      <div className="text-center mt-6">
        <p className="text-gray-600">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
              setFormData({ email: '', password: '', name: '' });
            }}
            className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            {isLogin ? 'Daftar sekarang' : 'Login di sini'}
          </button>
        </p>
      </div>

      {/* Terms and Privacy */}
      <div className="text-center mt-4 text-xs text-gray-500">
        Dengan melanjutkan, kamu setuju dengan{' '}
        <a href="#" className="text-blue-600 hover:text-blue-700">Syarat & Ketentuan</a>
        {' '}dan{' '}
        <a href="#" className="text-blue-600 hover:text-blue-700">Kebijakan Privasi</a>
      </div>
    </div>
  );
}
