"use client";

import AddToCartClient from './AddToCartClient';
import WishlistClient from './WishlistClient';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  discount_price?: number;
  images: string[];
  inStock: boolean;
}

interface ProductActionsWrapperProps {
  product: Product;
}

export default function ProductActionsWrapper({ product }: ProductActionsWrapperProps) {
  return (
    <div className="space-y-3">
      <AddToCartClient 
        product={product}
        disabled={!product.inStock}
      />
      <WishlistClient 
        product={product}
      />
    </div>
  );
}
