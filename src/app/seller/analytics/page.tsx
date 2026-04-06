"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  LineChart,
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

// Custom bar shape untuk glowing effect yang lebih presisi
const GlowingBar = (props: any) => {
  const { fill, x, y, width, height, dataKey } = props;
  
  return (
    <g>
      {/* Sharp glow effect - hanya di bagian atas */}
      <defs>
        <filter id={`${dataKey}TopGlow`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 0.8 0.8 0.8 0.8 0.8 0.8 0.8 0.8 0.8"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main bar dengan gradient yang memudar sempurna */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={`url(#${dataKey}Gradient)`}
        filter={`url(#${dataKey}TopGlow)`}
        rx={8}
        ry={8}
        className="transition-all duration-300 hover:opacity-90"
        style={{
          cursor: 'pointer'
        }}
      />
    </g>
  );
};

interface SalesData {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  growthRate: number;
}

interface DailySales {
  date: string;
  sales: number;
  revenue: number;
  orders: number;
}

interface TopProduct {
  id: string;
  title: string;
  sales: number;
  revenue: number;
  category: string;
}

interface CategorySales {
  category: string;
  sales: number;
  revenue: number;
  percentage: number;
}

export default function SellerAnalyticsPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [salesData, setSalesData] = useState<SalesData>({
    totalSales: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    growthRate: 0
  });
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Colors for pie chart - neon colors
  const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

  // Animation state untuk bar chart
  const [animationKey, setAnimationKey] = useState(0);
  
  // Trigger animation saat data berubah
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [dailySales, dateRange]);

  useEffect(() => {
    if (!isLoading) {
      fetchAnalyticsData();
    }
  }, [isLoading, dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration - in real app, fetch from API
      const mockSalesData: SalesData = {
        totalSales: 1250,
        totalRevenue: 87500000,
        totalOrders: 423,
        totalCustomers: 312,
        averageOrderValue: 206857,
        growthRate: 12.5
      };

      const mockDailySales: DailySales[] = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 50) + 20,
        revenue: Math.floor(Math.random() * 5000000) + 1000000,
        orders: Math.floor(Math.random() * 20) + 5
      }));

      const mockTopProducts: TopProduct[] = [
        { id: '1', title: 'Kemeja Formal Premium', sales: 145, revenue: 29000000, category: 'Fashion' },
        { id: '2', title: 'Sepatu Sneakers Sport', sales: 98, revenue: 14700000, category: 'Shoes' },
        { id: '3', title: 'Tas Leather Handbag', sales: 76, revenue: 11400000, category: 'Bags' },
        { id: '4', title: 'Jam Tangan Elegant', sales: 62, revenue: 9300000, category: 'Accessories' },
        { id: '5', title: 'Kaos Casual Comfort', sales: 58, revenue: 5800000, category: 'Fashion' }
      ];

      const mockCategorySales: CategorySales[] = [
        { category: 'Fashion', sales: 485, revenue: 48500000, percentage: 35.2 },
        { category: 'Shoes', sales: 298, revenue: 23840000, percentage: 21.6 },
        { category: 'Bags', sales: 187, revenue: 14960000, percentage: 13.5 },
        { category: 'Accessories', sales: 156, revenue: 12480000, percentage: 11.3 },
        { category: 'Jewelry', sales: 124, revenue: 7800000, percentage: 8.9 }
      ];

      setSalesData(mockSalesData);
      setDailySales(mockDailySales);
      setTopProducts(mockTopProducts);
      setCategorySales(mockCategorySales);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Gagal memuat data analitik');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const exportData = () => {
    // Create CSV content
    const csvContent = [
      ['Tanggal', 'Penjualan', 'Pendapatan', 'Pesanan'],
      ...dailySales.map(day => [
        formatDate(day.date),
        day.sales,
        formatCurrency(day.revenue),
        day.orders
      ])
    ].map(row => row.join(',')).join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-analytics-${dateRange}.csv`;
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-blue-400 mr-3" />
              <h1 className="text-xl font-semibold text-white font-['Inter']">Analitik Penjualan</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-4 py-2 bg-slate-800 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-['Inter']"
              >
                <option value="7d">7 Hari Terakhir</option>
                <option value="30d">30 Hari Terakhir</option>
                <option value="90d">90 Hari Terakhir</option>
                <option value="1y">1 Tahun</option>
              </select>
              <button
                onClick={exportData}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-['Inter'] font-medium"
              >
                <Download className="h-4 w-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-['Inter']">Total Penjualan</p>
                <p className="text-2xl font-bold text-white font-['Inter']">{formatNumber(salesData.totalSales)}</p>
                <div className="flex items-center mt-1">
                  {salesData.growthRate > 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm font-['Inter'] ${salesData.growthRate > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {Math.abs(salesData.growthRate)}%
                  </span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-['Inter']">Pendapatan</p>
                <p className="text-2xl font-bold text-white font-['Inter']">{formatCurrency(salesData.totalRevenue)}</p>
                <div className="flex items-center mt-1">
                  {salesData.growthRate > 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm font-['Inter'] ${salesData.growthRate > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {Math.abs(salesData.growthRate)}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-400" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-violet-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-['Inter']">Total Pesanan</p>
                <p className="text-2xl font-bold text-white font-['Inter']">{formatNumber(salesData.totalOrders)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                  <span className="text-sm text-emerald-400 font-['Inter']">8.2%</span>
                </div>
              </div>
              <Package className="h-8 w-8 text-violet-400" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-['Inter']">Pelanggan</p>
                <p className="text-2xl font-bold text-white font-['Inter']">{formatNumber(salesData.totalCustomers)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                  <span className="text-sm text-emerald-400 font-['Inter']">15.3%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-['Inter']">Rata-rata Order</p>
                <p className="text-2xl font-bold text-white font-['Inter']">{formatCurrency(salesData.averageOrderValue)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                  <span className="text-sm text-emerald-400 font-['Inter']">3.7%</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-cyan-400" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-pink-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-['Inter']">Konversi</p>
                <p className="text-2xl font-bold text-white font-['Inter']">3.2%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                  <span className="text-sm text-emerald-400 font-['Inter']">0.5%</span>
                </div>
              </div>
              <PieChart className="h-8 w-8 text-pink-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 font-['Inter']">Trend Penjualan</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailySales}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" strokeOpacity={0.2} horizontal={true} vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="#64748b"
                      fontSize={12}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
                      axisLine={false}
                    />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), 'Pendapatan']}
                      labelFormatter={(label) => formatDate(label)}
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#fff' }}
                      iconType="circle"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fill="url(#colorRevenue)"
                      name="Pendapatan"
                      dot={false}
                      activeDot={{ r: 6, fill: '#3b82f6' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fill="url(#colorSales)"
                      name="Penjualan"
                      dot={false}
                      activeDot={{ r: 6, fill: '#10b981' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-slate-400 font-['Inter']">Tertinggi</p>
                  <p className="font-semibold text-white font-['Inter']">{formatCurrency(Math.max(...dailySales.map(d => d.revenue)))}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-['Inter']">Rata-rata</p>
                  <p className="font-semibold text-white font-['Inter']">
                    {formatCurrency(dailySales.reduce((sum, d) => sum + d.revenue, 0) / dailySales.length)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-['Inter']">Terendah</p>
                  <p className="font-semibold text-white font-['Inter']">{formatCurrency(Math.min(...dailySales.map(d => d.revenue)))}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 font-['Inter']">Distribusi Kategori</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={categorySales}
                      cx="50%"
                      cy="50%"
                      innerRadius={64}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {categorySales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Persentase']}
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
              <div className="mt-6 space-y-3">
                {categorySales.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div 
                        className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm text-slate-300 font-['Inter'] flex-1">{category.category}</span>
                    </div>
                    <span className="text-sm font-bold text-white font-['Inter'] ml-4">{category.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Sales Chart */}
        <div className="mt-8">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 font-['Inter']">Penjualan Harian</h2>
            <div className="h-96 px-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={dailySales.slice(-7)} 
                  key={animationKey}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  barGap={12}
                  barCategoryGap="20%"
                >
                  <defs>
                    {/* Gradient untuk Revenue - lebih presisi */}
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    
                    {/* Gradient untuk Sales - lebih presisi */}
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    
                    {/* Sharp glow filter untuk Revenue */}
                    <filter id="revenueTopGlow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feComponentTransfer>
                        <feFuncA type="discrete" tableValues="0 0.6 0.6 0.6 0.6 0.6 0.6 0.6 0.6 0.6"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    
                    {/* Sharp glow filter untuk Sales */}
                    <filter id="salesTopGlow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feComponentTransfer>
                        <feFuncA type="discrete" tableValues="0 0.6 0.6 0.6 0.6 0.6 0.6 0.6 0.6 0.6"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Grid horizontal yang sangat tipis */}
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="rgba(255,255,255,0.03)" 
                    strokeOpacity={0.5} 
                    horizontal={true} 
                    vertical={false} 
                  />
                  
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#64748b"
                    fontSize={11}
                    fontFamily="'Inter', sans-serif"
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  
                  <YAxis 
                    stroke="#64748b"
                    fontSize={11}
                    fontFamily="'Inter', sans-serif"
                    tickFormatter={(value) => formatCurrency(value)}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  
                  {/* Glassmorphism Tooltip */}
                  <Tooltip 
                    formatter={(value: any, name: any) => {
                      const formattedValue = name === 'revenue' ? formatCurrency(value) : formatNumber(value);
                      const label = name === 'revenue' ? 'Pendapatan' : 'Penjualan';
                      const color = name === 'revenue' ? '#3b82f6' : '#10b981';
                      return [
                        <span key="value" style={{ color, fontWeight: 'bold' }}>{formattedValue}</span>,
                        <span key="label" style={{ color: '#94a3b8' }}>{label}</span>
                      ];
                    }}
                    labelFormatter={(label) => (
                      <span style={{ color: '#cbd5e1', fontSize: '11px' }}>{formatDate(label)}</span>
                    )}
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                      backdropFilter: 'blur(16px)', 
                      border: '1px solid rgba(255,255,255,0.15)', 
                      borderRadius: '16px',
                      color: '#fff',
                      padding: '16px 20px',
                      fontSize: '13px',
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.05)'
                    }}
                    itemStyle={{ 
                      color: '#fff', 
                      margin: '6px 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                    labelStyle={{ 
                      color: '#cbd5e1', 
                      marginBottom: '8px',
                      fontWeight: '500',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      paddingBottom: '8px'
                    }}
                    cursor={false}
                  />
                  
                  <Legend 
                    wrapperStyle={{ 
                      color: '#fff',
                      fontSize: '12px',
                      fontFamily: "'Inter', sans-serif",
                      paddingTop: '24px'
                    }}
                    iconType="circle"
                    iconSize={8}
                  />
                  
                  {/* Revenue Bar dengan custom shape */}
                  <Bar 
                    dataKey="revenue" 
                    fill="#3b82f6"
                    name="Pendapatan"
                    shape={<GlowingBar />}
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                  
                  {/* Sales Bar dengan custom shape */}
                  <Bar 
                    dataKey="sales" 
                    fill="#10b981"
                    name="Penjualan"
                    shape={<GlowingBar />}
                    animationBegin={200}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="mt-8">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 font-['Inter']">Produk Terlaris</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider font-['Inter']">
                      Produk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider font-['Inter']">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider font-['Inter']">
                      Terjual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider font-['Inter']">
                      Pendapatan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-900/30 divide-y divide-white/5">
                  {topProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-slate-800/30 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                            <span className="text-xs font-medium text-blue-400 font-['Inter']">{index + 1}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white font-['Inter']">{product.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-300 font-['Inter']">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-white font-['Inter']">{formatNumber(product.sales)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-emerald-400 font-['Inter']">{formatCurrency(product.revenue)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
