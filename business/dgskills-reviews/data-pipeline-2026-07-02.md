# Missiereview: data-pipeline

**Datum:** 2026-07-02
**Wave:** 12 (verse review)
**TemplateType:** data-viewer
**Config:** `src/features/missions/templates/data-viewer/configs/data-pipeline.ts`
**Agent-rol:** `src/config/agents/year3.tsx:268`
**Curriculum:** Leerjaar 3, periode 1 ("Geavanceerd Programmeren & AI"), havo/vwo
**SLO-kerndoelen:** 21C (Data & Dataverwerking), 22B (Programmeren)

## Stap A — Inhoudelijke verificatie

### Rekenwerk nagerekend (VERPLICHT voor data-viewer)

| Vraag | Type | Config-antwoord | Herberekend | Klopt? |
|---|---|---|---|---|
| q1-problemen-tellen | number-input | 5 | 5 (duplicaat 08:00, missende waarde 09:00, inconsistente naam+fout getal 10:00, verkeerd datumformaat 11:00, onmogelijke waarde 12:00) | ✅ |
| q4-verschil-lokaal3a | number-input | 26.2 | 47.8 − 21.6 = 26.2 | ✅ |
| q2, q3, q5, q6, q7, q8 | multiple-choice / text-observation | — | Inhoudelijk correct en didactisch verantwoord (imputatie-redenering, ETL-stappen, transformatiestrategie-keuze) | ✅ |

Geen rekenfouten gevonden. `number-input`-antwoorden zijn exact (5% tolerantie is hier niet eens nodig, beide zijn hele/precieze getallen).

### Puntensom vs maxScore

Som van alle `points`: 15+15+10 (dataset 1) + 15+10+10 (dataset 2) + 15+0 (dataset 3) = **90**.
`maxScore: 100`.

Dit is een bekend, terugkerend patroon in de data-viewer engine (7 van 15 configs hebben dezelfde 90/100- of 85/100-mismatch: `digital-divide-researcher`, `eindproject-j2`, `neural-navigator`, `sustainability-scanner`, `tech-impact-analyst`, `ux-detective`, `data-pipeline`). Er is geen `followUp.bonusPoints`-blok in deze config dat het gat dicht. Gevolg: 100/100 is structureel onbereikbaar, maar de badge-drempel (85 voor "Data Engineer Pro!") blijft ruim haalbaar op 90. **Geen blokkerend issue** — engine-brede pattern, wordt hieronder als Voorstel meegegeven maar niet als show-stopper behandeld.

### Agent-briefing match

`systemInstruction` in `year3.tsx:293-319` sluit inhoudelijk goed aan bij de config: ETL-stappen (Extract/Transform/Load), dezelfde dataproblemen (missende waarden, duplicaten, inconsistente formaten) en dezelfde SLO-kerndoelen (21C, 22B) worden expliciet genoemd. Voorbeeld "sensordata" in de briefing matcht 1-op-1 met de dataset. Geen inhoudelijke mismatch.

### SLO-mapping

`slo-kerndoelen-mapping.ts:157`: `sloKerndoelen: ['21C', '22B']`. Klopt met de agent-briefing en met de missie-inhoud (dataverwerking + procesontwerp). Curriculum-plaatsing (`curriculum.ts:257`, periode 1 sloFocus `['22B','21D','21C']`) is consistent.

### missionGoals

