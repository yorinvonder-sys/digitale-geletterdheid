# Missie-review: Game Programmeur

**Mission ID:** game-programmeur
**Template:** agent-role / AiLab + GamePreview
**Curriculum-plek:** Leerjaar 1, Periode 2 — AI & Creatie
**Aanvraag-context:** gebruiker noemde Leerjaar 1, Periode 1; broncode plaatst deze missie in Periode 2
**Datum:** 2026-05-08
**Reviewer-pipeline:** dgskills-mission-review (Codex GPT-5.5)

---

## 🎨 Design review

**Mission:** game-programmeur (agent-role / AiLab + GamePreview)
**Reviewer:** dgskills-design-reviewer (Codex)

### ✅ Geslaagd

- **Layout consistentie:** De missie gebruikt de standaard AiLab-flow: eerst briefing, daarna chatkolom plus previewkolom. De preview wordt alleen voor `game-programmeur` gerenderd en krijgt undo/reset/publiceer-acties in dezelfde werkruimte. — `components/AiLab.tsx:900`, `components/AiLab.tsx:1081`, `components/AiLab.tsx:1274`
- **Responsive basis:** De hoofdflow schakelt op desktop naar twee kolommen (`md:flex-row`) en houdt panelen met `min-h-0`/`min-w-0` stabiel binnen de viewport. — `components/AiLab.tsx:1081`, `components/AiLab.tsx:1084`, `components/AiLab.tsx:1263`
- **Briefing-copy is kort genoeg voor leerjaar 1:** De probleemtekst, missie-objective en vijf stapbeschrijvingen blijven kort en concreet. — `config/agents/year1.tsx:1021`, `config/agents/year1.tsx:1023`, `config/agents/year1.tsx:1088`
- **Visuele preview past bij de missie:** De agent-card toont meteen score, speler, obstakel en `player.jump()`, waardoor de leerling voor start al snapt dat dit om gamecode gaat. — `config/agents/year1.tsx:1029`
- **Start-overlay is mobiel bruikbaar:** De game-preview heeft compacte instructies, responsive padding en een grote startknop. — `components/GamePreview.tsx:525`, `components/GamePreview.tsx:543`, `components/GamePreview.tsx:560`

### ⚠️ Aandachtspunten

- **Criterium 1 — Hardcoded kleuren naast bestaande lab-tokens:** `GamePreview` gebruikt veel inline hex-styles terwijl `tailwind.shared.js` dezelfde kleuren als `lab.*` tokens definieert. Dat maakt de missie moeilijker consistent te themen. — `tailwind.shared.js:6`, `components/GamePreview.tsx:341`, `components/GamePreview.tsx:343`, `components/GamePreview.tsx:454`
  - **Wat:** UI-kleuren staan verspreid als inline styles.
  - **Waarom:** Nieuwe thema's of VSO-weergaven moeten dan meerdere plekken handmatig wijzigen.
  - **Voorstel:**

```tsx
// Huidig — components/GamePreview.tsx:341
<div className="w-full h-full flex flex-col relative" style={{ backgroundColor: '#FCF6EA', borderLeft: '1px solid #E7D8BD' }}>

// Voorgesteld
<div className="w-full h-full flex flex-col relative bg-lab-cream border-l border-lab-line">
```

- **Criterium 3 + 7 — Mobiele icon-only knoppen missen labels/focus-rings:** Opslaan, undo, reset en herstart hebben op mobiel alleen een icoon of `title`, maar geen `aria-label` en geen zichtbare `focus-visible`-ring. — `components/GamePreview.tsx:377`, `components/GamePreview.tsx:402`, `components/GamePreview.tsx:415`, `components/GamePreview.tsx:428`
  - **Wat:** Toetsenbord- en screenreadergebruikers krijgen minder duidelijke bediening.
  - **Waarom:** `title` is geen betrouwbaar toegankelijkheidslabel.
  - **Voorstel:**

```tsx
// Huidig — components/GamePreview.tsx:428
<button onClick={handleReload} className="transition-all p-1.5 rounded-lg active:scale-95">

// Voorgesteld
<button
  onClick={handleReload}
  aria-label="Herstart game-preview"
  className="transition-all p-1.5 rounded-lg active:scale-95 hover:bg-lab-creamDeep focus-visible:ring-2 focus-visible:ring-lab-primary"
>
```

