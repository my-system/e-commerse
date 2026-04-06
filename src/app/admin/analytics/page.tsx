"use client";

import { useState, useEffect } from 'react';
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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error || 'Data tidak tersedia'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-blue-400 mr-3" />
              <h1 className="text-xl font-semibold text-white font-['Inter']">Admin Analytics</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-white font-['Inter']"
                >
                  <option value="7d">7 Hari</option>
                  <option value="30d">30 Hari</option>
                  <option value="90d">90 Hari</option>
                  <option value="1y">1 Tahun</option>
                </select>
              </div>
              <button
                onClick={exportAnalytics}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 font-['Inter']"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={fetchAnalyticsData}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 font-['Inter']"
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
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-400 truncate font-['Inter']">Total Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1 font-['Inter']">
                    {formatCompactCurrency(analyticsData.overview.totalRevenue)}
                  </p>
                  <div className="flex items-center mt-2">
                    {getGrowthIcon(analyticsData.growth.revenueGrowth)}
                    <span className={`text-sm font-medium ml-1 font-['Inter'] ${getGrowthColor(analyticsData.growth.revenueGrowth)}`}>
                      {analyticsData.growth.revenueGrowth}%
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <DollarSign className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-400 truncate font-['Inter']">Total Orders</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1 font-['Inter']">
                    {formatNumber(analyticsData.overview.totalOrders)}
                  </p>
                  <div className="flex items-center mt-2">
                    {getGrowthIcon(analyticsData.growth.orderGrowth)}
                    <span className={`text-sm font-medium ml-1 font-['Inter'] ${getGrowthColor(analyticsData.growth.orderGrowth)}`}>
                      {analyticsData.growth.orderGrowth}%
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <ShoppingCart className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-400 truncate font-['Inter']">Total Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1 font-['Inter']">
                    {formatNumber(analyticsData.overview.totalUsers)}
                  </p>
                  <div className="flex items-center mt-2">
                    {getGrowthIcon(analyticsData.growth.userGrowth)}
                    <span className={`text-sm font-medium ml-1 font-['Inter'] ${getGrowthColor(analyticsData.growth.userGrowth)}`}>
                      {analyticsData.growth.userGrowth}%
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <Users className="h-8 w-8 text-violet-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-400 truncate font-['Inter']">Platform Commission</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1 font-['Inter']">
                    {formatCompactCurrency(analyticsData.overview.platformCommission)}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-slate-500 font-['Inter']">
                      {((analyticsData.overview.platformCommission / analyticsData.overview.totalRevenue) * 100).toFixed(1)}% dari revenue
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <CreditCard className="h-8 w-8 text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Revenue Chart */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white font-['Inter']">Revenue Trend</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMetric('revenue')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors font-['Inter'] ${
                    selectedMetric === 'revenue' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setSelectedMetric('orders')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors font-['Inter'] ${
                    selectedMetric === 'orders' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setSelectedMetric('users')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors font-['Inter'] ${
                    selectedMetric === 'users' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Users
                </button>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.monthlyRevenue}>
                  <defs>
                    <linearGradient id="adminColorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" strokeOpacity={0.2} horizontal={true} vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b"
                    fontSize={12}
                    fontFamily="'Inter', sans-serif"
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    fontFamily="'Inter', sans-serif"
                    tickFormatter={(value) => formatCompactCurrency(value)}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatCompactCurrency(value), selectedMetric === 'revenue' ? 'Revenue' : selectedMetric === 'orders' ? 'Orders' : 'Users']}
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#fff' }}
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
          </div>

          {/* Order Status Distribution */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white font-['Inter']">Order Status</h3>
              <PieChart className="h-5 w-5 text-slate-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
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
                    innerRadius={60}
                    outerRadius={80}
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
                      backgroundColor: '#0f172a', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { name: 'Delivered', value: analyticsData.orderStatus.delivered, color: '#10b981', icon: CheckCircle },
                { name: 'Shipped', value: analyticsData.orderStatus.shipped, color: '#3b82f6', icon: Truck },
                { name: 'Processing', value: analyticsData.orderStatus.processing, color: '#f59e0b', icon: Clock },
                { name: 'Pending', value: analyticsData.orderStatus.pending, color: '#f97316', icon: AlertCircle },
                { name: 'Cancelled', value: analyticsData.orderStatus.cancelled, color: '#ef4444', icon: XCircle }
              ].map((status) => (
                <div key={status.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <status.icon className={`h-4 w-4 mr-2`} style={{ color: status.color }} />
                    <span className="text-sm text-slate-300 font-['Inter']">{status.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white font-['Inter']">{formatNumber(status.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Sellers & Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Sellers */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white font-['Inter']">Top Sellers</h3>
              <Store className="h-5 w-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {analyticsData.topSellers.map((seller, index) => (
                <div key={seller.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 border border-blue-500/30">
                      <span className="text-sm font-medium text-blue-400 font-['Inter']">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white font-['Inter']">{seller.name}</p>
                      <p className="text-xs text-slate-500 font-['Inter']">{seller.products} products</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white font-['Inter']">{formatCompactCurrency(seller.revenue)}</p>
                    <div className="flex items-center justify-end">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-xs text-slate-400 font-['Inter']">{seller.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white font-['Inter']">Top Products</h3>
              <Package className="h-5 w-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3 border border-emerald-500/30">
                      <span className="text-sm font-medium text-emerald-400 font-['Inter']">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white font-['Inter'] line-clamp-1">{product.title}</p>
                      <p className="text-xs text-slate-500 font-['Inter']">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white font-['Inter']">{formatNumber(product.sales)} sold</p>
                    <div className="flex items-center justify-end">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-xs text-slate-400 font-['Inter']">{product.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white font-['Inter']">Category Performance</h3>
            <ChartBar className="h-5 w-5 text-slate-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.categoryPerformance.map((category, index) => (
              <div key={category.category} className="p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-white font-['Inter']">{category.category}</h4>
                  <div className="flex items-center">
                    {getGrowthIcon(category.growth)}
                    <span className={`text-xs font-medium ml-1 font-['Inter'] ${getGrowthColor(category.growth)}`}>
                      {category.growth}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-['Inter']">Revenue</span>
                    <span className="font-medium text-white font-['Inter']">{formatCompactCurrency(category.revenue)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-['Inter']">Orders</span>
                    <span className="font-medium text-white font-['Inter']">{formatNumber(category.orders)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-['Inter']">Products</span>
                    <span className="font-medium text-white font-['Inter']">{formatNumber(category.products)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-['Inter']">Avg Order Value</p>
                <p className="text-xl font-bold text-white font-['Inter']">{formatCurrency(analyticsData.overview.averageOrderValue)}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-['Inter']">Conversion Rate</p>
                <p className="text-xl font-bold text-white font-['Inter']">{analyticsData.overview.conversionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-400" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-['Inter']">Total Sellers</p>
                <p className="text-xl font-bold text-white font-['Inter']">{formatNumber(analyticsData.overview.totalSellers)}</p>
              </div>
              <Store className="h-8 w-8 text-violet-400" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-['Inter']">Total Products</p>
                <p className="text-xl font-bold text-white font-['Inter']">{formatNumber(analyticsData.overview.totalProducts)}</p>
              </div>
              <Package className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
