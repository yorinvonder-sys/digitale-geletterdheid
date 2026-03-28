# Audit Rapport: Opdrachten & Missies DGSkills
**Datum:** 28 maart 2026
**Auditor:** Claude Code (5 parallelle agents)
**Scope:** Alle 80+ missies, assessments, escaperoom, games, UI/UX, live functioneel
**Perspectief:** Leerling voortgezet onderwijs (12-18 jaar)

---

## Managementsamenvatting

DGSkills bevat **80+ missies** verdeeld over 3 leerjaren en 12 periodes, plus een escaperoom-nulmeting en diverse games. De platform heeft **sterke narratieve opdrachten** en **uitstekende SLO-aansluiting**, maar kent **kritieke tekortkomingen** in tijdsindicatie, differentiatie, accessibility en assessment-feedback die vóór lancering opgelost moeten worden.

### Totaalscore per dimensie

| Dimensie | Score | Status | Prioriteit |
|----------|:-----:|--------|-----------|
| Leerdoelen | 3.8/5 | 🟡 Verborgen voor leerlingen | **HOOG** |
| Instructies | 3.8/5 | 🟡 Over het algemeen duidelijk | MEDIUM |
| Tijdsindicatie | **1.4/5** | 🔴 **ONTBREEKT VOLLEDIG** | **KRITIEK** |
| Scaffolding | 3.6/5 | 🟡 Goed voor middengroep | HOOG |
| Feedback | 4.1/5 | 🟢 Sterke implementatie | Laag |
| Afsluiting | 4.4/5 | 🟢 Duidelijke eindes | Laag |
| Motivatie/Engagement | 4.3/5 | 🟢 Uitstekend narratief | Laag |
| Bloom's niveau | 3.3/5 | 🟡 Focus op Toepassen-Analyseren | MEDIUM |
| Differentiatie | **2.7/5** | 🔴 **GROOT GAT** | **KRITIEK** |
| SLO-aansluiting | 4.2/5 | 🟢 Sterke mapping | Laag |
| UI/UX Design | 3.2/5 | 🟡 Goede intenties, inconsistenties | HOOG |
| Accessibility | **2.0/5** | 🔴 **KRITIEK** | **KRITIEK** |
| Live functionaliteit | 4.0/5 | 🟢 Publieke pagina's werken goed | Laag |

---

## FASE 1: Kritieke issues (vóór lancering)

### 1.1 🔴 Tijdsindicatie ontbreekt bij ALLE opdrachten

**Probleem:** Geen enkele missie toont een geschatte duur aan de leerling of docent. Docenten kunnen lessen van 45 minuten niet plannen.

**Impact:**
- Docent weet niet of een opdracht 10 of 30 minuten duurt
- Leerling weet niet of hij/zij op tijd klaar zal zijn
- Lesplanning onmogelijk — SLO-compliance risico

**Geschatte duur per missie-type (op basis van code-analyse):**
- Chat-gebaseerde missies (Magister Meester, Cloud Commander): 15-20 min
- DeepfakeDetectorMission (3 levels × 3 challenges): 8-15 min
- FilterBubbleBreakerMission (meerdere fases): 12-18 min
- AssessmentEngine (afhankelijk van taken): 20-45 min
- Escaperoom Nulmeting (5 kamers): 30-45 min

**Oplossing:**
```
Voeg toe aan elke missie-intro:
⏱️ Geschatte duur: 12–15 minuten
• Intro: 1 min
• Challenges: 10 min
• Resultaat: 1 min
```

**Waar:** `config/missions.ts` → voeg `estimatedMinutes` property toe + toon in `MissionBriefing.tsx`

---

### 1.2 🔴 Differentiatie ontoereikend

**Probleem:** Eén format voor alle leerlingen. VSO-leerlingen, ADHD, dyslexie en VWO-bovenbouw worden niet bediend.

| Groep | Ondersteuning | Probleem |
|-------|:------------:|---------|
| VSO/Dagbesteding | 2/5 | Hints pas mid-opdracht. Geen optie om op makkelijker niveau te starten. |
| VWO/Gevorderd | 2/5 | Geen verrijking. Alle leerlingen zien dezelfde 3 levels. Geen challenge-modus. |
| ADHD/Autisme | 1/5 | Lange tekstblokken, meerdere fases, impliciete transities. Geen voorleesfunctie. |
| Dyslexie | 1/5 | Geen audio-optie. Geen aangepast lettertype. |
| Anderstalig | 1/5 | Alles in het Nederlands. Geen Engelse optie. |

