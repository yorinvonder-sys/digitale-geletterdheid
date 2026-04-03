# Audit — Security Auditor (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `security-auditor` |
| **Titel** | Security Auditor |
| **Leerjaar & Periode** | Leerjaar 3, Periode 2 |
| **Template-engine** | PuzzleLab |
| **SLO-kerndoelen** | 23A (Veiligheid & Privacy), 21A (Digitale systemen) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en duidelijk — "Security Auditor" is een herkenbare rol
- [x] `introDescription` zet een concreet en realistisch scenario — "De webshop van FreshDrop gaat morgen live"
- [x] Emoji 🛡️ past perfect bij het security-thema
- [x] Moeilijkheidsgraad "Hard" is correct — OWASP Top 10 is geavanceerde stof
- [x] `introFeatures` (4 bullets) zijn concreet: kwetsbaarheden vinden, OWASP leren, ernst classificeren, rapport schrijven

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/security-auditor.ts:3-15`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. "Ethisch hacken: beschermen, niet breken" is een didactisch en ethisch sterke toevoeging die de rol onmiddellijk in een verantwoordelijk kader plaatst.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] PuzzleLab-template heeft een bewezen lay-out
- [x] SQL-injectie en XSS code-snippets zijn als code-blokken weergegeven — correct
- [ ] Badge-kleuren zijn hardcoded: `#F59E0B`, `#6B7280`, `#10B981`, `#3B82F6`
- [x] Code-blokken zijn goed leesbaar in alle scenario's

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/security-auditor.ts`

**Score:** 4 / 5

**Opmerkingen:**
> PuzzleLab scoort goed. De code-blokken zijn cruciaal voor de leesbaarheid van de SQL-injectie- en XSS-voorbeelden — goed geïmplementeerd.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw: SQL-injectie herkennen → Ernst classificeren → XSS begrijpen → Rapport schrijven
- [x] Elke puzzel bouwt voort — je kunt pas een rapport schrijven als je de kwetsbaarheden begrijpt
- [x] Moeilijkheidsgraad "Hard" is correct voor OWASP-niveau kennis
- [x] STEP_COMPLETE markers aanwezig (3/3): 4 beveiligingsaspecten gecheckt → kwetsbaarheden geclassificeerd → rapport geschreven
- [x] Extra aanwijzingen worden pas onthuld na 2 foutieve pogingen — goede dosering
- [x] Puzzel 4 heeft een validator die sleutelwoorden controleert — flexibel en toepasbaar

**Bronbestanden:** `config/agents/year3.tsx:899-902`, `components/missions/templates/puzzle-lab/configs/security-auditor.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De progressie van herkennen (SQL-injectie) → prioritiseren (ernst) → begrijpen (XSS) → rapporteren is de echte audit-methodologie. De tekst-input validator in puzzel 4 is slim geconstrueerd: het controleert op sleutelwoorden (sql/injectie + prepared/parameterized) wat de vrijheid geeft eigen woorden te gebruiken.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] SQL-injectie via `' OR '1'='1` correct uitgelegd — sluit tekstveld af, altijd-ware conditie
- [x] OWASP Top 10 als referentiekader correct geciteerd
- [x] Geen HTTPS als "kritiek" correct geclassificeerd (creditcardnummers onversleuteld)
- [x] Stored XSS correct uitgelegd — script opgeslagen en uitgevoerd bij elke bezoeker
- [x] "Prepared statements" als correcte oplossing voor SQL-injectie — technisch correct
- [x] CSP (Content Security Policy) als XSS-oplossing correct vermeld
- [x] Validator puzzel 4: zowel probleem als oplossing vereist — goed ontwerp
- [x] Geen aantoonbare spelfouten

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/security-auditor.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk perfect. Dit is een van de meest technisch correcte missies in het platform. De OWASP-koppeling is expliciet en correct. De uitleg dat Stored XSS "elke bezoeker" treft (in tegenstelling tot Reflected XSS die alleen de aanvaller treft) is een belangrijke nuance die correct is opgenomen.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim voldoende
- [x] EERSTE BERICHT aanwezig — "Junior Auditor, welkom bij het team."
- [x] STEP_COMPLETE markers aanwezig voor alle drie stappen (3/3)
- [x] Toon past bij de rolnaam — "Security Auditor" combineert professionaliteit met ethisch kader
- [x] SCOPE GUARD: "Benoem altijd het ethische kader: toestemming en verantwoordelijkheid"

