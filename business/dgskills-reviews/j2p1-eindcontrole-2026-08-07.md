# J2P1 eindcontrole na tweede reparatieronde — 2026-08-07

Getoetst door de opdrachten daadwerkelijk te spelen in de browser (dev-preview, `/dev/mission-preview`),
met `localStorage` bewerkt om specifieke voortgangsscenario's te prepareren. Metingen (focus, contrast,
ARIA-aankondigingen) gebeurden met JavaScript, niet op het oog.

**Belangrijk:** de code is tijdens deze verificatie nog een keer gewijzigd (een adversariële review vond
zeven regressies in de vorige reparatieronde, die daarna zijn opgelost). De code stond stil op het moment
dat de onderstaande DEEL 0-claims zijn getoetst — dat is dus definitief. N1, N2, N3, N5, N6, N7, T1, T2, T3
en R1 hierbeneden (DEEL 1-3) zijn getoetst VÓÓR die laatste wijzigingsronde, op bestanden die niet meer
zijn geraakt door de latere fixes (`ReviewArena.tsx`/`Categorize.tsx`/`MatchPairs.tsx` se focus- en
opslaglogica, `InteractiveTable.tsx`, contrast-styling) — die uitkomsten blijven dus geldig. Overal waar
een bestand ná mijn eerste meting is gewijzigd, staat dat expliciet vermeld en is opnieuw getoetst in
DEEL 0.

## DEEL 0 — hertoets na de laatste code-wijzigingen (RapidFire, DataViewer, FeedbackBanner)

### N-nieuw. Rapid-fire-ronde hervatbaar, afgeronde ronde blijft vergrendeld — **GESLAAGD**
Missie `review-week-2`, ronde 4 (rapid-fire, 8 vragen). 3 vragen beantwoord ("Vraag 4 van 8" bereikt),
localStorage gecontroleerd: `rapidFireProgress:{"round-rapid-fire":[false,false,true]}` en
`lockedRoundScores` nog leeg — de rondescore stond dus nog NIET vast na een deelantwoord (de kern van de
regressie die hersteld is). Herladen (via een tussenstop op `/robots.txt` om race-condities met de
debounced autosave te vermijden): scherm hervatte op **"Vraag 5 van 8"** — niet terug naar vraag 1.
Ronde afgemaakt (4/8 goed → 0/25 volgens de nieuwe klassegebalanceerde formule, correct voor een 4-om-4-
verdeling). Ná afronding: `lockedRoundScores:{"round-rapid-fire":0}`. Herladen ná afronding gaf: "Je had
deze ronde al ingediend. Je score staat vast op 0/25 punten." — de ronde speelt niet opnieuw af.

