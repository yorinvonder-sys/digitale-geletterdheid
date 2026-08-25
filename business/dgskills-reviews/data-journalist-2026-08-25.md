# Review: data-journalist — 2026-08-25

templateType: data-viewer

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7.5/10

**Geslaagd**
- Drie datasettypes (tabel, staafgrafiek, document-cards) geven visuele afwisseling binnen één missie.
- Badges en takeaways zijn consistent met het duck-palet (`#e1ff01`, `#202023`).
- Chart-kleuren gebruiken bewust één accentkleur (`#ff3c21`) om het hoogste land te markeren, rest neutraal — goede data-ink-ratio.

**Aandachtspunten**
- ⚠️ Placeholder- en ingevulde-tekstkleur in de tabelfilters zijn identiek (`InteractiveTable.tsx:97`, engine-bevinding, raakt deze missie direct omdat dataset 1 een sorteerbare/filterbare tabel is met 12 rijen).
- ⚠️ Visual Precision Gate: geen dynamisch (Chrome-plugin) bewijs beschikbaar in deze pass — status **unverified**, niet automatisch "geslaagd".

## Didactiek — score 8.5/10

**Geslaagd**
- SLO-koppeling (`21C` Data & Dataverwerking, VSO `18B`) is correct en de content bewijst het kerndoel substantieel: sorteren/filteren, gemiddelde berekenen, bronbetrouwbaarheid wegen.
- Leerjaar 2-passend: cijfers en context (social media, schermtijd) sluiten aan bij leefwereld.
- Goede Bloom-opbouw: van aflezen (q1, q4) → berekenen (q2, q5) → analyseren/verklaren (q3, q6, q8) → evalueren van bronkwaliteit (q7, followUp).
- `missionGoals.ts`-entry (drempel 65) is consistent met `maxScore: 100` en de badge-drempels.
- Sterk staaltje kritisch-denken-didactiek: vier fictieve nieuwsberichten met oplopende betrouwbaarheid (opiniestuk → bedrijfsonderzoek → single-study → meta-analyse) leert leerlingen bronhiërarchie zonder dit expliciet te benoemen als les.

**Aandachtspunten**
- ⚠️ q3 en q6 zijn `text-observation` met keyword-matching (`moe`, `blij`, `patroon` resp. `schoolcultuur`, `cultuur`); bij een leerling die het patroon correct beschrijft met synoniemen (bv. "vermoeidheid" i.p.v. "moe") kan de score onterecht laag uitvallen. Overweeg bredere keyword-sets.
- ℹ️ `sloEntry`-comment zegt expliciet dat er geen infographic/digitaal product wordt gemaakt (afwijking t.o.v. 22A/19A) — bewust en correct gedocumenteerd, geen bevinding.

## Tech — score 5.5/10

**Geslaagd**
- `enableChat: true` + `chatRoleId: 'data-journalist'` correct gewired.
- Config-structuur volgt `DataViewerConfig`-type strikt; geen `any`, geen relatieve imports in de configlaag zelf.
- Scoring-logica (gokbestendige observatiescore, herstelde-opslag-validatie) zit in de gedeelde engine en is daar al beoordeeld.

**Blocking (overgenomen van de engine-review, raakt deze missie rechtstreeks)**
- ❌ Een leerling die onder de 40%-drempel scoort (bijvoorbeeld door q2/q5 fout te hebben, samen 35 punten) komt vast te zitten op het resultatenscherm: geen `onRetry`, knop disabled, geen terugweg (`DataViewer.tsx:984`). Voor deze missie is dat een reëel scenario — bij een gemiste dataset-2-berekening (35 punten) zakt een leerling makkelijk onder 40.
- ❌ `clearSave()` wordt vóór `onComplete` aangeroepen (`DataViewer.tsx:950`); bij een mislukte serveropslag verliest de leerling al zijn werk aan deze missie (12+6+4 = 22 vragen, incl. tekst-observaties).

**Warning (overgenomen, raakt deze missie)**
- ⚠️ Drempel-inconsistentie: engine gebruikt `totalScore/maxScore >= 0.4` (raw), CompletionScreen gebruikt het afgeronde percentage. Met `maxScore: 100` in deze config kan een score van 39,5 (afgerond 40%) tot een tegenstrijdige "Gehaald"-melding + `success: false`-rapportage leiden.
- ⚠️ Geen `aria-live`/`aria-describedby` op de woordenteller bij de observatievragen (q3, q6, q8 — drie van de acht vragen in deze missie zijn `text-observation`).

**Info (overgenomen, licht relevant)**
- ℹ️ Bij fout antwoord toont de engine direct het correcte antwoord; bij "Vorige dataset" blijft dat zichtbaar — van toepassing op alle 8 vragen in deze missie.

Deze tech-bevindingen zitten in de **gedeelde engine** (`DataViewer.tsx`), niet in de missie-config — een fix in de config lost ze niet op. Ze worden hieronder als escalations gemeld, niet als autoFixable.

## Voorstellen

Geen mechanische fixes binnen de mission-config-whitelist voor deze missie. De enige concrete verbeterpunten (drempel-onder-40%-vastloop, save-vóór-complete, aria-live) zitten in `DataViewer.tsx` (gedeelde engine) en vallen buiten de scope van deze missie-specifieke autofix.

Eén niet-blocking suggestie binnen de config zelf:

**Voor** (`data-journalist.ts`, q3/q6):
```ts
keywords: ['moe', 'blij', 'ontspannen', 'uren', 'patroon'],
```
**Na** (bredere synoniemen, vermindert kans op onterecht lage score):
```ts
keywords: ['moe', 'vermoeid', 'blij', 'ontspannen', 'uren', 'patroon', 'verband'],
```

## Samenvatting & verdict

De missie zelf is didactisch sterk: goede SLO-fit, realistische datasets en een slim opgebouwde bronbetrouwbaarheids-oefening. De technische risico's zitten niet in de missie-config maar in de gedeelde `data-viewer`-engine — met name de vastloop-op-resultatenscherm-bij-falen en het wissen van opslag vóór bevestigde voltooiing zijn blocking en raken deze missie direct (een leerling die onder 40% scoort is hier een realistisch scenario). Design is degelijk maar mist dynamisch visueel bewijs voor deze pass.

**Verdict: fix-eerst** — niet vanwege de missie-config, maar vanwege de blocking engine-bugs die deze missie (en alle andere data-viewer-missies) onbruikbaar maken voor leerlingen die de drempel niet halen.
