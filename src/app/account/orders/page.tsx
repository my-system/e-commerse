"use client";

import { useState, useEffect } from 'react';
import { Package, ArrowLeft, Search, Filter, Calendar, Truck, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  products: {
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Simulate fetching orders data
  useEffect(() => {
    setTimeout(() => {
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-12345',
          date: '2024-03-20',
          status: 'shipped',
          total: 500000,
          items: 2,
          products: [
            {
              name: 'Kemeja Pria Slim Fit',
              image: 'https://images.unsplash.com/photo-1596755094418-8d5be48a5176?w=100',
              quantity: 1,
              price: 250000
            },
            {
              name: 'Celana Jeans',
              image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
              quantity: 1,
              price: 250000
            }
          ]
        },
        {
          id: '2',
          orderNumber: 'ORD-12346',
          date: '2024-03-18',
          status: 'delivered',
          total: 350000,
          items: 1,
          products: [
            {
              name: 'Sepatu Sneakers',
              image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100',
              quantity: 1,
              price: 350000
            }
          ]
        },
        {
          id: '3',
          orderNumber: 'ORD-12347',
          date: '2024-03-15',
          status: 'processing',
          total: 750000,
          items: 3,
          products: [
            {
              name: 'Tas Backpack',
              image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100',
              quantity: 1,
              price: 400000
            },
            {
              name: 'Topi Baseball',
              image: 'https://images.unsplash.com/photo-1576871337622-6d0a9b23b5a2?w=100',
              quantity: 2,
              price: 175000
            }
          ]
        },
        {
          id: '4',
          orderNumber: 'ORD-12348',
          date: '2024-03-10',
          status: 'pending',
          total: 200000,
          items: 1,
          products: [
            {
              name: 'Jam Tangan Digital',
              image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100',
              quantity: 1,
              price: 200000
            }
          ]
        }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      pending: {
        label: 'Menunggu Pembayaran',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
      },
      processing: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-800',
        icon: Package
      },
      shipped: {
        label: 'Dikirim',
        color: 'bg-purple-100 text-purple-800',
        icon: Truck
      },
      delivered: {
        label: 'Selesai',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      cancelled: {
        label: 'Dibatalkan',
        color: 'bg-red-100 text-red-800',
        icon: Clock
      }
    };
    return configs[status];
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.products.some(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/account"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pesanan Saya</h1>
                <p className="text-gray-600 mt-2">
                  Lihat riwayat dan status pesanan Anda
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari pesanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu Pembayaran</option>
                <option value="processing">Diproses</option>
                <option value="shipped">Dikirim</option>
                <option value="delivered">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'Tidak ada pesanan yang cocok' : 'Belum ada pesanan'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Mulai berbelanja untuk melihat pesanan Anda di sini'
              }
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                          <StatusIcon className="h-4 w-4 mr-1" />
                          {statusConfig.label}
                        </span>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          Rp {order.total.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="space-y-3">
                        {order.products.map((product, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                              <p className="text-sm text-gray-600">
                                {product.quantity} × Rp {product.price.toLocaleString('id-ID')}
                              </p>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              Rp {(product.quantity * product.price).toLocaleString('id-ID')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          {order.items} produk • Total Rp {order.total.toLocaleString('id-ID')}
                        </p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
                          Lihat Detail
                        </button>
                      </div>
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
