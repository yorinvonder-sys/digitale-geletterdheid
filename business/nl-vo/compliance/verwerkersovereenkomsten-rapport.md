# Rapport Verwerkersovereenkomsten DGSkills.app

**Datum:** 23 februari 2026
**Betreft:** Inventarisatie en analyse verwerkersovereenkomsten (DPA's) voor alle verwerkers van DGSkills.app
**Status:** Kritieke blokkering OPGELOST (AI-verwerking via Mistral AI + Black Forest Labs)
**Classificatie:** Vertrouwelijk

> **UPDATE:** De AI-verwerking verloopt via Mistral AI (tekst/vision/OCR, `api.mistral.ai`, EU/Frankrijk) en Black Forest Labs (beeldgeneratie, EU-endpoint `api.eu.bfl.ai`). Hiermee is het kritieke compliance-risico rond de leeftijdsbeperking in de gebruiksvoorwaarden van de voormalige Google-AI-API komen te vervallen. Authenticatie verloopt server-side via API-key. LET OP: Mistral vereist minimaal 13 jaar en ouderlijke/voogd-toestemming voor minderjarigen — aandachtspunt voor 12-jarigen; te verifiëren met de schoolconsent-flow.

---

## Managementsamenvatting

DGSkills.app verwerkt persoonsgegevens van minderjarige leerlingen (12-18 jaar) in het Nederlandse voortgezet onderwijs. Vanuit de AVG (art. 28), de UAVG en het Privacyconvenant Onderwijs is het verplicht om met iedere verwerker een verwerkersovereenkomst (Data Processing Agreement / DPA) af te sluiten.

Dit rapport inventariseert de DPA-situatie voor alle vier de verwerkers:

| Verwerker | Dienst | DPA beschikbaar? | Status | Prioriteit |
|---|---|---|---|---|
| **Mistral AI + Black Forest Labs** | AI-verwerking (tekst/vision/OCR + beeld) | Mistral DPA met EU SCC's; BFL ISO 27001 / SOC 2 Type II (ondertekende DPA's te verifiëren) | **OPGELOST - AI-verwerking via EU-providers** | ~~1 (Hoogst)~~ Afgerond |
| **Supabase** | Database, auth, Edge Functions | Ja | **Actie vereist** | 2 (Hoog) |
| **Vercel** | Frontend hosting | Ja, automatisch | Actie vereist | 3 (Middel) |
| **Zoho** | SMTP e-mail | Ja | Actie vereist | 4 (Middel) |

**Kernbevinding (OPGELOST):** De integratie met de voormalige Google-AI-API via het voormalige Google-AI-endpoint vormde het grootste compliance-risico. De gebruiksvoorwaarden van die API stelden expliciet dat de dienst **niet gebruikt mag worden voor personen onder 18 jaar**. Dit risico is komen te vervallen doordat DGSkills de AI-verwerking nu afhandelt via Mistral AI (tekst/vision/OCR, `api.mistral.ai`, EU/Frankrijk) en Black Forest Labs (beeldgeneratie, EU-endpoint `api.eu.bfl.ai`). Authenticatie verloopt server-side via API-key. LET OP: Mistral vereist minimaal 13 jaar en ouderlijke/voogd-toestemming voor minderjarigen — aandachtspunt voor 12-jarigen; te verifiëren met de schoolconsent-flow.

---

## A. Mistral AI + Black Forest Labs (voorheen: Google-AI-API)

> **UPDATE:** De AI-verwerking verloopt via Mistral AI (tekst/vision/OCR) en Black Forest Labs (beeldgeneratie). De voormalige Google-AI-API is niet meer in gebruik; alle hieronder beschreven historische risico's zijn daarmee vervallen.

### A.1 Huidige technische situatie

Op basis van de code in `/supabase/functions/chat/index.ts` wordt de AI als volgt aangeroepen:

