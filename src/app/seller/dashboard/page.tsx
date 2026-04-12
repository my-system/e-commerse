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
import { RoleGuard } from '@/components/auth/RoleGuard';
import { motion } from 'framer-motion';

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

// Animated Counter Component
function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2 }: { 
  value: number; 
  prefix?: string; 
  suffix?: string; 
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString('id-ID')}{suffix}
    </span>
  );
}

// Animated Card Component
function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
      }}
      className="bg-white rounded-lg shadow-sm border p-6"
    >
      {children}
    </motion.div>
  );
}

// Pulse Animation Component
function PulseAnimation({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
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
    <RoleGuard allowedRoles={['SELLER', 'ADMIN']}>
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
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white relative overflow-hidden"
        >
          {/* Background Animation */}
          <div className="absolute inset-0">
            <motion.div
              animate={{
                x: [0, 100, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full"
            />
            <motion.div
              animate={{
                x: [0, -80, 0],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute -bottom-8 -left-8 w-24 h-24 bg-white rounded-full"
            />
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-2">Selamat Datang Kembali!</h2>
              <p className="text-blue-100">Berikut adalah ringkasan performa toko Anda</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hidden lg:block text-right"
            >
              <PulseAnimation>
                <div>
                  <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-blue-100">Total Pendapatan</p>
                </div>
              </PulseAnimation>
            </motion.div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedCard delay={0.1}>
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="p-2 bg-blue-100 rounded-lg"
              >
                <DollarSign className="h-6 w-6 text-blue-600" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`flex items-center ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                <motion.div
                  animate={{ rotate: stats.revenueGrowth >= 0 ? [0, 10, 0] : [0, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  {stats.revenueGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </motion.div>
                <span className="text-sm font-medium ml-1">{Math.abs(stats.revenueGrowth)}%</span>
              </motion.div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              <AnimatedCounter value={stats.totalRevenue} prefix="Rp " duration={2.5} />
            </h3>
            <p className="text-gray-600 text-sm">Total Pendapatan</p>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 15 }}
                transition={{ duration: 0.3 }}
                className="p-2 bg-green-100 rounded-lg"
              >
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className={`flex items-center ${stats.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                <motion.div
                  animate={{ rotate: stats.orderGrowth >= 0 ? [0, 10, 0] : [0, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  {stats.orderGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </motion.div>
                <span className="text-sm font-medium ml-1">{Math.abs(stats.orderGrowth)}%</span>
              </motion.div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              <AnimatedCounter value={stats.totalOrders} duration={2} />
            </h3>
            <p className="text-gray-600 text-sm">Total Pesanan</p>
          </AnimatedCard>

          <AnimatedCard delay={0.3}>
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                whileHover={{ scale: 1.2, rotate: -15 }}
                transition={{ duration: 0.3 }}
                className="p-2 bg-purple-100 rounded-lg"
              >
                <Users className="h-6 w-6 text-purple-600" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className={`flex items-center ${stats.customerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                <motion.div
                  animate={{ rotate: stats.customerGrowth >= 0 ? [0, 10, 0] : [0, -10, 0] }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  {stats.customerGrowth >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </motion.div>
                <span className="text-sm font-medium ml-1">{Math.abs(stats.customerGrowth)}%</span>
              </motion.div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              <AnimatedCounter value={stats.totalCustomers} duration={2.2} />
            </h3>
            <p className="text-gray-600 text-sm">Total Pelanggan</p>
          </AnimatedCard>

          <AnimatedCard delay={0.4}>
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 20 }}
                transition={{ duration: 0.3 }}
                className="p-2 bg-orange-100 rounded-lg"
              >
                <Package className="h-6 w-6 text-orange-600" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center text-gray-600"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-sm font-medium">{stats.totalProducts} produk</span>
                </motion.div>
              </motion.div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              <AnimatedCounter value={stats.averageOrderValue} prefix="Rp " duration={2.8} />
            </h3>
            <p className="text-gray-600 text-sm">Rata-rata Order</p>
          </AnimatedCard>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-8"
        >
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg font-semibold text-gray-900 mb-4"
          >
            Aksi Cepat
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { href: "/seller/addproduct", icon: Plus, color: "blue", label: "Tambah Produk" },
              { href: "/seller/orders", icon: ShoppingCart, color: "green", label: "Lihat Pesanan" },
              { href: "/seller/inventory", icon: Package, color: "purple", label: "Inventory" },
              { href: "/seller/analytics", icon: BarChart3, color: "orange", label: "Analitik" },
              { href: "/seller/products", icon: Edit, color: "pink", label: "Kelola Produk" },
              { href: "/seller/settings", icon: Settings, color: "gray", label: "Pengaturan" }
            ].map((action, index) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.9 + index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={action.href}
                  className={`flex flex-col items-center p-4 bg-${action.color}-50 rounded-lg hover:bg-${action.color}-100 transition-colors duration-200`}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`h-6 w-6 text-${action.color}-600 mb-2`}
                  >
                    <action.icon />
                  </motion.div>
                  <span className="text-sm text-gray-700">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="text-lg font-semibold text-gray-900"
                >
                  Pesanan Terbaru
                </motion.h2>
                <motion.div
                  whileHover={{ scale: 1.1, x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href="/seller/orders"
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Lihat Semua
                  </Link>
                </motion.div>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 1.3 + index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      x: 5,
                      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)"
                    }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                        className="p-2 bg-white rounded-lg"
                      >
                        <ShoppingCart className="h-5 w-5 text-gray-600" />
                      </motion.div>
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.4 + index * 0.1 }}
                        className="font-medium text-gray-900"
                      >
                        {formatCurrency(order.total)}
                      </motion.p>
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 1.5 + index * 0.1 }}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                      >
                        <motion.div
                          animate={{ rotate: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {getStatusIcon(order.status)}
                        </motion.div>
                        <span className="ml-1">{getStatusText(order.status)}</span>
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

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
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                  className="text-lg font-semibold text-gray-900"
                >
                  Notifikasi
                </motion.h2>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Bell className="h-5 w-5 text-gray-400" />
                </motion.div>
              </div>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 1.7 + index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      x: -5,
                      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)"
                    }}
                    className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}
                  >
                    <div className="flex items-start space-x-3">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        transition={{ duration: 0.3 }}
                      >
                        {getNotificationIcon(notification.type)}
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(notification.timestamp)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                  className="text-lg font-semibold text-gray-900"
                >
                  Aktivitas Terbaru
                </motion.h2>
                <motion.div
                  animate={{ rotate: [0, 180, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MoreHorizontal className="h-5 w-5 text-gray-400" />
                </motion.div>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 1.9 + index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)"
                    }}
                    className="flex items-start space-x-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: -15 }}
                      transition={{ duration: 0.3 }}
                      className={`h-5 w-5 ${activity.color} mt-0.5`}
                    >
                      <activity.icon />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(activity.timestamp)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.0 }}
                className="text-lg font-semibold text-gray-900 mb-4"
              >
                Performa
              </motion.h2>
              <div className="space-y-4">
                {[
                  { label: "Konversi", value: `${stats.conversionRate}%`, delay: 2.1 },
                  { label: "Rating Rata-rata", value: "4.7 ⭐", delay: 2.2 },
                  { label: "Waktu Respons", value: "2.5 jam", delay: 2.3 },
                  { label: "Produk Aktif", value: stats.totalProducts, delay: 2.4, isNumber: true }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: item.delay,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      x: -3,
                      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)"
                    }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: item.delay + 0.2 }}
                      className="text-sm font-medium text-gray-900"
                    >
                      {item.isNumber ? (
                        <AnimatedCounter value={item.value} duration={1} />
                      ) : (
                        item.value
                      )}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </RoleGuard>
  );
}
