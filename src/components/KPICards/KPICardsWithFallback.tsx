// KPI Cards from v2.1 with production guards for v3.2.0
'use client';

import React, { useEffect, useState } from 'react';
import { Card, Badge } from '@scout/ui';
import { formatCurrency, formatPercentage, formatNumber } from '@scout/utils';
import { ErrorBoundary, SafeComponent } from '../../app/components/ErrorBoundary';

interface KPIMetric {
  label: string;
  value: string | number;
  change?: string | number;
  trend?: 'up' | 'down' | 'stable';
  loading?: boolean;
  error?: boolean;
}

const fallbackMetrics: KPIMetric[] = [
  { label: 'Total Revenue', value: '--', change: '--', loading: true },
  { label: 'Active Users', value: '--', change: '--', loading: true },
  { label: 'Avg Order Value', value: '--', change: '--', loading: true },
  { label: 'Conversion Rate', value: '--', change: '--', loading: true }
];

interface KPICardsProps {
  skipData?: boolean;
  fallbackMode?: boolean;
}

export function KPICardsWithFallback({ skipData = false, fallbackMode = false }: KPICardsProps) {
  const [metrics, setMetrics] = useState<KPIMetric[]>(fallbackMetrics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip data fetching if in fallback mode or skipData is true
    if (fallbackMode || skipData || process.env.SKIP_DATA === 'true') {
      setMetrics(fallbackMetrics.map(m => ({ ...m, loading: false, value: 'N/A' })));
      setLoading(false);
      return;
    }

    const fetchMetrics = async () => {
      const timeout = setTimeout(() => {
        setError('Data loading timeout');
        setLoading(false);
      }, 30000); // 30 second timeout

      try {
        const response = await fetch('/api/kpi-metrics', {
          signal: AbortSignal.timeout(30000)
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        
        setMetrics([
          {
            label: 'Total Revenue',
            value: formatCurrency(data.revenue.total),
            change: formatPercentage(data.revenue.growth),
            trend: data.revenue.trend
          },
          {
            label: 'Active Users',
            value: formatNumber(data.customers.active),
            change: formatPercentage(data.customers.growth),
            trend: data.customers.trend
          },
          {
            label: 'Avg Order Value',
            value: formatCurrency(data.transactions.averageValue),
            change: formatPercentage(data.transactions.growth),
            trend: data.transactions.trend
          },
          {
            label: 'Conversion Rate',
            value: formatPercentage(data.conversion.rate),
            change: `${data.conversion.change > 0 ? '+' : ''}${data.conversion.change}%`,
            trend: data.conversion.trend
          }
        ]);
        
        setError(null);
      } catch (err) {
        console.warn('KPI metrics fetch failed, using fallback:', err);
        setError('Unable to load live data');
        setMetrics(fallbackMetrics.map(m => ({ 
          ...m, 
          loading: false, 
          error: true,
          value: '--',
          change: '--' 
        })));
      } finally {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [fallbackMode, skipData]);

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <SafeComponent key={index} name={`kpi-${metric.label}`}>
            <Card className="p-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    {metric.label}
                  </span>
                  {metric.error && (
                    <Badge variant="error" size="sm">Offline</Badge>
                  )}
                </div>
                
                <div className="flex items-baseline gap-2">
                  {metric.loading ? (
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </span>
                      {metric.change && metric.change !== '--' && (
                        <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                          <span className="mr-1">{getTrendIcon(metric.trend)}</span>
                          {metric.change}
                        </span>
                      )}
                    </>
                  )}
                </div>
                
                {error && !metric.loading && (
                  <span className="text-xs text-gray-500">
                    {fallbackMode ? 'Safe mode active' : 'Using cached data'}
                  </span>
                )}
              </div>
            </Card>
          </SafeComponent>
        ))}
      </div>
    </ErrorBoundary>
  );
}