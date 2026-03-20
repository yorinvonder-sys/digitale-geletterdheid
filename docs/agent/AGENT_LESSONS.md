# Agent Lessons — Mistake Log

> **Purpose:** Every time Claude makes a mistake that is corrected (by the user, Codex, or another AI), it is logged here permanently.
> Claude MUST read this file at the start of every session and apply all lessons below.
> This file is append-only — never delete or overwrite existing entries.

---

## HOW TO USE THIS FILE

At the start of every session, Claude must:
1. Read this entire file.
2. Apply all lessons before taking any action.
3. When a new mistake is corrected, append a new entry at the bottom immediately.

---

## LESSONS

---

### LESSON 001 — Background Subagents Cannot Write Files
**Date:** 2026-02-22
**Corrected by:** User (observed failure)
**Session context:** Security analysis + Firebase removal task

**Mistake:**
Claude launched a background general-purpose subagent (`subagent_type=general-purpose`, `run_in_background=true`) to perform file edits (removing Firebase references). The subagent was denied Edit and Write tool permissions because background agents inherit a sandboxed permission set — they only get `Read` and `Bash(grep:*)` etc., not `Edit` or `Write`.
The agent spent tokens analyzing files correctly but could not apply any changes.

**Correction:**
Claude (the main agent) had to manually apply all the changes itself after the subagent returned its findings.

**Rule going forward:**
- **NEVER delegate file editing (Edit/Write) tasks to background subagents.**
- Background agents are only useful for: research, reading files, grepping, exploring, analyzing.
- All actual file modifications must be done by the main Claude agent directly.
- If using subagents for research, instruct them to return a list of exact changes needed — then apply those changes yourself.

---

### LESSON 005 — Subagent Write-Restriction Confirmed on ALL Background Agents
**Date:** 2026-02-22
**Corrected by:** Tool error (repeated, second agent)
**Session context:** Security hardening agent (Agent 2 — CSP, security.txt, URL sanitizer, SECURITY.md)

**Mistake:**
A second background agent (`subagent_type=general-purpose`, `run_in_background=true`) was launched with write tasks despite LESSON 001 and LESSON 004 documenting this exact failure. The agent correctly read and planned all four changes but was again denied Edit and Write permissions.

**Correction:**
Main agent applied all four changes directly after the subagent returned its analysis.

**Reinforced rule:**
This confirms the pattern is consistent — ALL background general-purpose agents are sandboxed to read-only. There are no exceptions. Do not assign file-editing tasks to ANY background subagent under any circumstances.

---

### LESSON 006 — MCP Servers Belong in `.mcp.json`, NOT in `settings.local.json`
**Date:** 2026-02-22
**Corrected by:** Agent 3 discovery (schema validation rejection)
**Session context:** MCP server configuration for project

**Mistake:**
The task prompt instructed Agent 3 to put `mcpServers` inside `.claude/settings.local.json`. The Claude Code settings schema validator rejected this with `"Unrecognized field: mcpServers"`. The `settings.local.json` file only accepts known fields like `permissions`.

**Correction:**
The correct location for project-scoped MCP server configuration is `.mcp.json` at the **project root** (not inside `.claude/`). Claude Code reads this file automatically. Both files were created:
- `.mcp.json` — MCP server definitions with credential placeholders
- `.claude/MCP_SETUP.md` — Setup instructions for each server

**Rule going forward:**
- **MCP server config → `.mcp.json` at project root**
- **Permissions config → `.claude/settings.local.json`** (under `permissions.allow` / `permissions.deny`)
- These are two separate files with separate concerns — never mix them
- Add `.mcp.json` to `.gitignore` since it will contain real API keys once set up

---

### LESSON 002 — Always Read a File Before Writing It
**Date:** 2026-02-22
**Corrected by:** Tool error
**Session context:** Firebase removal — `.firebaserc` and `cors.json`

**Mistake:**
Claude called the `Write` tool on `.firebaserc` and `cors.json` without having read them first in the same session. The Write tool rejected both calls with: `"File has not been read yet. Read it first before writing to it."`

**Correction:**
Claude had to call `Read` on both files first, then retry the `Write` calls.

