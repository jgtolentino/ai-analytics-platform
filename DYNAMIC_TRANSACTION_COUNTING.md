# Dynamic Transaction Counting System

## Overview

The Dynamic Transaction Counting System automatically displays the **total number of transactions when no filters are applied** and **synchronizes data to show filtered transaction counts when filters are applied**. This ensures users always see accurate, contextual transaction counts that update in real-time as filters change.

## 🎯 Key Features

### 📊 Smart Transaction Display
- **No Filters**: Shows total transactions (e.g., "15,420 Total Transactions")
- **With Filters**: Shows filtered count (e.g., "3,250 Filtered Transactions of 15,420 total (21.1%)")
- **Real-time Updates**: Automatically syncs when filters change
- **Context Labels**: Clear indication of what data is being shown

### 🔄 Auto-Sync Data Loading
- Automatic data refresh when filters are applied or removed
- Maintains filter state across user interactions
- Loading states with progress indicators
- Error handling with retry capabilities

### 🎛️ Comprehensive Filtering
- **Date Range**: Custom start/end dates
- **Geographic**: Regions, stores, barangays
- **Product**: Brands, categories, SKUs
- **Temporal**: Time of day, weekday/weekend
- **Demographic**: Gender, age groups
- **Multi-select**: Combine multiple filter values

## 📁 File Structure

```
src/hooks/
├── useFilteredData.ts              # Main hook for dynamic data filtering
└── useQAValidation.ts              # QA validation integration

src/components/
├── dashboard/
│   ├── DynamicTransactionDashboard.tsx  # Main dashboard component
│   └── DashboardWithQA.tsx              # Dashboard with QA integration
└── filters/
    └── FilterPills.tsx                   # Filter UI components

sql/
├── transaction_count_functions.sql      # Database functions
└── create_qa_functions.sql             # QA validation functions

scripts/
├── test-dynamic-transactions.ts        # Testing script
└── run-qa-validation.ts               # QA validation script
```

## 🚀 Quick Start

### 1. Database Setup

```bash
# Apply transaction counting functions
psql -f sql/transaction_count_functions.sql
```

### 2. Test the System

```bash
# Run comprehensive tests
npm run test:dynamic-transactions
```

### 3. Use in React Components

```tsx
import { useFilteredData } from '../hooks/useFilteredData';

function Dashboard() {
  const {
    displayMetrics,
    hasActiveFilters,
    filters,
    updateFilter,
    clearAllFilters
  } = useFilteredData();

  return (
    <div>
      <h1>
        {displayMetrics?.transactions.toLocaleString()} 
        {hasActiveFilters ? ' Filtered' : ' Total'} Transactions
      </h1>
      {/* Your dashboard content */}
    </div>
  );
}
```

## 🔧 Core Functions

### useFilteredData Hook

The main React hook that manages dynamic transaction counting:

```typescript
const {
  // Data
  data,                    // Complete filtered dataset
  displayMetrics,          // Formatted display values
  isLoading,              // Loading state
  error,                  // Error state
  
  // Filter state
  filters,                // Current filter values
  hasActiveFilters,       // Boolean - any filters applied?
  
  // Filter actions
  updateFilter,           // Update specific filter
  clearAllFilters,        // Reset all filters
  applyDateRange,         // Set date range
  toggleRegion,           // Toggle region filter
  toggleBrand,            // Toggle brand filter
  toggleCategory,         // Toggle category filter
  
  // Data actions
  refetch,                // Manual data refresh
  getFilterSummary        // Get filter description text
} = useFilteredData();
```

### Database Functions

#### `get_total_transactions()`
Returns baseline metrics with no filters applied:

```sql
SELECT * FROM get_total_transactions();
-- Returns: total_transactions, total_revenue, avg_order_value, unique_customers
```

#### `get_filtered_transactions(...filters)`
Returns metrics with specified filters:

```sql
SELECT * FROM get_filtered_transactions(
  start_date := '2024-01-01',
  region_names := ARRAY['NCR', 'CALABARZON'],
  weekday_filter := 'weekday'
);
-- Returns: filtered_transactions, filtered_revenue, filter_ratio, etc.
```

#### `get_transaction_comparison(...filters)`
Returns both total and filtered counts for comparison:

