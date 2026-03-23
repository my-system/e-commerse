'use client'

import { ProductCardModern } from './ProductCardModern'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  rating?: number
  reviews?: number
  image?: string
  isNew?: boolean
  category?: string
}

interface ProductGridModernProps {
  products: Product[]
  columns?: 1 | 2
  onProductClick?: (product: Product) => void
}

export function ProductGridModern({ 
  products, 
  columns = 2, 
  onProductClick 
}: ProductGridModernProps) {
  return (
    <div className={`
      grid gap-3
      ${columns === 1 
        ? 'grid-cols-1' 
        : 'grid-cols-2'
      }
    `}>
      {products.map((product) => (
        <ProductCardModern 
          key={product.id}
          product={product}
          onClick={() => onProductClick?.(product)}
        />
      ))}
    </div>
  )
}
