# Missie-review: Connectivity Researcher (Digital Divide Researcher)

**Mission ID:** digital-divide-researcher
**Template:** data-viewer
**Curriculum-plek:** Leerjaar 3, Periode 3 (Maatschappelijke Impact & Innovatie), havo/vwo
**Datum:** 2026-07-02
**Reviewer-pipeline:** dgskills-mission-review v1.0 (wave 15, verse review)

---

## 🎨 Design review

**Score: 8.0/10**

### ✅ Geslaagd

- **Badge-kleuren correct binnen duck-palet:** `#202023` (duck-ink) en `#e1ff01` (duck-acid) zijn beide geldige tokens — geen off-brand kleuren. — `digital-divide-researcher.ts:197,209`
- **Bar-chart-kleuren zinvol gedifferentieerd:** de staafgrafiek gebruikt `#202023` voor de meerderheidsgroepen en `#ff3c21` (duck-error/coral) voor de twee laagste-gebruikgroepen (65-74, 75+) — een bewuste visuele highlight van de kloof, consistent met het thema. — `digital-divide-researcher.ts:84-90`
- **Layout consistent met engine:** gebruikt de gedeelde `DataViewer`-shell zonder custom styling-overrides; geen risico op afwijkende visuele bugs t.o.v. andere data-viewer-missies.
- **Copy-lengte intro:** `introDescription` is beknopt (3 zinnen), `introFeatures` zijn 3 korte bullets — passend bij leerjaar 3.
- **Iconografie:** 🌍-emoji en per-begrip-iconen (📡📶📊📈) zijn thematisch consistent en ondersteunen scanbaarheid van de document-cards.

### ⚠️ Aandachtspunten

- **Visual Precision Gate — unverified:** geen screenshots-map beschikbaar deze pass (geen dev-server-run in scope), en de missie komt niet voor in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (grep leeg). Dynamische verificatie (mobiel/tablet/desktop, tabel-scroll bij 8 rijen × 5 kolommen op mobiel) staat nog volledig open.
  - **Voorstel:** Bij eerstvolgende dev-server-pass expliciet checken of de 5-koloms tabel (`internetsnelheid-landen`) op mobiel horizontaal scrollt zonder afkap — dit is de breedste tabel in de missie-set en een reëel risico gezien het bekende systeem-brede shell-afknip-patroon uit de UI/UX-review.

### ❌ Blocking issues

Geen.

---

## 📚 Didactiek review

**Score: 8.0/10**
**SLO-claim:** 23C, 21B (`slo-kerndoelen-mapping.ts:179`)

### ✅ Geslaagd

- **SLO-codes correct en consistent:** `23C` en `21B` zijn geldige codes; `missionGoals.ts:780-788` en de `systemInstruction` (SLO 23C, 23B — zie aandachtspunt) wijzen beide naar hetzelfde onderzoeksvaardigheden-domein. `curriculum.ts` plaatst de missie correct in J3-P3 "Maatschappelijke Impact & Innovatie" met `sloFocus: ['23B','23C','21D']`, wat 23C dekt.
- **Leeftijdspassend niveau:** havo/vwo 15-16 jaar, difficulty 'Hard' — passend bij de analytische diepte (verklaringen vergelijken, adoptiecurve toepassen).
- **Bloom-balans sterk:** q1/q4 (Bloom 1-2, feiten aflezen), q2/q5 (Bloom 2-3, berekenen), q3/q6/q8 (Bloom 4-5, analyseren/verklaren/toepassen), q7 (Bloom 4, combineren van twee onafhankelijke indicatoren). Dit is een van de betere Bloom-spreidingen in de data-viewer-set.
- **AI-as-copilot correct toegepast:** `systemInstruction` verbiedt expliciet kant-en-klare conclusies ("Geef NOOIT een kant-en-klaar onderzoek"), dringt aan op bronkritiek ("Is dit een betrouwbare bron?") en gebruikt de 3-stappen-erkenning/uitleg/challenge-structuur impliciet via de STAP_COMPLETE-criteria.
- **Thema digitale kloof — geen stigmatisering:** de begrippen-cards en vragen framen verschillen tussen landen/leeftijdsgroepen consequent in termen van infrastructuur, beleid en geografie (niet individuele schuld of tekortkoming). Q3's explanation modelleert precies dit: "Snelheidsdata meten de huidige staat van het netwerk, niet de welvaart van een land op zichzelf" — een expliciete correctie tegen een voor de hand liggende foutieve aanname (welvaart = snelheid). Q6 behandelt ouderen neutraal or vraagt naar een onderbouwde toekomstverwachting zonder leeftijdsdiscriminerende framing.
- **Feitelijke claims plausibel en actueel-neutraal:** cijfers (Zuid-Korea/Nederland/Noorwegen top-connectiviteit, CBS-achtige leeftijdsverdeling smartphonegebruik) zijn realistische orde-groottes voor dit type onderzoek en bevatten geen harde jaartallen die snel verouderen in de leerling-facing tekst (de dataset-titels noemen wel "2024", wat op termijn kan verouderen maar acceptabel is als bronvermelding-conventie).

