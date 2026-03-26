"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { products as initialProducts } from '@/data/products';
import { Product as ProductType } from '@/data/products';

interface Product extends ProductType {
  // Additional fields for admin functionality
  slug?: string;
  originalPrice?: number;
  stock?: number;
  isHot?: boolean;
  isNew?: boolean;
  fullDescription?: string;
  sizes?: Array<{ name: string; available: boolean }>;
  colors?: string[];
  fit?: string;
  neckline?: string;
  sleeve?: string;
}

export default function AdminProducts() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'admin') {
      router.push('/');
      return;
    }

    // Load products from localStorage or use initial products
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(initialProducts);
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || user?.role !== 'admin') {
    return null;
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (product: Product) => {
    const stock = product.stock ?? (product.inStock ? 100 : 0); // Default to 100 if inStock, 0 if not
    if (stock === 0) return 'bg-red-100 text-red-700';
    if (stock <= 10) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (product: Product) => {
    const stock = product.stock ?? (product.inStock ? 100 : 0); // Default to 100 if inStock, 0 if not
    if (stock === 0) return 'Habis';
    if (stock <= 10) return 'Terbatas';
    return 'Tersedia';
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
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
              </div>
              <Link
                href="/admin/products/create"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Produk</span>
              </Link>
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
                    <option value="fashion">Fashion</option>
                    <option value="shoes">Shoes</option>
                    <option value="elektronik">Elektronik</option>
                    <option value="aksesoris">Aksesoris</option>
                    <option value="olahraga">Olahraga</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-100">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Eye className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Status Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isHot && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">HOT</span>
                        )}
                        {product.featured && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Featured</span>
                        )}
                        {product.isNew && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">New</span>
                        )}
                      </div>
                      
                      {/* Stock Status */}
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product)}`}>
                          {getStatusText(product)}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <p className="text-lg font-bold text-blue-600">
                            Rp {product.price.toLocaleString('id-ID')}
                          </p>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <p className="text-sm text-gray-400 line-through">
                              Rp {product.originalPrice.toLocaleString('id-ID')}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Stok: {product.stock ?? (product.inStock ? 100 : 0)}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-400 text-sm">★</span>
                            <span className="text-sm text-gray-600">{product.rating ?? 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-4">
                        <Link
                          href={`/product/${product.slug || product.id}`}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                        >
                          <Eye className="w-3 h-3" />
                          Lihat
                        </Link>
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">Get started by adding a new product</p>
                  <Link
                    href="/admin/products/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Produk
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
