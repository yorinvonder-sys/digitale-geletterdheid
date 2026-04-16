# Runtime-audit: future-forecaster
- Datum: 2026-04-16
- Template: debate-arena
- Auditor: agent-wave0-batchC
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, topic, dilemma, stakeholders (4), positions (4), argumentPrompts (3), reflectionQuestions (2), counterArgument, maxScore, badges, takeaways aanwezig
- [PASS] Phase-transitions bereikbaar — identiek patroon aan andere debate-arena missies; alle 7 fasen bereikbaar
- [N.V.T.] EERSTE_BERICHT — debate-arena heeft geen enableChat. System-instructie voor `future-forecaster` aanwezig in systemInstructions.ts (regel 70) maar wordt niet aangeroepen vanuit dit template. Ongebruikte system-instructie (zelfde issue als digital-rights-defender).
- [PASS] STEP_COMPLETE ≥ 3 — N.V.T. voor debate-arena; scoring via calcScore()
- [WARN] Verificatievragen — géén explorationQuiz gedefinieerd (veld ontbreekt in config); digital-rights-defender heeft er wél één. Beide zijn debate-arena J2P4, maar future-forecaster mist de bonusvraag. Score-ceiling daardoor 95 i.p.v. 100 bij digital-rights-defender.

## Visueel (code-level)
- [PASS] Responsive — `max-w-md mx-auto` + `p-4` consistent
- [PASS] Overflow — geen hardcoded pixels
- [WARN] Design tokens — badge kleur `#2563EB` en `#3B82F6` wijken af van lab-token-spectrum dat in andere missies wordt gebruikt; technisch functioneel maar inconsistent met design-systeem

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote: "Future Forecaster | 21D, 23C | Leerdoel: goed [...] Opbouw: goed - toekomstdenken werkt logisch na ethische discussies; laat leerlingen expliciet teruggrijpen op huidige voorbeelden. Differentiatie: matig - open scenario kan te breed worden; bied een trendset voor basis en vrije trendkeuze voor verdieping."
- UI-koppeling: Stakeholders zijn concreet en divers (leerling 2040, leraar, futuroloog, minister). Aanbeveling om terug te grijpen op "huidige voorbeelden" is deels verwerkt via Dr. Guo's perspectief. Trendset voor basisdifferentiatie is niet geïmplementeerd.

## Bevindingen (severity)
1. [MINOR] Ontbrekende explorationQuiz — digital-rights-defender (zelfde template, zelfde periode) heeft een bonusvraag; future-forecaster niet. Dit veroorzaakt score-inconsistentie tussen J2P4-missies — fix: `components/missions/templates/debate-arena/configs/future-forecaster.ts` (voeg explorationQuiz toe)
2. [MINOR] Ongebruikte system-instructie — `future-forecaster` key in systemInstructions.ts:70 nooit aangeroepen vanuit template — fix: zie digital-rights-defender bevinding 1
3. [MINOR] Badge-kleurinconsistentie — `#2563EB`/`#3B82F6` buiten lab-token-palet — fix: `components/missions/templates/debate-arena/configs/future-forecaster.ts` (badges array)

## Bronnen
- Config: `components/missions/templates/debate-arena/configs/future-forecaster.ts`
- Component: `components/missions/templates/debate-arena/DebateArena.tsx`
- SLO-audit-row: "Future Forecaster | 21D, 23C | Leerdoel: goed [...] Differentiatie: matig" (`docs/audits/didactische-audit-missies-2026-03-07.md:119`)
