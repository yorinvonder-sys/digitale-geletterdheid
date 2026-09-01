---
name: opdracht-review
description: Use this skill for "opdracht review", "review deze opdracht", "beoordeel opdracht", "/opdracht-review", or "speel en beoordeel". This is the only front door for the final judgment on one assignment.
---

# Opdracht review

Deze skill is de enige voordeur voor het eindoordeel over één opdracht. Speel
eerst als leerling, doorloop daarna de veto's en poorten, en score pas als alles
is geslaagd.

## Operating Rules

- Schrijf in het Nederlands, tenzij de gebruiker anders vraagt.
- Werk evidence-first: beweer niets over een flow, viewport, bestand of gedrag
  zonder dat het werkelijk is bekeken.
- Houd bevindingen vlak, concreet en controleerbaar.
- Ontbrekend bewijs is onzekerheid, nooit succes.
- Nooit oordelen op basis van het configbestand; alleen op basis van wat er bij het spelen gebeurt.
- Gebruik de side-effect-vrije preview: `/dev/mission-preview?mission=<id>&reset=1`.
- Speel niet op productie met een bestaand leerlingaccount.
- Gebruik geen echte persoonsgegevens, leerlinggegevens, geheimen of tokens.
- Escaleer privacy, auth, Supabase/RLS, AI-endpoints en minderjarigendata als Rood.

## Modelroutering

- Fase A wordt uitgevoerd door één Sonnet-subagent met `mcp__playwright__*`.
- Gebruik één browser en speel sequentieel; geen parallelle browsers.
- Het oordeel en de poortbeslissing worden door Opus met high reasoning gemaakt.
- Het Browser-paneel bevriest animaties. Daarom is Browser-paneelbewijs geen
  bewijs voor beweging; gebruik Playwright voor t0/t+500 ms en state changes.

## Fase A — Spelen

### Operating Rules (live check)

- Schrijf in het Nederlands tenzij de gebruiker expliciet anders vraagt.
- Gebruik standaard de side-effect-vrije preview-route
  `/dev/mission-preview?mission=<id>&reset=1` op de draaiende dev-server.
  Voltooien daar is bewust een no-op: er wordt geen voortgang, XP of
  activiteitenlog geschreven.
- Speel nooit productie met een bestaand leerlingaccount. Een productie-
  playthrough vereist expliciete toestemming én een aangewezen testaccount.
- Geef voorrang aan browserbewijs boven statische codeclaims.
- Gedraag je als een gewone leerling: lees wat op het scherm staat, klik de
  verwachte controls, maak redelijke keuzes en noteer verwarring.
- Gebruik geen admin-snelkoppelingen, databasebewerkingen of verborgen
  implementatiekennis om voortgang te faken.
- Gebruik geen echte persoonlijke of gevoelige informatie.

### 2. Student Playthrough

Speel de hele opdracht als leerling:

- begin op de intro/start;
- volg instructies zonder codekennis;
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

Maak tijdens het spelen een bijlage met per minuut een fysiek werkwoord: wat de
leerling doet, niet wat de config beweert. Deze lijst is verplicht bewijs voor
Veto 2 en wordt aan het rapport gekoppeld.

Noteer ook wanneer de leerling leest, klikt, typt, sleept, kiest, vergelijkt,
maakt, herstelt of teruggaat. Als typen niets verandert aan de volgende staat,
tel het als klikken. Beschrijf bij elke overgang het zichtbare gevolg.

### Technische signalen

Noteer alleen signalen die de leerlingflow raken: consolefouten, mislukte
netwerkverzoeken, ontbrekende afbeeldingen, lang laden, renderproblemen en
vreemd gedrag na herladen of terug/vooruit navigeren. Dev-waarschuwingen zonder
zichtbaar effect zijn geen bevinding.

### Fase A-besluit

`GESPEELD` betekent: start, normale flow, fout/feedback en eind-CTA zijn
doorlopen. `NIET GESPEELD` betekent: een van die onderdelen ontbreekt, ook als
de code of config veelbelovend lijkt.

### Evidence

Bewaar genummerde PNG's en `manifest.json` in
`business/dgskills-reviews/evidence/<id>-<datum>/`. Valideer met:

```text
node .claude/skills/opdracht-review/scripts/validate-evidence.mjs <manifest>
```

Zonder valide manifest is de uitkomst exact: `NIET VASTGESTELD — niet gespeeld`.
Bonus-opdrachten worden via hun hoofdrol gespeeld; een blanco standalone
preview is geen reden voor afkeur.

**STOP Fase A:** zonder begin-tot-eind playthrough, verplichte handelingslijst
en valide manifest stop je. Ga niet naar veto's, poorten of score.

## Fase B — Poort 0: vier veto's

Lees `docs/pedagogy/opdracht-standaard.md` en volg Deel 1 letterlijk. Parafraseer
de veto's niet in deze skill. Vul daaruit Veto 1 Artefact, Veto 2 Handelingen,
Veto 3 Onderscheid en Veto 4 Belofte in.

Veto 3 vereist een tweede gespeelde opdracht op dezelfde motor. Motor betekent
de mapnaam onder `src/features/missions/templates/`; speel die tweede opdracht
met een eigen handelingslijst en vergelijk de feitelijke handelingen.

