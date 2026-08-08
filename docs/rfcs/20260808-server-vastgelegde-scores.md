# RFC: Server-vastgelegde scores — kan een cijfer op deze data steunen?

**Status:** Draft — geschreven na verificatie in de codebase, wacht op besluiten van Yorin.
**Voor:** een bouwsessie nadat de besluiten in §3 zijn genomen.
**Aanleiding:** bij de reviewronde van 2026-08-08 bleek dat een leerling zijn eigen score kan bepalen. De scoringslekken zelf zijn gedicht; dit gaat over de laag eronder.

---

## 0. De herformulering

Ik heb dit eerder aan je gemeld als *"scores staan in de browser van de leerling"*. Dat was te smal. Wat ik bij het uitzoeken vond:

- **De score bereikt de server helemaal niet.** `mark_mission_completed` neemt alleen een opdracht-id. Er gaat nooit een cijfer mee.
- **Er ís een `score`-kolom** in `mission_progress`, en het docentscherm haalt hem op — maar niets vult hem voor deze opdrachten.
- **Een leerling mag zelf in die tabel schrijven.** De beveiligingsregel staat toe dat hij zijn eigen rij aanmaakt en bijwerkt. Er is geen controle op wát hij erin zet.
- **Voltooiing is een bewering, geen bewijs.** Een leerling kan de voltooiing-aanroep doen voor elke opdracht, zonder hem gespeeld te hebben.

Het is dus niet "de score staat op de verkeerde plek". Het is: **de app registreert wat de leerling zegt, niet wat hij deed.**

Dat is voor huiswerk werkbaar. Voor een cijfer niet.

**Wat dit voorstel niet behandelt:** de didactische vraag of deze opdrachten überhaupt geschikt zijn om op te beoordelen, en het openstaande punt dat kerndoel 22A in leerjaar 2 periode 1 door geen enkele opdracht gedekt wordt.

---

## 1. Wat ik heb geverifieerd

| Bevinding | Waar |
|---|---|
| Voltooiing loopt via een server-functie met de rechten van de server | `supabase/migrations/20260607095122_complete_mission_rpc.sql` |
| Die functie neemt alleen `p_mission_id` — geen score, geen bewijs | zelfde bestand |
| `mission_progress` heeft een `score`-kolom | `20260220000000_schema_baseline.sql:214` |
| Een leerling mag zijn eigen rij invoegen en bijwerken | `mission_progress_insert_own`, `mission_progress_update_own` |
| Het docentscherm haalt `status` en `score` op | `teacherService.ts:815`, gebruikt in `StudentModal.tsx:88` |
| Niets in de app schrijft ooit een score naar die kolom | geen enkele treffer op een schrijfactie |

**Wat al goed zit**, en waar dit voorstel vanaf blijft: de welzijnsmeldingen worden server-side vastgelegd zonder de tekst van de leerling, en de voltooiing-functie draait met serverrechten in plaats van dat de client de tabel rechtstreeks aanraakt.

---

## 2. Wat een leerling nu feitelijk kan

Niet theoretisch — dit volgt rechtstreeks uit de regels hierboven:

1. **Een opdracht als voltooid melden zonder hem te doen.** Eén aanroep vanuit de browserconsole.
2. **Zichzelf een score geven.** Direct in de tabel schrijven; de beveiligingsregel staat het toe en er is geen bovengrens per opdracht.
3. **De opgeslagen voortgang bewerken** om een ronde opnieuw te spelen. Dit is de laag die we vandaag hebben gedicht met bovengrenzen en vergrendeling — maar dat zijn controles in de browser, en die overtuigen alleen wie niet zoekt.

De eerste twee zijn wezenlijk: die raken wat de docent ziet.

---

## 3. De besluiten die jij moet nemen

Dit is de kern. Zonder deze antwoorden bouw ik de verkeerde kant op.

### Besluit 1 — Waar is de score voor?

| Optie | Wat het betekent |
|---|---|
| **A. Signaal voor de docent** | De score helpt zien wie vastloopt. Niemand rekent er een cijfer mee. Een leerling die sjoemelt benadeelt vooral zichzelf. |
| **B. Onderdeel van beoordeling** | De score telt mee voor een cijfer of een rapportregel. Dan moet hij betrouwbaar zijn en moet je kunnen aantonen waar hij vandaan komt. |

**Dit besluit bepaalt de omvang van al het andere.** Bij A volstaat het dichten van de grofste gaten. Bij B is er werk aan de winkel.

### Besluit 2 — Mag een herkansing meetellen?

Nu wordt de opslag gewist na afronding, dus een leerling kan een opdracht onbeperkt opnieuw doen — met alle antwoorden bekend.

