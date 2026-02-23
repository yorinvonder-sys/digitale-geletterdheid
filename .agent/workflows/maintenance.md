---
description: Perform system health checks and cleanup to prevent memory issues.
---

# Maintenance & Health Check

This workflow checks the health of the development environment and performs cleanup if necessary.

1. **Check System Health**
   Run the project's doctor script to check for common issues.
   ```bash
   npm run doctor
   ```

2. **Cleanup Environment**
   If the system feels sluggish or there are memory issues, run the cleanup script.
   // turbo
   ```bash
   npm run clean
   ```

3. **Verify**
   Ensure that the application can start up correctly after cleanup.
   ```bash
   npm run build
   ```
