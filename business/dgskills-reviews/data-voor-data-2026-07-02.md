# Missie-review: data-voor-data

**Datum:** 2026-07-02
**Wave:** 18 (verse review)
**Levering:** DEDICATED component (geen template-config)
**Component:** `src/features/missions/DataVoorDataMission.tsx`
**Service:** `src/services/dataVoorDataService.ts`

## Registratie-check (compleet)

Alle verplichte registratiepunten bestaan en zijn consistent:
- `RoleId`-union (`src/types.ts:27`)
- `AGENT_ROLE_IDS` (`src/config/agentRoleIds.ts:34`)
- Agent-rol / briefing (`src/config/agents/year1.tsx:2905-2937`)
- SLO-mapping (`src/config/slo-kerndoelen-mapping.ts:77`) — `sloKerndoelen: ['23A','23C']`, `sloVsoKerndoelen: ['20A','20B']`
- Curriculumplaatsing (`src/config/curriculum.ts:120`) — jaar 1, week 3
- `missionGoals.ts:289` — component-complete criteria, geen score-threshold (component regelt zelf voltooiing)
- `basisvaardigheden-mapping.ts:277-283` — ETHIEK, PRIVACY_RECHTEN
- `missionThumbnails.ts:36` — thumbnail `/assets/previews/project_data_voor_data.webp`
- Routing compleet in `src/app/AuthenticatedApp.tsx:761-771` (module-render + completion-callback)
- `src/utils/missionBuilder.tsx:64` — dashboard-infotekst aanwezig

Vermeld in `docs/audits/student-missions-ui-ux-review-2026-06-30.md:122` bij de **beste missies (gem. ≥4.0)** — hoogste engagement-groep, geen missie-specifieke kritieke bevinding in dat rapport. Geen `.ui-review/`-screenshots-map voor deze missie beschikbaar in de repo — geen aanvullende visuele referentiedata voor deze review.

## Dedicated-component rekencheck (verplicht)

**Scoring-logica** (`getScore()`, regel 161-171) nagerekend tegen alle 2⁵=32 keuzecombinaties:
- Max haalbaar: **100/100**, alleen bereikbaar via `deal` op ronde 1 (low risk, +10) + `no-deal` op ronde 2-5 (medium/high/extreme, +15+25+25+25=90) → totaal 100.
- Volledig consistent-privacybewuste leerling (5× `no-deal`, de meest voor-de-hand-liggende "beste" strategie): score = 0+15+25+25+25 = **90/100**. Haalt nog steeds de hoogste badge (≥80 = "Privacy Kampioen"), dus geen showstopper — zie wel D1.
- Min haalbaar: **0/100** (5× `deal`, clampt via `Math.max(0, ...)` op ronde 4-5 se -10-boetes).
- Badge-drempels (`getBadge()`, regel 173-178): ≥80 Privacy Kampioen, ≥50 Data Diplomaat, <50 Data Verkoper — intern consistent met het bereikbare bereik [0,100].

**Completion-bereikbaarheid:** `nextRound()` (regel 149-159) forceert na ronde-index 2 (3de ronde) een verplichte reflectiefase, daarna vervolgt de veiling tot alle 5 rondes gespeeld zijn → `phase: 'results'`. Geen dead-end states gevonden; `useMissionAutoSave` bewaart `phase`/`currentRound`/`choices` correct voor hervatting.

