'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  DollarSign,
  Plus,
  Edit,
  RefreshCw,
  Settings,
  Star,
  AlertTriangle,
  Truck,
  Activity
} from 'lucide-react';

// Mock Data for Admin Dashboard
const mockStats = [
  {
    title: 'Total Revenue',
    value: 'Rp 2.4B',
    change: '+15.3%',
    icon: DollarSign,
    color: 'bg-green-500'
  },
  {
    title: 'Total Orders',
    value: '12,456',
    change: '+12.7%',
    icon: ShoppingCart,
    color: 'bg-blue-500'
  },
  {
    title: 'Total Users',
    value: '45,678',
    change: '+8.9%',
    icon: Users,
    color: 'bg-purple-500'
  },
  {
    title: 'Active Sellers',
    value: '892',
    change: '+18.2%',
    icon: Users,
    color: 'bg-orange-500'
  }
];

const mockActivities = [
  {
    id: 1,
    title: 'New Seller Registered',
    description: 'Toko Fashion Premium joined platform',
    time: '2 hours ago',
    icon: Users,
    color: 'text-orange-500'
  },
  {
    id: 2,
    title: 'Order Completed',
    description: 'Order #12345 completed successfully',
    time: '4 hours ago',
    icon: ShoppingCart,
    color: 'text-green-500'
  },
  {
    id: 3,
    title: 'Product Approved',
    description: '45 products approved and listed',
    time: '6 hours ago',
    icon: Package,
    color: 'text-purple-500'
  },
  {
    id: 4,
    title: 'New User Registration',
    description: '234 new users registered today',
    time: '1 day ago',
    icon: Users,
    color: 'text-blue-500'
  }
];

// Animated Counter Component
function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2 }: { 
  value: string | number; 
  prefix?: string; 
  suffix?: string; 
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;

  useEffect(() => {
    let startTime: number;
    let startValue = 0;
    const endValue = numericValue;

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
  }, [numericValue, duration]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString('id-ID')}{suffix}
    </span>
  );
}

// Animated Stat Card Component
function AnimatedStatCard({ stat, index }: { stat: any; index: number }) {
  const Icon = stat.icon;  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
      }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            className="text-sm font-medium text-gray-600"
          >
            {stat.title}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            className="text-2xl font-bold text-gray-900 mt-2"
          >
            <AnimatedCounter value={stat.value} duration={1.5} />
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            className="text-sm text-green-600 mt-2 flex items-center gap-1"
          >
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <TrendingUp className="w-3 h-3" />
            </motion.div>
            {stat.change}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
          whileHover={{ 
            rotate: 360,
            scale: 1.1
          }}
          className={`p-3 rounded-full ${stat.color} bg-opacity-10`}
        >
          <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Dashboard Content Component
function DashboardContent() {
  return (
    <div className="p-6 pb-20">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mockStats.map((stat, index) => (
          <AnimatedStatCard key={index} stat={stat} index={index} />
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex items-center justify-between mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <motion.div
              animate={{ rotate: [0, 180, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            whileHover={{ scale: 1.02 }}
            className="h-64 flex items-center justify-center bg-gray-50 rounded-lg"
          >
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 2.0 }}
                className="text-gray-600"
              >
                Chart placeholder
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 2.2 }}
                className="text-sm text-gray-500 mt-2"
              >
                Revenue trend over time
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="flex items-center justify-between mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <motion.div
              animate={{ rotate: [0, 360, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="w-5 h-5 text-gray-400" />
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.0 }}
            className="space-y-4"
          >
            {mockActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 2.2 + index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    x: -5,
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)"
                  }}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <Icon className={`w-5 h-5 ${activity.color}`} />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 2.3 + index * 0.1 }}
                      className="text-sm font-medium text-gray-900"
                    >
                      {activity.title}
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 2.4 + index * 0.1 }}
                      className="text-sm text-gray-600"
                    >
                      {activity.description}
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 2.5 + index * 0.1 }}
                      className="text-xs text-gray-500 mt-1"
                    >
                      {activity.time}
                    </motion.p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Seller Dashboard Content Component
