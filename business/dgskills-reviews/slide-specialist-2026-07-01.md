# Mission-fixer rapport — cyclus 1 (fix-pass)

**Mission ID:** slide-specialist
**Rapport-bron:** `business/dgskills-reviews/slide-specialist-2026-06-17.md` (fix-pass, ~2 weken later)
**Whitelist:** `src/features/missions/templates/tool-guide/configs/slide-specialist.ts`, `src/config/templateRegistry.ts` (alleen slide-specialist-entry), `src/config/agents/year{1,2,3}.tsx` (alleen agent-rol-entry), `src/config/slo-kerndoelen-mapping.ts` (alleen entry), `src/config/curriculum.ts` (alleen entry), `src/config/missionGoals.ts` (alleen entry)

**Belangrijk:** het rapport van 2026-06-17 dateert van vóór deze fix-pass. Bij Read-verificatie bleek dat 6 van de 8 gerapporteerde issues (inclusief alle 4 blocking-items binnen mission-config-scope) al waren opgelost in de tussenliggende twee weken — waarschijnlijk in een eerdere fix-cyclus die niet in dit rapport is vastgelegd. Deze fix-pass past dus alleen toe wat nu nog daadwerkelijk in de code staat.

## ✅ Toegepaste fixes (1)

- `src/features/missions/templates/tool-guide/configs/slide-specialist.ts:23` — "klik er een aan" → "tik er een aan" (touchscreen-taal consistent met overige stappen) (sectie: design)

## ⏭️ Geskipte voorstellen (10)

- `slide-specialist.ts:113-116` — **stale-rapport (BLOCKING-D3):** badge[1].color staat al op `#202023`, niet meer `#ff3c21`. Al gefixt vóór deze pass.
- `slide-specialist.ts:71` — **stale-rapport (BLOCKING-D4):** "Animatievenster" komt niet meer voor; huidige tekst is al "Tik op **Afspelen** ... of start de **Diavoorstelling**". Al gefixt vóór deze pass.
- `slide-specialist.ts:83` — **stale-rapport (BLOCKING-D5):** "Zetelen" komt niet meer voor; huidige tekst is al "**Vervaag**, **Schuiven** of **Doelwit**". Al gefixt vóór deze pass.
- `slide-specialist.ts` — **stale-rapport (BLOCKING-DD1):** `learningObjectives`-array bestaat al (4 items, Bloom-geformuleerd, inhoudelijk vrijwel identiek aan het rapport-voorstel). Al gefixt vóór deze pass.
- `slide-specialist.ts:104` — **stale-rapport (⚠️ maxScore):** staat al op `55`, niet meer `60`. Al gefixt vóór deze pass.
- `slide-specialist.ts:47` — **prosa-zonder-snippet:** stap 2 (62w) inkorten door de parenthetische alternatieve-route te verwijderen. Rapport geeft geen letterlijk after-codeblok, alleen de instructie "verwijder alternatieve route, blijft ~46w" — niet machine-toepasbaar volgens fixer-scope. Vereist een menselijke/reviewer-beslissing over exacte herformulering.
- `slide-specialist.ts:51` — **prosa-zonder-snippet:** afbeelding-instructie zonder bronsturing. Geen concreet before/after-blok in het rapport, alleen een suggestie-richting.
- `slide-specialist.ts` (SLO-fit 21A, Bloom-niveau, curriculum-progressie, primaryGoal/introDescription-mismatch) — **prosa-zonder-snippet:** vier didactiek-aandachtspunten (⚠️, niet-blocking) zonder concreet toepasbaar before/after-codeblok in de mission-config-schema-vorm. Vereisen inhoudelijke/pedagogische afweging, niet mechanisch toe te passen.
- `ToolGuide.tsx` (BLOCKING-D1/D2/T2 — duck-tokens) — **buiten whitelist:** raakt het gedeelde engine-bestand `src/features/missions/templates/tool-guide/ToolGuide.tsx`, niet de mission-config. Rapport markeert dit zelf expliciet als "Fix in engine, niet in missie-config". Zie escalatie hieronder.
- `ToolGuide.tsx:157-159` (RichText-regex-kwetsbaarheid, nieuw ⚠️) — **buiten whitelist + n.v.t.:** raakt engine-bestand; bij Read-verificatie bleek de betreffende `replace(/^(Precies|Goed|Juist|Goed gedacht)!.../` regex niet meer in `ToolGuide.tsx` voor te komen — mogelijk al aangepast in de engine. Geen actie nodig binnen mission-config-scope.

## ⚠️ Escalatie nodig (1)

- **Scope-uitbreiding (engine-breed, geen actie meer nodig voor déze missie):** BLOCKING-D1/D2/T2 (duck-namespace tokens `duck-coral`, `duck-muted`, `duck-line`, `duck-creamDeep`) zijn geverifieerd tegen `tailwind.shared.js` — de `duck`-namespace bevat uitsluitend `bg/bgLight/ink/acid/gray/error`; de genoemde tokens bestaan niet en horen ook niet thuis in `duck-*` (het zijn `lab-*`-namen). Een grep op `src/features/missions/templates/tool-guide/` toont echter dat deze niet-bestaande tokens **niet meer voorkomen** in `ToolGuide.tsx` — de engine lijkt inmiddels los van deze missie gemigreerd (consistent met de reeds afgeronde duck-migratie elders in de repo). Voor `slide-specialist` is dit dus geen openstaande blocker meer; een verse M2-doorloop moet bevestigen of D1/D2/T2 nog gelden voor de engine als geheel.

## Volgende stap

Re-run M2 review (cyclus 2/3) om te bevestigen dat de resterende 4 blockers uit het 2026-06-17-rapport (D3, D4, D5, DD1) inderdaad al zijn opgelost en dat er geen nieuwe blockers zijn geïntroduceerd. De 2 prosa-only aandachtspunten (stap 2-lengte, afbeelding-bronsturing) en de 4 niet-blocking didactiek-punten vereisen een concreet before/after-voorstel in de volgende reviewronde voordat de fixer ze automatisch kan toepassen.
