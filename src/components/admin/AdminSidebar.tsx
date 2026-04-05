"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Menu, 
  X, 
  TrendingUp,
  Store,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface MenuItem {
  name: string;
  href: string;
  icon: any;
  description: string;
  submenu?: Array<{
    name: string;
    href: string;
    description: string;
  }>;
}

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview and analytics'
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
    description: 'Manage products',
    submenu: [
      {
        name: 'Pending Products',
        href: '/admin/products',
        description: 'View pending products'
      },
      {
        name: 'Marketplace Products',
        href: '/admin/products?tab=marketplace',
        description: 'Manage marketplace products'
      },
      {
        name: 'Tambah Produk',
        href: '/admin/add-product',
        description: 'Add new product'
      }
    ]
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'View and manage orders'
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
    description: 'Customer management'
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: TrendingUp,
    description: 'Sales and performance'
  },
  {
    name: 'Marketplace',
    href: '/admin/marketplace',
    icon: Store,
    description: 'Marketplace settings'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System settings'
  }
];

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSubmenu = (itemName: string) => {
    console.log('Toggling submenu:', itemName);
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isSubmenuActive = (submenu: MenuItem['submenu']) => {
    return submenu?.some(item => pathname === item.href) || false;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 lg:z-40
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-64'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedItems.includes(item.name);
            const hasActiveSubmenu = hasSubmenu && isSubmenuActive(item.submenu);
            const Icon = item.icon;
            
            return (
              <div key={item.href}>
                <button
                  onClick={() => hasSubmenu ? toggleSubmenu(item.name) : null}
                  className={`
                    w-full group flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${isActive || hasActiveSubmenu
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`
                    w-5 h-5 flex-shrink-0
                    ${isActive || hasActiveSubmenu ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'}
                  `} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.name}</div>
                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                  </div>
                  {hasSubmenu ? (
                    <ChevronDown className={`
                      w-4 h-4 flex-shrink-0 transition-transform duration-200
                      ${isExpanded ? 'rotate-180' : ''}
                      ${isActive || hasActiveSubmenu ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'}
                    `} />
                  ) : (
                    <ChevronRight className={`
                      w-4 h-4 flex-shrink-0
                      ${isActive || hasActiveSubmenu ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'}
                    `} />
                  )}
                </button>
                
                {/* Submenu */}
                {hasSubmenu && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          onClick={() => console.log('Clicked:', subItem.href)}
                          className={`
                            block group flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                            ${isSubActive
                              ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-gray-400" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{subItem.name}</div>
                            <div className="text-xs text-gray-400 truncate">{subItem.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>Admin Dashboard v1.0</p>
            <p className="mt-1">© 2024 E-Commerce</p>
          </div>
        </div>
      </div>
    </>
  );
}