### ⚠️ Aandachtspunten

- **SLO-inconsistentie tussen bronnen (klein, feitelijk):** `slo-kerndoelen-mapping.ts:179` (autoritair) zegt `['23C', '21B']`, maar de `systemInstruction` in `year3.tsx:1457` zegt `(SLO 23C, 23B)` — noemt 23B in plaats van 21B. Dit is puur een in-prompt-referentie (raakt de AI-gedrag niet functioneel, de agent gebruikt de tekst niet als lookup), maar is een feitelijke mismatch tussen twee bronnen over dezelfde missie.
  - **Voorstel:** wijzig `year3.tsx:1457` van `(SLO 23C, 23B)` naar `(SLO 23C, 21B)` om te matchen met de autoritaire mapping.
- **Eerste-bericht Nigeria-cijfer wijkt af van dataset (verwarrend, niet fout):** het `EERSTE BERICHT` in `systemInstruction` (`year3.tsx:1490`) zegt "Nigeria zit op 21 Mbps" zonder mobiel/vast te specificeren. De dataset heeft Nigeria: mobiel 18 Mbps, vast 21 Mbps. Het bericht citeert dus toevallig de vaste snelheid naast Zuid-Korea's vaste snelheid (254 Mbps) — inhoudelijk correct maar impliciet inconsistent met de andere twee cijfers in dezelfde zin, die weer wél gespecificeerd zijn ("254 Mbps **vaste** internetsnelheid" ... "**gebruikt** 99% van de 18-24 jarigen").
  - **Voorstel:** "Nigeria zit op 21 Mbps **vast**." — kleine tekstwijziging voor consistentie, geen datawijziging nodig.

### ❌ Blocking issues

Geen.

---

## 🔧 Tech review

**Score: 5.5/10**
**Dynamic verificatie:** niet uitgevoerd deze pass (geen dev-server/screenshots in scope).

### Scoreplafond — exact nagerekend (BLOCKING)

Engine-formule (`DataViewer.tsx:79,88,95`): `multiple-choice`/`number-input` geven `q.points` bij correct antwoord (met 5%-tolerantie voor number-input, confidence-multiplier max 1.0 bij correct); `text-observation` geeft **altijd** `q.points` als participatiepunten (regel 79: `if (q.type === 'text-observation') return q.points;`).

| Dataset | Vraag | Type | Punten (haalbaar) |
|---|---|---|---|
| 1 | q1-snelste-land | multiple-choice | 15 |
| 1 | q2-verschil-nl-nigeria | number-input | 15 |
| 1 | q3-oorzaak-observatie | text-observation | 10 |
| **Subtotaal 1** | | | **40** |
| 2 | q4-laagste-gebruik | number-input | 15 |
| 2 | q5-gemiddelde-gebruik | number-input | 10 |
| 2 | q6-trend-observatie | text-observation | 10 |
| **Subtotaal 2** | | | **35** |
| 3 | q7-begrip-toepassen | multiple-choice | 15 |
| 3 | q8-eigen-analyse | text-observation | **0** |
| **Subtotaal 3** | | | **15** |
| **Totaal haalbaar** | | | **90** |
| **`maxScore` (config)** | | | **100** |

