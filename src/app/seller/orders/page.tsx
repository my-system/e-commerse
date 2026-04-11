"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  RefreshCw,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  total: number;
  image?: string;
  variant?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  notes?: string;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export default function SellerOrdersPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'paid' | 'failed' | 'refunded'>('all');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      fetchOrders();
    }
  }, [isLoading, dateRange]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  useEffect(() => {
    calculateStats();
  }, [orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          customerName: 'Budi Santoso',
          customerEmail: 'budi@email.com',
          customerPhone: '08123456789',
          shippingAddress: {
            street: 'Jl. Merdeka No. 123',
            city: 'Jakarta',
            province: 'DKI Jakarta',
            postalCode: '12345',
            country: 'Indonesia'
          },
          items: [
            {
              id: '1',
              title: 'Kemeja Formal Premium',
              quantity: 2,
              price: 200000,
              total: 400000,
              variant: 'Size L, Color Black'
            },
            {
              id: '2',
              title: 'Sepatu Sneakers Sport',
              quantity: 1,
              price: 150000,
              total: 150000,
              variant: 'Size 42, Color Blue'
            }
          ],
          subtotal: 550000,
          shippingCost: 15000,
          tax: 55000,
          total: 620000,
          status: 'pending',
          paymentStatus: 'paid',
          paymentMethod: 'Transfer Bank',
          orderDate: '2024-01-15T10:30:00Z',
          estimatedDelivery: '2024-01-20',
          notes: 'Harap dikirim secepatnya'
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          customerName: 'Siti Nurhaliza',
          customerEmail: 'siti@email.com',
          customerPhone: '08234567890',
          shippingAddress: {
            street: 'Jl. Sudirman No. 456',
            city: 'Bandung',
            province: 'Jawa Barat',
            postalCode: '40123',
            country: 'Indonesia'
          },
          items: [
            {
              id: '3',
              title: 'Tas Leather Handbag',
              quantity: 1,
              price: 300000,
              total: 300000,
              variant: 'Color Brown'
            }
          ],
          subtotal: 300000,
          shippingCost: 10000,
          tax: 30000,
          total: 340000,
          status: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'E-Wallet',
          orderDate: '2024-01-14T15:45:00Z',
          estimatedDelivery: '2024-01-19'
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          customerName: 'Ahmad Wijaya',
          customerEmail: 'ahmad@email.com',
          customerPhone: '08345678901',
          shippingAddress: {
            street: 'Jl. Gatot Subroto No. 789',
            city: 'Surabaya',
            province: 'Jawa Timur',
            postalCode: '60234',
            country: 'Indonesia'
          },
          items: [
            {
              id: '4',
              title: 'Jam Tangan Elegant',
              quantity: 2,
              price: 150000,
              total: 300000,
              variant: 'Color Gold'
            },
            {
              id: '5',
              title: 'Kaos Casual Comfort',
              quantity: 3,
              price: 100000,
              total: 300000,
              variant: 'Size M, Color White'
            }
          ],
          subtotal: 600000,
          shippingCost: 20000,
          tax: 60000,
          total: 680000,
          status: 'processing',
          paymentStatus: 'paid',
          paymentMethod: 'Credit Card',
          orderDate: '2024-01-13T09:20:00Z',
          estimatedDelivery: '2024-01-18',
          trackingNumber: 'TRK123456789'
        },
        {
          id: '4',
          orderNumber: 'ORD-2024-004',
          customerName: 'Dewi Lestari',
          customerEmail: 'dewi@email.com',
          customerPhone: '08456789012',
          shippingAddress: {
            street: 'Jl. Thamrin No. 101',
            city: 'Medan',
            province: 'Sumatera Utara',
            postalCode: '20123',
            country: 'Indonesia'
          },
          items: [
            {
              id: '6',
              title: 'Sepatu Boots Formal',
              quantity: 1,
              price: 250000,
              total: 250000,
              variant: 'Size 41, Color Black'
            }
          ],
          subtotal: 250000,
          shippingCost: 25000,
          tax: 25000,
          total: 300000,
          status: 'shipped',
          paymentStatus: 'paid',
          paymentMethod: 'Transfer Bank',
          orderDate: '2024-01-12T14:10:00Z',
          estimatedDelivery: '2024-01-17',
          trackingNumber: 'TRK987654321'
        },
        {
          id: '5',
          orderNumber: 'ORD-2024-005',
          customerName: 'Rudi Hartono',
          customerEmail: 'rudi@email.com',
          customerPhone: '08567890123',
          shippingAddress: {
            street: 'Jl. Asia Afrika No. 202',
            city: 'Yogyakarta',
            province: 'DI Yogyakarta',
            postalCode: '55234',
            country: 'Indonesia'
          },
          items: [
            {
              id: '1',
              title: 'Kemeja Formal Premium',
              quantity: 1,
              price: 200000,
              total: 200000,
              variant: 'Size XL, Color White'
            }
          ],
          subtotal: 200000,
          shippingCost: 15000,
          tax: 20000,
          total: 235000,
          status: 'delivered',
          paymentStatus: 'paid',
          paymentMethod: 'COD',
          orderDate: '2024-01-11T11:30:00Z',
          estimatedDelivery: '2024-01-15',
          trackingNumber: 'TRK456789123'
        },
        {
          id: '6',
          orderNumber: 'ORD-2024-006',
          customerName: 'Maya Putri',
          customerEmail: 'maya@email.com',
          customerPhone: '08678901234',
          shippingAddress: {
            street: 'Jl. Sudirman No. 303',
            city: 'Makassar',
            province: 'Sulawesi Selatan',
            postalCode: '90123',
            country: 'Indonesia'
          },
          items: [
            {
              id: '2',
              title: 'Sepatu Sneakers Sport',
              quantity: 2,
              price: 150000,
              total: 300000,
              variant: 'Size 40, Color Red'
            }
          ],
          subtotal: 300000,
          shippingCost: 30000,
          tax: 30000,
          total: 360000,
          status: 'cancelled',
          paymentStatus: 'refunded',
          paymentMethod: 'E-Wallet',
          orderDate: '2024-01-10T16:45:00Z',
          notes: 'Customer requested cancellation'
        }
      ];

      setOrders(mockOrders);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Gagal memuat data pesanan');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by payment status
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredOrders(filtered);
  };

  const calculateStats = () => {
    const stats: OrderStats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      processingOrders: orders.filter(order => order.status === 'processing').length,
      shippedOrders: orders.filter(order => order.status === 'shipped').length,
      deliveredOrders: orders.filter(order => order.status === 'delivered').length,
      cancelledOrders: orders.filter(order => order.status === 'cancelled').length,
      totalRevenue: orders.filter(order => order.paymentStatus === 'paid' && order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: orders.filter(order => order.paymentStatus === 'paid' && order.status !== 'cancelled').length > 0 
        ? orders.filter(order => order.paymentStatus === 'paid' && order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0) / orders.filter(order => order.paymentStatus === 'paid' && order.status !== 'cancelled').length
        : 0
    };
    setStats(stats);
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingStatus(orderId);
      
      // Update local state
      setOrders(prev => prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            ...(newStatus === 'shipped' && { trackingNumber: `TRK${Date.now()}` })
          };
        }
        return order;
      }));
      
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Gagal mengupdate status pesanan');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'processing':
        return <Package className="h-4 w-4 text-purple-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-indigo-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'refunded':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Konfirmasi';
      case 'confirmed':
        return 'Dikonfirmasi';
      case 'processing':
        return 'Diproses';
      case 'shipped':
        return 'Dikirim';
      case 'delivered':
        return 'Terkirim';
      case 'cancelled':
        return 'Dibatalkan';
      case 'refunded':
        return 'Dikembalikan';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
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

  const viewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order Number', 'Customer', 'Email', 'Phone', 'Total', 'Status', 'Payment Status', 'Order Date'],
      ...filteredOrders.map(order => [
        order.orderNumber,
        order.customerName,
        order.customerEmail,
        order.customerPhone,
        formatCurrency(order.total),
        getStatusText(order.status),
        order.paymentStatus.toUpperCase(),
        formatDate(order.orderDate)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Pesanan Masuk</h1>
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
                onClick={exportOrders}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={fetchOrders}
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
        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pesanan</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menunggu Konfirmasi</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pendapatan</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rata-rata Order</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </motion.div>
        </motion.div>

        {/* Status Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-4 text-center"
          >
            <p className="text-sm text-gray-600 mb-1">Dikonfirmasi</p>
            <p className="text-lg font-bold text-blue-600">{stats.processingOrders}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-4 text-center"
          >
            <p className="text-sm text-gray-600 mb-1">Diproses</p>
            <p className="text-lg font-bold text-purple-600">{stats.processingOrders}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-4 text-center"
          >
            <p className="text-sm text-gray-600 mb-1">Dikirim</p>
            <p className="text-lg font-bold text-indigo-600">{stats.shippedOrders}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-4 text-center"
          >
            <p className="text-sm text-gray-600 mb-1">Terkirim</p>
            <p className="text-lg font-bold text-green-600">{stats.deliveredOrders}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-4 text-center"
          >
            <p className="text-sm text-gray-600 mb-1">Dibatalkan</p>
            <p className="text-lg font-bold text-red-600">{stats.cancelledOrders}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-4 text-center"
          >
            <p className="text-sm text-gray-600 mb-1">Dikembalikan</p>
            <p className="text-lg font-bold text-orange-600">0</p>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nomor order, pelanggan, atau produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu Konfirmasi</option>
                <option value="confirmed">Dikonfirmasi</option>
                <option value="processing">Diproses</option>
                <option value="shipped">Dikirim</option>
                <option value="delivered">Terkirim</option>
                <option value="cancelled">Dibatalkan</option>
                <option value="refunded">Dikembalikan</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div className="w-full lg:w-48">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Pembayaran</option>
                <option value="paid">Dibayar</option>
                <option value="pending">Menunggu Pembayaran</option>
                <option value="failed">Gagal</option>
                <option value="refunded">Dikembalikan</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-red-800">{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' ? 'Tidak ada pesanan yang cocok' : 'Belum ada pesanan'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' 
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Pesanan akan muncul di sini ketika pelanggan melakukan pembelian'
              }
            </p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 1 + (index * 0.05) }}
                      whileHover={{ backgroundColor: '#f9fafb', scale: 1.01 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                          {order.trackingNumber && (
                            <div className="text-xs text-gray-500">TRK: {order.trackingNumber}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                          <div className="text-xs text-gray-400">{order.customerPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items.slice(0, 2).map(item => item.title).join(', ')}
                          {order.items.length > 2 && '...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.total)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusText(order.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                          <span className="ml-1">{order.paymentStatus.toUpperCase()}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => viewOrderDetail(order)}
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              disabled={updatingStatus === order.id}
                              className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs disabled:opacity-50"
                            >
                              Konfirmasi
                            </button>
                          )}
                          {order.status === 'confirmed' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'processing')}
                              disabled={updatingStatus === order.id}
                              className="px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs disabled:opacity-50"
                            >
                              Proses
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'shipped')}
                              disabled={updatingStatus === order.id}
                              className="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-xs disabled:opacity-50"
                            >
                              Kirim
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showOrderDetail && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowOrderDetail(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto m-4"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Detail Pesanan {selectedOrder.orderNumber}</h2>
                <button
                  onClick={() => setShowOrderDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Informasi Pelanggan
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nama:</span> {selectedOrder.customerName}</div>
                    <div><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</div>
                    <div><span className="font-medium">Telepon:</span> {selectedOrder.customerPhone}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Alamat Pengiriman
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div>{selectedOrder.shippingAddress.street}</div>
                    <div>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province}</div>
                    <div>{selectedOrder.shippingAddress.postalCode}</div>
                    <div>{selectedOrder.shippingAddress.country}</div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Item Pesanan</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Harga</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{item.variant || '-'}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Ringkasan Pesanan</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Pengiriman:</span>
                      <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pajak:</span>
                      <span>{formatCurrency(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Informasi Tambahan</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Metode Pembayaran:</span>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status Pembayaran:</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tanggal Order:</span>
                      <span>{formatDate(selectedOrder.orderDate)}</span>
                    </div>
                    {selectedOrder.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span>Estimasi Pengiriman:</span>
                        <span>{selectedOrder.estimatedDelivery}</span>
                      </div>
                    )}
                    {selectedOrder.notes && (
                      <div>
                        <span className="font-medium">Catatan:</span>
                        <p className="mt-1 text-gray-600">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