- **Tekst / vision / OCR:** Mistral AI via `api.mistral.ai` (EU, Frankrijk)
- **Beeldgeneratie:** Black Forest Labs via het EU-endpoint `api.eu.bfl.ai`
- **Authenticatie:** server-side API-key (Supabase Edge Function)
- **Data die wordt verzonden:** Chatberichten van leerlingen (sanitized), chatgeschiedenis, systeem-instructies
- **Veiligheidsmaatregelen:** server-side prompt injection filtering, output-filtering
- **Dataretentie:** dataretentie te verifiëren (Mistral: standaard tot 30 dagen abuse-monitoring; Zero Data Retention optioneel, plan-afhankelijk)
- **Training:** geen training op leerlingdata (training-opt-out te verifiëren — Mistral biedt opt-out; standaard opt-out op Scale-plan)
- **DPA:** Mistral AI DPA met EU SCC's (Besluit 2021/914); Black Forest Labs: ISO 27001 / SOC 2 Type II — ondertekende DPA's te verifiëren

Dit zijn Mistral AI en Black Forest Labs, **niet** meer de voormalige Google-AI-API.

### A.1b Voormalige technische situatie (NIET MEER ACTIEF)

~~De voormalige configuratie maakte gebruik van:~~
- ~~**Endpoint:** het voormalige Google-AI-endpoint~~
- ~~**Authenticatie:** API-key, server-side in Supabase Edge Function~~
- ~~Dit was de voormalige Google-AI-API (ontwikkelaarsvariant) met bijbehorende leeftijdsbeperkingen in de ToS~~

**Deze configuratie is volledig vervangen door Mistral AI + Black Forest Labs.**

### A.2 Verwerkersovereenkomst: Huidige situatie (Mistral AI + Black Forest Labs - ACTIEF)

**DPA:** Mistral AI DPA met EU SCC's (Besluit 2021/914); Black Forest Labs: ISO 27001 / SOC 2 Type II — ondertekende DPA's te verifiëren

**Status:** ACTIEF - DGSkills handelt de AI-verwerking af via Mistral AI (tekst/vision/OCR) en Black Forest Labs (beeldgeneratie).

**Kenmerken van de huidige configuratie:**
- **Datalocatie:** Mistral AI verwerkt via `api.mistral.ai` (EU, Frankrijk); Black Forest Labs via het EU-endpoint `api.eu.bfl.ai`
- **Dataretentie:** dataretentie te verifiëren (Mistral: standaard tot 30 dagen abuse-monitoring; Zero Data Retention optioneel, plan-afhankelijk)
- **Training:** geen training op leerlingdata (training-opt-out te verifiëren — Mistral biedt opt-out; standaard opt-out op Scale-plan)
- **Leeftijd/minderjarigen:** LET OP: Mistral vereist minimaal 13 jaar en ouderlijke/voogd-toestemming voor minderjarigen — aandachtspunt voor 12-jarigen; te verifiëren met de schoolconsent-flow
- **Certificeringen:** Black Forest Labs: ISO 27001 / SOC 2 Type II — ondertekende DPA's te verifiëren
- **Authenticatie:** server-side API-key (geen client-side sleutel)

**Te verifiëren acties voor de DPA's:**
1. Mistral AI DPA met EU SCC's (Besluit 2021/914) opvragen en ondertekenen — te verifiëren
2. Black Forest Labs DPA (ISO 27001 / SOC 2 Type II) opvragen en ondertekenen — te verifiëren
3. Training-opt-out bevestigen (Mistral biedt opt-out; standaard opt-out op Scale-plan) — te verifiëren
4. Dataretentie-instelling vastleggen (Zero Data Retention optioneel, plan-afhankelijk) — te verifiëren
5. Leeftijds-/consent-eisen afstemmen met de schoolconsent-flow — te verifiëren

### A.2b Voormalige situatie: Google-AI-API (NIET MEER ACTIEF)

> **Let op:** Onderstaande informatie is opgenomen ter referentie. DGSkills maakt **niet meer** gebruik van de voormalige Google-AI-API.

De voormalige Google-AI-API had de volgende beperkingen:

- De DPA was **alleen van toepassing op Paid Services** (betaald gebruik met actief billing account)
- Bij **onbetaald gebruik** (free tier) mochten prompts en responses worden gebruikt voor productverbetering en modeltraining
- **Kritiek probleem - Leeftijdsbeperking (vervallen na overstap naar Mistral AI + Black Forest Labs):**
  De gebruiksvoorwaarden van die API stelden letterlijk:

  > *"You must be 18 years of age or older to use the APIs. Additionally, you will not use the Services as part of a website, application, or other service that is directed towards or is likely to be accessed by individuals under the age of 18."*

  ~~Dit betekende dat het gebruik van de voormalige Google-AI-API door DGSkills in strijd was met de gebruiksvoorwaarden~~, aangezien DGSkills een platform is dat specifiek gericht is op leerlingen van 12-18 jaar. **Dit probleem is komen te vervallen doordat de AI-verwerking nu via Mistral AI + Black Forest Labs loopt.**

