# Mission-fixer rapport — cyclus 1 (fix-pass)

**Mission ID:** phishing-fighter
**Rapport-bron:** `business/dgskills-reviews/phishing-fighter-2026-06-17.md`
**Type:** vervolg-fix-pass — dit is een aanvullende pass op het rapport van 2026-06-17. Eén van de voorstellen uit dat rapport (`missionGoals.ts`-entry) was al vóór deze pass toegepast; deze pass verwerkt de overige whitelisted voorstellen.
**Whitelist:** `configs/phishing-fighter.ts`, `templateRegistry.ts` (alleen phishing-fighter entry), `agents/year{1,2,3}.tsx` (alleen agent-rol entry), `slo-kerndoelen-mapping.ts` (alleen entry), `curriculum.ts` (alleen entry), `missionGoals.ts` (alleen entry)

## ✅ Toegepaste fixes (2)

- `src/features/missions/templates/scenario-engine/configs/phishing-fighter.ts:16-21` — `learningObjectives` toegevoegd (4 items, na `introFeatures` vóór `maxScore`, patroon overgenomen van `mail-detective.ts`) (sectie: didactiek)
- `src/config/agents/year3.tsx:760` — legacy `from-lab-gold to-lab-coral` vervangen door `from-duck-acid to-duck-ink` in de `visualPreview`-gradient van de agent-rol-entry (sectie: design/UX)

## ⏭️ Geskipte voorstellen (1)

- `src/config/missionGoals.ts` — **stale (al opgelost):** de `phishing-fighter`-entry (regel 253-260) staat al exact zoals het rapport voorstelde — `primaryGoal`, `criteria` (type `rounds-complete`) en `evidence` matchen woordelijk. Dit was het voorstel dat al vóór deze pass was toegepast. Geen actie nodig.

## ⚠️ Escalatie nodig (2)

- **Badge-kleuren hardcoded hex** (`src/features/missions/templates/scenario-engine/configs/phishing-fighter.ts:19-41`, waarden `#e1ff01`/`#202023`) — **blijft escalatie**, zoals in de opdracht-context bevestigd. Het rapport zelf noemt dit al als voorkeur "ESCALATIE": een echte fix vereist dat `CompletionScreen`/de badge-rendering token-namen resolvt in plaats van raw hex-strings te accepteren. Dat is een gedeelde-component-refactor (`CompletionScreen`/`SimpleChart` en mogelijk andere configs die hetzelfde patroon gebruiken) en valt buiten de missie-specifieke whitelist van deze fixer. Geen edit uitgevoerd.
- **22A-dekking leeft alleen in agent-chat, niet in engine-rondes** (`src/config/slo-kerndoelen-mapping.ts:167` + didactisch besluit) — **blijft escalatie**, en is inmiddels al gedocumenteerd: de huidige mapping-regel bevat al een inline comment die het bewuste besluit vastlegt ("-22A: scenario-engine = herkenning+bescherming (geen productontwerp); trainingsontwerp (22A) zit enkel in de niet-geactiveerde chat-rol"). Dit is een inhoudelijke SLO-mapping-wijziging en dus per skill-regel altijd escalatie, ongeacht status. Geen edit uitgevoerd; het besluit lijkt al genomen en gedocumenteerd door een eerdere sessie.

## Niet meegenomen (buiten whitelist, ter info)

Twee ⚠️-punten uit het bronrapport raken bestanden die niet in de whitelist van deze fixer-run staan en zijn dus niet beoordeeld/gewijzigd:
- Hardcoded `#08283B` in `src/features/missions/templates/scenario-engine/sub/BinaryChoiceRound.tsx:80` (gedeeld engine-bestand)
- `order-priority`/`correctPosition: 0`-consistentie-check in `src/features/missions/templates/scenario-engine/sub/FeedbackBanner.tsx` (geen concreet before/after-voorstel, alleen een verificatie-aanbeveling — sowieso geen fix-actie per skill-regel)

## Volgende stap

Re-run M2 review (cyclus 2/3) om de 2 toegepaste fixes te bevestigen. De 2 resterende escalaties (badge-token-refactor, 22A-dekking) vereisen een beslissing van Yorin/orchestrator buiten deze fixer-scope.

---

## Orchestrator-eindreview (aanvulling, 2026-07-01)

De visualPreview-gradient-swap (`from-lab-gold to-lab-coral` → `from-duck-acid to-duck-ink`, year3.tsx:760) is **teruggedraaid**. Reden: dit is een visuele-identiteitswijziging van de missiekaart (warm goud/koraal → geel/zwart) — exact de categorie die bij ai-beleid-brainstorm en reflection-report bewust als Yorin-beslissing is geëscaleerd. Consistente regel: legacy-token-swaps die het kleurbeeld veranderen zijn design-beslissingen, geen mechanische fixes. Netto toegepast: 1 fix (learningObjectives). Nieuwe escalatie: "design-identiteit: visualPreview-gradient legacy lab-gold/lab-coral — duck-palet heeft geen warm equivalent (Yorin beslist)".
