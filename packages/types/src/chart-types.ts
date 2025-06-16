// Chart type definitions for Scout Analytics

export interface ChartDataPoint {
  x: number | string | Date;
  y: number;
  label?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface TimeSeriesPoint {
  timestamp: Date | string;
  value: number;
  category?: string;
}

export interface CategoryData {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
  children?: CategoryData[];
}

export interface NetworkNode {
  id: string;
  name: string;
  category: string;
  revenue: number;
  frequency: number;
  x: number;
  y: number;
  color: string;
  size?: number;
}

export interface NetworkEdge {
  source: string;
  target: string;
  strength: number;
  frequency: number;
  confidence: number;
  weight?: number;
}

export interface SankeyNode {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  height: number;
  color: string;
  value: number;
}

export interface SankeyFlow {
  source: string;
  target: string;
  value: number;
  switchRate: number;
  sourceY: number;
  targetY: number;
  sourceHeight: number;
  targetHeight: number;
}

export interface HeatmapCell {
  x: number;
  y: number;
  value: number;
  label?: string;
  tooltip?: string;
}

export interface TreemapNode {
  id: string;
  name: string;
  value: number;
  percentage: number;
  color: string;
  children?: TreemapNode[];
  parent?: string;
}

export interface ChartConfig {
  width?: number;
  height?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors?: string[];
  theme?: 'light' | 'dark';
  animation?: boolean;
  interactive?: boolean;
}

export interface TooltipData {
  title: string;
  value: string | number;
  description?: string;
  color?: string;
  position?: {
    x: number;
    y: number;
  };
}

export interface ChartLegend {
  show: boolean;
  position: 'top' | 'right' | 'bottom' | 'left';
  orientation: 'horizontal' | 'vertical';
  items: {
    label: string;
    color: string;
    value?: string | number;
  }[];
}

export interface AxisConfig {
  show: boolean;
  label?: string;
  type: 'linear' | 'time' | 'category';
  domain?: [number, number];
  tickCount?: number;
  format?: (value: any) => string;
}

export interface ChartFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  regions?: string[];
  minValue?: number;
  maxValue?: number;
}

export type ChartType = 
  | 'line'
  | 'bar'
  | 'area'
  | 'pie'
  | 'donut'
  | 'scatter'
  | 'network'
  | 'sankey'
  | 'heatmap'
  | 'treemap'
  | 'histogram'
  | 'boxplot';

export interface BaseChartProps {
  data: any[];
  config?: ChartConfig;
  filters?: ChartFilters;
  onDataPointClick?: (data: any) => void;
  onDataPointHover?: (data: any) => void;
  className?: string;
}