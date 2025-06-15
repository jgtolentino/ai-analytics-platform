#!/usr/bin/env node
// scripts/qa-scout-v2.js
// Comprehensive QA validation for Scout Analytics Dashboard v2.0
// Tests live deployment at https://scout-mvp.vercel.app

const https = require('https');
const { execSync } = require('child_process');

const SCOUT_URL = 'https://scout-mvp.vercel.app';
const TEST_TIMEOUT = 30000;

console.log('🔍 Scout Analytics QA Validation v2.0');
console.log('=====================================');
console.log(`Target: ${SCOUT_URL}`);
console.log(`Started: ${new Date().toISOString()}\n`);

// QA Test Results
const results = {
  deployment: { passed: 0, failed: 0, tests: [] },
  pages: { passed: 0, failed: 0, tests: [] },
  components: { passed: 0, failed: 0, tests: [] },
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

// Test function wrapper
function test(category, name, testFn) {
  try {
    const result = testFn();
    if (result === true || (result && result.success !== false)) {
      results[category].passed++;
      results[category].tests.push({ name, status: '✅', details: result.details || 'Passed' });
      console.log(`✅ ${name}`);
    } else {
      results[category].failed++;
      results[category].tests.push({ name, status: '❌', details: result.error || 'Failed' });
      console.log(`❌ ${name}: ${result.error || 'Unknown error'}`);
    }
  } catch (error) {
    results[category].failed++;
    results[category].tests.push({ name, status: '❌', details: error.message });
    console.log(`❌ ${name}: ${error.message}`);
  }
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

await asyncTest('deployment', 'Main site accessibility', async () => {
  const response = await httpRequest(SCOUT_URL);
  return {
    success: response.statusCode === 200,
    details: `Status: ${response.statusCode}, Size: ${(response.size / 1024).toFixed(1)}KB`,
    error: response.statusCode !== 200 ? `HTTP ${response.statusCode}` : null
  };
});

await asyncTest('deployment', 'Content-Type header', async () => {
  const response = await httpRequest(SCOUT_URL);
  const contentType = response.headers['content-type'];
  return {
    success: contentType && contentType.includes('text/html'),
    details: contentType,
    error: !contentType ? 'Missing Content-Type header' : null
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
  { path: '/products', name: 'Product Mix & SKU' },
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

await asyncTest('components', 'AI Assistant references', async () => {
  const response = await httpRequest(SCOUT_URL);
  const hasAI = response.body.includes('RetailBot') || response.body.includes('AI Assistant');
  return {
    success: hasAI,
    details: hasAI ? 'AI Assistant components found' : 'AI Assistant components missing',
    error: !hasAI ? 'Missing AI Assistant references' : null
  };
});

await asyncTest('components', 'Navigation elements', async () => {
  const response = await httpRequest(SCOUT_URL);
  const hasNav = response.body.includes('Overview') && response.body.includes('Trends') && response.body.includes('Products');
  return {
    success: hasNav,
    details: hasNav ? 'Navigation elements found' : 'Navigation elements missing',
    error: !hasNav ? 'Missing navigation elements' : null
  };
});

await asyncTest('components', 'Interactive charts', async () => {
  const response = await httpRequest(`${SCOUT_URL}/trends`);
  const hasCharts = response.body.includes('Transaction') && response.body.includes('Heatmap');
  return {
    success: hasCharts,
    details: hasCharts ? 'Chart components found' : 'Chart components missing',
    error: !hasCharts ? 'Missing chart components' : null
  };
});

await asyncTest('components', 'Demographic data', async () => {
  const response = await httpRequest(SCOUT_URL);
  const hasDemographics = response.body.includes('29,060') || response.body.includes('Population');
  return {
    success: hasDemographics,
    details: hasDemographics ? 'Demographic data found' : 'Demographic data missing',
    error: !hasDemographics ? 'Missing demographic data' : null
  };
});

// 4. Performance Tests
console.log('\n⚡ 4. Performance Validation');
console.log('----------------------------');

await asyncTest('performance', 'Page load size', async () => {
  const response = await httpRequest(SCOUT_URL);
  const sizeMB = response.size / (1024 * 1024);
  return {
    success: sizeMB < 2.0, // Less than 2MB
    details: `${sizeMB.toFixed(2)}MB`,
    error: sizeMB >= 2.0 ? 'Page size too large' : null
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

// 5. Accessibility Tests
console.log('\n♿ 5. Accessibility Validation');
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
  const hasMetaTags = response.body.includes('<meta name="description"') && response.body.includes('<meta name="viewport"');
  return {
    success: hasMetaTags,
    details: hasMetaTags ? 'Meta tags present' : 'Meta tags missing',
    error: !hasMetaTags ? 'Missing essential meta tags' : null
  };
});

// Results Summary
console.log('\n📊 QA VALIDATION SUMMARY');
console.log('========================');

const categories = ['deployment', 'pages', 'components', 'performance', 'accessibility'];
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
console.log(`   Total Tests: ${totalTests}`);
console.log(`   Passed: ${totalPassed}`);
console.log(`   Failed: ${totalFailed}`);
console.log(`   Success Rate: ${successRate}%`);

if (successRate >= 90) {
  console.log(`\n✅ SCOUT DASHBOARD QA: PASSED`);
  console.log(`   Production deployment is stable and functional`);
} else if (successRate >= 75) {
  console.log(`\n⚠️  SCOUT DASHBOARD QA: WARNING`);
  console.log(`   Some issues detected but deployment is functional`);
} else {
  console.log(`\n❌ SCOUT DASHBOARD QA: FAILED`);
  console.log(`   Critical issues detected requiring immediate attention`);
}

console.log(`\nQA completed: ${new Date().toISOString()}`);
console.log(`Dashboard URL: ${SCOUT_URL}`);

// Exit with appropriate code
process.exit(totalFailed > 0 ? 1 : 0);

}

// Run the QA validation
runQA().catch(console.error);