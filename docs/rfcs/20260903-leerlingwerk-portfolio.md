# RFC: Bewaard leerlingwerk — portfolio met versies, inleverstatus en bestanden

**Status:** Draft.
**Voor:** een verse bouwsessie; Rood werk (Supabase, RLS, leerlinggegevens,
bestandsopslag door minderjarigen).
**Aanleiding:** `docs/architecture/leerlingwerk-bewaren.md` — Veto 1 van de
opdrachtstandaard is vandaag structureel onhaalbaar omdat leerlingwerk bij
afronden gewist wordt.
**Gekozen route:** route 3 (eigen tabellen), door de eigenaar bepaald op
2026-09-03, met scope a + b + c + d.
**Volgende stap na Final:** `design-and-refactor` (gates 1-7).

---

## De standaard (wanneer is dit af)

Een leerling maakt iets in een opdracht, levert het in, en kan het een jaar
later terugvinden. Zijn docent kan het bekijken. Het werk overleeft afronden,
uitloggen en een nieuw schooljaar. Verwijdert de leerling zijn account, dan
verdwijnt alles — inclusief bestanden. Register, DPIA en privacybijsluiter
kloppen weer met de werkelijkheid.

Tests en documentatie horen bij "af". Aangrenzende gaten die tijdens het bouwen
opduiken worden losse taken, niet stilzwijgend meegenomen.

---

## 0. Samenvatting

- Het gaat niet om opslag maar om **eigenaarschap van werk**: het werk is nu een
  bijproduct van een opdracht en verdwijnt met die opdracht mee. Het moet een
  ding op zichzelf worden, met de opdracht als herkomst in plaats van als houder.
- Drie tabellen: het **werkstuk** (blijft), zijn **versies** (groeien), en zijn
  **bestanden** (staan in een aparte kluis). Status hangt aan de versie, niet aan
  het werkstuk — "ingeleverd" is iets wat een versie overkomt.
- Er bestaat al een tabel die hier dichtbij komt: `library_items` heeft
  `mission_id`, `type`, `data jsonb` en `thumbnail`, met eigenaar-only toegang
  (`20260504170000_game_project_persistence.sql:100`). Die vorm is het
  vertrekpunt; wat ontbreekt is versies, inleverstatus, docentinzage en
  bestanden.
- **Buiten scope:** het aanpassen van de honderd opdrachten zelf. Deze RFC levert
  de bewaarlaag plus één werkende opdracht als bewijs. Welke opdrachten daarna
  volgen, bepaalt de reviewronde.
- **Buiten scope:** het chatverkeer. Dat blijft vluchtig — daar hangt een
  DPIA-oordeel aan (`dpia-dgskills-compleet.md:420`).

---

## 1. Context

Vandaag schrijft `useMissionAutoSave` alleen naar `localStorage` en roept elke
motor bij afronden `clearSave()` aan (`BuilderCanvas.tsx:240`,
`DataViewer.tsx:942`, `ToolGuide.tsx:570`, plus scenario-engine, ethics-council,
password-fortress en twaalf maatwerkmissies). Naar de server gaat
`onComplete(success, scorePercent)` — één ja/nee plus een score.

Wat al bestaat en hergebruikt wordt:

| Bouwsteen | Waar |
|---|---|
| Docent-leesrecht binnen school | `public.is_teacher_in_school(school_id)` |
| Art. 18-guard (verwerkingsbeperking) | `public.current_user_processing_restricted()`, `20260805104252` |
| Privéopslag met eigen toegangsregels | bucket `receipts`, `20260223000000_accountant_module.sql:15-50` |
| Klasgenoot-zichtbaarheid met toestemming | `shared_games_classmates_select`, `20260504170000:210` |
| Inzagerecht AVG Art. 15/20 | `supabase/functions/exportMyData/index.ts` |
| Verwijderen bij accountverwijdering | `ON DELETE CASCADE` naar `public.users(id)`, `20260222010000` |

Grondslag: verwerking **V-05 "Gedeelde projecten en games (portfolio)"**
(`verwerkingsregister.md:125`) dekt bewust ingeleverd werk al, met Art. 6(1)(e)
publieke taak plus toestemming bij publicatie naar klasgenoten. Deze RFC breidt
V-05 uit; hij opent geen nieuw doel.

---

## 2. Datamodel

Drie tabellen. Namen als voorstel, niet als besluit.

