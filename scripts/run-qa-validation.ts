#!/usr/bin/env ts-node

// CLI Script for running Direct Query QA Validation
// Compatible with Pulser 4.0 and Caca validation framework
// Usage: npm run qa:validate [schema-path] [report-path]

import { DirectQueryValidator } from '../qa/directQueryValidator';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface CLIOptions {
  schemaPath: string;
  reportPath: string;
  outputFormat: 'markdown' | 'json' | 'yaml';
  dashboard: 'scout' | 'ces' | 'both';
  verbose: boolean;
  saveToDb: boolean;
}

class QAValidationCLI {
  private validator: DirectQueryValidator;
  private options: CLIOptions;

  constructor(options: CLIOptions) {
    this.options = options;
    this.validator = new DirectQueryValidator();
  }

  /**
   * Load dashboard data from database for validation
   */
  private async loadDashboardData(dashboard: string): Promise<Record<string, any>> {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    console.log(`📊 Loading ${dashboard} dashboard data...`);

    try {
      if (dashboard === 'scout' || dashboard === 'both') {
        // Load Scout dashboard data
        const { data: metricsData } = await supabase.rpc('validate_dashboard_metrics');
        const { data: regionalData } = await supabase.rpc('validate_regional_data');
        const { data: brandData } = await supabase.rpc('validate_brand_data');
        const { data: genderData } = await supabase.rpc('validate_gender_data');
        const { data: categoryData } = await supabase.rpc('validate_category_data');

        return {
          dashboard_overview: {
            total_transactions: metricsData?.find((m: any) => m.metric_name === 'total_transactions')?.database_value || 0,
            total_revenue: metricsData?.find((m: any) => m.metric_name === 'total_revenue')?.database_value || 0,
            avg_order_value: metricsData?.find((m: any) => m.metric_name === 'avg_order_value')?.database_value || 0,
            unique_customers: metricsData?.find((m: any) => m.metric_name === 'unique_customers')?.database_value || 0
          },
          regional_chart: {
            data: regionalData || []
          },
          brand_performance_chart: {
            data: brandData || []
          },
          gender_silhouette_chart: {
            data: genderData || []
          },
          top_categories_chart: {
            data: categoryData || []
          }
        };
      }

      // Add CES data loading here when needed
      return {};
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
      throw error;
    }
  }

