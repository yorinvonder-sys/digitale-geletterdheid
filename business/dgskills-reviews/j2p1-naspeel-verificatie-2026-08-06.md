# J2-P1 dynamische naspeel-verificatie — 2026-08-06

Uitgevoerd tegen een lokale dev-server (`npm run dev`, poort 3000) vanuit de worktree
`j2p1-team-review`, via `/dev/mission-preview`. Elke claim is ofwel echt nagespeeld in de
browser (met JavaScript-gemeten bewijs waar relevant), ofwel expliciet als niet-getoetst
gemarkeerd met reden. Broncode is gebruikt om de bevindingen te verklaren en om te bepalen
welke browsertest de faalconditie daadwerkelijk raakt — nooit als vervanging van de browsertest zelf.

---

## A. data-viewer-engine (`data-journalist`)

### A1 — Open observatievraag: volle punten bij tien willekeurige tekens?
**Oordeel: BEVESTIGD**

Bewijs: in `src/features/missions/templates/data-viewer/DataViewer.tsx:79`:
```js
if (q.type === 'text-observation') return q.points; // always participation points
```
Live getest: bij de vraag "Wat valt je op als je kijkt naar het gevoel na gebruik en het
aantal uren per dag?" (10 pt) het antwoord `"aaaaaaaaaa"` ingevuld en bevestigd. Resultaat:
"Goed opgeschreven! Observatie ontvangen." — geaccepteerd zonder inhoudelijke toets, exact
zoals de code voorschrijft. Dit geldt voor élke `text-observation`-vraag in dit
missie-type, ongeacht het antwoord.

### A2 — Zelfinschatting ("Heel zeker" vs "Niet zeker") score-neutraal?
**Oordeel: BEVESTIGD**

Bewijs (code): `scoreQuestion()` (`DataViewer.tsx:78-95`) berekent
`Math.min(q.points, Math.round(base * confidenceMultiplier(...)))`. Bij een juist antwoord
is `base = q.points`, dus de `Math.min`-cap zorgt dat de multiplier (1.0–1.2×) nooit boven
de volle punten uitkomt. Bij een fout antwoord is `base = 0`, dus `0 × multiplier = 0`
ongeacht de multiplier. De confidence-widget heeft in de huidige implementatie dus
functioneel géén enkel effect op de score — noch omhoog, noch omlaag.

Live getest: multiple-choice-vraag "Welk platform wordt door de meeste leerlingen
gebruikt?" (15 pt) juist beantwoord (TikTok) met confidence **"Gok"** (laagste
zekerheid) → resultaat "Goed! +15 punten" (volle score). Numerieke vraag (20 pt) fout
beantwoord (2.8 i.p.v. 2.5) met confidence **"Heel zeker"** (hoogste zekerheid, zou een
extra straf moeten geven) → resultaat "Niet helemaal — het juiste antwoord: 2.5" zonder
enige zichtbare extra malus (kan ook niet, want score was al 0). Beide uitersten bevestigen:
de zelfinschatting is decoratief.

### A3 — Waarden in staafgrafiek af te lezen zonder muis-hover (toetsenbord/tap)?
**Oordeel: BEVESTIGD** (claim "nee, alleen via hover")

Bewijs (code): `src/features/missions/templates/data-viewer/sub/SimpleChart.tsx` — de
`BarChart`-balken (regel 40-53) hebben uitsluitend `onMouseEnter`/`onMouseLeave`. Geen
`onFocus`, geen `tabIndex`, geen `onClick`, geen touch-handlers.

