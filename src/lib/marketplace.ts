export interface Vendor {
  id: string
  name: string
  description: string
  logo: string
  banner: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  website?: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  rating: number
  reviewCount: number
  totalSales: number
  productsCount: number
  isVerified: boolean
  isFeatured: boolean
  categories: string[]
  tags: string[]
  commissionRate: number
  paymentInfo: {
    bankName: string
    accountNumber: string
    accountName: string
    routingNumber?: string
  }
  settings: {
    autoAcceptOrders: boolean
    shippingMethods: string[]
    returnPolicy: string
    responseTime: number // hours
  }
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  createdAt: Date
  updatedAt: Date
}

export interface VendorProduct {
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
  vendorId: string
  vendorName: string
  vendorRating: number
  vendorVerified: boolean
  shippingInfo: {
    freeShipping: boolean
    shippingCost: number
    estimatedDelivery: number // days
    shippingMethods: string[]
  }
  vendorCommission: number
  vendorResponseTime: number
}

export interface VendorReview {
  id: string
  vendorId: string
  customerId: string
  customerName: string
  customerAvatar?: string
  rating: number
  title: string
  content: string
  images?: string[]
  helpfulVotes: number
  isVerified: boolean
  response?: {
    content: string
    timestamp: Date
  }
  createdAt: Date
  updatedAt: Date
}

export interface VendorApplication {
  id: string
  businessName: string
  businessType: 'individual' | 'company'
  contactPerson: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  businessDescription: string
  productCategories: string[]
  estimatedMonthlySales: number
  website?: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  documents: {
    businessLicense: string
    taxId: string
    identityProof: string
  }
  status: 'pending' | 'approved' | 'rejected' | 'needs_more_info'
  rejectionReason?: string
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
}

export interface VendorPayout {
  id: string
  vendorId: string
  period: {
    start: Date
    end: Date
  }
  totalSales: number
  commission: number
  payoutAmount: number
  status: 'pending' | 'processing' | 'paid' | 'failed'
  paymentMethod: 'bank_transfer' | 'paypal' | 'stripe'
  paymentDetails: {
    bankName?: string
    accountNumber?: string
    email?: string
  }
  processedAt?: Date
  paidAt?: Date
  notes?: string
  createdAt: Date
}

export interface VendorAnalytics {
  vendorId: string
  period: {
    start: Date
    end: Date
  }
  metrics: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    conversionRate: number
    pageViews: number
    uniqueVisitors: number
    topProducts: Array<{
      productId: string
      productName: string
      sales: number
      revenue: number
    }>
    salesByCategory: Array<{
      category: string
      sales: number
      revenue: number
    }>
    customerRetention: number
    averageRating: number
    responseTime: number
  }
}

export class MarketplaceManager {
  private vendors: Map<string, Vendor> = new Map()
  private vendorApplications: Map<string, VendorApplication> = new Map()
  private vendorReviews: Map<string, VendorReview[]> = new Map()
  private vendorPayouts: Map<string, VendorPayout[]> = new Map()
  private vendorAnalytics: Map<string, VendorAnalytics[]> = new Map()

  constructor() {
    this.initializeSampleData()
  }

