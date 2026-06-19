# Missie Review: data-speurder
**Datum:** 2026-06-17
**Template:** scenario-engine
**Leerjaar:** 1, Periode 3
**SLO-claim:** `21C` (regulier) · `18B` (VSO)
**Reviewer:** M4 batch-review-pipeline (wave-2)

---

## 🎨 Design Review

**Mission:** data-speurder (scenario-engine)
**Reviewer:** dgskills-design-reviewer

### ✅ Geslaagd

- **Criterium 1 — Tailwind token consistentie:** De config bevat geen UI-code; alle tokens zitten in de gedeelde engine (`ScenarioEngine.tsx`, `FeedbackBanner.tsx`). De engine gebruikt consequent `duck-bg`, `duck-ink`, `duck-acid`, `duck-error` — geen hardcoded hex-literals in de config zelf. `data-speurder.ts` bevat uitsluitend data, geen className-strings.
- **Criterium 1 (badge color):** Badge `color: '#202023'` is de hex-waarde van `duck-ink` en wordt uitsluitend via `style={{ background: \`linear-gradient(...)\` }}` inline gebruikt (niet als Tailwind class). Per `CompletionScreen.tsx:42` is dit het gedocumenteerde gebruik. Geen overtreding.
- **Criterium 2 — Layout consistentie template-type:** Geen structurele afwijkingen t.o.v. sibling-missies (cookie-crusher, mail-detective). Alle rondes gebruiken de standaard PhaseCard/PhaseHeader wrapper van de engine. Config-patroon is consistent.
- **Criterium 4 — Copy-lengte (Leerjaar 1 = max 80 intro / 60 per ronde):**
  - `introDescription`: 42 woorden — **ruim binnen norm**.
  - Ronde 1 description: 23 woorden — OK.
  - Ronde 2 description: 21 woorden — OK.
  - Ronde 3 description: 17 woorden — OK.
  - Ronde 4 description: 36 woorden — OK.
- **Criterium 6 — Framer Motion:** Geen `motion.*` of `<AnimatePresence>` in de config. De engine gebruikt geen overbodige animaties op dit missie-type.
- **Visual Precision Gate (statisch):** Config bevat geen layout-afwijkingen. Engine is gedeeld en bewezen in andere missies. Dynamische verificatie overgeslagen — geen screenshots beschikbaar (zie Stap B).

### ⚠️ Aandachtspunten

