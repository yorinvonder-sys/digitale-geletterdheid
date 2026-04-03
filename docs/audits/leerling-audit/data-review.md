# Audit — Data Review (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `data-review` |
| **Titel** | Data Review |
| **Leerjaar & Periode** | Leerjaar 2, Periode 1 |
| **Template-engine** | ReviewArena (4 rondes: drag-sort, match-pairs, categorize, rapid-fire) |
| **SLO-kerndoelen** | 21B, 21C, 21D |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introEmoji: '🔐'` en `introTitle` "Wat weet jij over data en privacy?" is direct en helder
- [x] `introDescription` beschrijft de vier rondes en hun variatie
- [x] Moeilijkheidsgraad "Easy" past bij een reviewmissie
- [ ] **MISMATCH**: De ReviewArena-config is getiteld "Data & Privacy Review" en test kennis over AVG, encryptie en persoonsgegevens — NIET de J2P1-stof (data-journalist, spreadsheets, APIs, AI-bias). De agent-beschrijving ("Test je kennis van alle dataconcepten uit deze periode") en de feitelijke template-inhoud spreken elkaar tegen.

**Bronbestanden:** `config/agents/year2.tsx:516-530`, `components/missions/templates/review-arena/configs/data-review.ts:1-43`

**Score:** 2 / 5

**Opmerkingen:**
> Ernstige mismatch: de agent-beschrijving in year2.tsx belooft een review van "datasets, spreadsheets, factchecking en AI-bias" (J2P1-stof). De ReviewArena-template test echter privacy, AVG en encryptie — stof die niet in J2P1 is behandeld. Dit is een scoping-fout: de template-config is mogelijk bedoeld voor een privacy-periode maar verkeerd gekoppeld aan de data-review missie-ID.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Grijze kleurschema past bij een review/afsluitmissie
- [x] Vier rondetypen (drag-sort, match-pairs, categorize, rapid-fire) bieden visuele variatie
- [ ] Badge-kleuren (`#F59E0B`, `#10B981`, `#6366F1`, `#D97757`) zijn hardcoded hex
- [x] RotateCcw-icoon en grijze kleur communiceren "herhaling" — passend voor een review
- [ ] `introEmoji: '🔐'` is thematisch passend voor privacy maar NIET voor een data-periode-review

**Bronbestanden:** `components/missions/templates/review-arena/configs/data-review.ts`

**Score:** 3 / 5

**Opmerkingen:**
> Visueel coherent voor een privacy-review, maar niet passend als review van J2P1. Het slot-emoji (🔐) en de privacy-thematiek versterken de mismatch.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen rondes op elkaar voort?

**Checkpunten:**
- [x] Vier rondes variëren in format: drag-sort (rangschikken) → match-pairs (koppelen) → categorize (categoriseren) → rapid-fire (waar/onwaar)
- [x] De rondes dekken verwante concepten (databronnen, beveiliging, persoonsgegevens, AVG)
- [x] Moeilijkheidsgraad stijgt per ronde (van rangschikken naar kennistoets)
- [ ] De stof die de rondes testen is NIET de stof van J2P1 (data-journalistiek, spreadsheets, APIs, AI-bias) — de flow is intern consistent maar extern incorrect

**Bronbestanden:** `components/missions/templates/review-arena/configs/data-review.ts:44-191`

**Score:** 3 / 5

**Opmerkingen:**
> De interne didactische flow van de template is goed: vier progressieve rondes over verwante privacy-onderwerpen. Maar als review van J2P1 ("Data & Informatie") klopt de flow niet — leerlingen worden getoetst op stof die ze in J2P1 niet hebben geleerd.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle vragen en antwoorden inhoudelijk?

