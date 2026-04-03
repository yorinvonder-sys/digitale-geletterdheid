# Audit — Privacy by Design (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `privacy-by-design` |
| **Titel** | Privacy by Design |
| **Leerjaar & Periode** | Leerjaar 2, Periode 2 |
| **Template-engine** | SimulationLab |
| **SLO-kerndoelen** | 23A, 23C |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |
| **Referentiestatus** | GOLD STANDARD — de ULTIMATE referentie, verwacht 90%+ |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Privacy by Design"
- [x] `introDescription` concreet — "Ontdek hoe jouw digitale keuzes bepalen hoeveel anderen over jou weten"
- [x] `primaryGoal` aanwezig — "🎯 Maak de app AVG-proof als Privacy Officer"
- [x] `goalCriteria` aanwezig — `{ type: 'steps-complete', min: 3 }`
- [x] Glassmorphism-visualPreview met "BuddyLoop Privacy Audit" en "AVG Check" labels
- [x] Moeilijkheidsgraad "Medium" zichtbaar en passend
- [x] Drie introFeatures duidelijk: Social media instellingen, App-permissies, Cookie-afruil

**Bronbestanden:** `config/agents/year2.tsx:1208-1235`, `components/missions/templates/simulation-lab/configs/privacy-by-design.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De visualPreview is identiek sterk als network-navigator: glassmorphism-stijl met thematisch relevante labels. De `primaryGoal` geeft leerlingen een concrete rol (Privacy Officer), wat de betrokkenheid verhoogt. De introFeatures geven een concreet overzicht van de drie simulaties.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Visuele preview gebruikt Tailwind inline classes — geen hardcoded hex-kleuren
- [x] Violet kleurthema is consistent door de missie (van privacy-beveiligingsthema)
- [x] Glassmorphism-effect (`backdrop-blur-md`, `bg-white/20`) is subtiel en niet afleidend
- [x] SimulationLab-template biedt structurele visuele consistentie
- [x] Geen hardcoded hex-kleuren in de visualPreview

**Bronbestanden:** `config/agents/year2.tsx:1222-1235`

**Score:** 5 / 5

**Opmerkingen:**
> De visualPreview is een van de beste in de codebase: glassmorphism met "BuddyLoop Privacy Audit" en "AVG Check" labels die direct het scenario communiceren. Alle kleuren zijn Tailwind utility-classes. De SimulationLab-simulaties gebruiken de lab-kleurenpalette consistent.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw: Risico's identificeren → Verklaring schrijven → Herontwerpen
- [x] Drie SimulationLab-simulaties sluiten naadloos aan op de drie agent-stappen
- [x] Sim 1 (social media instellingen) → Sim 2 (app-permissies) → Sim 3 (cookies) bouwt conceptueel op
- [x] WERKWIJZE-sectie in systemInstruction legt stap-voor-stap aanpak uit
- [x] BEOORDELINGSCRITERIA-sectie geeft expliciete criteria per stap
- [x] Moeilijkheidsgraad "Medium" correct voor J2

**Bronbestanden:** `config/agents/year2.tsx:1247-1293`, `components/missions/templates/simulation-lab/configs/privacy-by-design.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw op twee niveaus: (1) de agent-stappen (risico-scan → privacyverklaring → herontwerp) volgen de werkwijze van een echte Privacy Officer, en (2) de SimulationLab-simulaties verankeren de concepten interactief. De twee lagen versterken elkaar: leerlingen leren via de simulaties, en verwerken via de chat.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] AVG-principes correct — dataminimalisatie, doelbinding, recht op vergetelheid, toestemming
- [x] BuddyLoop-features zijn realistische privacyrisico's (locatie-tracking, geen uitlogoptie, gezichtsherkenning)
- [x] Sim-vragen feitelijk correct — microfoon/locatie als meest gevoelig correct
- [x] Cookie-uitleg correct — functionele cookies vs. tracking-cookies onderscheid klopt
- [x] "persoonsgegevens = alles waarmee iemand jou kan herkennen" is een correcte en begrijpelijke definitie
- [x] Alle negen correctAnswers in de SimulationLab-config zijn feitelijk juist geverifieerd
- [x] Geen spelfouten of feitelijke fouten gevonden

