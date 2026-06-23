# Taalniveau- & moeilijkheidsaudit — alle missies (juni 2026)

> **Scope:** alle 97 curriculum-missies (LJ1–LJ3, periode 1–4, incl. review-missies).
> **Vraag:** (A) past taal + moeilijkheid bij de toegewezen groep? (B) is jargon al in een eerdere missie uitgelegd — zo niet, moet het worden aangepast?
> **Status:** audit + rapport. **Géén code gewijzigd.** Aanpassingen zijn voorstellen ter goedkeuring.
> **Methode:** per missie de leerling-gerichte tekst gelezen; getoetst aan de woordbudgetten (design-reviewer Crit. 4), woordenschat/toon (didactiek-reviewer Crit. 5) en Bloom/curriculum-fit. Cross-missie jargon-check via curriculum-volgorde (`getPeriodForMission`). Een steekproef van de 🔴's + de inhoudsfout is op regelniveau geverifieerd.

---

## Kernantwoord (TL;DR)

**A — Taal & moeilijkheid:** voor het overgrote deel passend. Van de 97 missies: **🟢 26 (27%) goed**, **🟡 62 (64%) kleine aanpassing**, **🔴 9 (9%) aanpassing nodig**. De 🔴's zijn vrijwel allemaal **te moeilijk voor de onderbouw** — vooral missies die in LJ1/begin-LJ2 al échte code, statistiek of juridische AVG-stof eisen. In LJ3 is niets te makkelijk op één randgeval na.

**B — Jargon eerder uitgelegd?** Hier zit het grootste, meest systematische probleem, in twee vormen:
1. **"Net te laat" (zeer vaak):** de vakterm staat in de vraag/het scenario dat de leerling éérst leest, maar de uitleg staat pas in de *feedback ná het antwoord* of in de *afsluitende takeaway*. Technisch "uitgelegd in de missie", didactisch te laat.
2. **"Koud, nergens uitgelegd" (de echte Check-B-fails):** een handvol kernbegrippen wordt herhaaldelijk koud gebruikt en nóóit gedefinieerd — **AVG**, **EU AI Act**, **domein**, **pitch**, en een cluster onvertaalde Engelse termen. Plus enkele **volgorde-fouten** binnen LJ1-P3 (een term wordt gebruikt in een missie die vóór zijn eigen introductie-missie staat).

**Bonus (buiten taalscope, wel kritiek):** `encryption-expert` (LJ3-P2) bevat een **inhoudelijke fout** — de Caesar-puzzel is onoplosbaar zoals geschreven.

---

## De vijf terugkerende patronen

### 1. "Uitleg pas ná het antwoord" — het dominante patroon (tientallen missies)
Begrippen als *FOMO, dopamine, verliesaversie, correlatie, causaliteit, dark pattern, bias, doxing, KPI, datatype, AVG* staan in de **vraag/scenario** die de leerling eerst leest; de gloss zit in de **`explanation`** (verschijnt ná de keuze) of in de **`takeaways`** (einde missie). De leerling moet de vraag dus beantwoorden mét een term die pas daarna wordt uitgelegd.
→ **Voorstel (generiek):** zet bij een nieuw kernbegrip één korte gloss in de `description`/`introDescription` **vóór** de eerste vraag, niet alleen in de feedback.

### 2. Koud jargon dat nergens wordt uitgelegd — de echte Check-B-fails
| Term | Eerste koude gebruik | Ooit uitgelegd? | Voorstel |
|---|---|---|---|
| **AVG** | cookie-crusher (LJ1-P3, r83) | ❌ nooit gedefinieerd | 1 zin bij eerste gebruik (LJ1-P3): "de Europese privacywet" |
| **EU AI Act** | ai-ethicus (LJ2-P4, r57) | ❌ nooit | 1 bijzin bij eerste gebruik (LJ2-P4) |
| **domein** | mail-detective (LJ1-P3, r79) | ❌ nooit | gloss "het stuk achter de @ / na www." |
| **pitch** | mission-vision/-launch (LJ1-P4) | ❌ nooit (alleen context) | 1 zin "een korte, overtuigende presentatie" bij LJ1-P4 |
| **persoonsgegevens** | social-safeguard (LJ1-P3) | pas LJ2-P1 (data-review takeaway) | gloss naar voren halen naar LJ1-P3 |
| Engels jargon: *actionable, user research, pacing, dissolve, fade to black, short-form, high-priority, traction, break-even, content, deterministisch* | div. LJ2/LJ3 | ❌ onvertaald | vertaal of zet NL-equivalent ernaast |

