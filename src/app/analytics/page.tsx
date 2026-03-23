'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, 
  Package, Eye, Heart, Clock, Calendar, Download, Filter,
  ArrowUpRight, ArrowDownRight, Activity, Target, Zap
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { MobileNavigation } from '@/components/MobileNavigation'
import SalesReports from '@/components/analytics/SalesReports'

interface AnalyticsData {
  overview: {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    conversionRate: number
    avgOrderValue: number
    revenueGrowth: number
    orderGrowth: number
    customerGrowth: number
  }
  salesData: Array<{
    date: string
    revenue: number
    orders: number
    customers: number
  }>
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
    views: number
    conversionRate: number
  }>
  categoryData: Array<{
    category: string
    sales: number
    revenue: number
    percentage: number
  }>
  customerMetrics: Array<{
    metric: string
    value: number
    change: number
  }>
  realTimeData: {
    activeUsers: number
    currentOrders: number
    todayRevenue: number
    conversionRate: number
  }
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  // Generate mock analytics data
  const generateAnalyticsData = (): AnalyticsData => {
    const salesData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { 
        month: 'short', 
        day: 'numeric' 
      }),
      revenue: Math.floor(Math.random() * 5000000) + 10000000,
      orders: Math.floor(Math.random() * 100) + 200,
      customers: Math.floor(Math.random() * 80) + 150,
    }))

    const topProducts = [
      { id: '1', name: 'Classic White T-Shirt', sales: 245, revenue: 73455000, views: 3420, conversionRate: 7.2 },
      { id: '2', name: 'Denim Jacket', sales: 189, revenue: 94500000, views: 2890, conversionRate: 6.5 },
      { id: '3', name: 'Sneakers Sport', sales: 156, revenue: 62400000, views: 1980, conversionRate: 7.9 },
      { id: '4', name: 'Backpack Premium', sales: 134, revenue: 53600000, views: 1650, conversionRate: 8.1 },
      { id: '5', name: 'Watch Classic', sales: 98, revenue: 78400000, views: 1230, conversionRate: 8.0 },
    ]

    const categoryData = [
      { category: 'Fashion', sales: 450, revenue: 225000000, percentage: 45 },
      { category: 'Footwear', sales: 280, revenue: 168000000, percentage: 28 },
      { category: 'Accessories', sales: 180, revenue: 72000000, percentage: 18 },
      { category: 'Bags', sales: 90, revenue: 36000000, percentage: 9 },
    ]

    const customerMetrics = [
      { metric: 'New Customers', value: 1234, change: 15.2 },
      { metric: 'Returning Customers', value: 892, change: 8.7 },
      { metric: 'Avg Session Duration', value: 4.8, change: -2.1 },
      { metric: 'Pages per Session', value: 3.2, change: 5.4 },
    ]

    return {
      overview: {
        totalRevenue: 501000000,
        totalOrders: 1000,
        totalCustomers: 2126,
        conversionRate: 3.2,
        avgOrderValue: 501000,
        revenueGrowth: 18.5,
        orderGrowth: 12.3,
        customerGrowth: 23.9,
      },
      salesData,
      topProducts,
      categoryData,
      customerMetrics,
      realTimeData: {
        activeUsers: 142,
        currentOrders: 8,
        todayRevenue: 12450000,
        conversionRate: 2.8,
      },
    }
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(generateAnalyticsData())
      setLoading(false)
    }, 1500)
  }, [timeRange])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value)
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Version */}
        <div className="hidden md:block">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow">
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Version */}
        <div className="md:hidden">
          <MobileNavigation>
            <div className="px-4 py-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow">
                      <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MobileNavigation>
        </div>
      </div>
    )
  }

  if (!analyticsData) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Version */}
      <div className="hidden md:block">
        <Navbar />
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-2">Monitor your e-commerce performance</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Time Range Selector */}
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
                
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs text-gray-500">Live</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {analyticsData.realTimeData.activeUsers}
              </h3>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-xs text-gray-500">Live</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {analyticsData.realTimeData.currentOrders}
              </h3>
              <p className="text-sm text-gray-600">Current Orders</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-xs text-gray-500">Today</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.realTimeData.todayRevenue)}
              </h3>
              <p className="text-sm text-gray-600">Today's Revenue</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <span className="text-xs text-gray-500">Today</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {analyticsData.realTimeData.conversionRate}%
              </h3>
              <p className="text-sm text-gray-600">Conversion Rate</p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  analyticsData.overview.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {analyticsData.overview.revenueGrowth > 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {Math.abs(analyticsData.overview.revenueGrowth)}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.overview.totalRevenue)}
              </h3>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  analyticsData.overview.orderGrowth > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {analyticsData.overview.orderGrowth > 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {Math.abs(analyticsData.overview.orderGrowth)}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.totalOrders)}
              </h3>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  analyticsData.overview.customerGrowth > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {analyticsData.overview.customerGrowth > 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {Math.abs(analyticsData.overview.customerGrowth)}%
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.totalCustomers)}
              </h3>
              <p className="text-sm text-gray-600">Total Customers</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-sm text-gray-500">
                  Avg Order Value
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.overview.avgOrderValue)}
              </h3>
              <p className="text-sm text-gray-600">
                {analyticsData.overview.conversionRate}% Conversion
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Trend Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="sales"
                  >
                    {analyticsData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales Reports Section */}
          <div className="mt-8">
            <SalesReports timeRange={timeRange} onTimeRangeChange={setTimeRange} />
          </div>
        </div>

        <Footer />
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileNavigation>
          <div className="px-4 py-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">Business performance insights</p>
            </div>

            {/* Time Range Selector */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 block mb-2">Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>

            {/* Real-time Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-gray-500">Live</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {analyticsData.realTimeData.activeUsers}
                </div>
                <div className="text-xs text-gray-600">Active Users</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-gray-500">Live</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {analyticsData.realTimeData.currentOrders}
                </div>
                <div className="text-xs text-gray-600">Current Orders</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                  <span className="text-xs text-gray-500">Today</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(analyticsData.realTimeData.todayRevenue)}
                </div>
                <div className="text-xs text-gray-600">Today's Revenue</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  <span className="text-xs text-gray-500">Today</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {analyticsData.realTimeData.conversionRate}%
                </div>
                <div className="text-xs text-gray-600">Conversion Rate</div>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(analyticsData.overview.totalRevenue)}
                </div>
                <div className="text-xs text-gray-600">Total Revenue</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatNumber(analyticsData.overview.totalOrders)}
                </div>
                <div className="text-xs text-gray-600">Total Orders</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatNumber(analyticsData.overview.totalCustomers)}
                </div>
                <div className="text-xs text-gray-600">Total Customers</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(analyticsData.overview.avgOrderValue)}
                </div>
                <div className="text-xs text-gray-600">Avg Order Value</div>
              </div>
            </div>

            {/* Mobile Charts */}
            <div className="space-y-6 mb-6">
              {/* Sales Trend Chart */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Sales Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={analyticsData.salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Category Distribution */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Sales by Category</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analyticsData.categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="sales"
                    >
                      {analyticsData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </MobileNavigation>
      </div>
    </div>
  )
}
