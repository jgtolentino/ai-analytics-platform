#!/bin/bash
# setup-monorepo.sh
# Scout AI Monorepo v3.1.0 Complete Setup Script
# Creates production-ready monorepo structure with KeyKey integration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

function print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}🚀 Scout AI Monorepo v3.1.0 Setup${NC}"
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

function print_info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

function check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check Node.js version
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
    
    # Check git
    if ! command -v git &> /dev/null; then
        print_error "git not found. Please install git first."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

function create_folder_structure() {
    print_step "Creating monorepo folder structure..."
    
    # Create main directories
    mkdir -p apps/dashboard
    mkdir -p apps/landing-page
    mkdir -p packages/ui/src/{components,styles,hooks}
    mkdir -p packages/utils/src
    mkdir -p packages/types/src
    mkdir -p packages/charts/src
    mkdir -p agents/retailbot
    mkdir -p agents/learnbot
    mkdir -p agents/testbot
    mkdir -p scripts
    mkdir -p infra
    mkdir -p docs/{api,components,deployment}
    mkdir -p .github/workflows
    
    print_success "Folder structure created"
}

function setup_gitignore() {
    print_step "Setting up .gitignore..."
    
    cat > .gitignore << 'EOF'
# Environment files
.env*
!.env.example

# Dependencies
node_modules/
*/node_modules/

# Build outputs
.next/
dist/
build/
out/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Temporary folders
tmp/
temp/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Backup files
*.backup-*

# KeyKey sync metadata
.keykey-sync.json

# Vercel
.vercel

# Turbo
.turbo

# Local development
.env.local
.env.development.local
.env.test.local
.env.production.local
EOF

    print_success ".gitignore configured"
}

function setup_root_package_json() {
    print_step "Setting up root package.json..."
    
    cat > package.json << 'EOF'
{
  "name": "scout-ai-monorepo",
  "version": "3.1.0",
  "description": "Scout AI Analytics - Unified retail intelligence platform with AI agent integration",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "test:unit": "turbo run test:unit",
    "test:integration": "turbo run test:integration",
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint:fix",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean",
    "deploy": "turbo run deploy",
    "deploy:preview": "turbo run deploy:preview",
    "setup": "npm install && npm run keykey:sync",
    "keykey:sync": "node agents/keykey.cjs sync",
    "keykey:preview": "node agents/keykey.cjs preview",
    "keykey:status": "node agents/keykey.cjs status",
    "agents:retailbot": "node agents/retailbot/index.js",
    "agents:learnbot": "node agents/learnbot/index.js",
    "agents:testbot": "node agents/testbot/index.js",
    "monorepo:info": "node scripts/monorepo-info.js"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "turbo": "^1.11.2",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0",
    "prettier": "^3.1.1"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/tbwa/scout-ai-monorepo.git"
  },
  "keywords": [
    "monorepo",
    "scout-ai",
    "retail-analytics",
    "ai-agents",
    "dashboard",
    "turborepo"
  ],
  "author": "TBWA AI Analytics Team",
  "license": "MIT"
}
EOF

    print_success "Root package.json created"
}

