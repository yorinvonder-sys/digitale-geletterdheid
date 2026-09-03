# Review: Web Developer — 2026-08-25 (templateType: builder-canvas)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 6/10

- **[warning]** `src/features/missions/templates/builder-canvas/sub/StepInstructionPanel.tsx:157` en `ChecklistItem.tsx:31` — de leerling-input en placeholder gebruiken dezelfde `/70`-opacity-tokens; contrastrisico geldt onverkort voor deze missie (geen mission-eigen overschrijving die het compenseert).
- **[warning]** `MilestoneToast.tsx:13` — mist `role="status"`/`aria-live`; deze missie heeft 4 stappen dus 4 momenten waarop de voortgangsbevestiging niet wordt voorgelezen.
- **[info]** `PreviewPanel.tsx` iconenlijst kent maar 4 iconen voor deze missie met 4 stappen — precies genoeg, geen probleem hier, maar breekt bij een vijfde stap.
- Geen missie-eigen designfouten gevonden in `web-developer.ts` zelf: teksten zijn consistent, tips zijn concreet en badge-drempels lopen logisch op (0/25/50/70/90).

## Didactiek — score 7/10

- Sterk: de 4 stappen volgen een reële developer-workflow (structuur → stijl → interactiviteit → testen), sluit aan bij SLO 22A/22B (web-technologie) en 19A (vso). Elke stap heeft een concrete, uitvoerbare instructie met codevoorbeelden in de tip.
- **[warning — geërfd van engine, hier concreet]** Scoring is presence-based: `minTextLength: 150` (stap 1-3) / `200` (stap 4) plus checklist-vinkjes bepalen de stappunten, en de checklist is zelfrapportage ("Ik gebruik semantische tags", "De navigatie gebruikt Flexbox"). Een leerling kan alle vinkjes aanvinken en een plausibel klinkende alinea van 150 tekens typen zonder daadwerkelijk werkende HTML/CSS/JS te hebben geschreven — er wordt geen code gevalideerd, alleen tekst over code. Voor een technische missie (web development) is dit een groter risico dan voor een reflectieve missie, omdat "correct" hier objectief toetsbaar zou zijn (bijv. of er een `<nav>`-tag met 3 links in de tekst staat) maar dat niet gebeurt.
- **[info]** Stap 4 (testen) vraagt terecht om edge cases, maar de checklist toetst alleen aanwezigheid van "3 testscenario's" en "1 verbetering" — niet of de scenario's inhoudelijk zinnig zijn. Dit is een instantie van de generieke engine-bevinding, hier zichtbaar in de didactische zwakte dat het "testen"-concept zelf niet wordt getoetst.
- `missionGoal` in de config en de entry in `missionGoals.ts` zijn consistent qua primaryGoal/evidence — geen drift tussen de twee bronnen.

## Tech — score 8/10

- Missie-eigen code is declaratief config (`webDeveloperConfig`) zonder eigen logica; de technische risico's zitten in de gedeelde engine (dubbele afronding, mijlpaal-toast-persistentie) en zijn daar al vastgesteld, niet hier opnieuw gescoord.
- Identiteit is coherent over de vier bronnen: `templateRegistry.ts:51` (`enableChat: true`, `chatRoleId: 'web-developer'`), `slo-kerndoelen-mapping.ts:117` (22A/22B, 19A vso), `curriculum.ts:188` (leerjaar 2, periode met o.a. algorithm-architect/network-navigator/app-prototyper), `src/config/agents/year2.tsx:693` (agent-rol aanwezig). `missionGoals.ts:564` komt overeen met `missionGoal` in de config zelf.
- `maxScore: 100` en de badge-drempels tellen logisch op; geen mismatch met de engine se `totalScore`-cap gevonden.
- Geen missie-eigen technische fouten (typos in ids, ontbrekende velden, kapotte checklist-structuur) aangetroffen in de 112 regels config.

## Voorstellen

Geen mechanische fixes binnen de missie-eigen whitelist-bestanden nodig — de gevonden problemen zitten in gedeelde componenten (`StepInstructionPanel.tsx`, `MilestoneToast.tsx`, `ChecklistItem.tsx`, `BuilderCanvas.tsx`) die al door de engine-review zijn opgepakt, of zijn didactisch van aard (geen code-validatie) en vergen een ontwerpkeuze, geen eenregelige patch.

Enige denkbare mission-eigen verbetering (niet auto-fixable, want vereist productbeslissing over strengere validatie):

```diff
- checklistItems: [
-     { id: 'nav-links', label: 'De navigatie heeft 3 werkende links' },
- ],
+ // Voorstel (geen patch, ontwerpkeuze): vervang zelfrapportage-checklist
+ // op termijn door een lichte tekstcontrole (bv. regex op '<nav' en 3x '<a')
+ // zodra de engine dat als optie ondersteunt.
```

## Samenvatting & verdict

De missie zelf (config, SLO-koppeling, curriculumplaatsing, agent-rol) is intern consistent en didactisch goed opgebouwd — vier realistische, opeenvolgende stappen met bruikbare tips. De belangrijkste zwakte is geërfd van de builder-canvas-engine: scoring is volledig presence-based, wat bij een technische missie als deze (waar code-correctheid objectief te toetsen zou zijn) zwaarder weegt dan bij een reflectieve missie. Daarnaast gelden de engine-brede contrast- en aria-live-bevindingen onverkort. Geen blocking bevindingen op missie-niveau.

**Verdict: ok** (met de bekende, elders al vastgestelde engine-warnings als randvoorwaarde — geen missie-specifieke blockers).
