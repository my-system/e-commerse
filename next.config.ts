import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.3'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/photo-*',
      },
    ],
  },
  // Increase body size limit for Server Actions to handle large image uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
}

export default nextConfig
