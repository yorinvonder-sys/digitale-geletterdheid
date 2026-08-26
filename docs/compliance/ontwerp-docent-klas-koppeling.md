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

Die functie zit onder 43 toegangsregels, verspreid over 26 tabellen. Bij de
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

**Toegangsregels.** Lezen mag je je eigen koppelingen, en als docent of
beheerder van de school ook die van collega's — dit is personeelsinformatie, geen
leerlinggegeven, en de beheerder moet het overzicht kunnen beheren. Schrijven mag
uitsluitend `admin` of `developer` binnen de eigen school. Een docent die zichzelf
klassen kan toekennen maakt de hele maatregel waardeloos; dat is expliciet getest.

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

| Stand | Docent **met** klastoewijzing | Docent **zonder** toewijzing |
|:---|:---|:---|
| `school` (standaard) | hele school | hele school |
| `class_soft` | alleen eigen klassen | hele school |
| `class_strict` | alleen eigen klassen | geen toegang |

`class_soft` is de uitrolstand: zodra een docent klassen krijgt toegewezen wordt
hij klasgebonden, en wie nog niet is ingericht werkt gewoon door. `class_strict`
is de eindstand — dat is de stand waarin de belofte aan scholen klopt.

Admin en developer houden in alle standen schoolbreed zicht. Dat zijn de
schoolbeheerder en het DGSkills-beheer, niet de lesgevende docent.

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
leerling zonder klas is in `class_soft` en `class_strict` voor niemand
zichtbaar behalve de beheerder.** Zie de voorwaarden in §5.

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

De 43 regels die nu `is_teacher_in_school()` gebruiken vallen uiteen in drie
groepen. Alleen de eerste groep hoeft over.

### Groep A — leerlinggegevens, moeten over (16 regels)

Deze regels ontsluiten gegevens die over een individuele leerling gaan. Elke
tabel heeft een `user_id`, `student_id` of `id` van de leerling, dus
`is_teacher_of_student()` past er direct op.

| Tabel | Regels | Aantal |
|:---|:---|---:|
| `users` | `users_select_own_or_teacher`, `users_update_own_or_teacher`, `users_delete_teacher_only`, `users_insert_authenticated` | 4 |
| `mission_progress` | `..._select_own_or_teacher`, `..._delete_own_or_teacher`, `..._owner_select`, `..._owner_delete` | 4 |
| `wellbeing_alerts` | `Docenten kunnen wellbeing alerts lezen`, `... reviewen` | 2 |
| `growth_recommendations` | `Docenten lezen aanbevelingen`, `Docenten keuren aanbevelingen goed` | 2 |
| `student_activities` | `student_activities_select_own_or_teacher` | 1 |
| `assessment_results` | `Docenten lezen assessment resultaten` | 1 |
| `nulmeting_results` | `Docenten lezen nulmeting resultaten` | 1 |
| `teacher_notes` | `Privileged users manage teacher notes` | 1 |

De omzetting is per regel mechanisch:

```sql
-- van
USING (auth.uid() = user_id OR public.is_teacher_in_school(school_id))
-- naar
USING (auth.uid() = user_id OR public.is_teacher_of_student(user_id))
```

**`wellbeing_alerts` verdient een apart besluit.** Klasgebonden toegang is hier
privacytechnisch juist, maar een welzijnssignaal dat niemand ziet omdat de
mentor geen koppeling heeft, is een zorgplichtprobleem dat zwaarder weegt dan
het privacywinstje. Voorstel: deze tabel als laatste omzetten, en pas nadat is
vastgelegd wie een signaal opvangt als de klasdocent het laat liggen. Tot dat
besluit er is: laten staan.

**De drie schrijfregels op `users` ook.** `users_update_own_or_teacher`,
`users_delete_teacher_only` en `users_insert_authenticated` geven schrijfrechten
op leerlingaccounts. Ze horen in groep A, maar een fout hier is niet terug te
draaien — een verwijderde leerling komt niet terug. Voorstel: apart omzetten, ná
de leesregels, en pas nadat die een periode in `class_strict` hebben gedraaid
zonder klachten. Let bij `users_insert_authenticated` op de roosterimport: die
draait met de service-rol en gaat langs RLS heen, maar een beheerder die
handmatig een leerling aanmaakt niet.

