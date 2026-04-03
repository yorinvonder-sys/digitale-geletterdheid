# Audit — Pitch Politie (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `pitch-police` |
| **Titel** | Pitch Politie |
| **Leerjaar & Periode** | Leerjaar 1, Periode 1 (Review week 2) |
| **Template-engine** | Standalone (`components/missions/review/PitchPoliceMission.tsx`) |
| **SLO-kerndoelen** | 21A, 22A (VO) / 18A, 19A (VSO) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] Introscherm aanwezig — `showIntro` state toont een volledig introscherm vóór de missie start
- [x] Titel is pakkend — "Pitch Politie" met 🎨/Monitor-icoon en uitroepteken
- [x] Beschrijving is duidelijk — "Jij bent de presentatie-expert. Help medeleerlingen hun rommelige slides te verbeteren!"
- [x] Instructies zijn stap-voor-stap uitgelegd — 4 stappen: bekijk fouten → lees rapport → kies oplossing → fix de slide
- [x] Visuele decoraties (animate-pulse achtergrond) zijn aantrekkelijk zonder afleidend te zijn
- [x] Moeilijkheidsgraad is voelbaar — review betekent al bekende concepten toepassen

**Bronbestanden:** `config/agents/year1.tsx:26-33`, `components/missions/review/PitchPoliceMission.tsx:311-380`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk — de sterkste van de drie reviewmissies. Het introscherm is volledig uitgewerkt met een duidelijke uitleg, visuele aantrekkelijkheid en een concrete rolbeschrijving ("jij bent de presentatie-expert"). De 4-stappen instructie-grid is helder en scanbaar. Dit is het enige reviewcomponent met een volwaardig introscherm.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren zijn intern consistent — `#D97757` (oranje), `#C46849` (donkeroranje), `#2A9D8F` (teal) consistent gebruikt
- [ ] Kleuren via `lab-*` tokens — hardcoded hex-waarden door het gehele component
- [x] De slides zelf zijn visueel gevarieerd — elke slide heeft een eigen kleur/stijl die past bij het probleem (gele achtergrond voor contrast-issue, regenbooggradiënt voor chaos-slide)
- [x] Animaties zijn intentioneel — de "vóór" slides tonen bewust overdreven fouten (rondtollende grafiek, GIFs), de "na" slides zijn rustig
- [x] Mobiele ondersteuning — `showMobileInspector` state voor een mobiel slide-paneel
- [x] Framer Motion animaties zijn alleen voor intentionele overgangen

**Bronbestanden:** `components/missions/review/PitchPoliceMission.tsx:39-247`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel indrukwekkend en didactisch doordacht — de "gebroken" slides zijn bewust overdreven (te veel tekst, te hoog contrast, chaos-kleuren) zodat de fouten duidelijk zichtbaar zijn. De "vaste" versies zijn rustig en professioneel. Dit is de sterkste visuele implementatie van de drie reviewmissies. Hardcoded hex-kleuren zijn een terugkerend patroon maar geen blokkeerder.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — 8 slides met een variatie aan problemen (text-overload, contrast, chaos, distraction, size, image-stretch, spelling, chart-chaos)
- [x] Elke slide dekt een ander presentatieprincipe — brede dekking van presentatiefouten
- [x] Moeilijkheid past bij de reviewcontext — J1P2, aansluitend op slide-specialist
- [x] Feedback is direct en specifiek — "Veel te veel tekst! Mensen gaan dit lezen in plaats van naar jou luisteren."
- [x] De "vóór/na"-weergave maakt het leereffect zichtbaar — leerling ziet het resultaat van hun keuze
- [x] Rolbeschrijving ("jij bent de presentatie-expert") maakt van de leerling een actieve beoordelaar in plaats van passieve ontvanger
- [x] Multiple-choice met één correct antwoord — laagdrempelig maar dwingt tot redeneren

