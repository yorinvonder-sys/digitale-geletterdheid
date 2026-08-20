## Opdracht Live Check: tech-impact-analyst — J3P3 (motor data-viewer)

**Advies:** fix-eerst
**Risico:** Geel
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen drie datasets analyseren over de impact van technologie op banen. Een serieuze leerling haalt 83% en een taalzwakke maar eerlijke leerling 78% — beide ruim boven de drempel. Een sjoemelaar die alleen vraagteksten herhaalt en trefwoorden plakt scoort 18% en komt niet door de 40%-grens. De grootste problemen zitten in de open-vragen-scoring (eerlijke antwoorden krijgen soms 0 punten zonder uitleg) en een doodlopend eindscherm voor wie zakt. De missie is speelbaar en eerlijke leerlingen halen de drempel, maar de scoring is onvoorspelbaar en een gezakte leerling kan niet herstarten.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 83/100 (83%) eerlijk — 'Kritisch Analist', Gehaald; gokproef 0/100 (0%) |
| Sjoemelaar | 18/100 (18%) met vraagtekst-echo + trefwoord-stuffing + eerste-optie-gok — Nog niet gehaald; aparte gokproef alleen dataset 1: 0 pts |
| Worstelaar | 78/100 (78%) eerlijk — Gehaald; gokproef 0/100 (0%) |
| iPad (Playwright) | niet gemeten |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Onder de 40% is het eindscherm een permanente doodlopende weg: de enige knop is uitgeschakeld, er is geen terugknop, en herladen brengt hetzelfde dode scherm terug. _Bewijs: 3 runs tonen disabled=true op de enige knop, reload identiek; geen onRetry in de motorcode_
2. **MAJOR** · motor · bevestigd — Open vragen geven ongeveer de helft van de punten voor nul inhoudelijke moeite: vraagtekst letterlijk terugplakken en losse trefwoorden scoorden consequent 5/10, 5/10 en 8/15. _Bewijs: cheat-run toont 3 vragen, 2 trucs, telkens 'Goed begin — +N van M punten'_
3. **MAJOR** · missie · bevestigd — De open-vraag-scoring is voor eerlijke leerlingen onvoorspelbaar: een inhoudelijk correct antwoord van 17 woorden kreeg 0/10 met alleen 'Dit telt nog niet mee' zonder uitleg, omdat geen van de 5 sleutelwoorden erin voorkwam. _Bewijs: correct antwoord 0/10 vs vraagwoord-herhalende antwoorden 5/10 en 8/15_
4. **MAJOR** · motor · bevestigd — Meerkeuze wordt nooit gehusseld en in deze config staat het juiste antwoord bij alle 3 vragen op positie 2 of 3 — 'nooit de buitenste twee' halveert het gokwerk. _Bewijs: alle 3 gespeelde MC-vragen hebben het juiste antwoord op de 2e/2e/3e positie_
5. **MINOR** · motor · bevestigd — De vaste hint 'Sorteer of filter om antwoorden te vinden' staat ook boven dataset 3, die geen tabel maar vier tekstkaarten heeft — zinloos voor wie erop vertrouwt. _Bewijs: hint verschijnt boven tekstkaarten zonder tabel_
6. **MINOR** · missie · bevestigd — Dataset 3 bevat dichte tekstkaarten met moeilijke woorden als 'objectief' en 'doemdenken' — een leesrisico voor taalzwakke leerlingen, maar kleiner dan gemeld omdat de config lastige begrippen deels zelf uitlegt. _Bewijs: tekstkaarten geciteerd; glos en definitie aanwezig in de config_
7. **MAJOR** · motor · onbevestigd — Bekende motorbevinding over een welzijnsmonitor die bevestigen kan blokkeren is op deze missie NIET waargenomen: geen van de gespeelde antwoorden triggerde de monitor. _Bewijs: code-bewijs op motorniveau, niet runtime bevestigd op deze missie_

### Wat goed werkte
- Ontaarde invoer ('aaaa aaaa...' herhaald) scoort betrouwbaar 0 punten met een duidelijke melding — de eerdere reparatie houdt stand.
- Geen antwoord-lekkage: het juiste antwoord verschijnt pas ná bevestigen, en foute antwoorden scoren scherp 0.
- Herladen midden in de missie herstelt exact dezelfde staat; dubbelklikken telt punten niet dubbel.
- Volledig client-side: geen console-fouten, geen netwerkfouten, geen chat-afhankelijkheid — de missie blijft speelbaar zonder extra servers.
- Eerlijke doorloop werkt voor beide profielen: baseline 83% en taalzwakke worstelaar 78%.
- De motorvoorspelling 'vraagtekst-echo geeft volle punten' bleek te sterk: echo gaf maar ~50% van de open-vraagpunten.
- Config legt moeilijke begrippen deels zelf uit: 'impact-analisten' en 'structurele werkloosheid' worden gedefinieerd.

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Herkansingsroute op het eindscherm onder 40%: geef onRetry mee én wis de opslag bij zakken | motor | klein | Harde blocker, 3x bevestigd: een gezakte leerling kan de missie nu nooit meer afronden of herstarten |
| 2 | Open-vraag-scoring: vraagtekst-echo en losse-trefwoord-stuffing naar 0 punten in plaats van de halve-punten-terugval | motor | middel | Nul-inspanning levert nu structureel ~50% van elke open vraag op; op andere configs is het lek mogelijk nog groter |
| 3 | Feedback bij 0 punten op een open vraag laten benoemen wát er ontbrak in plaats van alleen 'Dit telt nog niet mee' | motor | klein | Een eerlijk correct antwoord kreeg 0/10 zonder enige aanwijzing — verwarrend en demotiverend |
| 4 | Keywordlijsten van de 3 open vragen verbreden met voor de hand liggende synoniemen | config | klein | De smalle lijst laat een inhoudelijk correct antwoord op 0 vallen terwijl vraagwoord-herhaling deelpunten krijgt |
| 5 | MC-antwoordposities in deze config herverdelen, of beter: shuffle op motorniveau | config | klein | Onderdeel van het motorbrede patroon dat gokken over missies heen leerbaar maakt |
| 6 | De hint 'Sorteer of filter om antwoorden te vinden' alleen tonen bij datasets met een tabel | motor | klein | Boven dataset 3 (tekstkaarten) is de hint zinloos en misleidend |

### Nog onzeker
- Mobiel/tablet niet gemeten — Playwright is op verzoek van Yorin uitgeschakeld (venster stal focus).
- Welzijnsmonitor-stilblokkade (motorbevinding) is op deze missie niet runtime getriggerd — onbevestigd op missieniveau.
- De zuivere gokproef van de cheater-run is niet t/m het eindscherm doorgezet (alleen dataset 1, 0 punten); de andere gokproeven zijn wél volledig (beide 0/100).
- De gevoeligheid van de topic-overlap-scoring voor toevallige woordkeuze berust op 3 datapunten — geen harde meting over meerdere formuleringen.
- Het theoretische randgeval waarin midden-positie-gokken plus echo alsnog de 40% haalt (~max 58%) is niet gemeten.
- Screenshot/scroll-tools faalden in de struggler-run herhaaldelijk; genavigeerd via een workaround — geen invloed op scoringsbevindingen geclaimd.
