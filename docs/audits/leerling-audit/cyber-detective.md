# Audit — Cyber Detective (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `cyber-detective` |
| **Titel** | Cyber Detective |
| **Leerjaar & Periode** | Leerjaar 3, Periode 2 |
| **Template-engine** | PuzzleLab |
| **SLO-kerndoelen** | 23A (Veiligheid & Privacy), 21A (Digitale systemen) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en uitnodigend — "Cyber Detective" is herkenbaar en spannend
- [x] `introDescription` geeft een concreet scenario: bedrijf gehackt, data op dark web
- [x] Emoji 🔍 past bij het detective/speur-thema
- [x] Moeilijkheidsgraad "Hard" is correct voor J3 havo/vwo
- [x] `introFeatures` (4 bullets) beschrijven het leerpad duidelijk: loganalyse, aanvallen herkennen, bewijs verzamelen, rapport opstellen

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/cyber-detective.ts:3-16`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. Het dark web/hack-scenario is spannend en relevant voor J3. De vier features beschrijven een echte forensische workflow.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] PuzzleLab-template heeft een bewezen lay-out
- [x] De serverlogbestanden zijn in een code-blok weergegeven (backtick-formaat in de description) — goed leesbaar
- [ ] Badge-kleuren zijn hardcoded: `#F59E0B`, `#6B7280`, `#10B981`, `#3B82F6`
- [x] Geen complexe grafieken — de lay-out is tekst-gebaseerd

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/cyber-detective.ts:132-157`

**Score:** 4 / 5

**Opmerkingen:**
> PuzzleLab scoort goed visueel. De logbestanden in code-blokken zijn de juiste visuele keuze voor dit thema. De hardcoded badge-kleuren zijn de enige stijlovertreding.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw: Aanvalsmethode herkennen (puzzel 1) → Bewijs veiligstellen (puzzel 2) → Aanvalsmethoden onderscheiden (puzzel 3) → Tijdlijn reconstrueren (puzzel 4)
- [x] Elke puzzel bouwt voort op kennis uit de vorige
- [x] Moeilijkheid past bij leerjaar — "Hard" voor J3
- [x] STEP_COMPLETE markers aanwezig (3/3): sporen geïdentificeerd → aanvalsmethode benoemd → forensisch rapport geschreven
- [x] Clue-systeem met `revealExtraAfterAttempts: 2` geeft goede scaffolding
- [x] `maxAttempts` per puzzel voorkomt raden zonder nadenken

**Bronbestanden:** `config/agents/year3.tsx:608-611`, `components/missions/templates/puzzle-lab/configs/cyber-detective.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De progressie van herkennen naar reconstrueren is een authentieke forensische workflow. De tijdlijn-puzzel (puzzel 4) is een sterke afsluiting die alle kennis integreert.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Brute force aanval correct geïdentificeerd via logpatroon (snelle opeenvolgende mislukte pogingen)
- [x] Forensische kopie + hash-waarde correct als bewijssafetieprocedure
- [x] Phishing herkenning correct: typosquatting (bedrijff.nl), urgentietaal, neplink
- [x] Tijdlijn-antwoord "2-4-1-3" is correct: brute force → inloggen → data stelen → dark web
- [x] "Chain of custody" correct uitgelegd
- [x] Geen aantoonbare spelfouten
- [ ] Kleine issue: successMessage puzzel 2 bevat "Juist! Een forensische kopie bewaard" — "bewaard" moet "bewaart" zijn

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/cyber-detective.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De logboek-simulatie is realistisch en correct. De spelfout "bewaard" in de successMessage is een kleine onzorgvuldigheid.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim voldoende
- [x] EERSTE BERICHT aanwezig — "URGENT — Cybermisdrijf gemeld."
- [x] STEP_COMPLETE markers aanwezig voor alle drie stappen (3/3)
- [x] Toon past bij de rolnaam — "ervaren Cyber Detective" combineert gezag met begeleiding
- [x] SCOPE GUARD: "Geef nooit het antwoord — stel Socratische vragen"

**Bronbestanden:** `config/agents/year3.tsx:577-648`

