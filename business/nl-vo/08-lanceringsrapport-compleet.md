# DGSkills.app - Compleet Lanceringsrapport

**Datum:** 23 februari 2026
**Auteur:** Claude (AI-assistent) in opdracht van oprichter
**Versie:** 1.0

---

## 1. SECURITY & COMPLIANCE

### Huidige status: GOED - maar er zijn aandachtspunten

#### Wat al goed is geregeld (GROEN)

- API key (Gemini) staat server-side in de Edge Function, niet in de frontend
- JWT authenticatie op alle Edge Functions (chat, deleteMyAccount, exportMyData, restrictProcessing)
- Prompt injection filtering (OWASP LLM01:2025) met defense-in-depth (client + server)
- RLS policies op de `users` tabel met `is_teacher()` helper
- Server-side RPC functies voor gevoelige operaties (reset_student_progress, delete_student)
- Data retention policies (automatische opschoning)
- AVG-rechten technisch ingebouwd: data export, account verwijdering, verwerkingsbeperking
- Client-side rate limiting hook beschikbaar
- Compliance documentatie aanwezig: legal-matrix, DPIA template, DPA template, privacy-explainer

#### Aandachtspunten (ORANJE)

| Issue | Waar | Impact |
|---|---|---|
| `Access-Control-Allow-Origin: *` op ALLE Edge Functions | Alle `supabase/functions/*/index.ts` | Elke website kan verzoeken sturen naar je API. Beperk dit tot `dgskills.app` |
| Client-side rate limiting is geen echte beveiliging | `hooks/useRateLimit.ts` (regel 33: "UX guard only") | Iemand kan dit omzeilen. Server-side rate limiting op de Edge Function ontbreekt |
| `systemInstruction` wordt vanuit de client meegestuurd naar de Edge Function | `supabase/functions/chat/index.ts:95` | Een kwaadwillende kan het system prompt aanpassen. Verplaats systeem-prompts naar server-side |
| Audit rapport zegt "Firestore rules" maar je gebruikt nu Supabase | `business/nl-vo/compliance/audit-report.md:16` | Verouderd document, kan verwarring geven bij inkoop |

#### Kritiek voor lancering (ROOD)

| Issue | Actie |
|---|---|
| CORS te breed | Verander `Access-Control-Allow-Origin: *` naar `https://dgskills.app` op alle Edge Functions |
| SystemInstruction van client | Valideer of whitelist system prompts server-side, of sla agent configs op in de database |
| Contactgegevens ontbreken | In privacy-explainer staan `[invullen]` placeholders - deze MOETEN ingevuld voor lancering |
| Verwerkersovereenkomst (DPA) is een template, geen getekend document | Je hebt een juridisch waterdichte DPA nodig die scholen kunnen ondertekenen |

#### Wat je moet doen voor lancering

1. CORS beperken tot je eigen domein (1 uur werk)
2. System prompts server-side valideren of whitelisten (2-3 uur werk)
3. Alle `[invullen]` placeholders in juridische docs invullen
4. Een echte verwerkersovereenkomst laten maken (gebruik het Privacyconvenant Onderwijs Model 4.0 als basis)
5. Server-side rate limiting toevoegen aan de chat Edge Function

#### Over de EU AI Act

Jullie vallen onder "beperkt risico" (Art. 50). Dit betekent transparantieplicht: gebruikers moeten weten dat ze met AI praten. Dit is al geregeld in het product. Je bent NIET high-risk zolang de AI geen beslissingen neemt over leerlingen (beoordeling/selectie). De docent blijft eindverantwoordelijk - dat is goed.

#### Over minderjarigen (<16 jaar)

De school is verwerkingsverantwoordelijke, niet jij. Zolang de school toestemming regelt (via hun eigen procedures) en jij als verwerker handelt op basis van de DPA, is dit juridisch correct. Dit staat goed beschreven in jullie privacy-documentatie.

---

## 2. DIDACTISCHE KWALITEIT

### Overzicht missies

