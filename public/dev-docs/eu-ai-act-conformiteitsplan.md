# CONFORMITEITSBEOORDELINGSPLAN EU AI ACT
## DGSkills.app -- AI-Educatieplatform voor het Nederlands Voortgezet Onderwijs

**Datum:** 23 februari 2026
**Deadline hoog-risico verplichtingen:** 2 augustus 2026 (159 dagen)
**Opgesteld op basis van:** Verordening (EU) 2024/1689 (EU AI Act)

---

## A. CLASSIFICATIE-ANALYSE

### A.1 Waarom DGSkills hoog-risico is

DGSkills valt onder **Annex III, punt 3(b)** van de EU AI Act:

> *"AI-systemen die bedoeld zijn om te worden gebruikt voor de evaluatie van leerresultaten, ook wanneer die resultaten worden gebruikt om het leerproces van natuurlijke personen in onderwijs- en beroepsopleidingsinstellingen op alle niveaus te sturen."*

**Onderbouwing -- 5 concrete redenen:**

1. **STEP_COMPLETE markers:** De AI-agents genereren `---STEP_COMPLETE:X---` markers die automatisch leerlingvoortgang registreren in de database. Dit is een directe evaluatie van leerresultaten door AI (zie `/Users/yorinvonder/Downloads/ai-lab---future-architect/config/agents.tsx`, regels 63-80).

2. **XP-toekenning en level-progressie:** Het voltooien van stappen leidt tot XP-punten en level-voortgang, wat het leerproces stuurt. Leerlingen zien welke missies ze wel/niet hebben afgerond op basis van AI-beoordeling.

3. **30+ AI-agents die antwoorden evalueren:** Elke agent beoordeelt of een leerling een stap succesvol heeft voltooid. Dit is geen vrijblijvende chatbot maar een beoordelingssysteem.

4. **Impact op het leerproces:** De voortgangsregistratie wordt zichtbaar voor docenten en leerlingen, wat invloed heeft op welke content als "voltooid" wordt beschouwd.

5. **Doelgroep minderjarigen:** Het systeem is expliciet gericht op leerlingen van 12-18 jaar, wat een kwetsbare groep is waarvoor Art. 9(9) expliciete aandacht eist.

### A.2 Toepasselijke artikelen

| Artikel | Onderwerp | Toepassing op DGSkills |
|---------|-----------|----------------------|
| Art. 6(2) + Annex III 3(b) | Classificatie als hoog-risico | Directe classificatiegrondslag |
| Art. 9 | Risicobeheerssysteem | Volledig van toepassing |
| Art. 10 | Data en datagovernance | Volledig van toepassing |
| Art. 11 + Annex IV | Technische documentatie | Volledig van toepassing |
| Art. 12 | Registratie van gegevens (logging) | Volledig van toepassing |
| Art. 13 | Transparantie en informatieverstrekking | Volledig van toepassing |
| Art. 14 | Menselijk toezicht | Volledig van toepassing |
| Art. 15 | Nauwkeurigheid, robuustheid, cyberveiligheid | Volledig van toepassing |
| Art. 16 | Verplichtingen aanbieders | DGSkills als aanbieder |
| Art. 17 | Kwaliteitsmanagementsysteem | Volledig van toepassing |
| Art. 26 | Verplichtingen gebruiksverantwoordelijken | Scholen als deployers |
| Art. 43 + Annex VI | Conformiteitsbeoordeling (intern) | Procedure van toepassing |
| Art. 47 | EU-conformiteitsverklaring | Verplicht |
| Art. 48 | CE-markering | Verplicht |
| Art. 49 + Annex VIII | Registratie EU-databank | Verplicht |
| Art. 50 | Transparantieverplichtingen | Van toepassing (ook los van hoog-risico) |
| Art. 51-55 | GPAI-model verplichtingen | Google als GPAI-aanbieder; DGSkills indirect |
| Art. 72 | Post-market monitoring | Volledig van toepassing |

### A.3 Uitzonderingen -- Geldt Art. 6(3)?

Art. 6(3) biedt een uitzondering voor Annex III-systemen die "geen significant risico vormen voor de gezondheid, veiligheid of grondrechten." **Deze uitzondering is NIET van toepassing op DGSkills** om drie redenen:

1. **Profiling-override:** Art. 6(3) laatste alinea stelt dat een AI-systeem altijd hoog-risico is wanneer het profiling van natuurlijke personen uitvoert. DGSkills bouwt leerlingprofielen op (XP, voortgang, level) op basis van AI-beoordelingen.

2. **Materieel beinvloedend:** De AI-output (STEP_COMPLETE) beinvloedt de uitkomst van het leerproces direct en is niet slechts een "voorbereidende taak."

3. **Kwetsbare groep:** Minderjarigen (12-18 jaar) worden als kwetsbare groep beschouwd, wat het risico verhoogt.

**Conclusie: DGSkills is ondubbelzinnig een hoog-risico AI-systeem. Een Art. 6(3)-uitzondering is niet verdedigbaar.**

---

## B. VERPLICHTINGEN PER ARTIKEL

### B.1 Artikel 9 -- Risicobeheerssysteem

**Wat de wet eist:**
Een continu, iteratief risicobeheerssysteem dat gedurende de gehele levenscyclus wordt onderhouden. Dit omvat:
- Identificatie en analyse van bekende en redelijkerwijs voorzienbare risico's
- Inschatting en evaluatie van risico's bij beoogd gebruik en redelijkerwijs voorzienbaar misbruik
- Evaluatie van risico's op basis van post-market monitoring data
- Passende en gerichte risicobeperkende maatregelen
- Testen om passende risicobeheersmaatregelen te waarborgen
- Speciale aandacht voor impact op personen jonger dan 18 jaar (Art. 9(9))

**Huidige status: NIET VOLDAAN**

DGSkills heeft individuele technische maatregelen (prompt injection bescherming, safety settings, welzijnsprotocol) maar geen formeel, gedocumenteerd risicobeheerssysteem.

**Concrete acties:**

