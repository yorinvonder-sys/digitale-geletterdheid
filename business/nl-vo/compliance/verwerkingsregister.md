# Verwerkingsregister DGSkills (Art. 30 AVG)

**Document:** Register van verwerkingsactiviteiten conform Artikel 30 AVG (EU 2016/679)
**Versie:** 1.1
**Datum:** 23 februari 2026
**Classificatie:** Vertrouwelijk -- Intern & Toezichthouder
**Volgende review:** 23 augustus 2026 (halfjaarlijks)

---

## Deel A -- Register van de verwerkingsverantwoordelijke (Art. 30 lid 1)

> **Opmerking:** DGSkills opereert in een duaal model. De school is verwerkingsverantwoordelijke voor leerlinggegevens; DGSkills is verwerker. Voor de eigen bedrijfsvoering (pilot-aanvragen, website, boekhouding) is DGSkills zelf verwerkingsverantwoordelijke. Dit register bevat beide perspectieven.

---

### 1. Identificatie verwerkingsverantwoordelijke

| Veld | Waarde |
|:---|:---|
| **Naam organisatie** | DGSkills (handelsnaam; eenmanszaak, omzetting naar B.V. voorzien) |
| **Website** | https://dgskills.app |
| **Vestigingsadres** | [Nader in te vullen bij oprichting B.V.] |
| **KvK-nummer** | [Nader in te vullen bij oprichting] |
| **Contactpersoon privacy** | Eigenaar/directeur DGSkills |
| **E-mail privacy** | info@dgskills.app |
| **Functionaris Gegevensbescherming (FG)** | Niet verplicht (< 250 medewerkers, geen grootschalige verwerking bijzondere gegevens); vrijwillige aanstelling wordt aanbevolen bij opschaling |

---

### 2. Overzicht verwerkingsactiviteiten

---

#### Verwerking V-01: Gebruikersregistratie en authenticatie

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | Gebruikersregistratie en authenticatie |
| **Verwerkingsverantwoordelijke** | School (voor leerlingen/docenten); DGSkills (voor eigen accounts) |
| **Verwerker** | DGSkills B.V. (i.o.) |
| **Doel** | Aanmaken en beheren van gebruikersaccounts; authenticatie en autorisatie; toewijzing aan school, klas en rol |
| **Rechtsgrondslag** | Art. 6(1)(b) AVG -- Uitvoering overeenkomst (verwerkersovereenkomst school-DGSkills); Art. 6(1)(e) AVG -- Publieke taak (school, onderwijswetgeving) |
| **Categorieeen betrokkenen** | Leerlingen (12-18 jaar), docenten, schoolbeheerders |
| **Categorieeen persoonsgegevens** | - Voornaam, achternaam (of weergavenaam) |
| | - E-mailadres |
| | - Gehashte wachtwoord-hash (bcrypt, via Supabase Auth) |
| | - UUID (gebruikers-ID) |
| | - Rol (leerling / docent / admin / developer) |
| | - School-ID, klas-ID |
| | - Leerjaar (year_group), onderwijsniveau (education_level) |
| | - Accountstatus (processing_restricted, restricted_at, restricted_reason) |
| | - Aanmaak- en wijzigingstijdstempels |
| **Ontvangers / subverwerkers** | Supabase Inc. (database, auth -- hosting EU: `eu-central-1` Frankfurt) |
| **Doorgifte buiten EU/EER** | Supabase Inc. is gevestigd in de VS; dataopslag in EU-regio (`eu-central-1`). Doorgifte geregeld via EU Standard Contractual Clauses (SCC) en DPA van Supabase |
| **Bewaartermijn** | Zolang het account actief is. Bij schoolbeeindiging: verwijdering binnen 30 dagen na einde verwerkersovereenkomst. Bij eigen verwijderingsverzoek: onmiddellijk (cascade-delete) |
| **Technische maatregelen** | TLS 1.2+ (transport), bcrypt password hashing, JWT-authenticatie, Row Level Security (RLS), automatische cascade-delete bij accountverwijdering |

---

