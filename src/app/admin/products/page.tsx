"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';

const mockProducts = [
  {
    id: 1,
    name: 'Premium Leather Jacket',
    category: 'Clothing',
    price: 299.99,
    stock: 45,
    status: 'active',
    image: '/products/jacket.jpg',
    sku: 'JKT-001'
  },
  {
    id: 2,
    name: 'Designer Sneakers',
    category: 'Shoes',
    price: 159.99,
    stock: 128,
    status: 'active',
    image: '/products/sneakers.jpg',
    sku: 'SNE-002'
  },
  {
    id: 3,
    name: 'Luxury Watch',
    category: 'Accessories',
    price: 599.99,
    stock: 12,
    status: 'low_stock',
    image: '/products/watch.jpg',
    sku: 'WCH-003'
  }
];

export default function AdminProducts() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      router.push('/');
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || user?.role !== 'admin') {
    return null;
  }

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
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
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="clothing">Clothing</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Product</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">SKU</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Category</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Price</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Stock</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Eye className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500">ID: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-sm text-gray-600">{product.sku}</td>
                        <td className="py-3 px-6 text-sm text-gray-600">{product.category}</td>
                        <td className="py-3 px-6 text-sm font-medium text-gray-900">${product.price}</td>
                        <td className="py-3 px-6">
                          <span className={`text-sm font-medium ${
                            product.stock <= 10 ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            product.status === 'active' 
                              ? 'bg-green-100 text-green-700'
                              : product.status === 'low_stock'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {product.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
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
