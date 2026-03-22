"use client";

import { useState, useEffect } from 'react';
import { User, Package, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface User {
  name: string;
  email: string;
  phone: string;
}

export default function AccountDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching user data
  useEffect(() => {
    setTimeout(() => {
      setUser({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '08123456789'
      });
      setIsLoading(false);
    }, 500);
  }, []);

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
      title: 'Kelola Profil',
      description: 'Perbarui informasi pribadi Anda',
      icon: User,
      href: '/account/profile',
      color: 'bg-blue-600'
    },
    {
      title: 'Lihat Pesanan',
      description: 'Track status pesanan terbaru',
      icon: Package,
      href: '/account/orders',
      color: 'bg-green-600'
    },
    {
      title: 'Wishlist',
      description: 'Lihat produk yang Anda simpan',
      icon: Heart,
      href: '/account/wishlist',
      color: 'bg-red-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
              <div className="h-24 bg-gray-200 rounded-lg"></div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Halo, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Selamat datang di dashboard akun Anda
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <span>Buka</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pesanan Terbaru</h2>
            <Link
              href="/account/orders"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Lihat Semua
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Order #12345</p>
                    <p className="text-sm text-gray-600">2 produk • Rp 500.000</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Dikirim
                    </span>
                    <p className="text-xs text-gray-500 mt-1">2 hari lalu</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Order #12346</p>
                    <p className="text-sm text-gray-600">1 produk • Rp 250.000</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Diproses
                    </span>
                    <p className="text-xs text-gray-500 mt-1">5 hari lalu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
