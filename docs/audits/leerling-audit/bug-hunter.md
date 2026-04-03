# Audit — Bug Hunter (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `bug-hunter` |
| **Titel** | Bug Hunter |
| **Leerjaar & Periode** | Leerjaar 2, Periode 2 |
| **Template-engine** | SimulationLab |
| **SLO-kerndoelen** | 22B |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig via SimulationLab-template
- [x] `introDescription` concreet — schoolwebsite crasht bij roosterknop
- [x] Moeilijkheidsgraad "Hard" zichtbaar en passend
- [x] EERSTE BERICHT meteen actief — "Bug Bounty Lab is open!"

**Bronbestanden:** `config/agents/year2.tsx:849-931`, `components/missions/templates/simulation-lab/configs/bug-hunter.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Het schoolwebsite-crashscenario is herkenbaar en de detective-metafoor werkt goed voor de doelgroep. Het EERSTE BERICHT stelt direct een activerende vraag ("Wat is het eerste wat jij doet als je een onbekende bug ziet?"). De moeilijkheidsgraad "Hard" is correct gezien het debuggen van code.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] SimulationLab-template biedt structurele consistentie
- [x] Rood kleurthema past bij het "gevaar"/bug-thema
- [ ] Hardcoded hex `#DC2626` in visualPreview
- [x] Bug-icoon visueel herkenbaar

**Bronbestanden:** `config/agents/year2.tsx:861-867`

**Score:** 4 / 5

**Opmerkingen:**
> Functioneel en consistent via de template. Hardcoded hex `#DC2626` is een minor issue. De rode kleur is thematisch correct (bugs = gevaar) maar de visualPreview is functioneel en niet bijzonder creatief vergeleken met network-navigator.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Reproduceren → Oorzaak → Fix is de standaard debug-methode
- [x] SimulationLab-simulaties bouwen op deze stappen voort
- [x] "Geef NOOIT direct de oplossing" is een correct pedagogisch principe voor debugging
- [x] Detectiemetafoor ("Hmm, interessant spoor...") houdt leerlingen in de juiste mindset
- [x] moeilijkheidsgraad "Hard" correct voor J2

**Bronbestanden:** `config/agents/year2.tsx:882-912`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drie stappen (reproduceren, lokaliseren, fixen) zijn de standaard professionele debug-methode. De instructie "Geef hints, NIET direct het antwoord" is pedagogisch correct voor computational thinking. De detective-metafoor ("We lopen het spoor terug") past perfect bij de debug-mindset.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Debugtechnieken correct — foutmelding lezen, code doorlopen (tracing), console.log
- [x] Veelvoorkomende bugs correct benoemd — typos, ontbrekende haakjes, verkeerde variabelen
- [x] `==` vs `===` als voorbeeldbug is technisch correct en relevant
- [x] Taalgebruik passend voor J2
- [x] Geen spelfouten gevonden

**Bronbestanden:** `config/agents/year2.tsx:875-911`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De voorbeelden (== vs ===, ontbrekende puntkomma) zijn realistische en veelvoorkomende fouten voor beginnende programmeurs. De STAP-VOLTOOIING criteria zijn goed geformuleerd: stap 1 vereist symptoom + situatie, stap 2 oorzaak + uitleg, stap 3 fix + test + uitleg.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` minimaal 500 tekens — ~1300 tekens
- [x] EERSTE BERICHT aanwezig — "Bug Bounty Lab is open!"
- [x] STEP_COMPLETE markers aanwezig (3/3)
- [x] SCOPE GUARD aanwezig — herschrijven terugsturen naar begrip
- [x] Detective-toon is consistent en passend

**Bronbestanden:** `config/agents/year2.tsx:868-912`

**Score:** 5 / 5

**Opmerkingen:**
> Alle essentiële elementen aanwezig. De STEP_COMPLETE criteria zijn expliciet en verifieerbaar. De SCOPE GUARD ("Even geduld — laten we eerst begrijpen wát er mis gaat") is precies juist voor dit onderwerp. Detective-toon ("gevonden! Goed speurwerk!") is motiverend.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] SimulationLab biedt drie simulaties met buggy code-scenario's
- [x] Drie simulaties met maxScore 30+40+30 = 100
- [x] Multiple-choice vragen toetsen begrip van debuggen
- [x] Visuele simulaties (meter, barchart, comparison) passen bij de debug-context

**Score:** 5 / 5

**Opmerkingen:**
> De SimulationLab-aanpak voor debugging is didactisch sterk. Leerlingen kunnen systematisch bugs analyseren via de simulaties en de vragen toetsen of ze de oorzaken begrijpen. De drie simulaties bieden voldoende variatie in debugscenario's.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig in SimulationLab-config
- [x] maxScore: 100 (30+40+30)
- [x] takeaways aanwezig
- [x] Scoredrempels realistisch

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsstructuur via SimulationLab-template. Badges en takeaways zijn aanwezig in de config.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] SLO 22B (Programmeren en debuggen) — correct
- [x] Debuggen is expliciet onderdeel van 22B
- [x] Geen conflict tussen mapping en content

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:111`

**Score:** 5 / 5

**Opmerkingen:**
> Debugging is kernonderdeel van SLO 22B. De missie leert systematisch debuggen, wat volledig aansluit bij de kerndoelen.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau passend voor J2
- [x] SimulationLab-template heeft structurele toegankelijkheid
- [x] Multiple-choice vragen volledig tekstueel
- [x] Detective-taal is begrijpelijk en niet exclusief

**Score:** 4 / 5

**Opmerkingen:**
> Vergelijkbaar met algorithm-architect. De barchart-visualisatie in simulaties kan kleur als primaire drager gebruiken. De rest is goed toegankelijk.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 4 | ×1 = 4 | Schoolwebsite-scenario goed, EERSTE BERICHT activerend |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded hex, template solide |
| 3. Didactische flow | 5 | ×2 = 10 | Reproduceren→Lokaliseren→Fixen is professioneel |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | == vs === correct, tracing correct |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Alle elementen, detective-toon consistent |
| 6. Interactiviteit | 5 | ×1 = 5 | SimulationLab drie simulaties uitstekend |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, maxScore, takeaways aanwezig |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 22B volledig gedekt |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Barchart kleurafhankelijk |
| **TOTAAL** | | **53 / 55** | |

### Gewogen totaal

```
(4×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (4×1) = 53
Percentage = (53 / 55) × 100% = 96,4%
```

### Verdict

**✅ Klaar voor inzet** (96,4%)

> Een sterke missie die debuggen als professie behandelt. De detective-metafoor, de drie-stappen debugmethode en de complete SimulationLab-structuur maken dit tot een solide J2P2-missie.

---

### Actielijst

#### Verbeterpunten (nice-to-have)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex `#DC2626` vervangen door lab-* token | Laag |
| 2 | 9. Toegankelijkheid | Barchart labels aanvullen met numerieke waarden | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
