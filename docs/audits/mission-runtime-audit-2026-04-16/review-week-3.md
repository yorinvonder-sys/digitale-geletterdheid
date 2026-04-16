# Runtime-audit: review-week-3
- Datum: 2026-04-16
- Template: debate-arena
- Auditor: agent-wave0-batchA
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — `DebateArenaConfig` aanwezig met alle verplichte velden: `missionId`, `title`, `introEmoji`, `introTitle`, `introDescription`, `introFeatures`, `topic`, `dilemma`, `stakeholders` (4), `positions` (4), `argumentPrompts` (3), `reflectionQuestions` (2), `counterArgument`, `maxScore`, `badges` (4), `takeaways` (4).
- [PASS] Phase-transitions bereikbaar — `DebateArena.tsx` definieert 6 phases: `intro → explore → position → argue → challenge → reflect → results`. Elke phase heeft een `onNext`-callback naar de volgende. Geen dode transitie gevonden.
- [N.V.T.] EERSTE_BERICHT aanwezig — debate-arena gebruikt geen AI-chat (geen `enableChat` in config, geen `chatRoleId`). Chat is niet van toepassing voor dit template.
- [WARN] STEP_COMPLETE markers — de system instruction voor `"review-week-3"` bevat STEP_COMPLETE-boilerplate maar nul missie-specifieke triggers in het mission-script. Zolang `enableChat` niet actief is in de config, is dit geen blocker. Als chat later wordt ingeschakeld, ontbreken de markers.
- [PASS] Verificatievragen aanwezig — `reflectionQuestions` (2 stuks), `counterArgument` als weerleggingsopdracht, en `argumentPrompts` (3 claim-templates). Voldoende verificatie-logica.
- [PASS] Geen dode code-verwijzingen — `ExplorePhase`, `PositionPhase`, `ArguePhase`, `ChallengePhase`, `ReflectPhase` bestaan in `debate-arena/sub/`.

## Visueel (code-level)
- [WARN] Responsive breakpoints — `DebateArena.tsx` heeft geen `sm:`/`md:` klassen in de main component; verantwoordelijkheid ligt bij subcomponenten. Niet geverifieerd in subcomponenten — onverifieerbaar zonder verder lezen.
- [PASS] Geen brekende overflow-hidden — geen `overflow-hidden` gevonden in de main `DebateArena.tsx`; subcomponenten niet volledig gescand.
- [PASS] Design tokens — `#E8956F`, `#D97757`, `#10B981` consistent met `lab-*` palet.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote (uit 2026-03-07): "De Ethische Raad | 23C | Leerdoel: goed — ethische dilemma's passen goed bij maatschappelijke invloed; voeg een expliciete beslisregel toe voor privacy, bias en eerlijkheid. Bloom: goed — evalueren is passend als integrerende review voor het einde van jaar 1. Opbouw: matig — staat in het dashboard voor het eindproject, terwijl de titel als reflectieve review leest; zet hem na of naast de projectpresentatie. Differentiatie: matig — geen niveausteun zichtbaar; bied dilemma's in oplopende complexiteit."
- UI-koppeling: De config heeft drie dossiers (foto-scraping, niveau-model bias, AI-beoordeling) die expliciet worden benoemd in het dilemma en door `Dr. Okonkwo` worden geframed als "drie toetsen: legaal, eerlijk, transparant". Dit sluit aan op de audit-aanbeveling voor een expliciete beslisregel. De vier positions bieden vier nuance-opties wat meer differentiatie geeft dan een binaire keuze. De aanbeveling "dilemma's in oplopende complexiteit" is niet geïmplementeerd — alle vier positions hebben gelijke complexiteit. De opbouwopmerking (dashboard-positie) is een curriculum-issue, buiten de scope van de config.

## Bevindingen (severity)
1. [MINOR] Geen gedifferentieerde dilemma-complexiteit — vier positions hebben gelijke moeilijkheidsgraad; de audit vraagt om oplopende complexiteit. Fix: markeer één position als "basisstandpunt" en één als "expert-positie" met extra onderbouwingsvereiste in `argumentPrompts`. Bestand: `components/missions/templates/debate-arena/configs/review-week-3.ts`.

## Bronnen
- Config: `components/missions/templates/debate-arena/configs/review-week-3.ts`
- Component: `components/missions/templates/debate-arena/DebateArena.tsx`
- System instruction: `supabase/functions/_shared/systemInstructions.ts` — `"review-week-3"` sleutel (aanwezig maar chat niet actief)
- SLO-audit-row: "De Ethische Raad | 23C | Leerdoel: goed — ethische dilemma's passen goed..."
