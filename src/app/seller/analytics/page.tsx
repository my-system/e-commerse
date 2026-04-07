"use client";

import { useState, useEffect, useRef } from 'react';
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
import { motion, useInView, useAnimation } from 'framer-motion';

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
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
              <h1 className="text-xl font-semibold text-gray-900 font-['Inter']">Analitik Penjualan</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-['Inter']"
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
          <AnimatedCard delay={0} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-['Inter']">Total Penjualan</p>
                <p className="text-2xl font-bold text-gray-900 font-['Inter']">
                  <AnimatedCounter value={salesData.totalSales} duration={2} />
                </p>
                <div className="flex items-center mt-1">
                  {salesData.growthRate > 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-['Inter'] ${salesData.growthRate > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {Math.abs(salesData.growthRate)}%
                  </span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.1} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-['Inter']">Pendapatan</p>
                <p className="text-2xl font-bold text-gray-900 font-['Inter']">
                  <AnimatedCounter value={salesData.totalRevenue} prefix="Rp " duration={2.2} />
                </p>
                <div className="flex items-center mt-1">
                  {salesData.growthRate > 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-['Inter'] ${salesData.growthRate > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {Math.abs(salesData.growthRate)}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-600" />
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-violet-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-['Inter']">Total Pesanan</p>
                <p className="text-2xl font-bold text-gray-900 font-['Inter']">
                  <AnimatedCounter value={salesData.totalOrders} duration={1.8} />
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                  <span className="text-sm text-emerald-600 font-['Inter']">8.2%</span>
                </div>
              </div>
              <Package className="h-8 w-8 text-violet-600" />
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.3} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-orange-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-['Inter']">Pelanggan</p>
                <p className="text-2xl font-bold text-gray-900 font-['Inter']">
                  <AnimatedCounter value={salesData.totalCustomers} duration={2.1} />
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                  <span className="text-sm text-emerald-600 font-['Inter']">15.3%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.4} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-cyan-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-['Inter']">Rata-rata Order</p>
                <p className="text-2xl font-bold text-gray-900 font-['Inter']">
                  <AnimatedCounter value={salesData.averageOrderValue} prefix="Rp " duration={1.9} />
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                  <span className="text-sm text-emerald-600 font-['Inter']">3.7%</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-cyan-600" />
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.5} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-pink-500 transition-all duration-300 shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-['Inter']">Konversi</p>
                <p className="text-2xl font-bold text-gray-900 font-['Inter']">
                  <AnimatedCounter value={3.2} suffix="%" duration={1.5} />
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600 mr-1" />
                  <span className="text-sm text-emerald-600 font-['Inter']">0.5%</span>
                </div>
              </div>
              <PieChart className="h-8 w-8 text-pink-600" />
            </div>
          </AnimatedCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <AnimatedCard delay={0.6} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg h-full flex flex-col">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-['Inter']">Trend Penjualan</h2>
              <div className="h-80 flex-1">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} horizontal={true} vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="#6b7280"
                      fontSize={12}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
                      axisLine={false}
                    />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), 'Pendapatan']}
                      labelFormatter={(label) => formatDate(label)}
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '12px',
                        color: '#111827'
                      }}
                      itemStyle={{ color: '#111827' }}
                    />
                    <Legend 
                      wrapperStyle={{ color: '#374151' }}
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
                  <p className="text-sm text-gray-600 font-['Inter']">Tertinggi</p>
                  <p className="font-semibold text-gray-900 font-['Inter']">{formatCurrency(Math.max(...dailySales.map(d => d.revenue)))}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-['Inter']">Rata-rata</p>
                  <p className="font-semibold text-gray-900 font-['Inter']">
                    {formatCurrency(dailySales.reduce((sum, d) => sum + d.revenue, 0) / dailySales.length)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-['Inter']">Terendah</p>
                  <p className="font-semibold text-gray-900 font-['Inter']">{formatCurrency(Math.min(...dailySales.map(d => d.revenue)))}</p>
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Category Distribution */}
          <div className="lg:col-span-1">
            <AnimatedCard delay={0.7} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 font-['Inter']">Distribusi Kategori</h2>
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
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '12px',
                        color: '#111827'
                      }}
                      itemStyle={{ color: '#111827' }}
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
                      <span className="text-sm text-gray-700 font-['Inter'] flex-1">{category.category}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 font-['Inter'] ml-4">
                      <AnimatedCounter value={category.percentage} suffix="%" duration={1} />
                    </span>
                  </div>
                ))}
              </div>
            </AnimatedCard>
          </div>
        </div>

        {/* Daily Sales Chart */}
        <div className="mt-8">
          <AnimatedCard delay={0.8} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 font-['Inter']">Penjualan Harian</h2>
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
                    stroke="#e5e7eb" 
                    strokeOpacity={0.5} 
                    horizontal={true} 
                    vertical={false} 
                  />
                  
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#6b7280"
                    fontSize={11}
                    fontFamily="'Inter', sans-serif"
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={11}
                    fontFamily="'Inter', sans-serif"
                    tickFormatter={(value) => formatCurrency(value)}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  
                  {/* White theme Tooltip */}
                  <Tooltip 
                    formatter={(value: any, name: any) => {
                      const formattedValue = name === 'revenue' ? formatCurrency(value) : formatNumber(value);
                      const label = name === 'revenue' ? 'Pendapatan' : 'Penjualan';
                      const color = name === 'revenue' ? '#3b82f6' : '#10b981';
                      return [
                        <span key="value" style={{ color, fontWeight: 'bold' }}>{formattedValue}</span>,
                        <span key="label" style={{ color: '#6b7280' }}>{label}</span>
                      ];
                    }}
                    labelFormatter={(label) => (
                      <span style={{ color: '#6b7280', fontSize: '11px' }}>{formatDate(label)}</span>
                    )}
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      color: '#111827',
                      padding: '12px 16px',
                      fontSize: '13px',
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ 
                      color: '#111827', 
                      margin: '4px 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    labelStyle={{ 
                      color: '#6b7280', 
                      marginBottom: '6px',
                      fontWeight: '500',
                      borderBottom: '1px solid #e5e7eb',
                      paddingBottom: '6px'
                    }}
                    cursor={false}
                  />
                  
                  <Legend 
                    wrapperStyle={{ 
                      color: '#374151',
                      fontSize: '12px',
                      fontFamily: "'Inter', sans-serif",
                      paddingTop: '20px'
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
          </AnimatedCard>
        </div>

        {/* Top Products */}
        <div className="mt-8">
          <AnimatedCard delay={0.9} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 font-['Inter']">Produk Terlaris</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-['Inter']">
                      Produk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-['Inter']">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-['Inter']">
                      Penjualan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-['Inter']">
                      Pendapatan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                            <span className="text-xs font-medium text-blue-600 font-['Inter']">{index + 1}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 font-['Inter']">{product.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600 font-['Inter']">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 font-['Inter']">
                          <AnimatedCounter value={product.sales} duration={0.8} />
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-emerald-600 font-['Inter']">
                          <AnimatedCounter value={product.revenue} prefix="Rp " duration={1} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}
