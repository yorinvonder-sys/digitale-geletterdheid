# Audit — Meme Machine (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `meme-machine` |
| **Titel** | Meme Machine |
| **Leerjaar & Periode** | Leerjaar 2, Periode 3 |
| **Template-engine** | builder-canvas, enableChat |
| **SLO-kerndoelen** | 21B (Media & Informatie), 23B (Digitaal welzijn) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en aantrekkelijk — "Meme Machine" is direct aansprekend voor de doelgroep
- [x] `introDescription` is concreet — "Ontdek waarom memes viral gaan en maak er zelf een"
- [x] `problemScenario` is motiverend — marketingbureau snapt niet waarom memes beter werken dan campagnes
- [x] Moeilijkheidsgraad passend — "Easy" klopt want memes zijn al onderdeel van de leefwereld
- [x] `examplePrompt` is inhoudelijk sterk — "distracted boyfriend" meme als startpunt is cultureel relevant

**Bronbestanden:** `config/agents/year2.tsx:1627-1638`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De missietitel en het scenario passen perfect bij de leefwereld van 14-15-jarigen. "Easy" is een goede moeilijkheidsinschatting: het onderwerp is al bekend, maar de analytische laag is nieuw. De visual preview met een gestileerde meme-kaart (afbeelding + tekstblokken + reactie-knoppen) is herkenbaar en accuraat.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Kleurenschema consistent — orange-to-amber gradient past bij viraliteit en energie
- [x] Visual preview is herkenbaar — meme-kaart met afbeeldingruimte, tekstblokken en reactieknoppen
- [ ] Hardcoded kleurwaarde — `color: '#F97316'` is hardcoded hex
- [x] Responsive — preview gebruikt `w-32` fixed width maar binnen een flexbox container
- [x] Contrast op preview is goed — witte elementen op oranje zijn leesbaar

**Bronbestanden:** `config/agents/year2.tsx:1632, 1639-1656`

**Score:** 4 / 5

**Opmerkingen:**
> Sterke visuele presentatie. De meme-kaart in de preview is visueel accuraat: afbeeldingsvak, zwarte tekstbalk, reactie-knoppen. Kleine afwijking: gebruik van hardcoded oranje hex-kleur. De inline styling (`style={{ backgroundColor: c }}`) voor de reactie-bolletjes is technisch correct maar onconventioneel.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische 3-stappenopbouw — Analyseren → Begrijpen → Maken
- [x] Elke stap bouwt voort op de vorige — begrip vóór creatie is didactisch correct
- [x] Moeilijkheid past bij het leerjaar — van herkenning naar analyse naar productie
- [x] Stap-voorbeelden zijn concreet en aansprekend — Drake-meme als voorbeeld is uitstekend
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3) met kwantitatieve criteria

**Bronbestanden:** `config/agents/year2.tsx:1684-1687, 1698-1714`

**Score:** 5 / 5

**Opmerkingen:**
> Exemplarische didactische opbouw. De drie stappen volgen Bloom's taxonomie: onthouden (memes herkennen) → begrijpen (factoren analyseren) → toepassen (eigen content maken). De STEP_COMPLETE criteria zijn specifiek: "3 memes geanalyseerd", "viraliteitsfactoren gerangschikt", "eigen content beschreven".

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk?

**Checkpunten:**
- [x] Informatie is feitelijk correct — viraliteitsfactoren zijn correct beschreven
- [x] Begrippen worden uitgelegd — viraliteit, meme, herkenning, format, doelgroep
- [x] Taalgebruik past bij de doelgroep — informeel, hip, maar niet overdreven
- [x] Veiligheidsrichtlijn aanwezig — "geen memes die kwetsen of discrimineren"
- [x] SLO-kerndoelen kloppen — 21B (media analyseren) en 23B (digitaal welzijn, media-invloed)

