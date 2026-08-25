# Review: eindproject-j2

**Datum:** 2026-08-25 · **TemplateType:** data-viewer · **Leerjaar/periode:** J2 P4 (capstone)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 7,5/10

**Geslaagd**
- Kleurgebruik in de staafgrafiek (`chartData`) markeert bewust de hoogste (`#e1ff01`) en laagste (`#ff3c21`) waarde tegen een neutrale rest (`#202023`) — ondersteunt het leesdoel van vraag q4/q5 zonder extra uitleg nodig te hebben.
- Vier document-cards met consistente structuur (titel, icoon, quote + duiding) — voorspelbaar scanpatroon.
- Copy is kort en to-the-point per vraag/kaart.

**Aandachtspunten**
- ⚠️ **Visual Precision Gate — unverified.** Geen dynamische Chrome-plugin-evidence beschikbaar voor deze pass; alignment/overlap/text-fit van de 16-rijen tabel op mobiel (breed met 6 kolommen: Leerling, Projecttype, 3× cijfer, Eindcijfer) is niet visueel geverifieerd. Een tabel met 6 kolommen inclusief tekstuele `project_type`-waarden ("Spel (Scratch)", "Video/animatie") is een reëel overflow-risico op smalle viewports.
- ⚠️ (overgenomen van engine-bevinding, missie-relevant) `eindproject-tips`-cards en de tabel gebruiken dezelfde `InteractiveTable`-filtervelden met placeholder/ingevulde tekst in identieke kleur (`text-duck-ink/75`) — dit raakt deze missie rechtstreeks omdat dataset 1 de enige tabel-dataset is met sorteerbare/filterbare kolommen.
- Info: badge-kleuren voor 65 en 40 punten zijn beide `#202023` (identiek aan de niet-gehaalde 0-drempel-badge) — enige onderscheid tussen "Op de goede weg" en "Aan de slag!" is emoji/tekst, geen kleur. Licht gemiste kans voor visuele progressie, niet blocking.

## Didactiek — score 8/10

**Geslaagd**
- SLO-koppeling breed maar verdedigbaar voor een capstone: 9 kerndoelen (21A-D, 22A-B, 23A-C) is boven de "max 3" vuistregel uit de rubric, maar de mapping-comment `// capstone: alle kerndoelen` maakt dit expliciet en is voor een eindproject-terugblik inhoudelijk te onderbouwen — geen misalignment, wel een bewuste uitzondering die zo gedocumenteerd hoort te blijven.
- `primaryGoal`/`evidence` in `missionGoals.ts` zijn concreet en meetbaar geformuleerd ("kunt het verschil... uitleggen", "kunt het best-scorende projecttype noemen") — voldoet aan het action-verb-criterium.
- Cognitieve load past bij leerjaar 2: introDescription ~55 woorden (<80 grens), vraag-formuleringen kort, 3 vragen per dataset.
- Bloom-balans: q1-q2 zijn analyseren (patroon herkennen, cijfers combineren), q3/q6/q8 zijn evalueren/creëren (eigen observatie, eigen keuze onderbouwen, eigen projectidee formuleren) — goede spreiding voor een afsluitende missie.
- Sluit qua thema (reflectie op eigen leerproces/toekomst) logisch aan bij periode 4 "Ethiek, Maatschappij & Eindproject", ook al is de insteek data-analyse in plaats van ethiek.

**Aandachtspunten**
- ⚠️ q3 en q6 zijn `text-observation` met `minKeywords: 1` en een losse keywordlijst (`['voorspeller','samenhang','verband','hoger','stijgt']` resp. `['veilig','onbekend','risico','origineel']`) — bij `minKeywords:1` volstaat elk los woord uit die lijst, ook los van een samenhangend antwoord. Voor q6 in het bijzonder: het woord "risico" op zichzelf (bv. "ik wil geen risico") telt al mee, ook als het antwoord het tegenovergestelde betoogt van wat de explanation als "sterk antwoord" schetst. Verhoog `minKeywords` naar 2 voor een iets robuustere score, of aanvaard dit bewust als "elke poging tot reflectie telt" (past bij het punten-0-ontwerp van q8).
- Info: q8 heeft `points: 0` — een bewust ontworpen open reflectievraag zonder score-impact. Legitiem voor een afsluitende "wat ga jij doen"-vraag, maar niet expliciet toegelicht in de config zelf (alleen af te leiden uit de waarde). Een korte comment zou de intentie verduidelijken voor toekomstig onderhoud.

## Tech — score 7/10 (na aftrek gedeelde engine-bevindingen)

De gedeelde `data-viewer`-engine is al apart beoordeeld (zie `engine-data-viewer.json`); deze sectie beperkt zich tot wat voor **deze missie concreet** relevant is.