**Bronbestanden:** `components/missions/review/PitchPoliceMission.tsx:39-247`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De 8 slides dekken een breed spectrum aan presentatiefouten, van te veel tekst tot spelfouten tot grafiek-chaos. De "vóór/na"-weergave is een krachtig leermechanisme. De peer-review rolbeschrijving ("help medeleerlingen") is didactisch slim — leerlingen zijn kritischer op andermans werk dan op het eigen werk.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Alle 8 slide-problemen zijn inhoudelijk correct — de fouten zijn reële presentatiefouten die in de praktijk voorkomen
- [x] De correcte antwoorden zijn inhoudelijk juist:
  - Tekst-overload → "Samenvatten in steekwoorden (bulletpoints)" ✓
  - Contrast → "Tekst zwart maken voor beter contrast" ✓
  - Chaos → "Kies 1 rustige stijl en maximaal 3 kleuren" ✓
  - Distraction → "Vervang GIFs door een relevante foto" ✓
  - Size → "Maak de tekst GROOT en duidelijk" ✓
  - Image-stretch → "Originele verhoudingen behouden (Shift)" ✓
  - Spelling → "Gebruik de spellingcontrole" ✓
  - Chart-chaos → "Gebruik een heldere staafgrafiek" ✓
- [x] Geen typografische fouten of spelfouten (behalve de bewuste spelfouten in slide 7 als onderdeel van het leermateriaal)
- [x] Taalgebruik past bij de leeftijdsgroep — "Ai...", "Wow, rustig aan!", "Is dit een presentatie of een meme-pagina?" zijn informeel en herkenbaar

**Bronbestanden:** `components/missions/review/PitchPoliceMission.tsx:39-247`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. Alle 8 correcte antwoorden zijn vakinhoudelijk juist. De feedback-teksten zijn bondig, specifiek en amusant zonder afdoende te zijn. De bewuste spelfouten in slide 7 ("Ik vint het egt heel leuk") zijn correct als didactisch middel voor het spelling-thema.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [ ] `systemInstruction` — in `year1.tsx:31` is `systemInstruction: ''` — leeg!
- [ ] EERSTE BERICHT — niet van toepassing (geen AI-chat)
- [ ] STEP_COMPLETE markers — niet van toepassing (geen AI-chat)
- [x] Feedback-mechanisme vervangt AI-coaching — directe feedback per slide met feedbacktekst
- [x] De feedbackteksten zijn informatief en amusant — ze vervangen de AI-coaching adequaat
- [x] Foute antwoorden geven direct feedback (showFeedback = false) zonder de leerling te blokkeren

**Bronbestanden:** `config/agents/year1.tsx:31`, `components/missions/review/PitchPoliceMission.tsx:270-288`

**Score:** 3 / 5

**Opmerkingen:**
> Geen AI-coach — bewust standalone ontworpen. De feedback-mechaniek (directe slide-feedback + vóór/na-weergave) is een effectief alternatief. Score van 3 (niet lager) omdat de coaching-functie inhoudelijk aanwezig is via het feedback-systeem.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — slides beoordelen + multiple-choice oplossing kiezen simuleert peer-review
- [x] Voldoende variatie — 8 slides met elk een ander probleem en 3 keuze-opties
- [x] Feedback op foute antwoorden is direct — rode indicator, 2 seconden weergave
- [x] Feedback op correcte antwoorden is bevredigend — slide verandert visueel van "gebroken" naar "professioneel"
- [x] Navigatie tussen slides is eenvoudig — pijlknoppen links/rechts
- [x] Mobile inspector voor kleine schermen — `showMobileInspector` voor mobiele weergave
- [x] Voortgangsindicator — slidenummer (X/8) en voortgangsbalk

**Bronbestanden:** `components/missions/review/PitchPoliceMission.tsx:260-300`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende interactiviteit. De "fix de slide"-mechanic is het sterkste interactieve element van alle drie reviewmissies. De visuele transformatie van gebroken naar professioneel is belonend en maakt het leereffect zichtbaar. De 8 slides bieden voldoende variatie en herhaling om de presentatieprincipes te bekrachtigen.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn helder — na slide 8 + "Volgende" → missie compleet
- [x] `clearSave()` en `onComplete(true)` worden correct aangeroepen bij voltooiing
- [ ] Geen badges gedefinieerd — geen badge-structuur
- [ ] Geen takeaways — geen afrondingsscherm met kernlessen
- [ ] Geen score-systeem — het is niet duidelijk hoeveel correct/fout de leerling heeft
- [ ] Fout antwoord heeft geen blijvend effect — leerling kan doornavigeren naar volgende slide zonder correcte keuze te maken (na timeout)

**Bronbestanden:** `components/missions/review/PitchPoliceMission.tsx:290-299`

**Score:** 2 / 5

