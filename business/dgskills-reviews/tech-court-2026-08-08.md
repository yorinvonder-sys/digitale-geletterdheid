# Review Tech Court — J2P4

**Datum:** 2026-08-08  · **SHA:** `d157905851f22842a8b9bf5c40ff16b29cdf907c`  · **Type:** volledige lokale interne-browserflow  · **Advies:** fix-eerst

## Design

Intro, perspectieven, positie, argumenten, tegenargument, reflectie en resultaat zijn in alle vier viewports zichtbaar getest. `Echte iPad-check nodig`; geselecteerde controls missen semantische state.

## Didactiek

Het agentcontract beschrijft aanklager/verdediger/getuige, drie argumenten en een vonnis (`src/config/agents/year2.tsx:2286-2356`). De zichtbare config voert echter vier stakeholderkaarten, vier abstracte posities, twee argumenten, één tegenargument en reflectie uit (`configs/tech-court.ts:9-19,62-89`). De rolspel-/vonnisvaardigheid wordt niet geoefend. Stakeholder-attributie is bovendien geen verplichte scorevoorwaarde (`ArguePhase.tsx:144-181`).

## Techniek

De engine maakt een normale minimumscore van ongeveer 83/100; lagere tiers (`configs/tech-court.ts:91-115`) zijn onbereikbaar. Registry-chatmetadata is niet aangesloten op de engine.

## Browserbewijs

Evidence-root: `.../tech-court/manifest.json` onder dezelfde batchroot.

| Formaat | Start | Flow | Foutfeedback | Recovery | Eind/CTA |
|---|---:|---:|---:|---:|---:|
| Desktop 1440×900 | ja | ja | nee* | nee | ja |
| Tablet staand CSS 820×1180 (capture 820×1015) | ja | ja | nee* | nee | ja |
| Tablet liggend 1180×820 | ja | ja | nee* | nee | ja |
| Mobiel 390×844 | ja | ja | nee* | nee | ja |

*De capture toont alleen een disabled tegenargument-CTA; inhoudelijke foutfeedback is niet bewezen.*

## Bevindingen

1. **HIGH — rol-/opdrachtmismatch:** rechtbankrol en vonnis ontbreken.
2. **HIGH — beoordelingsintegriteit:** stakeholder-toeschrijving is niet gated; twee generieke argumenten volstaan.
3. **MEDIUM — score/badges:** normale completion haalt circa 83/100; lagere badges zijn dead code.
4. **MEDIUM — a11y:** selected-state niet semantisch.
5. **MEDIUM — contract:** chatcoach-config wordt niet gerenderd.

## Nog onzeker

Productie/auth/cleanup en fysieke iPad/Safari zijn niet gecontroleerd. Consolefouten zijn lokaal beperkt tot ontbrekende Supabase-env.
