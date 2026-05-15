# Global Model Routing Policy

Keep `gpt-5.5` as the main model for core work.

Across all tasks and projects:
- Prefer delegated sub-agents on `gpt-5.3-codex-spark` for lightweight, bounded, low-risk subtasks.
- Keep Spark subtasks narrow and pass only the minimum context needed.
- Use Spark for sidecar work such as repository exploration, targeted file inspection, log reading, narrow QA checks, and simple one-file analysis.
- Keep `gpt-5.5` on the critical path for architecture, multi-file refactors, ambiguous debugging, security-sensitive changes, integration, and final validation.
- Do not force delegation when the task is tightly coupled, blocking the immediate next action, or too ambiguous to scope safely.
- Escalate back to `gpt-5.5` whenever uncertainty, coupling, or risk increases.
- If no safe lightweight subtask exists, stay on `gpt-5.5` rather than delegating by default.

Goal: reduce token and capacity usage where safe, without degrading engineering quality.

# Plan Mode Prompt Structuring Policy

When the user asks for planning, research, exploration, or uses Plan mode, do not require the user to provide a structured prompt. The user may describe the task informally, briefly, or with partial context.

In Plan mode, ChatGPT/Codex should actively structure the user's intent before proposing or executing work:
- Restate the likely goal in concrete terms.
- Separate known context from inferred context.
- List assumptions and label them as assumptions.
- Define likely scope and explicitly name what appears out of scope.
- Infer sensible constraints from the repository, existing instructions, and recent work.
- Propose clear "done when" criteria.
- Propose the verification path, including relevant scripts, tests, browser checks, or review steps.
- Run an intent clarification pass: identify what is still unclear about the user's intent, priorities, target audience, success criteria, non-goals, design taste, or risk tolerance.
- Ask concise, high-signal clarifying questions when the answers would materially improve the plan or prevent wasted work.
- Prefer one focused question at a time for fuzzy or strategic topics. Group up to three short questions only when they are independent and easy to answer.
- When asking questions, include the most likely inferred default so the user can simply confirm or correct it.
- Do not over-interview when the intent is already clear. If no clarification is needed, say so briefly and proceed.
- Always ask before proceeding when a wrong assumption would be costly, risky, security-sensitive, user-visible in a significant way, or hard to reverse.

If the user's wording is ambiguous but low-risk, choose a reasonable interpretation, state it briefly, and continue. Make the interpretation easy for the user to correct.

For larger tasks, present the structured plan before implementation. For small low-risk tasks, the structured interpretation can be short and embedded in the working update.

# Context Budget & Repo Hygiene

This repo can fill an agent context very quickly. Default to compact,
path-scoped exploration.

- Start context-heavy work with `npm run context:budget`.
- Do not run broad `git diff`, `git show`, or `rg` across the whole repo unless the task truly requires it.
- Prefer `git status --short -- <paths>` and `git diff -- <paths>` for the files being changed.
- Exclude noisy/generated paths from searches: `.claude/worktrees/`, `.playwright-mcp/`, `dist/`, `node_modules/`, `public/video/`, and large binary assets.
- Do not paste long command output into the conversation. Summarize counts, top files, and exact paths instead.
- Read `.claude/progress-log.md`, `.claude/current-task.md`, and other baton files only when the user asks to continue a previous Claude workflow.
- Treat `.playwright-mcp/` screenshots as artifacts, not source context.

# Beginner-Safe AI Coding Workflow

This repository must be safe for a non-coding founder to direct. Codex should make work understandable, small, testable, and reviewable.

For Skales/fintech-style work, or any task touching payments, subscriptions, ledgers, KYC, compliance, auth, admin access, user data, invoices, banking imports, webhooks, or beginner-friendly explanation, use the project skill:

`.agents/skills/skales-agentic-fintech-engineering/SKILL.md`

## Before Code Changes: Plan-Risk-Proof

Before editing code for any user request, give a short plain-language block:

```text
Plan: what I will change in normal language.
Risk: Green / Yellow / Red, with one sentence why.
Likely files: the files or areas I expect to touch.
Proof: the test, build, browser check, or manual check that will show it works.
```

Keep the task small. If the request is large, slice it into the smallest useful step and say what is intentionally left for later.

## Traffic-Light Risk Labels

- **Green:** copy changes, visual polish, static content, harmless UI tweaks.
- **Yellow:** forms, dashboards, API reads, non-sensitive data updates, normal product logic.
- **Red:** payments, subscriptions, ledgers, KYC, invoices, auth, admin access, bank data, personal data, webhooks, secrets, database migrations, RLS, AI endpoints.

For Red work:
- Slow down and explicitly warn what could go wrong.
- Prefer tests before implementation.
- Verify permissions, privacy, duplicate-processing, and financial invariants.
- Do not claim production readiness without proof.

## During Implementation

- Work one small step at a time.
- Avoid broad refactors unless needed for the current verified step.
- Do not make unrelated changes.
- Do not hide uncertainty; explain it.
- Do not let sub-agents make architecture, security, or release decisions.

## Assignment Review Browser Rule

When reviewing a DGSkills assignment/mission/opdracht, always use Chrome browser for the visual or dynamic review step in addition to static code inspection. If Chrome cannot be used, state that clearly in the final response and mark the browser portion as unverified.

## After Code Changes: Changed-Files Teach-Back

Every final response after code changes must include:

- What changed, in normal language.
- Why it changed.
- Which files changed and what each one does.
- What tests or checks ran.
- What remains risky, unverified, or needs human review.

Never say "done", "fixed", "ready", or "safe" unless verification actually ran or the remaining gap is clearly stated.
