# Audit — Media Mixer / media-review (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `media-review` |
| **Titel** | De Media Mixer |
| **Leerjaar & Periode** | Leerjaar 2, Periode 3 |
| **Template-engine** | review-arena |
| **SLO-kerndoelen** | 22A (Digitale producten), 21B (Media & Informatie), 23B (Digitaal welzijn) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en aansprekend — "De Media Mixer" is creatief en thematisch
- [x] `introDescription` is duidelijk — "Test je kennis van digitale media en creatie uit deze periode"
- [x] `problemScenario` is motiverend — alle mediaconcepten zijn door de war, jij schept orde
- [x] Moeilijkheidsgraad passend — "Medium" klopt voor een review-missie
- [x] `examplePrompt` is ultrahelder — "Start de review!" is de enige logische actie
- [ ] `visualPreview: null` — er is geen visuele preview voor deze missie

**Bronbestanden:** `config/agents/year2.tsx:1992-2004`

**Score:** 4 / 5

**Opmerkingen:**
> Goede eerste indruk maar het ontbreken van een visual preview (`visualPreview: null`) is een gemiste kans. Dit is de afsluitmissie van Periode 3 en zou een "finale"-gevoel moeten uitstralen. De studio-manager persona en het "door de war" scenario zijn creatief. De kleur `#6B6B66` (grijs) past bij een professionele studio maar is minder uitnodigend dan andere missiekleuren.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [ ] `visualPreview: null` — geen preview aanwezig
- [ ] Kleur `#6B6B66` is hardcoded grijze hex-waarde
- [ ] Geen gradient of visueel element — de missie heeft geen eigen visuele identiteit
- [x] Geen afleidende elementen — de review-arena template heeft een eigen stijl
- [ ] Voor een "finale" missie ontbreekt visueel impact

**Bronbestanden:** `config/agents/year2.tsx:1997-2004`

**Score:** 2 / 5

**Opmerkingen:**
> Significant visueel tekort. Het ontbreken van een visual preview is een kwaliteitsprobleem: alle andere J2P3-missies hebben een herkenbare preview die het thema communiceert. Voor de afsluitmissie van een periode is dit extra opvallend. De grijze kleur (`#6B6B66`) is ook het minst uitnodigend in de periode.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Progressieve moeilijkheid — ⭐ → ⭐⭐ → ⭐⭐⭐ is helder gecommuniceerd
- [x] Elke challenge bouwt voort op de vorige — begrippen → analyse → combineren
- [x] Moeilijkheid past bij leerjaar 2 — Challenge 3 combineert branding + viraliteit + video
- [x] Stap-voorbeelden in step-descriptions zijn helder
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)
- [x] Hint-systeem aanwezig voor ondersteuning bij foute antwoorden

**Bronbestanden:** `config/agents/year2.tsx:2015-2080, 2092-2108`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw voor een review-missie. De drie challenges volgen Bloom's taxonomie: onthouden (begrippen koppelen) → begrijpen (voorbeeld analyseren) → toepassen/evalueren (meerdere domeinen combineren). Het hint-systeem is goed ontworpen: aanwijzing na 1 fout, grotere hint na 2 foute pogingen.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk?

**Checkpunten:**
- [x] Challenge 1 antwoorden zijn correct — 1=B (usability), 2=C (hook), 3=A (huisstijl)
- [x] Challenge 2 richtlijnen zijn correct — geen hook, onzeker taalgebruik zijn echte problemen
- [x] Challenge 3 combineert meerdere domeinen op correcte wijze
- [x] Taalgebruik past bij de doelgroep — studio-manager persona is consistent
- [x] Alle SLO-kerndoelen van Periode 3 komen terug in de review

**Bronbestanden:** `config/agents/year2.tsx:2005-2091`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De drie challenges testen daadwerkelijk de kernconcepten van Periode 3: UX (usability), podcast (hook), branding (huisstijl), podcast (structuur), en een combinatie van branding + viraliteit + video. De afronding ("CUT! DAT IS EEN WRAP!") is filmset-authentiek en motiverend.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~2000 tekens, sterk gevuld
- [x] EERSTE BERICHT aanwezig en identiek aan de STAP 1 beschrijving in de instructie
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)
- [x] Beoordelingscriteria voor elke challenge expliciet beschreven (*Check:* secties)
- [x] Toon past bij de rol — studio-manager persona is consistent en leuk
- [x] SCOPE GUARD aanwezig — terugsturen naar Periode 3 materiaal
- [x] Farming-detectie via `SYSTEM_INSTRUCTION_SUFFIX`
- [x] Progressieve moeilijkheid expliciet beschreven

**Bronbestanden:** `config/agents/year2.tsx:2005-2091`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coach implementatie. De `*Check:*`-secties geven de AI duidelijke beoordelingscriteria per challenge. Het hint-systeem is gedetailleerd beschreven. De persona (studio-manager met termen als "Take 1", "Wrap-up") is consistent. Dit is een van de beter uitgewerkte review-missies in het platform.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Review-format is afwisselend — drie verschillende soorten challenges
- [x] Challenge 1 heeft duidelijke invoerstructuur — "1=?, 2=?, 3=?"
- [x] Challenge 3 is open en creatief — combineert kennis vrij
- [x] Hint-systeem maakt fouten leerzaam in plaats van frustrerend
- [x] Studio-persona maakt de review minder "toets-achtig"

