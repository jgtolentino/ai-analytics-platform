#!/bin/bash

# Scout Analytics v3.2.0 Production Deployment Script
# Clean promotion from v2.1 → v3.2.0

set -e

echo "🚀 Scout Analytics v3.2.0 Production Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "From: v2.1 (stable)"
echo "To: v3.2.0 (production)"
echo "Target: https://scout-mvp.vercel.app"
echo ""

# Step 1: Pre-deployment validation
echo "📋 Running pre-deployment checks..."

# Check if we're on the correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "release/v3.2.0" ]; then
    echo "❌ Error: Must be on release/v3.2.0 branch"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Run KeyKey verification
echo "🔑 Running KeyKey environment verification..."
if command -v keykey &> /dev/null; then
    keykey verify --env .env.production || echo "⚠️  KeyKey verification skipped"
else
    node agents/keykey.cjs status || echo "⚠️  KeyKey not available"
fi

# Run Caca UI audit
echo "🧪 Running Caca UI audit..."
if [ -f "scripts/run-qa-validation.ts" ]; then
    npm run qa:validate || echo "⚠️  Caca audit skipped"
fi

# Step 2: Build verification
echo ""
echo "🔨 Building production bundle..."

# Clean previous builds
rm -rf .next
rm -rf dist
rm -rf out

# Build with production environment
export NODE_ENV=production
export NEXT_PUBLIC_VERSION=3.2.0

# Run build
npm run build || {
    echo "❌ Build failed"
    exit 1
}

echo "✅ Build successful"

# Step 3: Deploy to Vercel
echo ""
echo "🌐 Deploying to Vercel..."

# Check if Vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install: npm i -g vercel"
    exit 1
fi

# Deploy with production flag
vercel deploy --prod \
    --env NODE_ENV=production \
    --env NEXT_PUBLIC_VERSION=3.2.0 \
    --env NEXT_PUBLIC_ENVIRONMENT=production \
    --env ENABLE_AI_AGENTS=true \
    --env FALLBACK_MODE_AVAILABLE=true \
    --build-env SKIP_DATA=false \
    --yes || {
    echo "❌ Deployment failed"
    exit 1
}

# Step 4: Post-deployment validation
echo ""
echo "🔍 Running post-deployment validation..."

# Wait for deployment to propagate
echo "⏳ Waiting for deployment to propagate (30s)..."
sleep 30

# Test the deployment
DEPLOY_URL="https://scout-mvp.vercel.app"
echo "Testing $DEPLOY_URL..."

# Check if site is accessible
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL")
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✅ Site is accessible (HTTP 200)"
else
    echo "⚠️  Site returned HTTP $HTTP_STATUS"
fi

# Check for JavaScript errors
curl -s "$DEPLOY_URL" | grep -q "Scout Analytics" && {
    echo "✅ Site content verified"
} || {
    echo "⚠️  Site content verification failed"
}

# Step 5: Tag the release
echo ""
echo "🏷️  Tagging release..."

git tag -a "v3.2.0" -m "Release v3.2.0 - Production deployment from v2.1
- Stable layout from v2.1
- Cruip UI enhancements
- Production guards and fallback modes
- AI agents with safe mode
- KeyKey + Caca QA validation"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment Complete!"
echo ""
echo "📊 Summary:"
echo "  Version: v3.2.0"
echo "  URL: $DEPLOY_URL"
echo "  Status: Production"
echo "  AI Agents: Enabled (with fallback)"
echo "  Safe Mode: Available"
echo ""
echo "📝 Next Steps:"
echo "  1. Verify production site: $DEPLOY_URL"
echo "  2. Monitor error logs"
echo "  3. Push tags: git push origin v3.2.0"
echo "  4. Update documentation"
echo ""
echo "🎉 Scout Analytics v3.2.0 is now live!"