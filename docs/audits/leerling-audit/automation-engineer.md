# Audit — Automation Engineer (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `automation-engineer` |
| **Titel** | Automation Engineer |
| **Leerjaar & Periode** | Leerjaar 2, Periode 2 |
| **Template-engine** | BuilderCanvas (enableChat: true) |
| **SLO-kerndoelen** | 22B, 21A |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Automatiseer saaie taken"
- [x] `introDescription` concreet — conciërge verstuurt 200 mails handmatig
- [x] Moeilijkheidsgraad "Medium" passend
- [x] EERSTE BERICHT uitnodigend — "Welkom bij Automation HQ!"

**Bronbestanden:** `config/agents/year2.tsx:933-1014`, `components/missions/templates/builder-canvas/configs/automation-engineer.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Het conciërgescenario (200 mails per week) is een uitstekend gekozen context: het is realistisch, het motiveert leerlingen om het probleem op te lossen, en het maakt direct duidelijk waarom automatisering nuttig is. De EERSTE BERICHT-vraag ("welke taak vind jij ontzettend saai om steeds opnieuw te doen?") is persoonlijk en activerend.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Amber/geel kleurthema past bij "energie" en automatisering
- [x] Bliksem-icoon (Zap) is thematisch correct
- [ ] Hardcoded hex `#F59E0B` in visualPreview
- [x] BuilderCanvas-template biedt structurele consistentie

**Bronbestanden:** `config/agents/year2.tsx:945-951`

**Score:** 4 / 5

**Opmerkingen:**
> Functioneel en thematisch consistent. Hardcoded hex `#F59E0B` is een minor issue. De amber kleur associeert goed met "Automation HQ" en energie.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Identificeren → Ontwerpen → Testen is correcte programmeermethode
- [x] "Begin ALTIJD met een eenvoudig voorbeeld (5 items, niet 500)" is uitstekend pedagogisch principe
- [x] Vier fasen in BuilderCanvas: "Automatiseringskandidaat identificeren", "Algoritme ontwerpen", "Script-structuur uitwerken", "Script testen en valideren"
- [x] SCOPE GUARD: terugsturen bij complexe frameworks
- [x] Moeilijkheidsgraad "Medium" correct

**Bronbestanden:** `config/agents/year2.tsx:966-995`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. Het principe "begin met 5 items, niet 500" is didactisch sterk — leerlingen leren schalen door eerst op kleine schaal te oefenen. De "wow-factor" aanpak (handmatig 10 minuten vs. script 1 seconde) motiveert leerlingen om door te zetten.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Loops correct uitgelegd — for, while als herhalingsprincipes
- [x] Functies correct benoemd als "herbruikbare code"
- [x] Input/output correct benoemd
- [x] Loop-analogie ("doe dit 50 keer") is correct en begrijpelijk
- [x] Geen spelfouten gevonden

**Bronbestanden:** `config/agents/year2.tsx:959-994`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk correct. De loops worden correct uitgelegd als "herhaal-constructies". De STEP_COMPLETE criteria zijn helder: stap 1 identificeert de taak, stap 2 ontwerpt de loop/script, stap 3 vergelijkt handmatig vs. automatisch met tijdwinst. Dit zijn toetsbare, concrete criteria.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` minimaal 500 tekens — ~1200 tekens
- [x] EERSTE BERICHT aanwezig — "Welkom bij Automation HQ!"
- [x] STEP_COMPLETE markers aanwezig (3/3)
- [x] SCOPE GUARD aanwezig
- [x] Efficiënte toon ("waarom 100 keer klikken als...") past bij het thema

**Bronbestanden:** `config/agents/year2.tsx:952-995`

**Score:** 5 / 5

**Opmerkingen:**
> Alle essentiële elementen aanwezig. De STAP-VOLTOOIING voor stap 3 is bijzonder goed: "leerling vergelijkt de automatisering met de handmatige aanpak en beschrijft de tijdwinst" — dit sluit aan bij het kernlesdoel van de missie.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] BuilderCanvas met AI-chat is geschikt voor script-ontwikkeling
- [x] Vier fasen bieden duidelijke progression
- [x] Leerlingen schrijven scripts via chat-dialoog
- [x] maxScore: 100 met badge-systeem

**Score:** 4 / 5

**Opmerkingen:**
> De BuilderCanvas is een goede keuze voor scriptontwikkeling. Leerlingen ontwerpen hun automatiserings-script stap voor stap via de chat. Beperking: er is geen echte scriptrunner beschikbaar — leerlingen kunnen hun code niet direct uitvoeren. Dit is een bekende beperking van de template.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig (4) — "Script Wizard" (90%), "Automation Engineer" (70%), "Loop Leerling" (50%), "Op weg"
- [x] maxScore: 100
- [x] takeaways aanwezig in BuilderCanvas-config
- [x] "Script Wizard" is aspirerend voor de doelgroep

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsstructuur. "Script Wizard" is een aspirerende badge. De vier fasen geven duidelijke voortgangsindicators.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] SLO 22B (Programmeren) — correct, loops en scripts zijn kern van 22B
- [x] SLO 21A (Digitale basisvaardigheden) — correct, systeemautomatisering valt hieronder
- [x] Mapping-opmerking ("scripts schrijven + systeemautomatisering") is een correct onderscheid
- [x] Geen conflict tussen mapping en content

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:112`

**Score:** 5 / 5

**Opmerkingen:**
> Beide kerndoelen worden feitelijk aangeraakt. 22B via loops en scriptontwerp; 21A via het begrijpen van systeemautomatisering als digitale vaardigheid. De mapping is correct en consistent.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau passend voor J2
- [x] Chat-gebaseerd — volledig tekstueel toegankelijk
- [x] Humor in de toon is inclusief ("Eén keer is leuk, twee keer is oké, drie keer? Tijd voor een script!")
- [x] Analogieën zijn begrijpelijk voor diverse leerprofielen

**Score:** 5 / 5

**Opmerkingen:**
> De humor in de instructie ("je haat herhaling op een grappige manier") en de directe analogieën maken de missie toegankelijk en aantrekkelijk voor diverse leerprofielen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Conciërgescenario motiverend, persoonlijke vraag |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded hex, amber thema correct |
| 3. Didactische flow | 5 | ×2 = 10 | Begin klein, schaal op — didactisch sterk |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Loops correct, tijdwinst als leerdoel |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Alle elementen aanwezig |
| 6. Interactiviteit | 4 | ×1 = 4 | BuilderCanvas goed, geen scriptrunner |
| 7. Afronding & feedback | 5 | ×1 = 5 | Script Wizard badge, maxScore compleet |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 22B en 21A beiden gedekt |
| 9. Toegankelijkheid | 5 | ×1 = 5 | Humor inclusief, analogieën toegankelijk |
| **TOTAAL** | | **53 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (5×1) + (5×1) + (5×1) = 53
Percentage = (53 / 55) × 100% = 96,4%
```

### Verdict

**✅ Klaar voor inzet** (96,4%)

> Een sterke missie die het nut van automatisering op een motiverende, herkenbare manier overbrengt. Het conciërgescenario, de "begin klein" pedagogiek en de volledige afrondingsstructuur maken dit een solide J2P2-missie.

---

### Actielijst

#### Verbeterpunten (nice-to-have)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex `#F59E0B` vervangen door lab-* token | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
