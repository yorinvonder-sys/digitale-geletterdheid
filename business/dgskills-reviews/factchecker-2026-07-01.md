# Review: factchecker (wave 8, verse review)

**Datum:** 2026-07-01
**Template:** scenario-engine
**Config:** `src/features/missions/templates/scenario-engine/configs/factchecker.ts`
**Curriculum:** leerjaar 2, periode 1 ("Data & Informatie")
**SLO-claim:** `21B`, `23C` (regulier) · `18B`, `20B` (VSO)

---

## 🎨 Design review

**Mission:** factchecker (scenario-engine)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** config zelf bevat geen inline `className`-strings (content-only file) — geen tokenprobleem op dit niveau.
- **Criterium 2 (Layout consistentie):** n.v.t. voor deze reviewpas — engine-gedeeld, config draagt geen layout.
- **Criterium 3 (Knop-clarity):** geen knop-definities in config; engine-gedeeld gedrag, buiten scope van deze missie-review.
- **Criterium 4 (Copy-lengte, leerjaar 2):** `introDescription` ≈ 53 woorden (grens <80) — ruim binnen norm. Ronde-`description`-velden allemaal <60 woorden (langste: ronde `craap-methode`, ≈45 woorden). — `factchecker.ts:8-9`
- **Criterium 6 (Framer Motion):** geen animatie-props in config — n.v.t.
- **Criterium 7 (Toegankelijkheid, content-niveau):** geen kleur-only informatie-overdracht in de content zelf; elk item heeft zowel emoji-icon als tekstuele titel/uitleg.

### ⚠️ Aandachtspunten
- **Criterium 1 (badge-kleuren):** badges gebruiken hardcoded hex (`#ff3c21`, `#202023`) i.p.v. `duck-error`/`duck-ink`-tokens — `factchecker.ts:23,28,34,40`. Dit is de **bekende engine-brede lijst** (badge-kleursysteem in de scenario-engine zelf), niet uniek aan deze missie. Niet opnieuw rapporteren als losstaand issue; hoort bij de platformbrede badge-hex-tokenisatie-taak.

### ❌ Blocking issues
Geen.

