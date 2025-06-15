// PurchasePatternCards.tsx - Purchase Patterns Summary Cards
// Displays Peak Day, Popular Time, Preferred Payment patterns
// Version: 1.0.0

import React from 'react';

interface PurchasePattern {
  peakDay: {
    day: string;
    percentage: number;
    transactions: number;
  };
  popularTime: {
    timeRange: string;
    percentage: number;
    transactions: number;
  };
  preferredPayment: {
    method: string;
    percentage: number;
    transactions: number;
  };
  seasonalTrend: {
    trend: string;
    percentage: number;
    description: string;
  };
  shoppingFrequency: {
    pattern: string;
    avgDays: number;
    description: string;
  };
  basketBehavior: {
    pattern: string;
    avgItems: number;
    description: string;
  };
}

interface PurchasePatternCardsProps {
  data: PurchasePattern;
  className?: string;
}

export default function PurchasePatternCards({ 
  data, 
  className = "" 
}: PurchasePatternCardsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PH').format(num);
  };

  const getDayIcon = (day: string) => {
    const icons: Record<string, string> = {
      'Monday': '📅',
      'Tuesday': '📋',
      'Wednesday': '📊',
      'Thursday': '📈',
      'Friday': '🎉',
      'Saturday': '🛍️',
      'Sunday': '☀️'
    };
    return icons[day] || '📅';
  };

  const getTimeIcon = (timeRange: string) => {
    if (timeRange.includes('Morning')) return '🌅';
    if (timeRange.includes('Afternoon')) return '☀️';
    if (timeRange.includes('Evening')) return '🌆';
    if (timeRange.includes('Night')) return '🌙';
    return '🕐';
  };

  const getPaymentIcon = (method: string) => {
    const icons: Record<string, string> = {
      'Cash': '💵',
      'Credit Card': '💳',
      'Debit Card': '💳',
      'Digital Wallet': '📱',
      'GCash': '📱',
      'PayMaya': '📱',
      'Bank Transfer': '🏦'
    };
    return icons[method] || '💳';
  };

  const getTrendIcon = (trend: string) => {
    if (trend.includes('Increasing')) return '📈';
    if (trend.includes('Decreasing')) return '📉';
    if (trend.includes('Seasonal')) return '🌟';
    if (trend.includes('Stable')) return '➡️';
    return '📊';
  };

  return (
    <div className={`purchase-pattern-cards ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Peak Day Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">{getDayIcon(data.peakDay.day)}</div>
            <div className="text-right">
              <div className="text-sm opacity-75">Peak Day</div>
              <div className="text-xs opacity-60">Most Active</div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-2xl font-bold mb-1">{data.peakDay.day}</div>
            <div className="text-sm opacity-90">
              {data.peakDay.percentage.toFixed(1)}% of weekly transactions
            </div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-sm font-medium mb-1">
              {formatNumber(data.peakDay.transactions)} transactions
            </div>
            <div className="text-xs opacity-75">
              Peak shopping day of the week
            </div>
          </div>
        </div>

        {/* Popular Time Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">{getTimeIcon(data.popularTime.timeRange)}</div>
            <div className="text-right">
              <div className="text-sm opacity-75">Popular Time</div>
              <div className="text-xs opacity-60">Rush Hours</div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-2xl font-bold mb-1">{data.popularTime.timeRange}</div>
            <div className="text-sm opacity-90">
              {data.popularTime.percentage.toFixed(1)}% of daily transactions
            </div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-sm font-medium mb-1">
              {formatNumber(data.popularTime.transactions)} transactions
            </div>
            <div className="text-xs opacity-75">
              Busiest shopping hours
            </div>
          </div>
        </div>

        {/* Preferred Payment Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">{getPaymentIcon(data.preferredPayment.method)}</div>
            <div className="text-right">
              <div className="text-sm opacity-75">Preferred Payment</div>
              <div className="text-xs opacity-60">Top Method</div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-2xl font-bold mb-1">{data.preferredPayment.method}</div>
            <div className="text-sm opacity-90">
              {data.preferredPayment.percentage.toFixed(1)}% of all payments
            </div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-sm font-medium mb-1">
              {formatNumber(data.preferredPayment.transactions)} transactions
            </div>
            <div className="text-xs opacity-75">
              Most used payment method
            </div>
          </div>
        </div>

        {/* Seasonal Trend Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">{getTrendIcon(data.seasonalTrend.trend)}</div>
            <div className="text-right">
              <div className="text-sm opacity-75">Seasonal Trend</div>
              <div className="text-xs opacity-60">Current Pattern</div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-2xl font-bold mb-1">{data.seasonalTrend.trend}</div>
            <div className="text-sm opacity-90">
              {data.seasonalTrend.percentage > 0 ? '+' : ''}{data.seasonalTrend.percentage.toFixed(1)}% vs last period
            </div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-xs opacity-75">
              {data.seasonalTrend.description}
            </div>
          </div>
        </div>

        {/* Shopping Frequency Card */}
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🔄</div>
            <div className="text-right">
              <div className="text-sm opacity-75">Shopping Frequency</div>
              <div className="text-xs opacity-60">Visit Pattern</div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-2xl font-bold mb-1">{data.shoppingFrequency.pattern}</div>
            <div className="text-sm opacity-90">
              Every {data.shoppingFrequency.avgDays} days on average
            </div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-xs opacity-75">
              {data.shoppingFrequency.description}
            </div>
          </div>
        </div>

        {/* Basket Behavior Card */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🛒</div>
            <div className="text-right">
              <div className="text-sm opacity-75">Basket Behavior</div>
              <div className="text-xs opacity-60">Shopping Style</div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-2xl font-bold mb-1">{data.basketBehavior.pattern}</div>
            <div className="text-sm opacity-90">
              {data.basketBehavior.avgItems} items per basket
            </div>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-xs opacity-75">
              {data.basketBehavior.description}
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Insights Summary */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">🧠 Pattern Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
            <span>
              <strong>{data.peakDay.day}</strong> shows peak activity with {data.peakDay.percentage.toFixed(1)}% of weekly volume
            </span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
            <span>
              <strong>{data.popularTime.timeRange}</strong> captures {data.popularTime.percentage.toFixed(1)}% of daily transactions
            </span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
            <span>
              <strong>{data.preferredPayment.method}</strong> dominates with {data.preferredPayment.percentage.toFixed(1)}% usage
            </span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
            <span>
              Customer frequency is <strong>{data.shoppingFrequency.pattern.toLowerCase()}</strong> with {data.shoppingFrequency.avgDays}-day cycles
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample data for development
export const samplePurchasePatternData: PurchasePattern = {
  peakDay: {
    day: 'Saturday',
    percentage: 28.4,
    transactions: 4378
  },
  popularTime: {
    timeRange: '2:00 PM - 4:00 PM',
    percentage: 24.7,
    transactions: 3821
  },
  preferredPayment: {
    method: 'Cash',
    percentage: 67.3,
    transactions: 10396
  },
  seasonalTrend: {
    trend: 'Summer Increase',
    percentage: 12.8,
    description: 'Beverage and snack purchases up during hot season'
  },
  shoppingFrequency: {
    pattern: 'Regular',
    avgDays: 11,
    description: 'Customers shop approximately every 11 days'
  },
  basketBehavior: {
    pattern: 'Focused Shopper',
    avgItems: 5.7,
    description: 'Customers buy 5-6 items per visit with clear intent'
  }
};