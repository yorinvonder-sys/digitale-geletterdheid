#!/bin/bash

# Configuration
INTERVAL_SECONDS=600 # 10 minutes
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🔄 Auto-Maintenance Daemon v2.0                          ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "⏱️  Health check interval: $((INTERVAL_SECONDS / 60)) minutes"
echo "📁 Working directory: $SCRIPT_DIR/.."
echo ""

# Change to project directory
cd "$SCRIPT_DIR/.." || exit 1

# Start watchdog in background if not already running
if ! pgrep -f "watchdog.sh" > /dev/null 2>&1; then
    echo "🛡️  Starting Watchdog Monitor..."
    nohup "$SCRIPT_DIR/watchdog.sh" > /tmp/watchdog.log 2>&1 &
    echo "   ✅ Watchdog started (PID $!)"
else
    echo "🛡️  Watchdog already running"
fi

echo ""
echo "🚀 Daemon active. Running first health check..."
echo ""

while true; do
    "$SCRIPT_DIR/smart_health_check.sh"
    
    echo ""
    echo "💤 Sleeping for $((INTERVAL_SECONDS / 60)) minutes..."
    echo "─────────────────────────────────────────────────────────────"
    
    sleep $INTERVAL_SECONDS
done
