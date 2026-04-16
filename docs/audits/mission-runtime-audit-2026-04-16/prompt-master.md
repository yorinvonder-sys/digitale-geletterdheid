# Runtime-audit: prompt-master
- Datum: 2026-04-16
- Template: legacy-standalone
- Auditor: agent-wave2-legacy
- Status: WARN

## Functioneel (code-level)
- [PASS] Component bestaat + geroute — `components/missions/PromptMasterMission.tsx` → `AuthenticatedApp.tsx:644`
- [PASS] State-machine compleet — 3 phases: `intro → challenge → result`; overgang op `setPhase('result')` (L733) en `setPhase('challenge')` (L819)
- [N.V.T.] EERSTE_BERICHT — geen `StudentAIChat`; missie gebruikt directe Gemini-calls via `createChatSession('prompt-master')` + `generateImage` (client-side)
- [PASS] Completion-flow (XP award) — `clearSave(); onComplete(passed)` op L1271; `handleMissionComplete` in AuthenticatedApp (L648–651) roept `awardXP` aan
- [WARN] Geen dode refs — importeert `createChatSession`, `generateImage`, `sendMessageToGemini`, `isImageGenerationSuccess`, `ImageGenerationFailure`, `ImageGenerationResult` uit `geminiService.ts` — alle 6 exports bestaan. Wel: `geminiService` doet directe client-side calls naar Vertex AI, terwijl de rest van de app via Edge Functions gaat. Dit is een architectuurafwijking (geen BLOCKER, maar inconsistent).

## Visueel (code-level)
- [PASS] Responsive — `h-dvh overflow-y-auto` basiscontainer (L759, L852, L1209); textarea gebruikt `md:min-h-[100px]`
- [PASS] Hardcoded widths — geen `w-[...px]` of `max-w-[...px]` gevonden
- [PASS] Overflow — containers hebben correcte `overflow-y-auto` / `overflow-hidden`
- [WARN] Design tokens — gebruikt hardcoded hex (#FAF9F0, #1A1A19, #D97757, #E8E6DF) in className; geen `lab-*` tokens. Consistent met andere legacy-missies maar afwijkend van token-standaard.

## Didactiek
- SLO-audit quote: "Prompt Perfectionist | 21D, 22A — Leerdoel: goed - sterke match met AI verkennen en digitaal product sturen; voeg een expliciete transfer toe naar een andere AI-tool. Bloom: goed - creeren en evalueren met feedbacklus is zeer passend voor leerjaar 1."
- UI-koppeling: Component implementeert iteratieve prompt → feedback → verbeteren-loop die exact aansluit bij de "creëren en evalueren"-intentie uit de SLO-audit. Drie niveaus (beginner/gevorderd/expert) geven oplopende complexiteit — dat compenseert de eerder gesignaleerde differentiatieleemte. Challenge-types (image/text/help/code) dekken meerdere AI-tool-contexten.

## Bevindingen (severity)
1. [MINOR] Directe client-side Gemini-calls via `geminiService.createChatSession` en `generateImage` — alle andere AI-missies gaan via Edge Functions (`chat`, `chatStream`). Bij auth-rotatie of rate-limiting is PromptMaster het kwetsbaarste punt. — fix: `services/geminiService.ts:540` + `PromptMasterMission.tsx:322`

## Bronnen
- Component: `components/missions/PromptMasterMission.tsx`
- Routing: `AuthenticatedApp.tsx:644`
