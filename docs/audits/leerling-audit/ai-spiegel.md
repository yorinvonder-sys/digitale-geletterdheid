# Audit — De AI Spiegel (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `ai-spiegel` |
| **Titel** | De AI Spiegel |
| **Leerjaar & Periode** | Leerjaar 1, Periode 3 |
| **Template-engine** | SimulationLab (3 interactieve simulaties) |
| **SLO-kerndoelen** | 23A (privacy), 23B (welzijn), 21C (data) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "De AI Spiegel" is intrigerend en relevant
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — drie simulaties duidelijk beschreven
- [x] Visueel element past bij het thema — spiegel-emoji met advertentieprofiel-labels (Gamer, Sport, Muziek) is visueel sterk
- [x] Moeilijkheidsgraad voelbaar — "Easy" klopt voor de simulatievorm

**Bronbestanden:** `config/agents/year1.tsx:1647-1675`, `components/missions/templates/simulation-lab/configs/ai-spiegel.ts:148-155`

**Score:** 5 / 5

**Opmerkingen:**
> De combinatie van de spiegel-metafoor ("Wie ben jij voor adverteerders?") en de concrete labels (🎮 Gamer, ⚽ Sport, 🎵 Muziek) communiceert het concept direct. De SimulationLab-engine biedt een gestructureerd intro met `introFeatures` die de drie simulaties previeuwen.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren consistent — violet/purple gradient via Tailwind
- [x] Animaties zijn niet afleidend — `animate-pulse` op spiegel-emoji is subtiel
- [ ] Kleur via `lab-*` tokens — `color: '#E8956F'` op het agent-object is hardcoded hex
- [x] SimulationLab-template zorgt voor gestructureerde weergave met sliders en toggles

**Bronbestanden:** `config/agents/year1.tsx:1652` (hardcoded hex), `components/missions/templates/simulation-lab/configs/ai-spiegel.ts`

**Score:** 4 / 5

**Opmerkingen:**
> De SimulationLab-template biedt gestructureerde visuele weergave met meters, staafdiagrammen en vergelijkingstabellen. Dit is een van de visueel rijkste templates in het platform. De computeVisuals-functie is goed geïmplementeerd met drie verschillende weergavetypes (meter, bar-chart, comparison). Enig punt: hardcoded hex kleur.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Sim 1 (profiel opbouwen) → Sim 2 (instellingen checken) → Sim 3 (filterbubbel)
- [x] Elke sim bouwt voort op de vorige — je bouwt eerst een profiel, dan zie je welke instellingen het voeden, dan de gevolgen (filterbubbel)
- [x] Moeilijkheid past bij leerjaar — sliders en toggles zijn laagdrempelig voor J1
- [x] Vragen na elke simulatie verdiepen het begrip (3 multiple-choice vragen per sim)

**Bronbestanden:** `components/missions/templates/simulation-lab/configs/ai-spiegel.ts:157-395`

**Score:** 5 / 5

**Opmerkingen:**
> De conceptuele opbouw is excellent: eerst begrijp je hoe een profiel ontstaat (kijktijd, likes, locatie), dan zie je welke instellingen jouw privacyblootstelling bepalen, en dan zie je het resultaat (filterbubbel). Dit is een van de sterkste didactische structuren in J1P3. De vragen na elke simulatie testen daadwerkelijk begrip, niet alleen observatie.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — kijktijd vs. likes uitleg klopt ("kijktijd is moeilijker te manipuleren")
- [x] Privacy-instellingennavigatie correct — "Instellingen → Privacy & Beveiliging → [Soort toegang]" klopt voor iOS
- [x] Filterbubbel-definitie correct — "algoritmes die je steeds meer van hetzelfde laten zien"
- [x] Democratiepunt aanwezig — "Als iedereen zijn eigen informatiebel heeft, praten mensen langs elkaar heen"
- [x] Kansen én risico's van personalisatie besproken — evenwichtig

**Bronbestanden:** `components/missions/templates/simulation-lab/configs/ai-spiegel.ts:192-394`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De vraag "Wat is de KANS van een goed gepersonaliseerd platform?" (naast het risico) is een sterke didactische keuze die balans bevordert. De iOS-navigatieinstructie is correct. De uitleg over filterbubbels en democratie is genuanceerd en op niveau.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] SimulationLab heeft gestructureerde vragen per simulatie — vervangt STEP_COMPLETE-structuur
- [x] Vragen hebben expliciete `correctAnswer` en `explanation` — verificatie ingebouwd in template
- [x] `maxScore` per simulatie gedefinieerd (30 + 40 + 30 = 100)
- [x] Chat-component ook aanwezig via year1.tsx systemInstruction — maar SimulationLab is primair
- [ ] Chat systemInstruction mist STEP_COMPLETE markers — maar SimulationLab vervangt dit

**Bronbestanden:** `components/missions/templates/simulation-lab/configs/ai-spiegel.ts:165-394`, `config/agents/year1.tsx:1677-1767`

**Score:** 4 / 5

