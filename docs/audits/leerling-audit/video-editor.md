# Audit — Video Editor (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `video-editor` |
| **Titel** | Video Editor |
| **Leerjaar & Periode** | Leerjaar 2, Periode 3 |
| **Template-engine** | builder-canvas, enableChat |
| **SLO-kerndoelen** | 22A (Digitale producten maken), 21B (Media & Informatie) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en aansprekend — "Video Editor" is direct herkenbaar
- [x] `introDescription` is concreet — "Ontwerp een storyboard en montageplan voor een korte video die een verhaal vertelt"
- [x] `problemScenario` is motiverend en schoolnabij — promotievideo voor de open dag
- [x] Moeilijkheidsgraad passend — "Medium" klopt voor plannen en structureren
- [x] `examplePrompt` is realistisch en aansprekend

**Bronbestanden:** `config/agents/year2.tsx:1897-1908`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. Het scenario (school promotievideo, open dag) is uitstekend gekozen: het is dichtbij, relevant en concreet. Leerlingen kunnen zich direct inleven. De rode kleurstelling past bij film en regisseren. De visual preview met een tijdlijn van filmfragmenten is accuraat en herkenbaar.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Kleurenschema consistent — red-to-red-800 gradient past bij film/cinema
- [x] Visual preview is herkenbaar — tijdlijn-weergave met filmfragmenten is een standaard video-editing metafoor
- [ ] Hardcoded kleurwaarde — `color: '#DC2626'` is hardcoded hex
- [ ] Preview tijdlijn-fragmenten gebruiken inline `style={{ backgroundColor: ... }}` met berekende waarden
- [x] Responsive — preview gebruikt flexbox zonder problematische fixed-widths

**Bronbestanden:** `config/agents/year2.tsx:1901, 1909-1927`

**Score:** 4 / 5

**Opmerkingen:**
> Goede visuele presentatie. De tijdlijn-metafoor in de preview is cinematografisch correct. De toenemende opaciteit van de fragmenten (fade-effect) is een slimme visuele hint. Standaard hex-kleur afwijking zoals bij andere missies.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische 3-stappenopbouw — Verhaallijn → Storyboard/Shotlist → Montageplan
- [x] Elke stap bouwt voort op de vorige — je kunt geen shots plannen zonder verhaal
- [x] Moeilijkheid past bij leerjaar 2 — filmterminologie is nieuw maar toegankelijk uitgelegd
- [x] Stap-voorbeelden zijn concreet — drone-shot, close-up, muziekkeuze zijn levensechte voorbeelden
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3) met kwantitatieve criteria

**Bronbestanden:** `config/agents/year2.tsx:1958-1961, 1972-1988`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De STEP_COMPLETE criteria zijn kwantitatief specifiek: "minimaal 5 shots beschreven met camerahoek, wat er te zien is, en emotie van het shot". Dit is realistisch en toetsbaar. De SCOPE GUARD ("bijna klaar voor de set! Maar eerst: is je script klaar?") is filmset-authentiek.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk?

**Checkpunten:**
- [x] Informatie is feitelijk correct — filmterminologie klopt
- [x] Begrippen worden uitgelegd — storyboard, shotlist, montageplan, B-roll, cut, pacing
- [x] Taalgebruik past bij de doelgroep — enthousiast en filmset-authentiek
- [x] Nadruk op verhaal boven effecten is didactisch correct — "focus op het VERHAAL"
- [x] SLO-kerndoelen kloppen — 22A (media maken) en 21B (mediawijsheid)

