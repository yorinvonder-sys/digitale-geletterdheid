# Audit — Review Week 3 (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `review-week-3` |
| **Titel** | De Ethische Raad |
| **Leerjaar & Periode** | Leerjaar 1, Periode 4 |
| **Template-engine** | DebateArena (stakeholders, posities, argumentatie, reflectie) |
| **SLO-kerndoelen** | 23C, 21D |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` "De Ethische Raad" is intrigerend en thematisch sterk
- [x] `introDescription` beschrijft het dilemma concreet (AI-project: foto's scrapen, niveaumodel, eindverslagen)
- [x] `introFeatures` bevat 5 stappen die het debatproces helder uiteenzetten
- [x] Moeilijkheidsgraad "Medium" past bij het debatformat voor J1 leerlingen

**Bronbestanden:** `components/missions/templates/debate-arena/configs/review-week-3.ts:1-16`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. Het dilemma is direct herkenbaar voor J1-leerlingen: een schoolteam dat een AI-systeem bouwt met echte ethische problemen. De vijf introFeatures leggen het debatproces helder uit. De justitie-sfeer sluit aan bij de "Ethische Raad" branding.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Kleur `#E8956F` (warm oranje) in het agent-object is herkenbaar en passend voor een ethisch debat
- [x] Introductie via `introEmoji: '⚖️'` — duidelijk symbool voor rechtspraak/ethiek
- [ ] Hardcoded badge-kleuren (`#E8956F`, `#D97757`, `#10B981`, `#6B6B66`) in de DebateArena-config
- [x] Visuele preview van het agent-object gebruikt een externe Unsplash-foto (gerechtsgebouw) — no-brand, contextgevoelig

**Bronbestanden:** `config/agents/year1.tsx:2955-2960`, `components/missions/templates/debate-arena/configs/review-week-3.ts:95-121`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel coherent. De warme oranje kleurstelling past bij het ethische debat-thema. De briefingImage is een externe Unsplash-URL, wat een beschikbaarheidsrisico oplevert bij netwerkstoringen — beter zou een lokale asset zijn.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] DebateArena-flow: standpunten lezen → positie kiezen → argumenten bouwen → reageren op tegenargument → reflecteren
- [x] Vier gedetailleerde stakeholders met elk een eigen perspectief en kernargument
- [x] Vier debatposities met beschrijvingen bieden voldoende keuzeruimte
- [x] `argumentPrompts` geven de leerling een structuur voor het opbouwen van argumenten
- [x] `reflectionQuestions` stimuleren dieper denken na het debat
- [x] `counterArgument` is uitdagend maar realistisch ("Als we dit afkeuren, sturen we de boodschap dat technologie niet mag worden uitgeprobeerd")

**Bronbestanden:** `components/missions/templates/debate-arena/configs/review-week-3.ts:62-93`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische flow. Het debatformat (standpunten lezen → positie kiezen → argumenteren → tegenargument weerleggen → reflecteren) is een bewezen leerstrategie voor ethiekonderwijs. De vier stakeholders zijn evenwichtig gekozen: twee die voor innovatie pleiten, twee die grenzen trekken. De counterArgument is goed gekozen — het is de meest verleidelijke tegenargumentatie die leerlingen moeten leren weerleggen.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en dilemma's inhoudelijk?

**Checkpunten:**
- [x] Privacy-dossier (foto's scrapen) is inhoudelijk correct — AVG-overtreding bij scrapen zonder toestemming
- [x] Bias-dossier (trainingsdata uit 1950) is een herkenbaar en reëel AI-probleem
- [x] Integriteits-dossier (ChatGPT als ghostwriter) is actueel en relevant
- [x] De stakeholders vertegenwoordigen alle relevante perspectieven (leerling, projectleider, ethicus, docent)
- [x] Dr. Okonkwo's drie toetsen (legaal, eerlijk, transparant) zijn een correcte ethische framework
- [x] Taalgebruik is B1/B2-niveau, passend voor einde J1 (leerlingen zijn dan verder in taalvaardigheid)

**Bronbestanden:** `components/missions/templates/debate-arena/configs/review-week-3.ts:20-60`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De drie dossiers dekken drie verschillende dimensies van AI-ethiek (privacy, bias, integriteit) die ook terugkomen in het bredere curriculum. De connectie met het eindproject ("Week 4") maakt het voor de leerling concreet en relevant. De AVG-kennis en bias-concepten bouwen voort op eerdere missies in J1.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede begeleider?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim >1500 tekens
- [x] EERSTE BERICHT aanwezig: "Welkom, adviseur. We staan aan de vooravond van de lancering."
- [x] STEP_COMPLETE markers zijn aanwezig maar aangepast: "ZITTING GESLOTEN" als eindtrigger
- [x] Verificatievragen per dilemma met expliciete check-criteria ("Moet 'Privacy', 'Toestemming'...")
- [x] Toon is wijs en gezaghebbend, past bij "Voorzitter Ethische Raad"
- [x] Anti-farmingbescherming via SYSTEM_INSTRUCTION_SUFFIX
- [x] Drie dossiers met duidelijke structuur (STAP 2, 3, 4)

**Bronbestanden:** `config/agents/year1.tsx:2975-3023`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende systemInstruction. De verificatievragen per dilemma zijn goed geconstrueerd — ze checken specifieke kernbegrippen die de leerling moet benoemen. De "ZITTING GESLOTEN" afsluiting is creatief en past bij het roleplay-karakter van de missie. Dit is de best geconstrueerde systemInstruction van de vier J1P4-missies.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] DebateArena-template heeft een rijke interactieve structuur (stakeholders lezen, positie kiezen, argumenten invoeren, tegenargument weerleggen, reflecteren)
- [x] Vier debatposities met omschrijvingen geven voldoende keuzeruimte
- [x] `argumentPrompts` geven de leerling concrete aanwijzingen voor argumentatieopbouw
- [x] `reflectionQuestions` stimuleren hogere-orde denken (metacognitie)
- [x] Twee reflectievragen zijn goed gekozen en genuanceerd

