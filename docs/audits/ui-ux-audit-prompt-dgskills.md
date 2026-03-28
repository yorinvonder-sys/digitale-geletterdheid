# DGSkills UI/UX Audit Prompt

**Doel:** Kopieer de volledige prompt hieronder en plak deze in een nieuw Claude-gesprek. Claude zal dan de DGSkills-interface beoordelen op UI/UX-kwaliteit, taakduidelijkheid, toegankelijkheid, vertrouwen en gebruiksvriendelijkheid voor leerlingen, docenten en scholen.

**Instructie:** Kopieer alles tussen de twee `---PROMPT START---` en `---PROMPT END---` markers.

---PROMPT START---

Je bent een senior UI/UX-auditor gespecialiseerd in educatieve webapplicaties voor minderjarigen, met expertise in:
- UX heuristics van Nielsen Norman Group
- WCAG 2.2 AA accessibility
- mobile-first interfaces
- Vercel Web Interface Guidelines
- dashboard- en product-UX voor SaaS
- cognitieve belasting, taakhelderheid en vertrouwen in edtech

Je voert een volledige UI/UX-audit uit op de DGSkills-codebase.

## Context over DGSkills

DGSkills is een AI-gestuurd educatief platform voor het voortgezet onderwijs. Het product heeft meerdere doelgroepen en gebruikscontexten:
- **Leerlingen:** missies, onboarding, avatar, voortgang, AI-chat, games
- **Docenten:** dashboard, monitoring, focus mode, voortgang, instellingen
- **Scholen/ICT-coordinatoren:** publieke landingspagina's, compliance- en privacypagina's, contactflow
- **Ouders/verzorgers:** consent- en privacyflows

De stack:
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **App-structuur:** publieke routes, login, authenticated app shell, leerling- en docentflows
- **Visuele bronnen:** codebase + bestaande screenshots in `public/screenshots/` en `business/nl-vo/export/screenshots/`

## Wat je moet doen

Voer een systematische UI/UX-audit uit op basis van:
1. De codebase
2. Beschikbare screenshots
3. Indien mogelijk: de draaiende app lokaal bekijken

Werkvolgorde:
1. Breng eerst de belangrijkste routes, doelgroepen en kernflows in kaart
2. Beoordeel daarna de interface in de auditcategorieen hieronder
3. Prioriteer bevindingen op impact: `KRITIEK`, `HOOG`, `MIDDEL`, `LAAG`
4. Geef bij elk probleem:
   - het exacte scherm of de flow
   - bestand + regelnummer(s) als bewijs uit code
   - waarom dit UX-schade veroorzaakt
   - een concrete fix of ontwerpaanpassing
5. Wees kritisch en precies, niet diplomatiek of vaag
6. Geef ook aan wat al sterk is, maar alleen als dat onderbouwd is

## Belangrijke regels voor de auditor

- Beoordeel niet alleen "ziet er mooi uit", maar vooral: **begrijpelijkheid, taakflow, vertrouwen, toegankelijkheid en wrijving**
- Focus op echte gebruikersdoelen: een leerling moet een missie snappen en afmaken; een docent moet snel grip krijgen; een school moet vertrouwen voelen
- Wees extra scherp op schermen waar spanning of onzekerheid hoog is: login, consent, privacy, foutmeldingen, AI-interactie, onboarding
- Let op overbelasting voor leerlingen van 12-18 jaar: te veel tekst, te veel keuzes, te vage CTA's, onduidelijke voortgang of te veel visuele druk
- Controleer of publieke claims op de school-/privacypagina's aansluiten op de ervaring in de UI
- Als de app lokaal niet kan draaien, voer de audit alsnog uit op basis van code + screenshots en zeg expliciet waar live validatie ontbreekt
- Verzin geen ontbrekende schermen, routes of features

## Te lezen bestanden en gebieden

Lees minimaal deze bestanden/gebieden:

### Route- en shellniveau
- `App.tsx`
- `AppRouter.tsx`
- `AuthenticatedApp.tsx`
- `styles/public.css`
- `styles/app.css`
- `styles/authenticated.css`

### Publieke experience / scholen
- `components/ScholenLanding.tsx`
- alle relevante bestanden in `components/scholen/`
- `components/Login.tsx`
- `components/Footer.tsx`
- `components/CookieConsent.tsx`
- `components/PrivacyModal.tsx`
- `components/ParentConsentApproval.tsx`
- `components/consent/`
- `components/seo/`

### Leerlingervaring
- `components/ProjectZeroDashboard.tsx`
- `components/StudentOnboarding.tsx`
- `components/AvatarSetup.tsx`
- `components/UserProfile.tsx`
- `components/GamesSection.tsx`
- `components/MissionIntro.tsx`
- `components/MissionBriefing.tsx`
- `components/MissionConclusion.tsx`
- `components/StudentAIChat.tsx`
- `components/ChatBubble.tsx`
- relevante missiecomponenten in `components/missions/`

### Docentervaring
- `components/TeacherDashboard.tsx`
- alle relevante bestanden in `components/teacher/`
- focus mode, monitoring, leaderboard, voortgangspanels, instellingen

### Feedback, status en resilience
- `components/Toast.tsx`
- `components/Skeleton.tsx`
- `components/teacher/Skeleton.tsx`
- `components/RotateDevicePrompt.tsx`
- `components/PWAInstallPrompt.tsx`
- schermen met loading/error/empty-state gedrag

### Visuele referenties
- `public/screenshots/`
- `business/nl-vo/export/screenshots/`

## Auditcategorieen

Gebruik minimaal deze 10 categorieen.

### CATEGORIE A: Informatiearchitectuur & navigatie

Controleer:
- Is voor elke doelgroep meteen duidelijk waar ze zijn en wat ze hier kunnen doen?
- Is de scheiding tussen publieke site, login en app logisch?
- Is navigatie voorspelbaar op desktop en mobiel?
- Zijn termen als "missie", "focus mode", "nulmeting", "AI", "dashboard", "review" direct begrijpelijk?
- Zijn er schermen waar gebruikers te veel moeten onthouden of terugzoeken?

### CATEGORIE B: Visuele hierarchie & ontwerpconsistentie

Controleer:
- Is er een duidelijke primaire CTA per scherm?
- Is typografie consequent en scanbaar?
- Zijn spacing, kaartopbouw, statuskleuren en iconografie consistent?
- Is het contrast tussen primair, secundair en decoratief visueel sterk genoeg?
- Zijn er componenten die aanvoelen als verschillende design-systemen door elkaar?

### CATEGORIE C: Leerling-UX en taakduidelijkheid

Controleer:
- Begrijpt een leerling direct wat de volgende stap is?
- Is voortgang zichtbaar en motiverend?
- Zijn missie-intro's, opdrachten, feedback en success states helder?
- Ontstaat er frictie door jargon, lange lappen tekst of onduidelijke instructies?
- Sluiten gamification, XP en badges aan op motivatie zonder af te leiden?

### CATEGORIE D: Docent-UX en operationele eenvoud

Controleer:
- Kan een docent binnen 5 minuten snappen hoe monitoring, focus mode en voortgang werken?
- Zijn dashboards overzichtelijk of juist cognitief zwaar?
- Worden belangrijke signalen goed geprioriteerd?
- Zijn acties met hoge impact duidelijk herkenbaar en veilig vormgegeven?
- Zijn panelen, filters en tabstructuren logisch gegroepeerd?

### CATEGORIE E: Formulieren, feedback & systeemstatus

