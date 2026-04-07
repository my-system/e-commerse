"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Store, 
  Star, 
  Eye, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CreditCard,
  Truck,
  UserPlus,
  ChartBar,
  PieChart,
  LineChart
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  LineChart as ReLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { motion, useInView, useAnimation } from 'framer-motion';

interface AdminAnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalSellers: number;
    totalProducts: number;
    averageOrderValue: number;
    conversionRate: number;
    platformCommission: number;
  };
  growth: {
    revenueGrowth: number;
    orderGrowth: number;
    userGrowth: number;
    sellerGrowth: number;
    productGrowth: number;
  };
  topSellers: Array<{
    id: string;
    name: string;
    email: string;
    revenue: number;
    orders: number;
    products: number;
    rating: number;
    growth: number;
  }>;
  topProducts: Array<{
    id: string;
    title: string;
    seller: string;
    category: string;
    sales: number;
    revenue: number;
    rating: number;
    stock: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    revenue: number;
    orders: number;
    products: number;
    growth: number;
  }>;
  orderStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  paymentMethods: {
    transfer: number;
    ewallet: number;
    cod: number;
    credit_card: number;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
    users: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'users'>('revenue');

  // Animated Counter Component
  function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2 }: { 
    value: number; 
    prefix?: string; 
    suffix?: string; 
    duration?: number;
  }) {
    const [displayValue, setDisplayValue] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
      if (inView && !isVisible) {
        setIsVisible(true);
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
      }
    }, [inView, isVisible, value, duration]);

    return (
      <span ref={ref}>
        <span>
          {prefix}{displayValue.toLocaleString('id-ID')}{suffix}
        </span>
      </span>
    );
  }

  // Animated Card Component
  function AnimatedCard({ children, delay = 0, className = '' }: { 
    children: React.ReactNode; 
    delay?: number;
    className?: string;
  }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const controls = useAnimation();

    useEffect(() => {
      if (inView) {
        controls.start({
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: delay,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        });
      } else {
        controls.start({
          opacity: 0,
          y: 30
        });
      }
    }, [inView, controls, delay]);

    return (
      <motion.div
        ref={ref}
        animate={controls}
        initial={{ opacity: 0, y: 30 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

  useEffect(() => {
    if (!isLoading) {
      fetchAnalyticsData();
    }
  }, [isLoading, selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockData: AdminAnalyticsData = {
        overview: {
          totalRevenue: 2456789000,
          totalOrders: 12456,
          totalUsers: 45678,
          totalSellers: 892,
          totalProducts: 12456,
          averageOrderValue: 197000,
          conversionRate: 3.2,
          platformCommission: 122839450
        },
        growth: {
          revenueGrowth: 15.3,
          orderGrowth: 12.7,
          userGrowth: 8.9,
          sellerGrowth: 18.2,
          productGrowth: 22.4
        },
        topSellers: [
          {
            id: '1',
            name: 'Toko Fashion Premium',
            email: 'fashion@premium.com',
            revenue: 456789000,
            orders: 2341,
            products: 156,
            rating: 4.8,
            growth: 23.5
          },
          {
            id: '2',
            name: 'Electronics Store',
            email: 'electronics@store.com',
            revenue: 345678000,
            orders: 1876,
            products: 234,
            rating: 4.6,
            growth: 18.2
          },
          {
            id: '3',
            name: 'Beauty Boutique',
            email: 'beauty@boutique.com',
            revenue: 234567000,
            orders: 1456,
            products: 89,
            rating: 4.9,
            growth: 31.7
          },
          {
            id: '4',
            name: 'Sports Equipment',
            email: 'sports@equipment.com',
            revenue: 198765000,
            orders: 987,
            products: 145,
            rating: 4.5,
            growth: 12.3
          },
          {
            id: '5',
            name: 'Home Decor Shop',
            email: 'decor@home.com',
            revenue: 176543000,
            orders: 876,
            products: 112,
            rating: 4.7,
            growth: 28.9
          }
        ],
        topProducts: [
          {
            id: '1',
            title: 'Kemeja Formal Premium',
            seller: 'Toko Fashion Premium',
            category: 'Fashion',
            sales: 567,
            revenue: 113400000,
            rating: 4.8,
            stock: 45
          },
          {
            id: '2',
            title: 'Laptop Gaming Pro',
            seller: 'Electronics Store',
            category: 'Electronics',
            sales: 234,
            revenue: 234000000,
            rating: 4.7,
            stock: 12
          },
          {
            id: '3',
            title: 'Skincare Set Premium',
            seller: 'Beauty Boutique',
            category: 'Beauty',
            sales: 892,
            revenue: 89200000,
            rating: 4.9,
            stock: 78
          },
          {
            id: '4',
            title: 'Sepatu Running Sport',
            seller: 'Sports Equipment',
            category: 'Sports',
            sales: 345,
            revenue: 86250000,
            rating: 4.6,
            stock: 23
          },
          {
            id: '5',
            title: 'Lampu Minimalis Modern',
            seller: 'Home Decor Shop',
            category: 'Home',
            sales: 178,
            revenue: 35600000,
            rating: 4.5,
            stock: 34
          }
        ],
        categoryPerformance: [
          {
            category: 'Fashion',
            revenue: 567890000,
            orders: 3456,
            products: 2341,
            growth: 18.5
          },
          {
            category: 'Electronics',
            revenue: 456789000,
            orders: 2345,
            products: 1567,
            growth: 25.3
          },
          {
            category: 'Beauty',
            revenue: 345678000,
            orders: 2890,
            products: 1234,
            growth: 32.1
          },
          {
            category: 'Sports',
            revenue: 234567000,
            orders: 1567,
            products: 890,
            growth: 15.7
          },
          {
            category: 'Home',
            revenue: 198765000,
            orders: 1234,
            products: 678,
            growth: 28.9
          }
        ],
        orderStatus: {
          pending: 234,
          processing: 567,
          shipped: 890,
          delivered: 10456,
          cancelled: 309
        },
        paymentMethods: {
          transfer: 456789000,
          ewallet: 567890000,
          cod: 234567000,
          credit_card: 1198330000
        },
        monthlyRevenue: [
          { month: 'Jan', revenue: 156789000, orders: 890, users: 1234 },
          { month: 'Feb', revenue: 178901000, orders: 945, users: 1456 },
          { month: 'Mar', revenue: 198765000, orders: 1023, users: 1678 },
          { month: 'Apr', revenue: 234567000, orders: 1156, users: 1890 },
          { month: 'May', revenue: 245678000, orders: 1234, users: 2012 },
          { month: 'Jun', revenue: 267890000, orders: 1345, users: 2234 }
        ]
      };

      setAnalyticsData(mockData);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Gagal memuat data analytics');
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

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)} M`;
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)} Jt`;
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(0)} K`;
    }
    return `Rp ${amount}`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const exportAnalytics = () => {
    if (!analyticsData) return;

    const csvContent = [
      ['Metric', 'Value', 'Growth'],
      ['Total Revenue', formatCurrency(analyticsData.overview.totalRevenue), `${analyticsData.growth.revenueGrowth}%`],
      ['Total Orders', formatNumber(analyticsData.overview.totalOrders), `${analyticsData.growth.orderGrowth}%`],
      ['Total Users', formatNumber(analyticsData.overview.totalUsers), `${analyticsData.growth.userGrowth}%`],
      ['Total Sellers', formatNumber(analyticsData.overview.totalSellers), `${analyticsData.growth.sellerGrowth}%`],
      ['Total Products', formatNumber(analyticsData.overview.totalProducts), `${analyticsData.growth.productGrowth}%`],
      ['Average Order Value', formatCurrency(analyticsData.overview.averageOrderValue), ''],
      ['Conversion Rate', `${analyticsData.overview.conversionRate}%`, ''],
      ['Platform Commission', formatCurrency(analyticsData.overview.platformCommission), '']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-analytics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error || 'Data tidak tersedia'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900 font-['Inter']">Admin Analytics</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 font-['Inter']"
                >
                  <option value="7d">7 Hari</option>
                  <option value="30d">30 Hari</option>
                  <option value="90d">90 Hari</option>
                  <option value="1y">1 Tahun</option>
                </select>
              </div>
              <button
                onClick={exportAnalytics}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 font-['Inter'] shadow-sm hover:shadow-md"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={fetchAnalyticsData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 font-['Inter'] shadow-sm hover:shadow-md"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AnimatedCard delay={0} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-blue-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate font-['Inter']">Total Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 font-['Inter']">
                    <AnimatedCounter value={analyticsData.overview.totalRevenue} prefix="Rp " duration={2.5} />
                  </p>
                  <div className="flex items-center mt-2">
                    {getGrowthIcon(analyticsData.growth.revenueGrowth)}
                    <span className={`text-sm font-medium ml-1 font-['Inter'] ${getGrowthColor(analyticsData.growth.revenueGrowth)}`}>
                      {analyticsData.growth.revenueGrowth}%
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <DollarSign className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.1} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-blue-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate font-['Inter']">Total Orders</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 font-['Inter']">
                    <AnimatedCounter value={analyticsData.overview.totalOrders} duration={2} />
                  </p>
                  <div className="flex items-center mt-2">
                    {getGrowthIcon(analyticsData.growth.orderGrowth)}
                    <span className={`text-sm font-medium ml-1 font-['Inter'] ${getGrowthColor(analyticsData.growth.orderGrowth)}`}>
                      {analyticsData.growth.orderGrowth}%
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-blue-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate font-['Inter']">Total Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 font-['Inter']">
                    <AnimatedCounter value={analyticsData.overview.totalUsers} duration={2.2} />
                  </p>
                  <div className="flex items-center mt-2">
                    {getGrowthIcon(analyticsData.growth.userGrowth)}
                    <span className={`text-sm font-medium ml-1 font-['Inter'] ${getGrowthColor(analyticsData.growth.userGrowth)}`}>
                      {analyticsData.growth.userGrowth}%
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <Users className="h-8 w-8 text-violet-600" />
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.3} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-blue-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate font-['Inter']">Platform Commission</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 font-['Inter']">
                    <AnimatedCounter value={analyticsData.overview.platformCommission} prefix="Rp " duration={2.8} />
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-500 font-['Inter']">
                      {((analyticsData.overview.platformCommission / analyticsData.overview.totalRevenue) * 100).toFixed(1)}% dari revenue
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <CreditCard className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Chart */}
          <AnimatedCard delay={0.4} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-['Inter']">Revenue Trend</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMetric('revenue')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors font-['Inter'] ${
                    selectedMetric === 'revenue' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setSelectedMetric('orders')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors font-['Inter'] ${
                    selectedMetric === 'orders' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setSelectedMetric('users')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors font-['Inter'] ${
                    selectedMetric === 'users' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Users
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.monthlyRevenue} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="adminColorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.05} horizontal={true} vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    fontSize={12}
                    fontFamily="'Inter', sans-serif"
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    fontFamily="'Inter', sans-serif"
                    tickFormatter={(value) => formatCompactCurrency(value)}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatCompactCurrency(value), selectedMetric === 'revenue' ? 'Revenue' : selectedMetric === 'orders' ? 'Orders' : 'Users']}
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      color: '#111827',
                      fontFamily: "'Inter', sans-serif"
                    }}
                    itemStyle={{ color: '#111827', fontFamily: "'Inter', sans-serif" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fill="url(#adminColorRevenue)"
                    dot={false}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>

          {/* Order Status Distribution */}
          <AnimatedCard delay={0.5} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-['Inter']">Order Status</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1 flex items-center justify-center min-h-0">
              <div className="flex items-center gap-8 w-full">
                <div className="relative">
                  <ResponsiveContainer width={240} height={240}>
                    <RePieChart>
                      <Pie
                        data={[
                          { name: 'Delivered', value: analyticsData.orderStatus.delivered, color: '#10b981' },
                          { name: 'Shipped', value: analyticsData.orderStatus.shipped, color: '#3b82f6' },
                          { name: 'Processing', value: analyticsData.orderStatus.processing, color: '#f59e0b' },
                          { name: 'Pending', value: analyticsData.orderStatus.pending, color: '#f97316' },
                          { name: 'Cancelled', value: analyticsData.orderStatus.cancelled, color: '#ef4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Delivered', value: analyticsData.orderStatus.delivered, color: '#10b981' },
                          { name: 'Shipped', value: analyticsData.orderStatus.shipped, color: '#3b82f6' },
                          { name: 'Processing', value: analyticsData.orderStatus.processing, color: '#f59e0b' },
                          { name: 'Pending', value: analyticsData.orderStatus.pending, color: '#f97316' },
                          { name: 'Cancelled', value: analyticsData.orderStatus.cancelled, color: '#ef4444' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [formatNumber(value), 'Orders']}
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '12px',
                          color: '#111827',
                          fontFamily: "'Inter', sans-serif"
                        }}
                        itemStyle={{ color: '#111827', fontFamily: "'Inter', sans-serif" }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-2xl font-bold text-gray-900 font-['Inter']">
                      <AnimatedCounter 
                        value={analyticsData.orderStatus.delivered + analyticsData.orderStatus.shipped + analyticsData.orderStatus.processing + analyticsData.orderStatus.pending + analyticsData.orderStatus.cancelled} 
                        duration={1.5} 
                      />
                    </p>
                    <p className="text-sm text-gray-500 font-['Inter']">Total Orders</p>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  {[
                    { name: 'Delivered', value: analyticsData.orderStatus.delivered, color: '#10b981', icon: CheckCircle },
                    { name: 'Shipped', value: analyticsData.orderStatus.shipped, color: '#3b82f6', icon: Truck },
                    { name: 'Processing', value: analyticsData.orderStatus.processing, color: '#f59e0b', icon: Clock },
                    { name: 'Pending', value: analyticsData.orderStatus.pending, color: '#f97316', icon: AlertCircle },
                    { name: 'Cancelled', value: analyticsData.orderStatus.cancelled, color: '#ef4444', icon: XCircle }
                  ].map((status) => (
                    <div key={status.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: status.color }} />
                        <span className="text-sm text-gray-700 font-['Inter']">{status.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 font-['Inter']">
                        <AnimatedCounter value={status.value} duration={1} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Top Sellers & Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Sellers */}
          <AnimatedCard delay={0.6} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-['Inter']">Top Sellers</h3>
              <Store className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analyticsData.topSellers.map((seller, index) => (
                <div key={seller.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 border border-blue-500/30">
                      <span className="text-sm font-medium text-blue-600 font-['Inter']">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 font-['Inter']">{seller.name}</p>
                      <p className="text-xs text-gray-500 font-['Inter']">{seller.products} products</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 font-['Inter']">
                      <AnimatedCounter value={seller.revenue} prefix="Rp " duration={1.2} />
                    </p>
                    <div className="flex items-center justify-end">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-xs text-gray-500 font-['Inter']">{seller.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>

          {/* Top Products */}
          <AnimatedCard delay={0.7} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 font-['Inter']">Top Products</h3>
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3 border border-emerald-500/30">
                      <span className="text-sm font-medium text-emerald-600 font-['Inter']">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 font-['Inter'] line-clamp-1">{product.title}</p>
                      <p className="text-xs text-gray-500 font-['Inter']">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 font-['Inter']">
                      <AnimatedCounter value={product.sales} suffix=" sold" duration={1} />
                    </p>
                    <div className="flex items-center justify-end">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-xs text-gray-500 font-['Inter']">{product.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>

        {/* Category Performance */}
        <AnimatedCard delay={0.8} className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-md hover:shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 font-['Inter']">Category Performance</h3>
            <ChartBar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.categoryPerformance.map((category, index) => (
              <div key={category.category} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900 font-['Inter']">{category.category}</h4>
                  <div className="flex items-center">
                    {getGrowthIcon(category.growth)}
                    <span className={`text-xs font-medium ml-1 font-['Inter'] ${getGrowthColor(category.growth)}`}>
                      {category.growth}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-['Inter']">Revenue</span>
                    <span className="font-medium text-gray-900 font-['Inter']">
                      <AnimatedCounter value={category.revenue} prefix="Rp " duration={1.3} />
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-['Inter']">Orders</span>
                    <span className="font-medium text-gray-900 font-['Inter']">
                      <AnimatedCounter value={category.orders} duration={1.1} />
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400 font-['Inter']">Products</span>
                    <span className="font-medium text-gray-900 font-['Inter']">
                      <AnimatedCounter value={category.products} duration={0.9} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatedCard delay={0.9} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-['Inter']">Avg Order Value</p>
                <p className="text-xl font-bold text-gray-900 font-['Inter']">
                  <AnimatedCounter value={analyticsData.overview.averageOrderValue} prefix="Rp " duration={1.4} />
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </AnimatedCard>

          <AnimatedCard delay={1.0} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-['Inter']">Conversion Rate</p>
                <p className="text-xl font-bold text-gray-900 font-['Inter']">
                  <AnimatedCounter value={analyticsData.overview.conversionRate} suffix="%" duration={1.5} />
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
          </AnimatedCard>

          <AnimatedCard delay={1.1} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-['Inter']">Total Sellers</p>
                <p className="text-xl font-bold text-gray-900 font-['Inter']">
                  <AnimatedCounter value={analyticsData.overview.totalSellers} duration={1.6} />
                </p>
              </div>
              <Store className="h-8 w-8 text-violet-600" />
            </div>
          </AnimatedCard>

          <AnimatedCard delay={1.2} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-['Inter']">Total Products</p>
                <p className="text-xl font-bold text-gray-900 font-['Inter']">
                  <AnimatedCounter value={analyticsData.overview.totalProducts} duration={1.7} />
                </p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
