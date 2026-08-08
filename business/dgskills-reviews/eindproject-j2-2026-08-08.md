# Review Eindproject Jaar 2 — J2P4

**Datum:** 2026-08-08  · **SHA:** `d157905851f22842a8b9bf5c40ff16b29cdf907c`  · **Type:** volledige lokale interne-browserflow  · **Advies:** fix-eerst

## Design

De tabel, gemiddelden, tips, feedback en resultaatstaat zijn in vier viewports vastgelegd. De portretcapture is 820×1015 bij CSS 820×1180; `Echte iPad-check nodig`. Foute antwoorden tonen feedback maar dezelfde vraag kan niet opnieuw worden beantwoord.

## Didactiek

De zichtbare flow is datasetanalyse en eindigt met een score; er is geen projectplan, productbouw, feedbackronde of presentatie. Dat botst met het capstone-agentcontract (`src/config/agents/year2.tsx:2550-2560`) en de mission-builder-intentie (`missionBuilder.tsx:108-109`). Q7 markeert Tip 1 als correct (`configs/eindproject-j2.ts:184-196`), terwijl de tabel voor Iris Tip 2 en een hogere originaliteit toont; de causaliteit is niet datagedragen.

## Techniek

De config/goal noemt 65%, maar de DataViewer completion callback accepteert 40% (`DataViewer.tsx:900-904`, `missionGoals.ts:817-833`). `clearSave()` staat vóór duurzame completion. Dit kan completion/XP bij 40–64% en saveverlies bij RPC-falen veroorzaken.

## Browserbewijs

Evidence-root: `.../eindproject-j2/manifest.json` onder dezelfde batchroot.

| Formaat | Start | Flow | Foutfeedback | Recovery | Eind/CTA |
|---|---:|---:|---:|---:|---:|
| Desktop 1440×900 | ja | ja | ja | nee | ja |
| Tablet staand CSS 820×1180 (capture 820×1015) | ja | ja | ja | nee | ja |
| Tablet liggend 1180×820 | ja | ja | ja | nee | ja |
| Mobiel 390×844 | ja | ja | ja | nee | ja |

## Bevindingen

1. **HIGH — capstone-mismatch:** geen plan/product/presentatiebewijs.
2. **HIGH — completion gate:** zichtbare 65%-grens en 40%-callback spreken elkaar tegen.
3. **HIGH kandidaat — autosave:** local save wordt vóór durable completion gewist.
4. **MEDIUM/HIGH — q7:** Tip 1 (Elif, originaliteit 8) wordt exclusief correct verklaard, terwijl Tip 2 (Iris, originaliteit 9) een hogere waargenomen originaliteit heeft; beide eindcijfers zijn 8,3 (`configs/eindproject-j2.ts:37,41,158-167,184-196`).
5. **MEDIUM — feedback:** q3 overgeneraliseert originaliteit als sterkere voorspeller zonder correlatieberekening (`configs/eindproject-j2.ts:79-87`).

## Nog onzeker

Geen productieproof, cleanup of fysiek iPad/Safari-bewijs. Lokale console toont ontbrekende Supabase-env; preview bleef zichtbaar bruikbaar.
