export interface Product {
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
  sku: string
  stock: number
  lowStockThreshold: number
  reserved: number
  available: number
  status: 'active' | 'inactive' | 'discontinued'
  variants?: ProductVariant[]
  tags: string[]
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  supplier?: string
  costPrice?: number
  profitMargin?: number
  lastRestocked?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  stock: number
  reserved: number
  available: number
  attributes: {
    [key: string]: string | number | boolean
  }
  image?: string
}

export interface InventoryTransaction {
  id: string
  productId: string
  variantId?: string
  type: 'in' | 'out' | 'adjustment' | 'return' | 'damage'
  quantity: number
  reason: string
  referenceId?: string
  performedBy: string
  timestamp: Date
  metadata?: {
    [key: string]: any
  }
}

export interface InventoryAlert {
  id: string
  productId: string
  variantId?: string
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expired'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  isResolved: boolean
  createdAt: Date
  resolvedAt?: Date
}

export interface StockForecast {
  productId: string
  variantId?: string
  currentStock: number
  projectedStock: number
  daysUntilStockout: number
  recommendedOrderQuantity: number
  confidence: number
  lastUpdated: Date
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  leadTime: number // days
  minimumOrderQuantity: number
  products: string[] // product IDs
  isActive: boolean
  rating?: number
  paymentTerms: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseOrder {
  id: string
  supplierId: string
  status: 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled'
  items: PurchaseOrderItem[]
  totalAmount: number
  expectedDeliveryDate: Date
  actualDeliveryDate?: Date
  trackingNumber?: string
  notes?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface PurchaseOrderItem {
  productId: string
  variantId?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  receivedQuantity: number
  notes?: string
}

export class InventoryManager {
  private products: Map<string, Product> = new Map()
  private transactions: Map<string, InventoryTransaction[]> = new Map()
  private alerts: Map<string, InventoryAlert[]> = new Map()
  private suppliers: Map<string, Supplier> = new Map()
  private purchaseOrders: Map<string, PurchaseOrder> = new Map()

  constructor() {
    this.initializeSampleData()
  }

  // Product Management
  addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Calculate available stock
    newProduct.available = newProduct.stock - newProduct.reserved

    this.products.set(newProduct.id, newProduct)
    this.checkStockAlerts(newProduct.id)
    return newProduct
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const product = this.products.get(id)
    if (!product) return null

    const updatedProduct = {
      ...product,
      ...updates,
      updatedAt: new Date(),
      available: updates.stock !== undefined ? updates.stock - product.reserved : product.available
    }

    this.products.set(id, updatedProduct)
    this.checkStockAlerts(id)
    return updatedProduct
  }

  deleteProduct(id: string): boolean {
    return this.products.delete(id)
  }

  getProduct(id: string): Product | null {
    return this.products.get(id) || null
  }

  getAllProducts(): Product[] {
    return Array.from(this.products.values())
  }

  getProductsByCategory(category: string): Product[] {
    return this.getAllProducts().filter(product => product.category === category)
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllProducts().filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.sku.toLowerCase().includes(lowerQuery) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  // Stock Management
  updateStock(productId: string, quantity: number, type: InventoryTransaction['type'], reason: string, performedBy: string): boolean {
    const product = this.products.get(productId)
    if (!product) return false

    const transaction: InventoryTransaction = {
      id: this.generateId(),
      productId,
      type,
      quantity: Math.abs(quantity),
      reason,
      performedBy,
      timestamp: new Date()
    }

    if (!this.transactions.has(productId)) {
      this.transactions.set(productId, [])
    }
    this.transactions.get(productId)!.push(transaction)

    let newStock = product.stock
    if (type === 'in') {
      newStock += quantity
    } else if (type === 'out' || type === 'damage') {
      newStock = Math.max(0, newStock - quantity)
    } else if (type === 'adjustment') {
      newStock = Math.max(0, quantity)
    }

    this.updateProduct(productId, { stock: newStock, lastRestocked: new Date() })
    return true
  }

  reserveStock(productId: string, quantity: number): boolean {
    const product = this.products.get(productId)
    if (!product || product.available < quantity) return false

    this.updateProduct(productId, { reserved: product.reserved + quantity })
    return true
  }

  releaseReservation(productId: string, quantity: number): boolean {
    const product = this.products.get(productId)
    if (!product || product.reserved < quantity) return false

    this.updateProduct(productId, { reserved: product.reserved - quantity })
    return true
  }

  fulfillReservation(productId: string, quantity: number): boolean {
    const product = this.products.get(productId)
    if (!product || product.reserved < quantity) return false

    const newStock = Math.max(0, product.stock - quantity)
    const newReserved = product.reserved - quantity

    this.updateProduct(productId, { stock: newStock, reserved: newReserved })
    
    // Record transaction
    const transaction: InventoryTransaction = {
      id: this.generateId(),
      productId,
      type: 'out',
      quantity,
      reason: 'Order fulfillment',
      performedBy: 'system',
      timestamp: new Date()
    }

    if (!this.transactions.has(productId)) {
      this.transactions.set(productId, [])
    }
    this.transactions.get(productId)!.push(transaction)

    return true
  }

  // Inventory Analysis
  getLowStockProducts(threshold?: number): Product[] {
    return this.getAllProducts().filter(product => {
      const stockThreshold = threshold || product.lowStockThreshold
      return product.available <= stockThreshold
    })
  }

  getOutOfStockProducts(): Product[] {
    return this.getAllProducts().filter(product => product.available === 0)
  }

  getOverstockedProducts(threshold: number = 100): Product[] {
    return this.getAllProducts().filter(product => product.available > threshold)
  }

  getStockValue(): number {
    return this.getAllProducts().reduce((total, product) => {
      return total + (product.stock * (product.costPrice || product.price * 0.6))
    }, 0)
  }

  getTopSellingProducts(limit: number = 10): Product[] {
    // This would typically be based on sales data
    // For now, return products with highest stock turnover
    return this.getAllProducts()
      .sort((a, b) => (b.reserved / b.stock) - (a.reserved / a.stock))
      .slice(0, limit)
  }

  // Alerts Management
  checkStockAlerts(productId: string): void {
    const product = this.products.get(productId)
    if (!product) return

    const alerts: InventoryAlert[] = []

    if (product.available === 0) {
      alerts.push({
        id: this.generateId(),
        productId,
        type: 'out_of_stock',
        severity: 'critical',
        message: `${product.name} is out of stock`,
        isResolved: false,
        createdAt: new Date()
      })
    } else if (product.available <= product.lowStockThreshold) {
      alerts.push({
        id: this.generateId(),
        productId,
        type: 'low_stock',
        severity: product.available === 0 ? 'critical' : product.available < product.lowStockThreshold / 2 ? 'high' : 'medium',
        message: `${product.name} has low stock (${product.available} remaining)`,
        isResolved: false,
        createdAt: new Date()
      })
    }

    if (alerts.length > 0) {
      if (!this.alerts.has(productId)) {
        this.alerts.set(productId, [])
      }
      this.alerts.get(productId)!.push(...alerts)
    }
  }

  getActiveAlerts(): InventoryAlert[] {
    const allAlerts: InventoryAlert[] = []
    for (const alerts of this.alerts.values()) {
      allAlerts.push(...alerts.filter(alert => !alert.isResolved))
    }
    return allAlerts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return severityOrder[b.severity] - severityOrder[a.severity]
    })
  }

