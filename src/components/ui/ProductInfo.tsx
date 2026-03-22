"use client";

import { useState } from 'react';
import { Product, ProductVariant } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import VariantSelector from './VariantSelector';
import QuantitySelector from './QuantitySelector';
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
  onAddToCart: (variant: { size?: ProductVariant; color?: ProductVariant; quantity: number }) => void;
  onToggleWishlist: () => void;
  isWishlisted: boolean;
}

export default function ProductInfo({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const isVariantSelected = () => {
    const hasSizeVariant = product.variants?.sizes && product.variants.sizes.length > 0;
    const hasColorVariant = product.variants?.colors && product.variants.colors.length > 0;
    
    if (hasSizeVariant && !selectedSize) return false;
    if (hasColorVariant && !selectedColor) return false;
    return true;
  };

  const handleAddToCart = async () => {
    if (!isVariantSelected()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const selectedSizeVariant = product.variants?.sizes?.find(s => s.id === selectedSize);
    const selectedColorVariant = product.variants?.colors?.find(c => c.id === selectedColor);
    
    onAddToCart({
      size: selectedSizeVariant,
      color: selectedColorVariant,
      quantity,
    });
    
    setIsLoading(false);
  };

  const handleBuyNow = () => {
    handleAddToCart().then(() => {
      // Navigate to checkout
      console.log('Navigate to checkout');
    });
  };

  const renderRating = () => {
    if (!product.rating) return null;
    
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating!)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {product.rating} ({product.reviews} ulasan)
        </span>
      </div>
    );
  };

  const renderStockStatus = () => {
    const inStock = product.inStock !== false;
    
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          inStock ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className={`text-sm font-medium ${
          inStock ? 'text-green-600' : 'text-red-600'
        }`}>
          {inStock ? 'Tersedia' : 'Habis'}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {product.title}
        </h1>
        {renderRating()}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(product.price)}
        </span>
        {product.featured && (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
            HOT
          </span>
        )}
      </div>

      {/* Stock Status */}
      {renderStockStatus()}

      {/* Short Description */}
      {product.description && (
        <p className="text-gray-600 leading-relaxed">
          {product.description}
        </p>
      )}

      {/* Variant Selectors */}
      <div className="space-y-4">
        {product.variants?.sizes && (
          <VariantSelector
            type="size"
            variants={product.variants.sizes}
            selectedVariant={selectedSize}
            onVariantChange={setSelectedSize}
            label="Ukuran"
          />
        )}
        
        {product.variants?.colors && (
          <VariantSelector
            type="color"
            variants={product.variants.colors}
            selectedVariant={selectedColor}
            onVariantChange={setSelectedColor}
            label="Warna"
          />
        )}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-900">Jumlah</label>
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          disabled={!product.inStock}
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={!isVariantSelected() || !product.inStock || isLoading}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Menambahkan...
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              Tambah ke Keranjang
            </>
          )}
        </button>
        
        <button
          onClick={handleBuyNow}
          disabled={!isVariantSelected() || !product.inStock || isLoading}
          className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Beli Sekarang
        </button>
      </div>

      {/* Wishlist Button */}
      <button
        onClick={onToggleWishlist}
        className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        {isWishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
      </button>

      {/* Product Features */}
      <div className="border-t pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-900">Pengiriman Gratis</div>
              <div className="text-xs text-gray-500">Minimal pembelian Rp 500.000</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-900">Garansi 30 Hari</div>
              <div className="text-xs text-gray-500">Pengembalian mudah</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-900">Otentik 100%</div>
              <div className="text-xs text-gray-500">Produk asli</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      {(product.material || product.specifications) && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Produk</h3>
          
          {product.material && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Material:</span>
              <span className="text-sm text-gray-600 ml-2">{product.material}</span>
            </div>
          )}
          
          {product.care && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Perawatan:</span>
              <span className="text-sm text-gray-600 ml-2">{product.care}</span>
            </div>
          )}
          
          {product.specifications && (
            <div className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="text-sm font-medium text-gray-700 w-32">{key}:</span>
                  <span className="text-sm text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
