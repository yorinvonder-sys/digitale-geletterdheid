# Missie-review: Wachtwoord Fortress

**Mission ID:** wachtwoord-fortress
**Template:** password-fortress (nieuw templateType)
**Curriculum-plek:** Leerjaar 2, Periode 2
**Datum:** 2026-07-02
**Reviewer-pipeline:** dgskills-mission-review v1.0
**Bijzonder:** één-shot gebouwd door een autonome Fable-agent (experiment); code leeft in worktree `agent-af18236d5113c4f07` (branch `worktree-agent-af18236d5113c4f07`), nog niet op main.

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd (7/7 criteria)
- Uitsluitend `duck-*` tokens, geen legacy `lab-*`, geen off-brand hex, geen `duck-bgDeep` no-op; alle bare-slash-opacity op veelvouden van 5.
- Alle 7 knop-handlers functioneel gekoppeld; icon-only knoppen hebben `aria-label`.
- Copy binnen leeftijdsgrens (intro 65 woorden, ronde-teksten 26-34).
- Kleurcontrast overal ruim boven WCAG AA (9:1–16:1).
- Structuur consistent met sibling-template `puzzle-lab`.

### ⚠️ Aandachtspunten (cosmetisch, niet-blokkerend)
- **Focus-visible ontbreekt op 6 van 7 knoppen** (`PasswordFortress.tsx:504-573`) — toetsenbord-navigatie toont geen focus-ring op o.a. "TEST MIJN FORT". **Pre-existing patroon** (ook in `puzzle-lab/PuzzleLab.tsx:431`), geen regressie; kandidaat voor aparte cross-template a11y-sweep.
- **Inconsistente `aria-hidden`** op decoratieve emoji `PasswordFortress.tsx:62` (⚠️) terwijl regel 96 en 152 het wél doen.

**Design-aanbeveling:** ship (2 kleine a11y-polishpunten).

---

## 📚 Didactiek review

**Reviewer:** dgskills-didactiek-reviewer (Sonnet)
**SLO-claim:** 23A (Veiligheid & privacy), VSO 20A

### ✅ Geslaagd (7/9 criteria)
- SLO-codes geldig en sterk geraakt; alle 4 rondes zijn substantiële, actieve oefening van digitale veiligheid.
- Leerdoelen concreet en action-verb-gedreven; elke ronde heeft eigen `clearedLesson`.
- Taal passend voor leerjaar 2 (concrete metaforen, niet betuttelend).
- Bloom-balans medium-hoog (toepassen → analyseren → evalueren).
- Rekenmodel klopt exact met de hints (zelf doorgerekend tegen `fortressEngine.ts:150-155`).
- Dormant chat-`systemInstruction` volgt het juiste copiloot-patroon (vraagt door, geeft nooit het antwoord, "leer nooit hoe je kraakt"-guardrail).

### ⚠️ Aandachtspunten (fix-eerst — beide kleine copy/config-fixes)
1. **Overlap met `wachtwoord-warrior`** (`curriculum.ts:189-190`, `slo-kerndoelen-mapping.ts:119`) — zelfde SLO, zelfde week, deels dezelfde lessen. De bouwer erkende dit zelf in een comment maar loste het niet op. **Voorstel:** verwijzende intro-zin die Fortress positioneert als toepassing ná Warrior's kennis ("Nu je weet hóe aanvallen werken, ga je zelf een fort bouwen en live testen").
2. **Completion-contract laat de kernles overslaan** (`wachtwoord-fortress.ts:16-18,31`) — `min: 3` van 4 rondes + `skipAfterAttempts: 6` maakt dat juist ronde 4 (credential stuffing / passphrase — de belangrijkste, meest overdraagbare les) overgeslagen kan worden terwijl de missie toch "voltooid" telt. **Voorstel:** ronde 4 verplicht maken (`min: 4` of ronde-4-specifieke skip-drempel).

**Didactiek-aanbeveling:** fix-eerst.

---

## 🔧 Tech review

**Reviewer:** dgskills-tech-reviewer (Sonnet) + orchestrator-aanvulling (browser-QA)

