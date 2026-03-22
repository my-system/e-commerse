'use client'

import React, { useState } from 'react'
import { useMarketplaceManager } from '@/hooks/useMarketplace'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Store, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Star, 
  Package, 
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Filter,
  Search
} from 'lucide-react'

export function MarketplaceDashboard() {
  const { vendors, applications, getMarketplaceAnalytics, searchVendors, getActiveVendors, getFeaturedVendors } = useMarketplaceManager()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null)

  const analytics = getMarketplaceAnalytics()
  const activeVendors = getActiveVendors()
  const featuredVendors = getFeaturedVendors()
  
  const filteredVendors = React.useMemo(() => {
    let filtered = vendors

    if (searchQuery) {
      filtered = searchVendors(searchQuery)
    }

    switch (selectedFilter) {
      case 'active':
        filtered = filtered.filter(v => v.status === 'active')
        break
      case 'featured':
        filtered = filtered.filter(v => v.isFeatured)
        break
      case 'verified':
        filtered = filtered.filter(v => v.isVerified)
        break
      case 'pending':
        filtered = filtered.filter(v => v.status === 'pending')
        break
    }

    return filtered
  }, [vendors, searchQuery, selectedFilter, searchVendors])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'needs_more_info': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = [
    {
      title: 'Total Vendors',
      value: analytics.totalVendors,
      icon: Store,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Vendors',
      value: analytics.activeVendors,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Pending Applications',
      value: analytics.pendingApplications,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '-3%',
      changeType: 'negative'
    },
    {
      title: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+23%',
      changeType: 'positive'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Multi-vendor Marketplace</h1>
          <p className="text-gray-600 mt-1">Manage vendors, applications, and marketplace analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Export Report
          </Button>
          <Button>
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-3 h-3" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Applications */}
      {applications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Pending Applications ({applications.length})
            </CardTitle>
            <CardDescription>
              Vendor applications waiting for review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applications.slice(0, 3).map((application) => (
                <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{application.businessName}</p>
                      <p className="text-sm text-gray-600">{application.contactPerson}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getApplicationStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {applications.length > 3 && (
              <div className="mt-4 text-center">
                <Button variant="outline">
                  View All Applications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Featured Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Featured Vendors
            </CardTitle>
            <CardDescription>
              Top-performing vendors on the marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {featuredVendors.slice(0, 5).map((vendor) => (
                <div key={vendor.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={vendor.logo}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vendor.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{vendor.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{vendor.productsCount} products</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${vendor.totalSales.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">total sales</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Categories Overview
            </CardTitle>
            <CardDescription>
              Vendor distribution by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.categoryBreakdown.slice(0, 5).map((category) => (
                <div key={category.category} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.category}</p>
                      <p className="text-sm text-gray-600">{category.vendorCount} vendors</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${category.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Vendors</CardTitle>
              <CardDescription>
                Manage and monitor all marketplace vendors
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Vendors</option>
                <option value="active">Active</option>
                <option value="featured">Featured</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-900">Vendor</th>
                  <th className="text-left p-3 font-medium text-gray-900">Status</th>
                  <th className="text-left p-3 font-medium text-gray-900">Rating</th>
                  <th className="text-left p-3 font-medium text-gray-900">Products</th>
                  <th className="text-left p-3 font-medium text-gray-900">Sales</th>
                  <th className="text-left p-3 font-medium text-gray-900">Commission</th>
                  <th className="text-left p-3 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.slice(0, 10).map((vendor) => (
                  <tr key={vendor.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={vendor.logo}
                            alt={vendor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{vendor.name}</p>
                          <p className="text-sm text-gray-600">{vendor.categories.join(', ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(vendor.status)}>
                        {vendor.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{vendor.rating}</span>
                        <span className="text-gray-600">({vendor.reviewCount})</span>
                      </div>
                    </td>
                    <td className="p-3">{vendor.productsCount}</td>
                    <td className="p-3">${vendor.totalSales.toLocaleString()}</td>
                    <td className="p-3">{vendor.commissionRate}%</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredVendors.length > 10 && (
            <div className="mt-4 text-center">
              <Button variant="outline">
                Load More Vendors
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
