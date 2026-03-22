'use client'

import { useState, useEffect } from 'react'
import { InventoryManager, Product, InventoryAlert, Supplier, PurchaseOrder, PurchaseOrderItem, InventoryTransaction } from '@/lib/inventory'

export function useInventoryManager() {
  const [inventoryManager] = useState(() => new InventoryManager())
  const [products, setProducts] = useState<Product[]>([])
  const [alerts, setAlerts] = useState<InventoryAlert[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])

  useEffect(() => {
    setProducts(inventoryManager.getAllProducts())
    setAlerts(inventoryManager.getActiveAlerts())
    setSuppliers(inventoryManager.getAllSuppliers())
    setPurchaseOrders(inventoryManager.getAllPurchaseOrders())
  }, [inventoryManager])

  const refreshData = () => {
    setProducts(inventoryManager.getAllProducts())
    setAlerts(inventoryManager.getActiveAlerts())
    setSuppliers(inventoryManager.getAllSuppliers())
    setPurchaseOrders(inventoryManager.getAllPurchaseOrders())
  }

  return {
    inventoryManager,
    products,
    alerts,
    suppliers,
    purchaseOrders,
    refreshData,
    
    // Product operations
    addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = inventoryManager.addProduct(product)
      refreshData()
      return result
    },
    
    updateProduct: (id: string, updates: Partial<Product>) => {
      const result = inventoryManager.updateProduct(id, updates)
      refreshData()
      return result
    },
    
    deleteProduct: (id: string) => {
      const result = inventoryManager.deleteProduct(id)
      refreshData()
      return result
    },
    
    // Stock operations
    updateStock: (productId: string, quantity: number, type: InventoryTransaction['type'], reason: string, performedBy: string) => {
      const result = inventoryManager.updateStock(productId, quantity, type, reason, performedBy)
      refreshData()
      return result
    },
    
    // Alert operations
    resolveAlert: (alertId: string) => {
      const result = inventoryManager.resolveAlert(alertId)
      refreshData()
      return result
    },
    
    // Supplier operations
    addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = inventoryManager.addSupplier(supplier)
      refreshData()
      return result
    },
    
    // Purchase order operations
    createPurchaseOrder: (supplierId: string, items: Omit<PurchaseOrderItem, 'totalPrice' | 'receivedQuantity'>[]) => {
      const result = inventoryManager.createPurchaseOrder(supplierId, items)
      refreshData()
      return result
    },
    
    // Analytics
    getInventoryReport: () => inventoryManager.generateInventoryReport(),
    getLowStockProducts: () => inventoryManager.getLowStockProducts(),
    getOutOfStockProducts: () => inventoryManager.getOutOfStockProducts(),
    getStockValue: () => inventoryManager.getStockValue()
  }
}
