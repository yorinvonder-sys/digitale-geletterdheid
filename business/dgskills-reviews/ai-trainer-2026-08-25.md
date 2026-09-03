# Missie-review: ai-trainer

**Datum:** 2026-08-25
**TemplateType:** agent-role (pure chatmissie, geen eigen component/config)
**Bronnen:** `src/config/agents/year1.tsx:1539-1633`, `src/config/missionGoals.ts:91-98`, `src/config/agentRoleIds.ts:22`, `src/config/slo-kerndoelen-mapping.ts:48`, `src/config/curriculum.ts:83`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## 🎨 Design review

**Score:** 8/10 · Aanbeveling: ship

### ✅ Geslaagd
- Tailwind tokens: `visualPreview` gebruikt uitsluitend consistente `lab-*`-tokens (`lab-sage`, `lab-teal`, `lab-creamDeep`) — `src/config/agents/year1.tsx:1553-1577`. Geen hex-literals, geen niet-doeldomein tokens.
- Copy-lengte: eerste chatbericht (regel 1596-1607) telt ~65 woorden — binnen de grens van <80 voor leerjaar 1.
- Toegankelijkheid: geen kleur-only informatie; iconen (emoji) worden altijd met tekst gecombineerd.
- Geen dode klik-elementen — missie is pure chat, geen custom knoppen in de config zelf.

### ⚠️ Aandachtspunten
- **Visual Precision Gate**: unverified — geen Chrome-plugin-bewijs beschikbaar in deze pass (geen dev-server gestart). Alleen statische code gelezen.
- **Criterium 2 (layout-consistentie)**: n.v.t. voor een pure chatmissie zonder eigen scherm-layout — de gedeelde chat-UI-engine bepaalt het layout, niet deze config.

### ❌ Blocking issues
- Geen.

## 📚 Didactiek review

**Curriculum-plek:** Leerjaar 1, Periode 2 (`src/config/curriculum.ts:83`)
**SLO-claim:** 21D (AI), 21C (Data & Dataverwerking) · VSO 18C

**Score:** 8/10 · Bloom-balans: medium · Aanbeveling: ship

### ✅ Geslaagd
- SLO-codes correct: 21D en 21C zijn geldige regulier-codes, 18C geldige VSO-code — `src/config/slo-kerndoelen-mapping.ts:48`.
- SLO-fit: de missie laat leerlingen daadwerkelijk trainingsdata verzamelen en labelen (21C) en een model testen/bijsturen (21D) — geen oppervlakkig contact.
- Leerdoelen: `missionGoals.ts:91-98` levert een helder, meetbaar primair doel ("Ik train een AI-model met voorbeelden en controleer of de uitkomst klopt") met concreet evidence-criterium.
- Bloom-balans: de flow gaat van toepassen (voorbeelden geven) naar analyseren (voorspelling checken, twijfelgeval toevoegen) — passend bij leerjaar 1 met scaffolding via de agent.
- AI-as-copilot: de agent legt "Garbage In, Garbage Out" uit ná de eerste test in plaats van vooraf te verklappen, en vraagt steeds een vervolgstap van de leerling (regel 1585-1588) — geen antwoordenmachine.
- Curriculum-plek logisch: past bij thema "AI & Creatie" in periode 2, na `prompt-master` en `game-programmeur`.

### ⚠️ Aandachtspunten
- **Criterium 4 (opdracht-beknoptheid)**: de `systemInstruction` zelf (regel 1579-1615) is lang (~350 woorden), maar dat is instructietekst voor de AI-agent, niet leerling-gerichte UI-copy — geen bevinding, wel vermeld ter context.

### ❌ Blocking issues
- Geen.

## 🔧 Tech review

**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze review-pass.

### Static analyse

#### ✅ Geslaagd
- Geen dode knoppen: missie heeft geen eigen `<button>`-elementen; interactie loopt via de gedeelde chat-engine.
- `systemInstruction` gebruikt de gedeelde `SYSTEM_INSTRUCTION_SUFFIX` (regel 1615) — consistent met andere agent-rollen in hetzelfde bestand.
- Interactie-tags (`[TRAIN_A]`, `[TRAIN_B]`, `[PREDICT]`) zijn eenduidig gedefinieerd en aan een duidelijk protocol gekoppeld (regel 1590-1594).
- Client-zichtbare `systemInstruction` in `year1.tsx` is bekend projectpatroon (config-laag) — de daadwerkelijke coach-call loopt server-side; geen bevinding per bekende valkuil.

#### ⚠️ Aandachtspunten
- Geen aparte `configPath`/engine om error-states, loading-states of restart-safe state te controleren — deze missie leunt volledig op de gedeelde chat-engine, dus A2/A5/A6 zijn niet aan deze config toe te schrijven en vallen buiten de scope van dit bestand.

#### ❌ Blocking issues
- Geen.

### Score
Static: 7/8 toepasbaar (rest n.v.t. — gedeelde engine) · Dynamic: n.v.t. · Aanbeveling: ship

## Voorstellen

Geen mechanische fixes nodig binnen de whitelist-scope (`agents/year1.tsx`, `missionGoals.ts`, etc.) — de missie voldoet aan de rubric-criteria die op deze bestanden van toepassing zijn.

## Samenvatting & verdict

`ai-trainer` is een compacte, goed doordachte pure-chatmissie: heldere SLO-koppeling (21D/21C), een leerdoel met concreet evidence-criterium, en een systemInstruction die de leerling actief laat trainen/testen in plaats van passief te consumeren. Geen dode UI-elementen, geen token-inconsistenties, geen SLO-mismatch. De enige beperking is dat visuele/dynamische verificatie (Chrome-plugin, screenshots) in deze pass niet is uitgevoerd — dat blijft "unverified", niet "fail".

**Verdict: ok** (geen fix-eerst of herontwerp nodig)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
