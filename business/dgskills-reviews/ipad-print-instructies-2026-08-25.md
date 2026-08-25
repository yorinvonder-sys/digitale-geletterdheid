# Rubric-review: ipad-print-instructies

**Datum:** 2026-08-25
**templateType:** dedicated (handcrafted component, geen gedeelde engine)
**Component:** `src/features/missions/PrintInstructiesMission.tsx`
**Curriculum-plek:** Leerjaar 1, week 2 · SLO `21A` (regulier) / `18A` (VSO) · `classRestriction: 'MH1A'`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review — 6.5/10

### ✅ Geslaagd
- **Copy-lengte:** alle scenario-descriptions ~35-45 woorden, ruim onder de leerjaar 1-2 grens van 80 woorden (`src/features/missions/PrintInstructiesMission.tsx:58,71,84,97,110`).
- **Kleur-signaal niet color-only:** correct/fout wordt zowel via kleur als via `Check`/`X`-icoon getoond (`PrintInstructiesMission.tsx:482-488`).
- **Framer Motion:** geen `motion.*`-wrappers; enige animatie is een Tailwind `animate-in`-utility met functioneel doel (feedback-reveal) — geen overload.
- **Criterium 2 (layout-consistentie):** n.v.t. (handcrafted, geen template-baseline).

### ⚠️ Aandachtspunten
- **Criterium 1 — hex-literals i.p.v. duck-tokens**: het hele component gebruikt inline `style={{ backgroundColor: '#f2f1ec' }}` e.d. in plaats van de bijbehorende `duck-*`-classes, terwijl drie regels verderop wél `bg-duck-ink`/`bg-duck-acid`/`bg-duck-bg` als className staan — `PrintInstructiesMission.tsx:125,283,376,422` vs. `:144-146`.
  - **Wat:** `#f2f1ec` = `duck-bg`, `#202023` = `duck-ink`, `#ff3c21` = `duck-error`, `#e1ff01`-kleur ontbreekt als accent — allemaal als hex herhaald i.p.v. token.
  - **Waarom:** een toekomstige theme-wijziging (bv. dark-mode of merk-refresh) moet dan tientallen losse hex-strings vinden i.p.v. één token-definitie aan te passen.
  - **Voorstel:** vervang de meest voorkomende hex-waarden door hun token-equivalent in `className` i.p.v. `style`.

- **Criterium 3 — hover-state is een no-op**: de knoppen "Probeer opnieuw", "Volgend probleem/Bekijk resultaat" en "Terug naar Mission Control" hebben `onMouseEnter`/`onMouseLeave` die exact dezelfde kleur zetten (`#ff3c21` → `#ff3c21`) — `PrintInstructiesMission.tsx:526-527, 551-552, 363-364`.
  - **Wat:** de hover-handlers bestaan maar veranderen niets zichtbaars.
  - **Waarom:** leerlingen krijgen geen visuele hover-feedback op de belangrijkste CTA's van de missie — lijkt een restant van copy-paste zonder de bedoelde donkerdere hover-kleur.
  - **Voorstel:** zie Voorstel-blok 1 hieronder.

- **Criterium 7 — icon-only terugknop zonder `aria-label`**: `PrintInstructiesMission.tsx:380-388`.
  - **Wat:** `<ArrowLeft>` in een `<button>` zonder tekst en zonder `aria-label`.
  - **Waarom:** schermlezer-gebruikers horen geen functie-omschrijving.
  - **Voorstel:** zie Voorstel-blok 2 hieronder.

- **Criterium 7 — antwoordknoppen zonder zichtbare focus-state**: `PrintInstructiesMission.tsx:461-475` heeft geen `focus-visible:*`-class, terwijl de CTA-knoppen verderop (`:356, 524, 547`) wél `focus-visible:ring-2 focus-visible:ring-duck-acid` hebben.
  - **Wat:** toetsenbord-navigatie door de vier antwoordopties geeft geen zichtbare focus-ring.
  - **Waarom:** inconsistente toegankelijkheid tussen knoptypes in dezelfde missie.
  - **Voorstel:** zie Voorstel-blok 3 hieronder.

