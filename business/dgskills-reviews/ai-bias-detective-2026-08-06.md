# Missie-review: AI Bias Detective

- **missionId:** `ai-bias-detective`
- **templateType:** `scenario-engine`
- **Config:** `src/features/missions/templates/scenario-engine/configs/ai-bias-detective.ts` (389 regels)
- **Plek:** leerjaar 2, periode 1 "Data & Informatie" (6e en laatste missie vóór `data-review`)
- **SLO:** 21D (AI), 23C (Maatschappij) · VSO 18C, 20B
- **Reviewdatum:** 2026-08-06
- **Scope:** alleen deze config + registraties. De gedeelde engine `ScenarioEngine` is expliciet buiten scope (aparte reviewer).

**Eindoordeel: `fix-eerst`** — design 6/10, didactiek 5/10, tech 8/10, triageScore 3.8.

De missie is goed geschreven, respectvol van toon en didactisch ambitieus. Er zitten echter twee blokkerende inhoudelijke fouten in (een interne tegenspraak tussen ronde 1 en ronde 3, en een onjuiste claim over de EU AI Act), plus twee scorepatronen waarmee een leerling punten kan halen zonder de stof te begrijpen. Die moeten eruit vóór uitrol.

---

## 1. Registratie-integriteit (tech)

| Bron | Regel | Status |
|---|---|---|
| `src/config/templateRegistry.ts` | 18 | ✅ `templateType: 'scenario-engine'`, komt overeen met de config |
| `src/config/slo-kerndoelen-mapping.ts` | 106 | ✅ `['21D','23C']` + VSO `['18C','20B']`, alle codes geldig |
| `src/config/curriculum.ts` | 175 | ✅ leerjaar 2, periode 1, in de missielijst |
| `src/config/missionGoals.ts` | 410-418 | ✅ `primaryGoal` + `score-threshold: 60` + `evidence` aanwezig |

Geen enkele registratie ontbreekt of spreekt een andere tegen. `week: 1` in de SLO-mapping wijkt niet af — álle J2P1-missies staan op `week: 1`, dus dat is huisconventie, geen bevinding.

**Puntenrekening klopt.** Vier rondes × `maxScore: 25` = 100 = `maxScore` van de missie. Alle vier de badgedrempels (80 / 60 / 40 / 0) zijn haalbaar; de drempel `60` uit `missionGoals.ts` valt precies samen met de tweede badge ("Bias Detective"), wat consistent is. Geen onbereikbare badge, geen gat in de schaal.

Badgekleuren zijn hardcoded hex (`#ff3c21`, `#202023`) in plaats van `duck-*` tokens. Dit is een datafield, geen `className`, en `#ff3c21`/`#202023` zijn exact `duck-error`/`duck-ink` — bovendien gebruiken 36 andere scenario-engine-configs dezelfde waarden. Conventie, geen afwijking. Niet geflagd.

De config bevat geen JSX, geen handlers, geen `any`, geen edge-functioncalls en geen leerling-input die naar een AI gaat. De tech-as heeft hier weinig aangrijpingspunt; het aftrekpunt zit in confighygiëne (zie §3.3).

---

## 2. Kindveiligheid en discriminatie

Dit is de zwaarste as en die verdient een eerlijk oordeel in twee richtingen.

### 2.1 Wat er goed gaat

De missie **ontleedt** stereotypen in plaats van ze te reproduceren. In alle gevallen legt de `explanation` de fout bij het systeem, de data of de historische ongelijkheid — nooit bij de groep zelf:

- Ronde 1 item 1 (boeken per gender) benoemt expliciet dat het leespatroon "het gevolg was van sociale verwachtingen — niet van daadwerkelijke interesse".
- Ronde 1 item 5 (gezichtsherkenning) legt de oorzaak bij de trainingsdata ("bestond grotendeels uit lichte huidtinten"), niet bij de gezichten.
- Ronde 1 item 6 (zorgalgoritme) benoemt de historische ongelijkheid in zorgtoegang als oorzaak.

Dat is de juiste houding en is consequent volgehouden. Ronde 4 item 8 ("getroffen groepen betrekken bij het ontwerp") geeft de besproken groepen bovendien handelingsruimte in plaats van alleen slachtofferschap. Goed gedaan.

De `feedbackIncorrect` van ronde 3 ("Soms is de grens dun. Lees de uitleg om te begrijpen waarom.") is veilig geformuleerd: een leerling die het discriminerende scenario "eerlijk" noemt, krijgt geen morele terechtwijzing maar een inhoudelijke uitleg. Dat is precies goed voor een klassikale setting.

