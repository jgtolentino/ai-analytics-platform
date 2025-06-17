#!/usr/bin/env node

/**
 * Production Environment Verification Script
 * Checks if Supabase environment variables are properly configured in Vercel
 */

const https = require('https');

const DEPLOYMENT_URL = 'https://ai-analytics-platform.vercel.app';

console.log('🔍 Verifying production environment for ai-analytics-platform...\n');

// Test 1: Check if site loads without errors
function checkSiteLoads() {
  return new Promise((resolve) => {
    console.log('1️⃣ Testing if site loads...');
    
    const req = https.get(DEPLOYMENT_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const hasError = data.includes('Missing Supabase environment variables') ||
                          data.includes('Uncaught Error') ||
                          data.includes('Runtime Error');
          
          if (hasError) {
            console.log('   ❌ Site loads but has environment variable errors');
            console.log('   🔧 Action needed: Add Supabase environment variables in Vercel');
            resolve(false);
          } else {
            console.log('   ✅ Site loads successfully');
            resolve(true);
          }
        } else {
          console.log(`   ❌ Site returned status ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ Request failed: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      console.log('   ❌ Request timed out');
      req.destroy();
      resolve(false);
    });
  });
}

// Test 2: Check for specific error patterns in HTML
function checkForEnvironmentErrors() {
  return new Promise((resolve) => {
    console.log('\n2️⃣ Checking for environment configuration errors...');
    
    const req = https.get(DEPLOYMENT_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const errorPatterns = [
          'Missing Supabase environment variables',
          'process.env.NEXT_PUBLIC_SUPABASE_URL',
          'assertEnv',
          'Environment variable undefined'
        ];
        
        const foundErrors = errorPatterns.filter(pattern => data.includes(pattern));
        
        if (foundErrors.length > 0) {
          console.log('   ❌ Found environment configuration errors:');
          foundErrors.forEach(error => console.log(`      - ${error}`));
          resolve(false);
        } else {
          console.log('   ✅ No environment configuration errors detected');
          resolve(true);
        }
      });
    });
    
    req.on('error', () => resolve(false));
    req.setTimeout(10000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Main verification function
async function verifyProduction() {
  const results = {
    siteLoads: await checkSiteLoads(),
    noEnvErrors: await checkForEnvironmentErrors()
  };
  
  console.log('\n📊 Verification Results:');
  console.log('─────────────────────────');
  console.log(`Site Loading: ${results.siteLoads ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Environment Config: ${results.noEnvErrors ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All checks passed! Production environment is properly configured.');
  } else {
    console.log('\n⚠️  Issues found. Action needed:');
    console.log('\n📋 To fix environment variable issues:');
    console.log('1. Go to Vercel Dashboard → ai-analytics-platform → Settings → Environment Variables');
    console.log('2. Add these required variables:');
    console.log('   • NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
    console.log('   • NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
    console.log('3. Set both to target "Preview" and "Production"');
    console.log('4. Redeploy from Vercel dashboard');
    console.log('5. Run this script again to verify\n');
  }
  
  process.exit(allPassed ? 0 : 1);
}

verifyProduction().catch(err => {
  console.error('❌ Verification script failed:', err.message);
  process.exit(1);
});