| # | Actie | Geschatte tijd | Prioriteit |
|---|-------|---------------|------------|
| 9.1 | Opstellen risicoregister met alle geidentificeerde risico's per agent en functionaliteit | 2 weken | KRITIEK |
| 9.2 | Risicobeoordeling voor misbruikscenario's (XP-farming, ongeschikte content, manipulatie, datalekkage) | 1 week | KRITIEK |
| 9.3 | Documenteren bestaande maatregelen als risicobeperkend (prompt sanitizer, safety settings, welzijnsprotocol, rate limiting) | 1 week | KRITIEK |
| 9.4 | Specifieke risicobeoordeling voor minderjarigen (Art. 9(9)) | 1 week | KRITIEK |
| 9.5 | Restrisico-analyse: welke risico's blijven bestaan na maatregelen? | 3 dagen | HOOG |
| 9.6 | Procedure voor continue risico-evaluatie en bijwerking van het register | 2 dagen | HOOG |
| 9.7 | Testprotocol voor risicobeperkende maatregelen (red teaming, adversarial testing) | 1 week | HOOG |

### B.2 Artikel 10 -- Data en datagovernance

**Wat de wet eist:**
- Training, validatie en testdatasets moeten relevant, voldoende representatief en zo foutvrij mogelijk zijn
- Datagovernance- en databeheermaatregelen voor ontwerkkeuzes, dataverzameling, voorbereiding, biasdetectie en -mitigatie
- Datasets moeten de specifieke context van gebruik weerspiegelen

**Huidige status: GEDEELTELIJK VOLDAAN**

DGSkills gebruikt Google Gemini 2.0 Flash als foundation model via **Vertex AI** (Google Cloud) in regio **europe-west4 (Nederland)**. Migratie van de Gemini Developer API naar Vertex AI is **afgerond en getest in productie op 23 februari 2026**. DGSkills traint geen eigen model, maar:
- De system instructions (agents.tsx) vormen de "configuratiedata" die het gedrag sturen
- Leerlingdata wordt niet gebruikt voor modeltraining (Vertex AI: zero data retention, geen training op klantdata)
- Dataminimalisatie is geimplementeerd (geen BSN, geen adres)
- Analytics zijn geaggregeerd en consent-gated
- **Dataresidentie gegarandeerd in de EU:** data at rest en ML-verwerking in europe-west4 (Nederland)
- **Google Cloud DPA met Standard Contractual Clauses (SCCs)** van toepassing
- **Authenticatie via service account** (geen API key meer in omgeving)

**Concrete acties:**

| # | Actie | Geschatte tijd | Prioriteit |
|---|-------|---------------|------------|
| 10.1 | Documenteer datagovernancebeleid: welke data wordt verwerkt, hoe, waarvoor, door wie | 1 week | HOOG |
| 10.2 | Documenteer dat geen trainingsdata wordt gebruikt (API-only model) en verwijs naar Google's GPAI-documentatie | 3 dagen | HOOG |
| 10.3 | Biasbeoordeling: controleer of agents consistent presteren voor verschillende leerlingtypen (taalvaardigheid, leeftijdsgroep) | 1 week | HOOG |
| 10.4 | Documenteer de system instructions als "configuratiedata" en hun governance (versiebeheer, review, testing) | 3 dagen | MIDDEN |
| 10.5 | ~~Bevestig en documenteer Google Gemini EER-datalocatie of SCC-basis~~ **AFGEROND (23 feb 2026):** Migratie naar Vertex AI europe-west4 (Nederland) voltooid. Dataresidentie EU gegarandeerd. Google Cloud DPA met SCCs van toepassing. Zero data retention. | ~~3 dagen~~ | ~~HOOG~~ AFGEROND |

### B.3 Artikel 11 + Annex IV -- Technische documentatie

**Wat de wet eist:**
Technische documentatie die VOOR het op de markt brengen wordt opgesteld en actueel wordt gehouden. Annex IV specificeert de minimale inhoud:

1. Algemene beschrijving van het AI-systeem
2. Gedetailleerde beschrijving van het ontwikkelingsproces
3. Informatie over monitoring, werking en controle
4. Beschrijving van de prestatiemetrieken
5. Beschrijving van het risicobeheersysteem (Art. 9)
6. Beschrijving van wijzigingen gedurende de levenscyclus
7. Lijst van toegepaste geharmoniseerde normen
8. Kopie van de EU-conformiteitsverklaring
9. Beschrijving van het post-market monitoring systeem

**NB: Voor KMO's en startups mag de Commissie een vereenvoudigd formulier vaststellen.**

**Huidige status: NIET VOLDAAN**

Er is geen formeel technisch documentatiedossier. Wel zijn er bouwstenen aanwezig:
- De juridische rapporten beschrijven het systeem
- De code is goed gedocumenteerd
- Het agents.tsx bestand beschrijft de AI-configuratie

**Concrete acties:**

| # | Actie | Geschatte tijd | Prioriteit |
|---|-------|---------------|------------|
| 11.1 | Opstellen "Technical Documentation Dossier" conform Annex IV template | 3-4 weken | KRITIEK |
| 11.2 | Sectie 1: Systeembeschrijving (architectuur, dataflow, componenten, hardware/software) | 1 week | KRITIEK |
| 11.3 | Sectie 2: Ontwikkelproces (design specs, keuze voor Gemini Flash, system instructions design) | 1 week | KRITIEK |
| 11.4 | Sectie 3: Monitoring en controle (capabilities, limitations, accuracy, unintended outcomes) | 1 week | KRITIEK |
| 11.5 | Sectie 4: Prestatiemetrieken (hoe meten we of agents correct evalueren?) | 1 week | HOOG |
| 11.6 | Sectie 5: Risicobeheerssysteem (verwijzing naar Art. 9 documentatie) | 2 dagen | HOOG |
| 11.7 | Sectie 6: Levenscycluswijzigingen (changelog, versioning) | 2 dagen | MIDDEN |
| 11.8 | Sectie 7: Toegepaste normen (of beschrijving van alternatieve oplossingen) | 3 dagen | HOOG |
| 11.9 | Sectie 9: Post-market monitoring plan (Art. 72) | 1 week | HOOG |

### B.4 Artikel 12 -- Registratie van gegevens (logging)

**Wat de wet eist:**
- Automatische registratie van gebeurtenissen (logs) gedurende de levenscyclus
- Traceerbaarheid van de werking van het systeem
- Logging moet adequaat zijn voor het beoogde doel en in overeenstemming met Art. 9 en 61

**Huidige status: VOLDAAN**

DGSkills heeft een uitgebreid audit logging systeem geimplementeerd in `/Users/yorinvonder/Downloads/ai-lab---future-architect/services/auditService.ts`:

```typescript
// Privacy and AI interaction audit logging.
// Compliance: AVG Art. 30, EU AI Act Art. 12

export type AuditEventType =
    | 'account_created'
    | 'account_deleted'
    | 'data_exported'
    | 'processing_restricted'
    | 'consent_given'
    | 'consent_withdrawn'
    | 'data_access_logged'
    | 'privacy_viewed'
    | 'ai_interaction'
    | 'ai_image_generated'
    | 'ai_drawing_analyzed';
```

De `logAiInteraction` functie logt metadata per AI-interactie (mission_id, response_length, model, fallback_used) zonder PII op te slaan.

**Resterende acties:**

| # | Actie | Geschatte tijd | Prioriteit |
|---|-------|---------------|------------|
| 12.1 | Documenteer het loggingsysteem in de technische documentatie | 2 dagen | HOOG |
| 12.2 | Voeg logging toe voor STEP_COMPLETE events (welke stap, welke agent, timestamp) | 3 dagen | HOOG |
| 12.3 | Documenteer bewaartermijnen voor audit logs (minimum 6 maanden conform Art. 26) | 1 dag | MIDDEN |
| 12.4 | Implementeer log-export functionaliteit voor toezichthouder | 3 dagen | MIDDEN |

### B.5 Artikel 13 -- Transparantie en informatieverstrekking aan gebruiksverantwoordelijken

**Wat de wet eist:**
- Voldoende transparantie zodat deployers de output kunnen interpreteren en gebruiken
- Gebruiksinstructies (instructions for use) meegeven
- Informatie over: beoogd doel, nauwkeurigheidsniveau, bekende beperkingen, vereist menselijk toezicht, verwachte levensduur, onderhoud

**Huidige status: GROTENDEELS VOLDAAN**

DGSkills heeft:
- AI-transparantieverklaring op de website met hoog-risico erkenning
- Privacyverklaring met AI-gebruik beschrijving
- AI-content wordt gelabeld als AI-gegenereerd (`aiContentMarker.ts`)
- Disclaimer "AI-gegenereerd -- kan fouten bevatten"

**Resterende acties:**

| # | Actie | Geschatte tijd | Prioriteit |
|---|-------|---------------|------------|
| 13.1 | Opstellen formele "Instructions for Use" document voor scholen (deployers) | 1 week | KRITIEK |
| 13.2 | Documenteer nauwkeurigheidsniveaus en bekende beperkingen per agenttype | 3 dagen | HOOG |
| 13.3 | Beschrijf vereist menselijk toezicht en hoe docenten dit moeten uitvoeren | 3 dagen | HOOG |
| 13.4 | Voeg informatie toe over verwachte levensduur en onderhoudsschema | 1 dag | MIDDEN |

### B.6 Artikel 14 -- Menselijk toezicht

**Wat de wet eist:**
- Ontworpen zodat natuurlijke personen effectief toezicht kunnen houden
- Human-machine interface tools voor toezicht
- Toezichthouder moet: capaciteiten en beperkingen begrijpen, anomalieen detecteren, output correct interpreteren, kunnen besluiten het systeem niet te gebruiken, en de werking kunnen stopzetten
- Voorkomen van "automation bias" (overmatig vertrouwen)

**Huidige status: GEDEELTELIJK VOLDAAN**

Positief:
- Docent is eindverantwoordelijk (gedocumenteerd)
- AI neemt geen beslissingen met rechtsgevolg
- AI-output is visueel herkenbaar als AI-gegenereerd

Aandachtspunten:
- Docent kan STEP_COMPLETE momenteel NIET overriden
- Geen docentdashboard voor real-time monitoring van AI-interacties
- Geen "noodstop" functionaliteit voor docenten

**Concrete acties:**

| # | Actie | Geschatte tijd | Prioriteit |
|---|-------|---------------|------------|
| 14.1 | **Implementeer docent-override voor STEP_COMPLETE** (docent kan stappen terugdraaien of handmatig goedkeuren) | 2 weken | KRITIEK |
| 14.2 | Bouw docentdashboard voor monitoring AI-interacties (aggregaat, niet PII) | 2 weken | HOOG |
| 14.3 | Implementeer "noodstop": docent kan AI-functionaliteit per klas/leerling uitschakelen | 1 week | HOOG |
| 14.4 | Voeg waarschuwing toe tegen "automation bias" in docenthandleiding | 2 dagen | MIDDEN |
| 14.5 | Train docenten in het uitoefenen van menselijk toezicht (opnemen in onboarding) | Doorlopend | HOOG |

### B.7 Artikel 15 -- Nauwkeurigheid, robuustheid en cyberveiligheid

**Wat de wet eist:**
- Passend niveau van nauwkeurigheid, robuustheid en cyberveiligheid
- Consistent presteren gedurende de levenscyclus
- Weerbaarheid tegen pogingen van derden om gebruik/output/prestaties te manipuleren
- Technische redundantie/failsafe oplossingen
- Nauwkeurigheidsniveaus moeten in de gebruiksinstructies worden vermeld

**Huidige status: GEDEELTELIJK VOLDAAN**

Sterk:
- Defense-in-depth prompt injection bescherming (client + server, zie `promptSanitizer.ts`)
- Gemini Safety Settings op BLOCK_LOW_AND_ABOVE (maximaal restrictief)
- XP-farming detectie in system instructions
- CORS-beperking op edge functions
- JWT authenticatie
- RLS (Row Level Security) op databaseniveau

Te verbeteren:
- Geen formele nauwkeurigheidsmetrieken
- Geen systematisch adversarial testing programma
- Geen technische redundantie bij Vertex AI-uitval

**Concrete acties:**

| # | Actie | Geschatte tijd | Prioriteit |
|---|-------|---------------|------------|
| 15.1 | Definieer en meet nauwkeurigheidsmetrieken: hoe correct evalueert de AI leerlingantwoorden? | 2 weken | KRITIEK |
| 15.2 | Voer adversarial testing uit (red teaming) op alle 30+ agents | 2 weken | KRITIEK |
| 15.3 | Implementeer fallback bij Vertex AI-uitval (graceful degradation) | 1 week | HOOG |
| 15.4 | Documenteer cyberveiligheidsmaatregelen in technische documentatie | 3 dagen | HOOG |
| 15.5 | Stel een penetratietest-schema op (minimaal jaarlijks) | 2 dagen | MIDDEN |
| 15.6 | Monitor Gemini model-updates via Vertex AI (als Google het model wijzigt, kan de output veranderen) | Doorlopend | HOOG |