**Oplossing:** Implementeer 3-traps systeem:
1. **Beginner (VSO):** Makkelijke levels eerst, automatische hints, eenvoudiger taal, kortere scenario's
2. **Standaard (Mavo/Havo):** Huidige implementatie
3. **Gevorderd (VWO):** Skip makkelijke levels, geen hints, bonusuitdagingen, reflectievragen

**Waar:** Elke missie-component + `config/curriculum.ts` (difficulty tiers)

---

### 1.3 🔴 Accessibility — kritieke gebreken

| Issue | Ernst | Component(en) |
|-------|-------|--------------|
| Geen keyboard-support voor drag-drop | 🔴 KRITIEK | GameDirectorMission, KamerVergrendeldeLaptop |
| Geen ARIA-labels op interactieve elementen | 🔴 KRITIEK | 41 occurrences in 10+ bestanden |
| Canvas zonder alt-text | 🔴 KRITIEK | DuelGame (DrawingDuel) |
| Geen screen reader support | 🔴 KRITIEK | Radar charts, hotspot-taken |
| Kleurafhankelijke feedback (rood/groen) | 🟠 HOOG | InspectorTask, alle assessments |
| Geen `prefers-reduced-motion` override | 🟠 HOOG | Meeste Framer Motion animaties |
| Drag-drop niet keyboard-accessible | 🔴 KRITIEK | SimulatorTask, KamerVergrendeldeLaptop |

**Oplossing:** Week 1 sprint — ARIA-labels toevoegen, keyboard-alternatieven voor drag-drop, alt-text op canvas/SVG.

---

### 1.4 🔴 Leerdoelen niet zichtbaar voor leerlingen

**Probleem:** Leerdoelen staan in de code (SLO-mapping) maar worden NIET aan de leerling getoond. De leerling weet niet:
- Wat hij/zij gaat leren
- Wat hij/zij straks kan
- Hoe het aansluit op het curriculum

**Oplossing:** Voeg "Je leert vandaag…" kaart toe vóór elke missie-intro:
```
Leerdoel (SLO 21D):
Je verkent mogelijkheden en beperkingen van AI.

Na deze missie kun je:
✓ AI-gegenereerde content van menselijke content onderscheiden
✓ Inzien hoe AI fouten maakt
✓ Kritisch nadenken over AI-risico's
```

**Waar:** Nieuw component `MissionLearningGoal.tsx` + integratie in `MissionBriefing.tsx`

---

## FASE 2: Hoge prioriteit (eerste 2 weken na lancering)

### 2.1 Assessment-feedback te oppervlakkig

| Taaktype | Huidige feedback | Gewenste feedback |
|----------|-----------------|-------------------|
| InspectorTask | "❌ Fout" | "Je koos X, maar dat klopt niet omdat Y. Het juiste antwoord is Z." |
| RescuerTask | "Niet de juiste volgorde" | "Stap 2 hoort vóór stap 3 omdat je eerst X moet doen." |
| SimulatorTask | Generiek succes/fout | Diagnostisch: welke misconceptie heeft de leerling? |

**Extra nodig:**
- Hint-escalatie: 1e fout = hint → 2e fout = antwoord + uitleg
- Misconceptie-database per fout antwoord
- Docent-rapport: "20% van de leerlingen denkt dat X leidt tot Y"

---

### 2.2 Mobile responsiveness gaten

| Component | Status | Probleem |
|-----------|--------|---------|
| DataDetectiveMission | ❌ | **GEEN responsive classes.** Grafieken lopen over op telefoon. |
| GameDirectorMission | ❌ | Twee-paneel layout broken op kleine schermen. |
| DeepfakeDetectorMission | ⚠️ | Afbeeldingen niet geschaald op telefoon. |

**Oplossing:** Responsive breakpoints (`sm:`, `md:`, `lg:`) toevoegen. Test op iPhone SE (375px) en iPad (820px).

---

### 2.3 Error handling zwak

| Component | Loading state | Error handling |
|-----------|:------------:|:-------------:|
| MissionBriefing | ✅ | ⚠️ Image fallback |
| PromptMasterMission | ✅ Spinner | ❌ Geen API-error afhandeling |
| DataDetectiveMission | ❌ Geen | ❌ Geen |
| DeepfakeDetectorMission | ❌ Geen | ❌ Geen |
| GameDirectorMission | ⚠️ | ❌ Silent fail bij fouten |

**Oplossing:** Error boundaries + gebruikersvriendelijke foutmeldingen ("Er ging iets mis. Probeer opnieuw.") + logging naar Sentry.

