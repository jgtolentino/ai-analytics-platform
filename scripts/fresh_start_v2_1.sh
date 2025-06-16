#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------
#  Fresh Start from v2.1 baseline
#  --------------------------------------------
#
# 1. Archives all v3 work           → backup/v3-all-versions
# 2. Tags current state             → archive/pre-restart-YYYYMMDD
# 3. Checks out clean v2.1 branch   → v2.1-fresh-start
# --------------------------------------------

# CONFIG ───────────────────────────────────────
V21_COMMIT="${V21_COMMIT:-""}"   # export beforehand or pass via CLI
[[ -z "$V21_COMMIT" ]] && { echo "❌  export V21_COMMIT=<hash>"; exit 1; }

# STEP 1  –  Archive v3 work
git tag -a "archive/pre-restart-$(date +%Y%m%d)" -m "Archive before v2.1 restart"
git push origin --tags
git branch backup/v3-all-versions
git push origin backup/v3-all-versions

# STEP 2  –  Fresh branch from v2.1
git checkout -B v2.1-fresh-start "$V21_COMMIT"

# STEP 3  –  Hard reset, purge node modules
git clean -fdx
git reset --hard
rm -rf node_modules package-lock.json

# STEP 4  –  Install deps + verify baseline build
npm install
npm run build
npm test

# STEP 5  –  Baseline doc
cat > FRESH_START.md <<EOF
# Scout Analytics v2.1 – Fresh Start

## Baseline Features
- Core analytics dashboard
- Basic KPI tracking

## Version History
- v2.1: Last stable baseline ($(date '+%Y-%m-%d'))
- v3.x: Archived

## Next Steps
- [ ] Fix CI/CD pipeline
- [ ] Add real-time data API
- [ ] Deploy clean version
EOF

git add FRESH_START.md
git commit -m "docs: fresh start from v2.1 baseline"

echo "✅  Fresh branch v2.1-fresh-start ready."