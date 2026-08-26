# Ontwerp: docent-klas-koppeling en klasgebonden toegang

**Status:** ontwerp + fundament geleverd, policy-migratie nog niet uitgevoerd
**Datum:** 26 augustus 2026
**Raakt:** auth, RLS, leerlinggegevens — kritiek domein
**Migratie:** `supabase/migrations/20260826200000_teacher_class_scoping.sql`
**Contractcheck:** `npm run check:teacher-class-scoping`

---

## In het kort

Op dit moment ziet elke docent van een school de gegevens van élke leerling van
die school. Er stond nergens vastgelegd welke klassen een docent lesgeeft, dus
klasgebonden toegang was technisch niet mogelijk. Onze eigen documenten beloven
scholen wél dat docenten alleen hun eigen leerlingen zien.

Dit ontwerp voegt de ontbrekende schakel toe: een koppeling docent → klas, plus
een schakelaar per school. Scholen die vandaag draaien merken niets: de
schakelaar staat standaard op het huidige gedrag. Een school kan daarna in twee
stappen naar echte klasgebonden toegang, zonder dat er ooit een docent zonder
toegang komt te zitten.

Er is in deze levering **geen enkele bestaande toegangsregel gewijzigd**. Het
fundament ligt er en is getest; het omzetten van de regels is een aparte stap
die expliciete toestemming vraagt.

---

## 1. De bevinding

`public.is_teacher_in_school(target_school_id text)` toetst drie dingen: heb je
een docent-, beheerder- of ontwikkelaarsrol, ben je (als docent) door MFA heen,
en hoor je bij deze school. Zit dat goed, dan is de toegang schoolbreed.

Die functie zit onder **47 toegangsregels, verspreid over 28 tabellen**. Bij de
tabellen met leerlinggegevens — voortgang, activiteiten, notities, beoordelingen,
welzijnssignalen — betekent dat: elke docent, elke leerling.

`users.student_class` bestaat wel, met een index op `(school_id, student_class)`,
maar dat veld staat bij de *leerling*. Aan de docentkant stond niets.

Onze documenten beschrijven een andere werkelijkheid:

| Document | Belofte |
|:---|:---|
| Verwerkingsregister V-06 | "docenten zien alleen eigen leerlingen" |
| Beveiligingsbijlage B | "Docenten zien uitsluitend hun eigen klassen" |
| Privacybijsluiter E | "Voortgang en activiteit van leerlingen in eigen klassen" |
| DPIA, risico R08 | restrisico "Laag" op toegang buiten de eigen klas |
| Data-flow-overzicht | "geen toegang buiten toegewezen groepen" |

De beveiligingsbijlage en de privacybijsluiter gaan mee naar scholen. Het gat is
daarmee niet alleen technisch maar ook contractueel.

---

## 2. Datamodel

### `public.teacher_classes`

De ontbrekende koppeltabel.

| Kolom | Type | Toelichting |
|:---|:---|:---|
| `id` | uuid | primaire sleutel |
| `teacher_id` | uuid | → `auth.users(id)`, cascade bij verwijderen |
| `school_id` | text | zelfde tekstsleutel als overal in dit schema |
| `student_class` | text | sluit aan op `users.student_class` |
| `source` | text | `manual` of `roster_import` |
| `created_at` | timestamptz | |
| `created_by` | uuid | wie de koppeling legde — spoor voor de audit |

Uniek op `(teacher_id, school_id, student_class)`, plus een index op
`(school_id, student_class)` voor de omgekeerde vraag "wie geeft les aan 2B?".

**Toegangsregels.** Lezen mag als docent of beheerder van de school, inclusief
je eigen koppelingen — dit is personeelsinformatie, geen leerlinggegeven, en de
beheerder moet het overzicht kunnen beheren. Er is bewust géén losse
"je eigen rij"-tak: die zou een docent zónder MFA zijn eigen toewijzingen laten
lezen en zo om de AAL2-eis heen lopen.

Schrijven loopt via `public.is_class_scoping_admin()` — `admin` of `developer`
**met AAL2** — plus een schoolmatch. Dat is dezelfde vorm als de bestaande
`public.is_branding_admin()`. Een docent die zichzelf klassen kan toekennen maakt
de hele maatregel waardeloos; dat is expliciet getest, net als de beheerder
zonder MFA.

**Twee triggers bewaken de tabel:**

- een `BEFORE`-trigger weigert een koppeling naar een account dat geen docent- of
  beheerdersrol heeft of niet bij dezelfde school hoort, en stempelt `created_by`
  server-side uit `auth.uid()` — een `created_by` uit de client is een bewering,
  geen feit;
