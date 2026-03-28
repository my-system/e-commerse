"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Upload, Eye, Save, ArrowLeft } from 'lucide-react';
import { categories } from '@/data/categories';
import { products } from '@/data/products';

// Type definitions
interface Size {
  name: string;
  available: boolean;
}

interface Product {
  title: string;
  category: string;
  price: number;
  description: string;
  fullDescription: string;
  images: string[];
  sizes: Size[];
  colors: string[];
  material: string;
  fit: string;
  neckline: string;
  sleeve: string;
  care: string;
  rating: number;
  stock: number;
  featured: boolean;
  isHot: boolean;
}

const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
const availableColors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#888888' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Yellow', hex: '#F59E0B' },
  { name: 'Purple', hex: '#8B5CF6' },
];

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [product, setProduct] = useState<Product>({
    title: '',
    category: '',
    price: 0,
    description: '',
    fullDescription: '',
    images: [],
    sizes: [],
    colors: [],
    material: '',
    fit: '',
    neckline: '',
    sleeve: '',
    care: '',
    rating: 4.5,
    stock: 0,
    featured: false,
    isHot: false,
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setProduct(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }));
        setImagePreviews(prev => [...prev, imageUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Toggle size availability
  const toggleSize = (sizeName: string) => {
    setProduct(prev => {
      const existingSize = prev.sizes.find(s => s.name === sizeName);
      if (existingSize) {
        return {
          ...prev,
          sizes: prev.sizes.filter(s => s.name !== sizeName)
        };
      } else {
        return {
          ...prev,
          sizes: [...prev.sizes, { name: sizeName, available: true }]
        };
      }
    });
  };

  // Toggle size stock
  const toggleSizeStock = (sizeName: string) => {
    setProduct(prev => ({
      ...prev,
      sizes: prev.sizes.map(s => 
        s.name === sizeName ? { ...s, available: !s.available } : s
      )
    }));
  };

  // Toggle color selection
  const toggleColor = (colorHex: string) => {
    setProduct(prev => {
      if (prev.colors.includes(colorHex)) {
        return {
          ...prev,
          colors: prev.colors.filter(c => c !== colorHex)
        };
      } else {
        return {
          ...prev,
          colors: [...prev.colors, colorHex]
        };
      }
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!product.title.trim()) {
      newErrors.title = 'Nama produk wajib diisi';
    }

    if (!product.category) {
      newErrors.category = 'Kategori wajib dipilih';
    }

    if (product.price <= 0) {
      newErrors.price = 'Harga harus lebih dari 0';
    }

    if (product.images.length === 0) {
      newErrors.images = 'Minimal 1 gambar produk';
    }

    if (!product.description.trim()) {
      newErrors.description = 'Deskripsi singkat wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Submit product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new product object
      const newProduct = {
        id: generateId(),
        slug: generateSlug(product.title),
        title: product.title,
        category: product.category,
        price: product.price,
        originalPrice: product.price, // No discount initially
        description: product.description,
        fullDescription: product.fullDescription,
        images: product.images,
        sizes: product.sizes,
        colors: product.colors,
        material: product.material,
        fit: product.fit,
        neckline: product.neckline,
        sleeve: product.sleeve,
        care: product.care,
        rating: product.rating,
        reviews: 0, // New product has no reviews
        stock: product.stock,
        featured: product.featured,
        isHot: product.isHot,
        isNew: true, // New products are marked as new
      };

      // Get existing products from localStorage or use initial products
      const existingProducts = JSON.parse(localStorage.getItem('products') || JSON.stringify(products));
      
      // Add new product
      const updatedProducts = [...existingProducts, newProduct];
      
      // Save to localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      // Show success message
      alert('Produk berhasil ditambahkan!');
      
      // Redirect to admin products list
      router.push('/admin/products');
      
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Terjadi kesalahan saat menyimpan produk');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                Tambah Produk Baru
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    value={product.title}
                    onChange={(e) => setProduct(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan nama produk"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={product.category}
                    onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-sm">Rp</span>
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => setProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stok
                  </label>
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) => setProduct(prev => ({ ...prev, stock: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating Default
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={product.rating}
                    onChange={(e) => setProduct(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Status Checkboxes */}
              <div className="mt-4 flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={product.featured}
                    onChange={(e) => setProduct(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={product.isHot}
                    onChange={(e) => setProduct(prev => ({ ...prev, isHot: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">HOT Badge</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Deskripsi Produk</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Singkat *
                  </label>
                  <textarea
                    value={product.description}
                    onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Deskripsi singkat produk (muncul di halaman listing)"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Lengkap
                  </label>
                  <textarea
                    value={product.fullDescription}
                    onChange={(e) => setProduct(prev => ({ ...prev, fullDescription: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Deskripsi lengkap produk (muncul di halaman detail)"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Gambar Produk</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Gambar *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Klik untuk upload atau drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF (MAX. 2MB per gambar)
                      </p>
                    </label>
                  </div>
                  {errors.images && (
                    <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                  )}
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview Gambar
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Varian Produk</h2>
              <div className="space-y-6">
                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ukuran
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                      const isSelected = product.sizes.some(s => s.name === size);
                      const sizeData = product.sizes.find(s => s.name === size);
                      const isAvailable = sizeData?.available ?? false;
                      
                      return (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            isSelected
                              ? isAvailable
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-300 bg-gray-50 text-gray-400 line-through'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {product.sizes.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      Klik ukuran yang sudah dipilih untuk toggle ketersediaan stok
                    </div>
                  )}
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warna
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color) => {
                      const isSelected = product.colors.includes(color.hex);
                      return (
                        <button
                          key={color.hex}
                          onClick={() => toggleColor(color.hex)}
                          className={`relative p-1 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-blue-500 shadow-sm'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          title={color.name}
                        >
                          <div
                            className="w-8 h-8 rounded"
                            style={{ backgroundColor: color.hex }}
                          />
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                              <Plus className="h-2 w-2" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detail Produk</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <input
                    type="text"
                    value={product.material}
                    onChange={(e) => setProduct(prev => ({ ...prev, material: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Katun, Polyester"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fit
                  </label>
                  <input
                    type="text"
                    value={product.fit}
                    onChange={(e) => setProduct(prev => ({ ...prev, fit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Slim Fit, Regular Fit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Neckline
                  </label>
                  <input
                    type="text"
                    value={product.neckline}
                    onChange={(e) => setProduct(prev => ({ ...prev, neckline: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: V-Neck, Round Neck"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sleeve
                  </label>
                  <input
                    type="text"
                    value={product.sleeve}
                    onChange={(e) => setProduct(prev => ({ ...prev, sleeve: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Short Sleeve, Long Sleeve"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Care Instructions
                  </label>
                  <textarea
                    value={product.care}
                    onChange={(e) => setProduct(prev => ({ ...prev, care: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Machine wash cold, Tumble dry low"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            {showPreview && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Produk</h3>
                <div className="space-y-4">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {product.title || 'Nama Produk'}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {categories.find(c => c.slug === product.category)?.name || 'Kategori'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-blue-600">
                        {product.price > 0 ? `Rp ${product.price.toLocaleString('id-ID')}` : 'Rp 0'}
                      </span>
                      {product.isHot && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">HOT</span>
                      )}
                      {product.featured && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Featured</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">
                      {product.description || 'Deskripsi singkat produk...'}
                    </p>
                  </div>

                  {product.sizes.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Ukuran:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((size) => (
                          <span
                            key={size.name}
                            className={`px-2 py-1 text-xs rounded ${
                              size.available
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-gray-50 text-gray-400 line-through'
                            }`}
                          >
                            {size.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.colors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Warna:</p>
                      <div className="flex gap-1">
                        {product.colors.map((color) => (
                          <div
                            key={color}
                            className="w-4 h-4 rounded border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