function SellerDashboardContent() {
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
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="30d">30 Hari Terakhir</option>
                <option value="90d">90 Hari Terakhir</option>
                <option value="1y">1 Tahun</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Selamat Datang Kembali!</h2>
              <p className="text-blue-100">Berikut adalah ringkasan performa toko Anda</p>
            </div>
            <div className="hidden lg:block text-right">
              <div>
                <p className="text-3xl font-bold">Rp 87.5Jt</p>
                <p className="text-blue-100">Total Pendapatan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Pendapatan */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium ml-1">12.5%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Rp 87.500.000</h3>
            <p className="text-gray-600 text-sm">Total Pendapatan</p>
          </div>

          {/* Total Pesanan */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium ml-1">8.2%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">423</h3>
            <p className="text-gray-600 text-sm">Total Pesanan</p>
          </div>

          {/* Total Pelanggan */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium ml-1">15.3%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">312</h3>
            <p className="text-gray-600 text-sm">Total Pelanggan</p>
          </div>

          {/* Total Produk */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex items-center text-gray-600">
                <span className="text-sm font-medium ml-1">45 produk</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">45</h3>
            <p className="text-gray-600 text-sm">Total Produk</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { href: "/seller/addproduct", icon: Plus, color: "blue", label: "Tambah Produk" },
              { href: "/seller/orders", icon: ShoppingCart, color: "green", label: "Lihat Pesanan" },
              { href: "/seller/inventory", icon: Package, color: "purple", label: "Inventory" },
              { href: "/seller/analytics", icon: BarChart3, color: "orange", label: "Analitik" },
              { href: "/seller/products", icon: Edit, color: "pink", label: "Kelola Produk" },
              { href: "/seller/settings", icon: Settings, color: "gray", label: "Pengaturan" }
            ].map((action, index) => (
              <div key={action.href} className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                <div className="h-6 w-6 text-blue-600 mb-2">
                  <action.icon />
                </div>
                <span className="text-sm text-gray-700">{action.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Pesanan Terbaru</h2>
                <div className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Lihat Semua
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { id: '1', orderNumber: 'ORD-2024-001', customerName: 'Budi Santoso', total: 620000, status: 'pending', orderDate: '2024-01-15T10:30:00Z' },
                  { id: '2', orderNumber: 'ORD-2024-002', customerName: 'Siti Nurhaliza', total: 340000, status: 'confirmed', orderDate: '2024-01-14T15:45:00Z' },
                  { id: '3', orderNumber: 'ORD-2024-003', customerName: 'Ahmad Wijaya', total: 680000, status: 'processing', orderDate: '2024-01-13T09:20:00Z' }
                ].map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">Rp {order.total.toLocaleString('id-ID')}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'pending' ? 'Menunggu Konfirmasi' :
                           order.status === 'confirmed' ? 'Dikonfirmasi' :
                           order.status === 'processing' ? 'Diproses' :
                           'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
              <div className="space-y-4">
                {[
                  { id: '1', type: 'order', title: 'Pesanan Baru', description: 'ORD-2024-001 - Budi Santoso', icon: ShoppingCart, color: 'text-blue-600' },
                  { id: '2', type: 'product', title: 'Produk Ditambahkan', description: 'Kemeja Casual Premium berhasil ditambahkan', icon: Package, color: 'text-green-600' },
                  { id: '3', type: 'review', title: 'Review Baru', description: 'Produk Sepatu Sneakers mendapat 5 bintang', icon: Star, color: 'text-yellow-600' }
                ].map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`flex-shrink-0 ${activity.color}`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500">2 jam yang lalu</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Content for Scrolling */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-sm font-medium text-green-600">+23.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Month</span>
                <span className="text-sm font-medium text-blue-600">+18.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Order Value</span>
                <span className="text-sm font-medium text-gray-900">Rp 245,000</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fashion</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="w-16 bg-blue-500 h-2 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Electronics</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="w-12 bg-green-500 h-2 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">30%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Home & Living</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="w-8 bg-purple-500 h-2 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeDemo() {
  const [scrollY, setScrollY] = useState(0);
  const [activeDashboard, setActiveDashboard] = useState<'admin' | 'seller'>('admin');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate transform values based on scroll
  const calculateTransform = () => {
    const maxScroll = 500; // Maximum scroll for full effect
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    // Mobile: disable 3D effect
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return {
        scale: 1,
        rotateX: 0,
      };
    }
    
    // Desktop: 3D perspective effect
    const scale = 0.95 + (0.05 * scrollProgress); // 0.95 to 1
    const rotateX = 12 - (12 * scrollProgress); // 12deg to 0deg
    
    return {
      scale,
      rotateX,
    };
  };

  const transform = calculateTransform();

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        .browser-mockup-frame {
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: auto;
          pointer-events: auto;
        }
        
        .browser-mockup-frame::-webkit-scrollbar {
          width: 8px;
        }
        
        .browser-mockup-frame::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .browser-mockup-frame::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        .browser-mockup-frame::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-[800px] h-[800px] bg-gradient-radial from-blue-100/30 via-blue-50/20 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-32 sm:pb-24">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
              <span className="text-sm font-medium text-blue-700">Version 2.0 is live</span>
              <svg className="ml-2 w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293a1 1 0 00-1.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414 1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.293a1 1 0 00-1.414 0L10 10.586 8.707 9.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 11.414l1.293 1.293a1 1 0 001.414 0l4-4a1 1 0 101.414 1.414L4-4a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-blue-900 mb-6 leading-tight"
          >
            Satu Platform untuk Seluruh
            <br />
            Ekosistem Marketplace Anda.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Kelola produk, pantau analitik penjual, dan kendalikan database dalam satu dashboard terintegrasi.
          </motion.p>

          {/* Dashboard Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <button
              onClick={() => setActiveDashboard('admin')}
              className={`px-8 py-4 font-semibold rounded-lg transition-all duration-200 ${
                activeDashboard === 'admin'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                  : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 rounded-full"></div>
                <span>Admin Dashboard</span>
              </div>
            </button>
            <button
              onClick={() => setActiveDashboard('seller')}
              className={`px-8 py-4 font-semibold rounded-lg transition-all duration-200 ${
                activeDashboard === 'seller'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 rounded-full"></div>
                <span>Seller Dashboard</span>
              </div>
            </button>
          </motion.div>

          {/* Dashboard Mockup Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-6xl mx-auto"
            style={{
              perspective: '1200px',
            }}
          >
            {/* Glow Effect Behind Image */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className={`w-[600px] h-[400px] bg-gradient-radial ${
                activeDashboard === 'admin' 
                  ? 'from-blue-400/20 via-blue-300/10 to-transparent' 
                  : 'from-purple-400/20 via-indigo-300/10 to-transparent'
              } rounded-full blur-2xl`} />
            </div>

            {/* Browser Mockup Frame with Live Dashboard */}
            <div
              className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden"
              style={{
                transform: `perspective(1200px) rotateX(${transform.rotateX}deg) scale(${transform.scale})`,
                transition: 'transform 0.3s ease-out',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Browser Header */}
              <div className={`px-4 py-2 flex items-center justify-between ${
                activeDashboard === 'admin' ? 'bg-gray-100' : 'bg-purple-50'
              } border-b border-gray-200`}>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    activeDashboard === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="text-sm text-gray-600">
                    {activeDashboard === 'admin' ? 'Admin Dashboard - Live' : 'Seller Dashboard - Live'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
                  <div className="w-4 h-4 bg-green-400 rounded-sm"></div>
                  <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="browser-mockup-frame overflow-auto relative" style={{ height: '800px', width: '100%' }}>
                <div className="bg-white min-h-full">
                  {activeDashboard === 'admin' ? <DashboardContent /> : <SellerDashboardContent />}
                </div>
              </div>
            </div>
            
            {/* Fading Overlay Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
