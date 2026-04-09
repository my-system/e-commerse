"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  Eye,
  Download,
  Upload
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
  image: string;
  supplier: string;
  cost: number;
}

export default function InventoryPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock inventory data
  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'ADMIN') {
      router.push('/access-denied');
      return;
    }

    // Simulate API call
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Premium Leather Jacket',
        sku: 'JKT-001',
        category: 'Pakaian',
        price: 299000,
        stock: 25,
        lowStockThreshold: 10,
        status: 'in-stock',
        lastUpdated: '2024-03-24',
        image: '/products/jacket-1.jpg',
        supplier: 'Fashion Supplier A',
        cost: 150000
      },
      {
        id: '2',
        name: 'Designer Sneakers',
        sku: 'SHO-002',
        category: 'Sepatu',
        price: 159000,
        stock: 8,
        lowStockThreshold: 10,
        status: 'low-stock',
        lastUpdated: '2024-03-24',
        image: '/products/sneakers-1.jpg',
        supplier: 'Shoe Supplier B',
        cost: 80000
      },
      {
        id: '3',
        name: 'Luxury Watch',
        sku: 'ACC-003',
        category: 'Aksesoris',
        price: 599000,
        stock: 0,
        lowStockThreshold: 5,
        status: 'out-of-stock',
        lastUpdated: '2024-03-23',
        image: '/products/watch-1.jpg',
        supplier: 'Watch Supplier C',
        cost: 300000
      }
    ];

    setTimeout(() => {
      setInventory(mockInventory);
      setIsLoading(false);
    }, 1000);
  }, [isLoggedIn, user, router]);

  const categories = ['all', 'Pakaian', 'Sepatu', 'Aksesoris'];
  const statuses = ['all', 'in-stock', 'low-stock', 'out-of-stock'];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'text-green-600 bg-green-100';
      case 'low-stock': return 'text-yellow-600 bg-yellow-100';
      case 'out-of-stock': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-stock': return 'Tersedia';
      case 'low-stock': return 'Stok Rendah';
      case 'out-of-stock': return 'Habis';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.price), 0);
  const totalCost = inventory.reduce((sum, item) => sum + (item.stock * item.cost), 0);
  const totalProfit = totalValue - totalCost;
  const lowStockItems = inventory.filter(item => item.status === 'low-stock').length;
  const outOfStockItems = inventory.filter(item => item.status === 'out-of-stock').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="hidden md:block">
          <Navbar />
        </div>
        
        <div className="md:hidden">
          
            <div className="px-4 py-6">
              {/* Mobile Content */}
            </div>
          
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        
          <div className="px-4 py-6 space-y-6">
            {/* Mobile Inventory Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Inventory Stats</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Total Produk</p>
                  <p className="text-lg font-bold text-blue-900">{inventory.length}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">Nilai Total</p>
                  <p className="text-lg font-bold text-green-900">{formatCurrency(totalValue)}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-xs text-yellow-600 font-medium">Stok Rendah</p>
                  <p className="text-lg font-bold text-yellow-900">{lowStockItems}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-xs text-red-600 font-medium">Habis</p>
                  <p className="text-lg font-bold text-red-900">{outOfStockItems}</p>
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Semua' : category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'Semua' : getStatusText(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Inventory List */}
            <div className="space-y-4">
              {filteredInventory.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-xs text-gray-500">{item.sku} • {item.category}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-600">
                          Stok: <span className="font-medium text-gray-900">{item.stock}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Harga: <span className="font-medium text-gray-900">{formatCurrency(item.price)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">
                          Nilai: {formatCurrency(item.stock * item.price)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/admin/products/${item.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/products/${item.id}/edit`)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Inventory Management</h1>
                <p className="text-gray-600">Kelola stok dan produk Anda</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {/* Export functionality */}}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                
                <button
                  onClick={() => {/* Import functionality */}}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import</span>
                </button>
                
                <button
                  onClick={() => router.push('/admin/products/add')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 text-blue-600" />
                <span className="text-sm text-gray-500">Total Produk</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{inventory.length}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <span className="text-sm text-gray-500">Nilai Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingDown className="w-8 h-8 text-red-600" />
                <span className="text-sm text-gray-500">Total Biaya</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalCost)}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
                <span className="text-sm text-gray-500">Stok Rendah</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 text-red-600" />
                <span className="text-sm text-gray-500">Habis</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari produk atau SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Semua Kategori' : category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'Semua Status' : getStatusText(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.supplier}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.stock}</div>
                        <div className="text-xs text-gray-500">Min: {item.lowStockThreshold}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.stock * item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/admin/products/${item.id}`)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/products/${item.id}/edit`)}
                            className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {/* Delete functionality */}}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
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

      <Footer />
    </div>
  );
}