  // Vendor Management
  createVendor(vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Vendor {
    const newVendor: Vendor = {
      ...vendor,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.vendors.set(newVendor.id, newVendor)
    return newVendor
  }

  updateVendor(id: string, updates: Partial<Vendor>): Vendor | null {
    const vendor = this.vendors.get(id)
    if (!vendor) return null

    const updatedVendor = {
      ...vendor,
      ...updates,
      updatedAt: new Date()
    }

    this.vendors.set(id, updatedVendor)
    return updatedVendor
  }

  getVendor(id: string): Vendor | null {
    return this.vendors.get(id) || null
  }

  getAllVendors(): Vendor[] {
    return Array.from(this.vendors.values())
  }

  getActiveVendors(): Vendor[] {
    return this.getAllVendors().filter(vendor => vendor.status === 'active')
  }

  getFeaturedVendors(): Vendor[] {
    return this.getAllVendors().filter(vendor => vendor.isFeatured && vendor.status === 'active')
  }

  getVendorsByCategory(category: string): Vendor[] {
    return this.getAllVendors().filter(vendor => 
      vendor.status === 'active' && vendor.categories.includes(category)
    )
  }

  searchVendors(query: string): Vendor[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllVendors().filter(vendor =>
      vendor.status === 'active' && (
        vendor.name.toLowerCase().includes(lowerQuery) ||
        vendor.description.toLowerCase().includes(lowerQuery) ||
        vendor.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    )
  }

  // Vendor Applications
  submitApplication(application: Omit<VendorApplication, 'id' | 'submittedAt'>): VendorApplication {
    const newApplication: VendorApplication = {
      ...application,
      id: this.generateId(),
      submittedAt: new Date()
    }

    this.vendorApplications.set(newApplication.id, newApplication)
    return newApplication
  }

  reviewApplication(applicationId: string, status: VendorApplication['status'], reviewedBy: string, rejectionReason?: string): boolean {
    const application = this.vendorApplications.get(applicationId)
    if (!application) return false

    application.status = status
    application.reviewedAt = new Date()
    application.reviewedBy = reviewedBy
    if (rejectionReason) {
      application.rejectionReason = rejectionReason
    }

    // If approved, create vendor account
    if (status === 'approved') {
      const vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'> = {
        name: application.businessName,
        description: application.businessDescription,
        logo: '/vendors/default-logo.png',
        banner: '/vendors/default-banner.png',
        email: application.email,
        phone: application.phone,
        address: application.address,
        rating: 0,
        reviewCount: 0,
        totalSales: 0,
        productsCount: 0,
        isVerified: true,
        isFeatured: false,
        categories: application.productCategories,
        tags: [],
        commissionRate: 10, // Default commission rate
        paymentInfo: {
          bankName: 'Pending',
          accountNumber: 'Pending',
          accountName: application.contactPerson
        },
        settings: {
          autoAcceptOrders: true,
          shippingMethods: ['standard', 'express'],
          returnPolicy: '30 days return policy',
          responseTime: 24
        },
        status: 'active',
        socialMedia: application.socialMedia
      }

      this.createVendor(vendor)
    }

    return true
  }

  getPendingApplications(): VendorApplication[] {
    return Array.from(this.vendorApplications.values()).filter(app => app.status === 'pending')
  }

  // Vendor Reviews
  addVendorReview(review: Omit<VendorReview, 'id' | 'createdAt' | 'updatedAt'>): VendorReview {
    const newReview: VendorReview = {
      ...review,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    if (!this.vendorReviews.has(review.vendorId)) {
      this.vendorReviews.set(review.vendorId, [])
    }
    
    this.vendorReviews.get(review.vendorId)!.push(newReview)
    
    // Update vendor rating
    this.updateVendorRating(review.vendorId)
    
    return newReview
  }

  private updateVendorRating(vendorId: string): void {
    const vendor = this.vendors.get(vendorId)
    const reviews = this.vendorReviews.get(vendorId) || []
    
    if (!vendor) return

    if (reviews.length === 0) {
      vendor.rating = 0
      vendor.reviewCount = 0
      return
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    vendor.rating = Math.round((totalRating / reviews.length) * 10) / 10
    vendor.reviewCount = reviews.length
    vendor.updatedAt = new Date()
  }

  getVendorReviews(vendorId: string): VendorReview[] {
    return this.vendorReviews.get(vendorId) || []
  }

  // Vendor Payouts
  createPayout(vendorId: string, period: { start: Date; end: Date }): VendorPayout {
    const vendor = this.vendors.get(vendorId)
    if (!vendor) throw new Error('Vendor not found')

    // Calculate sales and commission for the period
    const totalSales = this.calculateVendorSales(vendorId, period)
    const commission = totalSales * (vendor.commissionRate / 100)
    const payoutAmount = totalSales - commission

    const payout: VendorPayout = {
      id: this.generateId(),
      vendorId,
      period,
      totalSales,
      commission,
      payoutAmount,
      status: 'pending',
      paymentMethod: 'bank_transfer',
      paymentDetails: {
        bankName: vendor.paymentInfo.bankName,
        accountNumber: vendor.paymentInfo.accountNumber
      },
      createdAt: new Date()
    }

    if (!this.vendorPayouts.has(vendorId)) {
      this.vendorPayouts.set(vendorId, [])
    }
    
    this.vendorPayouts.get(vendorId)!.push(payout)
    return payout
  }

  private calculateVendorSales(vendorId: string, period: { start: Date; end: Date }): number {
    // This would typically calculate actual sales from orders
    // For now, return a simulated value
    return Math.floor(Math.random() * 10000) + 1000
  }

  getVendorPayouts(vendorId: string): VendorPayout[] {
    return this.vendorPayouts.get(vendorId) || []
  }

  // Vendor Analytics
  generateVendorAnalytics(vendorId: string, period: { start: Date; end: Date }): VendorAnalytics {
    const vendor = this.vendors.get(vendorId)
    if (!vendor) throw new Error('Vendor not found')

    // Simulate analytics data
    const analytics: VendorAnalytics = {
      vendorId,
      period,
      metrics: {
        totalRevenue: Math.floor(Math.random() * 50000) + 10000,
        totalOrders: Math.floor(Math.random() * 500) + 100,
        averageOrderValue: Math.floor(Math.random() * 200) + 50,
        conversionRate: Math.random() * 5 + 1,
        pageViews: Math.floor(Math.random() * 10000) + 1000,
        uniqueVisitors: Math.floor(Math.random() * 5000) + 500,
        topProducts: [
          {
            productId: 'prod-1',
            productName: 'Sample Product 1',
            sales: Math.floor(Math.random() * 100) + 10,
            revenue: Math.floor(Math.random() * 5000) + 500
          },
          {
            productId: 'prod-2',
            productName: 'Sample Product 2',
            sales: Math.floor(Math.random() * 80) + 5,
            revenue: Math.floor(Math.random() * 3000) + 300
          }
        ],
        salesByCategory: vendor.categories.map(category => ({
          category,
          sales: Math.floor(Math.random() * 100) + 10,
          revenue: Math.floor(Math.random() * 5000) + 500
        })),
        customerRetention: Math.random() * 30 + 60,
        averageRating: vendor.rating,
        responseTime: vendor.settings.responseTime
      }
    }

    if (!this.vendorAnalytics.has(vendorId)) {
      this.vendorAnalytics.set(vendorId, [])
    }
    
    this.vendorAnalytics.get(vendorId)!.push(analytics)
    return analytics
  }

  // Marketplace Analytics
  getMarketplaceAnalytics(): {
    totalVendors: number
    activeVendors: number
    pendingApplications: number
    totalRevenue: number
    totalOrders: number
    topVendors: Array<{
      vendorId: string
      vendorName: string
      revenue: number
      orders: number
      rating: number
    }>
    categoryBreakdown: Array<{
      category: string
      vendorCount: number
      revenue: number
    }>
  } {
    const vendors = this.getAllVendors()
    const activeVendors = this.getActiveVendors()
    const pendingApplications = this.getPendingApplications()

    return {
      totalVendors: vendors.length,
      activeVendors: activeVendors.length,
      pendingApplications: pendingApplications.length,
      totalRevenue: vendors.reduce((sum, vendor) => sum + vendor.totalSales, 0),
      totalOrders: vendors.reduce((sum, vendor) => sum + vendor.totalSales, 0),
      topVendors: vendors
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 10)
        .map(vendor => ({
          vendorId: vendor.id,
          vendorName: vendor.name,
          revenue: vendor.totalSales,
          orders: vendor.totalSales,
          rating: vendor.rating
        })),
      categoryBreakdown: this.calculateCategoryBreakdown()
    }
  }

  private calculateCategoryBreakdown(): Array<{ category: string; vendorCount: number; revenue: number }> {
    const categoryMap = new Map<string, { vendorCount: number; revenue: number }>()

    for (const vendor of this.getAllVendors()) {
      for (const category of vendor.categories) {
        const existing = categoryMap.get(category) || { vendorCount: 0, revenue: 0 }
        categoryMap.set(category, {
          vendorCount: existing.vendorCount + 1,
          revenue: existing.revenue + vendor.totalSales
        })
      }
    }

    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      ...data
    }))
  }