### B.8 Artikelen 16-17 -- Verplichtingen aanbieders en kwaliteitsmanagementsysteem

**Wat de wet eist (Art. 16):**
Aanbieders van hoog-risico AI-systemen moeten:
1. Voldoen aan de eisen van Sectie 2 (Art. 9-15)
2. Contactgegevens op het systeem vermelden
3. Een kwaliteitsmanagementsysteem hebben (Art. 17)
4. Technische documentatie bijhouden
5. Logs bewaren (wanneer onder hun controle)
6. Conformiteitsbeoordelingsprocedure doorlopen VOOR in de handel brengen
7. EU-conformiteitsverklaring opstellen (Art. 47)
8. CE-markering aanbrengen (Art. 48)
9. Registreren in EU-databank (Art. 49)
10. Corrigerende maatregelen nemen bij non-compliance
11. Op verzoek van autoriteiten compliance aantonen
12. Toegankelijkheidseisen naleven

**Wat de wet eist (Art. 17) -- Kwaliteitsmanagementsysteem:**
Een gedocumenteerd QMS dat ten minste omvat:
- Strategie voor naleving van de regelgeving
- Technieken, procedures en acties voor ontwerp, ontwikkeling en kwaliteitsborging
- Procedures voor datamanagemement (Art. 10)
- Procedures voor het risicobeheersysteem (Art. 9)
- Procedures voor post-market monitoring (Art. 72)
- Procedures voor rapportage van ernstige incidenten (Art. 73)
- Procedures voor communicatie met autoriteiten en deployers
- Registratiesystemen en -procedures
- Resource management
- Accountability framework

**Huidige status: NIET VOLDAAN**

DGSkills heeft geen formeel kwaliteitsmanagementsysteem. De bestaande processen zijn informeel en niet gedocumenteerd als QMS.

**Concrete acties:**

| # | Actie | Geschatte tijd | Prioriteit |
|---|-------|---------------|------------|
| 16.1 | Opstellen QMS-document dat alle Art. 17 onderdelen adresseert | 3 weken | KRITIEK |
| 16.2 | Formaliseer het ontwikkelproces (code review, testing, deployment procedures) | 1 week | HOOG |
| 16.3 | Stel een incidentrapportageprocedure op (ernstige incidenten, Art. 73) | 3 dagen | HOOG |
| 16.4 | Stel een post-market monitoring plan op (Art. 72) | 1 week | HOOG |
| 16.5 | Richt een accountability framework in (wie is waarvoor verantwoordelijk?) | 3 dagen | HOOG |
| 16.6 | Stel een communicatieprocedure op voor contact met markttoezichtautoriteiten | 2 dagen | MIDDEN |

### B.9 Artikel 26 -- Verplichtingen gebruiksverantwoordelijken (scholen)

**Wat de wet eist:**
Deployers (scholen) moeten:
1. Het systeem gebruiken conform de gebruiksinstructies
2. Menselijk toezicht toewijzen aan competente personen
3. Ervoor zorgen dat inputdata relevant is voor het beoogde doel
4. De werking van het systeem monitoren
5. Bij risico's de aanbieder en autoriteiten informeren
6. Logs bewaren (minimaal 6 maanden)
7. Bij gebruik op de werkplek: werknemers informeren
8. DPIA uitvoeren (wanneer van toepassing)
9. Fundamentele-rechteneffectbeoordeling uitvoeren (voor publieke organen)

**Huidige status: DGSkills moet scholen FACILITEREN**

DGSkills is aanbieder, niet deployer. Maar DGSkills heeft een zorgplicht om scholen te ondersteunen bij hun verplichtingen.

**Concrete acties:**

| # | Actie | Geschatte tijd | Prioriteit |
|---|-------|---------------|------------|
| 26.1 | Opstellen "Deployer Guide" voor scholen met alle Art. 26 verplichtingen | 1 week | KRITIEK |
| 26.2 | DPIA-support document actualiseren met hoog-risico context | 3 dagen | HOOG |
| 26.3 | Template voor fundamentele-rechteneffectbeoordeling beschikbaar stellen | 3 dagen | HOOG |
| 26.4 | Logbewaring technisch faciliteren (minimaal 6 maanden automatisch) | 2 dagen | HOOG |
| 26.5 | Docenttraining ontwikkelen over menselijk toezicht en monitoring | 1 week | HOOG |
| 26.6 | Incident-meldprocedure school->DGSkills opzetten | 2 dagen | MIDDEN |

### B.10 Artikel 50 -- Transparantieverplichtingen voor AI-systemen (inclusief generatieve AI)

**Wat de wet eist:**
1. Gebruikers moeten weten dat ze met een AI-systeem interacteren (tenzij evident)
2. AI-gegenereerde content moet machineleesbaar gemarkeerd worden als kunstmatig gegenereerd
3. Deployers van AI die deep fakes genereert moeten dit melden
4. AI-gegenereerde tekst die gepubliceerd wordt moet als zodanig worden gelabeld

**Huidige status: VOLDAAN**

DGSkills heeft uitstekende implementatie:
- `aiContentMarker.ts` markeert alle AI-output met machine-readable provenance metadata (JSON-LD)
- Visuele disclaimer "AI-gegenereerd -- kan fouten bevatten"
- AI-transparantieverklaring op de website
- Leerlingen weten expliciet dat ze met AI praten

```typescript
// Uit /Users/yorinvonder/Downloads/ai-lab---future-architect/utils/aiContentMarker.ts:
export interface AiProvenanceMetadata {
    generator: string;    // 'DGSkills/2.0'
    model: string;        // 'gemini-2.0-flash' (via Vertex AI europe-west4)
    timestamp: string;    // ISO 8601
    type: 'text' | 'image' | 'mixed';
    disclaimer: string;   // 'AI-gegenereerd — kan fouten bevatten'
    schema_version: string;
}
```

**Resterende acties:**

| # | Actie | Geschatte tijd | Prioriteit |
|---|-------|---------------|------------|
| 50.1 | Volg de EU Code of Practice on AI-Generated Content (concept december 2025) voor eventuele aanvullende eisen | Doorlopend | MIDDEN |
| 50.2 | Controleer of de provenance metadata voldoet aan eventuele nieuwe C2PA/IPTC standaarden | 2 dagen | LAAG |

