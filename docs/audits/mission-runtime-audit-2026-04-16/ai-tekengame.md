# Runtime-audit: ai-tekengame
- Datum: 2026-04-16
- Template: CUSTOM (DrawingGamePreview — geen template-systeem)
- Auditor: agent-wave0-batchA
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missie bestaat; registratie in `config/agentRoleIds.ts`, `config/curriculum.ts`, `config/slo-kerndoelen-mapping.ts`, `config/agents/year1.tsx`; systeem-instructie aanwezig in `systemInstructions.ts`
- [WARN] Geen templateRegistry-entry — `ai-tekengame` ontbreekt in `config/templateRegistry.ts`; de missie wordt afgehandeld via een hardcoded `else if`-tak in `AiLab.tsx:919` die `DrawingGamePreview` laadt. Dit is niet MISSING maar een bewuste architectuurkeuze die afwijkt van het template-systeem.
- [WARN] STEP_COMPLETE markers — de `systemInstructions.ts` bevat slechts `STEP_COMPLETE:1` in het boilerplate-gedeelte; missie-specifieke step-markers (`:2`, `:3`) ontbreken in het mission-scriptgedeelte. Het template-systeem is niet van toepassing (dit is geen chat-gestuurde template), maar de AI-chat is wél ingeschakeld via het systeem.
- [PASS] Eerste bericht aanwezig — systeeminstructie heeft een expliciete STAP 1 intro-tekst die de AI stuurt.
- [PASS] Phase-transitions bereikbaar — DrawingGamePreview heeft eigen gamePhase-state (`intro`, `draw`, `analyzing`, `result`, `complete`); geen dode transitions gevonden.
- [PASS] Canvas-logica aanwezig — `canvas width={400} height={400}` is de resolution-buffer; CSS-scaling via `w-full max-w-[400px] aspect-square` zorgt voor responsive weergave.

## Visueel (code-level)
- [PASS] Responsive breakpoints — canvas gebruikt `w-full max-w-[400px] aspect-square`; `md:` klassen aanwezig op tekstelementen (regel 724, 727).
- [WARN] `overflow-hidden` op game-wrapper — `components/DrawingGamePreview.tsx:680` gebruikt `overflow-hidden` op de root-div; dit is functioneel (voorkomt canvas-overflow) maar kan op kleine schermen het teken-interface afsnijden als min-height ontbreekt.
- [PASS] Design tokens — kleuren consistent met `lab-*` palet (`#FAF9F0`, `#D97757`, `#1A1A19`).

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote (uit 2026-03-07): "Leerdoel: goed — laat beperkingen van patroonherkenning ervaren; voeg expliciet taal toe over trainingsvoorbeelden en interpretatiefouten. Bloom: matig — vooral toepassen/observeren; voeg een analysekaart toe waarin leerlingen verklaren waarom de AI fout raadde. Differentiatie: matig — weinig zichtbaar niveauverschil; bied makkelijke en abstracte woorden plus een reflectiebonus."
- UI-koppeling: De game heeft drie moeilijkheidsniveaus (easy/medium/hard) in de PROMPTS-array, maar de leerling kiest ze niet bewust — ze worden random geserveerd. Er is geen zichtbare analysekaart of reflectiestap nadat een woord verkeerd werd geraden. De audit-aanbeveling ("voeg een analysekaart toe") is niet geïmplementeerd. De koppeling terug naar AI Trainer (zoals de audit vraagt) ontbreekt in de missie-UI.

## Bevindingen (severity)
1. [MINOR] Geen templateRegistry-entry — missie is buiten het standaard template-systeem gebouwd; toekomstige TemplateMissionRouter-updates werken hier niet op. Fix: voeg een custom-entry toe in `config/templateRegistry.ts` of documenteer de afwijking. Bestand: `config/templateRegistry.ts`.
2. [MINOR] STEP_COMPLETE mission-scriptmarkers ontbreken — in `systemInstructions.ts` staat het boilerplate-STEP_COMPLETE-protocol, maar de missie-instructie definieert geen stap 2 of 3. De AI weet niet wanneer stap 2 of 3 klaar is. Fix: voeg in het mission-scriptgedeelte expliciete step-triggers toe voor ronde 2 en 3. Bestand: `supabase/functions/_shared/systemInstructions.ts:43` (ai-tekengame sectie).
3. [MINOR] Geen reflectie/analysekaart na foutieve AI-herkenning — audit vraagt dit expliciet; niet aanwezig in `DrawingGamePreview.tsx`. Fix: voeg na `gamePhase === 'result'` een kort uitlegscherm toe met waarom de AI het goed/fout had.

## Bronnen
- Config: `config/agents/year1.tsx:3574`, `config/slo-kerndoelen-mapping.ts:48`
- Component: `components/DrawingGamePreview.tsx`
- System instruction: `supabase/functions/_shared/systemInstructions.ts` — `"ai-tekengame"` sleutel
- SLO-audit-row: "AI Tekengame | 21D | Leerdoel: goed — laat beperkingen van patroonherkenning ervaren..."
