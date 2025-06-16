// ai-analytics-platform: Local Monorepo Root Reporter
// Usage: node scripts/monorepo-root-reporter.js

const path = require('path');

function printMonorepoRoot() {
  // Canonical local path for this monorepo
  const monorepoRoot = path.resolve(__dirname, '..');
  console.log('Monorepo Root Path:');
  console.log(monorepoRoot);
}

if (require.main === module) {
  printMonorepoRoot();
}

module.exports = { printMonorepoRoot };
