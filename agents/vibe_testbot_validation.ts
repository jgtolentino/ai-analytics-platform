// VibeTestBot Validation Engine v1.1
// Headless QA against Placeholder Gaps, Broken Filter Wiring, Null Visuals
// GPT-based Layout Compliance for Scout Analytics v3.3.0

import { Page, Browser, chromium, ElementHandle } from 'playwright';
import { AzureOpenAI } from '@azure/openai';

// =============================================
// Type Definitions
// =============================================

interface ValidationResult {
  component: string;
  tenant?: string;
  test_type: 'placeholder' | 'filter_wiring' | 'null_visuals' | 'layout_compliance' | 'data_binding';
  status: 'pass' | 'fail' | 'warning';
  issue?: string;
  detected_by: 'vibeTestBot' | 'automated_scan' | 'gpt_analysis';
  evidence?: {
    screenshot?: string;
    element_selector?: string;
    expected_value?: any;
    actual_value?: any;
    error_message?: string;
  };
  severity: 'critical' | 'high' | 'medium' | 'low';
  recommendations: string[];
  timestamp: Date;
}

interface ComponentSpec {
  name: string;
  selector: string;
  required_elements: string[];
  data_attributes: string[];
  filter_dependencies: string[];
  fallback_states: string[];
}

interface LayoutCompliance {
  responsive_breakpoints: boolean;
  color_consistency: boolean;
  typography_hierarchy: boolean;
  spacing_system: boolean;
  brand_guidelines: boolean;
  accessibility_score: number;
}

// =============================================
// VibeTestBot Core Validation Engine
// =============================================

export class VibeTestBotValidator {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private azureOpenAI: AzureOpenAI;
  private validationResults: ValidationResult[] = [];

  constructor() {
    this.azureOpenAI = new AzureOpenAI({
      endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      apiVersion: "2024-02-15-preview",
      deployment: "gpt-4-turbo"
    });
  }

