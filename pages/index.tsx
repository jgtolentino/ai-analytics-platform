// pages/index.tsx - Scout Analytics Dashboard Home Page
// Main entry point for the Scout Analytics dashboard
// Version: 1.0.0

import React from 'react';
import { Header } from '../src/components/Header.jsx';
import { DateRangePicker } from '../src/components/DateRangePicker.jsx';
import CollapsibleSection, { sectionPresets } from '../src/components/layout/CollapsibleSection';
import PopulationPyramid, { samplePopulationData } from '../src/components/charts/PopulationPyramid';
// import GenderChart, { sampleGenderData } from '../src/components/charts/GenderChart';
import PaymentGauges, { samplePaymentMethodsData } from '../src/components/charts/PaymentGauges';
import DetailedDemographicsTable, { sampleDemographicsData } from '../src/components/tables/DetailedDemographicsTable';
import CustomerSegmentsTreeMap, { sampleCustomerSegmentsData } from '../src/components/charts/CustomerSegmentsTreeMap';
import BasketShareTreemap, { sampleBasketShareData } from '../src/components/charts/BasketShareTreemap';
import PurchasePatternCards, { samplePurchasePatternData } from '../src/components/cards/PurchasePatternCards';

export default function ScoutDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <Header 
        onSearch={(term) => console.log('Search:', term)}
        onClearAll={() => console.log('Clear all filters')}
        hasActiveFilters={true}
      />

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

        {/* Dashboard Sections */}
        <div className="space-y-6">
          
          {/* Overview Section */}
          <CollapsibleSection
            title="Overview & Demographics"
            subtitle="Population insights and customer distribution"
            icon={sectionPresets.overview.icon}
            badge="4 Charts"
            defaultExpanded={true}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PopulationPyramid data={samplePopulationData} />
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
                <p className="text-gray-600">Gender chart will be available once dependencies are installed.</p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Consumer Insights Section */}
          <CollapsibleSection
            title="Consumer Insights"
            subtitle="Customer segmentation and behavioral patterns"
            icon={sectionPresets.consumers.icon}
            badge="3 Components"
            defaultExpanded={true}
          >
            <div className="space-y-6">
              <CustomerSegmentsTreeMap data={sampleCustomerSegmentsData} />
              <PurchasePatternCards data={samplePurchasePatternData} />
            </div>
          </CollapsibleSection>

          {/* Product Mix Section */}
          <CollapsibleSection
            title="Product Mix Analysis"
            subtitle="Category and brand distribution analysis"
            icon={sectionPresets.products.icon}
            badge="1 Treemap"
            defaultExpanded={true}
          >
            <BasketShareTreemap data={sampleBasketShareData} />
          </CollapsibleSection>

          {/* Payment Methods Section */}
          <CollapsibleSection
            title="Payment Methods"
            subtitle="Payment method usage and trends"
            icon={sectionPresets.payments.icon}
            badge="Gauges"
            defaultExpanded={true}
          >
            <PaymentGauges data={samplePaymentMethodsData} />
          </CollapsibleSection>

          {/* Demographics Table Section */}
          <CollapsibleSection
            title="Detailed Demographics"
            subtitle="Comprehensive customer demographic analysis"
            icon={sectionPresets.demographics.icon}
            badge="Interactive Table"
            defaultExpanded={false}
          >
            <DetailedDemographicsTable data={sampleDemographicsData} />
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