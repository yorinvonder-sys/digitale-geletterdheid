# Missie-review: ai-beleid-brainstorm

**Datum:** 2026-08-25
**TemplateType:** handcrafted (agent-role wiring met custom preview-component `AiBeleidBrainstormPreview`)
**Bronnen:** `src/config/agents/year1.tsx` (agent-entry), `src/config/missionGoals.ts`, `src/config/slo-kerndoelen-mapping.ts`, `src/config/curriculum.ts`, `src/config/missionPreviewConfig.ts`, `src/config/agentRoleIds.ts`, `src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx`, `src/features/ai-lab/AiLab.tsx` (wiring)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review — 7/10

### ✅ Geslaagd
- **Tailwind tokens**: uitsluitend `duck-*` tokens (`duck-acid`, `duck-ink`, `duck-bg`, `duck-error`) — geen hardcoded hex, geen `lab-*` legacy-mix. `AiBeleidBrainstormPreview.tsx:297-751`.
- **Knop-clarity**: elke knop heeft label + icon, hover- en disabled-states (`hover:shadow-xl`, `disabled:opacity-50`), geen dode knoppen aangetroffen.
- **Copy-lengte (leerjaar 1)**: intro-tekst en categorie-prompts blijven ruim onder de 80/60-woordgrens.
- **Framer Motion**: `motion.div`/`AnimatePresence` steeds met `initial`/`animate` en functionele overgangen (fase-wissel, success-state), geen wrapper-spam.
- **Responsive**: geen vaste pixel-breedtes, `max-w-*` + `grid sm:grid-cols-2` voor de categorie-tegels.

### ⚠️ Aandachtspunten
- **Alle 4 categorieën zijn visueel identiek** — `color`, `bgColor` en `borderColor` zijn voor Regels, Mogelijkheden, Zorgen én Suggesties letterlijk hetzelfde (`'from-duck-acid to-duck-ink'` / `'bg-duck-ink'` / `'border-duck-ink'`) — `AiBeleidBrainstormPreview.tsx:96-131`. Alleen het icoon verschilt. Leerlingen kunnen categorieën niet op kleur scannen, wat het scherm met 4 bijna-identieke kaarten minder snel scanbaar maakt.
- **Icoon-contrast op de gradient**: de icoon-container gebruikt `bg-gradient-to-br from-duck-acid to-duck-ink` met `text-duck-ink` (bijna-zwart icoon op een bijna-zwart eind van de gradient) op de categorie-tegels (`:483`) én in de idee-lijst (`:707`) — het icoon wordt op het `duck-ink`-uiteinde van de gradient nagenoeg onzichtbaar. In de submit-header (`:523`) wordt voor dezelfde badge juist `text-white` gebruikt — inconsistent én ook daar laag contrast tegen het `duck-acid`-uiteinde.
  - **Voorstel:** kies per categorie een vast (niet-verlopend) tokenpaar met voldoende contrast, bv. `bgColor: 'bg-duck-acid'` + `iconColor: 'text-duck-ink'` voor lichte kaarten, en differentieer categorieën via een tweede token (bv. `duck-error` voor "Zorgen") in plaats van een gedeelde gradient.

### N.v.t.
- Criterium 2 (layout-consistentie binnen templateType): n.v.t. — handcrafted, geen template-baseline.
- Visual Precision Gate: **unverified** — geen dev-server/Chrome-plugin-sessie in deze pass; alleen statische code-analyse. Dynamische viewport-verificatie ontbreekt.

---

## 📚 Didactiek review — 6/10

### ✅ Geslaagd
- **SLO-codes correct**: `21D` (AI) + `23C` (Maatschappij), VSO `20B` — geldige codes, logische fit voor een missie over schoolbeleid rond AI (`slo-kerndoelen-mapping.ts:53`).
- **Leerdoelen expliciet aanwezig** in `missionGoals.ts:135-142`: `primaryGoal` met actiewerkwoord ("Ik bedenk … en onderbouw waarom"), `criteria` en `evidence` zijn concreet geformuleerd, geen vage "begrijpt/kent"-taal.
- **Curriculum-plek**: leerjaar 1, week 2 — logisch vroeg in het jaar voor een introductie-brede AI-beleidsmissie (`slo-kerndoelen-mapping.ts:53`, `curriculum.ts:88`).
- **Kwaliteitsdrempel op input**: `isCompleteRuleIdea` (component-regels 66-79) dwingt een minimale tekstlengte, een reden-woord (omdat/want/…) én schoolcontext af — voorkomt dat leerlingen de missie met twee losse woorden afronden. Goed mechanisme tegen oppervlakkig contact met het kerndoel.

