# Teamreview Leerjaar 2, Periode 1 — "Data & Informatie"

**Datum:** 2026-08-06
**Pipeline:** `dgskills-batch-review` (M4), volledige verse review
**Omvang:** 7 opdrachten, 3 gedeelde motoren, 10 review-agents, 4 tegenleesrondes
**Basis:** `origin/main` @ `e01c759a` · branch `claude/j2p1-team-review`

---

## Oordeel per opdracht

| Opdracht | Ontwerp | Didactiek | Techniek | Triage | Oordeel |
|---|---|---|---|---|---|
| `data-review` (herhaalopdracht) | 7 | **1** | 7 | **5,4** | **herontwerp** |
| `data-journalist` | 7 | 4 | 8 | 3,9 | fix-eerst |
| `ai-bias-detective` | 6 | 5 | 8 | 3,8 | fix-eerst |
| `dashboard-designer` | 6 | 7 | 7 | 3,3 | fix-eerst |
| `factchecker` | 5 → 8 | 7 | 8 | 3,3 → 1,7 | fix-eerst → ship\* |
| `api-verkenner` | 8 | 8 | 6 | 2,6 | fix-eerst |
| `spreadsheet-specialist` | 9 | 7 | 9 | 1,8 | ship (met open SLO-vraag) |

\* De blokker van `factchecker` (ronde 2 zou de bronnen al in de juiste volgorde tonen)
is bij de tegenlezing **weerlegd**. Zie §3.

**Geen enkele opdracht is ongewijzigd geschikt voor leerlingen zolang de motorlaag niet is
gerepareerd** — die weegt zwaarder dan alle opdrachtspecifieke bevindingen samen.

---

## 1. De kern: alle drie de motoren geven punten weg

Zeven opdrachten draaien op drie gedeelde motoren. Alle drie laten punten weglekken zonder
inhoudelijk werk. Dat is één reparatie op drie plekken, geen zeven losse reparaties.
Volledige analyse: `j2p1-engines-2026-08-06.md`.

### 1.1 `data-viewer` (4 opdrachten) — open vragen zijn gratis punten

`DataViewer.tsx:79` geeft bij een open observatievraag onvoorwaardelijk het volle aantal
punten terug, vóórdat het antwoord is bekeken. De enige drempel is een lengtecheck van tien
tekens (`:151-153`). Tien willekeurige letters scoren dus identiek aan een doordacht antwoord,
en de leerling krijgt er "Goed opgeschreven!" met een groen vinkje bij.

Wat dat per opdracht betekent:

| Opdracht | Ongekeurde punten |
|---|---|
| `dashboard-designer` | 30 van 100 |
| `data-journalist` | 25 van 100 |
| `spreadsheet-specialist` | 25 van 100 |
| `api-verkenner` | 35 van 100 |

Tegenlezing bevestigde dit (A1), met één correctie: naast de lengtecheck zit er wél een
welzijnsblokkade in de invoer (`DataViewer.tsx:562-570`) — maar geen enkele inhoudelijke
beoordeling. De claim "de enige drempel is de lengte" is dus net te sterk; de conclusie niet.

Daarnaast is de verplichte zelfinschatting ("hoe zeker ben je?") volledig zinloos:
`Math.min(q.points, ...)` op `:95` kapt elke bonus af, en bij een fout antwoord is de basis 0
zodat de straf niets doet (bevestigd, A2). De leerling moet klikken, het verandert niets.

### 1.2 `scenario-engine` (2 opdrachten) — de slaaggrens ligt onder het gokniveau

De slaagdrempel staat op 40% van de maximumscore (`ScenarioEngine.tsx:202-205`).

**Nagespeeld en bewezen.** De opdracht `factchecker` is volledig uitgespeeld met een blinde
strategie: overal dezelfde knop, overal alles aanvinken, en in de rangschikronde van boven naar
beneden klikken zonder te lezen.

| Ronde | Blinde score |
|---|---|
| 1. Herken de rode vlaggen | 17 / 25 |
| 2. Meest betrouwbare bron eerst | 5 / 25 |
| 3. Delen of niet? | 8 / 25 |
| 4. De CRAAP-methode toepassen | 13 / 25 |
| **Totaal** | **43 / 100** |

