# Uitbreiding DGskills Code Academie — ontwerp

## Doel

De developer-only Code Academie groeit van acht introductielessen naar een volwaardige visuele leerlijn waarmee de eigenaar van DGskills.app de codebasis, gegevensstromen en AI-wijzigingen stap voor stap leert begrijpen.

## Doelgroep en toegang

- Primair: het developeraccount van Yorin.
- Toegang blijft gekoppeld aan het bestaande developerdashboard; er komt geen openbare route.
- Geen nieuwe Supabase-tabellen of persoonsgegevens.
- Leerprogressie blijft lokaal in de browser en migreert bestaande v1-voortgang.

## Informatiearchitectuur

De academie bevat vier leerroutes met elk zes lessen:

1. **Fundament** — startpunt, routes, mappen en de componentboom.
2. **React** — componenten, props, state, effecten, events en conditioneel tonen.
3. **Data & Supabase** — types, services, lezen, schrijven, authenticatie en fouttoestanden.
4. **DGskills & AI-review** — dashboard, missiebouw, opdrachtkaarten, rechten, pull requests en kwaliteitscontrole.

Elke les bevat:

- een concreet leerdoel en geschatte duur;
- uitleg in korte alinea's;
- een visuele representatie van flow, boom, lagen, vergelijking of datareis;
- echte relevante bestandspaden en een compact codefragment;
- begrippenkaarten;
- een tabel met gegevens die door de flow reizen;
- herkenbare risico's en fouten;
- een praktische controle-opdracht;
- een herbruikbare prompt om AI-code te laten uitleggen;
- een controlevraag met feedback.

## Schermopbouw

### Overzicht

- Hero met totale voortgang, afgeronde lessen en geschatte resterende tijd.
- Vier routekaarten met voortgangsbalken die uitsluitend uit werkelijke voltooiingsdata worden berekend.
- Aanbevolen volgende les.
- Visuele architectuurkaart van de volledige applicatiestroom.
- Leskaarten gegroepeerd per route.

### Lesweergave

- Duidelijke kop met route, lesnummer, duur en doel.
- Visueel diagram als belangrijkste uitleg.
- Uitleg, begrippen en echte code naast elkaar op brede schermen.
- Datareistabel en risico's.
- Praktijkcontrole, AI-uitlegprompt en controlevraag.
- Navigatie naar vorige/volgende les.

## Technische structuur

- `code-academy/types.ts`: gedeelde typen.
- `code-academy/content/*.ts`: lesinhoud per route.
- `code-academy/academyContent.ts`: route- en lesaggregatie.
- `code-academy/AcademyVisual.tsx`: generieke visualisaties.
- `code-academy/AcademyOverview.tsx`: overzicht en leerdata.
- `code-academy/AcademyLessonView.tsx`: lespagina.
- `code-academy/progress.ts`: lokale opslag en migratie.
- `DeveloperCodeAcademy.tsx`: compacte orchestrator.

## Betrouwbaarheid

- Lesinhoud verwijst alleen naar geverifieerde repositorybestanden en bestaande patronen.
- Cijfers in het dashboard zijn uitsluitend afgeleid van het aantal lessen, metadata en lokale voltooiing; er worden geen fictieve gebruiksmetingen getoond.
- Ongeldige of corrupte lokale voortgang valt terug naar een lege voortgang.
- Bestaande v1-afgeronde lessen worden overgenomen in v2.

## Teststrategie

- Contracttest controleert 24 unieke lessen, vier routes en vereiste rijke velden.
- Test controleert dat visualisaties meerdere representaties ondersteunen.
- Test controleert lokale opslag en afwezigheid van Supabase in academieprogressie.
- Bestaande integratie met de documentenomgeving blijft gecontroleerd.
- CI moet typecheck en productiebuild bevestigen.

## Previewvalidatie

- Een nieuwe previewdeployment mag met een documentatie-only commit worden getriggerd wanneer de vorige Vercel-poging uitsluitend door de deploymentdaglimiet is geblokkeerd.
