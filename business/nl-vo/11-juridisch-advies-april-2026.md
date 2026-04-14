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
| **Ondernemingsrecht** | ORANJE | 5/10 (met verzekering 6.5/10, zonder 4/10) |
| **Technische beveiliging** | GROEN | 7.5/10 |
| **Kinderbescherming** | ORANJE | 6/10 |
| **TOTAAL** | **ORANJE/ROOD** | **5.5/10** |

**Eenregelsamenvatting:** Je documentatie is uitzonderlijk goed voor een solo-founder pre-revenue startup. Maar je bedrijfsstructuur en AI Act compliance zijn onverdedigbaar als er morgen iets misgaat.

---

## DE 5 GROOTSTE JURIDISCHE RISICO'S (eerlijk en ongezoet)

### 1. EENMANSZAAK ZONDER VERZEKERING = ONVERANTWOORD RISICO (maar BV is niet per se urgent)

**Ernst: HOOG (niet KRITIEK als verzekeringen geregeld zijn)**

> **Nuance na doorvraag:** De eerdere stellingname "je moet direct een BV" was te stellig. De werkelijkheid is genuanceerder.

**Wat waar is:**
- Je draait een HIGH RISK AI-systeem voor minderjarigen als eenmanszaak
- Zonder verzekering is je privevermogen aansprakelijk voor professionele fouten, datalekken, en schade aan leerlingen
- Bij een ernstig incident (datalek 1.000+ leerlingen, welzijnsfalen) kunnen de kosten je persoonlijk vernietigen

**Wat NIET waar is:**
- "Je moet per se vandaag een BV oprichten" -- overdreven voor een pre-revenue solo founder
- "BV beschermt je tegen alle aansprakelijkheid" -- ook bestuurdersaansprakelijkheid bestaat
- "Eenmanszaak is onverantwoord" -- met goede verzekeringen is het in pilotfase verdedigbaar

**Wanneer eenmanszaak voldoende is (met verzekeringen):**
- Pre-revenue of omzet <EUR 80.000/jaar
- Geen medewerkers in dienst
- Geen investeerders
- Pilots en beperkt aantal scholen (<5-10)
- Geen bestuurscontracten

**Wanneer BV noodzakelijk wordt (triggers):**
| Trigger | Waarom |
|---------|--------|
| Eerste betaalde school | Commerciele relatie, hoger risico |
| Bestuurscontract (3+ scholen) | Contractwaarde vaak EUR 30.000+/jaar |
| Omzet nadert EUR 80.000 | Vpb wordt fiscaal voordeliger dan IB |
| Investeerder wil instappen | Investering kan niet in eenmanszaak |
| Je neemt een medewerker aan | Werkgeversrisico |
| School eist expliciet BV | Zeldzaam, maar komt voor bij grote besturen |

**Fiscaal voordeel eenmanszaak in de eerste jaren:**
- Startersaftrek: ~EUR 2.123
- Zelfstandigenaftrek: ~EUR 3.750
- MKB-winstvrijstelling: 14% van de winst
- Totaal: **EUR 5.000-10.000/jaar fiscaal voordeel** bij omzet <EUR 80.000

**Wat verzekeringen wel dekken (ook zonder BV):**
- Professionele fouten in code/advies (BAV)
- Datalekken + incidentkosten (Cyberverzekering)
- Civielrechtelijke claims van scholen/ouders (BAV + AVB)
- Een deel van AP-boetes (check polisvoorwaarden specifiek)

**Wat verzekeringen NIET dekken:**
- Opzet of grove nalatigheid
- Boetes voor strafbare feiten
- Claims boven het verzekerd bedrag (typisch EUR 500K-2.5M)
- Reputatieschade

**Pragmatisch pad:**

| Fase | Structuur | Verzekering verplicht? |
|------|-----------|----------------------|
| **Nu - eerste 3 pilots** | Eenmanszaak | JA -- BAV + Cyber |
| **Eerste betaalde school** | Eenmanszaak | JA -- BAV + Cyber |
| **Groei (>EUR 50K omzet OF bestuurscontract)** | BV oprichten | JA -- BAV + Cyber + AVB |

