# Audit — Advanced Code Review (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `advanced-code-review` |
| **Titel** | Code Review: Geavanceerd |
| **Leerjaar & Periode** | Leerjaar 3, Periode 1 |
| **Template-engine** | ReviewArena |
| **SLO-kerndoelen** | 21D (AI), 22B (Programmeren) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en uitnodigend — "Scan je kennis van geavanceerd programmeren!" is actief
- [x] `introDescription` benoemt expliciet de behandelde onderwerpen: ML, REST API's, neurale netwerken, data pipelines
- [x] Emoji 🤖 past bij het AI/programmeer-thema
- [x] Moeilijkheidsgraad "Medium" is passend voor een review-missie (lager dan de vier basis-missies)
- [x] `visualPreview: null` — geen visuele preview, maar de beschrijving compenseert dit

**Bronbestanden:** `components/missions/templates/review-arena/configs/advanced-code-review.ts:3-11`, `config/agents/year3.tsx:450-462`

**Score:** 4 / 5

**Opmerkingen:**
> Goede eerste indruk. Het ontbreken van een `visualPreview` (null) is een kleine tekortkoming — leerlingen zien geen preview van de ReviewArena voordat ze starten. De beschrijving is echter duidelijk genoeg om verwachtingen te stellen.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] ReviewArena-template is een bewezen responsive component
- [x] Geen hardcoded hex-kleuren in de game-content (alleen in badge-kleuren: `#F59E0B`, `#10B981`, etc.)
- [x] Drag-sort, match-pairs, categorize en rapid-fire hebben elk hun eigen visuele lay-out
- [ ] Badge-kleuren zijn hardcoded (`#F59E0B`, `#10B981`, `#6366F1`, `#D97757`) — stijlovertreding

**Bronbestanden:** `components/missions/templates/review-arena/configs/advanced-code-review.ts:11-36`

**Score:** 3 / 5

**Opmerkingen:**
> ReviewArena-template is visueel solide. De hardcoded hex-kleuren in de badge-definities zijn een lichte stijlovertreding, maar minder impactvol dan de grafiek-kleuren in de DataViewer-missies.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw: Stappen ML sorteren → Begrippen koppelen → Categoriseren → Rapid fire
- [x] Vier rondes testen vier verschillende cognitieve niveaus (volgorde, koppeling, categorisatie, snelheid)
- [x] Moeilijkheid "Medium" past bij een review — minder uitdagend dan de basismmissies
- [x] STEP_COMPLETE markers aanwezig (3/3): ronde 1 → ronde 2 fout gevonden → ronde 3 scenario beschreven
- [x] Rapid fire (12 seconden per vraag) past bij een afsluiting
- [x] Supervised vs. unsupervised categorisatie-ronde is een goede conceptuele toets

**Bronbestanden:** `config/agents/year3.tsx:514-517`, `components/missions/templates/review-arena/configs/advanced-code-review.ts:44-159`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende ReviewArena-opzet. De vier ronde-types complementeren elkaar goed: sorteren test proceskennis, koppelen test begripsdefinities, categoriseren test toepassing, rapid fire test automatisering. De "drag-sort" met 6 ML-stappen is een effectieve toets van de procedure-kennis.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] ML-stappenvolgorde correct: probleem → data → features → trainen → evalueren → inzetten
- [x] Begrippenkoppelingen correct: overfitting, REST API, epoch, data pipeline, open source — allemaal correct
- [x] Supervised/unsupervised classificaties correct: spam detectie = supervised, klant segmentatie = unsupervised
- [x] Rapid fire: "Meer data leidt altijd tot beter model" = false ✓, "AI = ML" = false ✓
- [x] Geen aantoonbare spelfouten
- [ ] Rapid fire vraag: "Een neuraal netwerk heeft altijd minstens drie lagen: invoer, verborgen en uitvoer" = true — dit is correct voor standaard netwerken maar niet voor perceptrons/single-layer netwerken; de nuance mist

**Bronbestanden:** `components/missions/templates/review-arena/configs/advanced-code-review.ts:116-158`

**Score:** 4 / 5

**Opmerkingen:**
> Bijna perfect. De meeste vragen zijn correct en goed uitgelegd. De nuance over "altijd minstens drie lagen" is een kleine inhoudelijke vereenvoudiging die voor J3 acceptabel is maar bij kritische leerlingen verwarring kan geven.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim voldoende
- [x] EERSTE BERICHT aanwezig — "REVIEW TERMINAL GEACTIVEERD."
- [x] STEP_COMPLETE markers aanwezig voor alle drie stappen (3/3)
- [x] Toon past bij de rolnaam — "REVIEW TERMINAL" als strenge examinator is een leuke rol voor een review-missie
- [x] SCOPE GUARD: geen antwoorden zonder hint-systeem

