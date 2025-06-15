// PaymentGauges.tsx - Payment Method Usage Gauge Charts
// Replaces traditional charts with modern gauge/progress circle visualizations
// Version: 1.0.0

import React from 'react';

interface PaymentMethodData {
  method: string;
  icon: string;
  percentage: number;
  transactions: number;
  growth: number;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface PaymentGaugesProps {
  data: PaymentMethodData[];
  className?: string;
}

export default function PaymentGauges({ 
  data, 
  className = "" 
}: PaymentGaugesProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PH').format(num);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Circular progress component
  const CircularGauge = ({ 
    percentage, 
    color, 
    size = 120,
    strokeWidth = 8 
  }: { 
    percentage: number; 
    color: string; 
    size?: number;
    strokeWidth?: number;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            style={{
              strokeDasharray,
              strokeDashoffset,
              transition: 'stroke-dashoffset 2s ease-in-out'
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {percentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Linear progress component
  const LinearGauge = ({ 
    percentage, 
    color, 
    height = 12 
  }: { 
    percentage: number; 
    color: string; 
    height?: number;
  }) => (
    <div className="w-full bg-gray-200 rounded-full overflow-hidden" style={{ height }}>
      <div
        className="h-full rounded-full transition-all duration-2000 ease-out"
        style={{
          width: `${percentage}%`,
          backgroundColor: color
        }}
      ></div>
    </div>
  );

  return (
    <div className={`payment-gauges bg-white rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Payment Method Usage</h3>
          <p className="text-sm text-gray-600">Transaction distribution by payment type</p>
        </div>
        <div className="text-sm text-gray-500">
          {formatNumber(data.reduce((sum, item) => sum + item.transactions, 0))} total transactions
        </div>
      </div>

      {/* Circular Gauges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {data.map((payment, index) => (
          <div key={index} className="text-center">
            <div className="flex justify-center mb-3">
              <CircularGauge
                percentage={payment.percentage}
                color={payment.color}
                size={100}
                strokeWidth={6}
              />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center">
                <span className="text-xl mr-2">{payment.icon}</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {payment.method}
                </span>
              </div>
              
              <div className="text-xs text-gray-600">
                {formatNumber(payment.transactions)} transactions
              </div>
              
              <div className={`flex items-center justify-center text-xs ${getTrendColor(payment.trend)}`}>
                <span className="mr-1">{getTrendIcon(payment.trend)}</span>
                <span>{payment.growth > 0 ? '+' : ''}{payment.growth.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Linear Progress Bars */}
      <div className="space-y-4 mb-6">
        <h4 className="text-md font-semibold text-gray-900">Usage Breakdown</h4>
        {data.map((payment, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg mr-2">{payment.icon}</span>
                <span className="font-medium text-gray-700">{payment.method}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900">
                  {payment.percentage.toFixed(1)}%
                </span>
                <span className={`text-xs ${getTrendColor(payment.trend)}`}>
                  {getTrendIcon(payment.trend)} {payment.growth > 0 ? '+' : ''}{payment.growth.toFixed(1)}%
                </span>
              </div>
            </div>
            <LinearGauge
              percentage={payment.percentage}
              color={payment.color}
              height={8}
            />
            <div className="text-xs text-gray-500">
              {formatNumber(payment.transactions)} transactions
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {data[0]?.method || 'N/A'}
          </div>
          <div className="text-xs text-gray-600">Most Popular</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {data.filter(p => p.trend === 'up').length}/{data.length}
          </div>
          <div className="text-xs text-gray-600">Growing Methods</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {(data.slice(0, 2).reduce((sum, p) => sum + p.percentage, 0)).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600">Top 2 Methods</div>
        </div>
      </div>

      {/* Payment Insights */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💳 Payment Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-blue-800">
              {data[0]?.method} dominates with {data[0]?.percentage.toFixed(1)}% market share
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-blue-800">
              Digital payments growing at {data.filter(p => p.method.includes('Digital') || p.method.includes('GCash') || p.method.includes('PayMaya')).reduce((sum, p) => sum + p.growth, 0).toFixed(1)}% average
            </span>
          </div>
        </div>
      </div>

      {/* Responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .payment-gauges .grid-cols-4 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .payment-gauges .text-lg {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}

// Sample data for development
export const samplePaymentMethodsData: PaymentMethodData[] = [
  {
    method: 'Cash',
    icon: '💵',
    percentage: 67.3,
    transactions: 10396,
    growth: -2.4,
    color: '#16A34A',
    trend: 'down'
  },
  {
    method: 'Credit Card',
    icon: '💳',
    percentage: 18.7,
    transactions: 2889,
    growth: 4.2,
    color: '#2563EB',
    trend: 'up'
  },
  {
    method: 'GCash',
    icon: '📱',
    percentage: 8.9,
    transactions: 1375,
    growth: 23.6,
    color: '#0EA5E9',
    trend: 'up'
  },
  {
    method: 'Debit Card',
    icon: '💳',
    percentage: 3.4,
    transactions: 525,
    growth: 1.8,
    color: '#7C3AED',
    trend: 'up'
  },
  {
    method: 'PayMaya',
    icon: '📱',
    percentage: 1.2,
    transactions: 185,
    growth: 45.7,
    color: '#EC4899',
    trend: 'up'
  },
  {
    method: 'Bank Transfer',
    icon: '🏦',
    percentage: 0.5,
    transactions: 77,
    growth: 12.3,
    color: '#F59E0B',
    trend: 'up'
  }
];