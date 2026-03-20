# Agent Rules & Guidelines

> **MANDATORY:** Also read `AGENT_LESSONS.md` at the start of every session.
> It contains a running log of past mistakes and their corrections — apply all lessons before acting.

## Performance & Resource Constraints
- **Device**: MacBook Pro M1 (8GB RAM).
- **Constraint**: **NO SCREEN RECORDINGS**. The browser subagent's recording feature consumes excessive resources. 
    - **Action**: Do NOT embed video artifacts (`.webp`, `.mp4`) in `walkthrough.md` or other artifacts. 
    - **Action**: Minimize use of the `browser_subagent` for long sessions. Use `manual` verification where possible if confidence is high.
- **App Performance**: Ensure the web application remains performant. Avoid excessive `backdrop-filter` or complex 3D animations that could cause thermal throttling or lag on 8GB RAM.

## Conversation Management (MANDATORY)

### 10-Minute Check-In Rule
During long conversations, **every 10 minutes** you MUST:
1. **Notify the user** with a brief status update:
   - What has been accomplished
   - What is currently in progress
   - Estimated time remaining (if applicable)
   - Whether the conversation is getting long and might benefit from a fresh start

### Conversation Length Monitoring
- If a conversation exceeds **30 minutes** or **50+ tool calls**, recommend starting a fresh conversation to prevent memory issues.
- Always ask: "Should we continue or would you like me to summarize and start fresh?"

### Auto-Maintenance Integration
- The background maintenance daemon runs every 10 minutes automatically.
- If you notice sluggishness, inform the user and suggest running `/smart-maintenance`.

## Memory Management (CRITICAL)

### Session Start Check (MANDATORY)
At the **START of every session**, you MUST check swap usage:
```bash
sysctl vm.swapusage
```
- If **swap used > 1000 MB** (1GB), immediately run `/smart-maintenance` workflow.
- If swap is healthy, proceed with tasks.

### Periodic Monitoring
During long sessions (many tool calls), check memory every ~20 tool calls:
```bash
sysctl -n vm.swapusage | awk '{print $3}'
```
If swap exceeds 1GB, pause current work and run maintenance.

### Browser Cleanup (MANDATORY)
After using `browser_subagent`:
- Close all tabs opened during testing (navigate to `about:blank` or close).
- Keep only ONE active tab for verification purposes.
- Do NOT leave multiple localhost tabs open.

### Threshold Actions
| Swap Level | Action Required |
|------------|-----------------|
| < 500 MB   | ✅ Healthy - Continue |
| 500-1000 MB| ⚠️ Monitor closely |
| > 1000 MB  | 🚨 Run `/smart-maintenance` immediately |
| > 1500 MB  | 🔴 Recommend user restart Mac |

## System Maintenance
- **CRITICAL**: At the start of your session, check if the auto-maintenance daemon is running. 
    - **Action**: Run the workflow `/ensure-maintenance` (or check manually).
    - If `pgrep -f start_auto_maintenance.sh` returns nothing, execute `./scripts/start_auto_maintenance.sh &`.
- Run `./scripts/optimize_m1.sh` manually if you detect severe lag despite the daemon.