  // Utility Methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private initializeSampleData(): void {
    // Sample vendors
    const sampleVendors: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Fashion Forward',
        description: 'Premium fashion retailer specializing in contemporary clothing and accessories',
        logo: '/vendors/fashion-forward-logo.png',
        banner: '/vendors/fashion-forward-banner.jpg',
        email: 'contact@fashionforward.com',
        phone: '+1-555-0101',
        address: {
          street: '123 Fashion Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        website: 'https://fashionforward.com',
        socialMedia: {
          instagram: '@fashionforward',
          facebook: 'fashionforward'
        },
        rating: 4.8,
        reviewCount: 234,
        totalSales: 125000,
        productsCount: 156,
        isVerified: true,
        isFeatured: true,
        categories: ['clothing', 'accessories'],
        tags: ['premium', 'trendy', 'quality'],
        commissionRate: 12,
        paymentInfo: {
          bankName: 'Chase Bank',
          accountNumber: '****1234',
          accountName: 'Fashion Forward Inc'
        },
        settings: {
          autoAcceptOrders: true,
          shippingMethods: ['standard', 'express', 'overnight'],
          returnPolicy: '30-day return policy',
          responseTime: 12
        },
        status: 'active'
      },
      {
        name: 'Tech Gadgets Plus',
        description: 'Leading electronics retailer with the latest gadgets and tech accessories',
        logo: '/vendors/tech-gadgets-logo.png',
        banner: '/vendors/tech-gadgets-banner.jpg',
        email: 'sales@techgadgetsplus.com',
        phone: '+1-555-0102',
        address: {
          street: '456 Tech Boulevard',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'USA'
        },
        website: 'https://techgadgetsplus.com',
        socialMedia: {
          twitter: '@techgadgetsplus',
          linkedin: 'techgadgetsplus'
        },
        rating: 4.6,
        reviewCount: 189,
        totalSales: 98000,
        productsCount: 89,
        isVerified: true,
        isFeatured: true,
        categories: ['electronics', 'accessories'],
        tags: ['technology', 'innovative', 'reliable'],
        commissionRate: 10,
        paymentInfo: {
          bankName: 'Bank of America',
          accountNumber: '****5678',
          accountName: 'Tech Gadgets Plus LLC'
        },
        settings: {
          autoAcceptOrders: false,
          shippingMethods: ['standard', 'express'],
          returnPolicy: '14-day return policy',
          responseTime: 8
        },
        status: 'active'
      },
      {
        name: 'Home Essentials',
        description: 'Your one-stop shop for quality home goods and lifestyle products',
        logo: '/vendors/home-essentials-logo.png',
        banner: '/vendors/home-essentials-banner.jpg',
        email: 'info@homeessentials.com',
        phone: '+1-555-0103',
        address: {
          street: '789 Home Street',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        socialMedia: {
          facebook: 'homeessentials',
          instagram: '@homeessentials'
        },
        rating: 4.5,
        reviewCount: 156,
        totalSales: 76000,
        productsCount: 234,
        isVerified: true,
        isFeatured: false,
        categories: ['home', 'lifestyle'],
        tags: ['quality', 'affordable', 'practical'],
        commissionRate: 8,
        paymentInfo: {
          bankName: 'Wells Fargo',
          accountNumber: '****9012',
          accountName: 'Home Essentials Co'
        },
        settings: {
          autoAcceptOrders: true,
          shippingMethods: ['standard', 'express'],
          returnPolicy: '21-day return policy',
          responseTime: 16
        },
        status: 'active'
      }
    ]

    for (const vendor of sampleVendors) {
      this.createVendor(vendor)
    }

    // Sample vendor reviews
    const sampleReviews: Omit<VendorReview, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        vendorId: this.getAllVendors()[0].id,
        customerId: 'customer-1',
        customerName: 'John Doe',
        customerAvatar: '/customers/john.jpg',
        rating: 5,
        title: 'Excellent quality and service!',
        content: 'Amazing products and fast shipping. Will definitely buy again!',
        helpfulVotes: 12,
        isVerified: true
      },
      {
        vendorId: this.getAllVendors()[0].id,
        customerId: 'customer-2',
        customerName: 'Jane Smith',
        rating: 4,
        title: 'Good products, minor shipping delay',
        content: 'Products are great quality, but shipping took a bit longer than expected.',
        helpfulVotes: 5,
        isVerified: true
      }
    ]

    for (const review of sampleReviews) {
      this.addVendorReview(review)
    }
  }
}
