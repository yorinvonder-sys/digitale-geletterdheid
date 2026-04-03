# Audit — Access Control Engineer (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `access-control-engineer` |
| **Titel** | Access Control Engineer |
| **Leerjaar & Periode** | Leerjaar 2, Periode 2 |
| **Template-engine** | Standalone component (`AccessControlEngineerMission.tsx`) |
| **SLO-kerndoelen** | 21A, 23A, 22B |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `primaryGoal` aanwezig — "🛡️ Beveilig het schoolsysteem als Access Control Engineer"
- [x] `goalCriteria` aanwezig — `{ type: 'steps-complete', min: 3 }`
- [x] Scenario direct herkenbaar — schoolsysteem met realistische beveiligingsfouten
- [x] EERSTE BERICHT concreet — drie beveiligingsfouten benoemd
- [x] Moeilijkheidsgraad "Medium" passend voor J2
- [x] Indigo/paars kleurthema consistent met "security" thema

**Bronbestanden:** `config/agents/year2.tsx:2710-2801`, `components/missions/AccessControlEngineerMission.tsx`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De visualPreview toont direct drie gebruikersrollen met toegang/geblokkeerd-indicators (admin: groen, docent: groen, gast: rood). Dit communiceert het concept van toegangscontrole visueel vóórdat leerlingen de missie starten. Het scenario (Het Rijnlands Lyceum) is schoolspecifiek en herkenbaar.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Standalone component heeft eigen visuele identiteit
- [x] Indigo kleurthema consistent door de missie (header, knoppen, accenten)
- [x] Kleurgecodeerde rollen (groen = toegang, rood = geblokkeerd) zijn intuïtief
- [x] Sticky header met stap-indicator biedt navigatie-ondersteuning
- [x] `useMissionAutoSave` voor state-persistentie is goed voor mobiele gebruikers
- [ ] Role-indicators gebruiken kleur als primaire informatiedrager (groen/rood bolletje) zonder tekst-only alternatief

**Bronbestanden:** `components/missions/AccessControlEngineerMission.tsx:1-60`

**Score:** 4 / 5

**Opmerkingen:**
> Het standalone component heeft een doordachte visuele structuur met sticky header en stap-indicators. De kleurcodering voor rollen (groen/rood) is intuïtief maar gebruikt kleur als primaire informatiedrager. Er is wel tekst ("TOEGANG"/"GEBLOKKEERD") naast de kleur in de visualPreview, wat de toegankelijkheid verbetert. In het component zelf worden rollen ook via tekst communiceer (CheckCircle2/XCircle iconen + tekst).

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Analyseren → Rechten instellen → Testen is correct security-engineering proces
- [x] "Principle of least privilege" wordt als concept geïntroduceerd
- [x] Stap 3 vereist minimaal 5 testscenario's — concrete, toetsbare eis
- [x] Vergelijking "rollen zijn als sleutels" is didactisch sterk
- [x] VSO-variant aanwezig — component past zich aan voor leerlingen met aangepaste ondersteuning
- [x] Moeilijkheidsgraad "Medium" correct voor J2

**Bronbestanden:** `config/agents/year2.tsx:2757-2783`, `components/missions/AccessControlEngineerMission.tsx`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw, versterkt door het standalone component. De VSO-variant (vereenvoudigde tekst en hints) is een uniek kenmerk dat inclusiviteit toont. De drie stappen volgen het echte security-engineeringsproces: eerst analyseren wat fout is, dan correct instellen, dan testen met scenario's. De minimale drempels (3+ problemen, 4+ resources, 5+ tests) zijn helder en bereikbaar.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Beveiligingsregels zijn realistisch en correct — gasten zonder wachtwoord inloggen is een echte kwetsbaarheid
- [x] "Principle of least privilege" correct uitgelegd
- [x] Privacy-koppeling correct — "toegangscontrole is ook privacybescherming (AVG)"
- [x] ONVEILIGE_REGELS in het component zijn feitelijk correct (5 regels met correcte uitleg)
- [x] Risicotypen (privacy, authenticatie, toegang) zijn correct gecategoriseerd
- [x] Geen spelfouten of feitelijke fouten gevonden

