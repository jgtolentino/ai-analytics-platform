#!/bin/bash
# deploy-preview-promote.sh
# Scout Analytics v3.1 Preview → Promote → Prod Deployment Script
# Usage: ./scripts/deploy-preview-promote.sh [preview|promote|status]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PREVIEW_YAML="ui/layouts/scout_dashboard_preview.yaml"
PRODUCTION_YAML="ui/layouts/scout_dashboard_end_state.yaml"
VERSION_YAML="ui/layouts/scout_dashboard_v3.1.0.yaml"
QA_SCRIPT="scripts/qa-scout-v3-preview.cjs"

# URLs
PREVIEW_URL="https://scout-mvp-git-preview-ai-analytics-platform.vercel.app"
PRODUCTION_URL="https://scout-mvp.vercel.app"

function print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}🚀 Scout Analytics v3.1 Deployment Pipeline${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
}

function print_step() {
    echo -e "${YELLOW}▶ $1${NC}"
}

function print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

function print_error() {
    echo -e "${RED}❌ $1${NC}"
}

function check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check if vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI not found. Please install: npm i -g vercel"
        exit 1
    fi
    
    # Check if git is clean (for promote)
    if [[ "$1" == "promote" ]]; then
        if ! git diff --quiet; then
            print_error "Git working directory is not clean. Please commit changes first."
            exit 1
        fi
    fi
    
    # Check if YAML files exist
    if [[ ! -f "$PREVIEW_YAML" ]]; then
        print_error "Preview YAML not found: $PREVIEW_YAML"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

function deploy_preview() {
    print_step "Deploying to preview environment..."
    
    # Build the project
    print_step "Building project..."
    npm run build
    
    # Deploy to preview
    print_step "Deploying to Vercel preview..."
    vercel --prebuilt --confirm --token "$VERCEL_TOKEN" || {
        print_error "Preview deployment failed"
        exit 1
    }
    
    # Wait for deployment to be ready
    print_step "Waiting for deployment to be ready..."
    sleep 30
    
    # Run QA validation on preview
    print_step "Running QA validation on preview..."
    node "$QA_SCRIPT" --env=preview || {
        print_error "Preview QA validation failed"
        exit 1
    }
    
    print_success "Preview deployment completed successfully"
    echo -e "${GREEN}📋 Preview URL: $PREVIEW_URL${NC}"
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "   1. Review the preview deployment"
    echo "   2. Share with stakeholders for approval"
    echo "   3. Run: ./scripts/deploy-preview-promote.sh promote"
}

function promote_to_production() {
    print_step "Promoting preview to production..."
    
    # Verify preview is working
    print_step "Verifying preview deployment..."
    curl -s -o /dev/null -w "%{http_code}" "$PREVIEW_URL" | grep -q "200" || {
        print_error "Preview deployment is not accessible"
        exit 1
    }
    
    # Run final QA on preview
    print_step "Running final QA validation on preview..."
    node "$QA_SCRIPT" --env=preview || {
        print_error "Final preview QA validation failed"
        exit 1
    }
    
    # Copy preview config to production
    print_step "Copying preview configuration to production..."
    cp "$PREVIEW_YAML" "$PRODUCTION_YAML"
    
    # Update version in production YAML
    print_step "Updating production YAML version..."
    sed -i.bak 's/3.1.0-preview/3.1.0/g' "$PRODUCTION_YAML"
    sed -i.bak 's/preview/production/g' "$PRODUCTION_YAML"
    sed -i.bak "s|$PREVIEW_URL|$PRODUCTION_URL|g" "$PRODUCTION_YAML"
    rm "$PRODUCTION_YAML.bak"
    
    # Commit the promotion
    print_step "Committing promotion to git..."
    git add "$PRODUCTION_YAML"
    git commit -m "🚀 Promote Scout Dashboard v3.1 from preview to prod

Features:
- Enhanced SKU combination network chart
- Interactive substitution Sankey diagram
- Improved product mix analysis
- Cross-selling insights

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
    
    # Push to main
    print_step "Pushing to main branch..."
    git push origin main
    
    # Deploy to production
    print_step "Deploying to production..."
    vercel --prod --token "$VERCEL_TOKEN" || {
        print_error "Production deployment failed"
        exit 1
    }
    
    # Wait for production deployment
    print_step "Waiting for production deployment..."
    sleep 45
    
    # Run QA validation on production
    print_step "Running QA validation on production..."
    node "$QA_SCRIPT" --env=production || {
        print_error "Production QA validation failed"
        exit 1
    }
    
    # Create version lock
    print_step "Creating version lock..."
    cp "$PRODUCTION_YAML" "$VERSION_YAML"
    git add "$VERSION_YAML"
    git commit -m "📋 Lock Scout Dashboard v3.1.0 configuration

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
    git push origin main
    
    print_success "Production promotion completed successfully"
    echo -e "${GREEN}🎉 Production URL: $PRODUCTION_URL${NC}"
    echo -e "${GREEN}📋 Version locked: scout_dashboard_v3.1.0.yaml${NC}"
}