Het eindscherm toonde "FACTCHECKER · AFGEROND" met de knop "Missie voltooid!". De opdracht is
dus daadwerkelijk haalbaar zonder één zin te lezen.

Twee nuances die eerlijk vermeld moeten worden. De marge is klein: 43% tegen een grens van 40%,
en de rangschikronde is de enige variabele factor. Bij een ongunstiger husseluitkomst kan
dezelfde blinde strategie nét onder de grens eindigen. De drie andere rondes leveren echter
consistent 38 punten op, dus de speling zit volledig in die ene ronde.

De oorspronkelijke schatting van 12-13 punten per ronde klopte niet; de tegenlezing corrigeerde
naar 17, wat het naspelen bevestigde.

### 1.3 `review-arena` (de herhaalopdracht) — drie routes naar onverdiende punten

1. **Herlaad-truc — nagespeeld en hard bewezen.** De correctie wordt getoond vóórdat de score
   wordt vastgelegd; dat gebeurt pas bij de klik op "Volgende ronde" (`ReviewArena.tsx:176-184`).
   Het tussenresultaat leeft uitsluitend in lokale state en wordt nergens opgeslagen.

   De empirische gang van zaken:
   1. Ronde 1 van `data-review` ingediend zonder te sorteren → **4 van de 25 punten**, met het
      correctiescherm en de juiste volgorde in beeld.
   2. Opslag gecontroleerd vóór de klik: `{"currentRound":0,"roundScores":[]}` — de mislukte
      poging staat nergens vastgelegd.
   3. Pagina hard herladen zonder "Volgende ronde" te klikken.
   4. Ronde 1 verschijnt volledig vers, zonder enig spoor van de poging, score nog op 0.
   5. Met de zojuist geziene juiste volgorde opnieuw ingediend → **"Perfect! Alle 6 items in de
      juiste volgorde. 25/25 punten."**

   Een leerling kan dus onbeperkt gratis herkansen, mét de antwoorden in het hoofd. Dit patroon
   geldt voor alle vier de rondetypes.

   *De eerdere tegenlezing (A4) noemde de claim te sterk omdat de sleepronde niet de volledige
   juiste volgorde zou tonen. Het naspelen weerlegt dat: de feedback gaf genoeg prijs om de
   ronde daarna foutloos te doen.*
2. **Bonus overstemt fouten.** `RapidFire.tsx:80-84` telt een reeksbonus bovenop de basisscore
   en kapt pas daarna af. **Te zwak geformuleerd, aldus de tegenlezing:** met de echte
   `data-review`-config haalt een leerling met 7 van de 8 goed al de volle 25 van 25.
3. **Onvoorwaardelijk voltooid.** `ReviewArena.tsx:212-215` rondt af met `onComplete(true)`
   ongeacht de score; de 40%-grens in het eindscherm is puur tekst. Nagespeeld met bewust foute
   antwoorden in twee rondes: eindscore 65 van 100, eindscherm toonde gewoon "Missie voltooid!".
   Omdat de code de score nergens controleert, geldt dat tot en met nul punten.

### 1.4 Herstel van voortgang is nergens gecontroleerd

Opgeslagen voortgang wordt zonder enige controle teruggezet (`useMissionAutoSave.ts:63-73`).
Verandert een opdracht van inhoud, dan wijst de opgeslagen positie naar iets wat niet meer
bestaat: leeg scherm zonder terugknop, dat na élke verversing terugkomt omdat de kapotte
opslag blijft staan. Bevestigd (B3), met de nuance dat dit is aangetoond voor incompatibele
id-, state- of indexwijzigingen — niet voor élke wijziging.

### 1.5 Toegankelijkheid: de leerling kan niet bij de gegevens

- **Tabelkoppen zijn niet met het toetsenbord te sorteren** (`InteractiveTable.tsx:82`),
  terwijl de opdracht zélf schrijft "Sorteer of filter om antwoorden te vinden".
- **Waarden in staafgrafieken bestaan alleen in een muis-tooltip** (`SimpleChart.tsx:43`).
  Op een tablet is een vraag naar een waarde uit zo'n grafiek daarmee onbeantwoordbaar. De
  taartgrafiek doet dit wél goed — de motor is intern inconsistent.
- **In de categorisatieronde is een foute plaatsing niet met het toetsenbord terug te
  draaien** (`Categorize.tsx:150`).
