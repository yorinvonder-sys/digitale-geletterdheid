# Audit — De Code-Criticus (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `review-week-2` |
| **Titel** | De Code-Criticus |
| **Leerjaar & Periode** | Leerjaar 1, Periode 2 (reviewmissie) |
| **Template-engine** | ReviewArena |
| **SLO-kerndoelen** | 21D (AI) + 22B (programmeren) — geclaimd |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [ ] `visualPreview` aanwezig en uitnodigend — `visualPreview: null` (letterlijk null in de config, regel 1564)
- [x] `introDescription` is aanwezig en begrijpelijk — de beschrijving legt uit dat je code en verhalen gaat reviewen
- [ ] Visueel element past bij het thema — geen visuele preview; een externe Unsplash-URL wordt gebruikt als fallback
- [x] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro — "Medium" is gecommuniceerd

**Bronbestanden:** `config/agents/year1.tsx:1564-1590`

**Score:** 2 / 5

**Opmerkingen:**
> Zwakke eerste indruk. `visualPreview: null` betekent dat er geen aangepaste preview-kaart is — de missie valt op in de missie-lijst door het ontbreken van een visueel element, wat een uitnodigende eerste indruk ondermijnt. De externe Unsplash-afbeeldings-URL introduceert een externe afhankelijkheid (privacy, beschikbaarheid) die niet wenselijk is voor een platform dat persoonsgegevens van minderjarigen verwerkt. De tekstuele beschrijving is voldoende maar mist de visuele haak die de andere missies in J1P2 wel hebben.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] `visualPreview` aanwezig met thematische gradient — volledig afwezig (`null`)
- [ ] Kleuren via `lab-*` tokens — geen visuele config om te beoordelen
- [ ] Externe afbeelding van Unsplash — externe URL als briefingImage introduceert privacyrisico en single point of failure
- [ ] Consistente visuele identiteit met andere J1P2-missies — ontbreekt volledig

**Bronbestanden:** `config/agents/year1.tsx:1564-1590`

**Score:** 2 / 5

**Opmerkingen:**
> Geen visuele preview gedefinieerd. Alle andere missies in J1P2 hebben zorgvuldig ontworpen gradients, emoji's en thematische preview-kaarten. Het ontbreken daarvan maakt `review-week-2` een visuele buitenbeentje. De Unsplash-URL als `briefingImage` is problematisch: het laadt externe content in een omgeving met minderjarigen (GDPR/AVG-implicaties), en als Unsplash de afbeelding verwijdert of de URL verandert, is de missie visueel gebroken.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] De twee cases zijn inhoudelijk relevant voor week 2 — een onaf verhaal (verhaalgenerator) en buggy spelcode sluiten aan bij de behandelde stof
- [ ] Slechts 2 stappen/cases aanwezig — beperkte diepgang voor een reviewmissie
- [ ] Geen progressieve moeilijkheid tussen de cases — beide cases zijn qua complexiteit vergelijkbaar
- [ ] Geen scaffolding naar het "waarom" — leerlingen identificeren fouten maar leren niet systematisch hoe ze dat moeten aanpakken

**Bronbestanden:** `config/agents/year1.tsx:1564-1650`

**Score:** 3 / 5

**Opmerkingen:**
> De reviewmissie heeft een duidelijk concept — kijk terug op stof uit week 2 en identificeer fouten in twee cases. De cases zelf zijn goed gekozen (onaf verhaal, boundary bug in spelcode). Maar de didactische opbouw is dun: slechts 2 cases, geen progressieve moeilijkheid, en geen instructie aan de AI-coach over hoe hints te geven als een leerling vastloopt. Een reviewmissie zou minimaal 3-4 cases moeten bevatten om voldoende herhaling te garanderen.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Cases zijn inhoudelijk correct — de boundary bug in de spelcode is een realistisch en correct geïdentificeerd probleem
- [x] Het onafgemaakte verhaal als eerste case is creatief en herkenbaar — leerlingen die de verhaalgeneratormissie gedaan hebben herkennen dit
- [x] ASCII-art voor het spelscherm is een originele en effectieve manier om code visueel te maken
- [ ] De antwoorden in de systemInstruction zijn correct maar de uitleg waarom is beperkt — de systemInstruction geeft de juiste antwoorden (A/B/C, specifieke foutidentificatie) maar weinig didactische context

**Bronbestanden:** `config/agents/year1.tsx:1564-1650`

**Score:** 4 / 5