**Inhoudelijke feiten (thema: data als betaalmiddel/datahandel):** de 5 rondes (muziekstreaming/luistergeschiedenis, game-account/chatberichten, iPhone/locatie+foto's+contacten, €500/maand/BSN+medisch+biometrisch, schoolcijfers/camera+dossier) zijn realistisch geëscaleerd en didactisch plausibel — geen feitelijke onjuistheden gevonden in de `explanation`-teksten.

**Server/client-prompt-drift (bekend platformpatroon, niet auto-fixable):** de server-side `systemInstruction` in `supabase/functions/_shared/systemInstructions.ts:39` beschrijft een **ander spel** dan het gebouwde component: 8 rondes i.p.v. 5, fictieve i.p.v. echte anonieme percentages, en 4 privacy-profielen i.p.v. 3 badges. Aangezien dit component **dedicated** is (geen `enableChat`-koppeling naar de chat-flow gevonden in `AuthenticatedApp.tsx`/`missionBuilder.tsx`), heeft deze specifieke drift vermoedelijk geen runtime-impact — het component rendert zijn eigen UI en roept de chat-AI niet aan voor het spelverloop. Genoteerd als bekend platformpatroon, geen missie-specifieke fix.

## Bevindingen

### D1 — Basisvaardigheden-claim "dataminimalisatie en recht op vergetelheid" wordt inhoudelijk niet gedekt (Didactiek)

`basisvaardigheden-mapping.ts:281` claimt: *"Leerling leert over dataminimalisatie en het recht op vergetelheid."* (PRIVACY_RECHTEN-tag). De volledige content van het component — 5 rondes, alle `explanation`-teksten, de reflectiefase, het eindscherm ("De les") — bevat geen enkele verwijzing naar dataminimalisatie of het recht op vergetelheid. De missie behandelt overtuigend de **ruil-afweging** (data voor voordeel) en risico-inschatting, maar niet deze twee specifieke AVG-rechten/-principes. Dit is een mismatch tussen het geclaimde leerdoel (dat docenten en rapportages zien) en wat de leerling daadwerkelijk ervaart.

**Voorstel:** Voeg een korte zin toe aan het eindscherm ("De les"-kaart, regel 374-377) die dataminimalisatie expliciet benoemt, zodat de claim wél gedekt wordt zonder de spelmechaniek te wijzigen.

```tsx
// src/features/missions/DataVoorDataMission.tsx — regel 374-377
// Voor:
<div className="bg-white rounded-2xl p-4 text-left border border-duck-gray">
    <p className="text-xs font-bold text-duck-ink/60 mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>De les:</p>
    <p className="text-xs text-duck-ink/60" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>"Gratis" bestaat niet op internet. Je betaalt altijd met je data. Hoe meer je deelt, hoe meer macht je weggeeft. Kies bewust!</p>
</div>

// Na (voorstel):
<div className="bg-white rounded-2xl p-4 text-left border border-duck-gray">
    <p className="text-xs font-bold text-duck-ink/60 mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>De les:</p>
    <p className="text-xs text-duck-ink/60" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>"Gratis" bestaat niet op internet. Je betaalt altijd met je data. Hoe meer je deelt, hoe meer macht je weggeeft. Kies bewust: deel alleen wat een dienst écht nodig heeft (dataminimalisatie), en weet dat je bij veel diensten mag vragen om je data te laten verwijderen (recht op vergetelheid).</p>
</div>
```

### D2 — Maximale score is alleen bereikbaar via een DEAL op ronde 1, wat de kernboodschap subtiel tegenspreekt (Didactiek, minor)

Narekening van `getScore()` toont dat 100/100 uitsluitend haalbaar is met `deal` op ronde 1 (low risk, +10 punten) gevolgd door `no-deal` op alle overige rondes. Een leerling die de kernboodschap ("kies bewust, deel zo min mogelijk") maximaal consequent toepast en alle 5 rondes `no-deal` kiest, haalt 90/100 — één punt onder wat met een strategische DEAL bereikbaar is. Dit is geen bug (beide scores halen de hoogste badge) en de score-mechaniek an sich is legitiem (bewust een lage-risico-deal aangaan is óók een valide "bewuste keuze"), maar het is de moeite waard te weten dat "altijd NO DEAL" niet de wiskundig optimale strategie is — een subtiele spanning met de expliciete boodschap. Puur signalerend; geen wijziging voorgesteld gezien de badge-uitkomst niet verandert.

## Samenvatting

`data-voor-data` is een van de sterkst scorende missies in het platform (UI/UX-review: engagement ≥4.0) en verdient die positie op techniek en spelontwerp: k-anonimiteit correct geïmplementeerd in de RLS-migratie (klas pas vanaf 5, school pas vanaf 10 antwoorden), `processing_restricted`-opt-out gerespecteerd, volledige en consistente registratie over alle 9 bronbestanden, en een goed opgebouwde escalatie in privacyrisico met een ingebouwde reflectiepauze. De enige reële zwakte is een didactische mismatch tussen een geclaimd leerdoel (dataminimalisatie/recht op vergetelheid) en de daadwerkelijke content, die dat leerdoel niet expliciet raakt (D1). D2 is een minor observatie zonder actie-impact.

## Rubric-scores (0-10, 10=uitstekend)

- **Design: 8/10** — consistente duck-tokens, duidelijke risk-color-coding, progress-indicator, focus-rings aanwezig; geen missie-specifieke visuele gebreken gevonden bovenop de bekende platformbrede shared-shell-issues.
- **Didactiek: 6.5/10** — sterk, invoelbaar spelconcept met correcte escalatie en reflectiemoment, maar de basisvaardigheden-claim over dataminimalisatie/recht op vergetelheid wordt niet inhoudelijk gedekt (D1); D2 is een kleine mechanische spanning zonder praktische impact.
- **Techniek: 8.5/10** — RLS/k-anonimiteit aantoonbaar correct, SECURITY DEFINER met `search_path`-pin, input-validatie en REVOKE/GRANT op orde, volledige registratie, correcte autoSave-integratie met graceful save-failure-fallback.

**triageScore = (10-8)×0.3 + (10-6.5)×0.4 + (10-8.5)×0.3 = 2.45**
