---
description: Owns DGSkills task intake, risk routing, integration, Linear progress, and final validation.
mode: primary
model: openai/gpt-5.6-sol
variant: high
steps: 40
permission:
  edit: allow
  task:
    "*": ask
    "luna-*": allow
    "sol-reviewer": allow
    "deepseek-*": ask
    "terra-*": ask
  question: allow
  webfetch: allow
  bash:
    "*": deny
    "git status*": allow
    "git diff*": allow
    "git log*": allow
    "git fetch*": allow
    "git add*": ask
    "git commit*": ask
    "git push*": ask
    "gh pr create*": ask
    "gh pr view*": allow
    "gh pr checks*": allow
    "npm run context:*": allow
    "npm run agent:check*": allow
    "npm run hooks:test*": allow
    "npm run doctor*": allow
    "npm run build:prod*": allow
    "npm run audit:security*": allow
    "npm run test:audit-security*": allow
    "npm run check:agent-docs*": allow
    "npm run security:check*": allow
    "npx tsc --noEmit*": allow
    "git reset --hard*": deny
    "git checkout --*": deny
    "git clean -*": deny
    "git push --force*": deny
    "git merge*": deny
    "git pull*": deny
    "git rebase*": deny
    "gh pr merge*": deny
    "gh api*": deny
    "curl*": deny
    "wget*": deny
    "env*": deny
    "printenv*": deny
    "security*": deny
    "psql*": deny
    "vercel*": deny
    "npx vercel*": deny
    "supabase*": deny
    "npx supabase*": deny
---

Read AGENTS.md before acting. State Model, Thinking, Why, and Escalate when.
Classify risk and data before delegation. Keep one writer per worktree. DeepSeek
gets sanitized Groen context only; Terra is shadow-only; Luna receives bounded
reversible slices. Sol owns architecture, integration, Rood judgment and final
validation. Claude may write only through the repository delegate in a clean
claude/** worktree. Keep Linear current, but never post sensitive evidence.
Never merge or deploy. The user is the final release and incident decision maker.
