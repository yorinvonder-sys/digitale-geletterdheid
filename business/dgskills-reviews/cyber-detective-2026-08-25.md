# Missie-review: cyber-detective

**Datum:** 2026-08-25
**templateType:** puzzle-lab
**Curriculum-plek:** Leerjaar 3, Periode 2 (Cybersecurity & Privacy)
**SLO-claim:** 23A (Veiligheid & privacy), 21A (Digitale systemen)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Score:** 8/10

### ✅ Geslaagd
- Geen Tailwind-tokens of JSX in de config — alle UI komt uit de gedeelde `PuzzleLab.tsx`-engine, dus criteria 1 (tokens), 3 (knop-clarity), 6 (Framer Motion) en 7 (toegankelijkheid) zijn engine-verantwoordelijkheid, niet missie-specifiek.
- Criterium 2 (layoutconsistentie): consistent met andere puzzle-lab-missies (`badges`, `takeaways`, `puzzles`-structuur volgt hetzelfde schema als bv. `encryption-expert.ts`).
- Criterium 4 (copy-lengte, leerjaar 3: intro <120 woorden, opdracht <80 woorden): `introDescription` (cyber-detective.ts:9-10) is ~45 woorden — ruim binnen de grens.

### ⚠️ Aandachtspunten
- **Criterium 4 (copy-lengte)** — `loganalyse.description` (cyber-detective.ts:22) bevat ~95 woorden inclusief het ingesloten logbestand-codeblok. Dat overschrijdt de 80-woordengrens voor leerjaar-3-opdrachten.
  - **Wat:** de vraagtekst zelf is kort, maar het codeblok met 5 logregels telt mee als lopende tekst.
  - **Waarom:** voor een leerling van 13-14 is een codeblok met technische logsyntax al een cognitieve belasting op zich; gecombineerd met veel omringende tekst kan dit afschrikken.
  - **Voorstel:** didactisch verdedigbaar (het codeblok ís het bewijsmateriaal, geen vulling) — geen fix nodig, alleen context genoteerd. Zie ook didactiek-oordeel hieronder.

### Visual Precision Gate
Niet dynamisch geverifieerd (geen Chrome-plugin-sessie in deze reviewronde). Statisch: config bevat geen layout-declaraties die dit zouden kunnen breken; risico ligt volledig bij de gedeelde `PuzzleLab.tsx`-engine (zie sweep-rapport engine-puzzle-lab.json).

---

## 📚 Didactiek review

**Score:** 8/10
**Bloom-balans:** medium

### ✅ Geslaagd
- **SLO-codes correct** (mapping.ts:172): `23A` en `21A` zijn beide geldige regulier-VO-codes, geen VSO-mismatch.
- **SLO-fit**: `23A` (Veiligheid & privacy) wordt sterk geraakt — alle 4 puzzels draaien om aanvalsherkenning, bewijsvoering en incidentrespons. `21A` (Digitale systemen) oppervlakkiger geraakt via het logbestand-lezen, maar aantoonbaar aanwezig.
- **Leeftijds-passend vocabulary**: technische termen (brute force, hash-waarde, chain of custody) worden telkens direct uitgelegd in de `clues`/`extraClues`/`successMessage` — geen onuitgelegd jargon in leerjaar 3.
- **Curriculum-plek**: past logisch in periode 2 "Cybersecurity & Privacy" naast `encryption-expert`, `phishing-fighter`, `security-auditor`, `digital-forensics` (curriculum.ts:277).
- **Bloom-mix**: 3 van de 4 puzzels zijn herkennen/classificeren (onthouden-begrijpen), maar `rapport-tijdlijn` (cyber-detective.ts:112-127) vraagt sequencing/analyseren — geeft de missie een hoger cognitief eindpunt dan pure quiz-recall.

### ⚠️ Aandachtspunten
- **Criterium 3 (leerdoelen helder)** — geen expliciet `learningObjectives`-veld in de config; `introDescription` (cyber-detective.ts:9-10) fungeert als impliciet leerdoel maar mist een meetbaar actiewerkwoord-format.
  - **Wat:** de intro beschrijft de rol ("Jij bent ingeschakeld als digitaal forensisch onderzoeker") maar niet expliciet wat de leerling na afloop kán.
  - **Waarom:** `missionGoals.ts:432-439` bevat wél een scherp geformuleerd `primaryGoal` en `evidence`-veld dat als leerdoel functioneert — dit is dus elders in de codebase gedekt, niet ontbrekend, maar niet zichtbaar in de missie-config zelf.
  - **Voorstel:** geen actie nodig — `missionGoals.ts` is de juiste, autoritatieve plek voor dit veld in dit templateType; noteer als context, niet als fail.
- **Criterium 7 (Bloom-balans)** — de eerste 3 puzzels zijn stuk voor stuk 4-optie multiple-choice classificatie (herkennen). Zonder de vierde tijdlijn-puzzel zou de missie te laag-Bloom zijn voor leerjaar 3.
  - **Voorstel:** geen wijziging nodig — de huidige opzet (3× herkennen + 1× analyseren) is een geldige, oplopende opbouw. Wel een aandachtspunt voor toekomstige puzzle-lab-missies: bouw liever 2 recall-puzzels + 2 hogere-orde-puzzels voor een steviger Bloom-mix.

### SLO-fit oordeel
- **23A**: sterk geraakt — bewijs: alle 4 puzzels (brute-force herkennen, bewijsketen, phishing herkennen, tijdlijn reconstrueren).
- **21A**: oppervlakkig geraakt — bewijs: alleen `loganalyse`-puzzel vraagt logbestand-interpretatie; er is geen puzzel die systeemarchitectuur of digitale infrastructuur zelf behandelt.

---

## 🔧 Tech review

