# Missie-review: data-handelaar

**Datum:** 2026-07-02
**Wave:** 14 (verse review)
**Template:** puzzle-lab
**Config:** `src/features/missions/templates/puzzle-lab/configs/data-handelaar.ts`
**Agent-rol:** `src/config/agents/year1.tsx:2453-2574`
**SLO:** `src/config/slo-kerndoelen-mapping.ts:74` — leerjaar 1, week 3, kerndoelen `23A`, `23C` (Digitaal Burgerschap / privacy); VSO `20A`, `20B`
**Curriculum:** `src/config/curriculum.ts:117` — Leerjaar 1, Periode 3 "Digitaal Burgerschap"
**MissionGoal:** `src/config/missionGoals.ts:265-271`

---

## 🎨 Design review

**Mission:** data-handelaar (puzzle-lab)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** de config-file zelf (`data-handelaar.ts`) bevat geen Tailwind className-strings — puur data (puzzels, badges, takeaways). Badge-kleuren `#e1ff01`/`#202023` (`:144,150,156,162`) zijn data-config-velden, geen classNames, en matchen exact de sibling-conventie in `encryption-expert.ts`, `wachtwoord-warrior.ts`, `security-auditor.ts`, `cyber-detective.ts` — geen tokenschending.
- **Criterium 4 (Copy-lengte):** `introDescription` = 48 woorden (leerjaar 1-limiet: <100) — `data-handelaar.ts:9`. Puzzel-descriptions (incl. de e-mail/klantprofiel-documenten) zijn langer maar zijn bewust "bewijsstuk"-materiaal (leesstof), geen instructie-copy — vergelijkbaar patroon als andere detective-achtige puzzle-lab missies.
- **Criterium 3 (Knop-clarity):** N.v.t. voor deze static config-review — knoppen (SUBMIT, hint, overslaan) zitten in `PuzzleLab.tsx` (gedeelde engine), niet in deze missie-config. Engine-issues niet herhaald (bekend).

### ⚠️ Aandachtspunten
- **Legacy `lab-*` tokens in agent-rol `visualPreview`** — `src/config/agents/year1.tsx:2467-2481`
  - **Wat:** `bg-lab-coral`, `bg-lab-coral/30`, `bg-lab-coral/20`, `bg-lab-coral/50`, `text-lab-coral`, `border-lab-coral/50` — geen from/to-gradient-bug (solid-color kaart, geen identieke stops zoals bij `spreadsheet-specialist`), dus alleen het legacy-tokenvraagstuk speelt.
  - **Waarom:** `lab-*` is legacy (bekend, platformbreed, niet opnieuw als missie-specifiek issue te behandelen). Zit bovendien in de agent-rol-file, niet in de puzzle-lab config zelf — strikt genomen buiten de primaire review-scope van dit rapport.
  - **Voorstel:** geen actie in dit rapport (bekend platformbreed patroon, geen lokale extra-fout zoals identieke gradient-stops).

### ❌ Blocking issues
(geen)

**Visual Precision Gate:** unverified — geen dev-server/screenshots-map beschikbaar in deze wave; geen entry voor `data-handelaar` in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (grep leeg = niet eerder visueel gereviewd).

### Score
3/3 toepasselijke criteria geslaagd (config-scope) · Aanbeveling: ship

---

## 📚 Didactiek review

