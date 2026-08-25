# Rubric-review: Schermtijd Coach

**Datum:** 2026-08-25
**Missie-ID:** `schermtijd-coach`
**Template:** `debate-arena`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 6.5/10

Bevindingen (engine-breed, concreet van toepassing op deze config):

- **Stakeholderkleur-contrast (warning).** `STAKEHOLDER_COLORS` in `ExplorePhase.tsx:6` bevat `#e1ff01` (duck-acid geel). Deze config heeft 4 stakeholders, dus index 4 wordt hier niet geraakt (0-3), maar de config-eigen keuze om exact 4 stakeholders te gebruiken is toevallig veilig — bij een toekomstige uitbreiding naar 5 stakeholders raakt "Hoogenbosch" of een nieuwe stakeholder alsnog het gele accent met witte tekst. Geen eigen bevinding om nu te fixen (engine-issue), wel relevant om te weten bij content-uitbreiding.
- **Kwaliteitsindicator-kleuren in ArguePhase** (`#ff3c21` voor zowel "Uitstekend" als "Te kort"; `#e1ff01`-tekst op wit voor "Basis") is een gedeeld engine-probleem — raakt deze missie zodra een leerling een argument invult, maar is niet in de config op te lossen.
- Content zelf is visueel consistent: 4 stakeholder-emoji's, heldere titel/emoji, badges met logische kleurcodering (rood/zwart/groen-achtig via `#202023`/`#ff3c21`).
- Geen eigen ontwerpfouten gevonden in de config-content (teksten, volgorde, lengte) die niet al engine-breed zijn.

## Didactiek — score 8/10

- Vier stakeholders met duidelijk onderscheiden perspectieven (leerling, bedrijf, wetenschapper, politiek) — dekt persoonlijk, commercieel, wetenschappelijk en bestuurlijk niveau. Sterk voor SLO 23B (digitaal welzijn/mediawijsheid).
- `keyArgument` per stakeholder is scherp en niet stro-mannetjes — mevrouw Van Dijk krijgt een redelijk verdedigbaar standpunt, niet een karikatuur.
- `counterArgument` is inhoudelijk sterk (concurrentienadeel-argument) en vraagt echt tegenspraak, geen strohalm.
- `reflectionQuestions` bevat 3 vragen — hier ligt een concreet raakpunt met de engine-bevinding over scoring (zie Tech).
- `takeaways` sluiten logisch aan op het debat en bevatten geen feitelijke overclaims.
- Kleine verbeterkans: `missionGoal.evidence` in de config ("Een gekozen positie, meerdere argumenten...") en in `missionGoals.ts` ("Je eindstandpunt bevat minimaal twee argumenten...") zijn niet woordelijk gelijk maar wel inhoudelijk consistent — geen bevinding.

## Tech — score 7/10 (excl. gedeelde engine-issues die al vaststaan)

Deze missie wordt concreet geraakt door twee al-vaststaande engine-bevindingen uit `engine-debate-arena.json`:

- **Scoring-overflow bij 3 reflectievragen (blocking, engine).** De engine-review noemt `schermtijd-coach` expliciet: bij 3 reflectievragen sommeren de deelscores tot 110 i.p.v. 100, `Math.min` kapt af, en de getoonde fase-uitsplitsing klopt niet met het totaal. Dit is een engine-fix (`DebateArena.tsx:130`), niet oplosbaar in de config-whitelist voor deze missie.
- **Dubbele voltooiknop-klik en destructieve retry-knop (blocking, engine).** Ook hier is de missie qua config niet de oorzaak; de fix hoort in `CompletionScreen.tsx`/`DebateArena.tsx`.
- Config-eigen tech is verder schoon: `missionId` consistent over alle vier bronnen (`templateRegistry.ts:88`, `slo-kerndoelen-mapping.ts:57`, `curriculum.ts:91`, `missionGoals.ts:160`), `chatRoleId` gezet, `maxScore: 100` correct opgegeven (het is de engine die de som er niet aan houdt).
- Geen missende of dubbele stakeholder/position-ids gevonden; alle referenties zijn intern consistent.

---

## Voorstellen

Geen mechanische auto-fixes binnen de whitelist voor deze missie: de enige blocking/warning-bevindingen die deze missie concreet raken (scoring-overflow, dubbele voltooiknop, kleurcontrast in gedeelde subcomponenten) zitten in de gedeelde `debate-arena`-engine, niet in `schermtijd-coach.ts` of de vier registratiebestanden. Die vallen buiten deze missie-scope en zijn al vastgelegd in het engine-rapport.

---

## Samenvatting & verdict

`schermtijd-coach` is inhoudelijk een sterke debat-missie: vier goed onderscheiden, realistische stakeholders, een scherp tegenargument en relevante SLO-koppeling. De config zelf bevat geen blocking issues. De echte risico's — scoreoverflow bij 3 reflectievragen en de dubbele/destructieve voltooiknop — zitten in de gedeelde engine en zijn al als blocking vastgelegd in de engine-review; deze missie is er wel concreet door geraakt (3 reflectievragen) en moet daarom meeliften zodra de engine-fix landt.

**Verdict: ok** (config-niveau; wachten op gedeelde engine-fix voor de blocking scoring-/voltooiingsissues die deze missie raken).
