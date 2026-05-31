# Assessment Agent Rules

Assessment is Geel/Rood-risico. Het raakt nulmeting, eindmeting, leerlinggroei, rapportage en SLO-bewijsvoering.

## Lees Eerst

- `src/features/assessment/README.md`
- `src/features/assessment/types.ts`
- `src/features/assessment/data/assessmentRegistry.ts`
- `src/features/assessment/AssessmentEngine.tsx`

## Regels

- Houd assessment data, task types en engine-aanpassingen in dit domein.
- Verander scoring, completion of rapportagebetekenis niet zonder expliciete productreden.
- Copy mag leerlingvriendelijker, maar mag de meetintentie niet veranderen.
- Check of wijzigingen effect hebben op docentrapportage of SLO-dekking.

## Proof

Minimaal `npm run doctor`. Bij flow-, scoring- of registrywijzigingen ook `npm run build:prod` en een browsercheck van de geraakte assessmentflow.
