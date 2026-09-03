# Leerlingwerk bewaren — bevindingen en routes

Aanleiding: de opdrachtstandaard eist bij Veto 1 dat er aan het eind iets bestaat
dat de leerling zelf gemaakt heeft, dat bewaard blijft, en dat een ander kan
bekijken. Vandaag is geen van die drie waar voor bijna elke opdracht. Dit stuk
legt vast wat er werkelijk staat en welke routes er zijn. Het is geen besluit.

## Wat er nu gebeurt

Bij afronden gaat er één ja/nee naar de server. `onComplete(success, scorePercent)`
loopt via [`handleMissionComplete`](../../src/app/AuthenticatedApp.tsx) naar
[`markMissionCompleted`](../../src/services/missionCompletionService.ts) en de RPC
`mark_mission_completed`. Die schrijft een voltooiingsmarkering, een score en XP.

Het werk zelf staat in [`useMissionAutoSave`](../../src/hooks/useMissionAutoSave.ts),
uitsluitend in `localStorage`. Elke motor roept bij afronden `clearSave()` aan:
`BuilderCanvas.tsx:240`, `DataViewer.tsx:942`, `ToolGuide.tsx:570`, plus
scenario-engine, ethics-council, password-fortress en twaalf maatwerkmissies.
Het werk wordt dus gewist op het moment dat de leerling klaar is.

## Wat er al wél staat

Dit is de kern: het opslagpad bestaat en werkt, het wordt alleen bijna nergens
gebruikt.

| Bouwsteen | Waar | Stand |
|---|---|---|
| Kolom voor inhoud | `mission_progress.progress_data` (jsonb) | Bestaat |
| Schrijfpad | RPC `save_mission_progress` (`20260808190000`), max 1 MB, weigert bij verwerkingsbeperking (AVG Art. 18) | Bestaat |
| Clientaanroep | [`missionService.saveMissionProgress`](../../src/services/missionService.ts) | Bestaat |
| Leesrecht docent | `mission_progress_owner_select`: `auth.uid() = user_id OR is_teacher_in_school(school_id)` (`20260504170000`) | Bestaat |
| Gebruikers | `useAgentLogic.ts:534-562` — precies vier missies: game-programmeur, verhalen-ontwerper, ai-trainer, logica-legende | Vier van de honderd |

De docent kan `progress_data` dus lezen, maar de UI vraagt het niet op:
[`getStudentMissionScores`](../../src/services/teacherService.ts) selecteert
`mission_id, status, score, updated_at` en laat `progress_data` staan. Dat is een
schermkeuze, geen technische grens.

Voor gepubliceerd werk bestaat bovendien al een volledige keten: `shared_games`
met galerij, likes en klasgenoot-zichtbaarheid
([`gameGalleryService`](../../src/services/gameGalleryService.ts),
[`GameGallery`](../../src/features/games/GameGallery.tsx)).

## Wat de privacyregels toestaan en verbieden

De DPIA hangt een restrisico-oordeel op aan "geen persistente opslag" — maar
uitsluitend voor **chatverkeer**, niet voor opdrachtwerk:

- `dpia-dgskills-compleet.md:406` — R05 "Gevoelige info in chat" blijft op Midden,
  motivering onder meer "chatdata is sessiegebaseerd".
- `dpia-dgskills-compleet.md:420` — het restrisico is aanvaardbaar mede door
  "sessiegebaseerde opslag (geen persistente chatdatabase)".
- `dpia-dgskills-compleet.md:226` — dataminimalisatie: "Chatgeschiedenis is
  sessiegebaseerd en wordt niet persistent opgeslagen in de database."

Voor bewust ingeleverd werk bestaat juist wél een grondslag: verwerking **V-05
"Gedeelde projecten en games (portfolio)"** in `verwerkingsregister.md:125`, met
Art. 6(1)(e) publieke taak plus toestemming bij publicatie naar klasgenoten, en
een vastgelegde bewaartermijn.

De scheidslijn is dus: *chatverkeer* blijft vluchtig, *opdrachtwerk* mag bewaard —
mits het onder een geregistreerde verwerking valt.

