# Missie-review: data-review

**Datum:** 2026-08-25
**TemplateType:** review-arena

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 6/10

De vier ronden (drag-sort, match-pairs, categorize, rapid-fire) zijn thematisch consistent gecomponeerd rond één casus (bronnen wegen, kasboek, dashboard, API/bias) en de badge-opbouw (5 niveaus, 0-90) is logisch aflopend. De belangrijkste gebreken zijn afkomstig uit de gedeelde engine, maar raken deze missie concreet:

- **Blocking (geërfd van engine):** het eindscherm zet bij <40% score de enige knop uit zonder terugweg (`ReviewArena.tsx:521`, `CompletionScreen.tsx:157-160`). Bij `data-review` is 40% van 100 punten = 40 punten over 4 ronden — een reëel scenario voor een leerling die in de rapid-fire-ronde (25 punten, foute antwoorden kosten punten) negatief scoort. Deze missie heeft geen eigen mitigatie.
- **Warning (geërfd):** contrastrisico op `duck-ink/70`-tekst en het hardgecodeerde positienummer-contrast in DragSort (`DragSort.tsx:94,99,216`) raakt round-drag-sort in deze missie rechtstreeks — de bronnen-labels zijn relatief lang en juist daar telt leesbaarheid.
- **Info:** de vier ronde-titels ("Hoe sterk is dit bewijs?", "Welke formule hoort bij welke vraag?", "Welke grafiek past hierbij?", "API's & AI-bias: waar of onwaar?") zijn functioneel en helder; geen aparte bevinding nodig.

Geen mission-specifieke designfout gevonden buiten wat de engine al veroorzaakt.

## Didactiek — score 7/10

De opbouw dekt de breedte van periode 1 (bronnen wegen, spreadsheetformules, grafiekkeuze, JSON/API, AI-bias) en sluit aan bij de SLO-kerndoelen 21B/21C/21D (vo) en 18B/18C (vso) in `slo-kerndoelen-mapping.ts:110`. De `takeaways` zijn correct en beknopt; de followUp-vragen testen begrip in plaats van herhaling van het antwoord.

- **Warning (mission-specifiek):** de drag-sort-ronde ("Hoe sterk is dit bewijs?") vraagt CRAAP-toepassing maar de gokcorrectie ontbreekt op engine-niveau (`DragSort.tsx:169`) — bij 6 items zonder gokbasislijn kan een leerling met giswerk een substantieel deel van de 25 punten binnenhalen zonder de bronnen inhoudelijk te wegen. Dat ondermijnt precies wat deze ronde didactisch moet meten (kritisch bronnen wegen, niet toevalstreffers).
- **Warning (mission-specifiek):** de categorize-ronde (grafiektype kiezen) heeft dezelfde geërfde zwakte: 9 items over 3 categorieën, scheve verdeling (4 staafdiagram, 3 cirkeldiagram, 2 lijndiagram) zou bij "alles op Staafdiagram zetten" ~44% van de ronde opleveren zonder enige inhoudelijke keuze — dat vertekent wat een 40%-score in deze missie eigenlijk betekent.
- **Info:** de rapid-fire-vragen over AI-bias zijn inhoudelijk sterk (testen op groepen, menselijk toezicht, "sneller/goedkoper ≠ eerlijker") en sluiten goed aan bij de AI-geletterdheid-lijn van het curriculum; geen bevinding.

## Tech — score 7/10

Configuratie is coherent: `templateRegistry.ts:42`, `slo-kerndoelen-mapping.ts:110`, `curriculum.ts:178` (leerjaar 2, periode 1, reviewMissions) en `missionGoals.ts:508` (rounds-complete, min 4) wijzen allemaal consistent naar dezelfde 4 ronden en dezelfde missionId. De agent-rol-entry in `year2.tsx:522` is aanwezig met briefingImage.

- **Blocking (geërfd van engine, raakt deze missie hard):** de MatchPairs-ronde (`round-match-pairs`, kasboek-formules) legt bij ELKE foute koppelpoging al een tussentijdse score vast via `onSubmit(scoreFor(attempts))` (`MatchPairs.tsx:168`). Na een pagina-ververs toont ReviewArena die ronde als "al ingediend" met een vaste score, zonder dat de leerling de 6 formule-paren daadwerkelijk correct heeft gekoppeld. Bij 6 paren en maxScore 25 kan dit tot ~19/25 opleveren na één willekeurige foute klik + refresh.
- **Info:** de match-pairs-validator dekt niet `selectedLeft/selectedRight` (`ReviewArena.tsx:194` vs `MatchPairs.tsx:58-59`) — cosmetisch risico bij bewerkte opslag, geen directe impact op deze missie's score-integriteit.

---

## Voorstellen

Alle onderstaande fixes zitten in de gedeelde engine (`src/features/missions/templates/review-arena/...`), niet in `data-review.ts` zelf — dus **buiten de mission-config-whitelist**. Ze zijn hier vermeld ter context maar horen als escalatie bij de engine-eigenaar, niet als auto-fix op deze missie.

Voor `data-review.ts` zelf zijn er geen mechanische voor/na-fixes nodig — de config is correct en compleet.

---

## Samenvatting & verdict

`data-review` is een inhoudelijk sterke, goed aan het curriculum gekoppelde missie. De blocking- en warning-bevindingen zijn vrijwel volledig geërfd van de gedeelde review-arena-engine (dead-end bij <40%, MatchPairs-exploit, ontbrekende gokcorrectie in drag-sort/categorize) en raken elke missie van dit template — maar ze raken déze missie concreet doordat de kasboek-ronde (match-pairs) en de bronnen-ronde (drag-sort) er expliciet gebruik van maken. Er is geen mission-specifieke fout in `data-review.ts` zelf.

**Verdict: fix-eerst** — niet vanwege de missie-config, maar omdat de engine-blockers (MatchPairs-scorelek, dead-end eindscherm) leerlingen die deze specifieke missie spelen aantoonbaar kunnen raken vóórdat de missie naar leerlingen mag.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
