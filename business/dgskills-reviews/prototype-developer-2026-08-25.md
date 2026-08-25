# Rubric-review: prototype-developer

**Datum:** 2026-08-25
**templateType:** builder-canvas

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 6.5/10

- **[warning]** De engine gebruikt door de hele stap-UI (`StepInstructionPanel.tsx`, `ChecklistItem.tsx`) `/70`-opacity op inkttekst voor zowel getypte leerlingtekst als placeholder, en voor afgevinkte én niet-afgevinkte checklist-labels — geen missie-specifieke oorzaak, maar deze missie heeft 4 stappen × textarea + 4 checklistitems die dit patroon volledig raken.
- **[warning]** De mijlpaal-toast blijft na snel herladen (<2s) vast in beeld staan (state-persistentie-bug in de engine); raakt deze missie bij elke stapovergang.
- **[info]** `introEmoji`/badge-iconen zijn consistent met andere builder-canvas-missies; geen missie-specifiek designprobleem gevonden buiten de gedeelde engine-issues.

## Didactiek — score 7.5/10

- **[warning]** Scoring is presence-based (engine-bevinding): een leerling die alle checklistvinkjes zet en per stap één plausibele zin van 40 tekens typt haalt de volle 100 punten zonder dat de inhoud (bijv. "hoofdschermen", "technische bouwblokken", "bug + oplossing") daadwerkelijk klopt. Voor een missie die de complete build-test-itereer-cyclus wil toetsen is dat een reëel risico: de checklist-items ("Minimaal 1 probleem of bug is beschreven met oplossing", "Twee anonieme Tester A/B-observaties zijn genoteerd") zijn zelfrapportage, niet gevalideerd.
- **[info]** Privacybewuste instructies zijn al goed verwerkt: expliciet "toestemming", "anonieme Tester A/B-observaties", verbod op namen/contactgegevens/foto's/stemopnames — dit is precies het patroon dat andere missies met externe testpersonen zouden moeten volgen.
- **[info]** De opbouw (scope → ontwerp → bouw → test) is didactisch logisch en sluit aan bij een reële software-cyclus; `missionGoals.ts`-entry (min. 4 stappen, 2 testgebruikers) is consistent met de config.
- **[info]** Alleen stap 1 heeft een `evidence`-veld; stappen 2–4 leunen volledig op tekst + checklist. Dat is in lijn met het generieke engine-patroon (evidence optioneel), geen afwijking.

## Tech — score 8/10

- **[blocking, gedeeld met engine]** De afrondknop-dubbelklik-bug (`CompletionScreen.tsx`/`BuilderCanvas.handleComplete`) geldt onverkort voor deze missie — geen missie-specifieke mitigatie aanwezig of nodig, het is een engine-fix.
- **[info]** `templateRegistry.ts`, `slo-kerndoelen-mapping.ts` (yearGroup 3, week 4, kerndoelen 22A/22B), `curriculum.ts` en `missionGoals.ts` zijn onderling consistent voor `prototype-developer`; `enableChat: true` + `chatRoleId: 'prototype-developer'` matcht in config en registry.
- **[info]** `maxScore: 100` en de 4 stappen tellen op zoals verwacht van de engine (elke stap draagt gelijk bij, badges lopen 0/25/50/70/90 — consistent monotone drempels).
- Geen missie-specifieke technische fouten gevonden buiten wat al op engineniveau is vastgesteld.

## Voorstellen

Geen mechanische, missie-specifieke autoFixable wijzigingen gevonden binnen de whitelist (config/registry/SLO/curriculum/goals) — de bevindingen zitten in de gedeelde engine (`BuilderCanvas.tsx`, `CompletionScreen.tsx`, `StepInstructionPanel.tsx`, `MilestoneToast.tsx`, `ChecklistItem.tsx`), niet in de missie-eigen bestanden.

Eén niet-mechanische didactische suggestie (buiten autoFix-scope, ter overweging voor Yorin): overweeg voor `bouwen` en `testen-itereren` een striktere `isMeaningfulAnswer`-toets of een verplicht evidence-veld, zodat "1 bug + oplossing" en "2 testobservaties" niet met generieke tekst kunnen worden afgevinkt. Dit is een engine-brede aanpassing, geen config-only fix.

## Samenvatting

De missie zelf (config + wiring) is degelijk: privacybewuste instructies, consistente SLO/curriculum/registry-koppeling, logische scope→ontwerp→bouw→test-opbouw. De belangrijkste risico's — dubbele afrondklik, presence-based scoring, contrast-issues, blijvende mijlpaal-toast — zitten allemaal in de gedeelde builder-canvas-engine en zijn al vastgesteld; deze missie erft ze zonder eigen verzwarende factor. Geen missie-specifieke blocking issues gevonden.

**Verdict: ok** (geen missie-specifieke blockers; engine-blockers staan al genoteerd op engineniveau)
