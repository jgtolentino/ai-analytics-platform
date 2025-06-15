// 404.tsx - Custom 404 page to handle missing pages gracefully
// Ensures users never see default Next.js 404
// Version: 1.0.0

import React from 'react';
import Head from 'next/head';

export default function Custom404() {
  const suggestedPages = [
    { name: 'Scout Dashboard', href: '/', description: 'View transaction analytics and insights' },
    { name: 'Data Explorer', href: '/data', description: 'Browse and filter retail data' },
    { name: 'Reports', href: '/reports', description: 'Generate and download reports' },
    { name: 'Analytics', href: '/analytics', description: 'Deep dive into performance metrics' },
    { name: 'Settings', href: '/settings', description: 'Configure dashboard preferences' },
    { name: 'Help', href: '/help', description: 'Documentation and support resources' }
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get('search') as string;
    
    if (searchTerm.trim()) {
      // Simple search redirect logic
      if (searchTerm.toLowerCase().includes('transaction')) {
        window.location.href = '/';
      } else if (searchTerm.toLowerCase().includes('report')) {
        window.location.href = '/reports';
      } else if (searchTerm.toLowerCase().includes('data')) {
        window.location.href = '/data';
      } else {
        window.location.href = `/?search=${encodeURIComponent(searchTerm)}`;
      }
    }
  };

  return (
    <>
      <Head>
        <title>Page Not Found - Scout Analytics</title>
        <meta name="description" content="The page you're looking for doesn't exist. Explore Scout Analytics dashboard and data insights." />
        <meta name="robots" content="noindex" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <a href="/" className="text-xl font-bold text-blue-600">
                📊 Scout Analytics
              </a>
              <nav className="ml-8 hidden md:flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                <a href="/analytics" className="text-gray-600 hover:text-gray-900">Analytics</a>
                <a href="/reports" className="text-gray-600 hover:text-gray-900">Reports</a>
                <a href="/help" className="text-gray-600 hover:text-gray-900">Help</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* 404 Illustration */}
            <div className="text-8xl mb-8">🔍</div>
            
            {/* Error Message */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Sorry, we couldn't find the page you're looking for. 
              It might have been moved, deleted, or you entered the wrong URL.
            </p>

            {/* Search Box */}
            <div className="max-w-md mx-auto mb-12">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  name="search"
                  placeholder="Search for pages, data, or reports..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🏠 Go to Dashboard
                </a>
                <button
                  onClick={() => window.history.back()}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  ← Go Back
                </button>
                <a
                  href="/help"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  📚 Get Help
                </a>
              </div>
            </div>
          </div>

          {/* Suggested Pages */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Popular Pages
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {suggestedPages.map((page, index) => (
                <a
                  key={index}
                  href={page.href}
                  className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {page.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {page.description}
                  </p>
                  <div className="mt-4 text-blue-600 text-sm font-medium">
                    Visit page →
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-16 text-center">
            <div className="bg-blue-50 rounded-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Still can't find what you're looking for?
              </h3>
              <p className="text-gray-600 mb-6">
                Our support team is here to help you navigate Scout Analytics 
                and find the data insights you need.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/help"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  📖 Browse Documentation
                </a>
                <a
                  href="/support"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  💬 Contact Support
                </a>
                <a
                  href="/status"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  📊 System Status
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              Error 404 • Page not found • {new Date().toLocaleDateString()}
            </p>
            <p className="mt-2">
              Scout Analytics Dashboard • TBWA AI Analytics Platform
            </p>
          </div>
        </div>
      </div>
    </>
  );
}