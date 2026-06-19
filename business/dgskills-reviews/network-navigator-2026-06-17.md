# Review: network-navigator — 2026-06-17

**Mission-ID:** network-navigator  
**Template:** data-viewer  
**Reviewer:** Claude Sonnet 4.6 (geautomatiseerde review)  
**Verdict:** Solide, goed uitgewerkte missie met drie duidelijke datasets — kleine technische en designverbeteringen nodig, geen fundamentele blokkers.

---

## 🎨 Design review

### ✅ Goed
- Alle Tailwind-klassen in `DataViewer.tsx` en `InteractiveTable.tsx` gebruiken `duck-*`-tokens (duck-ink, duck-acid, duck-bg, duck-gray). Geen hardcoded hex in de template.
- Knoppen hebben duidelijke hover-states (`hover:border-duck-acid/40`, `hover:brightness-95`).
- De "Bevestigen"-knop is correct disabled met visuele feedback (`disabled:opacity-40 disabled:cursor-not-allowed`).
- AI-chat-knop heeft een `aria-label="Open AI-assistent"` — correct.
- Responsive: `max-w-lg mx-auto px-4` zorgt voor mobile-first layout; `overflow-x-auto` op tabel.
- Framer Motion afwezig — dat is correct voor dit template (geen animatie nodig die afleidend zou zijn bij data-analyse).
- Feedback na submit gebruikt kleur + icoon gecombineerd (CheckCircle/XCircle + tekst) — niet alleen kleur.

### ⚠️ Aandachtspunten

**1. Hardcoded hex in config (badge-kleuren en chart-kleuren)**

`src/features/missions/templates/data-viewer/configs/network-navigator.ts:96-101` (chartData-kleuren):
```ts
// VOOR:
{ label: 'Google.nl', value: 8, color: '#202023' },
{ label: 'Instagram', value: 34, color: '#ff3c21' },
{ label: 'Amazon.com', value: 72, color: '#e1ff01' },
```
```ts
// NA (indien de datatype `color` een CSS-variabelenaam of token ondersteunt):
// Optie A — laat color weg als het default duck-ink is (meest veilig):
{ label: 'Google.nl', value: 8 },
// Optie B — gebruik CSS-var als SimpleChart dat ondersteunt:
{ label: 'Google.nl', value: 8, color: 'var(--duck-ink)' },
```
Check eerst of `SimpleChart` CSS-variabelen als `color`-prop accepteert.

`src/features/missions/templates/data-viewer/configs/network-navigator.ts:198-222` (badge-kleuren):
```ts
// VOOR:
{ minScore: 85, emoji: '🌐', title: 'Netwerk Engineer!', color: '#202023' },
{ minScore: 65, emoji: '📡', title: 'Internetdetective', color: '#202023' },
{ minScore: 40, emoji: '🔌', title: 'Netwerk Verkenner', color: '#202023' },
{ minScore: 0,  emoji: '📚', title: 'Aan de slag!',      color: '#202023' },
// NA:
{ minScore: 85, emoji: '🌐', title: 'Netwerk Engineer!', color: 'duck-ink' },
// (of wat de BadgeConfig-type verwacht — checken in shared/types.ts)
```

**2. Gradient-knop geeft geen echte gradiënt**

`DataViewer.tsx:237` en `:448`:
```tsx
// VOOR (gradient van en naar dezelfde kleur = zinloos):
className="... bg-gradient-to-r from-duck-acid to-duck-acid ..."
// NA:
className="... bg-duck-acid ..."
```
Dit is een template-breed issue, niet specifiek voor network-navigator, maar het staat in de shared component.

**3. Geen aria-label op sorteerbare tabelkoppen**

`InteractiveTable.tsx:90`:
```tsx
// VOOR:
onClick={() => col.sortable !== false && handleSort(col.key)}
// NA:
onClick={() => col.sortable !== false && handleSort(col.key)}
aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
role="columnheader"
```
Screenreaders kunnen niet afleiden dat een kolom sorteerbaar is of wat de huidige sorteervolgorde is.

**4. Filterinputs missen labels**

`InteractiveTable.tsx:64-73`: Filterinputs hebben alleen `placeholder`, geen `<label>` of `aria-label`.
```tsx
// NA:
<input
  aria-label={`Filter op ${col.label}`}
  ...
/>
```

### ❌ Blokkers
Geen designblokkers.

---

## 📚 Didactiek review

### ✅ Goed

**Doelstelling aanwezig en concreet:**
`missionGoal.primaryGoal` = "Ik leg uit hoe een bericht door het internet reist en gebruik data om netwerkproblemen te herkennen." — Eerste persoon, actieve formulering, concreet meetbaar. Goed.

