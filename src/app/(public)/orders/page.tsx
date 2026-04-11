"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Package, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  ShoppingBag,
  Truck,
  MapPin
} from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
  product: {
    id: string;
    title: string;
    images: string;
  };
}

interface Order {
  id: string;
  userId: string;
  status: string;
  total: number;
  shipping: number;
  tax: number;
  address: string;
  addressId?: string | null;
  shippingMethod?: string | null;
  paymentMethod?: string | null;
  paymentId?: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function OrdersPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/user');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.error || 'Gagal memuat pesanan');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Terjadi kesalahan saat memuat pesanan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, router]);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, {
      label: string;
      color: string;
      icon: any;
    }> = {
      PENDING: {
        label: 'Menunggu Pembayaran',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock
      },
      PAID: {
        label: 'Sudah Dibayar',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle
      },
      PROCESSING: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Package
      },
      SHIPPED: {
        label: 'Dikirim',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: Truck
      },
      DELIVERED: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle
      },
      CANCELLED: {
        label: 'Dibatalkan',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle
      }
    };
    return configs[status] || configs.PENDING;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getProductImage = (images: string) => {
    try {
      const parsedImages = JSON.parse(images);
      return parsedImages[0] || '/placeholder.png';
    } catch {
      return '/placeholder.png';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Pesanan</h1>
          <p className="text-gray-600 mt-2">
            Lihat semua pesanan Anda
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <XCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum ada pesanan
            </h3>
            <p className="text-gray-600 mb-6">
              Ayo mulai belanja!
            </p>
            <Link 
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            INV-{order.id.slice(0, 8).toUpperCase()}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1 inline" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.orderItems.length} produk
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={getProductImage(item.product.images)}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {item.product.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.size ? `Size: ${item.size}` : ''} 
                              {item.color ? ` | Color: ${item.color}` : ''}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(item.quantity * item.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Alamat Pengiriman</p>
                        <p className="text-sm text-gray-600">{order.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        {order.shippingMethod && (
                          <span>Metode Pengiriman: {order.shippingMethod}</span>
                        )}
                      </div>
                      <Link
                        href={`/orders/${order.id}/payment`}
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Lihat Detail
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
