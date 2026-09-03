# Rubric-review: Notificatie Ninja

**Datum:** 2026-08-25
**templateType:** scenario-engine
**Wave:** 23 (batch-review sweep)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review — score 7.5/10

### ✅ Geslaagd
- Consistente `duck-*` tokens, geen legacy `lab-*`-classes in de config.
- Copy-lengte per item is kort en leeftijdspassend (onderbouw VO), met heldere emoji-iconen als scanpunten.
- Vier rondes met oplopende opbouw (herkennen → rangschikken → beoordelen → toepassen) geven visuele/inhoudelijke variatie binnen hetzelfde template.
- Twee items (ronde 2 en 3, id 5 en 8) gebruiken een custom asset (`dgskills-duck-surprised.webp`) i.p.v. emoji — consistent met de merk-mascotte, geen probleem.

### ⚠️ Aandachtspunten
- **Geërfd van de engine (niet missie-specifiek, wel van toepassing):** het resultatenscherm heeft onder 40% geen enkele uitweg (geen onRetry, geen onBack) — zie Tech-sectie. Dit raakt ook notificatie-ninja.
- **Geërfd van de engine:** geen focusverplaatsing bij rondewisseling (`handleNextRound`) — toetsenbord-/schermlezergebruikers merken de nieuwe ronde niet op. Raakt alle vier rondes van deze missie.
- Ronde 2 (`order-priority`, 8 items) heeft geen visuele indicatie van "bijna goed" vs "ver mis" bij foutieve volgorde buiten de standaard feedback — geen missie-specifiek defect, wel een gemiste kans op leerwaarde, maar dit is engine-gedrag, geen configfout.

Geen missie-specifieke design-bevindingen die om een config-aanpassing vragen.

---

## 📚 Didactiek review — score 8.5/10

### ✅ Geslaagd
- **SLO-codes:** `23B` (mediawijsheid/kritisch mediagebruik) + `21B` (digitale technologie & maatschappij) passen goed bij het onderwerp dark patterns/aandachtseconomie. VSO-mapping `20A`/`18B` is coherent.
- **Leerdoelen** zijn concreet en meetbaar geformuleerd ("Ik herken minimaal 5...", "Ik kan uitleggen of...").
- **Bloom-balans:** ronde 1 (herkennen/onthouden), ronde 2 (analyseren/rangschikken), ronde 3 (evalueren), ronde 4 (toepassen/reflecteren) — mooie opbouw over de taxonomie.
- **Cognitieve load:** items zijn kort, één concept per kaart, uitleg pas na antwoord (geen vooraf-spoilen).
- **Welzijn:** de missie behandelt schermtijd/manipulatie zonder schuldgevoel op te leggen — ronde 4 framet concrete, haalbare stappen i.p.v. moraliseren, en item 6 ("apps volledig verwijderen") wordt terecht als niet-effectief afgekeurd in plaats van als wenselijk axioma.
- Feitelijke onderbouwing (verliesaversie, variabele beloning, wrijving/frictie) is correct en op niveau uitgelegd met tussenhaakjes-definities ("= dopamine is een stofje...") — passend bij onderbouw-vocabulaire.

### ⚠️ Aandachtspunten
- Ronde 3, item 7 (NL-Alert) plaatst een overheidsmelding naast commerciële voorbeelden als tegenvoorbeeld van "nuttig, geen verdienmodel" — didactisch functioneel, maar de vergelijking overheid vs. platform kan bij sommige leerlingen verwarrend overkomen omdat het schaalniveau (individueel vs. maatschappelijk) verschilt. Geen blocker, wel een kleine scherpte-opmerking.
- **Geërfd van de engine:** de `order-priority`-ronde (ronde 2, 8 items) heeft geen gokcorrectie in de scoreformule. Doorgerekend voor 8 items ligt het "niets lezen, gewoon top-naar-onder klikken"-resultaat waarschijnlijk lager dan bij 4-5 items (meer items = kleinere kans op toevalstreffers), maar het generieke risico dat er zonder lezen alsnog een substantieel deel van de 25 punten wordt gehaald blijft — dit is een engine-brede zwakte, geen missie-config-fout.

---

## 🔧 Tech review — score 6.5/10

### Static analyse

#### ✅ Geslaagd
- Config volgt het `ScenarioEngineConfig`-contract correct: `maxScore: 100` = som van 4×25 per ronde, badges consistent aflopend (80/60/40/0).
- `templateRegistry.ts`, `slo-kerndoelen-mapping.ts`, `curriculum.ts` (leerjaar 1, periode 2, week 2) en `missionGoals.ts` zijn onderling coherent: dezelfde missionId overal, criteria-type `rounds-complete` (geen `threshold`).
- Geen prompt-injection-oppervlak: dit is een pure keuze-/rangschik-missie zonder AI-interactie of vrije tekstinvoer, dus die dreigingscategorie is niet van toepassing.