**BLOCKING BUG:** `maxScore: 100` (`digital-divide-researcher.ts:190`) maar de maximaal haalbare score is **90** — zelfs met perfecte antwoorden op alle 8 vragen kan de leerling nooit 100% behalen. De 10-punt-kloof komt exact overeen met q8's `points: 0`.

**Sub-bug in dezelfde vraag:** `q8-eigen-analyse` is `type: 'text-observation'` met `points: 0` (`digital-divide-researcher.ts:184`). Volgens de engine-logica (regel 79) geven text-observation-vragen **altijd** participatiepunten gelijk aan `q.points` — dit patroon is expliciet toegepast bij q3 (10pt) en q6 (10pt) in dezelfde missie. Een text-observation met `points: 0` is dus zelf-inconsistent met het eigen missie-patroon: de leerling schrijft een volwaardig antwoord (de vraag vraagt om "minimaal twee factoren" te noemen — net zo zwaar als q3/q6) maar krijgt gegarandeerd 0 punten, ongeacht kwaliteit.

- **Voorstel (kleinste correcte fix):** zet `q8-eigen-analyse` se `points` naar `10` (consistent met q3/q6) en verlaag `maxScore` naar... nee — reken opnieuw: met q8 op 10pt wordt het totaal 40+35+25=100, exact gelijk aan de huidige `maxScore: 100`. Dit is de fix die beide problemen in één wijziging oplost zonder `maxScore` te hoeven aanpassen.

  ```ts
  // digital-divide-researcher.ts:184
  - points: 0,
  + points: 10,
  ```

  Downstream-check uitgevoerd: q8 is de laatste vraag van de laatste dataset, geen andere vraag refereert aan of is afhankelijk van q8's score — geen cascade-effect op andere antwoorden.

### ✅ Geslaagd

- **q1 (multiple-choice) correct:** Zuid-Korea heeft de hoogste `vast_mbps` (254) in de tabel — geverifieerd tegen alle 8 rijen. — `digital-divide-researcher.ts:33,48`
- **q2 (number-input) correct:** 112 (NL mobiel) − 18 (Nigeria mobiel) = 94, exact gelijk aan `correctAnswer: 94`. 5%-tolerantie (±4.7) accepteert 89-99 — redelijke marge. — `digital-divide-researcher.ts:56-58`
- **q4 (number-input) correct:** 99 (18-24 jaar) − 44 (75+ jaar) = 55, exact gelijk aan `correctAnswer: 55`. — `digital-divide-researcher.ts:96-98`
- **q5 (number-input) correct:** (98+99+97+93+82+68+44) ÷ 7 = 581 ÷ 7 = 83.0 (exact, geen afronding nodig), gelijk aan `correctAnswer: 83`. — `digital-divide-researcher.ts:106-108`
- **q7 (multiple-choice) correct:** "B en C zijn allebei juist" — B ("bijna iedereen toegang, lage kwaliteit") en C ("slechts 5% geen internet") zijn beide logisch correcte deelconclusies uit "95% penetratie, 8 Mbps snelheid"; A is aantoonbaar fout (8 Mbps is niet uitstekend). — `digital-divide-researcher.ts:163-173`
- **Downstream-correctheid (neural-navigator-les toegepast):** geen enkele vraag in deze missie is afhankelijk van het antwoord op een andere vraag — alle correctAnswers zijn onafhankelijk berekenbaar uit de statische dataset, dus er is geen cascade-risico bij een eventuele toekomstige datawijziging.
- **`chartData`-kleuren zijn geldige hex, geen ongedefinieerde duck-tokens** — geen `duck-*`-classname-gebruik in de config zelf (data-viewer configs gebruiken raw hex voor chart-kleuren, wat conform het bekende patroon is).
- **Geen AI-security-issues:** `enableChat` niet gezet in de config (data-viewer-missies zonder expliciete chat-flag hebben geen dormante-chat-rol-risico op config-niveau — de missie draait puur op statische data + vragen).
- **Correct geregistreerd in `VALID_DATA_VIEWER_IDS`-allowlist** — `DataViewer.tsx:726`.
- **Consistente identiteit over alle 10 registratiepunten:** `types.ts` (RoleId-union), `templateRegistry.ts`, `missionGoals.ts`, `slo-kerndoelen-mapping.ts`, `curriculum.ts`, `agentRoleIds.ts`, `missionThumbnails.ts`, `basisvaardigheden-mapping.ts`, `year3.tsx` (agent-rol), `missionBuilder.tsx` (info + titel) — alle 10 bronnen aanwezig en wijzen naar dezelfde `digital-divide-researcher`-ID.

