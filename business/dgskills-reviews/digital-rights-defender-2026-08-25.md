# Review: digital-rights-defender

**Datum:** 2026-08-25
**TemplateType:** debate-arena

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Mission:** digital-rights-defender (debate-arena)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (tokens):** config bevat geen inline Tailwind-classes of hex-literals; badgekleuren gebruiken vaste hex (`#202023`) consistent met de rest van de debate-arena-configs — `src/features/missions/templates/debate-arena/configs/digital-rights-defender.ts:106-129`.
- **Criterium 2 (layout):** identiek aan andere debate-arena-configs, geen structurele afwijking.
- **Criterium 4 (copy-lengte):** `introDescription` ±40 woorden, `dilemma` ±60 woorden — ruim binnen de grens voor leerjaar 2 (<80 woorden intro).
- **Criterium 3/6/7:** geen missie-eigen knoppen, animaties of formulieren buiten de gedeelde engine — al beoordeeld in de engine-pass.

### ⚠️ Aandachtspunten
- **Stakeholder-kleur index-risico**: deze config heeft precies 4 stakeholders (index 0-3), dus het door de engine-review gevonden geel-op-wit-contrastprobleem bij `STAKEHOLDER_COLORS`-index 4 raakt deze missie momenteel niet. Blijft kwetsbaar als een 5e stakeholder wordt toegevoegd — `src/features/missions/templates/debate-arena/configs/digital-rights-defender.ts:22-70`.
- **Visual Precision Gate**: niet dynamisch geverifieerd — geen dev-server/Chrome-plugin-sessie in deze pass. Statisch oordeel op basis van config-copy en gedeelde engine.

### ❌ Blocking issues
- Geen missie-eigen blocking issues (engine-brede blockers staan al in het sweep-rapport).

### Score
3/4 statisch-toetsbare criteria geslaagd (1 niet-blocking aandachtspunt) · Aanbeveling: ship (design-as)

---

## 📚 Didactiek review

**Mission:** digital-rights-defender (debate-arena)
**Curriculum-plek:** Leerjaar 2, Periode 4 (`src/config/curriculum.ts:228`)
**SLO-claim:** 23A, 23C (regulier) · 20A, 20B (VSO) — `src/config/slo-kerndoelen-mapping.ts:147`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes geldig):** 23A (Veiligheid & privacy) en 23C (Maatschappij) zijn beide geldige regulier-codes; VSO-mapping 20A/20B aanwezig.
- **Criterium 2 (SLO-fit):** de vier stakeholder-perspectieven (leerling, directeur, FG, ed-tech-CEO) en de vier posities dwingen de leerling om expliciet met privacy-afwegingen (23A) en maatschappelijke/ethische aspecten van technologie (23C) te oefenen — geen oppervlakkig contact.
- **Criterium 4 (beknoptheid):** intro <80 woorden, dilemma <80 woorden, stakeholder-perspectieven 40-70 woorden elk — passend bij leerjaar 2.
- **Criterium 7 (Bloom-balans):** goede spreiding — perspectieven lezen (begrijpen), positie kiezen + argumenten bouwen (toepassen/analyseren), reageren op tegenargument + reflectievragen (evalueren). Geen pure recall.
- **Criterium 9 (VSO):** VSO-kerndoelen aanwezig.

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot) — inhoudelijke mismatch tussen agent-rol en missie-inhoud**: `src/config/agents/year2.tsx:2112-2117`.
  - **Wat:** de agent-rol (`enableChat: true`, `chatRoleId: 'digital-rights-defender'`) beschrijft `missionObjective: 'Schrijf een privacy-manifest voor jouw school met concrete afspraken.'` en `problemScenario: '...Als Digital Rights Defender schrijf jij een manifest...'`. De daadwerkelijke debate-arena-config (`digital-rights-defender.ts`) bevat géén manifest-opdracht — de leerling kiest een positie, bouwt argumenten en reflecteert, schrijft geen document.
  - **Waarom:** een leerling die de AI-coach raadpleegt (`examplePrompt: 'Welke digitale rechten heb ik als leerling op school?'`) krijgt een chatpartner die denkt dat het einddoel een privacy-manifest is, terwijl de missie-flow dat nooit vraagt. Dat verwart de leerling over wat er van hem verwacht wordt en ondermijnt het scaffolding-principe (AI moet de échte opdracht kennen, niet een oudere/andere versie).
  - **Voorstel:** herschrijf `missionObjective` en `problemScenario` zodat ze de debate-arena-opdracht (positie kiezen, argumenten bouwen, tegenargument weerleggen, reflecteren) beschrijven in plaats van een manifest.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **23A**: sterk geraakt — alle vier de stakeholders en drie van de vier posities draaien direct om privacy-grenzen bij dataverzameling.