  resolveAlert(alertId: string): boolean {
    for (const alerts of this.alerts.values()) {
      const alert = alerts.find(a => a.id === alertId)
      if (alert) {
        alert.isResolved = true
        alert.resolvedAt = new Date()
        return true
      }
    }
    return false
  }

  // Supplier Management
  addSupplier(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Supplier {
    const newSupplier: Supplier = {
      ...supplier,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.suppliers.set(newSupplier.id, newSupplier)
    return newSupplier
  }

  getSupplier(id: string): Supplier | null {
    return this.suppliers.get(id) || null
  }

  getAllSuppliers(): Supplier[] {
    return Array.from(this.suppliers.values())
  }

  // Purchase Order Management
  createPurchaseOrder(supplierId: string, items: Omit<PurchaseOrderItem, 'totalPrice' | 'receivedQuantity'>[]): PurchaseOrder {
    const supplier = this.suppliers.get(supplierId)
    if (!supplier) throw new Error('Supplier not found')

    const totalItems = items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice,
      receivedQuantity: 0
    }))

    const totalAmount = totalItems.reduce((sum, item) => sum + item.totalPrice, 0)

    const purchaseOrder: PurchaseOrder = {
      id: this.generateId(),
      supplierId,
      status: 'draft',
      items: totalItems,
      totalAmount,
      expectedDeliveryDate: new Date(Date.now() + supplier.leadTime * 24 * 60 * 60 * 1000),
      createdBy: 'current_user',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.purchaseOrders.set(purchaseOrder.id, purchaseOrder)
    return purchaseOrder
  }