### 2.2 Wat ik zou heroverwegen — ronde 3, item 2 (huizenzoeksite)

Regels 239-246. Drie problemen op één item:

1. **"witte wijken"** is een zware formulering om een 13-jarige klassikaal op het scherm te krijgen. De didactische lading zit al volledig in "dure wijken"; de raciale codering van de wijk voegt geen leerwaarde toe maar wel spanning.
2. **"niet-westerse achternamen"** gebruikt een categorie die het CBS sinds 2022 niet meer hanteert, juist omdat hij groepen samenklontert op een manier die niet houdbaar is. In een missie die leert dat categorisering scheef kan zijn, is dat een ongelukkige keuze.
3. Een leerling die zélf een achternaam heeft die onder die noemer valt, wordt hier klassikaal als het voorbeeldgeval aangewezen — terwijl de vraag hem tegelijk dwingt te oordelen of dat "eerlijk" is.

Daar komt bij dat **titel en beschrijving elkaar tegenspreken**: de titel zegt "minder huizen in rijke wijken", de beschrijving "minder dure huizen in witte wijken". Dat zijn twee verschillende beweringen.

**Aanbeveling:** herschrijf naar de achternaam als proxy zonder de wijk raciaal te labelen, bijvoorbeeld: *"Een huizenzoeksite toont mensen automatisch minder dure woningen zodra hun achternaam bij een bepaalde groep hoort."* De uitleg mag daarna gewoon expliciet het woord **redlining** noemen — dat is een historische term met een naam, en die naam leren is didactisch waardevoller dan de huidige omschrijving "een historische praktijk waarbij hele wijken systematisch werden uitgesloten".

### 2.3 Wat ik zou heroverwegen — de spreiding van de voorbeelden

Takeaway 2 stelt: *"Bias in AI kan iedereen treffen."* De voorbeelden bewijzen dat niet. Van de zes zwaarste casussen (R1 item 5, R1 item 6, R2 item 1, R3 item 2, R3 item 6, en deels R1 item 8) gaan er vijf over etniciteit of sociale klasse, en steeds met dezelfde groep in de rol van benadeelde. Gender komt één keer voor (R1 item 1, R1 item 3). **Beperking en leeftijd komen in geen enkele ronde voor**, terwijl ronde 4 item 4 wél belooft dat er getest wordt op "geslachten, leeftijden en achtergronden".

Dat is geen veiligheidsprobleem maar wel een didactisch en klassikaal-sociaal probleem: het maakt bias tot iets wat "die groep overkomt" in plaats van een structureel mechanisme. Eén casus op een andere as — bijvoorbeeld spraakherkenning die slechter werkt bij mensen met een spraakbeperking, of een AI die oudere sollicitanten wegfiltert — spreidt de last en onderbouwt takeaway 2 daadwerkelijk.

### 2.4 Kan een verkeerd antwoord een leerling publiekelijk een discriminerende uitspraak laten kiezen?

Ja, structureel: in ronde 3 betekent "eerlijk" antwoorden bij item 2 en item 6 dat je discriminatie goedkeurt. Dat is echter inherent aan de leerdoelstelling en niet vermijdbaar zonder de missie te ontmantelen. De verzachting zit in de neutrale `feedbackIncorrect` en in het feit dat de score per ronde wordt gegeven, niet per item. Ik beschouw dit als **aanvaardbaar risico, mits** de docentenhandleiding vermeldt dat deze missie beter individueel dan klassikaal-plenair wordt gespeeld. Dat staat nu nergens.

---

## 3. Kan een leerling scoren zonder inhoudelijk werk?

Dit is de scherpste bevindingencategorie van deze review.

### 3.1 BLOKKEREND — ronde 3 heeft een strikt alternerend antwoordpatroon

Regels 226-287. De zes `correct`-waarden staan in deze volgorde:

| Item | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| `correct` | `true` | `false` | `true` | `false` | `true` | `false` |

Perfect alternerend. Een leerling die na twee of drie items doorheeft dat het antwoord om en om gaat, haalt de resterende items foutloos zonder één scenario te lezen. Dat is precies het patroon dat de XP-farming-regels in `src/features/missions/CLAUDE.md` verbieden ("Do not reward shallow interaction").

**Fix:** herschik naar een niet-voorspelbare volgorde, bijvoorbeeld `true, false, false, true, false, true` (item 1, 3, 5 wisselen van plek met 2, 4). Dit is een pure herordening van de `items`-array; geen tekst hoeft te veranderen.

