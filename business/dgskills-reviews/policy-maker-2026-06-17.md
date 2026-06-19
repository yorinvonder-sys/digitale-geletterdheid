# Review: policy-maker (debate-arena)

**Datum:** 2026-06-17
**Missie-id:** `policy-maker`
**Template:** `debate-arena`
**SLO:** 23C | **Leerjaar:** 3 havo/vwo | **Week:** 3

**Verdict:** Inhoudelijk sterke missie met een goed gekozen dilemma en solide templatestructuur — een paar concrete verbeterpunten op UI en tech, geen blokkers.

---

## 🎨 Design review

### ✅ Goed

- Alle token-gebruik in de template-componenten (DebateArena.tsx, ArguePhase, ChallengePhase, ReflectPhase, PositionPhase) maakt gebruik van `duck-*` tokens: `duck-bg`, `duck-ink`, `duck-acid`, `duck-gray`. Geen hardcoded hexcodes in de template-laag zelf.
- Knoppenlogica is helder: Next-knoppen zijn disabled met duidelijke feedback-tekst ("Nog 1 argument nodig"), back-buttons hebben `aria-label`, focus-styling via Tailwind `focus:outline-none focus:border-duck-acid`.
- Copy is leeftijdsgeschikt (jr3 havo/vwo): introductietekst 83 woorden (limiet <120), instructies per fase beknopt en concreet.
- Responsieve layout: `max-w-md mx-auto` + `p-4`, geen vaste px-breedtes in de UI-componenten.
- `useMissionAutoSave` aanwezig — missie is restart-safe.

### ⚠️ Aandachtspunten

**1. Hardcoded hex in config (badges + ExplorePhase)**

In `policy-maker.ts` hebben alle badges `color: '#202023'` als hardcoded hex. De badge-kleur wordt waarschijnlijk doorgegeven aan `CompletionScreen` en mogelijk inline gerenderd. Dit is een tokenisatie-overtreding in de config-laag.

```
// policy-maker.ts:100-120 — VOOR
{ minScore: 80, emoji: '🏆', title: 'Debatmeester', color: '#202023' },
{ minScore: 60, emoji: '📋', title: 'Scherp Denker', color: '#202023' },
{ minScore: 40, emoji: '💬', title: 'Goed Bezig',   color: '#202023' },
{ minScore: 0,  emoji: '🌱', title: 'Aan de Start', color: '#202023' },

// NA (gebruik CSS-variabele of verwijder het veld als CompletionScreen een token-klasse verwacht)
{ minScore: 80, emoji: '🏆', title: 'Debatmeester', color: 'var(--color-duck-ink)' },
{ minScore: 60, emoji: '📋', title: 'Scherp Denker', color: 'var(--color-duck-ink)' },
{ minScore: 40, emoji: '💬', title: 'Goed Bezig',   color: 'var(--color-duck-ink)' },
{ minScore: 0,  emoji: '🌱', title: 'Aan de Start', color: 'var(--color-duck-ink)' },
```

**2. Hardcoded hex in ExplorePhase (borderColor + background)**

`ExplorePhase.tsx:85-92` gebruikt `style={{ borderColor: color }}` en `style={{ background: \`${color}10\` }}` waarbij `color` een hardcoded waarde is uit de `STAKEHOLDER_COLORS`-array (o.a. `'#ff3c21'`, `'#202023'`, `'#e1ff01'`). Dit is template-breed, niet policy-maker-specifiek, maar raakt wel deze missie.

```
// ExplorePhase.tsx:6 — VOOR
const STAKEHOLDER_COLORS = ['#ff3c21', '#202023', '#202023', '#202023', '#e1ff01', '#ff3c21'];

// NA (gebruik duck-* CSS-variabelen)
const STAKEHOLDER_COLORS = [
    'var(--color-duck-coral)',
    'var(--color-duck-ink)',
    'var(--color-duck-ink)',
    'var(--color-duck-ink)',
    'var(--color-duck-acid)',
    'var(--color-duck-coral)',
];
```

