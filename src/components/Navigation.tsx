// Navigation.tsx - Dashboard Navigation Component
// Provides navigation between the 4 main dashboard pages
// Version: 1.0.0

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavigationItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'overview',
    title: 'Overview',
    subtitle: 'Executive Overview',
    href: '/',
    icon: '📊',
    badge: '4 Charts'
  },
  {
    id: 'trends',
    title: 'Trends',
    subtitle: 'Transaction Trends',
    href: '/trends',
    icon: '📈',
    badge: 'Time Series'
  },
  {
    id: 'products',
    title: 'Products',
    subtitle: 'Product Mix & SKU',
    href: '/products',
    icon: '📦',
    badge: 'Analytics'
  },
  {
    id: 'ai-assist',
    title: 'RetailBot',
    subtitle: 'AI Insights',
    href: '/ai-assist',
    icon: '🤖',
    badge: 'AI Powered'
  }
];

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = '' }: NavigationProps) {
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/' && router.asPath === '/') {
      return true;
    }
    return href !== '/' && router.asPath.startsWith(href);
  };

  return (
    <nav className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-3 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  active
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <div className="flex flex-col">
                  <span className="font-semibold">{item.title}</span>
                  <span className="text-xs text-gray-400">{item.subtitle}</span>
                </div>
                {item.badge && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    active
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Mobile Navigation - Responsive Alternative */}
      <div className="sm:hidden">
        <div className="flex overflow-x-auto px-4 py-2 space-x-4">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            
            return (
              <Link
                key={`mobile-${item.id}`}
                href={item.href}
                className={`flex flex-col items-center p-3 rounded-lg min-w-0 flex-shrink-0 transition-colors duration-200 ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium text-center">{item.title}</span>
                {item.badge && (
                  <span className={`mt-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                    active
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

// Breadcrumb Navigation for Sub-sections
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    active?: boolean;
  }>;
  className?: string;
}

function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.href && !item.active ? (
              <Link
                href={item.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`text-sm font-medium ${
                  item.active ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Quick Navigation Stats (optional enhancement)
interface NavigationStatsProps {
  stats: Array<{
    label: string;
    value: string;
    change?: string;
    changeType?: 'increase' | 'decrease' | 'neutral';
  }>;
  className?: string;
}

function NavigationStats({ stats, className = '' }: NavigationStatsProps) {
  return (
    <div className={`bg-gray-50 border-t border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between overflow-x-auto">
          <div className="flex space-x-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                <div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                  <div className="text-sm font-semibold text-gray-900">{stat.value}</div>
                </div>
                {stat.change && (
                  <div className={`text-xs ${
                    stat.changeType === 'increase' ? 'text-green-600' :
                    stat.changeType === 'decrease' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export components
export { Breadcrumb, NavigationStats };