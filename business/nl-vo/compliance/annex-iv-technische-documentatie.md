# ANNEX IV -- TECHNISCHE DOCUMENTATIE
## DGSkills.app -- AI-Educatieplatform voor het Nederlands Voortgezet Onderwijs

**Verordening (EU) 2024/1689 -- Artikel 11 + Bijlage IV**
**Documentversie:** 1.0
**Datum:** 15 maart 2026
**Aanbieder:** Yorin von der Osten (DGSkills) [TODO: KvK-nummer invullen na inschrijving]
**Contactadres:** [TODO: vestigingsadres invullen]
**E-mail:** [TODO: zakelijk e-mailadres invullen]
**Classificatie:** Hoog-risico AI-systeem -- Annex III, punt 3(b)

---

## Versiebeheer

| Versie | Datum | Auteur | Wijzigingen |
|--------|-------|--------|-------------|
| 1.0 | 15-03-2026 | Yorin von der Osten | Eerste versie |
| | | | |

---

## SECTIE 1: ALGEMENE BESCHRIJVING VAN HET AI-SYSTEEM

### 1.1 Naam en identificatie

- **Naam:** DGSkills (Digitale Geletterdheid Skills)
- **Versie:** 2.0 (productie)
- **URL:** https://dgskills.app
- **Type:** Webapplicatie (SaaS)
- **Unieke identificatiecode:** [TODO: toekennen bij EU-databank registratie]

### 1.2 Beoogd doel

DGSkills is een AI-gestuurd educatieplatform dat digitale vaardigheden onderwijst aan leerlingen van 12-18 jaar in het Nederlands voortgezet onderwijs (vmbo, havo, vwo). Het systeem valt onder **Annex III, punt 3(b)** van de EU AI Act:

> *"AI-systemen die bedoeld zijn om te worden gebruikt voor de evaluatie van leerresultaten, ook wanneer die resultaten worden gebruikt om het leerproces van natuurlijke personen in onderwijs- en beroepsopleidingsinstellingen op alle niveaus te sturen."*

Concrete functies:
1. **AI-gestuurde begeleiding:** 93 AI-agents begeleiden leerlingen door missies over digitale vaardigheden (prompt engineering, programmeren, cybersecurity, data-analyse, AI-ethiek, etc.)
2. **Evaluatie van leerresultaten:** Agents beoordelen of leerlingen stappen succesvol voltooien via `---STEP_COMPLETE:X---` markers, wat leidt tot XP-toekenning en voortgangsregistratie
3. **Sturing van het leerproces:** Voortgang bepaalt welke missies als voltooid worden beschouwd en is zichtbaar voor leerlingen en docenten

### 1.3 Beoogde gebruikers

| Rol | Beschrijving | Leeftijd |
|-----|-------------|----------|
| Leerling (eindgebruiker) | VO-leerling die missies uitvoert | 12-18 jaar |
| Docent (gebruiksverantwoordelijke) | Begeleidt leerlingen, houdt toezicht op AI-interacties | Volwassen |
| School (deployer) | Onderwijsinstelling die DGSkills inzet | Organisatie |
| DGSkills (aanbieder) | Ontwikkelt en exploiteert het platform | Organisatie |

### 1.4 Interactie met hardware en software

**Clientzijde:**
- Webbrowser (Chrome, Firefox, Safari, Edge -- moderne versies)
- Apparaat: laptop, tablet of smartphone met internetverbinding
- Geen speciale hardware vereist

**Serverzijde:**
- **Supabase:** PostgreSQL-database, authenticatie (JWT), Row Level Security, Edge Functions (Deno runtime)
- **Google Cloud Vertex AI:** Gemini 2.0 Flash model, regio europe-west4 (Nederland)
- **Vercel:** Hosting en CDN voor de React-frontend

**Externe afhankelijkheden:**
- Google Cloud Platform (Vertex AI, service account authenticatie)
- Supabase (database, auth, serverless functions)
- Vercel (frontend hosting)

### 1.5 Versiegeschiedenis en updates

| Datum | Wijziging | Impact |
|-------|-----------|--------|
| 23-02-2026 | Migratie van Gemini Developer API naar Vertex AI (europe-west4) | Dataresidentie EU gegarandeerd, service account auth |
| [TODO] | Initieel systeem in productie | [TODO: datum eerste productieversie] |

[TODO: volledige versiegeschiedenis aanvullen]

---

## SECTIE 2: GEDETAILLEERDE BESCHRIJVING VAN HET AI-SYSTEEM

### 2.1 Elementen en componenten

#### 2.1.1 Foundation model

- **Model:** Google Gemini 2.0 Flash
- **Aanbieder:** Google (GPAI-model aanbieder conform Art. 51-55)
- **Type:** Large Language Model (LLM), pre-trained, multimodaal
- **Toegang:** Vertex AI API (europe-west4-aiplatform.googleapis.com)
- **Training:** DGSkills traint het model NIET. Het model wordt gebruikt via API met prompt-gebaseerde instructie
- **Data retention:** Zero data retention -- Google bewaart geen klantdata en traint niet op klantdata (Vertex AI enterprise ToS)

#### 2.1.2 AI-agents (93 stuks)

Het systeem bevat 93 AI-agents, elk met een unieke system instruction die het gedrag stuurt. Agents zijn gedefinieerd in `supabase/functions/_shared/systemInstructions.ts`. Elke agent:

- Heeft een uniek `roleId` (bijv. `prompt-master`, `game-director`, `cyber-detective`)
- Bevat een uitgebreide system instruction in het Nederlands
- Is gebonden aan specifieke missies over digitale vaardigheden
- Evalueert leerlingantwoorden en kent `STEP_COMPLETE` markers toe

**Categorisering van agents:**