### 2.1 `portfolio_items` — het werkstuk

Blijft bestaan zolang het account bestaat, ook als de opdracht verdwijnt of
hernoemd wordt.

```
id              uuid pk
user_id         uuid not null references public.users(id) on delete cascade
school_id       text
title           text not null
description     text
kind            text not null      -- 'tekst' | 'ontwerp' | 'game' | 'boek' | 'bestandenset'
mission_id      text               -- NULLABLE: herkomst, geen houder
mission_name    text               -- vastgelegde naam; overleeft hernoemen
visibility      text not null default 'prive'   -- 'prive' | 'docent' | 'klas'
created_at      timestamptz not null default now()
updated_at      timestamptz not null default now()
```

`mission_id` is bewust nullable en bewust géén foreign key: het werkstuk moet een
opdracht kunnen overleven die uit het curriculum verdwijnt.

### 2.2 `portfolio_versions` — de versies en het inleveren

```
id              uuid pk
item_id         uuid not null references public.portfolio_items(id) on delete cascade
version_no      int not null                     -- 1, 2, 3, … per item
content         jsonb not null default '{}'
status          text not null default 'concept'  -- 'concept' | 'ingeleverd' | 'beoordeeld'
submitted_at    timestamptz
reviewed_by     uuid references public.users(id) on delete set null
reviewed_at     timestamptz
teacher_note    text
created_at      timestamptz not null default now()
unique (item_id, version_no)
```

Status hoort hier omdat inleveren een gebeurtenis op één versie is. Een leerling
kan na "beoordeeld" een nieuwe versie beginnen zonder de beoordeelde versie te
overschrijven — precies wat een portfolio moet kunnen.

Regel: een versie met status `ingeleverd` of `beoordeeld` is onveranderlijk.
Verder werken maakt een nieuwe versie aan. Dat wordt in de RPC afgedwongen, niet
in de client.

### 2.3 `portfolio_files` — de bestanden

Bestanden zelf staan in een private bucket `portfolio`; deze tabel is de
administratie ernaast.

```
id                uuid pk
version_id        uuid not null references public.portfolio_versions(id) on delete cascade
storage_path      text not null unique     -- '<uid>/<item_id>/<version_id>/<naam>'
original_name     text not null
mime_type         text not null
size_bytes        bigint not null
moderation_status text not null default 'wacht'  -- 'wacht' | 'goedgekeurd' | 'geweigerd'
created_at        timestamptz not null default now()
```

Bucket: `public = false`, formaatlimiet en `allowed_mime_types` naar het model van
`receipts`. Padopbouw begint met de uid zodat de bestaande
`storage.foldername(name)[1] = auth.uid()`-truc werkt.

**Let op — dit is geen detail:** `ON DELETE CASCADE` ruimt databaserijen op, maar
**geen bestanden in Storage**. `deleteMyAccount` moet expliciet de map van de
gebruiker in de bucket leegmaken, anders blijft er na accountverwijdering
leerlingmateriaal achter. Dit is de belangrijkste nieuwe faalmodus van route 3.

---

## 3. Toegangsregels (RLS)

Per tabel, in de stijl van de bestaande policies.

| Wie | Mag |
|---|---|
| Eigenaar | alles op eigen rijen; INSERT/UPDATE met `AND NOT current_user_processing_restricted()` |
| Docent in dezelfde school | SELECT wanneer `visibility IN ('docent','klas')`, plus UPDATE van `status`/`teacher_note`/`reviewed_*` via een RPC |
| Klasgenoot | SELECT alleen bij `visibility = 'klas'` én zelfde `school_id` + `student_class` |
| Anders | niets |

Twee dingen expliciet:

1. **`visibility` staat standaard op `prive`.** Werk wordt pas zichtbaar door een
   handeling van de leerling. Dat is wat V-05 als toestemming beschrijft.
2. **De docentgrens is vandaag de school, niet de klas.** Er bestaat geen
   docent-klas-koppeling; `is_teacher_in_school()` laat elke docent van de school
   elke leerling zien, en klasfiltering is nu alleen scherm. PR #343 werkt aan
   die koppeling. Deze RFC moet daarop aansluiten en niet zijn eigen variant
   verzinnen.

Schrijfpaden lopen via `SECURITY DEFINER`-RPC's, zoals `save_mission_progress`
dat al doet: `save_portfolio_draft`, `submit_portfolio_version`,
`review_portfolio_version`. Directe INSERT/UPDATE op status door de client wordt
ingetrokken — hetzelfde patroon als `20260808120000_server_recorded_mission_scores.sql`.

