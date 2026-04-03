# Audit — Wachtwoord Warrior (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `wachtwoord-warrior` |
| **Titel** | Wachtwoord Warrior |
| **Leerjaar & Periode** | Leerjaar 2, Periode 2 |
| **Template-engine** | PuzzleLab |
| **SLO-kerndoelen** | 23A |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `primaryGoal` aanwezig — "🔐 Begrijp wachtwoordbeveiliging en schrijf een schoolbeleid"
- [x] `goalCriteria` aanwezig — `{ type: 'steps-complete', min: 3 }`
- [x] Concrete statistiek in scenario ("meer dan 10 miljard wachtwoorden gelekt")
- [x] EERSTE BERICHT meteen pakkend — top-5 wachtwoorden in 1 seconde gekraakt
- [x] Moeilijkheidsgraad "Medium" passend voor J2

**Bronbestanden:** `config/agents/year2.tsx:2576-2608`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De openingsstatistiek ("10 miljard gelekte wachtwoorden") is een krachtige haak. Het EERSTE BERICHT presenteert de top-5 zwakste wachtwoorden en stelt meteen een activerende vraag. De visualPreview met wachtwoord-sterktemetertje is creatief en thematisch sterk.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Creatieve visualPreview — wachtwoord-sterktemetertje met gekleurde bolletjes
- [x] Rood kleurthema past bij veiligheidswaarschuwing
- [x] PuzzleLab-template biedt structurele consistentie
- [ ] visualPreview gebruikt inline style via Tailwind gradient, geen expliciete hardcoded hex — maar de rode bolletjes (`bg-red-400`) en groene bolletjes (`bg-green-400`) gebruiken Tailwind klassen correct
- [x] Sterktemetertje (`██████░░`) is visueel aantrekkelijk en begrijpelijk

**Bronbestanden:** `config/agents/year2.tsx:2590-2607`

**Score:** 5 / 5

**Opmerkingen:**
> De visualPreview is creatief en direct relevant: een wachtwoord-sterktemetertje met gekleurde bolletjes communiceert het thema direct. Geen hardcoded hex-kleuren gevonden — alles via Tailwind utility-classes. De rode kleur past bij het veiligheidswaarschuwingsthema.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Aanvalstechnieken begrijpen → Verdedigingsmiddelen leren → Beleid schrijven
- [x] "Begrijp HOE hackers denken voordat je je verdedigt" is correcte beveiligingspedagogie
- [x] STEP_COMPLETE criteria bouwen op elkaar voort — je moet aanvallen begrijpen voor je verdediging kunt uitleggen
- [x] "Defensief onderwijs" is expliciet verankerd in REGELS-sectie
- [x] Moeilijkheidsgraad "Medium" correct voor J2

**Bronbestanden:** `config/agents/year2.tsx:2617-2689`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drie stappen volgen een logische escalatie: (1) begrijpen waarom wachtwoorden zwak zijn, (2) verdedigingsmiddelen leren, (3) beleid schrijven voor de school. Het STEP_COMPLETE voor stap 1 vereist dat leerlingen ZOWEL zwakke wachtwoorden kunnen uitleggen ALS het verschil kennen tussen brute-force en dictionary attacks — dit is een sterke combinatie die begrip op twee niveaus toetst.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Brute-force tijdschattingen correct — 6 tekens ~10 seconden, 12 tekens ~200 jaar
- [x] Dictionary attack correct uitgelegd — @ voor a, 0 voor o zijn bekende substituties
- [x] Credential stuffing correct benoemd
- [x] Passphrase-entropie correct — "4 willekeurige woorden = ~40+ bits" is correct
- [x] "Lengte wint van complexiteit" is een bewezen beveiligingsprincipe (NIST SP 800-63B)
- [x] 2FA uitleg correct — iets dat je WEET + iets dat je HEBT
- [x] Wachtwoordmanager-aanbevelingen zijn actueel (Bitwarden, 1Password)
- [x] REGELS-sectie bevat correcte ethische begrenzing — defensief onderwijs, geen aanvalstechnieken

