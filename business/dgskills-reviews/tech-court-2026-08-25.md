# Missie-review: Tech Court

**Datum:** 2026-08-25
**TemplateType:** debate-arena

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 6.5/10

De config bevat geen eigen styling (pure content); de bevindingen zijn engine-breed en raken deze missie via de gedeelde `debate-arena`-renderer.

**Bevindingen:**
- ❌ **Blocking (engine, gedeeld):** `STAKEHOLDER_COLORS` in `ExplorePhase.tsx:6` kan witte knoptekst op geel (`#e1ff01`) zetten (~1,1:1 contrast). Tech Court heeft 4 stakeholders, dus index 4 (geel) wordt hier niet bereikt — niet blocking voor déze missie specifiek, wel voor de gedeelde kleurentabel.
- ⚠️ **Warning (engine, gedeeld):** `getArgumentQuality` in `ArguePhase.tsx:6` gebruikt dezelfde rode kleur voor "Uitstekend" en "Te kort", en geel-op-wit voor "Basis" — geldt ook voor Tech Court's argumentatiefase.
- ⚠️ **Warning (engine, gedeeld):** labels missen `htmlFor`/`aria-label` op de textareas in Argue/Challenge/Reflect-fase (`ArguePhase.tsx:79`, `ChallengePhase.tsx:45`, `ReflectPhase.tsx:42`) — treft alle debate-arena-missies inclusief deze.
- ⚠️ **Warning (engine, gedeeld):** geen focusverplaatsing bij faseovergang (`DebateArena.tsx:294`).

Geen missie-specifieke design-issues gevonden in `tech-court.ts` zelf.

## Didactiek — score 8/10

**SLO-koppeling:** `23C` (regulier) + `20B` (VSO) — Maatschappij / passende ethiek-kerndoelen voor een AI-discriminatie-rechtszaak. Eén code per profiel, geen overclaim.

**Fit:** de missie raakt 23C substantieel — leerlingen wegen wettelijke concepten (directe vs. indirecte discriminatie) tegen technische oorzaak (historische bias in trainingsdata), en moeten een oordeel vormen met onderbouwing. Dit is geen oppervlakkig contact.

**Curriculumplek:** J2P4 "Ethiek, Maatschappij & Eindproject", naast `ai-ethicus`, `digital-rights-defender`, `future-forecaster` — thematisch coherent cluster zonder inhoudelijke overlap (Tech Court is uniek in de juridische framing: schuldvraag/rechtszaak i.p.v. algemeen ethisch debat).

**Leerdoel (`missionGoals.ts`):** helder geformuleerd ("Ik beoordeel of een bedrijf schuldig is aan indirecte discriminatie... en onderbouw mijn juridische oordeel"), sluit aan bij `evidence`-criterium.

**Bevindingen:**
- ✅ 4 stakeholders bieden evenwichtig perspectief (aanklager, verdediging, rechter, onafhankelijk expert) — voorkomt eenzijdige framing.
- ✅ `counterArgument` is inhoudelijk sterk (innovatie-argument), dwingt leerling tot weerlegging i.p.v. stroman.
- ✅ Slechts 2 `reflectionQuestions` — dit voorkomt de engine-brede 110-punten-score-bug (die alleen configs met 3 reflectievragen raakt: ai-ethicus, digitale-balans-coach, schermtijd-coach). Tech Court zelf heeft dus GEEN scoring-mismatch.
- ⚠️ **Warning:** `positions` bevat 4 keuzes maar `keyArgument` van de stakeholders wijst impliciet vooral naar 2 posities (schuldig/niet-schuldig); "systeem-kwestie" en "gedeelde-schuld" hebben geen expliciete stakeholder die ze articuleert. Een leerling die een van die twee kiest, moet zelf de brug slaan. Niet blocking — leerjaar 2 kan dit aan, maar een korte hint in `reflectionQuestions` zou helpen.
- ℹ️ Woordtelling van `perspective`-velden (~60-90 woorden per stakeholder) is aan de langere kant voor J2, maar past bij het juridisch register van de missie; geen ingreep nodig.

## Tech — score 7/10

Static analyse van `tech-court.ts` (config bevat geen handlers/logic — puur data, type `DebateArenaConfig`).

**Bevindingen:**
- ✅ Type-discipline: config is volledig getypeerd via `DebateArenaConfig`, geen `any`.
- ✅ `templateRegistry.ts`: entry correct (`enableChat: true, chatRoleId: 'tech-court'`) — chat-rol is actief, geen dormant-issue.
- ✅ `maxScore: 100` consistent met 2 reflectievragen (geen overshoot, zie didactiek-sectie).
- De drie **blocking** engine-bevindingen uit de gedeelde review gelden onverkort voor Tech Court omdat de missie via `DebateArena.tsx` rendert:
  1. Voltooiknop niet disabled tijdens async `onComplete` → dubbele XP-toekenning mogelijk.
  2. Bij <40% score wist dezelfde knop (`clearSave()`) alle argumenten/tegenargument/reflecties van de leerling zonder bevestiging.
  3. (N.v.t. voor déze config — 110pt-bug raakt alleen 3-reflectievraag-configs.)
- ⚠️ Engine-warning: geen ontdubbeling van argumenten (drie identieke claims leveren volle punten) — geldt ook hier.
- ⚠️ Engine-warning: `reflectionAnswers` gesleuteld op letterlijke vraagtekst — als `reflectionQuestions` in `tech-court.ts` ooit herschreven wordt, verliezen lopende leerlingen hun opgeslagen antwoord.

Geen missie-specifieke technische issues buiten de gedeelde engine gevonden.

## Voorstellen

Geen mechanische fixes binnen de whitelist-scope van deze missie (`tech-court.ts`, registry-entries) nodig — alle blocking/warning-bevindingen zitten in de gedeelde `debate-arena`-engine en vallen buiten deze missie-specifieke autoFixable-scope.

Eén optioneel, niet-blocking voorstel voor didactische balans:

**Voor** (`tech-court.ts`, `reflectionQuestions`):
```ts
reflectionQuestions: [
    'Maakt het uit of een bedrijf bewust of onbewust discrimineert? Waarom wel of niet?',
    'Wat zou jij als rechter anders doen dan je debatpartner?',
],
```

**Na** (optioneel, voegt brug naar "systeem-kwestie"-positie toe):
```ts
reflectionQuestions: [
    'Maakt het uit of een bedrijf bewust of onbewust discrimineert? Waarom wel of niet?',
    'Is dit vooral een probleem van dit ene bedrijf, of van hoe onze samenleving al werkte vóór de AI erbij kwam?',
],
```

## Samenvatting & verdict

Tech Court is een inhoudelijk sterke, juridisch accurate debat-missie met een evenwichtige stakeholder-opstelling en een leerdoel dat goed aansluit bij SLO 23C. De missie-eigen content (config, SLO-mapping, curriculumplaatsing, agent-registratie) bevat geen blocking issues. Alle blocking bevindingen (dubbele XP bij snel klikken, dataverlies bij <40%-herkansing) zitten in de gedeelde `debate-arena`-engine en zijn al vastgesteld in de engine-review — ze gelden voor deze missie maar zijn niet missie-specifiek op te lossen binnen de config-scope.

**Verdict: fix-eerst** (op engine-niveau; de missie-config zelf is `ok`).
