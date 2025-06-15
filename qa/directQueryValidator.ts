// Direct Query QA Validator - Ensures displayed figures match database values
// Compatible with Pulser 4.0 and Caca validation framework
// Version: 1.0.0

import { createClient } from '@supabase/supabase-js';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

interface QueryValidation {
  query: string;
  expected_display: string;
  tolerance: number;
  description: string;
}

interface ValidationResult {
  query: string;
  expected_display: string;
  database_value: number | string;
  dashboard_value: number | string;
  tolerance: number;
  passed: boolean;
  difference?: number;
  error?: string;
  description: string;
}

interface QASchema {
  dashboard_audit: {
    direct_query_qa: {
      database_validation: QueryValidation[];
    };
  };
}

export class DirectQueryValidator {
  private supabase: any;
  private dashboardData: Record<string, any> = {};

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Load QA schema from YAML file
   */
  private loadQASchema(schemaPath: string): QASchema {
    try {
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      return yaml.load(schemaContent) as QASchema;
    } catch (error) {
      throw new Error(`Failed to load QA schema: ${error}`);
    }
  }

  /**
   * Execute database query and return result
   */
  private async executeQuery(query: string): Promise<number | string> {
    try {
      const { data, error } = await this.supabase.rpc('execute_custom_query', {
        query_text: query
      });

      if (error) throw error;

      // Handle different query result formats
      if (Array.isArray(data) && data.length > 0) {
        const firstRow = data[0];
        const firstValue = Object.values(firstRow)[0];
        return firstValue as number | string;
      }

      return 0;
    } catch (error) {
      throw new Error(`Query execution failed: ${error}`);
    }
  }

  /**
   * Extract dashboard value from display path
   */
  private getDashboardValue(displayPath: string): number | string {
    const pathParts = displayPath.split('.');
    let value = this.dashboardData;

    for (const part of pathParts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        throw new Error(`Dashboard path not found: ${displayPath}`);
      }
    }

    return value as unknown as number | string;
  }

  /**
   * Check if values match within tolerance
   */
  private isWithinTolerance(
    dbValue: number | string,
    dashValue: number | string,
    tolerance: number
  ): { passed: boolean; difference?: number } {
    // Handle string comparisons (exact match)
    if (typeof dbValue === 'string' || typeof dashValue === 'string') {
      return { passed: String(dbValue) === String(dashValue) };
    }

    // Handle numeric comparisons with tolerance
    const dbNum = Number(dbValue);
    const dashNum = Number(dashValue);
    
    if (isNaN(dbNum) || isNaN(dashNum)) {
      return { passed: false };
    }

    const difference = Math.abs(dbNum - dashNum);
    
    if (tolerance === 0) {
      // Exact match required
      return { passed: difference === 0, difference };
    } else {
      // Percentage or absolute tolerance
      const withinTolerance = tolerance < 1 
        ? difference <= tolerance  // Absolute tolerance
        : difference / Math.max(dbNum, 1) <= tolerance / 100; // Percentage tolerance
      
      return { passed: withinTolerance, difference };
    }
  }

  /**
   * Validate a single query against dashboard data
   */
  private async validateQuery(validation: QueryValidation): Promise<ValidationResult> {
    try {
      const databaseValue = await this.executeQuery(validation.query);
      const dashboardValue = this.getDashboardValue(validation.expected_display);
      
      const toleranceCheck = this.isWithinTolerance(
        databaseValue,
        dashboardValue,
        validation.tolerance
      );

      return {
        query: validation.query,
        expected_display: validation.expected_display,
        database_value: databaseValue,
        dashboard_value: dashboardValue,
        tolerance: validation.tolerance,
        passed: toleranceCheck.passed,
        difference: toleranceCheck.difference,
        description: validation.description
      };
    } catch (error) {
      return {
        query: validation.query,
        expected_display: validation.expected_display,
        database_value: 'ERROR',
        dashboard_value: 'ERROR',
        tolerance: validation.tolerance,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        description: validation.description
      };
    }
  }

  /**
   * Set dashboard data for validation
   */
  setDashboardData(data: Record<string, any>): void {
    this.dashboardData = data;
  }

  /**
   * Run all validations from schema
   */
  async runValidation(schemaPath: string): Promise<{
    results: ValidationResult[];
    summary: {
      total: number;
      passed: number;
      failed: number;
      passRate: number;
    };
  }> {
    const schema = this.loadQASchema(schemaPath);
    const validations = schema.dashboard_audit.direct_query_qa.database_validation;
    
    const results: ValidationResult[] = [];
    
    for (const validation of validations) {
      const result = await this.validateQuery(validation);
      results.push(result);
    }

    const passed = results.filter(r => r.passed).length;
    const failed = results.length - passed;
    
    return {
      results,
      summary: {
        total: results.length,
        passed,
        failed,
        passRate: (passed / results.length) * 100
      }
    };
  }

  /**
   * Generate validation report
   */
  generateReport(
    results: ValidationResult[],
    summary: { total: number; passed: number; failed: number; passRate: number }
  ): string {
    const timestamp = new Date().toISOString();
    
    let report = `# Direct Query QA Validation Report\n`;
    report += `Generated: ${timestamp}\n`;
    report += `Total Validations: ${summary.total}\n`;
    report += `Passed: ${summary.passed}\n`;
    report += `Failed: ${summary.failed}\n`;
    report += `Pass Rate: ${summary.passRate.toFixed(1)}%\n\n`;

    if (summary.failed > 0) {
      report += `## ❌ Failed Validations\n\n`;
      results.filter(r => !r.passed).forEach((result, index) => {
        report += `### ${index + 1}. ${result.description}\n`;
        report += `- **Query**: \`${result.query}\`\n`;
        report += `- **Expected Display**: ${result.expected_display}\n`;
        report += `- **Database Value**: ${result.database_value}\n`;
        report += `- **Dashboard Value**: ${result.dashboard_value}\n`;
        report += `- **Tolerance**: ${result.tolerance}\n`;
        if (result.difference !== undefined) {
          report += `- **Difference**: ${result.difference}\n`;
        }
        if (result.error) {
          report += `- **Error**: ${result.error}\n`;
        }
        report += `\n`;
      });
    }

    if (summary.passed > 0) {
      report += `## ✅ Passed Validations\n\n`;
      results.filter(r => r.passed).forEach((result, index) => {
        report += `- ${result.description} ✓\n`;
      });
    }

    return report;
  }

  /**
   * Save validation report to file
   */
  saveReport(report: string, filePath: string): void {
    fs.writeFileSync(filePath, report, 'utf8');
  }
}

