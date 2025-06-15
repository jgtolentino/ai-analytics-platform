// GenderChart.tsx - Single-value Gender Distribution Chart with Icons
// Replaces traditional pie chart with modern icon-based visualization
// Version: 1.0.0

import React from 'react';

interface GenderData {
  gender: string;
  count: number;
  percentage: number;
}

interface GenderChartProps {
  data: GenderData[];
  className?: string;
  showPercentages?: boolean;
}

export default function GenderChart({ 
  data, 
  className = "",
  showPercentages = true 
}: GenderChartProps) {
  const totalCustomers = data.reduce((sum, item) => sum + item.count, 0);
  
  const maleData = data.find(d => d.gender.toLowerCase() === 'male') || { gender: 'Male', count: 0, percentage: 0 };
  const femaleData = data.find(d => d.gender.toLowerCase() === 'female') || { gender: 'Female', count: 0, percentage: 0 };
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PH').format(num);
  };

  const MaleIcon = () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-7-2c1.93 0 3.5-1.57 3.5-3.5S10.43 3 8.5 3 5 4.57 5 7.5 6.57 10 8.5 10zm7 1c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm-7 0c-.19 0-.38.01-.57.03C7.15 13.8 7 14.9 7 16v1h6v-1c0-2.66-5.33-4-8-4z"/>
    </svg>
  );

  const FemaleIcon = () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.94 8.31C13.62 7.52 12.85 7 12 7s-1.62.52-1.94 1.31L7.5 12.5h9l-2.56-4.19zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.12.23-2.18.65-3.15L12 15l7.35-6.15c.42.97.65 2.03.65 3.15 0 4.41-3.59 8-8 8z"/>
    </svg>
  );

  return (
    <div className={`gender-chart bg-white rounded-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Gender Distribution
        </h3>
        <p className="text-sm text-gray-600">
          {formatNumber(totalCustomers)} Total Customers
        </p>
      </div>

      <div className="flex justify-center items-center space-x-8 mb-6">
        {/* Male Section */}
        <div className="flex flex-col items-center group cursor-pointer">
          <div className="relative">
            <div className="w-20 h-20 text-blue-500 mb-3 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-600">
              <MaleIcon />
            </div>
            {showPercentages && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                {maleData.percentage.toFixed(0)}%
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(maleData.count)}
            </div>
            <div className="text-sm text-blue-600 font-medium">
              Male
            </div>
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex flex-col items-center">
          <div className="w-px h-16 bg-gray-300 mb-2"></div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
            VS
          </span>
          <div className="w-px h-16 bg-gray-300 mt-2"></div>
        </div>

        {/* Female Section */}
        <div className="flex flex-col items-center group cursor-pointer">
          <div className="relative">
            <div className="w-20 h-20 text-pink-500 mb-3 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-600">
              <FemaleIcon />
            </div>
            {showPercentages && (
              <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                {femaleData.percentage.toFixed(0)}%
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(femaleData.count)}
            </div>
            <div className="text-sm text-pink-600 font-medium">
              Female
            </div>
          </div>
        </div>
      </div>

      {/* Gender Ratio Bar */}
      <div className="mb-4">
        <div className="flex h-4 rounded-full overflow-hidden bg-gray-200">
          <div 
            className="bg-blue-500 transition-all duration-500"
            style={{ width: `${maleData.percentage}%` }}
          ></div>
          <div 
            className="bg-pink-500 transition-all duration-500"
            style={{ width: `${femaleData.percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>{maleData.percentage.toFixed(1)}% Male</span>
          <span>{femaleData.percentage.toFixed(1)}% Female</span>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {(maleData.count / femaleData.count).toFixed(2)}:1
            </div>
            <div className="text-xs text-gray-600">Male to Female Ratio</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {Math.abs(maleData.percentage - femaleData.percentage).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">Gender Gap</div>
          </div>
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .gender-chart .space-x-8 {
            gap: 1.5rem;
          }
          .gender-chart .w-20 {
            width: 4rem;
            height: 4rem;
          }
          .gender-chart .text-2xl {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}

// Sample data for development
export const sampleGenderData: GenderData[] = [
  { gender: 'Male', count: 4521, percentage: 50.6 },
  { gender: 'Female', count: 4411, percentage: 49.4 }
];