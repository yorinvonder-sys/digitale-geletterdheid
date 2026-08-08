# Review AI Ethicus — J2P4

**Datum:** 2026-08-08  · **SHA:** `d157905851f22842a8b9bf5c40ff16b29cdf907c`  · **Type:** volledige lokale interne-browserflow  · **Advies:** fix-eerst

## Design

De intro, perspectiefkaarten, positieknoppen, argumentformulieren en resultaatstaat zijn zichtbaar gecontroleerd in vier viewports. De gedeelde debat-engine heeft geen semantische geselecteerde staat (`ExplorePhase.tsx:41-55`, `PositionPhase.tsx:29-58`, `ArguePhase.tsx:148-159`, `ReflectPhase.tsx:79-91`). `Echte iPad-check nodig`.

## Didactiek

De flow vraagt leerlingen om stakeholders te lezen, een positie te kiezen, twee argumenten, een tegenargument en reflectie te formuleren. De normale minimale score is circa 83/100 (`DebateArena.tsx:102-127`), waardoor lagere badge-niveaus in de config (`configs/ai-ethicus.ts:90-115`) onbereikbaar zijn. Dit maakt de feedback/rubric misleidend.

## Techniek

De registry zet `enableChat`/`chatRoleId`, maar `DebateArenaConfig` en de route renderen geen chat (`templateRegistry.ts:91-93`, `DebateArena.tsx:33-52,169-181`). Dat is dode configuratie tenzij chat bewust buiten scope is.

## Browserbewijs

Evidence-root: `screenshots/mission-audit/batches/j2p4-2026-08-08/d157905851f22842a8b9bf5c40ff16b29cdf907c/ai-ethicus/manifest.json`.

| Formaat | Start | Flow | Foutfeedback | Recovery | Eind/CTA |
|---|---:|---:|---:|---:|---:|
| Desktop 1440×900 | ja | ja | nee* | nee | ja |
| Tablet staand CSS 820×1180 (capture 820×1015) | ja | ja | nee* | nee | ja |
| Tablet liggend 1180×820 | ja | ja | nee* | nee | ja |
| Mobiel 390×844 | ja | ja | nee* | nee | ja |

*De capture toont een leeg tegenargumentveld met disabled CTA, geen inhoudelijke foutfeedback. Herstel op dezelfde vraag is niet bewezen; de evidence-validator faalt op `feedback` en `recovery`.

## Bevindingen

1. **MEDIUM — score/badge-integriteit:** iedere normale completion landt rond 83/100; lagere tiers zijn onbereikbaar.
2. **MEDIUM — a11y:** geselecteerde stakeholder-, positie- en perspectiefknoppen missen `aria-pressed`/`aria-selected`.
3. **MEDIUM — contract:** geconfigureerde chatcoach wordt niet gerenderd.

## Nog onzeker

Productie-auth, XP, persistentie, Supabase en cleanup zijn niet uitgevoerd. Lokale console meldt alleen ontbrekende `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`; dit is previewconfiguratie. Fysieke Safari/iPad is niet bewezen.