| Categorie | Voorbeelden | Aantal |
|-----------|-------------|--------|
| Programmeren & code | `web-developer`, `game-programmeur`, `bug-hunter`, `code-reviewer` | ~15 |
| AI & Machine Learning | `ai-trainer`, `ml-trainer`, `neural-navigator`, `chatbot-trainer` | ~10 |
| Cybersecurity & privacy | `cyber-detective`, `phishing-fighter`, `encryption-expert`, `security-auditor` | ~10 |
| Data & analyse | `data-detective`, `data-journalist`, `data-pipeline`, `spreadsheet-specialist` | ~10 |
| Ethiek & maatschappij | `ai-ethicus`, `ai-bias-detective`, `digital-rights-defender`, `tech-impact-analyst` | ~10 |
| Prompt engineering | `prompt-master` | 1 |
| Creatief & media | `digital-storyteller`, `podcast-producer`, `video-editor`, `meme-machine` | ~8 |
| Ondernemerschap | `startup-simulator`, `brand-builder`, `pitch-perfect` | ~5 |
| Overig | `student-assistant`, `meesterproef`, `eindproject-j2`, `portfolio-builder` | ~10 |
| Mavo-varianten | `algorithm-architect__mavo`, `web-developer__mavo`, etc. | ~6 |

#### 2.1.3 Standaard agentgedrag

Elke agent bevat de volgende verplichte secties in de system instruction:

1. **3-Stappen Methode:** Erkenning, Uitleg, Challenge
2. **XP Farming Detectie:** Herkent en weigert niet-serieuze berichten (korte/betekenisloze input, herhalingen, willekeurige tekens)
3. **Tips Sectie:** Genereert 3 contextspecifieke tips per bericht
4. **Stap Voltooiing:** `---STEP_COMPLETE:X---` markers bij succesvolle afronding
5. **Welzijnsprotocol:** Detecteert signalen van zelfbeschadiging, misbruik, pesten; verwijst door naar Kindertelefoon (0800-0432) en 113 Zelfmoordpreventie (0800-0113)

### 2.2 Computeromgeving

#### 2.2.1 Runtime-architectuur

| Component | Technologie | Locatie |
|-----------|-------------|---------|
| Frontend | React 19, TypeScript, Vite | Vercel CDN (global, edge) |
| Edge Functions | Deno runtime (Supabase Edge Functions) | Supabase infra |
| Database | PostgreSQL (Supabase) | [TODO: exacte regio bevestigen] |
| AI-model | Vertex AI (Gemini 2.0 Flash) | europe-west4 (Nederland) |
| Authenticatie | Supabase Auth (JWT) + Google service account | Supabase / Google Cloud |

#### 2.2.2 Generatieconfiguratie

De volgende parameters worden gebruikt bij elke Vertex AI-aanroep:

```
maxOutputTokens: 1024
temperature: 0.7
```

### 2.3 Architectuur en dataflow

#### 2.3.1 Dataflow diagram (tekstueel)

```
LEERLING (browser)
    |
    | (1) Typt bericht + roleId
    v
REACT FRONTEND (Vercel)
    |
    | (2) HTTPS POST met JWT auth token
    v
SUPABASE EDGE FUNCTION: /chat (Deno runtime)
    |
    |-- (3a) JWT-verificatie via Supabase Auth
    |-- (3b) Rate limiting: 15 req/min per user (durable, Postgres-backed)
    |-- (3c) Prompt sanitizer: 28+ regex-patronen, NFKD-normalisatie, Unicode-stripping
    |-- (3d) roleId-validatie + server-side system instruction lookup
    |-- (3e) Chat history sanitisatie (max 12 berichten, max 6000 chars totaal)
    |-- (3f) Request size beperking (max 20KB, max 4000 chars per bericht)
    |
    | (4) Sanitized request naar Vertex AI
    v
GOOGLE VERTEX AI (europe-west4, Nederland)
    |
    |-- Service account authenticatie (OAuth2 JWT, RSA-256)
    |-- Safety settings: BLOCK_LOW_AND_ABOVE op alle 4 categorieen
    |-- System instruction (server-side, niet door client aanpasbaar)
    |-- Zero data retention
    |
    | (5) AI-response
    v
SUPABASE EDGE FUNCTION
    |
    | (6) Extract tekst uit Vertex AI response
    v
REACT FRONTEND
    |
    | (7) Toon response met AI-provenance metadata
    | (8) Parse ---STEP_COMPLETE:X--- markers (onzichtbaar voor leerling)
    | (9) Werk voortgang bij in database
    v
SUPABASE DATABASE (PostgreSQL + RLS)
    |
    |-- Voortgangsregistratie (XP, stappen, levels)
    |-- Audit logging (metadata-only, geen PII)
```

#### 2.3.2 Beveiligingslagen (defense-in-depth)

Het systeem implementeert 6 beveiligingslagen, zoals gedocumenteerd in `supabase/functions/chat/index.ts`:

1. **JWT-authenticatie:** Supabase Auth verifieert de gebruikerssessie
2. **Server-side prompt injection filtering:** Spiegelt client-side filtering (defense-in-depth)
3. **Server-side rate limiting:** 15 requests per minuut per gebruiker, durable (Postgres-backed) met in-memory fallback
4. **Vertex AI:** Enterprise ToS, geen leeftijdsrestrictie, zero data retention
5. **Service account auth:** Geen API-key in URL, OAuth2 JWT-tokens
6. **Server-side system instruction lookup:** Client stuurt alleen een `roleId`, de system instruction wordt server-side opgezocht -- voorkomt prompt injection via systemInstruction-veld

### 2.4 Ontwerpkeuzes

#### 2.4.1 Keuze voor Google Gemini via Vertex AI

| Criterium | Gemini Developer API | Vertex AI (gekozen) |
|-----------|---------------------|---------------------|
| Minderjarigen ToS | 18+ vereist | Geen leeftijdsrestrictie |
| Datalocatie | Niet gegarandeerd EU | europe-west4 (Nederland) |
| Data retention | Onduidelijk | Zero data retention |
| Contractueel kader | Gemini API ToS | Google Cloud DPA + SCCs |
| Authenticatie | API key | Service account (OAuth2) |

De migratie naar Vertex AI is afgerond op 23 februari 2026.