**Bronbestanden:** `config/agents/year2.tsx:2027-2065, 2092-2108`

**Score:** 4 / 5

**Opmerkingen:**
> De review-arena is goed ontworpen: drie opeenvolgende challenges met verschillende moeilijkheidsgraden en een hint-systeem. Het enige minpunt is dat de missie relatief lineair is (één vaste reeks challenges), terwijl een gerandomiseerde vragenbank de missie beter herspelbaar zou maken.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is?

**Checkpunten:**
- [ ] `goalCriteria` niet gedefinieerd
- [ ] Geen badges gedefinieerd
- [ ] Geen `takeaways[]` aanwezig
- [x] `bonusChallenges: null`
- [x] STEP_COMPLETE (3/3) aanwezig
- [x] De systemInstruction bevat een expliciete AFRONDING-sectie met positieve bekrachtiging

**Bronbestanden:** `config/agents/year2.tsx:2067-2070, 2109`

**Score:** 3 / 5

**Opmerkingen:**
> Beter dan de andere J2P3-missies omdat de systemInstruction expliciet een AFRONDING-sectie heeft ("🎬 CUT! DAT IS EEN WRAP! — je hebt de mediaconcepten van Periode 3 onder de knie"). Maar formele badges en takeaways ontbreken nog steeds. De afronding in de chat is inhoudelijk aanwezig maar niet in het platform geregistreerd.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren?

**Checkpunten:**
- [x] 22A (digitale producten) — Challenge 3 vraagt een geïntegreerd mediaplan
- [x] 21B (media analyseren) — Challenge 2 vraagt mediaproductanalyse
- [x] 23B (digitaal welzijn) — viraliteit en media-invloed raken 23B indirect
- [x] Review dekt alle SLO-kerndoelen van Periode 3
- [x] De missie is expliciet een review — geen nieuwe leerdoelen

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:130`, `config/agents/year2.tsx:2072`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting voor een review-missie. De missie toetst expliciet alle domeinen van Periode 3 (UX, podcast, memes/viraliteit, storytelling, branding, video) en de drie kerndoelen (22A, 21B, 23B) zijn allemaal vertegenwoordigd in de challenges.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn er toegankelijkheidsproblemen?

**Checkpunten:**
- [x] Leesniveau past bij leerjaar 2 — studio-taal is begrijpelijk
- [x] Invoerformaat voor Challenge 1 is helder — "1=B, 2=C, 3=A"
- [ ] Geen visual preview — geen toegankelijkheidsproblemen daar, maar ook geen visuele introductie
- [x] Geen informatie uitsluitend via kleur
- [x] Challenge-sterren (⭐⭐⭐) zijn begrijpelijk zonder kleur

**Bronbestanden:** `config/agents/year2.tsx:1997-2004`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. Het ontbreken van een visual preview heeft ironisch positief effect op toegankelijkheid (geen complexe JSX-elementen zonder alt-teksten). De challenge-sterren zijn universeel begrijpelijk. Het koppel-formaat in Challenge 1 ("1=?, 2=?, 3=?") is helder.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 4 | ×1 = 4 | Geen visual preview |
| 2. Visueel | 2 | ×1 = 2 | Geen preview, grijze kleur |
| 3. Didactische flow | 5 | ×2 = 10 | Bloom-getrapte challenges |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, alle P3-domeinen |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Check-criteria, hint-systeem |
| 6. Interactiviteit | 4 | ×1 = 4 | Afwisselend, niet herspelbaar |
| 7. Afronding & feedback | 3 | ×1 = 3 | Afronding in chat, geen badges |
| 8. SLO-aansluiting | 5 | ×1 = 5 | Alle P3-kerndoelen gedekt |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Geen problemen |
| **TOTAAL** | | **43 / 55** | |

### Gewogen totaal

```
(4×1) + (2×1) + (5×2) + (5×2) + (5×1) + (4×1) + (3×1) + (5×1) + (4×1) = 43
Percentage = (43 / 55) × 100% = 78,2%
```

### Verdict

**⚠️ Needs work** (78,2% — net onder de 80% drempel)

> Inhoudelijk en didactisch sterke review-missie met uitstekende AI-coach. De voornaamste blokkade is het ontbreken van een visual preview — voor de afsluitmissie van Periode 3 is dit een merkbare kwaliteitsachterstand. Met een aantrekkelijke preview en badges scoort deze missie >85%.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 2. Visueel | Geen `visualPreview` aanwezig. Voeg een studio-thema preview toe (bijv. filmklapper, mixer). | Product |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 7. Afronding | Badges en `takeaways` toevoegen voor de finale-beleving van Periode 3. | Hoog |
| 2 | 2. Visueel | Kleur `#6B6B66` vervangen door energiekere `lab-*` kleur passend bij "finale". | Medium |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Gerandomiseerde challenge-vragen zodat de missie herspelbaar is. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
