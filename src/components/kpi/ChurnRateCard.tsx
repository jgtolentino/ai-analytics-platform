// ChurnRateCard.tsx - Churn Rate KPI Card Component
// Displays customer churn metrics with risk indicators
// Version: 1.0.0

import React from 'react';

interface ChurnData {
  currentRate: number;
  previousRate: number;
  trend: 'improving' | 'worsening' | 'stable';
  changePercent: number;
  riskSegments: {
    high: number;
    medium: number;
    low: number;
  };
  churnedThisMonth: number;
  totalCustomers: number;
}

interface ChurnRateCardProps {
  data: ChurnData;
  className?: string;
}

export default function ChurnRateCard({ 
  data, 
  className = "" 
}: ChurnRateCardProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PH').format(num);
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'improving': return 'text-green-600';
      case 'worsening': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (data.trend) {
      case 'improving': return '📉'; // Lower churn is better
      case 'worsening': return '📈'; // Higher churn is worse
      default: return '➡️';
    }
  };

  const getTrendBgColor = () => {
    switch (data.trend) {
      case 'improving': return 'bg-green-50 border-green-200';
      case 'worsening': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getChurnStatusColor = () => {
    if (data.currentRate <= 5) return 'text-green-600';
    if (data.currentRate <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getChurnStatusText = () => {
    if (data.currentRate <= 5) return 'Excellent';
    if (data.currentRate <= 10) return 'Good';
    if (data.currentRate <= 15) return 'Warning';
    return 'Critical';
  };

  return (
    <div className={`churn-card bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-xl">🚪</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Churn Rate</h3>
            <p className="text-xs text-gray-500">Monthly customer attrition</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${getChurnStatusColor()} bg-opacity-10`}>
          {getChurnStatusText()}
        </div>
      </div>

      {/* Main Churn Rate */}
      <div className="mb-4">
        <div className={`text-3xl font-bold mb-1 ${getChurnStatusColor()}`}>
          {data.currentRate.toFixed(1)}%
        </div>
        
        {/* Trend Indicator */}
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTrendBgColor()}`}>
          <span className="mr-1">{getTrendIcon()}</span>
          <span className={getTrendColor()}>
            {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(1)}%
          </span>
          <span className="text-gray-600 ml-1">vs last month</span>
        </div>
      </div>

      {/* Churn Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Churned This Month</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatNumber(data.churnedThisMonth)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Customers</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatNumber(data.totalCustomers)}
          </span>
        </div>
      </div>

      {/* Risk Segments */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Churn Risk Segments</h4>
        
        {/* High Risk */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">High Risk</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-red-600">
              {formatNumber(data.riskSegments.high)}
            </div>
            <div className="text-xs text-gray-500">
              {((data.riskSegments.high / data.totalCustomers) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Medium Risk */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Medium Risk</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-yellow-600">
              {formatNumber(data.riskSegments.medium)}
            </div>
            <div className="text-xs text-gray-500">
              {((data.riskSegments.medium / data.totalCustomers) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Low Risk */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Low Risk</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-green-600">
              {formatNumber(data.riskSegments.low)}
            </div>
            <div className="text-xs text-gray-500">
              {((data.riskSegments.low / data.totalCustomers) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Churn Rate Gauge */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600">Industry Benchmark</span>
          <span className="text-xs text-gray-600">8-12%</span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3">
            {/* Benchmark zones */}
            <div className="absolute inset-0 flex rounded-full overflow-hidden">
              <div className="bg-green-300 h-3" style={{ width: '33.33%' }}></div>
              <div className="bg-yellow-300 h-3" style={{ width: '33.33%' }}></div>
              <div className="bg-red-300 h-3" style={{ width: '33.34%' }}></div>
            </div>
            {/* Current rate indicator */}
            <div 
              className="absolute top-0 w-1 h-3 bg-gray-800 rounded"
              style={{ left: `${Math.min(data.currentRate * 4, 100)}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>Good</span>
          <span>Avg</span>
          <span>High</span>
          <span>25%</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <button className="flex-1 text-xs bg-red-50 text-red-700 py-2 px-3 rounded hover:bg-red-100 transition-colors">
            🎯 View At-Risk
          </button>
          <button className="flex-1 text-xs bg-gray-50 text-gray-700 py-2 px-3 rounded hover:bg-gray-100 transition-colors">
            📞 Retention Plan
          </button>
        </div>
      </div>
    </div>
  );
}

// Sample data for development
export const sampleChurnData: ChurnData = {
  currentRate: 8.7,
  previousRate: 9.2,
  trend: 'improving',
  changePercent: -5.4,
  riskSegments: {
    high: 892,
    medium: 1456,
    low: 6584
  },
  churnedThisMonth: 267,
  totalCustomers: 8932
};