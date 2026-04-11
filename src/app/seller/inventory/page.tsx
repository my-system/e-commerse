"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Download,
  Edit,
  Plus,
  Minus,
  RefreshCw,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface InventoryItem {
  id: string;
  title: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unitPrice: number;
  totalValue: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
  lastUpdated: string;
  supplier?: string;
  location?: string;
  batchNumber?: string;
  expiryDate?: string;
}

interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  overstockItems: number;
  categories: number;
}

export default function SellerInventoryPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    overstockItems: 0,
    categories: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      fetchInventory();
    }
  }, [isLoading]);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, statusFilter, categoryFilter]);

  useEffect(() => {
    calculateStats();
  }, [inventory]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration
      const mockInventory: InventoryItem[] = [
        {
          id: '1',
          title: 'Kemeja Formal Premium',
          sku: 'KFP-001',
          category: 'Fashion',
          currentStock: 45,
          minStock: 10,
          maxStock: 100,
          reorderPoint: 15,
          unitPrice: 200000,
          totalValue: 9000000,
          status: 'in_stock',
          lastUpdated: '2024-01-15T10:30:00Z',
          supplier: 'Supplier A',
          location: 'Gudang A',
          batchNumber: 'BATCH-001'
        },
        {
          id: '2',
          title: 'Sepatu Sneakers Sport',
          sku: 'SSS-002',
          category: 'Shoes',
          currentStock: 8,
          minStock: 15,
          maxStock: 80,
          reorderPoint: 20,
          unitPrice: 150000,
          totalValue: 1200000,
          status: 'low_stock',
          lastUpdated: '2024-01-14T15:45:00Z',
          supplier: 'Supplier B',
          location: 'Gudang B',
          batchNumber: 'BATCH-002'
        },
        {
          id: '3',
          title: 'Tas Leather Handbag',
          sku: 'TLH-003',
          category: 'Bags',
          currentStock: 0,
          minStock: 5,
          maxStock: 50,
          reorderPoint: 10,
          unitPrice: 300000,
          totalValue: 0,
          status: 'out_of_stock',
          lastUpdated: '2024-01-13T09:20:00Z',
          supplier: 'Supplier C',
          location: 'Gudang A',
          batchNumber: 'BATCH-003'
        },
        {
          id: '4',
          title: 'Jam Tangan Elegant',
          sku: 'JTE-004',
          category: 'Accessories',
          currentStock: 75,
          minStock: 20,
          maxStock: 60,
          reorderPoint: 25,
          unitPrice: 150000,
          totalValue: 11250000,
          status: 'overstock',
          lastUpdated: '2024-01-12T14:10:00Z',
          supplier: 'Supplier D',
          location: 'Gudang C',
          batchNumber: 'BATCH-004'
        },
        {
          id: '5',
          title: 'Kaos Casual Comfort',
          sku: 'KCC-005',
          category: 'Fashion',
          currentStock: 120,
          minStock: 25,
          maxStock: 150,
          reorderPoint: 30,
          unitPrice: 100000,
          totalValue: 12000000,
          status: 'in_stock',
          lastUpdated: '2024-01-11T11:30:00Z',
          supplier: 'Supplier A',
          location: 'Gudang B',
          batchNumber: 'BATCH-005'
        },
        {
          id: '6',
          title: 'Sepatu Boots Formal',
          sku: 'SBF-006',
          category: 'Shoes',
          currentStock: 5,
          minStock: 12,
          maxStock: 70,
          reorderPoint: 15,
          unitPrice: 250000,
          totalValue: 1250000,
          status: 'low_stock',
          lastUpdated: '2024-01-10T16:45:00Z',
          supplier: 'Supplier B',
          location: 'Gudang A',
          batchNumber: 'BATCH-006'
        }
      ];

      setInventory(mockInventory);
      
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Gagal memuat data inventory');
    } finally {
      setLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredInventory(filtered);
  };

  const calculateStats = () => {
    const stats: InventoryStats = {
      totalItems: inventory.length,
      totalValue: inventory.reduce((sum, item) => sum + item.totalValue, 0),
      lowStockItems: inventory.filter(item => item.status === 'low_stock').length,
      outOfStockItems: inventory.filter(item => item.status === 'out_of_stock').length,
      overstockItems: inventory.filter(item => item.status === 'overstock').length,
      categories: new Set(inventory.map(item => item.category)).size
    };
    setStats(stats);
  };

  const updateStock = async (itemId: string, newStock: number) => {
    try {
      setUpdatingStock(itemId);
      
      // Update local state
      setInventory(prev => prev.map(item => {
        if (item.id === itemId) {
          const updatedItem = {
            ...item,
            currentStock: newStock,
            totalValue: newStock * item.unitPrice,
            lastUpdated: new Date().toISOString()
          };
          
          // Update status based on new stock
          if (newStock === 0) {
            updatedItem.status = 'out_of_stock';
          } else if (newStock <= item.minStock) {
            updatedItem.status = 'low_stock';
          } else if (newStock >= item.maxStock) {
            updatedItem.status = 'overstock';
          } else {
            updatedItem.status = 'in_stock';
          }
          
          return updatedItem;
        }
        return item;
      }));
      
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Gagal mengupdate stok');
    } finally {
      setUpdatingStock(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'out_of_stock':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'overstock':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'Tersedia';
      case 'low_stock':
        return 'Stok Rendah';
      case 'out_of_stock':
        return 'Habis';
      case 'overstock':
        return 'Stok Berlebih';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'overstock':
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

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map(item => item.id));
    }
  };

  const bulkUpdateStock = (operation: 'add' | 'subtract' | 'set', value?: number) => {
    selectedItems.forEach(itemId => {
      const item = inventory.find(i => i.id === itemId);
      if (item) {
        let newStock = item.currentStock;
        if (operation === 'add' && value) {
          newStock = item.currentStock + value;
        } else if (operation === 'subtract' && value) {
          newStock = Math.max(0, item.currentStock - value);
        } else if (operation === 'set' && value) {
          newStock = value;
        }
        updateStock(itemId, newStock);
      }
    });
    setSelectedItems([]);
  };

  const exportInventory = () => {
    const csvContent = [
      ['SKU', 'Nama Produk', 'Kategori', 'Stok Saat Ini', 'Stok Minimum', 'Stok Maksimum', 'Harga Satuan', 'Total Nilai', 'Status', 'Terakhir Update'],
      ...filteredInventory.map(item => [
        item.sku,
        item.title,
        item.category,
        item.currentStock,
        item.minStock,
        item.maxStock,
        formatCurrency(item.unitPrice),
        formatCurrency(item.totalValue),
        getStatusText(item.status),
        formatDate(item.lastUpdated)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const categories = Array.from(new Set(inventory.map(item => item.category)));

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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Package className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Manajemen Inventory</h1>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportInventory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchInventory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Nilai</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stok Rendah</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Habis</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stok Berlebih</p>
                <p className="text-2xl font-bold text-orange-600">{stats.overstockItems}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kategori</p>
                <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama, SKU, atau kategori..."
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
                <option value="in_stock">Tersedia</option>
                <option value="low_stock">Stok Rendah</option>
                <option value="out_of_stock">Habis</option>
                <option value="overstock">Stok Berlebih</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Kategori</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-blue-800">
                    {selectedItems.length} item terpilih
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => bulkUpdateStock('add', 10)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    +10 Stok
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => bulkUpdateStock('subtract', 10)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    -10 Stok
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const value = prompt('Masukkan jumlah stok baru:');
                      if (value) {
                        bulkUpdateStock('set', parseInt(value));
                      }
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Set Stok
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedItems([])}
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                  >
                    Batal
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inventory Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
          >
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-red-800">{error}</p>
          </motion.div>
        ) : filteredInventory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border p-12 text-center"
          >
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' ? 'Tidak ada item yang cocok' : 'Belum ada inventory'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Mulai dengan menambahkan produk ke inventory'
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredInventory.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stok
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min/Max
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nilai Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasi
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + (index * 0.05) }}
                      whileHover={{ backgroundColor: '#f9fafb', scale: 1.01 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.category}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900">{item.sku}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateStock(item.id, Math.max(0, item.currentStock - 1))}
                            disabled={updatingStock === item.id}
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Minus className="h-3 w-3" />
                          </motion.button>
                          <span className="text-sm font-medium text-gray-900 w-8 text-center">
                            {item.currentStock}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateStock(item.id, item.currentStock + 1)}
                            disabled={updatingStock === item.id}
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Plus className="h-3 w-3" />
                          </motion.button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>{item.minStock}</div>
                          <div className="text-gray-400">/</div>
                          <div>{item.maxStock}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.totalValue)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                        >
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{getStatusText(item.status)}</span>
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{item.location || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              const value = prompt(`Masukkan stok baru untuk ${item.title}:`, item.currentStock.toString());
                              if (value) {
                                updateStock(item.id, parseInt(value));
                              }
                            }}
                            disabled={updatingStock === item.id}
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
                            title="Edit Stok"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
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
    </motion.div>
  );
}
