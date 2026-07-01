# Missie-review: Word Wizard

**Mission ID:** word-wizard
**Template:** tool-guide
**Curriculum-plek:** Leerjaar 1, Periode 1
**Datum:** 2026-07-02
**Reviewer-pipeline:** dgskills-mission-review v1.0 (wave 11, verse review — vervangt `word-wizard-2026-06-14.md`)

---

## Voortgang t.o.v. vorige review (2026-06-14)

De vorige review gaf **BLOCKED** met 1 unieke blocking-issue (engine-breed, `duck-coral/muted/line/creamDeep`-tokens) en 3 top-issues. Status nu:

| Issue (2026-06-14) | Status 2026-07-02 |
|---|---|
| Engine `duck-coral/muted/line/creamDeep` bestaan niet | ✅ **Opgelost** — engine gebruikt nu alleen `duck-bg/bgLight/ink/acid/gray`, alle 5 bestaan in `tailwind.shared.js:8-15` |
| `maxScore: 60` vs engine-max 55 | ✅ **Opgelost** — `maxScore: 55` (`word-wizard.ts:105`), exact gelijk aan engine-berekening |
| "Klik" i.p.v. "Tik" in stap 3 | ✅ **Opgelost** — alle stappen gebruiken nu consequent "Tik" |
| "Penseel-icoon" onbetrouwbaar (stap 2) | ✅ **Opgelost** — nu "**A-knop** rechtsboven (Opmaak)" |
| M365-licentievereiste niet vermeld | ✅ **Opgelost** — nu expliciet in stap 1: "Je hebt een **Microsoft 365-licentie**... nodig" |
| Geen `learningObjectives` | ✅ **Opgelost** — 4 items toegevoegd, vrijwel letterlijk het vorige voorstel |
| Copy-lengte stap 3/4 boven 60w | ⚠️ **Nog open** — stap 3 nu 72w (was ~63w), stap 4 64w |
| SLO 22A-fit oppervlakkig | ⚠️ **Nog open** — geen productcontext toegevoegd |
| Bloom-balans 1-2 only | ⚠️ **Nog open** — geen Bloom-3-vraag toegevoegd |
| Badge-kleuren identiek | ⚠️ **Nog open** — alle 3 nog `#202023` |
| Foto-privacy stap 3 | ⚠️ **Gedeeltelijk** — auteursrecht-waarschuwing toegevoegd, maar "eigen schoolfoto" laat persoonlijke foto's nog toe |
| iOS-route inhoudsopgave (Documentelementen) | ❌ **Nog open** — instructie zegt nog "Tik op Invoegen... zoek naar Inhoudsopgave", niet de geneste iOS-route |

---

## 🎨 Design review

**Score: 8.5/10**

### ✅ Geslaagd

- **Duck-tokens volledig geldig:** alle gebruikte tokens (`duck-bg`, `duck-bgLight`, `duck-ink`, `duck-acid`, `duck-gray`) bestaan in `tailwind.shared.js:8-15`. De vorige blocking-issue is engine-breed opgelost. — `ToolGuide.tsx`
- **Layout consistentie:** identieke container-structuur als andere tool-guide missies (`max-w-md`, `PhaseHeader` + `StepCard`-volgorde). — `ToolGuide.tsx:556-580`
- **Knop-clarity:** alle knoppen functioneel via `canProceed`-gate, geen dode knoppen. — `ToolGuide.tsx:158,416-425`
- **Toegankelijkheid:** `focus-visible:ring-2 focus-visible:ring-duck-acid` (of `duck-ink`) consistent op alle interactieve elementen — geen ontbrekend token meer (was WCAG 2.4.7-schending in vorige review). — `ToolGuide.tsx:246,292,354`
- **Copy-lengte intro/stap 1/2:** intro 29w, stap 1 ~56w, stap 2 ~55w — binnen 60w-grens voor LJ1.

### ⚠️ Aandachtspunten

- **Copy-lengte stap 3/4 nog steeds boven 60w-grens (niet-blocking, licht verergerd):**
  - **Wat:** Stap 3 is nu **72 woorden** (was ~63w in vorige review — dus zelfs iets langer geworden ondanks eerdere aanbeveling), stap 4 is **64 woorden**. — `word-wizard.ts:72,84`
  - **Voorstel stap 3:** Verwijder "voor vrij beschikbare afbeeldingen" (redundant met "Online afbeelding") en verkort de auteursrecht-toelichting tot de tip-sectie.
  - **Voorstel stap 4:** Verwijder "Word maakt nu een inhoudsopgave op basis van je kopstijlen" — dit staat al impliciet in de vorige stappen.

