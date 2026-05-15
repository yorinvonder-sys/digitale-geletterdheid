# Missie-review: De Game Director

**Mission ID:** game-director
**Template:** handcrafted
**Curriculum-plek:** Leerjaar 1, Periode 2 - AI & Creatie
**Datum:** 2026-05-09
**Reviewer-pipeline:** dgskills-mission-review (Codex GPT-5.5)

---

## 🎨 Design review

**Mission:** game-director (handcrafted)
**Reviewer:** dgskills-design-reviewer (Codex)

### ✅ Geslaagd
- **Interactie zichtbaar als productervaring:** de leerling ziet meteen blokken, werkruimte en game-preview; Chrome-check bevestigde dat de missie op desktop/tablet visueel laadt met canvas en blokeditor - `components/missions/GameDirectorMission.tsx:724`.
- **Responsive structuur aanwezig:** de missie schakelt op mobiel tussen tabs voor blokken, code en game, waardoor de drie zware panelen niet onder elkaar hoeven te concurreren. Let op: de geverifieerde mobiele Game-tab heeft nog een canvas-size bug, zie Tech review - `components/missions/GameDirectorMission.tsx:881`.
- **Knop-clarity voor blokken:** plusknoppen hebben concrete `aria-label`s en maken klikken mogelijk naast slepen, wat goed is voor iPad/trackpad-gebruik - `components/missions/game-director/BlockPalette.tsx:79`.
- **Leeftijds-passende copy:** de levelbeschrijvingen zijn kort, concreet en speels zonder lange instructieteksten - `components/missions/GameDirectorMission.tsx:36`.

### ⚠️ Aandachtspunten
- **Tailwind token consistentie:** de missie gebruikt veel hex-literals voor bestaande lab-kleuren, waardoor onderhoud en theming kwetsbaar blijven - `components/missions/GameDirectorMission.tsx:725`.
  - **Wat:** kleuren als `#FCF6EA`, `#08283B`, `#D97848`, `#E7D8BD` staan hardcoded in de UI.
  - **Waarom:** dezelfde kleuren bestaan als `lab-bg`, `lab-ink`, `lab-primary` en `lab-line`.
  - **Voorstel:** vervang bijvoorbeeld `bg-[#FCF6EA] text-[#08283B]` door `bg-lab-bg text-lab-ink`.
- **Hover-states zijn soms optisch hetzelfde als rust-state:** meerdere knoppen declareren `hover:bg-[#D97848]` terwijl de basis ook `bg-[#D97848]` is - `components/missions/GameDirectorMission.tsx:849`.
  - **Wat:** de knop voelt minder interactief.
  - **Waarom:** leerlingen krijgen weinig visuele feedback bij hover/focus.
  - **Voorstel:** gebruik `hover:brightness-95` of `hover:bg-lab-secondary` plus consistente focus-ring.
- **Icon-only controls missen labels:** de canvas-overlay play/reset-knop heeft geen `aria-label`, terwijl de betekenis alleen uit het icoon komt - `components/missions/GameDirectorMission.tsx:951`.
  - **Wat:** screenreader- en keyboardgebruikers krijgen geen duidelijke functie.
  - **Waarom:** dit is een basis-toegankelijkheidscriterium.
  - **Voorstel:** voeg `aria-label={isPlaying ? 'Stop game' : 'Start game'}` toe.
- **Mobiele Game-tab toont een zero-size canvas:** Chrome CDP-check op 390x844 schakelde naar de Game-tab, maar het canvas bleef `0x0` na 4 seconden wachten - `components/missions/GameDirectorMission.tsx:923`.
  - **Wat:** de tab, console en Game Preview-kop zijn zichtbaar, maar het spelcanvas zelf krijgt geen renderbare afmeting.
  - **Waarom:** mobiele leerlingen kunnen de game niet betrouwbaar testen.
  - **Voorstel:** geef de game-container op mobiel een vaste/minimum hoogte of aspect-ratio, bijvoorbeeld rond de wrapper op `components/missions/GameDirectorMission.tsx:935`.

### ❌ Blocking issues
- **Mobiel canvas is design-blocking voor telefoongebruik:** de mobiele tabstructuur bestaat, maar de primaire game-output is niet zichtbaar in de geverifieerde mobiele viewport - `components/missions/GameDirectorMission.tsx:923`.

### Score
4/8 geslaagd · Aanbeveling: fix-eerst

---

## 📚 Didactiek review

**Mission:** game-director (handcrafted)
**Curriculum-plek:** Leerjaar 1, Periode 2
**SLO-claim:** 22B | VSO: 19A
**Reviewer:** dgskills-didactiek-reviewer (Codex)

