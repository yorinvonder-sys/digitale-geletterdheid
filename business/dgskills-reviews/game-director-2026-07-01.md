# Mission-fixer rapport — game-director (fix-pass op 2026-06-17 review)

**Mission ID:** game-director
**Rapport-bron:** `business/dgskills-reviews/game-director-2026-06-17.md`
**Fix-pass datum:** 2026-07-01
**Cyclus:** 1

Dit is een fix-pass op het reviewrapport van 2026-06-17. De repo is sindsdien 2 weken doorontwikkeld; elk voorstel is vóór toepassing geverifieerd tegen de huidige code (Read-check op de `before`-snippet). Geen enkel voorstel bleek stale.

**Whitelist:**
- `src/features/missions/GameDirectorMission.tsx`
- `src/features/missions/game-director/**`
- `src/config/templateRegistry.ts` (game-director entry)
- `src/config/agents/year1.tsx`, `year2.tsx`, `year3.tsx` (game-director entry)
- `src/config/slo-kerndoelen-mapping.ts` (game-director entry)
- `src/config/curriculum.ts` (game-director entry)
- `src/config/missionGoals.ts` (game-director entry)

---

## ✅ Toegepaste fixes (7)

- `src/features/missions/GameDirectorMission.tsx:55` — Level 1-check gecorrigeerd van positie-check (`ctx.player.x > 150`) naar `ctx.reachedGoal`, consistent met levels 2-5. Leerling kan Level 1 niet meer "halen" zonder het doel te bereiken. (tech)
- `src/features/missions/GameDirectorMission.tsx:845` — Hover-state van de "Volgende"-knop gefixt: `hover:bg-duck-ink` (identiek aan rust) → `hover:opacity-80`. Leerling krijgt nu visuele feedback bij hover. (design)
- `src/features/missions/GameDirectorMission.tsx:951` — Mobiele game-canvas-container kreeg `min-h-[280px]` toegevoegd zodat de `flex-1`-hoogte niet kan inklappen op mobiel. (design — visueel niet opnieuw geverifieerd met screenshot, wel de structurele fix uit het rapport toegepast)
- `src/features/missions/GameDirectorMission.tsx:966` — Play/stop-overlay-knop kreeg `aria-label={isPlaying ? 'Stop game' : 'Start game'}`. Screenreadergebruikers horen nu een betekenisvol label i.p.v. enkel "button". (design)
- `src/features/missions/GameDirectorMission.tsx:873` — `roleId="game-director"` toegevoegd aan de `StudentAIChat`-aanroep. De AI-coach gebruikt nu de Game Design Coach-systemInstruction i.p.v. de generieke `student-assistant`-fallback. **Dit was de belangrijkste openstaande blokker uit zowel de mei- als juni-review.** (didactiek + tech blokker)
- `src/features/student/ProjectZeroDashboard.tsx:143` — SLO-metadata gecorrigeerd van `['22A', '22B']` naar `['22B']`, consistent met de autoritaire bron `src/config/slo-kerndoelen-mapping.ts:49` (die al `['22B']` claimde). (didactiek)
- `src/config/agents/year1.tsx:200` — `goalCriteria.min` gecorrigeerd van `3` naar `5`, consistent met de werkelijke 5 challenges in de missie. (didactiek)

## ✅ Toegepaste fix met kanttekening (1)

- `src/features/missions/game-director/BlockTypes.ts:6-20` — `BlockInput.default: any`, `options[].value: any` en `PlacedBlock.inputs: Record<string, any>` vervangen door een nieuwe `type BlockInputValue = string | number` (letterlijk het voorgestelde `default`/`inputs`-deel uit het rapport; `options[].value` is meegenomen omdat die anders inconsistent zou blijven met de nieuwe alias binnen hetzelfde interface — geen ander bestand geraakt).
  - **Kanttekening:** de `execute`-signature op `BlockTypes.ts:56` (`inputs: Record<string, any>`) is bewust **niet** aangepast — dat stond niet in de before/after-snippet van het rapport en een halve migratie kon een half-getypeerd contract opleveren. `npx vite build` is groen, maar `vite` typecheckt niet (esbuild) en lokale `tsc` faalt in deze omgeving met `TS5103` (bekende omgevingsfout, niet code-gerelateerd — zie `project_typecheck_ts6_env`). **Type-veiligheid van deze wijziging is dus NIET lokaal bevestigd; de CI-`tsc`-gate is de enige betrouwbare check.** Als CI een mismatch tussen `BlockInputValue` en de resterende `any` in de `execute`-signature meldt, is de vervolgstap: de signature op regel 56 consistent meenemen (buiten dit voorstel, dus met Yorin afstemmen of dat binnen fixer-scope valt).

## ⏭️ Geskipte voorstellen (0)

Geen enkel voorstel was stale, buiten whitelist, of zonder concrete before/after-snippet.

## ⚠️ Escalatie nodig (2 — geen auto-fix mogelijk)

- **Dashboardbeschrijving vs missie-inhoud (prosa-only, geen snippet):** het rapport signaleerde dat de dashboardtekst "Word de architect. Herschrijf de natuurwetten en ontwerp je eigen game-regelset." productontwerp (22A) suggereert, terwijl de missie uitsluitend functioneel programmeren (22B) checkt. Het rapport gaf twee alternatieve richtingen zonder concrete before/after-code (òf tekst aanpassen, òf een ontwerp-reflectievraag toevoegen) — dit is een tekstuele/didactische keuze die Yorin moet maken, geen machine-toepasbaar voorstel. **Bestand:** `src/config/agents/year1.tsx` (description-veld, game-director entry).
- **Reflectievraag te open voor onderbouw J1 (prosa-only, geen snippet):** het rapport signaleerde dat "Wat heb je geleerd? Waar kom je dit nog meer tegen?" cognitief zwaar is zonder structuur, maar gaf geen concrete vervangende prompt-tekst. Didactische tekstkeuze, geen auto-fix. **Bestand:** `src/features/missions/GameDirectorMission.tsx` (reflectie-placeholder/vraag, regel ~759/763).

Beide escalaties zijn **prosa-only voorstellen** (skill-anti-patroon: "voorstellen uit prosa zonder concrete before/after snippet niet toepassen"), geen security/RLS/AI-act-issues.

## Volgende stap

Re-run M2 review (cyclus 2) om te bevestigen dat de twee mei/juni-blokkers (roleId + Level 1-check-inconsistentie) nu zijn opgelost, en om de mobiele canvas-hoogtefix visueel te verifiëren met een echte screenshot (nog steeds niet beschikbaar in `screenshots/assignments/game-director/`). CI-`tsc` moet bevestigen dat de `BlockTypes.ts`-typewijziging geen mismatch introduceert met de ongewijzigde `execute`-signature.
