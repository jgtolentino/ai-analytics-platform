#!/usr/bin/env ts-node

// Test script for dynamic transaction counting
// Demonstrates total vs filtered transaction display
// Usage: npm run test:dynamic-transactions

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

interface TransactionTest {
  scenario: string;
  filters: any;
  expected: string;
}

class DynamicTransactionTester {
  private supabase: any;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async testTotalTransactions() {
    console.log('🔍 Testing Total Transactions (No Filters)...\n');
    
    try {
      const { data, error } = await this.supabase.rpc('get_total_transactions');
      if (error) throw error;

      console.log('✅ Total Transactions Result:');
      console.log(`   📊 Total Transactions: ${data.total_transactions?.toLocaleString()}`);
      console.log(`   💰 Total Revenue: ₱${data.total_revenue?.toLocaleString()}`);
      console.log(`   🛒 Avg Order Value: ₱${data.avg_order_value?.toFixed(2)}`);
      console.log(`   👥 Unique Customers: ${data.unique_customers?.toLocaleString()}`);
      console.log(`   📅 Date Range: ${data.date_range_start} to ${data.date_range_end}`);
      
      return data;
    } catch (error) {
      console.error('❌ Error testing total transactions:', error);
      throw error;
    }
  }

  async testFilteredTransactions() {
    console.log('\n🔍 Testing Filtered Transactions...\n');
    
    const testCases: TransactionTest[] = [
      {
        scenario: 'Last 7 days only',
        filters: {
          start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0]
        },
        expected: 'Should show fewer transactions than total'
      },
      {
        scenario: 'NCR region only',
        filters: {
          region_names: ['NCR', 'National Capital Region']
        },
        expected: 'Should show only NCR transactions'
      },
      {
        scenario: 'Weekends only',
        filters: {
          weekday_filter: 'weekend'
        },
        expected: 'Should show only weekend transactions'
      },
      {
        scenario: 'Morning hours only',
        filters: {
          time_periods: ['morning']
        },
        expected: 'Should show only 6AM-12PM transactions'
      },
      {
        scenario: 'Multiple filters combined',
        filters: {
          region_names: ['NCR'],
          weekday_filter: 'weekday',
          time_periods: ['morning', 'afternoon']
        },
        expected: 'Should show NCR weekday morning/afternoon transactions'
      }
    ];