**Checkpunten:**
- [x] Ronde 1 (vertrouwbaarheid databronnen): CBS > peer-reviewed > landelijk dagblad > Wikipedia > Instagram > TikTok — correct
- [x] Ronde 2 (datatype & beveiliging): koppels zijn correct (hashing voor wachtwoorden, TLS voor email, encryptie voor USB, opt-in voor biometrisch, logging voor inlogpogingen)
- [x] Ronde 3 (persoonsgegeven of niet?): alle categorisaties correct conform AVG
- [x] Ronde 4 (AVG waar/onwaar): alle antwoorden correct met goede artikelverwijzingen (art. 15, 17, 33 AVG)
- [x] "Geboortejaar (alleen het jaar)" als geen persoonsgegeven is correct — de combinatie maakt het een persoonsgegeven
- [ ] **SCOPING FOUT**: de inhoud test privacy/AVG-stof die niet in J2P1 zit

**Bronbestanden:** `components/missions/templates/review-arena/configs/data-review.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk correct voor een privacy-review. De AVG-kennis is nauwkeurig en leerzaam. Maar als review van J2P1 is de inhoud incorrect — leerlingen worden getoetst op stof die buiten de periode valt.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim >1500 tekens
- [x] EERSTE BERICHT aanwezig: "Tijd voor de grote check!"
- [x] STEP_COMPLETE markers aanwezig (3/3)
- [x] SCOPE GUARD aanwezig — houdt leerlingen bij de J2P1-stof
- [ ] **MISMATCH**: de systemInstruction beschrijft te herhalen onderwerpen uit J2P1 (dataset, API, visualisatie, AI-bias) maar de ReviewArena-template test iets anders (privacy, AVG)
- [x] Anti-farmingbescherming via SYSTEM_INSTRUCTION_SUFFIX

**Bronbestanden:** `config/agents/year2.tsx:534-598`

**Score:** 3 / 5

**Opmerkingen:**
> De systemInstruction is goed geconstrueerd maar test andere stof dan de template. De SCOPE GUARD verwijst naar "stof van Periode 1 (data, APIs, visualisatie, bias)" maar de template-rondes gaan over AVG en privacy. Dit zal verwarrend zijn voor leerlingen die via de AI-coach vragen stellen.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Vier afwisselende rondetypen zijn visueel aantrekkelijk
- [x] Drag-sort is de meest interactieve ronde — leerlingen slepen items in volgorde
- [x] Match-pairs leert verbanden leggen
- [x] Rapid-fire met tijdslimiet (12 seconden per vraag) geeft urgentie
- [x] De variatie in formats houdt de aandacht vast

**Bronbestanden:** `components/missions/templates/review-arena/configs/data-review.ts`

**Score:** 4 / 5

**Opmerkingen:**
> De ReviewArena-template heeft een rijke interactiestructuur. Als privacy-review zou deze missie uitstekend werken. Als review van J2P1 mist het de juiste inhoud.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Zijn badges logisch?

**Checkpunten:**
- [x] `maxScore: 100` gedefinieerd, 4 rondes van 25 punten elk = 100
- [x] 4 badges: Privacy Expert (90+), Databewuste leerling (70+), Op de goede weg (50+), Goede poging (0+)
- [x] `takeaways[]` bevat 5 leerpunten
- [ ] Badge "Privacy Expert" en takeaways over AVG zijn thematisch verkeerd voor een J2P1-datareview

**Bronbestanden:** `components/missions/templates/review-arena/configs/data-review.ts:1-43`

**Score:** 3 / 5

**Opmerkingen:**
> De afrondingselementen zijn goed geconstrueerd voor een privacy-missie. Voor een J2P1-datareview zijn de badgenamen ("Privacy Expert") en takeaways (AVG, encryptie) thematisch incorrect.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt?

**Checkpunten:**
- [x] slo-kerndoelen-mapping.ts: `data-review` → `['21B', '21C', '21D']` — geclaimd
- [ ] SLO 21B (Media en informatie) wordt NIET getest — de template test AVG/privacy-kennis (23A)
- [ ] SLO 21C (Data en dataverwerking) wordt DEELS getest — bronvertrouwbaarheid raakt 21B/21C
- [ ] SLO 21D (AI) wordt NIET getest — geen AI-gerelateerde vragen in de template
- [x] De template test feitelijk 23A (Veiligheid en privacy) en 23C (Maatschappij/AVG) — niet de geclaimde doelen

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:102`, `components/missions/templates/review-arena/configs/data-review.ts`

