# Missie-review: digital-forensics

**Datum:** 2026-08-25
**TemplateType:** scenario-engine
**AI-gedrag & privacy:** aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review — score 7.5/10

### ✅ Geslaagd
- Content-structuur (intro, 4 rondes, badges, takeaways) volgt het scenario-engine-contract exact; geen ontbrekende velden.
- Copy-lengte per item (titel + beschrijving + uitleg) past ruim binnen leesbare kaartgrootte; geen afgekapte teksten te verwachten.
- Consistente iconografie per item (🔁🌅🕒📁📤🔍🖨️🔑 etc.) ondersteunt scanbaarheid.

### ⚠️ Aandachtspunten
- **Badge-kleuren zonder differentiatie** (`digital-forensics.ts:19,25,31,37`): alle vier de badge-tiers (80/60/40/0) gebruiken hetzelfde hex-literal `'#202023'` (duck-ink). Andere scenario-configs in dezelfde familie variëren doorgaans per tier (bv. acid/goud/grijs) zodat een leerling in één oogopslag ziet welk niveau hij haalde. Hier ontbreekt dat visuele verschil volledig — vier verschillende titels met identieke kleur oogt als een kopieerfout, niet als bewuste keuze.
- Hex-literal in plaats van een `duck-*`-token-referentie; niet blocking (de engine rendert dit als inline style, dus een token is hier sowieso niet direct bruikbaar), maar wel inconsistent met het patroon in vergelijkbare configs.

### ❌ Blocking issues
- Geen op config-niveau. Zie Tech-sectie voor het geërfde engine-defect dat deze missie wél blokkeert.

**Visual Precision Gate:** unverified — geen dev-server/Chrome-plugin bewijs beschikbaar in deze pass; alleen static content-analyse uitgevoerd.

---

## 📚 Didactiek review — score 8.5/10

### ✅ Geslaagd
- SLO-fit klopt: `['23A', '21C']` (`slo-kerndoelen-mapping.ts:176`) — logdata analyseren en chronologisch ordenen dekt "informatie verwerken en presenteren" (23A) en "gegevens interpreteren" (21C); de inline comment onderbouwt de 21A→21C-herclassificatie correct.
- Sterke Bloom-balans over de vier rondes: onthouden/herkennen (ronde 1: patronen spotten), toepassen (ronde 2: tijdlijn bouwen), analyseren/evalueren (ronde 3: feit vs. aanname), kennis van professionele standaarden (ronde 4: protocol). Dit is precies de opbouw die van een forensisch-thema wordt verwacht.
- Narratieve coherentie: dezelfde synthetische casus (portscan van 10.0.5.44, account_doctor_01, 847 dossiers) loopt door rondes 1-3 heen — leerlingen bouwen één samenhangend incident op in plaats van losse quizvragen.
- Expliciete disclaimers ("uitsluitend fictieve, synthetische incidentdata") in intro én ronde 2-beschrijving voorkomen verwarring met echte patiëntgegevens.
- Curriculum-plek logisch: J3P2 "Digitale Weerbaarheid & Security", naast cyber-detective/encryption-expert/phishing-fighter/security-auditor (`curriculum.ts:277-282`) — thematisch een goede afsluiter van dat blok vóór de `security-review`-toets.

### ⚠️ Aandachtspunten
- Ronde 3, item 3 ("Het aanvals-IP-adres 10.0.5.44 is een intern netwerkapparaat") kwalificeert een technisch-correcte afleiding (RFC 1918) als "feit" naast items die letterlijk uit een logregel worden overgenomen (bv. item 1, de timestamp). Didactisch is het onderscheid tussen "direct afleesbaar feit" en "correct afgeleide conclusie" subtiel en wordt niet expliciet toegelicht — een leerling die dat verschil niet doorgrondt kan de uitleg als tegenstrijdig ervaren met de titel van de ronde ("Feit of aanname?"). Geen blocker, wel een kans om de uitleg iets scherper te maken (zie voorstel).

### ❌ Blocking issues
Geen.

**SLO-fit oordeel:** claim en werkelijkheid komen overeen.

---

## 🔧 Tech review — score 4/10

*Alleen Fase A (static) uitgevoerd; geen dev-server/dynamic-verificatie in deze pass.*

### Static analyse

#### ✅ Geslaagd
- Config-schema volledig en typesafe conform `ScenarioEngineConfig`; geen ontbrekende verplichte velden.
- `missionGoals.ts:315-321` gebruikt `criteria.type: 'rounds-complete'` — **niet** het `threshold: 60`-patroon van online-helden/factchecker/ai-bias-detective. De 40%-vs-60-drempel-mismatch uit de engine-herbeoordeling (zie hieronder) raakt deze drie missies wél, maar **niet** digital-forensics.
- `templateRegistry.ts:19` en de curriculum-entry zijn consistent met `missionId: 'digital-forensics'`.
- Geen `bonusPoints`/`followUpWeight` gebruikt in deze config → het bekende `adjustedScoreRound`-bonuscontract-defect uit de engine raakt deze missie niet.