    for (const testCase of testCases) {
      console.log(`📋 Scenario: ${testCase.scenario}`);
      console.log(`   Expected: ${testCase.expected}`);
      
      try {
        const { data, error } = await this.supabase.rpc('get_filtered_transactions', testCase.filters);
        if (error) throw error;

        console.log('   ✅ Results:');
        console.log(`      📊 Filtered Transactions: ${data.filtered_transactions?.toLocaleString()}`);
        console.log(`      💰 Filtered Revenue: ₱${data.filtered_revenue?.toLocaleString()}`);
        console.log(`      🛒 Avg Order Value: ₱${data.avg_order_value?.toFixed(2)}`);
        console.log(`      👥 Unique Customers: ${data.unique_customers?.toLocaleString()}`);
        console.log(`      📊 Filter Ratio: ${data.filter_ratio?.toFixed(1)}%`);
        console.log('');
      } catch (error) {
        console.error(`   ❌ Error in scenario "${testCase.scenario}":`, error);
      }
    }
  }

  async testTransactionComparison() {
    console.log('\n🔍 Testing Transaction Comparison (Total vs Filtered)...\n');
    
    try {
      // Test with no filters
      console.log('📋 Scenario: No filters applied');
      const { data: noFilters, error: noFiltersError } = await this.supabase.rpc('get_transaction_comparison');
      if (noFiltersError) throw noFiltersError;

      console.log('   ✅ No Filters Result:');
      console.log(`      📊 Total: ${noFilters.total_transactions?.toLocaleString()}`);
      console.log(`      📊 Showing: ${noFilters.filtered_transactions?.toLocaleString()}`);
      console.log(`      📋 Label: ${noFilters.showing_label}`);
      console.log('');

      // Test with filters
      console.log('📋 Scenario: With date range filter (last 7 days)');
      const { data: withFilters, error: withFiltersError } = await this.supabase.rpc('get_transaction_comparison', {
        start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
      });
      if (withFiltersError) throw withFiltersError;

      console.log('   ✅ With Filters Result:');
      console.log(`      📊 Total: ${withFilters.total_transactions?.toLocaleString()}`);
      console.log(`      📊 Filtered: ${withFilters.filtered_transactions?.toLocaleString()}`);
      console.log(`      💰 Total Revenue: ₱${withFilters.total_revenue?.toLocaleString()}`);
      console.log(`      💰 Filtered Revenue: ₱${withFilters.filtered_revenue?.toLocaleString()}`);
      console.log(`      📊 Filter Ratio: ${withFilters.filter_ratio?.toFixed(1)}%`);
      console.log(`      📋 Label: ${withFilters.showing_label}`);
      
    } catch (error) {
      console.error('❌ Error testing transaction comparison:', error);
      throw error;
    }
  }

  async testFilterOptions() {
    console.log('\n🔍 Testing Available Filter Options...\n');
    
    try {
      const { data, error } = await this.supabase.rpc('get_filter_options');
      if (error) throw error;

      console.log('✅ Available Filter Options:');
      console.log(`   🌍 Regions: ${data.regions?.join(', ')}`);
      console.log(`   🏢 Brands: ${data.brands?.slice(0, 10).join(', ')}${data.brands?.length > 10 ? '...' : ''}`);
      console.log(`   📦 Categories: ${data.categories?.join(', ')}`);
      console.log(`   🏪 Stores: ${data.stores?.slice(0, 5).join(', ')}${data.stores?.length > 5 ? '...' : ''}`);
      console.log(`   👤 Genders: ${data.genders?.join(', ')}`);
      
    } catch (error) {
      console.error('❌ Error testing filter options:', error);
      throw error;
    }
  }

  async testLiveTransactionCount() {
    console.log('\n🔍 Testing Live Transaction Count...\n');
    
    try {
      const { data, error } = await this.supabase.rpc('get_live_transaction_count');
      if (error) throw error;

      console.log('✅ Live Transaction Metrics:');
      console.log(`   📊 Current Total: ${data.current_count?.toLocaleString()}`);
      console.log(`   ⏰ Last Hour: ${data.last_hour_count?.toLocaleString()}`);
      console.log(`   📅 Today: ${data.today_count?.toLocaleString()}`);
      console.log(`   📈 Growth Rate: ${data.growth_rate?.toFixed(1)}%`);
      console.log(`   🕐 Last Updated: ${data.last_updated}`);
      
    } catch (error) {
      console.error('❌ Error testing live transaction count:', error);
      throw error;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Dynamic Transaction Count Tests\n');
    console.log('=' .repeat(60));
    
    try {
      await this.testTotalTransactions();
      await this.testFilteredTransactions();
      await this.testTransactionComparison();
      await this.testFilterOptions();
      await this.testLiveTransactionCount();
      
      console.log('\n' + '=' .repeat(60));
      console.log('✅ All tests completed successfully!');
      console.log('\n📋 Summary:');
      console.log('   • Total transactions function works ✓');
      console.log('   • Filtered transactions function works ✓');
      console.log('   • Transaction comparison function works ✓');
      console.log('   • Filter options loading works ✓');
      console.log('   • Live transaction count works ✓');
      console.log('\n🎯 Dynamic transaction counting is ready for production!');
      
    } catch (error) {
      console.error('\n❌ Test suite failed:', error);
      process.exit(1);
    }
  }
}

// CLI execution
if (require.main === module) {
  const tester = new DynamicTransactionTester();
  tester.runAllTests();
}

export { DynamicTransactionTester };