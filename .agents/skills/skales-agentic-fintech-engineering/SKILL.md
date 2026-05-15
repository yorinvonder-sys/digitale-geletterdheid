---
name: skales-agentic-fintech-engineering
description: Use when planning, implementing, reviewing, or explaining Skales fintech app work, especially payments, subscriptions, ledgers, KYC, compliance, auth, admin access, user data, invoices, banking imports, or any AI-assisted coding task where the user needs beginner-friendly guidance. Applies agentic engineering lessons from Andrej Karpathy and AI coding workflow lessons from Matt Pocock: clarify first, slice small, test first, verify hard, and explain changes in plain language.
metadata:
  project: Skales
  source-inspiration: "Andrej Karpathy - From Vibe Coding to Agentic Engineering; Matt Pocock - Full Walkthrough: Workflow for AI Coding"
---

# Skales Agentic Fintech Engineering

Use this skill to keep AI coding useful, understandable, and safe for a non-coder building a fintech product.

Core principle: AI may write code, but the human still owns the goal, risk, quality, and release decision.

## Operating Mode

For every Skales task:

1. Explain the plan in plain language before changing code.
2. Keep the work small enough that a beginner can follow it.
3. Identify fintech, security, privacy, and money risks up front.
4. Prefer test-first work for logic, data, payment, auth, and compliance changes.
5. Verify with commands, browser checks, or database checks before claiming success.
6. Explain changed files afterward: what changed, why, and how it was tested.

Use the user's language when practical. If the user writes in Dutch, explain in clear Dutch unless code terms are clearer in English.

## Risk Scan

Before implementation, classify the task with the same traffic-light labels used in `AGENTS.md` and `CLAUDE.md`:

- **Green:** copy changes, visual tweaks, static content, harmless UI polish.
- **Yellow:** forms, dashboards, API reads, non-sensitive data updates.
- **Red:** authentication, authorization, payments, subscriptions, ledgers, KYC, invoices, PII, audit logs, admin access, database migrations, webhooks, secrets, AI endpoints.

For Red work, slow down and state:

- What could go wrong.
- Which data or money flow is affected.
- Which tests or checks will prove it works.
- Whether a human should review before production.

Also use relevant security, Supabase, testing, or frontend skills when their trigger conditions apply.

## Workflow

### 1. Clarify

Do not start broad fintech work from vague instructions. First turn the request into a tiny brief:

- Goal: what should happen for the user or business?
- Scope: what is included and excluded?
- Risk: what could break, leak, duplicate, or charge incorrectly?
- Proof: how will we know it works?

If the user is inexperienced, ask at most one important question at a time.

### 2. Slice Small

Break large requests into vertical slices. A good slice includes only the minimum UI, API/data change, state handling, and test needed to prove one behavior.

Prefer:

- "Show one subscription status correctly."
- "Handle one Stripe webhook event idempotently."
- "Import one bank CSV format and deduplicate by reference."

Avoid:

- "Build the whole billing system."
- "Make all KYC work."
- "Refactor the app while adding payments."

### 3. Test First Where Risky

For high-risk logic, write or identify the test before implementation.

Important fintech invariants:

- Payment/webhook handling must be idempotent.
- Users must never access another user's financial data.
- Role checks must not rely on client-editable fields.
- Ledger-like records must never be silently overwritten.
- Money amounts need explicit currency and integer minor units where possible.
- Retries must not double-charge, double-credit, or duplicate invoices.
- Audit logs should record important money, identity, and admin actions.
- Secrets must stay server-side.

### 4. Implement Narrowly

Change only the files needed for the current slice. Follow existing project patterns. Avoid unrelated refactors unless they directly reduce the risk of the task.

For AI agents or sub-agents:

- Delegate only narrow, low-risk side tasks such as file discovery, log reading, or one focused test check.
- Keep architecture, high-risk fintech decisions, and final validation on the main model.
- Tell agents they are not alone in the codebase and must not revert unrelated changes.

### 5. Verify

Before saying the work is done, run the smallest meaningful verification:

- Unit/type/build tests for code logic.
- Browser checks for user flows.
- Database/RLS checks for permissions and data isolation.
- Manual reasoning for financial invariants that tests do not cover.

If verification cannot run, say exactly why and what remains unproven.

### 6. Teach Back

End with a beginner-friendly explanation:

- What changed in normal words.
- Which files changed and what each one does.
- How the result was checked.
- What risk remains, if any.

For high-risk work, include a short "human review needed" note when appropriate.

## Beginner-Safety Prompts

When the user seems unsure, proactively offer:

- "I will explain the plan before editing."
- "I will keep this to one small step."
- "I will show what can go wrong."
- "I will explain the changed files afterward."

Good user-facing explanations avoid jargon or define it immediately.

Example:

> "Idempotent means the same webhook can arrive twice, but your app still only records the payment once."

## Source-Inspired Lessons

From Karpathy's agentic engineering framing:

- Do not rely on vibe-only coding for serious products.
- Use AI as a capable builder, but keep human judgment in charge.
- Treat specifications, review, and verification as first-class engineering work.

From Matt Pocock's AI coding workflow:

- Turn vague ideas into structured requirements before coding.
- Break work into small tracer-bullet slices.
- Use tests and review loops to keep agents grounded.
- Clear, bounded prompts produce better agent output than broad requests.

These are summarized principles, not verbatim transcripts.