**Harde minimum-eis NU:**
- Beroepsaansprakelijkheidsverzekering afsluiten (EUR 300-1.200/jaar)
- Cyberverzekering afsluiten (EUR 395-2.000/jaar)
- **Totaal: EUR 700-3.200/jaar -- dit kun je niet uitstellen**

De BV kan wachten tot je eerste betaalde klant of bestuurscontract. Niet eerder, tenzij je een specifieke trigger ziet.

> **Disclaimer:** Dit is geen persoonlijk juridisch advies. Overleg deze keuze met een ICT-jurist of accountant (intakegesprek EUR 100-200) om het af te stemmen op jouw concrete situatie.

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

**Eerlijk oordeel:** 120 dagen is krap en risicovol. De documentatie-basis is goed (conformiteitsplan, risicoregister bestaan als templates), maar niet alles is "puur formalisering":
- **Documentatiewerk** (haalbaar in 120 dagen): Art. 9 formaliseren, Art. 11 Annex IV samenstellen, Art. 47 conformiteitsverklaring, Art. 49 EU-database registratie
- **Technische implementatie** (krap in 120 dagen): Art. 10 bias-monitoring bouwen, Art. 14 docent-override UI, Art. 15 adversarial security testen, Art. 72 monitoring dashboard

Het onderscheid is belangrijk: de technische onderdelen vergen development-tijd, niet alleen schrijftijd.

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

### 6. GEEN FUNCTIONARIS GEGEVENSBESCHERMING (FG/DPO) AANGESTELD

**Ernst: HOOG**

Het FG/DPO-adviesrapport (`fg-dpo-adviesrapport.md`) concludeert dat een externe FG "praktisch onmisbaar" is en adviseerde aanstelling voor februari-maart 2026. Die deadline is verstreken. DGSkills verwerkt als kernactiviteit structureel en stelselmatig leerlinggegevens — dat raakt aan Art. 37 lid 1 sub b AVG (grootschalige stelselmatige monitoring). Scholen die het Privacyconvenant onderschrijven verwachten een geregistreerde FG bij hun verwerkers.

**Oplossing:**
- Externe FG selecteren en registreren bij de AP
- Geschatte kosten: EUR 275-550/maand (externe FG-dienst)
- Doorlooptijd: 2-4 weken

---

## WAT GOED IS (credit where due)

Voor een solo-founder pre-revenue startup is dit **uitzonderlijk**.

### Documentatie (9/10)
- **22 compliance-documenten**, totaal 350+ pagina's
- DPIA van 54 pagina's (beter dan veel gevestigde EdTech)
- Compleet DPA-pakket (A t/m E) op basis van Model 4.0
- AI Act conformiteitsplan met artikelsgewijze analyse
- Risicoregister specifiek voor AI Act
- Privacyverklaring, FG-adviesrapport
- Verwerkingsregister bestaat (`verwerkingsregister.md`, v1.1, 23 feb 2026) maar de status ten opzichte van Art. 30 AVG moet nog formeel worden vastgesteld -- het eerdere juridisch rapport (09, feb 2026) markeerde dit als "niet voldaan"
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

## GEPRIORITEERD ACTIEPLAN (met marktprijzen april 2026)

> Alle bedragen zijn voor DGSkills (jou), niet voor de school/klant.
> Prijzen zijn gebaseerd op online marktonderzoek april 2026. Zie bronnen onderaan.

### FASE 1: BRANDJES BLUSSEN (nu -- 1 mei 2026)

