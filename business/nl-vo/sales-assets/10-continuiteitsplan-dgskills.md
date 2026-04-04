# Continuïteitsplan — DGSkills

**Versie:** 1.0
**Datum:** April 2026
**Opgesteld door:** Yorin von der Heiden, oprichter DGSkills.app

---

> Dit document is bedoeld voor schoolbesturen en ICT-coördinatoren die willen begrijpen wat er met hun data, leerlingvoortgang en platformtoegang gebeurt als DGSkills als organisatie verandert of stopt.

---

## 1. Bedrijfsprofiel

| Gegeven | Waarde |
|---|---|
| Handelsnaam | DGSkills.app |
| Rechtsvorm | Eenmanszaak |
| KvK-nummer | 81819889 |
| Oprichter | Yorin von der Heiden |
| Vestiging | Nederland |
| Werkgebied | Voortgezet onderwijs, landelijk |

DGSkills is op dit moment een eenmanszaak. Dat is een bewuste keuze voor de startfase: het houdt overhead laag en beslissingen snel. Maar het roept terechte vragen op bij schoolbesturen die een meerjarige samenwerking overwegen.

De oprichter is zelf VO-docent en gebruikt het platform in eigen klassen. Dat betekent een directe terugkoppeling vanuit de onderwijspraktijk — maar ook dat de persoonlijke en professionele belangen nauw verweven zijn met het voortbestaan van het platform. DGSkills is geen bijproject: het is waar de oprichter elke week in de klas mee werkt.

Dit document beschrijft concreet hoe continuïteit is gewaarborgd op technisch, juridisch en organisatorisch niveau — en wat de procedure is als het onverhoopt toch misgaat.

---

## 2. Technische architectuur en continuïteit

Het platform is bewust gebouwd op gestandaardiseerde, beheerde infrastructuur van grote cloudproviders. Er is geen sprake van zelfgebouwde servers, propriëtaire dataformaten of afhankelijkheid van specifieke personen op infrastructuurniveau.

### 2.1 Frontend — Vercel

- Enterprise-grade CDN met wereldwijde distributie
- Automatische schaling bij piekbelasting (bijv. simultaan gebruik door een hele school)
- Geen afhankelijkheid van handmatige serverbeheertaken
- Historische uptime: boven de 99,9%

### 2.2 Database en authenticatie — Supabase

- Managed PostgreSQL: geen handmatig databasebeheer vereist
- Automatische dagelijkse back-ups met point-in-time recovery (herstel tot op de minuut)
- Supabase is een internationaal gebruikte dienst met eigen SLA — los van DGSkills als organisatie
- Authenticatie, gebruikersbeheer en toegangscontrole (RLS) zijn ingebakken in de databaselaag

### 2.3 AI-functionaliteit — Google Vertex AI

- Enterprise-infrastructuur van Google Cloud
- Regio: `europe-west4` (datacenter in Nederland/West-Europa)
- Geen afhankelijkheid van een enkele API-sleutel die bij één persoon ligt — credentials worden beheerd als Supabase-secrets, los van persoonlijke accounts

### 2.4 Data residency

Alle leerlingdata wordt opgeslagen en verwerkt in `europe-west4` (Nederland). Er verlaat geen data de Europese Unie. Dit is conform de AVG en de eisen van de meeste schoolbesturen.

### 2.5 Codebase

- Volledige versiebeheer via Git
- Standaard open-source technologiestack: React, TypeScript, PostgreSQL, Tailwind CSS
- Geen propriëtaire frameworks of lock-in naar specifieke tooling
- De code is gedocumenteerd en onderhoudbaar door iedere gekwalificeerde React/TypeScript-ontwikkelaar
- Bij beëindiging of overdracht is de code beschikbaar voor een opvolgende partij of interne ICT-afdeling

**Conclusie:** de technische infrastructuur heeft geen enkelvoudig storings- of faalpoint dat afhankelijk is van de persoon van de oprichter.

---

## 3. Data-eigendom en portabiliteit

Schooldata is en blijft eigendom van de school. DGSkills treedt op als verwerker, niet als eigenaar.

### 3.1 Verwerkersovereenkomst

Een verwerkersovereenkomst conform Model 4.0 is beschikbaar en wordt gesloten voor alle contracten. De school is de verwerkingsverantwoordelijke; DGSkills is de verwerker.

### 3.2 Data-export

- Leerlingvoortgang, SLO-koppelingen en rapportages zijn exporteerbaar via het docentendashboard (CSV- en Excel-formaat)
- Export is altijd beschikbaar — niet afhankelijk van contractstatus
- Bij contractbeëindiging: volledige data-export binnen **30 kalenderdagen** na verzoek

