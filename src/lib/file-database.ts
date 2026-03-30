import fs from 'fs';
import path from 'path';

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

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// Load existing data or create empty array
let products: Product[] = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    products = JSON.parse(data);
  }
} catch (error) {
  console.log('Creating new products file');
  products = [];
}

export class FileDatabaseService {
  // Save data to file
  private static saveData() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
      console.log('✅ Data saved to file');
    } catch (error) {
      console.error('❌ Error saving data:', error);
    }
  }

  // Get all products
  static async getProducts(): Promise<Product[]> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 50));
    return products;
  }

  // Get product by ID
  static async getProduct(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return products.find(p => p.id === id) || null;
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
    products.push(newProduct);
    this.saveData();
    return newProduct;
  }

  // Update product
  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveData();
    return products[index];
  }

  // Delete product
  static async deleteProduct(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    products.splice(index, 1);
    this.saveData();
    return true;
  }

  // Get pending products
  static async getPendingProducts(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return products.filter(p => p.status === 'pending');
  }

  // Update product status
  static async updateProductStatus(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const product = products.find(p => p.id === id);
    if (!product) return false;
    
    product.status = status;
    product.updatedAt = new Date().toISOString();
    this.saveData();
    return true;
  }

  // Get products by category
  static async getProductsByCategory(category: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return products.filter(p => p.category === category);
  }

  // Search products
  static async searchProducts(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return products.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export default FileDatabaseService;
