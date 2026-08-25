# Missiereview: mission-vision (De Visie)

**Datum:** 2026-08-25
**templateType:** builder-canvas
**Curriculumplek:** leerjaar 1, periode 4, week 4 (`src/config/curriculum.ts:132`)
**SLO:** `sloKerndoelen: ['22A', '21B']`, `sloVsoKerndoelen: ['19A', '18B']` (`src/config/slo-kerndoelen-mapping.ts:90`)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 7.5/10

De config levert alleen content (5 stappen, checklists, reflectievragen); de rendering loopt via de gedeelde builder-canvas-engine, die al apart is beoordeeld. Deze sectie behandelt alleen wat deze missie zelf concreet raakt.

**Bevindingen**
- ⚠️ (warning) Overgenomen van de engine-review, en van toepassing op elke stap van deze missie: de tekstinvoer en placeholder gebruiken beide `text-duck-ink/70`, waardoor getypte tekst en placeholder niet van elkaar te onderscheiden zijn (`src/features/missions/templates/builder-canvas/sub/StepInstructionPanel.tsx:157`). Bij deze missie is dat het meest merkbaar in stap `pitch-schrijven`, waar leerlingen een lange lopende tekst (250-300 woorden) typen.
- ⚠️ (warning) Vanaf stap 5 (`slides-bouwen`) toont de stap-iconenlijst van de engine een herhaald 💬-icoon (er zijn maar 4 iconen). Cosmetisch, geen blocking issue voor deze missie specifiek.
- ℹ️ (info) De vijf checklistlabels en instructieteksten zijn consistent qua toon en lengte met vergelijkbare builder-canvas-missies (bijv. `mission-project-plan`); geen structurele afwijking gevonden.

**Geen nieuwe design-bevindingen** buiten wat de engine-review al dekt — de config zelf voegt geen extra risico toe (geen afbeeldingen, geen custom layout, geen kleurdefinities).

---

## Didactiek — score 8/10

**Criterium 1-2: SLO-codes correct + fit**
- ✅ `22A` (Digitale producten) en `21B` (Media & Informatie) zijn geldige regulier-VO-codes; VSO-equivalenten `19A`/`18B` kloppen qua nummering.
- ✅ Fit is sterk: de missie laat leerlingen een visiestelling formuleren, een moodboard bouwen (media/sfeer), slides ontwerpen en een pitch schrijven — dat raakt 22A (product bouwen: presentatie) en 21B (visuele/mediale communicatie) substantieel, niet oppervlakkig.

**Criterium 3: Leerdoelen helder**
- ✅ `missionGoals.ts:340-347` geeft een expliciet `primaryGoal` + `criteria.min: 5` (steps-complete) + `evidence`-zin. Dat komt overeen met de 5 stappen in de config. Consistent.

**Criterium 4: Opdracht-beknoptheid / leeftijd-passendheid**
- ✅ Instructies zijn genummerd en concreet (bijv. stap `moodboard`: 5 genummerde deelacties). Voor leerjaar 1 (brugklas) redelijk dicht getimede opdrachten qua tekstvolume — instructieteksten van ~80-120 woorden per stap zijn aan de langere kant maar wel goed gestructureerd met nummering, wat de leesbaarheid compenseert.
- ⚠️ (warning) Stap `moodboard` vraagt leerlingen te werken in "Canva, Pinterest of PowerPoint" en te controleren of ze beelden "mogen gebruiken" (auteursrecht) — een goede didactische toevoeging, maar er is geen expliciete koppeling naar een eerdere missie waarin auteursrecht/bronvermelding is behandeld. Kleine gemiste kans, geen blocker.

**Criterium AI-as-copilot**
- Buiten scope van deze pass (aparte veiligheidspass); alleen genoteerd dat `enableChat: true` + `chatRoleId: 'mission-vision'` correct is ingesteld in `templateRegistry.ts:68`.

