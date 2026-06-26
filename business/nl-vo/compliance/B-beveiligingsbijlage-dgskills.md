# Bijlage 2 — Beveiligingsbijlage DGSkills

**Bij:** Model Verwerkersovereenkomst 4.0 — DGSkills
**Versie:** 1.0
**Datum:** 23 februari 2026

---

## 1. Inleiding

Deze Beveiligingsbijlage beschrijft de technische en organisatorische maatregelen (TOMs) die DGSkills treft om de Persoonsgegevens die in het kader van de Verwerkersovereenkomst worden verwerkt, te beschermen conform artikel 32 AVG. De maatregelen zijn afgestemd op de aard, omvang, context en doeleinden van de Verwerking, en op de risico's voor de rechten en vrijheden van Betrokkenen — in het bijzonder minderjarige leerlingen.

---

## 2. Architectuuroverzicht

DGSkills is een webgebaseerde SaaS-applicatie met de volgende architectuur:

| Component | Technologie | Locatie |
|---|---|---|
| Frontend | React 19 + TypeScript (SPA) | Vercel Edge Network; exacte edge-locatie afhankelijk van routing |
| Backend/API | Supabase (PostgreSQL + Auth + Edge Functions) | EU-projectregio / EER, exact te verifiëren in projectsettings en DPA |
| AI-verwerking | Mistral AI en Black Forest Labs FLUX via server-side Supabase Edge Functions | Providerregio's en DPA's contractueel/projectmatig te verifiëren |
| E-maildienst | Zoho Mail | EU (eu.zoho.com) |
| DNS/CDN | Vercel | EU-edge nodes |

---

## 3. Technische beveiligingsmaatregelen

### 3.1 Versleuteling (Encryptie)

| Maatregel | Implementatie |
|---|---|
| **Transport (data-in-transit)** | Alle verbindingen verlopen via HTTPS/TLS 1.2+ (minimaal). HSTS is ingeschakeld. Geen onversleuteld verkeer mogelijk. |
| **Opslag (data-at-rest)** | PostgreSQL-database bij Supabase is versleuteld met AES-256. Back-ups zijn eveneens versleuteld opgeslagen. |
| **API-communicatie** | Alle communicatie met Sub-verwerkers (Mistral AI, Black Forest Labs, Zoho en hostingproviders) verloopt via versleutelde API-verbindingen (TLS 1.2+). |
| **Wachtwoorden** | Wachtwoorden worden gehasht opgeslagen met bcrypt (Supabase Auth). Plaintext-wachtwoorden worden niet opgeslagen. |

### 3.2 Toegangsbeheersing (Autorisatie en Authenticatie)

| Maatregel | Implementatie |
|---|---|
| **Authenticatie** | Supabase Authentication met e-mail/wachtwoord. SSO via Microsoft (Entra ID) en Google Workspace wordt ondersteund voor naadloze integratie met school-accounts. |
| **Multi-factor authenticatie (MFA)** | Beschikbaar voor beheerders en docenten. DGSkills' eigen TOTP (AAL2) is de standaard voor e-mail/wachtwoord-logins. Als alternatief geldt een per-school opt-in: scholen die schriftelijk attesteren dat hun identity provider (Microsoft Entra ID of Google Workspace) MFA afdwingt voor docent- en beheerdersaccounts, kunnen die door de IdP afgedwongen MFA laten gelden als invulling van de MFA-eis. Gedeelde verantwoordelijkheid (AVG Art. 28/32): de school als verwerkingsverantwoordelijke dwingt de MFA af in haar eigen tenant; DGSkills als verwerker vertrouwt daar uitsluitend op bij een opt-in. Restrisico: een SSO-login bewijst niet per sessie dát MFA is uitgevoerd; per-login amr/acr-verificatie is voorzien als toekomstige hardening. |
| **Rolgebaseerde toegang (RBAC)** | Vier rollen: `leerling`, `docent`, `schoolbeheerder`, `platform-admin`. Elke rol heeft uitsluitend toegang tot de gegevens die voor de functie noodzakelijk zijn. |
| **Row Level Security (RLS)** | Supabase RLS-policies op database-niveau. Leerlingen zien uitsluitend hun eigen gegevens. Docenten zien uitsluitend gegevens van leerlingen in hun klassen. Schoolbeheerders zien gegevens van hun school. |
| **API-sleutelbeheer** | AI-providerkeys en API-keys (waaronder Supabase service role) worden uitsluitend server-side opgeslagen via omgevingsvariabelen. Geen secrets in client-side code of browserresponses. |
| **Sessiebeheer** | JWT-tokens met beperkte geldigheid. Automatische sessie-time-out na inactiviteit. |

### 3.3 Scheiding van gegevens (Multi-tenancy)

| Maatregel | Implementatie |
|---|---|
| **Schoolscoping** | Elke school is een logisch gescheiden tenant. Gegevens van school A zijn niet toegankelijk vanuit school B. Dit wordt afgedwongen op database-niveau via RLS-policies met `school_id`. |
| **Klasscoping** | Binnen een school zijn gegevens per klas gescheiden. Docenten zien uitsluitend hun eigen klassen. |
| **Leerlingscoping** | Leerlingen hebben uitsluitend toegang tot hun eigen account, voortgang, en chatgeschiedenis. |

