#!/bin/bash

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🚀 M1 Deep Clean & Optimization v2.0                     ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Track metrics before cleanup
BEFORE_CACHE=$(du -sm node_modules/.cache node_modules/.vite .vite 2>/dev/null | awk '{sum+=$1} END {print sum}')
BEFORE_CACHE=${BEFORE_CACHE:-0}

# ─────────────────────────────────────────
# 1. Kill Stuck Processes
# ─────────────────────────────────────────
echo "🔪 Killing stuck processes..."
pkill -9 -f "vite" 2>/dev/null || true
pkill -9 -f "chokidar" 2>/dev/null || true
pkill -9 -f "esbuild" 2>/dev/null || true
pkill -9 -f "tsc --watch" 2>/dev/null || true
pkill -9 -f "eslint_d" 2>/dev/null || true
pkill -9 -f "prettierd" 2>/dev/null || true
echo "   ✅ Done"

# ─────────────────────────────────────────
# 2. Clear ALL Caches
# ─────────────────────────────────────────
echo ""
echo "🧹 Clearing all development caches..."

# Vite/Build caches
rm -rf node_modules/.cache 2>/dev/null
rm -rf node_modules/.vite 2>/dev/null
rm -rf .vite 2>/dev/null
rm -rf dist 2>/dev/null
rm -rf dist-ssr 2>/dev/null
rm -rf build 2>/dev/null
rm -rf .next 2>/dev/null
rm -rf .nuxt 2>/dev/null
rm -rf .output 2>/dev/null

# TypeScript caches
rm -rf *.tsbuildinfo 2>/dev/null
rm -rf tsconfig.tsbuildinfo 2>/dev/null
rm -rf .tsbuildinfo 2>/dev/null

# Linter caches
rm -rf .eslintcache 2>/dev/null
rm -rf .stylelintcache 2>/dev/null

# Test caches
rm -rf coverage 2>/dev/null
rm -rf .nyc_output 2>/dev/null
rm -rf .jest 2>/dev/null

# Other build tools
rm -rf .parcel-cache 2>/dev/null
rm -rf .turbo 2>/dev/null

# Temp & logs
rm -rf tmp .tmp 2>/dev/null
rm -rf *.log 2>/dev/null
rm -rf npm-debug.log* 2>/dev/null
rm -rf yarn-error.log* 2>/dev/null

echo "   ✅ Caches cleared"

# ─────────────────────────────────────────
# 3. Clear System Caches
# ─────────────────────────────────────────
echo ""
echo "🗑️  Clearing system caches..."

# npm cache
npm cache clean --force 2>/dev/null || true

# Clear user caches (safe to delete)
rm -rf ~/Library/Caches/com.apple.dt.Xcode 2>/dev/null || true
rm -rf ~/Library/Caches/typescript 2>/dev/null || true

echo "   ✅ System caches cleared"

# ─────────────────────────────────────────
# 4. Prune & Dedupe Dependencies
# ─────────────────────────────────────────
echo ""
echo "📦 Optimizing node_modules..."
npm prune 2>/dev/null || true
npm dedupe 2>/dev/null || true
echo "   ✅ Dependencies optimized"

# ─────────────────────────────────────────
# 5. Flush DNS
# ─────────────────────────────────────────
echo ""
echo "🌐 Flushing DNS cache..."
dscacheutil -flushcache 2>/dev/null || true
sudo killall -HUP mDNSResponder 2>/dev/null || true
echo "   ✅ DNS flushed"

# ─────────────────────────────────────────
# 6. Free Memory
# ─────────────────────────────────────────
echo ""
echo "🧠 Requesting memory cleanup..."
# Trigger macOS memory compression/cleanup
sudo purge 2>/dev/null || purge 2>/dev/null || true
echo "   ✅ Memory cleanup requested"

# ─────────────────────────────────────────
# RESULTS
# ─────────────────────────────────────────
AFTER_CACHE=$(du -sm node_modules/.cache node_modules/.vite .vite 2>/dev/null | awk '{sum+=$1} END {print sum}')
AFTER_CACHE=${AFTER_CACHE:-0}
FREED=$((BEFORE_CACHE - AFTER_CACHE))

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✨ Deep Clean Complete!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📊 Results:"
echo "   • Cache before: ${BEFORE_CACHE}MB"
echo "   • Cache after:  ${AFTER_CACHE}MB"
echo "   • Space freed:  ~${FREED}MB"
echo ""
echo "💡 M1 Performance Tips:"
echo "   • Keep browser tabs minimal (< 10)"
echo "   • Close Slack/Discord when not needed"
echo "   • Run this weekly or when sluggish"
echo "   • Restart Mac once a week for best performance"
echo ""
