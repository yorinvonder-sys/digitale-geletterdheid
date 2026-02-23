---
description: Optimize development environment for M1 Macs (Deep Clean)
---

# M1 Optimization & Deep Clean

This workflow performs a deep clean of the development environment to resolve freezing issues and optimize performance on Apple Silicon.

1. **Detailed Optimization**
   Runs a script to clear Vite caches, prune node_modules, and reset the environment.
   // turbo
   ```bash
   chmod +x ./scripts/optimize_m1.sh && ./scripts/optimize_m1.sh
   ```

2. **Verify Environment**
   Checks if the environment is healthy after optimization.
   // turbo
   ```bash
   npm run doctor
   ```