**Bronbestanden:** `config/agents/year2.tsx:1236-1317`, `components/missions/templates/simulation-lab/configs/privacy-by-design.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De AVG-principes worden correct en in tiener-taal uitgelegd. De BuddyLoop-features zijn realistisch (ze zijn vergelijkbaar met echte apps die in rechtszaken zijn geweest). De simulatievragen zijn alle feitelijk correct. De "locatie-sharing = weten wanneer je niet thuis bent" uitleg is concreet en treffend.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` minimaal 500 tekens — ~2200 tekens, ruim voldoende
- [x] EERSTE BERICHT aanwezig — warm, geeft direct de BuddyLoop-features en opdracht
- [x] STEP_COMPLETE markers aanwezig (3/3) — 3 risico's, 5-onderdelen verklaring, 3 principes herontwerp
- [x] BEOORDELINGSCRITERIA-sectie aanwezig — uniek kenmerk van de beste missies
- [x] REGELS-sectie aanwezig — "leg AVG-termen ALTIJD uit in begrijpelijke taal"
- [x] "Stimuleer kritisch denken" als expliciete richtlijn

**Bronbestanden:** `config/agents/year2.tsx:1236-1317`

**Score:** 5 / 5

**Opmerkingen:**
> De systemInstruction is de meest uitgebreide en rijkste in J2P2. De BEOORDELINGSCRITERIA-sectie is bijzonder: concrete, telbare criteria per stap (minstens 3 risico's, alle 5 onderdelen van de privacyverklaring, minstens 3 principes in het herontwerp). Het EERSTE BERICHT is perfect: het geeft direct de BuddyLoop-features en een concrete opdracht. De REGELS-sectie legt expliciete gedragsnormen voor de AI-coach vast.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] SimulationLab met drie simulaties perfect afgestemd op privacy-leerdoelen
- [x] Sim 1 (slider/toggle voor profiel-instellingen) — leerlingen zien direct impact op Privacy Score
- [x] Sim 2 (toggles voor app-permissies) — leerlingen kiezen bewust welke data ze delen
- [x] Sim 3 (select voor cookie-voorkeur) — comparison-visualisatie maakt de cookie-afruil zichtbaar
- [x] maxScore: 100 (30+40+30) met 9 multiple-choice vragen
- [x] Interactive elements maken abstracte AVG-principes tastbaar

**Bronbestanden:** `components/missions/templates/simulation-lab/configs/privacy-by-design.ts`

**Score:** 5 / 5

**Opmerkingen:**
> De interactievorm is perfect afgestemd op het leerdoel. De Privacy Score-meter in Sim 1 geeft leerlingen directe feedback op hun keuzes. De bar-chart voor permissies maakt de "gevoeligheid" van data visueel vergelijkbaar. De cookie-comparison legt de afruil expliciet bloot. Dit is de sterkste interactie-implementatie in J2P2.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] `goalCriteria` aanwezig — `{ type: 'steps-complete', min: 3 }`
- [x] `primaryGoal` aanwezig — "🎯 Maak de app AVG-proof als Privacy Officer"
- [x] Badges aanwezig (4) — "Privacy Expert" (90%), "Privacy Pro" (70%), "Privacy Beginner" (50%), "Aan het leren"
- [x] maxScore: 100 (30+40+30)
- [x] takeaways aanwezig (5) — inhoudelijk sterk en overdraagbaar
- [x] Scoredrempels realistisch

