# Missie-review: Website Bouwer

**Mission ID:** website-bouwer
**Template:** builder-canvas
**Curriculum-plek:** Leerjaar 1, Periode 2
**Datum:** 2026-07-02
**Reviewer-pipeline:** dgskills-mission-review v1.0 (wave 14, verse review)

---

## Registratie-check (10-punts patroon)

| Bron | Status | Bewijs |
|---|---|---|
| Config | ✅ | `src/features/missions/templates/builder-canvas/configs/website-bouwer.ts` |
| Agent-rol (year1.tsx) | ✅ | `src/config/agents/year1.tsx:4046` |
| `RoleId`-union | ✅ | `src/types.ts:25` |
| `AGENT_ROLE_IDS` | ✅ | `src/config/agentRoleIds.ts:101` |
| `curriculum.ts` | ✅ | `src/config/curriculum.ts:90` — Leerjaar 1, Periode 2 |
| `slo-kerndoelen-mapping.ts` (autoritair) | ✅ | `src/config/slo-kerndoelen-mapping.ts:53` — `22B`, `22A` (regulier), `19A` (VSO) |
| `missionGoals.ts` | ✅ | `src/config/missionGoals.ts:150-157` — primaryGoal/criteria/evidence consistent met config |
| `chatRoleId` | ✅ | `chatRoleId: 'website-bouwer'`, `enableChat: true` — koppeling correct |

Geen desyncs gevonden — alle registratiepunten kloppen.

---

## 🎨 Design review

**Score: 8/10**

### ✅ Geslaagd

- **Missie-specifieke live browser-preview:** `PreviewPanel.tsx:44,70-84` bevat een `showHtmlPreview`-tak die UITSLUITEND voor `website-bouwer` een echte iframe-preview rendert van de door de leerling geschreven HTML/CSS (`buildSafeHtmlPreview`). Dit is een bewuste, missie-specifieke uitbreiding van de generieke `text-preview` — geen andere builder-canvas-missie krijgt dit. Didactisch sterk: sluit direct aan bij het kernconcept "de browser leest je code".
- **Duck-tokens correct:** engine gebruikt uitsluitend `duck-ink`, `duck-acid`, `duck-gray` — alle binnen de toegestane 6-token-set, geen legacy `lab-*` in de builder-canvas-engine zelf.
- **Badges met oplopende drempels en coherente titels** (`0/25/50/70/90`), passend bij de 4-stappen-opbouw.
- **Coherente visuele opbouw:** checklist-item-status (done/actief/inactief) consequent gekleurd via dezelfde 3 tokens.

### ⚠️ Aandachtspunten

- **Agent-briefingkaart gebruikt legacy `lab-*`-tokens:** de `visualPreview` in `year1.tsx` (regel ~4059-4072) gebruikt `bg-lab-sage`, `from-lab-coral`, `to-lab-teal`. Dit is de missie-selectiekaart (buiten de missie-UI zelf), niet de builder-canvas-engine — beperkte impact, maar niet on-brand met de duck-migratie.
  - **Voorstel:** vervang bij een volgende brede agent-briefing-duck-pas (niet uniek voor deze missie — vermoedelijk platform-breed patroon in `year1.tsx`, geen aparte actie hier nodig).
- **Visual Precision Gate — unverified:** geen screenshots-map beschikbaar deze pass (geen dev-server-run in scope), en `website-bouwer` wordt niet genoemd in de UI/UX-review van 2026-06-30. Statische analyse toont geen evidente overlap/afkap-risico's; de missie-specifieke iframe-preview (`h-56 w-full`) is een nieuw element t.o.v. andere builder-canvas-missies en verdient een echte visuele check bij een volgende live-pass.

### ❌ Blocking issues

Geen.

---

## 📚 Didactiek review

**Score: 9/10**
**SLO-claim:** 22B, 22A (regulier) · 19A (VSO)

### ✅ Geslaagd