```sql
SELECT * FROM get_transaction_comparison(
  region_names := ARRAY['NCR']
);
-- Returns: total_transactions, filtered_transactions, showing_label
```

## 📊 Display Logic

### Transaction Count Display

```typescript
// Logic for determining what to show
const getTransactionDisplay = () => {
  if (hasActiveFilters) {
    return {
      count: filteredTransactions,
      label: "Filtered Transactions",
      subtitle: `of ${totalTransactions.toLocaleString()} total (${filterRatio}%)`,
      isFiltered: true
    };
  }
  
  return {
    count: totalTransactions,
    label: "Total Transactions",
    subtitle: "All data shown",
    isFiltered: false
  };
};
```

### Visual Indicators

- **No Filters**: Blue styling, "Total Transactions" label
- **With Filters**: Orange styling, "Filtered Transactions" label, ratio display
- **Filter Pills**: Active filters shown as removable pills
- **Summary Text**: "Showing 3,250 of 15,420 transactions (21.1%)"

## 🎛️ Filter Implementation

### Filter Types

```typescript
interface FilterState {
  dateRange?: { start: string; end: string; };
  regions?: string[];
  brands?: string[];
  categories?: string[];
  stores?: string[];
  timeOfDay?: string[];        // 'morning', 'afternoon', 'evening', 'night'
  weekdayWeekend?: string;     // 'weekday', 'weekend', 'all'
  gender?: string[];
  ageGroups?: string[];
}
```

### Filter Actions

```typescript
// Date range filtering
applyDateRange('2024-01-01', '2024-01-31');

// Multi-select filtering
toggleRegion('NCR');           // Add/remove NCR
toggleBrand('Coca-Cola');      // Add/remove brand
toggleCategory('Beverages');   // Add/remove category

// Single-select filtering
updateFilter('weekdayWeekend', 'weekday');

// Clear filters
clearAllFilters();
```

### Auto-Sync Behavior

```typescript
// Data automatically reloads when filters change
useEffect(() => {
  loadData();
}, [filters]); // Dependency on filter state

// Loading states during sync
if (isLoading) {
  return <div>Syncing data with filters...</div>;
}
```

## 📱 User Interface

### Header Display

```jsx
<div className="dashboard-header">
  <h1>
    📊 {formatNumber(transactionCount)} 
    {isFiltered ? ' Filtered' : ' Total'} Transactions
  </h1>
  <p className="subtitle">
    {isFiltered 
      ? `of ${formatNumber(totalCount)} total (${filterRatio}%)`
      : 'All data shown'
    }
  </p>
  {isFiltered && (
    <span className="filtered-badge">🔍 Filtered View</span>
  )}
</div>
```

### Filter Panel

```jsx
<div className="filter-panel">
  <FilterPills 
    label="Regions"
    options={regionOptions}
    selected={filters.regions}
    onChange={(selected) => updateFilter('regions', selected)}
  />
  
  <DateRangePicker
    start={filters.dateRange?.start}
    end={filters.dateRange?.end}
    onChange={applyDateRange}
  />
  
  {hasActiveFilters && (
    <button onClick={clearAllFilters}>
      Clear All Filters
    </button>
  )}
</div>
```

### Metric Cards

```jsx
<MetricCard
  title={isFiltered ? "Filtered Transactions" : "Total Transactions"}
  value={formatNumber(displayMetrics.transactions)}
  subtitle={displayMetrics.filteringRatio}
  isFiltered={isFiltered}
/>
```

## 🔍 Testing

### Test Script

```bash
# Run comprehensive tests
npm run test:dynamic-transactions
```

The test script validates:

1. **Total Transactions**: Baseline count with no filters
2. **Filtered Transactions**: Various filter combinations
3. **Transaction Comparison**: Total vs filtered display
4. **Filter Options**: Available filter values
5. **Live Counts**: Real-time transaction metrics

### Test Scenarios

```typescript
const testCases = [
  {
    scenario: 'No filters applied',
    expected: 'Shows total transaction count'
  },
  {
    scenario: 'Date range filter (last 7 days)',
    expected: 'Shows only recent transactions'
  },
  {
    scenario: 'Region filter (NCR only)',
    expected: 'Shows only NCR transactions'
  },
  {
    scenario: 'Multiple filters combined',
    expected: 'Shows intersection of all filters'
  }
];
```