**3. ArguePhase: kleur-enige kwaliteitsindicator**

`ArguePhase.tsx:8-9` retourneert kleur + label voor kwaliteitsindicatoren, maar de kleur-dot (`w-2 h-2 rounded-full`) op regel 93 communiceert status uitsluitend via kleur zonder screenreader-tekst:

```
// ArguePhase.tsx:92-94 — VOOR
<span className="w-2 h-2 rounded-full shrink-0" style={{ background: q.color }} />
<span className="text-xs" style={{ color: q.color }}>{q.label}</span>

// NA (voeg sr-only toe of aria-label op het label-element)
<span className="w-2 h-2 rounded-full shrink-0" style={{ background: q.color }} aria-hidden="true" />
<span className="text-xs" style={{ color: q.color }}>{q.label}</span>
```

**4. Geen visuele verificatie**

Geen screenshot aanwezig in `public/screenshots/missions/` voor policy-maker. Visuele beoordeling deels op basis van token-audit — niet op gemaakte schermen.

### ❌ Blokkers

Geen.

---

## 📚 Didactiek review

### ✅ Goed

- **Doel aanwezig en concreet:** `missionObjective` in year3.tsx: *"Analyseer een technologisch dilemma, schrijf een beleidsvoorstel en beoordeel de impact."* — drie actieve werkwoorden (analyseer, schrijf, beoordeel), helder.
- **SLO 23C aansluiting is inhoudelijk sterk:** Het dilemma (gezichtsherkenning op scholen) raakt direct aan maatschappelijke impact van technologie, privacy vs. veiligheid, en EU AI Act-kaders. Dit is geen oppervlakkige koppeling.
- **Doel bereikbaar via de stappen:** Explore → Position → Argue → Challenge → Reflect dekt stakeholderanalyse, positiebepaling, argumentatie en reflectie. De beleidsadviseur-rol is coherent met de dilemma-opzet.
- **Bloom-balans:** Fases lopen van begrijpen (Explore) → evalueren (Position + Challenge) → creëren (Argue, onderbouwing). Geen all-recall of losse eval zonder scaffold.
- **Stakeholders zijn genuanceerd:** Vier perspectieven (ouder, leerling, wethouder, onderzoeker) met tegenstrijdige maar evenwichtige standpunten. Wethouder wijst expliciet op EU AI Act, onderzoeker op gebrek aan bewijs — dit is curriculumniveau didactisch verantwoord.
- **AI-als-copiloot:** `systemInstruction` stelt expliciet "Geef NOOIT een kant-en-klaar beleidsvoorstel. Stel vragen." Het debat-arena-template heeft geen live chat in de kernervaringen — de chat is via `enableChat: true` beschikbaar als zijkanaal, niet als antwoordenmachine.
- **Leeftijdsvocabulaire:** Termen als "stakeholders", "beleidsadviseur", "disproportionele inbreuk" zijn passend voor jr3 havo/vwo. Geen onverklaard jargon.
- **Wellbeing/inclusiviteit:** Het dilemma benoemt een kwetsbare groep (gepeste kinderen) zonder te dramatiseren. Geen aanval op specifieke geloofsrichtingen of groepen. Namen zijn divers (El Amrani, Roos, De Groot, Bakker).

### ⚠️ Aandachtspunten

**5. `missionGoal` ontbreekt in config — terugval op `getMissionGoal()`**

In `policy-maker.ts` is het optionele `missionGoal`-veld niet ingevuld. `DebateArena.tsx:176` valt terug op `getMissionGoal(config.missionId)`. Grep op `missionGoals.ts` toont geen `policy-maker`-entry. Dit betekent dat de `IntroScreen` het goal-blok mogelijk leeg toont of wegvalt. Voeg een expliciet `missionGoal` toe:

