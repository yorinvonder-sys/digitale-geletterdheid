# Continuiteitsplan DGSkills

**Document:** Continuiteitsplan en noodprotocol
**Organisatie:** DGSkills.app, eenmanszaak
**KvK-nummer:** 81819889
**Ondernemer:** Yorin Vonder
**Versie:** 1.0
**Datum:** 3 april 2026
**Classificatie:** Vertrouwelijk — ter inzage voor scholen en ICT-coördinatoren

---

## Inhoudsopgave

1. [Doel van dit plan](#1-doel-van-dit-plan)
2. [Huidige situatie](#2-huidige-situatie)
3. [Risico-inventarisatie](#3-risico-inventarisatie)
4. [Maatregelen per scenario](#4-maatregelen-per-scenario)
5. [Technische continuïteit](#5-technische-continuïteit)
6. [Data-eigenaarschap en portabiliteit](#6-data-eigenaarschap-en-portabiliteit)
7. [Escrow-voorstel](#7-escrow-voorstel)
8. [Noodprotocol contactgegevens](#8-noodprotocol-contactgegevens)

---

## 1. Doel van dit plan

Dit continuiteitsplan beschrijft hoe DGSkills borgt dat scholen — en in het bijzonder hun leerlingen en docenten — ook bij onvoorziene omstandigheden toegang houden tot het platform, hun gegevens veilig blijven, en er een ordelijke afbouw of overdracht mogelijk is als dat nodig mocht zijn.

Het plan richt zich op drie belangen die scholen hebben bij een SaaS-dienst:

1. **Toegankelijkheid:** het platform blijft beschikbaar voor lessen, ook als de ondernemer tijdelijk niet bereikbaar is.
2. **Data-eigenaarschap:** schoolgegevens blijven te allen tijde eigendom van de school en zijn exporteerbaar.
3. **Waardig afscheid:** als DGSkills ophoudt te bestaan, heeft de school voldoende tijd en middelen om over te stappen naar een alternatief.

Dit document is opgesteld om transparant te zijn naar beslissers binnen scholen en schoolbesturen en vormt een onderdeel van het compliance-pakket dat scholen kunnen opvragen bij procurement.

---

## 2. Huidige situatie

DGSkills is een eenmanszaak gedreven door één persoon (Yorin Vonder, KvK 81819889). Het platform is volledig gebouwd op beheerde clouddiensten (managed services), wat de afhankelijkheid van één persoon voor de dagelijkse operatie sterk beperkt.

### Technische infrastructuur

| Laag | Dienst | Aanbieder | Beheer |
|------|--------|-----------|--------|
| Frontend (website + app) | Vercel | Vercel Inc. | Automatisch, CI/CD |
| Database + authenticatie | Supabase | Supabase Inc. | Managed PostgreSQL, RLS |
| AI-verwerking | Vertex AI (Gemini) | Google Cloud | europe-west4 |
| Domein | dgskills.app | Registrar | Jaarlijkse verlenging |

### Wat dit betekent voor continuïteit

Omdat alle kerndiensten draaien op enterprise-grade managed platforms met eigen SLA's, is het platform niet afhankelijk van een lokale server of handmatig beheer door de ondernemer. Het platform draait in feite autonoom zolang de abonnementen actief zijn.

### Beperkingen van een eenmanszaak

Het eerlijk benoemen van risico's hoort bij transparantie:

- Er is geen tweede ontwikkelaar die het platform direct kan overnemen.
- Er is geen groot bedrijf achter DGSkills dat financiële schokken opvangt.
- Bij langdurige uitval van de ondernemer zijn tijdelijk verminderde diensten of vertraagde updates mogelijk.

Dit plan beschrijft per scenario welke maatregelen getroffen zijn om deze risico's te beheersen.

---

## 3. Risico-inventarisatie

| Risico | Kans | Impact voor school | Maatregel |
|--------|------|--------------------|-----------|
| Korte ziekte / vakantie ondernemer (<2 weken) | Hoog | Laag — platform draait autonoom | Zie scenario A |
| Langere uitval ondernemer (2-8 weken) | Laag | Midden — geen nieuwe features, support vertraagd | Zie scenario B |
| Financieel faillissement DGSkills | Zeer laag | Hoog — platform mogelijk offline | Zie scenario C |
| Permanente uitval / bedrijfsbeëindiging | Zeer laag | Hoog — dataverlies als geen maatregelen | Zie scenario C |
| Uitval managed service (Vercel/Supabase) | Laag | Midden — tijdelijk onbeschikbaar | Zie sectie 5 |
| Datalekincident | Laag | Hoog | Beveiligingsbijlage + DPIA |
| Domeinverlies (niet verlengd) | Zeer laag | Hoog — platform onbereikbaar | Automatische verlenging + alert |

---

## 4. Maatregelen per scenario

### Scenario A — Korte uitval ondernemer (minder dan 2 weken)

**Situatie:** Ondernemer is tijdelijk niet beschikbaar wegens ziekte, vakantie of persoonlijke omstandigheden.

**Effect op het platform:**
- Het platform draait volledig autonoom op Vercel en Supabase.
- Leerlingen en docenten kunnen zonder onderbreking inloggen en werken.
- Automatische back-ups van de database blijven draaien.
- Er zijn geen handmatige handelingen nodig om het platform online te houden.

**Wat er niet beschikbaar is:**
- Persoonlijke supportreacties kunnen vertraagd zijn (binnen 5 werkdagen in plaats van 1-2).
- Nieuwe features of updates worden niet uitgerold.

**Communicatie:** Als uitval langer dan 3 werkdagen verwacht wordt, ontvangen contactpersonen van scholen een automatische notificatie via e-mail.

---

### Scenario B — Langere uitval ondernemer (2 tot 8 weken)

**Situatie:** Ondernemer is voor langere tijd niet beschikbaar wegens ernstige ziekte, hospitalisatie of vergelijkbare omstandigheid.

**Maatregelen:**

1. **Noodcontactpersoon:** Er is een aangewezen noodcontact (zie sectie 8) die scholen kan bereiken voor urgente zaken en toegang heeft tot de noodprocedure-instructies.

2. **Credentials-toegang:** In een versleutelde noodkluis (zie sectie 8) zijn de inloggegevens voor Vercel, Supabase en het domeinregistrar opgeslagen. De noodcontactpersoon kan hiermee:
   - Bevestigen dat abonnementen actief blijven en rekeningen worden betaald.
   - Kritieke beveiligingsproblemen escaleren naar de managed service providers.
   - Een technische freelancer of opvolger toegang geven tot de infrastructuur.

3. **Communicatie naar scholen:** Binnen 5 werkdagen na het intreden van scenario B worden alle school-contactpersonen schriftelijk geïnformeerd over:
   - De verwachte duur van de uitval.
   - Welk alternatief contactkanaal beschikbaar is.
   - Of en wanneer normale dienstverlening wordt hervat.

4. **SLA-afwijking:** Gedurende scenario B geldt een aangepaste SLA. Scholen hebben het recht de overeenkomst per direct op te zeggen als de uitval langer dan 8 weken duurt, zonder opzegtermijn.

---

### Scenario C — Permanente uitval of bedrijfsbeëindiging

**Situatie:** DGSkills houdt op te bestaan, wegens faillissement, bedrijfsbeëindiging of overlijden van de ondernemer.

**Maatregelen:**

1. **Aankondigingstermijn:** DGSkills verplicht zich tot een aankondigingstermijn van minimaal **90 kalenderdagen** voor gecontroleerde beëindiging. Dit geeft scholen de tijd een alternatief te regelen.

2. **Data-export:** Scholen ontvangen vóór beëindiging een volledige export van hun gegevens in machineleesbaar formaat (CSV en JSON). Zie sectie 6 voor de exacte inhoud.

3. **Escrow:** De broncode van het platform is — of wordt bij eerste pilot-overeenkomst — in escrow geplaatst bij een onafhankelijke partij. Bij faillissement of overlijden kunnen scholen (gezamenlijk of via een bestuur) de broncode opvragen om het platform zelf of via een derde partij voort te zetten. Zie sectie 7.

4. **Dataverwijdering:** Na afgifte van de export worden alle schoolgegevens uit de Supabase-database verwijderd conform de verwerkersovereenkomst, uiterlijk 30 dagen na beëindiging.

5. **Onvoorziene permanente uitval (overlijden):** De noodcontactpersoon (sectie 8) is gemachtigd om in dit geval de escrow-procedure in gang te zetten en scholen te informeren. De instructies hiervoor zijn vastgelegd in de noodkluis.

---

## 5. Technische continuïteit

### 5.1 Managed services — uptime en SLA

| Dienst | Uptime SLA | Back-up | Failover |
|--------|-----------|---------|---------|
| Vercel (frontend) | 99,99% | Automatisch (edge) | Globaal CDN |
| Supabase (database + auth) | 99,9% | Dagelijks, 30 dagen bewaard | Point-in-time recovery |
| Google Cloud / Vertex AI | 99,9% | Niet van toepassing (stateless) | europe-west4 multi-zone |

### 5.2 Automatische deployments

Het platform gebruikt een CI/CD-pipeline via Vercel. Bij elke codewijziging worden automatisch tests uitgevoerd en de nieuwe versie uitgerold. Er is geen handmatige deployment nodig voor normale updates.

### 5.3 Database back-ups

Supabase voert dagelijkse back-ups uit van de volledige database, met een bewaarperiode van 30 dagen. Point-in-time recovery is beschikbaar. Back-ups worden opgeslagen in de EU (Frankfurt).

### 5.4 Domeinbeheer

Het domein dgskills.app is ingesteld met automatische verlenging en heeft een e-mailalert ingesteld bij 60 en 30 dagen voor verloopdatum. De domeinnaam wordt ook in de noodkluis gedocumenteerd.

### 5.5 Afhankelijkheden van derden

DGSkills maakt gebruik van de volgende kritieke externe diensten:

| Dienst | Functie | Alternatief bij uitval |
|--------|---------|------------------------|
| Vercel | Frontend hosting | Statische bestanden exporteerbaar naar Netlify / eigen hosting |
| Supabase | Database en authenticatie | PostgreSQL-dump exporteerbaar, zelf te hosten |
| Google Vertex AI | AI-verwerking | AI-component deactiveerbaar; platform werkt zonder AI-functionaliteit |

Als een externe dienst permanent wegvalt, heeft DGSkills de mogelijkheid binnen redelijke termijn (4-8 weken) over te schakelen naar een alternatief.

---

## 6. Data-eigenaarschap en portabiliteit

### 6.1 Eigendom

Alle gegevens die een school invoert in het platform — leerlinggegevens, voortgang, resultaten, aantekeningen van docenten — zijn en blijven eigendom van de school. DGSkills heeft uitsluitend het recht deze gegevens te verwerken ten behoeve van de dienstverlening, conform de verwerkersovereenkomst.

### 6.2 Export op aanvraag

Elke school kan op elk moment een volledige data-export opvragen. DGSkills levert deze export binnen 5 werkdagen aan. De export bevat:

| Categorie | Exportformaat |
|-----------|--------------|
| Leerlingprofielen (anoniem, geen BSN) | CSV, JSON |
| Voortgang per missie | CSV, JSON |
| AI-interacties (per leerling) | JSON |
| Docentnotities en beoordelingen | CSV |
| Gebruiksstatistieken per klas | CSV |

Exportbestanden worden aangeleverd als gecomprimeerd archief (.zip) via een beveiligde download-link, geldig voor 7 dagen.

### 6.3 Export bij beëindiging

Bij beëindiging van de overeenkomst levert DGSkills automatisch een volledige export aan vóór de einddatum, tenzij de school hier schriftelijk van afziet.

### 6.4 Verwijdering

Na afgifte van de export (of na afloop van de bewaarplicht) worden alle schoolgebonden gegevens onherroepelijk verwijderd uit de productiedatabase en back-ups, uiterlijk 30 dagen na de einddatum van de overeenkomst. DGSkills verstrekt op verzoek een schriftelijke verwijderingsbevestiging.

### 6.5 Geen lock-in

DGSkills exporteert data in open, machineleesbare formaten (CSV, JSON). Er worden geen proprietaire formaten gebruikt die overdracht naar andere systemen bemoeilijken.

---

## 7. Escrow-voorstel

### 7.1 Wat is escrow?

Software-escrow betekent dat de broncode van het platform wordt gedeponeerd bij een onafhankelijke derde partij (de escrow-agent). Als DGSkills ophoudt te bestaan of niet meer aan zijn verplichtingen kan voldoen, kunnen scholen de broncode opvragen om het platform zelf of via een andere leverancier voort te zetten.

### 7.2 Huidige status

DGSkills is bereid escrow-afspraken te maken voor scholen of schoolbesturen die hierom vragen. Bij overeenkomsten met grotere schoolbesturen (meer dan 3 scholen of meer dan 500 leerlingen) wordt escrow standaard opgenomen in de dienstverleningsovereenkomst.

Voor pilotscholen geldt een vereenvoudigde variant: de school ontvangt een schriftelijke verklaring dat de broncode bij het intreden van de triggervoorwaarden beschikbaar wordt gesteld.

### 7.3 Wat wordt in escrow geplaatst

- Volledige broncode van het platform (frontend en edge functions)
- Instructies voor installatie en configuratie
- Overzicht van gebruikte externe diensten en configuratievereisten
- Database-schema en migratiehistorie
- Documentatie voor technisch beheer

De broncode bevat geen API-sleutels, wachtwoorden of persoonsgegevens.

### 7.4 Triggervoorwaarden

De escrow-release wordt geactiveerd bij:

1. **Faillissement** van DGSkills of de ondernemer (formele uitspraak).
2. **Overlijden** van de ondernemer Yorin Vonder.
3. **Beëindiging** van de dienstverlening zonder overdracht aan een opvolger.
4. **Langdurige wanprestatie:** het platform is langer dan 60 aaneengesloten kalenderdagen niet beschikbaar en herstel is niet aannemelijk gemaakt.

### 7.5 Escrow-agent (voorstel)

DGSkills streeft ernaar vóór de eerste definitieve schoollicentie (buiten pilot) een formele escrow-overeenkomst te sluiten met een erkende escrow-agent. Kandidaten zijn Escrow Alliance (Nederland) of een vergelijkbare partij. De kosten hiervoor zijn voor rekening van DGSkills.

---

## 8. Noodprotocol contactgegevens

### 8.1 Primair contact

| Veld | Waarde |
|------|--------|
| Naam | Yorin Vonder |
| Functie | Ondernemer / eigenaar DGSkills |
| E-mail | yorin@dgskills.app |
| Telefoon | Op te vragen via e-mail of verwerkersovereenkomst |
| Adres | Oldruitenborghstraat 39, 8043TP Zwolle |
| KvK | 81819889 |

### 8.2 Noodcontactpersoon

Voor het geval de primaire contactpersoon niet bereikbaar is, is er een aangewezen noodcontactpersoon. Scholen ontvangen de contactgegevens van de noodcontactpersoon bij ondertekening van de overeenkomst.

De noodcontactpersoon heeft:
- Toegang tot de versleutelde noodkluis met credentials.
- De instructie scholen te informeren en de data-export procedure te activeren als dat nodig is.
- Geen technische bevoegdheid om het platform te wijzigen — uitsluitend om de situatie te stabiliseren en scholen te ondersteunen.

### 8.3 Procedures bij niet-bereikbaarheid

Als een school DGSkills niet kan bereiken:

1. **Stap 1:** E-mail naar yorin@dgskills.app met onderwerp "DRINGEND — [schoolnaam]".
2. **Stap 2:** Als binnen 3 werkdagen geen reactie: contact opnemen via het noodcontact (gegevens in de overeenkomst).
3. **Stap 3:** Als binnen 5 werkdagen geen reactie via beide kanalen: school mag de overeenkomst per aangetekende brief opzeggen en data-export eisen.

### 8.4 Functionaris Gegevensbescherming

Voor vragen over gegevensbescherming en privacy:

| Veld | Waarde |
|------|--------|
| Naam FG | Yorin Vonder (tevens ondernemer) |
| E-mail FG | fg@dgskills.app |
| Reactietermijn | Uiterlijk 5 werkdagen |

---

## Bijlage A — Versiehistorie

| Versie | Datum | Wijziging |
|--------|-------|-----------|
| 1.0 | 3 april 2026 | Eerste versie |

---

## Bijlage B — Relatie tot andere documenten

Dit continuiteitsplan dient in samenhang te worden gelezen met:

- **Verwerkersovereenkomst** (`A-model-verwerkersovereenkomst-dgskills.md`) — regelt dataverwerking en beëindiging.
- **Beveiligingsbijlage** (`B-beveiligingsbijlage-dgskills.md`) — technische beveiligingsmaatregelen.
- **Privacyverklaring** (`privacyverklaring-dgskills.md`) — rechten van betrokkenen.
- **DPIA** (`dpia-dgskills-compleet.md`) — risicoanalyse verwerking persoonsgegevens.
- **Algemene Voorwaarden** (`algemene-voorwaarden-dgskills.md`) — contractuele rechten en plichten.

---

*Dit document is opgesteld in het kader van transparante informatieverstrekking aan scholen en schoolbesturen. Het continuiteitsplan is onderdeel van het compliance-pakket van DGSkills en wordt jaarlijks herzien, of eerder bij significante wijzigingen in de organisatie of technische infrastructuur.*
