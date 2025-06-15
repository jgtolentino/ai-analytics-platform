// pages/products.tsx - Product Mix & SKU Dynamics Page
// Category analysis, brand performance, and substitution flows
// Version: 1.0.0

import React from 'react';
import { Header } from '../src/components/Header.jsx';
import { DateRangePicker } from '../src/components/DateRangePicker.jsx';
import Navigation from '../src/components/Navigation';
import CollapsibleSection, { sectionPresets } from '../src/components/layout/CollapsibleSection';
import BasketShareTreemap, { sampleBasketShareData } from '../src/components/charts/BasketShareTreemap';
import SKUCombinationNetwork from '../src/components/charts/SKUCombinationNetwork';
import SubstitutionSankeyChart from '../src/components/charts/SubstitutionSankeyChart';

export default function ProductMixAndSKU() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <Header 
        onSearch={(term) => console.log('Search:', term)}
        onClearAll={() => console.log('Clear all filters')}
        hasActiveFilters={true}
      />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🧺 Product Mix & SKU Dynamics</h1>
            <p className="text-lg text-gray-600 mt-2">Category performance and substitution analysis</p>
          </div>
          <DateRangePicker 
            onDateChange={(range) => console.log('Date range changed:', range)}
          />
        </div>

        {/* Dashboard Sections */}
        <div className="space-y-6">
          
          {/* Basket Share Analysis */}
          <CollapsibleSection
            title="Category & Brand Market Share"
            subtitle="Interactive treemap of basket composition"
            icon={sectionPresets.products.icon}
            badge="Treemap"
            defaultExpanded={true}
          >
            <BasketShareTreemap data={sampleBasketShareData} />
          </CollapsibleSection>

          {/* Top Categories Performance */}
          <CollapsibleSection
            title="Top Categories Performance"
            subtitle="Revenue and volume by product category"
            icon="📊"
            badge="Bar Chart"
            defaultExpanded={true}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Category Revenue Chart</h3>
                    <p className="text-gray-600">Top 10 categories by revenue contribution</p>
                    <div className="mt-4 text-sm text-gray-500">
                      Features: Sortable, filterable, growth indicators
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Category Performance Summary</h4>
                <div className="space-y-3">
                  {[
                    { category: 'Beverages', revenue: '₱1,245,600', share: '32.4%', growth: '+5.2%', color: 'bg-blue-500' },
                    { category: 'Snacks', revenue: '₱892,340', share: '23.2%', growth: '+12.4%', color: 'bg-green-500' },
                    { category: 'Personal Care', revenue: '₱645,780', share: '16.8%', growth: '+4.1%', color: 'bg-purple-500' },
                    { category: 'Household', revenue: '₱534,210', share: '13.9%', growth: '+6.2%', color: 'bg-orange-500' },
                    { category: 'Dairy', revenue: '₱523,070', share: '13.6%', growth: '+8.1%', color: 'bg-pink-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                        <div>
                          <div className="font-medium text-gray-900">{item.category}</div>
                          <div className="text-sm text-gray-600">{item.share} market share</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{item.revenue}</div>
                        <div className="text-sm text-green-600">{item.growth}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* SKU Combinations Network */}
          <CollapsibleSection
            title="Frequently Bought Together"
            subtitle="SKU combination analysis and cross-selling opportunities"
            icon="🔗"
            badge="Network"
            defaultExpanded={true}
          >
            <SKUCombinationNetwork />
          </CollapsibleSection>

          {/* Product Substitution Flow */}
          <CollapsibleSection
            title="Product Substitution Analysis"
            subtitle="Sankey diagram of product switching patterns"
            icon="🔄"
            badge="Sankey"
            defaultExpanded={true}
          >
            <SubstitutionSankeyChart />
          </CollapsibleSection>

          {/* Basket Size Analysis */}
          <CollapsibleSection
            title="Average Basket Size Distribution"
            subtitle="Transaction value and item count analysis"
            icon="🛒"
            badge="Histogram"
            defaultExpanded={false}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl mb-3">📊</div>
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Basket Value Distribution</h4>
                    <p className="text-gray-600 text-sm">Histogram of transaction values</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🔢</div>
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Items per Basket</h4>
                    <p className="text-gray-600 text-sm">Distribution of item counts</p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

        </div>

        {/* Footer */}
        <div className="mt-12 py-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Product Mix & SKU Dynamics - Scout Analytics v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: 'Product Mix & SKU Dynamics - Scout Analytics',
      description: 'Category performance and substitution analysis for retail intelligence'
    },
    revalidate: 60
  };
}