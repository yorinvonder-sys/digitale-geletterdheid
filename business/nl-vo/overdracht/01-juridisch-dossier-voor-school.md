# Juridisch Dossier DGSkills — Voor de FG van Almere College

**Doel van dit document:** Geeft de Functionaris voor Gegevensbescherming (FG) of AVG-contactpersoon van de school een volledig overzicht van wat er ligt, wat er nog moet, en in welke volgorde.

**Opgesteld door:** Yorin Vonder, juni 2026
**Status:** Ter beoordeling door school-FG

---

## 1. Wat doet DGSkills?

DGSkills.app is een SaaS-platform voor digitale geletterdheid in het voortgezet onderwijs. Leerlingen (12-18 jaar) werken aan missies die gekoppeld zijn aan de SLO-kerndoelen Digitale Geletterdheid. Een AI-component geeft feedback op ingeleverd werk. Docenten zien voortgang via een dashboard.

**Betrokken partijen:**
- **Verwerkingsverantwoordelijke:** De school (Almere College / bevoegd gezag) — beslist over doel en middelen van de verwerking
- **Verwerker:** DGSkills (eenmanszaak Yorin Vonder, of een op te richten rechtspersoon — zie `00-eigenaarschaps-besluit.md`)

> **Eerste vereiste:** het eigenaarschapsbesluit in `00-eigenaarschaps-besluit.md` moet genomen zijn voordat de rest van dit dossier relevant is.

---

## 2. Welke persoonsgegevens worden verwerkt?

| Categorie | Voorbeelden | Bewaartermijn |
|---|---|---|
| Accountgegevens | E-mail, naam, rol, school-ID | Zolang gebruiker actief is |
| Onderwijsdata | Missieresultaten, XP, voortgang, feedback | 1 jaar operationeel |
| AI-interactiedata | Aantal tokens, tijdstip — géén ruwe chatberichten | 1 jaar |
| Toestemmingsdata | Ouderlijke toestemming <16 jaar, ingetrokken-op-datum | 3 jaar (AVG art. 30) |
| Welzijnsdata | Signalen in chat (categorie alleen, géén tekst) | Directe docentnotificatie |
| Auditlog | Wie deed wat, wanneer | 3 jaar (compliance) |

**Bijzondere categorie:** Nee. Welzijnssignalen worden niet als bijzonder persoonsgegeven opgeslagen (geen diagnose, alleen categorie-label voor docent).

**Minderjarigen:** Leerlingen <16 jaar vereisen ouderlijke toestemming conform AVG art. 8. Procedure staat in bijlage D.

---

## 3. Welke sub-verwerkers zijn er?

De sub-verwerkerslijst hieronder komt uit het officiële compliance-document `C-sub-verwerkerslijst-dgskills.md` (datum: 23 februari 2026). Dit is het juridisch bindende overzicht.

| Verwerker | Dienst | Datalocatie | DPA-status |
|---|---|---|---|
| Supabase | Database, authenticatie, edge functions | AWS Frankfurt (EU, eu-central-1) | Actief (SCCs) |
| Google LLC / Vertex AI | AI-feedback via Gemini — dataverwerking in EU | Google Cloud europe-west4 (Eemshaven, NL) | Actief (Google Cloud DPA, zero data retention) |
| Vercel | Hosting, CDN | Amsterdam edge | Actief (EU-US DPF + SCCs) |
| Zoho Corporation | E-mail (wachtwoordherstel, notificaties) | Zoho EU-datacenter (Nederland) | Actief |

Alle vier hebben actieve DPA's. Dataoverdrachten buiten de EU zijn beveiligd via Standard Contractual Clauses (SCCs) of het EU-US Data Privacy Framework.

> **Let op voor de FG:** De code van het platform gebruikt mogelijk inmiddels Mistral AI (chat/feedback) en Black Forest Labs (beeldgeneratie) in plaats van of naast Google Vertex AI. De sub-verwerkerslijst (`C-sub-verwerkerslijst-dgskills.md`) is voor het laatste bijgewerkt op 23 februari 2026 en moet worden geactualiseerd vóór de FG-toets. Dit is een actiepunt voor Yorin/de nieuwe beheerder, niet voor de school.

---

## 4. Actielijst voor de school (volgorde is load-bearing)

**Stap 0** — Eigenaarschapsbesluit nemen *(blokkeert alle andere stappen)*
- Document: `00-eigenaarschaps-besluit.md`
- Actie: schoolleiding besluit Optie A, B of C en legt dit schriftelijk vast
- Tijdsduur: bestuurlijk besluit, afhankelijk van interne procedures

**Stap 1** — Verwerkersovereenkomst ondertekenen *(blokkeert ingebruikname)*
- Document: `compliance/A-model-verwerkersovereenkomst-dgskills.md`
- Actie: bevoegd gezag ondertekent DPA conform art. 28 AVG
- Tijdsduur: ~1 uur doorlezen + tekenen
- Zonder getekende DPA: ingebruikname is juridisch niet toegestaan