**Geslaagd**
- Config bevat geen `any`, geen client-side `systemInstruction`, geen `dangerouslySetInnerHTML` — voldoet aan A3/A7 voor zover in scope van de config.
- Puntentelling is intern consistent: som van alle `points` (15+15+10+10+10+10+15+0 = 85) komt exact overeen met `maxScore: 85`. Dit voorkomt de "cijfer klopt niet met percentage"-klasse fouten op config-niveau.
- `correctAnswer: 1.1` bij q4 (number-input) is correct herleid uit `chartData` (7,9 − 6,8 = 1,1) — narekenbaar en klopt.

**Directe impact van de engine-bevindingen op déze missie**
- 🔴 **Blocking (geërfd):** een leerling die onder de 40%-drempel scoort (bv. bij zwakke antwoorden op q1/q2/q7 — samen 45 van de 85 punten, dus een score net onder de grens is realistisch) loopt vast op het resultatenscherm zonder herkansing of terugweg (`DataViewer.tsx:984`, geen `onRetry`). Voor déze missie als capstone is dat extra zwaarwegend: het is de laatste missie van het jaar, dus een vastgelopen leerling heeft geen vervolgmissie om alsnog voortgang te boeken.
- 🔴 **Blocking (geërfd):** `clearSave()` vóór bevestigde serveropslag (`DataViewer.tsx:950`) — bij een mislukte opslag verliest de leerling het werk aan alle 3 datasets (16-rijen tabel doorgronden, grafiek interpreteren, 4 tip-kaarten lezen) zonder foutmelding.
- ⚠️ (geërfd) 40%-drempel-inconsistentie tussen engine (`totalScore/maxScore >= 0.4`) en `CompletionScreen` (afgerond percentage `>= 40`) raakt deze missie: bij 85 punten totaal is 34/85 = 40,0% exact op de grens — een editorial risk-scenario waarbij afronding het verschil maakt tussen "geslaagd" en "niet geslaagd" is voor déze missie reëel (34 punten is precies haalbaar via bv. q1+q2+q4 = 40).

Deze drie punten zijn engine-bugs, geen missie-config-fouten — niet autofixbaar binnen de whitelist van dit rapport.

---

## Voorstellen

Alleen mechanische, config-schaal fixes (geen engine-wijzigingen — die vallen buiten de whitelist van deze review):

### 1. Robuustere keyword-check voor q6 (didactiek)

**Voor** (`src/features/missions/templates/data-viewer/configs/eindproject-j2.ts`):
```ts
{
    id: 'q6-eigen-keuze',
    ...
    keywords: ['veilig', 'onbekend', 'risico', 'origineel'],
    minKeywords: 1,
    ...
},
```

**Na:**
```ts
{
    id: 'q6-eigen-keuze',
    ...
    keywords: ['veilig', 'onbekend', 'risico', 'origineel'],
    minKeywords: 2,
    ...
},
```

### 2. Documenteer de bewuste 0-punten-vraag (didactiek — leesbaarheid)

**Voor:**
```ts
{
    id: 'q8-eigen-plan',
    question:
        'Beschrijf in 3 zinnen jouw idee voor een eindproject. Gebruik tip 1: begin met een probleem dat jij ervaart.',
    type: 'text-observation',
    keywords: ['probleem', 'wil', 'maken'],
    minKeywords: 1,
    correctAnswer: '',
    explanation: '...',
    points: 0,
},
```

**Na:**
```ts
{
    id: 'q8-eigen-plan',
    question:
        'Beschrijf in 3 zinnen jouw idee voor een eindproject. Gebruik tip 1: begin met een probleem dat jij ervaart.',
    type: 'text-observation',
    keywords: ['probleem', 'wil', 'maken'],
    minKeywords: 1,
    correctAnswer: '',
    explanation: '...',
    // Bewust 0 punten: open afsluitende reflectievraag, geen goed/fout-antwoord.
    points: 0,
},
```

---

## Samenvatting

Deze capstone-missie is inhoudelijk sterk: consistente puntentelling, narekenbare antwoorden, een goede Bloom-spreiding en een breed maar expliciet gedocumenteerd SLO-bereik dat past bij een eindproject-terugblik. De twee zwaarste problemen — geen herkansing onder de 40%-drempel en het wissen van opslag vóór bevestigde serveropslag — zitten in de gedeelde `data-viewer`-engine, niet in deze config, en zijn dus niet via deze missie-review op te lossen. Omdat dit de laatste missie van leerjaar 2 is, is de impact van die engine-bugs op déze plek wel het grootst: een leerling die hier vastloopt heeft geen vervolgmissie om alsnog voortgang te boeken. Design is niet dynamisch geverifieerd (geen Chrome-plugin-evidence in deze pass) — de 6-koloms tabel op mobiel is een aandachtspunt voor een aparte live-check.

**Verdict: fix-eerst** — de config zelf is ship-ready; de blocking issues zitten in de gedeelde engine en moeten daar (niet per-missie) worden opgelost voordat leerlingen dit eindproject-onderdeel zonder risico kunnen afronden.
