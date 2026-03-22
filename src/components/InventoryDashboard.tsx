'use client'

import React, { useState } from 'react'
import { useInventoryManager } from '@/hooks/useInventory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Package, TrendingUp, Users, ShoppingCart, DollarSign, AlertCircle } from 'lucide-react'

export function InventoryDashboard() {
  const { products, alerts, suppliers, purchaseOrders, getInventoryReport, getLowStockProducts, getOutOfStockProducts, getStockValue } = useInventoryManager()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const report = getInventoryReport()
  const lowStockProducts = getLowStockProducts()
  const outOfStockProducts = getOutOfStockProducts()
  const stockValue = getStockValue()

  const stats = [
    {
      title: 'Total Products',
      value: report.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Stock Value',
      value: `$${stockValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts.length,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your product inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Export Report
          </Button>
          <Button>
            Add Product
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
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Active Alerts
            </CardTitle>
            <CardDescription>
              Inventory alerts that require your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <div>
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
            {alerts.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="outline">
                  View All Alerts ({alerts.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Low Stock Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Low Stock Products
            </CardTitle>
            <CardDescription>
              Products that need to be restocked soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-yellow-600">{product.available}</p>
                    <p className="text-sm text-gray-600">available</p>
                  </div>
                </div>
              ))}
            </div>
            {lowStockProducts.length > 5 && (
              <div className="mt-4 text-center">
                <Button variant="outline">
                  View All ({lowStockProducts.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Categories Overview
            </CardTitle>
            <CardDescription>
              Product distribution by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-600">{category.count} products</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${category.value.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">value</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchase Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            Recent Purchase Orders
          </CardTitle>
          <CardDescription>
            Latest purchase orders from suppliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {purchaseOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} items • ${order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={
                    order.status === 'received' ? 'bg-green-100 text-green-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {order.status}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {purchaseOrders.length > 5 && (
            <div className="mt-4 text-center">
              <Button variant="outline">
                View All Orders
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
