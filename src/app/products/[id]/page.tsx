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
      setIsLoading(false);
    };
      
      setProduct(foundProduct);
      
      // Find related products (same category, exclude current product)
      const related = products
        .filter(p => p.category === foundProduct.category && p.id !== productId)
        .slice(0, 4);
      
      setRelatedProducts(related);
      setIsLoading(false);
    };
    
    fetchProduct();
  }, [productId, router]);

  const handleAddToCart = async (variant: { size?: ProductVariant; color?: ProductVariant; quantity: number }) => {
    if (!product) return;
    
    const selectedSizeVariant = product.variants?.sizes?.find(s => s.id === variant.size?.id);
    const selectedColorVariant = product.variants?.colors?.find(c => c.id === variant.color?.id);
    
    const cartItem = {
      id: `${product.id}-${variant.size?.id || 'default'}-${variant.color?.id || 'default'}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity: variant.quantity,
      variant: {
        size: selectedSizeVariant,
        color: selectedColorVariant,
      },
    };
    
    addItem(cartItem);
    
    // Show success message
    console.log('Added to cart:', cartItem);
    
    // In real app, you might show a toast notification
    alert(`${product.title} (${variant.size?.value || ''}${variant.color?.name || ''}) x${variant.quantity} ditambahkan ke keranjang!`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    setWishlist(prev => 
      prev.includes(product.id)
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id]
    );
  };

  const handleQuickView = (relatedProduct: Product) => {
    // Navigate to product detail
    router.push(`/products/${relatedProduct.id}`);
  };

  const handleRelatedAddToCart = (relatedProduct: Product) => {
    const cartItem = {
      id: relatedProduct.id,
      productId: relatedProduct.id,
      title: relatedProduct.title,
      price: relatedProduct.price,
      image: relatedProduct.images[0],
      quantity: 1,
    };
    
    addItem(cartItem);
    console.log('Added to cart:', relatedProduct.title);
  };

  const handleRelatedToggleWishlist = (relatedProduct: Product) => {
    setWishlist(prev => 
      prev.includes(relatedProduct.id)
        ? prev.filter(id => id !== relatedProduct.id)
        : [...prev, relatedProduct.id]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gray-200 rounded-lg aspect-square" />
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Produk Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-8">Maaf, produk yang Anda cari tidak tersedia.</p>
            <button
              onClick={() => router.push('/marketplace')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Kembali ke Shop
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
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-700 transition-colors duration-200">
              Home
            </a>
            <span>/</span>
            <a href="/marketplace" className="hover:text-gray-700 transition-colors duration-200">
              Shop
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div>
            <ProductGallery
              images={product.images}
              productName={product.title}
            />
          </div>

          {/* Product Info */}
          <div>
            <ProductInfo
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isWishlisted={wishlist.includes(product.id)}
            />
          </div>
        </div>
      </div>

      {/* Product Description */}
      {product.description && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Deskripsi Produk</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Temukan kualitas terbaik dalam setiap detail produk ini. Dirancang dengan hati-hati untuk memberikan pengalaman yang luar biasa dan daya tahan yang maksimal. Produk ini adalah pilihan sempurna untuk Anda yang mengutamakan kualitas dan gaya.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Dengan material pilihan dan proses produksi yang ketat, produk ini menjamin kepuasan dan kenyamanan dalam penggunaan sehari-hari. Ideal untuk berbagai kesempatan dan gaya hidup modern.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Produk Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onQuickView={handleQuickView}
                  onAddToCart={handleRelatedAddToCart}
                  onToggleWishlist={handleRelatedToggleWishlist}
                  isWishlisted={wishlist.includes(relatedProduct.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
