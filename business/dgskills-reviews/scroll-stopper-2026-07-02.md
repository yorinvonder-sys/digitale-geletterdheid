# Missie-review: scroll-stopper (wave 13)

**Datum:** 2026-07-02
**Template:** debate-arena
**Config:** `src/features/missions/templates/debate-arena/configs/scroll-stopper.ts`
**Agent-rol:** `src/config/agents/year1.tsx` (regel 1932 e.v.)

## Samenvatting

De missie is technisch volledig geregistreerd en de debate-arena-config zelf is
inhoudelijk sterk (evenwichtig standpuntenspel, geen schadelijke of absolute
claims over schermtijd/verslaving). Er is echter een **majeure inhoudelijke
mismatch**: de briefing-tekst die de leerling vóór de start ziet
(`description`, `problemScenario`, `missionObjective`, `examplePrompt`,
`visualPreview` in de agent-rol) beschrijft een compleet ander missie-concept
— een interactief "dark pattern"-ontwerp-rollenspel met een AI-CEO-chat — dan
wat de leerling daadwerkelijk speelt: een stakeholder-debat met 4 personen,
standpunt kiezen en argumenten bouwen.

## Stap A — Registratie & content

| Bron | Status |
|---|---|
| `templateRegistry.ts:87` | OK — `templateType: 'debate-arena'`, `enableChat: true`, `chatRoleId: 'scroll-stopper'` |
| `RoleId`-union (`types.ts:27`) | OK |
| `AGENT_ROLE_IDS` (`agentRoleIds.ts:103`) | OK |
| `curriculum.ts:114` | OK — leerjaar 1, periode 3, thema Digitaal Burgerschap |
| `slo-kerndoelen-mapping.ts:71` | OK — `23B, 21B` / VSO `20A, 20B` (bestaande, geldige codes) |
| `missionGoals.ts:224` | OK — primaryGoal + criteria + evidence, consistent met debate-arena-flow |
| `DebateArena.tsx` allowlist | OK — `scroll-stopper` in `VALID_DEBATE_ARENA_IDS` |
| Config-bestand | OK, uniek pad, geen duplicaat elders |

**Bevinding D1 (MAJOR, niet autoFixable — welzijnsgevoelig content-review nodig):**
De agent-rol in `year1.tsx` bevat:
- `description`: "Word ingehuurd als app-ontwerper. Maak een app verslavend — en ontdek waarom dat een probleem is."
- `problemScenario`: "Een tech-bedrijf huurt jou in als UX-designer... Maar halverwege ontdek je wie de 'testgebruiker' eigenlijk is..."
- `missionObjective`: "Ontwerp 5 dark patterns voor een app, ontdek de gevolgen, en herontwerp de app zodat deze eerlijk wordt."
- `examplePrompt`: "Ik zou autoplay toevoegen zodat de volgende video automatisch start."
- `visualPreview`: toont een "📐 Dark Pattern Lab"-mockup met infinite scroll/notificatie-badges/streak-druk toggles.
- `systemInstruction`: een volledig uitgewerkt 3-akte AI-rollenspel (CEO van "ScrollMore Inc.", leerling ontwerpt dark patterns, plot twist, herontwerp), met een eigen "Verslavings-score"-mechaniek.

Dit beschrijft een **ander missietype** dan de daadwerkelijk geladen
`DebateArenaConfig`: stakeholders lezen (Luna/Mark/Dr. Bakker/Kamerlid De
Vries), positie kiezen uit 4 opties, argumenten bouwen, tegenargument
beantwoorden, reflecteren. Geen dark-pattern-ontwerp, geen CEO-rollenspel,
geen "Verslavings-score".

Context: `DebateArena.tsx` gebruikt `enableChat`/`chatRoleId` nergens (geen
chat-widget in deze template — bekend platform-breed patroon, dormante
chat-rol). De `systemInstruction` is dus technisch onbereikbaar. Dat verkleint
de runtime-impact (de AI-CEO-chat wordt nooit getoond), maar **de
briefing-velden `description`/`problemScenario`/`missionObjective`/
`examplePrompt`/`visualPreview` zíjn wel zichtbaar** op de missiekaart/briefing
vóórdat de leerling start, en die beloven het verkeerde scenario.

**Waarom niet autoFixable:** het herschrijven van de briefing-tekst raakt de
framing van een welzijnsgevoelig onderwerp (schermtijd/verslaving/tienerdata)
en moet aansluiten bij de daadwerkelijke debate-arena-inhoud — dit vereist een
inhoudelijke keuze (behoud stakeholder-debat-framing versus dark-pattern-lab
alsnog bouwen), geen mechanische code-fix.

### Voorstel D1 (ter beslissing, niet toegepast)

**Optie 1 — briefing aanpassen aan bestaande debate-arena-config (kleinste ingreep):**

