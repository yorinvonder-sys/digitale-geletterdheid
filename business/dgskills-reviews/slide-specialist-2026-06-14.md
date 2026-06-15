# Missie-review: Slide Specialist

**Mission ID:** slide-specialist
**Template:** tool-guide
**Curriculum-plek:** Leerjaar 1, Periode 1
**Datum:** 2026-06-14
**Reviewer-pipeline:** dgskills-mission-review v1.0

---

## 🎨 Design review

**Mission:** slide-specialist (tool-guide)
**Reviewer:** dgskills-design-reviewer (Sonnet)

---

### ✅ Geslaagd

- **Criterium 2 — Layout consistentie:** Structuur identiek aan magister-master (PhaseHeader + StepCard + next-knop, `max-w-md mx-auto`). — `ToolGuide.tsx:543-544`
- **Criterium 3 — Knop-clarity (gedeeltelijk):** Alle knoppen hebben labels en hover-states. Geen dode knoppen. — `ToolGuide.tsx:407,374` — ⚠️ Focus-visible ring (`focus-visible:ring-duck-coral`) rendert transparant door ontbrekend token; zie BLOCKING-D1/D2.
- **Criterium 4 — Copy-lengte (stap 1, 3, 4):** Intro 27w, stap 1 59w (net onder 60w-grens), stap 3 53w, stap 4 54w. — `slide-specialist.ts:8-101`
- **Criterium 5 — Responsive statisch:** `w-full max-w-md`, `sm:py-8`. Geen vaste pixel-widths. — `CompletionScreen.tsx:37-38`
- **Criterium 6 — Framer Motion:** Geen `motion.*`, geen `AnimatePresence`. — `ToolGuide.tsx` volledig
- **Visual Precision Gate — Statisch:** Coherente structuur, geen canvas/game-area. Dynamische verificatie: niet uitgevoerd (devServerUrl null).

---

### ⚠️ Aandachtspunten

- **Criterium 4 — Copy stap 2: 62 woorden (grens 60):**
  - **Wat:** "Of tik lang op een slide en kies 'Dia dupliceren' of 'Nieuwe dia'" als haakjesgroep maakt de instructie langer en ambiguer. — `slide-specialist.ts:47`
  - **Voorstel:** Verwijder de alternatieve route: "Voeg een tweede slide toe via het +-icoon in het slides-paneel links." (~46w)

- **Stap 1 — "klik" ipv "tik" (touchscreen-taal):**
  - **Wat:** "klik er een aan" (`slide-specialist.ts:23`) — alle andere stappen gebruiken correct "tikken."
  - **Voorstel:** "tik er een aan"

- **Stap 4 — Afbeeldingen stap 2 zonder instructie over bronkeuze:**
  - **Wat:** "Voeg een afbeelding in via Invoegen > Afbeeldingen" (`slide-specialist.ts:47`). Geen instructie over auteursrecht of schikbarekopie.
  - **Voorstel:** "Gebruik een afbeelding uit de online PowerPoint-bibliotheek (Invoegen > Online afbeelding) of een eigen schoolfoto — geen willekeurige Google-beelden."

---

### ❌ Blocking issues

- **BLOCKING-D1 (engine-breed, doorverwijzing magister-master):** `duck-coral/muted/line/creamDeep` afwezig in `tailwind.shared.js:8-15`. Alle StepCard-kleurelementen transparant. Fix in engine.
- **BLOCKING-D2 (engine-breed, doorverwijzing magister-master):** `focus-visible:ring-duck-coral` onzichtbaar — WCAG 2.1 AA 2.4.7 schending. Fix in engine.
- **BLOCKING-D3 — Dubbele rode badge-kleur (`#ff3c21`) voor top twee badges:**
  - **Wat:** "Presentatie Expert" (≥55) én "Slide Specialist" (≥40) hebben beide `color: '#ff3c21'` — identiek aan `duck-error`. Rood is semantisch negatief in onderwijs-UI; de twee niveaus zijn visueel ononderscheidbaar. — `slide-specialist.ts:110-117`
  - **Voorstel:**
    ```ts
    // ✅ Correctie (1 regel)
    { minScore: 40, emoji: '🎨', title: 'Slide Specialist', color: '#202023' },
    ```
