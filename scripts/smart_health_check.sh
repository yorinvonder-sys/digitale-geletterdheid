#!/bin/bash

# smart_health_check.sh
# Comprehensive M1 optimization with all enhancements
# Features: Memory pressure, browser cleanup, thermal monitoring, disk check,
#           DNS flush, light cleanup, adaptive thresholds, app closing

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🩺 Smart Health Check v2.0 (Full Optimization)           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "⏰ $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# ═══════════════════════════════════════════════════════════════
# ADAPTIVE THRESHOLDS (Tighter during work hours 9-18)
# ═══════════════════════════════════════════════════════════════
CURRENT_HOUR=$(date +%H)
if [ "$CURRENT_HOUR" -ge 9 ] && [ "$CURRENT_HOUR" -le 18 ]; then
    LOAD_THRESHOLD=3.0      # Tighter during work
    SWAP_THRESHOLD=500      # MB
    CACHE_THRESHOLD=300     # MB
    DISK_THRESHOLD=90       # %
    echo "📅 Mode: Work Hours (tighter thresholds)"
else
    LOAD_THRESHOLD=5.0
    SWAP_THRESHOLD=1000
    CACHE_THRESHOLD=500
    DISK_THRESHOLD=95
    echo "🌙 Mode: Off-Hours (relaxed thresholds)"
fi
echo ""

ISSUES_FOUND=0
CRITICAL_ISSUES=0

# ═══════════════════════════════════════════════════════════════
# 1. CPU LOAD CHECK
# ═══════════════════════════════════════════════════════════════
LOAD_AVG=$(sysctl -n vm.loadavg | awk '{print $2}')
IS_HIGH_LOAD=$(echo "$LOAD_AVG > $LOAD_THRESHOLD" | bc -l)

echo "📊 CPU Load: $LOAD_AVG (threshold: $LOAD_THRESHOLD)"
if [ "$IS_HIGH_LOAD" -eq 1 ]; then
    echo "   ⚠️  HIGH"
    ISSUES_FOUND=1
else
    echo "   ✅ Normal"
fi

# ═══════════════════════════════════════════════════════════════
# 2. MEMORY PRESSURE CHECK (macOS native)
# ═══════════════════════════════════════════════════════════════
echo ""
# Get memory pressure level from vm_stat
FREE_PAGES=$(vm_stat | grep "Pages free" | awk '{print $3}' | sed 's/\.//')
TOTAL_PAGES=$(sysctl -n hw.memsize)
FREE_MB=$((FREE_PAGES * 4096 / 1024 / 1024))

if [ "$FREE_MB" -gt 1000 ]; then
    echo "🧠 Free Memory: ${FREE_MB}MB ✅ Healthy"
elif [ "$FREE_MB" -gt 500 ]; then
    echo "🧠 Free Memory: ${FREE_MB}MB ⚠️ Low"
    ISSUES_FOUND=1
else
    echo "🧠 Free Memory: ${FREE_MB}MB 🔴 Critical"
    ISSUES_FOUND=1
    CRITICAL_ISSUES=1
fi

# Also check swap
SWAP_INFO=$(sysctl -n vm.swapusage)
SWAP_USED=$(echo "$SWAP_INFO" | awk '{print $6}' | sed 's/M//' | cut -d'.' -f1)
echo "💾 Swap Usage: ${SWAP_USED}MB (threshold: ${SWAP_THRESHOLD}MB)"
if [ "$SWAP_USED" -gt "$SWAP_THRESHOLD" ]; then
    echo "   ⚠️  HIGH"
    ISSUES_FOUND=1
else
    echo "   ✅ Normal"
fi

# ═══════════════════════════════════════════════════════════════
# 3. TEMPERATURE CHECK (M1 thermal throttling)
# ═══════════════════════════════════════════════════════════════
echo ""
# Check thermal state without sudo
THERMAL_STATE=$(pmset -g therm 2>/dev/null | grep -i "speed_limit" | awk -F'=' '{print $2}' | tr -d ' ')
if [ -n "$THERMAL_STATE" ] && [ "$THERMAL_STATE" -lt 100 ] 2>/dev/null; then
    echo "🌡️  Thermal: ⚠️  CPU throttled to ${THERMAL_STATE}%"
    ISSUES_FOUND=1
