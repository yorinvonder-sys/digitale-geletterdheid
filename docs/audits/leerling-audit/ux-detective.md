# Audit — UX Detective (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `ux-detective` |
| **Titel** | UX Detective |
| **Leerjaar & Periode** | Leerjaar 2, Periode 3 |
| **Template-engine** | data-viewer (builder-canvas via chat) |
| **SLO-kerndoelen** | 22A (Digitale producten ontwerpen), 21B (Media & Informatie) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "UX Detective" is direct en prikkelend
- [x] `introDescription` geeft concrete opdracht — "Ontdek waarom sommige apps lekker werken en andere niet"
- [x] `problemScenario` is concreet en motiverend — het scenario van de app met slechte reviews is herkenbaar
- [x] Moeilijkheidsgraad zichtbaar — "Medium" past bij de analytische aard
- [x] `examplePrompt` geeft de leerling een vliegende start — "Ik wil de UX van de Spotify-app analyseren"

**Bronbestanden:** `config/agents/year2.tsx:1444-1531`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. Het scenario (slechte app-reviews, bedrijf huurt jou in) is motiverend en geeft de leerling een duidelijke rol. De kleur violet/purple past bij het thema analyse en ontdekking. De visual preview met een versimpelde app-mock-up maakt het concept direct visueel.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent? Is de tekst goed leesbaar?

**Checkpunten:**
- [x] Kleurenschema consistent — gradient violet-to-purple, past bij het thema
- [x] Visual preview illustreert het concept — gesimplificeerde app-interface is herkenbaar
- [x] Animaties niet afleidend — geen animaties in preview
- [ ] Hardcoded kleurwaarden — `color: '#E8956F'` is hardcoded hex in plaats van `lab-*` token
- [ ] Responsive onduidelijk — de visual preview bevat fixed-width elementen (`w-36`)

**Bronbestanden:** `config/agents/year2.tsx:1449, 1457-1472`

**Score:** 3 / 5

**Opmerkingen:**
> De visuele stijl is goed maar bevat dezelfde conventionele afwijking als andere missies: hardcoded hex-kleur op het agent-object. De preview-layout met `w-36` fixed-width kan problemen geven op zeer kleine schermen. Het concept van een gesimuleerde app-interface is didactisch slim maar de implementatie gebruikt `bg-white/10` semi-transparante lagen die op sommige achtergronden slecht afleesbaar zijn.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische 3-stappenopbouw — App verkennen → Problemen vinden → Verbeteringen ontwerpen
- [x] Elke stap bouwt voort op de vorige — analyse vóór ontwerp is didactisch correct
- [x] Moeilijkheid past bij leerjaar 2 — "Medium" is passend, leerlingen zijn vertrouwd met apps
- [x] Stap-voorbeelden zijn concreet en uitvoerbaar — Spotify-voorbeeld is realistisch
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)

**Bronbestanden:** `config/agents/year2.tsx:1500-1503, 1514-1530`

**Score:** 5 / 5

**Opmerkingen:**
> Exemplarische didactische opbouw. De drie stappen volgen de UX-onderzoekscyclus: observeren → analyseren → ontwerpen. Elk step heeft een concreet `example` veld dat leerlingen helpt om te beginnen. De STEP_COMPLETE criteria zijn helder en meetbaar (bijv. "minimaal 3 concrete observaties").

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk?

**Checkpunten:**
- [x] Informatie is feitelijk correct — UX-terminologie klopt
- [x] Begrippen worden uitgelegd — usability, navigatie, feedback, affordance, user flow
- [x] Taalgebruik past bij de leeftijdsgroep — informeel maar professioneel
- [x] Geen onnodige Engelse termen — "affordance" is vakterm die uitgelegd wordt
- [x] SLO-kerndoelen kloppen inhoudelijk — 22A (ontwerpen) en 21B (media analyseren)

