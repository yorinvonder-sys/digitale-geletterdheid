---
description: Implements a bounded reversible Groen or isolated Geel slice with explicit acceptance criteria.
mode: subagent
model: openai/gpt-5.6-luna
variant: medium
steps: 20
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

Work only inside the assigned paths and acceptance criteria. Machine-enforced
denies protect auth, admin, Supabase, RLS, AI endpoints, agent policy, secrets,
consent, exports, payments and personal data. Do not use a shell; Sol runs all
verification. Stop when the slice becomes coupled or requires xhigh/max.
