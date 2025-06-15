#!/usr/bin/env node
// scripts/qa-scout-v3-preview.cjs
// Comprehensive QA validation for Scout Analytics Dashboard v3.1-preview
// Tests preview deployment with enhanced SKU charts

const https = require('https');
const { execSync } = require('child_process');

// Environment-specific URLs
const ENVIRONMENTS = {
  preview: 'https://scout-mvp-git-preview-ai-analytics-platform.vercel.app',
  production: 'https://scout-mvp.vercel.app'
};

const ENV = process.argv.includes('--env=preview') ? 'preview' : 'production';
const SCOUT_URL = ENVIRONMENTS[ENV];
const TEST_TIMEOUT = 30000;

console.log('🔍 Scout Analytics QA Validation v3.1-preview');
console.log('==============================================');
console.log(`Environment: ${ENV.toUpperCase()}`);
console.log(`Target: ${SCOUT_URL}`);
console.log(`Started: ${new Date().toISOString()}\n`);

// QA Test Results
const results = {
  deployment: { passed: 0, failed: 0, tests: [] },
  pages: { passed: 0, failed: 0, tests: [] },
  components: { passed: 0, failed: 0, tests: [] },
  charts: { passed: 0, failed: 0, tests: [] },
  performance: { passed: 0, failed: 0, tests: [] },
  accessibility: { passed: 0, failed: 0, tests: [] }
};

// Utility function to make HTTP requests
function httpRequest(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout: TEST_TIMEOUT }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          body: data,
          size: Buffer.byteLength(data, 'utf8')
        });
      });
    });
    
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
    
    request.on('error', reject);
  });
}

// Async test function wrapper
async function asyncTest(category, name, testFn) {
  try {
    const result = await testFn();
    if (result === true || (result && result.success !== false)) {
      results[category].passed++;
      results[category].tests.push({ name, status: '✅', details: result.details || 'Passed' });
      console.log(`✅ ${name}`);
    } else {
      results[category].failed++;
      results[category].tests.push({ name, status: '❌', details: result.error || 'Failed' });
      console.log(`❌ ${name}: ${result.error || 'Failed'}`);
    }
  } catch (error) {
    results[category].failed++;
    results[category].tests.push({ name, status: '❌', details: error.message });
    console.log(`❌ ${name}: ${error.message}`);
  }
}