**Opmerkingen:**
> De inhoud van de cases is goed en inhoudelijk correct. Het gebruik van ASCII-art om de spelscherm te visualiseren is een creatieve vondst die de abstracte fout concreet maakt. De cases testen herkenning van leerstof uit week 2, wat een legitiem reviewdoel is. Verbeterpunt: de systemInstruction geeft de juiste antwoorden maar biedt weinig didactische begeleiding voor leerlingen die er niet uitkomen. Meer uitleggende hints zouden het leereffect versterken.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is aanwezig — ~1800 tekens, functioneel maar beperkt
- [x] Intro-bericht is ingebed in stap 1 van de systemInstruction — er is een startbericht aanwezig (regel 1601)
- [ ] EERSTE BERICHT sectie ontbreekt als apart blok — het welkomstbericht is verweven in de instructietekst, niet als gestandaardiseerd `EERSTE BERICHT:` blok
- [ ] STEP_COMPLETE markers ontbreken — niet aanwezig; leerlingen typen "AFRONDEN" om de missie te beëindigen, wat een zwak afrondingsmechanisme is
- [ ] Hint-progressie ontbreekt — de systemInstruction geeft antwoorden maar beschrijft geen stapsgewijze hint-strategie

**Bronbestanden:** `config/agents/year1.tsx:1564-1650`, `config/agents/shared.tsx`

**Score:** 3 / 5

**Opmerkingen:**
> De systemInstruction is functioneel maar mist de gestandaardiseerde structuur die de betere missies kenmerkt. Er is geen `EERSTE BERICHT:` blok, geen `STEP_COMPLETE` markers, en geen hint-progressie. Het "typ AFRONDEN"-mechanisme is een noodoplossing — leerlingen weten dan niet op basis van leerresultaten wanneer ze klaar zijn, maar bepalen dat zelf. Dit is didactisch zwak voor een reviewmissie waarbij je juist wil weten of een leerling de stof begrijpt.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Case-gebaseerde review is een valide interactievorm voor een reviewmissie
- [x] De cases hebben duidelijke juist/fout-antwoorden (A/B/C keuzes, specifieke foutidentificatie)
- [ ] Slechts 2 cases — te weinig voor een volwaardige reviewervaring
- [ ] Weinig interactief buiten het beantwoorden van vragen — geen variatie in interactievorm

**Bronbestanden:** `config/agents/year1.tsx:1564-1650`, `components/missions/templates/review-arena/`

**Score:** 3 / 5

**Opmerkingen:**
> Het reviewformat is conceptueel goed — cases met duidelijke antwoorden lenen zich goed voor zelfevaluatie. Maar de uitvoering is minimaal: twee cases zijn onvoldoende voor een volwaardige reviewmissie. Er is geen variatie in interactievormen (alles is tekstueel vraag-antwoord). De ReviewArena-template heeft meer mogelijkheden dan hier benut worden.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [ ] Completion-criteria zijn helder voor de leerling — geen `goalCriteria` gedefinieerd
- [ ] Badges gedefinieerd — geen badges aanwezig
- [ ] Scoring systeem aanwezig — geen scoring
- [ ] `takeaways[]` samenvatten de kernlessen — geen takeaways gedefinieerd
- [ ] "typ AFRONDEN" is een zwak afrondingsmechanisme — leerling bepaalt zelf wanneer klaar, ongeacht leerresultaat

**Bronbestanden:** `config/agents/year1.tsx:1564-1650`

**Score:** 1 / 5

**Opmerkingen:**
> Geen enkel afrondingselement aanwezig. Geen goalCriteria, geen badges, geen scoring, geen takeaways. Het "typ AFRONDEN"-mechanisme geeft leerlingen de controle over wanneer de missie eindigt, wat betekent dat een leerling de missie kan afsluiten zonder de cases correct te beantwoorden. Dit is een blokkerende issue: voor een reviewmissie — waarvan het doel juist is te verifiëren of leerstof begrepen is — is dit didactisch onacceptabel. Vergelijk met `website-bouwer` en `schermtijd-coach` die beide `goalCriteria` en `STEP_COMPLETE` hebben.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [ ] Inhoud matcht 21D (AI) aantoonbaar — de cases testen herkenning van stof maar gaan niet expliciet over AI-gedrag of AI-mechanismen
- [ ] Inhoud matcht 22B (programmeren) aantoonbaar — de spelcode-case raakt programmeren zijdelings, maar de leerling schrijft geen code
- [ ] Het leerdoel is toetsbaar — leerlingen herkennen fouten, maar er is geen formeel verificatiemechanisme
- [x] De cases zijn relevant voor de behandelde stof uit week 2 — de connectie met eerdere missies is duidelijk

**Bronbestanden:** `config/agents/year1.tsx:1564`, `config/slo-kerndoelen-mapping.ts`

**Score:** 3 / 5

