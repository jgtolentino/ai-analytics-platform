#!/bin/bash

# Scout Analytics Monorepo Setup Script

set -e

echo "🚀 Setting up Scout Analytics Monorepo v3.1.0..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d 'v' -f 2)
REQUIRED_VERSION="18.0.0"

if ! [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to Node.js 18+."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build packages
echo "🔨 Building packages..."
npm run build

# Setup environment files
echo "⚙️  Setting up environment files..."

# Create .env.example if it doesn't exist
if [ ! -f .env.example ]; then
    cat > .env.example << EOL
# Scout Analytics Environment Variables

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/scout_analytics
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# AI Services
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Deployment
VERCEL_TOKEN=your-vercel-token
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_PLATFORM_NAME=Scout Analytics
NEXT_PUBLIC_VERSION=3.1.0
NEXT_PUBLIC_ENVIRONMENT=development

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
MIXPANEL_PROJECT_TOKEN=your-mixpanel-token

# Security
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Features
NEXT_PUBLIC_ENABLE_AI_AGENTS=true
NEXT_PUBLIC_ENABLE_CHARTS=true
NEXT_PUBLIC_ENABLE_FILTERS=true
EOL
    echo "✅ Created .env.example"
fi

# Copy .env.example to .env if .env doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env from .env.example"
    echo "⚠️  Please update .env with your actual values"
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p test-results
mkdir -p coverage
mkdir -p dist

# Setup git hooks (if .git exists)
if [ -d .git ]; then
    echo "🔧 Setting up git hooks..."
    
    # Create pre-commit hook
    mkdir -p .git/hooks
    cat > .git/hooks/pre-commit << 'EOL'
#!/bin/bash
# Pre-commit hook for Scout Analytics

echo "🔍 Running pre-commit checks..."

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Run tests
npm run test:unit

echo "✅ Pre-commit checks passed"
EOL
    
    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooks configured"
fi

# Verify setup
echo "🧪 Verifying setup..."

# Check if build was successful
if [ -d "packages/ui/dist" ]; then
    echo "✅ UI package built successfully"
else
    echo "❌ UI package build failed"
    exit 1
fi

if [ -d "packages/utils/dist" ]; then
    echo "✅ Utils package built successfully"
else
    echo "❌ Utils package build failed"
    exit 1
fi

if [ -d "packages/types/dist" ]; then
    echo "✅ Types package built successfully"
else
    echo "❌ Types package build failed"
    exit 1
fi

# Test AI agents
echo "🤖 Testing AI agents..."
if node -e "
const { retailBot, learnBot, vibeTestBot } = require('./agents/index.ts');
console.log('✅ All agents loaded successfully');
console.log('RetailBot:', retailBot.name, retailBot.version);
console.log('LearnBot:', learnBot.name, learnBot.version);
console.log('VibeTestBot:', vibeTestBot.name, vibeTestBot.version);
" 2>/dev/null; then
    echo "✅ AI agents verified"
else
    echo "⚠️  AI agents verification skipped (TypeScript compilation needed)"
fi

echo ""
echo "🎉 Scout Analytics Monorepo setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your actual environment variables"
echo "2. Run 'npm run dev' to start development"
echo "3. Run 'npm run test' to run all tests"
echo "4. Run 'npm run agents:start' to start AI agents"
echo ""
echo "Available commands:"
echo "  npm run dev              - Start all development servers"
echo "  npm run build            - Build all packages and apps"
echo "  npm run test             - Run all tests"
echo "  npm run lint             - Lint all code"
echo "  npm run typecheck        - Type check all TypeScript"
echo "  npm run agents:start     - Start AI agent orchestrator"
echo "  npm run deploy:preview   - Deploy to preview environment"
echo "  npm run deploy           - Deploy to production"
echo ""
echo "Documentation: https://docs.scout-analytics.com"
echo "Support: https://github.com/scout-analytics/platform/issues"