# Claude Prompt — Docentendashboard Upgrade

Gebruik deze prompt als je Claude het docentendashboard wilt laten upgraden zodat het logisch aansluit op de volledige DGSkills-app en de leerlingervaring.

Kopieer alles tussen `---PROMPT START---` en `---PROMPT END---`.

---PROMPT START---

Je werkt in deze repository als de primaire builder.

## Werkcontext

Je werkt aan DGSkills: een educatief platform voor het voortgezet onderwijs met:
- leerlingflows: onboarding, avatar, nulmeting, dashboard, missies, AI-chat, bibliotheek, games
- docentflows: monitoring, focus mode, voortgang, SLO-rapportage, berichten, instellingen, documenten
- school-facing eisen: betrouwbaarheid, compliance, privacy, scanbaarheid en overtuigende reporting

De stack:
- React 19 + TypeScript + Vite
- Supabase voor auth, database, realtime en RLS
- Tailwind CSS + Framer Motion

## Hoofddoel

Upgrade het docentendashboard zodat het niet langer voelt als een verzameling losse panelen, maar als een samenhangende regielaag die direct aansluit op:
- wat leerlingen in hun dashboard zien
- hoe missies, focus mode en klasinstellingen werken
- hoe voortgang, nulmeting, SLO en beoordeling worden gevolgd
- hoe een docent binnen 5 minuten begrijpt wat hij moet doen

Werk dus niet alleen aan visuele polish. Los vooral structurele disconnects op tussen docent- en leerlingervaring.

## Eerst doen: context opbouwen

Lees en begrijp minimaal deze bestanden voordat je iets wijzigt:

### App- en route-structuur
- `CLAUDE.md`
- `App.tsx`
- `AppRouter.tsx`
- `AuthenticatedApp.tsx`
- `types.ts`

### Docentervaring
- `components/TeacherDashboard.tsx`
- alle relevante bestanden in `components/teacher/`
- `components/teacher/CLAUDE.md`
- `services/teacherService.ts`
- `services/nulmetingService.ts`

### Leerlingervaring
- `components/ProjectZeroDashboard.tsx`
- `components/StudentAIChat.tsx`
- `components/StudentLibrary.tsx`
- `components/StudentOnboarding.tsx`
- relevante missiecomponenten in `components/missions/`
- `services/missionService.ts`

### Curriculum en reporting
- `config/curriculum.ts`
- `config/missions.ts`
- `config/sloKerndoelen.ts`
- `config/slo-kerndoelen-mapping.ts`
- `components/teacher/MissionProgressPanel.tsx`
- `components/teacher/SLOClassOverview.tsx`

### Security en auth
- `services/authService.ts`
- `services/supabase.ts`
- `SECURITY.md`

## Productopgave

Breng het docentendashboard in lijn met de rest van het systeem. Richt je op deze productuitkomst:

1. Een docent ziet meteen:
   - welke klas aandacht nodig heeft
   - welke leerlingen vastlopen of achterblijven
   - welke missie of focus nu actief is
   - welke acties direct effect hebben op de leerlingervaring

2. Een docent kan per klas en per leerling sneller begrijpen:
   - huidige voortgang
   - actieve missie
   - afgeronde missies
   - nulmetingstatus
   - SLO-ontwikkeling
   - berichten / interventies / assessmentsignalen

3. Het dashboard sluit functioneel aan op de leerlingkant:
   - focus mode op docentniveau moet logisch terug te zien zijn in leerlinggedrag of leerlingnavigatie
   - missie-instellingen en klasinstellingen moeten aantoonbaar overeenkomen met wat leerlingen kunnen starten
   - docentberichten moeten aansluiten op de student message flow
   - voortgangs- en mission data moeten dezelfde bron van waarheid gebruiken

4. De informatiearchitectuur wordt eenvoudiger:
   - minder gevoel van versnipperde tabs
   - duidelijkere prioriteit in hoofdacties
   - betere grouping van overzicht, leerlingen, voortgang, sturing en bewijs/reporting

## Verwachte aanpak

Werk in deze volgorde:

1. Analyseer de huidige docent- en leerlingflow.
2. Benoem kort waar de grootste disconnects zitten.
3. Bepaal een verbeterde informatiearchitectuur voor het docentendashboard.
4. Implementeer de verbeteringen in code.
5. Verifieer dat docentacties logisch aansluiten op bestaande leerlingflows.
6. Doe redelijke checks of tests.

