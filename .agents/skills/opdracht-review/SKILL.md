---
name: opdracht-review
description: Use this skill for "opdracht review", "review deze opdracht", "beoordeel opdracht", "/opdracht-review", or "speel en beoordeel". This is the only front door for the final judgment on one assignment.
---

# Opdracht review

Deze skill is de enige voordeur voor het eindoordeel over één opdracht. Speel
eerst als leerling, leg speelbewijs vast, beoordeel daarna alle vier veto's en
alle drie poorten en score pas als alles is geslaagd.

## Operating Rules

- Schrijf in het Nederlands, tenzij de gebruiker anders vraagt.
- Werk evidence-first: beweer niets over een flow, viewport, bestand of gedrag
  zonder dat het werkelijk is bekeken.
- Houd bevindingen vlak, concreet en controleerbaar.
- Ontbrekend bewijs is onzekerheid, nooit succes.
- Nooit oordelen op basis van het configbestand; alleen op basis van wat er bij
  het spelen gebeurt.
- Gebruik de side-effect-vrije preview: `/dev/mission-preview?mission=<id>&reset=1`.
- Speel niet op productie met een bestaand leerlingaccount.
- Gebruik geen echte persoonsgegevens, leerlinggegevens, geheimen of tokens.
- Escaleer privacy, auth, Supabase/RLS, AI-endpoints en minderjarigendata als
  Rood.

## Modelroutering

- Fase A wordt uitgevoerd door één Sonnet-subagent met
  `mcp__playwright__*`.
- Gebruik één browser en speel sequentieel; geen parallelle browsers.
- Het oordeel en de poortbeslissing worden door Opus met high reasoning
  gemaakt.
- Het Browser-paneel bevriest animaties. Browser-paneelbewijs is daarom geen
  bewijs voor dynamische beweging; gebruik Playwright voor acties, frames en
  state changes.

## Fase A — Spelen

### Operating Rules (live check)

- Schrijf in het Nederlands tenzij de gebruiker expliciet anders vraagt.
- Gebruik standaard de side-effect-vrije preview-route
  `/dev/mission-preview?mission=<id>&reset=1` op de draaiende dev-server.
  Voltooien daar is bewust een no-op: er wordt geen voortgang, XP of
  activiteitenlog geschreven. Gebruik deze route tenzij de gebruiker
  expliciet iets anders aanwijst.
- Speel nooit productie met een bestaand leerlingaccount. Een productie-
  playthrough vereist expliciete toestemming én een aangewezen testaccount.
  Zonder beide stopt Fase A met een gemelde blokkade.
- Geef voorrang aan browserbewijs boven statische codeclaims.
- Gedraag je als een gewone leerling: lees wat op het scherm staat, klik of tik
  op verwachte controls, maak redelijke keuzes en noteer verwarring.
- Gebruik geen admin-snelkoppelingen, databasebewerkingen of verborgen
  implementatiekennis om voortgang of voltooiing te faken. `reset=1` maakt
  alleen de lokale preview schoon en is geen snelkoppeling.
- Voer geen echte persoonlijke of gevoelige gegevens in.
- Als de opdracht niet zonder een echt leerlingaccount bereikbaar is, meld de
  blokkade; een leerling-sessie is nooit een fallback.

### 2. Student Playthrough

Speel de hele opdracht als leerling:

- begin op de intro/start;
- volg de instructies zonder codekennis;
- voer elke verplichte stap uit;
- probeer waar mogelijk bewust minstens één fout of onvolmaakt antwoord;
- observeer feedback, hint, retry, voortgang, score en voltooiing;
- rond af of beschrijf de exacte blokkade.

Let op dode knoppen, onduidelijke labels, rare knopplaatsen, niet-updatende
voortgang, verkeerde feedback, onlogische vervolgstappen, ontbrekende eind-CTA
en onbedoelde navigatie.

### 3. Browser And Device Coverage

Controleer voor zichtbare opdracht-UI minstens:

- desktop/laptop;
- tablet/iPad staand;
- tablet/iPad liggend;
- mobiel.

Bekijk per formaat de intro/start, normale tussenstaat, fout/feedbackstaat en
eind-, voltooiings- of volgende-CTA-staat. Noteer `Echte iPad-check nodig` als
Safari/iPad kan verschillen en alleen emulatie is gebruikt.

### Handelingslijst per minuut (verplicht)

Maak tijdens het spelen een bijlage met per minuut één fysiek werkwoord: wat de
leerling werkelijk doet, niet wat de config beweert. Noteer lezen, klikken,
typen, slepen, kiezen, vergelijken, maken, herstellen en teruggaan. Beschrijf
bij iedere overgang het zichtbare gevolg.

De lijst wordt afgeleid uit `manifest.actionLog[]`. Bij iedere klik- of typactie
legt Playwright via `browser_evaluate` een regel vast met `Date.now()` uit de
pagina, omschrijving en screenshotnummer. De tijdstippen zijn strikt
oplopend. Een losse achteraf geschreven handelingslijst zonder deze browserlog
is voor Veto 2 `NIET VASTGESTELD`.

### Technische signalen

Noteer alleen signalen die de leerlingflow raken: consolefouten, mislukte
netwerkverzoeken, ontbrekende afbeeldingen, lang laden, renderproblemen en
vreemd gedrag na herladen of terug/vooruit navigeren. Dev-waarschuwingen zonder
zichtbaar effect zijn geen bevinding.

### Fase A-besluit

`GESPEELD` betekent: start, normale flow, fout/feedback en eind-CTA zijn
doorlopen. `NIET GESPEELD` betekent: één van die onderdelen ontbreekt.
De enige harde stop vóór de beoordeling is niet gespeeld of geen valide
manifest. De vier veto's worden daarna altijd volledig beoordeeld. Alleen bij
vier keer `GESLAAGD` volgt de volledige beoordeling van de drie poorten; binnen
elke fase wordt de beoordeling niet tussentijds afgebroken.

### Evidence en manifestcontract

Bewaar genummerde PNG's en `manifest.json` in
`business/dgskills-reviews/evidence/<id>-<datum>/`. Valideer met:

```text
node .claude/skills/opdracht-review/scripts/validate-evidence.mjs <manifest>
```

Zonder valide manifest is de uitkomst exact:
`NIET VASTGESTELD — NIET NAAR LEERLINGEN` met reden `niet gespeeld`.
Bonus-opdrachten worden via hun hoofdrol gespeeld; een blanco standalone
preview is geen reden voor afkeur.

Voor dit validator-entrypoint is `mode: "opdracht-review"` verplicht. Naast het
bestaande schema zijn dan verplicht:

- `browser`: een waarde die case-insensitive `playwright` bevat;
- `expectation`: `{title, openingLine, expectedVerb, recordedAt}`. Dit wordt
  vóór de eerste interactie verzegeld; `expectedVerb` hoort bij de zin
  `ik verwacht dat ik ga [werkwoord]`;
- `actionLog[]`: regels `{t, action, screenshot}`, strikt oplopende browser-
  tijdstippen en minstens acht regels;
- `animationEvidence[]`: regels `{element, action, framesBefore, framesAfter,
  reducedMotionChecked}`; ieder frame is `{t, transform, opacity}` uit
  `getComputedStyle` via `requestAnimationFrame`, frametijden lopen strikt op
  en `framesAfter` bevat minstens drie opeenvolgende frames;
- `introText`: zichtbare browser-`innerText`, minstens één niet-lege regel per
  intro-stap en minstens drie stappen;
- `comparedWith`: de `missionId` van de tweede opdracht op dezelfde motor, of
  `null` met een niet-lege reden (`comparedWithReason`).

