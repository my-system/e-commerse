"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Store
} from 'lucide-react';

export default function LoginPage() {
  const { login, register, showToast } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await login(loginForm.email, loginForm.password);
    
    if (result.success) {
      router.push('/user');
    }
    
    setIsSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (registerForm.password !== registerForm.confirmPassword) {
      showToast('Password tidak cocok. Silakan periksa kembali.', 'error');
      setIsSubmitting(false);
      return;
    }
    
    const result = await register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password
    });
    
    if (result.success) {
      router.push('/user');
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (form: 'login' | 'register', field: string, value: any) => {
    if (form === 'login') {
      setLoginForm(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setRegisterForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-indigo-50/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Store className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">DEMO WEB E-COMMERCE</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang Kembali</h2>
          <p className="text-gray-600">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'register'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => handleInputChange('login', 'email', e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-blue-50/30 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                      required
                      className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-blue-50/30 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="Masukkan kata sandi Anda"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={loginForm.rememberMe}
                      onChange={(e) => handleInputChange('login', 'rememberMe', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer font-medium">
                      Ingat Saya
                    </label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Lupa Kata Sandi?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Masuk...</span>
                    </div>
                  ) : (
                    <span>Masuk</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="name"
                      type="text"
                      value={registerForm.name}
                      onChange={(e) => handleInputChange('register', 'name', e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-blue-50/30 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="reg-email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => handleInputChange('register', 'email', e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-blue-50/30 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="reg-password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={registerForm.password}
                      onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                      required
                      className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-blue-50/30 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="Minimal 8 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={registerForm.confirmPassword}
                      onChange={(e) => handleInputChange('register', 'confirmPassword', e.target.value)}
                      required
                      className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-blue-50/30 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      placeholder="Masukkan ulang kata sandi"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Mendaftar...</span>
                    </div>
                  ) : (
                    <span>Daftar</span>
                  )}
                </button>
              </form>
            )}

            {/* Bottom Links */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {activeTab === 'login' ? (
                  <>
                    Belum punya akun?{' '}
                    <button
                      onClick={() => setActiveTab('register')}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Daftar sekarang
                    </button>
                  </>
                ) : (
                  <>
                    Sudah punya akun?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Masuk di sini
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