### ✅ Geslaagd
- **SLO 22B inhoudelijk sterk geraakt:** leerlingen bouwen gedrag met events, beweging, condities, herhaling en variabelen - `components/missions/game-director/BlockTypes.ts:67`.
- **Curriculum-plek logisch:** Game Director staat in Jaar 1 Periode 2, naast AI & Creatie en programmeerachtige missies - `config/curriculum.ts:80`.
- **Bloom-balans passend:** de flow gaat van toepassen naar maken: blokken samenstellen, testen, aanpassen en uiteindelijk zwaartekracht manipuleren - `components/missions/GameDirectorMission.tsx:36`.
- **Scaffolding per level:** challenges hebben titel, opdracht en hint, waardoor leerlingen stapsgewijs kunnen werken - `components/missions/GameDirectorMission.tsx:27`.
- **AI-as-copilot is bedoeld aanwezig:** de server-side rol bevat specifieke Game Design Coach-instructies, bloknamen en XP-farming-regels - `supabase/functions/_shared/systemInstructions.ts:14`.
- **Welzijnsprotocol centraal beschikbaar:** de AI-chat scant welzijnssignalen voordat berichten naar AI gaan - `hooks/useStudentAssistant.ts:156`.

### ⚠️ Aandachtspunten
- **SLO-metadata spreekt zichzelf tegen:** de formele mapping claimt alleen 22B, maar de dashboardkaart claimt 22A en 22B - `config/slo-kerndoelen-mapping.ts:49` en `components/ProjectZeroDashboard.tsx:120`.
  - **Wat:** leerling-/docentdashboard en SLO-rapportage kunnen verschillende claims tonen.
  - **Waarom:** scholen gebruiken deze labels als bewijs richting curriculumdekking.
  - **Voorstel:** kies expliciet: of dashboard naar alleen `['22B']`, of voeg een concrete ontwerp-reflectie toe en herstel 22A in de mapping.
- **Leerdoel op dashboard is breder dan de huidige toetsbare uitkomst:** "ontwerp je eigen game-regelset" klinkt als productontwerp, maar de checks valideren vooral het halen van doelen met blokken - `config/agents/year1.tsx:171`.
  - **Wat:** de missie voelt creatief, maar de meetbare afronding is technisch/functioneel.
  - **Waarom:** dit verzwakt de 22A-claim als die behouden blijft.
  - **Voorstel:** voeg aan het einde een korte reflectie toe: "Welke regel heb je aangepast en waarom maakt dat je game beter?"
- **Hulpflow kan didactisch verkeerd landen:** de UI toont Game Challenge Hulp, maar de chatcomponent krijgt geen `roleId="game-director"` mee - `components/missions/GameDirectorMission.tsx:859`.
  - **Wat:** de backend kan terugvallen op de generieke `student-assistant`-rol.
  - **Waarom:** dan coacht de AI mogelijk met Week 1/Magister-instructies in plaats van blokprogrammeren.
  - **Voorstel:** geef `roleId="game-director"` door aan `StudentAIChat`.

### ❌ Blocking
- **AI-coach koppeling is didactisch blocking:** zonder expliciete roleId is de missie-specifieke Game Design Coach niet gegarandeerd actief - `hooks/useStudentAssistant.ts:29`.

### N.v.t.
- Geen criteria n.v.t.; de missie gebruikt AI-hulp.

### SLO-fit oordeel
- **22B:** sterk geraakt - leerlingen programmeren visueel met events, condities, herhaling en variabelen - `components/missions/game-director/BlockTypes.ts:67`.
- **22A:** oppervlakkig als dashboardclaim - er is wel game-ontwerp-taal, maar nog geen expliciete ontwerpkeuze of onderbouwing in de afronding - `components/ProjectZeroDashboard.tsx:120`.

### Score
6/9 geslaagd · Bloom-balans: medium/hoog · Aanbeveling: fix-eerst

---

## 🔧 Tech review

**Mission:** game-director (handcrafted)
**Reviewer:** dgskills-tech-reviewer (Codex)
**Dynamic verificatie:** uitgevoerd in Chrome + CDP op `http://127.0.0.1:5173/dashboard`

### Static analyse

#### ✅ Geslaagd
- **Dedicated route bestaat:** `activeModule === 'game-director'` rendert de handcrafted missie in plaats van de generieke AiLab-route - `AuthenticatedApp.tsx:502`.
- **Restart-safe progress:** challenge-index, score, hard-mode en reflectie worden met `useMissionAutoSave` bewaard - `components/missions/GameDirectorMission.tsx:185`.
- **Edge/AI input wordt gesanitized:** leerlingbericht en context worden door `sanitizePrompt` gehaald voor verzending - `hooks/useStudentAssistant.ts:175`.
- **Game-executor vangt block-fouten af:** foutieve blokexecutie logt een veilige melding in plaats van de renderloop direct te laten crashen - `components/missions/game-director/BlockExecutor.ts:100`.

