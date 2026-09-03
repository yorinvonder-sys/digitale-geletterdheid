# Missie-review: sustainability-scanner

**Datum:** 2026-08-25
**TemplateType:** data-viewer
**Curriculumplek:** Leerjaar 2, Periode 4 — "Ethiek, Maatschappij & Eindproject" (SLO 23C, VSO 20B)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 7/10

- Consistente content-structuur (tabel → cirkelgrafiek → informatiekaarten), badge-kleuren gebruiken alleen `#202023` (duck-ink) behalve de topbadge — geen visuele differentiatie tussen de vier scoreniveaus, terwijl `chartData` wél kleur gebruikt (`#e1ff01`, `#ff3c21`) voor slechts 2 van de 5 taartsegmenten (regel 82-86). Dat oogt onbedoeld inconsistent: waarom zijn Smartphone, Smart-tv en Tablet allemaal zwart terwijl Laptop geel en Console rood is?
- Copy-lengte per vraag en kaart is passend voor leerjaar 2 (kort, scanbaar).
- Engine-brede bevindingen (zie `engine-data-viewer.json`) raken deze missie zonder aanpassing: de disabled-knop bij <40% score en het premature `clearSave()` gelden hier onveranderd, want deze missie heeft geen eigen completion-UI.

## Didactiek — score 6/10

- **Titel-inhoud mismatch met de mission-id.** De missie heet `sustainability-scanner` ("duurzaamheid-scanner"), maar de titel is "Trend Scanner" en de volledige inhoud gaat over digitale gebruikstrends (gaming, streaming, social media, dataverbruik) — er wordt nergens duurzaamheid, milieu of ecologische impact behandeld. De `missionGoals.ts`-entry (regel 819) en `slo-kerndoelen-mapping.ts` (regel 150) zijn intern consistent met de huidige (trend-)inhoud, dus de missie werkt inhoudelijk coherent — alleen de bestandsnaam/id is een misleidende erfenis van een eerder onderwerp. Voor onderhoud is dit verwarrend (een ontwikkelaar die "sustainability" zoekt vindt geen duurzaamheidscontent) maar niet leerling-zichtbaar, want de UI toont alleen `title: 'Trend Scanner'`.
- SLO-koppeling 23C (digitale technologie en maatschappij) past bij de inhoud (gebruikstrends, dataverbruik, algoritmen) — logisch gekozen ondanks de mismatch met de id.
- Vraag q3 en q6 zijn open observatievragen met `minKeywords: 1` — een leerling kan met één toevallig treffend woord scoren zonder een samenhangende redenering; dit is een bekend, geaccepteerd patroon in deze template-engine (zie engine-bevindingen: scoring is "gokbestendig gemaakt" op instapniveau, maar `minKeywords: 1` blijft hier zwak).
- Kaart 4 ("aanbevelingsalgoritmen") introduceert impliciet een goed passend vervolgthema op de curriculumplek (ethiek & maatschappij), en q8 vraagt terecht om een persoonlijke koppeling.

## Tech — score 8/10 (engine-gebaseerd)

- Geen missie-specifieke technische issues gevonden in de config zelf (geen custom handlers, geen edge-function-calls, puur declaratieve data).
- Deze missie erft rechtstreeks de twee blocking-bevindingen uit `engine-data-viewer.json`: het ontbreken van `onRetry` op het resultatenscherm (dode knop bij <40%, hier is de drempel 40 van maxScore 100) en de premature `clearSave()` vóór bevestigde serveropslag. Beide worden niet apart herhaald als nieuwe bevindingen — verholpen op engine-niveau lost dit ook hier op.
- `maxScore: 100` en de badge-drempels (0/40/65/85) zijn intern consistent en overlappen niet.

---

## Voorstellen

### 1. Kleurconsistentie taartgrafiek herstellen (design)

```ts
// voor (regel 82-86)
chartData: [
    { label: 'Smartphone', value: 54, color: '#202023' },
    { label: 'Laptop', value: 22, color: '#e1ff01' },
    { label: 'Smart-tv', value: 13, color: '#202023' },
    { label: 'Tablet', value: 7, color: '#202023' },
    { label: 'Console', value: 4, color: '#ff3c21' },
],

// na — elk segment een onderscheidende, contrastrijke kleur uit het duck-palet
chartData: [
    { label: 'Smartphone', value: 54, color: '#202023' },
    { label: 'Laptop', value: 22, color: '#e1ff01' },
    { label: 'Smart-tv', value: 13, color: '#4c8bf5' },
    { label: 'Tablet', value: 7, color: '#8a8a8a' },
    { label: 'Console', value: 4, color: '#ff3c21' },
],
```

### 2. Zwakke keyword-drempel op open vragen verhogen (didactiek)

```ts
// voor (regel 65, 116, 181)
minKeywords: 1,

// na — vraag om minimaal twee onderbouwende begrippen zodat een toevalstreffer niet volstaat
minKeywords: 2,
```

*(Buiten whitelist voor auto-fix: engine-brede completion-fixes uit `engine-data-viewer.json` — die horen in `DataViewer.tsx`, niet in deze config.)*

---

## Samenvatting & verdict

De content van `sustainability-scanner` is inhoudelijk sterk en leerjaar-passend, maar de mission-id draagt een misleidende naam ("duurzaamheid") voor een missie die volledig over digitale gebruikstrends gaat — een onderhouds-risico, geen leerling-zichtbaar probleem. De taartgrafiek-kleuren zijn inconsistent toegepast, en de open-vraag-scoring is kwetsbaar voor gokken door de lage `minKeywords`-drempel. De twee blocking engine-bevindingen (dode resultatenknop, premature save-clear) gelden ongewijzigd voor deze missie en moeten op engine-niveau worden opgelost.

**Verdict: fix-eerst** — de engine-blockers (niet missie-specifiek fixbaar) staan een "ok" in de weg; de missie-eigen bevindingen zijn licht en autofixable.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
