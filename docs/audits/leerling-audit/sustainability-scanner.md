# Audit — Sustainability Scanner (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `sustainability-scanner` |
| **Titel** | Sustainability Scanner |
| **Leerjaar & Periode** | Leerjaar 2, Periode 4 |
| **Template-engine** | data-viewer |
| **SLO-kerndoelen** | 23C (Maatschappij & Ethiek) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en herkenbaar — "Sustainability Scanner" klinkt tech en groen
- [x] `introDescription` is prikkelend — "Bereken de verborgen milieu-impact van jouw favoriete technologie"
- [x] `problemScenario` is direct relevant — elke Google-zoekopdracht kost CO2, streaming is energieslurpend
- [x] Moeilijkheidsgraad passend — "Medium" klopt voor onderzoek en berekening
- [x] `examplePrompt` is concreet en verrassend — "Hoeveel CO2 kost het om een uur Netflix te kijken?"

**Bronbestanden:** `config/agents/year2.tsx:2422-2433`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. Het scenario (datacenters verbruiken evenveel stroom als kleine landen) is een feitelijk correcte eye-opener die direct de aandacht trekt. De examplePrompt is perfect voor de doelgroep: Netflix is dagelijkse realiteit, de CO2-impact is onbekend. De groene kleur past bij duurzaamheid.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Kleurenschema consistent — green-to-emerald-800 gradient past bij duurzaamheid
- [x] Visual preview is thematisch correct — blad-icoon als duurzaamheidsymbool
- [ ] Hardcoded kleurwaarde — `color: '#16A34A'` is hardcoded hex
- [x] Preview is eenvoudig maar effectief — zon-gloed rechtsboven, groen blad centraal
- [x] Responsive — eenvoudige absolute positionering

**Bronbestanden:** `config/agents/year2.tsx:2427, 2434-2440`

**Score:** 4 / 5

**Opmerkingen:**
> Goede visuele presentatie. Het blad-icoon is universeel herkenbaar als duurzaamheidssymbool. De zon-gloed in de rechterbovenhoek en de groene gradient versterken het milieu-thema. Standaard hardcoded hex afwijking.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische 3-stappenopbouw — Energieverbruik onderzoeken → Impact berekenen → Alternatieven voorstellen
- [x] Elke stap bouwt voort op de vorige — je kunt geen alternatieven voorstellen zonder de impact te kennen
- [x] Moeilijkheid past bij leerjaar 2 — berekeningen worden omgezet naar begrijpelijke vergelijkingen
- [x] Stap-voorbeelden zijn concreet — "dagelijks gamegebruik = 5 uur lamp branden"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3) met kwantitatieve criteria

**Bronbestanden:** `config/agents/year2.tsx:2461-2464, 2475-2491`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drie stappen volgen het onderzoekscyclus: meten → begrijpen → handelen. De STEP_COMPLETE criteria zijn sterk: "omgezet naar begrijpelijke vergelijking", "over een jaar berekend", "minimaal 3 haalbare alternatieven". De eis van "haalbare" alternatieven voorkomt dat leerlingen onrealistische oplossingen bedenken.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk?

**Checkpunten:**
- [x] Informatie is inhoudelijk correct — datacenters, e-waste, mineralen, energieverbruik zijn reële factoren
- [x] De bewustwordings-disclaimer is correct — "realistische maar vereenvoudigde getallen, doel is bewustwording"
- [x] Vergelijkingen zijn een didactisch sterk hulpmiddel — "10 keer met de auto naar school rijden"
- [x] SLO-kerndoel 23C klopt — milieu-impact van tech is een maatschappelijke kwestie
- [ ] Getallen over CO2-uitstoot van streaming variëren sterk in literatuur — de missie geeft geen specifieke bronnen

