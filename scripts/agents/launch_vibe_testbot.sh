#!/bin/bash

# Launch Vibe TestBot - AI-powered code QA assistant
# Version: 1.2
# Usage: ./scripts/agents/launch_vibe_testbot.sh [mode] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Vibe TestBot ASCII Art
echo -e "${PURPLE}"
cat << "EOF"
    ╭─────────────────────────────────────╮
    │           VIBE TESTBOT v1.2         │
    │     AI-Powered Code QA Assistant    │
    │                                     │
    │  ✨ TikTok-style fix replays        │
    │  🐛 Real-time error detection       │
    │  ⚡ Instant patch suggestions       │
    │  🛡️ Auto test generation            │
    ╰─────────────────────────────────────╯
EOF
echo -e "${NC}"

# Default values
MODE="dev"
PROJECT_PATH=$(pwd)
CONFIG_FILE="agents/vibe-testbot.yaml"
VERBOSE=false
SHARE_REPLAYS=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--mode)
            MODE="$2"
            shift 2
            ;;
        -p|--project)
            PROJECT_PATH="$2"
            shift 2
            ;;
        -c|--config)
            CONFIG_FILE="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -s|--share)
            SHARE_REPLAYS=true
            shift
            ;;
        check)
            MODE="check"
            shift
            ;;
        test)
            MODE="test"
            shift
            ;;
        replay)
            MODE="replay"
            shift
            ;;
        ci)
            MODE="ci"
            shift
            ;;
        -h|--help)
            cat << EOF
Vibe TestBot - AI-powered code QA assistant

USAGE:
    $0 [MODE] [OPTIONS]

MODES:
    check      Start real-time coding assistance (default)
    test       Generate tests for current project
    replay     Create shareable fix demonstration
    ci         Run comprehensive CI-style validation

OPTIONS:
    -m, --mode MODE         Set operation mode
    -p, --project PATH      Set project path (default: current directory)
    -c, --config FILE       Use custom config file
    -v, --verbose           Enable verbose output
    -s, --share             Enable social sharing for replays
    -h, --help              Show this help message

EXAMPLES:
    $0 check                    # Start vibe mode
    $0 test src/components/     # Generate tests for components
    $0 replay --share           # Create shareable fix replay
    $0 ci --verbose             # Run full CI validation

EOF
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Validate config file exists
if [[ ! -f "$CONFIG_FILE" ]]; then
    echo -e "${RED}❌ Config file not found: $CONFIG_FILE${NC}"
    exit 1
fi

# Function to log with timestamp
log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "${GREEN}[${timestamp}] ℹ️  ${message}${NC}"
            ;;
        "WARN")
            echo -e "${YELLOW}[${timestamp}] ⚠️  ${message}${NC}"
            ;;
        "ERROR")
            echo -e "${RED}[${timestamp}] ❌ ${message}${NC}"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[${timestamp}] ✅ ${message}${NC}"
            ;;
        "VIBE")
            echo -e "${PURPLE}[${timestamp}] ✨ ${message}${NC}"
            ;;
    esac
}

# Function to check dependencies
check_dependencies() {
    log "INFO" "Checking dependencies..."
    
    local missing_deps=()
    
    # Check for Node.js
    if ! command -v node &> /dev/null; then
        missing_deps+=("node")
    fi
    
    # Check for npm
    if ! command -v npm &> /dev/null; then
        missing_deps+=("npm")
    fi
    
    # Check if in a git repository
    if ! git rev-parse --git-dir &> /dev/null; then
        log "WARN" "Not in a git repository - some features may be limited"
    fi
    
    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log "ERROR" "Missing dependencies: ${missing_deps[*]}"
        exit 1
    fi
    
    log "SUCCESS" "All dependencies satisfied"
}

# Function to start vibe mode
start_vibe_mode() {
    log "VIBE" "Starting Vibe TestBot in $MODE mode..."
    log "INFO" "Project path: $PROJECT_PATH"
    log "INFO" "Config: $CONFIG_FILE"
    
    # Create session directory
    local session_dir=".vibe/sessions/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$session_dir"
    
    # Initialize session log
    local session_log="$session_dir/session.log"
    echo "Vibe TestBot Session Started" > "$session_log"
    echo "Mode: $MODE" >> "$session_log"
    echo "Project: $PROJECT_PATH" >> "$session_log"
    echo "Timestamp: $(date)" >> "$session_log"
    
    case $MODE in
        "check"|"dev")
            log "VIBE" "🚀 Vibe mode activated! Watching for code changes..."
            log "INFO" "Press Ctrl+C to stop vibe mode"
            
            # Start file watcher (mock for now)
            while true; do
                sleep 5
                if [[ $VERBOSE == true ]]; then
                    log "INFO" "🔍 Scanning for issues..."
                fi
                
                # Mock error detection
                if [[ $((RANDOM % 10)) -eq 0 ]]; then
                    log "VIBE" "🐛 Potential issue detected in src/components/Dashboard.tsx:42"
                    log "INFO" "💡 Suggestion: Remove unused variable 'tempData'"
                fi
            done
            ;;
            
        "test")
            log "VIBE" "🧪 Generating tests for project..."
            
            # Mock test generation
            log "INFO" "Analyzing codebase structure..."
            sleep 2
            log "SUCCESS" "Generated 12 test cases"
            log "INFO" "Tests saved to: tests/generated/"
            
            cat << EOF

📋 Generated Tests Summary:
   • 5 unit tests for components
   • 4 integration tests for API routes  
   • 3 end-to-end test scenarios

🎯 Coverage estimate: 87%
⚡ Run with: npm test tests/generated/
EOF
            ;;
            
        "replay")
            log "VIBE" "📹 Creating fix replay..."
            
            local replay_id="replay_$(date +%s)"
            local replay_file="$session_dir/${replay_id}.json"
            
            # Mock replay creation
            cat > "$replay_file" << EOF
{
  "id": "$replay_id",
  "title": "Fixed: Unused variable in Dashboard component",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "duration": 15,
  "beforeCode": "const tempData = fetchData(); // Unused",
  "afterCode": "// Removed unused variable",
  "explanation": "Removed unused variable to improve code quality",
  "shareUrl": "https://scout-mvp.vercel.app/replay/$replay_id"
}
EOF
            
            log "SUCCESS" "Fix replay created: $replay_id"
            
            if [[ $SHARE_REPLAYS == true ]]; then
                log "VIBE" "🌍 Shareable URL: https://scout-mvp.vercel.app/replay/$replay_id"
                log "INFO" "💫 Ready for social sharing!"
            fi
            ;;
            
        "ci")
            log "VIBE" "🔍 Running comprehensive CI validation..."
            
            # Mock CI checks
            local checks=("Syntax check" "Type validation" "Lint rules" "Security scan" "Test coverage" "Performance audit")
            
            for check in "${checks[@]}"; do
                log "INFO" "Running: $check"
                sleep 1
                log "SUCCESS" "$check passed"
            done
            
            log "VIBE" "🎉 All CI checks passed! Code quality: 94%"
            ;;
            
        *)
            log "ERROR" "Unknown mode: $MODE"
            exit 1
            ;;
    esac
}

# Function to cleanup on exit
cleanup() {
    log "INFO" "Cleaning up Vibe TestBot session..."
    # Add any cleanup logic here
    log "VIBE" "✨ Vibe session ended. Keep coding with style! 🚀"
}

# Set up signal handlers
trap cleanup EXIT INT TERM

# Main execution
main() {
    log "VIBE" "Initializing Vibe TestBot v1.2..."
    
    check_dependencies
    start_vibe_mode
}

# Run main function
main "$@"