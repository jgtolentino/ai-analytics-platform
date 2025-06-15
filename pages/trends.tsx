// pages/trends.tsx - Transaction Trends Page
// Time-series analysis, revenue distribution, and regional performance
// Version: 1.0.0

import React from 'react';
import { Header } from '../src/components/Header.jsx';
import { DateRangePicker } from '../src/components/DateRangePicker.jsx';
import Navigation from '../src/components/Navigation';
import CollapsibleSection, { sectionPresets } from '../src/components/layout/CollapsibleSection';
import DailyTransactionChart from '../src/components/charts/DailyTransactionChart';
import RevenueDistributionChart from '../src/components/charts/RevenueDistributionChart';
import ShoppingTimeHeatmap from '../src/components/charts/ShoppingTimeHeatmap';

export default function TransactionTrends() {
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
            <h1 className="text-3xl font-bold text-gray-900">📈 Transaction Trends</h1>
            <p className="text-lg text-gray-600 mt-2">Time-series analysis and revenue patterns</p>
          </div>
          <DateRangePicker 
            onDateChange={(range) => console.log('Date range changed:', range)}
          />
        </div>

        {/* Dashboard Sections */}
        <div className="space-y-6">
          
          {/* Daily Transaction Trends */}
          <CollapsibleSection
            title="Daily Transaction Volume"
            subtitle="Time-series analysis of transaction patterns"
            icon={sectionPresets.transactions.icon}
            badge="Line Chart"
            defaultExpanded={true}
          >
            <DailyTransactionChart height={400} />
          </CollapsibleSection>

          {/* Revenue Distribution */}
          <CollapsibleSection
            title="Revenue Distribution Analysis"
            subtitle="Box plots and distribution patterns"
            icon={sectionPresets.overview.icon}
            badge="Box Plot"
            defaultExpanded={true}
          >
            <RevenueDistributionChart height={400} />
          </CollapsibleSection>

          {/* Shopping Time Heatmap */}
          <CollapsibleSection
            title="Shopping Time Heatmap"
            subtitle="Hour-by-day transaction intensity"
            icon="🕐"
            badge="Heatmap"
            defaultExpanded={true}
          >
            <ShoppingTimeHeatmap height={400} />
          </CollapsibleSection>

          {/* Regional Performance */}
          <CollapsibleSection
            title="Regional Transaction Performance"
            subtitle="Geographic distribution and regional insights"
            icon="🗺️"
            badge="Map + Chart"
            defaultExpanded={false}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl mb-3">🗺️</div>
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Regional Map</h4>
                    <p className="text-gray-600 text-sm">Philippines regions with transaction overlay</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl mb-3">📊</div>
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Regional Bar Chart</h4>
                    <p className="text-gray-600 text-sm">Transaction volume by region ranking</p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* AI Trend Insights */}
          <CollapsibleSection
            title="AI-Generated Trend Insights"
            subtitle="Intelligent analysis of transaction patterns"
            icon="🧠"
            badge="AI Insights"
            defaultExpanded={true}
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🤖</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">RetailBot Trend Analysis</h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="font-medium text-gray-900">Peak Period Detected</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        Saturday 2-4 PM shows consistent 28% higher transaction volume. Consider targeted promotions during this window.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                        <span className="font-medium text-gray-900">Seasonal Trend</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        Summer increase in beverage sales (+12.8%). Stock optimization recommended for Q2-Q3.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span className="font-medium text-gray-900">Regional Opportunity</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        Metro Manila and Cebu drive 65% of volume. Expansion potential in Davao and Iloilo regions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

        </div>

        {/* Footer */}
        <div className="mt-12 py-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>Transaction Trends Analysis - Scout Analytics v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: 'Transaction Trends - Scout Analytics',
      description: 'Time-series analysis and revenue patterns for retail intelligence'
    },
    revalidate: 60
  };
}