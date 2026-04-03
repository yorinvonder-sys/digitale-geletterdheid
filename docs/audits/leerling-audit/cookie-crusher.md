# Audit — Cookie Crusher (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `cookie-crusher` |
| **Titel** | Cookie Crusher |
| **Leerjaar & Periode** | Leerjaar 1, Periode 3 |
| **Template-engine** | ScenarioEngine (4 rondes) |
| **SLO-kerndoelen** | 23A (privacy), 23C (maatschappij/regelgeving) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Cookie Crusher" met 🍪 is direct herkenbaar
- [x] `introDescription` geeft concrete verwachting — "Herken manipulatieve cookie-popups" is duidelijk
- [x] Visueel element past bij het thema — gesimuleerde cookie-popup met grote groene accepteerknop en piepkleine "instellingen..." tekst is directe illustratie van dark patterns
- [x] Moeilijkheidsgraad voelbaar — "Easy" klopt, herkenbare alledaagse situatie

**Bronbestanden:** `config/agents/year1.tsx:2291-2314`, `components/missions/templates/scenario-engine/configs/cookie-crusher.ts:1-15`

**Score:** 5 / 5

**Opmerkingen:**
> De visual preview is didactisch excellent: de gesimuleerde cookie-popup toont direct het probleem (grote groene "ACCEPTEER ALLES" knop, piepklein "instellingen..." linkje, rode ! badge). De leerling ziet in één oogopslag wat dark patterns zijn. De introductietekst is prikkelend: "Elke dag klikken miljoenen mensen op 'Accepteer alles' zonder na te denken."

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren consistent — amber achtergrond voor de cookie-popup preview past thematisch
- [x] ScenarioEngine-template is proven responsive
- [ ] Kleur via `lab-*` tokens — `color: '#F59E0B'` is hardcoded hex
- [x] De popup-visual is wit op licht achtergrond — goed leesbaar

**Bronbestanden:** `config/agents/year1.tsx:2296` (hardcoded hex)

**Score:** 4 / 5

