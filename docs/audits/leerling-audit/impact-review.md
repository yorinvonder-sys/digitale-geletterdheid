# Audit — Impact Review (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `impact-review` |
| **Titel** | Impact Review |
| **Leerjaar & Periode** | Leerjaar 3, Periode 3 (J3P3) |
| **Template-engine** | ReviewArena (AI-chat via agent systemInstruction) |
| **SLO-kerndoelen** | 23C (Maatschappij) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Wat is de impact van technologie?"
- [x] `introDescription` is duidelijk — vier ronden, kennis over maatschappelijke gevolgen
- [x] Emoji (🌍) past bij het thema
- [x] Het archief-hack scenario in de agent is creatief en motiverend
- [x] Moeilijkheid "Medium" is correct voor een review-missie

**Bronbestanden:** `components/missions/templates/review-arena/configs/impact-review.ts:1-9`, `config/agents/year3.tsx:1623-1742`

**Score:** 4 / 5

**Opmerkingen:**
> Goede eerste indruk. Het "Impact Archief gehackt" scenario is creatief en geeft een motiverende context. De ReviewArena-intro is wat korter dan de BuilderCanvas/DebateArena-intro's, wat past bij de herhaling-functie van deze missie. Licht punt: de introDescription vermeldt "vier ronden" maar geeft geen preview van wat die ronden inhouden.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Kleuren via lab-* tokens — hardcoded hex in badges (`#F59E0B`, `#10B981`, `#6366F1`, `#D97757`)
- [x] ReviewArena-template biedt duidelijke ronden-structuur
- [x] Drag-sort visualisatie in ronde 1 is intuïtief
- [x] Match-pairs in ronde 2 is visueel onderscheidend
- [x] Categorize in ronde 3 is helder
- [x] Rapid-fire in ronde 4 heeft timer

**Bronbestanden:** `components/missions/templates/review-arena/configs/impact-review.ts:11-35`

**Score:** 4 / 5

**Opmerkingen:**
> De ReviewArena-template biedt vier visueel verschillende interactievormen die de missie afwisselend houden. De hardcoded hex-kleuren in de badges zijn een code-kwaliteitsissue. De timer in de rapid-fire ronde (12 seconden per vraag) is visueel aanwezig — controleer of dit ook in de template geïmplementeerd is.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Drag-sort (ordenen) → Match-pairs (koppelen) → Categorize (classificeren) → Rapid-fire (reproduceren)
- [x] Oplopende cognitieve complexiteit (Bloom: onthouden → begrijpen → toepassen → evalueren)
- [x] Moeilijkheid "Medium" past bij een review-missie na de J3P3-periode
- [x] Vier ronden zijn elk 25 punten — evenwichtige verdeling
- [x] Rapid-fire sluit af met synthetische vragen (Waar/Onwaar)

**Bronbestanden:** `components/missions/templates/review-arena/configs/impact-review.ts:44-160`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw voor een review-missie. De vier ronden testen progressief hoger-orde denken: van ordenen (drag-sort) naar koppelen (match-pairs) naar classificeren (categorize) naar beoordelen (rapid-fire Waar/Onwaar). Dit is een correcte implementatie van Bloom's taxonomie. De inhoud in alle vier ronden sluit aan op de J3P3-periode.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Drag-sort volgorde correct — technologie beschrijven → gebruikers → positief → negatief → ethiek → beleid
- [x] Match-pairs zijn feitelijk correct — gezichtsherkenning = privacy-inbreuk is correct
- [x] Categorize: "AI-diagnose helpt artsen" als Kans is correct
- [x] Rapid-fire: "De digitale kloof bestaat alleen in ontwikkelingslanden" is Onwaar — correct
- [x] Rapid-fire: "EU AI Act verplicht transparantie" is Waar — correct
- [x] Alle explanations zijn feitelijk correct
- [x] Geen spelfouten gevonden

