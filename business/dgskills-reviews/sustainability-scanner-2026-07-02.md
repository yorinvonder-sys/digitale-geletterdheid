# Missie-review: sustainability-scanner

**Datum:** 2026-07-02
**Wave:** 16 (verse review)
**TemplateType:** data-viewer
**Config:** `src/features/missions/templates/data-viewer/configs/sustainability-scanner.ts`

## Registratie-check (compleet)

Alle verplichte registratiepunten bestaan en zijn consistent:
- `RoleId`-union (`src/types.ts:41`)
- `AGENT_ROLE_IDS` (`src/config/agentRoleIds.ts:74`)
- `templateRegistry.ts:80` → `{ missionId: 'sustainability-scanner', templateType: 'data-viewer' }`
- Agent-rol (`src/config/agents/year2.tsx:2423-2457`)
- SLO-mapping (`src/config/slo-kerndoelen-mapping.ts:143`) — `sloKerndoelen: ['23C']`, `sloVsoKerndoelen: ['20B']`
- Curriculumplaatsing (`src/config/curriculum.ts:224`) — jaar 2, periode 4 "Ethiek, Maatschappij & Eindproject", `sloFocus: ['23A','23B','23C','21D']`
- `missionGoals.ts:798` — score-threshold 65
- `basisvaardigheden-mapping.ts:533` — STATISTIEK, ETHIEK
- `missionThumbnails.ts:74` — thumbnail bestaat op schijf

Geen vermelding in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` en geen `.ui-review/`-screenshots voor deze missie — geen visuele referentiedata beschikbaar voor deze review.

## Data-viewer rekencheck (verplicht)

Alle drie datasets nagerekend tegen de brondata, inclusief downstream-cascade:

| Vraag | Type | Berekening | Config-antwoord | Klopt? |
|---|---|---|---|---|
| q1 | multiple-choice | max(gebruikers_wereld_mln) | Berichten sturen (2100) | ✓ |
| q2 | number-input | 85 min/dag × 7 | 595 | ✓ |
| q3 | text-observation | — (participatiepunten) | — | ✓ |
| q4 | number-input | 54+22+7 (smartphone+laptop+tablet) | 83 | ✓ |
| q5 | multiple-choice | max(smart-tv 13, console 4) | Smart-tv | ✓ |
| q6 | text-observation | — (participatiepunten) | — | ✓ |
| q7 | multiple-choice | 2u × 3GB/u | 6 GB/dag | ✓ |
| q8 | text-observation | — (0 participatiepunten) | — | ✓ (zie puntensom) |

Pie-chart-som (dataset 2): 54+22+13+7+4 = 100% — klopt.

**Puntensom vs maxScore:** 40 (ds1) + 35 (ds2) + 15 (ds3) = 90, maxScore=100. Gat van 10 punten door `q8` (laatste text-observation, `points: 0`). Dit is een **consistent cross-missie ontwerppatroon** (zelfde `points: 0` op de slot-reflectievraag in `eindproject-j2.ts`, `tech-impact-analyst.ts`, `ux-detective.ts`) — geen missie-specifiek defect, dus niet gefixt volgens scope (alleen ondubbelzinnige, missie-unieke participatiepunten-gevallen fixen).

**Duurzaamheidsclaims:** geen — de content bevat geen enkele milieu-/duurzaamheidsclaim (data gaat over digitale mediaconsumptie: gaming, streaming, social media, berichten). Geen greenwashing- of doembeeld-risico, want er wordt niets over duurzaamheid beweerd. Zie wel bevinding D1 over de naamgeving.

## Bevindingen

### D1 — Missienaam/icoon suggereert duurzaamheid, content gaat over mediaconsumptie-trends (Design)
`missionId`/`title` (config-titel "Trend Scanner", RoleId "sustainability-scanner") en het `Leaf`-icoon (`year2.tsx:2427,2439`) wekken de indruk dat de missie over milieu/duurzaamheid gaat. De volledige inhoud (3 datasets, 8 vragen) gaat echter over digitale gebruikstrends — gaming, streaming, sociale media, apparaatgebruik, dataverbruik, PEGI, schermtijd, aanbevelingsalgoritmen. Er is geen enkel duurzaamheids- of milieu-gerelateerd element. Dit is verwarrend voor docenten die missies zoeken op onderwerp (bijv. voor een duurzaamheidsproject) en voor leerlingen die de titel "Trend Scanner" lezen zonder duidelijke koppeling naar het label "sustainability".

**Voorstel:** Hernoem het `Leaf`-icoon naar een icoon dat past bij data/trends (bijv. `TrendingUp` of het al gebruikte `BarChart2`, dat elders in dezelfde agents-file wordt geïmporteerd). Grotere ingreep (missionId/RoleId hernoemen naar bijv. `digital-trend-scanner`) raakt 8+ registratiebestanden en valt buiten de scope van deze review — alleen signaleren.

```tsx
// src/config/agents/year2.tsx — regel 2427 en 2439
// Voor:
icon: <Leaf size={28} />,
...
<Leaf size={64} className="text-white/80 drop-shadow-lg" />