**Score:** 4/10
**Dynamic verificatie:** niet uitgevoerd — geen dev-server in deze reviewronde; bevindingen zijn static, gebaseerd op de reeds beoordeelde gedeelde engine (`engine-puzzle-lab.json`) toegepast op deze specifieke config.

### Static analyse

#### ✅ Geslaagd
- Config bevat geen client-side AI-calls, geen `dangerouslySetInnerHTML`, geen `any`-types — puur statische content, dus criteria A3/A4/A5/A7 zijn hier niet van toepassing (geen code in dit bestand die ze kan schenden).
- `answer`-posities staan niet consistent op dezelfde index (index 1, 2, 2 van 4 opties) — geen structureel verklap-risico via optie-positie.

#### ⚠️ Aandachtspunten — engine-bevindingen die déze config concreet raken
- **Gokbestendigheid (blocking, geërfd van engine)** — elke multiple-choice-puzzel in deze config (`loganalyse`, `bewijsketen`, `aanvalsmethoden`; cyber-detective.ts:20-101) heeft 4 opties en `maxAttempts: 3`. Omdat de gedeelde engine geen punten aftrekt voor foute pogingen (zie `engine-puzzle-lab.json`, scoring-bevinding), kan een leerling die blind klikt in 3 van de 4 gevallen de volle 25 punten per puzzel binnenhalen. Bij een score-drempel van 70 (`missionGoals.ts:434`) is puur gokken dus een haalbare pass-strategie voor deze missie.
  - **Voorstel (mission-level, gedeeltelijke mitigatie binnen deze config):** verlaag `maxAttempts` van 3 naar 2 op de drie MC-puzzels. Dat verlaagt de kans op een "toevalstreffer" van 75% naar 50% per puzzel — geen volledige oplossing (die vereist score-aftrek per foute poging in `PuzzleLab.tsx`, buiten deze config), maar wel een directe, mission-level verkleining van het gok-gat totdat de engine-fix is doorgevoerd.
- **Vastloop-scherm bij lage score (blocking, geërfd van engine)** — met score-drempel 70/100 (`missionGoals.ts:434`) en de engine-bevinding dat `CompletionScreen` geen `onRetry` krijgt: een leerling die onder de pass-drempel van de `CompletionScreen`-component (40%, ~40 punten van de 100 in deze config) eindigt, ziet een uitgeschakelde knop zonder terugweg. Dit is een puur engine-bestand-probleem (`PuzzleLab.tsx:271`), niet oplosbaar binnen `cyber-detective.ts`.
- **Hint-mechanisme netto puntenverlies (warning, geërfd van engine)** — de vier `hintCost`-waarden (4, 4, 4, 3; cyber-detective.ts) worden nooit zinvol besteed omdat de engine de hint-knop pas toont nadat `extraClues` al gratis zichtbaar zijn. Niet oplosbaar in de config; wel relevant om te weten bij het beoordelen van de puntenbalans van deze missie.

#### ❌ Blocking issues
- Geen missie-specifieke blocking issues buiten de reeds bij de engine geëscaleerde problemen (gokbestendigheid, vastloopscherm) — die zijn structureel en gedeeld over alle puzzle-lab-missies.

### Dynamic verificatie
Niet uitgevoerd in deze ronde (geen dev-server beschikbaar). Aanbevolen als follow-up: `/dev/mission-preview?mission=cyber-detective` doorlopen op mobiel/tablet/desktop zodra een dev-server draait, specifiek gericht op het vastloop-scenario (bewust laag scoren) en het gok-scenario (willekeurig klikken).

---

## Voorstellen

### Voorstel 1 — maxAttempts verlagen op MC-puzzels (gedeeltelijke mitigatie gokbestendigheid)

```ts
// ❌ Huidig — src/features/missions/templates/puzzle-lab/configs/cyber-detective.ts:39-41
            answer: 'Brute force — het wachtwoord werd geraden door veel te proberen',
            caseSensitive: false,
            maxAttempts: 3,

// ✅ Voorgesteld
            answer: 'Brute force — het wachtwoord werd geraden door veel te proberen',
            caseSensitive: false,
            maxAttempts: 2,
```
(Zelfde wijziging toepasbaar op `bewijsketen` (regel 69) en `aanvalsmethoden` (regel 99): `maxAttempts: 3` → `2`.)

Dit is een **gedeeltelijke** mitigatie op mission-config-niveau. De volledige oplossing (score-aftrek per foute poging) vereist een wijziging in de gedeelde engine (`PuzzleLab.tsx`) en valt buiten de scope van deze missie-review — zie `engine-puzzle-lab.json` voor de engine-brede escalatie.

---

## Samenvatting

Cyber-detective is inhoudelijk een sterke, goed opgebouwde puzzle-lab-missie: heldere SLO-fit op 23A, leeftijdspassende uitleg van technische termen, en een oplopende Bloom-structuur die eindigt in een analyseren-opdracht (tijdlijn reconstrueren) in plaats van pure recall. Design is engine-gedreven en toont geen missie-specifieke problemen. De technische zwakte zit volledig in de gedeelde puzzle-lab-engine (gokbestendigheid van scoring, vastloop-risico bij lage score, nutteloos hint-mechanisme) — deze missie erft die problemen concreet doordat ze uitsluitend uit 4-optie multiple-choice-puzzels met 3 pogingen bestaat. Eén mission-level mitigatie is mogelijk (maxAttempts verlagen); de structurele fix hoort bij de engine-escalatie.

**Verdict: fix-eerst** (blocking issues zijn engine-breed, niet uniek voor deze missie — mission-level `maxAttempts`-tweak kan alvast worden doorgevoerd als gedeeltelijke mitigatie in afwachting van de engine-fix).
