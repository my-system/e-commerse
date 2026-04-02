"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Package, 
  Heart, 
  ShoppingBag, 
  LogOut, 
  UserCircle, 
  Settings,
  CreditCard,
  MapPin,
  FileText,
  Bell,
  ChevronRight,
  Eye,
  EyeOff,
  Star,
  Plus,
  Store,
  TrendingUp,
  Award,
  Shield,
  ArrowRight,
  Mail,
  Lock
} from 'lucide-react';

export default function AccountDashboard() {
  const { user, isLoggedIn, logout, login, register } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Form states
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
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await login(loginForm.email, loginForm.password);
    
    if (result.success) {
      router.push('/account');
    }
    
    setIsSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setIsSubmitting(false);
      return;
    }
    
    const result = await register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password
    });
    
    if (result.success) {
      router.push('/account');
    }
    
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Account menu items dengan LUXE theme
  const accountMenuItems = [
    {
      title: 'My Orders',
      description: 'Track, return or buy things again',
      icon: Package,
      href: '/account/orders',
      badge: '12',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'My Details',
      description: 'Name, email and phone number',
      icon: User,
      href: '/account/profile',
      badge: null,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Address Book',
      description: 'Saved addresses for easy checkout',
      icon: MapPin,
      href: '/account/addresses',
      badge: '3',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Payment Methods',
      description: 'Cards and accounts for easy checkout',
      icon: CreditCard,
      href: '/account/payment',
      badge: '2',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'My Reviews',
      description: 'Reviews you have written',
      icon: Star,
      href: '/account/reviews',
      badge: '8',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'My Wishlist',
      description: 'Products you have saved for later',
      icon: Heart,
      href: '/account/wishlist',
      badge: '18',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Notifications',
      description: 'Updates on your orders and shopping',
      icon: Bell,
      href: '/account/notifications',
      badge: '5',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Settings',
      description: 'Password, security and preferences',
      icon: Settings,
      href: '/account/settings',
      badge: null,
      color: 'from-gray-500 to-gray-600'
    }
  ];

  // Stats data
  const accountStats = [
    {
      label: 'Total Orders',
      value: '24',
      change: '+12%',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Wishlist Items',
      value: '18',
      change: '+25%',
      icon: Heart,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Total Spent',
      value: 'Rp 4.2M',
      change: '+18%',
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Member Points',
      value: '2,450',
      change: '+150',
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'order',
      title: 'Order #12345 Delivered',
      description: 'Your package has been successfully delivered',
      time: '2 hours ago',
      icon: Package,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      type: 'wishlist',
      title: 'New Item in Wishlist',
      description: 'You added "Wireless Headphones" to wishlist',
      time: '5 hours ago',
      icon: Heart,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 3,
      type: 'review',
      title: 'Review Submitted',
      description: 'You reviewed "Running Shoes"',
      time: '1 day ago',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 4,
      type: 'points',
      title: 'Points Earned',
      description: 'You earned 150 points from recent purchase',
      time: '2 days ago',
      icon: Award,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Left Side - Brand */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <Store className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold">DEMO WEB E-COMMERCE</h1>
              </div>
              <p className="text-blue-100 text-center max-w-md">
                Platform belanja online terpercaya dengan ribuan produk pilihan
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6 w-full max-w-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Account Dashboard</h3>
                  <p className="text-blue-100 text-sm">Kelola pesanan, wishlist, dan profil Anda</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">100% Aman</h3>
                  <p className="text-blue-100 text-sm">Data Anda terlindungi dengan enkripsi</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Personalisasi</h3>
                  <p className="text-blue-100 text-sm">Dapatkan rekomendasi produk khusus</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">DEMO WEB E-COMMERCE</h1>
              </div>
            </div>

            {/* Auth Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCircle className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-blue-100">
                    {activeTab === 'login' 
                      ? 'Login to access your dashboard' 
                      : 'Join us and start shopping'
                    }
                  </p>
                </div>
              </div>

              {/* Tab Switch */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'login'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'register'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Forms */}
              <div className="p-8">
                {activeTab === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div>
                      <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="login-email"
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="nama@email.com"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                          required
                          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Masukkan password Anda"
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
                          id="remember"
                          type="checkbox"
                          checked={loginForm.rememberMe}
                          onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-700 cursor-pointer">
                          Ingat Saya
                        </label>
                      </div>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Lupa Password?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Masuk...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <UserCircle className="w-5 h-5" />
                          <span>Masuk Sekarang</span>
                        </div>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="register-name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <UserCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="register-name"
                          type="text"
                          value={registerForm.name}
                          onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="register-email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="register-email"
                          type="email"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="nama@email.com"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="register-password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="register-password"
                          type={showPassword ? 'text' : 'password'}
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                          required
                          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                      <label htmlFor="register-confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Konfirmasi Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="register-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                          required
                          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Masukkan ulang password"
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
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Mendaftar...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <UserCircle className="w-5 h-5" />
                          <span>Daftar Sekarang</span>
                        </div>
                      )}
                    </button>
                  </form>
                )}

                {/* Features Preview */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Package, title: 'Track Orders', color: 'from-blue-500 to-blue-600' },
                    { icon: Heart, title: 'Wishlist', color: 'from-red-500 to-red-600' },
                    { icon: User, title: 'Profile', color: 'from-green-500 to-green-600' }
                  ].map((feature, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xs font-semibold text-gray-900">{feature.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <UserCircle className="w-10 h-10 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600">Welcome back, {user?.name || 'John Doe'}!</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {accountStats.map((stat, index) => (
            <div key={index} className={`p-6 ${stat.bgColor} rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 group-hover:scale-105`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="px-2 py-1 bg-white text-gray-700 text-xs rounded-full font-medium">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {accountMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="group"
                  >
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-600">{item.description}</p>
                      {item.badge && (
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <Link
                  href="/account/orders"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              {!isLoggedIn && (
                <Link
                  href="/account/login"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
              <div className="space-y-4">
                {[
                  { id: '12345', date: 'Jan 15, 2024', status: 'Delivered', total: 'Rp 750.000', items: 3 },
                  { id: '12346', date: 'Jan 12, 2024', status: 'Shipped', total: 'Rp 450.000', items: 2 },
                  { id: '12347', date: 'Jan 10, 2024', status: 'Processing', total: 'Rp 1.250.000', items: 1 }
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{order.total}</p>
                      <p className="text-sm text-gray-600">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <activity.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Benefits */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Member Benefits</h2>
              <div className="space-y-4">
                {[
                  { icon: Award, title: 'Exclusive Rewards', description: 'Earn points with every purchase', color: 'from-purple-500 to-purple-600' },
                  { icon: Shield, title: 'Buyer Protection', description: 'Secure shopping guarantee', color: 'from-green-500 to-green-600' },
                  { icon: TrendingUp, title: 'Early Access', description: 'New products & sales first', color: 'from-orange-500 to-orange-600' }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${benefit.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <benefit.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{benefit.title}</h3>
                      <p className="text-xs text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
