# DGSkills.app - Compleet Juridisch Rapport

**Datum:** 23 februari 2026
**Versie:** 1.0
**Bronnen:** 4 parallelle juridische analyses (AVG/GDPR, EU AI Act, Ondernemingsrecht, Onderwijsrecht & Minderjarigen)

---

## EXECUTIVE SUMMARY

DGSkills staat er voor een pre-revenue EdTech startup **opvallend goed** voor qua privacy- en compliance-documentatie. De technische implementatie (data export, verwijdering, verwerkingsbeperking, prompt injection filtering, audit logging) is van hoger niveau dan bij veel gevestigde EdTech-bedrijven.

**Maar er zijn 8 blokkerende issues die voor lancering moeten worden opgelost.**

---

## DEEL 1: AVG / GDPR COMPLIANCE

### Artikelsgewijze toetsing

| Artikel | Onderwerp | Status | Bevinding |
|---|---|---|---|
| Art. 5 | Beginselen | GEDEELTELIJK | Dataminimalisatie goed, maar bewaartermijnen niet overal technisch afgedwongen |
| Art. 6 | Rechtsgrondslag | VOLDAAN | Publieke taak (onderwijs) correct als grondslag |
| Art. 7 | Toestemming | VOLDAAN | Cookie consent met granulaire keuze aanwezig |
| Art. 8 | Minderjarigen (<16) | VOLDAAN | School als verwerkingsverantwoordelijke regelt toestemming |
| Art. 12-14 | Informatieplicht | GEDEELTELIJK | Privacyverklaring aanwezig, maar `[invullen]` placeholders in contactgegevens |
| Art. 15 | Recht op inzage | VOLDAAN | Data export functie technisch werkend |
| Art. 16 | Recht op rectificatie | VOLDAAN | Profielwijzigingen mogelijk |
| Art. 17 | Recht op wissing | VOLDAAN | Account verwijdering met cascade delete |
| Art. 18 | Beperking verwerking | VOLDAAN | `restrictProcessing` Edge Function aanwezig |
| Art. 20 | Overdraagbaarheid | VOLDAAN | JSON export beschikbaar |
| Art. 22 | Geautomatiseerde besluitvorming | VOLDAAN | AI neemt geen beslissingen met rechtsgevolg, docent is eindverantwoordelijk |
| Art. 25 | Privacy by design | VOLDAAN | Dataminimalisatie, geen BSN/adres, geaggregeerde analytics |
| Art. 28 | Verwerkersovereenkomst | NIET VOLDAAN | DPA is een template, niet ondertekend |
| Art. 30 | Verwerkingsregister | NIET VOLDAAN | Geen formeel register van verwerkingsactiviteiten |
| Art. 32 | Beveiliging | VOLDAAN | TLS, RLS, JWT, prompt sanitization |
| Art. 33-34 | Datalekken | GEDEELTELIJK | Incidentproces beschreven, maar geen operationeel datalekregister |
| Art. 35 | DPIA | NIET VOLDAAN | DPIA verplicht (minderjarigen + AI = nieuwe technologie), template bestaat maar niet uitgevoerd |
| Art. 44-49 | Doorgifte buiten EER | ~~RISICO~~ **OPGELOST (23 feb 2026)** | ~~Google Gemini API data gaat naar Google servers; bevestig EER-locatie of SCC-basis~~ **Migratie naar Vertex AI europe-west4 (Nederland) afgerond.** Dataresidentie EU gegarandeerd (data at rest + ML-verwerking). Google Cloud DPA met SCCs van toepassing. Zero data retention. |

### Blokkerende AVG-issues

1. **Geen ondertekende DPA** (Art. 28) - Gebruik Model Verwerkersovereenkomst Privacyconvenant 4.0
2. **Geen uitgevoerde DPIA** (Art. 35) - Template bestaat, moet daadwerkelijk worden ingevuld
3. **Contactgegevens ontbreken** in privacy-docs (`[invullen]` placeholders)
4. **Geen verwerkingsregister** (Art. 30) - Moet worden opgesteld
5. **Geen operationeel datalekregister** - Nodig voor 72-uurs meldplicht AP

