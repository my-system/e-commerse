"use client";

import Link from 'next/link';

export default function TestNav() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Test Navigation</h1>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Next.js Link Tests:</h2>
        
        <div className="space-y-2">
          <Link href="/admin/products" className="block p-2 bg-blue-100 hover:bg-blue-200 rounded">
            → Test /admin/products (Next.js Link)
          </Link>
          
          <Link href="/admin/database" className="block p-2 bg-blue-100 hover:bg-blue-200 rounded">
            → Test /admin/database (Next.js Link)
          </Link>
        </div>
        
        <h2 className="text-lg font-semibold mt-6">HTML Anchor Tests:</h2>
        
        <div className="space-y-2">
          <a href="/admin/products" className="block p-2 bg-green-100 hover:bg-green-200 rounded">
            → Test /admin/products (HTML Anchor)
          </a>
          
          <a href="/admin/database" className="block p-2 bg-green-100 hover:bg-green-200 rounded">
            → Test /admin/database (HTML Anchor)
          </a>
        </div>
        
        <h2 className="text-lg font-semibold mt-6">JavaScript Navigation Tests:</h2>
        
        <div className="space-y-2">
          <button 
            onClick={() => window.location.href = '/admin/products'}
            className="block p-2 bg-purple-100 hover:bg-purple-200 rounded w-full text-left"
          >
            → Test /admin/products (window.location)
          </button>
          
          <button 
            onClick={() => window.location.href = '/admin/database'}
            className="block p-2 bg-purple-100 hover:bg-purple-200 rounded w-full text-left"
          >
            → Test /admin/database (window.location)
          </button>
        </div>
        
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Current URL:</h2>
          <p className="text-sm text-gray-600" id="current-url">Loading...</p>
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('current-url').textContent = window.location.href;
          
          // Log all navigation attempts
          document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('click', (e) => {
              console.log('Navigation clicked:', e.target.textContent);
            });
          });
        `
      }} />
    </div>
  );
}
