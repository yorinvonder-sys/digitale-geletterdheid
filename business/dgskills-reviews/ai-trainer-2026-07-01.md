# Missie-review: ai-trainer

**Datum:** 2026-07-01 · **Wave:** 7 (verse review) · **Template-type:** `agent-role` (AI-Lab werkbank, dedicated `TrainerMissionView`)

**Leveringspad:** `src/features/ai-lab/AiLab.tsx:1086-1089` rendert voor `selectedRole.id === 'ai-trainer'` een dedicated `<TrainerMissionView>` (chat als "commandobalk" onderaan, werkbank/preview boven). Géén dormante chat-rol — dit is een actief, recent geïntegreerd leveringspad (PR #178).

**Gereviewde bestanden:**
- `src/features/ai-lab/TrainerMissionView.tsx` (integratie-component)
- `src/features/ai-lab/previews/TrainerPreview.tsx` (werkbank-preview)
- `src/config/agents/year1.tsx:1529-1622` (agent-rol entry + client-side systemInstruction-kopie)
- `supabase/functions/_shared/systemInstructions.ts:28` (server-side, autoritaire systemInstruction)
- `src/hooks/useAgentLogic.ts:701,710,925-937` ([TRAIN_A]/[TRAIN_B]-parsing)
- `src/config/slo-kerndoelen-mapping.ts:46`
- `src/config/curriculum.ts:83` (leerjaar 1, periode 1)
- `src/config/missionGoals.ts:90-97`

**Visueel bewijs:** geen screenshots-map voor deze wave. Uit `docs/audits/student-missions-ui-ux-review-2026-06-30.md:122`: `ai-trainer` staat in de **top-10 sterkste missies** (gem. ≥4.0), naast `datalekken-rampenplan`, `game-programmeur`, `digital-storyteller`. Geen missie-specifieke kritieke bevinding in die audit — wel onderhevig aan de systeembrede issues (shared-shell KEES-afsnijding, CTA-kleur-standaardisatie, a11y-sweep) die audit-breed gelden, niet uniek voor deze missie.

---

## 🎨 Design review

**Mission:** ai-trainer (agent-role / dedicated component)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 3 (Knop-clarity):** alle knoppen (`onSend`, `onReset`, `onSuggestionClick`, `StartButton`) hebben functionele onClick + duidelijk label/icon + `aria-label` op icon-only knoppen — `src/features/ai-lab/TrainerMissionView.tsx:87-93,118-126,195-202`.
- **Criterium 5 (Responsive, statisch):** `TrainerMissionView` gebruikt `flex-1`/`min-h-0`/`shrink-0`-patroon zonder vaste pixel-widths; `line-clamp-2` voor coach-tekst voorkomt overflow op mobiel — `TrainerMissionView.tsx:70-73,117`.
- **Criterium 7 (Toegankelijkheid, basis):** `aria-expanded`, `aria-label`, `role="status"`/`aria-live="polite"` op loading-indicator aanwezig — `TrainerMissionView.tsx:90,120,148`.
- **Visual Precision Gate (gedeeltelijk, statisch):** de layout-structuur (doel-bovenbalk → werkbank → commandobalk) is coherent en compact; geen evidente overlap-constructies in JSX.

### ⚠️ Aandachtspunten

- **Criterium 1 (Tailwind token consistentie) — `visualPreview` gebruikt legacy `lab-*` tokens** — `src/config/agents/year1.tsx:1542-1564`
  - **Wat:** de kaart-preview in de missiekeuze (`visualPreview`) gebruikt `bg-lab-sage`, `border-lab-teal`, `bg-lab-creamDeep`, `text-lab-sage` (11 treffers) — geen enkele `duck-*` token.
  - **Waarom:** dit is puur de missiekeuze-kaart (niet de actieve werkbank), dus geen directe leerling-impact tijdens het spelen — maar wel inconsistent met het platformbreed migratiepatroon naar DUCK English.
  - **Voorstel:** bij een toekomstige duck-migratie-sweep van `year1.tsx` meenemen; is géén missie-specifieke fix (raakt het gedeelde bestand met alle jaar-1-rollen) — niet in `autoFixable` hieronder.

- **Criterium 1 — `TrainerPreview.tsx` gebruikt volledig inline hex i.p.v. Tailwind tokens** — `src/features/ai-lab/previews/TrainerPreview.tsx` (doorlopend, o.a. regel 11-16, 107, 206, 209)
  - **Wat:** geen enkele `duck-*` of `lab-*` Tailwind class; alle kleuren zijn inline `style={{ backgroundColor: '#f2f1ec' }}` etc. (`#202023`, `#f2f1ec`, `#6f6e69`, `#E7D8BD`, `#ff3c21`, `#e3e2dc`).
  - **Waarom:** dit is een herkend platformpatroon voor preview-componenten (vergelijkbaar met de `TrainerMissionView`-shell die wél `duck-*` classes gebruikt, `#f2f1ec`/`#202023` zijn toevallig de exacte duck-bg/duck-ink hexwaarden) — functioneel geen fout, maar het voorkomt dat een toekomstige token-rebrand (kleurwaarde wijzigen) deze preview automatisch meeneemt.
  - **Voorstel:** low-priority — vervang `backgroundColor: '#f2f1ec'` → `className="bg-duck-bg"` waar mogelijk. Grote oppervlakte (450 regels), dus **niet** als mechanische autoFix opgenomen; wel gesignaleerd voor een aparte opschoon-taak.

- **Visual Precision Gate: unverified** — geen screenshots-map beschikbaar voor deze wave; audit van 2026-06-30 bevestigt géén kritieke visuele bevinding specifiek voor `ai-trainer`, maar dat is 5 weken oud en dekt niet expliciet de `TrainerMissionView`-integratie (die dateert van PR #178, mogelijk ná die audit). Markeer als **WARN**, niet BLOCKING — geen concrete breukbewijs, wel ontbrekende recente dynamische verificatie.

### ❌ Blocking issues
- Geen.

### Score
3/7 criteria expliciet geslaagd, 2 warn (tokens), 1 unverified (visual gate), overige n.v.t./niet gecontroleerd zonder browser-toegang · **Aanbeveling: ship** (geen blocking issues, aandachtspunten zijn cosmetisch/onderhoud, geen leerling-impact)

---

## 📚 Didactiek review

**Mission:** ai-trainer (agent-role)
**Curriculum-plek:** Leerjaar 1, Periode 1 (`config/curriculum.ts:80-84`, week 2 volgens `slo-kerndoelen-mapping.ts:46`)
**SLO-claim:** `21D` (AI), `21C` (Data & Dataverwerking) + VSO `18C`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `21D` en `21C` zijn beide geldige regulier-VO-codes; `18C` is geldige VSO-code — `slo-kerndoelen-mapping.ts:46`. Inline comment (`// +21C: trainingsdata = dataverwerking`) onderbouwt de dubbele claim expliciet.
- **Criterium 2 (SLO-fit):** missie laat leerling daadwerkelijk trainingsdata verzamelen (21C) én een AI-model trainen/testen (21D) — geen oppervlakkig contact. De 3-3-test-flow (`systemInstructions.ts:28`) dwingt actieve dataverzameling af, geen passieve quiz.
- **Criterium 3 (Leerdoelen):** `missionGoals.ts:90-97` bevat een concreet, meetbaar `primaryGoal` ("Ik train een AI-model met voorbeelden en controleer of de uitkomst klopt") met actiewerkwoorden (train, controleer) en een `evidence`-veld dat vraagt naar aanwijsbare training-voorbeelden — voldoet aan Bloom-niveau toepassen/analyseren.
- **Criterium 6 (Curriculum-plek):** leerjaar 1, periode 1, naast `prompt-master`/`game-programmeur` — logische introductie-plek voor AI-concepten in de vroege onderbouw.
- **Criterium 8 (AI-as-copilot):** de server-side `systemInstructions.ts:28` implementeert expliciet de 3-stappen-methode (Erkenning → Uitleg → Challenge) plus XP-farming-detectie — AI doet niet het werk voor de leerling, stelt vragen en daagt uit.
- **Criterium 9 (Welzijn):** VSO-mapping aanwezig (`18C`); welzijnsprotocol staat in het gedeelde systemInstruction-suffix (niet missie-specifiek, gedeeld patroon).

### ⚠️ Aandachtspunten

- **Criterium 8/didactische drift — client-side en server-side systemInstruction zijn inhoudelijk uiteengelopen** — `src/config/agents/year1.tsx:1568-1604` vs. `supabase/functions/_shared/systemInstructions.ts:28`
  - **Wat:** de server-side versie (autoritair, daadwerkelijk actief) gebruikt "Class A/Class B" en bevat een expliciete Garbage-In-Garbage-Out-demonstratie waarbij de leerling gevraagd wordt een **opzettelijk fout** voorbeeld te geven ("Zeg eens dat een banaan van plastic is") om te laten zien dat de AI dan in de war raakt. De client-side kopie in `year1.tsx` gebruikt "Groep 1/Groep 2" en heeft **geen** instructie voor een opzettelijke fout-demonstratie — in plaats daarvan een strakkere 3-3-test-flow zonder de Garbage-In-Garbage-Out-praktijkdemo.
  - **Waarom:** dit is geen actief risico voor de leerling (het leveringspad gebruikt de server-side versie, bevestigd via `useAgentLogic.ts` → edge function → `systemInstructions.ts`), maar het is een **stille contentdrift**: een toekomstige onderhouder die `year1.tsx` aanpast in de veronderstelling dat dat de actieve tekst is, verandert niets aan wat de leerling ziet. Didactisch is de server-side versie ook rijker (bevat de kernles "Garbage In, Garbage Out" als hands-on demo i.p.v. alleen als vermelding).
  - **Voorstel:** bekend platformpatroon (client-side kopie in `year*.tsx` is legacy/decoratief, server is bron van waarheid) — dit is een **ai-endpoint-verificatie-escalatie**, geen missie-specifieke fix. Niet oplosbaar binnen scope van deze review zonder de gedeelde `year1.tsx`/`systemInstructions.ts`-synchronisatie-aanpak vast te stellen (raakt alle jaar-1-rollen, niet alleen ai-trainer).

- **Criterium 4 (Opdracht-beknoptheid):** server-side systemInstruction-kern (excl. gedeeld suffix met welzijnsprotocol/XP-farming/tips-format) is ca. 250 woorden functionele instructie. Dit is een AI-instructie (niet rechtstreekse leerling-copy) dus de leerjaar-1-grens (intro <80 woorden) is niet direct van toepassing — de leerling-zichtbare intro zit in `TrainerPreview.tsx:117-180` ("Welkom bij AI Trainer!" kaart), die kort en scanbaar is (geen lopende tekst >80 woorden, wel gestructureerde stappen-kaart). Geen bevinding, alleen ter context.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **21D (AI):** sterk geraakt — leerling traint en test een AI-model actief, ervaart supervised learning hands-on (`MissionConclusion` in `TrainerPreview.tsx:234-244` legt het concept expliciet uit na afronding).
- **21C (Data & Dataverwerking):** sterk geraakt — leerling verzamelt en categoriseert trainingsdata (classAItems/classBItems), ziet direct het effect van datakwaliteit op modelgedrag.

### Score
6/6 gecontroleerde criteria geslaagd, 1 aandachtspunt (contentdrift, geen actief risico) · Bloom-balans: **medium-hoog** (toepassen + analyseren via test-en-verbeter-cyclus) · **Aanbeveling: ship**

---

## 🔧 Tech review

**Mission:** ai-trainer (agent-role)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze reviewrun, geen screenshots-map beschikbaar voor deze wave.

### Static analyse

#### ✅ Geslaagd
- **A1 (Knop-handlers):** alle knoppen hebben functionele `onClick` — `TrainerMissionView.tsx:87,118,168,195`; `TrainerPreview.tsx:23` (`StartButton`), `224` (completion-knop).
- **A2 (Error states):** loading-state (`isLoading`/`thinkingStep`), error-state met gebruiksvriendelijk bericht (`{error}` in rode banner, niet raw error), empty-state in beide training-buckets (`data.classAItems.length === 0` → instructiekaart) — `TrainerMissionView.tsx:103-107`; `TrainerPreview.tsx:332-343,364-375`.
- **A3 (TypeScript-discipline):** geen `any`/`@ts-ignore` aangetroffen in `TrainerMissionView.tsx` of `TrainerPreview.tsx`; props volledig getypeerd via `TrainerMissionViewProps`/`TrainerPreviewProps` interfaces.
- **A4 (Imports via `@/*`):** consistent `@/types`, `@/features/ai-chat/ChatBubble`, `@/features/missions/shared/MissionWelcomeCard` — geen relatieve `../../`-paden.
- **A6 (Restart-safe state):** `activeTrainerData` wordt opgeslagen via `missionData.activeTrainerData` in `AiLab.tsx:352`, onderdeel van het gedeelde mission-save-pattern (niet lokaal-only state) — leerling verliest voortgang niet bij refresh.
- **A7 (Security — user input naar AI):** leerling-tekst gaat via de reguliere chat-pipeline (`onSend`/edge function), niet rechtstreeks naar DOM; geen `dangerouslySetInnerHTML` in beide componenten.
- **A7 (systemInstruction server-side):** de **actieve** systemInstruction komt uit `supabase/functions/_shared/systemInstructions.ts:28` (server-side, bevestigd via `chatCore.ts`-gebruik) — voldoet aan het gewenste patroon. Zie didactiek-sectie voor de client-side-kopie-kanttekening (bekend platformpatroon, geen tech-blocking issue conform reviewopdracht).

#### ⚠️ Aandachtspunten

- **A5 (Edge function calls) — niet direct verifieerbaar binnen `TrainerMissionView`/`TrainerPreview` zelf**
  - **Wat:** beide componenten zijn presentational (props-only, geen eigen `supabase.functions.invoke`-aanroep); de daadwerkelijke edge-function-call zit hoger in `AiLab.tsx`/`useAgentLogic.ts` (buiten de scope van deze missie-specifieke bestanden).
  - **Risico:** geen — dit is verwacht gedrag voor een gedeeld chat-transport-pattern, geen missie-specifiek gat.
  - **Voorstel:** geen actie nodig; correcte separation of concerns.

- **[TRAIN_A]/[TRAIN_B]/[PREDICT]-tag-parsing is regex-based, geen strikte validatie** — `src/hooks/useAgentLogic.ts:701,710`
  - **Wat:** `chunkText.matchAll(/\[TRAIN_A\](.*?)\[\/TRAIN_A\]/g)` matcht op ongesloten/malformed tags niet expliciet gevalideerd (buiten scope van de twee gereviewde bestanden, wel het contract waar `TrainerData`/`activeTrainerData` van afhangt).
  - **Risico:** een AI-response die de tag-syntax niet volgt (bv. door een modelwissel of edge-case in de streaming-chunking) laat de trainingsdata simpelweg niet bijwerken — geen crash, wel stille no-op. Dit is een gedeeld hook-bestand (raakt ook andere agent-rollen met vergelijkbare tag-parsing), dus **niet** missie-specifiek autoFixable.
  - **Voorstel:** buiten scope van deze single-missie review — zou een aparte `useAgentLogic.ts`-audit vereisen.

- **Visual Precision Gate: unverified (dynamic)** — geen Chrome-plugin-sessie in deze reviewrun.
  - **Wat:** geen live screenshot-bewijs voor mobiel/tablet/desktop states van de `TrainerMissionView`-integratie specifiek (PR #178 is recent; de UI-audit van 2026-06-30 dekt mogelijk de oudere split-view-vorm, niet de huidige geïntegreerde commandobalk-vorm).
  - **Risico:** de layout-aannames (`min-h-[200px]` grid voor buckets, `max-h-[38vh]` uitklapbaar gesprek) zijn plausibel maar ongeverifieerd op kleine viewports.
  - **Voorstel:** een dedicated Fase-B-run (dev-server + Chrome-plugin) op `ai-trainer` zou de post-PR#178-layout moeten herbevestigen — niet mechanisch autoFixable, vereist browser-toegang.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie
Niet uitgevoerd — geen dev-server/Chrome-plugin-sessie beschikbaar binnen deze reviewrun. Statische analyse toont geen aanwijzingen voor console-errors of network-failures (geen onveilige patterns, geen ongehanteerde promises aangetroffen in de gereviewde bestanden).

### Score
Static: 7/7 kern-criteria geslaagd (3 niet-blocking aandachtspunten, alle buiten missie-specifieke scope) · Dynamic: n.v.t. (niet uitgevoerd) · **Aanbeveling: ship**

---

## Samenvatting

`ai-trainer` is een van de sterkste missies in het platform (bevestigd door de 2026-06-30 audit) en blijft dat bij deze verse review. Geen blocking issues op design, didactiek of techniek. De aandachtspunten zijn stuk voor stuk cosmetisch (legacy tokens in de missiekaart-preview, inline-hex in plaats van Tailwind-tokens in de werkbank-preview) of buiten missie-specifieke scope (client/server-systemInstruction-drift in een gedeeld bestand, tag-parsing-robuustheid in een gedeelde hook). Geen van de aandachtspunten is mechanisch autoFixable binnen de scope van deze ene missie zonder gedeelde bestanden (year1.tsx, systemInstructions.ts, useAgentLogic.ts) aan te raken — vandaar een lege `autoFixable`-lijst.

**Verdict: ok** (ship, geen fix-eerst nodig).
