/** @type {import('next').NextConfig} */
const nextConfig = {
  // Direct redirect from root to dashboard - bypasses landing page completely
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false, // Use 307 redirect to avoid caching
      },
    ]
  },
  
  // Additional security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
  
  // Image optimization
  images: {
    domains: ['vercel.app'],
  },
  
  // Disable x-powered-by header
  poweredByHeader: false,
}

module.exports = nextConfig;