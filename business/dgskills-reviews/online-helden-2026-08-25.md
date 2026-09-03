# Review: Online Helden & Helpers

**Datum:** 2026-08-25
**templateType:** scenario-engine
**missionId:** `online-helden`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 6/10

- **Blocking (geërfd van engine, geldt hier):** onder 40% score is het eindscherm doodlopend (geen onRetry, geen onBack) en tussen 40-59% (onder de missiedrempel van 60) belooft de knop "Missie voltooid!" terwijl de run zonder XP/registratie wordt gewist. Zie `engine-scenario-engine.json`, ScenarioEngine.tsx:298/328. Raakt online-helden direct omdat de missiedrempel op 60 staat.
- Content zelf is visueel consistent met het engine-patroon (emoji-iconen, badges, takeaways) — geen missie-specifieke designfouten gevonden.
- Badge-kleuren: 80/60/0-drempel gebruikt `#202023` (duck-ink) drie keer en `#e1ff01` (duck-accent) één keer bij 40. Werkt, maar geen visuele progressie tussen de badges — 3 van de 4 badges zijn identiek qua kleur, alleen 40 springt eruit. Kleine styling-inconsistentie, geen blocker.

## Didactiek — score 7.5/10

- Sterk: de "subtiele" cyberpesten-items (uitsluiting, herhaalde "grapjes" na een stop-signaal, doorgestuurd gerucht) zijn didactisch precies de lastige gevallen die leerlingen leren onderscheiden van normaal gedrag (grenzen stellen, feedback, meningsverschil). Uitleg bij elk item is inhoudelijk sterk en legt het "waarom" uit, niet alleen goed/fout.
- Ronde 2 (bijstander-acties) dekt de kernboodschap goed: privé steunen en melden werken, openbaar terechtwijzen en meedoen niet — consistent met de takeaways.
- Ronde 3 (rangschikken, order-priority, 8 items): de content zelf is goed doordacht (doxxing bovenaan, kritische reactie onderaan), maar de scoreformule voor dit rondetype heeft geen gokcorrectie (engine-bevinding, warning). Bij 8 items is de exacte kans-op-gratis-punten niet apart doorgerekend voor deze config, maar de engine-analyse (bij 4-5 items al 9-10/25 gemiddeld bij random klikken) waarschuwt dat dit ook hier ronde-punten weglekt zonder dat de leerling de stof beheerst. Dit is een engine-brede zwakte, geen contentfout van deze missie.
- Trigger-warning/introtekst bevat correcte doorverwijzing (112, vertrouwde volwassene) — passend bij het gevoelige onderwerp.

## Tech — score 7/10

- Config zelf is technisch schoon: consistente `id`/`correct`/`explanation`-structuur, maxScore per ronde telt op tot 100 (30+40+30), geen ontbrekende velden.
- `slo-kerndoelen-mapping.ts:140` koppelt `online-helden` correct aan 23B/23C (vo) en 20A/20B (vso) — welzijn/maatschappij, logisch voor cyberpesten+bijstander.
- `missionGoals.ts:394-399`: threshold 60 (score-threshold). Dit is precies de drempel die de engine-bug (finding #2, 40-59% wist de run) raakt — bij deze missie is dat dus een reëel, niet-hypothetisch scenario, niet alleen "kan voorkomen bij een toekomstige config".
- Geen agent-rol-entry gevonden in `src/config/agents/year*.tsx` voor online-helden — verwacht en correct, scenario-engine-missies gebruiken standaard geen los agent-rol-bestand (geen bevinding, bekende valkuil).
- Toegankelijkheids-bevindingen (contrast, focusbeheer bij rondewisseling) zijn engine-breed en gelden hier zonder missie-specifieke uitzondering, maar zijn niet in deze config zelf te fixen.

## Voorstellen

Geen mechanische fixes binnen de whitelist voor deze missie — de twee blocking-bevindingen (dead-end onder 40%, "voltooid"-belofte tussen 40-59%) zitten in de gedeelde engine (`ScenarioEngine.tsx`) en in de host (`AuthenticatedApp.tsx`), niet in `online-helden.ts` of de config-registries. Een threshold-verlaging in `missionGoals.ts` zou het symptoom voor déze missie verkleinen (minder leerlingen belanden in de 40-59%-gatzone), maar is geen structurele fix en verandert de didactische lat — dat is een productbeslissing, geen mechanische config-fix, dus hier niet als autoFixable voorgesteld.

## Samenvatting & verdict

De content van "Online Helden & Helpers" is inhoudelijk sterk: subtiele cyberpesten-vormen, effectieve bijstander-acties en een doordachte impact-rangschikking, met heldere uitleg per item. De missie zelf bevat geen technische of didactische configfouten. Het probleem zit in de gedeelde scenario-engine: bij de threshold van 60 die deze missie gebruikt, kunnen leerlingen tussen 40-59% een "Missie voltooid!"-knop krijgen die hun run zonder XP of registratie wist, en onder 40% is er geen uitweg van het resultatenscherm. Dat is een engine-brede blocker die niet via deze missie-config op te lossen is.

**Verdict: fix-eerst** — de missie-content is klaar, maar mag niet live totdat de engine/host-blockers (CompletionScreen onRetry/onBack, drempel-mismatch 40% vs missiedrempel) zijn opgelost.
