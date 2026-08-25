# Review: tech-impact-analyst (data-viewer)
25-08-2026

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10

✅ Config-only missie, geen eigen UI-code; layout/spacing/tokens komen volledig uit de gedeelde `DataViewer`-engine (al beoordeeld, zie engine-bevindingen).
⚠️ Badge-kleuren: 3 van de 4 badges (`85`, `65`, `0`) gebruiken exact dezelfde kleur `#202023`; alleen de `40`-drempel krijgt `#e1ff01`. Een leerling ziet dus visueel geen verschil tussen "Tech Impact Expert!" (85+) en "Aan de slag!" (0+) — de badge-kleur communiceert niets over voortgang.
⚠️ Geërfd van de engine (niet mission-specifiek, alleen genoemd): het resultatenscherm zonder `onRetry` (blocking) raakt deze missie net zo hard als elke andere data-viewer-missie, omdat de drempel op 65 ligt (`missionGoals.ts`) — een leerling die net onder de 40%-engine-drempel zit komt vast te zitten.

## Didactiek — score 6.5/10

✅ Vier-stappenmethode (Stap 1-4) is helder en leeftijdspassend voor leerjaar 3 geformuleerd; opdrachten dwingen afweging van voor- en nadelen af (Bloom: analyseren/evalueren) naast feitenvragen (q1, q5 — onthouden/toepassen).
✅ Bloom-balans is goed gespreid: reken/telvragen (q1, q5), toepassing (q2, q7), evaluatie/redenering (q3, q6, q8).
⚠️ **SLO-mismatch 21D (AI):** `sloEntry.sloKerndoelen` claimt `['23C', '21D']`. Van de 8 vragen en 3 datasets gaat er precies **één** vraag (q8, laatste vraag van dataset 3) over een AI-systeem (TikTok-aanbevelingsalgoritme); alle overige content (drones, luchtruim, werkgelegenheid) heeft niets met AI te maken. Dit is oppervlakkig contact met 21D, geen substantiële oefening — de missie is in de kern een 23C-missie (maatschappelijke impact van technologie) met AI als bijzin.
✅ Opdracht-beknoptheid: introDescription en dataset-beschrijvingen zijn kort en to-the-point, passend bij leerjaar 3.

## Tech — score n.v.t. (config-only, engine bepaalt)

Geen mission-specifieke technische bevindingen buiten de gedeelde engine. Gecontroleerd en correct:
- Puntentelling klopt: 15+15+10+10+10+10+15+15 = 100 = `maxScore` (een veelvoorkomende fout elders in de sweep, hier niet aanwezig).
- `source.kind: 'synthetic'` met `methodNote` is consequent op alle drie datasets toegepast (voorkomt dat leerlingen gesimuleerde cijfers als echte statistiek lezen).

Overige technische issues (geen `onRetry`, `clearSave()` vóór bevestigde opslag, dubbele score-drempel, geen guard tegen dubbele `onComplete`) zitten in `DataViewer.tsx` en zijn al vastgelegd in de gedeelde engine-bevindingen; niet opnieuw hier gescoord.

## Voorstellen

### 1. Badge-kleuren differentiëren (design)
Bestand: `src/features/missions/templates/data-viewer/configs/tech-impact-analyst.ts`

Voor:
```ts
badges: [
    { minScore: 85, emoji: '🔎', title: 'Tech Impact Expert!', color: '#202023' },
    { minScore: 65, emoji: '⚖️', title: 'Kritisch Analist', color: '#202023' },
    { minScore: 40, emoji: '🔬', title: 'Impact Onderzoeker', color: '#e1ff01' },
    { minScore: 0, emoji: '📚', title: 'Aan de slag!', color: '#202023' },
],
```
Na (indicatief — pas exacte hex aan aan bestaande duck-palet):
```ts
badges: [
    { minScore: 85, emoji: '🔎', title: 'Tech Impact Expert!', color: '#202023' },
    { minScore: 65, emoji: '⚖️', title: 'Kritisch Analist', color: '#ff3c21' },
    { minScore: 40, emoji: '🔬', title: 'Impact Onderzoeker', color: '#e1ff01' },
    { minScore: 0, emoji: '📚', title: 'Aan de slag!', color: '#ffffff' },
],
```

### 2. 21D-claim heroverwegen (didactiek)
Bestand: `src/config/slo-kerndoelen-mapping.ts`, entry `tech-impact-analyst`

Voor:
```ts
{ id: 'tech-impact-analyst', title: 'Tech Impact Analyst', week: 3, yearGroup: 3, sloKerndoelen: ['23C', '21D'] },
```
Na (als 21D niet substantiëler wordt uitgewerkt in de content):
```ts
{ id: 'tech-impact-analyst', title: 'Tech Impact Analyst', week: 3, yearGroup: 3, sloKerndoelen: ['23C'] },
```
Alternatief (behoud 21D, maak de claim waar): voeg een vierde dataset of extra vragen toe die een AI-systeem (niet alleen drones) als hoofdonderwerp analyseren met de vier-stappenmethode.

## Samenvatting & verdict

De missie zelf is inhoudelijk sterk: een eerlijke, evenwichtige impact-analyse met een consistente vier-stappenmethode, correcte puntentelling en goede Bloom-spreiding. Twee concrete verbeterpunten zijn mission-specifiek (badge-kleurdifferentiatie, 21D-claim die nauwelijks wordt waargemaakt); de zwaarste problemen (geen retry-pad bij falen, opslag gewist vóór bevestigde voltooiing) zitten in de gedeelde `DataViewer`-engine en gelden voor alle data-viewer-missies, niet uniek voor deze.

**Verdict: fix-eerst** — de engine-blockers (geen `onRetry`, premature `clearSave()`) moeten centraal in `DataViewer.tsx` worden opgelost vóórdat deze missie zonder risico naar leerlingen kan; de mission-specifieke punten (badge-kleuren, 21D-claim) zijn licht en kunnen los daarvan worden meegenomen.
