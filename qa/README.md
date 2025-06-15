# Direct Query QA Validation System

## Overview

The Direct Query QA Validation System ensures that displayed dashboard figures are correct by comparing dashboard values directly with database query results. This system implements the requirements specified in the QA audit schemas and integrates with the Pulser 4.0 and Caca validation frameworks.

## Features

- ✅ **Direct Database Validation**: Execute SQL queries and compare results with dashboard displays
- 🎯 **Tolerance-Based Checking**: Support for exact matches and tolerance-based validation
- 📊 **Comprehensive Reporting**: Generate detailed validation reports in multiple formats
- 🔄 **Auto-Validation**: Automatic validation at specified intervals
- 📝 **Audit Logging**: Store validation results in database for historical tracking
- 🔗 **React Integration**: Hooks and components for real-time validation status

## File Structure

```
qa/
├── README.md                          # This file
├── scout_dashboard_signal_audit.yaml  # Scout dashboard QA schema v1.1.1
├── ces_dashboard_audit.yaml          # CES dashboard QA schema v1.0.0
├── directQueryValidator.ts            # Core validation engine
└── validation_reports/                # Generated validation reports
    └── validation_report_TIMESTAMP.md

src/hooks/
└── useQAValidation.ts                 # React hook for dashboard integration

src/components/dashboard/
└── DashboardWithQA.tsx               # Example dashboard with QA integration

scripts/
└── run-qa-validation.ts              # CLI script for running validations

sql/
└── create_qa_functions.sql           # Database functions for validation
```

## Quick Start

### 1. Database Setup

Run the QA validation database functions:

```bash
# Apply the QA database functions
psql -f sql/create_qa_functions.sql
```

### 2. Install Dependencies

```bash
npm install js-yaml dotenv @types/js-yaml ts-node
```

### 3. Run Validation

```bash
# Validate Scout dashboard
npm run qa:validate:scout

# Validate CES dashboard  
npm run qa:validate:ces

# Validate both dashboards
npm run qa:validate:both

# Run with database logging
npm run qa:validate:save
```

### 4. Integrate with React Dashboard

```tsx
import { useQAValidation, ValidationBadge } from '../hooks/useQAValidation';

function MyDashboard() {
  const [dashboardData, setDashboardData] = useState({});
  
  const qaValidation = useQAValidation(dashboardData, {
    autoValidate: true,
    validationInterval: 15 // minutes
  });

  return (
    <div>
      <ValidationBadge validation={qaValidation} showDetails={true} />
      {/* Your dashboard content */}
    </div>
  );
}
```

## QA Schema Configuration

### Scout Dashboard Schema (v1.1.1)

Located in `qa/scout_dashboard_signal_audit.yaml`, includes validation for:

- **Transaction Metrics**: Total transactions, revenue, average order value
- **Customer Analytics**: Unique customers, gender distribution
- **Geographic Data**: Regional performance breakdown
- **Product Analytics**: Brand performance, category rankings
- **Data Accuracy**: Tolerance levels from exact match to 1 centavo precision

### Direct Query Validation Rules

```yaml
direct_query_qa:
  database_validation:
    - query: "SELECT COUNT(*) as total_transactions FROM dbo.transactions WHERE transaction_date >= CURRENT_DATE - INTERVAL '30 days'"
      expected_display: "dashboard_overview.total_transactions"
      tolerance: 0  # Exact match required
      description: "Transaction count must match exactly between DB and dashboard"
```

## Validation Process

### 1. Query Execution

The system executes SQL queries against the database using the `execute_custom_query` function:

```sql
SELECT execute_custom_query('SELECT COUNT(*) FROM dbo.transactions');
```

### 2. Value Comparison

Dashboard values are extracted from the component state and compared with database results:

```typescript
const dbValue = await executeQuery(validation.query);
const dashValue = getDashboardValue(validation.expected_display);
const isValid = isWithinTolerance(dbValue, dashValue, validation.tolerance);
```

### 3. Tolerance Checking

- **Exact Match** (`tolerance: 0`): Values must be identical
- **Absolute Tolerance** (`tolerance: 0.01`): Difference ≤ 0.01
- **Percentage Tolerance** (`tolerance: 5`): Difference ≤ 5% of larger value

### 4. Report Generation

Validation results are compiled into comprehensive reports:

```markdown
# Direct Query QA Validation Report

Generated: 2025-01-15T10:30:00Z
Total Validations: 8
Passed: 7
Failed: 1
Pass Rate: 87.5%

## ❌ Failed Validations

1. Revenue figures must be accurate within 1 centavo
   - Database Value: 2847592.50
   - Dashboard Value: 2847593.25
   - Difference: 0.75
```

