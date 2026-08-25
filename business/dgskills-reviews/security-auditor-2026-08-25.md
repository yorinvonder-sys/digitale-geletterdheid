# Review: Security Auditor (puzzle-lab)

**Datum:** 2026-08-25
**TemplateType:** puzzle-lab
**Bestand:** `src/features/missions/templates/puzzle-lab/configs/security-auditor.ts`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10

De content is zelf design-neutraal (puzzle-lab is een gedeelde engine), maar twee engine-gebreken raken deze missie concreet:
- **Vastloop-risico op het eindscherm.** Threshold in `missionGoals.ts` staat op 70, badge-drempel "Junior Auditor" op 40. Een leerling die onder de 40% blijft (bijv. 2 van 4 puzzels fout + geen hints) krijgt een uitgeschakelde afrondknop zonder `onRetry` — engine-bug, maar met een 4-puzzel/25-punten structuur is 40% (1 puzzel) makkelijk te missen.
- **Hover-contrastbug** op hint- en actieknoppen (`text-duck-gray/70 hover:text-duck-ink` op `bg-duck-ink`) treft ook deze missie's hint-knop (regel 46/76/106/135, hintCost 3-4).

Beide zijn engine-bugs (zie `engine-puzzle-lab.json`), hier alleen genoemd om de concrete impact op déze missie te tonen — niet opnieuw gescoord als aparte engine-bevindingen.

## Didactiek — score 7.5/10

Sterk: de drie MC-puzzels behandelen herkenbare, actuele en correct beschreven kwetsbaarheden (SQL-injectie, ernst-classificatie, Stored XSS) met heldere clues die daadwerkelijk naar het antwoord toe redeneren, niet het antwoord weggeven. De afsluitende schrijfopdracht (puzzel 4) toetst transfer — kunnen toepassen, niet alleen herkennen — en de takeaways vatten de kernbegrippen correct samen.

Zwak:
- **Validator van puzzel 4 (`rapport-schrijven`) is gameable door keyword-stuffing.** `hasProblem` en `hasSolution` zijn los OR-getest op losse woorden, met alleen een lengte-eis (≥30 tekens). Een leerling die willekeurige zinnen typt met de woorden "formulier", "invoer" en "queries" erin — zonder enig begrip van hoe SQL-injectie of prepared statements werken — haalt de puzzel. Dat ondermijnt het doel van juist déze puzzel (transfer aantonen), terwijl de andere drie puzzels wel echte kennis vereisen.
- Gecombineerd met de engine-brede MC-giswinst (3 pogingen op 4 opties, geen scoreverlies bij foute pogingen) is de 70%-drempel voor "geslaagd" makkelijker te halen door gokken dan door begrip — dat raakt precies deze missie, want alle drie de MC-puzzels gebruiken exact 4 opties + maxAttempts 3.

## Tech — score 6/10

- **Engine-bug MC-gokwinst raakt hier alle drie MC-puzzels** (`owasp-herkennen`, `ernst-classificatie`, `xss-scenario`): elk 4 opties, `maxAttempts: 3`, geen scoreverlies per foute poging. Zonder inhoudelijke kennis is de kans op de volle score per puzzel 3/4.
- **Engine-bug ontbrekend `onRetry`** raakt de faalpad-ervaring van deze missie (zie Design).
- **Validator-zwakte** (zie Didactiek) is een tech-issue binnen déze config, niet de gedeelde engine: de AND-conditie test op losse substrings, niet op semantische samenhang.

## Voorstellen

### 1. Robuustere validator voor puzzel 4 (binnen whitelist: deze config)

Voor:
```ts
validator: (input: string) => {
    const s = input.toLowerCase();
    const hasProblem = s.includes('sql') || s.includes('injectie') || s.includes('kwetsbaarheid') || s.includes('formulier') || s.includes('invoer');
    const hasSolution = s.includes('prepared') || s.includes('parameterized') || s.includes('sanitiz') || s.includes('valideer') || s.includes('escape') || s.includes('queries');
    return hasProblem && hasSolution && s.length >= 30;
},
```

Na:
```ts
validator: (input: string) => {
    const s = input.toLowerCase();
    // Vereist een concrete verwijzing naar SQL-injectie zelf, niet losse woorden die ook
    // los van dit onderwerp voorkomen (zoals "formulier" of "invoer").
    const hasProblem = s.includes('sql-injectie') || s.includes('sql injectie') || s.includes('sqlinjectie')
        || (s.includes('sql') && (s.includes('injectie') || s.includes('query') || s.includes('queries')));
    // Vereist de concrete technische oplossing, niet een los woord als "valideer".
    const hasSolution = s.includes('prepared statement') || s.includes('parameterized quer')
        || s.includes('parameterised quer');
    return hasProblem && hasSolution && s.length >= 30;
},
```

Dit sluit de "willekeurige zin met losse trefwoorden"-route af zonder de opdracht strenger te maken dan de gegeven clues en het successMessage-voorbeeld al aanreiken.

### 2. MC-giswinst mitigeren binnen deze config (indien de engine-fix op scoreverlies-per-poging niet op tijd landt)

Voor (elke MC-puzzel):
```ts
maxAttempts: 3,
```

Na:
```ts
maxAttempts: 2,
```

Dit is een config-only lapmiddel — de eigenlijke fix (scoreverlies per foute poging) hoort in de engine, maar totdat die landt verkleint dit de gok-kans van 3/4 naar 2/4 (50%) voor deze drie puzzels.

## Samenvatting & verdict

Inhoudelijk is deze missie sterk: correcte, actuele security-content met een goede opbouw van herkenning → classificatie → toepassing. Het probleem zit niet in de didactische opzet maar in twee dingen die de meetbaarheid van "geslaagd" ondermijnen: de gedeelde engine beloont gokken op multiple-choice, en de eigen tekstvalidator van puzzel 4 is los genoeg om met trefwoorden zonder begrip te halen. Beide zijn fixbaar zonder de content te herschrijven.

**Verdict: fix-eerst.**