- **Criterium 3 — Hover-states zijn vaak niet zichtbaar:** De headerknoppen hebben `transition-all` en `active:scale-95`, maar nauwelijks hover-feedback. Dat is vooral merkbaar bij Galerij, Publiceren en Opslaan. — `components/GamePreview.tsx:353`, `components/GamePreview.tsx:366`, `components/GamePreview.tsx:379`
  - **Wat:** Leerlingen zien minder goed welke actie actief is.
  - **Waarom:** Dit zijn primaire productacties in de gameflow.
  - **Voorstel:** voeg `hover:bg-lab-creamDeep hover:text-lab-ink focus-visible:ring-2 focus-visible:ring-lab-primary` toe aan alle kleine actiekoppen.

### ❌ Blocking issues

Geen blocking design-issues gevonden.

### Score

5/7 criteria geslaagd · 3 aandachtspunten · 0 blocking · Aanbeveling: fix-eerst

---

## 📚 Didactiek review

**Mission:** game-programmeur (agent-role / AiLab + GamePreview)
**Curriculum-plek:** Leerjaar 1, Periode 2
**SLO-claim:** 22A, 22B | VSO: 19A
**Reviewer:** dgskills-didactiek-reviewer (Codex)

### ✅ Geslaagd

- **Criterium 1 — SLO-codes correct:** `22A` en `22B` zijn geldige reguliere SLO-codes; `19A` is geldige VSO-mapping. De missie heeft twee reguliere codes, dus geen overtagging. — `config/slo-kerndoelen-mapping.ts:45`
- **Criterium 2 — SLO-fit voor digitaal product:** De leerling maakt een speelbare remix en ziet direct effect in een live preview. Dat past goed bij `22A`. — `config/agents/year1.tsx:1023`, `components/AiLab.tsx:1274`
- **Criterium 4 — Opdracht-beknoptheid:** De vijf stappen zijn elk één concrete actie rond kleur, fysica, snelheid, geluid en uiterlijk. — `config/agents/year1.tsx:1088`
- **Criterium 5 — Leeftijds-passend:** De taal is direct en concreet voor 12-15 jaar: variabelen als `jumpForce` en `gravity` worden gekoppeld aan zichtbaar spelgedrag. — `config/agents/year1.tsx:1095`, `config/agents/year1.tsx:1149`
- **Criterium 9 — Welzijn & inclusiviteit:** Het algemene welzijnsprotocol is aanwezig in de gedeelde agent-instructies; deze missie bevat geen gevoelig thema dat extra verwijzing vereist. — `config/agents/shared.tsx:84`

### ⚠️ Aandachtspunten

- **Criterium 6 — Aanvraag noemt Periode 1, broncode zegt Periode 2:** Periode 1 bevat basisvaardigheden (`magister-master` t/m `print-pro`); `game-programmeur` staat in Periode 2 onder AI & Creatie. — `config/curriculum.ts:61`, `config/curriculum.ts:66`, `config/curriculum.ts:80`, `config/curriculum.ts:87`
  - **Wat:** Reviewscope is eenduidig `game-programmeur`, maar de gevraagde periode klopt niet met de bron.
  - **Waarom:** Voor planning, dashboards en pilotcommunicatie moet de plek exact zijn.
  - **Voorstel:** behoud `game-programmeur` in P2, of voeg expliciet een school-override toe als deze voor een pilot in P1 moet verschijnen.

- **Criterium 3 — Leerbewijs is niet meetbaar genoeg:** De missie zegt dat leerlingen uiterlijk, besturing en moeilijkheid veranderen én uitleggen waarom; de doeltrigger is alleen `message-count` met minimum 4. — `config/agents/year1.tsx:1027`, `config/agents/year1.tsx:1028`, `components/AiLab.tsx:315`
  - **Wat:** Vier chatberichten kunnen het doel halen zonder aantoonbare codewijziging of reflectie.
  - **Waarom:** Docenten zien dan voortgang zonder hard bewijs dat de leerling de spelregel begrijpt.
  - **Voorstel:**

```ts
// Huidig — config/agents/year1.tsx:1028
goalCriteria: { type: 'message-count', min: 4 },

// Voorgesteld
goalCriteria: { type: 'steps-complete', min: 5 },
```