---

## 4. Beeldmoderatie — het echte nieuwe risico

De bestaande filters (`moderationClient.ts`, `outputFilter.ts`, `piiRedactor.ts`)
kijken **uitsluitend naar tekst**, en alleen op het AI-pad. Er is geen
beeldmoderatie. Zodra een leerling een foto kan uploaden, ontstaat een risico dat
nergens in de DPIA is afgewogen: een foto van zichzelf, van een klasgenoot, of
erger.

Drie mogelijkheden, aflopend in risico:

- **A. Alleen wat de app zelf maakt.** Geen camera, geen bestandkiezer voor
  foto's; wel exports die de opdracht genereert (een tekening uit de tekenmissie,
  een geëxporteerd ontwerp). Risico blijft laag, functionaliteit beperkt.
- **B. Uploaden mag, publiceren niet zonder docent.** Bestand komt binnen op
  `moderation_status = 'wacht'` en is alleen zichtbaar voor de leerling zelf tot
  een docent het vrijgeeft. Menselijke controle in plaats van machinecontrole —
  sluit aan op de Art. 14-lijn die dit project al volgt.
- **C. Automatische beeldmoderatie.** Nieuwe provider, nieuwe subverwerker, DPA,
  registerregel. Zwaarste route.

Dit is een beslissing voor de eigenaar, geen technische keuze.

---

## 5. Wat er in de app verandert

- `useMissionAutoSave` krijgt er een tweede bestemming bij: bij een expliciete
  bewaar- of inleverhandeling schrijft hij naar de RPC. `localStorage` blijft de
  snelle laag tijdens het werken.
- De `clearSave()`-aanroepen in de motoren blijven staan, maar pas **nadat** de
  server bevestigd heeft — het patroon dat `BuilderCanvas.tsx:236-240` en
  `DataViewer.tsx:938-942` al toepassen.
- Eén nieuw leerlingscherm: "Mijn werk", met werkstukken, versies en status.
- Het docentdashboard krijgt de inhoud erbij: `getStudentMissionScores`
  (`teacherService.ts:811`) haalt nu alleen `mission_id, status, score,
  updated_at` op.
- **Eén opdracht wordt omgebouwd als bewijs.** Voorstel: `game-director` — die
  levert al een echt product op en staat in leerjaar 1 periode 2, de sterkste
  periode volgens de snoeilijst.

---

## 6. Compliance-werk dat hierbij hoort

1. **Register:** V-05 uitbreiden met de drie tabellen en de bucket, of een eigen
   V-nummer als het doel wezenlijk breder is.
2. **DPIA:** R05 en R09 herbeoordelen. Beide leunen nu op "sessiegebaseerde
   opslag" (`dpia-dgskills-compleet.md:406, 420`). Dat argument gaat over chat en
   blijft staan, maar dat moet expliciet worden opgeschreven in plaats van
   verondersteld. Bij optie 4B of 4C komt er een risicoregel voor beeld bij.
3. **Privacybijsluiter:** `E-privacybijsluiter-dgskills.md` beschrijft wat er
   bewaard wordt; die claim wordt onjuist zodra dit live gaat.
4. **Bewaartermijn:** `20260221_add_data_retention_policies.sql` heeft cronjobs
   voor `student_activities`, `feedback` en duels, maar niets voor bewaard werk.
   Een portfolio dat "over meerdere jaren" moet werken vraagt een bewuste termijn
   — bijvoorbeeld tot uitschrijving, zoals `assessment_results` (V-16).
5. **`exportMyData`:** de drie tabellen toevoegen, plus een lijst van bestanden.
6. **`deleteMyAccount`:** de bucketmap leegmaken (zie 2.3) en de hardgecodeerde
   claim "28 tabellen" bijwerken — die staat ook in het register en de DPIA.
7. **Jurist-check** vóór livegang: dit raakt vrije tekst en mogelijk beeld van
   minderjarigen.

---

## 7. Volgorde

1. Beslissingen hieronder laten vallen.
2. Tabellen + RLS + RPC's, met tests op de toegangsregels.
3. `exportMyData` en `deleteMyAccount` uitbreiden — samen met de tabellen, niet
   erna. Anders bestaat er even leerlingwerk dat niet te verwijderen is.
