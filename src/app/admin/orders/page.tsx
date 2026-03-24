"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const mockOrders = [
  {
    id: '#12345',
    customer: 'John Doe',
    email: 'john@example.com',
    product: 'Premium Leather Jacket',
    amount: 299.99,
    status: 'completed',
    date: '2024-03-24',
    paymentMethod: 'Credit Card'
  },
  {
    id: '#12346',
    customer: 'Jane Smith',
    email: 'jane@example.com',
    product: 'Designer Sneakers',
    amount: 159.99,
    status: 'processing',
    date: '2024-03-24',
    paymentMethod: 'PayPal'
  },
  {
    id: '#12347',
    customer: 'Bob Johnson',
    email: 'bob@example.com',
    product: 'Luxury Watch',
    amount: 599.99,
    status: 'pending',
    date: '2024-03-23',
    paymentMethod: 'Bank Transfer'
  }
];

export default function AdminOrders() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      router.push('/');
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || user?.role !== 'admin') {
    return null;
  }

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Truck className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      processing: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || styles.pending}`}>
        {getStatusIcon(status)}
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-sm text-gray-500 mt-1">Manage customer orders and fulfillment</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search orders by customer or order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Order ID</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Customer</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Product</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Amount</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Payment</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-6">
                          <span className="text-sm font-medium text-gray-900">{order.id}</span>
                        </td>
                        <td className="py-3 px-6">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                            <p className="text-xs text-gray-500">{order.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-sm text-gray-600">{order.product}</td>
                        <td className="py-3 px-6 text-sm font-medium text-gray-900">${order.amount}</td>
                        <td className="py-3 px-6 text-sm text-gray-600">{order.paymentMethod}</td>
                        <td className="py-3 px-6 text-sm text-gray-600">{order.date}</td>
                        <td className="py-3 px-6">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
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
    </div>
  );
}
