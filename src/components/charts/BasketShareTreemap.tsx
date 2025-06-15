// BasketShareTreemap.tsx - Category→Brand Basket Share Treemap Component
// Interactive treemap showing category and brand distribution
// Version: 1.0.0

import React, { useState } from 'react';

interface TreemapData {
  category: string;
  brands: {
    name: string;
    value: number;
    percentage: number;
    color: string;
    growth?: number;
  }[];
  totalValue: number;
  percentage: number;
}

interface BasketShareTreemapProps {
  data: TreemapData[];
  className?: string;
  height?: number;
}

export default function BasketShareTreemap({ 
  data, 
  className = "",
  height = 400 
}: BasketShareTreemapProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{ category: string; brand?: string } | null>(null);

  const totalValue = data.reduce((sum, category) => sum + category.totalValue, 0);
  
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

  const getCategorySize = (category: TreemapData) => {
    return (category.totalValue / totalValue) * 100;
  };

  const getBrandSize = (brand: any, categoryTotal: number) => {
    return (brand.value / categoryTotal) * 100;
  };

  const getGrowthIcon = (growth?: number) => {
    if (!growth) return '';
    if (growth > 5) return '🚀';
    if (growth > 0) return '📈';
    if (growth < -5) return '📉';
    return '➡️';
  };

  const getGrowthColor = (growth?: number) => {
    if (!growth) return 'text-gray-500';
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className={`basket-share-treemap bg-white rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Basket Share Analysis</h3>
          <p className="text-sm text-gray-600">Category → Brand distribution</p>
        </div>
        
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ← View All Categories
          </button>
        )}
      </div>

      {/* Treemap Visualization */}
      <div className="treemap-container mb-6" style={{ height }}>
        {selectedCategory ? (
          // Detailed brand view for selected category
          <div className="h-full">
            {(() => {
              const categoryData = data.find(c => c.category === selectedCategory);
              if (!categoryData) return null;

              return (
                <div className="h-full">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{selectedCategory}</h4>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(categoryData.totalValue)} • {categoryData.percentage.toFixed(1)}% of total
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 h-5/6">
                    {categoryData.brands.map((brand, index) => {
                      const isHovered = hoveredItem?.category === selectedCategory && hoveredItem?.brand === brand.name;
                      
                      return (
                        <div
                          key={index}
                          className={`
                            relative p-4 rounded-lg cursor-pointer transition-all duration-300 transform
                            ${isHovered ? 'scale-105 shadow-lg' : 'hover:scale-102 hover:shadow-md'}
                          `}
                          style={{ 
                            backgroundColor: brand.color,
                            minHeight: `${Math.max(getBrandSize(brand, categoryData.totalValue) * 2, 80)}px`
                          }}
                          onMouseEnter={() => setHoveredItem({ category: selectedCategory, brand: brand.name })}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <div className="text-white">
                            <div className="font-semibold text-sm mb-1 line-clamp-2">
                              {brand.name}
                            </div>
                            <div className="text-xs opacity-90">
                              {brand.percentage.toFixed(1)}%
                            </div>
                            <div className="text-xs opacity-75">
                              {formatCurrency(brand.value)}
                            </div>
                            {brand.growth !== undefined && (
                              <div className="mt-1 text-xs">
                                <span className={getGrowthColor(brand.growth)}>
                                  {getGrowthIcon(brand.growth)} {brand.growth > 0 ? '+' : ''}{brand.growth.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Tooltip */}
                          {isHovered && (
                            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                              <div className="font-semibold">{brand.name}</div>
                              <div>{formatCurrency(brand.value)} ({brand.percentage.toFixed(1)}%)</div>
                              {brand.growth !== undefined && (
                                <div>{brand.growth > 0 ? '+' : ''}{brand.growth.toFixed(1)}% growth</div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          // Category overview
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 h-full">
            {data.map((category, index) => {
              const isHovered = hoveredItem?.category === category.category;
              const categorySize = getCategorySize(category);
              
              return (
                <div
                  key={index}
                  className={`
                    relative p-4 rounded-lg cursor-pointer transition-all duration-300 transform
                    bg-gradient-to-br from-blue-500 to-blue-600 text-white
                    ${isHovered ? 'scale-105 shadow-lg from-blue-600 to-blue-700' : 'hover:scale-102 hover:shadow-md'}
                  `}
                  style={{ 
                    minHeight: `${Math.max(categorySize * 3, 120)}px`
                  }}
                  onClick={() => setSelectedCategory(category.category)}
                  onMouseEnter={() => setHoveredItem({ category: category.category })}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div>
                    <div className="font-semibold text-lg mb-2">
                      {category.category}
                    </div>
                    <div className="text-sm opacity-90 mb-1">
                      {category.percentage.toFixed(1)}% of basket
                    </div>
                    <div className="text-sm opacity-75 mb-2">
                      {formatCurrency(category.totalValue)}
                    </div>
                    <div className="text-xs opacity-75">
                      {category.brands.length} brands
                    </div>
                  </div>
                  
                  {/* Brand preview dots */}
                  <div className="absolute bottom-3 right-3 flex flex-wrap gap-1">
                    {category.brands.slice(0, 6).map((brand, brandIndex) => (
                      <div
                        key={brandIndex}
                        className="w-2 h-2 rounded-full bg-white opacity-60"
                        title={brand.name}
                      ></div>
                    ))}
                    {category.brands.length > 6 && (
                      <div className="text-xs opacity-60">+{category.brands.length - 6}</div>
                    )}
                  </div>
                  
                  {/* Click indicator */}
                  <div className="absolute top-3 right-3 text-xs opacity-60">
                    🔍
                  </div>
                  
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      Click to explore {category.brands.length} brands
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {data.length}
          </div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {data.reduce((sum, c) => sum + c.brands.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Brands</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(totalValue)}
          </div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {data[0] ? data[0].category : 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Top Category</div>
        </div>
      </div>

      {/* Legend */}
      <div className="text-center text-xs text-gray-500">
        💡 Click on categories to explore brands • Hover for details • Size represents market share
      </div>
    </div>
  );
}

// Sample data for development
export const sampleBasketShareData: TreemapData[] = [
  {
    category: 'Beverages',
    totalValue: 1245600,
    percentage: 32.4,
    brands: [
      { name: 'Coca-Cola', value: 485672, percentage: 39.0, color: '#DC2626', growth: 5.2 },
      { name: 'Pepsi', value: 312450, percentage: 25.1, color: '#2563EB', growth: -2.1 },
      { name: 'Sprite', value: 198543, percentage: 15.9, color: '#16A34A', growth: 8.7 },
      { name: 'RC Cola', value: 134567, percentage: 10.8, color: '#7C2D12', growth: 1.3 },
      { name: 'Royal', value: 114368, percentage: 9.2, color: '#7C3AED', growth: -0.5 }
    ]
  },
  {
    category: 'Snacks',
    totalValue: 892340,
    percentage: 23.2,
    brands: [
      { name: 'Lay\'s', value: 267891, percentage: 30.0, color: '#EAB308', growth: 12.4 },
      { name: 'Pringles', value: 178456, percentage: 20.0, color: '#DC2626', growth: 6.8 },
      { name: 'Chippy', value: 142674, percentage: 16.0, color: '#F97316', growth: 3.2 },
      { name: 'Nova', value: 125234, percentage: 14.0, color: '#8B5CF6', growth: -1.4 },
      { name: 'Piatos', value: 89234, percentage: 10.0, color: '#06B6D4', growth: 4.7 },
      { name: 'Oishi', value: 88851, percentage: 10.0, color: '#84CC16', growth: 2.1 }
    ]
  },
  {
    category: 'Personal Care',
    totalValue: 645780,
    percentage: 16.8,
    brands: [
      { name: 'Colgate', value: 193734, percentage: 30.0, color: '#DC2626', growth: 4.1 },
      { name: 'Head & Shoulders', value: 161445, percentage: 25.0, color: '#2563EB', growth: 7.3 },
      { name: 'Palmolive', value: 129156, percentage: 20.0, color: '#16A34A', growth: -0.8 },
      { name: 'Close-Up', value: 97167, percentage: 15.0, color: '#7C3AED', growth: 2.9 },
      { name: 'Safeguard', value: 64578, percentage: 10.0, color: '#F97316', growth: 1.7 }
    ]
  },
  {
    category: 'Household',
    totalValue: 534210,
    percentage: 13.9,
    brands: [
      { name: 'Tide', value: 160263, percentage: 30.0, color: '#F97316', growth: 6.2 },
      { name: 'Joy', value: 133553, percentage: 25.0, color: '#16A34A', growth: 3.4 },
      { name: 'Surf', value: 106842, percentage: 20.0, color: '#2563EB', growth: 1.8 },
      { name: 'Ariel', value: 80132, percentage: 15.0, color: '#7C2D12', growth: -2.3 },
      { name: 'Downy', value: 53421, percentage: 10.0, color: '#8B5CF6', growth: 4.9 }
    ]
  },
  {
    category: 'Dairy',
    totalValue: 523070,
    percentage: 13.6,
    brands: [
      { name: 'Nestle', value: 209228, percentage: 40.0, color: '#DC2626', growth: 8.1 },
      { name: 'Alaska', value: 156922, percentage: 30.0, color: '#2563EB', growth: 5.7 },
      { name: 'Bear Brand', value: 104614, percentage: 20.0, color: '#F59E0B', growth: 2.3 },
      { name: 'Anchor', value: 52307, percentage: 10.0, color: '#10B981', growth: -1.2 }
    ]
  }
];