- **Dataretentie (voormalig):** Prompts en responses werden maximaal 55 dagen gelogd; data kon worden opgeslagen in elk land waar de provider faciliteiten heeft.

### A.3 Standard Contractual Clauses (SCCs)

Mistral AI hanteert de SCC's van de Europese Commissie (Besluit 2021/914) in zijn DPA — te verifiëren via een ondertekende DPA. Deze zijn van toepassing op:
- EU naar niet-EU doorgifte
- VK naar niet-VK doorgifte
- Zwitserland naar niet-Zwitserland doorgifte

De Mistral AI-verwerking verloopt via `api.mistral.ai` (EU, Frankrijk); Black Forest Labs via het EU-endpoint `api.eu.bfl.ai`.

### A.4 Risico's bij verwerking van minderjarigen-data (herbeoordeeld)

| Risico | Ernst (voorheen) | Status nu | Toelichting |
|---|---|---|---|
| Schending ToS voormalige Google-AI-API | ~~**Kritiek**~~ | **OPGELOST** | AI-verwerking via Mistral AI + Black Forest Labs; voormalige ToS niet meer van toepassing |
| Data doorgifte buiten EU | ~~**Hoog**~~ | **OPGELOST** | Mistral AI via `api.mistral.ai` (EU, Frankrijk); Black Forest Labs via EU-endpoint `api.eu.bfl.ai` |
| Training op leerlingdata | ~~**Hoog**~~ | **Aandachtspunt** | geen training op leerlingdata (training-opt-out te verifiëren — Mistral biedt opt-out; standaard opt-out op Scale-plan) |
| DPA / SCC's | ~~**Hoog**~~ | **Aandachtspunt** | Mistral AI DPA met EU SCC's (Besluit 2021/914); Black Forest Labs: ISO 27001 / SOC 2 Type II — ondertekende DPA's te verifiëren |
| Leeftijd minderjarigen | **Hoog** | **Aandachtspunt** | LET OP: Mistral vereist minimaal 13 jaar en ouderlijke/voogd-toestemming voor minderjarigen — aandachtspunt voor 12-jarigen; te verifiëren met de schoolconsent-flow |
| Art. 8 AVG - Minderjarigen | **Hoog** | **Gemitigeerd** | Aanvullende waarborgen zijn genomen (prompt sanitization, output-filtering, minimale dataverzameling) |

### A.5 Te verifiëren acties voor de AI-providers

De AI-verwerking loopt via Mistral AI (tekst/vision/OCR, `api.mistral.ai`, EU/Frankrijk) en Black Forest Labs (beeldgeneratie, EU-endpoint `api.eu.bfl.ai`), met server-side API-key. De volgende punten zijn te verifiëren:

1. Mistral AI DPA met EU SCC's (Besluit 2021/914) opvragen en ondertekenen — te verifiëren
2. Black Forest Labs DPA (ISO 27001 / SOC 2 Type II) opvragen en ondertekenen — te verifiëren
3. Training-opt-out bevestigen — geen training op leerlingdata (training-opt-out te verifiëren — Mistral biedt opt-out; standaard opt-out op Scale-plan)
4. Dataretentie vastleggen — dataretentie te verifiëren (Mistral: standaard tot 30 dagen abuse-monitoring; Zero Data Retention optioneel, plan-afhankelijk)
5. Leeftijds-/consent-eisen — LET OP: Mistral vereist minimaal 13 jaar en ouderlijke/voogd-toestemming voor minderjarigen — aandachtspunt voor 12-jarigen; te verifiëren met de schoolconsent-flow
6. Bevestigen dat alle AI-calls server-side via API-key verlopen (geen client-side sleutel) — te verifiëren

---

## B. Supabase

### B.1 Beschikbare DPA

