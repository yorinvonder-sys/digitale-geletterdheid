# MCP Server Setup

Project-scoped MCP servers are configured in `.mcp.json` at the project root.
Claude Code reads this file automatically on session start.

---

## Supabase MCP
**Purpose:** Inspect RLS policies, run read-only DB queries, audit auth config, manage migrations.
**Runs:** `npx @supabase/mcp@latest --read-only`
**Key storage:** macOS Keychain — service `supabase-mcp-pat`, account `yorinvonder`
**Setup (first time):**
1. Go to https://supabase.com/dashboard/account/tokens and create a PAT
2. Store it: `security add-generic-password -U -a yorinvonder -s supabase-mcp-pat -w YOUR_PAT`

> The anon key in `.env.local` is NOT the right key here. You need a PAT from your account settings.
> Keys are read from macOS Keychain at runtime — `.mcp.json` contains no plaintext secrets.

---

## Sequential Thinking MCP
**Purpose:** Structured step-by-step reasoning for complex security analysis and architecture decisions.
**Runs:** `npx @modelcontextprotocol/server-sequential-thinking@latest`
**Setup:** No credentials needed — runs locally via npx.

---

## Filesystem MCP
**Purpose:** Structured file access scoped to the project root for Claude during agentic tasks.
**Runs:** `npx @modelcontextprotocol/server-filesystem@latest <project-root>`
**Setup:** No credentials needed.

---

## Tavily MCP
**Purpose:** Research CVEs, security advisories, and npm package vulnerabilities during security audits.
**Runs:** `npx tavily-mcp@latest`
**Free tier:** 1,000 searches/month
**Key storage:** macOS Keychain — service `tavily-mcp-key`, account `yorinvonder`
**Setup (first time):**
1. Sign up at https://tavily.com and get your API key
2. Store it: `security add-generic-password -U -a yorinvonder -s tavily-mcp-key -w YOUR_KEY`

> Brave Search dropped its free tier — Tavily replaced it.
> Keys are read from macOS Keychain at runtime — `.mcp.json` contains no plaintext secrets.

---

## GitHub MCP
**Purpose:** PRs aanmaken/reviewen, issues beheren, CI-status checken, repo-structuur inspecteren.
**Runs:** `npx @modelcontextprotocol/server-github`
**Key storage:** `~/.config/claude-mcp/github-pat` (chmod 600)
**Setup (first time):**
1. Ga naar https://github.com/settings/personal-access-tokens/new en maak een Fine-grained PAT:
   - **Token name:** `claude-code-dgskills`
   - **Repository access:** `yorinvonder-sys/digitale-geletterdheid`
   - **Permissions:** Contents (read), Issues (read/write), Pull requests (read/write), Actions (read)
2. Store it:
   ```bash
   mkdir -p ~/.config/claude-mcp && chmod 700 ~/.config/claude-mcp
   echo -n "YOUR_PAT" > ~/.config/claude-mcp/github-pat && chmod 600 ~/.config/claude-mcp/github-pat
   ```

> `.mcp.json` leest het token uit `~/.config/claude-mcp/github-pat` — geen plaintext secrets in `.mcp.json`.

---

> The three connectors below (Sentry, Linear, Figma) are added with `claude mcp add`,
> which writes to your **local** MCP config. `.mcp.json` is gitignored, so each
> developer runs these one-time steps on their own machine; nothing here is committed.

---

## Sentry MCP
**Purpose:** Agent-side investigation of reported production errors — issues, stack traces, traces — while debugging. This is debugging tooling for Claude/Codex, **not** app monitoring. The DGSkills website itself currently sends **no** events to Sentry, so the MCP may return little or nothing until app-level Sentry is decided (a separate consent/DPIA question — see `docs/security/security-audit-prompt-dgskills.md`).
**Runs:** remote hosted server (recommended) or local `@sentry/mcp-server` (stdio).
**Setup — recommended (remote, browser login, no stored token):**
1. `claude mcp add --transport http sentry https://mcp.sentry.dev/mcp`
2. Start a Claude Code session and run `/mcp` to complete the browser OAuth login.
**Setup — local stdio (the current `.mcp.json` entry):** runs `@sentry/mcp-server` with a token from Keychain service `sentry-mcp-token`, account `yorinvonder`.