Live geverifieerd: `read_page` met `filter: "interactive"` op het schermscherm met de
staafgrafiek toont géén enkele bar als interactief element (alleen "Terug"-knop, radio en
AI-chat-knop). Toetsenbord-Tab kan de balken dus niet bereiken — geconstateerd zowel via de
accessibility-tree als via de code (geen `tabIndex`).
Tap: kon niet fysiek op een echt touchscreen getest worden (deze omgeving simuleert alleen
muis-events); de tool-`left_click` triggerde wél de tooltip, maar dat komt doordat de tool
een echte cursor-hover simuleert vóór de klik — geen bewijs voor tap-gedrag. Omdat de code
geen `onClick`/touch-handler op de balken heeft, is de kans zeer klein dat een tap op een
echt touchscreen de tooltip toont (mobiele browsers synthetiseren normaliter geen hover op
een kale `<div>` zonder klik-handler). Dit onderdeel (tap) is dus **NIET_GETOETST op een
fysiek device** maar wordt sterk ondersteund door de code.

### A4 — Tabelkoppen sorteerbaar met het toetsenbord?
**Oordeel: BEVESTIGD** (claim "nee")

Bewijs (code): `src/features/missions/templates/data-viewer/sub/InteractiveTable.tsx:82-91`
— de sorteerbare kolomkop is een `<th onClick={...}>` zonder `tabIndex`, zonder
`onKeyDown`, zonder `role="button"`.
Live geverifieerd: `read_page` met `filter: "interactive"` op het tabelscherm toont alleen
de vijf filter-tekstvelden en de AI-chat-knop als interactieve elementen — de kolomkoppen
(NAAM, PLATFORM, UREN/DAG, LEEFTIJD, GEVOEL NA GEBRUIK) staan er niet tussen. Een
toetsenbordgebruiker kan er dus niet naartoe Tabben, laat staan ze activeren.

---

## B. scenario-engine (`factchecker`)

### B1 — Slaagdrempel haalbaar door in élke binary-choice-ronde dezelfde knop te kiezen en bij select-correct alles aan te vinken, zonder te lezen?
**Oordeel: BEVESTIGD**

Live volledig nagespeeld met de missie `factchecker` (4 rondes, drempel = 40% van
100 punten, zie `onComplete(totalScore >= config.maxScore * 0.4)` in `ScenarioEngine.tsx:204`):

| Ronde | Type | Strategie | Score |
|---|---|---|---|
| 1. Herken de rode vlaggen | select-correct | alles aanvinken | 17/25 |
| 2. Meest betrouwbare bron eerst | order-priority | klikken in getoonde (gehusselde) volgorde, niet lezen | 5/25 |
| 3. Delen of niet? | binary-choice | altijd "Accepteren" | 8/25 |
| 4. De CRAAP-methode toepassen | select-correct | alles aanvinken | 13/25 |

**Totaal: 43/100 punten (43%)** — boven de 40%-drempel. Eindscherm toont expliciet
"FACTCHECKER · AFGEROND", label "Goed Begonnen", en de knop "Missie voltooid! 🎉" wordt
getoond. De missie is dus daadwerkelijk haalbaar met deze mechanische strategie, al is de
marge klein (3 procentpunt boven de drempel) — bij een net iets ongunstiger husselresultaat
in ronde 2 zou dezelfde blinde strategie onder de 40% kunnen eindigen. De select-correct- en
binary-choice-onderdelen van de strategie geven op zichzelf al consistent 17, 8 en 13 punten
(38 van de 100 nodig); alleen de order-priority-ronde is variabel doordat de husselvolgorde
random is bij élke sessie (zie B3-code-analyse) — het slagen hangt dus deels af van geluk in
die ene ronde, maar de kern-claim ("haalbaar zonder werk") is bevestigd.

### B2 — Bronnen in de rangschikronde al in de juiste volgorde getoond?
**Oordeel: WEERLEGD** (de bronnen staan NIET al in de juiste volgorde)

Bewijs (code): `src/features/missions/templates/scenario-engine/sub/OrderPriorityRound.tsx:34-45`
bevat een expliciete, seeded Fisher-Yates-shuffle (`shuffleForRound`) mét een
eind-controle die een toevallige onveranderde volgorde alsnog omdraait — met commentaar dat
dit specifiek is toegevoegd om te voorkomen dat de config-volgorde (die toevallig gelijk
loopt aan de score-volgorde) het antwoord zou verklappen.

