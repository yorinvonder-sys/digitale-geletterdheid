---
name: opdracht-review
description: Gebruik voor "opdracht review", "review deze opdracht", "beoordeel opdracht", "/opdracht-review" of "speel en beoordeel". Dit is de enige voordeur voor het eindoordeel over één opdracht.
---

# Opdracht review

Deze skill is de enige voordeur voor het eindoordeel over één opdracht. Speel
eerst als leerling, verzamel bewijs, beoordeel daarna de vier veto's en drie
poorten en geef pas daarna een rubric-score.

## Operating Rules

- Schrijf in het Nederlands, tenzij de gebruiker anders vraagt.
- Werk evidence-first: beweer niets over flow, viewport of gedrag zonder dat
  het werkelijk is bekeken.
- Ontbrekend bewijs is onzekerheid, nooit succes.
- Gebruik de side-effect-vrije preview:
  `/dev/mission-preview?mission=<id>&reset=1`.
- Speel niet op productie met een bestaand leerlingaccount en gebruik geen echte
  persoonsgegevens, leerlinggegevens, geheimen of tokens.
- Nooit oordelen op basis van config. De SLO-mapping en de opdrachtregistratie
  mogen alleen worden gelezen om te weten welke kerndoelen en welke motor de
  opdracht claimt (de aanklacht); nooit om te bewijzen dat iets bij het spelen
  gebeurt.
- Escaleer privacy, auth, Supabase/RLS, AI-endpoints en minderjarigendata als
  Rood.
- Manifesten vóór deze schemaversie (`schemaVersion: 2`) valideren niet meer.

## Modelroutering

- Fase A wordt sequentieel uitgevoerd door één speler-agent met uitsluitend
  `mcp__playwright__*`-tools.
- Het oordeel en de poortbeslissing worden door de Sol-reviewroute gemaakt.
- De ingebouwde Browser/Chrome-paneelweergave kan beweging stilzetten; gebruik
  daarom de Playwright-route uit het Meetrecept voor dynamische claims.

## Meetrecept (voor de speler-agent)

Volg deze stappen letterlijk. Gebruik alleen de MCP-tools met prefix
`mcp__playwright__`. Bewaar alle bestanden in de eigen evidence-map en gebruik
geen shell, losse browser of handmatig aangepaste bewijsvelden als meetroute.

### 1. Start en verwachting verzegelen

1. Open `/dev/mission-preview?mission=<id>&reset=1` met
   `mcp__playwright__browser_navigate`.
2. Neem vóór elke klik of typeactie de verwachting op. De tijd komt uit de
   pagina zelf:

```js
const expectation = await mcp__playwright__browser_evaluate({
  function: `() => {
    const recordedAt = Date.now();
    const title = document.querySelector('h1')?.innerText?.trim() || document.title;
    const lines = document.body.innerText.split('\\n').map(s => s.trim()).filter(Boolean);
    const openingLine = lines.find(line => line !== title) || title;
    const expectedVerb = '<eigen werkwoord uit de voorspelling>';
    return { title, openingLine, expectedVerb, recordedAt };
  }`
});
```

Vervang de tijdelijke tekst in `expectedVerb` door het eigen werkwoord voordat
je de oproep uitvoert. Zet de teruggegeven waarde direct in `expectation` en
verzegel haar voordat je iets aanklikt. De zin is: `ik verwacht dat ik ga
[expectedVerb]`.

### 2. Logger installeren en iedere actie koppelen

Installeer vóór de eerste actie de logger met `mcp__playwright__browser_evaluate`:

```js
await mcp__playwright__browser_evaluate({ function: `() => {
  window.__dgLog = [];
  ['click','input','keydown','pointerdown'].forEach(t => document.addEventListener(t, e =>
    window.__dgLog.push({ t: Date.now(), type: t,
      target: (e.target.closest('button,a,input,textarea,[role]') || e.target).outerHTML.slice(0,120) }), true));
  return 'logger geïnstalleerd';
}` });
```