**Bronbestanden:** `config/agents/year2.tsx:1929-1970`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De begrippenlijst is volledig en correct. De instructie "vraag de leerling om hun keuzes te onderbouwen: waarom deze volgorde, deze camerahoek, deze muziek?" bevordert kritisch denken. Het KERNIDEE ("elke keuze draagt bij aan de emotie en boodschap") is filmonderwijs op de juiste toon.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1300 tekens
- [x] EERSTE BERICHT aanwezig en creatief — "🎬 Action! Camera! — welkom op de filmset!"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)
- [x] Verificatiecriteria zijn kwantitatief — "minimaal 5 shots", "volgorde, muziekkeuze, uitleg"
- [x] Toon past bij de rol — regisseurs-metafoor is consistent ("op de set", "goed storyboard")
- [x] SCOPE GUARD aanwezig en filmset-authentiek
- [x] Farming-detectie via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year2.tsx:1929-1971`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coach. Het EERSTE BERICHT stelt direct de kernvraag ("wat moet de kijker voelen of denken?") die de leerling direct in het filmdenken trekt. De regisseurs-metafoor is consistent en motiverend. Alles klopt.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Chatformat past bij plannen en storyboarddenken
- [x] School als context maakt het concreet en uitvoerbaar
- [x] Iteratieve begeleiding door AI-coach bij uitwerken van shots
- [ ] Geen storyboard-template of visualisatietool — leerlingen beschrijven shots in tekst
- [ ] Geen echte montage-mogelijkheid — het platform blijft bij planning, niet bij productie

**Bronbestanden:** `config/agents/year2.tsx:1908, 1972-1988`

**Score:** 4 / 5

**Opmerkingen:**
> De chatinteractie werkt goed voor filmplanning. Het gebruik van de eigen school als context is een sterke keuze: de missie is uitvoerbaar buiten het platform. Een storyboard-template (zelfs een simpel invulschema) zou de missie versterken. Het concept-only karakter (geen echte productie) is bewust en correct gecommuniceerd.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is?

**Checkpunten:**
- [ ] `goalCriteria` niet gedefinieerd
- [ ] Geen badges gedefinieerd
- [ ] Geen `takeaways[]` aanwezig
- [x] `bonusChallenges: null`
- [x] STEP_COMPLETE (3/3) geeft functionele voortgang

**Bronbestanden:** `config/agents/year2.tsx:1989`

**Score:** 2 / 5

**Opmerkingen:**
> Zelfde structureel tekort. Een badge als "Film Director" of "Storyboard Artist" zou goed passen. Takeaways over hoe videomontage storytelling beïnvloedt zouden de leerervaring afsluiten.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren?

**Checkpunten:**
- [x] 22A (digitale media maken) — leerling maakt een concreet storyboard en montageplan
- [x] 21B (media begrijpen) — leerling begrijpt hoe visuele keuzes de boodschap beïnvloeden
- [x] SLO-doelen expliciet in systemInstruction
- [x] Leerdoelen toetsbaar via STEP_COMPLETE criteria

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:129`, `config/agents/year2.tsx:1948`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. Het leerproduct (storyboard + montageplan) is een concreet mediaprijsproduct (22A). De nadruk op hoe elke visuele keuze de boodschap en emotie beïnvloedt (21B: mediawijsheid) is correct verwerkt.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn er toegankelijkheidsproblemen?

**Checkpunten:**
- [x] Leesniveau past bij leerjaar 2 — filmset-taal is aansprekend en begrijpelijk
- [x] Vakjargon wordt verklaard — storyboard, B-roll, pacing worden uitgelegd
- [ ] Visual preview bevat geen alt-teksten
- [x] Geen informatie uitsluitend via kleur
- [x] Plannen in tekst is inclusief — geen motorische drempels

**Bronbestanden:** `config/agents/year2.tsx:1909-1927`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. Het beschrijven van shots in tekst is inclusief. Leerlingen met visuele of motorische beperkingen kunnen de planningsfase volledig doorlopen. Alt-teksten ontbreken bij de preview-elementen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Schoolnabij scenario, sterk |
| 2. Visueel | 4 | ×1 = 4 | Tijdlijn-preview goed, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Authentieke filmproductie-fasen |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, nadruk op verhaal |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geïmplementeerd |
| 6. Interactiviteit | 4 | ×1 = 4 | Geen visuele storyboard-tool |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges of takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | Perfect |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, alt-teksten ontbreken |
| **TOTAAL** | | **45 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (2×1) + (5×1) + (4×1) = 45
Percentage = (45 / 55) × 100% = 81,8%
```

### Verdict

**✅ Klaar** (81,8% — boven de 80% drempel)

> Sterke missie met uitstekende AI-coaching en authentiek filmproductie-leerpad. Het schoolnabije scenario (open dag promotievideo) is bijzonder goed gekozen. Afrondingselementen ontbreken maar blokkeren de inzet niet.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, takeaways of goalCriteria. | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 6. Interactiviteit | Simpel storyboard-template (tabel met kolommen: scène, shot, camerahoek, emotie) toevoegen. | Medium |
| 2 | 2. Visueel | Hardcoded hex `#DC2626` vervangen door `lab-*` token. | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 7. Afronding | Badge "Film Director" of "Storyboard Artist" toevoegen. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
