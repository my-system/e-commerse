"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '@/data/products';
import { categories } from '@/data/categories';
import { ArrowLeft, Plus, X, Upload, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function AddProductPage() {
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
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Nama produk minimal 3 karakter';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Harga harus lebih dari 0';
    } else if (parseFloat(formData.price) > 1000000000) {
      newErrors.price = 'Harga maksimal Rp 1.000.000.000';
    }

    if (!formData.category) {
      newErrors.category = 'Kategori wajib dipilih';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'Minimal 1 gambar wajib diupload';
    } else if (formData.images.length > 10) {
      newErrors.images = 'Maksimal 10 gambar';
    }

    // Validate variants if they exist
    if (formData.sizes.length > 0) {
      const invalidSizes = formData.sizes.filter(size => !size.name.trim() || !size.value.trim());
      if (invalidSizes.length > 0) {
        newErrors.sizes = 'Semua ukuran harus memiliki nama dan value';
      }
    }

    if (formData.colors.length > 0) {
      const invalidColors = formData.colors.filter(color => !color.name.trim());
      if (invalidColors.length > 0) {
        newErrors.colors = 'Semua warna harus memiliki nama';
      }
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

  // Price formatting handler
  const handlePriceChange = (value: string) => {
    // Remove all non-digit characters
    const cleanValue = value.replace(/\D/g, '');
    
    // Convert to number and format with dots
    const numberValue = parseInt(cleanValue) || 0;
    const formattedValue = numberValue.toLocaleString('id-ID');
    
    // Update form data with clean number value but display formatted
    setFormData(prev => ({ ...prev, price: cleanValue }));
    
    // Clear error when user starts typing
    if (errors.price) {
      setErrors(prev => ({ ...prev, price: '' }));
    }
  };

  // Get formatted price for display
  const getFormattedPrice = (price: string) => {
    const cleanValue = price.replace(/\D/g, '');
    const numberValue = parseInt(cleanValue) || 0;
    return numberValue.toLocaleString('id-ID');
  };

  const handleImageAdd = async () => {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;
    
    fileInput.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        try {
          // Upload to server
          const formData = new FormData();
          Array.from(files).forEach(file => {
            formData.append('files', file);
          });

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();

          if (!result.success) {
            throw new Error(result.error || 'Upload failed');
          }

          // Add uploaded image URLs to form
          setFormData(prev => ({ ...prev, images: [...prev.images, ...result.data] }));
          
        } catch (error) {
          console.error('Upload error:', error);
          alert(`Gagal upload gambar: ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`);
          
          // Fallback to blob URLs for preview
          const newImages = Array.from(files).map(file => URL.createObjectURL(file));
          handleInputChange('images', [...formData.images, ...newImages]);
        }
      }
    };
    
    fileInput.click();
  };

  const handleImageRemove = (index: number) => {
    const imageToRemove = formData.images[index];
  
    // Revoke blob URL to prevent memory leaks
    if (imageToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove);
    }
  
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
    
    // Auto-generate value if name is provided and value is empty
    if (field === 'name' && value && !newSizes[index].value) {
      const commonSizes: Record<string, string> = {
        'small': 'S',
        'medium': 'M', 
        'large': 'L',
        'extra large': 'XL',
        'xxl': 'XXL'
      };
      const lowerName = value.toLowerCase();
      if (commonSizes[lowerName]) {
        newSizes[index].value = commonSizes[lowerName];
      } else {
        // Use first letter or first 2 letters as value
        newSizes[index].value = value.length > 2 ? value.substring(0, 2).toUpperCase() : value.toUpperCase();
      }
    }
    
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
    
    // Auto-generate common color names if hex is provided and name is empty
    if (field === 'value' && value && !newColors[index].name) {
      const commonColors: Record<string, string> = {
        '#000000': 'Hitam',
        '#FFFFFF': 'Putih', 
        '#FF0000': 'Merah',
        '#00FF00': 'Hijau',
        '#0000FF': 'Biru',
        '#FFFF00': 'Kuning',
        '#FF00FF': 'Magenta',
        '#00FFFF': 'Cyan',
        '#808080': 'Abu-abu',
        '#FFA500': 'Oranye'
      };
      const upperValue = value.toUpperCase();
      if (commonColors[upperValue]) {
        newColors[index].name = commonColors[upperValue];
      }
    }
    
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
    
    // Remove specification if value is empty
    if (value.trim() === '') {
      delete newSpecs[key];
    } else {
      // Update or add specification
      // If key starts with 'spec-', it's a new spec, use the input value as key
      if (key.startsWith('spec-')) {
        // Find the actual key from the input
        const specInputs = document.querySelectorAll('input[placeholder="Label spesifikasi"]');
        const index = Array.from(specInputs).findIndex(input => {
          const parent = input.closest('div');
          return parent?.querySelector(`input[value="${key.replace('spec-', '')}"]`);
        });
        
        if (index !== -1) {
          const actualKey = specInputs[index].getAttribute('value') || key.replace('spec-', '');
          delete newSpecs[key];
          newSpecs[actualKey] = value;
        }
      } else {
        newSpecs[key] = value;
      }
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
      // Convert blob URLs to base64 for storage
      const processedImages = await Promise.all(
        formData.images.map(async (image) => {
          // If it's a blob URL, convert to base64
          if (image.startsWith('blob:')) {
            const response = await fetch(image);
            const blob = await response.blob();
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          }
          // If it's already a regular URL, keep as is
          return image;
        })
      );

      // Create new product object
      const newProduct = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        images: processedImages,
        category: formData.category,
        description: formData.description.trim() || undefined,
        featured: formData.featured,
        variants: {
          sizes: formData.sizes.length > 0 ? formData.sizes : undefined,
          colors: formData.colors.length > 0 ? formData.colors : undefined,
        },
        specifications: Object.keys(formData.specifications).length > 0 ? formData.specifications : undefined,
        material: formData.material.trim() || undefined,
        care: formData.care.trim() || undefined,
        inStock: true,
        rating: 0,
        reviews: 0
      };

      // Save to API (real backend)
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
      alert('Produk berhasil ditambahkan!');
      router.push('/admin/products');
      
    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Gagal menambahkan produk: ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link 
            href="/admin/products"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tambah Produk Baru</h1>
            <p className="text-gray-600 mt-1">Tambahkan produk baru ke marketplace</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded"></span>
              Informasi Dasar
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Produk <span className="text-red-500 font-bold">WAJIB</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama produk"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga (Rp) <span className="text-red-500 font-bold">WAJIB</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={getFormattedPrice(formData.price)}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500 font-bold">WAJIB</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Produk
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Deskripsikan produk Anda..."
                />
              </div>

              {/* Featured */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Tampilkan sebagai produk unggulan
                  </span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded"></span>
              Gambar Produk <span className="text-red-500 font-bold">WAJIB</span>
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleImageAdd}
                  className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Tambah Gambar</span>
                </button>
              </div>
              
              {errors.images && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.images}
                </p>
              )}
            </div>
          </motion.div>

          {/* Variants */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
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
          </motion.div>

          {/* Specifications */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
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
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-end gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/admin/products"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
              </button>
            </motion.div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