- **Tekstkleur `text-duck-ink/60`** komt in alle drie de motoren terug. **Gemeten in de
  browser** op drie schermen: 4,33:1 op een witte kaart, 4,15:1 op de crème achtergrond, en
  3,58:1 voor de lichtere `/55`-variant. Alle drie onder de norm van 4,5:1, dus het probleem is
  reëel en structureel — maar de oorspronkelijke schatting "circa 3:1" was te somber. Wie deze
  bevinding overneemt moet het bereik 3,6-4,3:1 noemen, niet 3:1.

---

## 2. De zwaarste opdrachtbevinding: `data-review` gaat over het verkeerde onderwerp

`data-review` is de herhaalopdracht waarmee leerlingen zich voorbereiden op de periodetoets
van periode 1. Alle vier de rondes behandelen echter privacy, persoonsgegevens en
databeveiliging — het onderwerp van leerjaar 3, periode 2, dat daar al een eigen
herhaalopdracht heeft (`security-review.ts`).

Dekking van de zes opdrachten uit deze periode:

| Opdracht | Komt terug? |
|---|---|
| `factchecker` | zijdelings (2 items) |
| `data-journalist` | zijdelings (1 item) |
| `spreadsheet-specialist` | **nee** |
| `api-verkenner` | **nee** |
| `dashboard-designer` | **nee** |
| `ai-bias-detective` | **nee** |

Bevestigd bij de tegenlezing (C1), met één nuance: ronde 1 gaat primair over
bronbetrouwbaarheid en raakt de AVG pas in de vervolgvraag — de claim "alle vier de rondes
gaan over de AVG" is dus net te sterk. Het beeld verandert daar niet door: vier van de zes
opdrachten komen niet terug.

Dit oogt niet als een fout in een vraag maar als een verwisseling bij het opzetten. **Oordeel:
herontwerp** — de rondes moeten opnieuw worden gebouwd rond de zes werkelijke opdrachten, óf
de curriculumkoppeling moet wijzigen. Dat is een curriculumbeslissing, geen codewijziging.

Bijvangst: rapid-fire vraag 4 stelt dat elke herkenbare foto biometrische persoonsgegevens
oplevert. Onder de AVG is dat pas zo bij specifieke verwerking voor unieke identificatie.

---

## 3. Wat de tegenlezing weerlegde

Twee bevindingen hielden geen stand, en dat is precies waarvoor deze stap bestaat:

1. **`factchecker` ronde 2 zou de bronnen al in de juiste volgorde tonen.** De vijf items
   staan in de configuratie inderdaad al goed gesorteerd, maar de motor husselt ze vóór
   weergave, en omdat de configuratievolgorde hier samenvalt met de antwoordvolgorde
   garandeert de ingebouwde controle juist dat de getoonde volgorde afwijkt (bevestigd, B4).
   **De blokker vervalt.** Wel blijft het slechte hygiëne: wie de bron inziet, leest het
   antwoord af.
2. **De gokcijfers voor de `scenario-engine`.** De genoemde 12-13 punten per ronde klopten
   niet; het zijn er 17. De conclusie werd daardoor niet zwakker maar sterker (§1.2).

Het naspelen bevestigde dit onafhankelijk: de getoonde volgorde week duidelijk af van de
configuratie, en blind van boven naar beneden klikken leverde slechts 1 van de 5 posities goed
op (5 van de 25 punten).

Bij `ai-bias-detective` staat dezelfde hygiënefout wél nog open: ronde 2 heeft
`correctPosition` 0 t/m 4 gelijk aan de arrayvolgorde. Omdat de motor husselt levert dat geen
gratis punten op, maar het antwoord is uit de bron af te lezen.

**Wel een nieuwe vondst bij het naspelen: elke leerling krijgt exact dezelfde husselvolgorde.**
De hussel gebruikt het ronde-nummer als startpunt, niet iets per leerling
(`OrderPriorityRound.tsx:64`). In twee volledig verse sessies verscheen dezelfde volgorde. De
volgorde verklapt het antwoord niet, maar een leerling die de ronde af heeft, kan zijn oplossing
één-op-één doorgeven aan de rest van de klas.

