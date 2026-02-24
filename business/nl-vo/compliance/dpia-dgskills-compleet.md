# Data Protection Impact Assessment (DPIA)
# DGSkills.app - AI-Educatieplatform

**Conform Art. 35 AVG (Verordening EU 2016/679)**

---

| Veld | Waarde |
|---|---|
| **Document** | Data Protection Impact Assessment (DPIA) |
| **Organisatie** | Future Architect (handelend als DGSkills) |
| **Platform** | dgskills.app |
| **Versie** | 1.0 |
| **Datum** | 23 februari 2026 |
| **Status** | Concept - ter beoordeling door verwerkingsverantwoordelijke(n) |
| **Classificatie** | Vertrouwelijk |
| **Opgesteld door** | Future Architect (verwerker) |
| **Beoordelaar(s)** | School (verwerkingsverantwoordelijke) / Functionaris Gegevensbescherming school |
| **Volgende herbeoordeling** | 23 februari 2027 (of eerder bij significante wijzigingen) |

---

## Inhoudsopgave

1. [Inleiding en aanleiding](#1-inleiding-en-aanleiding)
2. [Systematische beschrijving van de verwerking](#2-systematische-beschrijving-van-de-verwerking)
3. [Toetsing DPIA-plicht (WP29-criteria)](#3-toetsing-dpia-plicht-wp29-criteria)
4. [Beoordeling noodzaak en evenredigheid](#4-beoordeling-noodzaak-en-evenredigheid)
5. [Risicobeoordeling](#5-risicobeoordeling)
6. [Specifieke risico's voor minderjarigen](#6-specifieke-risicos-voor-minderjarigen)
7. [Specifieke risico's van AI-interactie met kinderen](#7-specifieke-risicos-van-ai-interactie-met-kinderen)
8. [Maatregelen om risico's te beperken](#8-maatregelen-om-risicos-te-beperken)
9. [Restrisico-analyse na maatregelen](#9-restrisico-analyse-na-maatregelen)
10. [Rechten van betrokkenen](#10-rechten-van-betrokkenen)
11. [Doorgifte buiten de EER](#11-doorgifte-buiten-de-eer)
12. [Subverwerkers](#12-subverwerkers)
13. [EU AI Act overwegingen](#13-eu-ai-act-overwegingen)
14. [Conclusie en actieplan](#14-conclusie-en-actieplan)
15. [Voorafgaand overleg met AP](#15-voorafgaand-overleg-met-ap)
16. [Accordering en ondertekening](#16-accordering-en-ondertekening)

---

## 1. Inleiding en aanleiding

### 1.1 Wat is DGSkills?

DGSkills.app is een AI-gestuurd educatieplatform voor het Nederlands voortgezet onderwijs (vo). Het platform richt zich op het ontwikkelen van digitale geletterdheid bij leerlingen van 12 tot 18 jaar door middel van interactieve "missies" waarin AI-agents leerlingen begeleiden bij het leren van digitale vaardigheden.

Het platform bevat meer dan 30 AI-agents die elk een specifiek onderwijsdomein bestrijken (bijv. cyberveiligheid, programmeren, mediawijsheid, AI-geletterdheid). Leerlingen communiceren via een chatinterface met deze agents, voeren opdrachten uit en ontvangen realtime feedback. Voortgang wordt bijgehouden via XP-punten (experience points) en een level-systeem.

### 1.2 Waarom is deze DPIA verplicht?

Op grond van Art. 35 lid 1 AVG moet een gegevensbeschermingseffectbeoordeling worden uitgevoerd wanneer een verwerking "waarschijnlijk een hoog risico inhoudt voor de rechten en vrijheden van natuurlijke personen". Deze DPIA is verplicht op basis van de volgende gronden:

**a) Art. 35 lid 3 AVG:**
- Sub (a): Systematische en uitgebreide beoordeling van persoonlijke aspecten van leerlingen (evaluatie van leerresultaten, voortgangsmonitoring, XP-scoring)

**b) Lijst verplichte DPIA van de Autoriteit Persoonsgegevens (AP):**
De AP heeft op grond van Art. 35 lid 4 AVG een lijst gepubliceerd van verwerkingen waarvoor een DPIA verplicht is (Besluit BWBR0042812). DGSkills valt hieronder vanwege:
- Grootschalige verwerking van gegevens van kwetsbare personen (minderjarigen)
- Gebruik van innovatieve technologie (generatieve AI / Large Language Models)
- Systematische monitoring van gedrag

**c) WP29/EDPB-richtlijnen (WP 248 rev.01):**
De Europese toezichthouders hebben negen criteria geformuleerd; bij twee of meer criteria is een DPIA in de regel verplicht. DGSkills scoort op minimaal zes van de negen criteria (zie sectie 3).

**d) EU AI Act (Verordening EU 2024/1689):**
DGSkills valt onder Annex III punt 3(b): "AI-systemen bestemd voor evaluatie van leerresultaten, waaronder die evaluatie wordt gebruikt om het leerproces van natuurlijke personen te sturen in het onderwijs." Dit maakt het systeem hoog-risico onder de AI Act, wat de noodzaak van een DPIA verder onderstreept.

### 1.3 Rolverdeling

| Rol | Partij | Toelichting |
|---|---|---|
| Verwerkingsverantwoordelijke | De school (vo-instelling) | Bepaalt het doel en de middelen van de verwerking in de onderwijscontext |
| Verwerker | Future Architect (DGSkills) | Verwerkt persoonsgegevens uitsluitend in opdracht van de school |
| Subverwerkers | Google (Vertex AI, europe-west4), Supabase (AWS EU), Vercel | Verwerken gegevens onder verantwoordelijkheid van DGSkills als verwerker |

De school is als verwerkingsverantwoordelijke primair verantwoordelijk voor het (laten) uitvoeren van deze DPIA. DGSkills ondersteunt de school hierbij door deze DPIA op te stellen en de benodigde technische informatie te leveren.

---

## 2. Systematische beschrijving van de verwerking

### 2.1 Verwerkingsdoeleinden

| # | Doeleinde | Rechtsgrondslag (school) |
|---|---|---|
| D1 | Authenticatie en autorisatie van gebruikers (leerlingen, docenten) | Art. 6(1)(e) AVG - Publieke taak (onderwijs) |
| D2 | Faciliteren van AI-gestuurde leermissies (chatinteractie) | Art. 6(1)(e) AVG - Publieke taak |
| D3 | Registratie en weergave van leervoortgang (XP, levels, missies) | Art. 6(1)(e) AVG - Publieke taak |
| D4 | Docentdashboard: inzicht in voortgang per leerling/klas | Art. 6(1)(e) AVG - Publieke taak |
| D5 | Platform-analytics (geaggregeerd, geanonimiseerd) | Art. 6(1)(f) AVG - Gerechtvaardigd belang (na consent) |
| D6 | Technisch beheer, beveiliging en incidentafhandeling | Art. 6(1)(f) AVG - Gerechtvaardigd belang |
| D7 | Naleving wettelijke verplichtingen (audit logging, bewaartermijnen) | Art. 6(1)(c) AVG - Wettelijke verplichting |

### 2.2 Categorieen betrokkenen

| Categorie | Leeftijdsgroep | Geschat aantal | Bijzonderheden |
|---|---|---|---|
| Leerlingen | 12-18 jaar | Per school: 25-500 | **Minderjarigen - kwetsbare groep** |
| Docenten | 18+ | Per school: 1-20 | Toegang tot leerlinggegevens van eigen klas |
| Schoolbeheerders | 18+ | Per school: 1-3 | Schoolbrede toegang |

### 2.3 Categorieen persoonsgegevens

| Categorie | Specifieke gegevens | Bewaartermijn | Noodzaak |
|---|---|---|---|
| **Identificatiegegevens** | Naam, schoole-mailadres, account-ID (UUID), rol (leerling/docent/admin) | Duur contract + afgesproken na-termijn | Noodzakelijk voor authenticatie en autorisatie |
| **Authenticatiegegevens** | Gehashte wachtwoorden (bcrypt), JWT-tokens, sessiedata | Duur account; tokens: sessieduur | Noodzakelijk voor veilige toegang |
| **Leervoortgang** | XP-punten, level, voltooide missies, stapvoltooiing per missie | Duur schooljaar + afgesproken termijn | Kernfunctionaliteit: leerproces monitoren |
| **Chatgeschiedenis met AI** | Berichten van leerling aan AI-agent, AI-responses | Sessiegebaseerd (niet persistent opgeslagen in database) | Noodzakelijk voor contextbehoud in gesprek |
| **Activiteitsdata** | Loginmomenten, laatst actief, uitgevoerde acties | 1 jaar (automatische opschoning via pg_cron) | Docentdashboard en ondersteuning |
| **Feedbackdata** | Door leerling ingevoerde feedback op missies | 1 jaar (automatische opschoning) | Kwaliteitsverbetering platform |
| **Gedeeld werk** | Projecten en games die leerling deelt | 1 jaar (automatische opschoning) | Onderwijsfunctionaliteit |
| **Audit logs** | Acties op account (login, export, verwijdering, restrictieverzoeken) | 3 jaar (AVG Art. 30 ROPA-verplichting) | Compliance en verantwoording |
| **Gamification-events** | XP-transacties, duel-uitdagingen, badges | XP-transacties: onbeperkt; duels: 7 dagen | Leermotivatie en voortgang |

**Wat wordt NIET verwerkt:**
- Geen BSN (Burgerservicenummer)
- Geen woonadres
- Geen bijzondere persoonsgegevens (Art. 9 AVG) zoals gezondheid, religie, etniciteit
- Geen biometrische gegevens
- Geen gegevens over strafrechtelijke veroordelingen (Art. 10 AVG)
- Geen commerciele profilering of advertentiedata

### 2.4 Technische architectuur en datastromen

```
                       [LEERLING/DOCENT]
                             |
                        HTTPS/TLS 1.3
                             |
                      [Vercel CDN (EU)]
                     React 19 Frontend
                             |
                        HTTPS/TLS
                             |
              +-----------------------------+
              |   Supabase Edge Functions   |
              |   (Deno, AWS eu-west-1)     |
              +-----------------------------+
              |                             |
    /chat endpoint              /exportMyData
    /restrictProcessing         /deleteMyAccount
              |                             |
    +---------+----------+     +------------+
    |                    |     |            |
    | Prompt Sanitizer   |     | Supabase   |
    | (server-side)      |     | PostgreSQL |
    |                    |     | (eu-west-1)|
    +---------+----------+     +------------+
              |
         HTTPS/TLS
              |
    +-----------------------------+
    | Google Vertex AI            |
    | Gemini 2.0 Flash            |
    | europe-west4 (Nederland)    |
    | Service account (OAuth2/JWT)|
    +-----------------------------+
```

**Datalocatie bevestigd:** AI-verwerking vindt plaats via Google Vertex AI in regio `europe-west4` (Nederland). Google garandeert data at rest in deze regio en ML-verwerking binnen de regio. Er is sprake van zero data retention door Google en authenticatie verloopt via een service account (OAuth2/JWT), niet via een API-sleutel.

### 2.5 Verwerkingsactiviteiten in detail

**Stroom 1: AI-chatinteractie (kernfunctionaliteit)**
1. Leerling typt bericht in chatinterface
2. Client-side prompt sanitizer controleert op prompt injection
3. Bericht wordt via HTTPS naar Supabase Edge Function `/chat` gestuurd
4. Server-side: JWT-authenticatie wordt geverifieerd
5. Server-side: Prompt sanitizer controleert nogmaals op injection (defense-in-depth)
6. Gesanitiseerd bericht wordt met conversatiegeschiedenis naar Google Vertex AI (endpoint: `europe-west4-aiplatform.googleapis.com`) gestuurd
7. Gemini Safety Settings filteren op: harassment, hate speech, sexually explicit, dangerous content (alle op `BLOCK_LOW_AND_ABOVE`)
8. AI-response wordt teruggestuurd naar de leerling
9. Conversatiegeschiedenis wordt client-side in het geheugen gehouden (sessiegebaseerd)

**Stroom 2: Voortgangsregistratie**
1. AI-agent markeert stappen als voltooid via `STEP_COMPLETE` markers
2. Client verwerkt deze markers en registreert voortgang
3. XP-transacties worden server-side berekend en opgeslagen (tamper-proof)
4. Docent kan voortgang bekijken via het dashboard

**Stroom 3: AVG-rechtenuitoefening**
1. `exportMyData`: Volledige data-export (Art. 20 AVG) - haalt data op uit 17+ tabellen
2. `deleteMyAccount`: Accountverwijdering (Art. 17 AVG) - CASCADE delete over 28 gekoppelde tabellen
3. `restrictProcessing`: Verwerkingsbeperking (Art. 18 AVG) - markering + audit log

---

## 3. Toetsing DPIA-plicht (WP29-criteria)

De Article 29 Working Party (nu EDPB) heeft in richtlijn WP 248 rev.01 negen criteria vastgesteld. Bij twee of meer criteria is een DPIA in de regel verplicht.

| # | WP29-criterium | Van toepassing? | Toelichting |
|---|---|---|---|
| 1 | **Evaluatie of scoring** (profilering, voorspellingen) | **JA** | Leervoortgang wordt geevalueerd; XP-scoring en level-progressie op basis van AI-interactie |
| 2 | **Geautomatiseerde besluitvorming** met rechtsgevolg of vergelijkbaar effect | **GEDEELTELIJK** | AI genereert STEP_COMPLETE markers die voortgang registreren; docent blijft eindverantwoordelijk; geen beslissingen met formeel rechtsgevolg |
| 3 | **Systematische monitoring** | **JA** | Leerlingactiviteit wordt systematisch bijgehouden: loginmomenten, voortgang, chatinteracties, XP-transacties |
| 4 | **Gevoelige gegevens** of gegevens van zeer persoonlijke aard | **GEDEELTELIJK** | Geen bijzondere categorieen (Art. 9), maar chatinhoud kan incidenteel gevoelige informatie bevatten (persoonlijke omstandigheden, welzijn) |
| 5 | **Grootschalige verwerking** | **JA** | Bij uitrol naar meerdere scholen betreft het duizenden leerlingen; per school tientallen tot honderden leerlingen |
| 6 | **Koppeling of combinatie** van datasets | **NEE** | Geen koppeling met externe datasets |
| 7 | **Kwetsbare betrokkenen** | **JA** | Minderjarigen van 12-18 jaar zijn per definitie kwetsbare betrokkenen (Overweging 75 AVG) |
| 8 | **Innovatief gebruik** van technologie | **JA** | Generatieve AI (Google Gemini 2.0 Flash via Vertex AI / Large Language Model) is een innovatieve technologie, zeker in de context van onderwijs aan minderjarigen |
| 9 | **Verhindering van uitoefening recht/dienst** | **NEE** | Leerlingen worden niet verhinderd in het uitoefenen van rechten |

**Score: 5-6 van 9 criteria** -- DPIA is **verplicht**.

---

## 4. Beoordeling noodzaak en evenredigheid

### 4.1 Noodzaak (Art. 35 lid 7 sub b AVG)

| Toets | Beoordeling |
|---|---|
| **Is de verwerking noodzakelijk voor het doel?** | Ja. Digitale geletterdheid is een kerndoel in het vo-curriculum (SLO-kerndoelen). AI-begeleiding maakt gepersonaliseerd leren mogelijk dat met traditionele middelen niet haalbaar is voor grote klassen. |
| **Kan het doel zonder persoonsgegevens worden bereikt?** | Gedeeltelijk. Een volledig anoniem platform is technisch mogelijk maar ondermijnt de pedagogische waarde: docenten kunnen dan geen voortgang monitoren, en er is geen personalisatie van het leerpad. |
| **Zijn er minder ingrijpende alternatieven?** | Onderzocht: (1) Volledig offline werkboeken -- geen AI-feedback mogelijk; (2) Anonieme modus -- geen voortgangsmonitoring; (3) Alleen docent-gestuurde feedback -- niet schaalbaar. De gekozen aanpak is het minst ingrijpende alternatief dat de onderwijsdoelen nog bereikt. |

### 4.2 Evenredigheid (proportionaliteit)

| Principe | Implementatie |
|---|---|
| **Doelbinding** (Art. 5(1)(b)) | Gegevens worden uitsluitend verwerkt voor onderwijsdoeleinden. Geen commerciele profilering, geen advertenties, geen doorverkoop aan derden. |
| **Dataminimalisatie** (Art. 5(1)(c)) | Alleen strikt noodzakelijke gegevens: naam, schoolmail, rol. Geen BSN, geen woonadres, geen foto. Chatgeschiedenis is sessiegebaseerd en wordt niet persistent opgeslagen in de database. |
| **Opslagbeperking** (Art. 5(1)(e)) | Gedifferentieerde bewaartermijnen per datacategorie, technisch afgedwongen via `pg_cron` cron-jobs: ephemere data (1-7 dagen), operationele data (1 jaar), compliance data (3 jaar). |
| **Juistheid** (Art. 5(1)(d)) | Leerlingen en docenten kunnen profielgegevens aanpassen. AI-output wordt niet als feitelijke beoordeling gebruikt. |
| **Integriteit en vertrouwelijkheid** (Art. 5(1)(f)) | TLS 1.3 voor alle datatransmissie, Row-Level Security (RLS) op databaseniveau, JWT-authenticatie, rolgebaseerde toegang, prompt injection filtering. |

### 4.3 Conclusie noodzaak en evenredigheid

De verwerking is noodzakelijk en evenredig voor het bereiken van het onderwijsdoel. De ingezette middelen (dataminimalisatie, beperkte bewaartermijnen, geen commerciele verwerking) staan in verhouding tot het doel. Er is geen minder ingrijpend alternatief dat dezelfde onderwijskwaliteit biedt.

---

## 5. Risicobeoordeling

### 5.1 Methodologie

De risicobeoordeling volgt de NOREA-methodiek, in lijn met het DPIA-model van de Rijksoverheid en de richtlijnen van de AP. Risico's worden beoordeeld op:

- **Kans** (K): Laag (1) / Midden (2) / Hoog (3) / Zeer hoog (4)
- **Impact** (I): Laag (1) / Midden (2) / Hoog (3) / Zeer hoog (4)
- **Risicoscore** (R): K x I (1-4 = Laag, 5-8 = Midden, 9-12 = Hoog, 13-16 = Zeer hoog)

### 5.2 Risicomatrix

| # | Risico | Betrokkenen | K | I | R | Categorie |
|---|---|---|---|---|---|---|
| **R01** | **Onbevoegde toegang tot leerlinggegevens** - Aanvaller verkrijgt toegang tot de database met leerlingprofielen en voortgangsdata | Leerlingen, docenten | 2 | 3 | **6** | Midden |
| **R02** | **Datalek door subverwerker** - Beveiligingsincident bij Supabase, Google of Vercel leidt tot blootstelling van gegevens | Leerlingen, docenten | 2 | 3 | **6** | Midden |
| **R03** | **Prompt injection aanval** - Leerling manipuleert AI-agent om ongepaste content te genereren of systeeminstructies te onthullen | Leerlingen | 2 | 3 | **6** | Midden |
| **R04** | **AI genereert schadelijke/ongepaste content** - LLM produceert content die ongeschikt is voor minderjarigen (geweld, seksueel, discriminerend) | Leerlingen | 2 | 4 | **8** | Midden |
| **R05** | **Leerling deelt gevoelige persoonlijke informatie in chat** - Kind vertrouwt persoonlijke problemen toe aan AI-agent (misbruik, suicidaliteit, pesten) | Leerlingen | 3 | 4 | **12** | Hoog |
| **R06** | **Onjuiste AI-beoordeling van leerresultaten** - AI markeert stappen onterecht als voltooid/niet-voltooid, wat invloed heeft op voortgang | Leerlingen | 3 | 2 | **6** | Midden |
| **R07** | **Verlies van beschikbaarheid** - Platform onbereikbaar tijdens lesuren door storing bij Supabase/Vercel/Google | Leerlingen, docenten | 2 | 2 | **4** | Laag |
| **R08** | **Ongeautoriseerde toegang door docent buiten eigen klas** - Docent ziet gegevens van leerlingen die niet tot zijn/haar klas behoren | Leerlingen | 2 | 2 | **4** | Laag |
| **R09** | **Overmatige profilering van leerlingen** - Gedetailleerde activiteitsdata creert een gedrags- of prestatieprofiel dat buiten het onderwijsdoel wordt gebruikt | Leerlingen | 1 | 4 | **4** | Laag |
| **R10** | **Onvoldoende transparantie** - Leerlingen/ouders begrijpen niet hoe AI hun gegevens verwerkt | Leerlingen, ouders | 2 | 3 | **6** | Midden |
| **R11** | **Schending bewaartermijnen** - Data wordt langer bewaard dan noodzakelijk of afgesproken | Leerlingen, docenten | 2 | 2 | **4** | Laag |
| **R12** | **Doorgifte buiten EER zonder adequate waarborgen** - Persoonsgegevens worden via Google Vertex AI verwerkt; datalocatie is bevestigd als `europe-west4` (Nederland, EER) | Leerlingen | 1 | 3 | **3** | Laag |
| **R13** | **Overafhankelijkheid van AI** - Leerlingen vertrouwen blindelings op AI-output zonder kritisch denken | Leerlingen | 2 | 2 | **4** | Laag |
| **R14** | **Discriminatie of bias in AI-output** - AI-model reproduceert vooroordelen die minderjarigen benadelen op basis van taalgebruik, achtergrond of niveau | Leerlingen | 2 | 3 | **6** | Midden |
| **R15** | **Account-overname door medeleerling** - Ongeautoriseerde toegang door het delen van wachtwoorden in de klas | Leerlingen | 3 | 2 | **6** | Midden |

### 5.3 Risicomatrix visueel

```
Impact ↑
  4  |  R09,R13  |  R11      |  R05       |           |
  3  |  R12      |  R01,R02  |  R04       |           |
     |           |  R03,R06  |            |           |
     |           |  R10      |            |           |
     |           |  R14,R15  |            |           |
  2  |           |  R07,R08  |            |           |
  1  |           |           |            |           |
     +---------------------------------------------→ Kans
         1           2           3           4
```

---

## 6. Specifieke risico's voor minderjarigen

De betrokken leerlingen zijn 12 tot 18 jaar oud. Op grond van Overweging 38 en 75 van de AVG verdienen kinderen "specifieke bescherming van hun persoonsgegevens, aangezien zij zich mogelijk minder bewust zijn van de betrokken risico's, gevolgen en waarborgen en van hun rechten."

### 6.1 Verhoogde kwetsbaarheid

| Aspect | Risico voor minderjarigen | Toelichting |
|---|---|---|
| **Informatieongelijkheid** | Leerlingen begrijpen niet volledig wat er met hun data gebeurt | 12-jarigen hebben beperkt begrip van dataverwerking en privacy-implicaties |
| **Machtsverschil** | Platformgebruik is vaak verplicht vanuit school | Leerling kan niet vrij kiezen om het platform niet te gebruiken |
| **Digitale voetafdruk** | Activiteitsdata creert een digitaal profiel op jonge leeftijd | Zelfs geminimaliseerde data draagt bij aan een profiel dat jaren kan bestaan |
| **Impulsiviteit** | Jongeren delen sneller persoonlijke informatie | In chatcontext met "behulpzame" AI is de drempel voor persoonlijke onthullingen laag |
| **Groepsdruk** | Gamification (XP, levels, duels) kan sociale druk veroorzaken | Leerlingen voelen zich mogelijk verplicht om te presteren/participeren |
| **Langetermijngevolgen** | Data verzameld op 12-jarige leeftijd kan langdurige impact hebben | Zelfs na verwijdering kan data zijn gedeeld of gelekt |

### 6.2 Juridische context minderjarigen

| Wetgeving | Relevante bepaling | Implicatie voor DGSkills |
|---|---|---|
| Art. 8 AVG / UAVG | Toestemming minderjarigen: in Nederland geldt de grens van 16 jaar voor informatiemaatschappijdiensten | DGSkills opereert onder de rechtsgrondslag "publieke taak" van de school, niet op basis van toestemming van de leerling. Dit is de juiste aanpak. |
| Overweging 38 AVG | Specifieke bescherming voor kinderen | Privacy-informatie moet in eenvoudige, begrijpelijke taal |
| Art. 24 IVRK | Recht op onderwijs en ontwikkeling | Technologie moet de ontwikkeling van het kind ondersteunen, niet belemmeren |
| Code voor Kinderrechten Online | Best practices (VK-oorsprong, groeiende NL-norm) | Standaard hoge privacy-instellingen, geen manipulatief ontwerp |

---

## 7. Specifieke risico's van AI-interactie met kinderen

### 7.1 Inherente risico's van generatieve AI in onderwijscontext

| Risico | Ernst | Toelichting |
|---|---|---|
| **Hallucinaties** | Hoog | LLM's genereren soms onjuiste informatie met grote stelligheid. Leerlingen kunnen dit voor waar aannemen, wat het leerproces schaadt. |
| **Onvoorspelbare output** | Hoog | Ondanks safety settings kan een LLM onverwacht ongepaste content produceren. Bij minderjarigen is de impact hiervan groter. |
| **Parasociale relatie** | Midden | Leerlingen kunnen een emotionele band ontwikkelen met de AI-agent, wat kan leiden tot overmatig vertrouwen of emotionele afhankelijkheid. |
| **Normalisatie van AI-interactie** | Midden | Dagelijks chatten met AI kan de grens vervagen tussen menselijke en kunstmatige interactie, wat de sociale ontwikkeling kan beinvloeden. |
| **Privacy-uithollen** | Midden | De laagdrempelige chatinterface kan leerlingen verleiden om meer persoonlijke informatie te delen dan in een traditionele onderwijssetting. |
| **Manipulatie door derden** | Laag | Prompt injection door medeleerlingen of externen om de AI ongepast te laten reageren richting andere leerlingen. |

### 7.2 Agent-specifieke risico's

Op basis van analyse van de 30+ AI-agents in `config/agents.tsx`:

| Agentcategorie | Voorbeeld | Specifiek risico | Maatregel |
|---|---|---|---|
| **Sociale media / psychologie** | Social Media Psycholoog | Bespreekt gevoelige onderwerpen (verslaving, dopamine). Leerling kan persoonlijke problemen delen. | Welzijnsprotocol in system instruction; safety settings op striktst niveau |
| **Creatief schrijven** | Verhalen Ontwerper | Leerling kan gewelddadige of enge content willen genereren | Content-grenzen in system instruction; Gemini safety filters |
| **Programmeren** | Game Programmeur, App Bouwer | Lager risico; code-gericht | Standaard safety settings |
| **Alle chat-agents** | Alle 30+ agents | Leerling kan in elke chat persoonlijke/gevoelige informatie delen | Welzijnsprotocol als universele suffix in alle system instructions |

---

## 8. Maatregelen om risico's te beperken

### 8.1 Bestaande technische maatregelen

| Maatregel | Beschrijving | Adresseert risico |
|---|---|---|
| **TLS 1.3 versleuteling** | Alle communicatie is end-to-end versleuteld via HTTPS | R01, R02 |
| **JWT-authenticatie** | Elke API-aanroep vereist een geldig JWT-token via Supabase Auth | R01, R08, R15 |
| **Row-Level Security (RLS)** | Database-beleid op rijniveau: leerlingen zien alleen eigen data; docenten alleen hun klas | R01, R08 |
| **Server-side autorisatie** | `is_teacher()` helper function verifieert rol op database-niveau; RPC-functies voor gevoelige operaties | R08 |
| **Prompt injection filtering (defense-in-depth)** | Zowel client-side als server-side sanitizer met 20+ detectiepatronen (NL + EN), URI-decodering, Unicode-normalisatie | R03 |
| **Gemini Safety Settings** | Alle vier harm-categorieen op `BLOCK_LOW_AND_ABOVE` (striktst beschikbare niveau) | R04 |
| **Welzijnsprotocol** | System instruction bevat protocol voor detectie van suicidaliteit, misbruik, pesten met doorverwijzing naar Kindertelefoon/113 | R05 |
| **XP farming detectie** | AI-agents herkennen en weigeren niet-serieuze berichten die bedoeld zijn om XP te "farmen" | R06, R13 |
| **CORS-whitelist** | Alleen `dgskills.app` en lokale dev-URLs zijn toegestaan | R01 |
| **Rate limiting** | HTTP 429-propagatie vanuit Vertex AI voorkomt misbruik | R01, R03 |
| **Cascade delete** | ON DELETE CASCADE op alle 28 child tables garandeert volledige verwijdering | R11 |
| **Automatische data-opschoning** | pg_cron jobs voor gedifferentieerde bewaartermijnen (1 dag - 3 jaar) | R09, R11 |
| **Audit logging** | Alle AVG-gerelateerde acties worden gelogd (export, verwijdering, restrictie) | R10 |
| **Server-side Vertex AI service account** | Authenticatie via service account (OAuth2/JWT), credentials worden nooit blootgesteld aan de client | R01, R03 |
| **Sessiegebaseerde chatgeschiedenis** | Chatberichten worden niet persistent opgeslagen in de database; alleen in client-geheugen | R05, R09 |
| **3-stappenmethode in AI-responses** | Gestructureerde antwoorden: erkenning, uitleg, challenge. Voorkomt ongestructureerde output. | R04, R06 |
| **Processing restriction flag** | `processing_restricted` kolom in users-tabel met index; mogelijkheid tot verwerkingsbeperking (Art. 18) | R09 |

### 8.2 Bestaande organisatorische maatregelen

| Maatregel | Beschrijving | Adresseert risico |
|---|---|---|
| **Privacyverklaring** | Beschikbaar en toegankelijk voor leerlingen, ouders en docenten | R10 |
| **Privacy-explainer voor scholen** | Begrijpelijk overzichtsdocument voor schoolleiding en inkoop | R10 |
| **DPA-template** | Verwerkersovereenkomst beschikbaar (moet nog worden ondertekend per school) | R02, R09 |
| **DPIA-supporttemplate** | Scholen kunnen eigen DPIA-invulling maken op basis van template | R10 |
| **Datastroomoverzicht** | Transparant overzicht van alle verwerkingsactiviteiten | R10 |
| **Docent als eindverantwoordelijke** | AI neemt geen beslissingen met rechtsgevolg; docent heeft overzicht en controle | R06, R13 |
| **Geen commerciele verwerking** | Geen advertenties, geen profilering voor marketing, geen doorverkoop | R09 |
| **AI-transparantieverklaring** | Uitleg op platform dat leerlingen met AI communiceren, inclusief beperkingen | R10, R13 |

### 8.3 Aanvullende maatregelen (nog te implementeren)

| # | Maatregel | Type | Adresseert risico | Prioriteit | Geschatte doorlooptijd |
|---|---|---|---|---|---|
| **A01** | **DPA ondertekenen per school** - Formaliseer verwerkersovereenkomst op basis van Model 4.0 Privacyconvenant Onderwijs | Organisatorisch | R02, R09, R12 | **Blokkerend** | 1-2 weken |
| **A02** | **Verwerkingsregister opstellen** (Art. 30 AVG) - Formeel register van alle verwerkingsactiviteiten | Organisatorisch | R09, R10 | **Blokkerend** | 1 week |
| **A03** | **Datalekregister en -procedure operationaliseren** - Inclusief 72-uurs meldprotocol richting AP | Organisatorisch | R02 | **Blokkerend** | 1 week |
| **A04** | **Contactgegevens invullen in privacy-documenten** - Verwijder alle `[invullen]` placeholders | Organisatorisch | R10 | **Blokkerend** | 2 uur |
| **A05** | ~~Google Gemini EER-datalocatie contractueel bevestigen~~ **Afgerond** - Migratie naar Google Vertex AI (`europe-west4`, Nederland) is voltooid. Data at rest en ML-verwerking in regio gegarandeerd door Google. Zero data retention. Google Cloud DPA met SCC's van toepassing. Authenticatie via service account (OAuth2/JWT). Het ToS-probleem met minderjarigen onder 18 is opgelost: de Gemini Developer API Terms of Service (die gebruik door minderjarigen verbieden) zijn niet langer van toepassing; Vertex AI valt onder de Google Cloud Platform enterprise-voorwaarden die dit niet beperken. | Juridisch/Technisch | R12 | ~~Hoog~~ **Afgerond** | Voltooid |
| **A06** | **Docent-override voor STEP_COMPLETE** - Docent moet AI-gegenereerde voortgangsmarkeringen kunnen corrigeren (Art. 14 AI Act) | Technisch | R06, R13 | **Hoog** | 2-4 weken |
| **A07** | **Periodieke AI-outputvalidatie** - Steekproefsgewijze beoordeling van AI-responses op kwaliteit, juistheid en gepastheid | Organisatorisch | R04, R06, R14 | **Hoog** | Doorlopend |
| **A08** | **Privacy-informatie in leeftijdsgeschikte taal** - Aanvullende uitleg specifiek voor 12-14 jarigen | Organisatorisch | R10 | **Midden** | 1 week |
| **A09** | **Aansluiting Privacyconvenant Onderwijs** - Gebruik Model DPA 4.0 en word erkend leverancier | Organisatorisch | R02, R10 | **Midden** | 6-10 weken |
| **A10** | **Penetratietest door externe partij** - Onafhankelijke security audit van het platform | Technisch | R01, R03, R15 | **Midden** | 2-4 weken |
| **A11** | **Bias-audit op AI-output** - Testen of AI-agents gelijkwaardig reageren ongeacht taalgebruik, achtergrond of niveau van de leerling | Organisatorisch | R14 | **Midden** | 4-6 weken |
| **A12** | **Incidentresponsplan formaliseren** - Draaiboek voor scenario's: datalek, ongepaste AI-output, welzijnssignaal | Organisatorisch | R02, R04, R05 | **Midden** | 1 week |
| **A13** | **Registratie EU AI-database** (Art. 49 AI Act) - Verplichte registratie voor hoog-risico AI-systemen | Juridisch | R10 | **Voor 2 aug 2026** | 1 week |
| **A14** | **Technische documentatie Annex IV** (Art. 11 AI Act) - Formele technische documentatie van het AI-systeem | Juridisch | R10 | **Voor 2 aug 2026** | 4-6 weken |
| **A15** | **Risicobeheersysteem documenteren** (Art. 9 AI Act) - Continu risicomanagement voor het AI-systeem | Organisatorisch | Alle | **Voor 2 aug 2026** | 4-6 weken |

---

## 9. Restrisico-analyse na maatregelen

Na implementatie van alle bestaande en aanvullende maatregelen:

| # | Risico | Oorspronkelijk (R) | Na maatregelen (R) | Restrisico-oordeel |
|---|---|---|---|---|
| R01 | Onbevoegde toegang | 6 (Midden) | **3 (Laag)** | Acceptabel - TLS, JWT, RLS, penetratietest |
| R02 | Datalek subverwerker | 6 (Midden) | **4 (Laag)** | Acceptabel - DPA's, datalekprocedure, monitoring |
| R03 | Prompt injection | 6 (Midden) | **3 (Laag)** | Acceptabel - Defense-in-depth sanitizer, safety settings |
| R04 | Ongepaste AI-content | 8 (Midden) | **4 (Laag)** | Acceptabel - Safety settings BLOCK_LOW_AND_ABOVE, outputvalidatie |
| R05 | Gevoelige info in chat | 12 (Hoog) | **6 (Midden)** | **Nader te monitoren** - Welzijnsprotocol actief; chatdata is sessiegebaseerd; inherent risico bij AI-chatinteractie met minderjarigen |
| R06 | Onjuiste AI-beoordeling | 6 (Midden) | **3 (Laag)** | Acceptabel - Docent-override, menselijk toezicht |
| R07 | Beschikbaarheidsverlies | 4 (Laag) | **3 (Laag)** | Acceptabel - Multi-provider architectuur |
| R08 | Ongeautoriseerde docenttoegang | 4 (Laag) | **2 (Laag)** | Acceptabel - RLS, is_teacher(), school-scoped toegang |
| R09 | Overmatige profilering | 4 (Laag) | **2 (Laag)** | Acceptabel - Dataminimalisatie, geen commercieel gebruik, bewaartermijnen |
| R10 | Onvoldoende transparantie | 6 (Midden) | **3 (Laag)** | Acceptabel - Privacy-docs, leeftijdsgeschikte uitleg, AI-transparantie |
| R11 | Schending bewaartermijnen | 4 (Laag) | **2 (Laag)** | Acceptabel - pg_cron automatische opschoning |
| R12 | Doorgifte buiten EER | ~~6 (Midden)~~ 3 (Laag) | **2 (Laag)** | Acceptabel -- Vertex AI in `europe-west4` (Nederland); Google Cloud DPA met SCC's; zero data retention; datalocatie contractueel gegarandeerd |
| R13 | Overafhankelijkheid AI | 4 (Laag) | **2 (Laag)** | Acceptabel - AI-geletterdheid in curriculum, docent als eindverantwoordelijke |
| R14 | Bias in AI-output | 6 (Midden) | **4 (Laag)** | Acceptabel - Bias-audit, outputvalidatie |
| R15 | Account-overname | 6 (Midden) | **4 (Laag)** | Acceptabel - JWT, session management |

### Restrisico-oordeel

Na implementatie van alle maatregelen resteert een **midden restrisico** voor R05 (gevoelige informatie in chat). Dit is een inherent risico van AI-chatinteractie met minderjarigen dat niet volledig kan worden gemitigeerd. De combinatie van welzijnsprotocol, sessiegebaseerde opslag (geen persistente chatdatabase) en Gemini safety settings reduceert dit risico tot een aanvaardbaar niveau, mits:

1. Het welzijnsprotocol regelmatig wordt getest en bijgewerkt
2. Er een escalatiepad is naar de school bij welzijnssignalen
3. Docenten worden geinstrueerd over het herkennen van signalen

Alle overige risico's worden na maatregelen als **laag** beoordeeld.

---

## 10. Rechten van betrokkenen

### 10.1 Implementatie AVG-rechten

| Recht | Artikel AVG | Technische implementatie | Status |
|---|---|---|---|
| **Recht op informatie** | Art. 13-14 | Privacyverklaring, cookiebeleid, AI-transparantieverklaring | Geimplementeerd |
| **Recht op inzage** | Art. 15 | `exportMyData` Edge Function: volledige data-export als JSON uit 17+ tabellen | Geimplementeerd |
| **Recht op rectificatie** | Art. 16 | Profielwijzigingen via de applicatie | Geimplementeerd |
| **Recht op verwijdering** | Art. 17 | `deleteMyAccount` Edge Function: CASCADE delete over 28 tabellen + auth.users | Geimplementeerd |
| **Recht op beperking** | Art. 18 | `restrictProcessing` Edge Function: markering + audit log | Geimplementeerd |
| **Recht op overdraagbaarheid** | Art. 20 | `exportMyData` met gestructureerd JSON-formaat en Content-Disposition header | Geimplementeerd |
| **Recht van bezwaar** | Art. 21 | Via school (verwerkingsverantwoordelijke); DGSkills faciliteert | Procedure beschikbaar |
| **Recht m.b.t. geautomatiseerde besluitvorming** | Art. 22 | Geen geautomatiseerde beslissingen met rechtsgevolg; docent is eindverantwoordelijk | Niet van toepassing |

### 10.2 Procedure en doorlooptijden

| Verzoektype | Initiatie | Doorlooptijd | Audit trail |
|---|---|---|---|
| Data-export (Art. 15/20) | Self-service in applicatie | Direct (realtime) | `gdpr_data_export` in audit_logs |
| Accountverwijdering (Art. 17) | Self-service in applicatie | Direct (realtime) | `gdpr_account_deletion_initiated` in audit_logs |
| Verwerkingsbeperking (Art. 18) | Self-service in applicatie | Registratie: direct; afhandeling school: 72 uur | `gdpr_processing_restriction_requested` in audit_logs |
| Overige verzoeken | Via school (verwerkingsverantwoordelijke) | Wettelijk: max 1 maand (Art. 12 lid 3) | Handmatige registratie |

### 10.3 Specifieke overwegingen voor minderjarigen

- Verzoeken kunnen worden ingediend door de leerling zelf (self-service functies) of door ouders/wettelijk vertegenwoordigers via de school
- De school als verwerkingsverantwoordelijke bepaalt het beleid rondom toestemming en verzoekafhandeling voor minderjarigen
- Privacy-informatie dient beschikbaar te zijn in taal die voor 12-jarigen begrijpelijk is

---

## 11. Doorgifte buiten de EER

### 11.1 Overzicht datalocaties

| Component | Provider | Primaire locatie | Binnen EER? | Juridische basis |
|---|---|---|---|---|
| Database (PostgreSQL) | Supabase (AWS) | `eu-west-1` (Ierland) | **Ja** | Verwerkersovereenkomst |
| Edge Functions | Supabase (Deno/AWS) | `eu-west-1` (Ierland) | **Ja** | Verwerkersovereenkomst |
| Frontend hosting | Vercel | EU CDN-nodes | **Ja** (primair) | Verwerkersovereenkomst |
| AI-verwerking | Google Vertex AI (Gemini 2.0 Flash) | `europe-west4` (Nederland) | **Ja** | Google Cloud DPA met SCC's; zero data retention; service account auth |
| Authenticatie | Supabase Auth | `eu-west-1` | **Ja** | Verwerkersovereenkomst |

### 11.2 Google Vertex AI -- datalocatie bevestigd

DGSkills is gemigreerd van de directe Gemini Developer API (`generativelanguage.googleapis.com`) naar **Google Vertex AI** met het regionale endpoint `europe-west4-aiplatform.googleapis.com` (Nederland). Hiermee zijn alle eerder geidentificeerde aandachtspunten rondom doorgifte buiten de EER opgelost:

| Aspect | Situatie na migratie |
|---|---|
| **Endpoint** | `europe-west4-aiplatform.googleapis.com` (Vertex AI, Nederland) |
| **Authenticatie** | Service account (OAuth2/JWT) -- geen API-sleutel meer |
| **Data at rest** | Google garandeert opslag in `europe-west4` (Nederland) |
| **ML-verwerking** | Vindt plaats binnen de geselecteerde regio (`europe-west4`) |
| **Data retention** | Zero data retention door Google -- input/output wordt niet opgeslagen na verwerking |
| **Training op inputdata** | Nee -- Google gebruikt geen klantdata voor modeltraining via Vertex AI |
| **Contractuele waarborg** | Google Cloud Data Processing Addendum (DPA) met Standard Contractual Clauses (SCC's) |
| **ToS-probleem minderjarigen** | **Opgelost.** De Gemini Developer API Terms of Service verbieden gebruik door/voor gebruikers onder 18 jaar. Door de migratie naar Vertex AI valt DGSkills onder de Google Cloud Platform enterprise-voorwaarden, die deze leeftijdsbeperking niet kennen. Dit was een blokkerende juridische kwestie voor gebruik in het voortgezet onderwijs die nu volledig is geadresseerd. |

**Conclusie:** Er is geen sprake meer van doorgifte buiten de EER voor AI-verwerking. Alle data blijft binnen Nederland (`europe-west4`). Een Transfer Impact Assessment (TIA) is voor deze component niet meer noodzakelijk.

---

## 12. Subverwerkers

| Subverwerker | Dienst | Locatie | Contractuele waarborg | AVG-status |
|---|---|---|---|---|
| **Supabase Inc.** | Database, authenticatie, Edge Functions, storage | AWS `eu-west-1` (Ierland, EER) | DPA met SCC's | Adequaat |
| **Google LLC** | Vertex AI -- Gemini 2.0 Flash (AI-verwerking) | `europe-west4` (Nederland, EER) | Google Cloud DPA met SCC's; zero data retention; enterprise-voorwaarden (geen leeftijdsbeperking) | **Adequaat** |
| **Vercel Inc.** | Frontend hosting, CDN | EU CDN-nodes (primair) | DPA met SCC's | Adequaat |
| **Amazon Web Services (via Supabase)** | Onderliggende cloudinfrastructuur | `eu-west-1` (Ierland, EER) | AWS DPA; SCC's | Adequaat |

Alle subverwerkers dienen te worden opgenomen in een subverwerkersbijlage bij de verwerkersovereenkomst met de school. De school moet in kennis worden gesteld van wijzigingen in subverwerkers (Art. 28 lid 2 AVG).

---

## 13. EU AI Act overwegingen

### 13.1 Classificatie

DGSkills valt onder **hoog risico** op grond van Annex III punt 3(b) van de EU AI Act (Verordening EU 2024/1689):

> "AI-systemen bestemd voor evaluatie van leerresultaten, waaronder die evaluatie wordt gebruikt om het leerproces van natuurlijke personen te sturen in het onderwijs."

Dit is van toepassing omdat:
- AI-agents genereren `STEP_COMPLETE` markers die voortgang registreren
- XP-toekenning en level-progressie worden beinvloed door AI-interactie
- Het leerproces wordt gestuurd op basis van AI-beoordelingen

### 13.2 Verplichtingen en status

| Artikel AI Act | Verplichting | Status | Deadline |
|---|---|---|---|
| Art. 4 | AI-geletterdheid aanbieden | **Voldaan** | 2 feb 2025 |
| Art. 9 | Risicobeheersysteem | **Nog niet voldaan** | 2 aug 2026 |
| Art. 10 | Data governance | **Gedeeltelijk** | 2 aug 2026 |
| Art. 11 | Technische documentatie (Annex IV) | **Nog niet voldaan** | 2 aug 2026 |
| Art. 12 | Traceerbaarheid/logging | **Voldaan** | 2 aug 2026 |
| Art. 13 | Transparantie | **Voldaan** | 2 aug 2026 |
| Art. 14 | Menselijk toezicht | **Gedeeltelijk** (docent-override nodig) | 2 aug 2026 |
| Art. 15 | Nauwkeurigheid, robuustheid | **Gedeeltelijk** | 2 aug 2026 |
| Art. 49 | Registratie EU AI-database | **Nog niet voldaan** | 2 aug 2026 |
| Art. 50 | Transparantieplichten | **Voldaan** | 2 aug 2026 |

### 13.3 Samenloop DPIA en AI Act

De hoog-risico classificatie onder de AI Act versterkt de noodzaak van deze DPIA. Art. 26 lid 9 AI Act bepaalt dat deployers (de school) een DPIA moeten uitvoeren conform Art. 35 AVG wanneer zij een hoog-risico AI-systeem inzetten. Deze DPIA dient beide doelen.

---

## 14. Conclusie en actieplan

### 14.1 Algeheel oordeel

DGSkills beschikt over een **bovengemiddeld** privacy- en securityprofiel voor een EdTech-startup. De technische implementatie van AVG-rechten (export, verwijdering, verwerkingsbeperking), de defense-in-depth benadering voor prompt injection, de gedifferentieerde bewaartermijnen en de Gemini safety settings zijn van hoog niveau.

Na implementatie van de aanvullende maatregelen zijn de risico's voor de rechten en vrijheden van betrokkenen tot een **aanvaardbaar niveau** terug te brengen.

**Het restrisico is acceptabel**, mits:
1. Alle als "blokkerend" gemarkeerde aanvullende maatregelen worden geimplementeerd voor lancering
2. De Google Vertex AI datalocatie (`europe-west4`, Nederland) contractueel geborgd blijft (dit is reeds het geval)
3. De AI Act-verplichtingen voor 2 augustus 2026 worden vervuld

### 14.2 Actieplan met prioritering

#### FASE 1: Blokkerend (voor lancering / eerste pilotscholen)

| # | Actie | Verantwoordelijke | Deadline | Status |
|---|---|---|---|---|
| A01 | DPA ondertekenen per school (Model 4.0) | Future Architect + school | Voor eerste pilot | Open |
| A02 | Verwerkingsregister opstellen (Art. 30) | Future Architect | Binnen 2 weken | Open |
| A03 | Datalekregister en -procedure | Future Architect | Binnen 2 weken | Open |
| A04 | Contactgegevens invullen in privacy-docs | Future Architect | Binnen 1 week | Open |

#### FASE 2: Hoog (binnen 3 maanden)

| # | Actie | Verantwoordelijke | Deadline | Status |
|---|---|---|---|---|
| A05 | ~~Google Gemini EER-datalocatie bevestigen~~ Migratie naar Vertex AI (`europe-west4`) voltooid | Future Architect | ~~Binnen 4 weken~~ | **Afgerond** |
| A06 | Docent-override voor STEP_COMPLETE | Future Architect (dev) | Binnen 4 weken | Open |
| A07 | Periodieke AI-outputvalidatie opzetten | Future Architect | Doorlopend | Open |
| A08 | Privacy-informatie in leeftijdsgeschikte taal | Future Architect | Binnen 6 weken | Open |
| A09 | Aansluiting Privacyconvenant Onderwijs | Future Architect | Binnen 10 weken | Open |
| A10 | Penetratietest door externe partij | Future Architect | Binnen 3 maanden | Open |
| A11 | Bias-audit op AI-output | Future Architect | Binnen 3 maanden | Open |
| A12 | Incidentresponsplan formaliseren | Future Architect | Binnen 4 weken | Open |

#### FASE 3: Voor AI Act-deadline (2 augustus 2026)

| # | Actie | Verantwoordelijke | Deadline | Status |
|---|---|---|---|---|
| A13 | Registratie EU AI-database (Art. 49) | Future Architect | Voor 2 aug 2026 | Open |
| A14 | Technische documentatie Annex IV (Art. 11) | Future Architect | Voor 2 aug 2026 | Open |
| A15 | Risicobeheersysteem documenteren (Art. 9) | Future Architect | Voor 2 aug 2026 | Open |

### 14.3 Herbeoordelingsmomenten

Deze DPIA wordt herbeoordeeld:
- **Jaarlijks** (uiterlijk 23 februari 2027)
- Bij **significante wijzigingen** in de verwerking (nieuw AI-model, nieuwe datacategorieen, nieuwe subverwerker)
- Bij **beveiligingsincidenten** die van invloed zijn op de risicobeoordeling
- Bij **wijzigingen in wet- of regelgeving** (zoals inwerkingtreding AI Act-verplichtingen per 2 augustus 2026)

---

## 15. Voorafgaand overleg met AP

### 15.1 Is voorafgaand overleg met de AP nodig?

Op grond van Art. 36 AVG is voorafgaand overleg met de Autoriteit Persoonsgegevens vereist wanneer uit de DPIA blijkt dat de verwerking een **hoog risico** zou opleveren **zonder dat de verwerkingsverantwoordelijke maatregelen neemt om het risico te beperken**.

**Beoordeling:**

| Criterium | Beoordeling |
|---|---|
| Blijft er een hoog restrisico na maatregelen? | **Nee** - na implementatie van alle aanvullende maatregelen is het restrisico teruggebracht tot laag/midden |
| Zijn de maatregelen toereikend? | **Ja** - de combinatie van technische en organisatorische maatregelen adresseert alle geidentificeerde risico's |
| Zijn er risico's die niet gemitigeerd kunnen worden? | **Eeen restrisico (R05)** blijft op midden niveau, maar dit is inherent aan AI-chatinteractie met minderjarigen en wordt geaccepteerd met aanvullende monitoring |

### 15.2 Conclusie voorafgaand overleg

**Voorafgaand overleg met de AP is op dit moment NIET nodig**, mits:
1. Alle blokkerende maatregelen (Fase 1) worden geimplementeerd voor lancering
2. De Google Vertex AI datalocatie in `europe-west4` (Nederland) contractueel geborgd blijft (dit is reeds het geval via het Google Cloud DPA met SCC's)
3. Het restrisico R05 wordt actief gemonitord en jaarlijks herbeoordeeld

Door de migratie naar Google Vertex AI met regionale verwerking in Nederland is het eerder geidentificeerde risico van doorgifte buiten de EER voor AI-verwerking volledig geadresseerd.

---

## 16. Accordering en ondertekening

### Door de verwerker (Future Architect / DGSkills)

| Veld | Waarde |
|---|---|
| Naam | _________________________________ |
| Functie | _________________________________ |
| Datum | _________________________________ |
| Handtekening | _________________________________ |

### Door de verwerkingsverantwoordelijke (School)

| Veld | Waarde |
|---|---|
| Schoolnaam | _________________________________ |
| Naam FG / privacycontactpersoon | _________________________________ |
| Functie | _________________________________ |
| Datum | _________________________________ |
| Handtekening | _________________________________ |
| Oordeel | [ ] Akkoord -- risico's aanvaardbaar |
| | [ ] Akkoord onder voorwaarden: _________________________ |
| | [ ] Niet akkoord -- aanvullend overleg nodig |

---

## Bijlage A: Bronnen en referenties

| Bron | Referentie |
|---|---|
| AVG / GDPR | Verordening (EU) 2016/679 |
| EU AI Act | Verordening (EU) 2024/1689 |
| UAVG | Uitvoeringswet AVG (Nederland) |
| AP DPIA-lijst | Besluit BWBR0042812 - [Lijst verplichte DPIA](https://www.autoriteitpersoonsgegevens.nl/documenten/lijst-verplichte-dpia) |
| WP29 DPIA-richtlijnen | WP 248 rev.01 - [EDPB endorsed guidelines](https://www.edpb.europa.eu/our-work-tools/general-guidance/endorsed-wp29-guidelines_en) |
| AI Act Annex III | [High-Risk AI Systems](https://artificialintelligenceact.eu/annex/3/) |
| Kennisnet AI-wetgeving | [Wetgeving rond AI en het onderwijs](https://www.kennisnet.nl/artificial-intelligence/wetgeving-rond-ai-en-het-onderwijs/) |
| SIVON DPIA-richtlijn | [DPIA's op proces of applicatie](https://sivon.nl/dpias-op-proces-of-applicatie/) |
| ICO DPIA-guidance | [When do we need to do a DPIA](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/data-protection-impact-assessments-dpias/when-do-we-need-to-do-a-dpia/) |
| Supabase regio's | [Available regions](https://supabase.com/docs/guides/platform/regions) |
| Google Cloud / Vertex AI terms | [Google Cloud Terms of Service](https://cloud.google.com/terms) |
| Google Cloud DPA | [Google Cloud Data Processing Addendum](https://cloud.google.com/terms/data-processing-addendum) |
| Vertex AI data residency | [Vertex AI Locations](https://cloud.google.com/vertex-ai/docs/general/locations) |
| Google Gemini Developer API ToS (historisch) | [Gemini API Terms of Service](https://ai.google.dev/gemini-api/terms) -- niet langer van toepassing na migratie naar Vertex AI |

## Bijlage B: Technische bestanden geanalyseerd

| Bestand | Inhoud |
|---|---|
| `supabase/functions/chat/index.ts` | AI-chatproxy met JWT-auth, prompt sanitizer, Gemini safety settings |
| `supabase/functions/_shared/promptSanitizer.ts` | 20+ prompt injection detectiepatronen (NL+EN), defense-in-depth |
| `supabase/functions/exportMyData/index.ts` | AVG Art. 20 data-export (17+ tabellen) |
| `supabase/functions/deleteMyAccount/index.ts` | AVG Art. 17 accountverwijdering met CASCADE delete |
| `supabase/functions/restrictProcessing/index.ts` | AVG Art. 18 verwerkingsbeperking |
| `supabase/migrations/20260222030000_teacher_rls_policies.sql` | RLS-beleid, is_teacher() helper, server-side RPC |
| `supabase/migrations/20260222000000_add_processing_restriction.sql` | Processing restriction kolom en index |
| `supabase/migrations/20260221_add_data_retention_policies.sql` | pg_cron bewaartermijnen (1 dag - 3 jaar) |
| `supabase/migrations/20260222010000_cascade_delete_policies.sql` | ON DELETE CASCADE op 28 tabellen |
| `config/agents.tsx` | 30+ AI-agents met system instructions, welzijnsprotocol, XP-farming detectie |

---

*Dit document is opgesteld door Future Architect ter ondersteuning van de verwerkingsverantwoordelijke (school) bij de uitvoering van de DPIA conform Art. 35 AVG. De school dient dit document te beoordelen, aan te vullen met schoolspecifieke informatie en formeel te accorderen.*

*Einde document.*
