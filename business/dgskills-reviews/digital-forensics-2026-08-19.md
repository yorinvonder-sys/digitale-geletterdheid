## Opdracht Live Check: digital-forensics — J3P2 (motor scenario-engine)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen als forensisch analist vier rondes doen: verdachte regels aanwijzen, een tijdlijn ordenen, een netwerkvraag beantwoorden en een afrondende selectie maken. Een zorgvuldige leerling haalt de volle 100 punten; de serieuze baseline haalt 95 en mist alleen één item in ronde 1. Een sjoemelaar die willekeurig klikt of alles aanvinkt komt niet door de 40%-grens heen (hoogstens 20%). Een onzekere leerling komt inhoudelijk goed door de rondes, maar loopt aan het einde vast: onder de 40% zit ze klem op een eindscherm zonder terugknop en met een uitgeschakelde afrondknop. Dat doodlopende eindscherm is de reden dat de missie nog niet klaar is voor de klas.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | eerlijk 95/100 (95%, 'Gehaald', badge Hoofd Forensisch Analist); gokproef 20/100 (20%) |
| Sjoemelaar | 15/100 (15%) — 'Nog niet gehaald' |
| Worstelaar | eerlijk 100/100 (100%, 'Gehaald'); gokproef 15/100 (15%) |
| iPad (Playwright) | niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus) |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Een leerling die onder de 40% eindigt zit klem op het eindscherm: de enige knop is uitgeschakeld, er is geen terugknop, en herladen brengt haar terug op hetzelfde scherm. Alleen browser-navigatie, een speciale URL of het wissen van opslag helpt — dingen die een leerling niet weet. _Bewijs: drie runs (20%, 15%, 15%) tonen dezelfde uitgeschakelde knop en herlaad-resultaat; code toont geen terug-route._
2. **MAJOR** · motor · weerlegd — De motorbevinding 'grijze inzendknop zonder uitleg' raakt deze missie niet: er is geen minimumaantal selecties ingesteld, dus de knop is altijd verklaarbaar actief. Geldt wel voor andere missies op deze motor. _Bewijs: alle drie de runs zagen een bruikbare inzendknop; geen minSelections in de config._
3. **MINOR** · missie · bevestigd — In beide select-correct-rondes ontgrendelt de inzendknop al na één selectie, zonder tekst hoeveel selecties er nodig zijn. Een leerling die niets leest haalt zo per ronde 5/25 met één klik. _Bewijs: sjoemelaar-run: knop actief na 1 selectie, ronde-score 5/25; geen minSelections in config._
4. **MINOR** · missie · bevestigd — Fase 3 leunt op één stukje technische voorkennis (IP-adressen die met 10.x beginnen zijn intern). De uitleg staat wél letterlijk in de itemtekst, dus wie leest komt eruit, maar een snelle doorlezer struikelt. _Bewijs: worstelaar-run miste dit item; de uitleg staat in de itemtekst zelf._
5. **MINOR** · motor · weerlegd — De motorbevinding 'één foute klik halveert de rondescore bij precies twee afleiders' is niet van toepassing: beide select-correct-rondes hebben 5 juiste items en 3 afleiders, dus de aftrek per misser is veel milder. _Bewijs: config-telling: ronde 1 en ronde 4 hebben elk 5 van 8 juiste items._
6. **MINOR** · motor · onbevestigd — De voortgangsbalkjes in de gedeelde koptekst hebben geen tekstalternatief en de scorechip geen label: 'ronde 2 van 4' en de lopende score zijn puur visueel. Niet apart nagemeten in deze drie speelsessies. _Bewijs: motorreview meldt dit; geen van de runs heeft dit live gemeten._
7. **MINOR** · motor · onbevestigd — De motorbevinding 'vaste, klasbrede startvolgorde bij sleepvolgorde' is hier niet toetsbaar: ronde 2 gebruikt klikken-op-volgorde, dat al een per-leerling willekeurige start heeft. Geen slepen in deze missie. _Bewijs: config toont type 'order-priority'; alle drie de routemaps noemen klikken i.p.v. slepen._

