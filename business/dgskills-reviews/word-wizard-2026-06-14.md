# Missie-review: Word Wizard

**Mission ID:** word-wizard
**Template:** tool-guide
**Curriculum-plek:** Leerjaar 1, Periode 1
**Datum:** 2026-06-14
**Reviewer-pipeline:** dgskills-mission-review v1.0

---

## 🎨 Design review

**Mission:** word-wizard (tool-guide)
**Reviewer:** dgskills-design-reviewer (Sonnet)

---

### ✅ Geslaagd

- **Criterium 2 — Layout consistentie:** Container-structuur identiek aan baseline — zelfde `max-w-md`, `PhaseHeader` + `StepCard`-volgorde, `space-y-2` checklist-rhythm. Geen structurele afwijkingen. — `ToolGuide.tsx:543`
- **Criterium 3 — Knop-clarity:** Alle knoppen hebben duidelijke labels. `canProceed`-gate correct geïmplementeerd. Geen dode knoppen. — `ToolGuide.tsx:404`
- **Criterium 4 — Copy-lengte stap 1-2:** Intro 29 woorden, stap 1 ~56w, stap 2 ~55w — ruim binnen 60w-grens voor LJ1. — `word-wizard.ts:8-55`
- **Criterium 6 — Framer Motion:** Geen `motion.*` of `<AnimatePresence>`. — `ToolGuide.tsx` volledig
- **Criterium 7 — Toegankelijkheid (basis):** Knoppen hebben hover-states en `focus-visible:ring-2`. Geen icon-only knoppen zonder label.
- **Visual Precision Gate — Statisch:** `w-full max-w-md` voorkomt overstretch, checklist-knoppen zijn `w-full`. Dynamisch onverified (devServerUrl: null).

---

### ⚠️ Aandachtspunten

- **Criterium 4 — Copy-lengte stap 3 en 4 (overschrijding):**
  - **Wat:** Stap 3: ~63 woorden, stap 4: ~63 woorden — beide 5% boven 60w-grens. — `word-wizard.ts:71,83`
  - **Voorstel stap 3:** Verwijder de "Strak vs. Vierkant"-toelichting uit de instructie; die staat al in de tip.
  - **Voorstel stap 4:** Verwijder herhaling "Word maakt nu een inhoudsopgave op basis van je kopstijlen" — reduceert tot ~56w.

- **Criterium: iOS Word "penseel-icoon" onbetrouwbaar:**
  - **Wat:** Stap 2 verwijst naar "penseel-icoon rechtsboven (Opmaak)" (`word-wizard.ts:47`). In actuele Word iPadOS is het icoon een `A` met penseel; in oudere/gratis versies ontbreekt het volledig. Kopstijlen zijn überhaupt niet beschikbaar in de gratis Word-app — M365 is vereist.
  - **Voorstel:** "de `A`-knop rechts boven in het scherm (Opmaak)" + voetnoot: "Je hebt hier een Microsoft 365-account voor nodig. Vraag je docent als je dit tabblad niet ziet."

- **Criterium: "Klik" ipv "Tik" in stap 3:**
  - **Wat:** "Klik in je document op de plek..." (`word-wizard.ts:71`) — touchscreen-missie, alle andere stappen gebruiken "Tik".
  - **Voorstel:** "Tik in je document op de plek..."

- **Criterium 7 — Badge-kleuren identiek:**
  - **Wat:** Alle drie badges hebben `color: '#202023'` (`duck-ink`) — visueel ononderscheidbaar zonder emoji. — `word-wizard.ts:107-121`
  - **Voorstel:** Laag-prioriteit; geef badges andere accentkleuren zodat niveau ook zonder emoji herkenbaar is.

- **Licentievereiste niet vermeld in introductie:**
  - **Wat:** Stap 4 (inhoudsopgave) vereist M365 en afdruklayout-weergave; paginanummers zijn in mobiele weergave niet zichtbaar. — `word-wizard.ts:83-103`
  - **Voorstel:** Voeg toe aan introDescription: "Voor deze missie heb je de **Microsoft 365**-versie van Word nodig."

---

### ❌ Blocking issues

