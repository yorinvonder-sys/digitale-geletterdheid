# Leerling-Audit Layer 1 — DGSkills

**Datum:** 18 maart 2026
**Perspectief:** Leerling, 12 jaar, Klas 1, eerste keer inloggen
**Device:** Laptop/desktop browser (Chrome)
**Methode:** Alle 4 periodes doorlopen via browser, missies geopend en getest

---

## 1. Onboarding & Avatar

### Wat werkt goed
- **4-stappen flow** is duidelijk en snel (geslacht → gezicht/haar → kleding → klaar)
- Vergrendelde items (slot-icoon) als gamification werkt motiverend — "die wil ik ook!"
- Huisdier-keuze (hond, kat, robot) is een leuke touch
- "Start je Avontuur!" knop voelt episch

### Problemen
- **Naam toont "Y. Vonder" i.p.v. "Test Leerling"** — het profiel haalt de verkeerde naam op (waarschijnlijk display_name sync issue)
- Na de avatar-creator verschijnt de **Digitale Escaperoom (nulmeting)** — goed concept, maar:
  - Na een server-herstart kwam een **MFA-gate** tevoorschijn voor een student-account. De tekst zegt "Als docent of beheerder is MFA verplicht", maar het scherm werd toch getoond aan een leerling. Dit is waarschijnlijk een race condition bij session-restore.

### Leerlingvraag (opgelost)
> "Wat is MFA? Waarom moet ik dit doen?" → Dit scherm hoort niet te verschijnen voor leerlingen. Bug.

---

## 2. Dashboard — Algemene UX

### Wat werkt goed
- **Periodes als tabs** (1-4) is overzichtelijk
- **SLO-kerndoelen badges** per missie (21A, 22B, etc.) — goed voor docenten, maar leerlingen snappen dit niet
- **"Klaar als:"** tekst per periode is concreet en begrijpelijk
- **Voortgangsindicator** (0/5 voltooid) is helder
- **Streak-teller** (🔥 1 dag) motiveert

### Problemen
| # | Probleem | Ernst | Uitleg |
|---|---------|-------|--------|
| 1 | **Dashboard opent op Periode 2** i.p.v. Periode 1 | Medium | Een nieuwe leerling verwacht bij het begin te starten. Nu ziet hij "AI & Creatie" terwijl hij "Digitale Basisvaardigheden" nog niet gedaan heeft. |
| 2 | **"Terug naar Developer"** knop zichtbaar | Hoog | Deze ontwikkelaars-knop hoort NIET zichtbaar te zijn voor leerlingen. Verwijder of verberg met role-check. |
| 3 | **Herhalingsgate op Periode 1** vereist 3 herhalingen | Medium | Een NIEUWE leerling die nog nooit iets heeft gedaan, moet eerst 3 herhalingen doen voordat hij de echte missies ziet. Maar herhalingen zijn bedoeld om stof uit een vorige periode te herhalen. Bij Periode 1 is er nog geen vorige periode — dit is verwarrend. |
| 4 | **Console vol errors** | Medium | `[Permissions] Failed to fetch` herhaalt zich constant. `developer_plans.version does not exist` error. Niet zichtbaar voor leerling maar duidt op ontbrekende DB-structuur. |
| 5 | **"Uitvoering in App" badge** onduidelijk | Laag | P1-missies tonen "Uitvoering in App" badge. Wat betekent dit voor een 12-jarige? Dat het in de app is? Dat is toch vanzelfsprekend? |
| 6 | **SLO-codes (21A, 22B)** onbegrijpelijk voor leerlingen | Laag | Tags als "21D AI" en "22B Programmeren" zijn docenttaal. Leerlingen snappen niet wat "23C Maatschappij" betekent. Overweeg te verbergen of te vervangen door icoontjes. |

### Leerlingvragen (beantwoord)
> "Waarom moet ik herhalingen doen als ik nog niks gedaan heb?" → De herhalingsgate bij Periode 1 is onlogisch voor nieuwe leerlingen. Periode 1 zou geen review-gate moeten hebben.

> "Wat betekent '21A Digitale systemen'?" → SLO-codes zijn niet bedoeld voor leerlingen. Verberg ze of maak ze optioneel.

---

## 3. Periode 1 — Digitale Basisvaardigheden (5 + 3 review)

### Missies doorgelopen

