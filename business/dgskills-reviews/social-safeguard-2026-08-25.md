# Review: Social Safeguard

**Datum:** 2026-08-25
**TemplateType:** scenario-engine (4 rondes: select-correct, order-priority, binary-choice, select-correct)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 7/10

De config bevat geen eigen UI-code (templateType scenario-engine); alle presentatie loopt via de gedeelde `ScenarioEngine.tsx`. Bevindingen zijn dus vrijwel volledig engine-erfenis, niet missie-specifiek.

- **Blocking (geërfd van engine):** onder 40% score is de eindknop uitgeschakeld en er is geen uitweg (geen `onRetry`, geen `onBack`) — leerlingen die scenario 1/4/... verkeerd doen kunnen vastlopen (`ScenarioEngine.tsx:328`). Raakt social-safeguard net zo hard als de andere 11 scenario-missies.
- **Warning (geërfd):** geen focusbeheer bij rondewisseling (`ScenarioEngine.tsx:289`) — bij 4 rondes wisselt de leerling 3 keer van scherm zonder aankondiging voor toetsenbord-/schermlezergebruikers.
- **Warning (geërfd):** contrastwaarden op gedeelde tekststijlen (`text-duck-ink/50`, `text-duck-ink/60`, `bg-duck-error text-white`) onder WCAG AA — raakt o.a. `SpotTheFlagsRound`/`OrderPriorityRound`, dus ook de order-priority-ronde van deze missie (ronde 2).
- **Missie-specifiek, info:** de itemteksten zijn consistent qua lengte en toon (icon + titel + korte beschrijving), geen uitschieters. Geen extra design-issues in de config zelf gevonden.

## Didactiek — score 8/10

- **SLO-codes:** `sloKerndoelen: ['23B', '23A']` (Digitaal welzijn, Veiligheid & privacy) + `sloVsoKerndoelen: ['20A', '20B']` — beide geldige codes, passend bij het onderwerp (online conflicten, privacy-instellingen). Twee codes, geen overclaim.
- **SLO-fit:** goed onderbouwd — ronde 1 en 3 raken 23B (digitaal welzijn: pesten, omstandereffect, escalatie), ronde 4 raakt 23A (privacy-instellingen, wachtwoorden, metadata) substantieel, niet oppervlakkig.
- **Leerdoelen:** impliciet via `takeaways` (5 stuks) en `introFeatures` — helder geformuleerd, geen jargon zonder uitleg (doxing, social engineering, catfishing worden allemaal tussen haakjes uitgelegd — goede praktijk voor leerjaar 1).
- **Curriculum-plek:** leerjaar 1, week 3, na `deepfake-detector`/`ai-spiegel` en vóór `veilig-internet`/`scroll-stopper` — logische opbouw van privacy/veiligheid-thema.
- **Bloom-balans:** ronde 1 (herkennen), ronde 2 (ordenen/toepassen), ronde 3 (beoordelen/toepassen), ronde 4 (herkennen) — vooral herkennen/toepassen, weinig analyseren/evalueren voor een missie met 4 rondes. Lichte eenzijdigheid, geen blokkerend probleem.
- **Warning:** item 2 in ronde 3 ("Vriend vraagt om de pesterij door te sturen") heeft `correct: false` voor "niet ingrijpen" — maar de titel van de ronde is "Ingrijpen of niet?" met labels "Ingrijpen"/"Niet ingrijpen". Bij dit item is "niet ingrijpen" de juiste keuze (niet doorsturen), wat inhoudelijk klopt, maar leerlingen die de vraag lezen als "moet ik iets doen" kunnen in de war raken omdat weigeren ook een actieve keuze is. De explanation lost dit gelukkig goed op ("Niet doen. Doorsturen vergroot...").

## Tech — score geen aparte score; engine-bevindingen van toepassing

De engine is al beoordeeld (zie `engine-scenario-engine.json`); hieronder alleen wat social-safeguard concreet raakt.

