# Rubric-review: meme-machine

**Datum:** 2026-08-25
**TemplateType:** builder-canvas

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10

De config zelf introduceert geen nieuwe visuele problemen; de bevindingen komen uit de gedeelde builder-canvas UI (StepInstructionPanel, ChecklistItem, MilestoneToast) en gelden dus voor alle configs op dit template, inclusief meme-machine.

- **warning** — `src/features/missions/templates/builder-canvas/sub/StepInstructionPanel.tsx:157` — leerling-invoertekst en placeholder gebruiken dezelfde `text-duck-ink/70`-kleur, dus getypte tekst is nauwelijks te onderscheiden van de placeholder. Voor meme-machion's lange, vrije tekstvelden (analyse, viraliteitsredenen, memedesign, reflectie) is dit hinderlijk omdat leerlingen langere stukken tekst schrijven.
- **warning** — `.../sub/MilestoneToast.tsx:13` — geen `role="status"`/`aria-live` op de voortgangstoast na elke stap; bij 4 stappen in meme-machine mist een schermlezergebruiker 4 voortgangsmeldingen.
- **info** — `.../BuilderCanvas.tsx:229` — bij snel herladen binnen 2s na een stap blijft de mijlpaaltoast permanent zichtbaar (engine-breed, niet config-specifiek).

## Didactiek — score 7/10

De opbouw is sterk: 4 stappen bouwen logisch op (analyse → mechanisme → eigen ontwerp → verantwoordelijkheid), sluit aan bij leerjaar 2 en heeft een expliciete ethische stap (checklist-item "bron" vraagt naar bronvermelding van gebruikte afbeeldingen — goed didactisch signaal). SLO-koppeling (21B, 23B / vso 18B, 20B) is aanwezig en past bij mediawijsheid-achtige kerndoelen.

- **warning** — de vier checklistitems per stap zijn zelfrapportage ("ik heb...") zonder inhoudelijke toets, en de tekstcheck accepteert elke plausibele tekst ≥40 tekens (bevestigd in de engine-bevindingen). Bij meme-machine is dit relevant omdat de kernvaardigheid (herkennen van *waarom* een format werkt, onderscheid humor/kwetsend) juist inhoudelijk toetsbaar zou moeten zijn — een leerling kan de checklist afvinken en een generieke zin typen zonder een concreet meme-format te noemen.
- **info** — stap 4 ("verantwoord") vraagt naar bronvermelding via checklist-item `bron`, maar de instructietekst zelf noemt dat punt niet expliciet (instructie noemt alleen perspectief, inclusiviteit, richtlijn). Een leerling die strikt de instructie volgt kan het checklist-punt over bronnen missen omdat het niet in de instructietekst staat.
- **info** — `takeaways` en `missionGoals`-entry sluiten inhoudelijk goed aan bij de 4 stappen; geen mismatch gevonden.

## Tech — score 8/10

Geen missie-specifieke technische issues gevonden; de config volgt het standaardpatroon (steps, checklistItems, textPrompt, badges, takeaways) en integreert correct met templateRegistry, slo-kerndoelen-mapping, curriculum en missionGoals. De technische bevindingen zijn engine-breed:

- **blocking** (engine-breed) — `CompletionScreen.tsx:163` — dubbele-klik op afronden kan `onComplete` tweemaal afvuren; raakt ook meme-machine-leerlingen bij afronding.
- **warning** (engine-breed) — presence-based scoring (zie Didactiek hierboven — zelfde technische oorzaak).

## Voorstellen

Onderstaande voorstellen zijn engine-breed (niet binnen de auto-fix-whitelist voor deze missie) en worden hier alleen genoteerd zodat ze in het sweep-rapport landen als escalatie:

**1. Instructietekst stap 4 expliciet maken over bronvermelding**

Dit ligt WEL binnen de missie-config-whitelist. Voor/na:

```ts
// voor (src/features/missions/templates/builder-canvas/configs/meme-machine.ts, regel 73)
instruction:
    'Beantwoord de volgende vragen: 1) Kun je je eigen meme-ontwerp bekijken vanuit het perspectief van iemand die er misschien kwetsbaar voor is? Wat zou die persoon voelen?, 2) Hoe kun je humor maken zonder een specifieke groep mensen te targeten?, 3) Noem 1 richtlijn die jij zou gebruiken om te bepalen of content "oké" is om te posten.',
```

```ts
// na
instruction:
    'Beantwoord de volgende vragen: 1) Kun je je eigen meme-ontwerp bekijken vanuit het perspectief van iemand die er misschien kwetsbaar voor is? Wat zou die persoon voelen?, 2) Hoe kun je humor maken zonder een specifieke groep mensen te targeten?, 3) Gebruikte je in je meme-ontwerp een bestaande foto of afbeelding? Leg uit of dat mag. 4) Noem 1 richtlijn die jij zou gebruiken om te bepalen of content "oké" is om te posten.',
```

**2. Engine-fixes (niet in whitelist, alleen als aanbeveling):** pending-guard op de afrondknop, `aria-live` op MilestoneToast, `showMilestone` niet persisteren, contrastfix voor `/70`-tokens op invoertekst.

## Samenvatting en verdict

De meme-machine-missie zelf is didactisch sterk opgebouwd en technisch correct bedraad (templateRegistry, SLO, curriculum, missionGoals kloppen onderling). De belangrijkste risico's liggen in de gedeelde builder-canvas-engine (dubbele-klik-afronding, presence-based scoring, contrast, ontbrekende aria-live) en zijn al als engine-brede bevindingen vastgesteld — die worden niet opnieuw als missie-specifiek gerapporteerd. Eén klein, missie-eigen verbeterpunt (bronvermelding expliciet noemen in de instructietekst) is aangedragen als voorstel.

**Verdict: ok** — geen missie-specifieke blockers; engine-brede bevindingen escaleren naar het sweep-rapport.
