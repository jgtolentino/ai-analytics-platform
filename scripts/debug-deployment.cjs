#!/usr/bin/env node

/**
 * Deployment Debugging Script
 * Diagnoses common Vercel deployment issues
 */

const https = require('https');

const MAIN_URL = 'https://ai-analytics-platform.vercel.app';
const PROBLEM_URL = 'https://ai-analytics-platform-74dgokhsb-jakes-projects-e9f46c30.vercel.app';

console.log('🔍 Debugging Vercel deployment issues...\n');

function checkUrl(url, name) {
  return new Promise((resolve) => {
    console.log(`🌐 Testing ${name}: ${url}`);
    
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
        console.log(`   Content-Length: ${res.headers['content-length'] || 'unknown'}`);
        console.log(`   Server: ${res.headers.server || 'unknown'}`);
        console.log(`   X-Vercel-Cache: ${res.headers['x-vercel-cache'] || 'none'}`);
        
        if (res.statusCode === 401) {
          console.log('   🔒 Authentication required - this is likely a preview deployment');
          console.log('   💡 Use the main production URL instead');
        } else if (res.statusCode === 404) {
          console.log('   ❌ Resource not found - check deployment status');
        } else if (res.statusCode === 200) {
          console.log('   ✅ Working correctly');
          
          // Check for common issues in content
          const hasError = data.includes('Missing Supabase environment variables') ||
                          data.includes('Runtime Error') ||
                          data.includes('Uncaught Error');
          
          if (hasError) {
            console.log('   ⚠️  Content has runtime errors');
          } else {
            console.log('   ✅ Content loads without errors');
          }
        }
        
        resolve({
          url,
          status: res.statusCode,
          working: res.statusCode === 200 && !data.includes('Runtime Error')
        });
      });
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ Request failed: ${err.message}`);
      resolve({ url, status: 'ERROR', working: false });
    });
    
    req.setTimeout(10000, () => {
      console.log('   ⏱️  Request timed out');
      req.destroy();
      resolve({ url, status: 'TIMEOUT', working: false });
    });
    
    console.log('   ⏳ Checking...');
  });
}

async function diagnosDeployment() {
  const results = [
    await checkUrl(MAIN_URL, 'Main Production'),
    await checkUrl(PROBLEM_URL, 'Specific Deployment')
  ];
  
  console.log('\n📊 Diagnosis Summary:');
  console.log('═══════════════════════');
  
  results.forEach(result => {
    const status = result.working ? '✅ WORKING' : 
                  result.status === 401 ? '🔒 AUTH REQUIRED' :
                  result.status === 404 ? '❌ NOT FOUND' : 
                  '❌ ERROR';
    console.log(`${status}: ${result.url}`);
  });
  
  console.log('\n🎯 Recommendations:');
  console.log('─────────────────────');
  
  const mainWorking = results.find(r => r.url === MAIN_URL)?.working;
  const problemResult = results.find(r => r.url === PROBLEM_URL);
  
  if (mainWorking) {
    console.log('✅ Main production URL is working fine');
    console.log('💡 Use: https://ai-analytics-platform.vercel.app/');
  } else {
    console.log('❌ Main production URL has issues');
    console.log('🔧 Check Vercel deployment status and environment variables');
  }
  
  if (problemResult?.status === 401) {
    console.log('🔒 The specific deployment URL requires authentication');
    console.log('💡 This is normal for preview deployments');
    console.log('💡 Share the main production URL instead');
  } else if (problemResult?.status === 404) {
    console.log('❌ The specific deployment URL returns 404');
    console.log('🔧 Check if deployment was successful');
    console.log('🔧 Verify build completed without errors');
  }
  
  console.log('\n📋 Next Steps:');
  if (mainWorking) {
    console.log('1. ✅ Use the main production URL for sharing');
    console.log('2. 🔍 If you need the specific deployment, check Vercel dashboard');
    console.log('3. 🔑 Ensure you\'re logged into the correct Vercel account');
  } else {
    console.log('1. 🔧 Check Vercel deployment logs');
    console.log('2. 🔧 Verify environment variables are set');
    console.log('3. 🔧 Redeploy from main branch');
  }
}

diagnosDeployment().catch(err => {
  console.error('❌ Diagnosis failed:', err.message);
  process.exit(1);
});