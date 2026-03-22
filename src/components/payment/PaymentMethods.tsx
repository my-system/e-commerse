"use client";

import { useState } from 'react';
import { CreditCard, Smartphone, Building2, Truck, Shield, Check, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'ewallet' | 'bank' | 'cod';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  fee?: number;
  feeType?: 'fixed' | 'percentage';
  processingTime?: string;
  popular?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

interface PaymentMethodsProps {
  selectedPayment: string | null;
  onPaymentSelect: (paymentId: string) => void;
  totalAmount: number;
  className?: string;
}

export default function PaymentMethods({ 
  selectedPayment, 
  onPaymentSelect, 
  totalAmount,
  className = "" 
}: PaymentMethodsProps) {
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  const paymentMethods: PaymentMethod[] = [
    // Credit Cards
    {
      id: 'visa',
      name: 'Visa',
      type: 'card',
      icon: CreditCard,
      description: 'Pembayaran dengan kartu kredit Visa',
      fee: 2.5,
      feeType: 'percentage',
      processingTime: 'Segera',
      popular: true,
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      type: 'card',
      icon: CreditCard,
      description: 'Pembayaran dengan kartu kredit Mastercard',
      fee: 2.5,
      feeType: 'percentage',
      processingTime: 'Segera',
    },
    {
      id: 'cicilan',
      name: 'Cicilan 0%',
      type: 'card',
      icon: CreditCard,
      description: 'Cicilan 0% hingga 12 bulan (minimum Rp 500.000)',
      fee: 0,
      feeType: 'fixed',
      processingTime: 'Segera',
      popular: true,
    },
    
    // E-Wallets
    {
      id: 'gopay',
      name: 'GoPay',
      type: 'ewallet',
      icon: Smartphone,
      description: 'Pembayaran dengan GoPay',
      fee: 0,
      feeType: 'fixed',
      processingTime: 'Segera',
      popular: true,
    },
    {
      id: 'ovo',
      name: 'OVO',
      type: 'ewallet',
      icon: Smartphone,
      description: 'Pembayaran dengan OVO',
      fee: 0,
      feeType: 'fixed',
      processingTime: 'Segera',
    },
    {
      id: 'dana',
      name: 'DANA',
      type: 'ewallet',
      icon: Smartphone,
      description: 'Pembayaran dengan DANA',
      fee: 0,
      feeType: 'fixed',
      processingTime: 'Segera',
    },
    {
      id: 'shopeepay',
      name: 'ShopeePay',
      type: 'ewallet',
      icon: Smartphone,
      description: 'Pembayaran dengan ShopeePay',
      fee: 0,
      feeType: 'fixed',
      processingTime: 'Segera',
    },
    
    // Bank Transfers
    {
      id: 'bca',
      name: 'BCA Virtual Account',
      type: 'bank',
      icon: Building2,
      description: 'Transfer ke Virtual Account BCA',
      fee: 1500,
      feeType: 'fixed',
      processingTime: '1-2 menit',
    },
    {
      id: 'mandiri',
      name: 'Mandiri Virtual Account',
      type: 'bank',
      icon: Building2,
      description: 'Transfer ke Virtual Account Mandiri',
      fee: 1500,
      feeType: 'fixed',
      processingTime: '1-2 menit',
    },
    {
      id: 'bni',
      name: 'BNI Virtual Account',
      type: 'bank',
      icon: Building2,
      description: 'Transfer ke Virtual Account BNI',
      fee: 1500,
      feeType: 'fixed',
      processingTime: '1-2 menit',
    },
    {
      id: 'bri',
      name: 'BRI Virtual Account',
      type: 'bank',
      icon: Building2,
      description: 'Transfer ke Virtual Account BRI',
      fee: 1500,
      feeType: 'fixed',
      processingTime: '1-2 menit',
    },
    
    // COD
    {
      id: 'cod',
      name: 'Cash on Delivery (COD)',
      type: 'cod',
      icon: Truck,
      description: 'Bayar saat barang sampai',
      fee: 5000,
      feeType: 'fixed',
      processingTime: 'Sesuai estimasi pengiriman',
      popular: true,
      disabled: totalAmount > 2000000,
      disabledReason: 'COD hanya tersedia untuk pembelian maksimal Rp 2.000.000',
    },
  ];

  const calculateFee = (method: PaymentMethod) => {
    if (!method.fee) return 0;
    
    if (method.feeType === 'percentage') {
      return (totalAmount * method.fee) / 100;
    } else {
      return method.fee;
    }
  };

  const getTotalWithFee = (method: PaymentMethod) => {
    return totalAmount + calculateFee(method);
  };

  const toggleExpanded = (methodId: string) => {
    setExpandedMethod(expandedMethod === methodId ? null : methodId);
  };

  const groupedMethods = paymentMethods.reduce((groups, method) => {
    if (!groups[method.type]) {
      groups[method.type] = [];
    }
    groups[method.type].push(method);
    return groups;
  }, {} as Record<string, PaymentMethod[]>);

  const groupLabels = {
    card: 'Kartu Kredit',
    ewallet: 'E-Wallet',
    bank: 'Transfer Bank',
    cod: 'Cash on Delivery',
  };

  const getMethodIcon = (method: PaymentMethod) => {
    const IconComponent = method.icon;
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Metode Pembayaran</h3>
      </div>

      {Object.entries(groupedMethods).map(([type, methods]) => (
        <div key={type} className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider">
            {groupLabels[type as keyof typeof groupLabels]}
          </h4>
          
          <div className="space-y-2">
            {methods.map((method) => {
              const fee = calculateFee(method);
              const totalWithFee = getTotalWithFee(method);
              const isExpanded = expandedMethod === method.id;
              const isSelected = selectedPayment === method.id;
              
              return (
                <div
                  key={method.id}
                  className={`border rounded-lg transition-all duration-200 ${
                    method.disabled
                      ? 'border-gray-200 bg-gray-50 opacity-60'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => !method.disabled && onPaymentSelect(method.id)}
                          disabled={method.disabled}
                          className={`flex items-center gap-3 flex-1 text-left disabled:cursor-not-allowed`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600'
                              : method.disabled
                              ? 'border-gray-300'
                              : 'border-gray-400'
                          }`}>
                            {isSelected && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {getMethodIcon(method)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {method.name}
                                </span>
                                {method.popular && (
                                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                                    POPULAR
                                  </span>
                                )}
                                {method.disabled && (
                                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                    TIDAK TERSEDIA
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {method.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {fee > 0 ? `+Rp ${fee.toLocaleString('id-ID')}` : 'Gratis'}
                          </div>
                          <div className="font-medium text-gray-900">
                            Rp {totalWithFee.toLocaleString('id-ID')}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleExpanded(method.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">Rp {totalAmount.toLocaleString('id-ID')}</span>
                          </div>
                          
                          {fee > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                Biaya {method.feeType === 'percentage' ? 'Transaksi' : 'Admin'}:
                              </span>
                              <span className="font-medium">
                                Rp {fee.toLocaleString('id-ID')}
                                {method.feeType === 'percentage' && (
                                  <span className="text-gray-500 ml-1">
                                    ({method.fee}%)
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span className="font-medium text-gray-900">Total:</span>
                            <span className="font-bold text-lg text-blue-600">
                              Rp {totalWithFee.toLocaleString('id-ID')}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <Info className="h-4 w-4" />
                            <span>
                              Waktu pemrosesan: {method.processingTime}
                            </span>
                          </div>
                          
                          {method.disabled && method.disabledReason && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                              {method.disabledReason}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="text-sm text-green-800">
            <h4 className="font-semibold mb-1">Pembayaran Aman & Terpercaya</h4>
            <p className="text-green-700">
              Semua transaksi dilindungi dengan enkripsi SSL. Kami menjamin keamanan data pribadi dan pembayaran kamu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
