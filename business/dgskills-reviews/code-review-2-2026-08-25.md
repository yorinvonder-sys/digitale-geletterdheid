# Review: code-review-2 — 2026-08-25

**templateType:** review-arena

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 6/10

De missie zelf voegt geen eigen UI toe (pure config voor de gedeelde review-arena-engine), dus het designoordeel volgt grotendeels de engine-bevindingen die deze missie raken:

- **Contrastrisico (warning, engine-breed):** `text-duck-ink/70` op wit in alle vier subcomponenten en de hardgecodeerde `#ff3c21`-achtergrond in DragSort raken ook de eerste ronde van deze missie (`round-drag-sort`).
- **A11y-gat DragSort (warning, engine-breed):** na indienen is goed/fout alleen via kleur+icoon af te lezen, geen aria-label — treft `round-drag-sort` hier.
- Content-zijdig (in `code-review-2.ts`) geen designproblemen: copy is kort, badges consistent met de rest van het template, takeaways leesbaar.

Geen missie-specifieke designbevindingen buiten wat de engine al dekt.

## Didactiek — score 8/10

- Goede dekking van periode-2-stof: HTML/CSS/JS-lagen, algoritme, debuggen, functie, loop, responsive design, API, UX, automatisering, testen, computational thinking.
- `round-drag-sort` vraagt een zinvolle conceptuele ordening (fundamenteel → visueel/interactief) i.p.v. willekeurige sortering.
- Beide `followUp`-vragen (categorize + rapid-fire) hebben sterke, correcte uitleg die foutieve alternatieven expliciet weerlegt (bv. waarom CSS zelden klikken blokkeert).
- Rapid-fire dekt 10 relevante stellingen met heldere, correcte uitleg per antwoord.
- Kleine kanttekening: de missie test vooral herkennen/koppelen, weinig toepassen/uitleggen in eigen woorden — past bij het format (drag/match/categorize/rapid-fire), dus geen aftrek waard buiten deze noot.

## Tech — score 6/10

Missiespecifieke config (`code-review-2.ts`) zelf is technisch correct: item-ids uniek, `correctPosition`/`correctCategory`/`answer`-velden consistent met de engine-contracten, `maxScore`-optelling (25×4=100) klopt.

De technische risico's zitten in de **gedeelde engine**, maar zijn relevant voor deze missie omdat ze de score-integriteit en voltooibaarheid direct raken:

- **Blocking (engine):** `MatchPairs` (`round-match-pairs`) legt bij de eerste foute koppelpoging al een rondescore vast; een refresh na één foute klik geeft ~19/25 zonder verdere inspanning.
- **Blocking (engine):** een leerling die onder 40% scoort, loopt vast op het eindscherm zonder terugweg (`onRetry`/`onBack` ontbreken).
- **Warning (engine):** `DragSort` en `Categorize` (rondes 1 en 3 van deze missie) hebben geen gokcorrectie/inhoudelijke poort — makkelijk gedeeltelijke punten zonder juist antwoord.
- Deze engine-bevindingen zijn AL gerapporteerd in de gedeelde engine-review en worden hier niet herhaald als losse nieuwe vondsten — alleen genoemd omdat ze deze missie's scoring/voltooiing aantoonbaar raken.

## Voorstellen

Geen missiespecifieke (config-only) mechanische fixes gevonden binnen de whitelist voor `code-review-2`. De blocking/warning-issues zitten in de gedeelde `review-arena`-engine (`MatchPairs.tsx`, `ReviewArena.tsx`, `DragSort.tsx`, `Categorize.tsx`) en vallen buiten de scope van dit missiebestand — die horen als engine-fix opgepakt te worden, niet per missie.

## Samenvatting & verdict

De content van `code-review-2` is didactisch sterk en technisch correct opgezet. De blokkerende problemen zitten niet in deze missie-config maar in de gedeelde review-arena-engine (scoring-exploit in MatchPairs, dead-end eindscherm onder 40%), en raken daardoor elke missie van dit template, inclusief deze. Omdat de blockers engine-breed zijn en niet via dit configbestand op te lossen, is het verdict voor de missie zelf **fix-eerst**: klaar zodra de engine-fixes (los werk, buiten deze missie-scope) zijn doorgevoerd.

**Verdict: fix-eerst**