- **Concreet, motiverend leerdoel:** "Ik bouw een werkende Over Mij-webpagina met HTML, CSS en een korte uitleg van mijn keuzes" — tastbaar eindproduct, geen abstracte vaardigheid.
- **Echt probleem, geen kunstmatige oefening:** briefing verankert de missie in herkenbare realiteit ("Elke website die je bezoekt — van YouTube tot je schoolsite — is gemaakt met code").
- **Sterke scaffolding, oplopende moeilijkheid:** HTML-structuur → CSS-stijl → persoonlijke inhoud → reflectie. Elke stap bouwt letterlijk voort op de vorige (dezelfde pagina wordt uitgebreid).
- **Expliciete "coach, geen antwoordenmachine"-regels:** "Geef NOOIT de volledige HTML in één keer. Bouw element voor element op", "Als de leerling vastloopt: geef de exacte code, maar slechts 1 regel" — sterke AI-copiloot-discipline, geen kortsluiting van het leerproces.
- **Reflectiestap (Bloom 2-3):** stap 4 vraagt niet alleen "wat deed je" maar "leg het verschil tussen HTML en CSS uit" + "wat vond je het lastigst en waarom" — een expliciete metacognitieve/verklarende vraag, sterker dan de kale Bloom-1/2-only die bij andere missies opduikt.
- **Leeftijdspassende taal zonder jargon:** systemInstruction verbiedt expliciet "DOM", "element", "nesting" en verplicht "tag", "onderdeel", "erin zetten" — consistent doorgevoerd.
- **Veilige/fictieve data-sturing:** briefing + eerste bericht sturen expliciet naar "veilige of fictieve persoonlijke informatie"; coach-regel herhaalt dit ("Als de leerling persoonlijke gegevens wil plaatsen, stuur naar veilige fictieve of algemene gegevens").
- **`alt`-attribuut als expliciet leerdoel** (toegankelijkheid als onderdeel van de vakinhoud, niet alleen als technisch vinkje) — didactisch net iets rijker dan een kale HTML-tag-opsomming.
- **Coach-plan-desync-check:** systemInstruction beschrijft exact "STAP 1 t/m 4" congruent met de 4 config-stappen (`html-basis`, `css-stijl`, `content`, `reflectie`) — geen desync. (Bekend: markers zijn functioneel inert in builder-canvas, alleen coaching-tekstkwaliteit telt — hier is die kwaliteit goed.)

### ⚠️ Aandachtspunten

- **SLO 22B-fit is sterk, 22A iets impliciet:** 22B (basis programmeerconcepten/code) wordt zeer direct gedekt. 22A (digitaal product met doel ontwerpen) is aanwezig maar het "doel" van de pagina (een persoonlijk portfolio-achtig Over Mij) blijft impliciet — geen expliciete zin die het productdoel benoemt.
  - **Voorstel (niet-blocking):** één zin toevoegen aan `introDescription` of stap 3: "Deze pagina is jouw eerste digitale visitekaartje — iets wat je aan een ander zou kunnen laten zien."
- **Geen exemplarische foutmelding-preview voor de leerling zelf:** de systemInstruction heeft een "VEELGEMAAKTE FOUTEN"-sectie voor de AI-coach, maar de checklistItems/instructions in de config zelf bevatten geen expliciete waarschuwing vooraf (bv. "vergeet de sluit-tag niet" staat wél in de `tip`-velden — dit is dus eigenlijk al gedekt, geen actie nodig).

### ❌ Blocking issues

Geen.

---

## 🔧 Tech review

**Score: 8.5/10**
**Dynamic verificatie:** niet uitgevoerd deze pass (geen dev-server/screenshots in scope).

### ✅ Geslaagd