// Utility function for integration with dashboard components
export async function validateDashboardData(
  dashboardData: Record<string, any>,
  schemaPath: string = './qa/scout_dashboard_signal_audit.yaml'
): Promise<{
  isValid: boolean;
  results: ValidationResult[];
  summary: { total: number; passed: number; failed: number; passRate: number };
}> {
  const validator = new DirectQueryValidator();
  validator.setDashboardData(dashboardData);
  
  const { results, summary } = await validator.runValidation(schemaPath);
  
  return {
    isValid: summary.passRate === 100,
    results,
    summary
  };
}

// CLI execution interface
export async function runCLIValidation(): Promise<void> {
  const schemaPath = process.argv[2] || './qa/scout_dashboard_signal_audit.yaml';
  const reportPath = process.argv[3] || './qa/validation_report.md';
  
  console.log('🔍 Starting Direct Query QA Validation...');
  console.log(`Schema: ${schemaPath}`);
  
  const validator = new DirectQueryValidator();
  
  // Note: Dashboard data would need to be loaded from actual dashboard state
  // For CLI testing, you might need to provide mock data or extract from API
  validator.setDashboardData({
    dashboard_overview: {
      total_transactions: 15420,
      total_revenue: 2847592.50,
      avg_order_value: 184.65,
      unique_customers: 8932
    },
    regional_chart: {
      data: [
        { region_name: 'NCR', txn_count: 5234 },
        { region_name: 'CALABARZON', txn_count: 3892 }
      ]
    },
    brand_performance_chart: {
      data: [
        { brand_name: 'Coca-Cola', brand_revenue: 485672.30 },
        { brand_name: 'Nestle', brand_revenue: 398234.75 }
      ]
    },
    gender_silhouette_chart: {
      data: [
        { gender: 'Male', count: 4521 },
        { gender: 'Female', count: 4411 }
      ]
    },
    top_categories_chart: {
      data: [
        { category: 'Beverages', item_count: 3254 },
        { category: 'Snacks', item_count: 2987 }
      ]
    }
  });
  
  try {
    const { results, summary } = await validator.runValidation(schemaPath);
    
    console.log('\n📊 Validation Summary:');
    console.log(`Total: ${summary.total}`);
    console.log(`Passed: ${summary.passed} ✅`);
    console.log(`Failed: ${summary.failed} ❌`);
    console.log(`Pass Rate: ${summary.passRate.toFixed(1)}%`);
    
    if (summary.failed > 0) {
      console.log('\n❌ Failed Validations:');
      results.filter(r => !r.passed).forEach(result => {
        console.log(`- ${result.description}`);
        if (result.error) {
          console.log(`  Error: ${result.error}`);
        }
      });
    }
    
    const report = validator.generateReport(results, summary);
    validator.saveReport(report, reportPath);
    
    console.log(`\n📄 Report saved to: ${reportPath}`);
    
    // Exit with error code if validations failed
    process.exit(summary.failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

// Export for use in tests and dashboard components
export default DirectQueryValidator;