- **Criterium 7 — reflectie-textarea zonder gekoppeld label**: `PrintInstructiesMission.tsx:342-350`. De `<p>`-tekst erboven is geen `<label htmlFor>` en er is geen `aria-label` op de `<textarea>`.
  - **Voorstel:** zie Voorstel-blok 4 hieronder.

- **Kleurcontrast (info, niet geverifieerd via browser)**: `#6f6e69` op `#f2f1ec`/`#FFFFFF` geeft rekenkundig ~4.4:1 contrast — net onder de AA-norm van 4.5:1 voor kleine tekst (`PrintInstructiesMission.tsx:297,308,312,316` e.a.). Niet dynamisch geverifieerd (geen Chrome-plugin sessie beschikbaar in deze pass).

### ❌ Blocking issues
- Geen. Geen dode knoppen, geen niet-bestaande tokens, geen totale responsive-failure aangetroffen in de statische analyse.
- **Visual Precision Gate:** niet dynamisch geverifieerd — geen dev-server/Chrome-plugin sessie in deze review-pass. Statisch (responsive classes, `max-w-*`/`w-full`, geen vaste pixel-widths) geeft geen aanleiding tot zorgen, maar dit is **unverified**, geen bewezen pass.

### Score
5.5/8 criteria volledig geslaagd (2 met aandachtspunten, 1 unverified) · Aanbeveling: **fix-eerst**

---

## 📚 Didactiek review — 6/10

**SLO-claim:** `21A` (Digitale systemen, regulier) · `18A` (VSO) — beide geldige codes, precies 1 kerndoel geclaimd (niet te veel/te weinig).

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `21A` en `18A` zijn beide bestaande, bij elkaar passende codes (`src/config/slo-kerndoelen-mapping.ts:38`).
- **Criterium 4 (opdracht-beknoptheid):** ruim binnen de leerjaar 1-2 grens (zie design-review).
- **Criterium 5 (vocabulary):** herkenbare, concrete voorbeelden ("WiFi-icoontje uit", "Grijswaarden", "Letter vs. A4") passend bij leerjaar 1, geen onnodig jargon.
- **Criterium 7 (Bloom-balans):** alle 5 scenario's zitten op toepassen (Bloom-niveau 3: diagnose stellen + juiste oplossing kiezen uit realistische situatie) — consistent en passend voor leerjaar 1, geen premature evaluatie/creatie-vraag.
- **Feedback-kwaliteit:** elke optie (goed én fout) heeft uitleg-tekst die het "waarom" verklaart, niet alleen goed/fout (`PrintInstructiesMission.tsx:61-64` e.a.) — sterk voor begripsvorming.
- **Reflectie-verplichting:** de missie dwingt een reflectie van minimaal 10 tekens af vóór afsluiten (`:355`) — goede metacognitieve afsluiting.

### ⚠️ Aandachtspunten
- **Criterium 3 — impliciete leerdoelen, geen expliciete array**: `getMissionGoal('ipad-print-instructies')` levert 1 `primaryGoal`-zin (`src/config/missionGoals.ts:376`), geen `learningObjectives`-array met per-scenario doelen.
  - **Voorstel:** de primaryGoal-zin zelf is goed geformuleerd ("Ik print vanaf een iPad door de juiste app, printer en stappen te gebruiken") — zie echter het blocking-punt hieronder, want deze zin beschrijft niet wat de missie werkelijk laat doen.

