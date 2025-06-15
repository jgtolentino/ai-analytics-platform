// PurchaseFrequencyCard.tsx - Purchase Frequency KPI Card Component
// Displays customer purchase frequency metrics and patterns
// Version: 1.0.0

import React from 'react';

interface FrequencyData {
  averageFrequency: number; // purchases per month
  previousFrequency: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercent: number;
  frequencySegments: {
    frequent: { count: number; avgPerMonth: number }; // 4+ purchases/month
    regular: { count: number; avgPerMonth: number };  // 2-3 purchases/month
    occasional: { count: number; avgPerMonth: number }; // 1 purchase/month
    rare: { count: number; avgPerMonth: number }; // <1 purchase/month
  };
  daysBetweenPurchases: number;
  peakPurchaseHour: number;
}

interface PurchaseFrequencyCardProps {
  data: FrequencyData;
  className?: string;
}

export default function PurchaseFrequencyCard({ 
  data, 
  className = "" 
}: PurchaseFrequencyCardProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PH').format(num);
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (data.trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  const getTrendBgColor = () => {
    switch (data.trend) {
      case 'increasing': return 'bg-green-50 border-green-200';
      case 'decreasing': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getFrequencyLevel = () => {
    if (data.averageFrequency >= 4) return { level: 'Excellent', color: 'text-green-600' };
    if (data.averageFrequency >= 2) return { level: 'Good', color: 'text-yellow-600' };
    if (data.averageFrequency >= 1) return { level: 'Average', color: 'text-orange-600' };
    return { level: 'Needs Attention', color: 'text-red-600' };
  };

  const frequencyStatus = getFrequencyLevel();
  const totalCustomers = Object.values(data.frequencySegments).reduce((sum, segment) => sum + segment.count, 0);

  const formatTime = (hour: number) => {
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
  };

  return (
    <div className={`frequency-card bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-xl">🔄</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Purchase Frequency</h3>
            <p className="text-xs text-gray-500">Average purchases per month</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${frequencyStatus.color} bg-opacity-10`}>
          {frequencyStatus.level}
        </div>
      </div>

      {/* Main Frequency Value */}
      <div className="mb-4">
        <div className={`text-3xl font-bold mb-1 ${frequencyStatus.color}`}>
          {data.averageFrequency.toFixed(1)}<span className="text-lg text-gray-500">/mo</span>
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

      {/* Key Metrics */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Days Between Purchases</span>
          <span className="text-sm font-semibold text-gray-900">
            {data.daysBetweenPurchases} days
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Peak Purchase Time</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatTime(data.peakPurchaseHour)}
          </span>
        </div>
      </div>

      {/* Frequency Segments */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Customer Segments</h4>
        
        {/* Frequent Buyers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Frequent (4+/mo)</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-green-600">
              {formatNumber(data.frequencySegments.frequent.count)}
            </div>
            <div className="text-xs text-gray-500">
              {((data.frequencySegments.frequent.count / totalCustomers) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Regular Buyers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Regular (2-3/mo)</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-blue-600">
              {formatNumber(data.frequencySegments.regular.count)}
            </div>
            <div className="text-xs text-gray-500">
              {((data.frequencySegments.regular.count / totalCustomers) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Occasional Buyers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Occasional (1/mo)</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-yellow-600">
              {formatNumber(data.frequencySegments.occasional.count)}
            </div>
            <div className="text-xs text-gray-500">
              {((data.frequencySegments.occasional.count / totalCustomers) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Rare Buyers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Rare (&lt;1/mo)</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-red-600">
              {formatNumber(data.frequencySegments.rare.count)}
            </div>
            <div className="text-xs text-gray-500">
              {((data.frequencySegments.rare.count / totalCustomers) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Frequency Distribution Visualization */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-600 mb-2">Frequency Distribution</div>
        <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
          <div 
            className="bg-green-500"
            style={{ width: `${(data.frequencySegments.frequent.count / totalCustomers) * 100}%` }}
          ></div>
          <div 
            className="bg-blue-500"
            style={{ width: `${(data.frequencySegments.regular.count / totalCustomers) * 100}%` }}
          ></div>
          <div 
            className="bg-yellow-500"
            style={{ width: `${(data.frequencySegments.occasional.count / totalCustomers) * 100}%` }}
          ></div>
          <div 
            className="bg-red-500"
            style={{ width: `${(data.frequencySegments.rare.count / totalCustomers) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <button className="flex-1 text-xs bg-blue-50 text-blue-700 py-2 px-3 rounded hover:bg-blue-100 transition-colors">
            📊 View Patterns
          </button>
          <button className="flex-1 text-xs bg-gray-50 text-gray-700 py-2 px-3 rounded hover:bg-gray-100 transition-colors">
            🎯 Boost Frequency
          </button>
        </div>
      </div>
    </div>
  );
}

// Sample data for development
export const sampleFrequencyData: FrequencyData = {
  averageFrequency: 2.8,
  previousFrequency: 2.6,
  trend: 'increasing',
  changePercent: 7.7,
  frequencySegments: {
    frequent: { count: 1523, avgPerMonth: 5.2 },
    regular: { count: 3247, avgPerMonth: 2.4 },
    occasional: { count: 2891, avgPerMonth: 1.0 },
    rare: { count: 1271, avgPerMonth: 0.4 }
  },
  daysBetweenPurchases: 11,
  peakPurchaseHour: 14
};