  /**
   * Run validation for specified dashboard
   */
  private async runValidation(dashboard: string): Promise<any> {
    console.log(`🔍 Running QA validation for ${dashboard} dashboard...`);

    const dashboardData = await this.loadDashboardData(dashboard);
    this.validator.setDashboardData(dashboardData);

    const schemaPath = this.getSchemaPath(dashboard);
    const { results, summary } = await this.validator.runValidation(schemaPath);

    if (this.options.verbose) {
      console.log('\n📋 Validation Details:');
      results.forEach((result, index) => {
        const status = result.passed ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${result.description}`);
        if (!result.passed) {
          console.log(`   DB: ${result.database_value}, Dashboard: ${result.dashboard_value}`);
          if (result.error) console.log(`   Error: ${result.error}`);
        }
      });
    }

    return { results, summary, dashboard };
  }

  /**
   * Get schema path for dashboard type
   */
  private getSchemaPath(dashboard: string): string {
    if (this.options.schemaPath) return this.options.schemaPath;
    
    switch (dashboard) {
      case 'scout':
        return './qa/scout_dashboard_signal_audit.yaml';
      case 'ces':
        return './qa/ces_dashboard_audit.yaml';
      default:
        return './qa/scout_dashboard_signal_audit.yaml';
    }
  }

  /**
   * Generate report in specified format
   */
  private generateReport(validationResults: any[], format: string): string {
    const timestamp = new Date().toISOString();
    const totalValidations = validationResults.reduce((sum, r) => sum + r.summary.total, 0);
    const totalPassed = validationResults.reduce((sum, r) => sum + r.summary.passed, 0);
    const totalFailed = validationResults.reduce((sum, r) => sum + r.summary.failed, 0);
    const overallPassRate = totalValidations > 0 ? (totalPassed / totalValidations) * 100 : 0;

    switch (format) {
      case 'json':
        return JSON.stringify({
          timestamp,
          summary: {
            total: totalValidations,
            passed: totalPassed,
            failed: totalFailed,
            passRate: overallPassRate
          },
          dashboards: validationResults
        }, null, 2);

      case 'yaml':
        // Basic YAML format (would need yaml library for proper formatting)
        return `timestamp: ${timestamp}
summary:
  total: ${totalValidations}
  passed: ${totalPassed}
  failed: ${totalFailed}
  passRate: ${overallPassRate.toFixed(1)}%
dashboards:
${validationResults.map(r => `  - ${r.dashboard}: ${r.summary.passRate.toFixed(1)}% (${r.summary.passed}/${r.summary.total})`).join('\n')}`;

      default: // markdown
        let report = `# QA Validation Report\n\n`;
        report += `**Generated:** ${timestamp}\n\n`;
        report += `## Overall Summary\n\n`;
        report += `- **Total Validations:** ${totalValidations}\n`;
        report += `- **Passed:** ${totalPassed} ✅\n`;
        report += `- **Failed:** ${totalFailed} ❌\n`;
        report += `- **Pass Rate:** ${overallPassRate.toFixed(1)}%\n\n`;

        validationResults.forEach(result => {
          report += `## ${result.dashboard.toUpperCase()} Dashboard\n\n`;
          report += `- **Pass Rate:** ${result.summary.passRate.toFixed(1)}%\n`;
          report += `- **Passed:** ${result.summary.passed}/${result.summary.total}\n\n`;

          const failedResults = result.results.filter((r: any) => !r.passed);
          if (failedResults.length > 0) {
            report += `### ❌ Failed Validations\n\n`;
            failedResults.forEach((failed: any, index: number) => {
              report += `${index + 1}. **${failed.description}**\n`;
              report += `   - Database: ${failed.database_value}\n`;
              report += `   - Dashboard: ${failed.dashboard_value}\n`;
              if (failed.difference !== undefined) {
                report += `   - Difference: ${failed.difference}\n`;
              }
              if (failed.error) {
                report += `   - Error: ${failed.error}\n`;
              }
              report += `\n`;
            });
          }
        });

        return report;
    }
  }

  /**
   * Save validation results to database
   */
  private async saveToDatabase(validationResults: any[]): Promise<void> {
    if (!this.options.saveToDb) return;

    console.log('💾 Saving validation results to database...');

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    for (const result of validationResults) {
      try {
        await supabase.rpc('log_qa_validation', {
          validation_type: `${result.dashboard}_dashboard`,
          schema_version: '1.1.1',
          total_validations: result.summary.total,
          passed_validations: result.summary.passed,
          failed_validations: result.summary.failed,
          validation_details: {
            results: result.results,
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        console.warn(`⚠️ Failed to save ${result.dashboard} validation to database:`, error);
      }
    }
  }

  /**
   * Main execution method
   */
  async run(): Promise<void> {
    try {
      console.log('🚀 Starting QA Validation Process...');
      console.log(`Dashboard: ${this.options.dashboard}`);
      console.log(`Schema: ${this.options.schemaPath}`);
      console.log(`Output: ${this.options.reportPath}`);

      const validationResults = [];

      if (this.options.dashboard === 'both') {
        validationResults.push(await this.runValidation('scout'));
        validationResults.push(await this.runValidation('ces'));
      } else {
        validationResults.push(await this.runValidation(this.options.dashboard));
      }

      // Generate and save report
      const report = this.generateReport(validationResults, this.options.outputFormat);
      fs.writeFileSync(this.options.reportPath, report, 'utf8');
      console.log(`📄 Report saved to: ${this.options.reportPath}`);

      // Save to database if requested
      await this.saveToDatabase(validationResults);

      // Print summary
      const totalFailed = validationResults.reduce((sum, r) => sum + r.summary.failed, 0);
      const overallPassRate = validationResults.reduce((sum, r) => sum + r.summary.passRate, 0) / validationResults.length;

      console.log('\n📊 Final Summary:');
      validationResults.forEach(result => {
        const status = result.summary.passRate === 100 ? '✅' : result.summary.passRate >= 80 ? '⚠️' : '❌';
        console.log(`${status} ${result.dashboard.toUpperCase()}: ${result.summary.passRate.toFixed(1)}% (${result.summary.passed}/${result.summary.total})`);
      });

      console.log(`\n🎯 Overall Pass Rate: ${overallPassRate.toFixed(1)}%`);

      // Exit with appropriate code
      process.exit(totalFailed > 0 ? 1 : 0);

    } catch (error) {
      console.error('❌ QA Validation failed:', error);
      process.exit(1);
    }
  }
}

// Parse command line arguments
function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  
  return {
    schemaPath: args[0] || '',
    reportPath: args[1] || `./qa/validation_report_${Date.now()}.md`,
    outputFormat: (args[2] as any) || 'markdown',
    dashboard: (args[3] as any) || 'scout',
    verbose: args.includes('--verbose') || args.includes('-v'),
    saveToDb: args.includes('--save-db')
  };
}

// Main execution
if (require.main === module) {
  const options = parseArgs();
  const cli = new QAValidationCLI(options);
  cli.run();
}

export { QAValidationCLI };