**Bronbestanden:** `config/agents/year2.tsx:2441-2474`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk sterk met een terechte disclaimer over vereenvoudiging. De vier impact-categorieën (datacenters, e-waste, mineralen, energieverbruik) zijn alle vier reëel en relevant. Kleine kanttekening: CO2-cijfers voor streaming variëren aanzienlijk tussen bronnen (IEA, Carbon Trust) — leerlingen moeten weten dat de getallen schattingen zijn, wat de missie wel vermeldt ("gebruik realistische maar vereenvoudigde getallen").

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1000 tekens
- [x] EERSTE BERICHT aanwezig en prikkelend — "🌱 Sustainability Scanner — online gaan voor het klimaat!"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)
- [x] Verificatiecriteria zijn specifiek — "omgezet naar begrijpelijke vergelijking", "over een jaar berekend"
- [x] Toon past bij de rol — duurzaamheidsexpert die concreet en positief coacht
- [x] SCOPE GUARD aanwezig — klimaatpolitiek terugsturen naar digitale duurzaamheid
- [x] Farming-detectie via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year2.tsx:2441-2474`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coach. Het EERSTE BERICHT met de concrete vergelijking ("één Google-zoekopdracht kost CO₂, streaming van 1 uur video = gloeilamp die brandt") is een directe eye-opener. De SCOPE GUARD is slim gekozen: klimaatpolitiek is een reëel afwaaldoel, digitale duurzaamheid is de focus.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Chatformat past bij onderzoeken en berekenen
- [x] Vrije keuze van technologie — gaming, streaming, social media, AI
- [x] Berekeningen omzetten naar analogieën is een actieve cognitieve taak
- [x] Alternatieven bedenken is creatief en praktisch
- [ ] Geen rekentool of grafische vergelijking — leerlingen doen berekeningen in tekst

**Bronbestanden:** `config/agents/year2.tsx:2433, 2475-2491`

**Score:** 4 / 5

**Opmerkingen:**
> De chat-interactie werkt goed voor onderzoek en berekening. Het omzetten van abstracte energiecijfers naar begrijpelijke analogieën is een interessante cognitieve taak. Een eenvoudige rekencalculator of vergelijkingstabel zou de missie versterken, maar is geen blokkeerder.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is?

**Checkpunten:**
- [ ] `goalCriteria` niet gedefinieerd
- [ ] Geen badges gedefinieerd
- [ ] Geen `takeaways[]` aanwezig
- [x] `bonusChallenges: null`
- [x] STEP_COMPLETE (3/3) geeft functionele voortgang

**Bronbestanden:** `config/agents/year2.tsx:2492`

**Score:** 2 / 5

**Opmerkingen:**
> Zelfde structureel tekort. Een badge als "Green Tech Analyst" of "Digital Carbon Auditor" zou goed passen. Takeaways over de digitale voetafdruk en concrete reductiestappen zouden het leermoment vastleggen.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren?

**Checkpunten:**
- [x] 23C (maatschappij) — leerling analyseert maatschappelijke impact van digitale technologie
- [ ] 23B ontbreekt in mapping — de systemInstruction vermeldt 23B (standpunt innemen) maar mapping heeft alleen 23C
- [x] Mapping-annotatie correct — "milieu-impact = maatschappij"
- [x] Leerdoelen zijn toetsbaar via STEP_COMPLETE criteria

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:141`, `config/agents/year2.tsx:2449`

**Score:** 4 / 5

**Opmerkingen:**
> Goede SLO-aansluiting voor 23C. De systemInstruction vermeldt ook 23B (standpunt innemen over digitale vraagstukken) wat ook wordt geoefend in de alternatievenstap. De mapping-keuze (alleen 23C) is verdedigbaar maar 23B is ook aanwezig in de missie-activiteiten.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn er toegankelijkheidsproblemen?

**Checkpunten:**
- [x] Leesniveau past bij leerjaar 2 — wetenschappelijke begrippen worden toegankelijk gemaakt
- [x] Analogieën maken abstracte getallen begrijpelijk voor alle niveaus
- [ ] Visual preview bevat geen alt-teksten
- [x] Geen informatie uitsluitend via kleur
- [x] Schrijven en berekenen zijn inclusieve activiteiten

**Bronbestanden:** `config/agents/year2.tsx:2434-2440`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. De analogieën (lampen branden, autorijden) maken de missie toegankelijk voor verschillende niveaus. Leerlingen die moeite hebben met abstracte getallen profiteren extra van deze aanpak. Alt-teksten ontbreken bij de preview.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Eye-opening scenario, directe relevantie |
| 2. Visueel | 4 | ×1 = 4 | Blad-preview goed, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Meten → begrijpen → handelen |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Correct, vereenvoudiging bewust en correct gedocumenteerd |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geïmplementeerd |
| 6. Interactiviteit | 4 | ×1 = 4 | Analogieën actief, geen rekentool |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges of takeaways |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 23C sterk, 23B ook aanwezig maar niet geclaimd |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Analogieën verhogen toegankelijkheid |
| **TOTAAL** | | **43 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (4×2) + (5×1) + (4×1) + (2×1) + (4×1) + (4×1) = 43
Percentage = (43 / 55) × 100% = 78,2%
```

### Verdict

**⚠️ Needs work** (78,2% — net onder de 80% drempel)

> Sterke missie met een actueel en relevant onderwerp. Het enige significante tekort is het ontbreken van afrondingselementen. Met badges en takeaways scoort deze missie direct boven de 80%. De inhoudelijke kwaliteit en didactische opbouw zijn excellent.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, takeaways of goalCriteria. | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 8. SLO | Overweeg 23B toe te voegen aan mapping — leerlingen nemen een standpunt in bij de alternatievenstap. | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 7. Afronding | Badge "Green Tech Analyst" toevoegen. |
| 2 | 6. Interactiviteit | Eenvoudige CO2-calculator als sidebar toevoegen (bijv. kWh → CO2 → analogie). |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