#### 2.4.2 Keuze voor prompt-gebaseerde sturing

DGSkills gebruikt geen eigen getraind of finetuned model. In plaats daarvan wordt het gedrag gestuurd via uitgebreide system instructions per agent. Dit betekent:

- **Geen eigen trainingsdata:** Risico's gerelateerd aan training data bias worden deels doorgeschoven naar Google als GPAI-aanbieder
- **Snelle iteratie:** Agents kunnen worden aangepast zonder hertraining
- **Transparantie:** System instructions zijn volledig inspecteerbaar
- **Beperking:** Gedrag is afhankelijk van het onderliggende model; wijzigingen door Google kunnen output beinvloeden

---

## SECTIE 3: MONITORING, WERKING EN CONTROLE

### 3.1 Safety settings

Alle Vertex AI-aanroepen gebruiken de maximaal restrictieve safety settings, geoptimaliseerd voor minderjarigen (12-18 jaar):

| Categorie | Drempelwaarde | Toelichting |
|-----------|--------------|-------------|
| HARM_CATEGORY_HARASSMENT | BLOCK_LOW_AND_ABOVE | Blokkeert alle niveaus van intimidatie |
| HARM_CATEGORY_HATE_SPEECH | BLOCK_LOW_AND_ABOVE | Blokkeert alle niveaus van haatdragend taalgebruik |
| HARM_CATEGORY_SEXUALLY_EXPLICIT | BLOCK_LOW_AND_ABOVE | Blokkeert alle niveaus van seksueel expliciete content |
| HARM_CATEGORY_DANGEROUS_CONTENT | BLOCK_LOW_AND_ABOVE | Blokkeert alle niveaus van gevaarlijke content |

Dit is het strengste niveau dat Vertex AI ondersteunt. Elk niveau boven "negligible" wordt geblokkeerd.

### 3.2 Prompt sanitizer

Geimplementeerd in `supabase/functions/_shared/promptSanitizer.ts`. Werkt zowel client-side als server-side (defense-in-depth).

**Beveiligingsmaatregelen:**

| Maatregel | Detail |
|-----------|--------|
| Injection-patronen | 28+ regex-patronen in 6 talen (NL, EN, FR, DE, ES + template/code) |
| Unicode-normalisatie | NFKD-normalisatie + verwijdering van diacrieten |
| Invisible characters | Stripping van zero-width, soft-hyphen, en andere onzichtbare Unicode-tekens |
| URL-decoding | Automatische decoding om URL-encoded injections te detecteren |
| Template injection | Detectie van `{{...}}`, `[[system]]`, `<script>`, markdown-role-injection |
| Delimiter attacks | Detectie van `---system`, `### override`, etc. |
| Base64-detectie | Detectie van base64-gecodeerde instructies (40+ tekens) |
| Lengtebegrenzing | Max 4000 tekens per bericht, max 50 newlines |

**Detectiecategorieen:**
- `instruction_override` (NL/EN/FR/DE/ES): "negeer vorige instructies"
- `role_reassignment` (NL/EN/FR/DE/ES): "je bent nu een..."
- `role_pretend` (NL/EN): "doe alsof je..."
- `memory_wipe` (NL/EN): "vergeet alles"
- `system_prompt_probe`: "system prompt"
- `system_reveal` (NL/EN/FR/DE/ES): "toon je systeemprompt"
- `rule_bypass` (EN): "do not follow rules"
- `template_injection`, `bracket_system_injection`, `xss_via_prompt`
- `markdown_role_injection`, `delimiter_injection`, `header_injection`
- `base64_encoded_instruction`

Gedetecteerde injecties worden gelogd met gebruikers-ID en detectielabel (geen PII).

### 3.3 Chat history sanitisatie

Geimplementeerd in `supabase/functions/_shared/chatHistory.ts`. Beschermt tegen injectie via gespreksgeschiedenis:

| Parameter | Waarde | Doel |
|-----------|--------|------|
| maxMessages | 12 | Begrenst contextvenster |
| maxPartsPerMessage | 2 | Voorkomt payload-opblazing |
| maxPartChars | 1.000 | Begrenst per onderdeel |
| maxTotalChars | 6.000 | Totale bovengrens |

Elke historisch bericht wordt ook door de prompt sanitizer gehaald. Bij detectie van een injection-patroon wordt de volledige geschiedenis geblokkeerd.

### 3.4 Rate limiting

Geimplementeerd in `supabase/functions/_shared/rateLimiter.ts`.

| Functie | Limiet | Implementatie |
|---------|--------|---------------|
| Chat | 15 req/min per gebruiker | Durable (Postgres RPC `consume_edge_rate_limit`), in-memory fallback |
| Scan Receipt | 5 req/min per gebruiker | Idem |