**Bronbestanden:** `config/agents/year2.tsx:1484-1512`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De begrippen (usability, affordance, user flow) zijn correct gedefinieerd en worden uitgelegd wanneer relevant. De SCOPE GUARD is goed: "als de leerling technische oplossingen wil bouwen, stuur ze terug" — dit is didactisch correct want UX-research gaat over begrijpen, niet bouwen. De SLO-koppeling in de systemInstruction is expliciet vermeld.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1200 tekens, ruim voldoende
- [x] EERSTE BERICHT aanwezig en uitnodigend — "🕵️ UX Detective Bureau — zaak geopend!"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3) — correct geïmplementeerd
- [x] Verificatiecriteria zijn helder — "minimaal 3 concrete observaties", "minimaal 2 usability-problemen"
- [x] Toon past bij de rol — detectief-metafoor is consistent ("zaak geopend", "opsporen")
- [x] SCOPE GUARD aanwezig — technische afdwalingen worden teruggestuurd
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year2.tsx:1474-1513`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coach implementatie. Het EERSTE BERICHT is creatief en past bij de detectief-rol. De STEP_COMPLETE criteria zijn kwantitatief en controleerbaar. De SCOPE GUARD is relevant en realistisch. De toon is consistent met de UX Detective-identiteit.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Format past bij het leerdoel — open chat-analyse is perfect voor UX-onderzoek
- [x] Leerling heeft vrijheid in appkeuze — motiverende autonomie
- [x] Concrete analyse-opdrachten zorgen voor gerichte interactiviteit
- [x] `examplePrompt` verlaagt de drempel om te beginnen
- [ ] Geen visuele analyse-tools beschikbaar — leerlingen beschrijven UX in tekst, kunnen niet echt annotaties maken

**Bronbestanden:** `config/agents/year2.tsx:1455, 1514-1530`

**Score:** 4 / 5

**Opmerkingen:**
> Het open chatformat werkt goed voor UX-analyse: leerlingen kunnen elke app kiezen en krijgen gerichte coaching. Het ontbreken van een visuele annotatietool (bijv. een schermafbeelding kunnen inladen en annoteren) is een gemiste kans maar geen blokkeerder. De chat-interactie is rijk genoeg.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol?

**Checkpunten:**
- [ ] `goalCriteria` niet gedefinieerd — ontbreekt in mission-object
- [ ] Geen badges gedefinieerd
- [ ] Geen `takeaways[]` aanwezig
- [x] `bonusChallenges: null` — bewust geen bonusuitdagingen, begrijpelijk voor deze missie
- [x] Completion via STEP_COMPLETE (3/3) is wel functioneel geïmplementeerd

**Bronbestanden:** `config/agents/year2.tsx:1531`

**Score:** 2 / 5

**Opmerkingen:**
> De missie heeft geen expliciet afrondingselement: geen badges, geen takeaways, geen goalCriteria. De leerling weet dat de missie klaar is als de AI 3 STEP_COMPLETE markers heeft gestuurd, maar krijgt daarna geen samenvatting of beloning. Dit is een structureel tekort dat geldt voor de meeste J2P3-missies.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren?

**Checkpunten:**
- [x] 22A (Digitale producten ontwerpen) — de leerling ontwerpt daadwerkelijk verbeteringen
- [x] 21B (Media & Informatie analyseren) — de leerling analyseert een digitaal product
- [x] SLO-doelen zijn expliciet vermeld in de systemInstruction
- [x] Leerdoelen zijn (impliciet) toetsbaar via de STEP_COMPLETE criteria

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:124`, `config/agents/year2.tsx:1491`

**Score:** 4 / 5

**Opmerkingen:**
> De SLO-koppeling is sterk en consistent. De systemInstruction vermeldt expliciet de kerndoelen. Kleine verbetering: de leerling leert ook over "affordance" wat raakt aan 21A (digitale systemen begrijpen) maar dat is niet geclaimd. De match is correct en niet overdreven breed.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn focus states aanwezig? Kleurcontrast voldoende?

**Checkpunten:**
- [x] Leesniveau past bij leerjaar 2 (14-15 jaar) — helder, niet te complex
- [x] Vakjargon wordt verklaard — affordance, user flow worden uitgelegd
- [ ] Alt-teksten voor visual preview — preview is JSX zonder alt-attributen
- [ ] Kleurcontrast preview — witte elementen op wit/10 achtergrond, contrast mogelijk laag
- [x] Geen informatie uitsluitend via kleur — tekst is leidend

**Bronbestanden:** `config/agents/year2.tsx:1456-1472`

**Score:** 3 / 5

**Opmerkingen:**
> Het tekstuele deel is goed toegankelijk. De visual preview bevat elementen met lage dekking (`bg-white/10`, `bg-white/20`) die op sommige schermen slecht zichtbaar kunnen zijn. Voor de daadwerkelijke missie-interactie (chat) zijn er geen toegankelijkheidsproblemen voorzien.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Sterk scenario, goede rol |
| 2. Visueel | 3 | ×1 = 3 | Hardcoded hex, fixed-width preview |
| 3. Didactische flow | 5 | ×2 = 10 | Exemplarische opbouw |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, begrijpelijk, SLO-gekoppeld |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | EERSTE BERICHT + STEP_COMPLETE + SCOPE GUARD |
| 6. Interactiviteit | 4 | ×1 = 4 | Vrije appkeuze, geen visuele tools |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges, takeaways of goalCriteria |
| 8. SLO-aansluiting | 4 | ×1 = 4 | Sterke koppeling, leerdoelen kloppen |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Tekst goed, preview contrast laag |
| **TOTAAL** | | **43 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (5×2) + (5×1) + (4×1) + (2×1) + (4×1) + (3×1) = 43
Percentage = (43 / 55) × 100% = 78,2%
```

### Verdict

**⚠️ Needs work** (78,2% — net onder de 80% drempel)

> Sterke missie met uitstekende AI-coach structuur en didactische opbouw. Het enige significante tekort is het ontbreken van afrondingselementen (badges, takeaways, goalCriteria). Dit is een snel te repareren issue dat de missie direct naar ✅ zou tillen.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, takeaways of goalCriteria. Leerling krijgt geen samenvatting na voltooiing. | Product |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex `#E8956F` vervangen door `lab-*` token. | Laag |
| 2 | 9. Toegankelijkheid | Kleurcontrast preview-elementen verbeteren; `bg-white/10` is te laag contrast. | Medium |

#### Nice-to-haves (score 4 — optioneel)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Optie om een schermafbeelding in te laden voor visuele annotatie. |
| 2 | 8. SLO-aansluiting | Leerdoelen toetsbaar herformuleren in goalCriteria. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
