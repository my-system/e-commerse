"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGallery from '@/components/ui/ProductGallery';
import ProductInfo from '@/components/ui/ProductInfo';
import ProductCard from '@/components/ui/ProductCard';
import { products } from '@/data/products';
import { Product, ProductVariant } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Find product and related products
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Try to fetch from 3-Database API first
        const response = await fetch(`/api/products/${productId}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.product) {
            console.log('✅ Product found in 3-Database:', data.product);
            
            // Convert API product to Product interface format
            const convertedProduct: Product = {
              id: data.product.id,
              title: data.product.title,
              price: data.product.price,
              category: data.product.category,
              description: data.product.description || '',
              featured: data.product.featured,
              inStock: data.product.inStock,
              rating: data.product.rating,
              reviews: data.product.reviews,
              images: Array.isArray(data.product.images) ? data.product.images : 
                       typeof data.product.images === 'string' ? JSON.parse(data.product.images || '[]') : [],
              material: data.product.material || '',
              care: data.product.care || '',
              variants: {
                sizes: data.product.sizes || [],
                colors: data.product.colors || []
              },
              specifications: data.product.specifications || {}
            };
            
            setProduct(convertedProduct);
            setIsLoading(false);
            return;
          }
        }
        
        console.log('❌ Product not found in 3-Database, trying fallback...');
        
      } catch (error) {
        console.error('Error fetching product from 3-Database API:', error);
      }
      
      // Try fallback to test-seller-products API
      try {
        const response = await fetch('/api/test-seller-products');
        if (response.ok) {
          const data = await response.json();
          const foundProduct = data.products.find((p: any) => p.id === productId);
          
          if (foundProduct) {
            console.log('✅ Product found in test-seller-products:', foundProduct);
            
            // Convert API product to Product interface format
            const convertedProduct: Product = {
              id: foundProduct.id,
              title: foundProduct.title,
              price: foundProduct.price,
              category: foundProduct.category,
              description: foundProduct.description || '',
              featured: foundProduct.featured,
              inStock: foundProduct.inStock,
              rating: foundProduct.rating,
              reviews: foundProduct.reviews,
              images: typeof foundProduct.images === 'string' ? JSON.parse(foundProduct.images || '[]') : foundProduct.images,
              material: foundProduct.material || '',
              care: foundProduct.care || '',
              variants: {
                sizes: foundProduct.sizes || [],
                colors: foundProduct.colors || []
              },
              specifications: foundProduct.specifications || {}
            };
            
            setProduct(convertedProduct);
            
            // Find related products from API data
            const related = data.products
              .filter((p: any) => p.category === foundProduct.category && p.id !== productId)
              .slice(0, 4)
              .map((p: any) => ({
                id: p.id,
                title: p.title,
                price: p.price,
                category: p.category,
                description: p.description || '',
                featured: p.featured,
                inStock: p.inStock,
                rating: p.rating,
                reviews: p.reviews,
                images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images,
                material: p.material || '',
                care: p.care || '',
                variants: {
                  sizes: p.sizes || [],
                  colors: p.colors || []
                },
                specifications: p.specifications || {}
              }));
            
            setRelatedProducts(related);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching product from test-seller-products API:', error);
      }
      
      // Fallback to static data
      const foundProduct = products.find(p => p.id === productId);
      
      if (!foundProduct) {
        console.log('❌ Product not found anywhere, showing not found page');
        // Don't redirect, show not found state instead
        setProduct(null);
        setIsLoading(false);
        return;
      }
      
      setProduct(foundProduct);
      
      // Find related products (same category, exclude current product)
      const related = products
        .filter(p => p.category === foundProduct.category && p.id !== productId)
        .slice(0, 4);
      
      setRelatedProducts(related);
      setIsLoading(false);
    };
    
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async (variant: { size?: ProductVariant; color?: ProductVariant; quantity: number }) => {
    if (!product) return;
    
    const selectedSizeVariant = product.variants?.sizes?.find((s: ProductVariant) => s.id === variant.size?.id);
    const selectedColorVariant = product.variants?.colors?.find((c: ProductVariant) => c.id === variant.color?.id);
    
    const cartItem = {
      id: `${product.id}-${variant.size?.id || 'default'}-${variant.color?.id || 'default'}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity: variant.quantity,
      size: selectedSizeVariant,
      color: selectedColorVariant
    };
    
    await addItem(cartItem);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/marketplace')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Gallery */}
          <ProductGallery 
            images={product.images} 
            productName={product.title}
          />
          
          {/* Product Info */}
          <ProductInfo
            product={product}
            onAddToCart={handleAddToCart}
            onToggleWishlist={() => toggleWishlist(product.id)}
            isWishlisted={wishlist.includes(product.id)}
          />
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onToggleWishlist={() => toggleWishlist(relatedProduct.id)}
                  isWishlisted={wishlist.includes(relatedProduct.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
