# Audit — Code Review 2 / Code Terugblik (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `code-review-2` |
| **Titel** | Code Terugblik |
| **Leerjaar & Periode** | Leerjaar 2, Periode 2 |
| **Template-engine** | ReviewArena |
| **SLO-kerndoelen** | 22A, 22B |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Bewijs dat je programmeren beheerst!"
- [x] `introDescription` duidelijk — review van alle programmeerconcepten uit Periode 2
- [x] Moeilijkheidsgraad "Medium" passend voor een afsluitende review
- [x] EERSTE BERICHT uitnodigend — "Code Review Marathon — check, check, check!"
- [ ] `problemScenario` is vrij abstract — "alles testen wat je hebt geleerd" geeft geen concrete context

**Bronbestanden:** `config/agents/year2.tsx:1338-1442`, `components/missions/templates/review-arena/configs/code-review-2.ts`

**Score:** 4 / 5

**Opmerkingen:**
> De introductie is functioneel en duidelijk. Het EERSTE BERICHT verwijst naar de afgeronde periode en stelt een reflectievraag ("welk onderdeel was voor jou het meest verrassend?"). Het `problemScenario` is echter generiek ("bewijs dat je de concepten beheerst") zonder de concrete, situatiespecifieke context van de andere J2P2-missies. Dit is inherent aan review-missies maar vermindert de eerste indruk enigszins.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] ReviewArena-template biedt structurele visuele consistentie
- [x] Grijs kleurthema past bij een neutrale, toets-achtige omgeving
- [ ] `#6B6B66` in visualPreview is een niet-standaard Tailwind kleur — mogelijk hardcoded
- [x] RotateCcw-icoon communiceert "terugblik" thematisch correct

**Bronbestanden:** `config/agents/year2.tsx:1350-1356`

**Score:** 3 / 5

**Opmerkingen:**
> De grijze kleur is functioneel maar minder uitnodigend dan de andere J2P2-missies. De visualPreview is de meest neutrale in de collectie — een grijze gradient met een RotateCcw-icoon. Dit reflecteert de "review"-aard van de missie maar geeft geen visuele prikkel. De `color: '#6B6B66'` in de agent-config is mogelijk een hardcoded hex die niet via Tailwind loopt.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Concepten herhalen → Code analyseren → Samenvatten
- [x] Progressieve moeilijkheid: ⭐ Makkelijk → ⭐⭐ Gemiddeld → ⭐⭐⭐ Uitdagend
- [x] ReviewArena-config heeft vier rounds met 25+25+25+25 = 100 punten
- [x] Vier rounds dekken de kern van J2P2: webpagina-lagen, begrippen, HTML/CSS/JS, programmeervraagstukken
- [x] Hint-systeem aanwezig — na 2 foute pogingen directere hint

**Bronbestanden:** `config/agents/year2.tsx:1378-1423`, `components/missions/templates/review-arena/configs/code-review-2.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw voor een review-missie. De progressieve drie-sterpjes aanpak werkt goed. De ReviewArena-config structureert de review in vier gelijkwaardige rounds, elk met 25 punten. Dit is een faire verdeling die geen enkel onderwerp onevenredig benadrukt.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Review-topics correct — algoritmen, HTML/CSS/JS, app-prototyping, debugging, automatisering, code review
- [x] "DRY-principe" correct benoemd
- [x] "4 stappen van computational thinking" correct (decompositie, patroonherkenning, abstractie, algoritmisch denken)
- [x] "Leg uit hoe je een webpagina bouwt in 3 stappen" is correct en consistent met web-developer missie
- [x] Hint-systeem: "na 2 foute pogingen directere hint" is didactisch correct
- [x] Geen spelfouten gevonden

**Bronbestanden:** `config/agents/year2.tsx:1357-1441`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk correct en consistent met de andere J2P2-missies. De review-topics dekken exact de leerstof van de periode. De verbinding "Welk programmeeronderwerp vind je nog lastig?" in stap 3 is een didactisch waardevolle metacognitieve vraag die leerlingen helpt hun eigen lacunes te identificeren.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` minimaal 500 tekens — ~1600 tekens
- [x] EERSTE BERICHT aanwezig — "Code Review Marathon — check, check, check!"
- [x] STEP_COMPLETE markers aanwezig (3/3)
- [x] SCOPE GUARD aanwezig — terugsturen bij nieuwe stof
- [x] Hint-systeem aanwezig — na 2 foute pogingen directere hint

**Bronbestanden:** `config/agents/year2.tsx:1357-1423`

**Score:** 5 / 5

