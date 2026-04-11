"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Phone, Mail, X, Check } from 'lucide-react';

interface CheckoutAddressSectionProps {
  onAddressSelect?: (address: any) => void;
}

export default function CheckoutAddressSection({ onAddressSelect }: CheckoutAddressSectionProps) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        if (user?.id) {
          const response = await fetch(`/api/user/addresses?userId=${user.id}`);
          const data = await response.json();
          if (data.success) {
            setAddresses(data.addresses);
            const mainAddress = data.addresses.find((addr: any) => addr.isDefault);
            const initialAddress = mainAddress || data.addresses[0] || null;
            setSelectedAddress(initialAddress);
            // Notify parent component of the initially selected address
            if (initialAddress) {
              onAddressSelect?.(initialAddress);
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
  }, [user, onAddressSelect]);

  const handleAddressSelect = (address: any) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
    onAddressSelect?.(address);
  };

  if (isLoadingAddresses) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!selectedAddress) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span>Belum ada alamat tersimpan</span>
        </div>
        <button
          onClick={() => window.location.href = '/user/profile'}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Tambah Alamat di Profil
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={`border-2 rounded-lg p-4 ${selectedAddress ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Alamat Pengiriman</h3>
          </div>
          <button
            onClick={() => setShowAddressModal(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Pilih Alamat Lain
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-medium">{selectedAddress.fullName}</span>
            {selectedAddress.isDefault && (
              <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">Utama</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{selectedAddress.phoneNumber}</span>
          </div>
          <div className="text-sm text-gray-600">
            {selectedAddress.address}
          </div>
          <div className="text-sm text-gray-600">
            {selectedAddress.city}, {selectedAddress.province} {selectedAddress.postalCode}
          </div>
        </div>
      </div>

      {/* Address Selector Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
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
                      selectedAddress?.id === address.id
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
                        {selectedAddress?.id === address.id && (
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
