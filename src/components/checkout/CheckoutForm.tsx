"use client";

import { useState } from 'react';
import ShippingOptions from './ShippingOptions';
import PaymentMethod from './PaymentMethod';

interface CheckoutFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  shippingMethod: string;
  paymentMethod: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  shippingMethod?: string;
  paymentMethod?: string;
}

export default function CheckoutForm({ isSubmitting, setIsSubmitting }: CheckoutFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    shippingMethod: 'regular',
    paymentMethod: 'transfer',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validasi Nama Lengkap
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    }

    // Validasi Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Validasi Nomor HP
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor HP wajib diisi';
    } else if (!/^[0-9]+$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Nomor HP hanya boleh angka';
    }

    // Validasi Alamat
    if (!formData.address.trim()) {
      newErrors.address = 'Alamat wajib diisi';
    }

    // Validasi Kota
    if (!formData.city.trim()) {
      newErrors.city = 'Kota wajib diisi';
    }

    // Validasi Provinsi
    if (!formData.province.trim()) {
      newErrors.province = 'Provinsi wajib diisi';
    }

    // Validasi Kode Pos
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Kode pos wajib diisi';
    } else if (!/^[0-9]+$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Kode pos hanya boleh angka';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-format phone number
    let formattedValue = value;
    if (name === 'phone') {
      // Remove non-numeric characters
      formattedValue = value.replace(/[^0-9]/g, '');
      // Add formatting if needed
      if (formattedValue.startsWith('0')) {
        formattedValue = formattedValue;
      }
    }
    
    // Auto-format postal code (max 5 digits)
    if (name === 'postalCode') {
      formattedValue = value.replace(/[^0-9]/g, '').slice(0, 5);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error field
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulasi API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulasi sukses
      alert('✅ Pesanan berhasil dibuat! Terima kasih telah berbelanja.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        shippingMethod: 'regular',
        paymentMethod: 'transfer',
      });
      
      // Clear cart (optional - redirect ke success page)
      // window.location.href = '/order-success';
      
    } catch (error) {
      alert('❌ Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Informasi Pengiriman
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nama Lengkap */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
            disabled={isSubmitting}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john.doe@example.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Nomor HP */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Nomor HP <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="08123456789"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Alamat Lengkap */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Alamat Lengkap <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Jl. Contoh No. 123, RT/RW 001/002"
            disabled={isSubmitting}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* Kota dan Provinsi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              Kota <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Jakarta"
              disabled={isSubmitting}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
              Provinsi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="province"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.province ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="DKI Jakarta"
              disabled={isSubmitting}
            />
            {errors.province && (
              <p className="mt-1 text-sm text-red-600">{errors.province}</p>
            )}
          </div>
        </div>

        {/* Kode Pos */}
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
            Kode Pos <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.postalCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="12345"
            disabled={isSubmitting}
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
          )}
        </div>

        {/* Shipping Options */}
        <ShippingOptions
          selectedMethod={formData.shippingMethod}
          onMethodChange={(method: string) => setFormData(prev => ({ ...prev, shippingMethod: method }))}
          error={errors.shippingMethod}
        />

        {/* Payment Method */}
        <PaymentMethod
          selectedMethod={formData.paymentMethod}
          onMethodChange={(method: string) => setFormData(prev => ({ ...prev, paymentMethod: method }))}
          error={errors.paymentMethod}
        />

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-blue-600 text-white font-semibold text-base rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl min-h-[52px] flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Memproses pesanan...</span>
              </div>
            ) : (
              <span className="flex items-center gap-2">
                <span>Place Order</span>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