**En één claim bleek loos:** het onleesbare gele label in de categorisatieronde is dode code.
Geen enkele opdracht in het platform gebruikt drie categorieën; `data-review` heeft er twee.
Het risico bestaat pas zodra iemand een derde categorie toevoegt — dan is het contrast
waarschijnlijk slecht, maar dat is nu niet te meten.

---

## 4. Bevindingen per opdracht

### `data-journalist` — fix-eerst

- **De chathulp beschrijft een andere opdracht dan de leerling ziet.** `year2.tsx:27-70`
  instrueert de leerling zelf een dataset te openen, een infographic te bouwen en drie
  voortgangsmarkeringen te zetten, terwijl het scherm drie vaste datasets met vaste vragen
  toont (bevestigd, D4). Vermoedelijk nooit bijgewerkt na de overstap naar het sjabloon.
- **Het gekoppelde leerdoel "digitale producten maken" wordt niet getoetst** — de leerling
  maakt niets. Ofwel de koppeling aanpassen, ofwel een maak-stap toevoegen.

### `ai-bias-detective` — fix-eerst

Goed geschreven en respectvol van toon; de opdracht ontleedt stereotypen in plaats van ze te
reproduceren. Vijf punten moeten eruit vóór uitrol:

1. **Ronde 1 en ronde 3 spreken elkaar tegen over de filterbubbel.** In ronde 1 leert de
   leerling dat dit géén oneerlijkheid is; in ronde 3 wordt hetzelfde mechanisme fout gerekend.
   Wie het beste heeft opgelet, antwoordt fout (bevestigd, C3).
2. **Ronde 3 heeft een strikt om-en-om patroon** (waar, niet waar, waar, niet waar, …). Wie dat
   doorheeft, haalt de rest foutloos zonder te lezen (bevestigd, C2 — met de terechte nuance
   dat de leerling het patroon eerst moet herkennen).
3. **Ronde 1 item 8 is niet te beantwoorden uit de vraag.** Het gegeven waarop het juiste
   antwoord berust, staat pas in de uitleg achteraf — en daar nog voorwaardelijk.
4. **Onjuiste claim over de EU AI Act.** De opdracht stelt dat externe audits al verplicht zijn
   voor hoog-risico AI. Artikel 43(2) schrijft voor de meeste Annex III-categorieën juist
   interne controle voor. Bevestigd, en de tegenlezing noemde de claim zelfs **te zwak**: de
   tekst verwart bovendien de plichten van aanbieders met die van gebruikers. In een opdracht
   die leert claims kritisch te toetsen weegt dit zwaar.
5. **Kindveiligheid — twee punten om te heroverwegen.** Ronde 3 item 2 gebruikt "witte wijken"
   en "niet-westerse achternamen"; die laatste categorie hanteert het CBS sinds 2022 niet meer,
   juist omdat hij groepen onhoudbaar samenklontert. Een leerling met zo'n achternaam wordt
   klassikaal het voorbeeldgeval. Daarnaast gaan vijf van de zes zwaarste casussen over
   etniciteit of klasse, met steeds dezelfde groep als benadeelde; beperking en leeftijd komen
   nergens voor, terwijl de opdracht zelf stelt dat bias iedereen kan treffen.

   *Aanbeveling van de reviewer: vermeld in de docentenhandleiding dat deze opdracht beter
   individueel dan klassikaal-plenair wordt gespeeld. Dat staat nu nergens.*

### `dashboard-designer` — fix-eerst

Eén concrete fout: in het cirkeldiagram krijgen Engels, Nederlands en Overige vakken alle drie
dezelfde kleur (`#202023`), samen de helft van de taart. Uitgerekend in een opdracht die leert
"gebruik kleur bewust, denk aan kleurenblinden". Bevestigd (D1), met de nuance dat alleen de
aangrenzende segmenten letterlijk samensmelten en de legenda de waarden behoudt. Eén regel
wijzigen lost het op.

### `api-verkenner` — fix-eerst

Didactisch de best opgebouwde opdracht van de zeven, maar drie feitelijke fouten in een
opdracht die juist leert "hoe API's echt werken":

1. De getoonde weerrespons is platgeslagen weergegeven maar wordt als échte respons
   gepresenteerd; de werkelijke API gebruikt geneste velden (bevestigd, D2 — en de tegenlezing
   noemde de claim te zwak: ook de veldnamen en tijdnotaties wijken af).
