# Mission-fixer rapport — cyclus 1

**Mission ID:** data-speurder
**Rapport-bron:** `business/dgskills-reviews/data-speurder-2026-06-17.md` (fix-pass op review van 17 juni; repo sindsdien ~2 weken doorontwikkeld)
**Whitelist:**
- `src/features/missions/templates/scenario-engine/configs/data-speurder.ts`
- `src/config/templateRegistry.ts` (alleen data-speurder entry)
- `src/config/agents/year1.tsx`, `year2.tsx`, `year3.tsx` (alleen agent-rol-entry)
- `src/config/slo-kerndoelen-mapping.ts` (alleen entry)
- `src/config/curriculum.ts` (alleen entry)
- `src/config/missionGoals.ts` (alleen entry)

## ✅ Toegepaste fixes (0)

Geen. Alle drie voorstellen uit het bronrapport zijn beoordeeld en NIET toegepast — zie onderstaande secties voor reden per voorstel.

## ⏭️ Geskipte voorstellen (0)

Geen skips op basis van scope-violation of stale-rapport — alle drie voorstellen zijn inhoudelijk beoordeeld als escalatie (zie hieronder), niet als technisch niet-toepasbaar.

## ⚠️ Escalatie nodig (3)

- **`learningObjectives` toevoegen** (`src/features/missions/templates/scenario-engine/configs/data-speurder.ts`, na regel 24, vóór `maxScore`) — Didactiek-sectie van het bronrapport, "autoFixable" gelabeld. Voorstel-tekst is nog steeds letterlijk toepasbaar (before-locatie bevestigd: bestand heeft geen `learningObjectives`-veld). **Niet toegepast** conform expliciete oriëntatie-context van deze fix-pass: dit voorstel werd bij de eerdere pass al geëscaleerd als SLO-content ("AI-voorstel gemaakt maar Yorin keurt") en blijft escalatie — inhoudelijke leerdoelformulering is een curriculaire/SLO-beslissing, geen mechanische config-fix.
- **Engine-contrastfix** (`src/features/missions/templates/scenario-engine/FeedbackBanner.tsx:76`, `text-white` op `bg-gradient-to-r from-duck-acid to-duck-acid`, WCAG-contrast ~1.3:1) — Design- en Tech-sectie van het bronrapport markeren dit al expliciet als "ESCALATIE vereist" / READ-ONLY voor de missie-fixer. Bestand zit **buiten whitelist** (gedeelde scenario-engine, raakt alle scenario-missies) — kan niet en mag niet door deze missie-specifieke fixer worden gewijzigd.
- **VSO-code 18B comment-suggestie** (`src/config/slo-kerndoelen-mapping.ts`, entry data-speurder) — Didactiek-sectie oppert een toelichtende code-comment bij de indirecte VSO-match (18B als dichtstbijzijnde code voor 21C, geen exacte VSO-tegenhanger voor "Data & Dataverwerking"). Rapport zegt zelf: "Geen code-wijziging noodzakelijk." Dit raakt de curriculaire/SLO-mapping-beslissing (autoritair bestand) — behandeld als escalatie-categorie, niet als mechanische fix.

## Volgende stap

Alle voorstellen uit het bronrapport zijn escalaties, geen daarvan is in deze cyclus toegepast. Er is geen her-review van M2 nodig aangezien er geen wijzigingen zijn gemaakt aan de missie-configuratie. Escaleer naar Yorin voor:
1. Besluit over `learningObjectives`-formulering (SLO-content, zie voorstel hierboven).
2. Engine-brede contrastfix in `FeedbackBanner.tsx` (raakt alle scenario-missies, niet alleen data-speurder).
3. Optionele VSO 18B-toelichtende comment in `slo-kerndoelen-mapping.ts` (low-priority, geen functionele impact).
