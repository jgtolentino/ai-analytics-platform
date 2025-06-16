/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better error handling
  reactStrictMode: true,
  
  // Optimize for production
  swcMinify: true,
  
  // Output configuration
  output: 'standalone',
  
  // Environment variables
  env: {
    NEXT_PUBLIC_VERSION: '3.2.0',
    NEXT_PUBLIC_PLATFORM_NAME: 'Scout Analytics'
  },
  
  // Experimental features
  experimental: {
    // App directory is now stable in Next.js 14
  },
  
  // Image optimization
  images: {
    domains: ['localhost', 'scout-mvp.vercel.app'],
    unoptimized: true
  },
  
  // Disable X-Powered-By header
  poweredByHeader: false,
  
  // Development configuration
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-left'
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;