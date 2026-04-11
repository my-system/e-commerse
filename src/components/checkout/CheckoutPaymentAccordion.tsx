"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CheckoutPaymentAccordionProps {
  selectedPayment: string | null;
  onPaymentSelect: (payment: string) => void;
  totalAmount: number;
}

const paymentCategories = [
  {
    id: 'bank',
    name: 'Transfer Bank',
    icon: '🏦',
    methods: [
      { id: 'bca', name: 'BCA', icon: '🔵' },
      { id: 'mandiri', name: 'Mandiri', icon: '🟡' },
      { id: 'bri', name: 'BRI', icon: '🔴' },
      { id: 'bni', name: 'BNI', icon: '🟠' },
    ]
  },
  {
    id: 'ewallet',
    name: 'E-Wallet',
    icon: '📱',
    methods: [
      { id: 'gopay', name: 'GoPay', icon: '💚' },
      { id: 'ovo', name: 'OVO', icon: '💜' },
      { id: 'dana', name: 'DANA', icon: '💙' },
      { id: 'shopeepay', name: 'ShopeePay', icon: '🟠' },
    ]
  },
  {
    id: 'cod',
    name: 'COD (Bayar di Tempat)',
    icon: '💵',
    methods: [
      { id: 'cod', name: 'Bayar saat barang diterima', icon: '📦' },
    ]
  }
];

export default function CheckoutPaymentAccordion({ selectedPayment, onPaymentSelect, totalAmount }: CheckoutPaymentAccordionProps) {
  const [openCategory, setOpenCategory] = useState<string | null>('bank');

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="space-y-3">
      {paymentCategories.map((category) => (
        <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{category.icon}</span>
              <span className="font-semibold text-gray-900">{category.name}</span>
            </div>
            {openCategory === category.id ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {openCategory === category.id && (
            <div className="p-4 bg-gray-50 space-y-2">
              {category.methods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    selectedPayment === method.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPayment === method.id}
                    onChange={() => onPaymentSelect(method.id)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xl">{method.icon}</span>
                  <span className="font-medium text-gray-900">{method.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