- **23C**: sterk geraakt — de FG- en ed-tech-perspectieven dwingen een maatschappelijk/ethisch afwegingskader af (noodzaak vs. proportionaliteit vs. innovatie).

### Score
5/6 getoetste criteria geslaagd (1 aandachtspunt, niet blocking) · Bloom-balans: medium-hoog · Aanbeveling: fix-eerst (agent-rol-copy)

---

## 🔧 Tech review

**Mission:** digital-rights-defender (debate-arena)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server in deze rubric-pass; engine-brede dynamic-bevindingen staan al in het sweep-rapport (`engine-debate-arena.json`).

### Static analyse

#### ✅ Geslaagd
- **Criterium A3 (TypeScript):** config is volledig getypeerd via `DebateArenaConfig`, geen `any` of `@ts-ignore` — `src/features/missions/templates/debate-arena/configs/digital-rights-defender.ts:1-8`.
- **Criterium A7 (security):** `systemInstruction` staat server-side in `src/config/agents/year2.tsx`, niet in de client-config; geen `dangerouslySetInnerHTML` in deze missie-eigen bestanden.
- **maxScore-som klopt voor déze config**: 2 reflectievragen (niet 3), dus de engine-bevinding "deelscores sommeren tot 110" (`DebateArena.tsx:130`) is hier **niet van toepassing** — de puntensom blijft binnen `maxScore: 100`.
- Registry-entry (`templateRegistry.ts:92`) en missionGoals-entry (`missionGoals.ts:846-853`) zijn intern consistent met de config (2 argumenten geëist, rounds-complete criteria).

#### ⚠️ Aandachtspunten
- **Alle engine-brede blocking/warning-bevindingen** uit de gedeelde engine-review gelden ook voor deze missie (dubbele voltooiknop, dataverlies bij <40%-retry, geen focus-move bij faseovergang, ongelabelde textareas). Zie sweep-rapport voor de engine-fix; geen missie-eigen actie nodig.
- **Agent-rol content-mismatch** (zie didactiek-sectie) is ook een technisch risico: de chat-agent kan de leerling actief op het verkeerde spoor zetten via `examplePrompt`/`missionObjective` die niet bij de template-flow past.

#### ❌ Blocking issues
- Geen missie-eigen blocking issues (engine-blockers zijn al vastgelegd in de sweep als gedeelde fix).

### Dynamic verificatie
Niet uitgevoerd — geen dev-server beschikbaar in deze rubric-pass.

### Score
Static: 4/4 getoetste missie-eigen criteria geslaagd · Dynamic: n.v.t. · Aanbeveling: ship (mits agent-rol-copy wordt gefixt en engine-fixes uit sweep landen)

---

## Voorstellen

### 1. Agent-rol-copy aligneren met de daadwerkelijke debate-arena-opdracht

```tsx
// ❌ Huidig — src/config/agents/year2.tsx:2112-2117
description: 'Bescherm jouw digitale rechten en schrijf het privacybeleid van de toekomst.',
problemScenario: 'Je school verzamelt gegevens via apps, camera\'s en leerlingvolgsystemen. Maar welke rechten heb jij eigenlijk? Als Digital Rights Defender schrijf jij een manifest dat de privacy van alle leerlingen beschermt.',
missionObjective: 'Schrijf een privacy-manifest voor jouw school met concrete afspraken.',

// ✅ Voorgesteld
description: 'Bescherm jouw digitale rechten en debatteer mee over de grenzen van dataverzameling op school.',
problemScenario: 'Je school verzamelt gegevens via apps, camera\'s en leerlingvolgsystemen. Maar welke rechten heb jij eigenlijk? Als Digital Rights Defender kies jij een positie, bouw je sterke argumenten en verdedig je die in een debat.',
missionObjective: 'Kies een positie over dataverzameling op school en verdedig die met minstens twee onderbouwde argumenten.',
```

## Samenvatting & verdict

Design en tech zijn missie-eigen in orde: de config is intern consistent, correct getypeerd, security-veilig, en de engine-brede scoring-bug (110 punten bij 3 reflectievragen) raakt deze missie niet omdat hij er maar 2 heeft. Het enige echte gebrek is didactisch/inhoudelijk: de agent-rol in `year2.tsx` beschrijft een privacy-manifest-opdracht die niet bestaat in de daadwerkelijke debate-arena-flow, wat de AI-coach het verkeerde einddoel laat communiceren aan de leerling. Dit is een kleine, mechanische copy-fix binnen de whitelist.

**Verdict: fix-eerst** (één copy-fix in `src/config/agents/year2.tsx`, verder ship-klaar op missie-niveau; engine-brede fixes lopen via het sweep-rapport).
