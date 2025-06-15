// DynamicTransactionDashboard.tsx - Dashboard with dynamic transaction counting and filter sync
// Shows total transactions when no filters, filtered count when filters applied
// Auto-syncs data when filters change
// Version: 1.0.0

import React, { useState, useEffect } from 'react';
import useFilteredData from '../../hooks/useFilteredData';
import FilterPills from '../filters/FilterPills';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export default function DynamicTransactionDashboard() {
  const {
    data,
    displayMetrics,
    isLoading,
    error,
    filters,
    hasActiveFilters,
    updateFilter,
    clearAllFilters,
    applyDateRange,
    toggleRegion,
    toggleBrand,
    toggleCategory,
    refetch,
    getFilterSummary
  } = useFilteredData();

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterOptions, setFilterOptions] = useState<{
    regions: FilterOption[];
    brands: FilterOption[];
    categories: FilterOption[];
    timeOfDay: FilterOption[];
  }>({
    regions: [],
    brands: [],
    categories: [],
    timeOfDay: [
      { id: 'morning', label: 'Morning (6AM-12PM)' },
      { id: 'afternoon', label: 'Afternoon (12PM-6PM)' },
      { id: 'evening', label: 'Evening (6PM-12AM)' },
      { id: 'night', label: 'Night (12AM-6AM)' }
    ]
  });

  // Load filter options on component mount
  useEffect(() => {
    if (data) {
      setFilterOptions(prev => ({
        ...prev,
        regions: data.regionalData.map(r => ({
          id: r.region_name,
          label: r.region_name,
          count: r.txn_count
        })),
        brands: data.brandData.map(b => ({
          id: b.brand_name,
          label: b.brand_name,
          count: b.item_count
        })),
        categories: data.categoryData.map(c => ({
          id: c.category,
          label: c.category,
          count: c.item_count
        }))
      }));
    }
  }, [data]);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PH').format(num);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get transaction count display
  const getTransactionDisplay = () => {
    if (!displayMetrics) return { count: 0, label: 'Loading...', ratio: '' };
    
    if (hasActiveFilters) {
      return {
        count: displayMetrics.transactions,
        label: `Filtered Transactions`,
        ratio: `of ${formatNumber(displayMetrics.totalTransactions)} total (${displayMetrics.filteringRatio})`,
        isFiltered: true
      };
    }
    
    return {
      count: displayMetrics.transactions,
      label: 'Total Transactions',
      ratio: 'All data shown',
      isFiltered: false
    };
  };

  const transactionDisplay = getTransactionDisplay();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-2">
            <span className="text-red-500 text-xl mr-2">❌</span>
            <h3 className="text-red-800 font-semibold">Error Loading Dashboard</h3>
          </div>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Dynamic Transaction Count */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                📊 Scout Analytics
                {isLoading && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                )}
              </h1>
              
              {/* Dynamic Transaction Count Display */}
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-blue-600">
                    {formatNumber(transactionDisplay.count)}
                  </span>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{transactionDisplay.label}</div>
                    <div className={`text-xs ${transactionDisplay.isFiltered ? 'text-orange-600' : 'text-gray-600'}`}>
                      {transactionDisplay.ratio}
                    </div>
                  </div>
                </div>
                
                {hasActiveFilters && (
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    🔍 Filtered View
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  hasActiveFilters 
                    ? 'bg-orange-100 text-orange-800 border border-orange-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300'
                } hover:bg-gray-200`}
              >
                🔧 Filters {hasActiveFilters && `(${Object.keys(filters).length})`}
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 font-medium text-sm"
                >
                  Clear All
                </button>
              )}
              
              <button
                onClick={refetch}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {isLoading ? 'Syncing...' : '🔄 Refresh'}
              </button>
            </div>
          </div>
          
          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="text-sm">
                <span className="font-medium text-orange-800">Active Filters: </span>
                <span className="text-orange-700">{getFilterSummary()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Data</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => applyDateRange(e.target.value, filters.dateRange?.end || '')}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="date"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => applyDateRange(filters.dateRange?.start || '', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Region Filter */}
              <div>
                <FilterPills
                  label="Regions"
                  options={filterOptions.regions}
                  selected={filters.regions || []}
                  onChange={(selected) => updateFilter('regions', selected)}
                  multiSelect={true}
                />
              </div>

              {/* Brand Filter */}
              <div>
                <FilterPills
                  label="Brands"
                  options={filterOptions.brands}
                  selected={filters.brands || []}
                  onChange={(selected) => updateFilter('brands', selected)}
                  multiSelect={true}
                />
              </div>

              {/* Category Filter */}
              <div>
                <FilterPills
                  label="Categories"
                  options={filterOptions.categories}
                  selected={filters.categories || []}
                  onChange={(selected) => updateFilter('categories', selected)}
                  multiSelect={true}
                />
              </div>

              {/* Time of Day Filter */}
              <div>
                <FilterPills
                  label="Time of Day"
                  options={filterOptions.timeOfDay}
                  selected={filters.timeOfDay || []}
                  onChange={(selected) => updateFilter('timeOfDay', selected)}
                  multiSelect={true}
                />
              </div>

              {/* Weekday/Weekend Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day Type
                </label>
                <select
                  value={filters.weekdayWeekend || 'all'}
                  onChange={(e) => updateFilter('weekdayWeekend', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="all">All Days</option>
                  <option value="weekday">Weekdays Only</option>
                  <option value="weekend">Weekends Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data with applied filters...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title={transactionDisplay.isFiltered ? "Filtered Transactions" : "Total Transactions"}
                value={formatNumber(transactionDisplay.count)}
                subtitle={transactionDisplay.ratio}
                icon="📊"
                isFiltered={transactionDisplay.isFiltered}
              />
              <MetricCard
                title="Revenue"
                value={formatCurrency(displayMetrics?.revenue || 0)}
                subtitle={hasActiveFilters ? "From filtered data" : "Total revenue"}
                icon="💰"
                isFiltered={hasActiveFilters}
              />
              <MetricCard
                title="Avg Order Value"
                value={formatCurrency(displayMetrics?.avgOrderValue || 0)}
                subtitle="Per transaction"
                icon="🛒"
                isFiltered={hasActiveFilters}
              />
              <MetricCard
                title="Unique Customers"
                value={formatNumber(displayMetrics?.uniqueCustomers || 0)}
                subtitle={hasActiveFilters ? "In filtered period" : "Total customers"}
                icon="👥"
                isFiltered={hasActiveFilters}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Regional Performance */}
              <ChartCard title="Regional Performance" isFiltered={hasActiveFilters}>
                <div className="space-y-3">
                  {data?.regionalData.slice(0, 5).map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{region.region_name}</span>
                        <button
                          onClick={() => toggleRegion(region.region_name)}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                        >
                          {filters.regions?.includes(region.region_name) ? 'Remove' : 'Filter'}
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{formatNumber(region.txn_count)} transactions</div>
                        <div className="font-medium">{formatCurrency(region.total_revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>

              {/* Brand Performance */}
              <ChartCard title="Top Brands" isFiltered={hasActiveFilters}>
                <div className="space-y-3">
                  {data?.brandData.slice(0, 5).map((brand, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{brand.brand_name}</span>
                        <button
                          onClick={() => toggleBrand(brand.brand_name)}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                        >
                          {filters.brands?.includes(brand.brand_name) ? 'Remove' : 'Filter'}
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{formatNumber(brand.item_count)} items</div>
                        <div className="font-medium">{formatCurrency(brand.brand_revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>

              {/* Category Performance */}
              <ChartCard title="Top Categories" isFiltered={hasActiveFilters}>
                <div className="space-y-3">
                  {data?.categoryData.slice(0, 5).map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{category.category}</span>
                        <button
                          onClick={() => toggleCategory(category.category)}
                          className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200"
                        >
                          {filters.categories?.includes(category.category) ? 'Remove' : 'Filter'}
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{formatNumber(category.item_count)} items</div>
                        <div className="font-medium">{formatCurrency(category.category_revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>

              {/* Gender Distribution */}
              <ChartCard title="Customer Demographics" isFiltered={hasActiveFilters}>
                <div className="space-y-3">
                  {data?.genderData.map((demo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-medium">{demo.gender}</span>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{formatNumber(demo.customer_count)} customers</div>
                        <div className="font-medium">{formatNumber(demo.transaction_count)} transactions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon,
  isFiltered 
}: { 
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  isFiltered?: boolean;
}) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${
      isFiltered ? 'border-orange-400 bg-orange-50' : 'border-blue-400'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      {isFiltered && (
        <div className="mt-3 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
          Filtered Data
        </div>
      )}
    </div>
  );
}

// Chart Card Component
function ChartCard({ 
  title, 
  children,
  isFiltered 
}: { 
  title: string;
  children: React.ReactNode;
  isFiltered?: boolean;
}) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${
      isFiltered ? 'border border-orange-200' : ''
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {isFiltered && (
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
            Filtered
          </span>
        )}
      </div>
      {children}
    </div>
  );
}