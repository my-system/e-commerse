"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  DollarSign,
  Store,
  Eye,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
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
      icon: Store,
      color: 'bg-orange-500'
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

  const recentActivities = [
    {
      id: 1,
      title: 'New Seller Registered',
      description: 'Toko Fashion Premium joined the platform',
      time: '2 hours ago',
      icon: Store,
      color: 'text-blue-500'
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
      color: 'text-orange-500'
    }
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white border-b border-gray-200 px-6 py-4"
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
                  className="text-2xl font-bold text-gray-900"
                >
                  Dashboard
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-sm text-gray-500 mt-1"
                >
                  Welcome back! Here's what's happening with your platform today.
                </motion.p>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="p-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <AnimatedStatCard key={index} stat={stat} index={index} />
              ))}
            </div>

            {/* Charts and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 1.8 }}
                      className="text-gray-600"
                    >
                      Chart placeholder
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 2.0 }}
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
                  transition={{ duration: 0.6, delay: 1.8 }}
                  className="space-y-4"
                >
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: 2.0 + index * 0.1,
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
                            transition={{ duration: 0.4, delay: 2.1 + index * 0.1 }}
                            className="text-sm font-medium text-gray-900"
                          >
                            {activity.title}
                          </motion.p>
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 2.2 + index * 0.1 }}
                            className="text-sm text-gray-600"
                          >
                            {activity.description}
                          </motion.p>
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 2.3 + index * 0.1 }}
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

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.4 }}
              className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <motion.h3 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.6 }}
                className="text-lg font-semibold text-gray-900 mb-4"
              >
                Quick Actions
              </motion.h3>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 2.8 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {[
                  { 
                    icon: Package, 
                    label: 'Manage Products', 
                    color: 'blue',
                    href: '/admin/products'
                  },
                  { 
                    icon: ShoppingCart, 
                    label: 'View Orders', 
                    color: 'green',
                    href: '/admin/orders'
                  },
                  { 
                    icon: BarChart3, 
                    label: 'View Analytics', 
                    color: 'purple',
                    href: '/admin/analytics'
                  },
                  { 
                    icon: Store, 
                    label: 'Marketplace Settings', 
                    color: 'orange',
                    href: '/admin/marketplace'
                  }
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    onClick={() => router.push(action.href)}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 3.0 + index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -3,
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-3 p-4 bg-${action.color}-50 rounded-lg hover:bg-${action.color}-100 transition-colors`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      transition={{ duration: 0.3 }}
                    >
                      <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                    </motion.div>
                    <span className={`text-sm font-medium text-${action.color}-900`}>{action.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
