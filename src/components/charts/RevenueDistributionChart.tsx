// src/components/charts/RevenueDistributionChart.tsx
// Revenue distribution box plot showing statistical patterns
// Version: 1.0.0

import React, { useState } from 'react';

// Sample data for revenue distribution (transaction values)
export const sampleRevenueDistributionData = {
  daily: {
    q1: 85000,      // 25th percentile 
    median: 115000, // 50th percentile
    q3: 148000,     // 75th percentile
    min: 45000,     // Minimum (excluding outliers)
    max: 185000,    // Maximum (excluding outliers)
    outliers: [220000, 240000, 35000, 28000], // Outlier values
    mean: 118500
  },
  weekly: {
    q1: 620000,
    median: 785000,
    q3: 925000,
    min: 420000,
    max: 1100000,
    outliers: [1350000, 1420000, 380000],
    mean: 812000
  },
  monthly: {
    q1: 2800000,
    median: 3400000,
    q3: 3950000,
    min: 2200000,
    max: 4600000,
    outliers: [5200000, 1950000],
    mean: 3485000
  }
};

const categories = [
  { key: 'daily', label: 'Daily Revenue', color: '#3b82f6' },
  { key: 'weekly', label: 'Weekly Revenue', color: '#10b981' },
  { key: 'monthly', label: 'Monthly Revenue', color: '#8b5cf6' }
];

interface RevenueDistributionChartProps {
  data?: typeof sampleRevenueDistributionData;
  height?: number;
}