  getPurchaseOrder(id: string): PurchaseOrder | null {
    return this.purchaseOrders.get(id) || null
  }

  getAllPurchaseOrders(): PurchaseOrder[] {
    return Array.from(this.purchaseOrders.values())
  }

  // Reporting
  generateInventoryReport(): {
    totalProducts: number
    totalValue: number
    lowStockCount: number
    outOfStockCount: number
    categories: Array<{ name: string; count: number; value: number }>
  } {
    const products = this.getAllProducts()
    const categories = new Map<string, { count: number; value: number }>()

    for (const product of products) {
      const category = product.category || 'Uncategorized'
      const existing = categories.get(category) || { count: 0, value: 0 }
      
      categories.set(category, {
        count: existing.count + 1,
        value: existing.value + (product.stock * (product.costPrice || product.price * 0.6))
      })
    }

    return {
      totalProducts: products.length,
      totalValue: this.getStockValue(),
      lowStockCount: this.getLowStockProducts().length,
      outOfStockCount: this.getOutOfStockProducts().length,
      categories: Array.from(categories.entries()).map(([name, data]) => ({ name, ...data }))
    }
  }

  // Utility Methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private initializeSampleData(): void {
    // Sample products
    const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Premium Leather Jacket',
        description: 'High-quality leather jacket with modern design',
        price: 299,
        originalPrice: 399,
        discount: 25,
        rating: 4.5,
        reviews: 128,
        image: '/products/jacket.jpg',
        isNew: true,
        category: 'clothing',
        sku: 'JKT-001',
        stock: 45,
        lowStockThreshold: 10,
        reserved: 12,
        status: 'active',
        tags: ['leather', 'jacket', 'premium', 'winter'],
        weight: 1.2,
        dimensions: { length: 60, width: 50, height: 10 },
        costPrice: 120,
        profitMargin: 60,
        available: 33 // stock - reserved
      },
      {
        name: 'Designer Sneakers',
        description: 'Comfortable and stylish sneakers for everyday wear',
        price: 159,
        originalPrice: 199,
        discount: 20,
        rating: 4.3,
        reviews: 89,
        image: '/products/sneakers.jpg',
        category: 'shoes',
        sku: 'SNS-002',
        stock: 8,
        lowStockThreshold: 15,
        reserved: 5,
        status: 'active',
        tags: ['sneakers', 'casual', 'comfortable'],
        weight: 0.8,
        dimensions: { length: 30, width: 20, height: 12 },
        costPrice: 65,
        profitMargin: 59,
        available: 3 // stock - reserved
      },
      {
        name: 'Luxury Watch',
        description: 'Elegant timepiece with precision movement',
        price: 599,
        rating: 4.8,
        reviews: 45,
        image: '/products/watch.jpg',
        isNew: true,
        category: 'accessories',
        sku: 'WCH-003',
        stock: 0,
        lowStockThreshold: 5,
        reserved: 0,
        status: 'active',
        tags: ['watch', 'luxury', 'elegant'],
        weight: 0.2,
        dimensions: { length: 4, width: 4, height: 1 },
        costPrice: 250,
        profitMargin: 58,
        available: 0 // stock - reserved
      }
    ]

    for (const product of sampleProducts) {
      this.addProduct(product)
    }

    // Sample suppliers
    const sampleSuppliers: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Premium Fashion Supplies',
        email: 'contact@premiumfashion.com',
        phone: '+1-555-0101',
        address: '123 Fashion Ave, New York, NY 10001',
        leadTime: 7,
        minimumOrderQuantity: 50,
        products: ['JKT-001', 'SNS-002'],
        isActive: true,
        rating: 4.7,
        paymentTerms: 'Net 30'
      },
      {
        name: 'Luxury Accessories Co',
        email: 'orders@luxuryacc.com',
        phone: '+1-555-0102',
        address: '456 Luxury Blvd, Los Angeles, CA 90001',
        leadTime: 14,
        minimumOrderQuantity: 20,
        products: ['WCH-003'],
        isActive: true,
        rating: 4.9,
        paymentTerms: 'Net 45'
      }
    ]

    for (const supplier of sampleSuppliers) {
      this.addSupplier(supplier)
    }
  }
}