  // =============================================
  // Browser Management
  // =============================================

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    
    console.log('[VibeTestBot] Headless browser initialized');
  }

  async dispose(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
    console.log('[VibeTestBot] Browser disposed');
  }

  // =============================================
  // Component Specifications
  // =============================================

  private getComponentSpecs(): ComponentSpec[] {
    return [
      {
        name: 'AdvancedInsightsPanel',
        selector: '[data-testid="advanced-insights-panel"]',
        required_elements: [
          '.brand-selector select',
          '.timeframe-selector select', 
          '.tab-navigation button',
          '.brand-profile-section',
          '.generational-analysis'
        ],
        data_attributes: ['data-brand', 'data-timeframe', 'data-active-tab'],
        filter_dependencies: ['brand-selector', 'timeframe-selector'],
        fallback_states: ['loading-state', 'error-boundary', 'no-data-state']
      },
      {
        name: 'BrandDictionaryDisplay',
        selector: '[data-testid="brand-dictionary"]',
        required_elements: [
          '.color-psychology',
          '.brand-affinity-score',
          '.emotional-triggers',
          '.generational-chart'
        ],
        data_attributes: ['data-brand-id', 'data-color-primary'],
        filter_dependencies: ['brand-selector'],
        fallback_states: ['brand-not-found', 'loading-skeleton']
      },
      {
        name: 'EmotionalAnalysisPanel',
        selector: '[data-testid="emotional-analysis"]',
        required_elements: [
          '.engagement-score',
          '.emotional-insights-grid',
          '.correlation-display'
        ],
        data_attributes: ['data-engagement-score', 'data-insights-count'],
        filter_dependencies: ['brand-selector', 'timeframe-selector'],
        fallback_states: ['insufficient-data', 'analysis-pending']
      },
      {
        name: 'BundlingOpportunitiesEngine',
        selector: '[data-testid="bundling-opportunities"]',
        required_elements: [
          '.opportunities-list',
          '.roi-analysis',
          '.implementation-details'
        ],
        data_attributes: ['data-opportunities-count', 'data-roi-average'],
        filter_dependencies: ['brand-selector', 'demographic-filter'],
        fallback_states: ['no-opportunities', 'calculating']
      },
      {
        name: 'KPICards',
        selector: '[data-testid="kpi-cards"]',
        required_elements: [
          '.kpi-card',
          '.kpi-value',
          '.kpi-trend',
          '.kpi-comparison'
        ],
        data_attributes: ['data-kpi-type', 'data-value', 'data-trend'],
        filter_dependencies: ['date-range', 'region-filter'],
        fallback_states: ['data-loading', 'error-state', 'fallback-values']
      }
    ];
  }

  // =============================================
  // Placeholder Gap Detection
  // =============================================

  async validatePlaceholders(url: string): Promise<ValidationResult[]> {
    if (!this.page) throw new Error('Browser not initialized');
    
    const results: ValidationResult[] = [];
    
    try {
      await this.page.goto(url, { waitUntil: 'networkidle' });
      await this.page.waitForTimeout(2000); // Allow React hydration
      
      // Check for common placeholder patterns
      const placeholderSelectors = [
        'text="Loading..."',
        'text="No data available"',
        'text="Coming soon"',
        'text="TODO"',
        'text="Placeholder"',
        'text="Lorem ipsum"',
        '[placeholder*="Enter"]',
        '.skeleton-loading',
        '.placeholder-text'
      ];

      for (const selector of placeholderSelectors) {
        const elements = await this.page.$$(selector);
        
        for (const element of elements) {
          const componentName = await this.getComponentName(element);
          const textContent = await element.textContent();
          
          results.push({
            component: componentName,
            test_type: 'placeholder',
            status: 'fail',
            issue: `Placeholder content detected: "${textContent}"`,
            detected_by: 'vibeTestBot',
            evidence: {
              element_selector: selector,
              actual_value: textContent
            },
            severity: 'high',
            recommendations: [
              'Replace placeholder with actual content',
              'Implement proper loading states',
              'Add fallback data for development'
            ],
            timestamp: new Date()
          });
        }
      }

      // Check for empty data containers
      const dataContainers = await this.page.$$('[data-testid*="chart"], [data-testid*="table"], [data-testid*="grid"]');
      
      for (const container of dataContainers) {
        const isEmpty = await container.evaluate(el => {
          return el.children.length === 0 || 
                 el.textContent?.trim() === '' ||
                 el.querySelector('.empty-state, .no-data');
        });

        if (isEmpty) {
          const componentName = await this.getComponentName(container);
          const testId = await container.getAttribute('data-testid');
          
          results.push({
            component: componentName,
            test_type: 'placeholder',
            status: 'warning',
            issue: `Empty data container detected`,
            detected_by: 'vibeTestBot',
            evidence: {
              element_selector: `[data-testid="${testId}"]`,
              actual_value: 'empty'
            },
            severity: 'medium',
            recommendations: [
              'Implement skeleton loading states',
              'Add proper empty state messaging',
              'Verify data pipeline is working'
            ],
            timestamp: new Date()
          });
        }
      }

    } catch (error) {
      results.push({
        component: 'PlaceholderValidation',
        test_type: 'placeholder',
        status: 'fail',
        issue: `Validation failed: ${error}`,
        detected_by: 'vibeTestBot',
        severity: 'critical',
        recommendations: ['Check page accessibility', 'Verify URL is correct'],
        timestamp: new Date()
      });
    }

    return results;
  }

  // =============================================
  // Filter Wiring Validation
  // =============================================

  async validateFilterWiring(url: string): Promise<ValidationResult[]> {
    if (!this.page) throw new Error('Browser not initialized');
    
    const results: ValidationResult[] = [];
    
    try {
      await this.page.goto(url, { waitUntil: 'networkidle' });
      
      const componentSpecs = this.getComponentSpecs();
      
      for (const spec of componentSpecs) {
        const component = await this.page.$(spec.selector);
        
        if (!component) {
          results.push({
            component: spec.name,
            test_type: 'filter_wiring',
            status: 'fail',
            issue: `Component not found: ${spec.selector}`,
            detected_by: 'vibeTestBot',
            severity: 'critical',
            recommendations: ['Verify component is properly mounted', 'Check React component export'],
            timestamp: new Date()
          });
          continue;
        }

        // Test filter dependencies
        for (const filterDep of spec.filter_dependencies) {
          const filterElement = await this.page.$(`[data-testid="${filterDep}"], .${filterDep}`);
          
          if (!filterElement) {
            results.push({
              component: spec.name,
              test_type: 'filter_wiring',
              status: 'fail',
              issue: `Filter dependency missing: ${filterDep}`,
              detected_by: 'vibeTestBot',
              evidence: {
                element_selector: spec.selector,
                expected_value: filterDep
              },
              severity: 'high',
              recommendations: [
                `Implement ${filterDep} filter component`,
                'Verify filter wiring in parent component',
                'Check filter state management'
              ],
              timestamp: new Date()
            });
            continue;
          }

          // Test filter interaction
          const initialState = await this.captureComponentState(component);
          
          // Trigger filter change
          if (await filterElement.isVisible()) {
            await filterElement.click();
            await this.page.waitForTimeout(500);
            
            // For select elements, change the value
            if (await filterElement.evaluate(el => el.tagName === 'SELECT')) {
              const options = await filterElement.$$('option');
              if (options.length > 1) {
                await filterElement.selectOption({ index: 1 });
                await this.page.waitForTimeout(1000);
              }
            }
            
            const updatedState = await this.captureComponentState(component);
            
            // Verify state changed
            if (JSON.stringify(initialState) === JSON.stringify(updatedState)) {
              results.push({
                component: spec.name,
                test_type: 'filter_wiring',
                status: 'fail',
                issue: `Filter ${filterDep} not affecting component state`,
                detected_by: 'vibeTestBot',
                evidence: {
                  element_selector: spec.selector,
                  expected_value: 'state_change',
                  actual_value: 'no_change'
                },
                severity: 'high',
                recommendations: [
                  'Check filter event handlers',
                  'Verify state management integration',
                  'Test filter prop drilling'
                ],
                timestamp: new Date()
              });
            }
          }
        }

        // Test required data attributes
        for (const attr of spec.data_attributes) {
          const attrValue = await component.getAttribute(attr);
          
          if (!attrValue || attrValue === '' || attrValue === 'undefined') {
            results.push({
              component: spec.name,
              test_type: 'filter_wiring',
              status: 'warning',
              issue: `Missing or empty data attribute: ${attr}`,
              detected_by: 'vibeTestBot',
              evidence: {
                element_selector: spec.selector,
                expected_value: attr,
                actual_value: attrValue
              },
              severity: 'medium',
              recommendations: [
                `Set proper ${attr} attribute`,
                'Verify data binding from props',
                'Check component state management'
              ],
              timestamp: new Date()
            });
          }
        }
      }

    } catch (error) {
      results.push({
        component: 'FilterWiringValidation',
        test_type: 'filter_wiring',
        status: 'fail',
        issue: `Validation failed: ${error}`,
        detected_by: 'vibeTestBot',
        severity: 'critical',
        recommendations: ['Check page load stability', 'Verify component mounting'],
        timestamp: new Date()
      });
    }

    return results;
  }

  // =============================================
  // Null Visual Detection
  // =============================================

  async validateNullVisuals(url: string): Promise<ValidationResult[]> {
    if (!this.page) throw new Error('Browser not initialized');
    
    const results: ValidationResult[] = [];
    
    try {
      await this.page.goto(url, { waitUntil: 'networkidle' });
      
      // Check for charts and visualizations
      const visualSelectors = [
        'canvas',
        'svg',
        '[data-testid*="chart"]',
        '[data-testid*="graph"]',
        '.recharts-wrapper',
        '.chart-container',
        '.visualization'
      ];

      for (const selector of visualSelectors) {
        const visuals = await this.page.$$(selector);
        
        for (const visual of visuals) {
          const componentName = await this.getComponentName(visual);
          
          // Check if visual is empty or has minimal content
          const isEmpty = await visual.evaluate(el => {
            if (el.tagName === 'CANVAS') {
              const canvas = el as HTMLCanvasElement;
              const ctx = canvas.getContext('2d');
              if (!ctx) return true;
              
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              return imageData.data.every(pixel => pixel === 0);
            }
            
            if (el.tagName === 'SVG') {
              return el.children.length === 0 || 
                     el.querySelector('text')?.textContent === 'No data';
            }
            
            return el.children.length === 0;
          });

          if (isEmpty) {
            results.push({
              component: componentName,
              test_type: 'null_visuals',
              status: 'fail',
              issue: 'Empty or null visualization detected',
              detected_by: 'vibeTestBot',
              evidence: {
                element_selector: selector,
                actual_value: 'empty_visual'
              },
              severity: 'high',
              recommendations: [
                'Verify data is being passed to visualization',
                'Check chart library configuration',
                'Implement fallback for empty data states'
              ],
              timestamp: new Date()
            });
          }

          // Check for error states in visuals
          const hasError = await visual.evaluate(el => {
            return el.textContent?.includes('Error') ||
                   el.textContent?.includes('Failed to load') ||
                   el.querySelector('.error, .chart-error');
          });

          if (hasError) {
            const errorText = await visual.textContent();
            results.push({
              component: componentName,
              test_type: 'null_visuals',
              status: 'fail',
              issue: 'Visualization error state detected',
              detected_by: 'vibeTestBot',
              evidence: {
                element_selector: selector,
                error_message: errorText
              },
              severity: 'critical',
              recommendations: [
                'Check data format compatibility',
                'Verify chart library version',
                'Add proper error boundaries'
              ],
              timestamp: new Date()
            });
          }
        }
      }

      // Check for images that failed to load
      const images = await this.page.$$('img');
      for (const img of images) {
        const src = await img.getAttribute('src');
        const isLoaded = await img.evaluate(el => el.complete && el.naturalHeight !== 0);
        
        if (!isLoaded && src) {
          const componentName = await this.getComponentName(img);
          results.push({
            component: componentName,
            test_type: 'null_visuals',
            status: 'warning',
            issue: 'Image failed to load',
            detected_by: 'vibeTestBot',
            evidence: {
              element_selector: 'img',
              actual_value: src
            },
            severity: 'medium',
            recommendations: [
              'Verify image URL is accessible',
              'Add alt text for accessibility',
              'Implement image loading fallbacks'
            ],
            timestamp: new Date()
          });
        }
      }

    } catch (error) {
      results.push({
        component: 'NullVisualsValidation',
        test_type: 'null_visuals',
        status: 'fail',
        issue: `Validation failed: ${error}`,
        detected_by: 'vibeTestBot',
        severity: 'critical',
        recommendations: ['Check page rendering stability'],
        timestamp: new Date()
      });
    }

    return results;
  }

  // =============================================
  // GPT-Based Layout Compliance
  // =============================================

  async validateLayoutCompliance(url: string): Promise<ValidationResult[]> {
    if (!this.page) throw new Error('Browser not initialized');
    
    const results: ValidationResult[] = [];
    
    try {
      await this.page.goto(url, { waitUntil: 'networkidle' });
      
      // Capture screenshot for visual analysis
      const screenshot = await this.page.screenshot({ 
        fullPage: true, 
        type: 'png' 
      });
      const screenshotBase64 = screenshot.toString('base64');

      // Extract CSS styles and layout information
      const layoutData = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('[data-testid], .component, .card, .panel');
        const layout: any[] = [];
        
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const styles = window.getComputedStyle(el);
          
          layout.push({
            tagName: el.tagName,
            className: el.className,
            testId: el.getAttribute('data-testid'),
            position: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height
            },
            styles: {
              backgroundColor: styles.backgroundColor,
              color: styles.color,
              fontSize: styles.fontSize,
              fontFamily: styles.fontFamily,
              margin: styles.margin,
              padding: styles.padding,
              display: styles.display,
              flexDirection: styles.flexDirection
            }
          });
        });
        
        return layout;
      });

      // AI-powered layout analysis
      const analysisPrompt = `
Analyze this Scout Analytics dashboard layout for compliance issues:

Layout Data: ${JSON.stringify(layoutData.slice(0, 10), null, 2)}

Check for:
1. Color consistency with brand guidelines (blues, whites, grays)
2. Typography hierarchy (font sizes should be consistent)
3. Spacing system (margins and padding should follow 4px/8px grid)
4. Component alignment and layout structure
5. Accessibility concerns (color contrast, font sizes)

Dashboard Type: Brand Intelligence Analytics
Brand Colors: Primary blue (#3b82f6), Secondary grays, Accent colors for data
Expected Layout: Header, Navigation, Content Grid, Sidebar panels

Return JSON assessment:
{
  "compliance_score": 0.0-1.0,
  "issues": [
    {
      "type": "color_consistency|typography|spacing|alignment|accessibility",
      "severity": "critical|high|medium|low",
      "description": "Issue description",
      "element": "element identifier",
      "recommendation": "fix suggestion"
    }
  ],
  "positive_aspects": ["what's working well"],
  "overall_assessment": "summary"
}
`;

      const response = await this.azureOpenAI.getChatCompletions(
        "gpt-4-turbo",
        [
          { 
            role: "system", 
            content: "You are a UI/UX compliance analyst. Analyze layouts for design system adherence. Return only valid JSON." 
          },
          { role: "user", content: analysisPrompt }
        ],
        {
          temperature: 0.2,
          maxTokens: 1500
        }
      );

      const analysisResponse = response.choices[0]?.message?.content;
      if (analysisResponse) {
        try {
          const analysis = JSON.parse(analysisResponse);
          
          // Convert GPT analysis to validation results
          analysis.issues?.forEach((issue: any) => {
            results.push({
              component: issue.element || 'Layout',
              test_type: 'layout_compliance',
              status: issue.severity === 'critical' || issue.severity === 'high' ? 'fail' : 'warning',
              issue: issue.description,
              detected_by: 'gpt_analysis',
              evidence: {
                screenshot: screenshotBase64.substring(0, 100) + '...' // Truncated for storage
              },
              severity: issue.severity,
              recommendations: [issue.recommendation],
              timestamp: new Date()
            });
          });

          // Add overall compliance result
          results.push({
            component: 'OverallLayout',
            test_type: 'layout_compliance',
            status: analysis.compliance_score > 0.8 ? 'pass' : analysis.compliance_score > 0.6 ? 'warning' : 'fail',
            issue: analysis.overall_assessment,
            detected_by: 'gpt_analysis',
            evidence: {
              actual_value: analysis.compliance_score
            },
            severity: analysis.compliance_score > 0.8 ? 'low' : analysis.compliance_score > 0.6 ? 'medium' : 'high',
            recommendations: analysis.positive_aspects || [],
            timestamp: new Date()
          });

        } catch (parseError) {
          results.push({
            component: 'LayoutCompliance',
            test_type: 'layout_compliance',
            status: 'fail',
            issue: 'GPT analysis parsing failed',
            detected_by: 'vibeTestBot',
            severity: 'medium',
            recommendations: ['Review GPT response format'],
            timestamp: new Date()
          });
        }
      }

    } catch (error) {
      results.push({
        component: 'LayoutComplianceValidation',
        test_type: 'layout_compliance',
        status: 'fail',
        issue: `Validation failed: ${error}`,
        detected_by: 'vibeTestBot',
        severity: 'critical',
        recommendations: ['Check GPT integration', 'Verify screenshot capability'],
        timestamp: new Date()
      });
    }

    return results;
  }

  // =============================================
  // Comprehensive Validation Runner
  // =============================================

  async runFullValidation(url: string, options?: {
    skipPlaceholders?: boolean;
    skipFilterWiring?: boolean;
    skipNullVisuals?: boolean;
    skipLayoutCompliance?: boolean;
  }): Promise<{
    summary: {
      total_tests: number;
      passed: number;
      failed: number;
      warnings: number;
      critical_issues: number;
      high_issues: number;
      medium_issues: number;
      low_issues: number;
    };
    results: ValidationResult[];
  }> {
    
    this.validationResults = [];
    
    console.log('[VibeTestBot] Starting comprehensive validation...');
    
    if (!options?.skipPlaceholders) {
      const placeholderResults = await this.validatePlaceholders(url);
      this.validationResults.push(...placeholderResults);
      console.log(`[VibeTestBot] Placeholder validation: ${placeholderResults.length} issues found`);
    }

    if (!options?.skipFilterWiring) {
      const filterResults = await this.validateFilterWiring(url);
      this.validationResults.push(...filterResults);
      console.log(`[VibeTestBot] Filter wiring validation: ${filterResults.length} issues found`);
    }

    if (!options?.skipNullVisuals) {
      const visualResults = await this.validateNullVisuals(url);
      this.validationResults.push(...visualResults);
      console.log(`[VibeTestBot] Null visuals validation: ${visualResults.length} issues found`);
    }

    if (!options?.skipLayoutCompliance) {
      const layoutResults = await this.validateLayoutCompliance(url);
      this.validationResults.push(...layoutResults);
      console.log(`[VibeTestBot] Layout compliance validation: ${layoutResults.length} issues found`);
    }

    // Generate summary
    const summary = {
      total_tests: this.validationResults.length,
      passed: this.validationResults.filter(r => r.status === 'pass').length,
      failed: this.validationResults.filter(r => r.status === 'fail').length,
      warnings: this.validationResults.filter(r => r.status === 'warning').length,
      critical_issues: this.validationResults.filter(r => r.severity === 'critical').length,
      high_issues: this.validationResults.filter(r => r.severity === 'high').length,
      medium_issues: this.validationResults.filter(r => r.severity === 'medium').length,
      low_issues: this.validationResults.filter(r => r.severity === 'low').length
    };

    console.log('[VibeTestBot] Validation complete:', summary);
    
    return {
      summary,
      results: this.validationResults
    };
  }

  // =============================================
  // Helper Methods
  // =============================================

  private async getComponentName(element: ElementHandle): Promise<string> {
    const testId = await element.getAttribute('data-testid');
    if (testId) return testId;
    
    const className = await element.getAttribute('class');
    if (className) {
      const componentClass = className.split(' ').find(cls => 
        cls.includes('Component') || cls.includes('Panel') || cls.includes('Card')
      );
      if (componentClass) return componentClass;
    }
    
    const tagName = await element.evaluate(el => el.tagName.toLowerCase());
    return `${tagName}_element`;
  }

  private async captureComponentState(element: ElementHandle): Promise<any> {
    return await element.evaluate(el => {
      const state: any = {};
      
      // Capture data attributes
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
          state[attr.name] = attr.value;
        }
      });
      
      // Capture text content
      state.textContent = el.textContent?.trim();
      
      // Capture child count
      state.childCount = el.children.length;
      
      // Capture visible state
      state.isVisible = el.offsetParent !== null;
      
      return state;
    });
  }
}

// =============================================
// Factory Function
// =============================================

export async function runVibeTestBotValidation(
  url: string, 
  options?: Parameters<VibeTestBotValidator['runFullValidation']>[1]
): Promise<ReturnType<VibeTestBotValidator['runFullValidation']>> {
  
  const validator = new VibeTestBotValidator();
  
  try {
    await validator.initialize();
    return await validator.runFullValidation(url, options);
  } finally {
    await validator.dispose();
  }
}

// =============================================
// CLI Integration
// =============================================

export const VibeTestBotQueries = {
  quickScan: async (url: string) => {
    return await runVibeTestBotValidation(url, {
      skipLayoutCompliance: true // Faster scan
    });
  },
  
  fullAudit: async (url: string) => {
    return await runVibeTestBotValidation(url);
  },
  
  placeholderOnly: async (url: string) => {
    return await runVibeTestBotValidation(url, {
      skipFilterWiring: true,
      skipNullVisuals: true,
      skipLayoutCompliance: true
    });
  }
};

export type { ValidationResult, ComponentSpec, LayoutCompliance };