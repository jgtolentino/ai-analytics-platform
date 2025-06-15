// ShoppingTimeChart.tsx - 24-hour Stacked Bar Chart for Shopping Time Preferences
// Replaces simple time preferences with detailed hourly breakdown
// Version: 1.0.0

import React from 'react';

interface HourlyData {
  hour: number;
  weekday: number;
  weekend: number;
  total: number;
  percentage: number;
}

interface ShoppingTimeChartProps {
  data: HourlyData[];
  className?: string;
  height?: number;
}

export default function ShoppingTimeChart({ 
  data, 
  className = "",
  height = 300 
}: ShoppingTimeChartProps) {
  const maxTotal = Math.max(...data.map(d => d.total));
  
  const formatHour = (hour: number) => {
    if (hour === 0) return '12AM';
    if (hour < 12) return `${hour}AM`;
    if (hour === 12) return '12PM';
    return `${hour - 12}PM`;
  };

  const getTimeOfDayLabel = (hour: number) => {
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Afternoon';
    if (hour >= 18 && hour < 24) return 'Evening';
    return 'Night';
  };

  const getTimeOfDayColor = (hour: number) => {
    if (hour >= 6 && hour < 12) return 'bg-yellow-100';
    if (hour >= 12 && hour < 18) return 'bg-orange-100';
    if (hour >= 18 && hour < 24) return 'bg-purple-100';
    return 'bg-blue-100';
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PH').format(num);
  };

  // Calculate peak hours
  const peakHour = data.reduce((max, current) => 
    current.total > max.total ? current : max
  );

  const totalTransactions = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className={`shopping-time-chart bg-white rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Shopping Time Preferences</h3>
          <p className="text-sm text-gray-600">24-hour transaction distribution</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Peak Hour</div>
          <div className="text-lg font-bold text-blue-600">
            {formatHour(peakHour.hour)}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center mb-6 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Weekday</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Weekend</span>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container" style={{ height }}>
        <div className="flex items-end justify-between h-full space-x-1">
          {data.map((hourData, index) => {
            const barHeight = (hourData.total / maxTotal) * 100;
            const weekdayHeight = (hourData.weekday / hourData.total) * barHeight;
            const weekendHeight = (hourData.weekend / hourData.total) * barHeight;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                {/* Bar */}
                <div 
                  className="relative w-full mb-2 rounded-t cursor-pointer"
                  style={{ height: `${barHeight}%` }}
                >
                  {/* Weekday portion (bottom) */}
                  <div
                    className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300 group-hover:bg-blue-600 rounded-t"
                    style={{ height: `${weekdayHeight}%` }}
                  ></div>
                  {/* Weekend portion (top) */}
                  <div
                    className="absolute bottom-0 w-full bg-green-500 transition-all duration-300 group-hover:bg-green-600 rounded-t"
                    style={{ 
                      height: `${weekendHeight}%`,
                      bottom: `${weekdayHeight}%`
                    }}
                  ></div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    <div className="font-semibold">{formatHour(hourData.hour)}</div>
                    <div>Total: {formatNumber(hourData.total)}</div>
                    <div>Weekday: {formatNumber(hourData.weekday)}</div>
                    <div>Weekend: {formatNumber(hourData.weekend)}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>

                {/* Hour label */}
                <div className="text-xs text-gray-600 text-center transform -rotate-45 origin-center">
                  {formatHour(hourData.hour)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Period Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Morning', 'Afternoon', 'Evening', 'Night'].map((period, index) => {
          const periodHours = data.filter(d => {
            const hour = d.hour;
            switch (period) {
              case 'Morning': return hour >= 6 && hour < 12;
              case 'Afternoon': return hour >= 12 && hour < 18;
              case 'Evening': return hour >= 18 && hour < 24;
              case 'Night': return hour >= 0 && hour < 6;
              default: return false;
            }
          });
          
          const periodTotal = periodHours.reduce((sum, d) => sum + d.total, 0);
          const periodPercentage = (periodTotal / totalTransactions) * 100;
          
          return (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">
                {periodPercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">{period}</div>
              <div className="text-xs text-gray-500">
                {formatNumber(periodTotal)} transactions
              </div>
            </div>
          );
        })}
      </div>

      {/* Shopping Patterns Insights */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Shopping Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-blue-800">
              Peak shopping: {formatHour(peakHour.hour)} ({formatNumber(peakHour.total)} transactions)
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-blue-800">
              Weekend activity: {((data.reduce((sum, d) => sum + d.weekend, 0) / totalTransactions) * 100).toFixed(1)}% of total
            </span>
          </div>
        </div>
      </div>

      {/* Responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .chart-container {
            height: 200px;
          }
          .shopping-time-chart .space-x-1 {
            gap: 1px;
          }
          .shopping-time-chart .text-xs {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
}

// Sample data for development
export const sampleShoppingTimeData: HourlyData[] = [
  { hour: 0, weekday: 45, weekend: 89, total: 134, percentage: 0.9 },
  { hour: 1, weekday: 23, weekend: 56, total: 79, percentage: 0.5 },
  { hour: 2, weekday: 12, weekend: 34, total: 46, percentage: 0.3 },
  { hour: 3, weekday: 8, weekend: 28, total: 36, percentage: 0.2 },
  { hour: 4, weekday: 15, weekend: 31, total: 46, percentage: 0.3 },
  { hour: 5, weekday: 34, weekend: 45, total: 79, percentage: 0.5 },
  { hour: 6, weekday: 89, weekend: 67, total: 156, percentage: 1.0 },
  { hour: 7, weekday: 234, weekend: 123, total: 357, percentage: 2.3 },
  { hour: 8, weekday: 456, weekend: 234, total: 690, percentage: 4.5 },
  { hour: 9, weekday: 567, weekend: 345, total: 912, percentage: 5.9 },
  { hour: 10, weekday: 678, weekend: 456, total: 1134, percentage: 7.4 },
  { hour: 11, weekday: 723, weekend: 489, total: 1212, percentage: 7.9 },
  { hour: 12, weekday: 789, weekend: 567, total: 1356, percentage: 8.8 },
  { hour: 13, weekday: 845, weekend: 623, total: 1468, percentage: 9.5 },
  { hour: 14, weekday: 892, weekend: 678, total: 1570, percentage: 10.2 },
  { hour: 15, weekday: 834, weekend: 645, total: 1479, percentage: 9.6 },
  { hour: 16, weekday: 756, weekend: 598, total: 1354, percentage: 8.8 },
  { hour: 17, weekday: 689, weekend: 534, total: 1223, percentage: 7.9 },
  { hour: 18, weekday: 612, weekend: 467, total: 1079, percentage: 7.0 },
  { hour: 19, weekday: 534, weekend: 423, total: 957, percentage: 6.2 },
  { hour: 20, weekday: 445, weekend: 378, total: 823, percentage: 5.3 },
  { hour: 21, weekday: 356, weekend: 289, total: 645, percentage: 4.2 },
  { hour: 22, weekday: 234, weekend: 198, total: 432, percentage: 2.8 },
  { hour: 23, weekday: 123, weekend: 145, total: 268, percentage: 1.7 }
];