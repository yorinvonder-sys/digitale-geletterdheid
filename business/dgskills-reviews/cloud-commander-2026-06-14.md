# Missie-review: Cloud Commander

**Mission ID:** cloud-commander
**Template:** tool-guide
**Curriculum-plek:** Leerjaar 1, Periode 1
**Datum:** 2026-06-14
**Reviewer-pipeline:** dgskills-mission-review v1.0

---

## 🎨 Design review

**Mission:** cloud-commander (tool-guide)
**Reviewer:** dgskills-design-reviewer (Sonnet)

---

### ✅ Geslaagd

- **Criterium 2 — Layout consistentie:** Vier introFeatures gerenderd via dezelfde `features`-prop als andere tool-guide missies. Structuur (max-w-md centered, PhaseHeader + StepCard stapeling, IntroScreen → staps-fase → CompletionScreen) volgt exact het template-patroon — geen structurele afwijkingen. — `IntroScreen.tsx:51-72`, `ToolGuide.tsx:515-526`
- **Criterium 4 — Copy-lengte leerjaar 1:** introDescription is 30 woorden (ruim onder 80). Stap-instructies: stap 1 = 46w, stap 2 = 45w, stap 3 = 52w, stap 4 = 52w — alle onder 60w. Tips zijn 28-38 woorden. Copy is passend voor 12-jarigen. — `cloud-commander.ts:8-9,28-83`
- **Criterium 3 — Knop-clarity:** Alle knoppen hebben tekst-labels, hover-states en focus-visible ringen. Geen icon-only knoppen zonder aria-label. — `ToolGuide.tsx:374,407`
- **Criterium 6 — Framer Motion:** Geen `motion.*` of `<AnimatePresence>` in engine of config. — `ToolGuide.tsx` volledig
- **Criterium 7 — Toegankelijkheid (deels):** Checkboxknoppen hebben `text-left` + zichtbare labels. Correct/fout-feedback via "✓" en "!" naast kleur. — `ToolGuide.tsx:389`
- **Visual Precision Gate — Statisch:** Max-breedte `max-w-md` met `w-full` geeft correcte mobiele layout. Geen overlappende knoppen in statische tree. **Dynamische verificatie niet uitgevoerd** — `devServerUrl` is null, geen Chrome-plugin bewijs.

---

### ⚠️ Aandachtspunten

- **Criterium 1 — Badge-kleuren hardcoded hex:**
  - **Wat:** `badges[0].color: '#D97848'`, `badges[1].color: '#0B453F'`, `badges[2].color: '#5F947D'` als literal-string in config (`cloud-commander.ts:92-106`). `CompletionScreen` past ze toe via `style={{ background: \`linear-gradient(135deg, ${badge.color}15, ${badge.color}08)\` }}` (`CompletionScreen.tsx:42`). Correleert met `lab.coral`, `lab.tealDark` etc. maar is niet getokenized.
  - **Voorstel:** Maak `BadgeConfig.color` een enumeratie (`'primary' | 'secondary' | 'accent'`) en laat `CompletionScreen` dat vertalen naar token-waarden.

- **Criterium 4 — iPad-instructie stap 2: locatie +-icoon onduidelijk:**
  - **Wat:** "Tik op het **+-icoon** (rechtsboven of rechtsonder)" (`cloud-commander.ts:34`). In OneDrive iPadOS iOS 16+ zit het +-icoon rechtsonder; in oudere versies / webinterface rechtsboven. "Of"-formulering creëert twijfel voor een 12-jarige.
  - **Voorstel:** "Tik op het **+-icoon** rechtsonder in de navigatiebalk." + toevoeging: "Zie je het niet? Kijk dan rechtsboven in de toolbar."

- **Criterium 5 — `border-duck-line` in IntroScreen (engine-breed):**
  - **Wat:** `IntroScreen.tsx:57` gebruikt `border-duck-line` — bestaansmissing token (zie BLOCKING-D1). Voor cloud-commander specifiek: de 4-items introFeatures-lijst mist de visuele separator, items vloeien samen.

- **Criterium 7 — Stap 4 long-press werkt niet in OneDrive iOS:**
  - **Wat:** "of hou je vinger op het bestand en kies **Delen**" (`cloud-commander.ts:67`). OneDrive mobiel heeft geen standaard long-press context-menu zoals Bestanden-app.
  - **Voorstel:** Verwijder de long-press-route of voeg "(werkt afhankelijk van je versie)" toe.

---

### ❌ Blocking issues

