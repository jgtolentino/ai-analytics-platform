'use client';

import React, { useState, useEffect } from 'react';
import { getBrandProfile, getBrandAffinity, brandDictionary } from '../../data/brand-dictionary';
import { emotionalAnalyzer } from '../../analysis/emotional-context-analyzer';
import { bundlingAnalyzer, BundlingContext } from '../../analysis/bundling-opportunities';

interface AdvancedInsightsPanelProps {
  selectedBrand?: string;
  demographics?: string[];
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'seasonal';
}

export default function AdvancedInsightsPanel({ 
  selectedBrand = 'alaska', 
  demographics = ['millennials', 'families_with_children'],
  timeframe = 'monthly'
}: AdvancedInsightsPanelProps) {
  const [activeTab, setActiveTab] = useState<'brand' | 'emotional' | 'bundling'>('brand');
  const [brandProfile, setBrandProfile] = useState(getBrandProfile(selectedBrand));
  const [emotionalInsights, setEmotionalInsights] = useState<any[]>([]);
  const [bundlingOpportunities, setBundlingOpportunities] = useState<any[]>([]);

  useEffect(() => {
    // Update brand profile
    setBrandProfile(getBrandProfile(selectedBrand));

    // Update emotional insights
    const insights = emotionalAnalyzer.analyzeEmotionalPatterns(selectedBrand);
    setEmotionalInsights(insights);

    // Update bundling opportunities
    const context: BundlingContext = {
      timeframe,
      occasion: 'regular',
      demographics,
      location: 'urban'
    };
    const opportunities = bundlingAnalyzer.analyzeBundlingOpportunities(context);
    setBundlingOpportunities(opportunities);
  }, [selectedBrand, demographics, timeframe]);

  const renderBrandInsights = () => {
    if (!brandProfile) return <div>Brand not found</div>;

    return (
      <div className="space-y-6">
        {/* Brand Identity Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <div 
              className="w-4 h-4 rounded mr-3"
              style={{ backgroundColor: brandProfile.colorAssociations.primary }}
            />
            {brandProfile.name} Brand Profile
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Color Psychology</h4>
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: brandProfile.colorAssociations.primary }}
                />
                <span className="text-sm text-gray-600">Primary</span>
              </div>
              <div className="flex space-x-1">
                {brandProfile.colorAssociations.secondary.map((color, idx) => (
                  <div 
                    key={idx}
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1 capitalize">
                {brandProfile.colorAssociations.emotionalTone} tone
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Brand Affinity</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Loyalty Score</span>
                  <span className="font-medium">{(brandProfile.brandAffinity.loyaltyScore * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${brandProfile.brandAffinity.loyaltyScore * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Primary Triggers</h4>
              <div className="space-y-1">
                {brandProfile.emotionalTriggers.primary.slice(0, 3).map((trigger, idx) => (
                  <span 
                    key={idx}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1"
                  >
                    {trigger.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generational Analysis */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Generational Affinity Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(brandProfile.generationalPatterns).map(([gen, data]) => (
              <div key={gen} className="text-center">
                <h4 className="font-medium text-gray-700 capitalize mb-2">
                  {gen === 'genZ' ? 'Gen Z' : gen === 'genX' ? 'Gen X' : gen}
                </h4>
                <div className="w-16 h-16 mx-auto mb-2 relative">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="#3b82f6"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${data.affinity * 175.93} 175.93`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                    {(data.affinity * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  {data.behaviors.slice(0, 2).map((behavior, idx) => (
                    <div key={idx}>{behavior.replace('_', ' ')}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderEmotionalInsights = () => {
    const correlations = emotionalAnalyzer.analyzeCrossEmotionalCorrelations();
    const engagement = emotionalAnalyzer.calculateEmotionalEngagement(selectedBrand, 'purchase');

    return (
      <div className="space-y-6">
        {/* Emotional Engagement Score */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Emotional Engagement Analysis</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {(engagement * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">Purchase Context Score</div>
            </div>
            <div className="w-24 h-24">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#3b82f6"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${engagement * 251.33} 251.33`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Emotional Insights Grid */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Emotional Triggers & Contexts</h3>
          <div className="space-y-4">
            {emotionalInsights.slice(0, 3).map((insight, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium capitalize">{insight.emotion}</h4>
                    <p className="text-sm text-gray-600 capitalize">{insight.context} context</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{(insight.intensity * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-500 capitalize">{insight.timeframe}</div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {insight.triggers.map((trigger: string, triggerIdx: number) => (
                    <span 
                      key={triggerIdx}
                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {trigger.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emotional Correlations */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Cross-Emotional Correlations</h3>
          <div className="space-y-3">
            {correlations.slice(0, 3).map((corr, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium capitalize">{corr.emotion1}</span>
                  <span className="mx-2 text-gray-400">↔</span>
                  <span className="font-medium capitalize">{corr.emotion2}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{(corr.correlation * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-500">correlation</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBundlingOpportunities = () => {
    return (
      <div className="space-y-6">
        {/* Top Opportunities */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Top Bundling Opportunities</h3>
          <div className="space-y-4">
            {bundlingOpportunities.slice(0, 3).map((opportunity, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{opportunity.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{opportunity.promotionType.replace('_', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      +{(opportunity.expectedUplift.revenue * 100).toFixed(1)}% Revenue
                    </div>
                    <div className="text-xs text-gray-500">
                      {(opportunity.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Brands</h5>
                    <div className="space-y-1">
                      {opportunity.brands.map((brand: string, brandIdx: number) => (
                        <span 
                          key={brandIdx}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 capitalize"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Target Demographics</h5>
                    <div className="space-y-1">
                      {opportunity.targetDemographics.slice(0, 2).map((demo: string, demoIdx: number) => (
                        <div key={demoIdx} className="text-xs text-gray-600">
                          {demo.replace('_', ' ')}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Implementation</h5>
                    <div className="text-xs text-gray-600">
                      <div>Placement: {opportunity.implementation.placement.replace('_', ' ')}</div>
                      <div>Timing: {opportunity.implementation.timing.replace('_', ' ')}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <h5 className="font-medium text-gray-700 mb-2">Reasoning</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="font-medium">Emotional:</span>
                      <div className="text-gray-600">
                        {opportunity.reasoning.emotional.slice(0, 2).join(', ').replace(/_/g, ' ')}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Behavioral:</span>
                      <div className="text-gray-600">
                        {opportunity.reasoning.behavioral.slice(0, 2).join(', ').replace(/_/g, ' ')}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Contextual:</span>
                      <div className="text-gray-600">
                        {opportunity.reasoning.contextual.slice(0, 2).join(', ').replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Analysis */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Expected ROI Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bundlingOpportunities.slice(0, 3).map((opportunity, idx) => {
              const roi = bundlingAnalyzer.calculateBundlingROI(opportunity.id, 10000);
              return (
                <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{opportunity.name}</h4>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {roi.roi.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Expected ROI</div>
                  <div className="mt-2 text-xs">
                    <div>Payback: {roi.paybackPeriod.toFixed(1)} months</div>
                    <div className={`mt-1 px-2 py-1 rounded ${{
                      'low': 'bg-green-100 text-green-800',
                      'medium': 'bg-yellow-100 text-yellow-800',
                      'high': 'bg-red-100 text-red-800'
                    }[roi.riskLevel]}`}>
                      {roi.riskLevel} risk
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Advanced Scout Analytics</h1>
        <p className="text-gray-600">
          Sophisticated data model with brand dictionary, emotional context analysis, and bundling opportunities
        </p>
      </div>

      {/* Brand Selector */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Brand</label>
            <select 
              value={selectedBrand}
              onChange={(e) => window.location.search = `?brand=${e.target.value}`}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {brandDictionary.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
            <select 
              value={timeframe}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="seasonal">Seasonal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'brand', label: 'Brand Dictionary', icon: '🎨' },
            { id: 'emotional', label: 'Emotional Analysis', icon: '🧠' },
            { id: 'bundling', label: 'Bundling Opportunities', icon: '📦' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {activeTab === 'brand' && renderBrandInsights()}
        {activeTab === 'emotional' && renderEmotionalInsights()}
        {activeTab === 'bundling' && renderBundlingOpportunities()}
      </div>
    </div>
  );
}