---
name: dgskills-build-mission
description: Use this skill when the user asks to AUTONOMOUSLY build a complete new DGSkills learner mission from a free-text briefing — the AI handles the entire build → review → fix → ship cycle without manual intervention. Trigger phrases include "bouw missie", "auto-bouw missie", "genereer missie automatisch", "/dgskills-build-mission", or any request to fully generate a working mission from a brief description. Activate NIET for manually crafting a mission step-by-step (gebruik `dgskills-mission-author`) of voor het reviewen van een bestaande missie (gebruik `dgskills-mission-review`).
---

# DGSkills Build Mission — Autonome Bouw-loop (M3)

Je bent de orchestrator voor de M3 autonome bouw-loop. Je dispatcht een chain van: **build → review → fix → retry-tot-ALLOW**. Eindresultaat: een werkende, gereviewde, ALLOW-gestempelde missie zonder handmatige tussenkomst — Yorin is alleen finale beslisser.

## Trigger­principes

Activeer bij verzoek tot **autonome generatie van een nieuwe missie** uit een vrij-tekst briefing.

NIET activeren voor:
- Stap-voor-stap missie maken met user-input → `dgskills-mission-author`
- Bestaande missie reviewen → `dgskills-mission-review`
- Compliance-check → `dgskills-compliance-check`

## Verplichte input

Een **briefing** in vrije tekst van Yorin. Voorbeelden:
- "Maak een quiz over deepfakes voor leerjaar 2, ~20 min, scenario-engine"
- "Bouw een missie over wachtwoordbeveiliging voor leerjaar 1 die past bij 23A"
- "Genereer een builder-canvas missie waarin leerlingen een veilig social-media-profiel ontwerpen"

Bij ontbrekende cruciale info (geen leerjaar genoemd én geen template): vraag éénmaal om verheldering. Daarna: maak redelijke aannames en noteer ze in het eindrapport.

## Stappenplan

### Stap 1 — Briefing-parsing (Haiku, mechanisch)

Extraheer uit de briefing:
- **kernconcept** (waar gaat de missie over)
- **doelgroep-leerjaar** (1-6, default 1 voor onderbouw VO als niet genoemd)
- **template-type suggestie** (scenario-engine / puzzle-lab / builder-canvas / etc., default scenario-engine)
- **SLO-suggestie** (welke kerndoelen 21A-23C raakt dit; default leeg → mission-author beslist)
- **tijds-indicatie** (~10/20/30 min, default 20 min)
- **bijzondere wensen** (bv. "VSO-mapping verplicht", "AI-chat aan", "geen gevoelige onderwerpen")

Output: gestructureerd object dat aan mission-author wordt meegegeven.

### Stap 2 — Mission-author dispatch (Sonnet)

Spawn een general-purpose agent met `model: "sonnet"` die de `dgskills-mission-author` skill volgt.

**Agent prompt template:**

> Je bent de mission-author in de DGSkills M3 autonome bouw-loop. Lees de instructies uit `.claude/skills/dgskills-mission-author/SKILL.md` (project-root: `/Users/yorinvonder/Downloads/ai-lab---future-architect`) en bouw een complete, geintegreerde missie volgens de invarianten.
>
> Briefing-parsing:
> - kernconcept: {kernconcept}
> - leerjaar: {leerjaar}
> - templateType: {templateType}
> - SLO-suggestie: {sloKerndoelen}
> - tijdsduur: {tijdsduur}
> - wensen: {wensen}
>
> Lever terug:
> 1. **missionId** (kebab-case, uniek t.o.v. bestaande missies)
> 2. **Lijst van aangeraakte/aangemaakte files** met paden
> 3. **Korte rationale** in Nederlands: wat de leerling ervaart, welke SLO-doelen, didactische rationale

Bij agent-failure (geen werkende missie geleverd): escaleer aan Yorin met korte beschrijving.

### Stap 3 — Mission-review dispatch (M2 pipeline)

Roep de orchestrator-skill `dgskills-mission-review` aan met de zojuist gegenereerde `missionId` als argument. Dit triggert:
- 3 sub-reviewers parallel (design + didactiek + tech)
- Bundeling naar `business/dgskills-reviews/<missionId>-YYYY-MM-DD.md`
- Codex-gate (M1) — ALLOW of BLOCK

Verzamel: review-rapport-pad, Codex-verdict, lijst van Voorstel-blokken (bij BLOCK).

### Stap 4 — Decision: ALLOW vs BLOCK vs ESCALATE

**Bij ALLOW:** ga naar Stap 6 (eindrapport).

**Bij BLOCK + retry-budget over (attempt < 3):** ga naar Stap 5 (mission-fixer).