| Missie | Beschrijving | Type | Oordeel |
|--------|-------------|------|---------|
| Cloud Schoonmaker | OneDrive-simulator, bestanden sorteren | Review/Interactive | Uitstekend — verdachte bestanden (Gratis_Minecraft_Hack.exe) herkenbaar, mapstructuur logisch |
| Layout Doctor | Word-simulator, koppen opmaken | Review/Interactive | Uitstekend — "dokter"-metafoor is slim, instructies zijn kristalhelder |
| Pitch Politie | PowerPoint review | Review/Interactive | Niet getest, maar beschikbaar |
| Magister Meester | Magister app leren gebruiken | AI-chat | Niet getest |
| Cloud Commander | OneDrive bestanden beheren | AI-chat | Niet getest |
| Word Wizard | Word documenten opmaken | AI-chat | Niet getest |
| Slide Specialist | PowerPoint presentaties | AI-chat | Niet getest |
| Print Pro | Printen op school | AI-chat | Niet getest |

### Wat werkt goed (Cloud Schoonmaker)
- **OneDrive-look** is realistisch — leerlingen herkennen het
- **Verdachte bestanden in rood** (Gratis_Minecraft_Hack.exe, Virus_Alert.html) — slimme manier om veiligheid te leren
- **Mappenstructuur** (Nederlands, Wiskunde, Aardrijkskunde) is herkenbaar
- **Score-indicator** (0 XP, 9/9 bestanden over) is motiverend

### Wat werkt goed (Layout Doctor)
- **Word-ribbon interface** is zeer realistisch
- **Patiënt-metafoor** met "Meester Bart" als patiënt is creatief
- **Klacht + Instructie** format is duidelijk: eerst het probleem, dan stap-voor-stap oplossing
- **"Je typt NIETS!"** — belangrijke verduidelijking, goed benadrukt
- **Casussen** (2/4) geven voortgang aan

### Probleem
- **Beschrijving van review-missies ontbreekt** op het dashboard. De kaarten tonen geen omschrijvingstekst (`paragraph` is leeg). Leerling weet niet wat hem te wachten staat bij Cloud Schoonmaker of Pitch Politie.

---

## 4. Periode 2 — AI & Creatie (9 + 1 review)

### Missies

| Missie | Beschrijving | Oordeel |
|--------|-------------|---------|
| De Code-Criticus | Fouten vinden in AI-creaties (review) | Getest — prompt herkenning, interactief |
| Prompt Perfectionist | Prompt engineering leren | Getest — uitstekend ontwerp |
| Game Programmeur | Games repareren met code | Beschikbaar |
| AI Trainer | AI trainen met voorbeelden | Beschikbaar |
| Chatbot Trainer | Eigen chatbot bouwen | Beschikbaar |
| Verhalen Ontwerper | Verhalen visualiseren met AI | Beschikbaar |
| Game Director | Game ontwerpen met codeblokken | Vrije keuze |
| AI Tekengame | Teken en laat AI raden | Beschikbaar |
| AI Beleid Brainstorm | AI-regels op school | Beschikbaar |
| De Code Denker | Computationeel denken | Beschikbaar |

### Wat werkt goed (Prompt Perfectionist)
- **"Prompt Lab"** branding is gaaf
- **3 niveaus** (Beginner → Gevorderd → Expert) met duidelijke beschrijving
- **Side-by-side vergelijking** (Jouw Resultaat vs Ideaal) is pedagogisch sterk
- **Checklist** van prompt-elementen (Specifiek ras ✗, Locatie ✗, Actie ✗, Sfeer ✗)
- **Concrete tips** ("Beschrijf het ras, niet gewoon 'hond'")
- **"Verbeteren" knop** om opnieuw te proberen — growth mindset!

### Wat werkt goed (De Code-Criticus)
- **Prompt Herkenning** als concept — herken slechte prompts in een AI-gesprek
- Interactief: klik op de foute prompt

### Problemen
- **AI-chat fallback actief** — de Gemini edge function geeft CORS-errors. Er is een lokale simulatie als fallback, maar leerlingen krijgen geen échte AI-interactie.
- **"Niet helemaal..."** foutmelding verscheen direct bij het laden van De Code-Criticus, zonder dat ik iets klikte. Mogelijk een state-bug.

---

## 5. Periode 3 — Digitaal Burgerschap (10 missies)

### Missies

| Missie | Beschrijving |
|--------|-------------|
| Data Detective | Hoe bedrijven data verzamelen |
| Data Verzamelaar | Echte datasets onderzoeken |
| Deepfake Detector | AI-content herkennen |
| De AI Spiegel | Dataprofiel door platforms |
| Social Safeguard | Veilige keuzes bij online conflict |
| Cookie Crusher | Dark patterns in cookie-popups |
| De Data Handelaar | AVG-overtredingen ontmaskeren |
| Filter Bubble Breaker | Algoritmes en filterbubbels |
| Datalekken Rampenplan | Schoolhack crisismanagement |
| Data voor Data | Data inruilen voor gratis apps |