- **Criterium 2 + 7 — 22B is deels oppervlakkig als AI alle code schrijft:** De systeeminstructie dwingt de AI complete HTML terug te geven; de leerling hoeft vooral te prompten. Dat is bruikbaar als kennismaking, maar de programmeerclaim wordt sterker als leerlingen minimaal één codevariabele aanwijzen en hun effect uitleggen. — `config/agents/year1.tsx:1055`, `config/agents/year1.tsx:1065`, `config/agents/year1.tsx:1149`
  - **Wat:** De leerling kan succesvol zijn zonder broncode actief te lezen.
  - **Waarom:** `22B` vraagt computationele denkstrategieën, niet alleen AI laten aanpassen.
  - **Voorstel:** voeg per stap een korte reflectie toe: "Welke variabele veranderde? Wat deed dat in de game?"

### ❌ Blocking

- **Voortgangscontract past niet op deze missie:** `game-programmeur` heeft 5 stappen, maar de gedeelde agent-instructie noemt expliciet stapmarkers 1, 2 of 3. De algemene auto-complete logica vereist juist dat alle 5 stappen voltooid zijn. — `config/agents/year1.tsx:1088`, `config/agents/shared.tsx:64`, `config/agents/shared.tsx:71`, `components/AiLab.tsx:266`
  - **Wat:** De missie kan didactisch afgerond lijken, terwijl platform-completion onbetrouwbaar blijft.
  - **Waarom:** Dit raakt leerlingmotivatie, docentrapportage en XP-beloning.
  - **Voorstel:** maak de marker-instructie missiespecifiek voor 5 stappen, of reduceer de missie naar 3 echte mijlpalen.

### N.v.t.

Geen didactische criteria zijn volledig n.v.t.; AI-as-copilot is actief, omdat deze missie via de agent-chat loopt.

### SLO-fit oordeel

- **22A Digitale producten:** sterk geraakt — leerling maakt/remixt een concreet digitaal product met preview en publicatiemogelijkheid.
- **22B Programmeren:** redelijk geraakt — variabelen, loop en gamegedrag zijn aanwezig, maar het bewijs van eigen programmeerdenken is nog te afhankelijk van chatberichten.
- **19A VSO:** redelijk geraakt — concreet maken en testen van een digitaal product past, mits de flow met minder stappen of betere scaffolding betrouwbaar afrondt.

### Score

5/9 geslaagd · 3 aandachtspunten · 1 blocking · Bloom-balans: medium · Aanbeveling: fix-eerst

---

## 🔧 Tech review

**Mission:** game-programmeur (agent-role / AiLab + GamePreview)
**Reviewer:** dgskills-tech-reviewer (Codex)
**Dynamic verificatie:** uitgevoerd — Google Chrome desktop via lokale devserver

### Static analyse

#### ✅ Geslaagd

- **A1 — Knop-handlers gekoppeld:** De hoofdacties in de preview hebben functionele handlers: starten, publiceren, opslaan, undo, reset en reload. — `components/GamePreview.tsx:214`, `components/GamePreview.tsx:219`, `components/GamePreview.tsx:257`, `components/GamePreview.tsx:402`, `components/GamePreview.tsx:415`, `components/GamePreview.tsx:428`
- **A2 — Error/loading states:** De preview heeft loading, lang-laden retry, publish/save errors en vervangflow bij volle bibliotheek. — `components/GamePreview.tsx:27`, `components/GamePreview.tsx:647`, `components/GamePreview.tsx:731`, `components/GamePreview.tsx:771`
- **A5 — Edge/AI-calls hebben sanitizing en rate limiting:** AI-berichten gaan via `sanitizePrompt`, client-rate-limit en authenticated edge requests; responses worden voor chatrendering met DOMPurify opgeschoond. — `services/geminiService.ts:241`, `services/geminiService.ts:247`, `services/geminiService.ts:260`, `hooks/useAgentLogic.ts:812`
- **A6 — Restart-safe state:** Gamecode wordt geladen uit `mission_progress`, valt terug op `initialCode`, en autosavet na wijzigingen. — `hooks/useAgentLogic.ts:327`, `hooks/useAgentLogic.ts:341`, `hooks/useAgentLogic.ts:367`
- **A7 — Sandbox rond leerling/AI-code:** De game draait als blob-iframe zonder `allow-same-origin`, en inkomende previewberichten worden op `event.source` en origin gevalideerd. — `components/GamePreview.tsx:145`, `components/GamePreview.tsx:147`, `components/GamePreview.tsx:465`, `components/GamePreview.tsx:472`