Live geverifieerd: config-volgorde in `factchecker.ts` is Peer-reviewed(pos0) →
RIVM(pos1) → NOS/NRC(pos2) → Blog van een arts(pos3) → TikTok(pos4). Werkelijk getoonde
volgorde in de browser: **Blog van een arts, TikTok-video, Artikel van NOS of NRC,
Peer-reviewed wetenschappelijk artikel, Bericht van het RIVM** — een duidelijk andere,
gehusselde volgorde. Blind top-naar-onder klikken in deze volgorde leverde in de praktijk
maar 1 van de 5 posities correct op (5/25 punten) — het tegendeel van "alles al in de juiste
volgorde".

### B3 — Krijgt elke leerling dezelfde husselvolgorde?
**Oordeel: BEVESTIGD**

Bewijs (code): de shuffle-seed is `round.id` (`shuffleForRound(round.items, round.id)`,
`OrderPriorityRound.tsx:64`) — een vaste string uit de missieconfig, niet gekoppeld aan
user-id, sessie-tijd of enige andere variabele bron.

Live dubbel geverifieerd: in twee onafhankelijke, volledig verse sessies (localStorage
tussendoor gewist + harde page-reload) werd exact dezelfde volgorde getoond: **Blog van een
arts, TikTok-video van een ervaringsdeskundige, Artikel van NOS of NRC, Peer-reviewed
wetenschappelijk artikel, Bericht van het RIVM of rijksoverheid.nl**. Elke leerling die deze
missie start krijgt dus identiek dezelfde (gehusselde) volgorde te zien — het antwoord is
dus in theorie deelbaar tussen leerlingen (al is de husselvolgorde zelf geen aanwijzing voor
de juiste volgorde, zie B2).

---

## C. review-arena (`data-review`)

### C1 — Herlaad-exploit: ronde fout spelen, correctie bekijken, herladen zonder "Volgende ronde", opnieuw met volle score?
**Oordeel: BEVESTIGD — zwaarste bevinding van deze verificatieronde**

Bewijs (code): in `src/features/missions/templates/review-arena/ReviewArena.tsx` wordt de
score van een ronde pas in de persistente state (`roundScores`, opgeslagen via
`useMissionAutoSave`) geschreven op het moment dat `advanceRound()` wordt aangeroepen — en
dat gebeurt alleen als de leerling op de "Volgende ronde"-knop **binnen** het rondecomponent
klikt (`handleContinue` in bv. `DragSort.tsx:140-142`). Het "ingevulde antwoord / submitted /
score"-tussenresultaat leeft uitsluitend in lokale `useState` van het rondecomponent zelf en
wordt nergens naar localStorage geschreven. Bij een page-reload vóór die klik is er dus
niets om te herstellen: `currentRound` en `roundScores` in de opgeslagen missie-state staan
nog op de waarde van vóór de poging.

Live volledig empirisch bewezen, stap voor stap:
1. Missie `data-review` gestart, ronde 1 ("Vertrouwbaarheid van databronnen",
   drag-sort) met de standaard (gehusselde) volgorde ingediend zonder te sorteren →
   **4/25 punten**, correctiescherm getoond met de juiste volgorde zichtbaar in de feedback.
2. Vóór het klikken op "Volgende ronde" is `localStorage` gecontroleerd:
   `{"phase":"round","currentRound":0,"roundScores":[],...}` — de mislukte poging staat
   nergens vastgelegd.
3. Pagina hard herladen (zonder `Volgende ronde` te klikken, zonder `reset`-param).
4. Resultaat: ronde 1 verschijnt volledig **vers en ongesubmit** — nieuwe (andere) random
   volgorde, geen enkel spoor van de vorige poging, score nog steeds "0 pts" bovenaan.
5. Met de kennis uit de correctie (juiste volgorde: CBS → Peer-reviewed → Landelijk
   dagblad → Wikipedia → Instagram → TikTok) de kaarten via de pijltjesknoppen in de juiste
   volgorde gezet en ingediend.
