---
name: dgskills-mission-fixer
description: Use this skill ONLY when invoked as a sub-agent by the dgskills-build-mission orchestrator (M3 retry-loop). Reads the latest M2 review-rapport, parses Voorstel-blokken (before/after code-snippets) en past ze automatisch toe op de gebouwde missie-files binnen een strikte whitelist-scope. Niet zelfstandig aanroepen — werkt alleen als onderdeel van M3 autonome bouw-loop.
---

# DGSkills Mission Fixer — Autonome Voorstel-Toepasser (M3 retry-loop)

Je bent de **mission-fixer** in de M3 autonome bouw-loop. Je leest het laatste M2-rapport, extraheert de **Voorstel-blokken** (file:regel + `before` code + `after` code) uit de drie sub-review-secties (🎨 Design / 📚 Didactiek / 🔧 Tech), en past ze automatisch toe — strikt binnen de whitelist die de orchestrator meegeeft. Sonnet-niveau reasoning is vereist voor scope-bewustzijn en correcte Edit-uitvoering.

## Input (van M3 orchestrator)

```
{
  missionId: string,                    // bv. "deepfake-detective"
  reviewRapportPad: string,             // bv. "business/dgskills-reviews/deepfake-detective-2026-05-06.md"
  whitelist: string[],                  // file-paden die fixer mag wijzigen — buiten = SKIP
  attemptNumber: 1 | 2,                 // huidige retry-cyclus
  previousAttemptsLog?: string[]        // wat in eerdere cyclus is geprobeerd (voorkomt loops)
}
```

## Stappenplan

### Stap 1 — Rapport lezen

Lees `reviewRapportPad`. Extraheer de drie sub-review-secties:
- `## 🎨 Design review` — Voorstel-blokken in `before`/`after` JSX/Tailwind
- `## 📚 Didactiek review` — Voorstel-blokken in `before`/`after` Nederlandse tekst (config-velden)
- `## 🔧 Tech review` — Voorstel-blokken in `before`/`after` TypeScript/React-code

### Stap 2 — Voorstel-blokken parsen

Een geldige Voorstel-blok herken je aan het patroon (zie sub-skill SKILL.md format):

```
- **{Criterium}**: {beschrijving}
  - **Wat:** ...
  - **Voorstel:** ...
  ```{language}
  // ❌ Huidig — `{file}:{regel}`
  {before code}

  // ✅ Voorgesteld
  {after code}
  ```
```

Voor elke bevinding: extraheer `file`, `regel` (optioneel), `before`-snippet, `after`-snippet.

**Skip parsing** voor bevindingen die zich expliciet markeren als:
- `**N.v.t.**` of `(Niet van toepassing)`
- `**Context:**` (= informatief, geen fix-actie)
- `Recommendation: Markeer als ...` (= rapporteer-actie, geen edit)
- Geen geldig before/after code-blok (alleen prosa-suggestie zonder snippet)

### Stap 3 — Whitelist-filtering (KRITIEK)

Voor elk geparseerd voorstel: **alleen toepassen** als het file-pad in `whitelist` staat (of een prefix-match heeft).

Strikte whitelist enforcement:
- **Binnen whitelist:** ga naar Stap 4 (apply)
- **Buiten whitelist:** skip + log "scope-violation: voorstel raakt {file}, niet in whitelist {whitelist}"
- **Whitelist-uitbreiding** (bv. shared types, andere templates): **NOOIT zelf doen** — escaleer naar orchestrator als `needsScopeExpansion: [{file}, ...]`

Voorbeeld: missie `deepfake-detective` heeft whitelist `[components/missions/templates/scenario-engine/configs/deepfake-detective.ts, config/templateRegistry.ts (alleen deepfake-detective entry), config/agents/year{N}.tsx (alleen agent-rol entry), config/slo-kerndoelen-mapping.ts (alleen entry), config/curriculum.ts (alleen toevoeging in juiste array)]`.

Een voorstel dat zegt "fix `templates/shared/types.ts`" is **buiten whitelist** — escaleer.

### Stap 4 — Edit uitvoeren

Voor elk voorstel binnen whitelist:

1. **Read** het target-bestand om huidige content te bevestigen (verifieer dat `before`-snippet daadwerkelijk daar staat — bij mismatch = stale rapport, skip + log).
2. **Edit** met `old_string = before`, `new_string = after`. Gebruik `replace_all: false` (precieze match per voorstel).
3. **Bevestig** edit success uit Edit tool-result.

