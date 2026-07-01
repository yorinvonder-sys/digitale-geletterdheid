# Missie-review: digitale-balans-coach

**Datum:** 2026-07-02
**Wave:** 12 (verse review)
**TemplateType:** debate-arena
**Config:** `src/features/missions/templates/debate-arena/configs/digitale-balans-coach.ts`

## Samenvatting

Volledig uitgewerkte debate-arena-missie over digitale balans en verantwoordelijkheid
(zelf / app-makers / ouders / overheid). Vier perspectieven zijn inhoudelijk sterk en
zorgvuldig geframed rond een welzijnsgevoelig thema (schermtijd/tienerbrein). Geen
functionele of registratie-issues gevonden. Eén kleine, niet-autoFixable observatie over
badge-kleurdifferentiatie.

**Registratie:** compleet en consistent —
`slo-kerndoelen-mapping.ts:79` (23A/23B, VSO 20A/20B), `curriculum.ts:122` (leerjaar 1,
periode 3), `missionGoals.ts:321` (primaryGoal + rounds-complete criterium),
`templateRegistry.ts:86` (debate-arena, **bewust geen** `enableChat`/`chatRoleId`).

**Agent-rol:** geen entry in `src/config/agents/year1.tsx` — correct, want deze missie
heeft geen `enableChat`. Dit is dus GEEN instantie van het bekende dormante-chat-patroon;
er is simpelweg geen chat-rol gedefinieerd, dus niets kan dormant zijn.

**Screenshots-map:** niet aanwezig (`.ui-review/` bevat geen entry voor deze missie).
**UI-UX-audit (2026-06-30):** geen vermelding van `digitale-balans-coach` in
`docs/audits/student-missions-ui-ux-review-2026-06-30.md` — buiten scope van die wave.

## Inhoudelijke beoordeling (welzijnsgevoelig thema)

Stellingen/perspectieven getoetst op schadelijke of absolute claims richting leerlingen:

- **Geen schuldtoewijzing** aan de leerling: het leerling-perspectief (Noor) erkent zelf
  moeite met stoppen zonder zich te veroordelen ("ik wíl dat, maar het lukt niet altijd").
- **Neurowetenschap correct en niet-stigmatiserend verwoord**: "dat is geen zwakte, dat is
  biologie" + expliciet "dat betekent niet dat tieners hulpeloos zijn" — voorkomt dat het
  argument als excuus voor controleverlies wordt gelezen.
- **counterArgument** herhaalt dit principe consistent: kennis over eigen brein = vorm van
  zelfregulatie, geen schuldinductie.
- **Geen crisis-thema**: dit is een gezond-gebruik-vraagstuk (schermtijd), geen
  zelfbeschadiging/suïcide-thema — een welzijns-doorverwijzing (hulplijn-verwijzing) is
  hier didactisch niet vereist en ontbreekt terecht.
- **takeaways** zijn constructief en handelingsgericht (concrete kleine gewoonte-tips),
  geen paniekmakerij of absolute "je moet"-claims.

**Conclusie welzijnscheck: geen issues.** Content is zorgvuldig en evenwichtig.

## Score-consistentie (debate-arena engine)

`calcScore()` in `DebateArena.tsx` is missie-onafhankelijk (stakeholders-read, positie,
argumenten, counter-response, reflectie tellen generiek mee tot `maxScore`). Config
gebruikt het standaardpatroon: `maxScore: 100`, 4 badges op drempels 80/60/40/0. Geen
missie-specifieke scoring-bug mogelijk — dit is engine-gedekt.

## Rubrics (0-10, 10 = uitstekend)

### Design — 8.5/10
- Structuur en flow: standaard debate-arena-opbouw, consistent met sibling-missies.
- **Observatie (niet autoFixable — cosmetisch, geen functioneel issue):** 3 van de 4
  badges (`Balansexpert`, `Goed Bezig`, `Aan de Start`) delen dezelfde kleur `#202023`;
  alleen `Bewust Denker` (60+) wijkt af naar `#ff3c21`. Progressie tussen badge-niveaus
  is daardoor visueel minder herkenbaar dan bij missies met een gradiënt van kleuren
  per drempel. Geen bug, wel een gemiste kans op duidelijkere voortgangsfeedback.

### Didactiek — 9.0/10
- Vier perspectieven zijn goed gebalanceerd (leerling/ontwikkelaar/ouder/wetenschapper),
  elk met een heldere `keyArgument` die niet-karikaturaal is.
- Reflectievragen zijn persoonlijk en concreet, sluiten aan bij SLO 23A/23B
  (waarden-gebaseerde zelfregulatie + privacy-bewustzijn).
- `counterArgument` is didactisch sterk: confronteert de leerling met een tegengeluid
  zonder te shamen, en modelleert hoe je met neurowetenschappelijke kennis een eigen
  standpunt nuanceert.
- `takeaways` zijn haalbaar en concreet (bv. telefoon buiten de slaapkamer) i.p.v. vage
  intenties.

### Techniek — 9.0/10
- Config volledig: alle verplichte `DebateArenaConfig`-velden aanwezig en correct getypeerd.
- Registratie compleet in alle 4 bronnen (slo-mapping, curriculum, missionGoals,
  templateRegistry) — geen mismatch.
- Geen dormant-chat-risico: `enableChat` bewust afwezig, geen ongebruikte chat-rol.
- Geen engine-issues gevonden die aan deze specifieke missie toe te schrijven zijn.

## Voorstel-blokken

Geen voorstellen — geen autoFixable of blocking issues gevonden. De enige observatie
(badge-kleurdifferentiatie) is cosmetisch or-design-keuze, geen fout, en wordt niet als
Voorstel-blok aangeboden omdat het geen concrete before/after-correctie betreft maar een
mogelijke toekomstige designoverweging.

## Triage

- design: 8.5 → (10-8.5)*0.3 = 0.45
- didactiek: 9.0 → (10-9.0)*0.4 = 0.40
- tech: 9.0 → (10-9.0)*0.3 = 0.30
- **triageScore = 1.15** (laag = gezond, geen actie vereist)

## Conclusie

Missie is gezond en ship-ready. Geen wijzigingen doorgevoerd (conform "wijzig niets"-regel
voor deze reviewpas). Geen escalatie nodig — geen welzijnsgevoelige content-issues
gevonden.