- **BLOCKING-D1 (engine-breed, doorverwijzing magister-master):** `duck-coral`, `duck-muted`, `duck-line`, `duck-creamDeep` afwezig in `tailwind.shared.js:8-15`. Alle StepCard-kleurelementen transparant. Fix in engine.
- **BLOCKING-D2 (engine-breed, doorverwijzing magister-master):** `focus-visible:ring-duck-coral` (`ToolGuide.tsx:234,342,374`) onzichtbaar — WCAG 2.1 AA 2.4.7 schending. Fix in engine.

---

### Score

5/7 criteria geslaagd · Aanbeveling: **fix-eerst**

---

## 📚 Didactiek review

**Mission:** word-wizard (tool-guide)
**Curriculum-plek:** Leerjaar 1, Periode 1
**SLO-claim:** 21A, 22A (regulier) · 18A, 19A (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

---

### ✅ Geslaagd

- **Criterium 1 — SLO-codes correct:** `21A`, `22A`, `18A`, `19A` zijn alle vier geldige codes. — `slo-kerndoelen-mapping.ts:30`
- **Criterium 4 — Opdracht-beknoptheid:** Intro 27w (<80), alle instructies ≤63w (licht boven 60w-grens voor stap 3+4, zie design-review — geen didactisch showstopper).
- **Criterium 5 — Leeftijdspassend vocabulary:** Helder, concreet, schoolnabij taalgebruik met exacte UI-termen bij eerste gebruik. — `word-wizard.ts:47`
- **Criterium 8 — AI-as-copilot:** n.v.t. — geen `enableChat`.
- **Criterium 9 — Welzijn & VSO:** VSO-codes `18A`, `19A` aanwezig. Genderneutraal taalgebruik.

---

### ⚠️ Aandachtspunten

- **Criterium 2 — SLO-fit 22A oppervlakkig:**
  - **Wat:** 22A beschrijft het ontwerpen en realiseren van een digitaal product met een doel. De missie leert afzonderlijke functies bedienen (opslaan, kopstijlen, afbeelding, inhoudsopgave), maar zonder overkoepelend productdoel. — `word-wizard.ts:8-15`
  - **Waarom:** De leerling oefent tool-gebruik, niet product-denken.
  - **Voorstel:** Voeg concrete productcontext toe aan intro: "Je maakt een mini-verslag over [een vak-onderwerp]." Alternatief: overweeg 22A te vervangen door `21A` als de missie primair systeembegrip dekt.

- **Criterium 3 — Geen `learningObjectives`:**
  - **Wat:** Config bevat geen `learningObjectives`-array; `takeaways` zijn geen Bloom-gekoppelde leerdoelen.
  - **Voorstel:**
    ```text
    learningObjectives: [
      'De leerling maakt een nieuw Word-document aan en slaat het direct op in OneDrive met een logische bestandsnaam.',
      'De leerling past kopstijlen Kop 1 en Kop 2 toe om een documentstructuur op te bouwen.',
      'De leerling voegt een afbeelding in en stelt de tekstomloop in op Strak of Vierkant.',
      'De leerling verklaart waarom kopstijlen en de automatische inhoudsopgave met elkaar samenwerken.',
    ]
    ```

- **Criterium 7 — Bloom-balans: Bloom 1-2 only:**
  - **Wat:** Stap 1: Bloom 2 (begrijpen). Stap 2: Bloom 2 (begrijpen). Stap 4: Bloom 1 (onthouden — "tik op Bijwerken"). Geen Bloom 3+ vraag. — `word-wizard.ts:31,55,92`
  - **Voorstel:** Vervang stap 4 verificationQuestion door Bloom-3 redeneer-vraag:
    ```text
    question: 'Je klasgenoot heeft een inhoudsopgave ingevoegd, maar zijn nieuwe hoofdstuk staat er niet in. Welke stap is hij vergeten en waarom?'
    options: [
      'Hij heeft het hoofdstuk niet met Kop 1 opgemaakt — de inhoudsopgave herkent alleen kopstijlen',
      'Hij heeft het hoofdstuk op de verkeerde plek gezet',
      'Hij moet de inhoudsopgave verwijderen en opnieuw invoegen',
      'Word voegt nieuwe hoofdstukken nooit automatisch toe',
    ]
    correctIndex: 0
    explanation: 'Precies! Een automatische inhoudsopgave werkt alleen met kopstijlen. Gewone dikgedrukte tekst herkent Word niet als hoofdstuk.'
    ```

- **Criterium 5/Welzijn — Privacy stap 3:**
  - **Wat:** "Selecteer een foto uit je Fotoalbum" (`word-wizard.ts:71`). Zelfde issue als cloud-commander stap 3: persoonlijke foto's in een klasomgeving.
  - **Voorstel:** "Voeg een afbeelding in via Invoegen → Online afbeelding (zoek een neutrale illustratie). Wil je een eigen foto? Kies dan geen foto's met mensen."

- **Criterium 6 — iOS inhoudsopgave route:**
  - **Wat:** In iOS Word zit de automatische inhoudsopgave onder Invoegen → Documentelementen → Inhoud, niet als standaard tabblad. Paginanummers zijn alleen zichtbaar in afdruklayout-weergave. — `word-wizard.ts:83-89`
  - **Voorstel:** Tip toevoeging: "Op de iPad: Invoegen → Documentelementen → Inhoud. Zie je geen paginanummers? Zet de weergave op Afdrukweergave."

---

### ❌ Blocking issues

Geen. SLO-codes zijn geldig en de missie heeft geen fundamentele mismatch. Ontbrekende `learningObjectives` en Bloom-armoede zijn kwaliteitsproblemen, geen didactische blockers.

---

### SLO-fit oordeel

- **21A:** sterk geraakt — automatisch opslaan in OneDrive, koppeling kopstijlen → inhoudsopgave als systeemfunctie, tekstomloop als lay-outmechanisme
- **22A:** oppervlakkig — tool-gebruik zonder volledig productontwerp-denken; te versterken met productcontext
- **18A/19A (VSO):** stap-voor-stap structuur goed passend

---

### Score

5/9 criteria geslaagd · Bloom-balans: Bloom 1-2 only · Aanbeveling: **fix-eerst**

---

## 🔧 Tech review

**Mission:** word-wizard (tool-guide)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** niet uitgevoerd — devServerUrl null.

---

### Static analyse

#### ✅ Geslaagd

- **A1 — Knop-handlers:** alle knoppen functioneel — `ToolGuide.tsx:231,338,373,406,600`
- **A2 — Error states:** `loadError`-state + `LoadingScreen` — `ToolGuide.tsx:574,581-604`
- **A3 — TypeScript-discipline:** geen `any`, `@ts-ignore` in config of engine
- **A4 — Imports:** engine gebruikt `@/`-alias consistent; config gebruikt `export default` (conventie voor tool-guide configs)
- **A5 — Edge function calls:** geen AI-aanroepen — n.v.t.
- **A6 — Restart-safe state:** `useMissionAutoSave` correct met `config.missionId` als sleutel — `ToolGuide.tsx:438`
- **A7 — Security:** geen `dangerouslySetInnerHTML`, geen leerlinginput naar AI

**correctIndex verificatie:**

| Stap | correctIndex | Antwoord | Klopt? |
|------|-------------|----------|--------|
| Stap 1 (r.38) | 1 | "Zodat je werk niet verloren gaat..." | ✅ |
| Stap 2 (r.61) | 1 | "Om automatisch een inhoudsopgave..." | ✅ |
| Stap 4 (r.98) | 2 | "Op de inhoudsopgave tikken en Bijwerken" | ✅ |

---

#### ⚠️ Aandachtspunten

- **maxScore: 60 vs engine max 55 (niet-blocking):**
  - **Wat:** `maxScore: 60` (`word-wizard.ts:104`). Engine: stap 1 (15pt) + stap 2 (15pt) + stap 3 (10pt) + stap 4 (15pt) = 55pt max. `CompletionScreen` toont perfecte leerling als 55/60 = 92%, nooit 100%.
  - **Risico:** Badge "Document Expert" (minScore: 55) IS bereikbaar (55 ≥ 55). Maar 100% is nooit haalbaar — frustrerende UX.
  - **Voorstel:** `maxScore: 55` in `word-wizard.ts:104`. Of: voeg verificationQuestion toe aan stap 3 (tekstomloop).
- **Export-stijl inconsistentie (niet-blocking):** `word-wizard.ts:134` — `export default config` vs cloud-commander `export const`. Engine handelt beide stijlen af. Geen actie vereist.
- **Badge-kleuren identiek (alle drie `#202023`):** visueel ononderscheidbaar; zie design-review.

---

#### ❌ Blocking issues

- **BLOCKING-T2 (engine-breed, doorverwijzing magister-master):** `duck-coral/muted/line/creamDeep` in `ToolGuide.tsx` (o.a. regels 166, 207, 220, 265, 374) bestaan niet in `tailwind.shared.js`. Zelfde als magister-master — fix in engine.

---

### Score

Static 7/7 checks · Blocking: doorverwijzing duck-tokens · Aanbeveling: **fix-eerst**

---

## 🖼️ Visuele evidence (multi-viewport)

Multi-viewport screenshots niet beschikbaar — devServerUrl was null. Deze missie heeft een bijzonder aandachtspunt: stap 2-4 beschrijven Word voor iPadOS UI-elementen (penseel-icoon, Invoegen-tab, Inhoudsopgave onder Documentelementen). Visuele verificatie op een echte iPad (of iOS-simulator) is sterk aanbevolen vóór schoolpilot.

**Status: PARTIAL REVIEW** — statische analyse + engine-check voltooid. Visuele QA (desktop / tablet / mobiel + iOS Word UI-verificatie) is vereist voor release-gate.

---

## Samenvatting

- **Geslaagd:** 17 criteria (design 5 + didactiek 5 + tech 7)
- **Aandachtspunten:** 13 issues (waarvan 0 blocking in didactiek/tech-config)
- **Blocking (uniek):** 1 — duck-namespace tokens [engine-breed, doorverwijzing magister-master]
- **Aanbeveling: fix-eerst**
- **Release-gate status: BLOCKED** — visuele QA ontbreekt; iOS Word UI-verificatie essentieel

**Config-kwaliteit:** sterk — logische stap-opbouw, correcte SLO-codes, schoolnabij taalgebruik, correcte verificationQuestion-antwoorden. De blockers zijn engine-breed, niet config-specifiek. Unieke word-wizard issues: (1) iOS M365-licentievereiste niet vermeld, (2) maxScore 5pt te hoog, (3) foto-privacy stap 3.

**Top 3 issues:**
1. `word-wizard.ts:47` — voeg M365-licentievereiste toe; "penseel-icoon" → "`A`-knop" (stap 2 instructie breekt in gratis Word-app)
2. `word-wizard.ts:104` — `maxScore: 60` → `maxScore: 55` (leerling ziet nooit 100%)
3. `word-wizard.ts:71` — "Klik" → "Tik" + foto-instructie beperken tot schoolcontent

---

## Codex-gate (M1)

**Verdict: BLOCK**
**Model:** gpt-5.5 · **Effort:** xhigh · **Datum:** 2026-06-14

**Bevindingen:**

**[HIGH]** `business/dgskills-reviews/word-wizard-2026-06-14.md:228-230` — Codex-gate sectie was een lege placeholder; het rapport claimt een BLOCKED release-gate status maar bevat geen definitief adversarial eindoordeel. Fix: deze sectie is nu ingevuld.

**Geverifieerde claims:**
- `duck-coral/muted/line/creamDeep` afwezig in `tailwind.shared.js` duck-namespace bevestigd via directe bestandsinspectie.
- `maxScore: 60` in `word-wizard.ts:104` vs. engine-max 55 bevestigd.
- `focus-visible:ring-duck-coral` (`ToolGuide.tsx:234,342,374`) onbestaand token bevestigd.
- `correctIndex`-waarden stap 1 (1), stap 2 (1), stap 4 (2) kloppen met opties-arrays — correct.

**Next steps (uit Codex):**
1. Fix duck-namespace tokens in `tailwind.shared.js:8-15` (engine-breed)
2. Fix `maxScore: 55` in `word-wizard.ts:104`
3. Corrigeer stap 2-4 iOS-routebeschrijvingen (M365-licentievereiste, "Tik" ipv "Klik")
4. Voer multi-viewport visuele QA uit inclusief iOS Word UI-verificatie vóór release-gate
