# Missie-review: AI Ethicus (ai-ethicus)

**Datum:** 2026-08-25
**TemplateType:** debate-arena
**AI-gedrag & privacy:** aparte veiligheids-pass (zie sweep-rapport).

## Design — 8/10

De config levert alleen content aan de gedeelde `DebateArena`-engine; er is geen eigen UI-code. De vier stakeholders (`leerkracht`, `leerling`, `ai-expert`, `coordinator`) blijven onder de index-4 die de engine-review noemt (`STAKEHOLDER_COLORS` geeft pas bij de vijfde stakeholder het onleesbare geel #e1ff01) — dit raakt ai-ethicus dus niet.

Bevindingen:
- ⚠️ De engine-brede contrastbugs in `ArguePhase.tsx` (rode kleur voor zowel "Uitstekend" als "Te kort", gele "Basis"-tekst op wit) en het ontbreken van `htmlFor`/`aria-label` op de textareas gelden voor élke debate-arena-missie, dus ook ai-ethicus. Dit is een engine-fix, geen missie-specifieke actie.
- ✅ Vier badges met oplopende drempels (0/40/60/80) en consistente kleur — prima afgestemd op maxScore 100.
- ✅ Vier heldere posities (`volledig-inzetten` t/m `niet-inzetten`) die het hele spectrum dekken, geen overlap in betekenis.
- Info: het tegenargument (`counterArgument`) is scherp en uitlokkend geformuleerd — goed voor de Challenge-fase.

## Didactiek — 8.5/10

SLO-koppeling: `21D` (AI) en `23C` (Maatschappij) — beide worden inhoudelijk geraakt: leerlingen wegen technische AI-mogelijkheden (Dr. Karimov) tegen maatschappelijke impact op onderwijsrelaties (Sven, coördinator). Geen misalignment.

Curriculum: `yearGroup: 2`, `week: 4` in `slo-kerndoelen-mapping.ts`, en curriculum.ts plaatst de missie consistent in leerjaar 2. Voor leerjaar 1-2 geldt: intro <80 woorden — `introDescription` (~45 woorden) past ruim.

Leerdoelen: geen apart `learningObjectives`-veld in de config zelf, maar `missionGoals.ts` (regel 838-845) definieert een expliciet, meetbaar `primaryGoal` ("Ik bouw een onderbouwd standpunt... en reageer op het sterkste tegenargument") met concreet `evidence`-criterium (minimaal twee argumenten + reactie op tegenargument). Dit is een heldere, toetsbare formulering — geen vage "begrijpt"-taal.

Bevindingen:
- ✅ Vier stakeholder-perspectieven zijn evenwichtig: elk heeft een aparte, niet-triviale invalshoek (workload-winst, persoonlijke onrechtvaardigheid, technische nuance, systemische consistentie) — voorkomt een stroman-debat.
- ✅ Twee reflectievragen zijn kort en direct gekoppeld aan het onderliggende ethische spanningsveld (consistent vs. eerlijk).
- ⚠️ De engine-brede bevinding "10 punten voor stakeholders lezen hangt puur aan het aanklikken van 'Gelezen ✓', geen controlevraag" geldt ook hier — ai-ethicus heeft geen `explorationQuiz`. Dit is een optionele config-uitbreiding, geen blocking issue.

## Tech — 8/10

Static analyse van de config: geen `any`-types, geen dode velden, `missionId` consistent gebruikt over templateRegistry/slo-mapping/curriculum/missionGoals.

Bevindingen (engine-niveau, van toepassing op ai-ethicus maar niet mission-specifiek fixbaar):
- ⚠️ **Blocking (engine)**: dubbele XP mogelijk bij snel dubbelklikken op de voltooiknop (`CompletionScreen.tsx:163`, `DebateArena.tsx:257-264`) — geen submitting-guard.
- ⚠️ **Blocking (engine)**: bij <40% score wist dezelfde knop ("Afronden — probeer het gerust nog eens") de volledige leerling-state via `clearSave()` zonder bevestiging (`CompletionScreen.tsx:165`, `DebateArena.tsx:151-155`).
- ✅ De scoring-overflow-bug (som van deelscores >100 bij drie reflectievragen) raakt ai-ethicus **niet** — deze config heeft slechts twee `reflectionQuestions`, dus de deelscores blijven binnen maxScore 100.
- ⚠️ Argumenten worden niet ontdubbeld (engine-niveau): drie keer exact dezelfde tekst plakken levert de volle punten voor het argumenteren-onderdeel.

Geen van deze technische bevindingen is oplosbaar binnen de mission-config zelf (`ai-ethicus.ts`) — ze zitten in de gedeelde `DebateArena`-engine en `CompletionScreen`-component.

## Voorstellen

Geen mechanische fixes binnen de missie-eigen bestanden (config/registry/SLO/curriculum/missionGoals) nodig — de config zelf bevat geen fouten. Alle gevonden issues zitten in de gedeelde engine (`DebateArena.tsx`, `CompletionScreen.tsx`, `ArguePhase.tsx`) en vallen buiten de whitelist van deze missie-review; die horen in de engine-fixronde van de sweep, niet in een per-missie patch.

## Samenvatting & verdict

**AI Ethicus** is een inhoudelijk sterke debate-arena-missie: vier goed onderscheiden stakeholder-perspectieven, een scherp tegenargument, correcte SLO-koppeling (21D/23C) en een concreet, toetsbaar leerdoel via `missionGoals.ts`. De config zelf heeft geen mission-specifieke fouten. Alle gevonden problemen (dubbele voltooiing, destructieve retry-knop, contrastbugs, ontbrekende ontdubbeling van argumenten) zitten in de gedeelde debate-arena-engine en gelden voor alle missies van dit templateType — geen van deze issues is autofixable binnen de scope van deze review.

**Verdict: ok** (mission-config-niveau) — engine-brede blocking issues staan als escalatie genoteerd voor de sweep-orchestrator.
