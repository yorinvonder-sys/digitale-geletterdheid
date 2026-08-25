# Rubric-review: security-review (review-arena)
Datum: 2026-08-25 · templateType: review-arena

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## 🎨 Design review

### ✅ Geslaagd
- Badges gebruiken de bestaande duck-kleurtokens (`#e1ff01`, `#202023`, `#ff3c21`) consistent met andere review-arena-missies.
- Copy-lengte per ronde (titel, description, followUp-vraag) is kort en past bij het template.
- Vier ronde-types (drag-sort, match-pairs, categorize, rapid-fire) geven visuele afwisseling zoals het template bedoelt.

### ⚠️ Aandachtspunten
- Deze missie erft de gedeelde engine-gebreken uit `engine-review-arena.json`: DragSort-rij-feedback zonder tekstalternatief/aria-label en het `#ff3c21`-positienummer-contrastrisico (DragSort.tsx) raken ook deze missie, omdat ze alle 6 items in de sorteerronde en alle onderliggende teksten gebruikt.
- `name-date` item ("Mohamed2009") is de enige naam met een niet-Nederlandse achtergrond in de itemlijst; functioneel geen probleem, maar het is het enige item waar een specifieke naam wordt gebruikt in plaats van een generiek label — geen ander item volgt dat patroon.

### ❌ Blocking issues
Geen missie-specifieke blocking design issues. De twee blocking bevindingen uit de engine (MatchPairs-vroegtijdige scorevastlegging, CompletionScreen-doodloop <40%) zijn gedeelde-engine-defecten en worden niet herhaald als aparte missie-bevinding.

### Score
7.5 / 10

## 📚 Didactiek review

### ✅ Geslaagd
- SLO-code `23A` in `slo-kerndoelen-mapping.ts` is aanwezig en de missie-inhoud (wachtwoorden, encryptie, phishing, 2FA, logbestanden) sluit aantoonbaar aan bij een security/digitale-vaardigheden-kerndoel.
- `missionGoals.ts`-entry voor `security-review` is intern consistent: `primaryGoal`, `criteria.min: 4` (4 rondes) en `evidence` sluiten precies aan op de vier rondes en de takeaways in de config.
- Takeaways (5 stuks) dekken de kernbegrippen die ook in de rapid-fire-vragen en de followUp-uitleg terugkomen — goede herhaling/consolidatie.
- Uitleg-teksten bij rapid-fire zijn feitelijk correct en leggen het "waarom" uit (bijv. VPN, incognito, firewall) — dit ondersteunt begrip, niet alleen onthouden.
- Bloom-balans: sorteren (analyseren), koppelen (toepassen/analyseren), categoriseren (classificeren) en waar/onwaar (kennis + begrip) geeft een redelijke spreiding over Bloom-niveaus voor een toetsmissie.

### ⚠️ Aandachtspunten
- `curriculum.ts` plaatst `security-review` in leerjaar 3, periode 2 (`assessment-j3-p2`), samen met `security-auditor` en `digital-forensics`; de placement is logisch als afsluitende toets-missie, maar dat is niet inhoudelijk geverifieerd tegen de volledige periode-opbouw (buiten scope van deze whitelist).
- De DragSort-followUp-vraag ("Waarom is een sterk wachtwoord alleen niet voldoende...") heeft antwoordoptie "Omdat wachtwoorden altijd gekraakt kunnen worden" die dicht bij een plausibel afleidend antwoord ligt voor leerlingen die net over brute-force hebben geleerd in ronde 2 — functioneel geen fout, wel een lichte overlap tussen rondes.

### ❌ Blocking issues
Geen.

### SLO-fit oordeel
Fit: sterk. De vier rondes dekken samen wachtwoordsterkte, aanval/tegenmaatregel-koppeling, veilig/onveilig gedrag en kennisverificatie — een brede maar coherente steekproef van cybersecurity-basisconcepten passend bij 23A.

### Score
8.5 / 10

## 🔧 Tech review

### Static analyse
#### ✅ Geslaagd
- Config-structuur volgt het `ReviewArenaConfig`-type correct: alle 4 rondes hebben `id`, `type`, `title`, `description`, `maxScore` (elk 25, totaal 100 = `maxScore`).
- `items`/`pairs`/`categories`/`questions`-arrays zijn intern consistent: `correctPosition` in drag-sort loopt 0-5 zonder gaten of duplicaten; `categorize`-items verwijzen allemaal naar een van de twee gedefinieerde categorieën; rapid-fire heeft 10 vragen met `answer: boolean` en bijpassende `explanation`.
- `missionId: 'security-review'` in de config komt overeen met de sleutel in `templateRegistry.ts`, `slo-kerndoelen-mapping.ts`, `curriculum.ts` en `missionGoals.ts` — geen mismatch in de missie-eigen bronnen.

#### ⚠️ Aandachtspunten
- De gedeelde engine-bevindingen (MatchPairs vroegtijdige scoreverankering bij foute poging, DragSort ongecorrigeerde gokscore, Categorize zonder inhoudelijke poort, RapidFire timeout-race) zijn allemaal van toepassing op deze missie omdat ze alle vier rondetypes gebruikt — géén van deze issues is missie-specifiek te repareren binnen de config-whitelist; ze horen bij de engine-fix.
- `round-drag-sort` heeft 6 items terwijl de andere rondes 5 (match-pairs), 8 (categorize) en 10 (rapid-fire) items/vragen hebben; bij 25 punten per ronde levert dat per-item een ongelijke puntwaarde (drag-sort ~4,17/item vs rapid-fire 2,5/vraag) — geen fout, maar een inconsistentie in granulariteit tussen rondes.

#### ❌ Blocking issues
Geen missie-specifieke blocking tech-issues; de twee blocking bevindingen (MatchPairs-scorevastlegging, CompletionScreen-doodloop) zitten in de gedeelde engine (`ReviewArena.tsx`, `MatchPairs.tsx`, `shared/CompletionScreen.tsx`) en zijn al vastgesteld in het sweep-rapport — niet opnieuw gerapporteerd als missie-bevinding, wel relevant voor de eindscore van déze missie omdat ze bij spelen optreden.

### Dynamic verificatie
Niet uitgevoerd — geen dev-server-URL beschikbaar in deze pass; alleen static config-analyse.

### Score
7 / 10

## Voorstellen

Geen mechanisch toepasbare fixes binnen de missie-config-whitelist. Alle geconstateerde gebreken zijn ofwel (a) gedeelde-engine-defecten die buiten de whitelist vallen, of (b) kleine, niet-blocking inconsistenties (itemaantal per ronde, followUp-antwoordoverlap) die geen eenduidige voor/na-code-wijziging rechtvaardigen zonder ontwerpkeuze van Yorin.

## Samenvatting

`security-review` is inhoudelijk een sterke, goed opgebouwde toetsmissie voor cybersecurity-basisconcepten (SLO 23A), met correcte en consistente config-wiring in alle vier de registratiebronnen. De belangrijkste risico's — MatchPairs die bij één foute poging al een (te hoge) score vastlegt, en een CompletionScreen die leerlingen onder 40% zonder terugweg laat vastlopen — zitten in de gedeelde review-arena-engine en gelden voor alle missies van dit template, niet specifiek voor deze. Er is geen missie-specifieke blocking bevinding binnen de config-whitelist.

**Verdict: ok** (missie-config zelf is in orde; de engine-blockers zijn al opgenomen in het sweep-rapport voor gecentraliseerde fix).