#### Verwerking V-02: AI-chatfunctionaliteit (Vertex AI -- Gemini)

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | AI-ondersteunde chatfunctie voor educatieve opdrachten |
| **Verwerkingsverantwoordelijke** | School |
| **Verwerker** | DGSkills B.V. (i.o.) |
| **Subverwerker** | Google LLC (Gemini 2.0 Flash via Vertex AI, regio `europe-west4` Nederland) |
| **Doel** | Educatieve AI-interactie: leerlingen stellen vragen over digitale geletterdheid, ontvangen AI-gegenereerde feedback en uitleg in het kader van het SLO-curriculum |
| **Rechtsgrondslag** | Art. 6(1)(e) AVG -- Publieke taak (school); Art. 6(1)(b) AVG -- Uitvoering overeenkomst (DGSkills-school) |
| **Categorieeen betrokkenen** | Leerlingen (12-18 jaar), docenten |
| **Categorieeen persoonsgegevens** | - Gebruikers-ID (UUID, voor JWT-authenticatie) |
| | - Chatberichten (vrije tekst, ingevoerd door gebruiker) |
| | - Conversatiegeschiedenis (history-array, tijdelijk in geheugen) |
| | - Systeeminstructie (lescontext, geen persoonsgegevens) |
| **Bijzondere categorie** | Niet van toepassing. Prompt-injectiefilter en safety-settings blokkeren sensitieve content actief (BLOCK_LOW_AND_ABOVE voor alle schadecategorieen) |
| **Ontvangers / subverwerkers** | Google LLC -- Vertex AI (`europe-west4-aiplatform.googleapis.com`, regio Nederland) |
| **Doorgifte buiten EU/EER** | Nee. Vertex AI verwerkt data in regio `europe-west4` (Eemshaven, Nederland). Google garandeert dat data at rest in de geselecteerde regio blijft en dat ML-verwerking in de regio plaatsvindt. Juridische grondslag: Google Cloud DPA met SCC (van toepassing op Google Cloud Platform-diensten) |
| **Bewaartermijn** | Chatberichten worden NIET opgeslagen in de DGSkills-database. Data bestaat uitsluitend in het werkgeheugen van de edge function tijdens de request (verwerking duurt seconden). Google Vertex AI zero-data-retention: Google bewaart geen prompts of responses (geen logging, geen opslag, geen gebruik voor modeltraining). Conform Google Cloud Terms of Service en Data Processing Addendum |
| **Technische maatregelen** | Server-side proxy (service account-authenticatie, geen API-key); JWT-verificatie; server-side prompt-injectiefilter (sanitizePrompt); strikte safety settings voor minderjarigen; CORS-beperking tot dgskills.app; rate limiting (429); geen logging van chatinhoud |

---

#### Verwerking V-03: Leervoortgang en gamificatie

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | Registratie leervoortgang, XP-punten en gamificatie |
| **Verwerkingsverantwoordelijke** | School |
| **Verwerker** | DGSkills B.V. (i.o.) |
| **Doel** | Bijhouden van leervorderingen, missie-voortgang, XP-transacties, behaalde badges en achievements ten behoeve van het leerproces en docentinzicht |
| **Rechtsgrondslag** | Art. 6(1)(e) AVG -- Publieke taak (school); Art. 6(1)(b) AVG -- Uitvoering overeenkomst |
| **Categorieeen betrokkenen** | Leerlingen (12-18 jaar) |
| **Categorieeen persoonsgegevens** | - Gebruikers-ID (UUID) |
| | - Missie-voortgang (mission_progress: missie-ID, status, voltooiingsdatum) |
| | - XP-transacties (hoeveelheid, bron, tijdstempel) |
| | - Gamificatie-events (event-type, tijdstempel) |
| **Ontvangers / subverwerkers** | Supabase Inc. (database hosting EU) |
| **Doorgifte buiten EU/EER** | Nee (data opgeslagen in EU-regio) |
| **Bewaartermijn** | Zolang het account actief is. Automatisch verwijderd bij accountverwijdering (cascade-delete) |
| **Technische maatregelen** | RLS (leerlingen zien alleen eigen data); docenten zien alleen leerlingen binnen hun school/klas; server-side XP-berekening (anti-cheat) |

---

#### Verwerking V-04: Leerlingactiviteiten en docentdashboard

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | Registratie leerlingactiviteiten voor docentmonitoring |
| **Verwerkingsverantwoordelijke** | School |
| **Verwerker** | DGSkills B.V. (i.o.) |
| **Doel** | Docenten inzicht geven in leerlingactiviteit (welke modules bezocht, tijdsbesteding, interactiepatronen) voor onderwijsbegeleiding |
| **Rechtsgrondslag** | Art. 6(1)(e) AVG -- Publieke taak (school) |
| **Categorieeen betrokkenen** | Leerlingen (12-18 jaar) |
| **Categorieeen persoonsgegevens** | - Gebruikers-ID (UUID) |
| | - Activiteitstype en -details |
| | - Tijdstempels |
| **Ontvangers / subverwerkers** | Supabase Inc. (database hosting EU) |
| **Doorgifte buiten EU/EER** | Nee |
| **Bewaartermijn** | **1 jaar** na registratie (geautomatiseerde opschoning via pg_cron, wekelijks zondag 03:00 UTC) |
| **Technische maatregelen** | RLS (docent ziet alleen eigen school/klas); geautomatiseerde verwijdering na bewaartermijn |

---

