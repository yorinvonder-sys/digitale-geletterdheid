# Missiereview: cookie-crusher — 2026-08-25

**templateType:** scenario-engine · **leerjaar:** 1, week 3 · **SLO:** 23A, 23C (VSO: 18B, 20A)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 7.5/10

### Geslaagd
- Copy is kort en concreet per item (titel + 1-2 zinnen beschrijving), consistent format over alle 4 rondes.
- Badges hebben oplopende drempels (0/40/60/80) met heldere titels, consistent met andere scenario-engine missies.
- Emoji-gebruik per item is functioneel (visueel anker), niet decoratief overdaad.

### Bevindingen
- ⚠️ **Erfgebrek uit de gedeelde engine (niet mission-specifiek, wél van toepassing):** cookie-crusher heeft géén follow-up-vraag per ronde (`followUpWeight` niet gezet), dus het "info"-niveau bonusPoints-contractgat uit de engine-review raakt deze missie niet — geen actie nodig hier.
- ⚠️ **Contrast in ronde 2 (order-priority):** deze missie gebruikt `OrderPriorityRound`, waar de gedeelde engine-review vaststelde dat `bg-duck-error text-white` circa 3,6:1 haalt (WCAG AA vereist 4,5:1 voor kleine tekst). Dit is een engine-brede styling-bevinding die concreet in deze missie zichtbaar is zodra een leerling een item fout plaatst in ronde "meest-manipulatief".
- ℹ️ Ronde-titels ("Herken de dark patterns", "Meest manipulatief eerst") zijn duidelijk en actiegericht — geen bevinding, ter bevestiging.
- Visual Precision Gate: niet dynamisch geverifieerd (geen Chrome-plugin bewijs in deze pass beschikbaar) — status **unverified**, geen blocking claim gedaan.

---

## Didactiek — score 8/10

### Geslaagd
- **SLO-fit sterk:** 23A (veiligheid & privacy) en 23C (maatschappij) worden beide substantieel geraakt — ronde 1+2 trainen herkenning van dark patterns (23A/privacy-mechanismen), ronde 3 vraagt normatieve afweging per context (23C/maatschappelijke impact), ronde 4 bouwt begrip van datacategorieën op. Geen oppervlakkig contact.
- **Leerdoel** (`missionGoals.ts:235`) sluit één-op-één aan op de rondes: "Ik herken cookiekeuzes en dark patterns zodat ik bewuster toestemming geef" — evidence-eis ("je kunt uitleggen welke knop/tekst je richting onnodig delen duwt") is toetsbaar aan ronde 1-2.
- **Bloom-balans goed:** ronde 1 is herkennen (onthouden/begrijpen), ronde 2 is analyseren/rangschikken (hoger niveau), ronde 3 is toepassen/evalueren in context, ronde 4 is terugkoppelen naar kennis. Oplopende cognitieve last.
- Uitleg-teksten (`explanation`) zijn feitelijk correct en leggen AVG-mechanismen (opt-in, pre-checked verboden, gelijke moeite weigeren) juist uit voor leerjaar 1-niveau.
- Realistische, herkenbare scenario's voor de doelgroep (schoolplatform, spelletjessite, sociale app).

### Bevindingen
- ⚠️ Ronde 3 item 5 (nieuwssite "consent or pay") is voor leerjaar 1 conceptueel net iets abstracter dan de rest (betaalmodel-afweging) — geen fout, maar de uitleg leunt zwaarder op voorkennis dan de overige 7 items. Geen blocking, wel iets om in het achterhoofd te houden bij eventuele vereenvoudiging.
- ℹ️ criteria.type is `rounds-complete` (bevestigd in `missionGoals.ts:237`) — dit betekent dat de engine-brede blocking-bevinding over de 40%/60-drempelmismatch (CompletionScreen vs. `threshold`) **niet** van toepassing is op cookie-crusher, want er is geen apart scoredrempel-object naast rounds-complete.

---

## Tech — score 6/10

