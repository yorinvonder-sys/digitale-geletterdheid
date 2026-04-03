# Audit — Brand Builder (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `brand-builder` |
| **Titel** | Brand Builder |
| **Leerjaar & Periode** | Leerjaar 2, Periode 3 |
| **Template-engine** | builder-canvas, enableChat |
| **SLO-kerndoelen** | 22A (Digitale producten ontwerpen) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en aansprekend — "Brand Builder" is direct herkenbaar
- [x] `introDescription` is concreet — "Ontwerp een complete visuele identiteit voor een merk"
- [x] `problemScenario` is motiverend — startup heeft dringend een nieuwe visuele identiteit nodig
- [x] Moeilijkheidsgraad passend — "Hard" is correct want merkidentiteit vraagt meer abstractie
- [x] `examplePrompt` is aansprekend — duurzame sneaker-startup is actueel en herkenbaar

**Bronbestanden:** `config/agents/year2.tsx:1809-1820`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. Het scenario (startup met visueel achterhaald ontwerp) is realistisch en geeft de leerling een duidelijke professionele rol. De moeilijkheidsgraad "Hard" is eerlijk: merkidentiteit vereist abstracte begrippen die leerlingen voor het eerst tegenkomen. De pink/rose kleurstelling past bij design en creativiteit.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Kleurenschema consistent — pink-to-rose gradient past bij het design-thema
- [x] Visual preview is creatief — palet-icoon met kleurbolletjes illustreert merkidentiteit
- [ ] Hardcoded kleurwaarden — `color: '#EC4899'` hardcoded hex, én de kleurbolletjes gebruiken hardcoded hex-array
- [ ] Kleurbolletjes-array in preview gebruikt hardcoded hex — `['#EC4899', '#E8956F', '#3B82F6', '#10B981']`
- [x] Responsive — preview gebruikt flexbox goed

**Bronbestanden:** `config/agents/year2.tsx:1814, 1821-1835`

**Score:** 3 / 5

**Opmerkingen:**
> De visuele preview is creatief (kleurbolletjes representeren een kleurenpalet) maar bevat meerdere hardcoded hex-kleuren, zowel in het agent-object als in de preview-elementen. Dit is een consistent patroon in J2P3-missies. Het paletconcept is didactisch slim: de preview laat zien wat de leerling gaat leren.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische 3-stappenopbouw — Doelgroep bepalen → Logo & stijl ontwerpen → Merkidentiteit presenteren
- [x] Elke stap bouwt voort op de vorige — je kunt geen logo ontwerpen zonder doelgroep te kennen
- [x] Moeilijkheid past bij "Hard" — van doelgroepanalyse naar visueel ontwerp naar presentatie
- [x] Stap-voorbeelden zijn concreet — EcoStep duurzame sneakers is een uitstekend doorlopend voorbeeld
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3) met kwalitatieve criteria

**Bronbestanden:** `config/agents/year2.tsx:1863-1866, 1877-1893`

**Score:** 5 / 5

**Opmerkingen:**
> Exemplarische didactische opbouw. De drie stappen volgen het authentieke brandingproces: strategisch (doelgroep + waarden) → visueel (logo + kleuren + typografie) → presentatie. De STEP_COMPLETE criteria zijn goed beschreven en realistisch haalbaar. Het doorgaande EcoStep-voorbeeld maakt de abstracte stappen concreet.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk?

**Checkpunten:**
- [x] Informatie is feitelijk correct — brandingterminologie klopt
- [x] Begrippen worden uitgelegd — huisstijl, merkwaarden, kleurenpalet, typografie, doelgroep
- [x] Taalgebruik past bij de doelgroep — zakelijk maar toegankelijk
- [x] Nuancering aanwezig — "de leerling hoeft geen echt logo te tekenen, maar moet het WEL beschrijven"
- [x] SLO-kerndoelen kloppen — 22A (ontwerpen) is correct