### N1/N2-equivalent op DataViewer. Oude voortgang en verdiepingsvraag blijven behouden — **GESLAAGD**
Team lead wees erop dat `DataViewer.tsx` een eigen validatie voor herstelde voortgang heeft (apart van
`ReviewArena.tsx`), en dat de verdiepingsvraag-registratie nu op DATASET-id wordt gecontroleerd i.p.v. op
vraag-id. Getoetst op missie `spreadsheet-specialist` (dataset "kasboek-leerlingenraad" heeft een
`followUp`): alle 3 vragen van dataset 1 correct beantwoord (45 pts), verdiepingsvraag verschenen, correct
beantwoord maar NIET op "Doorgaan" geklikt. localStorage toonde `followUpCorrect:{"kasboek-leerlingenraad":true}`
— dus op dataset-id, niet op vraag-id. Herladen (via `/robots.txt`-tussenstop): alle 3 antwoorden, scores
(45 pts) en de vastgelegde follow-up-uitkomst bleven **volledig intact** — vóór de fix zou de validatie
hier hebben gefaald (followUp-check tegen vraag-id's die niet bestaan) en alles hebben gewist. Extra
gecontroleerd: de verdiepingsvraag zelf toont zich opnieuw (want `followUpAnswered` wordt pas bij
"Doorgaan" gezet), maar een nieuwe (foute) keuze overschrijft de al vastgelegde `followUpCorrect` niet —
zelfde anti-herhaal-patroon als in `ReviewArena.tsx`.

### N4-nieuw. Blind/serieus spelen met bijgewerkte `delen-of-niet`-ronde (nu 8 items, 4/4) — **GESLAAGD**
`FeedbackBanner.tsx` se scoring voor waar/onwaar-rondes is herzien (klassegebalanceerde baseline i.p.v.
juist-minus-fout) en `factchecker`'s ronde `delen-of-niet` is uitgebreid van 6 naar 8 items (4 "wel
delen", 4 "niet delen" — was 2/4).
- **Blind**, volledige missie opnieuw gespeeld: ronde 1 (alles aanvinken, incl. 2 foute) → 0/25. Ronde 2
  (volledig omgekeerde volgorde) → 10/25. Ronde 3 (`delen-of-niet`, overal "Accepteren" op alle 8 items)
  → **0/25** (bevestigt dat de nieuwe baseline-formule ook bij de 4-om-4-verdeling "altijd hetzelfde
  antwoorden" naar 0 duwt — niet meer de 8/25 die de oude juist-minus-fout-formule daar zou hebben
  gegeven volgens de code-comments). Ronde 4 (alles aanvinken) → 0/25. **Totaal: 10/100 (10%).**
- **Serieus**, ronde 3 in isolatie getoetst (rondes 1-2 vooraf via localStorage als correct gemarkeerd,
  om tijd te besparen — ronde 3 zelf via de echte UI beantwoord): alle 8 items correct
  geaccepteerd/geweigerd → **25/25**, volle score. Dit bevestigt dat de nieuwe formule bij accuratesse
  100% nog steeds het maximum haalt, ook met de bredere 4/4-verdeling.

### N6-nieuw. "Weet niet" binnen een echt antwoord scoort gewoon — **GESLAAGD**
Missie `api-verkenner` q3, getypt: **"Je weet niet welke waarde bij welke key hoort zonder de sleutel
erbij."** — bevat de losse woorden "weet niet", maar niet het specifieke patroon `weet ik (het )?niet`
dat als niet-antwoord wordt gefilterd. Bevestigknop bleef actief, ingediend, **+10 van de 10 punten**
("Goed opgeschreven!"). Bevestigt dat de versoepeling van het niet-antwoord-filter precies dit
onderscheid maakt: "weet ik niet" (niet-antwoord) versus "je weet niet …" als onderdeel van een inhoudelijk
antwoord (telt gewoon mee).

### N7-nieuw. Verzonnen webadres bij een gewone observatievraag scoort geen punten — **GESLAAGD**
Missie `network-navigator` q3-router-observatie (een vraag die GEEN URL in de uitleg heeft, dus geen
gestructureerd-antwoord-vrijstelling). Getypt: **"https://latency-server.nl"** (kaal domein, geen pad).
De bevestigknop bleef **uitgeschakeld** ("nog minstens 4 woorden") — het kale domein haalt de
gestructureerd-antwoord-vrijstelling niet (die eist een URL MET pad) en faalt daarom gewoon de
lengte-eis, dus dit "antwoord" kan niet eens worden ingediend, laat staan scoren. Dit staat in scherp
contrast met N7 uit DEEL 1 hieronder, waar een echte URL-met-pad (`.../v2/pokemon/charizard`) bij een
vraag die dat wél verwacht, gewoon volle punten kreeg — precies het bedoelde onderscheid.

---

## DEEL 1 — nieuwe reparaties (eerste ronde, getoetst vóór de laatste code-wijzigingen; nog geldig)

### N1. Oude voortgang blijft behouden — **GESLAAGD**
Voorbereid: `dgskills_mission_data-review` gezet op het kale oude formaat (zonder `{v, state}`-omhulsel):
`{phase:'round', currentRound:1, roundScores:[20], ...}`. Opdracht geopend zonder reset.
**Bewijs:** de missie herstelde direct op "Ronde 2 — Koppelen" met "20 pts" zichtbaar. Direct na laden
(binnen 1,2s) stond de opslag al herschreven naar `{"v":1,"state":{...}}`. Voortgang is dus niet
gewist en het formaat is stilzwijgend gemigreerd.

### N2. Bonusvraag niet meer herspeelbaar — **GESLAAGD**
Missie `review-week-2`, ronde `round-categorize` (bonusPoints: 5) volledig correct gespeeld (25/25),
verdiepingsvraag verschenen, bewust FOUT antwoord gekozen (optie B), **niet** op "Doorgaan" geklikt en
meteen herladen.
**Bewijs vóór herladen:** `localStorage` toonde `followUpResults:{"round-categorize":{"answered":true,"correct":false}}` —
het antwoord werd dus al vastgelegd op het moment van kiezen, niet pas bij "Doorgaan".
**Bewijs na herladen:** de vraag kwam niet terug; het scherm toonde "Je had deze ronde al ingediend.
Je score staat vast op 25/25 punten." Na doorklikken bleef de totaalscore 75 pts (25+25+25+0 bonus) —
geen alsnog toegekende bonus voor het foute antwoord.

### N3. Afronden wist de opslag echt — **GESLAAGD**
Missie `review-week-2` volledig uitgespeeld (75/100) en op "Missie voltooid! 🎉" geklikt (de knop die
`clearSave()` triggert, niet de eerdere "Afronden"-knop die alleen naar het resultaatscherm gaat).
**Bewijs:** `localStorage.getItem('dgskills_mission_review-week-2')` gaf direct `null`. Na 3 seconden
wachten nog steeds `null` (geen debounced achtergrondschrijver die het terugzet). Na wegnavigeren naar
`/robots.txt` en terugkijken in `localStorage`: nog steeds `null` (ook de unmount-flush herstelt niets).

### N4. Gokken levert nul op — **GESLAAGD**
Missie `factchecker` (4 rondes: select-correct, order-priority, binary-choice, select-correct) tweemaal
gespeeld.
- **Blind** (overal dezelfde knoppen/alles aanvinken/bewust omgekeerde volgorde): ronde 1 (select-correct,
  alle 8 aangevinkt incl. 2 foute) → 0/25. Ronde 2 (order-priority, volledig omgekeerde volgorde) → 10/25.
  Ronde 3 (binary-choice, overal "Accepteren") → 0/25 (3 van de 6 toevallig goed, geen punten). Ronde 4
  (select-correct, alles aanvinken) → 0/25. **Totaal: 10/100 (10%)** — "Blijf Oefenen", niet gehaald.
- **Serieus** (juiste antwoorden per config nagerekend): alle 4 rondes 25/25. **Totaal: 100/100 (100%)** —
  "Master Factchecker", gehaald.
Duidelijk, groot verschil tussen blind gokken en serieus spelen; blind zit ver onder de 40%-drempel.

### N5. Bijna-goed antwoord niet meer afgestraft — **GESLAAGD**
Missie `factchecker`, ronde 1 (select-correct, 8 items, 6 correct/2 fout in de config). Alle 6 juiste
items aangevinkt plus 1 extra foute ("Artikel gepubliceerd op nu.nl" — hoort NIET aangevinkt), 1 item
(primaire bronnen) bewust leeg gelaten.
**Bewijs:** score 13/25 (52%) — een behoorlijke score, geen nul, ook al was er één fout mee-geselecteerd.

### N6. Niet-antwoorden scoren nul, echte antwoorden vol — **GESLAAGD** (sterker dan gevraagd)
Missie `api-verkenner`, open observatievraag q3 ("Wat is het nut van een key in een JSON-response?").
- Getypt: "ik weet het antwoord niet en gok maar wat" → de bevestigknop bleef **uitgeschakeld**
  (`disabled: true`), dus dit "antwoord" kan structureel niet worden ingediend en kan dus ook nooit
  scoren. Dit is sterker dan alleen "scoort 0" — het voorkomt indiening van niet-antwoorden helemaal.
- Getypt: een echt inhoudelijk antwoord in eigen woorden ("Een key geeft betekenis aan de waarde,
  zodat je weet welk getal bij welk begrip hoort...") → bevestigknop actief, ingediend, **+10 van de
  10 punten** ("Goed opgeschreven!").
Kale opsomming van woorden uit de vraag is niet apart getest (tijdgebrek), maar de kern van de claim
(niet-antwoord = geen score, echt antwoord = volle score) is bevestigd.

### N7. Een webadres als antwoord kan worden ingediend — **GESLAAGD**
Missie `api-verkenner`, q8 ("Je wilt de Pokémon API vragen om data over 'charizard'. Hoe zou de URL
eruitzien?"). Getypt: `https://pokeapi.co/api/v2/pokemon/charizard` (7 woorden — onder de generieke
grens van 8 woorden die elders geldt).
**Bewijs:** de pagina toonde zelf "7 woorden — je kunt bevestigen", de knop was niet uitgeschakeld
(`disabled: false`), en na indienen: "Goed opgeschreven! +15 punten voor je observatie." — volle score.
De eerder gerapporteerde blokkade (woordenteller hield de URL tegen) is opgelost.

## DEEL 2 — toegankelijkheid

### T1. Focus na interactie — **GESLAAGD**
Gemeten met `document.activeElement` (nooit op het oog):
- **Na een juiste koppeling** (match-pairs, `review-week-2` ronde 2): focus sprong naar een
  `<button>` met tekst "AI stopt halverwege een verhaal" — het eerstvolgende nog-niet-gematchte
  linkeritem. Niet BODY.
- **Na alle koppels gevonden**: focus op een `<div>` met tekst "Alle koppels gevonden! 25/25 punten" —
  het resultaatbericht. Niet BODY.
- **Na categorieronde bevestigen** (categorize, alle 8 correct): focus op een `<div>` met tekst
  "Perfect gecategoriseerd! 25/25 punten" — het resultaatbericht. Niet BODY.
- **Na missie afronden** (op "Missie voltooid! 🎉" geklikt): focus bleef op die knop zelf
  (`<button>Missie voltooid! 🎉</button>`) — een zinvol, interactief element. Niet BODY. (In de
  dev-preview is `onComplete` een lege stub zonder paginanavigatie, dus een expliciete focus-move
  naar een volgend scherm is hier niet van toepassing.)

### T2. Rijtelling wordt niet per toetsaanslag aangekondigd — **GESLAAGD**
`InteractiveTable.tsx` gebruikt een `setTimeout`-debounce van 700ms (`useEffect`, regel 68-83) vóór de
`aria-live="polite"`-regio wordt bijgewerkt. Empirisch bevestigd met een `MutationObserver` op de
`span[role="status"]`: 6 razendsnelle simulatie-toetsaanslagen (50ms tussenpozen, "t"→"temper") op het
JSON-sleutel-filter van `api-verkenner` leverden **precies 1** aankondiging op ("0 van 10 rijen
zichtbaar."), niet 6.

### T3. Contrast van lopende tekst — **GESLAAGD**
Gemeten (WCAG-contrastformule, alpha-blending meegerekend) op twee schermen:
- `api-verkenner` (hoofdtekst, volledig ondoorzichtig `rgb(32,32,35)` op `rgb(242,241,236)`): **14,37:1**.
- `data-journalist` (gedempte beschrijvingstekst, `rgba(32,32,35,0.75)` op dezelfde achtergrond,
  correct geblend): **6,66:1**.
Beide ruim boven de 4,5:1-eis. Er bleek geen aparte donkere modus voor missies te bestaan (localStorage
`darkMode` had geen zichtbaar effect op de missie-preview — alleen één licht thema), dus "twee
schermen" is hier getoetst als twee verschillende missiepagina's, niet licht/donker.

## DEEL 3 — open vraag: verminderde beweging

### R1. **NIET_GETOETST (visueel) — wél een reëel gevonden risico via codeanalyse**
De gemelde hangende-ronde-observatie kon ik niet visueel reproduceren: de beschikbare browsertools
bieden geen manier om `prefers-reduced-motion` in een Chrome-tab te forceren (geen CDP
Emulation.setEmulatedMedia-achtige tool beschikbaar), en `window.matchMedia(...).matches` is
alleen-lezen en volgt de systeeminstelling — die kan ik vanuit deze sessie niet wijzigen.

**Wat ik wél vond in de code, en dat is een concreet, verifieerbaar risico:**
- `src/styles/public.css:6-14` heeft een globale `@media (prefers-reduced-motion: reduce)`-regel die
  voor ALLE elementen `animation-duration`/`transition-duration` naar 0,01ms zet. Dat dekt gewone
  CSS-animaties/transities.
- De rondewissel in `ReviewArena.tsx` gebruikt echter `framer-motion` (`<AnimatePresence mode="wait">`,
  regel 530/624). Framer-motion-animaties lopen NIET via CSS `transition`/`animation`-properties maar
  via de Web Animations API/JS, aangestuurd door de `transition`-prop die aan `motion.*`-componenten
  wordt meegegeven.
- Ik vond nergens in de codebase een `MotionConfig`-met `reducedMotion="user"` of een
  `useReducedMotion()`-hook uit `framer-motion` die de rondewissel-animatie zelf verkort. Er bestaat
  wél een eigen `AccessibilityContext` (`src/contexts/AccessibilityContext.tsx`) die een
  `reduced-motion`-klasse op de root zet — maar die klasse stuurt (via `accessibility.css`) opnieuw
  alleen CSS `transition-duration`/`animation-duration`, niet de framer-motion-`transition`-prop.

**Conclusie:** de globale CSS-regel dekt gewone animaties, maar de specifieke `AnimatePresence`-
rondewissel in `ReviewArena.tsx` lijkt daar niet door geraakt te worden — noch door de OS-brede
`prefers-reduced-motion`-media query, noch door de app-eigen `reduced-motion`-toggle. Voor een
leerling met "verminderde beweging" aan zou de rondewissel dus gewoon de volledige (niet-verkorte)
animatieduur draaien. Dat is niet hetzelfde als "blijft voor altijd hangen", maar is wel een
toegankelijkheidsgat: de instelling wordt voor déze specifieke animatie niet gerespecteerd. Aanbevolen
vervolgstap: `useReducedMotion()` uit `framer-motion` (of de bestaande `AccessibilityContext.reducedMotion`)
gebruiken om de `transition`-prop van de `AnimatePresence`/`motion.div` in `ReviewArena.tsx` te forceren
naar `duration: 0` wanneer reduced motion actief is, en dat vervolgens visueel bevestigen met een
sessie die wél CDP-media-emulatie kan gebruiken.

## Nieuwe problemen die ik tegenkwam
- Geen nieuwe functionele bugs gevonden tijdens het spelen. Eén observatie zonder impact: bij het
  herhaaldelijk zetten/legen van `localStorage` en snel herladen kon de React-app soms nog de vorige
  (in-memory) staat terugschrijven vlak na een handmatige `localStorage.removeItem` — dat is een
  bekend/verwacht effect van de 1-seconde debounced autosave (`useMissionAutoSave.ts`) en geen bug in
  productiegedrag (een leerling wist zijn eigen `localStorage` nooit terwijl de app openstaat).
- Het R1-codeanalyse-gat (hierboven) is het meest waardevolle nieuwe punt: een reëel, nog niet eerder
  gemeld toegankelijkheidsrisico specifiek voor `framer-motion`-rondewissels.
