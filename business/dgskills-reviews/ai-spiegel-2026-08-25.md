# Review: De AI Spiegel (ai-spiegel)
**Datum:** 2026-08-25 · **TemplateType:** simulation-lab

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10
- Drie simulaties (advertentieprofiel, iPad-instellingen, filterbubbel) hebben elk een passend visualisatietype (meter, bar-chart, comparison) dat het concept concreet maakt — sterk voor een privacy/mediawijsheid-onderwerp.
- Kleurgebruik in `computeVisuals` voor sim 2 is decoratief: `locatieValue > 2 ? '#ff3c21' : locatieValue > 0 ? '#ff3c21' : '#e3e2dc'` geeft dezelfde kleur (#ff3c21) voor elke waarde >0 — het onderscheid "matig risico" vs "hoog risico" gaat verloren omdat beide takken identiek zijn.
- Deelt het bekende engine-risico van simulation-lab: bare slash-opacity (`/8`, `/75`) op deze missie-specifieke UI-stukken zou hetzelfde stille-no-op-probleem geven als elders in de engine gemeld — in deze config zelf komt geen losstaande Tailwind-styling voor, dus dit raakt alleen de gedeelde engine (al vastgesteld).
- Badges en sublabel-teksten zijn consistent qua toon en sluiten goed aan bij de duck-huisstijl (kleuren `#202023` / `#ff3c21`).

## Didactiek — score 8/10
- Sterke opbouw: elke simulatie koppelt een tastbare hendel (slider/toggle/select) aan een direct zichtbaar gevolg, en de vragen bouwen daarop voort (waarom-vragen, niet alleen wat-vragen).
- Vraag ap1-q3 en fb1-q2 dwingen genuanceerd denken af (kansen én risico's van personalisatie, gevolgen voor het publieke debat) — dat tilt de missie boven een pure risico-waarschuwing uit.
- Klein punt: bij sim 3 (filterbubbel) is de vraag fb1-q3 ("welke strategie helpt het meest") intern al beantwoord in de `explanation`-tekst van fb1-q2, wat de moeilijkheidsgraad van de laatste vraag verlaagt — geen blocker, wel iets minder onderscheidend.
- Sim 2 se vragen (ip1-q1..q3) herhalen grotendeels dezelfde soort kennischeck (permissie-locatie, permissie-noodzaak, instellingen-pad) zonder een vraag die de leerling een eigen afweging laat maken zoals in sim 1 en 3.

## Tech — score 6/10
- `computeVisuals` is pure, side-effect-vrije TypeScript zonder eval — voldoet aan het patroon dat de engine verwacht.
- Fallback-tak (`return { type: 'meter', data: { value: 0, label: 'Geen data' } }`) vangt een onbekend `simId` af — nette defensieve afhandeling.
- Type-casts (`params['kijktijd'] as number ?? 0`) vertrouwen erop dat de engine altijd het juiste type doorgeeft; bij de gedeelde-engine-bevinding over state-herstel zonder validatie (ontbrekende `parameterValues` na configwijziging) leidt dat hier tot `computeVisuals` die met een lege `params`-object draait — `aanbevelingen` valt dan terug op de fallback-default `'Alles aan'` in de code zelf (regel `params['aanbevelingen'] as string ?? 'Alles aan'`), dus deze config vangt dat gedeeltelijk zelf op; sliders (`kijktijd`, `likes`, `locatieApps` etc.) hebben geen eigen fallback-default in de code en vallen terug op `?? 0`, wat toevallig ook een geldige waarde is — geen crash, maar stil foutief gedrag is niet uit te sluiten bij toekomstige parameter-toevoegingen.
- `maxScore: 100` op configniveau komt overeen met de som van de drie `sim.maxScore`-waarden (30 + 40 + 30 = 100) — consistent, dus het door de engine gemelde risico (som wijkt af van totaal) speelt hier niet.
- Geen missie-specifieke technische issues gevonden buiten wat al in de gedeelde engine is vastgesteld.

## Voorstellen

**1. Kleurdifferentiatie in bar-chart (sim 2) herstellen**

Bestand: `src/features/missions/templates/simulation-lab/configs/ai-spiegel.ts`

Voor:
```ts
color: locatieValue > 2 ? '#ff3c21' : locatieValue > 0 ? '#ff3c21' : '#e3e2dc',
```

Na:
```ts
color: locatieValue > 2 ? '#ff3c21' : locatieValue > 0 ? '#ffb020' : '#e3e2dc',
```
(zelfde patroon toepassen op `cameraValue` en `microfoonValue`, met een tussenkleur voor het middelste risiconiveau.)

## Samenvatting & verdict
De missie 'ai-spiegel' is didactisch sterk: drie concrete, speelse simulaties met vragen die verder gaan dan feitjes ophalen. De enige concrete missie-eigen bevinding is een kleurencode-bug in de bar-chart die risiconiveaus visueel niet onderscheidt — mechanisch te fixen. Overige technische en toegankelijkheidsrisico's zijn eigenschappen van de gedeelde simulation-lab-engine en zijn daar al vastgesteld, niet specifiek aan deze missie.

**Verdict: fix-eerst** (kleine mechanische fix in eigen config; geen herontwerp nodig).