### B.11 Artikel 49 + Annex VIII -- Registratie EU-databank

**Wat de wet eist:**
Voordat een hoog-risico AI-systeem in de handel wordt gebracht of in gebruik wordt gesteld, moet de aanbieder het systeem registreren in de EU-databank. De registratie omvat (Annex VIII):
- Naam en contactgegevens aanbieder
- Naam en beschrijving van het AI-systeem
- Status (op de markt, niet meer op de markt, teruggeroepen)
- Beoogd doel
- Classificatie (welk Annex III punt)
- Lidstaten waar het systeem op de markt is
- URL naar instructies for use
- URL naar EU-conformiteitsverklaring
- Samenvatting DPIA
- Samenvatting fundamentele-rechteneffectbeoordeling

**Huidige status: NIET VOLDAAN**

De EU AI-databank is in ontwikkeling. DGSkills moet registreren zodra dit mogelijk is.

**Concrete acties:**

| # | Actie | Geschatte tijd | Prioriteit |
|---|-------|---------------|------------|
| 49.1 | Monitor wanneer de EU AI-databank operationeel wordt | Doorlopend | KRITIEK |
| 49.2 | Verzamel alle Annex VIII informatie in een registratiedossier | 1 week | HOOG |
| 49.3 | Registreer in de EU-databank zodra operationeel (voor 2 aug 2026) | 1 dag | KRITIEK |

---

## C. CONFORMITEITSBEOORDELINGSPROCEDURE

### C.1 Welke procedure is van toepassing?

Op basis van **Art. 43(2)**: voor hoog-risico AI-systemen zoals bedoeld in **punten 2 tot en met 8 van Annex III**, volgen aanbieders de **conformiteitsbeoordelingsprocedure op basis van interne controle** zoals bedoeld in **Annex VI**.

**Dit betekent: GEEN notified body nodig.** DGSkills voert de conformiteitsbeoordeling zelf uit.

Dit is een belangrijk kostenvoordeel. DGSkills valt onder punt 3(b) van Annex III, dus de interne procedure is van toepassing. Een externe notified body zou nodig zijn geweest als het systeem onder punt 1 van Annex III viel (biometrische systemen voor wetshandhaving).

### C.2 Stappen Annex VI -- Interne controle

De conformiteitsbeoordelingsprocedure op basis van interne controle omvat drie onderdelen:

**Stap 1: Verificatie Kwaliteitsmanagementsysteem**
- Controleer dat het QMS (Art. 17) compliant is
- Controleer dat het QMS geimplementeerd en operationeel is

**Stap 2: Onderzoek Technische Documentatie**
- Onderzoek de informatie in de technische documentatie (Annex IV)
- Beoordeel de compliance van het AI-systeem met alle relevante eisen uit Sectie 2 (Art. 9-15)

**Stap 3: Verificatie ontwerp- en ontwikkelproces**
- Verifieer dat het ontwerp- en ontwikkelproces en de post-market monitoring (Art. 72) consistent zijn met de technische documentatie

### C.3 Stappen naar CE-markering

| Stap | Actie | Timing |
|------|-------|--------|
| 1 | Alle Art. 9-15 eisen implementeren | Maart - Juni 2026 |
| 2 | Kwaliteitsmanagementsysteem opstellen en implementeren (Art. 17) | Maart - Mei 2026 |
| 3 | Technische documentatie opstellen conform Annex IV | April - Juni 2026 |
| 4 | Interne conformiteitsbeoordeling uitvoeren (Annex VI) | Juni - Juli 2026 |
| 5 | EU-conformiteitsverklaring opstellen (Art. 47) | Juli 2026 |
| 6 | CE-markering aanbrengen (Art. 48) | Juli 2026 |
| 7 | Registratie in EU-databank (Art. 49) | Juli 2026 |
| 8 | Post-market monitoring plan activeren (Art. 72) | Augustus 2026 |

### C.4 Geschatte kosten

| Kostenpost | Schatting | Toelichting |
|------------|-----------|-------------|
| **Juridisch advies (ICT-jurist)** | EUR 3.000 - 8.000 | Review technische documentatie, QMS, conformiteitsverklaring |
| **Intern werk (eigen tijd)** | 400 - 600 uur | Documentatie, implementatie, testing |
| **Adversarial testing / red teaming** | EUR 0 - 2.000 | Intern mogelijk, extern professioneler |
| **Externe audit (optioneel maar aanbevolen)** | EUR 2.000 - 5.000 | Pre-assessment door ICT-jurist of AI-compliance adviseur |
| **Geen notified body nodig** | EUR 0 | Interne controle volstaat voor Annex III punt 3(b) |
| **TOTAAL** | **EUR 5.000 - 15.000** | Plus 400-600 uur eigen werk over ~5 maanden |

**Vergelijking:** Een conformiteitsbeoordeling met notified body zou EUR 20.000-50.000+ kosten. Het feit dat DGSkills de interne procedure mag volgen, bespaart aanzienlijk.

**SME-voordelen:**
- De Commissie zal vereenvoudigde technische documentatieformulieren beschikbaar stellen voor KMO's
- Conformiteitsbeoordelingskosten worden verlaagd voor KMO's en startups
- Lidstaten moeten awareness- en trainingsactiviteiten organiseren gericht op KMO's

---

## D. TIJDLIJN EN ACTIEPLAN

### D.1 Maand-voor-maand plan (februari 2026 - augustus 2026)

#### FASE 1: FUNDAMENT (Maart 2026)

**Thema: Documentatie en risicoanalyse**

| Week | Actie | Deliverable |
|------|-------|-------------|
| W1 (3-7 mrt) | Start risicoregister (Art. 9) | Eerste versie risicoregister |
| W1 | Correctie audit-report.md: wijzig "Limited Risk" naar "High Risk" | Gecorrigeerd rapport |
| W2 (10-14 mrt) | Risicobeoordeling per agent (30+ agents) | Risicobeoordelingsrapport |
| W2 | Start datagovernance documentatie (Art. 10) | Datagovernance beleidsdocument |
| W3 (17-21 mrt) | Specifieke risicobeoordeling minderjarigen (Art. 9(9)) | Minderjarigen-risicoanalyse |
| W3 | ~~Bevestig Google Gemini EER-datalocatie~~ **AFGEROND:** Vertex AI europe-west4 (Nederland) actief sinds 23 feb 2026 | ~~Bevestigingsdocument~~ Afgerond |
| W4 (24-28 mrt) | Start technische documentatie Annex IV (sectie 1-2) | TD Hoofdstuk 1-2 (concept) |
| W4 | Start QMS-document (Art. 17) | QMS-framework |

