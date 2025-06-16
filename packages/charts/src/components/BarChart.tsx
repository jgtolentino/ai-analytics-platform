// Bar Chart component for Scout Analytics
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BaseChartProps, CategoryData } from '@scout/types';

export interface BarChartProps extends BaseChartProps {
  data: CategoryData[];
  orientation?: 'vertical' | 'horizontal';
  showValues?: boolean;
  sortBy?: 'name' | 'value' | 'none';
  sortOrder?: 'asc' | 'desc';
  animate?: boolean;
  colorScale?: string[];
}

export function BarChart({
  data,
  config,
  orientation = 'vertical',
  showValues = true,
  sortBy = 'none',
  sortOrder = 'desc',
  animate = true,
  colorScale = ['#3B82F6', '#1E40AF', '#1E3A8A'],
  onDataPointClick,
  onDataPointHover,
  className = ''
}: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  const margin = config?.margin || { top: 20, right: 30, bottom: 40, left: 50 };
  const width = (config?.width || dimensions.width) - margin.left - margin.right;
  const height = (config?.height || dimensions.height) - margin.top - margin.bottom;

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Sort data
    let sortedData = [...data];
    if (sortBy !== 'none') {
      sortedData.sort((a, b) => {
        const aVal = sortBy === 'name' ? a.name : a.value;
        const bVal = sortBy === 'name' ? b.name : b.value;
        
        if (sortOrder === 'asc') {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
      });
    }

    // Create scales
    const xScale = orientation === 'vertical'
      ? d3.scaleBand()
          .domain(sortedData.map(d => d.name))
          .range([0, width])
          .padding(0.1)
      : d3.scaleLinear()
          .domain([0, d3.max(sortedData, d => d.value) as number])
          .nice()
          .range([0, width]);

    const yScale = orientation === 'vertical'
      ? d3.scaleLinear()
          .domain([0, d3.max(sortedData, d => d.value) as number])
          .nice()
          .range([height, 0])
      : d3.scaleBand()
          .domain(sortedData.map(d => d.name))
          .range([0, height])
          .padding(0.1);

    // Color scale
    const colorScaleFunc = d3.scaleOrdinal()
      .domain(sortedData.map(d => d.name))
      .range(colorScale);

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add bars
    const bars = g.selectAll('.bar')
      .data(sortedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .style('cursor', 'pointer')
      .on('click', (event, d) => onDataPointClick?.(d))
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 0.8);
        onDataPointHover?.(d);
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 1);
      });

    if (orientation === 'vertical') {
      bars
        .attr('x', d => (xScale as d3.ScaleBand<string>)(d.name)!)
        .attr('width', (xScale as d3.ScaleBand<string>).bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', d => d.color || colorScaleFunc(d.name) as string);

      // Animate bars
      if (animate) {
        bars.transition()
          .duration(800)
          .delay((d, i) => i * 50)
          .attr('y', d => (yScale as d3.ScaleLinear<number, number>)(d.value))
          .attr('height', d => height - (yScale as d3.ScaleLinear<number, number>)(d.value));
      } else {
        bars
          .attr('y', d => (yScale as d3.ScaleLinear<number, number>)(d.value))
          .attr('height', d => height - (yScale as d3.ScaleLinear<number, number>)(d.value));
      }
    } else {
      bars
        .attr('x', 0)
        .attr('width', 0)
        .attr('y', d => (yScale as d3.ScaleBand<string>)(d.name)!)
        .attr('height', (yScale as d3.ScaleBand<string>).bandwidth())
        .attr('fill', d => d.color || colorScaleFunc(d.name) as string);

      // Animate bars
      if (animate) {
        bars.transition()
          .duration(800)
          .delay((d, i) => i * 50)
          .attr('width', d => (xScale as d3.ScaleLinear<number, number>)(d.value));
      } else {
        bars.attr('width', d => (xScale as d3.ScaleLinear<number, number>)(d.value));
      }
    }

    // Add value labels
    if (showValues) {
      const labels = g.selectAll('.label')
        .data(sortedData)
        .enter()
        .append('text')
        .attr('class', 'label')
        .style('font-size', '12px')
        .style('fill', '#666')
        .style('text-anchor', 'middle');

      if (orientation === 'vertical') {
        labels
          .attr('x', d => (xScale as d3.ScaleBand<string>)(d.name)! + (xScale as d3.ScaleBand<string>).bandwidth() / 2)
          .attr('y', height + 5)
          .text(d => d3.format('.2s')(d.value));

        if (animate) {
          labels
            .attr('y', height + 5)
            .transition()
            .duration(800)
            .delay((d, i) => i * 50 + 400)
            .attr('y', d => (yScale as d3.ScaleLinear<number, number>)(d.value) - 5);
        } else {
          labels.attr('y', d => (yScale as d3.ScaleLinear<number, number>)(d.value) - 5);
        }
      } else {
        labels
          .attr('x', 0)
          .attr('y', d => (yScale as d3.ScaleBand<string>)(d.name)! + (yScale as d3.ScaleBand<string>).bandwidth() / 2 + 4)
          .style('text-anchor', 'start')
          .text(d => d3.format('.2s')(d.value));

        if (animate) {
          labels
            .transition()
            .duration(800)
            .delay((d, i) => i * 50 + 400)
            .attr('x', d => (xScale as d3.ScaleLinear<number, number>)(d.value) + 5);
        } else {
          labels.attr('x', d => (xScale as d3.ScaleLinear<number, number>)(d.value) + 5);
        }
      }
    }

    // Add axes
    if (orientation === 'vertical') {
      const xAxis = d3.axisBottom(xScale as d3.ScaleBand<string>);
      const yAxis = d3.axisLeft(yScale as d3.ScaleLinear<number, number>)
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
    } else {
      const xAxis = d3.axisBottom(xScale as d3.ScaleLinear<number, number>)
        .tickFormat(d3.format('.2s'));
      const yAxis = d3.axisLeft(yScale as d3.ScaleBand<string>);

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
    }

  }, [data, width, height, orientation, showValues, sortBy, sortOrder, animate, colorScale]);

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