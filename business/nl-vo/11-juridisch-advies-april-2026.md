# Juridisch Adviesrapport DGSkills.app

**Datum:** 10 april 2026
**Opdrachtgever:** Yorin Vonder, DGSkills.app (KvK 81819889)
**Type:** Onafhankelijke juridische risicoanalyse
**Disclaimer:** Dit is een AI-gegenereerde analyse op basis van alle beschikbare documentatie in de repository. Het vervangt geen advies van een gekwalificeerd ICT-jurist. Raadpleeg altijd een advocaat voor definitieve juridische beslissingen.

---

## STOPLICHT-OORDEEL

| Domein | Status | Score |
|--------|--------|-------|
| **AVG/GDPR** | ORANJE | 6.5/10 |
| **EU AI Act** | ROOD | 3/10 |
| **Contractueel** | ORANJE | 6/10 |
| **Ondernemingsrecht** | ROOD | 4/10 |
| **Technische beveiliging** | GROEN | 7.5/10 |
| **Kinderbescherming** | ORANJE | 6/10 |
| **TOTAAL** | **ORANJE/ROOD** | **5.5/10** |

**Eenregelsamenvatting:** Je documentatie is uitzonderlijk goed voor een solo-founder pre-revenue startup. Maar je bedrijfsstructuur en AI Act compliance zijn onverdedigbaar als er morgen iets misgaat.

---

## DE 5 GROOTSTE JURIDISCHE RISICO'S (eerlijk en ongezoet)

### 1. EENMANSZAAK + AI + MINDERJARIGEN = PERSOONLIJK FAILLISSEMENT-RISICO

**Ernst: KRITIEK**

Je draait een HIGH RISK AI-systeem voor minderjarigen als eenmanszaak. Dit betekent:
- **Onbeperkte persoonlijke aansprakelijkheid** voor alles wat misgaat
- Als een leerling schade lijdt door een AI-fout (verkeerde content, datalek, welzijnsfalen) -> jouw privevermogen is aansprakelijk
- **Geen beroepsaansprakelijkheidsverzekering** en **geen cyberverzekering**
- Bij een datalek met 1.000+ leerlingen kan de AP een boete opleggen tot 4% van de omzet (Art. 83 AVG), maar belangrijker: de reputatieschade en advocaatkosten zijn als eenmanszaak persoonlijk vernietigend

**Wat een jurist zou zeggen:** "Je bent gek als je dit als eenmanszaak doet. Een incident en je bent persoonlijk failliet."

**Oplossing:**
- BV oprichten (EUR 500-1.200, 1-2 weken) -- liever vandaag dan morgen
- Beroepsaansprakelijkheidsverzekering afsluiten (EUR 300-800/jaar)
- Cyberverzekering afsluiten (EUR 500-1.500/jaar)
- **Totaal: ~EUR 2.000 eenmalig + ~EUR 1.000/jaar**

### 2. EU AI ACT: 20 VAN 36 VEREISTEN NIET VOLDAAN, DEADLINE OVER 4 MAANDEN

**Ernst: KRITIEK**

Uit de eigen legal-matrix.md:
- **5 VOLDAAN** (14%)
- **11 GEDEELTELIJK** (31%)
- **20 NIET VOLDAAN** (55%)

De vereisten die volledig ontbreken zijn de zwaarste:
- **Art. 9:** Geen formeel risicobeheersysteem (register bestaat, maar niet geformaliseerd)
- **Art. 10:** Geen bias-monitoring, geen data governance framework
- **Art. 11:** Geen complete Annex IV technische documentatie
- **Art. 16-17:** Geen kwaliteitsmanagementsysteem (QMS)
- **Art. 43/47/49:** Geen conformiteitsbeoordeling, geen CE-markering, geen EU-database registratie
- **Art. 72:** Geen post-market monitoring systeem

**Deadline: 2 augustus 2026** -- over ~120 dagen gaan de hoog-risico verplichtingen in werking.

**Consequentie bij niet-naleving:**
- Boetes tot EUR 15 miljoen of 3% wereldwijde omzet (Art. 99 AI Act)
- Verbod op het aanbieden van het systeem in de EU
- Scholen zijn als "deployer" medeverantwoordelijk en zullen contracten opzeggen

**Eerlijk oordeel:** 120 dagen is krap maar haalbaar als je NU begint en focust. De documentatie-basis is goed (conformiteitsplan, risicoregister bestaan al als templates). Het is vooral formalisering en implementatie.

### 3. GEEN GETEKENDE VERWERKERSOVEREENKOMST MET ENIGE SCHOOL

**Ernst: KRITIEK (juridisch blocker voor elke pilot)**

