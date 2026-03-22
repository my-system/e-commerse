"use client";

interface ShippingOptionsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  error?: string;
}

const shippingOptions = [
  {
    id: 'regular',
    name: 'Reguler',
    price: 20000,
    description: 'Estimasi 3-5 hari kerja',
  },
  {
    id: 'express',
    name: 'Express',
    price: 40000,
    description: 'Estimasi 1-2 hari kerja',
  },
  {
    id: 'free',
    name: 'Gratis Ongkir',
    price: 0,
    description: 'Untuk pembelian di atas Rp 500.000',
  },
];

export default function ShippingOptions({ selectedMethod, onMethodChange, error }: ShippingOptionsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Metode Pengiriman <span className="text-red-500">*</span>
      </h3>
      
      <div className="space-y-3">
        {shippingOptions.map((option) => (
          <label
            key={option.id}
            className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedMethod === option.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="shippingMethod"
              value={option.id}
              checked={selectedMethod === option.id}
              onChange={(e) => onMethodChange(e.target.value)}
              className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
            />
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">
                  {option.name}
                </span>
                <span className={`font-bold transition-colors duration-200 ${
                  selectedMethod === option.id ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {option.price === 0 ? 'GRATIS' : `Rp ${option.price.toLocaleString('id-ID')}`}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {option.description}
              </p>
            </div>
          </label>
        ))}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