Supabase biedt een volledige Data Processing Addendum (DPA) aan. De meest recente versie dateert van **14 maart 2025** (Supabase DPA 250314).

### B.2 Hoe te activeren

1. Log in op je Supabase Dashboard
2. Ga naar de **Legal Documents** pagina in je organisatie-instellingen
3. Download de statische PDF-versie van de DPA ter review
4. Vraag het **ondertekeningsformulier** aan via de dashboard (PandaDoc)
5. Vul de gegevens van DGSkills (als verwerker) en de school (als verwerkingsverantwoordelijke) in
6. Beide partijen ondertekenen digitaal via PandaDoc

**Alternatief:** Neem contact op met Supabase via hun support voor een op maat gemaakte DPA.

**URL:** https://supabase.com/legal/dpa

### B.3 Datahosting en regio

- **Primaire hosting:** Amazon Web Services (AWS)
- **Geselecteerde regio voor DGSkills:** `eu-central-1` (Frankfurt, Duitsland) - **binnen de EU**
- Supabase biedt 17+ datacenterlocaties wereldwijd
- Data at-rest blijft in de geselecteerde regio

### B.4 Sub-verwerkers van Supabase

| Sub-verwerker | Dienst | Locatie |
|---|---|---|
| **Amazon Web Services (AWS)** | Database hosting, compute | EU (Frankfurt, eu-central-1) |
| **Google Cloud (BigQuery)** | Logs opslag | VS (mogelijke doorgifte buiten EU) |
| **Fly.io** | Realtime processing | Diverse locaties |
| **Cloudflare** | CDN, applicatie-hosting | Globaal (edge locations) |
| **Upstash** | Serverless hosting (Redis) | Diverse locaties |
| **Vercel** | Applicatie-hosting | VS (primair) |

**Aandachtspunt:** De sub-verwerkers Google Cloud (BigQuery voor logs) en Fly.io verwerken mogelijk data buiten de EU. Dit moet worden geverifieerd en gedocumenteerd in de DPA.

### B.5 Beveiligingsmaatregelen

- Versleuteling in transit (TLS) en at-rest
- Row Level Security (RLS) op database-niveau
- JWT-authenticatie
- Audit logging

### B.6 SCCs en doorgifte

Supabase biedt een Transfer Impact Assessment (TIA) aan als aanvulling op de DPA. De EU SCCs (2021) zijn onderdeel van het DPA-pakket. Download beschikbaar via: https://supabase.com/downloads/docs/Supabase+TIA+250314.pdf

---

## C. Vercel

### C.1 Beschikbare DPA

Vercel biedt een Data Processing Addendum aan dat **automatisch van kracht wordt** bij het aangaan van de hoofdovereenkomst (Terms of Service). Er is geen aparte ondertekening nodig.

**URL:** https://vercel.com/legal/dpa

### C.2 Welke data Vercel verwerkt

| Categorie | Omschrijving |
|---|---|
| **Customer Data** | Informatie die klanten uploaden naar de dienst (source code, configuraties) |
| **Service-Generated Data** | Gebruiksstatistieken, metadata, performance metrics |
| **Contact Data** | Accountgegevens, betalingsinformatie, support-communicatie |

**Belangrijk voor DGSkills:** Vercel host alleen de frontend (statische bestanden). Er worden **geen persoonsgegevens van leerlingen** direct verwerkt door Vercel, tenzij deze in client-side logs of error tracking terechtkomen.

### C.3 Sub-verwerkers

Vercel houdt een actuele lijst bij op: https://security.vercel.com

- Bij nieuwe sub-verwerkers worden klanten geinformeerd
- Klanten hebben **5 kalenderdagen** om bezwaar te maken met "redelijke databeschermingszorgen"
- Bij onopgelost geschil kan de klant de overeenkomst beeindigen

### C.4 Datalocatie

- **Primaire verwerking:** Verenigde Staten
- Data kan worden overgedragen naar locaties waar Vercel of sub-verwerkers actief zijn
- **EU SCCs (2021)** zijn van toepassing voor doorgifte vanuit de EER, VK en Zwitserland
- Toepasselijk recht: Iers recht; bevoegde rechter: Ierse rechtbanken

### C.5 Beveiliging