### ❌ Blocking issues
- **Criterium 2 (SLO-fit) + inhoud-mismatch — de missie-metadata belooft een iPad/app-flow, het component levert een generieke desktop-printerquiz.** Dit loopt door meerdere bestanden:
  - `src/config/missionGoals.ts:376`: *"Ik print vanaf een iPad door de juiste app, printer en stappen te gebruiken"*, criteria: *"Je installeert of opent de printapp, kiest printerinstellingen en test de print."*
  - `src/config/missionPreviewConfig.ts:35`: *"iPad printen"*, subtitle *"App installeren en eerste print versturen"*, chips `['iPad', 'RICOH', 'Print']`.
  - `src/config/agents/year1.tsx:738-749`: *"Leer printen vanaf je iPad"*, `problemScenario: 'Je hebt een werkstuk af en wilt het printen.'`, `missionObjective: 'Volg de instructies in de Boeken-app.'`
  - `src/config/basisvaardigheden-mapping.ts:110-112`: *"Leerling leest en volgt instructies voor printen vanaf een iPad."*
  - `src/features/student/ProjectZeroDashboard.tsx:134`: *"Leer stap-voor-stap printen vanaf je iPad met de RICOH myPrint app."*
  - **Wat er werkelijk gebeurt in `PrintInstructiesMission.tsx`:** 5 multiple-choice troubleshoot-scenario's over een generieke (Windows/desktop) printer — WiFi-verbinding, kleureninstelling, papierformaat (Letter vs. A4), aantal kopieën, marges/schaal. Geen iPad, geen app-installatie, geen inlogstap, geen RICOH myPrint komt ergens in het component voor.
  - **Waarom dit blocking is:** de leerling en de docent krijgen op vijf plekken in het platform (dashboard-tegel, agent-briefing, basisvaardigheden-mapping, missiedoel) een concrete belofte over een specifiek, praktisch toestel-scenario (iPad + RICOH myPrint app installeren en inloggen) die de missie niet nakomt. Voor een `MH1A`-klas (ondersteuningsklas, `classRestriction`) is dit extra gevoelig: als deze leerlingen echt met een schoolprinter/iPad moeten leren omgaan, oefenen ze hier het verkeerde ding. Docentrapportage die op basis van `basisvaardigheden-mapping.ts` concludeert dat een leerling "printen vanaf een iPad" beheerst, is feitelijk onjuist.
  - **Dit is geen mechanische fix** — het vergt een productbeslissing: óf de missie herbouwen als een echte iPad/RICOH-instructieflow, óf alle vijf metadata-bronnen herschrijven naar wat de quiz daadwerkelijk oefent (generieke printer-troubleshooting, apparaat-onafhankelijk). Zie escalatie hieronder.

### SLO-fit oordeel
- **21A (Digitale systemen):** sterk geraakt qua *categorie* (printerinstellingen, connectiviteit, apparaatbeheer zijn onmiskenbaar 21A-materie) — maar het specifieke, beloofde device-scenario (iPad + RICOH-app) wordt niet geoefend. Bewijs: zie blocking-punt hierboven.

### Score
6/8 criteria volledig geslaagd, 1 met aandachtspunt, 1 blocking · Bloom-balans: **passend** (consistent toepassen-niveau) · Aanbeveling: **fix-eerst** (inhoud-metadata-mismatch moet eerst opgelost)

---

## 🔧 Tech review — 8/10

**Dynamic verificatie:** niet uitgevoerd — geen dev-server/Chrome-plugin sessie beschikbaar binnen deze review-pass (alleen statische code-analyse volgens opdracht).

### Static analyse

#### ✅ Geslaagd
- **A1 (knop-handlers):** elke `<button>` heeft een functionele `onClick`, geen dode knoppen aangetroffen.
- **A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore`/`@ts-expect-error`; `Props`, `Option`, `Scenario`, `PrintTroubleshooterState` zijn expliciet getypeerd (`PrintInstructiesMission.tsx:20-51`).
- **A4 (imports via `@/*`):** alle imports gebruiken de alias (`@/types`, `@/hooks/useMissionAutoSave`, `@/config/missionGoals`, `@/features/missions/templates/shared/IntroScreen`) — `:15-18`.
- **A5 (edge function calls):** n.v.t. — component doet geen `supabase.functions.invoke` of vergelijkbare AI-call.
- **A6 (restart-safe state):** gebruikt `useMissionAutoSave` rechtstreeks, geen tussenlaag (`:196-207`) — voortgang overleeft een refresh.
- **A7 (security):** geen `dangerouslySetInnerHTML`, geen client-side `systemInstruction`, geen AI-chat-integratie in deze missie — niets om te sanitizen.
- **State-logica correct:** `handleAnswer` blokkeert dubbele antwoorden via `if (showFeedback) return;`, `attemptsPerScenario` en `correctScenarios` worden consistent bijgewerkt via functionele `setState`-updates zonder stale-closure risico (`:220-242`).

### ⚠️ Aandachtspunten
- **Ongebruikte `vsoProfile`-prop**: `Props` declareert `vsoProfile?: VsoProfile` (`:23`) en `AuthenticatedApp.tsx` geeft 'm door (`vsoProfile={user?.stats?.vsoProfile}`), maar het component destructureert alleen `{ onBack, onComplete }` (`:195`) — de prop wordt nergens gelezen.
  - **Risico:** geen functionele bug (TypeScript/React accepteert een ongebruikte prop stilzwijgend), maar voor een `MH1A`-restricted, VSO-relevante missie is dit een gemiste kans op VSO-specifieke aanpassing (bv. eenvoudiger taal, extra scaffolding) die andere handcrafted missies in deze repo wél toepassen.
  - **Voorstel:** ofwel de prop daadwerkelijk gebruiken voor VSO-aanpassing, ofwel — als bewust niet nodig — laten staan zoals nu (geen actie vereist, alleen noteren).

### ❌ Blocking issues
- Geen. Geen security-gaten, geen RLS-bypass, geen edge-function-crash-risico aangetroffen.

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd — deze review-pass had geen browsertoegang/dev-server. Alle visuele/interactieve claims in de design-sectie zijn dienovereenkomstig gemarkeerd als "unverified".

### Score
Static: 7/8 criteria volledig geslaagd (1 aandachtspunt) · Dynamic: n.v.t. · Aanbeveling: **ship** (tech-laag zelf is schoon; blokkade zit in didactiek/design, niet in tech)

---

## Voorstellen

### Voorstel-blok 1 — dode hover-states herstellen (3 plekken)

```tsx
// ❌ Huidig — PrintInstructiesMission.tsx:522-528 (identiek patroon op :547-553 en :353-364)
<button
    onClick={handleRetry}
    className="w-full py-4 rounded-full font-black uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-duck-acid"
    style={{ backgroundColor: '#ff3c21', color: '#FFFFFF', fontFamily: "'Outfit', system-ui, sans-serif" }}
    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ff3c21')}
    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ff3c21')}
>
    <RotateCcw size={18} /> Probeer opnieuw
</button>

// ✅ Voorgesteld
<button
    onClick={handleRetry}
    className="w-full py-4 rounded-full font-black uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-duck-acid"
    style={{ backgroundColor: '#ff3c21', color: '#FFFFFF', fontFamily: "'Outfit', system-ui, sans-serif" }}
    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e0350f')}
    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ff3c21')}
>
    <RotateCcw size={18} /> Probeer opnieuw
</button>
```
Pas dezelfde `onMouseEnter`-kleurwijziging toe op de knoppen op `:547-553` (Volgende/Resultaat) en `:353-364` ("Terug naar Mission Control", alleen als `reflectie.length >= 10`).

### Voorstel-blok 2 — `aria-label` op icon-only terugknop

```tsx
// ❌ Huidig — PrintInstructiesMission.tsx:380-388
<button
    onClick={onBack}
    className="p-2 transition-colors"
    style={{ color: '#6f6e69' }}
    onMouseEnter={e => (e.currentTarget.style.color = '#202023')}
    onMouseLeave={e => (e.currentTarget.style.color = '#6f6e69')}
>
    <ArrowLeft size={24} />
</button>

// ✅ Voorgesteld
<button
    onClick={onBack}
    aria-label="Terug naar Mission Control"
    className="p-2 transition-colors"
    style={{ color: '#6f6e69' }}
    onMouseEnter={e => (e.currentTarget.style.color = '#202023')}
    onMouseLeave={e => (e.currentTarget.style.color = '#6f6e69')}
>
    <ArrowLeft size={24} />
</button>
```

### Voorstel-blok 3 — zichtbare focus-state op antwoordknoppen

```tsx
// ❌ Huidig — PrintInstructiesMission.tsx:461-465
<button
    key={option.id}
    onClick={() => handleAnswer(option.id)}
    disabled={showFeedback}
    className="w-full p-4 rounded-2xl text-left transition-all duration-300"

// ✅ Voorgesteld
<button
    key={option.id}
    onClick={() => handleAnswer(option.id)}
    disabled={showFeedback}
    className="w-full p-4 rounded-2xl text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-duck-acid"
```

### Voorstel-blok 4 — reflectie-textarea koppelen aan label

```tsx
// ❌ Huidig — PrintInstructiesMission.tsx:341-350
<div className="flex items-center gap-2">
    <Sparkles size={16} style={{ color: '#ff3c21' }} />
    <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#ff3c21', fontFamily: "'Outfit', system-ui, sans-serif" }}>Reflectie</p>
</div>
<p className="text-xs" style={{ color: '#6f6e69', fontFamily: "'Outfit', system-ui, sans-serif" }}>Wat heb je geleerd in deze missie? Waar zou je dit in het dagelijks leven tegenkomen?</p>
<textarea
    value={state.reflectie}
    onChange={e => setState(prev => ({ ...prev, reflectie: e.target.value }))}
    placeholder="Wat heb je geleerd? Waar kom je dit nog meer tegen?"

// ✅ Voorgesteld
<div className="flex items-center gap-2">
    <Sparkles size={16} style={{ color: '#ff3c21' }} />
    <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#ff3c21', fontFamily: "'Outfit', system-ui, sans-serif" }}>Reflectie</p>
</div>
<p className="text-xs" style={{ color: '#6f6e69', fontFamily: "'Outfit', system-ui, sans-serif" }}>Wat heb je geleerd in deze missie? Waar zou je dit in het dagelijks leven tegenkomen?</p>
<textarea
    aria-label="Reflectie: wat heb je geleerd in deze missie en waar kom je dit nog meer tegen?"
    value={state.reflectie}
    onChange={e => setState(prev => ({ ...prev, reflectie: e.target.value }))}
    placeholder="Wat heb je geleerd? Waar kom je dit nog meer tegen?"
```

---

## Samenvatting & verdict

De missie zelf — als generieke printer-troubleshoot-quiz — is didactisch degelijk gebouwd: passend Bloom-niveau, goede feedback per antwoord, ingebouwde tweede kans met puntenaftrek, verplichte reflectie. De technische laag is schoon: geen dode knoppen, geen `any`, correcte alias-imports, restart-safe state, geen security-issues.

Het echte probleem zit op het snijvlak van didactiek en product: **vijf onafhankelijke metadata-bronnen beloven een iPad + RICOH myPrint-installatie-en-inlogflow, terwijl het gebouwde component een apparaat-onafhankelijke desktop-printerquiz is.** Dat is geen losse copy-typo maar een structurele mismatch tussen wat het platform aan leerling en docent communiceert (dashboard, agent-briefing, basisvaardigheden-rapportage, missiedoel) en wat er daadwerkelijk geoefend wordt — extra gevoelig omdat de missie specifiek voor de `MH1A`-ondersteuningsklas is bedoeld. Daarnaast een cluster van kleine, mechanisch oplosbare toegankelijkheids- en design-issues (dode hover-states, ontbrekende `aria-label`s, ontbrekende focus-rings) die met de vier Voorstel-blokken hierboven direct te fixen zijn.

**Verdict: fix-eerst.** De vier design/tech-voorstellen zijn autoFixable binnen dit review-blok. De content-mismatch (iPad/RICOH-belofte vs. desktop-quiz-inhoud) vergt een productbeslissing van Yorin en wordt geëscaleerd.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
