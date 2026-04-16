# Fix-rapport 2 — DataViewer configs
- Datum: 2026-04-16
- Files gewijzigd:
  - `components/missions/templates/data-viewer/configs/ml-trainer.ts`
  - `components/missions/templates/data-viewer/configs/eindproject-j2.ts`
  - `components/missions/templates/data-viewer/configs/dashboard-designer.ts`
  - `components/missions/templates/data-viewer/configs/data-pipeline.ts`
  - `components/missions/templates/data-viewer/configs/ux-detective.ts`
  - `components/missions/templates/data-viewer/configs/digital-divide-researcher.ts`
  - `components/missions/templates/data-viewer/configs/tech-impact-analyst.ts`
  - `components/missions/templates/data-viewer/configs/sustainability-scanner.ts`
  - `components/missions/templates/data-viewer/configs/research-project.ts`

---

## ml-trainer q1 fix

[OK] `correctAnswer: 50` → `correctAnswer: 42`

Reden: de dataset bevat 5 Spam-rijen (ID 1, 3, 5, 7, 10) en 7 geen-spam-rijen. 5 ÷ 12 × 100 = 41,67%, afgerond 42. De oude waarde (50) klopte niet met de data en de explanation noemde foutief "6 spam-mails (ID 1, 3, 5, 7, 10 en één extra)".

Explanation bijgewerkt naar: "Er zijn 5 spam-mails (ID 1, 3, 5, 7, 10) en 7 geen-spam-mails. 5 ÷ 12 × 100 ≈ 42%. Filter op 'Label' = 'Spam' om te tellen. Deze dataset is licht onevenwichtig — een ideale trainingsdataset is vaker ongeveer 50/50."

**Tolerance-notitie:** DataViewer heeft geen ingebouwde acceptance-range voor `number-input`. Een leerling die `41` invult, krijgt het fout. Aanbeveling voor latere sprint: voeg een optioneel `tolerance` veld toe aan `DataQuestion` (bijv. `tolerance: 1`) zodat `41` en `42` beide geaccepteerd worden.

---

## eindproject-j2 enableChat fix

[OK] Route gekozen: `enableChat: true` + `chatRoleId: 'eindproject-j2'` toegevoegd aan de config.

Reden: `DataViewerConfig` heeft `enableChat?: boolean` en `chatRoleId?: string` als optionele velden (zie `DataViewer.tsx` regel 55-56). Het template ondersteunt dit dus op config-niveau. De registry had al de juiste waarden — de config ontbrak ze alleen. Toevoegen aan de config is de correcte en consistente route. `templateRegistry.ts` is niet gewijzigd.

---

## Patroon-D maxScore fixes (8 missies)

| Missie | Oude som | Delta naar 100 | Nieuwe points reflectie-q |
|---|---|---|---|
| ml-trainer | 90 | 10 | 10 (q8-classificatie-regressie) |
| dashboard-designer | 90 | 10 | 10 (q8-dashboard-reflectie) |
| data-pipeline | 90 | 10 | 10 (q8-pipeline-reflectie) |
| ux-detective | 90 | 10 | 10 (q8-verbetervoorstel) |
| digital-divide-researcher | 90 | 10 | 10 (q8-aanbeveling-formuleren) |
| tech-impact-analyst | 85 | 15 | 15 (q8-eigen-analyse) |
| sustainability-scanner | 90 | 10 | 10 (q8-actieplan) |
| research-project | 90 | 10 | 10 (q8-eigen-beperking) |
| eindproject-j2 | 85 | 15 | 15 (q8-eigen-plan) |

**Noot welzijnsonderzoeker:** geen fix nodig. Deze missie heeft 7 vragen, geen `points: 0` aanwezig. Puntentelling: 20+20+10+15+15+10+10 = 100. Al correct.

---

## Verificatie

TypeScript: PASS — `npx tsc --noEmit` levert geen errors in de data-viewer config-bestanden. Pre-existing errors elders in de codebase zijn ongewijzigd.

---

## Risico's

- **Tolerance ml-trainer q1:** leerlingen die `41` invullen krijgen geen punt. Lage risico voor leerervaring, geen runtime-crash.
- **eindproject-j2 chatRoleId:** de waarde `'eindproject-j2'` is overgenomen uit `templateRegistry.ts`. Als er geen bijbehorende system instruction bestaat voor dit roleId, zal de chat-knop wel verschijnen maar een fout geven bij gebruik. Dit is buiten scope van deze fix.