## ⚡ Performance Optimization

### Query Optimization

- **Materialized Views**: Pre-computed aggregations for faster queries
- **Indexed Columns**: Database indexes on filter columns
- **Query Caching**: Result caching for repeated filter combinations
- **Batch Loading**: Load related data in single queries

### React Optimization

- **Memoization**: useMemo for expensive calculations
- **Debounced Updates**: Prevent excessive API calls during filter changes
- **Loading States**: Progressive loading with skeleton screens
- **Error Boundaries**: Graceful error handling

## 🎯 Production Usage

### NPM Scripts

```bash
# Test the system
npm run test:dynamic-transactions

# Run QA validation
npm run qa:validate:scout

# Start development
npm run dev
```

### Environment Setup

```bash
# Required environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deployment Verification

```bash
# Verify transaction counting works in production
curl -s https://scout-mvp.vercel.app/api/transactions/total
curl -s https://scout-mvp.vercel.app/api/transactions/filtered
```

## 🔧 Customization

### Adding New Filters

1. **Update FilterState interface**:
```typescript
interface FilterState {
  // ... existing filters
  customFilter?: string[];
}
```

2. **Add database parameter**:
```sql
CREATE OR REPLACE FUNCTION get_filtered_transactions(
  -- ... existing parameters
  custom_filter TEXT[] DEFAULT NULL
)
```

3. **Update filter logic**:
```typescript
const toggleCustomFilter = useCallback((value: string) => {
  // Filter toggle logic
}, []);
```

### Custom Display Formats

```typescript
// Custom number formatting
const formatNumber = (num: number, type: 'transactions' | 'currency') => {
  switch (type) {
    case 'transactions':
      return new Intl.NumberFormat('en-PH').format(num);
    case 'currency':
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
      }).format(num);
  }
};
```

## 🚨 Troubleshooting

### Common Issues

1. **Filter Not Applied**
   - Check database function permissions
   - Verify filter parameter format
   - Test query execution directly

2. **Data Not Syncing**
   - Check useEffect dependencies
   - Verify API endpoint responses
   - Test filter state updates

3. **Performance Issues**
   - Review query execution time
   - Check for missing database indexes
   - Monitor filter combination complexity

### Debug Mode

```typescript
// Enable debug logging
const debug = process.env.NODE_ENV === 'development';

if (debug) {
  console.log('Filter state:', filters);
  console.log('Query parameters:', queryParams);
  console.log('API response:', data);
}
```

## 📈 Analytics & Monitoring

### Filter Usage Tracking

```sql
-- Log filter usage for analytics
SELECT log_filter_usage(
  user_session := 'session123',
  filters_applied := '{"regions": ["NCR"], "dateRange": "7days"}',
  result_count := 3250
);
```

### Performance Monitoring

```typescript
// Track query performance
const startTime = performance.now();
const result = await loadFilteredData();
const duration = performance.now() - startTime;

console.log(`Query completed in ${duration.toFixed(2)}ms`);
```

## 🎯 Best Practices

1. **Filter Combinations**: Limit complex filter combinations for performance
2. **Default Filters**: Set sensible defaults (e.g., last 30 days)
3. **User Feedback**: Show loading states and filter counts
4. **Error Handling**: Graceful fallbacks when filters fail
5. **Accessibility**: Keyboard navigation for filter controls

## 📚 API Reference

### Main Hook

```typescript
useFilteredData(options?: {
  autoRefresh?: boolean;
  defaultFilters?: FilterState;
  debounceMs?: number;
}) => {
  data: FilteredDataResult;
  displayMetrics: TransactionMetrics;
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
  hasActiveFilters: boolean;
  updateFilter: (key: string, value: any) => void;
  clearAllFilters: () => void;
  // ... more methods
}
```

### Database Functions

```sql
-- Get total transactions
get_total_transactions() → record

-- Get filtered transactions
get_filtered_transactions(filters...) → record

-- Compare total vs filtered
get_transaction_comparison(filters...) → record

-- Get available filter options
get_filter_options() → record
```

---

**🎯 Result**: Users see the **total number of transactions** when no filters are applied and **filtered transaction counts with context** when filters are active. Data automatically syncs when filters change, providing real-time, accurate transaction counting.