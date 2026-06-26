# RFC template

The section structure for the final RFC. Adapt to the work — drop sections that
don't apply, add domain ones that do — but keep the spine.

Output path: `docs/rfcs/<yyyymmdd>-<slug>.md`

```markdown
# RFC: <topic> — <one-line scope>

**Status:** Draft → Final (research → taste → N-role adversarial panel
synthesized, <date>).
**For:** <who executes — a fresh build session / a team of agents>.
**Canon/authority:** AGENTS.md · .claude/project-context.md ·
docs/architecture/agent-context-strategy.md · A.L.C.H.E.M.Y. gate sequence
(CLAUDE.md).
**Next step after Final:** hand to `design-and-refactor` (gates 1–7).

---

## The standard (definition of done)

The scoped outcome is delivered fully — tests and docs are part of done.
Adjacent gaps discovered during research are filed as separate Notion cards or
`spawn_task` chips; they are NOT in scope here.

<restate the completeness bar for this specific work>

---

## 0. Summary / the reframe

<2–6 bullets. Lead with the unifying simplification. Show coupled vs
falsely-coupled vs independent units. State what this RFC does NOT cover
(links to follow-up Notion cards).>

---

## 1. Context & goals

<why now; goals; honest calibration of what's in reach vs outside our control;
what was already verified in the codebase>

---

## 2..N. The units / workstreams

<one section per coupled unit: decision/direction, concrete plan (files, APIs,
patterns), panel corrections, edge cases. Order by dependency. Mark what ships
first.>

---

## Sequencing & ownership

<what ships first, critical path, what parallelizes, the one thing that
de-risks most>

---

## Decisions needed BEFORE handoff

<numbered; the calls only the human can make — resolve before handing to
`design-and-refactor`>

---

## Acceptance criteria

<verifiable checks including tests + docs as first-class; reference relevant
CI gates (tsc, vite build, Codex-gate)>

---

## Risks & open questions

<failure modes, external risks, honest-scoping caveats; compliance/jurist
flags if any>

---

## Adjacent follow-ups (out of scope)

<list of gaps surfaced by research that are NOT in this RFC; each should
become a Notion card or spawn_task chip>

---

## Appendix — verifications & sources

<panel's live verifications (quoted from actual reads); cited sources dated
for fast-moving topics>
```
