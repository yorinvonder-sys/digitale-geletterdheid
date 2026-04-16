# Runtime-audit: network-navigator
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave2-dataviewer
- Status: PASS

**Referentie-sanity-check: PASS**

## Functioneel (code-level)
- [PASS] Config compleet — title, 3 datasets (table, bar-chart, document-cards), questions, answers, badges, takeaways volledig aanwezig
- [PASS] Data/antwoord-consistentie — alle berekeningen geverifieerd:
  - q1: 1+3+8+22+5+20+2 = 61 ms ✓
  - q4: Google.nl = 8 ms = laagste ✓
  - q5: 45 ÷ 8 = 5,625 → correctAnswer: 5.6 — 5% tolerantie in scoreQuestion dekt dit ✓
  - q7: 404 = "Pagina niet gevonden" ✓
- [N.V.T.] EERSTE_BERICHT — geen enableChat; N.v.t.
- [PASS] Terminal states — 3 datasets → results bereikbaar. q8 heeft points: 0 (open reflectievraag), bewust.

## Visueel (code-level)
- [PASS] Responsive — max-w-lg + px-4 consistent met template.
- [PASS] Tabel/grafiek-overflow — InteractiveTable (overflow-x-auto), SimpleChart voor bar-chart.
- [PASS] Design tokens — kleuren consistent (#D97757, #3B82F6 etc.).

## Didactiek
- SLO-audit quote: (missie niet aanwezig in didactische-audit-2026-03-07 als expliciete rij; mapping in slo-kerndoelen-mapping.ts)
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:114` → `['21A']` — terecht: netwerken begrijpen + functioneel werken met netwerktechnologie.
- UI-koppeling: Tabel met stapnummers (sorteerbaar op stap/tijd) koppelt direct aan q1 (totaaltijd berekenen) en q3 (observatie latency). document-cards dataset koppelt HTTP-codes aan q7/q8. Bloom-niveau: Begrijpen (q2, q7) + Analyseren (q3, q6) — passend voor leerjaar 2.

## Bevindingen (severity)
Geen bevindingen.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/network-navigator.ts`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:114`