export default function RevenueDistributionChart({ 
  data = sampleRevenueDistributionData,
  height = 320 
}: RevenueDistributionChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('daily');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  // Calculate chart dimensions
  const chartWidth = 600;
  const chartHeight = height - 80;
  const padding = { top: 40, right: 80, bottom: 60, left: 80 };
  const boxWidth = 80;
  const boxSpacing = 150;

  // Get global min/max for consistent scaling
  const allValues = Object.values(data).flatMap(d => [d.min, d.max, ...d.outliers]);
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);

  // Scale function
  const scale = (value: number) => {
    return padding.top + ((globalMax - value) / (globalMax - globalMin)) * (chartHeight - padding.top - padding.bottom);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `₱${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `₱${(value / 1000).toFixed(0)}K`;
    } else {
      return `₱${value.toLocaleString()}`;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Distribution Analysis</h3>
          <p className="text-sm text-gray-600">Statistical distribution of transaction values</p>
        </div>
        <div className="flex items-center space-x-2">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category.key
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedCategory === category.key ? category.color : undefined
              }}
            >
              {category.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + ratio * (chartHeight - padding.top - padding.bottom);
            const value = globalMax - (globalMax - globalMin) * ratio;
            
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {formatCurrency(value)}
                </text>
              </g>
            );
          })}

          {/* Box plots */}
          {categories.map((category, index) => {
            const categoryData = data[category.key as keyof typeof data];
            const x = padding.left + index * boxSpacing + boxSpacing / 2;
            const isSelected = selectedCategory === category.key;
            const opacity = selectedCategory === 'all' || isSelected ? 1 : 0.3;

            // Box plot elements
            const q1Y = scale(categoryData.q1);
            const medianY = scale(categoryData.median);
            const q3Y = scale(categoryData.q3);
            const minY = scale(categoryData.min);
            const maxY = scale(categoryData.max);
            const meanY = scale(categoryData.mean);

            return (
              <g key={category.key} opacity={opacity}>
                {/* Whiskers */}
                <line
                  x1={x}
                  y1={minY}
                  x2={x}
                  y2={q1Y}
                  stroke={category.color}
                  strokeWidth="2"
                />
                <line
                  x1={x}
                  y1={q3Y}
                  x2={x}
                  y2={maxY}
                  stroke={category.color}
                  strokeWidth="2"
                />
                
                {/* Min/Max lines */}
                <line
                  x1={x - boxWidth / 4}
                  y1={minY}
                  x2={x + boxWidth / 4}
                  y2={minY}
                  stroke={category.color}
                  strokeWidth="2"
                />
                <line
                  x1={x - boxWidth / 4}
                  y1={maxY}
                  x2={x + boxWidth / 4}
                  y2={maxY}
                  stroke={category.color}
                  strokeWidth="2"
                />

                {/* Box (IQR) */}
                <rect
                  x={x - boxWidth / 2}
                  y={q3Y}
                  width={boxWidth}
                  height={q1Y - q3Y}
                  fill={category.color}
                  fillOpacity="0.3"
                  stroke={category.color}
                  strokeWidth="2"
                  rx="4"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredElement(`${category.key}-box`)}
                  onMouseLeave={() => setHoveredElement(null)}
                />

                {/* Median line */}
                <line
                  x1={x - boxWidth / 2}
                  y1={medianY}
                  x2={x + boxWidth / 2}
                  y2={medianY}
                  stroke={category.color}
                  strokeWidth="3"
                />

                {/* Mean indicator */}
                <circle
                  cx={x}
                  cy={meanY}
                  r="4"
                  fill="white"
                  stroke={category.color}
                  strokeWidth="2"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredElement(`${category.key}-mean`)}
                  onMouseLeave={() => setHoveredElement(null)}
                />

                {/* Outliers */}
                {categoryData.outliers.map((outlier, outlierIndex) => (
                  <circle
                    key={outlierIndex}
                    cx={x + (outlierIndex % 2 === 0 ? -15 : 15)}
                    cy={scale(outlier)}
                    r="3"
                    fill={category.color}
                    fillOpacity="0.7"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredElement(`${category.key}-outlier-${outlierIndex}`)}
                    onMouseLeave={() => setHoveredElement(null)}
                  />
                ))}

                {/* Category label */}
                <text
                  x={x}
                  y={chartHeight - padding.bottom + 20}
                  textAnchor="middle"
                  className="text-sm font-medium fill-gray-700"
                >
                  {category.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredElement && (
          <div className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none z-10 text-sm">
            {hoveredElement.includes('box') && (
              <div>
                <div className="font-medium">Interquartile Range (IQR)</div>
                <div>25th-75th percentile</div>
              </div>
            )}
            {hoveredElement.includes('mean') && (
              <div>
                <div className="font-medium">Mean Value</div>
                <div>Average revenue</div>
              </div>
            )}
            {hoveredElement.includes('outlier') && (
              <div>
                <div className="font-medium">Outlier</div>
                <div>Unusual value outside normal range</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-2 bg-blue-300 rounded mr-2"></div>
          <span>IQR (25th-75th percentile)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-blue-600 mr-2"></div>
          <span>Median</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-white border-2 border-blue-600 rounded-full mr-2"></div>
          <span>Mean</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
          <span>Outliers</span>
        </div>
      </div>

      {/* Statistics summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {selectedCategory !== 'all' && (() => {
          const categoryData = data[selectedCategory as keyof typeof data];
          const category = categories.find(c => c.key === selectedCategory)!;
          
          return [
            { label: 'Min', value: categoryData.min, color: 'bg-gray-50' },
            { label: 'Q1', value: categoryData.q1, color: 'bg-blue-50' },
            { label: 'Median', value: categoryData.median, color: 'bg-blue-100' },
            { label: 'Q3', value: categoryData.q3, color: 'bg-blue-50' },
            { label: 'Max', value: categoryData.max, color: 'bg-gray-50' }
          ].map((stat, index) => (
            <div key={index} className={`text-center p-3 ${stat.color} rounded-lg`}>
              <div className="text-sm font-medium text-gray-700">{stat.label}</div>
              <div className="text-lg font-bold" style={{ color: category.color }}>
                {formatCurrency(stat.value)}
              </div>
            </div>
          ));
        })()}
      </div>

      {/* Insights */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">📊 Distribution Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
          <div className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
            <span>Daily revenue shows consistent distribution with few outliers</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
            <span>Monthly revenue has wider spread indicating seasonal variation</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
            <span>Median values are slightly below mean, suggesting right skew</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
            <span>Outliers indicate special events or promotional periods</span>
          </div>
        </div>
      </div>
    </div>
  );
}