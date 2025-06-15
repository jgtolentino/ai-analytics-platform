// GeoChart.tsx - Philippine Regional Revenue Mapping
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Spinner } from '../ui/Spinner';

const Map = dynamic(() => import('@visx/geo').then(mod => mod.ComposableMap), {
  ssr: false,
  loading: () => <Spinner />,
});

interface GeoChartProps {
  data: Array<{
    [key: string]: any;
  }>;
  regionKey?: string;
  valueKey?: string;
  title?: string;
}

export default function GeoChart({ 
  data, 
  regionKey = 'region', 
  valueKey = 'revenue',
  title = '🗺️ Revenue by Region'
}: GeoChartProps) {
  const regions = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach(item => {
      map[item[regionKey]] = item[valueKey];
    });
    return map;
  }, [data, regionKey, valueKey]);

  const maxValue = useMemo(() => 
    Math.max(...Object.values(regions)), [regions]
  );

  const getRegionColor = (value: number) => {
    const intensity = value / maxValue;
    if (intensity > 0.8) return 'fill-blue-700';
    if (intensity > 0.6) return 'fill-blue-600';
    if (intensity > 0.4) return 'fill-blue-500';
    if (intensity > 0.2) return 'fill-blue-400';
    return 'fill-blue-200';
  };

  // Philippine regions mapping
  const philippineRegions = [
    { id: 'NCR', name: 'National Capital Region', x: 120, y: 50 },
    { id: 'R3', name: 'Region 3 (Central Luzon)', x: 110, y: 40 },
    { id: 'R4A', name: 'Region 4A (CALABARZON)', x: 125, y: 60 },
    { id: 'VIS', name: 'Visayas', x: 140, y: 80 },
    { id: 'MIN', name: 'Mindanao', x: 150, y: 120 }
  ];

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <div className="relative">
        {/* Simplified Philippine map representation */}
        <svg width="100%" height="200" viewBox="0 0 300 180" className="border rounded">
          {philippineRegions.map(region => {
            const value = regions[region.id] || 0;
            const colorClass = getRegionColor(value);
            
            return (
              <g key={region.id}>
                <circle
                  cx={region.x}
                  cy={region.y}
                  r={Math.max(8, Math.sqrt(value / 1000))}
                  className={`${colorClass} stroke-gray-300 stroke-1 hover:opacity-80 cursor-pointer transition-opacity`}
                  title={`${region.name}: ₱${value.toLocaleString()}`}
                />
                <text
                  x={region.x}
                  y={region.y + 25}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700"
                >
                  {region.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Low</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <div className="w-3 h-3 bg-blue-600 rounded"></div>
              <div className="w-3 h-3 bg-blue-700 rounded"></div>
            </div>
            <span className="text-gray-600">High</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Total Revenue</div>
            <div className="font-semibold">₱{Object.values(regions).reduce((a, b) => a + b, 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Regional performance table */}
      <div className="mt-4 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-medium text-gray-600">Region</th>
              <th className="text-right py-2 font-medium text-gray-600">Revenue</th>
              <th className="text-right py-2 font-medium text-gray-600">Share</th>
            </tr>
          </thead>
          <tbody>
            {philippineRegions.map(region => {
              const value = regions[region.id] || 0;
              const totalRevenue = Object.values(regions).reduce((a, b) => a + b, 0);
              const share = totalRevenue > 0 ? (value / totalRevenue * 100) : 0;
              
              return (
                <tr key={region.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2">{region.name}</td>
                  <td className="text-right py-2 font-medium">₱{value.toLocaleString()}</td>
                  <td className="text-right py-2 text-gray-600">{share.toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}