#### ⚠️ Aandachtspunten

- **A2 — Init-call naar AI is unawaited:** Bij start van `game-programmeur` wordt `session.sendMessage(...)` aangeroepen zonder `await` of `.catch()`. Als de edge call faalt, kan dat als stille unhandled promise eindigen. — `hooks/useAgentLogic.ts:302`, `hooks/useAgentLogic.ts:304`
  - **Risico:** Onnodige AI-call op missie-open en moeilijk te debuggen initfouten.
  - **Voorstel:**

```ts
// Huidig — hooks/useAgentLogic.ts:303
session.sendMessage({ message: `Hier is de start-code van de game: \n\n ${selectedRole.initialCode}` });

// Voorgesteld
session.setGameContext(selectedRole.initialCode);
```

- **A3 — TypeScript-discipline:** `catch (error: any)` en meerdere `any`-casts blijven in de missiepad zichtbaar. Niet direct blokkerend, maar het verlaagt typezekerheid in een AI/codepad. — `components/GamePreview.tsx:241`, `components/AiLab.tsx:133`, `services/missionService.ts:4`
  - **Risico:** Foutobjecten en opgeslagen payloads blijven te breed getypeerd.
  - **Voorstel:** gebruik `unknown` in catch-blokken en smalle interfaces voor `MissionProgressData`.

- **A7 — Publiceren mist kwaliteits-/dubbelcheck:** `hasUserPublishedGame` bestaat, maar `handlePublish` gebruikt alleen `publishGame`. Daardoor kan een leerling de ongewijzigde startgame of dezelfde game meerdere keren publiceren. — `services/gameGalleryService.ts:151`, `components/GamePreview.tsx:219`
  - **Risico:** Galerijvervuiling en minder betrouwbaar leerbewijs.
  - **Voorstel:** check minimaal verschil met startcode en roep `hasUserPublishedGame` aan vóór publicatie.

#### ❌ Blocking

- **Completion-event en step-completion zijn niet sluitend:** `GamePreview` toont de missieconclusie alleen bij `GAME_COMPLETE`, maar de startergame post `gameScore` en `gameOver`, niet `GAME_COMPLETE`. Tegelijkertijd vereist `AiLab` alle stappen voor missievoltooiing, terwijl de gedeelde marker-instructie op 1-3 stuurt. — `components/GamePreview.tsx:139`, `components/GamePreview.tsx:150`, `config/agents/year1.tsx:1288`, `config/agents/year1.tsx:1320`, `components/AiLab.tsx:270`, `config/agents/shared.tsx:71`
  - **Risico:** Leerlingen kunnen spelen en aanpassen, maar het platform kan completion inconsistent of niet registreren.
  - **Minimum-fix:** laat `goalCriteria` en auto-complete hetzelfde contract gebruiken, en laat de startergame na een duidelijke mijlpaal een `GAME_COMPLETE`-bericht sturen.

```js
// Voorgesteld in startergame na bv. eerste succesvolle score/aanpassingstest
window.parent.postMessage({ type: 'GAME_COMPLETE' }, '*');
```

### Dynamic verificatie

Uitgevoerd op 2026-05-08 in Google Chrome via de lokale devserver.