**BLOCKING-D1 (engine-breed — verwijzing magister-master):**
`duck-coral`, `duck-muted`, `duck-line`, `duck-creamDeep` ontbreken in `tailwind.shared.js:8-15`. Alle StepCard-UI kleurelementen, checklist-headers en verificatievraag-labels renderen transparant. Raakt cloud-commander identiek als magister-master.

**BLOCKING-D2 (engine-breed — verwijzing magister-master):**
`focus-visible:ring-duck-coral` (`ToolGuide.tsx:234,342,374`) werkt niet. WCAG 2.1 AA-schending op toetsenbordnavigatie.

---

### Score

5/7 criteria geslaagd (inclusief partials) · Aanbeveling: **fix-eerst**

---

## 📚 Didactiek review

**Mission:** cloud-commander (tool-guide)
**Curriculum-plek:** Leerjaar 1, Periode 1
**SLO-claim:** 21A, 23A (regulier) · 18A, 20A (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

---

### ✅ Geslaagd

- **Criterium 1 — SLO-codes correct:** `21A`, `23A`, `18A`, `20A` zijn alle vier geldige codes. Geen duplicaten. — `slo-kerndoelen-mapping.ts:29`
- **Criterium 5 — Leeftijdspassend vocabulary:** Direct en toegankelijk taalgebruik, geen academisch jargon. — `cloud-commander.ts:8-9`
- **Criterium 6 — Curriculum-plek logisch:** Cloud-commander op positie 2 in P1 bouwt logisch voort op magister-master (inloggen, navigeren → opslagsystemen, mappenstructuur, delen). Didactisch verantwoord. — `curriculum.ts:66-73`
- **Criterium 8 — AI-as-copilot:** Geen `enableChat` in templateRegistry — n.v.t. — `templateRegistry.ts:97`
- **Criterium 9 — VSO-mapping aanwezig:** VSO-codes `18A`, `20A` aanwezig en passend. Genderneutraal taalgebruik. — `slo-kerndoelen-mapping.ts:29`

---

### ⚠️ Aandachtspunten

- **Criterium 2 — SLO-fit 21A oppervlakkig:**
  - **Wat:** 21A vraagt functioneel begrip van digitale systemen. Stap 2 verificationQuestion raakt dit: "bestanden opgeslagen in cloud op servers van Microsoft." Maar alle stappen zijn primair navigatiehandelingen. Er is geen moment waarop de leerling nadenkt over *wat* cloudsystemen zijn vs. lokale opslag op systeemniveau. — `cloud-commander.ts:42-49`
  - **Voorstel:** Voeg aan explanation stap 2 toe: "Daardoor heb je altijd toegang — ook als je iPad kapot gaat." Of: vóór upload in stap 3 een korte reflectie: "Bedenk: waar staat deze foto straks?"

- **Criterium 2 — SLO-fit 23A te dun:**
  - **Wat:** 23A (Veiligheid & privacy) vraagt bewust omgaan met data en privacy. Tip stap 4 noemt "jij bepaalt wie toegang heeft." VerificationQuestion stap 4 meet UX-voordeel (nieuwste versie), niet privacy-competentie (toegangsbeheer, intrekken). — `cloud-commander.ts:65-83`
  - **Voorstel:** Pas verificationQuestion aan: optie "Je kunt de link later intrekken als je dat wilt — bij een bijlage kun je dat niet meer." Dit maakt 23A inhoudelijk harder.

- **Criterium 3 — Geen `learningObjectives` array:**
  - **Wat:** Geen expliciete leeruitkomst-array. `takeaways` (r.107-113) zijn informele "je kunt/weet"-formuleringen, geen Bloom-gekoppelde leerdoelen.
  - **Voorstel:**
    ```text
    learningObjectives: [
      'De leerling herkent het verschil tussen lokale opslag en cloudopslag en benoemt één voordeel.',
      'De leerling past een mappenstructuur toe door een map aan te maken en een bestand daarin op te slaan.',
      'De leerling deelt een bestand via een link en legt uit waarom dat veiliger is dan een bijlage (toegangsbeheer).',
    ]
    ```

- **Criterium 7 — Bloom-balans: uitsluitend Bloom 1-2 in vraagstelling:**
  - **Wat:** Stap 2: "Waar worden bestanden opgeslagen?" = Bloom 1 (onthouden). Stap 4: "Voordeel link vs. bijlage?" = Bloom 2 (begrijpen). Geen Bloom 3+-moment in vraagstelling. Voor SLO 21A + 23A is minimaal Bloom 3 vereist bij minstens één vraag. — `cloud-commander.ts:40-83`
  - **Voorstel:** Bloom-3 afsluiting: "Je vriend stuurt je een bestand via WhatsApp als bijlage. Wat is het nadeel als hij later een fout corrigeert?" — vraagt toepassing op nieuwe situatie.

- **Criterium 7 — Stap 3 foto-instructie privacy-risico:**
  - **Wat:** Instructie vraagt leerling een foto te maken of te kiezen uit Foto's-bibliotheek (r.55). Die wordt geüpload naar OneDrive en potentieel gedeeld in stap 4. Foto's van 12-jarigen kunnen portretten bevatten — privacygevoelig (AVG). Bovendien: niet alle leerlingen hebben foto's staan op school-iPad. — `cloud-commander.ts:55-61`
  - **Voorstel:** "Maak een foto van je schoolboek of schrift (niet van jezelf of klasgenoten). Of download het oefenbestand van Magister/Teams." Dit is ook een 23A-teachable moment: bewuste bestandskeuze vóór uploaden.

---

### ❌ Blocking issues

Geen. De `maxScore: 60` discrepantie (zie tech-review BLOCKING-T1) schaadt de beloningsstructuur structureel maar blokkeert de missie niet op zichzelf — te repareren vóór productie.

---

### SLO-fit oordeel

- **21A:** oppervlakkig — handelingen aanwezig, systeembegrip in slechts één vraag
- **23A:** te dun — tip-niveau, niet practice-niveau; stap 3 foto-instructie is een AVG-grijs gebied
- **18A/20A (VSO):** stap-voor-stap structuur goed passend voor VSO-doelgroep; idem problemen als regulier

---

### Score

5/9 criteria geslaagd · Bloom-balans: Bloom 1-2 only · Aanbeveling: **fix-eerst**

---

## 🔧 Tech review

**Mission:** cloud-commander (tool-guide)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** niet uitgevoerd — `devServerUrl` is null; state-based SPA zonder missie-URL.

---

### Static analyse

#### ✅ Geslaagd

- **A1 — Knop-handlers:** alle checklist, antwoord-selectie, submit en volgende-stap knoppen functioneel gekoppeld — `ToolGuide.tsx:231-258,336-342,372-379,405-412`
- **A2 — Error states:** `loadError`-state met user-friendly bericht + terugknop; `LoadingScreen` dekt laadtoestand — `ToolGuide.tsx:594-603,574-578`
- **A3 — TypeScript-discipline:** geen `any`, `@ts-ignore` in config of engine
- **A4 — Imports via `@/*` alias:** alle imports in `ToolGuide.tsx` gebruiken `@/components/...`, `@/hooks/...` — `ToolGuide.tsx:3-9`
- **A5 — Edge function calls:** geen Supabase AI-aanroepen — n.v.t.
- **A6 — Restart-safe state:** `useMissionAutoSave` correct gebruikt met `config.missionId` als sleutel — `ToolGuide.tsx:438`
- **A7 — Security:** geen `dangerouslySetInnerHTML`, geen leerling-input naar AI

---

#### ❌ Blocking issues

**BLOCKING-T1 — maxScore-discrepantie: badge "Cloud Expert" onbereikbaar**

`maxScore: 60` in `cloud-commander.ts:86`. Engine-berekening: 4 stappen × 10 pt checklist + 2 stappen met `verificationQuestion` × 5 pt = **50 punten max**. Badge "Cloud Expert" vereist `minScore: 55` — maar engine maximaliseert op 50. Perfecte leerling haalt 50/60 = 83%, nooit 100% of de gouden badge.

```ts
// ❌ Huidig — cloud-commander.ts:86-106
maxScore: 60,
badges: [
    { minScore: 55, emoji: '🏆', title: 'Cloud Expert',     color: '#D97848' },
    { minScore: 40, emoji: '☁️', title: 'Cloud Commander',  color: '#0B453F' },
    { minScore: 0,  emoji: '🌱', title: 'Aan de slag',      color: '#5F947D' },
],

// ✅ Voorgesteld
maxScore: 50,
badges: [
    { minScore: 45, emoji: '🏆', title: 'Cloud Expert',     color: '#D97848' },
    { minScore: 30, emoji: '☁️', title: 'Cloud Commander',  color: '#0B453F' },
    { minScore: 0,  emoji: '🌱', title: 'Aan de slag',      color: '#5F947D' },
],
```

**BLOCKING-T2 (doorverwijzing engine-breed — magister-master):**
`duck-*` token-gebruik in `ToolGuide.tsx` raakt cloud-commander identiek. Geen nieuwe analyse.

---

#### ⚠️ Aandachtspunten

- **WARN-T1 — Stap 3 geen `teacherCheck`:** missie verwacht dat leerling foto maakt en naar OneDrive uploadt, maar engine valideert niet of upload is geslaagd. Alleen self-check via checklist. — `cloud-commander.ts:58-62`
  - **Voorstel:** Voeg `teacherCheck: 'Controleer of de foto zichtbaar staat in de School-map van de leerling in OneDrive'` toe aan stap 3.
- **WARN-T2 — Badge hex als inline style:** `CompletionScreen.tsx:42` rendert `style={{ background: \`linear-gradient(..., ${badge.color}15)\` }}` — buiten duck-token systeem, maar geen bug of XSS-risico.
- **WARN-T3 — Teams/Magister instructietekst:** losse tekstreferentie, geen integratie; geen technisch risico.

---

### Score

Static checks: 7/7 doorlopen · Blocking: 1 config (maxScore), 1 doorverwijzing (duck tokens) · Aanbeveling: **fix-eerst**

---

## 🖼️ Visuele evidence (multi-viewport)

Multi-viewport screenshot-verificatie niet uitgevoerd — `devServerUrl` was null tijdens deze review-pass. De cloud-commander missie gebruikt dezelfde `ToolGuide.tsx` engine als magister-master; de token-bug (transparante duck-kleuren) is al bevestigd via DOM-inspecties bij magister-master en geldt identiek voor cloud-commander.

**Ontbrekende visuele checks:**
- Desktop (1280px): intro, mid-flow stap 2 (verificationQuestion), stap 4 (delen-instructie), eindstaat
- iPad staand (768px) / liggend (1024px): kritiek want missie is iPad-specifiek (OneDrive iOS instructies)
- Mobiel (375px): intro + stap 1-4 scroll-gedrag

**Status: PARTIAL REVIEW** — visuele QA is essentieel voor deze missie gezien de iPad-specifieke instructies (stap 2 +-icoon locatie, stap 4 deelicoon). Markeer als "Echte iPad-check nodig" voor schoolpilot.

---

## Samenvatting

- **Geslaagd:** 17 criteria (design 5 + didactiek 5 + tech 7)
- **Aandachtspunten:** 10 issues (waarvan 0 blocking in didactiek, 1 blocking tech config)
- **Blocking (uniek):** 3 unieke issues — (1) duck-namespace tokens [engine-breed, D+T, doorverwijzing], (2) `maxScore: 60` → moet `50` zijn [config, T], (3) badge "Cloud Expert" onbereikbaar [config, gevolg van maxScore]
- **Aanbeveling: fix-eerst**
- **Release-gate status: BLOCKED** — visuele QA (multi-viewport, iPad-specifiek) is niet uitgevoerd

**Goede nieuws:** Cloud-commander heeft een sterke didactische structuur: logische opbouw na magister-master, correcte SLO-codes, passend taalgebruik voor brugklas, en stap 4 (deellink vs. bijlage) raakt een relevant informatievaardigheidsmoment. De config-kwaliteit is hoog — de blockers zijn de engine-breed Tailwind-fix + een triviale `maxScore`-correctie.

**Top 3 issues:**
1. `cloud-commander.ts:86` — `maxScore: 60` → `maxScore: 50`, badge-drempels aanpassen (leerling kan anders nooit gouden badge halen)
2. `tailwind.shared.js:8-15` — duck-namespace tokens ontbreken (engine-breed, gefixt door magister-master fix)
3. `cloud-commander.ts:55-61` — stap 3 foto-instructie: begrens tot schoolcontent (geen portretten), voeg `teacherCheck` toe

---

## Codex-gate (M1)

**Verdict: BLOCK**
**Model:** gpt-5.5 · **Effort:** xhigh · **Datum:** 2026-06-14

**Bevindingen:**

**[HIGH]** `business/dgskills-reviews/cloud-commander-2026-06-14.md:230-232` — Codex-gate sectie was een lege placeholder; het rapport presenteert een BLOCKED release-gate oordeel maar mist het daadwerkelijke adversarial eindoordeel. Fix: deze sectie is nu ingevuld met het echte BLOCK-oordeel.

**Geverifieerde claims:**
- `maxScore: 60` vs engine-max 50 bevestigd door Codex via directe bestandsinspectie van `cloud-commander.ts:86` en `ToolGuide.tsx`-scorelogica.
- `duck-coral/muted/line/creamDeep` absent uit `tailwind.shared.js` bevestigd.
- Badge `minScore: 55` onbereikbaar bij `maxScore: 50` engine-max bevestigd.

**Next steps (uit Codex):**
1. Fix `maxScore: 50` en badge-drempels in `cloud-commander.ts:86-106`
2. Fix duck-namespace tokens in `tailwind.shared.js:8-15` (engine-breed, alle LJ1-P1 missies)
3. Voer multi-viewport visuele QA uit na de fix vóór release-gate approval
