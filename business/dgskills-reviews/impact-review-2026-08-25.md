# Review: Impact Review (`impact-review`)

**Datum:** 2026-08-25
**TemplateType:** review-arena
**Locatie:** leerjaar 3, periode 3 (reviewMissions)
**SLO:** 23C — "review = puur maatschappij" (curriculum-comment)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 6/10

- Round-structuur is consistent met andere review-arena-missies (drag-sort → match-pairs → categorize → rapid-fire), goede visuele afwisseling van interactietype.
- Badges hebben logische drempels (0/25/50/70/90) met kleuren uit de duck-palette; `#e1ff01`/`#ff3c21` zijn hardcoded hex i.p.v. `duck-*`-tokens, maar dat is projectbreed patroon in dit template, geen missie-specifieke afwijking.
- Erft het gedeelde contrastrisico van de engine: `text-duck-ink/70` op wit bij 12px (DragSort/MatchPairs/Categorize) — raakt deze missie net zo hard als elke andere review-arena-missie, want alle vier rondetypes worden hier gebruikt.
- Erft ook het DragSort-positienummer op `#ff3c21` + `text-duck-ink` (contrast) en het ontbrekende aria-label bij foutieve rijen na indienen (screenreader krijgt geen detail).
- Content zelf (copy, item-labels) is qua lengte en toon passend voor leerjaar 3.

## Didactiek — score 4/10

- Leerdoel is helder en aansluitend bij SLO 23C (maatschappelijke impact van technologie).
- Follow-up vragen (categorize- en rapid-fire-ronde) zijn sterk: concrete AVG/AI Act-scenario's met uitleg die het "waarom" onderbouwt, niet alleen het "wat".
- Takeaways dekken kernbegrippen (digitale kloof, algoritme-bias, EU AI Act) en sluiten aan bij de rondes.
- **Blocking, geërfd van de engine maar hier concreet actief:** de match-pairs-ronde (25 van de 100 punten) roept `onSubmit` al bij de eerste foute koppeling aan (`MatchPairs.tsx:168`). Bij deze missie betekent dat: één willekeurige foute klik + pagina verversen levert `scoreFor(1)` = 19/25 op zonder één juiste koppeling — bijna een vijfde van het totale missiepunten zonder kennis te tonen.
- **Blocking, geërfd:** een leerling die onder de 40% scoort (bijvoorbeeld door de moeilijke ethische bonusvragen te missen) ziet op het CompletionScreen een uitgeschakelde knop zonder terugweg (`ReviewArena.tsx:521`) — de missie loopt vast, juist voor de leerling die het meest baat heeft bij een herkansing.
- **Warning, geërfd:** drag-sort (25 pt) en categorize (25 pt) zijn ongecorrigeerd voor gokken — categorize is hier extra gevoelig omdat de items scheef verdeeld zijn (5 "Kans" vs 3 "Risico" in de basisset), dus alles in "Kans" gooien levert al ~62% van de ronde op zonder inhoud.

## Tech — score 7/10

- Config-structuur volgt `ReviewArenaConfig`-schema correct; geen ontbrekende velden, `maxScore` klopt op 100 (4×25).
- Alle vier round-`id`'s en `type`'s zijn geldig en consistent met de sub-componenten.
- Registry- en SLO-entry zijn intern consistent (`missionId: 'impact-review'` overal gelijk, geen typo's).
- Geen missie-specifieke technische fouten gevonden buiten wat al in de gedeelde engine zit (zie hierboven, dat is geen eigen bevinding van deze missie maar wél relevant voor het eindoordeel omdat alle vier rondetypes hier worden ingezet).

---

## Voorstellen

Geen van de blocking/warning-bevindingen is mechanisch fixbaar binnen de config van deze missie — ze zitten in de gedeelde `review-arena`-engine (`MatchPairs.tsx`, `ReviewArena.tsx`, `DragSort.tsx`, `Categorize.tsx`) en vallen buiten de whitelist voor auto-fix op missie-niveau. Geen voor/na-snippet opgenomen; dit hoort in de engine-fix-track, niet in een config-wijziging van `impact-review.ts`.

Wel een kleine, missie-specifieke verbetersuggestie (niet blocking, geen auto-fix — vereist inhoudelijke afweging):

- Categorize-ronde: de basisset "Kans" (5) vs "Risico" (3) is scheef. Bij een gokcorrectie in de engine (zie boven) wordt dit vanzelf minder relevant; zolang die correctie er niet is, overweeg een gelijkere verdeling zodat blind indienen minder oplevert.

---

## Samenvatting & verdict

Impact Review heeft sterke, doordachte content (heldere SLO-koppeling, goede ethische follow-up-vragen), maar draait op een engine met twee blocking-gebreken die hier volledig actief zijn: de match-pairs-ronde is te exploiten voor bijna een vijfde van de punten, en zwak scorende leerlingen (<40%) lopen bij het eindscherm vast zonder terugweg. Beide zijn engine-brede issues, geen missie-specifieke fout, maar ze raken deze missie net zo hard als elke andere review-arena-missie omdat alle vier de rondetypes hier gebruikt worden.

**Verdict: fix-eerst** — niet vanwege de missie-content zelf, maar omdat de gedeelde engine-bugs (MatchPairs-vroegtijdige score-lock, CompletionScreen-deadlock <40%) eerst gerepareerd moeten worden voordat deze missie zonder risico naar leerlingen kan.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