`missionGoals.ts:744-752`: `score-threshold` op 65, evidence-tekst noemt "vijf datakwaliteitsproblemen" en "garbage in, garbage out" — beide letterlijk terug te vinden in de config (q1 antwoord = 5, takeaway #5). Coherent.

## Stap B — Visuele/UX-status

- Geen screenshots-map aanwezig voor `data-pipeline` in `.ui-review/`.
- Geen vermelding van `data-pipeline` in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` — niet in de live wave-1-UI/UX-sweep meegenomen.
- Bekend engine-baseline (niet herhalen als issue): data-viewer a11y-set + hex-tokenisatie in chartData/badges (`#ff3c21`, `#202023`, `#e1ff01`) is een platformbreed patroon, niet mission-specifiek. `briefingImage: '/assets/agents/data-pipeline.webp'` ontbreekt in `public/assets/agents/` — maar dit geldt voor **alle 24 missies** in `year3.tsx` (100% van de briefingImage-referenties mist het bestand), dus platformbreed asset-pipeline-gat, geen mission-specifiek issue.

## Stap C — Rubrics (schaal 0-10, 10 = uitstekend)

### Design (gewicht 0.3)
- Hex-kleuren in chartData en badges volgen het bekende engine-patroon (geen `duck-*`-tokens in de config zelf, wat verwacht is want data zit los van de DataViewer-component styling).
- Drie datasettypes (table/bar-chart/document-cards) worden afgewisseld — goede visuele variatie binnen de missie.
- Score: **8/10** (helder opgebouwd, geen mission-specifieke visuele fouten; puntenaftrek voor het ontbrekende briefingImage-asset, ook al is dat platformbreed).

### Didactiek (gewicht 0.4)
- Sterke leerlijn: probleem herkennen (dataset 1) → kwantitatief effect zien (dataset 2) → strategie kiezen (dataset 3). Klassieke ETL-opbouw.
- Rekenvragen zijn inhoudelijk zinvol (niet willekeurig) en de explanations onderbouwen het "waarom", niet alleen het "wat".
- text-observation-vragen (q3, q6, q8) vragen om eigen redenering i.p.v. reproductie — goed tegen shallow interaction.
- Klein punt: q8 geeft 0 punten (`points: 0`) voor een text-observation-vraag — ongebruikelijk (meestal 10-15 participatiepunten). Functioneel geen bug (text-observation krijgt sowieso "always participation points" = 0 hier), maar didactisch een gemiste kans om reflectie te belonen.
- Score: **7/10** (sterke opbouw, klein optimalisatiepunt bij q8).

### Techniek (gewicht 0.3)
- Alle dataset-types (`table`, `bar-chart`, `document-cards`) zijn geldige engine-types.
- Rekenkundig correct (q1, q4 geverifieerd).
- `maxScore`/puntensom-mismatch (90 vs 100) is aanwezig maar niet blokkerend en engine-breed.
- Geen prompt-injection- of state-risico's specifiek aan deze config (data-viewer heeft geen vrije leerling-tekst-naar-AI-pad binnen de template zelf; chat-interactie loopt via de gedeelde agent-rol).
- Score: **8/10**.

### Triage-score

```
triageScore = (10-8)*0.3 + (10-7)*0.4 + (10-8)*0.3
            = 2*0.3 + 3*0.4 + 2*0.3
            = 0.6 + 1.2 + 0.6
            = 2.4
```

**triageScore = 2.4** (lager = beter; missie is in goede staat, geen urgente actie nodig).

## Voorstel-blokken

### Voorstel 1 — puntensom optioneel gelijktrekken met maxScore (LAAG, niet blokkerend)

Betreft engine-breed patroon (7/15 configs), dus alleen ter overweging als losse opschoning, niet als fix voor deze missie alleen. Twee opties indien ooit opgepakt:
- (a) `maxScore: 90` zetten i.p.v. 100, of
- (b) q8 van 0 naar 10 punten optrekken (sluit ook aan bij Voorstel 2) zodat de som 100 wordt.

```diff
- points: 0,
+ points: 10,
```
(in `q8-pipeline-reflectie`, gecombineerd met bovenstaande punt over reflectie belonen)

### Voorstel 2 — q8 participatiepunten toekennen (LAAG)

`q8-pipeline-reflectie` is een text-observation-vraag (altijd volledige participatiepunten bij text-observation) maar heeft `points: 0` ingesteld, waardoor de leerling geen enkel punt krijgt voor een doordachte reflectie-vraag over de nadelen van imputatie. Vergelijkbare text-observation-vragen in dezelfde config (q3, q6) geven 10 punten. Aanbeveling: verhoog naar 10 punten voor consistentie én om reflectie te belonen (lost tegelijk Voorstel 1 op).

## Conclusie

`data-pipeline` is inhoudelijk correct (alle rekenwerk geverifieerd), didactisch sterk opgebouwd (ETL-leerlijn met oplopende complexiteit) en technisch stabiel. De enige twee bevindingen (puntensom-gat, q8 op 0 punten) zijn laag-risico en niet blokkerend — geen show-stoppers. Platformbrede/engine-gerelateerde patronen (ontbrekend briefingImage-asset, hex-tokenisatie, a11y-baseline) zijn bewust niet als mission-specifiek issue gerapporteerd conform bekend engine-gedrag.