**Score:** 1 / 5

**Opmerkingen:**
> Ernstige SLO-mismatch. De geclaimde SLO-kerndoelen (21B, 21C, 21D) worden grotendeels niet bediend door de template-inhoud. De template test in feite 23A en 23C (privacy, AVG) — stof die later in het J2-curriculum terugkomt maar niet in J2P1 is behandeld.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend?

**Checkpunten:**
- [x] Leesniveau op B1-niveau — correct voor 13-14 jaar
- [x] Drag-sort is een laagdrempelige interactievorm
- [x] Rapid-fire tijdslimiet (12 seconden) kan stress geven bij leerlingen met leerproblemen
- [ ] AVG-termen ("art. 33 AVG", "pseudonimisering") zijn te technisch voor leerlingen die dit nog niet hebben gehad

**Bronbestanden:** `components/missions/templates/review-arena/configs/data-review.ts`

**Score:** 3 / 5

**Opmerkingen:**
> De rapid-fire tijdslimiet en AVG-juridische termen zijn potentieel belemmerend. De tijdslimiet van 12 seconden per vraag is erg kort voor leerlingen die moeite hebben met lezen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 2 | ×1 = 2 | Ernstige mismatch agent vs template |
| 2. Visueel | 3 | ×1 = 3 | Hardcoded kleuren, privacy-thema klopt niet |
| 3. Didactische flow | 3 | ×2 = 6 | Intern consistent, maar verkeerde stof |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Correcte privacy-kennis, maar verkeerde periode |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | Goed geconstrueerd, maar stof-mismatch |
| 6. Interactiviteit | 4 | ×1 = 4 | Template werkt goed als privacy-review |
| 7. Afronding & feedback | 3 | ×1 = 3 | Badges niet passend voor J2P1 |
| 8. SLO-aansluiting | 1 | ×1 = 1 | Geclaimde SLO's worden niet bediend |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Rapid-fire tijdslimiet, AVG-jargon |
| **TOTAAL** | | **30 / 55** | |

### Gewogen totaal

```
(2×1) + (3×1) + (3×2) + (4×2) + (3×1) + (4×1) + (3×1) + (1×1) + (3×1) = 30
Percentage = (30 / 55) × 100% = 54,5%
```

### Verdict

**❌ Niet inzetbaar** (54,5% — onder de 60% drempel)

> De ReviewArena-template voor data-review is een privacy-review die AVG, encryptie en persoonsgegevens toetst. Dit is NIET de stof van J2P1 (data-journalistiek, spreadsheets, APIs, AI-bias). De agent-beschrijving en de template-inhoud zijn fundamenteel niet op elkaar afgestemd. De missie is inhoudelijk correct maar op de verkeerde plek in het curriculum.

---

### Actielijst

#### Blokkerende issues (oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 8. SLO + 1. Indruk | **Kernprobleem**: ReviewArena-template (`data-review.ts`) test privacy/AVG-stof (23A, 23C) terwijl de missie J2P1-stof moet reviewen (21B, 21C, 21D). Oplossing: vervang de template-inhoud door rondes die datasets, spreadsheetformules, APIs en AI-bias toetsen | Product |
| 2 | 5. AI-coach | Zodra template-content correct is: SCOPE GUARD aanpassen aan de nieuwe inhoud | Product |
| 3 | 7. Afronding | Badges ("Privacy Expert") en takeaways aanpassen aan J2P1-thema's | Product |

#### Noot
> De bestaande ReviewArena-template voor `data-review.ts` is inhoudelijk goed geconstrueerd als privacy-review. Overweeg om deze content te verplaatsen naar een toekomstige J2P2-missie over security/privacy waar het thematisch wél past.

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
