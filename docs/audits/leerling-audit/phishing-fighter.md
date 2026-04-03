# Audit — Phishing Fighter (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `phishing-fighter` |
| **Titel** | Phishing Fighter |
| **Leerjaar & Periode** | Leerjaar 3, Periode 2 |
| **Template-engine** | ScenarioEngine |
| **SLO-kerndoelen** | 23A (Veiligheid & Privacy), 22A (Digitale producten) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en uitnodigend — "Phishing Fighter" is actief en herkenbaar
- [x] `introDescription` maakt het belang direct duidelijk — "meest voorkomende cyberaanval ter wereld" is een krachtig feit
- [x] Emoji 🎣 past perfect bij het phishing-thema (hengel/vissen = nep-bericht uitwerpen)
- [x] Moeilijkheidsgraad "Medium" is passend voor deze herkennings-missie
- [x] `introFeatures` (4 bullets) beschrijven gevarieerde leeractiviteiten: herkennen, rangschikken, testen, ontdekken

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/phishing-fighter.ts:3-15`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De statistiek "meest voorkomende cyberaanval" creëert onmiddellijke relevantie. De 🎣 emoji is een slimme metafoor.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] ScenarioEngine-template heeft een bewezen responsive lay-out
- [x] Scenario-items hebben icons (📧, ⚠️, 🔗, etc.) die visuele variatie geven
- [ ] Badge-kleuren zijn hardcoded: `#F59E0B`, `#10B981`, `#6B6B66`
- [x] E-mail simulaties zijn goed opgemaakt — domeinnamen zijn leesbaar
- [x] Binary-choice (echt/nep) heeft een duidelijke visuele interface

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/phishing-fighter.ts`

**Score:** 4 / 5

**Opmerkingen:**
> ScenarioEngine scoort goed visueel. De pictogram-per-item aanpak maakt de scenario's scanbaar. Badge hex-kleuren zijn de enige stijlovertreding.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw: Rode vlaggen herkennen → Gevaarlijkste aanval rangschikken → Echt of nep testen → Bescherming kiezen
- [x] Elke ronde bouwt op de vorige — je kunt pas bescherming kiezen als je weet wat gevaarlijk is
- [x] Moeilijkheidsgraad "Medium" past — de select-correct en binary-choice zijn toegankelijk
- [x] STEP_COMPLETE markers aanwezig (3/3): rode vlaggen benoemd → trainingsopzet beschreven → scenario beschreven
- [x] Feedbackteksten per ronde zijn leerzaam en bemoedigend

**Bronbestanden:** `config/agents/year3.tsx:798-801`, `components/missions/templates/scenario-engine/configs/phishing-fighter.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De vier ronde-types testen verschillende cognitieve niveaus: herkennen → prioritiseren → toepassen → evalueren. Dit is een Bloom's taxonomy progressie.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Typosquatting (sch00l-portal.nl) correct geïdentificeerd en uitgelegd
- [x] Spear phishing als gevaarlijkste aanval correct gerangschikt (directeur + financieel verzoek)
- [x] DUO-beurs phishing correct geïdentificeerd (domein ≠ duo.nl, vraagt IBAN+BSN+wachtwoord)
- [x] WhatsApp-fraude correct als social engineering gelabeld
- [x] Google-melding correct als "kan echt zijn" (goed onderbouwde nuance)
- [x] 2FA als meest effectieve bescherming correct uitgelegd
- [x] "Hetzelfde sterke wachtwoord overal" correct als ONVEILIG gelabeld
- [x] Geen aantoonbare spelfouten
- [x] HTTPS-uitleg correct genuanceerd: "een nep-website kan ook HTTPS hebben"

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/phishing-fighter.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De nuance bij de Google-beveiligingsmelding ("kan echt zijn — maar controleer het adres") is precies het juiste niveau voor J3. De uitleg dat HTTPS niet gelijkstaat aan veiligheid is een veelvoorkomende misconceptie die hier correct wordt gecorrigeerd.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim voldoende
- [x] EERSTE BERICHT aanwezig — "Alarm! De schooldirecteur heeft net gebeld."
- [x] STEP_COMPLETE markers aanwezig voor alle drie stappen (3/3)
- [x] Toon past bij de rolnaam — "Phishing Fighter" is urgentievol en betrokken
- [x] SCOPE GUARD: "Gebruik alleen gesimuleerde, duidelijk neppe voorbeelden"