**Bronbestanden:** `config/agents/year2.tsx:1837-1876`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De instructie "stel vragen over WAAROM ze bepaalde kleuren of stijlen kiezen" is pedagogisch waardevol: het gaat om het redeneren, niet alleen het eindproduct. Het KERNIDEE is goed geformuleerd: "een sterk merk is een consistente belofte die in alles terugkomt". De Nike-anekdote ("was ooit gewoon Blue Ribbon Sports") is historisch correct.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1100 tekens
- [x] EERSTE BERICHT aanwezig en motiverend — "✨ Brand Studio — bouw jouw merk van scratch!"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)
- [x] Verificatiecriteria zijn kwalitatief goed — "logo-beschrijving, kleurenpalet met uitleg, typografie-keuze"
- [x] Toon past bij de rol — Brand Designer is professioneel en enthousiast
- [x] SCOPE GUARD aanwezig — businessplan-afdwalingen worden teruggestuurd
- [x] Farming-detectie via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year2.tsx:1837-1876`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coach. Het EERSTE BERICHT met de Nike-anekdote is sterk: het plaatst de missie in historisch perspectief en geeft de leerling het gevoel dat ook grote merken klein begonnen. De SCOPE GUARD is relevant — het is verleidelijk voor leerlingen om meteen een businessplan te gaan schrijven.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Chatformat past bij creatief ontwerpen en redeneren over keuzes
- [x] Vrijheid in merkkeuze — eigen interesses als startpunt
- [x] Iteratieve verfijning met AI-coach
- [ ] Geen visuele ontwerptools — leerlingen beschrijven hun merk in tekst
- [ ] Kleurenpalet kan niet visueel worden gemaakt — alleen beschreven

**Bronbestanden:** `config/agents/year2.tsx:1820, 1877-1893`

**Score:** 3 / 5

**Opmerkingen:**
> De chat werkt voor conceptueel ontwerpen maar het ontbreken van visuele tools is bij deze missie een groter gemis dan bij andere: een leerling die een kleurenpalet ontwerpt, wil dat bij voorkeur visueel zien. Een verwijzing naar Canva of Adobe Color zou de missie aanzienlijk versterken. Leerlingen kunnen ook gefrustreerd raken als ze een logo "beschrijven" in tekst.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is?

**Checkpunten:**
- [ ] `goalCriteria` niet gedefinieerd
- [ ] Geen badges gedefinieerd
- [ ] Geen `takeaways[]` aanwezig
- [x] `bonusChallenges: null`
- [x] STEP_COMPLETE (3/3) geeft functionele voortgang

**Bronbestanden:** `config/agents/year2.tsx:1894`

**Score:** 2 / 5

**Opmerkingen:**
> Zelfde structureel tekort. Een badge als "Brand Architect" of "Visual Identity Designer" zou goed passen. Takeaways over hoe merkidentiteit werkt (consistentie, doelgroep, waarden) zouden het leermoment vastleggen.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren?

**Checkpunten:**
- [x] 22A (digitale producten ontwerpen) — leerling ontwerpt een complete merkidentiteit
- [ ] SLO-mapping claimt alleen 22A — de systemInstruction vermeldt ook 21B (creatief proces), maar mapping heeft alleen 22A
- [x] De 22A-koppeling is volledig gerechtvaardigd
- [x] Leerdoelen zijn toetsbaar via STEP_COMPLETE criteria

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:128`, `config/agents/year2.tsx:1854`

**Score:** 4 / 5

**Opmerkingen:**
> De SLO-mapping (alleen 22A) is conservatief correct: merkidentiteit is primair een ontwerptaak. De systemInstruction noemt ook 21B (creatief proces doorlopen) maar dit is niet als aparte kerndoelcode opgenomen in de mapping — dit is een bewuste keuze gezien de annotatie in de mapping-file ("merkidentiteit = product, geen mediawijsheid").

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn er toegankelijkheidsproblemen?

**Checkpunten:**
- [x] Leesniveau past bij leerjaar 2 — professioneel maar begrijpelijk
- [x] Vakjargon wordt verklaard — huisstijl, merkwaarden, typografie
- [ ] Visual preview bevat geen alt-teksten
- [ ] Kleurbolletjes in preview missen labels — alleen visuele informatie
- [x] Chat-interactie is inherent toegankelijk

**Bronbestanden:** `config/agents/year2.tsx:1821-1835`

**Score:** 3 / 5

**Opmerkingen:**
> Redelijk toegankelijk maar de kleurbolletjes in de preview communiceren kleur zonder label — een kleurenblinde leerling zou niet kunnen zien welke kleuren worden weergegeven. Dit is in de preview-context acceptabel maar het patroon is het benoemen waard.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Sterk scenario, "Hard" eerlijk |
| 2. Visueel | 3 | ×1 = 3 | Meerdere hardcoded hex-kleuren |
| 3. Didactische flow | 5 | ×2 = 10 | Authentiek brandingproces |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, Nike-voorbeeld sterk |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geïmplementeerd |
| 6. Interactiviteit | 3 | ×1 = 3 | Geen visuele tools, groot gemis voor branding |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges of takeaways |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 22A sterk, systemInstruction noemt extra codes |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Kleurinfo uitsluitend visueel in preview |
| **TOTAAL** | | **41 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (5×2) + (5×1) + (3×1) + (2×1) + (4×1) + (3×1) = 41
Percentage = (41 / 55) × 100% = 74,5%
```

### Verdict

**⚠️ Needs work** (74,5% — onder de 80% drempel)

> Inhoudelijk en didactisch sterke missie, maar het ontbreken van visuele ontwerptools is bij een branding-missie een significanter nadeel dan bij andere missions. Leerlingen die een kleurenpalet of logo-idee beschrijven in tekst missen de visuele component die branding wezenlijk is. Afrondingselementen ontbreken ook.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, takeaways of goalCriteria. | Product |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 6. Interactiviteit | Verwijzing naar Canva of Adobe Color toevoegen zodat leerlingen visueel kunnen werken. | Hoog |
| 2 | 2. Visueel | Hardcoded hex-kleuren (`#EC4899` en preview-array) vervangen door `lab-*` tokens. | Medium |
| 3 | 9. Toegankelijkheid | Kleurbolletjes in preview voorzien van kleurlabels (aria-label of tekstlabel). | Medium |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 7. Afronding | Badge "Brand Architect" toevoegen. |
| 2 | 8. SLO | 21B toevoegen aan mapping als het creatieve proces (ontwerpcyclus) als kerndoel meetelt. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