Het bestaande schema blijft verplicht: `schemaVersion`, volledige
`testedCommit`-SHA, relatieve `route`, `result` (`PASS`, `FAIL` of `BLOCKED`),
`limitations`, vier vaste CSS-viewports, checkpoints `start`, `flow`,
`feedback`, `recovery`, `end`, PNG-paden met SHA-256 en afmetingen, en bij een
preview nul `productionMutations` en nul `xpMutations`.

## Fase B — Poort 0: vier veto's

Lees `docs/pedagogy/opdracht-standaard.md` en volg Deel 1 en **Het
afkeurformulier** letterlijk. De vier veto's zijn Artefact, Handelingen,
Onderscheid en Belofte. Beoordeel ze alle vier en noteer per veto
`GESLAAGD`, `GEZAKT` of `NIET VASTGESTELD`.

### Veto 1 — Artefact: speelbewijs

In `/dev/mission-preview` is opslaan niet altijd mogelijk. Bewijs is maken →
volledige reload → artefact terugvinden, en/of docent-/klasgenootweergave die
het toont. Lukt dat niet in de preview, noteer `NIET VASTGESTELD` met reden én
benodigd bewijs: `geautoriseerde synthetische niet-productierun met
testaccount`. Een knop of configveld is nooit bewijs voor `GESLAAGD`.

### Veto 2 — Handelingen: browserlog

Gebruik alleen de actiegebonden `actionLog[]` uit Fase A voor de handelingslijst.
Elke klik en typeactie heeft `Date.now()` uit de pagina via
`browser_evaluate`, omschrijving en screenshotnummer. Ontbreekt de log, dan is
dit veto `NIET VASTGESTELD` met reden en benodigd bewijs.

### Veto 3 — Onderscheid: tweede motorrun

Speel een tweede volledige opdracht op dezelfde motor. Motor betekent de
mapnaam onder `src/features/missions/templates/`. Leg twee volledige manifests,
twee `actionLog[]`-reeksen en een vergelijking per actiepositie in het rapport
vast. `comparedWith` is de tweede `missionId`; zonder dit bewijs is het veto
`NIET VASTGESTELD` met reden en benodigd bewijs.

### Veto 4 — Belofte: vooraf verzegelen

Vóór de eerste interactie schrijft de speler in `expectation` titel,
openingszin en `ik verwacht dat ik ga [werkwoord]`, met tijdstip. Achteraf
invullen is `NIET VASTGESTELD`, met reden en benodigd bewijs; het kan niet
terugwerken naar een voorafgaande belofte.

### Uitkomstvolgorde veto's

Beoordeel alle vier veto's altijd. Pas daarna geldt letterlijk:

```text
minstens één GEZAKT → "AFGEKEURD";
anders minstens één NIET VASTGESTELD → "NIET VASTGESTELD — NIET NAAR LEERLINGEN";
anders door naar de poorten.
```

Bij elk `NIET VASTGESTELD` staan reden én benodigd bewijs. De vier beoordelingen
worden volledig afgemaakt; alleen niet gespeeld of geen valide manifest stopt
vóór deze beoordelingen.

## Fase C — Poorten 1–3

Lees `docs/pedagogy/kwaliteitspoorten.md` en volg het bestand letterlijk.
Beoordeel alle drie poorten. P3c Project-gereedheid is observatie binnen Poort
3, geen poort en geen score.

### Poort 1 — Visueel + Beweging

De gate bevat de statische controles uit kwaliteitspoorten.md, maar meet alleen
werkelijk getoonde elementen met berekende DOM-stijlen, niet broncode. Voor
beweging is één zichtbare leerlingactie verplicht: meet het element direct vóór
de actie en op minstens drie opeenvolgende `requestAnimationFrame`-frames erna
met `getComputedStyle` op `transform`/`opacity` via `browser_evaluate`; leg
keyframes en eigenschappen vast. Ambient animaties tellen niet. Identieke
frames zijn `NIET VASTGESTELD`, niet `GEZAKT`; `GEZAKT` alleen als aantoonbaar
geen element beweegt en reduced motion uit staat. Test reduced motion na verse
reload met `emulateMedia` én de opgeslagen `AccessibilityContext`-instelling.