**Bronbestanden:** `config/agents/year2.tsx:2636-2690`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend en technisch accuraat. De brute-force tijdschattingen zijn realistisch. Het NIST-principe "lengte wint van complexiteit" is correct en actueel. De REGELS-sectie is exemplarisch voor veiligheidsonderwijs: leer nooit aanvalstechnieken, gebruik alleen geanonimiseerde voorbeelden, waarschuw als leerlingen echte wachtwoorden delen. Geen spelfouten gevonden.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` minimaal 500 tekens — ~2800 tekens, meest uitgebreid na privacy-by-design
- [x] EERSTE BERICHT aanwezig — pakkend, top-5 wachtwoorden, direct activerende vraag
- [x] STEP_COMPLETE markers aanwezig (3/3) — met uitgebreide bevestigingszinnen
- [x] REGELS-sectie aanwezig — ethische begrenzing expliciet
- [x] "Vier het als de leerling iets ontdekt dat tegenstrijdig lijkt" is een uitstekend coaching-principe

**Bronbestanden:** `config/agents/year2.tsx:2609-2690`

**Score:** 5 / 5

**Opmerkingen:**
> Een van de rijkste systemInstructions in J2P2. Bijzonder sterk: de bevestigingszinnen bij elk STEP_COMPLETE ("Je denkt nu als een beveiligingsexpert", "Je kent nu de drie belangrijkste verdedigingslagen") geven leerlingen positieve reinforcement. De waarschuwing bij het delen van echte wachtwoorden ("Stop! Deel nooit je echte wachtwoord") is essentieel voor veilig leren.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] PuzzleLab biedt puzzel-gebaseerde interactie
- [x] maxScore: 100 met badge-systeem
- [x] Drie puzzels sluiten aan op de drie leerstappen
- [x] Concrete voorbeelden (top-10 zwakke wachtwoorden) zijn interactief te analyseren

**Score:** 4 / 5

**Opmerkingen:**
> De PuzzleLab-template is goed geschikt voor wachtwoordbeveiliging. Leerlingen analyseren wachtwoorden en beantwoorden vragen. Beperking: de PuzzleLab biedt geen echte wachtwoordsterkte-meter die leerlingen kunnen testen — de interactie is meer analytisch dan hands-on. Dit is een bewuste keuze (focus op begrip, niet op tools), maar vermindert de directe feedback.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig in PuzzleLab-config
- [x] maxScore: 100
- [x] takeaways aanwezig
- [x] `goalCriteria` en `primaryGoal` aanwezig
- [x] Missie heeft geen `bonusChallenges` field — maar de `steps` array biedt structuur

**Bronbestanden:** `config/agents/year2.tsx:2691-2708`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsstructuur. De `primaryGoal` en `goalCriteria` zijn aanwezig. De PuzzleLab-config bevat badges en takeaways. De stap-beschrijvingen zijn motiverend geformuleerd.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] SLO 23A (Privacy en veiligheid) — correct, wachtwoordbeveiliging is kern van 23A
- [x] Mapping-opmerking ("wachtwoordbeveiliging = puur veiligheid") is een correct onderscheid
- [x] Geen 21A-claim — terecht, het gaat om beveiliging, niet digitale basisvaardigheden
- [x] Geen conflict tussen mapping en content

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:116`

**Score:** 5 / 5

**Opmerkingen:**
> De SLO-koppeling is correct. 23A omvat digitale veiligheid en privacybescherming, waaronder wachtwoordbeveiliging. De mapping-opmerking is helder.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau passend voor J2 (13-16 jaar)
- [x] Wachtwoord-sterktemetertje gebruikt zowel kleur als text-symbolen (`██████░░`) — kleur is niet de enige indicator
- [x] Top-10 wachtwoorden zijn tekstueel (niet in tabel of kleur-gebaseerd)
- [x] PuzzleLab-template heeft structurele toegankelijkheid
- [x] Concrete analogieën ("brute-force is als ALLE sleutels aan een sleutelbos proberen") zijn toegankelijk voor alle leerprofielen

**Score:** 5 / 5

**Opmerkingen:**
> De sterktemetertje gebruikt zowel Unicode blokken (`██████░░`) als kleur — dit is toegankelijker dan alleen kleur. De top-10 wachtwoorden zijn in een genummerde tekstlijst. De analogieën zijn inclusief voor visuele en auditieve leerprofielen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | 10 miljard statistic, top-5 direct in EERSTE BERICHT |
| 2. Visueel | 5 | ×1 = 5 | Creatieve visualPreview, geen hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Aanval → Verdediging → Beleid is correct |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | NIST-principe correct, ethische begrenzing exemplarisch |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Rijke systemInstruction, bevestigingszinnen bij STEP_COMPLETE |
| 6. Interactiviteit | 4 | ×1 = 4 | PuzzleLab goed, geen live wachtwoord-sterkte-tool |
| 7. Afronding & feedback | 5 | ×1 = 5 | primaryGoal, goalCriteria, badges compleet |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23A correct |
| 9. Toegankelijkheid | 5 | ×1 = 5 | Unicode + kleur, analogieën inclusief |
| **TOTAAL** | | **54 / 55** | |

### Gewogen totaal

```
(5×1) + (5×1) + (5×2) + (5×2) + (5×1) + (4×1) + (5×1) + (5×1) + (5×1) = 54
Percentage = (54 / 55) × 100% = 98,2%
```

### Verdict

**✅ Klaar voor inzet** (98,2%)

> Een uitstekende missie met een van de rijkste systemInstructions in het platform. De ethische begrenzing (defensief onderwijs), de NIST-correcte inhoud en de creatieve visualPreview maken dit tot een sterke referentiemissie voor cybersecurity-onderwijs.

---

### Actielijst

#### Verbeterpunten (nice-to-have)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 6. Interactiviteit | Overweeg een interactieve wachtwoord-sterkte-tester toe te voegen aan de PuzzleLab (zonder echte wachtwoorden te verwerken) | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