- een `AFTER`-trigger schrijft elke INSERT, UPDATE én DELETE naar
  `public.audit_logs`, in dezelfde vorm als het bestaande
  `school_branding`-auditspoor. Juist het *weghalen* van een toewijzing verruimt
  in de uitrolstand iemands toegang, dus dat mag geen spoorloze handeling zijn.
  Omdat het een databasetrigger is, wordt ook een mutatie buiten het
  beheerscherm om vastgelegd (directe API-call, service-rol, roosterimport).

### `public.school_access_settings`

Eén rij per school, met de schakelaar.

| Kolom | Type | Toelichting |
|:---|:---|:---|
| `school_id` | text | primaire sleutel |
| `teacher_scope` | text | `school` \| `class_soft` \| `class_strict` |
| `updated_at`, `updated_by` | | spoor van wie de stand omzette |

Geen rij = `school` = het gedrag van vandaag. Er is bewust **geen**
verwijderregel: een school gaat terug door de stand op `school` te zetten, niet
door de rij weg te gooien, zodat het spoor blijft bestaan.

### De drie standen

| Stand | Docent **met** klastoewijzing | Docent **zonder** toewijzing | Leerling **zonder** klas |
|:---|:---|:---|:---|
| `school` (standaard) | hele school | hele school | zichtbaar |
| `class_soft` | alleen eigen klassen | hele school, behalve leerlingen zonder klas | alleen beheerder |
| `class_strict` | alleen eigen klassen | geen toegang | alleen beheerder |

`class_soft` is uitdrukkelijk een **compatibiliteits-fallback voor de uitrol,
geen privacymaatregel**: zolang een school in die stand staat is de klasgrens
niet afdwingbaar, want een docent zonder toewijzingen ziet nog steeds de hele
school. Alleen `class_strict` maakt de belofte aan scholen waar.

`class_soft` is de uitrolstand: zodra een docent klassen krijgt toegewezen wordt
hij klasgebonden, en wie nog niet is ingericht werkt gewoon door. `class_strict`
is de eindstand — dat is de stand waarin de belofte aan scholen klopt.

Admin en developer houden in alle standen schoolbreed zicht. Dat zijn de
schoolbeheerder en het DGSkills-beheer, niet de lesgevende docent. Zij komen er
wél alleen in **met MFA**: migratie `20260626144000` eist AAL2 voor élke
bevoorrechte rol. De vrijstelling uit `20260413100000` (die admin en developer
van MFA ontsloeg) is daar stilzwijgend teruggedraaid — de bestandsnaam en de
kopregels van die migratie wekken nog steeds de indruk dat de vrijstelling
geldt. Dat is een valkuil bij elk volgend RLS-ontwerp.

> **Los hiervan op te lossen:** `SECURITY.md` beschrijft MFA als vereist voor
> "teacher and admin roles". Dat klopt met de huidige code, maar niet met de
> kopregels van `20260413100000`. Die kopregels zijn misleidend geworden en
> horen gecorrigeerd — buiten de scope van deze wijziging.

---

## 3. De helpers

```
public.teacher_scope_mode(target_school_id text)          -> text
public.is_teacher_of_class(target_school_id text, target_class text) -> boolean
public.is_teacher_of_student(target_user_id uuid)         -> boolean
```

`is_teacher_of_student` is de functie waar toegangsregels op over kunnen: geef
haar een leerling-id en zij zoekt zelf school en klas op. `is_teacher_of_class`
is de onderliggende bouwsteen, bruikbaar voor tabellen die school en klas al bij
zich dragen (zoals `eindmeting_releases`).

Twee eigenschappen zijn dragend en beide zijn getest:

1. **Nooit ruimer dan wat er nu staat.** De eerste stap in
   `is_teacher_of_class` is `is_teacher_in_school()`. Rol, MFA en schoolgrens
   blijven precies zoals ze zijn; deze functie kan alleen maar *strenger* zijn.
2. **Bij twijfel dicht.** Onbekende leerling, `NULL`, of een leerling zonder
   klas in een klasgebonden stand: `false`. Nooit "bij twijfel toegang".

Dat laatste heeft een gevolg dat je vóór het omzetten moet oplossen: **een
leerling zonder klas is in `class_soft` en `class_strict` voor geen enkele
docent zichtbaar — alleen voor de beheerder.** De controle daarop staat bewust
vóór de `class_soft`-uitzondering; stond hij erna, dan zou juist de nog niet
ingerichte docent de niet-ingedeelde leerlingen wél zien, en dat is precies
andersom dan bedoeld. Zie de voorwaarden in §5.

