# Review: Open Source Contributor

**Datum:** 2026-08-25 · **templateType:** builder-canvas

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## 🎨 Design review

**Score: 6.5/10**

### ✅ Geslaagd
- Tailwind-tokens en layout consistent met andere builder-canvas-missies; geen ad-hoc kleuren in de config zelf.
- Copy-lengte per stap is redelijk voor jaar 3 (langere instructieteksten, maar met duidelijke opsomming 1-2-3).
- `previewType: 'text-preview'` past bij een codeer-/schrijfopdracht zonder canvas-preview nodig.

### ⚠️ Aandachtspunten
- Engine-erfelijk contrastprobleem raakt deze missie concreet: alle vier de stappen hebben lange, vrije tekstinvoer (workflow, issue-analyse, bugfix, PR-tekst) via `StepInstructionPanel`, dus leerlingen typen hier het meest van alle builder-canvas-missies in een veld met `text-duck-ink/70` — zowel getypte tekst als placeholder. Dit is geen engine-fix binnen deze config, maar wel de missie waar het risico het zwaarst weegt qua tijd-in-veld.
- Geen visuele afbeelding/diagram bij de git-workflow-stap (fork→clone→branch→fix→commit→push→PR) terwijl dit bij uitstek een stap is die met een simpel schema sneller landt dan met tekst alleen.

### ❌ Blocking issues
- Geen blocking design-issues gevonden in de config zelf.

### Score
**6.5/10** — degelijk en consistent, maar de missie is voor 100% tekst-invoer over vier lange stappen zonder enige visuele ondersteuning (schema, code-highlighting), wat voor een onderwerp als git-workflows een gemiste kans is.

---

## 📚 Didactiek review

**Score: 7/10**

### ✅ Geslaagd
- SLO-codes `22B`, `23C` passen bij programmeren/open source community; mapping-comment legt de keuze uit.
- Leerdoel (`missionGoals.ts`) is helder en dekt de vier stappen 1-op-1.
- Opbouw is didactisch logisch: begrip (workflow) → analyse (issue) → toepassing (bugfix) → communicatie (PR) — een oplopende Bloom-reeks van begrijpen naar creëren.
- Concepten worden uitgelegd in leek-taal met haakjes ("fork (= een opslagplek voor code)"), goed voor jaar 3-doelgroep.
- Realistisch scenario (sorteerbug met tiebreaker) is concreet en navolgbaar, geen abstracte opdracht.

### ⚠️ Aandachtspunten
- Scoring is engine-breed presence-based (zie enginebevinding): bij deze missie is dat extra relevant, want de opdracht vraagt inhoudelijk correcte technische claims (bv. "verklaar verschil fork/clone", "schrijf het juiste Git-commando bij elke stap") die de tekstcheck niet inhoudelijk verifieert — een leerling die overtuigend klinkende maar technisch foute uitleg geeft (bv. fork en clone verwisselt) haalt toch de volle stappunten. Dit is een didactisch risico specifiek voor kennisintensieve stappen als deze, sterker dan bij vaardigheids-missies.
- Stap "bugfix" vraagt een testgeval te "schrijven" maar er is geen enkele vorm van code-uitvoering of syntaxcontrole — de leerling kan een niet-werkende of syntactisch foute code-snippet indienen zonder dat de missie dat signaleert.
- Geen enkele stap heeft een optionele verdiepingsvraag (de enige inhoudelijk discriminerende scoringscomponent volgens de enginebevinding) — dat betekent dat déze missie voor 100% van de score op presence-based checklists en tekstlengte leunt, zonder het partiële tegenwicht dat andere configs wel hebben.

### ❌ Blocking issues
Geen.

### SLO-fit oordeel
Passend. `22B`/`23C` (programmeren, code/open source community) dekken de kerninhoud correct.

### Score
**7/10** — sterke opbouw en realistisch scenario, maar het ontbreken van elke verdiepingsvraag maakt deze missie extra gevoelig voor het generieke presence-based scoringsprobleem: hier is er geen enkel scoringselement dat inhoudelijke juistheid toetst.

---

## 🔧 Tech review

**Score: 7/10** (static analyse; geen dynamic web-verificatie uitgevoerd binnen deze deelreview — engine is al apart beoordeeld)

