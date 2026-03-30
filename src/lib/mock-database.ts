// Mock Database Service - Tanpa PostgreSQL Required
// Untuk komputer yang belum install PostgreSQL

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
}

// Mock data untuk development
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Classic White T-Shirt',
    price: 299000,
    category: 'pakaian-pria',
    description: 'T-shirt klasik warna putih',
    featured: true,
    inStock: true,
    rating: 4.5,
    reviews: 128,
    images: '["https://images.unsplash.com/photo-1521572163474-6864f9a17a2?w=600&h=800"]',
    material: '100% Cotton',
    care: 'Machine wash cold',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'approved',
    badges: '["bestseller"]',
    sellerId: 'seller1'
  },
  {
    id: '2',
    title: 'Denim Jacket',
    price: 599000,
    category: 'pakaian-pria',
    description: 'Jaket denim premium',
    featured: true,
    inStock: true,
    rating: 4.8,
    reviews: 89,
    images: '["https://images.unsplash.com/photo-1551698638-3d8d8b5b5b5?w=600&h=800"]',
    material: 'Denim',
    care: 'Dry clean recommended',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'approved',
    badges: '["new"]',
    sellerId: 'seller1'
  }
];

export class MockDatabaseService {
  // Get all products
  static async getProducts(): Promise<Product[]> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts;
  }

  // Get product by ID
  static async getProduct(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts.find(p => p.id === id) || null;
  }

  // Add new product
  static async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
      badges: '["new"]',
      sellerId: 'seller1'
    };
    mockProducts.push(newProduct);
    return newProduct;
  }

  // Update product
  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    mockProducts[index] = { ...mockProducts[index], ...updates, updatedAt: new Date().toISOString() };
    return mockProducts[index];
  }

  // Delete product
  static async deleteProduct(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    mockProducts.splice(index, 1);
    return true;
  }

  // Get pending products
  static async getPendingProducts(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts.filter(p => p.status === 'pending');
  }

  // Update product status
  static async updateProductStatus(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const product = mockProducts.find(p => p.id === id);
    if (!product) return false;
    
    product.status = status;
    product.updatedAt = new Date().toISOString();
    return true;
  }

  // Get products by category
  static async getProductsByCategory(category: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts.filter(p => p.category === category);
  }

  // Search products
  static async searchProducts(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export default MockDatabaseService;
