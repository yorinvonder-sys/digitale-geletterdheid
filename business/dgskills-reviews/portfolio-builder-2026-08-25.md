# Portfolio Builder — Rubric Review

**Datum:** 2026-08-25
**Template:** builder-canvas

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 6/10

De missie deelt de shared builder-canvas UI. Config-specifiek is er weinig designrisico: teksten zijn kort, checklists zijn scanbaar, tips zijn concreet.

- **[warning]** Gedeeld contrastprobleem raakt deze missie direct: elke stap gebruikt `StepInstructionPanel` (invoerveld + placeholder beide `text-duck-ink/70`) en `ChecklistItem` (labels op `/70`). Met vier stappen en een lang tekstveld per stap (project­selectie, reflecties, structuur, profiel) is dit de missie waar leerlingen het langst in dat lage-contrast tekstveld typen.
- **[info]** De badge-set (5 niveaus, 0–90) en het aantal iconen (max 4, engine heeft er 4) matcht precies dit aantal stappen — geen "stap 5 krijgt hetzelfde icoon"-risico dat de engine noemt, want deze config heeft exact 4 stappen.
- **[info]** `introFeatures` bevat 4 bullets die 1-op-1 met de 4 stappen corresponderen — consistent en voorspelbaar voor de leerling.

## Didactiek — score 7/10

- **[warning]** Scoring is engine-breed presence-based (zie enginebevindingen): een leerling die overal de checklist afvinkt en een plausibele zin van 40+ tekens typt haalt de volle stappunten, ongeacht kwaliteit. Voor een portfolio-missie is dit extra relevant omdat de opdracht juist om zelfreflectie en kwaliteitskeuzes vraagt (WWW-structuur, "groeizin", concreetheid) — precies het soort criterium dat een lengte/aanwezigheidscheck niet kan toetsen. De checklistitems zelf (`'www'`, `'groeizin'`, `'concreet'`) zijn zelfrapportage: een leerling kan ze aanvinken zonder dat de tekst er daadwerkelijk aan voldoet.
- **[info]** Didactisch sterk opgebouwd: stap 1 (selectie/prioriteren) → stap 2 (reflectie/WWW) → stap 3 (structuur/publieksgerichtheid) → stap 4 (persoonlijk profiel) volgt een logische opbouw van "wat heb ik" naar "wie ben ik", met heldere tips (bijv. het concrete CSS Grid/Flexbox-voorbeeld tegen vage taal).
- **[info]** `evidence`-veld zit alleen op stap 1, niet op stap 4 (persoonlijk profiel) terwijl dat juist de stap met het hoogste privacyrisico is (naam, foto, school). De instructie- en tip-tekst van stap 4 dekt dit wel expliciet af in proza ("Gebruik een pseudoniem...", "Vraag of vermeld geen contactgegevens..."), dus functioneel geen gat — wel inconsistent dat evidence-guidance niet ook daar structureel staat.
- **[info]** `missionGoals.ts`-entry voor `portfolio-builder` (min 4 van 4 stappen) is consistent met de 4 configstappen; geen drift tussen bestanden.

## Tech — score 8/10

Config-niveau is schoon: geen scoringswegingen die niet optellen, geen ontbrekende velden, wiring in `templateRegistry.ts`, `slo-kerndoelen-mapping.ts`, `curriculum.ts` en `missionGoals.ts` is compleet en consistent (missionId `portfolio-builder` overal identiek, chatRoleId gezet, SLO's 22A/21B logisch gekoppeld aan portfolio/presentatie).

- **[blocking]** (overgenomen van engine, raakt deze missie zonder mitigatie) Dubbelklik op de afrondknop kan `onComplete` tweemaal afvuren — deze config heeft geen eigen guard en de engine-fix (pending-state in `BuilderCanvas.handleComplete` + disabled-knop) is de enige oplossing; niets in de config kan dit zelf mitigeren.
- **[warning]** (overgenomen) `showMilestone` blijft na snelle herlaad zichtbaar — treft deze missie bij elke stapovergang net zo als elke andere builder-canvas-missie.
- **[info]** Config zelf bevat geen scriptbare/mechanische fouten: `maxScore: 100`, 4 badges + basislaag, `takeaways` sluiten aan op de 4 stappen.

---

## Voorstellen

Geen config-specifieke autoFixable wijzigingen gevonden — de blocking- en warning-bevindingen zitten in de gedeelde engine (`BuilderCanvas.tsx`, `CompletionScreen.tsx`, `StepInstructionPanel.tsx`, `ChecklistItem.tsx`, `MilestoneToast.tsx`) en horen niet in deze missie-config gefixt te worden.

Enige config-niveau suggestie (niet blocking, geen mechanische auto-fix — vergt inhoudelijke afweging van Yorin): overweeg een `evidence`-veld toe te voegen aan de `persoonlijk-profiel`-stap, zodat de privacyregels (geen naam/foto/school) ook structureel — niet alleen in proza — worden afgedwongen, consistent met stap 1.

Voorbeeld (niet toegepast, ter overweging):

```ts
// vóór (persoonlijk-profiel stap, geen evidence-veld)
textPrompt: 'Schrijf je persoonlijk profiel',
},

// ná
textPrompt: 'Schrijf je persoonlijk profiel',
evidence: {
    label: 'Bewijs voor je profiel',
    prompt: 'Noteer je makerprofiel en bevestig dat het geen naam, foto, school of contactgegevens bevat.',
    placeholder: 'Gebruik een pseudoniem of initialen; geen herleidbare details.',
    minLength: 45,
},
},
```

---

## Samenvatting

Portfolio Builder is didactisch een van de sterker opgebouwde builder-canvas-missies (logische opbouw, concrete tips, expliciete privacywaarborgen in proza voor het makerprofiel). De belangrijkste risico's zijn engine-breed (dubbelklik-afronding, presence-based scoring, contrast, milestone-toast) en niet in deze config op te lossen. Config-eigen wiring (SLO, curriculum, missionGoals, templateRegistry) is compleet en consistent.

**Verdict: fix-eerst** — vanwege de overgenomen blocking-bevinding (dubbele voltooiing bij dubbelklik), die pas verholpen is zodra de engine-fix is doorgevoerd; er is geen config-specifieke blocker.
