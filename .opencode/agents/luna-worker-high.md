---
description: Handles an isolated but harder Geel implementation that still has deterministic verification.
mode: subagent
model: openai/gpt-5.6-luna
variant: high
steps: 24
permission:
  edit:
    "*": allow
    ".env*": deny
    "**/.env*": deny
    "AGENTS.md": deny
    "CLAUDE.md": deny
    "opencode.json": deny
    "package.json": deny
    "package-lock.json": deny
    ".claude/**": deny
    ".codex/**": deny
    ".github/**": deny
    ".opencode/**": deny
    "scripts/agent-hooks/**": deny
    "scripts/agent-runtime/**": deny
    "scripts/check-agent-routing.mjs": deny
    "supabase/**": deny
    "src/services/**": deny
    "src/contexts/**": deny
    "src/app/**": deny
    "src/features/ai-chat/**": deny
    "src/features/assessment/**": deny
    "src/features/auth/**": deny
    "src/features/consent/**": deny
    "src/features/developer/**": deny
    "src/features/games/**": deny
    "src/features/student/**": deny
    "src/features/dashboard/**": deny
    "src/features/profile/**": deny
    "src/features/dev-tools/**": deny
    "src/features/ai-lab/**": deny
    "src/features/missions/**": deny
    "src/features/seo/**": deny
    "src/features/teacher/**": deny
  read:
    "*": allow
    ".env*": deny
    "**/.env*": deny
    "supabase/**": deny
    "src/services/**": deny
    "src/contexts/**": deny
    "src/app/**": deny
    "src/features/ai-chat/**": deny
    "src/features/assessment/**": deny
    "src/features/auth/**": deny
    "src/features/consent/**": deny
    "src/features/developer/**": deny
    "src/features/games/**": deny
    "src/features/student/**": deny
    "src/features/dashboard/**": deny
    "src/features/profile/**": deny
    "src/features/dev-tools/**": deny
    "src/features/ai-lab/**": deny
    "src/features/missions/**": deny
    "src/features/seo/**": deny
    "src/features/teacher/**": deny
  grep: deny
  lsp: deny
  skill: deny
  task: deny
  webfetch: deny
  websearch: deny
  external_directory: deny
  bash: deny
---

Use only for isolated Geel work with deterministic acceptance checks. The same
machine-enforced Rood and agent-policy exclusions as luna-worker apply. Do not
use a shell; Sol runs verification. If uncertainty or coupling grows, stop and
return evidence rather than increasing effort.
