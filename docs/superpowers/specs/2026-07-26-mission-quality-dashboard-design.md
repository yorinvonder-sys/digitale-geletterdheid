# Missiekwaliteitsdashboard — ontwerp

## Doel

Geef Yorin één intern dashboard waarin hij de kwaliteit van alle actuele
curriculummissies kan volgen, bewijs kan bekijken en inhoudelijke of
didactische conceptwijzigingen expliciet kan goedkeuren of terugsturen.

## Feitelijke uitgangssituatie

- `src/config/curriculum.ts` bevat 99 unieke actuele missies.
- `business/dgskills-reviews/review-status.json` bevat 99 auditrecords:
  55 `blocked`, 44 `fixed` en 88 open escalaties.
- De twee verzamelingen overlappen niet volledig. De huidige missie
  `wachtwoord-fortress` mist in de auditbron. Het aanvullende record
  `ipad-print-instructies` staat niet in het reguliere curriculum.
- Het AI-testklasje heeft acht persona's, maar alleen `mail-detective` is
  aantoonbaar in een volledige browserpilot doorlopen.
- De auditbron bevat rapportpaden, scores en beslispunten, maar meestal geen
  gekoppelde screenshots.

Het dashboard toont deze verschillen expliciet. Het noemt 99 auditrecords dus
niet automatisch “alle 99 actuele missies”.

## Gebruiker en toegang

Het dashboard wordt een lazy-loaded tab in het bestaande developerdashboard.
De bestaande developer-authenticatie blijft de toegangspoort. Er komt daarnaast
een uitsluitend in development beschikbare previewroute voor browser-QA zonder
echte accounts of databasewrites.

## Informatiearchitectuur

### Portfolioniveau

De bovenste strook toont:

- 99 actuele curriculummissies;
- 98 actuele missies met een statisch auditrecord;
- 55 geblokkeerde auditrecords;
- 88 open beslispunten;
- browserdekking als afzonderlijke maat, zodat een statische review niet als
  speeltest wordt gepresenteerd.

Een waarschuwingskaart benoemt de catalogusdrift:
`wachtwoord-fortress` mist en `ipad-print-instructies` is aanvullend.

### Missielijst

De lijst ondersteunt zoeken en filters op leerjaar, periode, auditstatus en
prioriteit. Iedere rij toont titel, id, plaats in het curriculum, template,
laatste review, score-indicatie en het aantal open beslispunten. Op mobiel is
dit een compacte kaartenlijst; op brede schermen blijft de lijst naast het
missiedetail zichtbaar.

### Missiedetail

Het detail toont:

- UI/UX-, didactiek- en techscore met bronvermelding;
- topissues en statusnotitie;
- ieder open beslispunt als afzonderlijke beslissing;
- de voorgestelde of eerstvolgende verbetering;
- bewijsstatus en, indien aanwezig, een screenshot;
- genummerde kaders/cirkels als percentagecoördinaten boven het screenshot;
- links als kopieerbare repo-paden naar rapport en relevante code;
- een vóór/na-vak, met een expliciete lege toestand zolang bewijs ontbreekt.

### Goedkeuringsstroom

Per beslispunt kan Yorin kiezen:

- `Akkoord met concept`;
- `Aanpassen`;
- `Nog beoordelen`.

De keuze wordt in het bestaande developer-settingsobject opgeslagen, inclusief
datum. Een akkoord wijzigt geen missiecode en zet een auditrecord niet
automatisch op `fixed`. Eerst moet de conceptfix worden uitgevoerd en opnieuw
met bewijs worden gecontroleerd.

## Bronnen en datastroom

1. `CURRICULUM` levert de actuele missiecatalogus en leerjaar/periode.
2. `ROLES` levert waar beschikbaar de leerlingvriendelijke missietitel.
3. `review-status.json` levert de statische auditstatus.
4. Een klein versieerbaar evidencebestand levert alleen aantoonbaar bestaand
   browserbewijs en annotatiecoördinaten.
5. Pure modelhelpers voegen deze bronnen samen en berekenen dekking en filters.
6. `developer_settings.settings.missionQualityDecisions` bewaart alleen
   developerbeslissingen; er worden geen leerlinggegevens opgeslagen.

Onbekende of ongeldige records worden niet stil weggegooid. Ze verschijnen als
bronwaarschuwing en tellen niet mee als bewezen actuele missie.

## Visueel ontwerp

Het dashboard gebruikt de bestaande DGSkills-tokens: crème achtergrond, wit
papier, donker inkt, acid-geel voor voortgang en rood uitsluitend voor
blokkades. De informatiedichtheid is hoger dan in het leerlingdashboard, maar
alle hoofdacties blijven minimaal 44 CSS-pixels hoog. Status wordt nooit alleen
met kleur gecommuniceerd.

## Foutafhandeling

- Kan de auditbron niet worden geïnterpreteerd, dan toont het tabblad een
  bruikbare foutmelding in plaats van lege of fictieve KPI's.
- Mislukt het opslaan van een beslissing, dan blijft de lokale keuze zichtbaar
  met de waarschuwing dat vernieuwen haar kan verliezen.
- Een ontbrekend screenshot toont `Niet geverifieerd met browserbewijs`.
- Een ontbrekende curriculummatch wordt als aanvullende/legacy bron gemarkeerd.

## Test- en acceptatiebewijs

- Pure tests bewijzen catalogusbouw, bronreconciliatie, KPI's, filters en
  beslisstatussen.
- Een broncontracttest bewaakt unieke ids en de huidige 99/55/44/88-snapshot.
- `npm run doctor` en `npm run build:prod` bewijzen TypeScript- en bundelgedrag.
- De development-preview wordt in Chromium gecontroleerd op desktop, tablet
  portrait, tablet landscape en mobiel.
- De browsercheck controleert zichtbare KPI's, filterwerking, missieselectie,
  toetsenbordbediening, de 44px-hoofdacties en horizontale overflow.

## Buiten scope van deze eerste versie

- Automatisch alle 99 missies in de browser doorlopen.
- Missiecode automatisch aanpassen na een goedkeuring.
- Screenshots of traces met echte leerlingaccounts verwerken.
- Een nieuwe database/migratie of wijziging van RLS.
- Bestaande didactische beslispunten inhoudelijk namens Yorin afhandelen.
