---
description: Check if the M1 auto-maintenance script is running, and start it if not.
---
1. Check if the maintenance process is running
// turbo
2. If not running, start it in the background
// turbo
3. Verify it started

Command to check: `pgrep -f start_auto_maintenance.sh`
Command to start: `./scripts/start_auto_maintenance.sh &`