### Wat goed werkte
- De vier rondes zijn volledig speelbaar van intro tot eindscherm, in drie onafhankelijke runs, zonder blokkade, zonder console-fouten en zonder netwerkafhankelijkheid.
- De scoreformules houden aantoonbaar stand tegen sjoemelen: alles aanvinken = 0/25, overal hetzelfde antwoord = 0/25, één losse klik = 5/25 — nooit gratis volle punten.
- Niets wordt verklapt vóór het indienen: geen zichtbaar juist antwoord, geen 'x van y goed'-teller, geen badge vooraf. Pas ná 'Controleer...' verschijnt per item uitleg, inclusief een 'gemist!'-label.
- De feedback per item is inhoudelijk sterk en geruststellend: niet alleen goed/fout maar een korte forensische uitleg.
- Voortgang overleeft een herlaad exact: dezelfde fase, dezelfde nog niet ingezonden selecties, dezelfde score — en een herlaad geeft geen extra kans.
- Dubbel indienen lukt niet: na de eerste klik verdwijnt de inzendknop uit de pagina en faalt een tweede klik.
- Een speciale reset-URL geeft een schone start in alle drie de runs.
- De verborgen-drempel-val en de harde aftrek uit andere scenario-engine-missies komen hier niet voor.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Geef het eindscherm onder de 40% een werkende uitweg (opnieuw-proberen of terug naar het overzicht) | motor | middel | Nu is de enige knop uitgeschakeld en is er geen terugknop; een leerling die zakt kan de missie niet zelf hervatten of verlaten. Raakt elke missie op deze motor. |
| 2 | Zet de opgeslagen fase niet vast op 'results' zolang de leerling niet geslaagd is (of bied bij het herstellen expliciet een verse start aan) | motor | klein | Daardoor is de doodlopende staat herlaad-bestendig: elke herlaad brengt de leerling terug op hetzelfde vastgelopen scherm. |
| 3 | Toon in de select-correct-rondes van deze missie een neutrale drempel- of hint-tekst (bijv. 'selecteer alle regels die je verdacht vindt') en overweeg een minimumaantal selecties | config | klein | Nu ontgrendelt de inzendknop al na één klik zonder enige uitleg, wat 5/25 zonder lezen mogelijk maakt en de leerling geen idee geeft van de verwachte omvang van het antwoord. |
| 4 | Geef de voortgangsbalkjes en de scorechip in de gedeelde koptekst een tekstalternatief | motor | klein | 'Ronde 2 van 4' en de lopende score zijn nu puur visueel; niet nagemeten in deze runs maar wel als motorbevinding gerapporteerd. |
| 5 | Meet deze missie alsnog op tablet/mobiel zodra Playwright weer aan mag | motor | klein | Alle drie de runs draaiden op 1280px; touchgedrag, klikdoelen en de leesbaarheid van de logregels op een smal scherm zijn ongemeten. |

### Nog onzeker
- mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus); er is geen iPad-run, dus over touchbediening, klikdoelen en leesbaarheid op een smal scherm is geen uitspraak te doen.
- Contrast van kleine tekst (10-11px) is in geen van de runs gemeten; blijft een bekende blinde vlek uit de motorreview.
- Een echte race-conditie bij zeer snel dubbel indienen is niet sluitend uitgesloten: de dubbelklik faalde alleen omdat de knop na de eerste klik uit de pagina verdween.
- Of de netwerkvraag voor een gemiddelde leerjaar-3-leerling zonder voorkennis te zwaar is, blijft onbeslist — de worstelaar kwam er in deze run wel uit.
- De toegankelijkheidsbevinding over de voortgangsbalkjes en de scorechip komt uit de motorreview en is in deze drie speelsessies niet nagemeten.
- Gedrag bij opslag die naar een onbekende ronde verwijst is niet getest.
