"use client";

interface CheckoutProductListProps {
  items: any[];
}

export default function CheckoutProductList({ items }: CheckoutProductListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        Tidak ada produk di keranjang
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
          <img
            src={item.image}
            alt={item.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {item.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">
                {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
          
          <div className="text-sm font-medium text-gray-900">
            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
          </div>
        </div>
      ))}
    </div>
  );
}