Controleer:
- Zijn formulieren kort, logisch en fouttolerant?
- Zijn labels, placeholders, validatie en foutmeldingen helder?
- Is loading zichtbaar zonder stress of verwarring te veroorzaken?
- Krijgt de gebruiker altijd feedback na een actie?
- Zijn toasts, errors, retries, offline states en succesmeldingen bruikbaar?

### CATEGORIE F: Accessibility & inclusieve interactie

Controleer minimaal:
- toetsenbordnavigatie
- focus states
- semantische heading-structuur
- labels voor velden en icon-only knoppen
- kleurcontrast
- reduced motion
- touch targets
- screenreader-signalen voor async updates
- begrijpelijke foutmeldingen

Toets hierbij expliciet op WCAG 2.2 AA en de Vercel Web Interface Guidelines.

### CATEGORIE G: Mobiel, responsive gedrag & device-frictie

Controleer:
- Werken kernflows goed op mobiel, tablet en laptop?
- Blijven CTA's, tabellen, dashboards en kaarten bruikbaar op kleinere schermen?
- Zijn sticky elementen, modals en drawers goed hanteerbaar?
- Ontstaan er scrollproblemen, overflow, te kleine tap targets of verborgen content?
- Is device-specifieke hulp goed opgelost, bijvoorbeeld bij draaien van scherm of PWA-installatie?

### CATEGORIE H: Vertrouwen, privacy & compliance-UX

Controleer:
- Wekt de interface vertrouwen bij scholen, docenten, ouders en leerlingen?
- Zijn privacy-, cookie-, AI- en consentflows begrijpelijk en geloofwaardig?
- Worden belangrijke keuzes eerlijk en zonder dark patterns gepresenteerd?
- Sluiten privacyclaims aan op de zichtbare gebruikerservaring?
- Zijn gevoelige acties voldoende uitgelegd voordat de gebruiker moet beslissen?

### CATEGORIE I: Empty states, edge cases & fouttolerantie

Controleer:
- Wat gebeurt er als er nog geen data is?
- Wat ziet een gebruiker bij timeouts, offline, mislukte AI-calls, lege lijsten, mislukte uploads of incomplete profielen?
- Zijn fallback states behulpzaam of alleen technisch?
- Kunnen gebruikers veilig herstellen zonder vast te lopen?

### CATEGORIE J: Conversie, onboarding & eerste indruk

Controleer:
- Is de publieke ervaring overtuigend voor scholen?
- Is de contact- of demo-aanvraagflow frictieloos?
- Is onboarding voor leerlingen en docenten geruststellend en duidelijk?
- Wordt de eerste waarde van het product snel zichtbaar?
- Zijn er plekken waar de interface te veel tegelijk wil verkopen, uitleggen en bewijzen?

## Verwachte output

Gebruik exact deze structuur:

### 1. Executive Summary
- 5 tot 10 regels
- hoofdbeeld van de UX-kwaliteit
- grootste risico's
- grootste kansen

### 2. Bevindingen op prioriteit
Orden van zwaar naar licht.

Per bevinding:
- `Prioriteit:` KRITIEK / HOOG / MIDDEL / LAAG
- `Categorie:`
- `Scherm/flow:`
- `Bestand(en):`
- `Probleem:`
- `Waarom dit ertoe doet:`
- `Aanbevolen fix:`

### 3. Quick Wins (1-3 dagen)
- alleen concrete, haalbare verbeteringen

### 4. Structurele verbeteringen (1-2 sprints)
- patronen of systeemproblemen

### 5. Wat al sterk is
- alleen onderbouwde positieve punten

## Extra aandacht voor DGSkills

Wees extra scherp op deze productvragen:
- Komt DGSkills professioneel genoeg over voor een school die hiermee een pilot moet starten?
- Voelt de leerlingervaring speels maar niet chaotisch?
- Is de docentervaring krachtig zonder complex te voelen?
- Is de balans goed tussen educatie, gamification en vertrouwen?
- Voelt de AI-ervaring begeleidend en veilig, niet magisch of ondoorzichtig?

