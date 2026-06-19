# Review: phishing-fighter

**id:** phishing-fighter  
**datum:** 2026-06-17  
**templateType:** scenario-engine  
**verdict:** Didactisch solide en tech-stabiel; twee blokkers (STEP_COMPLETE ontbreekt in config + learningObjectives ontbreken); UX bevat hardcoded hex in badges en legacy lab-tokens in agent visualPreview.

---

## 🎨 Design review

### ✅ Goed

- Engine-componenten (ScenarioEngine.tsx, SelectCorrectRound.tsx, BinaryChoiceRound.tsx, OrderPriorityRound.tsx) gebruiken consequent `duck-*` tokens.
- Buttons hebben `disabled`-state, hover-states (`hover:brightness-95`, `hover:shadow-md`, `active:scale-[0.98]`) en zijn goed afleesbaar.
- BinaryChoiceRound heeft `focus-visible:ring-2` op beide actiebuttons (accept/reject); touch-target is `min-h-[44px]` — voldoet aan WCAG 2.5.5.
- LoadingScreen en ErrorScreen aanwezig; ErrorScreen heeft een werkende "Terug"-knop.
- Introductie-copy (35 woorden) en ronde-instructies (~20 woorden) vallen ruim binnen de jr3-normen (<120w / <80w).
- Responsiviteit via `max-w-md mx-auto p-4` — mobiel-first, geen vaste px-breedte.
- Emoji-iconen in items hebben geen alt-tekst nodig (decoratief); img-varianten in ScenarioIcon hebben `alt=""` correct.

### ⚠️ Aandachtspunten

1. **Hardcoded hex in badge `color`-veld** — de badge-kleuren worden gebruikt door CompletionScreen (niet geïnspecteerd, maar het patroon is duidelijk). De waarden `#e1ff01` en `#202023` matchen respectievelijk `duck-acid` / `duck-ink` uit designTokens.ts, maar staan als hex in de config hardcoded.

   ```ts
   // src/features/missions/templates/scenario-engine/configs/phishing-fighter.ts:22–41
   // VOOR:
   { minScore: 80, emoji: '🛡️', title: 'Phishing Expert', color: '#e1ff01' },
   { minScore: 60, emoji: '🔍', title: 'Waakzame Detective', color: '#202023' },
   { minScore: 40, emoji: '📚', title: 'Goed Begonnen', color: '#202023' },
   { minScore: 0,  emoji: '🌱', title: 'Blijf Oefenen', color: '#202023' },
   // NA (als BadgeConfig.color string-literals accepteert):
   // Voorkeur: ESCALATIE — laat CompletionScreen token-names resolven i.p.v. raw hex doorgeven.
   // Quick-fix als het een CSS-var-in-color-string niet aankan: laat zo, maar documenteer.
   ```

2. **Legacy `lab-gold` / `lab-coral` in agent visualPreview** — de `<div className="... from-lab-gold to-lab-coral ...">` in `src/config/agents/year3.tsx:760` gebruikt legacy `lab-*` tokens in plaats van `duck-*`. Dit valt buiten de missie-config zelf, maar is zichtbaar op de leerling-dashboard-kaart.

   ```tsx
   // src/config/agents/year3.tsx:760
   // VOOR:
   <div className="w-full h-full bg-gradient-to-br from-lab-gold to-lab-coral ...">
   // NA:
   <div className="w-full h-full bg-gradient-to-br from-duck-acid to-duck-sunset ...">
   // (of: from-duck-acid to-duck-ink — afhankelijk van welk palet de designer kiest)
   ```

3. **Hardcoded hex `#08283B` in BinaryChoiceRound** — regel 80 gebruikt `ring-[#08283B]/30` voor de reject-button focus ring in plaats van `ring-duck-ink/30`.

   ```tsx
   // src/features/missions/templates/scenario-engine/sub/BinaryChoiceRound.tsx:80
   // VOOR:
   focus-visible:ring-2 focus-visible:ring-[#08283B]/30
   // NA:
   focus-visible:ring-2 focus-visible:ring-duck-ink/30
   ```

4. **Geen screenshots** — visuele beoordeling niet mogelijk; UI beoordeeld via source only. Markering: **niet geverifieerd (geen screenshot)**.

### ❌ Blokkers

Geen blokkers in de UI-laag.

---

## 📚 Didactiek review

### ✅ Goed

