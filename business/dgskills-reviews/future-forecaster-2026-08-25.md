# Review: Future Forecaster

**Datum:** 2026-08-25
**templateType:** debate-arena

## Design — score 6.5/10

De config zelf is consistent (4 stakeholders, badge-kleuren, emoji's). De blokkerende problemen zitten in de gedeelde engine, niet in deze config:

- **Voltooiknop niet uitgeschakeld tijdens opslaan** (engine, `CompletionScreen.tsx:163`): dubbele klik → dubbele XP/voltooiing. Raakt deze missie net zo goed als elke andere debate-arena-missie.
- **Onder 40% wist dezelfde knop alle werk** (engine, `CompletionScreen.tsx:165`): een leerling die "Afronden" leest verliest argumenten, tegenargument en reflecties zonder waarschuwing.
- **Toegankelijkheid**: labels/textareas zonder `htmlFor`/`aria-label` (Argue/Challenge/Reflect-fase), geen focus-verplaatsing bij faseovergang. Generiek engine-gedrag, niet config-specifiek.
- Kleurcontrast-issue met stakeholder-index 4 (#e1ff01) is hier **niet van toepassing** — Future Forecaster heeft 4 stakeholders (index 0-3), dus de gele kleur wordt niet bereikt.

Deze missie zelf voegt geen nieuwe designfouten toe; de score is verlaagd omdat de leerling de engine-gebreken hierboven wél ondervindt.

## Didactiek — score 8/10

- Sterk dilemma met heldere spanning (AI-tutor vs. menselijke leraar) en vier goed gedifferentieerde perspectieven (leerling, leraar, onderzoeker, beleidsmaker) — dekt cognitief, sociaal én maatschappelijk niveau.
- `primaryGoal` in `missionGoals.ts` sluit één-op-één aan bij `dilemma` en `takeaways`.
- Reflectievragen (2 stuks) zijn precies genoeg om de score-overflow-bug uit de engine (max 110/100 bij 3 reflectievragen) **niet** te raken — dit is de veilige configuratie.
- `counterArgument` is inhoudelijk sterk (toegankelijkheid-argument tegen "traditie") en dwingt een echte weerlegging af.
- SLO-koppeling (`21D`, `23C` / vso `18C`, `20B`) en curriculumplaatsing (leerjaar 2, week 4) zijn aanwezig en consistent met `templateRegistry.ts`.

## Tech — score 7/10

- `templateRegistry.ts`, `slo-kerndoelen-mapping.ts`, `curriculum.ts` en `missionGoals.ts` bevatten alle vier een entry voor `future-forecaster`, consistent met elkaar (id, titel, week 4/leerjaar 2).
- `enableChat: true` met `chatRoleId: 'future-forecaster'` — coach-prompt staat server-side, geen bevinding (bekende valkuil, niet client-zichtbaar).
- Engine-brede bevindingen die deze missie raken: dubbele-submit-bug, destructieve retry-knop, geen foutmelding bij mislukte server-opslag (`DebateArena.tsx:260`), geen deduplicatie van drie identieke argumenten (`DebateArena.tsx:115`), reflectie-antwoorden gesleuteld op letterlijke vraagtekst i.p.v. stabiele id (`DebateArena.tsx:350`). Dit zijn engine-fixes, niet missie-config-fixes.
- Geen config-specifieke technische fouten gevonden (geen ontbrekende velden, geen typefouten in id's).

## Voorstellen

Geen mechanische fixes binnen de scope van deze missie-config (`future-forecaster.ts`, registry-entries). Alle gevonden problemen zitten in de gedeelde debate-arena-engine (`DebateArena.tsx`, `CompletionScreen.tsx`, `ArguePhase.tsx`, `ChallengePhase.tsx`, `ReflectPhase.tsx`) en moeten daar één keer worden opgelost voor alle debate-arena-missies tegelijk — zie `engine-debate-arena.json`.

## Samenvatting en verdict

Future Forecaster is didactisch een van de sterkere debate-arena-missies: helder dilemma, goed gedifferentieerde stakeholders, en een reflectie-opzet (2 vragen) die de scoring-overflow-bug van de engine vermijdt. De config zelf heeft geen technische of design-fouten. Wat de leerling wél raakt zijn engine-brede problemen (dubbele-submit, destructieve retry-knop, toegankelijkheid) die voor alle debate-arena-missies gelden en centraal in de engine gefixt moeten worden, niet per config.

**Verdict: fix-eerst** (op engine-niveau; de missie-config zelf is gereed).

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
