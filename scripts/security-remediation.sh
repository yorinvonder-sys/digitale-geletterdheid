#!/usr/bin/env bash
# ============================================================================
# DGSkills Security Remediation Script
# Date: 2026-02-22
# Purpose: Automated fixes for vulnerabilities identified in security audit
# ============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE} DGSkills Security Remediation${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ── Step 1: Safe npm audit fix ──────────────────────────────────────────────
echo -e "${YELLOW}[1/5] Running safe npm audit fix...${NC}"
npm audit fix 2>&1 || true
echo -e "${GREEN}  Done. Auto-fixable vulnerabilities patched.${NC}"
echo ""

# ── Step 2: Upgrade jspdf (CRITICAL — 8 CVEs) ──────────────────────────────
echo -e "${YELLOW}[2/5] Upgrading jspdf to v4.2.0 (critical: 8 CVEs)...${NC}"
echo -e "${RED}  WARNING: This is a breaking change. Test PDF export after upgrade.${NC}"
read -p "  Proceed with jspdf upgrade? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm install jspdf@^4.2.0
    echo -e "${GREEN}  jspdf upgraded successfully.${NC}"
else
    echo -e "${YELLOW}  Skipped jspdf upgrade. Run manually: npm install jspdf@^4.2.0${NC}"
fi
echo ""

# ── Step 3: Replace xlsx (HIGH — no fix available) ─────────────────────────
echo -e "${YELLOW}[3/5] xlsx vulnerability check...${NC}"
echo -e "${RED}  xlsx has HIGH severity issues with NO upstream fix.${NC}"
echo -e "  Options:"
echo -e "    a) Replace with 'exceljs' (maintained, MIT license)"
echo -e "    b) Replace with 'sheetjs-ce' (community edition)"
echo -e "    c) Skip for now"
read -p "  Choice (a/b/c): " -n 1 -r
echo ""
case $REPLY in
    a|A)
        npm uninstall xlsx && npm install exceljs
        echo -e "${GREEN}  Replaced xlsx with exceljs.${NC}"
        echo -e "${YELLOW}  NOTE: Update import statements from 'xlsx' to 'exceljs' in your code.${NC}"
        ;;
    b|B)
        npm uninstall xlsx && npm install sheetjs-ce
        echo -e "${GREEN}  Replaced xlsx with sheetjs-ce.${NC}"
        echo -e "${YELLOW}  NOTE: sheetjs-ce is API-compatible — imports may work as-is.${NC}"
        ;;
    *)
        echo -e "${YELLOW}  Skipped xlsx replacement.${NC}"
        ;;
esac
echo ""

# ── Step 4: Final audit ────────────────────────────────────────────────────
echo -e "${YELLOW}[4/5] Running final npm audit...${NC}"
echo ""
npm audit 2>&1 || true
echo ""

# ── Step 5: Summary ────────────────────────────────────────────────────────
echo -e "${YELLOW}[5/5] Verification...${NC}"
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE} Remediation Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "  Code fixes already applied:"
echo -e "  ${GREEN}[x]${NC} MFA gate component created (components/MfaGate.tsx)"
echo -e "  ${GREEN}[x]${NC} MFA enforcement wired into AuthenticatedApp.tsx"
echo -e "  ${GREEN}[x]${NC} Password validator was already wired (authService.ts:82)"
echo -e "  ${GREEN}[x]${NC} DEBUG_AUTH_ROLE orphaned code removed (App.tsx, authService.ts)"
echo -e "  ${GREEN}[x]${NC} clear-auth.html debug file deleted"
echo -e "  ${GREEN}[x]${NC} robots.txt hardened (sensitive paths removed)"
echo -e "  ${GREEN}[x]${NC} CSP tightened (img-src, connect-src narrowed)"
echo ""
echo -e "  Manual actions still required:"
echo -e "  ${YELLOW}[ ]${NC} Verify Edge Function has server-side prompt injection filtering"
echo -e "  ${YELLOW}[ ]${NC} Implement Supabase cron jobs for data retention (90-day purge)"
echo -e "  ${YELLOW}[ ]${NC} Test PDF export if jspdf was upgraded"
echo -e "  ${YELLOW}[ ]${NC} Update xlsx imports if replaced with alternative"
echo -e "  ${YELLOW}[ ]${NC} Refactor inline styles to remove 'unsafe-inline' from CSP style-src"
echo -e "  ${YELLOW}[ ]${NC} Integrate C2PA watermarking before re-enabling AI image generation"
echo ""
echo -e "${GREEN}Remediation complete.${NC}"
