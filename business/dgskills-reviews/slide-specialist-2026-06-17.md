# Missie-review: Slide Specialist

**Mission ID:** slide-specialist
**Template:** tool-guide
**Curriculum-plek:** Leerjaar 1, Periode 1
**Datum:** 2026-06-17
**Vorige review:** 2026-06-14 (BLOCKED)
**Reviewer-pipeline:** dgskills-mission-review v1.1
**Verdict:** BLOCKED — alle 7 blockers uit de vorige review staan nog open; geen fix is doorgevoerd.

---

## Status t.o.v. vorige review (2026-06-14)

| # | Issue | Status |
|---|-------|--------|
| BLOCKING-D1/T2 | duck-* tokens ontbreken in tailwind.shared.js (engine-breed) | **Nog open** |
| BLOCKING-D3 | badge[1].color `#ff3c21` (dubbel rood) | **Nog open** |
| BLOCKING-D4 | "Animatievenster" bestaat niet in iOS PowerPoint | **Nog open** |
| BLOCKING-D5 | "Zetelen" is geen bestaande overgang | **Nog open** |
| BLOCKING-DD1 | `learningObjectives`-array ontbreekt | **Nog open** |
| ⚠️ maxScore:60 vs engine-max 55 | niet-blocking, maar 100% onbereikbaar | **Nog open** |
| ⚠️ stap 2 instruction >60 woorden | 62w (grens: 60) | **Nog open** |

Alle bevindingen en before/after snippets uit 2026-06-14 blijven geldig en worden hieronder volledigheidshalve herhaald, aangevuld met twee nieuwe bevindingen die de vorige review niet rapporteerde.

---

## 🎨 Design review

### ✅ Goed

- Lay-out consistent met magister-master (PhaseHeader + StepCard + next-knop, `max-w-md mx-auto`). — `ToolGuide.tsx:543-544`
- Alle knoppen hebben labels, hover-states en tekst-labels (geen icon-only zonder aria-label). — `ToolGuide.tsx:405-413`
- Copy stap 1 (59w), stap 3 (53w), stap 4 (54w): binnen jr1-grens van 60w. — `slide-specialist.ts:20,62,75`
- Responsive: `w-full max-w-md`, geen vaste pixel-breedtes. — `ToolGuide.tsx:163,543`
- Geen Framer Motion (intentioneel absent in tool-guide — correct). — `ToolGuide.tsx` volledig
- Intro-beschrijving 26 woorden — ruim binnen 80w jr1-grens. — `slide-specialist.ts:8-11`

### ⚠️ Aandachtspunten

- **Stap 1 — "klik" i.p.v. "tik" (touchscreen-taal):**
  - `slide-specialist.ts:23`: "klik er een aan" — alle andere stappen gebruiken "tikken."
  - Voorstel:
    ```ts
    // slide-specialist.ts:23 — was:
    'klik er een aan om een voorbeeld te zien.'
    // wordt:
    'tik er een aan om een voorbeeld te zien.'
    ```

- **Stap 2 — copy 62 woorden (grens 60w voor jr1):**
  - `slide-specialist.ts:47`: de haakjesgroep "Of tik lang op een slide en kies 'Dia dupliceren' of 'Nieuwe dia'" maakt de instructie te lang en biedt twee routes tegelijk.
  - Voorstel: verwijder alternatieve route, blijft ~46w.

- **Stap 2 — afbeelding zonder auteursrechtsturing:**
  - `slide-specialist.ts:51`: "Voeg een afbeelding in via Invoegen > Afbeeldingen" — geen instructie over bronkeuze.
  - Voorstel: verwijs naar PowerPoint's eigen Online afbeelding-bibliotheek of schoolfoto's.

- **Visuele verificatie:** geen screenshots aanwezig. Pas uitvoeren na iOS PowerPoint-fix (zie D4/D5).

### ❌ Blokkers

- **BLOCKING-D1 (engine-breed):** `duck-coral`, `duck-muted`, `duck-line`, `duck-creamDeep` ontbreken in `tailwind.shared.js`. Alle kleur-afhankelijke StepCard-elementen renderen transparant. WCAG-impact: zie D2. Fix in engine, niet in missie-config.

- **BLOCKING-D2 (engine-breed):** `focus-visible:ring-duck-coral` onzichtbaar door D1 — WCAG 2.1 AA 2.4.7 schending. Fix in engine.

- **BLOCKING-D3 — Dubbele rode badge-kleur:**
  - `slide-specialist.ts:110-117`: "Presentatie Expert" (≥55) én "Slide Specialist" (≥40) hebben beide `color: '#ff3c21'` — zelfde kleur als `duck-error`. Twee succesbadges zijn visueel ononderscheidbaar en rood is semantisch negatief in onderwijs-UI.
  - Voorstel:
    ```ts
    // slide-specialist.ts:113-116 — was:
    { minScore: 40, emoji: '🎨', title: 'Slide Specialist', color: '#ff3c21' },
    // wordt:
    { minScore: 40, emoji: '🎨', title: 'Slide Specialist', color: '#202023' },
    ```

- **BLOCKING-D4 — "Animatievenster" bestaat niet in PowerPoint voor iPad:**
  - `slide-specialist.ts:71`: "Tik op **Animatievenster** of **Afspelen**" — het Animatievenster is een desktop-only feature (Windows/Mac); bestaat niet in PowerPoint iOS. Leerlingen kunnen stap 3 niet voltooien.
  - Voorstel:
    ```ts
    // slide-specialist.ts:71 — was:
    'Tik op **Animatievenster** of **Afspelen** om je animatie te testen.'
    // wordt:
    'Tik op **Afspelen** om je animatie te testen, of start de **Diavoorstelling** om het live te zien.'
    ```

- **BLOCKING-D5 — "Zetelen" is geen bestaande PowerPoint-overgang:**
  - `slide-specialist.ts:83`: "bijv. **Fade**, **Zetelen** of **Doelwit**" — "Zetelen" bestaat niet in PowerPoint (ook niet in de Nederlandse versie). Leerlingen kunnen het niet vinden.
  - Voorstel:
    ```ts
    // slide-specialist.ts:83 — was:
    'bijv. **Fade**, **Zetelen** of **Doelwit**'
    // wordt:
    'bijv. **Vervaag**, **Schuiven** of **Doelwit**'
    ```

**Score: 6/9 criteria geslaagd · fix-eerst**

---

## 📚 Didactiek review

### ✅ Goed

- SLO-codes `21A`, `22A`, `18A`, `19A` zijn alle geldige codes. — `slo-kerndoelen-mapping.ts:31`
- `missionGoal` ontbreekt in config maar is aanwezig in `missionGoals.ts:31` — engine valt correct terug via `getMissionGoal('slide-specialist')`. `primaryGoal` is actief geformuleerd ("Ik maak..."). — `missionGoals.ts:31`
- SLO-fit 22A sterk: missie bouwt naar één afgerond presentatieproduct met expliciete kwaliteitscriteria (consistente stijl, tekst-economie, animatie-spaarzaamheid). — `slide-specialist.ts:1-134`
- Leeftijdspassend vocabulary: "thema", "animatie", "overgang" worden in context uitgelegd. Tone-of-voice passend voor leerjaar 1. — `slide-specialist.ts:8`
- Curriculum-plaatsing klopt: j1-p1 naast magister-master/cloud-commander/word-wizard/print-pro. — `curriculum.ts:70`
- VSO-mapping aanwezig en passend: `18A`, `19A`. — `slo-kerndoelen-mapping.ts:31`
- Geen `enableChat` → AI-as-copilot niet van toepassing; checklist+verificatievragen bewaken zelfstandig leren.

### ⚠️ Aandachtspunten

- **SLO-fit 21A oppervlakkig:** 21A vereist systeembegrip (bestandsformaten, cloudopslag, apparaatrol). De missie behandelt uitsluitend design-beslissingen. Voorstel: voeg aan stap 1 een OneDrive-opslagstap toe + verificationQuestion over cloudopslag — koppeling aan cloud-commander.

- **Bloom 1-2 only:** Alle 3 verificationQuestions zijn recall/begrip (Bloom 1-2). Geen evaluatie- of toepassingsvraag.
  - Voorstel stap 4: "Je vriend heeft bij elke slide een andere overgang. Wat zou jij hem adviseren en waarom?" (Bloom 3-4)

- **Curriculum-progressie stap:** slide-specialist herhaalt 22A op hetzelfde Bloom-niveau als word-wizard — geen zichtbare moeilijkheidsgraad-verhoging. Voorstel: voeg vergelijkingsvraag toe (presentatie vs. verslag).

- **Afbeelding stap 2 zonder bronvermelding:** geen instructie over auteursrecht of welk type afbeelding te gebruiken. (Zie ook design ⚠️.)

- **primaryGoal vs introDescription mismatch (nieuw):** `missionGoals.ts:31` zegt "korte presentatie" en "kernwoorden"; `introFeatures` in de config beschrijft juist animaties en overgangen — iets uitgebreider dan de doelstelling suggereert. Geen harde blocker, maar inconsistent voor leerlingen die de intro lezen.

### ❌ Blokkers

- **BLOCKING-DD1 — Geen `learningObjectives`:** Config heeft geen `learningObjectives`-veld. `takeaways` zijn leerling-reflecties, geen Bloom-geformuleerde toetsbare leerdoelen. Alle andere j1-p1 missies hebben dit veld. Zonder dit veld heeft de docent geen meetbare doelstelling om aan te koppelen in rapportage.
  - Voorstel:
    ```ts
    // slide-specialist.ts — toevoegen na takeaways:
    learningObjectives: [
        'De leerling selecteert een passend thema en legt uit waarom consistente opmaak professioneler oogt.',
        'De leerling bouwt een slide op met ≤5 tekstelementen en één ondersteunende afbeelding.',
        'De leerling voegt één animatie toe aan een element en stelt de timing in.',
        'De leerling past één overgangstype toe op alle slides en verklaart waarom consistentie helpt.',
    ],
    ```

**Score: 6/9 criteria geslaagd · Bloom 1-2 dominant · fix-eerst**

---

## 🔧 Tech review

### ✅ Goed

- Alle onClick-handlers correct gekoppeld aan state-mutaties. Geen dode knoppen. — `ToolGuide.tsx:472-508`
- Loading/error/empty correct afgehandeld: `LoadingScreen`, `loadError`-state, lege config → error UI. — `ToolGuide.tsx:582-604`
- Geen `: any` of `@ts-ignore` zonder reden. — `ToolGuide.tsx` volledig
- `@/*`-imports consequent gebruikt. — `ToolGuide.tsx:3-9`
- Geen Supabase edge function calls in deze config. — `slide-specialist.ts` volledig
- Restart-safe: `useMissionAutoSave` correct ingezet; `clearSave()` bij completion. — `ToolGuide.tsx:438,511`
- `promptSanitizer` n.v.t. — geen user-input naar AI in deze missie.
- Geen `dangerouslySetInnerHTML`. — `ToolGuide.tsx` volledig
- `correctIndex`-waarden geverifieerd:

| Stap | correctIndex | Antwoord | Klopt? |
|------|-------------|----------|--------|
| Stap 1 (r.37) | 1 | "Consistente, professionele opmaak..." | ✅ |
| Stap 2 (r.60) | 1 | "Drie tot vijf korte punten..." | ✅ |
| Stap 4 (r.97) | 1 | "Rustig en professioneel..." | ✅ |

- Score-logica klopt per stap: CHECKLIST_POINTS_PER_STEP(10) + QUESTION_BONUS(5). Stap 3 heeft geen verificationQuestion → max 10pt. Totaal: 15+15+10+15 = **55pt**. — `ToolGuide.tsx:64-83`

### ⚠️ Aandachtspunten

- **maxScore: 60 vs engine-berekend max 55 (niet-blocking):** Leerlingen zien nooit 100% — hoogste haalbare score is 55/60 = 92%.
  - `slide-specialist.ts:104`
  - Voorstel: `maxScore: 55`

- **badge[1].color `#ff3c21` (zie ook design D3):** foutkleur op successcherm.
  - Voorstel: `badge[1].color: '#202023'`

- **RichText op incorrect-feedback (nieuw):** Regel `ToolGuide.tsx:157-159` levert fout-feedbacktekst op door de uitleg te strippen met `replace(/^(Precies|Goed|Juist|Goed gedacht)!\s*/i, '')`. Als een uitleg-tekst begint met een andere bevestiging (bv. "Exact!") wordt die niet gestript en blijft de positieve opener staan in een negatief-feedback-kader. Geen blocker nu, maar kwetsbaar bij config-uitbreidingen.

### ❌ Blokkers

- **BLOCKING-T2 (engine-breed):** duck-* tokens afwezig in `tailwind.shared.js`. Identiek aan D1/D2. Fix in engine.

**Score: Static 7/7 · Engine-blokker openstaand · fix-eerst**

---

## Samenvatting

- **Geslaagd:** 19 criteria (design 6 + didactiek 6 + tech 7)
- **Unieke blokkers:** 5 — (1) duck-tokens engine-breed, (2) "Animatievenster" ontbreekt in iOS PowerPoint, (3) "Zetelen" niet-bestaande overgang, (4) dubbele rode badge, (5) ontbrekende `learningObjectives`
- **Nieuwe bevindingen (niet in 2026-06-14):** primaryGoal/introDescription-mismatch (⚠️ didactiek), RichText-regex kwetsbaarheid bij fout-uitleg (⚠️ tech)
- **Aanbeveling: fix-eerst**
- **Release-gate status: BLOCKED** — stap 3 en stap 4 bevatten niet-bestaande UI-elementen in iOS PowerPoint; leerlingen kunnen de missie niet voltooien

**Top 3 issues:**
1. `slide-specialist.ts:83` — "Zetelen" → "Vervaag / Schuiven" (leerling kan stap 4 niet voltooien — overgang bestaat niet)
2. `slide-specialist.ts:71` — "Animatievenster" → "Afspelen / Diavoorstelling" (bestaat niet op iPad PowerPoint — stap 3 onuitvoerbaar)
3. `slide-specialist.ts` — voeg `learningObjectives`-array toe (vereist door alle andere j1-p1 missies; ontbreekt als enige)

**Next steps vóór ship (prioriteitsvolgorde):**
1. Fix BLOCKING-D4: "Animatievenster" → "Afspelen / Diavoorstelling" (`slide-specialist.ts:71`)
2. Fix BLOCKING-D5: "Zetelen" → "Vervaag, Schuiven" (`slide-specialist.ts:83`)
3. Fix BLOCKING-D3: badge[1].color `#ff3c21` → `#202023` (`slide-specialist.ts:114`)
4. Fix BLOCKING-DD1: voeg `learningObjectives`-array toe (`slide-specialist.ts`)
5. Fix engine-breed: duck-namespace tokens in `tailwind.shared.js` (deblokkeert alle j1-p1 missies)
6. Fix ⚠️ maxScore: `60` → `55` (`slide-specialist.ts:104`)
7. Visuele QA op echte iPad na fixes 1-2 (iOS PowerPoint Animaties-tab verificatie)
