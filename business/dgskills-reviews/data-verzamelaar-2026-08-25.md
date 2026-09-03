# Rubric-review: data-verzamelaar

**Datum:** 2026-08-25
**TemplateType:** agent-role (chatmissie zonder eigen full-screen component; eigen preview-component `DataVerzamelaarPreview.tsx`)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 6/10

De missie heeft een eigen, goed opgebouwde preview-component (`DataVerzamelaarPreview.tsx`) die correct de `duck-*` design tokens gebruikt. De agent-entry in `src/config/agents/year1.tsx` bevat echter drie punten die niet aansluiten bij die live-ervaring:

1. **Cijfers in de kaart-preview kloppen niet met de echte dataset.** De `visualPreview`-badges tonen "Bus: 28%", terwijl zowel de systeeminstructie-tabel als `DataVerzamelaarPreview.tsx` "Bus/tram: 18%" gebruiken. Een leerling die de missiekaart bekijkt vóór het starten ziet dus andere cijfers dan in de missie zelf.
2. **Legacy kleurtokens.** `visualPreview` gebruikt `from-lab-coral to-lab-teal` (legacy `lab-*`-systeem), terwijl de daadwerkelijke in-missie preview `from-duck-acid via-white to-duck-ink` gebruikt (het huidige DUCK-systeem, zie `CLAUDE.md`: "`lab-*` is legacy"). De kaart en de missie ogen daardoor inconsistent.
3. **Verkeerde briefing-afbeelding.** `briefingImage: '/assets/agents/social_safeguard.webp'` — dit is de afbeelding van een andere missie (social-safeguard, over online veiligheid), niet van data-verzamelaar. Er bestaat al een eigen asset (`/assets/previews/project_data_verzamelaar.webp`, gebruikt in `missionThumbnails.ts`) dat wél bij deze missie hoort.

## Didactiek — score 7.5/10

De kern van de missie is sterk: een realistische enquête-dataset, drie heldere onderzoeksstappen (verkennen → beperkingen ontdekken → onderbouwd advies), expliciete Socratische regels ("Geef NOOIT het antwoord direct"), en meetbare `STEP_COMPLETE`-criteria die één-op-één overeenkomen met de 3 stappen in de preview-stepper. Taalniveau (B1) en scenario (gemeente-advies over fietsenstallingen) zijn concreet en leeftijdspassend.

Eén punt dat niet aansluit: de voorgestelde chat-starters in `src/hooks/useAgentLogic.ts` ("Welke data verzamel ik zelf?", "Wat mag een bedrijf opslaan?", "Hoe werkt een cookie?") gaan over bedrijven/cookies — het onderwerp van missies als `data-detective` of `cookie-crusher` — niet over het analyseren van een schoolreizen-dataset waar deze missie daadwerkelijk over gaat. Een leerling die op zo'n starter klikt, krijgt een gesprek dat niet aansluit bij de opdracht op het scherm. Dit bestand valt buiten de mechanische whitelist van deze review (geen missie-eigen config-entry), dus alleen gemeld, niet auto-fixbaar hier.

## Tech — score 8.5/10

- `goalCriteria: { type: 'steps-complete', min: 3 }` sluit correct aan op de 3 stappen in `steps[]` en de 3 `STEP_COMPLETE`-markers in de systeeminstructie.
- SLO-koppeling, curriculum-plaatsing (J1P3) en basisvaardigheden-mapping zijn aanwezig en consistent met het datavaardigheden-thema (STATISTIEK, PRIVACY_RECHTEN).
- `missionGoals.ts`-entry (`component-complete`) is een lichte niet-blokkerende inconsistentie tegenover de `steps-complete`-criteria in de agent-entry zelf, maar dit patroon komt breder voor in dit bestand en is geen missie-specifiek defect.
- Geen gedeelde-engine-issues gevonden; dit is een pure chatmissie met eigen preview-component, geen `templateRegistry.ts`-entry nodig.

---

## Voorstellen

### 1. Cijfer-mismatch badge (design)

Bestand: `src/config/agents/year1.tsx` (entry `data-verzamelaar`, `visualPreview`)

```diff
-                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-[8px] text-white">Bus: 28%</span>
+                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-[8px] text-white">Bus: 18%</span>
```

### 2. Legacy kleurtokens → DUCK-tokens (design)

Bestand: `src/config/agents/year1.tsx` (entry `data-verzamelaar`, `visualPreview`)

```diff
-            <div className="w-full h-full bg-gradient-to-br from-lab-coral to-lab-teal flex items-center justify-center p-4 relative overflow-hidden">
+            <div className="w-full h-full bg-gradient-to-br from-duck-acid to-duck-ink flex items-center justify-center p-4 relative overflow-hidden">
```

### 3. Verkeerde briefing-afbeelding (design)

Bestand: `src/config/agents/year1.tsx` (entry `data-verzamelaar`, `briefingImage`)

```diff
-        briefingImage: '/assets/agents/social_safeguard.webp',
+        briefingImage: '/assets/previews/project_data_verzamelaar.webp',
```

### 4. Chat-starters horen niet bij deze missie (didactiek, buiten whitelist — alleen melding)

Bestand: `src/hooks/useAgentLogic.ts`, regel 232

```diff
-        'data-verzamelaar': ['Welke data verzamel ik zelf?', 'Wat mag een bedrijf opslaan?', 'Hoe werkt een cookie?'],
+        'data-verzamelaar': ['Wat valt je op aan de dataset?', 'Is deze data betrouwbaar?', 'Wat is mijn advies aan de gemeente?'],
```

---

## Samenvatting & verdict

De inhoudelijke kern van `data-verzamelaar` (systeeminstructie, stappen, criteria) is didactisch sterk en goed onderbouwd. De gevonden problemen zitten allemaal in randmateriaal dat niet aansluit bij de live missie-ervaring: een feitelijk foute cijferbadge, een legacy kleurstijl, een geleende afbeelding van een andere missie, en chat-starters over een ander onderwerp. Geen van de bevindingen is blokkerend voor leerlingen (de missie werkt functioneel), maar ze ondermijnen wel de geloofwaardigheid van "dit is een dataset waar je op kunt vertrouwen" — precies het thema van de missie zelf.

**Verdict: fix-eerst** (mechanisch oplosbaar via de drie voorstellen in `year1.tsx`; voorstel 4 vereist een edit buiten de whitelist en dus handmatige opvolging).