4. Leerlingscherm "Mijn werk".
5. Eén opdracht ombouwen als bewijs.
6. Docentdashboard toont inhoud.
7. Bestanden: bucket, `portfolio_files`, uploadpad — pas nadat 2 t/m 6 staan.
8. Register, DPIA en bijsluiter bijwerken; jurist-check; dan pas live.

Stap 3 is wat het meest de-riskt: zonder verwijderpad is elk bewaard bestand een
probleem in plaats van een oplossing.

---

## Beslissingen die vóór de bouw nodig zijn

1. **Beeldmoderatie:** optie A, B of C uit hoofdstuk 4.
2. **Bewaartermijn:** tot uitschrijving, tot einde schooljaar, of een vast aantal
   jaren.
3. **Wie mag kijken:** wachten op de klasgebonden docenttoegang uit PR #343, of
   nu beginnen met de schoolgrens en later aanscherpen.
4. **`library_items`:** blijft naast de nieuwe tabellen bestaan, of gaat er op
   termijn in op? Er staat bestaand leerlingwerk in (games, boeken, tekeningen).
5. **Naamgeving:** `portfolio_*` of iets wat beter aansluit op hoe jij het tegen
   scholen noemt.

---

## Acceptatiecriteria

- Een leerling maakt werk, levert in, logt uit, komt terug: het werk staat er nog,
  met de juiste versie en status.
- Een tweede inlevering maakt versie 2; versie 1 blijft ongewijzigd leesbaar.
- Een docent van dezelfde school ziet ingeleverd werk; een docent van een andere
  school niet. Aangetoond met een test op de toegangsregels, niet met een
  screenshot.
- Een leerling met verwerkingsbeperking kan niets wegschrijven (Art. 18).
- Accountverwijdering laat geen rij én geen bestand achter. Aangetoond door na
  verwijdering de bucketmap op te vragen.
- `exportMyData` bevat het werk en de bestandslijst.
- `npm run typecheck` en de bestaande CI-gates groen.

---

## Risico's en open vragen

- **Grootste risico:** bestanden die na accountverwijdering achterblijven. Storage
  cascadeert niet mee met de database.
- **Tweede risico:** beeld van minderjarigen zonder moderatie. Zie hoofdstuk 4.
- **Derde risico:** de docentgrens is nu de school. Bewaard werk breed zichtbaar
  maken vóór PR #343 landt, vergroot het aantal mensen dat leerlingwerk kan
  inzien.
- **Kosten:** opslag groeit met elk schooljaar. Nog niet geraamd.
- **Open:** of `progress_data` in `mission_progress` blijft bestaan naast dit
  model, of dat de vier missies die hem nu gebruiken meeverhuizen.

---

## Bijlage — wat is nagetrokken

Alles hieronder is in deze sessie zelf gelezen, niet uit een rapport overgenomen.

- `useMissionAutoSave.ts` schrijft uitsluitend naar `localStorage`.
- `clearSave()` wordt aangeroepen in builder-canvas, data-viewer, tool-guide,
  scenario-engine, ethics-council, password-fortress en twaalf maatwerkmissies.
- `BuilderCanvas.tsx:238` geeft `onComplete` een boolean; er gaat geen inhoud mee.
- `mission_progress_owner_select` = `auth.uid() = user_id OR
  is_teacher_in_school(school_id)` (`20260504170000:58-65`).
- `getStudentMissionScores` (`teacherService.ts:811-817`) selecteert
  `progress_data` niet.
- `mission_progress.user_id` heeft `ON DELETE CASCADE` naar `public.users(id)`
  (`20260222010000:157-161`); de tabel staat in `exportMyData/index.ts:66`; hij
  staat **niet** in `cleanup_user_data()` (`20260806115613`) en heeft **geen**
  retentie-cron (`20260221_add_data_retention_policies.sql`).
- `library_items` (`20260504170000:100-114`) heeft al `mission_id`, `type`,
  `data jsonb`, `thumbnail`, CASCADE en eigenaar-only toegang.
- Bucket `receipts` (`20260223000000:15-50`) is het bestaande model voor privé
  bestandsopslag met `storage.foldername(name)[1] = auth.uid()`.
- DPIA `:406` en `:420` koppelen het restrisico expliciet aan **chatdata**, niet
  aan opdrachtwerk. `verwerkingsregister.md:125` = V-05 portfolio.