**Bronbestanden:** `components/missions/templates/simulation-lab/configs/privacy-by-design.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsstructuur. De badge "Privacy Expert" is aspirerend. De vijf takeaways zijn uitstekend: ze vatten de kernlessen samen op een manier die leerlingen kunnen toepassen in hun dagelijks leven ("kleine aanpassingen maken al groot verschil"). De `goalCriteria` en `primaryGoal` geven samen een helder einddoel.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] SLO 23A (Privacy en veiligheid) — correct, AVG-kennis is kern van 23A
- [x] SLO 23C (Privacy by design) — correct, het herontwerp van de app past precies bij 23C
- [x] Mapping-opmerking ("GDPR + privacy-redesign, geen programmeren") is een correct onderscheid
- [x] Geen conflict tussen mapping en content
- [x] 22B terecht niet geclaimd — de missie programmeert niet

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:115`

**Score:** 5 / 5

**Opmerkingen:**
> Perfecte SLO-koppeling. 23A omvat privacybewustzijn en AVG-kennis; 23C is letterlijk "privacy by design" als ontwerpprincipe. De missie-inhoud en SLO-mapping zijn volledig consistent. De mapping-opmerking is een waardevolle toelichting die onderscheidt van 22B-missies.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau passend — AVG-begrippen worden uitgelegd in tiener-taal
- [x] Privacy Score-meter geeft tekstlabels naast de numerieke waarde
- [x] Comparison-visualisaties zijn volledig tekstueel (icoon + beschrijving)
- [x] Bar-chart-labels zijn aanwezig naast de kleurindicatoren
- [x] REGELS-sectie verplicht de coach om AVG-termen altijd uit te leggen
- [x] Concrete voorbeelden (locatie-sharing, cookies) zijn herkenbaar voor alle leerprofielen

**Score:** 5 / 5

**Opmerkingen:**
> De toegankelijkheid is beter dan de andere SimulationLab-missies. De comparison-visualisaties gebruiken icoon + tekstlabel als gecombineerde informatiedrager (niet alleen kleur). De Privacy Score-meter geeft een beschrijvend `sublabel` naast de numerieke waarde. De AVG-termen worden altijd in begrijpelijke taal uitgelegd.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Privacy Officer-rol, BuddyLoop-scenario concreet |
| 2. Visueel | 5 | ×1 = 5 | Beste visualPreview, geen hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Twee-laagse opbouw: simulaties + chat |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | AVG-principes correct, alle vragen geverifieerd |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Meest uitgebreide systemInstruction in J2P2 |
| 6. Interactiviteit | 5 | ×1 = 5 | Privacy Score-meter is de sterkste interactie in J2P2 |
| 7. Afronding & feedback | 5 | ×1 = 5 | Volledige structuur, overdraagbare takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23A en 23C perfect gedekt |
| 9. Toegankelijkheid | 5 | ×1 = 5 | Geen kleurafhankelijke informatie, tiener-taal verplicht |
| **TOTAAL** | | **55 / 55** | |

### Gewogen totaal

```
(5×1) + (5×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (5×1) = 55
Percentage = (55 / 55) × 100% = 100%
```

### Verdict

**✅ Klaar voor inzet** (100% — GOLD STANDARD)

> De best scorende missie in J2P2 en de ULTIMATE referentie voor het platform. Privacy by Design combineert de sterkste visualPreview, de meest uitgebreide systemInstruction, de best afgestemde interacties en een perfecte SLO-koppeling. Elke andere missie in het platform kan worden verbeterd door elementen van deze missie te adopteren: de BEOORDELINGSCRITERIA-sectie, de twee-laagse didactiek (simulaties + chat), en de overdraagbare takeaways.

---

### Actielijst

#### Geen blokkerende issues of verbeterpunten.

Deze missie is de referentiestandaard voor het platform.

#### Aanbevelingen voor andere missies (op basis van deze missie)

| # | Element | Mis bij deze missies |
|---|---------|---------------------|
| 1 | BEOORDELINGSCRITERIA-sectie in systemInstruction | algorithm-architect (al deels), web-developer, app-prototyper |
| 2 | Twee-laagse didactiek (simulaties + chat) | Alle builder-canvas missies |
| 3 | Overdraagbare takeaways die dagelijks leven raken | code-review-2 |
| 4 | AVG-begrippen uitleggen in tiener-taal | wachtwoord-warrior (al gedeeltelijk) |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