function show_status() {
    print_step "Checking deployment status..."
    
    echo ""
    echo -e "${BLUE}📊 DEPLOYMENT STATUS${NC}"
    echo -e "${BLUE}===================${NC}"
    
    # Check preview status
    echo -e "\n${YELLOW}Preview Environment:${NC}"
    PREVIEW_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PREVIEW_URL" || echo "000")
    if [[ "$PREVIEW_STATUS" == "200" ]]; then
        echo -e "  Status: ${GREEN}✅ Online${NC}"
        echo -e "  URL: $PREVIEW_URL"
    else
        echo -e "  Status: ${RED}❌ Offline (HTTP $PREVIEW_STATUS)${NC}"
    fi
    
    # Check production status
    echo -e "\n${YELLOW}Production Environment:${NC}"
    PROD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL" || echo "000")
    if [[ "$PROD_STATUS" == "200" ]]; then
        echo -e "  Status: ${GREEN}✅ Online${NC}"
        echo -e "  URL: $PRODUCTION_URL"
    else
        echo -e "  Status: ${RED}❌ Offline (HTTP $PROD_STATUS)${NC}"
    fi
    
    # Check YAML files
    echo -e "\n${YELLOW}Configuration Files:${NC}"
    if [[ -f "$PREVIEW_YAML" ]]; then
        echo -e "  Preview YAML: ${GREEN}✅ Present${NC}"
    else
        echo -e "  Preview YAML: ${RED}❌ Missing${NC}"
    fi
    
    if [[ -f "$PRODUCTION_YAML" ]]; then
        echo -e "  Production YAML: ${GREEN}✅ Present${NC}"
    else
        echo -e "  Production YAML: ${RED}❌ Missing${NC}"
    fi
    
    if [[ -f "$VERSION_YAML" ]]; then
        echo -e "  Version Lock: ${GREEN}✅ Present${NC}"
    else
        echo -e "  Version Lock: ${YELLOW}⚠️ Not created yet${NC}"
    fi
    
    # Check git status
    echo -e "\n${YELLOW}Git Status:${NC}"
    if git diff --quiet; then
        echo -e "  Working Directory: ${GREEN}✅ Clean${NC}"
    else
        echo -e "  Working Directory: ${YELLOW}⚠️ Has uncommitted changes${NC}"
    fi
    
    echo ""
}

function show_help() {
    echo "Usage: $0 [preview|promote|status|help]"
    echo ""
    echo "Commands:"
    echo "  preview  - Deploy to preview environment for testing"
    echo "  promote  - Promote preview to production (requires approval)"
    echo "  status   - Show current deployment status"
    echo "  help     - Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  VERCEL_TOKEN - Required for deployments"
    echo ""
    echo "Examples:"
    echo "  $0 preview   # Deploy new features to preview"
    echo "  $0 status    # Check current status"
    echo "  $0 promote   # Promote to production after approval"
}

# Main execution
print_header

case "${1:-help}" in
    "preview")
        check_prerequisites preview
        deploy_preview
        ;;
    "promote")
        check_prerequisites promote
        promote_to_production
        ;;
    "status")
        show_status
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac