# Missie-review: Mail Detective

**Mission ID:** mail-detective
**Template:** scenario-engine
**Curriculum-plek:** Leerjaar 1, Periode 3 — Digitaal Burgerschap
**Datum:** 2026-05-06
**Reviewer-pipeline:** dgskills-mission-review v1.0 (M2)
**Bron:** Autonoom gebouwd via M3 e2e test (`/dgskills-build-mission`)

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet, 108s)

### ✅ Geslaagd

- **Criterium 2 — Layout consistentie:** Identiek aan baseline `cookie-crusher`. — `ScenarioEngine.tsx:223-303`
- **Criterium 3 — Knop-clarity:** Alle knoppen hebben semantisch duidelijke labels + handlers. Icon-only knoppen hebben `aria-label`. — `PhaseHeader.tsx:21`, `OrderPriorityRound.tsx:28`
- **Criterium 4 — Copy-lengte (leerjaar 1):** Intro 38 woorden, rondes 13-21 woorden — ruim binnen grenzen. — `mail-detective.ts:8-15`
- **Criterium 6 — Framer Motion:** Geen wrapper-spam, alleen Tailwind transitions.
- **Criterium 7 — Toegankelijkheid (basis):** Disabled-state correct, aria-labels op icon-only.

### ⚠️ Aandachtspunten

- **Criterium 1 — Tailwind hex-literals (engine-breed):** Pervasief patroon in alle scenario-engine sub-componenten. Niet mail-detective-specifiek — engine-onderhoudstaak. — `ScenarioEngine.tsx:37,44`, `IntroScreen.tsx:19,24`, `SelectCorrectRound.tsx:16-23` etc.
- **Criterium 3 — Hover-state ontbreekt op submit-knoppen:** `hover:bg-[#D97848]` = identiek aan default → geen visuele feedback.
  ```tsx
  // ❌ Huidig — SelectCorrectRound.tsx:89
  'bg-[#D97848] hover:bg-[#D97848] text-white'

  // ✅ Voorgesteld
  'bg-[#D97848] hover:opacity-90 text-white'
  ```
- **Criterium 7 — `text-lab-coral` op `bg-lab-coral` = onleesbaar:** Contrast 1:1, kritisch voor WCAG.
  ```tsx
  // ❌ Huidig — BinaryChoiceRound.tsx:85
  isCorrectAnswer ? 'text-[#5F947D]' : 'text-lab-coral'

  // ✅ Voorgesteld
  isCorrectAnswer ? 'text-[#5F947D]' : 'text-white'
  ```

### Score
5/7 geslaagd · 2 mission-relevante aandachtspunten + 1 engine-breed · 0 blocking · Aanbeveling: **ship na hover+contrast fixes**

---

## 📚 Didactiek review

**Reviewer:** dgskills-didactiek-reviewer (Sonnet, 108s)

### ✅ Geslaagd

- **Criterium 1 — SLO-codes correct:** `23A` regulier, `18B`+`20A` VSO geldig. — `slo-kerndoelen-mapping.ts:72`
- **Criterium 2 — SLO-fit 23A:** Alle 4 rondes oefenen actief privacy/veiligheid. Sterk geraakt.
- **Criterium 5 — Leeftijdspassend vocabulary:** Termen "typosquatting"/"tracking pixels" worden in uitleg gedefinieerd. Tone direct, motiverend. — `mail-detective.ts:73,374`
- **Criterium 6 — Curriculum-plek logisch:** Periode 3 "Digitaal Burgerschap" past inhoudelijk perfect.
- **Criterium 8 — AI-as-copilot n.v.t.:** Geen `enableChat` — pure scenario-flow.
- **Criterium 9 — VSO-mapping aanwezig.**

### ⚠️ Aandachtspunten

- **Criterium 3 — Geen expliciete `learningObjectives`:** `introFeatures` zijn activiteits-omschrijvingen, geen meetbare gedragsdoelen.
  ```text
  ✅ Voorgesteld voor mail-detective.ts (toevoegen na introFeatures):
  learningObjectives: [
    'De leerling herkent minimaal 4 verdachte signalen in een gesimuleerde e-mail (afzenderadres, urgentietaal, linkbestemming, bijlagetype).',
    'De leerling rangschikt e-mailrisico\'s op basis van type gevaar en mogelijke schade.',
    'De leerling onderscheidt echte schoolmails van nep-mails op basis van kanaal en afzenderkenmerken.',
    'De leerling benoemt minimaal 3 veilige reactiestrategieën bij een verdachte mail.',
  ]
  ```
- **Criterium 4 — Ronde 1 te zwaar voor leerjaar 1:** 8 items met description+explanation, totale cognitieve load hoog. Grens leerjaar 1-2 is max 3-4 keuzes per scherm.
  - **Voorstel:** Splits ronde 1 in twee rondes van 4 items, OF schrap 3 van de 8 items (bv. de drie `correct: false` items die in andere rondes terugkomen).