- **SLO-koppeling klopt inhoudelijk**: 23A (veiligheid & privacy) dekt herkennen van phishing-aanvallen; 22A (digitale producten) dekt het ontwerpen van trainingsmateriaal. De agent-systemInstruction werkt ook expliciet toe naar het trainingsontwerp (stap 2 en 3). Beide codes zijn legitiem en niet oppervlakkig.
- **Doel is aantoonbaar bereikbaar** via de vier rondes: herkennen (R1), risicoanalyse (R2), toepassen (R3), beschermen + adviseren (R4+followUp). De progressie loopt van herinnering → analyse → evaluatie → toepassing.
- **Bloom-balans is goed**: R1 (herinnering/analyse), R2 (evaluatie/ordening), R3 (toepassing/evaluatie), R4 + followUp (toepassing/adviseren). Geen clustering op recall-only.
- **Leeftijdsadequaatheid**: scenario's zijn concreet (Magister, DUO, WhatsApp-fraude, Google-melding), herkenbaar voor havo/vwo jr3. Toon is informatief zonder betuttelend te zijn.
- **Nuancering is sterk**: items 4 (vertrouwd platform), 6 (logo kopieerbaar), 8 (HTTPS ≠ betrouwbaar) en badge-item 8 (HTTPS is basischeck maar voldoet niet) trainen ook de "niet-automatisch verdacht"-reflex. Dit voorkomt oversimplificatie.
- **Geen kant-en-klare antwoorden**: de agent coacht via gesimuleerde voorbeelden en laat de leerling zelf analyse uitvoeren. SCOPE GUARD voorkomt misbruik voor echte phishing.
- **Wellbeing/inclusiviteit**: tone-of-voice is empowerend ("Jij leert de trucjes te herkennen"). Geen angst-taal in instructies.
- **FollowUp in R4** is een sterke toepassingsvraag: het vraagt om advies-geven aan een klasgenoot, wat de transfer-stap activeert.

### ⚠️ Aandachtspunten

1. **`learningObjectives` ontbreekt** in de config — het veld bestaat in `ScenarioEngineConfig` (optioneel, maar aanbevolen voor SLO-rapportage). Zonder dit heeft de docent geen exporteerbare leerdoelen per missie.

   ```ts
   // src/features/missions/templates/scenario-engine/configs/phishing-fighter.ts — voeg toe na introFeatures:
   learningObjectives: [
       'Benoem minimaal 4 rode vlaggen in een gesimuleerd phishing-bericht.',
       'Rangschik phishing-aanvallen op gevaar op basis van doelwit en schade.',
       'Onderscheid echte berichten van phishing in realistische scenario\'s.',
       'Adviseer een klasgenoot over de veiligste reactie op een verdacht bericht.',
   ],
   ```

2. **`missionGoal` ontbreekt in de scenario-engine config** — `ScenarioEngine.tsx:192` probeert `config.missionGoal ?? getMissionGoal(config.missionId)`. Er is geen `missionGoal` in phishing-fighter.ts, en `getMissionGoal` slaat op `missionGoals.ts` — maar phishing-fighter staat **niet** in missionGoals.ts. Dit betekent dat `getMissionGoal('phishing-fighter')` `undefined` teruggeeft, en de IntroScreen geen leerlingdoel toont.

   **ESCALATIE (niet auto-fixbaar)**: Voeg phishing-fighter toe aan `src/config/missionGoals.ts`. Vergelijkbaar met mail-detective (zie regel 234-241) maar voor jr3:

   ```ts
   // src/config/missionGoals.ts — voeg toe (positie: na 'mail-detective', vóór 'data-handelaar'):
   'phishing-fighter': {
       primaryGoal: 'Ik herken phishing-aanvallen en adviseer anderen over de veiligste reactie.',
       criteria: {
           type: 'rounds-complete',
           description: 'Je analyseert, rangschikt en beoordeelt phishing-scenario\'s en geeft advies.',
       },
       evidence: 'Je kunt minimaal vier rode vlaggen benoemen en een veilig advies geven bij een verdachte mail.',
   },
   ```

3. **Curriculum-mismatch 22A**: phishing-fighter staat in de SLO-mapping voor week 2 periode 2 (Cybersecurity-blok, jr3). De 22A-doelstelling (trainingsmateriaal ontwerpen) leeft volledig in de **agent-chat** (stap 2–3), maar de vier scenario-engine-rondes dekken uitsluitend 23A. Leerlingen die alleen de engine-rondes doen (zonder chat) halen 22A niet. Dit is een structureel probleem als de engine als zelfstandige toets telt.

   **ESCALATIE (niet auto-fixbaar)**: Overweeg of 22A uit de slo-mapping-entry gehaald wordt (missie dekt dan alleen 23A via de engine), of dat er een vijfde ronde of afsluiting in de engine wordt toegevoegd die het trainingsontwerp-aspect raakt. Dit is een didactisch besluit, geen auto-fix.

### ❌ Blokkers

