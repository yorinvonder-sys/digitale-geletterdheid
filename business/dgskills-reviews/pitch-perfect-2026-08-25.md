# Missiereview: Pitch Perfect

**Datum:** 2026-08-25
**templateType:** builder-canvas
**Wiring:** compleet en consistent — `templateRegistry.ts:65`, `slo-kerndoelen-mapping.ts:199` (21B, 22A), `curriculum.ts:314` (J3P4), `missionGoals.ts:690`, `agents/year3.tsx:2051`.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7.5/10

- Geen missie-specifieke designfouten gevonden; de config volgt het bestaande builder-canvas-patroon (checklist + tekstvak + evidence) consistent met de andere 19 configs.
- De engine-brede contrastwaarschuwing (`text-duck-ink/70` op leerlingtekst en placeholder, zie enginebevindingen) raakt deze missie net zo hard als de andere: 4 stappen × een groot vrij-tekstveld waar de leerling zijn eigen pitch typt. Geen config-actie mogelijk (component-niveau).
- Iconenbeperking uit de engine (4 iconen, missie heeft 4 stappen) raakt deze missie toevallig niet — precies genoeg iconen voor 4 stappen.

## Didactiek — score 8.5/10

- Sterke, realistische opbouw: hook → probleem → oplossing → resultaat → reflectie → afsluiting, met concrete tijdsindicaties per onderdeel — herkenbaar uit echte pitchtrainingen.
- Goede privacybewuste instructies: peerfeedback expliciet "zonder namen of contactgegevens", en de tip bij stap 3 waarschuwt expliciet tegen het opnemen van video/gezicht/stem.
- Stap 4 (jury-vragen) leert productief omgaan met onzekerheid ("Dat weet ik niet" + concreet vervolg) — sterke soft-skill-les, niet alleen kennisoverdracht.
- Zwak punt, gedeeld met alle 19 builder-canvas-configs (zie enginebevindingen "scoring"): een leerling die de checklist afvinkt en 40 tekens plausibele tekst per stap typt haalt de volle 100 punten zonder dat een echte pitchstructuur, feedbackverwerking of jury-antwoord inhoudelijk klopt. Bij déze missie is dat extra relevant omdat de opdracht juist draait om kwaliteit van argumentatie (een hook die niet "Mijn project gaat over…" is, een antwoord van max 3 zinnen) — precies het soort criterium dat de tekstcheck niet toetst.
- Alleen stap 1 heeft een verplicht evidence-veld (minLength 45); stappen 2–4 leunen volledig op de checklist + tekstlengte. Dat is een bewuste, geen foutieve keuze (niet elke stap heeft "bewijs" nodig), maar het versterkt wel het presence-based scoringsrisico hierboven voor 3 van de 4 stappen.

## Tech — score 8/10

- Config zelf is intern consistent: `maxScore: 100`, badges monotoon aflopend (90/70/50/25/0), 4 checklist-stappen met unieke ids, `enableChat: true` + `chatRoleId: 'pitch-perfect'` matcht de agent-registratie in `agents/year3.tsx:2051`.
- Geen missie-specifieke technische fouten gevonden. De blocking bevinding uit de enginepass (dubbele `onComplete` bij snel dubbelklikken) is een gedeeld component-defect (`CompletionScreen.tsx`/`BuilderCanvas.tsx`) dat deze missie erft maar niet zelf veroorzaakt — niet hier oplosbaar binnen de configscope.
- De state-herstelbug met `showMilestone` (toast blijft hangen na herlaad binnen 2s) raakt deze missie op dezelfde manier als alle andere builder-canvas-missies; ook dit is engine-scope.

## Voorstellen

Geen missie-specifieke autofix mogelijk binnen de whitelist-scope (config/registry/SLO/curriculum/missionGoals/agent-entry) — alle geconstateerde risico's zitten óf in de gedeelde engine (buiten scope van deze missie-review) óf zijn bewuste ontwerpkeuzes (geen evidence-veld op stap 2–4).

Enige optionele, niet-blokkerende suggestie binnen de config zelf: een lichte evidence-vraag toevoegen aan stap 4 (jury-vragen) om het presence-based scoringsrisico daar te verkleinen, bijvoorbeeld:

```ts
// voor (stap 'jury-vragen', geen evidence-veld):
{
    id: 'jury-vragen',
    ...
    textPrompt: 'Schrijf je jury-vragen en antwoorden',
},

// na — voegt een korte zelfreflectie-check toe die verder gaat dan alleen tekstlengte:
{
    id: 'jury-vragen',
    ...
    textPrompt: 'Schrijf je jury-vragen en antwoorden',
    evidence: {
        label: 'Sterkste antwoord',
        prompt: 'Welk van je vier antwoorden vind je zelf het sterkst, en waarom?',
        placeholder: 'Antwoord op vraag over … is het sterkst omdat …',
        minLength: 40,
    },
},
```

Dit is een verbetervoorstel, geen blocking fix — niet automatisch toegepast.

## Samenvatting en verdict

Pitch Perfect is een didactisch sterke, goed doordachte missie met realistische pitchstructuur en bewuste privacywaarborgen. De wiring (registry/SLO/curriculum/goals/agent) is compleet en correct. De enige noemenswaardige risico's — presence-based scoring, dubbele-klik-op-afronden, showMilestone-herstelbug, tekstcontrast — zijn allemaal engine-brede kwesties die deze missie erft, niet iets dat in de missie-config zelf fout zit.

**Verdict: ok** (geen missie-specifieke blocking bevindingen; engine-bevindingen staan al vast in de sweep en worden daar opgevolgd).
