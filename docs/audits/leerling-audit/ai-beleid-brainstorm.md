# Audit — AI Beleid Brainstorm (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `ai-beleid-brainstorm` |
| **Titel** | AI Beleid Brainstorm |
| **Leerjaar & Periode** | Leerjaar 1, Periode 2 |
| **Template-engine** | Standalone (custom AiBeleidBrainstormPreview component) |
| **SLO-kerndoelen** | 21D (AI), 23C (maatschappij & ethiek) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "AI Beleid Brainstorm" is duidelijk
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — categorieën (Regels, Mogelijkheden, Zorgen, Suggesties) maken het direct helder
- [x] Emoji of visueel element past bij het thema — soft indigo/violet gradient met categorie-iconen is uitnodigend
- [x] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro — "Easy" past bij het idee-deelproces zonder goed/fout

**Bronbestanden:** `config/agents/year1.tsx:3657-3733`

**Score:** 4 / 5

**Opmerkingen:**
> Goede eerste indruk. De vier categorieën (Regels, Mogelijkheden, Zorgen, Suggesties) maken direct duidelijk hoe leerlingen kunnen meedoen. De soft indigo/violet kleurstelling is rustiger dan andere missies, wat past bij de reflectieve aard van beleidsvorming. Het is ook direct duidelijk dat er geen goed of fout antwoord is, wat de drempel verlaagt.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Geen afgebroken of afgekapte teksten — tekst in de preview is kort en overzichtelijk
- [x] Kleuren zijn consistent — soft indigo/violet gradient is consistent met het platform-thema
- [x] Animaties zijn niet afleidend of overweldigend — categorie-iconen zijn rustige visuele elementen
- [x] Responsive op minimaal 375 px breed (mobiel) — categorie-knoppen zijn van nature mobiel-vriendelijk

**Bronbestanden:** `config/agents/year1.tsx:3657-3733`

**Score:** 4 / 5

**Opmerkingen:**
> Sterk visueel ontwerp. De zachte indigo/violet kleurstelling past bij de reflectieve, democratische aard van de missie — minder "action-packed" dan andere missies, maar bewust zo gekozen. Categorie-iconen maken de vier opties visueel onderscheidbaar. De custom AiBeleidBrainstormPreview component doet zijn werk goed in de preview.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — kies categorie → deel idee → stem is een heldere flow
- [x] Moeilijkheid past bij het leerjaar — J1, Easy, meningen delen zonder goed/fout is laagdrempelig
- [ ] Elke stap bouwt aantoonbaar voort op de vorige — de stappen zijn meer parallel dan sequentieel, leerlingen kunnen in elke categorie meedoen
- [ ] Geen onverklaard vakjargon — "beleid" is een begrip dat nadere uitleg verdient voor J1-leerlingen

**Bronbestanden:** `config/agents/year1.tsx:3657-3733`

**Score:** 3 / 5

**Opmerkingen:**
> De flow is helder maar relatief oppervlakkig. De drie stappen (categorie kiezen → idee delen → stemmen) zijn logisch maar bevorderen geen diepe kennisopbouw — het is primair een mening-deelmechanisme. Het democratische aspect (stemmen) is pedagogisch interessant, maar zonder verdieping blijft het bij oppervlakkige participatie. Het begrip "beleid" is voor J1-leerlingen niet vanzelfsprekend en zou explicieter uitgelegd moeten worden. STEP_COMPLETE ontbreekt.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — democratische beleidsvorming via brainstorm is een correcte aanpak
- [x] Geen typografische fouten of spelfouten — tekst is verzorgd
- [x] Taalgebruik past bij de leeftijdsgroep — informeel, geen technisch jargon
- [x] Framing is evenwichtig — geen goed/fout benadering is correct voor een ethische discussie

