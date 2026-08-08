# Review Sustainability Scanner — J2P4

**Datum:** 2026-08-08  · **SHA:** `d157905851f22842a8b9bf5c40ff16b29cdf907c`  · **Type:** volledige lokale interne-browserflow  · **Advies:** fix-eerst

## Design

Data-tabellen, grafiek, informatiekaarten en resultaten zijn in vier viewports bekeken. De browsercapturedimensie voor CSS 820×1180 is 820×1015; `Echte iPad-check nodig`. Een bewuste foute keuze gaf begrijpelijke feedback, maar antwoordcontrols verdwenen daarna.

## Didactiek

De naam/metadata belooft milieu-impact en duurzamere alternatieven (`src/utils/missionBuilder.tsx:108,225`), terwijl de config uitsluitend schermtijd, media-aandeel, PEGI en streaming behandelt (`configs/sustainability-scanner.ts:3-14,20-22,74-79`). Dat is een duidelijke identiteit/SLO-mismatch.

## Techniek

De zichtbare doelgrens is 65%, maar `DataViewer.tsx:900-904` accepteert completion vanaf 40%; `AuthenticatedApp.tsx:733-737` kan vervolgens XP/completion registreren. Bovendien wordt `clearSave()` vóór `onComplete()` uitgevoerd; een persistence failure kan lokale voortgang wissen. Deze control-flow is statisch bevestigd, niet in productie uitgevoerd.

## Browserbewijs

Evidence-root: `.../sustainability-scanner/manifest.json` onder dezelfde batchroot.

| Formaat | Start | Flow | Foutfeedback | Recovery | Eind/CTA |
|---|---:|---:|---:|---:|---:|
| Desktop 1440×900 | ja | ja | ja | nee | ja |
| Tablet staand CSS 820×1180 (capture 820×1015) | ja | ja | ja | nee | ja |
| Tablet liggend 1180×820 | ja | ja | ja | nee | ja |
| Mobiel 390×844 | ja | ja | ja | nee | ja |

## Bevindingen

1. **HIGH — completion gate:** 40%-callback contradicteert zichtbare 65%-succesgrens.
2. **HIGH — autosave:** save wordt gewist vóór duurzame completion; failure kan herstelbare voortgang verliezen.
3. **MEDIUM — identiteit/didactiek:** duurzaamheid wordt niet werkelijk onderzocht.
4. **HIGH kandidaat — recovery:** foutfeedback toont geen same-question retry; validator markeert vier ontbrekende recovery-checkpoints.

## Nog onzeker

Productie-SHA/deployment, auth, XP, database en cleanup zijn niet bewezen. Console bevat lokaal alleen ontbrekende Supabase-variabelen. Fysieke Safari/iPad ontbreekt.
