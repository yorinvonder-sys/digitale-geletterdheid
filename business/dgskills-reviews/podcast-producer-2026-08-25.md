# Missie-review: Podcast Producer

**Datum:** 2026-08-25
**templateType:** builder-canvas
**AI-gedrag & privacy:** aparte veiligheids-pass (zie sweep-rapport).

## Design — score 6.5/10

De config zelf is proper opgebouwd (4 stappen, checklist + tekstprompt + optionele reflectievraag, badges lopen netjes op). De bevindingen zijn overwegend engine-erfenis die dit template concreet raakt:

- **[blocking]** Afrondknop kan dubbel klikken tot dubbele voltooiing (CompletionScreen.tsx:163 / BuilderCanvas.tsx:264). Raakt podcast-producer net als elke builder-canvas-missie.
- **[warning]** Contrast: getypte antwoord en placeholder in `StepInstructionPanel.tsx` staan beide op `/70`-opacity — bij de lange tekstvelden van deze missie (podcaststructuur, interviewvragen) is dat zichtbaar hinderlijk omdat leerlingen langere teksten typen en moeilijk kunnen zien wat ze al typten vs. de placeholder.
- **[warning]** Mijlpaal-toast blijft na snel herladen (binnen 2s) permanent hangen — bij 4 stappen met relatief lange schrijftaken is de kans op een tussentijdse herlaad (bijv. per ongeluk) niet verwaarloosbaar.
- **[info]** Iconenlijst kent maar 4 iconen; podcast-producer heeft precies 4 stappen dus dit raakt de missie hier niet zichtbaar.

## Didactiek — score 7/10

Sterke opbouw: onderwerp → structuur → intro (met hook-uitleg) → interviewvragen (open vs. gesloten). De reflectievraag bij stap 'intro' toetst een relevant onderscheid (hook vs. intro) met een heldere uitleg. `missionGoals.ts` sluit aan op de 4 stappen en de evidence-tekst is concreet.

Bevindingen:
- **[warning]** Scoring is presence-based (engine-erfenis): een leerling die per stap alle checklist-items aanvinkt en één plausibele zin van 40 tekens typt haalt de volle stappunten, ongeacht of het onderwerp echt scherp is, de structuur klopt, de intro daadwerkelijk een hook bevat, of de vragen echt open zijn. Alleen de ene optionele reflectievraag (5 bonuspunten) discrimineert inhoudelijk. Voor een missie die expliciet leert onderscheiden tussen "hook" en "gewone intro" en tussen "open" en "gesloten" vragen, is dat een gemiste kans om die kennis ook te toetsen — nu hangt de inhoudelijke beoordeling volledig af van de docent achteraf.
- **[info]** De instructie bij stap 'vragen' vraagt "minstens 3 open vragen", maar de checklist-tekst herhaalt dit ("Minstens 3 vragen zijn open vragen") zonder dat het systeem dit daadwerkelijk controleert — het is zelfrapportage. Geen aparte bevinding nodig bovenop de algemene presence-based-scoring-bevinding, maar wel de duidelijkste illustratie ervan in deze missie.
- **[info]** Takeaways sluiten logisch aan op de 4 leerdoelen (onderwerp, structuur, intro, open vs. gesloten vragen). Geen probleem.

## Tech — score 8/10

Config en cross-references zijn consistent:
- `templateRegistry.ts:52` — `enableChat: true`, `chatRoleId: 'podcast-producer'`, matcht de config.
- `slo-kerndoelen-mapping.ts:134` — leerjaar 2, week 3, SLO 22A/21B + vso 19A/18B aanwezig.
- `curriculum.ts:210` — mission-id correct geplaatst.
- `missionGoals.ts:573` — `steps-complete` min 4, sluit aan op de 4 stappen in de config.

Geen missie-specifieke technische fouten gevonden. De enige tech-bevindingen zijn de gedeelde engine-issues (dubbelklik-afronding, state-herstel van de toast) die al in de enginebeoordeling staan en hier alleen worden geërfd, niet apart geïntroduceerd door deze config.

## Voorstellen

Deze missie heeft geen eigen configfouten om te fixen — de bevindingen zitten in de gedeelde engine/componenten en vallen buiten de whitelist voor auto-fix. Eén contentgerichte suggestie, optioneel, binnen de config-whitelist:

**Voor** (config, stap 'vragen', geen reflectievraag):
```ts
{
    id: 'vragen',
    title: 'Interviewvragen bedenken',
    ...
    textPrompt: 'Schrijf je interviewvragen',
},
```

**Na** (voeg een reflectievraag toe zodat het open-vs-gesloten-onderscheid ook getoetst wordt, niet alleen zelfgerapporteerd via de checklist):
```ts
{
    id: 'vragen',
    title: 'Interviewvragen bedenken',
    ...
    textPrompt: 'Schrijf je interviewvragen',
    reflectionQuestion: {
        question: 'Welke vraag is een open vraag?',
        options: ['Ben je weleens boos geweest?', 'Heb je dit al eens meegemaakt?', 'Wat maakte deze ervaring bijzonder voor jou?', 'Vind je dit een goed idee?'],
        correctIndex: 2,
        explanation: 'Open vragen beginnen met hoe, wat, waarom of "vertel eens" en nodigen uit tot een verhaal in plaats van een kort ja/nee-antwoord.',
        bonusPoints: 5,
    },
},
```
Dit is een contentwijziging, geen mechanische fix — daarom niet opgenomen in `autoFixable` (die vraagt om exacte, laagrisico mechanische snippets; een nieuwe reflectievraag is een didactische keuze die Yorin eerst moet goedkeuren).

## Samenvatting & verdict

De podcast-producer-config zelf is goed geschreven: heldere instructies, logische opbouw, correcte wiring in alle vier de registries. De reële risico's zitten in de gedeelde builder-canvas-engine (dubbelklik-afronding, presence-based scoring, contrast, toast-persistentie) — die zijn al vastgesteld op engineniveau en gelden voor alle 19 builder-canvas-missies, niet uniek voor deze. Voor deze missie is de belangrijkste inhoudelijke kanttekening dat het kern-leerdoel "open vs. gesloten vragen" niet getoetst wordt, alleen zelfgerapporteerd.

**Verdict: ok** (geen missie-specifieke blockers; de blocking-bevinding is engine-breed en hoort thuis in de engine-fix, niet in een config-aanpassing van deze missie).