// Na (voorstel, buiten scope van deze review om zelf toe te passen):
icon: <BarChart2 size={28} />,
...
<BarChart2 size={64} className="text-white/80 drop-shadow-lg" />
```

### D2 — SLO-tag (23C) sluit niet aan bij systemInstruction (21C/22A) en bij de content (Didactiek)
De autoritaire SLO-mapping tagt de missie met `23C` (Maatschappij), passend bij de curriculumplaatsing (jaar 2, periode 4 "Ethiek, Maatschappij & Eindproject"). De `systemInstruction` in de agent-rol (`year2.tsx:2450`) citeert echter expliciet **"SLO KERNDOELEN: 21C (Informatie verwerken en analyseren), 22A (Digitale media begrijpen en gebruiken)"** — geen van beide is 23C. Belangrijker: de content zelf bevat geen enkele ethische afweging of maatschappelijke reflectievraag (in tegenstelling tot de andere periode-4-missies zoals `ai-ethicus`, `tech-court`, `digital-rights-defender`) — alle 8 vragen zijn zuivere datalees- en rekenvragen. Inhoudelijk hoort deze missie qua vaardigheid dichter bij data-analyse (21C) dan bij maatschappij/ethiek (23C).

**Voorstel:** Corrigeer de systemInstruction-tekst zodat die het werkelijke SLO-doel (23C) citeert i.p.v. 21C/22A, óf — als de intentie is dat dit een data-analyse-missie is — heroverweeg de curriculumplaatsing/SLO-tag naar 21C in een aparte periode-3-achtige dataslot. Binnen scope van deze review: minimaal de systemInstruction-tekst laten kloppen met de autoritaire SLO-mapping.

```tsx
// src/config/agents/year2.tsx — regel 2450
// Voor:
SLO KERNDOELEN: 21C (Informatie verwerken en analyseren), 22A (Digitale media begrijpen en gebruiken).

// Na (voorstel):
SLO KERNDOELEN: 23C (Maatschappij — digitale gebruikstrends als maatschappelijk fenomeen).
```

### T1 — `briefingImage` verwijst naar niet-bestaand asset (Techniek)
`briefingImage: '/assets/agents/sustainability-scanner.webp'` (`year2.tsx:2432`) bestaat niet in `public/assets/agents/`. De missiethumbnail (`missionThumbnails.ts:74` → `/assets/previews/project_sustainability_scanner.webp`) bestaat wél. `MissionBriefing.tsx` heeft een `onError`-fallback naar het rol-icoon (`Leaf`), dus dit crasht niets — maar de briefing-ervaring degradeert stil naar een icoon-placeholder in plaats van een echte briefing-foto, zoals andere missies wél tonen.

**Voorstel:** Plaats het ontbrekende asset op `public/assets/agents/sustainability-scanner.webp`, of verwijder de `briefingImage`-regel als er geen beeld beschikbaar is (dan valt de sectie automatisch weg via de bestaande `role.briefingImage &&`-guard in `MissionBriefing.tsx:97`).

```tsx
// src/config/agents/year2.tsx — regel 2432
// Als geen asset beschikbaar komt, voorstel om de regel te verwijderen i.p.v. te laten wijzen naar een 404:
// (regel 2432 weglaten)
```

## Samenvatting

Techniek is solide: alle rekenmodellen kloppen aantoonbaar, de registratie is compleet over alle 8+ bronbestanden, en de engine-integratie werkt zoals verwacht. De belangrijkste zwakte zit in de identiteit van de missie: naam, icoon en SLO-tag/systemInstruction wijzen inconsistent naar "duurzaamheid" versus "data-analyse" versus "maatschappij/ethiek", terwijl de content zelf eenduidig over digitale mediaconsumptie-trends gaat zonder ethische reflectiecomponent. Dat is geen crash-risico maar wel een didactische scherpte die de missie mist t.o.v. de andere periode-4-missies waar hij tussen staat.

## Rubric-scores (0-10, 10=uitstekend)

- **Design: 7/10** — functioneel en on-brand, maar naam/icoon-mismatch (D1) en ontbrekend briefing-asset (T1, ook designimpact) verzwakken de content-discovery en briefing-ervaring.
- **Didactiek: 6/10** — rekenvragen zijn didactisch sterk (concrete vergelijkingen, heldere explanations, relevante takeaways), maar de SLO-tag/systemInstruction-mismatch (D2) en het ontbreken van een maatschappelijke/ethische reflectievraag in een "Ethiek & Maatschappij"-periode is een reëel gat t.o.v. de missie-intentie.
- **Techniek: 8/10** — alle antwoordmodellen kloppen aantoonbaar tegen de dataset, volledige en correcte registratie; enige min is het ontbrekende briefing-asset (T1).

**triageScore = (10-7)×0.3 + (10-6)×0.4 + (10-8)×0.3 = 3.1**