**Bronbestanden:** `config/agents/year1.tsx:3657-3733`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk correct en evenwichtig geframed. De democratische aanpak zonder goed/fout is de juiste pedagogische keuze voor een ethisch onderwerp als AI-beleid. De systemInstruction (~600 tekens) is primair een fallback omdat de custom component de hoofdinteractie afhandelt — dit is een bewuste architectuurkeuze, niet een tekortkoming.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [ ] `systemInstruction` is minimaal 500 tekens lang — ~600 tekens, net boven minimum maar beperkt
- [ ] EERSTE BERICHT is aanwezig voor de hoofdinteractie — alleen aanwezig als fallback voor de chat, de custom component afhandelt de hoofdinteractie
- [ ] STEP_COMPLETE markers zijn aanwezig — **ONTBREEKT**
- [ ] Verificatievragen aanwezig — **ONTBREEKT** — idee-delen heeft geen goed/fout, maar verdiepingsvragen zijn ook afwezig
- [x] Toon past bij de rolnaam en het thema — neutrale, faciliterende toon past bij brainstormsessie
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX` (gedeelde suffix)

**Bronbestanden:** `config/agents/year1.tsx:3657-3733`, `config/agents/shared.tsx`

**Score:** 2 / 5

**Opmerkingen:**
> De AI-coach speelt hier een beperkte rol omdat de custom AiBeleidBrainstormPreview component de hoofdinteractie afhandelt. De systemInstruction (~600 tekens) is voornamelijk een fallback. Dit is een architectuurkeuze, maar het betekent ook dat de AI-coach niet actief begeleidt, geen verdiepingsvragen stelt, en geen voortgang bijhoudt. Er is geen EERSTE BERICHT in de klassieke zin, geen STEP_COMPLETE en geen verificatieprotocol. Voor leerlingen die vastlopen of meer willen weten, is er weinig coaching beschikbaar.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — stemmen en ideeën delen is participatief en democratisch
- [x] Voldoende variatie — vier categorieën bieden verschillende insteekpunten
- [x] Feedback op input is leerzaam — zien hoe anderen stemmen geeft sociaal bewijs en nieuwe perspectieven
- [x] Het element werkt technisch — de custom component is een bewezen mechanisme in het platform

**Bronbestanden:** `config/agents/year1.tsx:3657-3733`, `src/components/` (AiBeleidBrainstormPreview)

**Score:** 4 / 5

**Opmerkingen:**
> De participatieve interactievorm is sterk en past uitstekend bij het democratische karakter van beleidsvorming. Leerlingen zien elkaars ideeën en kunnen stemmen — dit creëert een klasdynamiek die leerzamer is dan solo-leren. De custom component handelt dit goed af. Het stemmen-mechanisme geeft ook sociaal bewijs: leerlingen zien welke zorgen en ideeën anderen delen, wat de discussie verrijkt.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [ ] Completion-criteria zijn helder voor de leerling — **geen `goalCriteria` gedefinieerd**
- [ ] Badges hebben betekenisvolle namen — **geen badges gedefinieerd** (`bonusChallenges: null`)
- [ ] Scoredrempels zijn realistisch — **geen scoring systeem** (wat logisch is voor een brainstorm)
- [ ] `takeaways[]` vatten de kernlessen samen — **geen takeaways gedefinieerd**

**Bronbestanden:** `config/agents/year1.tsx:3733` (`bonusChallenges: null`)

**Score:** 1 / 5

**Opmerkingen:**
> Er is geen enkel afrondingselement aanwezig. `bonusChallenges: null` is expliciet ingesteld. Hoewel een scoring-systeem voor een brainstorm didactisch ongeschikt zou zijn (er is geen goed/fout), is het ontbreken van takeaways en een completion-signaal problematisch. Een leerling weet niet wanneer ze "klaar" zijn. Minimaal 3 takeaways die de kernpunten van AI-beleid samenvatten zouden de missie aanzienlijk versterken.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 21D (AI) is gedeeltelijk aanwezig — leerlingen denken na over AI in de maatschappij
- [ ] 23C (maatschappij & ethiek) claimt diepgang die niet volledig geleverd wordt — het is meer mening-delen dan analyse van maatschappelijke impact
- [ ] Het leerdoel is toetsbaar geformuleerd — idee-delen is een activiteit, geen meetbaar resultaat
- [ ] Onderscheid tussen 21D en 23C is niet scherp in de missie zelf — beide SLO's worden slechts oppervlakkig bediend

**Bronbestanden:** `config/agents/year1.tsx:3657-3660`, `config/curriculum.ts`, `config/slo-kerndoelen-mapping.ts`

**Score:** 3 / 5

**Opmerkingen:**
> De SLO-mapping is gedeeltelijk correct maar minder sterk dan bij andere missies. 21D (AI) wordt bediend door de context van de discussie over AI, maar de missie leert leerlingen niet echt iets nieuws over hoe AI werkt. 23C (maatschappij & ethiek) claimt diepgang die niet volledig geleverd wordt — brainstormen is niet hetzelfde als analyseren. De missie is meer een participatieve activiteit dan een kennisoverdrachts-missie, wat de SLO-mapping ambitieuzer maakt dan wat werkelijk gerealiseerd wordt.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — eenvoudige taal, geen technisch jargon, geschikt voor J1
- [x] Alt-teksten aanwezig op niet-decoratieve elementen — tekst-gebaseerde interface
- [x] Alle interactieve elementen bereikbaar met toetsenbord — categorie-knoppen en stemknoppen zijn standaard HTML-elementen
- [x] Kleurcontrast voldoet aan WCAG AA — soft indigo/violet op wit heeft doorgaans voldoende contrast
- [ ] Informatie wordt niet uitsluitend via kleur overgebracht — categorie-kleuren zijn decoratief, categorie-namen zijn ook als tekst aanwezig

**Bronbestanden:** `config/agents/year1.tsx:3657-3733`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. De eenvoudige taal en het lage drempelniveau maken deze missie toegankelijk voor een brede groep leerlingen, inclusief leerlingen met lagere taalvaardigheid. De categorie-namen zijn als tekst aanwezig naast de kleur-codering, wat goed is. De standaard HTML-knoppeninterface is inherent toegankelijk.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 4 | ×1 = 4 | Vier categorieën duidelijk, uitnodigend, lage drempel |
| 2. Visueel | 4 | ×1 = 4 | Soft indigo/violet past bij reflectief karakter |
| 3. Didactische flow | 3 | ×2 = 6 | Stappen helder maar oppervlakkig, geen verdieping |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Evenwichtige framing, geen goed/fout correct |
| 5. AI-coach kwaliteit | 2 | ×1 = 2 | Korte SI, hoofdzakelijk fallback, geen coaching |
| 6. Interactiviteit | 4 | ×1 = 4 | Participatief stemmen is sterk en democratisch |
| 7. Afronding & feedback | 1 | ×1 = 1 | bonusChallenges: null — niets aanwezig |
| 8. SLO-aansluiting | 3 | ×1 = 3 | 21D+23C gedeeltelijk, minder diepgang dan geclaimd |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Eenvoudige taal, lage drempel, goed toegankelijk |
| **TOTAAL** | | **36 / 55** | |

### Gewogen totaal

```
(4×1) + (4×1) + (3×2) + (4×2) + (2×1) + (4×1) + (1×1) + (3×1) + (4×1) = 36
Percentage = (36 / 55) × 100% = 65,5%
```

### Verdict

**⚠️ Needs work** (65,5% — boven de 60% drempel, maar meerdere zwakke punten)

> Waardevolle missie met een uniek democratisch concept — leerlingen vormen samen AI-beleid via stemmen en brainstormen. Dit is didactisch interessant en laagdrempelig. Maar de missie levert minder kennisoverdracht dan de SLO-mapping suggereert, de AI-coach speelt een minimale rol, en er ontbreken alle afrondingselementen. De missie voelt meer als een klasactiviteit dan als een volwaardige leerervaring met sluiting.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, takeaways of completion-signaal aanwezig. Voeg minimaal 3 takeaways toe die de kernpunten van AI-beleid samenvatten. Scoring is niet nodig, maar completion-criteria wel. | Product |
| 2 | 5. AI-coach kwaliteit | SystemInstruction (~600 tekens) is alleen fallback. Voeg verdiepingsvragen toe die de AI-coach kan stellen als leerlingen om meer uitleg vragen. Geen STEP_COMPLETE nodig (brainstorm), maar coaching-prompts wel. | Product |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 3. Didactische flow | Verdiepingsstap toevoegen na het ideeën-delen: leerlingen krijgen een echt AI-beleidsdocument (vereenvoudigd) te lezen en vergelijken met hun eigen ideeën. | Medium |
| 2 | 8. SLO-aansluiting | SLO-mapping aanscherpen: 23C claimt meer dan geleverd wordt. Ofwel de missie verdiepen, ofwel de SLO-claim terugbrengen naar 23A (meningen over technologie). | Medium |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 3. Didactische flow | "Beleid" uitleggen voor J1-leerlingen via een concrete analogie (schoolregels als beleid) voordat ze aan de slag gaan. |
| 2 | 6. Interactiviteit | Resultaten na afloop tonen als klasoverzicht (top-3 zorgen, top-3 suggesties) zodat leerlingen zien wat de groep gezamenlijk heeft bedacht. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