- **Sandbox-discipline op de HTML-preview (hoogste prioriteit voor deze missie):** `PreviewPanel.tsx:78-84` — `sandbox=""` (strengste iframe-sandbox-instelling, geen scripts/forms/same-origin), `referrerPolicy="no-referrer"`, en `buildSafeHtmlPreview` strip expliciet `<script>`, `<iframe>`, `<object>`, `<embed>`, alle `on*`-event-handlers, en alle `href`/`src` naar `javascript:`, `data:` of externe `https?://`-URL's (`PreviewPanel.tsx:11-18`). Aanvullende CSP in de preview-HTML zelf (`default-src 'none'; img-src 'self'`). Dit is precies het juiste beveiligingsniveau voor een missie waar leerlingen vrije HTML mogen typen die live gerenderd wordt.
- **`maxScore: 100` consistent met `steps-complete, min: 4`** — 4 stappen × standaard builder-canvas-puntentelling, geen scoreplafond-mismatch gevonden.
- **Registratie 100% compleet** (zie tabel bovenaan) — alle 10 platform-bouwstenen aanwezig en consistent.
- **Engine-breed: geen `STEP_COMPLETE`-referenties in builder-canvas** (`BuilderCanvas.tsx` + alle `sub/*.tsx`) — bevestigt dat de "STAP-VOLTOOIING"-tekst in de systemInstruction puur coaching-copy is, geen functionele marker-afhankelijkheid. Coach-tekst en config-stappen zijn 1-op-1 congruent (geen desync).
- **`chatRoleId` correct gekoppeld** aan `enableChat: true` — chat-functionaliteit is actief (niet dormant) voor deze missie.

### ⚠️ Aandachtspunten

- **Missie-specifieke conditional in gedeelde engine-file (`config.missionId === 'website-bouwer'`):** `PreviewPanel.tsx:44` hardcode't de mission-ID-check in de gedeelde builder-canvas-engine i.p.v. een config-veld (bv. `enableHtmlPreview: true`) te gebruiken. Werkt functioneel correct, maar is een lichte architectuur-wratje: een toekomstige tweede HTML/CSS-missie zou dezelfde hardcoded string-check moeten herhalen of de engine moeten aanpassen.
  - **Voorstel (laag risico, niet-blocking):** bij een volgende builder-canvas-missie die ook code-preview nodig heeft, dit refactoren naar een config-flag. Geen actie nodig voor deze missie alleen.
- **Geen automatische validatie dat leerling-HTML daadwerkelijk geldige tags bevat vóór de checklist als "compleet" telt** — checklistItems zijn zelf-gerapporteerd (leerling vinkt af), niet code-geverifieerd. Dit is een bekend, platform-breed patroon in builder-canvas (zelfrapportage i.p.v. code-parsing) en geen missie-specifiek gebrek.

### ❌ Blocking issues

Geen.

---

## Samenvatting

- **Geslaagd:** design 4/5 · didactiek 8/9 · tech 5/6 substantiële criteria
- **Blocking:** 0
- **Resterende issues:** 1 design (legacy `lab-*` in agent-briefingkaart, platform-breed patroon) · 1 didactiek (22A-productdoel iets impliciet) · 1 tech (hardcoded missionId-check i.p.v. config-flag) — alle laag risico, geen showstoppers
- **Sterkste punt:** de missie-specifieke live HTML/CSS-browser-preview met sandbox-discipline (`sandbox=""` + CSP + tag-stripping) is een zorgvuldig doordacht, missie-uniek stuk techniek dat direct het kernleerdoel visualiseert — dit is boven het gemiddelde niveau van builder-canvas-missies.
- **Coach-plan-desync-platformpunt:** deze missie hoort NIET bij de 5 al-geraakte desync-missies — systemInstruction en config-stappen zijn 1-op-1 congruent (4 stappen, geen mismatch).

**Triage-score:** 1.45 (laag = gezond; schaal (10-design)×0.3 + (10-didactiek)×0.4 + (10-tech)×0.3)

**Verdict: ship**

---

## Codex-gate (M1)

**Niet uitgevoerd deze pass** — token-discipline batch-review (wave 14) beperkt scope tot statische drie-rubriek-analyse zonder adversarial gate. Score en verdict zijn ruim boven de ship-drempel; Codex-gate niet noodzakelijk vóór release, wel aanbevolen als onderdeel van een periodieke platform-brede adversarial sweep.
