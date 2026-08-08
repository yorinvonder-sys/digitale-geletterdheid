# Review: Factchecker (scenario-engine)

**Datum:** 2026-08-06
**Missie:** `factchecker` — Leerjaar 2, periode 1 "Data & Informatie", doelgroep 13-14 jaar (mavo/havo/vwo)
**SLO:** 21B (Media & Informatie), 23C (Maatschappij) · VSO 18B, 20B
**Config:** `src/features/missions/templates/scenario-engine/configs/factchecker.ts`

De gedeelde `scenario-engine` wordt door een aparte reviewer beoordeeld; dit rapport gaat alleen over de content/config van deze missie en zijn registraties.

## ⚠️ Blocking bevinding — rangschik-ronde verklapt mogelijk het antwoord

**Ronde 2 "meest-betrouwbaar" (`order-priority`)**: de vijf items staan in de configuratie-array al in de exacte juiste volgorde neergezet.

- `id:1` → `correctPosition: 0` (Peer-reviewed artikel — meest betrouwbaar)
- `id:2` → `correctPosition: 1` (RIVM/rijksoverheid.nl)
- `id:3` → `correctPosition: 2` (NOS/NRC)
- `id:4` → `correctPosition: 3` (Blog van een arts)
- `id:5` → `correctPosition: 4` (TikTok — minst betrouwbaar)

Anders dan bij de select-correct-rondes (waar de volgorde van `correct: true/false` gemengd is) is dit precies de gesorteerde uitkomst. Als de engine de items in array-volgorde toont vóórdat de leerling ze zelf rangschikt (bijv. als startpositie van een drag-and-drop lijst, of als de items zonder shuffle worden gerenderd), dan staat het antwoord al klaar en hoeft de leerling niets te doen om de volle 25 punten van deze ronde te halen — precies het scenario uit reviewpunt 1/2 ("kan een leerling de volle score halen zonder inhoudelijk werk", "verklapt de config het antwoord via optievolgorde").

Ik heb de engine-code niet gelezen (buiten scope voor deze review), dus ik kan niet vaststellen of er een shuffle-stap in `ScenarioEngine.tsx` zit. Dit moet met de engine-reviewer worden afgestemd en idealiter met een echte playthrough worden bevestigd (zie `claimsVoorNaspelen`).

**Fix als er geen shuffle is:** randomiseer de item-volgorde bij het renderen van `order-priority`-rondes (engine-niveau), of herorden de `items`-array in de config zelf niet-gesorteerd zodat visuele inspectie van de config geen giveaway meer is (secundaire maatregel; de primaire fix hoort in de engine).

## ✅ Score-/badge-rekensom

- Rondes: 25 + 25 + 25 + 25 = 100 → komt overeen met top-level `maxScore: 100`. Klopt.
- Badges: 80 / 60 / 40 / 0 — alle drempels zijn haalbaar binnen de 0-100-schaal. Geen onbereikbare badge.
- `missionGoals.factchecker` gebruikt `type: 'score-threshold', threshold: 60` — consistent met de badge op 60 ("Kritische Lezer").

## Feitelijke juistheid van voorbeelden (ronde-inhoud)

Alle scenario's in de missie zijn **generiek/fictief** geformuleerd (geen citaten van echte, dateerbare nieuwsberichten of bestaande URL's die als feit worden gepresenteerd):

- "echnieuws-nederland-info.net" (ronde 1, item 6) is expliciet een fictief voorbeelddomein — geen bestaande site, geen probleem.
- nu.nl, RIVM/rijksoverheid.nl, NOS, NRC, The Lancet worden alleen generiek genoemd ("nu.nl is een gevestigde nieuwssite met een redactie" / "Peer-reviewed... gepubliceerd in The Lancet") zonder specifieke, verifieerbare claim die kan verouderen. Geen probleem.
- De "heet water geneest COVID"-claim (ronde 3) is een bekend, blijvend-relevant voorbeeld van gezondheidsdesinformatie; geen recente/actuele claim die snel achterhaald raakt.
- Geen verzonnen bronnen/URL's die als "echt" worden aangeboden — alle fictieve voorbeelden zijn herkenbaar als scenario, niet als feitelijke bewering over de echte wereld.

Geen bevindingen op deze as — de missie is zorgvuldig geschreven om self-contained en tijdloos te blijven, precies wat je bij een factcheck-missie wilt zien.

## Welzijn & kindveiligheid

Geen schokkende, polariserende of politiek geladen content. De "Dit wil de overheid NIET dat u weet"-kop (ronde 1, item 1) triggert bewust wantrouwen-tegen-instituties-taal, maar uitsluitend als leermateriaal over manipulatietechnieken, met duidelijke uitleg. Geen problematische content voor 13-14-jarigen of een klassikale setting.

## Taalniveau & cognitieve belasting

- `introDescription`: ~40 woorden — ruim onder de norm voor leerjaar 1-2/3 (<80/<120).
- Ronde-omschrijvingen: meest kort (~15-20 woorden), ronde 4 (CRAAP) ~45 woorden — nog onder de grens van 60, maar propt vijf CRAAP-begrippen (Currency/Relevance/Authority/Accuracy/Purpose) met korte uitleg in één zin. Dat is inhoudelijk dicht voor 13-jarigen — **warning, geen blocker**: de items zelf lichten elk criterium apart toe, dus de cognitieve last wordt over de ronde verspreid, maar de introzin zelf is dicht.

## SLO-koppeling en leerdoelen

- SLO 21B (Media & Informatie) en 23C (Maatschappij) sluiten goed aan: de missie behandelt bronbeoordeling, desinformatie-herkenning en maatschappelijke impact van het delen van nepnieuws. Geen misalignment.
- `missionGoals.factchecker.primaryGoal`: "Ik beoordeel berichten en bronnen kritisch met de CRAAP-methode en besluit bewust of ik iets deel." — concreet en gedragsgericht (action-verb "beoordeel", "besluit").
- `evidence`: "Je kunt minimaal drie rode vlaggen voor onbetrouwbare berichten noemen..." — meetbaar.
- Curriculum-plek (`curriculum.ts` regel 172): factchecker staat als eerste missie in Leerjaar 2 Periode 1 "Data & Informatie" — logische opening voor het thema.

## Bloom-balans

Redelijke mix: ronde 1/4 (select-correct) = herkennen/begrijpen, ronde 2 (order-priority) = analyseren/waarderen (bronhiërarchie), ronde 3 (binary-choice) = evalueren/toepassen in beslissingscontext ("zou jij dit delen?"). Geen pure recall-only missie.

## Overige observaties

- Geen hints of te vroege feedback-lekken gevonden — feedback (`feedbackCorrect`/`feedbackIncorrect`) is generiek per ronde, geen antwoord-lek.
- `takeaways` zijn inhoudelijk sterk en sluiten aan bij de rondes.

## Samenvatting

| As | Score | Belangrijkste bevinding |
|---|---|---|
| Design | 5/10 | Blocking: mogelijke answer-leak via item-volgorde in rangschik-ronde (afhankelijk van engine-shuffle) |
| Didactiek | 7/10 | Sterk SLO/leerdoel-fit; kleine cognitieve-load-warning in ronde 4 |
| Tech | 8/10 | Config zelf clean; geen logica in config die faalt — engine-afhankelijke risico's vallen bij de engine-review |

**Verdict: fix-eerst** — bevestig (samen met engine-reviewer of via playthrough) of `order-priority`-items geshuffled worden vóór weergave. Zo niet: shuffle toevoegen in de engine of de missie kan zonder inhoudelijk werk de volle 25 punten van ronde 2 halen.
