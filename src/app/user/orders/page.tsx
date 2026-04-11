"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ScrollAnimation from '@/components/ui/ScrollAnimation';
import AnimatedCard from '@/components/ui/AnimatedCard';
import AnimatedText from '@/components/ui/AnimatedText';
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
  Flag,
  Search,
  Filter,
  Truck,
  CheckCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Download,
  MessageSquare
} from 'lucide-react';

export default function ModernUserDashboard() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('orders');
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

  // Orders states
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      router.push('/user');
    }
  }, [isLoggedIn, isLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch('/api/orders');
        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          setOrdersError(data.error || 'Gagal memuat pesanan');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrdersError('Terjadi kesalahan saat memuat pesanan');
      }
    };

    fetchOrders();
  }, [user?.id]);

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

  const getStatusConfig = (status: string) => {
    const configs: Record<string, {
      label: string;
      color: string;
      icon: any;
      description: string;
    }> = {
      pending: {
        label: 'Menunggu Pembayaran',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        description: 'Silakan selesaikan pembayaran'
      },
      processing: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Package,
        description: 'Pesanan sedang disiapkan'
      },
      shipped: {
        label: 'Dikirim',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: Truck,
        description: 'Pesanan dalam perjalanan'
      },
      delivered: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        description: 'Pesanan telah diterima'
      },
      cancelled: {
        label: 'Dibatalkan',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: X,
        description: 'Pesanan dibatalkan'
      }
    };
    return configs[status] || configs.pending;
  };

  const filteredOrders = orders.filter((order: any) => {
    const orderNumber = order.id;
    const products = order.orderItems || [];
    const matchesSearch = orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         products.some((item: any) => item.product?.title?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pesanan Saya</h1>
              <p className="text-gray-600 mt-1">Lihat riwayat dan status pesanan Anda</p>
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
          <AnimatedCard delay={100} animation="slide-up">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <AnimatedText delay={200} animation="typewriter" speed={100}>
                  <span className="text-sm text-green-600 font-medium">+12%</span>
                </AnimatedText>
              </div>
              <AnimatedText delay={300} animation="fade-in">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{userStats.totalOrders}</h3>
              </AnimatedText>
              <p className="text-sm text-gray-600">Total Pesanan</p>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={200} animation="slide-up">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <AnimatedText delay={300} animation="typewriter" speed={100}>
                  <span className="text-sm text-green-600 font-medium">+150</span>
                </AnimatedText>
              </div>
              <AnimatedText delay={400} animation="fade-in">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{userStats.rewardPoints.toLocaleString()}</h3>
              </AnimatedText>
              <p className="text-sm text-gray-600">Poin Reward</p>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={300} animation="slide-up">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <AnimatedText delay={400} animation="typewriter" speed={100}>
                  <span className="text-sm text-orange-600 font-medium">+2</span>
                </AnimatedText>
              </div>
              <AnimatedText delay={500} animation="fade-in">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{userStats.availableVouchers}</h3>
              </AnimatedText>
              <p className="text-sm text-gray-600">Voucher Tersedia</p>
            </div>
          </AnimatedCard>
        </div>

        {/* Search and Filter */}
        <ScrollAnimation delay={600}>
          <AnimatedCard animation="scale-up">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <AnimatedText animation="fade-in" speed={50}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Cari pesanan berdasarkan nomor atau nama produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Semua Status</option>
                      <option value="pending">Menunggu Pembayaran</option>
                      <option value="processing">Diproses</option>
                      <option value="shipped">Dikirim</option>
                      <option value="delivered">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                    
                    <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <RefreshCw className="w-4 h-4" />
                      <span className="hidden md:inline">Refresh</span>
                    </button>
                  </div>
                </div>
              </AnimatedText>
            </div>
          </AnimatedCard>
        </ScrollAnimation>

        {/* Orders List */}
        {ordersError ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <X className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-gray-600 mb-6">
              {ordersError}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'Tidak ada pesanan yang cocok' : 'Belum ada pesanan'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Mulai berbelanja untuk melihat pesanan Anda di sini'
              }
            </p>
            <Link href="/marketplace" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ShoppingBag className="w-4 h-4" />
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order: any) => {
              const statusConfig = getStatusConfig(order.status.toLowerCase());
              const StatusIcon = statusConfig.icon;
              const products = order.orderItems || [];
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1 inline" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{statusConfig.description}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">Rp {order.total.toLocaleString('id-ID')}</p>
                        <p className="text-sm text-gray-600">{products.length} produk</p>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="space-y-3">
                        {products.map((item: any, index: number) => (
                          <div key={index} className="flex items-center gap-4">
                            {item.product?.images ? (
                              <img
                                src={JSON.parse(item.product.images)[0] || '/placeholder.png'}
                                alt={item.product?.title || 'Produk'}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{item.product?.title || 'Produk'}</h4>
                              <p className="text-xs text-gray-500">{item.size ? `Size: ${item.size}` : ''} {item.color ? `Color: ${item.color}` : ''}</p>
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

                    {/* Shipping Info */}
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Alamat Pengiriman</p>
                          <p className="text-sm text-gray-600">{order.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {order.status.toLowerCase() === 'pending' && (
                            <Link 
                              href={`/orders/${order.id}/payment`}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Bayar Sekarang
                            </Link>
                          )}
                          
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4 inline mr-1" />
                            Invoice
                          </button>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link
                            href={`/orders/${order.id}/payment`}
                            className="px-4 py-2 text-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            Lihat Detail
                            <ArrowRight className="w-4 h-4 inline ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