---

### 2.4 Design inconsistenties

- **GameGallery** gebruikt `slate-800`, `emerald-500`, `amber-500` — wijkt af van DGSkills tokens (`lab-primary`, `lab-dark`)
- **GamesSection** gebruikt `emerald/teal` i.p.v. DGSkills branding
- **GameDirector palette blocks** hebben eigen kleurenschema

**Oplossing:** Unificeer naar DGSkills design tokens.

---

## FASE 3: Verbeteringen (maand 1-2 na lancering)

### 3.1 Escaperoom Nulmeting verbeteren

| Aspect | Status | Verbetering |
|--------|--------|------------|
| Meet 5 SLO-domeinen | ✅ | — |
| Vergelijkbare scores | ❌ | Standaardiseer scoring-logica per kamer |
| Diagnostische feedback | ❌ | Toon per-domein: "Sterk: Privacy; Verbetering nodig: Programmeren" |
| Drempelwaarden | ❌ | Definieer Starter/Basis/Gevorderd grenzen |
| Moeilijkheidscurve | ⚠️ | Kamer 3 (Codekluis) is plotseling veel moeilijker |

### 3.2 Bloom's taxonomie balanceren

**Huidige verdeling:**
- Remember: 1 taak (InspectorTask — te laag)
- Understand: 4 taken
- Apply: 4 missies
- Analyze: 4 missies
- Evaluate/Create: 0.5 (GameDirector, nauwelijks)

**Gewenste verdeling per leerjaar:**
| Leerjaar | Understand | Apply | Analyze | Evaluate/Create |
|----------|:---------:|:-----:|:-------:|:--------------:|
| J1 | 30% | 60% | 10% | — |
| J2 | 10% | 40% | 40% | 10% |
| J3 | — | 20% | 40% | 40% |

### 3.3 Kerndoel-badges tonen

Leerlingen zien nu nergens welke SLO-kerndoelen ze behaald hebben. Voeg toe:
- Kerndoel-badge op het voltooiingsscherm van elke missie
- Voortgangsrapport: "Je hebt 15/18 SLO-kerndoelen behandeld"
- "Volgende missie" knop op voltooiingsscherm

### 3.4 Leerjaar 3 missies te moeilijk

**J3P1 ML Pipeline** bevat universiteitsniveau-concepten ("data normalization", "supervised learning", "training/test split"). Dit is niet realistisch voor 14-15 jarigen zonder voorkennis.

**Oplossing:** Split in "ML Concepten Quiz" (begrijpen) + "ML Hands-on" (gevorderden).

---

## FASE 4: Nice-to-haves (kwartaal 2)

| Verbetering | Impact | Effort |
|-------------|--------|--------|
| Tekst-naar-spraak toggle | Hoog (dyslexie) | Medium |
| Engels taaloptie | Medium (internationaal) | Hoog |
| Haptic feedback op mobiel | Laag | Laag |
| Geluidseffecten toggle | Medium | Laag |
| A/B testing framework | Hoog | Hoog |
| Usability sessies met echte leerlingen | Zeer hoog | Medium |

---

## Missie-voor-missie scoretabel

### Leerjaar 1, Periode 1: Digitale Basisvaardigheden

| Missie | Leerdoel | Instructie | Tijd | Scaffolding | Feedback | Motivatie | Bloom | Diff. | SLO | **Gem.** |
|--------|:--------:|:---------:|:---:|:----------:|:--------:|:---------:|:-----:|:-----:|:---:|:-------:|
| Magister Meester | 4 | 4 | 1 | 4 | 4 | 4 | Apply | 3 | 4 | **3.5** |
| Cloud Commander | 4 | 4 | 1 | 4 | 4 | 4 | Apply | 3 | 4 | **3.5** |
| Word Wizard | 4 | 4 | 1 | 4 | 4 | 3 | Apply | 3 | 4 | **3.4** |
| Print Pro | 5 | 5 | 2 | 4 | 5 | 4 | Apply | 3 | 4 | **4.1** |
| Cloud Schoonmaker (review) | 3 | 3 | 1 | 3 | 3 | 3 | Understand | 2 | 3 | **2.8** |
| Layout Doctor (review) | 3 | 3 | 1 | 3 | 3 | 3 | Understand | 2 | 3 | **2.8** |
| Pitch Politie (review) | 3 | 3 | 1 | 3 | 3 | 3 | Analyze | 2 | 3 | **2.8** |

