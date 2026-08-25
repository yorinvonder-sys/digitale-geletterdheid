# Missie-review: Data Speurder

**Datum:** 2026-08-25
**TemplateType:** scenario-engine
**Wave:** 23 (batch-review sweep)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 7.5/10

Content-only review (config bevat alle copy; engine-UI is al apart beoordeeld).

**Geslaagd**
- Consistente rondestructuur (4 rondes, elk 25 punten, totaal 100) — voorspelbaar voor leerlingen.
- Emoji's en `icon`-velden zijn thematisch passend (📊🔎📈🤔🧪) en consistent met andere scenario-engine-missies.
- Badges gebruiken dezelfde vaste kleur (`#202023`) als het overige duck-palet-patroon — geen ad-hoc kleuren.
- Item-teksten zijn kort genoeg om binnen kaarten te passen (geen tekst >2 zinnen per item-description).

**Aandachtspunten**
- Ronde 3 (`misleidende-data`) heeft 6 items i.p.v. de 4-8 range van de andere rondes — geen probleem op zich, maar de items zijn merkbaar langer (2-3 zinnen) dan ronde 1/4, wat de leestijd per ronde ongelijk maakt.
- Visual Precision Gate: niet apart geverifieerd in deze pass (geen Chrome-plugin-bewijs meegeleverd voor déze missie specifiek) — markeer als *unverified*, niet als fail.

**Geërfd van de engine (niet opnieuw scoren, wel vermeld)**
- Contrastwaarschuwing (`SpotTheFlagsRound`/`InboxTriageRound`, ~3,3-4,3:1) raakt deze missie niet — data-speurder gebruikt `select-correct`, `order-priority` en `binary-choice`, geen inbox-/flag-componenten.
- Focusbeheer bij rondewisseling (geen aria-live, focus valt terug op body) raakt wél alle 4 rondes van deze missie, maar is een engine-brede fix, geen config-fix.

---

## Didactiek — score 8/10

**Geslaagd**
- SLO-fit is sterk en precies: `21C` (Data & Dataverwerking) is de enige geclaimde code, en de inhoud dekt 'm volledig — data-vs-informatie-vs-conclusie (ronde 1), grafiekkeuze (ronde 2), misleidende presentatie (ronde 3), verantwoorde conclusies trekken (ronde 4). Geen overclaiming (geen `21B`/`21D` erbij getrokken zonder dekking).
- `sloVsoKerndoelen: ['18B']` is consistent met de reguliere `21C`-keuze.
- Leerdoel-formulering (`primaryGoal`) is concreet en toetsbaar: "onderzoek data, kies passende visualisaties, trek een conclusie die ik met bewijs kan uitleggen" — dekt drie losse vaardigheden die elk in een eigen ronde terugkomen.
- Bloom-balans is goed: ronde 1 is herkennen/onderscheiden, ronde 2 is toepassen (grafiekkeuze), ronde 3 is analyseren (misleiding doorzien), ronde 4 is evalueren (welke conclusie is verantwoord). Oplopende cognitieve last.
- `takeaways` zijn feitelijk correct en goed vertaald naar leerjaar-1-niveau (bv. correlatie-vs-causatie zonder jargon-drop, met "(correlatie)" als parenthetische uitleg — precies het patroon dat de rubric vraagt).
- Ronde 4 (`conclusies-trekken`) is didactisch het sterkste onderdeel: items 2 en 6 testen expliciet of leerlingen causale overclaiming herkennen, item 5 test genuanceerd of een vergelijking met een externe norm (2 uur-richtlijn) wél mag — een subtiel onderscheid dat verder gaat dan een simpele goed/fout-tweedeling.