**Rule going forward:**
- Always call `Read` on a file before calling `Write` on it, even if the intent is to completely replace the contents.
- For `Edit`, also always `Read` first to confirm the exact string to match.
- Batch reads upfront before starting a sequence of writes.

---

### LESSON 003 — Firebase Was in More Files Than Initially Scanned
**Date:** 2026-02-22
**Corrected by:** Follow-up grep after initial cleanup
**Session context:** Firebase removal

**Mistake:**
After removing Firebase from the primary files (`.env.local`, `package.json`, `IctTechnisch.tsx`, `CookiePolicy.tsx`), a follow-up grep revealed Firebase references still existed in:
- `.env.production.template` — entire file was Firebase-only
- `vite.config.ts` — `.firebase/**` in `watch.ignored`, "Cloud Functions" in comment
- `tsconfig.json` — `.firebase` in `exclude` array (harmless cache dir, left intentionally)
- `lighthouse-reports/*.json` — historical reports (intentionally left, not source code)

**Correction:**
Claude ran a project-wide grep and cleaned up `.env.production.template` and `vite.config.ts`.

**Rule going forward:**
- After any "remove technology X" task, always run a final grep across all non-ignored file types:
  ```bash
  grep -r "firebase\|FIREBASE" . --include="*.ts" --include="*.tsx" --include="*.json" --include="*.env*" --include="*.md" --exclude-dir=node_modules --exclude-dir=.firebase -l
  ```
- Treat template files (`.env.production.template`) as source code — they must be updated.
- Treat comments in config files as source code — they must be updated to reflect reality.
- Historical reports and generated artifacts can be left as-is.

---

### LESSON 004 — Verify Subagent Scope Before Launching Parallel Agents
**Date:** 2026-02-22
**Corrected by:** User observation
**Session context:** Parallel agent launch for security hardening

**Mistake:**
Three agents were launched in parallel, but Agent 1 (Firebase removal) was assigned file-writing tasks that it could not complete due to sandboxed permissions (see LESSON 001). This wasted tokens and time.

**Correction:**
The main agent had to redo all of Agent 1's work manually.

**Rule going forward:**
- Parallel agents should only be used for: reading, researching, exploring, grepping, analyzing.
- Never assign parallel agents tasks that require Edit/Write.
- If parallel work is needed across multiple file edits, use TodoWrite to track them and apply the edits sequentially in the main agent.

---

### LESSON 007 — Never Fully Remove a Feature Library — Lazy-Load It Instead
**Date:** 2026-02-22
**Corrected by:** User (Sprint 8b restoration)
**Session context:** Performance optimisation — Three.js bundle size reduction

**Mistake:**
In Sprint 8a, Claude removed Three.js (`@react-three/fiber`, `@react-three/drei`) entirely from the project and replaced the 3D avatar system with a lightweight 2D SVG renderer (`AvatarViewer2D`). The goal was to eliminate the `vendor-three` chunk (~899 kB / 244 kB gzip) from the initial bundle.

This was wrong: 3D avatars are a core UX feature (AvatarSetup, UserProfile, ProjectZeroDashboard). Sprint 8b had to fully restore the Three.js stack with the solution that should have been used from the start: lazy-loading via `LazyAvatarViewer`.

**Correction:**
Three.js was restored in Sprint 8b, wrapped in a lazy-load boundary with a skeleton fallback. Initial-load performance was preserved (~85–87 Lighthouse score) and 3D UX was restored.

**Rule going forward:**
- **Never remove a library that powers a user-facing feature.** Bundle size must be solved with lazy-loading, not removal.
- Before removing any library in a performance sprint, ask: "Is this used for a user-facing feature?" If yes → lazy-load, never delete.
- The correct pattern: `const LazyComp = React.lazy(() => import('./HeavyComponent'))` with `<Suspense fallback={<Skeleton />}>`.

---

### LESSON 008 — Verify MCP Tool Free-Tier Availability Before Configuring
**Date:** 2026-02-22
**Corrected by:** Discovery during MCP setup (`.claude/MCP_SETUP.md`)
**Session context:** MCP server selection for research/search capability

