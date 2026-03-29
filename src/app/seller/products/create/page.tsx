"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '@/data/products';
import { categories } from '@/data/categories';
import { ArrowLeft, Plus, X, Upload, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  // Basic Info
  title: string;
  price: string;
  category: string;
  description: string;
  featured: boolean;
  
  // Images
  images: string[];
  
  // Variants
  sizes: ProductVariant[];
  colors: ProductVariant[];
  
  // Specifications
  material: string;
  care: string;
  specifications: Record<string, string>;
}

const initialFormData: FormData = {
  title: '',
  price: '',
  category: '',
  description: '',
  featured: false,
  images: [],
  sizes: [],
  colors: [],
  material: '',
  care: '',
  specifications: {}
};

export default function SellerAddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Nama produk wajib diisi';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Harga harus lebih dari 0';
    }
    if (!formData.category) {
      newErrors.category = 'Kategori wajib dipilih';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'Minimal 1 gambar wajib diupload';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form handlers
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageAdd = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    
    fileInput.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        try {
          const uploadFormData = new FormData();
          Array.from(files).forEach(file => {
            uploadFormData.append('files', file);
          });

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          const result = await response.json();

          if (!result.success) {
            throw new Error(result.error || 'Upload failed');
          }

          handleInputChange('images', [...formData.images, ...result.data]);
          
        } catch (error) {
          console.error('Upload error:', error);
          alert(`Gagal upload gambar: ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`);
          
          // Fallback to blob URLs if upload fails
          const newImages = Array.from(files).map(file => URL.createObjectURL(file));
          handleInputChange('images', [...formData.images, ...newImages]);
        }
      }
    };
    
    fileInput.click();
  };

  const handleImageRemove = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    handleInputChange('images', newImages);
  };

  const handleSizeAdd = () => {
    const newSize: ProductVariant = {
      id: `size-${Date.now()}`,
      name: '',
      value: '',
      inStock: true
    };
    handleInputChange('sizes', [...formData.sizes, newSize]);
  };

  const handleSizeChange = (index: number, field: keyof ProductVariant, value: any) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    handleInputChange('sizes', newSizes);
  };

  const handleSizeRemove = (index: number) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    handleInputChange('sizes', newSizes);
  };

  const handleColorAdd = () => {
    const newColor: ProductVariant = {
      id: `color-${Date.now()}`,
      name: '',
      value: '#000000',
      inStock: true
    };
    handleInputChange('colors', [...formData.colors, newColor]);
  };

  const handleColorChange = (index: number, field: keyof ProductVariant, value: any) => {
    const newColors = [...formData.colors];
    newColors[index] = { ...newColors[index], [field]: value };
    handleInputChange('colors', newColors);
  };

  const handleColorRemove = (index: number) => {
    const newColors = formData.colors.filter((_, i) => i !== index);
    handleInputChange('colors', newColors);
  };

  const handleSpecAdd = () => {
    const newSpecs = { ...formData.specifications };
    const newKey = `spec-${Date.now()}`;
    newSpecs[newKey] = '';
    handleInputChange('specifications', newSpecs);
  };

  const handleSpecChange = (key: string, value: string) => {
    const newSpecs = { ...formData.specifications };
    if (value === '') {
      delete newSpecs[key];
    } else {
      newSpecs[key] = value;
    }
    handleInputChange('specifications', newSpecs);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Process images (convert blob URLs to base64 if needed)
      const processedImages = await Promise.all(
        formData.images.map(async (image) => {
          if (image.startsWith('blob:')) {
            const response = await fetch(image);
            const blob = await response.blob();
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          }
          return image;
        })
      );

      // Create new product object with status
      const newProduct = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        images: processedImages,
        category: formData.category,
        description: formData.description.trim() || undefined,
        featured: formData.featured,
        inStock: true,
        rating: 0,
        reviews: 0,
        material: formData.material.trim() || undefined,
        care: formData.care.trim() || undefined,
        sizes: formData.sizes.length > 0 ? formData.sizes : undefined,
        colors: formData.colors.length > 0 ? formData.colors : undefined,
        specifications: Object.keys(formData.specifications).length > 0 ? formData.specifications : undefined,
        status: 'pending' // Auto set status to pending for seller products
      };

      // Send to API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create product');
      }

      // Show success message and redirect
      alert('Produk berhasil ditambahkan! Status: Pending Review. Admin akan segera meninjau produk Anda.');
      router.push('/seller/products');
      
    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Gagal menambahkan produk: ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/seller/products"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tambah Produk Baru</h1>
                <p className="text-gray-600 mt-1">Upload produk Anda ke marketplace dengan status pending review</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              Status: Pending Review
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Progress Steps */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              {['Informasi Dasar', 'Gambar Produk', 'Detail Produk', 'Spesifikasi'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    index === 0 ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                  {index < 3 && (
                    <div className="w-12 h-0.5 bg-gray-200 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Informasi Dasar</h2>
                <p className="text-gray-600 text-sm">Informasi utama tentang produk Anda</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.title ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                    placeholder="Contoh: Kaos Premium Original 100% Cotton"
                  />
                  {errors.title && (
                    <div className="absolute right-3 top-3.5 text-red-500">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-gray-500 font-medium">Rp</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.price ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.price && (
                    <div className="absolute right-3 top-3.5 text-red-500">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
                {errors.price && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white ${
                      errors.category ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Pilih kategori produk</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {errors.category && (
                    <div className="absolute right-10 top-3.5 text-red-500">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi Produk
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Jelaskan detail produk, bahan, ukuran, fitur, dll..."
                />
                <p className="mt-1 text-xs text-gray-500">Deskripsi yang baik membantu pembelian lebih cepat</p>
              </div>

              {/* Featured */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      Tampilkan sebagai produk unggulan
                    </span>
                    <p className="text-xs text-gray-600">Produk unggulan muncul di halaman utama</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Gambar Produk</h2>
                <p className="text-gray-600 text-sm">Upload gambar berkualitas tinggi (JPEG, PNG, WebP)</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      Gambar {index + 1}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleImageAdd}
                  className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Tambah Gambar</span>
                  <span className="text-xs text-gray-500">Max 5MB</span>
                </button>
              </div>
              
              {errors.images && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-600">{errors.images}</p>
                </div>
              )}
              
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-blue-700">
                  <strong>Tip:</strong> Gunakan gambar dengan resolusi minimal 800x800px untuk hasil terbaik
                </p>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded"></span>
              Variasi Produk
            </h2>
            
            <div className="space-y-6">
              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Ukuran</h3>
                  <button
                    type="button"
                    onClick={handleSizeAdd}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Ukuran
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.sizes.map((size, index) => (
                    <div key={size.id} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={size.name}
                        onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                        placeholder="Nama ukuran (cont: Small)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={size.value}
                        onChange={(e) => handleSizeChange(index, 'value', e.target.value)}
                        placeholder="Value (cont: S)"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={size.inStock}
                          onChange={(e) => handleSizeChange(index, 'inStock', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Tersedia</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleSizeRemove(index)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Warna</h3>
                  <button
                    type="button"
                    onClick={handleColorAdd}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Warna
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.colors.map((color, index) => (
                    <div key={color.id} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                        placeholder="Nama warna (cont: Hitam)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="color"
                        value={color.value}
                        onChange={(e) => handleColorChange(index, 'value', e.target.value)}
                        className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={color.inStock}
                          onChange={(e) => handleColorChange(index, 'inStock', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Tersedia</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleColorRemove(index)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded"></span>
              Spesifikasi Tambahan
            </h2>
            
            <div className="space-y-6">
              {/* Material */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="cont: 100% Cotton"
                />
              </div>

              {/* Care Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Petunjuk Perawatan
                </label>
                <textarea
                  value={formData.care}
                  onChange={(e) => handleInputChange('care', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="cont: Machine wash cold, tumble dry low"
                />
              </div>

              {/* Custom Specifications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Spesifikasi Kustom</h3>
                  <button
                    type="button"
                    onClick={handleSpecAdd}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Spesifikasi
                  </button>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={key.replace('spec-', '')}
                        onChange={(e) => {
                          const newSpecs = { ...formData.specifications };
                          delete newSpecs[key];
                          newSpecs[e.target.value] = value;
                          handleInputChange('specifications', newSpecs);
                        }}
                        placeholder="Label spesifikasi"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleSpecChange(key, e.target.value)}
                        placeholder="Nilai spesifikasi"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleSpecChange(key, '')}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/seller/products"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