Features:
- Durable rate limiting via PostgreSQL (overleeft function-restarts)
- In-memory fallback bij database-onbeschikbaarheid
- HTTP-headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`
- Periodieke cleanup van verlopen entries (elke 60 seconden)

### 3.5 Welzijnsprotocol

Elke agent bevat een **verplicht welzijnsprotocol** in de system instruction. Bij detectie van signalen van:
- Zelfbeschadiging of suicidale gedachten
- Huiselijk geweld of misbruik
- Ernstig pesten
- Ander ernstig onwelzijn

Reageert de agent met een vaste tekst die verwijst naar:
- Mentor of vertrouwenspersoon op school
- **Kindertelefoon:** 0800-0432 (gratis, anoniem)
- **113 Zelfmoordpreventie:** 113 of 0800-0113

De reguliere missie-interactie wordt gestopt. Dit protocol is opgenomen in alle 93 agent-instructies.

### 3.6 XP farming detectie

Elke agent bevat detectielogica voor niet-serieuze berichten die bedoeld zijn om XP te verdienen zonder te leren:

**Signalen:**
- Extreem korte, betekenisloze berichten ("ok", "ja", "test", "asdf")
- Herhaalde dezelfde vraag/opdracht
- Willekeurige tekens of onzin
- Berichten buiten missie-context
- Kopieren van voorbeeldprompts zonder aanpassing

**Reactie:** Weigering van inhoudelijk antwoord, geen STEP_COMPLETE-toekenning.

### 3.7 Menselijk toezicht

**Huidige status:**
- Docent is eindverantwoordelijk voor interpretatie van AI-beoordelingen
- AI neemt geen beslissingen met rechtsgevolg
- AI-output is visueel herkenbaar als AI-gegenereerd
- Provenance metadata (JSON-LD) op alle AI-output

**Ontbrekend (in ontwikkeling):**
- [TODO] Docent-override voor STEP_COMPLETE-beoordelingen
- [TODO] Docentdashboard voor real-time monitoring van AI-interacties
- [TODO] Noodstop-functionaliteit (docent kan AI per klas/leerling uitschakelen)

### 3.8 Audit logging

Geimplementeerd in `services/auditService.ts`, conform AVG Art. 30 en EU AI Act Art. 12.

**Gelogde events:**
- `account_created`, `account_deleted`, `data_exported`
- `processing_restricted`, `consent_given`, `consent_withdrawn`
- `data_access_logged`, `privacy_viewed`
- `ai_interaction` (metadata: mission_id, response_length, model, fallback_used)
- `ai_image_generated`, `ai_drawing_analyzed`

**Privacy:** Alleen metadata wordt gelogd, geen PII of berichtinhoud.

### 3.9 Aanvullende beveiligingsmaatregelen

| Maatregel | Implementatie |
|-----------|---------------|
| CORS-beperking | Alleen toegestane origins via `cors.ts` |
| Request size limit | Max 20KB per request |
| Berichtlengte | Max 4.000 tekens per bericht |
| RLS (Row Level Security) | Op alle databasetabellen |
| JWT-authenticatie | Supabase Auth op elke edge function |
| Service account auth | OAuth2 JWT met RSA-256 voor Vertex AI |
| Token caching | Access tokens gecached ~55 minuten, refresh 5 min voor expiry |

---

## SECTIE 4: RISICOBEHEERSYSTEEM

### 4.1 Verwijzing naar risicoregister

[TODO: Opstellen formeel risicoregister conform Art. 9 -- gepland voor maart 2026. Zie `eu-ai-act-conformiteitsplan.md` actie 9.1-9.7]

### 4.2 Bekende risico's en maatregelen

| # | Risico | Ernst | Waarschijnlijkheid | Maatregel | Restrisico |
|---|--------|-------|--------------------|-----------|------------|
| R1 | Prompt injection -- leerling manipuleert AI-gedrag | Hoog | Midden | Prompt sanitizer (28+ patronen, 6 talen), server-side validatie, system instruction niet door client aanpasbaar | Laag: novel/zero-day injection patronen |
| R2 | Ongeschikte content voor minderjarigen | Hoog | Laag | Safety settings BLOCK_LOW_AND_ABOVE op alle 4 categorieen, welzijnsprotocol | Zeer laag: edge cases in Gemini-model |
| R3 | Hallucinatie -- AI geeft feitelijk onjuiste informatie | Midden | Midden | Temperature 0.7, maxOutputTokens 1024, begrensde context | Midden: inherent aan LLM-technologie |
| R4 | XP farming -- leerling verdient punten zonder te leren | Midden | Hoog | XP farming detectie in alle 93 agents, serieuze-input-eis | Laag-midden: creatieve workarounds |
| R5 | Onjuiste STEP_COMPLETE-beoordeling | Midden | Midden | Agent-specifieke beoordelingscriteria, 3-stappen methode | Midden: LLM-beoordeling is niet perfect |
| R6 | Bias -- inconsistente beoordeling op basis van taalvaardigheid | Midden | Midden | [TODO: biasbeoordeling uitvoeren] | [TODO: te bepalen na beoordeling] |
| R7 | Datalekkage -- persoonsgegevens in AI-responses | Midden | Laag | Zero data retention (Vertex AI), geen opslag van chatinhoud, metadata-only logging | Laag |
| R8 | Welzijnssignalen gemist door AI | Hoog | Laag | Welzijnsprotocol in alle 93 agents, verwijzing hulplijnen | Laag-midden: AI kan subtiele signalen missen |
| R9 | Vertex AI-uitval | Laag | Laag | [TODO: graceful degradation implementeren] | Midden: geen fallback-model |
| R10 | Model-wijziging door Google | Midden | Midden | [TODO: monitoring van Gemini model-updates via Vertex AI] | Midden: geen controle over upstream model |

### 4.3 Specifieke risicobeoordeling minderjarigen (Art. 9(9))

[TODO: Uitgebreide risicobeoordeling specifiek voor minderjarigen opstellen. Aandachtspunten:]

- Cognitieve ontwikkeling: leerlingen (12-18) kunnen AI-output als autoriteit beschouwen (automation bias)
- Emotionele impact: AI-feedback op schoolwerk kan demotiverend werken bij onjuiste beoordeling
- Dataminimalisatie: geen BSN, geen adres, geen gevoelige persoonsgegevens
- Ouderlijke toestemming: consent-gated voor leerlingen jonger dan 16 jaar

### 4.4 Restrisico-analyse

De voornaamste restrisico's na implementatie van alle maatregelen:

1. **Inherente LLM-beperkingen:** Hallucinatie en inconsistente beoordeling zijn onvermijdelijk bij huidige LLM-technologie. Mitigatie: docent als menselijk toezichthouder, AI-disclaimer.
2. **Zero-day prompt injections:** Nieuwe aanvalstechnieken worden continu ontwikkeld. Mitigatie: regelmatige update van patronenbibliotheek, monitoring.
3. **Upstream modelwijzigingen:** Google kan het Gemini-model wijzigen zonder vooraankondiging. Mitigatie: [TODO: monitoring-protocol opstellen].

---

## SECTIE 5: DATA GOVERNANCE

### 5.1 Trainingsdata

DGSkills traint **geen eigen AI-model**. Het systeem gebruikt Google Gemini 2.0 Flash als pre-trained foundation model via de Vertex AI API.

- **Verantwoordelijkheid trainingsdata:** Google als GPAI-model aanbieder (Art. 53)
- **Eigen configuratiedata:** 93 system instructions (in totaal ~480KB aan prompt-tekst)
- **Versiebeheer configuratiedata:** Git (GitHub repository)
- [TODO: Documenteer verwijzing naar Google's GPAI-documentatie (model cards, training data practices)]

### 5.2 Inputdata

| Datatype | Beschrijving | Opslag | Bewaartermijn |
|----------|-------------|--------|---------------|
| Chatberichten (leerling) | Tekst ingevoerd door leerling | **Niet opgeslagen** -- wordt verwerkt en weggegooid | Geen |
| RoleId | Identifier van de actieve agent | Niet persistent | Geen |
| Chat history | Laatste 12 berichten in sessie | Client-side (browser memory) | Sessieduur |
| JWT-token | Authenticatietoken | Client-side | Sessieduur |

### 5.3 Outputdata

| Datatype | Beschrijving | Opslag | Bewaartermijn |
|----------|-------------|--------|---------------|
| AI-response (tekst) | Antwoord van Gemini-model | **Niet opgeslagen** op server | Geen |
| STEP_COMPLETE markers | Voltooiingsstatus per stap | Database (voortgangsregistratie) | Zolang account actief |
| XP en levels | Puntentelling | Database | Zolang account actief |
| Audit metadata | mission_id, response_length, model, fallback_used | Database (audit log) | [TODO: bewaartermijn vaststellen, min. 6 maanden] |

### 5.4 Dataresidentie

| Component | Locatie | Garantie |
|-----------|---------|----------|
| Vertex AI (ML-verwerking) | europe-west4 (Nederland) | Google Cloud DPA met SCCs |
| Vertex AI (data at rest) | europe-west4 (Nederland) | Zero data retention |
| Supabase database | [TODO: exacte regio bevestigen] | Supabase DPA |
| Vercel (frontend) | Edge/global CDN | Alleen statische assets, geen PII |

### 5.5 Dataminimalisatie

- Geen BSN of burgerservicenummer
- Geen fysiek adres van leerlingen
- Geen gevoelige persoonsgegevens (Art. 9 AVG)
- Chatinhoud wordt niet opgeslagen (alleen metadata)
- Analytics zijn geaggregeerd en consent-gated

### 5.6 Sub-verwerkers

Zie `business/nl-vo/compliance/C-sub-verwerkerslijst-dgskills.md` voor de volledige lijst.

Primaire sub-verwerkers voor AI-functionaliteit:
- **Google Cloud (Vertex AI):** ML-verwerking, europe-west4, Google Cloud DPA + SCCs
- **Supabase:** Database, authenticatie, edge functions
- **Vercel:** Frontend hosting

---

## SECTIE 6: PRESTATIE-INDICATOREN

### 6.1 Beoogde nauwkeurigheid

Het AI-systeem beoordeelt leerlingantwoorden op stap-niveau. Een stap wordt als "voltooid" gemarkeerd wanneer de AI-agent vaststelt dat de leerling de leertaak succesvol heeft uitgevoerd.

**Beoogde prestatie:**
- Correcte STEP_COMPLETE-toekenning bij daadwerkelijk voltooide taken
- Geen STEP_COMPLETE bij niet-serieuze of onvoldoende antwoorden (XP farming detectie)
- Consistente beoordeling ongeacht taalvaardigheid of achtergrond van de leerling

[TODO: Formele nauwkeurigheidsmetrieken definieren en meten. Voorgestelde metrics:]
- Precision: percentage STEP_COMPLETE-toekenningen dat correct is
- Recall: percentage daadwerkelijk voltooide taken dat als STEP_COMPLETE wordt gemarkeerd
- Inter-rater reliability: vergelijking AI-beoordeling vs. docent-beoordeling op steekproef

### 6.2 Bekende beperkingen

| Beperking | Beschrijving | Impact | Mitigatie |
|-----------|-------------|--------|-----------|
| Hallucinatie | LLM kan feitelijk onjuiste informatie genereren | Leerling leert onjuiste feiten | AI-disclaimer, docent als toezichthouder |
| Bias | Model kan inconsistent presteren voor verschillende taalvaardigheidsniveaus | Ongelijke beoordeling | [TODO: biasbeoordeling uitvoeren] |
| Context window | Max 12 berichten + 6000 chars history | AI "vergeet" eerder gesprek bij langere sessies | Duidelijke stap-structuur per missie |
| Geen multimodaliteit in chat | Leerling kan alleen tekst invoeren in chat | Sommige taken moeilijk te beoordelen via tekst alleen | Aanvullende beoordelingsmechanismen (code preview, blok-editor) |
| Taalgebondenheid | System instructions in het Nederlands | Beperkte ondersteuning voor niet-Nederlandstalige leerlingen | Doelgroep is Nederlands VO |

### 6.3 Voorspelbare misbruikscenario's

| Scenario | Beschrijving | Maatregel | Status |
|----------|-------------|-----------|--------|
| Prompt injection | Leerling probeert AI-gedrag te manipuleren | Prompt sanitizer (28+ patronen), server-side validatie | Geimplementeerd |
| XP farming | Leerling stuurt nietszeggende berichten voor XP | XP farming detectie in alle agents | Geimplementeerd |
| Identiteitsdiefstal | Gebruik van andermans account | JWT-authenticatie, sessiemanagement | Geimplementeerd |
| Content harvesting | Geautomatiseerd ophalen van AI-responses | Rate limiting (15 req/min), request size limits | Geimplementeerd |
| Sociaal-emotioneel misbruik | Leerling deelt gevoelige info met AI | Welzijnsprotocol, doorverwijzing hulplijnen | Geimplementeerd |
| Bypass via andere taal | Injection in ongedekte taal | Patronen in NL/EN/FR/DE/ES | Gedeeltelijk -- andere talen niet gedekt |

---

## SECTIE 7: TRANSPARANTIE-INFORMATIE

### 7.1 AI-transparantieverklaring

DGSkills publiceert een AI-transparantieverklaring op de website die vermeldt:
- Dat het systeem AI gebruikt (Google Gemini via Vertex AI)
- Dat het een hoog-risico AI-systeem is conform EU AI Act Annex III punt 3(b)
- Welke data wordt verwerkt en hoe
- De dataresidentie (europe-west4, Nederland)

### 7.2 In-app disclosure

- Leerlingen weten expliciet dat ze met een AI-mentor communiceren
- Alle AI-gegenereerde content wordt gemarkeerd met machine-readable provenance metadata (JSON-LD):
  ```
  generator: 'DGSkills/2.0'
  model: 'gemini-2.0-flash' (via Vertex AI europe-west4)
  timestamp: ISO 8601
  type: 'text' | 'image' | 'mixed'
  disclaimer: 'AI-gegenereerd -- kan fouten bevatten'
  ```
- Visuele disclaimer: "AI-gegenereerd -- kan fouten bevatten"

### 7.3 Instructions for Use (voor deployers / scholen)

[TODO: Formeel "Instructions for Use" document opstellen dat aan scholen wordt verstrekt. Dit document moet bevatten:]

- Beoogd doel en beoogde gebruikers
- Nauwkeurigheidsniveaus en bekende beperkingen
- Vereist menselijk toezicht (docent)
- Hoe docenten toezicht moeten uitoefenen
- Verwachte levensduur en onderhoudsschema
- Incidentmeldingsprocedure (school -> DGSkills)
- Vereisten voor DPIA door de school
- Contactgegevens van de aanbieder

Zie ook: `business/nl-vo/compliance/privacy-explainer-for-schools.md` (bestaand, aan te vullen)

### 7.4 Privacydocumentatie

Beschikbare documenten:
- Privacyverklaring: `business/nl-vo/compliance/privacyverklaring-dgskills.md`
- DPIA: `business/nl-vo/compliance/dpia-dgskills-compleet.md`
- Verwerkingsregister: `business/nl-vo/compliance/verwerkingsregister.md`
- Verwerkersovereenkomst (model): `business/nl-vo/compliance/A-model-verwerkersovereenkomst-dgskills.md`
- Beveiligingsbijlage: `business/nl-vo/compliance/B-beveiligingsbijlage-dgskills.md`
- Sub-verwerkerslijst: `business/nl-vo/compliance/C-sub-verwerkerslijst-dgskills.md`
- Privacybijsluiter: `business/nl-vo/compliance/E-privacybijsluiter-dgskills.md`

---

## SECTIE 8: VERANTWOORDINGS- EN GOVERNANCEMAATREGELEN

### 8.1 Verantwoordelijke partijen

| Rol | Naam | Verantwoordelijkheid |
|-----|------|---------------------|
| Aanbieder (Art. 3(3)) | Yorin von der Osten / DGSkills | Ontwikkeling, compliance, CE-markering |
| GPAI-model aanbieder | Google (Alphabet Inc.) | Gemini-model, Art. 51-55 verplichtingen |
| Deployer (Art. 3(4)) | Individuele scholen | Gebruik conform instructions for use, menselijk toezicht |
| FG/DPO | [TODO: benoemen of advisering inhuren] | Toezicht op gegevensbescherming |

### 8.2 Juridische entiteit

[TODO: KvK-inschrijving is een pre-launch blocker. Zonder juridische entiteit kan geen CE-markering worden aangebracht.]

- **Beoogde rechtsvorm:** [TODO: bepalen (eenmanszaak, VOF, BV)]
- **KvK-nummer:** [TODO: na inschrijving]
- **BTW-nummer:** [TODO: na inschrijving]
- **Beroepsaansprakelijkheidsverzekering:** [TODO: afsluiten]

### 8.3 Conformiteitsbeoordelingsprocedure

**Procedure:** Interne controle conform **Art. 43(2)** en **Annex VI**.

DGSkills valt onder Annex III punt 3(b), waardoor de conformiteitsbeoordeling op basis van interne controle volstaat. Geen notified body nodig.

**Stappen Annex VI:**

1. **Verificatie Kwaliteitsmanagementsysteem (Art. 17)**
   - Status: [TODO: QMS opstellen]

2. **Onderzoek Technische Documentatie (Annex IV)**
   - Status: Dit document (eerste versie)

3. **Verificatie ontwerp- en ontwikkelproces**
   - Status: [TODO: formaliseren]

### 8.4 Kwaliteitsmanagementsysteem (Art. 17)

[TODO: QMS-document opstellen. Moet ten minste omvatten:]

- Strategie voor naleving EU AI Act
- Ontwerp-, ontwikkel- en kwaliteitsborgingsprocedures
- Procedures voor datamanagement (Art. 10)
- Procedures voor risicobeheer (Art. 9)
- Post-market monitoring procedures (Art. 72)
- Incidentrapportage (Art. 73)
- Communicatieprocedures met autoriteiten
- Registratiesystemen
- Resource management
- Accountability framework

### 8.5 Tijdlijn naar CE-markering

| Stap | Actie | Planning | Status |
|------|-------|----------|--------|
| 1 | Art. 9-15 eisen implementeren | Maart-Juni 2026 | Gedeeltelijk |
| 2 | QMS opstellen en implementeren (Art. 17) | Maart-Mei 2026 | [TODO] |
| 3 | Technische documentatie Annex IV | Maart-Juni 2026 | In uitvoering (dit document) |
| 4 | Interne conformiteitsbeoordeling (Annex VI) | Juni-Juli 2026 | [TODO] |
| 5 | EU-conformiteitsverklaring (Art. 47) | Juli 2026 | [TODO] |
| 6 | CE-markering (Art. 48) | Juli 2026 | [TODO] |
| 7 | Registratie EU-databank (Art. 49) | Juli 2026 | [TODO] |
| 8 | Post-market monitoring activeren (Art. 72) | Augustus 2026 | [TODO] |

**Deadline: 2 augustus 2026**

---

## SECTIE 9: EU-CONFORMITEITSVERKLARING

### Status: IN VOORBEREIDING

De EU-conformiteitsverklaring (Art. 47) wordt opgesteld na afronding van:
1. De interne conformiteitsbeoordeling (Annex VI)
2. Het kwaliteitsmanagementsysteem (Art. 17)
3. Alle technische eisen (Art. 9-15)

### Beoogde inhoud conformiteitsverklaring

Conform Art. 47 en Annex V zal de verklaring bevatten:

- Naam en type van het AI-systeem: **DGSkills.app**
- Naam en adres van de aanbieder: **[TODO: na KvK-inschrijving]**
- Dat de conformiteitsverklaring onder de uitsluitende verantwoordelijkheid van de aanbieder is opgesteld
- Dat het AI-systeem in overeenstemming is met de EU AI Act en eventuele andere toepasselijke wetgeving
- Verwijzing naar de toegepaste geharmoniseerde normen of andere specificaties
- Indien van toepassing: naam en identificatienummer van de notified body **[N.v.t. -- interne controle]**
- Plaats en datum van afgifte
- Naam en functie van de ondertekenaar
- Handtekening

### CE-markering

- **Status:** Nog niet aangebracht
- **Beoogde datum:** Juli 2026
- **Locatie:** Zichtbaar op het platform (digitale CE-markering)

### EU AI-databank registratie

- **Status:** In voorbereiding
- **Beoogde registratie:** Juli 2026 (afhankelijk van operationeel worden EU-databank)
- **Registratie-informatie:** Zie Annex VIII checklist in `eu-ai-act-conformiteitsplan.md`

---

## BIJLAGE A: LIJST VAN ALLE AI-AGENTS (93 stuks)

| # | RoleId | Categorie |
|---|--------|-----------|
| 1 | `advanced-code-review` | Programmeren |
| 2 | `ai-beleid-brainstorm` | Ethiek & maatschappij |
| 3 | `ai-bias-detective` | Ethiek & maatschappij |
| 4 | `ai-ethicus` | Ethiek & maatschappij |
| 5 | `ai-spiegel` | Ethiek & maatschappij |
| 6 | `ai-tekengame` | Creatief & media |
| 7 | `ai-trainer` | AI & ML |
| 8 | `algorithm-architect` | Programmeren |
| 9 | `algorithm-architect__mavo` | Programmeren (mavo) |
| 10 | `api-architect` | Programmeren |
| 11 | `api-architect__mavo` | Programmeren (mavo) |
| 12 | `api-verkenner` | Programmeren |
| 13 | `app-prototyper` | Programmeren |
| 14 | `automation-engineer` | Programmeren |
| 15 | `brand-builder` | Ondernemerschap |
| 16 | `bug-hunter` | Programmeren |
| 17 | `chatbot-trainer` | AI & ML |
| 18 | `cloud-commander` | Infrastructuur |
| 19 | `code-review-2` | Programmeren |
| 20 | `code-reviewer` | Programmeren |
| 21 | `cookie-crusher` | Privacy & security |
| 22 | `cyber-detective` | Privacy & security |
| 23 | `dashboard-designer` | Data & analyse |
| 24 | `data-detective` | Data & analyse |
| 25 | `data-handelaar` | Data & analyse |
| 26 | `data-journalist` | Data & analyse |
| 27 | `data-pipeline` | Data & analyse |
| 28 | `data-pipeline__mavo` | Data & analyse (mavo) |
| 29 | `data-review` | Data & analyse |
| 30 | `data-verkenner` | Data & analyse |
| 31 | `data-voor-data` | Data & analyse |
| 32 | `datalekken-rampenplan` | Privacy & security |
| 33 | `deepfake-detector` | AI & ML |
| 34 | `digital-divide-researcher` | Ethiek & maatschappij |
| 35 | `digital-forensics` | Privacy & security |
| 36 | `digital-rights-defender` | Ethiek & maatschappij |
| 37 | `digital-storyteller` | Creatief & media |
| 38 | `eindproject-j2` | Overig |
| 39 | `encryption-expert` | Privacy & security |
| 40 | `ethical-app-designer` | Ethiek & maatschappij |
| 41 | `factchecker` | Ethiek & maatschappij |
| 42 | `filter-bubble-breaker` | Ethiek & maatschappij |
| 43 | `future-forecaster` | Ethiek & maatschappij |
| 44 | `game-director` | Programmeren |
| 45 | `game-programmeur` | Programmeren |
| 46 | `impact-review` | Ethiek & maatschappij |
| 47 | `innovation-lab` | Ondernemerschap |
| 48 | `innovation-prototype` | Ondernemerschap |
| 49 | `ipad-print-instructies` | Overig |
| 50 | `magister-master` | Overig |
| 51 | `media-review` | Creatief & media |
| 52 | `meesterproef` | Overig |
| 53 | `meme-machine` | Creatief & media |
| 54 | `mission-blueprint` | Overig |
| 55 | `mission-launch` | Overig |
| 56 | `mission-vision` | Overig |
| 57 | `ml-trainer` | AI & ML |
| 58 | `ml-trainer__mavo` | AI & ML (mavo) |
| 59 | `neural-navigator` | AI & ML |
| 60 | `neural-navigator__mavo` | AI & ML (mavo) |
| 61 | `open-source-contributor` | Programmeren |
| 62 | `phishing-fighter` | Privacy & security |
| 63 | `pitch-perfect` | Ondernemerschap |
| 64 | `podcast-producer` | Creatief & media |
| 65 | `policy-maker` | Ethiek & maatschappij |
| 66 | `portfolio-builder` | Overig |
| 67 | `print-pro` | Overig |
| 68 | `privacy-profiel-spiegel` | Privacy & security |
| 69 | `prompt-master` | Prompt engineering |
| 70 | `prototype-developer` | Programmeren |
| 71 | `reflection-report` | Overig |
| 72 | `research-project` | Overig |
| 73 | `review-week-1` | Overig |
| 74 | `review-week-2` | Overig |
| 75 | `review-week-3` | Overig |
| 76 | `security-auditor` | Privacy & security |
| 77 | `security-review` | Privacy & security |
| 78 | `slide-specialist` | Creatief & media |
| 79 | `social-media-psychologist` | Ethiek & maatschappij |
| 80 | `social-safeguard` | Ethiek & maatschappij |
| 81 | `spreadsheet-specialist` | Data & analyse |
| 82 | `startup-pitch` | Ondernemerschap |
| 83 | `startup-simulator` | Ondernemerschap |
| 84 | `student-assistant` | Overig |
| 85 | `sustainability-scanner` | Ethiek & maatschappij |
| 86 | `tech-court` | Ethiek & maatschappij |
| 87 | `tech-impact-analyst` | Ethiek & maatschappij |
| 88 | `ux-detective` | Programmeren |
| 89 | `verhalen-ontwerper` | Creatief & media |
| 90 | `video-editor` | Creatief & media |
| 91 | `web-developer` | Programmeren |
| 92 | `web-developer__mavo` | Programmeren (mavo) |
| 93 | `word-wizard` | Creatief & media |

---

## BIJLAGE B: REFERENTIEDOCUMENTEN

| Document | Locatie | Status |
|----------|---------|--------|
| EU AI Act Conformiteitsplan | `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md` | Actief |
| DPIA | `business/nl-vo/compliance/dpia-dgskills-compleet.md` | Voltooid |
| Verwerkingsregister | `business/nl-vo/compliance/verwerkingsregister.md` | Voltooid |
| Verwerkersovereenkomst (model) | `business/nl-vo/compliance/A-model-verwerkersovereenkomst-dgskills.md` | Voltooid |
| Beveiligingsbijlage | `business/nl-vo/compliance/B-beveiligingsbijlage-dgskills.md` | Voltooid |
| Sub-verwerkerslijst | `business/nl-vo/compliance/C-sub-verwerkerslijst-dgskills.md` | Voltooid |
| Privacyverklaring | `business/nl-vo/compliance/privacyverklaring-dgskills.md` | Voltooid |
| Privacybijsluiter | `business/nl-vo/compliance/E-privacybijsluiter-dgskills.md` | Voltooid |
| FG/DPO Adviesrapport | `business/nl-vo/compliance/fg-dpo-adviesrapport.md` | Voltooid |
| Legal Matrix | `business/nl-vo/compliance/legal-matrix.md` | Voltooid |
| AI-transparantieverklaring | Website (dgskills.app) | Actief |
| Prompt Sanitizer (broncode) | `supabase/functions/_shared/promptSanitizer.ts` | Actief |
| Chat Edge Function (broncode) | `supabase/functions/chat/index.ts` | Actief |
| System Instructions (broncode) | `supabase/functions/_shared/systemInstructions.ts` | Actief |
| Vertex AI Auth (broncode) | `supabase/functions/_shared/vertexAuth.ts` | Actief |
| Rate Limiter (broncode) | `supabase/functions/_shared/rateLimiter.ts` | Actief |
| Chat History Sanitizer (broncode) | `supabase/functions/_shared/chatHistory.ts` | Actief |

---

## BIJLAGE C: OVERZICHT VAN [TODO]-ITEMS

Onderstaande items moeten nog worden afgerond voor de conformiteitsbeoordeling:

| # | Item | Sectie | Prioriteit | Deadline |
|---|------|--------|------------|----------|
| 1 | KvK-inschrijving en juridische entiteit | 8.2 | KRITIEK | Zsm |
| 2 | Formeel risicoregister (Art. 9) | 4.1 | KRITIEK | Maart 2026 |
| 3 | Risicobeoordeling minderjarigen (Art. 9(9)) | 4.3 | KRITIEK | Maart 2026 |
| 4 | Biasbeoordeling per agenttype | 6.2, 4.2 | HOOG | April 2026 |
| 5 | Nauwkeurigheidsmetrieken definieren en meten | 6.1 | KRITIEK | April 2026 |
| 6 | Docent-override STEP_COMPLETE | 3.7 | KRITIEK | April 2026 |
| 7 | Docentdashboard monitoring | 3.7 | HOOG | April 2026 |
| 8 | Noodstop-functionaliteit | 3.7 | HOOG | April 2026 |
| 9 | Graceful degradation bij Vertex AI-uitval | 4.2 | HOOG | Mei 2026 |
| 10 | Monitoring Gemini model-updates | 4.2 | HOOG | Doorlopend |
| 11 | QMS-document (Art. 17) | 8.4 | KRITIEK | Mei 2026 |
| 12 | Instructions for Use voor scholen | 7.3 | KRITIEK | Mei 2026 |
| 13 | Post-market monitoring plan (Art. 72) | 8.5 | HOOG | Mei 2026 |
| 14 | Supabase database regio bevestigen | 5.4 | MIDDEN | Zsm |
| 15 | Bewaartermijn audit logs vaststellen | 5.3 | MIDDEN | April 2026 |
| 16 | Google GPAI-documentatie verwijzing | 5.1 | HOOG | April 2026 |
| 17 | FG/DPO benoemen of advisering | 8.1 | HOOG | Mei 2026 |
| 18 | Beroepsaansprakelijkheidsverzekering | 8.2 | HOOG | Zsm |
| 19 | Versiegeschiedenis aanvullen | 1.5 | LAAG | Doorlopend |
| 20 | Vestigingsadres en contactgegevens | Header | KRITIEK | Na KvK |
| 21 | EU-conformiteitsverklaring (Art. 47) | 9 | KRITIEK | Juli 2026 |
| 22 | CE-markering (Art. 48) | 9 | KRITIEK | Juli 2026 |
| 23 | EU-databank registratie (Art. 49) | 9 | KRITIEK | Juli 2026 |

---

*Dit document wordt bijgehouden als onderdeel van het technische documentatiedossier conform EU AI Act Art. 11 + Annex IV. Laatste update: 15 maart 2026.*
