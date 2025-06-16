#!/usr/bin/env bash
# Usage: scripts/lock-agent.sh <agent> [<agent> ...]
set -euo pipefail
for agent in "$@"; do
  dir="packages/agents/$agent"
  [[ -d "$dir" ]] || { echo "❌ $agent not found"; exit 1; }
  hash=$(tar -cf - "$dir" | sha256sum | awk '{print $1}')
  yq -i ".agent_lock.${agent} = \"sha256:${hash}\"" .pulserrc
  echo "🔒 Locked $agent @ ${hash}"
done