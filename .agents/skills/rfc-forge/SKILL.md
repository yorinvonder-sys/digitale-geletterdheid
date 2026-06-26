---
name: rfc-forge
description: >-
    Produce a rigorous, build-ready RFC / design doc for a substantial or
    multi-faceted change by orchestrating sub-agents through divergence →
    convergence → taste → adversarial review → completeness, then writing the
    final RFC to docs/rfcs/. Use this whenever the user wants to scope,
    research, plan, or "turn an idea into something we can hand off" — an RFC,
    design doc, technical proposal, architecture/feature spec, or research that
    must become a plan — ESPECIALLY work spanning both the codebase and current
    external/web practice, or work meant to hand off to a fresh session or a
    team of agents. Trigger even when the user doesn't say "RFC": "research how
    we'd do X and write it up", "scope this properly before we build", "plan out
    the overhaul", "turn these ideas into a handoff", "figure out the best
    approach to X", or "do a research pass and give me a doc" should all pull
    this in. Not for trivial, single-file, or already-decided changes — just do
    those directly.
---

# RFC Forge

A repeatable pipeline that turns a fuzzy, multi-faceted idea into an RFC good
enough to hand to a fresh session or a team of agents. It works by deliberately
**diverging** (parallel research grounded in the code AND current web practice),
**converging** (one synthesized draft that hunts for the unifying
simplification), **stress-testing** (a taste pass using the repo's own skills
plus an adversarial role panel that verifies claims live), and holding the
result to a **completeness bar**. The payoff: a plan that's already been
attacked from every angle before anyone writes a line of feature code — so the
build session executes instead of re-deciding.

Reach for it on substantial, multi-faceted, or hand-off work. Skip it for
trivial or already-decided changes; those don't need a panel, they need a diff.

Once the RFC is Final, hand it to `design-and-refactor`, which sequences the
A.L.C.H.E.M.Y. architecture gates (1–7). See Phase 6 and Output below.

## Why this shape

A single-pass plan reflects one mind's blind spots. The pipeline buys three
things a solo draft can't: **coverage** (independent researchers sweep angles
you'd serialize and tire of), **confidence** (a taste lens and adversarial
reviewers catch the over-engineering, the forced couplings, and the _factual
errors_ in the draft before they reach a builder), and **a real definition of
done** (the completeness standard stops the plan from quietly deferring the
hard 20%). The reviewers routinely find load-bearing mistakes the author was
too close to see — that's the point, so make them adversarial, not polite.

## Model transparency

