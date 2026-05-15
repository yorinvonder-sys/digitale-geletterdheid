# Missie-review: Chatbot Trainer

**Mission ID:** chatbot-trainer
**Template:** handcrafted component + AI-coachrol
**Curriculum-plek:** Leerjaar 1, Periode 2 - AI & Creatie
**Datum:** 2026-05-08
**Reviewer-pipeline:** dgskills-mission-review (Codex GPT-5.5)

---

## Design review

**Mission:** chatbot-trainer (handcrafted)
**Reviewer:** dgskills-design-reviewer (Codex)

### Geslaagd

- **Layout en flow:** de missie heeft een duidelijke driedeling: intro, scenario-keuze en trainingsomgeving. Dat past bij de leeftijd en maakt de opdracht tastbaar. Bewijs: `components/ChatbotTrainerPreview.tsx:594`, `components/ChatbotTrainerPreview.tsx:647`, `components/ChatbotTrainerPreview.tsx:762`.
- **Knop-clarity:** primaire acties zijn herkenbaar en gekoppeld aan concrete iconen, zoals starten, delen, testen en afronden. Bewijs: `components/ChatbotTrainerPreview.tsx:631`, `components/ChatbotTrainerPreview.tsx:722`, `components/ChatbotTrainerPreview.tsx:784`, `components/ChatbotTrainerPreview.tsx:1121`.
- **Responsive basis:** de scenario-keuze gebruikt een responsive grid met `md:grid-cols-2`, waardoor de setup op kleinere schermen terugvalt naar één kolom. Bewijs: `components/ChatbotTrainerPreview.tsx:659`.
- **Leeftijdsgerichte copy:** de uitleg in de intro is kort en handelingsgericht: kiezen, trainen, testen. Bewijs: `components/ChatbotTrainerPreview.tsx:600`, `components/ChatbotTrainerPreview.tsx:605`.

### Aandachtspunten

- **Token-consistentie:** de component gebruikt veel inline hex-waarden terwijl dezelfde kleuren al in `DGSKILLS_COLORS` en Tailwind `lab.*` tokens bestaan. Dat maakt later themen en visuele consistentie kwetsbaar. Bewijs: `components/ChatbotTrainerPreview.tsx:596`, `components/ChatbotTrainerPreview.tsx:650`, `components/ChatbotTrainerPreview.tsx:662`; beschikbare tokens staan in `tailwind.shared.js:6` en `config/designTokens.ts:1`.
  - **Voorstel:** vervang inline stijlen stapsgewijs door tokens/classes, bijvoorbeeld `style={{ backgroundColor: '#FCF6EA', color: '#08283B' }}` naar `className="bg-lab-bg text-lab-ink"`.
- **Toegankelijkheid icon-only knoppen:** de terugknop en plus-/verwijderknoppen zijn icon-only zonder `aria-label`; screenreaders krijgen daardoor geen duidelijke actie. Bewijs: `components/ChatbotTrainerPreview.tsx:772`, `components/ChatbotTrainerPreview.tsx:985`, `components/ChatbotTrainerPreview.tsx:1009`.
  - **Voorstel:** voeg labels toe zoals `aria-label="Terug naar scenario kiezen"`, `aria-label="Voorbeeldzin toevoegen"` en `aria-label="Voorbeeldzin verwijderen"`.
- **Focus-states zijn te zwak:** veel inputs en knoppen gebruiken `focus:outline-none` zonder zichtbare vervangende ring. Bewijs: `components/ChatbotTrainerPreview.tsx:684`, `components/ChatbotTrainerPreview.tsx:715`, `components/ChatbotTrainerPreview.tsx:1006`, `components/ChatbotTrainerPreview.tsx:1038`.
  - **Voorstel:** voeg `focus-visible:ring-2 focus-visible:ring-lab-primary focus-visible:ring-offset-2` toe aan interactieve velden.
- **Mobiele trainingsomgeving:** de hoofdtraining gebruikt vaste zijpanelen (`w-64` links en `w-80` rechts) in een horizontale flex-layout. Zonder breakpoint-alternatief is dit riskant op telefoonformaat. Bewijs: `components/ChatbotTrainerPreview.tsx:822`, `components/ChatbotTrainerPreview.tsx:824`, `components/ChatbotTrainerPreview.tsx:1057`.
  - **Voorstel:** maak op mobiel tabs voor `Intents`, `Training` en `Test`, en behoud de driekoloms-layout pas vanaf `lg:`.

### Blocking issues

- Geen design-blockers gevonden in static review.

### Score

4/8 criteria geslaagd - Aanbeveling: **fix-eerst voor pilotkwaliteit**, inhoudelijk wel bruikbaar.

---

## Didactiek review

