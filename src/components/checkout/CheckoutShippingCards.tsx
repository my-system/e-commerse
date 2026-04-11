"use client";

interface CheckoutShippingCardsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const shippingOptions = [
  {
    id: 'regular',
    name: 'Reguler',
    price: 20000,
    description: 'Estimasi 3-5 hari kerja',
    icon: '📦',
  },
  {
    id: 'express',
    name: 'Express',
    price: 40000,
    description: 'Estimasi 1-2 hari kerja',
    icon: '⚡',
  },
  {
    id: 'free',
    name: 'Gratis Ongkir',
    price: 0,
    description: 'Untuk pembelian di atas Rp 500.000',
    icon: '🎁',
  },
];

export default function CheckoutShippingCards({ selectedMethod, onMethodChange }: CheckoutShippingCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {shippingOptions.map((option) => (
        <div
          key={option.id}
          onClick={() => onMethodChange(option.id)}
          className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
            selectedMethod === option.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {selectedMethod === option.id && (
            <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          
          <div className="text-2xl mb-2">{option.icon}</div>
          
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 text-sm">
              {option.name}
            </h3>
          </div>
          
          <div className="mb-2">
            <p className={`font-bold text-sm ${
              selectedMethod === option.id ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {option.price === 0 ? 'GRATIS' : `Rp ${option.price.toLocaleString('id-ID')}`}
            </p>
          </div>
          
          <p className="text-xs text-gray-600">
            {option.description}
          </p>
        </div>
      ))}
    </div>
  );
}
