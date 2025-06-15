// SKUCombinationNetwork.tsx - Interactive Network Chart
// Shows frequently bought together products and cross-selling opportunities
// Version: 1.0.0

import React, { useState, useMemo } from 'react';

interface NetworkNode {
  id: string;
  name: string;
  category: string;
  revenue: number;
  frequency: number;
  x: number;
  y: number;
  color: string;
}

interface NetworkEdge {
  source: string;
  target: string;
  strength: number;
  frequency: number;
  confidence: number;
}

interface SKUCombinationNetworkProps {
  width?: number;
  height?: number;
  className?: string;
}

// Sample data for SKU combinations
const sampleNodes: NetworkNode[] = [
  { id: 'coke', name: 'Coca-Cola', category: 'Beverages', revenue: 125600, frequency: 1840, x: 200, y: 150, color: '#EF4444' },
  { id: 'chips', name: 'Lay\'s Chips', category: 'Snacks', revenue: 89200, frequency: 1650, x: 350, y: 180, color: '#F59E0B' },
  { id: 'pepsi', name: 'Pepsi', category: 'Beverages', revenue: 98400, frequency: 1420, x: 180, y: 280, color: '#3B82F6' },
  { id: 'pringles', name: 'Pringles', category: 'Snacks', revenue: 76300, frequency: 1230, x: 380, y: 120, color: '#F59E0B' },
  { id: 'shampoo', name: 'Head & Shoulders', category: 'Personal Care', revenue: 64500, frequency: 980, x: 500, y: 200, color: '#8B5CF6' },
  { id: 'conditioner', name: 'Pantene Conditioner', category: 'Personal Care', revenue: 52100, frequency: 840, x: 520, y: 300, color: '#8B5CF6' },
  { id: 'milk', name: 'Fresh Milk', category: 'Dairy', revenue: 78900, frequency: 1560, x: 100, y: 220, color: '#10B981' },
  { id: 'bread', name: 'Gardenia Bread', category: 'Bakery', revenue: 45600, frequency: 1340, x: 150, y: 350, color: '#D97706' }
];

const sampleEdges: NetworkEdge[] = [
  { source: 'coke', target: 'chips', strength: 0.78, frequency: 1450, confidence: 78.2 },
  { source: 'pepsi', target: 'chips', strength: 0.65, frequency: 920, confidence: 64.8 },
  { source: 'shampoo', target: 'conditioner', strength: 0.72, frequency: 710, confidence: 72.4 },
  { source: 'milk', target: 'bread', strength: 0.58, frequency: 780, confidence: 58.2 },
  { source: 'coke', target: 'pringles', strength: 0.45, frequency: 630, confidence: 45.1 },
  { source: 'chips', target: 'pringles', strength: 0.52, frequency: 540, confidence: 52.3 }
];

export default function SKUCombinationNetwork({ 
  width = 640, 
  height = 400, 
  className = '' 
}: SKUCombinationNetworkProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Calculate connected nodes for highlighting
  const connectedNodes = useMemo(() => {
    if (!selectedNode) return new Set();
    const connected = new Set([selectedNode]);
    sampleEdges.forEach(edge => {
      if (edge.source === selectedNode) connected.add(edge.target);
      if (edge.target === selectedNode) connected.add(edge.source);
    });
    return connected;
  }, [selectedNode]);

  // Filter edges for current selection
  const visibleEdges = useMemo(() => {
    if (!selectedNode) return sampleEdges;
    return sampleEdges.filter(edge => 
      edge.source === selectedNode || edge.target === selectedNode
    );
  }, [selectedNode]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const getNodeOpacity = (nodeId: string) => {
    if (!selectedNode) return 1;
    return connectedNodes.has(nodeId) ? 1 : 0.3;
  };

  const getEdgeOpacity = (edge: NetworkEdge) => {
    if (!selectedNode) return 0.6;
    return edge.source === selectedNode || edge.target === selectedNode ? 0.8 : 0.1;
  };

  return (
    <div className={`bg-white rounded-lg ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">SKU Combination Network</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Strong Connection (≥70%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Moderate Connection (50-70%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              <span>Weak Connection (&lt;50%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="relative">
          <svg width={width} height={height} className="border border-gray-100 rounded">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Edges */}
            {visibleEdges.map((edge, index) => {
              const sourceNode = sampleNodes.find(n => n.id === edge.source);
              const targetNode = sampleNodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const edgeColor = edge.confidence >= 70 ? '#3B82F6' : 
                               edge.confidence >= 50 ? '#F59E0B' : '#9CA3AF';
              
              return (
                <g key={index}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={edgeColor}
                    strokeWidth={Math.max(2, edge.strength * 6)}
                    opacity={getEdgeOpacity(edge)}
                    className="transition-opacity duration-200"
                  />
                  {/* Edge label */}
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2 - 5}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                    opacity={selectedNode ? (edge.source === selectedNode || edge.target === selectedNode ? 1 : 0) : 0}
                  >
                    {edge.confidence.toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {sampleNodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={Math.max(15, Math.sqrt(node.frequency) / 8)}
                  fill={node.color}
                  opacity={getNodeOpacity(node.id)}
                  stroke={selectedNode === node.id ? '#1F2937' : 'white'}
                  strokeWidth={selectedNode === node.id ? 3 : 2}
                  className="cursor-pointer transition-all duration-200 hover:stroke-gray-700"
                  onClick={() => handleNodeClick(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className="text-xs font-medium fill-white pointer-events-none"
                  opacity={getNodeOpacity(node.id)}
                >
                  {node.name.split(' ')[0]}
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
                    <div className="mt-2 space-y-1">
                      <div>Revenue: ₱{node.revenue.toLocaleString()}</div>
                      <div>Frequency: {node.frequency} transactions</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Selected Node Details */}
        {selectedNode && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            {(() => {
              const node = sampleNodes.find(n => n.id === selectedNode);
              const connections = sampleEdges.filter(e => 
                e.source === selectedNode || e.target === selectedNode
              );
              
              if (!node) return null;
              
              return (
                <div>
                  <h4 className="font-semibold text-blue-900 mb-3">
                    🔗 {node.name} Connections
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Frequently Bought With:</h5>
                      <div className="space-y-2">
                        {connections.map((conn, idx) => {
                          const partnerId = conn.source === selectedNode ? conn.target : conn.source;
                          const partner = sampleNodes.find(n => n.id === partnerId);
                          if (!partner) return null;
                          
                          return (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span>{partner.name}</span>
                              <span className="font-medium text-blue-700">
                                {conn.confidence.toFixed(1)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Cross-Sell Opportunities:</h5>
                      <div className="space-y-1 text-sm text-blue-700">
                        <div>• Bundle promotions with top connections</div>
                        <div>• Recommended products placement</div>
                        <div>• Loyalty program tie-ins</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Network Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{sampleNodes.length}</div>
            <div className="text-sm text-gray-600">Active SKUs</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{sampleEdges.length}</div>
            <div className="text-sm text-gray-600">Connections</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {(sampleEdges.reduce((sum, e) => sum + e.confidence, 0) / sampleEdges.length).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Avg. Confidence</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.max(...sampleEdges.map(e => e.confidence)).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Strongest Link</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export types for use in other components
export type { NetworkNode, NetworkEdge };