function setup_dashboard_app() {
    print_step "Setting up dashboard app..."
    
    # Copy existing dashboard structure
    if [ -d "pages" ] && [ -d "src" ]; then
        print_info "Migrating existing dashboard files to apps/dashboard..."
        
        # Copy key files
        cp -r pages apps/dashboard/ 2>/dev/null || true
        cp -r src apps/dashboard/ 2>/dev/null || true
        cp -r public apps/dashboard/ 2>/dev/null || true
        cp next.config.* apps/dashboard/ 2>/dev/null || true
        cp tailwind.config.* apps/dashboard/ 2>/dev/null || true
        cp postcss.config.* apps/dashboard/ 2>/dev/null || true
        cp tsconfig.json apps/dashboard/ 2>/dev/null || true
        
        # Create dashboard package.json
        cat > apps/dashboard/package.json << 'EOF'
{
  "name": "scout-dashboard",
  "version": "3.1.0",
  "description": "Scout Analytics Dashboard - Main retail intelligence interface",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next export",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "clean": "rm -rf .next dist"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@tailwindcss/forms": "^0.5.10",
    "@vercel/analytics": "^1.1.1",
    "clsx": "^2.1.1",
    "dotenv": "^16.3.1",
    "framer-motion": "^12.18.1",
    "js-yaml": "^4.1.0",
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwind-merge": "^3.3.1",
    "typescript": "^5.3.3"
  },
  "devDependencies": {
    "@types/js-yaml": "^4.0.9",
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.0.4",
    "postcss": "^8.4.32",
    "prettier": "^3.1.1",
    "tailwindcss": "^3.4.0"
  }
}
EOF

    else
        print_info "Creating new dashboard app from scratch..."
        
        # Create basic dashboard structure
        cat > apps/dashboard/package.json << 'EOF'
{
  "name": "scout-dashboard",
  "version": "3.1.0",
  "description": "Scout Analytics Dashboard - Main retail intelligence interface",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.0.4"
  }
}
EOF

        # Create basic Next.js structure
        mkdir -p apps/dashboard/pages
        mkdir -p apps/dashboard/public
        
        cat > apps/dashboard/pages/index.tsx << 'EOF'
import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">
          🚀 Scout AI Analytics Dashboard v3.1.0
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Unified retail intelligence platform with AI agent integration
        </p>
      </div>
    </div>
  );
}
EOF

        cat > apps/dashboard/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: true
  }
};

module.exports = nextConfig;
EOF

        cat > apps/dashboard/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@ui/*": ["../../packages/ui/src/*"],
      "@utils/*": ["../../packages/utils/src/*"],
      "@types/*": ["../../packages/types/src/*"],
      "@charts/*": ["../../packages/charts/src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF
    fi
    
    print_success "Dashboard app configured"
}

function setup_shared_packages() {
    print_step "Setting up shared packages..."
    
    # UI Package
    cat > packages/ui/package.json << 'EOF'
{
  "name": "@scout/ui",
  "version": "1.0.0",
  "description": "Scout AI shared UI components and styles",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src/**/*.{ts,tsx}",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^12.18.1",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "typescript": "^5.3.3"
  },
  "peerDependencies": {
    "react": ">=18.0.0"
  }
}
EOF

    cat > packages/ui/src/index.ts << 'EOF'
// UI Package Exports
export * from './components';
export * from './styles';
export * from './hooks';
EOF

    # Utils Package
    cat > packages/utils/package.json << 'EOF'
{
  "name": "@scout/utils",
  "version": "1.0.0",
  "description": "Scout AI shared utility functions",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "lodash": "^4.17.21",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/lodash": "^4.14.202",
    "typescript": "^5.3.3"
  }
}
EOF

    cat > packages/utils/src/index.ts << 'EOF'
// Utils Package Exports
export * from './formatters';
export * from './validators';
export * from './helpers';
EOF

    # Types Package
    cat > packages/types/package.json << 'EOF'
{
  "name": "@scout/types",
  "version": "1.0.0",
  "description": "Scout AI shared TypeScript types and interfaces",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
EOF

    cat > packages/types/src/index.ts << 'EOF'
// Types Package Exports
export * from './chart-types';
export * from './api-types';
export * from './agent-types';
EOF

    # Charts Package
    cat > packages/charts/package.json << 'EOF'
{
  "name": "@scout/charts",
  "version": "1.0.0", 
  "description": "Scout AI interactive chart components",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src/**/*.{ts,tsx}",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "d3": "^7.8.5",
    "recharts": "^2.8.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/d3": "^7.4.3",
    "typescript": "^5.3.3"
  },
  "peerDependencies": {
    "react": ">=18.0.0"
  }
}
EOF

    cat > packages/charts/src/index.ts << 'EOF'
// Charts Package Exports
export * from './SKUCombinationNetwork';
export * from './SubstitutionSankeyChart';
export * from './DailyTransactionChart';
EOF

    print_success "Shared packages configured"
}