De helpers zijn `STABLE` gemarkeerd, zodat Postgres het antwoord binnen één query
mag hergebruiken in plaats van het per rij opnieuw te berekenen. De bestaande
helpers zijn dat niet; dat is een bestaand prestatiepunt dat hier niet is
aangeraakt.

---

## 4. Beheer: hoe komt de koppeling erin?

**Beide routes, in deze volgorde.**

### 4a. Handmatig door de schoolbeheerder — eerst, en altijd nodig

De roosterimport is een momentopname. Klassen wisselen, docenten vallen uit,
duo's splitsen halverwege het jaar. Er moet dus hoe dan ook een scherm zijn waar
een beheerder een koppeling legt of weghaalt. Dat is ook de enige route die
werkt voor de scholen die vandaag al draaien en die nooit een import hebben
gedaan.

Voorstel: een tabblad "Klassen en docenten" in het bestaande beheerdersmenu
(`src/features/teacher/dashboard/TeacherAccountMenu.tsx`), met per docent een
lijstje klassen uit `users.student_class` van die school. Het scherm laat
daarnaast twee dingen zien die vóór het omzetten moeten kloppen:

- docenten zonder enige klastoewijzing;
- leerlingen zonder klas.

### 4b. Via de roosterimport — daarna, als aanvulling

`supabase/functions/importRoster/index.ts` verwerkt vandaag alleen leerlingen:
elke rij wordt een leerling met een `klas`-veld. Docenten komen er niet in voor.

Uitbreiding: een optioneel veld `docenten` per rij, of een tweede blok
`teachers: [{ email, klassen: [...] }]`. De functie zoekt de docent op e-mail
binnen de eigen school en zet de koppelingen weg met `source = 'roster_import'`.

Twee randvoorwaarden:

- **Alleen bestaande docentaccounts koppelen, nooit aanmaken.** De import maakt
  vandaag leerlingaccounts aan; een docentaccount is een rechtenbeslissing die
  niet uit een CSV mag rollen.
- **Handmatige koppelingen overleven een herimport.** Een import mag alleen
  rijen met `source = 'roster_import'` vervangen. Anders wist de eerste
  herimport in november alles wat de beheerder in september heeft rechtgezet.

De `source`-kolom bestaat precies daarvoor en zit al in de tabel.

### 4c. Bestaande scholen

Voor een school die vandaag draait verandert er niets tot iemand de stand
omzet. Het pad is: beheerder vult de koppelingen (4a), zet de school op
`class_soft`, controleert een periode of niemand vastloopt, en zet daarna om
naar `class_strict`.

---

## 5. Migratiepad voor de bestaande toegangsregels

**Nog niet uitgevoerd. Vraagt expliciete toestemming, per groep.**

De 47 regels die nu `is_teacher_in_school()` gebruiken vallen uiteen in drie
groepen.

> **Correctie na review (27 aug 2026).** De eerste versie van dit document telde
> 43 regels over 26 tabellen. Die telling was fout: de inventarisatie zocht
> alleen naar policy-namen tussen aanhalingstekens en miste daardoor
> `teacher_step_overrides`, `ai_beleid_surveys` en `ai_beleid_feedback`. De
> juiste telling is 47 over 28. Reproduceer met een zoekopdracht die zowel
> `CREATE POLICY "naam"` als `CREATE POLICY naam` vangt.

### Groep A — leerlinggegevens, moeten over (22 regels, 13 tabellen)

Deze regels ontsluiten gegevens die herleidbaar zijn tot een individuele
leerling. `is_teacher_of_student()` past er direct op waar een leerling-id in de
rij staat.

| Tabel | Regels | Toelichting |
|:---|---:|:---|
| `users` | 4 | zie waarschuwing hieronder — niet mechanisch om te zetten |
| `mission_progress` | 4 | voortgang per leerling |
| `wellbeing_alerts` | 2 | zie apart besluit hieronder |
| `growth_recommendations` | 2 | AI-aanbevelingen per leerling |
| `teacher_step_overrides` | 2 | docent-override op een leerlingstap (Art. 14) |
| `assessment_results` | 1 | beoordelingen |
| `nulmeting_results` | 1 | nulmeting |
| `student_activities` | 1 | activiteitenlog |
| `teacher_notes` | 1 | docentnotities over een leerling |
| `highlighted_work` | 1 | uitgelicht werk van een leerling |
| `student_groups` | 1 | bevat `student_uids` |
| `teacher_messages` | 1 | `target_id` kan een individuele leerling zijn |
| `peer_feedback` | 1 | feedback tussen leerlingen onderling |