### 3.3 Data-verwijdering

Na bevestiging van de export worden alle persoonsgegevens van de school verwijderd conform de AVG. De school ontvangt een schriftelijke bevestiging van verwijdering.

### 3.4 SLO-voortgang blijft bij de school

Alle gegenereerde voortgangsrapportages en SLO-koppelingen die de school heeft gedownload of geëxporteerd, blijven permanent beschikbaar bij de school — ongeacht wat er met DGSkills als platform gebeurt.

---

## 4. Code-escrow (optioneel bij meerjarencontracten)

Voor contracten van **24 maanden of langer** biedt DGSkills de mogelijkheid tot code-escrow via een onafhankelijke derde partij (notaris of TTP — Trusted Third Party).

### Wat houdt dit in?

De broncode, het databaseschema en de deployment-instructies worden gedeponeerd bij een onafhankelijke bewaarder. De school krijgt toegang tot deze gedeponeerde code als een van de volgende situaties zich voordoet:

1. DGSkills gaat failliet of wordt ontbonden
2. Het platform is langer dan 30 kalenderdagen niet beschikbaar zonder communicatie vanuit DGSkills
3. De contractuele verplichtingen worden structureel niet nagekomen

### Wat krijgt de school?

- Volledige broncode (frontend + backend)
- Databaseschema inclusief migratiehistorie
- Deployment-instructies voor Vercel en Supabase
- Documentatie van de AI-integratie

Met deze bestanden kan de school zelf een ontwikkelaar inschakelen om het platform op eigen infrastructuur te blijven draaien. De code is geschreven in standaard open-source technologie — geen specialistische kennis van DGSkills als organisatie vereist.

> Code-escrow is een optie, geen standaard. Scholen die dit willen, kunnen dit opnemen als aanvullende clausule in het contract. De kosten voor escrow-dienstverlening worden doorberekend aan de school.

---

## 5. Groeiplan en organisatieontwikkeling

DGSkills is eerlijk over waar het nu staat en waar het naartoe werkt.

### Huidige fase (2026)

- Solo-oprichter: alle ontwikkeling, support en klantcontact via één persoon
- Dit maakt snelle beslissingen en directe communicatie mogelijk, maar heeft ook beperkingen in beschikbaarheid
- De oprichter is werkzaam als VO-docent naast het platform — dit is tegelijk een kracht (praktijkkennis, directe test-omgeving) en een spanningsveld (tijdsinvestering)

### Korte termijn (2026)

- Pilotscholen genereren de eerste inkomsten
- Doel: eerste deeltijdse medewerker aannemen voor support en/of ontwikkeling voor eind 2026
- Hiermee wordt de afhankelijkheid van één persoon voor dagelijkse operaties verminderd

### Middellange termijn (2027)

- Omzetting van eenmanszaak naar BV (besloten vennootschap)
- Formeel team, verdeling van verantwoordelijkheden
- Structurele governance die niet afhankelijk is van de beschikbaarheid van de oprichter

### Ambitie

DGSkills is geen lifestyle-project. Het doel is een duurzaam edtech-bedrijf te bouwen dat structureel bijdraagt aan digitale geletterdheid in het Nederlandse onderwijs. De pilot-fase is de basis — geen eindpunt.

---

## 6. Uitwijkscenario: wat als DGSkills stopt?

Dit is de vraag die schoolbesturen terecht stellen. Hieronder de concrete procedure.

### Stap 1 — Aankondiging

DGSkills kondigt beëindiging van dienstverlening minimaal **6 maanden van tevoren** aan, tenzij overmacht (overlijden, acute gezondheidscrisis, faillissement) dit onmogelijk maakt. Bij overmacht geldt onmiddellijke schriftelijke kennisgeving.

### Stap 2 — Data-export

Binnen **30 kalenderdagen** na aankondiging wordt een volledige data-export aangeboden:
- Alle leerlingvoortgang per missie en SLO-koppeling
- Alle gegenereerde rapportages
- Accountinformatie en gebruikersdata

### Stap 3 — Platformbeschikbaarheid

Het platform blijft minimaal **90 dagen** na aankondiging toegankelijk, zodat lopende lessen en cohorten afgerond kunnen worden.

### Stap 4 — Compliance-documentatie

Alle compliance-documenten (DPIA, verwerkersovereenkomst, privacyverklaring, verwerkingsregister) blijven geldig voor archivering en verantwoording richting de Autoriteit Persoonsgegevens — ongeacht of DGSkills nog actief is.

### Stap 5 — Permanente retentie door school

De school behoudt permanent:
- Alle gedownloade en geëxporteerde rapportages
- SLO-voortgangsoverzichten
- Gegenereerde compliance-documentatie

