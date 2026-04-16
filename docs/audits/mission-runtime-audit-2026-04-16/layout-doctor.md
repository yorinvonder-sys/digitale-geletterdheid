# Runtime-audit: layout-doctor
- Datum: 2026-04-16
- Template: legacy-standalone
- Auditor: agent-wave2-legacy
- Status: WARN

## Functioneel (code-level)
- [PASS] Component bestaat + geroute — `components/missions/review/LayoutDoctorMission.tsx` gebruikt als sub-component van `WordSimulator`; route in `AuthenticatedApp.tsx:621`
- [WARN] State-machine compleet — `layout-doctor` route rendert `WordSimulator` (niet `LayoutDoctorMission` direct). `LayoutDoctorMission.tsx` bestaat als standalone bestand maar wordt in AuthenticatedApp genegeerd; `WordSimulator` heeft eigen levels via `LEVELS` array (L1002). Routing is indirect — twee bestanden voor dezelfde functie is verwarrend.
- [N.V.T.] EERSTE_BERICHT — geen AI-chat
- [PASS] Completion-flow (XP award) — `AuthenticatedApp.tsx:624`: `onLevelComplete={() => handleMissionComplete('layout-doctor')}`; `WordSimulator` roept `onLevelComplete(1)` aan op L534
- [PASS] Geen dode refs — `LayoutDoctorMission.tsx` importeert `useMissionAutoSave` en `lucide-react` — alles bestaat. NB: `LayoutDoctorMission.tsx` zelf is niet geroute en dus dead code in de huidige routing.

## Visueel (code-level)
- [PASS] Responsive — `WordSimulator` is volledig responsive; ribbon en document-canvas gebruiken flexbox
- [WARN] Hardcoded widths — `LayoutDoctorMission.tsx` (het niet-geroutede bestand) heeft `min-w-[60px]` voor toolbar-knoppen (L171, L174) — irrelevant want niet geroute
- [PASS] Overflow — `WordSimulator` handles overflow via `DocumentCanvas`
- [WARN] Design tokens — hardcoded hex in `LayoutDoctorMission.tsx`; `WordSimulator` gebruikt `DOMPurify` (positief voor security)

## Didactiek
- SLO-audit quote: "Layout Doctor | 21A — Leerdoel: goed - sluit aan op functioneel werken met Word; maak de succescriteria per fouttype expliciet. Bloom: matig - vooral toepassen; voeg 1 analysecase toe waarin de leerling de oorzaak van een fout benoemt. Opbouw: onvoldoende - als review staat hij te vroeg in de periode."
- UI-koppeling: `WordSimulator` is een volwaardige Word-simulator met ribbon, documentcanvas en levels — dat is precies de "functioneel werken met Word" intentie. De audit vraagt om expliciete succescriteria per fouttype; het component toont in-line berichten (`changeExplanation`, `inlineMessage`) maar geen gestructureerde rubric.

## Bevindingen (severity)
1. [MAJOR] `LayoutDoctorMission.tsx` bestaat als standalone component maar wordt niet geroute — `AuthenticatedApp.tsx:621` rendert `WordSimulator` ipv `LayoutDoctorMission`. Het standalone bestand is dead code. Dit geeft verwarring bij onderhoud. — fix: verwijder `components/missions/review/LayoutDoctorMission.tsx` of hernoem naar documentatie
2. [MINOR] `LayoutDoctorMission.tsx` in `components/missions/review/` is een apart standalone component dat dezelfde functie biedt als `WordSimulator`. Er is geen lazy-import van `LayoutDoctorMission` in `AuthenticatedApp.tsx` — het bestand is volledig los en onbereikbaar via routing.

## Bronnen
- Component: `components/missions/review/LayoutDoctorMission.tsx` (niet geroute), `components/WordSimulator/WordSimulator.tsx` (daadwerkelijk geroute)
- Routing: `AuthenticatedApp.tsx:621`
