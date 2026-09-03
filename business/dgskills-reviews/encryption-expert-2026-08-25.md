# Missie-review: Encryptie Expert (`encryption-expert`)

**Datum:** 2026-08-25
**TemplateType:** puzzle-lab
**Wave:** 22 (batch-review sweep)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 6/10

### Geslaagd
- Consistente puzzle-lab-structuur (4 puzzels, oplopende clue-escalatie, badge-tiers) volgt hetzelfde patroon als andere puzzle-lab-missies.
- Copy is kort en to-the-point per puzzel, past bij leerjaar 3.
- Badge-set (4 tiers, 0/40/70/90) volgt het standaardpatroon van deze template.

### Aandachtspunten
- **Geen missiespecifiek design-issue gevonden in de config zelf** — de config bevat alleen content (titel, clues, opties), geen styling. De structurele UI-gebreken zitten in de gedeelde engine (zie hieronder), niet in deze config.
- Erft van de engine (`PuzzleLab.tsx`, al beoordeeld, hier alleen genoemd voor zover deze missie het concreet raakt):
  - Puzzel 3 (`public-key`, multiple-choice, 4 opties, `maxAttempts: 3`) is het schoolvoorbeeld van de engine-bevinding "gokbestendigheid": een leerling die blind klikt heeft in 3 van de 4 gevallen de volle 25 punten binnen vóór de pogingen op zijn.
  - Focus-verlies na MC-antwoord (engine-bevinding, toegankelijkheid) raakt specifiek deze puzzel, want het is de enige MC-puzzel in de missie.
  - Hover-contrastbug (`text-duck-gray/70 hover:text-duck-ink` op `bg-duck-ink`) raakt de hint-knop die bij alle 4 puzzels van deze config wordt getoond.

### Voorstel
Geen missiespecifieke design-fix nodig binnen de whitelist-scope van deze review — de gevonden problemen zitten allemaal in de gedeelde `PuzzleLab.tsx`-engine en zijn al gerapporteerd in de engine-review.

---

## Didactiek — score 7/10

### Geslaagd
- Heldere leerlijn: klassieke code (Caesar) → transportcodering (Base64, met expliciete waarschuwing "geen echte encryptie") → asymmetrische encryptie (publiek/privé) → toepassing (sterk wachtwoord). Dit is een logische opbouw van laag naar hoog abstractieniveau.
- Elke `successMessage` herhaalt het onderliggende principe in plain taal ("Base64 beschermt NIKS", "alleen Liam kan het bericht lezen") — goede reinforcement.
- `takeaways` vat de 4 kernconcepten correct en bondig samen, sluit aan bij SLO 23A (veilig omgaan met technologie/data).
- Scaffolding via `clues` → `extraClues` (na X mislukte pogingen) geeft leerlingen een eerlijke kans zonder het antwoord meteen weg te geven.

### Aandachtspunten
- **Puzzel 1 (`caesar-crack`) geeft het antwoord feitelijk al weg in de basis-`clues`.** De derde clue luidt: "Y → V, H → E, L → I, O → L, L → I, J → G" — dat spelt het woord VEILIG letter voor letter uit, zónder dat de leerling ook maar één poging hoeft te wagen of zelf hoeft te rekenen. Dit ondermijnt het leerdoel "kraak een Caesar-cijfer" volledig: de puzzel test dan alleen overtypen, geen decodeervaardigheid.
- **Puzzel 2 (`base64-decode`) heeft hetzelfde probleem in mindere mate.** De derde basis-clue geeft al "w, a, c, h" en de eerste extra-clue geeft de rest van de letters ("t, w, o" en "o, r, d") — het woord is dan al voor 100% herleid vóórdat de leerling zelf iets hoeft te doen.
- Bij puzzel 4 (`strong-password`) is de validator strikt op regex-niveau maar controleert niet of het wachtwoord een van de drie voorbeeldwachtwoorden uit de clues letterlijk overneemt (`IkHoud2VanPizza!`, `MijnHond@Heet5Bobby`, `T!ger$7Rend3r`, `Rood#Fiets9Boom!`) — een leerling kan zonder zelf na te denken een van de clue-voorbeelden 1-op-1 kopiëren en de puzzel oplossen zonder het principe te begrijpen.

### Voorstel

**Bestand:** `src/features/missions/templates/puzzle-lab/configs/encryption-expert.ts`

Voor (regel ~26-30, puzzel `caesar-crack`):
```ts
clues: [
    'Het gecodeerde bericht is: YHLOLJ',
    'De schuif is 3 — elk letter is 3 posities naar rechts verschoven.',
    'Y → V, H → E, L → I, O → L, L → I, J → G',
],
```

Na:
```ts
clues: [
    'Het gecodeerde bericht is: YHLOLJ',
    'De schuif is 3 — elk letter is 3 posities naar rechts verschoven.',
    'Reken zelf: verschuif elke letter 3 posities TERUG in het alfabet (bijvoorbeeld Y wordt V). Doe dit voor alle 6 letters.',
],
```
(De letterlijke omzetting Y→V, H→E, L→I, O→L, L→I, J→G kan in `extraClues` blijven staan — daar hoort een volledige uitwerking wél thuis, na een aantal mislukte pogingen.)

