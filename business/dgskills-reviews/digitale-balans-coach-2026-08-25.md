# Review: Digitale Balans Coach

**Datum:** 2026-08-25
**TemplateType:** debate-arena
**Config:** `src/features/missions/templates/debate-arena/configs/digitale-balans-coach.ts`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — 6.5/10

Config bevat alleen content (geen eigen styling); design-oordeel loopt vooral via de gedeelde engine.

- **Erft engine-bevindingen die deze missie raken:** 4 stakeholders → `STAKEHOLDER_COLORS`-index blijft binnen het veilige bereik (geen index-4-geel-op-wit probleem, dat treft alleen missies met ≥5 stakeholders). Wél geraakt: de algemene contrastbugs in `ArguePhase`/`ChallengePhase`/`ReflectPhase` (rode "Uitstekend"/"Te kort", label-koppeling ontbreekt) — deze missie gebruikt alle drie fasen, dus de leerling ondervindt ze.
- **Copy-lengte:** stakeholder-perspectieven (Noor, Sam, Mevrouw De Groot, Dr. Hoekstra) zijn elk 3-5 zinnen — aan de lange kant voor leerjaar 1, maar leesbaar en persoonlijk geschreven, geen bezwaar.
- **Kleuren in badges** (`#202023`, `#ff3c21`, `#e1ff01`) zijn config-side hardcoded losse hex-waarden i.p.v. duck-tokens — consistent met andere debate-arena-configs, geen missie-specifieke fout, maar wel een gemiste kans om bij een toekomstige paletwissel automatisch mee te bewegen.

## Didactiek — 8/10

- **SLO-koppeling** (`slo-kerndoelen-mapping.ts:82`): 23A/23B regulier, 20A/20B VSO — past bij waarden-gebaseerde zelfregulatie en privacybewustzijn, logisch voor het onderwerp schermtijd.
- **Leeftijdspassend:** leerjaar 1, week 3. De vier perspectieven (leerling, ontwikkelaar, ouder, wetenschapper) zijn goed gekozen — geen stroman-posities, elk perspectief erkent nuance (Sam bij de ontwikkelaar geeft toe dat tools niet afdwingbaar zijn, Mevrouw De Groot erkent haar eigen blinde vlek).
- **Neurowetenschappelijke onderbouwing** (Dr. Hoekstra) is feitelijk correct en didactisch sterk: het frame "dat is geen zwakte, dat is biologie" normaliseert het probleem zonder het als excuus te presenteren — sluit goed aan bij het counterArgument, dat exact dezelfde nuance herhaalt ("kennis is al een vorm van zelfregulatie").
- **`missionGoals.ts:323-329`**: primaryGoal en evidence zijn concreet en toetsbaar ("je plan bevat minstens twee haalbare afspraken"), maar de missie zelf (debate-arena engine) registreert geen "plan met twee afspraken" als aparte stap — de reflectionQuestions vragen wel naar een concrete afspraak (vraag 3), dus de evidence-claim wordt technisch gedekt door één vrije-tekstvraag, niet door een gestructureerde planoutput. Kleine mismatch tussen wat missionGoals belooft en wat de engine afdwingt.
- **Engine-bevinding die de didactiek raakt:** de scoring-bug (110 punten optellen bij drie reflectievragen, afgekapt door `Math.min` naar 100) betekent dat een leerling die één reflectievraag overslaat alsnog dicht bij het maximum kan scoren — ondermijnt het signaal dat de badge/score aan de leerling geeft.

## Tech — 6/10

Config zelf is schoon: types kloppen, alle verplichte velden (`stakeholders`, `positions`, `reflectionQuestions`, `counterArgument`, `badges`, `takeaways`) zijn ingevuld en consistent qua lengte/toon.

- **Erft engine-bevindingen (blocking):**
  - Dubbele-klik op de voltooiknop (geen submitting-guard) → dubbele XP-toekenning mogelijk voor deze missie zoals voor elke debate-arena-missie.
  - `<40%`-pad wist bij deze missie alle 4 argumenten + tegenargument + 3 reflecties zonder waarschuwing — met de langste reflectievragenset (3 stuks) van de debate-arena-familie is de potentiële dataverlies hier het grootst.
  - Scoring-optelfout (110/100) treft `digitale-balans-coach` met naam in het engine-rapport — direct van toepassing.
- **Config-eigen bevinding:** geen. De config introduceert zelf geen nieuwe technische fout; alle technische risico's komen uit de gedeelde engine.

---

## Voorstellen

Geen mechanische auto-fixes binnen de whitelist voor dit missiebestand — de blocking bevindingen (dubbele-klik, dataverlies bij `<40%`, scoring-optelling) zitten allemaal in de gedeelde engine (`DebateArena.tsx`, `CompletionScreen.tsx`), niet in de config van deze missie, en vallen dus buiten de toegestane scope van deze review (die is beperkt tot missie-eigen config- en registry-bestanden).

**Config-niveau (optioneel, geen fix nodig):** de `evidence`-tekst in `missionGoals.ts:329` ("Je plan bevat minstens twee haalbare afspraken") sluit nauwkeuriger aan als reflectionQuestion 3 expliciet om twee afspraken vraagt in plaats van één:

```ts
// voor (digitale-balans-coach.ts)
'Welke concrete afspraak zou je met jezelf kunnen maken over je digitale gebruik?',

// na
'Welke twee concrete afspraken zou je met jezelf kunnen maken over je digitale gebruik?',
```

---

## Samenvatting

De config van `digitale-balans-coach` is inhoudelijk sterk: vier goed uitgewerkte, niet-stromanachtige perspectieven, een didactisch scherp counterArgument, en een passende SLO-koppeling. Alle blocking bevindingen komen uit de gedeelde debate-arena-engine (dubbele voltooiknop, dataverlies bij lage score, scoring-optelfout bij drie reflectievragen) en zijn al vastgelegd in het enginerapport — deze missie ondervindt ze zonder ze zelf te veroorzaken. Er is geen missie-eigen technische fout gevonden.

**Verdict: fix-eerst** — niet vanwege deze config, maar omdat de gedeelde engine-bugs (met name het dataverlies-risico bij `<40%` en de dubbele-voltooiknop) eerst gerepareerd moeten worden voordat leerlingen deze missie zonder risico kunnen spelen.