### 3. Volgorde-fouten binnen LJ1-P3 (term vóór zijn introductie gebruikt)
Binnen periode 3 van leerjaar 1 worden drie begrippen koud gebruikt in een missie die **vóór** de missie staat die ze netjes introduceert:
- **filterbubbel** & **dark pattern** & **correlatie**: koud in `data-detective` (idx 22) — terwijl `filter-bubble-breaker` (idx 31, legt filterbubbel uit r38), `cookie-crusher` (idx 28, legt dark pattern uit r44) en de statistiek-missies later komen.
→ **Voorstel:** `data-detective` ofwel later in P3 plaatsen, ofwel de drie termen daar van een gloss voorzien.

### 4. Woordbudget-overschrijdingen — geconcentreerd in `steps[].instruction`
De intro's halen het budget bijna overal; de overschrijdingen zitten vrijwel uitsluitend in **builder-canvas / tool-guide instructie-blokken** die 4–6 deeltaken in één alinea proppen.
- **LJ1 (budget opdracht <60w):** word-wizard stap1 (77w), data-handelaar puzzel4 (65w), mission-blueprint stap1 (94w), **mission-vision stap "pitchen" (~106w)**, mission-launch stap4 (82w). Plus stakeholder-perspectieven van 61–62w (scroll-stopper, schermtijd-coach, digitale-balans-coach) net over de 60w-grens voor lopende tekst.
- **LJ2 (<60w):** automation-engineer instr4 (72w), digital-storyteller stap3 (65w).
- **LJ3 (<80w):** startup-simulator stap4 (~100w), startup-pitch stap3 (~96w), pitch-perfect stap1 (97w), prototype-developer (84w), meesterproef verdediging (88w).
→ **Voorstel:** splits zulke instructies, of verplaats de opsomming naar `checklistItems`.

### 5. Moeilijkheid (A3) — bijna altijd "te moeilijk in de onderbouw"
9× 🔴, plus enkele zware 🟡's. Zie de detailtabel hieronder. Eén randgeval is juist **te makkelijk**: `startup-pitch` stap 3 (logo/slogan beschrijven) is oppervlakkig voor havo/vwo LJ3.

---

## 🔴 Detail — de 9 missies die aanpassing nodig hebben

| # | Missie | LJ-P | Wat is mis | Voorstel |
|---|---|---|---|---|
| 7 | **game-programmeur** | 1-2 | `difficulty:'Hard'`; leerling moet HTML/JS-code lezen/aanpassen (canvas, requestAnimationFrame, jumpForce) — te steil voor 12-13j zonder programmeerbasis | Mini-woordenlijst per stap; heroverweeg of dit LJ1 is i.p.v. LJ2 |
| 15 | **website-bouwer** | 1-2 | Leerling schrijft volledige HTML+CSS van nul (`<!DOCTYPE>`, tags, selectors); intro gebruikt "HTML/CSS" koud | Voeg "Wat is HTML?" toe in intro; leg elke tag uit in de stap-`description`; overweeg LJ2 |
| 21 | **review-week-2** | 1-2 | Stapelt programmeer- + AI-jargon koud (event listener, onKeyDown, hallucinatie als categorielabel, spawn) | Gloss bij hallucinatie-categorie; "event listener" → "code die op een toets reageert" |
| 30 | **data-handelaar** | 1-3 | AVG-artikelen citeren (art. 5, 6:194), doelbinding, dataportabiliteit; puzzel 4 = 65w | LJ3-stof in LJ1; juridische termen vereenvoudigen; puzzel 4 inkorten + zonder artikelnummers |
| 34 | **data-speurder** | 1-3 | Statistiek te zwaar voor LJ1: correlatie/causaliteit, scatterplot, mediaan/modus, gewogen gemiddelde, representatieve steekproef; marketingzin in intro | "verband"/"oorzaak" i.p.v. correlatie/causaliteit; ronde 2 beperken tot 3 grafiektypes; intro hertalen |
| 37 | **mission-vision** | 1-4 | Stap "pitchen" ~106w combineert pitch schrijven + PowerPoint bouwen + opslaan; "visiestelling/kernwaarden/pitch" koud | Splits in 2 stappen (<60w elk); leg pitch/kernwaarden uit vóór gebruik |
| 43 | **api-verkenner** | 2-1 | JSON/REST/datatype (string/number/boolean/array)/Unix timestamp/URL-parameters gestapeld koud; vraag toetst "datatype" dat niet is opgebouwd | "JSON" glossen in intro; datatype-vraag herschrijven; Unix timestamp/REST weglaten of uitleggen |
| 47 | **algorithm-architect** | 2-2 | log₂(1024) en O(n²)/Big-O-notatie in vragen (VWO-bovenbouwstof); "computational thinking" als antwoord zonder introductie | Vervang log/Big-O door observatievragen; introduceer de term vóór de vraag |
| 52 | **automation-engineer** | 2-2 | Python-script van nul (functiedefinities, modules, smtplib, main-sectie); instr4 = 72w | Lege functie-template aanbieden; "module" glossen; instr4 < 60w |

