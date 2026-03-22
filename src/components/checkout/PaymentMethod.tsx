"use client";

interface PaymentMethodProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  error?: string;
}

const paymentMethods = [
  {
    id: 'transfer',
    name: 'Transfer Bank',
    description: 'BCA, BNI, BRI, Mandiri',
    icon: '🏦',
  },
  {
    id: 'ewallet',
    name: 'E-Wallet',
    description: 'GoPay, OVO, DANA, ShopeePay',
    icon: '📱',
  },
  {
    id: 'cod',
    name: 'COD (Bayar di Tempat)',
    description: 'Bayar saat barang sampai',
    icon: '💵',
  },
];

export default function PaymentMethod({ selectedMethod, onMethodChange, error }: PaymentMethodProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Metode Pembayaran <span className="text-red-500">*</span>
      </h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(e) => onMethodChange(e.target.value)}
              className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
            />
            
            <div className="flex items-center flex-1">
              <span className="text-2xl mr-3">{method.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">
                  {method.name}
                </div>
                <p className="text-sm text-gray-600">
                  {method.description}
                </p>
              </div>
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
