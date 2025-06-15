// useDrilldown.ts - Hook for handling chart drilldown interactions
import { useRouter } from 'next/router';
import { useCallback } from 'react';

interface DrilldownConfig {
  setFilter?: string;
  navigate?: string;
  openModal?: string;
}

export function useDrilldown() {
  const router = useRouter();

  const handleDrilldown = useCallback((
    value: string,
    config: DrilldownConfig
  ) => {
    // Set filter in URL params
    if (config.setFilter) {
      const currentQuery = { ...router.query };
      currentQuery[config.setFilter] = value;
      
      // Navigate to target page with filter applied
      if (config.navigate) {
        router.push({
          pathname: config.navigate,
          query: currentQuery
        });
      } else {
        // Update current page with new filter
        router.push({
          pathname: router.pathname,
          query: currentQuery
        });
      }
    }

    // Open modal (for detailed views)
    if (config.openModal) {
      // Trigger modal open event
      window.dispatchEvent(new CustomEvent('openModal', {
        detail: { modal: config.openModal, value }
      }));
    }
  }, [router]);

  return { handleDrilldown };
}