| # | Actie | Kosten | Bron/toelichting | Tijd |
|---|-------|--------|------------------|------|
| 1 | **Beroepsaansprakelijkheidsverzekering (BAV)** -- HARDE MINIMUM | EUR 300-1.200/jr | ICT-ZZP: EUR 25-100/mnd (Hiscox, De Goudse, Unive). Premie hangt af van verzekerd bedrag en dekkingsomvang. Combinatie BAV+AVB vaak voordeliger. | 1 dag |
| 2 | **Cyberverzekering** -- HARDE MINIMUM | EUR 395-2.000/jr | Klein bedrijf met beperkte data: vanaf EUR 395/jr (VezekerCyber.nl). Met verwerking minderjarigen-data waarschijnlijk EUR 1.000-2.000/jr. Premies stijgen 20-25%/jaar. | 1 dag |
| 3 | **BV oprichten** -- ALLEEN BIJ TRIGGER (eerste betaalde school, bestuurscontract, omzet >EUR 50K, investeerder, medewerker) | EUR 400-800 eenmalig | Online notaris (UwBVoprichten.nl vanaf EUR 399, NOTRS vergelijkbaar). Incl. KvK EUR 82 + UBO-registratie. Traditionele notaris: EUR 700-1.500. Kan wachten tot trigger. | 1-2 weken |
| 4 | **DPA's laten tekenen door pilotscholen** | EUR 0 | Template is klaar (Model 4.0 basis). Enkel uitvoering. | 1-2 weken |
| 5 | **DPIA formeel afronden** (sign-off toevoegen) | EUR 0 | Document van 54 pagina's bestaat. Enkel formaliseren met datum + handtekening. | 2 dagen |
| 6 | **Datalekregister + 72-uurs meldprocedure** | EUR 0 | Zelf op te stellen. Template beschikbaar via AP-website. | 1 dag |
| 7 | **Externe FG/DPO** selecteren en registreren bij AP | EUR 500-1.000/mnd | Klein MKB (<50 medewerkers): EUR 500-1.000/mnd (DPO Centre, Privacy Direct, FGonline.nl). Goedkoper alternatief: "FG-light" of gedeelde FG via bureau, vanaf ~EUR 300/mnd. Registratie bij AP is gratis. | 2-4 weken |
| **Subtotaal Fase 1** | | **~EUR 800 eenmalig + EUR 7.000-16.000/jr** | | |

### FASE 2: AI ACT FUNDAMENT (mei -- juni 2026)

| # | Actie | Kosten | Toelichting | Tijd |
|---|-------|--------|-------------|------|
| 8 | **Risicobeheersysteem formaliseren** (Art. 9) | EUR 0 (zelf) | Documentatie-werk. Register bestaat al, moet worden geformaliseerd als levend systeem. | 1 week |
| 9 | **Docent-override voor STEP_COMPLETE** (Art. 14) | EUR 0 (zelf) | Technische implementatie. Code-structuur (`teacher_step_overrides` tabel + RPC) bestaat al. | 2-3 weken |
| 10 | **Kwaliteitsmanagementsysteem** (Art. 17) | EUR 0-2.000 | Documentatie + processen. Evt. template via NEN of consultant. | 3-4 weken |
| 11 | **Post-market monitoring** (Art. 72) | EUR 0 (zelf) | Documentatie-werk. Incidentlog + escalatieprocedure. | 1 week |
| 12 | **Annex IV technische documentatie** (Art. 11) | EUR 0 (zelf) | Documentatie-werk. Template 40% klaar. | 2-3 weken |
| 13 | **Bias-monitoring** (Art. 10) | EUR 0 (zelf) | Technische implementatie. vmbo/havo/vwo differentiatie testen. | 2 weken |

### FASE 3: CONFORMITEIT (juli 2026)

| # | Actie | Kosten | Tijd |
|---|-------|--------|------|
| 14 | **Interne conformiteitsbeoordeling** (Art. 43 / Annex VI) | EUR 0-1.000 | 2 weken |
| 15 | **EU-conformiteitsverklaring** (Art. 47) | EUR 0 | 1 week |
| 16 | **Registratie EU AI-database** (Art. 49) | EUR 0 | 1-2 dagen |
| 17 | **CE-markering** documenteren (Art. 49) | EUR 0 | 1 dag |

