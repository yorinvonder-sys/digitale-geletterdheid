# Missie-review: Cloud Commander

**Mission ID:** cloud-commander
**Template:** tool-guide
**Curriculum-plek:** Leerjaar 1, Periode 1
**Datum:** 2026-06-17
**Reviewbasis:** Voortbouwend op cloud-commander-2026-06-14.md (M2 + Codex-gate)
**Verdict:** Missie is inhoudelijk solide maar heeft één blocking tech-bug (`maxScore`) en twee engine-brede token-issues die nog open staan. Klaar voor productie zodra deze drie fixes zijn geland.

---

## 🎨 Design review

### ✅ Goed

- Copy-lengte passend voor LJ1: introDescription 30 woorden, stapinstructies 45-52 woorden — allen binnen Jr1 limiet (<80w intro, <60w instructie).
- Knoppen hebben tekstlabels, hover-states en `focus-visible` ringen via engine (ToolGuide.tsx:374, 407).
- Geen Framer Motion-gebruik — intentioneel afwezig, geen onnodige animaties.
- Responsive layout via `max-w-md w-full` — geen vaste px-waarden in config.
- Correct/fout-feedback naast kleur (tekst "✓" / "!") — voldoet aan WCAG kleur-only-eis.
- Visueel: **niet geverifieerd (geen screenshot)** — screenshots/assignments/cloud-commander/ bestaat niet; iPad-specifieke UI (+-icoon locatie, deelicoon) kan niet bevestigd worden zonder device-test.

### ⚠️ Aandachtspunten

**A1 — Badge-kleuren hardcoded hex (cloud-commander.ts:92-106)**

Drie badges gebruiken literal hex-strings (`#ff3c21`, `#202023`, `#202023`) in plaats van design tokens. `CompletionScreen` past ze toe via inline `style`. Geen XSS-risico maar buiten het duck-token systeem.

Voorstel (PROPOSAL):
```ts
// cloud-commander.ts:92-106
// ❌ Voor
{ minScore: 55, emoji: '🏆', title: 'Cloud Expert',    color: '#ff3c21' },
{ minScore: 40, emoji: '☁️', title: 'Cloud Commander', color: '#202023' },
{ minScore: 0,  emoji: '🌱', title: 'Aan de slag',     color: '#202023' },

// ✅ Na (zodra BadgeConfig.color als enum uitgebreid is)
{ minScore: 45, emoji: '🏆', title: 'Cloud Expert',    color: 'primary' },
{ minScore: 30, emoji: '☁️', title: 'Cloud Commander', color: 'secondary' },
{ minScore: 0,  emoji: '🌱', title: 'Aan de slag',     color: 'muted' },
```
Note: thresholds meeveanderd (zie BLOCKING-T1).

**A2 — +-icoon locatie instructie ambiguü (cloud-commander.ts:34)**

"Tik op het +-icoon (rechtsboven of rechtsonder)" — in OneDrive iPadOS 16+ zit het rechtsonder; in oudere versies/webinterface rechtsboven. Onduidelijk voor 12-jarigen.

Voorstel (PROPOSAL, `cloud-commander.ts:34`):
```ts
// ❌ Voor
'Maak een nieuwe map aan in OneDrive. Tik op het **+-icoon** (rechtsboven of rechtsonder) en kies **Map aanmaken**.'

// ✅ Na
'Maak een nieuwe map aan in OneDrive. Tik op het **+-icoon** rechtsonder in de navigatiebalk. Zie je het niet? Kijk dan rechtsboven in de toolbar.'
```

**A3 — Long-press werkt niet betrouwbaar in OneDrive iOS (cloud-commander.ts:67)**

"hou je vinger op het bestand en kies Delen" — OneDrive iOS heeft geen standaard long-press context-menu zoals de Bestanden-app.

Voorstel (PROPOSAL, `cloud-commander.ts:67`):
```ts
// ❌ Voor
'...of hou je vinger op het bestand en kies **Delen**.'

// ✅ Na
'...of tik op de **drie puntjes** (•••) naast het bestand en kies **Delen**.'
```

### ❌ Blokkers

**BLOCKING-D1 (engine-breed — doorverwijzing magister-master-2026-06-14.md)**

`duck-coral`, `duck-muted`, `duck-line`, `duck-creamDeep` ontbreken in `tailwind.shared.js`. StepCard-kleur-elementen, checklist-headers en verificatievraag-labels renderen transparant. Raakt cloud-commander identiek als magister-master.

**BLOCKING-D2 (engine-breed — doorverwijzing)**

`focus-visible:ring-duck-coral` (ToolGuide.tsx:234, 342, 374) werkt niet — WCAG 2.1 AA-schending op toetsenbordnavigatie.

