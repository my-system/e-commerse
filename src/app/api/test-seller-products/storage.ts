// Simple persistent storage for development
// In production, this should be replaced with actual database

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description?: string;
  featured: boolean;
  inStock: boolean;
  rating: number;
  reviews: number;
  images: string;
  material?: string;
  care?: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  badges: string;
  sellerId: string;
  sizes?: Array<{ id: string; name: string; value: string; inStock: boolean }>;
  colors?: Array<{ id: string; name: string; value: string; inStock: boolean }>;
  specifications?: Record<string, string>;
}

const STORAGE_KEY = 'seller_products';

// Default products
const defaultProducts: Product[] = [
  {
    id: '1',
    title: 'Test Product 1',
    price: 299900,
    category: 'electronics',
    description: 'Test description with bullet points:\n• Feature 1\n• Feature 2\n• Feature 3',
    featured: false,
    inStock: true,
    rating: 0,
    reviews: 0,
    images: '["/api/placeholder/600/800/test"]',
    material: 'Premium Material',
    care: 'Machine wash cold',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'pending',
    badges: '[]',
    sellerId: 'mock-seller-id',
    sizes: [
      { id: 's1', name: 'S', value: 'S', inStock: true },
      { id: 'm1', name: 'M', value: 'M', inStock: true },
      { id: 'l1', name: 'L', value: 'L', inStock: false }
    ],
    colors: [
      { id: 'c1', name: 'Black', value: '#000000', inStock: true },
      { id: 'c2', name: 'White', value: '#FFFFFF', inStock: true }
    ],
    specifications: {
      'Screen Size': '6.1 inches',
      'Battery': '3000mAh',
      'Camera': '48MP'
    }
  },
  {
    id: '2',
    title: 'Test Product 2',
    price: 499900,
    category: 'fashion',
    description: 'Another test product with features:\n• Premium quality fabric\n• Comfortable fit\n• Stylish design',
    featured: true,
    inStock: true,
    rating: 0,
    reviews: 0,
    images: '["/api/placeholder/600/800/test2"]',
    material: 'Cotton',
    care: 'Machine wash',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'approved',
    badges: '["HOT"]',
    sellerId: 'mock-seller-id',
    sizes: [
      { id: 'xs2', name: 'XS', value: 'XS', inStock: true },
      { id: 's2', name: 'S', value: 'S', inStock: true },
      { id: 'm2', name: 'M', value: 'M', inStock: true },
      { id: 'l2', name: 'L', value: 'L', inStock: true },
      { id: 'xl2', name: 'XL', value: 'XL', inStock: false }
    ],
    colors: [
      { id: 'c3', name: 'Blue', value: '#0000FF', inStock: true },
      { id: 'c4', name: 'Red', value: '#FF0000', inStock: true }
    ],
    specifications: {
      'Material': '100% Cotton',
      'Fit': 'Regular Fit',
      'Care': 'Machine wash cold'
    }
  },
  {
    id: '1774720951361',
    title: 'baju',
    price: 200000,
    category: 'fashion',
    description: 'baju',
    featured: false,
    inStock: true,
    rating: 0,
    reviews: 0,
    images: '["/uploads/products/1774720882624-d3454a98d5m.jpeg","/uploads/products/1774720882627-i689toz0dn9.jpeg","/uploads/products/1774720882629-ech4hqgpu7.jpeg"]',
    status: 'approved', // FORCE TO APPROVED FOR TESTING
    badges: '[]',
    sellerId: 'mock-seller-id',
    createdAt: '2026-03-28T18:02:31.361Z',
    updatedAt: '2026-03-28T18:02:31.361Z',
    sizes: [],
    colors: [],
    specifications: {}
  }
];

export function getProducts(): Product[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // If no products in storage, return defaults
        if (parsed.length === 0) {
          return defaultProducts;
        }
        return parsed;
      } catch (error) {
        console.error('Error parsing stored products:', error);
        return defaultProducts;
      }
    }
  }
  return defaultProducts;
}

export function saveProducts(products: Product[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products:', error);
    }
  }
}

export function addProduct(product: Product): void {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
  saveProducts(products);
  return products[index];
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  products.splice(index, 1);
  saveProducts(products);
  return true;
}

// Initialize with default products if empty
if (typeof window !== 'undefined') {
  const current = getProducts();
  if (current.length === 0) {
    saveProducts(defaultProducts);
  }
}