**Bronbestanden:** `config/agents/year2.tsx:1658-1697`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk en veilig. De SCOPE GUARD voor discriminerende content ("geen memes die kwetsen") is essentieel voor een minderjarige doelgroep en goed geformuleerd. De begrippen zijn correct en relevant. Het KERNIDEE is didactisch goed geformuleerd: memes als culturele communicatievorm.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1100 tekens
- [x] EERSTE BERICHT aanwezig en creatief — "😂 Welkom bij Meme HQ — de wetenschap achter viral!"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)
- [x] Verificatiecriteria zijn kwantitatief en toetsbaar
- [x] Toon past bij de rol — Mediaexpert met meme-humor
- [x] SCOPE GUARD aanwezig — discriminerende content wordt geblokkeerd
- [x] Farming-detectie via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year2.tsx:1658-1697`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coach. Het EERSTE BERICHT is goed: het belooft een "formule" wat nieuwsgierigheid wekt. De vraag "noem 3 memes die je afgelopen week hebt gezien" activeert directe persoonlijke relevantie. De SCOPE GUARD voor schadelijke content is cruciaal en goed geïmplementeerd.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Chatformat past perfect bij meme-analyse en creatief bedenken
- [x] Hoge motivatie — memes zijn al onderdeel van de dagelijkse leefwereld
- [x] Vrijheid in meme-keuze stimuleert eigenaarschap
- [ ] Leerlingen kunnen geen echte meme maken in de chat — alleen beschrijven
- [ ] Geen link naar externe meme-generators (KnowYourMeme, Imgflip, etc.)

**Bronbestanden:** `config/agents/year2.tsx:1638, 1698-1714`

**Score:** 4 / 5

**Opmerkingen:**
> De chat-interactie werkt goed voor analyse en conceptualisering. Het grootste nadeel is dat leerlingen hun meme alleen kunnen beschrijven, niet visueel maken. Een verwijzing naar gratis meme-generators als onderdeel van de derde stap zou de missie aanzienlijk versterken.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is?

**Checkpunten:**
- [ ] `goalCriteria` niet gedefinieerd
- [ ] Geen badges gedefinieerd
- [ ] Geen `takeaways[]` aanwezig
- [x] `bonusChallenges: null`
- [x] STEP_COMPLETE (3/3) geeft functionele voortgang

**Bronbestanden:** `config/agents/year2.tsx:1715`

**Score:** 2 / 5

**Opmerkingen:**
> Zelfde structureel tekort als overige J2P3-missies. Een badge als "Viral Creator" of "Meme Scientist" zou perfect passen bij het thema. Takeaways over viraliteitsprincipes en verantwoord meme-gebruik zouden waardevolle didactische sluiting bieden.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren?

**Checkpunten:**
- [x] 21B (media analyseren) — leerling analyseert concrete media-uitingen en hun verspreiding
- [x] 23B (digitaal welzijn, media-invloed) — leerling begrijpt hoe media invloed uitoefent
- [x] SLO-doelen sluiten aan bij systemInstruction-inhoud
- [x] Leerdoelen zijn toetsbaar via STEP_COMPLETE criteria

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:126`, `config/agents/year2.tsx:1675`

**Score:** 4 / 5

**Opmerkingen:**
> Goede SLO-aansluiting. De missie leert leerlingen over media-invloed (23B: hoe memes gedrag en opvattingen vormen) en mediawijsheid (21B: kritisch analyseren). Kleine nuance: de systemInstruction noemt ook 21B (ontwerpen) maar de mapping gebruikt 21B (media analyseren) — dit is consistent.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn er toegankelijkheidsproblemen?

**Checkpunten:**
- [x] Leesniveau is uitstekend voor de doelgroep — informeel, herkenbaar
- [x] Geen complex vakjargon zonder uitleg
- [ ] Visual preview bevat geen alt-teksten
- [x] Geen informatie uitsluitend via kleur
- [x] Chat-interactie is inherent toegankelijk

**Bronbestanden:** `config/agents/year2.tsx:1639-1656`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. Het taalgebruik is ideaal voor 14-15-jarigen. Geen significante toegankelijkheidsproblemen in de chat-interactie. De visual preview mist alt-teksten maar dit is een kleine afwijking.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Perfect aansluitend bij de doelgroep |
| 2. Visueel | 4 | ×1 = 4 | Goed, hardcoded hex kleine afwijking |
| 3. Didactische flow | 5 | ×2 = 10 | Bloom-getrapte opbouw |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct + veiligheidsrichtlijn |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geïmplementeerd |
| 6. Interactiviteit | 4 | ×1 = 4 | Geen visuele meme-tool |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges of takeaways |
| 8. SLO-aansluiting | 4 | ×1 = 4 | Sterke koppeling |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed taalgebruik, alt-teksten ontbreken |
| **TOTAAL** | | **44 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (2×1) + (4×1) + (4×1) = 44
Percentage = (44 / 55) × 100% = 80,0%
```

### Verdict

**✅ Klaar** (80,0% — exact op de 80% drempel)

> Sterke missie die uitstekend aansluit bij de leefwereld van J2-leerlingen. De AI-coach is volledig geïmplementeerd. Het enige structurele tekort is het ontbreken van afrondingselementen — een relatief kleine fix die de missie significant verbetert.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, takeaways of goalCriteria aanwezig. | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 6. Interactiviteit | Verwijzing naar meme-generator (bijv. Imgflip) toevoegen bij stap 3. | Medium |
| 2 | 2. Visueel | Hardcoded hex `#F97316` vervangen door `lab-*` token. | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 7. Afronding | Badge "Viral Creator" toevoegen — past uitstekend bij het thema. |
| 2 | 8. SLO | Takeaway over verantwoord meme-gebruik opnemen (23B koppeling). |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