2. De voorbeeld-URL gebruikt een verkeerd domein en laat de verplichte sleutel weg, terwijl de
   nieuws-API ernaast die juist wel correct toont.
3. Het valuta-voorbeeld werkt niet meer zonder sleutel. **De tegenlezer heeft dit live
   aangeroepen:** de dienst antwoordt met `missing_access_key` (bevestigd, D3).

### `factchecker` — ship, met kanttekening

Na het vervallen van de blokker resteert één aandachtspunt: de introductie van ronde 4 propt
vijf beoordelingscriteria in één zin. Onder de woordgrens, maar dicht voor 13-jarigen.
De motorbevindingen uit §1.2 gelden onverkort.

### `spreadsheet-specialist` — ship

Rekenkundig, feitelijk en structureel in orde; alle formulenamen kloppen als Nederlandstalige
Excel/Sheets-functies en de sorteer- en filtertips verwijzen naar functionaliteit die echt
werkt. Eén open vraag: het leerdoel "digitale producten maken" is zwak onderbouwd, want de
leerling bouwt niets. Curriculumbeslissing, geen blokker.

---

## 5. Aanbevolen volgorde

1. **Motorlaag eerst.** Open vragen inhoudelijk keuren of hun gewicht verlagen; slaaggrens van
   de scenariomotor boven het gokniveau tillen; score vastleggen vóórdat de correctie zichtbaar
   wordt; afronden koppelen aan de werkelijke score. Dit raakt alle zeven opdrachten en ver
   daarbuiten — alle 15 data-viewer-opdrachten en 36 scenario-opdrachten in het platform.
2. **`data-review` herontwerpen** rond de zes werkelijke opdrachten van deze periode.
3. **Feitelijke fouten repareren:** de EU AI Act-claim en de interne tegenspraak in
   `ai-bias-detective`, de drie API-voorbeelden, de taartkleuren, de chathulp van
   `data-journalist`.
4. **Toegankelijkheid:** toetsenbordbediening voor sorteren en categoriseren, waarden zichtbaar
   maken zonder muis, tekstcontrast verhogen.
5. **Curriculumbeslissing:** het leerdoel "digitale producten maken" hangt aan vier opdrachten
   waarin de leerling niets maakt. Ofwel de koppeling aanpassen, ofwel maak-stappen toevoegen.

Punt 1 en 2 raken code en curriculum die buiten de opdrachtbestanden liggen. Conform de
pipeline zijn ze **niet** automatisch gerepareerd; dit rapport legt ze bij Yorin neer.

---

## 6. Verantwoording

**Wel gedaan:** volledige verse review van 7 opdrachten op ontwerp, didactiek en techniek; één
motorpass per gedeeld sjabloon; tegenlezing van 16 dragende claims door een onafhankelijk model
in vier parallelle rondes, waarbij 14 zijn bevestigd, 2 weerlegd en 5 herformuleerd.

**Ook gedaan:** de opdrachten zijn daadwerkelijk nagespeeld tegen een lokale server. Van de
tien nagespeelde claims zijn er acht bevestigd, één weerlegd en één niet toetsbaar gebleken.
Contrast is met JavaScript gemeten, niet op het oog. Volledig verslag:
`j2p1-naspeel-verificatie-2026-08-06.md`.

**Nog niet hard:** dat de grafiekwaarden ook op een échte tablet onbereikbaar zijn, is niet op
een fysiek apparaat getest — de omgeving simuleert alleen een muis. De code bevat geen enkele
tik- of focusafhandeling op de balken, dus de conclusie is zeer waarschijnlijk juist, maar
formeel onbewezen.

**Niet gewijzigd:** er is geen enkele reparatie toegepast. Dit is een reviewronde, geen fixronde.

### Rapporten

| Bestand | Inhoud |
|---|---|
| `j2p1-engines-2026-08-06.md` | de drie gedeelde motoren |
| `data-journalist-2026-08-06.md` | per opdracht |
| `spreadsheet-specialist-2026-08-06.md` | |
| `factchecker-2026-08-06.md` | |
| `api-verkenner-2026-08-06.md` | |
| `dashboard-designer-2026-08-06.md` | |
| `ai-bias-detective-2026-08-06.md` | |
| `data-review-2026-08-06.md` | |
| `j2p1-naspeel-verificatie-2026-08-06.md` | naspelen (loopt) |