| Missie | Bloom Niveau | Kwaliteit | SLO-dekking |
|---|---|---|---|
| Magister Meester | Toepassen | Sterk | Digitale Systemen |
| Cloud Commander | Toepassen | Sterk | Netwerken & Cloud |
| Word Wizard | Toepassen/Creeren | Sterk | Content Maken |
| Social Media Psycholoog | Analyseren/Evalueren | Zeer sterk | Digitaal Welzijn, Digitale Ethiek |
| Slide Specialist | Toepassen/Creeren | Sterk | Content Maken, Digitaal Ontwerpen |
| Print Pro | Onthouden/Toepassen | Matig | Digitale Systemen |
| iPad Print Instructies | Onthouden | Zwak | Minimaal (verwijst alleen naar ander document) |
| De Tijdmachine (Review) | Analyseren/Evalueren | Zeer sterk | Breed (herhalingsmissie) |
| Verhalen Ontwerper | Creeren | Zeer sterk | Content Maken, AI Gebruiken |
| Game Programmeur | Creeren/Toepassen | Zeer sterk | Coderen, Debuggen, Computationeel Denken |

### Sterke punten

- De 3-Stappen Methode (Erkenning/Uitleg/Challenge) is didactisch zeer sterk
- XP farming detectie voorkomt "vals leren"
- Stap-voltooiing met verificatievragen (niet gewoon "zeg KLAAR") is uitstekend
- Scaffolding via hints en tips is goed ingebouwd
- De Tijdmachine als herhalingsmissie is didactisch slim (spaced repetition concept)
- Verhalen Ontwerper heeft een excellent verhaalboog-template voor leerlingen die vastlopen

### Verbeterpunten

1. **iPad Print Instructies is een lege huls** - De agent verwijst alleen naar een extern document. Dit is geen missie, dit is een link. Overweeg: verwijderen of integreren in Print Pro.

2. **Geen expliciete leerdoelen per missie** - Leerlingen zien een "missionObjective" maar geen meetbaar leerdoel. Voeg toe: "Na deze missie kun je..." (SMART-geformuleerd)

3. **SLO-mapping is aanwezig maar niet volledig gekoppeld** - De SLO-doelen structuur is er, maar er is geen directe mapping van "missie X dekt kerndoel Y" in de agents config. Dit moet je wel kunnen aantonen aan de inspectie.

4. **Ontbrekende onderwerpen in het curriculum:**
   - **Cybersecurity / veilig wachtwoorden** - Kritiek voor deze doelgroep
   - **Mediawijsheid / fake news herkennen** - SLO kerndoel "Informatie Beoordelen"
   - **Data & privacy** - SLO kerndoel "Privacy Bescherming"
   - **Programmeren verdieping** - Alleen Game Programmeur dekt dit nu
   - **Online communicatie & samenwerken** - SLO kerndoel "Digitale Communicatie"

5. **Differentiatie ontbreekt** - Alle leerlingen krijgen dezelfde missies ongeacht niveau (vmbo/havo/vwo). De system prompts benoemen "12-15 jaar" maar differentieren niet op niveau.

### Aanbeveling prioriteit

1. Verwijder of herwerk iPad Print Instructies
2. Voeg per missie een expliciete SLO-kerndoel mapping toe (voor inspectie-bewijs)
3. Maak 2-3 nieuwe missies voor ontbrekende SLO-domeinen (Cybersecurity, Mediawijsheid)
4. Overweeg een moeilijkheidsinstelling per missie (basis/verdieping)

---

## 3. DOCENTVRIENDELIJKHEID

### Wat al goed is

- Duidelijke rolscheiding (docent/leerling)
- Docentendashboard met voortgangsoverzicht
- SLO-kerndoeldekking visueel inzichtelijk
- Missies zijn zelfstandig door leerlingen te voltooien (docent hoeft niet continu mee te kijken)
- Automatische XP en badge toekenning
- Onboarding documentatie aanwezig (docenthandleiding eerste lesuur)

### Wat verbeterd moet worden

| Punt | Prioriteit | Toelichting |
|---|---|---|
| Onboarding-flow in de app zelf | Hoog | Een docent die voor het eerst inlogt moet stap-voor-stap begeleid worden. Nu is dit een extern document. |
| "Wat moet ik doen als...?" FAQ in de app | Hoog | Meestgestelde vragen direct beschikbaar maken |
| Lesplannen / lesdraaiboeken | Hoog | Docenten willen weten: "Wat doe ik in 50 minuten?" Maak kant-en-klare leskaarten |
| Terminologie | Midden | "Missie", "Agent", "XP", "Briefing" - zorg dat er een woordenlijst is voor docenten |
| Klasbeheer vereenvoudigen | Midden | Hoe makkelijk is het om 30 leerlingen toe te voegen? Bulk-import via CSV? |
| Printbare voortgangsrapporten | Midden | Docenten willen iets printen voor oudergesprekken/rapportvergaderingen |
| Offline leskaarten | Laag | Als internet uitvalt, wat kan de docent dan doen? |

