#!/bin/bash

# watchdog.sh
# Continuous process monitoring - kills runaway processes and Chrome helpers
# Runs every 30 seconds for real-time protection

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🛡️  Watchdog Monitor v1.0                                 ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "⏰ Started at $(date '+%Y-%m-%d %H:%M:%S')"
echo "🔄 Checking every 30 seconds..."
echo ""

# Thresholds
CPU_THRESHOLD=80        # Kill processes using >80% CPU
MEMORY_THRESHOLD=1500   # Kill Chrome helpers using >1.5GB
CHECK_INTERVAL=30       # Seconds between checks

# Log file
LOG_FILE="/tmp/watchdog.log"

log_action() {
    echo "[$(date '+%H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# ═══════════════════════════════════════════════════════════════
# CHROME HELPER KILLER
# Chrome Helper processes are notorious for memory leaks
# ═══════════════════════════════════════════════════════════════
kill_chrome_helpers() {
    local KILLED=0
    
    # Find Chrome Helper processes using excessive memory (>1.5GB = 1500MB)
    # ps output: USER PID %CPU %MEM VSZ RSS COMMAND
    while read -r line; do
        if [ -n "$line" ]; then
            PID=$(echo "$line" | awk '{print $1}')
            MEM_MB=$(echo "$line" | awk '{print $2}')
            
            if [ "$MEM_MB" -gt "$MEMORY_THRESHOLD" ] 2>/dev/null; then
                log_action "🔪 Killing Chrome Helper (PID $PID) using ${MEM_MB}MB"
                kill -9 "$PID" 2>/dev/null && KILLED=$((KILLED + 1))
            fi
        fi
    done < <(ps -eo pid,rss,comm 2>/dev/null | grep -i "Chrome Helper" | awk '{print $1, $2/1024}')
    
    # Also kill "Google Chrome Helper (Renderer)" processes over threshold
    while read -r line; do
        if [ -n "$line" ]; then
            PID=$(echo "$line" | awk '{print $1}')
            MEM_MB=$(echo "$line" | awk '{print $2}')
            
            if [ "$MEM_MB" -gt "$MEMORY_THRESHOLD" ] 2>/dev/null; then
                log_action "🔪 Killing Chrome Renderer (PID $PID) using ${MEM_MB}MB"
                kill -9 "$PID" 2>/dev/null && KILLED=$((KILLED + 1))
            fi
        fi
    done < <(ps -eo pid,rss,comm 2>/dev/null | grep -i "Renderer" | awk '{print $1, $2/1024}')
    
    if [ "$KILLED" -gt 0 ]; then
        log_action "✅ Killed $KILLED Chrome helper process(es)"
    fi
}

# ═══════════════════════════════════════════════════════════════
# RUNAWAY PROCESS KILLER
# Kill any process using excessive CPU for extended periods
# ═══════════════════════════════════════════════════════════════
kill_runaway_processes() {
    local KILLED=0
    
    # Find processes using >80% CPU (excluding system processes)
    while read -r line; do
        if [ -n "$line" ]; then
            PID=$(echo "$line" | awk '{print $1}')
            CPU=$(echo "$line" | awk '{print $2}' | cut -d'.' -f1)
            COMMAND=$(echo "$line" | awk '{print $3}')
            
            # Skip essential processes
            if [[ "$COMMAND" == *"kernel"* ]] || \
               [[ "$COMMAND" == *"launchd"* ]] || \
               [[ "$COMMAND" == *"WindowServer"* ]] || \
               [[ "$COMMAND" == *"Cursor"* ]] || \
               [[ "$COMMAND" == *"Code"* ]] || \
               [[ "$COMMAND" == *"node"* && "$CPU" -lt 90 ]]; then
                continue
            fi
            
            if [ "$CPU" -gt "$CPU_THRESHOLD" ] 2>/dev/null; then
                log_action "🔪 Killing runaway process: $COMMAND (PID $PID) at ${CPU}% CPU"
                kill -9 "$PID" 2>/dev/null && KILLED=$((KILLED + 1))
            fi
        fi
    done < <(ps -eo pid,%cpu,comm 2>/dev/null | tail -n +2 | sort -k2 -rn | head -20)
    
    if [ "$KILLED" -gt 0 ]; then
        log_action "✅ Killed $KILLED runaway process(es)"
    fi
}

# ═══════════════════════════════════════════════════════════════
# MEMORY PRESSURE RELIEF
# Quick memory check and light cleanup if critical
# ═══════════════════════════════════════════════════════════════
check_memory_pressure() {
    FREE_PAGES=$(vm_stat | grep "Pages free" | awk '{print $3}' | sed 's/\.//')
    FREE_MB=$((FREE_PAGES * 4096 / 1024 / 1024))
    
    if [ "$FREE_MB" -lt 200 ]; then
        log_action "🔴 Critical memory: ${FREE_MB}MB free - triggering cleanup"
        
        # Kill Chrome helpers aggressively
        pkill -9 -f "Chrome Helper" 2>/dev/null || true
        
        # Clear caches
        rm -rf node_modules/.cache 2>/dev/null
        
        log_action "✅ Emergency cleanup complete"
    fi
}

# ═══════════════════════════════════════════════════════════════
# MAIN WATCHDOG LOOP
# ═══════════════════════════════════════════════════════════════
echo "🛡️  Watchdog active. Press Ctrl+C to stop."
echo ""

while true; do
    # Run all checks
    kill_chrome_helpers
    kill_runaway_processes
    check_memory_pressure
    
    # Wait for next check
    sleep $CHECK_INTERVAL
done