**Score:** 5 / 5

**Opmerkingen:**
> De coach is volledig geconfigureerd. De Socratische aanpak ("Geef nooit het antwoord") is de juiste benadering voor een detectives-missie — leerlingen moeten zelf redeneren.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] PuzzleLab-format is boeiend en past goed bij het detective-thema
- [x] Vier puzzels met progressive clues zijn goed gestructureerd
- [x] Mix van multiple-choice (3 puzzels) en text-input (1 puzzel) geeft variatie
- [x] `hintCost` per puzzel voegt een strategische laag toe
- [x] Logboekfragmenten zijn realistisch en visueel aantrekkelijk

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/cyber-detective.ts`

**Score:** 5 / 5

**Opmerkingen:**
> PuzzleLab is de ideale template voor deze missie. Het detective-frame maakt de interactiviteit inherent boeiend.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig: 🏆 Hoofd Forensisch Analist (≥90), 🔍 Senior Cyber Detective (≥70), 🕵️ Junior Onderzoeker (≥40), 📋 Stagiair Forensics (≥0)
- [x] `maxScore: 100` is helder (4 puzzels × 25 punten)
- [x] `takeaways[]` aanwezig — 5 kernlessen over forensisch onderzoek
- [x] Badgeprogresie is thematisch consistent (stagiair → junior → senior → hoofd)

**Bronbestanden:** `components/missions/templates/puzzle-lab/configs/cyber-detective.ts:132-164`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende afrondingsset. De badge-progressie (stagiair → hoofd) is een motiverende carrière-metafoor.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 23A (Veiligheid & Privacy): aanvalsmethoden herkennen, bewijs veiligstellen, forensisch rapport zijn kern van veiligheidskennis
- [x] 21A (Digitale systemen): logbestanden analyseren, netwerkprotocollen begrijpen past bij systeemkennis
- [x] Mapping is consistent met `slo-kerndoelen-mapping.ts` (week 2, J3)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:163`

**Score:** 5 / 5

**Opmerkingen:**
> Dubbele SLO-koppeling goed onderbouwd. De combinatie van veiligheidskennis (23A) en systeemkennis (21A) reflecteert dat forensisch werk beide dimensies vereist.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo
- [x] Logboek-informatie is tekst-gebaseerd — geen kleurafhankelijkheid
- [x] Multiple-choice opties zijn tekst — geen pictogram-only UI
- [ ] Badge-kleuren zijn hardcoded hex
- [x] PuzzleLab heeft standaard focus states

**Score:** 4 / 5

**Opmerkingen:**
> Goede toegankelijkheid. De tekst-intensieve aard van de missie (logboeken, tijdlijnen) maakt het inherent toegankelijker dan visuele missies.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Spannend scenario, helder leerpad |
| 2. Visueel | 4 | ×1 = 4 | Logboeken in code-blok, badge hex-kleuren |
| 3. Didactische flow | 5 | ×2 = 10 | Forensische workflow, STEP_COMPLETE compleet |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Inhoudelijk sterk, één spelfout |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geconfigureerd, Socratisch |
| 6. Interactiviteit | 5 | ×1 = 5 | PuzzleLab ideaal voor detective-thema |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badge-progressie als carrière-metafoor |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23A+21A aantoonbaar aanwezig |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Tekst-first, badge hex-kleuren |
| **TOTAAL** | | **52 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (4×2) + (5×1) + (5×1) + (5×1) + (5×1) + (4×1) = 52
Percentage = (52 / 55) × 100% = 94,5%
```

### Verdict

**✅ Klaar** (94,5% — ruim boven de 80% drempel)

> Een van de sterkste missies in J3P2. Het forensische detective-frame is boeiend en didactisch effectief. Minimale verbeterpunten.

---

### Actielijst

#### Nice-to-haves (optioneel)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 4. Inhoudelijke correctheid | Spelfout corrigeren: "bewaard" → "bewaart" in successMessage van puzzel 2 |
| 2 | 2. Visueel | Badge hex-kleuren vervangen door `lab-*` tokens |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