### Stap 6 — Migratiehulp

DGSkills stelt documentatie beschikbaar voor de overgang naar een alternatief platform, inclusief een overzicht van de datastructuur zodat import elders mogelijk is.

---

## 7. SLA-garanties

De onderstaande garanties zijn afhankelijk van het gekozen pakket. Zie ook `01-offer-packages-and-sla.md` voor het volledige pakketoverzicht.

| Prioriteit | Definitie | Pakket 1 (Start) | Pakket 2 (School) | Pakket 3 (Bestuur) |
|---|---|---|---|---|
| P1 | Platform volledig niet bruikbaar | 8 werkuren | 4 werkuren | 2 werkuren |
| P2 | Ernstige functiebeperking | 1 werkdag | 8 werkuren | 6 werkuren |
| P3 | Vragen en wensen | 3 werkdagen | 2 werkdagen | 1 werkdag |

**Beschikbaarheidsdoel:** 99,5% uptime per kalendermaand, exclusief geplande onderhoudsmomenten.

**Gepland onderhoud:** altijd buiten schooltijden (voor 07:30 of na 18:00), met minimaal 48 uur voorafgaande kennisgeving via e-mail aan de schoolcontactpersoon.

**Incidentcommunicatie:** via statuspagina en directe e-mail aan het geregistreerde schoolcontact. Bij P1-incidenten wordt proactief gecommuniceerd over status en verwachte hersteltijd.

---

## 8. Verzekeringen en aansprakelijkheid

| Onderwerp | Status |
|---|---|
| Verwerkersovereenkomst | Aanwezig, conform Model 4.0 |
| DPIA | Uitgevoerd en beschikbaar op verzoek |
| Privacyverklaring | Gepubliceerd op dgskills.app |
| Beroepsaansprakelijkheidsverzekering | **Nog niet afgesloten** — in aanvraag |
| Bedrijfsaansprakelijkheidsverzekering | In aanvraag |

### Toelichting verzekeringen

DGSkills beschikt op dit moment nog niet over een beroepsaansprakelijkheidsverzekering. Dit is een bekend open punt dat actief wordt opgepakt. Voor scholen die dit als harde voorwaarde stellen voor contractsluiting is dit een relevant gegeven.

De verwachting is dat de verzekering voor de zomer van 2026 is afgesloten. Dit document wordt bijgewerkt zodra dit is geregeld.

De afwezigheid van een verzekering betekent niet dat er geen aansprakelijkheid bestaat — de wettelijke aansprakelijkheid van de oprichter als eenmanszaak is onbeperkt. Het betekent dat er (nog) geen verzekeraar is die uitkeert bij een claim.

---

## 9. Contact en escalatie

| Kanaal | Gebruik |
|---|---|
| Platform-support | Eerste lijn voor vragen en meldingen |
| E-mail oprichter | Escalaties, contractvragen, compliance |
| KvK-registratie | Openbaar verifieerbaar via kvk.nl (KvK 81819889) |

Voor contractgerelateerde vragen, verwerkersovereenkomsten of compliance-verzoeken: direct contact met de oprichter. Er is geen tussenlaag — dat is zowel een voordeel (directe lijn) als een punt om rekening mee te houden bij de risicobeoordeling.

---

## 10. Samenvatting voor het schoolbestuur

| Risico | Mitigatie |
|---|---|
| Oprichter stopt | Technische infrastructuur draait door; data-export altijd beschikbaar |
| Platformuitval | Managed cloud-infra (Vercel, Supabase) met eigen SLA's; geen zelfgebouwde servers |
| Dataverlies | Dagelijkse back-ups met point-in-time recovery; exportfunctie beschikbaar |
| Data-eigendom | School is verwerkingsverantwoordelijke; data blijft eigendom van de school |
| Lock-in | Open-source stack; code overdraagbaar aan elke React/TypeScript-ontwikkelaar |
| Geen verzekering | Open issue; in aanvraag; wettelijke aansprakelijkheid oprichter is onbeperkt |
| Solo-bedrijf | Bewuste groeistrategie richting BV en team in 2027; pilotinkomsten financieren eerste hire |

DGSkills is een jong bedrijf in een vroege fase. Dit plan beschrijft eerlijk wat de risico's zijn en hoe ze worden gemitigeerd — nu en in de komende twee jaar. Scholen die twijfelen over de risico's van een eenmanszaak kunnen aanvullende afspraken maken over code-escrow, kortere contractduur of tussentijdse evaluatiemomenten.

---

*Versie 1.0 — April 2026. Dit document wordt bijgewerkt bij significante organisatorische wijzigingen (verzekeringsstatus, rechtsvorm, team).*