**Opmerkingen:**
> De visual preview bootst een echte cookie-popup na, inclusief de groene "ACCEPTEER ALLES" knop — dat is een krachtige didactische keuze. De ScenarioEngine-template zorgt voor een consistente, responsive ervaring.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Herkennen dark patterns → Rangschikken ernst → Accepteren of weigeren → Welke data staat op het spel
- [x] Elke ronde bouwt voort op de vorige — je kunt pas rangschikken als je weet wat dark patterns zijn
- [x] Moeilijkheid past bij leerjaar — concrete, herkenbare situaties
- [x] De volgorde (herkennen → ernst beoordelen → beslissen → consequenties begrijpen) is pedagogisch solide

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/cookie-crusher.ts:50-386`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De vier rondes dekken het onderwerp volledig: van het herkennen van trucs (Ronde 1) naar het begrijpen van de ernst (Ronde 2) naar het oefenen van beslissen (Ronde 3) naar het begrijpen van de consequenties (Ronde 4: welke data staat op het spel). Dit is een complete leerervaring.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — AVG-regels over dark patterns correct beschreven
- [x] "Vooraf aangevinkte vakjes zijn verboden door de AVG voor opt-in toestemming" klopt
- [x] "De AVG eist dat weigeren net zo makkelijk is als accepteren" is correct
- [x] Cross-site tracking via third-party cookies correct beschreven
- [x] Gezondheidsdata als gevoelig geclassificeerd klopt met AVG bijzondere persoonsgegevens
- [x] Geen spelfouten gevonden
- [x] Taalgebruik passend voor J1 — "dwell time" wordt uitgelegd als "hoe lang je ergens naar kijkt"

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/cookie-crusher.ts:64-384`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De uitleg bij de schoolplatform-situatie (Ronde 3, item 5) is bijzonder sterk: "Geen weigeroptie = geen echte toestemming. Dit schoolplatform gedraagt zich illegaal. Meld dit aan je docent." Dit is pedagogisch correct en empower leerlingen met kennis over hun rechten.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] ScenarioEngine heeft ingebouwde feedback per ronde — `feedbackCorrect` en `feedbackIncorrect`
- [x] `maxScore: 100` aanwezig (4×25=100)
- [x] Chat systemInstruction aanwezig als aanvulling (year1.tsx) — inclusief popup-simulatie format
- [x] EERSTE BERICHT aanwezig in year1.tsx — "Hoi! 🍪 Ik ben je Cookie Crusher Coach!"
- [x] Geen STEP_COMPLETE markers nodig — ScenarioEngine-template vervangt dit
- [x] Farming-detectie actief via SYSTEM_INSTRUCTION_SUFFIX

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/cookie-crusher.ts:52-63`, `config/agents/year1.tsx:2362-2373`

**Score:** 5 / 5

**Opmerkingen:**
> De ScenarioEngine-config en de chat-instructie werken samen goed. De feedbackteksten per ronde zijn specifiek en leerzaam ("Zo hoort het te zijn. Eerlijke keuze, geen druk" voor de eerlijke popup). Het EERSTE BERICHT is enthousiast en duidelijk.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Vier rondetypes houden de aandacht vast — selecteren, ordenen, binaire keuze, selecteren
- [x] Herkenbare alledaagse situaties (Ronde 3: gezondheidswebsite, spelletjessite, webshop, nieuwssite, schoolplatform, social media)
- [x] Order-priority ronde (meest manipulatief rangschikken) is didactisch sterk
- [x] Ronde 3 (accepteren of weigeren) heeft geen "goed" antwoord voor alle items — nuancering

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/cookie-crusher.ts:50-386`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende interactiviteit. De situaties in Ronde 3 zijn herkenbaar (schoolplatform is voor leerlingen direct relevant) en nuanceerd — de nieuwssite-situatie (betalen of advertenties accepteren) heeft een genuanceerde uitleg die beide keuzes als geldig beschouwt. Dit is pedagogisch sterker dan een simpele goed/fout-beoordeling.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges gedefinieerd — 4 badges: Cookie Detective (≥80), Privacy Waakzaam (≥60), Goed Begonnen (≥40), Blijf Oefenen (≥0)
- [x] `maxScore: 100` aanwezig
- [x] `takeaways` aanwezig — 5 concrete lessen (dark patterns, "Accepteer alles" is zelden in jouw belang, wettelijk recht)
- [x] Badgedrempels zijn realistisch

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/cookie-crusher.ts:17-49`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige en zinvolle afrondingsstructuur. De takeaway "'Accepteer alles' is bijna nooit in jouw belang — het is in het belang van de website" is een krachtige kernboodschap. De 5 takeaways zijn concreet en direct toepasbaar.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht geclaimde kerndoelen — 23A (privacy-rechten en databescherming) en 23C (AVG als maatschappelijk kader) zijn beide aanwezig
- [x] Mapping is intern consistent
- [x] Leerdoel toetsbaar — ScenarioEngine-scoring meet kennis van dark patterns en AVG
- [x] AVG-wetgeving expliciet behandeld in Ronde 1 en Ronde 3

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts` (week 3, 23A + 23C)

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De missie behandelt dark patterns als intersectie van 23A (privacyrechten) en 23C (wettelijk kader/AVG). De vier rondes samen zorgen voor een volledig begrip van beide kerndoelen.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — alledaagse context, begrijpelijke taal
- [x] Kleurinformatie gecombineerd met tekstlabels
- [x] ScenarioEngine-template is proven responsive en toegankelijk
- [x] Popup-visual gebruikt grootte en tekst naast kleur om dark patterns te illustreren

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/cookie-crusher.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende toegankelijkheid. De illustratie van dark patterns via grootte, positie én kleur (niet alleen kleur) maakt het begrip toegankelijk voor kleurenblinden. De herkenbare alledaagse situaties verlagen de drempel.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Cookie-popup preview is direct didactisch |
| 2. Visueel | 4 | ×1 = 4 | ScenarioEngine proven, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Volledige leerervaring in 4 rondes |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | AVG correct, nuancering uitstekend |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | ScenarioEngine + chat volledig |
| 6. Interactiviteit | 5 | ×1 = 5 | Herkenbaar, nuanceerd |
| 7. Afronding & feedback | 5 | ×1 = 5 | Volledig: badges + takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23A + 23C volledig aanwezig |
| 9. Toegankelijkheid | 5 | ×1 = 5 | Uitstekend |
| **TOTAAL** | | **50 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (5×1) = 50
Percentage = (50 / 55) × 100% = 90,9%
```

### Verdict

**✅ Klaar** (90,9% — ruim boven de 80% drempel)

> Cookie Crusher is de best scorende missie in J1P3. De ScenarioEngine-implementatie is volledig en van hoge kwaliteit: vier didactisch samenhangende rondes, een complete afrondingsstructuur, feitelijk correcte en genuanceerde inhoud, en uitstekende toegankelijkheid. Klaar voor directe inzet.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

Geen blokkerende issues.

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 2. Visueel | Hardcoded hex `#F59E0B` vervangen door `lab-*` token. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
