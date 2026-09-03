# Rubric-review: Factchecker

**Datum:** 2026-08-25
**TemplateType:** scenario-engine
**Wave:** 23 (batch-review sweep)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 6/10

**Bevindingen**

- (blocking, geërfd van engine) Ronde 2 (`meest-betrouwbaar`, `order-priority`) heeft geen gokcorrectie in de gedeelde scoreformule (`scoreOrderPriority`, `FeedbackBanner.tsx:39`). Bij 5 items (deze ronde heeft er 5) levert klakkeloos van boven naar beneden slepen gemiddeld 9/25 punten op, en 16% van de leerlingen haalt zo toevallig de "bijna foutloos"-drempel. Dit is geen factchecker-specifieke bug, maar de config levert wel de exacte ronde-lengte (5) waarop het risico gedocumenteerd is.
- (warning) Item-iconen en titels zijn consistent en visueel onderscheidend (😱📰📅✍️🔗🌐😡📊 in ronde 1); geen designprobleem in de config zelf.
- (info) `badges`-kleuren gebruiken tweemaal exact `#202023` voor twee verschillende titels ("Kritische Lezer" en "Goed Begonnen") — geen visueel onderscheid tussen de tussenliggende badge-niveaus. Klein, maar een gemiste kans om voortgang te laten zien.

## Didactiek — score 7.5/10

**Bevindingen**

- (blocking, geërfd van engine, raakt deze missie met naam) `missionGoals.ts:407` zet `threshold: 60` voor factchecker, terwijl `CompletionScreen` de voltooi-knop al vanaf 40% actief en niet-disabled toont (`CompletionScreen.tsx:165-166`). Een leerling met 40-59 punten krijgt een knop die voltooiing belooft; `handleComplete` in `ScenarioEngine.tsx:298` keurt dat af tegen de 60-drempel, `AuthenticatedApp.tsx:746-750` gooit de leerling terug naar het dashboard zonder XP of registratie, en `clearSave()` wist de hele poging. Didactisch is dit een harde makke: de leerling krijgt geen eerlijke terugkoppeling over waarom de poging niet telde.
- (blocking, geërfd van engine, raakt alle scenario-missies) Onder 40% is de voltooi-knop disabled zonder `onRetry`, en het resultatenscherm heeft geen `onBack`/navigatie. `phase: 'results'` wordt opgeslagen, dus de leerling zit bij een volgend bezoek muurvast in exact hetzelfde geblokkeerde scherm.
- (goed) De vier rondes bouwen logisch op: rode vlaggen herkennen → bronnen rangschikken → praktische keuze (delen/niet delen) → CRAAP-methode formaliseren. Dat is een sterke didactische opbouw van herkenning naar toepassing naar naamgeving van het onderliggende raamwerk.
- (goed) De uitleg per item is inhoudelijk sterk en legt telkens het "waarom" uit (bijv. item 5 in ronde 1: linken naar primaire bronnen is juist een goed teken, niet verdacht — dit voorkomt dat leerlingen een te simplistische heuristiek leren).
- (info) De `explanation` bij ronde 3, item 6 (satire) nuanceert terecht dat satire zelf niet fout is, maar het delen zonder context misleidend is — een genuanceerd punt dat vaak wordt gemist in factcheck-lessen.

## Tech — score 8/10

**Bevindingen**

- (blocking, geërfd van engine) Zie Didactiek — dezelfde twee engine-defecten (dead-end resultatenscherm <40%, en 40-59%-mismatch) zijn technisch van aard en raken deze config via de gedeelde `ScenarioEngine.tsx`.
- (warning, geërfd van engine) Ronde 2 (order-priority) mist de per-leerling shuffle-seed die de klik-variant (`OrderPriorityRound.tsx`) wél heeft; de startvolgorde is deterministisch per `round.id`+item-id en dus voor elke leerling identiek — een leerling kan het antwoord aan de klas doorgeven.
- (goed) De config zelf is technisch schoon: alle `id`'s binnen elke ronde zijn uniek, `correctPosition` in ronde 2 dekt 0-4 zonder gaten of duplicaten, en elk item heeft de verplichte velden (`icon`, `title`, `description`, `correct`/`correctPosition`, `explanation`).
- (goed) Identiteit is consistent over alle bronnen: `templateRegistry.ts:17` (scenario-engine), `slo-kerndoelen-mapping.ts:106` (leerjaar 2, week 1, SLO 21B/23C, vso 18B/20B), `curriculum.ts:172` (leerjaar 2, periode 1, Data & Informatie), `missionGoals.ts:403-411` (score-threshold 60) en `agents/year2.tsx:177-189` (agent-rolentry compleet met briefing/voorbeeld). Geen mismatch gevonden tussen deze bronnen.

---

## Voorstellen

Deze twee items zijn **niet** binnen de whitelist van deze missie op te lossen (ze zitten in de gedeelde engine/CompletionScreen, niet in `factchecker.ts` of de missie-eigen entries) — al zijn ze wel de meest urkende bevindingen. Ze worden hier genoemd zodat ze meegenomen worden in de escalatie, niet als auto-fixable voorstel.

Binnen de whitelist is er één mechanische verbetering mogelijk:

**Voor** (`src/features/missions/templates/scenario-engine/configs/factchecker.ts`, badges):
```ts
{
    minScore: 60,
    emoji: '🔍',
    title: 'Kritische Lezer',
    color: '#202023',
},
{
    minScore: 40,
    emoji: '📚',
    title: 'Goed Begonnen',
    color: '#202023',
},
```

**Na:**
```ts
{
    minScore: 60,
    emoji: '🔍',
    title: 'Kritische Lezer',
    color: '#3c4b8f',
},
{
    minScore: 40,
    emoji: '📚',
    title: 'Goed Begonnen',
    color: '#202023',
},
```

(Cosmetisch, geen blocking-impact — niet automatisch toegepast, ter overweging.)

---

## Samenvatting & verdict

De `factchecker`-config zelf is inhoudelijk en technisch sterk: vier goed opgebouwde rondes, correcte identiteit over alle vijf configuratiebronnen, en scherpe, uitlegrijke feedback per item. De twee blocking-bevindingen zitten niet in de missie-eigen bestanden maar in de gedeelde `ScenarioEngine`/`CompletionScreen`-laag: (1) een permanent geblokkeerd resultatenscherm onder 40%, en (2) een misleidende "voltooid"-knop tussen 40-59% terwijl de missiedrempel op 60 staat — dit laatste treft factchecker met naam, omdat de drempel in `missionGoals.ts` op 60 staat. Deze twee moeten worden opgelost op engine-niveau, niet per missie.

**Verdict: fix-eerst** — niet vanwege de config zelf, maar omdat de missie via de gedeelde engine een leerling permanent kan vastzetten of zonder registratie kan laten vallen tussen 40-59%. Zodra de engine-fix (CompletionScreen `onRetry`/navigatie + drempel-consistentie) is doorgevoerd, is deze missie qua inhoud gereed voor leerlingen.