**Bronbestanden:** `components/missions/templates/debate-arena/configs/review-week-3.ts:62-93`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende interactiviteit. Het DebateArena-format is bijzonder geschikt voor ethiek-onderwijs. De stakeholders-cards geven leerlingen meerdere perspectieven om te verkennen. De positie-keuze met omschrijving maakt het debat concreet. Dit is de interactief rijkste missie van J1P4.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Zijn badges logisch?

**Checkpunten:**
- [x] `maxScore: 100` gedefinieerd
- [x] 4 badges gedefinieerd: Debatmeester (80+), Scherp Denker (60+), Goed Bezig (40+), Aan de Start (0+)
- [x] `takeaways[]` bevat 4 kernlessen die de ethische inzichten samenvatten
- [x] "ZITTING GESLOTEN" als expliciete afsluiting van de AI-coach-sessie

**Bronbestanden:** `components/missions/templates/debate-arena/configs/review-week-3.ts:95-127`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende afronding. De takeaways zijn concreet en memorabel: "Openbaar betekent niet automatisch vrij te gebruiken", "Drie ethische toetsen: Is het legaal? Is het eerlijk? Is het transparant?" zijn zinnen die leerlingen mee kunnen nemen. De badges zijn goed genaamd voor het debatformat.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt?

**Checkpunten:**
- [x] SLO 23C (Maatschappij en ethiek) sluit aan — leerling debatteert over AI-ethiek in maatschappelijke context
- [x] SLO 21D (AI) sluit aan — AI-bias is een kernthema
- [x] slo-kerndoelen-mapping.ts: `review-week-3` → `['23C', '21D']` — correct
- [x] De missie consolideert ethiekkennis uit het hele J1-curriculum (privacy uit P3, AI uit P2)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:83`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De review-week-3 is niet alleen een herhaling maar een synthese: leerlingen passen kennis over privacy, AI-bias en digitale integriteit toe in een realistisch debatscenario. De SLO-doelen 23C en 21D worden beide actief bediend.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau is B1/B2 — passend voor einde J1 (leerlingen zijn qua leesontwikkeling verder)
- [x] Stakeholders-teksten zijn helder en niet te complex
- [ ] "Toestemming is een grondrecht" kan abstract zijn voor 12-13 jarigen — concrete vertaling zou helpen
- [x] Debatposities hebben omschrijvingen die de keuze verduidelijken
- [x] Meerdere argumentprompts bieden structuur voor leerlingen die moeite hebben met vrij argumenteren

**Bronbestanden:** `components/missions/templates/debate-arena/configs/review-week-3.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Goede toegankelijkheid. Het DebateArena-format is inclusief door de stakeholders-perspectieven te geven (leerlingen hoeven niet zelf alles te bedenken). De argumentprompts helpen leerlingen die moeite hebben met redeneren. Kleine aanmerking: juridisch taalgebruik ("grondrecht", "aansprakelijk") kan 12-13 jarigen afschrikken.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Intrigerend dilemma, helder debatformaat |
| 2. Visueel | 4 | ×1 = 4 | Externe briefingImage, hardcoded hex badges |
| 3. Didactische flow | 5 | ×2 = 10 | Uitstekend debatformat, goede scaffolding |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Inhoudelijk correct, reëel en actueel |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | EERSTE BERICHT + verificatievragen aanwezig |
| 6. Interactiviteit | 5 | ×1 = 5 | Rijkste interactie van J1P4 |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges + takeaways uitstekend |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23C + 21D correct, synthese van J1 |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Juridisch taalgebruik soms abstract |
| **TOTAAL** | | **49 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (4×1) = 49
Percentage = (49 / 55) × 100% = 89,1%
```

### Verdict

**✅ Klaar voor inzet** (89,1% — ruim boven de 80% drempel)

> De sterkste missie van J1P4 en een van de best geconstrueerde missies in het hele J1-curriculum. De combinatie van DebateArena-template met een inhoudelijk rijke systemInstruction maakt dit een didactisch uitstekende afsluiter van het eindproject.

---

### Actielijst

#### Verbeterpunten (score 4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Externe briefingImage (Unsplash) vervangen door lokale asset | Medium |
| 2 | 9. Toegankelijkheid | Juridisch taalgebruik ("grondrecht", "aansprakelijk") vereenvoudigen of uitleggen | Laag |
| 3 | 2. Visueel | Hardcoded hex-kleuren in badges vervangen door `lab-*` tokens | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