**Quick wins in maart:**
- Correctie classificatie in audit-report.md (1 uur)
- Contactgegevens invullen in privacy-documenten (2 uur)
- Documenteer bestaande maatregelen (promptSanitizer, safetySettings, welzijnsprotocol) als onderdeel van risicobeheersysteem

#### FASE 2: IMPLEMENTATIE (April 2026)

**Thema: Technische implementatie en verdere documentatie**

| Week | Actie | Deliverable |
|------|-------|-------------|
| W1 (1-4 apr) | **Implementeer docent-override voor STEP_COMPLETE (Art. 14)** | Feature in productie |
| W2 (7-11 apr) | Implementeer noodstop-functionaliteit (docent schakelt AI uit per klas) | Feature in productie |
| W2 | Voeg STEP_COMPLETE logging toe aan audit systeem | Uitgebreide logging |
| W3 (14-18 apr) | Technische documentatie Annex IV sectie 3-4 (monitoring, prestatiemetrieken) | TD Hoofdstuk 3-4 (concept) |
| W3 | Definieer nauwkeurigheidsmetrieken (Art. 15) | Metriekendefinitie |
| W4 (21-25 apr) | Adversarial testing / red teaming uitvoeren op alle agents | Red team rapport |
| W4 | Technische documentatie Annex IV sectie 5-7 | TD Hoofdstuk 5-7 (concept) |

#### FASE 3: DEPLOYER-SUPPORT (Mei 2026)

**Thema: Documentatie voor scholen en QMS voltooien**

| Week | Actie | Deliverable |
|------|-------|-------------|
| W1 (4-8 mei) | Opstellen "Instructions for Use" voor scholen (Art. 13) | Instructions for Use document |
| W1 | Opstellen "Deployer Guide" (Art. 26) | Deployer Guide |
| W2 (11-15 mei) | DPIA-support actualiseren naar hoog-risico context | Geactualiseerde DPIA-template |
| W2 | Template fundamentele-rechteneffectbeoordeling | FRIA-template |
| W3 (18-22 mei) | QMS-document voltooien | Voltooid QMS |
| W3 | Post-market monitoring plan opstellen (Art. 72) | PMS-plan |
| W4 (25-29 mei) | Incidentrapportage- en communicatieprocedures | Incident response plan |
| W4 | Docenttraining ontwikkelen (menselijk toezicht) | Trainingsmateriaal |

#### FASE 4: CONFORMITEITSBEOORDELING (Juni 2026)

**Thema: Alles samenbrengen en interne beoordeling**

| Week | Actie | Deliverable |
|------|-------|-------------|
| W1 (1-5 jun) | Technische documentatie voltooien (alle Annex IV secties) | Voltooid TD-dossier |
| W2 (8-12 jun) | Interne conformiteitsbeoordeling stap 1: QMS-verificatie | QMS-verificatierapport |
| W2 | Verzamel EU-databank registratie informatie (Annex VIII) | Registratiedossier |
| W3 (15-19 jun) | Interne conformiteitsbeoordeling stap 2: TD-onderzoek | TD-beoordelingsrapport |
| W4 (22-26 jun) | Interne conformiteitsbeoordeling stap 3: Ontwerp/ontwikkelproces verificatie | Procesverificatie rapport |
| W4 | Identificeer eventuele gaps en plan reparatieacties | Gap-analyse |

#### FASE 5: AFRONDING EN FORMALISATIE (Juli 2026)

**Thema: Conformiteitsverklaring, CE-markering, registratie**

| Week | Actie | Deliverable |
|------|-------|-------------|
| W1 (1-4 jul) | Gap-reparatie: eventuele resterende non-conformities oplossen | Reparatierapport |
| W2 (7-11 jul) | Juridische review door ICT-jurist van complete dossier | Juridisch reviewrapport |
| W3 (14-18 jul) | EU-conformiteitsverklaring opstellen (Art. 47) | Getekende conformiteitsverklaring |
| W3 | CE-markering aanbrengen op platform (Art. 48) | CE-markering zichtbaar |
| W4 (21-25 jul) | Registratie in EU AI-databank (Art. 49) | Registratiebewijs |
| W4 | Definitieve controle complete dossier | Definitief compliance-dossier |

#### FASE 6: GO-LIVE (Augustus 2026)

| Datum | Actie |
|-------|-------|
| 1 aug 2026 | Laatste controle: alle documentatie actueel en toegankelijk |
| **2 aug 2026** | **DEADLINE: Hoog-risico verplichtingen EU AI Act van kracht** |
| 2-31 aug 2026 | Post-market monitoring plan activeren; eerste monitoring cyclus |

### D.2 Prioritering

**KRITIEK (moet eerst, blokkerend):**
1. Risicobeheersysteem documenteren (Art. 9)
2. Technische documentatie opstellen (Art. 11)
3. QMS opstellen (Art. 17)
4. Docent-override STEP_COMPLETE implementeren (Art. 14)
5. Instructions for Use voor scholen (Art. 13)
6. EU-databank registratie (Art. 49)
7. Conformiteitsverklaring + CE-markering (Art. 47-48)

**HOOG (belangrijk maar niet blokkerend):**
8. Nauwkeurigheidsmetrieken definieren en meten (Art. 15)
9. Adversarial testing (Art. 15)
10. Post-market monitoring plan (Art. 72)
11. Deployer Guide voor scholen (Art. 26)
12. DPIA-support actualiseren

**MIDDEN (gewenst voor deadline):**
13. Penetratietest
14. Docenttraining over menselijk toezicht
15. Log-export voor toezichthouder

### D.3 Quick wins (deze week te implementeren)