### 3.4 Netwerk- en infrastructuurbeveiliging

| Maatregel | Implementatie |
|---|---|
| **Firewall/netwerk** | Supabase-database is niet rechtstreeks via het publieke internet bereikbaar. Toegang verloopt uitsluitend via de Supabase API-gateway. |
| **DDoS-bescherming** | Vercel biedt ingebouwde DDoS-mitigatie op de CDN/edge-laag. |
| **Rate limiting** | Rate limiting op API-endpoints om misbruik en brute-force-aanvallen te voorkomen. |
| **CORS** | Strict CORS-beleid: alleen dgskills.app en geautoriseerde domeinen. |
| **Content Security Policy** | CSP-headers ter preventie van XSS-aanvallen. |

### 3.5 Logging en monitoring

| Maatregel | Implementatie |
|---|---|
| **Toegangslogging** | Alle API-aanroepen worden gelogd met tijdstip, gebruiker-ID, actie en resultaat. |
| **Authenticatielogging** | Login-pogingen (geslaagd en mislukt) worden gelogd. |
| **Beveiligingsmonitoring** | Automatische alerts bij verdachte activiteiten (meerdere mislukte inlogpogingen, ongebruikelijke dataverzoeken). |
| **Audittrail** | Wijzigingen in gebruikersrollen, toegangsrechten, en schoolconfiguratie worden vastgelegd in een auditlogboek. |
| **Bewaartermijn logs** | Logging wordt maximaal 12 maanden bewaard, daarna automatisch verwijderd. |

### 3.6 AI-specifieke maatregelen

| Maatregel | Implementatie |
|---|---|
| **Data naar AI-endpoints** | Alleen de noodzakelijke context (opdrachttekst, leerling-invoer, relevante missiecontext) wordt server-side naar Mistral AI of Black Forest Labs gestuurd. Geen volledige leerlingprofielen of identificeerbare gegevens indien niet strikt noodzakelijk. |
| **Providertraining en retentie** | Provider-calls worden geconfigureerd en gecontracteerd om gebruik voor modeltraining te voorkomen waar dit door providerafspraken en instellingen wordt gedekt. Retentie- en regio-bewijs moet per provider worden bewaard. |
| **AI-output filtering** | Gegenereerde AI-content wordt gefilterd op ongepaste inhoud met server-side outputfilters en missiespecifieke instructies. |
| **Gebruik met minderjarigen** | Voor schoolgebruik moet per AI-provider worden gecontroleerd dat de toepasselijke voorwaarden, DPA en instellingen inzet voor minderjarigen en onderwijsdata ondersteunen. |
| **Transparantie** | Gebruikers worden geïnformeerd dat zij met een AI-systeem communiceren (conform EU AI Act artikel 50). |

### 3.7 Back-up en herstel

| Maatregel | Implementatie |
|---|---|
| **Back-upfrequentie** | Dagelijkse automatische back-ups door Supabase (Point-in-Time Recovery). |
| **Back-uplocatie** | Gekoppelde Supabase projectregio / EER; exact te verifiëren in projectsettings en DPA. |
| **Hersteltijd (RTO)** | Doelstelling: maximaal 4 uur. |
| **Herstelpunt (RPO)** | Doelstelling: maximaal 1 uur (Point-in-Time Recovery). |
| **Back-upversleuteling** | Back-ups zijn versleuteld opgeslagen (AES-256). |
| **Hersteltest** | Periodieke hersteltests (minimaal 2x per jaar). |

---

## 4. Organisatorische beveiligingsmaatregelen

### 4.1 Personeelsbeleid

| Maatregel | Toelichting |
|---|---|
| **Geheimhouding** | Alle personen die toegang hebben tot Persoonsgegevens zijn gebonden aan een geheimhoudingsovereenkomst. |
| **Beperkte toegang** | Toegang tot productiedata is beperkt tot de eigenaar/ontwikkelaar. Bij groei wordt het principe van least privilege toegepast. |
| **Bewustwording** | Periodieke (ten minste jaarlijkse) bewustzijnstraining op het gebied van privacy en informatiebeveiliging. |

### 4.2 Ontwikkelproces (Secure Development)

| Maatregel | Toelichting |
|---|---|
| **Privacy by Design** | Privacyoverwegingen worden meegenomen bij het ontwerp van nieuwe functionaliteiten. |
| **Code review** | Wijzigingen in code worden gecontroleerd voor deployment. |
| **Gescheiden omgevingen** | Ontwikkel-, test- en productieomgevingen zijn gescheiden. Testomgevingen bevatten geen echte Persoonsgegevens. |
| **Dependency management** | Regelmatige controle op kwetsbaarheden in gebruikte softwarebibliotheken (npm audit, Dependabot). |
| **Versiebeheer** | Alle codewijzigingen worden bijgehouden in een versiebeheersysteem (Git). |

### 4.3 Leveranciersbeheer