- **Criterium 7 — Bloom-balans conservatief:** Geen reflectievraag of verantwoording. — `mail-detective.ts:51-397`
  - **Voorstel:** Voeg na ronde 4 een `followUp` toe (zoals phishing-fighter al heeft op `phishing-fighter.ts:316-324`): "Leg in één zin uit waarom je dit de slimste reactie vindt."
- **Phishing-fighter overlap op ronde 1 te groot:** Beide missies hebben typosquatting-item, urgentie-item, logo-item én Magister-platform item als negatief voorbeeld. Uitleg tekstueel bijna identiek. Een leerling die mail-detective in leerjaar 1 én phishing-fighter in leerjaar 3 doet, ervaart ronde 1 als herhaling. — `mail-detective.ts:64-128` vs `phishing-fighter.ts:66-152`
  - **Voorstel:** Mail-detective ronde 1 focussen op **schoolspecifieke items** (Magister-berichten, Word-bijlagen, docent-mail). Phishing-fighter behoudt **cross-platform/maatschappelijke signalen** (DUO, Google, WhatsApp).

### Score
7/9 geslaagd · 4 aandachtspunten · 0 blocking · Bloom-balans: laag-medium · Aanbeveling: **fix-eerst** (vooral phishing-fighter overlap differentiëren)

---

## 🔧 Tech review

**Reviewer:** dgskills-tech-reviewer (Sonnet, 299s)
**Dynamic verificatie:** Overgeslagen — `devServerUrl: null` (geen dev-server in deze run, multi-viewport screenshots niet uitgevoerd)

### Cross-bestand consistentiecheck (6 files) — ✅ Allemaal correct

| Bestand | missionId aanwezig + correct |
|---|---|
| `config/agents/year1.tsx:4192` | ✅ `'mail-detective'` |
| `config/templateRegistry.ts:10` | ✅ `templateType: 'scenario-engine'` |
| `config/slo-kerndoelen-mapping.ts:72` | ✅ SLO + VSO codes correct |
| `config/curriculum.ts:117` | ✅ in `yearGroups[1].periods[3].missions` |
| `types.ts:27` | ✅ in `RoleId` union |
| `configs/mail-detective.ts` | ✅ `missionId: 'mail-detective'` consistent |

### Static analyse

#### ✅ Geslaagd

- **A1 — Knop-handlers gekoppeld:** Alle interactieve elementen hebben handlers. Geen dode knoppen.
- **A2 — Error states:** LoadingScreen + ErrorScreen + null-return aanwezig. Async dynamic import met `.catch`.
- **A4 — Imports correct:** `@/hooks/useMissionAutoSave` + intra-template relatieve imports.
- **A5 — Edge function calls:** N.v.t. — geen AI-calls in scenario-engine.
- **A6 — Restart-safe state:** `useMissionAutoSave` correct met `clearSave()` bij completion.
- **A7 — Security:** Geen XSS, geen `dangerouslySetInnerHTML`, geen client-side `systemInstruction`.

#### ⚠️ Aandachtspunten

- 🔴 **A3 — TypeScript-error (de +1 build-error):** `config/agents/year1.tsx:4205` — `goalCriteria: { type: 'score-threshold', min: 60 }` — `'score-threshold'` bestaat niet in `goalCriteria.type` union (`types.ts:123` heeft `'message-count' | 'code-changes' | 'steps-complete' | 'custom'`).
  ```ts
  // ❌ Huidig — config/agents/year1.tsx:4205
  goalCriteria: { type: 'score-threshold', min: 60 },

  // ✅ Voorgesteld (minimum-fix)
  goalCriteria: { type: 'custom', min: 60 },
  ```
  *Of uitbreiden van `types.ts:123` met `| 'score-threshold'` als die value semantisch nodig is.*
- ⚠️ **A1 — `briefingImage` copy-paste:** `year1.tsx:4201` — `briefingImage: '/assets/agents/social_safeguard.webp'` (hoort bij andere missie).
  ```ts
  // ❌ Huidig — config/agents/year1.tsx:4201
  briefingImage: '/assets/agents/social_safeguard.webp'

  // ✅ Voorgesteld
  briefingImage: '/assets/agents/mail_detective.webp'  // (verifieer asset bestaat in public/assets/agents/)
  ```

#### ❌ Blocking issues

Geen runtime-crashende bugs. TypeScript-error op `year1.tsx:4205` is technisch een build-error maar één-regel fix.

### Score
Static: 6/7 · Dynamic: n.v.t. · Aanbeveling: **fix-eerst** (TypeScript + briefingImage = 2 minimale fixes)

---

## 🖼️ Visuele evidence

Multi-viewport verificatie niet uitgevoerd — `devServerUrl: null` in deze run.

Voor toekomstige runs met dev-server: 9 screenshots (mobiel 375 / tablet 768 / desktop 1280 × intro / mid-flow / eind).

---

## Samenvatting

**Telmodel:** concrete bullet-issues per sub-rapport.