### Risico-items (binnen 3 maanden)

- ~~Google Gemini datalocatie bevestigen (EER of SCC)~~ **AFGEROND (23 feb 2026):** Vertex AI europe-west4 (Nederland), Google Cloud DPA met SCCs, zero data retention.
- Bewaartermijnen technisch afdwingen via `pg_cron`
- Data-retentiebeleid formaliseren per gegevenscategorie

---

## DEEL 2: EU AI ACT

### Risicoclassificatie: HOOG RISICO

**DGSkills valt onder Annex III punt 3(b):** AI-systemen bestemd voor evaluatie van leerresultaten in het onderwijs.

**Waarom hoog risico en niet beperkt risico:**
- De AI genereert `STEP_COMPLETE` markers die automatisch voortgang registreren
- XP-toekenning en level-progressie worden beïnvloed door AI-interactie
- De hybride assessment engine heeft impact op het leerproces
- Het eerdere lanceringsrapport (`08-lanceringsrapport-compleet.md`) classificeerde dit als "beperkt risico" - **dit is onjuist en moet worden gecorrigeerd**

**Wat al goed is:**
- AI-transparantieverklaring op de website met hoog-risico erkenning
- Menselijk toezicht: docent is eindverantwoordelijk
- AI-output wordt niet gebruikt voor cijfergeving of selectie
- Provenance metadata in AI-responses
- Defense-in-depth prompt injection beveiliging

### Verplichtingen per artikel (hoog risico)

| Artikel | Verplichting | Status | Deadline |
|---|---|---|---|
| Art. 4 | AI-geletterdheid aanbieden | VOLDAAN | 2 feb 2025 (al verstreken) |
| Art. 9 | Risicobeheersysteem | NIET VOLDAAN | 2 aug 2026 |
| Art. 10 | Data governance | GEDEELTELIJK | 2 aug 2026 |
| Art. 11 | Technische documentatie (Annex IV) | NIET VOLDAAN | 2 aug 2026 |
| Art. 12 | Traceerbaarheid/logging | VOLDAAN | 2 aug 2026 |
| Art. 13 | Transparantie | VOLDAAN | 2 aug 2026 |
| Art. 14 | Menselijk toezicht | GEDEELTELIJK | 2 aug 2026 |
| Art. 15 | Nauwkeurigheid, robuustheid | GEDEELTELIJK | 2 aug 2026 |
| Art. 49 | Registratie EU AI-database | NIET VOLDAAN | 2 aug 2026 |
| Art. 50 | Transparantieplichten | VOLDAAN | 2 aug 2026 |

### Kritieke AI Act deadline: 2 AUGUSTUS 2026

Over ~5 maanden gaan de hoog-risico verplichtingen in werking. Voor die datum moet je:
1. Risicobeheersysteem documenteren (Art. 9)
2. Technische documentatie opstellen conform Annex IV (Art. 11)
3. Registratie in EU AI-database (Art. 49)
4. Docent moet AI-gegenereerde STEP_COMPLETE kunnen overriden (Art. 14)

---

## DEEL 3: ONDERNEMINGSRECHT

### Rechtsvorm

**Aanbeveling: Start als eenmanszaak, plan conversie naar BV bij omzet >EUR 80.000**

| Aspect | Eenmanszaak | BV |
|---|---|---|
| Oprichtingskosten | EUR 82 | EUR 500-1.200 |
| Aansprakelijkheid | Persoonlijk (prive) | Beperkt (aandelenkapitaal) |
| Belasting | IB (36,97%/49,50%) + aftrekposten | Vpb (19%/25,8%) + DGA-salaris |
| Startersvoordeel | Zelfstandigenaftrek + startersaftrek | Geen |
| Professionaliteit | Voldoende voor pilots | Beter voor bestuurscontracten |

### BTW

- **Tarief: waarschijnlijk 21%** (interactieve digitale dienst, niet puur lesmateriaal)
- Vraag **vooroverleg** aan bij de Belastingdienst voor zekerheid (gratis, 4-8 weken)
- Scholen kunnen BTW niet terugvragen - communiceer totaalprijs inclusief BTW
- Bewaarplicht administratie: 7 jaar

