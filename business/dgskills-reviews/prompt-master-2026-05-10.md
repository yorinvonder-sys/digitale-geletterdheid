# DGSkills Mission Factory Review - prompt-master

Datum: 2026-05-10
Missie: `prompt-master`
Reviewtype: eerste praktijktest van `DGSkills Mission Factory v1`
Advies: **fix-eerst voor releasebewijs**

## Korte conclusie

De missie `prompt-master` is statisch goed te beoordelen: de opdracht heeft duidelijke stappen, directe feedback, autosave, invoerbeperking en veilige omgang met leerlingtekst. Voor onderwijsgebruik is de kern logisch: leerlingen leren dat een goede AI-prompt concreet moet zijn over rol, doel, context, stijl en resultaat.

De Mission Factory-test laat wel meteen een procesprobleem zien: de missie is via de normale app-route niet rechtstreeks te openen voor visuele kwaliteitscontrole. De browsercheck kwam uit op `/login`, waardoor desktop, tablet/iPad staand, tablet/iPad liggend en mobiel nog niet volledig bewezen zijn. Dit is precies het soort gat dat het nieuwe proces moet vangen.

## Missie Intake

- Wat willen we controleren: of `prompt-master` klaar is om als DGSkills-missie gecontroleerd en verbeterd te worden volgens het nieuwe vaste proces.
- Leerlinggroep: onderbouw/leerjaar 1 binnen periode 2, `AI & Creatie`.
- Missietype: handgemaakte interactieve missie, geen template-missie.
- Belangrijkste gebruikersflow: introductie, opdracht lezen, prompt schrijven, feedback krijgen, verbeteren, doorgaan naar volgende opdracht of afronden.
- Niet in scope: nieuwe app-feature, auth-wijziging, AI-endpoint-wijziging, leerlingdata, productie-release.

## Validation Contract

- Leerdoel: leerling kan een simpele, concrete prompt maken en verbeteren met duidelijke rol, context, doel, stijl en output.
- SLO-koppeling in code: `21D`, `22A`; VSO-koppeling: `18C`, `19A`, `20B`.
- Succesbewijs dat nodig is:
  - missie opent via een controleerbare route;
  - startscherm werkt;
  - normale opdrachtflow werkt;
  - foutfeedback of verbeterfeedback is zichtbaar;
  - eindscherm of doorgaan-knop werkt;
  - tekst past op desktop, iPad/tablet staand, iPad/tablet liggend en mobiel;
  - knoppen zijn zichtbaar en klikbaar/tapbaar;
  - niets overlapt of valt buiten beeld.
- Wat mag niet misgaan:
  - leerlingtekst mag niet als systeeminstructie aan AI worden behandeld;
  - leerlingen mogen niet vastlopen zonder feedback;
  - iPad/tablet-weergave mag niet worden overgeslagen;
  - school/inspectie-bewijs mag niet alleen op aannames rusten.

## Uitgevoerde Controle

### Code en inhoud

Gecontroleerde bestanden:

- `components/missions/PromptMasterMission.tsx`
- `components/missions/promptMasterLogic.ts`
- `config/curriculum.ts`
- `config/slo-kerndoelen-mapping.ts`
- `docs/agent/dgskills-mission-factory.md`

Belangrijke bevindingen:

- De missie staat in periode 2, `AI & Creatie`, als `prompt-master`.
- De SLO-config noemt de titel `Prompt Perfectionist`, terwijl de missie zelf `Prompt Lab` toont en het reviewverzoek `Prompt Master` gebruikt. Dat is niet direct fout voor leerlingen, maar wel rommelig voor bewijs richting school of inspectie.
- De missie gebruikt een eigen scoremodel met criteria zoals rol, taak, context, stijl en output.
- Er is autosave via `useMissionAutoSave('prompt-master', ...)`.
- Leerlinginvoer wordt beperkt en opgeschoond voordat die naar AI-feedback gaat.
- AI-feedback gebruikt een aparte markering voor leerlingtekst en instrueert het model om die tekst als ruwe tekst te behandelen.
- Er is een fallback bij AI-problemen, zodat de missie niet volledig stilvalt.

### Browserroute

Gecontroleerd in Chrome-app via Computer Use:

- lokale app gevonden op `http://127.0.0.1:5173/`;
- poging om de missie via de normale app-route te bereiken eindigde op `http://127.0.0.1:5173/login`;
- zonder ingelogde testsessie of aparte preview-route kon de missieflow niet betrouwbaar worden geopend.

De gevraagde Chrome-plugin-route was in deze sessie niet als losse tool beschikbaar. De check is daarom uitgevoerd via de echte Chrome-app met Computer Use, maar dit telt niet als volledige Mission Factory-browsergoedkeuring.

## Viewportbewijs

| Formaat | Status | Resultaat |
| --- | --- | --- |
| Desktop/laptop | Geblokkeerd | App opent, maar missiecontrole stopt bij `/login`. |
| iPad/tablet staand, ongeveer 1024 x 1366 | Niet bewezen | Geen directe missie-preview of ingelogde testsessie beschikbaar. |
| iPad/tablet liggend, ongeveer 1366 x 1024 | Niet bewezen | Geen directe missie-preview of ingelogde testsessie beschikbaar. |
| Mobiel | Niet bewezen | Geen directe missie-preview of ingelogde testsessie beschikbaar. |

Echte iPad-check nodig: **ja**.
Reden: de missie is nog niet bewezen op echte iPad/Safari en ook niet via een betrouwbare iPad-viewporttest.

## Didactische Review

