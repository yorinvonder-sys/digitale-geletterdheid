# Audit — Eindproject Jaar 2 (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `eindproject-j2` |
| **Titel** | Eindproject Jaar 2 |
| **Leerjaar & Periode** | Leerjaar 2, Periode 4 |
| **Template-engine** | data-viewer |
| **SLO-kerndoelen** | Alle kerndoelen leerjaar 2: 21A, 21B, 21C, 21D, 22A, 22B, 23A, 23B, 23C |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en celebrerend — "Eindproject Jaar 2" communiceert het belang
- [x] `introDescription` is motiverend — "Laat alles zien wat je hebt geleerd in een eigen eindproject"
- [x] `problemScenario` is open en uitnodigend — leerling mag zelf kiezen wat ze maken
- [x] Moeilijkheidsgraad passend — "Hard" klopt voor een capstone-project
- [x] `examplePrompt` is aansprekend — een app voor huiswerkplanning is herkenbaar en realistisch

**Bronbestanden:** `config/agents/year2.tsx:2495-2506`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. Het scenario ("je hebt dit jaar ontzettend veel geleerd — nu is het tijd om te laten zien wat jij kunt") is motiverend en celebrerend. De openheid (geen beperking op projecttype) geeft leerlingen maximale autonomie. De gouden kleur en trofee communiceren het bijzondere karakter van dit sluitstuk.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Kleurenschema consistent — amber-to-yellow-600 gradient communiceert goud/succes
- [x] Visual preview is feestelijk — trofee met rondzwevende bolletjes
- [ ] Hardcoded kleurwaarde — `color: '#F59E0B'` is hardcoded hex
- [ ] Preview-bolletjes gebruiken `Math.random()` voor posities — inconsistente rendering
- [x] De trofee is universeel herkenbaar als symbool voor prestatie

**Bronbestanden:** `config/agents/year2.tsx:2500, 2507-2515`

**Score:** 4 / 5

**Opmerkingen:**
> Goede visuele presentatie die het celebrerende karakter van de eindmissie goed communiceert. De gouden trofee is perfect gekozen. Standaard hardcoded hex afwijking en `Math.random()` positionering (zelfde als future-forecaster).

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische 3-stappenopbouw — Projectplan → Product ontwikkelen → Presenteren & reflecteren
- [x] Elke stap bouwt voort op de vorige — plan vóór uitvoering, uitvoering vóór presentatie
- [x] Moeilijkheid past bij "Hard" — volledige designcyclus doorlopen
- [x] Stap-voorbeelden zijn concreet en realistisch — website over AI-ethiek voor klasgenoten
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3) met kwalitatieve criteria

**Bronbestanden:** `config/agents/year2.tsx:2541-2544, 2556-2572`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drie stappen volgen de volledige designcyclus: idee → plan → uitvoering → feedback → presentatie. De STEP_COMPLETE criteria zijn goed voor een open project: "volledig projectplan met tijdplanning", "product uitgewerkt en feedback verwerkt", "presentatie voorbereid met reflectie op leerproces". De nadruk op feedbackverwerking (stap 2) is didactisch essentieel.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk?

**Checkpunten:**
- [x] Instructies zijn correct — projectplan, uitvoering, presentatie zijn de juiste fasen
- [x] Projectvrijheid is goed geformuleerd — website, app, video, podcast, poster, prototype
- [x] Nadruk op proces én product is didactisch correct
- [x] Reflectievragen zijn educatief waardevol — "wat ging goed, wat was moeilijk, wat zou je anders doen"
- [x] SLO-kerndoelen kloppen — alle kerndoelen van leerjaar 2 zijn correct als capstone-doelen

