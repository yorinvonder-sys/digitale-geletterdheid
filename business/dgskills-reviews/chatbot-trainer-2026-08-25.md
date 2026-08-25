# Missie-review: chatbot-trainer

**Datum:** 2026-08-25
**TemplateType:** agent-role (pure chatmissie zonder eigen component/config)
**Bronnen:** `src/config/agents/year1.tsx:3259-3341`, `src/config/agentRoleIds.ts:44`, `src/config/missionGoals.ts:99-106`, `src/config/missionPreviewConfig.ts:39`, `src/config/slo-kerndoelen-mapping.ts:49`, `src/config/curriculum.ts:84`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet)

Geen eigen engine-component of config-bestand — de enige "UI" in scope is de decoratieve `visualPreview`-JSX in de agent-entry (`year1.tsx:3271-3290`), gebruikt op de briefingkaart.

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens)**: `visualPreview` gebruikt uitsluitend geldige legacy-aliassen (`lab-coral`, `lab-teal`) — geen hardcoded hex in className-strings — `year1.tsx:3271-3290`
- **Icon-kleur**: `color: '#202023'` komt exact overeen met `duck-ink` — `year1.tsx:3264`
- **Criterium 7 (toegankelijkheid)**: geen misleidende kleur-only informatie; decoratieve elementen bevatten geen tekst die verloren gaat zonder kleur

### ⚠️ Aandachtspunten
- Geen — de visualPreview is puur decoratief (geen interactieve elementen, geen tekst-nodes die copy-limieten raken), dus criteria 2 (layout-baseline), 3 (knop-clarity) en 6 (Framer Motion) zijn hier niet van toepassing (geen `<button>`, geen `motion.*`).

### ❌ Blocking issues
- Geen.

### Visual Precision Gate
`WARN` — geen Chrome-plugin/dynamic bewijs verzameld (geen dev-preview-run in deze pass); voor een pure chatmissie zonder eigen layout is het risico laag, maar de gate blijft formeel onverified.

### Score
3/3 toepasselijke criteria geslaagd (4 criteria N.v.t. — geen eigen layout/config) · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Curriculum-plek:** Leerjaar 1, Periode 2 (`curriculum.ts:84`)
**SLO-claim:** `21D` (AI), `22B` (Programmeren) · VSO: `18C`, `19A`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes geldig)**: `21D` en `22B` zijn beide geldige regulier-codes; VSO `18C`/`19A` zijn geldig — `slo-kerndoelen-mapping.ts:49`
- **Criterium 2 (SLO-fit)**: `21D` (AI) direct geraakt — de hele missie draait om hoe een chatbot "AI" nabootst via regels; `22B` (Programmeren) geraakt via de IF-THEN-logica die leerlingen expliciet moeten toepassen (sleutelwoord → antwoord) — `year1.tsx:3301-3312`
- **Criterium 3 (leerdoelen)**: impliciet leerdoel helder via `missionGoals.ts:99-105` — "Ik bouw en test chatbotregels die passende antwoorden geven" + concrete evidence-eis ("chatbot reageert op meerdere voorbeeldvragen")
- **Criterium 4 (copy-beknoptheid)**: EERSTE BERICHT ≈ 59 woorden (grens leerjaar 1: <80) — `year1.tsx:3318-3324`; `missionObjective`/`problemScenario` ruim binnen grens
- **Criterium 5 (leeftijds-passend vocabulaire)**: concreet, herkenbaar voorbeeld (pizzeria/dierenwinkel/helpdesk), geen jargon zonder uitleg — chatbot-werking wordt in kindvriendelijke metafoor uitgelegd ("een heel slim woordenzoekspel") — `year1.tsx:3307`
- **Criterium 6 (curriculum-plek)**: leerjaar 1 periode 2 "AI & Creatie" naast `ai-trainer`/`prompt-master` — logische opbouw (eerst AI-concepten, dan regel-gebaseerde chatbotlogica)
- **Criterium 7 (Bloom-balans)**: mix aanwezig — onthouden/begrijpen (IF-THEN uitleg) tot toepassen (eigen regels bouwen + testen) en een lichte evaluatie-laag via de reflectievragen ("Wat gebeurt er als een klant een woord gebruikt dat jij NIET hebt geprogrammeerd?") — `year1.tsx:3313-3316`
- **Criterium 8 (AI-as-copilot)**: `systemInstruction` volgt scaffolding-patroon (uitleg → voorbeelden → reflectievragen), geen kant-en-klaar antwoord voor de leerling — `year1.tsx:3296-3316`