### Geslaagd
- Config is puur data (geen inline logica, geen `any`, geen custom handlers) — alle A1-A4-criteria zijn automatisch voldaan omdat de engine ze afdwingt.
- `correctPosition` in ronde 2 is uniek en aaneengesloten (0-4), geen dubbele posities — voorkomt een onoplosbare ronde.
- `id`-velden zijn uniek per ronde (1-8 resp. 1-5), geen collisies die de state-validatie in de engine zouden breken.

### Bevindingen (overgenomen uit gedeelde engine-review, concreet van toepassing op deze missie)
- ❌ **Blocking — permanent geblokkeerd resultatenscherm onder 40%.** Dit is een engine-brede bug (`ScenarioEngine.tsx:328`) die cookie-crusher zonder uitzondering raakt: een leerling die onder de 40% scoort krijgt een CompletionScreen zonder werkende knop, zonder terugweg, en `phase: 'results'` wordt opgeslagen — herbezoek herstelt exact dezelfde dead-end. Niet oplosbaar binnen de config van deze missie; hoort in de engine-fix-track, niet in `cookie-crusher.ts`.
- ⚠️ **Order-priority scoring zonder gokcorrectie** (`FeedbackBanner.tsx:39`) — ronde 2 ("meest-manipulatief") heeft 5 items en scoort gemiddeld ~9/25 bij klikken zonder lezen, met 16% kans op de "bijna foutloos"-badge-tekst zonder inhoudelijk redeneren. Engine-brede bevinding, concreet zichtbaar in deze missie's enige order-priority-ronde.
- ⚠️ Focusbeheer bij rondewisseling ontbreekt engine-breed (`ScenarioEngine.tsx:289`) — raakt alle 4 rondes van cookie-crusher gelijk; toetsenbord-/schermlezergebruikers krijgen geen aankondiging van de nieuwe ronde.
- ℹ️ Geen edge-function-calls, geen AI-integratie in deze missie (select-correct/order-priority/binary-choice zijn puur client-side) — criteria A5 niet van toepassing.

---

## Voorstellen

Alle drie de blocking/warning-bevindingen bij Tech zitten in de **gedeelde engine** (`ScenarioEngine.tsx`, `FeedbackBanner.tsx`), niet in `cookie-crusher.ts`. Er is **geen mechanische auto-fix binnen de whitelist van dit rapport** (config/registry/agent/slo/curriculum/missionGoals) die deze bevindingen oplost — dat vereist een wijziging aan de engine zelf, wat buiten scope van deze mission-config-review valt.

Voor de config zelf (`cookie-crusher.ts`) zijn er geen mechanische fixes voorgesteld — de content is intern consistent en er zijn geen missionGoals/SLO/curriculum-entry-fouten gevonden.

---

## Samenvatting & verdict

Cookie-crusher is inhoudelijk een sterke missie: de SLO-fit is goed onderbouwd, de Bloom-opbouw klopt, en de content is feitelijk correct en leeftijdspassend. De didactiek- en designscore zijn beide ruim voldoende. De technische score wordt gedrukt door drie bevindingen die **niet in deze config zitten maar in de gedeelde scenario-engine**: het permanent geblokkeerde resultatenscherm onder 40% (blocking, engine-breed, raakt alle 12 scenario-missies), de ontbrekende gokcorrectie in de order-priority-scoreformule (raakt 11 van de 12 configs), en het ontbrekende focusbeheer bij rondewisseling. Omdat dit een `rounds-complete`-missie is (geen apart score-threshold-object), ontsnapt cookie-crusher aan de tweede engine-blocker (40%/60-drempelmismatch).

**Verdict: fix-eerst** — niet vanwege de config van cookie-crusher zelf, maar omdat de engine-blocking-bevinding (permanent geblokkeerd resultatenscherm) elke leerling onder 40% treft en losstaand van deze missie in de engine-fix-track moet worden opgepakt vóór deze (en de overige 11) scenario-missies als volledig "ship"-klaar gelden.