Keuzes: telt de **eerste** poging, de **hoogste**, of de **laatste**? En ziet de docent dat er meerdere pogingen waren?

Mijn voorkeur: de eerste poging vastleggen én het aantal pogingen tonen. Dan blijft oefenen mogelijk zonder dat het beeld vervaagt.

### Besluit 3 — Hoeveel bewijs is genoeg?

Een score serverkant vastleggen kan op drie niveaus:

| Niveau | Hoe | Wat het tegenhoudt |
|---|---|---|
| **Licht** | De server accepteert een score, maar begrenst hem op het maximum van die opdracht en staat maar één registratie toe | Knullig geknoei en corrupte data |
| **Midden** | De server ontvangt de antwoorden en rekent de score zélf uit | Alles behalve het simuleren van echte antwoorden |
| **Zwaar** | De server bewaart per ronde wat er gebeurde, met tijdstempels | Ook geautomatiseerd meespelen |

**Mijn advies: midden.** Licht is schijnzekerheid — het houdt niemand tegen die het écht probeert. Zwaar levert een berg gegevens over kinderen op die je onder de privacywetgeving moet kunnen verantwoorden, en dat weegt niet op tegen de winst.

Bij midden verandert er voor de leerling niets zichtbaars: hij speelt, de app stuurt zijn antwoorden, de server bepaalt de score.

### Besluit 4 — Wat gebeurt er met wat er nu staat?

Er staan al voltooiingen in de database, zonder score en zonder bewijs. Blijven die staan zoals ze zijn, of markeer je ze als "van vóór de meting"? Als een docent straks scores ziet bij nieuwe opdrachten en niets bij oude, moet dat verschil uitlegbaar zijn.

---

## 4. Het plan, als je voor "signaal" kiest (besluit 1A)

Klein en snel. Alleen de grofste gaten:

1. De schrijfrechten op `mission_progress` intrekken voor leerlingen; alleen de serverfunctie schrijft nog.
2. `mark_mission_completed` een score laten meenemen, begrensd op het maximum van die opdracht.
3. Het aantal pogingen registreren.

Raakt: één migratie, de servicelaag, en de plek waar een opdracht afrondt. Geen zichtbare verandering voor leerlingen.

---

## 5. Het plan, als je voor "beoordeling" kiest (besluit 1B)

Groter, en het raakt de motoren die we vandaag hebben gerepareerd.

**Eenheid 1 — de server rekent.** De scorefuncties verhuizen naar een gedeelde plek die zowel de app als de server kan gebruiken, zodat er één rekenwijze is. De opdracht stuurt de antwoorden; de server bepaalt de score. Dit is het meeste werk en raakt `FeedbackBanner`, `RapidFire`, `DataViewer` en `ReviewArena`.

**Eenheid 2 — schrijfrechten dicht.** Zoals in §4, maar nu sluitend: de leerling schrijft nergens meer zelf.

**Eenheid 3 — pogingen en zichtbaarheid.** Vastleggen welke poging telt, en het docentscherm dat laten tonen.

**Eenheid 4 — verantwoording.** Wat je vastlegt over een leerling moet in de compliance-documentatie kloppen. Bewaar je antwoorden, dan hoort dat in het register en moet je een bewaartermijn kiezen.

Volgorde: eenheid 2 eerst — dat is klein en dicht meteen het grofste gat. Daarna 1 en 3, en 4 loopt mee.

---

## 6. Wat dit gaat kosten aan gedoe

- **De motoren zijn net gerepareerd en drie keer tegengelezen.** De scoring nu verplaatsen betekent dat werk opnieuw verifiëren. Dat is te doen, maar het is niet gratis — reken op dezelfde zorgvuldigheid als vandaag.
- **Er lopen parallelle reviewrondes** in dit project. Een refactor van de scoring raakt precies de bestanden waar anderen in werken.
- **De opdrachten worden nu al gebruikt.** Elke verandering aan wat "gehaald" betekent, verandert wat een docent morgen ziet vergeleken met gisteren.

---

## 7. Mijn advies in één alinea

Kies **1A + het plan uit §4**, tenzij je binnen afzienbare tijd echt cijfers op deze opdrachten wilt baseren. Het dicht in een paar uur de twee gaten die er nu toe doen — zelf een score schrijven en zelf een voltooiing melden — zonder de motoren aan te raken die net drie tegenleesrondes hebben doorstaan. Wil je later naar beoordeling, dan is §5 een logische vervolgstap en gooit stap 1 niets weg.

Wat ik afraad: half beginnen aan §5. De server laten rekenen is alleen zinvol als het overal gebeurt; doe je het voor de helft van de opdrachten, dan weet niemand meer welke cijfers waarop steunen.
