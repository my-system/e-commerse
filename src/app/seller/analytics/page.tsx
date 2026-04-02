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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Analitik Penjualan</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">7 Hari Terakhir</option>
                <option value="30d">30 Hari Terakhir</option>
                <option value="90d">90 Hari Terakhir</option>
                <option value="1y">1 Tahun</option>
              </select>
              <button
                onClick={exportData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
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
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Penjualan</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(salesData.totalSales)}</p>
                <div className="flex items-center mt-1">
                  {salesData.growthRate > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${salesData.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(salesData.growthRate)}%
                  </span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendapatan</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(salesData.totalRevenue)}</p>
                <div className="flex items-center mt-1">
                  {salesData.growthRate > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${salesData.growthRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(salesData.growthRate)}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pesanan</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(salesData.totalOrders)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">8.2%</span>
                </div>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pelanggan</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(salesData.totalCustomers)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">15.3%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rata-rata Order</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(salesData.averageOrderValue)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">3.7%</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Konversi</p>
                <p className="text-2xl font-bold text-gray-900">3.2%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">0.5%</span>
                </div>
              </div>
              <PieChart className="h-8 w-8 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trend Penjualan</h2>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart akan ditampilkan di sini</p>
                  <p className="text-sm text-gray-400 mt-1">Integrasi dengan chart library diperlukan</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Tertinggi</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(5000000)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rata-rata</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(2916667)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Terendah</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(1000000)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Kategori</h2>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Pie chart akan ditampilkan di sini</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {categorySales.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: `hsl(${index * 72}, 70%, 50%)` }}
                      ></div>
                      <span className="text-sm text-gray-600">{category.category}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{category.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Produk Terlaris</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Terjual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pendapatan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{formatNumber(product.sales)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</span>
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