**STOP Fase B:** één `GEZAKT` of `NIET VASTGESTELD` bij een veto betekent direct
`AFGEKEURD` of `NIET VASTGESTELD`; geen score en geen rubric.

## Fase C — Poorten 1–3

Lees `docs/pedagogy/kwaliteitspoorten.md` en volg het bestand letterlijk.
Beoordeel achtereenvolgens Poort 1 Visueel + Beweging, Poort 2 Instructie en
Poort 3 Doelen. P3c Project-gereedheid is observatie binnen Poort 3, geen poort
en geen score.

**STOP Fase C:** één `GEZAKT` of `NIET VASTGESTELD` betekent direct
`AFGEKEURD` of `NIET VASTGESTELD`; ga niet naar de rubric.

### Poortnotatie

Gebruik uitsluitend `GESLAAGD`, `GEZAKT` en `NIET VASTGESTELD`. Een toelichting
mag uitgebreider zijn, maar vervang de statuswoorden niet door "waarschijnlijk",
"bijna" of een kleur.

### Reduced motion

Voer de relevante intro- en state-change-stappen opnieuw uit met reduced motion.
De inhoud moet onmiddellijk zichtbaar zijn; alleen het weglaten van de animatie
is toegestaan. Leg dit vast als screenshot in het manifest.

## Visual Precision Gate

Deze gate is verplicht voor elke missie, game, tool, simulator, canvas, dashboard
of interactieve opdracht. Een missie mag niet door als deze gate onvoldoende
bewezen is.

Controleer alignment, overlap, text-fit, spacing-rhythm, game/canvas-fit en de
volledige flow (intro, mid-flow, fout/feedback, eind en klaar/volgende). Gebruik
Playwright-manifest-bewijs; Browser-paneelbewijs telt niet voor dynamische claims.

Blocking wanneer tekst of controls overlappen, een belangrijk deel buiten beeld
valt, CTA's onbruikbaar zijn, slechts één viewport/state is bekeken, of de
reviewer alleen schrijft dat het er goed uitziet zonder concrete observatie.

Controleer daarnaast doelstijl `duck-bg`, `duck-ink`, `duck-acid`, `duck-gray`,
`duck-error`, `duck-bgLight`; legacy `lab.*` mag alleen consistent en verklaard
worden gebruikt. Knoppen hebben duidelijke labels, hover/focus, en icon-only
knoppen een aria-label. Responsive gedrag moet op 375, 768 en 1280 px werken.
Animatie heeft functionele waarde, gebruikt geen wrapper-spam en veroorzaakt
geen cognitieve overload. Afbeeldingen, formulieren, contrast en kleur-onafhankelijke
informatie zijn toegankelijk.

## Fase D — Score

Alleen wanneer alle vier veto's en Poorten 1–3 `GESLAAGD` zijn, pas je de
`## Verification Rubric` uit `opdracht-klaar-check` toe. In criterium 4 staat
geen woord `choice`.

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

## Rapportformaat

Schrijf `business/dgskills-reviews/<id>-<datum>.md` met exact deze onderdelen:

```md
## Gespeeld
- Ja/nee; begin-tot-eind: ja/nee
- Commit-SHA: <sha>
- Evidence: business/dgskills-reviews/evidence/<id>-<datum>/manifest.json

## Handelingslijst
Bijlage met één fysiek werkwoord per minuut.

## Afkeurformulier
Veto 1–4 uit docs/pedagogy/opdracht-standaard.md
Poort 1 Visueel + Beweging  GESLAAGD / GEZAKT / NIET VASTGESTELD
Poort 2 Instructie          GESLAAGD / GEZAKT / NIET VASTGESTELD
Poort 3 Doelen              GESLAAGD / GEZAKT / NIET VASTGESTELD

## UITKOMST
DOOR NAAR RUBRIC / AFGEKEURD — veto/poort: <naam> / NIET VASTGESTELD
```

Voeg de rubric-tabel uitsluitend toe bij `DOOR NAAR RUBRIC`; bij afkeur of niet
vastgesteld komt geen score of puntentotaal.

**STOP Fase D:** als de uitkomst niet `DOOR NAAR RUBRIC` is, stop zonder rubric.

## Beslisregels rubric

- 16–20 zonder veto of poortprobleem: `DOOR NAAR RUBRIC`.
- 12–15 of één betekenisvolle waarschuwing: noteer `fix-eerst` in de rubric.
- 0–11, een blokkade of onduidelijk leerbewijs: `herontwerp`, tenzij een kleine
  reparatie het probleem aantoonbaar oplost.

Een hoge score heft nooit een gezakte poort of veto op. Een ontbrekend bewijsstuk
blijft `NIET VASTGESTELD` totdat de reviewer het werkelijk verzamelt.

## Herstart en grenzen

Gebruik `reset=1` alleen om de lokale preview voor een nieuwe speelronde schoon
te starten. Gebruik geen verborgen state, adminroute, database-edit of handmatig
gemanipuleerde manifestvelden. Als de opdracht achter login zit zonder geschikt
testaccount, rapporteer de blokkade en stop.
