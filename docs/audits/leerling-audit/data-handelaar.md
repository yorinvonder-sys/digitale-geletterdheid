# Audit — De Data Handelaar (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `data-handelaar` |
| **Titel** | De Data Handelaar |
| **Leerjaar & Periode** | Leerjaar 1, Periode 3 |
| **Template-engine** | PuzzleLab (4 puzzles) |
| **SLO-kerndoelen** | 23A (privacy), 23C (maatschappij/AVG) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "De Data Handelaar" met 🕵️ is intrigerend
- [x] `introDescription` geeft concrete verwachting — "ondercover bij DataDeal BV" is een sterke hook
- [x] Visueel element past bij het thema — donkerrode "CLASSIFICATIE: GEHEIM" met drie bewijsstukken is spannend
- [x] Moeilijkheidsgraad voelbaar — "Medium" klopt voor AVG-analyse

**Bronbestanden:** `config/agents/year1.tsx:2394-2421`, `components/missions/templates/puzzle-lab/configs/data-handelaar.ts:1-15`

**Score:** 5 / 5

**Opmerkingen:**
> De "undercover"-framing is een krachtige hook die leerlingen direct in de rol plaatst. De donkerrode visual met "CLASSIFICATIE: GEHEIM" en drie bewijsstukken A/B/C communiceert het spelprincipe direct. Het missionObjective ("vind de AVG-overtredingen") is helder.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren consistent — donkerrood/rood past bij het spionageschema
- [x] PuzzleLab-template is proven
- [ ] Kleur via `lab-*` tokens — `color: '#DC2626'` is hardcoded hex
- [x] Document-opmaak in puzzles is leesbaar (markdown met `---` scheiders)

**Bronbestanden:** `config/agents/year1.tsx:2399` (hardcoded hex)

**Score:** 4 / 5

**Opmerkingen:**
> De PuzzleLab-template biedt een gestructureerde weergave van puzzels met clues, opties en feedback. De documentopmaak in de puzzelbeschrijvingen (vet, cursief) is duidelijk.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — E-mail analyse → Minderjarigenprofiel → Burgerrechten → Rapport schrijven
- [x] Elke puzzel bouwt voort — de doelbinding (Puzzel 1) en minderjarigenbescherming (Puzzel 2) komen samen in het rapport (Puzzel 4)
- [x] Moeilijkheid past bij leerjaar — multiple-choice voor 1-3, open tekst voor 4 (met validator)
- [x] Hint-systeem aanwezig — `revealExtraAfterAttempts: 2` voor geleidelijke hulp

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/data-handelaar.ts:17-137`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De vier puzzels zijn conceptueel samenhangend: je analyseert de e-mail (doelbinding), het klantprofiel (minderjarigenbescherming), de burgerrechten (handelingsperspectief), en schrijft dan een rapport dat alles combineert. De text-input puzzle met validator (Puzzel 4) is pedagogisch ambitieus en uitdagend.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — doelbindingsbeginsel (AVG art. 5) correct aangehaald
- [x] Bijzondere persoonsgegevens correct beschreven — gezondheidsdata (hartslag, slaap) is correct als bijzonder geclassificeerd
- [x] Minderjarigenbescherming correct — "onder 16 jaar in Nederland extra bescherming, profileren voor marketing verboden"
- [x] "Autoriteit Persoonsgegevens" correct als klachtkanaal
- [x] "30 dagen responstermijn" klopt voor AVG-inzageverzoek
- [x] Geen spelfouten gevonden
- [x] AVG-artikelnummers correct aangehaald

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/data-handelaar.ts:17-171`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De juridische precisie is hoog: doelbindingsbeginsel (art. 5), bijzondere persoonsgegevens, minderjarigenprotectie (<16 jaar), recht op inzage en verwijdering, klacht bij AP. De succesboodschappen na elke puzzel zijn informatief en geven extra context (bijv. "boetes tot 20 miljoen euro").

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] PuzzleLab heeft ingebouwde hint-progressie — `hintCost`, `revealExtraAfterAttempts`, `maxAttempts`
- [x] Hints zijn gelaagd — algemene hints eerst, extra hints na 2 pogingen
- [x] Chat systemInstruction aanwezig als aanvulling (year1.tsx) — inclusief gevoeligheidsinstructie
- [x] EERSTE BERICHT aanwezig in year1.tsx — "🕵️ GEHEIM DOSSIER — ALLEEN VOOR JOUW OGEN"
- [x] Gevoeligheidsinstructie aanwezig (Bewijsstuk B bevat gevoelige zoektermen minderjarige)

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/data-handelaar.ts:17-137`, `config/agents/year1.tsx:2424-2514`

**Score:** 5 / 5

**Opmerkingen:**
> De PuzzleLab heeft een uitstekend hint-systeem: hints zijn gradueel (algemeen → specifiek via `revealExtraAfterAttempts`), er is een `hintCost` om farming te voorkomen, en `maxAttempts` zorgt voor een eindpunt. Het EERSTE BERICHT is spannend en context-opbouwend. De gevoeligheidsinstructie voor Bewijsstuk B (zoektermen van een 14-jarig meisje) is aanwezig en correct.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Multiple-choice past bij AVG-analyse — leerling moet het juiste AVG-principe herkennen
- [x] Text-input voor Puzzel 4 is ambitieuzer — vraagt om formulering
- [x] Validator voor Puzzel 4 is slim opgebouwd — controleert op bedrijfsnaam, AVG-principe, en doelgroep
- [x] Spionageschema past bij de leeftijdsgroep — spanning en gamification

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/data-handelaar.ts:108-137`