### Wat werkt goed
- **Geen herhalingsgate** — leerlingen kunnen direct beginnen. Dit is beter dan P1/P2.
- **Thema's zijn actueel en relevant** voor 12-jarigen (deepfakes, cookies, social media)
- **"Klaar als:"** criterium is concreet: "je hebt je eigen 'Mijn 3 Dataregels'-kaart gemaakt"
- **Missie-omschrijvingen zijn pakkend** ("De school is gehackt! Manage de crisis")

### Leerlingvraag
> "Wat is een AVG?" → Bij "De Data Handelaar" staat "ontmasker AVG-overtredingen". Een 12-jarige kent de term AVG niet. Leg dit uit in de missie-intro of omschrijving.

---

## 6. Periode 4 — Eindproject (3 + 1 review)

### Missies

| Missie | Beschrijving |
|--------|-------------|
| De Ethische Raad | Ethische dilemma's adviseren (review) |
| De Blauwdruk | Project organiseren |
| De Visie | Droom visualiseren |
| De Lancering | Naar buiten brengen |

### Wat werkt goed
- **Opbouw is logisch**: plan → visualiseer → lanceer
- **Korte beschrijvingen** ("Organiseer je meesterwerk", "Breng het naar buiten")
- **Breed SLO-spectrum** — combineert kennis uit alle periodes

### Probleem
- **Herhalingsgate blokkeert** weer: "Voltooi 0/1 herhalingen". Dit is logischer dan bij P1 (je herhaalt P3), maar het kan frustrerend zijn als een leerling al aan het eindproject wil beginnen.

---

## 7. Technische Issues

| # | Issue | Ernst | Locatie |
|---|-------|-------|---------|
| 1 | MFA-gate verschijnt voor student-accounts | Hoog | `AuthenticatedApp.tsx` / `authService.ts` — race condition bij session restore |
| 2 | `[Permissions] Failed to fetch` loop | Medium | `PermissionService.ts:59` — herhaalt zich elke paar seconden |
| 3 | `developer_plans.version does not exist` | Medium | DB-kolom ontbreekt |
| 4 | CORS-error naar chat edge function | Medium | Gemini proxy geeft `ERR_FAILED` — fallback naar lokale simulatie actief |
| 5 | `classroom_configs` table error | Laag | `select=*&id=eq.Klas+1` geeft 404 — tabel bestaat niet of RLS blokkeert |
| 6 | `AuthenticatedApp Component Mounting...` loop | Laag | Component mount herhaalt zich 6+ keer — React StrictMode + state issues |
| 7 | `WebSocket connection` warnings | Laag | Realtime subscriptions falen |

---

## 8. Samenvatting — Beoordeling als 12-jarige

### Wat ik als leerling cool zou vinden
1. **Avatar maken** — leuk begin, ik wil meer items unlocken
2. **Layout Doctor** — het voelt alsof ik echt Word gebruik
3. **Cloud Schoonmaker** — grappig om Minecraft hacks naar de prullenbak te slepen
4. **Prompt Lab** — ik snap nu waarom "teken een hond" niet genoeg is
5. **Missie-namen** zijn gaaf (Code-Criticus, Cookie Crusher, Deepfake Detector)
6. **Streak-teller** — ik wil mijn streak niet kwijtraken!

### Wat ik als leerling verwarrend zou vinden
1. "Waarom begint het niet bij les 1?" (Dashboard opent op P2)
2. "Ik moet herhalingen doen maar ik heb nog niks gedaan" (P1 review-gate)
3. "Wat betekenen die codes?" (SLO-tags)
4. "Wat is die Developer-knop?" (Terug naar Developer)
5. "Waarom staat er geen uitleg bij de herhalingsopdrachten?" (lege beschrijvingen)

### Wat ik als leerling zou missen
1. **Uitleg wat je gaat doen** vóór je een missie start — sommige missie-kaarten hebben nauwelijks tekst
2. **Voortgang na de escaperoom** — ik heb de nulmeting gedaan, maar waar zie ik mijn resultaat?
3. **Visuele beloning** na het afronden van een missie — confetti, XP-animatie, badge

---

## 9. Top 5 Aanbevelingen (prioriteit)

1. **Fix: Dashboard openen op Periode 1** voor nieuwe leerlingen (of de actieve/aanbevolen periode)
2. **Fix: Verberg "Terug naar Developer" knop** voor student-rol
3. **Fix: Verwijder herhalingsgate bij Periode 1** — nieuwe leerlingen hebben niets te herhalen
4. **Fix: MFA-gate race condition** — student-accounts mogen nooit de MFA-gate zien
5. **Improve: Voeg beschrijvingstekst toe** aan review-missie kaarten op het dashboard