| # | Actie | Tijd | Impact |
|---|-------|------|--------|
| 1 | Corrigeer audit-report.md: "Limited Risk" -> "High Risk" | 30 min | Hoog (correcte classificatie) |
| 2 | Vul alle `[invullen]` placeholders in privacy-documenten in | 2 uur | Midden |
| 3 | Documenteer bestaande maatregelen als eerste versie risicoregister | 4 uur | Hoog (basis Art. 9) |
| 4 | Begin Annex VIII registratiedossier (verzamel basisgegevens) | 2 uur | Midden |

---

## E. SPECIFIEKE AANDACHTSPUNTEN

### E.1 Gebruik van foundation model (Google Gemini via Vertex AI) -- Verantwoordelijkheidsverdeling

> **UPDATE 23 februari 2026:** De migratie van de Gemini Developer API (`generativelanguage.googleapis.com`) naar **Vertex AI** (`europe-west4-aiplatform.googleapis.com`) is **afgerond en getest in productie**. Dit lost de volgende eerdere risico's op:
> - **Datalocatie:** Gegarandeerd EU (europe-west4, Nederland) voor data at rest en ML-verwerking
> - **Contractueel kader:** Google Cloud DPA met SCCs (i.p.v. Gemini API Terms of Service)
> - **Zero data retention:** Google bewaart geen klantdata en traint niet op klantdata
> - **Authenticatie:** Service account (geen API key meer)
> - **Minderjarigen ToS:** Vertex AI (Google Cloud) heeft geen minimumleeftijd-restrictie in de ToS, in tegenstelling tot de Gemini Developer API die 18+ vereiste

**De AI Act maakt een onderscheid tussen:**

1. **GPAI-model aanbieder (Google):** Verantwoordelijk voor Art. 51-55 verplichtingen
   - Technische documentatie van het model (Art. 53)
   - Informatie verstrekken aan downstream aanbieders (Art. 53)
   - Auteursrechtbeleid (Art. 53)
   - Als systemisch risico (>10^25 FLOPS): aanvullende verplichtingen (Art. 55)
   - Google Gemini valt waarschijnlijk onder "systemic risk" vanwege de omvang

2. **Downstream aanbieder / integrator (DGSkills):** Verantwoordelijk voor Art. 9-17 als hoog-risico aanbieder
   - DGSkills is verantwoordelijk voor het gehele AI-systeem, inclusief de integratie met Gemini via Vertex AI
   - DGSkills kan zich NIET verschuilen achter Google: "wij gebruiken alleen de API" is geen verweer
   - DGSkills moet de output van Gemini monitoren, filteren en beoordelen

**Wat DGSkills moet doen:**
- Documenteer de afhankelijkheid van Google Gemini (via Vertex AI) in de technische documentatie
- Documenteer welke informatie Google verstrekt over het model (Art. 53 verplichtingen van Google)
- Implementeer eigen safeguards bovenop Gemini (reeds gedaan: safety settings, prompt sanitizer, welzijnsprotocol)
- Monitor Gemini model-updates via Vertex AI en test de impact op DGSkills-functionaliteit
- ~~Leg contractueel vast dat Google aan GPAI-verplichtingen voldoet~~ **AFGEROND:** Google Cloud DPA met SCCs is van toepassing via Vertex AI. Zero data retention gegarandeerd.

**Risico:** Als Google het Gemini-model wijzigt (bijv. nieuwe versie, gewijzigd gedrag), verandert de output van DGSkills. Dit moet worden meegenomen in het risicobeheerssysteem en het post-market monitoring plan.

### E.2 Verhouding aanbieder (DGSkills) vs. deployer (scholen)

**DGSkills = Aanbieder (Provider)** conform Art. 3(3):
- Ontwikkelt het AI-systeem
- Brengt het op de markt onder eigen naam/merk
- Draagt de primaire verantwoordelijkheid voor compliance

**Scholen = Gebruiksverantwoordelijken (Deployers)** conform Art. 3(4):
- Zetten het systeem in binnen hun onderwijs
- Hebben eigen verplichtingen onder Art. 26

**Praktische implicaties:**

| Onderwerp | DGSkills (aanbieder) | School (deployer) |
|-----------|---------------------|-------------------|
| Conformiteitsbeoordeling | Voert uit en ondertekent | Niet vereist |
| CE-markering | Brengt aan | Controleert aanwezigheid |
| Technische documentatie | Stelt op | Ontvangt instructions for use |
| Menselijk toezicht | Faciliteert technisch | Voert uit (docent) |
| Risicobeheer | Documenteert en implementeert | Monitort tijdens gebruik |
| DPIA | Ondersteunt met informatie | Voert uit |
| Logging | Implementeert technisch | Bewaart minimaal 6 maanden |
| Incidentmelding | Ontvangt en verwerkt | Meldt aan DGSkills en eventueel autoriteiten |
| EU-databank registratie | Registreert het systeem | Geen registratieplicht (tenzij publiek orgaan) |

**Actie:** Neem deze rolverdeling op in:
- De verwerkersovereenkomst (DPA)
- De pilotovereenkomst / licentieovereenkomst
- De deployer guide
- De instructions for use

### E.3 General-Purpose AI Model verplichtingen (Art. 51-55)

**Art. 51: Classificatie GPAI-modellen met systeemrisico**

Google Gemini wordt waarschijnlijk geclassificeerd als GPAI met systeemrisico (Art. 51), vanwege:
- Trainingscompute > 10^25 FLOPS (vermoedelijk)
- Hoge impact capabilities
- Breed beschikbaar voor miljoenen gebruikers

**Implicaties voor DGSkills als downstream gebruiker:**