> ⚠️ The `sentry-mcp-token` Keychain item is currently **missing**, so the local stdio entry cannot authenticate — that is why no Sentry tools appear yet. Either use the remote route above, or create a Sentry **User Auth Token** (Sentry → Settings → Auth Tokens) and store it: `security add-generic-password -U -a yorinvonder -s sentry-mcp-token -w YOUR_TOKEN`.
> Treat Sentry as evidence, not final judgment. If it is unavailable or empty, fall back to Vercel runtime logs, Supabase logs, browser reproduction, or user-provided screenshots.

---

## Linear MCP
**Purpose:** Search, create, and update Linear issues, projects, and comments from a session — for durable follow-up tracking, review findings, and remaining-risk trails.
**Runs:** Linear's remote MCP server (OAuth).
**Setup (browser login, no stored token):**
1. `claude mcp add --transport http linear https://mcp.linear.app/mcp`
2. Start a Claude Code session and run `/mcp` to complete the browser login.

> Requires a Linear workspace with sufficient permissions. Remote MCP connections can be flaky — if it fails, restart the client or disable/re-enable the Linear server and retry.

---

## Figma MCP
**Purpose:** Bring design context (frames, components, variables, design-system tokens) into a session for design-to-code work and to compare an implementation against its design intent.
**Runs:** remote Figma MCP server (recommended) or the local desktop server.
**Setup — remote (recommended; available on all seats and plans):** follow Figma's official guide *"Claude Code and Figma: Set up the MCP server"* at help.figma.com (install the Figma plugin, which ships the MCP settings + Agent Skills), then run `/mcp` to log in.
**Setup — local desktop server (needs a Dev or Full seat on a paid plan):**
1. Open the Figma **desktop app** and open a Design file.
2. With nothing selected on canvas, switch to **Dev Mode**, then enable the **MCP server** toggle in the right sidebar.
3. Click **copy URL** (a local address, e.g. `http://127.0.0.1:3845/...`).
4. `claude mcp add --transport sse figma <paste-the-copied-URL>`

> The Figma desktop app must stay running for the local server. Figma recommends the remote server for the broadest feature set.

---

## When To Use Linear / Sentry / Figma

Decide at the start of a session whether each tool adds signal; use them as needed, not as busywork. (The cross-agent workflow rules for Linear and Sentry live in `AGENTS.md`; this file holds the connection/setup details plus Figma until that guidance lands there.)

- **Linear** — when work creates follow-up tasks, review findings, unresolved risks, product decisions, or bug reports that should not live only in chat. Keep issue text concise: problem · evidence · expected outcome · affected route/file/feature · verification needed · safe links only.
- **Sentry** — first stop for reported production crashes, blank screens, release regressions, slow flows, or browser/device-specific failures. Evidence, not final judgment; you still own code review and validation. The app emits no events yet, so fall back to Vercel/Supabase logs or browser reproduction when Sentry is empty.
- **Figma** — for design-heavy frontend/UX: teacher onboarding, teacher dashboard, student mission flow, AI-feedback screens, the public school/sales page, design-system components, and mobile/tablet layout planning. **Not** for backend bugs, Supabase/RLS, security fixes, small text edits, build failures, or routine refactors unless explicitly asked.

## Privacy Rules For External Tools (DGSkills handles minors' data)

Never put any of the following into Linear, Sentry, or Figma — not in issues, comments, logs, prompts, screenshots, or generated artifacts:

- secrets, API keys, tokens, cookies, Supabase JWTs, or auth/session details;
- learner records, student names or emails, or identifiable student work/answers;
- raw AI prompts or AI feedback;
- sensitive production data, or screenshots containing any of the above.

Extra Sentry rules: do **not** enable Session Replay without a separate DPIA/privacy review; do **not** send request bodies, cookies, auth headers, JWTs, AI prompts/feedback, or student answers. Prefer pseudonymous technical IDs over names/emails, minimize data, and keep retention short.

Always confirm a connector is actually available before relying on it; if it is not, say so briefly and use the safest fallback.
