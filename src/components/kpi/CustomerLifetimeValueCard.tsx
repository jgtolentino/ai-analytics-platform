// CustomerLifetimeValueCard.tsx - CLV KPI Card Component
// Displays Customer Lifetime Value metrics with trend indicators
// Version: 1.0.0

import React from 'react';

interface CLVData {
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  segments: {
    high: number;
    medium: number;
    low: number;
  };
}

interface CustomerLifetimeValueCardProps {
  data: CLVData;
  className?: string;
}

export default function CustomerLifetimeValueCard({ 
  data, 
  className = "" 
}: CustomerLifetimeValueCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendBgColor = () => {
    switch (data.trend) {
      case 'up': return 'bg-green-50 border-green-200';
      case 'down': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`clv-card bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-xl">💎</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">Customer Lifetime Value</h3>
            <p className="text-xs text-gray-500">Average per customer</p>
          </div>
        </div>
      </div>

      {/* Main CLV Value */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {formatCurrency(data.current)}
        </div>
        
        {/* Trend Indicator */}
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTrendBgColor()}`}>
          <span className="mr-1">{getTrendIcon()}</span>
          <span className={getTrendColor()}>
            {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(1)}%
          </span>
          <span className="text-gray-600 ml-1">vs last period</span>
        </div>
      </div>

      {/* CLV Segments */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Value Segments</h4>
        
        {/* High Value */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">High Value</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">
              {formatCurrency(data.segments.high)}
            </div>
            <div className="text-xs text-gray-500">Top 20%</div>
          </div>
        </div>

        {/* Medium Value */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Medium Value</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">
              {formatCurrency(data.segments.medium)}
            </div>
            <div className="text-xs text-gray-500">60%</div>
          </div>
        </div>

        {/* Low Value */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Low Value</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-900">
              {formatCurrency(data.segments.low)}
            </div>
            <div className="text-xs text-gray-500">Bottom 20%</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600">Target Progress</span>
          <span className="text-xs font-medium text-gray-900">
            {((data.current / 50000) * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((data.current / 50000) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Target: {formatCurrency(50000)}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <button className="flex-1 text-xs bg-purple-50 text-purple-700 py-2 px-3 rounded hover:bg-purple-100 transition-colors">
            📊 View Segments
          </button>
          <button className="flex-1 text-xs bg-gray-50 text-gray-700 py-2 px-3 rounded hover:bg-gray-100 transition-colors">
            📈 CLV Trends
          </button>
        </div>
      </div>
    </div>
  );
}

// Sample data for development
export const sampleCLVData: CLVData = {
  current: 42350,
  previous: 39800,
  trend: 'up',
  changePercent: 6.4,
  segments: {
    high: 89500,
    medium: 38200,
    low: 18750
  }
};