DGSkills hoeft zelf NIET aan Art. 51-55 te voldoen (dat is Google's verantwoordelijkheid), maar moet wel:

1. **Documenteer welke informatie Google verstrekt** (Art. 53(1)(b) verplicht Google om downstream providers relevante informatie te verstrekken)
2. **Gebruik deze informatie in je eigen technische documentatie** (hoe integreert het GPAI-model in je hoog-risico systeem?)
3. **Monitor Google's compliance** (als Google niet voldoet, heeft dat impact op jouw systeem)
4. **Contractuele afspraken** (Google's Terms of Service / API Terms moeten adequate garanties bieden)

**Art. 53 vereist dat Google aan DGSkills levert:**
- Technische documentatie over het model
- Informatie over training en evaluatie
- Resultaten van adversarial testing
- Bekende beperkingen
- Informatie voor compliance met Art. 9-15 voor downstream hoog-risico systemen

**Actie:** Controleer of Google's bestaande documentatie (Model Cards, Safety Reports, Vertex AI documentation) voldoende informatie biedt. Documenteer eventuele lacunes en neem dit op als risico in het risicoregister.

> **Status 23 feb 2026:** Met de migratie naar Vertex AI is het contractuele kader aanzienlijk verbeterd. De Google Cloud DPA met SCCs biedt een sterkere juridische basis dan de Gemini Developer API ToS. De zero data retention policy en EU-dataresidentie (europe-west4) adresseren de eerder geidentificeerde datalocatie-risico's.

### E.4 Correctie op eerdere documenten

Het audit-rapport (`/Users/yorinvonder/Downloads/ai-lab---future-architect/business/nl-vo/compliance/audit-report.md`) classificeert DGSkills nog als "Limited Risk - Art. 50":

```
## 3. EU AI Act Audit (Limited Risk - Art. 50)
```

Dit moet worden gecorrigeerd naar:

```
## 3. EU AI Act Audit (HIGH RISK - Annex III punt 3(b))
```

Het juridisch rapport (`09-juridisch-rapport-compleet.md`) classificeert correct als hoog-risico. Het audit-rapport moet worden bijgewerkt.

### E.5 Post-2 augustus 2026: doorlopende verplichtingen

Na de deadline stopt compliance niet. Doorlopende verplichtingen:
- **Post-market monitoring** (Art. 72): systematisch verzamelen en analyseren van data over prestaties
- **Ernstige incidenten melden** (Art. 73): binnen 15 dagen aan markttoezichtautoriteit
- **Substantiele wijzigingen** (Art. 43(4)): bij substantiele wijziging opnieuw conformiteitsbeoordeling uitvoeren
- **Documentatie actueel houden** (Art. 11): technische documentatie bijwerken bij wijzigingen
- **Logbewaring** (Art. 12 + Art. 26): minimaal 6 maanden

---

## SAMENVATTING EN TOTAALOVERZICHT

### Compliancestatus op 23 februari 2026

| Categorie | Voldaan | Gedeeltelijk | Niet voldaan |
|-----------|---------|--------------|--------------|
| Art. 9 Risicobeheer | | | X |
| Art. 10 Datagovernance | | X | |
| Art. 11 Technische documentatie | | | X |
| Art. 12 Logging | X | | |
| Art. 13 Transparantie | | X | |
| Art. 14 Menselijk toezicht | | X | |
| Art. 15 Nauwkeurigheid/robuustheid | | X | |
| Art. 16-17 Aanbieder/QMS | | | X |
| Art. 26 Deployer support | | X | |
| Art. 47 Conformiteitsverklaring | | | X |
| Art. 48 CE-markering | | | X |
| Art. 49 EU-databank registratie | | | X |
| Art. 50 Transparantie AI | X | | |

**Score: 2/13 voldaan, 5/13 gedeeltelijk, 6/13 niet voldaan**

### Geschatte totaalinvestering

| Post | Kosten | Uren eigen werk |
|------|--------|----------------|
| Juridisch advies | EUR 3.000 - 8.000 | - |
| Externe audit (aanbevolen) | EUR 2.000 - 5.000 | - |
| Adversarial testing | EUR 0 - 2.000 | 40-80 uur |
| Technische implementatie | EUR 0 | 80-120 uur |
| Documentatie (alle artikelen) | EUR 0 | 200-300 uur |
| Docenttraining ontwikkelen | EUR 0 | 40-60 uur |
| **TOTAAL** | **EUR 5.000 - 15.000** | **360 - 560 uur** |

### Kritieke paden

1. **Technische documentatie (Annex IV)** is het langste pad: ~12 weken doorlooptijd
2. **Docent-override STEP_COMPLETE** is de belangrijkste technische implementatie
3. **EU-databank registratie** is afhankelijk van wanneer de databank operationeel wordt
4. **Juridische review** is een bottleneck als de ICT-jurist niet tijdig beschikbaar is

### Einde

Dit conformiteitsbeoordelingsplan biedt een volledig overzicht van alle verplichtingen, de huidige status, concrete acties en een tijdlijn om DGSkills.app compliant te maken voor de EU AI Act deadline van 2 augustus 2026. Het plan is gebaseerd op de daadwerkelijke codebase, bestaande documentatie en de wettekst van Verordening (EU) 2024/1689.

---

**Bronnen:**
- [Annex III: High-Risk AI Systems](https://artificialintelligenceact.eu/annex/3/)
- [Article 43: Conformity Assessment](https://artificialintelligenceact.eu/article/43/)
- [Annex VI: Conformity Assessment Based on Internal Control](https://artificialintelligenceact.eu/annex/6/)
- [Annex IV: Technical Documentation](https://artificialintelligenceact.eu/annex/4/)
- [Article 9: Risk Management System](https://artificialintelligenceact.eu/article/9/)
- [Article 10: Data and Data Governance](https://artificialintelligenceact.eu/article/10/)
- [Article 11: Technical Documentation](https://artificialintelligenceact.eu/article/11/)
- [Article 14: Human Oversight](https://artificialintelligenceact.eu/article/14/)
- [Article 15: Accuracy, Robustness and Cybersecurity](https://artificialintelligenceact.eu/article/15/)
- [Article 16: Obligations of Providers](https://artificialintelligenceact.eu/article/16/)
- [Article 26: Obligations of Deployers](https://artificialintelligenceact.eu/article/26/)
- [Article 49: Registration](https://artificialintelligenceact.eu/article/49/)
- [Article 50: Transparency Obligations](https://artificialintelligenceact.eu/article/50/)
- [Article 51: Classification of GPAI Models](https://artificialintelligenceact.eu/article/51/)
- [Article 53: Obligations for Providers of GPAI Models](https://artificialintelligenceact.eu/article/53/)
- [Annex VIII: Information for Registration](https://artificialintelligenceact.eu/annex/8/)
- [Small Businesses' Guide to the AI Act](https://artificialintelligenceact.eu/small-businesses-guide-to-the-ai-act/)
- [Conformity Assessments under the EU AI Act (FPF White Paper)](https://fpf.org/wp-content/uploads/2025/04/OT-comformity-assessment-under-the-eu-ai-act-WP-1.pdf)
- [EU AI Act Service Desk](https://ai-act-service-desk.ec.europa.eu/)
- [Code of Practice on AI-Generated Content](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content)