// Main execution function
async function runQA() {

// 1. Deployment Tests
console.log('🚀 1. Deployment Validation');
console.log('---------------------------');

await asyncTest('deployment', 'Preview site accessibility', async () => {
  const response = await httpRequest(SCOUT_URL);
  return {
    success: response.statusCode === 200,
    details: `Status: ${response.statusCode}, Size: ${(response.size / 1024).toFixed(1)}KB`,
    error: response.statusCode !== 200 ? `HTTP ${response.statusCode}` : null
  };
});

await asyncTest('deployment', 'Preview environment detection', async () => {
  const response = await httpRequest(SCOUT_URL);
  const hasPreviewMarkers = response.body.includes('3.1.0-preview') || 
                           response.body.includes('preview') ||
                           SCOUT_URL.includes('preview');
  return {
    success: hasPreviewMarkers,
    details: hasPreviewMarkers ? 'Preview environment detected' : 'No preview markers found',
    error: !hasPreviewMarkers ? 'Environment detection failed' : null
  };
});

await asyncTest('deployment', 'Security headers', async () => {
  const response = await httpRequest(SCOUT_URL);
  const hasSecurityHeaders = response.headers['x-frame-options'] || response.headers['x-content-type-options'];
  return {
    success: !!hasSecurityHeaders,
    details: hasSecurityHeaders ? 'Security headers present' : 'No security headers found',
    error: !hasSecurityHeaders ? 'Missing security headers' : null
  };
});

// 2. Page Route Tests
console.log('\n📄 2. Page Route Validation');
console.log('----------------------------');

const pages = [
  { path: '/', name: 'Overview/Dashboard' },
  { path: '/trends', name: 'Transaction Trends' },
  { path: '/products', name: 'Product Mix & SKU (Enhanced)' },
  { path: '/ai-assist', name: 'AI Assistant' }
];

for (const page of pages) {
  await asyncTest('pages', `${page.name} page`, async () => {
    const response = await httpRequest(`${SCOUT_URL}${page.path}`);
    return {
      success: response.statusCode === 200,
      details: `Status: ${response.statusCode}`,
      error: response.statusCode !== 200 ? `HTTP ${response.statusCode}` : null
    };
  });
}

// 3. Component Tests (Content Analysis)
console.log('\n🧩 3. Component Validation');
console.log('--------------------------');

await asyncTest('components', 'Scout Analytics branding', async () => {
  const response = await httpRequest(SCOUT_URL);
  const hasScoutBranding = response.body.includes('Scout Analytics');
  return {
    success: hasScoutBranding,
    details: hasScoutBranding ? 'Scout Analytics title found' : 'Scout Analytics title missing',
    error: !hasScoutBranding ? 'Missing Scout Analytics branding' : null
  };
});

await asyncTest('components', 'Enhanced navigation elements', async () => {
  const response = await httpRequest(SCOUT_URL);
  const hasNav = response.body.includes('Overview') && 
                 response.body.includes('Trends') && 
                 response.body.includes('Products') &&
                 response.body.includes('RetailBot');
  return {
    success: hasNav,
    details: hasNav ? 'Enhanced navigation elements found' : 'Navigation elements missing',
    error: !hasNav ? 'Missing enhanced navigation elements' : null
  };
});

await asyncTest('components', 'AI Assistant references', async () => {
  const response = await httpRequest(SCOUT_URL);
  const hasAI = response.body.includes('RetailBot') || 
               response.body.includes('AI Assistant') ||
               response.body.includes('Vibe TestBot');
  return {
    success: hasAI,
    details: hasAI ? 'AI Assistant components found' : 'AI Assistant components missing',
    error: !hasAI ? 'Missing AI Assistant references' : null
  };
});

// 4. Enhanced Chart Tests (v3.1 Features)
console.log('\n📊 4. Enhanced Chart Validation (v3.1)');
console.log('---------------------------------------');

await asyncTest('charts', 'Products page enhanced content', async () => {
  const response = await httpRequest(`${SCOUT_URL}/products`);
  const hasEnhancedContent = response.body.includes('Product Mix') && 
                            response.body.includes('SKU') &&
                            response.body.includes('Substitution');
  return {
    success: hasEnhancedContent,
    details: hasEnhancedContent ? 'Enhanced product analysis found' : 'Enhanced content missing',
    error: !hasEnhancedContent ? 'Missing enhanced product features' : null
  };
});

await asyncTest('charts', 'SKU combination references', async () => {
  const response = await httpRequest(`${SCOUT_URL}/products`);
  const hasSKUContent = response.body.includes('Frequently Bought Together') ||
                       response.body.includes('Network') ||
                       response.body.includes('combination');
  return {
    success: hasSKUContent,
    details: hasSKUContent ? 'SKU combination content found' : 'SKU content missing',
    error: !hasSKUContent ? 'Missing SKU combination features' : null
  };
});

await asyncTest('charts', 'Substitution analysis references', async () => {
  const response = await httpRequest(`${SCOUT_URL}/products`);
  const hasSubstitutionContent = response.body.includes('Substitution') ||
                                response.body.includes('Sankey') ||
                                response.body.includes('switching');
  return {
    success: hasSubstitutionContent,
    details: hasSubstitutionContent ? 'Substitution analysis found' : 'Substitution content missing',
    error: !hasSubstitutionContent ? 'Missing substitution analysis features' : null
  };
});

await asyncTest('charts', 'Interactive trends charts', async () => {
  const response = await httpRequest(`${SCOUT_URL}/trends`);
  const hasCharts = response.body.includes('Transaction') && 
                   response.body.includes('Heatmap') &&
                   response.body.includes('Revenue');
  return {
    success: hasCharts,
    details: hasCharts ? 'Interactive chart components found' : 'Chart components missing',
    error: !hasCharts ? 'Missing interactive chart components' : null
  };
});

await asyncTest('charts', 'Demographic visualization', async () => {
  const response = await httpRequest(SCOUT_URL);
  const hasDemographics = response.body.includes('29,060') || 
                         response.body.includes('Population') ||
                         response.body.includes('Age Distribution');
  return {
    success: hasDemographics,
    details: hasDemographics ? 'Demographic visualization found' : 'Demographic data missing',
    error: !hasDemographics ? 'Missing demographic visualization' : null
  };
});

// 5. Performance Tests (Enhanced for v3.1)
console.log('\n⚡ 5. Performance Validation');
console.log('----------------------------');

await asyncTest('performance', 'Page load size (enhanced)', async () => {
  const response = await httpRequest(SCOUT_URL);
  const sizeMB = response.size / (1024 * 1024);
  return {
    success: sizeMB < 2.5, // Slightly higher due to new charts
    details: `${sizeMB.toFixed(2)}MB`,
    error: sizeMB >= 2.5 ? 'Page size too large for enhanced version' : null
  };
});

await asyncTest('performance', 'Response time', async () => {
  const startTime = Date.now();
  await httpRequest(SCOUT_URL);
  const responseTime = Date.now() - startTime;
  return {
    success: responseTime < 3000, // Less than 3 seconds
    details: `${responseTime}ms`,
    error: responseTime >= 3000 ? 'Response time too slow' : null
  };
});

await asyncTest('performance', 'Products page load time', async () => {
  const startTime = Date.now();
  await httpRequest(`${SCOUT_URL}/products`);
  const responseTime = Date.now() - startTime;
  return {
    success: responseTime < 4000, // Slightly higher for enhanced page
    details: `${responseTime}ms`,
    error: responseTime >= 4000 ? 'Enhanced products page too slow' : null
  };
});

// 6. Accessibility Tests
console.log('\n♿ 6. Accessibility Validation');
console.log('------------------------------');

await asyncTest('accessibility', 'HTML structure', async () => {
  const response = await httpRequest(SCOUT_URL);
  const hasValidHTML = response.body.includes('<!DOCTYPE html>') && response.body.includes('<title>');
  return {
    success: hasValidHTML,
    details: hasValidHTML ? 'Valid HTML structure' : 'Invalid HTML structure',
    error: !hasValidHTML ? 'Missing DOCTYPE or title' : null
  };
});

await asyncTest('accessibility', 'Meta tags', async () => {
  const response = await httpRequest(SCOUT_URL);
  const hasMetaTags = response.body.includes('<meta name="description"') && 
                     response.body.includes('<meta name="viewport"');
  return {
    success: hasMetaTags,
    details: hasMetaTags ? 'Meta tags present' : 'Meta tags missing',
    error: !hasMetaTags ? 'Missing essential meta tags' : null
  };
});

await asyncTest('accessibility', 'Enhanced chart accessibility', async () => {
  const response = await httpRequest(`${SCOUT_URL}/products`);
  const hasAriaLabels = response.body.includes('aria-') || 
                       response.body.includes('role=') ||
                       response.body.includes('alt=');
  return {
    success: hasAriaLabels,
    details: hasAriaLabels ? 'Accessibility attributes found' : 'Limited accessibility attributes',
    error: !hasAriaLabels ? 'Missing chart accessibility features' : null
  };
});

// Results Summary
console.log('\n📊 QA VALIDATION SUMMARY');
console.log('========================');

const categories = ['deployment', 'pages', 'components', 'charts', 'performance', 'accessibility'];
let totalPassed = 0;
let totalFailed = 0;

categories.forEach(category => {
  const cat = results[category];
  totalPassed += cat.passed;
  totalFailed += cat.failed;
  
  console.log(`\n${category.toUpperCase()}:`);
  console.log(`  ✅ Passed: ${cat.passed}`);
  console.log(`  ❌ Failed: ${cat.failed}`);
  
  if (cat.failed > 0) {
    console.log('  Failed tests:');
    cat.tests.filter(t => t.status === '❌').forEach(test => {
      console.log(`    • ${test.name}: ${test.details}`);
    });
  }
});

const totalTests = totalPassed + totalFailed;
const successRate = ((totalPassed / totalTests) * 100).toFixed(1);

console.log(`\n🎯 OVERALL RESULTS:`);
console.log(`   Environment: ${ENV.toUpperCase()}`);
console.log(`   Total Tests: ${totalTests}`);
console.log(`   Passed: ${totalPassed}`);
console.log(`   Failed: ${totalFailed}`);
console.log(`   Success Rate: ${successRate}%`);

// Environment-specific success criteria
const successThreshold = ENV === 'preview' ? 85 : 90; // Slightly lower threshold for preview

if (successRate >= successThreshold) {
  console.log(`\n✅ SCOUT DASHBOARD v3.1-${ENV.toUpperCase()}: PASSED`);
  console.log(`   ${ENV === 'preview' ? 'Preview' : 'Production'} deployment is stable and functional`);
  if (ENV === 'preview') {
    console.log(`   📋 Ready for stakeholder review and promotion approval`);
  }
} else if (successRate >= 75) {
  console.log(`\n⚠️  SCOUT DASHBOARD v3.1-${ENV.toUpperCase()}: WARNING`);
  console.log(`   Some issues detected but deployment is functional`);
  if (ENV === 'preview') {
    console.log(`   📋 Address issues before promotion to production`);
  }
} else {
  console.log(`\n❌ SCOUT DASHBOARD v3.1-${ENV.toUpperCase()}: FAILED`);
  console.log(`   Critical issues detected requiring immediate attention`);
}

console.log(`\nQA completed: ${new Date().toISOString()}`);
console.log(`Dashboard URL: ${SCOUT_URL}`);

if (ENV === 'preview') {
  console.log(`\n🔄 Next Steps:`);
  console.log(`   1. Review failed tests and fix issues`);
  console.log(`   2. Stakeholder review (24-48 hours)`);
  console.log(`   3. If approved, promote to production:`);
  console.log(`      cp ui/layouts/scout_dashboard_preview.yaml ui/layouts/scout_dashboard_end_state.yaml`);
  console.log(`      git commit -m "🚀 Promote Scout Dashboard v3.1 from preview to prod"`);
  console.log(`      vercel --prod`);
}

// Exit with appropriate code
process.exit(totalFailed > 0 ? 1 : 0);

}

// Run the QA validation
runQA().catch(console.error);