**ESCALATIE:** BLOCKING-D1 en D2 zijn engine-brede token-problemen in `tailwind.shared.js` — niet auto-fixbaar per missie. Vereist fix in gedeelde config.

---

## 📚 Didactiek review

### ✅ Goed

- SLO-codes 21A, 23A (regulier) en 18A, 20A (VSO) zijn geldige codes en aanwezig in `slo-kerndoelen-mapping.ts:29`.
- Leeftijdspassend taalgebruik: direct, concreet, geen academisch jargon.
- Curriculum-plek logisch: positie 2 in P1 bouwt voort op magister-master (inloggen/navigeren → cloud, mappenstructuur, delen). Goede pedagogische sequentie.
- Geen `enableChat` — AI-copiloot n.v.t. voor dit template; terecht.
- VSO-codes 18A/20A aanwezig; stap-voor-stap structuur passend voor VSO-doelgroep.
- Stap 4 (deellink vs. bijlage) raakt een relevant informatievaardigheidsmoment.

### ⚠️ Aandachtspunten

**P1 — Geen `missionGoal` / `learningObjectives` (cloud-commander.ts:1-114)**

`ToolGuideConfig.missionGoal` is optioneel maar ontbreekt. `takeaways` (r.107-113) zijn informele formuleringen, geen Bloom-gekoppelde leerdoelen met actiewerkwoord.

Voorstel (PROPOSAL, toevoegen aan `cloud-commander.ts` na `toolName`):
```ts
missionGoal: {
  primaryGoal: 'De leerling werkt zelfstandig met OneDrive en past basisvaardigheden toe: mappen aanmaken, bestanden uploaden en veilig delen.',
  learningObjectives: [
    'De leerling herkent het verschil tussen lokale opslag en cloudopslag en benoemt één voordeel.',
    'De leerling past een mappenstructuur toe door een map aan te maken en een bestand daarin op te slaan.',
    'De leerling deelt een bestand via een link en legt uit waarom dat veiliger is dan een bijlage (toegangsbeheer).',
  ],
},
```

**P2 — Bloom-balans: uitsluitend Bloom 1-2 (cloud-commander.ts:40-83)**

Stap 2 vraag = Bloom 1 (onthouden: "Waar worden bestanden opgeslagen?"). Stap 4 vraag = Bloom 2 (begrijpen: "Voordeel link vs. bijlage?"). Voor SLO 21A + 23A is minimaal Bloom 3 (toepassen) wenselijk bij minstens één vraag.

Voorstel (PROPOSAL) — vervang of voeg toe als derde verificationQuestion in stap 4:
```ts
// Bloom 3 — toepassen op nieuwe situatie
question: 'Je vriend stuurt je een schoolopdracht via WhatsApp als bijlage. Later verbetert hij een fout. Wat moet jij nu doen?',
options: [
  'Niets — mijn versie wordt automatisch bijgewerkt',
  'Vragen om het verbeterde bestand opnieuw te sturen',
  'De bijlage weggooien en de link gebruiken',
],
correctIndex: 1,
explanation: 'Met een bijlage ontvang je een momentopname. Wijzigingen bereiken je niet automatisch. Met een deellink zie je altijd de actuele versie.',
```

**P3 — SLO 23A te dun: stap 3 foto-instructie is privacy-grijs gebied (cloud-commander.ts:55-61)**

Leerlingen worden gevraagd een foto te maken of te kiezen uit hun Foto's-bibliotheek en die te uploaden + te delen. Foto's van 12-jarigen kunnen portretten bevatten (AVG-gevoelig). Bovendien: niet alle school-iPads hebben persoonlijke foto's.

Voorstel (PROPOSAL, `cloud-commander.ts:56`):
```ts
// ❌ Voor
'Maak een **foto** met de camera-app van je iPad (of kies een bestaande foto uit je Foto\'s).'

// ✅ Na
'Maak een foto van je **schoolboek of schrift** (niet van jezelf of klasgenoten). Of download het oefenbestand van Magister of Teams.'
```
Dit is tevens een 23A-teachable moment: bewuste bestandskeuze vóór uploaden.

**P4 — SLO 21A oppervlakkig (cloud-commander.ts:42-49)**

21A vraagt functioneel begrip van digitale systemen. Stap 2 vraag raakt cloud vs. lokaal maar alle vier stappen zijn primair navigatiehandelingen. Er is geen moment waarop de leerling nadenkt over wat cloudsystemen zijn.

Voorstel: voeg aan explanation stap 2 toe: "Daardoor heb je altijd toegang — ook als je iPad kapot gaat of kwijtgeraakt is."

### ❌ Blokkers

Geen didactische blokkers. De `maxScore`-discrepantie schaadt de beloningsstructuur maar blokkeert de missie-inhoud niet — zie BLOCKING-T1.

---

## 🔧 Tech review

### ✅ Goed