```
// policy-maker.ts:3 — NA (voeg toe na `missionId`)
missionGoal: {
    primaryGoal: 'Analyseer een technologisch dilemma vanuit meerdere perspectieven en schrijf een onderbouwd beleidsadvies.',
    objectives: [
        'Benoem de belangen van minimaal 4 stakeholders bij het dilemma.',
        'Onderbouw je positie met minimaal 2 argumenten.',
        'Beoordeel de impact van jouw beleidsadvies op verschillende groepen.',
    ],
},
```

**6. Mismatch `missionObjective` vs. wat de missie feitelijk doet**

`missionObjective` in year3.tsx beschrijft *"schrijf een beleidsvoorstel"*, maar het debate-arena-template heeft geen vrij beleidsvoorstel-schrijfstap. Stap 3 (ArguePhase) vraagt om argumenten voor een al gekozen positie — dat is argumenteren, niet zelfstandig een beleidsvoorstel formuleren. De chatmodus (via `enableChat`) biedt die ruimte wel, maar is optioneel.

ESCALATIE (niet auto-fixbaar): Overweeg of de `missionObjective` moet worden bijgesteld naar *"Bouw argumenten voor een beleidsstandpunt en verdedig dat tegen tegenargumenten"* — of dat de ArguePhase een extra vrij schrijfveld voor een samenvatting van het beleidsadvies moet krijgen.

**7. Introductietekst telt 83 woorden — grensgebied jr3-norm (<120)**

Introductie is acceptabel maar aan de bovenkant. De `introFeatures`-bullet-lijst voegt contextuele woorden toe die meetellen bij cognitieve belasting op het introscherm.

**8. `argumentPrompts` worden niet gebruikt in de UI**

De config bevat:
```
argumentPrompts: ['Mijn beleidsadvies is...', 'De reden daarvoor is...', 'De groep die het meest geraakt wordt is...']
```
`ArguePhase.tsx` toont geen prompts op basis van dit veld — de textareas hebben vaste placeholder-teksten. De prompts in de config zijn daardoor dode data.

```
// ArguePhase.tsx:79 — VOOR (vaste placeholder)
placeholder="Geef jouw standpunt weer in eigen woorden..."

// NA (gebruik config.argumentPrompts[activeArgumentIndex] als beschikbaar)
placeholder={config.argumentPrompts?.[state.activeArgumentIndex] ?? "Geef jouw standpunt weer in eigen woorden..."}
```

### ❌ Blokkers

Geen harde didactische blokker. Punt 6 (doel-stap-mismatch) is een inhoudelijk risico maar geen showstopper zolang de chatmodus het beleidsvoorstel-schrijven faciliteert.

---

## 🔧 Tech review

### ✅ Goed

- **`useMissionAutoSave` aanwezig** in `DebateArena.tsx:141` — state is restart-safe.
- **`clearSave()` bij completion** — regel 249, schoon.
- **`@/*` imports** correct gebruikt (`@/hooks/useMissionAutoSave`, `@/config/missionGoals`).
- **Loading + error voor async config** (`DebateArena.tsx:371-381`): loadError-state en LoadingScreen aanwezig, dynamische import is try/catch-equivalent via `.catch(() => setLoadError(true))`.
- **TS-types clean:** `DebateArenaConfig`, `DebateArenaState`, `ArgumentEntry` allemaal gedefinieerd zonder `any`. De props-interfaces zijn volledig.
- **`templateRegistry.ts` registratie aanwezig:** regel 91 — `chatRoleId: 'policy-maker'` klopt met `year3.tsx:1238`.
- **SLO-mapping aanwezig:** `slo-kerndoelen-mapping.ts:176`.
- **Knop-onClick altijd gekoppeld:** alle knoppen in de 5 fase-componenten hebben handlers. Geen dode knoppen gevonden.
- **XSS-risico laag:** alle content wordt via React gerenderd (geen `dangerouslySetInnerHTML`). Stakeholder-teksten komen uit de config, niet uit user-input.

### ⚠️ Aandachtspunten

**9. `systemInstruction` staat client-side in year3.tsx**