**Doel wordt bereikt door de stappen:**
- Dataset 1 (tabel): leerling analyseert de stappen van een Instagram-bericht → kwantitatief (totaaltijd berekenen), feitelijk (DNS-functie), observatie (latency). Dekt de "uitleg hoe een bericht reist"-kant volledig.
- Dataset 2 (staafgrafiek): vergelijken reactietijden, rekensom (hoe vaak trager), verklaring CDN/locatie. Dekt de data-analysecomponent.
- Dataset 3 (document-cards): HTTP-foutcodes herkennen en uitleggen. Dekt de "netwerkproblemen herkennen"-kant.

Het doel wordt aantoonbaar bereikt door de opbouw.

**SLO-fit:**
- SLO 21A (digitale geletterdheid) via slo-kerndoelen-mapping.ts. De inhoud (hoe het internet werkt, data analyseren om problemen te herkennen) past bij kerndoel 21A dat betrekking heeft op begrip van ICT-systemen en informatieverwerking. Geen oppervlakkige mapping.

**Bloom-balans:**
- Herkennen (vraag q1, q4, q7: meerkeuze-feitjes)
- Begrijpen/toepassen (q2 DNS-functie; q5 rekensom; q8 uitleg verschil 404 vs 500)
- Analyseren (q3 observatie over latency; q6 verklaring Amazon-traagheid)
Verdeling is goed: niet al-recall, niet ongestoffeerde evaluatie/creatie. Past bij jaargroep 2 / mavo-havo-vwo.

**Leeftijdsappropriate taal (jr2 = ~14 jaar):**
- Intro: 79 woorden — net binnen de jr3-limiet (<120w), acceptabel voor jr2 met rijkere context.
- Dataset-beschrijvingen: 30-52 woorden per stuk — goed.
- Uitleg bij antwoorden (explanation): informatief, geen jargon zonder uitleg, vergelijkingen gebruikt (telefoonboek, sorteercentrum).

**AI-als-copiloot:**
- `systemInstruction` verbiedt expliciete antwoorden ("Geef NOOIT een volledig antwoord"), vraagt de leerling eerst na te denken via concrete ingangsvragen. Correct patroon.
- De data-viewer-missie heeft `enableChat` niet gezet in de config — de AI-chat is dus niet actief in deze missie. De agent-rol (year2.tsx) definieert wel een uitgebreide `systemInstruction`. Dit is consistent met de template: de chat is optioneel en hier uitgeschakeld.

**Inclusiviteit:**
- Instagram/YouTube/WhatsApp als contexten zijn herkenbaar voor de doelgroep.
- Geen aannames over eigen apparaten of verbinding.
- Welbeingmonitor is in de template aanwezig en actief.

### ⚠️ Aandachtspunten

**1. `missionGoal.criteria` type inconsistentie**

`network-navigator.ts:13`:
```ts
// VOOR:
criteria: { type: 'rounds-complete', min: 3 }
```
`year2.tsx:1112`:
```ts
// Agent-config:
goalCriteria: { type: 'steps-complete', min: 3 }
```
De config-kant zegt `rounds-complete`, de agent-kant zegt `steps-complete`. Inconsistentie in naamgeving. Controleer welk type de engine daadwerkelijk verwacht en maak ze gelijk.

**2. Scoremix: `q5-verschil-tiktok-google` accepteert alleen exact 5.6**

`network-navigator.ts:119`:
```ts
correctAnswer: 5.6,
```
De scorehelper gebruikt `tolerance = Math.abs(correct) * 0.05` = 0.28. `45 / 8 = 5.625` → afwijking van 0.025 — dat valt binnen de tolerantie, dus 5.625 wordt correct gerekend. Maar een leerling die afrondt op `5,63` of `6` of `5,5` krijgt 0. Dat is vrij streng voor een verhoudingsvraag in jr2. Overweeg een ruimere tolerantie (10%) of een `text-observation`-type voor deze vraag.

**3. Geen `followUp`-vragen in de datasets**

Alle drie datasets missen de optionele `followUp`-eigenschap. Niet verplicht, maar de template ondersteunt het — een diepgaande doordenkvraag per dataset zou de Bloom-balans naar hogere niveaus tillen. Aanbeveling voor volgende iteratie.

**4. Intro-beschrijving meldt "foutcodes" maar niet "HTTP"**

De introBeschrijving benoemt "HTTP-foutcodes" pas in de features-lijst, niet in de kernbeschrijving. Dat is oké; kleine stijlkwestie.

### ❌ Blokkers
Geen didactische blokkers.

---

## 🔧 Tech review

### ✅ Goed

