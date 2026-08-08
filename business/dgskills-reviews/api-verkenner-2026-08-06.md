# Review: API Verkenner (`api-verkenner`)

**Template:** data-viewer · **Leerjaar 2, periode 1** · SLO 21A, 21C (vso 18A, 18B)
**Reviewdatum:** 2026-08-06

## Samenvatting

Didactisch solide missie met een logische opbouw (JSON-structuur → vergelijkende data → URL-parameters/apiKey). Score-rekensom klopt (100 punten totaal, badges 0/40/65/85 haalbaar). Het zwaarste probleem zit in de **technische/feitelijke juistheid van de "echte API"-voorbeelden**: twee van de vier voorbeeld-URL's wijken af van hoe de genoemde API's echt werken, wat het risico geeft dat een nieuwsgierige leerling de URL kopieert/googelt en een tegenstrijdig beeld krijgt.

## Score-rekensom (geverifieerd)

| Vraag | Punten |
|---|---|
| q1 (gevoelstemperatuur) | 15 |
| q2 (datatype) | 10 |
| q3 (open: nut van keys) | 10 |
| q4 (meeste verzoeken) | 10 |
| q5 (verschilfactor) | 15 |
| q6 (open: WhatsApp vs Instagram) | 10 |
| q7 (apiKey-functie) | 15 |
| q8 (open: URL-patroon) | 15 |
| **Totaal** | **100** |

Komt exact overeen met `maxScore: 100`. Badges 0/40/65/85 zijn alle bereikbaar (geen gat, geen dubbele drempel).

## Design (score: 8/10)

Geen structurele designproblemen in de config zelf. Kleurgebruik in de bar-chart (`#ff3c21` voor top-2, `#202023` voor de rest) is consistent en functioneel (highlight van de hoogste waarden). Badge-kleuren zijn alle identiek (`#202023`) — geen visuele differentiatie tussen de vier niveaus, minor.

- **Warning:** alle vier badges hebben dezelfde `color: '#202023'`. Andere J2P1-missies (zie sibling-configs) gebruiken vaak oplopende kleurintensiteit per badge-niveau; hier ontbreekt dat onderscheid volledig.

## Didactiek (score: 8/10)

- Opbouw is logisch: eerst JSON-structuur/datatypes (concreet, tabel), dan een vergelijkende dataset (makkelijker, herkenbare apps), dan het abstractere concept URL-parameters + apiKey. Nieuwe begrippen (key, value, datatype, parameter, apiKey) worden steeds vóór gebruik uitgelegd in de dataset-`description` of card-`content`.
- Geen enkele multiple-choice heeft een vast antwoordpatroon (correcte opties staan op wisselende posities: 3e, 4e, 2e van 4).
- Beschrijvingen verklappen het antwoord niet vooraf.
- Leerdoel (`missionGoals`) is concreet en meetbaar (score-drempel 65 + evidence-omschrijving).
- Minor: de drie open (`text-observation`) vragen hebben `correctAnswer: ''`; dit is een engine-breed patroon (niet specifiek voor deze config) — zie **claimsVoorNaspelen** voor de vraag of deze alleen op lengte worden beoordeeld.

## Tech / feitelijke juistheid (score: 6/10) — zwaarste as

