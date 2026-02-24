---

# Adviesrapport: Functionaris voor Gegevensbescherming (FG/DPO) voor DGSkills.app

**Datum:** 23 februari 2026
**Onderwerp:** Analyse FG-verplichting en aanbevelingen voor DGSkills.app
**Status:** Conceptadvies - geen juridisch advies, raadpleeg een privacyjurist voor definitieve beoordeling

---

## A. Analyse: Is een FG verplicht voor DGSkills?

### A.1 Juridisch kader

Artikel 37 AVG bepaalt dat een Functionaris voor Gegevensbescherming (FG) verplicht moet worden aangesteld in drie situaties. **Belangrijk: deze verplichting geldt zowel voor verwerkingsverantwoordelijken als voor verwerkers, onafhankelijk van elkaar.** DGSkills is een **verwerker** (de school is verwerkingsverantwoordelijke, conform `AVG-01` in de [legal-matrix.md](/Users/yorinvonder/Downloads/ai-lab---future-architect/business/nl-vo/compliance/legal-matrix.md)).

### A.2 Toetsing per criterium

#### Criterium 1: Overheidsinstantie of publiek orgaan (Art. 37 lid 1 sub a)

| Vraag | Antwoord |
|---|---|
| Is DGSkills een overheidsinstantie? | **Nee** |
| Is DGSkills een publiekrechtelijk orgaan? | **Nee** - het is een eenmanszaak (toekomstig BV) |

**Conclusie criterium 1: NIET VAN TOEPASSING.**