---

## ⚠️ Inhoudsfout (buiten taalscope — wel kritiek)

**`encryption-expert` (LJ3-P2), puzzel `caesar-crack`:** de versleutelde tekst en het antwoord kloppen niet op elkaar.
- Versleuteld: `YHLJKWLJ` (8 letters). Antwoord: `veilig` (6 letters) — onmogelijk te matchen.
- `veilig` met +3 = `YHLOLJ`, niet `YHLJKWLJ`.
- De clue (`encryption-expert.ts:27`) en `successMessage` (r39) mappen `Y→V,H→E,L→I,J→G,K→H,W→T,L→I,J→G` = ~"VEIGHTIG", maar claimen "VEILIG". De `extraClue` (r30, "I−3=F... A=1,B=2") voegt nog een tegenstrijdige conventie toe.
→ **Voorstel:** herstel de puzzel (kies één ciphertext dat correct naar `veilig` decodeert, bv. `YHLOLJ`, en maak clue + successMessage consistent). Dit is geen taalkwestie maar een werkende-missie-kwestie — apart oppakken.

---

## Per-missie overzicht (denominator-check: 97 rijen)

Legenda RAG: 🟢 passend · 🟡 kleine aanpassing · 🔴 aanpassing nodig. A1 = woordbudget (✓ = binnen, ✗ = overschrijding in genoemd veld).