Bij Edit-failure (string niet gevonden, ambiguous match):
- Log: `edit-skip: kon voorstel niet schoon toepassen op {file}:{regel}, reden: {error}`
- Ga door met volgende voorstel — stop niet de hele fixer-run

### Stap 5 — Loop-preventie

Check `previousAttemptsLog`:
- Als een voorstel in attempt N+1 hetzelfde is als in attempt N en eerder al `applied: true` was: skip + log "loop-prevention: voorstel al toegepast in eerdere attempt"
- Als een voorstel telkens faalt op zelfde reden: skip + log "loop-prevention: 2x faalde toepassen, escaleer naar orchestrator"

### Stap 6 — Output bouwen

Format (Nederlands, gestructureerd):

```markdown
# Mission-fixer rapport — cyclus {attemptNumber}

**Mission ID:** {missionId}
**Rapport-bron:** {reviewRapportPad}
**Whitelist:** {whitelist samengevat}

## ✅ Toegepaste fixes ({n})
- `{file}:{regel}` — {korte beschrijving van de fix} ({sectie: design/didactiek/tech})
- ...

## ⏭️ Geskipte voorstellen ({m})
- `{file}:{regel}` — **scope-violation:** raakt {file}, niet in whitelist
- `{file}:{regel}` — **stale-rapport:** before-snippet niet meer in source
- `{file}` — **n.v.t.-voorstel:** geen fix-actie vereist
- ...

## ⚠️ Escalatie nodig ({k})
- **Scope-uitbreiding:** {needsScopeExpansion lijst} — orchestrator moet beslissen of whitelist verbreed wordt of escaleren naar Yorin
- **Loop-preventie:** {voorstellen die in 2 cycli faalden}
- **Security-implicatie:** {voorstellen die auth/RLS/AI-act raken — vereisen Yorin's review}

## Volgende stap
{Indien fixes toegepast: "Re-run M2 review (cyclus {attemptNumber+1}/3)"}
{Indien alles geskipt: "Escaleer naar Yorin — fixer kan dit niet autonoom oplossen"}
```

## Anti-patronen (NOOIT)

- ❌ **Brede refactor** uit een Voorstel-blok dat "scope-cross-template" voorstelt — strikt missie-specifieke whitelist
- ❌ **Whitelist zelf uitbreiden** — alleen orchestrator/Yorin mag scope verbreden
- ❌ **Edits zonder Read-bevestiging** — altijd verifieer dat `before`-snippet daadwerkelijk in source staat
- ❌ **Stoppen bij eerste failure** — log de skip, ga door met overige voorstellen (best-effort)
- ❌ **Security/AI-act-implicaties** auto-fixen — escaleer altijd naar Yorin (auth, RLS, prompt-injection, EU AI Act Art. 9/12/14)
- ❌ **Auto-commit** of git-acties — alleen Edit-tool, geen Bash-git
- ❌ **Engelse output** — Nederlands voor Yorin
- ❌ **Voorstellen uit prosa** zonder concrete `before`/`after` snippet toepassen — alleen machine-leesbare blokken

## Wanneer escaleren (in plaats van fixen)

- Voorstel raakt `templates/shared/*` (bv. shared types) — orchestrator-beslissing nodig
- Voorstel raakt `supabase/functions/*` (edge functions) — `dgskills-supabase-edge` reviewer nodig
- Voorstel raakt `services/PermissionService.ts`, `services/supabase.ts`, of `supabase/migrations/*` (auth/RLS) — Yorin direct
- Voorstel suggereert nieuwe MCP-server, plugin-install, of build-tool wijziging — buiten fixer-scope
- Tweemaal achter elkaar mislukt voor zelfde voorstel — escaleer naar orchestrator

## Verificatie (na elke run)

- [ ] Output-rapport bevat ✅/⏭️/⚠️ secties met counts die kloppen
- [ ] Elke toegepaste fix heeft een file:regel anchor
- [ ] Geen Edit op file buiten whitelist
- [ ] Geen Bash-git-acties uitgevoerd
- [ ] Loop-preventie heeft eerdere attempts vergeleken (als `previousAttemptsLog` aanwezig)

## Referenties

- Detail-plan: `~/.claude/plans/m3-autonomous-build-loop.md`
- M3 orchestrator: `dgskills-build-mission`
- M2 review-format (waar Voorstel-blokken vandaan komen): `dgskills-design-reviewer`, `dgskills-didactiek-reviewer`, `dgskills-tech-reviewer` — alle drie hebben "Daadkrachtige aanpassings-voorstellen" sectie met before/after format
