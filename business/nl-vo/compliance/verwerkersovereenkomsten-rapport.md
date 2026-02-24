# Rapport Verwerkersovereenkomsten DGSkills.app

**Datum:** 23 februari 2026
**Betreft:** Inventarisatie en analyse verwerkersovereenkomsten (DPA's) voor alle verwerkers van DGSkills.app
**Status:** Kritieke blokkering OPGELOST (Vertex AI migratie uitgevoerd)
**Classificatie:** Vertrouwelijk

> **UPDATE 23 februari 2026:** Migratie van Gemini Developer API naar Vertex AI is uitgevoerd en getest in productie. Het kritieke compliance-risico rond de leeftijdsbeperking in de Gemini Developer API Terms of Service is hiermee **opgelost**. DGSkills maakt nu gebruik van het Vertex AI endpoint `europe-west4-aiplatform.googleapis.com` met gegarandeerde dataresidentie in Nederland, authenticatie via service account (OAuth2/JWT), en zero data retention.

---

## Managementsamenvatting

DGSkills.app verwerkt persoonsgegevens van minderjarige leerlingen (12-18 jaar) in het Nederlandse voortgezet onderwijs. Vanuit de AVG (art. 28), de UAVG en het Privacyconvenant Onderwijs is het verplicht om met iedere verwerker een verwerkersovereenkomst (Data Processing Agreement / DPA) af te sluiten.

Dit rapport inventariseert de DPA-situatie voor alle vier de verwerkers:

| Verwerker | Dienst | DPA beschikbaar? | Status | Prioriteit |
|---|---|---|---|---|
| **Google (Vertex AI)** | AI-chatfunctie | Ja (Cloud DPA/CDPA) | **OPGELOST - Migratie uitgevoerd** | ~~1 (Hoogst)~~ Afgerond |
| **Supabase** | Database, auth, Edge Functions | Ja | **Actie vereist** | 2 (Hoog) |
| **Vercel** | Frontend hosting | Ja, automatisch | Actie vereist | 3 (Middel) |
| **Zoho** | SMTP e-mail | Ja | Actie vereist | 4 (Middel) |

**Kernbevinding (OPGELOST):** De integratie met Google Gemini API via het `generativelanguage.googleapis.com`-endpoint vormde het grootste compliance-risico. De Gemini API Additional Terms of Service stelden expliciet dat de dienst **niet gebruikt mag worden voor personen onder 18 jaar**. Dit risico is **volledig opgelost** door de migratie naar Vertex AI. DGSkills maakt sinds 23 februari 2026 gebruik van het Vertex AI endpoint `europe-west4-aiplatform.googleapis.com` met enterprise-voorwaarden (Google Cloud DPA/CDPA) die geen leeftijdsbeperking bevatten. Authenticatie verloopt via service account (OAuth2/JWT) in plaats van een API-key, en dataresidentie is gegarandeerd in europe-west4 (Nederland).

---

## A. Google Vertex AI (voorheen: Gemini Developer API)

> **UPDATE 23 februari 2026:** Migratie van Gemini Developer API naar Vertex AI is uitgevoerd en getest in productie. Alle hieronder beschreven risico's zijn opgelost.

### A.1 Huidige technische situatie (na migratie)

Op basis van de code in `/supabase/functions/chat/index.ts` wordt de Vertex AI API als volgt aangeroepen:

- **Endpoint:** `https://europe-west4-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/europe-west4/publishers/google/models/gemini-2.0-flash:generateContent`
- **Authenticatie:** Google Cloud service account met OAuth2/JWT (geen API-key meer)
- **Data die wordt verzonden:** Chatberichten van leerlingen (sanitized), chatgeschiedenis, systeem-instructies
- **Veiligheidsmaatregelen:** Safety settings op `BLOCK_LOW_AND_ABOVE` voor alle categorien, server-side prompt injection filtering
- **Dataresidentie:** Gegarandeerd in europe-west4 (Nederland):
  - Data at rest blijft in de regio
  - ML-verwerking vindt plaats in de regio
  - Zero data retention door Google
- **DPA:** Google Cloud Data Processing Addendum (CDPA) met Standard Contractual Clauses (SCCs) is van toepassing

Dit is de **Vertex AI API** (Google Cloud Platform), **niet** meer de Gemini Developer API (Google AI Studio). De migratie is uitgevoerd op 23 februari 2026.

### A.1b Voormalige technische situatie (voor migratie - NIET MEER ACTIEF)

~~De voormalige configuratie maakte gebruik van:~~
- ~~**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`~~
- ~~**Authenticatie:** API-key (`GEMINI_API_KEY`, server-side in Supabase Edge Function)~~
- ~~Dit was de **Gemini Developer API** (Google AI Studio) met bijbehorende leeftijdsbeperkingen in de ToS~~

**Deze configuratie is volledig vervangen door Vertex AI.**

### A.2 Verwerkersovereenkomst: Huidige situatie (Vertex AI - ACTIEF)

**DPA:** Google Cloud Data Processing Addendum (CDPA) - automatisch onderdeel van de Google Cloud-overeenkomst

**Status:** UITGEVOERD - DGSkills maakt sinds 23 februari 2026 gebruik van Vertex AI.

**Kenmerken van de huidige Vertex AI-configuratie:**
- **Data residency:** Data wordt uitsluitend verwerkt in **europe-west4 (Nederland)**
  - Data at rest blijft in de regio
  - ML-verwerking vindt plaats in de regio
  - Zero data retention is actief
- **Geen leeftijdsbeperking in de Terms of Service** - Vertex AI enterprise-voorwaarden bevatten geen verbod op gebruik door/voor minderjarigen
- **Geen gebruik van data voor modeltraining** (standaard bij Vertex AI)
- **Volledige CDPA** met Standard Contractual Clauses (SCCs) is van toepassing
- **SOC 2 Type 2, ISO 27001** gecertificeerd
- **DPIA-ondersteuning** beschikbaar van Google
- **Authenticatie:** Service account met OAuth2/JWT (geen API-key)

**DPA-activering voor Google Cloud (UITGEVOERD):**
1. ~~Ga naar Google Cloud Console > IAM & Admin~~ GEDAAN
2. ~~Selecteer je project~~ GEDAAN
3. ~~Onder "Cloud Data Processing Addendum", klik "Review and Accept"~~ GEDAAN
4. ~~Vul eventueel DPO-gegevens en Europese vertegenwoordiger in~~ GEDAAN
5. ~~Klik "Save"~~ GEDAAN

### A.2b Voormalige situatie: Gemini Developer API (NIET MEER ACTIEF)

> **Let op:** Onderstaande informatie is opgenomen ter referentie. DGSkills maakt **niet meer** gebruik van de Gemini Developer API.

De voormalige Gemini Developer API had de volgende beperkingen:

- De DPA was **alleen van toepassing op Paid Services** (betaald gebruik met actief billing account)
- Bij **onbetaald gebruik** (free tier) mochten prompts en responses worden gebruikt voor productverbetering en modeltraining
- **Kritiek probleem - Leeftijdsbeperking (OPGELOST door migratie naar Vertex AI):**
  De Gemini API Additional Terms of Service (https://ai.google.dev/gemini-api/terms) stelden letterlijk:

  > *"You must be 18 years of age or older to use the APIs. Additionally, you will not use the Services as part of a website, application, or other service that is directed towards or is likely to be accessed by individuals under the age of 18."*

  ~~Dit betekende dat het gebruik van de Gemini Developer API door DGSkills in strijd was met de gebruiksvoorwaarden van Google~~, aangezien DGSkills een platform is dat specifiek gericht is op leerlingen van 12-18 jaar. **Dit probleem is volledig opgelost door de migratie naar Vertex AI, waarvan de enterprise-voorwaarden geen leeftijdsbeperking bevatten.**

- **Dataretentie (voormalig):** Prompts en responses werden maximaal 55 dagen gelogd; data kon worden opgeslagen in elk land waar Google faciliteiten heeft. **Nu geldt: zero data retention in europe-west4 (Nederland).**

### A.3 Standard Contractual Clauses (SCCs)

Google Cloud heeft de SCCs van de Europese Commissie (2021) geiintegreerd in de CDPA. Deze zijn van toepassing op:
- EU naar niet-EU doorgifte
- VK naar niet-VK doorgifte
- Zwitserland naar niet-Zwitserland doorgifte

De SCCs zijn opgenomen in Appendix 3 van de CDPA en worden automatisch geactiveerd wanneer de CDPA wordt geaccepteerd.

### A.4 Risico's bij doorgifte van minderjarigen-data (herbeoordeeld na migratie)

| Risico | Ernst (voor migratie) | Status na migratie | Toelichting |
|---|---|---|---|
| Schending ToS Gemini Developer API | ~~**Kritiek**~~ | **OPGELOST** | Vertex AI enterprise-voorwaarden bevatten geen leeftijdsbeperking |
| Data doorgifte buiten EU | ~~**Hoog**~~ | **OPGELOST** | Dataresidentie gegarandeerd in europe-west4 (Nederland) |
| Training op leerlingendata (free tier) | ~~**Hoog**~~ | **OPGELOST** | Vertex AI gebruikt geen data voor modeltraining; zero data retention actief |
| Geen adequate DPA zonder billing | ~~**Hoog**~~ | **OPGELOST** | Google Cloud CDPA met SCCs is van toepassing |
| Art. 8 AVG - Minderjarigen | **Hoog** | **Gemitigeerd** | Aanvullende waarborgen zijn genomen (safety settings, prompt sanitization, minimale dataverzameling, zero data retention) |

### A.5 Stap-voor-stap handleiding DPA activeren

**~~Optie A: Blijven bij Gemini Developer API~~ - NIET GEKOZEN (risico's te groot)**

~~Deze optie is niet uitgevoerd vanwege het expliciete verbod op gebruik door/voor minderjarigen in de Gemini API Terms of Service.~~

**Optie B: Migreren naar Vertex AI - UITGEVOERD op 23 februari 2026**

Alle stappen zijn succesvol uitgevoerd en getest in productie:

1. ~~Maak een Google Cloud-project aan (of gebruik bestaand project)~~ GEDAAN
2. ~~Activeer de Vertex AI API~~ GEDAAN
3. ~~Selecteer regio **europe-west4 (Netherlands)**~~ GEDAAN - europe-west4 geselecteerd
4. ~~Accepteer de CDPA via Google Cloud Console > IAM & Admin~~ GEDAAN
5. ~~Wijzig het endpoint in de Edge Function van `generativelanguage.googleapis.com` naar Vertex AI~~ GEDAAN
   - Nieuw endpoint: `https://europe-west4-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/europe-west4/publishers/google/models/gemini-2.0-flash:generateContent`
6. ~~Wijzig authenticatie van API-key (`GEMINI_API_KEY`) naar Google Cloud service account met OAuth2/JWT~~ GEDAAN
7. ~~Activeer Zero Data Retention~~ GEDAAN
8. ~~Test uitgebreid in productie-omgeving~~ GEDAAN - succesvol getest

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

### Prioriteit 1: ~~KRITIEK~~ OPGELOST - Google Vertex AI (voorheen Gemini API) - UITGEVOERD 23 februari 2026

| # | Actie | Verantwoordelijke | Status |
|---|---|---|---|
| 1.1 | **Activeer betaald billing account** voor het Google Cloud-project. | Eigenaar | **UITGEVOERD** |
| 1.2 | **Accepteer de Cloud Data Processing Addendum** (CDPA) via Google Cloud Console > IAM & Admin. | Eigenaar | **UITGEVOERD** |
| 1.3 | **Migratie naar Vertex AI** uitgevoerd: (a) leeftijdsbeperking in de Gemini Developer API ToS is niet meer van toepassing, (b) data residency gegarandeerd in europe-west4 (Nederland), (c) Zero Data Retention geactiveerd, (d) authenticatie via service account (OAuth2/JWT) i.p.v. API-key. | Ontwikkelaar + Eigenaar | **UITGEVOERD** |
| 1.4 | **Vertex AI enterprise-voorwaarden bevestigd:** Vertex AI als Google Cloud enterprise-dienst heeft geen leeftijdsbeperking in de Terms of Service. Enterprise agreement via Google Cloud CDPA is van toepassing. | Eigenaar | **UITGEVOERD** |
| 1.5 | **Risicobeoordeling gedocumenteerd:** Aanvullende waarborgen vastgelegd (safety settings, prompt sanitization, minimale dataverzameling, zero data retention, dataresidentie in Nederland). | Eigenaar + DPO | **UITGEVOERD** |

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
| **Google (Vertex AI)** | Cloud DPA (CDPA) | **Geactiveerd** via GCP Console | Ja (europe-west4, Nederland) | Ja (Appendix 3) | N.v.t. (geen training, zero data retention) |
| **Supabase** | Supabase DPA | Ondertekenen via PandaDoc | Ja (eu-central-1) | Ja (in DPA) | N.v.t. |
| **Vercel** | Vercel DPA | Automatisch bij ToS | Nee (VS primair) | Ja (EU SCCs 2021) | N.v.t. |
| **Zoho** | Zoho DPA | Aanvragen via e-mail | Ja (zoho.eu) | Ja (Model Clauses) | N.v.t. |

---

## H. Bronnen en referenties

1. [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms)
2. [Google Cloud Data Processing Addendum](https://cloud.google.com/terms/data-processing-addendum)
3. [Google Cloud Standard Contractual Clauses](https://cloud.google.com/terms/sccs)
4. [Vertex AI Data Residency](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/data-residency)
5. [Google Cloud Whitepaper: Generative AI, Privacy, and Google Cloud](https://services.google.com/fh/files/misc/genai_privacy_google_cloud_202308.pdf)
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
16. [Vertex AI Zero Data Retention](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/vertex-ai-zero-data-retention)
17. [Google Expands Gemini AI Access to Schools](https://www.datastudios.org/post/google-expands-gemini-ai-access-to-schools-and-students-under-18)
18. [Gemini API & Data Privacy: What Google's Terms Mean for You in 2025](https://redact.dev/blog/gemini-api-terms-2025)
19. [How Gemini for Google Cloud Uses Your Data](https://docs.cloud.google.com/gemini/docs/discover/data-governance)
20. [DPIA Support for Google Workspace with Gemini](https://workspace.google.com/blog/identity-and-security/dpia-support-for-google-workspace-with-gemini)

---

## Disclaimer

Dit rapport is opgesteld op basis van publiek beschikbare informatie en dient als startpunt voor compliance-werkzaamheden. Het vervangt geen juridisch advies. Raadpleeg een gespecialiseerde privacyrechtadvocaat voor definitieve juridische beoordeling, met name met betrekking tot de verwerking van minderjarigen-data.

**Opmerking (23 februari 2026):** Het eerder geidentificeerde kritieke risico met betrekking tot de Gemini Developer API Terms of Service (verbod op gebruik door/voor minderjarigen) is opgelost door de migratie naar Vertex AI. De voormalige verwijzingen naar `generativelanguage.googleapis.com` en `GEMINI_API_KEY` in dit rapport zijn bijgewerkt en als doorgehaald gemarkeerd ter referentie.