- Alle checklist-, antwoord- en navigatieknoppen zijn functioneel gekoppeld (ToolGuide.tsx:231-258, 336-342, 372-379, 405-412). Geen dode knoppen.
- `loadError`-state aanwezig met terugknop; `LoadingScreen` dekt laadtoestand (ToolGuide.tsx:574-578, 594-603).
- TypeScript: geen `: any` of `@ts-ignore` in config of engine.
- Imports via `@/*` alias correct (ToolGuide.tsx:3-9).
- Geen Supabase AI-aanroepen — n.v.t. voor dit template.
- `useMissionAutoSave` correct gebruikt met `config.missionId` als sleutel (ToolGuide.tsx:438) — restart-safe.
- Geen `dangerouslySetInnerHTML`, geen leerlinginput naar AI — geen XSS-risico.

### ⚠️ Aandachtspunten

**T1 — Stap 3 geen `teacherCheck` (cloud-commander.ts:58-62)**

Missie verwacht dat leerling een foto uploadt, maar engine valideert dit niet. Alleen self-check via checklist.

Voorstel (PROPOSAL, toevoegen aan stap 3 in `cloud-commander.ts`):
```ts
// Na checklistItems in stap 'stap-3-uploaden':
teacherCheck: 'Controleer of de foto zichtbaar staat in de School-map van de leerling in OneDrive.',
```

**T2 — Badge hex als inline style (CompletionScreen.tsx:42)**

`style={{ background: \`linear-gradient(..., ${badge.color}15)\` }}` — buiten duck-token systeem maar geen bug of XSS-risico. Wordt opgelost als A1 (PROPOSAL badge color enum) wordt geïmplementeerd.

### ❌ Blokkers

**BLOCKING-T1 — maxScore-discrepantie: badge "Cloud Expert" onbereikbaar**

`maxScore: 60` in `cloud-commander.ts:86`. Engine-berekening (bevestigd via ToolGuide.tsx:64-65):
- 4 stappen × `CHECKLIST_POINTS_PER_STEP` (10) = 40 pt
- 2 stappen met `verificationQuestion` × `QUESTION_BONUS` (5) = 10 pt
- **Engine-max: 50 pt**

Badge "Cloud Expert" vereist `minScore: 55` — onhaalbaar voor elke leerling. Perfecte leerling scoort 50/60 = 83%, krijgt nooit de gouden badge.

Voorstel (PROPOSAL, `cloud-commander.ts:86-106`):
```ts
// ❌ Huidig
maxScore: 60,
badges: [
    { minScore: 55, emoji: '🏆', title: 'Cloud Expert',    color: '#ff3c21' },
    { minScore: 40, emoji: '☁️', title: 'Cloud Commander', color: '#202023' },
    { minScore: 0,  emoji: '🌱', title: 'Aan de slag',     color: '#202023' },
],

// ✅ Voorgesteld
maxScore: 50,
badges: [
    { minScore: 45, emoji: '🏆', title: 'Cloud Expert',    color: '#ff3c21' },
    { minScore: 30, emoji: '☁️', title: 'Cloud Commander', color: '#202023' },
    { minScore: 0,  emoji: '🌱', title: 'Aan de slag',     color: '#202023' },
],
```

**BLOCKING-D1 en D2 (zie Design-sectie) gelden ook voor tech — engine-brede token-bug.**

---

## Samenvatting

| As | Score | Status |
|---|---|---|
| UI/UX | 2/3 | Engine-token blokkers open (D1/D2) |
| Didactiek | 2/3 | Geen blokkers; Bloom-balans + SLO-diepte verbeterslagen |
| Tech | 2/3 | maxScore-bug (BLOCKING-T1) ongefixt |

**Auto-fixbaar:** 4 (BLOCKING-T1 maxScore + badge-drempels, P3 foto-instructie, A2 +-icoon, A3 long-press)
**Escalatie (niet auto-fixbaar):** 2 (BLOCKING-D1 duck-namespace tokens, BLOCKING-D2 focus-ring — engine-breed in tailwind.shared.js)

**Release-gate status: BLOCKED** — BLOCKING-T1 (maxScore) en D1/D2 (engine-tokens) moeten gefixt zijn voor productie. Visuele QA (multi-viewport + echte iPad) ontbreekt nog.

**Top 3 issues:**
1. `cloud-commander.ts:86` — `maxScore: 60` → `50`, badge-drempels aanpassen (leerling kan anders nooit gouden badge halen) — auto-fixbaar
2. `tailwind.shared.js` — duck-namespace tokens ontbreken (engine-breed; raakt alle LJ1-P1 tool-guide missies) — ESCALATIE
3. `cloud-commander.ts:55` — stap 3 foto-instructie: begrens tot schoolcontent (geen portretten), voeg `teacherCheck` toe — auto-fixbaar + AVG-risico