Ter vergelijking: scholen zelf zijn wel (vrijwel altijd) verplicht een FG aan te stellen, omdat openbare scholen kwalificeren als publiekrechtelijke instellingen en bijzonderscholen als aanbestedende diensten ([ICTrecht](https://www.ictrecht.nl/blog/de-functionaris-gegevensbescherming-verplicht-voor-scholen)). Maar deze verplichting voor de school staat los van de verplichting voor DGSkills als verwerker.

#### Criterium 2: Grootschalige, stelselmatige monitoring (Art. 37 lid 1 sub b)

De kernvraag: bestaan de **kernactiviteiten** van DGSkills uit verwerkingen die vanwege hun aard, omvang en/of doeleinden **regelmatige en stelselmatige observatie op grote schaal** van betrokkenen vereisen?

| Factor | Analyse DGSkills |
|---|---|
| **Kernactiviteit** | Ja - DGSkills is een leerplatform. Het verzamelen en verwerken van leerlinggegevens (voortgang, AI-interacties, prestaties) IS de kernactiviteit, niet een bijactiviteit. |
| **Stelselmatig** | Ja - het platform monitort continu leerlinggedrag: welke missies worden gedaan, hoe lang, welke AI-interacties, voortgangsscores. Dit is structureel en systematisch. |
| **Regelmatig** | Ja - bij elk gebruik van het platform worden gegevens verzameld. Dit is doorlopend gedurende het schooljaar. |
| **Observatie van personen** | Ja - het platform volgt individuele leerlingen en hun leergedrag. |
| **Grote schaal** | **Dit is het cruciale punt** - zie hieronder. |

**Schaalanalyse per fase:**

| Fase | Aantal leerlingen | Beoordeling "groot" |
|---|---|---|
| Pilot (nu) | 60-150 leerlingen | Nee - vergelijkbaar met een individuele huisarts |
| Pakket Start (1 school) | max 250 leerlingen | Nee - nog steeds beperkt |
| Pakket School (1 locatie) | 250-1400+ leerlingen | Grensgebied |
| Meerdere scholen (5-10) | 2.500-14.000 leerlingen | Ja - vergelijkbaar met grootschalige verwerking |
| Bestuursdeals (10+ scholen) | 10.000+ leerlingen | Onmiskenbaar grootschalig |

De Autoriteit Persoonsgegevens heeft in de zorgsector een drempel van 10.000 betrokkenen gehanteerd ([Nysingh](https://www.nysingh.nl/blog/alert-autoriteit-persoonsgegevens-legt-grootschalige-gegevensverwerking-uit/)). De Artikel 29-werkgroep noemt vier factoren: (1) aantal betrokkenen, (2) hoeveelheid/variatie data, (3) duur/permanentie, en (4) geografische spreiding. Hoewel DGSkills in de pilotfase geen grote aantallen verwerkt, is de **intentie en het businessmodel** gericht op opschaling naar duizenden leerlingen.

**Conclusie criterium 2:**
- **Pilotfase/Start:** Waarschijnlijk nog NIET grootschalig genoeg om de verplichting te triggeren.
- **Bij opschaling (meerdere scholen, >2.500 leerlingen):** De verplichting wordt WEL van toepassing. De stelselmatige monitoring via het platform in combinatie met de schaal maakt dit onvermijdelijk.

#### Criterium 3: Grootschalige verwerking bijzondere categorieen (Art. 37 lid 1 sub c)

| Vraag | Antwoord |
|---|---|
| Verwerkt DGSkills bijzondere persoonsgegevens (Art. 9 AVG)? | **In principe nee** - het platform verwerkt leerresultaten, gebruiksgegevens en AI-interacties. Dit zijn geen bijzondere categorieen (ras, gezondheid, religie, etc.). |
| Kunnen er indirect bijzondere gegevens in terechtkomen? | **Mogelijk** - als leerlingen in AI-chats medische of persoonlijke informatie delen, kunnen er incidenteel bijzondere gegevens voorkomen. Dit is echter niet de kernactiviteit. |
| Strafrechtelijke gegevens? | **Nee** |

**Conclusie criterium 3: NIET VAN TOEPASSING** (tenzij het platform bewust bijzondere categorieen gaat verwerken).

### A.3 Aanvullende overwegingen

#### EU AI Act - Hoog Risico classificatie

DGSkills valt onder **Annex III, punt 3(b)** van de EU AI Act als hoog-risico AI-systeem in het onderwijs ([AI Act Art. 26](https://artificialintelligenceact.eu/article/26/)). Dit brengt extra verplichtingen met zich mee:
- DPIA vereist (Art. 35 AVG, versterkt door Art. 26 AI Act)
- Menselijk toezicht (human-in-the-loop)
- Uitgebreide documentatie en transparantie
- Conformiteitsbeoordeling

De AI Act verplicht niet direct tot het aanstellen van een FG, maar de complexiteit van compliance maakt privacy-expertise **feitelijk onmisbaar**.

#### Privacyconvenant Onderwijs

Het [Privacyconvenant Onderwijs](https://www.privacyconvenant.nl/) verwacht van leveranciers dat zij adequaat privacybeleid voeren. Scholen die het convenant onderschrijven, zullen verwachten dat hun verwerkers een professionele privacy-governance hebben. Een FG (of vergelijkbare functie) is een sterk signaal van betrouwbaarheid.

#### EDPB/AP aanbeveling bij twijfel

Zowel de European Data Protection Board als de Autoriteit Persoonsgegevens adviseren: **bij twijfel, stel een FG aan.** Als je besluit gaan FG aan te stellen terwijl het misschien wel verplicht is, riskeer je handhaving. Als je er wel een aanstelt terwijl het niet verplicht is, loop je geen risico ([Privacy Foundation](https://privacyfoundation.nl/wat-is-een-fg-dpo-en-wanneer-is-deze-verplicht-voor-uw-organisatie/)).

### A.4 Eindconclusie analyse

| Aspect | Oordeel |
|---|---|
| **Juridisch verplicht in pilotfase?** | Waarschijnlijk **nee**, maar het is een grensgeval vanwege de aard van de kernactiviteit (stelselmatige monitoring van minderjarigen). |
| **Juridisch verplicht bij opschaling?** | **Ja**, zodra meerdere scholen zijn aangesloten en het aantal leerlingen de duizenden bereikt. |
| **Praktisch noodzakelijk?** | **Ja**, ongeacht de juridische verplichting. Scholen verwachten het, de AI Act-classificatie vereist expertise, en de AP raadt het aan bij twijfel. |
| **Risico zonder FG?** | **Hoog** - verlies van vertrouwen bij scholen, mogelijke handhaving door AP, niet-naleving van het privacyconvenant, onvoldoende expertise voor DPIA en AI Act-compliance. |

**Advies: Stel vanaf het begin een FG aan, ook al is het juridisch mogelijk nog niet strikt verplicht.**

---

## B. Aanbeveling: Wat moet DGSkills doen?

### Optie 1: Interne FG

| Aspect | Beoordeling |
|---|---|
| **Beschrijving** | Een medewerker van DGSkills wordt formeel aangesteld als FG en geregistreerd bij de AP. |
| **Voordelen** | Altijd beschikbaar, kent de organisatie van binnenuit, goedkoper op lange termijn bij grote organisaties. |
| **Nadelen** | Vereist gecertificeerde expertise in privacyrecht (die de oprichter niet heeft). Ontslagbescherming voor interne FG. Onafhankelijkheidsvereiste is lastig bij een eenmanszaak/kleine BV (je kunt niet je eigen toezichthouder zijn). Opleidingskosten: EUR 2.000-5.000 voor een FG-opleiding. |
| **Kosten** | Opleiding: EUR 2.000-5.000 eenmalig + doorlopende bijscholing. Salaris: EUR 4.000-7.000/maand bij fulltime (niet realistisch voor een startup). |
| **Geschikt voor DGSkills?** | **Nee** - de oprichter kan niet zelf FG zijn (belangenverstrengeling bij eenmanszaak), er zijn geen andere medewerkers, en de kosten zijn prohibitief. |

### Optie 2: Externe FG-als-dienst (DPO-as-a-Service)

| Aspect | Beoordeling |
|---|---|
| **Beschrijving** | Een externe partij wordt formeel aangesteld als FG via een dienstverleningsovereenkomst. De externe FG wordt geregistreerd bij de AP. |
| **Voordelen** | Professionele expertise zonder vast dienstverband. Gegarandeerde onafhankelijkheid (geen interne politiek). Schaalbaar: begint klein, groeit mee. Geen ontslagbescherming nodig. Toegang tot een team van specialisten. Sterk signaal naar scholen. |
| **Nadelen** | Minder direct beschikbaar dan een interne FG. Externe partij moet de organisatie leren kennen. Doorlopende kosten. |
| **Kosten** | Vanaf circa EUR 275-550/maand voor kleine organisaties, oplopend tot EUR 1.000-2.000/maand bij groei. Zie sectie C voor concrete aanbieders. |
| **Geschikt voor DGSkills?** | **Ja - dit is de aanbevolen optie.** |

### Optie 3: Privacy Officer (PO) zonder formele FG-status

| Aspect | Beoordeling |
|---|---|
| **Beschrijving** | Een interne of externe persoon die privacybeleid ontwikkelt en implementeert, maar niet de formele FG-rol vervult en niet wordt geregistreerd bij de AP. |
| **Voordelen** | Goedkoper. Minder formele vereisten. Kan een opstap zijn naar een volledige FG. |
| **Nadelen** | Geen formele status bij de AP. Scholen kunnen een formele FG verwachten/eisen. Biedt minder bescherming bij handhaving. Een PO mag NIET dezelfde taken uitvoeren als een FG zonder formele aanstelling (dat is misleidend). **LET OP:** een PO en FG mogen niet door dezelfde persoon worden vervuld vanwege belangenverstrengeling ([IB&P](https://ib-p.nl/2022/03/functionaris-gegevensbescherming-versus-privacy-officer-wie-doet-wat/)). |
| **Kosten** | EUR 100-300/maand voor beperkte inzet. |
| **Geschikt voor DGSkills?** | **Alleen als tijdelijke tussenstap** (maximaal eerste 3 maanden), daarna overgaan op een formele externe FG. |

### Aanbeveling voor de huidige situatie

**Kies voor Optie 2: Externe FG-als-dienst**, om de volgende redenen:

1. **Juridische veiligheid:** Bij twijfel over de verplichting is aanstellen altijd veiliger dan niet aanstellen.
2. **Commercieel noodzakelijk:** Scholen verwachten een FG bij hun verwerkers. Zonder FG wordt het afsluiten van verwerkersovereenkomsten moeilijker.
3. **AI Act compliance:** De hoog-risico classificatie vereist privacy-expertise die je als niet-jurist niet zelf kunt leveren.
4. **Betaalbaar:** Vanaf circa EUR 275/maand is dit haalbaar, zelfs voor een startup.
5. **Oprichter kan het niet zelf:** De AVG verbiedt belangenverstrengeling. Als enig persoon in de onderneming kun je niet je eigen toezichthouder zijn.

---

## C. Concrete aanbieders en kosten

### C.1 Overzicht FG-als-dienst aanbieders in Nederland

| Aanbieder | Focus/Specialisme | Indicatieve kosten | Website |
|---|---|---|---|
| **AVG Juristen** | MKB, overheid, zorg | Vanaf ~EUR 275/maand (t/m 35 FTE, 3 dgn/jaar). Uurtarief EUR 139 ex BTW | [avgjuristen.nl](https://avgjuristen.nl/wat-kost-een-functionaris-gegevensbescherming/) |
| **DPO Centre** | Breed, 850+ klanten, internationaal | Op aanvraag - primaire + secundaire FG toegewezen | [dpocentre.nl](https://www.dpocentre.nl/diensten/uitbestede-fg-diensten/) |
| **DPO Consultancy** | Privacy governance, GDPR compliance | Vast maandelijks tarief, afhankelijk van complexiteit | [dpoconsultancy.com](https://www.dpoconsultancy.com/dpo-as-a-service/) |
| **Considerati** | Tech, digitale zaken, Amsterdam | Part-time of fulltime DPO-as-a-Service | [considerati.com](https://www.considerati.com/services/legal/dpo-as-a-service.html) |
| **CPRM** | Cybersecurity & privacy, risicomanagement | Vast tarief per uur/dag/maand | [cprm.nl](https://www.cprm.nl/diensten/dpo-as-a-service) |
| **PrivacyNed** | MKB, DPO-as-a-Service | Op aanvraag | [privacyned.nl](https://www.privacyned.nl/onze-diensten/dpo-as-a-service) |
| **Privacy Direct** | FG/DPO-as-a-Service | Op aanvraag | [privacydirect.nl](https://privacydirect.nl/oplossingen/dpo-fg-services/) |
| **PCI Nederland** | ICT, compliance | Op aanvraag | [pci.nl](https://www.pci.nl/oplossing/fg-as-a-service/) |
| **FG Online** | Uitgebreide FG-dienst | EUR 1.999/maand (all-inclusive) | [fgonline.nl](https://www.fgonline.nl/) |
| **Privacy Helder** | Externe FG, MKB-gericht | Op aanvraag | [privacyhelder.nl](https://privacyhelder.nl/diensten/externe-functionaris-gegevensbescherming/) |
| **De Privacy Experts** | Externe FG, diverse sectoren | Op aanvraag | [deprivacyexperts.nl](https://deprivacyexperts.nl/externe-functionaris-gegevensbescherming-fg-nodig/) |
| **T-IP Legal** | DPO-as-a-Service, juridisch | Op aanvraag | [t-iplegal.nl](https://t-iplegal.nl/rechtsgebieden/privacy-recht/dpo-as-a-service/) |

### C.2 Budget-indicatie voor DGSkills (startfase)

| Scenario | Geschatte maandkosten | Jaarkosten | Toelichting |
|---|---|---|---|
| **Minimaal** (pilot, 1-2 scholen) | EUR 275-400/maand | EUR 3.300-4.800/jaar | Beperkte inzet, ~3 dagen/jaar + beschikbaarheid voor vragen |
| **Basis** (5-10 scholen, groei) | EUR 500-750/maand | EUR 6.000-9.000/jaar | ~6 dagen/jaar + DPIA-ondersteuning, verwerkersovereenkomsten |
| **Uitgebreid** (10+ scholen, bestuursdeals) | EUR 1.000-2.000/maand | EUR 12.000-24.000/jaar | ~12-18 dagen/jaar + volledige AI Act-ondersteuning |

### C.3 Specifieke aanbeveling voor DGSkills

**Eerste keuze: AVG Juristen** - vanwege:
- Laagste instaptarief (vanaf EUR 275/maand)
- Ervaring met overheid en onderwijs
- Transparante prijsstructuur
- 24-maanden contractmodel past bij opstartfase

**Tweede keuze: DPO Consultancy of Considerati** - vanwege:
- Ervaring met tech-bedrijven
- Considerati is gevestigd in Amsterdam en heeft expertise in digitale zaken
- Mogelijk betere aansluiting bij EdTech/AI-context

**Aanbeveling:** Vraag bij minimaal 3 aanbieders een offerte op en leg specifiek de situatie voor: EdTech-startup, verwerker voor VO-scholen, AI Act hoog-risico classificatie, beperkt budget, groeiambitie.

---

## D. Stappen en tijdlijn

### D.1 Direct nodig (Februari-Maart 2026)

| # | Actie | Prioriteit | Toelichting |
|---|---|---|---|
| 1 | **Offertes opvragen** bij minimaal 3 FG-als-dienst aanbieders | HOOG | Specifiek vermelden: EdTech, minderjarigen, AI Act hoog-risico |
| 2 | **FG selecteren en contract tekenen** | HOOG | Kies op basis van prijs, ervaring onderwijs/tech, en beschikbaarheid |
| 3 | **FG registreren bij de AP** | HOOG | De FG moet formeel geregistreerd worden via het [AP-register](https://www.autoriteitpersoonsgegevens.nl/en/dpo-information) |
| 4 | **FG-contactgegevens publiceren** | HOOG | Op de website en in de privacyverklaring van dgskills.app |

### D.2 Eerste 3 maanden (Maart-Mei 2026)

| # | Actie | Prioriteit | Toelichting |
|---|---|---|---|
| 5 | **FG laten meekijken bij verwerkersovereenkomst** | HOOG | De model-verwerkersovereenkomst (Privacyconvenant 4.0) moet worden gereviewed door de FG |
| 6 | **FG betrekken bij DPIA** | HOOG | Verplicht onder zowel AVG (Art. 35) als AI Act. De FG adviseert over de DPIA |
| 7 | **FG laten adviseren over privacybeleid** | MIDDEL | Privacy-by-design review van het platform |
| 8 | **FG opnemen in incidentresponseplan** | MIDDEL | Bij een datalek moet de FG betrokken worden |

### D.3 Na eerste pilots (Juni-December 2026)

| # | Actie | Prioriteit | Toelichting |
|---|---|---|---|
| 9 | **Hertoetsing schaal en verplichting** | MIDDEL | Bij groei opnieuw beoordelen of de huidige FG-inzet voldoende is |
| 10 | **FG-budget opschalen bij groei** | MIDDEL | Van ~EUR 275 naar ~EUR 500-750/maand bij meer scholen |
| 11 | **FG betrekken bij AI Act-conformiteitsbeoordeling** | HOOG | Deadline AI Act verplichtingen naderen (augustus 2026 voor sommige bepalingen) |
| 12 | **Jaarlijkse FG-rapportage** | LAAG | De FG brengt jaarlijks verslag uit over de stand van de privacy |

### D.4 Visuele tijdlijn

```
Feb 2026    Mar 2026    Apr-Mei 2026    Jun-Dec 2026    2027+
   |            |            |               |             |
   v            v            v               v             v
Offertes    FG gekozen   DPIA + VWO      Opschaling    Hertoetsing
opvragen    & geregis-   review met      FG-budget     verplichting
            treerd AP    FG              bij groei     bij groei
```

---

## Samenvatting kernpunten

1. **Een FG is voor DGSkills juridisch waarschijnlijk nog niet verplicht in de pilotfase**, maar wordt het vrijwel zeker bij opschaling vanwege stelselmatige monitoring van leerlingen op grote schaal.

2. **Een FG is praktisch onmisbaar**, ongeacht de juridische verplichting, vanwege: verwachtingen van scholen, AI Act hoog-risico classificatie, DPIA-verplichting, en het advies van de AP om bij twijfel een FG aan te stellen.

3. **De oprichter kan niet zelf FG zijn** vanwege belangenverstrengeling en het ontbreken van juridische expertise.

4. **Externe FG-als-dienst is de beste optie**: professioneel, onafhankelijk, schaalbaar en betaalbaar vanaf circa EUR 275/maand.

5. **Handel nu**: vraag offertes op en stel voor de eerste pilotschool een FG aan. Dit versterkt het vertrouwen van scholen en voorkomt problemen later.

---

## Bronnen

- [Artikel 37 AVG - Privacy Regulation](https://www.privacy-regulation.eu/nl/artikel-37-aanwijzing-van-de-functionaris-voor-gegevensbescherming-EU-AVG.htm)
- [ICTrecht - FG verplicht voor scholen?](https://www.ictrecht.nl/blog/de-functionaris-gegevensbescherming-verplicht-voor-scholen)
- [Privacy Foundation - Wanneer FG verplicht](https://privacyfoundation.nl/wat-is-een-fg-dpo-en-wanneer-is-deze-verplicht-voor-uw-organisatie/)
- [Nysingh - AP legt grootschalige verwerking uit](https://www.nysingh.nl/blog/alert-autoriteit-persoonsgegevens-legt-grootschalige-gegevensverwerking-uit/)
- [Privacy Company - Wanneer FG verplicht](https://www.privacycompany.eu/nl/blog/wanneer-is-een-functionaris-voor-de-gegevensbescherming-nou-echt-verplicht)
- [AVG Juristen - Kosten FG](https://avgjuristen.nl/wat-kost-een-functionaris-gegevensbescherming/)
- [DPO Centre - Uitbestede FG-diensten](https://www.dpocentre.nl/diensten/uitbestede-fg-diensten/)
- [Kennisnet - Aanpak IBP - FG](https://aanpakibp.kennisnet.nl/functionaris-voor-gegevensbescherming/)
- [Privacyconvenant Onderwijs](https://www.privacyconvenant.nl/)
- [IB&P - FG versus Privacy Officer](https://ib-p.nl/2022/03/functionaris-gegevensbescherming-versus-privacy-officer-wie-doet-wat/)
- [AP - FG-informatie](https://www.autoriteitpersoonsgegevens.nl/en/dpo-information)
- [EU AI Act - Article 26 Deployer Obligations](https://artificialintelligenceact.eu/article/26/)
- [EU AI Act - Annex III High-Risk Systems](https://artificialintelligenceact.eu/annex/3/)

---

**Disclaimer:** Dit rapport is opgesteld op basis van publiek beschikbare informatie en vormt geen juridisch advies. Voor een definitieve beoordeling van de FG-verplichting wordt aanbevolen een gespecialiseerde privacyjurist te raadplegen. De genoemde tarieven zijn indicatief en kunnen afwijken.
