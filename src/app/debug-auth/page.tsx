"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function DebugAuth() {
  const { user, isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    console.log('=== AUTH DEBUG ===');
    console.log('AuthContext:', { user, isLoggedIn, isLoading });
    console.log('localStorage:', {
      user: localStorage.getItem('user'),
      isLoggedIn: localStorage.getItem('isLoggedIn'),
      userRole: localStorage.getItem('userRole')
    });
    console.log('cookies:', document.cookie);
  }, [user, isLoggedIn, isLoading]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Auth Debug Information</h1>
        
        <div className="bg-white rounded-lg p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">AuthContext State</h2>
          <div className="space-y-2">
            <p><strong>isLoggedIn:</strong> {isLoggedIn.toString()}</p>
            <p><strong>isLoading:</strong> {isLoading.toString()}</p>
            <p><strong>user:</strong> {JSON.stringify(user, null, 2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">SidebarContext State</h2>
          <div className="space-y-2">
            <p><strong>userRole:</strong> admin (always set)</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">LocalStorage</h2>
          <div className="space-y-2">
            <p><strong>user:</strong> {localStorage.getItem('user')}</p>
            <p><strong>isLoggedIn:</strong> {localStorage.getItem('isLoggedIn')}</p>
            <p><strong>userRole:</strong> {localStorage.getItem('userRole')}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Cookies</h2>
          <div className="space-y-2">
            <p><strong>document.cookie:</strong> {document.cookie}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mt-4">
          <h2 className="text-lg font-semibold mb-4">Test Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => {
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user', JSON.stringify({
                  name: 'Admin User',
                  email: 'admin@example.com',
                  phone: '123456789',
                  role: 'admin'
                }));
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Force Set Admin Role
            </button>
            
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-4"
            >
              Clear All Storage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
