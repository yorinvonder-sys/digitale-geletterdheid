# Rubric-review: App Prototyper
Datum: 2026-08-25 · templateType: builder-canvas

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10

De missie volgt een logische, professionele UX-designcyclus (probleem → wireframes → flow → testplan), wat zelf al een sterk vormgevend keuze is. Zwaktes zitten in de gedeelde engine, niet in deze config specifiek:

- **[blocking, gedeeld]** Afrondknop kan dubbel worden ingedrukt (`CompletionScreen.tsx:163`, `BuilderCanvas.tsx:264`) — geen pending-guard, dus dubbele afronding/XP mogelijk. Raakt deze missie net zo hard als elke andere builder-canvas-missie.
- **[warning, gedeeld]** Contrastrisico op `/70`-opacity tokens in `StepInstructionPanel.tsx` en `ChecklistItem.tsx` — het eigen antwoord van de leerling en de placeholder-tekst zijn in deze missie identiek gekleurd, wat het lastiger maakt te zien wat al getypt is bij lange antwoorden (150-200 tekens verplicht in deze config).
- **[warning, gedeeld]** Mijlpaal-toast blijft na snelle herlaad permanent staan — bij een missie met 4 stappen en lange tekstvelden is de kans op tussentijds herladen (bijv. per ongeluk) reëel.
- **[info]** Vanaf stap 5 zou het icoon herhalen, maar deze missie heeft er slechts 4 — niet van toepassing.

## Didactiek — score 7/10

Sterk: de opbouw dekt de complete ontwerpcyclus, elke stap heeft een heldere tip die aansluit bij UX-praktijk (duim-bereik, "observeer stilletjes"), en de reflectievraag bij wireframes toetst begrip in plaats van herhaling. `missionGoals.ts` en de config zijn onderling consistent (probleemanalyse, 3 wireframes, 2 flows, testplan met 3 taken).

Aandachtspunten:
- **[warning, gedeeld]** Scoring is presence-based: 150-200 tekens plausibele tekst + alle checklist-vinkjes geeft altijd de volle stappunten. Bij deze missie is dat extra relevant omdat de opdrachten (5 W's, 3 wireframes, 2 flows) makkelijk oppervlakkig "afgevinkt" kunnen worden zonder dat de tekst daadwerkelijk 3 aparte wireframes bevat — de checklist controleert alleen zelfrapportage ("Ik heb 3 schermen beschreven"), niet de inhoud.
- **[info]** Alleen de wireframe-stap heeft een reflectievraag (5-20 bonuspunten); de andere drie stappen discrimineren dus uitsluitend via aanwezigheid, niet via inhoudelijke juistheid. Een tweede reflectievraag bij bijvoorbeeld de testplan-stap (fout-flow vs. testtaak onderscheiden) zou de inhoudelijke toetsing verbreden.
- **[info]** `minTextLength` loopt logisch op (150/150/150/200) met de complexiteit van de opdracht — consistent en gepast.

## Tech — score 8/10

Config zelf is technisch schoon: `missionId`, `chatRoleId` en registry-entry (`templateRegistry.ts:57`), SLO-mapping (`slo-kerndoelen-mapping.ts:118`), curriculum-plaatsing (`curriculum.ts:190`) en `missionGoals.ts:618` zijn onderling consistent. `maxScore: 100`, badges lopen aflopend 90/70/50/25/0, checklist-items hebben unieke ids per stap.

- **[warning, gedeeld]** Presence-based scoring (zie hierboven) is een tech-risico voor gokbestendigheid, niet specifiek voor deze config.
- **[info, gedeeld]** `completedSteps` wordt nooit teruggedraaid na "Vorige stap" — bij een missie met 4 relatief lange stappen (150-200 tekens) is de kans dat een leerling teruggaat om te herzien niet verwaarloosbaar.
- **[info]** SLO-kerndoel-comment in `slo-kerndoelen-mapping.ts:118` noemt "-22B: prototype ontwerpen zonder code" als toelichting, geen bevinding — dit is consistent met de missie-inhoud (wireframes/flow zonder code).

## Voorstellen

Geen mechanische autoFixable-wijzigingen binnen de whitelist-scope gevonden: de config, registry-entry, SLO-mapping, curriculum-entry en missionGoals-entry zijn intern consistent en bevatten geen missie-eigen fouten. Alle blocking/warning-bevindingen zitten in de gedeelde builder-canvas-engine (buiten scope van deze missie-specifieke whitelist) en zijn al vastgelegd in het enginerapport.

Suggestie (niet mechanisch, ter overweging voor een volgende contentronde): voeg een tweede `reflectionQuestion` toe aan de `testplan`-stap om inhoudelijke toetsing te verbreden, bijvoorbeeld:

```ts
// voor: testplan-stap heeft geen reflectionQuestion
// na (voorstel):
reflectionQuestion: {
    question: 'Waarom observeer je een testgebruiker liever stilletjes dan dat je meteen ingrijpt?',
    options: [
        'Om tijd te besparen',
        'Om te zien hoe de gebruiker de app écht ervaart, zonder sturing',
        'Omdat ingrijpen niet mag van de docent',
        'Om de test sneller af te ronden',
    ],
    correctIndex: 1,
    explanation: 'Ingrijpen verstoort het natuurlijke gedrag van de testgebruiker — juist dat gedrag wil je observeren.',
    bonusPoints: 5,
},
```

## Samenvatting & verdict

App Prototyper is een inhoudelijk sterke, goed opgebouwde UX-missie met consistente wiring over alle vijf bestanden. De belangrijkste risico's (dubbele afronding, presence-based scoring, contrast, toast-persistentie) zitten allemaal in de gedeelde builder-canvas-engine en gelden voor alle 19 configs — dit is geen missie-specifiek probleem en vereist geen aparte fix hier. Missie-eigen bevindingen zijn beperkt tot info-niveau suggesties.

**Verdict: ok** (geen missie-eigen blockers; engine-brede issues staan al genoteerd in het enginerapport).