Art. 28 AVG is glashelder: geen verwerking zonder getekende verwerkersovereenkomst. Er is:
- Een uitstekend DPA-template (Model 4.0 basis)
- Een complete sub-verwerkerslijst
- Een beveiligingsbijlage
- **Maar: nul handtekeningen**

Elke school die nu leerlingdata in DGSkills stopt, doet dat juridisch onrechtmatig. Als de AP langskomt bij een school en vraagt "waar is uw verwerkersovereenkomst met DGSkills?" is het antwoord: "die bestaat niet."

**Oplossing:** Dit is puur uitvoering. Het template is klaar. Stuur het naar pilotscholen, laat ze tekenen. Doorlooptijd: 1-2 weken per school.

### 4. DPIA NIET FORMEEL UITGEVOERD

**Ernst: HOOG**

Er is een indrukwekkende DPIA van 54 pagina's. Maar:
- Art. 35 AVG vereist dat de DPIA wordt **uitgevoerd** voordat je begint met verwerken
- De DPIA is een template/document, geen formeel afgerond assessment
- Er ontbreekt: een formele sign-off, een datum van voltooiing, bewijs van betrokkenheid FG/DPO
- De school als verwerkingsverantwoordelijke moet ook een DPIA uitvoeren (Art. 26(9) AI Act)

**Oplossing:** Formaliseer de DPIA die er al is. Voeg een sign-off pagina toe, dateer het, en bied scholen een DPIA-support template aan (die er al is: `dpia-support-template.md`).

### 5. GEEN AANSLUITING BIJ PRIVACYCONVENANT ONDERWIJS

**Ernst: HOOG (commercieel blokkerend)**

Het Privacyconvenant Onderwijs is de de facto standaard voor EdTech in het Nederlandse VO. Zonder lidmaatschap:
- ICT-coordinatoren en schoolbesturen zien je als "niet serieus"
- Aanbestedingen bij grotere besturen sluiten je uit
- Het Model 4.0 DPA is goed, maar het stempel van het convenant ontbreekt

**Kosten:** EUR 3.000-8.000 eenmalig + juridisch advies
**Doorlooptijd:** 6-10 weken
**Aanbeveling:** Start het aanmeldproces deze maand

---

## WAT GOED IS (credit where due)

Voor een solo-founder pre-revenue startup is dit **uitzonderlijk**.

### Documentatie (9/10)
- **22 compliance-documenten**, totaal 350+ pagina's
- DPIA van 54 pagina's (beter dan veel gevestigde EdTech)
- Compleet DPA-pakket (A t/m E) op basis van Model 4.0
- AI Act conformiteitsplan met artikelsgewijze analyse
- Risicoregister specifiek voor AI Act
- Privacyverklaring, verwerkingsregister, FG-adviesrapport
- **Alle `[invullen]` placeholders zijn gevuld** (opgelost 28 maart 2026)

### Technische beveiliging (7.5/10)
- **Prompt injection bescherming:** 7-laags defense-in-depth, 60+ patronen (NL, EN, DE, FR, ES)
- **Row Level Security:** 32+ policies, school-scoped toegang, MFA enforcement
- **Data export en verwijdering:** 23 categorieen export, 28 tabellen met CASCADE DELETE
- **Data residency:** Vertex AI europe-west4 (Nederland), zero data retention
- **Output filtering:** Safety settings BLOCK_LOW_AND_ABOVE + welzijnsprotocol
- **Server-side system instructions:** nooit door client bepaald

### Correcte risicoclassificatie (10/10)
- HIGH RISK classificatie correct geidentificeerd en gedocumenteerd
- Fout in lanceringsrapport ("beperkt risico") actief gecorrigeerd
- Art. 6(3) uitzondering terecht als niet-toepasbaar beargumenteerd

### Technische AVG-implementatie (8/10)
- Data export (Art. 20) werkend
- Account verwijdering (Art. 17) met cascade delete
- Verwerkingsbeperking (Art. 18) via edge function
- Bewaartermijnen gedefinieerd (maar nog niet alle geautomatiseerd)
- Audit logging aanwezig

---

## TECHNISCHE BEVINDINGEN (code-analyse)

### Wat klopt in de code

