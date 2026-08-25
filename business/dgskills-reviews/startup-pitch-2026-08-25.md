# Missie-review: Startup Pitch

**Datum:** 2026-08-25
**Mission ID:** `startup-pitch`
**Template-type:** `tool-guide`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 7.5/10

Config bevat geen eigen visuele styling (die zit in de gedeelde `ToolGuide.tsx`-engine), dus deze sectie beoordeelt alleen wat de missie-config zelf beïnvloedt: copy-lengte, structuur en toon.

### Geslaagd
- Copy is consequent kort en scanbaar: instructies gebruiken bullets en genummerde lijstjes i.p.v. lange lopende tekst.
- Toon is direct en motiverend, geen betuttelend taalgebruik.
- Elke stap heeft een `tip` die concreet en voorbeeld-rijk is (Duolingo, Spotify, Dropbox als naamvoorbeelden).

### Aandachtspunten
- **Copy-lengte stap 2 en 4** — de `instruction`-tekst van stap 2 (~95 woorden) en stap 4 (~105 woorden) zit dicht tegen de leerjaar-3-grens van 120 woorden voor introcopy; voor ronde-opdrachten (grens 80 woorden) overschrijden beide ruim. Niet blocking, maar dit is de langste van de vier stappen — kort inkorten geeft lucht.
- **Engine-erfenis** — de bevindingen uit `engine-tool-guide.json` over ontbrekende `role="checkbox"`/`aria-checked` op checklist-items en de mogelijke stille no-op van `/8`-opacity-klassen gelden ook hier, maar zijn engine-breed en niet missie-specifiek repareerbaar.

### Blocking issues
Geen.

---

## Didactiek — score 8/10

### SLO-codes (Criterium 1)
`sloEntry`: `{ id: 'startup-pitch', title: 'Startup Pitch', week: 3, yearGroup: 3, sloKerndoelen: ['22A', '21D', '23C'] }` — drie geldige codes, binnen de grens van 3. Geen mismatch.

### SLO-fit (Criterium 2)
- `22A` (Digitale producten) — ✅ stap 2-3 laat leerlingen een concreet AI-product + branding ontwerpen.
- `21D` (AI) — ✅ stap 2 vraagt een AI-oplossing te bedenken en te typeren (chatbot/app/slim systeem).
- `23C` (Maatschappij) — ✅ stap 4 behandelt eerlijkheid/toegankelijkheid als maatschappelijk risico van AI.

Alle drie kerndoelen worden substantieel geraakt, niet oppervlakkig.

### Leerdoelen (Criterium 3)
Geen expliciete `learningObjectives`-array, maar `takeaways` (5 stuks) functioneren als impliciete leerdoelen. Ze zijn grotendeels concreet ("Je kunt een concreet, specifiek probleem identificeren", "Je kunt een visuele identiteit ontwerpen met logo, slogan en kleurenpalet"). Twee zijn zachter geformuleerd ("Je snapt hoe...", "Je begrijpt dat...") — vage werkwoorden zonder gedragscriterium, maar dit weegt licht omdat de overige drie wél actiegericht zijn.

### Opdracht-beknoptheid (Criterium 4)
Leerjaar 3-grenzen: intro <120 woorden, ronde-opdracht <80 woorden. `introDescription` (39 woorden) ruim binnen grens. Stap-instructies (zie Design-sectie) overschrijden de 80-woorden-ronde-grens bij stap 2 (~95) en stap 4 (~105). Warning, geen blocker — de extra lengte komt door genummerde deelvragen die de opdracht juist structureren.

### Leeftijds-passend vocabulaire (Criterium 5)
Taal past bij leerjaar 3: concreet, geen onnodig jargon. Termen als "branding" en "visuele identiteit" worden direct uitgelegd tussen haakjes — goed voorbeeld van jargon-met-uitleg.

### Curriculum-plek (Criterium 6)
`curriculum.ts` plaatst `startup-pitch` in leerjaar 3 (zie regel 299) — consistent met `sloEntry.yearGroup: 3`. Logische eindmissie: vraagt expliciet om combinatie van probleemanalyse, AI-oplossing, branding én ethiek — sluit aan als synthese-opdracht.

### AI-as-copilot (Criterium 8, niet van toepassing)
`tool-guide` heeft geen chat-component; leerling werkt zelfstandig met de tool. Geen bevinding.

### Blocking issues
Geen.

---

## Tech — score 4/10 (grotendeels engine-erfenis)

Static-only review (geen dev-server-sessie beschikbaar voor deze pass). De gedeelde `tool-guide`-engine is al beoordeeld in `engine-tool-guide.json`; hieronder alleen wat voor `startup-pitch` concreet relevant is.

### Geslaagd
- `missionId: 'startup-pitch'` consistent in alle vier bronnen (`templateRegistry.ts`, `slo-kerndoelen-mapping.ts`, `curriculum.ts`, `missionGoals.ts`).
- `maxScore: 55` klopt met 4 stappen × 10 (checklist) + 3 × 5 (vraagbonus, stap 3 heeft geen `verificationQuestion`) = 40 + 15 = 55.
- `missionGoals.ts`-entry (`type: 'steps-complete', min: 4`) is consistent met het aantal stappen in de config.