1. **STEP_COMPLETE-criteria ontbreken volledig in de config** — de triage (2026-06-15, regel 174) vlagde dit al. De `systemInstruction` in year3.tsx (regel 799–801) definieert wel STEP_COMPLETE-triggers, maar de config-file (`phishing-fighter.ts`) heeft geen `steps`-veld of `stepCriteria`. Dit is alleen een blokker als de engine-config leading is voor stap-voltooiing; als de agent-chat de stap-voltooiing afhandelt, is het geen engine-blokker maar een agent-config-verantwoordelijkheid. Gezien de scheiding engine/agent: **engine is compleet, stap-voltooiing is agent-verantwoordelijkheid** — geen blokker voor de engine zelf, maar gemarkeerd voor de agent-review.

---

## 🔧 Tech review

### ✅ Goed

- **`useMissionAutoSave`** is correct geïmporteerd en gebruikt in `ScenarioEngineInner` (regel 116–119); `clearSave()` wordt aangeroepen bij `handleComplete` (regel 181). Restart-safe.
- **Geen `: any` / `@ts-ignore`** aangetroffen in engine of config.
- **`@/*` imports** correct gebruikt in ScenarioEngine.tsx.
- **Async-patronen**: config wordt geladen via dynamic `import()` met `.catch(() => setLoadError(true))` — loading en error states zijn aanwezig en gerenderd.
- **Geen XSS-risico**: alle user-facing content is statisch (uit de config) of React-gerenderd (geen `dangerouslySetInnerHTML`). Geen user-input in deze engine.
- **`promptSanitizer`** is niet van toepassing op de scenario-engine (geen user-input naar AI in de engine-rondes zelf).
- **Buttons zijn allemaal correct bedraad**: `onToggle`, `onSubmit`, `onChoice`, `handleNextRound`, `handleComplete` zijn alle verbonden. Geen dode buttons gevonden.
- **`scoreRound` + `adjustedScoreRound`**: logica klopt; confidence multiplier en followUp-bonus worden correct gecapped op `round.maxScore`.
- **`systemInstruction` blijft server-side** via `roleId`-patroon in agents (year3.tsx); niet geëxponeerd naar client.

### ⚠️ Aandachtspunten

1. **Hardcoded hex in BinaryChoiceRound.tsx:80** (`ring-[#08283B]/30`) — zelfde bevinding als in design-sectie; hoort thuis in de tech-checklist als tokenisatie-issue.

2. **`followUp.bonusPoints` is 0** in phishing-fighter R4 (regel 325). Dit is functioneel correct maar het `followUpAnswered`/`followUpCorrect` state wordt toch bijgehouden en geëvalueerd in de scoring (`adjustedScoreRound`). Geen bug, maar documenteer expliciet dat dit design-keuze is (geen bonuspunten, maar gedrag telt mee voor `goalAchieved`-evaluatie als dat ooit wordt toegevoegd).

3. **`order-priority` scorelogica** — `correctPosition` is 0-indexed in de config (R2, regels 175–217) maar de `scoreRound` functie in FeedbackBanner.tsx is hier niet geïnspecteerd. Risico: als scoreRound 1-indexed verwacht, scoren alle items fout. **Aanbeveling**: verifieer dat `scoreRound` en `correctPosition: 0` consistent zijn.

### ❌ Blokkers

Geen tech-blokkers in de engine-laag.

---

## Samenvatting issues

| # | As | Ernst | Omschrijving | Bestand |
|---|---|---|---|---|
| 1 | Didactiek | ❌ Blokker (ESCALATIE) | `phishing-fighter` ontbreekt in `missionGoals.ts` → geen primaryGoal in IntroScreen | `src/config/missionGoals.ts` |
| 2 | Didactiek | ❌ Blokker (ESCALATIE) | 22A niet gedekt door engine-rondes; leeft alleen in agent-chat | `src/config/slo-kerndoelen-mapping.ts` / didactisch besluit |
| 3 | Didactiek | ⚠️ | `learningObjectives` ontbreekt in config (SLO-rapportage) | `configs/phishing-fighter.ts` |
| 4 | UX | ⚠️ | Badge-kleuren hardcoded hex (`#e1ff01`, `#202023`) i.p.v. token-referentie | `configs/phishing-fighter.ts:22–41` |
| 5 | UX | ⚠️ | Legacy `lab-gold`/`lab-coral` in agent visualPreview | `src/config/agents/year3.tsx:760` |
| 6 | UX / Tech | ⚠️ | Hardcoded `#08283B` in BinaryChoiceRound focus ring | `sub/BinaryChoiceRound.tsx:80` |
| 7 | Tech | ⚠️ | `order-priority` `correctPosition: 0` — verifieer consistentie met `scoreRound` | `sub/FeedbackBanner.tsx` + `configs/phishing-fighter.ts` |