- **BLOCKING-D4 — "Animatievenster" bestaat niet in PowerPoint voor iPad:**
  - **Wat:** Stap 3: "Tik op Animatievenster of Afspelen" (`slide-specialist.ts:71`). Het Animatievenster is een desktop-only functie (Windows/Mac). In PowerPoint iOS niet aanwezig.
  - **Voorstel:** "Tik op Afspelen om je animatie te testen, of start de Diavoorstelling om het live te zien."
- **BLOCKING-D5 — "Zetelen" is geen bestaande PowerPoint-overgang:**
  - **Wat:** Stap 4: "bijv. Fade, Zetelen of Doelwit" (`slide-specialist.ts:83`). "Zetelen" bestaat niet in PowerPoint (ook niet in de Nederlandse versie). Leerlingen vinden het niet.
  - **Voorstel:** "bijv. Vervaag, Schuiven of Doelwit"

---

### Score

5/7 criteria geslaagd · Aanbeveling: **fix-eerst**

---

## 📚 Didactiek review

**Mission:** slide-specialist (tool-guide)
**Curriculum-plek:** Leerjaar 1, Periode 1
**SLO-claim:** 21A, 22A (regulier) · 18A, 19A (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

---

### ✅ Geslaagd

- **Criterium 1 — SLO-codes geldig:** `21A`, `22A`, `18A`, `19A` zijn alle vier geldige codes. — `slo-kerndoelen-mapping.ts:31`
- **Criterium 4 — Opdracht-beknoptheid:** Intro ~35w, instructies 55-80w (stap 3 en 4 iets boven 60w maar didactisch gerechtvaardigd voor sequentiële taakinstructie).
- **Criterium 5 — Leeftijdspassend vocabulary:** "thema", "animatie", "overgang" worden in context uitgelegd. Tone-of-voice passend. — `slide-specialist.ts:8`
- **Criterium 8 — AI-as-copilot:** n.v.t. — geen `enableChat`.
- **Criterium 9 — VSO-mapping aanwezig:** `18A`, `19A` aanwezig en passend.
- **SLO-fit 22A — Sterk:** De missie bouwt stap voor stap naar één afgerond presentatieproduct toe met kwaliteitscriteria (consistente stijl, tekst-economie, animatie-spaarzaamheid). — `slide-specialist.ts:8-9`

---

### ⚠️ Aandachtspunten

- **Criterium 2 — SLO-fit 21A oppervlakkig:**
  - **Wat:** 21A vereist systeembegrip. De missie behandelt uitsluitend presentatiedesign-beslissingen (thema, animatie, overgangen). Geen stap raakt bestandsopslag, synchronisatie of apparaatrol. — `slide-specialist.ts:1-134`
  - **Voorstel:** Voeg aan stap 1 een OneDrive-opslagstap toe + verificationQuestion: "Waarom sla je je presentatie op in OneDrive?" (koppeling aan cloud-commander en word-wizard-thema).

- **Criterium 3 — Geen `learningObjectives`:**
  - **Voorstel:**
    ```text
    learningObjectives: [
      'De leerling selecteert een passend thema en legt uit waarom consistente opmaak professioneler oogt.',
      'De leerling bouwt een slide op met ≤5 tekstelementen en één ondersteunende afbeelding.',
      'De leerling voegt één animatie toe en stelt de timing in.',
      'De leerling past één overgangstype toe op alle slides en verklaart waarom consistentie helpt.',
    ]
    ```

- **Criterium 7 — Bloom 1-2 only:**
  - **Wat:** Alle 3 verificationQuestions zijn recall/begrip (Bloom 1-2). Geen Bloom 3+ vraag. — `slide-specialist.ts:30-101`
  - **Voorstel stap 4:** "Je vriend heeft bij elke slide een andere overgang. Wat zou jij hem adviseren en waarom?" (Bloom 3-4)

- **Criterium 5/Welzijn — Afbeelding stap 2 zonder bronvermelding:**
  - **Wat:** Geen sturing op welk type afbeelding te gebruiken (auteursrecht, privacy). — `slide-specialist.ts:47`
  - **Voorstel:** Verwijs naar PowerPoint's eigen Online afbeelding-bibliotheek.

- **Curriculum-progressie 21A stap 3→4:**
  - **Wat:** slide-specialist herhaalt 22A op hetzelfde Bloom-niveau als word-wizard — geen duidelijke moeilijkheidsgraad-verhoging.
  - **Voorstel:** Voeg een vergelijkingsstap toe: "Je hebt bij Word Wizard ook een digitaal product gemaakt. Wat is het verschil tussen een verslag en een presentatie?"

---

### ❌ Blocking issues

- **BLOCKING-DD1 — Geen `learningObjectives`:**
  - **Wat:** Config heeft geen `learningObjectives`-veld. `takeaways` zijn geen Bloom-geformuleerde toetsbare leerdoelen.
  - **Voorstel:**
    ```text
    learningObjectives: [
      'De leerling selecteert een passend thema en legt uit waarom consistente opmaak professioneler oogt.',
      'De leerling bouwt een slide op met ≤5 tekstelementen en één ondersteunende afbeelding.',
      'De leerling voegt één animatie toe en stelt de timing in.',
      'De leerling past één overgangstype toe op alle slides en verklaart waarom consistentie helpt.',
    ]
    ```

---

### SLO-fit oordeel

- **21A:** Oppervlakkig — systeemkennis afwezig (bestandsformaten, cloudopslag). Fix: OneDrive-opslagstap toevoegen.
- **22A:** Sterk geraakt — één afgerond presentatieproduct met expliciete kwaliteitscriteria.
- **18A/19A (VSO):** Zelfde als regulier-pendant.

---

### Score

6/9 criteria geslaagd · Bloom 1-2 dominant · Aanbeveling: **fix-eerst**

---

## 🔧 Tech review

**Mission:** slide-specialist (tool-guide)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** niet uitgevoerd — devServerUrl null.

---

### Static analyse

#### ✅ Geslaagd

- **A1–A7:** Alle criteria geslaagd (identiek aan magister-master engine — knop-handlers, error states, TypeScript-discipline, alias-imports, geen edge function calls, restart-safe state, security). — `ToolGuide.tsx:231-604`

**correctIndex verificatie:**

| Stap | correctIndex | Antwoord | Klopt? |
|------|-------------|----------|--------|
| Stap 1 (r.37) | 1 | "Consistente, professionele opmaak..." | ✅ |
| Stap 2 (r.60) | 1 | "Drie tot vijf korte punten..." | ✅ |
| Stap 4 (r.97) | 1 | "Rustig en professioneel..." | ✅ |

---

#### ⚠️ Aandachtspunten

- **maxScore: 60 vs engine max 55 (niet-blocking):**
  - **Wat:** Stap 1 (15pt) + stap 2 (15pt) + stap 3 (10pt) + stap 4 (15pt) = 55pt max. Badge "Presentatie Expert" minScore 55 IS bereikbaar. Maar `CompletionScreen` toont 55/60 = 92%, nooit 100%. — `slide-specialist.ts:104`
  - **Voorstel:** `maxScore: 55`

- **Badge `#ff3c21` (duck-error rood) voor twee top-badges:**
  - **Wat:** Badges "Presentatie Expert" en "Slide Specialist" gebruiken `#ff3c21` — hetzelfde rood als `duck-error`. In `CompletionScreen.tsx:42` levert dit een rode gradient-tint op voor succesvolle leerlingen. — `slide-specialist.ts:110-117`
  - **Voorstel:** `badge[1].color = '#202023'` (zie design BLOCKING-D3)

---

#### ❌ Blocking issues

- **BLOCKING-T2 (engine-breed, doorverwijzing magister-master):** duck-* tokens in `ToolGuide.tsx` afwezig in tailwind.shared.js. Fix in engine.

---

### Score

Static 7/7 · Blocking: duck-tokens doorverwijzing · Aanbeveling: **fix-eerst**

---

## 🖼️ Visuele evidence (multi-viewport)

Niet uitgevoerd — devServerUrl null. Slide-specialist heeft bijzonder design-risico: PowerPoint iOS UI verschilt sterk van desktop (Animatievenster ontbreekt, Zetelen-overgang bestaat niet). Visuele QA op échte iPad vereist vóór schoolpilot.

**Status: PARTIAL REVIEW** — statische analyse voltooid. iOS PowerPoint UI-verificatie is essentieel voor release-gate.

---

## Samenvatting

- **Geslaagd:** 18 criteria (design 5 + didactiek 6 + tech 7)
- **Blocking (uniek):** 5 — (1) duck tokens engine-breed, (2) "Animatievenster" ontbreekt in iOS PowerPoint, (3) "Zetelen" niet bestaande overgang, (4) dubbele rode badge, (5) ontbrekende `learningObjectives` (didactische eis — zie didactiek BLOCKING-DD1)
- **Aanbeveling: fix-eerst**
- **Release-gate status: BLOCKED** — inhoudelijke correctheidsfouten in stap 3-4 + visuele QA ontbreekt

**Top 3 issues:**
1. `slide-specialist.ts:83` — "Zetelen" → "Schuiven" (non-existent overgang, leerling kan stap 4 niet voltooien)
2. `slide-specialist.ts:71` — "Animatievenster" → "Afspelen / Diavoorstelling" (bestaat niet op iPad PowerPoint)
3. `slide-specialist.ts:110-117` — badge[1].color `'#ff3c21'` → `'#202023'` (twee niveaus visueel identiek in rood)

---

## Codex-gate (M1)

**Datum:** 2026-06-14
**Model:** gpt-5.5 · effort xhigh
**Verdict: BLOCK**

### Bevindingen (Codex)

**[HIGH] Interne inconsistentie — `learningObjectives` blocker-status tegenstrijdig**
De didactiek-sectie classificeerde ontbrekende `learningObjectives` als aandachtspunt ("Geen" blocking issues), terwijl de samenvatting hetzelfde punt als uniek blocking issue telde. Engineers konden hierdoor niet vaststellen of dit een release-blokker is of een kwaliteitsverbetering. **Fix toegepast:** `learningObjectives` is nu als BLOCKING-DD1 opgenomen in de didactiek-sectie (conform de andere 4 J1-P1 missies en de samenvatting).

**[MEDIUM] Criterium 3 (design) geclaimed als volledig geslaagd terwijl focus-ring blocking is**
De design-sectie markeerde criterium 3 als geslaagd ("alle knoppen hebben labels, hover-states en focus-visible ringen"), maar blocking issues D1 en D2 stellen dat `focus-visible:ring-duck-coral` onzichtbaar is en WCAG 2.1 AA 2.4.7 schendt. **Fix toegepast:** criterium 3 is nu als "gedeeltelijk" gemarkeerd met expliciete verwijzing naar D1/D2.

### Gevalideerde claims
- ✅ Bevinding BLOCKING-D4 ("Animatievenster" ontbreekt in iOS PowerPoint) bevestigd door Codex via broncodecheck.
- ✅ Bevinding BLOCKING-D5 ("Zetelen" niet-bestaande PowerPoint-overgang) bevestigd.
- ✅ Engine-brede duck-token bevinding bevestigd via `tailwind.shared.js` — `coral`, `muted`, `line`, `creamDeep` ontbreken.

### Release-gate status
**BLOCKED** — inhoudelijke correctheidsfouten (stap 3 + 4), interne inconsistenties gecorrigeerd, visuele QA iOS PowerPoint nog vereist.

### Next steps (vóór ship)
1. `slide-specialist.ts:83` — "Zetelen" → "Schuiven"
2. `slide-specialist.ts:71` — "Animatievenster" → "Afspelen / Diavoorstelling"
3. `slide-specialist.ts:110-117` — badge[1].color `'#ff3c21'` → `'#202023'`
4. `slide-specialist.ts:104` — `maxScore: 60` → `maxScore: 55`
5. `slide-specialist.ts` — voeg `learningObjectives`-array toe
6. `tailwind.shared.js` — duck-namespace tokens (engine-breed, deblokkeert alle 5 missies)
7. Echte iPad-check: iOS PowerPoint Animaties-tab verificatie
