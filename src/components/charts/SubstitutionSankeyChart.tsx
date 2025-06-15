// SubstitutionSankeyChart.tsx - Product Substitution Flow Diagram
// Shows how customers switch between products using Sankey-style visualization
// Version: 1.0.0

import React, { useState, useMemo } from 'react';

interface SankeyNode {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  height: number;
  color: string;
  value: number;
}

interface SankeyFlow {
  source: string;
  target: string;
  value: number;
  switchRate: number;
  sourceY: number;
  targetY: number;
  sourceHeight: number;
  targetHeight: number;
}

interface SubstitutionSankeyChartProps {
  width?: number;
  height?: number;
  className?: string;
}

// Sample data for product substitutions
const sampleNodes: SankeyNode[] = [
  // Original products (left side)
  { id: 'coke-orig', name: 'Coca-Cola', category: 'Cola', x: 100, y: 50, height: 80, color: '#DC2626', value: 1000 },
  { id: 'pepsi-orig', name: 'Pepsi', category: 'Cola', x: 100, y: 150, height: 60, color: '#2563EB', value: 750 },
  { id: 'sprite-orig', name: 'Sprite', category: 'Lemon-Lime', x: 100, y: 230, height: 40, color: '#16A34A', value: 500 },
  { id: 'hs-orig', name: 'Head & Shoulders', category: 'Shampoo', x: 100, y: 290, height: 50, color: '#7C3AED', value: 600 },
  
  // Substituted products (right side)
  { id: 'coke-new', name: 'Coca-Cola', category: 'Cola', x: 540, y: 80, height: 70, color: '#DC2626', value: 900 },
  { id: 'pepsi-new', name: 'Pepsi', category: 'Cola', x: 540, y: 170, height: 75, color: '#2563EB', value: 850 },
  { id: 'sprite-new', name: 'Sprite', category: 'Lemon-Lime', x: 540, y: 260, height: 35, color: '#16A34A', value: 420 },
  { id: 'pantene-new', name: 'Pantene', category: 'Shampoo', x: 540, y: 310, height: 45, color: '#EA580C', value: 550 }
];

const sampleFlows: SankeyFlow[] = [
  // Coke flows
  { source: 'coke-orig', target: 'coke-new', value: 800, switchRate: 80.0, sourceY: 0, targetY: 0, sourceHeight: 64, targetHeight: 56 },
  { source: 'coke-orig', target: 'pepsi-new', value: 150, switchRate: 15.0, sourceY: 64, targetY: 56, sourceHeight: 12, targetHeight: 13.2 },
  { source: 'coke-orig', target: 'sprite-new', value: 50, switchRate: 5.0, sourceY: 76, targetY: 69.2, sourceHeight: 4, targetHeight: 4.2 },
  
  // Pepsi flows
  { source: 'pepsi-orig', target: 'pepsi-new', value: 600, switchRate: 80.0, sourceY: 0, targetY: 0, sourceHeight: 48, targetHeight: 52.9 },
  { source: 'pepsi-orig', target: 'coke-new', value: 100, switchRate: 13.3, sourceY: 48, targetY: 52.9, sourceHeight: 8, targetHeight: 8.8 },
  { source: 'pepsi-orig', target: 'sprite-new', value: 50, switchRate: 6.7, sourceY: 56, targetY: 61.7, sourceHeight: 4, targetHeight: 4.4 },
  
  // Sprite flows
  { source: 'sprite-orig', target: 'sprite-new', value: 370, switchRate: 74.0, sourceY: 0, targetY: 0, sourceHeight: 29.6, targetHeight: 31 },
  { source: 'sprite-orig', target: 'coke-new', value: 80, switchRate: 16.0, sourceY: 29.6, targetY: 31, sourceHeight: 6.4, targetHeight: 7 },
  { source: 'sprite-orig', target: 'pepsi-new', value: 50, switchRate: 10.0, sourceY: 36, targetY: 38, sourceHeight: 4, targetHeight: 4.4 },
  
  // Head & Shoulders flows
  { source: 'hs-orig', target: 'pantene-new', value: 350, switchRate: 58.3, sourceY: 0, targetY: 0, sourceHeight: 29.2, targetHeight: 31.8 },
  { source: 'hs-orig', target: 'coke-new', value: 150, switchRate: 25.0, sourceY: 29.2, targetY: 31.8, sourceHeight: 12.5, targetHeight: 13.2 },
  { source: 'hs-orig', target: 'pepsi-new', value: 100, switchRate: 16.7, sourceY: 41.7, targetY: 45, sourceHeight: 8.3, targetHeight: 8.8 }
];

