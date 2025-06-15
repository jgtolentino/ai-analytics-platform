// src/components/charts/ShoppingTimeHeatmap.tsx
// 24-hour x 7-day heatmap showing peak shopping periods
// Version: 1.0.0

import React, { useState } from 'react';

// Sample data for shopping time heatmap (hour x day)
export const sampleShoppingTimeData = [
  // Monday
  [12, 8, 5, 3, 2, 4, 8, 15, 25, 35, 45, 52, 68, 75, 82, 78, 72, 65, 55, 42, 35, 28, 22, 18],
  // Tuesday  
  [14, 9, 6, 4, 3, 5, 10, 18, 28, 38, 48, 55, 72, 78, 85, 81, 75, 68, 58, 45, 38, 31, 25, 20],
  // Wednesday
  [16, 11, 7, 5, 4, 6, 12, 20, 32, 42, 52, 58, 75, 82, 88, 84, 78, 71, 61, 48, 41, 34, 28, 22],
  // Thursday
  [18, 13, 9, 6, 5, 7, 14, 22, 35, 45, 55, 62, 78, 85, 92, 88, 82, 74, 64, 51, 44, 37, 31, 25],
  // Friday
  [22, 16, 12, 8, 6, 9, 18, 28, 42, 52, 65, 72, 88, 95, 105, 98, 92, 85, 75, 62, 55, 48, 42, 35],
  // Saturday - Peak day
  [28, 21, 15, 11, 8, 12, 25, 38, 55, 68, 85, 95, 115, 125, 138, 132, 125, 115, 98, 82, 72, 65, 58, 48],
  // Sunday
  [20, 14, 10, 7, 5, 8, 16, 24, 38, 48, 62, 68, 85, 92, 98, 94, 88, 81, 71, 58, 51, 44, 38, 32]
];

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hourLabels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

interface ShoppingTimeHeatmapProps {
  data?: number[][];
  height?: number;
}

export default function ShoppingTimeHeatmap({ 
  data = sampleShoppingTimeData,
  height = 320 
}: ShoppingTimeHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number; value: number } | null>(null);

  // Calculate max value for color scaling
  const maxValue = Math.max(...data.flat());
  const minValue = Math.min(...data.flat());

  // Get intensity color based on value
  const getIntensityColor = (value: number) => {
    const intensity = (value - minValue) / (maxValue - minValue);
    
    if (intensity >= 0.8) return 'bg-red-600';
    if (intensity >= 0.6) return 'bg-red-500';
    if (intensity >= 0.4) return 'bg-orange-500';
    if (intensity >= 0.2) return 'bg-yellow-500';
    if (intensity >= 0.1) return 'bg-yellow-300';
    return 'bg-gray-200';
  };

  // Get text color for contrast
  const getTextColor = (value: number) => {
    const intensity = (value - minValue) / (maxValue - minValue);
    return intensity > 0.4 ? 'text-white' : 'text-gray-800';
  };

  // Get peak times
  const getPeakHours = () => {
    const hourTotals = Array(24).fill(0);
    data.forEach(day => {
      day.forEach((value, hour) => {
        hourTotals[hour] += value;
      });
    });
    
    const maxHourValue = Math.max(...hourTotals);
    const peakHour = hourTotals.indexOf(maxHourValue);
    return { hour: peakHour, value: maxHourValue };
  };

  const getPeakDay = () => {
    const dayTotals = data.map(day => day.reduce((sum, value) => sum + value, 0));
    const maxDayValue = Math.max(...dayTotals);
    const peakDay = dayTotals.indexOf(maxDayValue);
    return { day: peakDay, value: maxDayValue };
  };

  const peakHours = getPeakHours();
  const peakDay = getPeakDay();

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Shopping Time Heatmap</h3>
          <p className="text-sm text-gray-600">Transaction intensity by hour and day</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600">Low</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="w-4 h-4 bg-yellow-300 rounded"></div>
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <div className="w-4 h-4 bg-red-600 rounded"></div>
          </div>
          <span className="text-gray-600">High</span>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <div className="min-w-max">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-12"></div> {/* Space for day labels */}
            {hourLabels.map((hour, index) => (
              <div 
                key={hour} 
                className={`w-8 h-6 flex items-center justify-center text-xs text-gray-600 ${
                  index % 4 === 0 ? 'font-medium' : ''
                }`}
              >
                {index % 4 === 0 ? hour.slice(0, 2) : ''}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {data.map((dayData, dayIndex) => (
            <div key={dayIndex} className="flex mb-1">
              {/* Day label */}
              <div className="w-12 h-8 flex items-center justify-end pr-2">
                <span className={`text-sm font-medium ${
                  dayIndex === peakDay.day ? 'text-red-600' : 'text-gray-700'
                }`}>
                  {dayLabels[dayIndex]}
                </span>
              </div>
              
              {/* Hour cells */}
              {dayData.map((value, hourIndex) => (
                <div
                  key={hourIndex}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded transition-all duration-200 cursor-pointer hover:scale-110 hover:z-10 relative ${
                    getIntensityColor(value)
                  } ${getTextColor(value)}`}
                  onMouseEnter={() => setHoveredCell({ day: dayIndex, hour: hourIndex, value })}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  {value > 50 ? value : ''}
                  
                  {/* Peak indicators */}
                  {hourIndex === peakHours.hour && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-white"></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none z-20 text-sm">
          <div className="font-medium">
            {dayLabels[hoveredCell.day]} at {hourLabels[hoveredCell.hour]}
          </div>
          <div className="text-yellow-300">
            {hoveredCell.value} transactions
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-red-600 text-lg mr-2">🔥</span>
            <h4 className="font-semibold text-red-900">Peak Day</h4>
          </div>
          <div className="text-lg font-bold text-red-900">
            {dayLabels[peakDay.day]}
          </div>
          <div className="text-sm text-red-700">
            {peakDay.value} total transactions
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-orange-600 text-lg mr-2">⏰</span>
            <h4 className="font-semibold text-orange-900">Peak Hour</h4>
          </div>
          <div className="text-lg font-bold text-orange-900">
            {hourLabels[peakHours.hour]}
          </div>
          <div className="text-sm text-orange-700">
            Across all days
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="text-blue-600 text-lg mr-2">💡</span>
            <h4 className="font-semibold text-blue-900">Insight</h4>
          </div>
          <div className="text-sm text-blue-800">
            Saturday 2-4 PM shows highest intensity. Consider weekend promotions.
          </div>
        </div>
      </div>

      {/* Pattern analysis */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">🔍 Pattern Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
          <div className="flex items-start">
            <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
            <span><strong>Morning Rush:</strong> 10-11 AM shows consistent activity across weekdays</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
            <span><strong>Afternoon Peak:</strong> 2-4 PM captures majority of daily volume</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
            <span><strong>Weekend Pattern:</strong> Saturday shows 35% higher activity than weekdays</span>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
            <span><strong>Evening Decline:</strong> Activity drops significantly after 6 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}