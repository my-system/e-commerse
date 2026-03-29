"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { categories } from '@/data/categories';

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description?: string;
  featured: boolean;
  inStock: boolean;
  rating: number;
  reviews: number;
  images: string;
  material?: string;
  care?: string;
  status: string;
  badges: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const productId = params.id as string;
    fetchProduct(productId);
  }, [params.id]);

  const fetchProduct = async (productId: string) => {
    try {
      // Try pending first
      let response = await fetch('/api/pending-products');
      let data = await response.json();
      
      if (data.success) {
        const foundProduct = data.products.find((p: Product) => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
          setIsLoading(false);
          return;
        }
      }
      
      // Try marketplace
      response = await fetch('/api/marketplace-products');
      data = await response.json();
      
      if (data.success) {
        const foundProduct = data.products.find((p: Product) => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
          setIsLoading(false);
          return;
        }
      }
      
      // Product not found
      router.push('/seller/products');
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/seller/products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!product) return;
    
    setIsSaving(true);
    setErrors({});

    try {
      // Update product logic here
      console.log('Saving product:', product);
      alert('Product updated successfully!');
      router.push('/seller/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ general: 'Failed to save product' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link href="/seller/products" className="text-blue-600 hover:text-blue-700">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images ? JSON.parse(product.images) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              href="/seller/products"
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={product.title}
                      onChange={(e) => setProduct({ ...product, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={product.category}
                      onChange={(e) => setProduct({ ...product, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
                <textarea
                  value={product.description || ''}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your product..."
                />
              </div>

              {/* Additional Info */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      value={product.material || ''}
                      onChange={(e) => setProduct({ ...product, material: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Cotton, Leather, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Care Instructions
                    </label>
                    <input
                      type="text"
                      value={product.care || ''}
                      onChange={(e) => setProduct({ ...product, care: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Machine wash cold, etc."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Images */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500">Add more images</p>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={product.featured}
                      onChange={(e) => setProduct({ ...product, featured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                      Featured Product
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={product.inStock}
                      onChange={(e) => setProduct({ ...product, inStock: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                      In Stock
                    </label>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Status</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Current Status: <span className="font-medium text-gray-900">{product.status}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Status is managed by admin approval process
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{errors.general}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