Als je live kunt testen, neem dan minimaal deze flows mee:
- `/`
- `/scholen`
- `/login`
- leerling: onboarding -> dashboard -> missie openen -> AI-/missie-interactie -> afronden
- docent: dashboard -> monitoring -> focus mode -> instellingen
- privacy/consent-gerelateerde flows

Sluit af met een korte top-10 prioriteitenlijst voor het team.

---PROMPT END---

## Aanvullende audits die nog logisch ontbreken

Op basis van `LAUNCH-PLAN.md` en de huidige auditdocs zijn dit sterke aanvullende audits die nog niet expliciet als aparte audit zijn uitgewerkt:

### 1. Accessibility audit

Waarom:
- Een responsive check is al gedaan, maar dat is niet hetzelfde als een volledige WCAG 2.2 AA-audit.
- DGSkills heeft veel interactieve schermen, missies, dashboards, toasts en modals waar toetsenbord- en screenreader-kwaliteit cruciaal is.

Scope:
- focus order
- screenreader labels
- contrast
- reduced motion
- foutmeldingen en live regions

### 2. Onboarding audit

Waarom:
- Jullie hebben veel aandacht besteed aan functionaliteit, maar de eerste 5 minuten voor leerling en docent bepalen activatie en adoptie.

Scope:
- eerste sessie
- avatar setup
- eerste missie
- docent eerste klas-/focus-setup
- time-to-value

### 3. Trust & compliance UX audit

Waarom:
- Er is al sterke compliance-documentatie, maar nog geen aparte audit op hoe privacy, AI-transparantie, consent en schoolvertrouwen in de interface landen.

Scope:
- cookie consent
- privacy modal
- parental consent
- AI disclosure
- school-/ICT-pagina's
- geloofwaardigheid van claims

### 4. Empty state / error state audit

Waarom:
- Veel producten werken in de happy flow goed, maar voelen onbetrouwbaar zodra data leeg is of AI, netwerk of uploads falen.

Scope:
- lege dashboards
- mislukte requests
- offline
- timeouts
- retries
- incomplete profielen

### 5. Information architecture audit

Waarom:
- Jullie product heeft inmiddels publieke marketing, leerlingervaring, docentdashboard, developer-tools en compliance-oppervlakken. Dan ontstaat snel navigatie- en terminologiedrift.

Scope:
- terminologie
- hoofd- en subnavigatie
- rolverwachtingen
- labelconsistentie
- mentale modellen per doelgroep

### 6. Design system drift audit

Waarom:
- Er is al een UI consistency check geweest, maar gezien de omvang van de codebase is een terugkerende audit op componentvarianten, tokens en visuele afwijkingen zinvol.

Scope:
- knoppen
- kaarten
- modals
- badges
- statuskleuren
- spacing- en type-schalen

### 7. Conversion audit voor `/scholen`

Waarom:
- SEO en performance zijn gedaan, maar een aparte conversie-audit kijkt naar overtuigingskracht, CTA-volgorde, frictie in de contactflow en bewijsopbouw.

Scope:
- hero
- CTA's
- FAQ
- social proof
- compliance-signalen
- contactformulier

### 8. Teacher task-completion audit

Waarom:
- De docentervaring is strategisch belangrijk, en een algemene UX-review is niet hetzelfde als een audit op taakvoltooiing.

Scope:
- "Kan een docent dit in 2-5 minuten?"
- monitoring
- focus mode
- voortgang interpreteren
- feedback geven
- instellingen vinden

### 9. AI interaction audit

Waarom:
- Jullie hebben security rond AI al beoordeeld, maar nog niet apart hoe begrijpelijk, veilig en didactisch de AI-interactie aanvoelt voor leerlingen.

Scope:
- prompting guidance
- verwachtingenmanagement
- foutfeedback
- transparantie over AI-beperkingen
- herstel na mislukte AI-output
