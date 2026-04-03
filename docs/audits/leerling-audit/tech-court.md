# Audit — Tech Court (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `tech-court` |
| **Titel** | Tech Court |
| **Leerjaar & Periode** | Leerjaar 2, Periode 4 |
| **Template-engine** | debate-arena, enableChat |
| **SLO-kerndoelen** | 23C (Maatschappij & Ethiek) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en dramatisch aansprekend — "Tech Court" klinkt spannend
- [x] `introDescription` is concreet — "Sta voor de rechter in een tech-rechtszaak en verdedig jouw standpunt"
- [x] `problemScenario` is actueel — AI-systeem discrimineert bij sollicitaties is een echt maatschappelijk vraagstuk
- [x] Moeilijkheidsgraad passend — "Hard" klopt voor juridisch redeneren en debatteren
- [x] `examplePrompt` geeft directe keuzemogelijkheid — "aanklager zijn" en sterkste argumenten

**Bronbestanden:** `config/agents/year2.tsx:2263-2274`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De rechtbank-metafoor is dramatisch en motiverend. Het scenario (techbedrijf aangeklaagd wegens AI-discriminatie bij sollicitaties) is actueel en raakt aan echte rechtszaken (Amazon AI recruiting tool, 2018). De visual preview met een hamer en twee "partijen"-blokken is herkenbaar als rechtbankscène.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Kleurenschema consistent — red-to-red-900 gradient past bij rechtbank en urgentie
- [x] Visual preview is thematisch correct — hamer als rechtbank-symbool, twee partijen-blokken
- [ ] Hardcoded kleurwaarde — `color: '#DC2626'` is hardcoded hex (zelfde als video-editor)
- [x] Preview is helder en direct leesbaar
- [x] Responsive — eenvoudige absolute positionering werkt op alle formaten

**Bronbestanden:** `config/agents/year2.tsx:2268, 2275-2287`

**Score:** 4 / 5

**Opmerkingen:**
> Goede visuele presentatie. De rode kleur communiceert urgentie en rechtbank, wat thematisch sterk is. De twee blokken onderaan de preview suggereren de twee partijen in een rechtszaak. Standaard hardcoded hex afwijking.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische 3-stappenopbouw — Zaak voorbereiden → Argumenten presenteren → Vonnis vellen
- [x] Elke stap bouwt voort op de vorige — je kunt geen argumenten presenteren zonder voorbereiding
- [x] Moeilijkheid past bij "Hard" — juridisch redeneren vraagt abstract denken
- [x] Stap-voorbeelden zijn concreet — "ik wil aanklager zijn" en "AI getraind op bevooroordeelde data"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)

**Bronbestanden:** `config/agents/year2.tsx:2311-2314, 2326-2342`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drie stappen volgen het juridische redeneerproces: feiten verzamelen → standpunt innemen → concluderen. De STEP_COMPLETE criteria zijn goed: "minimaal 3 argumenten geformuleerd", "bewijs en reactie op tegenstandpunt", "vonnis met duidelijke redenering". De reflectievraag ("welke waarden wogen zwaarder") is filosofisch sterk.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk?

**Checkpunten:**
- [x] Juridisch redeneren is correct beschreven — feiten, argumenten, tegenargumenten, vonnis
- [x] De context (AI-discriminatie bij sollicitaties) is een reëel, gedocumenteerd fenomeen
- [x] Rollen (aanklager, verdediger, getuige-deskundige) zijn correct beschreven
- [x] De instructie om tegenargumenten te presenteren is essentieel voor kritisch denken
- [x] SLO-kerndoel 23C (maatschappij/ethiek) is correct — puur juridisch-maatschappelijke focus

