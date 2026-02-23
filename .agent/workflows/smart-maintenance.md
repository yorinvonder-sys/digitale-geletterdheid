---
description: Check system health and perform smart maintenance if needed
---

# Smart Health Check & Maintenance

This workflow checks the system's vital signs (load, memory) and automatically performs a deep clean if performance issues are detected.

1. **Run Health Check**
   Executes the smart health check script. If issues are found, it triggers the optimization script.
   // turbo
   ```bash
   ./scripts/smart_health_check.sh
   ```