Sterk:

- De opdracht maakt promptkwaliteit concreet met herkenbare onderdelen: rol, taak, context, stijl en output.
- De missie werkt met oplopende moeilijkheid, waardoor leerlingen eerst eenvoudig oefenen en daarna preciezer moeten worden.
- Feedback lijkt bedoeld als verbetering, niet als alleen goed/fout.
- Er is een VSO-aanpassing in de drempelwaarde, waardoor de missie minder streng kan zijn voor leerlingen die dat nodig hebben.

Aandachtspunt:

- De naamgeving moet strakker: `prompt-master`, `Prompt Master`, `Prompt Perfectionist` en `Prompt Lab` worden door elkaar gebruikt. Kies één leerlingnaam en één administratieve naam.

## Design Review

Sterk:

- De missie gebruikt duidelijke fases: intro, opdracht, resultaat.
- Er zijn zichtbare call-to-actions en een voortgangsgevoel per opdracht.
- De opdrachtkaarten en feedbackblokken zijn inhoudelijk scanbaar.

Aandachtspunten:

- De challenge-header bevat op kleine schermen meerdere onderdelen naast elkaar: terugknop, levelbadge, voortgang, XP en resetknop. Dit moet visueel worden gecontroleerd op mobiel en iPad staand.
- Er staan veel directe kleurwaarden in de missiecomponent. Dat kan afwijken van het bredere designsysteem en maakt later aanpassen moeilijker.
- Omdat de visuele browserflow niet bereikbaar was, is overlap, tekstfit en tapbaarheid nog niet bewezen.

## Technische Review

Sterk:

- `promptMasterLogic.ts` bevat aparte scorelogica, waardoor de kernregels testbaar en begrijpelijk zijn.
- De component gebruikt autosave.
- Er is geen `dangerouslySetInnerHTML` gevonden in de missie.
- De AI-aanroep heeft extra instructies om leerlingtekst niet als opdracht aan het model te behandelen.
- De image-generatie heeft een timeout en fallback.

Aandachtspunten:

- De missie gebruikt relatieve imports naar gedeelde services en types. De huidige DGSkills-reviewafspraken geven voorkeur aan alias-imports.
- De normale app heeft geen eenvoudige dev-preview-route voor één missie. Daardoor is herhaalbare QA nu afhankelijk van loginstatus of handwerk.
- De volledige AI-feedbackflow is niet dynamisch bewezen in deze test, omdat de missie niet via de app bereikbaar was zonder login.

## Reviewrapport

Gecontroleerd:

- Missiepositie in curriculum.
- SLO-koppeling in configuratie.
- Kerncomponent en scorelogica.
- Veiligheidsaanpak rond leerlingprompt.
- Autosave-aanwezigheid.
- Browser-openbaarheid van de missie via de normale lokale app.

Niet bewezen:

- Startscherm in vier viewports.
- Normale opdrachtflow in vier viewports.
- Foutfeedback in vier viewports.
- Eindscherm of doorgaan-knop in vier viewports.
- Echte iPad/Safari-werking.
- Volledige Chrome-plugin-evidence.

## Hercontrole na `/goal`-implementatie

Datum hercontrole: 2026-05-10
Route: `http://127.0.0.1:5173/dev/mission-preview?mission=prompt-master`
Script: `npm run check:prompt-master:visual`
Screenshots: `/private/tmp/dgskills-prompt-master-qa`

Wat is opgelost:

- De missie is nu lokaal bereikbaar zonder login via een development-only previewroute.
- De preview gebruikt `qaMode`, zodat er geen echte AI-calls, auth, Supabase, leerlingdata of productiegedrag nodig zijn.
- De volgende states zijn dynamisch gecontroleerd: intro, opdrachtflow, zwakke-prompt-feedback en sterke-prompt-feedback met doorgaan-knop.

Viewportbewijs:

| Formaat | Status | Resultaat |
| --- | --- | --- |
| Desktop/laptop, 1440 x 900 | Bewezen via Chrome CDP | Intro, challenge, weak-feedback en strong-feedback geslaagd. |
| iPad/tablet staand, 1024 x 1366 | Bewezen via Chrome CDP | Intro, challenge, weak-feedback en strong-feedback geslaagd. |
| iPad/tablet liggend, 1366 x 1024 | Bewezen via Chrome CDP | Intro, challenge, weak-feedback en strong-feedback geslaagd. |
| Mobiel, 390 x 844 | Bewezen via Chrome CDP | Intro, challenge, weak-feedback en strong-feedback geslaagd. |

Visual Precision Gate:

- Geen horizontale overflow gevonden in de gecontroleerde states.
- De belangrijkste knoppen waren zichtbaar en bruikbaar: start, versturen, verbeteren en volgende uitdaging.
- Knoptekst werd niet afgekapt in de gecontroleerde states.

Nog steeds niet bewezen:

- Echte iPad/Safari-check blijft nodig.
- Volledige productieflow met echte AI-output is bewust niet getest in deze QA-route.
- De naamgeving blijft nog inconsistent: `prompt-master`, `Prompt Master`, `Prompt Perfectionist` en `Prompt Lab`.

## Aanbevolen Vervolgstap

De evidence-blocker is opgelost voor lokale QA. De volgende kleine stap is inhoudelijke polish op basis van het nieuwe bewijs:

- kies één consistente leerlingnaam voor de missie;
- controleer de echte iPad/Safari-weergave;
- beslis menselijk of de missie leerlingklaar is voor schoolgebruik;
- laat productie-AI en leerlingdata buiten deze previewroute.