**Bevindingen**
- ✅ Reflectievragen (3 van de 5 stappen) koppelen expliciet terug naar eerdere missies ("Prompt Perfectionist", "Slide Specialist-regel") — sterke curriculaire samenhang, precies wat de `takeaways`-sectie ook claimt.
- ℹ️ (info) Stappen `pitch-schrijven` en `slides-bouwen` hebben geen `reflectionQuestion` (dus geen bonuspunten via die weg), terwijl de eerste drie stappen dat wel hebben. Dat is een bewuste keuze elders in de repo (niet elke stap hoeft een reflectievraag te hebben) — geen bevinding, alleen genoteerd voor consistentie-check.
- ⚠️ (warning) Zoals de engine-review al signaleert: scoring is presence-based (checklist + 40 tekens tekst). Voor déze missie betekent dat concreet dat een leerling die alle vinkjes aanvinkt en een plausibele zin typt zonder een écht moodboard te maken of een échte PowerPoint te bouwen, toch de volle stappunten van stappen `slides-bouwen` en `moodboard` kan halen — terwijl de checklist daar expliciet "opgeslagen in OneDrive" en "link geplakt" claimt. Er is geen technische verificatie dat de geplakte link ook een geldige OneDrive-link is.

---

## Tech — score 8.5/10

Statische analyse van de config (geen aparte engine-code in deze missie).

**Criterium A1-A7 (via de gedeelde engine, al beoordeeld):** de config voegt geen eigen handlers, edge-function-calls of custom state toe — alles loopt via `BuilderCanvas.tsx`. Geen nieuwe technische risico's specifiek voor deze missie.

**Bevindingen**
- ✅ `maxScore: 100` klopt met de optelsom van 5 stappen × 20 basispunten (impliciet via de engine se verdeling) + 3× bonuspunten van 5 (reflectievragen) — binnen de door de engine gegarandeerde cap.
- ✅ `badges`-drempels (0/25/50/70/90) zijn oplopend en dekken het hele bereik zonder gaten.
- ✅ Alle 5 `checklistItems`-id's binnen elke stap zijn uniek; geen dubbele keys die de engine in de war zouden kunnen brengen.
- ⚠️ (warning) Stap `moodboard` heeft `minTextLength: 30` maar de globale engine-default is 40 tekens (zie enginebevindingen). Dit is een bewuste config-keuze (een link plakken is per definitie korter dan een tekstuele reflectie), dus geen bug — maar het betekent dat de "meaningful answer"-check voor deze ene stap zwakker is dan elders: een leerling kan met een korte, weinig betekenisvolle 30-tekens string door de check komen als die toevallig `isMeaningfulAnswer` haalt.
- ℹ️ (info) `textPrompt`-velden zijn overal ingevuld (geen ontbrekende prompts), en `introFeatures` (4 items) is consistent met vergelijkbare missies qua lengte.

---

## Voorstellen

Geen mission-vision-specifieke config-fixes met hoge prioriteit gevonden — de belangrijkste risico's (dubbele completion-klik, presence-based scoring, contrast, milestone-toast) zitten in de gedeelde engine en zijn daar al gerapporteerd; een fix in `mission-vision.ts` zou het probleem niet oplossen.

Eén optionele, niet-blocking config-aanscherping (whitelist-scope, geen enginewijziging):

**Voor** (`src/features/missions/templates/builder-canvas/configs/mission-vision.ts:63`):
```ts
minTextLength: 30,
```

**Na:**
```ts
minTextLength: 30, // link-invoer: bewust lager dan engine-default (40) — geen wijziging nodig
```

Dit is puur een verduidelijkende comment-toevoeging zodat een toekomstige reviewer niet opnieuw over deze afwijking struikelt; geen gedragswijziging. Niet als autoFixable meegenomen omdat het geen functionele bug betreft.

---

## Samenvatting

Mission-vision is een inhoudelijk sterke, goed opgebouwde builder-canvas-missie met duidelijke SLO-fit, goede curriculaire terugkoppeling naar eerdere missies (Prompt Perfectionist, Slide Specialist) en consistente content-structuur. De belangrijkste kwaliteitsrisico's — dubbele-klik-afronding, presence-based scoring, contrast op tekstinvoer, milestone-toast die blijft hangen — zitten allemaal in de gedeelde engine en zijn daar al vastgelegd; deze missie-config zelf introduceert geen nieuwe blocking issues. Enige aandachtspunt is dat de checklist-items voor "opgeslagen in OneDrive"/"link geplakt" (stappen `moodboard` en `slides-bouwen`) geen technische verificatie hebben — zelfrapportage, net als de rest van de engine.

**Verdict: ok** (geen missie-specifieke blockers; engine-brede warnings gelden op sweep-niveau, niet als reden om deze missie apart te blokkeren).