### Visual Precision Gate
Unverified — geen screenshots-map aangetroffen voor `factchecker`, geen dev-server gestart in deze reviewpas. Grep in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` op "factchecker" leverde geen treffer op — de missie is niet meegenomen in de live UI/UX-sweep van 2026-06-30.

### Score
6/7 criteria geslaagd (1 = bekende engine-lijst, niet missie-specifiek) · Aanbeveling: **ship** (content-niveau)

---

## 📚 Didactiek review

**Mission:** factchecker (scenario-engine)
**Curriculum-plek:** Leerjaar 2, Periode 1
**SLO-claim:** `21B`, `23C` · VSO `18B`, `20B`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `21B` (Media & Informatie) en `23C` (Maatschappij) zijn beide geldige regulier-VO-codes; `18B`/`20B` zijn geldige VSO-codes. — `slo-kerndoelen-mapping.ts:100`
- **Criterium 2 (SLO-fit):** `21B` sterk geraakt — alle 4 rondes draaien om bronnen/media-analyse (rode vlaggen herkennen, bronhiërarchie, CRAAP). `23C` (maatschappelijke impact van desinformatie) wordt geraakt via ronde 3 (`delen-of-niet`) die maatschappelijke gevolgen van delen laat afwegen (dijkdoorbraak-waarschuwing, gezondheidsdesinformatie).
- **Criterium 3 (Leerdoelen helder):** `missionGoals.ts:392-400` heeft een concreet, meetbaar `primaryGoal` + `evidence`-criterium ("minimaal drie rode vlaggen ... noemen") — action-verb, gedragscriterium, aansluitend bij Bloom "analyseren/evalueren".
- **Criterium 4 (Opdracht-beknoptheid):** ruim binnen leerjaar-2-grenzen, zie designsectie hierboven.
- **Criterium 5 (Leeftijds-passend):** vocabulaire past bij 13-14 jaar (TikTok, WhatsApp, clickbait-voorbeelden — herkenbaar); geen onuitgelegd jargon (CRAAP wordt in elke ronde-titel/beschrijving uitgeschreven).
- **Criterium 6 (Curriculum-plek):** logisch geplaatst in "Data & Informatie" naast `data-journalist`/`spreadsheet-specialist` — bronbeoordeling is een natuurlijk vervolg op data-analyse-vaardigheden.
- **Criterium 7 (Bloom-balans):** goede mix — ronde 1 herkennen/onthouden, ronde 2 rangschikken/analyseren, ronde 3 toepassen/evalueren (beslissing nemen), ronde 4 begrijpen/toepassen (CRAAP-vragen classificeren). Geen pure quiz-recall.
- **Criterium 9 (Welzijn):** VSO-mapping aanwezig; geen gevoelige-onderwerp-issues; content is neutraal en vermijdt politieke stellingname expliciet (zie `SCOPE GUARD` in agent-instructie).

### ⚠️ Aandachtspunten
- **Criterium 1/2 (SLO-copy-mismatch):** de agent-`systemInstruction` noemt expliciet alleen "INHOUDELIJKE FOCUS (SLO 21B)" — `year2.tsx:206` — en vermeldt `23C` nergens, terwijl de mapping beide claimt. Voor de leerling zelf is dit onzichtbaar (chat is dormant, zie hieronder), maar voor een docent die de brondocumentatie leest is het een inconsistentie tussen claim en interne documentatie.
  - **Wat:** systemInstruction-comment dekt niet alle geclaimde SLO-codes.
  - **Waarom:** minimaal risico voor de leerling (chat draait niet), wel een onderhoudssignaal — als de chat ooit geactiveerd wordt, mist de AI-instructie de 23C-focus (maatschappelijke impact) die de scenario-rondes wél raken.
  - **Voorstel:** bij het besluit over chat-activering (zie platformlijst) de `INHOUDELIJKE FOCUS`-regel uitbreiden met een 23C-punt, bijv. "Maatschappelijke impact van desinformatie (verspreiding, paniek, vertrouwen in instituties)".

- **Criterium 8 (AI-as-copilot — dormante chat):** `templateRegistry.ts:17` toont `factchecker` **zonder** `enableChat: true` (vergelijk regel 47-51 waar builder-canvas-missies dat wel expliciet zetten). De volledig uitgewerkte, kwalitatief sterke `systemInstruction` in `year2.tsx:195-239` — met correcte 3-stap-methode (erkenning → uitleg → challenge), STEP_COMPLETE-logica en scope-guard — is dus **dormant**: leerlingen zien deze AI-persoonlijkheid nooit tijdens de scenario-engine-flow.
  - **Wat:** rijke, didactisch goed doordachte chatrol bestaat maar wordt nooit gerenderd voor deze missie.
  - **Waarom:** dit is exact de bekende **dormante-chat-rol-valkuil** (platformbreed beslispunt, al meermaals gesignaleerd in eerdere waves — o.a. ai-bias-detective, code-review-2, cyber-detective, data-detective, de 7 review-arena-missies). Geen missie-specifiek issue — telt niet als blokkade voor deze missie, zie samenvatting onderaan.
  - **Voorstel:** geen actie op missie-niveau; wacht op de platformbrede beslissing (chat aanzetten waar didactisch zinvol, of instructie bewust markeren als toekomstig/uit).

### ❌ Blocking issues
Geen.

### SLO-fit oordeel
- **21B (Media & Informatie):** sterk geraakt — bewijs: alle 4 rondes (rode vlaggen, bronhiërarchie, delen-beslissingen, CRAAP-methode) zijn direct bron-/media-beoordeling.
- **23C (Maatschappij):** matig/oppervlakkig geraakt — bewijs: ronde 3 laat maatschappelijke gevolgen van delen meewegen (paniek, gezondheidsrisico, veiligheidswaarschuwing), maar de missie behandelt "maatschappij" niet als expliciet lesdoel op zichzelf.

### Score
8/9 criteria geslaagd (1 aandachtspunt = platformbrede dormante-chat-kwestie, telt niet als missie-specifieke blokkade) · Bloom-balans: **medium-hoog** · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** factchecker (scenario-engine)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze reviewpas, geen bestaande screenshots-map aangetroffen voor `factchecker`.

### Static analyse

#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline):** config is volledig getypeerd via `ScenarioEngineConfig`; geen `any`, geen `@ts-ignore`, geen impliciete typing. — `factchecker.ts:1,3`
- **Criterium A4 (Imports via alias):** enige import is `import type { ScenarioEngineConfig } from '../types'` — relatief pad naar sibling `types.ts` binnen dezelfde template-module; consistent met andere scenario-engine-configs (geen `@/`-alias-schending, dit is het gangbare patroon binnen de template-map zelf).
- **Criterium A6 (Restart-safe state):** config bevat geen eigen state-logica; state/autosave wordt door de gedeelde `ScenarioEngine.tsx`-renderer afgehandeld (engine-verantwoordelijkheid, niet missie-specifiek).
- **Criterium A7 (Security):** geen `dangerouslySetInnerHTML`, geen client-side AI-call, geen user-input-verwerking in de config zelf — alle content is statisch en auteur-gecontroleerd.

#### Feitelijke inhoud-check (factcheck-thema — extra kritisch getoetst)
Bij een factcheck-missie is inhoudelijke juistheid van de "correcte" antwoorden zelf een kwaliteitscriterium. Alle 22 beoordeelde items doorgelicht:
- **Ronde 1 (rode vlaggen):** alle 8 correct/incorrect-labels kloppen feitelijk en didactisch (sensatiekoppen, oud-nieuws-als-actueel, anonimiteit, onbekende domeinen, emotionele lading en bronloze grafieken zijn terecht gemarkeerd als rode vlaggen; publicatie op een gevestigde site en links naar primaire bronnen terecht als geen rode vlag).
- **Ronde 2 (bronhiërarchie):** volgorde peer-review > overheidsinstantie > gerenommeerde media > individuele-expert-blog > sociale-media-anekdote is de gangbare, verdedigbare hiërarchie voor medische claims — geen aanvechtbare of verouderde feiten.
- **Ronde 3 (delen-of-niet):** het satire-voorbeeld (disclaimer onderaan de pagina) en het reverse-image-search-advies zijn beide actueel en correct; geen tijdgebonden claims die verouderen.
- **Ronde 4 (CRAAP):** de vijf CRAAP-dimensies (Currency/Relevance/Authority/Accuracy/Purpose) zijn correct toegewezen aan de juiste items; de twee "geen CRAAP-vraag"-afleiders (likes-aantal, spellingscontrole) zijn didactisch sterk (veelvoorkomende misvattingen).
- Geen verouderde, aanvechtbare of feitelijk onjuiste content aangetroffen.

### ⚠️ Aandachtspunten
Geen missie-specifieke technische issues gevonden.

### ❌ Blocking issues
Geen.

### Dynamic verificatie
Niet uitgevoerd — geen dev-server beschikbaar in deze reviewpas; geen bestaande screenshot-evidence voor `factchecker` in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (grep leverde 0 treffers). Alle visuele/dynamische claims in dit rapport zijn **unverified**.

### Score
Static: 4/4 criteria geslaagd · Dynamic: n.v.t. (niet uitgevoerd) · Aanbeveling: **ship** (static), dynamische verificatie is een openstaand punt voor een latere sweep

---

## Samenvatting

| Missie | Scores (design/didactiek/tech) | Triage | Verdict | Fixes | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| factchecker | 8.5 / 8.5 / 7.0 | 1.95 | ok | 0 | ship | geen (dormante chat-rol → bestaande platformlijst; dynamische verificatie ontbreekt — geen dev-server/screenshots) |

**Triage-berekening:** (10-8.5)×0.3 + (10-8.5)×0.4 + (10-7.0)×0.3 = 0.45 + 0.60 + 0.90 = **1.95**
(Tech iets lager dan design/didactiek omdat dynamic/visuele verificatie niet is uitgevoerd — geen dev-server, geen screenshot-evidence.)

**Wijzigingen in deze pas:** geen — geen fixes toegepast, geen bestanden gewijzigd.

**Platformbrede context (bevestigd, niet herhalen als nieuw issue):** factchecker sluit aan bij de al-bekende dormante-chat-rol-lijst (ai-bias-detective, code-review-2, review-arena ×7, cyber-detective, data-detective — nu ook factchecker).