| Claim in docs | Code-verificatie | Status |
|---------------|-----------------|--------|
| RLS op alle gevoelige tabellen | 32+ policies, `is_teacher_in_school()` functie | BEVESTIGD |
| Prompt injection bescherming | 7-laags defense in `promptSanitizer.ts`, 60+ patronen | BEVESTIGD |
| Server-side system instructions | `getSystemInstruction(roleId)` in `chatCore.ts`, nooit van client | BEVESTIGD |
| Data export (Art. 20) | `exportMyData` edge function, 23 categorieen | BEVESTIGD |
| Account verwijdering (Art. 17) | `deleteMyAccount` edge function, 28 CASCADE tabellen | BEVESTIGD |
| MFA voor docenten | `is_mfa_aal2()` functie in database policies | BEVESTIGD |
| Data residency EU | Vertex AI `europe-west4` (Nederland) | BEVESTIGD |
| Welzijnsprotocol | Kindertelefoon/113 verwijzing in output filter | BEVESTIGD |

### Technische aandachtspunten

| Issue | Ernst | Toelichting |
|-------|-------|-------------|
| **Output filter alleen Nederlands** | MEDIUM | `outputFilter.ts` bevat alleen Nederlandse patronen. Engelstalige schadelijke content passeert het filter. |
| **Base64 injection detectie onvolledig** | LAAG | `promptSanitizer.ts` flagged base64 strings maar decodeert ze niet daadwerkelijk om injection-keywords te controleren. |
| **Rate limiter valt terug op in-memory** | LAAG | Bij falen van de database rate limiter valt het systeem terug op een in-memory Map die bij restart verloren gaat. |
| **Streaming safety check interval** | LAAG | Output filtering controleert pas elke 200 karakters in streaming modus. Korter interval (50-100) zou veiliger zijn. |
| **Audit logs tabel-definitie** | MEDIUM | Migraties verwijzen 50+ keer naar `audit_logs` maar er is geen expliciete `CREATE TABLE` in de migration files gevonden. Mogelijk buiten versiebeheer aangemaakt. |

---

## GEPRIORITEERD ACTIEPLAN

### FASE 1: BRANDJES BLUSSEN (nu -- 1 mei 2026)

| # | Actie | Kosten | Tijd | Impact |
|---|-------|--------|------|--------|
| 1 | **BV oprichten** | EUR 500-1.200 | 1-2 weken | Beperkt persoonlijke aansprakelijkheid |
| 2 | **Beroepsaansprakelijkheidsverzekering** | EUR 300-800/jr | 1 dag | Dekt professionele fouten |
| 3 | **Cyberverzekering** | EUR 500-1.500/jr | 1 dag | Dekt datalekken |
| 4 | **DPA's laten tekenen door pilotscholen** | EUR 0 | 1-2 weken | Juridische basis voor verwerking |
| 5 | **DPIA formeel afronden** (sign-off toevoegen) | EUR 0 | 2 dagen | AVG Art. 35 compliance |
| **Subtotaal** | | **~EUR 2.500 + ~EUR 1.500/jr** | | |

### FASE 2: AI ACT FUNDAMENT (mei -- juni 2026)

| # | Actie | Kosten | Tijd |
|---|-------|--------|------|
| 6 | **Risicobeheersysteem formaliseren** (Art. 9) -- register al aanwezig, moet worden gedocumenteerd als levend systeem | EUR 0 (zelf) | 1 week |
| 7 | **Docent-override voor STEP_COMPLETE** implementeren (Art. 14) -- code structuur bestaat al (`teacher_step_overrides` tabel + RPC) | EUR 0 (zelf) | 2-3 weken |
| 8 | **Kwaliteitsmanagementsysteem** opzetten (Art. 17) | EUR 0-2.000 | 3-4 weken |
| 9 | **Post-market monitoring** procedure schrijven (Art. 72) | EUR 0 | 1 week |
| 10 | **Annex IV technische documentatie** completeren (Art. 11) -- template 40% klaar | EUR 0 | 2-3 weken |

### FASE 3: CONFORMITEIT (juli 2026)

| # | Actie | Kosten | Tijd |
|---|-------|--------|------|
| 11 | **Interne conformiteitsbeoordeling** (Art. 43 / Annex VI) | EUR 0-1.000 | 2 weken |
| 12 | **EU-conformiteitsverklaring** opstellen (Art. 47) | EUR 0 | 1 week |
| 13 | **Registratie EU AI-database** (Art. 49) | EUR 0 | 1-2 dagen |
| 14 | **CE-markering** documenteren (Art. 49) | EUR 0 | 1 dag |

### FASE 4: PROFESSIONALISERING (augustus -- december 2026)

| # | Actie | Kosten |
|---|-------|--------|
| 15 | **Privacyconvenant Onderwijs** aansluiting | EUR 3.000-8.000 |
| 16 | **Merknaam "DGSkills" registreren** bij BOIP | EUR 271 |
| 17 | **Externe review door ICT-jurist** van alle documenten | EUR 2.000-5.000 |
| 18 | **Datalekregister** en incidentprocedure operationeel maken | EUR 0 |