**Stap 2** — FG beoordeelt DPIA en sub-verwerkerslijst
- Documenten: `compliance/dpia-dgskills-compleet.md` + `compliance/C-sub-verwerkerslijst-dgskills.md`
- Actie: FG beoordeelt of school-specifieke risico's gedekt zijn; tekent DPIA-endorsement
- Tijdsduur: schatting ~4-8 uur FG-tijd

**Stap 3** — Rechtsgrondslag vaststellen
- Optie 1: publieke taak (art. 6(1)(e) AVG) — geldt als digitale geletterdheid onderdeel is van het officiële onderwijsprogramma
- Optie 2: gerechtvaardigd belang (art. 6(1)(f) AVG)
- Actie: FG legt keuze vast in het schoolverwerkingsregister

**Stap 4** — DGSkills opnemen in schoolverwerkingsregister
- Document: `compliance/verwerkingsregister.md` (DGSkills-kant; school maakt eigen entry)
- Actie: school-AVG-contactpersoon voegt DGSkills toe aan art. 30-register
- Tijdsduur: ~30 minuten

**Stap 5** — Ouderlijke toestemming <16 jaar inrichten
- Document: `compliance/D-handleiding-verwerkersovereenkomst-scholen.md`
- Actie: school stuurt toestemmingsformulieren naar ouders vóór leerlingactivatie
- Tijdsduur: afhankelijk van schoolcommunicatieproces

**Stap 6** — EU AI Act hoog-risico-beoordeling (deadline: 2 augustus 2026)
- Document: `compliance/eu-ai-act-conformiteitsplan.md`
- DGSkills is geclassificeerd als **hoog-risico AI-systeem** (Bijlage III, punt 3(b): minderjarigen + geautomatiseerde voortgangsbeoordelingen)
- Twee open gaps: Art. 9 risicobeheer-systeem en Art. 10 data governance — nog niet technisch geïmplementeerd
- Actie: school bespreekt met DGSkills of "niet-beoordelend inzetten" (AI alleen als hulpmiddel, docent neemt altijd eindbeslissing) een tijdelijke oplossing is voor augustus 2026
- Tijdsduur: bestuurlijk gesprek, daarna evt. technische aanpassingen

---

## 5. Compliance-status (eerlijk overzicht)

| Kader | Status | Wat nog moet |
|---|---|---|
| AVG/GDPR | ~70% compleet | DPA ondertekenen (school), DPIA endorsen (school-FG), register bijwerken |
| EU AI Act | ~30% compleet | Art. 9 risicobeheer, Art. 10 data governance — **harde deadline 2 aug 2026** |
| Onderwijsrecht | ~60% compleet | Privacyconvenant Onderwijs-lidmaatschap (aanbevolen, €3.000-8.000 eenmalig) |
| Beveiliging | ~65% compleet | Rate limiting op 6 endpoints, docent-override AI-beslissingen |

---

## 6. Bijlagen — volledige compliance-documentatie

| Bestand | Inhoud |
|---|---|
| `A-model-verwerkersovereenkomst-dgskills.md` | Model-DPA (te ondertekenen) |
| `B-beveiligingsbijlage-dgskills.md` | Technische beveiligingsmaatregelen (TOMs) |
| `C-sub-verwerkerslijst-dgskills.md` | Volledige sub-verwerkerslijst met DPA-status |
| `D-handleiding-verwerkersovereenkomst-scholen.md` | Stappenplan voor scholen bij DPA-implementatie |
| `E-privacybijsluiter-dgskills.md` | Beknopte privacysamenvatting voor schoolleiding |
| `dpia-dgskills-compleet.md` | Volledige DPIA (art. 35 AVG), ~55.000 tekens (~11.000 woorden) |
| `eu-ai-act-conformiteitsplan.md` | EU AI Act compliance-roadmap t/m aug 2026 |
| `risicoregister-ai-act.md` | Art. 9 risicoregister (15 risico's, gedeeltelijk geïmplementeerd) |
| `privacyverklaring-dgskills.md` | Gepubliceerde privacyverklaring (voor leerlingen/ouders) |
| `verwerkingsregister.md` | Art. 30-register (DGSkills als verwerker) |
| `algemene-voorwaarden-dgskills.md` | Algemene Voorwaarden |
| `fg-dpo-adviesrapport.md` | Advies over FG-plicht (aanbevolen, niet verplicht in huidige omvang) |
| `legal-matrix.md` | Snel-overzicht alle juridische verplichtingen vs. status |

---

## 7. Contact

**Yorin Vonder** — yorinvonder@gmail.com
Beschikbaar voor toelichting aan FG en bij technische vragen over de implementatie.

*Dit document is voor interné gebruik door de school-FG. Het bevat verwijzingen naar documenten die juridisch bindend kunnen zijn na ondertekening.*