| Maatregel | Toelichting |
|---|---|
| **Sub-verwerkersbeoordeling** | Alle Sub-verwerkers worden beoordeeld op hun privacyen beveiligingsmaatregelen voordat zij worden ingeschakeld. |
| **Contractuele waarborgen** | Met alle Sub-verwerkers zijn Data Processing Agreements of equivalente contractuele waarborgen afgesloten. |
| **Periodieke evaluatie** | De Sub-verwerkerslijst en de bijbehorende waarborgen worden ten minste jaarlijks geëvalueerd. |

---

## 5. Incidentrespons procedure

### 5.1 Definitie

Een beveiligingsincident is elke gebeurtenis die de vertrouwelijkheid, integriteit of beschikbaarheid van Persoonsgegevens kan aantasten, waaronder maar niet beperkt tot Datalekken.

### 5.2 Incidentfasen

| Fase | Actie | Termijn |
|---|---|---|
| **1. Detectie** | Incident wordt gedetecteerd via monitoring, melding van gebruiker, of melding van Sub-verwerker. | Doorlopend |
| **2. Triage en classificatie** | Ernst wordt bepaald: laag / gemiddeld / hoog / kritiek. Impact op Betrokkenen wordt ingeschat. | Binnen 4 uur na detectie |
| **3. Containment** | Directe maatregelen om verdere schade te beperken (bijv. blokkeren van toegang, isoleren van systeem). | Onmiddellijk na triage |
| **4. Melding aan school** | De Verwerkingsverantwoordelijke wordt geïnformeerd over het incident conform artikel 8 van de Verwerkersovereenkomst. | Binnen 24 uur na detectie |
| **5. Onderzoek en herstel** | Diepgaand onderzoek naar oorzaak. Herstelmaatregelen worden geïmplementeerd. | Zo snel mogelijk, doorlopend |
| **6. Definitieve rapportage** | Volledige incidentrapportage met oorzaakanalyse, impact, genomen maatregelen en preventieve verbeteringen. | Binnen 5 werkdagen |
| **7. Evaluatie en verbetering** | Lessons learned worden vertaald naar structurele verbeteringen in beleid, procedures of techniek. | Binnen 10 werkdagen |

### 5.3 Communicatie bij incidenten

| Communicatielijn | Methode | Contactpersoon |
|---|---|---|
| DGSkills → School | E-mail naar opgegeven privacycontact + telefonisch bij kritieke incidenten | Privacycontactpersoon school |
| School → Autoriteit Persoonsgegevens | Via het meldloket van de AP (indien van toepassing) | FG of privacyverantwoordelijke school |
| School → Betrokkenen | Conform beoordeling door de school (artikel 34 AVG) | School |

### 5.4 Incidentcontact DGSkills

| Contactgegevens | |
|---|---|
| E-mail | security@dgskills.app |
| Telefoon | Op aanvraag via security@dgskills.app |
| Beschikbaarheid | Ma-vr 08:00-18:00 CET; voor kritieke incidenten: 24/7 via e-mail met reactie binnen 4 uur |

---

## 6. Fysieke beveiliging

DGSkills maakt als SaaS-platform gebruik van cloudinfrastructuur. De fysieke beveiliging van datacenters wordt gewaarborgd door de Sub-verwerkers:

| Sub-verwerker | Datacenter | Certificeringen |
|---|---|---|
| Supabase / AWS | EU-projectregio / EER, exact te verifiëren | ISO 27001, SOC 2 Type II, SOC 3 waar van toepassing |
| Mistral AI | Providerregio en subprocessors te verifiëren | Providercertificeringen en DPA te verifiëren |
| Black Forest Labs | Providerregio en subprocessors te verifiëren | Providercertificeringen en DPA te verifiëren |
| Vercel / AWS | Edge-routing afhankelijk van netwerk en configuratie | ISO 27001, SOC 2 Type II waar van toepassing |

---

## 7. Periodieke evaluatie

| Activiteit | Frequentie |
|---|---|
| Evaluatie beveiligingsmaatregelen | Ten minste jaarlijks |
| Penetratietest of vulnerability scan | Ten minste jaarlijks |
| Review Sub-verwerkerslijst | Ten minste jaarlijks |
| Hersteltest back-ups | Ten minste 2x per jaar |
| Evaluatie incidentresponsprocedure | Na elk incident, maar minimaal jaarlijks |
| Privacy-impactbeoordeling bij nieuwe features | Bij elke significante wijziging |

---

## 8. Roadmap beveiliging

DGSkills is een groeiende organisatie. Onderstaande maatregelen staan op de roadmap:

| Maatregel | Verwachte realisatie |
|---|---|
| SOC 2 Type II-certificering of IBP ROSA-toetsing | 2027 |
| ISO 27001-certificering | 2027-2028 |
| Formeel Security Operations Center (SOC) | Bij schaalvergroting |
| Bug bounty-programma | Bij voldoende schaalgrootte |
| Jaarlijkse externe penetratietest | 2026 (eerste test) |

---

*Deze Beveiligingsbijlage is een levend document en wordt ten minste jaarlijks of bij significante wijzigingen in de dienstverlening of architectuur herzien. De meest recente versie is beschikbaar bij DGSkills op verzoek.*