**Bronbestanden:** `config/agents/year2.tsx:2517-2555`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De instructie "focus op het PROCES net zoveel als op het PRODUCT" is didactisch waardevol: het verschuift de focus van een eindproduct naar het leertraject. Het KERNIDEE is correct: leerlingen doorlopen de volledige designcyclus (idee → plan → product → presentatie). De feestvieringsmededeling ("vier successen! Dit is het sluitstuk van het jaar") is motiverend en pedagogisch aanvaarbaar.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1100 tekens
- [x] EERSTE BERICHT aanwezig en celebrerend — "🏆 Eindproject Jaar 2 — jouw moment!"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)
- [x] Verificatiecriteria zijn open maar specifiek — "tijdplanning", "feedback verwerkt", "reflectie op leerproces"
- [x] Toon past bij de rol — eindproject-coach die empowert en begeleidt
- [x] SCOPE GUARD aanwezig — overweldiging terugsturen naar concrete volgende stap
- [x] Farming-detectie via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year2.tsx:2517-2555`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coach. Het EERSTE BERICHT ("geen beperkingen: website, app, video, podcast, poster, prototype — kies wat bij jou past") is maximaal empowerend. De SCOPE GUARD ("rustig aan! We pakken het stap voor stap. Wat is de eerstvolgende concrete actie?") is bijzonder goed voor leerlingen die overweldigd raken — een reëel risico bij een open eindproject.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Chatformat past perfect bij iteratief projectbegeleiding
- [x] Maximale vrijheid in projecttype — alle media en formats zijn toegestaan
- [x] Feedback-loop is ingebouwd — "vraag feedback en verbeter waar nodig"
- [x] Iteratieve samenwerking met AI-coach over meerdere sessies
- [ ] Geen projectmanagement-tool — leerlingen beheren hun project in de chat zonder externe structuur

**Bronbestanden:** `config/agents/year2.tsx:2506, 2556-2572`

**Score:** 4 / 5

**Opmerkingen:**
> De chatinteractie werkt goed als projectbegeleiding. De iteratieve aanpak (plan → feedback → verbeteren) is authentiek. Het enige tekort is het ontbreken van een eenvoudige voortgangstracker of projectboard — leerlingen die meerdere sessies aan hun eindproject werken, verliezen gemakkelijk het overzicht.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is?

**Checkpunten:**
- [ ] `goalCriteria` niet gedefinieerd
- [ ] Geen badges gedefinieerd
- [ ] Geen `takeaways[]` aanwezig
- [x] `bonusChallenges: null`
- [x] STEP_COMPLETE (3/3) geeft functionele voortgang

**Bronbestanden:** `config/agents/year2.tsx:2573`

**Score:** 2 / 5

**Opmerkingen:**
> Het ontbreken van badges is voor het eindproject bijzonder opvallend: dit is het moment waarop een leerling een beloning verdient voor het afronden van een vol leerjaar. Een eindproject-specifiek badge (bijv. "Year 2 Graduate" of een gouden trofee-badge die overeenkomt met de visuele preview) zou de afsluiting van het leerjaar markeren.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren?

**Checkpunten:**
- [x] Alle 9 kerndoelen van leerjaar 2 zijn geclaimd — dit is een capstone-missie
- [x] De projectvrijheid maakt het mogelijk om alle kerndoelen te integreren
- [x] De reflectievragen versterken de SLO-bewustwording
- [ ] Niet alle kerndoelen worden door elk project gedekt — afhankelijk van projectkeuze

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:142`, `config/agents/year2.tsx:2525`

**Score:** 4 / 5

**Opmerkingen:**
> De claim dat alle kerndoelen van leerjaar 2 in dit eindproject samenkomen is correct voor de ideale invulling, maar in de praktijk afhankelijk van de projectkeuze. Een leerling die een poster maakt, beroept wellicht niet op 22B (programmeren). Dit is inherent aan open eindprojecten en geen kwaliteitsprobleem — het is bewuste pedagogische keuze.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn er toegankelijkheidsproblemen?

**Checkpunten:**
- [x] Leesniveau passend voor leerjaar 2 — empowerend en begrijpelijk
- [x] Geen complex vakjargon in de instructies
- [ ] Visual preview bevat geen alt-teksten; `Math.random()` positionering
- [x] Geen informatie uitsluitend via kleur
- [x] Open projectkeuze is inclusief — elk type project is toegestaan

**Bronbestanden:** `config/agents/year2.tsx:2507-2515`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. De open projectvrijheid is inclusief: leerlingen kunnen een projecttype kiezen dat past bij hun sterke kanten (schrijven, ontwerpen, programmeren, spreken). Dit is de meest inclusieve missie in het curriculum. Alt-teksten ontbreken bij de preview.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Celebrerend, maximale vrijheid |
| 2. Visueel | 4 | ×1 = 4 | Trofee-preview sterk, Math.random() |
| 3. Didactische flow | 5 | ×2 = 10 | Volledige designcyclus |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, proces én product |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig, SCOPE GUARD bijzonder sterk |
| 6. Interactiviteit | 4 | ×1 = 4 | Maximale vrijheid, geen projecttool |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges — voor eindproject extra opvallend |
| 8. SLO-aansluiting | 4 | ×1 = 4 | Alle kerndoelen, afhankelijk van projectkeuze |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Inclusieve projectvrijheid |
| **TOTAAL** | | **44 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (2×1) + (4×1) + (4×1) = 44
Percentage = (44 / 55) × 100% = 80,0%
```

### Verdict

**✅ Klaar** (80,0% — exact op de 80% drempel)

> Een capstone-missie die leerlingen maximale vrijheid geeft om het jaar af te sluiten met een eigen project. De AI-coaching is uitstekend, de didactische opbouw is authentiek. Het ontbreken van badges is bij de eindmissie het meest opvallend — dit is een prioritaire fix.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, takeaways of goalCriteria. Voor een eindproject is dit extra pijnlijk — leerlingen verdienen een markering van deze mijlpaal. | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 6. Interactiviteit | Simpele projectkaart toevoegen — titel, beschrijving, mijlpalen — zodat leerlingen het overzicht bewaren tussen sessies. | Medium |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 7. Afronding | Badge "Year 2 Graduate" of een speciale eindproject-trofee toevoegen. Dit is de meest symbolisch belangrijke badge in het hele leerjaar. |
| 2 | 8. SLO | Optionele koppeling aan specifieke kerndoelen per projecttype — zodat leerlingen bewust kiezen welke doelen ze met hun project raken. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