**Bij BLOCK + retry-budget op (attempt == 3):** escaleer aan Yorin met:
- Pad naar laatste rapport
- Lijst van resterende blocking issues
- Suggestie: "Pipeline kon dit niet autonoom oplossen — handmatige fix nodig"

### Stap 5 — Mission-fixer dispatch (Sonnet)

Spawn general-purpose agent met `model: "sonnet"` die de `dgskills-mission-fixer` skill volgt (zie M3 stap 2 — wordt apart gebouwd).

**Agent prompt template:**

> Je bent de mission-fixer in de DGSkills M3 retry-loop. Lees de instructies uit `.claude/skills/dgskills-mission-fixer/SKILL.md` en pas de Voorstel-blokken uit het laatste M2-rapport toe op de gebouwde missie-files.
>
> Input:
> - missionId: {missionId}
> - reviewRapportPad: {reviewRapportPad}
> - aangemaakte/aangeraakte files (whitelist voor scope): {fileList}
>
> Lever terug:
> 1. Lijst van toegepaste fixes (file:regel + beschrijving)
> 2. Lijst van geskipte voorstellen + reden
> 3. Of er escalatie nodig is (whitelist-violation, buiten-scope-fix)

Na fixer-output: ga terug naar Stap 3 (re-review). Increment attempt-counter.

### Stap 6 — Eindrapport aan Yorin

Print:

```markdown
# 🚀 Autonome Missie Build — {missionTitle}

**Mission ID:** {missionId}
**Briefing:** {originele briefing tekst}
**Aantal cycli:** {n} (max 3)
**Codex-verdict:** ✅ ALLOW (cycle {n}) of ⚠️ ESCALATED

## Wat de leerling ervaart
{rationale uit mission-author}

## SLO-koppeling
{kerndoelen + onderbouwing}

## Aangemaakte/aangeraakte files
{file-lijst}

## Review-rapport
{path naar `business/dgskills-reviews/<missionId>-YYYY-MM-DD.md`}

## Cycle-historie
- Cycle 1: {ALLOW/BLOCK + reden}
- Cycle 2 (indien): {fixer-output samenvatting + ALLOW/BLOCK}
- Cycle 3 (indien): {idem}

## Demo-zin voor Yorin
{1-zin pitch voor pilot/sales — wat kun je hierover zeggen aan een schoolbestuur}
```

Schrijf dit eindrapport naar `business/dgskills-builds/<missionId>-build-YYYY-MM-DD.md` en print het pad + samenvatting.

## Anti-patronen (NOOIT)

- ❌ Briefing parsen zonder bevestiging bij ambiguïteit (vraag éénmaal als kritieke info ontbreekt)
- ❌ Mission-author skippen — élke build start met mission-author, geen shortcuts
- ❌ Mission-review skippen — élke build wordt gereviewd, ook bij "vertrouwen in author"
- ❌ Codex-gate skippen — éénde Codex BLOCK is essentieel signaal
- ❌ Meer dan 3 cycli — pipeline moet escaleren, niet eindeloos itereren
- ❌ Mission-fixer auto-laten editen buiten missie-scope — strikte whitelist
- ❌ Auto-commit naar git — Yorin houdt commit-control
- ❌ Engelse output — Nederlands voor alle Yorin-gerichte tekst

## Verplichte verificatie (na elke run)

- [ ] Eindrapport bestaat in `business/dgskills-builds/`
- [ ] Bij ALLOW: missie verschijnt in dashboard (curriculum + registry + agents.tsx + slo-mapping)
- [ ] Bij ESCALATED: rapport markeert duidelijk wat handmatig moet en waarom
- [ ] Alle file-edits binnen whitelist (geen scope-creep)
- [ ] TypeScript bouwt schoon na de build (`tsc --noEmit` → geen nieuwe errors voor deze missie)
- [ ] Codex-gate stempel onderaan review-rapport

## Wanneer escaleren naar Yorin (zonder retry)

- Briefing eist iets dat in strijd is met DGSkills-invarianten (bv. "missie zonder SLO-koppeling")
- Mission-author detecteert content-conflict (bv. gevoelig onderwerp zonder welzijnsprotocol)
- Mission-fixer kan onderdeel niet veilig fixen (security/AI-act-implicaties)
- Build resulteert in TypeScript-errors die buiten missie-scope vallen

## Referenties

- Detail-plan: `~/.claude/plans/m3-autonomous-build-loop.md`
- Master-plan: `~/.claude/plans/hey-claude-ik-struggle-eager-meteor.md`
- Hergebruikte skills: `dgskills-mission-author` (build), `dgskills-mission-review` (M2 review), `dgskills-mission-fixer` (M3 retry — wordt nog gebouwd)
- M1 Codex-gate: plugin `openai-codex/codex` v1.0.4 met `--model gpt-5.5 --effort xhigh`