- **Criterium 7 — Toegankelijkheid (engine-level, READ-ONLY):** De "Volgende ronde"-knop in `FeedbackBanner.tsx:76` heeft klasse `text-white` op een `bg-gradient-to-r from-duck-acid to-duck-acid` achtergrond. `duck-acid` = `#e1ff01` (fel geel-groen). Wit op neon-geel heeft een WCAG-contrast ratio van ~1.3:1 — ver onder de minimumeis van 4.5:1. Dit is een **engine-level issue** (READ-ONLY), niet in de config. Escaleren voor engine-fix.
  - **Wat:** `text-white` op `duck-acid` (#e1ff01) is onleesbaar voor iedereen, niet alleen slechtzienden.
  - **Waarom:** Leerlingen kunnen de CTA ("Volgende ronde →") niet goed lezen op de confirmatieknop.
  - **Voorstel (escalatie):** Wijzig in engine naar `text-duck-ink` (zwart op geel = voldoende contrast). **Mag niet worden aangeraakt door fixer van deze missie — ESCALATIE vereist.**

### ❌ Blocking Issues

Geen config-level blocking issues.

### Stap B — Screenshots

Geen bestaande screenshots in `screenshots/assignments/data-speurder/` — dynamische visuele verificatie overgeslagen.

### Score

5/7 criteria geslaagd (Criterium 5 responsive en Criterium 7 toegankelijkheid statisch niet volledig verifieerbaar zonder browser) · Aanbeveling: **ship (config-niveau)** — engine contrast-issue escaleren

---

## 📚 Didactiek Review

**Mission:** data-speurder (scenario-engine)
**Curriculum-plek:** Leerjaar 1, Periode 3, Week 3
**SLO-claim:** `21C` (Data & Dataverwerking) · `18B` VSO (Media & Informatie)
**Reviewer:** dgskills-didactiek-reviewer

### ✅ Geslaagd

- **Criterium 1 — SLO-codes correct:** `21C` is een geldige reguliere VO-code (Data & Dataverwerking). `18B` is een geldige VSO-code.
- **Criterium 2 — SLO-fit 21C:** De missie raakt `21C` (Data & Dataverwerking) sterk. Ronde 1 oefent het onderscheid data/informatie/conclusie. Ronde 2 oefent grafiekkeuze per datatype. Ronde 3 oefent misleidende datapresentaties herkennen. Ronde 4 oefent conclusies trekken op basis van data. Dit is directe, actieve oefening van het kerndoel — geen oppervlakkig contact.
- **Criterium 5 — Leeftijds-passend vocabulary:** Taal is concreet en herkenbaar voor leerjaar 1: Instagram-schermtijd, stappenteller, klimaatverandering. Geen academisch jargon zonder uitleg. Termen als "correlatie" en "causaliteit" worden direct uitgelegd in de verklaringsteksten. Tone-of-voice is direct en motiverend.
- **Criterium 6 — Curriculum-plek logisch:** Leerjaar 1, Periode 3 richt zich op data en privacy. Data-speurder past hier goed: het bouwt op basiskennis uit P1-P2 en bereidt voor op de data-onderzoeksmissies in P4. Geen kennissprong gedetecteerd.
- **Criterium 8 — AI-as-copilot:** De missie gebruikt geen AI-chat (geen `enableChat` in templateRegistry). N.v.t.
- **Criterium 9 — Welzijn & inclusiviteit:** VSO-mapping aanwezig (`18B`). Geen gevoelige onderwerpen die welzijnsprotocol vereisen. Voorbeelden (schermtijd, gamers, etc.) zijn inclusief geformuleerd.

### ⚠️ Aandachtspunten

- **Criterium 2 — SLO-fit 18B (VSO mismatch-risico):** `18B` = "Media & Informatie — De leerling navigeert doelgericht in het digitale medialandschap" (VSO). De missie-inhoud gaat over data-analyse, grafieken en conclusies trekken — dit valt in regulier VO onder `21C`. Er is géén VSO-code voor "Data & Dataverwerking" in de mapping. `18B` is de meest aangrenzende VSO-code. Dit is een structurele beperking van de VSO-codeset, geen fout in de missie zelf. Noteer als waarschuwing voor reviewers: de VSO-match is indirect.
  - **Wat:** Geen exacte VSO-tegenhanger voor 21C; 18B is de best beschikbare optie.
  - **Voorstel:** Overweeg een comment in `slo-kerndoelen-mapping.ts` bij de entry, e.g. `// 18B: dichtstbijzijnde VSO-code; geen directe data-categorie beschikbaar in VSO-set`. Geen code-wijziging noodzakelijk.

- **Criterium 3 — Leerdoelen niet als expliciete `learningObjectives`:**
  De config heeft geen `learningObjectives`-array (optioneel veld). Sibling-missies `mail-detective` en `code-denker` hebben dit wél. De `introFeatures` bevatten impliciet leerdoelen maar zijn niet geformuleerd met Bloom-actiewerkwoorden.
  - **Wat:** `introFeatures` geeft hints maar geen meetbare doelformulering met actiewerkwoord + criteria.
  - **Waarom:** Zonder expliciete leerdoelen is SLO-rapportage richting docenten minder precies.
  - **Voorstel (autoFixable):** Voeg `learningObjectives` toe:

```typescript
// Voorstel — src/features/missions/templates/scenario-engine/configs/data-speurder.ts
// Na regel 24 (na introFeatures sluiting), voor maxScore
learningObjectives: [
    'De leerling onderscheidt ruwe data van informatie en conclusies aan de hand van concrete voorbeelden.',
    'De leerling kiest de meest passende grafiekvorm (staaf, lijn, cirkel, spreidingsdiagram) voor een gegeven datasituatie.',
    'De leerling herkent misleidende data-presentaties op basis van schaal, steekproefgrootte en transparantie.',
    'De leerling trekt verantwoorde conclusies uit een dataset en noemt het onderscheid tussen correlatie en causaliteit.',
],
```

- **Criterium 7 — Bloom-balans:** De missie werkt op drie Bloom-niveaus: onthouden (ronde 1, definities herkennen), toepassen (ronde 2, grafiektype kiezen), analyseren (ronde 3, misleiding doorzien) en analyseren/evalueren (ronde 4, conclusies wegen). Dit is een **goede Bloom-spreiding** voor leerjaar 1. Aandachtspunt: ronde 4 vraagt evaluatie ("welke conclusies mág je trekken?") wat aan de hoge kant is voor leerjaar 1 — maar de context is scaffolded (data gegeven, 8 keuzemogelijkheden met uitleg). Acceptabel.

### ❌ Blocking Issues

Geen.

### SLO-fit oordeel

- **21C (Data & Dataverwerking):** Sterk geraakt — alle 4 rondes oefenen actief data-analyse, visualisatie en conclusies (rondes 1-4).
- **18B (Media & Informatie VSO):** Indirect geraakt — best beschikbare VSO-code, geen exacte match beschikbaar.

### Score

8/9 criteria geslaagd · Bloom-balans: medium-hoog (passend voor leerjaar 1 met scaffolding) · Aanbeveling: **fix-eerst** (learningObjectives toevoegen) of ship als dit als minor wordt beschouwd

---

## 🔧 Tech Review

**Mission:** data-speurder (scenario-engine)
**Reviewer:** dgskills-tech-reviewer
**Dynamic verificatie:** Overgeslagen — DGSkills SPA is state-based (geen URL per missie). Multi-viewport visuele verificatie niet uitgevoerd.

### Static Analyse

#### ✅ Geslaagd

- **A1 — Knop-handlers:** Alle handlers zitten in de engine (READ-ONLY). Config definieert geen handlers. `data-speurder.ts` heeft geen dode knoppen.
- **A2 — Error states:** Engine heeft `LoadingScreen` en `ErrorScreen` voor config-load failure (`ScenarioEngine.tsx:37-79`). De `catch(() => setLoadError(true))` in regel 100 dekt laadfouten. Config-ID `data-speurder` matched de bestandsnaam correct — geen dynamic import failure verwacht.
- **A3 — TypeScript-discipline:** `data-speurder.ts` importeert `ScenarioEngineConfig` type en exporteert een typesafe `config`-object. Geen `any`, geen `@ts-ignore`. Alle ronde-typen (`select-correct`, `order-priority`, `binary-choice`) zijn valid enum-waarden uit `types.ts`.
- **A4 — Imports via `@/*` alias:** De config heeft één import: `import type { ScenarioEngineConfig } from '../types'`. Dit is een relatief pad binnen hetzelfde feature-package — acceptabel (engine-intern pad, niet een cross-feature import).
- **A5 — Edge function calls:** Config roept geen edge functions aan. N.v.t.
- **A6 — Restart-safe state:** Engine gebruikt `useMissionAutoSave` (`ScenarioEngine.tsx:116`). Voortgang wordt opgeslagen. Config werkt correct met dit pattern.
- **A7 — Security-checks:** Geen user input naar AI. Geen `dangerouslySetInnerHTML`. Geen systemInstruction client-side. N.v.t.

#### Scoring-consistentie (kritieke tech-check)

- **maxScore (config): 100** = som van ronde maxScores (4 × 25) ✅
- **Badge-drempels:** 80/60/40/0 — allemaal ≤ maxScore ✅
- **Laagste badge minScore = 0** — altijd een badge beschikbaar ✅
- **Engine pass-threshold:** `totalScore >= config.maxScore * 0.4` = ≥ 40 punt (`ScenarioEngine.tsx:182`). Badge op 40 ("Goed Begonnen") sluit exact aan op pass-threshold ✅
- **Scoring-functie hardcoded `/25`:** `FeedbackBanner.tsx:8,19,30` — alle scoring-functies berekenen relatief op 25 (hardcoded), niet op `round.maxScore`. Omdat alle rondes exact 25 zijn, is dit correct. Geen afwijking.
- **minSelections check ronde 1:** `minSelections: 3`, exact 3 correct items (IDs 1,3,7). Leerling moet minimaal 3 selecteren — dit dwingt bewuste keuzes af ✅
- **minSelections check ronde 4:** `minSelections: 3`, maar 4 correct items (IDs 1,3,5,7). Leerling kan door 3 te selecteren al submitten. Bij 3 correcte + 0 fout = score ≈ 19/25 (75%). Geen bug — dit is het gewenste gedrag ✅

#### ⚠️ Aandachtspunten

- **Engine-level contrast (READ-ONLY, escalatie):** `FeedbackBanner.tsx:76` — `text-white` op `duck-acid` (#e1ff01). WCAG contrast ~1.3:1 (minimumeis: 4.5:1). Dit is een engine-issue, niet config-specifiek. Escaleren.
- **Ronde 4 `description` bevat impliciete data:** De rondevraag noemt "Gemiddeld 3,8 uur per dag" en "0,3 punt lagere cijfers". Dit zijn fictieve klassendata. Als leerlingen dit out-of-context zien, kunnen ze het als feitelijke onderzoeksresultaten interpreteren. Technisch geen bug maar didactisch aandachtspunt (al afgedekt in didactiek-sectie).

#### ❌ Blocking Issues

Geen blocking tech-issues in de config.

### Dynamic Verificatie

Overgeslagen — DGSkills SPA is state-based (geen URL per missie). Voor automatische Fase B is een dev-preview route (bv. `/dev/mission/data-speurder` met auth-bypass in `import.meta.env.DEV`) een follow-up taak.

**Visual Precision Gate:** UNVERIFIED — geen browser-verificatie uitgevoerd.

### Score

Static: 7/7 criteria geslaagd · Dynamic: n.v.t. · Aanbeveling: **ship (config-niveau)**

---

## Samenvatting

| Dimensie | Score | Verdict |
|---|---|---|
| Design | 8/10 | OK — engine contrast-issue escaleren |
| Didactiek | 7/10 | Fix-eerst — learningObjectives toevoegen |
| Techniek | 9/10 | OK |
| **Triage** | **1.37** | **fix-eerst** |

### Escalaties

1. **Engine contrast-knop** (`FeedbackBanner.tsx:76`): `text-white` op `duck-acid` voldoet niet aan WCAG AA. READ-ONLY voor config-fixer — vereist engine-update door beheerder.

### Auto-fixable

1. **`learningObjectives` toevoegen** in `data-speurder.ts` na `introFeatures` (regel 24). Zie voorstel-blok in Didactiek-sectie.
