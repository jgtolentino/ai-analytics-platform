#!/usr/bin/env bash
set -euo pipefail
ALLOW=$(yq '.cross_repo_allowed[]' .pulserrc)
for dir in packages/agents/* ; do
  agent=$(basename "$dir")
  [[ "$(echo "$ALLOW" | grep -qx "$agent" && echo allow || echo deny)" = "deny" ]] || { echo "skip $agent"; continue; }
  actual=$(tar -cf - "$dir" | sha256sum | awk '{print $1}')
  expect=$(yq ".agent_lock.${agent}" .pulserrc | cut -d: -f2)
  [[ "$actual" == "$expect" ]] || { echo "::error ::Hash mismatch for $agent"; exit 1; }
done
echo "✔ all locks ok"