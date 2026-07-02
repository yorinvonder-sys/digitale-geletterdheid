# Missie-review: startup-pitch

**Datum:** 2026-07-02
**Wave:** 14 (verse review)
**Type:** `tool-guide`
**Config:** `src/features/missions/templates/tool-guide/configs/startup-pitch.ts`
**Engine:** `src/features/missions/templates/tool-guide/ToolGuide.tsx` (gedeeld — engine-issues niet meegenomen)
**Agent-rol:** `src/config/agents/year1.tsx:3384-3535` (incl. 3 geneste bonus-challenges)
**SLO-entry:** `src/config/slo-kerndoelen-mapping.ts:183` — `22A, 21D, 23C`, `yearGroup: 3`, week 3
**Curriculum-plek:** `src/config/curriculum.ts` — leerjaar 3, periode 3 ("Maatschappelijke Impact & Innovatie")
**missionGoals:** `src/config/missionGoals.ts:372-380` — `steps-complete`, min 4

## Samenvatting

Solide, inhoudelijk goed onderbouwde "vrije opdracht"-missie die 4 domeinen combineert (probleemanalyse, AI-oplossing, branding, ethiek). Twee concrete, missie-specifieke fouten gevonden: (1) een **data-inconsistentie tussen agent-rol en curriculum/SLO** over het leerjaar van deze missie, en (2) een **onbereikbaar `maxScore`** in de tool-guide config (scoreplafond-check volgens instructie). Geen blocking security- of UX-issues in de config zelf.

---

## 🎨 Design review

**Mission:** startup-pitch (tool-guide)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (tokens)**: config bevat geen eigen Tailwind-classes (pure content-config); `visualPreview` in de agent-rol (`year1.tsx:3397`) gebruikt `lab-coral`/`lab-teal` — geldige legacy-aliassen, geen hex-literals.
- **Criterium 3 (knop-clarity)**: engine-breed (ToolGuide.tsx) — geen missie-specifieke knoppen in de config.
- **Criterium 6 (Framer Motion)**: n.v.t. — geen animaties gedefinieerd in config.
- **Criterium 7 (a11y)**: engine-breed, geen missie-specifieke afwijking.

### ⚠️ Aandachtspunten
- **Criterium 4 (copy-lengte)**: `startup-pitch.ts:83` — stap-4 instructie (~90 woorden) en `startup-pitch.ts:23` — stap-1 instructie (~75 woorden) liggen tegen/net over de leerjaar-3-grens (opdracht <80 woorden).
  - **Wat:** beide instructies bevatten een korte opsomming (2-3 sub-vragen) plus een concreet vaag/concreet-voorbeeld-paar.
  - **Waarom:** voor leerjaar 3 (13-14 jaar) is dit acceptabel omdat de opsomming de leesbaarheid juist ondersteunt (chunking) — geen aaneengesloten alinea.
  - **Voorstel:** geen wijziging nodig; de opsomming-structuur compenseert de woordlengte. Alleen bij een toekomstige copy-pass overwegen om het vaag/concreet-voorbeeld in stap 1 (regel 23, laatste zin) te verkorten.

### ❌ Blocking issues
- Geen.

### Score
9/10 criteria geslaagd (1 warn, geen fail) · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Mission:** startup-pitch (tool-guide)
**Curriculum-plek:** Leerjaar 3, Periode 3 (`curriculum.ts`)
**SLO-claim:** `22A` (Digitale producten), `21D` (AI), `23C` (Maatschappij)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `22A`, `21D`, `23C` zijn alle drie geldige regulier-VO-codes (`slo-kerndoelen-mapping.ts:183`).
- **Criterium 2 (SLO-fit)**: sterk geraakt — stap 2 (AI-oplossing bedenken) raakt `21D`, stap 1+3 (probleem + branding als digitaal product) raken `22A`, stap 4 (privacy/eerlijkheid) raakt `23C`. Alle drie kerndoelen hebben substantiële, niet-oppervlakkige activiteit.
- **Criterium 3 (leerdoelen)**: `startup-pitch.ts:126-132` (`takeaways`) gebruikt overwegend meetbare actiewerkwoorden ("identificeren", "beschrijft", "ontwerpen", "nadenken over") — functioneert als impliciete leerdoelen, acceptabel voor tool-guide templateType.
- **Criterium 5 (leeftijds-passend)**: vocabulaire past bij leerjaar 3 (bv. uitleg van "branding" en "visuele identiteit" met inline definitie op `startup-pitch.ts:71`); concrete voorbeelden (Duolingo, Spotify, Dropbox) zijn herkenbaar.
- **Criterium 7 (Bloom-balans)**: goede mix — stap 1-2 zijn toepassen/analyseren (probleem concretiseren), stap 3 is creëren (ontwerp), stap 4 is evalueren (risico-inschatting + oplossing bedenken). Geen pure onthouden-vragen.
- **Criterium 9 (welzijn/inclusiviteit)**: geen gevoelige-onderwerp-risico's; taal is neutraal, geen gender-aannames.

