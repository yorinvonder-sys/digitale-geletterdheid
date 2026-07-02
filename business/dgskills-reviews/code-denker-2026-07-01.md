# Mission-fixer rapport — cyclus 1

**Mission ID:** code-denker
**Rapport-bron:** `business/dgskills-reviews/code-denker-2026-06-17.md` (fix-pass op rapport van 2026-06-17)
**Whitelist:**
- `src/features/missions/templates/scenario-engine/configs/code-denker.ts`
- `src/config/templateRegistry.ts` (alleen code-denker entry)
- `src/config/agents/year1.tsx`, `year2.tsx`, `year3.tsx` (alleen agent-rol entry)
- `src/config/slo-kerndoelen-mapping.ts` (alleen entry)
- `src/config/curriculum.ts` (alleen entry)
- `src/config/missionGoals.ts` (alleen entry)

## ✅ Toegepaste fixes (1)

- `src/config/missionGoals.ts:139` — `primaryGoal` van code-denker herschreven van "Ik herken programmeerlogica door stappen, voorwaarden en volgorde goed te lezen." naar "Ik herken de vier bouwstenen van computational thinking: decompositie, patroonherkenning, abstractie en algoritmen." (sectie: didactiek). Voorstel stond onder "AutoFix" met expliciet before/after-blok en verdict "fix-eerst — dan ship" (géén Yorin-escalatiemarkering). Before-snippet geverifieerd met Read vóór toepassen — nog letterlijk aanwezig, geen stale mismatch ondanks 2 weken doorontwikkeling sinds het rapport.

## ⏭️ Geskipte voorstellen (1)

- `src/features/missions/templates/scenario-engine/configs/code-denker.ts:28,34,40,46` — **n.v.t.-voorstel (geen machine-leesbaar before/after):** badge-kleur-aandachtspunt (alle 4 badges hebben identiek `color: '#202023'`). Rapport geeft geen eenduidige vervangkleur maar twee alternatieven ("`'#e1ff01'` (duck-acid) of `'#ff3c21'` (duck-error)") in prosa, zonder concreet before/after-codeblok. Status in rapport: "Aandachtspunt, geen blocker"; verdict was "ship" (niet fix-eerst). Geverifieerd dat de vier hex-literals nog exact `#202023` zijn — niet stale, maar te dubbelzinnig om autonoom een keuze in te maken tussen twee kleuren voor welke van de vier badges.

## ⚠️ Escalatie nodig (0)

Geen. Bronrapport bevestigt expliciet: "Geen escalaties noodzakelijk." Overige aandachtspunten (Bloom-balans criterium 7, Visual Precision Gate UNVERIFIED, tech-aandachtspunten maxScore/badge-drempel en selectie-check) zijn in het bronrapport gemarkeerd als "by-design", "Goed", of "aandachtspunt voor volgende iteratie" zonder concreet fix-voorstel — geen actie vereist.

## Volgende stap

Re-run M2 review (cyclus 2/3) om te bevestigen dat de missionGoal-fix de didactiek-score naar 9/9 brengt en dat de badge-kleur-vraag (indien gewenst) alsnog een concrete, eenduidige kleurkeuze per badge krijgt vanuit Yorin of een volgende reviewronde.
