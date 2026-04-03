# Audit — Security Review (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `security-review` |
| **Titel** | Security Review |
| **Leerjaar & Periode** | Leerjaar 3, Periode 2 |
| **Template-engine** | ReviewArena |
| **SLO-kerndoelen** | 23A (Veiligheid & Privacy) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en duidelijk — "Hoe veilig ben jij online?" is een directe vraag die uitnodigt
- [x] `introDescription` benoemt expliciet de behandelde onderwerpen en vorige missies
- [x] Emoji 🔒 past perfect bij het security-thema
- [x] Moeilijkheidsgraad "Medium" is passend voor een review-missie
- [x] `visualPreview` aanwezig in de agent-config — betere eerste indruk dan `advanced-code-review`

**Bronbestanden:** `components/missions/templates/review-arena/configs/security-review.ts:3-11`, `config/agents/year3.tsx:1047-1060`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. "Hoe veilig ben jij online?" is persoonlijk en relevant. Het opsommen van de vorige missies ("cyber detective, encryptie-expert, forensisch analist") geeft een gevoel van progressie en voltooiing.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] ReviewArena-template heeft een bewezen responsive lay-out
- [ ] Badge-kleuren zijn hardcoded: `#F59E0B`, `#10B981`, `#6366F1`, `#D97757`
- [x] Wachtwoord-items in drag-sort zijn duidelijke tekstlabels
- [x] Match-pairs koppelinterface is visueel overzichtelijk
- [x] Categorize-ronde heeft duidelijke kolomheaders ("Veilig gedrag" / "Onveilig gedrag")

**Bronbestanden:** `components/missions/templates/review-arena/configs/security-review.ts`

**Score:** 3 / 5

**Opmerkingen:**
> ReviewArena-template is solide, maar badge hex-kleuren zijn dezelfde stijlovertreding als bij `advanced-code-review`. De categorize-ronde met twee kolommen is een verbetering ten opzichte van de supervised/unsupervised ronde in advanced-code-review — de kolomheaders zijn duidelijker.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw: Wachtwoordsterkte sorteren → Aanval-tegenmaatregel koppelen → Veilig/onveilig categoriseren → Rapid fire
- [x] De vier rondes testen vier verschillende cognitieve niveaus — consistente aanpak met `advanced-code-review`
- [x] Moeilijkheidsgraad "Medium" past bij een review
- [x] STEP_COMPLETE markers aanwezig (3/3): 5 begrippen uitgelegd → 2 scenario's geanalyseerd → samenvatting geschreven
- [x] Rapid fire (12 sec/vraag, 8 vragen) geeft een spannende afsluiting
- [x] Wachtwoord-sorteervolgorde is logisch en leerzaam

**Bronbestanden:** `config/agents/year3.tsx:1107-1110`, `components/missions/templates/review-arena/configs/security-review.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende ReviewArena-opzet. De wachtwoord-sorteervolgorde (passphrases > willekeurige tekens > woorden > kort maar met symbool > veelgebruikt > naam+jaar) is correct en leerzaam. De match-pairs ronde (5 aanval-tegenmaatregel paren) is goed geconstrueerd.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Wachtwoord-sortering correct: passphrase (lang + symbolen) > willekeurig (12 tekens) > lange woorden > kort+symbolen > welkom123 > naam+geboortejaar
- [x] Aanval-tegenmaatregel paren correct: phishing → links controleren, brute force → lang wachtwoord + 2FA, etc.
- [x] USB malware → auto-run uitschakelen correct
- [x] Man-in-the-middle → HTTPS + VPN correct
- [x] DDoS → firewall + rate limiting correct
- [x] Rapid fire: "Symmetrische encryptie gebruikt één sleutel" = true ✓, "Phishing altijd herkenbaar aan spelfouten" = false ✓
- [x] "2FA maakt je volledig onhackbaar" = false ✓ (correct: social engineering blijft risico)
- [x] Geen aantoonbare spelfouten

**Bronbestanden:** `components/missions/templates/review-arena/configs/security-review.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De wachtwoord-volgorde is genuanceerd correct — een passphrase is sterker dan een willekeurig kort wachtwoord vanwege lengte. De rapid fire vragen zijn feitelijk correct inclusief de nuances.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim voldoende
- [x] EERSTE BERICHT aanwezig — "Security Review — GESTART."
- [x] STEP_COMPLETE markers aanwezig voor alle drie stappen (3/3)
- [x] Toon past bij de rolnaam — "Security Review Coach" is coachend maar streng
- [x] SCOPE GUARD: "Accepteer geen vage of oppervlakkige antwoorden — vraag altijd om verduidelijking"

