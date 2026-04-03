# Audit — Social Safeguard (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `social-safeguard` |
| **Titel** | Social Safeguard |
| **Leerjaar & Periode** | Leerjaar 1, Periode 3 |
| **Template-engine** | ScenarioEngine (4 rondes) |
| **SLO-kerndoelen** | 23B (welzijn), 23A (privacy) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Social Safeguard" en "Online Beschermer worden" is direct
- [x] `introDescription` geeft concrete verwachtingen — vier leerresultaten duidelijk beschreven
- [x] Visueel element past bij het thema — chatbubbles met "STOP PESTEN" badge is relevant en herkenbaar
- [x] Moeilijkheidsgraad voelbaar — "Medium" past bij het gevoelige onderwerp

**Bronbestanden:** `config/agents/year1.tsx:1787-1813`, `components/missions/templates/scenario-engine/configs/social-safeguard.ts:1-15`

**Score:** 4 / 5

**Opmerkingen:**
> Het intro is goed maar de `introDescription` in de ScenarioEngine-config ("Online conflicten kunnen snel escaleren...") is iets formeler dan ideaal voor J1. De chatbubble visual met "STOP PESTEN" is herkenbaar, maar de rode kleur kan al bij de eerste indruk een stressgevoel oproepen bij leerlingen die zelf ervaringen hebben. De gevoeligheidsinstructie (aanwezig in de systemInstruction) had ook in het introscherm kunnen staan.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren consistent — rode tint past bij het serieuze onderwerp
- [x] ScenarioEngine template is gestructureerd en proven
- [ ] Kleur via `lab-*` tokens — `color: '#EF4444'` is hardcoded hex
- [x] ScenarioEngine-template is responsive — standaard in het platform

**Bronbestanden:** `config/agents/year1.tsx:1791` (hardcoded hex)

**Score:** 4 / 5

**Opmerkingen:**
> De ScenarioEngine is een proven template. De rode kleur is thematisch passend maar kan intens zijn voor gevoelige leerlingen. De vier rondes (selecteer-correct, volgorde-prioriteit, binaire-keuze, selecteer-correct) bieden visuele afwisseling.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Herkennen → Handelen → Ingrijpen → Beschermen
- [x] Elke stap bouwt voort — je herkent eerst gevaarlijke situaties, leert dan de juiste volgorde, dan wanneer in te grijpen, dan hoe je je beschermt
- [x] Moeilijkheid past bij leerjaar — concrete schoolscenario's, geen abstract
- [x] SAFE-ACT protocol (Stop, Save, Share, Secure) als kapstok voor de hele missie

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/social-safeguard.ts:50-386`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De vier rondes dekken alle aspecten van online veiligheid: Ronde 1 (herkennen wat gevaarlijk is), Ronde 2 (juiste volgorde van handelen — inclusief "screenshot vóór melden"), Ronde 3 (ingrijpen vs. niet ingrijpen), Ronde 4 (privacy-instellingen). Het SAFE-ACT protocol is een goede kapstok. De scenario's zijn schoolspecifiek en herkenbaar.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — doxing, identiteitsfraude, screenshot-protocol zijn correct beschreven
- [x] Juridische informatie correct — "Art. 139h Sr" niet aangehaald maar de strafbaarheid van heimelijk filmen is correct
- [x] Gevoeligheidsinstructie aanwezig — zowel in year1.tsx als in de ScenarioEngine-config
- [x] "Screenshot met context" correct uitgelegd — namen, datum, gesprek erboven
- [x] Zorgwekkende statuspost-scenario correct behandeld — verwijst naar inschakelen volwassene
- [x] Geen spelfouten gevonden

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/social-safeguard.ts:64-385`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De explanations zijn feitelijk correct en pedagogisch sterk. Bijzonder goed: de uitleg bij het doorsturen-scenario ("Zelfs met goede bedoelingen kan dit het slachtoffer beschadigen") en bij het zorgwekkende statusbericht ("Stuur een privébericht: 'Ik zag je post en maak me zorgen'"). De nuance dat blokkeren "zelfzorg, geen lafheid" is, is waardevolle framing voor J1.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] ScenarioEngine heeft ingebouwde feedback per ronde — vervangt STEP_COMPLETE structuur
- [x] `feedbackCorrect` en `feedbackIncorrect` per ronde aanwezig
- [x] `maxScore: 100` aanwezig
- [x] Chat systemInstruction aanwezig als aanvulling (year1.tsx) met EERSTE BERICHT en gevoeligheidsinstructie
- [x] Toon in systemInstruction is "rustig, duidelijk en niet veroordelend"
- [x] EERSTE BERICHT aanwezig in year1.tsx systemInstruction met expliciete disclaimer

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/social-safeguard.ts`, `config/agents/year1.tsx:1816-1854`

**Score:** 5 / 5

**Opmerkingen:**
> De ScenarioEngine-config is volledig en de chat-coach is een passende aanvulling. Het EERSTE BERICHT in year1.tsx bevat direct een gevoeligheidsdisclaimer — dit is correct voor een onderwerp als online pesten. De ScenarioEngine-feedback is specifiek genoeg ("De volgorde doet ertoe. Bewijs verzamelen moet eerder dan verwijderen").

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Vier rondetypes houden de aandacht vast — selecteren, ordenen, binaire keuze, selecteren
- [x] Scenario's zijn concreet en schoolspecifiek — nepaccount, doxing, groepsapp
- [x] Interactie sluit direct aan bij het leerdoel — keuzes maken in online conflicten
- [x] De ordervraag (Ronde 2) is bijzonder didactisch — benadrukt dat volgorde ertoe doet

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/social-safeguard.ts:50-385`