- Route: developer-profiel -> Leerling Dashboard -> Periode 2 -> Game Programmeur -> AI-mentor akkoord -> Live Game Preview.
- Positief: de missie opent, de split-view laadt, de startoverlay van de game is zichtbaar, en na `START DE GAME!` rendert de speelbare preview met score, speler, terrein en lucht. De game is dus niet blank of kapot in Chrome.
- Positief: de belangrijkste preview-acties zijn zichtbaar in de desktopweergave: Galerij, Publiceren, Opslaan, Reset en Herstart.
- Aandachtspunt: de groene onboarding-tooltip `Typ hieronder om de code te veranderen!` ligt visueel over stap 1 heen. Dat is niet blokkerend, maar het maakt de eerste opdrachtkaart rommeliger en kan de aandacht van de leerling wegtrekken.
- Aandachtspunt: in de sticky doelkaart wordt de lange doeltekst afgekapt met ellipsis. Dat houdt de layout netjes, maar het leerdoel is daardoor niet volledig zichtbaar zonder de briefing te lezen.
- Aanvullend getest: AI-prompt `Maak de speler blauw.` zet de UI op `Analyseren...` en de preview op `AI is bezig... CODE SCHRIJVEN`, maar de flow kwam niet betrouwbaar terug met een zichtbare aangepaste game of stapvoortgang. Bij heropenen stond de missie nog op `0/5`. Consolelog bevatte bovendien `[CloudLoad] Timeout for game-programmeur, using fallback`. Dit ondersteunt de static bevinding dat completion/AI-state nog niet robuust genoeg is. — `hooks/useAgentLogic.ts:302`, `hooks/useAgentLogic.ts:327`
- Aanvullend getest: opslaan naar bibliotheek opent een modal, blokkeert de knop tot er een naam is ingevuld, toont `Controleren...` en sluit zonder zichtbare foutmelding. Er was geen duidelijke succesbevestiging in beeld, dus dit is functioneel plausibel maar niet volledig bewijsbaar vanuit de missie-UI. — `components/GamePreview.tsx:250`, `components/GamePreview.tsx:380`
- Aanvullend getest: publiceren opent de modal `Deel je Game`, accepteert een gamenaam en maakt `Publiceer naar Galerij` actief. De definitieve publicatieklik is bewust niet uitgevoerd, omdat dat extern zichtbaar kan worden voor anderen. — `components/GamePreview.tsx:219`, `components/GamePreview.tsx:588`, `components/GamePreview.tsx:654`
- Aanvullend getest: `Bekijk games van klasgenoten` opent de `Game Galerij` met filters voor `Alle Missies`, `Game Programmeur`, `Verhalen Ontwerper` en `Chatbot Trainer`; bij geen klas/publicaties toont de lege staat `Nog geen games gepubliceerd`. — `components/GamePreview.tsx:354`, `components/GamePreview.tsx:761`, `components/GameGallery.tsx:34`
- Beperkt getest: echte tablet/mobile viewport is niet betrouwbaar afgerond. De Chrome-extensie gaf geen viewport-emulatie en het Chrome-venster kon in deze sessie niet veilig naar smalle breedtes worden gezet. De static responsive-basis blijft daarom een codebevinding, geen afgeronde device-check.

### Score

Static: 5/7 geslaagd · Dynamic: Chrome desktop deels geslaagd, maar AI-prompt/completion instabiel en responsive-devicecheck niet afgerond · Aanbeveling: kritieke fix voor AI/completion, daarna tooltip/doeltekst-polish

---

## Samenvatting

- **Geslaagd:** 15 criteria
- **Aandachtspunten:** 9 issues
- **Blocking:** 1 product-blocker rond missievoltooiing
- **Aanbeveling:** fix-eerst

### Top 3 issues

1. **Completion is niet betrouwbaar:** 5 missiestappen, gedeelde marker-instructie voor 1-3, auto-complete vereist alle stappen, en de game post geen `GAME_COMPLETE`. — `config/agents/year1.tsx:1088`, `config/agents/shared.tsx:71`, `components/AiLab.tsx:270`, `components/GamePreview.tsx:150`
2. **Leerbewijs is te zwak:** `message-count` kan het doel halen zonder aantoonbare codewijziging of reflectie. — `config/agents/year1.tsx:1028`, `components/AiLab.tsx:315`
3. **Aanvraag/periode mismatch:** de gebruiker vroeg Leerjaar 1 Periode 1, maar de missie staat in Periode 2. — `config/curriculum.ts:61`, `config/curriculum.ts:87`

### Self-check

Self-check passed:
- Codebevindingen en gekoppelde UI-testbevindingen hebben file:regel-anchors; pure Chrome-observaties zijn als runtimebewijs beschreven.
- Browserclaim is gebaseerd op uitgevoerde Chrome-checks op 2026-05-08; responsive-devicecheck is expliciet als beperkt/niet afgerond gemarkeerd.
- Samenvattingstelling sluit aan op de secties: 15 geslaagd, 9 aandachtspunten, 1 blocking.
- Geen placeholder-tokens achtergelaten.

### Demo-zin voor pilot/sales

Game Programmeur is een sterke demo van "leren door direct te maken": leerlingen veranderen een echte game met AI-coaching en zien hun codekeuzes meteen in actie, maar voor betrouwbare docentrapportage moet de completionlogica eerst worden aangescherpt.