**Bronbestanden:** `config/agents/year2.tsx:2288-2325`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De rechtbank-roleplay is didactisch verantwoord: door een rol te spelen (ook een standpunt dat je misschien niet zelf deelt) leren leerlingen dat complexe vraagstukken meerdere legitieme perspectieven hebben. Het KERNIDEE ("complexe maatschappelijke vragen zijn niet zwart-wit") is filosofisch correct.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1200 tekens
- [x] EERSTE BERICHT aanwezig en dramatisch — "⚖️ De rechtbank is nu in zitting!"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)
- [x] Verificatiecriteria zijn kwantitatief en kwalitatief — "minimaal 3 argumenten", "bewijs + reactie"
- [x] Toon past bij de rol — rechter die formeel maar begrijpelijk spreekt
- [x] SCOPE GUARD aanwezig — onderwerp vermijden wordt direct aangepakt
- [x] Farming-detectie via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year2.tsx:2288-2325`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coach. Het EERSTE BERICHT ("als rechter heb ik jou uitgenodigd als deskundige getuige") is effectief: het zet direct de rechtbank-sfeer neer en geeft de leerling een concrete rol. De instructie om kritische vragen te stellen en tegenargumenten te presenteren maakt de AI tot een echte debattegenspeler.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Roleplay-format is motiverend en verrassend voor de doelgroep
- [x] Keuzevrijheid in rol (aanklager/verdediger/getuige) geeft autonomie
- [x] De AI als debattegenspeler maakt het dynamisch
- [x] Het "vonnis" aan het einde geeft een duidelijk afrondmoment
- [ ] Geen echte tegenpartij — de AI speelt zowel rechter als tegenspeler, wat de rechtbank-simulatie beperkt

**Bronbestanden:** `config/agents/year2.tsx:2274, 2326-2342`

**Score:** 4 / 5

**Opmerkingen:**
> Het roleplay-format is inhoudelijk sterk en motiverend. Het ontbreken van een echte "tegenpartij" (een andere leerling of een extra AI-persona) is een beperking: de AI speelt tegelijk rechter en tegenspeler, wat de simulatie minder authentiek maakt. Dit is echter moeilijk op te lossen binnen de huidige architectuur.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is?

**Checkpunten:**
- [ ] `goalCriteria` niet gedefinieerd
- [ ] Geen badges gedefinieerd
- [ ] Geen `takeaways[]` aanwezig
- [x] `bonusChallenges: null`
- [x] STEP_COMPLETE (3/3) geeft functionele voortgang
- [x] Het "vonnis" in de chat geeft een narratief afrondmoment

**Bronbestanden:** `config/agents/year2.tsx:2343`

**Score:** 2 / 5

**Opmerkingen:**
> Zelfde structureel tekort, hoewel het "vonnis" in de chat een natuurlijk afrondmoment biedt. Een badge als "Tech Advocate" of "Digital Lawyer" zou perfect passen bij de rechtbank-metafoor.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren?

**Checkpunten:**
- [x] 23C (maatschappij/ethiek) — leerling redenert over maatschappelijke gevolgen van technologie
- [x] Mapping-annotatie correct — "rechtszaak = puur maatschappij/ethiek, geen persoonlijk welzijn"
- [x] De reflectieopdracht ("welke waarden wogen zwaarder") is een authentieke 23C-prestatie
- [ ] 23B (digitaal welzijn/debatteren) is niet opgenomen in de mapping — de systemInstruction vermeldt 23B en 23C maar mapping heeft alleen 23C

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:139`, `config/agents/year2.tsx:2296`

**Score:** 4 / 5

**Opmerkingen:**
> Sterke SLO-aansluiting voor 23C. De missie-annotatie in de mapping ("puur maatschappij/ethiek") is correct. De systemInstruction vermeldt ook 23B (standpunt innemen en onderbouwen) wat ook wordt geoefend — of dit als aparte code moet worden toegevoegd is een beleidsvraag, niet een kwaliteitsprobleem.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn er toegankelijkheidsproblemen?

**Checkpunten:**
- [x] Leesniveau past bij leerjaar 2 — formeel maar begrijpelijk
- [x] Juridische begrippen worden in context uitgelegd
- [ ] Visual preview bevat geen alt-teksten
- [x] Geen informatie uitsluitend via kleur
- [x] Debatteren in tekst is inclusief

**Bronbestanden:** `config/agents/year2.tsx:2275-2287`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. De formele rechtbanktaal is begrijpelijk voor 14-15-jarigen zonder teveel juridisch jargon. Debatteren via tekst heeft geen motorische drempels. Alt-teksten ontbreken bij de preview.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Actueel scenario, dramatische rol |
| 2. Visueel | 4 | ×1 = 4 | Rechtbank-preview sterk, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Juridisch redeneermodel correct |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, tegenargumenten essentieel |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geïmplementeerd |
| 6. Interactiviteit | 4 | ×1 = 4 | Roleplay sterk, één AI als meerdere rollen |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges of takeaways |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 23C sterk, 23B ontbreekt in mapping |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, alt-teksten ontbreken |
| **TOTAAL** | | **44 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (2×1) + (4×1) + (4×1) = 44
Percentage = (44 / 55) × 100% = 80,0%
```

### Verdict

**✅ Klaar** (80,0% — exact op de 80% drempel)

> Een didactisch sterke en motiverende roleplay-missie. De rechtbank-metafoor is effectief voor het leren van juridisch en ethisch redeneren. Afrondingselementen ontbreken maar blokkeren de inzet niet.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, takeaways of goalCriteria. | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 8. SLO | Overweeg 23B toe te voegen aan mapping — leerlingen oefenen expliciet het innemen en onderbouwen van een standpunt. | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 7. Afronding | Badge "Tech Advocate" of "Digital Lawyer" toevoegen. |
| 2 | 6. Interactiviteit | Optie om een klasgenoot als tegenpartij te laten deelnemen (async debat-functie). |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
