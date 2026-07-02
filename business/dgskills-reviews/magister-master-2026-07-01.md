# Missie-review: Magister Meester

**Mission ID:** magister-master
**Template:** tool-guide
**Curriculum-plek:** Leerjaar 1, Periode 1
**Datum:** 2026-07-01
**Reviewer-pipeline:** dgskills-mission-review (M4 batch, wave 8)
**Vorige review:** `magister-master-2026-06-14.md` (verdict: BLOCK — 3 engine-brede/config blockers)

---

## Statusupdate t.o.v. vorige review

Alle 3 blocking issues uit 2026-06-14 zijn inmiddels **opgelost**:

1. **duck-namespace tokens** — `duck-coral`, `duck-muted`, `duck-line`, `duck-creamDeep` komen nergens meer voor in `ToolGuide.tsx`. De engine gebruikt nu uitsluitend bestaande tokens (`duck-acid`, `duck-ink`, `duck-gray`, `duck-error`, `duck-bg`, `duck-bgLight`).
2. **Focus-ring WCAG-overtreding** — `focus-visible:ring-duck-coral` is vervangen door `ring-duck-acid` / `ring-duck-ink` (beide bestaande, zichtbare tokens). — `ToolGuide.tsx:246,292,354,386,419`
3. **maxScore-discrepantie** — `magister-master.ts:117` is nu `maxScore: 55`, exact gelijk aan de engine-som (4 stappen × 10 + 3 verificationQuestions × 5 = 55). Topbadge-drempel (55) klopt.

Dit is dus een **verse, schone review** — geen doorlopende engine-blockers.

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet)

### Visual Precision Gate

**Status: UNVERIFIED** — geen screenshots-map aanwezig voor deze missie in de review-workspace. Grep in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` op `magister-master` gaf geen treffer — deze missie is niet meegenomen in de live UI/UX-review van 2026-06-30. Geen Chrome-plugin bewijs beschikbaar in deze pass. Statische code-inspectie toont geen gebroken tokens meer (zie statusupdate), maar dat is geen vervanging voor visueel bewijs op meerdere viewports/states.

### ✅ Geslaagd

- **Criterium 1 — Tailwind token-consistentie:** Uitsluitend bestaande `duck-*` tokens (`bg`, `bgLight`, `ink`, `acid`, `gray`, `error`). Geen hex-literals, geen niet-doeldomein tokens. — `ToolGuide.tsx` (volledig)
- **Criterium 2 — Layout consistentie (template-baseline):** Config volgt de standaard tool-guide-structuur (`introDescription` → `introFeatures` → stappen met `checklistItems`/`tip`/optioneel `verificationQuestion` → `takeaways`). Geen structurele afwijkingen t.o.v. andere tool-guide-missies.
- **Criterium 4 — Copy-lengte:** `introDescription` = 23 woorden (<80 voor LJ1). Stap-instructies 16–19 woorden (<60). Ruim binnen norm.
- **Criterium 6 — Framer Motion:** Geen `motion.*`/`AnimatePresence` in engine — geen animatie-risico's.
- **Criterium 7 — Toegankelijkheid (basis):** `<button>`-elementen met `focus-visible:ring-2` op zichtbare tokens. Terug-knop heeft `aria-label`.

### ⚠️ Aandachtspunten

- **Visual Precision Gate onverified:** geen screenshots/Chrome-plugin bewijs deze pass. — Voorstel: neem `magister-master` mee in een volgende multi-viewport screenshot-sweep (zoals de 2026-06-30 review deed voor andere missies) voordat dit als volledig visueel geverifieerd geldt.
- **CompletionScreen breedte:** eerdere review noteerde `max-w-lg` vs `max-w-md`-inconsistentie in het gedeelde eindscherm. Niet herverifieerd deze pass (geen screenshot-bewijs) — laag risico, engine-breed, niet missie-specifiek.

### ❌ Blocking issues

Geen.

### Score

5/7 criteria hard bevestigd (2 niet visueel te bevestigen zonder screenshots) · **Aanbeveling: ship, met open visuele verificatie-actie**

---

## 📚 Didactiek review

**Curriculum-plek:** Leerjaar 1, Periode 1
**SLO-claim:** `['21A']` (regulier) · `['18A']` (VSO)

### ✅ Geslaagd

- **Criterium 1 — SLO-codes correct:** `21A` geldig regulier, `18A` geldig VSO. Eén code per profiel. — `slo-kerndoelen-mapping.ts:28`
- **Criterium 3 — Leerdoelen expliciet aanwezig:** `learningObjectives` (4 items) zijn nu toegevoegd aan de config, elk met actiewerkwoord ("logt in", "vindt", "zoekt op", "opent ... en leest"). Dit lost het aandachtspunt uit de vorige review op. — `magister-master.ts:138-143`
- **Criterium 4 — Opdracht-beknoptheid:** Alle stap-instructies 16-19 woorden (<60 voor LJ1). Intro 23 woorden (<80).
- **Criterium 6 — Curriculum-plek logisch:** Eerste missie LJ1-P1 "Digitale Basisvaardigheden" — logische opener, geen vereiste voorkennis. — `curriculum.ts:67`
- **Criterium 8 — AI-as-copilot:** Geen `enableChat` — geen chat-component, geen dormant-rol-risico. Criterium n.v.t. voor dit templateType.
- **Criterium 9 — Welzijn & inclusiviteit:** VSO-mapping aanwezig. Cijfers (privacygevoelig) expliciet gemitigeerd via `evidence`-veld + `teacherCheck` in stap 4 ("Je hoeft geen cijfer hardop te noemen").
- **Criterium 5 — Leeftijdspassend vocabulaire:** Direct taalgebruik, wegingsfactor uitgelegd in de explanation, Teams/Classroom-alternatief eerlijk benoemd.

### ⚠️ Aandachtspunten

- **Criterium 2 — SLO-fit 21A blijft oppervlakkig:** de missie traint uitsluitend navigatiehandelingen (klikken, openen, vinden), geen systeemredenering. Verdedigbaar als LJ1-startniveau; VSO 18A wordt sterk geraakt. — `magister-master.ts:27-115`
- **Criterium 7 — Bloom-balans laag (1-2):** checklist (onthouden) + verificationQuestions over feitenkennis (begrijpen). Geen Bloom-3-afsluiting, ondanks dat dit al als suggestie in de vorige review stond. — `magister-master.ts:40-50,65-75,103-114`

### ❌ Blocking issues

Geen.

### SLO-fit oordeel

- **21A:** oppervlakkig maar verdedigbaar als LJ1-opener.
- **18A (VSO):** sterk geraakt.

### Score

7/9 criteria geslaagd (verbeterd t.o.v. 6/9 — `learningObjectives` nu aanwezig) · **Aanbeveling: ship** — resterende punten zijn optionele verdieping, geen blokkade.

---

## 🔧 Tech review

**Dynamic verificatie:** niet uitgevoerd deze pass (geen dev-server gestart binnen deze review-run; statische analyse + vergelijking met eerder dynamisch bewijs uit 2026-06-14/6-30 gebruikt).

### Static analyse

#### ✅ Geslaagd

- **A1 — Knop-handlers gekoppeld:** alle `<button>`-elementen hebben functionele `onClick`.
- **A2 — Error states aanwezig:** `loadError`-state met terug-knop, `<LoadingScreen />` tijdens laden.
- **A3 — TypeScript-discipline:** geen `any`, geen `@ts-ignore`. Interfaces volledig.
- **A5 — Edge function calls:** n.v.t. — geen AI-aanroepen in dit template.
- **A6 — Restart-safe state:** `useMissionAutoSave<ToolGuideState>` correct toegepast (debounced save, beforeunload-flush, clearSave bij voltooiing, userId-scoping).
- **A7 — Security:** geen user-input naar AI, geen `dangerouslySetInnerHTML` met leerling-input.
- **maxScore-som geverifieerd:** 4 stappen × `CHECKLIST_POINTS_PER_STEP` (10) + 3 `verificationQuestion`-items × `QUESTION_BONUS` (5) = 40 + 15 = **55**, exact gelijk aan `maxScore: 55` en de topbadge-drempel (`minScore: 55`). Leerling kan 100% halen. — `ToolGuide.tsx:76-77`, `magister-master.ts:117,120`
- **Magister-UI-feitelijkheid:** de config noemt generieke, herkenbare Magister-hoofdmenu-onderdelen (rooster/kalender-icoon, Agenda/ELO, Cijfers) zonder desktop-only aanwijzingen (geen "rechtsboven", "menubalk", "hover"). Past bij de iPad-doelgroep; geen feitelijke UI-mismatch gevonden in de tekst zelf.

#### ⚠️ Aandachtspunten

- **A4 — Relatieve imports:** `ToolGuide.tsx` importeert shared screens via relatieve paden i.p.v. `@/*`-alias. Laag risico, project-conventie-afwijking, engine-breed (niet missie-specifiek).
- **hasSavedProgress niet benut voor resume-UX:** `useMissionAutoSave` retourneert `hasSavedProgress`, maar er is geen "verder gaan"-banner op het introscherm. Engine-breed, niet missie-specifiek.

#### ❌ Blocking issues

Geen.

### Dynamic verificatie

Niet opnieuw uitgevoerd deze pass — geen dev-server actief binnen deze review-run. Vorige dynamische pass (2026-06-14) bevestigde 0 console-errors, 0 netwerkfouten, functionele flow. Aanbevolen: bij volgende visuele sweep opnieuw dynamisch bevestigen dat de tokenfix in de browser klopt (statische code-inspectie toont geen gebroken tokens meer, maar is geen vervanging voor een gerenderde check).

### Score

7/7 static criteria geslaagd · Dynamic: niet herverifieerd deze pass · **Aanbeveling: ship**

---

## 🖼️ Visuele evidence

Geen screenshots-map aanwezig voor `magister-master`. Niet opgenomen in `docs/audits/student-missions-ui-ux-review-2026-06-30.md`. Visuele verificatie op meerdere viewports (mobiel/tablet/desktop) en states (intro/mid-flow/fout-feedback/eindstaat) staat nog open.

**Status: PARTIAL REVIEW (code-only)** — alle drie eerdere blockers zijn statisch bevestigd als opgelost, maar zonder gerenderd bewijs. Aanbevolen als lichte follow-up, geen blokkade voor ship gezien de eenvoud en het lokale (niet-AI, niet-netwerk) karakter van dit template.

---

## Samenvatting

- **Geslaagd:** 19 criteria (design 5 + didactiek 7 + tech 7)
- **Aandachtspunten:** 6 issues, geen blocking
- **Blocking:** 0 (alle 3 vorige blockers bevestigd opgelost)
- **Aanbeveling: SHIP**
- **Release-gate status: SHIP, met één open follow-up** (multi-viewport visuele verificatie — laag risico, aanbevolen bij volgende screenshot-sweep, geen blocker)

**Kern:** de missie-config was al inhoudelijk sterk (heldere stappen, passende copy, teacherCheck-verankering, welzijnsbewust). De 3 engine-brede blockers uit 2026-06-14 zijn correct en volledig gefixt: duck-tokens vervangen door bestaande tokens, focus-ring werkt weer, en `maxScore` klopt nu exact met de scoreberekening. Didactisch is ook `learningObjectives` inmiddels toegevoegd. Resterende punten (Bloom-3-afsluiting, visuele screenshot-verificatie) zijn verbeteringen, geen blokkades.

**Top resterende aandachtspunten (niet-blocking):**
1. Geen visueel (screenshot) bewijs voor deze missie — aanbevolen bij volgende sweep.
2. Bloom-balans blijft op niveau 1-2; een optionele Bloom-3-reflectievraag zou de "bewijs stap voor stap"-belofte in de intro sterker inlossen.
3. `hasSavedProgress` (engine-breed) wordt niet gebruikt voor een resume-banner.