- AES-256 versleuteling
- SOC 2 Type 2 gecertificeerd
- Toegangscontroles en beveiligingsaudits
- Medewerkersopleidingen

### C.6 Datalekmelding

Bij een bevestigd beveiligingsincident meldt Vercel dit **"without undue delay"** (zonder onredelijke vertraging), tenzij dit wettelijk verboden is. De melding bevat details van het incident en genomen herstelmaatregelen.

---

## D. Zoho (SMTP E-mail)

### D.1 Beschikbare DPA

Zoho biedt een Data Processing Addendum aan, gebaseerd op de EU Model Contractual Clauses.

### D.2 Hoe te activeren

1. Stuur een e-mail naar **legal@zohocorp.com**
2. Vermeld in welk datacenter je Zoho-account is aangemaakt
3. Zoho stuurt een DPA-document ter ondertekening
4. Onderteken en retourneer het document

### D.3 Datalocatie

Zoho heeft datacenters in meerdere regio's:

| Datacenter | Domein | Regio |
|---|---|---|
| EU | mail.zoho.eu | Europa |
| US | mail.zoho.com | Verenigde Staten |
| India | mail.zoho.in | India |
| Australie | mail.zoho.com.au | Australie |
| Japan | mail.zoho.jp | Japan |
| China | mail.zoho.com.cn | China |
| Canada | zoho.ca | Canada |

**Aanbeveling voor DGSkills:** Gebruik het EU-datacenter (zoho.eu) zodat alle e-maildata binnen de EU blijft.

**Migratie:** Indien het account momenteel op een niet-EU datacenter staat, kan migratie naar het EU-datacenter worden aangevraagd. Dit duurt maximaal **5 werkdagen**.

### D.4 Welke data wordt verwerkt

- E-mailadressen van ontvangers (docenten, schoolbeheerders, mogelijk leerlingen)
- E-mailinhoud (transactionele e-mails: wachtwoordreset, notificaties, etc.)
- Metadata (timestamps, IP-adressen, bezorgstatus)

### D.5 Beveiliging

- **TLS** voor data in transit (SMTP)
- **AES 256-bit** versleuteling at-rest
- **ISO 27001** en **SOC 2 Type 2** gecertificeerd
- Geen advertenties of commercieel gebruik van data

### D.6 Datalekmelding

Zoho meldt datalekken binnen **72 uur** na ontdekking. Individuele getroffen klanten ontvangen een e-mailnotificatie.

---

## E. Privacyconvenant Onderwijs

### E.1 Context

Het Privacyconvenant Onderwijs (versie 4.0, gepubliceerd april 2022) is de Nederlandse standaard voor verwerkersovereenkomsten in het onderwijs. Het bevat een model-verwerkersovereenkomst die door scholen en leveranciers wordt gebruikt.

- **Huidige versie:** 4.0 (verplicht voor nieuwe overeenkomsten sinds 1 augustus 2022)
- **Overgangsperiode:** Bestaande overeenkomsten moeten uiterlijk **1 augustus 2026** zijn omgezet naar versie 4.0
- **Versie 5.0:** In ontwikkeling, specifiek voor AI-gerelateerde verwerkingen (verwacht 2026/2027)
- **Downloads:** https://www.privacyconvenant.nl/downloads/

### E.2 Relevantie voor DGSkills

DGSkills dient ideaal gezien aan te sluiten bij het Privacyconvenant Onderwijs. Dit betekent:
- Gebruik van het model-verwerkersovereenkomst als basis voor overeenkomsten met scholen
- Transparantie over sub-verwerkers (Google, Supabase, Vercel, Zoho)
- Aansluiting als deelnemer bij het Privacyconvenant (optioneel maar sterk aanbevolen)

---

## F. Actieplan

### Prioriteit 1: ~~KRITIEK~~ OPGELOST - AI-verwerking via Mistral AI (EU, Frankrijk) + Black Forest Labs (EU-endpoint api.eu.bfl.ai); server-side API-key

