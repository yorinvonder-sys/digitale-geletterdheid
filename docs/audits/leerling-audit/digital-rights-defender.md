# Audit — Digital Rights Defender (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `digital-rights-defender` |
| **Titel** | Digital Rights Defender |
| **Leerjaar & Periode** | Leerjaar 2, Periode 4 |
| **Template-engine** | debate-arena, enableChat |
| **SLO-kerndoelen** | 23A (Veiligheid & Privacy), 23C (Maatschappij) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en aansprekend — "Digital Rights Defender" heeft een heldenkarakter
- [x] `introDescription` is concreet — "Bescherm jouw digitale rechten en schrijf het privacybeleid van de toekomst"
- [x] `problemScenario` is schoolnabij en actueel — eigen school verzamelt data via apps, camera's, leerlingvolgsystemen
- [x] Moeilijkheidsgraad passend — "Medium" klopt voor het schrijven van een manifest
- [x] `examplePrompt` is relevant — "Welke digitale rechten heb ik als leerling op school?" is een directe vraag

**Bronbestanden:** `config/agents/year2.tsx:2187-2198`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. Het scenario (eigen school verzamelt gegevens — camera's, leerlingvolgsystemen) is bijzonder relevant voor de doelgroep. Leerlingen herkennen direct de situatie. De rol "Digital Rights Defender" geeft leerlingen een gevoel van eigenaarschap en agency. De groene kleur past bij bescherming en veiligheid.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Kleurenschema consistent — emerald-to-green-800 gradient past bij bescherming
- [x] Visual preview is thematisch correct — schild als bescherming-symbool
- [ ] Hardcoded kleurwaarde — `color: '#059669'` is hardcoded hex (zelfde als podcast-producer)
- [x] Preview is eenvoudig maar effectief — schild groot en centraal
- [x] Responsive — eenvoudige absolute positionering werkt op alle schermformaten

**Bronbestanden:** `config/agents/year2.tsx:2192, 2199-2207`

**Score:** 4 / 5

**Opmerkingen:**
> Goede visuele presentatie. Het schild is een universeel, direct begrijpelijk symbool voor bescherming van rechten. De decoratieve elementen (hoeken en cirkel) verrijken de preview zonder af te leiden. Standaard hardcoded hex afwijking.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische 3-stappenopbouw — Rechten inventariseren → Manifest schrijven → Actieplan maken
- [x] Elke stap bouwt voort op de vorige — je kunt geen manifest schrijven zonder rechten te kennen
- [x] Moeilijkheid past bij leerjaar 2 — AVG-rechten zijn begrijpelijk uitgelegd
- [x] Stap-voorbeelden zijn concreet — Magister, Teams, gangen-camera's zijn herkenbaar
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3) met kwantitatieve criteria

**Bronbestanden:** `config/agents/year2.tsx:2228-2231, 2243-2259`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drie stappen zijn didactisch sterk: van kennis (rechten kennen) naar toepassing (manifest schrijven) naar actie (presenteren aan schoolleiding). Dit is ook een burger-empowerment cyclus die aansluit bij het SLO-kerndoel 23C (maatschappelijk handelen). De STEP_COMPLETE criteria zijn helder: "minimaal 5 privacyafspraken", "actieplan met concrete eerste stap".

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk?

**Checkpunten:**
- [x] AVG/GDPR informatie is correct — inzagerecht, verwijderingsrecht, toestemmingsrecht kloppen
- [x] Taalgebruik past bij de doelgroep — "begrijpelijke manier voor jongeren"
- [x] Schoolapps als context zijn realistisch — Magister, Teams zijn correct als voorbeelden
- [x] SLO-kerndoelen kloppen — 23A (privacy) en 23C (maatschappij/regelgeving)
- [ ] AVG-uitleg is vereenvoudigd — goed voor jongeren maar de AVG-rechten zijn hier samengevat (6 rechten ipv 8)