State model + thinking at every step (required by this repo's model-workflow):

| Step | Model | Thinking |
|---|---|---|
| Frame + synthesize (Phase 1, 3, 4, 6) | **Opus** | `high` (or `max` for Supabase/RLS/auth/AI endpoints) |
| Divergent-research fan-out (Phase 2) | **Explore / general-purpose sub-agents** | background, parallel |
| Adversarial-review panel (Phase 5) | **Explore / general-purpose sub-agents** + **Codex** | background, parallel |
| Finalize + handoff note | **Opus** | `high` |

**DeepSeek is NOT used** for any phase of this pipeline. Divergent-research and
adversarial-review sub-agents require live codebase reads and tool access;
DeepSeek has neither. Security/compliance/juridische steps stay on Opus or the
dedicated skills (`dgskills-jurist-check`, `dgskills-compliance-check`).

## The pipeline

### Phase 1 — Frame → **Opus (high)**

State the single outcome in a sentence. Split it into **distinct,
non-overlapping research threads** (typically 2–5) — each a question a separate
agent can chase without stepping on the others. Note up front the decisions only
the human can make (they become the RFC's "decisions before handoff" section).
If the request is really several independent outcomes, say so and pick the
first.

Check the canon/authority sources for this project before framing:
- `AGENTS.md` (repo-wide conventions)
- `.claude/project-context.md` (product context)
- `docs/architecture/agent-context-strategy.md` (AI context strategy)
- The A.L.C.H.E.M.Y. gate sequence in `CLAUDE.md`

### Phase 2 — Divergent research (parallel sub-agents) → **Explore/general-purpose (background)**

Fan out one read-only sub-agent per thread (Agent tool, `run_in_background:
true` so they go in parallel). Every researcher must ground findings in
**both**: the codebase (read the real files, name paths, verify what exists
today) and current external practice (docs + dated web search for fast-moving
topics). Cite sources. Tell each agent to return a **structured findings
report**. See `references/agent-prompts.md` for the research-thread scaffold.

### Phase 3 — Converge (the draft) → **Opus (high)**

Synthesize all findings into a draft RFC using the structure in
`references/rfc-template.md`. Don't just concatenate — **hunt for the unifying
simplification**: the one framing or shared primitive that makes the separate
threads fall into place. Where findings conflict, resolve them and say why.
Write the draft to `docs/rfcs/<yyyymmdd>-<slug>.md` with `Status: Draft`.

### Phase 4 — Taste pass → **Opus (high)**

Run a taste/simplification pass using the repo's own skills:
- `functionality-complexity-tradeoff` — is each element in the plan necessary,
  or is it speculative complexity?
- `structural-simplification` — is the proposed shape coherent, or does it
  couple unrelated concerns?
- (Optionally the `simplify` skill for a broader look.)

Is the core idea the _elegant_ simplification or is it forcing unrelated
concerns together? What's over-engineered, redundant, or missing a simpler
path? Is the scope coherent, or should it split? Capture the refinements.

### Phase 5 — Adversarial review panel → **Explore/general-purpose sub-agents + Codex (background)**

Spin up 3–4 sub-agents in distinct critical roles plus Codex as an adversarial
reviewer. Prompt each to **refute, not approve**: find what breaks, what's
underspecified, what's factually wrong, and what should decompose. Require them
to ground in the code and verify claims live.

**Recommended lenses for DGSkills:**

1. **Staff-engineer lens** — coupling, layering, build integrity, load-bearing
   edge cases, timing and recovery logic; verifies claims against actual code.
2. **Compliance/jurist lens** — this is an EU AI Act **high-risk** education
   product (Annex III §3(b)) handling minors' data under AVG/UAVG. Use the
   `dgskills-jurist-check` and `dgskills-compliance-check` skills as the
   framework. Flag anything that touches data processing, consent, AI
   transparency, profiling, or child safety.
3. **Domain lens** — pedagogy/didactiek for mission work; security for
   backend/edge/auth work. Pick the lens the work has stakes in.
4. **Codex adversarial reviewer** — the same adversarial-verify role Codex
   plays as the codex-gate in `dgskills-mission-review`. Grounds in the code,
   refutes the RFC's technical claims live, returns a structured prioritized
   critique.

See `references/agent-prompts.md` for the reviewer scaffold. Run all panel
members in the background in parallel.

### Phase 6 — Finalize → **Opus (high)**

Merge the taste findings and panel critiques — including their factual
corrections — into the final RFC. Apply the completeness standard below. Flip
`Status: Final`, end with the decisions to resolve before handoff.

**Handoff:** once the RFC is Final, explicitly invoke the `design-and-refactor`
skill to run the A.L.C.H.E.M.Y. gates (1–7) on the design. The RFC is the
input; the gate sequence governs the architecture and enforcement before any
feature code is written.

## The completeness standard

The **scoped outcome** is delivered fully — tests and docs are part of done,
not optional. Nothing within the agreed scope is deferred.

This standard is NOT a licence to expand scope. It means:

- Tie off orphans that **this change itself creates** (broken imports, stale
  type references, missing migration, doc that now contradicts the new
  behaviour).
- Adjacent gaps that the research surfaces are **separate follow-ups**: open a
  `spawn_task` background-task chip or a Notion card for each one. Never fold
  them into the current delivery.
- Chesterton's Fence applies to anything you discover while researching: explain
  why it exists before proposing to remove it. Surface it as a follow-up, not
  scope creep in this RFC.

This keeps the RFC compatible with the repo's Scope Discipline rule (change
only what was asked; surgical changes; no speculative features).

The only sanctioned "not now" inside the scope is a genuine external-dependency
chain. Name it explicitly.

## Scale to the task

Match the machinery to the size. Focused change: 2–3 research threads, a
3-role panel. Sprawling overhaul: 4–5 threads, a 4-role panel. The fan-out is
heavy (~8–10 agents on a full run) — it earns its keep on substantial work and
is overkill for a one-file fix.

## Output

The final RFC lives at `docs/rfcs/<yyyymmdd>-<slug>.md`. The `docs/rfcs/`
directory will be created on first use (siblings: `docs/architecture/`,
`docs/pedagogy/`, `docs/security/`).

The deliverable is the final, reviewed, completeness-held RFC — a real handoff.
Relay the headline reframes and the open decisions to the user; the document
carries the rest.

After delivery: hand off to `design-and-refactor` (A.L.C.H.E.M.Y. gates 1–7)
and open Notion cards for any adjacent gaps surfaced by the research.