### 3.2 BLOKKEREND (onder voorbehoud van naspelen) — ronde 2 staat al in de juiste volgorde

Regels 161-212. De `correctPosition`-waarden zijn 0, 1, 2, 3, 4 — exact gelijk aan de arrayindex van elk item. De config levert de rangorde dus vooraf gesorteerd aan.

Of dit daadwerkelijk gratis punten oplevert, hangt af van de vraag of de engine de items shuffelt vóór weergave. Die engine valt buiten mijn scope, dus **dit moet worden nagespeeld** (zie §7). Twee scenario's:

- Shuffelt de engine niet → de ronde is bij openen al opgelost en levert 25 gratis punten. Blokkerend.
- Shuffelt de engine wel → geen direct scoreprobleem, maar het blijft slechte confighygiëne: elke andere reviewer, docent of leerling die de bronbestanden inziet leest het antwoord zo af.

**Fix in beide gevallen:** zet de items in de config in een andere volgorde dan `correctPosition`. Kost niets en maakt de config onafhankelijk van engine-gedrag.

### 3.3 WAARSCHUWING — ronde 4 beloont "vink alles aan"

Regels 303-384. Van de acht items zijn er **zes correct** (1, 2, 4, 5, 7, 8) en twee fout (3 "AI sneller en goedkoper maken", 6 "alles aan de AI overlaten"). Een leerling die alles aanvinkt heeft 6 van de 8 goed — 75% — zonder één uitleg te lezen.

Ter vergelijking: ronde 1 is met 5 correct en 3 fout beter uitgebalanceerd, maar zit ook aan de bovenkant.

**Fix:** voeg één of twee plausibel klinkende maar onjuiste maatregelen toe, zodat de verhouding richting 50/50 gaat. Kandidaten die didactisch iets toevoegen: *"De AI zo instellen dat hij geslacht en etniciteit helemaal niet meer als variabele ziet"* (fout — proxyvariabelen als postcode en naam nemen het over; dit sluit bovendien prachtig aan op ronde 3 item 2) en *"Meer data verzamelen"* (fout — méér van dezelfde scheve data maakt de bias niet kleiner).

---

## 4. Inhoudelijke correctheid

### 4.1 BLOKKEREND — ronde 1 en ronde 3 spreken elkaar tegen over de filterbubbel

Dit is de ernstigste didactische bevinding.

**Ronde 1, item 4** (regels 96-104), Spotify-aanbevelingen, `correct: false` — dus géén bias. De uitleg zegt letterlijk: *"Wel kan het leiden tot een 'bubbel' waarbij je steeds hetzelfde genre hoort. Dat is een neveneffect, maar geen oneerlijke behandeling van een groep."*

**Ronde 3, item 4** (regels 258-266), zoekmachine die minder politiek nieuws toont, `correct: false` — dus niet eerlijk. De uitleg zegt: *"Dit is een filterbubbel — een neveneffect van personalisatie."*

Zelfde mechanisme, zelfde woord ("neveneffect"), tegengestelde beoordeling — en ronde 1 heeft de leerling twee rondes eerder expliciet aangeleerd dat dit géén oneerlijkheid is. De leerling die het beste heeft opgelet, antwoordt in ronde 3 fout. Dat is de omgekeerde wereld.

**Fix:** kies één lijn. De didactisch sterkste optie is ronde 3 item 4 vervangen door een echte bias-casus (bijvoorbeeld de hierboven voorgestelde beperking- of leeftijdscasus), en de filterbubbel volledig in ronde 1 laten wonen waar hij correct als "geen groepsbias" wordt geclassificeerd. Wie de filterbubbel in ronde 3 wil houden, moet ronde 1 item 4 herschrijven zodat het onderscheid expliciet wordt gemaakt in plaats van tegengesproken.

### 4.2 BLOKKEREND — ronde 1 item 8 is niet te beantwoorden uit de vraag

Regels 135-144. De beschrijving luidt: *"Een navigatieapp routeert zwaar vrachtverkeer consistent door smalle woonstraten in bepaalde wijken."* Er staat geen enkel gegeven over inkomen, groep of sociale positie in. De uitleg introduceert die informatie pas achteraf, en doet dat bovendien **voorwaardelijk**: *"Als de algoritme kwetsbaardere wijken ... disproportioneel belast ... is er sprake van algoritmische bias."*