**Bronbestanden:** `components/missions/AccessControlEngineerMission.tsx:71-100`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De vijf onveilige regels in het component zijn realistisch en de uitleg per regel is didactisch waardevol. De koppeling naar AVG ("waarom toegangscontrole ook privacybescherming is") verbindt de missie goed met de bredere privacythematiek van J2P2. Geen feitelijke fouten.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` minimaal 500 tekens — ~1400 tekens
- [x] EERSTE BERICHT aanwezig — "Hoi! Ik ben je Security Coach." met directe opdracht
- [x] STEP_COMPLETE markers aanwezig (3/3) — met expliciete bevestigingszinnen
- [x] REGELS-sectie aanwezig — defensief onderwijs verankerd
- [x] Component bevat ook `coachMessage` systeem voor inline hints

**Bronbestanden:** `config/agents/year2.tsx:2749-2783`, `components/missions/AccessControlEngineerMission.tsx`

**Score:** 5 / 5

**Opmerkingen:**
> Uniek voor dit standalone component: naast de AI-coach (systemInstruction) is er ook een ingebouwde `coachMessage`-functionaliteit in het component zelf die hints geeft bij foute antwoorden. Dit dubbele coaching-systeem (AI + component) is sterker dan een pure AI-chat-aanpak. De bevestigingszinnen bij STEP_COMPLETE zijn motiverend.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Stap 1: Leerlingen klikken op onveilige regels — directe feedback via groene/rode highlight
- [x] Stap 2: Leerlingen togglen rollen per resource — visuele rolmatrix
- [x] Stap 3: Leerlingen voeren testscenario's uit — directe feedback op correct/fout
- [x] `useMissionAutoSave` persisteert state — leerlingen kunnen pauzeren en verder gaan
- [x] Coach-hints verschijnen bij foute antwoorden
- [x] Drie concrete, uitvoerbare stappen

**Score:** 5 / 5

**Opmerkingen:**
> De sterkste interactie-implementatie van de standalone componenten. De drievoudige interactie (klik → toggle → test) volgt een duidelijke progression. De directe visuele feedback (groen/rood highlight bij klikken, correct/fout bij testscenario's) is effectief voor leerlingen. De rolmatrix in stap 2 is intuïtief en vergelijkbaar met echte access control management tools.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] `goalCriteria` aanwezig — `{ type: 'steps-complete', min: 3 }`
- [x] `primaryGoal` aanwezig
- [x] Component roept `onComplete(true)` aan bij afronden
- [x] Stap 3 geeft feedback per testscenario (correct/fout)
- [ ] Geen badges of maxScore zichtbaar in de agent-config of het component — standalone component gebruikt geen badge-systeem

**Bronbestanden:** `config/agents/year2.tsx:2722-2723`, `components/missions/AccessControlEngineerMission.tsx:336-340`

**Score:** 3 / 5

**Opmerkingen:**
> De missie heeft een duidelijke completion-trigger (`onComplete(true)`) en de drie stappen zijn helder. Echter: er zijn geen badges of takeaways geïmplementeerd in het standalone component. Na het voltooien van de drie stappen weet de leerling dat ze klaar zijn, maar er is geen samenvatting van wat geleerd is en geen visuele badge als beloning. Dit is een vergelijkbare beperking als bij sommige DataViewer-missies.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] SLO 21A (Digitale basisvaardigheden) — correct, toegangscontrole is een basisconcept
- [x] SLO 23A (Privacy en veiligheid) — correct, toegangscontrole is privacybescherming
- [x] SLO 22B (Programmeren) — deels correct, de logica van rechten toewijzen vergt algoritmisch denken
- [x] Alle drie kerndoelen worden feitelijk aangeraakt
- [x] Geen conflict tussen mapping en content

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:117`

**Score:** 5 / 5

**Opmerkingen:**
> De drievoudige SLO-koppeling is goed onderbouwd. 21A via het begrijpen van digitale systemen, 23A via privacy en beveiliging, 22B via algoritmisch denken over toegangslogica. De mapping is de meest uitgebreide van J2P2.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] VSO-variant aanwezig — vereenvoudigde tekst voor leerlingen die ondersteuning nodig hebben
- [x] Rolvergelijking in het component heeft CheckCircle2/XCircle iconen naast kleur
- [x] `uitleg` per regel is beschikbaar via een "Bekijk uitleg" knop
- [ ] Rolmatrix in stap 2 gebruikt kleurcodering — check of er ook labels aanwezig zijn
- [x] Toetsenbord-navigatie via buttons is aanwezig (button-elementen)

**Score:** 4 / 5

**Opmerkingen:**
> De VSO-variant is een uniek toegankelijkheidskenmerk. De uitleg-functionaliteit per regel helpt leerlingen die meer context nodig hebben. Kleine beperking: de rolmatrix-toggles in stap 2 zijn nog niet volledig geverifieerd op screen-reader toegankelijkheid, maar de button-structuur is aanwezig.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Schoolscenario herkenbaar, visualPreview communiceert concept |
| 2. Visueel | 4 | ×1 = 4 | Doordacht component, kleur + tekst gecombineerd |
| 3. Didactische flow | 5 | ×2 = 10 | Analyseer→Instel→Test is correct, VSO-variant sterk |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Beveiligingsregels correct, AVG-koppeling aanwezig |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Dubbel coaching-systeem (AI + component) |
| 6. Interactiviteit | 5 | ×1 = 5 | Sterkste interactie van standalone componenten |
| 7. Afronding & feedback | 3 | ×1 = 3 | Geen badges of takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21A + 23A + 22B allemaal gedekt |
| 9. Toegankelijkheid | 4 | ×1 = 4 | VSO-variant sterk, rolmatrix deels te controleren |
| **TOTAAL** | | **52 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (3×1) + (5×1) + (4×1) = 52
Percentage = (52 / 55) × 100% = 94,5%
```

### Verdict

**✅ Klaar voor inzet** (94,5%)

> Een sterke standalone-missie met de beste interactie-implementatie van alle standalone componenten. Het dubbele coaching-systeem (AI + component-hints) en de VSO-variant zijn unieke sterke punten. De enige zwakke plek is het ontbreken van badges en takeaways na afronding.

---

### Actielijst

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 7. Afronding & feedback | Voeg een afrondingsscherm toe met 3-5 takeaways en een badge (bijv. "Security Engineer") na voltooiing van de drie stappen | Medium |

#### Nice-to-haves

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 9. Toegankelijkheid | Verifieer screen-reader ondersteuning van de rolmatrix-toggles in stap 2 | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
