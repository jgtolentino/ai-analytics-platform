import React from 'react';
import { Header } from './Header.jsx';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNavigation = true, 
  showHeader = true 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      {showHeader && (
        <Header 
          onSearch={(term) => console.log('Search:', term)}
          onClearAll={() => console.log('Clear all filters')}
          hasActiveFilters={false}
        />
      )}

      {/* Navigation */}
      {showNavigation && <Navigation />}

      {/* Main Content */}
      {children}
    </div>
  );
};

export default Layout;