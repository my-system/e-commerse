"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Search, Filter, Eye, Mail, Phone, MapPin, Calendar, UserCheck, UserX, MoreVertical } from 'lucide-react';

const mockCustomers = [
  {
    id: '1',
    name: 'Ahmad Rizki',
    email: 'ahmad.rizki@email.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    joinDate: '2024-01-15',
    totalOrders: 23,
    totalSpent: 4567000,
    status: 'active'
  },
  {
    id: '2',
    name: 'Siti Nurhaliza',
    email: 'siti.nur@email.com',
    phone: '+62 813-4567-8901',
    location: 'Bandung, Indonesia',
    joinDate: '2024-01-20',
    totalOrders: 15,
    totalSpent: 2345000,
    status: 'active'
  },
  {
    id: '3',
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '+62 814-5678-9012',
    location: 'Surabaya, Indonesia',
    joinDate: '2024-02-01',
    totalOrders: 8,
    totalSpent: 1234000,
    status: 'inactive'
  },
  {
    id: '4',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@email.com',
    phone: '+62 815-6789-0123',
    location: 'Yogyakarta, Indonesia',
    joinDate: '2024-02-10',
    totalOrders: 31,
    totalSpent: 5678000,
    status: 'active'
  }
];

export default function AdminCustomers() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      suspended: 'bg-red-100 text-red-700'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.inactive}`}>
        {status === 'active' ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-sm text-gray-500 mt-1">Manage customer accounts and view purchase history</p>
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
                      placeholder="Search customers by name or email..."
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Customer</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Contact</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Location</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Joined</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Orders</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Total Spent</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-6">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                            <p className="text-xs text-gray-500">ID: {customer.id}</p>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-3 h-3 mr-1 text-gray-400" />
                              {customer.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-3 h-3 mr-1 text-gray-400" />
                              {customer.phone}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                            {customer.location}
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                            {customer.joinDate}
                          </div>
                        </td>
                        <td className="py-3 px-6 text-sm font-medium text-gray-900">{customer.totalOrders}</td>
                        <td className="py-3 px-6 text-sm font-medium text-gray-900">{formatCurrency(customer.totalSpent)}</td>
                        <td className="py-3 px-6">
                          {getStatusBadge(customer.status)}
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                              <MoreVertical className="w-4 h-4" />
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