**Mistake:**
Claude configured (or recommended) Brave Search as the MCP search tool for this project. Brave Search subsequently dropped its free API tier, making the MCP server unusable without a paid plan. Migration to Tavily was required after the fact.

**Correction:**
Brave Search MCP replaced with Tavily MCP (`npx tavily-mcp@latest`). Tavily provides 1,000 free searches/month. API key stored in macOS Keychain (service: `tavily-mcp-key`, account: `yorinvonder`).

**Rule going forward:**
- Before configuring any MCP tool with an external API, verify its free tier exists and is stable.
- **For search/research MCP in this project:** use Tavily — do NOT use Brave Search (free tier removed).
- Document all MCP choices and key-storage locations in `.claude/MCP_SETUP.md`.

---

### LESSON 009 — React StrictMode Calls useEffect Twice — Guard Against Double-Invocation
**Date:** 2026-02-22
**Corrected by:** User (broken MfaGate in development)
**Session context:** MFA gate implementation (`components/MfaGate.tsx`)

**Mistake:**
Claude implemented `MfaGate` with a `useEffect(() => { checkMfaStatus(); }, [])` that calls `enrollMfa()` (which calls `supabase.auth.mfa.enroll()`). In React development mode with StrictMode, every `useEffect` is intentionally called twice. The first call succeeded and generated the QR code. The second call failed because the TOTP factor already existed — setting an error state while the QR code was already displayed. The user saw a valid QR code alongside an "MFA activeren mislukt: Unexpected failure" error, making it appear broken.

**Correction:**
Added a `useRef` guard (`initiated`) to prevent the effect body from running more than once:
```typescript
const initiated = React.useRef(false);
useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;
    checkMfaStatus();
}, []);
```

**Rule going forward:**
- **Any `useEffect` that triggers an irreversible side-effect (API write, enrollment, payment, email send) MUST be guarded with a `useRef` flag** to prevent React StrictMode double-invocation.
- Pattern: `const initiated = React.useRef(false);` → `if (initiated.current) return; initiated.current = true;` at the top of the effect body.
- This pattern is required for: MFA enrollment, user onboarding triggers, analytics events, any "create once" API calls.
- StrictMode only runs double-effects in development, but the guard must always be present because removing StrictMode is not an acceptable fix.

---

### LESSON 010 — This Project Has No Git Repo — Vercel CLI Requires Manual Setup Each Time
**Date:** 2026-02-22
**Corrected by:** User (failed deployment attempts)
**Session context:** Deploying to dgskills.app via Vercel CLI

**Mistake:**
Claude attempted `npx vercel --prod --yes` without first linking the project. Because the local folder (`ai-lab---future-architect`) is not a git repository and has no `.vercel/project.json`, Vercel CLI tried to create a NEW project — failing because the folder name contains `---` (forbidden by Vercel). Then after linking with `--project dg-skills`, the upload hit the 100 MB size limit because `.vercelignore` did not exist and the folder contained a 222 MB zip archive (`future-architect-codebase.zip`) and `node_modules` (473 MB).

**Correction:**
1. `npx vercel link --project dg-skills --yes` — links local folder to the existing Vercel project
2. Created `.vercelignore` excluding `node_modules`, `dist`, `*.zip`, `business`, `Regelgeving`, `guides`, `.claude`, `Printinstructies`, `SLO-doelen` — **keeping `scripts/`** (required for build: `prerender.mjs`, `sync-dev-docs.mjs`)
3. `npx vercel --prod --yes` — successful deployment

**Rule going forward:**
- This project has NO git repository. Vercel CI/CD auto-deploy is NOT active.
- Every deployment requires: (1) verify `.vercel/project.json` exists, (2) run `npx vercel --prod --yes`.
- The `.vercelignore` file is already in place — do not remove it.
- The `scripts/` folder MUST be uploaded (required for `build:prod`). Do NOT add it to `.vercelignore`.
- The `future-architect-codebase.zip` in the project root MUST stay in `.vercelignore` (`*.zip`).
- Always run `npm run build` locally first to catch errors before deploying.

---