Hergebruik de sectie **`#### Visual Precision Gate — verplicht en streng`** uit
`.claude/skills/dgskills-design-reviewer/SKILL.md`; dynamisch bewijs komt uit
het Playwright-manifest.

### Poort 2 — Instructie

Bedien browser-only, zonder config, de intro-stappen achtereen. Schrijf daarna
alleen op basis van zichtbare schermtekst drie zinnen: wat maak je, voor wie,
hoe weet je dat het goed is. Voeg die zinnen en de uitgelezen `innerText` toe
aan het rapport; de B1-toets geldt voor die tekst. Ontbrekende speeltekst maakt
de uitkomst `NIET VASTGESTELD`, niet een configgebaseerde goedkeuring.

### Poort 3 — Doelen

Voor elk toegekend kerndoel uit `src/config/slo-kerndoelen-mapping.ts` én elk
platformdoel leg je één actie uit `actionLog[]` en één screenshotnummer van de
plek in het leerlingartefact vast. Eén doel zonder die koppeling is `GEZAKT`.
P3c blijft uitsluitend observatie en krijgt geen `GESLAAGD`/`GEZAKT`.

### Uitkomstvolgorde poorten

Beoordeel alle drie poorten altijd. Pas daarna geldt opnieuw:

```text
minstens één GEZAKT → "AFGEKEURD";
anders minstens één NIET VASTGESTELD → "NIET VASTGESTELD — NIET NAAR LEERLINGEN";
anders door naar de rubric.
```

Bij elk `NIET VASTGESTELD` staan reden én benodigd bewijs. De drie poorten
worden volledig afgemaakt.

### Poortnotatie

Gebruik uitsluitend `GESLAAGD`, `GEZAKT` en `NIET VASTGESTELD`. Vervang deze
statuswoorden niet door "waarschijnlijk", "bijna" of een kleur.

## Visual Precision Gate — verplicht en streng

Deze gate is verplicht voor elke missie, game, tool, simulator, canvas,
dashboard of interactieve opdracht. Een missie mag niet door als deze gate
onvoldoende bewezen is.

Controleer alignment, overlap, text-fit, spacing-rhythm, game/canvas-fit en de
volledige flow (intro, mid-flow, fout/feedback, eind en klaar/volgende). Gebruik
Playwright-manifest-bewijs; Browser-paneelbewijs telt niet voor dynamische
claims.

Blocking wanneer tekst of controls overlappen, een belangrijk deel buiten beeld
valt, CTA's onbruikbaar zijn, slechts één viewport/state is bekeken, of de
reviewer alleen schrijft dat het er goed uitziet zonder concrete observatie.

Controleer doelstijl `duck-bg`, `duck-ink`, `duck-acid`, `duck-gray`,
`duck-error`, `duck-bgLight`; legacy `lab.*` mag alleen consistent en verklaard
worden gebruikt. Knoppen hebben duidelijke labels, hover/focus, en icon-only
knoppen een aria-label. Responsive gedrag werkt op 375, 768 en 1280 px.
Animatie heeft functionele waarde, gebruikt geen wrapper-spam en veroorzaakt
geen cognitieve overload. Afbeeldingen, formulieren, contrast en
kleur-onafhankelijke informatie zijn toegankelijk.

## Fase D — Score

Alleen wanneer alle vier veto's en alle drie poorten `GESLAAGD` zijn, pas je de
`## Verification Rubric` uit `opdracht-klaar-check` toe. Criterium 4 gebruikt
uitsluitend de Nederlandse opsomming van mogelijke leerlingproducten.

Score elk criterium met 0 (niet bewezen/broken), 1 (gedeeltelijk) of 2 (sterk).