function setup_vercel_config() {
    print_step "Setting up Vercel configuration..."
    
    cat > infra/vercel.json << 'EOF'
{
  "version": 2,
  "name": "scout-ai-monorepo",
  "builds": [
    {
      "src": "apps/dashboard/next.config.js",
      "use": "@vercel/next",
      "config": {
        "distDir": ".next"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "apps/dashboard/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "apps/dashboard/pages/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "framework": "nextjs"
}
EOF

    # Copy to root for Vercel CLI
    cp infra/vercel.json vercel.json

    print_success "Vercel configuration created"
}

function run_keykey_sync() {
    print_step "Running KeyKey environment synchronization..."
    
    if [ -f "agents/keykey.cjs" ]; then
        # Run KeyKey to sync environment files
        if node agents/keykey.cjs sync; then
            print_success "Environment files synchronized via KeyKey"
        else
            print_error "KeyKey synchronization failed, continuing setup..."
        fi
    else
        print_info "KeyKey agent not found, skipping environment sync"
    fi
}

function install_dependencies() {
    print_step "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install dashboard dependencies if it exists
    if [ -f "apps/dashboard/package.json" ]; then
        cd apps/dashboard
        npm install
        cd ../..
    fi
    
    print_success "Dependencies installed"
}

function setup_github_actions() {
    print_step "Setting up GitHub Actions..."
    
    cat > .github/workflows/ci.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Run type checking
        run: npm run typecheck
        
      - name: Run tests
        run: npm run test
        
      - name: Build applications
        run: npm run build

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./
EOF

    print_success "GitHub Actions configured"
}

function create_readme() {
    print_step "Creating comprehensive README..."
    
    cat > README.md << 'EOF'
# Scout AI Monorepo v3.1.0

> Unified retail intelligence platform with AI agent integration

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tbwa/scout-ai-monorepo)

## 🎯 Overview

Scout AI Monorepo is a production-ready monorepo for retail analytics and AI-powered insights. Built with Next.js, TypeScript, and Turborepo, it provides a unified platform for data visualization, AI agent integration, and real-time analytics.

## 🏗️ Architecture

```
scout-ai-monorepo/
├── apps/
│   ├── dashboard/             # Main React dashboard (Next.js)
│   └── landing-page/          # Marketing page (planned v3.2.0)
├── packages/
│   ├── ui/                    # Shared component library
│   ├── utils/                 # Utility functions
│   ├── types/                 # TypeScript definitions
│   └── charts/                # Interactive chart components
├── agents/
│   ├── retailbot/             # Analytics AI agent
│   ├── learnbot/              # Tutorial AI agent
│   ├── testbot/               # QA AI agent
│   └── keykey.cjs             # Environment sync agent
├── scripts/                   # Automation scripts
├── infra/                     # Infrastructure configs
└── docs/                      # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/tbwa/scout-ai-monorepo.git
cd scout-ai-monorepo

# Run complete setup with environment sync
./scripts/setup-monorepo.sh

# Start development
npm run dev
```

### Environment Setup

The monorepo uses KeyKey agent for secure environment synchronization:

```bash
# Preview environment files to be synced
npm run keykey:preview

# Sync environment files from source
npm run keykey:sync

# Check sync status
npm run keykey:status
```

## 📦 Available Scripts

### Root Level Commands

```bash
npm run dev          # Start all apps in development mode
npm run build        # Build all apps and packages  
npm run test         # Run all tests
npm run lint         # Lint all packages
npm run deploy       # Deploy to production
npm run clean        # Clean all build artifacts
```

### KeyKey Agent Commands

```bash
npm run keykey:sync     # Sync environment files
npm run keykey:preview  # Preview sync changes
npm run keykey:status   # Show sync history
```

### AI Agent Commands

```bash
npm run agents:retailbot  # Run RetailBot analytics agent
npm run agents:learnbot   # Run LearnBot tutorial agent  
npm run agents:testbot    # Run VibeTestBot QA agent
```

## 🧠 AI Agents

### RetailBot
- **Purpose**: Analytics validation and insights
- **Capabilities**: KPI validation, trend analysis, recommendations
- **Integration**: Unified AI panel in dashboard

### LearnBot  
- **Purpose**: Interactive tutorials and help
- **Capabilities**: Step-by-step guidance, feature explanations
- **Integration**: Contextual tooltips and help system

### VibeTestBot
- **Purpose**: Real-time QA and performance monitoring
- **Capabilities**: Code quality analysis, performance monitoring
- **Integration**: Development and testing workflows

### KeyKey
- **Purpose**: Environment variable synchronization
- **Capabilities**: Secure file sync, integrity verification, backup creation
- **Integration**: Setup and deployment workflows

## 🏢 Applications

### Dashboard (`apps/dashboard`)

Main retail analytics dashboard featuring:

- **Overview**: Executive summary with KPI cards
- **Trends**: Time-series analysis and revenue patterns  
- **Products**: SKU dynamics and substitution analysis
- **AI Assistant**: Unified AI agent interface

**Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion

### Landing Page (`apps/landing-page`)

Marketing and onboarding page (planned for v3.2.0)

## 📚 Packages

### UI (`packages/ui`)
Shared component library with Tailwind CSS and design system components.

### Utils (`packages/utils`) 
Common utility functions, formatters, and helpers.

### Types (`packages/types`)
Global TypeScript interfaces and type definitions.

### Charts (`packages/charts`)
Interactive chart components including SKU networks and Sankey diagrams.

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to preview
npm run deploy:preview

# Deploy to production  
npm run deploy
```

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy dashboard app
cd apps/dashboard
vercel --prod
```

## 🔧 Configuration

### Environment Variables

Required environment variables (managed via KeyKey):

```bash
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# AI Integration  
OPENAI_API_KEY=your_openai_key
AZURE_OPENAI_ENDPOINT=your_azure_endpoint

# Deployment
VERCEL_TOKEN=your_vercel_token
NEXT_PUBLIC_SITE_URL=https://scout-mvp.vercel.app
```

### Monorepo Configuration

Central configuration in `monorepo.yaml`:

- Environment settings
- Deployment targets
- AI agent registry
- Build pipeline configuration
- Package dependencies

## 🔍 Development

### Adding New Packages

```bash
# Create new package
mkdir packages/new-package
cd packages/new-package

# Initialize package
npm init -y

# Add to workspace
# Edit root package.json workspaces array
```

### Working with AI Agents

```bash
# Create new agent
mkdir agents/new-agent
cd agents/new-agent

# Follow agent template structure
# Register in monorepo.yaml
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test types
npm run test:unit
npm run test:integration

# Run tests for specific package
npm run test --workspace=@scout/ui
```

## 📈 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Automatic error reporting (planned)
- **AI Agent Metrics**: Usage tracking and performance metrics

## 🔐 Security

- Environment files are gitignored and managed via KeyKey
- Secret rotation via Vercel environment variables
- Access control and audit logging (planned v3.2.0)

## 🛠️ Troubleshooting

### Common Issues

**Build failures**: Check Node.js version (18+ required)
**Environment issues**: Run `npm run keykey:sync` to refresh environment files
**Dependency conflicts**: Run `npm run clean` and reinstall

### Getting Help

- Check [documentation](./docs/)
- Review [agent guides](./agents/)
- Open an issue on GitHub

## 📋 Roadmap

### v3.2.0 (Q4 2025)
- Landing page application
- Role-based access control
- Real-time data streaming
- Advanced AI insights

### v3.3.0 (Q1 2026)  
- Multi-tenant support
- Mobile app companion
- API marketplace
- Advanced analytics exports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👥 Team

**TBWA AI Analytics Team**
- InsightPulseAI Development Team
- Scout Analytics Contributors

---

**Version**: 3.1.0  
**Last Updated**: 2025-06-15  
**Status**: Production Ready 🚀
EOF

    print_success "README.md created"
}

function create_monorepo_info_script() {
    print_step "Creating monorepo info script..."
    
    cat > scripts/monorepo-info.js << 'EOF'
#!/usr/bin/env node
// scripts/monorepo-info.js
// Display monorepo structure and status information

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function getMonorepoInfo() {
    console.log('📦 Scout AI Monorepo v3.1.0 Information');
    console.log('=====================================\n');
    
    // Read monorepo config
    try {
        const configPath = path.join(process.cwd(), 'monorepo.yaml');
        const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
        
        console.log(`🎯 Project: ${config.name}`);
        console.log(`📋 Version: ${config.version}`);
        console.log(`🌐 Deployment: ${config.deployment.domain}`);
        console.log(`🔧 Build System: ${config.build.system}\n`);
        
        // Show applications
        console.log('📱 Applications:');
        if (fs.existsSync('apps/dashboard')) {
            console.log('  ✅ Dashboard - Main retail analytics interface');
        }
        if (fs.existsSync('apps/landing-page')) {
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
        config.agents.forEach(agent => {
            if (fs.existsSync(path.dirname(agent.src))) {
                console.log(`  ✅ ${agent.name} (${agent.type})`);
            } else {
                console.log(`  📋 ${agent.name} (${agent.type}) - Planned`);
            }
        });
        
        // Environment status
        console.log('\n🔐 Environment:');
        ['.env', '.env.production', '.env.local'].forEach(envFile => {
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
        }
        
    } catch (error) {
        console.error('❌ Error reading monorepo configuration:', error.message);
    }
}

if (require.main === module) {
    getMonorepoInfo();
}

module.exports = { getMonorepoInfo };
EOF

    print_success "Monorepo info script created"
}

function finalize_setup() {
    print_step "Finalizing setup..."
    
    # Mark setup as complete
    touch .setup-complete
    
    # Display final information
    echo ""
    echo -e "${GREEN}🎉 Scout AI Monorepo v3.1.0 Setup Complete!${NC}"
    echo ""
    echo -e "${BLUE}📋 Next Steps:${NC}"
    echo "   1. Start development: npm run dev"
    echo "   2. Build for production: npm run build" 
    echo "   3. Deploy to Vercel: npm run deploy"
    echo "   4. View monorepo info: npm run monorepo:info"
    echo ""
    echo -e "${BLUE}🔗 Useful Commands:${NC}"
    echo "   • npm run keykey:sync     - Sync environment files"
    echo "   • npm run agents:retailbot - Run RetailBot agent"
    echo "   • npm run test            - Run all tests"
    echo "   • npm run lint            - Lint all packages"
    echo ""
    echo -e "${BLUE}📁 Structure Created:${NC}"
    echo "   ✅ Apps: dashboard (+ landing-page planned)"
    echo "   ✅ Packages: ui, utils, types, charts"
    echo "   ✅ Agents: retailbot, learnbot, testbot, keykey"
    echo "   ✅ Infrastructure: vercel, github-actions"
    echo "   ✅ Documentation: README.md, docs/"
    echo ""
    
    if [ -f ".env" ]; then
        echo -e "${GREEN}🔐 Environment files synchronized via KeyKey${NC}"
    else
        echo -e "${YELLOW}⚠️  Run 'npm run keykey:sync' to synchronize environment files${NC}"
    fi
    
    print_success "Monorepo setup completed successfully!"
}

# Main execution
print_header

# Parse command line arguments
SKIP_INSTALL=false
SKIP_KEYKEY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-install)
            SKIP_INSTALL=true
            shift
            ;;
        --skip-keykey)
            SKIP_KEYKEY=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --skip-install  Skip dependency installation"
            echo "  --skip-keykey   Skip KeyKey environment sync"
            echo "  --help          Show this help message"
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
create_folder_structure
setup_gitignore
setup_root_package_json
setup_dashboard_app
setup_shared_packages
setup_vercel_config
setup_github_actions
create_readme
create_monorepo_info_script

# Run KeyKey sync if not skipped
if [ "$SKIP_KEYKEY" = false ]; then
    run_keykey_sync
fi

# Install dependencies if not skipped
if [ "$SKIP_INSTALL" = false ]; then
    install_dependencies
fi

finalize_setup