Na **elke** `mcp__playwright__browser_click`,
`mcp__playwright__browser_type`, `mcp__playwright__browser_press_key` of andere
Playwright-actie lees je de log uit en voeg je een regel toe aan `actionLog`:

```js
const events = await mcp__playwright__browser_evaluate({
  function: `() => { const copy = window.__dgLog || []; window.__dgLog.splice(0); return copy; }`
});
```

Noteer bij die regel de gewone omschrijving van de actie en het nummer van de
screenshot die je direct daarna maakt. Leg bij typen ook vast of de volgende
staat veranderde: `changedNextState: true` of `false`. Na een navigatie of
reload installeer je de logger opnieuw en noteer je dat als actie.

### 3. Screenshots en viewportmatrix

Maak screenshots met `mcp__playwright__browser_take_screenshot` en bestandsnaam
`NN-<viewport>-<staat>.png` in de evidence-map. Geef ieder beeld een uniek
positief nummer en neem pad, afmetingen en SHA-256 op in de manifest-index.
Verwijs bij iedere actie naar dat nummer.

Speel minimaal desktop (1440x900) en mobiel (375 px breed) voor start en eind.
Als alle vier veto's GESLAAGD zijn, speel je aanvullend tablet staand (820x1180)
en tablet liggend (1180x820) en leg je per formaat start, flow, feedback,
recovery en eind vast. Zijn niet alle veto's GESLAAGD, dan is de beperkte matrix
voldoende: desktop start/eind en mobiel start/eind.

### 4. Actiegebonden beweging meten

Kies één element dat je tijdens een zichtbare leerlingactie zag veranderen en
neem de selector op. Laat vóór de actie, de actie zelf en de drie beeldjes erna
in één `mcp__playwright__browser_run_code_unsafe`-oproep uitvoeren, zodat de
animatie niet al voorbij is vóór de meting:

```js
const measurement = await mcp__playwright__browser_run_code_unsafe({ code: `async (page) => {
  const selector = ${JSON.stringify(selector)};
  const actionSelector = ${JSON.stringify(actionSelector)};
  const read = () => page.evaluate((sel) => {
    const el = document.querySelector(sel); const s = getComputedStyle(el); const r = el.getBoundingClientRect();
    return { t: Date.now(), transform: s.transform, opacity: s.opacity,
      backgroundColor: s.backgroundColor, color: s.color, borderColor: s.borderColor,
      boxShadow: s.boxShadow, rect: { x: r.x, y: r.y, width: r.width, height: r.height } };
  }, selector);
  const framesBefore = [await read()];
  await page.click(actionSelector);
  const actionTime = await page.evaluate(() => Date.now());
  const framesAfter = [];
  for (let i = 0; i < 3; i += 1) {
    await page.evaluate(() => new Promise(r => requestAnimationFrame(r)));
    framesAfter.push(await read());
  }
  return { framesBefore, actionTime, framesAfter };
}` });
```

Een volledige meting bevat `framesBefore`, `framesAfter`, `actionTime`,
`screenshot` en `reducedMotionChecked`. Lees direct na deze actie met
`mcp__playwright__browser_evaluate` de logger uit en maak daarna met
`mcp__playwright__browser_take_screenshot` het gekoppelde beeld. Gelijke waarden voor alle genoemde
kenmerken en afmetingen in drie beeldjes zijn NIET VASTGESTELD.

### 5. Reduced motion (enige geldige route)

Er is geen `emulateMedia`-tool in deze meetroute. Gebruik uitsluitend de
app-instelling, gevolgd door een verse navigatie:

```js
const dezelfdeUrl = '/dev/mission-preview?mission=<id>&reset=1';
const previousAccessibility = await mcp__playwright__browser_evaluate({ function: `() => {
  const raw = localStorage.getItem('dgskills-accessibility');
  const old = JSON.parse(raw || '{}');
  localStorage.setItem('dgskills-accessibility', JSON.stringify({ ...old, reducedMotion: true }));
  return raw;
}` });
await mcp__playwright__browser_navigate({ url: dezelfdeUrl });
const classPresent = await mcp__playwright__browser_evaluate({
  function: `() => document.documentElement.classList.contains('reduced-motion')`
});
await mcp__playwright__browser_take_screenshot({ filename: 'NN-mobile-reduced-motion.png' });
await mcp__playwright__browser_evaluate({ function: `() => {
  const raw = ${JSON.stringify(previousAccessibility)};
  if (raw === null) localStorage.removeItem('dgskills-accessibility');
  else localStorage.setItem('dgskills-accessibility', raw);
}` });
await mcp__playwright__browser_navigate({ url: dezelfdeUrl });
```

Neem `reducedMotion: { classPresent: true, screenshot: NN }` op en zet de
oorspronkelijke instelling daarna terug met opnieuw een verse navigatie.

### 6. Intro-tekst vastleggen

Voor iedere intro-stap sla je de volledige zichtbare tekst op:

```js
const text = await mcp__playwright__browser_evaluate({ function: '() => document.body.innerText' });
introSteps.push({ screenshot: screenshotNumber, text });
```

Na minstens drie stappen schrijft de speler drie zinnen uit deze tekst in
`introSummary: { maak, voorWie, goed }`. Niet citeren uit bronbestanden.

### 7. Veto 2 per minuut berekenen

De handelingslijst ontstaat door de speeltijd vanaf `expectation.recordedAt` in
minuten te verdelen. Een minuut zonder acties, of met alleen klikken op
"volgende/verder/start" of alleen keuze-knoppen, telt als lezen/klikken. Typen
waarbij de volgende staat niet verandert telt eveneens als klikken; noteer dat
per typactie met `changedNextState: false`. Zet in het manifest:

```json
{"veto2":{"readClickMinutes":3,"totalMinutes":5,"percentage":0.6}}
```

`percentage` is de verhouding `readClickMinutes / totalMinutes`; boven 0,5
(50%) is Veto 2 GEZAKT volgens de opdrachtstandaard.

### 8. Tweede opdracht voor Veto 3

Speel de tweede opdracht volledig met een eigen evidence-map en eigen manifest.
Vergelijk de handelingen per positie. Gebruik in het eerste manifest:

```json
{"comparedWith":{"missionId":"andere-opdracht","manifestPath":"../andere-opdracht/manifest.json"}}
```

Bij maatwerk zonder gedeelde motor mag dit `null` zijn met
`comparedWithReason: "eigen motor"`, tenzij de reviewer een andere maatwerk-
opdracht aanwijst die bij het spelen dezelfde handelingen geeft.

### 9. Afronden

Controleer vóór overdracht dat iedere actie, frame, intro-stap en reduced-motion-
controle naar een bestaand genummerd en gehasht PNG verwijst. Het manifest gebruikt
`schemaVersion: 2`, `mode: "opdracht-review"` en `gates` met veto1–4 en poort1–3. Een preview vermeldt nul
`productionMutations` en nul `xpMutations`; oudere manifesten worden niet meer
goedgekeurd.

## Fase A — Spelen

Speel start, normale flow, minstens één fout of onvolmaakt antwoord, feedback,
herstel en eind-CTA als een gewone leerling. Noteer dode knoppen, onduidelijke
labels, onlogische vervolgstappen en stateverlies. `GESPEELD` betekent dat alle
genoemde toestanden zijn doorlopen; anders is het NIET GESPEELD en stopt de
beoordeling met `NIET VASTGESTELD — NIET NAAR LEERLINGEN`.

Valideer de map na het spelen met:

```text
node .claude/skills/opdracht-review/scripts/validate-evidence.mjs <manifest.json>
```

## Fase B — Poort 0: vier veto's

Lees `docs/pedagogy/opdracht-standaard.md` Deel 1 en vul Artefact,
Handelingen, Onderscheid en Belofte volledig in. Voor maatwerk zonder gedeelde
motor geldt Veto 3 = GESLAAGD met notitie "eigen motor"; anders zijn twee
volledige speelbewijzen nodig.

## Fase C — Poorten 1–3

Lees `docs/pedagogy/kwaliteitspoorten.md` en volg die tekst letterlijk. De
SLO-mapping en opdrachtregistratie zijn alleen de aanklacht (welke doelen de
opdracht claimt), nooit het bewijs. P3c projectgereedheid is observatie zonder
eigen status of score. Gebruik voor de visuele controle exact de gate hieronder.

#### Visual Precision Gate — verplicht en streng

Controleer uitlijning, overlap, tekstpassendheid, tussenruimte, spel- of
canvasruimte en de volledige flow (intro, tussenstaat, fout/feedback, eind en
klaar/volgende). Gebruik de vier veto-afhankelijke viewportmatrix en concrete
screenshots. Een opdracht gaat niet door bij overlap, afgesneden inhoud,
onbruikbare knoppen of slechts één bekeken formaat/toestand. Kijk ook naar de
eendstijl, duidelijke labels, focus, aria-labels, contrast en informatie die
niet alleen door kleur wordt overgebracht. Beweging heeft een functie en maakt
de leerling niet onnodig onrustig.

## Fase D — Score

Alleen wanneer alle vier veto's en drie poorten GESLAAGD zijn, pas je de
`## Verification Rubric` uit `opdracht-klaar-check` toe. Score elk criterium
met 0, 1 of 2. Criterium 4 gebruikt alleen Nederlandse leerlingproducten.

| # | Criterium | Sterk genoeg |
|---|---|---|
| 1 | Didactische kern | De leerling oefent het leerdoel echt. |
| 2 | SLO/curriculum-fit | De claim past bij inhoud en doelgroep. |
| 3 | Actief denken | De leerling analyseert, maakt, beoordeelt of onderbouwt. |
| 4 | Leerbaar bewijs | Werk, uitleg, plan, ontwerp, analyse of reflectie is zichtbaar. |
| 5 | Flow compleet | Intro, flow, foutfeedback en eind zijn bekeken. |
| 6 | Visual Precision Gate | Geen overlap, afsnijding of onbruikbare knoppen. |
| 7 | Feedbackkwaliteit | Feedback zegt wat beter kan en wat de volgende stap is. |
| 8 | AI-gedrag | Hulp coacht en neemt het kernwerk niet over. |
| 9 | Technische betrouwbaarheid | Handelingen, herstart en fouten werken. |
| 10 | Veiligheid en privacy | Geen onnodige gegevens of lekken. |

## Rapportformaat

Schrijf `business/dgskills-reviews/<id>-<datum>.md` met Gespeeld,
Handelingslijst, Afkeurformulier, UITKOMST en alleen bij DOOR NAAR RUBRIC de
rubric-tabel. Gebruik de uitkomsttekst letterlijk:

```text
UITKOMST:  DOOR NAAR RUBRIC  /  AFGEKEURD  /  NIET VASTGESTELD — NIET NAAR LEERLINGEN
```

Vermeld de volledige commit-hash van de kwaliteitspoorten en de
opdrachtstandaard.

## Beslisregels rubric

- 16–20 = `ship`.
- 12–15 = `fix-eerst`.
- 0–11 = `herontwerp`.

Deze score heft nooit een gezakt veto of poort op. Ontbrekend bewijs blijft
NIET VASTGESTELD totdat het werkelijk is verzameld.

## Herstart en grenzen

Gebruik `reset=1` alleen om de lokale preview voor een nieuwe speelronde schoon
te starten. Gebruik geen verborgen state, adminroute, database-edit of
handmatig gemanipuleerde bewijsvelden. Als login zonder geschikt testaccount
nodig is, rapporteer de blokkade als NIET VASTGESTELD.
