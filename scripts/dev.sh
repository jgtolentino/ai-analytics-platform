#!/bin/bash

# Scout Analytics Development Server Script

set -e

echo "🚀 Starting Scout Analytics Development Environment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run ./scripts/setup.sh first."
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

echo "📦 Building packages in watch mode..."

# Start package builds in watch mode (background)
(cd packages/ui && npm run dev) &
UI_PID=$!

(cd packages/utils && npm run dev) &
UTILS_PID=$!

(cd packages/types && npm run dev) &
TYPES_PID=$!

(cd packages/charts && npm run dev) &
CHARTS_PID=$!

echo "⏳ Waiting for packages to build..."
sleep 5

echo "🤖 Starting AI Agents..."
# Start AI agent orchestrator (background)
node -r ts-node/register agents/index.ts &
AGENTS_PID=$!

echo "🌐 Starting Landing Page..."
# Start landing page development server
(cd apps/landing && npm run dev) &
LANDING_PID=$!

echo "📊 Starting Dashboard..."
# Start main dashboard (if exists)
if [ -d "apps/dashboard" ]; then
    (cd apps/dashboard && npm run dev) &
    DASHBOARD_PID=$!
fi

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down development servers..."
    
    if [ ! -z "$UI_PID" ]; then kill $UI_PID 2>/dev/null || true; fi
    if [ ! -z "$UTILS_PID" ]; then kill $UTILS_PID 2>/dev/null || true; fi
    if [ ! -z "$TYPES_PID" ]; then kill $TYPES_PID 2>/dev/null || true; fi
    if [ ! -z "$CHARTS_PID" ]; then kill $CHARTS_PID 2>/dev/null || true; fi
    if [ ! -z "$AGENTS_PID" ]; then kill $AGENTS_PID 2>/dev/null || true; fi
    if [ ! -z "$LANDING_PID" ]; then kill $LANDING_PID 2>/dev/null || true; fi
    if [ ! -z "$DASHBOARD_PID" ]; then kill $DASHBOARD_PID 2>/dev/null || true; fi
    
    echo "✅ Development servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

echo ""
echo "🎉 Development environment started!"
echo ""
echo "Available services:"
echo "  📊 Landing Page: http://localhost:3000"
echo "  🤖 AI Agents: Running in background"
echo "  📦 UI Components: Building in watch mode"
echo "  🔧 Utils & Types: Building in watch mode"
echo "  📈 Charts: Building in watch mode"
echo ""
echo "Logs will appear below..."
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for all background processes
wait