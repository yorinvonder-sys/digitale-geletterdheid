# Website Security Hardening Baseline - 2026-06-25

## Scope

This pass measures and improves the practical website security posture for DGSkills. It covers the public Vercel site, dependency audit status, Supabase Edge Function boundary checks, prompt-sanitizer parity, and one low-coupling data-minimization improvement.

It does not include a full penetration test, production database migration, secret rotation, or live Supabase configuration change.

## Baseline Findings

- `npm run context:budget` passed and reported a large dirty worktree; security changes were kept isolated.
- `npm run audit:security` initially failed on `dompurify@3.4.2`, where the advisory range included `<=3.4.10`.
- `scripts/security-report-core-check.mjs` initially failed because it assumed the 2026 core auth/RLS migration was still the latest migration.
- `curl -I https://dgskills.app` and `curl -I https://www.dgskills.app` returned strong static headers: CSP, HSTS, frame denial, nosniff, referrer policy, permissions policy, COOP, and CORP.
- The same live static HTML responses also returned `Access-Control-Allow-Origin: *`. No matching wildcard was found in `vercel.json` or Edge Function source. This is treated as a public-static hosting nuance, not as evidence that authenticated Edge Function CORS is wildcarded.

## Changes Made

- Bumped DOMPurify to `^3.4.11`, resolving the dependency audit finding.
- Added `npm run security:check`.
- Updated the core security migration check so it locates the named auth/RLS remediation migration instead of assuming it is the newest migration.
- Added a website security posture check for:
  - DOMPurify resolved version.
  - Vercel security headers and CSP shape.
  - Edge Function CORS guard coverage.
  - Approved public Edge Function exceptions and their compensating controls.
  - Client/server prompt sanitizer parity.
  - A targeted no-`select('*')` assertion for live student activity fetches.
- Replaced the live student activity history `select('*')` with explicit fields used by the modal.

## Remaining Risk

- The public static site still needs live verification after deployment to confirm whether Vercel can override the platform/static `Access-Control-Allow-Origin: *` header without duplicate headers. Until proven, public claims should say Edge Functions use a production CORS allowlist; static public pages may expose broad public CORS headers.
- The repository still has many existing `select('*')` reads. This commit measures and starts reducing that risk, but broader data-minimization should be handled in smaller follow-up commits by feature area.
- CSP still allows inline styles for the current styling approach. Script execution remains restricted to `script-src 'self'`; removing style inline allowance is a separate UI/CSP refactor.

## Proof Commands

Run these before claiming the hardening is complete:

```bash
npm run context:budget
npm run audit:security
npm run security:check
npm run doctor
npm run typecheck:edge
npm run check:ai-usage
node scripts/check-csv-export-safety.mjs
npm run build:prod
curl -I https://dgskills.app
curl -I https://www.dgskills.app
```