**Opmerkingen:**
> De SLO-mapping is problematisch. 21D (AI en apps sturen gedrag) en 22B (programmeren) worden geclaimd, maar de missie test voornamelijk herkenning en geheugen — leerlingen lezen over fouten in werk van anderen, schrijven zelf geen code, en werken niet actief met AI. Een reviewmissie die stof herhaalt is waardevol, maar de SLO-claims zouden beter passen bij kerndoelen als "kritisch denken" of "probleemoplossen". De huidige mapping is te optimistisch.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — teksten zijn begrijpelijk voor J1
- [x] Tekst-gebaseerde interactie is toetsenbord-toegankelijk
- [ ] ASCII-art rendert mogelijk niet goed op alle apparaten — afhankelijk van lettertype en schermresolutie
- [ ] Externe Unsplash-afbeelding — geen controle over alt-tekst of beschikbaarheid

**Bronbestanden:** `config/agents/year1.tsx:1564-1650`

**Score:** 3 / 5

**Opmerkingen:**
> Het leesniveau en de toetsenbordtoegankelijkheid zijn in orde. De ASCII-art voor het spelscherm is creatief maar fragiel: op apparaten met een niet-monospace lettertype of kleine schermresolutie kan de lay-out breken en de boodschap verloren gaan. De externe Unsplash-URL als briefingImage heeft geen controleerbare alt-tekst. Beide zijn aanpasbaar maar vereisen actie.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 2 | ×1 = 2 | visualPreview null, externe afbeelding |
| 2. Visueel | 2 | ×1 = 2 | Geen visuele preview, Unsplash URL |
| 3. Didactische flow | 3 | ×2 = 6 | 2 goede cases, te weinig diepgang |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Cases correct, ASCII-art creatief |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | Geen EERSTE BERICHT-blok, geen STEP_COMPLETE |
| 6. Interactiviteit | 3 | ×1 = 3 | Goed concept, te weinig cases |
| 7. Afronding & feedback | 1 | ×1 = 1 | Niets aanwezig, "typ AFRONDEN" is zwak |
| 8. SLO-aansluiting | 3 | ×1 = 3 | Stof herhaling ja, SLO-claims te ruim |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Tekst OK, ASCII-art en Unsplash risico |
| **TOTAAL** | | **31 / 55** | |

### Gewogen totaal

```
(2×1) + (2×1) + (3×2) + (4×2) + (3×1) + (3×1) + (1×1) + (3×1) + (3×1) = 31
Percentage = (31 / 55) × 100% = 56,4%
```

### Verdict

**❌ Niet inzetbaar** (56,4% — onder de 60% drempel)

> De Code-Criticus heeft een solide inhoudelijk concept — cases uit de behandelde stof reviewen is didactisch waardevol. Maar de uitvoering mist te veel essentiële elementen: geen visuele preview, geen goalCriteria, geen STEP_COMPLETE markers, geen badges of takeaways, en een afrondingsmechanisme ("typ AFRONDEN") dat leerresultaten niet verifieert. Dit zijn geen kleine verbeterpunten maar structurele tekortkomingen die de missie ongeschikt maken voor pilotinzet zonder significante revisie.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen goalCriteria, badges, scoring of takeaways. "typ AFRONDEN" vervangen door formele `goalCriteria` en `STEP_COMPLETE` markers. | Product |
| 2 | 1. Eerste indruk | `visualPreview: null` — een thematische preview-kaart (gradient, emoji, beschrijving) toevoegen passend bij het "code-criticus" thema. | Product |
| 3 | 2. Visueel | Externe Unsplash-URL als `briefingImage` verwijderen — vervangen door lokale asset of inline gradient preview. Privacy + beschikbaarheid risico. | Product + Security |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 5. AI-coach kwaliteit | `EERSTE BERICHT:` blok toevoegen als gestandaardiseerd welkomstbericht. `STEP_COMPLETE` markers toevoegen voor elke case. | Hoog |
| 2 | 3. Didactische flow | Minimaal 1 extra case toevoegen (totaal 3+) met progressieve moeilijkheid. Hint-strategie toevoegen aan de systemInstruction. | Hoog |
| 3 | 8. SLO-aansluiting | SLO-claims herzien: 21D en 22B zijn te ruim voor een reviewmissie. Overwegen: beperken tot de kerndoelen die de cases daadwerkelijk toetsen. | Medium |
| 4 | 9. Toegankelijkheid | ASCII-art vervangen door of aanvullen met een toegankelijke weergave (bijv. code-blok in monospace-container met vaste breedte). | Medium |

#### Nice-to-haves (optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Extra interactievorm toevoegen: bijv. slepen van coderegels in de juiste volgorde, of een korte quiz na elke case. |
| 2 | 4. Inhoudelijke correctheid | Uitleggende hints toevoegen aan de systemInstruction: als een leerling het fout heeft, legt de coach uit waarom het antwoord fout is — niet alleen wat het juiste antwoord is. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