else
    echo "🌡️  Thermal: ✅ Normal (no throttling)"
fi

# ═══════════════════════════════════════════════════════════════
# 4. DISK SPACE CHECK
# ═══════════════════════════════════════════════════════════════
echo ""
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
echo "💿 Disk Usage: ${DISK_USAGE}% (threshold: ${DISK_THRESHOLD}%)"
if [ "$DISK_USAGE" -gt "$DISK_THRESHOLD" ]; then
    echo "   ⚠️  LOW SPACE - Consider cleaning up"
    ISSUES_FOUND=1
else
    echo "   ✅ Sufficient space"
fi

# ═══════════════════════════════════════════════════════════════
# 5. CACHE SIZE CHECK
# ═══════════════════════════════════════════════════════════════
echo ""
echo "📁 Cache Analysis:"

TOTAL_CACHE=0

if [ -d "node_modules/.cache" ]; then
    SIZE=$(du -sm node_modules/.cache 2>/dev/null | awk '{print $1}')
    echo "   • node_modules/.cache: ${SIZE}MB"
    TOTAL_CACHE=$((TOTAL_CACHE + SIZE))
fi

if [ -d "node_modules/.vite" ]; then
    SIZE=$(du -sm node_modules/.vite 2>/dev/null | awk '{print $1}')
    echo "   • node_modules/.vite: ${SIZE}MB"
    TOTAL_CACHE=$((TOTAL_CACHE + SIZE))
fi

if [ -d ".vite" ]; then
    SIZE=$(du -sm .vite 2>/dev/null | awk '{print $1}')
    echo "   • .vite: ${SIZE}MB"
    TOTAL_CACHE=$((TOTAL_CACHE + SIZE))
fi

echo "   📊 Total: ${TOTAL_CACHE}MB (threshold: ${CACHE_THRESHOLD}MB)"

if [ "$TOTAL_CACHE" -gt "$CACHE_THRESHOLD" ]; then
    echo "   ⚠️  Caches are bloated"
    ISSUES_FOUND=1
else
    echo "   ✅ Caches are reasonable"
fi

# ═══════════════════════════════════════════════════════════════
# 6. PROCESS CHECK
# ═══════════════════════════════════════════════════════════════
echo ""
echo "🔍 Process Check:"

VITE_PROCS=$(pgrep -f "vite" 2>/dev/null | wc -l | tr -d ' ')
NODE_PROCS=$(pgrep -f "node" 2>/dev/null | wc -l | tr -d ' ')
CHROME_PROCS=$(pgrep -f "Google Chrome" 2>/dev/null | wc -l | tr -d ' ')

echo "   • Vite: $VITE_PROCS | Node: $NODE_PROCS | Chrome: $CHROME_PROCS"

if [ "$VITE_PROCS" -gt 3 ]; then
    echo "   ⚠️  Too many Vite processes"
    ISSUES_FOUND=1
fi

if [ "$CHROME_PROCS" -gt 20 ]; then
    echo "   ⚠️  Chrome has many processes (tabs?)"
    ISSUES_FOUND=1
fi

# ═══════════════════════════════════════════════════════════════
# CLEANUP FUNCTIONS
# ═══════════════════════════════════════════════════════════════

kill_chrome_helpers() {
    echo ""
    echo "🌐 Killing Chrome Helper processes..."
    
    KILLED=0
    MEMORY_THRESHOLD=500  # Kill helpers using >500MB
    
    # Find and kill Chrome Helper processes using excessive memory
    while read -r line; do
        if [ -n "$line" ]; then
            PID=$(echo "$line" | awk '{print $1}')
            MEM_MB=$(echo "$line" | awk '{print $2}')
            
            if [ "${MEM_MB%.*}" -gt "$MEMORY_THRESHOLD" ] 2>/dev/null; then
                kill -9 "$PID" 2>/dev/null && KILLED=$((KILLED + 1))
            fi
        fi
    done < <(ps -eo pid,rss,comm 2>/dev/null | grep -i "Helper" | grep -i "Chrome" | awk '{print $1, $2/1024}')
    
    if [ "$KILLED" -gt 0 ]; then
        echo "   ✅ Killed $KILLED Chrome helper(s)"
    else
        echo "   ✅ No bloated Chrome helpers found"
    fi
}