#### Verwerking V-05: Gedeelde projecten en games (portfolio)

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | Opslag en delen van leerlingwerk (projecten, games) |
| **Verwerkingsverantwoordelijke** | School |
| **Verwerker** | DGSkills B.V. (i.o.) |
| **Doel** | Leerlingen kunnen hun gemaakte projecten en games opslaan en delen met klasgenoten en docenten |
| **Rechtsgrondslag** | Art. 6(1)(e) AVG -- Publieke taak; Art. 6(1)(a) AVG -- Toestemming (expliciet bij publicatie naar klasgenoten) |
| **Categorieeen betrokkenen** | Leerlingen (12-18 jaar) |
| **Categorieeen persoonsgegevens** | - Gebruikers-ID (UUID) |
| | - Projectinhoud (code, titel, beschrijving) |
| | - Game-inhoud (configuratie, spelinstellingen) |
| | - Aanmaak- en wijzigingstijdstempels |
| **Ontvangers / subverwerkers** | Supabase Inc. (database hosting EU) |
| **Doorgifte buiten EU/EER** | Nee |
| **Bewaartermijn** | Shared games: **1 jaar** (geautomatiseerde opschoning via pg_cron). Shared projects: zolang account actief is, cascade-delete bij verwijdering |
| **Technische maatregelen** | RLS (school-scoped toegang); cascade-delete bij accountverwijdering |

---

#### Verwerking V-06: Feedback en beoordelingen

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | Leerling-feedback, docent-notities en hybride beoordelingen |
| **Verwerkingsverantwoordelijke** | School |
| **Verwerker** | DGSkills B.V. (i.o.) |
| **Doel** | Vastleggen van leerling-feedback op modules; docent-notities over leerlingen; hybride beoordelingen (AI + docent) |
| **Rechtsgrondslag** | Art. 6(1)(e) AVG -- Publieke taak (school) |
| **Categorieeen betrokkenen** | Leerlingen (12-18 jaar), docenten |
| **Categorieeen persoonsgegevens** | - Gebruikers-ID (UUID) van leerling en/of docent |
| | - Feedbacktekst (vrije tekst) |
| | - Docentnotities (vrije tekst) |
| | - Beoordelingsscores en -opmerkingen |
| | - Tijdstempels |
| **Ontvangers / subverwerkers** | Supabase Inc. (database hosting EU) |
| **Doorgifte buiten EU/EER** | Nee |
| **Bewaartermijn** | Feedback: **1 jaar** (geautomatiseerde opschoning). Notities en beoordelingen: zolang account actief is |
| **Technische maatregelen** | RLS; cascade-delete; docenten zien alleen eigen leerlingen |

---

#### Verwerking V-07: Berichtenfunctie docent-leerling

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | Interne berichtenfunctie tussen docenten en leerlingen |
| **Verwerkingsverantwoordelijke** | School |
| **Verwerker** | DGSkills B.V. (i.o.) |
| **Doel** | Communicatie tussen docenten en leerlingen binnen het platform over het leerproces |
| **Rechtsgrondslag** | Art. 6(1)(e) AVG -- Publieke taak (school) |
| **Categorieeen betrokkenen** | Leerlingen (12-18 jaar), docenten |
| **Categorieeen persoonsgegevens** | - Afzender-ID en ontvanger-ID (UUID) |
| | - Berichtinhoud (tekst) |
| | - Tijdstempels |
| **Ontvangers / subverwerkers** | Supabase Inc. (database hosting EU) |
| **Doorgifte buiten EU/EER** | Nee |
| **Bewaartermijn** | Zolang account actief is; cascade-delete bij accountverwijdering |
| **Technische maatregelen** | RLS (alleen zender/ontvanger); cascade-delete |

---

#### Verwerking V-08: Duel- en multiplayerfunctie

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | Kennisduels en multiplayer-interactie |
| **Verwerkingsverantwoordelijke** | School |
| **Verwerker** | DGSkills B.V. (i.o.) |
| **Doel** | Leerlingen uitdagen in kennisquizzen; online-aanwezigheid bijhouden voor matchmaking |
| **Rechtsgrondslag** | Art. 6(1)(e) AVG -- Publieke taak; Art. 6(1)(f) AVG -- Gerechtvaardigd belang (gamificatie ter bevordering leerproces) |
| **Categorieeen betrokkenen** | Leerlingen (12-18 jaar) |
| **Categorieeen persoonsgegevens** | - Gebruikers-ID (UUID) |
| | - Online-aanwezigheidstijdstempel (duel_presence) |
| | - Duel-uitdagingen (challenger_id, challenged_id, status) |
| | - Actieve duels (speler-IDs, scores) |
| **Ontvangers / subverwerkers** | Supabase Inc. (database + Realtime) |
| **Doorgifte buiten EU/EER** | Nee |
| **Bewaartermijn** | Aanwezigheidsdata: **1 dag** (opschoning elke 30 min). Duel-challenges: **7 dagen**. Active duels: **7 dagen** (alle via pg_cron) |
| **Technische maatregelen** | RLS; zeer korte bewaartermijnen; cascade-delete |

---

