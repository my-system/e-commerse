"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Store, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Ban, 
  Shield, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Star, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  UserPlus, 
  UserMinus, 
  Crown,
  Eye,
  EyeOff,
  MoreVertical,
  ChevronDown,
  UserCheck,
  UserX,
  Clock,
  Activity,
  Package,
  DollarSign,
  Users,
  Settings,
  Globe,
  CreditCard,
  Truck,
  FileText,
  BarChart3,
  PieChart,
  Zap,
  Lock,
  Unlock,
  AlertTriangle,
  CheckSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MarketplaceSettings {
  platform: {
    name: string;
    description: string;
    logo: string;
    currency: string;
    timezone: string;
    language: string;
  };
  commissions: {
    sellerCommission: number;
    paymentGatewayFee: number;
    shippingFee: number;
    taxRate: number;
  };
  limits: {
    maxProductsPerSeller: number;
    maxImagesPerProduct: number;
    minOrderAmount: number;
    maxOrderAmount: number;
  };
  features: {
    allowGuestCheckout: boolean;
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
    enableReviews: boolean;
    enableWishlist: boolean;
    enableChat: boolean;
    enableNotifications: boolean;
  };
  approvals: {
    requireSellerApproval: boolean;
    requireProductApproval: boolean;
    autoApproveVerifiedSellers: boolean;
  };
}