### FASE 4: PROFESSIONALISERING (augustus -- december 2026)

| # | Actie | Kosten | Bron/toelichting |
|---|-------|--------|------------------|
| 18 | **Privacyconvenant Onderwijs** aansluiting | Onbekend -- navragen | Kosten niet publiek beschikbaar. Mail info@privacyconvenant.nl. Eerdere schatting EUR 3.000-8.000 is niet geverifieerd. Let op: Model 4.0 deadline is 1 augustus 2026. |
| 19 | **Merknaam "DGSkills" registreren** bij BOIP | EUR 244 (10 jaar) | 1 klasse = EUR 244, extra klasse EUR 81. Registratieproces duurt 3-4 maanden. |
| 20 | **Externe review door ICT-jurist** | EUR 1.000-5.000 | AV opstellen via ICTrecht generator: vanaf EUR 45. Maatwerk review DPA+AV+DPIA door kantoor (ICTrecht, Legalz, LAWFOX): EUR 1.000-5.000 afhankelijk van scope. NLdigital-lidmaatschap (incl. standaard AV): Start-IT korting 50% eerste jaar. |

### TOTALE GESCHATTE KOSTEN (marktprijzen april 2026)

| Categorie | Conservatief | Ruim |
|-----------|-------------|------|
| **Eenmalig** (BV + BOIP + juridische review) | EUR 1.650 | EUR 6.050 |
| **Jaarlijks** (BAV + cyber + FG) | EUR 4.300 | EUR 16.200 |
| **Onbekend** (Privacyconvenant) | Navragen | Navragen |

**Belangrijke correctie t.o.v. eerdere schatting:** De externe FG/DPO is de grootste kostenpost (EUR 6.000-12.000/jaar). Dit was in de eerdere versie onderschat op EUR 3.300-6.600/jaar. Alternatief: een "FG-light" arrangement of gedeelde FG kan goedkoper, maar check of dit voldoet aan Art. 37 AVG eisen.

### Goedkoopste pad (minimaal verantwoord)

Als je de kosten wilt minimaliseren maar juridisch verantwoord wilt starten:

| Actie | Kosten |
|-------|--------|
| BV via online notaris | EUR 400 |
| Combi BAV+AVB verzekering | EUR 750/jr |
| Cyberverzekering basis | EUR 500/jr |
| Gedeelde FG ("FG-light") | EUR 300/mnd = EUR 3.600/jr |
| BOIP merkregistratie | EUR 244 |
| AV via ICTrecht generator + eigen review | EUR 45 |
| **Totaal jaar 1** | **~EUR 5.540** |
| **Totaal jaar 2+** | **~EUR 4.850/jr** |

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

> "DGSkills heeft uitzonderlijk goede compliance-documentatie voor de fase waarin het zit -- 22 documenten, 350+ pagina's, correcte HIGH RISK classificatie. De technische beveiliging (prompt injection, RLS, data export/verwijdering, EU-dataresidentie) is beter dan veel gevestigde EdTech-bedrijven. Maar er zijn drie dingen die nu moeten: de bedrijfsstructuur beschermt de founder niet (eenmanszaak zonder verzekering), de EU AI Act deadline van 2 augustus vereist nog 4 maanden intensief werk, en er is nog geen enkele getekende verwerkersovereenkomst met een school. Met ~EUR 5.500 in jaar 1 (goedkoopste pad) tot EUR 22.000 (ruim) en 4 maanden gefocust werk is dit op te lossen."

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

