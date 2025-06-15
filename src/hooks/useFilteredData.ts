// useFilteredData.ts - Dynamic data filtering with transaction counting
// Handles total transaction count display and filter-based data sync
// Version: 1.0.0

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

interface FilterState {
  dateRange?: {
    start: string;
    end: string;
  };
  regions?: string[];
  brands?: string[];
  categories?: string[];
  stores?: string[];
  timeOfDay?: string[];
  weekdayWeekend?: 'weekday' | 'weekend' | 'all';
  gender?: string[];
  ageGroups?: string[];
}

interface TransactionMetrics {
  total_transactions: number;
  filtered_transactions: number;
  total_revenue: number;
  filtered_revenue: number;
  avg_order_value: number;
  unique_customers: number;
  growth_rate?: number;
}

interface FilteredDataResult {
  metrics: TransactionMetrics;
  regionalData: any[];
  brandData: any[];
  categoryData: any[];
  genderData: any[];
  timeSeriesData: any[];
  isFiltered: boolean;
  appliedFilters: FilterState;
}

export function useFilteredData() {
  const [filters, setFilters] = useState<FilterState>({
    weekdayWeekend: 'all'
  });
  const [data, setData] = useState<FilteredDataResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check if any filters are applied
  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filters.dateRange ||
      (filters.regions && filters.regions.length > 0) ||
      (filters.brands && filters.brands.length > 0) ||
      (filters.categories && filters.categories.length > 0) ||
      (filters.stores && filters.stores.length > 0) ||
      (filters.timeOfDay && filters.timeOfDay.length > 0) ||
      (filters.weekdayWeekend && filters.weekdayWeekend !== 'all') ||
      (filters.gender && filters.gender.length > 0) ||
      (filters.ageGroups && filters.ageGroups.length > 0)
    );
  }, [filters]);

  // Build WHERE clause for SQL queries based on filters
  const buildWhereClause = useCallback((tableAlias = 't') => {
    const conditions: string[] = [];
    const params: any = {};

    // Date range filter
    if (filters.dateRange) {
      conditions.push(`${tableAlias}.transaction_date >= $1 AND ${tableAlias}.transaction_date <= $2`);
      params.startDate = filters.dateRange.start;
      params.endDate = filters.dateRange.end;
    } else {
      // Default to last 30 days if no date filter
      conditions.push(`${tableAlias}.transaction_date >= CURRENT_DATE - INTERVAL '30 days'`);
    }

    // Region filter
    if (filters.regions && filters.regions.length > 0) {
      conditions.push(`r.region_name = ANY($3)`);
      params.regions = filters.regions;
    }

    // Brand filter (requires join with products and brands)
    if (filters.brands && filters.brands.length > 0) {
      conditions.push(`b.brand_name = ANY($4)`);
      params.brands = filters.brands;
    }

    // Category filter (requires join with products)
    if (filters.categories && filters.categories.length > 0) {
      conditions.push(`p.category = ANY($5)`);
      params.categories = filters.categories;
    }

    // Store filter
    if (filters.stores && filters.stores.length > 0) {
      conditions.push(`s.store_name = ANY($6)`);
      params.stores = filters.stores;
    }

    // Time of day filter
    if (filters.timeOfDay && filters.timeOfDay.length > 0) {
      const timeConditions = filters.timeOfDay.map(time => {
        switch (time) {
          case 'morning': return `EXTRACT(HOUR FROM ${tableAlias}.transaction_date) BETWEEN 6 AND 11`;
          case 'afternoon': return `EXTRACT(HOUR FROM ${tableAlias}.transaction_date) BETWEEN 12 AND 17`;
          case 'evening': return `EXTRACT(HOUR FROM ${tableAlias}.transaction_date) BETWEEN 18 AND 23`;
          case 'night': return `EXTRACT(HOUR FROM ${tableAlias}.transaction_date) BETWEEN 0 AND 5`;
          default: return '1=1';
        }
      });
      conditions.push(`(${timeConditions.join(' OR ')})`);
    }

    // Weekday/Weekend filter
    if (filters.weekdayWeekend === 'weekday') {
      conditions.push(`EXTRACT(DOW FROM ${tableAlias}.transaction_date) BETWEEN 1 AND 5`);
    } else if (filters.weekdayWeekend === 'weekend') {
      conditions.push(`EXTRACT(DOW FROM ${tableAlias}.transaction_date) IN (0, 6)`);
    }

    // Gender filter (requires join with customers)
    if (filters.gender && filters.gender.length > 0) {
      conditions.push(`c.gender = ANY($7)`);
      params.gender = filters.gender;
    }

    return {
      whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      params
    };
  }, [filters]);

  // Load transaction metrics (total vs filtered)
  const loadTransactionMetrics = useCallback(async () => {
    const { whereClause } = buildWhereClause();
    
    try {
      // Get total transactions (unfiltered)
      const { data: totalData, error: totalError } = await supabase.rpc('get_total_transactions');
      if (totalError) throw totalError;

      // Get filtered transactions if filters are applied
      let filteredData = totalData;
      if (hasActiveFilters) {
        const query = `
          SELECT 
            COUNT(*) as total_transactions,
            SUM(total_amount) as total_revenue,
            AVG(total_amount) as avg_order_value,
            COUNT(DISTINCT customer_id) as unique_customers
          FROM dbo.transactions t
          LEFT JOIN dbo.regions r ON t.region_id = r.region_id
          LEFT JOIN dbo.stores s ON t.store_id = s.store_id
          LEFT JOIN dbo.customers c ON t.customer_id = c.customer_id
          ${whereClause}
        `;
        
        const { data: filtered, error: filteredError } = await supabase.rpc('execute_custom_query', {
          query_text: query
        });
        if (filteredError) throw filteredError;
        filteredData = filtered[0];
      }

      return {
        total_transactions: parseInt(totalData?.total_transactions || 0),
        filtered_transactions: parseInt(filteredData?.total_transactions || 0),
        total_revenue: parseFloat(totalData?.total_revenue || 0),
        filtered_revenue: parseFloat(filteredData?.total_revenue || 0),
        avg_order_value: parseFloat(filteredData?.avg_order_value || 0),
        unique_customers: parseInt(filteredData?.unique_customers || 0)
      };
    } catch (error) {
      console.error('Error loading transaction metrics:', error);
      throw error;
    }
  }, [buildWhereClause, hasActiveFilters, supabase]);

  // Load regional data with filters
  const loadRegionalData = useCallback(async () => {
    const { whereClause } = buildWhereClause();
    
    const query = `
      SELECT 
        r.region_name,
        COUNT(t.transaction_id) as txn_count,
        SUM(t.total_amount) as total_revenue,
        AVG(t.total_amount) as avg_order_value
      FROM dbo.transactions t
      JOIN dbo.regions r ON t.region_id = r.region_id
      LEFT JOIN dbo.stores s ON t.store_id = s.store_id
      LEFT JOIN dbo.customers c ON t.customer_id = c.customer_id
      ${whereClause}
      GROUP BY r.region_name
      ORDER BY txn_count DESC
    `;

    const { data, error } = await supabase.rpc('execute_custom_query', {
      query_text: query
    });
    if (error) throw error;
    return data || [];
  }, [buildWhereClause, supabase]);

  // Load brand performance data with filters
  const loadBrandData = useCallback(async () => {
    const { whereClause } = buildWhereClause();
    
    const query = `
      SELECT 
        b.brand_name,
        SUM(ti.total_price) as brand_revenue,
        COUNT(ti.item_id) as item_count,
        AVG(ti.total_price) as avg_item_price
      FROM dbo.transaction_items ti
      JOIN dbo.products p ON ti.product_id = p.product_id
      JOIN dbo.brands b ON p.brand_id = b.brand_id
      JOIN dbo.transactions t ON ti.transaction_id = t.transaction_id
      LEFT JOIN dbo.regions r ON t.region_id = r.region_id
      LEFT JOIN dbo.stores s ON t.store_id = s.store_id
      LEFT JOIN dbo.customers c ON t.customer_id = c.customer_id
      ${whereClause}
      GROUP BY b.brand_name
      ORDER BY brand_revenue DESC
      LIMIT 10
    `;

    const { data, error } = await supabase.rpc('execute_custom_query', {
      query_text: query
    });
    if (error) throw error;
    return data || [];
  }, [buildWhereClause, supabase]);

  // Load category data with filters
  const loadCategoryData = useCallback(async () => {
    const { whereClause } = buildWhereClause();
    
    const query = `
      SELECT 
        p.category,
        COUNT(ti.item_id) as item_count,
        SUM(ti.total_price) as category_revenue,
        AVG(ti.total_price) as avg_price
      FROM dbo.transaction_items ti
      JOIN dbo.products p ON ti.product_id = p.product_id
      JOIN dbo.transactions t ON ti.transaction_id = t.transaction_id
      LEFT JOIN dbo.regions r ON t.region_id = r.region_id
      LEFT JOIN dbo.stores s ON t.store_id = s.store_id
      LEFT JOIN dbo.customers c ON t.customer_id = c.customer_id
      ${whereClause}
      GROUP BY p.category
      ORDER BY item_count DESC
      LIMIT 10
    `;

    const { data, error } = await supabase.rpc('execute_custom_query', {
      query_text: query
    });
    if (error) throw error;
    return data || [];
  }, [buildWhereClause, supabase]);

  // Load gender distribution with filters
  const loadGenderData = useCallback(async () => {
    const { whereClause } = buildWhereClause();
    
    const query = `
      SELECT 
        c.gender,
        COUNT(DISTINCT c.customer_id) as customer_count,
        COUNT(t.transaction_id) as transaction_count,
        SUM(t.total_amount) as total_spent
      FROM dbo.customers c
      JOIN dbo.transactions t ON c.customer_id = t.customer_id
      LEFT JOIN dbo.regions r ON t.region_id = r.region_id
      LEFT JOIN dbo.stores s ON t.store_id = s.store_id
      ${whereClause}
      GROUP BY c.gender
      ORDER BY customer_count DESC
    `;

    const { data, error } = await supabase.rpc('execute_custom_query', {
      query_text: query
    });
    if (error) throw error;
    return data || [];
  }, [buildWhereClause, supabase]);

  // Load time series data for trend analysis
  const loadTimeSeriesData = useCallback(async () => {
    const { whereClause } = buildWhereClause();
    
    const query = `
      SELECT 
        DATE(transaction_date) as date,
        COUNT(*) as daily_transactions,
        SUM(total_amount) as daily_revenue,
        COUNT(DISTINCT customer_id) as daily_customers
      FROM dbo.transactions t
      LEFT JOIN dbo.regions r ON t.region_id = r.region_id
      LEFT JOIN dbo.stores s ON t.store_id = s.store_id
      LEFT JOIN dbo.customers c ON t.customer_id = c.customer_id
      ${whereClause}
      GROUP BY DATE(transaction_date)
      ORDER BY date DESC
      LIMIT 30
    `;

    const { data, error } = await supabase.rpc('execute_custom_query', {
      query_text: query
    });
    if (error) throw error;
    return data || [];
  }, [buildWhereClause, supabase]);

  // Main data loading function
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [
        metrics,
        regionalData,
        brandData,
        categoryData,
        genderData,
        timeSeriesData
      ] = await Promise.all([
        loadTransactionMetrics(),
        loadRegionalData(),
        loadBrandData(),
        loadCategoryData(),
        loadGenderData(),
        loadTimeSeriesData()
      ]);

      setData({
        metrics,
        regionalData,
        brandData,
        categoryData,
        genderData,
        timeSeriesData,
        isFiltered: hasActiveFilters,
        appliedFilters: { ...filters }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Data loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    loadTransactionMetrics,
    loadRegionalData,
    loadBrandData,
    loadCategoryData,
    loadGenderData,
    loadTimeSeriesData,
    hasActiveFilters,
    filters
  ]);

  // Auto-reload data when filters change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter management functions
  const updateFilter = useCallback((filterType: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  const clearFilter = useCallback((filterType: keyof FilterState) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterType];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      weekdayWeekend: 'all'
    });
  }, []);

  const applyDateRange = useCallback((start: string, end: string) => {
    updateFilter('dateRange', { start, end });
  }, [updateFilter]);

  const toggleRegion = useCallback((region: string) => {
    setFilters(prev => {
      const current = prev.regions || [];
      const newRegions = current.includes(region)
        ? current.filter(r => r !== region)
        : [...current, region];
      return { ...prev, regions: newRegions };
    });
  }, []);

  const toggleBrand = useCallback((brand: string) => {
    setFilters(prev => {
      const current = prev.brands || [];
      const newBrands = current.includes(brand)
        ? current.filter(b => b !== brand)
        : [...current, brand];
      return { ...prev, brands: newBrands };
    });
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => {
      const current = prev.categories || [];
      const newCategories = current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category];
      return { ...prev, categories: newCategories };
    });
  }, []);

  // Computed values
  const displayMetrics = useMemo(() => {
    if (!data) return null;

    const { metrics } = data;
    return {
      // Show total transactions when no filters, filtered when filters applied
      transactions: hasActiveFilters ? metrics.filtered_transactions : metrics.total_transactions,
      revenue: hasActiveFilters ? metrics.filtered_revenue : metrics.total_revenue,
      avgOrderValue: metrics.avg_order_value,
      uniqueCustomers: metrics.unique_customers,
      
      // Additional context
      totalTransactions: metrics.total_transactions,
      filteredTransactions: metrics.filtered_transactions,
      filteringActive: hasActiveFilters,
      filteringRatio: hasActiveFilters ? 
        (metrics.filtered_transactions / metrics.total_transactions * 100).toFixed(1) + '%' : '100%'
    };
  }, [data, hasActiveFilters]);

  return {
    // Data
    data,
    displayMetrics,
    isLoading,
    error,
    
    // Filter state
    filters,
    hasActiveFilters,
    
    // Filter actions
    updateFilter,
    clearFilter,
    clearAllFilters,
    applyDateRange,
    toggleRegion,
    toggleBrand,
    toggleCategory,
    
    // Data actions
    refetch: loadData,
    
    // Computed helpers
    getFilterSummary: () => {
      const active = [];
      if (filters.dateRange) active.push('Date Range');
      if (filters.regions?.length) active.push(`${filters.regions.length} Regions`);
      if (filters.brands?.length) active.push(`${filters.brands.length} Brands`);
      if (filters.categories?.length) active.push(`${filters.categories.length} Categories`);
      if (filters.weekdayWeekend !== 'all') active.push(filters.weekdayWeekend);
      return active.join(', ') || 'No filters applied';
    }
  };
}

export default useFilteredData;