Voor (regel ~59-63, puzzel `base64-decode`):
```ts
clues: [
    'Base64 is geen echte encryptie — iedereen kan het decoderen.',
    'd2FjaHR3b29yZA== is het gecodeerde woord.',
    'Plak de code in een Base64-decoder als je één hebt. Of: de eerste 4 tekens "d2Fj" staan voor de letters w, a, c, h.',
],
```

Na:
```ts
clues: [
    'Base64 is geen echte encryptie — iedereen kan het decoderen.',
    'd2FjaHR3b29yZA== is het gecodeerde woord.',
    'Plak de code in een Base64-decoder als je één hebt, of zoek op hoe Base64-tekens naar letters worden omgezet.',
],
```
(Verplaats de letterlijke decodering "d2Fj → w,a,c,h" naar `extraClues`, zodat die pas verschijnt na `revealExtraAfterAttempts`.)

---

## Tech — score 5/10

### Geslaagd
- Wiring is compleet en consistent over alle vier bronbestanden: `templateRegistry.ts` (`puzzle-lab`), `slo-kerndoelen-mapping.ts` (SLO 23A, leerjaar 3, week 2), `curriculum.ts` (leerjaar 3 → periode 2 → Cybersecurity & Privacy), `missionGoals.ts` (primaryGoal + score-threshold 70 + evidence). Geen missing/mismatched `missionId`.
- `strong-password`-validator (regex-check op lengte, hoofdletter, cijfer, speciaal teken, geen puur alfabetische string) is functioneel correct en client-side veilig (geen secrets, geen server-roundtrip nodig).
- Config bevat geen hardcoded secrets, geen dode imports, geen ongebruikte velden.

### Aandachtspunten
- **Erft rechtstreeks de blocking engine-bevindingen van `PuzzleLab.tsx`** (al gerapporteerd, hier alleen de concrete impact op déze missie):
  - `missionGoals.ts` zet de score-drempel op **70** voor deze missie, terwijl de engine de CompletionScreen-pass-drempel op **40%** hardcodeert en zonder `onRetry` aanroept. Een leerling die tussen 40 en 69 punten scoort krijgt hier dus een "geslaagd"-completion-scherm te zien, maar de missie telt volgens `missionGoals.ts` niet als voldaan aan het primaryGoal — een inconsistente signaal tussen UI en voortgangsregistratie. Dit is geen missie-config-bug (de drempel-mismatch zit in hoe de engine en `missionGoals.ts` los van elkaar drempels hanteren) maar treft deze missie merkbaar omdat 70 fors boven de 40%-enginedrempel ligt.
  - Puzzel `public-key` (multiple-choice, 4 opties, `maxAttempts: 3`) is exact het scenario waarin de engine-gokbestendigheid-bug het hardst toeslaat: een leerling kan de 25 punten van deze puzzel met ~75% kans behalen door drie keer willekeurig te klikken, zonder de asymmetrische-encryptie-uitleg te lezen.
- **Geen missiespecifieke tech-bug gevonden** buiten wat al in de engine zit — de config zelf (`answer`, `validator`, `points`, `maxAttempts` per puzzel) is intern consistent en telt correct op tot `maxScore: 100` (4×25).

### Voorstel
Binnen de whitelist van deze missie is er geen mechanische fix beschikbaar voor de score-drempel-mismatch of de gok-bestendigheid — beide zitten in de gedeelde `PuzzleLab.tsx`-engine, niet in `encryption-expert.ts`. Enige config-niveau mitigatie die wél binnen scope valt: verlaag `maxAttempts` van puzzel `public-key` zodat blind gokken minder kans krijgt.

Voor (regel ~99):
```ts
answer: 'Alleen Liam, want hij heeft de privésleutel',
caseSensitive: false,
maxAttempts: 3,
```

Na:
```ts
answer: 'Alleen Liam, want hij heeft de privésleutel',
caseSensitive: false,
maxAttempts: 2,
```
(Verkleint de gok-kans van ~75% naar ~50% bij 4 opties; lost de onderliggende scoring-architectuur niet op — dat hoort bij de engine-fix.)

---

## Samenvatting

De content van `encryption-expert` is didactisch grotendeels goed opgebouwd (heldere leerlijn Caesar → Base64 → asymmetrisch → toepassing), maar twee van de vier puzzels (`caesar-crack`, `base64-decode`) geven het antwoord al in de basis-clues weg, wat de kernvaardigheid "zelf decoderen" ondermijnt. Op tech-vlak is de wiring naar registry/SLO/curriculum/missionGoals compleet en correct, maar de missie erft de blocking gok-bestendigheids- en completion-bugs van de gedeelde `PuzzleLab.tsx`-engine — met name puzzel `public-key` (4-optie MC, 3 pogingen) is een concreet voorbeeld waarin die enginebug 75% gok-slagingskans oplevert. Design heeft geen missie-eigen problemen; de gevonden UI-issues (focus, hover-contrast) zitten volledig in de engine.

**Verdict: fix-eerst.** De didactische clue-weglek is direct fixbaar binnen deze config (voorstellen hierboven). De blocking tech-issues (score-drempel-mismatch, gok-bestendigheid, completion-deadlock) vereisen een engine-fix in `PuzzleLab.tsx` die buiten de scope van deze missie-review valt — die staat al genoteerd in de gedeelde engine-bevindingen.
