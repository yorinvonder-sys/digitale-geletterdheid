# Productvisie: Flexibele lesmodellen in DGSkills

## Samenvatting

DGSkills is geen vaststaand vak met een vast rooster, maar een set missies die een school
inzet op de manier die bij haar past. Elke missie past in een lesuur van 50 minuten. Een
school kiest bij inrichting één van drie inzetvarianten: een wekelijks DG-uur, projectweken
verspreid over het jaar, of missies geïntegreerd in bestaande vakken. De leerling-inhoud
en SLO-dekking zijn bij alle varianten gelijk; alleen het tijdpad verschilt.

Het platform ondersteunt deze keuze al als configuratie-optie ("Leerlijn Inrichten" in
het docentendashboard). Dit document beschrijft de drie varianten als product-concept en
legt vast wat elke variant betekent voor docent, leerling en rooster.

Zie voor de technische uitwerking: `docs/architecture/flexibele-lesmodellen.md`.

---

## Het principe

DGSkills biedt een driejarig spiraalcurriculum digitale geletterdheid (SLO 2025, kerndoelen
21A–23C). Het curriculum bestaat uit missies; elke missie is een zelfstandige werkeenheid van
circa 50 minuten. De missies zijn geordend in thematische blokken, maar de blokgrootte en het
tijdpad zijn niet door het platform opgelegd — de school configureert dat zelf.

Dit sluit aan bij de bestaande beschrijving in de didactische onderbouwing:
> "Dit maakt het mogelijk om DGSkills in te zetten als volledig vak (bijv. 1 uur per week),
> als onderdeel van een breder ICT/informatica-curriculum, of als verrijkingsmateriaal."
> (`business/nl-vo/didactische-onderbouwing.md:260`)

---

## De drie inzetvarianten

### Variant A — Wekelijks DG-uur

**Voor wie.** Scholen die een structureel eigen lesblok voor digitale geletterdheid kunnen
inroosteren. Denk aan een mentoruur dat deels aan DG wordt besteed, of een apart roosterblok
"digitale geletterdheid" binnen informatica of LO2.

**Hoe in het rooster.** De school configureert circa 40 lesblokken (een blok per
schoolweek, exclusief vakanties). De leerling werkt elke week in hetzelfde blok verder;
het systeem activeert automatisch het juiste weekblok op basis van de datum, of de docent
zet het blok handmatig open.

**Wat de docent ziet.** Een leerlijn van 40 opeenvolgende weekblokken. Per blok staat welke
missies aangeboden worden en welke SLO-kerndoelen daaronder vallen. De SLO-dekkingsbalk
loopt over alle blokken heen.

**Wat de leerling ziet.** De huidige week als actief blok, met de missies van die week
beschikbaar. Eerder afgeronde weken zijn zichtbaar maar niet actief; toekomstige weken zijn
vergrendeld totdat ze opengaan.

**Roosternotering.** "apart vak / mentoruur / informatica" — zie ook
`business/nl-vo/sales-assets/08-inspectie-rapportformat-dgskills.md`.

---

### Variant B — Geïntegreerd in bestaande vakken

**Voor wie.** Scholen die geen apart roosterblok kunnen of willen vrijmaken, maar DGSkills
willen verweven in bestaande lessen. Voorbeelden: de Nederlandsdocent die drie missies over
digitaal schrijven koppelt aan een schrijfopdracht; de docent mens & maatschappij die de
missie "Data Detective" plaatst bij een les over privacy; of elk mentoruur dat ad-hoc een
actuele DG-missie aanpakt.

**Hoe in het rooster.** DGSkills heeft geen eigen roosterblok. De vak-docent bepaalt zelf
wanneer en welke missies aan bod komen. Er is geen vaste volgorde en geen datum-activering.
De docent zet per klas de gewenste missies aan via de missie-bibliotheek in het dashboard.

**Wat de docent ziet.** Een overzicht van alle beschikbare missies, gegroepeerd op
SLO-kerndoel of thema, met een aan/uit-schakelaar per klas. De docent kiest per les welke
missies beschikbaar zijn voor de leerlingen in zijn klas. De voortgang en SLO-dekking zijn
per leerling inzichtelijk.