Bestaand precedent voor de strenge kant: `20260509165657_wellbeing_alerts.sql:2`
— "Privacy-by-design: we slaan NOOIT de originele tekst op, alleen de categorie en
timestamp". Dat geldt voor welzijnssignalen, niet voor schoolwerk, maar het laat
zien dat afwijken van "niets bewaren" expliciet verantwoord hoort te worden.

## Drie routes

### Route 1 — Bestaand pad aanzetten (kleinste)
`useMissionAutoSave` schrijft bij afronden de eindstaat naar
`save_mission_progress` vóór `clearSave()`, en het docentscherm gaat
`progress_data` ook echt tonen.

- Raakt: één hook, één docentquery, één docentcomponent. Geen nieuwe tabel,
  geen nieuwe migratie, geen nieuwe RLS.
- Veto 1 wordt haalbaar: het werk bestaat, blijft bewaard, en de docent kan het
  bekijken.
- Register: uitbreiding van een bestaande verwerking, geen nieuwe.
- Verwijderen en inzage zijn al geregeld: `mission_progress.user_id` heeft
  `ON DELETE CASCADE` naar `public.users(id)` (`20260222010000`), en de tabel
  staat al in `exportMyData/index.ts:66` voor AVG Art. 15/20.

### Route 2 — Route 1 plus een klassengalerij
Route 1, en daarnaast een expliciete "deel met de klas"-knop die het artefact naar
het bestaande `shared_*`-patroon publiceert, zodat ook klasgenoten het zien.

- Sluit aan op V-05 zoals die er nu al staat (toestemming bij publicatie).
- Repareert meteen het gat in peer feedback: de beoordelaar krijgt vandaag alleen
  de tekst "Klasgenoot" te zien en geen werk
  ([`peerFeedbackService.ts`](../../src/services/peerFeedbackService.ts), RPC
  `get_random_peer_for_review` geeft alleen `student_id` + `'Klasgenoot'` terug),
  terwijl het formulier wél vraagt of "het werk" helder is.
- Meer werk, en een echte publicatiestap met toestemming.

### Route 3 — Nieuwe tabel voor leerlingwerk
Een aparte `mission_artifacts`-tabel met eigen RLS, eigen bewaartermijn en eigen
registerverwerking.

- Alleen zinvol als `progress_data` inhoudelijk niet volstaat.
- Kost het volledige compliance-traject: nieuwe V-verwerking, DPIA-herbeoordeling,
  FK met `ON DELETE CASCADE`, `cron.schedule` voor de bewaartermijn, opname in
  `exportMyData`, Art. 18-guard in de policies, en het getal "28 tabellen"
  bijwerken in `deleteMyAccount/index.ts`, register en DPIA. Route 1 erft die
  voorzieningen; route 3 moet ze allemaal opnieuw regelen.

## Wat sowieso moet, welke route ook wint

1. Een bewaartermijn vastleggen. `20260221_add_data_retention_policies.sql`
   heeft cronjobs voor `student_activities`, `feedback`, duels en presence, maar
   **geen** voor `mission_progress`. Zonder termijn blijft leerlingwerk staan
   zolang het account bestaat; dat moet een bewuste keuze zijn, geen restant.
2. Beslissen of moderatie en PII-redactie ook bij *opslag* draaien. Nu draaien
   `moderationClient`, `outputFilter` en `piiRedactor` uitsluitend op het AI-pad.
3. Vastleggen wie mag kijken. Vandaag is de grens `school_id`, niet "de docent van
   deze klas": er bestaat geen docent-klas-koppeling, `is_teacher_in_school()`
   laat elke docent van de school elke leerling zien. Klasfiltering is nu alleen
   scherm, geen regel. (PR #343 werkt aan een klasgebonden docenttoegang.)

## Openstaand

Route 1, 2 of 3 is een keuze van de eigenaar. Punt 3 hierboven raakt aan lopend
werk in PR #343 en moet daarmee afgestemd worden voordat leerlingwerk breder
zichtbaar wordt.
