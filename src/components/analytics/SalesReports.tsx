"use client";

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users,
  Package, Calendar, Download, Filter, ChevronDown, Eye,
  Target, Zap, Award, AlertCircle, CheckCircle
} from 'lucide-react';

interface SalesReport {
  period: string;
  revenue: number;
  orders: number;
  customers: number;
  avgOrderValue: number;
  conversionRate: number;
  growth: {
    revenue: number;
    orders: number;
    customers: number;
  };
}

interface ProductPerformance {
  id: string;
  name: string;
  category: string;
  revenue: number;
  orders: number;
  views: number;
  conversionRate: number;
  growth: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

interface SalesInsights {
  topPerformers: ProductPerformance[];
  underPerformers: ProductPerformance[];
  trends: Array<{
    metric: string;
    value: number;
    change: number;
    status: 'positive' | 'negative' | 'neutral';
  }>;
  recommendations: string[];
}

interface SalesReportsProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export default function SalesReports({ timeRange, onTimeRangeChange }: SalesReportsProps) {
  const [reports, setReports] = useState<SalesReport[]>([]);
  const [insights, setInsights] = useState<SalesInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Generate mock sales reports data
  const generateSalesReports = (): SalesReport[] => {
    const periods = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return periods.map((period, index) => {
      const baseRevenue = 50000000;
      const baseOrders = 100;
      const growth = 1 + (index * 0.05) + (Math.random() - 0.5) * 0.2;
      
      return {
        period,
        revenue: Math.floor(baseRevenue * growth),
        orders: Math.floor(baseOrders * growth),
        customers: Math.floor(baseOrders * growth * 0.8),
        avgOrderValue: Math.floor(baseRevenue * growth / (baseOrders * growth)),
        conversionRate: 3.2 + Math.random() * 2,
        growth: {
          revenue: index === 0 ? 0 : ((baseRevenue * growth) / (baseRevenue * (1 + (index - 1) * 0.05)) - 1) * 100,
          orders: index === 0 ? 0 : ((baseOrders * growth) / (baseOrders * (1 + (index - 1) * 0.05)) - 1) * 100,
          customers: index === 0 ? 0 : ((baseOrders * growth * 0.8) / (baseOrders * (1 + (index - 1) * 0.05) * 0.8) - 1) * 100,
        },
      };
    });
  };

  // Generate mock insights data
  const generateInsights = (): SalesInsights => {
    const topPerformers: ProductPerformance[] = [
      {
        id: '1',
        name: 'Classic White T-Shirt',
        category: 'Fashion',
        revenue: 73455000,
        orders: 245,
        views: 3420,
        conversionRate: 7.2,
        growth: 15.3,
        status: 'excellent',
      },
      {
        id: '2',
        name: 'Denim Jacket',
        category: 'Fashion',
        revenue: 94500000,
        orders: 189,
        views: 2890,
        conversionRate: 6.5,
        growth: 12.7,
        status: 'excellent',
      },
      {
        id: '3',
        name: 'Sneakers Sport',
        category: 'Footwear',
        revenue: 62400000,
        orders: 156,
        views: 1980,
        conversionRate: 7.9,
        growth: 8.4,
        status: 'good',
      },
    ];

    const underPerformers: ProductPerformance[] = [
      {
        id: '4',
        name: 'Basic Cap',
        category: 'Accessories',
        revenue: 8900000,
        orders: 45,
        views: 2340,
        conversionRate: 1.9,
        growth: -5.2,
        status: 'poor',
      },
      {
        id: '5',
        name: 'Socks Pack',
        category: 'Fashion',
        revenue: 12300000,
        orders: 82,
        views: 3450,
        conversionRate: 2.4,
        growth: -2.1,
        status: 'average',
      },
    ];

    const trends = [
      {
        metric: 'Revenue Growth',
        value: 18.5,
        change: 3.2,
        status: 'positive' as const,
      },
      {
        metric: 'Customer Retention',
        value: 67.3,
        change: -1.2,
        status: 'negative' as const,
      },
      {
        metric: 'Avg Order Value',
        value: 501000,
        change: 5.8,
        status: 'positive' as const,
      },
      {
        metric: 'Conversion Rate',
        value: 3.2,
        change: 0.4,
        status: 'positive' as const,
      },
    ];

    const recommendations = [
      'Focus on promoting high-conversion products like Sneakers Sport (7.9% CR)',
      'Consider discontinuing underperforming products like Basic Cap',
      'Implement upselling strategies for Denim Jacket customers',
      'Optimize product pages with low conversion rates (< 3%)',
      'Create bundles for complementary products to increase AOV',
    ];

    return {
      topPerformers,
      underPerformers,
      trends,
      recommendations,
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports(generateSalesReports());
      setInsights(generateInsights());
      setLoading(false);
    };

    loadData();
  }, [timeRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'average': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <Award className="h-4 w-4" />;
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'average': return <Eye className="h-4 w-4" />;
      case 'poor': return <AlertCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {insights.trends.map((trend, index) => (
          <div key={trend.metric} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${
                trend.status === 'positive' ? 'bg-green-100' :
                trend.status === 'negative' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {trend.status === 'positive' ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : trend.status === 'negative' ? (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                ) : (
                  <Target className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div className={`text-sm font-medium ${
                trend.status === 'positive' ? 'text-green-600' :
                trend.status === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trend.change > 0 ? '+' : ''}{trend.change}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {trend.metric.includes('Revenue') || trend.metric.includes('Order') 
                ? formatCurrency(trend.value)
                : trend.metric.includes('Rate')
                ? `${trend.value}%`
                : formatNumber(trend.value)
              }
            </h3>
            <p className="text-sm text-gray-600">{trend.metric}</p>
          </div>
        ))}
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sales Trend Analysis</h3>
          <div className="flex items-center gap-2">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="revenue">Revenue</option>
              <option value="orders">Orders</option>
              <option value="customers">Customers</option>
              <option value="avgOrderValue">Avg Order Value</option>
            </select>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={reports}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip 
              formatter={(value: any) => [
                selectedMetric.includes('revenue') || selectedMetric.includes('Order') 
                  ? formatCurrency(Number(value))
                  : selectedMetric.includes('Rate')
                  ? `${Number(value)}%`
                  : formatNumber(Number(value)),
                selectedMetric
              ]
            } />
            <Legend />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              name={selectedMetric}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Product Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-green-600" />
            Top Performers
          </h3>
          <div className="space-y-3">
            {insights.topPerformers.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-semibold text-green-600">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      {product.orders} sold • {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(product.status)}`}>
                    {getStatusIcon(product.status)}
                    {product.conversionRate}% CR
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {product.growth > 0 ? '+' : ''}{product.growth}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Under Performers */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Needs Attention
          </h3>
          <div className="space-y-3">
            {insights.underPerformers.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-semibold text-red-600">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      {product.orders} sold • {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(product.status)}`}>
                    {getStatusIcon(product.status)}
                    {product.conversionRate}% CR
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {product.growth > 0 ? '+' : ''}{product.growth}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-indigo-600" />
          AI Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target className="h-3 w-3 text-indigo-600" />
              </div>
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleString('id-ID')}
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm">
            <Download className="h-4 w-4" />
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
}