### ⚠️ Aandachtspunten

- **`useAgentLogic.ts:295` suggestievragen zijn generiek maar functioneel:** "Welk land heeft het snelste internet?", "Vergelijk gebruik per leeftijdsgroep", "Hoe betrouwbaar is deze databron?" — geen technisch risico, maar de derde suggestie ("Hoe betrouwbaar is deze databron?") heeft geen directe dataset-bronvermelding om op te reflecteren (de configs noemen wel bronnen als titel-suffix: "Speedtest Global Index", "CBS" — dit is voldoende maar minimaal).

### ❌ Blocking issues

- **`maxScore`/scoreplafond-mismatch (90 haalbaar vs 100 geconfigureerd)** — leerling kan nooit 100% behalen, ongeacht kwaliteit van antwoorden. Zie voorstel-blok hierboven (fix: `q8.points: 0 → 10`).

---

## Samenvatting

- **Geslaagd:** design 5/5 · didactiek 5/6 substantiële criteria · tech 9/10 (exclusief de blocking scoreplafond-bug)
- **Blocking:** 1 (scoreplafond-mismatch — `maxScore: 100` maar haalbaar `90`, veroorzaakt door `q8.points: 0` op een text-observation-vraag die per missie-patroon 10pt hoort te geven)
- **Resterende issues:** 1 design (dynamische verificatie tabel-scroll mobiel, onverified) · 2 didactiek (SLO-referentie-mismatch 23B/21B tussen `systemInstruction` en autoritaire mapping; klein Nigeria-cijfer-consistentiepunt in eerste bericht) — alle laag risico, geen showstoppers
- **Sterkste punt:** rekenkundige juistheid van alle 4 number-input/multiple-choice-antwoorden is 100% correct nagerekend tegen de dataset, en de Bloom-balans + anti-stigmatiserende framing van het digitale-kloof-thema is een van de sterkere voorbeelden in de missie-set
- **Grootste risico:** de scoreplafond-bug is een directe UX-breker (leerling kan structureel nooit 100% zien, ongeacht prestatie) — zelfde categorie fout als eerder gevonden bij `word-wizard` (2026-06-14), maar hier nog niet eerder gedetecteerd/gefixt

**Triage-score:** 2.75 (laag = gezond; schaal (10-design)×0.3 + (10-didactiek)×0.4 + (10-tech)×0.3, met tech=5.5 vanwege de blocking bug)

**Verdict: BLOCKED** (scoreplafond-mismatch is een directe leerling-facing bug — 1-regel-fix beschikbaar, geen architecturale wijziging nodig)

---

## Codex-gate (M1)

**Niet uitgevoerd deze pass** — token-discipline batch-review (wave 15) beperkt scope tot statische drie-rubriek-analyse zonder adversarial gate. Aanbevolen vóór een release-beslissing, met name om de voorgestelde `points: 0 → 10`-fix te bevestigen tegen eventuele bedoelde ontwerpkeuze (geen indicatie in de code/comments dat `points: 0` opzettelijk is — alle andere text-observation-vragen in dezelfde missie krijgen wel punten).