Het item staat echter op `correct: true`, onvoorwaardelijk. Een leerling die de definitie uit ronde 1 item 7 correct toepast ("bias gaat over systematische scheefheid die een groep mensen anders behandelt") en constateert dat de vraag geen groepsverschil noemt, antwoordt logisch juist en wordt fout gerekend.

**Fix:** zet het gegeven in de vraag: *"...door smalle woonstraten in de armste wijken, terwijl duurdere wijken worden ontzien."* Dan is `correct: true` verdedigbaar en verdwijnt het "Als" uit de uitleg.

(Terzijde in dezelfde regel: *"Als de algoritme"* → *"Als het algoritme"*.)

### 4.3 WAARSCHUWING — het zorgalgoritme is verkeerd samengevat

Ronde 1 item 6, regels 115-124. De **titel** zegt *"raadt minder pijnstillers aan voor zwarte patiënten"*, de **beschrijving** zegt *"prioriteert wie extra zorg nodig heeft"*. Dat zijn twee verschillende systemen, en de titel is de onjuiste van de twee.

Dit gaat vrijwel zeker om de studie van Obermeyer e.a. (Science, 2019) over een Amerikaans algoritme dat patiënten selecteerde voor intensievere zorgprogramma's — niet over pijnmedicatie. De uitleg beschrijft dat mechanisme (zorgkosten als proxy voor zorgbehoefte) vervolgens wél correct.

**Fix:** titel gelijktrekken met de beschrijving, bijvoorbeeld *"Zorgalgoritme selecteert zwarte patiënten minder vaak voor extra zorg"*. Er is geen reden om het bekendere pijnstiller-frame te lenen; het klopt hier niet.

### 4.4 WAARSCHUWING — COMPAS wordt te stellig weergegeven

Ronde 2 item 1, regels 162-171: *"Bias hier betekent dat mensen van kleur hogere risicoscores kregen bij gelijke situaties. Gevolg: ongegronde gevangenisstraf."*

Twee overstatements. Ten eerste was de ProPublica-bevinding (2016) specifieker: zwarte verdachten kregen vaker een hoge risicoscore terwijl ze níet hervielen — een verschil in fout-positieven, niet simpelweg "hogere scores bij gelijke situaties". De maker van het systeem heeft die conclusie destijds bestreden, en het debat erover is één van de bekendste voorbeelden van hoe "eerlijk" op meerdere manieren te definiëren is. Ten tweede is *"Gevolg: ongegronde gevangenisstraf"* een directe causale claim die de rol van het systeem (adviserend, één factor onder meerdere) te groot maakt.

Voor 13-14-jarigen hoeft dat niet volledig genuanceerd te worden, maar de huidige tekst leert wel een te simpel model. Voorstel: *"Bij zwarte verdachten voorspelde het systeem vaker ten onrechte dat ze in herhaling zouden vallen. Rechters lieten die score meewegen in hun beslissing."*

### 4.5 WAARSCHUWING — "diverse data lost bias op" wordt tegengesproken door de missie zelf

Takeaway 3 (regel 46): *"Diverse trainingsdata en diverse ontwikkelteams zijn de beste remedie tegen bias."* Ronde 4 item 1 (regels 305-313) versterkt dat: *"Als de trainingsdata divers en representatief is, leert het model ook patronen die voor alle groepen gelden."*

Maar de sterkste casus van de missie — het zorgalgoritme in ronde 1 item 6 — is precies een geval waar diverse data níet had geholpen. Daar was de dataset representatief; het probleem zat in de gekozen **maatstaf** (zorgkosten als vervanger voor zorgbehoefte). Ook ronde 3 item 6 (politie-AI) is een geval waarin méér representatieve data de vicieuze cirkel niet doorbreekt.

De missie leert dus een mentaal model ("bias = te weinig diverse data") dat zijn eigen beste voorbeelden niet verklaart. Dat is de klassieke oversimplificatie in bias-onderwijs en de moeite waard om te repareren.

**Fix:** takeaway 3 verbreden naar iets als *"Diverse trainingsdata en diverse ontwikkelteams helpen veel — maar niet altijd: soms zit de fout in wát je meet, niet in wie er in de data zit."* Dat is nog steeds begrijpelijk voor 13-jarigen en dekt beide casussen.

---

## 5. EU AI Act en transparantie (escalatie)

Twee claims over wetgeving die niet kloppen zoals ze er staan.

### 5.1 BLOKKEREND — externe audits zijn niet algemeen verplicht