#### Verwerking V-09: AI-beleidsonderzoek en surveys

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | AI-beleidssurveys en feedback over AI-gebruik |
| **Verwerkingsverantwoordelijke** | School (voor leerlingdata); DGSkills (voor aggregatie en analyse) |
| **Verwerker** | DGSkills B.V. (i.o.) |
| **Doel** | Inzicht verkrijgen in de houding en ervaringen van leerlingen en docenten ten aanzien van AI in het onderwijs |
| **Rechtsgrondslag** | Art. 6(1)(e) AVG -- Publieke taak; Art. 6(1)(a) AVG -- Toestemming (deelname is vrijwillig) |
| **Categorieeen betrokkenen** | Leerlingen (12-18 jaar), docenten |
| **Categorieeen persoonsgegevens** | - Gebruikers-ID (UUID) |
| | - Survey-antwoorden |
| | - Feedbacktekst |
| | - Tijdstempels |
| **Ontvangers / subverwerkers** | Supabase Inc. (database hosting EU) |
| **Doorgifte buiten EU/EER** | Nee |
| **Bewaartermijn** | Zolang account actief is; cascade-delete bij accountverwijdering |
| **Technische maatregelen** | RLS; cascade-delete; vrijwillige deelname |

---

#### Verwerking V-10: Pilot-aanvragen van scholen

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | Verwerking pilot-aanvragen via het contactformulier |
| **Verwerkingsverantwoordelijke** | DGSkills B.V. (i.o.) -- eigen bedrijfsvoering |
| **Doel** | Ontvangen, beoordelen en opvolgen van pilot-aanvragen van scholen; commercieele acquisitie |
| **Rechtsgrondslag** | Art. 6(1)(b) AVG -- Precontractuele maatregelen (op verzoek van de betrokkene); Art. 6(1)(f) AVG -- Gerechtvaardigd belang (bedrijfsvoering) |
| **Categorieeen betrokkenen** | Contactpersonen van scholen (docenten, schoolleiders, ICT-coordinatoren) |
| **Categorieeen persoonsgegevens** | - Naam contactpersoon |
| | - E-mailadres |
| | - Schoolnaam |
| | - Rol bij de school |
| | - Aantal leerlingen (geschat) |
| | - Vrij berichtveld |
| | - IP-adres (voor rate limiting en misbruikpreventie) |
| | - Tijdstempels |
| **Ontvangers / subverwerkers** | Supabase Inc. (database hosting EU); Zoho Corporation (SMTP e-mailverzending via smtp.zoho.eu) |
| **Doorgifte buiten EU/EER** | Supabase: zie V-01. Zoho: SMTP-server in EU (smtp.zoho.eu); Zoho Corporation is gevestigd in India/VS, maar EU-hosting via Zoho EU Data Center. Doorgifte geregeld via Zoho DPA en SCC |
| **Bewaartermijn** | **3 jaar** na aanvraag (AVG Art. 5(1)(e) -- bewaring voor mogelijke contractuele opvolging en verantwoordingsplicht). Handmatige opschoning via bestaande cron-infrastructuur |
| **Technische maatregelen** | Rate limiting (3 requests/min per IP); honeypot-veld (botdetectie); inputvalidatie en sanitisatie; RLS (alleen admin/developer kan lezen); service_role voor insert |

---

#### Verwerking V-11: E-mailcommunicatie (SMTP)

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | Verzending transactionele en bevestigingsemails |
| **Verwerkingsverantwoordelijke** | DGSkills B.V. (i.o.) |
| **Doel** | Verzenden van bevestigingsemails bij pilot-aanvragen; interne notificaties aan DGSkills-team |
| **Rechtsgrondslag** | Art. 6(1)(b) AVG -- Uitvoering overeenkomst/precontractuele maatregelen |
| **Categorieeen betrokkenen** | Contactpersonen van scholen |
| **Categorieeen persoonsgegevens** | - E-mailadres ontvanger |
| | - Naam contactpersoon |
| | - Schoolnaam |
| | - Inhoud bericht (in e-mailbody) |
| **Ontvangers / subverwerkers** | Zoho Corporation (SMTP-relay via smtp.zoho.eu) |
| **Doorgifte buiten EU/EER** | Zoho EU Data Center; SCC van toepassing |
| **Bewaartermijn** | E-mails worden verzonden en niet apart opgeslagen door DGSkills. Bewaring bij Zoho conform hun retentiebeleid (standaard: tot verwijdering mailbox) |
| **Technische maatregelen** | TLS-versleutelde SMTP-verbinding (poort 465); app-specifiek wachtwoord; credentials als Supabase Edge Function Secrets (nooit in client-code) |

---

