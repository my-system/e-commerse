'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Plus,
  Edit,
  RefreshCw,
  Settings,
  Star,
  AlertTriangle,
  Truck,
  Activity,
  CreditCard,
  Box,
  Shield,
  Zap,
  CheckCircle,
  Sparkles,
  Globe,
  Database,
  PieChart,
  Lock,
  Code,
  ArrowUpRight,
  Eye
} from 'lucide-react';
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

// Ambient Particles Container Component
function AmbientParticles() {
  const particles = [...Array(6)].map((_, i) => {
    // Generate consistent random positions based on index
    const seed = i * 12345; // Simple seed for pseudo-randomness
    const random1 = (seed * 9301 + 49297) % 233280;
    const random2 = (seed * 233280 + 9301) % 233280;
    
    return {
      id: i,
      top: `${20 + (random1 / 233280) * 60}%`,
      left: `${10 + (random2 / 233280) * 80}%`,
      delay: i * 0.5
    };
  });

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            delay: particle.delay,
            ease: "easeInOut" 
          }}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            top: particle.top,
            left: particle.left,
          }}
        />
      ))}
    </>
  );
}

// Ambient Particle Component (deprecated, using AmbientParticles instead)
function AmbientParticle({ index }: { index: number }) {
  const [particleStyle, setParticleStyle] = useState({
    top: '20%',
    left: '10%',
  });

  useEffect(() => {
    // Generate random positions only on client side
    setParticleStyle({
      top: `${20 + Math.random() * 60}%`,
      left: `${10 + Math.random() * 80}%`,
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        delay: index * 0.5,
        ease: "easeInOut" 
      }}
      className="absolute w-1 h-1 bg-blue-400 rounded-full"
      style={particleStyle}
    />
  );
}

// Analytics Preview Components

// Custom Glowing Bar untuk Mini Bar Chart
const GlowingMiniBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  
  return (
    <g>
      <defs>
        <filter id="miniGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2}/>
        </linearGradient>
      </defs>
      
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="url(#miniGradient)"
        filter="url(#miniGlow)"
        rx={4}
        ry={4}
        className="transition-all duration-300 hover:opacity-80"
      />
    </g>
  );
};