#### ⚠️ Aandachtspunten (geërfd van de gedeelde engine, direct van toepassing)
- **Order-priority zonder gokcorrectie** (ronde 'tijdlijn-bouwen', 5 items, `ScenarioEngine`-scoreformule in `sub/FeedbackBanner.tsx:39`): deze scoreformule mist de basislijn-correctie die select-correct en binary-choice wél hebben. Bij een ronde van 5 items levert klakkeloos van boven naar beneden klikken gemiddeld 9/25 op, en 16% van de leerlingen haalt daarmee toevallig de "bijna foutloos"-drempel. Dit is een reëel risico voor déze missie, want ronde 2 is precies zo'n 5-items-ronde.
- **Geen focusbeheer bij rondewisseling** (`ScenarioEngine.tsx:289`): raakt alle vier de rondes van deze missie gelijk — toetsenbord-/schermlezergebruikers krijgen geen aankondiging bij de overgang tussen ronde 1→2→3→4.

#### ❌ Blocking issues (geërfd van de gedeelde engine, direct van toepassing)
- **Doodlopend eindscherm onder 40%** (`ScenarioEngine.tsx:328`, `CompletionScreen.tsx:165-166`): geldt voor alle 12 scenario-missies, dus ook digital-forensics. Een leerling die onder 40% scoort krijgt een uitgeschakelde voltooi-knop zonder `onRetry`, zonder terugknop — en `phase: 'results'` wordt opgeslagen, dus elk volgend bezoek herstelt dezelfde vastgelopen staat. Dit is een engine-brede fix, niet oplosbaar binnen de config-whitelist van deze missie.

### Dynamic verificatie
Niet uitgevoerd in deze pass (geen dev-server-bewijs beschikbaar aan deze sub-agent). Aanbevolen vóór ship: multi-viewport visuele check van de vier rondetypes (select-correct ×2, order-priority, binary-choice).

---

## Voorstellen

### 1. Badge-kleuren differentiëren (design, autofixable)

**Voor** (`src/features/missions/templates/scenario-engine/configs/digital-forensics.ts`, regels 19-42):
```ts
badges: [
    { minScore: 80, emoji: '🏆', title: 'Hoofd Forensisch Analist', color: '#202023' },
    { minScore: 60, emoji: '🔍', title: 'Digitale Speurder', color: '#202023' },
    { minScore: 40, emoji: '📚', title: 'Goed Begonnen', color: '#202023' },
    { minScore: 0, emoji: '🌱', title: 'Blijf Oefenen', color: '#202023' },
],
```

**Na:**
```ts
badges: [
    { minScore: 80, emoji: '🏆', title: 'Hoofd Forensisch Analist', color: '#202023' },
    { minScore: 60, emoji: '🔍', title: 'Digitale Speurder', color: '#3d3d42' },
    { minScore: 40, emoji: '📚', title: 'Goed Begonnen', color: '#6b6b70' },
    { minScore: 0, emoji: '🌱', title: 'Blijf Oefenen', color: '#9a9a9e' },
],
```
*Toelichting: aflopende donker-naar-licht gradatie op dezelfde duck-ink-basis geeft de vier niveaus zichtbaar onderscheid zonder een nieuwe kleurfamilie te introduceren.*

### 2. Feit/aanname-uitleg scherper (didactiek, autofixable)

**Voor** (regels 275-279, item 3 van ronde 'feit-of-aanname'):
```ts
explanation:
    'Dit is een feit — een technisch bewezen gegeven. 10.0.0.0/8 is een gereserveerd privéadresbereik. Dit IP-adres kan nooit van buiten het netwerk afkomstig zijn.',
```

**Na:**
```ts
explanation:
    'Dit is een feit — geen mening, maar een technisch afleidbaar gegeven uit een vaste standaard (RFC 1918: 10.0.0.0/8 is altijd een privéadres). Net als de timestamp in item 1 staat dit onomstotelijk vast, ook al lees je het niet letterlijk af maar leid je het af uit een technische regel.',
```
*Toelichting: legt expliciet uit waarom een afgeleid gegeven toch als "feit" telt, in plaats van dat als vanzelfsprekend te veronderstellen.*

### 3. Order-priority gokcorrectie en dood-lopend eindscherm

Beide zijn **engine-brede** defecten (`ScenarioEngine.tsx`, `sub/FeedbackBanner.tsx`, `sub/CompletionScreen.tsx`) die buiten de missie-config-whitelist vallen. Zie **Escalaties** hieronder — niet autofixable op missieniveau.

---

## Samenvatting & verdict

Digital-forensics is inhoudelijk een sterke missie: heldere SLO-fit, coherente casus over vier rondes, en een goed gekozen scoringstype (`rounds-complete`) dat de bekende 40/60-drempelbug omzeilt die drie andere missies wél raakt. De config zelf heeft alleen kleine, mechanisch te fixen punten (badge-kleuren, één uitleg-zin).

Het echte probleem zit in de gedeelde scenario-engine: een blokkerend dood-lopend eindscherm onder 40% score (alle 12 scenario-missies) en een ontbrekende gokcorrectie in de order-priority-ronde die deze missie direct raakt (5-items-ronde in 'tijdlijn-bouwen'). Beide zijn al vastgelegd in de engine-herbeoordeling en vallen buiten de mission-config-whitelist van deze review.

**Verdict: fix-eerst** — niet vanwege de missie-inhoud zelf, maar omdat de missie pas veilig naar leerlingen kan zodra de engine-brede dood-lopend-eindscherm-fix is doorgevoerd.