### Leerjaar 1 (intro <80w / opdracht <60w)
| # | Missie | P | Type | RAG | A1 | Kern |
|---|---|---|---|---|---|---|
| 1 | magister-master | 1 | tool-guide | 🟢 | ✓ | ELO koud (klein) |
| 2 | cloud-commander | 1 | tool-guide | 🟡 | ✓ | deelicoon/koppeling/App Library koud |
| 3 | word-wizard | 1 | tool-guide | 🟡 | ✗ stap1 77w | auteursrecht/365-licentie koud; stap1 inkorten |
| 4 | slide-specialist | 1 | tool-guide | 🟢 | ✓ | diavoorstelling/timing klein |
| 5 | print-pro | 1 | tool-guide | 🟡 | ✓ | merknamen + printbudget koud; stap1 verdichten |
| 6 | prompt-master | 2 | handcrafted | 🟡 | ✓ | persona/format/output/context koud (expert-niveau) |
| 7 | game-programmeur | 2 | agent | 🔴 | ✓ | te moeilijk (HTML/JS); code-jargon koud |
| 8 | ai-trainer | 2 | agent | 🟡 | ✓ | model/dataset/patronen koud in stappen |
| 9 | chatbot-trainer | 2 | agent | 🟢 | ✓ | — |
| 10 | verhalen-ontwerper | 2 | agent | 🟡 | ✓ | "professionele illustraties" niet LJ1-taal; scenario te dun |
| 11 | game-director | 2 | handcrafted | 🟡 | ✓ | zwaartekracht-parameter + "AI Alignment" te abstract |
| 12 | ai-tekengame | 2 | agent | 🟢 | ✓ | — |
| 13 | ai-beleid-brainstorm | 2 | agent | 🟡 | ✓ | "AI-beleid" = bestuursjargon → "AI-regels" |
| 14 | code-denker | 2 | scenario | 🟡 | ✓ | computational-thinking-termen koud (uitleg pas in takeaway); Fibonacci |
| 15 | website-bouwer | 2 | builder | 🔴 | ✓ | te moeilijk (HTML+CSS van nul); HTML/CSS koud in intro |
| 16 | schermtijd-coach | 2 | debate | 🟡 | ✗ perspectief 62w | autoplay/DSA/variabele beloningen koud |
| 17 | notificatie-ninja | 2 | scenario | 🟡 | ✓ | FOMO/dopamine/verliesaversie koud in feedback |
| 18 | cloud-cleaner | 2 | handcrafted | 🟡 | ✓ | geen zichtbare intro; OneDrive/cloud onverklaard |
| 19 | layout-doctor | 2 | handcrafted | 🟡 | ✓ | tekstterugloop/sans-serif koud |
| 20 | pitch-police | 2 | handcrafted | 🟢 | (✗ by design) | lange dia = bewust fout; geen actie |
| 21 | review-week-2 | 2 | review-arena | 🔴 | ✓ | jargon-dichtheid (event listener/hallucinatie-label/spawn) |
| 22 | data-detective | 3 | handcrafted | 🟡 | ✓ | **volgorde:** dark pattern/correlatie/filterbubbel koud vóór hun intro-missies |
| 23 | data-verzamelaar | 3 | agent | 🟢 | ✓ | dataset-term koud (klein) |
| 24 | deepfake-detector | 3 | handcrafted | 🟡 | ✓ | "AI-gegenereerde content" + expert-uitleg te technisch |
| 25 | ai-spiegel | 3 | simulation | 🟡 | ✓ | filterbubbel/algoritme koud; democratie-vraag te abstract |
| 26 | social-safeguard | 3 | scenario | 🟡 | ✓ | doxing koud in intro (uitleg pas in item) |
| 27 | scroll-stopper | 3 | debate | 🟡 | ✗ perspectief 62w | prefrontale cortex/variabele beloningen te wetenschappelijk |
| 28 | cookie-crusher | 3 | scenario | 🟢 | ✓ | AVG koud (1 zin gloss volstaat) |
| 29 | mail-detective | 3 | scenario | 🟡 | ✓ | **domein/phishing/malware koud, nooit uitgelegd** |
| 30 | data-handelaar | 3 | puzzle | 🔴 | ✗ puzzel4 65w | AVG-artikelen → te moeilijk voor LJ1 |
| 31 | filter-bubble-breaker | 3 | handcrafted | 🟢 | ✓ | legt filterbubbel/algoritme netjes uit |
| 32 | datalekken-rampenplan | 3 | handcrafted | 🟡 | ✓ | data-exfiltratie/2FA/DDoS/penetratietest koud |
| 33 | data-voor-data | 3 | handcrafted | 🟢 | ✓ | BSN/biometrische data 1 gloss |
| 34 | data-speurder | 3 | scenario | 🔴 | ✓ | statistiek te moeilijk voor LJ1 |
| 35 | digitale-balans-coach | 3 | debate | 🟢 | ✗ perspectief 61w | prefrontale gebied 1 gloss |
| 36 | mission-blueprint | 4 | builder | 🟡 | ✗ stap1 94w | "definitie van Done"/afhankelijkheden; stap1 splitsen |
| 37 | mission-vision | 4 | builder | 🔴 | ✗ stap ~106w | overladen stap + pitch/kernwaarden koud |
| 38 | mission-launch | 4 | tool-guide | 🟡 | ✗ stap4 82w | goed uitgelegd (CTA); stap4 inkorten |
| 39 | review-week-3 | 4 | debate/review | 🟡 | ✓ | AVG/dataset/representatief/juridisch verweer koud |