### ⚠️ Aandachtspunten
- **Leerdoel-claim vs. afrondingsgate mismatch**: de comment in `missionGoals.ts:131-134` noemt drie impliciete leerdoelen — (1) minstens één voordeel én één risico benoemen, (2) een concrete schoolregel formuleren, (3) ideeën van anderen evalueren door te stemmen en toe te lichten. De daadwerkelijke afrondingsgate in de component (`AiBeleidBrainstormPreview.tsx:626-627`, `canComplete = ownRuleIdeas.length >= 2`) toetst uitsluitend leerdoel (2). Leerdoel (1) — categorieën "Mogelijkheden" en "Zorgen" bezoeken — is volledig optioneel, en leerdoel (3) — stemmen — is nergens vereist om af te ronden (`votedIds` wordt bijgehouden maar niet in `canComplete` meegenomen).
  - **Risico**: een leerling kan de missie voltooien zonder ooit een voordeel of risico van AI te benoemen en zonder ooit te stemmen, terwijl `missionGoals.criteria.description` ("Je levert voorstellen, stemt of kiest, en legt je keuze uit") en de evidence-claim ("minimaal twee concrete AI-regels met reden en schoolsituatie") dat wel suggereren.
  - **Voorstel:** ofwel de config-claim versmallen tot wat werkelijk wordt afgedwongen (zie Voorstellen-sectie), ofwel — buiten de whitelist van deze pass — de component-gate uitbreiden met een stem-vereiste en minstens één idee in "mogelijkheden" of "zorgen".
- **Gevoelig onderwerp-check**: geen probleem — "AI-regels op school" is een neutraal, niet-emotioneel beladen onderwerp; geen doorverwijsgedrag nodig.

---

## 🔧 Tech review — 7/10

**Dynamic verificatie:** niet uitgevoerd — geen dev-server/Chrome-plugin beschikbaar in deze pass; uitsluitend statische code-analyse.

### ✅ Geslaagd
- **Knop-handlers**: alle interactieve elementen (`onClick`) zijn functioneel gekoppeld, geen dode knoppen aangetroffen.
- **Error/loading/empty states**: submit- en survey-flows tonen expliciete, leerling-vriendelijke foutmeldingen (`submitError`, `surveyError`, `contentError`) i.p.v. rauwe errors; `loading`-state bij `getAiBeleidIdeeen`; empty-state "Nog geen ideeën" (`:689-692`).
- **TypeScript-discipline**: geen `any`/`@ts-ignore`, props volledig getypeerd via `AiBeleidBrainstormPreviewProps`.
- **Imports via alias**: consistent `@/services/...`, `@/types`, `@/features/...` — geen relatieve `../../`-paden.
- **Security**: geen `dangerouslySetInnerHTML`; `systemInstruction` staat server-side (agent-role via `roleId`), niet client-side hardcoded voor de daadwerkelijke AI-interactie (de client-tekst in `year1.tsx:3463-3485` is uitsluitend een fallback-uitleg als een leerling per ongeluk de chat start — de missie zelf draait niet via chat).

### ⚠️ Aandachtspunten
- **Content-filter regex mist woordgrens aan het einde** — `AiBeleidBrainstormPreview.tsx:50`: `new RegExp(\`\\b${word}\`, 'i')` checkt alleen een woordgrens vóór het trefwoord, niet erna. Daardoor blokkeert `'geweld'` ook het volkomen onschuldige en veelgebruikte woord **"geweldig"** ("Ik vind dit een geweldig idee!"), `'vals'` blokkeert "valselijk"/"toevallig"-achtige samenstellingen, en `'pijn'` blokkeert ook "pijnloos". Dit is een reële false-positive die leerlingen actief frustreert bij het indienen van een legitiem, positief idee.
  - **Risico**: leerling schrijft een goedbedoelde, on-topic bijdrage, krijgt "Je idee bevat ongepaste taal" te zien, en moet raden welk woord het triggerde (de UI toont niet welk woord matchte).
  - **Voorstel**: sluit de regex af met een tweede `\b` (zie Voorstellen-sectie). Buiten scope van deze pass (component-bestand valt niet binnen de auto-fix whitelist van deze review-ronde), maar wel blocking-relevant voor een aparte fix-taak.