Dit is de as waar de meeste aandacht naar moet, gezien het onderwerp (echte publieke API's).

1. **Dataset 1 — OpenWeatherMap-structuur is geen echte weergave van de API.** De tabel presenteert een platte lijst sleutels (`city`, `country`, `temp`, `feels_like`, `humidity`, `wind_speed`, `description`, `sunrise`, `sunset`, `timestamp`) als "de volgende JSON-response... ontvangen van de OpenWeatherMap API". De échte OpenWeatherMap Current Weather-respons is genest: `main.temp`, `main.feels_like`, `main.humidity`, `wind.speed`, `weather[0].description`, `sys.country`, `sys.sunrise`/`sys.sunset` (unix-timestamps, geen `"06:42"`-strings), `name` voor de stad. Nesting (objecten-in-objecten, arrays) is een kernconcept van JSON dat hier onbenoemd blijft, terwijl het bij de échte API meteen zichtbaar zou zijn. In tegenstelling tot dataset 3 (die expliciet "vereenvoudigd" vermeldt) claimt dataset 1 dit als een letterlijke API-respons.
   - **Impact:** leerling die zelf OpenWeatherMap opzoekt ziet een compleet andere structuur → verwarrend, ondermijnt het net-geleerde JSON-begrip.
   - **Fix:** ofwel de tabel expliciet labelen als vereenvoudigde/afgeplatte weergave ("Voor het overzicht tonen we de velden plat, in het echt zitten ze genest in objecten zoals `main` en `wind`"), ofwel de description-tekst aanpassen zodat 'm niet als letterlijke respons wordt gepresenteerd.

2. **Dataset 3, kaart "Weer-API: Amsterdam" — domein en query-structuur kloppen niet, en de verplichte apiKey ontbreekt.** URL `https://api.weather.com/current?city=Amsterdam&units=metric&lang=nl` gebruikt een fictief/generiek domein (`api.weather.com`, in werkelijkheid van The Weather Company/IBM, niet OpenWeatherMap) en een parameterstijl die niet bij de in dataset 1 genoemde OpenWeatherMap hoort (echt: `q=Amsterdam` of `lat`/`lon`, plus een verplichte `appid`). Elke echte weer-API (incl. OpenWeatherMap) vereist een sleutel voor elke aanroep — deze kaart suggereert het tegendeel, wat inconsistent is met de eigen NewsAPI-kaart ernaast die júist correct uitlegt dat een apiKey nodig is.
   - **Fix:** voeg `&appid=DEMO_SLEUTEL` toe (net als bij de NewsAPI-kaart) of vermeld expliciet dat de sleutel hier is weggelaten voor de leesbaarheid.

3. **Dataset 3, kaart "Valuta-API" — `api.exchangerate.host/convert` werkt in de praktijk niet meer zonder sleutel.** Sinds de overname door APILayer vereist deze API een `access_key`-parameter; zonder key geeft de dienst een foutmelding (`missing_access_key`). Het voorbeeld in de missie suggereert dat dit zonder sleutel werkt, wat feitelijk niet meer klopt en het enige voorbeeld is in deze missie waar leerlingen expliciet géén apiKey zien terwijl die in werkelijkheid wél nodig is.
   - **Fix:** ofwel een `access_key`-parameter toevoegen aan het voorbeeld (consistent met de andere kaarten), ofwel overstappen op een API die aantoonbaar sleutelloos is (bv. Frankfurter, `https://api.frankfurter.dev/v1/latest?from=EUR&to=USD&amount=100`).

Overig gecontroleerd en correct:
- PokéAPI (`https://pokeapi.co/api/v2/pokemon/pikachu`) — bestaat, gratis, geen sleutel nodig. Klopt.
- NewsAPI (`newsapi.org/v2/top-headlines?...&apiKey=...`) — bestaat, parameters (`category`, `country`, `apiKey`) kloppen, en de tekst legt terecht uit dat een echte sleutel privé moet blijven.
- Begripsuitleg apiKey ("identificeert wie het verzoek stuurt en voorkomt misbruik") is correct.
- Begripsuitleg JSON key/value (q3-uitleg) is correct en didactisch sterk.

## SLO-koppeling (21A + 21C, was 21D→21A)

De aantekening bij de mapping-entry ("APIs begrijpen = systeemkennis, geen AI") is inhoudelijk consistent met de missie-inhoud: er wordt nergens AI, algoritmes of bias behandeld, uitsluitend systeemkennis over data-uitwisseling tussen apps. Geen probleem.

## Verdict

**fix-eerst** — de drie tech-issues zijn eenvoudig te herstellen tekstuele/data-correcties (geen herontwerp van de missie-structuur nodig), maar zouden niet ongewijzigd naar leerlingen moeten gaan gezien het expliciete lesdoel "hoe API's echt werken".