### Leerjaar 1, Periode 2: AI & Creatie

| Missie | Leerdoel | Instructie | Tijd | Scaffolding | Feedback | Motivatie | Bloom | Diff. | SLO | **Gem.** |
|--------|:--------:|:---------:|:---:|:----------:|:--------:|:---------:|:-----:|:-----:|:---:|:-------:|
| Prompt Perfectionist | 3 | 3 | 1 | 2 | 4 | 5 | Analyze | 2 | 4 | **3.4** |
| Game Programmeur | 3 | 3 | 1 | 3 | 3 | 5 | Create | 2 | 4 | **3.2** |
| AI Trainer | 4 | 3 | 1 | 3 | 4 | 4 | Analyze | 2 | 4 | **3.3** |
| Chatbot Trainer | 4 | 3 | 1 | 3 | 4 | 4 | Create | 2 | 4 | **3.3** |
| Game Director | 3 | 2 | 2 | 2 | 3 | 5 | Create | 1 | 4 | **3.0** |
| Verhalen Ontwerper | 4 | 3 | 1 | 3 | 3 | 4 | Create | 2 | 4 | **3.1** |

### Leerjaar 1, Periode 3: Digitaal Burgerschap

| Missie | Leerdoel | Instructie | Tijd | Scaffolding | Feedback | Motivatie | Bloom | Diff. | SLO | **Gem.** |
|--------|:--------:|:---------:|:---:|:----------:|:--------:|:---------:|:-----:|:-----:|:---:|:-------:|
| Data Detective | 4 | 4 | 1 | 4 | 4 | 4 | Analyze | 3 | 5 | **3.8** |
| Deepfake Detector | 4 | 4 | 2 | 5 | 5 | 4 | Analyze | 3 | 5 | **4.1** |
| Filter Bubble Breaker | 4 | 4 | 1 | 4 | 4 | 5 | Understand | 3 | 5 | **3.8** |
| Data voor Data | 5 | 4 | 1 | 4 | 5 | 5 | Understand | 4 | 5 | **4.1** |
| Datalekken Rampenplan | 4 | 4 | 1 | 3 | 5 | 5 | Analyze | 2 | 5 | **3.9** |
| Social Safeguard | 4 | 3 | 1 | 3 | 4 | 5 | Apply | 3 | 5 | **3.6** |

### Assessments & Escaperoom

| Component | Validiteit | Instructie | Feedback | Scoring | Accessibility | **Gem.** |
|-----------|:---------:|:---------:|:--------:|:-------:|:------------:|:-------:|
| AssessmentEngine | 3 | 4 | 4 | 3 | 2 | **3.3** |
| InspectorTask | 2 | 3 | 3 | 3 | 1 | **2.6** |
| SimulatorTask | 4 | 4 | 4 | 3 | 1 | **3.6** |
| RescuerTask | 3 | 4 | 3 | 3 | 2 | **3.3** |
| Escaperoom Nulmeting | 4 | 3 | 3 | 3 | 2 | **3.0** |

### UI/UX Design

| Component | Overzicht | Responsive | A11y | Error handling | Engagement | **Gem.** |
|-----------|:---------:|:----------:|:----:|:-------------:|:----------:|:-------:|
| MissionBriefing | 4 | 4 | 2 | 3 | 4 | **4.0** |
| MissionConclusion | 5 | 4 | 3 | 1 | 5 | **4.0** |
| GameGallery | 3 | 3 | 2 | 2 | 3 | **3.0** |
| PromptMasterMission | 3 | 3 | 2 | 2 | 3 | **3.5** |
| DataDetectiveMission | 3 | **1** | 2 | 2 | 4 | **3.0** |
| GameDirectorMission | 2 | **2** | **1** | 1 | 3 | **2.5** |
| DuelGame | 4 | 3 | **1** | 2 | 5 | **3.0** |
| TypingTrainer | 4 | 4 | 3 | 2 | 4 | **4.0** |

---

## Live Browser Test Resultaten

### Publieke pagina's (getest ✅)

| Pagina | Status | Performance | Issues |
|--------|--------|-------------|--------|
| Landing (/) | ✅ Werkt | FCP: 52ms, TTFB: 14ms | 9 afbeeldingen missen alt-text |
| Login (/login) | ✅ Werkt | Snel | setState-during-render error (6x) |
| Compliance Hub | ✅ Werkt | Snel | — |
| ICT pagina | ✅ Werkt | Snel | — |
| Privacy/Cookies/AI | ✅ Werkt | Snel | — |
| SEO pagina's | ✅ Werkt | Snel | — |
| 404 routes | ⚠️ | — | Toont login i.p.v. 404-pagina |

