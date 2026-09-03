# Review: media-review (2026-08-25)

**templateType:** review-arena

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10

De vier rondes zijn visueel en inhoudelijk gevarieerd (drag-sort, match-pairs, categorize, rapid-fire) en de badge-opbouw (5 drempels, 0-90) geeft duidelijke voortgangsgevoel. Geen missie-specifieke designfouten gevonden.

- **Warning (gedeeld, geraakt door deze missie):** de engine-bevinding over `text-duck-ink/70`-contrast bij 12px (DragSort/MatchPairs/Categorize) geldt ook hier — deze missie gebruikt alle drie de subcomponenten.
- **Info:** takeaways (5 stuks) zijn kort en concreet, sluiten goed aan bij de rondes.

## Didactiek — score 7.5/10

Inhoudelijk sterk: de categorize-ronde combineert een basisoefening met een goed opgebouwde bonusvraag (doelgroep-redenering met plausibele afleiders en een heldere uitleg). De rapid-fire-vragen dekken kernbegrippen (podcast, meme, branding, storytelling, UX, algoritme, mediawijsheid, CTA) met correcte, leerzame uitleg per vraag.

- **Warning (gedeeld, geraakt door deze missie):** de engine-bevindingen over ontbrekende gokcorrectie/poort in DragSort en Categorize gelden hier direct — bij media-review kan een leerling bij Categorize (8 items, 2 categorieën, verdeling 5 vs 3) door alles in "Bewuste mediakeuze" te zetten al 5/8 = 62% van de ronde scoren zonder inhoudelijke keuze.
- **Info:** `missionGoals.ts`-entry (regel 526-534) is inhoudelijk consistent met de vier rondes en de SLO-mapping (22A/21B/23B, VSO 19A/18B/20B) — geen mismatch gevonden.

## Tech — score 7/10

Config zelf is syntactisch correct en compleet (rounds, badges, takeaways, followUp). Registry-, SLO-, curriculum- en missionGoals-entries zijn onderling consistent (leerjaar 2, periode/week 3, `media-review` overal identiek geschreven).

- **Blocking (gedeeld, geraakt door deze missie):** de engine-bevinding over `MatchPairs.onSubmit` bij een foute poging raakt deze missie direct — de match-pairs-ronde heeft 5 paren, dus `scoreFor(1)` bij één foute klik + herladen geeft een vastgezette hoge score zonder dat er iets goed is gekoppeld.
- **Blocking (gedeeld, geraakt door deze missie):** de engine-bevinding over het CompletionScreen zonder terugweg onder 40% raakt elke leerling die deze missie onvoldoende afsluit — er is voor media-review geen mission-specifieke mitigatie.

## Voorstellen

Geen mechanische fix binnen de whitelist voor deze missie: alle blocking- en de meeste warning-bevindingen zitten in de gedeelde engine (`ReviewArena.tsx`, `MatchPairs.tsx`, `DragSort.tsx`, `Categorize.tsx`), niet in `media-review.ts` of de registry-entries. Er is dus geen voor/na-snippet binnen de whitelist-scope van deze missie te geven; de fix hoort in de engine-review te landen.

## Samenvatting & verdict

De content van media-review is didactisch sterk en de registry-koppelingen kloppen. De score wordt gedrukt door twee blocking-gebreken in de gedeelde review-arena-engine die deze missie via alle vier rondetypes raakt: een vastzet-exploit in MatchPairs en een doodlopend eindscherm onder 40%. Verdict: **fix-eerst** — niet op missie-config-niveau te repareren, wacht op de engine-fix.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