#### Verwerking V-12: Audit logging en compliance

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | Audit logging voor compliance en verantwoordingsplicht |
| **Verwerkingsverantwoordelijke** | DGSkills B.V. (i.o.) -- als verwerker namens de school; en als verantwoordelijke voor eigen compliance |
| **Doel** | Vastleggen van privacy-gerelateerde acties (data-export, accountverwijdering, verwerkingsbeperkingen) ten behoeve van de verantwoordingsplicht (Art. 5(2) AVG) en het verwerkingsregister (Art. 30 AVG) |
| **Rechtsgrondslag** | Art. 6(1)(c) AVG -- Wettelijke verplichting (verantwoordingsplicht AVG); Art. 6(1)(f) AVG -- Gerechtvaardigd belang (informatiebeveiliging) |
| **Categorieeen betrokkenen** | Alle gebruikers (leerlingen, docenten, beheerders) |
| **Categorieeen persoonsgegevens** | - Gebruikers-ID (UUID) |
| | - Actie (bijv. gdpr_data_export, gdpr_account_deletion_initiated, gdpr_processing_restriction_requested) |
| | - Metadata (tijdstempel, rechtsgrondslag, initiator) |
| | - E-mailadres (bij bepaalde acties) |
| **Ontvangers / subverwerkers** | Supabase Inc. (database hosting EU) |
| **Doorgifte buiten EU/EER** | Nee (EU-regio) |
| **Bewaartermijn** | **3 jaar** (geautomatiseerde opschoning via pg_cron, wekelijks zondag 04:30 UTC) |
| **Technische maatregelen** | RLS; only-insert patroon (audit logs worden niet gewijzigd); cascade-delete bij volledige accountverwijdering |

---

#### Verwerking V-13: Bibliotheekitems en lesmateriaal

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | Persoonlijke bibliotheek van opgeslagen lesmateriaal |
| **Verwerkingsverantwoordelijke** | School |
| **Verwerker** | DGSkills B.V. (i.o.) |
| **Doel** | Leerlingen en docenten kunnen lesmateriaal, artikelen of bronnen opslaan in een persoonlijke bibliotheek |
| **Rechtsgrondslag** | Art. 6(1)(e) AVG -- Publieke taak (school) |
| **Categorieeen betrokkenen** | Leerlingen (12-18 jaar), docenten |
| **Categorieeen persoonsgegevens** | - Gebruikers-ID (UUID) |
| | - Itemtitel, URL, notities |
| | - Tijdstempels |
| **Ontvangers / subverwerkers** | Supabase Inc. (database hosting EU) |
| **Doorgifte buiten EU/EER** | Nee |
| **Bewaartermijn** | Zolang account actief is; cascade-delete bij accountverwijdering |
| **Technische maatregelen** | RLS; cascade-delete |

---

#### Verwerking V-14: Websitehosting en CDN

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | Hosting van de DGSkills webapplicatie |
| **Verwerkingsverantwoordelijke** | DGSkills B.V. (i.o.) |
| **Doel** | Serveren van de webapplicatie aan eindgebruikers; deployment en build-management |
| **Rechtsgrondslag** | Art. 6(1)(b) AVG -- Uitvoering overeenkomst; Art. 6(1)(f) AVG -- Gerechtvaardigd belang (technische werking platform) |
| **Categorieeen betrokkenen** | Alle websitebezoekers en gebruikers |
| **Categorieeen persoonsgegevens** | - IP-adres |
| | - User-agent (browser/OS) |
| | - Toegangslogs (request URL, tijdstempel, statuscode) |
| **Ontvangers / subverwerkers** | Vercel Inc. (hosting, CDN -- Edge Network wereldwijd, hoofdkantoor VS) |
| **Doorgifte buiten EU/EER** | Ja. Vercel Edge Network verwerkt requests op het dichtstbijzijnde edge-punt (kan binnen of buiten EU zijn). Juridische grondslag: Vercel DPA met SCC |
| **Bewaartermijn** | Vercel serverlogs: conform Vercel retentiebeleid (standaard 30 dagen) |
| **Technische maatregelen** | HTTPS/TLS; Vercel DPA; geen persoonsgegevens opgeslagen in de applicatie-build |

---

#### Verwerking V-15: Rechten van betrokkenen (AVG Art. 15-22)

| Veld | Beschrijving |
|:---|:---|
| **Verwerkingsnaam** | Facilitering rechten van betrokkenen |
| **Verwerkingsverantwoordelijke** | School (voor leerlingen/docenten); DGSkills (voor eigen verzoeken) |
| **Verwerker** | DGSkills B.V. (i.o.) |
| **Doel** | Uitvoering van het recht op inzage/portabiliteit (Art. 15/20: exportMyData), recht op verwijdering (Art. 17: deleteMyAccount), en recht op beperking verwerking (Art. 18: restrictProcessing) |
| **Rechtsgrondslag** | Art. 6(1)(c) AVG -- Wettelijke verplichting (faciliteren betrokkenenrechten) |
| **Categorieeen betrokkenen** | Alle gebruikers |
| **Categorieeen persoonsgegevens** | Alle in dit register genoemde gegevens (afhankelijk van het specifieke recht) |
| **Ontvangers / subverwerkers** | Supabase Inc. (database) |
| **Doorgifte buiten EU/EER** | Nee (verwerking in EU-regio) |
| **Bewaartermijn** | N.v.t. (actie leidt tot export of verwijdering; auditlog zie V-12) |
| **Technische maatregelen** | Self-service in-app functionaliteit; JWT-authenticatie; cascade-delete over 28 tabellen; complete JSON-export (schema v2.0); verplichte auditlog bij elke actie |

