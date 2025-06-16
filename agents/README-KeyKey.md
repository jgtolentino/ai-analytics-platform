# KeyKey - Environment Variable Synchronizer Agent

KeyKey is a Pulser-compatible agent designed to securely fetch, verify, and apply environment files (`.env`, `.env.production`, `.env.local`) from a designated source repository to any new monorepo setup.

## 🎯 Purpose

- **Secure Environment Sync**: Safely synchronize environment variables between repositories
- **Integrity Verification**: Use SHA256 hashing to ensure file integrity
- **Backup Protection**: Automatically backup existing files before overwriting
- **Metadata Logging**: Track sync history and file changes
- **Preview Mode**: See what changes will be made before applying them

## 🚀 Quick Start

### Basic Usage

```bash
# Preview what will be synced (safe, no changes made)
npm run keykey:preview

# Sync environment files
npm run keykey:sync

# Check sync status and history
npm run keykey:status
```

### Setup Script (Recommended)

```bash
# Complete setup with KeyKey integration
./scripts/setup-with-keykey.sh

# Setup with preview mode (shows changes first)
./scripts/setup-with-keykey.sh --preview
```

## 📋 Features

### File Synchronization
- Syncs `.env`, `.env.production`, `.env.local`, `.env.example`
- Content-based change detection (only updates when files differ)
- Preserves file permissions and timestamps
- Skips missing files gracefully

### Safety Features
- **Backup Creation**: Automatically backs up existing files
- **Preview Mode**: Shows what changes will be made without applying them
- **Confirmation Prompts**: Optional user confirmation before making changes
- **Integrity Verification**: SHA256 hash verification for file integrity

### Monitoring & Logging
- **Sync Metadata**: Stores sync history in `.keykey-sync.json`
- **Status Reporting**: Shows last sync information and file counts
- **Error Tracking**: Logs and reports any synchronization errors

## 🔧 Configuration

### Default Configuration

```typescript
{
  sourceRepoPath: "../scout-mvp",           // Source repository path
  targetRoot: process.cwd(),                // Target directory 
  envFiles: [".env", ".env.production", ".env.local", ".env.example"],
  backupExisting: true,                     // Create backups
  requireConfirmation: false,               // Skip confirmation prompts
  logMetadata: true                         // Save sync metadata
}
```

### Programmatic Usage

```typescript
import KeyKey from './agents/keykey';

const keykey = new KeyKey({
  sourceRepoPath: '../different-repo',
  envFiles: ['.env', '.env.staging'],
  requireConfirmation: true,
  backupExisting: false
});

await keykey.syncEnvFiles();
```

## 📊 CLI Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `sync` | Synchronize environment files | `npm run keykey:sync` |
| `preview` | Preview changes without applying | `npm run keykey:preview` |
| `status` | Show sync history and status | `npm run keykey:status` |

### Advanced CLI Options

```bash
# Interactive mode with confirmation
npx ts-node agents/keykey.ts sync --confirm

# Sync without creating backups  
npx ts-node agents/keykey.ts sync --no-backup

# Sync without logging metadata
npx ts-node agents/keykey.ts sync --no-log
```

## 🛡️ Security Features

### Data Protection
- **No Value Exposure**: Never logs or exposes environment variable values
- **Hash Verification**: Uses SHA256 for file integrity verification
- **Backup Safety**: Creates timestamped backups before overwriting
- **Permission Checks**: Verifies write permissions before making changes

### Error Handling
- **Graceful Failures**: Continues processing other files if one fails
- **Detailed Logging**: Records specific error messages for troubleshooting
- **Recovery Options**: Backup files can be restored manually if needed

## 📁 File Structure

```
agents/
├── keykey.ts              # Main agent implementation
├── keykey-agent.yaml      # Agent registry entry
└── README-KeyKey.md       # This documentation

scripts/
└── setup-with-keykey.sh   # Setup script with KeyKey integration

# Generated files (after sync)
.keykey-sync.json          # Sync metadata and history
.env.backup-2025-06-15...  # Backup files (timestamped)
```

## 🔄 Integration with Pulser

KeyKey is designed for Pulser orchestration system integration:

```yaml
# Agent configuration for Pulser
agent:
  name: KeyKey
  type: env_sync
  execution_mode: on_demand
  workflow_hooks:
    - pre_setup
    - post_clone
    - environment_refresh
```

## 📈 Monitoring & Metrics

### Sync Metadata

The `.keykey-sync.json` file contains:

```json
{
  "timestamp": "2025-06-15T20:30:00.000Z",
  "sourceRepo": "../scout-mvp",
  "files": [
    {
      "name": ".env",
      "hash": "a1b2c3d4e5f6...",
      "size": 1024,
      "synced": true,
      "existed": false
    }
  ],
  "errors": []
}
```

### Success Criteria
- ✅ All specified environment files found and synced
- ✅ No critical errors during synchronization  
- ✅ File integrity verification passed
- ✅ Backup files created for existing files

## 🚨 Troubleshooting

### Common Issues

**Source repository not found**
```bash
# Check if source path is correct
ls -la ../scout-mvp/.env*

# Update source path in configuration
```

**Permission denied**
```bash
# Check write permissions
ls -la .
chmod 755 .
```

**File corruption detected**
```bash
# Check file integrity
npm run keykey:status
# Restore from backup if needed
cp .env.backup-* .env
```

## 🔗 Related Commands

```bash
# Full setup with environment sync
./scripts/setup-with-keykey.sh --preview

# Manual environment file management
npm run keykey:preview  # See what would change
npm run keykey:sync     # Apply changes
npm run keykey:status   # Check results

# Build and deploy after env sync
npm run build
npm run deploy
```

## 📝 Examples

### New Repository Setup

```bash
# Clone new repository
git clone https://github.com/tbwa/new-repo.git
cd new-repo

# Run setup with KeyKey
./scripts/setup-with-keykey.sh --preview

# Start development
npm run dev
```

### Environment Refresh

```bash
# Update environment files from source
npm run keykey:preview  # Check what will change
npm run keykey:sync     # Apply updates
npm run build           # Rebuild with new config
```

### Backup Recovery

```bash
# List available backups
ls -la *.backup-*

# Restore specific backup
cp .env.backup-2025-06-15T20-30-00-000Z .env

# Verify restoration
npm run keykey:status
```

---

**Version**: 1.0.0  
**Author**: TBWA AI Analytics Team  
**License**: MIT  
**Created**: 2025-06-15