#### ⚠️ Aandachtspunten
- **TypeScript-discipline:** block-inputs gebruiken op meerdere plekken `any`, waardoor verkeerde inputvormen pas runtime zichtbaar worden - `components/missions/game-director/BlockTypes.ts:6`.
  - **Wat:** `default: any`, `Record<string, any>` en `value: any` komen terug in types en handlers.
  - **Risico:** een dropdown/string/number mix-up kan door de compiler glippen.
  - **Voorstel:** introduceer `type BlockInputValue = string | number` en gebruik `Record<string, BlockInputValue>`.
- **AI roleId ontbreekt in props:** `StudentAIChat` ondersteunt `roleId`, maar de missie geeft die prop niet door - `components/StudentAIChat.tsx:31` en `components/missions/GameDirectorMission.tsx:859`.
  - **Wat:** de `useStudentAssistant` default is `student-assistant`.
  - **Risico:** server-side system instruction en logging worden niet missiespecifiek.
  - **Voorstel:** `<StudentAIChat roleId="game-director" ... />`.
- **Completion-checks zijn deels status-afhankelijk:** `first_move` kijkt alleen naar `ctx.player.x > 150`, terwijl latere levels `ctx.reachedGoal` eisen - `components/missions/GameDirectorMission.tsx:39`.
  - **Wat:** level 1 kan slagen zonder het bewijs echt te bereiken.
  - **Risico:** leerling leert "ver genoeg bewegen" in plaats van doelgericht testen.
  - **Voorstel:** maak level 1 consistent: `check: (ctx) => ctx.reachedGoal`.
- **String-block geeft render-warning in Chrome:** de browserconsole meldde `The specified value "Waf!" cannot be parsed, or is out of range.` tijdens de Game Director-check - `components/missions/game-director/BlockTypes.ts:442`.
  - **Wat:** de default van het `show_message`-blok lijkt in een numeriek inputpad terecht te komen.
  - **Risico:** dit wijst op dezelfde zwakke input-typing als hierboven; string- en number-inputs zijn niet hard genoeg gescheiden.
  - **Voorstel:** typeer block-inputwaarden expliciet en render string-inputs als tekstveld in plaats van number/select fallback.
- **Lokale QA-sessie is geen geldige auth-proof:** de Chrome-check gebruikte een handmatig geïnjecteerde Supabase localStorage-sessie; CDP bevestigde dat de token drie segmenten had maar eindigde op `.qa` en door Supabase REST met `401` werd geweigerd - `services/authService.ts:496`.
  - **Wat:** de app-shell kan met lokale sessiemetadata renderen, maar backend/RLS accepteren deze sessie niet.
  - **Risico:** deze QA-route is bruikbaar voor visuele rooktests, maar niet voor bewijs dat rollen, RLS, activity logging, adaptive suggestions of analytics echt werken.
  - **Voorstel:** gebruik voor auth-verificatie een echte QA-gebruiker of test-branch session, en behandel localStorage-injecties alleen als visuele smoke.
- **Client-side role UI kan door localStorage worden gespoofd:** de app bouwt de zichtbare rol uit `session.user.app_metadata` nadat `onAuthStateChange` of `getSession()` een sessie oplevert - `services/authService.ts:354` en `services/authService.ts:496`.
  - **Wat:** een vervalste lokale sessie kan de Developer- of Student-shell tonen voordat backendcalls falen.
  - **Risico:** geen directe data-exposure gezien, want REST calls kregen `401`; wel verwarring en mogelijk UI-only toegang tot niet-gevoelige developer-schermen.
  - **Voorstel:** valideer sessies voor privilege-routes met `supabase.auth.getUser()` of een server-geverifieerde bootstrap, en laat fallback-identiteiten nooit `developer`, `admin` of `teacher` worden.

#### ❌ Blocking
- **Missiespecifieke AI-backendkoppeling ontbreekt:** de component ondersteunt missiecontext, maar mist `roleId="game-director"`, waardoor de server-side Game Design Coach niet gegarandeerd gebruikt wordt - `components/missions/GameDirectorMission.tsx:859`.
- **Mobiele canvas-layout faalt dynamisch:** op 390x844 blijft het canvas in de Game-tab `0x0`, ondanks zichtbare Game Preview-UI - `components/missions/GameDirectorMission.tsx:923`.

### Dynamic verificatie

#### Chrome-observaties
- Dashboard geopend als developer-preview, Periode 2 geselecteerd, "Bekijk alle 12 projecten" gebruikt, Game Director gestart.
- Desktop viewport 1440x900 laadt met blokkenpalet, codewerkruimte, game-preview canvas en systeemconsole. Canvas gemeten: `519x389`.
- Tablet viewport 768x1024 laadt met blokkenpalet, codewerkruimte, game-preview canvas en systeemconsole. Canvas gemeten: `263x197`.
- Mobile viewport 390x844 toont mobiele tabs, maar na openen van de Game-tab blijft het canvas `0x0`.
- Hulpvenster opent en toont "Game Challenge Hulp" quick prompts.

#### Console-output
- Uitgelezen via Chrome CDP.
- Geen uncaught JavaScript exceptions.
- Wel herhaalde Supabase `401`-meldingen onder de lokale QA-session. Een gerichte CDP-run bevestigde dat dit komt door een handmatig geïnjecteerde, niet-ondertekende QA-token in localStorage; Supabase REST weigert die token terecht.
- Fake developer QA veroorzaakte `401` op `users`, `school_configs`, `developer_plans` en `developer_tasks`.
- Fake student QA veroorzaakte `401` op `users`, `student_activities` en `school_configs`.
- Analytics faalt lokaal door CORS: `trackClickEvent` accepteert `https://dgskills.app`, niet `http://127.0.0.1:5173` - `services/analyticsService.ts:158`.
- Rendering-warning gevonden voor het string-defaultblok `"Waf!"` - `components/missions/game-director/BlockTypes.ts:442`.

#### Network-failures
- Uitgelezen via Chrome CDP.
- Geen relevante `>=400` responses vanaf de lokale origin `http://127.0.0.1:5173`.
- Wel niet-geannuleerde `net::ERR_FAILED` fetches naar `trackClickEvent`, passend bij de lokale analytics-CORS-fouten.

#### 401/local-QA risico-oordeel
- **Backend-risico:** laag voor deze review. Supabase REST wees de vervalste lokale token af met `401`, dus de remote database accepteerde de fake QA-gebruiker niet.
- **QA-betrouwbaarheid:** hoog risico op schijnzekerheid. Deze lokale sessie bewijst alleen dat de UI visueel kan renderen; hij bewijst niet dat echte auth, RLS, activity logging, adaptive suggestions of analytics werken.
- **Client-shell risico:** medium. De UI vertrouwt voor routering tijdelijk op localStorage/session-metadata, waardoor een fake sessie client-side developer/student views kan tonen. De backend blokkeert data, maar privilege-UI hoort bij voorkeur niet zichtbaar te worden zonder server-geverifieerde sessie.
- **MCP/log-verificatie:** Supabase MCP `list_tables` en `get_logs` gaven `Not Found`, dus live projectlogs/schema konden in deze ronde niet via MCP worden bevestigd.

#### Visuele bewijslast
- Screenshots opgeslagen:
  - `/private/tmp/game-director-desktop.png`
  - `/private/tmp/game-director-tablet.png`
  - `/private/tmp/game-director-mobile.png`
- Desktop en tablet tonen canvas en belangrijkste UI-elementen.
- Mobile toont de Game-tab UI maar niet het canvas door de `0x0` canvas-meting.

### Score
Static: 4/10 · Dynamic: 2/4 · Aanbeveling: fix-eerst

---

## Samenvatting
- **Geslaagd:** 14 criteria
- **Aandachtspunten:** 13 issues (waarvan 2 blocking)
- **Aanbeveling:** fix-eerst

## Top 3 issues
1. **Blocking:** `StudentAIChat` krijgt geen `roleId="game-director"` mee, dus de missie-specifieke AI-coach is niet gegarandeerd actief - `components/missions/GameDirectorMission.tsx:859`.
2. **Blocking:** mobiele Game-tab heeft een zero-size canvas, dus telefoonleerlingen kunnen de game niet betrouwbaar testen - `components/missions/GameDirectorMission.tsx:923`.
3. **Auth-QA beperking:** lokale fake sessions bewijzen alleen visuele rendering; echte auth/RLS moet met een geldige QA-gebruiker worden geverifieerd - `services/authService.ts:496`.

## Pilot/sales demo-zin
Game Director laat leerlingen in de onderbouw meteen ervaren wat programmeren is: regels bouwen met blokken, testen in een echte game-preview en stap voor stap verbeteren.

## Self-check
- File:regel-anchors aanwezig bij alle bevindingen.
- Samenvatting-telling opnieuw gecontroleerd na CDP-verificatie: 14 geslaagd, 13 aandachtspunten, 2 blocking.
- Build-check uitgevoerd: `npm run build` slaagde op 2026-05-09.
- Console- en netwerkclaims onderbouwd met Chrome CDP-run op 2026-05-09.
- Rapport bevat geen placeholder-tokens.
