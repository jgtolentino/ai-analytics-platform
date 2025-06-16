#!/usr/bin/env node
// scripts/monorepo-info.cjs
// Display monorepo structure and status information

const fs = require('fs');
const path = require('path');

function getMonorepoInfo() {
    console.log('📦 Scout AI Monorepo v3.1.0 Information');
    console.log('=====================================\n');
    
    // Read monorepo config
    try {
        const configPath = path.join(process.cwd(), 'monorepo.yaml');
        
        if (fs.existsSync(configPath)) {
            console.log('🎯 Project: Scout AI Monorepo');
            console.log('📋 Version: 3.1.0');
            console.log('🌐 Deployment: scout-mvp.vercel.app');
            console.log('🔧 Build System: turborepo\n');
        }
        
        // Show applications
        console.log('📱 Applications:');
        if (fs.existsSync('apps/dashboard')) {
            console.log('  ✅ Dashboard - Main retail analytics interface');
        }
        if (fs.existsSync('apps/landing-page/package.json')) {
            console.log('  ✅ Landing Page - Marketing site');
        } else {
            console.log('  📋 Landing Page - Planned for v3.2.0');
        }
        
        // Show packages
        console.log('\n📦 Shared Packages:');
        ['ui', 'utils', 'types', 'charts'].forEach(pkg => {
            if (fs.existsSync(`packages/${pkg}`)) {
                console.log(`  ✅ @scout/${pkg}`);
            } else {
                console.log(`  ❌ @scout/${pkg} - Missing`);
            }
        });
        
        // Show agents
        console.log('\n🤖 AI Agents:');
        const agents = [
            { name: 'RetailBot', type: 'validator', src: 'agents/retailbot' },
            { name: 'LearnBot', type: 'tutorial', src: 'agents/learnbot' },
            { name: 'VibeTestBot', type: 'qa', src: 'agents/testbot' },
            { name: 'KeyKey', type: 'env_sync', src: 'agents/keykey.cjs' }
        ];
        
        agents.forEach(agent => {
            if (fs.existsSync(agent.src)) {
                console.log(`  ✅ ${agent.name} (${agent.type})`);
            } else {
                console.log(`  📋 ${agent.name} (${agent.type}) - Planned`);
            }
        });
        
        // Environment status
        console.log('\n🔐 Environment:');
        ['.env', '.env.production', '.env.local', '.env.example'].forEach(envFile => {
            if (fs.existsSync(envFile)) {
                const stats = fs.statSync(envFile);
                console.log(`  ✅ ${envFile} (${stats.size} bytes)`);
            } else {
                console.log(`  ❌ ${envFile} - Missing`);
            }
        });
        
        // KeyKey status
        if (fs.existsSync('.keykey-sync.json')) {
            const syncData = JSON.parse(fs.readFileSync('.keykey-sync.json', 'utf8'));
            console.log(`\n🔄 Last KeyKey Sync: ${syncData.timestamp}`);
            console.log(`   Files Synced: ${syncData.files.filter(f => f.synced).length}`);
        } else {
            console.log('\n🔄 KeyKey: Run "npm run keykey:sync" to synchronize environment files');
        }
        
        // Build status
        console.log('\n🏗️  Build Status:');
        if (fs.existsSync('.next')) {
            console.log('  ✅ Dashboard built');
        } else {
            console.log('  📋 Run "npm run build" to build applications');
        }
        
        // Deployment info
        console.log('\n🚀 Deployment:');
        console.log('  • Preview: npm run deploy:preview');
        console.log('  • Production: npm run deploy');
        console.log('  • Vercel CLI: vercel --prod');
        
    } catch (error) {
        console.error('❌ Error reading monorepo information:', error.message);
    }
}

if (require.main === module) {
    getMonorepoInfo();
}

module.exports = { getMonorepoInfo };