---

### 3. Overzicht subverwerkers (Art. 28 lid 2 AVG)

| # | Subverwerker | Dienst | Vestigingsland | Datalocatie | Doorgifte-grondslag | Contactgegevens DPO/privacy |
|:--|:---|:---|:---|:---|:---|:---|
| 1 | **Supabase Inc.** | Database (PostgreSQL), authenticatie, edge functions, realtime | VS | EU (Frankfurt, `eu-central-1`) | SCC + Supabase DPA | privacy@supabase.io |
| 2 | **Google LLC** | Vertex AI -- Gemini 2.0 Flash (generatieve AI) | VS | EU (Eemshaven, Nederland, `europe-west4`) | Google Cloud DPA + SCC | https://support.google.com/policies/contact/general_privacy_form |
| 3 | **Vercel Inc.** | Webhosting, CDN, deployment | VS | Wereldwijd (Edge Network) | SCC + Vercel DPA | privacy@vercel.com |
| 4 | **Zoho Corporation** | SMTP e-mailrelay | India/VS | EU (Zoho EU Data Center) | SCC + Zoho DPA | privacy@zohocorp.com |

---

### 4. Doorgifte buiten de EU/EER (Art. 44-50 AVG)

| Doorgifte | Subverwerker | Land | Grondslag | Aanvullende waarborgen |
|:---|:---|:---|:---|:---|
| AI-chatverwerking | Google LLC | Nederland (EU) -- `europe-west4` | Google Cloud DPA + SCC | Vertex AI met regio-gebonden verwerking (Eemshaven, Nederland); data at rest blijft in `europe-west4`; zero data retention (geen opslag prompts/responses); service account-authenticatie; safety settings |
| Webhosting | Vercel Inc. | VS / wereldwijd | SCC (EU Standard Contractual Clauses) | Vercel DPA; edge-routing kan EU-lokaal zijn |
| Database & Auth | Supabase Inc. | VS (bedrijf) | SCC | Data opgeslagen in EU-regio (Frankfurt); Supabase DPA |
| E-mail SMTP | Zoho Corporation | India/VS (bedrijf) | SCC | SMTP-verkeer via smtp.zoho.eu (EU datacenter); Zoho DPA |

---

### 5. Bewaartermijnen samenvatting

| Categorie | Gegevens | Bewaartermijn | Verwijdermechanisme |
|:---|:---|:---|:---|
| **Efemere data** | Duel-aanwezigheid (duel_presence) | 1 dag | pg_cron (elke 30 min) |
| **Efemere data** | Duel-uitdagingen, actieve duels | 7 dagen | pg_cron (dagelijks 05:00 UTC) |
| **Operationele data** | Leerlingactiviteiten (student_activities) | 1 jaar | pg_cron (wekelijks zondag 03:00 UTC) |
| **Operationele data** | Feedback | 1 jaar | pg_cron (wekelijks zondag 03:30 UTC) |
| **Operationele data** | Gedeelde games | 1 jaar | pg_cron (wekelijks zondag 04:00 UTC) |
| **Accountdata** | Profiel, voortgang, projecten, berichten, bibliotheek, instellingen | Duur van het account | Cascade-delete bij accountverwijdering |
| **Compliancedata** | Audit logs | 3 jaar | pg_cron (wekelijks zondag 04:30 UTC) |
| **Commercieel** | Pilot-aanvragen | 3 jaar | Handmatige opschoning / cron |
| **Transient** | AI-chatberichten | Geen opslag (alleen in werkgeheugen) | Automatisch na request-afhandeling |
| **Hosting** | Vercel serverlogs | 30 dagen | Vercel retentiebeleid |

---

### 6. Technische en organisatorische beveiligingsmaatregelen (Art. 32 AVG)

#### 6.1 Technische maatregelen