| # | Actie | Verantwoordelijke | Status |
|---|---|---|---|
| 1.1 | **AI-verwerking via EU-providers:** tekst/vision/OCR via Mistral AI (`api.mistral.ai`, EU/Frankrijk), beeldgeneratie via Black Forest Labs (EU-endpoint `api.eu.bfl.ai`). | Ontwikkelaar + Eigenaar | **UITGEVOERD** |
| 1.2 | **DPA's opvragen en ondertekenen:** Mistral AI DPA met EU SCC's (Besluit 2021/914); Black Forest Labs: ISO 27001 / SOC 2 Type II — ondertekende DPA's te verifiëren. | Eigenaar | **Te verifiëren** |
| 1.3 | **Training-opt-out bevestigen:** geen training op leerlingdata (training-opt-out te verifiëren — Mistral biedt opt-out; standaard opt-out op Scale-plan). | Ontwikkelaar + Eigenaar | **Te verifiëren** |
| 1.4 | **Dataretentie vastleggen:** dataretentie te verifiëren (Mistral: standaard tot 30 dagen abuse-monitoring; Zero Data Retention optioneel, plan-afhankelijk). | Eigenaar | **Te verifiëren** |
| 1.5 | **Leeftijds-/consent-eisen:** LET OP: Mistral vereist minimaal 13 jaar en ouderlijke/voogd-toestemming voor minderjarigen — aandachtspunt voor 12-jarigen; te verifiëren met de schoolconsent-flow. | Eigenaar + DPO | **Te verifiëren** |

### Prioriteit 2: HOOG - Supabase DPA (Deadline: 4 weken)

| # | Actie | Verantwoordelijke | Deadline |
|---|---|---|---|
| 2.1 | **Onderteken de Supabase DPA** via het Supabase Dashboard > Legal Documents (PandaDoc). | Eigenaar | Week 3 |
| 2.2 | **Verifieer dat het project op eu-central-1 (Frankfurt)** draait en documenteer dit. | Ontwikkelaar | Week 3 |
| 2.3 | **Inventariseer sub-verwerkers** van Supabase en verifieer welke data buiten de EU wordt verwerkt (met name BigQuery logs en Fly.io). | Eigenaar | Week 4 |
| 2.4 | **Download en bewaar de Transfer Impact Assessment** (TIA) van Supabase. | Eigenaar | Week 4 |

### Prioriteit 3: MIDDEL - Vercel DPA (Deadline: 6 weken)

| # | Actie | Verantwoordelijke | Deadline |
|---|---|---|---|
| 3.1 | **Verifieer dat de Vercel DPA automatisch van kracht is** via de Terms of Service en bewaar een kopie. | Eigenaar | Week 5 |
| 3.2 | **Controleer de sub-verwerkerlijst** op https://security.vercel.com en documenteer deze. | Eigenaar | Week 5 |
| 3.3 | **Beoordeel of Vercel persoonsgegevens verwerkt** (client-side error tracking, analytics). Indien ja, documenteer welke data en op welke grondslag. | Ontwikkelaar | Week 6 |

### Prioriteit 4: MIDDEL - Zoho DPA (Deadline: 6 weken)

| # | Actie | Verantwoordelijke | Deadline |
|---|---|---|---|
| 4.1 | **Stuur een e-mail naar legal@zohocorp.com** om de DPA aan te vragen. Vermeld het datacenter (EU/zoho.eu). | Eigenaar | Week 5 |
| 4.2 | **Verifieer dat het Zoho-account op het EU-datacenter** (zoho.eu) staat. Indien niet, vraag migratie aan. | Eigenaar | Week 5 |
| 4.3 | **Onderteken en archiveer de Zoho DPA.** | Eigenaar | Week 6 |

### Prioriteit 5: STRUCTUREEL - Privacyconvenant en documentatie (Deadline: 8 weken)

| # | Actie | Verantwoordelijke | Deadline |
|---|---|---|---|
| 5.1 | **Download het model-verwerkersovereenkomst 4.0** van privacyconvenant.nl en gebruik dit als basis voor overeenkomsten met scholen. | Eigenaar | Week 6 |
| 5.2 | **Vul de sub-verwerkerlijst in** het DPA-template (zie `/business/nl-vo/compliance/dpa-template-outline.md`) met alle vier de verwerkers en hun sub-verwerkers. | Eigenaar | Week 7 |
| 5.3 | **Overweeg aansluiting bij het Privacyconvenant Onderwijs** als deelnemer. Dit vergroot het vertrouwen van scholen. | Eigenaar | Week 8 |
| 5.4 | **Bereid een DPIA-ondersteuningsdocument voor** dat scholen kunnen gebruiken bij het uitvoeren van een Data Protection Impact Assessment. | Eigenaar + DPO | Week 8 |