### Leerjaar 2 (intro <80w / opdracht <60w)
| # | Missie | P | Type | RAG | A1 | Kern |
|---|---|---|---|---|---|---|
| 40 | data-journalist | 1 | data-viewer | 🟡 | ✓ | meta-analyse/conflict of interest/validiteit koud |
| 41 | spreadsheet-specialist | 1 | data-viewer | 🟡 | ✓ | penningmeester/uitschieters (eerste keer) glossen |
| 42 | factchecker | 1 | scenario | 🟡 | ✓ | clickbait koud; CRAAP-termen ook NL geven |
| 43 | api-verkenner | 1 | data-viewer | 🔴 | ✓ | JSON/REST/datatype te moeilijk + koud |
| 44 | dashboard-designer | 1 | data-viewer | 🟡 | ✓ | KPI vóór vraag glossen; Tufte/data-ink ratio schrappen |
| 45 | ai-bias-detective | 1 | scenario | 🟡 | ✓ | trainingsdata/proxy/redlining/gemarginaliseerd koud |
| 46 | data-review | 1 | review-arena | 🟡 | ✓ | **AVG koud**; bcrypt/TLS/SSL te technisch voor LJ2 |
| 47 | algorithm-architect | 2 | simulation | 🔴 | ✓ | log₂/Big-O te moeilijk; computational thinking koud |
| 48 | web-developer | 2 | builder | 🟡 | ✓ | "schrijf JS-functie" te steil; Flexbox/Grid/DOM koud |
| 49 | network-navigator | 2 | data-viewer | 🟢 | ✓ | termen consequent uitgelegd |
| 50 | app-prototyper | 2 | builder | 🟡 | ✓ | user research/waardepropositie/UX-designers onvertaald |
| 51 | bug-hunter | 2 | simulation | 🟡 | ✓ | for-loop-vraag vereist JS-basis; mini-voorbeeld toevoegen |
| 52 | automation-engineer | 2 | builder | 🔴 | ✗ instr4 72w | Python van nul + module/smtplib koud |
| 53 | code-reviewer | 2 | simulation | 🟡 | ✓ | "actionable" onvertaald; functie koud |
| 54 | privacy-by-design | 2 | simulation | 🟡 | ✓ | "Privacy by Design"-kernterm + AVG nergens uitgelegd |
| 55 | wachtwoord-warrior | 2 | puzzle | 🟡 | ✓ | machtsverheffing 36⁶ verankeren |
| 56 | access-control-engineer | 2 | handcrafted | 🟡 | ✓ | least privilege (EN)/resource/authenticatie koud |
| 57 | code-review-2 | 2 | review-arena | 🟡 | ✓ | API/UX/responsive koud als label (uitleg later) |
| 58 | ux-detective | 3 | data-viewer | 🟡 | ✓ | high-priority issue/cognitieve belasting koud |
| 59 | podcast-producer | 3 | builder | 🟢 | ✓ | — |
| 60 | meme-machine | 3 | builder | 🟢 | ✓ | doelgroep/punchline klein |
| 61 | digital-storyteller | 3 | builder | 🟡 | ✗ stap3 65w | "in medias res" vertalen; stap3 inkorten |
| 62 | brand-builder | 3 | builder | 🟡 | ✓ | hexadecimale kleurcode/WCAG koud |
| 63 | video-editor | 3 | builder | 🟡 | ✓ | pacing/dissolve/fade to black/voice-over koud |
| 64 | online-helden | 3 | scenario | 🟢 | ✓ | doxxing netjes uitgelegd |
| 65 | media-review | 3 | review-arena | 🟡 | ✓ | vertical video/short-form onvertaald |
| 66 | ai-ethicus | 4 | debate | 🟡 | ✓ | 3 bias-typen gestapeld; **EU AI Act/AVG koud** |
| 67 | digital-rights-defender | 4 | debate | 🟡 | ✓ | AVG/DPIA/wettelijke grondslag koud |
| 68 | tech-court | 4 | debate | 🟢 | ✓ | indirecte discriminatie wordt uitgelegd |
| 69 | future-forecaster | 4 | debate | 🟢 | ✓ | futuroloog klein |
| 70 | sustainability-scanner | 4 | data-viewer | 🟢 | ✓ | embodied carbon alleen in feedback (ok) |
| 71 | eindproject-j2 | 4 | data-viewer | 🟢 | ✓ | user testing netjes uitgelegd |

