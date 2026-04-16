# Runtime-audit: eindproject-j2
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave2-dataviewer
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — title, 3 datasets (table, bar-chart, document-cards), questions, answers, badges, takeaways aanwezig. `enableChat: true`, `chatRoleId: 'eindproject-j2'` aanwezig in config via `templateRegistry.ts:80`.
- [PASS] Data/antwoord-consistentie — geverifieerd:
  - q1: App-ontwerp gem. = (7.7+8.3+8.3+7.3)/4 = 7,9. Video/animatie = (8.0+7.0+8.3)/3 = 7,77. App-ontwerp wint ✓
  - q2: Chiara: (9+6+9)/3 = 8,0 — "9 voor presentatie compenseert lage techniek" ✓
  - q4: 7,9 − 6,8 = 1,1 ✓
  - q7: Tip 1 (probleem dat jou bezighoudt) → Elif+Iris hoge originaliteit ✓
- [PASS] EERSTE_BERICHT — systemInstruction aanwezig in `supabase/functions/_shared/systemInstructions.ts:72`. De instruction bevat: rol als eindproject-coach, SLO-koppeling, STEP_COMPLETE patroon (`---STEP_COMPLETE:X---`), XP-farming detectie, welzijnsprotocol. STEP_COMPLETE patroon-A is aanwezig en consistent met andere missies met `enableChat: true`.
- [WARN] `enableChat: true` in de DataViewerConfig staat NIET in de config-file `eindproject-j2.ts` zelf. Het staat in `templateRegistry.ts:80`. De DataViewer leest `config.enableChat` van de geladen config (zie `DataViewer.tsx:653`). De config-file exporteert alleen `eindprojectJ2Config` zonder `enableChat` veld. **De chat-knop wordt dus NIET getoond** omdat `config.enableChat` undefined is wanneer geladen via `import('./configs/eindproject-j2.ts')`.
- [WARN] q8 heeft `points: 0`. Optelling: q1(15)+q2(15)+q3(10)+q4(10)+q5(10)+q6(10)+q7(15)+q8(0) = 85. maxScore: 100. Gat van 15 punten.
- [PASS] Terminal states — 3 datasets → results bereikbaar.

## Visueel (code-level)
- [PASS] Responsive — max-w-lg + px-4.
- [PASS] Tabel/grafiek-overflow — 6-koloms projecttabel; bar-chart via SimpleChart.
- [PASS] Design tokens — consistent.

## Didactiek
- SLO-audit quote: "Leerdoel: matig - de missie is rijk, maar de SLO-koppeling is erg breed en niet zichtbaar uitgewerkt; maak een rubric waarin per kerndoel concreet bewijs staat." (didactische-audit-2026-03-07, LJ2 P4)
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:142` → alle LJ2 kerndoelen (capstone). Passend als eindproject-voorbereidingmissie.
- UI-koppeling: Tabel met echte leerlingscores biedt empirische basis voor q1/q2/q3. Bar-chart met gemiddelden per type helpt bij q4/q5. document-cards (tips van leerlingen) koppelen direct aan q7/q8 (reflectievragen).

## Bevindingen (severity)
1. [BLOCKER] Chat-knop verschijnt niet — `enableChat: true` staat in `templateRegistry.ts:80` maar NIET in `configs/eindproject-j2.ts`. `DataViewer.tsx:653` controleert `config.enableChat` van de geladen config-file. Die bevat dit veld niet → chat-overlay wordt nooit gerenderd. systemInstruction is wél aanwezig maar bereikbaar voor niemand. — fix: voeg `enableChat: true, chatRoleId: 'eindproject-j2'` toe aan `eindprojectJ2Config` in `configs/eindproject-j2.ts`.
2. [MINOR] maxScore mismatch — scoreerbare punten = 85, maxScore = 100. — fix: `configs/eindproject-j2.ts` — wijzig `maxScore: 85` of geef q8 15 punten.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/eindproject-j2.ts`
- Registry: `config/templateRegistry.ts:80`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts:72`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx:653`
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:142`
- Didactische audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (LJ2 P4)