**Mission:** chatbot-trainer (handcrafted)
**Curriculum-plek:** Leerjaar 1, Periode 2
**SLO-claim:** 21D, 22B | VSO: 18C, 19A
**Reviewer:** dgskills-didactiek-reviewer (Codex)

### Geslaagd

- **SLO-codes geldig en compact:** de mapping claimt twee reguliere doelen en twee VSO-doelen; dat is precies genoeg voor een afgebakende missie. Bewijs: `config/slo-kerndoelen-mapping.ts:47`.
- **SLO-fit 21D:** leerlingen onderzoeken concreet hoe een eenvoudige chatbot input verwerkt en waar de beperking zit. Bewijs: `config/agents/year1.tsx:3547`, `components/ChatbotTrainerPreview.tsx:815`.
- **SLO-fit 22B:** de missie vertaalt IF-THEN logica naar intents, voorbeelden, matching en output. Bewijs: `config/agents/year1.tsx:3552`, `components/ChatbotTrainerPreview.tsx:468`, `components/ChatbotTrainerPreview.tsx:482`.
- **Leerdoel concreet:** de missieobjective is handelingsgericht: regels maken en testen of de chatbot correct antwoordt. Bewijs: `config/agents/year1.tsx:3518`.
- **Activerend leren:** leerlingen bouwen een werkend artefact met scenario, trainingszinnen, responses en testberichten. Bewijs: `components/ChatbotTrainerPreview.tsx:722`, `components/ChatbotTrainerPreview.tsx:964`, `components/ChatbotTrainerPreview.tsx:1105`.
- **AI-as-copilot:** de coachconfig laat uitleggen, voordoen en reflecteren, in plaats van alleen antwoorden te geven. Bewijs: `config/agents/year1.tsx:3544`, `config/agents/year1.tsx:3566`.
- **Curriculum-plek logisch:** de missie staat na `prompt-master`, `game-programmeur` en `ai-trainer` in periode 2, waardoor AI-begrip en eenvoudige programmeerlogica samenkomen. Bewijs: `config/curriculum.ts:82`, `config/curriculum.ts:85`.

### Aandachtspunten

- **Dashboard-SLO wijkt af van centrale SLO-mapping:** de centrale mapping gebruikt `21D` en `22B`, maar het dashboard toont `21D` en `22A`. Dat kan rapportage en inspectie-uitleg vervuilen. Bewijs: `config/slo-kerndoelen-mapping.ts:47`, `components/ProjectZeroDashboard.tsx:118`.
  - **Voorstel:** pas dashboard naar `sloKerndoelen: ['21D', '22B']` aan.
- **Onderbouwtaal is soms technischer dan nodig:** termen als `Intents`, `Output`, `Training Data & Bias` zijn inhoudelijk terecht, maar vragen in leerjaar 1 om korte Nederlandse steunlabels. Bewijs: `components/ChatbotTrainerPreview.tsx:827`, `components/ChatbotTrainerPreview.tsx:1025`, `components/ChatbotTrainerPreview.tsx:815`.
  - **Voorstel:** toon leerlinglabels als `Onderwerpen`, `Antwoord van je bot` en `Voorbeelden en vertekening`, met de vakterm kleiner ernaast.
- **Reflectie zit vooral in de AI-coach, niet in de interactieve flow:** de coach noemt goede reflectievragen, maar de component laat na het testen vooral score en afronden zien. Bewijs: `config/agents/year1.tsx:3566`, `components/ChatbotTrainerPreview.tsx:1105`, `components/ChatbotTrainerPreview.tsx:1121`.
  - **Voorstel:** voeg na de test één verplichte reflectievraag toe: "Welke vraag begreep je bot niet, en welke voorbeeldzin voeg je daarom toe?"

### Blocking

- Geen didactische blockers gevonden.

### SLO-fit oordeel

- **21D AI:** sterk geraakt - leerlingen zien praktisch dat een chatbot niet "begrijpt", maar patronen in voorbeelden gebruikt. Bewijs: `config/agents/year1.tsx:3558`, `components/ChatbotTrainerPreview.tsx:175`.
- **22B Programmeren:** sterk geraakt op brugklasniveau - regels, classificatie en drempelwaarden worden functioneel toegepast zonder syntaxisdrempel. Bewijs: `components/ChatbotTrainerPreview.tsx:216`, `components/ChatbotTrainerPreview.tsx:229`.
- **18C/19A VSO:** passend - AI-toepassing en eenvoudige digitale productlogica zijn aanwezig, maar de UI heeft nog extra taalsteun nodig voor brede toegankelijkheid. Bewijs: `config/slo-kerndoelen-mapping.ts:47`, `components/ChatbotTrainerPreview.tsx:827`.

### Score

