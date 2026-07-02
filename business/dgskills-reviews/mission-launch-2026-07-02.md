# Missie-review: mission-launch ("De Lancering")

**Datum:** 2026-07-02
**Batch:** M4 wave 13 (verse review)
**Template:** tool-guide
**Config:** `src/features/missions/templates/tool-guide/configs/mission-launch.ts`

## Stap A — Registratie & scoreplafond

| Bron | Waarde | Status |
|---|---|---|
| Agent-rol | `src/config/agents/year1.tsx:3266` (yearGroup 1, mavo/havo/vwo) | OK |
| SLO-mapping (autoritair) | `src/config/slo-kerndoelen-mapping.ts:88` — `22A, 21B` (vo) / `19A, 18B` (vso) | OK |
| Curriculum-plaatsing | `src/config/curriculum.ts:133` — jaar 1, periode 4 "Eindproject" | OK |
| missionGoals | `src/config/missionGoals.ts:347` — `steps-complete min:4` | OK, matcht 4 steps exact |
| Briefing-afbeelding | `/assets/agents/de_lancering.webp` — bestaat (`public/assets/agents/de_lancering.webp` + `.png`) | OK |

**Scoreplafond (tool-guide verplicht nagerekend):**
- 4 stappen × 10 punten (checklist) = 40
- 4 verificationQuestions × 5 punten (bonus) = 20
- **Som = 60 → `maxScore: 60`** — klopt exact.
- Badge-drempel hoogste tier: `minScore: 55` (bij max 60) — bereikbaar, consistent (analoog aan print-pro-les).

**Feitelijke juistheid tool-instructies:** alle 4 stappen gecontroleerd — geen fouten.
- Stap 3 (CTA) bevat een portretrecht-vraag: "foto al openbaar op Instagram → toch toestemming vragen." Dit is juridisch correct (portretrecht/Auteurswet Art. 21 hangt niet af van of een foto al ergens publiek staat) en verwijst consistent terug naar Periode 3-leerstof (curriculum.ts P3 = privacy/data-missies, geverifieerd).
- Overige vuistregels (2 sec. aandachtsspanne, 5 sec. leesbaarheid, "groot = belangrijk") zijn standaard, onschadelijke marketing-/ontwerpprincipes voor onderbouw-niveau.

**Bevinding (LOW):** alle 3 badges gebruiken identieke kleur `#202023` (geen tier-differentiatie), terwijl vergelijkbare tool-guide-missies (`startup-pitch`, `cloud-commander`, `print-pro`) wél per-badge kleurvariatie hebben. Puur cosmetisch, geen functioneel effect.

## Stap B — UI/UX-review & screenshots

- Geen screenshots-map voor deze missie aanwezig — genoteerd, geen blocker.
- `mission-launch` komt NIET voor in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (0 treffers) — niet eerder los gereviewd in die sweep.

## Stap C — Rubrics (schaal 0-10, 10 = uitstekend)

| Rubric | Score | Toelichting |
|---|---|---|
| Design | 8.5 | Consistente duck-tokens via ToolGuide-engine; enige gemiste kans: identieke badge-kleuren over de 3 tiers (zie LOW-bevinding). |
| Didactiek | 9.0 | Heldere opbouw kop→boodschap→CTA→ontwerp; concrete, toetsbare vuistregels; sterke authentieke verificatie via `teacherCheck` op het echte artefact; geïntegreerde portretrecht-toets herhaalt eerdere leerstof zinvol. |
| Techniek | 9.5 | Scoreplafond klopt exact; alle 4 registratiebronnen (agent/SLO/curriculum/missionGoals) consistent; asset aanwezig; geen gebroken velden. |

**triageScore** = (10-8.5)\*0.3 + (10-9.0)\*0.4 + (10-9.5)\*0.3 = 0.45 + 0.40 + 0.15 = **1.00**

Lage triageScore → lage urgentie, geen ingrijpen nodig.

## Bekende platform-brede issues (niet herhaald als missie-specifiek)

- tool-guide rendert `learningObjectives` niet (engine-beperking).
- Chat-rol is dormant (platform-breed patroon).
- Briefing-afbeeldingen zijn platform-breed (niet deze missie-specifiek).
- Duck-tokens: alleen `bg/bgLight/ink/acid/gray/error` bestaan.

## Voorstel-blokken

Geen — er zijn geen wijzigingen voorgesteld. De badge-kleur-observatie is cosmetisch or gering genoeg (LOW, geen functioneel effect, consistent met minstens één zustermissie `magister-master`) om geen Voorstel-blok te rechtvaardigen in deze batch-pass.

## Conclusie

`mission-launch` is technisch en didactisch solide: scoreplafond klopt, alle registraties zijn consistent, en de tool-instructies zijn feitelijk correct — inclusief een goed geïntegreerde portretrecht-check. Geen wijzigingen vereist.