### Leerjaar 3 — havo/vwo (intro <120w / opdracht <80w)
| # | Missie | P | Type | RAG | A1 | Kern |
|---|---|---|---|---|---|---|
| 72 | ml-trainer | 1 | data-viewer | 🟡 | ✓ | "feature engineering" koud (rest goed uitgelegd) |
| 73 | api-architect | 1 | builder | 🟡 | ✓ | stateless/Swagger/HTTP-statuscodes koud |
| 74 | neural-navigator | 1 | data-viewer | 🟡 | ✓ | backpropagation koud in intro; random initialization |
| 75 | data-pipeline | 1 | data-viewer | 🟢 | ✓ | ETL/imputatie netjes uitgelegd |
| 76 | open-source-contributor | 1 | builder | 🟡 | ✓ | repository/fork/pull request koud in intro; deterministisch/maintainer |
| 77 | advanced-code-review | 1 | review-arena | 🟡 | ✓ | epoch/deployen koud (review veronderstelt voorkennis) |
| 78 | cyber-detective | 2 | puzzle | 🟢 | ✓ | dark web/SQL-injectie klein |
| 79 | encryption-expert | 2 | puzzle | 🟡 | ✓ | **INHOUDSFOUT Caesar** (zie boven); base64-tabel zwaar; wachtwoord-puzzel te makkelijk |
| 80 | phishing-fighter | 2 | scenario | 🟢 | ✓ | termen netjes uitgelegd |
| 81 | security-auditor | 2 | puzzle | 🟡 | ✓ | **OWASP nergens uitgelegd**; CSP/CSRF koud |
| 82 | digital-forensics | 2 | scenario | 🟢 | ✓ | RFC 1918/metadata klein |
| 83 | security-review | 2 | review-arena | 🟡 | ✓ | man-in-the-middle/rate limiting/AES koud; categorize-ronde wat makkelijk |
| 84 | startup-simulator | 3 | builder | 🟡 | ✗ stap4 ~100w | traction/break-even koud; stap4 splitsen |
| 85 | policy-maker | 3 | debate | 🟡 | ✓ | biometrische identificatie/paternalistisch/stakeholderanalyse koud |
| 86 | innovation-lab | 3 | builder | 🟡 | ✓ (~80w grens) | blockchain/kwantitatief-kwalitatief koud |
| 87 | digital-divide-researcher | 3 | data-viewer | 🟢 | ✓ | digitale kloof netjes uitgelegd |
| 88 | tech-impact-analyst | 3 | data-viewer | 🟡 | ✓ | algoritmische bias in vraag (uitleg pas in feedback); EU AI Act koud |
| 89 | welzijnsonderzoeker | 3 | data-viewer | 🟢 | ✓ | correlatie/causaliteit netjes uitgelegd |
| 90 | startup-pitch | 3 | tool-guide | 🟡 | ✗ stap3 ~96w | stap3 te makkelijk (branding) + te lang; branding-termen koud |
| 91 | impact-review | 3 | review-arena | 🟡 | ✓ | AVG/biometrische data/EU AI Act/polarisatie koud |
| 92 | portfolio-builder | 4 | builder | 🟢 | ✓ | portfolio/reflectie netjes uitgelegd |
| 93 | research-project | 4 | data-viewer | 🟡 | ✓ | correlatie/causaliteit/peer-reviewed/cohort koud (uitleg pas in feedback) |
| 94 | prototype-developer | 4 | builder | 🟡 | ✗ stap 84w | feature creep/rubber duck uitgelegd; instr 4w inkorten |
| 95 | pitch-perfect | 4 | builder | 🟡 | ✗ stap1 97w | pitch/hook; stap1 inkorten |
| 96 | reflection-report | 4 | debate | 🟢 | ✓ | reflectie-termen bewust open (debat) |
| 97 | meesterproef | 4 | builder | 🟡 | ✗ verdediging 88w | SMART netjes uitgelegd; instr 8w inkorten |

---

## Appendix — Jargon-introductie-index (waar wordt een kernterm voor het eerst uitgelegd?)

Voor toekomstige auteurs: de canonieke plek waar een begrip uitgelegd zou moeten worden, en waar het nu koud opduikt. "✅ ok" = wordt eerder/hier netjes geïntroduceerd; "⚠️" = koud gebruikt vóór of zonder introductie.