Ronde 4 item 7, regels 364-373: *"Overheden verplichten organisaties ... om externe audits te ondergaan"* met als uitleg *"De EU AI Act verplicht dit al voor hoog-risico AI."*

Dat is onjuist. De AI Act schrijft voor hoog-risico systemen een conformiteitsbeoordeling voor, en die verloopt voor het merendeel van de categorieën uit Annex III via **interne controle** door de aanbieder zelf (Annex VI). Beoordeling door een onafhankelijke instantie geldt alleen voor specifieke gevallen, met name biometrie en producten die al onder bestaande productwetgeving vallen. "Externe audits verplicht voor hoog-risico AI" is dus een te sterke bewering, en juist bij een missie die leert kritisch te zijn op claims is dat pijnlijk.

Het item is als **maatregel** wel terecht `correct: true` (wetgeving en toezicht helpen tegen bias). Alleen de onderbouwing deugt niet.

**Fix uitleg:** *"De EU AI Act stelt strenge eisen aan AI voor beslissingen over mensen: organisaties moeten aantonen dat hun systeem is gecontroleerd voordat het gebruikt mag worden. Voor de gevoeligste toepassingen moet een onafhankelijke instantie meekijken."*

### 5.2 WAARSCHUWING — de uitlegplicht geldt niet voor élk AI-besluit

Ronde 4 item 5, regels 344-353: *"Organisaties die AI gebruiken voor beslissingen over mensen zijn verplicht uit te leggen hoe de AI tot een beslissing komt."*

Te breed geformuleerd. Die verplichting hangt aan hoog-risico toepassingen (en aan geautomatiseerde besluitvorming onder de AVG), niet aan elk AI-systeem dat iets over een mens beslist. De uitleg eronder is wél correct ("kernvereiste van de EU AI Act voor hoog-risico AI") — de beschrijving is dus strenger dan de uitleg. Trek de beschrijving gelijk: *"...die AI gebruiken voor belangrijke beslissingen over mensen (zoals een baan, een lening of zorg) moeten kunnen uitleggen..."*

### 5.3 Geen claims over DGSkills zelf

De config doet nergens uitspraken over DGSkills als product, over eigen AI-gebruik of over eigen compliance. Geen bevinding.

---

## 6. Didactiek: taalniveau, SLO-dekking, leerdoelen

### 6.1 Taalniveau — geslaagd

De norm voor leerjaar 2 is intro <80 woorden en ronde-opdracht <60 woorden. De `introDescription` telt circa 55 woorden, alle vier de ronde-beschrijvingen blijven ruim onder de 40. Vier rondes valt binnen de richtlijn (max 3-4 per scherm bij leerjaar 1-2, hier per ronde één scherm).

Vakjargon wordt netjes ter plekke uitgelegd: "trainingsdata (= de voorbeelden waarvan een AI leert)" op regel 9 is precies goed. "Explainability", "fairness audits" en "participatief ontwerp" staan alleen in de `explanation`-velden, waar ze in context worden uitgelegd — acceptabel, want dat is nabespreking en geen instructie. Toon is direct en niet betuttelend.

Eén typo: takeaway 5 (regel 48) heeft *"mensenlijk toezicht"* → *"menselijk toezicht"*.

### 6.2 SLO-dekking — geslaagd

**21D (AI)** wordt substantieel geraakt: alle vier de rondes gaan over hoe AI-systemen tot uitkomsten komen. **23C (Maatschappij)** ook: ronde 2 en 3 draaien volledig om maatschappelijke gevolgen. Twee kerndoelen is een gezond aantal (de rubriek waarschuwt pas bij 4+). VSO 18C en 20B zijn geldige codes.

De periode heeft `sloFocus: ['21B','21C','21D']`; deze missie claimt 21D uit die focus plus 23C daarbuiten. Dat is verdedigbaar als afsluiter van de periode — de missie is de brug van "data" naar "wat data met mensen doet".

Positionering als zesde en laatste missie klopt didactisch: `factchecker` (bronbeoordeling) en `data-journalist` (data-interpretatie) leveren de voorkennis die deze missie veronderstelt.

### 6.3 WAARSCHUWING — leerdoelen zijn impliciet en het bewijs wordt niet opgehaald

De config heeft geen `learningObjectives`-veld; de leerdoelen leven in `missionGoals.ts` regels 410-418. Dat is de huisconventie voor scenario-engine-missies, dus geen fout op zich.