| # | Criterium | Verificatievraag | Sterk genoeg |
|---|---|---|---|
| 1 | Didactische kern | Wordt het leerdoel echt geoefend? | De leerling doet de vaardigheid. |
| 2 | SLO/curriculum-fit | Past de claim bij inhoud en doelgroep? | Claim is plausibel en niet overdreven. |
| 3 | Actief denken | Analyseert, maakt, beoordeelt of onderbouwt de leerling? | Meer dan klikken of herinneren. |
| 4 | Leerbaar bewijs | Is bewijs zichtbaar of terug te lezen? | Artefact, uitleg, plan, ontwerp, analyse of reflectie. |
| 5 | Flow compleet | Zijn intro, flow, foutfeedback en eind bekeken? | Alle kernstaten geïnspecteerd. |
| 6 | Visual Precision Gate | Is UI op formaten verzorgd? | Geen overlap, afsnijding of onbruikbare controls. |
| 7 | Feedbackkwaliteit | Helpt feedback verbeteren? | Correct, kort, waarom en één volgende stap. |
| 8 | AI-gedrag | Is AI coachend in plaats van uitvoerend? | AI geeft kernantwoord niet weg. |
| 9 | Technische betrouwbaarheid | Werken handlers, states, restart en fouten? | Geen dode knoppen of stateverlies. |
| 10 | Veiligheid en privacy | Is dit veilig voor minderjarigen en school? | Geen onnodige data of lekken. |

**Commitbewijs:** elk rapport noemt de commit-hash van
`docs/pedagogy/kwaliteitspoorten.md` én `docs/pedagogy/opdracht-standaard.md`,
opgehaald met:

```text
git log -1 --format=%h -- <pad>
```

## Rapportformaat

Schrijf `business/dgskills-reviews/<id>-<datum>.md` met exact deze onderdelen:

```md
## Gespeeld
- Ja/nee; begin-tot-eind: ja/nee
- Commit-SHA: <sha>
- Evidence: business/dgskills-reviews/evidence/<id>-<datum>/manifest.json

## Handelingslijst
Bijlage met één fysiek werkwoord per minuut, afgeleid uit actionLog[].

## Afkeurformulier
Veto 1–4 uit docs/pedagogy/opdracht-standaard.md, alle vier ingevuld.
Poort 1 Visueel + Beweging  GESLAAGD / GEZAKT / NIET VASTGESTELD
Poort 2 Instructie          GESLAAGD / GEZAKT / NIET VASTGESTELD
Poort 3 Doelen              GESLAAGD / GEZAKT / NIET VASTGESTELD
Bij ieder NIET VASTGESTELD: reden en benodigd bewijs.

## UITKOMST
DOOR NAAR RUBRIC  /  AFGEKEURD  /  NIET VASTGESTELD — NIET NAAR LEERLINGEN
```

Gebruik de letterlijke uitkomsttekst uit **Het afkeurformulier** in
`docs/pedagogy/opdracht-standaard.md`:

```text
UITKOMST:  DOOR NAAR RUBRIC  /  AFGEKEURD  /  NIET VASTGESTELD — NIET NAAR LEERLINGEN
```

Voeg de rubric-tabel uitsluitend toe bij `DOOR NAAR RUBRIC`; bij afkeur of niet
vastgesteld komt geen score of puntentotaal.

## Beslisregels rubric

- 16–20 zonder veto- of poortprobleem: `DOOR NAAR RUBRIC`.
- 12–15 of één betekenisvolle waarschuwing: noteer `fix-eerst`.
- 0–11, een blokkade of onduidelijk leerbewijs: `herontwerp`, tenzij een
  kleine reparatie het probleem aantoonbaar oplost.

Een hoge score heft nooit een gezakte poort of veto op. Een ontbrekend
bewijsstuk blijft `NIET VASTGESTELD` totdat de reviewer het werkelijk verzamelt.

## Herstart en grenzen

Gebruik `reset=1` alleen om de lokale preview voor een nieuwe speelronde schoon
te starten. Gebruik geen verborgen state, adminroute, database-edit of
handmatig gemanipuleerde manifestvelden. Als login zonder geschikt testaccount
nodig is, rapporteer de blokkade als `NIET VASTGESTELD`.
