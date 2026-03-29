"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Store, AlertCircle } from 'lucide-react';

export default function AdminMarketplace() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn || user?.role !== 'admin') {
        // Don't redirect, show access denied message
        return;
      }
    }
  }, [isLoggedIn, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isLoggedIn || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Access Denied</p>
          <p className="text-gray-600 mt-2">Admin role required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Marketplace Control</h1>
          <p className="text-gray-600 mt-1">Manage marketplace settings and configurations</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-8 h-8 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Marketplace Settings</h2>
          </div>
          
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Marketplace Control</h3>
            <p className="text-gray-600">Marketplace management features coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
