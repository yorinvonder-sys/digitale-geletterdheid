# J2P1 eindcontrole na tweede reparatieronde — 2026-08-07

Getoetst door de opdrachten daadwerkelijk te spelen in de browser (dev-preview, `/dev/mission-preview`),
met `localStorage` bewerkt om specifieke voortgangsscenario's te prepareren. Metingen (focus, contrast,
ARIA-aankondigingen) gebeurden met JavaScript, niet op het oog.

## DEEL 1 — nieuwe reparaties

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
