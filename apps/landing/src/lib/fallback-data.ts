// Fallback data for minimal mode - No external dependencies
export const fallbackStats = [
  { label: 'Active Users', value: '--', change: 'N/A' },
  { label: 'Data Points', value: '--', change: 'N/A' },
  { label: 'Insights Generated', value: '--', change: 'N/A' },
  { label: 'System Status', value: 'OK', change: 'Online' }
];

export const fallbackFeatures = [
  {
    title: 'Real-time Analytics',
    description: 'Monitor your retail performance with live data updates and interactive dashboards.',
    icon: '📊',
    badge: 'Core',
    status: 'unavailable'
  },
  {
    title: 'AI-Powered Insights',
    description: 'Get intelligent recommendations from our AI agents (temporarily unavailable).',
    icon: '🤖',
    badge: 'AI',
    status: 'unavailable'
  },
  {
    title: 'Interactive Charts',
    description: 'Explore data with advanced visualizations (data loading disabled).',
    icon: '📈',
    badge: 'Visual',
    status: 'unavailable'
  },
  {
    title: 'System Architecture',
    description: 'View the platform structure and components.',
    icon: '🔧',
    badge: 'Info',
    status: 'available'
  }
];

export const systemStatus = {
  mode: 'minimal',
  version: '3.1.1-minimal-stable',
  features: {
    ui: 'available',
    data: 'unavailable',
    ai: 'disabled',
    apis: 'stubbed'
  },
  message: 'Running in safe mode with reduced functionality'
};

// Safe data fetching that never throws
export async function safeFetch<T>(
  url: string, 
  fallbackData: T,
  timeout = 1000
): Promise<T> {
  // In fallback mode, always return fallback data
  if (process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true') {
    return Promise.resolve(fallbackData);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, { 
      signal: controller.signal,
      cache: 'no-store'
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch {
    // Always return fallback data on any error
    return fallbackData;
  }
}

// Safe component wrapper for dynamic imports
export function createSafeComponent<T>(
  componentLoader: () => Promise<{ default: React.ComponentType<T> }>,
  fallbackComponent: React.ComponentType<T>
) {
  return (props: T) => {
    try {
      const LazyComponent = React.lazy(componentLoader);
      return (
        <React.Suspense fallback={<fallbackComponent {...props} />}>
          <LazyComponent {...props} />
        </React.Suspense>
      );
    } catch {
      const FallbackComponent = fallbackComponent;
      return <FallbackComponent {...props} />;
    }
  };
}

// Environment check utilities
export const isMinimalMode = () => {
  return process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true' || 
         process.env.MINIMAL_UI === 'true';
};

export const shouldSkipData = () => {
  return process.env.SKIP_DATA === 'true' || isMinimalMode();
};

export const isAIDisabled = () => {
  return process.env.DISABLE_AI_AGENTS === 'true' || isMinimalMode();
};