### ⚠️ Aandachtspunten
- Geen expliciet `learningObjectives`-array-veld (dit missietype heeft dat structureel niet); het impliciete doel in `missionGoals.ts` dekt de eis functioneel, maar mist een los, meetbaar actiewerkwoord-format zoals bij template-missies. Geen fix nodig — dit is het staande patroon voor alle agent-role missies in dit bestand, niet uniek voor `chatbot-trainer`.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **21D (AI)**: sterk geraakt — kernthema van de missie
- **22B (Programmeren)**: sterk geraakt — IF-THEN-regelbouw is de hoofdactiviteit

### Score
8/8 criteria geslaagd · Bloom-balans: medium · Aanbeveling: **ship**

---

## 🔧 Tech review

**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server/Chrome-plugin-run in deze pass; scope was beperkt tot de config-entries zelf (zoals opgedragen)

### Static analyse
#### ✅ Geslaagd
- **Structuur**: entry bevat alle verplichte velden (`id`, `yearGroup`, `educationLevels`, `title`, `icon`, `color`, `description`, `problemScenario`, `missionObjective`, `briefingImage`, `difficulty`, `examplePrompt`, `visualPreview`, `systemInstruction`, `steps`, `bonusChallenges`) — `year1.tsx:3259-3341`
- **`systemInstruction` gebruikt de gedeelde suffix**: `+ SYSTEM_INSTRUCTION_SUFFIX` toegepast, consistent met andere agent-entries in hetzelfde bestand — `year1.tsx:3324`
- **Client-side `systemInstruction` is geen bevinding hier**: bekende valkuil — het échte coach-gedrag wordt server-side bepaald; de string in `year1.tsx` is documentatie/fallback, geen live prompt-injectiepad
- **`agentRoleIds.ts`**: `chatbot-trainer` correct geregistreerd — `agentRoleIds.ts:44`
- **`missionPreviewConfig.ts`**: preview-kaart correct gekoppeld (`kind: 'ai'`, titel, subtitle, chips) — `missionPreviewConfig.ts:39`

#### ⚠️ Aandachtspunten
- Geen mechanische issues gevonden binnen de whitelist-scope van deze pass.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie
Niet uitgevoerd — opdracht was beperkt tot de config-entries van deze missie (geen dev-server-run in deze wave-pass).

### Score
Static: 5/5 · Dynamic: n.v.t. · Aanbeveling: **ship**

---

## Voorstellen

Geen concrete voor/na-fixes nodig — alle drie assen scoren "ship" zonder blocking of mechanisch te herstellen bevindingen.

---

## Samenvatting & verdict

`chatbot-trainer` is een compacte, goed doordachte pure-chatmissie: de SLO-koppeling (21D AI + 22B Programmeren) is inhoudelijk juist onderbouwd, de copy blijft ruim binnen de leerjaar-1-grenzen, en de systeeminstructie volgt het AI-as-copilot-scaffoldingpatroon (uitleg → voorbeelden → reflectievragen) zonder kant-en-klare antwoorden weg te geven. Design-criteria zijn grotendeels N.v.t. omdat de missie geen eigen layout/config heeft — het enige controleerbare UI-element (de decoratieve preview) gebruikt geldige tokens. Geen blocking issues, geen auto-fixable mechanische problemen.

**Verdict: ship** (design 8/10, didactiek 9/10, tech 9/10 — geen blockers, geen fixes vereist)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