**Opmerkingen:**
> De SimulationLab-template heeft een ingebouwde verificatiestructuur via multiple-choice vragen met correctAnswer en uitleg. Dit is functioneel equivalent aan STEP_COMPLETE. Er zijn wel twee instructie-lagen (de chat systemInstruction én de SimulationLab-config) — onduidelijk welke primair is bij gebruik. De chat-instructie mist STEP_COMPLETE, maar als SimulationLab het primaire interactie-medium is, is dit geen blokkeerder.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Sliders en toggles zijn direct en intuïtief — geen instructie nodig
- [x] Visuele feedback is direct — profielmeter reageert op sliderwijzigingen in realtime
- [x] Drie verschillende visualisatietypes houden de aandacht vast (meter, barchart, comparison)
- [x] Multiple-choice vragen na elke sim testen begrip
- [x] Parameters koppelen direct aan het leerdoel (locatie-toggle → profielnauwkeurigheid)

**Bronbestanden:** `components/missions/templates/simulation-lab/configs/ai-spiegel.ts:158-395`

**Score:** 5 / 5

**Opmerkingen:**
> De interactiviteit van de SimulationLab is het sterkste element van deze missie. Het directe visuele feedback-systeem (slider bewegen → meter verandert) maakt abstract begrip (dataprofiel) concreet en voelbaar. Dit is uitstekend experiential learning voor J1.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges gedefinieerd in SimulationLab-config — 4 badges (Privacy Expert, Bewuste Digitale Burger, Data Detective, Aan het leren)
- [x] `maxScore: 100` gedefinieerd
- [x] `takeaways` aanwezig — 5 concrete leerlessen
- [x] Per simulatie een score (30+40+30=100)
- [x] Badgedrempels zijn realistisch (90, 70, 50, 0)

**Bronbestanden:** `components/missions/templates/simulation-lab/configs/ai-spiegel.ts:397-429`

**Score:** 5 / 5

**Opmerkingen:**
> De SimulationLab-config heeft een volledige afrondingsstructuur: badges, scoring, en takeaways. De 5 takeaways zijn concreet en direct toepasbaar ("Controleer regelmatig via Instellingen → Privacy & Beveiliging"). De badgedrempels zijn realistisch. Dit is een van de weinige J1P3-missies met een complete afrondingsstructuur.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht de geclaimde SLO-kerndoelen — 23A (privacy-instellingen), 23B (welzijn via filterbubbel), 21C (data analyseren)
- [x] Mapping is intern consistent
- [x] Leerdoel is toetsbaar — simulations met correcte antwoorden zijn meetbaar

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts` (week 3, 23A + 23B + 21C)

**Score:** 4 / 5

**Opmerkingen:**
> Goede SLO-aansluiting. De drie simulaties corresponderen direct met de drie kerndoelen: Sim 1 (profiel) = 21C, Sim 2 (instellingen) = 23A, Sim 3 (filterbubbel) = 23B. Kleine noot: 23B (welzijn) is in de SLO-mapping geclaimd maar de directe link naar welzijn is in de missie voornamelijk via filterbubbel-bewustzijn — minder direct dan bij Scroll Stopper.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — simulaties zijn direct en visueel
- [x] Kleur in barcharts gecombineerd met labels — niet alleen kleurafhankelijk
- [x] Sliders en toggles zijn toetsenbord-bedienbaar (afhankelijk van implementatie)
- [ ] iOS-specifieke navigatie-instructie — Android-gebruikers missen een equivalent

**Bronbestanden:** `components/missions/templates/simulation-lab/configs/ai-spiegel.ts`

**Score:** 4 / 5

**Opmerkingen:**
> De SimulationLab-interface is over het algemeen toegankelijk. De barchart-kleuren worden gecombineerd met tekstlabels. Enig punt: de vraag "Waar ga je op je iPad om app-permissies te controleren?" verwijst specifiek naar iOS-navigatie — Android-pad ontbreekt.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Spiegel-metafoor werkt direct |
| 2. Visueel | 4 | ×1 = 4 | Rijke SimulationLab UI, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Profiel → Instellingen → Filterbubbel |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, evenwichtig |
| 5. AI-coach kwaliteit | 4 | ×1 = 4 | SimulationLab vervangt STEP_COMPLETE |
| 6. Interactiviteit | 5 | ×1 = 5 | Beste interactiviteit in J1P3 |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges + takeaways volledig |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 3 kerndoelen, 23B indirect |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, iOS-specifiek punt |
| **TOTAAL** | | **47 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (4×1) + (5×1) + (5×1) + (4×1) + (4×1) = 47
Percentage = (47 / 55) × 100% = 85,5%
```

### Verdict

**✅ Klaar** (85,5% — boven de 80% drempel)

> De AI Spiegel is een van de sterkste missies in J1P3. De SimulationLab-template biedt uitstekende interactiviteit, een complete afrondingsstructuur met badges en takeaways, en een didactisch sterke opbouw. De missie is klaar voor inzet zonder blokkerende verbeteringen.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

Geen blokkerende issues.

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 9. Toegankelijkheid | Android-navigatieinstructie toevoegen bij Sim 2 (huidige iOS-instructie is te specifiek). | Medium |
| 2 | 5. AI-coach kwaliteit | Relatie tussen chat-coach (year1.tsx) en SimulationLab-config verduidelijken — welke is primair? | Laag |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 2. Visueel | Hardcoded hex `#E8956F` vervangen door `lab-*` token. |
| 2 | 8. SLO-aansluiting | 23B-link versterken door een expliciet welzijn-onderdeel in Sim 3 (filterbubbel en mentale gezondheid). |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