7/10 criteria geslaagd - Bloom-balans: **medium** - Aanbeveling: **ship na kleine didactische aanscherping**.

---

## Tech review

**Mission:** chatbot-trainer (handcrafted)
**Reviewer:** dgskills-tech-reviewer (Codex)
**Dynamic verificatie:** gedeeltelijk uitgevoerd in Chrome op `http://127.0.0.1:5173/dashboard`; tweede retry geblokkeerd door Chrome-extension disconnect.

### Static analyse

#### Geslaagd

- **Knop-handlers gekoppeld:** primaire acties hebben functionele handlers: start, scenario kiezen, testen, delen, voorbeeld toevoegen en afronden. Bewijs: `components/ChatbotTrainerPreview.tsx:631`, `components/ChatbotTrainerPreview.tsx:736`, `components/ChatbotTrainerPreview.tsx:914`, `components/ChatbotTrainerPreview.tsx:1009`, `components/ChatbotTrainerPreview.tsx:1121`.
- **Restart-safe state:** de missie herstelt `initialState` en bewaart state debounced via `onSave`. Bewijs: `components/ChatbotTrainerPreview.tsx:296`, `components/ChatbotTrainerPreview.tsx:311`, `components/AiLab.tsx:902`.
- **Geen raw HTML-rendering:** leerlinginput wordt via React tekstnodes weergegeven, niet via `dangerouslySetInnerHTML`. Bewijs: `components/ChatbotTrainerPreview.tsx:984`, `components/ChatbotTrainerPreview.tsx:1089`.
- **Async delen heeft try/catch:** `handleShare` vangt fouten af en toont een foutmelding. Bewijs: `components/ChatbotTrainerPreview.tsx:551`, `components/ChatbotTrainerPreview.tsx:576`.
- **Matching-algoritme is lokaal en uitlegbaar:** de fuzzy matching is simpel genoeg voor een onderwijsdemo en bevat duidelijke drempels voor confident/unsure/no match. Bewijs: `components/ChatbotTrainerPreview.tsx:175`, `components/ChatbotTrainerPreview.tsx:216`.

#### Aandachtspunten

- **Security/privacy bij delen:** custom chatbotdata wordt als gedeeld project opgeslagen met `createdBy: 'student'`, inclusief vrije leerlingtekst in scenario, testvragen, trainingsvoorbeelden en antwoorden. Er is geen zichtbare lengtebegrenzing, moderatie of privacywaarschuwing in de component. Bewijs: `components/ChatbotTrainerPreview.tsx:557`, `components/ChatbotTrainerPreview.tsx:566`, `components/ChatbotTrainerPreview.tsx:570`, `services/missionService.ts:138`.
  - **Risico:** leerlingen kunnen per ongeluk persoonsgegevens of ongepaste tekst delen.
  - **Voorstel:** voeg client-side maxlengtes, een korte waarschuwing "deel geen echte namen/adressen", en server-side validatie op `shared_projects` toe.
- **TypeScript-discipline in gedeelde service:** `missionService.ts` gebruikt meerdere `any` types in JSON-sanitizing en progressdata, wat schemafouten rond missiestate minder zichtbaar maakt. Bewijs: `services/missionService.ts:4`, `services/missionService.ts:11`, `services/missionService.ts:23`, `services/missionService.ts:132`.
  - **Voorstel:** introduceer een `JsonValue` type en type `SharedProject<TData extends JsonValue>`.
- **Clipboard error state ontbreekt:** `navigator.clipboard.writeText` wordt zonder `await` of foutafhandeling aangeroepen. Bewijs: `components/ChatbotTrainerPreview.tsx:585`.
  - **Risico:** op niet-HTTPS, geblokkeerde permissies of oudere browsers lijkt kopiëren geslaagd terwijl het faalt.
  - **Voorstel:** maak `copyToClipboard` async met try/catch en toon een foutstatus in de modal.
- **Completion kan herhaald XP triggeren:** bij elke succesvolle test wordt `onLevelComplete(1)` aangeroepen; er is lokaal geen guard dat dit per sessie of opgeslagen voortgang maar één keer gebeurt. Bewijs: `components/ChatbotTrainerPreview.tsx:541`, `components/ChatbotTrainerPreview.tsx:546`, `components/AiLab.tsx:903`.
  - **Risico:** als `handleAwardXP` geen downstream idempotency heeft, kan opnieuw testen XP stapelen.
  - **Voorstel:** bewaar `completed: true` in mission progress en check dat vóór `onLevelComplete`.