- **Badge-kleuren nog steeds identiek (onopgelost sinds vorige review):**
  - **Wat:** Alle drie badges hebben `color: '#202023'` — visueel ononderscheidbaar zonder emoji. — `word-wizard.ts:111,117,123`
  - **Voorstel:** Laag-prioriteit; differentieer met duck-acid-tint voor topbadge.

- **Visual Precision Gate — unverified:** geen screenshots-map beschikbaar deze pass (geen dev-server-run in scope). Statische analyse toont geen evidente overlap/afkap-risico's, maar dynamische verificatie (mobiel/tablet/desktop) staat nog open — consistent met het systeem-brede punt uit de UI/UX-review van 2026-06-30 (tool-guide is een van de systeem-thema's, geen missie-specifiek nieuw risico).

### ❌ Blocking issues

Geen. De vorige blocking (engine-tokens) is opgelost.

---

## 📚 Didactiek review

**Score: 6.5/10**
**SLO-claim:** 21A, 22A (regulier) · 18A, 19A (VSO)

### ✅ Geslaagd

- **SLO-codes correct:** `21A`, `22A`, `18A`, `19A` zijn alle vier geldige codes uit de definitielijst. — `slo-kerndoelen-mapping.ts:30`
- **`learningObjectives` nu aanwezig:** 4 heldere, meetbare items — vrijwel letterlijk het vorige review-voorstel overgenomen. — `word-wizard.ts:126-131`
- **Leeftijdspassend vocabulary:** helder, concreet, schoolnabij taalgebruik met exacte UI-termen bij eerste gebruik.
- **AI-as-copilot:** n.v.t. — geen `enableChat`, dus geen dormante-chat-rol-risico voor deze missie.
- **VSO-codes aanwezig:** `18A`, `19A` correct meegenomen; genderneutraal taalgebruik.
- **Copy-beknoptheid:** geen didactische showstopper ondanks de lichte 60w-overschrijding (design-issue, geen leerbelemmering).

### ⚠️ Aandachtspunten

- **SLO 22A-fit blijft oppervlakkig (onopgelost sinds vorige review):**
  - **Wat:** 22A vraagt het ontwerpen/realiseren van een digitaal product met een doel. De missie leert losse functies (opslaan, kopstijlen, afbeelding, inhoudsopgave) zonder overkoepelend productdoel. — `word-wizard.ts:8-15`
  - **Voorstel:** Voeg concrete productcontext toe aan `introDescription`: "Je maakt een mini-verslag over een vak naar keuze." (kleine, mechanische tekstwijziging — geen SLO-mapping-wijziging nodig)

- **Bloom-balans blijft 1-2 only (onopgelost sinds vorige review):**
  - **Wat:** Stap 1 (Bloom 2), stap 2 (Bloom 2), stap 4 (Bloom 1 — "tik op Bijwerken"). Geen Bloom-3+ vraag. — `word-wizard.ts:31,55,91`
  - **Voorstel:** blijft ongewijzigd t.o.v. vorige review — vervang stap-4-verificationQuestion door een toepassings-scenario ("je klasgenoot mist een hoofdstuk in de inhoudsopgave — welke stap is hij vergeten?").

- **iOS-route inhoudsopgave nog niet gecorrigeerd (feitelijk risico):**
  - **Wat:** Instructie zegt "Tik op **Invoegen** (tabblad bovenaan) en zoek naar **Inhoudsopgave**" — op iPadOS Word zit dit genest onder Invoegen → Documentelementen → Inhoud, niet als los, direct zichtbaar menu-item. Leerling kan de functie niet vinden zoals beschreven. — `word-wizard.ts:84`
  - **Voorstel:** "Tik op **Invoegen** → **Documentelementen** → **Inhoud**." + tip: "Zie je geen paginanummers? Zet de weergave op Afdrukweergave."

- **Foto-privacy gedeeltelijk verbeterd, niet volledig:**
  - **Wat:** Instructie noemt nu "Online afbeelding" als eerste optie plus auteursrecht-waarschuwing (verbetering), maar staat nog "**Foto's** voor een eigen schoolfoto" toe zonder in te perken op mensen-vrije content. — `word-wizard.ts:72`
  - **Voorstel:** "...of **Foto's** voor een eigen schoolfoto (kies geen foto's met klasgenoten erop)."

### ❌ Blocking issues

Geen. SLO-codes zijn geldig; resterende issues zijn kwaliteitsverbeteringen, geen fundamentele mismatch.

---