**Bronbestanden:** `components/missions/templates/review-arena/configs/impact-review.ts:44-159`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. Alle acht Waar/Onwaar-vragen zijn feitelijk correct. De match-pairs zijn zorgvuldig geformuleerd zonder ambiguïteit. De categorize-items zijn evenwichtig (4 kansen, 4 risico's). De takeaways sluiten aan op de inhoud van de vier ronden.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ~2200 tekens
- [x] EERSTE BERICHT aanwezig — "REVIEW-BOT GEACTIVEERD" met directe Ronde 1-vraag
- [x] STEP_COMPLETE markers aanwezig (3/3) — ronde 1, ronde 2, ronde 3
- [x] Hint-systeem aanwezig — progressief HINT → GROTE HINT
- [x] Scope Guard aanwezig — "ARCHIEF HERSTEL IN VOORTGANG"
- [x] De toon (Review-Bot, archief-hack) is aantrekkelijk voor de doelgroep

**Bronbestanden:** `config/agents/year3.tsx:1643-1723`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coaching structuur voor een review-missie. Het HINT-systeem (2 foute pogingen → GROTE HINT) is pedagogisch correct — het geeft de leerling kansen om zelf te redeneren voor het antwoord wordt gegeven. De progressieve rondes (⭐ → ⭐⭐ → ⭐⭐⭐) zijn duidelijk en motiverend. De gamification (Review-Bot, archief-hack) maakt herhalen aantrekkelijker.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Vier verschillende interactievormen houden de missie afwisselend
- [x] Drag-sort is een actieve ordening-interactie
- [x] Match-pairs vereist actief nadenken over verbanden
- [x] Rapid-fire met timer creëert urgentie
- [x] Alle vier interactievormen passen bij de leerdoelen van J3P3

**Score:** 5 / 5

**Opmerkingen:**
> De ReviewArena-template blinkt uit in interactiviteit. De vier verschillende interactievormen voorkomen verveling tijdens een herhalings-missie. De timer in rapid-fire (12 sec/vraag) is kort genoeg om urgentie te creëren maar lang genoeg voor Waar/Onwaar-beoordeling. De combinatie van actieve interactie + AI-coach is optimaal voor een review-context.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig — "Impact Analist" (≥90%), "Maatschappelijk Bewust" (≥70%), "Op de goede weg" (≥50%), "Goede poging" (≥0%)
- [x] maxScore: 100 (4×25 punten per ronde)
- [x] `takeaways[]` aanwezig — 5 kernlessen over digitale kloof, algoritmen, EU AI Act, ethiek
- [x] Badgenamen zijn thematisch passend
- [x] Evenwichtige puntenverdeling (25 per ronde)

**Bronbestanden:** `components/missions/templates/review-arena/configs/impact-review.ts:10-43`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke afronding. De gelijke puntenverdeling (25 per ronde) is eerlijk. De takeaways vatten de kernlessen van J3P3 adequaat samen. De badge "Impact Analist" is ambitieus maar realistisch voor 90%.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 23C (Maatschappij) aanwezig — alle vier ronden toetsen maatschappelijke impact van technologie
- [x] Mapping correct — `['23C']` in slo-kerndoelen-mapping.ts
- [x] Review-missie: doel is herhalen en consolideren van J3P3-leerdoelen
- [x] EU AI Act, digitale kloof, ethiek, filterbubble zijn alle J3P3-begrippen

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:179`

**Score:** 5 / 5

**Opmerkingen:**
> Correcte SLO-aansluiting voor een review-missie. 23C wordt volledig ingevuld via de herhaling van alle J3P3-kernconcepten. De missie doet precies wat ze claimt: consolideren van kennis over maatschappelijke impact van technologie.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo
- [x] Drag-sort heeft tekstlabels — niet alleen visueel
- [x] Match-pairs heeft tekstlabels — niet alleen visueel
- [x] Categorize heeft tekstlabels — niet alleen visueel
- [ ] Rapid-fire timer: visueel-only? Controlepunt voor screenreader-toegankelijkheid
- [ ] Kleurcontrast formeel niet geverifieerd

**Score:** 4 / 5

**Opmerkingen:**
> De ReviewArena-template is over het algemeen goed toegankelijk — alle interactievormen hebben tekstlabels. Aandachtspunt: de timer in rapid-fire moet ook als tekst weergegeven worden (bijv. "8 seconden resterend") voor screenreader-gebruikers. Dit is een template-level fix.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 4 | ×1 = 4 | Creatief archief-hack scenario |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded hex, vier goede interactievormen |
| 3. Didactische flow | 5 | ×2 = 10 | Bloom-taxonomie, uitstekende opbouw |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Alle vragen feitelijk correct |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | HINT-systeem, STEP_COMPLETE (3/3) |
| 6. Interactiviteit | 5 | ×1 = 5 | Vier afwisselende interactievormen |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, takeaways, evenwichtige scores |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23C volledig ingevuld |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Timer-toegankelijkheid aandachtspunt |
| **TOTAAL** | | **52 / 55** | |

### Gewogen totaal

```
(4×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (4×1) = 52
Percentage = (52 / 55) × 100% = 94,5%
```

### Verdict

**✅ Klaar** (94,5% — ruim boven de 80% drempel)

> Een didactisch sterk uitgewerkte review-missie die de J3P3-leerdoelen op vier cognitief oplopende niveaus toetst. De ReviewArena-template met vier interactievormen is uitstekend ingezet. Het HINT-systeem in de AI-coach is pedagogisch correct. Direct inzetbaar in de pilot als afsluitende review van J3P3.

---

### Actielijst

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 9. Toegankelijkheid | Rapid-fire timer ook als tekst weergeven voor screenreaders (template-fix) | Medium |
| 2 | 2. Visueel | Hardcoded hex in badges vervangen door `lab-*` tokens | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