**Opmerkingen:**
> De afrondingsstructuur is de zwakste dimensie van deze missie. Er is geen afrondingsscherm, geen score-overzicht, geen badges en geen takeaways. Bovendien kan een leerling technisch gezien alle slides doornavigeren zonder de correcte keuze te maken (de fout-feedback duurt 2 seconden, daarna kan de leerling verdergaan). Dit vermindert de leergarantie. Een verplichte correcte beantwoording per slide of een scoredrempel voor voltooiing zou dit oplossen.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 21A (PowerPoint kennen) en 22A (presentatieprincipes begrijpen) kloppen
- [x] De missie versterkt de leerdoelen uit slide-specialist (reviewfunctie)
- [x] De breadth van 8 slides (tekst, kleur, animatie, spelling, grafieken) dekt 22A breed
- [x] Geen conflict tussen curriculum en slo-kerndoelen-mapping — week 2, J1, 21A + 22A consistent

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:38`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke SLO-aansluiting. De 8 slides dekken een breed spectrum van 22A (digitaal produceren: presentatieprincipes). De missie overstijgt technisch gebruik (21A) en focust op principes van effectieve presentatie (22A), wat de SLO-aansluiting extra sterk maakt.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — korte, informele feedbackteksten
- [x] Multiple-choice opties zijn tekstueel — geen informatie puur via kleur
- [x] Voortgangsindicator heeft zowel tekst (X/8) als visueel (balk)
- [ ] De GIF-afbeeldingen in slide 4 hebben alt-teksten ("Distraction", "Cat", "Dancing") — basaal aanwezig maar niet beschrijvend
- [ ] Focus-states op de optie-knoppen zijn niet controleerbaar zonder runtime-inspectie
- [x] De contrast-slide (slide 2) demonstreert goed toegankelijkheidsprincipes — gele achtergrond + witte tekst als bewust fout voorbeeld

**Bronbestanden:** `components/missions/review/PitchPoliceMission.tsx:128-134`

**Score:** 3 / 5

**Opmerkingen:**
> Redelijke toegankelijkheid. De alt-teksten op GIFs zijn aanwezig maar minimaal ("Distraction" vertelt een screenreader-gebruiker niet wat er te zien is). De contrast-slide is didactisch slim — de leerling ervaart zelf de toegankelijkheidsfout. Focus-states zijn niet bevestigd zonder runtime-test.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Beste introscherm van de 3 reviewmissies |
| 2. Visueel | 4 | ×1 = 4 | Voor/na-slides didactisch sterk, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | 8 slides, breed spectrum, peer-review rol |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Alle 8 correcte antwoorden inhoudelijk juist |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | Geen AI-chat, feedback-systeem compenseert |
| 6. Interactiviteit | 5 | ×1 = 5 | "Fix de slide" mechanic is excellent |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen score, geen badges, geen takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21A + 22A breed gedekt |
| 9. Toegankelijkheid | 3 | ×1 = 3 | GIF alt-teksten minimaal, focus-states onzeker |
| **TOTAAL** | | **45 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (3×1) + (5×1) + (2×1) + (5×1) + (3×1) = 45
Percentage = (45 / 55) × 100% = 81,8%
```

### Verdict

**✅ Klaar** (81,8% — net boven de 80% drempel)

> Pitch Politie is de sterkste van de drie reviewmissies dankzij het volledige introscherm, uitstekende interactiviteit en brede SLO-dekking. De afrondingsstructuur is de zwakste dimensie en verdient prioritaire verbetering. Direct inzetbaar in de pilot, maar de afronding moet worden aangepakt voor optimale leereffectiviteit.

---

### Actielijst

#### Blokkerende issues (oplossen vóór pilot)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Afrondingsscherm toevoegen na de laatste slide met: score (X/8 correct), takeaways ("Je weet nu dat..."), en optioneel een badge | Product |
| 2 | 7. Afronding & feedback | Overweeg verplichte correcte beantwoording per slide (of minimale score van 6/8) vóór voltooiing — nu kan een leerling doornavigeren zonder correcte keuze | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór volgende versie)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 9. Toegankelijkheid | GIF alt-teksten verbeteren — "Distraction" → "Drie afleidende bewegende GIFs van dieren op een serieuze slide" | Medium |
| 2 | 2. Visueel | Hardcoded hex-waarden vervangen door `lab-*` tokens | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
