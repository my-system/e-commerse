"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  Eye,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  BarChart3,
  PieChart,
  Calendar,
  Bell,
  Settings,
  Plus,
  Edit,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  orderDate: string;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'product' | 'review' | 'inventory';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ElementType;
  color: string;
}

interface TopProduct {
  id: string;
  title: string;
  sales: number;
  revenue: number;
  rating: number;
  stock: number;
  image?: string;
}

interface Notification {
  id: string;
  type: 'low_stock' | 'new_order' | 'review' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    if (!isLoading) {
      fetchDashboardData();
    }
  }, [isLoading, dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock dashboard data
      const mockStats: DashboardStats = {
        totalRevenue: 87500000,
        totalOrders: 423,
        totalProducts: 45,
        totalCustomers: 312,
        averageOrderValue: 206857,
        conversionRate: 3.2,
        revenueGrowth: 12.5,
        orderGrowth: 8.2,
        customerGrowth: 15.3
      };

      const mockRecentOrders: RecentOrder[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          customerName: 'Budi Santoso',
          total: 620000,
          status: 'pending',
          orderDate: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          customerName: 'Siti Nurhaliza',
          total: 340000,
          status: 'confirmed',
          orderDate: '2024-01-14T15:45:00Z'
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          customerName: 'Ahmad Wijaya',
          total: 680000,
          status: 'processing',
          orderDate: '2024-01-13T09:20:00Z'
        },
        {
          id: '4',
          orderNumber: 'ORD-2024-004',
          customerName: 'Dewi Lestari',
          total: 300000,
          status: 'shipped',
          orderDate: '2024-01-12T14:10:00Z'
        },
        {
          id: '5',
          orderNumber: 'ORD-2024-005',
          customerName: 'Rudi Hartono',
          total: 235000,
          status: 'delivered',
          orderDate: '2024-01-11T11:30:00Z'
        }
      ];

      const mockRecentActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'order',
          title: 'Pesanan Baru',
          description: 'ORD-2024-001 - Budi Santoso',
          timestamp: '2024-01-15T10:30:00Z',
          icon: ShoppingCart,
          color: 'text-blue-600'
        },
        {
          id: '2',
          type: 'product',
          title: 'Produk Ditambahkan',
          description: 'Kemeja Casual Premium berhasil ditambahkan',
          timestamp: '2024-01-15T09:15:00Z',
          icon: Package,
          color: 'text-green-600'
        },
        {
          id: '3',
          type: 'review',
          title: 'Review Baru',
          description: 'Produk Sepatu Sneakers mendapat 5 bintang',
          timestamp: '2024-01-14T16:30:00Z',
          icon: Star,
          color: 'text-yellow-600'
        },
        {
          id: '4',
          type: 'inventory',
          title: 'Stok Rendah',
          description: 'Sepatu Boots Formal tersisa 5 item',
          timestamp: '2024-01-14T14:20:00Z',
          icon: AlertTriangle,
          color: 'text-red-600'
        },
        {
          id: '5',
          type: 'order',
          title: 'Pesanan Dikirim',
          description: 'ORD-2024-004 - Dewi Lestari',
          timestamp: '2024-01-12T14:10:00Z',
          icon: Truck,
          color: 'text-purple-600'
        }
      ];

      const mockTopProducts: TopProduct[] = [
        {
          id: '1',
          title: 'Kemeja Formal Premium',
          sales: 145,
          revenue: 29000000,
          rating: 4.8,
          stock: 45,
          image: '/api/placeholder/60/60/product1'
        },
        {
          id: '2',
          title: 'Sepatu Sneakers Sport',
          sales: 98,
          revenue: 14700000,
          rating: 4.6,
          stock: 8,
          image: '/api/placeholder/60/60/product2'
        },
        {
          id: '3',
          title: 'Tas Leather Handbag',
          sales: 76,
          revenue: 22800000,
          rating: 4.9,
          stock: 0,
          image: '/api/placeholder/60/60/product3'
        },
        {
          id: '4',
          title: 'Jam Tangan Elegant',
          sales: 62,
          revenue: 9300000,
          rating: 4.7,
          stock: 75,
          image: '/api/placeholder/60/60/product4'
        },
        {
          id: '5',
          title: 'Kaos Casual Comfort',
          sales: 58,
          revenue: 5800000,
          rating: 4.5,
          stock: 120,
          image: '/api/placeholder/60/60/product5'
        }
      ];

      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'low_stock',
          title: 'Stok Menipis',
          message: '3 produk memiliki stok rendah',
          timestamp: '2024-01-15T08:00:00Z',
          read: false
        },
        {
          id: '2',
          type: 'new_order',
          title: 'Pesanan Baru',
          message: '5 pesanan menunggu konfirmasi',
          timestamp: '2024-01-15T07:30:00Z',
          read: false
        },
        {
          id: '3',
          type: 'review',
          title: 'Review Baru',
          message: 'Produk anda mendapat review 5 bintang',
          timestamp: '2024-01-14T16:30:00Z',
          read: true
        }
      ];

      setStats(mockStats);
      setRecentOrders(mockRecentOrders);
      setRecentActivities(mockRecentActivities);
      setTopProducts(mockTopProducts);
      setNotifications(mockNotifications);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} hari yang lalu`;
    } else if (hours > 0) {
      return `${hours} jam yang lalu`;
    } else {
      return 'Baru saja';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'processing':
        return <Package className="h-4 w-4 text-purple-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Konfirmasi';
      case 'confirmed':
        return 'Dikonfirmasi';
      case 'processing':
        return 'Diproses';
      case 'shipped':
        return 'Dikirim';
      case 'delivered':
        return 'Terkirim';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'new_order':
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Dashboard Toko</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">7 Hari Terakhir</option>
                <option value="30d">30 Hari Terakhir</option>
                <option value="90d">90 Hari Terakhir</option>
                <option value="1y">1 Tahun</option>
              </select>
              <button
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Selamat Datang Kembali!</h2>
              <p className="text-blue-100">Berikut adalah ringkasan performa toko Anda</p>
            </div>
            <div className="hidden lg:block">
              <div className="text-right">
                <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-blue-100">Total Pendapatan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className={`flex items-center ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.revenueGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span className="text-sm font-medium ml-1">{Math.abs(stats.revenueGrowth)}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</h3>
            <p className="text-gray-600 text-sm">Total Pendapatan</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className={`flex items-center ${stats.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.orderGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span className="text-sm font-medium ml-1">{Math.abs(stats.orderGrowth)}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalOrders)}</h3>
            <p className="text-gray-600 text-sm">Total Pesanan</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className={`flex items-center ${stats.customerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.customerGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span className="text-sm font-medium ml-1">{Math.abs(stats.customerGrowth)}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalCustomers)}</h3>
            <p className="text-gray-600 text-sm">Total Pelanggan</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex items-center text-gray-600">
                <span className="text-sm font-medium">{stats.totalProducts} produk</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</h3>
            <p className="text-gray-600 text-sm">Rata-rata Order</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link
              href="/seller/addproduct"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <Plus className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-sm text-gray-700">Tambah Produk</span>
            </Link>
            <Link
              href="/seller/orders"
              className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-sm text-gray-700">Lihat Pesanan</span>
            </Link>
            <Link
              href="/seller/inventory"
              className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
            >
              <Package className="h-6 w-6 text-purple-600 mb-2" />
              <span className="text-sm text-gray-700">Inventory</span>
            </Link>
            <Link
              href="/seller/analytics"
              className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
            >
              <BarChart3 className="h-6 w-6 text-orange-600 mb-2" />
              <span className="text-sm text-gray-700">Analitik</span>
            </Link>
            <Link
              href="/seller/products"
              className="flex flex-col items-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors duration-200"
            >
              <Edit className="h-6 w-6 text-pink-600 mb-2" />
              <span className="text-sm text-gray-700">Kelola Produk</span>
            </Link>
            <Link
              href="/seller/settings"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Settings className="h-6 w-6 text-gray-600 mb-2" />
              <span className="text-sm text-gray-700">Pengaturan</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Pesanan Terbaru</h2>
                <Link
                  href="/seller/orders"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Lihat Semua
                </Link>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(order.total)}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusText(order.status)}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Produk Terlaris</h2>
                <Link
                  href="/seller/analytics"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Lihat Detail
                </Link>
              </div>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.title}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatNumber(product.sales)} terjual</span>
                          <span>•</span>
                          <span>⭐ {product.rating}</span>
                          <span>•</span>
                          <span className={product.stock === 0 ? 'text-red-600' : product.stock <= 10 ? 'text-yellow-600' : 'text-green-600'}>
                            Stok: {product.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Notifikasi</h2>
                <Bell className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(notification.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h2>
                <MoreHorizontal className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <activity.icon className={`h-5 w-5 ${activity.color} mt-0.5`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performa</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Konversi</span>
                  <span className="text-sm font-medium text-gray-900">{stats.conversionRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating Rata-rata</span>
                  <span className="text-sm font-medium text-gray-900">4.7 ⭐</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Waktu Respons</span>
                  <span className="text-sm font-medium text-gray-900">2.5 jam</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Produk Aktif</span>
                  <span className="text-sm font-medium text-gray-900">{stats.totalProducts}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
