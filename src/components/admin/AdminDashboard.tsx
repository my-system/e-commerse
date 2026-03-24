"use client";

import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';

const stats = [
  {
    name: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'increase' as const,
    icon: DollarSign,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  {
    name: 'Total Orders',
    value: '2,543',
    change: '+15.3%',
    changeType: 'increase' as const,
    icon: ShoppingCart,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  {
    name: 'Total Customers',
    value: '1,234',
    change: '+8.2%',
    changeType: 'increase' as const,
    icon: Users,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  },
  {
    name: 'Total Products',
    value: '89',
    change: '-2.1%',
    changeType: 'decrease' as const,
    icon: Package,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700'
  }
];

const recentOrders = [
  {
    id: '#12345',
    customer: 'John Doe',
    product: 'Premium Leather Jacket',
    amount: '$299.00',
    status: 'completed',
    date: '2024-03-24'
  },
  {
    id: '#12346',
    customer: 'Jane Smith',
    product: 'Designer Sneakers',
    amount: '$159.00',
    status: 'processing',
    date: '2024-03-24'
  },
  {
    id: '#12347',
    customer: 'Bob Johnson',
    product: 'Luxury Watch',
    amount: '$599.00',
    status: 'pending',
    date: '2024-03-23'
  }
];

const topProducts = [
  {
    name: 'Premium Leather Jacket',
    sales: 145,
    revenue: '$43,355',
    growth: '+12%'
  },
  {
    name: 'Designer Sneakers',
    sales: 238,
    revenue: '$37,842',
    growth: '+8%'
  },
  {
    name: 'Luxury Watch',
    sales: 67,
    revenue: '$40,133',
    growth: '+15%'
  }
];

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back! Here's an overview of your store.</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const ChangeIcon = stat.changeType === 'increase' ? ArrowUpRight : ArrowDownRight;
            
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <ChangeIcon className="w-4 h-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.name}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View all
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Order ID</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Product</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-6 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="py-3 px-6 text-sm text-gray-600">{order.customer}</td>
                      <td className="py-3 px-6 text-sm text-gray-600">{order.product}</td>
                      <td className="py-3 px-6 text-sm font-medium text-gray-900">{order.amount}</td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View all
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{product.revenue}</p>
                    <p className="text-xs text-green-600">{product.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