```tsx
// src/config/agents/year1.tsx, regel ~1938-1943
// VOOR:
description: 'Word ingehuurd als app-ontwerper. Maak een app verslavend — en ontdek waarom dat een probleem is.',
problemScenario: 'Een tech-bedrijf huurt jou in als UX-designer. Je opdracht: maak hun app zo verslavend mogelijk. Maar halverwege ontdek je wie de "testgebruiker" eigenlijk is...',
missionObjective: 'Ontwerp 5 dark patterns voor een app, ontdek de gevolgen, en herontwerp de app zodat deze eerlijk wordt.',
examplePrompt: 'Ik zou autoplay toevoegen zodat de volgende video automatisch start.',

// NA (aansluitend bij debate-arena config):
description: 'Neem deel aan een fel debat over verslavend app-design. Vier partijen, vier belangen — waar sta jij?',
problemScenario: 'Social media apps zijn bewust ontworpen om je zo lang mogelijk vast te houden. Een tiener, een app-ontwerper, een psycholoog en een politicus hebben allemaal een andere kijk op wie hier verantwoordelijk voor is.',
missionObjective: 'Lees de standpunten van 4 betrokkenen, kies jouw positie, bouw sterke argumenten en reflecteer of je mening is veranderd.',
examplePrompt: 'Ik kies voor strenger reguleren, want...',
```

`visualPreview` en `systemInstruction` (dark-pattern-lab-mockup + CEO-rollenspel)
zouden in dat geval verwijderd/vervangen moeten worden door een neutrale
stakeholder-debat-preview, consistent met andere debate-arena-missies in
`year1.tsx` (vergelijk bijv. de `visualPreview` van andere debate-arena-rollen
in dit bestand voor het bestaande patroon).

**Optie 2 — config aanpassen aan bestaande briefing (grotere ingreep):**
Zou betekenen dat de debate-arena-template een dark-pattern-ontwerpfase moet
krijgen, of dat deze missie naar een ander templateType (bijv. iets met een
ontwerp-/keuze-flow) verhuist. Dit is een architectuurkeuze, geen review-scope.

**Aanbeveling:** Optie 1 — de bestaande debate-arena-config is inhoudelijk af,
evenwichtig en welzijnsveilig; de briefing hoeft alleen te matchen wat er al
gebouwd is.

## Stap B — UI/UX-review & screenshots

- Geen `screenshots/`-map gevonden voor deze missie in de worktree.
- `scroll-stopper` komt **niet voor** in
  `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (0 matches) — dus
  geen eerdere visuele bevindingen om op voort te bouwen.

## Stap C — Rubric-scores (0-10, 10 = uitstekend)

### Design (gewicht 0.3)
- Duck-tokens correct gebruikt (`bg-duck-bg`, `text-duck-ink`, `border-duck-gray`, `text-duck-acid`).
- Badge-kleuren `#202023`/`#ff3c21` = bekend engine-lijst-patroon, geen missie-issue.
- Geen screenshots beschikbaar om de daadwerkelijke rendering te verifiëren (onzekerheidskorting).
- **Score: 8/10**

### Didactiek (gewicht 0.4)
- Debate-arena-config zelf: sterk — 4 realistische, evenwichtige perspectieven; geen absolute/schadelijke claims richting leerlingen over schermtijd/verslaving; scoring beloont onderbouwde argumenten (min. 20 tekens claim+evidence), niet oppervlakkige interactie.
- SLO-koppeling (23B welzijn, 21B mediawijsheid) klopt inhoudelijk bij het stakeholder-debat.
- **Majeure aftrek**: de briefing die de leerling ziet vóór missie-start belooft een ander leerdoel/scenario (zelf dark patterns ontwerpen) dan wat er geleerd/geoefend wordt (perspectieven wegen, standpunt onderbouwen). Dit ondermijnt voorbereiding en verwachtingsmanagement bij de leerling.
- **Score: 5/10**

### Techniek (gewicht 0.3)
- Volledige, correcte registratie over alle 7 bronnen (RoleId, AGENT_ROLE_IDS, templateRegistry, curriculum, slo-mapping, missionGoals, debate-arena allowlist).
- Geen gebroken imports, geen dubbele config, geen scoring-bugs (engine gedeeld en reeds geverifieerd correct).
- Kleine kanttekening: de onbereikbare `systemInstruction` is dode/misleidende code (bekend platform-patroon, niet uniek voor deze missie) — geen technische bug maar wel technische schuld.
- **Score: 9/10**

### triageScore
`(10-8)*0.3 + (10-5)*0.4 + (10-9)*0.3 = 0.6 + 2.0 + 0.3 = 2.9`

## Issues-overzicht

| ID | Ernst | AutoFixable | Omschrijving |
|---|---|---|---|
| D1 | MAJOR | Nee (welzijnsgevoelig — escaleren) | Briefing/agent-rol beschrijft ander missiescenario dan de daadwerkelijke debate-arena-config |

## Niet-herhaalde bekende issues
- Badge `color: '#202023'` → engine-lijst, platform-breed, geen missie-issue.
- `enableChat`/`chatRoleId` dormant in debate-arena-template → platform-breed patroon.
- Duck-tokens beperkt tot bg/bgLight/ink/acid/gray/error → correct toegepast, geen extra tokens gebruikt.