| Term | Canonieke introductie | Koud gebruikt in (vóór/zonder uitleg) |
|---|---|---|
| **AVG** | — (ontbreekt) | cookie-crusher, data-handelaar (LJ1-P3); data-review (LJ2-P1); digital-rights-defender (LJ2-P4); privacy-by-design (LJ2-P2); impact-review (LJ3) |
| **EU AI Act** | — (ontbreekt) | ai-ethicus, tech-court (LJ2-P4); policy-maker, tech-impact-analyst, impact-review (LJ3) |
| **domein** | — (ontbreekt) | mail-detective (LJ1-P3) |
| **pitch** | — (alleen context) | mission-vision/-launch (LJ1-P4); startup-simulator/-pitch, pitch-perfect (LJ3) |
| **dark pattern** | cookie-crusher (LJ1-P3, r44) | ⚠️ data-detective (idx 22 < 28) |
| **filterbubbel** | filter-bubble-breaker (LJ1-P3, r38) | ⚠️ data-detective (idx 22 < 31), ai-spiegel (idx 25 < 31) |
| **algoritme** | filter-bubble-breaker (LJ1-P3) | ⚠️ code-denker (LJ1-P2, uitleg pas in takeaway), ai-spiegel |
| **correlatie / causaliteit** | welzijnsonderzoeker (LJ3-P3) — **te laat** | ⚠️ data-detective, data-speurder (LJ1-P3, hard gebruikt) |
| **phishing** | phishing-fighter (LJ3-P2) | ⚠️ mail-detective (LJ1-P3) koud |
| **prompt** | review-week-2 (LJ1-P2, r183) | prompt-master gebruikt het impliciet eerder |
| **API** | api-verkenner (LJ2-P1, takeaway) / api-architect (LJ3) | ⚠️ koud bij eerste gebruik (api-verkenner intro) |
| **bias** | ai-bias-detective (LJ2-P1) | ⚠️ review-week-3 (LJ1-P4) koud |
| **prototype** | app-prototyper (LJ2-P2, r9) ✅ | LJ3-gebruik is ná introductie → ok |
| **persoonsgegevens** | data-review (LJ2-P1, takeaway) | ⚠️ social-safeguard, data-voor-data, cookie-crusher (LJ1-P3) eerder |
| **OWASP** | — (ontbreekt) | security-auditor (LJ3-P2) |

**Conclusie B:** de meeste vaktermen wórden ergens in de leerlijn uitgelegd — maar (1) vaak pas in de feedback ná de vraag i.p.v. ervoor, en (2) een harde kern (**AVG, EU AI Act, domein, pitch, OWASP**) wordt nooit gedefinieerd. Aanbevolen minimale ingreep: bij elk van die kerntermen één gloss-zin op de eerste-gebruik-plek, plus de drie LJ1-P3 volgorde-correcties.

---

## Verificatie van dit rapport
- **Volledigheid:** 97 rijen = alle curriculum-missies (LJ1: 39, LJ2: 32, LJ3: 26). ✔
- **Geregeld op regelniveau (steekproef):** website-bouwer (r9/r35), api-verkenner (r9/r25-27/r57), mission-vision (r112-113, ~106w bevestigd), encryption-expert (r23-39, inhoudsfout bevestigd). ✔
- **Beperking:** woordtellingen komen van de reviewers (Sonnet) en zijn op een steekproef gecontroleerd, niet alle 97× handmatig hergeteld. De RAG-oordelen voor A2/A3 zijn pedagogische inschattingen, geen geautomatiseerde metriek.

## Aanbevolen vervolg (ter goedkeuring)
1. **Quick wins (laag risico, hoge dekking):** gloss-zin voor AVG, EU AI Act, domein, pitch, OWASP op hun eerste-gebruik-plek; 3 volgorde-correcties in LJ1-P3.
2. **Woordbudget:** ~12 instructie-blokken splitsen/inkorten (lijst hierboven).
3. **Moeilijkheid:** de 9 🔴's herzien — prioriteit LJ1 (game-programmeur, website-bouwer, data-handelaar, data-speurder).
4. **Apart spoor (geen taal):** Caesar-puzzel in `encryption-expert` repareren.
