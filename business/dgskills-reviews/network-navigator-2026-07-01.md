# Fix-pass: network-navigator — 2026-07-01

**Mission-ID:** network-navigator
**Fix-pass op:** [`network-navigator-2026-06-17.md`](./network-navigator-2026-06-17.md) (attempt 1)
**Uitvoerder:** Claude Sonnet 5 (dgskills-mission-fixer, wave 4)
**Whitelist:** `data-viewer/configs/network-navigator.ts`, `templateRegistry.ts` (entry), `agents/year{1,2,3}.tsx` (entry), `slo-kerndoelen-mapping.ts` (entry), `curriculum.ts` (entry), `missionGoals.ts` (entry)

---

## ✅ Toegepaste fixes (1)

- `src/features/missions/templates/data-viewer/configs/network-navigator.ts:96-101` — Hardcoded hex (`#202023`/`#ff3c21`/`#e1ff01`) verwijderd uit `chartData`. `SimpleChart.tsx` valt nu terug op `DEFAULT_COLORS`, wat exact dezelfde duck-tokenwaarden zijn (`#ff3c21`, `#202023`, `#e1ff01`) — visueel gelijkwaardig, geen hardcoded hex meer in de missie-config. (sectie: design, rapport-punt "Hardcoded hex in config — chartData")

---

## ⏭️ Geskipte voorstellen (2)

- `src/features/missions/templates/data-viewer/configs/network-navigator.ts:198-222` (badge-hex) — **voorstel-inconsistent:** het rapport stelt `color: 'duck-ink'` voor (kale tokennaam), maar `BadgeConfig.color: string` in `templates/shared/types.ts:49` is expliciet gedocumenteerd als `// tailwind-compatible color like '#202023'` — een letterlijke hex-string, geen tokennaam. Er bestaat bovendien géén CSS custom property `--duck-ink` in de codebase (geverifieerd: geen `:root`-declaratie), dus ook Optie B uit het chart-voorstel (`var(--duck-ink)`) zou een stille no-op zijn. De huidige hex (`#202023`) is al exact duck-ink; toepassen van het letterlijke voorstel zou een ongeldige waarde introduceren zonder functionele winst. Niet toegepast.
- `src/features/missions/templates/data-viewer/configs/network-navigator.ts:119` (q5-tolerantie) — **prose-only:** "Overweeg een ruimere tolerantie (10%) of een `text-observation`-type" is een aanbeveling zonder concreet before/after-codeblok (geen gewijzigde `correctAnswer`-waarde, geen nieuw veld voorgesteld). Volgens de fixer-scope alleen machine-leesbare voorstellen toepassen.

---

## ⚠️ Escalatie nodig (2)

- **Scope-uitbreiding — a11y in gedeelde template-component:** 4 voorstellen raken `src/features/missions/templates/data-viewer/DataViewer.tsx` en `sub/InteractiveTable.tsx` (gedeelde engine, niet missie-specifiek, buiten whitelist):
  - `DataViewer.tsx:237,448` — nutteloze gradient (`from-duck-acid to-duck-acid` → `bg-duck-acid`)
  - `DataViewer.tsx:191` — hardcoded `accent-[#D97848]` → `accent-duck-*`
  - `InteractiveTable.tsx:90` — ontbrekend `aria-sort`/`role="columnheader"` op sorteerbare tabelkoppen
  - `InteractiveTable.tsx:64-73` — ontbrekend `aria-label` op filterinputs
  Deze zijn template-breed (alle data-viewer-missies delen deze component) en vereisen orchestrator-beslissing over scope-uitbreiding, niet een missie-specifieke edit.
- **goalCriteria type-mismatch (herbevestigd, nog open):** `network-navigator.ts:13` en `missionGoals.ts:734` zeggen `type: 'rounds-complete'`; `year2.tsx:1112` zegt `type: 'steps-complete'`. Beide strings zijn geldig volgens `MissionGoalCriteriaType` in `templates/shared/types.ts:4-8` (geen TS-fout), dus dit is geen hard blokkerende bug — maar ik heb **geen consumer gevonden** die `goalCriteria.type` daadwerkelijk uitleest om voltooiing te bepalen (repo-brede grep op `goalCriteria.type`/`criteria.type ===` gaf 0 treffers buiten de config-bestanden zelf). Het rapport geeft zelf geen eenduidig after-voorstel ("of 'steps-complete'"), dus dit blijft een engine-gedrag-vraag die Yorin/orchestrator moet verifiëren voordat één kant als "correct" wordt gekozen — niet iets wat de fixer zelf mag beslissen.

---

## Volgende stap

Re-run M2 review (cyclus 2) om te bevestigen dat de chart-hex-fix het designpunt sluit. De twee escalaties (shared-component a11y + goalCriteria-consumer) blijven open en vereisen een beslissing buiten fixer-scope.
