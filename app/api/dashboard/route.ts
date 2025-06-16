// Scout Analytics v3.3.0 - Main Dashboard API Route
// Consolidates all incremental changes into full-stack backend

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-key'
);

// Mock data for development/fallback
const MOCK_DASHBOARD_DATA = {
  dashboard_overview: {
    total_transactions: 15420,
    total_revenue: 2847592.50,
    avg_order_value: 184.65,
    unique_customers: 8932
  },
  regional_chart: {
    data: [
      { region_name: 'NCR', txn_count: 5234, total_revenue: 1245632.30 },
      { region_name: 'CALABARZON', txn_count: 3892, total_revenue: 892341.75 },
      { region_name: 'Central Luzon', txn_count: 2851, total_revenue: 567890.25 },
      { region_name: 'Western Visayas', txn_count: 1923, total_revenue: 423567.80 },
      { region_name: 'Northern Mindanao', txn_count: 1520, total_revenue: 318160.40 }
    ]
  },
  brand_performance_chart: {
    data: [
      { brand_name: 'Alaska Milk', brand_revenue: 485672.30, item_count: 1523 },
      { brand_name: 'Oishi', brand_revenue: 398234.75, item_count: 1287 },
      { brand_name: 'Del Monte', brand_revenue: 327891.50, item_count: 1094 },
      { brand_name: 'Nestle', brand_revenue: 287654.20, item_count: 956 },
      { brand_name: 'Coca-Cola', brand_revenue: 198743.65, item_count: 743 }
    ]
  },
  gender_silhouette_chart: {
    data: [
      { gender: 'Male', count: 4521, customer_count: 2834, transaction_count: 7892 },
      { gender: 'Female', count: 4411, customer_count: 2756, transaction_count: 7628 }
    ]
  },
  top_categories_chart: {
    data: [
      { category: 'Beverages', item_count: 3254, category_revenue: 624531.20 },
      { category: 'Snacks', item_count: 2987, category_revenue: 456789.30 },
      { category: 'Personal Care', item_count: 2543, category_revenue: 398456.70 },
      { category: 'Household', item_count: 2198, category_revenue: 345678.90 },
      { category: 'Dairy', item_count: 1876, category_revenue: 287654.50 }
    ]
  }
};

async function getDashboardData() {
  try {
    // Try to load real data from Supabase
    const [
      totalTransactions,
      regionalData,
      brandData,
      categoryData,
      genderData
    ] = await Promise.allSettled([
      supabase.rpc('get_total_transactions'),
      supabase.rpc('validate_regional_data'),
      supabase.rpc('validate_brand_data'),
      supabase.rpc('validate_category_data'),
      supabase.rpc('validate_gender_data')
    ]);

    // Check if we have valid data
    const hasValidData = [totalTransactions, regionalData, brandData, categoryData, genderData]
      .some(result => result.status === 'fulfilled' && result.value.data);

    if (hasValidData) {
      return {
        dashboard_overview: {
          total_transactions: totalTransactions.status === 'fulfilled' ? totalTransactions.value.data?.total_transactions || 0 : 0,
          total_revenue: totalTransactions.status === 'fulfilled' ? totalTransactions.value.data?.total_revenue || 0 : 0,
          avg_order_value: totalTransactions.status === 'fulfilled' ? totalTransactions.value.data?.avg_order_value || 0 : 0,
          unique_customers: totalTransactions.status === 'fulfilled' ? totalTransactions.value.data?.unique_customers || 0 : 0
        },
        regional_chart: { 
          data: regionalData.status === 'fulfilled' ? regionalData.value.data || [] : [] 
        },
        brand_performance_chart: { 
          data: brandData.status === 'fulfilled' ? brandData.value.data || [] : [] 
        },
        top_categories_chart: { 
          data: categoryData.status === 'fulfilled' ? categoryData.value.data || [] : [] 
        },
        gender_silhouette_chart: { 
          data: genderData.status === 'fulfilled' ? genderData.value.data || [] : [] 
        },
        source: 'supabase'
      };
    }
  } catch (error) {
    console.log('Supabase connection failed, using mock data:', error);
  }

  // Fallback to mock data
  return {
    ...MOCK_DASHBOARD_DATA,
    source: 'mock'
  };
}

export async function GET(request: NextRequest) {
  try {
    const data = await getDashboardData();
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      version: '3.3.0'
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to load dashboard data',
      data: MOCK_DASHBOARD_DATA,
      source: 'fallback',
      timestamp: new Date().toISOString(),
      version: '3.3.0'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters, timeframe } = body;

    // Apply filters and return filtered data
    const data = await getDashboardData();
    
    // Simple filter implementation
    let filteredData = { ...data };
    
    if (filters?.region) {
      filteredData.regional_chart.data = filteredData.regional_chart.data.filter(
        (item: any) => item.region_name.toLowerCase().includes(filters.region.toLowerCase())
      );
    }
    
    if (filters?.brand) {
      filteredData.brand_performance_chart.data = filteredData.brand_performance_chart.data.filter(
        (item: any) => item.brand_name.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
      filters,
      timestamp: new Date().toISOString(),
      version: '3.3.0'
    });
  } catch (error) {
    console.error('Dashboard filter API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to filter dashboard data',
      timestamp: new Date().toISOString(),
      version: '3.3.0'
    }, { status: 500 });
  }
}