"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  DollarSign,
  Store,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Database,
  Wifi,
  RefreshCw,
  Calendar,
  Filter,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// Client-only component untuk waktu
function ClientOnlyTime({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <span>Loading...</span>;
  }
  
  return <>{children}</>;
}

export default function AdminDashboard() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('today');
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    // Admin dashboard tidak perlu redirect ke login
    // User sudah dihandle oleh middleware atau auth context
    // Simulasi update last sync
    const interval = setInterval(() => {
      setLastSync(new Date());
    }, 30000); // Update setiap 30 detik
    
    return () => clearInterval(interval);
  }, [isLoggedIn, router]);

  const stats = [
    {
      title: 'Total Revenue',
      value: 'Rp 2.4B',
      change: '+15.3%',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: '45,678',
      change: '+8.9%',
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users',
      value: '12,456',
      change: '+12.1%',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Active Sellers',
      value: '892',
      change: '+18.2%',
      icon: Store,
      color: 'bg-orange-500'
    }
  ];

  // Data mock untuk inventory alerts
  const inventoryAlerts = [
    { id: 1, name: 'Laptop Gaming ASUS ROG', stock: 2, minStock: 5, status: 'critical' },
    { id: 2, name: 'Mouse Logitech MX Master', stock: 4, minStock: 10, status: 'low' },
    { id: 3, name: 'Keyboard Mechanical RGB', stock: 0, minStock: 5, status: 'out' },
    { id: 4, name: 'Monitor 27" 4K', stock: 3, minStock: 5, status: 'critical' },
  ];

  // Data mock untuk recent orders
  const recentOrders = [
    { id: 'ORD-001', customer: 'Budi Santoso', date: '2024-01-15', total: 'Rp 12.500.000', status: 'completed' },
    { id: 'ORD-002', customer: 'Siti Nurhaliza', date: '2024-01-15', total: 'Rp 3.200.000', status: 'shipping' },
    { id: 'ORD-003', customer: 'Ahmad Fauzi', date: '2024-01-14', total: 'Rp 8.750.000', status: 'pending' },
    { id: 'ORD-004', customer: 'Dewi Lestari', date: '2024-01-14', total: 'Rp 1.500.000', status: 'completed' },
    { id: 'ORD-005', customer: 'Rudi Hartono', date: '2024-01-13', total: 'Rp 15.300.000', status: 'shipping' },
  ];

  // Data mock untuk user demographics
  const userDemographics = {
    topLocations: [
      { city: 'Jakarta', percentage: 35, orders: 1240 },
      { city: 'Surabaya', percentage: 22, orders: 780 },
      { city: 'Bandung', percentage: 18, orders: 640 },
      { city: 'Medan', percentage: 15, orders: 530 },
    ],
    deviceSources: [
      { device: 'Mobile', percentage: 65, icon: Smartphone },
      { device: 'Desktop', percentage: 35, icon: Monitor },
    ]
  };

  // System health data
  const systemHealth = {
    database: 'Connected',
    serverResponse: '125ms',
    lastSync: lastSync.toLocaleTimeString('id-ID'),
  };

  // Data untuk Revenue Chart
  const revenueData = [
    { name: 'Jan', revenue: 4000000, orders: 240 },
    { name: 'Feb', revenue: 3000000, orders: 180 },
    { name: 'Mar', revenue: 5000000, orders: 320 },
    { name: 'Apr', revenue: 4500000, orders: 280 },
    { name: 'May', revenue: 6000000, orders: 390 },
    { name: 'Jun', revenue: 5500000, orders: 350 },
  ];

  // Data untuk Order Status Pie Chart
  const orderStatusData = [
    { name: 'Completed', value: 65, color: '#10b981' },
    { name: 'Processing', value: 20, color: '#3b82f6' },
    { name: 'Pending', value: 15, color: '#f59e0b' },
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
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 relative overflow-hidden group"
      >
        {/* Background decoration */}
        <motion.div
          className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-5 rounded-full -mr-16 -mt-16`}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="flex items-center justify-between">
          <div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
              className="text-sm font-medium text-gray-600 mb-1"
            >
              {stat.title}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
              className="flex items-center space-x-2"
            >
              <AnimatedCounter 
                value={stat.value} 
                duration={1.5}
              />
              {stat.change && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.8 }}
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {stat.change}
                </motion.span>
              )}
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1 + 0.6,
              type: "spring"
            }}
            whileHover={{ 
              scale: 1.1, 
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.3 }
            }}
            className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg relative`}
          >
            <stat.icon className="w-6 h-6" />
            
            {/* Glow effect on hover */}
            <motion.div
              className={`absolute inset-0 ${stat.color} rounded-xl opacity-0 group-hover:opacity-20`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        <div className="flex-1">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4"
          >
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl sm:text-2xl font-bold text-gray-900"
                >
                  Dashboard
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-xs sm:text-sm text-gray-500 mt-1"
                >
                  Welcome back! Here's what's happening with your platform today.
                </motion.p>
              </div>
            </motion.div>
          </motion.div>

          {/* Time Range Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="px-4 sm:px-6 pb-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Time Range:</span>
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 sm:px-4 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 sm:flex-none"
                >
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                <ClientOnlyTime>
                  <span className="hidden sm:inline">Last sync: {systemHealth.lastSync}</span>
                  <span className="sm:hidden">{systemHealth.lastSync}</span>
                </ClientOnlyTime>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="p-4 sm:p-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {stats.map((stat, index) => (
                <AnimatedStatCard key={index} stat={stat} index={index} />
              ))}
            </div>

            {/* Dashboard Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {/* Revenue Chart - 2 columns */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6"
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
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, '']}
                        labelFormatter={(label) => `Bulan ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        fill="#93c5fd" 
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </motion.div>

              {/* Inventory Alerts - 1 column */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                  className="flex items-center justify-between mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Inventory Alerts</h3>
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                </motion.div>
                <div className="space-y-2">
                  {inventoryAlerts.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 1.7 + item.id * 0.1 }}
                      className={`p-3 rounded-lg border ${
                        item.status === 'out' ? 'bg-red-50 border-red-200' :
                        item.status === 'critical' ? 'bg-orange-50 border-orange-200' :
                        'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">Stock: {item.stock} / Min: {item.minStock}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'out' ? 'bg-red-100 text-red-800' :
                          item.status === 'critical' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status === 'out' ? 'Out of Stock' :
                           item.status === 'critical' ? 'Critical' : 'Low Stock'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Second Row: Recent Orders and User Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recent Orders Table */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.0 }}
                  className="flex items-center justify-between mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <ShoppingCart className="w-5 h-5 text-blue-500" />
                </motion.div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 2.2 + index * 0.1 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-3 py-2 text-sm font-medium text-gray-900">{order.id}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{order.customer}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{order.total}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipping' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* User Demographics */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.9 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.1 }}
                  className="flex items-center justify-between mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900">User Demographics</h3>
                  <Users className="w-5 h-5 text-purple-500" />
                </motion.div>
                
                {/* Top Locations */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Top Locations
                  </h4>
                  <div className="space-y-2">
                    {userDemographics.topLocations.map((location, index) => (
                      <motion.div
                        key={location.city}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 2.3 + index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-700">{location.city}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{location.orders} orders</span>
                          <span className="text-sm font-medium text-gray-900">{location.percentage}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Device Sources */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Device Sources</h4>
                  <div className="space-y-2">
                    {userDemographics.deviceSources.map((device, index) => (
                      <motion.div
                        key={device.device}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 2.5 + index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <device.icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{device.device}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{device.percentage}%</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Status Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Pie Chart */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.4 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.6 }}
                  className="flex items-center justify-between mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
                  <Activity className="w-5 h-5 text-indigo-500" />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 2.8 }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        formatter={(value: any) => [`${value}%`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.5 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.7 }}
                  className="flex items-center justify-between mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                  <Eye className="w-5 h-5 text-purple-500" />
                </motion.div>
                <div className="space-y-3">
                  {[
                    { icon: Package, label: 'Add New Product', color: 'blue' },
                    { icon: Users, label: 'View All Users', color: 'green' },
                    { icon: ShoppingCart, label: 'Manage Orders', color: 'purple' },
                    { icon: TrendingUp, label: 'Generate Report', color: 'orange' },
                  ].map((action, index) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 2.9 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full flex items-center space-x-3 p-4 bg-${action.color}-50 rounded-lg hover:bg-${action.color}-100 transition-colors`}
                    >
                      <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                      <span className={`text-sm font-medium text-${action.color}-900`}>{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* System Health Status */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.6 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">Database:</span>
                    <span className="text-sm font-medium text-green-600">{systemHealth.database}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-700">Server Response:</span>
                    <span className="text-sm font-medium text-blue-600">{systemHealth.serverResponse}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Last sync: {systemHealth.lastSync}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