---

## G. Overzicht verwerkersovereenkomsten na implementatie actieplan

| Verwerker | DPA-type | Activering | Data in EU? | SCCs? | Training opt-out? |
|---|---|---|---|---|---|
| **Mistral AI + Black Forest Labs** | Mistral DPA (EU SCC's); BFL ISO 27001 / SOC 2 Type II | Te verifiëren (ondertekende DPA's) | Ja (Mistral: EU/Frankrijk; BFL: EU-endpoint) | Ja (Besluit 2021/914) — te verifiëren | Te verifiëren (Mistral biedt opt-out; standaard op Scale-plan) |
| **Supabase** | Supabase DPA | Ondertekenen via PandaDoc | Ja (eu-central-1) | Ja (in DPA) | N.v.t. |
| **Vercel** | Vercel DPA | Automatisch bij ToS | Nee (VS primair) | Ja (EU SCCs 2021) | N.v.t. |
| **Zoho** | Zoho DPA | Aanvragen via e-mail | Ja (zoho.eu) | Ja (Model Clauses) | N.v.t. |

---

## H. Bronnen en referenties

1. [Mistral AI Data Processing Agreement](https://mistral.ai/terms/#data-processing-agreement)
2. [Mistral AI Privacy Policy](https://mistral.ai/terms/#privacy-policy)
3. [Mistral AI Terms of Service](https://mistral.ai/terms/#terms-of-service)
4. [Black Forest Labs (api.eu.bfl.ai) Documentation](https://docs.bfl.ai/)
5. [Black Forest Labs Privacy & Security](https://bfl.ai/legal/privacy-policy)
6. [Supabase DPA](https://supabase.com/legal/dpa)
7. [Supabase DPA PDF (maart 2025)](https://supabase.com/downloads/docs/Supabase+DPA+250314.pdf)
8. [Supabase Transfer Impact Assessment](https://supabase.com/downloads/docs/Supabase+TIA+250314.pdf)
9. [Vercel DPA](https://vercel.com/legal/dpa)
10. [Vercel Security & Sub-processors](https://security.vercel.com)
11. [Zoho GDPR Compliance](https://www.zoho.com/gdpr.html)
12. [Zoho Mail GDPR](https://www.zoho.com/mail/gdpr.html)
13. [Zoho Datacenters](https://www.zoho.com/know-your-datacenter.html)
14. [Privacyconvenant Onderwijs](https://www.privacyconvenant.nl/)
15. [Privacyconvenant 4.0 Downloads](https://www.privacyconvenant.nl/downloads/)
16. [Mistral AI Data Processing & Retention](https://help.mistral.ai/en/articles/347390-how-long-do-you-store-my-data)
17. [Mistral AI Trust Center (ISO 27001 / SOC 2)](https://trust.mistral.ai/)
18. [Mistral AI Opt-out / Data Usage](https://help.mistral.ai/en/articles/156580-can-i-opt-out-of-having-my-data-used-for-training)
19. [Black Forest Labs Terms of Service](https://bfl.ai/legal/terms-of-service)
20. [EU Standard Contractual Clauses (Besluit 2021/914)](https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj)

---

## Disclaimer

Dit rapport is opgesteld op basis van publiek beschikbare informatie en dient als startpunt voor compliance-werkzaamheden. Het vervangt geen juridisch advies. Raadpleeg een gespecialiseerde privacyrechtadvocaat voor definitieve juridische beoordeling, met name met betrekking tot de verwerking van minderjarigen-data.

**Opmerking:** Het eerder geidentificeerde kritieke risico met betrekking tot de gebruiksvoorwaarden van de voormalige Google-AI-API (verbod op gebruik door/voor minderjarigen) is komen te vervallen doordat de AI-verwerking nu via Mistral AI (tekst/vision/OCR) en Black Forest Labs (beeldgeneratie) verloopt. De voormalige verwijzingen naar het Google-AI-endpoint en de bijbehorende API-key in dit rapport zijn bijgewerkt en als doorgehaald gemarkeerd ter referentie.