6. Resultaat: **"Perfect! Alle 6 items in de juiste volgorde. 25/25 punten."**

Een leerling kan dus onbeperkt gratis herkansen door simpelweg te verversen vóórdat hij op
"Volgende ronde" klikt, en profiteert daarbij direct van de zojuist geziene correcte
antwoorden. Dit werkt principieel voor elk van de vier rondetypes in review-arena
(drag-sort, match-pairs, categorize, rapid-fire), omdat ze allemaal hetzelfde patroon volgen
(lokale `submitted`/`score`-state, alleen bij "Volgende ronde"/"Doorgaan" doorgegeven aan de
persistente ouder-state).

### C2 — Sluit de missie af als "voltooid" ook bij een zeer lage score?
**Oordeel: BEVESTIGD, onvoorwaardelijk**

Bewijs (code): `handleComplete` in `ReviewArena.tsx:212-215`:
```js
const handleComplete = useCallback(() => {
    clearSave();
    onComplete(true);
}, [clearSave, onComplete]);
```
Er zit geen scoregate op — `onComplete(true)` wordt altijd aangeroepen zodra de leerling op
de completion-screen op de afrondingsknop klikt, ongeacht `totalScore`. (Dit is een verschil
met scenario-engine, waar wél een 40%-drempel geldt — zie B1.)

Live geverifieerd: dezelfde sessie doorgezet met bewust overwegend foute antwoorden in ronde
3 (categorize, 9/25 — alles in de verkeerde categorie geplaatst) en ronde 4 (rapid-fire,
6/25 — 6 van de 8 vragen bewust fout). Eindscore **65/100 (65%)** — ruim onder een
100%-prestatie, maar het eindscherm toont gewoon "Op de goede weg" met de knop
**"Missie voltooid! 🎉"**. Zelfs een veel lagere score (theoretisch tot 0%, gezien C1 zelfs
zonder enige kennis haalbaar) zou dit scherm tonen, want de code checkt de score niet.

### C3 — Is bij een categorisatieronde met drie categorieën het derde label (acid geel #e1ff01) leesbaar?
**Oordeel: NIET_GETOETST — premisse klopt niet voor deze missie**

Reden: in `src/features/missions/templates/review-arena/sub/Categorize.tsx:30-34` bestaat
inderdaad een kleurenpalet `CATEGORY_COLORS` waarvan het derde element `{ bg: '#e1ff01', ... }`
is (acid-geel), gebruikt als zowel tekstkleur van het categorielabel (`color: color.bg`,
regel 141) als accentkleur van de dropzone-rand. Echter: de categorize-ronde in de
`data-review`-config (`round-categorize`, "Persoonsgegeven of niet?") definieert slechts
**twee** categorieën (`categories: ['Persoonsgegeven', 'Geen persoonsgegeven']`), en de
layout schakelt zelfs expliciet naar `grid-cols-2` bij precies 2 categorieën (regel 116).
Live bevestigd: het categorisatiescherm toont exact twee kolommen, "PERSOONSGEGEVEN" (rood
`#ff3c21`) en "GEEN PERSOONSGEGEVEN" (zwart `#202023`) — géén derde, gele categorie.

Grep over alle review-arena-configs (`data-review.ts`, `security-review.ts`, en de overige
vijf) bevestigt: er bestaat momenteel in de hele codebase geen enkele categorize-ronde met
drie categorieën. De acid-gele derde kleur in `CATEGORY_COLORS` is dus op dit moment dode
code — nooit gerenderd in productie.

