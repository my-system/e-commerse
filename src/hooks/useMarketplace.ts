'use client'

import { useState, useEffect } from 'react'
import { MarketplaceManager, Vendor, VendorApplication, VendorReview, VendorPayout } from '@/lib/marketplace'

export function useMarketplaceManager() {
  const [marketplaceManager] = useState(() => new MarketplaceManager())
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [applications, setApplications] = useState<VendorApplication[]>([])
  const [reviews, setReviews] = useState<VendorReview[]>([])
  const [payouts, setPayouts] = useState<VendorPayout[]>([])

  useEffect(() => {
    setVendors(marketplaceManager.getAllVendors())
    setApplications(marketplaceManager.getPendingApplications())
    // Reviews and payouts would be loaded based on selected vendor
  }, [marketplaceManager])

  const refreshData = () => {
    setVendors(marketplaceManager.getAllVendors())
    setApplications(marketplaceManager.getPendingApplications())
  }

  return {
    marketplaceManager,
    vendors,
    applications,
    reviews,
    payouts,
    refreshData,
    
    // Vendor operations
    createVendor: (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = marketplaceManager.createVendor(vendor)
      refreshData()
      return result
    },
    
    updateVendor: (id: string, updates: Partial<Vendor>) => {
      const result = marketplaceManager.updateVendor(id, updates)
      refreshData()
      return result
    },
    
    getVendor: (id: string) => marketplaceManager.getVendor(id),
    getActiveVendors: () => marketplaceManager.getActiveVendors(),
    getFeaturedVendors: () => marketplaceManager.getFeaturedVendors(),
    searchVendors: (query: string) => marketplaceManager.searchVendors(query),
    
    // Application operations
    submitApplication: (application: Omit<VendorApplication, 'id' | 'submittedAt'>) => {
      const result = marketplaceManager.submitApplication(application)
      refreshData()
      return result
    },
    
    reviewApplication: (applicationId: string, status: VendorApplication['status'], reviewedBy: string, rejectionReason?: string) => {
      const result = marketplaceManager.reviewApplication(applicationId, status, reviewedBy, rejectionReason)
      refreshData()
      return result
    },
    
    // Review operations
    addVendorReview: (review: Omit<VendorReview, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = marketplaceManager.addVendorReview(review)
      refreshData()
      return result
    },
    
    getVendorReviews: (vendorId: string) => marketplaceManager.getVendorReviews(vendorId),
    
    // Analytics
    getMarketplaceAnalytics: () => marketplaceManager.getMarketplaceAnalytics(),
    generateVendorAnalytics: (vendorId: string, period: { start: Date; end: Date }) => 
      marketplaceManager.generateVendorAnalytics(vendorId, period)
  }
}
