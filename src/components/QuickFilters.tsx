// QuickFilters.tsx - Quick Filter Component for Transaction Trends
// Provides quick access to Top Performers, New Products, Trending filters
// Version: 1.0.0

import React, { useState } from 'react';

interface QuickFilter {
  id: string;
  label: string;
  icon: string;
  description: string;
  count?: number;
  isActive?: boolean;
}

interface QuickFiltersProps {
  onFilterChange: (filterId: string, isActive: boolean) => void;
  className?: string;
}

export default function QuickFilters({ 
  onFilterChange, 
  className = "" 
}: QuickFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const quickFilters: QuickFilter[] = [
    {
      id: 'top_performers',
      label: 'Top Performers',
      icon: '🏆',
      description: 'Best selling products this month',
      count: 247
    },
    {
      id: 'new_products',
      label: 'New Products',
      icon: '✨',
      description: 'Launched in last 30 days',
      count: 18
    },
    {
      id: 'trending',
      label: 'Trending',
      icon: '📈',
      description: 'Growing popularity',
      count: 89
    },
    {
      id: 'promoted',
      label: 'Promoted',
      icon: '🎯',
      description: 'Currently on promotion',
      count: 156
    },
    {
      id: 'seasonal',
      label: 'Seasonal',
      icon: '🌟',
      description: 'Season-specific items',
      count: 72
    },
    {
      id: 'high_margin',
      label: 'High Margin',
      icon: '💎',
      description: 'Premium products',
      count: 134
    }
  ];

  const handleFilterToggle = (filterId: string) => {
    const newActiveFilters = new Set(activeFilters);
    const isCurrentlyActive = activeFilters.has(filterId);
    
    if (isCurrentlyActive) {
      newActiveFilters.delete(filterId);
    } else {
      newActiveFilters.add(filterId);
    }
    
    setActiveFilters(newActiveFilters);
    onFilterChange(filterId, !isCurrentlyActive);
  };

  const clearAllFilters = () => {
    activeFilters.forEach(filterId => {
      onFilterChange(filterId, false);
    });
    setActiveFilters(new Set());
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PH').format(num);
  };

  return (
    <div className={`quick-filters bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Quick Filters</h3>
          <p className="text-xs text-gray-600">Filter by popular categories</p>
        </div>
        
        {activeFilters.size > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-red-600 hover:text-red-800 font-medium"
          >
            Clear All ({activeFilters.size})
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => {
          const isActive = activeFilters.has(filter.id);
          
          return (
            <button
              key={filter.id}
              onClick={() => handleFilterToggle(filter.id)}
              className={`
                inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200
                ${isActive
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md transform scale-105'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }
              `}
              title={filter.description}
            >
              <span className="mr-1.5">{filter.icon}</span>
              <span>{filter.label}</span>
              {filter.count && (
                <span className={`
                  ml-1.5 px-1.5 py-0.5 rounded text-xs font-bold
                  ${isActive
                    ? 'bg-blue-400 text-blue-100'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {formatNumber(filter.count)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Filters Summary */}
      {activeFilters.size > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-800">
              <span className="font-medium">{activeFilters.size} filter{activeFilters.size > 1 ? 's' : ''} active</span>
              <span className="mx-2">•</span>
              <span>
                Showing {quickFilters
                  .filter(f => activeFilters.has(f.id))
                  .reduce((sum, f) => sum + (f.count || 0), 0).toLocaleString()} items
              </span>
            </div>
          </div>
          
          {/* Active Filter Pills */}
          <div className="mt-2 flex flex-wrap gap-1">
            {quickFilters
              .filter(f => activeFilters.has(f.id))
              .map(filter => (
                <span
                  key={filter.id}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                >
                  {filter.icon} {filter.label}
                  <button
                    onClick={() => handleFilterToggle(filter.id)}
                    className="ml-1 hover:text-blue-600"
                  >
                    ✕
                  </button>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Filter Suggestions */}
      {activeFilters.size === 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-2">💡 Popular combinations:</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                handleFilterToggle('top_performers');
                handleFilterToggle('trending');
              }}
              className="text-xs bg-white text-gray-700 px-2 py-1 rounded border hover:bg-gray-100"
            >
              🏆 Top + 📈 Trending
            </button>
            <button
              onClick={() => {
                handleFilterToggle('new_products');
                handleFilterToggle('promoted');
              }}
              className="text-xs bg-white text-gray-700 px-2 py-1 rounded border hover:bg-gray-100"
            >
              ✨ New + 🎯 Promoted
            </button>
            <button
              onClick={() => {
                handleFilterToggle('high_margin');
                handleFilterToggle('seasonal');
              }}
              className="text-xs bg-white text-gray-700 px-2 py-1 rounded border hover:bg-gray-100"
            >
              💎 Premium + 🌟 Seasonal
            </button>
          </div>
        </div>
      )}

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .quick-filters .gap-2 {
            gap: 0.375rem;
          }
          .quick-filters .text-sm {
            font-size: 0.75rem;
          }
          .quick-filters .px-3 {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}

// Hook for using quick filters in parent components
export function useQuickFilters() {
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({});

  const handleFilterChange = (filterId: string, isActive: boolean) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: isActive
    }));
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  const getActiveFilters = () => {
    return Object.entries(activeFilters)
      .filter(([_, isActive]) => isActive)
      .map(([filterId, _]) => filterId);
  };

  const hasActiveFilters = () => {
    return Object.values(activeFilters).some(isActive => isActive);
  };

  return {
    activeFilters,
    handleFilterChange,
    clearAllFilters,
    getActiveFilters,
    hasActiveFilters
  };
}