**Score:** 4 / 5

**Opmerkingen:**
> De interactiviteit is sterk, met als hoogtepunt de text-input puzzel met programmatische validator. Dit is een zeldzaam goede implementatie van open-ended antwoorden in een geautomatiseerde leeromgeving. Punt: de validator controleert op sleutelwoorden maar kan geen kwalitatieve beoordeling geven van de argumentatie.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges gedefinieerd — 4 badges: Hoofd Data-Inspecteur (≥90), Senior Undercover Agent (≥70), Privacy Onderzoeker (≥40), Stagiair Inspectie (≥0)
- [x] `maxScore: 100` aanwezig (4×25=100)
- [x] `takeaways` aanwezig — 5 concrete lessen (doelbinding, bijzondere persoonsgegevens, kinderrechten, AVG-rechten, toestemming)
- [x] `successMessage` per puzzel is informatief en contextgevend

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/data-handelaar.ts:139-171`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende afrondingsstructuur. De badges zijn thematisch sterk (Hoofd Data-Inspecteur is een goede afsluiting van de undercover-framing). De 5 takeaways zijn specifiek en direct toepasbaar, inclusief concrete AVG-artikelen.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht geclaimde kerndoelen — 23A (privacyrechten) en 23C (AVG als maatschappelijk kader) zijn volledig aanwezig
- [x] Mapping is intern consistent
- [x] Leerdoel toetsbaar — PuzzleLab-scoring meet AVG-kennis

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts` (week 3, 23A + 23C)

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De missie behandelt 23A (privacy: rechten, bijzondere persoonsgegevens, minderjarigenbescherming) en 23C (regelgeving: AVG-artikelen, AP, boetes) diepgaand en correct.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — de documenten zijn begrijpelijk geschreven als e-mail/profiel/contract
- [x] Kleur gecombineerd met tekst — bewijsstukken A/B/C zijn tekstueel gelabeld
- [x] Gevoeligheidsinstructie aanwezig voor Bewijsstuk B
- [ ] De text-input puzzel (Puzzel 4) is uitdagend voor leerlingen met schrijfproblemen — geen alternatief

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/data-handelaar.ts:108-137`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk voor de doelgroep. De documenten zijn geschreven als herkenbare formaten (e-mail, klantprofiel, contract). De text-input puzzel kan voor sommige J1-leerlingen een drempel zijn. De uitgebreide hints en het `revealExtraAfterAttempts`-systeem bieden goede ondersteuning.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Undercover-framing is krachtig |
| 2. Visueel | 4 | ×1 = 4 | PuzzleLab proven, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Samenhangende puzzels, validator |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Juridisch precisie hoog |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Hint-systeem + chat volledig |
| 6. Interactiviteit | 4 | ×1 = 4 | Text-input validator sterk |
| 7. Afronding & feedback | 5 | ×1 = 5 | Volledig: badges + takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23A + 23C volledig |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, text-input drempel |
| **TOTAAL** | | **49 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (5×1) + (5×1) + (4×1) = 49
Percentage = (49 / 55) × 100% = 89,1%
```

### Verdict

**✅ Klaar** (89,1% — ruim boven de 80% drempel)

> De Data Handelaar is een uitstekende missie. De undercover-framing is creatief, de PuzzleLab-implementatie is volledig, de juridische inhoud is nauwkeurig, en de afrondingsstructuur is compleet. De text-input validator in Puzzel 4 is een bijzonder sterke didactische keuze. Klaar voor directe inzet.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

Geen blokkerende issues.

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 2. Visueel | Hardcoded hex `#DC2626` vervangen door `lab-*` token. |
| 2 | 9. Toegankelijkheid | Alternatief voor Puzzel 4 (text-input) voor leerlingen met schrijfproblemen — bijv. meerkeuze-variant. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
