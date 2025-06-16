// Stable Layout from v2.1 with Cruip enhancements for v3.2.0
'use client';

import React, { useState } from 'react';
import { ErrorBoundary } from '../../app/components/ErrorBoundary';
import { SafeComponent } from '../../app/components/ErrorBoundary';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: boolean;
}

const sidebarItems = [
  { id: 'overview', label: 'Overview', icon: '📊', href: '/' },
  { id: 'products', label: 'Products', icon: '📦', href: '/products' },
  { id: 'customers', label: 'Customers', icon: '👥', href: '/customers' },
  { id: 'analytics', label: 'Analytics', icon: '📈', href: '/analytics' },
  { id: 'ai-insights', label: 'AI Insights', icon: '🤖', href: '/ai-insights' },
  { id: 'settings', label: 'Settings', icon: '⚙️', href: '/settings' }
];

export function StableLayout({ children, sidebar = true }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('overview');

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        {sidebar && (
          <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300`}>
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  {sidebarOpen && (
                    <span className="font-semibold text-gray-900">Scout Analytics</span>
                  )}
                </div>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} 
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {sidebarItems.map((item) => (
                    <li key={item.id}>
                      <SafeComponent name={`nav-${item.id}`}>
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveItem(item.id);
                          }}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                            ${activeItem === item.id 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
                          `}
                        >
                          <span className="text-lg">{item.icon}</span>
                          {sidebarOpen && (
                            <span className="text-sm font-medium">{item.label}</span>
                          )}
                        </a>
                      </SafeComponent>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Version Badge */}
              {sidebarOpen && (
                <div className="p-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Version</span>
                    <span className="text-xs font-medium text-gray-700">v3.2.0</span>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  );
}

// Header component for pages
export function PageHeader({ 
  title, 
  subtitle, 
  actions 
}: { 
  title: string; 
  subtitle?: string; 
  actions?: React.ReactNode;
}) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}