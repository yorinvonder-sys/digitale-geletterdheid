# Mission-fixer rapport — cyclus 1 (fix-pass)

**Mission ID:** research-project
**Rapport-bron:** `business/dgskills-reviews/research-project-2026-06-17.md`
**Type:** Vervolg-fix-pass — dit is een fix-pass op het rapport van 2026-06-17 (2 weken oud). Eén van de 7 autofixable voorstellen was in een eerdere wave al toegepast; deze pass verwerkt de rest binnen de gegeven whitelist.
**Whitelist:**
- `src/features/missions/templates/data-viewer/configs/research-project.ts`
- `src/config/templateRegistry.ts` (alleen research-project entry)
- `src/config/agents/year1.tsx`, `year2.tsx`, `year3.tsx` (alleen research-project agent-rol entry)
- `src/config/slo-kerndoelen-mapping.ts` (alleen research-project entry)
- `src/config/curriculum.ts` (alleen research-project entry)
- `src/config/missionGoals.ts` (alleen research-project entry)

---

## ✅ Toegepaste fixes (3)

- `src/config/agents/year3.tsx:1841-1842` — Legacy `lab-teal` token vervangen door `duck-ink` in de `visualPreview` van de research-project agent-rol-entry (`bg-gradient-to-br from-lab-teal to-lab-teal` → `from-duck-ink to-duck-ink`; `bg-lab-teal/20` → `bg-duck-ink/20`). (Design, voorstel 3)
- `src/features/missions/templates/data-viewer/configs/research-project.ts:7` — `introTitle` van instructie-vorm naar leerlingperspectief: `'Voer een onderzoek uit'` → `'Jij bent de onderzoeker'`. (Didactiek, voorstel 6)
- `src/features/missions/templates/data-viewer/configs/research-project.ts:185` — `q8-eigen-beperking` (de zwaarste open reflectievraag) kreeg `points: 0`; dit is inconsistent met de andere `text-observation`-vragen die wél punten geven. Aangepast naar `points: 10`. **Puntenbalans geverifieerd:** som van alle vraagpunten was 90 (15+15+10+10+15+10+15+0), is nu 15+15+10+10+15+10+15+10 = **100** — dit klopt exact met de bestaande `maxScore: 100` op regel 191, dus `maxScore` hoefde niet aangepast te worden (rapport-suggestie "100 → 110" was niet nodig; de optelsom klopte al zonder die wijziging). (Didactiek, voorstel 7)

## ⏭️ Geskipte voorstellen (5)

- `research-project.ts` — **stale-rapport (voorstel 5, missionGoal ontbreekt):** het rapport van 17 juni stelde voor om `missionGoal.primaryGoal` toe te voegen aan de config omdat `missionGoals.ts` geen entry had. Geverifieerd met Read: `src/config/missionGoals.ts:301-308` heeft inmiddels een volledige `'research-project'`-entry (`primaryGoal`, `criteria`, `evidence`) — exact met de tekst die het rapport voorstelde. Dit is dus al elders opgelost (buiten deze config-file, via `missionGoals.ts`) en het onderliggende probleem (leeg doel in IntroScreen) bestaat niet meer. Geen actie nodig.
- `DataViewer.tsx:192` — **scope-violation (voorstel 1, `accent-[#D97848]` → `accent-duck-acid`):** raakt `src/features/missions/templates/data-viewer/DataViewer.tsx`, een gedeeld template-engine-bestand, niet in de whitelist voor deze missie-specifieke fix-pass.
- `DataViewer.tsx:674` — **scope-violation (voorstel 4, `aria-hidden` op ChevronLeft):** zelfde gedeelde engine-bestand, niet in whitelist.
- `SimpleChart.tsx:57,205` — **scope-violation (voorstel 11, inline color via tokens):** gedeeld template-engine-bestand (`SimpleChart.tsx`), niet in whitelist. Was in het oorspronkelijke rapport ook al als "geen actie, zie voorstel 2" genoteerd.
- `research-project.ts:86-91,198-216` — **onuitvoerbaar zoals voorgesteld (voorstel 2, hardcoded hex in chartData/badges):** het rapport-voorstel verwijst naar `import { DUCK_INK, DUCK_ACID } from '@/design/tokens'` — dit pad en deze constanten bestaan niet. Geverifieerd: het bestaande design-tokens-bestand is `src/config/designTokens.ts` met een `DUCK_COLORS`-object waarin de sleutel `ink: '#202023'` heet (matcht) maar er is geen `acid`-sleutel — de dichtstbijzijnde match heet `olive`/`gold` (beide `#e1ff01`). De huidige hardcoded waarden `'#202023'` en `'#e1ff01'` in `chartData`/`badges` zíjn overigens al exact de duck-ink/duck-acid hex-waarden — visueel dus al correct, alleen niet via een genoemde constante. Conform de taakregel "introduceer nooit niet-bestaande tokens" en "badge/chart-kleurvelden verwachten letterlijke hex-strings" is dit geen valide auto-fix: er bestaat geen correcte drop-in vervanging voor het voorgestelde `DUCK_INK`/`DUCK_ACID`-import zonder zelf een nieuwe constanten-naam te verzinnen, wat buiten de scope van een mechanische toepassing valt.

## ⚠️ Escalatie nodig (3)

- **Design-token-constante voor chartData/badges (voortzetting voorstel 2):** als hardcoded hex in `research-project.ts` structureel opgelost moet worden, is een concreet vervolgvoorstel nodig dat een écht bestaande constante gebruikt (bv. `DUCK_COLORS.ink` / `DUCK_COLORS.olive` uit `src/config/designTokens.ts`) — of een bewuste keuze om letterlijke hex te laten staan omdat de huidige waarden toch al duck-ink/duck-acid zijn. Vereist een herzien Voorstel-blok van de design-reviewer, niet zelfstandig door de fixer te verzinnen.
- **`enableChat` voor data-viewer (voorstel 8, ongewijzigd uit origineel rapport):** dataset 3 verwijst leerlingen naar Google Scholar/CBS/RIVM zonder AI-copiloot beschikbaar in de data-viewer zelf (`enableChat` staat niet aan). Blijft een product-beslissing voor Yorin — niet whitelisted en niet mechanisch toepasbaar.
- **`systemInstruction` client-side exposure (voorstel 10, ongewijzigd uit origineel rapport):** `year3.tsx:1855-1900` bevat de volledige systeminstructie als string in de client-bundle. Rapport vraagt te controleren of dit ook daadwerkelijk richting de AI-provider gaat via de client, of alleen als UI-referentie dient. Dit raakt mogelijk een security/architectuur-vraag (client-side prompt-exposure) — buiten fixer-scope, Yorin's review nodig.
- **`aria-live="polite"` op score-updates (voorstel 12, ongewijzigd uit origineel rapport):** raakt `PhaseHeader.tsx`, een gedeeld component buiten de whitelist.

## Volgende stap

Fixes toegepast (3 van de resterende 6 autofixable/relevante voorstellen; 1 was al elders opgelost, 3 vielen buiten whitelist, 1 was onuitvoerbaar zoals voorgesteld). Re-run M2 review om te bevestigen dat de toegepaste wijzigingen kloppen en om de overgebleven scope-violations/escalaties (chartData/badges-tokens, `enableChat`, `systemInstruction`-exposure, `aria-live`) opnieuw te beoordelen — mogelijk met een verbrede whitelist voor de gedeelde template-bestanden (`DataViewer.tsx`, `SimpleChart.tsx`, `PhaseHeader.tsx`) als Yorin die scope wil vrijgeven.