### Contracten - wat ontbreekt

| Document | Status | Prioriteit |
|---|---|---|
| Algemene Voorwaarden | ONTBREEKT | Blokkerend |
| Verwerkersovereenkomst (DPA) | Template, niet ondertekend | Blokkerend |
| Pilotovereenkomst (juridisch) | Operationeel beschreven, niet juridisch | Blokkerend |
| SLA (compleet) | Gedeeltelijk, mist uptime/credits | Belangrijk |

**Aanbeveling AV:** Gebruik **NLdigital Voorwaarden 2025** als basis (EUR 400-600 lidmaatschap/jaar, inclusief juridische updates). Deze houden rekening met AI Act, NIS2, en SaaS.

### Checklist Algemene Voorwaarden

Moet bevatten:
1. Definities (SaaS-dienst, platform, gebruiker, school, licentie)
2. Totstandkoming overeenkomst
3. Duur en opzegging (3 maanden opzegtermijn, stilzwijgende verlenging)
4. Prijzen en betaling (excl. BTW, 30 dagen, indexatie max 5% CPI)
5. Uitvoering en beschikbaarheid (uptime, onderhoud, SLA-verwijzing)
6. Licentievoorwaarden (niet-exclusief, niet-overdraagbaar, per school/locatie)
7. Intellectueel eigendom (alle IE bij DGSkills)
8. Persoonsgegevens (verwijzing DPA)
9. Geheimhouding
10. Aansprakelijkheidsbeperking (max 12 maanden factuurbedrag, uitsluiting gevolgschade)
11. Overmacht
12. Beeindiging en data-retournering
13. Toepasselijk recht (Nederlands) en bevoegde rechter
14. Wijzigingsbeding

### Aansprakelijkheid en verzekeringen

| Verzekering | Noodzaak | Geschatte premie |
|---|---|---|
| Beroepsaansprakelijkheid (BAV) | Zeer sterk aanbevolen | EUR 300-800/jaar |
| Cyberverzekering | Sterk aanbevolen | EUR 500-1.500/jaar |
| Bedrijfsaansprakelijkheid (AVB) | Optioneel (bij on-site trainingen) | EUR 100-300/jaar |

### Intellectueel eigendom

| Item | Status | Actie |
|---|---|---|
| Auteursrecht code | Automatisch beschermd | Geen actie nodig |
| Open source compliance | Alle licenties permissief (MIT, Apache-2.0) | Maak THIRD_PARTY_LICENSES.txt |
| Merknaam "DGSkills" | NIET geregistreerd | Registreer bij BOIP (EUR 271, 2 klassen) |
| Domeinnaam dgskills.app | In gebruik | Registreer ook dgskills.nl defensief |
| AI-gegenereerde content | Niet auteursrechtelijk beschermd | Regel in AV |

### Aanbestedingsrecht

- Individuele schoolcontracten (EUR 1.500-17.900): **ver onder** Europese drempel (EUR 221.000)
- Bestuurscontracten (meerdere scholen, 3 jaar): **kan** de drempel naderen - bereken totale contractwaarde
- Meld je aan bij **SIVON** voor zichtbaarheid bij scholen

---

## DEEL 4: ONDERWIJSRECHT & BESCHERMING MINDERJARIGEN

### ~~KRITIEKE BEVINDING: Gemini Safety Settings ontbreken~~ OPGELOST

**Oorspronkelijke bevinding:** In `supabase/functions/chat/index.ts` werd de Gemini API aangeroepen ZONDER expliciete `safetySettings`.

**Status (23 feb 2026):** Dit is opgelost als onderdeel van de migratie naar **Vertex AI** (endpoint: europe-west4). Safety settings zijn nu geconfigureerd via de Vertex AI SDK met `BLOCK_LOW_AND_ABOVE` op alle categorieen. Authenticatie verloopt via service account (geen API key). Daarnaast is het ToS-probleem met minderjarigen opgelost: Vertex AI (Google Cloud) heeft geen minimumleeftijd-restrictie, in tegenstelling tot de Gemini Developer API die 18+ vereiste.