**Bronbestanden:** `config/agents/year3.tsx:1070-1115`

**Score:** 5 / 5

**Opmerkingen:**
> Volledig geconfigureerde coach. De SCOPE GUARD-instructie ("geen vage antwoorden") past goed bij een review-missie die diepgang vereist.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Vier gevarieerde rondes (drag-sort, match-pairs, categorize, rapid-fire) zijn goed afwisselend
- [x] Wachtwoord-drag-sort is een unieke en leerzame activiteit — leerlingen rangschikken op basis van beveiligingsprincipes
- [x] Match-pairs is effectief voor aanval-tegenmaatregel koppeling
- [x] Categorize "Veilig/Onveilig" is een duidelijke en binaire keuze
- [x] Rapid fire geeft een spannende afsluiting

**Bronbestanden:** `components/missions/templates/review-arena/configs/security-review.ts`

**Score:** 5 / 5

**Opmerkingen:**
> De wachtwoord-sorteervolgorde is een bijzonder effectieve didactische tool. Leerlingen moeten actief redeneren over waarom lengte belangrijker is dan complexiteit, wat dieper begrip vereist dan een multiple-choice vraag.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig: 🏆 Security Expert (≥90), 🛡️ Waakzame Verdediger (≥70), 📚 Op de goede weg (≥50), 💪 Goede poging (≥0)
- [x] `maxScore: 100` is helder (4 rondes × 25 punten)
- [x] `takeaways[]` aanwezig — 5 kernlessen die J3P2 samenvatten
- [x] De takeaway over logbestanden ("digitale sporen die laten zien wie wat wanneer") verbindt de cyber-detective en digital-forensics missies

**Bronbestanden:** `components/missions/templates/review-arena/configs/security-review.ts:11-43`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsset. De takeaways zijn een goede synthese van de hele J3P2-periode: encryptie, phishing, 2FA, forensics. Dit past perfect bij de rol als afsluitende review-missie.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 23A (Veiligheid & Privacy): encryptie, phishing, 2FA, forensics zijn allemaal kern van 23A
- [x] Mapping is consistent met `slo-kerndoelen-mapping.ts` (week 2, J3)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:168`

**Score:** 5 / 5

**Opmerkingen:**
> Enkelvoudige SLO-koppeling (23A) is volledig gerechtvaardigd. De review-missie dekt terecht alleen 23A omdat het alle J3P2-missies integreert die allemaal primair 23A bedienen.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo
- [x] Match-pairs en categorize gebruiken tekst als primaire informatiebron
- [ ] Badge-kleuren zijn hardcoded hex
- [ ] Drag-sort wachtwoord-ronde is niet volledig toetsenbord-toegankelijk

**Score:** 3 / 5

**Opmerkingen:**
> Zelfde drag-and-drop toegankelijkheidsprobleem als bij `advanced-code-review`. De wachtwoord-sorteervolgorde is didactisch centraal — een toetsenbord-alternatief is wenselijk.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Persoonlijke vraag, progressie-gevoel |
| 2. Visueel | 3 | ×1 = 3 | Template solide, badge hex-kleuren |
| 3. Didactische flow | 5 | ×2 = 10 | Vier cognitieve niveaus, STEP_COMPLETE compleet |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Wachtwoord-volgorde correct en genuanceerd |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geconfigureerd |
| 6. Interactiviteit | 5 | ×1 = 5 | Wachtwoord-sortering is unieke activiteit |
| 7. Afronding & feedback | 5 | ×1 = 5 | Takeaways synthetiseren J3P2 |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23A aantoonbaar aanwezig |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Drag-drop niet toetsenbord-toegankelijk |
| **TOTAAL** | | **51 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (3×1) = 51
Percentage = (51 / 55) × 100% = 92,7%
```

### Verdict

**✅ Klaar** (92,7% — ruim boven de 80% drempel)

> Een sterke afsluiting van J3P2. De wachtwoord-sorteervolgorde is een didactisch hoogtepunt. Geen blokkerende issues.

---

### Actielijst

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 9. Toegankelijkheid | Drag-sort wachtwoord-ronde: toetsenbord-alternatief toevoegen (template-niveau) | Medium |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 2. Visueel | Badge hex-kleuren vervangen door `lab-*` tokens |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
