# Review: Code Reviewer (simulation-lab)
Datum: 2026-08-25 · templateType: simulation-lab

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7.5/10
- **[warning]** Sim 3 ("Alleen positief") mengt een afbeelding-icon (`/assets/brand/ui-icons/dgskills-duck-happy.webp`) met emoji-icons (👍, 🙈) in dezelfde `leftItems`-lijst, terwijl de andere twee methode-varianten (Afkraken, Sandwich) uitsluitend emoji gebruiken. Inconsistente icon-typografie binnen dezelfde comparison-component.
- **[info]** Kleurgebruik in Sim 2 (bar-chart) is functioneel duidelijk: rood (`#ff3c21`) voor probleem-toggles, zwart/grijs voor de goede toggle — consistent met bestaande missiepatronen.
- Geen engine-brede design-bevindingen (zoals de `bg-duck-acid/8`-contrastbug) die deze specifieke config-inhoud raken buiten wat al in de engine-scan staat.

## Didactiek — score 8/10
- Score-verdeling is intern consistent: som van vraagpunten per simulatie (30/40/30) komt exact overeen met `sim.maxScore`, en de som (100) komt overeen met `config.maxScore` — geen scoring-drift.
- Vragen zijn concreet en leerdoelgericht (naamgeving, magische getallen, sandwich-feedback) met heldere explanations die het "waarom" uitleggen — sluit aan bij het 3-stappen-principe (erkenning/uitleg/challenge) al zit de challenge in de simulatie-parameters, niet in de vraagtekst zelf.
- **[warning]** `naamgeving`-slider (0/1/2) heeft geen zichtbare labels voor de tussenwaarden in de config zelf — de leerling ziet alleen een slider van 0 tot 2 zonder tekstuele feedback per stand (bijv. "slecht/matig/goed"). De score-logica kent wel betekenis toe (0/15/30) maar dat is voor de leerling niet af te lezen tijdens het schuiven.
- **[info]** De drie simulaties dekken leesbaarheid, DRY en feedback — een compacte maar representatieve steekproef van code-review-vaardigheden voor onderbouw VO; past bij missionGoal en SLO's 22A/22B (codekwaliteit + productkwaliteit).

## Tech — score 8/10
- `computeVisuals` is pure TypeScript, geen `eval`, nette switch/if-structuur — voldoet aan projectconventies.
- Params worden met `as number`/`as boolean`/`as string` gecast zonder runtime-validatie, maar dit is een bekend, geaccepteerd patroon binnen simulation-lab-configs (params komen uit vaste `parameters`-definities in dezelfde config, dus laag risico).
- **[info]** Engine-brede bevindingen die deze missie raken (uit de gedeelde engine-scan, niet opnieuw beoordeeld): CompletionScreen zonder `onRetry` bij score <40% (blocking, engine-niveau), ontbrekende idempotentie-guard op afronden (blocking, engine-niveau), en de "eerst experimenteren"-poort die met één klik opengaat (warning, engine-niveau). Deze missie-config voegt geen extra instantie van deze problemen toe en heeft geen mission-specifieke workaround nodig.
- Geen mission-specifieke technische issues gevonden in `code-reviewer.ts` zelf (geen dode code, geen ontbrekende fallback — de `Fallback`-return op regel 143 vangt onbekende `simId`'s netjes af).

## Voorstellen

### 1. Icon-consistentie in Sim 3 (design)
Bestand: `src/features/missions/templates/simulation-lab/configs/code-reviewer.ts`

Voor:
```ts
leftItems: [
    { icon: '/assets/brand/ui-icons/dgskills-duck-happy.webp', label: '"Ziet er goed uit!"' },
    { icon: '👍', label: '"Prima gedaan!"' },
    { icon: '🙈', label: 'Problemen bewust niet noemen' },
],
```
Na:
```ts
leftItems: [
    { icon: '😊', label: '"Ziet er goed uit!"' },
    { icon: '👍', label: '"Prima gedaan!"' },
    { icon: '🙈', label: 'Problemen bewust niet noemen' },
],
```

### 2. Tussenwaarden zichtbaar maken op de naamgeving-slider (didactiek)
Bestand: `src/features/missions/templates/simulation-lab/configs/code-reviewer.ts`

Voor:
```ts
{
    id: 'naamgeving',
    label: 'Naamgeving variabelen',
    type: 'slider',
    min: 0,
    max: 2,
    step: 1,
    default: 0,
},
```
Na:
```ts
{
    id: 'naamgeving',
    label: 'Naamgeving variabelen (0=slecht: x, abc · 1=matig · 2=goed: beschrijvend)',
    type: 'slider',
    min: 0,
    max: 2,
    step: 1,
    default: 0,
},
```

## Samenvatting & verdict
De code-reviewer-missie is inhoudelijk sterk: scoring klopt intern, de drie simulaties zijn representatief voor het onderwerp, en de config bevat geen technische fouten of dode paden. De twee gevonden punten zijn beide klein en niet-blokkerend (icon-inconsistentie, ontbrekende sliderlabels). De blocking-issues uit de engine-scan (CompletionScreen zonder retry, geen idempotentie-guard) zijn engine-breed en worden niet opnieuw per missie opgelost.

**Verdict: ok** (met twee kleine, niet-blokkerende verbeterpunten op design/didactiek-niveau).