De laatste vier stonden in de eerste versie van dit document in groep B of C.
Dat was fout: ze dragen alle vier leerling-identifiers.

Voor de meeste is de omzetting mechanisch:

```sql
-- van
USING (auth.uid() = user_id OR public.is_teacher_in_school(school_id))
-- naar
USING (auth.uid() = user_id OR public.is_teacher_of_student(user_id))
```

**Waarschuwing bij `users` — hier is de omzetting NIET mechanisch.**
Drie dingen gaan mis bij een botte vervanging:

1. `is_teacher_of_student()` geeft bewust `false` voor een niet-leerlingaccount.
   Zet je `users_select_own_or_teacher` om zonder meer, dan kunnen docenten
   elkaars accountrij niet meer zien — vandaag kan dat wel. De vervanger moet
   een aparte tak houden voor personeelsrijen.
2. `users_insert_authenticated` en `users_update_own_or_teacher` toetsen bij een
   INSERT of UPDATE de *nieuwe* rij. Bij een INSERT bestaat de leerling nog niet
   in `public.users`, dus `is_teacher_of_student(id)` valt per definitie dicht en
   zou het aanmaken van een leerling door een beheerder blokkeren.
3. `users_delete_teacher_only` is onomkeerbaar.

Deze vier regels horen daarom in een eigen ronde, met een eigen ontwerp per
regel — niet in de eerste omzetting.

**`wellbeing_alerts` verdient een apart besluit.** Klasgebonden toegang is hier
privacytechnisch juist, maar een welzijnssignaal dat niemand ziet omdat de
mentor geen koppeling heeft, is een zorgplichtprobleem dat zwaarder weegt dan
het privacywinstje. Voorstel: als laatste omzetten, en pas nadat is vastgelegd
wie een signaal opvangt als de klasdocent het laat liggen. Tot dat besluit er
is: laten staan.

### Groep B — school- of lesconfiguratie, blijven schoolbreed (10 regels, 5 tabellen)

`class_settings`, `school_containers`, `school_container_missions`,
`eindmeting_releases`, `gamification_events`. Dit is lesorganisatie zonder
leerling-identifier. Een docent moet het rooster van de school kunnen zien, ook
van klassen die hij niet geeft.

Uitzondering om later te bekijken: `eindmeting_releases` en `class_settings`
dragen een `student_class` bij zich. Wie daar *schrijft* mag beperkt worden met
`is_teacher_of_class(school_id, student_class)`; lezen blijft schoolbreed. Dat
is een verbetering, geen noodzaak.

### Groep C — toestemmingen, logging en gedeeld werk (15 regels, 10 tabellen)

Hier botsen de belangen en is per tabel een besluit nodig:

- **Toestemmingen** (`student_consents`, `parental_consent_requests`): wordt in
  de praktijk door één administratief medewerker gedaan, niet door de
  klasdocent. Klasgebonden maken breekt dat proces. Voorstel: schoolbreed
  houden, en het in de documentatie ook zo beschrijven.
- **Logging** (`audit_logs`, `ai_usage_events`, `ai_oversight_events`): dit is
  het toezichtspoor onder AI Act Art. 12 en Art. 14. Klasgebonden maken maakt
  toezicht op schoolniveau onmogelijk. Voorstel: schoolbreed houden.
  *Openstaand meningsverschil:* de reviewer vindt dat `ai_oversight_events` in
  groep A hoort, omdat de gebeurtenissen aan individuele leerlingen hangen. Dat
  is een reëel punt; het is een afweging tussen toezichtbaarheid en
  dataminimalisatie die Yorin moet maken, niet de techniek.
- **Gedeeld werk** (`shared_games`, `shared_projects`, `feedback`): door
  leerlingen zelf gedeeld. Andere afweging dan onvrijwillig zichtbare data.
  Voorstel: schoolbreed houden.
- **AI-beleidsonderzoek** (`ai_beleid_surveys`, `ai_beleid_feedback`): deze twee
  zijn op 26 aug 2026 bewust apart gescoped (migratie `20260826171719`). Niet
  meenemen zonder de aanleiding van die migratie na te lezen.

### Volgorde