**Score:** 5 / 5

**Opmerkingen:**
> De ScenarioEngine biedt uitstekende interactiviteit voor dit onderwerp. Het order-priority-type in Ronde 2 is pedagogisch bijzonder sterk: leerlingen moeten zelf de juiste volgorde bepalen (screenshot eerst, dan melden), wat het dieper verankert dan alleen een multiple-choice vraag. De 8 items per ronde bieden voldoende diepgang zonder overweldigend te zijn.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges gedefinieerd — 4 badges: Online Beschermer (≥80), Veilige Omstander (≥60), Goed Begonnen (≥40), Blijf Oefenen (≥0)
- [x] `maxScore: 100` aanwezig
- [x] `takeaways` aanwezig — 5 concrete lessen (omstander-effect, screenshot-protocol, melden, blokkeren)
- [x] Per ronde `maxScore` gedistribueerd (4×25=100)
- [x] Badgedrempels zijn realistisch

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/social-safeguard.ts:17-49`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige en zinvolle afrondingsstructuur. De badge "Online Beschermer" is inhoudelijk sterk. De 5 takeaways zijn concreet en direct toepasbaar (het omstander-effect, screenshot met context, melden bij platform én volwassene, blokkeren als zelfzorg). Dit is een van de best afgeronde missies in J1P3.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht geclaimde kerndoelen — 23B (welzijn/veiligheid) en 23A (privacy/instellingen) zijn beide aanwezig
- [x] Mapping is intern consistent
- [x] Leerdoel is toetsbaar — scenario-keuzes zijn meetbaar via de ScenarioEngine-scoring
- [x] SAFE-ACT protocol is een duidelijk toetsbaar raamwerk

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts` (week 3, 23B + 23A)

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. 23B (welzijn en veiligheid online) is de kern van de missie. 23A (privacy) is aanwezig via Ronde 4 (privacy-instellingen). De mapping is correct en volledig.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — concrete schoolscenario's, begrijpelijke taal
- [x] Informatie niet uitsluitend via kleur — labels en beschrijvingen zijn tekstueel
- [x] Gevoeligheidsinstructie aanwezig — verwijst naar mentor/vertrouwenspersoon
- [x] ScenarioEngine-template is proven responsive
- [ ] Intense rode kleur en "STOP PESTEN" kunnen stressgevoel oproepen bij kwetsbare leerlingen — geen alternatieve visuele variant aanwezig

**Bronbestanden:** `config/agents/year1.tsx:1800-1812` (visual preview)

**Score:** 4 / 5

**Opmerkingen:**
> De missie is goed toegankelijk voor de doelgroep. De gevoeligheidsinstructie is aanwezig en werkt correct. Het enige toegankelijkheidspunt is dat de rode kleur en het "STOP PESTEN" label potentieel triggerende signalen zijn voor leerlingen die zelf pestervaring hebben — een rustigere kleurvariant voor de visual zou dit verminderen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 4 | ×1 = 4 | Goed, gevoeligheidswaarschuwing ontbreekt in intro |
| 2. Visueel | 4 | ×1 = 4 | ScenarioEngine proven, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | SAFE-ACT als kapstok, 4 rondes |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Uitstekend, nuanced, correct |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Gevoeligheidsinstructie + ScenarioEngine |
| 6. Interactiviteit | 5 | ×1 = 5 | Order-priority bijzonder sterk |
| 7. Afronding & feedback | 5 | ×1 = 5 | Volledig: badges + takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23B + 23A volledig aanwezig |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, rode kleur punt van aandacht |
| **TOTAAL** | | **48 / 55** | |

### Gewogen totaal

```
(4×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (4×1) = 48
Percentage = (48 / 55) × 100% = 87,3%
```

### Verdict

**✅ Klaar** (87,3% — ruim boven de 80% drempel)

> Social Safeguard is een van de sterkste missies in J1P3. De ScenarioEngine-implementatie is volledig en correct, de inhoud is feitelijk sterk en pedagogisch genuanceerd, en de afrondingsstructuur is compleet. Geen blokkerende issues.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

Geen blokkerende issues.

#### Verbeterpunten (score 4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 1. Eerste indruk | Gevoeligheidswaarschuwing ook zichtbaar op het introscherm toevoegen (nu alleen in chat-systemInstruction). | Medium |
| 2 | 9. Toegankelijkheid | Alternatieve, minder intense kleur voor visual preview overwegen voor kwetsbare leerlingen. | Laag |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 2. Visueel | Hardcoded hex `#EF4444` vervangen door `lab-*` token. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