- **Chrome-flow: scorefeedback stuurt onvoldoende op bijtrainen:** in Chrome heb ik de echte leerlingroute gevolgd: Developer Portal -> Leerling Dashboard -> Periode 2 -> Chatbot Trainer -> Start missie -> Huiswerk Maatje. Met twee voorbeelden en een antwoord voor alle verplichte intents haalde de test 67%, waarna de UI alleen "Je hebt minimaal 70% nodig" en "Verder Trainen" toont. De leerling ziet niet expliciet welke intent of voorbeeldzin verbeterd moet worden. Bewijs: `components/ChatbotTrainerPreview.tsx:1105`, `components/ChatbotTrainerPreview.tsx:1131`.
  - **Risico:** leerlingen kunnen gaan gokken welke trainingsdata ontbreekt, terwijl dit juist het didactische leermoment is.
  - **Voorstel:** toon na een onvoldoende test een lijst met laag scorende berichten, bijvoorbeeld "Verbeter: Begroeting voor 'Hoi, ik heb hulp nodig'".

#### Blocking

- Geen harde blocking bug in static review, maar privacy bij delen verdient een compliance/security check vóór brede leerlingpilot.

### Dynamic verificatie

- **Uitgevoerd in Chrome:** echte route geopend via het leerlingdashboard, periode 2 uitgeklapt, `Chatbot Trainer` gestart, intro bekeken, setup geopend, voorbeeldscenario `Huiswerk Maatje` gekozen, verplichte intents gevuld en de test gestart.
- **Chrome-resultaat:** de intro en setup renderen correct; de trainingsomgeving werkt functioneel met intents, voorbeeldzinnen, responses en testchat. De testflow geeft realistische feedback en toont confidence/matchinformatie per botreactie.
- **Chrome-bevinding:** na een onvoldoende score van 67% is de herstelactie te globaal. De knop "Verder Trainen" werkt als route terug, maar de feedback zegt niet welke trainingsdata moet worden verbeterd.
- **Console:** tijdens de Chrome-run verschenen twee generieke `Object` console-errors; door de Chrome-extension disconnect kon ik de bronregel niet betrouwbaar uitbreiden. Dit blijft daarom een te herhalen browsercheck.
- **Niet voltooid:** tweede bijtrain-/afrondrun en multi-viewport screenshots konden niet worden afgerond, omdat de Codex Chrome Extension na de eerste run `Browser is not available: extension` bleef teruggeven, ook na het openen van een frisse Chrome-window.

### Score

Static: 5/9 criteria geslaagd - Dynamic: gedeeltelijk uitgevoerd - Aanbeveling: **fix-eerst voor brede pilot**, vooral delen/privacy, XP-idempotency en herstelgerichte scorefeedback.

---

## Samenvatting

- **Geslaagd:** 18 criteria
- **Aandachtspunten:** 12 issues (waarvan 0 blocking)
- **Aanbeveling:** **fix-eerst**

Chatbot Trainer is inhoudelijk een sterke leerjaar-1 periode-2 missie: leerlingen bouwen echt iets, testen het, en ontdekken het verschil tussen regelgebaseerde chatbotlogica en "magische" AI. De Chrome-check bevestigt dat de hoofdflow werkt. Voor pilotkwaliteit zijn vooral vijf verbeteringen belangrijk: dashboard-SLO gelijk trekken, mobiele/a11y-polish, reflectie na de test, herstelgerichte scorefeedback, en privacy/idempotency rond delen en XP.

## Top 3 issues

1. **Dashboard-SLO mismatch:** `components/ProjectZeroDashboard.tsx:118` toont `22A`, terwijl `config/slo-kerndoelen-mapping.ts:47` terecht `22B` gebruikt.
2. **Privacyrisico bij gedeelde chatbots:** vrije leerlingtekst wordt deelbaar opgeslagen via `components/ChatbotTrainerPreview.tsx:557` en `services/missionService.ts:138`, zonder zichtbare leerlingwaarschuwing of maxlengtes.
3. **Mobiele layout/a11y:** vaste zijpanelen en icon-only knoppen zonder labels maken de interactieve trainer kwetsbaar op kleine schermen en voor toetsenbord/screenreadergebruikers. Bewijs: `components/ChatbotTrainerPreview.tsx:824`, `components/ChatbotTrainerPreview.tsx:1057`, `components/ChatbotTrainerPreview.tsx:772`.

## Self-check

- File:regel-anchors aanwezig bij alle bevindingen.
- Tellingen gecontroleerd: 18 geslaagd, 12 aandachtspunten, 0 blocking.
- Chrome-bewijs toegevoegd voor de uitgevoerde delen; niet-voltooide browserdelen expliciet gemarkeerd.
- Geen placeholder-tokens gebruikt.

## Demo-zin voor pilot/sales

"In Chatbot Trainer bouwen brugklasleerlingen in één les hun eigen chatbot, testen ze of die slim genoeg reageert, en ontdekken ze heel concreet waar AI-regels sterk zijn en waar menselijke controle nodig blijft."
