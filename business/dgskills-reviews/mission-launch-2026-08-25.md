# Missiereview: mission-launch — 2026-08-25

**TemplateType:** tool-guide
**Curriculum-plek:** Leerjaar 1, Periode 4 (`config/curriculum.ts:134`)
**SLO-claim:** `22A` (Digitale producten), `21B` (Media & Informatie) — VSO: `19A`, `18B` (`config/slo-kerndoelen-mapping.ts:92`)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

De gedeelde tool-guide-engine is al beoordeeld (zie `engine-tool-guide.json`): scoring is niet gokbestendig (checklist = zelfrapportage, kennisbonus bij `allowRetry` gratis te herhalen), state-herstel mist een validate-callback, en er zijn a11y-gaten in de checklist-knoppen. Deze missie-specifieke review kijkt alleen naar wat `mission-launch.ts` zelf toevoegt aan die risico's.

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- Criterium 1 (tokens): geen Tailwind-tokens in de config — `badges[].color` gebruikt een hex-literal (`#202023`), maar dat is exact `duck-ink` en volgt het bestaande patroon van andere tool-guide-missies (geen bevinding).
- Criterium 2: N.v.t. — layout zit in de gedeelde engine, niet in deze config.
- Criterium 3 (knop-clarity): N.v.t. — geen knoppen in de config; engine-knoppen al beoordeeld.
- Criterium 6/7 (motion/a11y): N.v.t. — beide zitten in de engine.

### ⚠️ Aandachtspunten
- **Criterium 4 (copy-lengte)**: `mission-launch.ts:23` — de instructie van stap 1 is ±90 woorden, ruim boven de 60-woordengrens voor leerjaar 1 (`opdracht <60 woorden`). Stap 3 (`:71`) en stap 4 (`:94-95`) zitten met ±100 resp. ±75 woorden ook boven de grens.
  - **Wat:** vier van de vier stap-instructies overschrijden de leerjaar-1-limiet voor opdrachtcopy.
  - **Waarom:** leerjaar 1-leerlingen (12-13 jaar) verliezen aandacht bij lange instructieblokken; de tool-guide-engine toont de hele instructie in één keer zonder scroll-indicatie, dus een lang blok voelt als een muur tekst.
  - **Voorstel:** splits de voorbeeldenlijst (formules/CTA-voorbeelden) uit de lopende instructietekst naar de `tip`, of kort de inleidende zin in. Zie Voorstellen-sectie.

### ❌ Blocking issues
- Visual Precision Gate: unverified — geen dev-server/Chrome-plugin bewijs beschikbaar in deze pass; engine-brede a11y-bevindingen (geen `key` op stapwissel, checklist mist `role="checkbox"`) gelden ook hier maar zijn al in de engine-bevindingen vastgelegd.

### Score
2/4 toepasbare criteria geslaagd (2 n.v.t.) · Aanbeveling: **fix-eerst** (copy-lengte)

---

## 📚 Didactiek review