**Mission:** data-handelaar (puzzle-lab)
**Curriculum-plek:** Leerjaar 1, Periode 3 "Digitaal Burgerschap" (`curriculum.ts:117`)
**SLO-claim:** `23A`, `23C` (regulier); `20A`, `20B` (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `23A` en `23C` zijn beide geldige regulier-privacy/digitaal-burgerschap-codes; `20A`/`20B` geldige VSO-codes — `slo-kerndoelen-mapping.ts:74`.
- **Criterium 2 (SLO-fit):** sterk geraakt — leerling analyseert drie concrete AVG-casussen (doelbinding, minderjarigen-profilering, rechten van betrokkenen) en formuleert zelf een conclusie. Precies het soort "beoordeel een datasituatie op privacy en toestemming"-vaardigheid dat `23A`/`23C` beogen.
- **Criterium 3 (Leerdoelen):** `missionGoals.ts:266` — "Ik beoordeel datasituaties op privacy, toestemming en eerlijk gebruik." Concreet, meetbaar, actiewerkwoord. Evidence-claim (`:271`, "per casus uitleggen welke data gevoelig is en waarom") wordt door puzzel 1+2 aantoonbaar gedekt.
- **Criterium 4 (Opdracht-beknoptheid):** intro binnen grenzen (zie Design review); puzzel-vragen zijn to-the-point ondanks het bewijsstuk-materiaal.
- **Criterium 7 (Bloom-balans):** goede mix — analyseren (puzzel 1: welke AVG-regel wordt geschonden, met 4 plausibele afleiders die elk een andere, foutieve AVG-route suggereren: beveiliging/versleuteling/privacyverklaring), analyseren+evalueren (puzzel 2: ernst-inschatting bij een minderjarige-casus), toepassen (puzzel 3: kennis van AVG-rechten toepassen op een concreet scenario), synthetiseren (puzzel 4: zelf een rapport-conclusie formuleren in eigen woorden). Geen pure quiz-recall.
- **AVG-inhoudelijke juistheid (missie-specifiek, thema privacy/datahandel):** alle drie de AVG-concepten kloppen juridisch — doelbindingsbeginsel (puzzel 1), verbod op profilering van minderjarigen voor marketing zonder ouderlijke toestemming (puzzel 2), recht op inzage/verwijdering + klachtrecht bij de Autoriteit Persoonsgegevens (puzzel 3). Geen feitelijke AVG-fouten aangetroffen.
- **Niet-normaliserend over datahandel (missie-specifiek check):** de content presenteert datahandel-zonder-toestemming consequent als overtreding/misstand ("overtreding", "schending", "illegale datahandel" in de agent-rol-briefing), niet als neutraal/acceptabel gedrag. De leerling-rol is "undercover onderzoeker die overtredingen blootlegt", niet "medewerker die leert hoe je data verkoopt" — het frame is aanklacht, niet instructie. Geen normalisering aangetroffen.
- **Criterium 9 (Welzijn/gevoelige content):** puzzel 2 bevat een realistisch-klinkend scenario van een 14-jarige met kwetsbare zoektermen ("ben ik te dik", "hoe word ik populair"). De agent-rol-`systemInstruction` bevat een expliciete gevoeligheidsinstructie (`year1.tsx:2486`): bij herkenning/persoonlijke impact → empathische reactie + doorverwijzing naar mentor/vertrouwenspersoon, scenario niet voortzetten. Dit is precies het welzijnsprotocol-patroon dat voor gevoelige thema's vereist is. VSO-mapping aanwezig.

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot) — niet verifieerbaar in deze review-scope**
  - **Wat:** de puzzle-lab-config zelf heeft geen chat-integratie; de `systemInstruction`/chat-flow in `year1.tsx:2484-2574` beschrijft een ander (chat-gebaseerd) content-model met 3 bewijsstukken en een losstaande scoringslogica (15 pt/overtreding, badges "AVG Agent"/"Privacy Speurder"), maar `templateRegistry.ts:27` zet `templateType: 'puzzle-lab'` — dus `PuzzleLab.tsx` rendert en de chat-`systemInstruction` is dormant (bekend platformbreed patroon, niet opnieuw als missie-specifiek issue).
  - **Waarom:** buiten scope van deze puzzle-lab-config-review; de dormante chat-content is zelf overigens didactisch en juridisch consistent met de actieve puzzle-lab-content (zelfde 3 AVG-thema's), dus geen inhoudelijke tegenstrijdigheid tussen de twee content-modellen — alleen een architectuurkwestie.
  - **Voorstel:** geen actie (bekend engine-patroon, geen inhoudelijk risico).

### ❌ Blocking issues
(geen)

### SLO-fit oordeel
- **23A/23C (Digitaal Burgerschap — privacy):** sterk geraakt over de volle breedte van de missie — doelbinding, bijzondere persoonsgegevens, minderjarigenbescherming, en betrokkenenrechten zijn alle vier kernonderdelen van een AVG-basisbegrip op onderbouw-VO-niveau. De vier puzzels vormen samen een compacte maar representatieve AVG-praktijktoets.

### Score
6/6 toepasselijke criteria geslaagd · Bloom-balans: medium-hoog · Aanbeveling: ship

---

## 🔧 Tech review

**Mission:** data-handelaar (puzzle-lab)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze wave-run, geen screenshots-map aanwezig.

### Static analyse

#### ✅ Geslaagd
- **Antwoordmodel-correctheid (puzzle-lab-verplicht, alle 4 puzzels zelf opgelost en nagerekend):**
  - **Puzzel 1 (bewijsstuk-a, multiple-choice):** casus = FitTrack-gezondheidsdata doorverkocht aan verzekeraar zonder specifieke toestemming. `answer: 'De data wordt gebruikt voor een ander doel dan waarvoor het verzameld is (schending van doelbinding)'` (`:40`) — inhoudelijk het meest primaire/correcte antwoord; de 3 afleiders (beveiliging, versleuteling, privacyverklaring) beschrijven allen een ándere, niet-toepasselijke AVG-tekortkoming die niet in de casus wordt genoemd. Geen ambigue tweede-goede-optie gevonden. ✓
  - **Puzzel 2 (bewijsstuk-b, multiple-choice):** casus = 14-jarige geprofileerd voor influencer-marketing op basis van kwetsbare zoektermen. `answer: 'Een minderjarige wordt geprofileerd voor marketingdoeleinden zonder toestemming van ouders'` (`:70`) — correct als "meest ernstige" overtreding (de vraag vraagt expliciet naar de ernstigste, niet naar "een" overtreding); de afleiders (ontbrekend telefoonnummer, schoolnaam-opslag, spelfouten) zijn evident triviaal vergeleken met minderjarigen-profilering. ✓
  - **Puzzel 3 (rechten-betrokkenen, multiple-choice):** casus = Liam wil actie ondernemen na ongeoorloofde doorverkoop van gezondheidsdata. `answer: 'Liam kan het bedrijf vragen zijn data in te zien en te verwijderen'` (`:100`) — correct: recht op inzage + verwijdering zijn directe AVG-rechten, geen voorwaarden (geen advocaat, geen bewezen schade) vereist. Afleiders beschrijven elk een feitelijk onjuiste AVG-claim. ✓
  - **Puzzel 4 (rapport-conclusie, text-input met custom validator):** validator vereist `hasCompany` ("datadeal") + `hasFout` (een van 7 synoniemen) + `hasGroup` (een van 6 synoniemen) + `length >= 30`. Getest met de eigen `extraClues`-voorbeeldzin ("DataDeal BV verkocht privégegevens van gebruikers stiekem door, waardoor kinderen zoals Emma benadeeld worden.") → **valid** ✓. Getest met 3 plausibele leerling-variaties (korter, andere woordkeuze, minimaal-maar-geldig) → alle **valid** ✓.
- **Puntensom vs maxScore:** 25+25+25+25 = **100**, `maxScore: 100` (`:16`) — exact gelijk, geen tekort/overschot.
- **Badge-thresholds bereikbaar en logisch oplopend:** getest met simulatie — perfecte score (100, geen hints) → "Hoofd Data-Inspecteur" (≥90) ✓; 3/4 puzzels correct zonder hints (75) → "Senior Undercover Agent" (≥70) ✓; 1 hint gebruikt bij perfecte speel (25-4=21+75=96) → nog steeds hoogste badge ✓; helft correct (50) → "Privacy Onderzoeker" (≥40) ✓; niets opgelost (0) → "Stagiair Inspectie" (≥0) ✓. Geen dode/onbereikbare badge-tier.
- **Criterium A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore` in de config; typed via `PuzzleLabConfig` import (`:1`). De `validator`-functie op puzzel 4 heeft een correct getypeerd `(input: string) => boolean`-signature conform `puzzleLabTypes.ts:19`.
- **Downstream-check:** geen van de 4 puzzels bouwt op een afgeleide waarde uit een andere puzzel (elk is zelfstandig, geen keten-breuk-risico zoals bij data-viewer-achtige templates).

#### ⚠️ Aandachtspunten
- **Minor validator-edge-case (puzzel 4, `rapport-conclusie`)** — `data-handelaar.ts:126`
  - **Wat:** `hasCompany = s.includes('datadeal')` matcht geen variant met spatie ("Data Deal BV"). Een leerling die de bedrijfsnaam met een spatie typt (plausibel, want het is een verzonnen bedrijfsnaam) krijgt een `false`-uitkomst ondanks een inhoudelijk correcte conclusie.
  - **Waarom:** laag risico — de content spelt de naam overal aan elkaar ("DataDeal BV", nooit "Data Deal"), dus leerlingen kopiëren waarschijnlijk de gangbare schrijfwijze uit de puzzel-teksten die ze net gelezen hebben. Bovendien geeft de engine bij een foute poging clues/hints en tot 8 pogingen (`maxAttempts: 8`, ruimer dan de andere puzzels), dus een enkele spatie-typo is met een tweede poging herstelbaar.
  - **Voorstel:** niet autoFixable als losstaande hoogprioriteit-fix — een validator-aanpassing raakt de scoring-logica van een tekst-invoer-antwoordmodel, en de kans dat dit daadwerkelijk leerlingen blokkeert is laag gezien de herhaalde exacte spelling in de bewijsstukken. Optioneel voor een latere polish-ronde: `s.includes('datadeal') || s.includes('data deal')`.

### ❌ Blocking issues
(geen)

### Dynamic verificatie (indien uitgevoerd)
N.v.t. — niet uitgevoerd deze wave (geen dev-server, geen screenshots-map).

### Score
Static: 4/4 toepasselijke criteria geslaagd (0 blocking, 1 klein aandachtspunt) · Dynamic: n.v.t. · Aanbeveling: ship

---

## Samenvatting & Voorstel-blokken

### Voorstel 1 — Validator mist spatie-variant bedrijfsnaam (klein, niet-blocking)
**Axis:** tech
**File:** `src/features/missions/templates/puzzle-lab/configs/data-handelaar.ts:126`
**Before:**
```ts
const hasCompany = s.includes('datadeal');
```
**After:**
```ts
const hasCompany = s.includes('datadeal') || s.includes('data deal');
```
**Downstream-check:** puur een uitbreiding van de match-conditie (OR), geen ander gedrag van de validator wijzigt; geen effect op puntensom, badges, of overige puzzels.

---

## Eindoordeel

Alle vier antwoordmodellen zijn zelf opgelost en kloppen inhoudelijk en juridisch (AVG-doelbinding, minderjarigenbescherming, betrokkenenrechten). Puntensom (100) = maxScore exact, badge-tiers logisch oplopend en bereikbaar. Thema (datahandel/privacy) wordt consistent niet-normaliserend behandeld — de leerling-rol is aanklager, niet uitvoerder van datahandel — en de welzijnsgevoelige casus (minderjarige met kwetsbare zoektermen) heeft een expliciete doorverwijsinstructie in de agent-rol. Geen blocking issues in beide reviews. Eén kleine, niet-blocking validator-edge-case gevonden. Missie is ship-ready.

**Triage:** design=9, didactiek=9, tech=8.5 → triageScore = (10-9)×0.3 + (10-9)×0.4 + (10-8.5)×0.3 = 0.30 + 0.40 + 0.45 = **1.15**