- **Niet van toepassing:** de missiedoel-drempel-mismatch (engine-bevinding #2, 40% vs 60%) raakt social-safeguard NIET — `missionGoals.ts:218` gebruikt `criteria.type: 'rounds-complete'`, niet een numerieke `threshold`. Dit is dus geen risico voor deze missie.
- **Wél van toepassing (blocking, geërfd):** het dead-end-eindscherm onder 40% (engine-bevinding #1) geldt voor alle scenario-missies inclusief deze.
- **Warning (geërfd, van toepassing):** `scoreOrderPriority` heeft geen gokcorrectie — ronde 2 (`safe-act-volgorde`, 5 items, maxScore 25) is precies het scenario uit de engine-analyse: van boven naar beneden klikken zonder lezen levert gemiddeld ~9/25 op, en bij 16% van de leerlingen ≥15 punten (drempel voor "Bijna foutloos"-feedback). Dit is een reële zwakte specifiek voor déze ronde.
- **Niet van toepassing:** de sleepvolgorde-lek (OrderDragRound, per-leerling seed ontbreekt) geldt alleen voor `order-drag`-rondes; social-safeguard gebruikt `order-priority` (klikversie, met seed) — geen risico hier.
- **Config-only check:** geen `any`-types, geen edge-function-calls, geen custom handlers in de config zelf — puur declaratieve data, dus A1-A7 (tech-skill) zijn niet van toepassing op dit bestand; ze gelden op engine-niveau en zijn daar al beoordeeld.
- **Registratie:** `templateRegistry.ts:15`, `curriculum.ts:112`, `slo-kerndoelen-mapping.ts:72`, `missionGoals.ts:218` zijn alle vier consistent aanwezig en corresponderen op `missionId: 'social-safeguard'`. Geen mismatch gevonden.

---

## Voorstellen

Geen van de gevonden problemen is oplosbaar binnen de scope van dit configbestand (auto-fixable whitelist) — het zijn engine-brede kwesties (`ScenarioEngine.tsx`, `FeedbackBanner.tsx`) of registratie die al correct staat. Er is dus geen voor/na-snippet voor social-safeguard zelf.

Suggestie op engine-niveau (niet in deze missie uit te voeren, ter info voor de sweep-orchestrator):

```ts
// vóór — sub/FeedbackBanner.tsx, scoreOrderPriority (illustratief)
function scoreOrderPriority(selections, items) {
  return selections.reduce((sum, id, idx) => {
    const item = items.find(i => i.id === id);
    if (item.correctPosition === idx) return sum + full;
    if (Math.abs(item.correctPosition - idx) === 1) return sum + half;
    return sum;
  }, 0);
}

// ná — normaliseer tegen een kansbasislijn zoals scoreBinaryChoice al doet
function scoreOrderPriority(selections, items) {
  const raw = /* zelfde berekening */;
  const baseline = expectedRandomScore(items.length, full, half);
  return Math.max(0, normalize(raw, baseline, maxScore));
}
```

---

## Samenvatting

Social-safeguard is een inhoudelijk sterke missie: de scenario's zijn realistisch, de uitleg per item is didactisch goed onderbouwd (jargon uitgelegd, consequenties concreet), en de SLO-koppeling (23A/23B) is terecht. De missie loopt géén risico op de engine's ernstigste bug (40%-vs-60%-drempelmismatch), omdat hij `rounds-complete` gebruikt. Wel erft hij de bredere engine-gebreken: het onder-40%-dead-end-scherm (blocking, alle scenario-missies) en de gokcorrectie-zwakte in `order-priority`-scoring (warning, raakt ronde 2 direct). Geen van deze is fixbaar binnen de missieconfig zelf — beide horen bij de gedeelde engine en zijn al als escalatie vastgelegd.

**Verdict: fix-eerst** — niet vanwege een fout in deze config, maar omdat de missie via de gedeelde engine blootstaat aan een blocking dead-end-bug die alle 12 scenario-missies raakt.