**Curriculum-plek:** Leerjaar 1, Periode 4
**SLO-claim:** `22A`, `21B` (regulier) · `19A`, `18B` (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- Criterium 1 (SLO-codes correct): `22A` en `21B` zijn geldige regulier-codes, `19A`/`18B` geldige VSO-codes (`slo-kerndoelen-mapping.ts:92`).
- Criterium 2 (SLO-fit): een flyer + presentatie ontwerpen is een concreet digitaal product (`22A`) met een communicatieve boodschap (`21B`) — beide kerndoelen worden substantieel geraakt, niet oppervlakkig.
- Criterium 3 (leerdoelen): geen expliciete `learningObjectives`-array, maar `missionGoals.ts:359` (`primaryGoal`) en `introFeatures` (`:10-15`) formuleren impliciete, concrete leerdoelen met actiewerkwoorden ("bedenken", "formuleren", "schrijven", "indelen").
- Criterium 6 (curriculum-plek): logisch — periode 4 volgt op de projectperiodes; "je project is af, nu de wereld laten weten" sluit thematisch aan.
- Criterium 8 (AI-as-copilot): N.v.t. — deze tool-guide-missie heeft geen chat/agent-rol (`enableChat` niet gezet in `templateRegistry.ts:106`); geen dormant-agent-bevinding nodig, dit is bewust design voor dit templatetype.
- Criterium 9 (welzijn): stap 3 bevat een terechte, expliciete privacy-check over foto's van klasgenoten met verwijzing naar eerder geleerde stof ("Periode 3") — goed voorbeeld van doorverwijzing naar eerdere kennis.

### ⚠️ Aandachtspunten
- **Criterium 4 (opdracht-beknoptheid)**: `mission-launch.ts:23,71,94-95` — zie ook design-sectie. Voor leerjaar 1 is de grens 60 woorden per opdracht; drie van de vier stappen overschrijden die ruim.
  - **Wat:** instructieteksten combineren uitleg + 3 voorbeeldformules + toepassingsregel in doorlopende tekst.
  - **Waarom:** cognitieve belasting voor 12-13-jarigen is hoger dan bedoeld; het risico is dat leerlingen de instructie scannen i.p.v. lezen en de kwaliteitsregels missen.
  - **Voorstel:** zie Voorstellen-sectie — verplaats voorbeeldformules naar de checklist-items of `tip`, houd de instructiezin zelf onder de 40 woorden.
- **Criterium 7 (Bloom-balans)**: de missie zit overwegend op *toepassen* (kop bedenken, kernboodschap formuleren, CTA schrijven, indelen) met één *evalueren*-vraag (privacy-dilemma in stap 3). Geen recall-only vragen — dit is een gezonde balans voor leerjaar 1, geen bevinding, alleen ter bevestiging.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **22A (Digitale producten)**: sterk geraakt — leerling ontwerpt en levert een echt flyer-product op (`teacherCheck`, stap 4).
- **21B (Media & Informatie)**: sterk geraakt — boodschap kort/helder formuleren, bronvermelding/toestemming bij beeldmateriaal (stap 3).

### Score
5/6 toepasbare criteria geslaagd · Bloom-balans: gezond (toepassen-zwaartepunt, één evaluatie-vraag) · Aanbeveling: **fix-eerst** (copy-lengte)

---

## 🔧 Tech review

**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze pass; engine-brede scoring-/state-bevindingen (zie boven) blijven leidend voor dit templatetype.

### Static analyse
#### ✅ Geslaagd
- Config bevat geen handler-koppelingen, geen `any`-types, geen edge-function-calls — puur declaratieve content, dus criteria A1/A3/A4/A5/A7 zijn n.v.t. op dit bestand.
- `verificationQuestion.correctIndex` klopt voor alle 4 stappen (geverifieerd tegen de bijbehorende `options`-array): index 2, 1, 1, 2 wijzen steeds naar het juiste antwoord.
- Geen PII- of gevoelige-data-velden in de config.

#### ⚠️ Aandachtspunten
- **Registry-consistentie**: `templateRegistry.ts:106` heeft geen `enableChat`-vlag voor `mission-launch` — consistent met een tool-guide-missie zonder chat, geen bevinding, alleen bevestigd tegen de bekende valkuil "template zonder enableChat = bewust".
- Engine-brede bevinding "scoring niet gokbestendig" (checklist = zelfrapportage) is voor déze missie extra relevant omdat stap 4 (`teacherCheck`) de enige stap is met een menselijke controle — stappen 1-3 zijn volledig zelf-gerapporteerd en dus volledig te brute-forcen zonder inhoudelijk werk te leveren.
  - **Risico:** een leerling kan 40/60 punten (67%, ruim boven de 40%-drempel) halen door alleen vinkjes te zetten, zonder ooit een kop, kernboodschap of CTA te bedenken.
  - **Voorstel:** dit is een engine-fix (`ToolGuide.tsx`), niet in de scope van deze missie-config — reeds vastgelegd in de gedeelde engine-bevindingen.

#### ❌ Blocking issues
- Geen missie-specifieke blocking issues (engine-brede blockers zijn al vastgelegd in `engine-tool-guide.json`).

### Score
Static: 3/3 toepasbare criteria geslaagd · Dynamic: n.v.t. · Aanbeveling: **ship** (missie-config zelf is schoon; blijft afhankelijk van engine-fixes voor scoring-integriteit)

---

## Voorstellen

### Voorstel 1 — Stap 1: instructie inkorten onder 60 woorden (leerjaar 1)

```ts
// ❌ Huidig — src/features/missions/templates/tool-guide/configs/mission-launch.ts:22-23
instruction:
    'Een flyer heeft maar **2 seconden** om iemand te stoppen. De kop is het allerbelangrijkste element. Bedenk **3 verschillende opties** voor een kop. Gebruik een van deze formules:\n- **Probleem + oplossing**: "Nooit meer huiswerkstress!"\n- **Nieuwsgierigheid**: "De app die je docent niet kent"\n- **Concreet voordeel**: "3× sneller leren met AI"\n\nKies daarna de beste van je drie opties. Slechte koppen zijn te vaag ("Mijn project") of te lang (meer dan 8 woorden).',

// ✅ Voorgesteld
instruction:
    'Een flyer heeft maar **2 seconden** om iemand te stoppen. Bedenk **3 verschillende koppen** met deze formules:\n- **Probleem + oplossing**: "Nooit meer huiswerkstress!"\n- **Nieuwsgierigheid**: "De app die je docent niet kent"\n- **Concreet voordeel**: "3× sneller leren met AI"\n\nKies de beste. Maximaal 8 woorden, geen vage titels zoals "Mijn project".',
```

### Voorstel 2 — Stap 3: instructie inkorten onder 60 woorden

```ts
// ❌ Huidig — src/features/missions/templates/tool-guide/configs/mission-launch.ts:70-71
instruction:
    'Een call to action (CTA) vertelt mensen **wat ze moeten doen**. Niet alleen informeren, maar activeren. Voorbeelden van sterke CTA\'s:\n- "Kom vrijdag naar de aula!" (concreet, met datum)\n- "Scan de QR-code en probeer het zelf!" (interactief)\n- "Vraag me er morgen naar!" (laagdrempelig)\n\nSlechte CTA\'s: "Meer info volgt later" (vaag) of "Misschien leuk?" (twijfelachtig). Zet de CTA op de flyer als het **grootste en duidelijkste element** onderaan.',

// ✅ Voorgesteld
instruction:
    'Een call to action (CTA) vertelt mensen **wat ze moeten doen**. Sterke voorbeelden:\n- "Kom vrijdag naar de aula!"\n- "Scan de QR-code en probeer het zelf!"\n- "Vraag me er morgen naar!"\n\nVermijd vaag ("Meer info volgt later"). Zet de CTA onderaan, groot en duidelijk.',
```

### Voorstel 3 — Stap 4: instructie inkorten onder 60 woorden

```ts
// ❌ Huidig — src/features/missions/templates/tool-guide/configs/mission-launch.ts:94-95
instruction:
    'Maak de flyer in **Word, PowerPoint of Canva** (of op papier). Gebruik visuele hiërarchie: groot = belangrijk. De kop staat bovenaan en is het grootst. Daarna korte tekst en een afbeelding. Onderaan de call to action in een opvallende kleur. Gebruik maximaal 2 lettertypen en laat genoeg witruimte. Vink de checklist af als je klaar bent.',

// ✅ Voorgesteld
instruction:
    'Maak de flyer in **Word, PowerPoint of Canva** (of op papier). Groot = belangrijk: kop bovenaan en het grootst, dan korte tekst en een afbeelding, CTA onderaan in een opvallende kleur. Maximaal 2 lettertypen, genoeg witruimte.',
```

## Samenvatting & verdict

`mission-launch` is een didactisch solide, goed op leerjaar 1 aansluitende missie met een terechte en concrete SLO-claim (`22A`, `21B`) en een gezonde Bloom-balans, inclusief een relevante privacy-vraag over beeldmateriaal. De missie-eigen config bevat geen technische of security-issues. Het enige missie-specifieke probleem is copy-lengte: 3 van de 4 stap-instructies overschrijden de 60-woordengrens voor leerjaar 1, wat de cognitieve belasting verhoogt voor de jongste doelgroep. Dit is mechanisch en klein op te lossen (zie Voorstellen). De bredere scoring-integriteit (zelfrapportage-checklist, gratis kennisbonus-retry) is een engine-brede kwestie die al is vastgelegd in de gedeelde tool-guide-bevindingen en niet in deze missie-config zit.

**Verdict: fix-eerst** — kleine, mechanische copy-fixes in de eigen config; geen herontwerp nodig.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