### Static analyse

#### ✅ Geslaagd
- Config volledig getypeerd volgens `BuilderCanvasConfig`; puntenverdeling (impliciet via engine) sluit aan op `maxScore: 100`.
- Wiring compleet: registry, SLO-mapping, curriculum en missionGoals hebben allemaal een consistente entry met dezelfde `missionId`.
- `chatRoleId: 'open-source-contributor'` en `enableChat: true` consistent tussen config en registry.

#### ⚠️ Aandachtspunten
- Deze missie erft de engine-brede bevindingen die haar concreet raken: (1) het dubbele-klik-risico op de afrondknop (elke builder-canvas-missie, inclusief deze, kan bij snel dubbelklikken dubbele voltooiing/XP geven); (2) de `showMilestone`-persistentie-bug (herlaadt een leerling binnen 2 seconden na een stap-afronding, dan blijft de mijlpaal-toast permanent staan — bij een missie met 4 stappen en lange schrijftijd per stap is de kans op een toevallige herlaad-timing binnen dat venster net zo groot als bij andere missies, niet groter of kleiner).
- Geen missie-specifieke technische issues gevonden buiten de reeds vastgestelde engine-bevindingen.

#### ❌ Blocking issues
Geen missie-specifieke blocking issues. De engine-brede blocking issue (dubbelklik-afronding) is al genoteerd in de gedeelde enginebevindingen en hoeft niet opnieuw als aparte blocker voor deze missie te worden opgelost — de fix hoort in `CompletionScreen.tsx`/`BuilderCanvas.tsx`, niet in deze config.

### Score
**7/10** — wiring correct en compleet; resterende risico's zijn uitsluitend de al-gedocumenteerde engine-brede issues, geen missie-specifieke technische fouten.

---

## Voorstellen

Binnen de whitelist voor deze missie (alleen de eigen entries in config/registry/slo/curriculum/missionGoals) is er weinig mechanisch te repareren — de belangrijkste bevindingen zitten in de gedeelde engine (buiten scope voor auto-fix hier). Eén contentverbetering die wél binnen de configfile zelf kan:

**Voorstel: voeg een optionele verdiepingsvraag toe aan de "bugfix"-stap, zodat er minstens één inhoudelijk discriminerend scoringselement is.**

Voor (huidige `bugfix`-stap, geen `deepenPrompt`/verdiepingsveld aanwezig):
```ts
{
    id: 'bugfix',
    title: 'Bugfix schrijven',
    ...
    textPrompt: 'Schrijf je bugfix met testgeval',
},
```

Na (indien `BuilderCanvasConfig` een optioneel verdiepingsveld per stap ondersteunt — controleer eerst het type in `BuilderCanvas.tsx` voordat dit wordt toegepast):
```ts
{
    id: 'bugfix',
    title: 'Bugfix schrijven',
    ...
    textPrompt: 'Schrijf je bugfix met testgeval',
    deepen: {
        prompt: 'Bonus: wat zou er misgaan als de tiebreaker op titel ook een lege string kan zijn? Hoe zou je dat afvangen?',
        placeholder: 'Bijv. lege titel sorteert vóór alles; check op ontbrekende titel voordat je vergelijkt.',
        maxPoints: 10,
    },
},
```

Dit voorstel raakt alleen de missie-eigen config-entry, is niet mechanisch 1-op-1 toepasbaar zonder het `BuilderCanvasConfig`-type te verifiëren (vandaar niet in `autoFixable` opgenomen), en is een didactische verbetering, geen bugfix.

## Samenvatting

Open Source Contributor is een goed opgebouwde, realistische missie met correcte SLO-fit en een logische leerlijn van begrip naar toepassing naar communicatie. De belangrijkste risico's zijn niet missie-specifiek maar erven van de gedeelde builder-canvas-engine: presence-based scoring (hier extra gevoelig omdat er geen enkele verdiepingsvraag is), het dubbelklik-afrondingsrisico, en de contrast-/mijlpaal-issues. Geen missie-specifieke blocking issues gevonden.

**Verdict: ok** (met kanttekening dat de engine-brede blocking issue — dubbele afronding — elders opgelost moet worden, niet in deze config).
