# Rubric-review — De Data Handelaar (data-handelaar)

**Datum:** 2026-08-25
**templateType:** puzzle-lab
**Curriculum-plek:** Leerjaar 1, Periode 3
**SLO-claim:** 23A, 23C (regulier) · 20A, 20B (VSO)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

### ✅ Geslaagd
- **Criterium 2 (layout):** geen eigen layout-code — alle rendering komt uit de gedeelde `PuzzleLab.tsx`-engine, dus consistent met andere puzzle-lab-missies.
- **Criterium 6 (motion):** geen eigen animatiecode in de config; engine-niveau motion valt buiten deze missie-review.

### ⚠️ Aandachtspunten
- **Criterium 4 (copy-lengte, leerjaar 1)**: `bewijsstuk-a.description` en `bewijsstuk-b.description` overschrijden de grens van <60 woorden voor een leerjaar-1-opdracht — `src/features/missions/templates/puzzle-lab/configs/data-handelaar.ts:15` en `:41`.
  - **Wat:** `bewijsstuk-a` bevat een volledig e-mailcitaat + vraag (~95 woorden), `bewijsstuk-b` een volledig klantprofiel + vraag (~75 woorden).
  - **Waarom:** leerjaar-1-leerlingen (12-13 jaar) verliezen focus bij een muur tekst vóór de eigenlijke vraag; het bronmateriaal (case-study) is didactisch verdedigbaar maar de lengte is niet geflagd of gecompenseerd met opmaak.
  - **Voorstel:** splits het bronmateriaal visueel van de vraag (bv. `clues[0]` al tonen als "leeswijzer"), of verkort het citaat tot de kernzin die de overtreding bevat.
- **Criterium 7 (toegankelijkheid, kleurcontrast):** valt samen met de reeds beoordeelde engine-bevinding over `hover:text-duck-ink`/`hover:bg-duck-ink` (zie engine-rapport `PuzzleLab.tsx:460`) — deze missie gebruikt de hint- en overslaan-knoppen net als elke andere puzzle-lab-config, dus het contrastprobleem raakt ook `data-handelaar` bij elke puzzel.

### ❌ Blocking issues
- **Visual Precision Gate**: unverified — geen Chrome-plugin-bewijs beschikbaar in deze pass (geen dev-server/browserverificatie uitgevoerd). Noteer als open punt, geen blocking-oordeel zonder bewijs.

### Score
5/7 criteria geslaagd (2 n.v.t. door ontbreken eigen UI-code) · Aanbeveling: fix-eerst

---

## 📚 Didactiek review

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `23A` (Veiligheid & privacy) en `23C` (Maatschappij) zijn geldige regulier-codes; `20A`/`20B` geldige VSO-codes — `src/config/slo-kerndoelen-mapping.ts:77`.
- **Criterium 2 (SLO-fit):** de missie behandelt doelbinding, bijzondere persoonsgegevens, minderjarigenbescherming en rechten van betrokkenen — dit raakt beide geclaimde kerndoelen substantieel, niet oppervlakkig.
- **Criterium 6 (curriculum-plek):** leerjaar 1, periode 3 in `curriculum.ts:117` sluit aan bij yearGroup:1 in de SLO-mapping; staat naast vergelijkbare privacy/veiligheidsmissies (`cookie-crusher`, `mail-detective`) in dezelfde periode — logische opbouw.
- **Criterium 7 (Bloom-balans):** goede mix — bewijsstuk-a/b vragen analyseren ("welke overtreding is PRIMAIR"), rechten-betrokkenen vraagt toepassen, rapport-conclusie vraagt creëren (eigen samenvatting formuleren). Niet louter onthouden-quiz.
- **Criterium 9 (welzijn/inclusiviteit):** VSO-mapping aanwezig; het gevoelige onderwerp (een 14-jarig personage dat wordt geprofileerd) wordt feitelijk en niet beschuldigend behandeld, gericht op het bedrijf als dader, niet op het kind.

### ⚠️ Aandachtspunten
- **Criterium 3 (leerdoelen helder)**: geen expliciet `learningObjectives`-veld — `src/features/missions/templates/puzzle-lab/configs/data-handelaar.ts:1-15`.
  - **Wat:** de missie heeft alleen `introDescription` en `introFeatures`, geen apart leerdoel-veld met actiewerkwoorden.
  - **Waarom:** `missionGoals.ts` vangt dit gedeeltelijk op (`primaryGoal: 'Ik beoordeel datasituaties op privacy, toestemming en eerlijk gebruik.'`, `src/config/missionGoals.ts:267`), dus impliciet leerdoel is aanwezig en voldoende concreet — geen kritieke bevinding, wel een aandachtspunt voor consistentie met missies die wél een `learningObjectives`-array in de config hebben.
  - **Voorstel:** geen actie nodig; `missionGoals.ts`-entry dekt dit criterium afdoende.
- **Criterium 4 (copy-lengte)**: zie design-review hierboven — dezelfde twee opdrachtbeschrijvingen overschrijden de leerjaar-1-grens.
- **Criterium 5 (vocabulary)**: termen als "doelbinding", "bijzondere persoonsgegevens" en "profilering" zijn correct AVG-jargon maar worden pas in de `successMessage` uitgelegd, ná het antwoorden — `src/features/missions/templates/puzzle-lab/configs/data-handelaar.ts:22`. Voor leerjaar 1 is dat aanvaardbaar zolang de `clues` de begrippen voordoen (wat hier het geval is), dus geen fail — wel een randgeval.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **23A (Veiligheid & privacy):** sterk geraakt — alle vier puzzels draaien om AVG-overtredingen, rechten van betrokkenen en gevoelige data.
- **23C (Maatschappij):** sterk geraakt — de missie behandelt de maatschappelijke rol van toezichthouders (Autoriteit Persoonsgegevens) en de machtsverhouding bedrijf-burger.

### Score
7/9 criteria expliciet geslaagd, 2 randgevallen zonder fail · Bloom-balans: medium-hoog · Aanbeveling: ship (met de copy-lengte-opmerking als optionele verbetering)

---

## 🔧 Tech review

**Dynamic verificatie:** niet uitgevoerd — geen dev-server/browserverificatie in deze pass; engine-bevindingen (zie hieronder) zijn overgenomen uit de reeds afgeronde engine-review.

### Static analyse — missie-specifiek
#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore` in `data-handelaar.ts`; `validator` op `rapport-conclusie` is correct getypeerd (`(input: string) => boolean`).
- **Criterium A4 (imports):** config importeert alleen het gedeelde `PuzzleLabConfig`-type via relatief pad binnen dezelfde template-map (`../puzzleLabTypes`), conform het patroon van zustermissies — geen `@/*`-schending, want dit is de gebruikelijke stijl binnen `templates/puzzle-lab/configs/`.

#### ⚠️ Aandachtspunten (overgenomen engine-bevindingen die déze missie concreet raken)
- **Scoring niet gokbestendig** (engine-bevinding, `PuzzleLab.tsx:131`): `bewijsstuk-a`, `bewijsstuk-b` en `rechten-betrokkenen` zijn elk multiple-choice met **4 opties** en `maxAttempts: 3` — precies het patroon dat de engine-review als "structureel gokbaar" aanmerkt (3 pogingen op 4 opties ⇒ leerling haalt bijna gegarandeerd de volle 25 punten zonder AVG-kennis). Raakt `src/features/missions/templates/puzzle-lab/configs/data-handelaar.ts:32,58,84` (`maxAttempts: 3`).
  - **Voorstel (mission-scope mitigatie, geen structurele fix):** verlaag `maxAttempts` naar 2 zodat blind gokken op 4 opties niet meer bijna gegarandeerd slaagt. Dit lost het onderliggende scoringsprobleem niet volledig op (dat zit in de engine — `totalScore` telt geen strafpunten per foute poging) maar vermindert de gok-kans van deze missie tot dat er een engine-fix komt.
- **Completion-trap bij lage score** (engine-bevinding, `PuzzleLab.tsx:271`): een leerling die bij `data-handelaar` alle 4 puzzels overslaat of vastloopt, komt op het eindscherm zonder werkende knop terecht — dit is een engine-bug die alle puzzle-lab-missies raakt, inclusief deze. Geen missie-specifieke fix mogelijk (buiten whitelist-scope); reeds gerapporteerd in het engine-rapport.
- **Hint-bug** (engine-bevinding, `PuzzleLab.tsx:456`): `hintCost: 4` op de eerste drie puzzels en `hintCost: 3` op de vierde worden potentieel betaald voor informatie die al gratis zichtbaar is zodra `extraClues` ontgrendeld zijn — engine-niveau, geen missie-fix nodig.