## 🔧 Tech review

**Score: 9.0/10**
**Dynamic verificatie:** niet uitgevoerd deze pass (geen dev-server/screenshots in scope; consistent met systeem-brede tool-guide-bevindingen uit UI/UX-review 2026-06-30).

### Scoreplafond — exact nagerekend

Engine-formule (`ToolGuide.tsx:76-95`): 10pt per stap bij volledige checklist + 5pt bonus per beantwoorde `verificationQuestion` (indien correct).

| Stap | Checklist | Verification­Question | Stapmax |
|---|---|---|---|
| Stap 1 (nieuw document) | 4 items → 10pt | ja → 5pt | 15 |
| Stap 2 (kopstijlen) | 3 items → 10pt | ja → 5pt | 15 |
| Stap 3 (afbeelding) | 3 items → 10pt | **nee** | 10 |
| Stap 4 (inhoudsopgave) | 3 items → 10pt | ja → 5pt | 15 |
| **Totaal engine-max** | | | **55** |

`maxScore: 55` (`word-wizard.ts:105`) — **klopt exact.** Badge-drempel "Document Expert" (`minScore: 55`) valt samen met het plafond → 100% is haalbaar, geen frustrerende UX-gap meer (was 60 vs 55 in vorige review).

### ✅ Geslaagd

- **A1 — Knop-handlers:** alle knoppen functioneel — `ToolGuide.tsx:243,348,384,417`
- **A2 — Error states:** `loadError`-state + `LoadingScreen` — `ToolGuide.tsx:587,608-617`
- **A3 — TypeScript-discipline:** geen `any`/`@ts-ignore` in config of engine
- **A4 — Imports:** `@/`-alias consistent gebruikt
- **A5 — Edge function calls:** n.v.t. — geen AI-aanroepen in tool-guide
- **A6 — Restart-safe state:** `useMissionAutoSave(config.missionId, initialState)` correct — `ToolGuide.tsx:450-453`
- **A7 — Security:** geen `dangerouslySetInnerHTML`, geen leerlinginput naar AI
- **Scoreplafond-consistentie:** `maxScore` = engine-berekening = badge-drempel — geen mismatch meer

**correctIndex herverificatie:**

| Stap | correctIndex | Antwoord | Klopt? |
|------|-------------|----------|--------|
| Stap 1 (r.39) | 1 | "Zodat je werk niet verloren gaat..." | ✅ |
| Stap 2 (r.63) | 1 | "Om automatisch een inhoudsopgave..." | ✅ |
| Stap 4 (r.99) | 2 | "Op de inhoudsopgave tikken en Bijwerken" | ✅ |

### ⚠️ Aandachtspunten

- **Badge-kleuren identiek (alle drie `#202023`):** cosmetisch, zie design-review — geen technisch risico.

### ❌ Blocking issues

Geen. De vorige engine-breed doorverwezen blocking (`duck-coral/muted/line/creamDeep`) is opgelost.

---

## Samenvatting

- **Geslaagd:** design 5/6 · didactiek 5/8 · tech 8/8 substantiële criteria
- **Blocking:** 0 (vorige review had 1, engine-breed opgelost)
- **Resterende issues:** 2 design (copy-lengte stap 3/4, badge-kleuren) · 4 didactiek (22A-fit, Bloom-balans, iOS-route, foto-privacy) — alle laag-tot-middel risico, geen showstoppers
- **Grootste verbetering sinds 2026-06-14:** maxScore-bug volledig gefixt (was de belangrijkste UX-brekende bug — leerling zag nooit 100%), engine-brede duck-tokens gefixt, M365-licentie + "Tik"-consistentie + `learningObjectives` alle drie opgelost
- **Grootste resterend risico:** iOS-route voor de automatische inhoudsopgave (stap 4) beschrijft niet de daadwerkelijke geneste menu-locatie op iPadOS — leerling kan vastlopen op de kernfunctie van de missie

**Triage-score:** 2.15 (laag = gezond; schaal (10-design)×0.3 + (10-didactiek)×0.4 + (10-tech)×0.3)

**Verdict: fix-eerst** (geen blocking, maar de iOS-route-fout in stap 4 is functioneel storend genoeg om vóór volgende schoolpilot te corrigeren)

---

## Codex-gate (M1)

**Niet uitgevoerd deze pass** — token-discipline batch-review (wave 11) beperkt scope tot statische drie-rubriek-analyse zonder adversarial gate. Aanbevolen vóór een release-beslissing als de iOS-route-fix en Bloom-3-vraag zijn doorgevoerd.
