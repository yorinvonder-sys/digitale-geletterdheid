# Review Future Forecaster — J2P4

**Datum:** 2026-08-08  · **SHA:** `d157905851f22842a8b9bf5c40ff16b29cdf907c`  · **Type:** volledige lokale interne-browserflow  · **Advies:** fix-eerst

## Design

De vier viewports tonen een bruikbare debatflow met intro, normale interactie, fout-/disabled-state en resultaat. `Echte iPad-check nodig`; selected-state is CSS-only.

## Didactiek

Het agentcontract vraagt trendonderzoek, minimaal twee trendanalyses, een plausibel scenario van minimaal 150 woorden en presentatie (`src/config/agents/year2.tsx:2368-2407`). De zichtbare missie is een debat over AI als leraar met vier posities en generieke argument-/reflectievelden (`configs/future-forecaster.ts:9-19,62-89`; `missionGoals.ts:861-867`). Trendbron, scenario en presentatie ontbreken.

## Techniek

De gedeelde gate forceert ongeveer 83/100 en maakt lagere badges (`configs/future-forecaster.ts:91-115`) onbereikbaar. `enableChat`/`chatRoleId` is geregistreerd maar niet gerenderd.

## Browserbewijs

Evidence-root: `.../future-forecaster/manifest.json` onder dezelfde batchroot.

| Formaat | Start | Flow | Foutfeedback | Recovery | Eind/CTA |
|---|---:|---:|---:|---:|---:|
| Desktop 1440×900 | ja | ja | nee* | nee | ja |
| Tablet staand CSS 820×1180 (capture 820×1015) | ja | ja | nee* | nee | ja |
| Tablet liggend 1180×820 | ja | ja | nee* | nee | ja |
| Mobiel 390×844 | ja | ja | nee* | nee | ja |

*De capture toont alleen een disabled tegenargument-CTA; inhoudelijke foutfeedback is niet bewezen.*

## Bevindingen

1. **HIGH — leerdoel/flow-mismatch:** trendanalyse/scenario/presentatie ontbreken.
2. **MEDIUM — score/badge-integriteit:** elke normale completion komt boven de topbadgegrens.
3. **MEDIUM — a11y:** selected-state zonder `aria-pressed`/`aria-selected`.
4. **MEDIUM — contract:** chatcoach-config is dode metadata.

## Nog onzeker

Geen productieproof, cleanup of fysieke iPad/Safari. Lokale Supabase-envfout is alleen preview-infrastructuur.