Wel een probleem is de inhoud van `evidence`: *"Je kunt twee concrete voorbeelden van AI-bias noemen en een maatregel kiezen die écht helpt."* Het tweede deel wordt door ronde 4 bewezen. Het eerste deel — **noemen** — wordt nergens opgehaald. Alle vier de rondes zijn herkennen, rangschikken en classificeren; er is geen enkele ronde waarin de leerling zelf iets formuleert of produceert. Het bewijs dat de missie claimt te leveren, kan hij dus niet leveren.

Dat maakt ook de Bloom-balans eenzijdig: onthouden, begrijpen, analyseren en evalueren zijn allemaal vertegenwoordigd, maar creëren ontbreekt volledig.

**Fix:** ofwel `evidence` gelijktrekken met wat de missie werkelijk meet, ofwel — didactisch sterker — een vijfde, korte open ronde toevoegen waarin de leerling in eigen woorden één voorbeeld uit de missie navertelt. Let bij die tweede route op dat de beoordeling niet alleen op tekstlengte mag zitten (zie §3).

### 6.4 WAARSCHUWING — `introFeatures` belooft iets wat de missie niet doet

Regel 14 belooft: *"Bedenk oplossingen voor eerlijkere technologie."* Ronde 4 laat de leerling geen oplossing bedenken maar kiezen uit acht voorgekauwde opties. Dat is een andere handeling.

**Fix:** herformuleer naar *"Beoordeel welke oplossingen voor eerlijkere technologie écht werken"* — dat dekt de lading en is bovendien een hoger Bloom-niveau dan "bedenk" suggereert.

---

## 7. Claims die alleen door naspelen te bevestigen zijn

1. Shuffelt de engine de items van een `order-priority`-ronde? Zo niet, dan staat ronde 2 bij openen al in de goede volgorde en zijn 25 punten gratis (§3.2).
2. Krijgt een leerling die in ronde 1 en 4 álle items aanvinkt deelpunten, of nul? Dat bepaalt hoe zwaar de "vink alles aan"-strategie uit §3.3 weegt.
3. Wordt de `explanation` van een item pas getoond ná het antwoord, of al bij het lezen van de vraag? Bij het laatste verklapt ronde 1 item 8 zijn eigen antwoord.
4. Toont de engine bij `binary-choice` de items in vaste volgorde? Zo ja, dan is het alternerende patroon uit §3.1 direct exploiteerbaar.
5. Haalt een leerling die alleen ronde 1 en 4 goed doet (50 punten) de drempel van 60 uit `missionGoals.ts` niet — klopt het dat de missie dan als niet-behaald wordt gerapporteerd aan de docent?

---

## 8. Samenvatting van de acties

**Blokkerend, vóór uitrol:**

1. Ronde 3 item 4 (filterbubbel) — lost de tegenspraak met ronde 1 item 4 op (§4.1).
2. Ronde 1 item 8 (navigatieapp) — zet het groepsgegeven in de vraag (§4.2).
3. Ronde 3 — doorbreek het alternerende antwoordpatroon (§3.1).
4. Ronde 2 — zet de items in een andere volgorde dan `correctPosition` (§3.2).
5. Ronde 4 item 7 — corrigeer de claim over verplichte externe audits (§5.1).

**Sterk aanbevolen:**

6. Ronde 3 item 2 — herschrijf "witte wijken" / "niet-westerse achternamen" (§2.2).
7. Ronde 1 item 6 — titel gelijktrekken met de beschrijving (§4.3).
8. Takeaway 3 — nuanceer "diverse data is de beste remedie" (§4.5).
9. Ronde 4 — voeg één of twee foute maatregelen toe voor een betere verhouding (§3.3).
10. Ronde 4 item 5 — beperk de uitlegplicht tot belangrijke beslissingen (§5.2).
11. Ronde 2 item 1 — nuanceer de COMPAS-beschrijving (§4.4).

**Klein onderhoud:**

12. `introFeatures` regel 14: "Bedenk" → "Beoordeel" (§6.4).
13. Typo regel 48: "mensenlijk" → "menselijk".
14. Typo regel 143: "Als de algoritme" → "Als het algoritme".
15. `missionGoals.ts` regel 417: `evidence` gelijktrekken met wat de missie meet (§6.3).

**Ter overweging voor een volgende iteratie:**

16. Voeg een casus toe op een andere as dan etniciteit of klasse — beperking of leeftijd (§2.3).
17. Neem in de docenteninstructie op dat deze missie zich beter leent voor individueel spelen dan voor plenaire behandeling (§2.4).
