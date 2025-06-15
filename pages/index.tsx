// pages/index.tsx - Scout Analytics Dashboard Home Page
// Main entry point for the Scout Analytics dashboard
// Version: 1.0.0

import React from 'react';
import { Header } from '../src/components/Header.jsx';
import { DateRangePicker } from '../src/components/DateRangePicker.jsx';
import Navigation from '../src/components/Navigation';
import CollapsibleSection, { sectionPresets } from '../src/components/layout/CollapsibleSection';
import PopulationPyramid, { samplePopulationData } from '../src/components/charts/PopulationPyramid';

export default function ScoutDashboard() {
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
        
        {/* Page Header with Date Picker */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scout Analytics Dashboard</h1>
            <p className="text-lg text-gray-600 mt-2">AI-Powered Retail Intelligence Platform</p>
          </div>
          <DateRangePicker 
            onDateChange={(range) => console.log('Date range changed:', range)}
          />
        </div>

        {/* Dashboard Sections - Executive Overview (Limited to 8 Components) */}
        <div className="space-y-6">
          
          {/* Executive Summary Metrics */}
          <CollapsibleSection
            title="Executive Summary"
            subtitle="Key performance indicators and business metrics"
            icon="📊"
            badge="KPI Cards"
            defaultExpanded={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd className="text-lg font-medium text-gray-900">₱3.84M</dd>
                    </dl>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-green-600 text-sm font-medium">+8.2%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">🛒</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Transactions</dt>
                      <dd className="text-lg font-medium text-gray-900">15,642</dd>
                    </dl>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-green-600 text-sm font-medium">+5.4%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Customers</dt>
                      <dd className="text-lg font-medium text-gray-900">8,932</dd>
                    </dl>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-green-600 text-sm font-medium">+12.1%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">📦</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg Basket</dt>
                      <dd className="text-lg font-medium text-gray-900">₱245</dd>
                    </dl>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-red-600 text-sm font-medium">-1.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Top Level Demographics */}
          <CollapsibleSection
            title="Customer Demographics Overview"
            subtitle="High-level customer distribution insights"
            icon={sectionPresets.overview.icon}
            badge="Visual Summary"
            defaultExpanded={true}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PopulationPyramid data={samplePopulationData} />
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Distribution Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Total Customers</span>
                    <span className="font-semibold text-blue-900">29,060</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                    <span className="text-gray-700">Female Customers</span>
                    <span className="font-semibold text-pink-900">51.8% (15,060)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Male Customers</span>
                    <span className="font-semibold text-green-900">48.2% (14,000)</span>
                  </div>
                  <div className="mt-4 text-center">
                    <a href="/trends" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View detailed demographics & behavior analysis →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Top Categories Summary */}
          <CollapsibleSection
            title="Top Performing Categories"
            subtitle="Revenue leaders and market share overview"
            icon={sectionPresets.products.icon}
            badge="Category Summary"
            defaultExpanded={true}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h3>
                <div className="space-y-3">
                  {[
                    { category: 'Beverages', revenue: '₱1.25M', share: '32.4%', color: 'bg-blue-500' },
                    { category: 'Snacks', revenue: '₱892K', share: '23.2%', color: 'bg-green-500' },
                    { category: 'Personal Care', revenue: '₱646K', share: '16.8%', color: 'bg-purple-500' },
                    { category: 'Household', revenue: '₱534K', share: '13.9%', color: 'bg-orange-500' },
                    { category: 'Others', revenue: '₱523K', share: '13.6%', color: 'bg-gray-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                        <span className="text-gray-700">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{item.revenue}</div>
                        <div className="text-xs text-gray-500">{item.share}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a href="/products" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-3">📊</span>
                      <div>
                        <div className="font-medium text-blue-900">Detailed Product Analysis</div>
                        <div className="text-sm text-blue-700">View complete category breakdown</div>
                      </div>
                    </div>
                  </a>
                  <a href="/trends" className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex items-center">
                      <span className="text-green-600 mr-3">📈</span>
                      <div>
                        <div className="font-medium text-green-900">Transaction Trends</div>
                        <div className="text-sm text-green-700">Time-series analysis</div>
                      </div>
                    </div>
                  </a>
                  <a href="/ai-assist" className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <div className="flex items-center">
                      <span className="text-purple-600 mr-3">🤖</span>
                      <div>
                        <div className="font-medium text-purple-900">AI Recommendations</div>
                        <div className="text-sm text-purple-700">Get intelligent insights</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Regional Performance Summary */}
          <CollapsibleSection
            title="Regional Performance Snapshot"
            subtitle="Top performing regions and growth indicators"
            icon="🗺️"
            badge="Geography"
            defaultExpanded={true}
          >
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">₱1.85M</div>
                  <div className="text-sm text-blue-700">Metro Manila</div>
                  <div className="text-xs text-green-600">+12.3% growth</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">₱892K</div>
                  <div className="text-sm text-green-700">Cebu</div>
                  <div className="text-xs text-green-600">+8.7% growth</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-900">₱654K</div>
                  <div className="text-sm text-purple-700">Davao</div>
                  <div className="text-xs text-green-600">+15.2% growth</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <a href="/trends" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View complete regional analysis and maps →
                </a>
              </div>
            </div>
          </CollapsibleSection>

        </div>

        {/* Footer */}
        <div className="mt-12 py-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Scout Analytics Dashboard v2.0 - Powered by TBWA AI Analytics Platform</p>
            <p className="mt-1">Enhanced with Azure OpenAI and real-time insights</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: 'Scout Analytics Dashboard',
      description: 'AI-powered retail intelligence platform for the Philippines market'
    },
    revalidate: 60
  };
}