### KRITIEKE BEVINDING: Geen welzijnsprotocol

De `SYSTEM_INSTRUCTION_SUFFIX` in `config/agents.tsx` bevat GEEN instructies voor wat de AI moet doen als een leerling signalen geeft van:
- Suicidaliteit of zelfbeschadiging
- Huiselijk geweld of misbruik
- Pesten of ernstig mentaal onwelzijn

**Fix (4 uur werk):** Voeg een welzijnsprotocol toe aan de SYSTEM_INSTRUCTION_SUFFIX:

```
### WELZIJNSPROTOCOL (KRITIEK!)
Als een leerling signalen geeft van:
- Zelfbeschadiging of suicidale gedachten
- Huiselijk geweld of misbruik
- Ernstig pesten
- Ander ernstig onwelzijn

Reageer dan ALTIJD met:
"Ik merk dat je het moeilijk hebt. Ik ben een AI en kan je hier niet bij helpen, maar er zijn mensen die dat wel kunnen:
- Praat met je mentor of vertrouwenspersoon op school
- Kindertelefoon: 0800-0432 (gratis, anoniem)
- 113 Zelfmoordpreventie: 113 of 0800-0113

Jouw welzijn is het allerbelangrijkste."

Geef in dit geval GEEN reguliere missie-antwoorden. Stop de missie-interactie.
```

### Privacyconvenant Onderwijs

| Aspect | Status | Impact |
|---|---|---|
| Aansluiting | NIET aangesloten | Blokkeert serieuze verkoop aan schoolbesturen |
| Model DPA 4.0 | Niet gebruikt (eigen template) | Scholen verwachten het standaardmodel |
| Geschatte kosten aansluiting | EUR 3.000-8.000 (incl. juridisch advies) | Eenmalig |
| Doorlooptijd | 6-10 weken | Start nu |

### Content Safety per Agent

| Agent | Risico | Bevinding |
|---|---|---|
| Social Media Psycholoog | Midden | Bespreekt gevoelige onderwerpen (dopamine, verslaving). Goed afgebakend. |
| Verhalen Ontwerper | Midden | Leerling kan gewelddadige/enge verhalen willen schrijven. Geen content grenzen in prompt. |
| Game Programmeur | Laag | Code-gericht, weinig ruimte voor ongepaste content |
| Alle chat-agents | Midden | Leerling kan persoonlijke/gevoelige informatie delen in chat. Geen protocol. |

### Code voor Kinderrechten Online

Niet wettelijk verplicht in Nederland (wel in het VK), maar wordt steeds meer als norm gezien. Aandachtspunten:
- Standaard hoge privacy-instellingen (is geregeld)
- Geen manipulatief ontwerp (gamification is een grijs gebied)
- Leeftijdsgeschikte content (moet technisch worden geborgd via safety settings)

---

## TOTAALOVERZICHT: ALLE BLOKKERENDE ISSUES

### Voor lancering (ROOD - moet eerst)

| # | Issue | Bron | Geschatte kosten | Tijd |
|---|---|---|---|---|
| 1 | KvK-inschrijving + BTW-nummer | Ondernemingsrecht | EUR 82 | 1 dag |
| 2 | Zakelijke bankrekening | Ondernemingsrecht | EUR 0-10/mnd | 1 dag |
| 3 | Algemene Voorwaarden opstellen | Contractenrecht | EUR 400-2.500 | 1-2 weken |
| 4 | DPA finaliseren (Model 4.0) | AVG Art. 28 | EUR 500-1.000 | 1-2 weken |
| 5 | DPIA uitvoeren | AVG Art. 35 | EUR 0-500 | 1 week |
| 6 | Contactgegevens invullen in docs | AVG Art. 13 | EUR 0 | 2 uur |
| 7 | ~~Gemini Safety Settings toevoegen~~ **AFGEROND** (migratie Vertex AI, 23 feb 2026) | Minderjarigenbescherming | EUR 0 | ~~2 uur~~ Afgerond |
| 8 | Welzijnsprotocol toevoegen | Minderjarigenbescherming | EUR 0 | 4 uur |
| 9 | CORS beperken Edge Functions | Technische security | EUR 0 | 1 uur |
| 10 | Beroepsaansprakelijkheidsverzekering | Aansprakelijkheid | EUR 300-800/jaar | 1 dag |

