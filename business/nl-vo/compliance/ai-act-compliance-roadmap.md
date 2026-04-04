# EU AI Act Compliance Roadmap — DGSkills.app

**Voor: Schoolbesturen, ICT-coördinatoren en inkoopverantwoordelijken**
**Versie:** 1.0 | **Datum:** 4 april 2026
**Opgesteld door:** Yorin Vonder, DGSkills.app | KvK 81819889

---

## Managementsamenvatting

DGSkills.app is geclassificeerd als **hoog-risico AI-systeem** onder de EU AI Act (Annex III, punt 3b). De wettelijke deadline voor volledige compliance is **2 augustus 2026**. Dit document beschrijft onze roadmap, huidige status, en de maatregelen die we nemen om tijdig te voldoen. Scholen kunnen dit document gebruiken als onderbouwing bij hun eigen AI-governance en inkoopbeslissingen.

---

## 1. Classificatie en onderbouwing

### Waarom hoog-risico?

DGSkills valt onder **Annex III, punt 3(b)** van Verordening (EU) 2024/1689:

> *"AI-systemen die bedoeld zijn om te worden gebruikt voor de evaluatie van leerresultaten, ook wanneer die resultaten worden gebruikt om het leerproces te sturen."*

**Concrete redenen:**
- AI-agents genereren `STEP_COMPLETE` markers die leerlingvoortgang automatisch registreren
- XP-toekenning en level-progressie sturen het leerproces
- 80+ AI-agents beoordelen of een leerling een stap succesvol heeft voltooid
- De voortgangsregistratie wordt zichtbaar voor docenten en leerlingen
- Doelgroep is minderjarigen (12-18 jaar) — een kwetsbare groep onder Art. 9(9)

### Wat valt wél onder hoog-risico?

| Functie | Reden |
|---------|-------|
| AI-gestuurde voortgangsbeoordeling | Evalueert leerresultaten |
| STEP_COMPLETE markers | Automatische beslissing over voltooiing |
| XP/level-systeem | Stuurt het leerproces |
| SLO-kerndoelen rapportage | Beoordelingsoverzicht voor docenten |

### Wat valt NIET onder hoog-risico?

| Functie | Reden |
|---------|-------|
| AI-chatassistent (informatief) | Geeft uitleg, geen beoordeling |
| Spelletjes en interactieve elementen | Geen AI-beoordeling van leerresultaten |
| Docentdashboard (weergave) | Presenteert data, neemt geen beslissingen |

---

## 2. Huidige status per verplichting

### Overzicht

| Artikel | Onderwerp | Status | Toelichting |
|---------|-----------|--------|-------------|
| Art. 9 | Risicobeheerssysteem | 🟡 In uitvoering | Risicoregister opgesteld, formalisering loopt |
| Art. 10 | Data en datagovernance | 🟢 Grotendeels voldaan | Vertex AI EU, zero data retention, DPIA compleet |
| Art. 11 | Technische documentatie | 🟡 In uitvoering | Annex IV dossier in opbouw |
| Art. 12 | Logging en registratie | 🟢 Voldaan | Audit logging geïmplementeerd (AVG Art. 30 + AI Act Art. 12) |
| Art. 13 | Transparantie | 🟢 Grotendeels voldaan | AI-transparantieverklaring live, AI-labels in UI |
| Art. 14 | Menselijk toezicht | 🟡 In uitvoering | Docent is eindverantwoordelijk, override-functie in ontwikkeling |
| Art. 15 | Nauwkeurigheid en security | 🟢 Grotendeels voldaan | Prompt injection bescherming, RLS, Safety Settings |
| Art. 47 | EU-conformiteitsverklaring | 🔴 Nog niet | Volgt na afronding Art. 9-15 |
| Art. 49 | EU-databank registratie | 🔴 Nog niet | Registratie na conformiteitsverklaring |

---

## 3. Wat al werkt — bestaande maatregelen

### Datagovernance (Art. 10)
- **Data residency:** Alle AI-verwerking via Google Vertex AI in **europe-west4 (Nederland)**
- **Zero data retention:** Google verwerkt geen klantdata voor modeltraining
- **Dataminimalisatie:** Geen BSN, geen thuisadres, minimale PII
- **DPIA:** Volledig uitgevoerd en gedocumenteerd

### Logging (Art. 12)
- Audit logging voor alle AI-interacties (mission_id, model, tijdstip)
- Geen PII in logs — alleen geanonimiseerde metadata
- Bewaartermijn gedocumenteerd

### Transparantie (Art. 13)
- AI-transparantieverklaring publiek beschikbaar
- AI-content in de app gelabeld als "AI-gegenereerd — kan fouten bevatten"
- Privacyverklaring beschrijft AI-gebruik specifiek voor scholen

### Cybersecurity (Art. 15)
- Prompt injection bescherming (40+ patronen, NL + EN)
- Maximaal restrictieve Safety Settings (BLOCK_LOW_AND_ABOVE)
- Row-Level Security op databaseniveau
- JWT-authenticatie op alle Edge Functions
- CORS-beperking op productiedomein
- XP-farming detectie in AI-agents