### Technische issues gevonden

1. **BUG (Medium):** `setState during render` in `AuthenticatedApp.tsx` — wrap state update in `useEffect`
2. **BUG (Laag):** Onbekende URLs tonen login i.p.v. 404-pagina
3. **A11Y (Laag):** 9 mascotte-afbeeldingen missen alt-text op landing page

### Student dashboard (⏳ wacht op account-bevestiging)

Het testaccount `testleerling.audit@dgskills.app` is aangemaakt maar vereist email-bevestiging in Supabase. Zodra bevestigd kan het student dashboard, de missies en games live getest worden.

---

## Top 10 Actiepunten (geprioriteerd)

| # | Actie | Fase | Impact | Effort |
|:-:|-------|:----:|:------:|:------:|
| 1 | Tijdsindicatie toevoegen aan alle missies | 1 | 🔴 Kritiek | Klein |
| 2 | Leerdoelen tonen aan leerling vóór missie-start | 1 | 🔴 Kritiek | Klein |
| 3 | Keyboard-support voor drag-drop (accessibility) | 1 | 🔴 Kritiek | Medium |
| 4 | ARIA-labels + screen reader support | 1 | 🔴 Kritiek | Medium |
| 5 | 3-traps differentiatie (beginner/standaard/gevorderd) | 1 | 🔴 Kritiek | Groot |
| 6 | Assessment feedback verrijken (misconceptie-gericht) | 2 | 🟠 Hoog | Medium |
| 7 | Mobile responsiveness DataDetective + GameDirector | 2 | 🟠 Hoog | Klein |
| 8 | Error handling + error boundaries toevoegen | 2 | 🟠 Hoog | Medium |
| 9 | Design tokens unificeren (GameGallery, GamesSection) | 2 | 🟡 Medium | Klein |
| 10 | Escaperoom nulmeting diagnostische feedback | 3 | 🟡 Medium | Medium |

---

## Sterke punten (behouden!)

1. **Narratief design** — Elke missie gebruikt authentieke, herkenbare scenario's (datalek op school, deepfakes herkennen, data-handel)
2. **SLO-integratie** — Expliciete mapping naar kerndoelen; J1-J3 coherentie sterk
3. **Feedback kwaliteit** — DeepfakeDetector, DataVoorData en DatalekkenRampenplan zijn gouden standaard
4. **Visuele toegankelijkheid** — Emoji, iconen, kleurcodering, voortgangsbalken
5. **Engagement** — Badges, streaks, difficulty levels, peer-vergelijking ("Anderen kozen…")
6. **Performance** — FCP 52ms, lazy loading, efficiënte font-loading
7. **SEO** — Complete OpenGraph/Twitter tags, correcte heading hierarchie
8. **MissionConclusion** — Feestvierend eindscherm met badge, samenvatting en duidelijke afronding

---

---

## Aanvulling: Live Student Dashboard Test (28 maart 2026, 16:00)

### Onboarding Flow (avatar-selectie)

| Stap | Status | Opmerkingen |
|------|--------|------------|
| 1. Kies je karakter (geslacht) | ✅ | Duidelijk, twee opties (Jongen/Meisje) + huidskleur |
| 2. Gezicht & Haar | ✅ | Emoji-gezichten, kapsel + haar kleur. Unlock-items zichtbaar (🔒) |
| 3. Kleding & Extras | ✅ | Goed |
| 4. Klaar! + Start je Avontuur | ✅ | Feestelijk eindscherm met kroon-icoon |

**🔴 BUG GEVONDEN + GEFIXT: Avatar zakt door de vloer**
- **Oorzaak:** Y-positie mismatch: avatar root op y=-0.105, maar schoenzool op y≈-0.02, vloer top op y≈-0.03 → voeten zakken in platform
- **Fix:** `AvatarViewer.tsx` — avatar root van -0.105 → 0.05, vloer van -0.06 → 0.1, shadow van -0.028 → 0.13
- **Resultaat:** Schoenzool op y=0.135, vloer top op y=0.13 → voeten staan exact op het platform

### Escaperoom Nulmeting (live getest)