interface MarketplaceStats {
  totalSellers: number;
  activeSellers: number;
  pendingSellers: number;
  suspendedSellers: number;
  totalProducts: number;
  activeProducts: number;
  pendingProducts: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  platformCommission: number;
  averageOrderValue: number;
  conversionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'seller_registered' | 'product_added' | 'order_completed' | 'seller_suspended' | 'product_approved';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export default function AdminMarketplacePage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [settings, setSettings] = useState<MarketplaceSettings | null>(null);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'sellers' | 'products' | 'orders'>('overview');
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Temporarily remove admin check for testing
      fetchMarketplaceData();
    }
  }, [isLoading]);

  const fetchMarketplaceData = async () => {
    try {
      setLoading(true);
      
      // Mock settings data
      const mockSettings: MarketplaceSettings = {
        platform: {
          name: 'E-Commerce Platform',
          description: 'Premium e-commerce marketplace for Indonesian businesses',
          logo: '/logo.png',
          currency: 'IDR',
          timezone: 'Asia/Jakarta',
          language: 'id-ID'
        },
        commissions: {
          sellerCommission: 5.0,
          paymentGatewayFee: 2.5,
          shippingFee: 15000,
          taxRate: 11.0
        },
        limits: {
          maxProductsPerSeller: 1000,
          maxImagesPerProduct: 8,
          minOrderAmount: 10000,
          maxOrderAmount: 50000000
        },
        features: {
          allowGuestCheckout: false,
          requireEmailVerification: true,
          requirePhoneVerification: false,
          enableReviews: true,
          enableWishlist: true,
          enableChat: true,
          enableNotifications: true
        },
        approvals: {
          requireSellerApproval: true,
          requireProductApproval: false,
          autoApproveVerifiedSellers: true
        }
      };

      // Mock stats data
      const mockStats: MarketplaceStats = {
        totalSellers: 892,
        activeSellers: 756,
        pendingSellers: 45,
        suspendedSellers: 91,
        totalProducts: 12456,
        activeProducts: 11234,
        pendingProducts: 234,
        totalOrders: 45678,
        completedOrders: 42345,
        pendingOrders: 1234,
        totalRevenue: 2456789000,
        platformCommission: 122839450,
        averageOrderValue: 197000,
        conversionRate: 3.2
      };

      // Mock activities data
      const mockActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'seller_registered',
          title: 'New Seller Registered',
          description: 'Toko Fashion Premium joined the platform',
          timestamp: '2024-01-15T10:30:00Z',
          user: 'Toko Fashion Premium',
          status: 'success'
        },
        {
          id: '2',
          type: 'product_added',
          title: 'New Product Added',
          description: '234 new products added by various sellers',
          timestamp: '2024-01-15T09:15:00Z',
          status: 'info'
        },
        {
          id: '3',
          type: 'order_completed',
          title: 'Order Completed',
          description: 'Order #12345 completed successfully',
          timestamp: '2024-01-15T08:45:00Z',
          user: 'Ahmad Rizki',
          status: 'success'
        },
        {
          id: '4',
          type: 'seller_suspended',
          title: 'Seller Suspended',
          description: 'Suspicious Store suspended due to policy violation',
          timestamp: '2024-01-14T16:20:00Z',
          user: 'Suspicious Store',
          status: 'error'
        },
        {
          id: '5',
          type: 'product_approved',
          title: 'Products Approved',
          description: '45 products approved and listed',
          timestamp: '2024-01-14T14:10:00Z',
          status: 'success'
        }
      ];

      setSettings(mockSettings);
      setStats(mockStats);
      setActivities(mockActivities);
      
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
      setError('Gagal memuat data marketplace');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<MarketplaceSettings>) => {
    try {
      setSavingSettings(true);
      
      // Update local state
      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Gagal mengupdate settings');
    } finally {
      setSavingSettings(false);
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'seller_registered':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'product_added':
        return <Package className="h-4 w-4 text-green-500" />;
      case 'order_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'seller_suspended':
        return <UserX className="h-4 w-4 text-red-500" />;
      case 'product_approved':
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportMarketplaceData = () => {
    if (!stats || !settings) return;

    const csvContent = [
      ['Platform Settings', '', ''],
      ['Platform Name', settings.platform.name, ''],
      ['Currency', settings.platform.currency, ''],
      ['Language', settings.platform.language, ''],
      [''],
      ['Commission Rates', '', ''],
      ['Seller Commission', `${settings.commissions.sellerCommission}%`, ''],
      ['Payment Gateway Fee', `${settings.commissions.paymentGatewayFee}%`, ''],
      ['Shipping Fee', formatCurrency(settings.commissions.shippingFee), ''],
      ['Tax Rate', `${settings.commissions.taxRate}%`, ''],
      [''],
      ['Marketplace Stats', '', ''],
      ['Total Sellers', stats.totalSellers, ''],
      ['Active Sellers', stats.activeSellers, ''],
      ['Total Products', stats.totalProducts, ''],
      ['Active Products', stats.activeProducts, ''],
      ['Total Orders', stats.totalOrders, ''],
      ['Completed Orders', stats.completedOrders, ''],
      ['Total Revenue', formatCurrency(stats.totalRevenue), ''],
      ['Platform Commission', formatCurrency(stats.platformCommission), ''],
      ['Average Order Value', formatCurrency(stats.averageOrderValue), ''],
      ['Conversion Rate', `${stats.conversionRate}%`, '']
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketplace-data-${new Date().toISOString().split('T')[0]}.csv`;
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

  if (!stats || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-800">{error || 'Data tidak tersedia'}</p>
        </div>
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
              <Store className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Marketplace Control</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={exportMarketplaceData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={fetchMarketplaceData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'settings', name: 'Settings', icon: Settings },
              { id: 'sellers', name: 'Sellers', icon: Users },
              { id: 'products', name: 'Products', icon: Package },
              { id: 'orders', name: 'Orders', icon: ShoppingBag }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-xl font-bold text-gray-900">{formatCompactCurrency(stats.totalRevenue)}</p>
                    <p className="text-xs text-gray-500 mt-1">Platform: {formatCompactCurrency(stats.platformCommission)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Sellers</p>
                    <p className="text-xl font-bold text-gray-900">{formatNumber(stats.activeSellers)}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatNumber(stats.pendingSellers)} pending</p>
                  </div>
                  <Store className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Products</p>
                    <p className="text-xl font-bold text-gray-900">{formatNumber(stats.activeProducts)}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatNumber(stats.pendingProducts)} pending</p>
                  </div>
                  <Package className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-xl font-bold text-gray-900">{formatNumber(stats.totalOrders)}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatNumber(stats.pendingOrders)} pending</p>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Order Value</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-xl font-bold text-gray-900">{stats.conversionRate}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Commission Rate</p>
                    <p className="text-xl font-bold text-gray-900">{settings.commissions.sellerCommission}%</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      {activity.user && (
                        <p className="text-xs text-gray-500 mt-1">User: {activity.user}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Platform Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                  <input
                    type="text"
                    value={settings.platform.name}
                    onChange={(e) => updateSettings({
                      platform: { ...settings.platform, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={settings.platform.currency}
                    onChange={(e) => updateSettings({
                      platform: { ...settings.platform, currency: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="IDR">Indonesian Rupiah (IDR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.platform.timezone}
                    onChange={(e) => updateSettings({
                      platform: { ...settings.platform, timezone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Asia/Jakarta">Asia/Jakarta</option>
                    <option value="Asia/Bali">Asia/Bali</option>
                    <option value="Asia/Singapore">Asia/Singapore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={settings.platform.language}
                    onChange={(e) => updateSettings({
                      platform: { ...settings.platform, language: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="id-ID">Indonesian</option>
                    <option value="en-US">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Commission Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Commission & Fees</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seller Commission (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.commissions.sellerCommission}
                    onChange={(e) => updateSettings({
                      commissions: { ...settings.commissions, sellerCommission: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway Fee (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.commissions.paymentGatewayFee}
                    onChange={(e) => updateSettings({
                      commissions: { ...settings.commissions, paymentGatewayFee: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Fee (IDR)</label>
                  <input
                    type="number"
                    min="0"
                    value={settings.commissions.shippingFee}
                    onChange={(e) => updateSettings({
                      commissions: { ...settings.commissions, shippingFee: parseInt(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.commissions.taxRate}
                    onChange={(e) => updateSettings({
                      commissions: { ...settings.commissions, taxRate: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Feature Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Feature Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(settings.features).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-gray-700">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <button
                      onClick={() => updateSettings({
                        features: { ...settings.features, [key]: !value }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Approval Settings</h3>
              <div className="space-y-4">
                {Object.entries(settings.approvals).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-gray-700">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <button
                      onClick={() => updateSettings({
                        approvals: { ...settings.approvals, [key]: !value }
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sellers Tab */}
        {activeTab === 'sellers' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Seller Overview</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-blue-900">Total Sellers</h4>
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-900">{formatNumber(stats.totalSellers)}</p>
                <p className="text-xs text-blue-600 mt-1">Registered sellers</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-green-900">Active Sellers</h4>
                  <UserCheck className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-900">{formatNumber(stats.activeSellers)}</p>
                <p className="text-xs text-green-600 mt-1">{((stats.activeSellers / stats.totalSellers) * 100).toFixed(1)}% active</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-yellow-900">Pending Sellers</h4>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-900">{formatNumber(stats.pendingSellers)}</p>
                <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-red-900">Suspended Sellers</h4>
                  <UserX className="h-4 w-4 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-900">{formatNumber(stats.suspendedSellers)}</p>
                <p className="text-xs text-red-600 mt-1">Violated policies</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Product Overview</h3>
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-blue-900">Total Products</h4>
                  <Package className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-900">{formatNumber(stats.totalProducts)}</p>
                <p className="text-xs text-blue-600 mt-1">All products listed</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-green-900">Active Products</h4>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-900">{formatNumber(stats.activeProducts)}</p>
                <p className="text-xs text-green-600 mt-1">{((stats.activeProducts / stats.totalProducts) * 100).toFixed(1)}% active</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-yellow-900">Pending Products</h4>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-900">{formatNumber(stats.pendingProducts)}</p>
                <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-purple-900">Avg per Seller</h4>
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-900">{formatNumber(Math.round(stats.totalProducts / stats.activeSellers))}</p>
                <p className="text-xs text-purple-600 mt-1">Products per seller</p>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Order Overview</h3>
              <ShoppingBag className="h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-blue-900">Total Orders</h4>
                  <ShoppingBag className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-900">{formatNumber(stats.totalOrders)}</p>
                <p className="text-xs text-blue-600 mt-1">All time orders</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-green-900">Completed Orders</h4>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-900">{formatNumber(stats.completedOrders)}</p>
                <p className="text-xs text-green-600 mt-1">{((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}% completed</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-yellow-900">Pending Orders</h4>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-900">{formatNumber(stats.pendingOrders)}</p>
                <p className="text-xs text-yellow-600 mt-1">Processing orders</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-purple-900">Avg Order Value</h4>
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(stats.averageOrderValue)}</p>
                <p className="text-xs text-purple-600 mt-1">Per order average</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