close_unnecessary_apps() {
    echo ""
    echo "🔪 Closing unnecessary applications..."
    
    APPS_TO_CLOSE=(
        "Spotify" "Music" "Podcasts" "TV" "Books" "News"
        "Slack" "Discord" "Microsoft Teams" "zoom.us"
        "WhatsApp" "Telegram" "Messages" "FaceTime"
        "Mail" "Stocks" "Home" "App Store"
        "Figma" "Notion" "Obsidian"
        "Preview" "QuickTime Player" "Photos"
    )
    
    CLOSED=0
    for app in "${APPS_TO_CLOSE[@]}"; do
        if pgrep -x "$app" > /dev/null 2>&1; then
            osascript -e "tell application \"$app\" to quit" 2>/dev/null && CLOSED=$((CLOSED + 1))
        fi
    done
    
    echo "   ✅ Closed $CLOSED app(s)"
}

close_browser_tabs() {
    echo ""
    echo "🌐 Cleaning browser tabs..."
    
    # Close non-localhost Chrome tabs (keeps dev server tabs)
    osascript 2>/dev/null <<'EOF'
tell application "Google Chrome"
    if it is running then
        set windowCount to count of windows
        repeat with w from 1 to windowCount
            set tabCount to count of tabs of window w
            repeat with t from tabCount to 1 by -1
                set tabURL to URL of tab t of window w
                if tabURL does not contain "localhost" and tabURL does not contain "127.0.0.1" then
                    close tab t of window w
                end if
            end repeat
        end repeat
    end if
end tell
EOF
    
    # Close Safari tabs
    osascript 2>/dev/null <<'EOF'
tell application "Safari"
    if it is running then
        close every tab of every window
    end if
end tell
EOF
    
    echo "   ✅ Browser tabs cleaned (kept localhost)"
}

flush_dns_cache() {
    echo ""
    echo "🌐 Flushing DNS cache..."
    # Run without sudo to avoid password prompts
    dscacheutil -flushcache 2>/dev/null || true
    killall -HUP mDNSResponder 2>/dev/null || true
    echo "   ✅ DNS cache flushed"
}

light_cleanup() {
    echo ""
    echo "🧹 Running light cleanup (preventive)..."
    
    # Clear only the most problematic caches
    rm -rf node_modules/.cache 2>/dev/null
    rm -rf .eslintcache 2>/dev/null
    rm -rf *.log 2>/dev/null
    
    echo "   ✅ Light cleanup complete"
}

deep_cleanup() {
    echo ""
    echo "🔧 Running deep cleanup..."
    ./scripts/optimize_m1.sh
}

# ═══════════════════════════════════════════════════════════════
# DECISION ENGINE
# ═══════════════════════════════════════════════════════════════
echo ""
echo "═══════════════════════════════════════════════════════════"

if [ "$CRITICAL_ISSUES" -eq 1 ]; then
    echo "🔴 CRITICAL issues detected! Running FULL cleanup..."
    echo "═══════════════════════════════════════════════════════════"
    kill_chrome_helpers
    close_unnecessary_apps
    close_browser_tabs
    flush_dns_cache
    deep_cleanup
    
elif [ "$ISSUES_FOUND" -eq 1 ]; then
    echo "🟡 Issues detected. Running targeted cleanup..."
    echo "═══════════════════════════════════════════════════════════"
    kill_chrome_helpers
    close_unnecessary_apps
    light_cleanup
    flush_dns_cache
    
else
    echo "✨ System is Healthy!"
    echo "═══════════════════════════════════════════════════════════"
    
    # Run light preventive cleanup anyway (every 30 min based on timestamp)
    MINUTE=$(date +%M)
    if [ "$MINUTE" -lt 10 ] || [ "$MINUTE" -gt 50 ]; then
        echo ""
        echo "🔄 Running preventive light cleanup..."
        light_cleanup
    fi
fi

echo ""
echo "💡 Next check in 10 minutes"
echo ""