// Revenue Sparkline Component
function RevenueSparkline() {
  const sparklineData = [
    { value: 45 },
    { value: 52 },
    { value: 48 },
    { value: 61 },
    { value: 58 },
    { value: 72 },
    { value: 69 },
    { value: 75 }
  ];

  return (
    <div className="h-16">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={sparklineData}>
          <defs>
            <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#10b981" 
            strokeWidth={2}
            fill="url(#sparklineGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#10b981' }}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Mini Bar Chart Component
function MiniBarChart() {
  const miniBarData = [
    { name: 'Sen', value: 45 },
    { name: 'Sel', value: 52 },
    { name: 'Rab', value: 38 },
    { name: 'Kam', value: 65 },
    { name: 'Jum', value: 48 },
    { name: 'Sab', value: 72 },
    { name: 'Min', value: 58 }
  ];

  return (
    <div className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={miniBarData}>
          <Bar 
            dataKey="value" 
            fill="#3b82f6"
            shape={<GlowingMiniBar />}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          />
          <XAxis 
            dataKey="name" 
            stroke="#64748b"
            fontSize={10}
            fontFamily="'Inter', sans-serif"
            axisLine={false}
            tickLine={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Real-time Counter Component
function RealTimeCounter() {
  const [count, setCount] = useState(12456);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('realtime-counter');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const targetCount = 12456;
      const duration = 2000;
      const steps = 60;
      const increment = targetCount / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetCount) {
          setCount(targetCount);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  return (
    <div id="realtime-counter" className="text-center">
      <div className="text-3xl font-bold text-white font-['Inter']">
        {count.toLocaleString('id-ID')}
      </div>
      <div className="text-sm text-slate-400 font-['Inter'] mt-1">Total Orders</div>
    </div>
  );
}

// Analytics Dashboard Preview Component
function AnalyticsDashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3)"
      }}
      className="analytics-preview-card"
    >
      {/* Dashboard Card Content */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        {/* Animated Border Effect */}
        <div className="absolute inset-0 rounded-2xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-500"></div>
        </div>
        
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white font-['Inter']">Analytics Preview</h3>
              <p className="text-xs text-slate-400 font-['Inter']">Real-time monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-emerald-400 font-['Inter']">Live</span>
          </div>
        </div>

        {/* Revenue Section */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400 font-['Inter']">Total Revenue</span>
            <span className="text-xs text-emerald-400 font-['Inter']">+15.3%</span>
          </div>
          <div className="text-2xl font-bold text-white font-['Inter'] mb-3">Rp 2.4B</div>
          <RevenueSparkline />
        </div>

        {/* Mini Charts Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-['Inter'] mb-2">Weekly Sales</div>
            <MiniBarChart />
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-['Inter'] mb-2">Performance</div>
            <div className="h-24 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 font-['Inter']">94.2%</div>
                <div className="text-xs text-slate-400 font-['Inter']">Efficiency</div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Counter */}
        <div className="relative z-10 bg-slate-800/50 rounded-lg p-4">
          <RealTimeCounter />
        </div>

        {/* Floating Action */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Eye className="w-4 h-4 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}
const analyticsData = [
  { month: 'Jan', revenue: 45000000, orders: 120 },
  { month: 'Feb', revenue: 52000000, orders: 145 },
  { month: 'Mar', revenue: 48000000, orders: 132 },
  { month: 'Apr', revenue: 61000000, orders: 178 },
  { month: 'May', revenue: 58000000, orders: 165 },
  { month: 'Jun', revenue: 72000000, orders: 198 },
  { month: 'Jul', revenue: 69000000, orders: 187 },
  { month: 'Aug', revenue: 75000000, orders: 201 }
];

// Animated Bar Chart Component
function AnimatedBarChart() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const maxRevenue = Math.max(...analyticsData.map(d => d.revenue));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Grafik Penjualan</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Revenue (Rp)</span>
        </div>
      </div>
      
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-500">
          <span>Rp 75M</span>
          <span>Rp 50M</span>
          <span>Rp 25M</span>
          <span>Rp 0</span>
        </div>

        {/* Chart bars container */}
        <div className="ml-16 h-full flex items-end justify-between space-x-2">
          {analyticsData.map((data, index) => {
            const barHeight = (data.revenue / maxRevenue) * 100;
            const isHovered = hoveredBar === index;
            
            return (
              <motion.div
                key={index}
                className="flex-1 relative"
                initial={{ height: "0%" }}
                whileInView={{ height: `${barHeight}%` }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.1 + index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div className={`w-full h-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 ${
                  isHovered ? 'from-blue-700 to-blue-500 shadow-lg' : ''
                }`}>
                  {/* Tooltip */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10"
                    >
                      <div className="font-semibold">Rp {(data.revenue / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-gray-300">{data.orders} orders</div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                    </motion.div>
                  )}
                </div>
                
                {/* X-axis labels */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                  {data.month}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 ml-16 pointer-events-none">
          <div className="h-full flex flex-col justify-between">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-100"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-12 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">Rp 530M</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">+24.5%</div>
          <div className="text-sm text-gray-600">Growth Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">1,426</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
      </div>
    </div>
  );
}

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
              animate={{ rotate: [0, 180, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </motion.div>
          </motion.div>
          <div className="text-center">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 2.0 }}
              className="text-gray-600"
            >
              Activities placeholder
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 2.2 }}
              className="text-sm text-gray-500 mt-2"
            >
              Recent system activities
            </motion.p>
          </div>
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
  // Inject custom styles for neon border beam effects and analytics preview
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
        .database-card {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
        }

        .database-card::before {
          content: "";
          position: absolute;
          width: 300%;
          height: 300%;
          top: -100%;
          left: -100%;
          background: conic-gradient(
            from 0deg,
            #fbbf24,
            #f59e0b,
            #fbbf24 25%,
            transparent 25%,
            transparent 50%,
            #fbbf24 50%,
            #f59e0b 75%,
            #fbbf24 100%
          );
          animation: spin 8s linear infinite;
          border-radius: 16px;
          z-index: 0;
          opacity: 0.3;
          transition: opacity 0.3s ease;
        }

        .database-card:hover::before {
          opacity: 0.6;
        }

        .database-card::after {
          content: "";
          position: absolute;
          inset: 2px;
          background: #1f2937;
          border-radius: 14px;
          z-index: 1;
        }

        .database-card-content {
          position: relative;
          z-index: 10;
          background: transparent;
          border-radius: 14px;
        }

        .database-card-blue {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
        }

        .database-card-blue::before {
          content: "";
          position: absolute;
          width: 300%;
          height: 300%;
          top: -100%;
          left: -100%;
          background: conic-gradient(
            from 0deg,
            #3b82f6,
            #2563eb,
            #3b82f6 25%,
            transparent 25%,
            transparent 50%,
            #3b82f6 50%,
            #2563eb 75%,
            #3b82f6 100%
          );
          animation: spin 6s linear infinite;
          border-radius: 16px;
          z-index: 0;
          opacity: 0.3;
          transition: opacity 0.3s ease;
        }

        .database-card-blue:hover::before {
          opacity: 0.6;
        }

        .database-card-blue::after {
          content: "";
          position: absolute;
          inset: 2px;
          background: #1f2937;
          border-radius: 14px;
          z-index: 1;
        }

        .database-card-purple {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
        }

        .database-card-purple::before {
          content: "";
          position: absolute;
          width: 300%;
          height: 300%;
          top: -100%;
          left: -100%;
          background: conic-gradient(
            from 0deg,
            #a855f7,
            #9333ea,
            #a855f7 25%,
            transparent 25%,
            transparent 50%,
            #a855f7 50%,
            #9333ea 75%,
            #a855f7 100%
          );
          animation: spin 7s linear infinite;
          border-radius: 16px;
          z-index: 0;
          opacity: 0.3;
          transition: opacity 0.3s ease;
        }

        .database-card-purple:hover::before {
          opacity: 0.6;
        }

        .database-card-purple::after {
          content: "";
          position: absolute;
          inset: 2px;
          background: #1f2937;
          border-radius: 14px;
          z-index: 1;
        }

        .analytics-preview-card {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
        }

        .analytics-preview-card::before {
          content: "";
          position: absolute;
          width: 300%;
          height: 300%;
          top: -100%;
          left: -100%;
          background: conic-gradient(
            from 0deg,
            #3b82f6,
            #a855f7,
            #10b981,
            #3b82f6 25%,
            transparent 25%,
            transparent 50%,
            #3b82f6 50%,
            #a855f7 75%,
            #10b981 100%
          );
          animation: spin 5s linear infinite;
          border-radius: 16px;
          z-index: 0;
        }

        .ai-healing-large-card::after {
          content: "";
          position: absolute;
          inset: 2px;
          background: #0f172a;
          border-radius: 14px;
          z-index: 1;
        }

        .ai-healing-large-content {
          position: relative;
          z-index: 10;
          background: transparent;
          border-radius: 14px;
        }

        .technical-specs-card {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
        }

        .technical-specs-card::before {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: conic-gradient(
            from 0deg,
            #6366f1,
            transparent 20%,
            #6366f1 50%,
            transparent 70%,
            #6366f1 100%
          );
          animation: spin 6s linear infinite;
          border-radius: 16px;
          z-index: 0;
        }

        .technical-specs-card::after {
          content: "";
          position: absolute;
          inset: 2px;
          background: #0f172a;
          border-radius: 14px;
          z-index: 1;
        }

        .technical-specs-content {
          position: relative;
          z-index: 10;
          background: transparent;
          border-radius: 14px;
        }

        @keyframes spin {
          from { 
            transform: rotate(0deg); 
          }
          to { 
            transform: rotate(360deg); 
          }
        }

        .database-card:hover::before {
          animation-duration: 2s;
        }
      `;
      document.head.appendChild(styleElement);
      
      return () => {
        if (document.head.contains(styleElement)) {
          document.head.removeChild(styleElement);
        }
      };
    }
  }, []);
  
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

      {/* Analytics & Growth Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-blue-700">Real-time Data</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  Pantau Pertumbuhan Bisnis Anda secara Detail.
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                  Dapatkan laporan penjualan, statistik pengunjung, dan performa produk secara real-time 
                  dengan grafik yang mudah dipahami.
                </p>
              </div>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25 flex items-center space-x-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Lihat Analytics Lengkap</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-2 bg-white rounded-3xl shadow-md p-8"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Grafik Penjualan</h3>
                <p className="text-sm text-gray-500">Performa penjualan 6 bulan terakhir</p>
              </div>
              <div className="h-80">
                <AnimatedBarChart />
              </div>
            </motion.div>

            {/* Stats Cards Column */}
            <div className="space-y-6">
              {/* Total Revenue Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12.5%
                  </div>
                </div>
                <div className="mb-1">
                  <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">Rp 2.4M</p>
                </div>
                <p className="text-xs text-gray-400">vs bulan lalu</p>
              </motion.div>

              {/* Growth Rate Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8.2%
                  </div>
                </div>
                <div className="mb-1">
                  <p className="text-sm text-gray-500 mb-1">Growth Rate</p>
                  <p className="text-2xl font-bold text-gray-900">24.8%</p>
                </div>
                <p className="text-xs text-gray-400">rata-rata bulanan</p>
              </motion.div>

              {/* Total Orders Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex items-center text-red-600 text-sm font-medium">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    -3.1%
                  </div>
                </div>
                <div className="mb-1">
                  <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">1,847</p>
                </div>
                <p className="text-xs text-gray-400">transaksi bulan ini</p>
              </motion.div>
            </div>
          </div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: BarChart3, title: 'Laporan Pendapatan', desc: 'Harian/Bulanan' },
              { icon: TrendingUp, title: 'Analisis Produk', desc: 'Terlaris' },
              { icon: Users, title: 'Tracking Konversi', desc: 'Pelanggan' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Ecosystem Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Satu Sistem, Kendali Penuh.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dari manajemen produk hingga database tingkat lanjut, jelajahi fitur yang dirancang untuk skala bisnis modern.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
            {/* Kotak 1 (Large - Seller Focus): Inventory Management */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              className="lg:col-span-2 lg:row-span-2 bg-white rounded-[20px] border border-gray-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="h-full flex flex-col">
                {/* Mockup Preview */}
                <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 h-48 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                  <div className="relative z-10 w-full">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Inventory Status</h4>
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Product A</span>
                          <span className="text-sm font-medium text-green-600">45 units</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Product B</span>
                          <span className="text-sm font-medium text-yellow-600">12 units</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Product C</span>
                          <span className="text-sm font-medium text-green-600">89 units</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Inventory Management</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Kelola stok produk dengan sistem otomatis yang terintegrasi. Dapatkan notifikasi real-time 
                    saat stok menipis dan lakukan restock dengan satu klik.
                  </p>

                  {/* Features */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">Tracking stok real-time</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">Notifikasi otomatis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">Prediksi permintaan</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-600/25 flex items-center space-x-2">
                      <Package className="w-5 h-5" />
                      <span>Kelola Inventory</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Kotak 2 (Small - Right Column): User & Database Control */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="h-full flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">User & Database Control</h3>
                <p className="text-gray-600 mb-4 leading-relaxed flex-1">
                  Kelola akses pengguna dan konfigurasi database dengan sistem keamanan berlapis.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Active Users</span>
                    <span className="font-semibold text-purple-600">247</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">DB Connections</span>
                    <span className="font-semibold text-pink-600">12</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Kotak 3 (Medium - Bottom Left): Marketplace Curation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="h-full flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Marketplace Curation</h3>
                <p className="text-gray-600 mb-4 leading-relaxed flex-1">
                  Kurasi produk marketplace dengan sistem approval otomatis dan quality control.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Pending Review</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    23 items
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Kotak 4 (Medium - Bottom Center): Order Tracking */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="h-full flex flex-col">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Order Tracking</h3>
                <p className="text-gray-600 mb-4 leading-relaxed flex-1">
                  Monitor pengiriman real-time dengan sistem tracking yang terintegrasi dengan kurir.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Active Shipments</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    156 orders
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Kotak 5 (Small - Bottom Right): Customer Insights */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="h-full flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Customer Insights</h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">89%</div>
                  <div className="text-xs text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </motion.div>

            {/* Kotak 6 (Small - Bottom Right): Revenue Overview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-[20px] border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="h-full flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Revenue Overview</h3>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-green-600">Rp 12.5M</div>
                  <div className="text-xs text-gray-600">Monthly Revenue</div>
                </div>
                {/* Simple Sparkline Chart */}
                <div className="w-full h-12 flex items-end justify-between gap-1">
                  {[40, 65, 45, 80, 55, 90, 75, 95, 85, 100].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.05 }}
                      viewport={{ once: true }}
                      className="flex-1 bg-green-500 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-600/25">
                Jelajahi Semua Fitur
              </button>
              <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200">
                Request Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gateway & Security Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Enhanced Background Glow Effect */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/3 via-transparent to-transparent rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Akses Aman ke Seluruh Ekosistem.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Satu akun untuk semua peran. Sistem autentikasi yang cepat, aman, dan terintegrasi.
            </p>
          </motion.div>

          {/* Visual Preview - Dual Form Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Login Form Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl"></div>
              
              {/* Form Card */}
              <div className="relative bg-white rounded-[16px] shadow-2xl shadow-blue-500/10 border border-gray-100 p-8 hover:shadow-3xl hover:shadow-blue-500/20 transition-all duration-500">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang Kembali</h3>
                  <p className="text-gray-600">Masuk ke dashboard Anda</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="admin@marketplace.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        disabled
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      disabled
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700">Lupa password?</a>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg"
                  >
                    Masuk ke Dashboard
                  </motion.button>
                </div>

                {/* Social Login */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Atau masuk dengan</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Google</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700">GitHub</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Register Form Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-xl"></div>
              
              {/* Form Card */}
              <div className="relative bg-white rounded-[16px] shadow-2xl shadow-purple-500/10 border border-gray-100 p-8 hover:shadow-3xl hover:shadow-purple-500/20 transition-all duration-500">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Bergabung Sekarang</h3>
                  <p className="text-gray-600">Daftar sebagai Seller atau Buyer</p>
                </div>

                {/* Role Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Peran Anda</label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative cursor-pointer"
                    >
                      <input type="radio" name="role" className="sr-only" checked readOnly />
                      <div className="border-2 border-blue-500 bg-blue-50 rounded-lg p-4 text-center">
                        <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <span className="text-sm font-medium text-blue-900">Seller</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative cursor-pointer"
                    >
                      <input type="radio" name="role" className="sr-only" />
                      <div className="border-2 border-gray-200 rounded-lg p-4 text-center hover:border-gray-300 transition-colors">
                        <ShoppingCart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <span className="text-sm font-medium text-gray-700">Buyer</span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="Minimal 8 karakter"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      disabled
                    />
                  </div>

                  <div className="flex items-start">
                    <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1" />
                    <label className="ml-2 text-sm text-gray-600">
                      Saya setuju dengan <a href="#" className="text-purple-600 hover:text-purple-700">Syarat & Ketentuan</a>
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(147, 51, 234, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-lg"
                  >
                    Buat Akun Baru
                  </motion.button>
                </div>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Sudah punya akun? <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">Masuk di sini</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Security Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Encryption</h3>
              <p className="text-gray-600">
                Data Anda dilindungi dengan enkripsi end-to-end menggunakan standar keamanan industri terkini.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Role</h3>
              <p className="text-gray-600">
                Satu sistem login untuk Admin, Seller, dan Buyer. Akses yang tepat untuk peran yang tepat.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Next-Auth Integration</h3>
              <p className="text-gray-600">
                Terintegrasi dengan Next-Auth untuk autentikasi yang aman, cepat, dan sesuai standar industri.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technical Infrastructure Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Dramatic Glow Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Teal/Cyan Glow - Top Left (near AI Auto-Healing) */}
          <div className="absolute top-0 left-0 w-[600px] h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-cyan-400/15 to-transparent rounded-full blur-[120px]"></div>
          </div>
          
          {/* Purple Glow - Top Right (near Database C) */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-600/20 via-violet-500/15 to-transparent rounded-full blur-[120px]"></div>
          </div>
          
          {/* Indigo Glow - Bottom Center */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[700px] h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/15 via-blue-500/10 to-transparent rounded-full blur-[150px]"></div>
          </div>
          
          {/* Additional Ambient Lights */}
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px]">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-transparent rounded-full blur-[100px]"></div>
          </div>
          
          <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-l from-purple-500/10 to-transparent rounded-full blur-[130px]"></div>
          </div>
        </div>

        {/* Background Tech Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <g fill="#9CA3AF" fillOpacity="0.05">
                <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/>
              </g>
            </g>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Arsitektur Database Skala Enterprise.
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sistem Triple-Database untuk integritas data maksimal dan performa tanpa hambatan.
            </p>
          </motion.div>

          {/* Triple-Database Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Database A - Pending */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="database-card"
            >
              <div className="database-card-content p-6 h-full shadow-2xl relative border border-gray-700/50">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <Database className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">Database A</h3>
                    <p className="text-sm text-gray-300 font-medium">Pending Database</p>
                    <div className="mt-3 flex items-center text-sm text-gray-400">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse shadow-lg shadow-green-500/50"></div>
                      <span>Seller Upload & Admin Review</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900/80 rounded-2xl p-4 border border-gray-700/30">
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="text-green-400 font-semibold">ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Connections:</span>
                      <span className="text-green-400 font-semibold">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Queue:</span>
                      <span className="text-yellow-400 font-semibold">12 items</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Database B - Marketplace */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="database-card-blue"
            >
              <div className="database-card-content p-6 h-full shadow-2xl relative border border-gray-700/50">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <Database className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">Database B</h3>
                    <p className="text-sm text-gray-300 font-medium">Marketplace Database</p>
                    <div className="mt-3 flex items-center text-sm text-gray-400">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse shadow-lg shadow-green-500/50"></div>
                      <span>Live Customer Experience</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900/80 rounded-2xl p-4 border border-gray-700/30">
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="text-blue-400 font-semibold">LIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Connections:</span>
                      <span className="text-blue-400 font-semibold">1,847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Uptime:</span>
                      <span className="text-green-400 font-semibold">99.97%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Database C - Backup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="database-card-purple"
            >
              <div className="database-card-content p-6 h-full shadow-2xl relative border border-gray-700/50">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <Database className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">Database C</h3>
                    <p className="text-sm text-gray-300 font-medium">Central Backup</p>
                    <div className="mt-3 flex items-center text-sm text-gray-400">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse shadow-lg shadow-green-500/50"></div>
                      <span>Single Source of Truth & Recovery</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900/80 rounded-2xl p-4 border border-gray-700/30">
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="text-purple-400 font-semibold">BACKUP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Sync:</span>
                      <span className="text-purple-400 font-semibold">2m ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Integrity:</span>
                      <span className="text-green-400 font-semibold">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Animated Flow Arrows */}
          <div className="relative h-32 mb-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 800 128">
                <defs>
                  <marker id="arrowhead" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
                    <polygon points="0 0, 12 4, 0 8" fill="#10b981" />
                  </marker>
                </defs>
                
                <motion.line
                  x1="120" y1="64" x2="280" y2="64"
                  stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1 }}
                  viewport={{ once: true }}
                />
                
                <motion.line
                  x1="400" y1="64" x2="520" y2="64"
                  stroke="#10b981" strokeWidth="3" markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1.5 }}
                  viewport={{ once: true }}
                />
              </svg>
              
              <div className="absolute top-0 left-1/4 transform -translate-y-1/2 text-xs text-green-400 font-mono bg-gray-900/60 px-3 py-1 rounded-lg border border-green-500/30">
                Pending → Marketplace
              </div>
              <div className="absolute top-0 right-1/4 transform -translate-y-1/2 text-xs text-green-400 font-mono bg-gray-900/60 px-3 py-1 rounded-lg border border-green-500/30">
                Marketplace → Backup
              </div>
            </div>
          </div>

          {/* AI Auto-Healing Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* AI Panel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="ai-healing-large-card bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 z-10"
            >
              <div className="ai-healing-large-content">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-3">
                    <Zap className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">AI Auto-Healing</h3>
                    <p className="text-sm text-gray-400">Real-time System Health</p>
                  </div>
                </div>

                {/* Scanning Effect */}
                <div className="bg-gray-900/50 rounded-lg p-4 mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse"></div>
                  <div className="relative z-10 space-y-2 font-mono text-xs">
                    <div className="text-green-400">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      Scanning database integrity...
                    </div>
                    <div className="text-blue-400">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Checking for duplicates...
                    </div>
                    <div className="text-yellow-400">
                      <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      Validating data consistency...
                    </div>
                    <div className="text-purple-400">
                      <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Syncing backup nodes...
                    </div>
                  </div>
                </div>

                {/* Health Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">System Health</div>
                    <div className="text-lg font-bold text-green-400">98.5%</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Response Time</div>
                    <div className="text-lg font-bold text-blue-400">12ms</div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold">Auto-repair</h4>
                      <p className="text-sm text-gray-400">Sinkronisasi otomatis antar database</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-semibold">Health Monitoring</h4>
                      <p className="text-sm text-gray-400">Status real-time dari PostgreSQL & SQLite</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Technical Specs */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="technical-specs-card bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <div className="technical-specs-content">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mr-3">
                    <Code className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Technical Specs</h3>
                    <p className="text-sm text-gray-400">Product Data Structure</p>
                  </div>
                </div>

                {/* JSON Display */}
                <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-xs">
                  <div className="text-gray-500 mb-2">// Product Schema Example</div>
                  <pre className="text-green-400 overflow-x-auto">
{`{
  "id": "PROD-001",
  "status": "approved",
  "databases": ["pending", "marketplace", "backup"],
  "ai_check": "passed",
  "metadata": {
    "created_at": "2024-01-15T10:30:00Z",
    "last_sync": "2024-01-15T10:32:15Z",
    "integrity_score": 100.0
  },
  "performance": {
    "query_time": "12ms",
    "index_optimized": true,
    "cache_hit_rate": 0.94
  }
}`}
                  </pre>
                </div>

                {/* System Status */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">PostgreSQL</div>
                    <div className="text-lg font-bold text-green-400">99.97%</div>
                    <div className="text-xs text-gray-400">Uptime</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">SQLite</div>
                    <div className="text-lg font-bold text-blue-400">100%</div>
                    <div className="text-xs text-gray-400">Sync Rate</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Integrations with your Business Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect seamlessly with leading payment gateways and shipping providers
            </p>
          </motion.div>

          {/* Spider Web Integration Layout */}
          <div className="relative h-96 flex items-center justify-center">
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400">
              {/* Lines from center to each integration */}
              <motion.line
                x1="400" y1="200" x2="200" y2="100"
                stroke="#e5e7eb" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.line
                x1="400" y1="200" x2="600" y2="100"
                stroke="#e5e7eb" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              />
              <motion.line
                x1="400" y1="200" x2="150" y2="250"
                stroke="#e5e7eb" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
              />
              <motion.line
                x1="400" y1="200" x2="650" y2="250"
                stroke="#e5e7eb" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
              <motion.line
                x1="400" y1="200" x2="250" y2="350"
                stroke="#e5e7eb" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
              />
              <motion.line
                x1="400" y1="200" x2="550" y2="350"
                stroke="#e5e7eb" strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.0 }}
              />
            </svg>

            {/* Center Hub - Your Platform */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute z-20 w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
            >
              <Globe className="w-10 h-10 text-white" />
            </motion.div>

            {/* Integration Points */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="absolute top-12 left-48 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100"
            >
              <CreditCard className="w-8 h-8 text-blue-600" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
              className="absolute top-12 right-48 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100"
            >
              <Database className="w-8 h-8 text-green-600" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              viewport={{ once: true }}
              className="absolute left-24 top-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100"
            >
              <Truck className="w-8 h-8 text-orange-600" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              viewport={{ once: true }}
              className="absolute right-24 top-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100"
            >
              <Box className="w-8 h-8 text-purple-600" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              viewport={{ once: true }}
              className="absolute bottom-12 left-48 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100"
            >
              <Shield className="w-8 h-8 text-red-600" />
            </motion.div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              viewport={{ once: true }}
              className="absolute bottom-12 right-48 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100"
            >
              <Zap className="w-8 h-8 text-yellow-600" />
            </motion.div>
          </div>

          {/* Integration Labels */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            {[
              { name: 'Payment Gateway', icon: CreditCard, color: 'text-blue-600' },
              { name: 'Database Sync', icon: Database, color: 'text-green-600' },
              { name: 'Logistics', icon: Truck, color: 'text-orange-600' },
              { name: 'Inventory', icon: Box, color: 'text-purple-600' },
              { name: 'Security', icon: Shield, color: 'text-red-600' },
              { name: 'API Tools', icon: Zap, color: 'text-yellow-600' }
            ].map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex flex-col items-center">
                  <integration.icon className={`w-6 h-6 ${integration.color} mb-2`} />
                  <span className="text-sm font-medium text-gray-700">{integration.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fitur Utama Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solusi komprehensif untuk mengelola marketplace modern Anda
            </p>
          </motion.div>

          {/* Bento Grid Layout - Optimized Structure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Manajemen Inventaris (Biru) - 2 kolom */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)" }}
              className="md:col-span-2 bg-white rounded-3xl p-10 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex items-start space-x-8 h-full">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Manajemen Inventaris Otomatis
                  </h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Sistem inventaris real-time yang secara otomatis melacak stok, memperbarui ketersediaan produk, 
                    dan memberikan notifikasi saat produk perlu diisi ulang.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Real-time Sync
                    </div>
                    <div className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Auto-alerts
                    </div>
                    <div className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Smart Forecast
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sistem Kurasi (Ungu) - 1 kolom */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, boxShadow: "0 25px 50px rgba(147, 51, 234, 0.15)" }}
              className="md:col-span-1 bg-white rounded-3xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Sistem Kurasi Produk
                </h3>
                <p className="text-gray-600 mb-6 flex-1 leading-relaxed">
                  Proses verifikasi admin yang ketat memastikan hanya produk berkualitas tinggi yang tayang di platform.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 font-medium rounded-full">
                    Admin Verified
                  </span>
                  <span className="px-4 py-2 bg-pink-100 text-pink-700 font-medium rounded-full">
                    Quality Control
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Analitik Penjualan (Hijau) - 1 kolom */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, boxShadow: "0 25px 50px rgba(34, 197, 94, 0.15)" }}
              className="md:col-span-1 bg-white rounded-3xl p-8 shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <PieChart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Analitik Penjualan
                </h3>
                <p className="text-gray-600 mb-6 flex-1 leading-relaxed">
                  Dashboard analitik komprehensif dengan visualisasi data penjualan, performa produk, dan insight pelanggan.
                </p>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">Revenue Growth</span>
                    <span className="text-lg font-bold text-green-600">+24.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="w-3/4 bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Performa Tinggi (Oranye) - 2 kolom (mengisi kekosongan) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, boxShadow: "0 25px 50px rgba(251, 146, 60, 0.15)" }}
              className="md:col-span-2 bg-white rounded-3xl p-10 shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex items-start space-x-8 h-full">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Performa Tinggi & Scalable
                  </h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Arsitektur cloud-native yang mendukung ribuan transaksi per detik dengan uptime 99.9%.
                  </p>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-1">99.9%</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-1">&lt;100ms</div>
                      <div className="text-sm text-gray-600">Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-1">10K+</div>
                      <div className="text-sm text-gray-600">TPS</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Keamanan Terjamin (Merah) - Full Width (3 kolom) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, boxShadow: "0 25px 50px rgba(239, 68, 68, 0.15)" }}
              className="md:col-span-3 bg-white rounded-3xl p-10 shadow-xl border border-red-100 hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex items-center justify-between h-full">
                <div className="flex items-center space-x-8">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
                      <Lock className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Keamanan Terjamin
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-2xl">
                      Enkripsi end-to-end dan kepatuhan standar keamanan internasional untuk melindungi data Anda dengan tingkat keamanan tertinggi.
                    </p>
                    <div className="flex items-center space-x-3 bg-red-50 rounded-xl p-4 inline-flex">
                      <Sparkles className="w-6 h-6 text-red-600" />
                      <span className="text-red-700 font-bold">ISO 27001 Certified</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Siap untuk Mengubah Bisnis Anda?</h3>
                <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                  Bergabung dengan ribuan seller yang sudah menggunakan platform kami untuk meningkatkan penjualan dan efisiensi operasional.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg"
                  >
                    Mulai Gratis
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-600 transition-colors duration-200"
                  >
                    Request Demo
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">500K+</div>
              <div className="text-gray-600">Products Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">2M+</div>
              <div className="text-gray-600">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Products Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 border border-purple-200 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-700">AI Powered</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trending Products - AI Choice
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Produk pilihan AI yang sedang populer dan memiliki performa penjualan terbaik
            </p>
          </motion.div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Wireless Earbuds Pro',
                price: 'Rp 1.299.000',
                rating: 4.8,
                sales: 234,
                badge: 'Best Seller',
                image: 'placeholder-1.jpg'
              },
              {
                name: 'Smart Watch Ultra',
                price: 'Rp 3.599.000',
                rating: 4.9,
                sales: 189,
                badge: 'Premium',
                image: 'placeholder-2.jpg'
              },
              {
                name: 'Laptop Gaming RGB',
                price: 'Rp 15.999.000',
                rating: 4.7,
                sales: 156,
                badge: 'Hot Deal',
                image: 'placeholder-3.jpg'
              },
              {
                name: 'Camera Mirrorless 4K',
                price: 'Rp 8.799.000',
                rating: 4.9,
                sales: 203,
                badge: 'Trending',
                image: 'placeholder-1.jpg'
              }
            ].map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                  {/* AI Choice Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="inline-flex items-center px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Choice
                    </div>
                  </div>
                  {/* Product Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="inline-flex items-center px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                      {product.badge}
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.sales} terjual
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">
                      {product.price}
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Lihat
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors duration-200 shadow-lg shadow-purple-600/25">
                Jelajahi Semua Produk
              </button>
              <button className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl border-2 border-purple-600 hover:bg-purple-50 transition-colors duration-200">
                Mulai Berjualan
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Analytics Preview Section */}
      <section className="py-24 deep-ambient-glow relative" style={{ backgroundColor: '#0a0f1d' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Marketing Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
              >
                <BarChart3 className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-300">Real-time Analytics</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Inter'] leading-tight"
              >
                Pantau Bisnis Anda
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  Secara Real-time
                </span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-lg text-blue-100 mb-8 font-['Inter'] leading-relaxed"
              >
                Analitik mendalam dengan performa tinggi yang divisualisasikan secara elegan. Dapatkan insight real-time untuk mengoptimalkan keputusan bisnis Anda.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold font-['Inter']">Dashboard Futuristik</h3>
                    <p className="text-blue-200 text-sm font-['Inter']">Visualisasi data yang memukau dengan neon effects</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-3 h-3 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold font-['Inter']">Real-time Monitoring</h3>
                    <p className="text-blue-200 text-sm font-['Inter']">Update data langsung tanpa delay</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-3 h-3 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold font-['Inter']">Advanced Analytics</h3>
                    <p className="text-blue-200 text-sm font-['Inter']">Insight mendalam untuk pertumbuhan bisnis</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 mt-10"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25 font-['Inter']"
                >
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Lihat Demo Analytics
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white/20 hover:bg-white/10 transition-all duration-200 font-['Inter']"
                >
                  Pelajari Lebih Lanjut
                </motion.button>
              </motion.div>
            </motion.div>
            
            {/* Right Column - Floating Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Floating Effect */}
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="relative z-10"
              >
                <AnalyticsDashboardPreview />
              </motion.div>
              
              {/* Glow Effect Behind Card */}
              <motion.div
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl -z-10"
              />
              
              {/* Ambient Particles */}
              <AmbientParticles />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Siap Membangun Marketplace Masa Depan Anda?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Efisiensi bagi Penjual, Kontrol Penuh bagi Admin. Jelajahi ekosistem marketplace yang dirancang untuk skala besar.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-xl"
            >
              Mulai Sekarang (Gratis)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Hubungi Tim Penjualan
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <p className="text-blue-100 text-sm">
              ✨ Tidak perlu kartu kredit • Siap dalam 5 menit • Dukungan 24/7
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