**Onverwachte vondst / latent risico**: mocht er ooit een categorize-ronde met 3 categorieën
worden toegevoegd, dan is het tekstlabel-op-achtergrond-patroon riskant: de tekstkleur is
letterlijk `color.bg` (`#e1ff01`, acid-geel) op een achtergrond die óf het lichte
kaart-wit is (niet-actief) óf een ~9% dekkende tint van diezelfde kleur (`${color.bg}18`,
actief/klikbaar) — d.w.z. felgeel-op-bijna-wit. Puur op basis van de kleurwaarden (zonder
live rendering, want het scenario bestaat niet) is een contrastprobleem zeer waarschijnlijk,
vergelijkbaar met de D1-bevinding hieronder voor `text-duck-ink/60`, maar dan potentieel nog
slechter omdat acid-geel een zeer hoge luminantie heeft. Dit zou bij toekomstig gebruik apart
gemeten moeten worden.

---

## D. Contrast breed

### D1 — Werkelijk contrast van `text-duck-ink/60` tegen zijn achtergrond
**Oordeel: BEVESTIGD in de kern (onder de AA-eis van 4,5:1), maar het exacte cijfer "circa 3:1" klopt niet — gemeten waarden liggen hoger**

Gemeten met JavaScript (`getComputedStyle` + WCAG relatieve-luminantieberekening, inclusief
alpha-compositing over de effectieve achtergrondkleur) op **drie verschillende schermen**:

| Scherm / achtergrond | Berekende kleur | Effectieve achtergrond | Contrastratio |
|---|---|---|---|
| Witte kaart (bv. `factchecker`-rondekaart, `data-review`-drag-sort-kaart) | `rgba(32,32,35,0.6)` | `rgb(255,255,255)` | **4.33 : 1** |
| Duck-bg crème buiten de kaart (`data-journalist`-introscherm, beschrijvingstekst) | `rgba(32,32,35,0.6)` | `rgb(242,241,236)` | **4.15 : 1** |
| Duck-bg crème, `text-duck-ink/55`-variant (bv. het "leerjaar/vak"-label op het introscherm) | `rgba(32,32,35,0.55)` | `rgb(242,241,236)` | **3.58 : 1** |

Alle drie gemeten waarden liggen **onder** de WCAG AA-eis van 4,5:1 voor normale
lopende tekst — de kern van de claim (ontoereikend contrast) is dus bevestigd. De exacte
waarde "circa 3:1" uit de oorspronkelijke claim komt echter alleen in de buurt bij de
`/55`-variant op een crème achtergrond (3.58:1); de meest voorkomende `/60`-variant op een
witte kaart meet met 4.33:1 duidelijk hoger dan "circa 3". Wie deze bevinding overneemt,
moet dus preciezer zijn: het probleem is reëel en consistent (structureel onder de
4,5:1-drempel op elk geteste oppervlak), maar de ernst varieert per achtergrond/opacity-
combinatie tussen ~3.6:1 en ~4.3:1, niet vlak bij 3:1.

---

## Samenvatting

| Claim | Oordeel |
|---|---|
| A1 | BEVESTIGD |
| A2 | BEVESTIGD |
| A3 | BEVESTIGD (toetsenbord hard bewezen; tap niet op fysiek device getoetst, code ondersteunt sterk) |
| A4 | BEVESTIGD |
| B1 | BEVESTIGD (43/100, net boven de 40%-drempel) |
| B2 | WEERLEGD (bronnen staan NIET al in de juiste volgorde — echt gehusseld) |
| B3 | BEVESTIGD (identieke husselvolgorde in twee onafhankelijke verse sessies) |
| C1 | BEVESTIGD (reload-exploit werkt: 4/25 → herladen → 25/25, zonder enige penalisatie) |
| C2 | BEVESTIGD, onvoorwaardelijk (geen scoregate in `handleComplete`) |
| C3 | NIET_GETOETST (deze missie heeft maar 2 categorieën; het gele 3e-categorie-label bestaat wel in de component-code maar wordt nergens gebruikt — dode code met een potentieel toekomstig contrastrisico) |
| D1 | BEVESTIGD in de kern (alle 3 metingen < 4,5:1), maar "circa 3:1" is te laag ingeschat — gemeten 3.58–4.33:1 |