### ⚠️ Aandachtspunten
- **Criterium 3 (leerdoelen, lichte kanttekening)**: geen apart `learningObjectives`-veld — alleen `takeaways` (die pas ná afronding getoond worden). Voor tool-guide-templateType is dit consistent met andere missies van hetzelfde type — geen missie-specifieke afwijking.

### ❌ Blocking issues
- **Criterium 6 (curriculum-plek logisch) — MISMATCH tussen agent-rol en curriculum/SLO-bron.**
  - **Wat:** `src/config/agents/year1.tsx:3385` definieert `yearGroup: 1` op de agent-rol zelf. Maar `src/config/slo-kerndoelen-mapping.ts:183` (AUTORITAIR) zegt `yearGroup: 3`, en `src/config/curriculum.ts` plaatst `'startup-pitch'` in de missions-lijst van leerjaar 3 / periode 3 ("Maatschappelijke Impact & Innovatie", naast `startup-simulator`, `policy-maker`, `innovation-lab`).
  - **Waarom:** `src/features/missions/CLAUDE.md` noemt expliciet als invariant: *"Every mission must have coherent identity across config/agents.tsx, config/slo-kerndoelen-mapping.ts, learner visibility"*. De zichtbare leerjaar-badge op de missie-intro (`missionMeta.ts:35`, `leerjaar: slo?.yearGroup`) leest gelukkig uit de SLO-mapping (dus toont correct "J3"), maar `role.yearGroup` wordt elders wél geraadpleegd voor filtering/coverage (bv. `SLOCoverageIndicator.tsx` en `AdaptiveMissionSuggestions.tsx` — beide lezen echter ook uit `KERNDOEL_MISSIONS`, dus het praktisch risico is beperkt tot toekomstige code die per ongeluk `role.yearGroup` als bron kiest, en tot data-integriteit/onderhoudbaarheid).
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — src/config/agents/year1.tsx:3385
        id: 'startup-pitch',
        yearGroup: 1,

    // ✅ Voorgesteld
        id: 'startup-pitch',
        yearGroup: 3,
    ```
    Dit is een 1-regel fix die de agent-rol in lijn brengt met de autoritaire SLO-mapping en curriculum-plaatsing. Geen bestandsverplaatsing nodig (bevestigd: `yearN.tsx`-bestandsnaam is géén garantie dat alle geneste rollen leerjaar N zijn — dit bestand bevat al andere `yearGroup: 1`-rollen naast deze uitzondering).

### SLO-fit oordeel
- **22A**: sterk geraakt — stap 1 (probleemdefinitie) + stap 3 (branding/visuele identiteit) zijn beide digitale-product-ontwerp-activiteiten.
- **21D**: sterk geraakt — stap 2 vraagt expliciet een AI-oplossing te bedenken en te beschrijven.
- **23C**: sterk geraakt — stap 4 (privacy + eerlijkheid van een AI-product) is een directe maatschappij-reflectie.

### Score
6/7 toepasselijke criteria geslaagd (1 blocking) · Bloom-balans: **medium-hoog, goed passend** · Aanbeveling: **fix-eerst** (1-regel data-fix, geen herontwerp)

---

## 🔧 Tech review

**Mission:** startup-pitch (tool-guide)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen screenshots-map aanwezig voor deze missie en geen dev-server gestart in deze reviewronde (config-only static review conform scope)

### Static analyse

#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline)**: geen `any`, geen `@ts-ignore` in de config; `ToolGuideConfig`-type wordt correct toegepast.
- **Criterium A4 (imports)**: `startup-pitch.ts:1` gebruikt relatieve import `'../ToolGuide'` — dit is het gangbare patroon binnen de `tool-guide/configs/`-map zelf (config → eigen engine, één niveau omhoog), consistent met zustermissies van hetzelfde templateType. Geen afwijking.
- **Criterium A6 (restart-safe state)**: engine-breed via `useMissionAutoSave` (`ToolGuide.tsx:450`) — geen missie-specifieke afwijking.
- **Criterium A7 (security)**: geen `dangerouslySetInnerHTML`; engine rendert `**bold**`-markup via een veilige split-naar-React-text-nodes renderer (`ToolGuide.tsx:97-110`), geen HTML-injectie mogelijk vanuit de config-strings.

#### ⚠️ Aandachtspunten
- **Scoreplafond-verificatie (tool-guide-verplicht)**: `startup-pitch.ts:105` — `maxScore: 60` is **onbereikbaar**.
  - **Wat:** 4 steps × `CHECKLIST_POINTS_PER_STEP` (10, `ToolGuide.tsx:76`) = 40 punten via checklist. Slechts 3 van de 4 steps hebben een `verificationQuestion` (stap-1 regel 30, stap-2 regel 54, stap-4 regel 91 — **stap-3 "Logo en slogan" mist er een**, regel 67-78) × `QUESTION_BONUS` (5, `ToolGuide.tsx:77`) = 15 punten via bonusvragen. Werkelijk maximaal haalbaar: 40 + 15 = **55**, niet 60.
  - **Risico:** de voortgangsbalk/scoreweergave in de engine toont het percentage relatief aan `config.maxScore` — een leerling die alle 4 checklists volledig afvinkt én alle 3 bestaande vragen correct beantwoordt, ziet nooit 100%/60 punten, ongeacht prestatie. Dit is verwarrend/demotiverend ("waarom kom ik nooit op het maximum uit?").
  - **Wel goed nieuws:** de topbadge-drempel (`minScore: 55`, regel 108, 🏆 "AI Entrepreneur") is exact gelijk aan het werkelijke plafond (55) — de topbadge blijft dus haalbaar. Alleen `maxScore` zelf is fout.
  - **Voorstel:**
    ```ts
    // ❌ Huidig — src/features/missions/templates/tool-guide/configs/startup-pitch.ts:105
        maxScore: 60,

    // ✅ Voorgesteld
        maxScore: 55,
    ```
    1-regel fix; badge-drempels (55/40/0) hoeven niet te wijzigen — 55 blijft zowel het plafond als de topbadge-eis.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie (niet uitgevoerd)
- Geen screenshots-map voor `startup-pitch` aangetroffen; niet gegrept als losse entry in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` behalve de generieke KEES-mascotte-shared-shell-vermelding (regel 62: "Missies o.a.: ... startup-pitch ... shared-shell over ... tool-guide") — dat is het reeds bekende, engine-brede shared-shell issue (KEES-avatar top-crop op mobiel), niet missie-specifiek voor startup-pitch.