De volledige `systemInstruction` van de policy-maker-agent is als string opgenomen in `src/config/agents/year3.tsx` (client-bundled). De templateRegistry registreert `chatRoleId: 'policy-maker'` en de chat-interactie gaat via `roleId` naar een edge function — maar de instruction-tekst zelf is zichtbaar in de client-bundle.

ESCALATIE (niet auto-fixbaar): Controleer of de edge function de `systemInstruction` server-side ophaalt op basis van `roleId`, of dat de client de volledige instructietekst meestuurt. Als het tweede het geval is, is dit een security-risico (prompt-injection mogelijkheden via manipulatie). De instruction bevat scope-guards en pedagogische regels — die moeten server-side autoritatief zijn.

**10. `promptSanitizer` check niet verifieerbaar vanuit config**

De missie-CLAUDE.md vereist dat leerling-input gesanitized wordt vóór AI-aanroepen. Vanuit de template (DebateArena + sub-phases) gaat geen leerling-input direct naar een AI-call — tekstvelden slaan op in state. De chat-route loopt via `chatRoleId`. Niet verifieerbaar zonder de chat-component te lezen of de edge function te inspecteren.

ESCALATIE (niet auto-fixbaar): Verifieer dat de chat-component `promptSanitizer` toepast op user-input vóór `supabase.functions.invoke`. Dit is buiten de scope van de debate-arena-template zelf.

**11. Score-formule: mismatch 'max 20 per vraag' vs. reflectionScore**

`calcScore` (DebateArena.tsx:122-127) berekent reflectie als `aantal-beantwoorde-vragen × 10`. Met 2 reflectievragen = max 20. Totalcap: 10 (stakeholders) + 10 (positie) + 50 (argumenten) + 10 (counter) + 20 (reflectie) = 100. Dat klopt met `maxScore: 100`. Geen bug, maar de formule is impliciet afhankelijk van `reflectionQuestions.length`. Als een config 3 vragen heeft, is de max 110 — dan knipt `Math.min(score, maxScore)` dat af zonder dat de scoreweergave per onderdeel klopt. Policy-maker heeft precies 2 vragen, dus nu correct.

```
// DebateArena.tsx:193 — resultaat-faseberekening
score: config.reflectionQuestions.filter(...).length * 10, max: config.reflectionQuestions.length * 10
```
Dit klopt met de formule. Geen actie vereist voor policy-maker, maar een opmerking voor toekomstige configs.

### ❌ Blokkers

Geen technische blokkers voor policy-maker zelf.

---

## Samenvatting bevindingen

| # | As | Ernst | Omschrijving |
|---|-----|-------|---|
| 1 | UI | ⚠️ | Badge-colors hardcoded `#202023` in config |
| 2 | UI | ⚠️ | STAKEHOLDER_COLORS hardcoded hex in ExplorePhase |
| 3 | UI/a11y | ⚠️ | Kleur-enige kwaliteitsdot zonder sr-tekst |
| 4 | UI | ℹ️ | Geen screenshot beschikbaar |
| 5 | Didactiek | ⚠️ | `missionGoal` ontbreekt → lege IntroScreen goal-blok |
| 6 | Didactiek | ESCALATIE | `missionObjective` beschrijft "schrijf beleidsvoorstel" maar template doet dat niet |
| 7 | Didactiek | ℹ️ | Introductie 83w, grensgebied |
| 8 | Didactiek/Tech | ⚠️ | `argumentPrompts` dode data in config |
| 9 | Tech | ESCALATIE | `systemInstruction` mogelijk client-side in bundle |
| 10 | Tech | ESCALATIE | `promptSanitizer` op chat-input niet verifieerbaar |
| 11 | Tech | ℹ️ | Score-formule kwetsbaar voor configs met >2 reflectievragen |

**Auto-fixbaar:** #1, #2, #3, #5, #8 (5 items)
**Escalaties:** #6, #9, #10 (3 items)