- **useMissionAutoSave** correct gebruikt met `INITIAL_STATE` en `clearSave()` op complete — restart-safe.
- **Async/error-handling** in `DataViewer` (public entry): `import()` heeft `.catch(() => setLoadError(true))` + correcte loadingscreen. Goed.
- **TS-typen**: geen `any` gevonden in de gelezen bestanden. `DataViewerConfig`, `Dataset`, `DataQuestion` zijn correct getypeerd.
- **@/* imports**: `useMissionAutoSave`, `getMissionGoal`, `StudentAIChat` etc. worden correct geïmporteerd via `@/`-alias.
- **Supabase-calls**: geen directe supabase-calls in de template — alles via `StudentAIChat` (die zijn eigen edge-function-proxy heeft). Geen XSS-risico op user-output: React escapet alle `{text}`-renders automatisch.
- **promptSanitizer / wellbeing**: `scanWellbeingText` wordt aangeroepen op `text-observation`-antwoorden vóór submit. Correct ingevoerd op het juiste moment.
- **systemInstruction server-side**: de missie gebruikt `enableChat: undefined` (uitgeschakeld). De agent-`systemInstruction` staat in `year2.tsx` (server-/config-kant) en wordt niet als raw string aan de client meegegeven. Veilig.
- **Geen dangerouslySetInnerHTML**: in de gelezen bestanden niet aangetroffen.
- **Knoppen zijn gewired**: alle `onClick`-handlers zijn correct gekoppeld (onStart, onSubmit, onNext, onBack, onComplete, handlePrevDataset).

### ⚠️ Aandachtspunten

**1. userId-extractie via localStorage in de component**

`DataViewer.tsx:495-506`:
```tsx
// VOOR: inline IIFE die localStorage parset
const userId = (() => {
    try {
        const key = Object.keys(localStorage).find((k) =>
            /^sb-[a-z0-9_-]+-auth-token$/i.test(k)
        );
        ...
    } catch { return null; }
})();
```
Dit is een workaround die bij elke render opnieuw parset. Beter: gebruik een `useAuth()`-hook of `supabase.auth.getUser()` als de auth-context beschikbaar is. Dit is een template-breed issue.

**2. `goalCriteria.type: 'rounds-complete'` onbekend**

Zie didactiek-punt 1. Technisch risico: als de missie-engine `steps-complete` verwacht maar de config `rounds-complete` aanlevert, wordt het voltooiingscriterium nooit getriggerd.

`src/features/missions/templates/data-viewer/configs/network-navigator.ts:13`:
```ts
// VOOR:
criteria: { type: 'rounds-complete', min: 3 },
// NA (afstemmen op wat de engine verwacht — vermoedelijk):
criteria: { type: 'rounds-complete', min: 3 },  // of 'steps-complete'
```
Verifieer via `src/config/missionGoals.ts` of de engine-code welk `type`-string geldig is.

**3. `accent-[#D97848]` op radio-inputs**

`DataViewer.tsx:191`:
```tsx
className="accent-[#D97848]"
```
Hardcoded hex op een interactief element. Gebruik `accent-duck-accent` of vervang met `accent-duck-acid` als dat de juiste kleur is. Kleine inconsistentie met het design-systeem.

**4. Geen `empty state` voor lege datasets-array**

Als `config.datasets` leeg is, crasht de component op `config.datasets[currentDataset]` (undefined). De template heeft geen guard:
```tsx
// NA — toevoegen na de phase-checks:
if (!config.datasets.length) return <div>Geen datasets beschikbaar.</div>;
```
Niet kritiek voor production (de config heeft altijd 3 datasets), maar defensief coderen is beter.

### ❌ Blokkers
Geen technische blokkers. Punt 2 (goalCriteria type-mismatch) is het meest urgent om te controleren.

---

## Samenvatting

| As | Score | Toelichting |
|---|---|---|
| UI/UX | 2/3 | Duck-tokens goed gebruikt; hardcoded hex in config-kleuren en de nutteloze gradient zijn aandachtspunten; a11y op tabel mist |
| Didactiek | 3/3 | Doel aanwezig, bereikbaar en SLO-congruent; Bloom-balans solide voor jaargroep 2; AI correct als copiloot |
| Tech | 2/3 | AutoSave, error handling en security correct; goalCriteria type-mismatch en localStorage-userId zijn verbeterpunten |

**Auto-fixbare issues:** 6 (badge-hex, chart-hex, gradient-dedup, accent-hex, aria-sort, aria-label filterinput)  
**Escalaties:** 1 — goalCriteria `rounds-complete` vs `steps-complete` type-mismatch (engine-gedrag verifiëren)
