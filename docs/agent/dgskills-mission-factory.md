# DGSkills Mission Factory v1

Dit protocol organiseert AI-agentwerk rond DGSkills-missies als een klein,
herhaalbaar proces. Het doel is niet om AI vrij te laten werken, maar om elke
missie met duidelijke rollen, checks en bewijs te maken of te verbeteren.

Versie 1 geldt alleen voor DGSkills-missies. Er komt geen nieuw dashboard,
databasewijziging of automatische productieflow bij.

## Wanneer gebruiken

Gebruik dit protocol bij:
- een bestaande missie verbeteren;
- een nieuwe versie van een missie voorbereiden;
- een missie reviewen voor leskwaliteit, techniek of design;
- bewijs verzamelen voor docent, schoolleiding, inspectie of pilotrapportage.

Gebruik dit protocol niet als vervanging voor menselijke eindbeslissing. De
oprichter/docent blijft eigenaar van kwaliteit, risico en release.

## Rollen

| Rol | Simpele uitleg | Mag beslissen? |
|---|---|---|
| Regisseur | Maakt het plan, kiest de scope, bewaakt risico en bewijs. | Ja, voor proces en integratie. |
| Maker | Voert een kleine, duidelijke taak uit. | Nee, alleen binnen de opdracht. |
| Controleur | Checkt didactiek, design, techniek en browsergedrag. | Nee, geeft advies en blockers. |
| Menselijke eindbeslisser | Bepaalt of de missie goed genoeg is voor leerlingen en school. | Ja, altijd. |

Hoofdregel: subagents mogen helpen met zoeken, lezen, vergelijken en smalle
QA-checks. Ze nemen geen eindbeslissingen over architectuur, security, release
of schoolkwaliteit.

## Stap 1: Missie Intake

Vul dit kort in voordat er inhoudelijk werk start.

```md
## Missie Intake

**Missie:** <missionId of titel>
**Type werk:** maken / verbeteren / reviewen / repareren
**Doelgroep:** leerjaar, niveau, klascontext
**Waarom nu:** probleem, kans of pilotbehoefte
**Niet in scope:** wat bewust niet wordt aangepast
**Risico:** Groen / Geel / Rood
**Bewijs nodig:** welke check toont dat dit goed genoeg is?
```

Risicolabels:
- Groen: tekst, uitleg, statische content of procesafspraak.
- Geel: zichtbare missie-UI, normale productlogica, dashboardweergave.
- Rood: auth, admin, Supabase, AI-endpoints, secrets, leerlingdata,
  persoonsgegevens, betalingen of productie-instellingen.

## Stap 2: Validation Contract

Dit is het kwaliteitscontract. De Maker en Controleur gebruiken dit als meetlat.

```md
## Validation Contract

**Leerlinggroep:** voor wie is deze missie?
**Leerdoel:** wat moet de leerling na afloop kunnen?
**SLO-koppeling:** kerndoel(en), doelzin(nen) of "nog niet geregistreerd"
**Succes voor leerling:** wat ziet of maakt de leerling concreet?
**Succes voor docent:** wat kan de docent zien, beoordelen of exporteren?
**Mag niet misgaan:** belangrijkste didactische, visuele of technische risico's
**Browserbewijs:** welke schermformaten en flow-states moeten gezien zijn?
**Echte iPad-check nodig:** ja/nee, met reden als Safari/iPad-specifiek risico bestaat
```

Minimale browserbewijzen bij zichtbare missie-UI:
- desktop/laptop;
- iPad/tablet staand, ongeveer 1024 x 1366;
- iPad/tablet liggend, ongeveer 1366 x 1024;
- mobiel, smal telefoonscherm.

Controleer in elk schermformaat:
- startscherm;
- normale opdrachtflow;
- foutfeedback;
- eindscherm of doorgaan-knop;
- tekst past overal;
- knoppen zijn zichtbaar en klikbaar/tapbaar;
- niets overlapt of valt buiten beeld.

Als iets waarschijnlijk iPad/Safari-specifiek is, markeer het als:
`Echte iPad-check nodig`. Een browser-emulatie is dan niet genoeg als definitief
bewijs.

## Stap 3: Maken of Reviewen

De Regisseur splitst werk in kleine taken. Een Maker krijgt alleen een smalle
opdracht, bijvoorbeeld:
- "Controleer waar deze missie staat in curriculum en SLO-mapping."
- "Verbeter alleen de instructietekst van het startscherm."
- "Check alleen of de CTA op iPad liggend zichtbaar blijft."

De Controleur kijkt apart naar:
- didactiek: niveau, leerdoel, feedback, cognitieve belasting;
- design: layout, alignment, text-fit, contrast, spacing;
- techniek: componentkwaliteit, regressierisico, testbaarheid;
- browsergedrag: desktop, tablet/iPad staand, tablet/iPad liggend en mobiel.

## Stap 4: Reviewrapport

Gebruik dit sjabloon na review of verbetering.

```md
## Reviewrapport

**Missie:** <missionId of titel>
**Datum:** <datum>
**Type review:** static-only / browsercheck / volledige missieflow
**Advies:** ship / fix-eerst / herontwerp

### Wat is gecontroleerd
- Didactiek:
- Design:
- Techniek:
- Browser:

### Browserbewijs
| Formaat | Start | Normale flow | Foutfeedback | Eind/CTA | Opmerking |
|---|---|---|---|---|---|
| Desktop/laptop | ja/nee | ja/nee | ja/nee | ja/nee | |
| iPad/tablet staand | ja/nee | ja/nee | ja/nee | ja/nee | |
| iPad/tablet liggend | ja/nee | ja/nee | ja/nee | ja/nee | |
| Mobiel | ja/nee | ja/nee | ja/nee | ja/nee | |

### Bevindingen
- Blocking:
- Belangrijk:
- Klein:

### Wat blijft onzeker
- Niet gecontroleerd:
- Echte iPad-check nodig:
- Menselijke review nodig:
```

## Definitie van klaar

Een missie mag alleen als klaar worden beschreven als:
- het Validation Contract is ingevuld;
- de relevante didactiek-, design- en tech-checks zijn gedaan;
- zichtbare UI op desktop, tablet/iPad staand, tablet/iPad liggend en mobiel is
  bekeken;
- ontbrekend bewijs expliciet als onzekerheid is genoemd;
- de menselijke eindbeslisser akkoord kan geven op basis van het rapport.