| Maatregel | Beschrijving |
|:---|:---|
| **Versleuteling in transit** | TLS 1.2+ op alle verbindingen (HTTPS voor webverkeer, TLS voor SMTP, SSL voor database-verbindingen) |
| **Versleuteling in rust** | Supabase PostgreSQL: AES-256 disk encryption; Vercel: encrypted storage |
| **Authenticatie** | JWT-tokens via Supabase Auth; bcrypt wachtwoord-hashing; Bearer-token verificatie op alle edge functions |
| **Autorisatie** | Row Level Security (RLS) op alle tabellen; rolgebaseerd (leerling, docent, admin, developer); school-scoped toegang |
| **Cascade-delete** | ON DELETE CASCADE op alle 28 foreign keys die verwijzen naar `public.users(id)` -- volledige gegevensverwijdering bij accountdeletie |
| **API-beveiliging** | CORS-beperking tot dgskills.app; API-keys als server-side secrets (nooit in client bundle); service_role key alleen server-side |
| **Input-sanitisatie** | Server-side prompt-injectiefilter (sanitizePrompt); inputvalidatie en -truncatie op alle formulieren; honeypot-velden tegen bots |
| **AI-veiligheid** | Safety settings op BLOCK_LOW_AND_ABOVE voor alle schadecategorieen (minderjarigenbescherming); server-side proxy (service account-authenticatie, credentials niet blootgesteld) |
| **Rate limiting** | IP-gebaseerde rate limiting op pilot-aanvragen (3/min); Vertex AI rate limiting (429 propagatie) |
| **Geautomatiseerde opschoning** | pg_cron jobs voor bewaartermijnen (zie sectie 5) |
| **Verwerkingsbeperking** | `processing_restricted` vlag op gebruikersprofiel (Art. 18 AVG); index voor snelle filtering |
| **Logging** | Auditlogboek voor privacy-gerelateerde acties; geen logging van chatinhoud of gevoelige data |

#### 6.2 Organisatorische maatregelen

| Maatregel | Beschrijving |
|:---|:---|
| **Privacy-by-design** | Dataminimalisatie als ontwerpprincipe; geen BSN, geen thuisadres, geen bijzondere persoonsgegevens |
| **Privacy-by-default** | Standaard minimale gegevensverzameling; geen analytics-cookies zonder toestemming |
| **Verwerkersovereenkomsten** | DPA's met alle subverwerkers (Supabase, Google, Vercel, Zoho) |
| **Toegangsbeperking** | Need-to-know basis; school-scoped data-isolatie; admin-rechten beperkt |
| **Incidentresponse** | Datalekprocedure: melding aan school < 48 uur; school meldt aan AP indien nodig (< 72 uur) |
| **Documentatie** | Legal-matrix, DPIA-ondersteuningstemplate, privacyverklaring, schoolcompliance-gids |
| **Geen commerciele profilering** | Geen advertenties; geen doorverkoop van gegevens; geen profilering voor commerciele doeleinden (conform Privacyconvenant Onderwijs) |
| **Transparantie AI** | Duidelijke labeling dat gebruiker met AI communiceert; disclaimer over AI-beperkingen; expliciete mededeling dat input niet voor modeltraining wordt gebruikt |

---

### 7. Specifieke waarborgen voor minderjarigen (Art. 8 AVG / UAVG)

| Waarborg | Implementatie |
|:---|:---|
| **Rechtsgrondslag** | Verwerking van leerlinggegevens op basis van publieke taak van de school (Art. 6(1)(e)), niet op basis van toestemming van de minderjarige zelf |
| **Schoolverantwoordelijkheid** | De school is verwerkingsverantwoordelijke en beslist over inzet van DGSkills; ouderlijke betrokkenheid verloopt via de school |
| **Dataminimalisatie** | Alleen strikt noodzakelijke gegevens voor het leerproces; geen BSN, adres, geboortedatum of andere niet-noodzakelijke gegevens |
| **Inhoudsbescherming** | AI safety settings op maximaal beschermingsniveau (BLOCK_LOW_AND_ABOVE) voor alle schadecategorieen; server-side content filtering |
| **Geen commercieel gebruik** | Geen advertenties, geen profilering, geen doorverkoop van leerlinggegevens |
| **Self-service rechten** | Leerlingen kunnen zelf hun data exporteren en account verwijderen (met uitleg in begrijpelijke taal) |
| **Beperkte bewaartermijnen** | Automatische opschoning van activiteitsdata na 1 jaar; efemere data na uren/dagen |
| **School-scoped isolatie** | Leerlingen zien alleen data binnen hun eigen school/klas; geen kruisbesmetting tussen scholen |

---

### 8. Beschrijving van rechten van betrokkenen

| Recht | AVG-artikel | Implementatie in DGSkills |
|:---|:---|:---|
| **Inzage** | Art. 15 | Self-service data-export (JSON) via edge function `exportMyData` |
| **Rectificatie** | Art. 16 | Profielwijziging in-app; verzoek via info@dgskills.app |
| **Verwijdering** | Art. 17 | Self-service accountverwijdering via edge function `deleteMyAccount` (cascade-delete over 28 tabellen + auth.users) |
| **Beperking verwerking** | Art. 18 | Self-service verwerkingsbeperking via edge function `restrictProcessing` (markering + auditlog) |
| **Overdraagbaarheid** | Art. 20 | Data-export in gestructureerd JSON-formaat (machine-readable) met schema v2.0 |
| **Bezwaar** | Art. 21 | Via school (verwerkingsverantwoordelijke) of info@dgskills.app |
| **Geautomatiseerde besluitvorming** | Art. 22 | AI wordt niet gebruikt voor geautomatiseerde besluitvorming met rechtsgevolgen; docent heeft altijd eindbeslissing (human-in-the-loop) |

