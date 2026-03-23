'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ShoppingCart, User, Search, Home, ShoppingBag, Heart, Settings, TrendingUp, Package, Store, Info, LogOut } from 'lucide-react'
import { MobileSearch } from './MobileSearch'

export function MobileNavigation({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: ShoppingBag, label: 'Shop', href: '/shop' },
    { icon: ShoppingCart, label: 'Cart', href: '/cart' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: User, label: 'Account', href: '/account' },
  ]

  return (
    <>
      {/* Mobile Header */}
      <header className={`md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-gray-900">DEMO WEB</span>
              <span className="text-xs font-light text-gray-500">E-COMMERCE</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Modern Sidebar */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
                        e.preventDefault()
                        setIsSidebarOpen(false)
                      }}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center gap-3">
                {/* Logo */}
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-blue-100 font-bold text-lg">D</span>
                </div>
                
                {/* Brand Info */}
                <div>
                  <h1 className="text-xl font-bold text-white">DEMO WEB</h1>
                  <p className="text-blue-100 text-sm">E-COMMERCE</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => {
                        e.preventDefault()
                        setIsSidebarOpen(false)
                      }}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* User Profile Section */}
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-600">john@example.com</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="py-4">
                {/* Menu List */}
                <div className="space-y-1">
                  {/* Beranda */}
                  <div
                    onClick={() => {
                      setIsSidebarOpen(false)
                      window.location.href = '/'
                    }}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Home className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">Beranda</span>
                  </div>
                  
                  {/* Belanja */}
                  <div
                    onClick={() => {
                      setIsSidebarOpen(false)
                      window.location.href = '/shop'
                    }}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">Belanja</span>
                  </div>
                  
                  {/* Keranjang */}
                  <div
                    onClick={() => {
                      setIsSidebarOpen(false)
                      window.location.href = '/cart'
                    }}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">Keranjang</span>
                  </div>
                  
                  {/* Akun */}
                  <div
                    onClick={() => {
                      setIsSidebarOpen(false)
                      window.location.href = '/account'
                    }}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">Akun</span>
                  </div>
                  
                  {/* Marketplace */}
                  <div
                    onClick={() => {
                      setIsSidebarOpen(false)
                      window.location.href = '/marketplace'
                    }}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Store className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">Marketplace</span>
                  </div>
                  
                  {/* Tentang */}
                  <div
                    onClick={() => {
                      setIsSidebarOpen(false)
                      window.location.href = '/tentang'
                    }}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Info className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">Tentang</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  // Handle logout
                  console.log('Logout clicked')
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="flex items-center justify-around py-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <item.icon className="w-5 h-5 text-gray-700" />
              <span className="text-xs text-gray-600">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Search Modal */}
      <MobileSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Main Content */}
      <div className="md:hidden pt-16 pb-20 bg-gray-50">
        {children}
      </div>
    </>
  )
}

// Mobile Grid Layout Component
export function MobileGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:hidden pt-16 pb-20">
      {children}
    </div>
  )
}

// Mobile Product Card
export function MobileProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative aspect-square">
        <img
          src={product.image || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
            <Heart className="w-4 h-4 text-gray-700" />
          </button>
          <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
            <ShoppingCart className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Badge */}
        {product.isNew && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
            New
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{product.description}</p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {product.discount && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < (product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-600">({product.reviews || 23})</span>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  )
}
