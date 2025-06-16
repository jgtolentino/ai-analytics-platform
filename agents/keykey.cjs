#!/usr/bin/env node
// agents/keykey.cjs
// KeyKey - Environment Variable Synchronizer Agent (CommonJS version)
// Version: 1.0.0

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const DEFAULT_CONFIG = {
  sourceRepoPath: '../scout-mvp',
  targetRoot: process.cwd(),
  envFiles: ['.env', '.env.production', '.env.local', '.env.example'],
  backupExisting: true,
  requireConfirmation: false,
  logMetadata: true
};

class KeyKey {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.metadata = {
      timestamp: new Date().toISOString(),
      sourceRepo: this.config.sourceRepoPath,
      files: [],
      errors: []
    };
  }

  calculateFileHash(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  }

  filesAreDifferent(sourcePath, targetPath) {
    if (!fs.existsSync(targetPath)) return true;
    
    const sourceHash = this.calculateFileHash(sourcePath);
    const targetHash = this.calculateFileHash(targetPath);
    return sourceHash !== targetHash;
  }

  backupFile(filePath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup-${timestamp}`;
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  }

  previewSync() {
    console.log('🔍 KeyKey Preview - Environment File Sync Analysis');
    console.log('=================================================');
    console.log(`Source: ${this.config.sourceRepoPath}`);
    console.log(`Target: ${this.config.targetRoot}\n`);

    for (const file of this.config.envFiles) {
      const sourcePath = path.join(this.config.sourceRepoPath, file);
      const targetPath = path.join(this.config.targetRoot, file);
      
      if (!fs.existsSync(sourcePath)) {
        console.log(`⚠️  ${file}: Not found in source repo`);
        continue;
      }

      const sourceStats = fs.statSync(sourcePath);
      const targetExists = fs.existsSync(targetPath);
      
      if (!targetExists) {
        console.log(`✅ ${file}: Will be created (${sourceStats.size} bytes)`);
      } else if (this.filesAreDifferent(sourcePath, targetPath)) {
        console.log(`🔄 ${file}: Will be updated (content differs)`);
      } else {
        console.log(`✓  ${file}: Already up to date`);
      }
    }
    console.log('');
  }

  async syncEnvFiles() {
    console.log('🔐 KeyKey - Environment Variable Synchronizer');
    console.log('============================================');
    
    // Verify source repository exists
    if (!fs.existsSync(this.config.sourceRepoPath)) {
      const error = `Source repository not found: ${this.config.sourceRepoPath}`;
      this.metadata.errors.push(error);
      throw new Error(error);
    }

    console.log(`📁 Source: ${this.config.sourceRepoPath}`);
    console.log(`📁 Target: ${this.config.targetRoot}\n`);

    // Process each environment file
    for (const file of this.config.envFiles) {
      await this.syncSingleFile(file);
    }

    // Install dotenv if not present
    await this.ensureDotenvInstalled();

    // Log metadata if enabled
    if (this.config.logMetadata) {
      this.saveMetadata();
    }

    // Summary
    const syncedCount = this.metadata.files.filter(f => f.synced).length;
    const errorCount = this.metadata.errors.length;
    
    console.log('\n📊 SYNC SUMMARY');
    console.log('================');
    console.log(`✅ Files synced: ${syncedCount}`);
    console.log(`⚠️  Errors: ${errorCount}`);
    
    if (errorCount > 0) {
      console.log('\nErrors:');
      this.metadata.errors.forEach(error => console.log(`  • ${error}`));
    }

    return this.metadata;
  }

  async syncSingleFile(fileName) {
    const sourcePath = path.join(this.config.sourceRepoPath, fileName);
    const targetPath = path.join(this.config.targetRoot, fileName);
    
    const fileMetadata = {
      name: fileName,
      hash: '',
      size: 0,
      synced: false,
      existed: fs.existsSync(targetPath)
    };

    try {
      // Check if source file exists
      if (!fs.existsSync(sourcePath)) {
        console.log(`⚠️  ${fileName}: Not found in source repo, skipping`);
        this.metadata.files.push(fileMetadata);
        return;
      }

      const sourceStats = fs.statSync(sourcePath);
      fileMetadata.size = sourceStats.size;
      fileMetadata.hash = this.calculateFileHash(sourcePath);

      // Check if update is needed
      if (fileMetadata.existed && !this.filesAreDifferent(sourcePath, targetPath)) {
        console.log(`✓  ${fileName}: Already up to date`);
        this.metadata.files.push(fileMetadata);
        return;
      }

      // Backup existing file if configured
      if (fileMetadata.existed && this.config.backupExisting) {
        const backupPath = this.backupFile(targetPath);
        console.log(`📦 ${fileName}: Backed up to ${path.basename(backupPath)}`);
      }

      // Copy file
      fs.copyFileSync(sourcePath, targetPath);
      fileMetadata.synced = true;
      
      const action = fileMetadata.existed ? 'Updated' : 'Created';
      console.log(`✅ ${fileName}: ${action} (${sourceStats.size} bytes, hash: ${fileMetadata.hash})`);

    } catch (error) {
      const errorMsg = `Failed to sync ${fileName}: ${error}`;
      console.log(`❌ ${errorMsg}`);
      this.metadata.errors.push(errorMsg);
    }

    this.metadata.files.push(fileMetadata);
  }

  async ensureDotenvInstalled() {
    try {
      // Check if dotenv is already installed
      const packageJsonPath = path.join(this.config.targetRoot, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const hasDotenv = packageJson.dependencies?.dotenv || packageJson.devDependencies?.dotenv;
        
        if (hasDotenv) {
          console.log('✓  dotenv: Already installed');
          return;
        }
      }

      console.log('📦 Installing dotenv...');
      execSync('npm install dotenv', { 
        stdio: 'inherit', 
        cwd: this.config.targetRoot 
      });
      console.log('✅ dotenv: Installed successfully');
      
    } catch (error) {
      const errorMsg = `Failed to install dotenv: ${error}`;
      console.log(`⚠️  ${errorMsg}`);
      this.metadata.errors.push(errorMsg);
    }
  }

  saveMetadata() {
    const metadataPath = path.join(this.config.targetRoot, '.keykey-sync.json');
    try {
      fs.writeFileSync(metadataPath, JSON.stringify(this.metadata, null, 2));
      console.log(`📝 Metadata saved to ${metadataPath}`);
    } catch (error) {
      console.log(`⚠️  Failed to save metadata: ${error}`);
    }
  }

  getLastSyncInfo() {
    const metadataPath = path.join(this.config.targetRoot, '.keykey-sync.json');
    try {
      if (fs.existsSync(metadataPath)) {
        return JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      }
    } catch (error) {
      console.log(`⚠️  Failed to read sync metadata: ${error}`);
    }
    return null;
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'sync';
  
  const keykey = new KeyKey({
    requireConfirmation: args.includes('--confirm'),
    backupExisting: !args.includes('--no-backup'),
    logMetadata: !args.includes('--no-log')
  });

  switch (command) {
    case 'preview':
      keykey.previewSync();
      break;
      
    case 'sync':
      keykey.syncEnvFiles().catch(console.error);
      break;
      
    case 'status':
      const lastSync = keykey.getLastSyncInfo();
      if (lastSync) {
        console.log('📊 Last Sync Information:');
        console.log(`   Timestamp: ${lastSync.timestamp}`);
        console.log(`   Files synced: ${lastSync.files.filter(f => f.synced).length}`);
        console.log(`   Errors: ${lastSync.errors.length}`);
      } else {
        console.log('ℹ️  No sync history found');
      }
      break;
      
    default:
      console.log('Usage: node agents/keykey.cjs [sync|preview|status] [--confirm] [--no-backup] [--no-log]');
  }
}

module.exports = KeyKey;