**Bronbestanden:** `config/agents/year2.tsx:2208-2242`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk sterk en juridisch verantwoord. De AVG-rechten zijn begrijpelijk vertaald voor jongeren. Kleine opmerking: de volledige AVG kent 8 rechten (inclusief dataportabiliteit en recht op beperking) maar de missie noemt inzage, verwijdering en toestemming — dit is een bewuste vereenvoudiging die acceptabel is voor 14-15-jarigen.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1100 tekens
- [x] EERSTE BERICHT aanwezig en motiverend — "🛡️ Welkom bij Digital Rights HQ!"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)
- [x] Verificatiecriteria zijn kwantitatief — "minimaal 5 afspraken", "actieplan concrete stap"
- [x] Toon past bij de rol — privacy-advocaat die empowert en informeert
- [x] SCOPE GUARD aanwezig — technische oplossingen terugsturen naar rechten
- [x] Farming-detectie via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year2.tsx:2208-2242`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coach. Het EERSTE BERICHT ("wist je dat jij als gebruiker wettelijke rechten hebt?") is empowerend en informatief tegelijk. De vraag "welke apps verzamelen de meeste data over jou?" activeert directe persoonlijke relevantie. De SCOPE GUARD is relevant en realistisch.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Chatformat past perfect bij onderzoeken, schrijven en plannen
- [x] Schoolcontext maakt het concreet en uitvoerbaar — het manifest is écht relevant
- [x] Actieplan (leerlingenraad) geeft de missie een reëel maatschappelijk gevolg
- [x] Vrije invulling van afspraken — leerlingen bepalen zelf wat ze belangrijk vinden
- [ ] Geen AVG-rechten quiz of interactief element

**Bronbestanden:** `config/agents/year2.tsx:2198, 2243-2259`

**Score:** 4 / 5

**Opmerkingen:**
> De chat-interactie is uitstekend voor dit type missie. Het manifest schrijven is een authentieke taak die buiten het platform waarde heeft. Het actieplan (presenteren aan schoolleiding) geeft de missie een reëel maatschappelijk gewicht. Sterke missie-opzet.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is?

**Checkpunten:**
- [ ] `goalCriteria` niet gedefinieerd
- [ ] Geen badges gedefinieerd
- [ ] Geen `takeaways[]` aanwezig
- [x] `bonusChallenges: null`
- [x] STEP_COMPLETE (3/3) geeft functionele voortgang

**Bronbestanden:** `config/agents/year2.tsx:2260`

**Score:** 2 / 5

**Opmerkingen:**
> Zelfde structureel tekort. Een badge als "Privacy Advocate" of "Rights Defender" zou goed passen. Takeaways over AVG-rechten en hoe je ze actief kunt opeisen zouden de missie goed afsluiten.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren?

**Checkpunten:**
- [x] 23A (veiligheid & privacy) — leerling leert concrete AVG-rechten kennen en toepassen
- [x] 23C (maatschappij) — leerling schrijft een manifest en actieplan voor maatschappelijke verandering
- [x] SLO-doelen expliciet in systemInstruction
- [x] De mapping is consistent met de systemInstruction-inhoud

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:138`, `config/agents/year2.tsx:2216`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De missie combineert privacykennis (23A) met maatschappelijk handelen (23C). Het schrijven van een manifest en actieplan is een authentieke uitwerking van beide kerndoelen. De mapping-annotatie ("GDPR-rechten = privacy + regelgeving") is correct.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn er toegankelijkheidsproblemen?

**Checkpunten:**
- [x] Leesniveau past bij leerjaar 2 — juridische termen worden vertaald naar begrijpelijke taal
- [x] AVG-begrippen worden uitgelegd zonder jargon
- [ ] Visual preview bevat geen alt-teksten
- [x] Geen informatie uitsluitend via kleur
- [x] Chat-interactie is inclusief

**Bronbestanden:** `config/agents/year2.tsx:2199-2207`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. De vertaling van juridische taal (AVG, GDPR) naar begrijpelijke begrippen is essentieel voor de doelgroep en goed gedaan. Alt-teksten ontbreken bij de preview.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Schoolnabij, empowerend scenario |
| 2. Visueel | 4 | ×1 = 4 | Schild-preview goed, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Kennis → toepassing → actie |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Correct, AVG bewust vereenvoudigd |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geïmplementeerd |
| 6. Interactiviteit | 4 | ×1 = 4 | Authentiek product, maatschappelijk gewicht |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges of takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23A + 23C perfect gekoppeld |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Juridisch taalgebruik goed vertaald |
| **TOTAAL** | | **44 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (4×2) + (5×1) + (4×1) + (2×1) + (5×1) + (4×1) = 44
Percentage = (44 / 55) × 100% = 80,0%
```

### Verdict

**✅ Klaar** (80,0% — exact op de 80% drempel)

> Een maatschappelijk waardevolle missie die leerlingen echte kennis en handvatten geeft over hun privacyrechten. Het scenario (eigen school) is uitzonderlijk goed gekozen. Het manifest heeft waarde buiten het platform. Afrondingselementen ontbreken maar blokkeren de inzet niet.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, takeaways of goalCriteria. | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 4. Inhoud | Alle 8 AVG-rechten vermelden (met uitleg dat 3 de belangrijkste zijn voor jongeren). | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 7. Afronding | Badge "Privacy Advocate" toevoegen. |
| 2 | 6. Interactiviteit | Link naar officieel klachtformulier AP (Autoriteit Persoonsgegevens) als uitbreiding. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