**Bronbestanden:** `config/agents/year3.tsx:866-945`

**Score:** 5 / 5

**Opmerkingen:**
> Volledig geconfigureerde coach. De expliciete ethische kader-instructie in de SCOPE GUARD is correct voor een missie die aanvalstechnieken behandelt — leerlingen leren hacken vanuit beschermingsperspectief.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] PuzzleLab is het ideale format voor security-auditing
- [x] Mix van multiple-choice (3 puzzels) en text-input (1 puzzel) geeft variatie
- [x] De tekst-input validator in puzzel 4 is open genoeg voor eigen formulering
- [x] Code-blokken met aanvalscode maken de scenario's realistisch
- [x] `maxAttempts` per puzzel (3-3-3-8) zijn correct gedoseerd

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/security-auditor.ts`

**Score:** 5 / 5

**Opmerkingen:**
> De combinatie van multiple-choice (conceptkennis) + text-input (rapportagevaardigheid) is de juiste mix voor een audit-opdracht. De open validator in puzzel 4 respecteert eigen formulering.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig: 🏆 Senior Security Auditor (≥90), 🛡️ Ethisch Hacker (≥70), 🔍 Junior Auditor (≥40), 📋 Stagiair Security (≥0)
- [x] `maxScore: 100` is helder (4 puzzels × 25 punten)
- [x] `takeaways[]` aanwezig — 5 kernlessen over security-auditing
- [x] Badge-progressie (stagiair → junior → ethisch hacker → senior) is een motiverende carrière-ladder

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/security-auditor.ts:138-171`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende afrondingsset. De takeaway "Een goed beveiligingsrapport is actionable: probleem, impact en concrete technische oplossing" is een directe vertaling van wat leerlingen in puzzel 4 hebben geoefend.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 23A (Veiligheid & Privacy): OWASP-kwetsbaarheden en beveiligingsrapportage zijn kern van 23A
- [x] 21A (Digitale systemen): webserver-architectuur, SQL en HTTP zijn systeemkennis
- [x] Mapping is consistent met `slo-kerndoelen-mapping.ts` (week 2, J3)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:166`

**Score:** 5 / 5

**Opmerkingen:**
> De dubbele SLO-koppeling is goed onderbouwd. Security-auditing vereist zowel praktische veiligheidskennis (23A) als technisch begrip van webservers en databases (21A).

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo — technisch maar goed uitgelegd
- [x] Code-blokken zijn tekst-gebaseerd — geen kleurafhankelijkheid
- [x] Multiple-choice en text-input zijn toetsenbord-toegankelijk
- [ ] Badge-kleuren zijn hardcoded hex

**Score:** 4 / 5

**Opmerkingen:**
> Goede toegankelijkheid. De missie is volledig tekst-gebaseerd, wat voor PuzzleLab optimaal is.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Ethisch kader meteen aanwezig |
| 2. Visueel | 4 | ×1 = 4 | Code-blokken goed, badge hex-kleuren |
| 3. Didactische flow | 5 | ×2 = 10 | Echte audit-methodologie, STEP_COMPLETE compleet |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | OWASP correct, XSS-nuance aanwezig |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Ethisch kader in SCOPE GUARD |
| 6. Interactiviteit | 5 | ×1 = 5 | Flexibele validator voor rapport |
| 7. Afronding & feedback | 5 | ×1 = 5 | Carrière-ladder badges |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23A+21A aantoonbaar aanwezig |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Tekst-first, badge hex-kleuren |
| **TOTAAL** | | **54 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (4×1) = 54
Percentage = (54 / 55) × 100% = 98,2%
```

### Verdict

**✅ Klaar** (98,2% — ruim boven de 80% drempel)

> De hoogst scorende missie in J3P2. Inhoudelijk perfect, didactisch sterk, ethisch kader correct verankerd. Bijna geen verbeterpunten.

---

### Actielijst

#### Nice-to-haves (optioneel)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 2. Visueel | Badge hex-kleuren vervangen door `lab-*` tokens |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