**Opmerkingen:**
> Alle essentiële elementen aanwezig. Het hint-systeem is een uniek kenmerk van de review-missie: de coach geeft eerst een vage hint, daarna een directere hint, wat goed aansluit bij de didactiek van review en herhaling. De STEP_COMPLETE voor stap 3 ("samenvatting + welk onderwerp nog lastig") is metacognitief sterk.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] ReviewArena-template met vier rounds van elk 25 punten
- [x] Verschillende vraagformaten per round: lagen koppelen, begrippen matchen, HTML/CSS/JS categoriseren, waar/onwaar
- [x] maxScore: 100 met badge-systeem
- [x] Variatie in vraagformaten houdt de review-ervaring interessant

**Score:** 4 / 5

**Opmerkingen:**
> De ReviewArena is een geschikte template voor een afsluitende review. De vier rounds met verschillende vraagformaten zorgen voor variatie. Beperking: review-missies zijn per definitie minder hands-on dan de andere missies — leerlingen beantwoorden vragen in plaats van iets te bouwen of ontwerpen. Dit is inherent aan het review-format.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig (4) — "Code Master" (90%), "Solide Programmeur" (70%), "Op de goede weg" (50%), "Goede poging"
- [x] maxScore: 100 (4×25)
- [x] takeaways aanwezig in ReviewArena-config
- [x] Afsluitingstekst in systemInstruction aanwezig — "Je hebt bewezen dat je de programmeerconcepten beheerst!"

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsstructuur. De badge "Code Master" bij 90% is aspirerend. De afsluitingstekst in de systemInstruction ("Je hebt bewezen...") sluit de periode didactisch goed af.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] SLO 22A (Digitale vaardigheden) — correct, de review bevat HTML/CSS en digitale begrippen
- [x] SLO 22B (Programmeren en computational thinking) — correct, algoritmen en debugging worden getoetst
- [x] Review-missie consolideert de SLO-leerdoelen van de hele periode
- [x] Geen conflict tussen mapping en content

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:118`

**Score:** 5 / 5

**Opmerkingen:**
> Als afsluitende review-missie is de SLO-koppeling correct en breed. De missie toetst de kerndoelen van J2P2 in hun geheel, wat past bij de review-functie. Zowel 22A als 22B worden aangeraakt.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau passend voor J2
- [x] ReviewArena-template heeft structurele toegankelijkheid
- [x] Vragen zijn volledig tekstueel
- [x] Hint-systeem helpt leerlingen die moeite hebben

**Score:** 4 / 5

**Opmerkingen:**
> Vergelijkbaar met andere template-gebaseerde missies. De grijze kleur is minder onderscheidend maar niet problematisch voor toegankelijkheid. Het hint-systeem is een toegankelijkheidsfeature voor leerlingen die moeite hebben.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 4 | ×1 = 4 | Abstract scenario, EERSTE BERICHT goed |
| 2. Visueel | 3 | ×1 = 3 | Grijs en neutraal, mogelijk hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Progressieve moeilijkheid, vier rounds uitgebalanceerd |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Review-topics correct, metacognitieve vraag sterk |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Hint-systeem uniek, alle elementen aanwezig |
| 6. Interactiviteit | 4 | ×1 = 4 | ReviewArena goed, inherent minder hands-on |
| 7. Afronding & feedback | 5 | ×1 = 5 | Code Master badge, afsluitingstekst aanwezig |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 22A en 22B als periodeafsluiting correct |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Hint-systeem als toegankelijkheidsfeature |
| **TOTAAL** | | **51 / 55** | |

### Gewogen totaal

```
(4×1) + (3×1) + (5×2) + (5×2) + (5×1) + (4×1) + (5×1) + (5×1) + (4×1) = 51
Percentage = (51 / 55) × 100% = 92,7%
```

### Verdict

**✅ Klaar voor inzet** (92,7%)

> Een solide afsluitende review-missie die de leerstof van Periode 2 goed consolideert. De progressieve moeilijkheid, het hint-systeem en de vier uitgebalanceerde rounds maken dit een effectieve periodeafsluiting. De grijze visuele presentatie is begrijpelijk voor een review-missie maar minder inspirerend.

---

### Actielijst

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Controleer of `color: '#6B6B66'` in de agent-config hardcoded is; vervang door Tailwind/lab-* klasse. Overweeg een visueel meer uitnodigend kleurthema dat J2P2 als geheel symboliseert. | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 1. Eerste indruk | Voeg een concreet scenario toe ("Je hebt 6 weken programmeren achter de rug. Nu test je jezelf...") voor een meer motiverende eerste indruk. | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