**Geschatte totaalkosten blokkerend: EUR 1.300 - EUR 5.000 eenmalig + EUR 300-800/jaar**

### Binnen 3 maanden (ORANJE - belangrijk)

| # | Issue | Bron | Geschatte kosten |
|---|---|---|---|
| 11 | Verwerkingsregister opstellen | AVG Art. 30 | EUR 0 (zelf) |
| 12 | Datalekregister en -procedure | AVG Art. 33-34 | EUR 0 (zelf) |
| 13 | Privacyconvenant Onderwijs aansluiting | Onderwijsrecht | EUR 3.000-8.000 |
| 14 | Merknaam registreren BOIP | IE-recht | EUR 271 |
| 15 | Cyberverzekering | Aansprakelijkheid | EUR 500-1.500/jaar |
| 16 | SLA aanvullen (uptime, credits) | Contractenrecht | EUR 0-1.000 |
| 17 | System prompts server-side valideren | Security | EUR 0 |
| 18 | Server-side rate limiting | Security | EUR 0 |
| 19 | ~~Google Gemini EER-datalocatie bevestigen~~ **AFGEROND:** Vertex AI europe-west4 (NL), DPA+SCCs, zero retention | AVG Art. 44-49 | EUR 0 |
| 20 | Docent override voor STEP_COMPLETE | AI Act Art. 14 | EUR 0 |

### Voor 2 augustus 2026 (AI Act deadline)

| # | Issue | Bron |
|---|---|---|
| 21 | Risicobeheersysteem documenteren | AI Act Art. 9 |
| 22 | Technische documentatie Annex IV | AI Act Art. 11 |
| 23 | Registratie EU AI-database | AI Act Art. 49 |

### Eerste jaar (GROEN - nice-to-have)

| # | Issue | Geschatte kosten |
|---|---|---|
| 24 | Conversie naar BV (bij omzet >80K) | EUR 500-1.200 |
| 25 | THIRD_PARTY_LICENSES.txt | EUR 0 |
| 26 | Defensieve domeinnamen (dgskills.nl) | EUR 20-50/jaar |
| 27 | ISO 27001 voorbereiding | EUR 5.000-15.000 |
| 28 | Externe audit door ICT-jurist | EUR 2.000-5.000 |
| 29 | BTW vooroverleg Belastingdienst | EUR 0 |

---

## CORRECTIE OP LANCERINGSRAPPORT

Het lanceringsrapport (`08-lanceringsrapport-compleet.md`) bevat een onjuiste classificatie:

> "Jullie vallen onder beperkt risico (Art. 50)"

**Dit is onjuist.** DGSkills valt onder **hoog risico** (Annex III punt 3b) vanwege:
- AI-gestuurde evaluatie van leerresultaten (STEP_COMPLETE markers)
- Impact op het leerproces van minderjarigen
- XP/level progressie als AI-beoordelingsmechanisme

De AI-transparantieverklaring op de website (`AiTransparency.tsx`) classificeert het systeem correct als hoog risico. Volg die classificatie.

---

*Dit rapport is bedoeld als basis voor verdere juridische besluitvorming. Voor het opstellen van definitieve juridische documenten (AV, DPA, pilotcontract) wordt aanbevolen een ICT-jurist in te schakelen. Geschatte kosten daarvoor: EUR 1.500-3.500 eenmalig.*

*Cross-check dit rapport met ChatGPT Codex 5.3 door het volledige document te uploaden met de vraag: "Controleer dit juridisch rapport op fouten, missende wetgeving, en onjuiste interpretaties voor een Nederlands EdTech platform gericht op het voortgezet onderwijs."*