### TOTALE GESCHATTE KOSTEN

| Categorie | Bedrag |
|-----------|--------|
| Eenmalig (BV + verzekering + juridisch) | EUR 6.000 - 17.000 |
| Jaarlijks (verzekeringen) | EUR 1.000 - 2.500 |

---

## KAN DIT LANCEREN? -- EERLIJK ANTWOORD

### Pilot (5-10 scholen, gratis/gereduceerd): JA, MITS...

Een pilot kan starten zodra:
1. DPA's getekend zijn met pilotscholen (**1-2 weken**)
2. DPIA formeel is afgerond (**2 dagen**)
3. BV is opgericht OF verzekering is afgesloten (**1 week**)

De technische basis is sterk genoeg voor een pilot. De security is beter dan veel producten die al in scholen draaien.

### Commerciele lancering: NEE, NOG NIET

Voor commerciele lancering (betaalde licenties) is minimaal nodig:
1. BV + verzekeringen
2. Getekende DPA's
3. AI Act conformiteit (augustus deadline)
4. Privacyconvenant aansluiting
5. Externe juridische review van AV en DPA

**Realistische datum voor commerciele lancering: september/oktober 2026**

### Wat als het nu al wordt gedaan zonder dit te regelen?

- **Best case:** Niets gebeurt, langzame groei, alsnog regelen
- **Worst case:** Datalek of AI-incident met een leerling -> AP-onderzoek -> geen getekende DPA, geen DPIA, geen verzekering, persoonlijke aansprakelijkheid -> financiele en reputatieschade die een carriere kan beeindigen
- **Meest waarschijnlijk:** Een ICT-coordinator vraagt om de verwerkersovereenkomst, ziet dat die niet getekend is, en stuurt je weg. Geen drama, maar een gemiste kans.

---

## SAMENVATTING VOOR IN EEN GESPREK

> "DGSkills heeft uitzonderlijk goede compliance-documentatie voor de fase waarin het zit -- 22 documenten, 350+ pagina's, correcte HIGH RISK classificatie. De technische beveiliging (prompt injection, RLS, data export/verwijdering, EU-dataresidentie) is beter dan veel gevestigde EdTech-bedrijven. Maar er zijn drie dingen die nu moeten: de bedrijfsstructuur beschermt de founder niet (eenmanszaak zonder verzekering), de EU AI Act deadline van 2 augustus vereist nog 4 maanden intensief werk, en er is nog geen enkele getekende verwerkersovereenkomst met een school. Met ~EUR 6.000-17.000 investering en 4 maanden gefocust werk is dit op te lossen."

---

## BRONVERWIJZINGEN

Dit rapport is gebaseerd op analyse van de volgende documenten en code:

### Juridische documenten
- `business/nl-vo/09-juridisch-rapport-compleet.md` -- Eerder juridisch rapport (23 feb 2026)
- `business/nl-vo/compliance/legal-matrix.md` -- AVG & AI Act toetsmatrix
- `business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md` -- AI Act conformiteitsplan
- `business/nl-vo/compliance/dpia-dgskills-compleet.md` -- DPIA (54 pagina's)
- `business/nl-vo/compliance/algemene-voorwaarden-dgskills.md` -- Algemene Voorwaarden (concept)
- `business/nl-vo/compliance/A-model-verwerkersovereenkomst-dgskills.md` -- DPA template
- `business/nl-vo/compliance/risicoregister-ai-act.md` -- AI Act risicoregister
- `business/nl-vo/compliance/fg-dpo-adviesrapport.md` -- FG/DPO advies

### Code-analyse
- `supabase/functions/chat/index.ts` en `chatStream/index.ts` -- AI endpoints
- `supabase/functions/_shared/promptSanitizer.ts` -- Prompt injection bescherming
- `supabase/functions/_shared/outputFilter.ts` -- Output veiligheidsfilter
- `supabase/functions/_shared/chatCore.ts` -- Chat kernlogica
- `supabase/functions/exportMyData/index.ts` -- Data export (Art. 20)
- `supabase/functions/deleteMyAccount/index.ts` -- Account verwijdering (Art. 17)
- `supabase/migrations/` -- RLS policies en database schema
- `src/services/PermissionService.ts` -- Rolgebaseerde toegangscontrole

### Security audits
- `docs/security/security-audit-rapport-dgskills.md` -- Security audit (15 maart 2026)
- `docs/security/audit-ai-integrations-2026-04.md` -- AI integratie audit (3 april 2026)
- `Regelgeving/AUDIT_RAPPORT_2026.md` -- Compliance audit (21 feb 2026)
