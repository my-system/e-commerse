"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Package, 
  Heart, 
  LogOut, 
  MapPin,
  Shield,
  CreditCard,
  ShoppingBag,
  Award,
  Settings,
  Home,
  Plus,
  Upload,
  Camera,
  X,
  Check,
  Star,
  TrendingUp,
  Bell,
  ChevronRight,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Calendar,
  Globe,
  Flag
} from 'lucide-react';

export default function ModernUserDashboard() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('profile');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+62 812-3456-7890',
    birthDate: '1990-01-01',
    gender: 'male',
    bio: 'Passionate about technology and design',
    newsletter: true
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Rumah',
      recipient: 'John Doe',
      phone: '+62 812-3456-7890',
      address: 'Jl. Sudirman No. 123, RT 01/RW 02',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12345',
      isDefault: true
    },
    {
      id: 2,
      label: 'Kantor',
      recipient: 'John Doe',
      phone: '+62 812-3456-7890',
      address: 'Jl. Gatot Subroto No. 456, Suite 789',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      postalCode: '12345',
      isDefault: false
    }
  ]);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [forceFetch, setForceFetch] = useState(false);

  // User stats
  const userStats = {
    totalOrders: 24,
    rewardPoints: 2450,
    availableVouchers: 8,
    totalSpent: 'Rp 4.2M',
    memberLevel: 'Gold',
    nextReward: '500 points to Platinum'
  };

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'addresses', label: 'Alamat', icon: MapPin },
    { id: 'orders', label: 'Pesanan Saya', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'logout', label: 'Keluar', icon: LogOut }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      router.push('/login');
    }
  }, [isLoggedIn, isLoading, router]);

  // Read tab parameter and auto-set active section
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'orders') {
      setActiveSection('orders');
      setForceFetch(true);
      // Remove query parameter silently
      router.replace('/user', { scroll: false });
    }
  }, [searchParams, router]);

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeSection === 'orders' && user?.id) {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        setOrdersError(null);
        
        try {
          const response = await fetch(`/api/user/orders?t=${Date.now()}`, {
            cache: 'no-store'
          });
          const data = await response.json();

          if (data.success) {
            setOrders(data.orders);
          } else {
            setOrdersError(data.error || 'Gagal memuat pesanan');
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
          setOrdersError('Terjadi kesalahan saat memuat pesanan');
        } finally {
          setOrdersLoading(false);
          setForceFetch(false);
        }
      };

      fetchOrders();
    }
  }, [activeSection, user?.id, forceFetch]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload
      setTimeout(() => {
        setIsUploading(false);
      }, 2000);
    }
  };

  const handleAddAddress = () => {
    const newAddress = {
      id: Date.now(),
      label: 'Alamat Baru',
      recipient: profileForm.firstName + ' ' + profileForm.lastName,
      phone: profileForm.phone,
      address: '',
      city: '',
      province: '',
      postalCode: '',
      isDefault: false
    };
    setAddresses([...addresses, newAddress]);
  };

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic
    console.log('Password change submitted');
    setShowPasswordForm(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">LUXE</h1>
            </div>

            {/* User Profile Summary */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{profileForm.firstName} {profileForm.lastName}</h3>
                  <p className="text-sm text-gray-600">{userStats.memberLevel} Member</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Reward Points</span>
                <span className="font-semibold text-blue-600">{userStats.rewardPoints}</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.id === 'logout' ? handleLogout() : setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'wishlist' && (
                    <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">18</span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {sidebarItems.find(item => item.id === activeSection)?.label}
                  </h1>
                  <p className="text-gray-600 mt-1">Kelola informasi akun Anda</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Bell className="w-4 h-4" />
                  <span>Notifikasi</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">+12%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{userStats.totalOrders}</h3>
                <p className="text-sm text-gray-600">Total Pesanan</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">+150</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{userStats.rewardPoints.toLocaleString()}</h3>
                <p className="text-sm text-gray-600">Poin Reward</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm text-orange-600 font-medium">+2</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{userStats.availableVouchers}</h3>
                <p className="text-sm text-gray-600">Voucher Tersedia</p>
              </div>
            </div>

            {/* Dynamic Content Based on Active Section */}
            {activeSection === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Informasi Profil</h2>
                
                {/* Profile Picture Upload */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Foto Profil</label>
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                        <User className="w-12 h-12 text-white" />
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 w-24 h-24 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </button>
                      {isUploading && (
                        <div className="absolute inset-0 w-24 h-24 bg-white/80 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Upload foto profil Anda</p>
                      <p className="text-xs text-gray-500">Format: JPG, PNG (Max. 2MB)</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Depan</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Belakang</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          value={profileForm.birthDate}
                          onChange={(e) => setProfileForm({...profileForm, birthDate: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        value={profileForm.gender}
                        onChange={(e) => setProfileForm({...profileForm, gender: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="male">Pria</option>
                        <option value="female">Wanita</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newsletter"
                      checked={profileForm.newsletter}
                      onChange={(e) => setProfileForm({...profileForm, newsletter: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
                      Saya ingin menerima newsletter dan penawaran khusus
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Simpan Perubahan
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'addresses' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Daftar Alamat</h2>
                    <button
                      onClick={handleAddAddress}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Alamat
                    </button>
                  </div>

                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-semibold text-gray-900">{address.label}</h3>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">Utama</span>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>{address.recipient}</p>
                              <p>{address.phone}</p>
                              <p>{address.address}</p>
                              <p>{address.city}, {address.province} {address.postalCode}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Pesanan Saya</h2>
                
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-12">
                    <X className="w-16 h-16 text-red-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">{ordersError}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Coba Lagi
                    </button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Belum ada pesanan</p>
                    <Link href="/marketplace" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <ShoppingBag className="w-4 h-4" />
                      Mulai Belanja
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        {/* Order Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                INV-{order.id.slice(0, 8).toUpperCase()}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              Rp {order.total.toLocaleString('id-ID')}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.orderItems.length} produk
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-t border-gray-200 pt-4 mb-4">
                          <div className="space-y-3">
                            {order.orderItems.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.product?.images ? JSON.parse(item.product.images)[0] || '/placeholder.png' : '/placeholder.png'}
                                    alt={item.product?.title || 'Produk'}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {item.product?.title || 'Produk'}
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {item.size ? `Size: ${item.size}` : ''} 
                                    {item.color ? ` | Color: ${item.color}` : ''}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                                  </p>
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              {order.address}
                            </div>
                            <Link
                              href={`/orders/${order.id}/payment`}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Lihat Detail
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'wishlist' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Wishlist Saya</h2>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Wishlist Anda kosong</p>
                  <Link href="/products" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                    Jelajahi Produk
                  </Link>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Keamanan Akun</h2>
                  
                  {!showPasswordForm ? (
                    <div>
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Password</h3>
                        <p className="text-sm text-gray-600 mb-4">Ubah password Anda secara berkala untuk keamanan akun</p>
                        <button
                          onClick={() => setShowPasswordForm(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Ubah Password
                        </button>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600 mb-4">Tambahkan lapisan keamanan ekstra ke akun Anda</p>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Aktifkan 2FA
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password Saat Ini</label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Update Password
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPasswordForm(false)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