### Concrete tip: "Eerste Lesuur Kit"

Maak een kit die je bij elke pilot meelevert:
1. Leskaart (45 minuten draaiboek)
2. Korte docentinstructie (max 1 A4)
3. Leerlingkaart met inloggegevens
4. FAQ met top-5 problemen en oplossingen

---

## 4. BUSINESS MODEL

### Product-markt fit: STERK

USP: **missiegedreven digitale geletterdheid, gekoppeld aan SLO-kerndoelen, met meetbare voortgang.**

### Pricing

| Pakket | Prijs | Per leerling |
|---|---|---|
| Start (t/m 250 leerlingen) | 4.900/jaar | ~19,60/jaar |
| School-S (251-500) | 8.900/jaar | ~17,80-35,46/jaar |
| School-M (501-900) | 12.900/jaar | ~14,33-25,75/jaar |
| School-L (901-1400) | 17.900/jaar | ~12,79-19,87/jaar |
| Pilot Start | 1.500 (8 wk) | 100% verrekening bij jaarcontract |

Pricing is competitief en goed doordacht.

### Kosten

- **Supabase**: Free tier of Pro ($25/maand)
- **Vercel**: Free tier of Pro ($20/maand)
- **Gemini API**: Pay-per-use, gemini-2.0-flash (~$0.075/1M input tokens)
- **Totaal bij 10 scholen**: ~$50-100/maand infra
- **Totaal bij 100 scholen**: ~$200-500/maand infra
- **Brutomarge**: 95%+ bij schaal

### Wat ontbreekt voor zakelijke basis

| Item | Waarom belangrijk |
|---|---|
| KvK-inschrijving | Verplicht voor B2B verkoop |
| Algemene Voorwaarden | Juridische bescherming |
| Beroepsaansprakelijkheidsverzekering | Essentieel bij werken met minderjarigen-data |
| BTW-registratie | Scholen betalen excl. BTW |
| Bankrekening zakelijk | Scheiding prive/zakelijk |
| Boekhouding | Facturen, BTW-aangifte |

### 90-Dagen Lanceringsplan

**Maand 1: Fundament**
- Week 1-2: Juridisch op orde (KvK, BTW, AV, DPA afronden, verzekering)
- Week 1-2: CORS fix + contactgegevens invullen in privacy-docs
- Week 3-4: Eerste 1-2 pilotscholen benaderen (eigen netwerk)

**Maand 2: Eerste pilots**
- Week 5-6: Kickoff met pilot-school(en), onboarding docenten
- Week 7-8: Monitoren, wekelijkse KPI check, bugs fixen
- Parallel: 2-3 nieuwe missies bouwen (Cybersecurity, Mediawijsheid)

**Maand 3: Evaluatie & schaal**
- Week 9-10: Tussenevaluatie pilot, optimalisaties doorvoeren
- Week 11-12: Case study schrijven, website updaten met social proof
- Parallel: Tweede cohort pilotscholen werven

---

## SAMENVATTING: ACTIE-ITEMS

### Blokkerend (voor lancering)
1. CORS beperken op alle Edge Functions (1 uur)
2. System prompt server-side valideren (2-3 uur)
3. Privacy-docs afmaken (contactgegevens invullen, DPA finaliseren)
4. KvK + juridisch (als nog niet geregeld)

### Hoge prioriteit (eerste 2 weken)
5. iPad Print Instructies missie verwijderen of herwerken
6. SLO-kerndoel mapping per missie expliciet maken
7. Server-side rate limiting op chat endpoint
8. Eerste Lesuur Kit samenstellen

### Belangrijk (eerste maand)
9. 2-3 nieuwe missies voor ontbrekende SLO-domeinen
10. In-app onboarding voor docenten
11. Differentiatie-optie (niveau-instelling)

### Advies
- Cross-platform controle met ChatGPT: focus op OWASP Top 10, hardcoded secrets, SQL injection
- Juridisch advies DPA: eenmalig ~500-1000 euro (goedkoper dan developer, minstens zo belangrijk)
- Gebruik Privacyconvenant Onderwijs Model 4.0 als DPA-basis

---

*Dit document wordt beheerd in de codebase en is beschikbaar als referentie voor alle toekomstige sessies.*