---

## Deel B -- Register van de verwerker (Art. 30 lid 2)

> DGSkills treedt op als verwerker namens de scholen. Dit deel beschrijft de verwerkingen die DGSkills uitvoert in opdracht van de verwerkingsverantwoordelijke (school).

| Veld | Waarde |
|:---|:---|
| **Naam verwerker** | DGSkills B.V. (i.o.) |
| **Contactgegevens** | info@dgskills.app |
| **Naam verwerkingsverantwoordelijke** | [Per school -- vastgelegd in individuele verwerkersovereenkomst] |
| **Categorieeen verwerkingen** | V-01 t/m V-09 en V-13 (zie Deel A) -- alle verwerkingen ten behoeve van de onderwijstaak |
| **Subverwerkers** | Zie sectie 3 |
| **Doorgifte buiten EU/EER** | Zie sectie 4 |
| **Beveiligingsmaatregelen** | Zie sectie 6 |

---

## Deel C -- Wijzigingslogboek

| Datum | Versie | Wijziging | Door |
|:---|:---|:---|:---|
| 2026-02-23 | 1.0 | Initieele versie verwerkingsregister | DGSkills |
| 2026-02-23 | 1.1 | Migratie van Gemini Developer API naar Vertex AI (regio `europe-west4`, Nederland): endpoint, authenticatie (service account), dataresidentie, zero data retention bijgewerkt in V-02, subverwerkeroverzicht en doorgifte-tabel | DGSkills |
| | | | |

---

## Bijlagen en verwijzingen

- **Verwerkersovereenkomst (DPA):** `dpa-template-outline.md`
- **Toetsmatrix AVG & AI Act:** `legal-matrix.md`
- **DPIA-ondersteuningstemplate:** `dpia-support-template.md`
- **Data-flow overzicht:** `data-flow-overview-template.md`
- **Auditrapport:** `audit-report.md`
- **Privacyuitleg voor scholen:** `privacy-explainer-for-schools.md` / `school-compliance-guide.html`

---

## Bronverwijzingen (wet- en regelgeving)

- [Artikel 30 AVG -- Register van de verwerkingsactiviteiten](https://www.privacy-regulation.eu/nl/artikel-30-register-van-de-verwerkingsactiviteiten-EU-AVG.htm)
- [Autoriteit Persoonsgegevens -- Overzicht van alle gegevens](https://www.autoriteitpersoonsgegevens.nl/avg-voor-ondernemers/stappenplan-avg-op-orde-voor-ondernemers-en-mkb/stap-3-maak-een-overzicht-van-alle-gegevens)
- [Verwerkingsregister AP (eigen register AP)](https://www.autoriteitpersoonsgegevens.nl/documenten/verwerkingsregister-ap)
- [Kennisnet -- Handleiding Invullen verwerkingsregister (mei 2025)](https://normenkaderibp.kennisnet.nl/app/uploads/Handleiding-Invullen-verwerkingsregister.pdf)
- [Kennisnet -- Deelproject 2.1 Opstellen verwerkingsregister](https://normenkaderibp.kennisnet.nl/groeipad/fase-2/deelproject-2-1-opstellen-verwerkingsregister/)
- [KvK -- Zo maak je een AVG verwerkingsregister](https://www.kvk.nl/wetten-en-regels/zo-maak-je-een-avg-verwerkingsregister/)
- [Europa decentraal -- Register van verwerkingen](https://europadecentraal.nl/onderwerp/digitale-overheid/avg/verplichtingen-verwerkingsverantwoordelijke/register-van-verwerkingen/)
- [Rijksoverheid -- Privacy bij digitale leermiddelen op school](https://www.rijksoverheid.nl/onderwerpen/privacy-en-persoonsgegevens/privacy-bij-digitale-leermiddelen-op-school)
- [Code voor Kinderrechten -- Verwerk persoonsgegevens rechtmatig](https://codevoorkinderrechten.nl/beginsel/verwerk-persoonsgegevens-op-een-voor-kinderen-rechtmatige-manier/)
- [Onderwijs en Privacy (AVG): Hoe ver mag een school gaan?](https://lawandmore.nl/nieuws/onderwijs-en-privacy-avg-hoe-ver-mag-een-school-gaan-bij-het-verwerken-van-leerlinggegevens/)

---

*Dit verwerkingsregister wordt minimaal halfjaarlijks herzien of bij significante wijzigingen in verwerkingen, subverwerkers of wetgeving. De meest recente versie is leidend.*
