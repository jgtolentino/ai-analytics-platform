// Line Chart component for Scout Analytics
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BaseChartProps, TimeSeriesPoint, ChartConfig } from '@scout/types';

export interface LineChartProps extends BaseChartProps {
  data: TimeSeriesPoint[];
  lines?: {
    key: string;
    color: string;
    strokeWidth?: number;
    strokeDasharray?: string;
  }[];
  showDots?: boolean;
  showGrid?: boolean;
  animate?: boolean;
}

export function LineChart({
  data,
  config,
  lines = [{ key: 'value', color: '#3B82F6' }],
  showDots = true,
  showGrid = true,
  animate = true,
  onDataPointClick,
  onDataPointHover,
  className = ''
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  const margin = config?.margin || { top: 20, right: 30, bottom: 40, left: 50 };
  const width = (config?.width || dimensions.width) - margin.left - margin.right;
  const height = (config?.height || dimensions.height) - margin.top - margin.bottom;

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value) as [number, number])
      .nice()
      .range([height, 0]);

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add grid
    if (showGrid) {
      // Vertical grid lines
      g.selectAll('.grid-line-x')
        .data(xScale.ticks())
        .enter()
        .append('line')
        .attr('class', 'grid-line-x')
        .attr('x1', d => xScale(d))
        .attr('x2', d => xScale(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#f0f0f0')
        .attr('stroke-width', 1);

      // Horizontal grid lines
      g.selectAll('.grid-line-y')
        .data(yScale.ticks())
        .enter()
        .append('line')
        .attr('class', 'grid-line-y')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d))
        .attr('stroke', '#f0f0f0')
        .attr('stroke-width', 1);
    }

    // Create line generator
    const line = d3.line<TimeSeriesPoint>()
      .x(d => xScale(new Date(d.timestamp)))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add lines
    lines.forEach((lineConfig, index) => {
      const lineData = data.filter(d => d.category === lineConfig.key || !d.category);
      
      const path = g.append('path')
        .datum(lineData)
        .attr('fill', 'none')
        .attr('stroke', lineConfig.color)
        .attr('stroke-width', lineConfig.strokeWidth || 2)
        .attr('stroke-dasharray', lineConfig.strokeDasharray || 'none')
        .attr('d', line);

      // Animate line drawing
      if (animate) {
        const totalLength = path.node()?.getTotalLength() || 0;
        path
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(1500)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
          .on('end', () => {
            if (lineConfig.strokeDasharray && lineConfig.strokeDasharray !== 'none') {
              path.attr('stroke-dasharray', lineConfig.strokeDasharray);
            } else {
              path.attr('stroke-dasharray', 'none');
            }
          });
      }

      // Add dots
      if (showDots) {
        g.selectAll(`.dots-${index}`)
          .data(lineData)
          .enter()
          .append('circle')
          .attr('class', `dots-${index}`)
          .attr('cx', d => xScale(new Date(d.timestamp)))
          .attr('cy', d => yScale(d.value))
          .attr('r', 0)
          .attr('fill', lineConfig.color)
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
          .style('cursor', 'pointer')
          .on('click', (event, d) => onDataPointClick?.(d))
          .on('mouseover', function(event, d) {
            d3.select(this).attr('r', 6);
            onDataPointHover?.(d);
          })
          .on('mouseout', function() {
            d3.select(this).attr('r', 4);
          });

        // Animate dots
        if (animate) {
          g.selectAll(`.dots-${index}`)
            .transition()
            .delay((d, i) => i * 50)
            .duration(300)
            .attr('r', 4);
        } else {
          g.selectAll(`.dots-${index}`)
            .attr('r', 4);
        }
      }
    });

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%b %d'));

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.format('.2s'));

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#666');

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#666');

    // Add axis labels
    g.append('text')
      .attr('class', 'x-label')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#666')
      .text('Date');

    g.append('text')
      .attr('class', 'y-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#666')
      .text('Value');

  }, [data, width, height, lines, showDots, showGrid, animate]);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`w-full h-full ${className}`}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${config?.width || dimensions.width} ${config?.height || dimensions.height}`}
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}