## CLI Usage

### Basic Validation

```bash
# Run validation with default settings
npm run qa:validate

# Specify custom schema and report paths
ts-node scripts/run-qa-validation.ts ./qa/custom_schema.yaml ./reports/my_report.md

# Generate JSON report
ts-node scripts/run-qa-validation.ts '' '' json scout

# Verbose output with database logging
ts-node scripts/run-qa-validation.ts '' '' markdown scout --verbose --save-db
```

### Command Line Options

- **Schema Path**: Path to YAML schema file (optional)
- **Report Path**: Output path for validation report (optional)
- **Format**: `markdown`, `json`, or `yaml`
- **Dashboard**: `scout`, `ces`, or `both`
- **--verbose**: Show detailed validation output
- **--save-db**: Save results to database

## React Integration

### useQAValidation Hook

```typescript
const qaValidation = useQAValidation(dashboardData, {
  autoValidate: true,        // Enable automatic validation
  validationInterval: 30,    // Validate every 30 minutes
  schemaPath: './qa/scout_dashboard_signal_audit.yaml',
  enableLogging: true        // Console logging enabled
});

// Access validation state
qaValidation.isValid        // Overall validation status
qaValidation.summary       // Validation summary
qaValidation.results       // Detailed results
qaValidation.validate()    // Trigger manual validation
```

### Validation Components

```tsx
// Display validation badge
<ValidationBadge validation={qaValidation} showDetails={true} />

// Show detailed validation results
<ValidationDetails validation={qaValidation} />

// Check specific metric validity
const isMetricValid = qaValidation.isMetricValid('dashboard_overview.total_revenue');
```

## Database Functions

### Core Functions

- `execute_custom_query(query_text)`: Execute SELECT queries for validation
- `validate_dashboard_metrics()`: Get key dashboard metrics
- `validate_regional_data()`: Regional performance data
- `validate_brand_data()`: Brand performance data
- `validate_gender_data()`: Customer demographics
- `validate_category_data()`: Product category data

### Logging Functions

- `log_qa_validation()`: Store validation results in database
- Query `qa_validation_logs` table for historical validation data

## Configuration

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Package.json Scripts

```json
{
  "scripts": {
    "qa:validate": "ts-node scripts/run-qa-validation.ts",
    "qa:validate:scout": "ts-node scripts/run-qa-validation.ts '' '' markdown scout",
    "qa:validate:ces": "ts-node scripts/run-qa-validation.ts '' '' markdown ces",
    "qa:validate:both": "ts-node scripts/run-qa-validation.ts '' '' markdown both",
    "qa:validate:save": "ts-node scripts/run-qa-validation.ts '' '' json scout --save-db"
  }
}
```

## Integration with Pulser 4.0

### Pulser Command

```bash
:clodrep qa:load scout_dashboard_signal_audit.yaml
```

### Caca Validation

```bash
qa/ping_caca.ts --audit-schema scout_dashboard_signal_audit.yaml
```

## Performance Targets

- **Query Execution**: <100ms per validation query
- **Dashboard Load**: <1s with validation enabled
- **Validation Cycle**: <5s for complete dashboard validation
- **Auto-Validation**: 15-30 minute intervals recommended

## Error Handling

The system handles various error scenarios:

- **Database Connection Errors**: Graceful fallback with error logging
- **Query Execution Failures**: Individual validation failures don't stop process
- **Schema Loading Errors**: Clear error messages for invalid YAML
- **Dashboard Data Missing**: Validation skipped with warning

## Best Practices

1. **Tolerance Setting**: Use exact match (0) for counts, small tolerance for currency
2. **Validation Frequency**: Balance accuracy needs with performance impact
3. **Error Monitoring**: Monitor validation failure rates and investigate patterns
4. **Schema Updates**: Version control QA schemas and test changes thoroughly

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure database user has access to QA functions
2. **Schema Not Found**: Check file paths in validation commands
3. **Timeout Errors**: Increase query timeout for complex validations
4. **Type Mismatches**: Verify dashboard data types match expected formats

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
npm run qa:validate:scout -- --verbose
```

## Contributing

1. Update QA schemas when adding new dashboard metrics
2. Add database validation functions for new data types
3. Test validation logic with edge cases and boundary conditions
4. Document tolerance rationale for new validations

## Version History

- **v1.1.1**: Added direct query validation with 8 validation rules
- **v1.0.0**: Initial QA schema with UI/UX validation checks

## Support

For issues or questions about the QA validation system:

1. Check the troubleshooting section above
2. Review validation logs in `qa_validation_logs` table
3. Run validation with `--verbose` flag for detailed output
4. File issues with specific error messages and reproduction steps