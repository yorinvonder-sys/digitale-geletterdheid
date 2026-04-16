# Fix-rapport 4 — ToolGuide bugs
- Datum: 2026-04-16

## RichText \n fix

Bestand: `components/missions/templates/tool-guide/ToolGuide.tsx`, regel 85

Oude className: `{className}`
Nieuwe className: `` {`whitespace-pre-line${className ? ` ${className}` : ''}`} ``

De `RichText`-component renderde `\n` in instructietekst niet als zichtbare regelbreuk. Door `whitespace-pre-line` toe te voegen aan de root `<span>` respecteert de browser nu alle newlines uit de config-tekst. Geen JSX-logica gewijzigd — puur CSS.

## maxScore fixes

| Missie | Oude maxScore | Werkelijke som (4×10 + n×5) | Nieuwe maxScore | Opmerking |
|---|---|---|---|---|
| magister-master | 60 | 4×10 + 3×5 = **55** | 55 | Badge-drempel 55 al correct |
| cloud-commander | 60 | 4×10 + 2×5 = **50** | 50 | Badge-drempel top aangepast 55→45 (lag boven max) |
| word-wizard | 60 | 4×10 + 3×5 = **55** | 55 | Badge-drempel 55 al correct |
| slide-specialist | 60 | 4×10 + 3×5 = **55** | 55 | Badge-drempel 55 al correct |
| print-pro | 60 | 4×10 + 3×5 = **55** | 55 | Badge-drempel 55 al correct |
| mission-launch | 60 | 4×10 + 3×5 = **55** | 55 | Badge-drempel 55 al correct |
| startup-pitch | 60 | 4×10 + 3×5 = **55** | 55 | Badge-drempel 55 al correct |

Puntentelling per missie: 10 pt per stap als checklist volledig is (`CHECKLIST_POINTS_PER_STEP`), + 5 pt per juist beantwoorde verificatievraag (`QUESTION_BONUS`). Stap zonder `verificationQuestion` levert geen bonuspunten op.

## Verificatie

TypeScript (via `npx tsc --noEmit --project tsconfig.json`): **PASS** — geen nieuwe errors in de gewijzigde bestanden.

Grep op `maxScore === 60` hardcoded: **niet gevonden** buiten de config-bestanden zelf. Aanpassing is veilig.

## Risico's

- **Bug 1 (whitespace-pre-line):** Nul risico. CSS-only, geen logica aangepast. Enige effect: bestaande configs met opzettelijke aaneengesloten tekst tonen nu precies het `\n`-patroon zoals in de string. Alle 7 configs gebruiken `\n` voor gewenste lijstopmaak.
- **Bug 2 (maxScore):** Nul risico voor de 6 configs met maxScore→55. Voor cloud-commander (maxScore→50) is ook de top badge-drempel gecorrigeerd van 55→45 (anders was 'Cloud Expert'-badge onbereikbaar). De tweede en derde badge-drempel (40 en 0) waren al bereikbaar en zijn niet gewijzigd.