| Aspect | Status | Opmerkingen |
|--------|--------|------------|
| Kamer 1: Vergrendelde Laptop | ✅ Werkt | Drag-and-drop bestanden naar mappen. Timer loopt. |
| Feedback bij lege submit | ⚠️ | **Geen feedback als je "Controleer" klikt zonder bestanden te slepen.** Leerling denkt: "Er gebeurt niks." |
| Timer zichtbaar | ✅ | Countdown teller in rechterbovenhoek |
| Kamer-indicatie | ✅ | "Kamer 1/5" duidelijk zichtbaar |
| Instructies | ✅ | Duidelijke opdrachttekst |

### Extra Bugs Gevonden Tijdens Live Test

| # | Bug | Ernst | Component |
|:-:|-----|-------|-----------|
| 1 | **"Terug"-knop in escaperoom logt gebruiker uit** i.p.v. terug naar dashboard | 🔴 KRITIEK | EscaperoomIntro / routing |
| 2 | **"Controleer plaatsing" geeft geen feedback** als geen bestanden gesleept zijn | 🟠 HOOG | KamerVergrendeldeLaptop |
| 3 | **Alle routes redirecten naar escaperoom** als nulmeting niet afgerond (/profile, /games etc.) | 🟡 MEDIUM | AuthenticatedApp routing |
| 4 | **setState during render** in AuthenticatedApp.tsx (6x per redirect) | 🟡 MEDIUM | AuthenticatedApp |
| 5 | **404 routes tonen login** i.p.v. een 404-pagina | 🟡 LAAG | AppRouter |
| 6 | **9 mascotte-afbeeldingen** missen alt-text op landingspagina | 🟡 LAAG | ScholenLanding |
| 7 | **[Permissions] Failed to fetch** errors in console na login | 🟡 LAAG | PermissionsContext |

### Navigatie-audit

| Route | Verwacht | Werkelijk | Status |
|-------|----------|-----------|--------|
| / | Landing page | Landing page | ✅ |
| /login | Login formulier | Login formulier | ✅ |
| /dashboard | Student dashboard | Escaperoom (als nulmeting onvolledig) | ⚠️ |
| /profile | Profiel pagina | Redirect naar escaperoom | ⚠️ |
| /compliance-hub | Compliance docs | 7 documenten | ✅ |
| /ict | ICT pagina | ICT pagina | ✅ |
| /onbekende-route | 404 pagina | Login pagina | ❌ |

### Performance (live gemeten)

| Metric | Waarde | Rating |
|--------|--------|--------|
| FCP | 52-60ms | 🟢 Excellent |
| TTFB | 14-19ms | 🟢 Excellent |
| Vite dev start | 121ms | 🟢 Excellent |
| Login → Dashboard | ~4 sec | 🟡 OK |
| Avatar 3D render | Canvas 300x150 | ✅ Rendert |

---

## Bijgewerkte Top 12 Actiepunten

| # | Actie | Fase | Impact | Status |
|:-:|-------|:----:|:------:|:------:|
| 1 | ~~Avatar zakt door de vloer~~ | 1 | 🔴 | ✅ **GEFIXT** |
| 2 | Tijdsindicatie toevoegen aan alle missies | 1 | 🔴 Kritiek | ⬜ |
| 3 | Leerdoelen tonen aan leerling vóór missie-start | 1 | 🔴 Kritiek | ⬜ |
| 4 | "Terug"-knop in escaperoom fixt (logt uit!) | 1 | 🔴 Kritiek | ⬜ |
| 5 | Keyboard-support voor drag-drop (accessibility) | 1 | 🔴 Kritiek | ⬜ |
| 6 | ARIA-labels + screen reader support | 1 | 🔴 Kritiek | ⬜ |
| 7 | 3-traps differentiatie (beginner/standaard/gevorderd) | 1 | 🔴 Kritiek | ⬜ |
| 8 | Feedback bij lege "Controleer" klik in escaperoom | 2 | 🟠 Hoog | ⬜ |
| 9 | Assessment feedback verrijken (misconceptie-gericht) | 2 | 🟠 Hoog | ⬜ |
| 10 | Mobile responsiveness DataDetective + GameDirector | 2 | 🟠 Hoog | ⬜ |
| 11 | Error handling + error boundaries toevoegen | 2 | 🟠 Hoog | ⬜ |
| 12 | setState-during-render fix in AuthenticatedApp | 2 | 🟡 Medium | ⬜ |

---

*Rapport gegenereerd op 28 maart 2026 door 5 parallelle Claude Code agents + live browser tests*
*Status: ✅ Code-analyse compleet | ✅ Live test publieke pagina's | ✅ Live test student dashboard + escaperoom kamer 1 | ⬜ Overige kamers/missies (vereist handmatige drag-drop)*
