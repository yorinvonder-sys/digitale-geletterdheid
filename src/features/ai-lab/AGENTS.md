# AI Lab Agent Rules

AI Lab is Geel/Rood-risico wanneer prompts, provider calls, leerlinginput of Edge Functions geraakt worden.

## Lees Eerst

- `src/features/ai-lab/README.md`
- `src/features/ai-lab/AiLab.tsx`
- `src/features/ai-chat/`
- `src/services/geminiService.ts`
- `src/services/geminiImageLogic.ts`
- `supabase/functions/`

## Regels

- Provider secrets blijven server-side.
- Prompt- en chatwijzigingen moeten prompt-injection, leerlingveiligheid en fallbackgedrag meenemen.
- AI Lab mag previews uit andere features importeren, maar voorkom dat demo-imports productflows vervuilen.
- Grote previewcomponenten horen lazy of lokaal, zodat publieke routes niet onnodig groeien.

## Proof

Minimaal `npm run doctor`. Bij prompt/API/Edge Function wijzigingen ook `npm run build:prod` en een gerichte AI-flowcheck met veilige testinput.