### Score
Static: 4/5 toepasselijke criteria geslaagd (1 aandachtspunt, geen blocking) · Dynamic: n.v.t. (geen screenshots) · Aanbeveling: **fix-eerst** (1-regel data-fix)

---

## Voorstel-blokken (samengevat voor fixer-agent)

### 1. Curriculum-mismatch fix
```tsx
// src/config/agents/year1.tsx:3385
// ❌ Huidig
        yearGroup: 1,
// ✅ Voorgesteld (binnen startup-pitch role-object, regel 3384-3385)
        yearGroup: 3,
```

### 2. maxScore-fix
```ts
// src/features/missions/templates/tool-guide/configs/startup-pitch.ts:105
// ❌ Huidig
    maxScore: 60,
// ✅ Voorgesteld
    maxScore: 55,
```

---

## Triage

| Rubric | Kwaliteitsscore (0-10, 10=uitstekend) | Weging | Bijdrage |
|---|---|---|---|
| Design | 8.5 | 0.3 | (10-8.5)×0.3 = 0.45 |
| Didactiek | 6.5 | 0.4 | (10-6.5)×0.4 = 1.40 |
| Techniek | 7.0 | 0.3 | (10-7.0)×0.3 = 0.90 |

**triageScore = 2.75**

**Eindaanbeveling:** fix-eerst — twee kleine, geïsoleerde 1-regel data-fixes (geen herontwerp, geen multi-file refactor). Geen blocking security- of UX-issues.