**Wat de leerling ziet.** Geen blok-navigatie of weekstructuur. Het dashboard toont de
missies die de docent heeft opengezet onder "Missies voor jou". Zodra een docent een missie
afsluit, verdwijnt die uit het actieve overzicht.

**Roosternotering.** "vakoverstijgend / project / mentor" — conform
`business/nl-vo/sales-assets/08-inspectie-rapportformat-dgskills.md`.

**Aansluiting bij bestaande bezwarenkaart.** Dit model is het directe antwoord op het
roosterbezwaar: "DGSkills is geen vaststaand vak, maar een set missies die ingezet kunnen
worden tijdens mentoruren, informatica, of als vakoverstijgende projectweken."
(`business/nl-vo/sales-assets/07-bezwarenkaart-dgskills.md:17`)

---

### Variant C — Projectweken

**Voor wie.** Scholen met een projectweek-traditie (bijv. Copernicusweek, themaweek of
vaardigheidsweek) die DGSkills intensief inzetten in één of meerdere blokken van 1–2 weken
per jaar.

**Hoe in het rooster.** De school configureert 4–6 projectblokken met een startdatum en
einddatum. Het systeem activeert automatisch het lopende projectblok. Buiten de projectweken
is er geen DGSkills-activiteit.

**Wat de docent ziet.** Een kalenderoverzicht van de projectblokken met de bijbehorende
missies en SLO-focus per blok. Voortgang is per blok en per leerling inzichtelijk.

**Wat de leerling ziet.** Het huidige projectblok als enige actieve ruimte. Alle missies
van dat blok zijn beschikbaar; eerder afgeronde blokken zijn zichtbaar als portfolio.

**Roosternotering.** "project / vakoverstijgend" — conform
`business/nl-vo/sales-assets/08-inspectie-rapportformat-dgskills.md`.

---

## SLO-dekking bij alle varianten

De SLO 2025-kerndoelen (21A–23C, digitale systemen tot digitaal welzijn) worden in alle drie
de varianten gedekt. Het verschil is tempo en volgorde, niet inhoud. Het platform toont per
klas en per leerling een dekkingsbalk die bijhoudt welke kerndoelen al zijn aangeraakt,
ongeacht de gekozen variant.

Scholen die vrezen dat een geïntegreerd model "minder SLO-bereikt" is onterecht bezorgd:
de docent kiest nog steeds uit het volledige missie-aanbod; de SLO-dekking hangt af van
welke missies hij kiest, niet van welk inzetmodel hij gebruikt.

---

## Overwegingen bij de keuze

| Overweging | Wekelijks DG-uur | Geïntegreerd | Projectweken |
|---|---|---|---|
| Eigen roosterblok nodig? | Ja | Nee | Nee (blokken) |
| Mate van structuur voor leerling | Hoog (week-voor-week) | Laag (docent stuurt) | Gemiddeld (per blok) |
| Geschikt voor vakdocenten zonder ICT-achtergrond | Goed (begeleid) | Goed (docent kiest zelf) | Goed (begeleide blokken) |
| Meest vertrouwde VO-planning | Ja | Ja (past in bestaande vakken) | Ja (projecttraditie) |
| Resultaat zichtbaar voor inspectie | SLO-rapport + portfolio | SLO-rapport per vak | SLO-rapport + blokportfolio |

---

## Relatie met andere documenten

- Didactische onderbouwing (school-override systeem, tempo): `business/nl-vo/didactische-onderbouwing.md:252–260`
- Roosterbezwaar sales-respons: `business/nl-vo/sales-assets/07-bezwarenkaart-dgskills.md:14–18`
- Inspectie-rapportformat (inroostering-veld): `business/nl-vo/sales-assets/08-inspectie-rapportformat-dgskills.md:30`
- Demo-script: `business/nl-vo/sales-assets/02-demo-script-vo.md:96`
- Technisch ontwerp en implementatie-roadmap: `docs/architecture/flexibele-lesmodellen.md`
