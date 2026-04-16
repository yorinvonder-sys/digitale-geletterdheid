# Runtime-audit: factchecker
- Datum: 2026-04-16
- Template: scenario-engine
- Auditor: agent-wave0-batchA
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — `ScenarioEngineConfig` aanwezig met `missionId`, `title`, `introEmoji`, `introTitle`, `introDescription`, `introFeatures` (4), `maxScore: 100`, `badges` (4), `takeaways` (5), `rounds` (4). Alle verplichte velden aanwezig. Default export aanwezig.
- [PASS] Phase-transitions bereikbaar — `ScenarioEngine.tsx` verwerkt ronden sequentieel; elke ronde heeft een submit-trigger. Vier ronden aanwezig: `select-correct`, `order-priority`, `binary-choice`, `select-correct`.
- [N.V.T.] EERSTE_BERICHT aanwezig — `enableChat` of `chatRoleId` niet aanwezig in `ScenarioEngineConfig`-type en niet in de config. AI-chat is niet van toepassing voor dit template.
- [WARN] STEP_COMPLETE markers — system instruction aanwezig met boilerplate-tekst, maar geen mission-specifieke step-triggers. Chat is niet actief, geen runtime-blocker.
- [PASS] Verificatievragen aanwezig — `binary-choice` ronde bevat 6 deel/niet-deel scenario's met uitleg; `select-correct` rondes hebben correcte/incorrecte items met verklaring; `order-priority` heeft 5 items met correcte positie. Rijke verificatie-logica.
- [PASS] Geen dode code-verwijzingen — `SelectCorrectRound`, `OrderPriorityRound`, `BinaryChoiceRound`, `FeedbackBanner`, `scoreRound` bestaan in `scenario-engine/sub/`.
- [PASS] Ronde-scores — ronde 1: 25pt, ronde 2: 25pt, ronde 3: 25pt, ronde 4: 25pt = 100pt. Klopt met `maxScore: 100`.

## Visueel (code-level)
- [PASS] Responsive breakpoints — `ScenarioEngine.tsx` heeft geen hardcoded pixel-sizes; geen `w-[Npx]` gevonden.
- [PASS] Geen overflow-risico — geen `overflow-hidden` in ScenarioEngine main component.
- [PASS] Design tokens — `#D97706`, `#10B981`, `#6B6B66`, `#FAF9F0` consistent.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote (uit 2026-03-07): "Factchecker | 21B, 23C | Leerdoel: goed — bronkritiek en maatschappelijke duiding sluiten sterk aan; voeg expliciet een criterium toe voor betrouwbaarheid van bronsoort. Bloom: goed — evalueren is passend voor leerjaar 2. Opbouw: goed — bouwt logisch van data lezen naar informatie beoordelen; laat resultaten teruggrijpen op Data Journalist. Activerend: goed — leerling zoekt, vergelijkt en oordeelt zelf; laat ook 1 bron afvallen met reden. Differentiatie: matig — weinig zichtbare niveausteun; werk met makkelijk, twijfelachtig en misleidend bronmateriaal."
- UI-koppeling: Ronde 4 (CRAAP-methode) bevat expliciet criteria voor bronbeoordeling — dit sluit aan bij de audit-aanbeveling "voeg criterium toe voor betrouwbaarheid van bronsoort". Ronde 3 (binary-choice) laat leerlingen een bron "afvallen" met uitleg — dit sluit aan bij "laat ook 1 bron afvallen met reden". Differentiatie ontbreekt: items in select-correct rondes hebben geen expliciet moeilijkheidslabel; subtiele items (bijv. nu.nl als correcte bron, artikel met links als betrouwbaar signaal) zijn onherkenbaar als "verdieping" voor snelle leerlingen. De koppeling terug naar Data Journalist (zoals de audit vraagt) ontbreekt in de config.

## Bevindingen (severity)
1. [MINOR] Geen expliciete koppeling naar Data Journalist — audit vraagt "laat resultaten teruggrijpen op Data Journalist"; geen verwijzing in config of takeaways. Fix: voeg in `takeaways` een terugverwijzing toe, of voeg in de intro een contextzin toe. Bestand: `components/missions/templates/scenario-engine/configs/factchecker.ts`.
2. [MINOR] Differentiatie niet zichtbaar in ronde-items — makkelijke en moeilijke items staan door elkaar; geen niveaulabeling. Fix: voeg een `difficulty`-markering toe aan items (low/medium/high) zodat de template adaptief kan reageren — dit vereist ook een aanpassing in de ScenarioEngine template. Alternatief: herschik items van eenvoudig naar complex per ronde.

## Bronnen
- Config: `components/missions/templates/scenario-engine/configs/factchecker.ts`
- Component: `components/missions/templates/scenario-engine/ScenarioEngine.tsx`
- System instruction: `supabase/functions/_shared/systemInstructions.ts` — `"factchecker"` sleutel (aanwezig, chat niet actief voor dit template)
- SLO-audit-row: "Factchecker | 21B, 23C | Leerdoel: goed — bronkritiek en maatschappelijke duiding sluiten sterk aan..."