## Belangrijke ontwerpprincipes

- Docentviews zijn high-trust surfaces: betrouwbaar, expliciet, niet speels
- Minder administratieve belasting, meer directe grip
- Snelle scanbaarheid boven visueel spektakel
- Leerling- en docenttaal moeten op elkaar aansluiten
- Grote acties moeten veilig en duidelijk zijn
- Empty states, loading states en errors moeten bruikbaar zijn
- Houd mobiel en laptop beide werkbaar

## Wat je expliciet moet verbeteren

Zoek de beste implementatie binnen de bestaande codebase, maar stuur minimaal op deze thema's:

### A. Samenhang docent ↔ leerling
- Maak zichtbaar welke docentinstellingen invloed hebben op de leerlingkant
- Verminder mismatch tussen teacher settings, mission availability, focus mode en leerlingdashboard
- Zorg dat een docent makkelijker kan begrijpen wat een leerling nu werkelijk ziet of kan doen

### B. Centrale overview
- Maak het overview-scherm meer een command center in plaats van losse statistiekblokken
- Prioriteer: klasstatus, aandachtspunten, actieve lessturing, voortgang, bewijs

### C. Leerlingdetail
- Versterk de detailervaring voor een individuele leerling als centrale plek voor context en interventie
- Combineer waar logisch: identiteit, klas, voortgang, missie, assessments, nulmeting, signalen, berichten

### D. Reporting en bewijs
- Houd SLO, voortgang en nulmeting inhoudelijk betrouwbaar
- Als completion-semantiek verandert, leg het effect uit
- Exports en school-facing evidence mogen niet misleidend worden

### E. Navigatie en cognitieve rust
- Vereenvoudig de route door het dashboard
- Groepeer schermen op docenttaken, niet op toevallige implementatiegeschiedenis

## Harde randvoorwaarden

- Breek geen bestaande auth-, role- of MFA-logica
- Respecteer Supabase RLS en school-/klasisolatie
- Toon geen data van andere scholen of klassen
- Voeg geen generieke mockdata toe als vervanging voor echte flows
- Verzin geen features zonder aanknopingspunt in de codebase tenzij een kleine, logische uitbreiding nodig is
- Gebruik waar mogelijk bestaande services, types en tabellen
- Als je een schemawijziging nodig hebt, houd die minimaal en leg exact uit waarom

## Concreet opleveringsniveau

Lever een echte implementatie op, geen alleenstaand adviesdocument.

Minimaal verwacht:
- codewijzigingen in de docentflow
- duidelijke aansluiting op bestaande leerlingflow
- verbeterde informatiearchitectuur / UX
- behoud van reporting-betrouwbaarheid
- uitleg van keuzes en risico's

## Acceptatiecriteria

De wijziging is pas geslaagd als:

1. Een docent sneller ziet wat nu belangrijk is voor klas en leerlingen.
2. De relatie tussen docentacties en leerlingervaring duidelijker is.
3. Navigatie en dashboardstructuur minder versnipperd aanvoelen.
4. Voortgang, SLO, nulmeting en missiecontext logisch op elkaar aansluiten.
5. Security- en schooldata-grenzen intact blijven.
6. De code in redelijke staat is voor review.

## Test- en validatieverwachting

Controleer waar mogelijk:
- typecheck
- build
- relevante handmatige flows voor docent en leerling
- regressierisico rond focus mode, messages, voortgang, filtering en reporting

Als je iets niet kunt valideren, zeg dat expliciet.

## Branch- en PR-regels

- Maak of gebruik altijd een branch met prefix `claude/`
- Werk toe naar een pull request naar `main`
- Hou wijzigingen zo klein en logisch mogelijk
- Wees eerlijk over risico's, open punten en niet-uitgevoerde tests

## Verplichte eindoutput

Als je klaar bent, schrijf een complete PR-beschrijving in exact dit formaat:

## Doel
[Welke gebruikers- of productuitkomst levert deze PR op?]

## Wat Is Veranderd
[De belangrijkste wijzigingen, kort en concreet]

## Tests
[Commands, handmatige checks, of duidelijk waarom iets niet getest is]

## Risico's
[Regressierisico's, aannames, open punten]

## Graag Op Letten
[Waar Codex extra scherp op moet reviewen]

---PROMPT END---