**Aandachtspunten**
- Criteria is `rounds-complete` met `min: 4` zonder score-`threshold` — dit ontwijkt toevallig de geërfde engine-bug (finding #2 in de engine-pass: knop belooft "voltooid" bij 40% maar host-check faalt pas boven de 60-drempel). Voor déze missie is er dus geen dubbele-drempel-mismatch. Positief, geen actie nodig — alleen ter vermelding zodat dit niet per ongeluk als "nog te fixen" wordt opgepakt.
- Geen enkel item in ronde 2 (`grafiek-kiezen`, `order-priority`) heeft een expliciete uitleg waaróm de 4-vs-1e positie fout zou zijn als een leerling toevalligerwijs de volgorde omdraait tussen positie 2 en 3 (staafdiagram voor cijfers vs. temperatuur) — de explanation-tekst bij item 3 erkent zelf dat "een staafdiagram ook kan", wat de ronde inhoudelijk correct maar didactisch een beetje zacht maakt op het randgeval. Geen fix nodig, wel een opmerking voor toekomstige config-auteurs.

**Geërfd van de engine (niet opnieuw scoren, wel vermeld)**
- Ronde 2 is een `order-priority`-ronde — de enige scoreformule zonder gokcorrectie (engine-finding, warning). Bij 4 items levert kaarten van boven naar beneden aanklikken zonder lezen gemiddeld 10/25 op en 13% van de leerlingen haalt toevallig de "bijna foutloos"-drempel. Dit is een engine-brede fix (`scoreOrderPriority` in `FeedbackBanner.tsx`), niet oplosbaar in de config van data-speurder.
- Finding #1 uit de engine-pass (blocking): onder 40% totaalscore is de eindknop uitgeschakeld en het resultatenscherm heeft geen uitweg — dit raakt data-speurder net zo hard als de andere 11 scenario-missies. Een leerling die op alle 4 rondes zwak scoort, zit vast.

---

## Tech — score 8.5/10

**Geslaagd**
- Config is volledig getypeerd via `ScenarioEngineConfig` (geen `any`, geen `@ts-ignore`).
- `maxScore: 100` klopt exact met de som van de 4 ronde-`maxScore`-waarden (25×4).
- Elk item heeft consistente velden (`id`, `icon`, `title`, `description`, `correct`/`correctPosition`, `explanation`) — geen ontbrekende velden die de engine zou moeten defaulten.
- Item-`id`'s zijn uniek en oplopend per ronde (1-8, 1-4, 1-6, 1-8) — geen dubbele id's die de state-validatie in de engine zouden kunnen laten struikelen.
- `templateRegistry.ts`-entry, `slo-kerndoelen-mapping.ts`-entry en `curriculum.ts`-plaatsing (leerjaar 1, periode 3, week 3) zijn onderling consistent — geen missionId-mismatch.
- `missionGoals.ts`-entry (`primaryGoal`, `criteria`, `evidence`) is inhoudelijk identiek aan de `missionGoal` in de config zelf — geen tekst-drift tussen de twee bronnen.

**Aandachtspunten**
- Geen `threshold` in `missionGoals.ts`-entry voor data-speurder, terwijl drie andere scenario-missies dat wél hebben (`online-helden`, `factchecker`, `ai-bias-detective` op 60). Functioneel is dit prima (rounds-complete-type gebruikt geen threshold), maar het is het waard te bevestigen dat dit bewust is en niet een vergeten veld — geen fix nodig zolang `criteria.type === 'rounds-complete'` blijft.

**Geërfd van de engine (niet opnieuw scoren, wel vermeld)**
- Finding #1 (blocking) en finding #2 (blocking, N.v.t. voor déze missie zoals hierboven toegelicht) uit de engine-pass.
- Focusbeheer bij rondewisseling (warning, engine-breed).

---

## Voorstellen

Geen mechanische auto-fixable wijzigingen gevonden binnen de whitelist voor deze missie. De config zelf bevat geen bugs, dode velden, of SLO-mismatches die een voor/na-snippet rechtvaardigen. De reële problemen (blocking eindscherm-deadlock, order-priority-gokcorrectie) zitten in de gedeelde engine (`ScenarioEngine.tsx`, `FeedbackBanner.tsx`) en vallen buiten de whitelist van dit rapport — die horen bij de engine-fix, niet bij een per-missie fix.

---

## Samenvatting & verdict

Data Speurder is een van de sterkere scenario-engine-configs in deze sweep: scherpe SLO-fit op `21C`, oplopende Bloom-balans over de 4 rondes, en een didactisch doordachte laatste ronde die causale overclaiming en normvergelijking uit elkaar trekt. De config zelf bevat geen technische of design-bugs. De enige reële risico's — het geblokkeerde eindscherm onder 40% en de gokcorrectie-zwakte in `order-priority` — zitten in de gedeelde engine en zijn al vastgelegd in de engine-pass; ze zijn niet oplosbaar op configniveau en horen niet als aparte to-do voor deze missie te worden opgepakt.

**Verdict: ok** (met de kanttekening dat de engine-brede blocking-fix voor het eindscherm ook data-speurder raakt zodra die wordt opgepakt).
