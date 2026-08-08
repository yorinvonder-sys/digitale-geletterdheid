# AI-testklas — layout-doctor (2026-07-30)

**Oordeel: `herontwerp`**

Reden: 2 van de 3 leerlingen konden de missie niet afmaken, en er is een BLOCKER met gemeten bewijs.

| Leerling | Afgemaakt | Tijd | Niveaufit | Binnen 30s geboeid |
|---|---|---|---|---|
| iPad-Iris (tablet, staand + liggend) | ✗ vast bij casus 4/4 | 8 min | passend | ja |
| Concrete Milan (mavo, jaar 1, desktop) | ✓ | 6 min | passend | ja |
| Gamer Gijs (havo, desktop) | ✗ afgehaakt in casus 1/4 | 2 min | te-makkelijk | **nee** |

Opgegeven duur: zie `missionDurations`. Traagste leerling bleef ruim binnen de les.

## Nieuwe bevindingen

### 1. Paginanummer-dialoog is niet te sluiten — BLOCKER
*iPad-Iris · TECHNICAL · OBJECTIVE · confidence 0.95 · `snapshot-3.txt`, `actions.json #8-10`*

In casus 4/4 sluit de dialoog "Paginanummer Positie" met geen enkele knop: `Toevoegen`, `Annuleren` én Escape doen niets. Getest met vier verschillende tikmethodes. De keuzes staan aantoonbaar correct in de status, de knop is niet uitgeschakeld, er ligt geen overlay overheen (`elementFromPoint` bevestigt dat), en de browser registreert de tik wél (INP-event). Er komt geen consolefout.

**Gevolg:** de missie is niet af te maken. Na drie geslaagde casussen loopt de leerling muurvast.
**Aanwijzing:** `src/features/word-simulator/WordSimulator.tsx` rond de handlers van die dialoog — zoek een concurrerende click-handler hoger in de boom of een render-race die de dialoogstatus meteen terugzet.

### 2. Voortgang wordt nergens bewaard — HIGH
*Alle drie de leerlingen, onafhankelijk · RESILIENCE · OBJECTIVE · confidence 0.90–0.95*

Deze missie maakt nooit een `dgskills_mission_layout-doctor`-sleutel aan. Elke verversing zet terug naar casus 1/4 — ook ná het diplomascherm. De knop "Opslaan" doet niets en geeft geen bevestiging, wat valse zekerheid wekt.

**Gevolg:** hapert de wifi of ververst een leerling per ongeluk, dan is al het werk weg. Bij Iris werd dit erger: ze ververste juist om langs de vastgelopen dialoog te komen, en verloor daarmee alles.

Drie leerlingen vonden dit onafhankelijk van elkaar. Sterkste bevinding van deze missie na de blocker.

### 3. Koppen onbereikbaar op iPad staand — HIGH
*iPad-Iris · TECHNICAL · OBJECTIVE · confidence 0.95 · `metingen.json`*

In casus 2/4 vraagt de opdracht letterlijk "klik ergens IN het woord Inleiding", maar die kopregel begint op x=205 terwijl het zichtbare paneel pas bij x=300 start. Gemeten op alle scrollposities (0, max=177, negatief): het gat van 95px is nergens te dichten. Blind tikken werkt toevallig wél.

### 4. Succesmelding verdwijnt na ~2 seconden — MEDIUM
*Concrete Milan · USABILITY · OBJECTIVE · confidence 0.75*

"Goed gedaan!" verdwijnt automatisch voordat een 12-jarige het comfortabel gelezen heeft. Consistent bij alle drie de overgangen.

### 5. Woordenteller telt verkeerd — LOW
*Concrete Milan · TECHNICAL · OBJECTIVE · confidence 0.90*

Teller springt van 33→43→63 bij het toepassen van kopstijlen en van 24→162 bij één inhoudsopgave, zonder dat er tekst is getypt. Perifeer, maar een echte datafout.

### 6. Geen toetsenbordalternatief voor slepen — HIGH
*Gamer Gijs · USABILITY · OBJECTIVE · confidence 0.90*

Met de afbeelding geselecteerd doet 10× pijltje-rechts niets. De sleepactie is de kerntaak van casus 1 en heeft geen enkel alternatief.

### 7. Geen haak voor wie niet uit zichzelf geïnteresseerd is — HIGH
*Gamer Gijs · DIDACTICS · SIMULATION · confidence 0.60 · vraagt menselijke toetsing*

De eerste dertig seconden tonen een Word-kloon plus een klacht van een volwassene over een werkstuk over de Romeinse Tijd. Geen score, geen tijdsdruk, geen personage, geen brug naar de leefwereld van een 13-jarige. Gijs checkte mentaal uit vóór zijn eerste klik.

Dit is een rollenspel-oordeel, geen meting. Wel het soort signaal waarvoor deze leerling in de klas zit.

## Bekende bevinding bevestigd

**Aanraakdoelen onder 44×44** — al bekend, nu exact gemeten en breder dan gedacht: Vet/Cursief/Onderstrepen en de opsomming- en uitlijnknoppen zijn 24×24, lettergroottestappers 20–22, leesmodusknoppen 21×21, zoomknoppen 16×16. Identiek in beide oriëntaties. Iris merkte op dat de knoppen die de missie écht nodig heeft (Kop 1, Tekstomloop) wél ruim boven de drempel zitten — dus hinderlijk, niet blokkerend.

## Kanttekening van de orkestrator — slepen

Twee leerlingen meldden dat slepen niet werkt: Iris in liggende stand, Gijs op desktop. **Dit is niet zonder meer een productiebug.** Uit de audit van juli is bekend dat de testautomatisering de afbeelding in layout-doctor niet kan verslepen terwijl een echte muis dat wél kan. Gijs hield daar zelf rekening mee (SIMULATION, confidence 0.5, "verifieer met een echte muis"); Iris claimde het als gemeten feit met confidence 0.9, en dat is een overclaim.

Wat het wél interessant maakt: Iris rapporteert dat slepen in staande stand in één keer lukte en in liggende stand drie keer faalde. Een puur automatiseringsartefact zou in beide standen falen. Dat verschil verdient een handmatige controle op een echte iPad — maar tot die controle blijft dit **onbevestigd**, niet "kapot".

## Niet getest

Serveropslag, XP en dashboardvoortgang: `NOT_RUN`. De preview-route bewaart niets, dus dat pad is hier per definitie niet te beoordelen.