#### ❌ Blocking issues
- Geen missie-specifieke blocking issues bovenop de reeds gerapporteerde engine-blockers (scoring, completion-trap, autosave-validate) — die zijn engine-breed en al vastgelegd in het engine-rapport; deze missie erft ze zonder eigen verzwarende factor, behalve de expliciete 4-opties/3-pogingen combinatie hierboven.

### Score
Static: 2/2 missie-eigen criteria geslaagd · Dynamic: n.v.t. (geen dev-server) · Aanbeveling: fix-eerst (engine-afhankelijk; missie-eigen `maxAttempts`-tweak is een goedkope mitigatie vooruitlopend op de engine-fix)

---

## Voorstellen

### Voorstel 1 — maxAttempts verlagen om gokbestendigheid te verbeteren (mitigatie, geen volledige fix)

```ts
// ❌ Huidig — src/features/missions/templates/puzzle-lab/configs/data-handelaar.ts:32
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
```

```ts
// ✅ Voorgesteld (toepassen op alle drie multiple-choice puzzels: regels 32, 58, 84)
            caseSensitive: false,
            maxAttempts: 2,
            points: 25,
```

**Scope:** 3 regels (`maxAttempts: 3` → `maxAttempts: 2` op `bewijsstuk-a`, `bewijsstuk-b`, `rechten-betrokkenen`). Lost het gok-probleem niet structureel op — dat vereist een engine-fix (straf per foute poging) — maar vermindert de kans dat een leerling zonder kennis toch de volle score haalt.

### Voorstel 2 — copy-lengte bewijsstukken (optioneel, geen blocking)

```ts
// Huidig — data-handelaar.ts:15 (bewijsstuk-a.description)
'Je onderschept een interne e-mail bij DataDeal BV:\n\n---\n**Van:** directeur@datadeal.nl\n**Aan:** verkoop@datadeal.nl\n\n*"Hi team, we hebben van FitTrack 50.000 gebruikersprofielen ontvangen — locatiedata, hartslag en slaappatronen. De gebruikers weten hier niks van maar dat hoeft ook niet — ze hebben de algemene voorwaarden geaccepteerd. Verkoop ze door aan verzekeraar HealthPlus."*\n\n---\n\nWelke overtreding van de AVG is dit PRIMAIR?'
```

```ts
// Voorgesteld — kern van het citaat behouden, vraag scheiden
'Je onderschept een interne e-mail bij DataDeal BV:\n\n---\n*"We hebben van FitTrack 50.000 gebruikersprofielen ontvangen — locatiedata, hartslag, slaappatronen. Gebruikers weten dit niet, maar ze accepteerden de algemene voorwaarden. Verkoop door aan verzekeraar HealthPlus."*\n\n---\n\nWelke overtreding is dit PRIMAIR?'
```

Niet opgenomen in `autoFixable` (subjectieve tekstredactie, geen mechanische 1-op-1 vervanging) — ter overweging voor Yorin.

---

## Samenvatting & verdict

`data-handelaar` is inhoudelijk een sterke, goed op leerjaar-1 SLO 23A/23C aansluitende AVG-missie met een logische opbouw (feiten → primaire overtreding → minderjarigenbescherming → rechten → eigen conclusie schrijven) en een gepast Bloom-niveau. De belangrijkste risico's zijn niet missie-eigen maar erven van de gedeelde puzzle-lab-engine (gokbestendigheid, completion-trap, hint-bug) — die zijn al vastgelegd in het engine-rapport en niet hier opnieuw op te lossen. Missie-eigen verbeterpunten zijn beperkt tot copy-lengte (2 lange opdrachtbeschrijvingen boven de leerjaar-1-grens) en een goedkope `maxAttempts`-mitigatie tegen het gok-risico.

**Verdict: fix-eerst** — niet vanwege een missie-eigen blocker, maar omdat de missie de engine-brede scoring-bug (Voorstel 1 als tussenoplossing) en completion-trap erft; zodra de engine-fix landt kan deze missie zonder verdere wijziging naar `ship`.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