#### ⚠️ Aandachtspunten (via gedeelde engine, wél concreet voor deze missie)
- **Blocking, geërfd:** het gedeelde `ScenarioEngine.tsx` geeft `CompletionScreen` geen `onRetry` mee en heeft geen navigatie-uitweg onder de 40%-drempel; `phase: 'results'` wordt opgeslagen zodat een leerling die onder de 40% van 100 punten (dus <40 punten) scoort, bij een herbezoek exact hetzelfde doodlopende scherm terugkrijgt. Dit is een engine-fix, geen config-fix voor notificatie-ninja — maar de missie is er wél door getroffen zolang de engine niet is aangepast.
- **Niet van toepassing:** de tweede blocking-bevinding uit de enginepas (40%-vs-drempel-mismatch, `handleComplete` tegen `criteria.threshold`) raakt notificatie-ninja NIET — deze missie gebruikt `criteria.type: 'rounds-complete'`, niet een numerieke `threshold`.
- **Warning, geërfd:** `scoreOrderPriority` (gebruikt door ronde 2, `order-priority`, 8 items) heeft geen gokcorrectie-baseline, in tegenstelling tot ronde 1 (`select-correct`) en ronde 3 (`binary-choice`) in dezelfde missie, die dat wél hebben. Binnen déze missie is dat een inconsistentie tussen rondes: 3 van de 4 scoreformules corrigeren voor gokken, 1 niet.
- **Warning, geërfd:** geen focusverplaatsing bij `handleNextRound` — alle 4 rondewisselingen in deze missie missen een aria-live-aankondiging of focus-move.
- **Info, geërfd:** contrastwaarden op gedeelde componenten (`text-duck-ink/50`, `text-duck-ink/60`, `bg-duck-error text-white`) worden hergebruikt in `SpotTheFlagsRound`/`InboxTriageRound`/`OrderPriorityRound` — notificatie-ninja gebruikt `select-correct`, `order-priority` en `binary-choice`, dus raakt mogelijk de `OrderPriorityRound`-contrastwaarden (regel 140/150) in ronde 2.

### Dynamic verificatie
Niet uitgevoerd binnen deze pass (geen dev-server-sessie beschikbaar in deze review-run); alle bevindingen zijn static/config-based.

---

## Voorstellen

Geen van de bevindingen is auto-fixable binnen de whitelist voor deze missie: de blocking- en warning-items zitten allemaal in de gedeelde `scenario-engine`-motor (`ScenarioEngine.tsx`, `sub/*.tsx`), niet in `notificatie-ninja.ts`, `templateRegistry.ts`, de agent-rol, `slo-kerndoelen-mapping.ts`, `curriculum.ts` of `missionGoals.ts`. De config van notificatie-ninja zelf bevat geen mechanische fouten die een voor/na-snippet rechtvaardigen.

De enige technisch mogelijke config-only ingreep zou zijn om de gokcorrectie-zwakte van ronde 2 te compenseren door het type te wijzigen — maar dat is een ontwerpbeslissing over de scoreformule van de gedeelde engine, geen mechanische fix, en dus terecht een escalatie in plaats van een auto-fix.

---

## Samenvatting & verdict

De missie-config van notificatie-ninja is inhoudelijk sterk: heldere SLO-koppeling, goede Bloom-opbouw, feitelijk correcte en leeftijdspassende uitleg over dark patterns, en een didactisch verantwoorde ronde 4 die concrete, effectieve gedragsveranderingen beloont boven onrealistische "cold turkey"-aanpakken. Er zijn geen missie-eigen technische of didactische fouten gevonden.

De twee zwaarwegende problemen (doodlopend resultatenscherm onder 40%, ontbrekende gokcorrectie in de rangschik-scoreformule, ontbrekend focusbeheer) zitten allemaal in de gedeelde `scenario-engine`-motor en treffen alle 12 scenario-missies gelijk, niet uniek notificatie-ninja. De tweede engine-bevinding (40%-drempel-mismatch bij `handleComplete`) is expliciet NIET van toepassing, omdat deze missie op `rounds-complete` draait in plaats van een numerieke drempel.

**Verdict: fix-eerst** — niet vanwege een fout in deze missie-config, maar omdat de missie via de gedeelde engine wél is blootgesteld aan het blocking dead-end-scenario onder 40%. Zodra de engine-fix (onRetry/uitweg op het resultatenscherm) landt, is deze missie zonder verdere wijziging klaar voor leerlingen.
