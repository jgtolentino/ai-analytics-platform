// src/components/charts/DailyTransactionChart.tsx
// Daily transaction volume line chart with time-series data
// Version: 1.0.0

import React, { useState } from 'react';

// Sample data for daily transactions over 30 days
export const sampleDailyTransactionData = [
  { date: '2025-05-16', transactions: 420, revenue: 102450 },
  { date: '2025-05-17', transactions: 385, revenue: 94870 },
  { date: '2025-05-18', transactions: 610, revenue: 149850 }, // Saturday peak
  { date: '2025-05-19', transactions: 455, revenue: 111825 },
  { date: '2025-05-20', transactions: 398, revenue: 97902 },
  { date: '2025-05-21', transactions: 412, revenue: 101340 },
  { date: '2025-05-22', transactions: 389, revenue: 95751 },
  { date: '2025-05-23', transactions: 434, revenue: 106686 },
  { date: '2025-05-24', transactions: 401, revenue: 98643 },
  { date: '2025-05-25', transactions: 652, revenue: 160356 }, // Saturday peak
  { date: '2025-05-26', transactions: 478, revenue: 117594 },
  { date: '2025-05-27', transactions: 423, revenue: 104067 },
  { date: '2025-05-28', transactions: 445, revenue: 109485 },
  { date: '2025-05-29', transactions: 418, revenue: 102834 },
  { date: '2025-05-30', transactions: 456, revenue: 112128 },
  { date: '2025-05-31', transactions: 441, revenue: 108423 },
  { date: '2025-06-01', transactions: 635, revenue: 156195 }, // Saturday peak
  { date: '2025-06-02', transactions: 492, revenue: 121032 },
  { date: '2025-06-03', transactions: 467, revenue: 114831 },
  { date: '2025-06-04', transactions: 489, revenue: 120267 },
  { date: '2025-06-05', transactions: 445, revenue: 109485 },
  { date: '2025-06-06', transactions: 478, revenue: 117594 },
  { date: '2025-06-07', transactions: 456, revenue: 112128 },
  { date: '2025-06-08', transactions: 671, revenue: 164973 }, // Saturday peak
  { date: '2025-06-09', transactions: 512, revenue: 125952 },
  { date: '2025-06-10', transactions: 489, revenue: 120267 },
  { date: '2025-06-11', transactions: 502, revenue: 123486 },
  { date: '2025-06-12', transactions: 467, revenue: 114831 },
  { date: '2025-06-13', transactions: 498, revenue: 122502 },
  { date: '2025-06-14', transactions: 445, revenue: 109485 },
];

interface DailyTransactionChartProps {
  data?: typeof sampleDailyTransactionData;
  height?: number;
}

export default function DailyTransactionChart({ 
  data = sampleDailyTransactionData,
  height = 320 
}: DailyTransactionChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'transactions' | 'revenue'>('transactions');

  // Calculate chart dimensions
  const maxTransactions = Math.max(...data.map(d => d.transactions));
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const chartWidth = 800;
  const chartHeight = height - 80;
  const padding = { top: 20, right: 60, bottom: 40, left: 60 };

  // Calculate points for line chart
  const points = data.map((item, index) => {
    const x = padding.left + (index / (data.length - 1)) * (chartWidth - padding.left - padding.right);
    const value = viewMode === 'transactions' ? item.transactions : item.revenue;
    const maxValue = viewMode === 'transactions' ? maxTransactions : maxRevenue;
    const y = padding.top + (1 - value / maxValue) * (chartHeight - padding.top - padding.bottom);
    
    return { x, y, value, date: item.date, index };
  });

  // Create SVG path for line
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  // Create area path for gradient fill
  const areaPath = `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format value for display
  const formatValue = (value: number) => {
    if (viewMode === 'transactions') {
      return value.toLocaleString();
    } else {
      return `₱${(value / 1000).toFixed(0)}K`;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Daily Transaction Trends</h3>
          <p className="text-sm text-gray-600">30-day time-series analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('transactions')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'transactions'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setViewMode('revenue')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'revenue'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Revenue
          </button>
        </div>
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="50" height="40" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          <rect width={chartWidth} height={chartHeight} fill="url(#grid)" />
          
          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
            className="transition-all duration-300"
          />
          
          {/* Main line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === index ? 6 : 4}
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-200 cursor-pointer hover:r-6"
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const maxValue = viewMode === 'transactions' ? maxTransactions : maxRevenue;
            const value = maxValue * ratio;
            const y = padding.top + (1 - ratio) * (chartHeight - padding.top - padding.bottom);
            
            return (
              <g key={ratio}>
                <line
                  x1={padding.left - 5}
                  y1={y}
                  x2={padding.left}
                  y2={y}
                  stroke="#6b7280"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-600"
                >
                  {formatValue(value)}
                </text>
              </g>
            );
          })}
          
          {/* X-axis labels (every 5th day) */}
          {points.filter((_, index) => index % 5 === 0).map((point) => (
            <g key={point.index}>
              <line
                x1={point.x}
                y1={chartHeight - padding.bottom}
                x2={point.x}
                y2={chartHeight - padding.bottom + 5}
                stroke="#6b7280"
                strokeWidth="1"
              />
              <text
                x={point.x}
                y={chartHeight - padding.bottom + 18}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {formatDate(point.date)}
              </text>
            </g>
          ))}
        </svg>
        
        {/* Tooltip */}
        {hoveredPoint !== null && (
          <div
            className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none z-10"
            style={{
              left: points[hoveredPoint].x - 50,
              top: points[hoveredPoint].y - 50,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="text-xs font-medium">
              {formatDate(data[hoveredPoint].date)}
            </div>
            <div className="text-sm font-semibold">
              {viewMode === 'transactions' 
                ? `${data[hoveredPoint].transactions} transactions`
                : `₱${data[hoveredPoint].revenue.toLocaleString()}`
              }
            </div>
          </div>
        )}
      </div>
      
      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-900">
            {data.reduce((sum, d) => sum + d.transactions, 0).toLocaleString()}
          </div>
          <div className="text-sm text-blue-700">Total Transactions</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-900">
            {Math.round(data.reduce((sum, d) => sum + d.transactions, 0) / data.length).toLocaleString()}
          </div>
          <div className="text-sm text-green-700">Daily Average</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-900">
            {Math.max(...data.map(d => d.transactions)).toLocaleString()}
          </div>
          <div className="text-sm text-purple-700">Peak Day</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-900">
            +8.2%
          </div>
          <div className="text-sm text-orange-700">Growth Trend</div>
        </div>
      </div>
    </div>
  );
}