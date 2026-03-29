"use client";

import { useState, useEffect } from 'react';
import { User, Package, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/layout/Footer';

import { useAuth } from '@/contexts/AuthContext';

export default function AccountDashboard() {
  const { user, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Use real user data from AuthContext
  useEffect(() => {
    if (isLoggedIn && user) {
      setIsLoading(false);
    } else if (!isLoggedIn) {
      // Redirect to login if not logged in
      window.location.href = '/login';
    }
  }, [isLoggedIn, user]);

  const stats = [
    {
      label: 'Total Pesanan',
      value: '12',
      icon: Package,
      href: '/account/orders',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Wishlist',
      value: '8',
      icon: Heart,
      href: '/account/wishlist',
      color: 'bg-red-50 text-red-600'
    },
    {
      label: 'Total Belanja',
      value: 'Rp 2.5M',
      icon: ShoppingBag,
      href: '/account/orders',
      color: 'bg-green-50 text-green-600'
    }
  ];

  const quickActions = [
    {
      title: 'Edit Profil',
      description: 'Perbarui informasi profil Anda',
      icon: User,
      href: '/account/profile',
      color: 'bg-blue-500'
    },
    {
      title: 'Pesanan Saya',
      description: 'Lihat riwayat pesanan',
      icon: Package,
      href: '/account/orders',
      color: 'bg-green-500'
    },
    {
      title: 'Wishlist',
      description: 'Produk yang disukai',
      icon: Heart,
      href: '/account/wishlist',
      color: 'bg-red-500'
    },
    {
      title: 'Alamat',
      description: 'Kelola alamat pengiriman',
      icon: User,
      href: '/account/addresses',
      color: 'bg-purple-500'
    }
  ];

  const recentOrders = [
    {
      id: '12345',
      date: '2 hari lalu',
      status: 'Dikirim',
      statusColor: 'bg-green-100 text-green-800',
      items: 2,
      total: 'Rp 500.000'
    },
    {
      id: '12346',
      date: '5 hari lalu',
      status: 'Diproses',
      statusColor: 'bg-blue-100 text-blue-800',
      items: 1,
      total: 'Rp 250.000'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Halo, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Selamat datang di dashboard akun Anda
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 mb-3`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 text-center">{action.title}</h3>
                <p className="text-xs text-gray-600 text-center">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Pesanan Terbaru</h2>
            <Link
              href="/account/orders"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Lihat Semua
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tanggal</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">#{order.id}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium ${order.statusColor} rounded-full`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{order.total}</td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}
