"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import ShippingOptions from './ShippingOptions';
import PaymentMethod from './PaymentMethod';
import { MapPin, Phone, Mail, X, Check } from 'lucide-react';

interface CheckoutFormProps {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  shippingMethod?: string;
  onShippingMethodChange?: (method: string) => void;
  hasInsurance?: boolean;
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

export default function CheckoutForm({ isSubmitting, setIsSubmitting, shippingMethod = 'regular', onShippingMethodChange, hasInsurance = false }: CheckoutFormProps) {
  const { user } = useAuth();
  const { state: cartState } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    shippingMethod: shippingMethod,
    paymentMethod: 'transfer',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  // Fetch user addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (user?.id) {
          const response = await fetch(`/api/user/addresses?userId=${user.id}`);
          const data = await response.json();
          if (data.success) {
            setAddresses(data.addresses);
            
            // Auto-fill form with main address if available
            const mainAddress = data.addresses.find((addr: any) => addr.isDefault);
            if (mainAddress) {
              setFormData(prev => ({
                ...prev,
                fullName: mainAddress.fullName,
                phone: mainAddress.phoneNumber,
                address: mainAddress.address,
                city: mainAddress.city,
                province: mainAddress.province,
                postalCode: mainAddress.postalCode,
                email: user.email || ''
              }));
            } else if (data.addresses.length > 0) {
              // Use first address if no default
              const firstAddress = data.addresses[0];
              setFormData(prev => ({
                ...prev,
                fullName: firstAddress.fullName,
                phone: firstAddress.phoneNumber,
                address: firstAddress.address,
                city: firstAddress.city,
                province: firstAddress.province,
                postalCode: firstAddress.postalCode,
                email: user.email || ''
              }));
            } else {
              // Fill email from user if no addresses
              setFormData(prev => ({
                ...prev,
                email: user.email || ''
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleAddressSelect = (address: any) => {
    setFormData(prev => ({
      ...prev,
      fullName: address.fullName,
      phone: address.phoneNumber,
      address: address.address,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
    }));
    setShowAddressModal(false);
  };

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

    // Validasi Metode Pengiriman
    if (!formData.shippingMethod) {
      newErrors.shippingMethod = 'Metode pengiriman wajib dipilih';
    }

    // Validasi Metode Pembayaran
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Metode pembayaran wajib dipilih';
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

    try {
      // Calculate costs
      const shippingCosts: { [key: string]: number } = {
        regular: 20000,
        express: 40000,
        free: 0
      };
      const shippingCost = shippingCosts[shippingMethod] || 20000;
      const subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = Math.round(subtotal * 0.11);
      const insuranceCost = hasInsurance ? 5000 : 0;
      const total = subtotal + shippingCost + insuranceCost + tax;

      // Call order API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          shippingMethod: shippingMethod,
          paymentMethod: formData.paymentMethod,
          items: cartState.items.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingCost,
          insuranceCost,
          tax,
          total
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to success page
        router.push(`/checkout/success/${data.order.id}`);
      } else {
        alert('Gagal membuat pesanan: ' + (data.error || 'Terjadi kesalahan'));
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat memproses pesanan: ' + (error.message || 'Silakan coba lagi.'));
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
        {/* Address Summary Display */}
        {isLoadingAddresses ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : formData.fullName ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Alamat Pengiriman</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Pilih Alamat Lain
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="font-medium">{formData.fullName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{formData.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{formData.email}</span>
              </div>
              <div className="text-sm text-gray-600">
                {formData.address}
              </div>
              <div className="text-sm text-gray-600">
                {formData.city}, {formData.province} {formData.postalCode}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>Belum ada alamat tersimpan</span>
            </div>
            <button
              type="button"
              onClick={() => window.location.href = '/user/profile'}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Tambah Alamat di Profil
            </button>
          </div>
        )}

        {/* Hidden inputs for form submission */}
        <input type="hidden" name="fullName" value={formData.fullName} />
        <input type="hidden" name="email" value={formData.email} />
        <input type="hidden" name="phone" value={formData.phone} />
        <input type="hidden" name="address" value={formData.address} />
        <input type="hidden" name="city" value={formData.city} />
        <input type="hidden" name="province" value={formData.province} />
        <input type="hidden" name="postalCode" value={formData.postalCode} />

        {/* Shipping Options */}
        <ShippingOptions
          selectedMethod={shippingMethod}
          onMethodChange={onShippingMethodChange || ((method: string) => setFormData(prev => ({ ...prev, shippingMethod: method })))}
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

      {/* Address Selector Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Pilih Alamat Pengiriman</h2>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Belum ada alamat tersimpan</p>
                  <button
                    onClick={() => {
                      setShowAddressModal(false);
                      window.location.href = '/user/profile';
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tambah Alamat
                  </button>
                </div>
              ) : (
                addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => handleAddressSelect(address)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      formData.fullName === address.fullName &&
                      formData.phone === address.phoneNumber &&
                      formData.address === address.address
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-gray-900">{address.fullName}</h3>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">Utama</span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{address.phoneNumber}</span>
                          </div>
                          <p>{address.address}</p>
                          <p>{address.city}, {address.province} {address.postalCode}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.fullName === address.fullName &&
                         formData.phone === address.phoneNumber &&
                         formData.address === address.address && (
                          <div className="p-2 bg-blue-600 text-white rounded-full">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddressModal(false);
                  window.location.href = '/user/profile';
                }}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Tambah Alamat Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