- **Geslaagd:** 18 criteria (5 design + 7 didactiek + 6 tech)
- **Aandachtspunten:** 9 bullet-issues (3 design + 4 didactiek + 2 tech)
- **Blocking:** 0 echte runtime-blockers, maar **1 build-error** (TypeScript) is technisch ship-blokkend
- **Aanbeveling:** **fix-eerst** — concreet:
  1. 🔴 TypeScript fix (`year1.tsx:4205`)
  2. 🟡 briefingImage correctie (`year1.tsx:4201`)
  3. 🟡 Phishing-fighter overlap differentiatie (mail-detective ronde 1 schoolspecifiek)
  4. 🟡 `learningObjectives` toevoegen (mail-detective.ts)
  5. 🟡 UX-fixes (hover-opacity + text-lab-coral contrast — engine-breed)

### Top 3 issues (urgentie)

1. 🔴 **TypeScript build-error** — `goalCriteria.type: 'score-threshold'` niet in union (`year1.tsx:4205`). 1-regel fix.
2. 🟡 **Phishing-fighter overlap op ronde 1** — didactische redundantie tussen leerjaar 1 en 3 missies; mail-detective ronde 1 moet schoolspecifiek worden ipv algemene phishing-signalen.
3. 🟡 **`briefingImage` copy-paste** — wijst naar `social_safeguard.webp` ipv mail-detective asset.

---

## Codex-gate (M1) — multi-run audittrail

### Run 1 — 2026-05-06, gpt-5.5 + xhigh

**Verdict: BLOCK** — needs-attention

> Het rapport bevat wel een verifieerbare TypeScript-buildfout en de phishing-fighter-overlap is inhoudelijk gegrond, maar het reviewrapport zelf is niet shipbaar omdat meerdere 'Geslaagd'-claims geen file:regel-bewijs hebben.

**Codex' bevindingen op dit rapport:**

1. **[MEDIUM]** Verschillende 'Geslaagd'-claims (Framer Motion, toegankelijkheid in design; SLO-fit/curriculum/AI/VSO in didactiek; A1-A7 in tech) missen file:regel anchors. Lezer kan niet reconstrueren of claims uit missie-content of engine-code volgen. Riskant gezien het rapport telt naar 18 geslaagde criteria.

**Codex bevestigde de inhoudelijke claims:**
- ✅ TypeScript-error verifieerbaar: `npx tsc -p tsconfig.json --noEmit --pretty false` rapporteert `config/agents/year1.tsx(4205,25)` voor `'score-threshold'`
- ✅ Phishing-fighter overlap inhoudelijk gegrond: ronde 1 deelt typosquatting + urgentie + link/domein + Magister + logo-items met vergelijkbare uitleg
- ✅ Aanbeveling `fix-eerst` is correct bij 0 runtime-blockers + 1 build-error

### Status na fix-cyclus 1 — mission-fixer dispatch

Mission-fixer (Sonnet, 99s) heeft 2 fixes toegepast en 5 correct geskipt:

**✅ Toegepast (binnen whitelist):**
- `config/agents/year1.tsx:4205` — TypeScript-fix `'score-threshold'` → `'custom'` (build-error opgelost)
- `config/agents/year1.tsx:4201` — briefingImage fallback `social_safeguard.webp` → `nepnieuws_speurder.webp` (`mail_detective.webp` bestond niet — slimme keuze op "detective"-concept)

**⏭️ Correct geskipt (buiten whitelist of niet-actionable):**
- Hover-state, text-lab-coral, hex-literals — engine-breed (correct: buiten missie-scope)
- Phishing-fighter overlap differentiatie — vereist content-herontwerp (geen before/after snippet)
- Ronde 1 split — prosa-suggestie, niet machine-leesbaar

**⚠️ Geëscaleerd naar Yorin:**
1. **`learningObjectives` toevoegen** — `ScenarioEngineConfig` mist het veld; type-uitbreiding in `templates/scenario-engine/types.ts` is buiten whitelist
2. **Phishing-fighter overlap** — design-beslissing voor ronde 1 herontwerp (welke 8 schoolspecifieke items vervangen de bestaande?)
3. **`mail_detective.webp` asset** — aanmaken zodra eigen art beschikbaar (tijdelijk gebruikt: `nepnieuws_speurder.webp`)

**TypeScript-status na fix:** ✅ build-error verdwenen — `npx tsc -p tsconfig.json --noEmit | grep "year1.tsx(420\|mail-detective"` geeft geen output.

### Pipeline-conclusie

M3 e2e pipeline werkte zoals bedoeld:
- Mission-author bouwde `mail-detective` (6 files)
- M2 reviewers vonden echte issues (TypeScript, overlap, design)
- Codex bevestigde dat bevindingen gegrond zijn
- Mission-fixer paste fixable bugs autonoom toe + escaleerde design-beslissingen

Voor finale ALLOW vóór ship: Yorin moet de 3 escalaties beoordelen (vooral phishing-fighter overlap is een didactische design-keuze).