- **`handleVote` heeft geen foutstatus** (`:246-261`): als `stemOpIdee` faalt, gebeurt er stilzwijgend niets — geen `submitError`-achtige melding voor de leerling. Kleinere inconsistentie t.o.v. de rest van de foutafhandeling in dit bestand.

### ❌ Blocking issues
- Geen.

### Score
Static: 7/10 · Dynamic: n.v.t. (geen dev-server) · Aanbeveling: fix-eerst

---

## Voorstellen

### 1. missionGoals.ts — claim uitlijnen met daadwerkelijk afgedwongen gate (whitelist, autoFixable)

**Bestand:** `src/config/missionGoals.ts` (entry `ai-beleid-brainstorm`, regel 135-142)

**Voor:**
```ts
'ai-beleid-brainstorm': {
    primaryGoal: 'Ik bedenk bruikbare AI-afspraken voor school en onderbouw waarom ze nodig zijn.',
    criteria: {
        type: 'component-complete',
        description: 'Je levert voorstellen, stemt of kiest, en legt je keuze uit.',
    },
    evidence: 'Je hebt minimaal twee concrete AI-regels met reden en schoolsituatie.',
},
```

**Na:**
```ts
'ai-beleid-brainstorm': {
    primaryGoal: 'Ik bedenk bruikbare AI-afspraken voor school en onderbouw waarom ze nodig zijn.',
    criteria: {
        type: 'component-complete',
        description: 'Je formuleert minimaal twee eigen AI-regels met een reden en een schoolsituatie erbij.',
    },
    evidence: 'Je hebt minimaal twee concrete AI-regels met reden en schoolsituatie.',
},
```

**Waarom dit klopt te doen als fix (i.p.v. de gate uitbreiden):** de `description` claimde ook stemgedrag ("stemt of kiest"), terwijl `canComplete` in de component uitsluitend `ownRuleIdeas.length >= 2` toetst — stemmen is nooit vereist. De tekstuele claim aanpassen is de mechanische, whitelist-conforme fix; het daadwerkelijk toevoegen van een stem-vereiste (of een verplicht bezoek aan "Mogelijkheden"/"Zorgen") vereist een wijziging in `AiBeleidBrainstormPreview.tsx`, buiten de scope/whitelist van deze review-pass — apart oppakken als vervolgtaak.

### 2. Content-filter woordgrens (buiten whitelist — vervolgtaak, niet auto-fixable in deze pass)

**Bestand:** `src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx:50` (niet in de whitelist van deze review-ronde; hier alleen als concreet voorstel voor een aparte fix-taak)

**Voor:**
```ts
const regex = new RegExp(`\\b${word}`, 'i');
```

**Na:**
```ts
const regex = new RegExp(`\\b${word}\\b`, 'i');
```

---

## Samenvatting & verdict

De missie is functioneel compleet en veilig opgezet: geen dode knoppen, nette error/loading/empty-states, correcte SLO-koppeling en een expliciete, meetbare leerdoel-formulering. Twee reële kwaliteitsissues verdienen aandacht vóór verdere polish: (1) de afrondingsgate in de component toetst maar één van de drie gedocumenteerde leerdoelen (regel-formulering), terwijl stemmen en het verkennen van voordelen/risico's optioneel blijven ondanks de suggestie in de config-tekst — hiervoor is de config-tekst nu bijgesteld; een eventuele gate-uitbreiding blijft een aparte, niet-mechanische taak. (2) De content-filter blokkeert door een ontbrekende sluitende woordgrens ook onschuldige woorden zoals "geweldig" — een reële false-positive die buiten de whitelist van deze review-ronde valt maar wel een concrete, kleine fix heeft.

Geen blocking issues op design of tech; verdict **fix-eerst** vanwege de leerdoel/gate-mismatch en de content-filter false-positive, beide met een concreet, klein voorstel klaarliggend.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