**Bronbestanden:** `config/agents/year3.tsx:463-552`

**Score:** 5 / 5

**Opmerkingen:**
> De "REVIEW TERMINAL" rol is een leuke afwisseling na de coachende rollen in de andere missies. Het strenge maar eerlijke examinatorskarakter past goed bij een review-missie.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Vier ronde-types zijn gevarieerd en boeiend
- [x] Drag-sort is hands-on en past goed bij het leren van een volgorde
- [x] Match-pairs test begripskennis effectief
- [x] Rapid fire (12 sec/vraag) brengt spanning in de review
- [x] Categorisatie van 8 supervised/unsupervised-items is een goede dieptetest

**Bronbestanden:** `components/missions/templates/review-arena/configs/advanced-code-review.ts`

**Score:** 5 / 5

**Opmerkingen:**
> De ReviewArena-template blinkt hier uit. De variatie in ronde-types houdt leerlingen actief en vermijdt de eentonigheid van een klassieke toets. De tijdsdruk bij rapid fire is spannend maar niet stressvol (12 seconden is ruim).

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig: 🏆 AI Architect (≥90), 🤖 ML Engineer (≥70), 📚 Op de goede weg (≥50), 💪 Goede poging (≥0)
- [x] `maxScore: 100` is helder (4 rondes × 25 punten)
- [x] `takeaways[]` aanwezig — 5 kernlessen die de hele J3P1-periode samenvatten
- [x] Badgenames zijn thematisch en professioneel

**Bronbestanden:** `components/missions/templates/review-arena/configs/advanced-code-review.ts:11-43`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsset. De takeaways zijn een goede samenvatting van de hele J3P1-periode: ML, REST API, neurale netwerken, data pipeline en overfitting. Dit is didactisch hoogwaardig — de review-missie fungeert ook als synthese.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 21D (AI): ML-stappen, supervised/unsupervised, neurale netwerken zijn expliciet aanwezig
- [x] 22B (Programmeren): REST API, data pipeline, open source workflow zijn programmeerinhoud
- [x] Mapping is consistent met `slo-kerndoelen-mapping.ts` (week 1, J3)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:157`

**Score:** 5 / 5

**Opmerkingen:**
> De review-missie dekt terecht 21D + 22B omdat het alle J3P1-missies integreert. Correcte en goed onderbouwde mapping.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo
- [x] Drag-sort gebruikt labels, niet alleen kleuren
- [x] Match-pairs gebruikt tekst aan beide kanten
- [ ] Badge-kleuren zijn hardcoded hex — lichte stijlovertreding
- [ ] Drag-and-drop interactie is niet toetsenbord-toegankelijk in alle browsers

**Score:** 3 / 5

**Opmerkingen:**
> Drag-and-drop is inherent een muisgebaseerde interactie. Voor leerlingen die geen muis kunnen gebruiken is de drag-sort ronde problematisch. Dit is een template-niveau issue dat alle ReviewArena-missies treft.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 4 | ×1 = 4 | Geen visualPreview, maar duidelijk |
| 2. Visueel | 3 | ×1 = 3 | Badge hex-kleuren, template solide |
| 3. Didactische flow | 5 | ×2 = 10 | Vier complementaire rondes |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Bijna perfect, kleine nuance over lagen |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geconfigureerd |
| 6. Interactiviteit | 5 | ×1 = 5 | Gevarieerde rondes, rapid fire |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges en takeaways compleet |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21D+22B aantoonbaar aanwezig |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Drag-drop niet toetsenbord-toegankelijk |
| **TOTAAL** | | **50 / 55** | |

### Gewogen totaal

```
(4×1) + (3×1) + (5×2) + (4×2) + (5×1) + (5×1) + (5×1) + (5×1) + (3×1) = 50
Percentage = (50 / 55) × 100% = 90,9%
```

### Verdict

**✅ Klaar** (90,9% — ruim boven de 80% drempel)

> Sterke review-missie die J3P1 goed afsluit. Geen blokkerende issues. Drag-drop toegankelijkheid is een template-niveau probleem.

---

### Actielijst

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 9. Toegankelijkheid | Drag-sort ronde: voeg toetsenbord-alternatief toe (bijv. omhoog/omlaag pijltjes) of een fallback multiple-choice versie | Medium |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 1. Eerste indruk | Voeg een `visualPreview` toe aan de agent-config voor een betere eerste indruk |
| 2 | 4. Inhoudelijke correctheid | Rapid fire vraag over "altijd minstens drie lagen" nuanceren: "een feed-forward neuraal netwerk heeft minstens twee lagen (input + output)" |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