**Bronbestanden:** `config/agents/year3.tsx:766-840`

**Score:** 5 / 5

**Opmerkingen:**
> Volledig geconfigureerde coach. De schoolcontext in het EERSTE BERICHT is relevant en herkenbaar voor leerlingen.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] ScenarioEngine met vier ronde-types (select-correct, order-priority, binary-choice, select-correct) is gevarieerd
- [x] Binary-choice "Echt of nep?" is een boeiend format voor phishing-herkenning
- [x] Order-priority ronde met 5 aanvallen geeft inzicht in risiconiveaus
- [x] 8 items per select-correct ronde is goed gedoseerd (4 correct, 4 niet-correct in ronde 1)
- [x] Feedbackteksten zijn leerzaam en variëren per item

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/phishing-fighter.ts`

**Score:** 5 / 5

**Opmerkingen:**
> ScenarioEngine is de ideale template voor deze missie. De "Echt of nep?" ronde is bijzonder effectief — leerlingen leren niet alleen fouten te herkennen maar ook echte berichten te vertrouwen.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig: 🛡️ Phishing Expert (≥80), 🔍 Waakzame Detective (≥60), 📚 Goed Begonnen (≥40), 🌱 Blijf Oefenen (≥0)
- [x] `maxScore: 100` is helder (4 rondes × 25 punten)
- [x] `takeaways[]` aanwezig — 5 praktische tips die direct toepasbaar zijn
- [x] Badgenames zijn motiverend en thematisch

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/phishing-fighter.ts:17-49`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsset. De takeaways zijn praktische gedragsregels ("Controleer altijd het e-mailadres", "Zweef altijd over een link") die leerlingen direct kunnen toepassen — hoge praktische waarde.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 23A (Veiligheid & Privacy): phishing-herkenning en -verdediging zijn kern van veiligheidskennis
- [x] 22A (Digitale producten): het ontwerpen van een anti-phishing training is een digitaal product maken
- [x] Mapping is consistent met `slo-kerndoelen-mapping.ts` (week 2, J3)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:165`

**Score:** 5 / 5

**Opmerkingen:**
> De 22A-koppeling is goed gemotiveerd door het missie-doel ("ontwerp een anti-phishing training"). De STEP_COMPLETE-criteria bevestigen dit: stap 2 vereist een trainingsopzet met doelgroep.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo — scenario's zijn realistisch maar begrijpelijk
- [x] Scenario-items gebruiken zowel pictogram als tekst — niet alleen kleur
- [x] Binary-choice knoppen zijn groot en duidelijk gelabeld
- [x] Select-correct items zijn tekst-gebaseerd
- [ ] Badge-kleuren zijn hardcoded hex
- [ ] Order-priority ronde (drag-and-drop) is niet volledig toetsenbord-toegankelijk

**Score:** 3 / 5

**Opmerkingen:**
> Drag-and-drop in de order-priority ronde is hetzelfde toegankelijkheidsprobleem als bij ReviewArena. Voor leerlingen zonder muis of touchscreen is de rangschikkingsronde lastig. Dit is een template-niveau probleem.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Relevante statistiek, sterke haak |
| 2. Visueel | 4 | ×1 = 4 | Pictogram per item, badge hex-kleuren |
| 3. Didactische flow | 5 | ×2 = 10 | Bloom-progressie, STEP_COMPLETE compleet |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Uitstekend, nuances correct |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geconfigureerd |
| 6. Interactiviteit | 5 | ×1 = 5 | Binary-choice format is bijzonder effectief |
| 7. Afronding & feedback | 5 | ×1 = 5 | Praktische takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23A+22A aantoonbaar aanwezig |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Drag-drop niet toetsenbord-toegankelijk |
| **TOTAAL** | | **53 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (3×1) = 53
Percentage = (53 / 55) × 100% = 96,4%
```

### Verdict

**✅ Klaar** (96,4% — ruim boven de 80% drempel)

> Een van de best uitgevoerde missies in het platform. Inhoudelijk correct, didactisch sterk, praktisch toepasbaar. Drag-drop toegankelijkheid is het enige aandachtspunt.

---

### Actielijst

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 9. Toegankelijkheid | Order-priority ronde: toetsenbord-alternatief toevoegen voor de rangschikking (template-niveau) | Medium |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 2. Visueel | Badge hex-kleuren vervangen door `lab-*` tokens |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
