#!/bin/bash
# setup-with-keykey.sh
# Enhanced setup script with KeyKey environment synchronization
# Version: 1.0.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

function print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}🚀 Scout Analytics Setup with KeyKey${NC}"
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
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js not found. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm not found. Please install npm first."
        exit 1
    fi
    
    # Check if TypeScript is available globally or will be installed
    if ! command -v npx &> /dev/null; then
        print_error "npx not found. Please update npm: npm install -g npm@latest"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

function install_dependencies() {
    print_step "Installing project dependencies..."
    
    npm install
    
    # Ensure TypeScript is available for KeyKey
    if ! npm list typescript &> /dev/null; then
        print_step "Installing TypeScript for KeyKey agent..."
        npm install --save-dev typescript @types/node
    fi
    
    print_success "Dependencies installed"
}

function run_keykey_sync() {
    print_step "Running KeyKey environment synchronization..."
    
    # Check if KeyKey should run in preview mode first
    if [ "$1" = "--preview" ]; then
        echo ""
        echo -e "${BLUE}📋 KeyKey Preview Mode${NC}"
        echo "This will show what environment files would be synced without making changes."
        echo ""
        
        npx ts-node agents/keykey.ts preview
        
        echo ""
        read -p "Do you want to proceed with the actual sync? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Environment sync cancelled by user"
            return 1
        fi
    fi
    
    # Run KeyKey synchronization
    if npx ts-node agents/keykey.ts sync; then
        print_success "Environment files synchronized successfully"
        
        # Show sync summary
        echo ""
        echo -e "${BLUE}📊 Sync Summary:${NC}"
        npx ts-node agents/keykey.ts status
        
    else
        print_error "Environment synchronization failed"
        echo ""
        echo -e "${YELLOW}💡 Troubleshooting tips:${NC}"
        echo "   1. Ensure source repo exists at ../scout-mvp"
        echo "   2. Check that .env files exist in source repo"
        echo "   3. Verify write permissions in current directory"
        echo "   4. Run with preview mode: $0 --preview"
        return 1
    fi
}

function build_project() {
    print_step "Building project..."
    
    if npm run build; then
        print_success "Project built successfully"
    else
        print_error "Build failed"
        return 1
    fi
}

function run_qa_validation() {
    print_step "Running QA validation..."
    
    if [ -f "scripts/qa-scout-v3-preview.cjs" ]; then
        if node scripts/qa-scout-v3-preview.cjs --env=production; then
            print_success "QA validation passed"
        else
            print_error "QA validation failed"
            return 1
        fi
    else
        print_step "QA script not found, skipping validation"
    fi
}

function show_next_steps() {
    echo ""
    echo -e "${GREEN}🎉 Setup Complete!${NC}"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "   1. Start development server: npm run dev"
    echo "   2. Deploy to preview: ./scripts/deploy-preview-promote.sh preview"
    echo "   3. Run QA validation: node scripts/qa-scout-v3-preview.cjs"
    echo ""
    echo -e "${BLUE}🔐 KeyKey Commands:${NC}"
    echo "   • Preview env sync: npx ts-node agents/keykey.ts preview"
    echo "   • Sync env files: npx ts-node agents/keykey.ts sync"
    echo "   • Check sync status: npx ts-node agents/keykey.ts status"
    echo ""
    echo -e "${BLUE}📁 Environment Files:${NC}"
    if [ -f ".env" ]; then
        echo "   ✅ .env ($(wc -l < .env) lines)"
    else
        echo "   ❌ .env (missing)"
    fi
    if [ -f ".env.production" ]; then
        echo "   ✅ .env.production ($(wc -l < .env.production) lines)"
    else
        echo "   ❌ .env.production (missing)"
    fi
    if [ -f ".env.local" ]; then
        echo "   ✅ .env.local ($(wc -l < .env.local) lines)"
    else
        echo "   ❌ .env.local (missing)"
    fi
}

function cleanup_on_error() {
    print_error "Setup failed. Cleaning up..."
    
    # Remove any partial installations
    if [ -d "node_modules" ] && [ ! -f ".setup-complete" ]; then
        print_step "Removing partial node_modules..."
        rm -rf node_modules
    fi
    
    # Remove any backup files created by KeyKey
    if ls *.backup-* 1> /dev/null 2>&1; then
        print_step "Cleaning up backup files..."
        rm -f *.backup-*
    fi
}

# Trap errors and cleanup
trap cleanup_on_error ERR

# Main execution
print_header

# Parse command line arguments
PREVIEW_MODE=false
SKIP_BUILD=false
SKIP_QA=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --preview)
            PREVIEW_MODE=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-qa)
            SKIP_QA=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --preview     Run KeyKey in preview mode first"
            echo "  --skip-build  Skip the build step"
            echo "  --skip-qa     Skip QA validation"
            echo "  --help        Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Execute setup steps
check_prerequisites
install_dependencies

# Run KeyKey with appropriate mode
if [ "$PREVIEW_MODE" = true ]; then
    run_keykey_sync --preview
else
    run_keykey_sync
fi

# Build and test if not skipped
if [ "$SKIP_BUILD" = false ]; then
    build_project
fi

if [ "$SKIP_QA" = false ]; then
    run_qa_validation
fi

# Mark setup as complete
touch .setup-complete

show_next_steps

print_success "Scout Analytics setup completed successfully!"