1. **Nu geleverd.** Tabellen, helpers, toegangsregels op de nieuwe tabellen,
   contractcheck. Gedrag ongewijzigd.
2. **Beheerscherm** (§4a) plus een overzicht van wat er nog ontbreekt.
3. **Groep A omzetten** — 16 van de 22 regels, dus zonder `wellbeing_alerts`
   (2 regels) en zonder de 4 regels op `users` (die krijgen een eigen ronde met
   een eigen ontwerp per regel). Elke omgezette regel krijgt een toets in
   `tests/rls/teacher-class-scoping/` en een uitbreiding van
   `scripts/check-rls-functions.mjs`. Meet in deze stap ook de queryduur op
   `mission_progress` en `student_activities` vóór en ná.
4. **Eén pilotschool op `class_soft`**, met de instructie om te melden wanneer
   iets niet meer zichtbaar is dat wel zichtbaar hoorde te zijn.
5. **`class_strict`**, per school, pas als aan de voorwaarden hieronder is
   voldaan.
6. **Aparte besluiten** over `wellbeing_alerts`, de vier `users`-regels en
   `ai_oversight_events`.

### Voorwaarden vóór `class_strict`

Alle vier moeten kloppen, per school:

- elke leerling heeft een klas (`users.student_class` gevuld);
- elke docent heeft minstens één klastoewijzing;
- er is vastgelegd wie welzijnssignalen opvangt buiten de klasdocent om;
- de schoolbeheerder weet dat hij zelf schoolbreed zicht houdt.

---

## 6. Wat dit betekent voor de compliance-documenten

De documenten in §1 beschrijven vandaag `class_strict`, terwijl het platform op
`school` staat. Dat verschil moet weg — óf door de techniek, óf door de tekst.
Zolang stap 5 niet af is, klopt alleen de tekst aanpassen.

Tekstvoorstellen staan in
[`voorstel-compliance-teksten-klasscoping.md`](voorstel-compliance-teksten-klasscoping.md).
De bindende documenten zijn hier niet gewijzigd; dat is een besluit van Yorin,
met juridische toetsing.

---

## 7. Wat er getoetst is

`npm run check:teacher-class-scoping` draait **44 controles** tegen een
wegwerp-database. De auth-helpers worden niet nagemaakt maar uit de migraties
gehaald, en wel de **laatste definitie in migratievolgorde** — precies wat
productie heeft na het toepassen van alle migraties. Dat detail is dragend: een
eerdere versie van dit harnas pakte `is_teacher()` uit `20260413100000` en
toetste daarmee een MFA-vrijstelling die sinds `20260626144000` niet meer
bestaat. Uitkomst op 27 augustus 2026: alle 44 geslaagd.

Gedekt:

- het huidige gedrag blijft in de standaardstand ongewijzigd, inclusief de
  regressiecheck dat een docent een klas ziet die hij níét geeft;
- een klas die de docent niet geeft valt dicht in beide klasgebonden standen;
- een leerling zonder klas valt dicht voor docenten mét én zónder toewijzing;
- een docent zonder toewijzing houdt zijn werk in `class_soft` en verliest het
  in `class_strict`;
- MFA en schoolgrens blijven gelden, óók voor de beheerder;
- de helper geeft `false` voor een niet-leerlingaccount;
- een `users`-policy die de helper aanroept veroorzaakt geen oneindige recursie
  — dat is de constructie van stap 3, dus dat risico is vooraf uitgesloten;
- een docent kan zichzelf geen klas toekennen, zijn koppeling niet verwijderen
  en de stand van zijn school niet versoepelen;
- een beheerder zonder MFA kan niets toekennen, en niet buiten zijn eigen school;
- een leerling of een docent van een andere school kan niet als docent gekoppeld
  worden;
- `created_by` komt van de server, niet van de client;
- toekennen, intrekken én het omzetten van de stand komen in `audit_logs`;
- `teacher_scope_mode()` is niet aanroepbaar door gewone gebruikers, zodat
  niemand de beveiligingsstand van een vreemde school kan opvragen.

De testopstelling kiest bewust een docent met een klas én een tweede klas op
dezelfde school die hij niet geeft. Een test met maar één klas zou groen zijn
zonder dat er iets is bewezen.

**Niet gedekt:** er is geen enkele bestaande toegangsregel omgezet, dus over het
gedrag ná zo'n omzetting is niets bewezen. Er zijn ook geen prestatiemetingen
op tabellen met veel rijen; die horen bij stap 3, samen met de vraag of de
helper per rij of als `IN`-subquery moet draaien.
