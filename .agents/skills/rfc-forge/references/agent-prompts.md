# Agent prompt scaffolds

Reusable shapes for the two fan-out phases. Adapt the bracketed parts; keep the
spine (ground in code, verify live, return structured findings). Launch agents
in the background so each phase runs in parallel (`run_in_background: true`).

---

## Phase 2 — divergent research thread

One per non-overlapping thread. Read-only. Use the `Explore` or
`general-purpose` agent type.

```
Read-only research (change nothing). Produce <the specific finding this thread owns>
for an RFC — be concrete and specific; this feeds a synthesis.

Ground in BOTH:
- the codebase (read the real files <name the likely paths>; verify what
  exists today, name paths)
- current external practice (docs for <library>; dated web search for
  <fast-moving topic>; cite sources with date)

Deliver a structured markdown findings report covering:
  <the 3–5 questions this thread must answer>

Flag constraints and open decisions. Your final message IS the data.
```

Good threads are non-overlapping and answerable independently. Tell each agent
what the others cover so they stay in their lane.

---

## Phase 5 — adversarial reviewer (one per role)

3–4 of these, each a distinct critical role. Use the `general-purpose` agent
type plus Codex (the `/codex:rescue` adversarial reviewer) as a fourth member
when the work is substantial.

**Frame: refute, not approve.**

```
You are a skeptical <ROLE> doing an ADVERSARIAL review of an RFC.
Read `<path-to-draft-rfc>` in full, and ground yourself in the relevant code
(<paths>).

Critique it as someone who has to live with the consequences. Find what will
BREAK, what's underspecified, what's factually WRONG, what should decompose:
  - <3–6 role-specific probes>
  - VERIFY load-bearing claims live (read the source, check the types, confirm
    the migration exists) rather than trusting the draft. Quote what you find.
  - Flag scope creep: anything in the RFC that goes beyond the stated goal
    should be surfaced as a separate follow-up, not accepted silently.

Return a structured, prioritized critique with concrete fixes/additions.
Read-only; change nothing.
```

### Choosing roles for DGSkills

| Role | When to use | Key probes |
|---|---|---|
| **Staff engineer** | Always | Coupling, layering, build integrity, edge/timing/recovery logic; verify claims against real code |
| **Compliance/jurist** | Any feature touching data, AI, minors, consent, transparency | EU AI Act Annex III §3(b); AVG/UAVG; `dgskills-jurist-check` + `dgskills-compliance-check` frameworks |
| **Pedagogy/didactiek** | Mission work, learning objectives, SLO mapping | Kerndoelen alignment, cognitive load, leerling-safety |
| **Security** | Backend, edge functions, auth, RLS, AI endpoints | Threat model, RLS correctness, service-role key exposure, injection surfaces |
| **Codex** | Substantial RFCs (as fourth reviewer) | Adversarial technical verification — same role as the codex-gate in `dgskills-mission-review` |

Pick the lenses the work actually has stakes in. Compliance/jurist is required
for any change that touches leerlingdata, AI output, or consent flows — this is
a high-risk system under EU AI Act Annex III §3(b).
