# Review: Policy Maker (debate-arena)
Datum: 2026-08-25

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — 8/10

Vier stakeholders (Yasmine, Meneer Janssen, De heer Petrov, Rector Van den Berg) met duidelijk onderscheiden perspectieven en een reëel, herkenbaar dilemma (telefoonbeleid). De vier posities dekken het hele spectrum (vrij gebruik → volledig verbod → gedifferentieerd), geen valse dichotomie.

**Bevindingen**
- info: Met precies 4 stakeholders raakt deze missie de engine-brede `STAKEHOLDER_COLORS`-kleurbug (index 4 = onleesbaar geel-op-wit) niet — indices 0-3 zijn hier `#ff3c21, #202023, #202023, #202023`. Geen actie nodig voor deze config; blijft relevant zodra iemand een 5e stakeholder toevoegt.

## Didactiek — 8/10

`primaryGoal` en `evidence` in `missionGoals.ts` sluiten scherp aan op de config: kiezen + onderbouwen vanuit ≥2 perspectieven. `takeaways` bouwen netjes op van concreet (draagvlak) naar abstract (stakeholderanalyse als methode). De reflectievragen dagen uit tot perspectiefwissel ("welk perspectief had je het minst verwacht").

**Bevindingen**
- info: Slechts 2 `reflectionQuestions` (tegenover 3 bij bv. ai-ethicus/schermtijd-coach) — dit is de reden dat de engine-brede 110-punten-scoringbug hier niet optreedt. Geen wijziging nodig; vermeld zodat een toekomstige uitbreiding naar 3 vragen bewust gebeurt (dan wél de weging herzien).
- info: `counterArgument` is goed gekozen — een sterk tegenargument vanuit het leerling-perspectief zelf, dwingt tot een genuanceerd weerwoord in plaats van een stroman.

## Tech — 8/10

Config volledig en consistent gewired: `templateRegistry.ts` (regel 95, `enableChat: true`, `chatRoleId: 'policy-maker'`), `slo-kerndoelen-mapping.ts` (regel 184, `23C`), `curriculum.ts` (jaar 3, periode 3, regel 294), `missionGoals.ts` (regel 870-877) en `agents/year3.tsx` (regel 1178) zijn allemaal aanwezig en consistent op id/naam.

**Bevindingen**
- Geen missie-specifieke technische bevindingen. De engine-brede blocking issues (dubbele voltooiknop-klik, `onRetry`-knop die werk wist bij <40%, scoring bij 3 reflectievragen) zijn gedeeld gedrag van `debate-arena`/`CompletionScreen` en gelden voor alle debate-arena-missies inclusief deze — zie `engine-debate-arena.json`. Ze zijn hier niet los opnieuw beoordeeld.

## Voorstellen

Geen missie-specifieke auto-fixes nodig — `policy-maker.ts` en de gekoppelde config-entries bevatten geen op zichzelf staande fouten. De engine-brede bevindingen (dubbelklik-guard, retry/afronden-scheiding, scoreweging bij 3 reflectievragen) horen thuis in de gedeelde engine-fix, niet in deze missieconfig.

## Samenvatting & verdict

Policy Maker is een van de sterkere debate-arena-missies: heldere, realistische stakeholders, een goed gekozen tegenargument, en toevallig (door 4 stakeholders / 2 reflectievragen) buiten het bereik van de twee engine-brede randgevallen (kleur-index 4, scoring bij 3 vragen). Content en wiring zijn compleet en consistent.

**Verdict: ok** — geen missie-specifieke blockers; wacht op de gedeelde engine-fix voor de bekende debate-arena-brede issues.