export default function SubstitutionSankeyChart({ 
  width = 640, 
  height = 400, 
  className = '' 
}: SubstitutionSankeyChartProps) {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Calculate flow paths
  const flowPaths = useMemo(() => {
    return sampleFlows.map(flow => {
      const sourceNode = sampleNodes.find(n => n.id === flow.source);
      const targetNode = sampleNodes.find(n => n.id === flow.target);
      
      if (!sourceNode || !targetNode) return null;
      
      const sourceX = sourceNode.x + 80; // Node width
      const targetX = targetNode.x;
      const sourceY = sourceNode.y + flow.sourceY + flow.sourceHeight / 2;
      const targetY = targetNode.y + flow.targetY + flow.targetHeight / 2;
      
      // Create curved path
      const midX = (sourceX + targetX) / 2;
      const path = `M ${sourceX} ${sourceY} C ${midX} ${sourceY} ${midX} ${targetY} ${targetX} ${targetY}`;
      
      return {
        ...flow,
        path,
        sourceX,
        targetX,
        sourceY,
        targetY,
        id: `${flow.source}-${flow.target}`
      };
    }).filter(Boolean);
  }, []);

  const getFlowColor = (switchRate: number) => {
    if (switchRate >= 70) return '#10B981'; // High retention - green
    if (switchRate >= 50) return '#F59E0B'; // Medium retention - yellow
    return '#EF4444'; // Low retention/high switching - red
  };

  const getFlowOpacity = (flowId: string) => {
    if (!selectedFlow) return 0.7;
    return selectedFlow === flowId ? 1 : 0.2;
  };

  return (
    <div className={`bg-white rounded-lg ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Product Substitution Flow</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>High Retention (≥70%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span>Medium Retention (50-70%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>High Switching (&lt;50%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="relative">
          <svg width={width} height={height} className="border border-gray-100 rounded">
            {/* Background labels */}
            <text x={140} y={30} textAnchor="middle" className="text-sm font-medium fill-gray-700">
              Original Choice
            </text>
            <text x={500} y={30} textAnchor="middle" className="text-sm font-medium fill-gray-700">
              Actual Purchase
            </text>

            {/* Flow paths */}
            {flowPaths.map((flow, index) => {
              if (!flow) return null;
              
              return (
                <g key={flow.id}>
                  <path
                    d={flow.path}
                    fill="none"
                    stroke={getFlowColor(flow.switchRate)}
                    strokeWidth={Math.max(2, flow.value / 50)}
                    opacity={getFlowOpacity(flow.id)}
                    className="cursor-pointer transition-opacity duration-200"
                    onClick={() => setSelectedFlow(selectedFlow === flow.id ? null : flow.id)}
                  />
                  {/* Flow value label */}
                  {(selectedFlow === flow.id || !selectedFlow) && (
                    <text
                      x={(flow.sourceX + flow.targetX) / 2}
                      y={(flow.sourceY + flow.targetY) / 2 - 5}
                      textAnchor="middle"
                      className="text-xs fill-gray-700 font-medium"
                      opacity={selectedFlow === flow.id ? 1 : 0.6}
                    >
                      {flow.value} ({flow.switchRate.toFixed(1)}%)
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {sampleNodes.map((node) => (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={80}
                  height={node.height}
                  fill={node.color}
                  opacity={hoveredNode === node.id ? 1 : 0.8}
                  rx={4}
                  className="cursor-pointer transition-opacity duration-200"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
                <text
                  x={node.x + 40}
                  y={node.y + node.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-white pointer-events-none"
                >
                  {node.name}
                </text>
                <text
                  x={node.x + 40}
                  y={node.y + node.height / 2 + 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-white opacity-75 pointer-events-none"
                >
                  {node.value}
                </text>
              </g>
            ))}
          </svg>

          {/* Tooltip */}
          {hoveredNode && (
            <div className="absolute top-0 left-0 bg-gray-900 text-white p-3 rounded-lg shadow-lg text-sm max-w-xs z-10 pointer-events-none">
              {(() => {
                const node = sampleNodes.find(n => n.id === hoveredNode);
                if (!node) return null;
                return (
                  <div>
                    <div className="font-semibold">{node.name}</div>
                    <div className="text-gray-300">{node.category}</div>
                    <div className="mt-2">
                      <div>Volume: {node.value} customers</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Selected Flow Details */}
        {selectedFlow && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            {(() => {
              const flow = sampleFlows.find(f => `${f.source}-${f.target}` === selectedFlow);
              const sourceNode = sampleNodes.find(n => n.id === flow?.source);
              const targetNode = sampleNodes.find(n => n.id === flow?.target);
              
              if (!flow || !sourceNode || !targetNode) return null;
              
              return (
                <div>
                  <h4 className="font-semibold text-blue-900 mb-3">
                    🔄 {sourceNode.name} → {targetNode.name}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-900">{flow.value}</div>
                      <div className="text-sm text-blue-700">Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-900">{flow.switchRate.toFixed(1)}%</div>
                      <div className="text-sm text-blue-700">Switch Rate</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        flow.switchRate >= 70 ? 'text-green-600' : 
                        flow.switchRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {flow.switchRate >= 70 ? 'High' : flow.switchRate >= 50 ? 'Medium' : 'Low'}
                      </div>
                      <div className="text-sm text-blue-700">Retention</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Substitution Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-3">🚨 High Switch Risk</h4>
            <div className="space-y-2 text-sm">
              {sampleFlows
                .filter(f => f.switchRate < 50 && f.source !== f.target)
                .slice(0, 3)
                .map((flow, idx) => {
                  const sourceNode = sampleNodes.find(n => n.id === flow.source);
                  const targetNode = sampleNodes.find(n => n.id === flow.target);
                  return (
                    <div key={idx} className="flex justify-between">
                      <span>{sourceNode?.name} → {targetNode?.name}</span>
                      <span className="font-medium text-red-700">{flow.switchRate.toFixed(1)}%</span>
                    </div>
                  );
                })
              }
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-3">💡 Retention Strategies</h4>
            <div className="space-y-2 text-sm text-green-800">
              <div>• <strong>Loyalty rewards</strong> for high-switch products</div>
              <div>• <strong>Price optimization</strong> based on substitution patterns</div>
              <div>• <strong>Cross-category bundles</strong> to increase stickiness</div>
              <div>• <strong>Targeted promotions</strong> for at-risk customers</div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {sampleFlows.reduce((sum, f) => sum + f.value, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {(sampleFlows.reduce((sum, f) => sum + f.switchRate, 0) / sampleFlows.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg. Retention</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {sampleFlows.filter(f => f.switchRate < 70).length}
            </div>
            <div className="text-sm text-gray-600">Risk Products</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.max(...sampleFlows.map(f => f.switchRate)).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Best Retention</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export types for use in other components
export type { SankeyNode, SankeyFlow };