### ✅ Geslaagd (8/8 statische criteria)
- Geen `any`/`@ts-ignore`; imports volgen `ethics-council`/`puzzle-lab`-precedent.
- **Determinisme bevestigd:** geen `Date.now`/`Math.random`/`new Date` in `fortressEngine.ts` — kraaktijd is pure functie van de invoer.
- **Privacy-claim (statisch):** `FortressState` bevat geen wachtwoordveld; getypt wachtwoord leeft alleen in lokale `useState`, niet in autosave.
- Restart-safe via `isCleared` afgeleid uit `state.cleared`.
- Geen `dangerouslySetInnerHTML`, geen client-side secret, geen edge-call.
- `vite build` groen; eigen lazy-chunk `PasswordFortress-*.js` (18.48 kB).

### ⚠️ Aandachtspunten
- **Emoji/unicode-lengte** (`fortressEngine.ts:253`) telt UTF-16 code-units i.p.v. grafemen — emoji lijken kunstmatig "extra lengte" te geven. Low-priority edge-case (`[...pw].length` lost het op).
- **Nieuw templateType gerechtvaardigd:** de interactie (vrije invoer → deterministische rekensimulatie tegen dynamische drempel) past niet in PuzzleLab's vaste-antwoord-contract; union + router + preflight-registratie compleet en analoog aan het `ethics-council`-precedent.

### Registratie (16-punts controle): 11 PASS / 5 WARN / 0 FAIL
- Alle touchpoints compleet; **`RoleId`-union ↔ `AGENT_ROLE_IDS`-array in sync** (de bekende TS2367-valkuil vermeden).
- Enige hard-failure in de repo-wide preflight (`review-week-3: unknown templateType 'ethics-council'`) is **pre-existing** (ethics-council-gat), niet door deze missie veroorzaakt; focused check op `wachtwoord-fortress` is groen (exit 0).
- WARN: geen `basisvaardigheden`-entry (12+ sibling-missies missen die ook), `primaryGoal`-tekst gedupliceerd over 3 bronnen (bestaand patroon).

### Blocking issues
Geen.

**Tech-aanbeveling:** code ship-klaar; browser-verificatie was voor de reviewer geblokkeerd (Chrome-plugin) → door orchestrator afgerond, zie hieronder.

---

## 🖼️ Visuele evidence (multi-viewport)

Browser-doorloop door de **orchestrator** uitgevoerd via de ingebouwde preview-browser (Chrome-plugin voor de tech-reviewer geblokkeerd; expliciet gelabeld, geen stille vervanging). Dev-server `http://127.0.0.1:3008`.

| Viewport | Intro | Spel-flow | Foutfeedback | Eindstaat |
|---|---|---|---|---|
| Desktop | ✅ | ✅ volledige 4-ronde-doorloop | ✅ "123456" → brute-force DOORBROKEN | ✅ Fortmeester 100/100 |
| iPad staand (1024×1366) | ✅ geen overflow | ✅ input+knop in beeld | — | — |
| iPad liggend (1366×1024) | ✅ geen overflow | ✅ input+knop in beeld | — | — |
| Mobiel (375×812) | ✅ geen overflow | ✅ schone layout (screenshot) | — | — |