### Aandachtspunten
- **Gokbestendigheid (erft engine-blocker)** — zoals vastgesteld in `engine-tool-guide.json`: scoring is zelfrapportage. Voor déze missie betekent dat concreet dat een leerling zonder één woord over zijn startup te schrijven toch 40/55 (73%) haalt door alleen vinkjes te zetten, ruim boven de 40%-slaagdrempel. Dit is een engine-brede blocker, niet missie-specifiek oplosbaar binnen de config-whitelist.
- **State-herstel crash-risico (erft engine-blocker)** — als deze missie ooit een stap verliest/hernoemt (bijv. bij een toekomstige contentwijziging), kan een leerling met een oude opgeslagen `currentStep` op een wit scherm belanden. Vandaag geen actief probleem (4 stappen, stabiele IDs), maar het risico ontstaat bij elke toekomstige config-wijziging.
- **Stap 3 heeft geen `verificationQuestion`** — de andere drie stappen hebben er wel een; dit is functioneel toegestaan (het veld is optioneel) en verklaart de 55 i.p.v. 60 maxScore, maar betekent dat de kennischeck voor branding/logo volledig ontbreekt — een leerling kan de vinkjes van stap 3 aanklikken zonder enige inhoudelijke toets.

### Blocking issues
Geen missie-specifieke blockers buiten de whitelist-scope. De twee engine-blockers (gokbestendigheid, state-herstel) zijn genoteerd als "geërfd" en horen thuis in de engine-fix, niet in een per-missie autoFix.

---

## Voorstellen

### 1. Stap 3 een kennisvraag geven (mechanisch, binnen whitelist)

Stap 3 (branding) is de enige stap zonder `verificationQuestion`, waardoor de kennischeck voor dat onderdeel volledig ontbreekt.

**Voor:**
```ts
{
    id: 'stap-3-branding',
    title: 'Logo en slogan',
    instruction: '...',
    tip: '...',
    checklistItems: [
        { id: 'logo-beschreven', label: 'Ik heb mijn logo beschreven of getekend met symbool en kleuren' },
        { id: 'slogan', label: 'Ik heb een slogan van maximaal 6 woorden bedacht' },
        { id: 'kleurenpalet', label: 'Ik heb 2 à 3 kleuren gekozen (bijv. blauw = vertrouwen, groen = groei, oranje = energie) en uitgelegd waarom ze passen' },
    ],
},
```

**Na:**
```ts
{
    id: 'stap-3-branding',
    title: 'Logo en slogan',
    instruction: '...',
    tip: '...',
    checklistItems: [
        { id: 'logo-beschreven', label: 'Ik heb mijn logo beschreven of getekend met symbool en kleuren' },
        { id: 'slogan', label: 'Ik heb een slogan van maximaal 6 woorden bedacht' },
        { id: 'kleurenpalet', label: 'Ik heb 2 à 3 kleuren gekozen (bijv. blauw = vertrouwen, groen = groei, oranje = energie) en uitgelegd waarom ze passen' },
    ],
    verificationQuestion: {
        question: 'Waarom kiest een bank vaak blauw als merkkleur?',
        options: [
            'Omdat blauw de goedkoopste drukinkt is',
            'Omdat blauw vertrouwen en rust uitstraalt',
            'Omdat de wet blauw voorschrijft voor banken',
            'Kleur maakt voor een merk niets uit',
        ],
        correctIndex: 1,
        explanation: 'Precies! Kleuren roepen gevoelens op. Banken kiezen blauw omdat het vertrouwen en betrouwbaarheid uitstraalt — belangrijk als je met geld werkt.',
    },
},
```

### 2. Stap 2 en 4 iets inkorten (redactioneel, geen whitelist-mismatch)

Niet als autoFixable code-snippet aangeleverd omdat het puur redactionele herformulering is (geen mechanische voor/na-vervanging met vaste tekst) — advies voor Yorin om zelf de instructie-tekst van stap 2 en 4 met ~15-20 woorden in te korten, bijvoorbeeld door de drie bullet-vragen in stap 2 samen te voegen tot twee.

---

## Samenvatting en verdict

Startup Pitch is een sterke synthese-missie: drie kerndoelen (22A, 21D, 23C) worden elk substantieel geraakt, de missie staat logisch op zijn plek als leerjaar-3-afsluiter, en de copy is grotendeels beknopt en leeftijdspassend. De belangrijkste tech-bevindingen (gokbestendigheid, state-herstel) zijn geërfd van de gedeelde `tool-guide`-engine en niet missie-specifiek te repareren binnen de config-whitelist — ze horen in een aparte engine-fix. Missie-specifiek is vooral de ontbrekende kennisvraag in stap 3 een verbeterpunt, met een klaar-voor-gebruik voorstel hierboven.

**Verdict: ok** — geen missie-specifieke blocking issues; de engine-brede blockers gelden voor alle `tool-guide`-missies en worden apart getrackt.
