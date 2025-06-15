// PopulationPyramid.tsx - Age Distribution Population Pyramid Component
// Replaces bar charts with interactive population pyramid visualization
// Version: 1.0.0

import React from 'react';

interface AgeGroupData {
  ageGroup: string;
  male: number;
  female: number;
  total: number;
}

interface PopulationPyramidProps {
  data: AgeGroupData[];
  height?: number;
  className?: string;
}

export default function PopulationPyramid({ 
  data, 
  height = 400, 
  className = "" 
}: PopulationPyramidProps) {
  const maxValue = Math.max(...data.map(d => Math.max(d.male, d.female)));
  
  const getBarWidth = (value: number) => {
    return (value / maxValue) * 100;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PH').format(num);
  };

  const getAgeGroupLabel = (ageGroup: string) => {
    return ageGroup.replace('_', '-').toUpperCase();
  };

  return (
    <div className={`population-pyramid ${className}`} style={{ height }}>
      <div className="pyramid-header mb-6">
        <h3 className="text-lg font-semibold text-gray-900 text-center">
          Age Distribution
        </h3>
        <div className="flex justify-center items-center mt-2 space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Male</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-pink-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Female</span>
          </div>
        </div>
      </div>

      <div className="pyramid-chart">
        {data.map((ageData, index) => {
          const maleWidth = getBarWidth(ageData.male);
          const femaleWidth = getBarWidth(ageData.female);
          
          return (
            <div 
              key={index} 
              className="pyramid-row flex items-center mb-2 group"
            >
              {/* Male Side (Left) */}
              <div className="flex-1 flex justify-end pr-2">
                <div className="relative">
                  <div
                    className="bg-blue-500 h-8 rounded-l transition-all duration-300 group-hover:bg-blue-600"
                    style={{ width: `${maleWidth}%`, minWidth: '20px' }}
                  >
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xs font-medium">
                      {formatNumber(ageData.male)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Age Group Label (Center) */}
              <div className="w-20 text-center">
                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  {getAgeGroupLabel(ageData.ageGroup)}
                </span>
              </div>

              {/* Female Side (Right) */}
              <div className="flex-1 flex justify-start pl-2">
                <div className="relative">
                  <div
                    className="bg-pink-500 h-8 rounded-r transition-all duration-300 group-hover:bg-pink-600"
                    style={{ width: `${femaleWidth}%`, minWidth: '20px' }}
                  >
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-xs font-medium">
                      {formatNumber(ageData.female)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Population Totals */}
      <div className="pyramid-footer mt-6 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(data.reduce((sum, d) => sum + d.male, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Male</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {formatNumber(data.reduce((sum, d) => sum + d.total, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Population</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-600">
              {formatNumber(data.reduce((sum, d) => sum + d.female, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Female</div>
          </div>
        </div>
      </div>

      {/* Responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .pyramid-row {
            margin-bottom: 8px;
          }
          .pyramid-row .w-20 {
            width: 60px;
          }
          .pyramid-row .h-8 {
            height: 24px;
          }
          .pyramid-footer {
            padding: 12px;
          }
          .pyramid-footer .text-2xl {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}

// Sample data for development
export const samplePopulationData: AgeGroupData[] = [
  { ageGroup: '18_25', male: 2340, female: 2580, total: 4920 },
  { ageGroup: '26_35', male: 3210, female: 3150, total: 6360 },
  { ageGroup: '36_45', male: 2890, female: 2940, total: 5830 },
  { ageGroup: '46_55', male: 2450, female: 2680, total: 5130 },
  { ageGroup: '56_65', male: 1870, female: 2120, total: 3990 },
  { ageGroup: '65+', male: 1240, female: 1590, total: 2830 }
];