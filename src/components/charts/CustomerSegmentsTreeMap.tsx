// CustomerSegmentsTreeMap.tsx - Customer Segments TreeMap with Brand Color Palette
// Interactive visualization of customer segments for Consumer Insights page
// Version: 1.0.0

import React, { useState } from 'react';

interface CustomerSegment {
  id: string;
  name: string;
  count: number;
  percentage: number;
  avgSpend: number;
  frequency: number;
  characteristics: string[];
  color: string;
  growth: number;
  subcategories?: {
    name: string;
    count: number;
    percentage: number;
    color: string;
  }[];
}

interface CustomerSegmentsTreeMapProps {
  data: CustomerSegment[];
  className?: string;
  height?: number;
}

export default function CustomerSegmentsTreeMap({ 
  data, 
  className = "",
  height = 500 
}: CustomerSegmentsTreeMapProps) {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const totalCustomers = data.reduce((sum, segment) => sum + segment.count, 0);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PH').format(num);
  };

  const getSegmentSize = (segment: CustomerSegment) => {
    return (segment.count / totalCustomers) * 100;
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 10) return '🚀';
    if (growth > 5) return '📈';
    if (growth > 0) return '⬆️';
    if (growth < -5) return '📉';
    if (growth < 0) return '⬇️';
    return '➡️';
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 5) return 'text-green-600';
    if (growth > 0) return 'text-green-500';
    if (growth < -5) return 'text-red-600';
    if (growth < 0) return 'text-red-500';
    return 'text-gray-600';
  };

  const getValueRating = (avgSpend: number) => {
    if (avgSpend > 5000) return { label: 'High Value', icon: '💎', color: 'text-purple-600' };
    if (avgSpend > 2000) return { label: 'Medium Value', icon: '🔷', color: 'text-blue-600' };
    return { label: 'Low Value', icon: '🔹', color: 'text-gray-600' };
  };

  return (
    <div className={`customer-segments-treemap bg-white rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
          <p className="text-sm text-gray-600">Behavioral and value-based segmentation</p>
        </div>
        
        {selectedSegment && (
          <button
            onClick={() => setSelectedSegment(null)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ← View All Segments
          </button>
        )}
      </div>

      {/* TreeMap Visualization */}
      <div className="treemap-container mb-6" style={{ height }}>
        {selectedSegment ? (
          // Detailed view for selected segment
          <div className="h-full">
            {(() => {
              const segmentData = data.find(s => s.id === selectedSegment);
              if (!segmentData || !segmentData.subcategories) return null;

              return (
                <div className="h-full">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{segmentData.name}</h4>
                    <p className="text-sm text-gray-600">
                      {formatNumber(segmentData.count)} customers • {segmentData.percentage.toFixed(1)}% of total
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-5/6">
                    {segmentData.subcategories.map((subcat, index) => (
                      <div
                        key={index}
                        className="relative p-4 rounded-lg text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{ 
                          backgroundColor: subcat.color,
                          minHeight: `${Math.max((subcat.percentage / 100) * 200, 80)}px`
                        }}
                      >
                        <div className="font-semibold text-sm mb-2">{subcat.name}</div>
                        <div className="text-xs opacity-90 mb-1">{subcat.percentage.toFixed(1)}%</div>
                        <div className="text-xs opacity-75">{formatNumber(subcat.count)} customers</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          // Main segments overview
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {data.map((segment, index) => {
              const isHovered = hoveredSegment === segment.id;
              const segmentSize = getSegmentSize(segment);
              const valueRating = getValueRating(segment.avgSpend);
              
              return (
                <div
                  key={index}
                  className={`
                    relative p-6 rounded-lg cursor-pointer transition-all duration-300 transform text-white
                    ${isHovered ? 'scale-105 shadow-xl' : 'hover:scale-102 hover:shadow-lg'}
                  `}
                  style={{ 
                    backgroundColor: segment.color,
                    minHeight: `${Math.max(segmentSize * 4 + 150, 200)}px`
                  }}
                  onClick={() => segment.subcategories && setSelectedSegment(segment.id)}
                  onMouseEnter={() => setHoveredSegment(segment.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  {/* Segment Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-lg">{segment.name}</h4>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${getGrowthColor(segment.growth)} bg-white bg-opacity-20`}>
                        {getGrowthIcon(segment.growth)} {segment.growth > 0 ? '+' : ''}{segment.growth.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="text-sm opacity-90 mb-1">
                      {formatNumber(segment.count)} customers ({segment.percentage.toFixed(1)}%)
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-75">Avg Spend</span>
                      <span className="font-semibold">{formatCurrency(segment.avgSpend)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-75">Frequency</span>
                      <span className="font-semibold">{segment.frequency}x/month</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="opacity-75">Value</span>
                      <span className={`font-semibold ${valueRating.color} bg-white bg-opacity-20 px-2 py-1 rounded`}>
                        {valueRating.icon} {valueRating.label}
                      </span>
                    </div>
                  </div>

                  {/* Characteristics */}
                  <div className="mb-4">
                    <div className="text-xs opacity-75 mb-2">Key Traits:</div>
                    <div className="flex flex-wrap gap-1">
                      {segment.characteristics.slice(0, 3).map((trait, traitIndex) => (
                        <span 
                          key={traitIndex}
                          className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Subcategories indicator */}
                  {segment.subcategories && (
                    <div className="absolute bottom-4 right-4">
                      <div className="text-xs opacity-75 flex items-center">
                        <span className="mr-1">🔍</span>
                        {segment.subcategories.length} subcategories
                      </div>
                    </div>
                  )}

                  {/* Hover tooltip */}
                  {isHovered && (
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-10">
                      <div className="font-semibold">{segment.name}</div>
                      <div>Total Value: {formatCurrency(segment.count * segment.avgSpend)}</div>
                      {segment.subcategories && <div>Click to explore subsegments</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Segment Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {data.length}
          </div>
          <div className="text-sm text-gray-600">Total Segments</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {formatNumber(totalCustomers)}
          </div>
          <div className="text-sm text-gray-600">Total Customers</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(data.reduce((sum, s) => sum + (s.count * s.avgSpend), 0) / totalCustomers)}
          </div>
          <div className="text-sm text-gray-600">Avg Customer Value</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {data.filter(s => s.growth > 0).length}/{data.length}
          </div>
          <div className="text-sm text-gray-600">Growing Segments</div>
        </div>
      </div>

      {/* Segment Insights */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Segment Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-blue-800">
              {data.reduce((max, current) => current.count > max.count ? current : max).name} is the largest segment ({data.reduce((max, current) => current.count > max.count ? current : max).percentage.toFixed(1)}%)
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            <span className="text-blue-800">
              {data.reduce((max, current) => current.avgSpend > max.avgSpend ? current : max).name} has highest value ({formatCurrency(data.reduce((max, current) => current.avgSpend > max.avgSpend ? current : max).avgSpend)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample data for development
export const sampleCustomerSegmentsData: CustomerSegment[] = [
  {
    id: 'premium_loyalists',
    name: 'Premium Loyalists',
    count: 1847,
    percentage: 20.7,
    avgSpend: 8750,
    frequency: 4.2,
    characteristics: ['High Income', 'Brand Conscious', 'Quality Focused'],
    color: '#7C3AED',
    growth: 12.4,
    subcategories: [
      { name: 'Luxury Seekers', count: 739, percentage: 40, color: '#581C87' },
      { name: 'Brand Advocates', count: 554, percentage: 30, color: '#6B21A8' },
      { name: 'Status Buyers', count: 369, percentage: 20, color: '#7C2D12' },
      { name: 'Quality First', count: 185, percentage: 10, color: '#92400E' }
    ]
  },
  {
    id: 'value_hunters',
    name: 'Value Hunters',
    count: 2681,
    percentage: 30.0,
    avgSpend: 2350,
    frequency: 2.8,
    characteristics: ['Price Sensitive', 'Promotion Seekers', 'Bulk Buyers'],
    color: '#DC2626',
    growth: 5.7,
    subcategories: [
      { name: 'Deal Seekers', count: 1072, percentage: 40, color: '#991B1B' },
      { name: 'Bulk Buyers', count: 804, percentage: 30, color: '#B91C1C' },
      { name: 'Coupon Users', count: 536, percentage: 20, color: '#DC2626' },
      { name: 'Sale Waiters', count: 269, percentage: 10, color: '#EF4444' }
    ]
  },
  {
    id: 'convenience_shoppers',
    name: 'Convenience Shoppers',
    count: 2234,
    percentage: 25.0,
    avgSpend: 3420,
    frequency: 3.5,
    characteristics: ['Time Pressed', 'Location Driven', 'Quick Purchases'],
    color: '#059669',
    growth: 8.2,
    subcategories: [
      { name: 'Busy Professionals', count: 893, percentage: 40, color: '#047857' },
      { name: 'Quick Grabbers', count: 670, percentage: 30, color: '#059669' },
      { name: 'Location Loyal', count: 447, percentage: 20, color: '#10B981' },
      { name: 'Time Savers', count: 224, percentage: 10, color: '#34D399' }
    ]
  },
  {
    id: 'occasional_buyers',
    name: 'Occasional Buyers',
    count: 1340,
    percentage: 15.0,
    avgSpend: 1875,
    frequency: 1.2,
    characteristics: ['Infrequent', 'Need Based', 'Price Conscious'],
    color: '#D97706',
    growth: -2.1,
    subcategories: [
      { name: 'Holiday Shoppers', count: 536, percentage: 40, color: '#B45309' },
      { name: 'Event Driven', count: 402, percentage: 30, color: '#D97706' },
      { name: 'Need Based', count: 268, percentage: 20, color: '#F59E0B' },
      { name: 'Infrequent', count: 134, percentage: 10, color: '#FBBF24' }
    ]
  },
  {
    id: 'explorers',
    name: 'Explorers',
    count: 830,
    percentage: 9.3,
    avgSpend: 4250,
    frequency: 2.1,
    characteristics: ['Variety Seekers', 'New Products', 'Experimental'],
    color: '#2563EB',
    growth: 15.6,
    subcategories: [
      { name: 'Trend Followers', count: 332, percentage: 40, color: '#1D4ED8' },
      { name: 'Variety Seekers', count: 249, percentage: 30, color: '#2563EB' },
      { name: 'Early Adopters', count: 166, percentage: 20, color: '#3B82F6' },
      { name: 'Experimenters', count: 83, percentage: 10, color: '#60A5FA' }
    ]
  }
];