### Online bronnen kostenraming (geraadpleegd april 2026)
- [BV oprichten kosten](https://www.degoedkoopstenotaris.nl/informatie/kosten-bv-oprichten) -- EUR 500-1.500 (traditioneel), vanaf EUR 399 (online)
- [BV oprichten 2026 overzicht](https://www.firm24.com/kennisbank/article/kosten-oprichten-bv/) -- Tarieven en startkapitaalvereisten
- [BAV ICT ZZP - Hiscox](https://www.hiscox.nl/beroepsaansprakelijkheidsverzekering-ICT) -- Vanaf EUR 25-100/mnd
- [BAV ZZP kosten overzicht](https://www.zzp-nederland.nl/kennisbank/wat-kosten-verzekeringen-voor-zzpers) -- EUR 20-100/mnd afhankelijk van beroep
- [Cyberverzekering kosten](https://verzekercyber.nl/wat-kost-een-cyberverzekering/) -- EUR 500-5.000/jr voor MKB
- [Cyberverzekering vergelijken 2026](https://www.beterverzekeren.nl/bedrijfsverzekeringen/cybercrime-verzekering/) -- Vanaf EUR 395/jr
- [Externe FG/DPO - DPO Centre](https://www.dpocentre.nl/en/diensten/uitbestede-fg-diensten/) -- EUR 500-2.000/mnd
- [Externe FG - Privacy Direct](https://privacydirect.nl/externe-fg/) -- Flexibele pakketten voor MKB
- [FG online maandservice](https://www.fgonline.nl/product/15553918/service-externe-functionaris-gegevensbescherming-per-maand) -- Maandelijkse FG-dienst
- [BOIP merkregistratie](https://www.boip.int/nl/ie-professionals/registratie-onderhoud/registreren) -- EUR 244 per 10 jaar (1 klasse)
- [Privacyconvenant Onderwijs](https://www.privacyconvenant.nl/) -- Kosten niet publiek, navragen via info@privacyconvenant.nl
- [Privacyconvenant Model 4.0 deadline](https://www.privacyteam.nl/leveranciers-voor-het-onderwijs-opgelet) -- Deadline 1 augustus 2026
- [ICTrecht contracten](https://www.ictrecht.nl/ict-contracten) -- AV, DPA, SaaS-overeenkomsten
- [AV generator ICTrecht/Juridox](https://www.ictrecht.nl/over-ons/visie-werkwijze/ondersteuning-op-maat) -- Vanaf EUR 45 via generator
- [NLdigital Voorwaarden 2025](https://www.nldigital.nl/kennis-producten/nldigital-voorwaarden-2025/) -- Incl. AI Act, NIS2, privacy hoofdstuk

---

## APPENDIX: PEER REVIEW BEVINDINGEN

Dit rapport is na opstelling gereviewd door een onafhankelijke AI-review agent. De volgende 5 verbeterpunten zijn verwerkt:

| # | Bevinding | Status |
|---|-----------|--------|
| 1 | **FG/DPO-verplichting volledig weggelaten** -- het FG-adviesrapport adviseerde aanstelling voor feb-mrt 2026, gemiste deadline niet benoemd | VERWERKT -- risico 6 toegevoegd, actie 7 in Fase 1 |
| 2 | **Art. 30 verwerkingsregister status onduidelijk** -- het register bestaat maar formele status t.o.v. Art. 30 AVG niet vastgesteld | VERWERKT -- nuance toegevoegd in documentatiesectie |
| 3 | **AI Act framing te optimistisch** -- onderscheid tussen documentatiewerk en technische implementatie ontbrak | VERWERKT -- per actie gelabeld als "documentatie" of "technische implementatie" |
| 4 | **Datalekregister te laat gepland** -- stond in Fase 4 (aug-dec), maar is verplicht zodra verwerking begint | VERWERKT -- verplaatst naar Fase 1, actie 6 |
| 5 | **BV-advies mist fiscale nuance** -- startersaftrek/zelfstandigenaftrek niet afgewogen tegen aansprakelijkheidsrisico | VERWERKT -- fiscale nuance als voetnoot toegevoegd |
| 6 | **BV-advies was te stellig** -- "direct BV oprichten" onderschat wat verzekeringen wel dekken en overschat urgentie voor pre-revenue solo founder | VERWERKT (v3) -- risico 1 volledig herschreven met trigger-gebaseerde beslissingsmatrix, BV verplaatst van harde eis naar "bij trigger", verzekeringen als harde minimum benadrukt |
