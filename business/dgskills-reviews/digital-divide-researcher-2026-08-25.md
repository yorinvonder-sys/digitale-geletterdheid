# Review: digital-divide-researcher

**Datum:** 2026-08-25
**TemplateType:** data-viewer

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7.5/10

- De drie datasets (tabel, staafgrafiek, document-cards) zijn visueel gevarieerd en elk voorzien van een `source`-blok met `methodNote` die synthetische data expliciet als zodanig labelt — goede transparantie op dataset-niveau.
- Kleurgebruik in de staafgrafiek (`chartData`) markeert de 65-74 en 75+ groepen met `#ff3c21` (waarschuwingskleur) zonder duidelijke semantische reden in de vraagstelling zelf; dit is een lichte, geen blokkerende, inconsistentie.
- Badges-drempels (0/40/65/85) zijn consistent opgebouwd en sluiten aan bij `maxScore: 100`.
- Bekende engine-bevindingen die dit template concreet raken (uit `engine-data-viewer.json`): het resultatenscherm kan een leerling onder 40% vastzetten (geen `onRetry`), en opslag wordt gewist vóór serverbevestiging. Dit is engine-gedrag, niet missie-config, maar treft elke leerling van deze missie bij een lage score.

## Didactiek — score 6/10

- **Bronclaim-mismatch (belangrijkste bevinding):** `missionGoals.ts` beschrijft de missie als "Je analyseert CBS-data naar leeftijdsgroep, Europese breedbandcijfers en internationale connectiviteitsrapporten" — terwijl alle drie datasets in de config expliciet `source.kind: 'synthetic'` zijn met methodNotes die zeggen "controleer actuele cijfers in de originele publicatie" / "niet te lezen als actuele CBS-statistiek". De missie-config is hier eerlijker dan de doelbeschrijving die leerlingen (indirect, via voortgangsrapportage) te zien krijgen. Dit is inhoudelijk misleidend over databron en moet in `missionGoals.ts` worden rechtgetrokken.
- **Drempel-inconsistentie:** `missionGoals.ts` hanteert `threshold: 65` als score-drempel voor het primaire doel, terwijl de missie zelf (badges + engine-gedrag) al bij 40% als "geslaagd" geldt (badge "Data Analist" vanaf 40, en CompletionScreen toont "Gehaald" vanaf 40%). Een leerling die de missie voltooit met bijvoorbeeld 50% ziet zich zelf als geslaagd, terwijl de missionGoals-drempel dat niet als doel-behaald telt.
- De open vragen (q3, q6, q8) gebruiken `minKeywords: 1` op een lijst van 4-5 trefwoorden — dat is zeer soepel (bijna elk zinnetje met één passend woord telt goed), wat het onderscheidend vermogen van deze vragen beperkt. Geen blocker, wel een kwaliteitsbeperking.
- Content zelf is inhoudelijk sterk: begrippen (bandbreedte/latency, mobiel/vast, penetratie/snelheid, adoptiecurve) zijn correct en didactisch goed opgebouwd, met heldere doorverwijzing tussen tabel → grafiek → begrippenkaarten.

## Tech — score 8/10

- Config is syntactisch en structureel in orde: consistente `id`'s, `points` tellen op tot `maxScore: 100` (15+15+10 + 15+10+10 + 15+10 = 100).
- Geen missie-specifieke technische afwijkingen gevonden buiten wat al in de gedeelde engine is vastgesteld (zie `engine-data-viewer.json`): die bevindingen (blocking: geen `onRetry`/vastlopend resultatenscherm; blocking: `clearSave()` vóór bevestigde `onComplete`) zijn generiek engine-gedrag en gelden voor alle data-viewer-missies, niet specifiek verergerd door deze config.
- `slo-kerndoelen-mapping.ts`, `templateRegistry.ts` en `curriculum.ts` entries zijn intern consistent (missionId, week 3, yearGroup 3, juiste templateType).

## Voorstellen

### 1. Bronclaim in missionGoals.ts corrigeren naar de werkelijke (synthetische) aard van de data

```ts
// VOOR (src/config/missionGoals.ts)
'digital-divide-researcher': {
    primaryGoal: 'Ik onderzoek internetsnelheden en apparaatgebruik per land en leeftijdsgroep en beoordeel de betrouwbaarheid van databronnen.',
    criteria: {
        type: 'score-threshold',
        threshold: 65,
        description: 'Je analyseert CBS-data naar leeftijdsgroep, Europese breedbandcijfers en internationale connectiviteitsrapporten.',
    },
    evidence: 'Je kunt het procentuele verschil in internetsnelheid of apparaatbeschikbaarheid tussen leeftijdsgroepen of landen noemen en een databron beoordelen.',
},
```

```ts
// NA
'digital-divide-researcher': {
    primaryGoal: 'Ik onderzoek internetsnelheden en apparaatgebruik per land en leeftijdsgroep en beoordeel de betrouwbaarheid van databronnen.',
    criteria: {
        type: 'score-threshold',
        threshold: 40,
        description: 'Je analyseert didactische oefendata over internetsnelheid per land, smartphonegebruik per leeftijdsgroep en connectivity-begrippen.',
    },
    evidence: 'Je kunt het procentuele verschil in internetsnelheid of apparaatbeschikbaarheid tussen leeftijdsgroepen of landen noemen en een databron beoordelen.',
},
```

Dit lost tegelijk de drempel-inconsistentie op (40 sluit aan bij de badge-drempel en het "Gehaald"-gedrag van de missie) en verwijdert de onterechte CBS/Europese-breedbandcijfers-claim.

## Samenvatting en verdict

De missie-content zelf (tabel, grafiek, begrippenkaarten, vragen) is inhoudelijk sterk en didactisch goed opgebouwd, met eerlijke source-labeling op dataset-niveau. Het belangrijkste probleem zit niet in de config van de missie zelf maar in `missionGoals.ts`, die een bronclaim maakt (CBS/Europese breedbandcijfers) die niet overeenkomt met de expliciet gesynthetiseerde data, plus een score-drempel (65) die niet aansluit bij het 40%-slaagpunt van de missie zelf. Beide zijn mechanisch fixbaar binnen de whitelist. De blocking engine-bevindingen (vastlopend resultatenscherm, opslag vóór bevestiging) zijn gedeeld engine-gedrag en worden niet los per missie opgelost.

**Verdict: fix-eerst** — de bronclaim-mismatch in `missionGoals.ts` moet vóór livegang worden gecorrigeerd; de rest van de missie-config is in orde.