**Runtime-bevindingen orchestrator:**
- **Volledige playthrough:** "123456" faalt correct op brute-force (ronde 1); passphrase `fiets-appel-wolk-regenboog-42` doorstaat alle 4 rondes → eindscherm badge **Fortmeester 100/100**.
- **Privacy — geverifieerde paden (localStorage + netwerk):** localStorage-key `dgskills_mission_wachtwoord-fortress` bevat `phase/currentRound/attempts/cleared/bestTimeLabels` — **géén getypt wachtwoord** (`wachtwoordInLocalStorage: false`); sessionStorage leeg. Netwerktrace over de volledige doorloop: **uitsluitend lokale GET-requests** (JS-modules, CSS, fonts, assets, route-navigaties) — **geen enkele POST/fetch/XHR of externe/analytics-request** die bij het typen of testen van een wachtwoord afvuurt; de engine draait volledig client-side (bevestigt tech-reviewer: geen `supabase.functions.invoke`/`fetch` in de missie-bestanden).
- **Privacy — resterend voorbehoud (niet uitputtend getest):** console/error-reporting-paden zijn niet exhaustief geïnstrumenteerd; de claim luidt daarom precies "geen getypt wachtwoord in localStorage/sessionStorage en geen netwerk-egress tijdens de doorloop", niet een absolute garantie over élk mogelijk telemetrie-/logpad.
- **Restart-safe bevestigd:** na echte remount (via wegnavigeren + midden-save) hervat de missie exact op ronde 3 met score 50 — de eerdere "sprong naar eindscherm" was een preview-tool-artefact (same-tab re-render), geen bug.
- **Console:** alleen benigne `GSAP target not found`-warnings (cosmetisch, uit de preview-chip-animatie), geen errors.

**Finale UI-gate:** geen overlap/clipping/canvas-buiten-beeld op enig formaat. Kernflow (intro/flow/fout/eind) op desktop volledig doorlopen; tablet/mobiel op layout-integriteit geverifieerd.

---

## Samenvatting

De gate is bewust in twee lagen gesplitst om de tegenstrijdigheid te vermijden die Codex terecht flagde ("fix-eerst" mag niet naast "0 blocking" staan):

- **Technische laag — SCHOON.** Design 7/7, tech 8/8 statisch + runtime-QA geverifieerd, registratie 11/16 PASS (0 FAIL), build groen, privacy geverifieerd (localStorage + netwerk-egress). Op techniek/beveiliging/registratie zijn er **0 blocking issues**; de code is technisch ship-kwaliteit.
- **Didactische laag — BLOCKING voor curriculum-opname.** De 2 didactiek-punten zijn **release-blocking voor opname in het lesprogramma** (niet louter "aandachtspunten"):
  1. **Ronde 4 mag niet overslaanbaar zijn** — de belangrijkste, meest overdraagbare les (passphrase/credential stuffing) kan nu worden overgeslagen terwijl de missie "voltooid" telt (`min: 3` van 4 + `skipAfterAttempts: 6`). Fix: ronde 4 verplicht maken.
  2. **Overlap met `wachtwoord-warrior`** — zelfde SLO/week/lessen; positioneer Fortress expliciet als toepassing ná Warrior (verwijzende intro-zin) óf verplaats naar een latere periode.

- **Netto-aanbeveling:** **FIX-EERST / geblokkeerd voor curriculum-opname** tot beide didactische fixes zijn toegepast. De onderliggende code hoeft daarvoor niet herbouwd te worden — het zijn kleine copy/config-aanpassingen.

---

## Codex-gate (M1)

**Verdict: BLOCK (needs-attention)** — gpt-5.5, effort xhigh, scope working-tree, gedraaid op dit bundelrapport.

Codex flagde twee terechte punten, beide inmiddels in dit rapport verwerkt:

1. **[high] Gate-tegenstrijdigheid** — "fix-eerst" stond naast "0 blocking / ship-klaar", waardoor een missie met een overslaanbare kernles tóch opgenomen had kunnen worden. **Opgelost:** de Samenvatting hierboven splitst nu expliciet de technische laag (schoon) van de didactische laag (release-blocking voor curriculum-opname); de twee didactiek-punten zijn tot blocking gepromoveerd.
2. **[medium] Privacyclaim sterker dan het bewijs** — oorspronkelijk alleen op localStorage gebaseerd. **Opgelost:** de privacyclaim is nu onderbouwd met localStorage + sessionStorage + een volledige netwerktrace (geen egress), en expliciet afgebakend met het resterende voorbehoud (console/error-reporting niet uitputtend getest).

**Netto:** de BLOCK was inhoudelijk correct en valt samen met de netto-aanbeveling van dit rapport — **geblokkeerd voor curriculum-opname** tot de 2 didactische fixes zijn toegepast. De technische/registratie/privacy-bevindingen blijven schoon.
