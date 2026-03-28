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
