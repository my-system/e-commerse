'use client'

import { MarketplaceDashboard } from '@/components/MarketplaceDashboard'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { MobileNavigation } from '@/components/MobileNavigation'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Version */}
      <div className="hidden md:block">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <MarketplaceDashboard />
        </div>
        <Footer />
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <MobileNavigation>
          <div className="px-4 py-8">
            <MarketplaceDashboard />
          </div>
        </MobileNavigation>
      </div>
    </div>
  )
}