### Groep B — school- of klasconfiguratie, blijven schoolbreed (13 regels)

`class_settings`, `school_containers`, `school_container_missions`,
`eindmeting_releases`, `student_groups`, `highlighted_work`, `teacher_messages`,
`gamification_events`. Dit is lesorganisatie, geen leerlinggegeven. Een docent
moet het rooster van de school kunnen zien, ook van klassen die hij niet geeft.

Uitzondering om apart te bekijken: `eindmeting_releases` en `class_settings`
dragen een `student_class` bij zich. Wie *schrijft* daar mag beperkt worden met
`is_teacher_of_class(school_id, student_class)` — lezen blijft schoolbreed. Dat
is een verbetering, geen noodzaak; niet in de eerste ronde.

### Groep C — toestemmingen, logging en gedeeld werk (14 regels)

`student_consents`, `parental_consent_requests`, `audit_logs`,
`ai_usage_events`, `ai_oversight_events`, `feedback`, `peer_feedback`,
`shared_games`, `shared_projects`.

Hier is per tabel een aparte afweging nodig, want de belangen botsen:

- **Toestemmingen** (`student_consents`, `parental_consent_requests`): wordt in
  de praktijk vaak door één administratief medewerker gedaan, niet door de
  klasdocent. Klasgebonden maken breekt dat proces. Voorstel: schoolbreed
  houden, en het in de documentatie ook zo beschrijven.
- **Logging** (`audit_logs`, `ai_usage_events`, `ai_oversight_events`): dit is
  het toezichtspoor onder AI Act Art. 12 en Art. 14. Klasgebonden maken maakt
  toezicht op schoolniveau onmogelijk. Voorstel: schoolbreed houden.
- **Gedeeld werk** (`shared_games`, `shared_projects`, `peer_feedback`): door
  leerlingen zelf gedeeld. Andere afweging dan onvrijwillig zichtbare data.
  Voorstel: schoolbreed houden.

### Volgorde

1. **Nu geleverd.** Tabellen, helpers, toegangsregels op de nieuwe tabellen,
   contractcheck. Gedrag ongewijzigd.
2. **Beheerscherm** (§4a) plus een overzicht van wat er nog ontbreekt.
3. **Groep A omzetten** — 11 van de 16 regels, dus zonder `wellbeing_alerts`
   (2 regels) en zonder de 3 schrijfregels op `users`. Elke omgezette regel
   krijgt een toets in `tests/rls/teacher-class-scoping/` en een uitbreiding
   van `scripts/check-rls-functions.mjs`.
4. **Eén pilotschool op `class_soft`**, met de instructie om te melden wanneer
   iets niet meer zichtbaar is dat wel zichtbaar hoorde te zijn.
5. **`class_strict`**, per school, pas als aan de voorwaarden hieronder is
   voldaan.
6. **Aparte besluiten** over `wellbeing_alerts` en de schrijfregels op `users`.

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

`npm run check:teacher-class-scoping` draait 30 controles tegen een
wegwerp-database, met de échte definities van `is_teacher()`,
`is_teacher_in_school()`, `get_caller_app_role()` en `get_caller_school_id()`
uit de bestaande migraties — geen namaak. Uitkomst op 26 augustus 2026: alle 30
geslaagd.

Gedekt: het huidige gedrag blijft in de standaardstand ongewijzigd (inclusief de
regressiecheck dat een docent een klas ziet die hij níét geeft); een klas die de
docent niet geeft valt dicht in beide klasgebonden standen; een docent zonder
toewijzing houdt zijn werk in `class_soft` en verliest het in `class_strict`;
MFA en schoolgrens blijven gelden; een docent kan zichzelf geen klas toekennen,
zijn koppeling niet verwijderen en de stand van zijn school niet versoepelen;
een beheerder kan niet buiten zijn eigen school koppelen.

De testopstelling kiest bewust een docent met een klas én een tweede klas op
dezelfde school die hij niet geeft. Een test met maar één klas zou groen zijn
zonder dat er iets is bewezen.

**Niet gedekt:** er is geen enkele bestaande toegangsregel omgezet, dus er is
ook niets getoetst over het gedrag ná zo'n omzetting. Dat hoort bij stap 3.