---

## 4. Wat we nog doen — roadmap tot augustus 2026

### Q2 2026 (april - juni)

| Actie | Artikel | Deadline | Status |
|-------|---------|----------|--------|
| Risicoregister formaliseren en publiceren | Art. 9 | April 2026 | In uitvoering |
| Specifieke risicobeoordeling minderjarigen (Art. 9(9)) | Art. 9 | April 2026 | In uitvoering |
| Technisch documentatiedossier Annex IV (deel 1-4) | Art. 11 | Mei 2026 | Gestart |
| Docent-override voor STEP_COMPLETE implementeren | Art. 14 | Mei 2026 | Gepland |
| "Noodstop" functionaliteit per klas/leerling | Art. 14 | Juni 2026 | Gepland |
| Instructions for Use document voor scholen | Art. 13 | Juni 2026 | Gepland |

### Q3 2026 (juli - augustus)

| Actie | Artikel | Deadline | Status |
|-------|---------|----------|--------|
| Technisch documentatiedossier Annex IV (deel 5-9) | Art. 11 | Juli 2026 | Gepland |
| Interne conformiteitsbeoordeling (Art. 43) | Art. 43 | Juli 2026 | Gepland |
| EU-conformiteitsverklaring opstellen | Art. 47 | Augustus 2026 | Gepland |
| Registratie EU-databank | Art. 49 | Augustus 2026 | Gepland |
| Post-market monitoring plan | Art. 72 | Augustus 2026 | Gepland |

---

## 5. Wat dit betekent voor scholen

### Als gebruiksverantwoordelijke (deployer)

Scholen die DGSkills inzetten zijn **gebruiksverantwoordelijken** onder Art. 26 van de AI Act. Dit betekent:

| Verplichting school | Hoe DGSkills helpt |
|--------------------|--------------------|
| Gebruik conform beoogd doel | Instructions for Use document (Q2 2026) |
| Menselijk toezicht waarborgen | Docentdashboard + override-functionaliteit |
| Technische competentie gebruikers | Docententraining bij onboarding |
| Incidenten melden aan aanbieder | Incidentmelding-procedure in DPA |
| Input-data relevant en representatief | Leerlingdata wordt door school beheerd |

### Wat u van ons krijgt

Bij ondertekening van een licentie ontvangt u:
1. **Dit roadmap-document** — als bewijs van compliance-planning
2. **Instructions for Use** — hoe DGSkills conform Art. 13 te gebruiken
3. **AI-transparantieverklaring** — publiek beschikbaar
4. **DPIA ondersteuning** — template en ingevuld voorbeeld
5. **Conformiteitsverklaring** — zodra beschikbaar (uiterlijk augustus 2026)

---

## 6. Risico's en mitigatie

| Risico | Impact | Mitigatie |
|--------|--------|-----------|
| Deadline niet gehaald | Non-compliance, mogelijke sanctie | Buffer ingebouwd (planning klaar juli, deadline augustus) |
| Regelgeving wijzigt | Aanvullende eisen | Monitoring via AI Act Compass en branchevereniging |
| Google wijzigt Vertex AI voorwaarden | Impact op datagovernance | Contractuele waarborgen in Google Cloud DPA |
| Technische implementatie complexer dan verwacht | Vertraging | Prioritering op must-haves (Art. 9, 14), nice-to-haves in Q4 |

### Sanctierisico context
- Maximale boete voor non-compliance: **3% van wereldwijde jaaromzet** of **€15 miljoen** (hoogste bedrag)
- Voor KMO's/startups geldt proportionaliteitsbeginsel
- Handhaving start per 2 augustus 2026 voor hoog-risico systemen
- Toezichthouder Nederland: Autoriteit Persoonsgegevens (AP) als markttoezichtautoriteit

---

## 7. Contact en verantwoordelijkheid

| | |
|-|-|
| **Aanbieder** | DGSkills.app — Eenmanszaak |
| **Verantwoordelijke** | Yorin Vonder |
| **KvK** | 81819889 |
| **Vestiging** | Zwolle, Nederland |
| **Contact** | Via dgskills.app |
| **AI Act compliance-eigenaar** | Yorin Vonder |

---

## 8. Referenties

| Document | Locatie |
|----------|---------|
| EU AI Act conformiteitsbeoordelingsplan (intern) | `compliance/eu-ai-act-conformiteitsplan.md` |
| Risicoregister AI Act | `compliance/risicoregister-ai-act.md` |
| Technische documentatie Annex IV | `compliance/annex-iv-technische-documentatie.md` |
| DPIA | `compliance/dpia-dgskills-compleet.md` |
| AI-transparantieverklaring | Publiek op dgskills.app |
| Legal matrix | `compliance/legal-matrix.md` |

---

*Dit document wordt bijgewerkt bij elke significante voortgang. Laatste update: 4 april 2026.*
