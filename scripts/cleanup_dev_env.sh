#!/bin/bash

# cleanup_dev_env.sh
# Kills lingering dev processes and cleans caches to free up memory.

echo "🧹 Starting Environment Cleanup..."

# 1. Kill specific lingering processes (be careful not to kill the current shell)
# We look for common dev tools that might get stuck
PROCESSES_TO_KILL=("vite" "next-server" "jest-worker" "ts-node" "playwright")

for proc in "${PROCESSES_TO_KILL[@]}"; do
    echo "   Running kill check for: $proc"
    # Find PIDs, excluding the grep process and the current script
    pids=$(ps aux | grep "$proc" | grep -v "grep" | awk '{print $2}')
    
    if [ -n "$pids" ]; then
        echo "   Found lingering $proc processes: $pids. Terminating..."
        echo "$pids" | xargs kill -9
    fi
done

# 2. Kill lingering node processes started by the user (heuristic)
# This is more aggressive, use with care. We target node processes that are taking up a lot of memory 
# but aren't the main agent process (finding them by typical dev ports could be better, but simple is good for now)
# For now, we'll skip aggressive generic node killing to avoid killing the agent itself if it runs on node.

# 3. Clean Caches
echo "🧹 Cleaning Caches..."
rm -rf node_modules/.cache
rm -rf .next/cache
rm -rf .turbo

echo "✅ Cleanup Complete! You can now restart your dev server."
